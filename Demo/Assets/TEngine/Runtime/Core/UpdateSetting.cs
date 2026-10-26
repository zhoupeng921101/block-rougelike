using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

namespace TEngine
{
    /// <summary>
    /// 强制更新类型。
    /// </summary>
    public enum UpdateStyle
    {
        /// <summary>
        /// 强制更新(不更新无法进入游戏。)
        /// </summary>
        Force = 1,

        /// <summary>
        /// 非强制(不更新可以进入游戏。)
        /// </summary>
        Optional = 2,
    }

    /// <summary>
    /// 是否提示更新。
    /// </summary>
    public enum UpdateNotice
    {
        /// <summary>
        /// 更新存在提示。
        /// </summary>
        Notice = 1,

        /// <summary>
        /// 更新非提示。
        /// </summary>
        NoNotice = 2,
    }
    /// <summary>
    /// WebGL平台下，
    /// StreamingAssets：跳过远程下载资源直接访问StreamingAssets
    /// Remote：访问远程资源
    /// </summary>
    public enum LoadResWayWebGL
    {
        Remote,
        StreamingAssets,
    }
    
    [CreateAssetMenu(menuName = "TEngine/UpdateSetting", fileName = "UpdateSetting")]
    public class UpdateSetting : ScriptableObject
    {
        /// <summary>
        /// 项目名称。
        /// </summary>
        [SerializeField]
        private string projectName = "Demo";

        /// <summary>项目名，资源下载路径中的一段（<c>{ResDownLoadPath}/{项目名}/{平台名}</c>，见 <see cref="GetResDownLoadPath"/>）。</summary>
        /// <remarks>打包工具拼远程部署目录时按同一规则取用，使「部署到哪」与「客户端从哪读」同源。</remarks>
        public string ProjectName => projectName;

        public bool Enable
        {
            get
            {
#if ENABLE_HYBRIDCLR
                return true;
#else
                return false;
#endif
            }
        }

        /// <summary>
        /// 热更程序集列表(手工维护)。项须带 .dll 后缀,同步进 HybridCLRSettings 时才截掉。
        /// </summary>
        /// <remarks>
        /// 配错在编辑器下全程无症状:编辑器分支从 AppDomain 直接取已编译的程序集,不走
        /// <see cref="AssemblyTextAssetPath"/> 下的 .bytes 加载(见 ProcedureLoadAssembly),
        /// 漏项与错名都要等真机出包才显形,表现是启动中断。
        /// 登记义务与分层归属见 <c>.claude/references/tengine/hotfix-workflow.md</c>。
        /// </remarks>
        [Header("Auto sync with [HybridCLRGlobalSettings]")]
        public List<string> HotUpdateAssemblies = new List<string>() {"GameConfig.dll", "GameLogic.dll" };

        /// <summary>
        /// 需补充元数据的 AOT 程序集(手工维护)。
        /// </summary>
        /// <remarks>
        /// 准入判据:热更代码实例化了「该程序集内定义的泛型」才加。仅把它的类型当外部泛型的类型参数
        /// (如 GetComponent&lt;T&gt; 里的 T)不算,那种情况要补的是泛型定义方所在的程序集。
        /// 判定不靠人推:AOTGenericReferences.PatchedAOTAssemblyList 是 HybridCLR 扫描热更代码后的
        /// 机器判定结果,本列表须覆盖它;漏加不会静默出事,BuildDLLCommand 的
        /// ValidateAOTMetaAssembliesCoverage 在构建期拦下。
        /// 加一项的配套义务见 DragonBonesAotKeepAlive 的 remarks:热更侧须存在对该程序集的真实引用,
        /// 否则 il2cpp 整体裁掉它,构建产不出补充元数据 dll,真机启动时加载失败。
        /// </remarks>
        [Header("Need manual setting!")]
        public List<string> AOTMetaAssemblies = new List<string>() { "mscorlib.dll", "System.dll", "System.Core.dll", "TEngine.Runtime.dll" ,"UniTask.dll", "YooAsset.dll"};

        /// <summary>
        /// Dll of main business logic assembly
        /// </summary>
        public string LogicMainDllName = "GameLogic.dll";

        /// <summary>
        /// 程序集文本资产打包Asset后缀名
        /// </summary>
        public string AssemblyTextAssetExtension = ".bytes";

        /// <summary>
        /// 程序集文本资产资源目录
        /// </summary>
        public string AssemblyTextAssetPath = "AssetRaw/DLL";

        /// <summary>
        /// 热更资源侧指纹载体的资源名(不含 <c>.bytes</c>)。
        /// </summary>
        /// <remarks>
        /// 落 <see cref="AssemblyTextAssetPath"/> 目录,该目录整个被 AB 收集器以 CollectAll +
        /// AddressByFileName 收走,故定位地址就是本常量。定在 runtime 侧是因为写入方(Editor 的
        /// BuildDLLCommand)与读取方(Launcher 的 ProcedureLoadAssembly)分属两个程序集,而后者引用不到前者。
        /// </remarks>
        public const string AotFingerprintAssetName = "AOTFingerprint";

        /// <summary>
        /// Player 侧指纹载体的 Resources 名(TextAsset,内容即本包 AOT 指纹)。
        /// </summary>
        /// <remarks>
        /// 由出包管线在 BuildPlayer 前生成、构建后删除,不入库,工作区里平时没有它属正常;包里没有它 = 这个
        /// Player 不是出包管线出的,<c>ProcedureLoadAssembly</c> 跳过同源校验只告警。生成与删除见
        /// <c>BuildDLLCommand.WriteAotFingerprintForPlayer</c>;定在 runtime 侧的理由同 <see cref="AotFingerprintAssetName"/>。
        /// </remarks>
        public const string PlayerAotFingerprintResourceName = "PlayerAOTFingerprint";

        [Header("更新设置")]
        public UpdateStyle UpdateStyle = UpdateStyle.Force;

        public UpdateNotice UpdateNotice = UpdateNotice.Notice;

        /// <summary>
        /// 资源服务器地址。
        /// </summary>
        [SerializeField]
        private string ResDownLoadPath = "http://127.0.0.1:8081";

        /// <summary>
        /// 资源服务备用地址。
        /// </summary>
        [SerializeField]
        private string FallbackResDownLoadPath = "http://127.0.0.1:8082";

        /// <summary>
        /// WebGL平台加载本地资源/加载远程资源。
        /// </summary>
        [Header("WebGL设置")]
        [SerializeField]
        private LoadResWayWebGL LoadResWayWebGL = LoadResWayWebGL.Remote;
        /// <summary>
        /// 是否自动你讲打包资源复制到打包后的StreamingAssets地址
        /// </summary>
        [Header("构建资源设置")]
        [SerializeField]
        private bool isAutoAssetCopeToBuildAddress = false;
        /// <summary>
        /// 打包程序资源地址
        /// </summary>
        [SerializeField]
        private string BuildAddress = "../../Builds/Unity_Data/StreamingAssets";
        /// <summary>
        /// 是否使用可寻址资源代替资源路径
        /// 说明：开启此项可以节省运行时清单占用的内存！
        /// </summary>
        [SerializeField, Tooltip("是否使用可寻址资源代替资源路径 说明：开启此项可以节省运行时清单占用的内存！")]
        private bool ReplaceAssetPathWithAddress = false;
        /// <summary>
        /// 是否自动你讲打包资源复制到打包后的StreamingAssets地址
        /// </summary>
        /// <returns></returns>
        public bool IsAutoAssetCopeToBuildAddress()
        {
            return isAutoAssetCopeToBuildAddress;
        }
        /// <summary>
        /// 获取打包程序资源地址
        /// </summary>
        /// <returns></returns>
        public string GetBuildAddress()
        {
            return BuildAddress;
        }

        /// <summary>
        /// 获取是否使用可寻址资源代替资源路径
        /// </summary>
        /// <returns></returns>
        public bool GetReplaceAssetPathWithAddress()
            => ReplaceAssetPathWithAddress;
        
        /// <summary>
        /// 是否加载远程资源
        /// </summary>
        /// <returns></returns>
        public LoadResWayWebGL GetLoadResWayWebGL()
        {
            return LoadResWayWebGL;
        }
        /// <summary>
        /// 获取资源下载路径。
        /// </summary>
        public string GetResDownLoadPath()
        {
            return Path.Combine(ResDownLoadPath, projectName, GetPlatformName()).Replace("\\", "/");
        }

        /// <summary>
        /// 获取备用资源下载路径。
        /// </summary>
        public string GetFallbackResDownLoadPath()
        {
            return Path.Combine(FallbackResDownLoadPath, projectName, GetPlatformName()).Replace("\\", "/");
        }

        /// <summary>
        /// 获取当前的平台名称。
        /// </summary>
        /// <returns>平台名称。</returns>
        public static string GetPlatformName()
        {
#if UNITY_ANDROID
        return "Android";
#elif UNITY_IOS
        return "IOS";
#elif UNITY_WEBGL
        return "WebGL";
#else
            switch (Application.platform)
            {
                case RuntimePlatform.WindowsEditor:
                    return "Windows64";
                case RuntimePlatform.WindowsPlayer:
                    return "Windows64";

                case RuntimePlatform.OSXEditor:
                case RuntimePlatform.OSXPlayer:
                    return "MacOS";

                case RuntimePlatform.IPhonePlayer:
                    return "IOS";

                case RuntimePlatform.Android:
                    return "Android";
                case RuntimePlatform.WebGLPlayer:
                    return "WebGL";

                case RuntimePlatform.PS5:
                    return "PS5";
                default:
                    throw new NotSupportedException($"Platform '{Application.platform.ToString()}' is not supported.");
            }
#endif
        }
    }
}