window.__require = function e(t, r, i) {
function o(p, c) {
if (!r[p]) {
if (!t[p]) {
var s = p.split("/");
s = s[s.length - 1];
if (!t[s]) {
var f = "function" == typeof __require && __require;
if (!c && f) return f(s, !0);
if (n) return n(s, !0);
throw new Error("Cannot find module '" + p + "'");
}
p = s;
}
var u = r[p] = {
exports: {}
};
t[p][0].call(u.exports, function(e) {
return o(t[p][1][e] || e);
}, u, u.exports, e, t, r, i);
}
return r[p].exports;
}
for (var n = "function" == typeof __require && __require, p = 0; p < i.length; p++) o(i[p]);
return o;
}({
IsSpeedUpReviveAnimTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "7fc66ZuzH1EB6Se37jQNVVf", "IsSpeedUpReviveAnimTrait");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
i(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), n = this && this.__decorate || function(e, t, r, i) {
var o, n = arguments.length, p = n < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) p = Reflect.decorate(e, t, r, i); else for (var c = e.length - 1; c >= 0; c--) (o = e[c]) && (p = (n < 3 ? o(p) : n > 3 ? o(t, r, p) : o(t, r)) || p);
return n > 3 && p && Object.defineProperty(t, r, p), p;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.IsSpeedUpReviveAnimTrait = void 0;
var p = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.oriSpeed = null;
return t;
}
t.prototype.onActive = function(e) {
hs.tp.isRevive_ProxyUpdateUI(e) && this.isSpeedUpReviveAnim();
hs.tp.isChapterRevive_ProxyOnClick_ok(e) && this.resetSpeed();
hs.tp.isClassRevive_ProxyOnClick_ok(e) && this.resetSpeed();
};
t.prototype.isSpeedUpReviveAnim = function() {
var e = !1;
hs.ipaComUtilsInfo.installDay > 3 && hs.NativeAd.getReadyByAdTypeOld("reward") && (e = !0);
if (e) {
var t = cc.director._kSpeed;
this.oriSpeed = t;
cc.director._kSpeed = 1.5 * t;
}
};
t.prototype.resetSpeed = function() {
if (this.oriSpeed) {
cc.director._kSpeed = this.oriSpeed;
this.oriSpeed = null;
}
};
return n([ classId("IsSpeedUpReviveAnimTrait") ], t);
}(Trait);
r.IsSpeedUpReviveAnimTrait = p;
cc._RF.pop();
}, {} ]
}, {}, [ "IsSpeedUpReviveAnimTrait" ]);
//# sourceMappingURL=index.js.map
