window.__require = function e(t, r, o) {
function n(c, a) {
if (!r[c]) {
if (!t[c]) {
var _ = c.split("/");
_ = _[_.length - 1];
if (!t[_]) {
var f = "function" == typeof __require && __require;
if (!a && f) return f(_, !0);
if (i) return i(_, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = _;
}
var l = r[c] = {
exports: {}
};
t[c][0].call(l.exports, function(e) {
return n(t[c][1][e] || e);
}, l, l.exports, e, t, r, o);
}
return r[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < o.length; c++) n(o[c]);
return n;
}({
LDEnableJAEJ_11545_lowEndDevice_clearBoardTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "b7e354RNx5ECIX4vwS8GR8k", "LDEnableJAEJ_11545_lowEndDevice_clearBoardTrait");
var o, n = this && this.__extends || (o = function(e, t) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
o(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), i = this && this.__decorate || function(e, t, r, o) {
var n, i = arguments.length, c = i < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(e, t, r, o); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (c = (i < 3 ? n(c) : i > 3 ? n(t, r, c) : n(t, r)) || c);
return i > 3 && c && Object.defineProperty(t, r, c), c;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.LDEnableJAEJ_11545_lowEndDevice_clearBoardTrait = void 0;
var c = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onActive = function(e) {
if (hs.tp.isDevice_Low_ProxyOnInitComplete(e)) {
var t = this.props, r = hs.deviceScoreInfo.isDeviceMatchConditions(t.condition), o = hs.deviceScoreInfo.isDeviceMatchConditions(t.conditionExtra);
if (r || o) {
r && hs.deviceLowInfo.activeTraits(t.ids);
o && hs.deviceLowInfo.activeTraits(t.idsExtra);
}
}
};
return i([ classId("LDEnableJAEJ_11545_lowEndDevice_clearBoardTrait") ], t);
}(Trait);
r.LDEnableJAEJ_11545_lowEndDevice_clearBoardTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "LDEnableJAEJ_11545_lowEndDevice_clearBoardTrait" ]);
//# sourceMappingURL=index.js.map
