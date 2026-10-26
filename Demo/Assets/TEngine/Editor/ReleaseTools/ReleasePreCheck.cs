using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using UnityEditor;
using YooAsset;
using YooAsset.Editor;

namespace TEngine
{
    /// <summary>
    /// 发布前自检:把打包/发布环节反复踩到的失败模式(WebGL 首包缺内置目录、必崩拷贝组合、
    /// 部署遗漏/半量、版本不一致)固化成可核对的检查项。分本地(配置 + 构建产物)与线上(CDN 可达性 + 版本一致)两组。
    /// </summary>
    public static class ReleasePreCheck
    {
        public enum CheckStatus { Pass, Warn, Fail }

        public class CheckItem
        {
            public string Name;
            public CheckStatus Status;
            public string Message;
            public string Fix;

            public CheckItem(string name, CheckStatus status, string message, string fix = null)
            {
                Name = name;
                Status = status;
                Message = message;
                Fix = fix;
            }
        }

        private const string PackageName = "DefaultPackage";
        private const string BuildinCatalogFileName = "BuildinCatalog.bytes"; // 对应 YooAsset DefaultBuildinFileSystemDefine(internal,跨程序集用字面量)

        // ---------- 本地检查(配置 + 构建产物,不联网) ----------

        /// <summary>
        /// 只查配置,不看构建产物。构建与部署的前置闸调它,任一 <see cref="CheckStatus.Fail"/> 即中止。
        /// </summary>
        /// <remarks>
        /// 与 <see cref="RunArtifactChecks"/> 分开的原因:产物类检查在构建开始前必然报缺失
        /// (StreamingAssets 要么空、要么是上一次的残留),混在一起跑会把前置闸变成恒失败。
        /// </remarks>
        public static List<CheckItem> RunConfigChecks(BuildConfig config)
        {
            var items = new List<CheckItem>();
            bool isWebGL = config.BuildTarget == BuildTarget.WebGL;
            var loadWay = Settings.UpdateSetting.GetLoadResWayWebGL();
            bool remoteCdn = UsesRemoteCdn(config);

            items.Add(new CheckItem("平台 / 加载模式", CheckStatus.Pass,
                $"目标平台 {config.BuildTarget}" + (isWebGL ? $",WebGL 加载方式 {loadWay}" : "")
                + (remoteCdn ? ",资源从 CDN 增量下载" : ",资源全部随包")));

            CheckCopyOption(config, remoteCdn, items);
            CheckHostScheme(isWebGL, items);
            CheckFileNameStyle(config, remoteCdn, items);
            CheckByTagsHitDll(config, items);
            CheckHotfixDllMacro(config, items);
            CheckHybridClrPackageEnabled(config, items);
            CheckAutoPlayMacro(config, items);

            return items;
        }

        /// <summary>
        /// 目标平台定义了 AUTOPLAY 即判失败:该宏把自动试玩模块编进包,正式包不得带。
        /// </summary>
        /// <remarks>
        /// 自动试玩在编辑器里要用,宏常驻在编辑器激活平台的 define 里(WebGL 即是),出包前忘记去掉就随包分发。
        /// 模块本身无调用入口,但一个能自主玩主玩法的模块不该出现在玩家手里。
        /// 编辑器内照常可用,只拦出包;菜单一键打包不经本闸。
        /// </remarks>
        private static void CheckAutoPlayMacro(BuildConfig config, List<CheckItem> items)
        {
            const string macro = "AUTOPLAY";
            var namedTarget = NamedTargetOf(config);
            if (IsDefined(namedTarget, macro))
            {
                items.Add(new CheckItem("自动试玩宏", CheckStatus.Fail,
                    $"{namedTarget.TargetName} 平台定义了 {macro},自动试玩模块会被编进包。",
                    $"出包前在 Project Settings → Player → Scripting Define Symbols 去掉 {macro},出完包再加回。"));
            }
            else
            {
                items.Add(new CheckItem("自动试玩宏", CheckStatus.Pass,
                    $"{namedTarget.TargetName} 平台未定义 {macro}。"));
            }
        }

        private static UnityEditor.Build.NamedBuildTarget NamedTargetOf(BuildConfig config)
        {
            return UnityEditor.Build.NamedBuildTarget.FromBuildTargetGroup(
                BuildConfig.GetBuildTargetGroup(config.BuildTarget));
        }

        private static bool IsDefined(UnityEditor.Build.NamedBuildTarget namedTarget, string macro)
        {
            return PlayerSettings.GetScriptingDefineSymbols(namedTarget)
                .Split(new[] { ';', ',', ' ' }, StringSplitOptions.RemoveEmptyEntries)
                .Any(d => d.Trim() == macro);
        }

        /// <summary>
        /// 核对「构建前编译热更DLL」的勾选与目标平台的 ENABLE_HYBRIDCLR 宏状态是否自洽。
        /// </summary>
        /// <remarks>
        /// 宏未定义时 <c>BuildDLLCommand</c> 的产出方法全是空壳:构建以成功退出却产不出任何 .dll.bytes,
        /// 首包里没有热更程序集,要到真机启动 ProcedureLoadAssembly 加载主逻辑程序集时才中断。
        /// 拦在前置闸里是为了不消耗资源版本号、不先切一次平台;<c>BuildDLLCommand</c> 内另有一道硬失败
        /// 兜住不经面板的调用方。
        /// 查目标平台组的 define 而非本程序集的编译期宏:编辑器当前激活平台可以不是本次的目标平台,
        /// 编译期宏答的是激活平台那一份。
        /// </remarks>
        private static void CheckHotfixDllMacro(BuildConfig config, List<CheckItem> items)
        {
            if (!config.BuildHotFixDll)
            {
                return;
            }

            const string macro = BuildDLLCommand.EnableHybridClrScriptingDefineSymbol;
            var namedTarget = NamedTargetOf(config);
            bool defined = IsDefined(namedTarget, macro);

            if (defined)
            {
                items.Add(new CheckItem("热更 DLL 宏", CheckStatus.Pass,
                    $"{macro} 已在 {namedTarget.TargetName} 平台定义。"));
            }
            else
            {
                items.Add(new CheckItem("热更 DLL 宏", CheckStatus.Fail,
                    $"勾了『构建前编译热更DLL』,但 {namedTarget.TargetName} 平台未定义 {macro}:" +
                    "热更 DLL 的编译与拷贝会整段空转,构建以成功退出却产不出任何 .dll.bytes,真机启动加载主逻辑程序集时中断。",
                    "走菜单 HybridCLR/Define Symbols/Enable HybridCLR 打开宏;" +
                    "本次确实不需要热更 DLL 时,在『热更DLL设置』里取消勾选『构建前编译热更DLL』。"));
            }
        }

        /// <summary>
        /// 核对「构建前编译热更DLL」的勾选与 HybridCLR 包总开关是否自洽。
        /// </summary>
        /// <remarks>
        /// <c>SettingsUtil.Enable</c>(HybridCLRSettings 资产的 enable 字段)与 ENABLE_HYBRIDCLR 宏是两个
        /// 独立状态,存在两个地方:宏决定本工程自己的代码编不编进去,这个开关决定 HybridCLR 包挂在 Unity
        /// 构建管线上的那批处理器干不干活——CopyStrippedAOTAssemblies 拷不拷 il2cpp 裁剪后的 AOT dll、
        /// FilterHotFixAssemblies 剔不剔热更程序集、PatchScriptingAssemblyList 打不打补丁。
        /// 菜单 HybridCLR/Define Symbols 下两项同时改两者,走菜单不会失配;直接编辑 HybridCLRSettings
        /// 资产就能造出「宏开着、处理器全关」的组合,此时 GenerateAll 跑完却没有裁剪 AOT dll 落地,
        /// <c>BuildDLLCommand.CopyAOTAssembliesToAssetPath</c> 找不到源文件只记一行 Debug.LogError 就跳过,
        /// 构建照常出包、AOT 补充元数据进不去。
        /// 资产不存在时 <c>HybridCLRSettings.Instance</c> 现造一个默认实例(enable 默认 true),故本项不因缺资产误报。
        /// </remarks>
        private static void CheckHybridClrPackageEnabled(BuildConfig config, List<CheckItem> items)
        {
            if (!config.BuildHotFixDll)
            {
                return;
            }

            if (HybridCLR.Editor.SettingsUtil.Enable)
            {
                items.Add(new CheckItem("HybridCLR 包开关", CheckStatus.Pass,
                    "HybridCLRSettings 的 enable 已开,构建管线上的 HybridCLR 处理器生效。"));
            }
            else
            {
                items.Add(new CheckItem("HybridCLR 包开关", CheckStatus.Fail,
                    "勾了『构建前编译热更DLL』,但 HybridCLRSettings 的 enable 关着:HybridCLR 挂在构建管线上的处理器全部空转," +
                    "il2cpp 裁剪后的 AOT dll 不会落地、热更程序集不会从 Player 里剔除,构建照常出包但 AOT 补充元数据进不去。",
                    "走菜单 HybridCLR/Define Symbols/Enable HybridCLR 打开(它同时校正宏与这个开关)," +
                    "或在 HybridCLR Settings 面板勾上 enable。"));
            }
        }

        /// <summary>
        /// 只查已产出的构建产物(首包内置目录、DLL、清单、Player 输出),须在构建完成后跑。
        /// </summary>
        public static List<CheckItem> RunArtifactChecks(BuildConfig config)
        {
            var items = new List<CheckItem>();
            bool isWebGL = config.BuildTarget == BuildTarget.WebGL;

            CheckBuildinCatalog(items);
            CheckFirstPackageDll(items);
            CheckManifestTriple(items);
            CheckPlayerOutput(config, isWebGL, items);

            return items;
        }

        /// <summary>配置类 + 产物类全跑,供面板「本地检查」按钮使用。</summary>
        public static List<CheckItem> RunLocalChecks(BuildConfig config)
        {
            var items = RunConfigChecks(config);
            items.AddRange(RunArtifactChecks(config));
            return items;
        }

        /// <summary>
        /// 该平台的包是否从 CDN 增量取资源（首包之外的 bundle 走远端）。
        /// </summary>
        /// <remarks>
        /// WebGL 由 UpdateSetting 的加载方式决定；其余平台走联机模式——
        /// <c>ResourceModuleDriver.PlayMode</c> 在非 WebGL 运行期把 WebPlayMode 归位成 HostPlayMode。
        /// CDN 缓存、首包内容这两类失败模式不分平台，判据按「资源是否走远端」而不是「是不是 WebGL」。
        /// </remarks>
        private static bool UsesRemoteCdn(BuildConfig config)
        {
            if (config.BuildTarget == BuildTarget.WebGL)
            {
                return Settings.UpdateSetting.GetLoadResWayWebGL() == LoadResWayWebGL.Remote;
            }

            return true;
        }

        /// <summary>
        /// 取目标平台的 CDN 资源地址。
        /// </summary>
        /// <remarks>
        /// <see cref="UpdateSetting.GetResDownLoadPath"/> 按编辑器当前激活平台拼末段；编辑器停在 A 平台
        /// 却构建 B 平台时，它给的是 A 的目录，检查的是与本次产物无关的地址、还会误报可达。
        /// 这里把末段换成本次构建目标的平台名，平台名单一来源见 <see cref="BuildConfig.GetPlatformFolderName"/>。
        /// </remarks>
        private static string ResolveCdnBaseForTarget(BuildTarget target)
        {
            string current = Settings.UpdateSetting.GetResDownLoadPath();
            if (string.IsNullOrEmpty(current))
            {
                return current;
            }

            int lastSlash = current.LastIndexOf('/');
            string parent = lastSlash > 0 ? current.Substring(0, lastSlash) : current;
            return $"{parent}/{BuildConfig.GetPlatformFolderName(target)}";
        }

        private static void CheckCopyOption(BuildConfig config, bool remoteCdn, List<CheckItem> items)
        {
            if (!remoteCdn)
                return;

            bool none = config.BuildinFileCopyOption == EBuildinFileCopyOption.None;
            bool byTags = config.BuildinFileCopyOption == EBuildinFileCopyOption.ClearAndCopyByTags
                          || config.BuildinFileCopyOption == EBuildinFileCopyOption.OnlyCopyByTags;
            bool byTagsEmpty = byTags && string.IsNullOrWhiteSpace(config.BuildinFileCopyParams);

            if (none || byTagsEmpty)
            {
                items.Add(new CheckItem("内置文件拷贝", CheckStatus.Fail,
                    none ? "拷贝档为 None:首包不会有 BuildinCatalog,运行时资源初始化必失败。"
                         : "选了 ByTags 但首包 Tag 为空:等同 None,运行时必失败。",
                    "在首包设置选『最小首包』并勾上覆盖热更 DLL 的 Tag,或选『整包内置』。"));
            }
            else
            {
                items.Add(new CheckItem("内置文件拷贝", CheckStatus.Pass,
                    $"{config.BuildinFileCopyOption}" +
                    (string.IsNullOrWhiteSpace(config.BuildinFileCopyParams) ? "" : $"(Tag: {config.BuildinFileCopyParams})")));
            }
        }

        private static void CheckHostScheme(bool isWebGL, List<CheckItem> items)
        {
            if (!isWebGL)
                return;

            string host = Settings.UpdateSetting.GetResDownLoadPath();
            if (host != null && host.StartsWith("http://", StringComparison.OrdinalIgnoreCase))
            {
                items.Add(new CheckItem("资源地址协议", CheckStatus.Fail,
                    $"资源地址是 http:// —— WebGL 页面通常是 https,浏览器会以 mixed-content 拦截 http 资源。\n{host}",
                    "把 UpdateSetting.ResDownLoadPath 改为 https://。"));
            }
            else
            {
                items.Add(new CheckItem("资源地址协议", CheckStatus.Pass, host));
            }
        }

        private static void CheckFileNameStyle(BuildConfig config, bool remoteCdn, List<CheckItem> items)
        {
            if (!remoteCdn)
                return;

            // BundleName(无哈希)下 bundle URL 固定,内容变而 URL 不变,CDN/浏览器会用旧缓存冒充新文件 → CRC Mismatch。
            if (config.FileNameStyle == EFileNameStyle.BundleName)
            {
                items.Add(new CheckItem("文件名风格", CheckStatus.Fail,
                    "资源走 CDN 时用 BundleName(无哈希):bundle URL 固定,重新部署时 CDN 会用旧缓存冒充新文件,导致 CRC Mismatch、资源加载失败。",
                    "改用 BundleName_HashName 或 HashName(文件名带内容哈希,内容变则 URL 变)。"));
            }
            else
            {
                items.Add(new CheckItem("文件名风格", CheckStatus.Pass, $"{config.FileNameStyle}(带内容哈希,规避 CDN 缓存)。"));
            }
        }

        private static void CheckByTagsHitDll(BuildConfig config, List<CheckItem> items)
        {
            bool byTags = config.BuildinFileCopyOption == EBuildinFileCopyOption.ClearAndCopyByTags
                          || config.BuildinFileCopyOption == EBuildinFileCopyOption.OnlyCopyByTags;
            if (!byTags || string.IsNullOrWhiteSpace(config.BuildinFileCopyParams))
                return;

            var wantTags = config.BuildinFileCopyParams
                .Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(t => t.Trim()).ToList();

            string dllTags;
            try
            {
                var setting = AssetBundleCollectorSettingData.Setting;
                var pkg = setting.Packages.FirstOrDefault(p => p.PackageName == PackageName);
                var dllGroup = pkg?.Groups.FirstOrDefault(g => string.Equals(g.GroupName, "DLL", StringComparison.OrdinalIgnoreCase));
                dllTags = dllGroup?.AssetTags ?? "";
            }
            catch (Exception e)
            {
                items.Add(new CheckItem("首包覆盖 DLL", CheckStatus.Warn, $"无法读取采集器配置核对:{e.Message}"));
                return;
            }

            var dllTagList = dllTags.Split(new[] { ';', ' ' }, StringSplitOptions.RemoveEmptyEntries);
            bool hit = dllTagList.Any(wantTags.Contains);
            if (hit)
            {
                items.Add(new CheckItem("首包覆盖 DLL", CheckStatus.Pass,
                    $"DLL 组 Tag [{dllTags}] 命中首包保留 Tag,热更/AOT DLL 会进首包。"));
            }
            else
            {
                items.Add(new CheckItem("首包覆盖 DLL", CheckStatus.Warn,
                    $"DLL 组 Tag [{(string.IsNullOrEmpty(dllTags) ? "空" : dllTags)}] 未被首包保留 Tag [{config.BuildinFileCopyParams}] 命中:" +
                    "热更/AOT DLL 不进首包,启动要先从 CDN 下 DLL(慢且强依赖网络)。",
                    "给采集器 DLL 组打上 Tag(如 buildin),或在首包设置里把 DLL 组已有的 Tag 勾上。"));
            }
        }

        private static void CheckBuildinCatalog(List<CheckItem> items)
        {
            string path = Path.Combine(AssetBundleBuilderHelper.GetStreamingAssetsRoot(), PackageName, BuildinCatalogFileName);
            if (File.Exists(path))
                items.Add(new CheckItem("内置目录 BuildinCatalog", CheckStatus.Pass, "StreamingAssets 存在内置目录。"));
            else
                items.Add(new CheckItem("内置目录 BuildinCatalog", CheckStatus.Fail,
                    $"缺失:{path}\nPlayer 运行时会卡在内置文件系统初始化(读不到内置清单)而下载不到资源。",
                    "先打一次 AB(内置文件拷贝需为 ClearAndCopyByTags/All)再打 Player。"));
        }

        private static void CheckFirstPackageDll(List<CheckItem> items)
        {
            string dir = Path.Combine(AssetBundleBuilderHelper.GetStreamingAssetsRoot(), PackageName);
            if (!Directory.Exists(dir))
            {
                items.Add(new CheckItem("首包 DLL", CheckStatus.Warn, "StreamingAssets 首包目录不存在(尚未打 AB?)。"));
                return;
            }

            var bundles = Directory.GetFiles(dir, "*.bundle", SearchOption.TopDirectoryOnly).Select(Path.GetFileName).ToList();
            bool hasLogic = bundles.Any(b => b.Contains("gamelogic_dll"));
            bool hasProto = bundles.Any(b => b.Contains("gameconfig_dll"));
            if (hasLogic && hasProto)
                items.Add(new CheckItem("首包 DLL", CheckStatus.Pass, $"首包含 {bundles.Count} 个 bundle,含热更 DLL。"));
            else
                items.Add(new CheckItem("首包 DLL", CheckStatus.Warn,
                    $"首包 {bundles.Count} 个 bundle,未见热更 DLL(gamelogic/gameconfig)。",
                    "确认 DLL 组已打首包保留 Tag,启动依赖这些 DLL。"));
        }

        private static void CheckManifestTriple(List<CheckItem> items)
        {
            string dir = Path.Combine(AssetBundleBuilderHelper.GetStreamingAssetsRoot(), PackageName);
            string versionFile = Path.Combine(dir, $"{PackageName}.version");
            if (!File.Exists(versionFile))
            {
                items.Add(new CheckItem("首包清单", CheckStatus.Warn, "未找到首包 .version(尚未打 AB?)。"));
                return;
            }

            string ver = File.ReadAllText(versionFile).Trim();
            string bytes = Path.Combine(dir, $"{PackageName}_{ver}.bytes");
            string hash = Path.Combine(dir, $"{PackageName}_{ver}.hash");
            if (File.Exists(bytes) && File.Exists(hash))
                items.Add(new CheckItem("首包清单", CheckStatus.Pass, $"版本 {ver},.version/.bytes/.hash 齐全。"));
            else
                items.Add(new CheckItem("首包清单", CheckStatus.Fail,
                    $"版本 {ver} 的 manifest 不齐:{(File.Exists(bytes) ? "" : ".bytes 缺 ")}{(File.Exists(hash) ? "" : ".hash 缺")}",
                    "重新打一次 AB。"));
        }

        private static void CheckPlayerOutput(BuildConfig config, bool isWebGL, List<CheckItem> items)
        {
            string outPath = config.PlayerOutputPath;
            if (string.IsNullOrEmpty(outPath))
                return;

            // 带扩展名的按产物文件取其目录:Android 产物名带现算时间戳,检查时这个文件多半还不存在。
            string dir = File.Exists(outPath) || Path.HasExtension(outPath) ? Path.GetDirectoryName(outPath) : outPath;
            if (!Directory.Exists(dir))
            {
                items.Add(new CheckItem("Player 产物", CheckStatus.Warn, $"Player 输出目录不存在(尚未打 Player?):{dir}"));
                return;
            }

            if (isWebGL)
            {
                bool hasIndex = File.Exists(Path.Combine(dir, "index.html"));
                bool hasBuild = Directory.Exists(Path.Combine(dir, "Build"));
                bool hasSa = Directory.Exists(Path.Combine(dir, "StreamingAssets"));
                if (hasIndex && hasBuild && hasSa)
                    items.Add(new CheckItem("Player 产物", CheckStatus.Pass, "index.html + Build/ + StreamingAssets/ 齐全。"));
                else
                    items.Add(new CheckItem("Player 产物", CheckStatus.Warn,
                        $"WebGL 产物不全:{(hasIndex ? "" : "缺 index.html ")}{(hasBuild ? "" : "缺 Build/ ")}{(hasSa ? "" : "缺 StreamingAssets/")}",
                        "重新打 Player;StreamingAssets 缺失说明打 Player 前没打 AB。"));
            }
            else
            {
                items.Add(new CheckItem("Player 产物", CheckStatus.Pass, $"输出目录存在:{dir}"));
            }
        }

        // ---------- 线上检查(CDN 可达性 + 版本一致,联网) ----------

        public static List<CheckItem> RunRemoteChecks(BuildConfig config)
        {
            var items = new List<CheckItem>();
            string cdnBase = ResolveCdnBaseForTarget(config.BuildTarget);
            items.Add(new CheckItem("CDN 地址", CheckStatus.Pass, cdnBase));

            using (var http = new HttpClient { Timeout = TimeSpan.FromSeconds(10) })
            {
                // 本地首包版本(作为一致性基准)
                string localVer = TryReadLocalVersion();

                // CDN 版本文件
                string cdnVerUrl = $"{cdnBase}/{PackageName}.version";
                var (verOk, verCode, verBody) = HttpGet(http, cdnVerUrl);
                if (!verOk)
                {
                    items.Add(new CheckItem("CDN 版本文件", CheckStatus.Fail,
                        $"{cdnVerUrl}\n{verCode}",
                        "AB 没上传或路径不对;点『一键构建+部署 AB』把 AB 传到 CDN。"));
                    return items; // 版本拿不到,后续无从核对
                }

                string cdnVer = (verBody ?? "").Trim();
                items.Add(new CheckItem("CDN 版本文件", CheckStatus.Pass, $"版本 {cdnVer}"));

                // 版本一致性:本地首包 vs CDN
                if (!string.IsNullOrEmpty(localVer))
                {
                    if (localVer == cdnVer)
                        items.Add(new CheckItem("版本一致性", CheckStatus.Pass, $"首包与 CDN 均为 {cdnVer}。"));
                    else
                        items.Add(new CheckItem("版本一致性", CheckStatus.Warn,
                            $"首包版本 {localVer} ≠ CDN 版本 {cdnVer}:Player 内的 DLL bundle 可能与 CDN 清单不匹配(半量部署/漏传其一)。",
                            "AB 与 Player 要同一批打并成对部署:先『一键构建+部署 AB』再『一键构建+部署 Player』。"));
                }

                // CDN manifest 三件套
                string bytesUrl = $"{cdnBase}/{PackageName}_{cdnVer}.bytes";
                string hashUrl = $"{cdnBase}/{PackageName}_{cdnVer}.hash";
                var (bOk, bCode, _) = HttpHead(http, bytesUrl);
                var (hOk, hCode, _) = HttpHead(http, hashUrl);
                if (bOk && hOk)
                    items.Add(new CheckItem("CDN 清单文件", CheckStatus.Pass, ".bytes / .hash 均可达。"));
                else
                    items.Add(new CheckItem("CDN 清单文件", CheckStatus.Fail,
                        $"{(bOk ? "" : $"{bytesUrl} {bCode}\n")}{(hOk ? "" : $"{hashUrl} {hCode}")}",
                        "AB 上传不完整,点『部署 AB』重新上传。"));

                // 抽样非首包 bundle(应在 CDN)
                CheckSampleRemoteBundles(http, config, cdnBase, items);
            }

            return items;
        }

        private static void CheckSampleRemoteBundles(HttpClient http, BuildConfig config, string cdnBase, List<CheckItem> items)
        {
            List<string> firstPackage = new List<string>();
            string saDir = Path.Combine(AssetBundleBuilderHelper.GetStreamingAssetsRoot(), PackageName);
            if (Directory.Exists(saDir))
                firstPackage = Directory.GetFiles(saDir, "*.bundle").Select(Path.GetFileName).ToList();

            string abDir = ReleaseTools.GetAssetBundleOutputDirectory(config);
            if (string.IsNullOrEmpty(abDir) || !Directory.Exists(abDir))
            {
                items.Add(new CheckItem("CDN 非首包抽样", CheckStatus.Warn, "找不到本地 AB 产物目录,跳过非首包抽样。"));
                return;
            }

            var remoteBundles = Directory.GetFiles(abDir, "*.bundle")
                .Select(Path.GetFileName)
                .Where(b => !firstPackage.Contains(b))
                .Take(3)
                .ToList();

            if (remoteBundles.Count == 0)
            {
                items.Add(new CheckItem("CDN 非首包抽样", CheckStatus.Warn, "没有非首包 bundle 可抽样(是否全量进了首包?)。"));
                return;
            }

            var missing = new List<string>();
            foreach (var b in remoteBundles)
            {
                var (ok, code, _) = HttpHead(http, $"{cdnBase}/{b}");
                if (!ok)
                    missing.Add($"{b} {code}");
            }

            if (missing.Count == 0)
                items.Add(new CheckItem("CDN 非首包抽样", CheckStatus.Pass,
                    $"抽样 {remoteBundles.Count} 个非首包 bundle 均可达。"));
            else
                items.Add(new CheckItem("CDN 非首包抽样", CheckStatus.Fail,
                    "非首包 bundle 在 CDN 缺失(非首屏资源会下载不到):\n" + string.Join("\n", missing),
                    "AB 上传不完整,点『部署 AB』重新上传。"));
        }

        private static string TryReadLocalVersion()
        {
            try
            {
                string f = Path.Combine(AssetBundleBuilderHelper.GetStreamingAssetsRoot(), PackageName, $"{PackageName}.version");
                return File.Exists(f) ? File.ReadAllText(f).Trim() : null;
            }
            catch
            {
                return null;
            }
        }

        private static (bool ok, string code, string body) HttpGet(HttpClient http, string url)
        {
            try
            {
                var resp = http.GetAsync(url).GetAwaiter().GetResult();
                string body = resp.IsSuccessStatusCode ? resp.Content.ReadAsStringAsync().GetAwaiter().GetResult() : null;
                return (resp.IsSuccessStatusCode, $"HTTP {(int)resp.StatusCode}", body);
            }
            catch (Exception e)
            {
                return (false, $"请求失败:{e.Message}", null);
            }
        }

        private static (bool ok, string code, string body) HttpHead(HttpClient http, string url)
        {
            try
            {
                using (var req = new HttpRequestMessage(HttpMethod.Head, url))
                {
                    var resp = http.SendAsync(req).GetAwaiter().GetResult();
                    return (resp.IsSuccessStatusCode, $"HTTP {(int)resp.StatusCode}", null);
                }
            }
            catch (Exception e)
            {
                return (false, $"请求失败:{e.Message}", null);
            }
        }
    }
}
