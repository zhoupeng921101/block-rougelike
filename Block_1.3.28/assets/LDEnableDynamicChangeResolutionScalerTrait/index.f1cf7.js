window.__require = function e(t, n, r) {
function o(a, c) {
if (!n[a]) {
if (!t[a]) {
var u = a.split("/");
u = u[u.length - 1];
if (!t[u]) {
var l = "function" == typeof __require && __require;
if (!c && l) return l(u, !0);
if (i) return i(u, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = u;
}
var f = n[a] = {
exports: {}
};
t[a][0].call(f.exports, function(e) {
return o(t[a][1][e] || e);
}, f, f.exports, e, t, n, r);
}
return n[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < r.length; a++) o(r[a]);
return o;
}({
LDEnableDynamicChangeResolutionScalerTrait: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "38a0dvOUgZFFo9uNzPDI0gC", "LDEnableDynamicChangeResolutionScalerTrait");
var r, o = this && this.__extends || (r = function(e, t) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
r(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), i = this && this.__decorate || function(e, t, n, r) {
var o, i = arguments.length, a = i < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, n) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, r); else for (var c = e.length - 1; c >= 0; c--) (o = e[c]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
return i > 3 && a && Object.defineProperty(t, n, a), a;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.LDEnableDynamicChangeResolutionScalerTrait = void 0;
var a = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.TAG_TRAIT_NAME = "[LDEnableDynamicChangeResolutionScalerTrait]";
return t;
}
t.prototype.onActive = function(e) {
if (hs.tp.isDevice_Low_ProxyOnInitComplete(e)) {
var t = this.props;
if (hs.deviceScoreInfo.isDeviceMatchConditions(t.condition)) {
var n = t.activeList.map(function(e) {
return e.id;
});
hs.deviceLowInfo.activeTraits(n);
}
}
};
return i([ classId("LDEnableDynamicChangeResolutionScalerTrait") ], t);
}(Trait);
n.LDEnableDynamicChangeResolutionScalerTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "LDEnableDynamicChangeResolutionScalerTrait" ]);
//# sourceMappingURL=index.js.map
