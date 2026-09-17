window.__require = function e(t, n, o) {
function i(r, l) {
if (!n[r]) {
if (!t[r]) {
var c = r.split("/");
c = c[c.length - 1];
if (!t[c]) {
var s = "function" == typeof __require && __require;
if (!l && s) return s(c, !0);
if (a) return a(c, !0);
throw new Error("Cannot find module '" + r + "'");
}
r = c;
}
var p = n[r] = {
exports: {}
};
t[r][0].call(p.exports, function(e) {
return i(t[r][1][e] || e);
}, p, p.exports, e, t, n, o);
}
return n[r].exports;
}
for (var a = "function" == typeof __require && __require, r = 0; r < o.length; r++) i(o[r]);
return i;
}({
LowDeviceBlockFullEffectTouchTrait: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "b4d2eHzWoxLfp0fPGqOK11/", "LowDeviceBlockFullEffectTouchTrait");
var o, i = this && this.__extends || (o = function(e, t) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
o(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), a = this && this.__decorate || function(e, t, n, o) {
var i, a = arguments.length, r = a < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, n) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, n, o); else for (var l = e.length - 1; l >= 0; l--) (i = e[l]) && (r = (a < 3 ? i(r) : a > 3 ? i(t, n, r) : i(t, n)) || r);
return a > 3 && r && Object.defineProperty(t, n, r), r;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.LowDeviceBlockFullEffectTouchTrait = void 0;
var r = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.FALLBACK_TIMEOUT = 2e3;
t.pendingRecoveryCallback = null;
return t;
}
t.prototype.onActive = function(e) {
if (this.isLowDevice()) {
hs.tp.isClassBoardSplashAnimation_ProxyOnBoardSplashAnimationPlay(e) && this.handleEnterSplashAnimation(e);
hs.tp.isClassBoardSplashAnimation_ProxySetBoardSplashAnimationState(e) && this.handleClassClearScreenAnimation(e);
hs.tp.isChapterBoardSplashAnimation_ProxyPlayBoardSplashAnimationForTraitOnly(e) && this.handleChapterClearScreenAnimation(e);
hs.tp.isGameOver_Splash_ProxyOnGameEndSplash(e) && this.handleSettlementAnimation(e);
hs.tp.isBoardSplashAnimation_ProxyOnBoardSplashAnimationEnd(e) && this.handleAnimationEnd(e);
hs.tp.isSkin_BoardSplashAnimation_ProxyOnBoardSplashAnimationClear_End(e) && this.handleClearAnimationEnd(e);
}
};
t.prototype.handleClearAnimationEnd = function() {
if (this.pendingRecoveryCallback) {
this.pendingRecoveryCallback();
this.pendingRecoveryCallback = null;
}
};
t.prototype.handleAnimationEnd = function() {
if (this.pendingRecoveryCallback) {
this.pendingRecoveryCallback();
this.pendingRecoveryCallback = null;
}
};
t.prototype.handleEnterSplashAnimation = function() {
this.createSafeMaskCallback();
};
t.prototype.handleClassClearScreenAnimation = function() {
this.createSafeMaskCallback();
};
t.prototype.handleChapterClearScreenAnimation = function() {
this.createSafeMaskCallback();
};
t.prototype.handleSettlementAnimation = function() {
this.createSafeMaskCallback();
};
t.prototype.isLowDevice = function() {
return hs.deviceLowInfo.totalRAMGB < 4;
};
t.prototype.createSafeMaskCallback = function() {
var e = this, t = Cinst(hs.BlocksProducerTouch);
t && t.setMaskActive(!0);
var n = !1;
this.pendingRecoveryCallback = function() {
if (!n) {
n = !0;
t && t.setMaskActive(!1);
e.pendingRecoveryCallback = null;
}
};
setTimeoutSafe(function() {
if (!n) {
n = !0;
t && t.setMaskActive(!1);
e.pendingRecoveryCallback = null;
}
}, this.FALLBACK_TIMEOUT);
};
return a([ classId("LowDeviceBlockFullEffectTouchTrait") ], t);
}(Trait);
n.LowDeviceBlockFullEffectTouchTrait = r;
cc._RF.pop();
}, {} ]
}, {}, [ "LowDeviceBlockFullEffectTouchTrait" ]);
//# sourceMappingURL=index.js.map
