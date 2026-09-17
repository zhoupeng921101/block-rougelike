window.__require = function o(r, t, e) {
function l(s, n) {
if (!t[s]) {
if (!r[s]) {
var a = s.split("/");
a = a[a.length - 1];
if (!r[a]) {
var c = "function" == typeof __require && __require;
if (!n && c) return c(a, !0);
if (i) return i(a, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = a;
}
var u = t[s] = {
exports: {}
};
r[s][0].call(u.exports, function(o) {
return l(r[s][1][o] || o);
}, u, u.exports, o, r, t, e);
}
return t[s].exports;
}
for (var i = "function" == typeof __require && __require, s = 0; s < e.length; s++) l(e[s]);
return l;
}({
DualColorMoreColorPriorityTrait: [ function(o, r, t) {
"use strict";
cc._RF.push(r, "7195bna16xPpoMBjwV+aVnI", "DualColorMoreColorPriorityTrait");
var e, l = this && this.__extends || (e = function(o, r) {
return (e = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(o, r) {
o.__proto__ = r;
} || function(o, r) {
for (var t in r) Object.prototype.hasOwnProperty.call(r, t) && (o[t] = r[t]);
})(o, r);
}, function(o, r) {
e(o, r);
function t() {
this.constructor = o;
}
o.prototype = null === r ? Object.create(r) : (t.prototype = r.prototype, new t());
}), i = this && this.__decorate || function(o, r, t, e) {
var l, i = arguments.length, s = i < 3 ? r : null === e ? e = Object.getOwnPropertyDescriptor(r, t) : e;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(o, r, t, e); else for (var n = o.length - 1; n >= 0; n--) (l = o[n]) && (s = (i < 3 ? l(s) : i > 3 ? l(r, t, s) : l(r, t)) || s);
return i > 3 && s && Object.defineProperty(r, t, s), s;
};
Object.defineProperty(t, "__esModule", {
value: !0
});
t.DualColorMoreColorPriorityTrait = void 0;
var s = function(o) {
l(r, o);
function r() {
var r = null !== o && o.apply(this, arguments) || this;
r._blockIdList = [];
r._singleColorRound = 0;
r._singleColorTarget = -1;
r._IsProducerColor = !1;
r.COLD_START_KEY = "DualColorPriorityColdStart";
r._isFirstRound = !0;
r._lastCanEliminateShaders = {};
r._cachedPreEliminateColor = -1;
return r;
}
Object.defineProperty(r.prototype, "onActiveCondition", {
get: function() {
return this.isMergeBlocksMode();
},
enumerable: !1,
configurable: !0
});
r.prototype.onActive = function(o) {
var r;
if (hs.tp.isDualColorMoreColorPriorityDefaultTraitIsMergeBlocksMode(o)) {
o.replace = !0;
o.returnValue = !1;
}
if (hs.tp.isClassBlocksProducer_ProxyUpdateItemsColors(o) && !this.IsColorSolid() && (t = this.applyMoreColorPriority())) {
o.args[0] = t;
this.saveColdStartState(t);
}
if (hs.tp.isMergeBlocksBlocksProducer_ProxyUpdateItemsColors(o) && !this.IsColorSolid()) {
var t;
if (t = this.applyMoreColorPriority()) {
for (var e = this.getColorList().slice(0, this._blockIdList.length), l = 0; l < this._blockIdList.length; l++) if (-1 !== this._blockIdList[l]) {
var i = null === (r = t[l]) || void 0 === r ? void 0 : r[0];
"number" == typeof i && (e[l] = i);
}
hs.mergeBlocksColorProducerGameInfo.setColorList(e);
o.args[0] = t;
this.saveColdStartState(t);
}
}
if (hs.tp.isClassColorProducer_ProxyProduceColorPostprocessing(o) && this.IsColorSolid()) {
this.applyMoreColorPriority(!1);
this._IsProducerColor && this.saveColdStartState(null);
o.returnState = !0;
}
if (hs.tp.isMergeBlocksColorProducer_ProxyProduceColorPostprocessing(o) && this.IsColorSolid()) {
this.applyMoreColorPriority(!1);
this._IsProducerColor && this.saveColdStartState(null);
o.returnState = !0;
}
hs.tp.isBlocksProducerTouchSetCanEliminateBlock(o) && this.overridePreEliminateColor(o);
if (hs.tp.isClassGame_ProxyNewGameInit(o)) {
this._singleColorRound = 0;
this._singleColorTarget = -1;
this._isFirstRound = !1;
this._lastCanEliminateShaders = null;
this._cachedPreEliminateColor = -1;
this.clearColdStartState();
}
if (hs.tp.isMergeBlocksGame_ProxyNewGameInit(o)) {
this._singleColorRound = 0;
this._singleColorTarget = -1;
this._isFirstRound = !1;
this._lastCanEliminateShaders = null;
this._cachedPreEliminateColor = -1;
this.clearColdStartState();
}
if (hs.tp.isDualColorSkinSelectorTraitApplyDualColorToProducer(o)) {
var s = o.args[1];
if (this._IsProducerColor && !s) {
o.replace = !0;
o.returnState = !0;
o.args[1] = this.getColorList();
this._IsProducerColor = !1;
}
}
if (hs.tp.isMergeBlocksBlocksProducer_ProxyAfterBlocksProducerUpdate(o) && !this.isMergeBlocksClassMode()) {
o.replace = !0;
o.returnValue = {
afterProducerBlocks: o.args[0],
afterColors: hs.mergeBlocksColorProducerGameInfo.colorList
};
o.returnState = !0;
}
if (hs.tp.isClassBlocksProducer_ProxyAfterBlocksProducerUpdate(o) && this.isMergeBlocksClassMode()) {
o.replace = !0;
o.returnValue = {
afterProducerBlocks: o.args[0],
afterColors: hs.classColorProducerGameInfo.colorList
};
o.returnState = !0;
}
};
r.prototype.applyMoreColorPriority = function(o) {
void 0 === o && (o = !0);
this._blockIdList = hs.algorithmInfo.blockIdList;
if (this._isFirstRound && o) {
this._isFirstRound = !1;
var r = this.loadColdStartState();
if (r) {
this._singleColorRound = r.singleColorRound;
this._singleColorTarget = r.singleColorTarget;
this._IsProducerColor = !0;
if (r.wasSolid) return;
return r.itemsColors;
}
}
var t = this.getDualColors();
if (!t) return null;
var e = t.colorA, l = t.colorB, i = this._blockIdList;
if (!i || 0 === i.length) return null;
this._IsProducerColor = !0;
if (this._singleColorRound > 0 && this._singleColorTarget !== e && this._singleColorTarget !== l) {
this._singleColorRound = 0;
this._singleColorTarget = -1;
}
if (this.canUseSingleColorProtection() && this._singleColorRound > 0) {
this._singleColorRound--;
if (this.IsColorSolid()) {
this.buildForcedBlockColors(this._singleColorTarget);
return;
}
return this.buildForcedCellColors(i, this._singleColorTarget);
}
var s = this.countBoardColors(e, l), n = s.countA, a = s.countB, c = n + a;
if (this.canUseSingleColorProtection() && c > 0 && (0 === n || 0 === a)) {
this._singleColorTarget = 0 === n ? e : l;
this._singleColorRound = 1;
if (this.IsColorSolid()) {
this.buildForcedBlockColors(this._singleColorTarget);
return;
}
return this.buildForcedCellColors(i, this._singleColorTarget);
}
var u = hs.boardInfo.faceBlocks, h = this.calcProbA(e, l, n, a, c), C = {
colorA: e,
colorB: l,
countA: n,
countB: a,
total: c
};
if (!this.IsColorSolid()) {
if (this.canUseBigBlock(e, l)) {
var d = {
colorA: e,
colorB: l,
countA: n,
countB: a,
total: c
};
return this.applyBigBlockCellStrategy(i, d, h);
}
return this.buildPerCellColors(i, e, l, h);
}
this.canUseBigBlock(e, l) ? this.applyEdgeBasedColorStrategy(i, u, C, h) : this.buildPerBlockColors(i, e, l, h);
};
r.prototype.canUseBigBlock = function() {
return !1;
};
r.prototype.applyEdgeBasedColorStrategy = function() {};
r.prototype.applyBigBlockCellStrategy = function() {
return null;
};
r.prototype.overridePreEliminateColor = function(o) {
var r = this.getDualColors();
if (r) {
var t = o.target, e = t._canEliminateShaders, l = t._showShaders, i = o.args[3];
if (e) {
if (e !== this._lastCanEliminateShaders) {
this._lastCanEliminateShaders = e;
this._cachedPreEliminateColor = this.computeMajorityColor(e, l, r.colorA, r.colorB);
}
this._cachedPreEliminateColor > 0 && (i.color = this._cachedPreEliminateColor);
}
}
};
r.prototype.computeMajorityColor = function(o, r, t, e) {
var l, i = 0, s = 0;
for (var n in o) for (var a in o[n]) if (void 0 !== (null === (l = null == r ? void 0 : r[n]) || void 0 === l ? void 0 : l[a])) {
var c = r[n][a];
c === t ? i++ : c === e && s++;
}
return 0 === i && 0 === s ? -1 : i > s ? t : s > i ? e : t;
};
r.prototype.getDualColors = function() {
var o = TRAIT("DualColorSkinSelectorTrait");
if (!o || !o.active) return null;
var r = o.getCurrentDualColors();
return 2 !== r.length ? null : {
colorA: r[0],
colorB: r[1]
};
};
r.prototype.calcProbA = function(o, r, t, e, l) {
var i = this.getMode();
return 0 === l ? .5 : "inverse" === i ? e / l : t / l;
};
r.prototype.buildPerCellColors = function(o, r, t, e) {
for (var l = [], i = 0; i < o.length; i++) {
var s = o[i];
if (-1 !== s) {
var n = hs.BinaryClip.countBlockCells(s);
l[i] = {};
for (var a = 0; a < n; a++) l[i][a] = Math.random() < e ? r : t;
}
}
return l.length > 0 ? l : null;
};
r.prototype.buildPerBlockColors = function(o, r, t, e) {
for (var l = [], i = 0; i < 3; i++) {
var s = Math.random() < e ? r : t;
l.push(s);
}
this.setColorList(l);
};
r.prototype.buildForcedBlockColors = function(o) {
this.setColorList([ o, o, o ]);
};
r.prototype.getColorList = function() {
return this.isMergeBlocksClassMode() ? hs.classColorProducerGameInfo.colorList : hs.mergeBlocksColorProducerGameInfo.colorList;
};
r.prototype.setColorList = function(o) {
this.isMergeBlocksClassMode() ? hs.classColorProducerGameInfo.setColorList(o) : hs.mergeBlocksColorProducerGameInfo.setColorList(o);
};
r.prototype.buildForcedCellColors = function(o, r) {
for (var t = [], e = 0; e < o.length; e++) if (-1 !== o[e]) {
var l = hs.BinaryClip.countBlockCells(o[e]);
t[e] = {};
for (var i = 0; i < l; i++) t[e][i] = r;
}
return t.length > 0 ? t : null;
};
r.prototype.countBoardColors = function(o, r) {
var t = hs.boardInfo.faceBlocks, e = 0, l = 0;
if (!t) return {
countA: e,
countB: l
};
for (var i = 0; i < t.length; i++) for (var s = t[i], n = 0; n < s.length; n++) s[n] === o ? e++ : s[n] === r && l++;
return {
countA: e,
countB: l
};
};
r.prototype.IsColorSolid = function() {
var o, r;
return null !== (r = null === (o = this.props) || void 0 === o ? void 0 : o.isSolid) && void 0 !== r && r;
};
Object.defineProperty(r.prototype, "cachedMajorityPreEliminateColor", {
get: function() {
return this._cachedPreEliminateColor;
},
enumerable: !1,
configurable: !0
});
r.prototype.getMode = function() {
var o, r;
return null !== (r = null === (o = this.props) || void 0 === o ? void 0 : o.mode) && void 0 !== r ? r : "direct";
};
r.prototype.canUseSingleColorProtection = function() {
var o, r;
return null !== (r = null === (o = this.props) || void 0 === o ? void 0 : o.enableSingleColorProtection) && void 0 !== r && r;
};
r.prototype.isMergeBlocksClassMode = function() {
var o = TRAIT("DualColorSkinSelectorTrait");
return !(null == o || !o.active) && o.isClassMode();
};
r.prototype.isMergeBlocksMode = function() {
return !(hs.gameInfo.gameMode !== hs.GameMode.MergeBlocks && !this.isMergeBlocksClassMode());
};
r.prototype.saveColdStartState = function(o) {
var r = {
singleColorRound: this._singleColorRound,
singleColorTarget: this._singleColorTarget,
itemsColors: o,
wasSolid: this.IsColorSolid()
};
hs.storage.setItem(this.COLD_START_KEY, r);
};
r.prototype.loadColdStartState = function() {
var o = hs.storage.getItem(this.COLD_START_KEY, null);
return o && "object" == typeof o ? o : null;
};
r.prototype.clearColdStartState = function() {
hs.storage.setItem(this.COLD_START_KEY, null);
};
return i([ classId("DualColorMoreColorPriorityTrait"), classMethodWatch() ], r);
}(Trait);
t.DualColorMoreColorPriorityTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "DualColorMoreColorPriorityTrait" ]);
//# sourceMappingURL=index.js.map
