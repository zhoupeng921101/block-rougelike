window.__require = function e(r, t, o) {
function n(s, p) {
if (!t[s]) {
if (!r[s]) {
var c = s.split("/");
c = c[c.length - 1];
if (!r[c]) {
var a = "function" == typeof __require && __require;
if (!p && a) return a(c, !0);
if (i) return i(c, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = c;
}
var u = t[s] = {
exports: {}
};
r[s][0].call(u.exports, function(e) {
return n(r[s][1][e] || e);
}, u, u.exports, e, r, t, o);
}
return t[s].exports;
}
for (var i = "function" == typeof __require && __require, s = 0; s < o.length; s++) n(o[s]);
return n;
}({
ReviveProgressSpeedChangeTrait: [ function(e, r, t) {
"use strict";
cc._RF.push(r, "38a68BWPtpGEr3HNWfKtfYr", "ReviveProgressSpeedChangeTrait");
var o, n = this && this.__extends || (o = function(e, r) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, r) {
e.__proto__ = r;
} || function(e, r) {
for (var t in r) Object.prototype.hasOwnProperty.call(r, t) && (e[t] = r[t]);
})(e, r);
}, function(e, r) {
o(e, r);
function t() {
this.constructor = e;
}
e.prototype = null === r ? Object.create(r) : (t.prototype = r.prototype, new t());
}), i = this && this.__decorate || function(e, r, t, o) {
var n, i = arguments.length, s = i < 3 ? r : null === o ? o = Object.getOwnPropertyDescriptor(r, t) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, r, t, o); else for (var p = e.length - 1; p >= 0; p--) (n = e[p]) && (s = (i < 3 ? n(s) : i > 3 ? n(r, t, s) : n(r, t)) || s);
return i > 3 && s && Object.defineProperty(r, t, s), s;
};
Object.defineProperty(t, "__esModule", {
value: !0
});
t.ReviveProgressSpeedChangeTrait = void 0;
var s = function(e) {
n(r, e);
function r() {
return null !== e && e.apply(this, arguments) || this;
}
r.prototype.onActive = function(e) {
if (hs.tp.isReviveUpdateProgress(e)) {
this.doNewProgressAnim(e);
e.replace = !0;
}
};
r.prototype.doNewProgressAnim = function(e) {
var r = e.target;
hs.audioInfo.play(hs.AudioConfig.time);
r.progress.progress = 0;
r.state.numTween = cc.tween(r.progress).to(.66, {
progress: 1
}).delay(.33).call(function() {
r.updateSprNum();
}).start();
};
return i([ classId("ReviveProgressSpeedChangeTrait") ], r);
}(Trait);
t.ReviveProgressSpeedChangeTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "ReviveProgressSpeedChangeTrait" ]);
//# sourceMappingURL=index.js.map
