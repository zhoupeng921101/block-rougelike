window.__require = function t(e, i, r) {
function o(s, a) {
if (!i[s]) {
if (!e[s]) {
var c = s.split("/");
c = c[c.length - 1];
if (!e[c]) {
var p = "function" == typeof __require && __require;
if (!a && p) return p(c, !0);
if (n) return n(c, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = c;
}
var u = i[s] = {
exports: {}
};
e[s][0].call(u.exports, function(t) {
return o(e[s][1][t] || t);
}, u, u.exports, t, e, i, r);
}
return i[s].exports;
}
for (var n = "function" == typeof __require && __require, s = 0; s < r.length; s++) o(r[s]);
return o;
}({
LDDisableMoreTimeToOpreateStateTrait: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "adea8nvxq1AhbhuhZmpOcGx", "LDDisableMoreTimeToOpreateStateTrait");
var r, o = this && this.__extends || (r = function(t, e) {
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
}), n = this && this.__decorate || function(t, e, i, r) {
var o, n = arguments.length, s = n < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, i) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, i, r); else for (var a = t.length - 1; a >= 0; a--) (o = t[a]) && (s = (n < 3 ? o(s) : n > 3 ? o(e, i, s) : o(e, i)) || s);
return n > 3 && s && Object.defineProperty(e, i, s), s;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
i.LDDisableMoreTimeToOpreateStateTrait = void 0;
var s = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.TAG_TRAIT_NAME = "[LDDisableMoreTimeToOpreateStateTrait]";
e.disList = [];
return e;
}
e.prototype.onCreate = function() {
var t = this.props;
t && t.condition && t.disList && (this.disList = t.disList);
};
e.prototype.onActive = function(t) {
hs.tp.isDevice_Low_ProxyOnInitComplete(t) && this.disList.length > 0 && this.checkDisableTraits();
hs.tp.isDevice_Low_ProxyOnGameReadyHandler(t) && this.disList.length > 0 && this.checkDisableTraits();
};
e.prototype.checkDisableTraits = function() {
if (hs.deviceScoreInfo.isDeviceMatchConditions(this.props.condition)) {
var t = this.disList.map(function(t) {
return t.id;
}), e = hs.deviceLowInfo.delTraits(t);
this.disList = this.disList.filter(function(t) {
return e.includes(t.id);
});
}
};
return n([ classId("LDDisableMoreTimeToOpreateStateTrait") ], e);
}(Trait);
i.LDDisableMoreTimeToOpreateStateTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "LDDisableMoreTimeToOpreateStateTrait" ]);
//# sourceMappingURL=index.js.map
