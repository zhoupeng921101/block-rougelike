using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
#if ENABLE_HYBRIDCLR
using HybridCLR;
#endif
using Launcher;
using UnityEngine;
using TEngine;
using System.Reflection;
using YooAsset;
using Cysharp.Threading.Tasks;

namespace Launcher
{
    /// <summary>
    /// 流程加载器 - 代码初始化
    /// </summary>
    public class ProcedureLoadAssembly : ProcedureBase
    {
        private bool _enableAddressable = true;
        public override bool UseNativeDialog => true;
        private int _loadAssetCount;
        private int _failureAssetCount;
        private int _failureMetadataAssetCount;
        private bool _loadAssemblyComplete;
        private bool _loadMetadataAssemblyComplete;
        private bool _loadAssemblyWait;
        private bool _startupAborted;
        private bool _aotFingerprintMismatch;
        private readonly List<string> _failedAssetLocations = new List<string>();
        private Assembly _mainLogicAssembly;
        private List<Assembly> _hotfixAssemblyList;
        private IFsm<IProcedureModule> _procedureOwner;
        private UpdateSetting _setting;

        protected override void OnInit(IFsm<IProcedureModule> procedureOwner)
        {
            base.OnInit(procedureOwner);
            _setting = Settings.UpdateSetting;
        }

        protected override void OnEnter(IFsm<IProcedureModule> procedureOwner)
        {
            base.OnEnter(procedureOwner);
            Log.Debug("HybridCLR ProcedureLoadAssembly OnEnter");
            _procedureOwner = procedureOwner;
            LauncherMgr.ShowUI<LoadUpdateUI>(LoadText.Instance.Label_Load_Init);
            LoadAssembly().Forget();
        }

        private async UniTaskVoid LoadAssembly()
        {
            _loadAssemblyComplete = false;
            _hotfixAssemblyList = new List<Assembly>();

            // 指纹闸先于补充元数据:本包与热更资源 AOT 不同源时补充元数据在原生层崩溃,走过这里就没有机会
            // 提示玩家了。不匹配即不往下走。
            if (_setting.Enable && _resourceModule.PlayMode != EPlayMode.EditorSimulateMode
                && !await CheckAotFingerprintAsync())
            {
                return;
            }

            // AOT Assembly 加载原始 metadata。await 到全部补完再进下面的热更程序集加载:热更代码开跑前
            // 补充元数据已全部就位,加载顺序与失败日志可复现。
            if (_setting.Enable)
            {
#if !UNITY_EDITOR
                _loadMetadataAssemblyComplete = false;
                await LoadMetadataForAOTAssembly();
#else
                _loadMetadataAssemblyComplete = true;
#endif
            }
            else
            {
                _loadMetadataAssemblyComplete = true;
            }

            if (!_setting.Enable || _resourceModule.PlayMode == EPlayMode.EditorSimulateMode)
            {
                _mainLogicAssembly = GetMainLogicAssembly();
            }
            else
            {
                if (_setting.Enable)
                {
                    foreach (string hotUpdateDllName in _setting.HotUpdateAssemblies)
                    {
                        var assetLocation = hotUpdateDllName;
                        if (!_enableAddressable)
                        {
                            assetLocation = Utility.Path.GetRegularPath(
                                Path.Combine(
                                    "Assets",
                                    _setting.AssemblyTextAssetPath,
                                    $"{hotUpdateDllName}{_setting.AssemblyTextAssetExtension}"));
                        }

                        Log.Debug($"LoadAsset: [ {assetLocation} ]");
                        _loadAssetCount++;
                        var result = await _resourceModule.LoadAssetAsync<TextAsset>(assetLocation);
                        LoadAssetSuccess(result, assetLocation);
                    }

                    _loadAssemblyWait = true;
                }
                else
                {
                    _mainLogicAssembly = GetMainLogicAssembly();
                }
            }

            if (_loadAssetCount == 0)
            {
                _loadAssemblyComplete = true;
            }
        }

        /// <summary>
        /// 比对本包 AOT 指纹与热更资源里携带的那份,判定这批热更程序集是否配得上这个包的 AOT。
        /// </summary>
        /// <returns>可以继续加载补充元数据与热更程序集为 true;已判定不同源、调用方须立即停手为 false。</returns>
        /// <remarks>
        /// 拦的是两个方向的不同源:重出过 Player(AOT 变了)却还在跑旧热更资源,或旧包拉到了新热更资源。
        /// 不同源时补充元数据在原生层崩溃(libc memcpy 里的 SIGSEGV,日志止于「LoadMetadataAssetSuccess」),
        /// 托管 try/catch 拦不到,玩家看到的是闪退,所以本方法必须在加载任何补充元数据之前调用。
        /// <para>
        /// 判据是 AOT 指纹而非资源版本号:APK 内置版本低于 CDN 版本是热更常态,灰度还允许版本号回退
        /// (见 <c>.claude/references/tengine/hotfix-workflow.md</c>「灰度发布」节),比版本号既漏报又误报。
        /// 只改热更代码、不重出 Player 时 AOT 未变,指纹相等,正常热更不受影响。
        /// </para>
        /// <para>
        /// 两处放行是有意的:①本包没有指纹——这个 Player 不是带指纹的构建管线出的,无从判断,放行并告警;
        /// ②<see cref="EPlayMode.EditorSimulateMode"/> 下调用方不调本方法(该模式直接取 AppDomain 程序集)。
        /// 而资源侧指纹缺失或不等一律判不匹配:旧资源包里没有这个文件,恰恰说明它出自指纹管线之前。
        /// </para>
        /// </remarks>
        private async UniTask<bool> CheckAotFingerprintAsync()
        {
            string localFingerprint = await LoadPlayerAotFingerprintAsync();
            if (string.IsNullOrEmpty(localFingerprint))
            {
                Log.Warning($"本包未携带 AOT 指纹(包内没有 Resources/{UpdateSetting.PlayerAotFingerprintResourceName}),跳过热更资源同源校验。" +
                            "这个包不是带指纹的构建管线出的;重出一次包即可让该校验生效。");
                return true;
            }

            var textAsset = await _resourceModule.LoadAssetAsync<TextAsset>(UpdateSetting.AotFingerprintAssetName);
            string remoteFingerprint = textAsset == null ? null : textAsset.text.Trim();
            if (textAsset != null)
            {
                _resourceModule.UnloadAsset(textAsset);
            }

            if (string.Equals(localFingerprint, remoteFingerprint, StringComparison.Ordinal))
            {
                Log.Debug($"AOT fingerprint matched: [ {localFingerprint} ]");
                return true;
            }

            // 与资源加载失败同一收口:置标志 + Error,对话框与中止由 OnUpdate 的中止门统一发出。
            _aotFingerprintMismatch = true;
            _loadAssemblyComplete = true;
            _loadMetadataAssemblyComplete = true;
            Log.Error($"AOT fingerprint mismatch. Player: [ {localFingerprint} ], resource: [ {remoteFingerprint ?? "<missing>"} ]. " +
                      "Hot update resources were built against a different AOT; loading them would crash natively. Startup aborted.");
            return false;
        }

        /// <summary>读本包自带的 AOT 指纹;包里没有载体时返回 null。</summary>
        private static async UniTask<string> LoadPlayerAotFingerprintAsync()
        {
            // 走 Resources 而不走 YooAsset:这份指纹代表包本身,必须编进包、热更换不掉。
            var textAsset = (await Resources.LoadAsync<TextAsset>(UpdateSetting.PlayerAotFingerprintResourceName)) as TextAsset;
            if (textAsset == null)
            {
                return null;
            }

            string fingerprint = textAsset.text.Trim();
            Resources.UnloadAsset(textAsset);
            return fingerprint;
        }

        protected override void OnUpdate(IFsm<IProcedureModule> procedureOwner, float elapseSeconds, float realElapseSeconds)
        {
            base.OnUpdate(procedureOwner, elapseSeconds, realElapseSeconds);
            if (_startupAborted)
            {
                return;
            }
            if (!_loadAssemblyComplete)
            {
                return;
            }
            if (!_loadMetadataAssemblyComplete)
            {
                return;
            }
            if (_aotFingerprintMismatch)
            {
                // 排在资源失败门之前:两者都成立时,「版本不配」比「资源缺失」更贴近玩家该做的事(更新客户端)。
                _startupAborted = true;
                LauncherMgr.ShowMessageBox(
                    "客户端版本过旧，无法加载本次更新的内容，点击确认退出后请更新客户端。",
                    Application.Quit);
                Log.Fatal("Startup aborted: AOT fingerprint mismatch between this player and the hot update resources.");
                return;
            }
            if (_failureAssetCount > 0 || _failureMetadataAssetCount > 0)
            {
                // 先置中止标志再 Fatal:默认日志辅助器的 Fatal 直接抛异常,后置则每帧重复触发。
                _startupAborted = true;
                string failedAssets = string.Join(", ", _failedAssetLocations);
                // 对话框先于 Fatal(Fatal 抛异常后其后语句不执行);资源缺失/损坏不可重试,仅给退出。
                LauncherMgr.ShowMessageBox(
                    $"代码资源加载失败！\n<color=#FF0000>{failedAssets}</color>\n资源缺失或损坏，无法进入游戏，点击确认退出。",
                    Application.Quit);
                Log.Fatal($"Load assembly failed, missing or broken assets: [ {failedAssets} ]. Hot update assembly failures: {_failureAssetCount}, AOT metadata failures: {_failureMetadataAssetCount}. Startup aborted.");
                return;
            }
            AllAssemblyLoadComplete();
        }

        private void AllAssemblyLoadComplete()
        {
            ChangeState<ProcedureStartGame>(_procedureOwner);
#if UNITY_EDITOR
            _mainLogicAssembly = GetMainLogicAssembly();
#endif
            if (_mainLogicAssembly == null)
            {
                Log.Fatal($"Main logic assembly missing. Please check \'ENABLE_HYBRIDCLR\' is defined in Player Settings And check the file of {_setting.LogicMainDllName}.bytes is exits.");
                return;
            }
            
            var appType = _mainLogicAssembly.GetType("GameApp");
            if (appType == null)
            {
                Log.Fatal($"Main logic type 'GameMain' missing.");
                return;
            }
            var entryMethod = appType.GetMethod("Entrance");
            if (entryMethod == null)
            {
                Log.Fatal($"Main logic entry method 'Entrance' missing.");
                return;
            }
            // 第二个参数是启动器界面的关闭回调,交热更侧在它自己的首个全屏窗显示后调用:
            // 启动器界面在此之前一直留着,热更窗下载依赖期间不露黑屏。
            Action releaseLauncherUI = LauncherMgr.HideAllUI;
            // 第三、四个参数是「清理缓存」的两步(清理、清完退出),供热更侧的加载窗调用:
            // 清理要用到的网页端脚本只能从主包调,热更程序集也不引用本程序集。
            Func<UniTask> clearCache = CacheCleaner.ClearAllAsync;
            Action exitGame = CacheCleaner.ExitGame;
            object[] objects = new object[] { new object[] { _hotfixAssemblyList, releaseLauncherUI, clearCache, exitGame } };
            entryMethod.Invoke(appType, objects);
        }

        private Assembly GetMainLogicAssembly()
        {
            _hotfixAssemblyList.Clear();
            Assembly mainLogicAssembly = null;
            foreach (var assembly in AppDomain.CurrentDomain.GetAssemblies())
            {
                if (string.Compare(_setting.LogicMainDllName, $"{assembly.GetName().Name}.dll",
                        StringComparison.Ordinal) == 0)
                {
                    mainLogicAssembly = assembly;
                }

                foreach (var hotUpdateDllName in _setting.HotUpdateAssemblies)
                {
                    if (hotUpdateDllName == $"{assembly.GetName().Name}.dll")
                    {
                        _hotfixAssemblyList.Add(assembly);
                    }
                }

                if (mainLogicAssembly != null && _hotfixAssemblyList.Count == _setting.HotUpdateAssemblies.Count)
                {
                    break;
                }
            }

            return mainLogicAssembly;
        }

        /// <summary>
        /// 加载代码资源成功回调。
        /// </summary>
        /// <param name="textAsset">代码资产。</param>
        /// <param name="assetLocation">代码资产定位地址,资产为空时用于指名缺失资源。</param>
        private void LoadAssetSuccess(TextAsset textAsset, string assetLocation)
        {
            _loadAssetCount--;
            if (textAsset == null)
            {
                // 失败分支只簿记 + Error:默认日志辅助器的 Fatal 直接抛异常,会中断 LoadAssembly 的
                // 加载循环、令 _loadAssemblyWait 永不置位;Fatal 统一收口到 OnUpdate 的失败中止门。
                _failureAssetCount++;
                _failedAssetLocations.Add(assetLocation);
                _loadAssemblyComplete = _loadAssemblyWait && 0 == _loadAssetCount;
                Log.Error($"Load hot update assembly asset [ {assetLocation} ] failed. Asset missing or load error, startup will be aborted.");
                return;
            }

            var assetName = textAsset.name;
            Log.Debug($"LoadAssetSuccess, assetName: [ {assetName} ]");

            try
            {
                var assembly = Assembly.Load(textAsset.bytes);
                if (string.Compare(_setting.LogicMainDllName, assetName, StringComparison.Ordinal) == 0)
                {
                    _mainLogicAssembly = assembly;
                }
                _hotfixAssemblyList.Add(assembly);
                Log.Debug($"Assembly [ {assembly.GetName().Name} ] loaded");
            }
            catch (Exception e)
            {
                // 与 null 分支同一收口:记失败、不重抛,Fatal 由中止门统一发出;
                // 就地 Fatal/重抛会中断加载循环,令完成标志永不置位、中止门不可达。
                _failureAssetCount++;
                _failedAssetLocations.Add(assetLocation);
                Log.Error(e);
            }
            finally
            {
                _loadAssemblyComplete = _loadAssemblyWait && 0 == _loadAssetCount;
            }
            _resourceModule.UnloadAsset(textAsset);
        }

        /// <summary>
        /// 为Aot Assembly加载原始metadata， 这个代码放Aot或者热更新都行。
        /// 一旦加载后，如果AOT泛型函数对应native实现不存在，则自动替换为解释模式执行。
        /// </summary>
        /// <remarks>
        /// 调用前须先过 <see cref="CheckAotFingerprintAsync"/>:不同源的元数据在本方法内原生崩溃。
        /// 调用方必须 await 本方法完成再加载热更程序集,理由见 <see cref="LoadAssembly"/> 内该处注释。
        /// </remarks>
        private async UniTask LoadMetadataForAOTAssembly()
        {
            // 可以加载任意aot assembly的对应的dll。但要求dll必须与unity build过程中生成的裁剪后的dll一致，而不能直接使用原始dll。
            // 我们在BuildProcessor_xxx里添加了处理代码，这些裁剪后的dll在打包时自动被复制到 {项目目录}/HybridCLRData/AssembliesPostIl2CppStrip/{Target} 目录。

            // 注意，补充元数据是给AOT dll补充元数据，而不是给热更新dll补充元数据。
            // 热更新dll不缺元数据，不需要补充，如果调用LoadMetadataForAOTAssembly会返回错误
            foreach (string aotDllName in _setting.AOTMetaAssemblies)
            {
                var assetLocation = aotDllName;
                if (!_enableAddressable)
                {
                    assetLocation = Utility.Path.GetRegularPath(
                        Path.Combine(
                            "Assets",
                            _setting.AssemblyTextAssetPath,
                            $"{aotDllName}{_setting.AssemblyTextAssetExtension}"));
                }


                Log.Debug($"LoadMetadataAsset: [ {assetLocation} ]");
                var textAsset = await _resourceModule.LoadAssetAsync<TextAsset>(assetLocation);
                LoadMetadataAssetSuccess(textAsset, assetLocation);
            }

            // 逐个 await 到此,清单已走完:失败项已记进 _failureMetadataAssetCount,由 OnUpdate 的中止门收口。
            _loadMetadataAssemblyComplete = true;
        }

        /// <summary>
        /// 加载元数据资源成功回调。
        /// </summary>
        /// <param name="textAsset">代码资产。</param>
        /// <param name="assetLocation">元数据资产定位地址,资产为空时用于指名缺失资源。</param>
        private void LoadMetadataAssetSuccess(TextAsset textAsset, string assetLocation)
        {
            if (null == textAsset)
            {
                // 同 LoadAssetSuccess 失败分支:只簿记 + Error,Fatal 收口到中止门。
                // 缺一项元数据不提前退出循环:清单要走完才能把缺失项一次报全,而非报一个改一个。
                _failureMetadataAssetCount++;
                _failedAssetLocations.Add(assetLocation);
                Log.Error($"Load AOT metadata asset [ {assetLocation} ] failed. Asset missing or load error, startup will be aborted.");
                return;
            }

            string assetName = textAsset.name;
            Log.Debug($"LoadMetadataAssetSuccess, assetName: [ {assetName} ]");
            try
            {
                byte[] dllBytes = textAsset.bytes;
#if ENABLE_HYBRIDCLR
                    // 加载assembly对应的dll，会自动为它hook。一旦Aot泛型函数的native函数不存在，用解释器版本代码
                    HomologousImageMode mode = HomologousImageMode.SuperSet;
                    LoadImageErrorCode err = (LoadImageErrorCode)HybridCLR.RuntimeApi.LoadMetadataForAOTAssembly(dllBytes,mode); 
                    Log.Warning($"LoadMetadataForAOTAssembly:{assetName}. mode:{mode} ret:{err}");
#endif
            }
            catch (Exception e)
            {
                // 与 null 分支同一收口:记失败、不重抛,Fatal 由中止门统一发出。
                _failureMetadataAssetCount++;
                _failedAssetLocations.Add(assetLocation);
                Log.Error(e);
            }
            _resourceModule.UnloadAsset(textAsset);
        }
    }
}