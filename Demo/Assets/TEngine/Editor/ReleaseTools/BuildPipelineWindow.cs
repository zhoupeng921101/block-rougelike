using System;
using System.Collections.Generic;
using System.Linq;
using UnityEditor;
using UnityEngine;
using YooAsset;
using YooAsset.Editor;

namespace TEngine
{
    public class BuildPipelineWindow : EditorWindow
    {
        private static readonly string[] PlatformNames = new string[]
        {
            "Windows 64-bit",
            "macOS",
            "Linux",
            "Android",
            "iOS",
            "WebGL",
        };

        private static readonly BuildTarget[] PlatformTargets = new BuildTarget[]
        {
            BuildTarget.StandaloneWindows64,
            BuildTarget.StandaloneOSX,
            BuildTarget.StandaloneLinux64,
            BuildTarget.Android,
            BuildTarget.iOS,
            BuildTarget.WebGL,
        };

        private static readonly string[] PipelineNames = new string[]
        {
            "ScriptableBuildPipeline (SBP)",
            "BuiltinBuildPipeline (内置)",
        };

        private static readonly string[] CompressNames = new string[]
        {
            "Uncompressed (不压缩)",
            "LZMA (高压缩)",
            "LZ4 (快速压缩)",
        };

        private static readonly string[] EncryptionNames = new string[]
        {
            "无加密",
            "文件偏移加密",
            "文件流加密",
        };

        private static readonly string[] CopyOptionNames = new string[]
        {
            "None (不拷贝)",
            "ClearAndCopyAll (清空后拷贝全部)",
            "ClearAndCopyByTags (清空后按Tag拷贝)",
            "OnlyCopyAll (仅拷贝全部)",
            "OnlyCopyByTags (仅按Tag拷贝)",
        };

        private static readonly string[] FileNameStyleNames = new string[]
        {
            "HashName (哈希名)",
            "BundleName (资源包名称)",
            "BundleName_HashName (资源包名称 + 哈希值名称)",
        };

        // 次序与 EFirstPackageStrategy 的枚举值一一对应,增删档位两处同步。
        private static readonly string[] FirstPackageStrategyNames = new string[]
        {
            "整包内置 (所有资源随包)",
            "最小首包 (只留选中 Tag,其余走 CDN)",
            "自定义 (直接编辑 YooAsset 拷贝参数)",
        };

        private const string CollectorPackageName = "DefaultPackage";

        // 配置状态
        private BuildConfig _config;

        // 采集器里已打过的 Tag,供最小首包档勾选。
        private List<string> _collectorTags;

        // UI 状态
        private Vector2 _scrollPosition;
        private bool _showBasicSettings = true;
        private bool _showFirstPackageSettings = true;
        private bool _showAdvancedSettings;
        private bool _showDllSettings = true;
        private bool _showPlayerSettings;
        private bool _showBuildLog;
        private int _platformIndex;
        private int _playerPlatformIndex;

        // Player 输出只持久化目录;完整落点每次出包经 ResolvePlayerOutputPath 现拼。
        private const string PlayerOutputDirKey = "TEngine_BP_PlayerOutputDir";
        private string _playerOutputDir;

        // 部署设置与上面的输出目录同样存 EditorUserSettings,不存 EditorPrefs,理由见 LoadSettings。
        private const string DeployHostKey = "TEngine_BP_DeployHost";
        private const string DeployUserKey = "TEngine_BP_DeployUser";
        private const string DeployPortKey = "TEngine_BP_DeployPort";
        private const string DeployKeyKey = "TEngine_BP_DeployKey";
        private const string DeployAbRootKey = "TEngine_BP_DeployAbRoot";
        private const string DeployPlayerRootKey = "TEngine_BP_DeployPlayerRoot";
        private const string DeployAbBetaKey = "TEngine_BP_DeployAbBeta";

        // 灰度机制见 .claude/references/tengine/hotfix-workflow.md「灰度发布(IP 白名单)」节:
        // 资源服务器对白名单 IP 把 .version 重写成 .beta.version,其余人读 .version。
        private const string VersionFileName = CollectorPackageName + ".version";
        private const string BetaVersionFileName = CollectorPackageName + ".beta.version";

        // 构建日志
        private List<string> _buildLogs = new List<string>();
        private Vector2 _logScrollPosition;

        // 发布前自检
        private bool _showPreCheck = true;
        private List<ReleasePreCheck.CheckItem> _localCheckResults;
        private List<ReleasePreCheck.CheckItem> _remoteCheckResults;

        // 部署设置（构建后经 Git Bash + ssh/scp 增量上传；地址可在面板填写）
        private bool _showDeploySettings = true;
        private string _deployHost;
        private string _deployUser;
        private string _deployPort;
        private string _deployKey;
        private string _deployAbRemoteRoot;
        private string _deployPlayerRemoteRoot;
        private bool _deployAbBeta;

        // 最近一次「读取远端版本」的结果,只对 _remoteStateDir 这个远端目录有效。
        private string _remoteStateDir;
        private string _remoteBeta;
        private string _remoteFormal;
        private string[] _rollbackCandidates = Array.Empty<string>();
        private int _rollbackIndex;

        [MenuItem("TEngine/Build/打包工具窗口", false, 0)]
        public static void ShowWindow()
        {
            var window = GetWindow<BuildPipelineWindow>("TEngine 打包工具");
            window.minSize = new Vector2(450, 600);
            window.Show();
        }

        private void OnEnable()
        {
            LoadSettings();
        }

        private void OnGUI()
        {
            if (_config == null)
                LoadSettings();

            _scrollPosition = EditorGUILayout.BeginScrollView(_scrollPosition);
            {
                DrawHeader();
                DrawBasicSettings();
                DrawFirstPackageSettings();
                DrawAdvancedSettings();
                DrawDllSettings();
                DrawPlayerSettings();
                DrawDeploySettings();
                DrawPreCheckSection();
                DrawActionButtons();
                DrawBuildLog();
            }
            EditorGUILayout.EndScrollView();
        }

        #region Header

        private void DrawHeader()
        {
            GUILayout.Space(5);

            EditorGUILayout.BeginHorizontal();
            GUILayout.FlexibleSpace();

            var titleStyle = new GUIStyle(EditorStyles.largeLabel)
            {
                fontSize = 16,
                fontStyle = FontStyle.Bold,
                alignment = TextAnchor.MiddleCenter,
            };

            EditorGUILayout.LabelField("TEngine 打包工具", titleStyle, GUILayout.Height(30));
            GUILayout.FlexibleSpace();
            EditorGUILayout.EndHorizontal();

            EditorGUILayout.LabelField("", GUI.skin.horizontalSlider);

            // 刷新按钮
            EditorGUILayout.BeginHorizontal();
            GUILayout.FlexibleSpace();
            if (GUILayout.Button("刷新", GUILayout.Width(60), GUILayout.Height(22)))
            {
                LoadSettings();
            }

            if (GUILayout.Button("重置默认", GUILayout.Width(80), GUILayout.Height(22)))
            {
                _config = BuildConfig.CreateDefault();
                SaveSettings();
                AddLog("已重置为默认配置");
            }

            EditorGUILayout.EndHorizontal();

            GUILayout.Space(5);
        }

        #endregion

        #region 基础设置

        private void DrawBasicSettings()
        {
            _showBasicSettings = EditorGUILayout.BeginFoldoutHeaderGroup(_showBasicSettings,
                new GUIContent("基础设置", "目标平台、构建管线、加密等核心参数"));

            if (_showBasicSettings)
            {
                EditorGUILayout.BeginVertical("HelpBox");
                {
                    // 目标平台
                    _platformIndex = EditorGUILayout.Popup("目标平台", _platformIndex, PlatformNames);
                    _config.BuildTarget = PlatformTargets[_platformIndex];

                    EditorGUILayout.Space(3);

                    // 构建管线
                    int pipelineIndex = _config.BuildPipeline == EBuildPipeline.BuiltinBuildPipeline ? 1 : 0;
                    pipelineIndex = EditorGUILayout.Popup("构建管线", pipelineIndex, PipelineNames);
                    _config.BuildPipeline = pipelineIndex == 1
                        ? EBuildPipeline.BuiltinBuildPipeline
                        : EBuildPipeline.ScriptableBuildPipeline;

                    // 压缩方式
                    _config.CompressOption = (ECompressOption)EditorGUILayout.Popup("压缩方式",
                        (int)_config.CompressOption, CompressNames);

                    // 加密方式
                    _config.EncryptionType = (EncryptionType)EditorGUILayout.Popup("加密方式",
                        (int)_config.EncryptionType, EncryptionNames);

                    EditorGUILayout.Space(3);

                    // 资源版本号
                    EditorGUILayout.BeginHorizontal();
                    _config.PackageVersion = EditorGUILayout.TextField("资源版本号", _config.PackageVersion);
                    if (GUILayout.Button("自动", GUILayout.Width(50)))
                    {
                        _config.PackageVersion = ReleaseTools.ResolveAvailablePackageVersion(_config);
                    }

                    EditorGUILayout.EndHorizontal();

                    // 输出目录
                    EditorGUILayout.BeginHorizontal();
                    _config.OutputRoot = EditorGUILayout.TextField("AB输出目录", _config.OutputRoot);
                    if (GUILayout.Button("浏览", GUILayout.Width(50)))
                    {
                        string selected = EditorUtility.OpenFolderPanel("选择输出目录", _config.OutputRoot, "");
                        if (!string.IsNullOrEmpty(selected))
                        {
                            string projectPath = PathGetRelative(Application.dataPath + "/../", selected);
                            _config.OutputRoot = string.IsNullOrEmpty(projectPath) ? selected : projectPath;
                        }
                    }

                    EditorGUILayout.EndHorizontal();

                    EditorGUILayout.Space(3);
                    EditorGUILayout.HelpBox("选择构建目标平台和基础参数。AB输出目录支持相对路径（相对于项目根目录）。", MessageType.Info);
                }
                EditorGUILayout.EndVertical();
            }

            EditorGUILayout.EndFoldoutHeaderGroup();
            GUILayout.Space(5);
        }

        #endregion

        #region 首包设置

        private void DrawFirstPackageSettings()
        {
            _showFirstPackageSettings = EditorGUILayout.BeginFoldoutHeaderGroup(_showFirstPackageSettings,
                new GUIContent("首包设置", "决定哪些资源随包发布(进 StreamingAssets),哪些留在 CDN 上按需下载"));

            if (_showFirstPackageSettings)
            {
                EditorGUILayout.BeginVertical("HelpBox");
                {
                    var newStrategy = (EFirstPackageStrategy)EditorGUILayout.Popup(
                        "首包策略", (int)_config.FirstPackageStrategy, FirstPackageStrategyNames);
                    if (newStrategy != _config.FirstPackageStrategy)
                    {
                        _config.FirstPackageStrategy = newStrategy;
                        _config.ApplyFirstPackageStrategy();
                    }

                    EditorGUILayout.Space(3);

                    switch (_config.FirstPackageStrategy)
                    {
                        case EFirstPackageStrategy.All:
                            EditorGUILayout.HelpBox(
                                "所有 bundle 进 StreamingAssets,启动与运行都不依赖 CDN。首包体积最大。",
                                MessageType.Info);
                            break;
                        case EFirstPackageStrategy.Minimal:
                            DrawFirstPackageTagPicker();
                            break;
                        case EFirstPackageStrategy.Custom:
                            DrawCustomCopySettings();
                            break;
                    }
                }
                EditorGUILayout.EndVertical();
            }

            EditorGUILayout.EndFoldoutHeaderGroup();
            GUILayout.Space(5);
        }

        private void DrawFirstPackageTagPicker()
        {
            EditorGUILayout.BeginHorizontal();
            EditorGUILayout.LabelField("进首包的 Tag");
            if (GUILayout.Button("重新读取采集器", GUILayout.Width(120)))
            {
                _collectorTags = ReadCollectorTags();
            }

            EditorGUILayout.EndHorizontal();

            if (_collectorTags == null)
            {
                _collectorTags = ReadCollectorTags();
            }

            if (_collectorTags.Count == 0)
            {
                EditorGUILayout.HelpBox(
                    "采集器里一个 Tag 都没有。先在 YooAsset 采集器窗口给分组打 Tag(覆盖热更 DLL 的那个组必须打),否则首包会是空的。",
                    MessageType.Error);
                return;
            }

            var selected = new HashSet<string>(SplitTags(_config.BuildinFileCopyParams));
            // 采集器里已不存在的 Tag(如从自定义档切过来时带的)勾不出来,留着会让下方提示行与勾选状态对不上。
            bool changed = selected.RemoveWhere(t => !_collectorTags.Contains(t)) > 0;
            EditorGUI.indentLevel++;
            foreach (string tag in _collectorTags)
            {
                bool was = selected.Contains(tag);
                bool now = EditorGUILayout.ToggleLeft(tag, was);
                if (now == was)
                    continue;

                if (now)
                    selected.Add(tag);
                else
                    selected.Remove(tag);
                changed = true;
            }

            EditorGUI.indentLevel--;

            if (changed)
            {
                var ordered = new List<string>();
                foreach (string tag in _collectorTags)
                {
                    if (selected.Contains(tag))
                        ordered.Add(tag);
                }

                _config.BuildinFileCopyParams = string.Join(";", ordered);
            }

            EditorGUILayout.Space(3);
            if (string.IsNullOrWhiteSpace(_config.BuildinFileCopyParams))
            {
                EditorGUILayout.HelpBox(
                    "一个 Tag 都没勾:首包不会有任何 bundle,等同「不拷贝」,运行时资源初始化必失败。至少勾上覆盖热更 DLL 的那个 Tag。",
                    MessageType.Error);
            }
            else
            {
                EditorGUILayout.HelpBox(
                    $"首包只含带 [{_config.BuildinFileCopyParams}] Tag 的 bundle,其余从 CDN 下载。",
                    MessageType.Info);
            }
        }

        private void DrawCustomCopySettings()
        {
            _config.BuildinFileCopyOption = (EBuildinFileCopyOption)EditorGUILayout.Popup(
                "内置文件拷贝", (int)_config.BuildinFileCopyOption, CopyOptionNames);

            bool isByTags = _config.BuildinFileCopyOption == EBuildinFileCopyOption.ClearAndCopyByTags
                            || _config.BuildinFileCopyOption == EBuildinFileCopyOption.OnlyCopyByTags;
            if (isByTags)
            {
                _config.BuildinFileCopyParams = EditorGUILayout.TextField(
                    new GUIContent("首包保留Tag", "带这些 Tag 的 bundle 进首包,其余走 CDN。多个用分号分隔,如 buildin"),
                    _config.BuildinFileCopyParams);
            }

            EditorGUILayout.Space(3);
            EditorGUILayout.HelpBox(
                "自定义档不受策略约束。配错的组合(None、或 ByTags 但 Tag 为空)会在构建前置检查里被拦下。",
                MessageType.None);
        }

        /// <summary>读采集器里 DefaultPackage 下已打过的全部 Tag(分组与收集器两层),按名排序。</summary>
        private static List<string> ReadCollectorTags()
        {
            try
            {
                var pkg = AssetBundleCollectorSettingData.Setting.Packages
                    .Find(p => p.PackageName == CollectorPackageName);
                if (pkg == null)
                    return new List<string>();

                var tags = pkg.GetAllTags();
                tags.Sort(StringComparer.OrdinalIgnoreCase);
                return tags;
            }
            catch (Exception e)
            {
                Debug.LogWarning($"[打包工具] 读取采集器 Tag 失败: {e.Message}");
                return new List<string>();
            }
        }

        /// <summary>把 YooAsset 的 Tag 参数串(分号或空格分隔)拆成列表。</summary>
        private static List<string> SplitTags(string raw)
        {
            var result = new List<string>();
            if (string.IsNullOrWhiteSpace(raw))
                return result;

            foreach (string part in raw.Split(new[] { ';', ' ' }, StringSplitOptions.RemoveEmptyEntries))
            {
                string tag = part.Trim();
                if (tag.Length > 0)
                    result.Add(tag);
            }

            return result;
        }

        #endregion

        #region 高级设置

        private void DrawAdvancedSettings()
        {
            _showAdvancedSettings = EditorGUILayout.BeginFoldoutHeaderGroup(_showAdvancedSettings,
                new GUIContent("高级设置", "共享打包、依赖数据库、增量构建等"));

            if (_showAdvancedSettings)
            {
                EditorGUILayout.BeginVertical("HelpBox");
                {
                    _config.EnableSharePackRule = EditorGUILayout.ToggleLeft(
                        new GUIContent("启用共享资源打包", "自动提取共享资源到独立bundle"),
                        _config.EnableSharePackRule);

                    _config.UseAssetDependencyDB = EditorGUILayout.ToggleLeft(
                        new GUIContent("使用资源依赖数据库", "提高打包速度"),
                        _config.UseAssetDependencyDB);

                    _config.ClearBuildCache = EditorGUILayout.ToggleLeft(
                        new GUIContent("清理构建缓存(禁用增量构建)", "全量重新构建"),
                        _config.ClearBuildCache);

                    _config.VerifyBuildingResult = EditorGUILayout.ToggleLeft(
                        new GUIContent("验证构建结果", "构建后验证资源完整性"),
                        _config.VerifyBuildingResult);

                    EditorGUILayout.Space(3);

                    _config.FileNameStyle = (EFileNameStyle)EditorGUILayout.Popup(
                        "文件名风格", (int)_config.FileNameStyle, FileNameStyleNames);

                    if (_config.BuildTarget == BuildTarget.WebGL
                        && _config.FileNameStyle == EFileNameStyle.BundleName)
                    {
                        EditorGUILayout.HelpBox(
                            "BundleName 给 bundle 固定文件名,内容变了 URL 不变,CDN 会用旧缓存冒充新文件、导致 CRC Mismatch。" +
                            "WebGL 部署请改用 BundleName_HashName 或 HashName(文件名带内容哈希)。",
                            MessageType.Warning);
                    }
                }
                EditorGUILayout.EndVertical();
            }

            EditorGUILayout.EndFoldoutHeaderGroup();
            GUILayout.Space(5);
        }

        #endregion

        #region 热更DLL设置

        private void DrawDllSettings()
        {
            _showDllSettings = EditorGUILayout.BeginFoldoutHeaderGroup(_showDllSettings,
                new GUIContent("热更DLL设置", "HybridCLR 热更程序集编译"));

            if (_showDllSettings)
            {
                EditorGUILayout.BeginVertical("HelpBox");
                {
                    _config.BuildHotFixDll = EditorGUILayout.ToggleLeft(
                        new GUIContent("构建前编译热更DLL",
                            "本次要出 Player 时跑 HybridCLR 完整生成链(含裁剪 AOT dll),只出 AB 时仅编译热更程序集;" +
                            "两条路都把 dll 拷成 .dll.bytes 进采集器 DLL 组。需要 ENABLE_HYBRIDCLR 宏已定义。"),
                        _config.BuildHotFixDll);
                }
                EditorGUILayout.EndVertical();
            }

            EditorGUILayout.EndFoldoutHeaderGroup();
            GUILayout.Space(5);
        }

        #endregion

        #region 打包Player设置

        private void DrawPlayerSettings()
        {
            _showPlayerSettings = EditorGUILayout.BeginFoldoutHeaderGroup(_showPlayerSettings,
                new GUIContent("打包Player设置", "构建可执行程序"));

            if (_showPlayerSettings)
            {
                EditorGUILayout.BeginVertical("HelpBox");
                {
                    int pickedPlatform = EditorGUILayout.Popup("Player平台", _playerPlatformIndex, PlatformNames);
                    if (pickedPlatform != _playerPlatformIndex)
                    {
                        SwitchPlayerPlatform(pickedPlatform);
                    }

                    _config.PlayerPlatform = PlatformTargets[_playerPlatformIndex];

                    EditorGUILayout.BeginHorizontal();
                    _playerOutputDir = EditorGUILayout.TextField("输出目录", _playerOutputDir);
                    if (GUILayout.Button("浏览", GUILayout.Width(50)))
                    {
                        string selected = EditorUtility.OpenFolderPanel("选择输出目录", _playerOutputDir, "");
                        if (!string.IsNullOrEmpty(selected))
                        {
                            _playerOutputDir = selected;
                        }
                    }

                    EditorGUILayout.EndHorizontal();

                    string leafName = BuildConfig.GetPlayerOutputLeafName(_config.PlayerPlatform);
                    EditorGUILayout.LabelField(" ",
                        string.IsNullOrEmpty(leafName) ? "产物直接输出到该目录" : $"产物名出包时生成,如 {leafName}",
                        EditorStyles.miniLabel);

                    if (_config.PlayerPlatform == BuildTarget.iOS)
                    {
                        DrawXcodeShareDir();
                    }
                }
                EditorGUILayout.EndVertical();
            }

            EditorGUILayout.EndFoldoutHeaderGroup();
            GUILayout.Space(5);
        }

        /// <summary>
        /// iOS 出包后同步 Xcode 工程的共享目录。改动即写入本机设置:菜单出包不开本窗口也要读到它。
        /// </summary>
        private void DrawXcodeShareDir()
        {
            EditorGUILayout.BeginHorizontal();
            string current = XcodeProjectShareSync.ShareDir;
            string edited = EditorGUILayout.TextField(
                new GUIContent("Xcode 共享目录", "iOS 出包成功后把 Xcode 工程镜像同步到这里的 XCode_Project 子目录;留空不同步。只存本机,不入库。"),
                current);
            if (GUILayout.Button("浏览", GUILayout.Width(50)))
            {
                string selected = EditorUtility.OpenFolderPanel("选择共享目录", current, "");
                if (!string.IsNullOrEmpty(selected))
                {
                    edited = selected;
                }
            }

            EditorGUILayout.EndHorizontal();
            if (edited != current)
            {
                XcodeProjectShareSync.ShareDir = edited;
            }

            EditorGUILayout.LabelField(" ",
                string.IsNullOrWhiteSpace(edited)
                    ? "留空:出包后不同步"
                    : $"镜像到 {XcodeProjectShareSync.GetDestinationDir(edited)}(该目录里本地没有的文件会被删掉)",
                EditorStyles.miniLabel);
        }

        /// <summary>
        /// 切换 Player 目标平台，并把输出目录跟着切到新平台的默认目录。
        /// </summary>
        /// <param name="newIndex">新平台在 <see cref="PlatformTargets"/> 里的下标。</param>
        /// <remarks>
        /// 只在输出目录还是旧平台的默认目录时才跟随，用户自己挪过位置的保留。
        /// 不跟随的后果：输出目录是持久化的，会一直留着上一个平台的值，Android 包落进 WebGL 目录。
        /// </remarks>
        private void SwitchPlayerPlatform(int newIndex)
        {
            BuildTarget oldTarget = PlatformTargets[_playerPlatformIndex];
            BuildTarget newTarget = PlatformTargets[newIndex];

            string currentDir = NormalizeDir(_playerOutputDir);
            bool untouched = string.IsNullOrEmpty(currentDir)
                             || string.Equals(currentDir, NormalizeDir(BuildConfig.GetDefaultPlayerOutputDir(oldTarget)),
                                 StringComparison.OrdinalIgnoreCase);
            if (untouched)
            {
                _playerOutputDir = BuildConfig.GetDefaultPlayerOutputDir(newTarget);
            }

            _playerPlatformIndex = newIndex;
            _config.PlayerPlatform = newTarget;
        }

        /// <summary>
        /// 把目录归一成可比较的绝对路径（正斜杠、无尾分隔符），用于判断用户有没有挪过输出位置。
        /// </summary>
        private static string NormalizeDir(string dir)
        {
            if (string.IsNullOrWhiteSpace(dir))
            {
                return string.Empty;
            }

            try
            {
                return System.IO.Path.GetFullPath(dir).Replace('\\', '/').TrimEnd('/');
            }
            catch
            {
                return string.Empty;
            }
        }

        /// <summary>
        /// 按当前输出目录与平台现拼本次出包落点，写回 <see cref="BuildConfig.PlayerOutputPath"/>。
        /// </summary>
        /// <remarks>
        /// 凡读 <see cref="BuildConfig.PlayerOutputPath"/> 的动作（出包、部署、本地检查）开头都要调一次：
        /// 产物名按调用时刻现算，沿用上次的值会让这次出包覆盖上一个包。
        /// </remarks>
        private void ResolvePlayerOutputPath()
        {
            _config.PlayerOutputPath = BuildConfig.ComposePlayerOutputPath(_playerOutputDir, _config.PlayerPlatform);
        }

        #endregion

        #region 部署设置

        private void DrawDeploySettings()
        {
            _showDeploySettings = EditorGUILayout.BeginFoldoutHeaderGroup(_showDeploySettings,
                new GUIContent("部署设置", "构建后经 Git Bash + ssh/scp 增量上传到远程服务器"));

            if (_showDeploySettings)
            {
                EditorGUILayout.BeginVertical("HelpBox");
                {
                    EditorGUILayout.HelpBox(
                        "主机与远程目录默认留空。填好 AB / Player 实际部署服务器的地址、用户、私钥与目录后再部署。",
                        MessageType.Info);

                    _deployHost = EditorGUILayout.TextField(
                        new GUIContent("服务器地址", "SSH 主机 IP 或 ~/.ssh/config 别名"), _deployHost);
                    _deployUser = EditorGUILayout.TextField(
                        new GUIContent("用户名", "SSH 用户名，默认 root"), _deployUser);
                    _deployPort = EditorGUILayout.TextField(
                        new GUIContent("SSH 端口", "默认 22"), _deployPort);

                    EditorGUILayout.BeginHorizontal();
                    _deployKey = EditorGUILayout.TextField(
                        new GUIContent("私钥路径", "SSH 私钥(.pem)文件路径；留空则用本机默认 ssh 配置"), _deployKey);
                    if (GUILayout.Button("浏览", GUILayout.Width(50)))
                    {
                        string selected = EditorUtility.OpenFilePanel("选择 SSH 私钥文件", "", "");
                        if (!string.IsNullOrEmpty(selected))
                        {
                            _deployKey = selected;
                        }
                    }

                    EditorGUILayout.EndHorizontal();

                    EditorGUILayout.Space(3);
                    EditorGUILayout.LabelField("上传地址（只填基路径，平台段自动拼）", EditorStyles.boldLabel);
                    _deployAbRemoteRoot = EditorGUILayout.TextField(
                        new GUIContent("AB 基路径", "AB 远程根目录；实际目标 = 基路径/项目名/平台名"), _deployAbRemoteRoot);
                    EditorGUILayout.LabelField(" ", $"→ {ResolveAbRemoteDir(_config.BuildTarget)}", EditorStyles.miniLabel);

                    _deployPlayerRemoteRoot = EditorGUILayout.TextField(
                        new GUIContent("Player 基路径", "Player 远程根目录；实际目标 = 基路径/平台名"), _deployPlayerRemoteRoot);
                    EditorGUILayout.LabelField(" ", $"→ {ResolvePlayerRemoteDir(_config.PlayerPlatform)}", EditorStyles.miniLabel);

                    EditorGUILayout.Space(3);
                    EditorGUILayout.LabelField("AB 灰度发布", EditorStyles.boldLabel);
                    _deployAbBeta = EditorGUILayout.ToggleLeft(
                        new GUIContent("灰度发布 AB",
                            $"开启后部署 AB 不上传 {VersionFileName},改写 {BetaVersionFileName}:只有资源服务器白名单 IP 拿到新版本"),
                        _deployAbBeta);
                    EditorGUILayout.HelpBox(
                        _deployAbBeta
                            ? $"灰度中:部署 AB 只写 {BetaVersionFileName},正式玩家不受影响。验证通过后点『放全量』。"
                            : $"全量:部署 AB 会直接改写 {VersionFileName},所有玩家下次启动即更新。",
                        _deployAbBeta ? MessageType.Info : MessageType.Warning);
                    if (GUILayout.Button("放全量(beta 版本号 → 正式版本号)", GUILayout.Height(24)))
                    {
                        SaveSettings();
                        RunAfterGUI(ExecutePromoteAssetBundle);
                    }

                    DrawRollbackSection();
                }
                EditorGUILayout.EndVertical();
            }

            EditorGUILayout.EndFoldoutHeaderGroup();
            GUILayout.Space(5);
        }

        private void DrawRollbackSection()
        {
            EditorGUILayout.Space(3);
            EditorGUILayout.LabelField("AB 版本回滚", EditorStyles.boldLabel);
            if (GUILayout.Button("读取远端版本", GUILayout.Height(22)))
            {
                SaveSettings();
                RunAfterGUI(ExecuteReadRemoteVersions);
            }

            if (_remoteStateDir == null || _remoteStateDir != ResolveAbRemoteDir(_config.BuildTarget))
            {
                EditorGUILayout.HelpBox("先点『读取远端版本』:回滚以读到的远端状态为准。", MessageType.None);
                return;
            }

            string formalText = string.IsNullOrEmpty(_remoteFormal) ? "(无)" : _remoteFormal;
            string betaText = string.IsNullOrEmpty(_remoteBeta) ? "(无)" : _remoteBeta;
            EditorGUILayout.LabelField("远端版本号", $"正式 {formalText} | beta {betaText}");

            bool canRollbackBeta = !string.IsNullOrEmpty(_remoteBeta) && !string.IsNullOrEmpty(_remoteFormal)
                                   && _remoteBeta != _remoteFormal;
            using (new EditorGUI.DisabledScope(!canRollbackBeta))
            {
                if (GUILayout.Button($"回滚灰度(beta → 正式号 {formalText})", GUILayout.Height(24)))
                {
                    RunAfterGUI(ExecuteRollbackBeta);
                }
            }

            if (_rollbackCandidates.Length == 0 || string.IsNullOrEmpty(_remoteFormal))
            {
                EditorGUILayout.LabelField(" ", "没有可回滚的正式历史版本", EditorStyles.miniLabel);
                return;
            }

            _rollbackIndex = Mathf.Clamp(_rollbackIndex, 0, _rollbackCandidates.Length - 1);
            _rollbackIndex = EditorGUILayout.Popup(
                new GUIContent("回滚正式到", "远端现存的历史版本,新上传的在前"), _rollbackIndex, _rollbackCandidates);
            if (GUILayout.Button($"回滚正式({formalText} → {_rollbackCandidates[_rollbackIndex]})", GUILayout.Height(24)))
            {
                RunAfterGUI(ExecuteRollbackFormal);
            }
        }

        #endregion

        #region 操作按钮

        #region 发布前自检

        private void DrawPreCheckSection()
        {
            _showPreCheck = EditorGUILayout.BeginFoldoutHeaderGroup(_showPreCheck,
                new GUIContent("发布前自检", "把打包/发布反复踩的坑固化成检查项:本地(配置+产物)与线上(CDN 可达+版本一致)"));

            if (_showPreCheck)
            {
                EditorGUILayout.BeginVertical("HelpBox");
                {
                    EditorGUILayout.HelpBox(
                        "发布流程(WebGL + CDN),按序执行:\n" +
                        "① 首包设置:首包策略 = 最小首包,勾上覆盖热更 DLL 的 Tag;高级设置:文件名风格 = BundleName_HashName\n" +
                        "② 点『本地检查』→ 全绿再继续(配置类检查在构建与部署时会自动跑,Fail 即中止)\n" +
                        "③ 点『一键构建+部署 AB』(必须在前)\n" +
                        "④ 点『一键构建+部署 Player』(必须在后:AB 与 Player 版本要对齐,顺序反了会漏)\n" +
                        "⑤ 点『线上检查』→ 确认 CDN 版本一致、非首包 bundle 可达",
                        MessageType.None);
                    GUILayout.Space(3);

                    EditorGUILayout.BeginHorizontal();
                    if (GUILayout.Button("本地检查(配置+产物)", GUILayout.Height(26)))
                    {
                        ResolvePlayerOutputPath();
                        _localCheckResults = ReleasePreCheck.RunLocalChecks(_config);
                    }

                    if (GUILayout.Button("线上检查(CDN)", GUILayout.Height(26)))
                    {
                        try
                        {
                            EditorUtility.DisplayProgressBar("发布前自检", "正在核对线上 CDN...", 0.5f);
                            _remoteCheckResults = ReleasePreCheck.RunRemoteChecks(_config);
                        }
                        finally
                        {
                            EditorUtility.ClearProgressBar();
                        }
                    }

                    EditorGUILayout.EndHorizontal();

                    DrawCheckResults("本地", _localCheckResults);
                    DrawCheckResults("线上", _remoteCheckResults);
                }
                EditorGUILayout.EndVertical();
            }

            EditorGUILayout.EndFoldoutHeaderGroup();
            GUILayout.Space(5);
        }

        private void DrawCheckResults(string group, List<ReleasePreCheck.CheckItem> results)
        {
            if (results == null)
                return;

            int fail = 0, warn = 0;
            foreach (var r in results)
            {
                if (r.Status == ReleasePreCheck.CheckStatus.Fail) fail++;
                else if (r.Status == ReleasePreCheck.CheckStatus.Warn) warn++;
            }

            EditorGUILayout.LabelField($"{group}检查:{results.Count} 项,失败 {fail},警告 {warn}", EditorStyles.boldLabel);

            foreach (var r in results)
            {
                var type = r.Status == ReleasePreCheck.CheckStatus.Fail ? MessageType.Error
                    : r.Status == ReleasePreCheck.CheckStatus.Warn ? MessageType.Warning
                    : MessageType.Info;
                string text = $"{r.Name}:{r.Message}";
                if (!string.IsNullOrEmpty(r.Fix))
                    text += $"\n→ 修复:{r.Fix}";
                EditorGUILayout.HelpBox(text, type);
            }
        }

        #endregion

        private void DrawActionButtons()
        {
            EditorGUILayout.LabelField("", GUI.skin.horizontalSlider);
            GUILayout.Space(5);

            // 主按钮行在
            EditorGUILayout.BeginHorizontal();
            {
                var abStyle = new GUIStyle(GUI.skin.button)
                {
                    fontSize = 13,
                    fontStyle = FontStyle.Bold,
                };

                if (GUILayout.Button("构建 AssetBundle", abStyle, GUILayout.Height(35)))
                {
                    SaveSettings();
                    RunAfterGUI(ExecuteBuildAssetBundleOnly);
                }

                if (GUILayout.Button("构建 Player", abStyle, GUILayout.Height(35)))
                {
                    SaveSettings();
                    RunAfterGUI(ExecuteBuildPlayerOnly);
                }
            }
            EditorGUILayout.EndHorizontal();

            // 部署按钮:只上传现有产物、不构建,与上一行构建按钮左右对应
            var uploadStyle = new GUIStyle(GUI.skin.button)
            {
                fontSize = 13,
                fontStyle = FontStyle.Bold,
                normal = { textColor = new Color(0.2f, 0.6f, 1f) },
            };

            EditorGUILayout.BeginHorizontal();
            {
                if (GUILayout.Button(_deployAbBeta ? "部署 AB(灰度)" : "部署 AB", uploadStyle, GUILayout.Height(35)))
                {
                    SaveSettings();
                    RunAfterGUI(ExecuteUploadAssetBundle);
                }

                if (GUILayout.Button("部署 Player", uploadStyle, GUILayout.Height(35)))
                {
                    SaveSettings();
                    RunAfterGUI(ExecuteUploadPlayer);
                }
            }
            EditorGUILayout.EndHorizontal();

            GUILayout.Space(5);

            // 一键部署按钮（构建 + 上传到远程）
            var deployStyle = new GUIStyle(GUI.skin.button)
            {
                fontSize = 13,
                fontStyle = FontStyle.Bold,
                normal = { textColor = new Color(1f, 0.6f, 0.2f) },
            };

            EditorGUILayout.BeginHorizontal();
            {
                if (GUILayout.Button(_deployAbBeta ? "一键构建+部署 AB(灰度)" : "一键构建+部署 AB", deployStyle, GUILayout.Height(35)))
                {
                    SaveSettings();
                    RunAfterGUI(ExecuteDeployAssetBundle);
                }

                if (GUILayout.Button("一键构建+部署 Player", deployStyle, GUILayout.Height(35)))
                {
                    SaveSettings();
                    RunAfterGUI(ExecuteDeployPlayer);
                }
            }
            EditorGUILayout.EndHorizontal();

            GUILayout.Space(5);
        }

        /// <summary>
        /// 把构建动作推迟到本次 GUI 事件处理结束之后执行。
        /// </summary>
        /// <remarks>
        /// 构建耗时数分钟,且 <see cref="UnityEditor.BuildPipeline.BuildPlayer(BuildPlayerOptions)"/> 内部会推进
        /// 编辑器循环、重置 IMGUI 布局栈。直接在按钮回调里跑,等它返回时 <see cref="OnGUI"/> 尚未执行的
        /// <c>End*</c> 已找不到配对的 <c>Begin*</c>,每次构建结束都会刷出两条 EndLayoutGroup 报错。
        /// 新增构建/部署入口一律经本方法调起,不在按钮回调里直接执行。
        /// </remarks>
        private static void RunAfterGUI(Action action)
        {
            EditorApplication.delayCall += () => action();
        }

        #endregion

        #region 构建日志

        private void DrawBuildLog()
        {
            _showBuildLog = EditorGUILayout.BeginFoldoutHeaderGroup(_showBuildLog,
                new GUIContent($"构建日志 ({_buildLogs.Count})", "构建过程的日志输出"));

            if (_showBuildLog)
            {
                EditorGUILayout.BeginVertical("HelpBox");
                {
                    if (GUILayout.Button("清空日志", GUILayout.Height(22)))
                    {
                        _buildLogs.Clear();
                    }

                    _logScrollPosition = EditorGUILayout.BeginScrollView(_logScrollPosition, GUILayout.Height(150));
                    {
                        foreach (var log in _buildLogs)
                        {
                            EditorGUILayout.SelectableLabel(log, EditorStyles.miniLabel,
                                GUILayout.Height(EditorStyles.miniLabel.CalcHeight(new GUIContent(log), position.width - 30)));
                        }
                    }
                    EditorGUILayout.EndScrollView();
                }
                EditorGUILayout.EndVertical();
            }

            EditorGUILayout.EndFoldoutHeaderGroup();
        }

        #endregion

        #region 构建前置闸

        /// <summary>
        /// 构建/部署共用的前置闸：Play 模式、编辑器设置未落盘、配置类自检三项，任一不过即中止。
        /// </summary>
        /// <returns>true 表示可继续。</returns>
        /// <remarks>
        /// 闸放在解析资源版本号之前，被拦下时不消耗版本号。
        /// Play 模式下构建会中途失败，而此时 StreamingAssets 已被改写，留下半套首包。
        /// 配置类自检放在设置落盘之后：自检读的 UpdateSetting 取值须是本次要打包的那一份。
        /// </remarks>
        private bool PassPreflight()
        {
            if (EditorApplication.isPlaying)
            {
                const string msg = "编辑器处于 Play 模式，已中止。停止运行后再构建。";
                AddLog($"[错误] {msg}");
                EditorUtility.DisplayDialog("构建中止", msg, "知道了");
                return false;
            }

            if (!ConfirmProjectSettingsFlushed())
            {
                return false;
            }

            return PassConfigChecks();
        }

        /// <summary>
        /// 跑发布前自检的配置类检查项（不含构建产物）。Fail 直接中止，Warn 弹窗让用户确认后可继续。
        /// </summary>
        /// <returns>true 表示可继续。</returns>
        private bool PassConfigChecks()
        {
            List<ReleasePreCheck.CheckItem> items = ReleasePreCheck.RunConfigChecks(_config);
            _localCheckResults = items;
            _showPreCheck = true;

            var fails = new List<ReleasePreCheck.CheckItem>();
            var warns = new List<ReleasePreCheck.CheckItem>();
            foreach (var item in items)
            {
                if (item.Status == ReleasePreCheck.CheckStatus.Fail)
                    fails.Add(item);
                else if (item.Status == ReleasePreCheck.CheckStatus.Warn)
                    warns.Add(item);
            }

            if (fails.Count > 0)
            {
                string detail = DescribeCheckItems(fails);
                AddLog($"[错误] 配置检查未过，已中止：\n{detail}");
                EditorUtility.DisplayDialog("配置检查未过，已中止", detail, "知道了");
                return false;
            }

            if (warns.Count > 0)
            {
                string detail = DescribeCheckItems(warns);
                AddLog($"[提示] 配置检查有警告：\n{detail}");
                return EditorUtility.DisplayDialog("配置检查有警告",
                    detail + "\n\n确认这些警告可以接受再继续。", "确认，继续", "取消");
            }

            return true;
        }

        private static string DescribeCheckItems(List<ReleasePreCheck.CheckItem> items)
        {
            var sb = new System.Text.StringBuilder();
            foreach (var item in items)
            {
                sb.AppendLine($"[{item.Name}] {item.Message}");
                if (!string.IsNullOrEmpty(item.Fix))
                {
                    sb.AppendLine($"    修复：{item.Fix}");
                }
            }

            return sb.ToString().TrimEnd();
        }

        /// <summary>
        /// 把编辑器内存里的设置落盘，并把落盘带出的 ProjectSettings 变化报给用户确认。
        /// </summary>
        /// <returns>true 表示可继续（无变化，或用户确认了变化）。</returns>
        /// <remarks>
        /// 落盘前后 ProjectSettings.asset 有差异，说明编辑器里改过设置但没保存——不落盘就打包，
        /// 用的是内存值、与仓库里的配置不符，而 git diff 里看不出来。
        /// Play 模式下改过的 PlayerSettings 会在退出 Play 时回滚，回滚值同样从这里显形。
        /// </remarks>
        private bool ConfirmProjectSettingsFlushed()
        {
            string path = System.IO.Path.GetFullPath(Application.dataPath + "/../ProjectSettings/ProjectSettings.asset");
            string before = ReadAllTextOrNull(path);
            AssetDatabase.SaveAssets();
            string after = ReadAllTextOrNull(path);

            if (before == null || after == null || before == after)
            {
                return true;
            }

            List<string> changes = DescribeLineChanges(before, after, maxLines: 10);
            AddLog("[提示] 编辑器里有未保存的工程设置，已落盘。变化：");
            foreach (string line in changes)
            {
                AddLog($"    {line}");
            }

            return EditorUtility.DisplayDialog(
                "工程设置已落盘",
                "编辑器里有改过但没保存的工程设置，刚刚已写入 ProjectSettings.asset：\n\n" +
                string.Join("\n", changes) + "\n\n" +
                "确认这些值就是本次要打包的配置再继续；不对就取消，改好设置后重来。",
                "确认，继续", "取消");
        }

        /// <summary>逐行比对两份文本，返回「第 N 行: 旧 → 新」的差异描述，最多 <paramref name="maxLines"/> 条。</summary>
        private static List<string> DescribeLineChanges(string before, string after, int maxLines)
        {
            var result = new List<string>();
            string[] a = before.Split('\n');
            string[] b = after.Split('\n');
            if (a.Length != b.Length)
            {
                result.Add($"文件行数由 {a.Length} 变为 {b.Length}（增删了配置项）。");
                return result;
            }

            for (int i = 0; i < a.Length && result.Count < maxLines; i++)
            {
                if (a[i] != b[i])
                {
                    result.Add($"第 {i + 1} 行: {a[i].Trim()} → {b[i].Trim()}");
                }
            }

            if (result.Count == 0)
            {
                result.Add("（内容有差异但逐行未定位到，可能只是行尾差异）");
            }

            return result;
        }

        private static string ReadAllTextOrNull(string path)
        {
            try
            {
                return System.IO.File.Exists(path) ? System.IO.File.ReadAllText(path) : null;
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// 构建流程收尾：解绑日志、成功时落定资源版本号、刷新窗口。可重复调用。
        /// </summary>
        /// <param name="ok">构建是否成功。</param>
        /// <param name="commitVersion">成功时是否把资源版本号写回仓内 json；只构建 Player 的流程不产资源，传 false。</param>
        private void FinishBuild(bool ok, bool commitVersion)
        {
            Application.logMessageReceived -= OnBuildLogReceived;

            if (ok && commitVersion && PackageVersionStore.Commit(_config.PackageVersion))
            {
                AddLog($"资源版本号已落定: {_config.PackageVersion}");
            }

            AddLog(ok ? "========== 完成 ==========" : "========== 失败，产物未生成 ==========");
            _showBuildLog = true;
            Repaint();
        }

        /// <summary>AB 的远程目标目录 = 基路径 / 项目名 / 平台名，与客户端下载地址同一套拼法。</summary>
        private string ResolveAbRemoteDir(BuildTarget target)
        {
            return $"{(_deployAbRemoteRoot ?? string.Empty).TrimEnd('/')}/" +
                   $"{Settings.UpdateSetting.ProjectName}/{BuildConfig.GetPlatformFolderName(target)}";
        }

        /// <summary>Player 的远程目标目录 = 基路径 / 平台名。Player 不按项目名分目录。</summary>
        private string ResolvePlayerRemoteDir(BuildTarget target)
        {
            return $"{(_deployPlayerRemoteRoot ?? string.Empty).TrimEnd('/')}/{BuildConfig.GetPlatformFolderName(target)}";
        }

        #endregion

        #region 构建执行

        /// <summary>
        /// 构建/部署前解析并确认资源版本号:版本号为空则自动生成;若该版本的输出目录已存在则弹窗要求显式确认。
        /// YooAsset 构建准备阶段拒绝写入已存在的版本目录(ErrorCode115),未 bump 版本又不清目录会直接构建失败;
        /// 资源有改动应 bump 新版本(否则客户端命中旧缓存 / 清单哈希不匹配),仅重打同一份产物时才覆盖(先删旧目录再重建)。
        /// </summary>
        /// <returns>true 表示可继续;false 表示用户取消,调用方应中止并做 UI 收尾。</returns>
        private bool ResolveAndConfirmPackageVersion()
        {
            if (string.IsNullOrWhiteSpace(_config.PackageVersion))
            {
                _config.PackageVersion = ReleaseTools.ResolveAvailablePackageVersion(_config);
                AddLog($"版本号为空，自动生成: {_config.PackageVersion}");
            }

            string versionDir = ReleaseTools.GetVersionOutputDirectory(_config);
            if (!System.IO.Directory.Exists(versionDir))
            {
                return true;
            }

            int choice = EditorUtility.DisplayDialogComplex(
                "资源版本号确认",
                $"版本号 [{_config.PackageVersion}] 的输出目录已存在:\n{versionDir}\n\n" +
                "若本次资源有改动,应先 bump 版本号——否则客户端可能命中旧缓存,或清单哈希不匹配导致加载失败。\n" +
                "仅在重打同一份产物时才应覆盖当前版本(会先删除该目录再重建)。",
                "生成新版本号并继续", // 返回 0
                "取消", // 返回 1
                "覆盖当前版本继续"); // 返回 2
            if (choice == 1)
            {
                AddLog("已取消(资源版本号未确认)。");
                return false;
            }

            if (choice == 0)
            {
                _config.PackageVersion = ReleaseTools.ResolveAvailablePackageVersion(_config);
                SaveSettings();
                AddLog($"已生成新版本号: {_config.PackageVersion}");
                return true;
            }

            // choice == 2:覆盖——删除已存在的版本目录,YooAsset 才不会因目录已存在而中止。
            try
            {
                System.IO.Directory.Delete(versionDir, recursive: true);
                AddLog($"已删除旧输出目录,将覆盖重建版本 [{_config.PackageVersion}]: {versionDir}");
            }
            catch (Exception e)
            {
                AddLog($"[错误] 删除旧输出目录失败,已中止: {e.Message}");
                return false;
            }

            return true;
        }

        private void ExecuteBuildAssetBundleOnly()
        {
            _buildLogs.Clear();
            AddLog($"========== 仅构建 AssetBundle ==========");
            AddLog($"平台: {_config.BuildTarget} | 管线: {_config.BuildPipeline} | 首包策略: {_config.FirstPackageStrategy}");

            if (!PassPreflight() || !ResolveAndConfirmPackageVersion())
            {
                _showBuildLog = true;
                Repaint();
                return;
            }

            // 日志回调与版本号落定都在 FinishBuild 里收尾，与其余构建入口同一收口。
            Application.logMessageReceived += OnBuildLogReceived;
            try
            {
                var cfg = CloneConfig(_config);
                cfg.BuildPlayer = false;
                ReleaseTools.BuildWithConfig(cfg, buildPlayer: false, ok => FinishBuild(ok, commitVersion: true));
            }
            catch (Exception e)
            {
                AddLog($"[错误] {e.Message}");
                Debug.LogException(e);
                FinishBuild(false, commitVersion: false);
            }
        }

        private void ExecuteBuildPlayerOnly()
        {
            _buildLogs.Clear();
            ResolvePlayerOutputPath();
            AddLog($"========== 仅构建 Player ==========");
            AddLog($"平台: {_config.PlayerPlatform} | 输出: {_config.PlayerOutputPath}");

            if (!PassPreflight())
            {
                _showBuildLog = true;
                Repaint();
                return;
            }

            if (_config.PlayerPlatform == BuildTarget.WebGL && !CheckWebGLBuildinCatalogReady())
            {
                _showBuildLog = true;
                Repaint();
                return;
            }

            Application.logMessageReceived += OnBuildLogReceived;
            try
            {
                // 只打 Player 不产资源，版本号不落定。
                ReleaseTools.BuildPlayerWhenReady(
                    BuildConfig.GetBuildTargetGroup(_config.PlayerPlatform),
                    _config.PlayerPlatform,
                    _config.PlayerOutputPath,
                    ok => FinishBuild(ok, commitVersion: false));
            }
            catch (Exception e)
            {
                AddLog($"[错误] {e.Message}");
                Debug.LogException(e);
                FinishBuild(false, commitVersion: false);
            }
        }

        #endregion

        #region 部署执行

        private void ExecuteDeployAssetBundle()
        {
            _buildLogs.Clear();
            AddLog("========== 一键构建+部署 AssetBundle ==========");

            if (!PassPreflight() || !ResolveAndConfirmPackageVersion())
            {
                _showBuildLog = true;
                Repaint();
                return;
            }

            Application.logMessageReceived += OnBuildLogReceived;
            try
            {
                var cfg = CloneConfig(_config);
                cfg.BuildPlayer = false;
                ReleaseTools.BuildWithConfig(cfg, buildPlayer: false, ok =>
                {
                    if (!ok)
                    {
                        FinishBuild(false, commitVersion: false);
                        return;
                    }

                    AddLog("AB 构建完成，准备上传...");
                    string localDir = ReleaseTools.GetAssetBundleOutputDirectory(cfg);
                    RunDeployAssetBundle(localDir, cfg.BuildTarget);
                    FinishBuild(true, commitVersion: true);
                });
            }
            catch (Exception e)
            {
                AddLog($"[错误] {e.Message}");
                Debug.LogException(e);
                FinishBuild(false, commitVersion: false);
            }
        }

        /// <summary>
        /// WebGL Player 构建前校验:StreamingAssets 内置目录 BuildinCatalog.bytes 必须存在。
        /// 缺失时 Player 会卡在内置文件系统初始化(读不到内置清单)而下载不到资源。
        /// 分开按钮流程下 Player 只打包当前 StreamingAssets、不重建 AB,顺序反了或漏打 AB 会静默出坏包,故此处拦截。
        /// </summary>
        private bool CheckWebGLBuildinCatalogReady()
        {
            // 文件名对应 YooAsset DefaultBuildinFileSystemDefine.BuildinCatalogBinaryFileName;
            // 该常量所在类为 internal 且在 YooAsset 程序集内,跨程序集不可引用,故此处用字面量。
            // GetStreamingAssetsRoot() 已含 yoo/package 子目录;包名固定 "DefaultPackage"(与 ReleaseTools 构建参数一致)。
            string catalogPath = System.IO.Path.Combine(
                AssetBundleBuilderHelper.GetStreamingAssetsRoot(), "DefaultPackage", "BuildinCatalog.bytes");
            if (System.IO.File.Exists(catalogPath))
            {
                return true;
            }

            string msg = "WebGL 内置目录 BuildinCatalog.bytes 缺失,Player 会因资源初始化失败而下载不到资源。\n" +
                         "请先执行『一键构建+部署 AB』(『内置文件拷贝』需设为 ClearAndCopyAll)把内置目录拷进 StreamingAssets,再打 Player。\n\n" +
                         $"缺失路径: {catalogPath}";
            AddLog($"[错误] {msg}");
            EditorUtility.DisplayDialog("WebGL Player 构建中止", msg, "知道了");
            return false;
        }

        private void ExecuteDeployPlayer()
        {
            _buildLogs.Clear();
            ResolvePlayerOutputPath();
            AddLog("========== 一键构建+部署 Player ==========");
            AddLog($"平台: {_config.PlayerPlatform} | 输出: {_config.PlayerOutputPath}");

            if (!PassPreflight())
            {
                _showBuildLog = true;
                Repaint();
                return;
            }

            if (_config.PlayerPlatform == BuildTarget.WebGL && !CheckWebGLBuildinCatalogReady())
            {
                _showBuildLog = true;
                Repaint();
                return;
            }

            Application.logMessageReceived += OnBuildLogReceived;
            try
            {
                ReleaseTools.BuildPlayerWhenReady(
                    BuildConfig.GetBuildTargetGroup(_config.PlayerPlatform),
                    _config.PlayerPlatform,
                    _config.PlayerOutputPath,
                    ok =>
                    {
                        if (!ok)
                        {
                            FinishBuild(false, commitVersion: false);
                            return;
                        }

                        AddLog("Player 构建完成，准备上传...");
                        RunDeployScript(GetPlayerUploadDir(), ResolvePlayerRemoteDir(_config.PlayerPlatform), "Player");
                        FinishBuild(true, commitVersion: false);
                    });
            }
            catch (Exception e)
            {
                AddLog($"[错误] {e.Message}");
                Debug.LogException(e);
                FinishBuild(false, commitVersion: false);
            }
        }

        /// <summary>只上传现有 AB 产物、不构建:取当前版本目录,不存在时取最新版本目录。版本号不落定。</summary>
        private void ExecuteUploadAssetBundle()
        {
            _buildLogs.Clear();
            AddLog("========== 部署 AssetBundle(仅上传) ==========");
            string localDir = ReleaseTools.GetAssetBundleOutputDirectory(_config);
            AddLog($"平台: {_config.BuildTarget} | 产物: {localDir}");
            RunDeployAssetBundle(localDir, _config.BuildTarget);
            FinishUpload();
        }

        private void RunDeployAssetBundle(string localDir, BuildTarget target)
        {
            if (_deployAbBeta)
            {
                RunDeployScript(localDir, ResolveAbRemoteDir(target), "AB(灰度)", new Dictionary<string, string>
                {
                    ["VERSION_FILE"] = VersionFileName,
                    ["BETA_FILE"] = BetaVersionFileName,
                });
            }
            else
            {
                RunDeployScript(localDir, ResolveAbRemoteDir(target), "AB");
            }
        }

        /// <summary>把远端 beta 版本号拷成正式版本号:先读两者给确认框,放行时脚本再核一次 beta 内容未变。</summary>
        private void ExecutePromoteAssetBundle()
        {
            _buildLogs.Clear();
            AddLog("========== 放全量 AB ==========");
            string remoteDir = ResolveAbRemoteDir(_config.BuildTarget);
            if (string.IsNullOrWhiteSpace(remoteDir))
            {
                AddLog("[错误] AB 上传地址为空，已取消。");
                FinishUpload();
                return;
            }

            AddLog($"平台: {_config.BuildTarget} | 远端: {DeployUser}@{_deployHost}:{remoteDir}");
            if (!ReadRemoteVersions(remoteDir))
            {
                FinishUpload();
                return;
            }

            string beta = _remoteBeta;
            string formal = _remoteFormal;
            if (string.IsNullOrEmpty(beta))
            {
                AddLog($"[错误] 远端没有 {BetaVersionFileName}(未做过灰度发布),正式版本号未改。");
                FinishUpload();
                return;
            }

            if (beta == formal)
            {
                AddLog($"正式版本号已是 {beta},无需放全量。");
                FinishUpload();
                return;
            }

            string formalText = string.IsNullOrEmpty(formal) ? "(无)" : formal;
            if (!EditorUtility.DisplayDialog("放全量",
                    $"平台: {_config.BuildTarget}\n正式版本号: {formalText} → {beta}\n\n放出后所有玩家下次启动即更新到 {beta}。",
                    "放全量", "取消"))
            {
                AddLog("已取消。");
                FinishUpload();
                return;
            }

            int exit = RunDeployAction(new Dictionary<string, string>
            {
                ["ACTION"] = "promote",
                ["REMOTE_DIR"] = remoteDir,
                ["VERSION_FILE"] = VersionFileName,
                ["BETA_FILE"] = BetaVersionFileName,
                ["EXPECT"] = beta,
            }, null);
            if (exit >= 0)
            {
                AddLog(exit == 0 ? $"==> 已放全量: {formalText} → {beta}" : $"[错误] 放全量失败 (exit={exit})");
            }

            ReadRemoteVersions(remoteDir);
            FinishUpload();
        }

        private void ExecuteReadRemoteVersions()
        {
            _buildLogs.Clear();
            AddLog("========== 读取远端版本 ==========");
            string remoteDir = ResolveAbRemoteDir(_config.BuildTarget);
            if (string.IsNullOrWhiteSpace(remoteDir))
            {
                AddLog("[错误] AB 上传地址为空，已取消。");
            }
            else
            {
                AddLog($"平台: {_config.BuildTarget} | 远端: {DeployUser}@{_deployHost}:{remoteDir}");
                ReadRemoteVersions(remoteDir);
            }

            FinishUpload();
        }

        /// <summary>
        /// 读远端 beta / 正式版本号与现存历史版本,填入面板状态。回滚按钮以这份状态为准,
        /// 且脚本写入前会核对远端仍是这份状态里的值——状态过期只会被拒,不会误写。
        /// </summary>
        private bool ReadRemoteVersions(string remoteDir)
        {
            _remoteStateDir = null;
            var output = new List<string>();
            int exit = RunDeployAction(new Dictionary<string, string>
            {
                ["ACTION"] = "peek",
                ["REMOTE_DIR"] = remoteDir,
                ["VERSION_FILE"] = VersionFileName,
                ["BETA_FILE"] = BetaVersionFileName,
            }, output);
            if (exit != 0)
            {
                if (exit > 0) AddLog($"[错误] 读取远端版本号失败 (exit={exit})");
                return false;
            }

            _remoteBeta = ParseKeyValue(output, "BETA");
            _remoteFormal = ParseKeyValue(output, "FORMAL");
            _rollbackCandidates = output
                .Where(l => l.StartsWith("VER=", StringComparison.Ordinal))
                .Select(l => l.Substring(4).Trim())
                .Where(v => v.Length > 0 && v != _remoteFormal)
                .ToArray();
            _rollbackIndex = 0;
            _remoteStateDir = remoteDir;
            return true;
        }

        private void ExecuteRollbackBeta()
        {
            RunRollback("回滚灰度", BetaVersionFileName, _remoteBeta, _remoteFormal,
                "白名单机器下次启动即回到正式版本。");
        }

        private void ExecuteRollbackFormal()
        {
            RunRollback("回滚正式", VersionFileName, _remoteFormal, _rollbackCandidates[_rollbackIndex],
                "影响全部玩家:下次启动即回到该版本。");
        }

        private void RunRollback(string title, string targetFile, string expect, string to, string impact)
        {
            _buildLogs.Clear();
            AddLog($"========== {title} ==========");
            string remoteDir = ResolveAbRemoteDir(_config.BuildTarget);
            if (remoteDir != _remoteStateDir)
            {
                AddLog("[错误] 平台或远端地址已变，请先重新读取远端版本。");
                FinishUpload();
                return;
            }

            if (!EditorUtility.DisplayDialog(title,
                    $"平台: {_config.BuildTarget}\n{targetFile}: {expect} → {to}\n\n{impact}",
                    title, "取消"))
            {
                AddLog("已取消。");
                FinishUpload();
                return;
            }

            int exit = RunDeployAction(new Dictionary<string, string>
            {
                ["ACTION"] = "rollback",
                ["REMOTE_DIR"] = remoteDir,
                ["VERSION_FILE"] = VersionFileName,
                ["BETA_FILE"] = BetaVersionFileName,
                ["TARGET_FILE"] = targetFile,
                ["TO"] = to,
                ["EXPECT"] = expect,
            }, null);
            if (exit >= 0)
            {
                AddLog(exit == 0 ? $"==> {title}: {targetFile} {expect} → {to}" : $"[错误] {title}失败 (exit={exit})");
            }

            ReadRemoteVersions(remoteDir);
            FinishUpload();
        }

        private static string ParseKeyValue(List<string> lines, string key)
        {
            string prefix = key + "=";
            foreach (var line in lines)
            {
                if (line.StartsWith(prefix, StringComparison.Ordinal))
                {
                    return line.Substring(prefix.Length).Trim();
                }
            }

            return null;
        }

        /// <summary>只上传现有 Player 产物、不构建。</summary>
        private void ExecuteUploadPlayer()
        {
            _buildLogs.Clear();
            ResolvePlayerOutputPath();
            AddLog("========== 部署 Player(仅上传) ==========");
            AddLog($"平台: {_config.PlayerPlatform} | 产物: {_config.PlayerOutputPath}");
            RunDeployScript(GetPlayerUploadDir(), ResolvePlayerRemoteDir(_config.PlayerPlatform), "Player");
            FinishUpload();
        }

        private void FinishUpload()
        {
            AddLog("========== 结束 ==========");
            _showBuildLog = true;
            Repaint();
        }

        /// <summary>Player 的上传目录:输出路径是文件(exe/apk)时取其所在目录,是目录(WebGL)时取其本身。</summary>
        private string GetPlayerUploadDir()
        {
            string localDir = _config.PlayerOutputPath;
            if (System.IO.File.Exists(localDir))
            {
                localDir = System.IO.Path.GetDirectoryName(localDir);
            }

            return localDir;
        }

        private string DeployUser => string.IsNullOrWhiteSpace(_deployUser) ? "root" : _deployUser;

        /// <summary>
        /// 调用 Assets/Editor/Deploy/upload.sh（经 Git Bash），把本地产物目录增量上传到远程目录。
        /// </summary>
        /// <param name="extraEnv">附加给脚本的环境变量(如灰度的 VERSION_FILE / BETA_FILE),语义见脚本头注。</param>
        private void RunDeployScript(string localDir, string remoteDir, string tag, Dictionary<string, string> extraEnv = null)
        {
            if (string.IsNullOrWhiteSpace(remoteDir))
            {
                AddLog($"[错误] {tag} 上传地址为空，已取消上传。");
                return;
            }

            localDir = System.IO.Path.GetFullPath(localDir);
            if (!System.IO.Directory.Exists(localDir))
            {
                AddLog($"[错误] 本地产物目录不存在: {localDir}");
                return;
            }

            var env = new Dictionary<string, string>
            {
                ["ACTION"] = "upload",
                ["LOCAL_DIR"] = ToGitBashPath(localDir),
                ["REMOTE_DIR"] = remoteDir,
            };
            if (extraEnv != null)
            {
                foreach (var kv in extraEnv)
                {
                    env[kv.Key] = kv.Value;
                }
            }

            AddLog($"上传 {tag} → {DeployUser}@{_deployHost}:{remoteDir}");
            int exit = RunDeployAction(env, null);
            if (exit >= 0)
            {
                AddLog(exit == 0 ? $"==> {tag} 部署成功" : $"[错误] {tag} 部署失败 (exit={exit})");
            }
        }

        /// <summary>
        /// 经 Git Bash 跑 upload.sh 的一个动作,输出逐行进构建日志。连接参数经环境变量注入子进程，私钥内容不进任何文件。
        /// </summary>
        /// <param name="output">非空时同时收集脚本标准输出(不含 stderr),供调用方解析。</param>
        /// <returns>脚本退出码;前置条件不满足(已记日志)时返回 -1。</returns>
        private int RunDeployAction(Dictionary<string, string> env, List<string> output)
        {
            if (string.IsNullOrWhiteSpace(_deployHost))
            {
                AddLog("[错误] 服务器地址为空，已取消。");
                return -1;
            }

            string bash = FindGitBash();
            if (bash == null)
            {
                AddLog("[错误] 未找到 Git Bash，请安装 Git for Windows: https://git-scm.com/download/win");
                return -1;
            }

            string scriptPath = System.IO.Path.GetFullPath(Application.dataPath + "/Editor/Deploy/upload.sh");
            if (!System.IO.File.Exists(scriptPath))
            {
                AddLog($"[错误] 上传脚本不存在: {scriptPath}");
                return -1;
            }

            // 显式传 UTF8:跑的是 Git Bash 里的部署脚本,ssh / scp / git 那一串都按 UTF-8 写输出,
            // 取 ShellHelper 缺省的 OEM 页会让回显的中文整段乱码。
            var psi = TEngine.Editor.ShellHelper.NewStartInfo(
                bash, $"-l \"{ToGitBashPath(scriptPath)}\"", null, System.Text.Encoding.UTF8);
            foreach (var kv in env)
            {
                psi.EnvironmentVariables[kv.Key] = kv.Value;
            }

            psi.EnvironmentVariables["SERVER_HOST"] = _deployHost;
            psi.EnvironmentVariables["SERVER_USER"] = DeployUser;
            psi.EnvironmentVariables["SSH_PORT"] = string.IsNullOrWhiteSpace(_deployPort) ? "22" : _deployPort;
            psi.EnvironmentVariables["SSH_KEY"] = string.IsNullOrWhiteSpace(_deployKey) ? "" : ToGitBashPath(_deployKey);

            var buffer = new System.Collections.Concurrent.ConcurrentQueue<(bool isErr, string line)>();
            using (var p = new System.Diagnostics.Process { StartInfo = psi })
            {
                p.OutputDataReceived += (s, e) =>
                {
                    if (e.Data != null) buffer.Enqueue((false, e.Data));
                };
                p.ErrorDataReceived += (s, e) =>
                {
                    if (e.Data != null) buffer.Enqueue((true, e.Data));
                };
                p.Start();
                p.BeginOutputReadLine();
                p.BeginErrorReadLine();
                p.WaitForExit();

                while (buffer.TryDequeue(out var item))
                {
                    AddLog(item.isErr ? "[sh] " + item.line : item.line);
                    if (!item.isErr) output?.Add(item.line);
                }

                return p.ExitCode;
            }
        }

        private static string FindGitBash()
        {
            try
            {
                // 同步读完即可,交给 RunCommand;编码取缺省 OEM 页——where 是 Windows 原生工具,
                // 按 UTF-8 解会让中文用户名下的安装路径错位、认不出 git.exe。
                TEngine.Editor.ShellHelper.RunCommand("where", "git", null, out string output, out _);
                foreach (var raw in output.Split('\n'))
                {
                    string git = raw.Trim();
                    if (git.EndsWith("git.exe", StringComparison.OrdinalIgnoreCase))
                    {
                        string gitRoot = System.IO.Path.GetDirectoryName(System.IO.Path.GetDirectoryName(git));
                        if (!string.IsNullOrEmpty(gitRoot))
                        {
                            string bash = System.IO.Path.Combine(gitRoot, "bin", "bash.exe");
                            if (System.IO.File.Exists(bash))
                            {
                                return bash;
                            }
                        }
                    }
                }
            }
            catch
            {
                // 忽略 where 调用异常，落到下面的候选路径
            }

            string[] candidates =
            {
                @"C:\Program Files\Git\bin\bash.exe",
                @"C:\Program Files (x86)\Git\bin\bash.exe",
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData) + @"\Programs\Git\bin\bash.exe",
            };
            foreach (var candidate in candidates)
            {
                if (System.IO.File.Exists(candidate))
                {
                    return candidate;
                }
            }

            return null;
        }

        /// <summary>
        /// Windows 路径转 Git Bash 路径（D:\a\b → /d/a/b）；已是 /x/ 形式则原样返回。
        /// </summary>
        private static string ToGitBashPath(string winPath)
        {
            if (string.IsNullOrEmpty(winPath))
            {
                return winPath;
            }

            winPath = winPath.Replace('\\', '/');
            if (winPath.Length >= 2 && winPath[1] == ':')
            {
                char drive = char.ToLowerInvariant(winPath[0]);
                winPath = "/" + drive + winPath.Substring(2);
            }

            return winPath;
        }

        private void OnBuildLogReceived(string condition, string stackTrace, LogType type)
        {
            string prefix = type switch
            {
                LogType.Error => "[ERR]",
                LogType.Warning => "[WARN]",
                LogType.Assert => "[ASSERT]",
                _ => ""
            };

            if (!string.IsNullOrEmpty(prefix) || condition.StartsWith("[") || condition.Contains("构建") || condition.Contains("Build"))
            {
                AddLog($"{prefix}{condition}");
            }
        }

        private void AddLog(string message)
        {
            string timestamp = DateTime.Now.ToString("HH:mm:ss");
            _buildLogs.Add($"[{timestamp}] {message}");
            _logScrollPosition = new Vector2(0, float.MaxValue);
        }

        #endregion

        #region 持久化

        private void LoadSettings()
        {
            _config = new BuildConfig();

            _platformIndex = EditorPrefs.GetInt("TEngine_BP_BuildTarget", -1);
            if (_platformIndex < 0 || _platformIndex >= PlatformTargets.Length)
            {
                _platformIndex = GetActivePlatformIndex();
            }

            _config.BuildTarget = PlatformTargets[_platformIndex];

            int pipelineIndex = EditorPrefs.GetInt("TEngine_BP_BuildPipeline", 0);
            _config.BuildPipeline = pipelineIndex == 1 ? EBuildPipeline.BuiltinBuildPipeline : EBuildPipeline.ScriptableBuildPipeline;

            _config.CompressOption = (ECompressOption)EditorPrefs.GetInt("TEngine_BP_CompressOption", 1);
            _config.EncryptionType = (EncryptionType)EditorPrefs.GetInt("TEngine_BP_EncryptionType", 0);

            _config.PackageVersion = EditorPrefs.GetString("TEngine_BP_PackageVersion", "");
            _config.OutputRoot = EditorPrefs.GetString("TEngine_BP_OutputRoot", "./Builds/");

            _config.EnableSharePackRule = EditorPrefs.GetBool("TEngine_BP_EnableSharePack", true);
            _config.UseAssetDependencyDB = EditorPrefs.GetBool("TEngine_BP_UseDepDB", true);
            _config.ClearBuildCache = EditorPrefs.GetBool("TEngine_BP_ClearCache", false);
            _config.VerifyBuildingResult = EditorPrefs.GetBool("TEngine_BP_VerifyResult", true);
            // 默认 ClearAndCopyAll:WebGL 恒需 StreamingAssets 内置目录,None 会导致运行时资源初始化失败。
            _config.BuildinFileCopyOption = (EBuildinFileCopyOption)EditorPrefs.GetInt("TEngine_BP_CopyOption", (int)EBuildinFileCopyOption.ClearAndCopyAll);
            _config.BuildinFileCopyParams = EditorPrefs.GetString("TEngine_BP_CopyParams", "");
            // 策略档缺省(首次打开,或配置早于策略档存在)时从拷贝参数反推,避免把已配好的 ByTags 显示成整包内置。
            _config.FirstPackageStrategy = (EFirstPackageStrategy)EditorPrefs.GetInt("TEngine_BP_FirstPkgStrategy",
                (int)BuildConfig.InferStrategy(_config.BuildinFileCopyOption, _config.BuildinFileCopyParams));
            _collectorTags = null;
            // 默认 BundleName_HashName:文件名带内容哈希,内容变则 URL 变,规避 CDN 缓存导致的 CRC Mismatch。
            _config.FileNameStyle = (EFileNameStyle)EditorPrefs.GetInt("TEngine_BP_FileNameStyle", (int)EFileNameStyle.BundleName_HashName);

            _config.BuildHotFixDll = EditorPrefs.GetBool("TEngine_BP_BuildDll", true);

            _playerPlatformIndex = EditorPrefs.GetInt("TEngine_BP_PlayerPlatform", -1);
            if (_playerPlatformIndex < 0 || _playerPlatformIndex >= PlatformTargets.Length)
            {
                _playerPlatformIndex = GetActivePlatformIndex();
            }

            _config.PlayerPlatform = PlatformTargets[_playerPlatformIndex];

            // 存 EditorUserSettings(落在本工程 UserSettings/)而不是 EditorPrefs:EditorPrefs 整机共享,
            // 别的工程副本会读到这里存的目录,出包落进别的工程、部署发到别的机器。
            _playerOutputDir = EditorUserSettings.GetConfigValue(PlayerOutputDirKey);
            if (string.IsNullOrWhiteSpace(_playerOutputDir))
            {
                _playerOutputDir = BuildConfig.GetDefaultPlayerOutputDir(_config.PlayerPlatform);
            }

            _deployHost = LoadDeploySetting(DeployHostKey, string.Empty);
            _deployUser = LoadDeploySetting(DeployUserKey, "root");
            _deployPort = LoadDeploySetting(DeployPortKey, "22");
            // 私钥默认留空:上传脚本对空 SSH_KEY 退回本机默认 ssh 配置,而任何具体路径都绑死某台机器的
            // 某个目录布局,换机器或换工程副本即失效。要用哪把钥匙由本机使用者在面板里填。
            _deployKey = LoadDeploySetting(DeployKeyKey, string.Empty);
            // 键名带 Root 后缀：旧键存的是拼好平台段的完整目录，沿用会拼成 .../WebGL/项目名/Android。
            _deployAbRemoteRoot = LoadDeploySetting(DeployAbRootKey, string.Empty);
            _deployPlayerRemoteRoot = LoadDeploySetting(DeployPlayerRootKey, string.Empty);
            _deployAbBeta = EditorUserSettings.GetConfigValue(DeployAbBetaKey) == "1";
        }

        private static string LoadDeploySetting(string key, string fallback)
        {
            string stored = EditorUserSettings.GetConfigValue(key);
            return string.IsNullOrWhiteSpace(stored) ? fallback : stored;
        }

        private void SaveSettings()
        {
            EditorPrefs.SetInt("TEngine_BP_BuildTarget", _platformIndex);
            EditorPrefs.SetInt("TEngine_BP_BuildPipeline", _config.BuildPipeline == EBuildPipeline.BuiltinBuildPipeline ? 1 : 0);
            EditorPrefs.SetInt("TEngine_BP_CompressOption", (int)_config.CompressOption);
            EditorPrefs.SetInt("TEngine_BP_EncryptionType", (int)_config.EncryptionType);
            EditorPrefs.SetString("TEngine_BP_PackageVersion", _config.PackageVersion);
            EditorPrefs.SetString("TEngine_BP_OutputRoot", _config.OutputRoot);
            EditorPrefs.SetBool("TEngine_BP_EnableSharePack", _config.EnableSharePackRule);
            EditorPrefs.SetBool("TEngine_BP_UseDepDB", _config.UseAssetDependencyDB);
            EditorPrefs.SetBool("TEngine_BP_ClearCache", _config.ClearBuildCache);
            EditorPrefs.SetBool("TEngine_BP_VerifyResult", _config.VerifyBuildingResult);
            EditorPrefs.SetInt("TEngine_BP_CopyOption", (int)_config.BuildinFileCopyOption);
            EditorPrefs.SetString("TEngine_BP_CopyParams", _config.BuildinFileCopyParams ?? "");
            EditorPrefs.SetInt("TEngine_BP_FirstPkgStrategy", (int)_config.FirstPackageStrategy);
            EditorPrefs.SetInt("TEngine_BP_FileNameStyle", (int)_config.FileNameStyle);
            EditorPrefs.SetBool("TEngine_BP_BuildDll", _config.BuildHotFixDll);
            EditorPrefs.SetInt("TEngine_BP_PlayerPlatform", _playerPlatformIndex);
            EditorUserSettings.SetConfigValue(PlayerOutputDirKey, _playerOutputDir ?? "");

            EditorUserSettings.SetConfigValue(DeployHostKey, _deployHost ?? "");
            EditorUserSettings.SetConfigValue(DeployUserKey, _deployUser ?? "");
            EditorUserSettings.SetConfigValue(DeployPortKey, _deployPort ?? "");
            EditorUserSettings.SetConfigValue(DeployKeyKey, _deployKey ?? "");
            EditorUserSettings.SetConfigValue(DeployAbRootKey, _deployAbRemoteRoot ?? "");
            EditorUserSettings.SetConfigValue(DeployPlayerRootKey, _deployPlayerRemoteRoot ?? "");
            EditorUserSettings.SetConfigValue(DeployAbBetaKey, _deployAbBeta ? "1" : "0");
        }

        private int GetActivePlatformIndex()
        {
            BuildTarget active = EditorUserBuildSettings.activeBuildTarget;
            for (int i = 0; i < PlatformTargets.Length; i++)
            {
                if (PlatformTargets[i] == active)
                    return i;
            }

            return 0;
        }

        #endregion

        #region 工具方法

        private static string PathGetRelative(string relativeTo, string path)
        {
            try
            {
                var uri = new Uri(relativeTo + "/");
                var rel = Uri.UnescapeDataString(uri.MakeRelativeUri(new Uri(path)).ToString());
                return rel.Replace('/', '\\');
            }
            catch
            {
                return "";
            }
        }

        private static BuildConfig CloneConfig(BuildConfig source)
        {
            return new BuildConfig
            {
                BuildTarget = source.BuildTarget,
                BuildPipeline = source.BuildPipeline,
                CompressOption = source.CompressOption,
                EncryptionType = source.EncryptionType,
                PackageVersion = source.PackageVersion,
                OutputRoot = source.OutputRoot,
                FirstPackageStrategy = source.FirstPackageStrategy,
                EnableSharePackRule = source.EnableSharePackRule,
                UseAssetDependencyDB = source.UseAssetDependencyDB,
                ClearBuildCache = source.ClearBuildCache,
                VerifyBuildingResult = source.VerifyBuildingResult,
                BuildinFileCopyOption = source.BuildinFileCopyOption,
                BuildinFileCopyParams = source.BuildinFileCopyParams,
                FileNameStyle = source.FileNameStyle,
                BuildHotFixDll = source.BuildHotFixDll,
                BuildPlayer = source.BuildPlayer,
                PlayerPlatform = source.PlayerPlatform,
                PlayerOutputPath = source.PlayerOutputPath,
            };
        }

        #endregion
    }
}