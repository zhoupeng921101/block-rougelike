window.__require = function e(t, r, n) {
function o(a, c) {
if (!r[a]) {
if (!t[a]) {
var f = a.split("/");
f = f[f.length - 1];
if (!t[f]) {
var s = "function" == typeof __require && __require;
if (!c && s) return s(f, !0);
if (i) return i(f, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = f;
}
var l = r[a] = {
exports: {}
};
t[a][0].call(l.exports, function(e) {
return o(t[a][1][e] || e);
}, l, l.exports, e, t, r, n);
}
return r[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < n.length; a++) o(n[a]);
return o;
}({
LDEnableCloseRefreshPanelAniTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "7a2152OfJxIIbDNqvuhMuWs", "LDEnableCloseRefreshPanelAniTrait");
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
var o, i = arguments.length, a = i < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, r) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, n); else for (var c = e.length - 1; c >= 0; c--) (o = e[c]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, r, a) : o(t, r)) || a);
return i > 3 && a && Object.defineProperty(t, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.LDEnableCloseRefreshPanelAniTrait = void 0;
var a = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.TAG_TRAIT_NAME = "[LDEnableCloseRefreshPanelAniTrait]";
return t;
}
t.prototype.onActive = function(e) {
if (hs.tp.isDevice_Low_ProxyOnInitComplete(e)) {
var t = this.props;
if (hs.deviceScoreInfo.isDeviceMatchConditions(t.condition)) {
var r = t.activeList.map(function(e) {
return e.id;
});
hs.deviceLowInfo.activeTraits(r);
}
}
};
return i([ classId("LDEnableCloseRefreshPanelAniTrait") ], t);
}(Trait);
r.LDEnableCloseRefreshPanelAniTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "LDEnableCloseRefreshPanelAniTrait" ]);
//# sourceMappingURL=index.js.map
