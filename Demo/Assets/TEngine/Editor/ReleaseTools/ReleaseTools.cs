using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEngine;
using YooAsset;
using YooAsset.Editor;
using BuildResult = UnityEditor.Build.Reporting.BuildResult;

namespace TEngine
{
    /// <summary>
    /// 打包工具类。
    /// <remarks>通过CommandLineReader可以不前台开启Unity实现静默打包以及CLI工作流，详见CommandLineReader.cs example1</remarks>
    /// </summary>
    public static class ReleaseTools
    {
        #region CLI 入口

        public static void BuildDll()
        {
            string platform = CommandLineReader.GetCustomArgument("platform");
            if (string.IsNullOrEmpty(platform))
            {
                Debug.LogError($"Build Asset Bundle Error！platform is null");
                return;
            }

            BuildTarget target = GetBuildTarget(platform);

            // BuildDLLCommand.BuildAndCopyDlls(target);
        }

        public static void BuildAssetBundle()
        {
            string outputRoot = CommandLineReader.GetCustomArgument("outputRoot");
            if (string.IsNullOrEmpty(outputRoot))
            {
                Debug.LogError($"Build Asset Bundle Error！outputRoot is null");
                return;
            }

            string packageVersion = CommandLineReader.GetCustomArgument("packageVersion");
            if (string.IsNullOrEmpty(packageVersion))
            {
                Debug.LogError($"Build Asset Bundle Error！packageVersion is null");
                return;
            }

            string platform = CommandLineReader.GetCustomArgument("platform");
            if (string.IsNullOrEmpty(platform))
            {
                Debug.LogError($"Build Asset Bundle Error！platform is null");
                return;
            }

            // 抛异常而非只打日志:batchmode 下 executeMethod 抛出才会以非零码退出,CI 不会把被拦当成出包成功。
            if (!ScriptDomainGate.TryPass(out string gateError))
            {
                throw new Exception(gateError);
            }

            BuildTarget target = GetBuildTarget(platform);
            BuildInternal(target, outputRoot);
            Debug.LogWarning($"Start BuildPackage BuildTarget:{target} outputPath:{outputRoot}");
        }

        #endregion

        #region MenuItem 入口（兼容原有菜单）

        [MenuItem("TEngine/Build/一键打包AssetBundle _F8")]
        public static void BuildCurrentPlatformAB()
        {
            var config = BuildConfig.CreateDefault();
            config.BuildHotFixDll = true;
            BuildFromMenu(config, buildPlayer: false);
        }

        [MenuItem("TEngine/Build/一键打包Window", false, 30)]
        public static void AutomationBuild()
        {
            var config = BuildConfig.CreateDefault();
            config.BuildTarget = BuildTarget.StandaloneWindows64;
            config.OutputRoot = Application.dataPath + "/../Builds/Windows";
            config.BuildPlayer = true;
            config.PlayerPlatform = BuildTarget.StandaloneWindows64;
            config.PlayerOutputPath = $"{Application.dataPath}/../Build/Windows/Release_Windows.exe";
            BuildFromMenu(config, buildPlayer: true);
        }

        [MenuItem("TEngine/Build/一键打包Android", false, 30)]
        public static void AutomationBuildAndroid()
        {
            var config = BuildConfig.CreateDefault();
            config.BuildTarget = BuildTarget.Android;
            config.OutputRoot = Application.dataPath + "/../Bundles";
            config.BuildPlayer = true;
            config.PlayerPlatform = BuildTarget.Android;
            config.PlayerOutputPath = $"{Application.dataPath}/../Build/Android/{BuildConfig.GetBuildTimeStamp()}Android.apk";
            BuildFromMenu(config, buildPlayer: true);
        }

        [MenuItem("TEngine/Build/一键打包IOS", false, 30)]
        public static void AutomationBuildIOS()
        {
            var config = BuildConfig.CreateDefault();
            config.BuildTarget = BuildTarget.iOS;
            config.OutputRoot = Application.dataPath + "/../Bundles";
            config.BuildPlayer = true;
            config.PlayerPlatform = BuildTarget.iOS;
            config.PlayerOutputPath = $"{Application.dataPath}/../Build/IOS/XCode_Project";
            BuildFromMenu(config, buildPlayer: true);
        }

        /// <summary>
        /// 菜单入口的构建收尾：取一个磁盘未占用的版本号，构建成功后把该号落定回 json。
        /// </summary>
        /// <remarks>
        /// 不落定则 <see cref="PackageVersionStore.PeekNext"/> 下次仍给同一个号，撞已存在的输出目录、构建失败（ErrorCode115）。
        /// </remarks>
        private static void BuildFromMenu(BuildConfig config, bool buildPlayer)
        {
            config.PackageVersion = ResolveAvailablePackageVersion(config);
            string version = config.PackageVersion;
            BuildWithConfig(config, buildPlayer, ok =>
            {
                if (ok && PackageVersionStore.Commit(version))
                {
                    Debug.Log($"[ReleaseTools] 资源版本号已落定: {version}");
                }
            });
        }

        #endregion

        #region 参数化构建入口

        /// <summary>
        /// 通过 BuildConfig 执行完整构建流程：编译热更 DLL → 构建 AB →〔可选〕构建 Player。
        /// </summary>
        /// <param name="config">构建参数；<see cref="BuildConfig.PackageVersion"/> 决定 AB 产物目录，同名目录会被重建。</param>
        /// <param name="buildPlayer">是否在 AB 之后接着构建 Player；<see cref="BuildConfig.BuildPlayer"/> 为 true 时同样构建。</param>
        /// <param name="onComplete">完成回调，参数为整体是否成功。构建 Player 时本方法会提前返回、回调在编译结束后才触发，
        /// 调用方的收尾动作（落定版本号、写日志、提示用户）必须放进回调,不能写在本方法调用之后。</param>
        /// <remarks>
        /// 副作用：重写 <c>Assets/StreamingAssets</c> 下的首包内容、覆写 AB 输出目录、拷贝热更 DLL 到 <c>AssetRaw/DLL</c>。
        /// 不落定资源版本号——号由调用方在 <paramref name="onComplete"/> 成功分支上经 <see cref="PackageVersionStore.Commit"/> 写盘。
        /// </remarks>
        public static void BuildWithConfig(BuildConfig config, bool buildPlayer, Action<bool> onComplete = null)
        {
            // 前置闸:整条链(热更 DLL、AOT 补充元数据、AB、Player)全按编辑器激活平台走,平台不对就地中止,
            // 不让流程带着旧平台宏编译出来的编辑器域往下跑。判据与后果见 EnsureActiveBuildTarget。
            if (!EnsureActiveBuildTarget(config.BuildTarget, nameof(BuildWithConfig)))
            {
                onComplete?.Invoke(false);
                return;
            }

            // 打 AB 的收口处还会再判一次;这里提前判,免得先花几分钟编完热更 DLL 才被拦。
            if (!ScriptDomainGate.TryPass(out string gateError))
            {
                Debug.LogError(gateError);
                onComplete?.Invoke(false);
                return;
            }

            // 前置校验:WebGL + Remote 下,StreamingAssets 若没有任何内置目录会导致运行时资源初始化必失败
            // (读不到 BuildinCatalog,卡在最开头、走不到 CDN)。以下两种组合会造成"内置目录为空",构建期直接中止:
            //   1. 内置文件拷贝=None —— 什么都不拷。
            //   2. 内置文件拷贝=ByTags 但『首包保留 Tag』为空 —— 没有 Tag 命中,等同什么都不拷。
            if (config.BuildTarget == BuildTarget.WebGL
                && Settings.UpdateSetting.GetLoadResWayWebGL() == LoadResWayWebGL.Remote)
            {
                bool noneCopy = config.BuildinFileCopyOption == EBuildinFileCopyOption.None;
                bool byTags = config.BuildinFileCopyOption == EBuildinFileCopyOption.ClearAndCopyByTags
                              || config.BuildinFileCopyOption == EBuildinFileCopyOption.OnlyCopyByTags;
                bool byTagsEmpty = byTags && string.IsNullOrWhiteSpace(config.BuildinFileCopyParams);
                if (noneCopy || byTagsEmpty)
                {
                    string err = noneCopy
                        ? "WebGL + Remote 模式下『内置文件拷贝』不能为 None:StreamingAssets 将缺少 BuildinCatalog," +
                          "Player 运行时资源初始化必失败、下载不到资源。请改用 ClearAndCopyAll,或用 ClearAndCopyByTags 并填『首包保留 Tag』。"
                        : "WebGL + Remote 模式下选择了 ByTags 拷贝,但『首包保留 Tag』为空:不会有任何 bundle 进 StreamingAssets," +
                          "等同 None、运行时必失败。请填写要留在首包的 Tag(如 buildin)。";
                    Debug.LogError($"[BuildWithConfig] {err}");
                    throw new Exception(err);
                }

                // 文件名风格校验:BundleName(无哈希)会给每个 bundle 固定 URL,内容变了名字不变。
                // CDN 按 URL 缓存,重新部署后清单(带版本号、URL 每版不同)已刷新为新 CRC,而稳定名 bundle
                // 仍被 CDN 命中旧缓存 → 下到的字节 CRC 与清单对不上,YooAsset 判损坏拒载(CRC Mismatch)。
                // HashName / BundleName_HashName 把内容哈希编进文件名,内容一变 URL 就变,CDN 无从用旧缓存冒充。
                if (config.FileNameStyle == EFileNameStyle.BundleName)
                {
                    string err = "WebGL + Remote 模式下『文件名风格』不能用 BundleName(无哈希):bundle URL 固定不变," +
                                 "重新部署时 CDN 会用旧缓存冒充新文件,导致 CRC Mismatch、资源加载失败。" +
                                 "请改用 BundleName_HashName 或 HashName(文件名带内容哈希,内容变则 URL 变)。";
                    Debug.LogError($"[BuildWithConfig] {err}");
                    throw new Exception(err);
                }
            }

            bool willBuildPlayer = buildPlayer || config.BuildPlayer;

            // 1. [可选] 编译热更DLL
            if (config.BuildHotFixDll)
            {
                // 热更 DLL 与 AOT 补充元数据都按编辑器当前激活平台取;平台已由方法开头的闸保证与
                // config.BuildTarget 一致,此处不再切换。
                if (willBuildPlayer)
                {
                    // 生成链内部要构建一次 Player 取裁剪 AOT dll,编译或导入未停时 Unity 会拒绝,
                    // 且该失败只体现在 BuildSummary 上、不抛异常。在此拦住,不让流程带着旧 dll 往下走。
                    if (IsBusyForPlayerBuild())
                    {
                        Debug.LogError("[BuildWithConfig] 脚本编译或资源导入进行中,无法生成 HybridCLR 裁剪 AOT dll。" +
                                       "等编译停下后重新点构建。");
                        onComplete?.Invoke(false);
                        return;
                    }

                    Debug.Log("[BuildWithConfig] 生成 HybridCLR 产物并编译热更DLL...");
                    BuildDLLCommand.GenerateAllAndCopyDlls(config.BuildTarget);
                }
                else
                {
                    Debug.Log("[BuildWithConfig] 编译热更DLL...");
                    BuildDLLCommand.BuildAndCopyDlls();
                }
            }

            // 2. 刷新资源
            AssetDatabase.Refresh();

            // 3. 构建 AssetBundle
            // 跑过 HybridCLR 生成链时,收口闸会把生成链自己改写的 AOTGenericReferences.cs 判成脚本未重载,需放行;
            // 入口已过闸,此后的脚本改动只来自生成链。
            YooAsset.Editor.BuildResult buildResult;
            bool ranGenerateAll = config.BuildHotFixDll && willBuildPlayer;
            using (ranGenerateAll ? ScriptDomainGate.AcceptSelfGeneratedScripts() : null)
            {
                buildResult = BuildInternalWithConfig(config);
            }

            if (!buildResult.Success)
            {
                Debug.LogError($"[BuildWithConfig] AssetBundle构建失败: {buildResult.ErrorInfo}");
                onComplete?.Invoke(false);
                return;
            }

            Debug.Log($"[BuildWithConfig] AssetBundle构建成功: {buildResult.OutputPackageDirectory}");

            // 4. 刷新资源
            AssetDatabase.Refresh();

            // 7. [可选] 构建 Player
            if (willBuildPlayer)
            {
                BuildPlayerWhenReady(
                    BuildConfig.GetBuildTargetGroup(config.PlayerPlatform),
                    config.PlayerPlatform,
                    config.PlayerOutputPath,
                    onComplete
                );
                return;
            }

            onComplete?.Invoke(true);
        }

        #endregion

        #region AssetBundle 构建

        /// <summary>
        /// 计算 AssetBundle 根包目录（{OutputRoot}/{BuildTarget}/DefaultPackage），OutputRoot 为相对路径时锚到工程根。
        /// </summary>
        public static string GetPackageOutputRootDirectory(BuildConfig config)
        {
            string outputRoot = config.OutputRoot;
            if (!Path.IsPathRooted(outputRoot))
            {
                outputRoot = Path.Combine(Application.dataPath + "/../", outputRoot);
                outputRoot = Path.GetFullPath(outputRoot).Replace('\\', '/');
            }

            return $"{outputRoot}/{config.BuildTarget}/DefaultPackage";
        }

        /// <summary>
        /// 计算指定版本号的精确 AB 输出目录（{根包目录}/{PackageVersion}），不做回退。
        /// 与 YooAsset BuildParameters.GetPackageOutputDirectory 的目录公式一致,用于构建前判定该版本目录是否已存在。
        /// </summary>
        public static string GetVersionOutputDirectory(BuildConfig config)
        {
            return GetVersionOutputDirectory(config, config.PackageVersion);
        }

        /// <summary>
        /// 计算指定版本号的精确 AB 输出目录，不读 <see cref="BuildConfig.PackageVersion"/>。
        /// 供选号时逐个试探候选号用。
        /// </summary>
        public static string GetVersionOutputDirectory(BuildConfig config, string packageVersion)
        {
            return $"{GetPackageOutputRootDirectory(config)}/{packageVersion}";
        }

        /// <summary>
        /// 取一个磁盘上未被占用的资源版本号：从 json 当前号 +1 起递增，跳过输出目录已存在的号。不写盘。
        /// </summary>
        /// <remarks>
        /// json 只记「已落定」的号，磁盘上可能有构建成功却没落定的号（如中断的流程）；只按 json 递增会撞上它，
        /// YooAsset 在构建准备阶段拒绝写入已存在的版本目录（ErrorCode115）。
        /// <paramref name="config"/> 的 BuildTarget 与 OutputRoot 决定目录位置，须在两者定稿后再调。
        /// </remarks>
        public static string ResolveAvailablePackageVersion(BuildConfig config)
        {
            const int maxProbe = 1000;
            string version = PackageVersionStore.PeekNext();
            for (int probe = 0; probe < maxProbe; probe++)
            {
                if (!Directory.Exists(GetVersionOutputDirectory(config, version)))
                {
                    return version;
                }

                string next = PackageVersionStore.NextAfter(version);
                if (next == null)
                {
                    return version;
                }

                version = next;
            }

            Debug.LogWarning($"[ReleaseTools] 连续 {maxProbe} 个版本号的输出目录都已存在，仍用 {version}：请检查输出目录是否堆积了历史产物。");
            return version;
        }

        /// <summary>
        /// 计算 AssetBundle 构建产物目录（{根包目录}/{PackageVersion}）。
        /// 精确版本目录不存在时，回退到该包下最近修改的版本目录。
        /// </summary>
        public static string GetAssetBundleOutputDirectory(BuildConfig config)
        {
            string versionDir = GetVersionOutputDirectory(config);
            if (Directory.Exists(versionDir))
            {
                return versionDir;
            }

            string packageDir = GetPackageOutputRootDirectory(config);
            if (Directory.Exists(packageDir))
            {
                string latest = null;
                System.DateTime latestTime = System.DateTime.MinValue;
                foreach (var dir in Directory.GetDirectories(packageDir))
                {
                    System.DateTime t = Directory.GetLastWriteTime(dir);
                    if (t > latestTime)
                    {
                        latestTime = t;
                        latest = dir;
                    }
                }

                if (latest != null)
                {
                    return latest.Replace('\\', '/');
                }
            }

            return versionDir;
        }

        private static YooAsset.Editor.BuildResult BuildInternalWithConfig(BuildConfig config)
        {
            Debug.Log($"开始构建 : {config.BuildTarget}");

            IBuildPipeline pipeline;
            BuildParameters buildParameters;

            if (config.BuildPipeline == EBuildPipeline.BuiltinBuildPipeline)
            {
                var builtinBuildParameters = new BuiltinBuildParameters();
                pipeline = new BuiltinBuildPipeline();
                buildParameters = builtinBuildParameters;
                builtinBuildParameters.CompressOption = config.CompressOption;
            }
            else
            {
                var scriptableBuildParameters = new ScriptableBuildParameters();
                pipeline = new ScriptableBuildPipeline();
                buildParameters = scriptableBuildParameters;
                scriptableBuildParameters.CompressOption = config.CompressOption;
                scriptableBuildParameters.BuiltinShadersBundleName = GetBuiltinShaderBundleName("DefaultPackage");
                scriptableBuildParameters.ReplaceAssetPathWithAddress = Settings.UpdateSetting.GetReplaceAssetPathWithAddress();
            }

            string outputRoot = config.OutputRoot;
            if (!Path.IsPathRooted(outputRoot))
            {
                outputRoot = Path.Combine(Application.dataPath + "/../", outputRoot);
                outputRoot = Path.GetFullPath(outputRoot).Replace('\\', '/');
            }

            buildParameters.BuildOutputRoot = outputRoot;
            buildParameters.BuildinFileRoot = AssetBundleBuilderHelper.GetStreamingAssetsRoot();
            buildParameters.BuildPipeline = config.BuildPipeline.ToString();
            buildParameters.BuildTarget = config.BuildTarget;
            buildParameters.BuildBundleType = (int)EBuildBundleType.AssetBundle;
            buildParameters.PackageName = "DefaultPackage";
            buildParameters.PackageVersion = config.PackageVersion;
            buildParameters.VerifyBuildingResult = config.VerifyBuildingResult;
            buildParameters.EnableSharePackRule = config.EnableSharePackRule;
            // 单引用且未被收集的依赖并入引用方 bundle(Addressable 式归属),不各自抽成 share_ 微包;YooAsset 默认 true 会独立成包。
            buildParameters.SingleReferencedPackAlone = false;
            buildParameters.FileNameStyle = config.FileNameStyle;
            buildParameters.BuildinFileCopyOption = config.BuildinFileCopyOption;
            buildParameters.BuildinFileCopyParams = config.BuildinFileCopyParams ?? string.Empty;
            buildParameters.EncryptionServices = GetEncryptionFromType(config.EncryptionType);
            buildParameters.ClearBuildCacheFiles = config.ClearBuildCache;
            buildParameters.UseAssetDependencyDB = config.UseAssetDependencyDB;

            // 指纹写在收 AB 之前:本方法是打 AB 的实际执行处,挂在这里则面板上每一条产出 AB 的入口
            // (单独构建 / 一键构建+部署 / 菜单一键打包)都被覆盖。理由见 BuildDLLCommand 该方法注释。
            BuildDLLCommand.WriteAotFingerprintForAssetBundle(config.BuildTarget);

            var result = pipeline.Run(buildParameters, true);
            return result;
        }

        /// <summary>
        /// 旧版 BuildInternal，供 CLI 入口兼容
        /// </summary>
        private static void BuildInternal(BuildTarget buildTarget, string outputRoot, string packageVersion = "1.0",
            EBuildPipeline buildPipeline = EBuildPipeline.ScriptableBuildPipeline)
        {
            Debug.Log($"开始构建 : {buildTarget}");

            IBuildPipeline pipeline = null;
            BuildParameters buildParameters = null;

            if (buildPipeline == EBuildPipeline.BuiltinBuildPipeline)
            {
                BuiltinBuildParameters builtinBuildParameters = new BuiltinBuildParameters();
                pipeline = new BuiltinBuildPipeline();
                buildParameters = builtinBuildParameters;
                builtinBuildParameters.CompressOption = ECompressOption.LZ4;
            }
            else
            {
                ScriptableBuildParameters scriptableBuildParameters = new ScriptableBuildParameters();
                pipeline = new ScriptableBuildPipeline();
                buildParameters = scriptableBuildParameters;
                scriptableBuildParameters.CompressOption = ECompressOption.LZ4;
                scriptableBuildParameters.BuiltinShadersBundleName = GetBuiltinShaderBundleName("DefaultPackage");
                scriptableBuildParameters.ReplaceAssetPathWithAddress = Settings.UpdateSetting.GetReplaceAssetPathWithAddress();
            }

            buildParameters.BuildOutputRoot = outputRoot;
            buildParameters.BuildinFileRoot = AssetBundleBuilderHelper.GetStreamingAssetsRoot();
            buildParameters.BuildPipeline = buildPipeline.ToString();
            buildParameters.BuildTarget = buildTarget;
            buildParameters.BuildBundleType = (int)EBuildBundleType.AssetBundle;
            buildParameters.PackageName = "DefaultPackage";
            buildParameters.PackageVersion = packageVersion;
            buildParameters.VerifyBuildingResult = true;
            buildParameters.EnableSharePackRule = true;
            // 单引用且未被收集的依赖并入引用方 bundle(Addressable 式归属),不各自抽成 share_ 微包;YooAsset 默认 true 会独立成包。
            buildParameters.SingleReferencedPackAlone = false;
            buildParameters.FileNameStyle = EFileNameStyle.BundleName_HashName;
            buildParameters.BuildinFileCopyOption = EBuildinFileCopyOption.ClearAndCopyAll;
            buildParameters.BuildinFileCopyParams = string.Empty;
            buildParameters.EncryptionServices = GetEncryptionFromResourceModuleDriver();
            buildParameters.ClearBuildCacheFiles = false;
            buildParameters.UseAssetDependencyDB = true;

            // 同 BuildInternalWithConfig:本方法是 CLI 兼容路径上打 AB 的实际执行处,两处都要写。
            BuildDLLCommand.WriteAotFingerprintForAssetBundle(buildTarget);

            var buildResult = pipeline.Run(buildParameters, true);
            if (buildResult.Success)
            {
                Debug.Log($"构建成功 : {buildResult.OutputPackageDirectory}");
            }
            else
            {
                Debug.LogError($"构建失败 : {buildResult.ErrorInfo}");
            }
        }

        #endregion

        #region Player 构建

        /// <summary>
        /// 平台一致性闸:已在目标平台返回 true 可继续;不在则切过去并**中止本趟构建**,返回 false。
        /// </summary>
        /// <param name="buildTarget">目标平台。</param>
        /// <param name="stage">调用点名字，只进错误文案，便于定位是哪一步被拦。</param>
        /// <returns>可以继续构建为 true。</returns>
        /// <remarks>
        /// 为什么切完不能接着打:平台宏(<c>UNITY_ANDROID</c> / <c>UNITY_WEBGL</c> …)是**编译期**常量,
        /// 切平台只让 Unity 按新平台重新编译编辑器程序集、并在下一次域重载时换上;当前调用栈跑的仍是旧平台
        /// 宏编译出来的域。而构建后处理大量按平台宏条件编译——HybridCLR 把热更程序集名补回
        /// <c>ScriptingAssemblies.json</c> 的 Android 入口在 <c>#if UNITY_ANDROID</c> 下、iOS 的 il2cpp
        /// 源码注入在 <c>#if UNITY_IOS</c> 下——旧域里这些回调根本没被编译进来、更谈不上注册。
        /// 于是构建照常成功、产物照常生成,缺的东西只在真机上显形:热更程序集不在白名单里,prefab 上的
        /// 热更 MonoBehaviour 全部反序列化成 missing script,所有热更 UI 打不开。
        /// 这类失败没有构建期信号,故只能在入口拦死,等域重载完由用户重新发起。
        /// 另:切换本身会触发一次全量资源重导入,按工程规模可达分钟级。
        /// </remarks>
        public static bool EnsureActiveBuildTarget(BuildTarget buildTarget, string stage)
        {
            if (EditorUserBuildSettings.activeBuildTarget == buildTarget)
            {
                return true;
            }

            BuildTarget from = EditorUserBuildSettings.activeBuildTarget;
            EditorUserBuildSettings.SwitchActiveBuildTarget(BuildConfig.GetBuildTargetGroup(buildTarget), buildTarget);
            AssetDatabase.Refresh();
            Debug.LogError($"[{stage}] 激活平台是 {from},本次目标是 {buildTarget},已发起平台切换并中止本趟构建。" +
                           "切平台要重新编译编辑器程序集,新平台的构建后处理(HybridCLR 补 ScriptingAssemblies.json 等)" +
                           "要等域重载后才生效;此刻继续构建会出一个缺这些后处理、装到真机才炸的包。" +
                           "请等平台切换与脚本重编译结束后,重新发起构建。");
            return false;
        }

        /// <summary>脚本编译或资源导入进行中——此时构建 Player 会被 Unity 拒绝。</summary>
        public static bool IsBusyForPlayerBuild()
        {
            return EditorApplication.isCompiling || EditorApplication.isUpdating;
        }

        /// <summary>
        /// 等脚本编译与资源导入结束后构建 Player；已就绪时立即构建。
        /// </summary>
        /// <param name="buildTargetGroup">目标平台组，用 <see cref="BuildConfig.GetBuildTargetGroup"/> 由平台取。</param>
        /// <param name="buildTarget">目标平台。</param>
        /// <param name="locationPathName">产物落点，含文件名；同名文件会被覆盖。</param>
        /// <param name="onComplete">完成回调，参数为是否构建成功；等待超时也走 false。</param>
        /// <remarks>
        /// 不能改成同步等待：编译要靠编辑器主线程 tick 推进，原地轮询会把主线程占死、编译永远走不完。
        /// 等待期间锁住程序集重载，否则编译结束时的域重载会清掉这里注册的回调，Player 构建再也不会开始。
        /// 打 AB 之后必须走本方法而不是直接调 <see cref="BuildImp"/>：AB 流程内有两次 <c>AssetDatabase.Refresh</c>。
        /// 这里的重载锁也意味着本方法内不可能靠切平台补救：锁期间域不会重载，切过去的平台宏到不了当前域。
        /// 平台必须在进本方法之前就已经对齐，闸在 <see cref="EnsureActiveBuildTarget"/>。
        /// </remarks>
        public static void BuildPlayerWhenReady(
            BuildTargetGroup buildTargetGroup,
            BuildTarget buildTarget,
            string locationPathName,
            Action<bool> onComplete = null)
        {
            if (!IsBusyForPlayerBuild())
            {
                onComplete?.Invoke(BuildImp(buildTargetGroup, buildTarget, locationPathName));
                return;
            }

            Debug.Log("[BuildPlayerWhenReady] 脚本编译中，等待编译结束后再构建 Player...");
            EditorApplication.LockReloadAssemblies();

            double deadline = EditorApplication.timeSinceStartup + WaitCompilationTimeoutSeconds;
            EditorApplication.CallbackFunction tick = null;
            tick = () =>
            {
                if (IsBusyForPlayerBuild() && EditorApplication.timeSinceStartup < deadline)
                {
                    return;
                }

                EditorApplication.update -= tick;
                bool timedOut = IsBusyForPlayerBuild();
                EditorApplication.UnlockReloadAssemblies();

                if (timedOut)
                {
                    Debug.LogError($"[BuildPlayerWhenReady] 等待脚本编译超过 {WaitCompilationTimeoutSeconds} 秒仍未结束，" +
                                   "已放弃构建 Player。等编译停下后单独点『构建 Player』。");
                    onComplete?.Invoke(false);
                    return;
                }

                onComplete?.Invoke(BuildImp(buildTargetGroup, buildTarget, locationPathName));
            };
            EditorApplication.update += tick;
        }

        /// <summary>等待脚本编译的上限；超过即放弃本次 Player 构建。</summary>
        private const double WaitCompilationTimeoutSeconds = 600d;

        /// <summary>
        /// 构建 Player 到指定路径。
        /// </summary>
        /// <param name="buildTargetGroup">目标平台组，用 <see cref="BuildConfig.GetBuildTargetGroup"/> 由平台取。</param>
        /// <param name="buildTarget">目标平台；与当前激活平台不同时切过去并中止本次构建，见 <see cref="EnsureActiveBuildTarget"/>。</param>
        /// <param name="locationPathName">产物落点，含文件名（如 <c>.../20260903-1217Android.apk</c>）；同名文件会被覆盖。</param>
        /// <returns>构建成功、且 AOT 补充元数据与本次 Player 同源为 true;同源核对不过时产物已生成但判 false。</returns>
        /// <remarks>
        /// 前置：不能在脚本编译中调用，Unity 会以「Error building Player because scripts are compiling」拒绝，
        /// 且这个失败只体现在 <see cref="BuildSummary.result"/> 上、不抛异常。打完 AB 接着打 Player 的路径
        /// 一律走 <see cref="BuildPlayerWhenReady"/>。
        /// 场景取 <c>EditorBuildSettings.scenes</c> 里勾选启用的那些；未勾选的不进包。
        /// </remarks>
        public static bool BuildImp(BuildTargetGroup buildTargetGroup, BuildTarget buildTarget, string locationPathName)
        {
            if (IsBusyForPlayerBuild())
            {
                Debug.LogError("[BuildImp] 脚本编译或资源导入进行中，Unity 会拒绝构建 Player。" +
                               "改走 ReleaseTools.BuildPlayerWhenReady，或等编译停下后重试。");
                return false;
            }

            // 兜底闸:绕开 BuildWithConfig 直接打 Player 的调用方(构建窗口的「只打 Player」等)同样受拦。
            if (!EnsureActiveBuildTarget(buildTarget, nameof(BuildImp)))
            {
                return false;
            }

            // 指纹载体在 BuildPlayer 之前生成、之后删除:本方法是出 Player 的唯一实际执行处,挂在这里则面板上
            // 每一条产出 Player 的入口都被覆盖。理由见 BuildDLLCommand 该方法注释。
            if (!BuildDLLCommand.WriteAotFingerprintForPlayer(buildTarget))
            {
                Debug.LogError("[BuildImp] AOT 指纹写入失败,不出包:没有指纹的包认不出「热更资源与本包 AOT " +
                               "不同源」,那种组合会在真机启动时原生闪退且无从提示玩家。");
                return false;
            }

            BuildPlayerOptions buildPlayerOptions = new BuildPlayerOptions
            {
                scenes = EditorBuildSettings.scenes.Where(scene => scene.enabled).Select(scene => scene.path).ToArray(),
                locationPathName = locationPathName,
                targetGroup = buildTargetGroup,
                target = buildTarget,
                options = BuildOptions.None
            };
            UnityEditor.Build.Reporting.BuildReport report;
            try
            {
                report = BuildPipeline.BuildPlayer(buildPlayerOptions);
            }
            finally
            {
                BuildDLLCommand.DeleteAotFingerprintForPlayer();
            }

            BuildSummary summary = report.summary;
            if (summary.result == BuildResult.Succeeded)
            {
                // 出包成功才做同源闸:此刻裁剪目录已被本次构建的 CopyStrippedAOTAssemblies 重写,
                // 里面就是这个包的真实 AOT,与打进 AB 的 .dll.bytes 比对才有判别力。判据与后果见被调方法注释。
                // 产物留着不删(留给排查),但这里判构建失败,让调用方的 onComplete 收到 false、不当成一次可用的出包。
                if (!BuildDLLCommand.VerifyAOTMetadataMatchesPlayer(buildTarget))
                {
                    Debug.LogError($"[BuildImp] 构建 Player 判失败:AOT 补充元数据与本次 Player 不同源(详情见上一条错误)。" +
                                   $"产物已生成但不可用:{summary.outputPath}");
                    return false;
                }

                Debug.Log($"Build success: {summary.totalSize / 1024 / 1024} MB, {summary.outputPath}");
                if (buildTarget == BuildTarget.iOS)
                {
                    XcodeProjectShareSync.OnIosPlayerBuilt(locationPathName);
                }

                return true;
            }

            Debug.LogError($"[BuildImp] 构建 Player 失败({summary.result})，产物未生成:{locationPathName}\n" +
                           $"错误 {summary.totalErrors} 条，详情见 Console 上方的构建日志。");
            return false;
        }

        #endregion

        #region 工具方法

        private static BuildTarget GetBuildTarget(string platform)
        {
            BuildTarget target = BuildTarget.NoTarget;
            switch (platform)
            {
                case "Android":
                    target = BuildTarget.Android;
                    break;
                case "IOS":
                    target = BuildTarget.iOS;
                    break;
                case "Windows":
                    target = BuildTarget.StandaloneWindows64;
                    break;
                case "MacOS":
                    target = BuildTarget.StandaloneOSX;
                    break;
                case "Linux":
                    target = BuildTarget.StandaloneLinux64;
                    break;
                case "WebGL":
                    target = BuildTarget.WebGL;
                    break;
                case "Switch":
                    target = BuildTarget.Switch;
                    break;
                case "PS4":
                    target = BuildTarget.PS4;
                    break;
                case "PS5":
                    target = BuildTarget.PS5;
                    break;
            }

            return target;
        }

        private static string GetBuiltinShaderBundleName(string packageName)
        {
            var uniqueBundleName = AssetBundleCollectorSettingData.Setting.UniqueBundleName;
            var packRuleResult = DefaultPackRule.CreateShadersPackRuleResult();
            return packRuleResult.GetBundleName(packageName, uniqueBundleName);
        }

        /// <summary>
        /// 根据 EncryptionType 枚举获取加密服务
        /// </summary>
        private static IEncryptionServices GetEncryptionFromType(EncryptionType encryptionType)
        {
            return encryptionType switch
            {
                EncryptionType.FileOffSet => new FileOffsetEncryption(),
                EncryptionType.FileStream => new FileStreamEncryption(),
                _ => null
            };
        }

        /// <summary>
        /// 根据 ResourceModuleDriver 的 encryptionType 获取对应的加密服务（旧版兼容）
        /// </summary>
        private static IEncryptionServices GetEncryptionFromResourceModuleDriver()
        {
            var guids = AssetDatabase.FindAssets("t:Prefab GameEntry");
            if (guids.Length == 0)
            {
                Debug.LogWarning("[BuildInternal] Failed to find GameEntry.prefab");
                return null;
            }

            var gameEntryPath = AssetDatabase.GUIDToAssetPath(guids[0]);
            var gameEntryPrefab = AssetDatabase.LoadAssetAtPath<GameObject>(gameEntryPath);
            if (gameEntryPrefab == null)
            {
                Debug.LogWarning("[BuildInternal] Failed to load GameEntry.prefab");
                return null;
            }

            var resourceModuleDriver = gameEntryPrefab.GetComponentInChildren<ResourceModuleDriver>();
            if (resourceModuleDriver == null)
            {
                Debug.LogWarning("[BuildInternal] ResourceModuleDriver not found in GameEntry.prefab");
                return null;
            }

            var encryptionType = resourceModuleDriver.EncryptionType;
            Debug.Log($"[BuildInternal] Use EncryptionType from ResourceModuleDriver: {encryptionType}");

            return GetEncryptionFromType(encryptionType);
        }

        #endregion
    }
}
