window.__require = function t(r, e, i) {
function o(a, c) {
if (!e[a]) {
if (!r[a]) {
var s = a.split("/");
s = s[s.length - 1];
if (!r[s]) {
var u = "function" == typeof __require && __require;
if (!c && u) return u(s, !0);
if (n) return n(s, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = s;
}
var f = e[a] = {
exports: {}
};
r[a][0].call(f.exports, function(t) {
return o(r[a][1][t] || t);
}, f, f.exports, t, r, e, i);
}
return e[a].exports;
}
for (var n = "function" == typeof __require && __require, a = 0; a < i.length; a++) o(i[a]);
return o;
}({
FirstHardTimeFactorTrait: [ function(t, r, e) {
"use strict";
cc._RF.push(r, "3541afhtTFBOIMOxzzuf3U7", "FirstHardTimeFactorTrait");
var i, o = this && this.__extends || (i = function(t, r) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, r) {
t.__proto__ = r;
} || function(t, r) {
for (var e in r) Object.prototype.hasOwnProperty.call(r, e) && (t[e] = r[e]);
})(t, r);
}, function(t, r) {
i(t, r);
function e() {
this.constructor = t;
}
t.prototype = null === r ? Object.create(r) : (e.prototype = r.prototype, new e());
}), n = this && this.__decorate || function(t, r, e, i) {
var o, n = arguments.length, a = n < 3 ? r : null === i ? i = Object.getOwnPropertyDescriptor(r, e) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, r, e, i); else for (var c = t.length - 1; c >= 0; c--) (o = t[c]) && (a = (n < 3 ? o(a) : n > 3 ? o(r, e, a) : o(r, e)) || a);
return n > 3 && a && Object.defineProperty(r, e, a), a;
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.FirstHardTimeFactorTrait = void 0;
var a = function(t) {
o(r, t);
function r() {
return null !== t && t.apply(this, arguments) || this;
}
r.prototype.onActive = function(t) {
var r;
if (hs.tp.isClassAlgorithmStrategy_Reset_ProxyPreprocessing_PuzzleTime(t)) {
var e = TRAIT("IsPuzzleTimeTrait");
if ((null == e ? void 0 : e.active) && (null === (r = this.props) || void 0 === r ? void 0 : r.factor)) {
var i = Math.floor(e.state.puzzleTimeFirst * this.props.factor);
e.setState({
puzzleTimeFirst: i
});
}
}
};
return n([ classId("FirstHardTimeFactorTrait") ], r);
}(Trait);
e.FirstHardTimeFactorTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "FirstHardTimeFactorTrait" ]);
//# sourceMappingURL=index.js.map
