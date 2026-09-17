!function(t, e) {
"object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define([ "exports" ], e) : e((t = "undefined" != typeof globalThis ? globalThis : t || self).MBHHotUpdate = {});
}(this, function(exports) {
"use strict";
let EventManager = new cc.EventTarget();
const SHOWBLOCK = "SHOWBLOCK", HIDEBLOCK = "HIDEBLOCK", SHOWTIPS = "SHOWTIPS", UPDATE_PROGRESSION = "UPDATE_PROGRESSION", UPDATE_FINISH = "UPDATE_FINISH", UPDATE_FAILED = "UPDATE_FAILED", UPDATE_CHECK_RETRY = "UPDATE_CHECK_RETRY", UPDATE_RETRY = "UPDATE_RETRY", UPDATE_RETRY_CHECK_OVER = "UPDATE_RETRY_CHECK_OVER";
var updatePoint;
exports.updatePoint = void 0, updatePoint = exports.updatePoint || (exports.updatePoint = {}), 
updatePoint[updatePoint.LOGIN_TIMEOUT = 1e3] = "LOGIN_TIMEOUT", updatePoint[updatePoint.LOGIN_ERROR = 1001] = "LOGIN_ERROR", 
updatePoint[updatePoint.LOGIN_SUCCESS = 1002] = "LOGIN_SUCCESS", updatePoint[updatePoint.LINKDATA_MISSING = 1003] = "LINKDATA_MISSING", 
updatePoint[updatePoint.VERSION_LOW = 1004] = "VERSION_LOW", updatePoint[updatePoint.FORCE_UPDATE = 1005] = "FORCE_UPDATE", 
updatePoint[updatePoint.FORCE_UPDATE_CLICK = 1006] = "FORCE_UPDATE_CLICK", updatePoint[updatePoint.CHECK_UPDATE = 1007] = "CHECK_UPDATE", 
updatePoint[updatePoint.LOCAL_MANIFEST_LOAD_FAIL = 1008] = "LOCAL_MANIFEST_LOAD_FAIL", 
updatePoint[updatePoint.ERROR_DOWNLOAD_MANIFEST = 1009] = "ERROR_DOWNLOAD_MANIFEST", 
updatePoint[updatePoint.ERROR_PARSE_MANIFEST = 1010] = "ERROR_PARSE_MANIFEST", updatePoint[updatePoint.ALREADY_UP_TO_DATE = 1011] = "ALREADY_UP_TO_DATE", 
updatePoint[updatePoint.NEW_VERSION_FOUND = 1012] = "NEW_VERSION_FOUND", updatePoint[updatePoint.MANIFEST_FILE_DOWNLOADED = 1013] = "MANIFEST_FILE_DOWNLOADED", 
updatePoint[updatePoint.UPDATE_START = 1014] = "UPDATE_START", updatePoint[updatePoint.UPDATE_PROGRESSION = 1015] = "UPDATE_PROGRESSION", 
updatePoint[updatePoint.UPDATE_FINISHED = 1016] = "UPDATE_FINISHED", updatePoint[updatePoint.UPDATE_FAILED_TO_RETRY = 1017] = "UPDATE_FAILED_TO_RETRY", 
updatePoint[updatePoint.UPDATE_CHECK_FAILED = 1018] = "UPDATE_CHECK_FAILED", updatePoint[updatePoint.UPDATE_FAILED = 1019] = "UPDATE_FAILED", 
updatePoint[updatePoint.SPACE_NOT_ENOUGH = 1020] = "SPACE_NOT_ENOUGH", updatePoint[updatePoint.UPDATE_TIMEOUT = 1021] = "UPDATE_TIMEOUT", 
updatePoint[updatePoint.REMOTE_COMMOND_FAIL = 1022] = "REMOTE_COMMOND_FAIL", updatePoint[updatePoint.REMOTE_COMMOND_SUCCESS = 1023] = "REMOTE_COMMOND_SUCCESS", 
updatePoint[updatePoint.G_CFG_ERROR = 1024] = "G_CFG_ERROR", updatePoint[updatePoint.ZIP_UPDATE_START = 2e3] = "ZIP_UPDATE_START", 
updatePoint[updatePoint.ZIP_VERSION_INFO = 2001] = "ZIP_VERSION_INFO", updatePoint[updatePoint.ZIP_DOWNLOAD_PROGRESS = 2002] = "ZIP_DOWNLOAD_PROGRESS", 
updatePoint[updatePoint.ZIP_DOWNLOAD_SUCCESS = 2003] = "ZIP_DOWNLOAD_SUCCESS", updatePoint[updatePoint.ZIP_DOWNLOAD_FAILED = 2004] = "ZIP_DOWNLOAD_FAILED", 
updatePoint[updatePoint.ZIP_DOWNLOAD_RETRY = 2005] = "ZIP_DOWNLOAD_RETRY", updatePoint[updatePoint.ZIP_UNZIP_START = 2006] = "ZIP_UNZIP_START", 
updatePoint[updatePoint.ZIP_UNZIP_SUCCESS = 2007] = "ZIP_UNZIP_SUCCESS", updatePoint[updatePoint.ZIP_UNZIP_FAILED = 2008] = "ZIP_UNZIP_FAILED", 
updatePoint[updatePoint.ZIP_UPDATE_FINISHED = 2009] = "ZIP_UPDATE_FINISHED", updatePoint[updatePoint.ZIP_UPDATE_FAILED = 2010] = "ZIP_UPDATE_FAILED", 
updatePoint[updatePoint.TEXTURE_SUPPORT = 3e3] = "TEXTURE_SUPPORT", window.G_Cfg = window.G_Cfg || {};
class Updater {
constructor() {
this._updating = !1, this._storagePath = "", this._am = null, this._checkOverCallback = null, 
this._updateCallback = null, this._updateOverCallback = null, this._updateStartTime = Date.now(), 
this._progressStatisCount = 20, this._remoteManifestRootUrl = "", this._retryCurrentTimes = 0, 
this._srcTotalBytes = 0, this._allDownloadBytes = 0, this._cancelUpdate = !1, this._isDeferred = !1, 
this._nativeUrl = "assets/project.manifest", this._cachePath = "patch", this._updateInfo = "", 
this.remoteVersion = "", this.tracePoint = null;
}
static getInstance() {
return this._instance || (this._instance = new Updater().init()), this._instance;
}
init() {
return jsb.fileUtils.isFileExist(this._nativeUrl) || (this._nativeUrl = ""), this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + this._cachePath, 
this.ignoreUpdate() || this.initAssetManager(), this;
}
initAssetManager() {
var t, e;
this._am = new jsb.AssetsManager(this._nativeUrl, this._storagePath, this.versionCompare), 
this.deferredEffect(this._isDeferred), null === (e = null === (t = this._am) || void 0 === t ? void 0 : t.setNeedToCheckMd5) || void 0 === e || e.call(t, !0);
}
versionCompare(t, e) {
const i = t.split("."), s = e.split(".");
for (let t = 0; t < i.length; ++t) if (parseInt(i[t]) !== parseInt(s[t] || "0")) return -1;
return s.length !== i.length ? -1 : 0;
}
getVersion() {
var t, e;
return (null === (e = null === (t = this._am) || void 0 === t ? void 0 : t.getLocalManifest()) || void 0 === e ? void 0 : e.getVersion()) || "1.1.1.1.1";
}
getUpdateVersion() {
var t, e;
return (null === (e = null === (t = this._am) || void 0 === t ? void 0 : t.getRemoteManifest()) || void 0 === e ? void 0 : e.getVersion()) || this.getVersion();
}
getRemoteManifestRootUrl() {
return this._remoteManifestRootUrl;
}
checkUpdate(t, e, i) {
if (this._updateInfo = this._updateInfo || `${this.getVersion()}=>${this.remoteVersion}`, 
this.ignoreUpdate()) null == e || e(); else {
if (!i) throw new Error("remoteManifestRootUrl is null");
if (this._remoteManifestRootUrl = i, this._updateCallback = t, this._checkOverCallback = e, 
this._updating) return void EventManager.emit(SHOWTIPS, "Checking or updating...");
if (this.setRemoteManifestRootUrl(), !this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) return EventManager.emit(SHOWTIPS, "Failed to load local manifest ..."), 
this.sendStatistic({
id: exports.updatePoint.LOCAL_MANIFEST_LOAD_FAIL,
desc: this._updateInfo
}), void (null == e || e());
this._am.setEventCallback(this.checkCb.bind(this)), this._updateStartTime = Date.now(), 
this._am.checkUpdate(), this._updating = !0;
}
}
ignoreUpdate() {
return !((cc.sys.os === cc.sys.OS_ANDROID || cc.sys.os === cc.sys.OS_IOS) && cc.sys.isNative && !G_Cfg.skipHotPatch && jsb.fileUtils.isFileExist(this._nativeUrl));
}
checkCb(t) {
var e;
let i = !1, s = !1;
const a = `checkCb, eventCode=${t.getEventCode()}`;
switch (t.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
EventManager.emit(SHOWTIPS, a), this.sendStatistic({
id: exports.updatePoint.LOCAL_MANIFEST_LOAD_FAIL,
desc: this._updateInfo
});
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
EventManager.emit(SHOWTIPS, a), this.sendStatistic({
id: exports.updatePoint.ERROR_DOWNLOAD_MANIFEST,
desc: this._updateInfo
}), i = !0;
break;

case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
EventManager.emit(SHOWTIPS, a), this.sendStatistic({
id: exports.updatePoint.ERROR_PARSE_MANIFEST,
desc: this._updateInfo
}), i = !0;
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
return this._am.setEventCallback(null), this._updating = !1, EventManager.emit(SHOWTIPS, a), 
this.sendStatistic({
id: exports.updatePoint.ALREADY_UP_TO_DATE,
desc: this._updateInfo
}), void (null === (e = this._checkOverCallback) || void 0 === e || e.call(this));

case jsb.EventAssetsManager.NEW_VERSION_FOUND:
this._am.setEventCallback(null), this._updating = !1;
const n = this.getTotalBytes();
if (this.sendStatistic({
id: exports.updatePoint.NEW_VERSION_FOUND,
desc: `${this._updateInfo}, size=${t.getTotalBytes()}`
}), !this._srcTotalBytes) {
EventManager.emit(SHOWTIPS, `size:${this.getTotalCount()}`), this._srcTotalBytes = n;
const t = this._updateCallback;
return this._updateCallback = null, void (null == t || t());
}
s = !0, this._allDownloadBytes = this._srcTotalBytes - n;
break;

case jsb.EventAssetsManager.UPDATE_PROGRESSION:
return void this.sendStatistic({
id: exports.updatePoint.MANIFEST_FILE_DOWNLOADED,
desc: this._updateInfo
});

default:
return;
}
if (this._am.setEventCallback(null), this._updating = !1, i) return this.resetAssetManager(), 
void EventManager.emit(UPDATE_CHECK_RETRY);
s && EventManager.emit(UPDATE_RETRY_CHECK_OVER, {
callback: () => {
this.hotUpdate();
}
});
}
getTotalBytes() {
var t;
return (null === (t = this._am) || void 0 === t ? void 0 : t.getTotalBytes()) || 0;
}
getTotalCount() {
const t = (this.getTotalBytes() / 1048576).toFixed(2);
return Number(t);
}
hotUpdate(t) {
cc.sys.isNative && this._am && !this._updating && (this.sendStatistic({
id: exports.updatePoint.UPDATE_START,
desc: this._updateInfo
}), this._updateOverCallback = t || this._updateOverCallback, this._am.setEventCallback(this.updateCb.bind(this)), 
this._am.update());
}
updateCb(t) {
var e;
let i = !1, s = !1, a = !1;
const n = `updateCb, eventCode=${t.getEventCode()}`;
switch (t.getEventCode()) {
case jsb.EventAssetsManager.UPDATE_PROGRESSION:
const e = t.getPercent(), o = t.getDownloadedBytes() + this._allDownloadBytes, r = (o / 1048576).toFixed(2);
EventManager.emit(UPDATE_PROGRESSION, {
byteProgress: o / this._srcTotalBytes,
downloadSize: r,
downloadBytes: o
}), Math.floor(100 * e) >= this._progressStatisCount && (this._progressStatisCount += 20, 
this.sendStatistic({
id: exports.updatePoint.UPDATE_PROGRESSION,
desc: this._updateInfo
}), EventManager.emit(UPDATE_PROGRESSION));
break;

case jsb.EventAssetsManager.UPDATE_FAILED:
EventManager.emit(SHOWTIPS, "UPDATE_FAILED:" + t.getMessage()), this._retryCurrentTimes++, 
this._retryCurrentTimes > Updater.RETRY_TOTAL_TIMES ? s = !0 : a = !0, this.sendStatistic({
id: exports.updatePoint.UPDATE_FAILED_TO_RETRY,
desc: `${this._updateInfo},retryCurrentTimes=${this._retryCurrentTimes}`
});
break;

case jsb.EventAssetsManager.UPDATE_FINISHED:
i = !0, this.sendStatistic({
id: exports.updatePoint.UPDATE_FINISHED,
desc: `${this._updateInfo},costTime=${Date.now() - this._updateStartTime}`
}), EventManager.emit(UPDATE_FINISH);
break;

case jsb.EventAssetsManager.ERROR_UPDATING:
EventManager.emit(SHOWTIPS, `(ERROR_UPDATING:${t.getAssetId()},${t.getMessage()})`);
try {
(t.getMessage() || "").includes("(416)") && jsb.fileUtils.removeFile(`${this._storagePath}_temp/${t.getAssetId()}.tmp`);
} catch (t) {}
break;

case jsb.EventAssetsManager.ERROR_DECOMPRESS:
EventManager.emit(SHOWTIPS, n);
}
if (!this._cancelUpdate) return i ? (this.resetRetryStatus(), this._am.setEventCallback(null), 
void (null === (e = this._updateOverCallback) || void 0 === e || e.call(this))) : s ? (this.resetRetryStatus(), 
this._am.setEventCallback(null), void EventManager.emit(UPDATE_FAILED)) : a ? (this.resetAssetManager(), 
this.setRemoteManifestRootUrl(), void EventManager.emit(UPDATE_RETRY, {
callback: () => {
this._am.setEventCallback(this.checkCb.bind(this)), this._am.checkUpdate(), this._updating = !0;
}
})) : void 0;
this.resetRetryStatus();
}
setRemoteManifestRootUrl() {
this._am && this._am.setRemoteManifestRootUrl && this._remoteManifestRootUrl && this._am.setRemoteManifestRootUrl(this._remoteManifestRootUrl);
}
resetRetryStatus() {
this._retryCurrentTimes = 0, this._srcTotalBytes = 0, this._allDownloadBytes = 0;
}
cancelUpdate() {
var t;
this._cancelUpdate = !0, null === (t = this._am) || void 0 === t || t.cancelUpdate();
}
setMaxConcurrentTask(t) {
var e;
null === (e = this._am) || void 0 === e || e.setMaxConcurrentTask(t);
}
deferredEffect(t) {
var e, i;
this._isDeferred = t, null === (i = null === (e = this._am) || void 0 === e ? void 0 : e.setHotUpdateDeferred) || void 0 === i || i.call(e, this._isDeferred);
}
resetAssetManager() {
var t;
this._cancelUpdate = !1, this._updating = !1, null === (t = this._am) || void 0 === t || t.setEventCallback(null), 
this._am = null, this.initAssetManager();
}
sendStatistic(t) {
var e;
t.version = this.getVersion(), null === (e = this.tracePoint) || void 0 === e || e.call(this, t);
}
}
Updater._instance = null, Updater.RETRY_TOTAL_TIMES = 3;
class ZipUpdater {
constructor() {
this._retryCount = 0, this._updateStartTime = 0, this._downloader = null, this._progressLogCount = 20, 
this._hasReportedVersionInfo = !1, this._options = null, this._zipTempPath = "", 
this._patchTempPath = "", this._zipFilePath = "", this._zipUrl = "", this._updaeInfo = "", 
this._taskId = null;
}
static getInstance() {
return this._instance || (this._instance = new ZipUpdater()), this._instance;
}
static canUseZipUpdate(t) {
var e;
try {
const i = "function" == typeof jsb.fileUtils.unzip, s = "function" == typeof jsb.DownloadClient;
return !!((null === (e = G_Cfg.zipV) || void 0 === e ? void 0 : e.includes(t)) && i && s);
} catch (t) {
return !1;
}
}
startUpdate(t) {
this._options = t, this._updateStartTime = Date.now(), this._retryCount = 0, this._progressLogCount = 20, 
this._hasReportedVersionInfo = !1, this._zipTempPath = t.writablePath + "zip_temp", 
this._patchTempPath = t.writablePath + "patch_temp";
const e = `${t.version}_${t.remoteVersion}.zip`;
this._zipFilePath = `${this._zipTempPath}/${e}`, this._zipUrl = `${t.cdnUrl}/${t.version}.zip`, 
this._updaeInfo = `${t.version}=>${t.remoteVersion}`, this.sendStatistic({
id: exports.updatePoint.ZIP_UPDATE_START,
desc: this._updaeInfo
}), this.downloadWithRetry();
}
downloadWithRetry() {
this._options && (this._options.availableDiskSize() && this._options.isNetworkValid() ? (this._retryCount++, 
this.downloadZip()) : this.onUpdateFailed("空间不足或网络异常"));
}
downloadZip() {
if (!this._options) return;
jsb.fileUtils.isDirectoryExist(this._zipTempPath) || jsb.fileUtils.createDirectory(this._zipTempPath);
const t = Date.now();
this.cancelUpdate(), this._downloader = new jsb.DownloadClient({
maxConcurrentTasks: 5,
enableResume: !0
}), this._taskId = this._downloader.downloadFile({
url: this._zipUrl,
path: this._zipFilePath,
success: () => {
const e = Date.now() - t;
this.sendStatistic({
id: exports.updatePoint.ZIP_DOWNLOAD_SUCCESS,
desc: `${this._updaeInfo},costTime=${e}ms`
}), this.unzipUpdate();
},
failure: (t, e, i, s, a) => {
const n = `zip下载失败: url=${e}, code=${i}, httpStatus=${s}, msg=${a}`;
this.sendStatistic({
id: exports.updatePoint.ZIP_DOWNLOAD_FAILED,
desc: `${this._updaeInfo}, msg=${n},retry=${this._retryCount}`
}), this.handleRetry(`下载失败:${a}`);
},
progress: (t, e, i, s) => {
if (!this._hasReportedVersionInfo && s > 0) {
this._hasReportedVersionInfo = !0;
const t = (s / 1048576).toFixed(2);
this.sendStatistic({
id: exports.updatePoint.ZIP_VERSION_INFO,
desc: `${this._updaeInfo},size=${t}MB`
});
}
const a = s > 0 ? i / s * 100 : 0;
if (a >= this._progressLogCount) {
this._progressLogCount += 20;
const t = (i / 1048576).toFixed(2);
this.sendStatistic({
id: exports.updatePoint.ZIP_DOWNLOAD_PROGRESS,
desc: `progress=${a.toFixed(1)}%,downloaded=${t}MB`
});
}
}
});
}
unzipUpdate() {
if (!this._options) return;
this.sendStatistic({
id: exports.updatePoint.ZIP_UNZIP_START,
desc: this._updaeInfo
});
const t = Date.now();
this.cleanupPatchTemp(), jsb.fileUtils.unzip({
zipPath: this._zipFilePath,
destPath: this._patchTempPath,
success: () => {
const e = Date.now() - t;
this.sendStatistic({
id: exports.updatePoint.ZIP_UNZIP_SUCCESS,
desc: `${this._updaeInfo},costTime=${e}ms`
}), this.onUpdateSuccess();
},
failure: t => {
const e = JSON.stringify(t);
this.sendStatistic({
id: exports.updatePoint.ZIP_UNZIP_FAILED,
desc: `${this._updaeInfo},err=${e},retry=${this._retryCount}`
}), this.cleanupPatchTemp(), this.cleanupZipTemp(), this.handleRetry(`解压失败:${e}`);
}
});
}
cleanupPatchTemp() {
try {
jsb.fileUtils.isDirectoryExist(this._patchTempPath) && jsb.fileUtils.removeDirectory(this._patchTempPath), 
jsb.fileUtils.createDirectory(this._patchTempPath);
} catch (t) {}
}
cleanupZipTemp() {
try {
jsb.fileUtils.isDirectoryExist(this._zipTempPath) && jsb.fileUtils.removeDirectory(this._zipTempPath);
} catch (t) {}
}
handleRetry(t) {
this._retryCount < ZipUpdater.RETRY_TOTAL_TIMES ? (this.sendStatistic({
id: exports.updatePoint.ZIP_DOWNLOAD_RETRY,
desc: `${this._updaeInfo},retry=${this._retryCount},reason=${t}`
}), this._progressLogCount = 20, this.downloadWithRetry()) : this.onUpdateFailed(t);
}
onUpdateSuccess() {
if (!this._options) return;
const t = Date.now() - this._updateStartTime;
this.sendStatistic({
id: exports.updatePoint.ZIP_UPDATE_FINISHED,
desc: `${this._updaeInfo},costTime=${t}ms`
}), EventManager.emit(UPDATE_FINISH), this.cleanupZipTemp(), this._options.onSuccess();
}
onUpdateFailed(t) {
if (!this._options) return;
const e = Date.now() - this._updateStartTime;
this.sendStatistic({
id: exports.updatePoint.ZIP_UPDATE_FAILED,
desc: `reason=${t},costTime=${e}ms,retryCount=${this._retryCount}`
}), EventManager.emit(UPDATE_FAILED), this._options.onFailed(t);
}
sendStatistic(t) {
this._options && (t.version = this._options.version, this._options.sendStatistic(t));
}
cancelUpdate() {
if (this._taskId && this._downloader.abort(this._taskId), this._downloader) try {
this._downloader = null;
} catch (t) {}
}
}
ZipUpdater._instance = null, ZipUpdater.RETRY_TOTAL_TIMES = 3;
class Url {
getParam(t) {
let e = "";
for (var i in t) {
let s = void 0 !== t[i] ? t[i] : "";
e += `&${i}=${encodeURIComponent(s)}`;
}
return e ? e.substring(1) : "";
}
getUrl(t, e) {
return t + (t.indexOf("?") < 0 ? "?" : "") + this.getParam(e);
}
}
function generateTraceId() {
return `${Date.now()}${Math.floor(1e6 * Math.random()).toString().padStart(6, "0")}`;
}
function easyHttpRequest(t, e, i, s, a, n, o, r = !1, _ = !1) {
if (!t) throw new Error("easyHttpRequest url is null");
if (i = i || "GET", r || EventManager.emit(SHOWBLOCK), "GET" == i && e) {
let i = new Url();
t = i.getUrl(t, e), e = null;
}
const d = n && n["X-Trace-ID"] || generateTraceId();
let l = new XMLHttpRequest();
o && (l.timeout = o);
const h = {}, p = t => {
a && a(l.status, l.responseText, t, h), a = null;
};
if (l.addEventListener("abort", () => {
p("abort");
}), l.ontimeout = () => {
p("timeout");
}, l.onerror = function(t) {
const e = JSON.stringify(t);
r || EventManager.emit(HIDEBLOCK), !_ && EventManager.emit(SHOWTIPS, e), p(e);
}, l.onreadystatechange = function() {
const e = `readyState_${l.readyState}`;
if (h[e] = h[e] || Date.now(), 4 == l.readyState) if (r || EventManager.emit(HIDEBLOCK), 
l.status >= 200 && l.status < 400) s && s(l.status, l.responseText, h); else {
p();
let e = `http error:${t},status:${l.status}`;
!_ && EventManager.emit(SHOWTIPS, e);
}
}, l.open(i, t), n) for (const t in n) l.setRequestHeader(t, n[t]);
return n && n["X-Trace-ID"] || l.setRequestHeader("X-Trace-ID", d), l.send(e), d;
}
const defDiskSizeRequired = 200, checkMaxRetry = 3, appInstallTag = "patch/baseTag", loginDataDefaultKey = "__loginDataDefault__", customLineKey = "__customLine__", remoteCommondTagKey = "__remoteCommondTag__", restartTagKey = "__restartTagKey__", zipUpdateRateKey = "__zipUpdateRate__";
class LoginController {
constructor() {
this._updater = null, this._isRestart = !1, this._cdnUrlIndex = 0, this._cdnUrl = "", 
this._cdnUrlArray = [], this._isEnterGame = !1, this._loginData = null, this._linkData = null, 
this._checkUpdateCount = 0, this._callback = null, this._version = "1.1.1.1.1", 
this._remoteVersion = "", this._fixGameData = null, this._deviceInfo = {}, this.showTips = null, 
this.tracePoint = null, this.customCanHotUpdate = null, this.customRemoteVersion = null, 
this.localStorage = cc.sys.localStorage, this.requestTimeout = 3, this.loginTimeout = 6, 
this.isRequestTimeout = !1, this.isLoginTimeout = !1;
}
get version() {
return this._version;
}
get remoteVersion() {
return this._remoteVersion;
}
static instance() {
return this._ins || (this._ins = new LoginController()), this._ins;
}
registerListeners() {
let t = this.getMessageListeners();
for (const e in t) EventManager.on(e.toString(), (...i) => {
t[e](...i);
}, this);
}
init(t, e) {
if (this.isValid() && (this._fixGameData = e, this._deviceInfo = t, this._updater = Updater.getInstance(), 
this._updater.tracePoint = this.tracePoint, this.localStorage = this.localStorage || cc.sys.localStorage, 
this._version = this._updater.getVersion(), cc.sys.isNative)) {
const t = jsb.fileUtils.getWritablePath() + appInstallTag;
jsb.fileUtils.isFileExist(t) && (this.fixGameData(), jsb.fileUtils.removeFile(t));
}
}
isValid() {
try {
return !!G_Cfg.baseVersion && cc.sys.isNative && jsb.AssetsManager.prototype.setNeedToCheckMd5;
} catch (t) {
this.sendStatistic({
id: exports.updatePoint.G_CFG_ERROR
});
}
return !1;
}
updateFail() {}
getMessageListeners() {
return {
[UPDATE_PROGRESSION]: () => {},
[UPDATE_FAILED]: () => {
this.sendStatistic({
id: exports.updatePoint.UPDATE_FAILED
}), this.updateFail(), this.enterGame();
},
[UPDATE_CHECK_RETRY]: () => {
this.checkUpdate();
},
[UPDATE_RETRY]: t => {
this.isNetworkValid() && this.availableDiskSize() ? t.callback() : this.enterGame();
},
[UPDATE_RETRY_CHECK_OVER]: t => {
this.isNetworkValid() && this.availableDiskSize(2 * this._updater.getTotalCount()) ? t.callback() : this.enterGame();
}
};
}
checkAPP() {
const t = jsb.fileUtils.getWritablePath() + "patch";
return !!jsb.fileUtils.isFileExist(`${t}/baseV`);
}
login(t, e) {
this.checkAPP() ? (this._callback = e, this.setInterval(this.loginTimeout, t => !(!this._isEnterGame && !this._isRestart) || t <= 0 && (this.isLoginTimeout = !0, 
this.sendStatistic({
id: exports.updatePoint.UPDATE_TIMEOUT
}), this.enterGame(), !0)), this.registerListeners(), this.loginRequest(t)) : this.easyTips("base app error", () => {});
}
setInterval(t, e) {
let i = null;
return i = setInterval(() => {
(e(--t) || t <= 0) && clearInterval(i);
}, 1e3);
}
restartGame() {
var t, e;
this._isRestart = !0, this.localStorage.setItem(restartTagKey, "1"), null === (e = null === (t = window.spine) || void 0 === t ? void 0 : t.SkeletonCacheMgr) || void 0 === e || e.destroyInstance(), 
cc.game.restart();
}
startUpdate() {
this._updater.hotUpdate(() => {
this._isEnterGame || this.restartGame();
});
}
startZipUpdate() {
const t = this.getCdnUrl();
if (!t) return void this.enterGame();
const e = jsb.fileUtils.getWritablePath();
ZipUpdater.getInstance().startUpdate({
version: this._version,
remoteVersion: this._remoteVersion,
cdnUrl: t,
writablePath: e,
onSuccess: () => {
this._isEnterGame || this.restartGame();
},
onFailed: () => {
this.updateFail(), this.enterGame();
},
sendStatistic: this.sendStatistic.bind(this),
isNetworkValid: this.isNetworkValid.bind(this),
availableDiskSize: this.availableDiskSize.bind(this)
});
}
enterGame() {
this._isEnterGame || this._isRestart || (this._version = this._updater.getVersion(), 
this._isEnterGame = !0, this._updater.deferredEffect(!0), setTimeout(() => {
this._callback && this._callback(this._loginData);
}, 32));
}
compareVersion(t, e) {
const i = t.split(".").map(Number), s = e.split(".").map(Number), a = Math.max(i.length, s.length);
for (let t = 0; t < a; t++) {
const e = (i[t] || 0) - (s[t] || 0);
if (e) return e > 0 ? 1 : -1;
}
return 0;
}
initLoginState() {
var _a, _b, _c, _d, _e, _f;
let linkData = null === (_c = null === (_b = null === (_a = this._loginData) || void 0 === _a ? void 0 : _a.experimentDataMap) || void 0 === _b ? void 0 : _b.defaultLayer) || void 0 === _c ? void 0 : _c.linkData;
if (linkData = linkData || (null === (_e = null === (_d = this._loginData) || void 0 === _d ? void 0 : _d.data) || void 0 === _e ? void 0 : _e.link_data), 
!linkData) return;
this._linkData = linkData;
const customParams = null == linkData ? void 0 : linkData.customParams;
if (customParams && Object.assign(G_Cfg, customParams), this._cdnUrlArray = linkData.urls, 
this._remoteVersion = linkData.version, this.customRemoteVersion) {
const t = this.customRemoteVersion();
t && (this._cdnUrlArray.map(e => e.replace(this._remoteVersion, t)), this._remoteVersion = t);
}
if (G_Cfg.remoteCommondInfo && (this.localStorage.getItem(remoteCommondTagKey) != G_Cfg.remoteCommondInfo.remoteCommondTag || !G_Cfg.remoteCommondInfo.remoteCommondTag) && (G_Cfg.remoteCommondInfo.uuid == (null === (_f = this._deviceInfo) || void 0 === _f ? void 0 : _f.uuid) || !G_Cfg.remoteCommondInfo.uuid)) {
if (G_Cfg.remoteCommondInfo.cleanRes) this.fixClientRes(); else if (G_Cfg.remoteCommondInfo.tips) setTimeout(() => {
this.easyTips(G_Cfg.remoteCommondInfo.tips, () => {});
}, 6e3); else try {
eval(G_Cfg.remoteCommondInfo.jsStr);
} catch (t) {
return void this.sendStatistic({
id: exports.updatePoint.REMOTE_COMMOND_FAIL
});
}
G_Cfg.remoteCommondInfo.remoteCommondTag && this.localStorage.setItem(remoteCommondTagKey, G_Cfg.remoteCommondInfo.remoteCommondTag), 
this.sendStatistic({
id: exports.updatePoint.REMOTE_COMMOND_SUCCESS
});
}
}
fixClientRes() {
if (cc.sys.isNative) {
const t = jsb.fileUtils.getWritablePath(), e = t + "patch", i = t + "../tmp";
jsb.fileUtils.removeDirectory(e), jsb.fileUtils.removeDirectory(e + "_temp"), jsb.fileUtils.removeDirectory(i), 
cc.assetManager.cacheManager.clearCache(), this.fixGameData(), this.restartGame();
}
}
fixGameData() {
this.localStorage.setItem(loginDataDefaultKey, ""), this._fixGameData && this._fixGameData();
}
openUrl(t) {
cc.sys.openURL(t);
}
loginComplete(t) {
var e;
let i = this.localStorage.getItem(loginDataDefaultKey), s = !1;
if (t || !!i && (s = !0), this._loginData = t || i && JSON.parse(i), this.initLoginState(), 
this._isRestart) return;
if (!this._linkData) return this._loginData && !s && this.sendStatistic({
id: exports.updatePoint.LINKDATA_MISSING
}), void this.enterGame();
const a = G_Cfg.hotMinVersion && this.compareVersion(this._version, G_Cfg.hotMinVersion) < 0;
if (this._updater.ignoreUpdate() || a) return a && this.sendStatistic({
id: exports.updatePoint.VERSION_LOW
}), void this.enterGame();
if (G_Cfg.hotMaxVersion && this.compareVersion(this._version, G_Cfg.hotMaxVersion) > 0) return void this.enterGame();
if (G_Cfg.hotRateLimit && Math.random() > G_Cfg.hotRateLimit) return void this.enterGame();
const n = null === (e = this._deviceInfo) || void 0 === e ? void 0 : e.app_version;
if (G_Cfg.minAppV && n && this.compareVersion(n, G_Cfg.minAppV) < 0) if (this.sendStatistic({
id: exports.updatePoint.FORCE_UPDATE
}), G_Cfg.showForceTips) {
const t = !0 !== G_Cfg.showForceTips ? G_Cfg.showForceTips : "For the best experience, please update your app to the newest version.";
this.easyTips(t, () => {
G_Cfg.forceUpdateUrl && this.openUrl(G_Cfg.forceUpdateUrl), this.sendStatistic({
id: exports.updatePoint.FORCE_UPDATE_CLICK
});
}), this._isEnterGame = !0;
} else this.enterGame(); else {
if (this.customCanHotUpdate && !this.customCanHotUpdate()) return void this.enterGame();
this._remoteVersion != this._version ? ZipUpdater.canUseZipUpdate(this._version) && this.isHitZipUpdateRate() ? this.startZipUpdate() : (this._updater.remoteVersion = this._remoteVersion, 
this.checkUpdate()) : this.enterGame();
}
}
isHitZipUpdateRate() {
if (G_Cfg.hasOwnProperty("zipUpdateRate")) {
let t = this.localStorage.getItem(zipUpdateRateKey);
return t ? t = Number(t) : (t = Math.random(), this.localStorage.setItem(zipUpdateRateKey, `${t}`)), 
t < G_Cfg.zipUpdateRate;
}
return !0;
}
getExtInfo(t) {
var e;
t = t || {}, G_Cfg.customLine && (t.customLine = G_Cfg.line);
const i = this.localStorage.getItem(customLineKey);
return i && (t.customLine = i), this._deviceInfo.device_id ? t.deviceId = this._deviceInfo.device_id || "unknown" : t.deviceId = null === (e = this._deviceInfo) || void 0 === e ? void 0 : e.uuid.split("_")[0], 
t.enable = !0, t;
}
loginRequest(t) {
const e = t.headerFun;
delete t.headerFun;
let i, s = e && e(), a = null, n = !1, o = "", r = "ok";
const _ = Date.now();
let d = {}, l = t => {
var e, s;
if (!n) {
if (o) {
const n = Date.now();
let l = n - _;
r = (null == t ? void 0 : t.err_message) || r;
let h = {
name: "s_tech_request_init_success",
trace_id: o,
http_code: i,
request_start: _,
request_end: n,
url: a[0],
total_time: l,
err_message: r,
readyState_1: 0,
readyState_2: 0,
readyState_3: 0,
readyState_4: 0,
resp_code: null == t ? void 0 : t.code,
resp_data: null === (s = null === (e = null == t ? void 0 : t.experimentDataMap) || void 0 === e ? void 0 : e.defaultLayer) || void 0 === s ? void 0 : s.gameWayNum
};
Object.assign(h, d), this.sendStatistic(h);
}
n = !0, this.loginComplete(t);
}
};
if (this.localStorage.getItem(restartTagKey) && this.localStorage.setItem(restartTagKey, ""), 
this.isNetworkValid()) if (G_Cfg.loginUrl) {
this.reportTextureSupport();
const n = this.requestTimeout > 0 ? this.requestTimeout : 3;
this.setInterval(n, t => !!(this._loginData || this._isEnterGame || this._isRestart) || t <= 0 && (this.isRequestTimeout = !0, 
r = "timeout", this.sendStatistic({
id: exports.updatePoint.LOGIN_TIMEOUT
}), l(), !0));
let _ = 2, h = _, p = {};
s || this.getExtInfo(p), Object.assign(p, t);
const c = t => {
h > 0 ? (h--, a[0] = G_Cfg.loginUrl[(_ - h) % G_Cfg.loginUrl.length], e && (a[5] = e() || {
"Content-Type": "application/json"
}), o = easyHttpRequest.apply(null, a)) : (this.sendStatistic({
id: exports.updatePoint.LOGIN_ERROR,
desc: t
}), l());
}, u = (t, e, s) => {
try {
i = t, d = s;
let a = JSON.parse(e);
this.localStorage.setItem(loginDataDefaultKey, e), this.sendStatistic({
id: exports.updatePoint.LOGIN_SUCCESS
}), l(a);
} catch (t) {
c("parse error");
}
}, E = (t, e, s, a) => {
i = t, d = a, r = s, c(s || `${t}` || "unknown error");
};
a = [ G_Cfg.loginUrl[(_ - h) % G_Cfg.loginUrl.length], JSON.stringify(p), "POST", u, E, s || {
"Content-Type": "application/json"
} ], o = easyHttpRequest.apply(null, a);
} else l(); else l();
}
isNetworkValid() {
return cc.sys.getNetworkType() != cc.sys.NetworkType.NONE || !1;
}
enterUpdate() {
this.availableDiskSize(2 * this._updater.getTotalCount()) && this.isNetworkValid() ? this.startUpdate() : this.enterGame();
}
getCdnUrl() {
return this._cdnUrl = this._cdnUrlArray[this._cdnUrlIndex], this._cdnUrlIndex = (this._cdnUrlIndex + 1) % this._cdnUrlArray.length, 
this._cdnUrl;
}
checkUpdate() {
if (!this.availableDiskSize() || !this.isNetworkValid()) return void this.enterGame();
if (this._checkUpdateCount >= checkMaxRetry) return this.sendStatistic({
id: exports.updatePoint.UPDATE_CHECK_FAILED
}), this.updateFail(), void this.enterGame();
this._checkUpdateCount++;
const t = this._cdnUrlIndex;
let e = this.getCdnUrl();
e ? (this.sendStatistic({
id: exports.updatePoint.CHECK_UPDATE,
desc: `remoteVersion:${this._remoteVersion},cdnIndex:${t},checkCount:${this._checkUpdateCount}`
}), e && this._updater.checkUpdate(this.enterUpdate.bind(this), this.enterGame.bind(this), e)) : this.enterGame();
}
availableDiskSize(t) {
var e;
let i = null === (e = this._deviceInfo) || void 0 === e ? void 0 : e.remain_diskspace;
return this._deviceInfo.hasOwnProperty("remain_diskspace") && (i = `${i}`), i = null == i ? void 0 : i.split(" ")[0], 
t = t || defDiskSizeRequired, !(null != i && Number(i) < t && (this.sendStatistic({
id: exports.updatePoint.SPACE_NOT_ENOUGH
}), setTimeout(() => {
this.easyTips("Insufficient disk space.", () => {});
}, 6e3), 1));
}
async easyTips(t, e, i) {
this.showTips ? this.showTips && this.showTips({
content: t,
cancelCallback: i,
sureCallback: e,
autoClose: !0
}) : e && e();
}
sendStatistic(t) {
var e;
t.version = this._version, null === (e = this.tracePoint) || void 0 === e || e.call(this, t);
}
reportTextureSupport() {
const t = cc.renderer.device, e = !!t.ext("WEBGL_compressed_texture_astc"), i = !!t.ext("WEBGL_compressed_texture_etc");
this.sendStatistic({
id: exports.updatePoint.TEXTURE_SUPPORT,
desc: `astc:${+e},etc2:${+i}`
});
}
}
LoginController._ins = null, exports.EventManager = EventManager, exports.HIDEBLOCK = HIDEBLOCK, 
exports.LoginController = LoginController, exports.SHOWBLOCK = SHOWBLOCK, exports.SHOWTIPS = SHOWTIPS, 
exports.UPDATE_CHECK_RETRY = UPDATE_CHECK_RETRY, exports.UPDATE_FAILED = UPDATE_FAILED, 
exports.UPDATE_FINISH = UPDATE_FINISH, exports.UPDATE_PROGRESSION = UPDATE_PROGRESSION, 
exports.UPDATE_RETRY = UPDATE_RETRY, exports.UPDATE_RETRY_CHECK_OVER = UPDATE_RETRY_CHECK_OVER;
});