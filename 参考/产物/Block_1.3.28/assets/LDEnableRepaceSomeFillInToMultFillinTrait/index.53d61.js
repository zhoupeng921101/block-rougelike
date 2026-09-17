window.__require = function e(t, n, o) {
function r(l, c) {
if (!n[l]) {
if (!t[l]) {
var a = l.split("/");
a = a[a.length - 1];
if (!t[a]) {
var u = "function" == typeof __require && __require;
if (!c && u) return u(a, !0);
if (i) return i(a, !0);
throw new Error("Cannot find module '" + l + "'");
}
l = a;
}
var p = n[l] = {
exports: {}
};
t[l][0].call(p.exports, function(e) {
return r(t[l][1][e] || e);
}, p, p.exports, e, t, n, o);
}
return n[l].exports;
}
for (var i = "function" == typeof __require && __require, l = 0; l < o.length; l++) r(o[l]);
return r;
}({
LDEnableRepaceSomeFillInToMultFillinTrait: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "5cd22EJ4HxA5oZTxRlcLnGe", "LDEnableRepaceSomeFillInToMultFillinTrait");
var o, r = this && this.__extends || (o = function(e, t) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
o(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), i = this && this.__decorate || function(e, t, n, o) {
var r, i = arguments.length, l = i < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, n) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) l = Reflect.decorate(e, t, n, o); else for (var c = e.length - 1; c >= 0; c--) (r = e[c]) && (l = (i < 3 ? r(l) : i > 3 ? r(t, n, l) : r(t, n)) || l);
return i > 3 && l && Object.defineProperty(t, n, l), l;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.LDEnableRepaceSomeFillInToMultFillinTrait = void 0;
var l = function(e) {
r(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onActive = function(e) {
if (hs.tp.isDevice_Low_ProxyOnInitComplete(e)) {
var t = this.props;
hs.deviceScoreInfo.isDeviceMatchConditions(t.condition) && hs.deviceLowInfo.activeTraits(t.ids);
}
};
return i([ classId("LDEnableRepaceSomeFillInToMultFillinTrait") ], t);
}(Trait);
n.LDEnableRepaceSomeFillInToMultFillinTrait = l;
cc._RF.pop();
}, {} ]
}, {}, [ "LDEnableRepaceSomeFillInToMultFillinTrait" ]);
//# sourceMappingURL=index.js.map
