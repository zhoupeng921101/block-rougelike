using UnityEngine;
using UnityEngine.Networking;
using YooAsset;

/// <summary>
/// 预取资源所在的主资源包:只下载,不加载(不读出 AssetBundle、不占资源内存)。只取主包,不取依赖。
/// </summary>
/// <remarks>
/// 按资源包所属的文件系统分三种:
/// 缓存文件系统(联机模式)要下载时走 bundle 下载器下进缓存;
/// 网页远程文件系统没有下载这一步(NeedDownload 恒为 false),按加载时的同一请求(主地址 + 文件哈希 + CRC,同 UnityAssetBundleRequestOperation)
/// 取一遍让文件进浏览器缓存,之后加载能否命中取决于网页数据缓存与网页模板的 cacheControl;加密包加载走另一条请求,不预取;
/// 其余(内置、编辑器模拟、已在缓存)无需下载,直接成功。
/// </remarks>
public class PrefetchBundleOperation : GameAsyncOperation
{
    private enum ESteps
    {
        None,
        Check,
        Download,
        WebRequest,
        Done,
    }

    private readonly ResourcePackage _package;
    private readonly string _location;
    private ResourceDownloaderOperation _downloader;
    private UnityWebRequest _request;
    private UnityWebRequestAsyncOperation _requestOp;
    private ESteps _steps = ESteps.None;

    public PrefetchBundleOperation(ResourcePackage package, string location)
    {
        _package = package;
        _location = location;
    }

    protected override void OnStart()
    {
        _steps = ESteps.Check;
    }

    protected override void OnUpdate()
    {
        if (_steps == ESteps.None || _steps == ESteps.Done)
            return;

        if (_steps == ESteps.Check)
        {
            var assetInfo = _package.GetAssetInfo(_location);
            if (assetInfo.IsInvalid)
            {
                Finish(false, assetInfo.Error);
                return;
            }
            if (!(_package.PlayModeImpl is PlayModeImpl impl) || impl.ActiveManifest == null)
            {
                Finish(false, $"package {_package.PackageName} not initialized");
                return;
            }
            var bundle = impl.ActiveManifest.GetMainPackageBundle(assetInfo.Asset);
            var fileSystem = impl.GetBelongFileSystem(bundle);
            if (fileSystem is DefaultWebRemoteFileSystem web)
            {
                if (bundle.Encrypted)
                {
                    Finish(true, null);
                    return;
                }
                string url = web.RemoteServices.GetRemoteMainURL(bundle.FileName);
                var handler = web.DisableUnityWebCache
                    ? new DownloadHandlerAssetBundle(url, bundle.UnityCRC)
                    : new DownloadHandlerAssetBundle(url, Hash128.Parse(bundle.FileHash), bundle.UnityCRC);
                handler.autoLoadAssetBundle = false;
                _request = DownloadSystemHelper.NewUnityWebRequestGet(url);
                _request.downloadHandler = handler;
                _request.disposeDownloadHandlerOnDispose = true;
                _requestOp = _request.SendWebRequest();
                _steps = ESteps.WebRequest;
            }
            else if (fileSystem != null && fileSystem.NeedDownload(bundle))
            {
                _downloader = _package.CreateBundleDownloader(assetInfo, false, 1, 2);
                _downloader.BeginDownload();
                _steps = ESteps.Download;
            }
            else
            {
                Finish(true, null);
            }
        }

        if (_steps == ESteps.Download)
        {
            Progress = _downloader.Progress;
            if (!_downloader.IsDone)
                return;
            Finish(_downloader.Status == EOperationStatus.Succeed, _downloader.Error);
        }

        if (_steps == ESteps.WebRequest)
        {
            Progress = _requestOp.progress;
            if (!_requestOp.isDone)
                return;
            bool ok = _request.result == UnityWebRequest.Result.Success;
            string error = ok ? null : $"{_request.url} {_request.error}";
            DisposeRequest();
            Finish(ok, error);
        }
    }

    /// <summary>中止预取(下载器取消、网页请求中断)。</summary>
    public void Cancel() => Abort();

    protected override void OnAbort()
    {
        _downloader?.CancelDownload();
        if (_request != null)
        {
            _request.Abort();
            DisposeRequest();
        }
    }

    private void Finish(bool ok, string error)
    {
        _steps = ESteps.Done;
        Error = error;
        Status = ok ? EOperationStatus.Succeed : EOperationStatus.Failed;
    }

    private void DisposeRequest()
    {
        _request.Dispose();
        _request = null;
        _requestOp = null;
    }
}
