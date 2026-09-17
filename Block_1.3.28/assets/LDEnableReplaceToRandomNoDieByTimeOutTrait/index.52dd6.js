window.__require = function e(t, o, r) {
function n(c, a) {
if (!o[c]) {
if (!t[c]) {
var u = c.split("/");
u = u[u.length - 1];
if (!t[u]) {
var p = "function" == typeof __require && __require;
if (!a && p) return p(u, !0);
if (i) return i(u, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = u;
}
var f = o[c] = {
exports: {}
};
t[c][0].call(f.exports, function(e) {
return n(t[c][1][e] || e);
}, f, f.exports, e, t, o, r);
}
return o[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < r.length; c++) n(r[c]);
return n;
}({
LDEnableReplaceToRandomNoDieByTimeOutTrait: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "34bdbJ87dlHXr6elzTn/M96", "LDEnableReplaceToRandomNoDieByTimeOutTrait");
var r, n = this && this.__extends || (r = function(e, t) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
})(e, t);
}, function(e, t) {
r(e, t);
function o() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
}), i = this && this.__decorate || function(e, t, o, r) {
var n, i = arguments.length, c = i < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(e, t, o, r); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (c = (i < 3 ? n(c) : i > 3 ? n(t, o, c) : n(t, o)) || c);
return i > 3 && c && Object.defineProperty(t, o, c), c;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.LDEnableReplaceToRandomNoDieByTimeOutTrait = void 0;
var c = function(e) {
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
return i([ classId("LDEnableReplaceToRandomNoDieByTimeOutTrait") ], t);
}(Trait);
o.LDEnableReplaceToRandomNoDieByTimeOutTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "LDEnableReplaceToRandomNoDieByTimeOutTrait" ]);
//# sourceMappingURL=index.js.map
