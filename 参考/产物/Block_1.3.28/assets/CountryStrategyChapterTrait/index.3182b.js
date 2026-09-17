window.__require = function t(e, r, n) {
function o(u, a) {
if (!r[u]) {
if (!e[u]) {
var c = u.split("/");
c = c[c.length - 1];
if (!e[c]) {
var p = "function" == typeof __require && __require;
if (!a && p) return p(c, !0);
if (i) return i(c, !0);
throw new Error("Cannot find module '" + u + "'");
}
u = c;
}
var s = r[u] = {
exports: {}
};
e[u][0].call(s.exports, function(t) {
return o(e[u][1][t] || t);
}, s, s.exports, t, e, r, n);
}
return r[u].exports;
}
for (var i = "function" == typeof __require && __require, u = 0; u < n.length; u++) o(n[u]);
return o;
}({
CountryStrategyChapterTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "62d2fsPr4ZNMqrjt4e1AgS2", "CountryStrategyChapterTrait");
var n, o = this && this.__extends || (n = function(t, e) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
})(t, e);
}, function(t, e) {
n(t, e);
function r() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
}), i = this && this.__decorate || function(t, e, r, n) {
var o, i = arguments.length, u = i < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, r) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) u = Reflect.decorate(t, e, r, n); else for (var a = t.length - 1; a >= 0; a--) (o = t[a]) && (u = (i < 3 ? o(u) : i > 3 ? o(e, r, u) : o(e, r)) || u);
return i > 3 && u && Object.defineProperty(e, r, u), u;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.CountryStrategyChapterTrait = void 0;
var u = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._countryActive = !1;
return e;
}
e.prototype.onCreate = function() {
var t, e, r = null !== (e = null === (t = this.props) || void 0 === t ? void 0 : t.country) && void 0 !== e ? e : [];
this._countryActive = r.length > 0 && r.indexOf(this.country) >= 0;
};
e.prototype.onActive = function(t) {
if (hs.tp.isLaunchInfoOpenChapterModule(t)) {
var e = hs.storage.getItem("classGuideStep", 0);
if (this._countryActive && e > 2) {
t.returnValue = !0;
t.returnState = !0;
}
}
if (hs.tp.isClassGuide_ProxyOnGuideChangeTrait(t) && this._countryActive) {
var r = hs.classGuideInfo, n = r.totalStep;
r.step >= n && hs.EventManager.dispatchModuleEvent(new hs.E_Setup_SetbtnRedFresh());
}
};
Object.defineProperty(e.prototype, "country", {
get: function() {
var t, e;
return ((null === (e = null === (t = hs.deviceInfo) || void 0 === t ? void 0 : t.data) || void 0 === e ? void 0 : e.country) || "").toUpperCase();
},
enumerable: !1,
configurable: !0
});
return i([ classId("CountryStrategyChapterTrait") ], e);
}(Trait);
r.CountryStrategyChapterTrait = u;
cc._RF.pop();
}, {} ]
}, {}, [ "CountryStrategyChapterTrait" ]);
//# sourceMappingURL=index.js.map
