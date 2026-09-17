window.__require = function t(i, e, r) {
function o(s, c) {
if (!e[s]) {
if (!i[s]) {
var l = s.split("/");
l = l[l.length - 1];
if (!i[l]) {
var a = "function" == typeof __require && __require;
if (!c && a) return a(l, !0);
if (n) return n(l, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = l;
}
var f = e[s] = {
exports: {}
};
i[s][0].call(f.exports, function(t) {
return o(i[s][1][t] || t);
}, f, f.exports, t, i, e, r);
}
return e[s].exports;
}
for (var n = "function" == typeof __require && __require, s = 0; s < r.length; s++) o(r[s]);
return o;
}({
LDDisableSmallBlockLimitTrait: [ function(t, i, e) {
"use strict";
cc._RF.push(i, "f0066lUrs5BrYAKKqiZ+aZC", "LDDisableSmallBlockLimitTrait");
var r, o = this && this.__extends || (r = function(t, i) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, i) {
t.__proto__ = i;
} || function(t, i) {
for (var e in i) Object.prototype.hasOwnProperty.call(i, e) && (t[e] = i[e]);
})(t, i);
}, function(t, i) {
r(t, i);
function e() {
this.constructor = t;
}
t.prototype = null === i ? Object.create(i) : (e.prototype = i.prototype, new e());
}), n = this && this.__decorate || function(t, i, e, r) {
var o, n = arguments.length, s = n < 3 ? i : null === r ? r = Object.getOwnPropertyDescriptor(i, e) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, i, e, r); else for (var c = t.length - 1; c >= 0; c--) (o = t[c]) && (s = (n < 3 ? o(s) : n > 3 ? o(i, e, s) : o(i, e)) || s);
return n > 3 && s && Object.defineProperty(i, e, s), s;
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.LDDisableSmallBlockLimitTrait = void 0;
var s = function(t) {
o(i, t);
function i() {
var i = null !== t && t.apply(this, arguments) || this;
i.TAG_TRAIT_NAME = "[LDDisableSmallBlockLimitTrait]";
i.disList = [];
return i;
}
i.prototype.onCreate = function() {
var t = this.props;
t && t.condition && t.disList && (this.disList = t.disList);
};
i.prototype.onActive = function(t) {
hs.tp.isDevice_Low_ProxyOnInitComplete(t) && this.disList.length > 0 && this.checkDisableTraits();
hs.tp.isDevice_Low_ProxyOnGameReadyHandler(t) && this.disList.length > 0 && this.checkDisableTraits();
};
i.prototype.checkDisableTraits = function() {
if (hs.deviceScoreInfo.isDeviceMatchConditions(this.props.condition)) {
var t = this.disList.map(function(t) {
return t.id;
}), i = hs.deviceLowInfo.delTraits(t);
this.disList = this.disList.filter(function(t) {
return i.includes(t.id);
});
}
};
return n([ classId("LDDisableSmallBlockLimitTrait") ], i);
}(Trait);
e.LDDisableSmallBlockLimitTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "LDDisableSmallBlockLimitTrait" ]);
//# sourceMappingURL=index.js.map
