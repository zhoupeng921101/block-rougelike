window.__require = function e(t, r, i) {
function s(n, l) {
if (!r[n]) {
if (!t[n]) {
var o = n.split("/");
o = o[o.length - 1];
if (!t[o]) {
var h = "function" == typeof __require && __require;
if (!l && h) return h(o, !0);
if (a) return a(o, !0);
throw new Error("Cannot find module '" + n + "'");
}
n = o;
}
var _ = r[n] = {
exports: {}
};
t[n][0].call(_.exports, function(e) {
return s(t[n][1][e] || e);
}, _, _.exports, e, t, r, i);
}
return r[n].exports;
}
for (var a = "function" == typeof __require && __require, n = 0; n < i.length; n++) s(i[n]);
return s;
}({
$39311_f_newPlayerClearHelpTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "8d41ejy7NtA95c4ZRffTQcu", "$39311_f_newPlayerClearHelpTrait");
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
}), a = this && this.__decorate || function(e, t, r, i) {
var s, a = arguments.length, n = a < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(e, t, r, i); else for (var l = e.length - 1; l >= 0; l--) (s = e[l]) && (n = (a < 3 ? s(n) : a > 3 ? s(t, r, n) : s(t, r)) || n);
return a > 3 && n && Object.defineProperty(t, r, n), n;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.$39311_f_newPlayerClearHelpTrait = void 0;
var n = [ 4, 10 ], l = function(e) {
s(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._gameNum = 1;
t._isAllClear = !1;
t._percent = 0;
t._isReplayPending = !1;
t._shouldTriggerInCurrentGame = !1;
return t;
}
t.prototype.onCreate = function() {
this.getData();
if (this._gameNum <= n[1] && this._gameNum >= n[0] && 0 === this._percent) {
this._percent = 100 * Math.random();
this._shouldTriggerInCurrentGame = this._percent > 50;
this.saveData();
}
};
t.prototype.reset = function(e) {
void 0 === e && (e = !1);
this._isAllClear = !1;
this._percent = 0;
this._shouldTriggerInCurrentGame = !1;
e || this._gameNum++;
if (this._gameNum >= n[0] && this._gameNum <= n[1]) {
this._percent = 100 * Math.random();
this._shouldTriggerInCurrentGame = this._percent > 50;
}
this.saveData();
};
t.prototype.checkAllClear = function() {
if (hs.classGuideInfo.step < 3) ; else {
for (var e = hs.classBoardInfo.faceBlocks, t = 0, r = 0; r < e.length; r++) for (var i = 0; i < e[r].length; i++) -1 === e[r][i] && t++;
if (64 === t) {
this._isAllClear = !0;
this.saveData();
}
}
};
t.prototype.isTrigger = function() {
return !(hs.classGuideInfo.step < 3) && (!this._isAllClear && (!(this._gameNum > n[1]) && (!(hs.classGameInfo.roundNum <= 5) && (this._gameNum <= 3 || this._gameNum >= n[0] && this._gameNum <= n[1] && this._shouldTriggerInCurrentGame))));
};
t.prototype.saveData = function() {
var e = {
gameNum: this._gameNum,
isAllClear: this._isAllClear,
percent: this._percent,
shouldTriggerInCurrentGame: this._shouldTriggerInCurrentGame
};
hs.storage.setItem("localstorage_newPlayerClearHelp", e);
};
t.prototype.getData = function() {
var e, t;
try {
var r = hs.storage.getItem("localstorage_newPlayerClearHelp");
if (r) {
this._gameNum = r.gameNum;
this._isAllClear = r.isAllClear;
this._percent = null !== (e = r.percent) && void 0 !== e ? e : 0;
this._shouldTriggerInCurrentGame = null !== (t = r.shouldTriggerInCurrentGame) && void 0 !== t && t;
} else {
var i = hs.storage.getItem("classGameNum", 0);
this._gameNum = 0 === i ? 1 : i;
this._isAllClear = !1;
this._percent = 0;
this._shouldTriggerInCurrentGame = !1;
this.saveData();
}
} catch (e) {
i = hs.storage.getItem("classGameNum", 0);
this._gameNum = 0 === i ? 1 : i;
this._isAllClear = !1;
this._percent = 0;
this._shouldTriggerInCurrentGame = !1;
this.saveData();
}
};
t.prototype.onActive = function(e) {
if (hs.tp.isClassAlgorithmLifeCycle_Replay_ProxyOnGameReplay(e)) {
this._isReplayPending = !0;
this.reset(!0);
}
hs.tp.isClassAlgorithmLifeCycle_GameStart_ProxyNewGameInit(e) && (this._isReplayPending ? this._isReplayPending = !1 : this.reset(!1));
hs.tp.isClassAlgorithmLifeCycle_TouchEnd_ProxyOnTouchEndDelay(e) && this.checkAllClear();
if (hs.tp.isClassAlgorithmStrategy_Condition_ProxyOnAlgorithmStrategyCondition(e) && this.isTrigger()) {
var t = hs.algorithmStrategyInfo.algorithmList;
t.unshift(hs.OFFER_TYPE.CLEAR_BOARD_PRO);
hs.algorithmStrategyInfo.setAlgorithmList(t);
}
if (hs.tp.isAlgorithmProcessInfoHandleArgs(e) && hs.algorithmName.algoActualId === hs.OFFER_TYPE.CLEAR_BOARD_PRO) {
var r = e.args[0];
r.extra || (r.extra = {});
r.extra.algoIndex = 1;
}
};
return a([ classId("$39311_f_newPlayerClearHelpTrait") ], t);
}(Trait);
r.$39311_f_newPlayerClearHelpTrait = l;
cc._RF.pop();
}, {} ]
}, {}, [ "$39311_f_newPlayerClearHelpTrait" ]);
//# sourceMappingURL=index.js.map
