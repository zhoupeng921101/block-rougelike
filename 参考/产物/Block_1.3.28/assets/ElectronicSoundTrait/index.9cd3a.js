window.__require = function t(e, o, r) {
function n(u, a) {
if (!o[u]) {
if (!e[u]) {
var c = u.split("/");
c = c[c.length - 1];
if (!e[c]) {
var l = "function" == typeof __require && __require;
if (!a && l) return l(c, !0);
if (i) return i(c, !0);
throw new Error("Cannot find module '" + u + "'");
}
u = c;
}
var p = o[u] = {
exports: {}
};
e[u][0].call(p.exports, function(t) {
return n(e[u][1][t] || t);
}, p, p.exports, t, e, o, r);
}
return o[u].exports;
}
for (var i = "function" == typeof __require && __require, u = 0; u < r.length; u++) n(r[u]);
return n;
}({
ElectronicSoundTrait: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "5228epb5epGI6vnIxF1b0uF", "ElectronicSoundTrait");
var r, n = this && this.__extends || (r = function(t, e) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
r(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), i = this && this.__decorate || function(t, e, o, r) {
var n, i = arguments.length, u = i < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) u = Reflect.decorate(t, e, o, r); else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (u = (i < 3 ? n(u) : i > 3 ? n(e, o, u) : n(e, o)) || u);
return i > 3 && u && Object.defineProperty(e, o, u), u;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.ElectronicSoundTrait = void 0;
var u = function(t) {
n(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
o = e;
e.prototype.onActive = function(t) {
if (hs.tp.isClassEliminate_Sound_ProxyPlayEliminateSound(t) || hs.tp.isEliminate_ChapterSound_ProxyPlayEliminateSound(t)) {
this.playEliminateSound(t);
t.returnState = !0;
t.replace = !0;
}
if (hs.tp.isBlocksProducerTouchPlayTouchSound(t)) {
hs.audioInfo.play({
url: "audios/yz1_touch",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: o.BUNDLE_NAME
});
t.returnState = !0;
t.replace = !0;
}
};
e.prototype.playEliminateSound = function(t) {
var e, r = null === (e = t.args[0]) || void 0 === e ? void 0 : e.state, n = r.canEliminate, i = r.continuousEliminateTimes;
if (n) {
var u = this.getStreakLevel(i);
hs.audioInfo.play({
url: "audios/yz1_streak" + u,
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: o.BUNDLE_NAME
});
} else hs.audioInfo.play(hs.AudioConfig.s_put);
};
e.prototype.getStreakLevel = function(t) {
return t <= 1 ? 1 : storage.getItem("classGuideStep", 0) <= 2 ? t : t > 10 ? 10 : t - 1;
};
var o;
e.BUNDLE_NAME = "ElectronicSoundTrait";
return o = i([ classId("ElectronicSoundTrait") ], e);
}(Trait);
o.ElectronicSoundTrait = u;
cc._RF.pop();
}, {} ]
}, {}, [ "ElectronicSoundTrait" ]);
//# sourceMappingURL=index.js.map
