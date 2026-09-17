window.__require = function t(r, e, o) {
function n(c, u) {
if (!e[c]) {
if (!r[c]) {
var f = c.split("/");
f = f[f.length - 1];
if (!r[f]) {
var s = "function" == typeof __require && __require;
if (!u && s) return s(f, !0);
if (i) return i(f, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = f;
}
var a = e[c] = {
exports: {}
};
r[c][0].call(a.exports, function(t) {
return n(r[c][1][t] || t);
}, a, a.exports, t, r, e, o);
}
return e[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < o.length; c++) n(o[c]);
return n;
}({
HighComboScoringRuleAdjustTrait: [ function(t, r, e) {
"use strict";
cc._RF.push(r, "185cb3P6VdKb6aa9Dr7UpHV", "HighComboScoringRuleAdjustTrait");
var o, n = this && this.__extends || (o = function(t, r) {
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
}), i = this && this.__decorate || function(t, r, e, o) {
var n, i = arguments.length, c = i < 3 ? r : null === o ? o = Object.getOwnPropertyDescriptor(r, e) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, r, e, o); else for (var u = t.length - 1; u >= 0; u--) (n = t[u]) && (c = (i < 3 ? n(c) : i > 3 ? n(r, e, c) : n(r, e)) || c);
return i > 3 && c && Object.defineProperty(r, e, c), c;
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.HighComboScoringRuleAdjustTrait = void 0;
var c = function(t) {
n(r, t);
function r() {
return null !== t && t.apply(this, arguments) || this;
}
r.prototype.onActive = function(t) {
if (hs.tp.isClassScoreInfoComputeComboAndEliminateTimesScore(t)) {
var r = t.args[2], e = r - 1;
if (e >= 10) {
r = Math.floor((e - 2) / 2) + 7;
t.args[2] = r;
}
}
};
return i([ classId("HighComboScoringRuleAdjustTrait") ], r);
}(Trait);
e.HighComboScoringRuleAdjustTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "HighComboScoringRuleAdjustTrait" ]);
//# sourceMappingURL=index.js.map
