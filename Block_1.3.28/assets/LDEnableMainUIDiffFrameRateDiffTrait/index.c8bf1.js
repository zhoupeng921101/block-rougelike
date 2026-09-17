window.__require = function e(t, r, i) {
function n(f, a) {
if (!r[f]) {
if (!t[f]) {
var c = f.split("/");
c = c[c.length - 1];
if (!t[c]) {
var u = "function" == typeof __require && __require;
if (!a && u) return u(c, !0);
if (o) return o(c, !0);
throw new Error("Cannot find module '" + f + "'");
}
f = c;
}
var p = r[f] = {
exports: {}
};
t[f][0].call(p.exports, function(e) {
return n(t[f][1][e] || e);
}, p, p.exports, e, t, r, i);
}
return r[f].exports;
}
for (var o = "function" == typeof __require && __require, f = 0; f < i.length; f++) n(i[f]);
return n;
}({
LDEnableMainUIDiffFrameRateDiffTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "abddbUQJLlGarNPwopMRMQW", "LDEnableMainUIDiffFrameRateDiffTrait");
var i, n = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
i(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), o = this && this.__decorate || function(e, t, r, i) {
var n, o = arguments.length, f = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) f = Reflect.decorate(e, t, r, i); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (f = (o < 3 ? n(f) : o > 3 ? n(t, r, f) : n(t, r)) || f);
return o > 3 && f && Object.defineProperty(t, r, f), f;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.LDEnableMainUIDiffFrameRateDiffTrait = void 0;
var f = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onActive = function(e) {
if (hs.tp.isDevice_Low_ProxyOnInitComplete(e)) {
var t = this.props;
hs.deviceScoreInfo.isDeviceMatchConditions(t.condition) && hs.deviceLowInfo.activeTraits(t.ids);
}
};
return o([ classId("LDEnableMainUIDiffFrameRateDiffTrait") ], t);
}(Trait);
r.LDEnableMainUIDiffFrameRateDiffTrait = f;
cc._RF.pop();
}, {} ]
}, {}, [ "LDEnableMainUIDiffFrameRateDiffTrait" ]);
//# sourceMappingURL=index.js.map
