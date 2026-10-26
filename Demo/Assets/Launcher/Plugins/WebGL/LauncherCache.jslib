// 加载界面「清理缓存」的网页端实现,由 Assets/Launcher/Scripts/CacheCleaner.cs 调用。
// 网页版的资源缓存归 Unity 网页加载器管(UnityLoader/UnityCache.js):响应体在 Cache Storage,
// 请求元数据在 IndexedDB 的 UnityCache 库。这里只调加载器自己的 clearCache,不自行删库:
// 加载器对该库一直持有连接。
mergeInto(LibraryManager.library, {
  // 发起清理。异步完成,C# 侧轮询 LauncherIsWebCacheCleared。
  LauncherClearWebCache: function () {
    Module.launcherWebCacheCleared = 0;
    var done = function () { Module.launcherWebCacheCleared = 1; };
    try {
      Module.UnityCache.getInstance().clearCache().then(done, function (e) {
        console.warn("[Launcher] clear web cache rejected: " + e);
        done();
      });
    } catch (e) {
      console.warn("[Launcher] clear web cache failed: " + e);
      done();
    }
  },

  LauncherIsWebCacheCleared: function () {
    return Module.launcherWebCacheCleared ? 1 : 0;
  },

  LauncherReloadPage: function () {
    window.location.reload();
  }
});
