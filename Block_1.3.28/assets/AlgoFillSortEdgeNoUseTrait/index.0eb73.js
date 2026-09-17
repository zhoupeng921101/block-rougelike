window.__require = function t(e, r, o) {
function n(l, c) {
if (!r[l]) {
if (!e[l]) {
var u = l.split("/");
u = u[u.length - 1];
if (!e[u]) {
var f = "function" == typeof __require && __require;
if (!c && f) return f(u, !0);
if (i) return i(u, !0);
throw new Error("Cannot find module '" + l + "'");
}
l = u;
}
var s = r[l] = {
exports: {}
};
e[l][0].call(s.exports, function(t) {
return n(e[l][1][t] || t);
}, s, s.exports, t, e, r, o);
}
return r[l].exports;
}
for (var i = "function" == typeof __require && __require, l = 0; l < o.length; l++) n(o[l]);
return n;
}({
AlgoFillSortEdgeNoUseTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "9321eN2uWRC3Yv2COUT5Vz/", "AlgoFillSortEdgeNoUseTrait");
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
var n, i = arguments.length, l = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) l = Reflect.decorate(t, e, r, o); else for (var c = t.length - 1; c >= 0; c--) (n = t[c]) && (l = (i < 3 ? n(l) : i > 3 ? n(e, r, l) : n(e, r)) || l);
return i > 3 && l && Object.defineProperty(e, r, l), l;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.AlgoFillSortEdgeNoUseTrait = void 0;
var l = function(t) {
n(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.onActive = function(t) {
hs.tp.isAlgoFillSortEdgeTraitIsCanReplace(t) && (t.args[0] = !1);
};
return i([ classId("AlgoFillSortEdgeNoUseTrait") ], e);
}(Trait);
r.AlgoFillSortEdgeNoUseTrait = l;
cc._RF.pop();
}, {} ]
}, {}, [ "AlgoFillSortEdgeNoUseTrait" ]);
//# sourceMappingURL=index.js.map
