window.__require = function e(t, r, n) {
function c(o, i) {
if (!r[o]) {
if (!t[o]) {
var p = o.split("/");
p = p[p.length - 1];
if (!t[p]) {
var a = "function" == typeof __require && __require;
if (!i && a) return a(p, !0);
if (f) return f(p, !0);
throw new Error("Cannot find module '" + o + "'");
}
o = p;
}
var u = r[o] = {
exports: {}
};
t[o][0].call(u.exports, function(e) {
return c(t[o][1][e] || e);
}, u, u.exports, e, t, r, n);
}
return r[o].exports;
}
for (var f = "function" == typeof __require && __require, o = 0; o < n.length; o++) c(n[o]);
return c;
}({
ReplacePerfectEffectTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "93b66m9VSlBiq5EjdNtkGtu", "ReplacePerfectEffectTrait");
var n, c = this && this.__extends || (n = function(e, t) {
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
}), f = this && this.__decorate || function(e, t, r, n) {
var c, f = arguments.length, o = f < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, r) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) o = Reflect.decorate(e, t, r, n); else for (var i = e.length - 1; i >= 0; i--) (c = e[i]) && (o = (f < 3 ? c(o) : f > 3 ? c(t, r, o) : c(t, r)) || o);
return f > 3 && o && Object.defineProperty(t, r, o), o;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ReplacePerfectEffectTrait = void 0;
var o = {
name: "ReplacePerfectEffect",
url: "prefabs/perfectEffect",
bundleName: "Remote_ReplacePerfectEffect"
}, i = function(e) {
c(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onActive = function(e) {
if (hs.tp.isIsOpenRightPutTraitPlayPerfect(e)) {
e.replace = !0;
this.playPerfectEffect();
}
};
t.prototype.playPerfectEffect = function() {
hs.UI.show(o, hs.gameEffectLayer).then(function(e) {
e.x = cc.winSize.width / 2;
e.y = cc.winSize.height / 2 + 100;
e.setSiblingIndex(hs.gameEffectLayer.childrenCount);
var t = e.getComponent(sp.Skeleton);
t.setCompleteListener(function() {
t.setCompleteListener(null);
hs.UI.hide(e);
});
t.setAnimation(0, "in", !1);
hs.audioInfo.play(hs.AudioConfig.putRightPerfect);
});
};
return f([ classId("ReplacePerfectEffectTrait") ], t);
}(Trait);
r.ReplacePerfectEffectTrait = i;
cc._RF.pop();
}, {} ]
}, {}, [ "ReplacePerfectEffectTrait" ]);
//# sourceMappingURL=index.js.map
