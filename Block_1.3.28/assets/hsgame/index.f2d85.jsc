window.__require = function e(t, n, i) {
function o(a, s) {
if (!n[a]) {
if (!t[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!t[c]) {
var l = "function" == typeof __require && __require;
if (!s && l) return l(c, !0);
if (r) return r(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var u = n[a] = {
exports: {}
};
t[a][0].call(u.exports, function(e) {
return o(t[a][1][e] || e);
}, u, u.exports, e, t, n, i);
}
return n[a].exports;
}
for (var r = "function" == typeof __require && __require, a = 0; a < i.length; a++) o(i[a]);
return o;
}({
AdvUtils: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "f1fb5cymphK8KVY+Jv6kobh", "AdvUtils");
var i = this && this.__awaiter || function(e, t, n, i) {
return new (n || (n = Promise))(function(o, r) {
function a(e) {
try {
c(i.next(e));
} catch (e) {
r(e);
}
}
function s(e) {
try {
c(i.throw(e));
} catch (e) {
r(e);
}
}
function c(e) {
e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, s);
var t;
}
c((i = i.apply(e, t || [])).next());
});
}, o = this && this.__generator || function(e, t) {
var n, i, o, r, a = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
},
trys: [],
ops: []
};
return r = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function s(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(r) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 
0) : i.next) && !(o = o.call(i, r[1])).done) return o;
(i = 0, o) && (r = [ 2 & r[0], o.value ]);
switch (r[0]) {
case 0:
case 1:
o = r;
break;

case 4:
a.label++;
return {
value: r[1],
done: !1
};

case 5:
a.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(o = a.trys, o = o.length > 0 && o[o.length - 1]) && (6 === r[0] || 2 === r[0])) {
a = 0;
continue;
}
if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
a.label = r[1];
break;
}
if (6 === r[0] && a.label < o[1]) {
a.label = o[1];
o = r;
break;
}
if (o && a.label < o[2]) {
a.label = o[2];
a.ops.push(r);
break;
}
o[2] && a.ops.pop();
a.trys.pop();
continue;
}
r = t.call(e, a);
} catch (e) {
r = [ 6, e ];
i = 0;
} finally {
n = o = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HsAdvUtils = void 0;
var r = e("../hsApp"), a = e("../module/dataReporter/DataReporter"), s = e("../module/native/HsNative"), c = e("./HSResourceUtils"), l = function() {
function e() {}
e.hideAdMask = function() {
var e, t = cc.director.getScene(), n = null == t ? void 0 : t.getChildByName("__AdMask__");
if (n) {
n.active = !1;
var i = cc.find("txt_Loading_EN", n);
i && (null === (e = i.getComponent(cc.Sprite)) || void 0 === e || e.unscheduleAllCallbacks());
}
};
e.showAdMask = function(e) {
void 0 === e && (e = !1);
return i(this, void 0, void 0, function() {
var t, n, i;
return o(this, function(o) {
switch (o.label) {
case 0:
if (!cc.sys.isNative && !e) return [ 3, 2 ];
t = cc.director.getScene();
if (!cc.isValid(t)) return [ 2 ];
n = t.getChildByName("__AdMask__");
if (cc.isValid(n)) {
n.active = !0;
this._showAdMaskNode(n);
return [ 2 ];
}
return [ 4, c.HSResourceUtils.loadPrefab(this.adMaskPrefab, this.adResBundle) ];

case 1:
i = o.sent();
this.createAdMaskNode(i);
o.label = 2;

case 2:
return [ 2 ];
}
});
});
};
e.createAdMaskNode = function(e) {
if (e) {
var t = cc.instantiate(e);
t.name = "__AdMask__";
t.zIndex = 999;
var n = cc.director.getScene();
if (cc.isValid(n) && cc.isValid(t)) {
n.addChild(t);
this._showAdMaskNode(t);
}
}
};
e._showAdMaskNode = function(e) {
if (cc.isValid(e)) {
var t = {}, n = function(n) {
e.getComponentsInChildren(cc.RenderComponent).forEach(function(e) {
t[e.node.uuid] || (t[e.node.uuid] = e.node.opacity);
e.node.opacity = n ? t[e.node.uuid] : 0;
});
};
n(!1);
var i = cc.find("txt_Loading_EN", e), o = cc.find("Txt_Conitnue_EN", e);
i.active = !0;
o.active = !1;
i.getComponent(cc.Sprite).unscheduleAllCallbacks();
i.getComponent(cc.Sprite).scheduleOnce(function() {
n(!0);
}, .9);
i.getComponent(cc.Sprite).scheduleOnce(function() {
i.active = !1;
o.active = !0;
a.HsDataReporter.reportEvent("ui_ad_mask_show");
}, 2);
o.on(cc.Node.EventType.TOUCH_END, function() {
e.active = !1;
if (window.gameAdCallback) {
window.gameAdCallback(0);
window.gameAdCallback = null;
}
});
}
};
e.addGameCallback = function(t, n, i) {
var o = t.type, r = o.startsWith("4") || "702" === o || "800" === o || "801" === o, a = o.startsWith("5") || "703" === o || "802" === o || "803" === o;
window.gameAdCallback = function(t) {
e.hideAdMask();
n && (i ? n.call(i, t) : n(t));
window.gameAdCallback = null;
if (cc.sys.OS_ANDROID === cc.sys.os) {
var o = cc.director.getScene();
o && cc.director.getScheduler().schedule(function() {
r ? s.HsNative.noticeLoad(0) : a && s.HsNative.noticeLoad(2);
}, o, 1, 0, 0, !1);
}
};
};
e.showAdv = function(t, n, i) {
var o = t.type, r = "3" === o, c = o.startsWith("4") || "702" === o || "800" === o || "801" === o, l = o.startsWith("5") || "703" === o || "802" === o || "803" === o;
if (cc.sys.isNative) {
if (s.HsNative.getVipState()) {
n && (i ? n.call(i, 1) : n(1));
return;
}
(c || l) && e.addGameCallback(t, n, i);
if (!r) {
c && e.isInterReady() && e.showAdMask(!0);
l && e.isRewardReady() && e.showAdMask(!0);
}
a.HsDataReporter.reportEvent("usr_data_ad_show", {
adType: o,
scene: "sand"
});
s.HsNative.nativeShowAdv(t);
return !0;
}
e.showMockAdDialog(n, i, t);
r || e.showAdMask(!0);
return !0;
};
e.isInterReady = function() {
var e = "";
if (cc.sys.os === cc.sys.OS_ANDROID) {
e = "interAd";
"15" === r.hsApp.GameType && (e = "inter");
} else e = (cc.sys.os, cc.sys.OS_IOS, "inter");
return s.HsNative.getAdReady(e);
};
e.isRewardReady = function() {
var e = "";
if (cc.sys.os === cc.sys.OS_ANDROID) {
e = "rewardAd";
"15" === r.hsApp.GameType && (e = "reward");
} else e = (cc.sys.os, cc.sys.OS_IOS, "reward");
return s.HsNative.getAdReady(e);
};
e.showMockAdDialog = function(t, n, r) {
return i(this, void 0, void 0, function() {
var i, a, s;
return o(this, function(o) {
switch (o.label) {
case 0:
i = "3" !== r.type;
a = i ? this.adTestPrefab : this.adBannerPrefab;
this.adType = i ? 1 : 2;
return [ 4, c.HSResourceUtils.loadPrefab(a, this.adResBundle) ];

case 1:
if (!(s = o.sent())) {
t && (n ? t.call(n, 0) : t(0));
return [ 2 ];
}
i ? e.createAdMockDialog(s, t, n, r) : e.createBannerMockDialog(s);
return [ 2 ];
}
});
});
};
e.createBannerMockDialog = function(e) {
var t = cc.director.getScene();
if (t) {
var n = t.getChildByName("__AdMask__banner__");
if (!n) {
(n = cc.instantiate(e)).zIndex = 999;
n.name = "__AdMask__banner__";
t.addChild(n);
}
cc.find("desc", n).getComponent(cc.Label).string = "banner" + Math.floor(1e3 * Math.random() + 1e4);
}
};
e.closeBannerMockDialog = function() {
var e = cc.director.getScene();
if (e) {
var t = e.getChildByName("__AdMask__banner__");
cc.isValid(t) && t.destroy();
}
};
e.createAdMockDialog = function(t, n, i, o) {
var r = cc.instantiate(t);
r.zIndex = 999;
var a = cc.director.getScene();
if (a) {
a.addChild(r);
var s = cc.find("btn", r), c = cc.find("btn2", r), l = cc.find("desc", r);
l && (l.getComponent(cc.Label).string = o.type);
s && s.on(cc.Node.EventType.TOUCH_END, function() {
e.hideAdMask();
r.destroy();
n && (i ? n.call(i, 1) : n(1));
});
c && c.on(cc.Node.EventType.TOUCH_END, function() {
e.hideAdMask();
r.destroy();
n && (i ? n.call(i, 0) : n(0));
});
} else n && (i ? n.call(i, 0) : n(0));
};
e.adType = 0;
e.adResBundle = "sandcrush";
e.adTestPrefab = "ad/adtest";
e.adBannerPrefab = "ad/bannertest";
e.adMaskPrefab = "ad/AdMask";
return e;
}();
n.HsAdvUtils = l;
cc._RF.pop();
}, {
"../hsApp": "hsApp",
"../module/dataReporter/DataReporter": "DataReporter",
"../module/native/HsNative": "HsNative",
"./HSResourceUtils": "HSResourceUtils"
} ],
"Block-android": [ function(e, t, n) {
"use strict";
cc._RF.push(t, "b4eee6CmLBAlLswzu01vmJ1", "Block-android");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
});
Object.defineProperty(n, "__esModule", {
value: !0
});
n.Block_android = void 0;
var r = e("../../../enviroment/bb_android"), a = e("../base-native"), s = "org/cocos2dx/javascript/AppActivity", c = [ 0, 75, 100, 150, 200, 255 ], l = function(e) {
o(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.callNativeCommonInfo = function(e) {
if (cc.sys.OS_ANDROID === cc.sys.os) return jsb.reflection.callStaticMethod(s, "callNativeCommonInfo", "(Ljava/lang/String;)V", JSON.stringify(e));
};
t.userCommentInfo = function(e) {
if (cc.sys.OS_ANDROID === cc.sys.os) return t.callNativeCommonInfo({
method: "userReview",
param: e
});
};
t.comment = function(e) {
void 0 === e && (e = 1);
cc.sys.OS_ANDROID === cc.sys.os && jsb.reflection.callStaticMethod(s, "callNativeComment", "(Ljava/lang/String;)V", "" + e);
};
t.reportData = function(e) {
if (cc.sys.OS_ANDROID === cc.sys.os) {
var t = JSON.stringify(e);
jsb.reflection.callStaticMethod(s, "callNativeDataUpload", "(Ljava/lang/String;)V", t);
}
};
t.noticeGameHide = function() {
return jsb.reflection.callStaticMethod(s, "callNativeHide", "()V");
};
t.closeNoSplash = function() {
return jsb.reflection.callStaticMethod(s, "callNativeHideLoading", "()V");
};
t.gameWay = function(e) {
return jsb.reflection.callStaticMethod(s, "userScheme", "(Ljava/lang/String;)V", "" + e);
};
t.getMaxEcpm = function(e) {
if (cc.sys.OS_ANDROID === cc.sys.os) {
var t = jsb.reflection.callStaticMethod(s, "callNativeGetMaxEcpm", "(Ljava/lang/String;)Ljava/lang/String;", e);
if (!t) return 0;
var n = JSON.parse(t);
if (n.max_ecpm) return parseFloat(n.max_ecpm);
}
return 0;
};
t.getDeviceInfo = function() {
var e = jsb.reflection.callStaticMethod(s, "callNativeInfo", "(Ljava/lang/String;)Ljava/lang/String;", "");
try {
return JSON.parse(e);
} catch (e) {
return null;
}
};
t.showMoreSetting = function() {
jsb.reflection.callStaticMethod(s, "callMoreSettings", "()V");
};
t.noticeLoad = function(e, t) {
void 0 === e && (e = 0);
void 0 === t && (t = !0);
if (cc.sys.isNative && cc.sys.OS_ANDROID === cc.sys.os) {
if (0 === (e = 1 === e ? 0 : e) && r.bb_android.ModelRemoveAd_getVipState()) return;
0 === e && r.bb_android.ClickDeviceModele_usr_data_ad_preload();
jsb.reflection.callStaticMethod(s, "showLoad", "(Ljava/lang/String;)V", JSON.stringify({
type: e
}));
}
};
t.getAdReady = function(e) {
return !cc.sys.isNative || cc.sys.OS_ANDROID !== cc.sys.os || jsb.reflection.callStaticMethod(s, "getReadyByAdType", "(Ljava/lang/String;)Z", e);
};
t.nativeShowAdv = function(e) {
if (!r.bb_android.ModelRemoveAd_getVipState()) {
window.sand.BBA_SandExtends_playAd && window.sand.BBA_SandExtends_playAd(function(e) {
if ("function" == typeof window.sandAdCallback) {
var t = {
result: 0
};
t.result = e;
window.sandAdCallback(JSON.stringify(t));
}
}, this, null == e ? void 0 : e.type);
jsb.reflection.callStaticMethod(s, "callNativeAd", "(Ljava/lang/String;)V", JSON.stringify(e));
}
};
t.closeBanner = function() {
cc.sys.isNative && cc.sys.OS_ANDROID === cc.sys.os && jsb.reflection.callStaticMethod(s, "hideBanner", "()V");
};
t.uploadUserData = function() {
cc.sys.isNative && (cc.sys.OS_ANDROID, cc.sys.os);
};
t.shakeOnce = function(e, t) {
e = c[e] || 255;
if (cc.sys.isNative && cc.sys.OS_ANDROID === cc.sys.os) {
if (null == e || null == t) return;
e = Math.max(e, 0);
var n = {
method: "vibrateRepeat26",
param: "{timings:[0," + t + ",0,0],amplitudes:[0," + (e = Math.min(e, 255)) + ",0,0]}"
};
this.callNativeCommonInfo(n);
}
};
t.shakeNew = function(e, t) {
this.shakeOnce(e, t);
};
t.initWindowFunc = function() {
window.sandAdCallback = function(e) {
var t = e;
"string" == typeof e && (t = JSON.parse(e));
var n = 1 == parseInt(t.result) ? 1 : 0;
if (window.gameAdCallback) {
window.gameAdCallback(n);
window.gameAdCallback = null;
}
};
};
t.cleanWindowFunc = function() {
window.sandAdCallback = null;
};
t.getVipState = function() {
return r.bb_android.ModelRemoveAd_getVipState();
};
return t;
}(a.HsBaseNative);
n.Block_android = l;
cc._RF.pop();
}, {
"../../../enviroment/bb_android": "bb_android",
"../base-native": "base-native"
} ],
"Block-ios": [ function(e, t, n) {
"use strict";
cc._RF.push(t, "db9b4KcQElH+pTYcwm/jkCz", "Block-ios");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
});
Object.defineProperty(n, "__esModule", {
value: !0
});
n.Block_ios = void 0;
var r = e("../../../enviroment/bb_ios"), a = e("../base-native"), s = "RootViewController", c = function(e) {
o(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.userCommentInfo = function(e) {
jsb.reflection.callStaticMethod("JSAndNative", "callNativeCommonInfo:", e);
};
t.comment = function(e) {
void 0 === e && (e = 1);
jsb.reflection.callStaticMethod(s, "callNativeComment:info:", "", e);
};
t.reportData = function(e) {
var t = JSON.stringify(e);
jsb.reflection.callStaticMethod(s, "callNativeDataUpload:", t);
};
t.uploadUserData = function(e) {
cc.sys.isNative && cc.sys.OS_IOS === cc.sys.os && jsb.reflection.callStaticMethod(s, "callNativeUserUpload:", JSON.stringify(e));
};
t.getDeviceInfo = function() {
var e = jsb.reflection.callStaticMethod("JSAndNative", "getClientInfo:", "");
try {
return JSON.parse(e);
} catch (e) {
return null;
}
};
t.getMaxEcpm = function(e) {
var t = jsb.reflection.callStaticMethod("JSAndNative", "callNativeGetMaxEcpm2:", e);
if (!t) return 0;
try {
var n = JSON.parse(t);
if (n.max_ecpm) return parseFloat(n.max_ecpm);
} catch (e) {
return 0;
}
};
t.showMoreSetting = function() {
jsb.reflection.callStaticMethod(s, "callMoreSettings:", "aa");
};
t.noticeLoad = function(e, t) {
void 0 === e && (e = 0);
void 0 === t && (t = !0);
var n = 0 === e || 1 === e;
if (!n || !r.bb_ios.ModelRemoveAd_getVipState()) {
n && r.bb_ios.ClickDeviceModele_usr_data_ad_preload();
jsb.reflection.callStaticMethod(s, "showLoad:", "" + JSON.stringify({
type: e
}));
}
};
t.getAdReady = function(e) {
return jsb.reflection.callStaticMethod(s, "getReadyByAdType:info:", "", e);
};
t.nativeShowAdv = function(e) {
var t = e.type, n = t.startsWith("5") || "703" == t;
r.bb_ios.ModelRemoveAd_getVipState() && !n || cc.sys.OS_IOS === cc.sys.os && jsb.reflection.callStaticMethod(s, "callNativeAd:info:", "", JSON.stringify(e));
};
t.closeBanner = function() {
cc.sys.isNative && cc.sys.OS_IOS === cc.sys.os && jsb.reflection.callStaticMethod(s, "hideBanner:", "aa");
};
t.shakeOnce = function(e) {
cc.sys.isNative && cc.sys.OS_IOS === cc.sys.os && jsb.reflection.callStaticMethod(s, "PlayHaptic:", "" + e);
};
t.shakeNew = function(e, t) {
this.shakeOnce(e, t);
};
t.noticeGameHide = function() {
return jsb.reflection.callStaticMethod(s, "callNativeHide:", "aa}");
};
t.closeNoSplash = function() {};
t.gameWay = function(e) {
return jsb.reflection.callStaticMethod(s, "userScheme:", "" + e);
};
t.initWindowFunc = function() {
window.sandAdCallback = function(e) {
var t = e;
try {
"string" == typeof e && (t = JSON.parse(e));
var n = 1 === parseInt(t.result) ? 1 : 0;
if (window.gameAdCallback) {
window.gameAdCallback(n);
window.gameAdCallback = null;
}
} catch (e) {}
};
};
t.cleanWindowFunc = function() {
window.sandAdCallback = null;
};
t.getVipState = function() {
return r.bb_ios.ModelRemoveAd_getVipState();
};
return t;
}(a.HsBaseNative);
n.Block_ios = c;
cc._RF.pop();
}, {
"../../../enviroment/bb_ios": "bb_ios",
"../base-native": "base-native"
} ],
CustomHorizontalLayout: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "c2f78SsB7hGo5v6/PTy2s5U", "CustomHorizontalLayout");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), r = this && this.__decorate || function(e, t, n, i) {
var o, r = arguments.length, a = r < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, i); else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (r < 3 ? o(a) : r > 3 ? o(t, n, a) : o(t, n)) || a);
return r > 3 && a && Object.defineProperty(t, n, a), a;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.createCustomHorizontalLayout = n.HSCustomHorizontalLayout = void 0;
var a = cc._decorator, s = a.ccclass, c = a.property, l = a.executeInEditMode, u = a.menu, d = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.paddingLeft = 0;
t.paddingRight = 0;
t.paddingTop = 0;
t.paddingBottom = 0;
t.spacingX = 0;
t.autoUpdate = !0;
t.showDebugBackground = !1;
t._isDirty = !0;
t._debugBackground = null;
return t;
}
t.prototype.onLoad = function() {
this.setupDebugBackground();
this.autoUpdate && this.scheduleOnce(this.updateLayout, 0);
};
t.prototype.onEnable = function() {
this.setupDebugBackground();
this.autoUpdate && this.scheduleOnce(this.updateLayout, 0);
};
t.prototype.updateLayout = function() {
if (this.node) {
this.updateDebugBackground();
var e = this.node.children.filter(function(e) {
return e.active;
});
if (0 !== e.length) {
var t = this.node.getContentSize();
if (e.length > 0) {
var n = e[0], i = n.getContentSize(), o = n.getAnchorPoint(), r = -t.width / 2 + this.paddingLeft + i.width * o.x;
n.setPosition(r, 0);
}
if (e.length > 1) for (var a = e.slice(1), s = t.width / 2 - this.paddingRight, c = a.length - 1; c >= 0; c--) {
var l = a[c], u = (i = l.getContentSize(), o = l.getAnchorPoint(), s - i.width * (1 - o.x));
l.setPosition(u, 0);
s -= i.width + this.spacingX;
}
this._isDirty = !1;
}
}
};
t.prototype.markAsDirty = function() {
if (!this._isDirty) {
this._isDirty = !0;
this.autoUpdate && this.scheduleOnce(this.updateLayout, 0);
}
};
t.prototype.lateUpdate = function() {
this.autoUpdate && this._isDirty && this.updateLayout();
};
t.prototype.onChildAdded = function() {
this.markAsDirty();
};
t.prototype.onChildRemoved = function() {
this.markAsDirty();
};
t.prototype.onSizeChanged = function() {
this.markAsDirty();
};
t.prototype.setupDebugBackground = function() {
if (this.showDebugBackground && !this._debugBackground) {
this._debugBackground = this.node.addComponent(cc.Sprite);
this._debugBackground.type = cc.Sprite.Type.SLICED;
this._debugBackground.sizeMode = cc.Sprite.SizeMode.CUSTOM;
var e = new cc.Texture2D(), t = new Uint8Array(4);
t[0] = 128;
t[1] = 128;
t[2] = 128;
t[3] = 100;
e.initWithData(t, cc.Texture2D.PixelFormat.RGBA8888, 1, 1);
var n = new cc.SpriteFrame(e);
this._debugBackground.spriteFrame = n;
this._debugBackground.node.setSiblingIndex(0);
} else if (!this.showDebugBackground && this._debugBackground) {
this._debugBackground.destroy();
this._debugBackground = null;
}
};
t.prototype.updateDebugBackground = function() {
this.setupDebugBackground();
this._debugBackground && (this._debugBackground.enabled = this.showDebugBackground);
};
r([ c({
tooltip: "左侧的内边距"
}) ], t.prototype, "paddingLeft", void 0);
r([ c({
tooltip: "右侧的内边距"
}) ], t.prototype, "paddingRight", void 0);
r([ c({
tooltip: "上方的内边距"
}) ], t.prototype, "paddingTop", void 0);
r([ c({
tooltip: "下方的内边距"
}) ], t.prototype, "paddingBottom", void 0);
r([ c({
tooltip: "右侧节点之间的间距"
}) ], t.prototype, "spacingX", void 0);
r([ c({
tooltip: "是否自动更新布局"
}) ], t.prototype, "autoUpdate", void 0);
r([ c({
tooltip: "是否显示调试背景（灰色背景用于定位调试）"
}) ], t.prototype, "showDebugBackground", void 0);
return r([ s, l, u("UI/HSCustomHorizontalLayout") ], t);
}(cc.Component);
n.HSCustomHorizontalLayout = d;
n.createCustomHorizontalLayout = function(e, t, n, i, o, r) {
void 0 === t && (t = 0);
void 0 === n && (n = 0);
void 0 === i && (i = 0);
void 0 === o && (o = 0);
void 0 === r && (r = 0);
var a = e.addComponent(d);
a.paddingLeft = t;
a.paddingRight = n;
a.paddingTop = o;
a.paddingBottom = r;
a.spacingX = i;
a.autoUpdate = !0;
return a;
};
cc._RF.pop();
}, {} ],
DataReporter: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "30a87e+AtFMPLooi70adgyH", "DataReporter");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HsDataReporter = void 0;
var i = e("../../hsApp"), o = e("../features/HSPlan"), r = e("../native/HsNative"), a = function() {
function e() {}
e.reportEvent = function(e, t) {
(t = t || {}).name = e;
this.extendData(t);
var n = [];
n.push(t);
r.HsNative.reportData(n);
};
e.reportMarketData = function(e, t) {
if ("sand_crush" === i.hsApp.RUNTIME_ENV) {
var n = t || {};
r.HsNative.reportMarketData(e, n);
}
};
e.extendData = function(e) {
e.time = Date.now();
e.abtestResult = o.default.ins.abTestResult;
e.sand_res_version = i.hsApp.resVersion;
};
return e;
}();
n.HsDataReporter = a;
cc._RF.pop();
}, {
"../../hsApp": "hsApp",
"../features/HSPlan": "HSPlan",
"../native/HsNative": "HsNative"
} ],
FTFeatNode: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "d66efewFb5Be5uR32VQxFGc", "FTFeatNode");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), r = this && this.__awaiter || function(e, t, n, i) {
return new (n || (n = Promise))(function(o, r) {
function a(e) {
try {
c(i.next(e));
} catch (e) {
r(e);
}
}
function s(e) {
try {
c(i.throw(e));
} catch (e) {
r(e);
}
}
function c(e) {
e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, s);
var t;
}
c((i = i.apply(e, t || [])).next());
});
}, a = this && this.__generator || function(e, t) {
var n, i, o, r, a = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
},
trys: [],
ops: []
};
return r = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function s(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(r) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 
0) : i.next) && !(o = o.call(i, r[1])).done) return o;
(i = 0, o) && (r = [ 2 & r[0], o.value ]);
switch (r[0]) {
case 0:
case 1:
o = r;
break;

case 4:
a.label++;
return {
value: r[1],
done: !1
};

case 5:
a.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(o = a.trys, o = o.length > 0 && o[o.length - 1]) && (6 === r[0] || 2 === r[0])) {
a = 0;
continue;
}
if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
a.label = r[1];
break;
}
if (6 === r[0] && a.label < o[1]) {
a.label = o[1];
o = r;
break;
}
if (o && a.label < o[2]) {
a.label = o[2];
a.ops.push(r);
break;
}
o[2] && a.ops.pop();
a.trys.pop();
continue;
}
r = t.call(e, a);
} catch (e) {
r = [ 6, e ];
i = 0;
} finally {
n = o = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.FTFeatNode = void 0;
var s = e("../module/features/Features"), c = e("./FTFunc"), l = function(e) {
o(t, e);
function t(t) {
var n = e.call(this) || this;
n.featureName = t;
return n;
}
t.prototype.run = function(e) {
return r(this, void 0, Promise, function() {
return a(this, function(t) {
switch (t.label) {
case 0:
t.trys.push([ 0, 2, , 3 ]);
return s.FeaturesMgr.boolFeature(this.featureName) ? [ 4, this.realRun(e) ] : [ 2, c.FeatResult.Failure ];

case 1:
t.sent();
return [ 2, c.FeatResult.Success ];

case 2:
t.sent();
return [ 2, c.FeatResult.Failure ];

case 3:
return [ 2 ];
}
});
});
};
t.prototype.realRun = function() {
return r(this, void 0, Promise, function() {
return a(this, function() {
return [ 2, c.FeatResult.Success ];
});
});
};
return t;
}(e("./FTNode").FTNode);
n.FTFeatNode = l;
cc._RF.pop();
}, {
"../module/features/Features": "Features",
"./FTFunc": "FTFunc",
"./FTNode": "FTNode"
} ],
FTForEach: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "fb21b4Bn0NO8LEw9KVAnp+q", "FTForEach");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), r = this && this.__awaiter || function(e, t, n, i) {
return new (n || (n = Promise))(function(o, r) {
function a(e) {
try {
c(i.next(e));
} catch (e) {
r(e);
}
}
function s(e) {
try {
c(i.throw(e));
} catch (e) {
r(e);
}
}
function c(e) {
e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, s);
var t;
}
c((i = i.apply(e, t || [])).next());
});
}, a = this && this.__generator || function(e, t) {
var n, i, o, r, a = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
},
trys: [],
ops: []
};
return r = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function s(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(r) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 
0) : i.next) && !(o = o.call(i, r[1])).done) return o;
(i = 0, o) && (r = [ 2 & r[0], o.value ]);
switch (r[0]) {
case 0:
case 1:
o = r;
break;

case 4:
a.label++;
return {
value: r[1],
done: !1
};

case 5:
a.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(o = a.trys, o = o.length > 0 && o[o.length - 1]) && (6 === r[0] || 2 === r[0])) {
a = 0;
continue;
}
if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
a.label = r[1];
break;
}
if (6 === r[0] && a.label < o[1]) {
a.label = o[1];
o = r;
break;
}
if (o && a.label < o[2]) {
a.label = o[2];
a.ops.push(r);
break;
}
o[2] && a.ops.pop();
a.trys.pop();
continue;
}
r = t.call(e, a);
} catch (e) {
r = [ 6, e ];
i = 0;
} finally {
n = o = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
}, s = this && this.__read || function(e, t) {
var n = "function" == typeof Symbol && e[Symbol.iterator];
if (!n) return e;
var i, o, r = n.call(e), a = [];
try {
for (;(void 0 === t || t-- > 0) && !(i = r.next()).done; ) a.push(i.value);
} catch (e) {
o = {
error: e
};
} finally {
try {
i && !i.done && (n = r.return) && n.call(r);
} finally {
if (o) throw o.error;
}
}
return a;
}, c = this && this.__spread || function() {
for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(s(arguments[t]));
return e;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.FTForEach = void 0;
var l = e("./FTFunc"), u = function(e) {
o(t, e);
function t(t) {
var n = e.call(this) || this;
n.nodes = t;
return n;
}
t.prototype.run = function(e) {
return r(this, void 0, Promise, function() {
var t;
return a(this, function(n) {
switch (n.label) {
case 0:
if (0 === this.nodes.length) return [ 2, l.FeatResult.Success ];
t = 0;
n.label = 1;

case 1:
if (!(t < this.nodes.length)) return [ 3, 6 ];
n.label = 2;

case 2:
n.trys.push([ 2, 4, , 5 ]);
return [ 4, this.nodes[t].run(e) ];

case 3:
case 4:
n.sent();
return [ 3, 5 ];

case 5:
t++;
return [ 3, 1 ];

case 6:
return [ 2, l.FeatResult.Success ];
}
});
});
};
t.prototype.addNode = function(e) {
this.nodes.push(e);
return this;
};
t.prototype.getNodes = function() {
return c(this.nodes);
};
return t;
}(e("./FTNode").FTNode);
n.FTForEach = u;
cc._RF.pop();
}, {
"./FTFunc": "FTFunc",
"./FTNode": "FTNode"
} ],
FTFunc: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "a6614GjhlZDO4vNxkZYYldD", "FTFunc");
var i = this && this.__awaiter || function(e, t, n, i) {
return new (n || (n = Promise))(function(o, r) {
function a(e) {
try {
c(i.next(e));
} catch (e) {
r(e);
}
}
function s(e) {
try {
c(i.throw(e));
} catch (e) {
r(e);
}
}
function c(e) {
e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, s);
var t;
}
c((i = i.apply(e, t || [])).next());
});
}, o = this && this.__generator || function(e, t) {
var n, i, o, r, a = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
},
trys: [],
ops: []
};
return r = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function s(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(r) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 
0) : i.next) && !(o = o.call(i, r[1])).done) return o;
(i = 0, o) && (r = [ 2 & r[0], o.value ]);
switch (r[0]) {
case 0:
case 1:
o = r;
break;

case 4:
a.label++;
return {
value: r[1],
done: !1
};

case 5:
a.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(o = a.trys, o = o.length > 0 && o[o.length - 1]) && (6 === r[0] || 2 === r[0])) {
a = 0;
continue;
}
if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
a.label = r[1];
break;
}
if (6 === r[0] && a.label < o[1]) {
a.label = o[1];
o = r;
break;
}
if (o && a.label < o[2]) {
a.label = o[2];
a.ops.push(r);
break;
}
o[2] && a.ops.pop();
a.trys.pop();
continue;
}
r = t.call(e, a);
} catch (e) {
r = [ 6, e ];
i = 0;
} finally {
n = o = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.FTFunc = n.FeatResult = void 0;
var r, a = e("../module/features/Features");
(function(e) {
e.Success = "success";
e.Failure = "failure";
e.Running = "running";
})(r = n.FeatResult || (n.FeatResult = {}));
var s = function() {
function e() {}
e.node = function(e) {
var t = this;
return function(n) {
return i(t, void 0, void 0, function() {
return o(this, function(t) {
switch (t.label) {
case 0:
t.trys.push([ 0, 2, , 3 ]);
return [ 4, e(n) ];

case 1:
return [ 2, t.sent() ];

case 2:
t.sent();
return [ 2, r.Failure ];

case 3:
return [ 2 ];
}
});
});
};
};
e.nodeFeat = function(e, t) {
var n = this;
return function(s) {
return i(n, void 0, void 0, function() {
return o(this, function(n) {
switch (n.label) {
case 0:
n.trys.push([ 0, 2, , 3 ]);
return i = e, a.FeaturesMgr.boolFeature(i) ? [ 4, t(s) ] : [ 2, r.Failure ];

case 1:
n.sent();
return [ 2, r.Success ];

case 2:
n.sent();
return [ 2, r.Failure ];

case 3:
return [ 2 ];
}
var i;
});
});
};
};
e.untilFalse = function(e) {
var t = this;
return function(n) {
return i(t, void 0, void 0, function() {
var t, i, a;
return o(this, function(o) {
switch (o.label) {
case 0:
if (0 === e.length) return [ 2, r.Success ];
t = 0;
o.label = 1;

case 1:
if (!(t < e.length)) return [ 3, 6 ];
o.label = 2;

case 2:
o.trys.push([ 2, 4, , 5 ]);
return [ 4, e[t](n) ];

case 3:
i = o.sent();
a = !0 === i || i === r.Success;
return i === r.Running ? [ 2, r.Running ] : a ? [ 3, 5 ] : [ 2, r.Failure ];

case 4:
o.sent();
return [ 2, r.Failure ];

case 5:
t++;
return [ 3, 1 ];

case 6:
return [ 2, r.Success ];
}
});
});
};
};
e.forEach = function(e) {
var t = this;
return function(n) {
return i(t, void 0, void 0, function() {
var t;
return o(this, function(i) {
switch (i.label) {
case 0:
if (0 === e.length) return [ 2, r.Success ];
t = 0;
i.label = 1;

case 1:
if (!(t < e.length)) return [ 3, 6 ];
i.label = 2;

case 2:
i.trys.push([ 2, 4, , 5 ]);
return [ 4, e[t](n) ];

case 3:
case 4:
i.sent();
return [ 3, 5 ];

case 5:
t++;
return [ 3, 1 ];

case 6:
return [ 2, r.Success ];
}
});
});
};
};
e.untilTrue = function(e) {
var t = this;
return function(n) {
return i(t, void 0, void 0, function() {
var t, i, a;
return o(this, function(o) {
switch (o.label) {
case 0:
if (0 === e.length) return [ 2, r.Failure ];
t = 0;
o.label = 1;

case 1:
if (!(t < e.length)) return [ 3, 6 ];
o.label = 2;

case 2:
o.trys.push([ 2, 4, , 5 ]);
return [ 4, e[t](n) ];

case 3:
i = o.sent();
a = !0 === i || i === r.Success;
return i === r.Running ? [ 2, r.Running ] : a ? [ 2, r.Success ] : [ 3, 5 ];

case 4:
o.sent();
return [ 3, 5 ];

case 5:
t++;
return [ 3, 1 ];

case 6:
return [ 2, r.Failure ];
}
});
});
};
};
return e;
}();
n.FTFunc = s;
cc._RF.pop();
}, {
"../module/features/Features": "Features"
} ],
FTGlobalTree: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "033137VoUNKp7bvrM/EGotO", "FTGlobalTree");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
});
Object.defineProperty(n, "__esModule", {
value: !0
});
n.FTGlobalTree = void 0;
var r = function(e) {
o(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
Object.defineProperty(t, "ins", {
get: function() {
this.instance || (this.instance = new t([]));
return this.instance;
},
enumerable: !1,
configurable: !0
});
t.registerNode = function(e) {
this.instance.addNode(e);
};
t.instance = null;
return t;
}(e("./FTForEach").FTForEach);
n.FTGlobalTree = r;
cc._RF.pop();
}, {
"./FTForEach": "FTForEach"
} ],
FTNode: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "a5e0fi4YlhBLZTqNMPARMi5", "FTNode");
var i = this && this.__awaiter || function(e, t, n, i) {
return new (n || (n = Promise))(function(o, r) {
function a(e) {
try {
c(i.next(e));
} catch (e) {
r(e);
}
}
function s(e) {
try {
c(i.throw(e));
} catch (e) {
r(e);
}
}
function c(e) {
e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, s);
var t;
}
c((i = i.apply(e, t || [])).next());
});
}, o = this && this.__generator || function(e, t) {
var n, i, o, r, a = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
},
trys: [],
ops: []
};
return r = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function s(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(r) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 
0) : i.next) && !(o = o.call(i, r[1])).done) return o;
(i = 0, o) && (r = [ 2 & r[0], o.value ]);
switch (r[0]) {
case 0:
case 1:
o = r;
break;

case 4:
a.label++;
return {
value: r[1],
done: !1
};

case 5:
a.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(o = a.trys, o = o.length > 0 && o[o.length - 1]) && (6 === r[0] || 2 === r[0])) {
a = 0;
continue;
}
if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
a.label = r[1];
break;
}
if (6 === r[0] && a.label < o[1]) {
a.label = o[1];
o = r;
break;
}
if (o && a.label < o[2]) {
a.label = o[2];
a.ops.push(r);
break;
}
o[2] && a.ops.pop();
a.trys.pop();
continue;
}
r = t.call(e, a);
} catch (e) {
r = [ 6, e ];
i = 0;
} finally {
n = o = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.FTNode = void 0;
var r = e("./FTFunc"), a = function() {
function e() {}
e.prototype.run = function() {
return i(this, void 0, Promise, function() {
return o(this, function() {
return [ 2, r.FeatResult.Success ];
});
});
};
e.prototype.update = function(e) {
return i(this, void 0, Promise, function() {
return o(this, function(t) {
switch (t.label) {
case 0:
return [ 4, this.run(e) ];

case 1:
return [ 2, t.sent() ];
}
});
});
};
e.prototype.normalizeResult = function(e) {
return !0 === e ? r.FeatResult.Success : !1 === e ? r.FeatResult.Failure : e;
};
e.prototype.isSuccess = function(e) {
return !0 === e || e === r.FeatResult.Success;
};
e.prototype.isRunning = function(e) {
return e === r.FeatResult.Running;
};
e.prototype.isFailure = function(e) {
return !1 === e || e === r.FeatResult.Failure;
};
return e;
}();
n.FTNode = a;
cc._RF.pop();
}, {
"./FTFunc": "FTFunc"
} ],
FTStatement: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "1a27eFFNeVKE60fe7QCaRZK", "FTStatement");
var i = this && this.__values || function(e) {
var t = "function" == typeof Symbol && Symbol.iterator, n = t && e[t], i = 0;
if (n) return n.call(e);
if (e && "number" == typeof e.length) return {
next: function() {
e && i >= e.length && (e = void 0);
return {
value: e && e[i++],
done: !e
};
}
};
throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.FTStatement = void 0;
var o = e("../module/features/Features"), r = function() {
function e() {
this.statements = [];
}
e.if = function(t, n) {
return new e().if(t, n);
};
e.prototype.if = function(e, t) {
this.statements.push({
key: e,
value: t
});
return this;
};
e.prototype.else = function(e) {
this.statements.push({
key: "else",
value: e
});
return this;
};
e.prototype.run = function() {
var e, t;
try {
for (var n = i(this.statements), r = n.next(); !r.done; r = n.next()) {
var a = r.value;
if ("else" === a.key) return a.value;
if ("string" == typeof a.key && o.FeaturesMgr.boolFeature(a.key)) return a.value;
if ("boolean" == typeof a.key && a.key) return a.value;
}
} catch (t) {
e = {
error: t
};
} finally {
try {
r && !r.done && (t = n.return) && t.call(n);
} finally {
if (e) throw e.error;
}
}
return null;
};
return e;
}();
n.FTStatement = r;
cc._RF.pop();
}, {
"../module/features/Features": "Features"
} ],
FTUntilFalse: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "51af80VauBBe5AVLpgZlq5X", "FTUntilFalse");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), r = this && this.__awaiter || function(e, t, n, i) {
return new (n || (n = Promise))(function(o, r) {
function a(e) {
try {
c(i.next(e));
} catch (e) {
r(e);
}
}
function s(e) {
try {
c(i.throw(e));
} catch (e) {
r(e);
}
}
function c(e) {
e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, s);
var t;
}
c((i = i.apply(e, t || [])).next());
});
}, a = this && this.__generator || function(e, t) {
var n, i, o, r, a = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
},
trys: [],
ops: []
};
return r = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function s(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(r) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 
0) : i.next) && !(o = o.call(i, r[1])).done) return o;
(i = 0, o) && (r = [ 2 & r[0], o.value ]);
switch (r[0]) {
case 0:
case 1:
o = r;
break;

case 4:
a.label++;
return {
value: r[1],
done: !1
};

case 5:
a.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(o = a.trys, o = o.length > 0 && o[o.length - 1]) && (6 === r[0] || 2 === r[0])) {
a = 0;
continue;
}
if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
a.label = r[1];
break;
}
if (6 === r[0] && a.label < o[1]) {
a.label = o[1];
o = r;
break;
}
if (o && a.label < o[2]) {
a.label = o[2];
a.ops.push(r);
break;
}
o[2] && a.ops.pop();
a.trys.pop();
continue;
}
r = t.call(e, a);
} catch (e) {
r = [ 6, e ];
i = 0;
} finally {
n = o = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
}, s = this && this.__read || function(e, t) {
var n = "function" == typeof Symbol && e[Symbol.iterator];
if (!n) return e;
var i, o, r = n.call(e), a = [];
try {
for (;(void 0 === t || t-- > 0) && !(i = r.next()).done; ) a.push(i.value);
} catch (e) {
o = {
error: e
};
} finally {
try {
i && !i.done && (n = r.return) && n.call(r);
} finally {
if (o) throw o.error;
}
}
return a;
}, c = this && this.__spread || function() {
for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(s(arguments[t]));
return e;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.FTUntilFalse = void 0;
var l = e("./FTFunc"), u = function(e) {
o(t, e);
function t(t) {
var n = e.call(this) || this;
n.nodes = t;
return n;
}
t.prototype.run = function(e) {
return r(this, void 0, Promise, function() {
var t, n, i;
return a(this, function(o) {
switch (o.label) {
case 0:
if (0 === this.nodes.length) return [ 2, l.FeatResult.Success ];
t = 0;
o.label = 1;

case 1:
if (!(t < this.nodes.length)) return [ 3, 6 ];
o.label = 2;

case 2:
o.trys.push([ 2, 4, , 5 ]);
return [ 4, this.nodes[t].run(e) ];

case 3:
n = o.sent();
i = this.isSuccess(n);
return this.isRunning(n) ? [ 2, l.FeatResult.Running ] : i ? [ 3, 5 ] : [ 2, l.FeatResult.Failure ];

case 4:
o.sent();
return [ 2, l.FeatResult.Failure ];

case 5:
t++;
return [ 3, 1 ];

case 6:
return [ 2, l.FeatResult.Success ];
}
});
});
};
t.prototype.addNode = function(e) {
this.nodes.push(e);
return this;
};
t.prototype.getNodes = function() {
return c(this.nodes);
};
return t;
}(e("./FTNode").FTNode);
n.FTUntilFalse = u;
cc._RF.pop();
}, {
"./FTFunc": "FTFunc",
"./FTNode": "FTNode"
} ],
FTUntilTrue: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "46488M7E6RAaa3y8gGNeBlK", "FTUntilTrue");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), r = this && this.__awaiter || function(e, t, n, i) {
return new (n || (n = Promise))(function(o, r) {
function a(e) {
try {
c(i.next(e));
} catch (e) {
r(e);
}
}
function s(e) {
try {
c(i.throw(e));
} catch (e) {
r(e);
}
}
function c(e) {
e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, s);
var t;
}
c((i = i.apply(e, t || [])).next());
});
}, a = this && this.__generator || function(e, t) {
var n, i, o, r, a = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
},
trys: [],
ops: []
};
return r = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function s(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(r) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 
0) : i.next) && !(o = o.call(i, r[1])).done) return o;
(i = 0, o) && (r = [ 2 & r[0], o.value ]);
switch (r[0]) {
case 0:
case 1:
o = r;
break;

case 4:
a.label++;
return {
value: r[1],
done: !1
};

case 5:
a.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(o = a.trys, o = o.length > 0 && o[o.length - 1]) && (6 === r[0] || 2 === r[0])) {
a = 0;
continue;
}
if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
a.label = r[1];
break;
}
if (6 === r[0] && a.label < o[1]) {
a.label = o[1];
o = r;
break;
}
if (o && a.label < o[2]) {
a.label = o[2];
a.ops.push(r);
break;
}
o[2] && a.ops.pop();
a.trys.pop();
continue;
}
r = t.call(e, a);
} catch (e) {
r = [ 6, e ];
i = 0;
} finally {
n = o = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
}, s = this && this.__read || function(e, t) {
var n = "function" == typeof Symbol && e[Symbol.iterator];
if (!n) return e;
var i, o, r = n.call(e), a = [];
try {
for (;(void 0 === t || t-- > 0) && !(i = r.next()).done; ) a.push(i.value);
} catch (e) {
o = {
error: e
};
} finally {
try {
i && !i.done && (n = r.return) && n.call(r);
} finally {
if (o) throw o.error;
}
}
return a;
}, c = this && this.__spread || function() {
for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(s(arguments[t]));
return e;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.FTUntilTrue = void 0;
var l = e("./FTFunc"), u = function(e) {
o(t, e);
function t(t) {
var n = e.call(this) || this;
n.nodes = t;
return n;
}
t.prototype.run = function(e) {
return r(this, void 0, Promise, function() {
var t, n, i;
return a(this, function(o) {
switch (o.label) {
case 0:
if (0 === this.nodes.length) return [ 2, l.FeatResult.Failure ];
t = 0;
o.label = 1;

case 1:
if (!(t < this.nodes.length)) return [ 3, 6 ];
o.label = 2;

case 2:
o.trys.push([ 2, 4, , 5 ]);
return [ 4, this.nodes[t].run(e) ];

case 3:
n = o.sent();
i = this.isSuccess(n);
return this.isRunning(n) ? [ 2, l.FeatResult.Running ] : i ? [ 2, l.FeatResult.Success ] : [ 3, 5 ];

case 4:
o.sent();
return [ 3, 5 ];

case 5:
t++;
return [ 3, 1 ];

case 6:
return [ 2, l.FeatResult.Failure ];
}
});
});
};
t.prototype.addNode = function(e) {
this.nodes.push(e);
return this;
};
t.prototype.getNodes = function() {
return c(this.nodes);
};
return t;
}(e("./FTNode").FTNode);
n.FTUntilTrue = u;
cc._RF.pop();
}, {
"./FTFunc": "FTFunc",
"./FTNode": "FTNode"
} ],
Features: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "58d130sXDFHSYqELnhXZnAV", "Features");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.FeaturesMgr = n.MAP_ID_TO_FEATURE = void 0;
var i = e("./dependices"), o = e("./HSPlan");
n.MAP_ID_TO_FEATURE = new Map();
var r = function() {
function e() {}
Object.defineProperty(e, "event", {
get: function() {
this._event || (this._event = new cc.EventTarget());
return this._event;
},
enumerable: !1,
configurable: !0
});
e.initServerPlan = function(e, t) {
var i = e.feature;
Object.keys(i).forEach(function(e) {
for (var t = i[e], o = 0; o < t.length; o++) n.MAP_ID_TO_FEATURE.set(t[o].id, e);
});
this.planConfig = {};
this.servfeatureConfig = new Map();
if (o.default.ins.features) {
var r = o.default.ins.features;
this.updateServfeatureConfig(r, t);
}
};
e.updateServfeatureConfig = function(e, t) {
this.servfeatureConfig = new Map();
if (e && Array.isArray(e)) {
for (var i = function(t) {
var i = e[t], r = n.MAP_ID_TO_FEATURE.get(i.id);
if (r) {
o.servfeatureConfig.get(r);
o.servfeatureConfig.set(r, {
open: !1
});
var a = o.servfeatureConfig.get(r);
a.open = !0;
Object.keys(i).forEach(function(e) {
"id" !== e && (a[e] = i[e]);
});
}
}, o = this, r = 0; r < e.length; r++) i(r);
this.appendCustomFeatures(t);
}
};
e.appendCustomFeatures = function(e) {
if (e) for (var t in e) {
var n = e[t];
this.servfeatureConfig.set(t, {
open: !0,
value: null == n ? void 0 : n.value
});
}
};
e.boolFeature = function(e) {
if (this.servfeatureConfig && this.servfeatureConfig.has(e)) {
var t = this.servfeatureConfig.get(e);
return !!t && t.open;
}
var n = !1;
this.planConfig && void 0 !== this.planConfig[e] && null !== this.planConfig[e] && (n = this.planConfig[e]);
return n;
};
e.intFeature = function(e) {
if (this.servfeatureConfig && this.servfeatureConfig.has(e)) {
var t = this.servfeatureConfig.get(e);
if (t) return t.value;
}
return this.planConfig && this.planConfig[e] ? this.planConfig[e] : 0;
};
e.objFeature = function(e) {
if (this.servfeatureConfig && this.servfeatureConfig.has(e)) {
var t = this.servfeatureConfig.get(e);
if (t) return t.value;
}
return this.planConfig && this.planConfig[e] ? this.planConfig[e] : null;
};
e.getFeatureVal = function() {};
e.checkDependiceFeatures = function(e) {
if (i.feature_dependices.hasDependency(e)) {
if (i.feature_dependices.hasCyclicDependency(e)) return !1;
var t = i.feature_dependices_config[e];
if (t) for (var n = 0; n < t.length; n++) if (!this.boolFeature(t[n])) return !1;
}
return !0;
};
e.planConfig = {};
e.servfeatureConfig = new Map();
e.planId = 0;
e._event = null;
return e;
}();
n.FeaturesMgr = r;
cc._RF.pop();
}, {
"./HSPlan": "HSPlan",
"./dependices": "dependices"
} ],
GMControlConfig: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "d0ca9ZL2z1KjaLHwsj6e92R", "GMControlConfig");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSGMControlType = void 0;
(function(e) {
e.Toggle = "toggle";
e.Slider = "slider";
e.Input = "input";
e.Dropdown = "dropdown";
e.DropdownCheckBox = "DropdownCheckBox";
e.Button = "button";
e.Info = "info";
})(n.HSGMControlType || (n.HSGMControlType = {}));
cc._RF.pop();
}, {} ],
GMControlFactory: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "57aa8zsobtOr74ssBPUXJjQ", "GMControlFactory");
Object.defineProperty(n, "__esModule", {
value: !0
});
var i = e("./GMControlConfig"), o = e("./CustomHorizontalLayout"), r = e("./GMControlUtil"), a = function() {
function e() {}
e.createControl = function(e, t) {
var n = null;
switch (t.type) {
case i.HSGMControlType.Toggle:
n = this.createToggle(t);
break;

case i.HSGMControlType.Slider:
n = this.createSlider(t);
break;

case i.HSGMControlType.Input:
n = this.createInput(t);
break;

case i.HSGMControlType.Dropdown:
return this.createDropdown(e, t);

case i.HSGMControlType.DropdownCheckBox:
return this.createDropdownCheckBox(e, t);

case i.HSGMControlType.Button:
n = this.createButton(t);
break;

case i.HSGMControlType.Info:
n = this.createInfoWithCustomLayout(t);
break;

default:
return null;
}
n && e.addChild(n);
};
e.createToggle = function(e) {
var t, n = this.newCustomHorizontalLayout("ToggleItem"), i = r.HSGMControlUtil.newLabelNode("title", e.label);
n.addChild(i);
var o = r.HSGMControlUtil.newCheckboxNode("checkmark", {
size: cc.size(60, 60),
isChecked: (null === (t = e.defaultValue) || void 0 === t ? void 0 : t.call(e)) || !1,
backgroundColor: new cc.Color(80, 80, 80),
checkmarkColor: new cc.Color(76, 175, 80),
onClick: function(t, n) {
e.onChange && e.onChange(n.isChecked, t);
}
});
n.addChild(o);
return n;
};
e.createSlider = function(e) {
var t, n = this.newCustomHorizontalLayout("SliderItem"), i = r.HSGMControlUtil.newLabelNode("title", e.label);
n.addChild(i);
var a = new cc.Node("slider");
a.setContentSize(220, 50);
n.addChild(a);
var s = r.HSGMControlUtil.newSpriteNode("background", {
r: 102,
g: 102,
b: 102,
size: cc.size(200, 10)
});
a.addChild(s);
var c = new cc.Node("handle");
c.setContentSize(40, 40);
var l = new cc.Node("handleVisual");
l.setContentSize(24, 24);
var u = l.addComponent(cc.Sprite);
u.type = cc.Sprite.Type.SIMPLE;
u.sizeMode = cc.Sprite.SizeMode.CUSTOM;
for (var d = new cc.Texture2D(), h = new Uint8Array(2304), p = 0; p < 2304; p += 4) {
h[p] = 0;
h[p + 1] = 0;
h[p + 2] = 0;
h[p + 3] = 0;
}
for (var f = function(e, t, n, i, o, r) {
if (e >= 0 && e < 24 && t >= 0 && t < 24) {
var a = 4 * (24 * t + e);
h[a] = n;
h[a + 1] = i;
h[a + 2] = o;
h[a + 3] = r;
}
}, _ = 0; _ < 24; _++) for (var g = 0; g < 24; g++) {
var v = g - 12, m = _ - 12, y = Math.sqrt(v * v + m * m);
y <= 10 ? y <= 6 ? f(g, _, 248, 248, 248, 255) : f(g, _, 255, 255, 255, 255) : y <= 11 && f(g, _, 204, 204, 204, 255);
}
d.initWithData(h, cc.Texture2D.PixelFormat.RGBA8888, 24, 24);
var b = new cc.SpriteFrame(d);
u.spriteFrame = b;
c.addChild(l);
a.addChild(c);
var S = c.addComponent(cc.Button);
S.target = l;
S.transition = cc.Button.Transition.SCALE;
S.zoomScale = 1.5;
var w = a.addComponent(cc.Slider);
w.handle = S;
w.direction = cc.Slider.Direction.Horizontal;
var C = (null === (t = e.defaultValue) || void 0 === t ? void 0 : t.call(e)) || e.minValue, R = (C - e.minValue) / (e.maxValue - e.minValue);
w.progress = Math.max(0, Math.min(1, R));
a.y = 8;
var M = r.HSGMControlUtil.newLabelNode("value", C.toString()), T = M.getComponent(cc.Label);
n.addChild(M);
var O = e.step || 1, k = function(t) {
var i = Math.round(t * (e.maxValue - e.minValue) + e.minValue);
if (t <= 0) {
e.onChange(e.minValue, n);
T.string = Math.round(e.minValue).toString();
} else if (t >= 1) {
e.onChange(e.maxValue, n);
T.string = Math.round(e.maxValue).toString();
} else {
var o = parseInt(T.string);
if (Math.abs(i - o) >= O) {
var r = Math.round((i - o) / O) * O + o;
e.onChange(r, n);
T.string = r.toString();
}
}
};
w.node.on("slide", function(e) {
var t;
k(e.progress);
null === (t = n.getComponent(o.HSCustomHorizontalLayout)) || void 0 === t || t.updateLayout();
});
c.on(cc.Node.EventType.TOUCH_START, function() {
n.parent.parent.parent.getComponent(cc.ScrollView).enabled = !1;
});
c.on(cc.Node.EventType.TOUCH_END, function() {
n.parent.parent.parent.getComponent(cc.ScrollView).enabled = !0;
});
c.on(cc.Node.EventType.TOUCH_CANCEL, function() {
n.parent.parent.parent.getComponent(cc.ScrollView).enabled = !0;
});
k(w.progress);
var P = new cc.Node("BlockLayer");
P.setContentSize(220, 50);
P.setPosition(0, 0);
P.addComponent(cc.BlockInputEvents);
return n;
};
e.createInput = function(e) {
var t, n = this.newCustomHorizontalLayout("InputItem"), i = r.HSGMControlUtil.newLabelNode("title", e.label);
n.addChild(i);
var o = null === (t = e.defaultValue) || void 0 === t ? void 0 : t.call(e), a = r.HSGMControlUtil.newInputNode("editbox", {
size: cc.size(380, 50),
backgroundColor: new cc.Color(240, 240, 240),
textColor: cc.Color.BLACK,
placeholderColor: cc.color(120, 120, 120, 255),
fontSize: 34,
placeholder: e.placeholder || "请输入...",
maxLength: 1e4,
initialValue: o,
onEditingReturn: function(t) {
e.onChange && o + "" !== t.string && e.onChange(t.string, n);
},
onEditingDidEnded: function(t) {
e.onChange && o + "" !== t.string && e.onChange(t.string, n);
}
});
n.addChild(a);
return n;
};
e.createButton = function(t) {
var n = new cc.Node("ButtonItem");
n.setContentSize(e.containerWidth - 30, 60);
var i = r.HSGMControlUtil.newButtonNode("button", {
buttonColor: new cc.Color(70, 130, 180),
label: t.label,
size: cc.size(e.containerWidth - 30, 60),
onClick: function() {
t.onClick && t.onClick(n);
}
});
n.addChild(i);
return n;
};
e.createDropdown = function(t, n) {
var i, o = this, a = this.newCustomHorizontalLayout("Dropdown");
t.addChild(a);
var s = new cc.Node("Options");
s.active = !1;
r.HSGMControlUtil.createVerticalLayout(s, 6, 0, cc.Layout.ResizeMode.CONTAINER);
var c = "function" == typeof n.options ? n.options() : n.options;
s.setContentSize(e.containerWidth, 42 * c.length);
t.addChild(s);
var l = r.HSGMControlUtil.newLabelNode("Label", n.label);
a.addChild(l);
var u = r.HSGMControlUtil.newButtonNode("DropdownButton", {
buttonColor: new cc.Color(240, 240, 240),
label: (null === (i = n.defaultValue) || void 0 === i ? void 0 : i.call(n)) || "请选择",
labelColor: cc.Color.BLACK,
size: cc.size(230, 50),
onClick: function() {
s.active = !s.active;
s.active && s.setSiblingIndex(a.getSiblingIndex() + 1);
}
}), d = u.getChildByName("ButtonLabel").getComponent(cc.Label);
a.addChild(u);
var h = u.convertToWorldSpaceAR(cc.v3(0, 0)), p = t.convertToNodeSpaceAR(cc.v2(h.x, h.y - 50));
s.x = p.x;
c.forEach(function(t) {
var i = o.newCustomHorizontalLayout("DropdownOption", {
size: cc.size(e.containerWidth, 55)
}), c = r.HSGMControlUtil.newLabelNode("OptionLabel", "", {
color: cc.Color.BLACK
});
i.addChild(c);
var l = r.HSGMControlUtil.newButtonNode("DropdownButton", {
buttonColor: new cc.Color(255, 240, 240),
label: t,
labelColor: cc.Color.BLACK,
size: cc.size(400, 50),
onClick: function() {
d.string = t;
s.active = !1;
n.onChange(t, a);
}
});
i.addChild(l);
s.addChild(i);
});
return a;
};
e.createDropdownCheckBox = function(t, n) {
var i = new cc.Node("DropdownCheckBox");
i.setContentSize(e.containerWidth - 30, 70);
t.addChild(i);
var a = r.HSGMControlUtil.newSpriteNode("Options", {
r: 45,
g: 45,
b: 45,
size: cc.size(e.containerWidth - 30, 900)
});
r.HSGMControlUtil.createVerticalLayout(a, 5, 5, cc.Layout.ResizeMode.CONTAINER);
a.active = n.expanded || !1;
t.addChild(a);
var s = r.HSGMControlUtil.newButtonNode("DropdownButton", {
buttonColor: new cc.Color(240, 240, 240),
label: n.label + "▼",
labelColor: cc.Color.BLACK,
size: cc.size(e.containerWidth - 30, 60),
onClick: function(e, o) {
try {
a.active = !a.active;
if (a.active) {
a.setSiblingIndex(i.getSiblingIndex() + 1);
var r = i.convertToWorldSpaceAR(cc.Vec2.ZERO), s = t.convertToNodeSpaceAR(r);
a.setPosition(s.x, s.y - 80);
o.string = n.label + "▲";
var c = a.getComponent(cc.ScrollView);
c && c.scrollToTop();
} else o.string = n.label + "▼";
} catch (e) {}
}
});
i.addChild(s);
var c = r.HSGMControlUtil.newSpriteNode("FilterContainer", {
r: 60,
g: 60,
b: 60,
size: cc.size(e.containerWidth - 50, 50)
}), l = r.HSGMControlUtil.newInputNode("FilterInput", {
size: cc.size(e.containerWidth - 80, 50),
textColor: cc.Color.WHITE,
placeholderColor: cc.color(180, 180, 180, 255),
fontSize: 32,
placeholder: "输入关键词过滤...",
maxLength: 500,
initialValue: ""
});
c.addChild(l);
a.addChild(c);
var u = this.createFilterButtonsContainer(n, e.containerWidth - 50);
if (u) {
u.x = -(e.containerWidth - 50) / 2;
a.addChild(u);
}
var d = new cc.Node("maskNode");
d.setContentSize(e.containerWidth - 50, 900);
a.addChild(d);
d.addComponent(cc.Mask);
var h = new cc.Node("Content");
r.HSGMControlUtil.createVerticalLayout(h, 5, 5, cc.Layout.ResizeMode.CONTAINER);
h.setContentSize(e.containerWidth - 50, 50 * n.options.size);
d.addChild(h);
var p = a.addComponent(cc.ScrollView);
p.horizontal = !1;
p.vertical = !0;
p.inertia = !0;
p.brake = .75;
p.elastic = !0;
p.bounceDuration = .23;
p.content = h;
var f = [];
n.options.forEach(function(t, a) {
var s;
try {
if (!t) return;
var c = r.HSGMControlUtil.newSpriteNode("Option", {
color: (null === (s = n.defaultItemBgColor) || void 0 === s ? void 0 : s.call(n, a)) || cc.color(60, 60, 60, 255),
size: cc.size(e.containerWidth - 50, 70)
});
o.createCustomHorizontalLayout(c, 10, 10);
var l = r.HSGMControlUtil.newLabelNode("OptionLabel", t.desc, {
fontSize: 30,
color: cc.Color.WHITE
});
c.addChild(l);
var u = function(e) {
try {
if (n.onItemChange) {
n.onItemChange(a, e.string, i);
var t = r.HSGMControlUtil.createSolidTexture(n.defaultItemBgColor(a)), o = new cc.SpriteFrame(t);
c.getComponent(cc.Sprite).spriteFrame = o;
}
} catch (e) {}
}, d = r.HSGMControlUtil.newInputNode("Input", {
size: cc.size(315, 60),
backgroundColor: new cc.Color(80, 80, 80),
textColor: cc.Color.WHITE,
placeholderColor: cc.color(180, 180, 180, 255),
fontSize: 32,
placeholder: "输入值...",
maxLength: 1e4,
initialValue: n.defaultItemValue(a),
onEditingReturn: u,
onEditingDidEnded: u
});
c.addChild(d);
var p = r.HSGMControlUtil.newCheckboxNode("Checkbox", {
size: cc.size(70, 70),
isChecked: n.defaultItemState(a),
backgroundColor: new cc.Color(80, 80, 80),
checkmarkColor: new cc.Color(76, 175, 80),
onClick: function(e, t) {
var s;
try {
n.onItemSelected && n.onItemSelected(a, t.isChecked, i);
d.active = t.isChecked;
var l = r.HSGMControlUtil.createSolidTexture(n.defaultItemBgColor(a)), u = new cc.SpriteFrame(l);
c.getComponent(cc.Sprite).spriteFrame = u;
d.getComponent(cc.EditBox).string = n.defaultItemValue(a);
null === (s = c.getComponent(o.HSCustomHorizontalLayout)) || void 0 === s || s.updateLayout();
} catch (e) {}
}
}), _ = p.getComponent(cc.Toggle);
d.active = _.isChecked;
c.addChild(p);
h.addChild(c);
f.push({
node: c,
key: a,
desc: (t.desc || a).toLowerCase()
});
} catch (e) {}
});
var _ = new Set(), g = l.getComponent(cc.EditBox), v = function(e) {
var t = e ? e.toLowerCase() : "", i = 0;
f.forEach(function(e) {
var o = !0;
"" !== t && (o = e.desc.includes(t) || e.key.toLowerCase().includes(t));
if (o && _.size > 0) {
var r = n.filterOptions || [];
o = Array.from(_).some(function(t) {
var n = r.find(function(e) {
return e.title === t;
});
return n && n.onFilter(e);
});
}
e.node.active = o;
o && i++;
});
h.setContentSize(560, Math.max(65 * i, 70));
null == p || p.scrollToTop();
};
u && (u.toggleFilter = function(e, t) {
t ? _.add(e) : _.delete(e);
v(g.string);
});
g.node.on("text-changed", function(e) {
v(e.string);
});
return i;
};
e.createFilterButtonsContainer = function(e, t) {
var n = this;
if (!e.filterOptions || 0 === e.filterOptions.length) return null;
var i = new cc.Node("FilterButtonsContainer");
i.setAnchorPoint(cc.v2(0, .5));
i.setContentSize(t, 70);
r.HSGMControlUtil.createHorizontalLayout(i, 8, 5, cc.Layout.ResizeMode.CONTAINER);
e.filterOptions.forEach(function(e) {
var t = n.createFilterButton(e.title, i);
i.addChild(t);
});
return i;
};
e.createFilterButton = function(e, t) {
var n = r.HSGMControlUtil.createSolidColorTexture(60, 150, 60), i = new cc.SpriteFrame(n), o = r.HSGMControlUtil.createSolidColorTexture(120, 120, 120), a = new cc.SpriteFrame(o), s = !1;
return r.HSGMControlUtil.newButtonNode("FilterButton_" + e, {
buttonColor: new cc.Color(120, 120, 120),
label: e,
fontSize: 25,
size: cc.size(120, 60),
onClick: function(n, o) {
try {
s = !s;
var r = n.getComponent(cc.Sprite);
if (s) {
r.spriteFrame = i;
o.node.color = cc.Color.WHITE;
} else {
r.spriteFrame = a;
o.node.color = cc.Color.WHITE;
}
var c = t.toggleFilter;
c && c(e, s);
} catch (e) {}
}
});
};
e.createInfoWithCustomLayout = function(e) {
var t = this.newCustomHorizontalLayout("InfoContainer");
r.HSGMControlUtil.newLabelNode("Label", e.label).parent = t;
e.defaultValue && (r.HSGMControlUtil.newLabelNode("Content", e.defaultValue()).parent = t);
return t;
};
e.newCustomHorizontalLayout = function(t, n) {
var i = new cc.Node(t);
i.setContentSize((null == n ? void 0 : n.size) || cc.size(e.containerWidth, 70));
o.createCustomHorizontalLayout(i, 15, 15);
return i;
};
e.containerWidth = 880;
return e;
}();
n.default = a;
cc._RF.pop();
}, {
"./CustomHorizontalLayout": "CustomHorizontalLayout",
"./GMControlConfig": "GMControlConfig",
"./GMControlUtil": "GMControlUtil"
} ],
GMControlUtil: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "cbc081CuitIxp22LUIg++JU", "GMControlUtil");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSGMControlUtil = void 0;
var i = function() {
function e() {}
e.newLabelNode = function(e, t, n) {
var i = new cc.Node(e), o = i.addComponent(cc.Label);
o.string = t;
o.fontSize = (null == n ? void 0 : n.fontSize) || 36;
o.verticalAlign = cc.Label.VerticalAlign.CENTER;
i.color = (null == n ? void 0 : n.color) || cc.Color.WHITE;
return i;
};
e.newButtonNode = function(e, t) {
var n = new cc.Node(e);
n.setContentSize((null == t ? void 0 : t.size) || cc.size(858, 50));
var i = n.addComponent(cc.Sprite);
i.type = cc.Sprite.Type.SLICED;
i.sizeMode = cc.Sprite.SizeMode.CUSTOM;
var o = this.createSolidTexture((null == t ? void 0 : t.buttonColor) || new cc.Color(240, 240, 240)), r = new cc.SpriteFrame(o);
i.spriteFrame = r;
var a = this.newLabelNode("ButtonLabel", (null == t ? void 0 : t.label) || "", {
color: (null == t ? void 0 : t.labelColor) || cc.Color.WHITE,
fontSize: (null == t ? void 0 : t.fontSize) || 32
}), s = a.getComponent(cc.Label);
n.addChild(a);
var c = n.addComponent(cc.Button);
c.target = n;
c.transition = cc.Button.Transition.SCALE;
c.zoomScale = .95;
c.duration = .1;
n.on(cc.Node.EventType.TOUCH_END, function() {
var e;
null === (e = null == t ? void 0 : t.onClick) || void 0 === e || e.call(t, n, s);
});
return n;
};
e.newSpriteNode = function(e, t) {
var n, i = new cc.Node(e), o = i.addComponent(cc.Sprite);
o.type = (null == t ? void 0 : t.type) || cc.Sprite.Type.SLICED;
o.sizeMode = (null == t ? void 0 : t.sizeMode) || cc.Sprite.SizeMode.CUSTOM;
if (null == t ? void 0 : t.color) n = this.createSolidTexture(t.color); else if (void 0 !== (null == t ? void 0 : t.r) || void 0 !== (null == t ? void 0 : t.g) || void 0 !== (null == t ? void 0 : t.b)) {
var r = t.r || 0, a = t.g || 0, s = t.b || 0, c = t.a || 255;
n = this.createSolidColorTexture(r, a, s, c);
} else n = this.createSolidColorTexture(128, 128, 128);
var l = new cc.SpriteFrame(n);
o.spriteFrame = l;
(null == t ? void 0 : t.size) && i.setContentSize(t.size);
return i;
};
e.createSolidTexture = function(e) {
return this.createSolidColorTexture(e.r, e.g, e.b, e.a);
};
e.createSolidColorTexture = function(e, t, n, i, o, r) {
void 0 === i && (i = 255);
void 0 === o && (o = 1);
void 0 === r && (r = 1);
for (var a = new cc.Texture2D(), s = new Uint8Array(o * r * 4), c = 0; c < o * r; c++) {
var l = 4 * c;
s[l] = e;
s[l + 1] = t;
s[l + 2] = n;
s[l + 3] = i;
}
a.initWithData(s, cc.Texture2D.PixelFormat.RGBA8888, o, r);
return a;
};
e.createFillParentWidget = function(e, t) {
void 0 === t && (t = 0);
var n = e.addComponent(cc.Widget);
n.isAlignLeft = !0;
n.isAlignRight = !0;
n.isAlignTop = !0;
n.isAlignBottom = !0;
n.left = t;
n.right = t;
n.top = t;
n.bottom = t;
n.updateAlignment();
return n;
};
e.createCenterWidget = function(e) {
var t = e.addComponent(cc.Widget);
t.isAlignHorizontalCenter = !0;
t.isAlignVerticalCenter = !0;
t.updateAlignment();
return t;
};
e.createVerticalLayout = function(e, t, n, i) {
void 0 === t && (t = 0);
void 0 === n && (n = 0);
void 0 === i && (i = cc.Layout.ResizeMode.NONE);
var o = e.addComponent(cc.Layout);
o.type = cc.Layout.Type.VERTICAL;
o.resizeMode = i;
o.spacingY = t;
o.verticalDirection = cc.Layout.VerticalDirection.TOP_TO_BOTTOM;
o.paddingTop = n;
o.paddingBottom = n;
return o;
};
e.createHorizontalLayout = function(e, t, n, i) {
void 0 === t && (t = 0);
void 0 === n && (n = 0);
void 0 === i && (i = cc.Layout.ResizeMode.NONE);
var o = e.addComponent(cc.Layout);
o.type = cc.Layout.Type.HORIZONTAL;
o.resizeMode = i;
o.spacingX = t;
o.horizontalDirection = cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
o.paddingLeft = n;
o.paddingRight = n;
return o;
};
e.createGridLayout = function(e, t, n, i, o) {
void 0 === t && (t = 2);
void 0 === n && (n = 2);
void 0 === i && (i = 5);
void 0 === o && (o = cc.Layout.ResizeMode.CONTAINER);
var r = e.addComponent(cc.Layout);
r.type = cc.Layout.Type.GRID;
r.resizeMode = o;
r.spacingX = t;
r.spacingY = n;
r.paddingTop = i;
r.paddingBottom = i;
r.paddingLeft = i;
r.paddingRight = i;
return r;
};
e.newCheckboxNode = function(e, t) {
var n = new cc.Node(e), i = (null == t ? void 0 : t.size) || cc.size(70, 70);
n.setContentSize(i);
var o = n.addComponent(cc.Sprite);
o.type = cc.Sprite.Type.SLICED;
o.sizeMode = cc.Sprite.SizeMode.CUSTOM;
var r = (null == t ? void 0 : t.backgroundColor) || new cc.Color(80, 80, 80), a = this.createSolidColorTexture(r.r, r.g, r.b), s = new cc.SpriteFrame(a);
o.spriteFrame = s;
var c = n.addComponent(cc.Toggle);
c.isChecked = (null == t ? void 0 : t.isChecked) || !1;
var l = new cc.Node("checkmark");
l.setContentSize(i);
var u = l.addComponent(cc.Sprite);
u.type = cc.Sprite.Type.SIMPLE;
u.sizeMode = cc.Sprite.SizeMode.CUSTOM;
try {
for (var d = new cc.Texture2D(), h = i.width, p = i.height, f = new Uint8Array(h * p * 4), _ = (null == t ? void 0 : t.checkmarkColor) || new cc.Color(76, 175, 80), g = 0; g < h * p; g++) {
var v = 4 * g;
f[v] = _.r;
f[v + 1] = _.g;
f[v + 2] = _.b;
f[v + 3] = 255;
}
for (var m = function(e, t) {
if (e >= 0 && e < h && t >= 0 && t < p) {
var n = 4 * (t * h + e);
f[n] = 255;
f[n + 1] = 255;
f[n + 2] = 255;
f[n + 3] = 255;
}
}, y = h / 50, b = 0; b <= 1; b += .1) {
var S = Math.round((15 + 7 * b) * y), w = Math.round((25 + 7 * b) * y);
m(S, w);
m(S + 1, w);
}
for (b = 0; b <= 1; b += .1) {
var C = Math.round((23 + 10 * b) * y), R = Math.round((32 - 14 * b) * y);
m(C, R);
m(C + 1, R);
}
d.initWithData(f, cc.Texture2D.PixelFormat.RGBA8888, h, p);
var M = new cc.SpriteFrame(d);
u.spriteFrame = M;
} catch (e) {}
l.active = c.isChecked;
n.addChild(l);
c.checkMark = u;
(null == t ? void 0 : t.onClick) ? n.on("toggle", function(e) {
l.active = e.isChecked;
t.onClick(n, e);
}) : n.on("toggle", function(e) {
l.active = e.isChecked;
});
return n;
};
e.newInputNode = function(e, t) {
var n = new cc.Node(e), i = (null == t ? void 0 : t.size) || cc.size(380, 40);
n.setContentSize(i);
if (null == t ? void 0 : t.backgroundColor) {
var o = n.addComponent(cc.Sprite);
o.type = cc.Sprite.Type.SLICED;
o.sizeMode = cc.Sprite.SizeMode.CUSTOM;
var r = this.createSolidColorTexture(t.backgroundColor.r, t.backgroundColor.g, t.backgroundColor.b), a = new cc.SpriteFrame(r);
o.spriteFrame = a;
}
var s = (null == t ? void 0 : t.textColor) || cc.Color.BLACK, c = (null == t ? void 0 : t.fontSize) || 24, l = this.newLabelNode("textLabel", "", {
fontSize: c,
color: s
}), u = l.getComponent(cc.Label);
u.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
u.verticalAlign = cc.Label.VerticalAlign.CENTER;
var d = (null == t ? void 0 : t.textLabelSize) || cc.size(i.width - 10, i.height - 10), h = (null == t ? void 0 : t.textLabelPosition) || cc.v2(-i.width / 2 + 5, i.height / 2 - 5);
l.setContentSize(d);
l.setAnchorPoint(0, .5);
l.setPosition(h);
n.addChild(l);
var p = (null == t ? void 0 : t.placeholderColor) || cc.color(120, 120, 120, 255), f = this.newLabelNode("placeholderLabel", "", {
fontSize: c,
color: p
}), _ = f.getComponent(cc.Label);
_.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
_.verticalAlign = cc.Label.VerticalAlign.CENTER;
var g = (null == t ? void 0 : t.placeholderLabelSize) || cc.size(i.width - 10, i.height - 10), v = (null == t ? void 0 : t.placeholderLabelPosition) || cc.v2(-i.width / 2 + 5, i.height / 2 - 5);
f.setContentSize(g);
f.setAnchorPoint(0, .5);
f.setPosition(v);
n.addChild(f);
var m = n.addComponent(cc.EditBox);
m.maxLength = (null == t ? void 0 : t.maxLength) || 1e4;
m.textLabel = u;
m.placeholderLabel = _;
m.placeholder = (null == t ? void 0 : t.placeholder) || "请输入...";
m.inputMode = (null == t ? void 0 : t.inputMode) || cc.EditBox.InputMode.SINGLE_LINE;
m.string = (null == t ? void 0 : t.initialValue) || "";
(null == t ? void 0 : t.onEditingReturn) && m.node.on("editing-return", function(e) {
t.onEditingReturn(e, n);
});
(null == t ? void 0 : t.onEditingDidEnded) && m.node.on("editing-did-ended", function(e) {
t.onEditingDidEnded(e, n);
});
return n;
};
return e;
}();
n.HSGMControlUtil = i;
cc._RF.pop();
}, {} ],
HSDataBase: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "131f9LB5RBHZbz/gu+vLnfu", "HSDataBase");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSStaticData = n.cacheData = n.HSDataBase = void 0;
var i = e("./HSTimeUtils"), o = function() {
function e() {
this.cacheKey = "data_base";
this.cacheData = {};
this.staticData = {};
this.constructed = {};
this.inited = !1;
this.lastProperty = "";
this.lastStaticProperty = "";
this.saveEnable = !0;
}
e.prototype.saveAll = function() {
if (this.saveEnable) {
i.HSTimeUtils.clearTimeout(this.cacheDataSave, this);
i.HSTimeUtils.clearTimeout(this.staticDataSave, this);
this.cacheDataSave();
this.staticDataSave();
}
};
e.prototype.cacheDataSave = function() {
if (this.saveEnable) {
var e = this.safeStringify(this.cacheData);
cc.sys.localStorage.setItem(this.cacheKey, e);
}
};
e.prototype.staticDataSave = function() {
if (this.saveEnable) {
var e = this.safeStringify(this.staticData);
cc.sys.localStorage.setItem(this.cacheKey + "Static", e);
}
};
e.prototype.initData = function() {
if (!this.inited) {
this.inited = !0;
var e = this.safeJSONParse(cc.sys.localStorage.getItem(this.cacheKey));
if (e) for (var t in e) null !== e[t] && void 0 !== e[t] && (this.cacheData[t] = e[t]);
var n = this.safeJSONParse(cc.sys.localStorage.getItem(this.cacheKey + "Static"));
if (n) for (var t in n) null !== n[t] && void 0 !== n[t] && (this.staticData[t] = n[t]);
}
};
e.prototype.safeJSONParse = function(e) {
try {
return JSON.parse(e, function(e, t) {
return "object" == typeof t && null !== t && "Map" === t.datatype ? new Map(JSON.parse(t.value)) : t;
});
} catch (e) {
return null;
}
};
e.prototype.safeStringify = function(e) {
var t = this;
return JSON.stringify(e, function(e, n) {
return n instanceof Map ? {
datatype: "Map",
value: t.mapToJSON(n)
} : n;
});
};
e.prototype.mapToJSON = function(e) {
return JSON.stringify(Array.from(e.entries()));
};
return e;
}();
n.HSDataBase = o;
function r(e, t, n) {
Object.defineProperty(t, n, {
get: function() {
this.initData();
return this[e][n];
},
set: function(t) {
if (this.constructed[n]) {
this.initData();
if (t !== this[e][n]) {
this[e][n] = t;
this.lastProperty = n;
i.HSTimeUtils.clearTimeout(this[e + "Save"], this);
i.HSTimeUtils.setTimeout(this[e + "Save"], this, 1);
}
} else {
this.constructed[n] = !0;
this[e][n] || (this[e][n] = t);
}
},
enumerable: !0,
configurable: !0
});
}
n.cacheData = function(e, t, n) {
void 0 === n && (n = 1);
r.call(this, "cacheData", e, t);
};
n.HSStaticData = function(e, t) {
r.call(this, "staticData", e, t);
};
cc._RF.pop();
}, {
"./HSTimeUtils": "HSTimeUtils"
} ],
HSDelegateComponent: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "387e7pXgLJMcpfVRLdkB+Ax", "HSDelegateComponent");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), r = this && this.__decorate || function(e, t, n, i) {
var o, r = arguments.length, a = r < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, i); else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (r < 3 ? o(a) : r > 3 ? o(t, n, a) : o(t, n)) || a);
return r > 3 && a && Object.defineProperty(t, n, a), a;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSDelegateComponent = void 0;
var a = cc._decorator.ccclass, s = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.viewParams = null;
return t;
}
t.prototype.callLoadFinished = function() {
var e;
(null === (e = this.viewParams.callbacks) || void 0 === e ? void 0 : e.onInited) && this.viewParams.callbacks.onInited(this.node, this.viewParams);
};
t.prototype.add = function() {
var e = this.viewParams;
"function" == typeof e.callbacks.onAdded && e.callbacks.onAdded(this.node, e.params);
this.applyComponentsFunction("onAdded", e.params);
};
t.prototype.remove = function(e) {
var t = this, n = this.viewParams;
if (n.valid) {
this.applyComponentsFunction("onBeforeRemove", n.params);
"function" == typeof n.callbacks.onBeforeRemove ? n.callbacks.onBeforeRemove(this.node, function() {
t.removed(n, e);
}) : this.removed(n, e);
}
};
t.prototype.removed = function(e, t) {
e.valid = !1;
if (t) {
this.node.removeFromParent();
this.node.destroy();
} else this.node.removeFromParent();
"function" == typeof e.callbacks.onRemoved && e.callbacks.onRemoved(this.node, e.params);
this.applyComponentsFunction("onRemoved", e.params);
};
t.prototype.onDestroy = function() {
this.viewParams = null;
};
t.prototype.applyComponentsFunction = function(e, t) {
for (var n = 0; n < this.node._components.length; n++) {
var i = this.node._components[n], o = i[e];
o && o.call(i, t);
}
};
return r([ a ], t);
}(cc.Component);
n.HSDelegateComponent = s;
cc._RF.pop();
}, {} ],
HSDynamicPlanConfig: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "c3cfaXewxhFg6rtQtU7oMSh", "HSDynamicPlanConfig");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.dynamicPlans = n.dynamicPlan = void 0;
n.dynamicPlan = null;
n.dynamicPlans = null;
cc._RF.pop();
}, {} ],
HSFeaturesCommon: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "9e30bkNqu5IvrxdM091Xdiw", "HSFeaturesCommon");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSMarkType = n.HSExperimentType = n.HSFlowLayerType = void 0;
(n.HSFlowLayerType || (n.HSFlowLayerType = {})).defaultLayer = "defaultLayer";
(function(e) {
e[e.New = 0] = "New";
e[e.Active = 1] = "Active";
})(n.HSExperimentType || (n.HSExperimentType = {}));
(function(e) {
e[e.Active = 1] = "Active";
e[e.New = 2] = "New";
})(n.HSMarkType || (n.HSMarkType = {}));
cc._RF.pop();
}, {} ],
HSHotUpdate: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "2005coDPRZEYqizVEPS4yt7", "HSHotUpdate");
var i = this && this.__awaiter || function(e, t, n, i) {
return new (n || (n = Promise))(function(o, r) {
function a(e) {
try {
c(i.next(e));
} catch (e) {
r(e);
}
}
function s(e) {
try {
c(i.throw(e));
} catch (e) {
r(e);
}
}
function c(e) {
e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, s);
var t;
}
c((i = i.apply(e, t || [])).next());
});
}, o = this && this.__generator || function(e, t) {
var n, i, o, r, a = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
},
trys: [],
ops: []
};
return r = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function s(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(r) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 
0) : i.next) && !(o = o.call(i, r[1])).done) return o;
(i = 0, o) && (r = [ 2 & r[0], o.value ]);
switch (r[0]) {
case 0:
case 1:
o = r;
break;

case 4:
a.label++;
return {
value: r[1],
done: !1
};

case 5:
a.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(o = a.trys, o = o.length > 0 && o[o.length - 1]) && (6 === r[0] || 2 === r[0])) {
a = 0;
continue;
}
if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
a.label = r[1];
break;
}
if (6 === r[0] && a.label < o[1]) {
a.label = o[1];
o = r;
break;
}
if (o && a.label < o[2]) {
a.label = o[2];
a.ops.push(r);
break;
}
o[2] && a.ops.pop();
a.trys.pop();
continue;
}
r = t.call(e, a);
} catch (e) {
r = [ 6, e ];
i = 0;
} finally {
n = o = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
};
this && this.__read;
this && this.__spread;
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSHotUpdate = n.UpdaterCompleteType = n.PackageType = void 0;
var r, a = e("../../utils/HSObjectUtils");
(function(e) {
e.Main = "package-main";
})(r = n.PackageType || (n.PackageType = {}));
(function(e) {
e[e.Newest = 0] = "Newest";
e[e.DownloadCompleted = 1] = "DownloadCompleted";
e[e.DownloadError = 2] = "DownloadError";
})(n.UpdaterCompleteType || (n.UpdaterCompleteType = {}));
var s = function() {
function e() {
this.isCanRetry = !1;
this.currentModule = null;
this.currentModuleVersion = null;
this.downloadList = null;
this.downloadIndex = 0;
this.WORKSPACE_MAIN = "hotupdate-main";
this.WORKSPACE_SUB = "hotupdate-sub";
this.WORKSPACE_MAIN_TEMP = "hotupdate-main-temp";
this.WORKSPACE_SUB_TEMP = "hotupdate-sub-temp";
}
e.prototype.download = function(e, t, n, i, o) {
this.logInitInfo("开始热更新初始化...");
this.logConfig("moduleName", e);
if (this.currentModule) this.logError("已有模块正在下载，跳过当前请求:", this.currentModule); else {
this.logInitInfo("重置下载状态...");
this.isDownloading = !1;
this.jsbAssetManager = null;
if (cc.sys.isNative) {
if (!this.jsbAssetManager) {
this.logInitInfo("初始化 AssetsManager...");
this.currentModule = e;
this.currentModuleVersion = null;
this.needUpdateCallback = n;
this.progressCallback = i;
this.compeleteCallback = o;
this.versionParsedCallback = t;
var r = this.getWorkspaceTemp(e);
this.getModuleManifestUrl();
this.jsbAssetManager = new jsb.AssetsManager("", r, this.compareVersion.bind(this));
this.jsbAssetManager.setVerifyCallback(this.setVerifyCallback.bind(this));
this.logInitInfo("AssetsManager 创建完成，开始检查下载...");
this.checkDownload();
}
} else {
n && n(!1);
i && i(this.currentModule, 1, 1);
o && o(null, null, null, null);
}
}
};
e.prototype.addSearchPaths = function() {
this.log("=== addSearchPaths 开始执行 ===");
var e = jsb.fileUtils.getSearchPaths();
this.log("当前搜索路径数量:", e.length);
this.log("当前搜索路径列表:", e.join(", "));
var t = this.getWorkspaceRoot(), n = this.getResWorkspaceRoot();
this.log("工作空间根路径:", t);
this.log("资源工作空间根路径:", n);
if (e.indexOf(t) < 0) {
this.log("添加工作空间根路径到搜索路径:", t);
e.unshift(t);
this.log("工作空间根路径添加成功");
} else this.log("工作空间根路径已存在于搜索路径中:", t);
if (e.indexOf(n) < 0) {
this.log("添加资源工作空间根路径到搜索路径:", n);
e.unshift(n);
this.log("资源工作空间根路径添加成功");
} else this.log("资源工作空间根路径已存在于搜索路径中:", n);
this.log("开始处理版本清单文件: assets/version.manifest");
var i = jsb.fileUtils.getStringFromFile("assets/version.manifest");
if (i) {
var o = a.HSObjectUtils.safeJSONParse(i);
if (o) if (this.currentModule === r.Main) {
var s = o.url1;
this.log("原始URL1:", s);
var c = s.replace(/^http:\/\/[^/]+/, "");
this.log("移除HTTP协议后的URL:", c);
if (s.indexOf("https://") >= 0) {
c = s.replace(/^https:\/\/[^/]+/, "");
this.log("检测到HTTPS协议，移除HTTPS协议后的URL:", c);
}
var l = c.indexOf(r.Main);
this.log("主包标识位置索引:", l);
c = c.substring(1, l);
this.log("处理后的URL路径:", c);
var u = "" + this.getWorkspaceRoot() + c;
this.log("构建的搜索路径:", u);
if (e.indexOf(u) < 0) {
this.log("添加版本相关搜索路径:", u);
e.unshift(u);
} else this.log("版本相关搜索路径已存在:", u);
} else this.log("当前模块不是主包，跳过URL路径处理", this.currentModule); else this.log("版本清单文件JSON解析失败");
} else this.log("版本清单文件不存在或读取失败");
var d = this.getWorkspaceAssetsPath();
e.indexOf(d) < 0 && e.unshift(d);
var h = JSON.stringify(e);
this.log("开始保存搜索路径到本地存储", e);
cc.sys.localStorage.setItem("HotSearchPaths", h);
this.log("开始设置文件系统搜索路径");
jsb.fileUtils.setSearchPaths(e);
this.log("=== addSearchPaths 执行完成 ===");
};
e.prototype.isModuleExist = function(e) {
if (!cc.sys.isNative) return !0;
var t = this.getWorkspace(e);
return jsb.fileUtils.isDirectoryExist(t);
};
e.prototype.isResExistInWritablePath = function(e) {
if (!cc.sys.isNative) return !1;
var t = this.getModuleRealName(e), n = this.getResWorkspaceRoot() + "assets/" + t, i = n + "/config.json";
return jsb.fileUtils.isDirectoryExist(n) && jsb.fileUtils.isFileExist(i);
};
e.prototype.getModuleVersion = function(e) {
this.logRuntime("获取模块版本:", e);
if (!cc.sys.isNative) {
this.logRuntime("非原生平台，返回默认版本 1.0.0");
return "1.0.0";
}
var t = this.getFilePath(e, "project");
this.logConfig("manifest path", t);
if (!jsb.fileUtils.isFileExist(t)) {
this.logRuntime("manifest 文件不存在，返回默认版本 1.0.0");
return "1.0.0";
}
try {
var n = jsb.fileUtils.getStringFromFile(t);
this.logConfig("manifest content", n);
var i = JSON.parse(n).version;
this.logConfig("parsed version", i);
this.logRuntime("成功获取模块版本:", i);
return i;
} catch (e) {
this.logError("解析 manifest 文件失败:", e);
return "1.0.0";
}
};
e.prototype.getMainVersion = function() {
this.logRuntime("获取主版本号...");
if (!cc.sys.isNative) {
this.logRuntime("非原生平台，返回默认主版本 1.0.0");
return "1.0.0";
}
var e = cc.sys.localStorage.getItem("NEWEST_VERSION");
this.logConfig("localStorage NEWEST_VERSION", e);
if (!e) {
this.logRuntime("localStorage 中没有版本信息，尝试从文件读取...");
e = jsb.fileUtils.getStringFromFile("assets/version.txt");
this.logConfig("version.txt content", e);
}
if (!e) {
this.logRuntime("未找到任何版本信息，使用默认版本 1.0.0");
e = "1.0.0";
}
this.logConfig("final main version", e);
this.logRuntime("主版本号获取完成:", e);
return e;
};
e.prototype.hasTask = function() {
return this.downloadList && this.downloadList.length > 0;
};
e.prototype.downloadMultiple = function(e, t, n, i, o, r) {
var a, s = this;
void 0 === r && (r = !1);
if (!e || e.length <= 0) this.log("modules return", !e, e.length); else if (this.downloadList && this.downloadList.length > 0 && !r) {
this.log("downloadList return", null === (a = this.downloadList) || void 0 === a ? void 0 : a.length);
e.forEach(function(e) {
s.downloadList.indexOf(e) < 0 && s.downloadList.push(e);
});
} else {
this.downloadList = [];
for (var c = 0; c < e.length; c++) {
var l = e[c];
this.downloadList.push(l);
}
this.batchDownload(function(e, n) {
t && t(e, n);
}, function() {
s.downloadIndex = 0;
s.downloadList = [];
n && n(s.downloadList[s.downloadIndex]);
}, i, o);
}
};
e.prototype.compareVersion = function(e, t) {
this.logRuntime("比较版本号...");
this.logConfig("versionA", e);
this.logConfig("versionB", t);
var n = e.split("."), i = t.split(".");
this.logConfig("vA 分段", n);
this.logConfig("vB 分段", i);
for (var o = 0; o < n.length; ++o) {
var r = parseInt(n[o]), a = parseInt(i[o]) || 0;
this.logConfig("比较第 " + o + " 段", r + " vs " + a);
if (r !== a) {
var s = r - a;
this.logRuntime("版本比较结果: " + s + " (" + (s > 0 ? "A > B" : "A < B") + ")");
return s;
}
}
if (i.length > n.length) {
this.logRuntime("版本 B 有更多分段，返回 -1 (A < B)");
return -1;
}
this.logRuntime("版本号相等，返回 0");
return 0;
};
e.prototype.setVerifyCallback = function(e) {
return jsb.fileUtils.isFileExist(e), !0;
};
e.prototype.getWorkspaceRoot = function() {
return "" + jsb.fileUtils.getWritablePath() + this.WORKSPACE_MAIN + "/";
};
e.prototype.getWorkspaceAssetsPath = function() {
return "" + jsb.fileUtils.getWritablePath() + this.WORKSPACE_MAIN + "/assets/";
};
e.prototype.log = function() {
for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
new Date().toISOString();
};
e.prototype.logInitInfo = function() {
for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
new Date().toISOString();
};
e.prototype.logRuntime = function() {
for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
new Date().toISOString();
};
e.prototype.logConfig = function() {
new Date().toISOString();
};
e.prototype.logError = function() {
for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
new Date().toISOString();
};
e.prototype.getResWorkspaceRoot = function() {
return "" + jsb.fileUtils.getWritablePath() + this.WORKSPACE_SUB + "/";
};
e.prototype.getWorkspace = function(e) {
return e === r.Main ? this.getWorkspaceRoot() + "assets" : this.getResWorkspaceRoot() + "assets/" + this.getModuleRealName(e);
};
e.prototype.getModuleRealName = function(e) {
if (e.indexOf("/") < 0) return e;
var t = e.split("/");
return t[t.length - 1];
};
e.prototype.getWorkspaceTemp = function(e) {
return e === r.Main ? "" + jsb.fileUtils.getWritablePath() + this.WORKSPACE_MAIN_TEMP : "" + jsb.fileUtils.getWritablePath() + this.WORKSPACE_SUB_TEMP;
};
e.prototype.getFilePath = function(e, t) {
e = this.getModuleRealName(e);
var n = "" + this.getWorkspace(e);
if (jsb.fileUtils.isDirectoryExist(n)) {
n = e === r.Main ? n + "/" + t + ".manifest" : n + "/" + e + "/" + t + ".manifest";
if (jsb.fileUtils.isFileExist(n)) return n;
}
return e === r.Main ? "assets/" + t + ".manifest" : "assets/" + e + "/" + t + ".manifest";
};
e.prototype.getModuleManifestUrl = function() {
return this.getFilePath(this.currentModule, "project");
};
e.prototype.makeDefaultManifest = function() {
return i(this, void 0, Promise, function() {
return o(this, function() {
return [ 2, "{}" ];
});
});
};
e.prototype.batchDownload = function(e, t, n, r) {
return i(this, void 0, void 0, function() {
var i, a = this;
return o(this, function() {
if (!(i = this.downloadList[this.downloadIndex])) {
this.downloadList = [];
this.downloadIndex = 0;
this.log("bundle return");
t && t(null);
return [ 2 ];
}
this.log("batchDownload start", i);
r && r(i);
this.download(i, null, null, function(t, n, i) {
e && e(n, i);
}, function(o, s, c, l) {
a.log("batchDownload callback:", i, a.downloadIndex, a.downloadList.length);
a.downloadIndex < a.downloadList.length && e && e(100, 100);
++a.downloadIndex;
n && n(o, s, c, l);
a.batchDownload(e, t, n, r);
});
return [ 2 ];
});
});
};
e.prototype.retry = function() {
if (!this.isDownloading && this.isCanRetry) {
this.isCanRetry = !1;
this.isDownloading = !0;
this.jsbAssetManager.downloadFailedAssets();
}
};
Object.defineProperty(e.prototype, "hotUpdateUrlDebug", {
get: function() {
return "true" === cc.sys.localStorage.getItem("__sand__hotUpdateUrlDebug");
},
enumerable: !1,
configurable: !0
});
e.prototype.checkDownload = function() {
return i(this, void 0, Promise, function() {
var e, t, n, i, r, s, c, l, u, d;
return o(this, function() {
this.logRuntime("开始检查下载状态...");
if (this.isDownloading) {
this.logRuntime("正在检查或更新中，跳过...");
return [ 2 ];
}
e = this.jsbAssetManager.getState();
this.logConfig("AssetsManager State", e);
if (e === jsb.AssetsManager.State.UNINITED) {
t = this.getModuleManifestUrl();
this.logRuntime("加载本地 manifest:", t, jsb.fileUtils.fullPathForFilename(t));
if (jsb.fileUtils.isFileExist(t)) {
n = jsb.fileUtils.getStringFromFile(t);
i = a.HSObjectUtils.safeJSONParse(n);
cc.sys.os, cc.sys.OS_ANDROID;
if (i) {
if (this.hotUpdateUrlDebug) {
r = "https://sc-ios.wondtycoon.com";
s = "http://192.168.74.188";
i.url1 = i.url1.replace(r, s);
i.url2 = i.url2.replace(r, s);
i.url3 = i.url3.replace(r, s);
}
c = new jsb.Manifest(a.HSObjectUtils.safeStringify(i), this.getWorkspace(this.currentModule));
this.jsbAssetManager.loadLocalManifest(c, this.getWorkspace(this.currentModule));
}
}
}
l = this.jsbAssetManager.getLocalManifest();
u = l && l.isLoaded();
d = null == l ? void 0 : l.getManifestFileUrl();
this.logConfig("localManifest exists", !!l);
this.logConfig("localManifest isLoaded", u);
this.logConfig("localManifest remoteUrl", d);
if (l && l.isLoaded()) {
this.logConfig("localManifest version", l.getVersion());
this.logConfig("localManifest searchPaths", l.getSearchPaths());
this.versionParsedCallback && this.versionParsedCallback(l.getVersion());
}
this.logRuntime("设置事件回调并开始检查更新...");
this.logRuntime("设置下载事件回调... this.checkDownloadCallback");
this.jsbAssetManager.setEventCallback(this.checkDownloadCallback.bind(this));
this.logRuntime("执行 checkUpdate...");
this.jsbAssetManager.checkUpdate();
this.isDownloading = !0;
this.logConfig("isDownloading", this.isDownloading);
return [ 2 ];
});
});
};
e.prototype.checkDownloadCallback = function(e) {
var t, n = e.getEventCode();
this.logRuntime("收到检查下载回调事件 Code ============ : " + n);
this.logConfig("event message", e.getMessage());
this.logConfig("event percent", e.getPercent());
var i = this.jsbAssetManager.getRemoteManifest(), o = this.jsbAssetManager.getLocalManifest();
if (i) {
this.logConfig("remoteManifest version", i.getVersion());
this.logConfig("remoteManifest isLoaded", i.isLoaded());
}
if (o) {
this.logConfig("localManifest version", o.getVersion());
this.logConfig("localManifest isLoaded", o.isLoaded());
}
switch (n) {
case jsb.EventAssetsManager.UPDATE_PROGRESSION:
this.logRuntime("更新进度", e.getPercent());
return;

case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
this.logError("没有找到本地 manifest 文件，跳过热更新");
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
this.logError("下载或解析 manifest 文件失败，跳过热更新");
this.logConfig("errorCode", n);
this.needUpdateCallback && this.needUpdateCallback(!1);
var r = this.currentModule;
this.freeDownloader();
this.compeleteCallback(r, "Fail to download manifest file, hot update skipped.", n, null);
return;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
this.logRuntime("已经是最新版本，无需更新");
r = this.currentModule;
this.freeDownloader();
this.needUpdateCallback && this.needUpdateCallback(!1);
this.compeleteCallback && this.compeleteCallback(r, null, null, null);
return;

case jsb.EventAssetsManager.NEW_VERSION_FOUND:
var a = null === (t = this.jsbAssetManager) || void 0 === t ? void 0 : t.getTotalBytes();
this.logRuntime("发现新版本！");
this.logConfig("totalBytes", a);
if (0 === a) {
this.logRuntime("更新大小为0，直接完成下载");
this.downloadEnded();
return;
}
this.logRuntime("需要下载更新，大小: " + a + " bytes");
this.isDownloading = !1;
this.currentModuleVersion = null == i ? void 0 : i.getVersion();
this.logConfig("currentModuleVersion", this.currentModuleVersion);
this.logRuntime("设置下载事件回调... null");
this.jsbAssetManager.setEventCallback(null);
this.needUpdateCallback && this.needUpdateCallback(!0);
this.startDownload();
return;

default:
this.logRuntime("未知事件代码:", n);
return;
}
this.logRuntime("检查下载回调处理完成");
this.isDownloading = !1;
this.logRuntime("设置下载事件回调... null");
this.jsbAssetManager.setEventCallback(null);
};
e.prototype.startDownload = function() {
this.logRuntime("开始下载流程...");
if (this.jsbAssetManager && !this.isDownloading) {
this.jsbAssetManager.setEventCallback(this.downloadCallback.bind(this));
var e = this.jsbAssetManager.getState();
this.logConfig("AssetsManager State", e);
if (e === jsb.AssetsManager.State.UNINITED) {
var t = this.getModuleManifestUrl();
this.logRuntime("AssetsManager 未初始化，加载本地 manifest:", t);
this.logConfig("manifest file exists", jsb.fileUtils.isFileExist(t));
this.jsbAssetManager.loadLocalManifest(t);
}
var n = this.jsbAssetManager.getRemoteManifest();
if (n) {
this.logConfig("remoteManifest version", n.getVersion());
this.logConfig("totalBytes to download", this.jsbAssetManager.getTotalBytes());
} else this.logError("remoteManifest is null");
this.logRuntime("开始执行下载更新...");
this.jsbAssetManager.update();
this.isDownloading = !0;
this.logConfig("下载状态已设置为", this.isDownloading);
} else {
this.jsbAssetManager || this.logError("AssetsManager 不存在，无法开始下载");
this.isDownloading && this.logError("已在下载中，跳过重复开始");
}
};
e.prototype.downloadCallback = function(e) {
var t = !1, n = !1, i = e.getEventCode(), o = null;
this.logRuntime("收到下载回调事件 Code: " + i);
this.logConfig("event message", e.getMessage());
switch (i) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
this.logError("下载过程中缺少本地 manifest");
n = !0;
break;

case jsb.EventAssetsManager.UPDATE_PROGRESSION:
var r = e.getDownloadedBytes(), a = e.getTotalBytes();
a > 0 && (r / a * 100).toFixed(2);
this.progressCallback && this.progressCallback(this.currentModule, r, a);
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
o = "Fail to download manifest file, hot update skipped.";
this.logError("下载或解析 manifest 文件失败:", o);
n = !0;
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
this.logRuntime("下载过程中发现已是最新版本");
n = !0;
break;

case jsb.EventAssetsManager.UPDATE_FINISHED:
this.logRuntime("更新完成! " + e.getMessage());
t = !0;
break;

case jsb.EventAssetsManager.UPDATE_FAILED:
o = "Update failed. " + e.getMessage();
this.logError("更新失败:", o);
this.logConfig("isCanRetry before", this.isCanRetry);
this.isDownloading = !1;
this.isCanRetry = !0;
this.logConfig("isCanRetry after", this.isCanRetry);
break;

case jsb.EventAssetsManager.ERROR_UPDATING:
var s = e.getCURLECode(), c = e.getAssetId();
o = "Asset update error: " + s + " " + c + ", " + e.getMessage();
this.logError("资源更新错误:", o);
this.logConfig("curlCode", s);
this.logConfig("assetId", c);
break;

case jsb.EventAssetsManager.ERROR_DECOMPRESS:
o = e.getMessage();
this.logError("解压缩错误:", o);
break;

default:
this.logRuntime("未知下载事件代码:", i);
}
this.logConfig("isCanRetry", this.isCanRetry);
this.logConfig("failed", n);
this.logConfig("isDownloadEned", t);
if (this.isCanRetry) {
this.logRuntime("可以重试，开始重试...");
this.retry();
} else {
if (n) {
this.logError("下载失败，释放下载器");
this.isDownloading = !1;
this.logRuntime("设置下载事件回调... null");
this.jsbAssetManager.setEventCallback(null);
var l = this.currentModule;
this.freeDownloader();
this.compeleteCallback && this.compeleteCallback(l, o, i, null);
}
if (t) {
this.logRuntime("下载结束，开始后处理...");
this.downloadEnded();
}
}
};
e.prototype.freeDownloader = function() {
if (this.jsbAssetManager) {
this.jsbAssetManager.setEventCallback(null);
this.jsbAssetManager = null;
delete this.jsbAssetManager;
}
this.currentModule = null;
this.isDownloading = !1;
};
e.prototype.downloadEnded = function() {
this.logRuntime("下载结束处理开始...");
var e = this.currentModule;
this.logRuntime("更新搜索路径...");
this.addSearchPaths();
if (e !== r.Main) {
this.logRuntime("非主包，需要复制文件到工作空间...");
this.copyFileToWorkspace();
} else this.logRuntime("主包下载完成，无需复制文件");
this.logRuntime("释放下载器...");
this.freeDownloader();
this.logRuntime("调用完成回调...");
this.compeleteCallback && this.compeleteCallback(e, null, null, this.currentModuleVersion);
this.logRuntime("下载结束处理完成");
};
e.prototype.copyFileToWorkspace = function() {
this.logRuntime("开始复制文件到工作空间...");
var e = this.getWorkspaceTemp(this.currentModule), t = this.getWorkspace(this.currentModule);
jsb.fileUtils.isDirectoryExist(t) || jsb.fileUtils.createDirectory(t);
if (jsb.fileUtils.isDirectoryExist(e)) {
var n = [], i = e.length;
jsb.fileUtils.listFilesRecursively(e, n);
jsb.fileUtils.isDirectoryExist(t) || jsb.fileUtils.createDirectory(t);
for (var o = 0; o < n.length; o++) {
var r = n[o], a = t + r.substr(i);
if ("/" === r[r.length - 1]) jsb.fileUtils.createDirectory(a); else {
jsb.fileUtils.isFileExist(a) && jsb.fileUtils.removeFile(a);
this.log("移动文件" + r + "到 " + a);
var s = jsb.fileUtils.writeDataToFile(jsb.fileUtils.getDataFromFile(r), a);
this.log("移动文件ret", s);
}
}
this.log("删除临时目录:", e);
jsb.fileUtils.removeDirectory(e);
} else this.logError("临时目录不存在，无法复制文件:", e);
};
return e;
}();
n.HSHotUpdate = s;
cc._RF.pop();
}, {
"../../utils/HSObjectUtils": "HSObjectUtils"
} ],
HSHttpUtils: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "d39f9Ly5IVEr67hG3qMQMDI", "HSHttpUtils");
var i = this && this.__assign || function() {
return (i = Object.assign || function(e) {
for (var t, n = 1, i = arguments.length; n < i; n++) {
t = arguments[n];
for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
}
return e;
}).apply(this, arguments);
}, o = this && this.__read || function(e, t) {
var n = "function" == typeof Symbol && e[Symbol.iterator];
if (!n) return e;
var i, o, r = n.call(e), a = [];
try {
for (;(void 0 === t || t-- > 0) && !(i = r.next()).done; ) a.push(i.value);
} catch (e) {
o = {
error: e
};
} finally {
try {
i && !i.done && (n = r.return) && n.call(r);
} finally {
if (o) throw o.error;
}
}
return a;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSHttpUtils = void 0;
var r = function() {
function e() {}
e.buildQueryString = function(e) {
if (!e || 0 === Object.keys(e).length) return "";
var t = new URLSearchParams();
Object.entries(e).forEach(function(e) {
var n = o(e, 2), i = n[0], r = n[1];
null != r && t.append(i, String(r));
});
return t.toString();
};
e.setHeaders = function(e, t) {
var n = i(i({}, this.defaultHeaders), t);
Object.entries(n).forEach(function(t) {
var n = o(t, 2), i = n[0], r = n[1];
e.setRequestHeader(i, r);
});
};
e.handleResponse = function(e) {
var t, n = e.status >= 200 && e.status < 300;
try {
t = e.responseText ? JSON.parse(e.responseText) : null;
} catch (n) {
t = e.responseText;
}
return {
success: n,
data: t,
status: e.status,
error: n ? void 0 : e.statusText || "Request failed"
};
};
e.log = function() {
this.enableLogging;
};
e.request = function(e, t, n, i) {
var o = this;
void 0 === i && (i = {});
return new Promise(function(r) {
var a = cc.loader.getXMLHttpRequest(), s = i.timeout || o.defaultTimeout, c = t, l = null;
if ("GET" === e && n) {
var u = o.buildQueryString(n);
u && (c += (t.includes("?") ? "&" : "?") + u);
} else n && (l = "string" == typeof n ? n : JSON.stringify(n));
o.log(e, c, "GET" !== e ? n : void 0);
a.open(e, c, !0);
o.setHeaders(a, i.headers || {});
a.timeout = s;
a.onreadystatechange = function() {
if (4 === a.readyState) {
var e = o.handleResponse(a);
e.success;
r(e);
} else r({
success: !1,
data: null,
status: a.status || 0,
error: a.statusText || "Network request failed"
});
};
a.onerror = function() {};
a.ontimeout = function() {
r({
success: !1,
data: null,
status: 0,
error: "Request timeout after " + s + "ms"
});
};
o.log(e, c, l);
a.send(l);
});
};
e.get = function(e, t, n) {
return this.request("GET", e, t, n);
};
e.post = function(e, t, n) {
return this.request("POST", e, t, n);
};
e.getWithCallback = function(e, t, n, i) {
void 0 === t && (t = {});
void 0 === i && (i = {});
this.get(e, t, {
headers: i
}).then(function(e) {
e.success ? n(e.data) : n(!1, e.error);
});
};
e.postWithCallback = function(e, t, n, i) {
void 0 === t && (t = {});
void 0 === i && (i = {});
this.post(e, t, {
headers: i
}).then(function(e) {
n(e.success, e.data, e.status);
});
};
e.setConfig = function(e) {
void 0 !== e.timeout && (this.defaultTimeout = e.timeout);
e.headers && (this.defaultHeaders = i(i({}, this.defaultHeaders), e.headers));
void 0 !== e.enableLogging && (this.enableLogging = e.enableLogging);
};
e.postJson = function(t, n, o) {
var r = i({
"Content-Type": "application/json"
}, null == o ? void 0 : o.headers);
return e.post(t, n, {
headers: r
});
};
e.defaultTimeout = 1e5;
e.defaultHeaders = {
"Content-Type": "application/json"
};
e.enableLogging = !0;
return e;
}();
n.HSHttpUtils = r;
n.default = r;
cc._RF.pop();
}, {} ],
HSIdeaManager: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "bc78fqXPsVH0a77SzcvCBBg", "HSIdeaManager");
var i = this && this.__values || function(e) {
var t = "function" == typeof Symbol && Symbol.iterator, n = t && e[t], i = 0;
if (n) return n.call(e);
if (e && "number" == typeof e.length) return {
next: function() {
e && i >= e.length && (e = void 0);
return {
value: e && e[i++],
done: !e
};
}
};
throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, o = this && this.__read || function(e, t) {
var n = "function" == typeof Symbol && e[Symbol.iterator];
if (!n) return e;
var i, o, r = n.call(e), a = [];
try {
for (;(void 0 === t || t-- > 0) && !(i = r.next()).done; ) a.push(i.value);
} catch (e) {
o = {
error: e
};
} finally {
try {
i && !i.done && (n = r.return) && n.call(r);
} finally {
if (o) throw o.error;
}
}
return a;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSIdeaManager = void 0;
var r = e("../features/Features"), a = function() {
function e() {
this.strategyFactories = new Map();
this.activeStrategies = new Map();
}
Object.defineProperty(e, "ins", {
get: function() {
this._instance || (this._instance = new e());
return this._instance;
},
enumerable: !1,
configurable: !0
});
e.prototype.registerStrategy = function(e, t) {
this.strategyFactories.set(e, t);
};
e.prototype.activateStrategy = function(e) {
if (!this.strategyFactories.has(e)) return !1;
if (this.activeStrategies.has(e)) return !0;
if (!r.FeaturesMgr.boolFeature(e)) return !1;
try {
var t = this.strategyFactories.get(e)();
t.init();
this.activeStrategies.set(e, t);
return !0;
} catch (e) {
return !1;
}
};
e.prototype.activateAllRegisteredStrategies = function() {
var e, t, n = [], a = [];
try {
for (var s = i(this.strategyFactories), c = s.next(); !c.done; c = s.next()) {
var l = o(c.value, 1)[0];
this.activeStrategies.has(l) ? n.push(l) : r.FeaturesMgr.boolFeature(l) && this.activateStrategy(l) ? n.push(l) : a.push(l);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
c && !c.done && (t = s.return) && t.call(s);
} finally {
if (e) throw e.error;
}
}
return {
activated: n,
skipped: a
};
};
e.prototype.deactivateStrategy = function(e) {
var t = this.activeStrategies.get(e);
if (!t) return !1;
try {
t.destroy && t.destroy();
this.activeStrategies.delete(e);
return !0;
} catch (e) {
return !1;
}
};
e.prototype.getActiveStrategy = function(e) {
return this.activeStrategies.get(e);
};
e.prototype.isStrategyActive = function(e) {
return this.activeStrategies.has(e);
};
e.prototype.getRegisteredFeatures = function() {
return Array.from(this.strategyFactories.keys());
};
e.prototype.getActiveFeatures = function() {
return Array.from(this.activeStrategies.keys());
};
e.prototype.deactivateAllStrategies = function() {
var e = this;
this.getActiveFeatures().forEach(function(t) {
e.deactivateStrategy(t);
});
this.strategyFactories.clear();
this.activeStrategies.clear();
};
e.prototype.getManagerStatus = function() {
return {
registeredCount: this.strategyFactories.size,
activeCount: this.activeStrategies.size,
registeredFeatures: this.getRegisteredFeatures(),
activeFeatures: this.getActiveFeatures()
};
};
return e;
}();
n.HSIdeaManager = a;
cc._RF.pop();
}, {
"../features/Features": "Features"
} ],
HSIdeaStrategy: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "6ffe7mbSZpIiIDdqsTeXEDy", "HSIdeaStrategy");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSBaseIdeaStrategy = void 0;
var i = function() {
function e() {
this.isInitialized = !1;
}
e.prototype.checkInitialized = function() {
return this.isInitialized;
};
e.prototype.markInitialized = function() {
this.isInitialized = !0;
};
e.prototype.destroy = function() {
this.isInitialized = !1;
};
return e;
}();
n.HSBaseIdeaStrategy = i;
cc._RF.pop();
}, {} ],
HSLayerBase: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "96b28tPSUNO2JvApg+tYSg/", "HSLayerBase");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), r = this && this.__values || function(e) {
var t = "function" == typeof Symbol && Symbol.iterator, n = t && e[t], i = 0;
if (n) return n.call(e);
if (e && "number" == typeof e.length) return {
next: function() {
e && i >= e.length && (e = void 0);
return {
value: e && e[i++],
done: !e
};
}
};
throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSLayerBase = void 0;
var a = e("./HSDelegateComponent"), s = e("./HSResManager"), c = e("./HSUIInterface"), l = function(e) {
o(t, e);
function t(t) {
var n = e.call(this, t) || this;
n.ui_nodes = new Map();
n.ui_cache = new Map();
var i = n.addComponent(cc.Widget);
i.isAlignLeft = !0;
i.isAlignRight = !0;
i.isAlignTop = !0;
i.isAlignBottom = !0;
i.left = 0;
i.right = 0;
i.top = 0;
i.bottom = 0;
i.alignMode = cc.Widget.AlignMode.ALWAYS;
i.enabled = !0;
return n;
}
t.prototype.getUuid = function(e) {
return (this.name + "_" + e).replace(/\//g, "_");
};
t.prototype.add = function(e, t, n) {
var i = e.prefab, o = this.getUuid(i), r = this.ui_nodes.get(o);
r && !cc.isValid(r.node) && (r.valid = !1);
if (r && r.valid) return "";
if (!r) {
(r = new c.HSViewParams()).uuid = o;
r.prefabPath = i;
r.config = e;
this.ui_nodes.set(r.uuid, r);
}
r.params = t || {};
r.callbacks = n || {};
r.valid = !0;
this.load(r, e.bundle);
return o;
};
t.prototype.load = function(e, t) {
var n = this, i = this.ui_nodes.get(e.uuid);
if (i && i.node) this.createNode(i); else {
t = t || "resources";
s.default.ins.load(e.prefabPath, t).then(function(t) {
if (t) if (e.valid) {
var i = cc.instantiate(t);
e.node = i;
i.addComponent(a.HSDelegateComponent).viewParams = e;
n.createNode(e);
} else n.ui_nodes.delete(e.uuid);
});
}
};
t.prototype.createNode = function(e) {
e.valid = !0;
var t = e.node, n = t.getComponent(a.HSDelegateComponent);
t.parent && t.removeFromParent();
if (cc.isValid(this)) {
this.addChild(t);
n.add();
return t;
}
};
t.prototype.remove = function(e) {
var t, n = this.getUuid(e), i = this.ui_nodes.get(n);
if (!i || i.node) for (var o = this.__nodes(), r = 0; r < o.length; r++) {
var a = o[r].viewParams;
if (a.prefabPath === e) {
var s = !(null === (t = a.config) || void 0 === t ? void 0 : t.cache);
if (s) {
this.removeCache(e);
a.node = null;
this.ui_nodes.delete(a.uuid);
} else this.ui_cache.set(a.prefabPath, a);
o[r].remove(s);
a.valid = !1;
}
} else i.valid = !1;
};
t.prototype.removeByUuid = function(e, t) {
var n = this.ui_nodes.get(e);
if (n) {
t && this.ui_nodes.delete(n.uuid);
n.node.getComponent(a.HSDelegateComponent).remove(t);
}
};
t.prototype.removeCache = function(e) {
var t = this.ui_cache.get(e);
if (t && !1 === t.valid) {
t.node.getComponent(a.HSDelegateComponent).remove(!0);
this.ui_nodes.delete(t.uuid);
this.ui_cache.delete(e);
}
};
t.prototype.getByUuid = function(e) {
var t, n, i = this.__nodes();
try {
for (var o = r(i), a = o.next(); !a.done; a = o.next()) {
var s = a.value;
if (s.viewParams && s.viewParams.uuid === e) return s.node;
}
} catch (e) {
t = {
error: e
};
} finally {
try {
a && !a.done && (n = o.return) && n.call(o);
} finally {
if (t) throw t.error;
}
}
return null;
};
t.prototype.get = function(e) {
var t, n, i = [], o = this.__nodes();
try {
for (var a = r(o), s = a.next(); !s.done; s = a.next()) {
var c = s.value;
c.viewParams.prefabPath === e && i.push(c.node);
}
} catch (e) {
t = {
error: e
};
} finally {
try {
s && !s.done && (n = a.return) && n.call(a);
} finally {
if (t) throw t.error;
}
}
return i;
};
t.prototype.has = function(e) {
var t, n, i = this.__nodes();
try {
for (var o = r(i), a = o.next(); !a.done; a = o.next()) {
var s = a.value;
if (s.viewParams.uuid === e || s.viewParams.prefabPath === e) return !0;
}
} catch (e) {
t = {
error: e
};
} finally {
try {
a && !a.done && (n = o.return) && n.call(o);
} finally {
if (t) throw t.error;
}
}
return !1;
};
t.prototype.find = function(e) {
var t, n, i = [], o = this.__nodes();
try {
for (var a = r(o), s = a.next(); !s.done; s = a.next()) {
var c = s.value;
e.test(c.viewParams.prefabPath) && i.push(c.node);
}
} catch (e) {
t = {
error: e
};
} finally {
try {
s && !s.done && (n = a.return) && n.call(a);
} finally {
if (t) throw t.error;
}
}
return i;
};
t.prototype.__nodes = function() {
var e = [], t = this.children;
if (!t) return e;
for (var n = 0; n < t.length; n++) {
var i = t[n].getComponent(a.HSDelegateComponent);
i && i.viewParams && i.viewParams.valid && cc.isValid(i) && e.push(i);
}
return e;
};
t.prototype.size = function() {
return this.children.length;
};
t.prototype.clearLayer = function(e) {
var t = this;
this.ui_nodes.forEach(function(n) {
t.removeByUuid(n.uuid, e);
n.valid = !1;
});
this.ui_nodes.clear();
e && this.ui_cache.forEach(function(e, n) {
t.removeCache(n);
});
};
t.prototype.clearCache = function(e) {
var t = e.prefab, n = this.getUuid(t);
this.ui_nodes.get(n) && this.ui_nodes.delete(n);
this.ui_cache.delete(t);
};
return t;
}(cc.Node);
n.HSLayerBase = l;
cc._RF.pop();
}, {
"./HSDelegateComponent": "HSDelegateComponent",
"./HSResManager": "HSResManager",
"./HSUIInterface": "HSUIInterface"
} ],
HSLayerDialog: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "0a5ddCCl2RC9LN/Bz74Tdyc", "HSLayerDialog");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
});
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSLayerDialog = void 0;
var r = e("./HSLayerPopUp"), a = e("./HSUIInterface"), s = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.queue = [];
t.queue_params = [];
return t;
}
t.prototype.add = function(e, t, n) {
var i = this, o = e.prefab, r = this.getUuid(o), s = this.ui_nodes.get(r);
if (!s) {
(s = new a.HSViewParams()).uuid = this.getUuid(o);
s.prefabPath = o;
s.callbacks = n || {};
s.config = e;
var c = s.callbacks.onRemoved;
s.callbacks.onRemoved = function(e, t) {
c && c(e, t);
cc.director.once(cc.Director.EVENT_AFTER_UPDATE, function() {
i.next();
}, i);
};
s.valid = !0;
this.ui_nodes.set(s.uuid, s);
}
s.node = null;
if (this.current && this.current.valid) {
if (this.current.prefabPath !== e.prefab) {
this.queue.push(s);
this.queue_params.push(t || {});
}
} else {
s.params = t || {};
this.current = s;
this.load(s, e.bundle);
}
return r;
};
t.prototype.setBlackDisable = function() {
0 === this.queue.length && (this.black.enabled = !1);
};
t.prototype.next = function() {
var e;
if (this.queue.length > 0) {
var t = this.queue.shift(), n = this.queue_params.shift();
if ((null == t ? void 0 : t.prefabPath) === (null === (e = this.current) || void 0 === e ? void 0 : e.prefabPath)) return;
this.current = t;
this.current.params = n;
this.current.node ? this.createNode(this.current) : this.load(this.current, this.current.config.bundle);
}
};
return t;
}(r.HSLayerPopUp);
n.HSLayerDialog = s;
cc._RF.pop();
}, {
"./HSLayerPopUp": "HSLayerPopUp",
"./HSUIInterface": "HSUIInterface"
} ],
HSLayerGameUI: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "f388bAlZgBOQI2dN/DaSwma", "HSLayerGameUI");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
});
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSLayerGameUI = void 0;
var r = e("./HSUIInterface"), a = function(e) {
o(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.add = function(e, t, n) {
var i;
if (e.prefab !== (null === (i = this.current) || void 0 === i ? void 0 : i.prefabPath)) {
var o = e.prefab, a = this.getUuid(o), s = this.ui_nodes.get(a);
if (!s) {
(s = new r.HSViewParams()).uuid = this.getUuid(o);
s.prefabPath = o;
s.callbacks = n || {};
s.config = e;
s.valid = !0;
this.ui_nodes.set(s.uuid, s);
}
if (!this.current || this.current.prefabPath !== o) {
this.current && this.current.valid && (s.callbacks.onInited = function() {});
s.params = t || {};
this.current = s;
this.load(s, e.bundle);
return a;
}
}
};
t.prototype.remove = function(t) {
this.current && this.current.prefabPath === t && (this.current = null);
e.prototype.remove.call(this, t);
};
t.prototype.clearCache = function(t) {
this.current = null;
e.prototype.clearCache.call(this, t);
};
return t;
}(e("./HSLayerPopUp").HSLayerPopUp);
n.HSLayerGameUI = a;
cc._RF.pop();
}, {
"./HSLayerPopUp": "HSLayerPopUp",
"./HSUIInterface": "HSUIInterface"
} ],
HSLayerNotify: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "01493hHch1LC7UICbfA6KqJ", "HSLayerNotify");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
});
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSLayerNotify = void 0;
var r = e("./HSLayerBase"), a = e("./HSUIInterface"), s = function(e) {
o(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.show = function(e, t) {
var n = new a.HSViewParams();
n.uuid = this.getUuid("common/prefab/notify");
n.prefabPath = "common/prefab/notify";
n.params = {
content: e,
useI18n: t
};
n.callbacks = {};
n.valid = !0;
this.ui_nodes.set(n.uuid, n);
this.load(n);
};
t.prototype.add = function(e, t, n) {
var i = e.prefab, o = this.getUuid(i), r = new a.HSViewParams();
r.uuid = o;
r.prefabPath = i;
r.config = e;
r.params = t || {};
r.callbacks = n || {};
r.valid = !0;
this.load(r, e.bundle);
return o;
};
return t;
}(r.HSLayerBase);
n.HSLayerNotify = s;
cc._RF.pop();
}, {
"./HSLayerBase": "HSLayerBase",
"./HSUIInterface": "HSUIInterface"
} ],
HSLayerPopUp: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "b7d03S24OJOCodFlxtoZpnD", "HSLayerPopUp");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), r = this && this.__awaiter || function(e, t, n, i) {
return new (n || (n = Promise))(function(o, r) {
function a(e) {
try {
c(i.next(e));
} catch (e) {
r(e);
}
}
function s(e) {
try {
c(i.throw(e));
} catch (e) {
r(e);
}
}
function c(e) {
e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, s);
var t;
}
c((i = i.apply(e, t || [])).next());
});
}, a = this && this.__generator || function(e, t) {
var n, i, o, r, a = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
},
trys: [],
ops: []
};
return r = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function s(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(r) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 
0) : i.next) && !(o = o.call(i, r[1])).done) return o;
(i = 0, o) && (r = [ 2 & r[0], o.value ]);
switch (r[0]) {
case 0:
case 1:
o = r;
break;

case 4:
a.label++;
return {
value: r[1],
done: !1
};

case 5:
a.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(o = a.trys, o = o.length > 0 && o[o.length - 1]) && (6 === r[0] || 2 === r[0])) {
a = 0;
continue;
}
if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
a.label = r[1];
break;
}
if (6 === r[0] && a.label < o[1]) {
a.label = o[1];
o = r;
break;
}
if (o && a.label < o[2]) {
a.label = o[2];
a.ops.push(r);
break;
}
o[2] && a.ops.pop();
a.trys.pop();
continue;
}
r = t.call(e, a);
} catch (e) {
r = [ 6, e ];
i = 0;
} finally {
n = o = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSLayerPopUp = void 0;
var s = function(e) {
o(t, e);
function t(t) {
var n = e.call(this, t) || this;
n.init();
return n;
}
t.prototype.init = function() {
this.black = this.addComponent(cc.BlockInputEvents);
this.black.enabled = !1;
};
t.prototype.add = function(t, n, i) {
var o = this, s = i.onAdded;
i.onAdded = function(e, n) {
return r(o, void 0, void 0, function() {
var o, r, c = this;
return a(this, function() {
null == s || s(e, n);
o = e.getChildByName("Popup_Background");
r = !1 !== (null == i ? void 0 : i.needBlackBg);
if (!o && r) {
o = this.createBackgroundLayer();
e.insertChild(o, 0);
if (null == i ? void 0 : i.touchClose) {
o.targetOff(o);
o.on(cc.Node.EventType.TOUCH_END, function() {
c.remove(t.prefab);
});
}
} else if (null == i ? void 0 : i.touchClose) {
o.targetOff(o);
o.on(cc.Node.EventType.TOUCH_END, function() {
c.remove(t.prefab);
});
}
return [ 2 ];
});
});
};
return e.prototype.add.call(this, t, n, i);
};
t.prototype.remove = function(t) {
e.prototype.remove.call(this, t);
this.setBlackDisable();
};
t.prototype.removeByUuid = function(t, n) {
e.prototype.removeByUuid.call(this, t, n);
this.setBlackDisable();
};
t.prototype.setBlackDisable = function() {
this.black.enabled = !1;
};
t.prototype.clearLayer = function(t) {
e.prototype.clearLayer.call(this, t);
this.black.enabled = !1;
this.active = !1;
};
t.prototype.createBackgroundLayer = function() {
var e = new cc.Node("Popup_Background");
e.setContentSize(cc.winSize);
e.addComponent(cc.BlockInputEvents);
var t = e.addComponent(cc.Sprite);
t.sizeMode = cc.Sprite.SizeMode.CUSTOM;
var n = new cc.Texture2D(), i = new cc.Color(0, 0, 0, 192), o = new Uint8Array([ i.r, i.g, i.b, i.a ]);
n.initWithData(o, cc.Texture2D.PixelFormat.RGBA8888, 1, 1);
t.spriteFrame = new cc.SpriteFrame(n);
t.node.width = cc.winSize.width;
t.node.height = 2 * cc.winSize.height;
return e;
};
return t;
}(e("./HSLayerBase").HSLayerBase);
n.HSLayerPopUp = s;
cc._RF.pop();
}, {
"./HSLayerBase": "HSLayerBase"
} ],
HSListItem: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "819973TGYpMr6QDJ3hrM+YZ", "HSListItem");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), r = this && this.__decorate || function(e, t, n, i) {
var o, r = arguments.length, a = r < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, i); else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (r < 3 ? o(a) : r > 3 ? o(t, n, a) : o(t, n)) || a);
return r > 3 && a && Object.defineProperty(t, n, a), a;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
var a, s = cc._decorator, c = s.ccclass, l = s.property, u = s.disallowMultiple, d = s.menu, h = s.executionOrder;
(function(e) {
e[e.NONE = 0] = "NONE";
e[e.TOGGLE = 1] = "TOGGLE";
e[e.SWITCH = 2] = "SWITCH";
})(a || (a = {}));
var p = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.icon = null;
t.title = null;
t.selectedMode = a.NONE;
t.selectedFlag = null;
t.selectedSpriteFrame = null;
t._unselectedSpriteFrame = null;
t.adaptiveSize = !1;
t._selected = !1;
t._eventReg = !1;
return t;
}
Object.defineProperty(t.prototype, "selected", {
get: function() {
return this._selected;
},
set: function(e) {
this._selected = e;
if (this.selectedFlag) switch (this.selectedMode) {
case a.TOGGLE:
this.selectedFlag.active = e;
break;

case a.SWITCH:
var t = this.selectedFlag.getComponent(cc.Sprite);
t && (t.spriteFrame = e ? this.selectedSpriteFrame : this._unselectedSpriteFrame);
}
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "btnCom", {
get: function() {
this._btnCom || (this._btnCom = this.node.getComponent(cc.Button));
return this._btnCom;
},
enumerable: !1,
configurable: !0
});
t.prototype.onLoad = function() {
if (this.selectedMode === a.SWITCH) {
var e = this.selectedFlag.getComponent(cc.Sprite);
this._unselectedSpriteFrame = e.spriteFrame;
}
};
t.prototype.onDestroy = function() {
if (this.node && this.node.isValid) {
this.node.stopAllActions();
this.node.off(cc.Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
}
this.list = null;
this.icon = null;
this.title = null;
this.selectedFlag = null;
this.selectedSpriteFrame = null;
this._unselectedSpriteFrame = null;
this._btnCom = null;
};
t.prototype._registerEvent = function() {
if (!this._eventReg) {
this.btnCom && this.list.selectedMode > 0 && this.btnCom.clickEvents.unshift(this.createEvt(this, "onClickThis"));
this.adaptiveSize && this.node.on(cc.Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
this._eventReg = !0;
}
};
t.prototype._onSizeChange = function() {
this.list._onItemAdaptive(this.node);
};
t.prototype.createEvt = function(e, t, n) {
void 0 === n && (n = null);
if (e.isValid) {
e.comName = e.comName || e.name.match(/\<(.*?)\>/g).pop().replace(/\<|>/g, "");
var i = new cc.Component.EventHandler();
i.target = n || e.node;
i.component = e.comName;
i.handler = t;
return i;
}
};
t.prototype.showAni = function(e, t, n) {
var i, o = this;
switch (e) {
case 0:
i = cc.tween(o.node).to(.2, {
scale: .7
}).by(.3, {
y: 2 * o.node.height
});
break;

case 1:
i = cc.tween(o.node).to(.2, {
scale: .7
}).by(.3, {
x: 2 * o.node.width
});
break;

case 2:
i = cc.tween(o.node).to(.2, {
scale: .7
}).by(.3, {
y: -2 * o.node.height
});
break;

case 3:
i = cc.tween(o.node).to(.2, {
scale: .7
}).by(.3, {
x: -2 * o.node.width
});
break;

default:
i = cc.tween(o.node).to(.3, {
scale: .1
});
}
(t || n) && i.call(function() {
if (o && o.node && o.node.isValid) {
if (n) {
o.list._delSingleItem(o.node);
for (var e = o.list.displayData.length - 1; e >= 0; e--) if (o.list.displayData[e].id === o.listId) {
o.list.displayData.splice(e, 1);
break;
}
}
t();
}
});
i.start();
};
t.prototype.onClickThis = function() {
this.list.selectedId = this.listId;
};
r([ l({
type: cc.Sprite,
tooltip: !1
}) ], t.prototype, "icon", void 0);
r([ l({
type: cc.Node,
tooltip: !1
}) ], t.prototype, "title", void 0);
r([ l({
type: cc.Enum(a),
tooltip: !1
}) ], t.prototype, "selectedMode", void 0);
r([ l({
type: cc.Node,
tooltip: !1,
visible: function() {
return this.selectedMode > a.NONE;
}
}) ], t.prototype, "selectedFlag", void 0);
r([ l({
type: cc.SpriteFrame,
tooltip: !1,
visible: function() {
return this.selectedMode === a.SWITCH;
}
}) ], t.prototype, "selectedSpriteFrame", void 0);
r([ l({
tooltip: !1
}) ], t.prototype, "adaptiveSize", void 0);
return r([ c, u(), d("自定义组件/List Item"), h(-5001) ], t);
}(cc.Component);
n.default = p;
cc._RF.pop();
}, {} ],
HSList: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "6f731tiPMdHlor+gnuVznph", "HSList");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), r = this && this.__decorate || function(e, t, n, i) {
var o, r = arguments.length, a = r < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, i); else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (r < 3 ? o(a) : r > 3 ? o(t, n, a) : o(t, n)) || a);
return r > 3 && a && Object.defineProperty(t, n, a), a;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
var a, s, c, l = cc._decorator, u = l.ccclass, d = l.property, h = l.disallowMultiple, p = l.menu, f = l.executionOrder, _ = l.requireComponent, g = e("./HSListItem");
(function(e) {
e[e.NODE = 1] = "NODE";
e[e.PREFAB = 2] = "PREFAB";
})(a || (a = {}));
(function(e) {
e[e.NORMAL = 1] = "NORMAL";
e[e.ADHERING = 2] = "ADHERING";
e[e.PAGE = 3] = "PAGE";
})(s || (s = {}));
(function(e) {
e[e.NONE = 0] = "NONE";
e[e.SINGLE = 1] = "SINGLE";
e[e.MULT = 2] = "MULT";
})(c || (c = {}));
var v = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.templateType = a.NODE;
t.tmpNode = null;
t.tmpPrefab = null;
t._slideMode = s.NORMAL;
t.pageDistance = .3;
t.pageChangeEvent = new cc.Component.EventHandler();
t._virtual = !0;
t.cyclic = !1;
t.lackCenter = !1;
t.lackSlide = !1;
t._updateRate = 0;
t.frameByFrameRenderNum = 0;
t.renderEvent = new cc.Component.EventHandler();
t.selectedMode = c.NONE;
t.repeatEventSingle = !1;
t.selectedEvent = new cc.Component.EventHandler();
t._selectedId = -1;
t._forceUpdate = !1;
t._updateDone = !0;
t._numItems = 0;
t._inited = !1;
t._needUpdateWidget = !1;
t._aniDelRuning = !1;
t._doneAfterUpdate = !1;
t.adhering = !1;
t._adheringBarrier = !1;
t.curPageNum = 0;
return t;
}
Object.defineProperty(t.prototype, "slideMode", {
get: function() {
return this._slideMode;
},
set: function(e) {
this._slideMode = e;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "virtual", {
get: function() {
return this._virtual;
},
set: function(e) {
null != e && (this._virtual = e);
0 != this._numItems && this._onScrolling();
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "updateRate", {
get: function() {
return this._updateRate;
},
set: function(e) {
e >= 0 && e <= 6 && (this._updateRate = e);
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "selectedId", {
get: function() {
return this._selectedId;
},
set: function(e) {
var t, n = this;
switch (n.selectedMode) {
case c.SINGLE:
if (!n.repeatEventSingle && e == n._selectedId) return;
t = n.getItemByListId(e);
var i = void 0;
n._selectedId >= 0 ? n._lastSelectedId = n._selectedId : n._lastSelectedId = null;
n._selectedId = e;
t && ((i = t.getComponent(g.default)).selected = !0);
if (n._lastSelectedId >= 0 && n._lastSelectedId != n._selectedId) {
var o = n.getItemByListId(n._lastSelectedId);
o && (o.getComponent(g.default).selected = !1);
}
n.selectedEvent && cc.Component.EventHandler.emitEvents([ n.selectedEvent ], t, e % this._actualNumItems, null == n._lastSelectedId ? null : n._lastSelectedId % this._actualNumItems);
break;

case c.MULT:
if (!(t = n.getItemByListId(e))) return;
i = t.getComponent(g.default);
n._selectedId >= 0 && (n._lastSelectedId = n._selectedId);
n._selectedId = e;
var r = !i.selected;
i.selected = r;
var a = n.multSelected.indexOf(e);
r && a < 0 ? n.multSelected.push(e) : !r && a >= 0 && n.multSelected.splice(a, 1);
n.selectedEvent && cc.Component.EventHandler.emitEvents([ n.selectedEvent ], t, e % this._actualNumItems, null == n._lastSelectedId ? null : n._lastSelectedId % this._actualNumItems, r);
}
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "numItems", {
get: function() {
return this._actualNumItems;
},
set: function(e) {
var t = this;
if (t.checkInited(!1)) if (null == e || e < 0) cc.error("numItems set the wrong::", e); else {
t._actualNumItems = t._numItems = e;
t._forceUpdate = !0;
if (t._virtual) {
t._resizeContent();
t.cyclic && (t._numItems = t._cyclicNum * t._numItems);
t._onScrolling();
t.frameByFrameRenderNum || t.slideMode != s.PAGE || (t.curPageNum = t.nearestListId);
} else {
if (t.cyclic) {
t._resizeContent();
t._numItems = t._cyclicNum * t._numItems;
}
var n = t.content.getComponent(cc.Layout);
n && (n.enabled = !0);
t._delRedundantItem();
t.firstListId = 0;
if (t.frameByFrameRenderNum > 0) {
for (var i = t.frameByFrameRenderNum > t._numItems ? t._numItems : t.frameByFrameRenderNum, o = 0; o < i; o++) t._createOrUpdateItem2(o);
if (t.frameByFrameRenderNum < t._numItems) {
t._updateCounter = t.frameByFrameRenderNum;
t._updateDone = !1;
}
} else {
for (o = 0; o < t._numItems; o++) t._createOrUpdateItem2(o);
t.displayItemNum = t._numItems;
}
}
}
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "scrollView", {
get: function() {
return this._scrollView;
},
enumerable: !1,
configurable: !0
});
t.prototype.onLoad = function() {
this._init();
};
t.prototype.onDestroy = function() {
var e = this;
e.node && e.node.isValid && e.node.stopAllActions();
e.content && e.content.isValid && e.content.children.forEach(function(e) {
e && e.isValid && e.stopAllActions();
});
if (e._scrollToSo) {
e._scrollToSo.stop && e._scrollToSo.stop();
e._scrollToSo = null;
}
e._unregisterEvent();
cc.isValid(e._itemTmp) && e._itemTmp.destroy();
cc.isValid(e.tmpNode) && e.tmpNode.destroy();
e._pool && e._pool.clear();
e.content = null;
e._scrollView = null;
e._layout = null;
e.displayData = null;
e._lastDisplayData = null;
e.multSelected = null;
e._aniDelCB = null;
e._aniDelItem = null;
e._scrollItem = null;
e.tmpPrefab = null;
e.pageChangeEvent = null;
e.renderEvent = null;
e.selectedEvent = null;
};
t.prototype.onEnable = function() {
this._registerEvent();
this._init();
if (this._aniDelRuning) {
this._aniDelRuning = !1;
if (this._aniDelItem) {
if (this._aniDelBeforePos) {
this._aniDelItem.position = this._aniDelBeforePos;
delete this._aniDelBeforePos;
}
if (this._aniDelBeforeScale) {
this._aniDelItem.scale = this._aniDelBeforeScale;
delete this._aniDelBeforeScale;
}
delete this._aniDelItem;
}
if (this._aniDelCB) {
this._aniDelCB();
delete this._aniDelCB;
}
}
};
t.prototype.onDisable = function() {
this._unregisterEvent();
};
t.prototype._registerEvent = function() {
var e = this;
e.node.on(cc.Node.EventType.TOUCH_START, e._onTouchStart, e, !0);
e.node.on("touch-up", e._onTouchUp, e);
e.node.on(cc.Node.EventType.TOUCH_CANCEL, e._onTouchCancelled, e, !0);
e.node.on("scroll-began", e._onScrollBegan, e, !0);
e.node.on("scroll-ended", e._onScrollEnded, e, !0);
e.node.on("scrolling", e._onScrolling, e, !0);
e.node.on(cc.Node.EventType.SIZE_CHANGED, e._onSizeChanged, e);
};
t.prototype._unregisterEvent = function() {
var e = this;
e.node.off(cc.Node.EventType.TOUCH_START, e._onTouchStart, e, !0);
e.node.off("touch-up", e._onTouchUp, e);
e.node.off(cc.Node.EventType.TOUCH_CANCEL, e._onTouchCancelled, e, !0);
e.node.off("scroll-began", e._onScrollBegan, e, !0);
e.node.off("scroll-ended", e._onScrollEnded, e, !0);
e.node.off("scrolling", e._onScrolling, e, !0);
e.node.off(cc.Node.EventType.SIZE_CHANGED, e._onSizeChanged, e);
};
t.prototype._init = function() {
var e = this;
if (!e._inited) {
e._scrollView = e.node.getComponent(cc.ScrollView);
e.content = e._scrollView.content;
if (e.content) {
e._layout = e.content.getComponent(cc.Layout);
e._align = e._layout.type;
e._resizeMode = e._layout.resizeMode;
e._startAxis = e._layout.startAxis;
e._topGap = e._layout.paddingTop;
e._rightGap = e._layout.paddingRight;
e._bottomGap = e._layout.paddingBottom;
e._leftGap = e._layout.paddingLeft;
e._columnGap = e._layout.spacingX;
e._lineGap = e._layout.spacingY;
e._colLineNum;
e._verticalDir = e._layout.verticalDirection;
e._horizontalDir = e._layout.horizontalDirection;
e.setTemplateItem(cc.instantiate(e.templateType === a.PREFAB ? e.tmpPrefab : e.tmpNode));
if (e._slideMode === s.ADHERING || e._slideMode === s.PAGE) {
e._scrollView.inertia = !1;
e._scrollView._onMouseWheel = function() {};
}
e.virtual || (e.lackCenter = !1);
e._lastDisplayData = [];
e.displayData = [];
e._pool = new cc.NodePool();
e._forceUpdate = !1;
e._updateCounter = 0;
e._updateDone = !0;
e.curPageNum = 0;
if (e.cyclic) {
e._scrollView._processAutoScrolling = this._processAutoScrolling.bind(e);
e._scrollView._startBounceBackIfNeeded = function() {
return !1;
};
}
switch (e._align) {
case cc.Layout.Type.HORIZONTAL:
switch (e._horizontalDir) {
case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
e._alignCalcType = 1;
break;

case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
e._alignCalcType = 2;
}
break;

case cc.Layout.Type.VERTICAL:
switch (e._verticalDir) {
case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
e._alignCalcType = 3;
break;

case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
e._alignCalcType = 4;
}
break;

case cc.Layout.Type.GRID:
switch (e._startAxis) {
case cc.Layout.AxisDirection.HORIZONTAL:
switch (e._verticalDir) {
case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
e._alignCalcType = 3;
break;

case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
e._alignCalcType = 4;
}
break;

case cc.Layout.AxisDirection.VERTICAL:
switch (e._horizontalDir) {
case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
e._alignCalcType = 1;
break;

case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
e._alignCalcType = 2;
}
}
}
e.content.removeAllChildren();
e._inited = !0;
} else cc.error(e.node.name + "'s cc.ScrollView unset content!");
}
};
t.prototype._processAutoScrolling = function(e) {
this._scrollView._autoScrollAccumulatedTime += 1 * e;
var t = Math.min(1, this._scrollView._autoScrollAccumulatedTime / this._scrollView._autoScrollTotalTime);
if (this._scrollView._autoScrollAttenuate) {
var n = t - 1;
t = n * n * n * n * n + 1;
}
var i = this._scrollView._autoScrollStartPosition.add(this._scrollView._autoScrollTargetDelta.mul(t)), o = this._scrollView.getScrollEndedEventTiming(), r = Math.abs(t - 1) <= o;
if (Math.abs(t - 1) <= this._scrollView.getScrollEndedEventTiming() && !this._scrollView._isScrollEndedWithThresholdEventFired) {
this._scrollView._dispatchEvent("scroll-ended-with-threshold");
this._scrollView._isScrollEndedWithThresholdEventFired = !0;
}
r && (this._scrollView._autoScrolling = !1);
var a = i.sub(this._scrollView.getContentPosition());
this._scrollView._moveContent(this._scrollView._clampDelta(a), r);
this._scrollView._dispatchEvent("scrolling");
if (!this._scrollView._autoScrolling) {
this._scrollView._isBouncing = !1;
this._scrollView._scrolling = !1;
this._scrollView._dispatchEvent("scroll-ended");
}
};
t.prototype.setTemplateItem = function(e) {
if (e) {
var t = this;
t._itemTmp = e;
t._resizeMode == cc.Layout.ResizeMode.CHILDREN ? t._itemSize = t._layout.cellSize : t._itemSize = cc.size(e.width, e.height);
var n = e.getComponent(g.default), i = !1;
n || (i = !0);
i && (t.selectedMode = c.NONE);
(n = e.getComponent(cc.Widget)) && n.enabled && (t._needUpdateWidget = !0);
t.selectedMode == c.MULT && (t.multSelected = []);
switch (t._align) {
case cc.Layout.Type.HORIZONTAL:
t._colLineNum = 1;
t._sizeType = !1;
break;

case cc.Layout.Type.VERTICAL:
t._colLineNum = 1;
t._sizeType = !0;
break;

case cc.Layout.Type.GRID:
switch (t._startAxis) {
case cc.Layout.AxisDirection.HORIZONTAL:
var o = t.content.width - t._leftGap - t._rightGap;
t._colLineNum = Math.floor((o + t._columnGap) / (t._itemSize.width + t._columnGap));
t._sizeType = !0;
break;

case cc.Layout.AxisDirection.VERTICAL:
var r = t.content.height - t._topGap - t._bottomGap;
t._colLineNum = Math.floor((r + t._lineGap) / (t._itemSize.height + t._lineGap));
t._sizeType = !1;
}
}
}
};
t.prototype.checkInited = function(e) {
void 0 === e && (e = !0);
if (!this._inited) {
e && cc.error("List initialization not completed!");
return !1;
}
return !0;
};
t.prototype._resizeContent = function() {
var e, t = this;
switch (t._align) {
case cc.Layout.Type.HORIZONTAL:
if (t._customSize) {
var n = t._getFixedSize(null);
e = t._leftGap + n.val + t._itemSize.width * (t._numItems - n.count) + t._columnGap * (t._numItems - 1) + t._rightGap;
} else e = t._leftGap + t._itemSize.width * t._numItems + t._columnGap * (t._numItems - 1) + t._rightGap;
break;

case cc.Layout.Type.VERTICAL:
if (t._customSize) {
n = t._getFixedSize(null);
e = t._topGap + n.val + t._itemSize.height * (t._numItems - n.count) + t._lineGap * (t._numItems - 1) + t._bottomGap;
} else e = t._topGap + t._itemSize.height * t._numItems + t._lineGap * (t._numItems - 1) + t._bottomGap;
break;

case cc.Layout.Type.GRID:
t.lackCenter && (t.lackCenter = !1);
switch (t._startAxis) {
case cc.Layout.AxisDirection.HORIZONTAL:
var i = Math.ceil(t._numItems / t._colLineNum);
e = t._topGap + t._itemSize.height * i + t._lineGap * (i - 1) + t._bottomGap;
break;

case cc.Layout.AxisDirection.VERTICAL:
var o = Math.ceil(t._numItems / t._colLineNum);
e = t._leftGap + t._itemSize.width * o + t._columnGap * (o - 1) + t._rightGap;
}
}
var r = t.content.getComponent(cc.Layout);
r && (r.enabled = !1);
t._allItemSize = e;
t._allItemSizeNoEdge = t._allItemSize - (t._sizeType ? t._topGap + t._bottomGap : t._leftGap + t._rightGap);
if (t.cyclic) {
var a = t._sizeType ? t.node.height : t.node.width;
t._cyclicPos1 = 0;
a -= t._cyclicPos1;
t._cyclicNum = Math.ceil(a / t._allItemSizeNoEdge) + 1;
var s = t._sizeType ? t._lineGap : t._columnGap;
t._cyclicPos2 = t._cyclicPos1 + t._allItemSizeNoEdge + s;
t._cyclicAllItemSize = t._allItemSize + t._allItemSizeNoEdge * (t._cyclicNum - 1) + s * (t._cyclicNum - 1);
t._cycilcAllItemSizeNoEdge = t._allItemSizeNoEdge * t._cyclicNum;
t._cycilcAllItemSizeNoEdge += s * (t._cyclicNum - 1);
}
t._lack = !t.cyclic && t._allItemSize < (t._sizeType ? t.node.height : t.node.width);
var c = t._lack && t.lackCenter || !t.lackSlide ? .1 : 0, l = t._lack ? (t._sizeType ? t.node.height : t.node.width) - c : t.cyclic ? t._cyclicAllItemSize : t._allItemSize;
l < 0 && (l = 0);
t._sizeType ? t.content.height = l : t.content.width = l;
};
t.prototype._onScrolling = function(e) {
void 0 === e && (e = null);
null == this.frameCount && (this.frameCount = this._updateRate);
if (!this._forceUpdate && e && "scroll-ended" != e.type && this.frameCount > 0) this.frameCount--; else {
this.frameCount = this._updateRate;
if (!this._aniDelRuning) {
if (this.cyclic) {
var t = this.content.getPosition();
t = this._sizeType ? t.y : t.x;
var n = this._allItemSizeNoEdge + (this._sizeType ? this._lineGap : this._columnGap), i = this._sizeType ? cc.v2(0, n) : cc.v2(n, 0);
switch (this._alignCalcType) {
case 1:
if (t > -this._cyclicPos1) {
this.content.x = -this._cyclicPos2;
this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.sub(i));
} else if (t < -this._cyclicPos2) {
this.content.x = -this._cyclicPos1;
this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.add(i));
}
break;

case 2:
if (t < this._cyclicPos1) {
this.content.x = this._cyclicPos2;
this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.add(i));
} else if (t > this._cyclicPos2) {
this.content.x = this._cyclicPos1;
this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.sub(i));
}
break;

case 3:
if (t < this._cyclicPos1) {
this.content.y = this._cyclicPos2;
this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.add(i));
} else if (t > this._cyclicPos2) {
this.content.y = this._cyclicPos1;
this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.sub(i));
}
break;

case 4:
if (t > -this._cyclicPos1) {
this.content.y = -this._cyclicPos2;
this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.sub(i));
} else if (t < -this._cyclicPos2) {
this.content.y = -this._cyclicPos1;
this._scrollView.isAutoScrolling() && (this._scrollView._autoScrollStartPosition = this._scrollView._autoScrollStartPosition.add(i));
}
}
}
this._calcViewPos();
var o, r, a, s;
if (this._sizeType) {
o = this.viewTop;
a = this.viewBottom;
} else {
r = this.viewRight;
s = this.viewLeft;
}
if (this._virtual) {
this.displayData = [];
var c = void 0, l = 0, u = this._numItems - 1;
if (this._customSize) for (var d = !1; l <= u && !d; l++) {
c = this._calcItemPos(l);
switch (this._align) {
case cc.Layout.Type.HORIZONTAL:
c.right >= s && c.left <= r ? this.displayData.push(c) : 0 != l && this.displayData.length > 0 && (d = !0);
break;

case cc.Layout.Type.VERTICAL:
c.bottom <= o && c.top >= a ? this.displayData.push(c) : 0 != l && this.displayData.length > 0 && (d = !0);
break;

case cc.Layout.Type.GRID:
switch (this._startAxis) {
case cc.Layout.AxisDirection.HORIZONTAL:
c.bottom <= o && c.top >= a ? this.displayData.push(c) : 0 != l && this.displayData.length > 0 && (d = !0);
break;

case cc.Layout.AxisDirection.VERTICAL:
c.right >= s && c.left <= r ? this.displayData.push(c) : 0 != l && this.displayData.length > 0 && (d = !0);
}
}
} else {
var h = this._itemSize.width + this._columnGap, p = this._itemSize.height + this._lineGap;
switch (this._alignCalcType) {
case 1:
l = (s - this._leftGap) / h;
u = (r - this._leftGap) / h;
break;

case 2:
l = (-r - this._rightGap) / h;
u = (-s - this._rightGap) / h;
break;

case 3:
l = (-o - this._topGap) / p;
u = (-a - this._topGap) / p;
break;

case 4:
l = (a - this._bottomGap) / p;
u = (o - this._bottomGap) / p;
}
l = Math.floor(l) * this._colLineNum;
u = Math.ceil(u) * this._colLineNum;
l < 0 && (l = 0);
--u >= this._numItems && (u = this._numItems - 1);
for (;l <= u; l++) this.displayData.push(this._calcItemPos(l));
}
this._delRedundantItem();
if (this.displayData.length <= 0 || !this._numItems) {
this._lastDisplayData = [];
return;
}
this.firstListId = this.displayData[0].id;
this.displayItemNum = this.displayData.length;
var f = this._lastDisplayData.length, _ = this.displayItemNum != f;
if (_) {
this.frameByFrameRenderNum > 0 && this._lastDisplayData.sort(function(e, t) {
return e - t;
});
_ = this.firstListId != this._lastDisplayData[0] || this.displayData[this.displayItemNum - 1].id != this._lastDisplayData[f - 1];
}
if (this._forceUpdate || _) if (this.frameByFrameRenderNum > 0) if (this._numItems > 0) {
this._updateDone ? this._updateCounter = 0 : this._doneAfterUpdate = !0;
this._updateDone = !1;
} else {
this._updateCounter = 0;
this._updateDone = !0;
} else {
this._lastDisplayData = [];
for (var g = 0; g < this.displayItemNum; g++) this._createOrUpdateItem(this.displayData[g]);
this._forceUpdate = !1;
}
this._calcNearestItem();
}
}
}
};
t.prototype._calcViewPos = function() {
var e = this.content.getPosition();
switch (this._alignCalcType) {
case 1:
this.elasticLeft = e.x > 0 ? e.x : 0;
this.viewLeft = (e.x < 0 ? -e.x : 0) - this.elasticLeft;
this.viewRight = this.viewLeft + this.node.width;
this.elasticRight = this.viewRight > this.content.width ? Math.abs(this.viewRight - this.content.width) : 0;
this.viewRight += this.elasticRight;
break;

case 2:
this.elasticRight = e.x < 0 ? -e.x : 0;
this.viewRight = (e.x > 0 ? -e.x : 0) + this.elasticRight;
this.viewLeft = this.viewRight - this.node.width;
this.elasticLeft = this.viewLeft < -this.content.width ? Math.abs(this.viewLeft + this.content.width) : 0;
this.viewLeft -= this.elasticLeft;
break;

case 3:
this.elasticTop = e.y < 0 ? Math.abs(e.y) : 0;
this.viewTop = (e.y > 0 ? -e.y : 0) + this.elasticTop;
this.viewBottom = this.viewTop - this.node.height;
this.elasticBottom = this.viewBottom < -this.content.height ? Math.abs(this.viewBottom + this.content.height) : 0;
this.viewBottom += this.elasticBottom;
break;

case 4:
this.elasticBottom = e.y > 0 ? Math.abs(e.y) : 0;
this.viewBottom = (e.y < 0 ? -e.y : 0) - this.elasticBottom;
this.viewTop = this.viewBottom + this.node.height;
this.elasticTop = this.viewTop > this.content.height ? Math.abs(this.viewTop - this.content.height) : 0;
this.viewTop -= this.elasticTop;
}
};
t.prototype._calcItemPos = function(e) {
var t, n, i, o, r, a, s, c;
switch (this._align) {
case cc.Layout.Type.HORIZONTAL:
switch (this._horizontalDir) {
case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
if (this._customSize) {
var l = this._getFixedSize(e);
r = this._leftGap + (this._itemSize.width + this._columnGap) * (e - l.count) + (l.val + this._columnGap * l.count);
t = (u = this._customSize[e]) > 0 ? u : this._itemSize.width;
} else {
r = this._leftGap + (this._itemSize.width + this._columnGap) * e;
t = this._itemSize.width;
}
if (this.lackCenter) {
r -= this._leftGap;
r += this.content.width / 2 - this._allItemSizeNoEdge / 2;
}
return {
id: e,
left: r,
right: a = r + t,
x: r + this._itemTmp.anchorX * t,
y: this._itemTmp.y
};

case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
if (this._customSize) {
l = this._getFixedSize(e);
a = -this._rightGap - (this._itemSize.width + this._columnGap) * (e - l.count) - (l.val + this._columnGap * l.count);
t = (u = this._customSize[e]) > 0 ? u : this._itemSize.width;
} else {
a = -this._rightGap - (this._itemSize.width + this._columnGap) * e;
t = this._itemSize.width;
}
if (this.lackCenter) {
a += this._rightGap;
a -= this.content.width / 2 - this._allItemSizeNoEdge / 2;
}
return {
id: e,
right: a,
left: r = a - t,
x: r + this._itemTmp.anchorX * t,
y: this._itemTmp.y
};
}
break;

case cc.Layout.Type.VERTICAL:
switch (this._verticalDir) {
case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
if (this._customSize) {
l = this._getFixedSize(e);
i = -this._topGap - (this._itemSize.height + this._lineGap) * (e - l.count) - (l.val + this._lineGap * l.count);
n = (u = this._customSize[e]) > 0 ? u : this._itemSize.height;
} else {
i = -this._topGap - (this._itemSize.height + this._lineGap) * e;
n = this._itemSize.height;
}
if (this.lackCenter) {
i += this._topGap;
i -= this.content.height / 2 - this._allItemSizeNoEdge / 2;
}
return {
id: e,
top: i,
bottom: o = i - n,
x: this._itemTmp.x,
y: o + this._itemTmp.anchorY * n
};

case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
if (this._customSize) {
var u;
l = this._getFixedSize(e);
o = this._bottomGap + (this._itemSize.height + this._lineGap) * (e - l.count) + (l.val + this._lineGap * l.count);
n = (u = this._customSize[e]) > 0 ? u : this._itemSize.height;
} else {
o = this._bottomGap + (this._itemSize.height + this._lineGap) * e;
n = this._itemSize.height;
}
if (this.lackCenter) {
o -= this._bottomGap;
o += this.content.height / 2 - this._allItemSizeNoEdge / 2;
}
return {
id: e,
top: i = o + n,
bottom: o,
x: this._itemTmp.x,
y: o + this._itemTmp.anchorY * n
};
}

case cc.Layout.Type.GRID:
var d = Math.floor(e / this._colLineNum);
switch (this._startAxis) {
case cc.Layout.AxisDirection.HORIZONTAL:
switch (this._verticalDir) {
case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
c = (o = (i = -this._topGap - (this._itemSize.height + this._lineGap) * d) - this._itemSize.height) + this._itemTmp.anchorY * this._itemSize.height;
break;

case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
i = (o = this._bottomGap + (this._itemSize.height + this._lineGap) * d) + this._itemSize.height;
c = o + this._itemTmp.anchorY * this._itemSize.height;
}
s = this._leftGap + e % this._colLineNum * (this._itemSize.width + this._columnGap);
switch (this._horizontalDir) {
case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
s += this._itemTmp.anchorX * this._itemSize.width;
s -= this.content.anchorX * this.content.width;
break;

case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
s += (1 - this._itemTmp.anchorX) * this._itemSize.width;
s -= (1 - this.content.anchorX) * this.content.width;
s *= -1;
}
return {
id: e,
top: i,
bottom: o,
x: s,
y: c
};

case cc.Layout.AxisDirection.VERTICAL:
switch (this._horizontalDir) {
case cc.Layout.HorizontalDirection.LEFT_TO_RIGHT:
a = (r = this._leftGap + (this._itemSize.width + this._columnGap) * d) + this._itemSize.width;
s = r + this._itemTmp.anchorX * this._itemSize.width;
s -= this.content.anchorX * this.content.width;
break;

case cc.Layout.HorizontalDirection.RIGHT_TO_LEFT:
s = (r = (a = -this._rightGap - (this._itemSize.width + this._columnGap) * d) - this._itemSize.width) + this._itemTmp.anchorX * this._itemSize.width;
s += (1 - this.content.anchorX) * this.content.width;
}
c = -this._topGap - e % this._colLineNum * (this._itemSize.height + this._lineGap);
switch (this._verticalDir) {
case cc.Layout.VerticalDirection.TOP_TO_BOTTOM:
c -= (1 - this._itemTmp.anchorY) * this._itemSize.height;
c += (1 - this.content.anchorY) * this.content.height;
break;

case cc.Layout.VerticalDirection.BOTTOM_TO_TOP:
c -= this._itemTmp.anchorY * this._itemSize.height;
c += this.content.anchorY * this.content.height;
c *= -1;
}
return {
id: e,
left: r,
right: a,
x: s,
y: c
};
}
}
};
t.prototype._calcExistItemPos = function(e) {
var t = this.getItemByListId(e);
if (!t) return null;
var n = {
id: e,
x: t.x,
y: t.y
};
if (this._sizeType) {
n.top = t.y + t.height * (1 - t.anchorY);
n.bottom = t.y - t.height * t.anchorY;
} else {
n.left = t.x - t.width * t.anchorX;
n.right = t.x + t.width * (1 - t.anchorX);
}
return n;
};
t.prototype.getItemPos = function(e) {
return this._virtual ? this._calcItemPos(e) : this.frameByFrameRenderNum ? this._calcItemPos(e) : this._calcExistItemPos(e);
};
t.prototype._getFixedSize = function(e) {
if (!this._customSize) return null;
null == e && (e = this._numItems);
var t = 0, n = 0;
for (var i in this._customSize) if (parseInt(i) < e) {
t += this._customSize[i];
n++;
}
return {
val: t,
count: n
};
};
t.prototype._onScrollBegan = function() {
this._beganPos = this._sizeType ? this.viewTop : this.viewLeft;
};
t.prototype._onScrollEnded = function() {
var e = this;
e.curScrollIsTouch = !1;
if (null != e.scrollToListId) {
var t = e.getItemByListId(e.scrollToListId);
e.scrollToListId = null;
t && cc.tween(t).to(.1, {
scale: 1.06
}).to(.1, {
scale: 1
}).start();
}
e._onScrolling();
e._slideMode != s.ADHERING || e.adhering ? e._slideMode == s.PAGE && (null != e._beganPos && e.curScrollIsTouch ? this._pageAdhere() : e.adhere()) : e.adhere();
};
t.prototype._onTouchStart = function(e, t) {
if (!this._scrollView.hasNestedViewGroup(e, t)) {
this.curScrollIsTouch = !0;
if (e.eventPhase !== cc.Event.AT_TARGET || e.target !== this.node) {
for (var n = e.target; null == n._listId && n.parent; ) n = n.parent;
this._scrollItem = null != n._listId ? n : e.target;
}
}
};
t.prototype._onTouchUp = function() {
var e = this;
e._scrollPos = null;
if (e._slideMode == s.ADHERING) {
this.adhering && (this._adheringBarrier = !0);
e.adhere();
} else e._slideMode == s.PAGE && (null != e._beganPos ? this._pageAdhere() : e.adhere());
this._scrollItem = null;
};
t.prototype._onTouchCancelled = function(e, t) {
var n = this;
if (!n._scrollView.hasNestedViewGroup(e, t) && !e.simulate) {
n._scrollPos = null;
if (n._slideMode == s.ADHERING) {
n.adhering && (n._adheringBarrier = !0);
n.adhere();
} else n._slideMode == s.PAGE && (null != n._beganPos ? n._pageAdhere() : n.adhere());
this._scrollItem = null;
}
};
t.prototype._onSizeChanged = function() {
this.checkInited(!1) && this._onScrolling();
};
t.prototype._onItemAdaptive = function(e) {
if (!this._sizeType && e.width != this._itemSize.width || this._sizeType && e.height != this._itemSize.height) {
this._customSize || (this._customSize = {});
var t = this._sizeType ? e.height : e.width;
if (this._customSize[e._listId] != t) {
this._customSize[e._listId] = t;
this._resizeContent();
this.updateAll();
if (null != this._scrollToListId) {
this._scrollPos = null;
this.unschedule(this._scrollToSo);
this.scrollTo(this._scrollToListId, Math.max(0, this._scrollToEndTime - new Date().getTime() / 1e3));
}
}
}
};
t.prototype._pageAdhere = function() {
var e = this;
if (e.cyclic || !(e.elasticTop > 0 || e.elasticRight > 0 || e.elasticBottom > 0 || e.elasticLeft > 0)) {
var t = e._sizeType ? e.viewTop : e.viewLeft, n = (e._sizeType ? e.node.height : e.node.width) * e.pageDistance;
if (Math.abs(e._beganPos - t) > n) switch (e._alignCalcType) {
case 1:
case 4:
e._beganPos > t ? e.prePage(.5) : e.nextPage(.5);
break;

case 2:
case 3:
e._beganPos < t ? e.prePage(.5) : e.nextPage(.5);
} else e.elasticTop <= 0 && e.elasticRight <= 0 && e.elasticBottom <= 0 && e.elasticLeft <= 0 && e.adhere();
e._beganPos = null;
}
};
t.prototype.adhere = function() {
var e = this;
if (e.checkInited() && !(e.elasticTop > 0 || e.elasticRight > 0 || e.elasticBottom > 0 || e.elasticLeft > 0)) {
e.adhering = !0;
e._calcNearestItem();
var t = (e._sizeType ? e._topGap : e._leftGap) / (e._sizeType ? e.node.height : e.node.width);
e.scrollTo(e.nearestListId, .7, t);
}
};
t.prototype.update = function() {
if (!(this.frameByFrameRenderNum <= 0 || this._updateDone)) if (this._virtual) {
for (var e = this._updateCounter + this.frameByFrameRenderNum > this.displayItemNum ? this.displayItemNum : this._updateCounter + this.frameByFrameRenderNum, t = this._updateCounter; t < e; t++) {
var n = this.displayData[t];
n && this._createOrUpdateItem(n);
}
if (this._updateCounter >= this.displayItemNum - 1) if (this._doneAfterUpdate) {
this._updateCounter = 0;
this._updateDone = !1;
this._doneAfterUpdate = !1;
} else {
this._updateDone = !0;
this._delRedundantItem();
this._forceUpdate = !1;
this._calcNearestItem();
this.slideMode == s.PAGE && (this.curPageNum = this.nearestListId);
} else this._updateCounter += this.frameByFrameRenderNum;
} else if (this._updateCounter < this._numItems) {
for (e = this._updateCounter + this.frameByFrameRenderNum > this._numItems ? this._numItems : this._updateCounter + this.frameByFrameRenderNum, 
t = this._updateCounter; t < e; t++) this._createOrUpdateItem2(t);
this._updateCounter += this.frameByFrameRenderNum;
} else {
this._updateDone = !0;
this._calcNearestItem();
this.slideMode == s.PAGE && (this.curPageNum = this.nearestListId);
}
};
t.prototype._createOrUpdateItem = function(e) {
var t = this.getItemByListId(e.id);
if (t) {
if (this._forceUpdate && this.renderEvent) {
t.setPosition(cc.v2(e.x, e.y));
this._resetItemSize(t);
this.renderEvent && cc.Component.EventHandler.emitEvents([ this.renderEvent ], t, e.id % this._actualNumItems);
}
} else {
var n = this._pool.size() > 0;
t = n ? this._pool.get() : cc.instantiate(this._itemTmp);
if (!n || !cc.isValid(t)) {
t = cc.instantiate(this._itemTmp);
n = !1;
}
if (t._listId != e.id) {
t._listId = e.id;
t.setContentSize(this._itemSize);
}
t.setPosition(cc.v2(e.x, e.y));
this._resetItemSize(t);
this.content.addChild(t);
if (n && this._needUpdateWidget) {
var i = t.getComponent(cc.Widget);
i && i.updateAlignment();
}
t.setSiblingIndex(this.content.childrenCount - 1);
var o = t.getComponent(g.default);
t.listItem = o;
if (o) {
o.listId = e.id;
o.list = this;
o._registerEvent();
}
this.renderEvent && cc.Component.EventHandler.emitEvents([ this.renderEvent ], t, e.id % this._actualNumItems);
}
this._resetItemSize(t);
this._updateListItem(t.listItem);
this._lastDisplayData.indexOf(e.id) < 0 && this._lastDisplayData.push(e.id);
};
t.prototype._createOrUpdateItem2 = function(e) {
var t, n = this.content.children[e];
if (n) {
if (this._forceUpdate && this.renderEvent) {
n._listId = e;
t && (t.listId = e);
this.renderEvent && cc.Component.EventHandler.emitEvents([ this.renderEvent ], n, e % this._actualNumItems);
}
} else {
(n = cc.instantiate(this._itemTmp))._listId = e;
this.content.addChild(n);
t = n.getComponent(g.default);
n.listItem = t;
if (t) {
t.listId = e;
t.list = this;
t._registerEvent();
}
this.renderEvent && cc.Component.EventHandler.emitEvents([ this.renderEvent ], n, e % this._actualNumItems);
}
this._updateListItem(t);
this._lastDisplayData.indexOf(e) < 0 && this._lastDisplayData.push(e);
};
t.prototype._updateListItem = function(e) {
if (e && this.selectedMode > c.NONE) {
var t = e.node;
switch (this.selectedMode) {
case c.SINGLE:
e.selected = this.selectedId == t._listId;
break;

case c.MULT:
e.selected = this.multSelected.indexOf(t._listId) >= 0;
}
}
};
t.prototype._resetItemSize = function() {};
t.prototype._updateItemPos = function(e) {
var t = isNaN(e) ? e : this.getItemByListId(e), n = this.getItemPos(t._listId);
t.setPosition(n.x, n.y);
};
t.prototype.setMultSelected = function(e, t) {
var n = this;
if (n.checkInited()) {
Array.isArray(e) || (e = [ e ]);
if (null == t) n.multSelected = e; else {
var i = void 0, o = void 0;
if (t) for (var r = e.length - 1; r >= 0; r--) {
i = e[r];
(o = n.multSelected.indexOf(i)) < 0 && n.multSelected.push(i);
} else for (r = e.length - 1; r >= 0; r--) {
i = e[r];
(o = n.multSelected.indexOf(i)) >= 0 && n.multSelected.splice(o, 1);
}
}
n._forceUpdate = !0;
n._onScrolling();
}
};
t.prototype.getMultSelected = function() {
return this.multSelected;
};
t.prototype.hasMultSelected = function(e) {
return this.multSelected && this.multSelected.indexOf(e) >= 0;
};
t.prototype.updateItem = function(e) {
if (this.checkInited()) {
Array.isArray(e) || (e = [ e ]);
for (var t = 0, n = e.length; t < n; t++) {
var i = e[t], o = this.getItemByListId(i);
o && cc.Component.EventHandler.emitEvents([ this.renderEvent ], o, i % this._actualNumItems);
}
}
};
t.prototype.updateAll = function() {
this.checkInited() && (this.numItems = this.numItems);
};
t.prototype.getItemByListId = function(e) {
if (this.content) for (var t = this.content.childrenCount - 1; t >= 0; t--) {
var n = this.content.children[t];
if (n._listId == e) return n;
}
};
t.prototype._getOutsideItem = function() {
for (var e, t = [], n = this.content.childrenCount - 1; n >= 0; n--) {
e = this.content.children[n];
this.displayData.find(function(t) {
return t.id == e._listId;
}) || t.push(e);
}
return t;
};
t.prototype._delRedundantItem = function() {
if (this._virtual) for (var e = this._getOutsideItem(), t = e.length - 1; t >= 0; t--) {
var n = e[t];
if (!this._scrollItem || n._listId != this._scrollItem._listId) {
n.isCached = !0;
this._pool.put(n);
for (var i = this._lastDisplayData.length - 1; i >= 0; i--) if (this._lastDisplayData[i] == n._listId) {
this._lastDisplayData.splice(i, 1);
break;
}
}
} else for (;this.content.childrenCount > this._numItems; ) this._delSingleItem(this.content.children[this.content.childrenCount - 1]);
};
t.prototype._delSingleItem = function(e) {
e.removeFromParent();
e.destroy && e.destroy();
e = null;
};
t.prototype.aniDelItem = function(e, t, n) {
var i = this;
if (!i.checkInited() || i.cyclic || !i._virtual) return cc.error("This function is not allowed to be called!");
if (!t) return cc.error("CallFunc are not allowed to be NULL, You need to delete the corresponding index in the data array in the CallFunc!");
if (i._aniDelRuning) return cc.warn("Please wait for the current deletion to finish!");
var o, r = i.getItemByListId(e);
if (r) {
o = r.getComponent(g.default);
i._aniDelRuning = !0;
i._aniDelCB = t;
i._aniDelItem = r;
i._aniDelBeforePos = r.position;
i._aniDelBeforeScale = r.scale;
var a = i.displayData[i.displayData.length - 1].id, s = o.selected;
o.showAni(n, function() {
var n, o, l;
a < i._numItems - 2 && (n = a + 1);
if (null != n) {
var u = i._calcItemPos(n);
i.displayData.push(u);
i._virtual ? i._createOrUpdateItem(u) : i._createOrUpdateItem2(n);
} else i._numItems--;
if (i.selectedMode == c.SINGLE) s ? i._selectedId = -1 : i._selectedId - 1 >= 0 && i._selectedId--; else if (i.selectedMode == c.MULT && i.multSelected.length) {
var d = i.multSelected.indexOf(e);
d >= 0 && i.multSelected.splice(d, 1);
for (var h = i.multSelected.length - 1; h >= 0; h--) (_ = i.multSelected[h]) >= e && i.multSelected[h]--;
}
if (i._customSize) {
i._customSize[e] && delete i._customSize[e];
var p = {}, f = void 0;
for (var _ in i._customSize) {
f = i._customSize[_];
var g = parseInt(_);
p[g - (g >= e ? 1 : 0)] = f;
}
i._customSize = p;
}
for (h = null != n ? n : a; h >= e + 1; h--) if (r = i.getItemByListId(h)) {
var v = i._calcItemPos(h - 1);
o = cc.tween(r).to(.2333, {
position: cc.v2(v.x, v.y)
});
if (h <= e + 1) {
l = !0;
o.call(function() {
i._aniDelRuning = !1;
t(e);
delete i._aniDelCB;
});
}
o.start();
}
if (!l) {
i._aniDelRuning = !1;
t(e);
i._aniDelCB = null;
}
}, !0);
} else t(e);
};
t.prototype.scrollTo = function(e, t, n, i) {
void 0 === t && (t = .5);
void 0 === n && (n = null);
void 0 === i && (i = !1);
var o = this;
if (o.checkInited(!1)) {
null == t ? t = .5 : t < 0 && (t = 0);
e < 0 ? e = 0 : e >= o._numItems && (e = o._numItems - 1);
!o._virtual && o._layout && o._layout.enabled && o._layout.updateLayout();
var r, a, s = o.getItemPos(e);
if (!s) return !1;
switch (o._alignCalcType) {
case 1:
r = s.left;
r -= null != n ? o.node.width * n : o._leftGap;
s = cc.v2(r, 0);
break;

case 2:
r = s.right - o.node.width;
r += null != n ? o.node.width * n : o._rightGap;
s = cc.v2(r + o.content.width, 0);
break;

case 3:
a = s.top;
a += null != n ? o.node.height * n : o._topGap;
s = cc.v2(0, -a);
break;

case 4:
a = s.bottom + o.node.height;
a -= null != n ? o.node.height * n : o._bottomGap;
s = cc.v2(0, -a + o.content.height);
}
var c = o.content.getPosition();
c = Math.abs(o._sizeType ? c.y : c.x);
var l = o._sizeType ? s.y : s.x;
if (Math.abs((null != o._scrollPos ? o._scrollPos : c) - l) > .5) {
o._scrollView.scrollToOffset(s, t);
o._scrollToListId = e;
o._scrollToEndTime = new Date().getTime() / 1e3 + t;
o._scrollToSo = o.scheduleOnce(function() {
o._adheringBarrier || (o.adhering = o._adheringBarrier = !1);
o._scrollPos = o._scrollToListId = o._scrollToEndTime = o._scrollToSo = null;
if (i) {
var t = o.getItemByListId(e);
t && cc.tween(t).to(.1, {
scale: 1.05
}).to(.1, {
scale: 1
}).start();
}
}, t + .1);
t <= 0 && o._onScrolling();
}
}
};
t.prototype._calcNearestItem = function() {
var e, t, n, i, o, r, a = this;
a.nearestListId = null;
a._virtual && a._calcViewPos();
n = a.viewTop;
i = a.viewRight;
o = a.viewBottom;
r = a.viewLeft;
for (var s = !1, c = 0; c < a.content.childrenCount && !s; c += a._colLineNum) if (e = a._virtual ? a.displayData[c] : a._calcExistItemPos(c)) {
t = a._sizeType ? (e.top + e.bottom) / 2 : t = (e.left + e.right) / 2;
switch (a._alignCalcType) {
case 1:
if (e.right >= r) {
a.nearestListId = e.id;
r > t && (a.nearestListId += a._colLineNum);
s = !0;
}
break;

case 2:
if (e.left <= i) {
a.nearestListId = e.id;
i < t && (a.nearestListId += a._colLineNum);
s = !0;
}
break;

case 3:
if (e.bottom <= n) {
a.nearestListId = e.id;
n < t && (a.nearestListId += a._colLineNum);
s = !0;
}
break;

case 4:
if (e.top >= o) {
a.nearestListId = e.id;
o > t && (a.nearestListId += a._colLineNum);
s = !0;
}
}
}
if ((e = a._virtual ? a.displayData[a.displayItemNum - 1] : a._calcExistItemPos(a._numItems - 1)) && e.id == a._numItems - 1) {
t = a._sizeType ? (e.top + e.bottom) / 2 : t = (e.left + e.right) / 2;
switch (a._alignCalcType) {
case 1:
i > t && (a.nearestListId = e.id);
break;

case 2:
r < t && (a.nearestListId = e.id);
break;

case 3:
o < t && (a.nearestListId = e.id);
break;

case 4:
n > t && (a.nearestListId = e.id);
}
}
};
t.prototype.prePage = function(e) {
void 0 === e && (e = .5);
this.checkInited() && this.skipPage(this.curPageNum - 1, e);
};
t.prototype.nextPage = function(e) {
void 0 === e && (e = .5);
this.checkInited() && this.skipPage(this.curPageNum + 1, e);
};
t.prototype.skipPage = function(e, t) {
var n = this;
if (n.checkInited()) {
if (n._slideMode != s.PAGE) return cc.error("This function is not allowed to be called, Must SlideMode = PAGE!");
if (!(e < 0 || e >= n._numItems) && n.curPageNum != e) {
n.curPageNum = e;
n.pageChangeEvent && cc.Component.EventHandler.emitEvents([ n.pageChangeEvent ], e);
n.scrollTo(e, t);
}
}
};
t.prototype.calcCustomSize = function(e) {
var t = this;
if (t.checkInited()) {
if (!t._itemTmp) return cc.error("Unset template item!");
if (!t.renderEvent) return cc.error("Unset Render-Event!");
t._customSize = {};
var n = cc.instantiate(t._itemTmp);
t.content.addChild(n);
for (var i = 0; i < e; i++) {
cc.Component.EventHandler.emitEvents([ t.renderEvent ], n, i);
n.height == t._itemSize.height && n.width == t._itemSize.width || (t._customSize[i] = t._sizeType ? n.height : n.width);
}
Object.keys(t._customSize).length || (t._customSize = null);
n.removeFromParent();
n.destroy && n.destroy();
return t._customSize;
}
};
r([ d({
type: cc.Enum(a),
tooltip: "模板类型"
}) ], t.prototype, "templateType", void 0);
r([ d({
type: cc.Node,
tooltip: "模板Item",
visible: function() {
return this.templateType == a.NODE;
}
}) ], t.prototype, "tmpNode", void 0);
r([ d({
type: cc.Prefab,
tooltip: "模板Item",
visible: function() {
return this.templateType == a.PREFAB;
}
}) ], t.prototype, "tmpPrefab", void 0);
r([ d() ], t.prototype, "_slideMode", void 0);
r([ d({
type: cc.Enum(s),
tooltip: "滑动模式"
}) ], t.prototype, "slideMode", null);
r([ d({
type: cc.Float,
range: [ 0, 1, .1 ],
tooltip: "翻页作用距离",
slide: !0,
visible: function() {
return this._slideMode == s.PAGE;
}
}) ], t.prototype, "pageDistance", void 0);
r([ d({
type: cc.Component.EventHandler,
tooltip: "页面改变事件",
visible: function() {
return this._slideMode == s.PAGE;
}
}) ], t.prototype, "pageChangeEvent", void 0);
r([ d() ], t.prototype, "_virtual", void 0);
r([ d({
type: cc.Boolean,
tooltip: "是否为虚拟列表（动态列表）"
}) ], t.prototype, "virtual", null);
r([ d({
tooltip: "是否为循环列表",
visible: function() {
var e = this.slideMode == s.NORMAL;
e || (this.cyclic = !1);
return e;
}
}) ], t.prototype, "cyclic", void 0);
r([ d({
tooltip: "Item数量不足以填满Content时，是否居中显示Item（不支持Grid布局）",
visible: function() {
return this.virtual;
}
}) ], t.prototype, "lackCenter", void 0);
r([ d({
tooltip: "Item数量不足以填满Content时，是否可滑动",
visible: function() {
var e = this.virtual && !this.lackCenter;
e || (this.lackSlide = !1);
return e;
}
}) ], t.prototype, "lackSlide", void 0);
r([ d({
type: cc.Integer
}) ], t.prototype, "_updateRate", void 0);
r([ d({
type: cc.Integer,
range: [ 0, 6, 1 ],
tooltip: "刷新频率（值越大刷新频率越低、性能越高）",
slide: !0
}) ], t.prototype, "updateRate", null);
r([ d({
type: cc.Integer,
range: [ 0, 12, 1 ],
tooltip: "逐帧渲染时，每帧渲染的Item数量（<=0时关闭分帧渲染）",
slide: !0
}) ], t.prototype, "frameByFrameRenderNum", void 0);
r([ d({
type: cc.Component.EventHandler,
tooltip: "渲染事件（渲染器）"
}) ], t.prototype, "renderEvent", void 0);
r([ d({
type: cc.Enum(c),
tooltip: "选择模式"
}) ], t.prototype, "selectedMode", void 0);
r([ d({
tooltip: "是否重复响应单选事件",
visible: function() {
return this.selectedMode == c.SINGLE;
}
}) ], t.prototype, "repeatEventSingle", void 0);
r([ d({
type: cc.Component.EventHandler,
tooltip: "触发选择事件",
visible: function() {
return this.selectedMode > c.NONE;
}
}) ], t.prototype, "selectedEvent", void 0);
r([ d({
serializable: !1
}) ], t.prototype, "_numItems", void 0);
return r([ u, h(), p("自定义组件/List"), _(cc.ScrollView), f(-5e3) ], t);
}(cc.Component);
n.default = v;
cc._RF.pop();
}, {
"./HSListItem": "HSListItem"
} ],
HSLogCollector: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "6660aHtdzZJO4s0IgYTfXKm", "HSLogCollector");
var i = this && this.__assign || function() {
return (i = Object.assign || function(e) {
for (var t, n = 1, i = arguments.length; n < i; n++) {
t = arguments[n];
for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
}
return e;
}).apply(this, arguments);
}, o = this && this.__read || function(e, t) {
var n = "function" == typeof Symbol && e[Symbol.iterator];
if (!n) return e;
var i, o, r = n.call(e), a = [];
try {
for (;(void 0 === t || t-- > 0) && !(i = r.next()).done; ) a.push(i.value);
} catch (e) {
o = {
error: e
};
} finally {
try {
i && !i.done && (n = r.return) && n.call(r);
} finally {
if (o) throw o.error;
}
}
return a;
}, r = this && this.__spread || function() {
for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(o(arguments[t]));
return e;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSLogCollector = void 0;
var a = function() {
function e() {
this._isCollecting = !1;
this._originalErrorHandler = null;
this._originalUnhandledRejectionHandler = null;
this._isEmittingEvent = !1;
this._recursionCount = 0;
this._maxRecursionDepth = 3;
this._logSequence = 0;
this.logReportCallback = null;
if (e._instance) throw new Error("HSLogCollector is a singleton. Use HSLogCollector.ins() instead.");
this._config = {
enableConsoleIntercept: !0,
enableErrorIntercept: !0,
enableCocosLogIntercept: !0,
keepOriginalConsole: !1,
maxMessageLength: 2e3,
enableStackTrace: !0,
taskId: "sandcrush"
};
this._originalConsole = {
log: void 0,
info: void 0,
warn: void 0,
error: void 0,
debug: void 0
};
e._instance = this;
}
e.ins = function() {
this._instance || (this._instance = new e());
return this._instance;
};
e.prototype.init = function(e, t) {
t && (this._config = i(i({}, this._config), t));
this.logReportCallback = e;
this.startCollecting();
this._originalConsole.log("[HSLogCollector] Initialized with config:", this._config);
};
e.prototype.startCollecting = function() {
if (!this._isCollecting) {
this._isCollecting = !0;
this._logSequence = 0;
this._config.enableConsoleIntercept && this.interceptConsole();
this._config.enableErrorIntercept && this.interceptGlobalErrors();
this._config.enableCocosLogIntercept && this.interceptCocosLogs();
this._originalConsole.log("[HSLogCollector] Started collecting logs");
}
};
e.prototype.stopCollecting = function() {
if (this._isCollecting) {
this._isCollecting = !1;
console.log = this._originalConsole.log;
console.info = this._originalConsole.info;
console.warn = this._originalConsole.warn;
console.error = this._originalConsole.error;
console.debug = this._originalConsole.debug;
if (this._originalErrorHandler) {
window.onerror = this._originalErrorHandler;
this._originalErrorHandler = null;
}
if (this._originalUnhandledRejectionHandler) {
window.onunhandledrejection = this._originalUnhandledRejectionHandler;
this._originalUnhandledRejectionHandler = null;
}
this._originalConsole.log("[HSLogCollector] Stopped collecting logs");
}
};
e.prototype.interceptConsole = function() {
var e = this;
console.log = function() {
for (var t, n = [], i = 0; i < arguments.length; i++) n[i] = arguments[i];
e.handleConsoleLog(n);
e._config.keepOriginalConsole && (t = e._originalConsole).log.apply(t, r([ "[ORIGINAL]" ], n));
};
console.info = function() {
for (var t, n = [], i = 0; i < arguments.length; i++) n[i] = arguments[i];
e.handleConsoleLog(n);
e._config.keepOriginalConsole && (t = e._originalConsole).info.apply(t, r([ "[ORIGINAL]" ], n));
};
console.warn = function() {
for (var t, n = [], i = 0; i < arguments.length; i++) n[i] = arguments[i];
e.handleConsoleLog(n);
e._config.keepOriginalConsole && (t = e._originalConsole).warn.apply(t, r([ "[ORIGINAL]" ], n));
};
console.error = function() {
for (var t, n = [], i = 0; i < arguments.length; i++) n[i] = arguments[i];
e.handleConsoleLog(n, 1);
e._config.keepOriginalConsole && (t = e._originalConsole).error.apply(t, r([ "[ORIGINAL]" ], n));
};
console.debug = function() {
for (var t, n = [], i = 0; i < arguments.length; i++) n[i] = arguments[i];
e.handleConsoleLog(n);
e._config.keepOriginalConsole && (t = e._originalConsole).debug.apply(t, r([ "[ORIGINAL]" ], n));
};
};
e.prototype.handleConsoleLog = function(e, t) {
void 0 === t && (t = 0);
if (!(this._isEmittingEvent || this._recursionCount >= this._maxRecursionDepth)) {
var n = this.formatConsoleArgs(e);
this.emitLogEvent(n, t);
}
};
e.prototype.interceptGlobalErrors = function() {
var e = this;
this._originalErrorHandler = window.onerror;
window.onerror = function(t, n, i, o, r) {
e.handleGlobalError(t);
return !!e._originalErrorHandler && e._originalErrorHandler.call(window, t, n, i, o, r);
};
this._originalUnhandledRejectionHandler = window.onunhandledrejection;
window.onunhandledrejection = function(t) {
e.handleUnhandledRejection(t);
if (e._originalUnhandledRejectionHandler) return e._originalUnhandledRejectionHandler.call(window, t);
};
};
e.prototype.handleGlobalError = function(e) {
if (!(this._isEmittingEvent || this._recursionCount >= this._maxRecursionDepth)) {
var t = "string" == typeof e ? e : String(e);
this.emitLogEvent(t, 1);
}
};
e.prototype.handleUnhandledRejection = function(e) {
if (!(this._isEmittingEvent || this._recursionCount >= this._maxRecursionDepth)) {
var t = e.reason, n = "Unhandled Promise Rejection";
n = t instanceof Error ? t.message || n : "string" == typeof t ? t : String(t);
this.emitLogEvent(n, 1);
}
};
e.prototype.interceptCocosLogs = function() {
var e = this;
if ("undefined" != typeof cc && cc.log) {
var t = cc.log, n = cc.warn, i = cc.error;
cc.log = function() {
for (var n = [], i = 0; i < arguments.length; i++) n[i] = arguments[i];
e.handleCocosLog(n);
e._config.keepOriginalConsole && t.apply(cc, r([ "[ORIGINAL_CC]" ], n));
};
cc.warn && (cc.warn = function() {
for (var t = [], i = 0; i < arguments.length; i++) t[i] = arguments[i];
e.handleCocosLog(t);
e._config.keepOriginalConsole && n.apply(cc, r([ "[ORIGINAL_CC]" ], t));
});
cc.error && (cc.error = function() {
for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
e.handleCocosLog(t);
e._config.keepOriginalConsole && i.apply(cc, r([ "[ORIGINAL_CC]" ], t));
});
}
};
e.prototype.handleCocosLog = function(e) {
if (!(this._isEmittingEvent || this._recursionCount >= this._maxRecursionDepth)) {
var t = this.formatConsoleArgs(e);
this.emitLogEvent(t);
}
};
e.prototype.formatConsoleArgs = function(e) {
return e.map(function(e) {
if ("string" == typeof e) return e;
if ("object" != typeof e) return String(e);
try {
return JSON.stringify(e, null, 2);
} catch (e) {
return "[Object]";
}
}).join(" ");
};
e.prototype.createLogData = function(e) {
var t = new Date(), n = "[" + t.getFullYear() + "-" + (t.getMonth() + 1).toString().padStart(2, "0") + "-" + t.getDate().toString().padStart(2, "0") + " " + t.getHours().toString().padStart(2, "0") + ":" + t.getMinutes().toString().padStart(2, "0") + ":" + t.getSeconds().toString().padStart(2, "0") + "." + t.getMilliseconds().toString().padStart(3, "0") + "] " + e;
n.length > this._config.maxMessageLength && (n = n.substring(0, this._config.maxMessageLength) + "...");
return n;
};
e.prototype.emitLogEvent = function(e, t) {
void 0 === t && (t = 0);
if (!this._isEmittingEvent && this.logReportCallback) try {
this._isEmittingEvent = !0;
this._recursionCount++;
var n = this.createLogData(e), i = 1 === t;
this.logReportCallback(n, i);
} catch (e) {
this._originalConsole.error("[HSLogCollector] Error in emitLogEvent:", e);
} finally {
this._isEmittingEvent = !1;
this._recursionCount--;
}
};
e.prototype.updateConfig = function(e) {
this._config = i(i({}, this._config), e);
this._originalConsole.log("[HSLogCollector] Config updated:", this._config);
};
e.prototype.collectLog = function(e, t) {
void 0 === t && (t = 0);
this.emitLogEvent(e, t);
};
e.prototype.getConfig = function() {
return i({}, this._config);
};
e.prototype.isCollecting = function() {
return this._isCollecting;
};
e.prototype.destroy = function() {
this.stopCollecting();
e._instance === this && (e._instance = null);
this._originalConsole.log("[HSLogCollector] Instance destroyed");
};
e._instance = null;
return e;
}();
n.HSLogCollector = a;
cc._RF.pop();
}, {} ],
HSLogin: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "e40a2ehlH9No5m/rm01iJni", "HSLogin");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSLogin = void 0;
var i = function() {
function e() {}
e.onAppStart = function() {};
return e;
}();
n.HSLogin = i;
cc._RF.pop();
}, {} ],
HSMathUtils: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "21c65dmovFCK6GLax9DegJ1", "HSMathUtils");
var i = this && this.__read || function(e, t) {
var n = "function" == typeof Symbol && e[Symbol.iterator];
if (!n) return e;
var i, o, r = n.call(e), a = [];
try {
for (;(void 0 === t || t-- > 0) && !(i = r.next()).done; ) a.push(i.value);
} catch (e) {
o = {
error: e
};
} finally {
try {
i && !i.done && (n = r.return) && n.call(r);
} finally {
if (o) throw o.error;
}
}
return a;
}, o = this && this.__spread || function() {
for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(i(arguments[t]));
return e;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSMathUtils = void 0;
var r = function() {
function e(e) {
this.seed = e || Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}
e.prototype.random = function() {
this.seed = this.xorshift(this.seed);
return (this.seed >>> 0) / 4294967296;
};
e.prototype.randomInt = function(e, t) {
this.seed = this.xorshift(this.seed);
var n = t - e + 1, i = (this.seed >>> 0) / 4294967296;
return Math.floor(i * n) + e;
};
e.prototype.randomFloat = function(e, t) {
this.seed = this.xorshift(this.seed);
return (this.seed >>> 0) / 4294967296 * (t - e) + e;
};
e.prototype.xorshift = function(e) {
e ^= e << 13;
return (e ^= e >>> 17) ^ e << 5;
};
return e;
}(), a = function() {
function e() {}
e.randomInt = function(e, t) {
return Math.floor(Math.random() * (t - e + 1)) + e;
};
e.randomSeed = function() {
return e._randomSeed.random();
};
e.setSeed = function(t) {
e._randomSeed.seed = t;
};
e.getSeed = function() {
return e._randomSeed.seed;
};
e.randomIntSeed = function(t, n) {
return e._randomSeed.randomInt(t, n);
};
e.randomFloat = function(e, t) {
return Math.random() * (t - e) + e;
};
e.randomWeight = function(t) {
for (var n = e._randomSeed.randomFloat(0, t.reduce(function(e, t) {
return e + t;
})), i = 0, o = 0, r = t.length; o < r; o++) if (n < (i += t[o])) return o;
return 0;
};
e.getRandomItemByWeight = function(e, t) {
if (0 === e.length) return null;
for (var n = e.reduce(function(e, n) {
return e + n[t];
}, 0), i = Math.random() * n, o = 0, r = 0, a = e.length; r < a; r++) if (i <= (o += e[r][t])) return e[r];
};
e.weightedRandomArray = function(e) {
for (var t = [], n = Array.from({
length: e.length
}, function(e, t) {
return t;
}); n.length > 0; ) {
for (var i = n.map(function(t) {
return e[t];
}), o = i.reduce(function(e, t) {
return e + t;
}, 0), r = Math.random() * o, a = 0, s = null, c = 0; c < n.length; c++) if (r <= (a += i[c])) {
s = n[c];
break;
}
t.push(s);
n.splice(n.indexOf(s), 1);
}
return t;
};
e.randomFloatSeed = function(t, n) {
return e._randomSeed.randomFloat(t, n);
};
e.randomList = function(t) {
return t && 0 !== t.length ? t[e.randomInt(0, t.length - 1)] : null;
};
e.shuffleAry = function(e, t) {
var n;
void 0 === t && (t = e.length);
var r = o(e), a = r.length;
t = Math.min(t, a);
for (var s = a - 1; s > a - 1 - t; s--) {
var c = Math.floor(Math.random() * (s + 1));
n = i([ r[c], r[s] ], 2), r[s] = n[0], r[c] = n[1];
}
return r.slice(a - t);
};
e.randomListSeed = function(t) {
return t && 0 !== t.length ? t[e.randomIntSeed(0, t.length - 1)] : null;
};
e.getDistance = function(e, t) {
var n = Math.abs(t.x - e.x), i = Math.abs(t.y - e.y);
return Math.sqrt(n * n + i * i);
};
e.shuffle = function(e) {
for (var t, n, i = e.length; 0 !== i; ) {
n = Math.floor(Math.random() * i);
t = e[i -= 1];
e[i] = e[n];
e[n] = t;
}
return e;
};
e.deg2rad = function(e) {
return e * (Math.PI / 180);
};
e.rad2deg = function(e) {
return e * (180 / Math.PI);
};
e.rgb2hsl = function(e, t, n) {
var i, o = e / 255, r = t / 255, a = n / 255, s = Math.max(o, r, a), c = Math.min(o, r, a), l = (s + c) / 2, u = s - c;
i = 0 === u ? 0 : o === s ? (r - a) / u : r === s ? 2 + (a - o) / u : 4 + (o - r) / u;
(i *= 60) < 0 && (i += 360);
return [ i, s === c ? 0 : l <= .5 ? (s - c) / (s + c) : (s - c) / (2 - s - c), l ];
};
e.hsl2rgb = function(e, t, n) {
var i, o, r, a = (1 - Math.abs(2 * n - 1)) * t, s = e / 60, c = a * (1 - Math.abs(s % 2 - 1));
if (s < 1) {
i = a;
o = c;
r = 0;
} else if (s < 2) {
i = c;
o = a;
r = 0;
} else if (s < 3) {
i = 0;
o = a;
r = c;
} else if (s < 4) {
i = 0;
o = c;
r = a;
} else if (s < 5) {
i = c;
o = 0;
r = a;
} else {
i = a;
o = 0;
r = c;
}
var l = n - a / 2;
return [ i = Math.round(255 * (i + l)), o = Math.round(255 * (o + l)), r = Math.round(255 * (r + l)) ];
};
e.limit = function(e, t, n) {
return Math.min(n, Math.max(t, e));
};
e.removeFromArr = function(e, t) {
var n = e.indexOf(t);
-1 !== n && e.splice(n, 1);
};
e.calculateAngle = function(e, t) {
var n = t.x - e.x, i = t.y - e.y;
return (Math.atan2(i, n) * (180 / Math.PI) + 360) % 360 - 90;
};
e.getEasingFunction = function(e, t) {
return function(n) {
if (n <= 0) return 0;
if (n >= 1) return 1;
for (var i = n; ;) {
var o = 3 * (1 - i) * (1 - i) * (e.x - 0) + 6 * (1 - i) * i * (t.x - e.x) + 3 * i * i * (1 - t.x);
i -= o / (6 * (1 - i) * (e.x - 2 * t.x + 1) + 6 * i * (t.x - 1));
if (Math.abs(o) < 1e-5) break;
}
return (1 - i) * (1 - i) * 0 + 2 * (1 - i) * i * e.y + i * i * t.y;
};
};
e.generateUniqueId = function() {
return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};
e.getLast = function(e) {
if (e && 0 !== e.length) return e[e.length - 1];
};
e.validateNumer = function(e, t, n, i, o) {
return null == t || isNaN(t) || !isFinite(t) ? o : t < n ? n : t > i ? i : t;
};
e._randomSeed = new r();
return e;
}();
n.HSMathUtils = a;
cc._RF.pop();
}, {} ],
HSMiniResDefines: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "d525d9affNJYJFwGzktVBDp", "HSMiniResDefines");
var i = this && this.__read || function(e, t) {
var n = "function" == typeof Symbol && e[Symbol.iterator];
if (!n) return e;
var i, o, r = n.call(e), a = [];
try {
for (;(void 0 === t || t-- > 0) && !(i = r.next()).done; ) a.push(i.value);
} catch (e) {
o = {
error: e
};
} finally {
try {
i && !i.done && (n = r.return) && n.call(r);
} finally {
if (o) throw o.error;
}
}
return a;
}, o = this && this.__spread || function() {
for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(i(arguments[t]));
return e;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.SAND_RES_WHITE_LIST = n.BLK_FILE_DATA_LIST = n.MiniScoreTipResName = n.MiniStageResName = n.MiniOverResName = n.MiniMainResName = n.MiniReviveResName = n.MiniSettingResName = n.MiniCommonResName = void 0;
n.MiniCommonResName = {
COMMON_BG_DOWN: "sand_common_bg_down",
COMMON_BG_UP: "sand_common_bg_up",
COMMON_BTN_CLOSE: "sand_common_btn_close",
COMMON_NUM_FONT: "sand_common_num_font",
COMMON_NUM_SPECIAL_FONT: "sand_common_num_special_font",
COMBO_TEXTURE: "sand_common_combo_texture"
};
n.MiniSettingResName = {
SETTING_PREFAB: "res/prefabs/UI/setting",
BTN_BGM: "sand_setting_btn_BGM",
BTN_COMMON: "sand_setting_btn_common",
BTN_SOUND: "sand_setting_btn_sound",
BTN_VIBRATION: "sand_setting_btn_vibration",
BTN_OFF: "sand_setting_btn_off",
ICON_HOME: "sand_setting_icon_home",
ICON_MORE_SETTINGS: "sand_setting_icon_moreSettings",
ICON_REPLAY: "sand_setting_icon_replay",
TXT_HOME: "sand_setting_txt_home",
TXT_MORE_SETTINGS: "sand_setting_txt_moreSettings",
TXT_REPLAY: "sand_setting_txt_replay",
TXT_TITLE: "sand_setting_txt_title",
BG_LINE: "sand_setting_bg_line"
};
n.MiniReviveResName = {
REVIVE_PREFAB: "res/prefabs/UI/reviveUI",
PROGRESS_BG: "sand_revive_progress_bg",
PROGRESS_BAR: "sand_revive_progress_bar",
DRAGONBONES_BTN_SKE: "sand_revive_dragonbones_btn_ske",
DRAGONBONES_BTN_TEX: "sand_revive_dragonbones_btn_tex",
DRAGONBONES_NUM_SKE: "sand_revive_dragonbones_num_ske",
DRAGONBONES_NUM_TEX: "sand_revive_dragonbones_num_tex"
};
n.MiniMainResName = {
TOP_LAYER_PREFAB: "res/prefabs/mainItems/topLayer",
COMBO_ADD_SCORE_PREFAB: "pixel/score/comboAddScore",
COMBO_ADD_SCORE_TOTAL_PREFAB: "pixel/score/comboAddScoreTotal",
TUTORIAL_PREFAB: "pixel/Tutorial/TutorialUI",
HIGH_SCORE_ICON: "sand_main_high_score_icon",
HIGH_SCORE_FONT: "sand_main_high_score_font",
SCORE_FONT: "sand_main_score_font",
SETTING: "sand_main_setting",
COMBO_SCORE_TIP_FONT: "sand_main_combo_score_tip_font"
};
n.MiniOverResName = {
OVER_LOSE_PREFAB: "res/prefabs/UI/overUI",
OVER_WIN_PREFAB: "res/prefabs/UI/overUIBest",
LOSE_TITLE: "sand_over_lose_title",
LOSE_CURR_SCORE_ICON: "sand_over_lose_curr_score_icon",
LOSE_BEST_SCORE_ICON: "sand_over_lose_best_score_icon",
CURRENT_SCORE_FONT: "sand_over_lose_current_score_font",
LOSE_BEST_SCORE_FONT: "sand_over_lose_best_score_font",
LOSE_REPLAY_BTN: "sand_over_lose_replay_btn",
WIN_REPLAY_BTN: "sand_over_win_replay_btn",
WIN_DRAGONBONES_SKE: "sand_over_win_dragonbones_ske",
WIN_DRAGONBONES_TEX: "sand_over_win_dragonbones_tex"
};
n.MiniStageResName = {
STAGE_GOAL_PREFAB: "res/prefabs/UI/levelup/SandLevelUp",
NEXT_LEVEL_BTN: "sand_stage_goal_next_level_btn"
};
n.MiniScoreTipResName = {
SCORE_TIP_PREFAB: "res/prefabs/woodskin/scoreTip"
};
n.BLK_FILE_DATA_LIST = [ {
name: "e_score_streak_1",
miniPath: "blk/resources/audios/e_score_streak_1",
blkPath: "audios/e_score_streak_1",
blkBundle: "resources"
}, {
name: "e_score_streak_2",
miniPath: "blk/resources/audios/e_score_streak_2",
blkPath: "audios/e_score_streak_2",
blkBundle: "resources"
}, {
name: "e_score_streak_3",
miniPath: "blk/resources/audios/e_score_streak_3",
blkPath: "audios/e_score_streak_3",
blkBundle: "resources"
}, {
name: "e_score_streak_4",
miniPath: "blk/resources/audios/e_score_streak_4",
blkPath: "audios/e_score_streak_4",
blkBundle: "resources"
}, {
name: "e_score_streak_5",
miniPath: "blk/resources/audios/e_score_streak_5",
blkPath: "audios/e_score_streak_5",
blkBundle: "resources"
}, {
name: "e_score_streak_6",
miniPath: "blk/resources/audios/e_score_streak_6",
blkPath: "audios/e_score_streak_6",
blkBundle: "resources"
}, {
name: "e_score_streak_7",
miniPath: "blk/resources/audios/e_score_streak_7",
blkPath: "audios/e_score_streak_7",
blkBundle: "resources"
}, {
name: "e_score_streak_8",
miniPath: "blk/resources/audios/e_score_streak_8",
blkPath: "audios/e_score_streak_8",
blkBundle: "resources"
}, {
name: "e_score_streak_9",
miniPath: "blk/resources/audios/e_score_streak_9",
blkPath: "audios/e_score_streak_9",
blkBundle: "resources"
}, {
name: "e_score_streak_10",
miniPath: "blk/resources/audios/e_score_streak_10",
blkPath: "audios/e_score_streak_10",
blkBundle: "resources"
}, {
name: "amazing",
miniPath: "blk/resources/audios/Amazing2",
blkPath: "audios/Amazing2",
blkBundle: "resources"
}, {
name: "good",
miniPath: "blk/resources/audios/Good2",
blkPath: "audios/Good2",
blkBundle: "resources"
}, {
name: "great",
miniPath: "blk/resources/audios/Great2",
blkPath: "audios/Great2",
blkBundle: "resources"
}, {
name: "excellent",
miniPath: "blk/resources/audios/Excellect2",
blkPath: "audios/Excellect2",
blkBundle: "resources"
}, {
name: "unbelievable",
miniPath: "blk/resources/audios/Unbelievable2",
blkPath: "audios/Unbelievable2",
blkBundle: "resources"
}, {
name: "s_button",
miniPath: "blk/resources/audios/s_button",
blkPath: "audios/s_button",
blkBundle: "resources"
}, {
name: "bgm",
miniPath: "blk/resources/audios/bgm/commonBgm",
blkPath: "audios/bgm/commonBgm",
blkBundle: "resources"
}, {
name: "sand_fail",
miniPath: "blk/resources/audios/over/s_fail",
blkPath: "audios/over/s_fail",
blkBundle: "resources"
}, {
name: "blk/class/dragonbones/combo/comb_ske",
miniPath: "",
blkPath: "dragonbones/combo/comb_ske",
blkBundle: "class"
}, {
name: "blk/class/dragonbones/combo/comb_tex",
miniPath: "",
blkPath: "dragonbones/combo/comb_tex",
blkBundle: "class"
}, {
name: "blk/class/fonts/combo/combo_fnt",
miniPath: "",
blkPath: "fonts/combo/combo_fnt",
blkBundle: "class"
}, {
name: "blk/resources/dragonbones/encourage/encourage_ske",
miniPath: "",
blkPath: "dragonbones/encourage/encourage_ske",
blkBundle: "resources"
}, {
name: "blk/resources/dragonbones/encourage/encourage_tex",
miniPath: "",
blkPath: "dragonbones/encourage/encourage_tex",
blkBundle: "resources"
}, {
name: "blk/class/textures/combo/combo_txt",
miniPath: "",
blkPath: "textures/combo/combo_txt",
blkBundle: "class"
}, {
name: n.MiniCommonResName.COMMON_BG_DOWN,
miniPath: "blk/resources/textures/commentskin/common_bg_setting_down",
blkPath: "textures/commentskin/common_bg_setting_down",
blkBundle: "resources"
}, {
name: n.MiniCommonResName.COMMON_BG_UP,
miniPath: "blk/resources/textures/commentskin/common_bg_setting_up",
blkPath: "textures/commentskin/common_bg_setting_up",
blkBundle: "resources"
}, {
name: n.MiniCommonResName.COMMON_BTN_CLOSE,
miniPath: "blk/resources/textures/commentskin/common_btn_close",
blkPath: "textures/commentskin/common_btn_close",
blkBundle: "resources"
}, {
name: n.MiniCommonResName.COMBO_TEXTURE,
miniPath: "blk/class/textures/combo/combo_txt",
blkPath: "textures/combo/combo_txt",
blkBundle: "class"
}, {
name: n.MiniSettingResName.BTN_BGM,
miniPath: "blk/resources/textures/setup/setting_btn_BGM",
blkPath: "textures/setup/setting_btn_BGM",
blkBundle: "resources"
}, {
name: n.MiniSettingResName.BTN_COMMON,
miniPath: "blk/resources/textures/setup/setting_btn_common",
blkPath: "textures/setup/setting_btn_common",
blkBundle: "resources"
}, {
name: n.MiniSettingResName.BTN_SOUND,
miniPath: "blk/resources/textures/setup/setting_btn_sound",
blkPath: "textures/setup/setting_btn_sound",
blkBundle: "resources"
}, {
name: n.MiniSettingResName.BTN_VIBRATION,
miniPath: "blk/resources/textures/setup/setting_btn_vibration",
blkPath: "textures/setup/setting_btn_vibration",
blkBundle: "resources"
}, {
name: n.MiniSettingResName.ICON_HOME,
miniPath: "blk/resources/textures/setup/setting_icon_home",
blkPath: "textures/setup/setting_icon_home",
blkBundle: "resources"
}, {
name: n.MiniSettingResName.ICON_MORE_SETTINGS,
miniPath: "blk/resources/textures/setup/setting_icon_moreSettings",
blkPath: "textures/setup/setting_icon_moreSettings",
blkBundle: "resources"
}, {
name: n.MiniSettingResName.ICON_REPLAY,
miniPath: "blk/resources/textures/setup/setting_icon_replay",
blkPath: "textures/setup/setting_icon_replay",
blkBundle: "resources"
}, {
name: n.MiniSettingResName.TXT_HOME,
miniPath: "blk/resources/textures/setup/setting_txt_home",
blkPath: "textures/setup/setting_txt_home",
blkBundle: "resources"
}, {
name: n.MiniSettingResName.TXT_MORE_SETTINGS,
miniPath: "blk/resources/textures/setup/setting_txt_moreSettings",
blkPath: "textures/setup/setting_txt_moreSettings",
blkBundle: "resources"
}, {
name: n.MiniSettingResName.TXT_REPLAY,
miniPath: "blk/resources/textures/setup/setting_txt_replay",
blkPath: "textures/setup/setting_txt_replay",
blkBundle: "resources"
}, {
name: n.MiniReviveResName.PROGRESS_BG,
miniPath: "blk/resources/textures/revive/die_quan_bg",
blkPath: "textures/revive/die_quan_bg",
blkBundle: "resources"
}, {
name: n.MiniReviveResName.PROGRESS_BAR,
miniPath: "blk/resources/textures/revive/die_quan",
blkPath: "textures/revive/die_quan",
blkBundle: "resources"
}, {
name: n.MiniReviveResName.DRAGONBONES_BTN_SKE,
miniPath: "blk/resources/dragonbones/revive/btn/shipinbt_ske",
blkPath: "dragonbones/revive/btn/shipinbt_ske",
blkBundle: "resources"
}, {
name: n.MiniReviveResName.DRAGONBONES_BTN_TEX,
miniPath: "blk/resources/dragonbones/revive/btn/shipinbt_tex",
blkPath: "dragonbones/revive/btn/shipinbt_tex",
blkBundle: "resources"
}, {
name: n.MiniReviveResName.DRAGONBONES_NUM_SKE,
miniPath: "blk/resources/dragonbones/revive/num/fuhuoshuzi_ske",
blkPath: "dragonbones/revive/num/fuhuoshuzi_ske",
blkBundle: "resources"
}, {
name: n.MiniReviveResName.DRAGONBONES_NUM_TEX,
miniPath: "blk/resources/dragonbones/revive/num/fuhuoshuzi_tex",
blkPath: "dragonbones/revive/num/fuhuoshuzi_tex",
blkBundle: "resources"
}, {
name: n.MiniMainResName.HIGH_SCORE_ICON,
miniPath: "blk/class/textures/topInfo/backgroundscore_highest3",
blkPath: "textures/topInfo/backgroundscore_highest3",
blkBundle: "class"
}, {
name: n.MiniMainResName.HIGH_SCORE_FONT,
miniPath: "blk/resources/fonts/goal/typefacehigh",
blkPath: "fonts/goal/typefacehigh",
blkBundle: "resources"
}, {
name: n.MiniMainResName.SCORE_FONT,
miniPath: "blk/resources/fonts/skin/score/typefacecurrent",
blkPath: "fonts/skin/score/typefacecurrent",
blkBundle: "resources"
}, {
name: n.MiniCommonResName.COMMON_NUM_FONT,
miniPath: "blk/resources/fonts/commonFont/common_num_normal",
blkPath: "fonts/commonFont/common_num_normal",
blkBundle: "resources"
}, {
name: n.MiniCommonResName.COMMON_NUM_SPECIAL_FONT,
miniPath: "blk/resources/fonts/commonFont/common_num_special",
blkPath: "fonts/commonFont/common_num_special",
blkBundle: "resources"
}, {
name: n.MiniMainResName.COMBO_SCORE_TIP_FONT,
miniPath: "blk/resources/fonts/comboScoreTip/scoreTip1",
blkPath: "fonts/comboScoreTip/scoreTip1",
blkBundle: "resources"
}, {
name: n.MiniOverResName.LOSE_TITLE,
miniPath: "blk/resources/textures/gameOver/overview_name",
blkPath: "textures/gameOver/overview_name",
blkBundle: "resources"
}, {
name: n.MiniOverResName.LOSE_CURR_SCORE_ICON,
miniPath: "blk/resources/textures/gameOver/overview_score",
blkPath: "textures/gameOver/overview_score",
blkBundle: "resources"
}, {
name: n.MiniOverResName.LOSE_BEST_SCORE_ICON,
miniPath: "blk/class/textures/fail/overview_title_s",
blkPath: "textures/fail/overview_title_s",
blkBundle: "class"
}, {
name: n.MiniOverResName.CURRENT_SCORE_FONT,
miniPath: "blk/resources/fonts/gameOver/typefaceover1",
blkPath: "fonts/gameOver/typefaceover1",
blkBundle: "resources"
}, {
name: n.MiniOverResName.LOSE_BEST_SCORE_FONT,
miniPath: "blk/resources/fonts/goal/typefacehigh",
blkPath: "fonts/goal/typefacehigh",
blkBundle: "resources"
}, {
name: n.MiniOverResName.LOSE_REPLAY_BTN,
miniPath: "blk/class/textures/fail/overview_lose_btn",
blkPath: "textures/fail/overview_lose_btn",
blkBundle: "class"
}, {
name: n.MiniOverResName.WIN_REPLAY_BTN,
miniPath: "blk/class/textures/win/btn_winPlay",
blkPath: "textures/win/btn_winPlay",
blkBundle: "class"
}, {
name: n.MiniOverResName.WIN_DRAGONBONES_SKE,
miniPath: "blk/class/dragonbones/win/NewProject_ske",
blkPath: "dragonbones/win/NewProject_ske",
blkBundle: "class"
}, {
name: n.MiniOverResName.WIN_DRAGONBONES_TEX,
miniPath: "blk/class/dragonbones/win/NewProject_tex",
blkPath: "dragonbones/win/NewProject_tex",
blkBundle: "class"
}, {
name: n.MiniStageResName.NEXT_LEVEL_BTN,
miniPath: "blk/chapter/textures/win/btn_NextLevel",
blkPath: "textures/win/btn_NextLevel",
blkBundle: "chapter"
}, {
name: "res/json/sandalgo",
miniPath: "new/json/sandalgo"
}, {
name: "res/json/scorerate",
miniPath: "new/json/scorerate"
}, {
name: "res/json/triggeralgo",
miniPath: "new/json/triggeralgo"
}, {
name: n.MiniMainResName.SETTING,
miniPath: "new/texture/backgroundstop"
}, {
name: n.MiniSettingResName.BTN_OFF,
miniPath: "new/texture/setting_btn_off"
}, {
name: n.MiniSettingResName.BG_LINE,
miniPath: "new/texture/setting_bg_line"
}, {
name: n.MiniSettingResName.TXT_TITLE,
miniPath: "new/texture/setting_txt_title"
}, {
name: n.MiniMainResName.TUTORIAL_PREFAB,
miniPath: "new/prefabs/MiniTutorialUI"
}, {
name: n.MiniSettingResName.SETTING_PREFAB,
miniPath: "new/prefabs/Setting"
}, {
name: n.MiniReviveResName.REVIVE_PREFAB,
miniPath: "new/prefabs/Revive"
}, {
name: n.MiniOverResName.OVER_LOSE_PREFAB,
miniPath: "new/prefabs/GameOverLose"
}, {
name: n.MiniOverResName.OVER_WIN_PREFAB,
miniPath: "new/prefabs/GameOverWin"
}, {
name: n.MiniMainResName.TOP_LAYER_PREFAB,
miniPath: "new/prefabs/TopLayer"
}, {
name: n.MiniMainResName.COMBO_ADD_SCORE_PREFAB,
miniPath: "new/prefabs/ComboAddScore"
}, {
name: n.MiniMainResName.COMBO_ADD_SCORE_TOTAL_PREFAB,
miniPath: "new/prefabs/ComboAddScoreTotal"
}, {
name: n.MiniStageResName.STAGE_GOAL_PREFAB,
miniPath: "new/prefabs/SandLevelUp"
}, {
name: n.MiniScoreTipResName.SCORE_TIP_PREFAB,
miniPath: "new/prefabs/ScoreTip"
} ];
function r(e) {
return e.map(function(e) {
return e.split(".")[0];
});
}
var a = r([ "sandcrush/scenes/start.fire", "sandcrush/scenes/sand.fire", "sand_prefab/res/prefabs/MainUI.prefab", "sand_prefab/res/prefabs/mainItems/boxLayer.prefab", "sand_prefab/res/prefabs/woodskin/waitAd.prefab", "sand_prefab/res/prefabs/UI/redlight.prefab", "sand_prefab/pixel/Tutorial/TutorialHand.prefab", "sand_prefab/res/ideas/allClear/texture/imgRainbow.png", "sandcrush/res/textures/scoreLevelup/gameplay_img_progressUp_xs.png", "sandcrush/res/textures/scoreLevelup/gameplay_img_progressLeft_xs.png", "sandcrush/res/textures/scoreLevelup/gameplay_img_progressDown_xs.png", "sandcrush/res/font/num_bonusPoints_xs.fnt", "sandcrush/res/font/num_bonusPoints_xs.png", "sandcrush/res/textures/tutorial/gameplay_img_hand.png", "sandcrush/res/spine/scoreLevelUp/pixel_sandCrush_gameplay_progressBar_goal_efx.json", "sandcrush/res/spine/scoreLevelUp/pixel_sandCrush_gameplay_progressBar_goal_efx.png", "sandcrush/res/spine/scoreLevelUp/pixel_sandCrush_gameplay_progressBar_goal_efx.atlas", "sandcrush/res/spine/scoreLevelUp/pixel_sandCrush_gameplay_progressBar_efx.json", "sandcrush/res/spine/scoreLevelUp/pixel_sandCrush_gameplay_progressBar_efx.png", "sandcrush/res/spine/scoreLevelUp/pixel_sandCrush_gameplay_progressBar_efx.atlas", "sandcrush/res/textures/scoreLevelUp/gameplay_img_progressSlowxs.png", "sandcrush/res/textures/scoreLevelup/tips_cube_blue_xs.png", "sandcrush/res/textures/scoreLevelup/tips_cube_green_xs.png", "sandcrush/res/textures/scoreLevelup/tips_cube_indigo_xs.png", "sandcrush/res/textures/scoreLevelup/tips_cube_pink_xs.png", "sandcrush/res/textures/scoreLevelup/tips_cube_red_xs.png", "sandcrush/res/textures/scoreLevelup/tips_cube_white_xs.png", "sandcrush/res/textures/scoreLevelup/tips_cube_violet_xs.png", "sandcrush/res/textures/scoreLevelup/tips_cube_yellow_xs.png", "sandcrush/res/textures/scoreLevelup/tips_cube_orange_xs.png", "sandcrush/res/textures/scoreLevelup/tips_img_arrowBG_xs.png", "sand_audio/bb/sand_pour.mp3", "sand_audio/bb/sand_put.mp3", "sand_audio/s_touch.mp3", "sand_audio/number2.mp3", "sand_audio/clock_pop.mp3", "sand_audio/count.mp3", "sand_audio/revive.mp3", "sandcrush/res/mtls/gradient.effect", "sandcrush/res/mtls/gradient_blue_mid.mtl", "sandcrush/res/mtls/gradient_blue.mtl", "sandcrush/res/mtls/gradient_purple.mtl", "sandcrush/res/mtls/white.png", "sandcrush/res/tile/sandtile.mtl", "sandcrush/res/tile/sandtile.effect", "sandcrush/res/tile/sandtileDeath.effect", "sandcrush/res/tile/sandtileDeath.mtl", "sandcrush/res/tile/sandtileEffect.effect", "sandcrush/res/tile/sandtileEffect.mtl", "sandcrush/res/tile/sandtileSimple.effect", "sandcrush/res/tile/sandtileSimple.mtl", "sandcrush/res/tile/colorTexturePixel1opt.png", "sandcrush/res/tile/sandtileEffectRainbow.effect", "sandcrush/res/tile/sandtileEffectRainbow.mtl", "sandcrush/res/tile/colorTexturePixel.png", "sandcrush/res/textures/loading/Loading.png", "sandcrush/res/textures/mianui/gameplay_img_chessboard.png", "sandcrush/res/textures/mianui/gameplay_img_chessboardDown.png", "sandcrush/res/textures/mianui/gameplay_img_cordon_xs.png", "sandcrush/res/textures/woodskin/common/ads_icon.png", "sandcrush/res/textures/woodskin/common/Take_a_break.png", "sandcrush/res/textures/redlight/redlight.png", "sandcrush/res/json/blockattr.json", "sandcrush/res/json/constant.json", "sandcrush/res/json/algotype.json", "sandcrush/res/font/SPARTAN-BOLD.TTF", "sandcrush/ad/Txt_Conitnue_EN.png", "sandcrush/ad/txt_Loading_EN.png", "sandcrush/ad/AdMask.prefab" ]), s = r([ "sand_audio/sand_pour.mp3", "sand_audio/sand_put.mp3" ]), c = r([ "sandcrush/ad/bannertest.prefab", "sandcrush/ad/adtest.prefab", "sandgm/GmView.prefab", "sandcrush/res/json/sandboard1.json" ]);
n.SAND_RES_WHITE_LIST = o(a, s, c);
cc._RF.pop();
}, {} ],
HSMiniResManager: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "9a040UQ5OVEhaqG9/eiRhlV", "HSMiniResManager");
var i = this && this.__values || function(e) {
var t = "function" == typeof Symbol && Symbol.iterator, n = t && e[t], i = 0;
if (n) return n.call(e);
if (e && "number" == typeof e.length) return {
next: function() {
e && i >= e.length && (e = void 0);
return {
value: e && e[i++],
done: !e
};
}
};
throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSMiniResManager = void 0;
var o = e("../hsApp"), r = e("./HSMiniResDefines"), a = function() {
function e() {}
Object.defineProperty(e, "instance", {
get: function() {
this._instance || (this._instance = new e());
return this._instance;
},
enumerable: !1,
configurable: !0
});
e.init = function() {
var e, t;
this._fileMap = new Map();
try {
for (var n = i(r.BLK_FILE_DATA_LIST), a = n.next(); !a.done; a = n.next()) {
var s = a.value, c = void 0, l = void 0;
if (o.hsApp.isBlkGame()) {
c = s.name;
if (s.blkPath) {
c = s.blkPath;
l = s.blkBundle;
} else {
c = s.miniPath || s.name;
l = this.MINI_BUNDLE_NAME;
}
} else {
c = s.miniPath || s.name;
l = this.MINI_BUNDLE_NAME;
}
this._fileMap.set(s.name, {
path: c,
bundle: l
});
}
} catch (t) {
e = {
error: t
};
} finally {
try {
a && !a.done && (t = n.return) && t.call(n);
} finally {
if (e) throw e.error;
}
}
};
e.isMiniResVersion = function() {
return o.hsApp.isMiniResVersion();
};
e.getMiniPath = function(e) {
var t;
return (null === (t = this._fileMap.get(e)) || void 0 === t ? void 0 : t.path) || e;
};
e.getMiniBundle = function(e, t) {
var n;
return (null === (n = this._fileMap.get(e)) || void 0 === n ? void 0 : n.bundle) || t || this.MINI_BUNDLE_NAME;
};
e.hasMapping = function(e) {
return this._fileMap.has(e);
};
e.getResolvedPathAndBundle = function(e, t) {
var n = this._fileMap.get(e);
return n ? {
path: n.path,
bundle: n.bundle
} : {
path: e,
bundle: t || this.MINI_BUNDLE_NAME
};
};
e.isWhiteList = function(e) {
return r.SAND_RES_WHITE_LIST.includes(e);
};
e._instance = null;
e.MINI_BUNDLE_NAME = "sand_mini";
e._fileMap = new Map([]);
return e;
}();
n.HSMiniResManager = a;
cc._RF.pop();
}, {
"../hsApp": "hsApp",
"./HSMiniResDefines": "HSMiniResDefines"
} ],
HSNodePool: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "72d32gxVvtIr6euMO+MEm0l", "HSNodePool");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSNodePool = void 0;
var i = function() {
function e() {
this.pool = new Map();
this.prefabs = new Map();
this.poolDetail = {};
this.poolCount = {};
}
Object.defineProperty(e, "ins", {
get: function() {
null === e._inst && (e._inst = new this());
return e._inst;
},
enumerable: !1,
configurable: !0
});
e.prototype.getNode = function(e) {
var t = null;
this.pool.has(e) || this.pool.set(e, []);
if (!(t = this.pool.get(e).shift()) || !cc.isValid(t, !0)) {
if (!this.prefabs.has(e)) return null;
t = cc.instantiate(this.prefabs.get(e));
}
if (t && !t.static_key && (t.parent || !cc.isValid(t, !0))) return this.getNode(e);
t.scale = 1;
t.opacity = 255;
t.x = 0;
t.y = 0;
t.angle = 0;
t.active = !0;
t.recycle_key = e;
return t;
};
e.prototype.recycleAllChildren = function(t) {
if (t) for (var n = t.length - 1; n >= 0; n--) e.ins.recycle(t[n]);
};
e.prototype.recycle = function(e) {
e.static_key ? e.active = !1 : e.removeFromParent();
cc.isValid(e, !0) && (void 0 !== e.recycle_key ? this.pool.get(e.recycle_key).includes(e) || this.pool.get(e.recycle_key).push(e) : e.destroy());
};
e.prototype.initNodePool = function(e, t, n, i) {
void 0 === n && (n = 8);
void 0 === i && (i = null);
if (!this.pool.has(e) || i) {
for (var o = [], r = 0; r < n; r++) {
var a = cc.instantiate(t);
a.recycle_key = e;
o.push(a);
if (i) {
a.opacity = 0;
i.addChild(a);
a.static_key = !0;
}
}
this.prefabs.set(e, t);
this.pool.set(e, o);
}
};
e.prototype.onDestroy = function() {
this.pool.forEach(function(e) {
e.forEach(function(e) {
e.destroy();
});
});
this.pool.clear();
this.prefabs.clear();
};
e._inst = null;
return e;
}();
n.HSNodePool = i;
cc._RF.pop();
}, {} ],
HSObjectUtils: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "768205WuDxGFqgEVn6I3ZZG", "HSObjectUtils");
var i = this && this.__assign || function() {
return (i = Object.assign || function(e) {
for (var t, n = 1, i = arguments.length; n < i; n++) {
t = arguments[n];
for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
}
return e;
}).apply(this, arguments);
}, o = this && this.__read || function(e, t) {
var n = "function" == typeof Symbol && e[Symbol.iterator];
if (!n) return e;
var i, o, r = n.call(e), a = [];
try {
for (;(void 0 === t || t-- > 0) && !(i = r.next()).done; ) a.push(i.value);
} catch (e) {
o = {
error: e
};
} finally {
try {
i && !i.done && (n = r.return) && n.call(r);
} finally {
if (o) throw o.error;
}
}
return a;
}, r = this && this.__spread || function() {
for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(o(arguments[t]));
return e;
}, a = this && this.__values || function(e) {
var t = "function" == typeof Symbol && Symbol.iterator, n = t && e[t], i = 0;
if (n) return n.call(e);
if (e && "number" == typeof e.length) return {
next: function() {
e && i >= e.length && (e = void 0);
return {
value: e && e[i++],
done: !e
};
}
};
throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSObjectUtils = void 0;
var s = function() {
function e() {}
e.safeJSONParse = function(e) {
try {
return JSON.parse(e, function(e, t) {
return "object" == typeof t && null !== t && "Map" === t.datatype ? new Map(JSON.parse(t.value)) : t;
});
} catch (e) {
return null;
}
};
e.safeStringify = function(e) {
var t = this;
return JSON.stringify(e, function(e, n) {
return n instanceof cc.Node ? "CCNODE" : n instanceof cc.Component ? "CCComponent" : n instanceof Map ? {
datatype: "Map",
value: t.mapToJSON(n)
} : n;
});
};
e.mapToJSON = function(e) {
return JSON.stringify(Array.from(e.entries()));
};
e.deepCopy = function(t) {
if (null === t || "object" != typeof t) return t;
if (t instanceof Date) return new Date(t.getTime());
if (t instanceof Array) return t.map(function(t) {
return e.deepCopy(t);
});
if ("object" == typeof t) {
var n = {};
Object.keys(t).forEach(function(i) {
n[i] = e.deepCopy(t[i]);
});
return n;
}
return t;
};
e.shallowCopy = function(e) {
return null === e || "object" != typeof e ? e : e instanceof Array ? r(e) : i({}, e);
};
e.deepMerge = function(t) {
for (var n, i, o = [], a = 1; a < arguments.length; a++) o[a - 1] = arguments[a];
if (!o.length) return t;
var s = o.shift();
if (e.isObject(t) && e.isObject(s)) for (var c in s) if (e.isObject(s[c])) {
t[c] || Object.assign(t, ((n = {})[c] = {}, n));
e.deepMerge(t[c], s[c]);
} else Object.assign(t, ((i = {})[c] = s[c], i));
return e.deepMerge.apply(e, r([ t ], o));
};
e.isObject = function(e) {
return e && "object" == typeof e && !Array.isArray(e);
};
e.isEmpty = function(e) {
return null == e || (Array.isArray(e) ? 0 === e.length : "object" == typeof e && 0 === Object.keys(e).length);
};
e.get = function(e, t, n) {
var i, o, r = Array.isArray(t) ? t : t.split("."), s = e;
try {
for (var c = a(r), l = c.next(); !l.done; l = c.next()) {
var u = l.value;
if (null == s || "object" != typeof s) return n;
s = s[u];
}
} catch (e) {
i = {
error: e
};
} finally {
try {
l && !l.done && (o = c.return) && o.call(c);
} finally {
if (i) throw i.error;
}
}
return void 0 !== s ? s : n;
};
e.set = function(e, t, n) {
for (var i = Array.isArray(t) ? t : t.split("."), o = e, r = 0; r < i.length - 1; r++) {
var a = i[r];
a in o && "object" == typeof o[a] || (o[a] = {});
o = o[a];
}
o[i[i.length - 1]] = n;
};
e.isEqual = function(t, n) {
var i, o;
if (t === n) return !0;
if (null === t || null === n) return !1;
if (void 0 === t || void 0 === n) return !1;
if (typeof t != typeof n) return !1;
if ("object" != typeof t) return t === n;
if (Array.isArray(t) !== Array.isArray(n)) return !1;
var r = Object.keys(t), s = Object.keys(n);
if (r.length !== s.length) return !1;
try {
for (var c = a(r), l = c.next(); !l.done; l = c.next()) {
var u = l.value;
if (!s.includes(u)) return !1;
if (!e.isEqual(t[u], n[u])) return !1;
}
} catch (e) {
i = {
error: e
};
} finally {
try {
l && !l.done && (o = c.return) && o.call(c);
} finally {
if (i) throw i.error;
}
}
return !0;
};
e.pick = function(e, t) {
var n = {};
t.forEach(function(t) {
Object.prototype.hasOwnProperty.call(e, t) && (n[t] = e[t]);
});
return n;
};
e.omit = function(e, t) {
var n = i({}, e);
t.forEach(function(e) {
delete n[e];
});
return n;
};
e.toQueryString = function(e) {
var t = new URLSearchParams();
Object.keys(e).forEach(function(n) {
null !== e[n] && void 0 !== e[n] && t.append(n, String(e[n]));
});
return t.toString();
};
e.fromQueryString = function(e) {
var t = new URLSearchParams(e), n = {};
t.forEach(function(e, t) {
n[t] = e;
});
return n;
};
e.mergeObjects = function(e, t) {
return Object.assign({}, e, t);
};
return e;
}();
n.HSObjectUtils = s;
cc._RF.pop();
}, {} ],
HSPlanUtils: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "42c11ulWmJHXon2fCAbEGs9", "HSPlanUtils");
var i = this && this.__awaiter || function(e, t, n, i) {
return new (n || (n = Promise))(function(o, r) {
function a(e) {
try {
c(i.next(e));
} catch (e) {
r(e);
}
}
function s(e) {
try {
c(i.throw(e));
} catch (e) {
r(e);
}
}
function c(e) {
e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, s);
var t;
}
c((i = i.apply(e, t || [])).next());
});
}, o = this && this.__generator || function(e, t) {
var n, i, o, r, a = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
},
trys: [],
ops: []
};
return r = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function s(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(r) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 
0) : i.next) && !(o = o.call(i, r[1])).done) return o;
(i = 0, o) && (r = [ 2 & r[0], o.value ]);
switch (r[0]) {
case 0:
case 1:
o = r;
break;

case 4:
a.label++;
return {
value: r[1],
done: !1
};

case 5:
a.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(o = a.trys, o = o.length > 0 && o[o.length - 1]) && (6 === r[0] || 2 === r[0])) {
a = 0;
continue;
}
if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
a.label = r[1];
break;
}
if (6 === r[0] && a.label < o[1]) {
a.label = o[1];
o = r;
break;
}
if (o && a.label < o[2]) {
a.label = o[2];
a.ops.push(r);
break;
}
o[2] && a.ops.pop();
a.trys.pop();
continue;
}
r = t.call(e, a);
} catch (e) {
r = [ 6, e ];
i = 0;
} finally {
n = o = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSPlanUtils = void 0;
var r = e("../../hsApp"), a = e("../../utils/HSMathUtils"), s = {
backupPlan: 10001001,
bundleID: "com.wonderful.sandcrush.ios",
urlOnline: "https://abtest.wondtycoon.com/abtest/openapi/traffic",
urlDev: "http://106.75.65.198:7020/abtest/openapi/traffic",
secret: "9tM6$pL2!KqR5vD8XcZ*NfW3eH7jGnP",
projectId: "SandCrushIOS"
}, c = {
backupPlan: 20001001,
bundleID: "com.wonderful.sandcrush",
urlOnline: "https://abtest.wondtycoon.com/abtest/openapi/traffic",
urlDev: "http://106.75.65.198:7020/abtest/openapi/traffic",
secret: "7jR4#kY8$MnB3vF9XcZ*PdQ2wE5hGtL",
projectId: "SandCrushGP"
}, l = function() {
function e() {}
e.getCfg = function() {
return r.hsApp.isIos() ? s : c;
};
Object.defineProperty(e, "backupPlan", {
get: function() {
return this.getCfg().backupPlan;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e, "bundleID", {
get: function() {
return this.getCfg().bundleID;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e, "urlOnline", {
get: function() {
return this.getCfg().urlOnline;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e, "urlDev", {
get: function() {
return this.getCfg().urlDev;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e, "secret", {
get: function() {
return this.getCfg().secret;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e, "projectId", {
get: function() {
return this.getCfg().projectId;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e, "requestUrl", {
get: function() {
return this.urlOnline;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e, "traceID", {
get: function() {
return (Date.now() + a.HSMathUtils.randomInt(1, 1e5)).toString(16);
},
enumerable: !1,
configurable: !0
});
e.getSignedHeaders = function(e) {
var t = Date.now().toString(), n = this.traceID, i = r.hsApp.distinctId, o = r.hsApp.deviceId, a = this.bundleID, s = a + i + o + a + t + n + e + this.secret, c = CryptoJS.SHA1(s).toString(CryptoJS.enc.Hex);
return {
"Content-Type": "application/json",
"X-Trace-ID": n,
"X-App-ID": a,
"X-User-ID": i,
"X-Device-ID": o,
"X-Project-ID": this.projectId,
"X-Bundle-ID": a,
"X-Timestamp": t,
"X-Sign": c,
"X-Debug": 0
};
};
e.getLoginParam = function() {
var e;
return {
attributes: {
sdk_version: r.hsApp.appVersion,
country: null === (e = r.hsApp.deviceInfo) || void 0 === e ? void 0 : e.country,
install_time: r.hsApp.installTime
}
};
};
e.ReqDatas = function(e, t) {
var n = this.getLoginParam();
n.attributes.game_version = e;
var i = this.requestUrl, o = cc.loader.getXMLHttpRequest(), r = JSON.stringify(n);
o.open("POST", i, !0);
var a = this.getSignedHeaders(r);
for (var s in a) Object.prototype.hasOwnProperty.call(a, s) && o.setRequestHeader(s, a[s]);
o.onreadystatechange = function() {
if (4 === o.readyState) {
var e = o.responseText;
o.status >= 200 && o.status < 300 ? t(!0, e) : t(!1, e);
}
};
o.send(r);
};
e.POST = function(e, t, n) {
void 0 === t && (t = {});
var i = cc.loader.getXMLHttpRequest(), o = JSON.stringify(t);
i.open("POST", e, !0);
i.setRequestHeader("Content-Type", "application/json");
i.setRequestHeader("app_id", "SandCrush");
i.onreadystatechange = function() {
if (4 === i.readyState) {
var e = i.responseText;
i.status >= 200 && i.status < 300 ? n(!0, e, i.status) : n(!1, e, i.status);
}
};
i.timeout = 1e4;
i.onerror = function() {};
i.ontimeout = function() {
n(!1, null);
};
i.send(o);
};
e.pullWayNumConfig = function(e, t, n) {
return i(this, void 0, void 0, function() {
var i, r, a;
return o(this, function(o) {
switch (o.label) {
case 0:
i = e.split(":");
r = i[0].split(",");
a = {
platform: n || "GP",
game: "SandCrush",
solution_id_list: r
};
return [ 4, this.getSeverData(a, t) ];

case 1:
return [ 2, o.sent() ];
}
});
});
};
e.getSeverData = function(t, n) {
return new Promise(function(i) {
e.POST(n, t, function(e, t) {
if (e) {
var n = JSON.parse(t);
0 === n.code ? i(n.data) : i(null);
} else i(null);
});
});
};
return e;
}();
n.HSPlanUtils = l;
cc._RF.pop();
}, {
"../../hsApp": "hsApp",
"../../utils/HSMathUtils": "HSMathUtils"
} ],
HSPlan: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "94d3aPEbkdF5qp68Z8ex2dS", "HSPlan");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), r = this && this.__decorate || function(e, t, n, i) {
var o, r = arguments.length, a = r < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, i); else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (r < 3 ? o(a) : r > 3 ? o(t, n, a) : o(t, n)) || a);
return r > 3 && a && Object.defineProperty(t, n, a), a;
}, a = this && this.__awaiter || function(e, t, n, i) {
return new (n || (n = Promise))(function(o, r) {
function a(e) {
try {
c(i.next(e));
} catch (e) {
r(e);
}
}
function s(e) {
try {
c(i.throw(e));
} catch (e) {
r(e);
}
}
function c(e) {
e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, s);
var t;
}
c((i = i.apply(e, t || [])).next());
});
}, s = this && this.__generator || function(e, t) {
var n, i, o, r, a = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
},
trys: [],
ops: []
};
return r = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function s(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(r) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 
0) : i.next) && !(o = o.call(i, r[1])).done) return o;
(i = 0, o) && (r = [ 2 & r[0], o.value ]);
switch (r[0]) {
case 0:
case 1:
o = r;
break;

case 4:
a.label++;
return {
value: r[1],
done: !1
};

case 5:
a.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(o = a.trys, o = o.length > 0 && o[o.length - 1]) && (6 === r[0] || 2 === r[0])) {
a = 0;
continue;
}
if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
a.label = r[1];
break;
}
if (6 === r[0] && a.label < o[1]) {
a.label = o[1];
o = r;
break;
}
if (o && a.label < o[2]) {
a.label = o[2];
a.ops.push(r);
break;
}
o[2] && a.ops.pop();
a.trys.pop();
continue;
}
r = t.call(e, a);
} catch (e) {
r = [ 6, e ];
i = 0;
} finally {
n = o = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
var c, l = e("../../hsApp"), u = e("../../utils/HSDataBase"), d = e("../../utils/HSTimeUtils"), h = e("./HSPlanUtils"), p = e("./HSDynamicPlanConfig"), f = e("../robot/HSRobotAutoTestMgr"), _ = e("../dataReporter/DataReporter");
(function(e) {
e[e.fail = -1] = "fail";
e[e.success = 0] = "success";
e[e.code_error = 1] = "code_error";
e[e.params_error = 2] = "params_error";
e[e.features_not_found = 3] = "features_not_found";
e[e.no_hits = 4] = "no_hits";
e[e.time_out = 5] = "time_out";
e[e.data_error = 6] = "data_error";
})(c || (c = {}));
var g = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.cacheKey = "hsgame_plan";
t._activityType = 0;
t.cacheFeatures = null;
t.baseResult = [];
t.cacheHitResult = [];
t.debug_platform = 0;
t.requestStart = 0;
t._timeOut = !1;
t._planRequestResolve = null;
t.hasRequest = !1;
t.runtimeFeatures = null;
t.runtimeAbTest = [];
t.bHasGotPlanBeforeReq = !1;
t.oldTestResultStr = null;
t.hasLocalPlan = !1;
t.isDynamicPlan = !1;
return t;
}
Object.defineProperty(t, "ins", {
get: function() {
if (null === t._inst) {
t._inst = new this();
t._inst.initData();
}
return t._inst;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "features", {
get: function() {
return this.runtimeFeatures;
},
set: function(e) {
this.runtimeFeatures = e;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "abTestResult", {
get: function() {
return this.runtimeAbTest;
},
set: function(e) {
this.runtimeAbTest = e;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "abtestResultStr", {
get: function() {
var e = "", t = this.abTestResult;
if (t) for (var n = 0; n < t.length; n++) {
n > 0 && (e += ",");
e += t[n].name || "0";
}
return e;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "serverAbtestResultStr", {
get: function() {
var e = "", t = this.cacheHitResult;
if (t) for (var n = 0; n < t.length; n++) {
n > 0 && (e += ",");
e += t[n].name || "0";
}
return e;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "baseAbTestResultStr", {
get: function() {
var e = "", t = this.baseResult;
if (t) for (var n = 0; n < t.length; n++) {
n > 0 && (e += ",");
e += t[n].name || "0";
}
return e;
},
enumerable: !1,
configurable: !0
});
t.prototype.hasBaseAbTest = function() {
return !!(this.baseResult && Array.isArray(this.baseResult) && this.baseResult.length > 0) && !!this.baseResult[0].name && !!(this.cacheFeatures && Array.isArray(this.cacheFeatures) && this.cacheFeatures.length > 0);
};
t.prototype.hasNewAbTest = function() {
return !!(this.cacheHitResult && Array.isArray(this.cacheHitResult) && this.cacheHitResult.length > 0) && !!this.cacheHitResult[0].name && !!(this.cacheFeatures && Array.isArray(this.cacheFeatures) && this.cacheFeatures.length > 0);
};
t.prototype.logPlanInfo = function() {};
t.prototype.doStart2 = function(e, t, n) {
var i, o;
if (!this.hasRequest) {
this.recordCurrentPlanStr();
this.hasRequest = !0;
this._timeOut = !1;
this.hasLocalPlan = t;
if (l.hsApp.useGm && this.debug_platform) this.initPlan(); else {
var r = null !== (o = null === (i = null == e ? void 0 : e.extra) || void 0 === i ? void 0 : i.active_type) && void 0 !== o ? o : 0;
if (!this.hasLocalPlan && !this.hasBaseAbTest() || 2 === r) {
this._activityType = r;
var a = this.onGetPlanDataMBH(null == e ? void 0 : e.abtest);
this.reportPlanEvent(a, n);
this.initPlan();
} else this.initPlan();
}
}
};
t.prototype.recordCurrentPlanStr = function() {
this.oldTestResultStr = "";
try {
this.hasBaseAbTest() ? this.oldTestResultStr = JSON.stringify(this.baseResult) : this.hasNewAbTest() && (this.oldTestResultStr = JSON.stringify(this.cacheHitResult));
} catch (e) {
this.oldTestResultStr = "";
}
};
t.prototype.onGetPlanDataMBH = function(e) {
if (!e) return c.fail;
if (0 !== e.code) return c.code_error;
var t = e.data, n = t.params;
if (!n) return c.params_error;
var i = t.hits;
if (!i || !i.length) return c.no_hits;
var o = n.features;
if (!o || !o.length) return c.features_not_found;
for (var r = [], a = 0; a < i.length; a++) {
var s = i[a], l = {
id: s.group_id,
name: s.group_name,
t: s.exp_utype,
lid: s.layer_id,
eid: s.exp_id,
pid: s.pid
};
r.push(l);
}
if (this.checkTestResultData(r, o)) {
this.setNewTestResult(r, o);
return c.success;
}
return c.data_error;
};
t.prototype.reportPlanEvent = function(e, t) {
if (!this.hasLocalPlan || this.hasNewAbTest()) {
var n = 0 === e ? "success" : "fail", i = this.onGetPlanError(e);
t && (i = "方案请求超时");
var o = !1;
try {
o = JSON.stringify(this.runtimeAbTest) !== this.oldTestResultStr;
} catch (e) {
o = !1;
}
if (o) {
var r = "", a = this.runtimeAbTest;
if (0 === e && a) for (var s = 0; s < a.length; s++) {
s > 0 && (r += ",");
r += a[s].name || "0";
}
_.HsDataReporter.reportEvent("usr_data_server_status", {
status: n,
fail_reason: i,
user_waynum: r
});
}
}
};
t.prototype.onGetPlanError = function(e) {
var t = "请求失败 ";
switch (e) {
case 0:
t = "";
break;

case 1:
t = "请求服务端失败，code不为0";
break;

case 2:
t = "params为空";
break;

case 3:
t = "features为空";
break;

case 4:
t = "未被命中实验";
break;

case 5:
t = "超出2s设定时间";
break;

case 6:
t = "数据校验失败";
}
return t;
};
t.prototype.initPlan = function() {
if (!this.hasLocalPlan || this.hasNewAbTest()) {
this.hasNewAbTest() || this.hasBaseAbTest() || this.setBaseTestResult();
this.hasBaseAbTest() ? this.runtimeAbTest = this.baseResult : this.runtimeAbTest = this.cacheHitResult;
this.runtimeFeatures = this.cacheFeatures;
}
};
t.prototype.checkTestResultData = function(e, t) {
return !!(e && Array.isArray(e) && e.length > 0) && !!e[0].name && (!!(t && Array.isArray(t) && t.length > 0) || void 0);
};
t.prototype.setNewTestResult = function(e, t) {
this.baseResult = [];
this.cacheHitResult = e;
this.cacheFeatures = t;
this.saveAll();
};
t.prototype.setBaseTestResult = function() {
var e = this.baseTestResultCfg;
this.baseResult = [ {
name: e.groupName,
t: 1
} ];
this.cacheFeatures = e.features;
this.saveAll();
};
Object.defineProperty(t.prototype, "baseTestResultCfg", {
get: function() {
return l.hsApp.isIos() ? v : m;
},
enumerable: !1,
configurable: !0
});
t.prototype.doStart = function(e, t) {
return a(this, void 0, void 0, function() {
return s(this, function(n) {
switch (n.label) {
case 0:
if (this.hasRequest) return [ 2 ];
this.bHasGotPlanBeforeReq = this.hasBaseAbTest() || this.hasNewAbTest();
this.hasRequest = !0;
this._timeOut = !1;
if (!t) return [ 2 ];
if (l.hsApp.useGm && this.debug_platform) {
this.initPlan();
return [ 2 ];
}
if (this.hasBaseAbTest()) {
this.initPlan();
return [ 2 ];
}
return [ 4, this.tryRequestPlan(e) ];

case 1:
n.sent();
this.initPlan();
return [ 2 ];
}
});
});
};
t.prototype.solveGetPlanRequest = function(e) {
void 0 === e && (e = 0);
var t = 0 === e ? "success" : "fail", n = this.onGetPlanError(e), i = Date.now() - this.requestStart;
if (!this.bHasGotPlanBeforeReq) {
var o = "", r = this.cacheHitResult;
if (0 === e && r) for (var a = 0; a < r.length; a++) {
a > 0 && (o += ",");
o += r[a].name || "0";
}
_.HsDataReporter.reportEvent("usr_data_server_status", {
status: t,
fail_reason: n,
time_diff: i,
user_waynum: o
});
}
if (this._planRequestResolve) {
this._planRequestResolve(!0);
this._planRequestResolve = null;
}
};
t.prototype.solveGetPlan = function(e) {
if (!e) return this.solveGetPlanRequest(-1);
if (0 === e.code) {
var t = e.data, n = t.params;
if (n) {
var i = t.hits;
if (i && i.length) {
var o = n.features;
o && o.length ? this.onGetPlanSucess(i, o) : this.solveGetPlanRequest(3);
} else this.solveGetPlanRequest(4);
} else this.solveGetPlanRequest(2);
} else this.solveGetPlanRequest(1);
};
t.prototype.onGetPlanSucess = function(e, t) {
var n = 0;
this._timeOut && (n = 5);
if (this.hasBaseAbTest()) this.solveGetPlanRequest(n); else {
for (var i = [], o = 0; o < e.length; o++) {
var r = e[o], a = {
id: r.group_id,
name: r.group_name,
t: r.exp_utype,
lid: r.layer_id,
eid: r.exp_id,
pid: r.pid
};
i.push(a);
}
this.setNewTestResult(i, t);
this.solveGetPlanRequest(n);
}
};
t.prototype.tryRequestPlan = function(e) {
return a(this, void 0, void 0, function() {
var t, n = this;
return s(this, function(i) {
switch (i.label) {
case 0:
if (this._planRequestResolve) return [ 2 ];
t = new Promise(function(e) {
n._planRequestResolve = e;
});
d.HSTimeUtils.setTimeout(function() {
n._timeOut = !0;
if (n._planRequestResolve) {
n._planRequestResolve(!0);
n._planRequestResolve = null;
}
}, this, 2);
this.requestServerPlan(e);
return [ 4, t ];

case 1:
i.sent();
return [ 2 ];
}
});
});
};
t.prototype.requestServerPlan = function(e) {
var t = this;
this.requestStart = Date.now();
h.HSPlanUtils.ReqDatas(e, function(e, n) {
return a(t, void 0, void 0, function() {
var t;
return s(this, function() {
if (e && n) {
t = JSON.parse(n);
this.solveGetPlan(t);
} else this.solveGetPlanRequest(-1);
return [ 2 ];
});
});
});
};
t.prototype.setDynamicPlan = function() {
if (p.dynamicPlan && p.dynamicPlan.features && p.dynamicPlan.features.length > 0) return this.applySingleDynamicPlan(p.dynamicPlan);
if (!p.dynamicPlans || !Array.isArray(p.dynamicPlans) || 0 === p.dynamicPlans.length) return !1;
var e = this.selectPlanFromMultiple(p.dynamicPlans);
return !!e && this.applySingleDynamicPlan(e);
};
t.prototype.applySingleDynamicPlan = function(e) {
if (!e || !e.features || 0 === e.features.length) return !1;
this.debug_platform = "ios" === e.platform.toLowerCase() ? 1 : 2;
t.ins.cacheHitResult = [ {
name: e.groupName,
t: 1
} ];
t.ins.cacheFeatures = e.features;
t.ins.saveAll();
this.isDynamicPlan = !0;
return !0;
};
t.prototype.selectPlanFromMultiple = function(e) {
if (!e || 0 === e.length) return null;
var t = f.HSRobotAutoTestMgr.ins.getGameWayPlatform();
if (!t) return null;
var n = f.HSRobotAutoTestMgr.ins.getGameWayNum();
if (!n) return null;
var i = "ios" === t.toLowerCase() ? "ios" : "gp", o = e.filter(function(e) {
return e.enabled && e.features && e.features.length > 0 && e.platform === i && e.groupName === n;
});
if (o.length > 0) return o[0];
var r = e.filter(function(e) {
return e.features && e.features.length > 0;
});
return r.length > 0 ? r[0] : null;
};
t._inst = null;
r([ u.HSStaticData ], t.prototype, "cacheFeatures", void 0);
r([ u.HSStaticData ], t.prototype, "baseResult", void 0);
r([ u.HSStaticData ], t.prototype, "cacheHitResult", void 0);
r([ u.HSStaticData ], t.prototype, "debug_platform", void 0);
return t;
}(u.HSDataBase);
n.default = g;
var v = {
groupName: "60010100",
features: [ {
feature_key: "scorerateUnitID",
id: 18331025,
value: 27
}, {
feature_key: "sandalgoUnitID",
id: 18326043,
value: 43
}, {
feature_key: "triggeralgoUnitID",
id: 18338028,
value: 39
}, {
feature_key: "chain_eliminate",
id: 18341001
}, {
feature_key: "long_term_color",
id: 18365001,
value: [ 1e4, 3e4, 5e4, 1e5 ]
}, {
feature_key: "roll_array",
id: 18362003,
value: [ 1 ]
}, {
feature_key: "sand_damp_percent",
id: 18384001,
value: 100
}, {
feature_key: "sand_damp_number_array",
id: 18383001,
value: [ 10, 25 ]
}, {
feature_key: "ad_close_first_install_n_seconds",
id: 18357001,
value: 300
}, {
feature_key: "sand_shake_power_up_by_combo",
id: 18330001,
value: [ 4, 4, 15, 40 ]
}, {
feature_key: "no_ad_ingame_box_put_less_than_n",
id: 18355001,
value: 10
}, {
feature_key: "combo_score_display",
id: 18354001
}, {
feature_key: "sand_box_put_tolerance",
id: 18325002,
value: 15
}, {
feature_key: "sand_pure_target_words",
id: 18551001
}, {
feature_key: "sand_competitor_tutorial",
id: 18548001
}, {
feature_key: "render_new_round_block_eff",
id: 18488001
}, {
feature_key: "sand_damp_bg_change",
id: 18555001
}, {
feature_key: "sand_over_ui_up_fireworks",
id: 18692001
}, {
feature_key: "ad_interval_ingame",
id: 18368003,
value: 180
}, {
feature_key: "ad_interval_settle_with_ingame",
id: 18382001,
value: 90
}, {
feature_key: "sand_new_high_score_colorful_text",
id: 19234001
}, {
feature_key: "sand_stage_goal_adjust",
id: 19062001
}, {
feature_key: "box_drop_speed",
id: 18353001,
value: 3
}, {
feature_key: "sand_step_speed",
id: 18356003,
value: 2
}, {
feature_key: "degree_progress_over_ad_no_popup",
id: 19424001
}, {
feature_key: "sand_ad_ingame_progressive_interval_daily",
id: 19133001,
value: [ 240, 210, 180 ]
}, {
feature_key: "sand_no_ad_settle_score_first_3days",
id: 19116001,
value: 5e3
}, {
feature_key: "sand_no_ad_settle_score_except_replay",
id: 19115001,
value: 5e3
}, {
feature_key: "sand_put_mini_shake",
id: 18332001,
value: [ .05, 1 ]
}, {
feature_key: "sand_diamond_system",
id: 19255001
}, {
feature_key: "sand_stage_goal_diamond_reward",
id: 19256001
}, {
feature_key: "open_daily_login",
id: 19235001
}, {
feature_key: "sand_prop_bomb_restore",
id: 18549001
}, {
feature_key: "sand_menu_view_unlock",
id: 19254001
}, {
feature_key: "sand_menu_display",
id: 18333001
}, {
feature_key: "sand_diamond_no_net_tip",
id: 19265001
}, {
feature_key: "button_explode_effect",
id: 19232001
}, {
feature_key: "no_ad_settle_session_ingame_ad_n",
id: 18476001,
value: 3
} ]
}, m = {
groupName: "50010100",
features: [ {
feature_key: "long_term_color",
id: 328318005,
value: [ 1e4, 3e4, 5e4, 1e5 ]
}, {
feature_key: "roll_array",
id: 328322001,
value: [ 1 ]
}, {
feature_key: "sand_damp_percent",
id: 328372001,
value: 100
}, {
feature_key: "sand_damp_number_array",
id: 328373001,
value: [ 10, 25 ]
}, {
feature_key: "ad_interval_ingame",
id: 328316002,
value: 180
}, {
feature_key: "ad_interval_settle_with_ingame",
id: 328356004,
value: 90
}, {
feature_key: "ad_close_first_install_n_seconds",
id: 328408001,
value: 300
}, {
feature_key: "sand_stage_goal_adjust",
id: 329105001
}, {
feature_key: "combo_score_display",
id: 328457001
}, {
feature_key: "sand_box_put_tolerance",
id: 328474002,
value: 15
}, {
feature_key: "sand_competitor_tutorial",
id: 328536001
}, {
feature_key: "sand_speed_upgrade_by_day",
id: 328776001,
value: [ 2, 2, 1, .2, 3, 3 ]
}, {
feature_key: "no_ad_ingame_round_n_offline_10min",
id: 328523001,
value: 5
}, {
feature_key: "sand_over_ui_light",
id: 328563001
}, {
feature_key: "sand_pure_target_words",
id: 328539001
}, {
feature_key: "no_ad_settle_session_ingame_ad_n",
id: 328519001,
value: 3
}, {
feature_key: "sand_diamond_system",
id: 329537001
}, {
feature_key: "sand_stage_goal_diamond_reward",
id: 329538001
}, {
feature_key: "open_daily_login_autoshow",
id: 329446001
}, {
feature_key: "sand_prop_bomb_restore",
id: 328537001
}, {
feature_key: "sand_menu_view_unlock",
id: 329536001
}, {
feature_key: "sand_menu_display",
id: 328464001
}, {
feature_key: "sand_new_high_score_rainbow_bridge",
id: 329450001
}, {
feature_key: "sandalgoUnitID",
id: 328310045,
value: 45
}, {
feature_key: "scorerateUnitID",
id: 328312020,
value: 22
}, {
feature_key: "sand_ad_assisted_blocks",
id: 329318001
}, {
feature_key: "triggeralgoUnitID",
id: 328314034,
value: 46
}, {
feature_key: "sand_revive_board_block_disappear_effect",
id: 328911001
} ]
};
cc._RF.pop();
}, {
"../../hsApp": "hsApp",
"../../utils/HSDataBase": "HSDataBase",
"../../utils/HSTimeUtils": "HSTimeUtils",
"../dataReporter/DataReporter": "DataReporter",
"../robot/HSRobotAutoTestMgr": "HSRobotAutoTestMgr",
"./HSDynamicPlanConfig": "HSDynamicPlanConfig",
"./HSPlanUtils": "HSPlanUtils"
} ],
HSResManager: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "dd981KGWeFNxYM0snyYZ1Sd", "HSResManager");
var i = this && this.__awaiter || function(e, t, n, i) {
return new (n || (n = Promise))(function(o, r) {
function a(e) {
try {
c(i.next(e));
} catch (e) {
r(e);
}
}
function s(e) {
try {
c(i.throw(e));
} catch (e) {
r(e);
}
}
function c(e) {
e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, s);
var t;
}
c((i = i.apply(e, t || [])).next());
});
}, o = this && this.__generator || function(e, t) {
var n, i, o, r, a = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
},
trys: [],
ops: []
};
return r = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function s(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(r) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 
0) : i.next) && !(o = o.call(i, r[1])).done) return o;
(i = 0, o) && (r = [ 2 & r[0], o.value ]);
switch (r[0]) {
case 0:
case 1:
o = r;
break;

case 4:
a.label++;
return {
value: r[1],
done: !1
};

case 5:
a.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(o = a.trys, o = o.length > 0 && o[o.length - 1]) && (6 === r[0] || 2 === r[0])) {
a = 0;
continue;
}
if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
a.label = r[1];
break;
}
if (6 === r[0] && a.label < o[1]) {
a.label = o[1];
o = r;
break;
}
if (o && a.label < o[2]) {
a.label = o[2];
a.ops.push(r);
break;
}
o[2] && a.ops.pop();
a.trys.pop();
continue;
}
r = t.call(e, a);
} catch (e) {
r = [ 6, e ];
i = 0;
} finally {
n = o = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
var r = e("../utils/HSMiniResManager"), a = e("../utils/HSResourceUtils"), s = function() {
function e() {
this._useCache = !0;
this._loadingTask = new Map();
this.loadedBundles = new Array();
this.referenceCount = new Map();
this.moduleReference = new Map();
this.change65 = [ "galijiao", "kaochuan", "pisa" ];
}
Object.defineProperty(e, "ins", {
get: function() {
null === e._inst && (e._inst = new this());
return e._inst;
},
enumerable: !1,
configurable: !0
});
e.prototype.init = function() {};
e.prototype._loadRemote = function(t) {
var n = this;
return new Promise(function(i) {
cc.assetManager.loadRemote(t, function(t, o) {
n && e._inst ? i(t ? null : o) : i(null);
});
});
};
e.prototype._loadFromBundle = function(t, n, s) {
return i(this, void 0, Promise, function() {
var i, c, l, u, d = this;
return o(this, function() {
i = null == s ? void 0 : s.bundles;
if (r.HSMiniResManager.isMiniResVersion() && r.HSMiniResManager.hasMapping(t)) {
c = r.HSMiniResManager.getResolvedPathAndBundle(t, i);
t = c.path;
i = c.bundle;
}
return this._useCache && (l = cc.assetManager.getBundle(i)) && (u = l.get(t, n)) ? [ 2, u ] : [ 2, new Promise(function(o) {
a.HSResourceUtils.loadBundle(i).then(function(i) {
i && e._inst ? i.load(t, n, function(t, n) {
d && e._inst ? o(t ? null : n) : o(null);
}) : o(null);
});
}) ];
});
});
};
e.prototype._tryLoadFromMiniBundle = function(t, n) {
return i(this, void 0, Promise, function() {
var i, r, s, c, l = this;
return o(this, function(o) {
switch (o.label) {
case 0:
i = "sand_mini";
o.label = 1;

case 1:
o.trys.push([ 1, 3, , 4 ]);
return this._useCache && (r = cc.assetManager.getBundle(i)) && (s = r.get(t, n)) ? [ 2, s ] : [ 4, a.HSResourceUtils.loadBundle(i) ];

case 2:
return (c = o.sent()) && e._inst ? [ 2, new Promise(function(i) {
c.load(t, n, function(t, n) {
l && e._inst ? i(t ? null : n) : i(null);
});
}) ] : [ 2, null ];

case 3:
o.sent();
return [ 2, null ];

case 4:
return [ 2 ];
}
});
});
};
e.prototype._loadFromResoures = function(t, n) {
var i = this;
return new Promise(function(o) {
cc.resources.load(t, n, function(t, n) {
i && e._inst ? o(t ? null : n) : o(null);
});
});
};
e.prototype._loadAny = function(e, t, n) {
var i = this;
if (this._loadingTask.has(e)) return this._loadingTask.get(e);
var o = null;
(o = e.startsWith("http") ? this._loadRemote(e, n) : n.bundles ? this._loadFromBundle(e, t, n) : this._loadFromResoures(e, t, n)).then(function() {
return i._loadingTask.delete(e);
});
this._loadingTask.set(e, o);
return o;
};
e.prototype.load = function(e, t, n) {
if (!this.isRemoteRes(e) && !t) {
var i = this.getResBundle(e, n);
if (!(t = null == i ? void 0 : i.name)) {
Promise.resolve(null);
return;
}
}
return this._loadAny(e, null != n ? n : cc.Asset, {
bundles: t
});
};
e.prototype.ref = function(e, t) {
var n = cc.assetManager.dependUtil.getDepsRecursively(t);
if (!(n.length <= 0)) {
n.push(t);
for (var i = this.moduleReference.get(e) || [], o = 0; o < n.length; o++) {
var r = n[o];
if (i.indexOf(r) < 0) {
i.push(r);
var a = (this.referenceCount.get(r) || 0) + 1;
this.referenceCount.set(r, a);
}
}
this.moduleReference.set(e, i);
}
};
e.prototype.addRef = function(e, t) {
var n = this.moduleReference.get(e) || [];
if (n.indexOf(t) < 0) {
n.push(t);
var i = (this.referenceCount.get(t) || 0) + 1;
this.referenceCount.set(t, i);
}
};
e.prototype.unrefPartial = function(e, t) {
if (this.moduleReference.has(e)) {
for (var n = cc.assetManager.dependUtil.getDepsRecursively(t), i = 0; i < n.length; i++) {
var o = n[i], r = (this.referenceCount.get(o) || 0) - 1;
r <= 0 ? this.referenceCount.delete(o) : this.referenceCount.set(o, r);
}
var a = this.moduleReference.get(e) || [];
for (i = 0; i < n.length; i++) {
var s = n[i], c = cc.assetManager.assets.get(s);
c && cc.assetManager.releaseAsset(c);
}
for (i = a.length - 1; i >= 0; i--) {
s = a[i];
n.indexOf(s) >= 0 && a.splice(i, 1);
}
this.moduleReference.set(e, a);
}
};
e.prototype.unref = function(e, t) {
void 0 === t && (t = !1);
if (this.moduleReference.has(e)) {
for (var n = this.moduleReference.get(e), i = [], o = 0; o < n.length; o++) {
var r = n[o], a = (this.referenceCount.get(r) || 0) - 1;
if (a <= 0) {
i.push(r);
this.referenceCount.delete(r);
} else this.referenceCount.set(r, a);
}
this.moduleReference.delete(e);
if (!(i.length <= 0)) for (o = 0; o < i.length; o++) {
var s = i[o], c = cc.assetManager.assets.get(s);
c && cc.assetManager.releaseAsset(c);
}
}
};
e.prototype.initRef = function() {
var e = this;
this.loadedBundles = [];
cc.assetManager.bundles.forEach(function(t, n) {
e.loadedBundles.push(n);
});
var t = cc.assetManager.main.getSceneInfo("StartScene");
this.ref("StartScene", t.uuid);
};
e.prototype.unloadBundle = function(e) {
if (cc.assetManager.bundles.has(e)) {
var t = cc.assetManager.getBundle(e);
if (t) {
t.releaseAll();
cc.assetManager.removeBundle(t);
var n = this.loadedBundles.indexOf(e);
n >= 0 && this.loadedBundles.splice(n, 1);
}
}
};
e.prototype.unloadBundles = function(e) {
for (var t = 0; t < e.length; t++) this.unloadBundle(e[t]);
};
e.prototype.loadBundle = function(e, t) {
a.HSResourceUtils.loadBundle(e).then(function(e) {
t && t(null, e);
}).catch(function(e) {
t && t(e, null);
});
};
e.prototype.loadBundleSync = function(e) {
return i(this, void 0, Promise, function() {
return o(this, function() {
return [ 2, new Promise(function(t) {
a.HSResourceUtils.loadBundle(e).then(function(e) {
t(e);
}).catch(function() {
t(null);
});
}) ];
});
});
};
e.prototype.loadBundlesBatch = function(e) {
return i(this, void 0, Promise, function() {
var t, n = this;
return o(this, function() {
t = e.map(function(e) {
return n.loadBundleSync(e);
});
return [ 2, Promise.all(t).then(function(e) {
return e;
}) ];
});
});
};
e.prototype.loadBundles = function(e, t) {
for (var n = 0, i = 0; i < e.length; i++) this.loadBundle(e[i], function() {
if (++n >= e.length) {
n = null;
t();
}
});
};
e.prototype.getResBundle = function(e, t) {
var n = null;
cc.assetManager.bundles.forEach(function(i) {
(i.getInfoWithPath(e, t) || i.getSceneInfo(e)) && (n = i);
});
return n;
};
e.prototype.isRemoteRes = function(e) {
return e.startsWith("http://") || e.startsWith("https://");
};
e.prototype.removeModule = function(e, t) {
var n = e.substring(0, 1).toLowerCase() + e.substring(1, e.length), i = this.loadedBundles.indexOf(n);
this.loadedBundles.splice(i, 1);
var o = cc.assetManager.getBundle(n);
if (o) {
var r = o.getInfoWithPath(t, cc.Prefab);
if (r) {
var a = cc.assetManager.assets.get(r.uuid);
cc.assetManager.releaseAsset(a);
}
}
};
e.prototype.get = function(e, t) {
var n = this.getResBundle(e, t);
return null == n ? void 0 : n.get(e, t);
};
e.prototype.loadAssets = function(t, n, i, o) {
var r = this;
n.load(t, i, function(t, n) {
r && e._inst && !t && n ? o && o(n) : o && o(null);
});
};
e.prototype.loadArray = function(t) {
var n = this;
return new Promise(function(i) {
cc.assetManager.loadAny(t, function(t, o) {
n && e._inst ? i(o) : i(null);
});
});
};
e.prototype.loadBatch = function(e, t) {
var n = this;
return new Promise(function(i) {
for (var o = new Map(), r = function(r) {
var a = e[r];
n.load(a, null, t).then(function(t) {
o.set(a, t);
o.size >= e.length && i(o);
});
}, a = 0; a < e.length; a++) r(a);
});
};
e.prototype.loadBatchInBundle = function(e, t, n) {
var i = this;
return new Promise(function(o) {
for (var r = new Map(), a = function(a) {
var s = e[a];
i.load(s, t, n).then(function(t) {
r.set(s, t);
r.size >= e.length && o(r);
});
}, s = 0; s < e.length; s++) a(s);
});
};
e.prototype.loadPrefab = function(e, t) {
return this.load(e, t, cc.Prefab);
};
e.prototype.preloadPrefab = function(e, t) {
var n = this;
"string" == typeof t ? this.loadBundle(t, function(t, i) {
n.preloadPrefab(e, i);
}) : t instanceof cc.AssetManager.Bundle && t.preloadDir(e, function() {});
};
e.prototype.loadSpine = function(e, t, n, i, o) {
var r = this;
void 0 === i && (i = !1);
void 0 === o && (o = !0);
return new Promise(function(a) {
r.load(t, n, sp.SkeletonData).then(function(t) {
if (t) {
e.skeletonData && o && r.unrefPartial(n, e.skeletonData._uuid);
e.skeletonData = t;
e.premultipliedAlpha = i;
r.ref(n, t._uuid);
a();
} else a();
});
});
};
e.prototype.loadSprite = function(e, t, n, r) {
void 0 === r && (r = !0);
return i(this, void 0, void 0, function() {
var i, r, a, s;
return o(this, function(o) {
switch (o.label) {
case 0:
if (t.includes("9999")) return [ 2 ];
i = e.getComponent(cc.Sprite);
r = this.isRemoteRes(t) ? cc.Texture2D : cc.SpriteFrame;
return [ 4, this.load(t, n, r) ];

case 1:
if (!(a = o.sent())) return [ 2 ];
s = a instanceof cc.Texture2D ? new cc.SpriteFrame(a) : a;
i && (i.spriteFrame = s);
return [ 2, s ];
}
});
});
};
e.prototype.loadScene = function(e, t) {
cc.director.loadScene(e, function(e) {
e || null == t || t();
});
};
e.prototype.setUseCache = function(e) {
this._useCache = e;
};
e._inst = null;
return e;
}();
n.default = s;
cc._RF.pop();
}, {
"../utils/HSMiniResManager": "HSMiniResManager",
"../utils/HSResourceUtils": "HSResourceUtils"
} ],
HSResourceUtils: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "0c0a3gAKlhNMYNgBqIbTFCx", "HSResourceUtils");
var i = this && this.__awaiter || function(e, t, n, i) {
return new (n || (n = Promise))(function(o, r) {
function a(e) {
try {
c(i.next(e));
} catch (e) {
r(e);
}
}
function s(e) {
try {
c(i.throw(e));
} catch (e) {
r(e);
}
}
function c(e) {
e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, s);
var t;
}
c((i = i.apply(e, t || [])).next());
});
}, o = this && this.__generator || function(e, t) {
var n, i, o, r, a = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
},
trys: [],
ops: []
};
return r = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function s(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(r) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 
0) : i.next) && !(o = o.call(i, r[1])).done) return o;
(i = 0, o) && (r = [ 2 & r[0], o.value ]);
switch (r[0]) {
case 0:
case 1:
o = r;
break;

case 4:
a.label++;
return {
value: r[1],
done: !1
};

case 5:
a.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(o = a.trys, o = o.length > 0 && o[o.length - 1]) && (6 === r[0] || 2 === r[0])) {
a = 0;
continue;
}
if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
a.label = r[1];
break;
}
if (6 === r[0] && a.label < o[1]) {
a.label = o[1];
o = r;
break;
}
if (o && a.label < o[2]) {
a.label = o[2];
a.ops.push(r);
break;
}
o[2] && a.ops.pop();
a.trys.pop();
continue;
}
r = t.call(e, a);
} catch (e) {
r = [ 6, e ];
i = 0;
} finally {
n = o = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
}, r = this && this.__read || function(e, t) {
var n = "function" == typeof Symbol && e[Symbol.iterator];
if (!n) return e;
var i, o, r = n.call(e), a = [];
try {
for (;(void 0 === t || t-- > 0) && !(i = r.next()).done; ) a.push(i.value);
} catch (e) {
o = {
error: e
};
} finally {
try {
i && !i.done && (n = r.return) && n.call(r);
} finally {
if (o) throw o.error;
}
}
return a;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSResourceUtils = void 0;
var a = e("./HSMiniResManager"), s = function() {
function e() {}
e.loadPrefab = function(t, n) {
void 0 === n && (n = "resources");
return e.load(t, cc.Prefab, n);
};
e.loadRemote = function(e) {
return new Promise(function(t) {
cc.assetManager.loadRemote(e, function(e, n) {
t(e ? null : n);
});
});
};
e.loadNode = function(t, n, r, a) {
void 0 === a && (a = "resources");
return i(this, void 0, Promise, function() {
var i, s, c;
return o(this, function(o) {
switch (o.label) {
case 0:
i = r || "sand_default_node_name";
if (s = n.getChildByName(i)) return [ 3, 4 ];
o.label = 1;

case 1:
o.trys.push([ 1, 3, , 4 ]);
return [ 4, e.loadPrefab(t, a) ];

case 2:
if (c = o.sent()) {
(s = cc.instantiate(c)).name = i;
cc.isValid(n) && n.addChild(s);
}
return [ 3, 4 ];

case 3:
o.sent();
return [ 2, null ];

case 4:
return [ 2, s ];
}
});
});
};
e.loadJSON = function(t, n) {
void 0 === n && (n = "resources");
return e.load(t, cc.JsonAsset, n);
};
e.loadMaterial = function(t, n) {
void 0 === n && (n = "resources");
return e.load(t, cc.Material, n);
};
e.loadSpine = function(t, n) {
void 0 === n && (n = "resources");
return i(this, void 0, Promise, function() {
return o(this, function(i) {
switch (i.label) {
case 0:
return [ 4, e.load(t, sp.SkeletonData, n) ];

case 1:
return [ 2, i.sent() ];
}
});
});
};
e.loadAndCreateSpine = function(t, n) {
void 0 === n && (n = "resources");
return i(this, void 0, Promise, function() {
var i, r, a;
return o(this, function(o) {
switch (o.label) {
case 0:
return [ 4, e.loadSpine(t, n) ];

case 1:
i = o.sent();
r = new cc.Node();
(a = r.addComponent(sp.Skeleton)).skeletonData = i;
a.setToSetupPose();
a.premultipliedAlpha = !1;
return [ 2, a ];
}
});
});
};
e.loadTexture2D = function(t, n) {
void 0 === n && (n = "resources");
return i(this, void 0, Promise, function() {
return o(this, function(i) {
switch (i.label) {
case 0:
return [ 4, e.load(t, cc.Texture2D, n) ];

case 1:
return [ 2, i.sent() ];
}
});
});
};
e.loadSpriteFrame = function(t, n) {
void 0 === n && (n = "resources");
return i(this, void 0, Promise, function() {
var i, r;
return o(this, function(o) {
switch (o.label) {
case 0:
return [ 4, e.load(t, cc.SpriteFrame, n) ];

case 1:
if ((i = o.sent()) instanceof cc.Texture2D) {
(r = new cc.SpriteFrame()).setTexture(i);
return [ 2, r ];
}
return [ 2, i ];
}
});
});
};
e.loadBundle = function(e) {
return i(this, void 0, Promise, function() {
return o(this, function() {
return [ 2, new Promise(function(t) {
var n = cc.assetManager.getBundle(e);
if (n) return t(n);
cc.assetManager.loadBundle(e, function(e, n) {
t(e ? null : n);
});
}) ];
});
});
};
e.runScene = function(t, n, r) {
return i(this, void 0, void 0, function() {
var i, a;
return o(this, function(o) {
switch (o.label) {
case 0:
return (i = cc.director.getScene()) && i.name === n ? [ 2 ] : [ 4, e.loadBundle(t) ];

case 1:
if (!(a = o.sent())) return [ 2 ];
a.loadScene(n, function(e, t) {
if (!e) {
var i = cc.director.getScene();
i && i.name === n || cc.director.runScene(t, r);
}
});
return [ 2 ];
}
});
});
};
e.runMiniScene = function(t, n) {
return i(this, void 0, void 0, function() {
var i, r;
return o(this, function(o) {
switch (o.label) {
case 0:
return (i = cc.director.getScene()) && i.name === n ? [ 2 ] : [ 4, e.loadBundle(t) ];

case 1:
if (!(r = o.sent())) return [ 2 ];
r.loadScene(n, function(e, t) {
if (!e) {
var i = cc.director.getScene();
i && i.name === n || cc.director.runScene(t);
}
});
return [ 2 ];
}
});
});
};
e.load = function(t, n, r) {
var s = this;
void 0 === r && (r = "resources");
return new Promise(function(c, l) {
return i(s, void 0, void 0, function() {
var i, s;
return o(this, function(o) {
switch (o.label) {
case 0:
if (a.HSMiniResManager.isMiniResVersion() && a.HSMiniResManager.hasMapping(t)) {
i = a.HSMiniResManager.getResolvedPathAndBundle(t, r);
t = i.path;
r = i.bundle;
}
return [ 4, e.loadBundle(r) ];

case 1:
if (!(s = o.sent())) {
l(new Error("加载bundle失败: " + r));
return [ 2 ];
}
n ? s.load(t, n, function(e, n) {
if (e) {
cc.error("load error:", t, e);
l(e);
} else c(n);
}) : s.load(t, function(e, n) {
if (e) {
cc.error("load error:", t, e);
l(e);
} else c(n);
});
return [ 2 ];
}
});
});
});
};
e.loadAudio = function(e, t) {
void 0 === t && (t = "resources");
return i(this, void 0, Promise, function() {
var n;
return o(this, function(i) {
switch (i.label) {
case 0:
return [ 4, this.load(e, cc.AudioClip, t) ];

case 1:
return (n = i.sent()) ? [ 2, n ] : [ 2, null ];
}
});
});
};
e.playAudio = function(e, t) {
void 0 === t && (t = "resources");
return i(this, void 0, Promise, function() {
var n;
return o(this, function(i) {
switch (i.label) {
case 0:
return [ 4, this.loadAudio(e, t) ];

case 1:
return (n = i.sent()) ? [ 2, cc.audioEngine.play(n, !1, 1) ] : [ 2, null ];
}
});
});
};
e.playBGM = function(e, t) {
void 0 === t && (t = "resources");
return i(this, void 0, Promise, function() {
var n;
return o(this, function(i) {
switch (i.label) {
case 0:
return [ 4, this.loadAudio(e, t) ];

case 1:
if ((n = i.sent()) && !this.isOpen) {
this.isOpen = !0;
cc.audioEngine.stopMusic();
return [ 2, cc.audioEngine.playMusic(n, !0) ];
}
return [ 2, null ];
}
});
});
};
e.pauseBGM = function() {
return i(this, void 0, void 0, function() {
return o(this, function() {
this.isOpen = !1;
cc.audioEngine.stopMusic();
return [ 2 ];
});
});
};
e.loadMiniSpriteFrame = function(t, n, i) {
t && null != n && i && e.loadSpriteFrame("" + t).then(function(e) {
var t = n && "." !== n ? cc.find(n, i) : i, o = null == t ? void 0 : t.getComponent(cc.Sprite);
o && cc.isValid(e) && (o.spriteFrame = e);
}).catch(function() {});
};
e.loadMiniDragonBones = function(t, n, i, o, a, s, c) {
void 0 === a && (a = "Armature");
void 0 === s && (s = null);
void 0 === c && (c = 1);
t && n && null != i && o && Promise.all([ e.load(t, dragonBones.DragonBonesAsset), e.load(n, dragonBones.DragonBonesAtlasAsset) ]).then(function(e) {
var t = r(e, 2), n = t[0], l = t[1], u = i && "." !== i ? cc.find(i, o) : o;
if (u) {
var d = u.getComponent(dragonBones.ArmatureDisplay);
if (d && cc.isValid(n) && cc.isValid(l)) {
d.dragonAsset = n;
d.dragonAtlasAsset = l;
d.armatureName = a;
s && d.playAnimation(s, c);
}
}
}).catch(function() {});
};
e.loadMiniBitmapFont = function(t, n, i) {
t && null != n && i && e.load(t, cc.BitmapFont).then(function(e) {
var t = n && "." !== n ? cc.find(n, i) : i;
if (t) {
var o = t.getComponent(cc.Label);
o && cc.isValid(e) && (o.font = e);
}
}).catch(function() {});
};
e.isOpen = !1;
return e;
}();
n.HSResourceUtils = s;
cc._RF.pop();
}, {
"./HSMiniResManager": "HSMiniResManager"
} ],
HSRobotAutoTestBatchParams: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "c1518ToM6lCT5035/kfRBTr", "HSRobotAutoTestBatchParams");
Object.defineProperty(n, "__esModule", {
value: !0
});
cc._RF.pop();
}, {} ],
HSRobotAutoTestDataReporter: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "41fd9VVwblLL425nhmv0gPr", "HSRobotAutoTestDataReporter");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSRobotAutoTestDataReporter = void 0;
var i = e("../../utils/HSHttpUtils"), o = e("../robot/HSRobotAutoTestMgr"), r = function() {
function e() {}
e.initUrl = function() {
if (!(e.baseUrl.length > 0)) {
e.baseUrl = "http://10.0.0.59:7777/misc/bot";
if ("undefined" != typeof window && window.location) {
var t = window.location.origin;
(t.includes("starlink-live.hungrystudio.pp.ua") || t.includes("localhost")) && (e.baseUrl = "http://10.254.3.63:7777/misc/bot");
}
}
};
e.reportEvent = function(t, n, i) {
i = i || {};
e.extendData(i);
e.reportData(t, i);
};
e.extendData = function(e) {
var t, n, i;
e.dt = Date.now();
e.task_id = +(null === (t = o.HSRobotAutoTestMgr.ins.getBatchParams()) || void 0 === t ? void 0 : t.task_id);
e.robot_type = +(null === (n = o.HSRobotAutoTestMgr.ins.getBatchParams()) || void 0 === n ? void 0 : n.bot_level);
e.game_id = (null === (i = o.HSRobotAutoTestMgr.ins.getBatchParams()) || void 0 === i ? void 0 : i.execute_sequence) + ":" + e.game_id;
e.distinct_id = "";
};
e.reportData = function(t, n) {
this.initUrl();
i.default.postJson(e.baseUrl + "/" + t, JSON.stringify(n)).then(function() {}).catch(function() {});
};
e.baseUrl = "";
return e;
}();
n.HSRobotAutoTestDataReporter = r;
cc._RF.pop();
}, {
"../../utils/HSHttpUtils": "HSHttpUtils",
"../robot/HSRobotAutoTestMgr": "HSRobotAutoTestMgr"
} ],
HSRobotAutoTestMgr: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "a7c88WFXpBKl6DvrScMA141", "HSRobotAutoTestMgr");
var i = this && this.__awaiter || function(e, t, n, i) {
return new (n || (n = Promise))(function(o, r) {
function a(e) {
try {
c(i.next(e));
} catch (e) {
r(e);
}
}
function s(e) {
try {
c(i.throw(e));
} catch (e) {
r(e);
}
}
function c(e) {
e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, s);
var t;
}
c((i = i.apply(e, t || [])).next());
});
}, o = this && this.__generator || function(e, t) {
var n, i, o, r, a = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
},
trys: [],
ops: []
};
return r = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function s(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(r) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 
0) : i.next) && !(o = o.call(i, r[1])).done) return o;
(i = 0, o) && (r = [ 2 & r[0], o.value ]);
switch (r[0]) {
case 0:
case 1:
o = r;
break;

case 4:
a.label++;
return {
value: r[1],
done: !1
};

case 5:
a.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(o = a.trys, o = o.length > 0 && o[o.length - 1]) && (6 === r[0] || 2 === r[0])) {
a = 0;
continue;
}
if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
a.label = r[1];
break;
}
if (6 === r[0] && a.label < o[1]) {
a.label = o[1];
o = r;
break;
}
if (o && a.label < o[2]) {
a.label = o[2];
a.ops.push(r);
break;
}
o[2] && a.ops.pop();
a.trys.pop();
continue;
}
r = t.call(e, a);
} catch (e) {
r = [ 6, e ];
i = 0;
} finally {
n = o = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSRobotAutoTestMgr = void 0;
var r = e("../features/HSPlanUtils"), a = e("../../utils/HSLogCollector"), s = e("../../utils/HSUrlUtils"), c = function() {
function e() {
this.batchParams = null;
this.extConfig = null;
this.isAutoTestMode = !1;
this.isReported = !1;
}
Object.defineProperty(e, "ins", {
get: function() {
this._instance || (this._instance = new e());
return this._instance;
},
enumerable: !1,
configurable: !0
});
e.prototype.initLogReport = function(e) {
a.HSLogCollector.ins().init(e, {
taskId: s.HSUrlUtils.getUrlParam("task_id"),
enableStackTrace: !0,
keepOriginalConsole: !0
});
};
e.prototype.checkAutoTestMode = function() {
var e = s.HSUrlUtils.getUrlParam("query_addr"), t = s.HSUrlUtils.getUrlParam("task_id"), n = s.HSUrlUtils.getUrlParam("execute_sequence");
this.isAutoTestMode = !!e && !!t && !!n;
return this.isAutoTestMode;
};
e.prototype.queryBatchParams = function(e, t, n) {
return i(this, void 0, Promise, function() {
var i, a, c = this;
return o(this, function() {
if (!this.isAutoTestMode) return [ 2, !0 ];
if (i = s.HSUrlUtils.getUrlParam("batch_params")) {
this.batchParams = JSON.parse(i);
return [ 2, !0 ];
}
a = {
task_id: t,
execute_sequence: n
};
return [ 2, new Promise(function(t) {
r.HSPlanUtils.POST(e, a, function(e, n) {
if (e) try {
var i = JSON.parse(n);
if (0 === i.code) {
c.batchParams = i.data;
c.batchParams.ext_config && (c.extConfig = JSON.parse(c.batchParams.ext_config));
t(!0);
} else t(!1);
} catch (e) {
t(!1);
} else t(!1);
});
}) ];
});
});
};
e.prototype.reportGameFinished = function(e, t, n) {
if (this.isAutoTestMode && this.batchParams) {
var i = {
task_id: e,
execute_sequence: t,
game_id: n
}, o = this.batchParams.report_one_addr;
o && r.HSPlanUtils.POST(o, i, function() {});
}
};
e.prototype.reportBatchFinished = function(e, t, n) {
if (this.isAutoTestMode && this.batchParams && !this.isReported) {
this.isReported = !0;
var i = {
task_id: e,
execute_sequence: t,
is_success: n
}, o = this.batchParams.report_addr;
o && r.HSPlanUtils.POST(o, i, function() {});
}
};
e.prototype.getBatchParams = function() {
return this.batchParams;
};
e.prototype.getExtConfig = function() {
return this.extConfig;
};
e.prototype.isInAutoTestMode = function() {
return this.isAutoTestMode;
};
e.prototype.setupExitHandlers = function() {
var e = this;
if (this.isAutoTestMode && cc.sys.isBrowser && "undefined" != typeof window) {
window.addEventListener("beforeunload", function() {
e.handleAbnormalExit();
});
window.addEventListener("unload", function() {
e.handleAbnormalExit();
});
window.addEventListener("error", function() {
e.handleAbnormalExit();
});
window.addEventListener("unhandledrejection", function() {
e.handleAbnormalExit();
});
}
};
e.prototype.handleAbnormalExit = function() {
this.batchParams && this.reportBatchFinished(this.batchParams.task_id, this.batchParams.execute_sequence, !1);
};
e.prototype.pullGamePlanConfig = function(e, t, n) {
void 0 === n && (n = "IOS");
return i(this, void 0, Promise, function() {
var i;
return o(this, function(o) {
switch (o.label) {
case 0:
o.label = 1;

case 1:
o.trys.push([ 1, 3, , 4 ]);
return [ 4, r.HSPlanUtils.pullWayNumConfig(e, t, n) ];

case 2:
return (i = o.sent()) ? [ 2, i ] : [ 2, null ];

case 3:
o.sent();
return [ 2, null ];

case 4:
return [ 2 ];
}
});
});
};
e.prototype.getPlanApiUrl = function() {
return "https://starlink-sand-ro.youxi123.com/api/fc/solution/get_json_param_list";
};
e.prototype.getTaskParamsFromUrl = function() {
var e = parseInt(s.HSUrlUtils.getUrlParam("task_id", "1")), t = parseInt(s.HSUrlUtils.getUrlParam("execute_sequence", "1000"));
return {
url: s.HSUrlUtils.getUrlParam("query_addr", "1000"),
taskId: e,
executeSequence: t
};
};
e.prototype.stepRobotAutoTest = function() {
var e;
return i(this, void 0, Promise, function() {
var t, n, i, r;
return o(this, function(o) {
switch (o.label) {
case 0:
if (!this.isAutoTestMode) return [ 2, {
success: !0
} ];
o.label = 1;

case 1:
o.trys.push([ 1, 3, , 4 ]);
t = this.getTaskParamsFromUrl(), n = t.url, i = t.taskId, r = t.executeSequence;
return [ 4, this.queryBatchParams(n, i, r) ];

case 2:
return o.sent() ? [ 2, {
success: !0,
botAddr: (null === (e = this.getBatchParams()) || void 0 === e ? void 0 : e.bot_addr) || void 0
} ] : [ 2, {
success: !1
} ];

case 3:
o.sent();
return [ 2, {
success: !1
} ];

case 4:
return [ 2 ];
}
});
});
};
e.prototype.getGameWayNum = function() {
var e, t, n;
return null === (n = null === (t = null === (e = this.extConfig) || void 0 === e ? void 0 : e.featureParam) || void 0 === t ? void 0 : t.game_way) || void 0 === n ? void 0 : n.game_way_num;
};
e.prototype.getGameWayPlatform = function() {
var e, t, n;
return null === (n = null === (t = null === (e = this.extConfig) || void 0 === e ? void 0 : e.featureParam) || void 0 === t ? void 0 : t.game_way) || void 0 === n ? void 0 : n.game_way_platform;
};
e.prototype.getCustomFeatures = function() {
var e, t, n = {};
for (var i in null === (e = null == this ? void 0 : this.extConfig) || void 0 === e ? void 0 : e.featureParam) if (Object.prototype.hasOwnProperty.call(null === (t = null == this ? void 0 : this.extConfig) || void 0 === t ? void 0 : t.featureParam, i)) {
if ("game_way" === i) continue;
n[i] = this.extConfig.featureParam[i];
}
return n;
};
e._instance = null;
return e;
}();
n.HSRobotAutoTestMgr = c;
cc._RF.pop();
}, {
"../../utils/HSLogCollector": "HSLogCollector",
"../../utils/HSUrlUtils": "HSUrlUtils",
"../features/HSPlanUtils": "HSPlanUtils"
} ],
HSSkinManager: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "6719ci2YrlBT4amVjQsK/eA", "HSSkinManager");
var i = this && this.__read || function(e, t) {
var n = "function" == typeof Symbol && e[Symbol.iterator];
if (!n) return e;
var i, o, r = n.call(e), a = [];
try {
for (;(void 0 === t || t-- > 0) && !(i = r.next()).done; ) a.push(i.value);
} catch (e) {
o = {
error: e
};
} finally {
try {
i && !i.done && (n = r.return) && n.call(r);
} finally {
if (o) throw o.error;
}
}
return a;
}, o = this && this.__spread || function() {
for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(i(arguments[t]));
return e;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSSkinManager = void 0;
var r = function() {
function e() {
this.skinConfigs = null;
this.skinRegConfigs = new Map();
this.CacheMap = new Map();
}
Object.defineProperty(e, "ins", {
get: function() {
null === e._inst && (e._inst = new this());
return e._inst;
},
enumerable: !1,
configurable: !0
});
e.prototype.init = function() {
if (!window.hsSkinInit) {
window.hsSkinInit = !0;
this.init2();
}
};
e.prototype.init2 = function() {
var e = this, t = cc.assetManager.pipeline.pipes[0];
cc.assetManager.pipeline.pipes[0] = function(n, i) {
t(n, function(t) {
if (n.output) {
var r = Array.isArray(n.output) ? n.output : [ n.output ];
n.output = o(r);
if (Array.isArray(r)) for (var a = 0; a < r.length; a++) try {
e.replaceInputItem(r[a]);
} catch (e) {}
}
null == i || i(t);
});
};
};
e.prototype.replaceInputItem = function(e) {
e && this.skinConfigs && (e.info ? e.info.url && -1 !== e.info.url.indexOf(".fire") ? this.replaceScene(e) : e.info.path && (e.options && "__asyncLoadAssets__" in e.options ? this.replacePath(e, !1) : this.replacePath(e)) : this.replaceUUID(e));
};
e.prototype.replaceUUID = function(e) {
if (e.uuid) {
var t = null, n = null;
cc.assetManager.bundles.forEach(function(i) {
n || (t = i.getAssetInfo(e.uuid)) && (n = i);
});
if (t && n && this.skinConfigs.get(t.path)) {
e.info = t;
e.config = n._config;
this.replacePath(e, !1);
}
}
};
e.prototype.replacePath = function(t, n) {
void 0 === n && (n = !0);
var i = this.getConfigWithItem(t);
if (i) {
var o = null;
try {
i.condition() && (o = i.replaceFunc());
} catch (e) {
return;
}
if (o && "string" == typeof o) {
var r = this.getBundleName(o);
r || (r = t.config.name);
var a = cc.assetManager.getBundle(r);
if (a) {
var s = this.getAssetPath(o), c = a.getInfoWithPath(s, t.info.ctor);
if (c) {
i.reload && e.clearAssetCache(t.uuid);
t.info = c;
t.config = a._config;
t.url && (t.url = this.generateUrl(t, c, a._config));
t.uuid && c.uuid && n && (t.uuid = c.uuid);
}
}
}
}
};
e.prototype.replaceScene = function(e) {
var t, n, i, o, r = null === (n = null === (t = null == e ? void 0 : e.info) || void 0 === t ? void 0 : t.url) || void 0 === n ? void 0 : n.lastIndexOf("/"), a = null === (o = null === (i = null == e ? void 0 : e.info) || void 0 === i ? void 0 : i.url) || void 0 === o ? void 0 : o.substring(r + 1), s = this.skinConfigs.get(a);
if (s) {
var c = null;
try {
s.condition() && (c = s.replaceFunc());
} catch (e) {
return;
}
if (c && "string" == typeof c) {
var l = this.getAssetPath(c), u = this.getBundleName(c);
u || (u = e.config.name);
var d = cc.assetManager.getBundle(u);
if (d && l) {
var h = d.getSceneInfo(l);
if (h) {
e.info = h;
e.config = d._config;
e.url && (e.url = this.generateUrl(e, h, d._config));
e.uuid && h.uuid && (e.uuid = h.uuid);
}
}
}
}
};
e.prototype.generateUrl = function(e, t, n) {
var i;
i = e.isNative ? n && n.nativeBase ? n.base + n.nativeBase : "" : n && n.importBase ? n.base + n.importBase : "";
var o = t.uuid, r = "";
t && (r = e.isNative ? t.nativeVer ? "." + t.nativeVer : "" : t.ver ? "." + t.ver : "");
return ".ttf" === e.ext ? i + "/" + o.slice(0, 2) + "/" + o + r + "/" + e.options.__nativeName__ : i + "/" + o.slice(0, 2) + "/" + o + r + e.ext;
};
e.prototype.getConfigWithItem = function(e) {
var t, n, i = this.skinConfigs.get(null === (t = e.info) || void 0 === t ? void 0 : t.path);
i || (i = this.skinConfigs.get((null === (n = e.info) || void 0 === n ? void 0 : n.path) + e.ext));
return i;
};
e.prototype.getAssetPath = function(e) {
if (this.isLocalPath(e)) return e;
var t = e.indexOf("/");
return -1 !== t ? e.substring(t + 1) : e;
};
e.prototype.isLocalPath = function(e) {
return e.startsWith("res/") || e.startsWith("texture/") || e.startsWith("prefab/") || e.startsWith("spine/") || e.startsWith("textures/") || e.startsWith("prefabs/") || e.startsWith("spines/") || e.startsWith("noatlas/");
};
e.prototype.getAssetInfo = function(e) {
var t = {
path: "",
type: null
};
this.isLocalPath(e) && (t.path = e);
var n = e.indexOf("/");
-1 !== n && (t.path = e.substring(n + 1));
t.type = this.getAssetType(e);
return t;
};
e.prototype.getAssetType = function(e) {
switch (cc.path.extname(e)) {
case ".json":
return cc.Asset;

case ".png":
return cc.Texture2D;

case ".atlas":
return cc.SpriteAtlas;

default:
return null;
}
};
e.prototype.getBundleName = function(e) {
if (this.isLocalPath(e)) return null;
var t = e.indexOf("/");
return -1 !== t ? e.substring(0, t) : null;
};
e.prototype.initConfig = function(e) {
this.init();
this.skinConfigs = e;
};
e.prototype.addSkinConfig = function(e, t) {
e.includes("##") ? this.skinRegConfigs.set(e.replace("##", ""), t) : this.skinConfigs.set(e, t);
};
e.clearAssetCache = function(e) {
cc.assetManager.assets.remove(e);
cc.assetManager.dependUtil.remove(e);
};
e._inst = null;
return e;
}();
n.HSSkinManager = r;
cc._RF.pop();
}, {} ],
HSTaskList: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "fb218KE4xBCNb6QufPjd6Qw", "HSTaskList");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
});
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSTaskList = void 0;
var r = e("../../utils/HSTimeUtils"), a = function(e) {
o(t, e);
function t(t) {
void 0 === t && (t = "TaskList");
var n = e.call(this, t) || this;
n.taskIndex = 0;
n._tasks = [];
n._asyncMode = !1;
n.host = null;
n.retry = 0;
return n;
}
t.prototype.initTaskCallbacks = function(e) {
var t = this;
try {
var n = e.onBegin, i = e.onCompleted, o = e.onError, r = e.onProgress;
e.onBegin = {
handler: function(e, i) {
n && n.handler && n.handler.call(n.target, n.data);
t.onTaskBegin(e, i);
},
target: this,
data: e
};
e.onCompleted = {
handler: function(e, n) {
i && i.handler && i.handler.call(i.target, i.data);
t.onTaskCompleted(e, n);
},
target: this,
data: e
};
e.onError = {
handler: function(e, n) {
o && o.handler && o.handler.call(o.target, o.data);
t.onTaskError(e, n);
},
target: this,
data: e
};
e.onProgress = {
handler: function(e, n) {
r && r.handler && r.handler.call(r.target, r.data);
t.onTaskProgress(e, n);
},
target: this,
data: e
};
} catch (e) {
cc.error(e);
}
};
t.prototype.onTaskBegin = function() {};
t.prototype.onTaskCompleted = function() {
this.callListener(this.onProgress);
this.taskIndex++;
if (null !== this.host && this.checkAllCompoleted()) {
this.alreadyCompoleted = !0;
this.callListener(this.onCompleted);
this.callListener(this.onSubListCompleted);
} else {
var e = this, t = function() {
e.beginNexTaskHandler = null;
try {
e.beginNextTask(e);
} catch (e) {
cc.error("TaskList执行异常:", e);
}
};
this.beginNexTaskHandler = t;
r.HSTimeUtils.setTimeout(t, this, 0);
}
};
t.prototype.onTaskProgress = function() {
this.callListener(this.onProgress);
};
t.prototype.onTaskError = function(e, t) {
if (this.onError && this.onError.handler) try {
this.onError.handler.call(this.onError.target, this, t);
} catch (e) {
cc.error(e);
}
if (this.retry > 0) {
t.reset();
r.HSTimeUtils.setTimeout(function() {
t.begin();
}, this, this.retry);
}
};
t.prototype.beginNextTask = function() {
if (this.checkAllCompoleted()) {
this.alreadyCompoleted = !0;
this.callListener(this.onCompleted);
this.callListener(this.onSubListCompleted);
} else if (!this.asyncMode) {
var e = this._tasks[this.taskIndex];
if (e) {
this.initTaskCallbacks(e);
e.begin();
this.callListener(this.onProgress);
}
}
};
t.prototype.checkAllCompoleted = function() {
for (var e = !0, t = 0; t < this._tasks.length; t++) if (!this._tasks[t].completed) {
e = !1;
break;
}
return e;
};
t.prototype.reset = function() {
if (this.beginNexTaskHandler) {
r.HSTimeUtils.clearTimeout(this.beginNexTaskHandler, this);
this.beginNexTaskHandler = null;
}
e.prototype.reset.call(this);
for (var t = 0; t < this._tasks.length; t++) {
var n = this._tasks[t];
n.cancel();
n.reset();
}
this.taskIndex = 0;
};
t.prototype.begin = function() {
if (this.asyncMode) for (var e = 0; e < this._tasks.length; e++) {
var t = this._tasks[e];
this.initTaskCallbacks(t);
t.begin();
} else {
this.beginNextTask(this);
this.callListener(this.onBegin);
}
};
t.prototype.cancel = function() {
this.reset();
};
t.prototype.add = function(e) {
if (e) {
e instanceof t && (e.host = this);
this._tasks.push(e);
}
};
t.prototype.remove = function(e) {
var n = this._tasks.indexOf(e);
if (n >= 0) {
var i = this._tasks[n];
if (i instanceof t) {
var o = i;
o.host = null;
o.clear();
}
i.onBegin = i.onError = i.onCompleted = i.onProgress = null;
this._tasks.splice(n, 1);
}
};
t.prototype.clear = function() {
for (var e = 0; e < this._tasks.length; e++) {
var n = this._tasks[e];
n instanceof t && n.clear();
n.onBegin = n.onError = n.onCompleted = n.onProgress = null;
}
this._tasks.length = 0;
};
Object.defineProperty(t.prototype, "asyncMode", {
get: function() {
return this._asyncMode;
},
set: function(e) {
this._asyncMode = e;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "tasks", {
get: function() {
return this._tasks.slice(0);
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "progress", {
get: function() {
if (this._tasks.length > 0) {
for (var e = 0, t = 1 / this._tasks.length, n = 0; n < this._tasks.length; n++) e += t * this._tasks[n].progress;
e >= .99 && (e = 1);
return e;
}
return 1;
},
enumerable: !1,
configurable: !0
});
return t;
}(e("./HSTask").HSTask);
n.HSTaskList = a;
cc._RF.pop();
}, {
"../../utils/HSTimeUtils": "HSTimeUtils",
"./HSTask": "HSTask"
} ],
HSTask: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "8d011KnDgFFhIgS/1ebueaT", "HSTask");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSTask = void 0;
var i = e("../../utils/HSTimeUtils"), o = function() {
function e(e, t) {
void 0 === e && (e = "Task");
void 0 === t && (t = !0);
this.retryMax = 0;
this.retryCounter = 0;
this.alreadyBegin = !1;
this.alreadyCompoleted = !1;
this._customOverTime = 0;
this._beginTimer = 0;
this._endTimer = 0;
this.useTimeout = !0;
this.text = e;
this.useTimeout = t;
}
e.prototype.overTimeEnd = function() {
this.useTimeout && i.HSTimeUtils.clearTimeout(this.overTimerHandler, this);
};
e.prototype.callListener = function(e, t) {
if (e) {
e === this.onBegin && (this.alreadyBegin = !0);
if (e === this.onCompleted) {
if (this.callListener_completed) return;
this.callListener_completed = !0;
}
if (e.handler) {
if (e === this.onCompleted) {
this.overTimeEnd();
this.alreadyCompoleted = !0;
this.alreadyBegin = !1;
this._endTimer = new Date().getTime();
}
try {
e.handler.call(e.target, this, void 0 !== t ? t : this);
} catch (e) {}
}
}
};
e.prototype.getOverTimeSetting = function() {
return 0;
};
e.prototype.afterOverTime = function() {};
e.prototype.startOverTimeCheck = function() {
if (this.useTimeout) {
i.HSTimeUtils.clearTimeout(this.overTimerHandler, this);
var e = this.getOverTimeSetting(), t = this.customOverTime;
e < t && (e = t);
if (!(e <= 0)) {
var n = this, o = function() {
if (!n.completed) {
new Date().getTime(), n._beginTimer;
n._isOvertime = !0;
n.afterOverTime();
n.callListener(n.onError);
}
};
this.overTimerHandler = o;
i.HSTimeUtils.setTimeout(o, this, e);
}
}
};
e.prototype.reset = function() {
this.overTimeEnd();
this.alreadyBegin = !1;
this.alreadyCompoleted = !1;
this.callListener_completed = !1;
this._isOvertime = !1;
this.retryCounter++;
};
e.prototype.begin = function() {
this._beginTimer = new Date().getTime();
this.startOverTimeCheck();
this.callListener(this.onBegin);
};
e.prototype.cancel = function() {
this.alreadyBegin = !1;
this.alreadyCompoleted = !1;
this.onBegin = this.onProgress = this.onCompleted = this.onError = null;
};
e.prototype.toStringAddon = function() {
return "";
};
e.prototype.toString = function() {
return (this.text || "Task") + this.toStringAddon();
};
e.prototype.getDebugInfo = function() {
return this._isOvertime ? "超时" : this.getDebugStatusInfo();
};
e.prototype.getDebugStatusInfo = function() {
return "失败";
};
Object.defineProperty(e.prototype, "customOverTime", {
get: function() {
return this._customOverTime;
},
set: function(e) {
this._customOverTime = e;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "isBegin", {
get: function() {
return this.alreadyBegin;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "completed", {
get: function() {
return this.alreadyCompoleted;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "progress", {
get: function() {
return this.alreadyCompoleted ? 1 : 0;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "beginTimer", {
get: function() {
return this._beginTimer;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "endTimer", {
get: function() {
return this._endTimer;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "useTime", {
get: function() {
return this._endTimer <= 0 || this._beginTimer <= 0 ? -1 : this._endTimer - this._beginTimer;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "isOvertime", {
get: function() {
return this._isOvertime;
},
enumerable: !1,
configurable: !0
});
return e;
}();
n.HSTask = o;
cc._RF.pop();
}, {
"../../utils/HSTimeUtils": "HSTimeUtils"
} ],
HSTimeUtils: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "31b44M9sclFwbduByFNw7wA", "HSTimeUtils");
var i = this && this.__awaiter || function(e, t, n, i) {
return new (n || (n = Promise))(function(o, r) {
function a(e) {
try {
c(i.next(e));
} catch (e) {
r(e);
}
}
function s(e) {
try {
c(i.throw(e));
} catch (e) {
r(e);
}
}
function c(e) {
e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, s);
var t;
}
c((i = i.apply(e, t || [])).next());
});
}, o = this && this.__generator || function(e, t) {
var n, i, o, r, a = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
},
trys: [],
ops: []
};
return r = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function s(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(r) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 
0) : i.next) && !(o = o.call(i, r[1])).done) return o;
(i = 0, o) && (r = [ 2 & r[0], o.value ]);
switch (r[0]) {
case 0:
case 1:
o = r;
break;

case 4:
a.label++;
return {
value: r[1],
done: !1
};

case 5:
a.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(o = a.trys, o = o.length > 0 && o[o.length - 1]) && (6 === r[0] || 2 === r[0])) {
a = 0;
continue;
}
if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
a.label = r[1];
break;
}
if (6 === r[0] && a.label < o[1]) {
a.label = o[1];
o = r;
break;
}
if (o && a.label < o[2]) {
a.label = o[2];
a.ops.push(r);
break;
}
o[2] && a.ops.pop();
a.trys.pop();
continue;
}
r = t.call(e, a);
} catch (e) {
r = [ 6, e ];
i = 0;
} finally {
n = o = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSTimeUtils = void 0;
var r = function() {
function e() {}
e.nextFrame = function() {
return new Promise(function(t) {
e.callLater(function() {
t(null);
}, null);
});
};
e.wait = function(t) {
return i(this, void 0, void 0, function() {
return o(this, function(n) {
switch (n.label) {
case 0:
return [ 4, new Promise(function(n) {
e.setTimeout(function() {
n(null);
}, null, t);
}) ];

case 1:
n.sent();
return [ 2 ];
}
});
});
};
e.callLater = function(e, t) {
cc.director.once(cc.Director.EVENT_AFTER_UPDATE, e, t);
};
e.clearTimeout = function(e, t) {
var n = cc.director.getScheduler(), i = t || cc.director.getScene();
n.enableForTarget(i);
n.unschedule(e, i);
};
e.clearAllTimeout = function(e) {
var t = cc.director.getScheduler(), n = e || cc.director.getScene();
t.enableForTarget(n);
t.unscheduleAllForTarget(n);
};
e.interval = function(e, t, n) {
var i = cc.director.getScheduler(), o = t || cc.director.getScene();
if (!o || "undefined" == typeof o.isValid || o.isValid) {
i.enableForTarget(o);
i.schedule(e, o, n, cc.macro.REPEAT_FOREVER, 0, !1);
}
};
e.setTimeout = function(e, t, n) {
var i = cc.director.getScheduler(), o = t || cc.director.getScene();
if (!o || "undefined" == typeof o.isValid || o.isValid) {
i.enableForTarget(o);
i.schedule(e, o, n, 0, 0, !1);
}
};
e.timeOut = function(e, t) {
void 0 === e && (e = 0);
return new Promise(function(n, i) {
var o = cc.director.getScheduler(), r = t || cc.director.getScene();
if (!r || "undefined" == typeof r.isValid || r.isValid) {
o.enableForTarget(r);
o.schedule(function() {
!r || "undefined" == typeof r.isValid || r.isValid ? n(null) : i(new Error("回调执行时目标对象已失效"));
}, r, e, 0, 0, !1);
} else i(new Error("目标对象已失效"));
});
};
e.getTimestamp = function() {
var e = new Date();
return "[" + e.getHours().toString().padStart(2, "0") + ":" + e.getMinutes().toString().padStart(2, "0") + ":" + e.getSeconds().toString().padStart(2, "0") + "." + e.getMilliseconds().toString().padStart(3, "0") + "]";
};
e.waitForFrames = function(e) {
return i(this, void 0, Promise, function() {
return o(this, function() {
return [ 2, new Promise(function(t) {
var n = 0, i = function() {
++n >= e ? t() : cc.director.once(cc.Director.EVENT_AFTER_UPDATE, i);
};
i();
}) ];
});
});
};
e.isNewDay = function(e, t) {
if (e >= t) return !1;
var n = new Date(e), i = new Date(t);
return n.getFullYear() !== i.getFullYear() || n.getMonth() !== i.getMonth() || n.getDate() !== i.getDate();
};
e.getCurrentMillisecond = function() {
return new Date().getTime();
};
e.getCurrentSecond = function() {
return Math.floor(new Date().getTime() / 1e3);
};
e.getTodayZeroMillisecond = function(e) {
var t = new Date(e);
t.setHours(0, 0, 0, 0);
return t.getTime();
};
e.getNextDayZeroMillisecond = function(e) {
var t = new Date(e);
t.setHours(0, 0, 0, 0);
t.setDate(t.getDate() + 1);
return t.getTime();
};
e.getDiffDays = function(e, t) {
var n = new Date(e), i = new Date(t);
n.setHours(0, 0, 0, 0);
i.setHours(0, 0, 0, 0);
var o = n.getTime(), r = i.getTime();
return Math.abs(Math.floor((r - o) / 864e5));
};
e.getTimeSpanFromMilliseconds = function(e) {
return {
days: Math.floor(e / 864e5),
hours: Math.floor(e % 864e5 / 36e5),
minutes: Math.floor(e % 36e5 / 6e4),
seconds: Math.floor(e % 6e4 / 1e3),
milliseconds: e % 1e3,
totalMilliseconds: e
};
};
e.formatCountdownByMilliseconds = function(e, t) {
void 0 === t && (t = !1);
if (e < 0) return "00:00:00";
var n = this.getTimeSpanFromMilliseconds(e), i = n.days, o = n.hours, r = n.minutes, a = n.seconds, s = o.toString().padStart(2, "0") + ":" + r.toString().padStart(2, "0") + ":" + a.toString().padStart(2, "0");
i > 0 && t && (s = i + ":" + s);
return s;
};
return e;
}();
n.HSTimeUtils = r;
cc._RF.pop();
}, {} ],
HSUIBase: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "52f69I8kFpJ3I9qk+9ukE0m", "HSUIBase");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), r = this && this.__decorate || function(e, t, n, i) {
var o, r = arguments.length, a = r < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, i); else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (r < 3 ? o(a) : r > 3 ? o(t, n, a) : o(t, n)) || a);
return r > 3 && a && Object.defineProperty(t, n, a), a;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
var a = e("./HSDelegateComponent"), s = e("./HSResManager"), c = e("./HSUIInterface"), l = e("./HSUIManager"), u = cc._decorator.ccclass, d = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.loadCost = 0;
t.loadResolve = null;
t.waitLoad = !1;
return t;
}
t.prototype.onLoad = function() {
var e;
(null === (e = this.params) || void 0 === e ? void 0 : e.onLoad) && this.params.onLoad();
};
t.prototype.onSysBack = function() {
this.closeSelf();
return !0;
};
t.prototype.removeEvents = function() {};
t.prototype.enter = function() {};
t.prototype.onAdded = function(e) {
var t;
this.enter(e);
this.waitLoad || null === (t = this.getComponent(a.HSDelegateComponent)) || void 0 === t || t.callLoadFinished();
};
t.prototype.loadFinish = function() {
var e;
null === (e = this.getComponent(a.HSDelegateComponent)) || void 0 === e || e.callLoadFinished();
};
t.prototype.onRemoved = function() {
this.leave();
};
t.prototype.onDestroy = function() {
cc.systemEvent.emit("UI_CLOSE_SELF", this.config);
};
t.prototype.onBeforeRemove = function() {};
t.prototype.playEnterAnimation = function(e) {
null == e || e();
};
t.prototype.onEnterAnimationEnd = function() {};
t.prototype.playLeaveAnimation = function(e) {
null == e || e();
};
t.prototype.leave = function() {};
t.prototype.closeSelf = function() {
var e;
(null === (e = this.params) || void 0 === e ? void 0 : e.onClose) && this.params.onClose();
this.isOnlyRemoveSelf() ? this.doRemoveSelf() : l.default.ins.close(this.config);
};
t.prototype.isOnlyRemoveSelf = function() {
return this.config && this.config.layer === c.HSLayerType.Notify;
};
t.prototype.doRemoveSelf = function() {
if (cc.isValid(this.node)) {
var e = this.getComponent(a.HSDelegateComponent);
if (e) {
var t = e.viewParams;
t.node = null;
e.remove(!0);
t.valid = !1;
} else this.node.destroy();
}
};
t.prototype.closeWithAnimation = function(e) {
this.playCloseAnimation(e, this.closeSelf.bind(this));
};
t.prototype.playCloseAnimation = function(e, t) {
var n = this.node.getComponent(cc.Animation);
if (n) {
var i = n.play(e);
n.scheduleOnce(function() {
null == t || t();
}, i.duration);
} else t();
};
t.prototype.loadPrefab = function(e, t) {
s.default.ins.loadPrefab(e, this.config.bundle).then(function(e) {
t(e);
});
};
t.prototype.setSprite = function(e, t) {
s.default.ins.loadSprite(e, t, this.config.bundle);
};
t.prototype.onHide = function() {};
t.prototype.onTop = function() {};
return r([ u ], t);
}(cc.Component);
n.default = d;
cc._RF.pop();
}, {
"./HSDelegateComponent": "HSDelegateComponent",
"./HSResManager": "HSResManager",
"./HSUIInterface": "HSUIInterface",
"./HSUIManager": "HSUIManager"
} ],
HSUIInterface: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "c02480o34dL9664uIyrfBZN", "HSUIInterface");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSViewParams = n.HSLayerType = void 0;
(function(e) {
e.MainScene = "LayerGame";
e.GameUI = "GameUI";
e.MainUI = "LayerUI";
e.PopUp = "HSLayerPopUp";
e.Dialog = "HSLayerDialog";
e.System = "LayerSystem";
e.Notify = "HSLayerNotify";
e.Guide = "LayerGuide";
e.BlackMask = "BlackMask";
})(n.HSLayerType || (n.HSLayerType = {}));
n.HSViewParams = function() {
this.valid = !0;
this.node = null;
};
cc._RF.pop();
}, {} ],
HSUIManager: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "7f605muMGxKBb0L/WZMRmqC", "HSUIManager");
var i = this && this.__awaiter || function(e, t, n, i) {
return new (n || (n = Promise))(function(o, r) {
function a(e) {
try {
c(i.next(e));
} catch (e) {
r(e);
}
}
function s(e) {
try {
c(i.throw(e));
} catch (e) {
r(e);
}
}
function c(e) {
e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, s);
var t;
}
c((i = i.apply(e, t || [])).next());
});
}, o = this && this.__generator || function(e, t) {
var n, i, o, r, a = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
},
trys: [],
ops: []
};
return r = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function s(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(r) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 
0) : i.next) && !(o = o.call(i, r[1])).done) return o;
(i = 0, o) && (r = [ 2 & r[0], o.value ]);
switch (r[0]) {
case 0:
case 1:
o = r;
break;

case 4:
a.label++;
return {
value: r[1],
done: !1
};

case 5:
a.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(o = a.trys, o = o.length > 0 && o[o.length - 1]) && (6 === r[0] || 2 === r[0])) {
a = 0;
continue;
}
if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
a.label = r[1];
break;
}
if (6 === r[0] && a.label < o[1]) {
a.label = o[1];
o = r;
break;
}
if (o && a.label < o[2]) {
a.label = o[2];
a.ops.push(r);
break;
}
o[2] && a.ops.pop();
a.trys.pop();
continue;
}
r = t.call(e, a);
} catch (e) {
r = [ 6, e ];
i = 0;
} finally {
n = o = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.UIZIndexEventType = n.ViewRoot = void 0;
var r = e("../utils/HSTimeUtils"), a = e("./HSResManager"), s = e("./HSUIBase"), c = e("./HSLayerBase"), l = e("./HSLayerNotify"), u = e("./HSLayerPopUp"), d = e("./HSUIInterface"), h = e("./HSLayerGameUI");
n.ViewRoot = "views";
var p, f = function() {
function e() {
this.viewsCache = new Map();
this.openingViewsQueue = new Map();
this.viewsOpenedQueue = new Array();
this.viewOpenedTimes = new Map();
this.viewRoot = null;
this.lockNode = null;
this.blockMaskNode = null;
this.PURE_NAME = {
1: "PuzzleUI",
2: "MosaicUI",
4: "AdventureProcessUI",
5: "TetrisUI",
6: "ChaosUI",
7: "MosaicCoverUI",
8: "MosaicInsertUI",
9: "MosaicInsertUI",
10: "ClearPicUI",
11: "FillColorUI",
12: "RouteUI",
13: "MosaicRandomUI",
14: "PathUI",
15: "StoryUI",
16: "MosaicNoticeUI",
17: "ClearPicMosaicUI",
18: "MosaicClipUI",
19: "RaffleUI",
20: "StepUI",
21: "PuzzleGameUI"
};
this.initRoot();
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onSysKeyDown, this);
}
Object.defineProperty(e, "ins", {
get: function() {
null === e._inst && (e._inst = new this());
e._inst.rootNodeValid();
return e._inst;
},
enumerable: !1,
configurable: !0
});
e.prototype.onSysKeyDown = function(e) {
if ((e.keyCode === cc.macro.KEY.back || e.keyCode === cc.macro.KEY.escape) && cc.isValid(this.viewRoot, !0)) for (var t = [ this.guide, this.notify, this.system, this.popup, this.dialog, this.mainUI, this.gameUI, this.game ], n = 0; n < t.length; n++) if (cc.isValid(t[n]) && this.checkLayerOnKeyBack(t[n])) return;
};
e.prototype.checkLayerOnKeyBack = function(e) {
for (var t = e.children, n = 0; n < t.length; n++) {
var i = t[n];
if (cc.isValid(i) && i.activeInHierarchy) {
var o = i.getComponent(s.default);
if (o) {
if (o.config.isOptionLayer && o.onSysBack()) return !0;
if (o.config.stopSysClkEvent) return !0;
}
}
}
return !1;
};
e.prototype.destroy = function() {
this.viewsCache.clear();
this.viewsOpenedQueue = [];
};
e.prototype.rootNodeValid = function() {
var e = cc.director.getScene();
if (e) {
var t = null == e ? void 0 : e.getChildByName("Canvas");
this.viewRoot = null == t ? void 0 : t.getChildByName("ui_root");
this.viewRoot && cc.isValid(this.viewRoot) || this.initRoot();
}
};
e.prototype.initRoot = function() {
var e = cc.director.getScene(), t = null == e ? void 0 : e.getChildByName("Canvas");
this.viewRoot = null == t ? void 0 : t.getChildByName("ui_root");
if (!this.viewRoot) {
this.viewRoot = this.create_node("ui_root");
null == t || t.addChild(this.viewRoot);
}
this.blockMaskNode = this.viewRoot.getChildByName("topdark");
this.game = this.create_node(d.HSLayerType.MainScene);
this.gameUI = new h.HSLayerGameUI(d.HSLayerType.GameUI);
this.mainUI = new c.HSLayerBase(d.HSLayerType.MainUI);
this.dialog = new h.HSLayerGameUI(d.HSLayerType.Dialog);
this.popup = new u.HSLayerPopUp(d.HSLayerType.PopUp);
this.system = new c.HSLayerBase(d.HSLayerType.System);
this.notify = new l.HSLayerNotify(d.HSLayerType.Notify);
this.guide = this.create_node(d.HSLayerType.Guide);
this.viewRoot.addChild(this.game);
this.viewRoot.addChild(this.gameUI);
this.viewRoot.addChild(this.mainUI);
this.viewRoot.addChild(this.dialog);
this.viewRoot.addChild(this.popup);
this.viewRoot.addChild(this.system);
this.viewRoot.addChild(this.notify);
this.viewRoot.addChild(this.guide);
this.lockNode = this.create_node("LockNode");
this.lockNode.addComponent(cc.BlockInputEvents);
if (this.blockMaskNode) {
this.blockMaskNode.zIndex = 10;
this.blockMaskNode.active = !1;
}
this.system.addChild(this.lockNode);
this.unlock();
};
e.prototype.getPureName = function(e) {
return this.PURE_NAME[e] || "AdventureUI";
};
e.prototype.setViewOpenedTimes = function(e) {
var t = this.viewOpenedTimes.get(e) || 0;
this.viewOpenedTimes.set(e, t + 1);
};
e.prototype.getViewOpenedTimes = function(e) {
return this.viewOpenedTimes.get(e) || 0;
};
e.prototype.loadPrefab = function(e, t, i) {
var o = this;
a.default.ins.loadPrefab(e, t.bundle).then(function(e) {
if (e) {
var r = cc.instantiate(e);
o.openingViewsQueue.delete(t.prefab);
i(r);
} else if (t.manyStyles && t.tryTimes < 1) {
t.tryTimes += 1;
o.loadPrefab(n.ViewRoot + "/" + t.prefab + 1, t, i);
}
});
};
e.prototype.preLoad = function(e) {
a.default.ins.load(e.prefab, e.bundle);
};
e.prototype.open = function(t, n, i) {
var o = this;
return new Promise(function(r) {
i || (i = {});
o.openingViewsQueue.set(t.prefab, t.prefab);
var a = i.onAdded, c = i.onRemoved;
i.onAdded = function(n, i) {
t.prefab;
o.openingViewsQueue.delete(t.prefab);
var c = n.getComponent(s.default);
if (c) {
e.ins.viewsCache.set(t.prefab, c);
c.config = t;
var l = [ d.HSLayerType.GameUI, d.HSLayerType.PopUp, d.HSLayerType.Dialog ];
if (l.includes(t.layer)) {
if (o.viewsOpenedQueue.length > 0) {
var u = o.viewsOpenedQueue[o.viewsOpenedQueue.length - 1], h = o.viewsCache.get(u);
h && h.config && l.includes(h.config.layer) && h.config.layer <= t.layer && o.handleUIZIndexChange(p.COVERED_BY_OTHER, h, c);
}
var f = o.viewsOpenedQueue.indexOf(t.prefab);
f >= 0 && o.viewsOpenedQueue.splice(f, 1);
o.viewsOpenedQueue.push(t.prefab);
}
}
null == a || a(n, i);
r(c);
};
i.onRemoved = function(n, i) {
t.prefab;
e.ins.viewsCache.delete(t.prefab);
if (o.openingViewsQueue.has(t.prefab)) {
o.openingViewsQueue.delete(t.prefab);
t.prefab;
}
var r = o.viewsOpenedQueue.indexOf(t.prefab);
r >= 0 && o.viewsOpenedQueue.splice(r, 1);
null == c || c(n, i);
};
switch (t.layer) {
case d.HSLayerType.GameUI:
o.gameUI.add(t, n, i);
break;

case d.HSLayerType.MainUI:
o.mainUI.add(t, n, i);
break;

case d.HSLayerType.PopUp:
o.popup.add(t, n, i);
break;

case d.HSLayerType.Dialog:
o.dialog.add(t, n, i);
break;

case d.HSLayerType.System:
o.system.add(t, n, i);
break;

case d.HSLayerType.Notify:
o.notify.add(t, n, i);
}
});
};
e.prototype.openScene = function(e, t) {
var n = this;
a.default.ins.loadScene(e, function() {
return i(n, void 0, void 0, function() {
return o(this, function(e) {
switch (e.label) {
case 0:
return t ? [ 4, r.HSTimeUtils.timeOut(0, this) ] : [ 3, 2 ];

case 1:
e.sent();
this.open(t);
e.label = 2;

case 2:
return [ 2 ];
}
});
});
});
};
e.prototype.close = function(e) {
if (e) {
var t = this.viewsOpenedQueue.indexOf(e.prefab);
if (t >= 0) {
this.viewsOpenedQueue.splice(t, 1);
var n = [ d.HSLayerType.GameUI, d.HSLayerType.PopUp, d.HSLayerType.Dialog ];
if (t === this.viewsOpenedQueue.length - 1 && this.viewsOpenedQueue.length > 0 && n.includes(e.layer)) {
var i = this.viewsOpenedQueue[this.viewsOpenedQueue.length - 1], o = this.viewsCache.get(i);
o && o.config && n.includes(o.config.layer) && this.handleUIZIndexChange(p.RESET_TO_FRONT, o);
}
}
switch (e.layer) {
case d.HSLayerType.GameUI:
this.gameUI.remove(e.prefab);
break;

case d.HSLayerType.MainUI:
this.mainUI.remove(e.prefab);
break;

case d.HSLayerType.PopUp:
this.popup.remove(e.prefab);
break;

case d.HSLayerType.Dialog:
this.dialog.remove(e.prefab);
break;

case d.HSLayerType.System:
this.system.remove(e.prefab);
break;

case d.HSLayerType.Notify:
this.notify.remove(e.prefab);
}
}
};
e.prototype.getUI = function(e) {
return this.viewsCache.get(e) || null;
};
e.prototype.getUIByConfig = function(e) {
return this.viewsCache.get(e.prefab) || null;
};
e.prototype.isUIOpeningOrOpened = function(e) {
var t = this.getUIByConfig(e);
if (t && cc.isValid(t.node) && t.node.parent) return !0;
if (this.openingViewsQueue.has(e.prefab)) return !0;
if (this.viewsOpenedQueue.includes(e.prefab)) {
var n = this.viewsCache.get(e.prefab);
if (n && n.node && cc.isValid(n.node) && n.node.parent) return !0;
var i = this.viewsOpenedQueue.indexOf(e.prefab);
if (i >= 0) {
this.viewsOpenedQueue.splice(i, 1);
e.prefab;
}
}
return !1;
};
e.prototype.invoke = function(e, t) {
for (var n = [], i = 2; i < arguments.length; i++) n[i - 2] = arguments[i];
var o = this.getUI(e.prefab);
if (o) return o[t].apply(o, n);
};
e.prototype.lock = function() {
this.lockNode.active = !0;
};
e.prototype.unlock = function() {
this.lockNode.active = !1;
};
e.prototype.pfNodeDo = function(e, t, n) {
for (var i = cc.instantiate(e.children[0]), o = 0; o < t; o++) {
var r = e.children[o];
r || ((r = o === t - 1 ? i : cc.instantiate(i)).parent = e);
null == n || n(r, o);
}
};
e.prototype.showBlackMask = function(e) {
this.blockMaskNode && (this.blockMaskNode.active = e);
};
e.prototype.create_node = function(e) {
var t = new cc.Node(e), n = t.addComponent(cc.Widget);
n.isAlignLeft = !0;
n.isAlignRight = !0;
n.isAlignTop = !0;
n.isAlignBottom = !0;
n.left = 0;
n.right = 0;
n.top = 0;
n.bottom = 0;
n.alignMode = cc.Widget.AlignMode.ALWAYS;
n.enabled = !0;
return t;
};
e.prototype.isUICovered = function(e) {
if (!e || !e.config) return null;
var t = this.viewsOpenedQueue.indexOf(e.config.prefab);
if (t < 0 || t === this.viewsOpenedQueue.length - 1) return null;
for (var n = this.viewsOpenedQueue.length - 1; n > t; n--) {
var i = this.viewsOpenedQueue[n], o = this.viewsCache.get(i);
if ((!o || !o.config || o.config.listenUILayerEvent) && o && o.config.layer >= e.config.layer) return o;
}
return null;
};
e.prototype.handleUIZIndexChange = function(e, t, n) {
if (t && t.config) {
var i = [ d.HSLayerType.GameUI, d.HSLayerType.PopUp, d.HSLayerType.Dialog ];
i.includes(t.config.layer) && (n && n.config && !i.includes(n.config.layer) && e === p.COVERED_BY_OTHER || (e === p.COVERED_BY_OTHER && t.onHide ? t.onHide(n) : e === p.RESET_TO_FRONT && t.onTop && t.onTop()));
}
};
e._inst = null;
return e;
}();
n.default = f;
(function(e) {
e[e.RESET_TO_FRONT = 0] = "RESET_TO_FRONT";
e[e.COVERED_BY_OTHER = 1] = "COVERED_BY_OTHER";
})(p = n.UIZIndexEventType || (n.UIZIndexEventType = {}));
cc._RF.pop();
}, {
"../utils/HSTimeUtils": "HSTimeUtils",
"./HSLayerBase": "HSLayerBase",
"./HSLayerGameUI": "HSLayerGameUI",
"./HSLayerNotify": "HSLayerNotify",
"./HSLayerPopUp": "HSLayerPopUp",
"./HSResManager": "HSResManager",
"./HSUIBase": "HSUIBase",
"./HSUIInterface": "HSUIInterface"
} ],
HSUrlUtils: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "05053ifjftGN4WGomDgY7kq", "HSUrlUtils");
var i = this && this.__values || function(e) {
var t = "function" == typeof Symbol && Symbol.iterator, n = t && e[t], i = 0;
if (n) return n.call(e);
if (e && "number" == typeof e.length) return {
next: function() {
e && i >= e.length && (e = void 0);
return {
value: e && e[i++],
done: !e
};
}
};
throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, o = this && this.__read || function(e, t) {
var n = "function" == typeof Symbol && e[Symbol.iterator];
if (!n) return e;
var i, o, r = n.call(e), a = [];
try {
for (;(void 0 === t || t-- > 0) && !(i = r.next()).done; ) a.push(i.value);
} catch (e) {
o = {
error: e
};
} finally {
try {
i && !i.done && (n = r.return) && n.call(r);
} finally {
if (o) throw o.error;
}
}
return a;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HSUrlUtils = void 0;
var r = function() {
function e() {}
e.initUrlParams = function() {
var t, n;
if (!cc.sys.isBrowser) {
e._params = {};
return {};
}
if ("undefined" == typeof window || !window.location) {
e._params = {};
return {};
}
if (e._params) return e._params;
var r = {}, a = window.location.href.split("?")[1];
if (a) {
var s = a.split("&");
try {
for (var c = i(s), l = c.next(); !l.done; l = c.next()) {
var u = l.value, d = o(u.split("="), 2), h = d[0], p = d[1];
h && (r[decodeURIComponent(h)] = p ? decodeURIComponent(p) : "");
}
} catch (e) {
t = {
error: e
};
} finally {
try {
l && !l.done && (n = c.return) && n.call(c);
} finally {
if (t) throw t.error;
}
}
}
e._params = r;
};
e.getUrlParams = function() {
return e._params || {};
};
e.getUrlParam = function(t, n) {
void 0 === n && (n = "");
return e._params && e._params[t] || n;
};
e.isH5Environment = function() {
return cc.sys.isBrowser && "undefined" != typeof window && !!window.location;
};
e.getCurrentUrl = function() {
return e.isH5Environment() ? window.location.href : "";
};
e.getDomain = function() {
return e.isH5Environment() ? window.location.hostname : "";
};
e.getProtocol = function() {
return e.isH5Environment() ? window.location.protocol : "";
};
return e;
}();
n.HSUrlUtils = r;
cc._RF.pop();
}, {} ],
HsCommon: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "fa0f7Thy6FN2boUbe0RDk0R", "HsCommon");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.EnumHsNativeEvent = n.HsCommon = n.DataKey = void 0;
var i;
(function(e) {
e.adTime = "adTime";
e.adInterval = "adInterval";
})(i = n.DataKey || (n.DataKey = {}));
var o = function() {
function e() {}
e.DataKey = i;
return e;
}();
n.HsCommon = o;
(function(e) {
e.commitFeedbackInfo = "commitFeedbackInfo";
e.requirePlayMusic = "requirePlayMusic";
})(n.EnumHsNativeEvent || (n.EnumHsNativeEvent = {}));
cc._RF.pop();
}, {} ],
HsGlobalEventMgr: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "664e37kN+lLka4VSaut/mS3", "HsGlobalEventMgr");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
});
Object.defineProperty(n, "__esModule", {
value: !0
});
n.hsGlobalEventMgr = n.HsGlobalEventMgr = void 0;
var r = function(e) {
o(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
return t;
}(cc.EventTarget);
n.HsGlobalEventMgr = r;
var a = new r();
n.hsGlobalEventMgr = a;
cc._RF.pop();
}, {} ],
HsGlobal: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "4502aykd4dIdJssjOAIRUjU", "HsGlobal");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HsGlobal = void 0;
var i = function() {
function e() {}
e.blockGameSource = null;
e.isNewPlayInBlockSettingHome = !1;
e.sandLocalData = null;
e.abtestResult = null;
return e;
}();
n.HsGlobal = i;
window.___hs_game_global = i;
cc._RF.pop();
}, {} ],
HsLocalData: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "da086y4j4BBg46Cf2nBi4q9", "HsLocalData");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), r = this && this.__decorate || function(e, t, n, i) {
var o, r = arguments.length, a = r < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, i); else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (r < 3 ? o(a) : r > 3 ? o(t, n, a) : o(t, n)) || a);
return r > 3 && a && Object.defineProperty(t, n, a), a;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HsLocalData = void 0;
var a = e("../utils/HSDataBase"), s = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.cacheKey = "hs_local_data";
t._firstOpenTime = 0;
return t;
}
Object.defineProperty(t, "ins", {
get: function() {
if (null === t._inst) {
t._inst = new this();
t._inst.initData();
t._inst.initFirstOpenTime();
}
return t._inst;
},
enumerable: !1,
configurable: !0
});
t.prototype.initFirstOpenTime = function() {
if (0 === this._firstOpenTime) {
this._firstOpenTime = Date.now();
this.saveAll();
}
};
t.prototype.getDaysSinceFirstOpen = function() {
if (0 === this._firstOpenTime) return 0;
var e = Date.now() - this._firstOpenTime;
return Math.floor(e / 864e5);
};
t.prototype.isOpenedForAtLeastDays = function(e) {
return this.getDaysSinceFirstOpen() >= e;
};
t._inst = null;
r([ a.HSStaticData ], t.prototype, "_firstOpenTime", void 0);
return t;
}(a.HSDataBase);
n.HsLocalData = s;
cc._RF.pop();
}, {
"../utils/HSDataBase": "HSDataBase"
} ],
HsNative: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "497f7wuX01IKZ5QzkkJMwXn", "HsNative");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HsNative = void 0;
var i = e("../../hsApp"), o = e("./base-native"), r = e("./impl/Block-android"), a = e("./impl/Block-ios"), s = e("./impl/Sand-android"), c = e("./impl/Sand-ios"), l = e("./impl/web-native"), u = {
sand_crush: {
android: s.Sand_android,
ios: c.Sand_ios
},
bb: {
android: r.Block_android,
ios: a.Block_ios
}
};
window.getUrlParameter = function(e) {
if (!globalThis.location) return "";
for (var t = globalThis.location.search.substring(1).split("&"), n = 0; n < t.length; n++) {
var i = t[n].split("=");
if (i[0] === e) return decodeURIComponent(i[1]);
}
return "";
};
var d = [], h = 0, p = function() {
function e() {}
e.init = function() {
var t, n = "sand_crush";
"bb_android" !== i.hsApp.RUNTIME_ENV && "bb_ios" !== i.hsApp.RUNTIME_ENV || (n = "bb");
var o = u[n];
o || (o = u.sand_crush);
cc.sys.isNative ? cc.sys.os === cc.sys.OS_ANDROID ? e._iml = o.android : cc.sys.os === cc.sys.OS_IOS ? e._iml = o.ios : e._iml = l.web_native : e._iml = l.web_native;
e.initErrorHandler();
null === (t = e._iml) || void 0 === t || t.initWindowFunc();
};
e.initWindowFunc = function() {
e._iml.initWindowFunc();
};
e.cleanWindowFunc = function() {
var t;
null === (t = e._iml) || void 0 === t || t.cleanWindowFunc();
};
e.displayFeedback = function(t) {
var n;
void 0 === t && (t = 1);
return null === (n = e._iml) || void 0 === n ? void 0 : n.displayFeedback(t);
};
e.initErrorHandler = function() {
if ("sand_crush" === i.hsApp.RUNTIME_ENV) {
window.__resHandler = function(e) {
e && e.stack && e.stack;
var t = "";
e && e.message && (t = e.message);
var n = new Date().getTime();
if (!~d.indexOf(t) && n - h > 1e3) {
h = n;
d.push(t);
f.HsDataReporter.reportEvent("cocos_res_reporter", {
errorMsg: t
});
}
};
window.__errorEvent = function() {};
cc.sys.isNative && (window.__errorHandler = function(e, t, n, i) {
var o = {};
o.errorMessage = e;
o.file = t;
o.line = n;
o.message = i;
var r = JSON.stringify(o), a = new Date().getTime();
if (!~d.indexOf(e) && a - h > 1e3) {
h = a;
d.push(e);
f.HsDataReporter.reportEvent("cocos_log_reporter", {
error_str: r
});
}
});
}
};
e.userCommentInfo = function(t) {
var n;
return null === (n = e._iml) || void 0 === n ? void 0 : n.userCommentInfo(t);
};
e.noticeGameHide = function() {
var t;
return null === (t = e._iml) || void 0 === t ? void 0 : t.noticeGameHide();
};
e.closeNoSplash = function() {
var t;
return null === (t = e._iml) || void 0 === t ? void 0 : t.closeNoSplash();
};
e.gameWay = function(t) {
var n;
return null === (n = e._iml) || void 0 === n ? void 0 : n.gameWay(t);
};
e.getMaxEcpm = function(t) {
var n;
return null === (n = e._iml) || void 0 === n ? void 0 : n.getMaxEcpm(t);
};
e.reportData = function(t) {
var n;
return null === (n = e._iml) || void 0 === n ? void 0 : n.reportData(t);
};
e.reportCommonParams = function(t) {
var n;
return null === (n = e._iml) || void 0 === n ? void 0 : n.reportCommonParams(t);
};
e.getDeviceInfo = function() {
var t;
return null === (t = e._iml) || void 0 === t ? void 0 : t.getDeviceInfo();
};
e.showMoreSetting = function() {
var t;
return null === (t = e._iml) || void 0 === t ? void 0 : t.showMoreSetting();
};
e.noticeLoad = function(t, n) {
var i;
void 0 === t && (t = 0);
void 0 === n && (n = !0);
return null === (i = e._iml) || void 0 === i ? void 0 : i.noticeLoad(t, n);
};
e.getAdReady = function(t) {
var n;
return null === (n = e._iml) || void 0 === n ? void 0 : n.getAdReady(t);
};
e.nativeShowAdv = function(t) {
var n;
return null === (n = e._iml) || void 0 === n ? void 0 : n.nativeShowAdv(t);
};
e.closeBanner = function() {
var t;
return null === (t = e._iml) || void 0 === t ? void 0 : t.closeBanner();
};
e.comment = function(t) {
var n;
void 0 === t && (t = 1);
return null === (n = e._iml) || void 0 === n ? void 0 : n.comment(t);
};
e.uploadUserData = function(t) {
var n;
void 0 !== t.gameWayNum && null !== t.gameWayNum || (t.gameWayNum = t.user_waynum);
return null === (n = e._iml) || void 0 === n ? void 0 : n.uploadUserData(t);
};
e.shakeOnce = function(t, n) {
var i;
return null === (i = e._iml) || void 0 === i ? void 0 : i.shakeOnce(t, n);
};
e.shakeNew = function(t, n, i) {
var o;
return null === (o = e._iml) || void 0 === o ? void 0 : o.shakeNew(t, n, i);
};
e.isAStaues = function() {
return !1;
};
e.getVipState = function() {
var t;
return null === (t = e._iml) || void 0 === t ? void 0 : t.getVipState();
};
e.uploadSoundState = function(t) {
var n;
return null === (n = e._iml) || void 0 === n ? void 0 : n.uploadSoundState(t ? "1" : "0");
};
e.uploadBgmState = function(t) {
var n;
return null === (n = e._iml) || void 0 === n ? void 0 : n.uploadBgmState(t ? "1" : "0");
};
e.getNetStatus = function() {
var t, n;
return null === (n = null === (t = e._iml) || void 0 === t ? void 0 : t.getNetStatus()) || void 0 === n || n;
};
e.reportMarketData = function(t, n) {
var i;
return null === (i = e._iml) || void 0 === i ? void 0 : i.reportMarketData(t, n);
};
e._iml = o.HsBaseNative;
return e;
}();
n.HsNative = p;
var f = e("../dataReporter/DataReporter");
cc._RF.pop();
}, {
"../../hsApp": "hsApp",
"../dataReporter/DataReporter": "DataReporter",
"./base-native": "base-native",
"./impl/Block-android": "Block-android",
"./impl/Block-ios": "Block-ios",
"./impl/Sand-android": "Sand-android",
"./impl/Sand-ios": "Sand-ios",
"./impl/web-native": "web-native"
} ],
HsUIUtils: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "0c8281I1t9M65RU4E7Sroco", "HsUIUtils");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HsUIUtils = void 0;
n.HsUIUtils = {
bindButton: function(e, t) {
if (cc.isValid(e)) {
e.getComponent(cc.Button) || e.addComponent(cc.Button);
e.off("click");
e.on("click", function(e) {
null == t || t(e);
});
}
}
};
cc._RF.pop();
}, {} ],
"Sand-android": [ function(e, t, n) {
"use strict";
cc._RF.push(t, "55d38m+ortCOoMtDTYj4MEm", "Sand-android");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
});
Object.defineProperty(n, "__esModule", {
value: !0
});
n.Sand_android = void 0;
var r = e("../../../common/HsCommon"), a = e("../../../hsApp"), s = e("../base-native"), c = "org/cocos2dx/javascript/AppActivity", l = [ 0, 75, 100, 150, 200, 255 ], u = function(e) {
o(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.userCommentInfo = function(e) {
if (cc.sys.OS_ANDROID === cc.sys.os) return t.noticeApp({
name: "userCommentInfo",
info: e
});
};
t.comment = function(e) {
void 0 === e && (e = 1);
cc.sys.OS_ANDROID === cc.sys.os && t.noticeApp({
name: "comment",
info: "" + e
});
};
t.displayFeedback = function(e) {
void 0 === e && (e = 1);
cc.sys.OS_ANDROID === cc.sys.os && t.noticeApp({
name: "openFeedback",
info: "num"
});
};
t.reportData = function(e) {
if (cc.sys.OS_ANDROID === cc.sys.os) {
var t = JSON.stringify(e);
jsb.reflection.callStaticMethod(c, "noticeDataUp", "(Ljava/lang/String;)V", t);
}
};
t.reportCommonParams = function(e) {
if (cc.sys.OS_ANDROID === cc.sys.os) {
var n = JSON.stringify(e);
t.noticeApp({
name: "supPropUp",
info: n
});
}
};
t.noticeGameHide = function() {
return t.noticeApp({
name: "gameHide",
info: ""
});
};
t.closeNoSplash = function() {
return t.noticeApp({
name: "noSplash",
info: ""
});
};
t.gameWay = function(e) {
return t.noticeApp({
name: "gameWay",
info: e
});
};
t.getMaxEcpm = function(e) {
if (cc.sys.OS_ANDROID === cc.sys.os) {
var t = jsb.reflection.callStaticMethod(c, "getMaxEcpm", "(Ljava/lang/String;)Ljava/lang/String;", e);
if (!t) return 0;
var n = JSON.parse(t);
if (n.max_ecpm) return parseFloat(n.max_ecpm);
}
return 0;
};
t.noticeApp = function(e) {
if (cc.sys.OS_ANDROID === cc.sys.os) {
var t = jsb.reflection.callStaticMethod(c, "noticeApp", "(Ljava/lang/String;)Ljava/lang/String;", e ? JSON.stringify(e) : e);
return t ? JSON.parse(t) : null;
}
return null;
};
t.getDeviceInfo = function() {
return t.noticeApp({
name: "deviceLayer",
info: ""
});
};
t.showMoreSetting = function() {
return t.noticeApp({
name: "moreSet",
info: ""
});
};
t.noticeLoad = function(e, t) {
void 0 === e && (e = 0);
void 0 === t && (t = !0);
if (cc.sys.isNative && cc.sys.OS_ANDROID === cc.sys.os) {
e = 1 === e ? 0 : e;
JSON.stringify({
type: e
});
jsb.reflection.callStaticMethod(c, "noticeLoad", "(Ljava/lang/String;)V", JSON.stringify({
type: e
}));
}
};
t.getAdReady = function(e) {
return !cc.sys.isNative || cc.sys.OS_ANDROID !== cc.sys.os || jsb.reflection.callStaticMethod(c, "getAdReady", "(Ljava/lang/String;)Z", e);
};
t.nativeShowAdv = function(e) {
if (cc.sys.OS_ANDROID === cc.sys.os) {
JSON.stringify(e);
jsb.reflection.callStaticMethod(c, "noticeShowAD", "(Ljava/lang/String;)V", JSON.stringify(e));
}
};
t.closeBanner = function() {
cc.sys.isNative && cc.sys.OS_ANDROID === cc.sys.os && jsb.reflection.callStaticMethod(c, "noticeNoBanner", "()V");
};
t.uploadUserData = function(e) {
if (cc.sys.isNative && cc.sys.OS_ANDROID === cc.sys.os) return t.noticeApp({
name: "userUp",
info: JSON.stringify(e)
});
};
t.shakeOnce = function(e, t) {
if (cc.sys.isNative && cc.sys.OS_ANDROID === cc.sys.os) {
if (null == (e = l[e] || 255) || null == t) return;
e = Math.max(e, 0);
var n = "{timings:[0," + t + ",0,0],amplitudes:[0," + (e = Math.min(e, 255)) + ",0,0]}";
jsb.reflection.callStaticMethod(c, "noticeVibrateRepeat", "(Ljava/lang/String;)V", n);
}
};
t.shakeNew = function(e, t) {
this.shakeOnce(e, t);
};
t.initWindowFunc = function() {
var e = this;
cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID && "sand_crush" === a.hsApp.RUNTIME_ENV && (window.getAppNotice = function(t) {
if (t) try {
var n = void 0;
if ("string" == typeof t) {
t = t.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t").replace(/\f/g, "\\f");
n = JSON.parse(t);
}
switch (n.name) {
case "adBack":
case "adBack2":
break;

case "runBack":
cc.director.resume();
break;

case "adInCome":
break;

case "playBtnSound":
e.emit(r.EnumHsNativeEvent.requirePlayMusic, null);
break;

case "commitFeedbackInfo":
e.emit(r.EnumHsNativeEvent.commitFeedbackInfo, t);
}
if ("adBack" === n.name || "adBack2" === n.name) {
var i = 0;
"adBack" === n.name && 1 === parseInt(n.info.result + "") && (i = 1);
if (window.gameAdCallback) {
window.gameAdCallback(i);
window.gameAdCallback = null;
}
}
} catch (e) {}
});
};
t.getVipState = function() {
return !1;
};
t.getNetStatus = function() {
if (cc.sys.OS_ANDROID === cc.sys.os) {
var e = t.noticeApp({
name: "getNetStatus",
info: ""
});
if (e) return !!e.isNetworkAvailable;
}
return !0;
};
t.reportMarketData = function(e, t) {
if (cc.sys.OS_ANDROID === cc.sys.os) try {
var n = JSON.stringify(t);
jsb.reflection.callStaticMethod("org/cocos2dx/javascript/SDKBridge", "callNativeMarketData", "(Ljava/lang/String;Ljava/lang/String;)V", e, n);
} catch (e) {}
};
return t;
}(s.HsBaseNative);
n.Sand_android = u;
cc._RF.pop();
}, {
"../../../common/HsCommon": "HsCommon",
"../../../hsApp": "hsApp",
"../base-native": "base-native"
} ],
"Sand-ios": [ function(e, t, n) {
"use strict";
cc._RF.push(t, "b4e2bLGDgRNRpd3QE/ndpdt", "Sand-ios");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
});
Object.defineProperty(n, "__esModule", {
value: !0
});
n.Sand_ios = void 0;
var r = e("../../../common/HsCommon"), a = e("../../../hsApp"), s = e("../base-native"), c = "RootViewController", l = function(e) {
o(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.userCommentInfo = function(e) {
jsb.reflection.callStaticMethod("BCInterActive", "userCommentInfo:", e);
};
t.comment = function(e) {
void 0 === e && (e = 1);
jsb.reflection.callStaticMethod(c, "comment:info:", "", e);
};
t.displayFeedback = function(e) {
void 0 === e && (e = 1);
jsb.reflection.callStaticMethod("BCInterActive", "displayFeedback:realParam:", "", e);
};
t.reportData = function(e) {
var t = JSON.stringify(e);
jsb.reflection.callStaticMethod(c, "noticeDataUp:", t);
};
t.reportCommonParams = function(e) {
var t = JSON.stringify(e);
jsb.reflection.callStaticMethod("BCInterActive", "superProperties:", t);
};
t.uploadUserData = function(e) {
cc.sys.isNative && cc.sys.OS_IOS === cc.sys.os && jsb.reflection.callStaticMethod(c, "userUp:", JSON.stringify(e));
};
t.getDeviceInfo = function() {
var e = jsb.reflection.callStaticMethod("BCInterActive", "getAppBaseInfo:", "");
try {
return JSON.parse(e);
} catch (e) {
return null;
}
};
t.getMaxEcpm = function(e) {
var t = jsb.reflection.callStaticMethod("BCInterActive", "getMaxEcpm:", e);
if (!t) return 0;
try {
var n = JSON.parse(t);
if (n.max_ecpm) return parseFloat(n.max_ecpm);
} catch (e) {
return 0;
}
};
t.showMoreSetting = function() {
jsb.reflection.callStaticMethod(c, "moreSet:", "aa");
};
t.noticeLoad = function(e, t) {
void 0 === e && (e = 0);
void 0 === t && (t = !0);
jsb.reflection.callStaticMethod(c, "noticeLoad:", "" + JSON.stringify({
type: e
}));
};
t.getAdReady = function(e) {
return jsb.reflection.callStaticMethod(c, "getAdReadyByType:info:", "", e);
};
t.nativeShowAdv = function(e) {
cc.sys.OS_IOS === cc.sys.os && jsb.reflection.callStaticMethod(c, "noticeShowAD:info:", "", JSON.stringify(e));
};
t.closeBanner = function() {
cc.sys.isNative && cc.sys.OS_IOS === cc.sys.os && jsb.reflection.callStaticMethod(c, "noBanner:", "aa");
};
t.shakeOnce = function(e) {
cc.sys.isNative && cc.sys.OS_IOS === cc.sys.os && jsb.reflection.callStaticMethod(c, "playVibrate:", "" + e);
};
t.isSupportHaptic = function() {
var e = !1;
e = a.hsApp.isVersionGreaterOrEqual("1.2.3");
cc.sys.isNative && cc.sys.OS_IOS === cc.sys.os && e && (e = jsb.reflection.callStaticMethod("BCInterActive", "isSupportHaptics:", ""));
return e;
};
t.shakeNew = function(e, t, n) {
if (cc.sys.isNative && cc.sys.OS_IOS === cc.sys.os) {
if (!this.isSupportHaptic() || !n || n.length < 3) {
this.shakeOnce(e, t);
return;
}
try {
jsb.reflection.callStaticMethod("BCInterActive", "playContinuousHaptics:sharpness:duration:threaded:fullIntensity:", n[1] + "", n[0], n[2], !1, !1);
} catch (e) {}
}
};
t.noticeGameHide = function() {
jsb.reflection.callStaticMethod(c, "callNativeHide:", "aa}");
};
t.closeNoSplash = function() {
if (a.hsApp.isVersionGreaterOrEqual("1.2.3")) return jsb.reflection.callStaticMethod(c, "hideSplash:", "");
};
t.getAppVer = function() {
var e = this.getDeviceInfo(), t = e ? e.app_ver : null;
t || (t = e ? e.app_version : null);
t || (t = "1.0.0");
t = t.replace(/\./g, "");
var n = parseInt(t);
n && !Number.isNaN(n) || (n = 100);
return n;
};
t.gameWay = function(e) {
jsb.reflection.callStaticMethod(c, "userScheme:", "" + e);
};
t.initWindowFunc = function() {
var e = this;
if (cc.sys.isNative && cc.sys.os === cc.sys.OS_IOS && "sand_crush" === a.hsApp.RUNTIME_ENV) {
window.adBack = function(e) {
if (window.gameAdCallback) {
window.gameAdCallback(parseInt(e.result));
window.gameAdCallback = null;
}
};
window.adBack2 = function(e) {
if (window.gameAdCallback) {
window.gameAdCallback(parseInt(e.result));
window.gameAdCallback = null;
}
};
window.rewardCallback = function() {};
window.getAdPlayInfo = function(e) {
if (cc.sys.isNative) {
var t = e;
try {
"string" == typeof e && (t = JSON.parse(e));
if (t.adtype && "interstitial" === t.adtype) {
t.adstatus && t.adstatus;
t.adstatus && t.adstatus;
} else t.adtype && "reward" === t.adtype && t.adstatus && ("show_success" === t.adstatus || t.adstatus);
} catch (e) {}
}
};
window.commitFeedbackInfo = function(t) {
e.emit(r.EnumHsNativeEvent.commitFeedbackInfo, t);
};
window.playBtnSound = function() {
e.emit(r.EnumHsNativeEvent.requirePlayMusic, null);
};
}
};
t.isAStaues = function() {
return !1;
};
t.getVipState = function() {
return !1;
};
t.uploadSoundState = function(e) {
cc.sys.isNative && cc.sys.os === cc.sys.OS_IOS && "sand_crush" === a.hsApp.RUNTIME_ENV && a.hsApp.isVersionGreaterOrEqual("1.1.6") && jsb.reflection.callStaticMethod("BCInterActive", "setGameSoundEffectStatus:", e);
};
t.uploadBgmState = function(e) {
cc.sys.isNative && cc.sys.os === cc.sys.OS_IOS && "sand_crush" === a.hsApp.RUNTIME_ENV && a.hsApp.isVersionGreaterOrEqual("1.1.6") && jsb.reflection.callStaticMethod("BCInterActive", "setGameSoundMusicStatus:", e);
};
t.getNetStatus = function() {
return !cc.sys.isNative || cc.sys.os !== cc.sys.OS_IOS || "sand_crush" !== a.hsApp.RUNTIME_ENV || (!a.hsApp.isVersionGreaterOrEqual("1.2.3") || !!jsb.reflection.callStaticMethod("BCInterActive", "getNetStatus:", ""));
};
t.reportMarketData = function(e, t) {
if (cc.sys.isNative && cc.sys.os === cc.sys.OS_IOS) try {
var n = JSON.stringify(t);
jsb.reflection.callStaticMethod("BCInterActive", "callNativeMarket:dataInfo:", e, n);
} catch (e) {}
};
return t;
}(s.HsBaseNative);
n.Sand_ios = l;
cc._RF.pop();
}, {
"../../../common/HsCommon": "HsCommon",
"../../../hsApp": "hsApp",
"../base-native": "base-native"
} ],
SceneAdapter: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "eca3fQmeEhFpI0jgnAo6sv4", "SceneAdapter");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), r = this && this.__decorate || function(e, t, n, i) {
var o, r = arguments.length, a = r < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, i); else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (r < 3 ? o(a) : r > 3 ? o(t, n, a) : o(t, n)) || a);
return r > 3 && a && Object.defineProperty(t, n, a), a;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
var a = cc._decorator, s = a.ccclass, c = a.menu, l = function(e) {
o(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onLoad = function() {
this.resize();
cc.view.on("canvas-resize", this.resize.bind(this), this);
};
t.prototype.resize = function() {
var e = cc.view.getDesignResolutionSize(), t = this.node.getComponent(cc.Canvas);
if (cc.winSize.width / cc.winSize.height < e.width / e.height) {
t.fitWidth = !0;
t.fitHeight = !1;
} else {
t.fitWidth = !1;
t.fitHeight = !0;
}
};
return r([ s, c("通用/分辨率适配") ], t);
}(cc.Component);
n.default = l;
cc._RF.pop();
}, {} ],
StringUtils: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "818b92YAC9GsKV57Wpz8g6R", "StringUtils");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.StringUtils = void 0;
var i = function() {
function e() {}
e.arrayToString = function(e, t) {
void 0 === t && (t = ",");
return e ? "[" + e.join(t) + "]" : "";
};
e.arrayToStringDAColor1 = function(t) {
return t ? "[" + t.map(function(t) {
return e.arrayToStringDAColor2(t);
}).join(",") + "]" : "";
};
e.arrayToStringDAColor2 = function(e) {
return e ? Array.isArray(e) ? "{" + e.join(",") + "}" : e.toString() : "";
};
e.normalizeToArray2DString = function(e) {
return e ? "[" + e.map(function(e) {
return Array.isArray(e) ? "[" + e.join(",") + "]" : "[" + e + "]";
}).join(",") + "]" : "[]";
};
return e;
}();
n.StringUtils = i;
cc._RF.pop();
}, {} ],
TabButton: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "71203VuuDdEYame7FsxANcp", "TabButton");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), r = this && this.__decorate || function(e, t, n, i) {
var o, r = arguments.length, a = r < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, i); else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (r < 3 ? o(a) : r > 3 ? o(t, n, a) : o(t, n)) || a);
return r > 3 && a && Object.defineProperty(t, n, a), a;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
var a = e("./GMControlUtil"), s = cc._decorator.ccclass, c = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.label = null;
t.background = null;
t.normalColor = cc.color(136, 129, 129);
t.selectedColor = cc.color(60, 60, 124);
t._index = 0;
t._callback = null;
return t;
}
t.prototype.onLoad = function() {
this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
};
t.prototype.createUI = function() {
this.node.setContentSize(140, 80);
var e = new cc.Node("Background");
e.setContentSize(140, 80);
e.setParent(this.node);
this.background = e.addComponent(cc.Sprite);
this.background.type = cc.Sprite.Type.SLICED;
this.background.sizeMode = cc.Sprite.SizeMode.CUSTOM;
var t = a.HSGMControlUtil.createSolidColorTexture(136, 129, 129), n = new cc.SpriteFrame(t);
this.background.spriteFrame = n;
a.HSGMControlUtil.createFillParentWidget(e);
var i = new cc.Node("Label");
i.setContentSize(140, 80);
i.setParent(e);
a.HSGMControlUtil.createFillParentWidget(i);
this.label = i.addComponent(cc.Label);
this.label.string = "button";
this.label.fontSize = 32;
this.label.lineHeight = 32;
this.label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
this.label.verticalAlign = cc.Label.VerticalAlign.CENTER;
this.label.overflow = cc.Label.Overflow.CLAMP;
this.label.node.color = cc.color(255, 255, 255, 255);
this.label.useSystemFont = !0;
this.label.cacheMode = cc.Label.CacheMode.NONE;
};
t.prototype.init = function(e, t, n) {
this._index = e;
this._callback = n;
this.label || this.createUI();
if (this.label) {
this.label.string = t;
this.label.node.active = !1;
this.label.node.active = !0;
}
this.setSelected(!1);
};
t.prototype.onClick = function() {
this._callback && this._callback(this._index);
};
t.prototype.setSelected = function(e) {
this.background && (this.background.node.color = e ? this.selectedColor : this.normalColor);
};
return r([ s() ], t);
}(cc.Component);
n.default = c;
cc._RF.pop();
}, {
"./GMControlUtil": "GMControlUtil"
} ],
TabViewConfig: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "7be8eE3aapPbIWldkFz5H75", "TabViewConfig");
Object.defineProperty(n, "__esModule", {
value: !0
});
cc._RF.pop();
}, {} ],
TabView: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "28d18w86ZZER64CLOFZXMaI", "TabView");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), r = this && this.__decorate || function(e, t, n, i) {
var o, r = arguments.length, a = r < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, i); else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (r < 3 ? o(a) : r > 3 ? o(t, n, a) : o(t, n)) || a);
return r > 3 && a && Object.defineProperty(t, n, a), a;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
var a = e("./GMControlFactory"), s = e("./GMControlFactory"), c = e("./GMControlUtil"), l = e("./TabButton"), u = cc._decorator.ccclass, d = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.tabButtonContainer = null;
t.contentContainer = null;
t._tabButtons = [];
t._currentIndex = -1;
t._tabConfig = null;
return t;
}
t.prototype.onLoad = function() {
this.createUI();
};
t.prototype.createUI = function() {
c.HSGMControlUtil.createFillParentWidget(this.node);
var e = cc.view.getVisibleSize(), t = a.default.containerWidth, n = 2 * e.height / 3, i = new cc.Node("MainContainer");
i.setContentSize(t, 1400);
i.setAnchorPoint(.5, .5);
i.setParent(this.node);
c.HSGMControlUtil.createVerticalLayout(i, 0, 0, cc.Layout.ResizeMode.CONTAINER);
this.tabButtonContainer = new cc.Node("TabButtonContainer");
this.tabButtonContainer.setParent(i);
this.tabButtonContainer.width = t;
c.HSGMControlUtil.createGridLayout(this.tabButtonContainer, 4, 5, 5, cc.Layout.ResizeMode.CONTAINER);
var o = this.tabButtonContainer.addComponent(cc.Sprite);
o.type = cc.Sprite.Type.SLICED;
o.sizeMode = cc.Sprite.SizeMode.CUSTOM;
var r = c.HSGMControlUtil.createSolidColorTexture(66, 66, 66), s = new cc.SpriteFrame(r);
o.spriteFrame = s;
var l = new cc.Node("ScrollView");
l.setContentSize(t, 1400);
l.setParent(i);
var u = l.addComponent(cc.Sprite);
u.type = cc.Sprite.Type.SLICED;
u.sizeMode = cc.Sprite.SizeMode.CUSTOM;
var d = c.HSGMControlUtil.createSolidColorTexture(42, 42, 42), h = new cc.SpriteFrame(d);
u.spriteFrame = h;
var p = new cc.Node("Mask");
p.setContentSize(t, 1400);
p.setParent(l);
p.addComponent(cc.Mask);
this.contentContainer = new cc.Node("Content");
this.contentContainer.setContentSize(t, 2 * n);
this.contentContainer.setAnchorPoint(.5, 1);
this.contentContainer.setPosition(0, 700);
this.contentContainer.setParent(p);
c.HSGMControlUtil.createVerticalLayout(this.contentContainer, 10, 30, cc.Layout.ResizeMode.CONTAINER);
var f = l.addComponent(cc.ScrollView);
f.horizontal = !1;
f.vertical = !0;
f.inertia = !0;
f.brake = .75;
f.elastic = !0;
f.bounceDuration = .23;
f.content = this.contentContainer;
};
t.prototype.initWithConfig = function(e) {
this.tabButtonContainer.removeAllChildren();
this._tabButtons = [];
this._tabConfig = e;
if (e && e.tabs && 0 !== e.tabs.length) {
var t = this;
e.tabs.forEach(function(e, n) {
var i = new cc.Node("TabButton_" + n), o = i.addComponent(l.default);
t.tabButtonContainer.addChild(i);
t._tabButtons.push(i);
o.init(n, e.title, function(e) {
return t.switchTab(e);
});
});
}
};
t.prototype._setupContentFromConfig = function(e) {
for (var t = 0; t < e.length; t++) s.default.createControl(this.contentContainer, e[t]);
};
t.prototype.switchTab = function(e) {
var t, n;
if (e !== this._currentIndex) {
this._currentIndex >= 0 && (null === (n = (t = this._tabConfig.tabs[this._currentIndex]).onTabExit) || void 0 === n || n.call(t, this._currentIndex, this._tabButtons[this._currentIndex]));
this._currentIndex = e;
this.updateTabStates();
this._switchTabByRecreate(e);
}
};
t.prototype._switchTabByRecreate = function(e) {
var t, n;
this.contentContainer.removeAllChildren();
this._setupContentFromConfig(this._tabConfig.tabs[e].controls);
null === (n = (t = this._tabConfig.tabs[e]).onTabEnter) || void 0 === n || n.call(t, e, this._tabButtons[e]);
};
t.prototype.reloadTab = function() {
var e, t;
if (!(this._currentIndex < 0)) {
this.updateTabStates();
this.contentContainer.removeAllChildren();
this._setupContentFromConfig(this._tabConfig.tabs[this._currentIndex].controls);
null === (t = (e = this._tabConfig.tabs[this._currentIndex]).onTabEnter) || void 0 === t || t.call(e, this._currentIndex, this._tabButtons[this._currentIndex]);
}
};
t.prototype.updateTabStates = function() {
var e = this;
this._tabButtons.forEach(function(t, n) {
var i = t.getComponent(l.default);
i && i.setSelected(n === e._currentIndex);
});
};
return r([ u() ], t);
}(cc.Component);
n.default = d;
cc._RF.pop();
}, {
"./GMControlFactory": "GMControlFactory",
"./GMControlUtil": "GMControlUtil",
"./TabButton": "TabButton"
} ],
"base-native": [ function(e, t, n) {
"use strict";
cc._RF.push(t, "f634aiLBy5K7ZLwA3WCtWCz", "base-native");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HsBaseNative = n.StaticVersionCompatible = void 0;
var i = e("../../common/HsCommon"), o = e("../../common/HsGlobalEventMgr"), r = e("../../hsApp");
n.StaticVersionCompatible = function(e, t, n) {
return function(i, o, a) {
var s = a.value;
a.value = function() {
for (var i = [], o = 0; o < arguments.length; o++) i[o] = arguments[o];
return r.hsApp.isVersionGreaterOrEqual(e) ? s.apply(this, i) : n && "function" == typeof n ? n.apply(this, i) : void 0 !== t ? t : void 0;
};
return a;
};
};
var a = function() {
function e() {}
e.on = function(e, t, n) {
return o.hsGlobalEventMgr.on(e, t, n);
};
e.off = function(e, t, n) {
return o.hsGlobalEventMgr.off(e, t, n);
};
e.once = function(e, t, n) {
return o.hsGlobalEventMgr.once(e, t, n);
};
e.emit = function(e, t) {
return o.hsGlobalEventMgr.emit(e, t);
};
e.targetOff = function(e) {
return o.hsGlobalEventMgr.targetOff(e);
};
e.userCommentInfo = function() {};
e.noticeGameHide = function() {};
e.closeNoSplash = function() {};
e.gameWay = function() {};
e.getMaxEcpm = function() {
return 0;
};
e.reportData = function() {};
e.reportCommonParams = function() {};
e.getDeviceInfo = function() {
return {};
};
e.showMoreSetting = function() {};
e.noticeLoad = function(e, t) {
void 0 === e && (e = 0);
void 0 === t && (t = !0);
};
e.getAdReady = function() {
return !0;
};
e.nativeShowAdv = function() {};
e.closeBanner = function() {};
e.comment = function(e) {
void 0 === e && (e = 1);
};
e.displayFeedback = function(e) {
void 0 === e && (e = 1);
this.emit(i.EnumHsNativeEvent.commitFeedbackInfo, '{"comment":""}');
};
e.uploadUserData = function() {};
e.shakeOnce = function() {};
e.shakeNew = function() {};
e.initWindowFunc = function() {};
e.cleanWindowFunc = function() {};
e.getVipState = function() {
return !1;
};
e.isAStaues = function() {
return !1;
};
e.uploadSoundState = function() {};
e.uploadBgmState = function() {};
e.getNetStatus = function() {
return !0;
};
e.reportMarketData = function() {};
return e;
}();
n.HsBaseNative = a;
cc._RF.pop();
}, {
"../../common/HsCommon": "HsCommon",
"../../common/HsGlobalEventMgr": "HsGlobalEventMgr",
"../../hsApp": "hsApp"
} ],
bb_android: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "509cadoVaVNjqfC9HkcsVIf", "bb_android");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.bb_android = void 0;
var i = e("../module/dataReporter/DataReporter"), o = e("../module/features/Features"), r = e("../utils/HSResourceUtils"), a = function() {
function e() {}
e.ModelRemoveAd_getVipState = function() {
return !!window.sand.BBA_ModelRemoveAd_getVipState && window.sand.BBA_ModelRemoveAd_getVipState();
};
e.ClickDeviceModele_usr_data_ad_preload = function() {
if (window.sand.BBA_ClickDeviceModele_usr_data_ad_preload) return window.sand.BBA_ClickDeviceModele_usr_data_ad_preload();
};
e.AdLoadFreqExpCtrl_addTodyNum = function() {
if (window.sand.BBA_AdLoadFreqExpCtrl_addTodyNum) return window.sand.BBA_AdLoadFreqExpCtrl_addTodyNum();
};
e.FeatureController_isFeatureOpen = function(e) {
return !!window.sand.BBA_FeatureController_isFeatureOpen && window.sand.BBA_FeatureController_isFeatureOpen(e);
};
e.FeatureController_getFeatureKeyParam = function(e, t) {
return window.sand.BBA_FeatureController_getFeatureKeyParam ? window.sand.BBA_FeatureController_getFeatureKeyParam(e, t) : null;
};
e.FeatureController_blockSandDayWin = function() {
return window.sand.FeatureController_blockSandDayWin ? window.sand.FeatureController_blockSandDayWin() : null;
};
e.init = function() {
var e = this;
o.FeaturesMgr.boolFeature = function(t) {
return !!e.FeatureController_isFeatureOpen(t);
};
o.FeaturesMgr.intFeature = function(t) {
var n = e.FeatureController_getFeatureKeyParam(t, "value");
return null == n ? 0 : n;
};
o.FeaturesMgr.objFeature = function(t) {
var n = e.FeatureController_getFeatureKeyParam(t, "value");
return null == n ? null : n;
};
window.sand.BBA_SandLoad_loadBundle && (r.HSResourceUtils.loadBundle = function(e) {
return window.sand.BBA_SandLoad_loadBundle(e);
});
i.HsDataReporter.reportEvent = function(e, t) {
if (window.sand.BBA_SandExtends_reportEvent) {
var n = t || {};
n.name = e;
window.sand.BBA_SandExtends_reportEvent(n);
}
};
};
return e;
}();
n.bb_android = a;
cc._RF.pop();
}, {
"../module/dataReporter/DataReporter": "DataReporter",
"../module/features/Features": "Features",
"../utils/HSResourceUtils": "HSResourceUtils"
} ],
bb_ios: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "33a3223A31NPKcbynx3JtqP", "bb_ios");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.bb_ios = void 0;
var i = e("../module/dataReporter/DataReporter"), o = e("../module/features/Features"), r = e("../utils/HSResourceUtils"), a = function() {
function e() {}
e.ModelRemoveAd_getVipState = function() {
var e;
return !!window.sand.BBA_ModelRemoveAd_getVipState && (null === (e = window.sand.BBA_ModelRemoveAd_getVipState()) || void 0 === e ? void 0 : e.isVip);
};
e.ClickDeviceModele_usr_data_ad_preload = function() {
if (window.sand.BBA_ClickDeviceModele_usr_data_ad_preload) return window.sand.BBA_ClickDeviceModele_usr_data_ad_preload();
};
e.ClickDeviceModele_gameLaunchProcess = function(e) {
if (window.sand.BBA_ClickDeviceModele_gameLaunchProcess && e) return window.sand.BBA_ClickDeviceModele_gameLaunchProcess(e);
};
e.AdLoadFreqExpCtrl_addTodyNum = function() {
if (window.sand.BBA_AdLoadFreqExpCtrl_addTodyNum) return window.sand.BBA_AdLoadFreqExpCtrl_addTodyNum();
};
e.FeatureController_isFeatureOpen = function(e) {
return !!window.sand.BBA_FeatureController_isFeatureOpen && window.sand.BBA_FeatureController_isFeatureOpen(e);
};
e.FeatureController_getFeatureKeyParam = function(e, t) {
return window.sand.BBA_FeatureController_getFeatureKeyParam ? window.sand.BBA_FeatureController_getFeatureKeyParam(e, t) : null;
};
e.init = function() {
var e = this;
o.FeaturesMgr.boolFeature = function(t) {
return !!e.FeatureController_isFeatureOpen(t);
};
o.FeaturesMgr.intFeature = function(t) {
var n = e.FeatureController_getFeatureKeyParam(t, "value");
return null == n ? 0 : n;
};
o.FeaturesMgr.objFeature = function(t) {
var n = e.FeatureController_getFeatureKeyParam(t, "value");
return null == n ? null : n;
};
window.sand.BBA_SandLoad_loadBundle && (r.HSResourceUtils.loadBundle = function(e) {
return window.sand.BBA_SandLoad_loadBundle(e);
});
i.HsDataReporter.reportEvent = function(e, t) {
if (window.sand.BBA_SandExtends_reportEvent) {
var n = t || {};
n.name = e;
window.sand.BBA_SandExtends_reportEvent(n);
}
};
};
return e;
}();
n.bb_ios = a;
cc._RF.pop();
}, {
"../module/dataReporter/DataReporter": "DataReporter",
"../module/features/Features": "Features",
"../utils/HSResourceUtils": "HSResourceUtils"
} ],
dependices: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "714c741+5NPDZdMNN7/323y", "dependices");
var i = this && this.__values || function(e) {
var t = "function" == typeof Symbol && Symbol.iterator, n = t && e[t], i = 0;
if (n) return n.call(e);
if (e && "number" == typeof e.length) return {
next: function() {
e && i >= e.length && (e = void 0);
return {
value: e && e[i++],
done: !e
};
}
};
throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.feature_dependices = n.depenicesResult = n.feature_dependices_config = void 0;
n.feature_dependices_config = {
feature1: [ "feature1", "feature2" ],
feature2: [ "feature1" ],
feature3: [ "feature1" ]
};
n.depenicesResult = {};
var o = function() {
function e() {}
e.hasCyclicDependency = function(e) {
if (e in n.depenicesResult) return n.depenicesResult[e];
var t = new Set(), o = new Set(), r = function(e) {
var a, s;
if (o.has(e)) return !0;
if (t.has(e)) return !1;
t.add(e);
o.add(e);
var c = n.feature_dependices_config[e] || [];
try {
for (var l = i(c), u = l.next(); !u.done; u = l.next()) {
var d = u.value;
if (r(d)) return !0;
}
} catch (e) {
a = {
error: e
};
} finally {
try {
u && !u.done && (s = l.return) && s.call(l);
} finally {
if (a) throw a.error;
}
}
o.delete(e);
return !1;
}, a = r(e);
n.depenicesResult[e] = a;
return a;
};
e.hasDependency = function(e) {
return void 0 !== n.feature_dependices_config[e];
};
e.clearCache = function(e) {
if (e) delete n.depenicesResult[e]; else for (var t = Object.keys(n.depenicesResult), i = 0; i < t.length; i++) delete n.depenicesResult[t[i]];
};
return e;
}();
n.feature_dependices = o;
cc._RF.pop();
}, {} ],
enviromentMgr: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "9b3c7pert9MOKdzJOcBYezj", "enviromentMgr");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.enviromentMgr = void 0;
var i = e("../hsApp"), o = e("./bb_android"), r = e("./bb_ios"), a = function() {
function e() {}
e.initEnv = function() {
var e = i.hsApp.RUNTIME_ENV;
"bb_android" === e ? o.bb_android.init() : "bb_ios" === e && r.bb_ios.init();
};
return e;
}();
n.enviromentMgr = a;
cc._RF.pop();
}, {
"../hsApp": "hsApp",
"./bb_android": "bb_android",
"./bb_ios": "bb_ios"
} ],
gameEnterMgr: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "ee8fcjUAclDHZ+XLXJP8I/w", "gameEnterMgr");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HsGameEnterMgr = void 0;
var i = e("../../hsApp"), o = function() {
function e() {}
e.enterPlast = function(e) {
i.hsApp.curRunGame = "plast";
cc.assetManager.loadBundle("blockplast", function(t, n) {
if (t) {
i.hsApp.curRunGame = "sandCrush";
null == e || e(!1);
} else n.loadScene("StartScene", function(t, n) {
if (t) {
i.hsApp.curRunGame = "sandCrush";
null == e || e(!1);
} else {
null == e || e(!0);
cc.director.runScene(n);
}
});
});
};
e.enterSand = function() {};
return e;
}();
n.HsGameEnterMgr = o;
cc._RF.pop();
}, {
"../../hsApp": "hsApp"
} ],
hsApp: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "3a6b2JY89lGWII8JbMxG73u", "hsApp");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.hsApp = void 0;
var i = {
app_ver: "1.0.0",
country: "us",
distinct_id: ""
}, o = [ "sand_crush", "bb_ios", "bb_android" ], r = function() {
function e() {}
Object.defineProperty(e, "distinctId", {
get: function() {
var e;
return (null === (e = this._deviceInfo) || void 0 === e ? void 0 : e.distinct_id) || null;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e, "deviceInfo", {
get: function() {
return this._deviceInfo;
},
set: function(e) {
var t;
e || (e = i);
e.app_ver = e.app_ver || e.app_version;
e.os_ver = e.os_ver || e.os_version;
e.deviceid = e.deviceid || (null === (t = e.distinct_id) || void 0 === t ? void 0 : t.split("_")[0]);
this._deviceInfo = e;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e, "resVersion", {
get: function() {
return this._resVersion || "";
},
set: function(e) {
this._resVersion = e;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e, "installTime", {
get: function() {
var e;
return Number((null === (e = this._deviceInfo) || void 0 === e ? void 0 : e.install_time) || 0);
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e, "deviceId", {
get: function() {
var e;
return (null === (e = this._deviceInfo) || void 0 === e ? void 0 : e.deviceid) || null;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e, "appVersion", {
get: function() {
var e;
return (null === (e = this._deviceInfo) || void 0 === e ? void 0 : e.app_ver) || "1.0.0";
},
enumerable: !1,
configurable: !0
});
e.getInstallDays = function() {
var t = e.installTime;
if (!t) return 0;
var n = Date.now() - t, i = Math.floor(n / 864e5);
return Math.max(0, i);
};
e.isInstalledMoreThanDays = function(t) {
return !(t < 0) && e.getInstallDays() > t;
};
e.set = function(t, n) {
e._map[t] = n;
};
e.get = function(t) {
return e._map[t] || null;
};
Object.defineProperty(e, "GameType", {
get: function() {
return e.isSandCrushGame() ? "0" : "15";
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e, "GameSubType", {
get: function() {
return "11";
},
enumerable: !1,
configurable: !0
});
e.updateDeviceInfo = function() {
if (cc.sys.isBrowser) {
e._deviceInfo = i;
var t = localStorage.getItem("web_sc_device_uid");
if (!t) {
t = s.HSMathUtils.generateUniqueId();
localStorage.setItem("web_sc_device_uid", t);
}
e._deviceInfo.distinct_id = t;
} else e.deviceInfo = a.HsNative.getDeviceInfo();
};
Object.defineProperty(e, "DeviceInfo", {
get: function() {
return e._deviceInfo || {};
},
enumerable: !1,
configurable: !0
});
e.initEnv = function() {
var t, n = null === (t = window.sand) || void 0 === t ? void 0 : t.__SH_GAME_ENV;
n && (-1 !== o.indexOf(n) ? e.RUNTIME_ENV = n : e.RUNTIME_ENV = "bb_android");
};
e.isMiniResVersion = function() {
return this.isMiniRes;
};
e.isSandCrushGame = function() {
return "sand_crush" === e.RUNTIME_ENV;
};
e.isBlkGame = function() {
return "bb_ios" === e.RUNTIME_ENV || "bb_android" === e.RUNTIME_ENV;
};
e.isRunBlockGame = function() {
return "plast" === e.curRunGame;
};
e.isRunSandGame = function() {
return "sandCrush" === e.curRunGame;
};
e.isRunDecompressGame = function() {
return "decompress" === e.curRunGame;
};
e.isVersionGreaterOrEqual = function(t) {
var n = e.appVersion;
return e.compareVersion(n, t) >= 0;
};
e.compareVersion = function(e, t) {
for (var n = e.split(".").map(Number), i = t.split(".").map(Number), o = Math.max(n.length, i.length), r = 0; r < o; r++) {
var a = n[r] || 0, s = i[r] || 0;
if (a > s) return 1;
if (a < s) return -1;
}
return 0;
};
e.isIos = function() {
return cc.sys.isNative, cc.sys.os === cc.sys.OS_IOS;
};
e.isAndroid = function() {
return cc.sys.isNative, cc.sys.os === cc.sys.OS_ANDROID;
};
e.RUNTIME_ENV = "sand_crush";
e.curRunGame = "sandCrush";
e.useGm = !1;
e.isMiniRes = !0;
e._resVersion = "";
e._deviceInfo = null;
e._deviceInfoMore = null;
e._map = {};
return e;
}();
n.hsApp = r;
e("./module/features/HSPlan");
var a = e("./module/native/HsNative"), s = e("./utils/HSMathUtils");
cc._RF.pop();
}, {
"./module/features/HSPlan": "HSPlan",
"./module/native/HsNative": "HsNative",
"./utils/HSMathUtils": "HSMathUtils"
} ],
hsgame: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "349765ekC9AILrDolNDJhmB", "hsgame");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.hsgame = void 0;
var i, o = e("./utils/HSMathUtils"), r = e("./utils/HSTimeUtils"), a = e("./utils/HSResourceUtils"), s = e("./utils/HSNodePool"), c = e("./ui/HSUIManager"), l = e("./module/native/HsNative"), u = e("./module/dataReporter/DataReporter"), d = e("./utils/HSObjectUtils"), h = e("./hsApp"), p = e("./module/features/Features"), f = e("./ui/HSSkinManager"), _ = e("./utils/AdvUtils"), g = e("./enviroment/enviromentMgr"), v = e("./utils/HsUIUtils"), m = e("./common/HsCommon"), y = e("./module/hotupdate/HSHotUpdate"), b = e("./module/features/HSPlan"), S = e("./module/gameEnter/gameEnterMgr"), w = e("./utils/HSUrlUtils"), C = e("./module/robot/HSRobotAutoTestMgr"), R = e("./utils/HSLogCollector"), M = e("./module/idea/HSIdeaManager"), T = e("./common/HsGlobalEventMgr"), O = e("./utils/HSMiniResManager");
(function(e) {
e.initEnvironment = function() {
h.hsApp.initEnv();
O.HSMiniResManager.init();
l.HsNative.init();
g.enviromentMgr.initEnv();
window.hsgame = e;
};
e.Common = m.HsCommon;
e.MathUtils = o.HSMathUtils;
e.TimeUtils = r.HSTimeUtils;
e.ResourceUtils = a.HSResourceUtils;
e.NodePool = s.HSNodePool;
e.UIManager = c.default;
e.Native = l.HsNative;
e.SkinManager = f.HSSkinManager;
e.DataReporter = u.HsDataReporter;
e.ObjectUtils = d.HSObjectUtils;
e.GamePlan = b.default;
e.App = h.hsApp;
e.Features = p.FeaturesMgr;
e.AdvUtils = _.HsAdvUtils;
e.UIUtils = v.HsUIUtils;
e.UrlUtils = w.HSUrlUtils;
e.RobotAutoTest = C.HSRobotAutoTestMgr;
e.hotupdate = new y.HSHotUpdate();
e.HotUpdatePackageType = y.PackageType;
e.IdeaManager = M.HSIdeaManager;
e.enterMgr = S.HsGameEnterMgr;
e.LogCollector = R.HSLogCollector;
e.globalEventMgr = T.hsGlobalEventMgr;
})(i = n.hsgame || (n.hsgame = {}));
window.___hs_game___ = i;
cc._RF.pop();
}, {
"./common/HsCommon": "HsCommon",
"./common/HsGlobalEventMgr": "HsGlobalEventMgr",
"./enviroment/enviromentMgr": "enviromentMgr",
"./hsApp": "hsApp",
"./module/dataReporter/DataReporter": "DataReporter",
"./module/features/Features": "Features",
"./module/features/HSPlan": "HSPlan",
"./module/gameEnter/gameEnterMgr": "gameEnterMgr",
"./module/hotupdate/HSHotUpdate": "HSHotUpdate",
"./module/idea/HSIdeaManager": "HSIdeaManager",
"./module/native/HsNative": "HsNative",
"./module/robot/HSRobotAutoTestMgr": "HSRobotAutoTestMgr",
"./ui/HSSkinManager": "HSSkinManager",
"./ui/HSUIManager": "HSUIManager",
"./utils/AdvUtils": "AdvUtils",
"./utils/HSLogCollector": "HSLogCollector",
"./utils/HSMathUtils": "HSMathUtils",
"./utils/HSMiniResManager": "HSMiniResManager",
"./utils/HSNodePool": "HSNodePool",
"./utils/HSObjectUtils": "HSObjectUtils",
"./utils/HSResourceUtils": "HSResourceUtils",
"./utils/HSTimeUtils": "HSTimeUtils",
"./utils/HSUrlUtils": "HSUrlUtils",
"./utils/HsUIUtils": "HsUIUtils"
} ],
"web-native": [ function(e, t, n) {
"use strict";
cc._RF.push(t, "9a67dxrdu9PWqkNQ9+X1rOv", "web-native");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
});
Object.defineProperty(n, "__esModule", {
value: !0
});
n.web_native = void 0;
var r = function(e) {
o(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
return t;
}(e("../base-native").HsBaseNative);
n.web_native = r;
cc._RF.pop();
}, {
"../base-native": "base-native"
} ]
}, {}, [ "FTFeatNode", "FTForEach", "FTFunc", "FTGlobalTree", "FTNode", "FTStatement", "FTUntilFalse", "FTUntilTrue", "HsCommon", "HsGlobal", "HsGlobalEventMgr", "HsLocalData", "SceneAdapter", "bb_android", "bb_ios", "enviromentMgr", "hsApp", "hsgame", "DataReporter", "HSRobotAutoTestDataReporter", "Features", "HSDynamicPlanConfig", "HSFeaturesCommon", "HSPlan", "HSPlanUtils", "dependices", "gameEnterMgr", "HSHotUpdate", "HSIdeaManager", "HSIdeaStrategy", "HSLogin", "HsNative", "base-native", "Block-android", "Block-ios", "Sand-android", "Sand-ios", "web-native", "HSRobotAutoTestBatchParams", "HSRobotAutoTestMgr", "HSTask", "HSTaskList", "HSDelegateComponent", "HSLayerBase", "HSLayerDialog", "HSLayerGameUI", "HSLayerNotify", "HSLayerPopUp", "HSResManager", "HSSkinManager", "HSUIBase", "HSUIInterface", "HSUIManager", "HSList", "HSListItem", "CustomHorizontalLayout", "GMControlConfig", "GMControlFactory", "GMControlUtil", "TabButton", "TabView", "TabViewConfig", "AdvUtils", "HSDataBase", "HSHttpUtils", "HSLogCollector", "HSMathUtils", "HSMiniResDefines", "HSMiniResManager", "HSNodePool", "HSObjectUtils", "HSResourceUtils", "HSTimeUtils", "HSUrlUtils", "HsUIUtils", "StringUtils" ]);