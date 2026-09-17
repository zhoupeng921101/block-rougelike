window.__require = function e(r, t, i) {
function o(a, c) {
if (!t[a]) {
if (!r[a]) {
var u = a.split("/");
u = u[u.length - 1];
if (!r[u]) {
var v = "function" == typeof __require && __require;
if (!c && v) return v(u, !0);
if (n) return n(u, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = u;
}
var f = t[a] = {
exports: {}
};
r[a][0].call(f.exports, function(e) {
return o(r[a][1][e] || e);
}, f, f.exports, e, r, t, i);
}
return t[a].exports;
}
for (var n = "function" == typeof __require && __require, a = 0; a < i.length; a++) o(i[a]);
return o;
}({
BreakHighScoreReviveTrait: [ function(e, r, t) {
"use strict";
cc._RF.push(r, "14832paF8dP979YP/gIO2IF", "BreakHighScoreReviveTrait");
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
var o, n = arguments.length, a = n < 3 ? r : null === i ? i = Object.getOwnPropertyDescriptor(r, t) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, r, t, i); else for (var c = e.length - 1; c >= 0; c--) (o = e[c]) && (a = (n < 3 ? o(a) : n > 3 ? o(r, t, a) : o(r, t)) || a);
return n > 3 && a && Object.defineProperty(r, t, a), a;
};
Object.defineProperty(t, "__esModule", {
value: !0
});
t.BreakHighScoreReviveTrait = void 0;
var a = function(e) {
o(r, e);
function r() {
var r = null !== e && e.apply(this, arguments) || this;
r.reviveCountAfterBreakHighScore = 0;
return r;
}
r.prototype.onActive = function(e) {
var r;
hs.tp.isClassRevive_ProxyOnGameStart(e) && e.args[0].data.newGame && (this.reviveCountAfterBreakHighScore = 0);
if (hs.tp.isClassRevive_ProxyIsTriggerRevive(e)) {
if (0 === hs.gameInfo.gameNum) return;
if (hs.classScoreInfo.recordHigh) {
if ((null === (r = TRAIT("IsOpenNoVideoNoRevivieTrait")) || void 0 === r ? void 0 : r.active) && !hs.NativeAd.getReadyByAdType("reward")) return;
if (this.reviveCountAfterBreakHighScore > 0) ; else {
this.reviveCountAfterBreakHighScore += 1;
e.returnValue = !0;
e.replace = !0;
}
}
}
};
n([ hs.storageProperty({
key: "reviveCountAfterBreakHighScore"
}) ], r.prototype, "reviveCountAfterBreakHighScore", void 0);
return n([ classId("BreakHighScoreReviveTrait") ], r);
}(Trait);
t.BreakHighScoreReviveTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "BreakHighScoreReviveTrait" ]);
//# sourceMappingURL=index.js.map
