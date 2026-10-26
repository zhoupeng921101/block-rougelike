using System;
using Cysharp.Threading.Tasks;
using TEngine;
using UnityEngine;
using YooAsset;

namespace Launcher
{
    /// <summary>
    /// 加载界面「清理缓存」的执行体:清掉本机已下载的资源缓存,然后退出游戏(网页版刷新页面)。
    /// 只动资源缓存,不碰账号凭据与本地设置。
    /// </summary>
    /// <remarks>
    /// 启动器段(<see cref="LoadUpdateUI"/>)直接调;热更后段的加载窗拿到的是这两个方法的委托,
    /// 随热更入口参数传过去(见 <see cref="ProcedureLoadAssembly"/> 调入口处),热更程序集不引用本程序集。
    /// </remarks>
    public static class CacheCleaner
    {
        /// <summary>
        /// 加载界面停留多久后露出清理按钮(秒,按 <see cref="Time.unscaledTime"/> 从启动起算)。
        /// 热更后段另有一份同值常量 <c>UILoadingPanel.ClearRevealSeconds</c>,两处须一起改。
        /// </summary>
        public const float RevealAfterSeconds = 15f;

        /// <summary>单步清理的等待上限(秒)。超时照常往下走:玩家已确认要清,不能停在「正在清理」上。</summary>
        private const float ClearTimeoutSeconds = 20f;

        /// <summary>
        /// 清掉全部已下载的资源文件与资源清单。不抛异常、有超时:调用方在它返回后给玩家下一步,
        /// 任何一条失败路径都不能把界面留在「正在清理」。
        /// </summary>
        public static async UniTask ClearAllAsync()
        {
            await ClearAsync(EFileClearMode.ClearAllBundleFiles);
            await ClearAsync(EFileClearMode.ClearAllManifestFiles);
#if UNITY_WEBGL && !UNITY_EDITOR
            // 网页版的资源缓存在浏览器里,上面两步在该平台是空操作。
            await ClearWebCacheAsync();
#endif
        }

        /// <summary>清理之后的收尾:退出游戏;网页版退不掉,改为刷新页面;编辑器内停止运行。</summary>
        public static void ExitGame()
        {
#if UNITY_EDITOR
            UnityEditor.EditorApplication.isPlaying = false;
#elif UNITY_WEBGL
            LauncherReloadPage();
#else
            Application.Quit();
#endif
        }

        private static async UniTask ClearAsync(EFileClearMode clearMode)
        {
            try
            {
                var operation = ModuleSystem.GetModule<IResourceModule>().ClearCacheFilesAsync(clearMode);
                float deadline = Time.realtimeSinceStartup + ClearTimeoutSeconds;
                while (!operation.IsDone && Time.realtimeSinceStartup < deadline)
                {
                    await UniTask.Yield();
                }

                if (!operation.IsDone)
                {
                    Log.Warning($"清理缓存超时({clearMode}),不再等待。");
                }
                else if (operation.Status != EOperationStatus.Succeed)
                {
                    Log.Warning($"清理缓存失败({clearMode}):{operation.Error}");
                }
            }
            catch (Exception e)
            {
                // 资源包没初始化成功时取不到清理操作,会走到这里。
                Log.Warning($"清理缓存异常({clearMode}):{e}");
            }
        }

#if UNITY_WEBGL && !UNITY_EDITOR
        [System.Runtime.InteropServices.DllImport("__Internal")]
        private static extern void LauncherClearWebCache();

        [System.Runtime.InteropServices.DllImport("__Internal")]
        private static extern int LauncherIsWebCacheCleared();

        [System.Runtime.InteropServices.DllImport("__Internal")]
        private static extern void LauncherReloadPage();

        private static async UniTask ClearWebCacheAsync()
        {
            try
            {
                LauncherClearWebCache();
                float deadline = Time.realtimeSinceStartup + ClearTimeoutSeconds;
                while (LauncherIsWebCacheCleared() == 0 && Time.realtimeSinceStartup < deadline)
                {
                    await UniTask.Yield();
                }
            }
            catch (Exception e)
            {
                Log.Warning($"清理网页缓存异常:{e}");
            }
        }
#endif
    }
}
