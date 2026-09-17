window.__require = function e(t, r, n) {
function o(c, a) {
if (!r[c]) {
if (!t[c]) {
var u = c.split("/");
u = u[u.length - 1];
if (!t[u]) {
var l = "function" == typeof __require && __require;
if (!a && l) return l(u, !0);
if (i) return i(u, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = u;
}
var f = r[c] = {
exports: {}
};
t[c][0].call(f.exports, function(e) {
return o(t[c][1][e] || e);
}, f, f.exports, e, t, r, n);
}
return r[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < n.length; c++) o(n[c]);
return o;
}({
DynamicChangeResolutionScalerTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "499b1RoIERBxIOF4PaO6b0T", "DynamicChangeResolutionScalerTrait");
var n, o = this && this.__extends || (n = function(e, t) {
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
}), i = this && this.__decorate || function(e, t, r, n) {
var o, i = arguments.length, c = i < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, r) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(e, t, r, n); else for (var a = e.length - 1; a >= 0; a--) (o = e[a]) && (c = (i < 3 ? o(c) : i > 3 ? o(t, r, c) : o(t, r)) || c);
return i > 3 && c && Object.defineProperty(t, r, c), c;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.DynamicChangeResolutionScalerTrait = void 0;
var c = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.TAG_TRAIT_NAME = "[DynamicChangeResolutionScalerTrait]";
return t;
}
t.prototype.onCreate = function() {
var e = this.props.resolutionScale;
Number.isFinite(e) && hs.deviceLowInfo.setDownSampleFactor(e);
};
return i([ classId("DynamicChangeResolutionScalerTrait") ], t);
}(Trait);
r.DynamicChangeResolutionScalerTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "DynamicChangeResolutionScalerTrait" ]);
//# sourceMappingURL=index.js.map
