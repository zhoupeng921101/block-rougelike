window.__require = function t(e, r, o) {
function n(f, c) {
if (!r[f]) {
if (!e[f]) {
var u = f.split("/");
u = u[u.length - 1];
if (!e[u]) {
var p = "function" == typeof __require && __require;
if (!c && p) return p(u, !0);
if (i) return i(u, !0);
throw new Error("Cannot find module '" + f + "'");
}
f = u;
}
var a = r[f] = {
exports: {}
};
e[f][0].call(a.exports, function(t) {
return n(e[f][1][t] || t);
}, a, a.exports, t, e, r, o);
}
return r[f].exports;
}
for (var i = "function" == typeof __require && __require, f = 0; f < o.length; f++) n(o[f]);
return n;
}({
NewBottomOfferTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "bd840cRhKpCnZSPptlwAUbh", "NewBottomOfferTrait");
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
var n, i = arguments.length, f = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) f = Reflect.decorate(t, e, r, o); else for (var c = t.length - 1; c >= 0; c--) (n = t[c]) && (f = (i < 3 ? n(f) : i > 3 ? n(e, r, f) : n(e, r)) || f);
return i > 3 && f && Object.defineProperty(e, r, f), f;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.NewBottomOfferTrait = void 0;
var f = function(t) {
n(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.onActive = function(t) {
hs.tp.isAlgorithmLifeCycle_GameInit_ProxyOnGameInitComplete(t) && hs.algorithmStrategyInfo.setAlgorithmUseNewBottom(!0);
};
return i([ classId("NewBottomOfferTrait") ], e);
}(Trait);
r.NewBottomOfferTrait = f;
cc._RF.pop();
}, {} ]
}, {}, [ "NewBottomOfferTrait" ]);
//# sourceMappingURL=index.js.map
