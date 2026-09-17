window.__require = function e(r, t, i) {
function o(c, u) {
if (!t[c]) {
if (!r[c]) {
var f = c.split("/");
f = f[f.length - 1];
if (!r[f]) {
var a = "function" == typeof __require && __require;
if (!u && a) return a(f, !0);
if (n) return n(f, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = f;
}
var l = t[c] = {
exports: {}
};
r[c][0].call(l.exports, function(e) {
return o(r[c][1][e] || e);
}, l, l.exports, e, r, t, i);
}
return t[c].exports;
}
for (var n = "function" == typeof __require && __require, c = 0; c < i.length; c++) o(i[c]);
return o;
}({
UnlimitedReviveBeforeHighScoreTrait: [ function(e, r, t) {
"use strict";
cc._RF.push(r, "6b250XsxwZOzaY12bklOWSE", "UnlimitedReviveBeforeHighScoreTrait");
var i, o = this && this.__extends || (i = function(e, r) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, r) {
e.__proto__ = r;
} || function(e, r) {
for (var t in r) Object.prototype.hasOwnProperty.call(r, t) && (e[t] = r[t]);
})(e, r);
}, function(e, r) {
i(e, r);
function t() {
this.constructor = e;
}
e.prototype = null === r ? Object.create(r) : (t.prototype = r.prototype, new t());
}), n = this && this.__decorate || function(e, r, t, i) {
var o, n = arguments.length, c = n < 3 ? r : null === i ? i = Object.getOwnPropertyDescriptor(r, t) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(e, r, t, i); else for (var u = e.length - 1; u >= 0; u--) (o = e[u]) && (c = (n < 3 ? o(c) : n > 3 ? o(r, t, c) : o(r, t)) || c);
return n > 3 && c && Object.defineProperty(r, t, c), c;
};
Object.defineProperty(t, "__esModule", {
value: !0
});
t.UnlimitedReviveBeforeHighScoreTrait = void 0;
var c = function(e) {
o(r, e);
function r() {
return null !== e && e.apply(this, arguments) || this;
}
r.prototype.onActive = function(e) {
var r, t, i;
if (hs.tp.isClassRevive_ProxyIsTriggerRevive(e)) {
if (hs.classGameInfo.gameNum < 1) return;
if ((null === (r = TRAIT("IsOpenNoVideoNoRevivieTrait")) || void 0 === r ? void 0 : r.active) && !hs.NativeAd.getReadyByAdType("reward")) return;
e.returnState = !0;
e.replace = !0;
if (hs.classScoreInfo.recordHigh) {
var o = hs.classReviveGameInfo.reviveShowNum >= (null !== (i = null === (t = this.props) || void 0 === t ? void 0 : t.highScoreLimitNum) && void 0 !== i ? i : 2);
e.returnValue = !o;
} else e.returnValue = !0;
}
};
return n([ classId("UnlimitedReviveBeforeHighScoreTrait") ], r);
}(Trait);
t.UnlimitedReviveBeforeHighScoreTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "UnlimitedReviveBeforeHighScoreTrait" ]);
//# sourceMappingURL=index.js.map
