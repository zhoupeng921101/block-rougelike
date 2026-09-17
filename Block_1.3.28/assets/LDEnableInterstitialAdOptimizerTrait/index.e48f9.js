window.__require = function t(e, i, r) {
function n(c, a) {
if (!i[c]) {
if (!e[c]) {
var s = c.split("/");
s = s[s.length - 1];
if (!e[s]) {
var f = "function" == typeof __require && __require;
if (!a && f) return f(s, !0);
if (o) return o(s, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = s;
}
var p = i[c] = {
exports: {}
};
e[c][0].call(p.exports, function(t) {
return n(e[c][1][t] || t);
}, p, p.exports, t, e, i, r);
}
return i[c].exports;
}
for (var o = "function" == typeof __require && __require, c = 0; c < r.length; c++) n(r[c]);
return n;
}({
LDEnableInterstitialAdOptimizerTrait: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "aaff1Psw5ZDzpfBHGwaOihT", "LDEnableInterstitialAdOptimizerTrait");
var r, n = this && this.__extends || (r = function(t, e) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
})(t, e);
}, function(t, e) {
r(t, e);
function i() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype, new i());
}), o = this && this.__decorate || function(t, e, i, r) {
var n, o = arguments.length, c = o < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, i) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, i, r); else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (c = (o < 3 ? n(c) : o > 3 ? n(e, i, c) : n(e, i)) || c);
return o > 3 && c && Object.defineProperty(e, i, c), c;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
i.LDEnableInterstitialAdOptimizerTrait = void 0;
var c = function(t) {
n(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.onActive = function(t) {
if (hs.tp.isDevice_Low_ProxyOnInitComplete(t)) {
var e = this.props, i = hs.deviceScoreInfo.isDeviceMatchConditions(e.condition), r = hs.deviceScoreInfo.isDeviceMatchConditions(e.conditionExtra);
if (i || r) {
i && hs.deviceLowInfo.activeTraits(e.ids);
r && hs.deviceLowInfo.activeTraits(e.idsExtra);
}
}
};
return o([ classId("LDEnableInterstitialAdOptimizerTrait") ], e);
}(Trait);
i.LDEnableInterstitialAdOptimizerTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "LDEnableInterstitialAdOptimizerTrait" ]);
//# sourceMappingURL=index.js.map
