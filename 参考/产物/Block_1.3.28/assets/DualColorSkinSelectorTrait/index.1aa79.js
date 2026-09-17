window.__require = function e(t, r, o) {
function i(s, a) {
if (!r[s]) {
if (!t[s]) {
var l = s.split("/");
l = l[l.length - 1];
if (!t[l]) {
var u = "function" == typeof __require && __require;
if (!a && u) return u(l, !0);
if (n) return n(l, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = l;
}
var c = r[s] = {
exports: {}
};
t[s][0].call(c.exports, function(e) {
return i(t[s][1][e] || e);
}, c, c.exports, e, t, r, o);
}
return r[s].exports;
}
for (var n = "function" == typeof __require && __require, s = 0; s < o.length; s++) i(o[s]);
return i;
}({
DualColorSkinSelectorTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "255bakXaKFP6bZBKmjplfAy", "DualColorSkinSelectorTrait");
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
}), n = this && this.__decorate || function(e, t, r, o) {
var i, n = arguments.length, s = n < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, o); else for (var a = e.length - 1; a >= 0; a--) (i = e[a]) && (s = (n < 3 ? i(s) : n > 3 ? i(t, r, s) : i(t, r)) || s);
return n > 3 && s && Object.defineProperty(t, r, s), s;
}, s = this && this.__awaiter || function(e, t, r, o) {
return new (r || (r = Promise))(function(i, n) {
function s(e) {
try {
l(o.next(e));
} catch (e) {
n(e);
}
}
function a(e) {
try {
l(o.throw(e));
} catch (e) {
n(e);
}
}
function l(e) {
e.done ? i(e.value) : (t = e.value, t instanceof r ? t : new r(function(e) {
e(t);
})).then(s, a);
var t;
}
l((o = o.apply(e, t || [])).next());
});
}, a = this && this.__generator || function(e, t) {
var r, o, i, n, s = {
label: 0,
sent: function() {
if (1 & i[0]) throw i[1];
return i[1];
},
trys: [],
ops: []
};
return n = {
next: a(0),
throw: a(1),
return: a(2)
}, "function" == typeof Symbol && (n[Symbol.iterator] = function() {
return this;
}), n;
function a(e) {
return function(t) {
return l([ e, t ]);
};
}
function l(n) {
if (r) throw new TypeError("Generator is already executing.");
for (;s; ) try {
if (r = 1, o && (i = 2 & n[0] ? o.return : n[0] ? o.throw || ((i = o.return) && i.call(o), 
0) : o.next) && !(i = i.call(o, n[1])).done) return i;
(o = 0, i) && (n = [ 2 & n[0], i.value ]);
switch (n[0]) {
case 0:
case 1:
i = n;
break;

case 4:
s.label++;
return {
value: n[1],
done: !1
};

case 5:
s.label++;
o = n[1];
n = [ 0 ];
continue;

case 7:
n = s.ops.pop();
s.trys.pop();
continue;

default:
if (!(i = s.trys, i = i.length > 0 && i[i.length - 1]) && (6 === n[0] || 2 === n[0])) {
s = 0;
continue;
}
if (3 === n[0] && (!i || n[1] > i[0] && n[1] < i[3])) {
s.label = n[1];
break;
}
if (6 === n[0] && s.label < i[1]) {
s.label = i[1];
i = n;
break;
}
if (i && s.label < i[2]) {
s.label = i[2];
s.ops.push(n);
break;
}
i[2] && s.ops.pop();
s.trys.pop();
continue;
}
n = t.call(e, s);
} catch (e) {
n = [ 6, e ];
o = 0;
} finally {
r = i = 0;
}
if (5 & n[0]) throw n[1];
return {
value: n[0] ? n[1] : void 0,
done: !0
};
}
}, l = this && this.__values || function(e) {
var t = "function" == typeof Symbol && Symbol.iterator, r = t && e[t], o = 0;
if (r) return r.call(e);
if (e && "number" == typeof e.length) return {
next: function() {
e && o >= e.length && (e = void 0);
return {
value: e && e[o++],
done: !e
};
}
};
throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, u = this && this.__read || function(e, t) {
var r = "function" == typeof Symbol && e[Symbol.iterator];
if (!r) return e;
var o, i, n = r.call(e), s = [];
try {
for (;(void 0 === t || t-- > 0) && !(o = n.next()).done; ) s.push(o.value);
} catch (e) {
i = {
error: e
};
} finally {
try {
o && !o.done && (r = n.return) && r.call(n);
} finally {
if (i) throw i.error;
}
}
return s;
}, c = this && this.__spread || function() {
for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(u(arguments[t]));
return e;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.DualColorSkinSelectorTrait = void 0;
var h = e("./DualColorUtils"), d = {
1e3: {
groups: [ [ 2, 3 ], [ 2, 7 ], [ 1, 4 ], [ 4, 7 ], [ 4, 6 ], [ 5, 6 ], [ 5, 7 ], [ 3, 4 ], [ 3, 7 ], [ 2, 5 ] ],
name: ""
}
}, p = [ [ 4, 4, 4, 6, 6, 3, 3, 3 ], [ 6, 6, 4, 6, 6, 3, 5, 5 ], [ 6, 2, 2, 7, 7, 4, 4, 5 ], [ 2, 3, 3, 7, 4, 1, 1, 4 ], [ 2, 3, 3, 2, 4, 1, 1, 4 ], [ 5, 2, 2, 2, 3, 4, 4, 6 ], [ 5, 1, 1, 1, 3, 7, 7, 6 ], [ 5, 5, 5, 1, 3, 3, 7, 7 ] ], f = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._isResReady = !1;
t._isResLoading = !1;
t._isBundleComplete = !1;
t._dualColorConfig = null;
t._currentGroup = [];
t._currentSkinId = "";
t._skinInfoConfig = {};
t._originSkinInfoConfig = {};
t._isRrefreshedGroup = !1;
t._initialized = !1;
t._initSkinChange = !1;
t._skinPool = [];
t._isConfigsLoaded = !1;
t._isReplay = !1;
t._isHome = !1;
t._isEndGame = !1;
t._isGameEnd = !1;
t._guideDefaultFaceBlocks = [ [ -1, -1, -1, 2, 2, -1, -1, -1 ], [ -1, -1, -1, 2, 2, -1, -1, -1 ], [ -1, -1, -1, 1, 1, -1, -1, -1 ], [ 2, 2, 1, -1, -1, 1, 2, 2 ], [ 2, 2, 1, -1, -1, 1, 2, 2 ], [ -1, -1, -1, 1, 1, -1, -1, -1 ], [ -1, -1, -1, 2, 2, -1, -1, -1 ], [ -1, -1, -1, 2, 2, -1, -1, -1 ] ];
t._produceItem = null;
t._produceItemColor = -1;
return t;
}
t.prototype.onCreate = function() {
return s(this, void 0, Promise, function() {
return a(this, function(e) {
switch (e.label) {
case 0:
this.resetAllCounts();
return [ 4, this.startLoadRes() ];

case 1:
e.sent();
return [ 2 ];
}
});
});
};
t.prototype.onActive = function(e) {
hs.tp.isMergeBlocksSkin_ProxyOnOpenMergeBlocks(e) && this.handlerOnOpenMergeBlocks();
hs.tp.isMergeBlocksSkin_ProxyOnCloseMergeBlocks(e) && this.OnCloseMergeBlocks();
hs.tp.isMergeBlocksGameOver_GameEnd_ProxyOnGameEnd(e) && this.onGameEnd();
hs.tp.isSetup_ProxyOnClick_replay(e) && this.isMergeBlocksStandMode() && (this._isReplay = !0);
hs.tp.isSetup_ProxyOnClick_home(e) && this.isMergeBlocksStandMode() && (this._isHome = !0);
if (hs.tp.isSkin_ProxyUpdateCurSkinIdStorage(e) && this.isMergeBlocksStandMode() && this._initialized) {
e.replace = !0;
e.returnState = !0;
}
hs.tp.isCleanSceneUseSequenceSkinTraitUpdateSkinPool(e);
if (hs.tp.isSkin_ProxyLoadSkinInfoConfig(e) && this.isClassMode()) {
var t = e.args[0];
e.args[1] = "Remote_MergeBlocksClassRes";
e.args[2] = "configs/skins/skin_" + t;
}
hs.tp.isSkin_ProxyOnSkinUpdate(e) && this.onSkinUpdate(e);
hs.tp.isSkin_Block_ProxyOnSkinReadyComplete(e) && this.onSkinReadyComplete(e);
hs.tp.isClassBoard_ProxyOnBoardInit(e) && this.OnBoardInit();
hs.tp.isMergeBlocksBoard_ProxyOnBoardInit(e) && this.OnBoardInit();
hs.tp.isClassDefaultBoard_ProxyProduceDefaultBoardFinal(e) && this.produceDefaultBoardFinal(e);
hs.tp.isMergeBlocksDefaultBoard_ProxyProduceDefaultBoardFinal(e) && this.produceDefaultBoardFinal(e);
hs.tp.isClassBlocksProducer_ProxyBeforeBlocksProducerUpdate(e) && this.beforeBlocksProducerUpdate(e);
hs.tp.isMergeBlocksBlocksProducer_ProxyBeforeBlocksProducerUpdate(e) && this.beforeBlocksProducerUpdate(e);
hs.tp.isMergeBlocksBlocksProducer_Render_ProxyUpdateBlocksProducerState(e) && this.beforeBlocksProducerUpdate(e, !0);
hs.tp.isClassBoardSplashAnimation_ProxyGetBoardSplashAnimationColorConfig(e) && this.getBoardSplashAnimationColorConfig(e, !0);
hs.tp.isMergeBlocksBoardSplashAnimation_ProxyGetAnimationColorConfigs(e) && this.getBoardSplashAnimationColorConfig(e, !0);
hs.tp.isClassBoardSplashAnimation_ProxySetBoardSplashAnimationState(e) && this.setBoardSplashAnimationState(e);
hs.tp.isMergeBlocksBoardSplashAnimation_ProxySetBoardSplashAnimationState(e) && this.setBoardSplashAnimationState(e);
if (hs.tp.isGameOver_Splash_ProxyGetBoardSplashAnimationColorConfig(e) && this.isMergeBlocksMode()) {
e.returnValue = this.applyDualColorToBoard(p);
e.returnState = !0;
}
if (hs.tp.isIsOpenFirstDayReplayGuideBoardTraitGetInitBoard(e) && this.isMergeBlocksMode()) {
e.returnValue = this.applyDualColorToBoard(this._guideDefaultFaceBlocks);
e.replace = !0;
e.returnState = !0;
}
if (hs.tp.isIsOpenFirstDayReplayGuideBoardTraitGetBlocksColors(e) && this.isMergeBlocksMode()) {
e.returnValue = this.getColorList();
e.returnState = !0;
}
hs.tp.isFirstEightGamesFixedBoardTraitUpdateFaceBlocks(e) && this.handlerFirstEightGamesFixedBoardTraitUpdateFaceBlocks(e);
hs.tp.isFirstEightGamesFixedBoardTraitUpdateBlocksColors(e) && this.handlerFirstEightGamesFixedBoardTraitUpdateBlocksColors(e);
if (hs.tp.isFirstEightGamesFixedBoardTraitCheckInFirstEightGames(e) && this.isMergeBlocksMode()) {
e.returnValue = !1;
e.replace = !0;
}
if (hs.tp.isSessionTimeChangeSkinTraitIsTrigger(e) && this.isMergeBlocksMode()) {
e.returnValue = !0;
e.replace = !0;
}
hs.tp.isClassGame_ProxyOnGameStart(e) && this.onGameStart(e);
if (hs.tp.isShowChangeSkinCountTraitIsTriggerShowChangeSkinCount(e) && this.isMergeBlocksStandMode()) {
e.returnValue = !1;
e.returnState = !0;
}
if (hs.tp.isReplayFilterCurSkinTraitIsTrigger(e) && this.isMergeBlocksMode()) {
e.returnValue = !0;
e.replace = !0;
}
hs.tp.isClassBoard_Color_ProxyOnBlocksProducerTouchStart(e) && this.OnBlocksProducerTouchStart(e);
hs.tp.isBlocksProducerTouchChangeCurColor(e) && this.OnBlocksProducerTouchChangeCurColor(e);
};
t.prototype.refreshResReady = function() {
this.isClassMode() && this.isResLoaded() && (this._isResReady = !0);
};
t.prototype.onGameStart = function() {
if (this.isClassMode()) {
if (this._isResLoading) return;
this.isResLoaded() ? hs.gameInfo.gameNum > 0 && (this._isResReady = !0) : this.startLoadRes();
}
};
t.prototype.loadDualColorConfig = function() {
return s(this, void 0, void 0, function() {
var e, t;
return a(this, function(r) {
switch (r.label) {
case 0:
return [ 4, hs.ResLoader.asyncLoadByBundle("Remote_MergeBlocksClassRes", "configs/dualColorRandomPool", cc.JsonAsset) ];

case 1:
if (!(e = r.sent()) || !e.json) return [ 2 ];
this._skinPool = e.json;
return [ 4, hs.ResLoader.asyncLoadByBundle("Remote_MergeBlocksClassRes", "configs/dualColorGroups", cc.JsonAsset) ];

case 2:
if (!(t = r.sent()) || !t.json) return [ 2 ];
this._dualColorConfig = t.json;
return [ 2 ];
}
});
});
};
t.prototype.loadAllSkinInfoConfig = function() {
return s(this, void 0, void 0, function() {
var e, t, r, o, i, n, s, u, c;
return a(this, function(a) {
switch (a.label) {
case 0:
if (!(e = this._dualColorConfig)) return [ 2 ];
a.label = 1;

case 1:
a.trys.push([ 1, 6, 7, 8 ]);
t = l(Object.keys(e)), r = t.next();
a.label = 2;

case 2:
if (r.done) return [ 3, 5 ];
o = r.value;
i = "configs/skins/skin_" + o;
return [ 4, this.loadSkinInfoConfig(o, "Remote_MergeBlocksClassRes", i) ];

case 3:
if (!(n = a.sent()) || !n.json) return [ 3, 4 ];
this._skinInfoConfig[o] = n.json;
a.label = 4;

case 4:
r = t.next();
return [ 3, 2 ];

case 5:
return [ 3, 8 ];

case 6:
s = a.sent();
u = {
error: s
};
return [ 3, 8 ];

case 7:
try {
r && !r.done && (c = t.return) && c.call(t);
} finally {
if (u) throw u.error;
}
return [ 7 ];

case 8:
return [ 2 ];
}
});
});
};
t.prototype.startLoadBundleResource = function() {
return s(this, void 0, void 0, function() {
return a(this, function(e) {
switch (e.label) {
case 0:
if (cc.assetManager.getBundle("Remote_MergeBlocksClassRes")) {
this._isBundleComplete = !0;
return [ 2 ];
}
return [ 4, hs.ResLoader.asyncLoadBundle("Remote_MergeBlocksClassRes") ];

case 1:
e.sent();
this._isBundleComplete = !0;
return [ 2 ];
}
});
});
};
t.prototype.loadConfigRes = function() {
return s(this, void 0, void 0, function() {
return a(this, function(e) {
switch (e.label) {
case 0:
return this.isBundleComplete() ? this.isConfigsLoaded() ? [ 2 ] : [ 4, this.loadDualColorConfig() ] : [ 2 ];

case 1:
e.sent();
return [ 4, this.loadAllSkinInfoConfig() ];

case 2:
e.sent();
this._isConfigsLoaded = !0;
this.isClassMode() || (this._isResReady = !0);
return [ 2 ];
}
});
});
};
t.prototype.startLoadRes = function() {
return s(this, void 0, void 0, function() {
return a(this, function(e) {
switch (e.label) {
case 0:
e.trys.push([ 0, 3, 4, 5 ]);
this._isResLoading = !0;
return [ 4, this.startLoadBundleResource() ];

case 1:
e.sent();
return [ 4, this.loadConfigRes() ];

case 2:
e.sent();
this._isResLoading = !1;
this.handlerDualColorConfigComplete();
return [ 3, 5 ];

case 3:
e.sent();
this.handlerResLoadError();
return [ 3, 5 ];

case 4:
this._isResLoading = !1;
return [ 7 ];

case 5:
return [ 2 ];
}
});
});
};
t.prototype.onGameEnd = function() {
this._isGameEnd = !0;
};
t.prototype.onGameEndSkinChange = function() {};
t.prototype.handlerOnOpenMergeBlocks = function() {
if (this.isChangeRoundChangeSkin()) !1 === this._initialized && this.OnOpenMergeBlocks(); else {
if (this._isReplay) {
this._isReplay = !1;
return;
}
this.OnOpenMergeBlocks();
}
};
t.prototype.OnOpenMergeBlocks = function() {
this._initialized = !0;
this.recoverDualSkin();
};
t.prototype.recoverDualSkin = function() {
this.saveOriginSkinInfoConfig();
this.saveOriginSkinId(hs.skinInfo.currentSkinId);
this.replaceOriginSkinInfoConfig();
var e = this.getCurrentSkinId();
hs.EventManager.dispatchModuleEvent(new hs.E_Skin_Update(e));
};
t.prototype.OnBoardInit = function() {
if (this.isClassMode()) {
if (hs.classGuideInfo.isFinishedGuide) return;
var e = this.applyDualColorToBoard(this._guideDefaultFaceBlocks, !0);
storage.setItem("classFaceBlocks", e);
} else if (this.isMergeBlocksStandMode()) {
if (hs.mergeBlocksGuideInfo.isFinishedGuide) return;
e = this._guideDefaultFaceBlocks;
storage.setItem("mergeBlocksFaceBlocks", e);
}
};
t.prototype.produceDefaultBoardFinal = function(e) {
if (this.isClassMode()) {
if (this.isChangeInitBoardColor()) {
var t = e.args[0];
e.args[0] = this.applyDualColorToBoard(t);
}
} else if (this.isMergeBlocksStandMode()) {
t = e.args[0];
e.args[0] = this.applyDualColorToBoard(t);
}
};
t.prototype.beforeBlocksProducerUpdate = function(e, t) {
var r;
void 0 === t && (t = !1);
this.isClassMode() ? (null === (r = hs.classGuideInfo) || void 0 === r ? void 0 : r.isFinishedGuide) && this.applyDualColorToProducer(e) : this.isMergeBlocksStandMode() && this.applyDualColorToProducer(e, t);
};
t.prototype.getBoardSplashAnimationColorConfig = function(e, t) {
void 0 === t && (t = !1);
if (this.isClassMode()) {
e.returnValue = this.applyDualColorToBoard(p, t);
e.returnState = !0;
} else if (this.isMergeBlocksStandMode()) {
e.returnValue = this.applyDualColorToBoard(p, t);
e.returnState = !0;
}
};
t.prototype.setBoardSplashAnimationState = function(e) {
this.isClassMode() ? e.args[1] = this.applyDualColorToBoard(p) : this.isMergeBlocksStandMode() && (e.args[1] = this.applyDualColorToBoard(p));
};
t.prototype.isCleanScreenChangeSkin = function() {
var e = TRAIT("DualColorSkinByClearBoardTrait");
return !(null == e || !e.active);
};
t.prototype.isChangeRoundChangeSkin = function() {
var e = TRAIT("DualColorSkinByRoundTrait");
return !(null == e || !e.active);
};
t.prototype.OnCloseMergeBlocks = function() {
this._initialized = !1;
this._initSkinChange = !1;
this._isEndGame = !0;
if (this._isGameEnd) {
this._isGameEnd = !1;
this.onGameEndSkinChange();
} else {
this.restoreOriginSkinInfoConfig();
var e = this.getOriginSkinId();
e != hs.skinInfo.currentSkinId && hs.EventManager.dispatchModuleEvent(new hs.E_Skin_Update(e));
}
};
t.prototype.OnBlocksProducerTouchStart = function(e) {
var t, r;
if (this.isClassMode()) {
var o = e.args[0];
this._produceItem = o.target;
if (this._produceItem.node.children.length > 0) try {
for (var i = l(this._produceItem.node.children), n = i.next(); !n.done; n = i.next()) {
var s = n.value.getComponent(hs.Block);
if (s) {
this._produceItemColor = s.state.color;
return;
}
}
} catch (e) {
t = {
error: e
};
} finally {
try {
n && !n.done && (r = i.return) && r.call(i);
} finally {
if (t) throw t.error;
}
}
}
};
t.prototype.OnBlocksProducerTouchChangeCurColor = function(e) {
this.isClassMode() && (e.args[1] = this._produceItemColor);
};
t.prototype.onSkinUpdate = function(e) {
if (this.isMergeBlocksMode()) if (this._isHome) this._isHome = !1; else {
var t = !1;
this.isClassMode() && (t = !this.isResReady());
t && (e.args[0].skinId = "1000");
var r = e.args[0].skinId;
if (this._isEndGame) this._isEndGame = !1; else {
this._currentSkinId = r;
var o = this.getData();
o.currentSkinId = r;
this.saveData(o);
}
this._isRrefreshedGroup = !1;
this._currentGroup = [];
}
};
t.prototype.onSkinReadyComplete = function() {
this.isMergeBlocksStandMode() && this._initialized && this.onSkinChanged();
this.isClassMode() && this.onSkinChanged();
};
t.prototype.getDualColorConfig = function() {
return this.isResReady() ? this._dualColorConfig : d;
};
t.prototype.getSkinPool = function() {
return this.isResReady() ? this._skinPool : [];
};
t.prototype.handlerDualColorConfigComplete = function() {};
t.prototype.handlerResLoadError = function() {};
t.prototype.isDualColorSkin = function(e) {
var t = this.getDualColorConfig();
return !!t && !!t[e || hs.skinInfo.currentSkinId];
};
t.prototype.getSkinGroups = function(e) {
var t = this.getDualColorConfig();
if (!t) return [];
var r = t[e || hs.skinInfo.currentSkinId];
return r ? r.groups : [];
};
t.prototype.isFinishedGuide = function() {
var e, t;
return this.isClassMode() ? null === (e = hs.classGuideInfo) || void 0 === e ? void 0 : e.isFinishedGuide : !!this.isMergeBlocksStandMode() && (null === (t = hs.mergeBlocksGuideInfo) || void 0 === t ? void 0 : t.isFinishedGuide);
};
t.prototype.getCurrentDualColors = function() {
if (!this.isFinishedGuide()) {
this._currentGroup = [ 1, 2 ];
var e = this.getData();
e.currentGroup = this._currentGroup;
e.currentSkinId = "1000";
this.saveData(e);
return this._currentGroup;
}
if (!this._currentGroup || 0 === this._currentGroup.length) {
var t = this.getData();
t.currentGroup && 2 === t.currentGroup.length && t.currentSkinId === hs.skinInfo.currentSkinId ? this._currentGroup = t.currentGroup : this._currentGroup = [];
}
return 2 === this._currentGroup.length ? c(this._currentGroup) : [];
};
t.prototype.onSkinChanged = function() {
var e = hs.skinInfo.currentSkinId;
if (this.isDualColorSkin(e)) {
if (this.isClassMode()) this._currentGroup = this.createGroupSelected(e); else if (this._initSkinChange) this._currentGroup = this.createGroupSelected(e); else {
var t = this.getData();
this._currentGroup = t.currentGroup;
this._initSkinChange = !0;
}
this.refreshBlocksProducer();
} else this._currentGroup = [];
};
t.prototype.createGroupSelected = function(e) {
if (this._isRrefreshedGroup) return this._currentGroup;
var t = this.getData(), r = this.getSkinGroups(e);
if (!this.isFinishedGuide()) {
t.currentGroup = [ 1, 2 ];
t.currentSkinId = e;
this.saveData(t);
this._isRrefreshedGroup = !0;
return [ 1, 2 ];
}
var o = h.DualColorUtils.selectNextGroup(e, r, t);
t.currentGroup = o;
t.currentSkinId = e;
this.saveData(t);
this._isRrefreshedGroup = !0;
return o;
};
t.prototype.ensureGroupSelected = function(e) {
void 0 === e && (e = null);
e || (e = this.getCurrentSkinId());
e || (e = hs.skinInfo.currentSkinId);
this.isDualColorSkin(e) ? 2 !== this._currentGroup.length && (this._currentGroup = this.createGroupSelected(e)) : this._currentGroup = [];
};
t.prototype.resetAllCounts = function() {
var e = this.getData();
e.groupCounts = {};
e.lastGroupKey = {};
this.saveData(e);
};
t.prototype.applyDualColorToBoard = function(e, t) {
void 0 === t && (t = !1);
if (t) {
var r = this.getData();
this._currentGroup = 2 === r.currentGroup.length ? c(r.currentGroup) : [];
if (!this.isFinishedGuide()) {
this._currentGroup = [ 1, 2 ];
r.currentGroup = this._currentGroup;
r.currentSkinId = "1000";
this.saveData(r);
}
} else this.ensureGroupSelected();
if (!e) return [];
if (2 !== this._currentGroup.length) return e;
for (var o = [ this._currentGroup[1], this._currentGroup[0] ], i = [], n = new Set(), s = 0; s < e.length; s++) for (var a = 0; a < e[s].length; a++) if (-1 !== (u = e[s][a]) && 10 !== u && !n.has(u)) {
n.add(u);
i.push(u);
}
var l = new Map();
i.forEach(function(e, t) {
l.set(e, o[t % o.length]);
});
for (s = 0; s < e.length; s++) for (a = 0; a < e[s].length; a++) {
var u;
-1 !== (u = e[s][a]) && 10 !== u && (e[s][a] = l.get(u));
}
return e;
};
t.prototype.applyDualColorToProducer = function(e, t) {
void 0 === t && (t = !1);
if (this.isFinishedGuide()) {
var r = this.getCurrentDualColors();
if (2 === r.length) {
var o = r[0], i = r[1], n = h.DualColorUtils.generateBlockColors(o, i), s = e.args[1];
if (s && s.length >= 3) {
for (var a = 0; a < s.length; a++) s[a] = n[a];
this.setColorList(n);
}
e.args[1] = n;
}
} else {
var l = [ 1, 1, 1 ];
this.setColorList(l);
e.args[1] = l;
}
};
t.prototype.refreshBlocksProducer = function() {
var e, t;
if (2 === this._currentGroup.length) {
var r = Cinst(hs.BlocksProducer);
if (r) {
var o = this._currentGroup[0], i = this._currentGroup[1], n = h.DualColorUtils.generateBlockColors(o, i);
this.setColorList(n);
for (var s = hs.blocksProducerInfo.producerBlocks, a = r.blocksContainer.children, u = 0; u < a.length; u++) {
s[u];
var c = a[u], d = n[u];
if (cc.isValid(c.children)) try {
for (var p = (e = void 0, l(c.children)), f = p.next(); !f.done; f = p.next()) {
var g = f.value.getComponent(hs.Block);
g && g.setState({
color: d
});
}
} catch (t) {
e = {
error: t
};
} finally {
try {
f && !f.done && (t = p.return) && t.call(p);
} finally {
if (e) throw e.error;
}
}
}
}
}
};
t.prototype.getData = function() {
return storage.getItem("DualColorSkinSelectorTrait", {
groupCounts: {
1e3: {
"1_2": 1
}
},
lastGroupKey: {
1e3: "1_2"
},
currentGroup: [ 1, 2 ],
currentSkinId: "1000",
originSkinId: ""
});
};
t.prototype.saveData = function(e) {
storage.setItem("DualColorSkinSelectorTrait", e);
};
t.prototype.saveOriginSkinInfoConfig = function() {
var e, t, r = this.getDualColorConfig();
if (r) try {
for (var o = l(Object.keys(r)), i = o.next(); !i.done; i = o.next()) {
var n = i.value;
this._originSkinInfoConfig[n] = hs.skinInfo.getSkinInfoBySkinId(n);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
i && !i.done && (t = o.return) && t.call(o);
} finally {
if (e) throw e.error;
}
}
};
t.prototype.replaceOriginSkinInfoConfig = function() {
var e, t, r = this.getDualColorConfig();
if (r) try {
for (var o = l(Object.keys(r)), i = o.next(); !i.done; i = o.next()) {
var n = i.value;
hs.skinInfo.setSkinMap(n, this._skinInfoConfig[n]);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
i && !i.done && (t = o.return) && t.call(o);
} finally {
if (e) throw e.error;
}
}
};
t.prototype.restoreOriginSkinInfoConfig = function() {
var e, t, r = this.getDualColorConfig();
if (r) try {
for (var o = l(Object.keys(r)), i = o.next(); !i.done; i = o.next()) {
var n = i.value;
this._originSkinInfoConfig[n] ? hs.skinInfo.setSkinMap(n, this._originSkinInfoConfig[n]) : hs.skinInfo.clearSkinkey(n);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
i && !i.done && (t = o.return) && t.call(o);
} finally {
if (e) throw e.error;
}
}
};
t.prototype.loadSkinInfoConfig = function(e, t, r) {
void 0 === r && (r = "configs/skin/default/skin_" + e);
return s(this, void 0, Promise, function() {
return a(this, function(e) {
switch (e.label) {
case 0:
return t ? [ 4, hs.ResLoader.asyncLoadByBundle(t, r, cc.JsonAsset) ] : [ 3, 2 ];

case 1:
return [ 2, e.sent() ];

case 2:
return [ 4, hs.ResLoader.asyncLoad(r, cc.JsonAsset) ];

case 3:
return [ 2, e.sent() ];
}
});
});
};
t.prototype.saveOriginSkinId = function(e) {
var t = this.getData();
t.originSkinId = e;
this.saveData(t);
};
t.prototype.getOriginSkinId = function() {
return this.getData().originSkinId;
};
t.prototype.getCurrentSkinId = function() {
return this.getData().currentSkinId;
};
t.prototype.setColorList = function(e) {
this.isClassMode() ? hs.classColorProducerGameInfo.setColorList(e) : this.isMergeBlocksStandMode() && hs.mergeBlocksColorProducerGameInfo.setColorList(e);
};
t.prototype.getColorList = function() {
return this.isClassMode() ? hs.classColorProducerGameInfo.colorList : this.isMergeBlocksStandMode() ? hs.mergeBlocksColorProducerGameInfo.colorList : void 0;
};
t.prototype.isChangeInitBoardColor = function() {
var e, t;
return null === (t = null === (e = this.props) || void 0 === e ? void 0 : e.isChangeInitBoard) || void 0 === t || t;
};
t.prototype.handlerFirstEightGamesFixedBoardTraitUpdateFaceBlocks = function(e) {
if (this.isMergeBlocksMode()) {
var t = u(this.getCurrentDualColors(), 2), r = t[0], o = t[1], i = e.args[0];
if (i) {
for (var n = {}, s = 0; s < i.length; s++) for (var a = 0; a < i[s].length; a++) {
var l = i[s][a];
if (-1 !== l && 10 !== l) {
void 0 === n[l] && (n[l] = Math.random() < .5 ? r : o);
i[s][a] = n[l];
}
}
e.args[0] = i;
}
}
};
t.prototype.handlerFirstEightGamesFixedBoardTraitUpdateBlocksColors = function(e) {
if (this.isMergeBlocksMode()) {
for (var t = u(this.getCurrentDualColors(), 2), r = t[0], o = (t[1], []), i = 0; i < 3; i++) o.push(r);
e.args[0] = o;
}
};
t.prototype.isClassMode = function() {
return "class" === this.props.model;
};
t.prototype.isMergeBlocksStandMode = function() {
return hs.gameInfo.gameMode === hs.GameMode.MergeBlocks && !this.isClassMode();
};
t.prototype.isMergeBlocksMode = function() {
return this.isClassMode() || this.isMergeBlocksStandMode();
};
t.prototype.isConfigsLoaded = function() {
return this._isConfigsLoaded;
};
t.prototype.isBundleComplete = function() {
return this._isBundleComplete;
};
t.prototype.isResLoaded = function() {
return this.isConfigsLoaded() && this.isBundleComplete();
};
t.prototype.isResReady = function() {
return this._isResReady;
};
return n([ classId("DualColorSkinSelectorTrait"), classMethodWatch() ], t);
}(Trait);
r.DualColorSkinSelectorTrait = f;
cc._RF.pop();
}, {
"./DualColorUtils": "DualColorUtils"
} ],
DualColorUtils: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "1fa246feqpOp7si4jBL2N1x", "DualColorUtils");
var o = this && this.__read || function(e, t) {
var r = "function" == typeof Symbol && e[Symbol.iterator];
if (!r) return e;
var o, i, n = r.call(e), s = [];
try {
for (;(void 0 === t || t-- > 0) && !(o = n.next()).done; ) s.push(o.value);
} catch (e) {
i = {
error: e
};
} finally {
try {
o && !o.done && (r = n.return) && r.call(n);
} finally {
if (i) throw i.error;
}
}
return s;
}, i = this && this.__spread || function() {
for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(o(arguments[t]));
return e;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.DualColorUtils = void 0;
var n = function() {
function e() {}
e.generateBlockColors = function(e, t) {
for (var r = !1, o = !1, i = [], n = 0; n < 3; n++) {
var s = Math.random() < .5;
s ? r = !0 : o = !0;
i.push(s ? e : t);
}
r || (i[Math.floor(3 * Math.random())] = e);
o || (i[Math.floor(3 * Math.random())] = t);
return i;
};
e.selectNextGroup = function(e, t, r) {
if (0 === t.length) return [];
if (1 === t.length) return i(t[0]);
r.groupCounts[e] || (r.groupCounts[e] = {});
for (var o = r.groupCounts[e], n = r.lastGroupKey[e] || "", s = Infinity, a = 0; a < t.length; a++) (c = o[u = t[a].join("_")] || 0) < s && (s = c);
var l = [];
for (a = 0; a < t.length; a++) (c = o[u = t[a].join("_")] || 0) === s && u !== n && l.push(t[a]);
if (0 === l.length) for (a = 0; a < t.length; a++) {
var u, c;
(c = o[u = t[a].join("_")] || 0) === s && l.push(t[a]);
}
var h = l[Math.floor(Math.random() * l.length)], d = h.join("_");
o[d] = (o[d] || 0) + 1;
r.lastGroupKey[e] = d;
return i(h);
};
return e;
}();
r.DualColorUtils = n;
cc._RF.pop();
}, {} ]
}, {}, [ "DualColorSkinSelectorTrait", "DualColorUtils" ]);
//# sourceMappingURL=index.js.map
