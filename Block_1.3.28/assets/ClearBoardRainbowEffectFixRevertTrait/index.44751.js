window.__require = function t(e, r, o) {
function n(a, f) {
if (!r[a]) {
if (!e[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!e[c]) {
var u = "function" == typeof __require && __require;
if (!f && u) return u(c, !0);
if (i) return i(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var l = r[a] = {
exports: {}
};
e[a][0].call(l.exports, function(t) {
return n(e[a][1][t] || t);
}, l, l.exports, t, e, r, o);
}
return r[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < o.length; a++) n(o[a]);
return n;
}({
ClearBoardRainbowEffectFixRevertTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "9814e4f5UtKvawLUgOCHwn0", "ClearBoardRainbowEffectFixRevertTrait");
var o, n = this && this.__extends || (o = function(t, e) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
})(t, e);
}, function(t, e) {
o(t, e);
function r() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
}), i = this && this.__decorate || function(t, e, r, o) {
var n, i = arguments.length, a = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, r, o); else for (var f = t.length - 1; f >= 0; f--) (n = t[f]) && (a = (i < 3 ? n(a) : i > 3 ? n(e, r, a) : n(e, r)) || a);
return i > 3 && a && Object.defineProperty(e, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ClearBoardRainbowEffectFixRevertTrait = void 0;
var a = function(t) {
n(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.onActive = function(t) {
if (hs.tp.isClearBoardRainbowEffectTraitUseOldLogic(t)) {
t.returnValue = !0;
t.returnState = !0;
}
};
return i([ classId("ClearBoardRainbowEffectFixRevertTrait") ], e);
}(Trait);
r.ClearBoardRainbowEffectFixRevertTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "ClearBoardRainbowEffectFixRevertTrait" ]);
//# sourceMappingURL=index.js.map
