window.__require = function t(e, o, r) {
function n(c, a) {
if (!o[c]) {
if (!e[c]) {
var u = c.split("/");
u = u[u.length - 1];
if (!e[u]) {
var f = "function" == typeof __require && __require;
if (!a && f) return f(u, !0);
if (i) return i(u, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = u;
}
var p = o[c] = {
exports: {}
};
e[c][0].call(p.exports, function(t) {
return n(e[c][1][t] || t);
}, p, p.exports, t, e, o, r);
}
return o[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < r.length; c++) n(r[c]);
return n;
}({
LDEnableTimeOutToRandomNoDieTrait: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "ca4d8taZxtI1rEaX+SyRYd4", "LDEnableTimeOutToRandomNoDieTrait");
var r, n = this && this.__extends || (r = function(t, e) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
r(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), i = this && this.__decorate || function(t, e, o, r) {
var n, i = arguments.length, c = i < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, o, r); else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (c = (i < 3 ? n(c) : i > 3 ? n(e, o, c) : n(e, o)) || c);
return i > 3 && c && Object.defineProperty(e, o, c), c;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.LDEnableTimeOutToRandomNoDieTrait = void 0;
var c = function(t) {
n(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.onActive = function(t) {
if (hs.tp.isDevice_Low_ProxyOnInitComplete(t)) {
var e = this.props;
hs.deviceScoreInfo.isDeviceMatchConditions(e.condition) && hs.deviceLowInfo.activeTraits(e.ids);
}
};
return i([ classId("LDEnableTimeOutToRandomNoDieTrait") ], e);
}(Trait);
o.LDEnableTimeOutToRandomNoDieTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "LDEnableTimeOutToRandomNoDieTrait" ]);
//# sourceMappingURL=index.js.map
