window.__require = function e(t, o, r) {
function c(i, s) {
if (!o[i]) {
if (!t[i]) {
var l = i.split("/");
l = l[l.length - 1];
if (!t[l]) {
var u = "function" == typeof __require && __require;
if (!s && u) return u(l, !0);
if (n) return n(l, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = l;
}
var a = o[i] = {
exports: {}
};
t[i][0].call(a.exports, function(e) {
return c(t[i][1][e] || e);
}, a, a.exports, e, t, o, r);
}
return o[i].exports;
}
for (var n = "function" == typeof __require && __require, i = 0; i < r.length; i++) c(r[i]);
return c;
}({
ReviveBlockScoreTrait: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "d93e05xiLJCDLalKarUxL4o", "ReviveBlockScoreTrait");
var r, c = this && this.__extends || (r = function(e, t) {
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
}), n = this && this.__decorate || function(e, t, o, r) {
var c, n = arguments.length, i = n < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(e, t, o, r); else for (var s = e.length - 1; s >= 0; s--) (c = e[s]) && (i = (n < 3 ? c(i) : n > 3 ? c(t, o, i) : c(t, o)) || i);
return n > 3 && i && Object.defineProperty(t, o, i), i;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.ReviveBlockScoreTrait = void 0;
var i = function(e) {
c(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onActive = function(e) {
hs.tp.isClassRevive_ProxyOnGameStart(e) && this.initNewUserState();
if (hs.tp.isClassScore_ProxyComputeBaseScore(e) && this.shouldBlockBaseScore()) {
e.args[0] = 0;
e.returnState = !0;
}
hs.tp.isClassRevive_ProxyOnRevive_Success(e) && this.unlockBlockScore();
};
t.prototype.initNewUserState = function() {
storage.getItem("classReviveBlockScoreUnlocked", !1);
};
t.prototype.shouldBlockBaseScore = function() {
return !storage.getItem("classReviveBlockScoreUnlocked", !1);
};
t.prototype.unlockBlockScore = function() {
storage.setItem("classReviveBlockScoreUnlocked", !0);
};
return n([ classId("ReviveBlockScoreTrait") ], t);
}(Trait);
o.ReviveBlockScoreTrait = i;
cc._RF.pop();
}, {} ]
}, {}, [ "ReviveBlockScoreTrait" ]);
//# sourceMappingURL=index.js.map
