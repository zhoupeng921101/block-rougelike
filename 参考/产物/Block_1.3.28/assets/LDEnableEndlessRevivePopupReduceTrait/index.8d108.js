window.__require = function e(t, r, n) {
function o(c, u) {
if (!r[c]) {
if (!t[c]) {
var p = c.split("/");
p = p[p.length - 1];
if (!t[p]) {
var s = "function" == typeof __require && __require;
if (!u && s) return s(p, !0);
if (i) return i(p, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = p;
}
var a = r[c] = {
exports: {}
};
t[c][0].call(a.exports, function(e) {
return o(t[c][1][e] || e);
}, a, a.exports, e, t, r, n);
}
return r[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < n.length; c++) o(n[c]);
return o;
}({
LDEnableEndlessRevivePopupReduceTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "bafe7OXyHFOCZ6cubjo0AFf", "LDEnableEndlessRevivePopupReduceTrait");
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
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(e, t, r, n); else for (var u = e.length - 1; u >= 0; u--) (o = e[u]) && (c = (i < 3 ? o(c) : i > 3 ? o(t, r, c) : o(t, r)) || c);
return i > 3 && c && Object.defineProperty(t, r, c), c;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.LDEnableEndlessRevivePopupReduceTrait = void 0;
var c = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.TAG_TRAIT_NAME = "[LDEnableEndlessRevivePopupReduceTrait]";
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
return i([ classId("LDEnableEndlessRevivePopupReduceTrait") ], t);
}(Trait);
r.LDEnableEndlessRevivePopupReduceTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "LDEnableEndlessRevivePopupReduceTrait" ]);
//# sourceMappingURL=index.js.map
