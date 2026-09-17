window.__require = function t(o, e, r) {
function n(c, u) {
if (!e[c]) {
if (!o[c]) {
var f = c.split("/");
f = f[f.length - 1];
if (!o[f]) {
var p = "function" == typeof __require && __require;
if (!u && p) return p(f, !0);
if (i) return i(f, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = f;
}
var a = e[c] = {
exports: {}
};
o[c][0].call(a.exports, function(t) {
return n(o[c][1][t] || t);
}, a, a.exports, t, o, e, r);
}
return e[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < r.length; c++) n(r[c]);
return n;
}({
LimitComboScoreToTenTrait: [ function(t, o, e) {
"use strict";
cc._RF.push(o, "4421aFXe8lOUr6ojgtHzw8/", "LimitComboScoreToTenTrait");
var r, n = this && this.__extends || (r = function(t, o) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, o) {
t.__proto__ = o;
} || function(t, o) {
for (var e in o) Object.prototype.hasOwnProperty.call(o, e) && (t[e] = o[e]);
})(t, o);
}, function(t, o) {
r(t, o);
function e() {
this.constructor = t;
}
t.prototype = null === o ? Object.create(o) : (e.prototype = o.prototype, new e());
}), i = this && this.__decorate || function(t, o, e, r) {
var n, i = arguments.length, c = i < 3 ? o : null === r ? r = Object.getOwnPropertyDescriptor(o, e) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, o, e, r); else for (var u = t.length - 1; u >= 0; u--) (n = t[u]) && (c = (i < 3 ? n(c) : i > 3 ? n(o, e, c) : n(o, e)) || c);
return i > 3 && c && Object.defineProperty(o, e, c), c;
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.LimitComboScoreToTenTrait = void 0;
var c = function(t) {
n(o, t);
function o() {
return null !== t && t.apply(this, arguments) || this;
}
o.prototype.onActive = function(t) {
if (hs.tp.isClassScoreInfoComputeComboAndEliminateTimesScore(t)) {
var o = t.args[2];
o > this.props.maxCombo + 1 && (o = this.props.maxCombo + 1);
t.args[2] = o;
}
};
return i([ classId("LimitComboScoreToTenTrait") ], o);
}(Trait);
e.LimitComboScoreToTenTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "LimitComboScoreToTenTrait" ]);
//# sourceMappingURL=index.js.map
