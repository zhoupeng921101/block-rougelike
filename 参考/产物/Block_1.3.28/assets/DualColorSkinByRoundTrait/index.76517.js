window.__require = function e(t, n, i) {
function r(s, a) {
if (!n[s]) {
if (!t[s]) {
var u = s.split("/");
u = u[u.length - 1];
if (!t[u]) {
var l = "function" == typeof __require && __require;
if (!a && l) return l(u, !0);
if (o) return o(u, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = u;
}
var h = n[s] = {
exports: {}
};
t[s][0].call(h.exports, function(e) {
return r(t[s][1][e] || e);
}, h, h.exports, e, t, n, i);
}
return n[s].exports;
}
for (var o = "function" == typeof __require && __require, s = 0; s < i.length; s++) r(i[s]);
return r;
}({
DualColorSkinByRoundTrait: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "374efsV+hFKLJkHMy6La8eT", "DualColorSkinByRoundTrait");
var i, r = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), o = this && this.__decorate || function(e, t, n, i) {
var r, o = arguments.length, s = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, n, i); else for (var a = e.length - 1; a >= 0; a--) (r = e[a]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, n, s) : r(t, n)) || s);
return o > 3 && s && Object.defineProperty(t, n, s), s;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.DualColorSkinByRoundTrait = void 0;
var s = function(e) {
r(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._skinPool = [];
t._currentGameId = 0;
t._isEndGame = !1;
t._isContinueGame = !1;
t._isHome = !1;
return t;
}
t.prototype.onActive = function(e) {
if (hs.tp.isDualColorSkinSelectorTraitRecoverDualSkin(e)) {
if (this._isEndGame) {
this._isEndGame = !1;
e.replace = !0;
e.returnState = !0;
} else if (this._isContinueGame) ; else {
e.replace = !0;
e.returnState = !0;
}
this._isEndGame && (this._isEndGame = !1);
}
hs.tp.isClassGame_ProxyOnGameStart(e) && (e.args[0].data.newGame ? this._isContinueGame = !1 : this._isContinueGame = !0);
hs.tp.isMergeBlocksGame_ProxyOnGameStart(e) && (e.args[0].data.newGame ? this._isContinueGame = !1 : this._isContinueGame = !0);
if (hs.tp.isDualColorSkinSelectorTraitOnGameEndSkinChange(e)) {
if (this._currentGameId !== this.getCurrentGameId()) {
this._currentGameId = this.getCurrentGameId();
var t = this.changeSkinOnRound();
this.saveSkinId(t);
}
this._isEndGame = !0;
}
if (hs.tp.isMergeBlocksGame_ProxyNewGameInit(e) && !this.isMergeBlocksClassMode() && this._currentGameId !== this.getCurrentGameId()) {
this._currentGameId = this.getCurrentGameId();
this.changeSkinOnRound();
}
hs.tp.isSetup_ProxyOnClick_replay(e) && this.isMergeBlocksClassMode() && this.changeSkinOnRound();
hs.tp.isSetup_ProxyOnClick_home(e) && this.isMergeBlocksClassMode() && (this._isHome = !0);
hs.tp.isClassSkin_ProxyOnGameClose(e) && this.isMergeBlocksClassMode() && (this._isHome ? this._isHome = !1 : this.changeSkinOnRound());
hs.tp.isDualColorSkinSelectorTraitGetBoardSplashAnimationColorConfig(e) && (this.isMergeBlocksClassMode() ? this.getChangeSkinGameId() === this.getCurrentGameId() ? e.args[1] = !0 : 0 === this.getCurrentGameId() ? e.args[1] = !0 : e.args[1] = !1 : e.args[1] = !0);
if ((hs.tp.isCleanSceneUseSequenceSkinTraitGetIsTrigger(e) || hs.tp.isCleanSceneRandomSkinTraitGetIsTrigger(e)) && hs.gameInfo.gameMode === hs.GameMode.MergeBlocks) {
e.returnValue = !1;
e.returnState = !0;
e.replace = !0;
}
};
t.prototype.getCurrentGameId = function() {
return hs.gameInfo.gameNum;
};
t.prototype.refreshResReady = function() {
if (this.isMergeBlocksClassMode()) {
var e = TRAIT("DualColorSkinSelectorTrait");
if (!(null == e ? void 0 : e.active)) return !1;
e.refreshResReady();
}
};
t.prototype.getSkinPool = function() {
var e = TRAIT("DualColorSkinSelectorTrait");
return (null == e ? void 0 : e.active) ? e.getSkinPool() : [];
};
t.prototype.saveSkinId = function(e) {
var t = TRAIT("DualColorSkinSelectorTrait");
if (!(null == t ? void 0 : t.active)) return [];
var n = t.getData();
n.currentSkinId = e;
t.saveData(n);
};
t.prototype.isMergeBlocksClassMode = function() {
var e = TRAIT("DualColorSkinSelectorTrait");
return !(null == e || !e.active) && e.isClassMode();
};
t.prototype.changeSkinOnRound = function() {
this.refreshResReady();
this._skinPool = this.getSkinPool();
if (0 !== this._skinPool.length) {
var e = this.getNextSkinId();
hs.EventManager.dispatchModuleEvent(new hs.E_Skin_Update(e));
this.isMergeBlocksClassMode() && this.saveChangeSkinGameId(hs.gameInfo.gameNum);
return e;
}
};
t.prototype.getNextSkinId = function() {
var e = this.getSkinPool(), t = this.getSkinIndex();
(t += 1) >= e.length && (t = 0);
this.saveSkinIndex(t);
var n = e[t];
return n ? n.ID.toString() : e[0].ID.toString();
};
t.prototype.getSkinIndex = function() {
return hs.storage.getItem("DualColorSkinByRoundTrait_skinIndex", 0);
};
t.prototype.saveSkinIndex = function(e) {
hs.storage.setItem("DualColorSkinByRoundTrait_skinIndex", e);
};
t.prototype.getChangeSkinGameId = function() {
return hs.storage.getItem("DualColorSkinByRoundTrait_gameId", 0);
};
t.prototype.saveChangeSkinGameId = function(e) {
hs.storage.setItem("DualColorSkinByRoundTrait_gameId", e);
};
return o([ classId("DualColorSkinByRoundTrait"), classMethodWatch() ], t);
}(Trait);
n.DualColorSkinByRoundTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "DualColorSkinByRoundTrait" ]);
//# sourceMappingURL=index.js.map
