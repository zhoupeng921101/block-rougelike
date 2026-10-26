using UnityEditor;
using UnityEngine;
using YooAsset;
using YooAsset.Editor;

namespace TEngine
{
    /// <summary>
    /// 首包策略:决定哪些资源随包发布(进 StreamingAssets)、哪些留在 CDN 上按需下载。
    /// </summary>
    public enum EFirstPackageStrategy
    {
        /// <summary>整包内置:所有资源随包,运行时不依赖 CDN。</summary>
        All = 0,

        /// <summary>最小首包:只有带指定 Tag 的采集器分组进首包(至少须覆盖热更 DLL),其余从 CDN 下载。</summary>
        Minimal = 1,

        /// <summary>自定义:直接编辑 YooAsset 的拷贝档位与 Tag 参数,不受策略约束。</summary>
        Custom = 2,
    }

    public class BuildConfig
    {
        // 基础设置
        public BuildTarget BuildTarget;
        public EBuildPipeline BuildPipeline = EBuildPipeline.ScriptableBuildPipeline;
        public ECompressOption CompressOption = ECompressOption.LZ4;
        public EncryptionType EncryptionType = EncryptionType.None;
        public string PackageVersion = "";
        public string OutputRoot = "./Builds/";

        // 首包设置
        public EFirstPackageStrategy FirstPackageStrategy = EFirstPackageStrategy.All;

        // 高级设置
        public bool EnableSharePackRule = true;
        public bool UseAssetDependencyDB = true;
        public bool ClearBuildCache;
        public bool VerifyBuildingResult = true;
        // 下面两项由 FirstPackageStrategy 派生,除 Custom 档外不直接编辑;改策略后须调 ApplyFirstPackageStrategy 同步。
        public EBuildinFileCopyOption BuildinFileCopyOption = EBuildinFileCopyOption.ClearAndCopyAll;
        // ByTags 拷贝时,指定哪些 Tag 的 bundle 进首包(StreamingAssets)。多个用分号分隔。
        public string BuildinFileCopyParams = "";
        public EFileNameStyle FileNameStyle = EFileNameStyle.BundleName_HashName;

        // 热更DLL设置
        public bool BuildHotFixDll = true;

        // 打包Player设置
        public bool BuildPlayer;
        public BuildTarget PlayerPlatform;
        public string PlayerOutputPath = "";

        public static BuildConfig CreateDefault()
        {
            return new BuildConfig
            {
                BuildTarget = EditorUserBuildSettings.activeBuildTarget,
                PlayerPlatform = EditorUserBuildSettings.activeBuildTarget,
                PackageVersion = PeekNextPackageVersion(),
                OutputRoot = "./Builds/",
                PlayerOutputPath = GetDefaultPlayerOutputPath(EditorUserBuildSettings.activeBuildTarget),
            };
        }

        /// <summary>
        /// 把 <see cref="FirstPackageStrategy"/> 落到 YooAsset 的拷贝参数上（<see cref="BuildinFileCopyOption"/> 与
        /// <see cref="BuildinFileCopyParams"/>）。<see cref="EFirstPackageStrategy.Custom"/> 档不动这两项。
        /// </summary>
        /// <remarks>
        /// 改过 <see cref="FirstPackageStrategy"/> 必须调一次：不调则策略换了而拷贝参数仍是旧值，
        /// 构建按旧值走、面板上却显示新策略，且不报错。
        /// <see cref="EFirstPackageStrategy.Minimal"/> 档不动 <see cref="BuildinFileCopyParams"/>，
        /// 该档的 Tag 由调用方（面板）从采集器 Tag 里选定后写入。
        /// </remarks>
        public void ApplyFirstPackageStrategy()
        {
            switch (FirstPackageStrategy)
            {
                case EFirstPackageStrategy.All:
                    BuildinFileCopyOption = EBuildinFileCopyOption.ClearAndCopyAll;
                    BuildinFileCopyParams = "";
                    break;
                case EFirstPackageStrategy.Minimal:
                    BuildinFileCopyOption = EBuildinFileCopyOption.ClearAndCopyByTags;
                    break;
            }
        }

        /// <summary>
        /// 从 YooAsset 的拷贝参数反推首包策略档位。供读取早于本策略存在的旧配置时定档。
        /// </summary>
        public static EFirstPackageStrategy InferStrategy(EBuildinFileCopyOption copyOption, string copyParams)
        {
            if (copyOption == EBuildinFileCopyOption.ClearAndCopyAll)
                return EFirstPackageStrategy.All;

            if (copyOption == EBuildinFileCopyOption.ClearAndCopyByTags && !string.IsNullOrWhiteSpace(copyParams))
                return EFirstPackageStrategy.Minimal;

            return EFirstPackageStrategy.Custom;
        }

        /// <summary>算下一个候选资源版本号（形如 <c>1.2</c>）。不写盘，反复调用得到同一个号。</summary>
        /// <remarks>
        /// 号由 <see cref="PackageVersionStore.Commit"/> 在构建成功后落定，调用方须在成功分支上调它，
        /// 否则下一次构建会拿到同一个号、覆盖 CDN 上已有的那一版清单。
        /// 只读当前号用 <see cref="PackageVersionStore.Peek"/>；存储与主版本改法见 <see cref="PackageVersionStore"/>。
        /// </remarks>
        public static string PeekNextPackageVersion()
        {
            return PackageVersionStore.PeekNext();
        }

        /// <summary>
        /// 构建产物文件名用的时间戳（<c>yyyyMMdd-HHmm</c>）。
        /// </summary>
        /// <remarks>
        /// 与资源版本号解耦：资源版本号是递增的短号，拿它当 APK 文件名会在重打同一版本时静默覆盖前一个包。
        /// </remarks>
        public static string GetBuildTimeStamp()
        {
            return System.DateTime.Now.ToString("yyyyMMdd-HHmm");
        }

        public static string GetDefaultPlayerOutputPath(BuildTarget target)
        {
            return ComposePlayerOutputPath(GetDefaultPlayerOutputDir(target), target);
        }

        /// <summary>Player 默认输出目录:本工程根下 <c>Build/&lt;平台&gt;</c>。</summary>
        public static string GetDefaultPlayerOutputDir(BuildTarget target)
        {
            string basePath = Application.dataPath + "/../Build/";
            return target switch
            {
                BuildTarget.StandaloneWindows64 => basePath + "Windows",
                BuildTarget.Android => basePath + "Android",
                BuildTarget.iOS => basePath + "IOS",
                BuildTarget.StandaloneOSX => basePath + "MacOS",
                BuildTarget.StandaloneLinux64 => basePath + "Linux",
                BuildTarget.WebGL => basePath + "WebGL",
                _ => basePath + target
            };
        }

        /// <summary>
        /// 输出目录下的产物名;空串表示产物直接铺在输出目录里(WebGL)。
        /// </summary>
        /// <remarks>
        /// 每次出包现取,不得缓存或持久化:Android 产物名带时间戳,存下来即冻结,之后每次出包都覆盖同一个文件。
        /// </remarks>
        public static string GetPlayerOutputLeafName(BuildTarget target)
        {
            return target switch
            {
                BuildTarget.StandaloneWindows64 => "Release_Windows.exe",
                BuildTarget.Android => $"{GetBuildTimeStamp()}Android.apk",
                BuildTarget.iOS => "XCode_Project",
                BuildTarget.StandaloneOSX => "Release_MacOS.app",
                BuildTarget.StandaloneLinux64 => "Release_Linux",
                BuildTarget.WebGL => "",
                _ => "Release"
            };
        }

        /// <summary>
        /// 把输出目录与本次产物名拼成 BuildPlayer 用的完整落点;目录为空时取该平台默认目录。
        /// </summary>
        public static string ComposePlayerOutputPath(string outputDir, BuildTarget target)
        {
            if (string.IsNullOrWhiteSpace(outputDir))
            {
                outputDir = GetDefaultPlayerOutputDir(target);
            }

            string dir = outputDir.Replace('\\', '/').TrimEnd('/');
            string leaf = GetPlayerOutputLeafName(target);
            return string.IsNullOrEmpty(leaf) ? dir : dir + "/" + leaf;
        }

        public static BuildTargetGroup GetBuildTargetGroup(BuildTarget target)
        {
            return target switch
            {
                BuildTarget.StandaloneWindows64 => BuildTargetGroup.Standalone,
                BuildTarget.StandaloneOSX => BuildTargetGroup.Standalone,
                BuildTarget.StandaloneLinux64 => BuildTargetGroup.Standalone,
                BuildTarget.Android => BuildTargetGroup.Android,
                BuildTarget.iOS => BuildTargetGroup.iOS,
                BuildTarget.WebGL => BuildTargetGroup.WebGL,
                BuildTarget.Switch => BuildTargetGroup.Switch,
                BuildTarget.PS4 => BuildTargetGroup.PS4,
                BuildTarget.PS5 => BuildTargetGroup.PS5,
                _ => BuildTargetGroup.Standalone
            };
        }

        /// <summary>
        /// BuildTarget → 资源地址里的平台段名（如 <c>Android</c> / <c>WebGL</c> / <c>Windows64</c>）。
        /// </summary>
        /// <remarks>
        /// 必须与运行时 <see cref="UpdateSetting.GetPlatformName"/> 的返回值逐字一致：客户端按那个名字拼下载地址，
        /// 打包工具按这个名字拼上传地址与线上检查地址。两处分头维护，改一处必须改另一处，
        /// 否则传上去的资源客户端按另一个名字去找、404。
        /// </remarks>
        public static string GetPlatformFolderName(BuildTarget target)
        {
            switch (target)
            {
                case BuildTarget.Android: return "Android";
                case BuildTarget.iOS: return "IOS";
                case BuildTarget.WebGL: return "WebGL";
                case BuildTarget.StandaloneWindows64: return "Windows64";
                case BuildTarget.StandaloneOSX: return "MacOS";
                case BuildTarget.PS5: return "PS5";
                default: return target.ToString();
            }
        }
    }
}
