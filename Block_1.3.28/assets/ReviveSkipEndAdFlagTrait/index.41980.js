window.__require = function e(t, r, a) {
function i(s, o) {
if (!r[s]) {
if (!t[s]) {
var c = s.split("/");
c = c[c.length - 1];
if (!t[c]) {
var l = "function" == typeof __require && __require;
if (!o && l) return l(c, !0);
if (n) return n(c, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = c;
}
var v = r[s] = {
exports: {}
};
t[s][0].call(v.exports, function(e) {
return i(t[s][1][e] || e);
}, v, v.exports, e, t, r, a);
}
return r[s].exports;
}
for (var n = "function" == typeof __require && __require, s = 0; s < a.length; s++) i(a[s]);
return i;
}({
ReviveSkipEndAdFlagTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "0b284lZkvRGs4PpDeDqurZm", "ReviveSkipEndAdFlagTrait");
var a, i = this && this.__extends || (a = function(e, t) {
return (a = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
a(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), n = this && this.__decorate || function(e, t, r, a) {
var i, n = arguments.length, s = n < 3 ? t : null === a ? a = Object.getOwnPropertyDescriptor(t, r) : a;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, a); else for (var o = e.length - 1; o >= 0; o--) (i = e[o]) && (s = (n < 3 ? i(s) : n > 3 ? i(t, r, s) : i(t, r)) || s);
return n > 3 && s && Object.defineProperty(t, r, s), s;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ReviveSkipEndAdFlagTrait = void 0;
var s = function(e) {
i(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassRevive_Proxy",
methodName: "onRevive_Success"
}, {
className: "ChapterRevive_Proxy",
methodName: "onRevive_Success"
} ];
};
t.prototype.onActive = function(e) {
if (hs.tp.isReviveHookOnLoadComplete(e)) {
var t = null == (u = e.target) ? void 0 : u.btn;
if (!t || !cc.isValid(t)) return;
var r = t.getChildByName("__revive_tip__");
if (!r) {
var a = (r = new cc.Node("__revive_tip__")).addComponent(cc.Label);
a.string = "Revive to skip end-of-round ad!";
a.fontSize = 33;
a.lineHeight = 33;
a.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
a.verticalAlign = cc.Label.VerticalAlign.CENTER;
hs.ResLoader.load("fonts/achievement/Use Font", cc.Font, function(e, t) {
if (!e && a && cc.isValid(a.node)) {
a.font = t;
a.useSystemFont = !1;
}
});
r.parent = t;
r.opacity = 255;
r.scale = 1;
r.setPosition(cc.v2(0, .65 * -t.height));
r.zIndex = (t.zIndex || 0) + 1;
}
}
if (hs.tp.isClassRevive_ProxyOnRevive_Success(e) || hs.tp.isChapterRevive_ProxyOnRevive_Success(e)) {
var i = (o = hs.gameInfo.gameMode === hs.GameMode.Class) ? "classGameNum" : "chapterGameNum", n = o ? "classReviveSkipEndAdFlag" : "chapterReviveSkipEndAdFlag", s = (storage.getItem(i, 0) || 0) + 1;
storage.setItem(n, s);
}
if (hs.tp.isAdvertisement_FullScene_ProxyShowFullScreenAdvertisement(e)) {
if ((d = e.args[0]).data.type !== hs.FullScreenAdvertisePosState.FullScreen_GameOver) return;
i = (o = hs.gameInfo.gameType === hs.GameType.Class) ? "classGameNum" : "chapterGameNum", 
n = o ? "classReviveSkipEndAdFlag" : "chapterReviveSkipEndAdFlag";
var o, c = storage.getItem(i, 0) || 0, l = storage.getItem(n, -1) || -1;
if (c > 0 && l === c) {
e.replace = !0;
storage.setItem(n, -1);
(u = e.target).advertisementCallBack(d);
}
}
if (hs.tp.isChapterAdvertisement_FullScreenProxyShowFullScreenAdvertisement(e)) {
if ((d = e.args[0]).data.type !== hs.FullScreenAdvertisePosState.FullScreen_GameOver) return;
i = "chapterGameNum", n = "chapterReviveSkipEndAdFlag", c = storage.getItem(i, 0) || 0, 
l = storage.getItem(n, -1) || -1;
if (c > 0 && l === c) {
e.replace = !0;
storage.setItem(n, -1);
if (!(u = e.target)) return;
var v = hs.AdvertiseCallBackState.Advertise_Success;
u.advertisementCallBack(v, d);
u.closeGoOnGame();
u.dispatchModuleEvent(new hs.E_Advertisement_FullScreenOver({
state: v
}));
}
}
if (hs.tp.isClassAdvertisement_FullScreenProxyShowFullScreenAdvertisement(e)) {
var d;
if ((d = e.args[0]).data.type !== hs.FullScreenAdvertisePosState.FullScreen_GameOver) return;
i = "classGameNum", n = "classReviveSkipEndAdFlag", c = storage.getItem(i, 0) || 0, 
l = storage.getItem(n, -1) || -1;
if (c > 0 && l === c) {
e.replace = !0;
storage.setItem(n, -1);
var u;
if (!(u = e.target)) return;
v = hs.AdvertiseCallBackState.Advertise_Success;
u.advertisementCallBack(d, v);
u.closeGoOnGame();
u.dispatchModuleEvent(new hs.E_Advertisement_FullScreenOver({
state: v
}));
}
}
};
return n([ classId("ReviveSkipEndAdFlagTrait") ], t);
}(Trait);
r.ReviveSkipEndAdFlagTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "ReviveSkipEndAdFlagTrait" ]);
//# sourceMappingURL=index.js.map
