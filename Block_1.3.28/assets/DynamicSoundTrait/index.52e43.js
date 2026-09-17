window.__require = function t(e, o, n) {
function r(u, a) {
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
return r(e[u][1][t] || t);
}, p, p.exports, t, e, o, n);
}
return o[u].exports;
}
for (var i = "function" == typeof __require && __require, u = 0; u < n.length; u++) r(n[u]);
return r;
}({
DynamicSoundTrait: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "0d592fRr15ANIbLrWAgB7wr", "DynamicSoundTrait");
var n, r = this && this.__extends || (n = function(t, e) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
n(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), i = this && this.__decorate || function(t, e, o, n) {
var r, i = arguments.length, u = i < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) u = Reflect.decorate(t, e, o, n); else for (var a = t.length - 1; a >= 0; a--) (r = t[a]) && (u = (i < 3 ? r(u) : i > 3 ? r(e, o, u) : r(e, o)) || u);
return i > 3 && u && Object.defineProperty(e, o, u), u;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.DynamicSoundTrait = void 0;
var u = function(t) {
r(e, t);
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
url: "audios/yz2_touch",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: o.BUNDLE_NAME
});
t.returnState = !0;
t.replace = !0;
}
};
e.prototype.playEliminateSound = function(t) {
var e, n = null === (e = t.args[0]) || void 0 === e ? void 0 : e.state, r = n.canEliminate, i = n.continuousEliminateTimes;
if (r) if (i <= 1) hs.audioInfo.play({
url: "audios/yz2_streak",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: o.BUNDLE_NAME
}); else {
var u = this.getComboIndex(i);
hs.audioInfo.play({
url: "audios/yz2_combo" + u,
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: o.BUNDLE_NAME
});
} else hs.audioInfo.play({
url: "audios/yz2_put",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: o.BUNDLE_NAME
});
};
e.prototype.getComboIndex = function(t) {
var e = storage.getItem("classGuideStep", 0) > o.GUIDE_THRESHOLD ? t - 1 : t;
if (e <= o.MAX_COMBO) return e;
var n = o.MAX_COMBO - o.LOOP_START + 1;
return o.LOOP_START + (e - o.MAX_COMBO - 1) % n;
};
var o;
e.MAX_COMBO = 13;
e.LOOP_START = 7;
e.GUIDE_THRESHOLD = 2;
e.BUNDLE_NAME = "DynamicSoundTrait";
return o = i([ classId("DynamicSoundTrait") ], e);
}(Trait);
o.DynamicSoundTrait = u;
cc._RF.pop();
}, {} ]
}, {}, [ "DynamicSoundTrait" ]);
//# sourceMappingURL=index.js.map
