window.__require = function e(t, r, n) {
function o(a, u) {
if (!r[a]) {
if (!t[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!t[c]) {
var s = "function" == typeof __require && __require;
if (!u && s) return s(c, !0);
if (i) return i(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var p = r[a] = {
exports: {}
};
t[a][0].call(p.exports, function(e) {
return o(t[a][1][e] || e);
}, p, p.exports, e, t, r, n);
}
return r[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < n.length; a++) o(n[a]);
return o;
}({
IsOpenEliminateMoreThanThreeShockAndSoundTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "9ee5cQklylDMJQJGSH8v4C7", "IsOpenEliminateMoreThanThreeShockAndSoundTrait");
var n, o = this && this.__extends || (n = function(e, t) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
n(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), i = this && this.__decorate || function(e, t, r, n) {
var o, i = arguments.length, a = i < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, r) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, n); else for (var u = e.length - 1; u >= 0; u--) (o = e[u]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, r, a) : o(t, r)) || a);
return i > 3 && a && Object.defineProperty(t, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.IsOpenEliminateMoreThanThreeShockAndSoundTrait = void 0;
var a = function(e) {
o(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "Advertisement_Proxy",
methodName: "onGameInitComplete"
} ];
};
t.prototype.onActive = function(e) {
hs.tp.isAdvertisement_ProxyOnGameInitComplete(e) && null == storage.getItem("shakeSwitch") && storage.setItem("shakeSwitch", !0);
if (hs.tp.isEliminate_Vibrator_ProxyPlayEliminateVibrator(e)) {
var t = e.args[0];
if (t.state.eliminateCount >= 3) {
if (3 === t.state.eliminateCount) hs.NativeVibrator.shakeOnce(200, 200); else {
hs.NativeVibrator.shakeOnce(255, 200);
this.PlayAudio();
}
e.replace = !0;
}
}
};
t.prototype.PlayAudio = function() {
var e = {
url: "audios/cheerup",
type: hs.AudioType.EFFECT,
volume: 2,
bundleName: "IsOpenEliminateMoreThanThreeShockAndSoundTrait"
};
hs.audioInfo.play(e);
};
return i([ classId("IsOpenEliminateMoreThanThreeShockAndSoundTrait") ], t);
}(Trait);
r.IsOpenEliminateMoreThanThreeShockAndSoundTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "IsOpenEliminateMoreThanThreeShockAndSoundTrait" ]);
//# sourceMappingURL=index.js.map
