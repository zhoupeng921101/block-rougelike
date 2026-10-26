using System.Collections;
using Cysharp.Threading.Tasks;
using TEngine;
using UnityEngine;
using YooAsset;
using ProcedureOwner = TEngine.IFsm<TEngine.IProcedureModule>;

namespace Launcher
{
    public class ProcedureInitResources : ProcedureBase
    {
        private bool _initResourcesComplete = false;

        public override bool UseNativeDialog => true;

        private ProcedureOwner _procedureOwner;

        protected override void OnEnter(ProcedureOwner procedureOwner)
        {
            _procedureOwner = procedureOwner;

            base.OnEnter(procedureOwner);

            _initResourcesComplete = false;

            LauncherMgr.ShowUI<LoadUpdateUI>("初始化资源中...");

            // 注意：使用单机模式并初始化资源前，需要先构建 AssetBundle 并复制到 StreamingAssets 中，否则会产生 HTTP 404 错误
            Utility.Unity.StartCoroutine(InitResources(procedureOwner));
        }

        private void ChangeToCreateDownloaderState(ProcedureOwner procedureOwner)
        {
            ChangeState<ProcedureCreateDownloader>(procedureOwner);
        }

        protected override void OnUpdate(ProcedureOwner procedureOwner, float elapseSeconds, float realElapseSeconds)
        {
            base.OnUpdate(procedureOwner, elapseSeconds, realElapseSeconds);

            if (!_initResourcesComplete)
            {
                // 初始化资源未完成则继续等待
                return;
            }

            if (_resourceModule.PlayMode == EPlayMode.HostPlayMode || _resourceModule.PlayMode == EPlayMode.WebPlayMode)
            {
                //线上最新版本operation.PackageVersion
                Log.Debug($"Updated package Version : from {_resourceModule.GetPackageVersion()} to {_resourceModule.PackageVersion}");
                //注意：保存资源版本号作为下次默认启动的版本!
                // 网页版的文件系统没有本地缓存可清(其清缓存是空操作),直接进加载程序集。
                if (_resourceModule.PlayMode == EPlayMode.WebPlayMode)
                {
                    ChangeToLoadAssemblyState(procedureOwner);
                    return;
                }

                // 边玩边下只跳过整包下载,不跳过清缓存:ProcedureClearCache 是旧版本缓存文件的唯一清理点。
                if (_resourceModule.UpdatableWhilePlaying)
                {
                    // 边玩边下载还可以拓展首包支持。
                    ChangeState<ProcedureClearCache>(procedureOwner);
                    return;
                }

                ChangeToCreateDownloaderState(procedureOwner);
                return;
            }

            ChangeToLoadAssemblyState(procedureOwner);
        }

        //// <summary>
        /// 初始化资源流程。
        /// <remarks>YooAsset 需要保持编辑器、单机、联机模式流程一致。</remarks>
        private IEnumerator InitResources(ProcedureOwner procedureOwner)
        {
            Log.Info("更新资源清单！！！");
            LauncherMgr.ShowUI<LoadUpdateUI>($"更新清单文件...");

            // 1. 获取资源清单的版本信息
            // appendTimeTicks 必须为 true:灰度发布下资源服务器按来源 IP 对同一个版本号 URL 返回
            // 不同内容,该 URL 一旦被中间层缓存,白名单机器进不去内测版本、移出白名单也退不回正式版。
            // 灰度机制见 .claude/references/tengine/hotfix-workflow.md 的「灰度发布(IP 白名单)」节。
            var operation1 = _resourceModule.RequestPackageVersionAsync(appendTimeTicks: true);
            yield return operation1;
            if (operation1.Status != EOperationStatus.Succeed)
            {
                OnInitResourcesError(procedureOwner, operation1.Error);
                yield break;
            }

            var packageVersion = operation1.PackageVersion;
            _resourceModule.PackageVersion = packageVersion;

            Log.Info($"Init resource package version : {packageVersion}");

            // 2. 传入的版本信息更新资源清单
            var operation2 = _resourceModule.UpdatePackageManifestAsync(packageVersion);
            yield return operation2;
            if (operation2.Status != EOperationStatus.Succeed)
            {
                OnInitResourcesError(procedureOwner, operation2.Error);
                yield break;
            }

            _initResourcesComplete = true;
        }

        private void ChangeToLoadAssemblyState(ProcedureOwner procedureOwner)
        {
            ChangeState<ProcedureLoadAssembly>(procedureOwner);
        }

        private void OnInitResourcesError(ProcedureOwner procedureOwner, string message)
        {
            // 检查设备网络连接状态。
            if (_resourceModule.PlayMode == EPlayMode.HostPlayMode)
            {
                if (!IsNeedUpdate())
                {
                    return;
                }
                else
                {
                    Log.Error(message);
                    LauncherMgr.ShowMessageBox($"获取远程版本失败！点击确认重试\n <color=#FF0000>{message}</color>"
                    , () => { Utility.Unity.StartCoroutine(InitResources(procedureOwner)); }
                    ,Application.Quit);
                    return;
                }
            }

            Log.Error(message);
            LauncherMgr.ShowMessageBox($"初始化资源失败！点击确认重试 \n <color=#FF0000>{message}</color>"
                ,() => { Utility.Unity.StartCoroutine(InitResources(procedureOwner)); }, Application.Quit);
        }

        private bool IsNeedUpdate()
        {
            // 如果不能联网且当前游戏非强制(不更新可以进入游戏。)
            if (Settings.UpdateSetting.UpdateStyle == UpdateStyle.Optional && !_resourceModule.UpdatableWhilePlaying)
            {
                // 获取上次成功记录的版本
                string packageVersion = Utility.PlayerPrefs.GetString("GAME_VERSION", string.Empty);
                if (string.IsNullOrEmpty(packageVersion))
                {
                    LauncherMgr.ShowUI<LoadUpdateUI>(LoadText.Instance.Label_Net_UnReachable);
                    LauncherMgr.ShowMessageBox("没有找到本地版本记录，需要更新资源！",
                        () => { Utility.Unity.StartCoroutine(InitResources(_procedureOwner)); },
                        Application.Quit);
                    return false;
                }

                if (Settings.UpdateSetting.UpdateNotice == UpdateNotice.Notice)
                {
                    LauncherMgr.ShowUI<LoadUpdateUI>(LoadText.Instance.Label_Load_Notice);
                    LauncherMgr.ShowMessageBox($"更新失败，检测到可选资源更新，推荐完成更新提升游戏体验！ \n \n 确定再试一次，取消进入游戏",
                        () => { Utility.Unity.StartCoroutine(InitResources(_procedureOwner)); },
                        () => { EnterWithLocalVersionAsync(packageVersion).Forget(); });
                }
                else
                {
                    EnterWithLocalVersionAsync(packageVersion).Forget();
                }

                return false;
            }

            return true;
        }

        /// <summary>
        /// 以本地记录的已下全版本离线进入:先从缓存加载该版本清单并确认文件齐全,再进加载程序集。
        /// </summary>
        /// <remarks>
        /// 不能只设版本号就进加载程序集:活动清单只由 UpdatePackageManifestAsync 设置,没有它第一次查资源(热更程序集)就抛异常。
        /// 清单已在缓存时 YooAsset 不发网络请求;覆盖安装新包会清掉缓存清单(YooAsset 默认 InstallClearMode),此时走失败分支。
        /// </remarks>
        private async UniTaskVoid EnterWithLocalVersionAsync(string packageVersion)
        {
            var manifestOperation = _resourceModule.UpdatePackageManifestAsync(packageVersion);
            await manifestOperation;
            if (manifestOperation.Status != EOperationStatus.Succeed)
            {
                OnLocalVersionUnavailable($"本地版本 {packageVersion} 的资源清单加载失败:{manifestOperation.Error}");
                return;
            }

            int missingCount = _resourceModule.CreateResourceDownloader().TotalDownloadCount;
            if (missingCount > 0)
            {
                OnLocalVersionUnavailable($"本地版本 {packageVersion} 缺少 {missingCount} 个资源文件");
                return;
            }

            _resourceModule.PackageVersion = packageVersion;
            ChangeToLoadAssemblyState(_procedureOwner);
        }

        private void OnLocalVersionUnavailable(string reason)
        {
            Log.Error(reason);
            LauncherMgr.ShowMessageBox($"获取远程版本失败，本地资源不可用，无法离线进入游戏！点击确认重试\n <color=#FF0000>{reason}</color>",
                () => { Utility.Unity.StartCoroutine(InitResources(_procedureOwner)); },
                Application.Quit);
        }
    }
}