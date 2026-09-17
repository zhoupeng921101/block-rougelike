window.__require = function e(t, r, i) {
function s(o, c) {
if (!r[o]) {
if (!t[o]) {
var a = o.split("/");
a = a[a.length - 1];
if (!t[a]) {
var g = "function" == typeof __require && __require;
if (!c && g) return g(a, !0);
if (n) return n(a, !0);
throw new Error("Cannot find module '" + o + "'");
}
o = a;
}
var u = r[o] = {
exports: {}
};
t[o][0].call(u.exports, function(e) {
return s(t[o][1][e] || e);
}, u, u.exports, e, t, r, i);
}
return r[o].exports;
}
for (var n = "function" == typeof __require && __require, o = 0; o < i.length; o++) s(i[o]);
return s;
}({
HighestScoretriggersSkinReplacementTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "72be7R7+xRFM4DyjWmJEbMU", "HighestScoretriggersSkinReplacementTrait");
var i, s = this && this.__extends || (i = function(e, t) {
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
}), n = this && this.__decorate || function(e, t, r, i) {
var s, n = arguments.length, o = n < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) o = Reflect.decorate(e, t, r, i); else for (var c = e.length - 1; c >= 0; c--) (s = e[c]) && (o = (n < 3 ? s(o) : n > 3 ? s(t, r, o) : s(t, r)) || o);
return n > 3 && o && Object.defineProperty(t, r, o), o;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.HighestScoretriggersSkinReplacementTrait = void 0;
var o = function(e) {
s(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.data = function() {
return {
isTriggered: !1
};
};
t.prototype.onActive = function(e) {
var t, r, i, s;
if (hs.tp.isClassSkin_ProxyOnScoreTipShow(e)) {
if ((null === (r = null === (t = e.args[0]) || void 0 === t ? void 0 : t.state) || void 0 === r ? void 0 : r.clearScreen) && hs.classGameInfo.roundNum > 5) {
hs.classScoreInfo.score > this.getHighestScore() && !this.state.isTriggered && hs.classGuideInfo.step > 2 && hs.classGameInfo.gameNum > 0 && (this.state.isTriggered = !0);
return;
}
if (hs.classScoreInfo.score > this.getHighestScore() && !this.state.isTriggered && hs.classGuideInfo.step > 2 && hs.classGameInfo.gameNum > 0) {
this.state.isTriggered = !0;
storage.setItem("classHighestScoreSkinReplacementIsTriggered", !0);
var n = this.getTraitSkinId();
n > -1 && hs.EventManager.dispatchModuleEvent(new hs.E_Skin_Update("" + n));
}
}
if (hs.tp.isClassSkin_Extra_ProxyOnGameStart(e)) if (null === (s = null === (i = e.args[0]) || void 0 === i ? void 0 : i.data) || void 0 === s ? void 0 : s.newGame) {
this.state.isTriggered = !1;
storage.setItem("classHighestScoreSkinReplacementIsTriggered", !1);
} else this.state.isTriggered = storage.getItem("classHighestScoreSkinReplacementIsTriggered", !1);
};
t.prototype.getHighestScore = function() {
return Math.max(hs.scoreInfo.highScore, hs.scoreInfo.highRecordScore);
};
t.prototype.getTraitSkinId = function() {
var e = hs.skinRandomInfo.getRandomSkin();
return e && e[0] && e[0].ID ? e[0].ID : -1;
};
return n([ classId("HighestScoretriggersSkinReplacementTrait") ], t);
}(Trait);
r.HighestScoretriggersSkinReplacementTrait = o;
cc._RF.pop();
}, {} ]
}, {}, [ "HighestScoretriggersSkinReplacementTrait" ]);
//# sourceMappingURL=index.js.map
