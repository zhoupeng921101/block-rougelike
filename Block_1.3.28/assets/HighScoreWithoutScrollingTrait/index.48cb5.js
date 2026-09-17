window.__require = function t(r, e, o) {
function i(c, u) {
if (!e[c]) {
if (!r[c]) {
var f = c.split("/");
f = f[f.length - 1];
if (!r[f]) {
var a = "function" == typeof __require && __require;
if (!u && a) return a(f, !0);
if (n) return n(f, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = f;
}
var l = e[c] = {
exports: {}
};
r[c][0].call(l.exports, function(t) {
return i(r[c][1][t] || t);
}, l, l.exports, t, r, e, o);
}
return e[c].exports;
}
for (var n = "function" == typeof __require && __require, c = 0; c < o.length; c++) i(o[c]);
return i;
}({
HighScoreWithoutScrollingTrait: [ function(t, r, e) {
"use strict";
cc._RF.push(r, "64fc8hRfjZG+rpadz140uSC", "HighScoreWithoutScrollingTrait");
var o, i = this && this.__extends || (o = function(t, r) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, r) {
t.__proto__ = r;
} || function(t, r) {
for (var e in r) Object.prototype.hasOwnProperty.call(r, e) && (t[e] = r[e]);
})(t, r);
}, function(t, r) {
o(t, r);
function e() {
this.constructor = t;
}
t.prototype = null === r ? Object.create(r) : (e.prototype = r.prototype, new e());
}), n = this && this.__decorate || function(t, r, e, o) {
var i, n = arguments.length, c = n < 3 ? r : null === o ? o = Object.getOwnPropertyDescriptor(r, e) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, r, e, o); else for (var u = t.length - 1; u >= 0; u--) (i = t[u]) && (c = (n < 3 ? i(c) : n > 3 ? i(r, e, c) : i(r, e)) || c);
return n > 3 && c && Object.defineProperty(r, e, c), c;
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.HighScoreWithoutScrollingTrait = void 0;
var c = function(t) {
i(r, t);
function r() {
return null !== t && t.apply(this, arguments) || this;
}
r.prototype.onActive = function(t) {
if (hs.tp.isClassTopInfoUpdateScoreHighScoreWithAnimation(t)) {
var r = t.target, e = t.args[0];
r.setHighScoreLabel(e.highScore);
t.replace = !0;
t.returnState = !0;
}
};
return n([ classId("HighScoreWithoutScrollingTrait") ], r);
}(Trait);
e.HighScoreWithoutScrollingTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "HighScoreWithoutScrollingTrait" ]);
//# sourceMappingURL=index.js.map
