window.__require = function e(t, r, i) {
function n(u, c) {
if (!r[u]) {
if (!t[u]) {
var f = u.split("/");
f = f[f.length - 1];
if (!t[f]) {
var s = "function" == typeof __require && __require;
if (!c && s) return s(f, !0);
if (o) return o(f, !0);
throw new Error("Cannot find module '" + u + "'");
}
u = f;
}
var p = r[u] = {
exports: {}
};
t[u][0].call(p.exports, function(e) {
return n(t[u][1][e] || e);
}, p, p.exports, e, t, r, i);
}
return r[u].exports;
}
for (var o = "function" == typeof __require && __require, u = 0; u < i.length; u++) n(i[u]);
return n;
}({
GuideFirstLifeFixRevertTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "7c61ckDhP5PgLM1EPKw9s9P", "GuideFirstLifeFixRevertTrait");
var i, n = this && this.__extends || (i = function(e, t) {
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
}), o = this && this.__decorate || function(e, t, r, i) {
var n, o = arguments.length, u = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) u = Reflect.decorate(e, t, r, i); else for (var c = e.length - 1; c >= 0; c--) (n = e[c]) && (u = (o < 3 ? n(u) : o > 3 ? n(t, r, u) : n(t, r)) || u);
return o > 3 && u && Object.defineProperty(t, r, u), u;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.GuideFirstLifeFixRevertTrait = void 0;
var u = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onActive = function(e) {
hs.tp.isGuideFirstLifeTraitOpenFixPerformance(e) && (e.returnValue = !1);
};
return o([ classId("GuideFirstLifeFixRevertTrait") ], t);
}(Trait);
r.GuideFirstLifeFixRevertTrait = u;
cc._RF.pop();
}, {} ]
}, {}, [ "GuideFirstLifeFixRevertTrait" ]);
//# sourceMappingURL=index.js.map
