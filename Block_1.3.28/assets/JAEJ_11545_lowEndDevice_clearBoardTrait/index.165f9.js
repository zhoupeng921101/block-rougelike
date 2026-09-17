window.__require = function e(t, r, o) {
function i(n, s) {
if (!r[n]) {
if (!t[n]) {
var l = n.split("/");
l = l[l.length - 1];
if (!t[l]) {
var _ = "function" == typeof __require && __require;
if (!s && _) return _(l, !0);
if (a) return a(l, !0);
throw new Error("Cannot find module '" + n + "'");
}
n = l;
}
var c = r[n] = {
exports: {}
};
t[n][0].call(c.exports, function(e) {
return i(t[n][1][e] || e);
}, c, c.exports, e, t, r, o);
}
return r[n].exports;
}
for (var a = "function" == typeof __require && __require, n = 0; n < o.length; n++) i(o[n]);
return i;
}({
JAEJ_11545_lowEndDevice_clearBoardTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "eb4e3T/d2JDN5FEL0u7czuJ", "JAEJ_11545_lowEndDevice_clearBoardTrait");
var o, i = this && this.__extends || (o = function(e, t) {
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
}), a = this && this.__decorate || function(e, t, r, o) {
var i, a = arguments.length, n = a < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(e, t, r, o); else for (var s = e.length - 1; s >= 0; s--) (i = e[s]) && (n = (a < 3 ? i(n) : a > 3 ? i(t, r, n) : i(t, r)) || n);
return a > 3 && n && Object.defineProperty(t, r, n), n;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.JAEJ_11545_lowEndDevice_clearBoardTrait = void 0;
var n = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.isTiggered = !0;
t.logKey = "JAEJ_11545_lowEndDevice_clearBoard";
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassBoardSplashAnimation_Proxy",
methodName: "triggerClearScreen"
}, {
className: "ClassGameOver_GameEnd_Proxy",
methodName: "onGameEnd"
}, {
className: "ClassGame_Replay_Proxy",
methodName: "onGameReplay"
} ];
};
t.prototype.onActive = function(e) {
hs.tp.isClassBoardSplashAnimation_ProxyTriggerClearScreen(e) && this.isTiggered && (null == (r = TRAIT("IsPuzzleTimeTrait")) ? void 0 : r.active) && (new Date().getTime() - r.state.initTime) / 1e3 < r.state.puzzleTimeFirst && hs.storage.setItem("JAEJ_11545_lowEndDevice_clearBoard_isTiggered", !1);
(hs.tp.isClassGameOver_GameEnd_ProxyOnGameEnd(e) || hs.tp.isClassGame_Replay_ProxyOnGameReplay(e)) && hs.storage.setItem("JAEJ_11545_lowEndDevice_clearBoard_isTiggered", !0);
if (hs.tp.isClassAlgorithmStrategy_Deal_ProxyPostPreprocessing(e)) {
var t = hs.storage.getItem("JAEJ_11545_lowEndDevice_clearBoard_isTiggered", !0);
if (hs.algorithmStrategyInfo.algorithmSourceLevel1 === hs.ClassAlgorithmSourceType.PuzzleTimeFirst && t) {
var r;
if ((null == (r = TRAIT("IsPuzzleTimeTrait")) ? void 0 : r.active) && (new Date().getTime() - r.state.initTime) / 1e3 <= r.state.puzzleTimeFirst + this.props.seconds) {
hs.algorithmName.forceSetAlgoExpectedId(hs.OFFER_TYPE.CLEAR_BOARD);
hs.algorithmStrategyInfo.setAlgorithmPriorityList([ hs.OFFER_TYPE.CLEAR_BOARD, hs.OFFER_TYPE.TIAN_KONG_XIAO_CHU ]);
}
}
}
};
return a([ classId("JAEJ_11545_lowEndDevice_clearBoardTrait") ], t);
}(Trait);
r.JAEJ_11545_lowEndDevice_clearBoardTrait = n;
cc._RF.pop();
}, {} ]
}, {}, [ "JAEJ_11545_lowEndDevice_clearBoardTrait" ]);
//# sourceMappingURL=index.js.map
