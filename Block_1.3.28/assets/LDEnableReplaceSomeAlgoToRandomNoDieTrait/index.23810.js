window.__require = function e(o, t, r) {
function n(c, a) {
if (!t[c]) {
if (!o[c]) {
var l = c.split("/");
l = l[l.length - 1];
if (!o[l]) {
var p = "function" == typeof __require && __require;
if (!a && p) return p(l, !0);
if (i) return i(l, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = l;
}
var f = t[c] = {
exports: {}
};
o[c][0].call(f.exports, function(e) {
return n(o[c][1][e] || e);
}, f, f.exports, e, o, t, r);
}
return t[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < r.length; c++) n(r[c]);
return n;
}({
LDEnableReplaceSomeAlgoToRandomNoDieTrait: [ function(e, o, t) {
"use strict";
cc._RF.push(o, "1270f9gJuRHJZ/T3ys0BoP4", "LDEnableReplaceSomeAlgoToRandomNoDieTrait");
var r, n = this && this.__extends || (r = function(e, o) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, o) {
e.__proto__ = o;
} || function(e, o) {
for (var t in o) Object.prototype.hasOwnProperty.call(o, t) && (e[t] = o[t]);
})(e, o);
}, function(e, o) {
r(e, o);
function t() {
this.constructor = e;
}
e.prototype = null === o ? Object.create(o) : (t.prototype = o.prototype, new t());
}), i = this && this.__decorate || function(e, o, t, r) {
var n, i = arguments.length, c = i < 3 ? o : null === r ? r = Object.getOwnPropertyDescriptor(o, t) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(e, o, t, r); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (c = (i < 3 ? n(c) : i > 3 ? n(o, t, c) : n(o, t)) || c);
return i > 3 && c && Object.defineProperty(o, t, c), c;
};
Object.defineProperty(t, "__esModule", {
value: !0
});
t.LDEnableReplaceSomeAlgoToRandomNoDieTrait = void 0;
var c = function(e) {
n(o, e);
function o() {
return null !== e && e.apply(this, arguments) || this;
}
o.prototype.onActive = function(e) {
if (hs.tp.isDevice_Low_ProxyOnInitComplete(e)) {
var o = this.props;
hs.deviceScoreInfo.isDeviceMatchConditions(o.condition) && hs.deviceLowInfo.activeTraits(o.ids);
}
};
return i([ classId("LDEnableReplaceSomeAlgoToRandomNoDieTrait") ], o);
}(Trait);
t.LDEnableReplaceSomeAlgoToRandomNoDieTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "LDEnableReplaceSomeAlgoToRandomNoDieTrait" ]);
//# sourceMappingURL=index.js.map
