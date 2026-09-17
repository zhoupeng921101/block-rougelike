window.__require = function e(t, o, n) {
function i(r, l) {
if (!o[r]) {
if (!t[r]) {
var s = r.split("/");
s = s[s.length - 1];
if (!t[s]) {
var a = "function" == typeof __require && __require;
if (!l && a) return a(s, !0);
if (c) return c(s, !0);
throw new Error("Cannot find module '" + r + "'");
}
r = s;
}
var h = o[r] = {
exports: {}
};
t[r][0].call(h.exports, function(e) {
return i(t[r][1][e] || e);
}, h, h.exports, e, t, o, n);
}
return o[r].exports;
}
for (var c = "function" == typeof __require && __require, r = 0; r < n.length; r++) i(n[r]);
return i;
}({
ChapterCollectedEliminateAndReplaceComponent: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "a30a561OjtKg68gO4shysKF", "ChapterCollectedEliminateAndReplaceComponent");
var n, i = this && this.__extends || (n = function(e, t) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
})(e, t);
}, function(e, t) {
n(e, t);
function o() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
}), c = this && this.__decorate || function(e, t, o, n) {
var i, c = arguments.length, r = c < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, n); else for (var l = e.length - 1; l >= 0; l--) (i = e[l]) && (r = (c < 3 ? i(r) : c > 3 ? i(t, o, r) : i(t, o)) || r);
return c > 3 && r && Object.defineProperty(t, o, r), r;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var r = cc._decorator, l = r.ccclass, s = r.property, a = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.armatureDisplay = null;
return t;
}
t.prototype.onLoad = function() {};
t.prototype.render = function() {
this.state.isIn ? this.armatureDisplay.playAnimation(this.getDragonCollectAnimHead(this.state.color) + "in", 0) : this.playOutAnimationAndDestroy();
};
t.prototype.playOutAnimationAndDestroy = function() {
var e, t, o = this, n = this.getDragonCollectAnimHead(this.state.color) + "out", i = this.armatureDisplay.playAnimation(n, 1), c = null !== (t = null === (e = null == i ? void 0 : i.animationData) || void 0 === e ? void 0 : e.duration) && void 0 !== t ? t : 1;
this.scheduleOnce(function() {
cc.isValid(o.node) && o.node.destroy();
}, c);
};
t.prototype.getDragonCollectAnimHead = function(e) {
switch (e) {
case hs.CollectionType.Gems101:
return "blue_";

case hs.CollectionType.Gems102:
return "green_";

case hs.CollectionType.Gems103:
return "orange_";

case hs.CollectionType.Gems104:
return "yellow_";

case hs.CollectionType.Gems105:
return "red_";

case hs.CollectionType.Gems106:
return "purple_";

default:
return "blue_";
}
};
c([ s(dragonBones.ArmatureDisplay) ], t.prototype, "armatureDisplay", void 0);
return c([ l ], t);
}(hs.Component);
o.default = a;
cc._RF.pop();
}, {} ],
CollectedItemsEliminateAndReplaceTouchEndLogic: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "5184dEU+KhK6K2DWWCkoCOU", "CollectedItemsEliminateAndReplaceTouchEndLogic");
var n = this && this.__read || function(e, t) {
var o = "function" == typeof Symbol && e[Symbol.iterator];
if (!o) return e;
var n, i, c = o.call(e), r = [];
try {
for (;(void 0 === t || t-- > 0) && !(n = c.next()).done; ) r.push(n.value);
} catch (e) {
i = {
error: e
};
} finally {
try {
n && !n.done && (o = c.return) && o.call(c);
} finally {
if (i) throw i.error;
}
}
return r;
}, i = this && this.__spread || function() {
for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(n(arguments[t]));
return e;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.CollectedItemsEliminateAndReplaceTouchEndLogic = void 0;
var c = function() {
function e() {
this._touchCom = null;
}
e.prototype.doEliminateLogic = function(e, t, o, n) {
this._touchCom = Cinst(hs.BlocksProducerTouch);
if (cc.isValid(this._touchCom)) {
var i = this._touchCom.blocksProducerContainer.getComponentInChildren(hs.BlocksProducer);
if (i) {
this._touchCom._color = n;
this._touchCom._faceBlocks = o;
var c = i.node.getChildByName("blocksContainer").children;
this._touchCom._producerBlocks = [ -1, -1, -1 ];
for (var r = 0; r < (null == c ? void 0 : c.length); r++) {
var l = c[r], s = l.getComponent(hs.BlocksProducerItem);
0 !== l.opacity && (this._touchCom._producerBlocks[s.state.index] = s.state.id);
}
this.doTouchEndLogic(e, t);
}
}
};
e.prototype.doTouchEndLogic = function(e, t) {
var o, n, c, r, l, s = this, a = this._touchCom._faceBlocks, h = a.map(function(e) {
return i(e);
}), u = e.eliminateRowsCols, m = t.eliminateRowsCols, p = e.canEliminate || t.canEliminate, d = e.eliminateCount + t.eliminateCount;
this._touchCom._putEliminates = e.putEliminates.concat(t.putEliminates);
this._touchCom._canEliminateInfos = {};
for (var f in e.canEliminateInfos) this._touchCom._canEliminateInfos[f] = Object.assign({}, e.canEliminateInfos[f]);
for (var f in t.canEliminateInfos) {
this._touchCom._canEliminateInfos[f] || (this._touchCom._canEliminateInfos[f] = {});
Object.assign(this._touchCom._canEliminateInfos[f], t.canEliminateInfos[f]);
}
var C = Object.assign(e.grays, t.grays), _ = [], y = [], g = [];
for (var f in this._touchCom._showShaders) for (var E in this._touchCom._showShaders[f]) {
_.push(new cc.Vec2(+f, +E));
y.push(null !== (c = null === (n = null === (o = this._touchCom._blocks[f]) || void 0 === o ? void 0 : o[E]) || void 0 === n ? void 0 : n.convertToWorldSpaceAR(cc.Vec2.ZERO)) && void 0 !== c ? c : []);
this._touchCom._shaders[f][E].node.opacity = 0;
if (!this._touchCom._rowsEffect[f] && !this._touchCom._colsEffect[E] && (I = this._touchCom._blocks[f][E])) {
var v = this._touchCom._shaders[f][E], T = this._touchCom._showShaders[f][E], k = v.node;
I.x = k.x;
I.y = k.y;
I.opacity = 255;
(B = I.getComponent(hs.Block)).setState({
color: T,
sourceColor: T
});
a[f][E] = T;
this._touchCom._putUnEliminates.push(I);
g.push(I.convertToWorldSpaceAR(cc.Vec2.ZERO));
this._touchCom._eliminateRetainShaders.push(I);
}
}
this._touchCom._showShaders = {};
if (C) for (var f in C) for (var E in C[f]) {
var I;
if (I = null === (l = null === (r = this._touchCom._blocks) || void 0 === r ? void 0 : r[f]) || void 0 === l ? void 0 : l[E]) {
var B;
(B = I.getComponent(hs.Block)).setState({
color: hs.ColorProducerType.COLOR_GREY,
sourceColor: hs.ColorProducerType.COLOR_GREY
});
B.node.opacity = 255;
a[f][E] = hs.ColorProducerType.COLOR_GREY;
}
}
switch (hs.gameInfo.gameMode) {
case hs.GameMode.Class:
storage.setItem("classFaceBlocks", a);
storage.setItem("classProducerBlocks", this._touchCom._producerBlocks);
break;

case hs.GameMode.Chapter:
storage.setItem("chapterFaceBlocks", a);
storage.setItem("chapterProducerBlocks", this._touchCom._producerBlocks);
}
var P = {
putEliminates: this._touchCom._putEliminates,
unEliminateTimes: this._touchCom._unEliminateTimes
};
this._touchCom.precessUnEliminateTimes(P);
this._touchCom._putEliminates.length > 0 ? this._touchCom._unEliminateTimes = 0 : this._touchCom._unEliminateTimes++;
this._touchCom.computeContinuousEliminateTimes(this._touchCom._comboAllowNoContinuousTimes);
var A = {
continuousEliminateTimes: this._touchCom._continuousEliminateTimes,
eliminateCount: d,
unEliminateTimes: this._touchCom._unEliminateTimes,
putEliminates: this._touchCom._putEliminates,
comboAllowNoContinuousTimes: this._touchCom._comboAllowNoContinuousTimes
};
this._touchCom.touchFollowUpEliminateTimes(A);
var R = this._touchCom.getPutEliminateBoundingBox(), b = R.minX, w = R.maxX, L = R.minY, x = R.maxY, O = this._touchCom.isClearScreen, D = this._touchCom.isClearProducer, G = {
touchIndex: this._touchCom._selectIndex,
touchStartTime: this._touchCom._touchStartTime,
touchBlockId: this._touchCom._touchBlockId,
eliminateCols: m,
eliminateRows: u,
eliminates: this._touchCom._canEliminateShaders,
eliminateInfos: this._touchCom._canEliminateInfos,
eliminateCount: d,
canEliminate: p,
continuousEliminateTimes: this._touchCom._continuousEliminateTimes,
unEliminateTimes: this._touchCom._unEliminateTimes,
grays: C,
collectItems: this._touchCom.collectItems,
remainBlockProducerCount: this._touchCom.remainBlockProducerCount,
color: this._touchCom._color,
clearScreen: O,
clearProducer: D,
putUnEliminates: this._touchCom._putUnEliminates.concat(),
putEliminates: this._touchCom._putEliminates.concat().map(function(e) {
return e.node;
}),
putEliminatesInfo: this._touchCom._putEliminates.concat(),
putEliminateCenter: new cc.Vec2((b + w) / 2, (L + x) / 2),
putPos: _,
putPosOriginal: y,
putPosition: g,
faceBlocksBefore: h,
movePosList: this._touchCom._canPutMovePosList,
producerBlocks: this._touchCom._producerBlocks
};
this._touchCom.onDataStatisticsTrait();
setTimeoutSafe(function() {
hs.EventManager.dispatchModuleEvent(new hs.E_BlocksProducer_TouchEnd(G));
}, 0);
D ? setTimeoutSafe(function() {
hs.EventManager.dispatchModuleEvent(new hs.E_BlocksProducer_TouchEndDelay(G));
}, 20) : setTimeoutSafe(function() {
s._touchCom.computeRemainBlocksCanPut();
}, 60);
this._touchCom._selectItem = null;
this._touchCom._selectIndex = -1;
};
return e;
}();
o.CollectedItemsEliminateAndReplaceTouchEndLogic = c;
cc._RF.pop();
}, {} ],
CollectedItemsEliminateAndReplaceTrait: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "28eb7g9UEJJLbV32wcBpeAV", "CollectedItemsEliminateAndReplaceTrait");
var n, i = this && this.__extends || (n = function(e, t) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
})(e, t);
}, function(e, t) {
n(e, t);
function o() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
}), c = this && this.__decorate || function(e, t, o, n) {
var i, c = arguments.length, r = c < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, n); else for (var l = e.length - 1; l >= 0; l--) (i = e[l]) && (r = (c < 3 ? i(r) : c > 3 ? i(t, o, r) : i(t, o)) || r);
return c > 3 && r && Object.defineProperty(t, o, r), r;
}, r = this && this.__awaiter || function(e, t, o, n) {
return new (o || (o = Promise))(function(i, c) {
function r(e) {
try {
s(n.next(e));
} catch (e) {
c(e);
}
}
function l(e) {
try {
s(n.throw(e));
} catch (e) {
c(e);
}
}
function s(e) {
e.done ? i(e.value) : (t = e.value, t instanceof o ? t : new o(function(e) {
e(t);
})).then(r, l);
var t;
}
s((n = n.apply(e, t || [])).next());
});
}, l = this && this.__generator || function(e, t) {
var o, n, i, c, r = {
label: 0,
sent: function() {
if (1 & i[0]) throw i[1];
return i[1];
},
trys: [],
ops: []
};
return c = {
next: l(0),
throw: l(1),
return: l(2)
}, "function" == typeof Symbol && (c[Symbol.iterator] = function() {
return this;
}), c;
function l(e) {
return function(t) {
return s([ e, t ]);
};
}
function s(c) {
if (o) throw new TypeError("Generator is already executing.");
for (;r; ) try {
if (o = 1, n && (i = 2 & c[0] ? n.return : c[0] ? n.throw || ((i = n.return) && i.call(n), 
0) : n.next) && !(i = i.call(n, c[1])).done) return i;
(n = 0, i) && (c = [ 2 & c[0], i.value ]);
switch (c[0]) {
case 0:
case 1:
i = c;
break;

case 4:
r.label++;
return {
value: c[1],
done: !1
};

case 5:
r.label++;
n = c[1];
c = [ 0 ];
continue;

case 7:
c = r.ops.pop();
r.trys.pop();
continue;

default:
if (!(i = r.trys, i = i.length > 0 && i[i.length - 1]) && (6 === c[0] || 2 === c[0])) {
r = 0;
continue;
}
if (3 === c[0] && (!i || c[1] > i[0] && c[1] < i[3])) {
r.label = c[1];
break;
}
if (6 === c[0] && r.label < i[1]) {
r.label = i[1];
i = c;
break;
}
if (i && r.label < i[2]) {
r.label = i[2];
r.ops.push(c);
break;
}
i[2] && r.ops.pop();
r.trys.pop();
continue;
}
c = t.call(e, r);
} catch (e) {
c = [ 6, e ];
n = 0;
} finally {
o = i = 0;
}
if (5 & c[0]) throw c[1];
return {
value: c[0] ? c[1] : void 0,
done: !0
};
}
}, s = this && this.__values || function(e) {
var t = "function" == typeof Symbol && Symbol.iterator, o = t && e[t], n = 0;
if (o) return o.call(e);
if (e && "number" == typeof e.length) return {
next: function() {
e && n >= e.length && (e = void 0);
return {
value: e && e[n++],
done: !e
};
}
};
throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.CollectedItemsEliminateAndReplaceTrait = void 0;
var a = e("./components/ChapterCollectedEliminateAndReplaceComponent"), h = e("./interface/ICollectedItemsEliminateAndReplace"), u = e("./logic/CollectedItemsEliminateAndReplaceTouchEndLogic"), m = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._collectionPrefab = null;
t._leftEliminateAnimList = [];
t._faceBlocks = [];
t._color = -1;
t._remainCollectColors = [];
t._isNeedCheckCanPut = !1;
t._currentRoundRowCount = 0;
t._currentRoundColumnCount = 0;
t._exchangeCollectBlocks = [];
t._eliminateColors = [];
t._hideTimer = -1;
t._isProcessing = !1;
t._touchEndLogic = null;
return t;
}
t.prototype.onCreate = function() {
this._touchEndLogic = new u.CollectedItemsEliminateAndReplaceTouchEndLogic();
this.preloadResource();
};
t.prototype.preloadResource = function() {
return r(this, void 0, void 0, function() {
var e;
return l(this, function(t) {
switch (t.label) {
case 0:
if (null != this._collectionPrefab) return [ 2 ];
e = this;
return [ 4, hs.ResLoader.asyncLoadByBundle("CollectedItemsEliminateAndReplaceTrait", "prefabs/ChapterNodeDragonCollect", cc.Prefab) ];

case 1:
e._collectionPrefab = t.sent();
return [ 2 ];
}
});
});
};
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ChapterCollect_Proxy",
methodName: "onTouchEnd"
}, {
className: "ChapterTimer_Proxy",
methodName: "onGameHide"
}, {
className: "ChapterEliminate_Effects_Proxy",
methodName: "onCloseChapterGame"
}, {
className: "ChapterGame_Proxy",
methodName: "onGameOver"
} ];
};
t.prototype.onActive = function(e) {
(hs.tp.isChapterTimer_ProxyOnGameHide(e) || hs.tp.isChapterEliminate_Effects_ProxyOnCloseChapterGame(e) || hs.tp.isChapterGame_ProxyOnGameOver(e)) && this.clearGameState();
if (hs.tp.isChapterTopInfo_CollectEffect_ProxyShowItemAnim(e)) {
var t = e.args[0], o = e.args[1];
this.showItemAnim(e, t, o);
e.replace = !0;
}
hs.tp.isChapterCollect_ProxyOnTouchEnd(e) && this.handleEliminateColors(e.args[0]);
if (hs.tp.isBlocksProducerTouchComputeRemainBlocksCanPut(e)) {
if (hs.gameInfo.gameMode !== hs.GameMode.Chapter) return;
if (this._remainCollectColors.length > 0 && this._leftEliminateAnimList.length > 0) {
this._isNeedCheckCanPut = !0;
e.replace = !0;
}
}
};
t.prototype.handleEliminateColors = function(e) {
var t, o;
if (hs.chapterGameInfo.chapterCondition.Way === hs.ChapterType.collect) {
var n = Cinst(hs.ChapterTopInfoCollect);
if (cc.isValid(n)) {
var i = e.state.eliminateInfos;
if (i && Object.keys(i).length > 0) {
var c = {};
for (var r in i) for (var l in i[r]) (m = i[r][l].color) > 100 && (c[m] = (c[m] || 0) + 1);
var a = n.cacheCollectItems, h = [], u = function(e) {
var t = a.find(function(t) {
return Number(t.color) === Number(e);
});
if (t) {
var o = t.node.getComponent(hs.ChapterCollectTopItem);
o.state.remainCollectCount > 0 && o.state.remainCollectCount <= c[e] && h.push(Number(e));
}
};
for (var m in c) u(m);
if (h.length > 0) {
this._remainCollectColors = [];
this._leftEliminateAnimList.length;
for (var p = 0; p < this._leftEliminateAnimList.length; p++) {
var d = this._leftEliminateAnimList[p];
d.animComponent && cc.isValid(d.animComponent.node) && d.animComponent.node.destroy();
}
this._leftEliminateAnimList = [];
this._exchangeCollectBlocks = [];
var f = Cinst(hs.ChapterTopInfoCollect);
if (!f) return;
var C = f.cacheCollectItems;
try {
for (var _ = s(C), y = _.next(); !y.done; y = _.next()) {
var g = y.value.node.getComponent(hs.ChapterCollectTopItem);
g && g.state.remainCollectCount > 0 && -1 === h.indexOf(g.state.color) && this._remainCollectColors.push(g.state.color);
}
} catch (e) {
t = {
error: e
};
} finally {
try {
y && !y.done && (o = _.return) && o.call(_);
} finally {
if (t) throw t.error;
}
}
if (0 === this._remainCollectColors.length) return;
this._eliminateColors = h;
this.handleLightLogic(h);
}
}
}
}
};
t.prototype.handleLightLogic = function(e) {
for (var t = hs.chapterBoardInfo.faceBlocks, o = hs.boardRendererInfo.blocks, n = 0; n < t.length; n++) for (var i = 0; i < t[n].length; i++) if (-1 !== e.indexOf(t[n][i])) {
var c = o[n][i].convertToWorldSpaceAR(cc.Vec2.ZERO), r = cc.instantiate(this._collectionPrefab);
r.parent = hs.gameEffectLayer;
r.setPosition(c);
var l = r.getComponent(a.default);
l.setState({
isIn: !0,
color: t[n][i]
});
this._leftEliminateAnimList.push({
color: t[n][i],
i: n,
j: i,
animComponent: l
});
}
this._remainCollectColors.length > 0 && this.beforeCalculateBlockArea();
(this._leftEliminateAnimList.length > 0 || this._exchangeCollectBlocks.length > 0) && this.showDontTouchLayer();
0 == this._leftEliminateAnimList.length && this.checkCanPut();
};
t.prototype.showDontTouchLayer = function() {
var e = Cinst(hs.BlocksProducerTouch), t = null == e ? void 0 : e.operator;
if (cc.isValid(t)) {
this.stopHideTimer();
var o = hs.skinLoadInfo.skinResList.skinDontTouchLayer.asset, n = t.getChildByName("SkinDontTouchLayer");
if (!cc.isValid(n) && o) {
(n = cc.instantiate(o)).name = "SkinDontTouchLayer";
t.addChild(n);
} else cc.isValid(n) && (n.active = !0);
}
};
t.prototype.hideDontTouchLayer = function() {
var e, t = null === (e = Cinst(hs.BlocksProducerTouch)) || void 0 === e ? void 0 : e.operator;
if (cc.isValid(t)) {
var o = t.getChildByName("SkinDontTouchLayer");
cc.isValid(o) && (o.active = !1);
}
};
t.prototype.handleFaceEliminateAnim = function() {
var e = this;
if (this._isProcessing) ; else {
this._isProcessing = !0;
this._currentRoundRowCount = 0;
this._currentRoundColumnCount = 0;
var t = 0, o = this._exchangeCollectBlocks.length > 0;
this._remainCollectColors.length > 0 && this.handleBlockAreaReplace();
o && (t = 300);
this._hideTimer = setTimeoutSafe(function() {
e.hideDontTouchLayer();
}, t);
if (0 !== this._leftEliminateAnimList.length || 0 !== this._eliminateColors.length) setTimeoutSafe(function() {
if (cc.isValid(e._collectionPrefab) && cc.isValid(hs.gameEffectLayer)) {
for (var t = hs.chapterBoardInfo.faceBlocks, o = hs.boardRendererInfo.blocks, n = {}, i = 0; i < e._leftEliminateAnimList.length; i++) {
var c = e._leftEliminateAnimList[i];
n[c.i + "_" + c.j] = !0;
}
for (var r = 0; r < t.length; r++) for (var l = 0; l < t[r].length; l++) if (-1 !== e._eliminateColors.indexOf(t[r][l]) && !n[r + "_" + l]) {
var s = o[r][l].convertToWorldSpaceAR(cc.Vec2.ZERO), h = cc.instantiate(e._collectionPrefab);
if (cc.isValid(h)) {
h.parent = hs.gameEffectLayer;
h.setPosition(s);
var u = h.getComponent(a.default);
u.setState({
isIn: !0,
color: t[r][l]
});
e._leftEliminateAnimList.push({
color: t[r][l],
i: r,
j: l,
animComponent: u
});
}
}
if (0 !== e._leftEliminateAnimList.length) {
e._color = e.getEliminateColor(e._leftEliminateAnimList[0].color);
var m = {}, p = {};
for (r = 0; r < e._leftEliminateAnimList.length; r++) "row" === e.getFewerElementsDirection(e._leftEliminateAnimList[r]) ? m[e._leftEliminateAnimList[r].i] = !0 : p[e._leftEliminateAnimList[r].j] = !0;
for (r = e._leftEliminateAnimList.length - 1; r >= 0; r--) {
var d = e._leftEliminateAnimList[r];
d.animComponent.setState({
isIn: !1,
color: d.color
});
}
e._leftEliminateAnimList = [];
e._faceBlocks = hs.chapterBoardInfo.faceBlocks;
var f = e.createEliminate("ROW", m), C = e.createEliminate("COL", p);
e._touchEndLogic.doEliminateLogic(f, C, e._faceBlocks, e._color);
e._remainCollectColors = [];
e._eliminateColors = [];
e._isProcessing = !1;
} else {
e._isProcessing = !1;
e._eliminateColors = [];
e.checkCanPut();
}
} else e._isProcessing = !1;
}, t); else {
this._isProcessing = !1;
this.checkCanPut();
}
}
};
t.prototype.stopHideTimer = function() {
if (-1 !== this._hideTimer) {
clearTimeout(this._hideTimer);
this._hideTimer = -1;
}
};
t.prototype.clearGameState = function() {
this.stopHideTimer();
this.hideDontTouchLayer();
for (var e = 0; e < this._leftEliminateAnimList.length; e++) {
var t = this._leftEliminateAnimList[e];
t.animComponent && cc.isValid(t.animComponent.node) && t.animComponent.node.destroy();
}
this._leftEliminateAnimList = [];
this._faceBlocks = [];
this._color = -1;
this._remainCollectColors = [];
this._isNeedCheckCanPut = !1;
this._currentRoundRowCount = 0;
this._currentRoundColumnCount = 0;
this._exchangeCollectBlocks = [];
this._eliminateColors = [];
this._isProcessing = !1;
};
t.prototype.checkCanPut = function() {
if (this._isNeedCheckCanPut) {
this._isNeedCheckCanPut = !1;
this._remainCollectColors = [];
var e = Cinst(hs.BlocksProducerTouch);
e && e.computeRemainBlocksCanPut();
}
};
t.prototype.beforeCalculateBlockArea = function() {
var e, t = null === (e = Cinst(hs.BlocksProducer)) || void 0 === e ? void 0 : e.blocksContainer;
if (!cc.isValid(t)) return null;
for (var o = storage.getItem("chapterCollectionLists", []), n = 0; n < t.children.length; n++) {
var i = t.children[n].getComponent(hs.BlocksProducerItem);
if (0 != i.node.opacity && 0 != Object.keys(o[i.state.index]).length) {
for (var c = 0, r = 0; r < i.caches.length; r++) if (0 != (a = i.caches[r]).opacity && (u = a.getComponent(hs.Block))) {
var l = u.state.color;
-1 == this._remainCollectColors.indexOf(l) && l >= hs.CollectionType.Gems101 && l <= hs.CollectionType.Gems106 && this._exchangeCollectBlocks.push({
isAllGemBlock: !1,
blockNode: i.caches[r],
blockIndex: n,
blockSubIndex: c,
gemCenterIndex: -1
});
c++;
}
if (h.GEM_CENTER_INDEX_MAP[i.state.id] && this.isAllGemBlock(i.node)) {
l = i.caches[0].getComponent(hs.Block).state.color;
if (-1 !== this._remainCollectColors.indexOf(l)) continue;
var s = h.GEM_CENTER_INDEX_MAP[i.state.id];
if (-1 != s) for (r = 0; r < i.caches.length; r++) {
var a;
if (0 != (a = i.caches[r]).opacity) {
var u;
if (u = a.getComponent(hs.Block)) {
var m = this._exchangeCollectBlocks.length - c + r;
if (this._exchangeCollectBlocks[m]) {
this._exchangeCollectBlocks[m].isAllGemBlock = !0;
r == s && (this._exchangeCollectBlocks[m].gemCenterIndex = s);
}
}
}
}
}
}
}
};
t.prototype.handleBlockAreaReplace = function() {
for (var e, t = storage.getItem("chapterCollectionLists", []), o = null === (e = Cinst(hs.BlocksProducer)) || void 0 === e ? void 0 : e.blocksContainer, n = 0; n < this._exchangeCollectBlocks.length; n++) {
var i = this._exchangeCollectBlocks[n];
if (cc.isValid(o)) {
var c = o.children[i.blockIndex];
if (!cc.isValid(c) || 0 === c.opacity) continue;
}
var r = this._remainCollectColors[Math.floor(Math.random() * this._remainCollectColors.length)], l = i.blockNode.getComponent(hs.Block);
if (!l || l.state.color !== r && -1 === this._remainCollectColors.indexOf(l.state.color)) {
if (!i.isAllGemBlock || -1 != i.gemCenterIndex) {
var s = i.blockNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
hs.dragonbonesAnim.play(hs.gameEffectLayer, {
armatureName: "armatureName",
animationName: "" + this.getRefreshAnim(r),
playTimes: 1,
completeRemove: !0
}, h.DragonBonesConfig.collectedItemsEliminateAndReplace_Refresh).setPosition(s);
}
l && l.setState({
color: r
});
t[i.blockIndex][i.blockSubIndex] && (t[i.blockIndex][i.blockSubIndex].Key = r);
}
}
storage.setItem("chapterCollectionLists", t);
this._exchangeCollectBlocks = [];
};
t.prototype.isAllGemBlock = function(e) {
var t = e.getComponent(hs.BlocksProducerItem);
if (!t || null == t.caches || 0 == t.caches.length) return !1;
for (var o = 0; o < t.caches.length; o++) {
var n = t.caches[o];
if (0 != n.opacity) {
var i = n.getComponent(hs.Block);
if (i) {
var c = i.state.color;
if (-1 !== this._remainCollectColors.indexOf(c)) return !1;
if (c < hs.CollectionType.Gems101 || c > hs.CollectionType.Gems106) return !1;
}
}
}
return !0;
};
t.prototype.getFewerElementsDirection = function(e) {
for (var t = hs.chapterBoardInfo.faceBlocks, o = e.i, n = e.j, i = e.color, c = this.hasOnlyEliminateColor(t[o], i), r = [], l = 0; l < t.length; l++) r.push(t[l][n]);
var s, a = this.hasOnlyEliminateColor(r, i);
"row" == (s = c && !a ? "column" : a && !c ? "row" : this._currentRoundRowCount > this._currentRoundColumnCount ? "column" : this._currentRoundColumnCount > this._currentRoundRowCount ? "row" : Math.random() < .5 ? "row" : "column") ? this._currentRoundRowCount++ : this._currentRoundColumnCount++;
return s;
};
t.prototype.hasOnlyEliminateColor = function(e, t) {
for (var o = !1, n = 0; n < e.length; n++) if (-1 !== e[n]) {
o = !0;
if (e[n] !== t) return !1;
}
return o;
};
t.prototype.createEliminate = function(e, t) {
var o = {}, n = {}, i = hs.boardRendererInfo.blocks, c = !1, r = 0, l = [];
for (var s in t) {
c = !0;
for (var a = 0; a < 8; a++) {
var h = "ROW" === e ? +s : a, u = "ROW" === e ? a : +s, m = i[h][u];
void 0 === n[h] && (n[h] = {});
var p = this._faceBlocks[h][u] > 100 ? this._faceBlocks[h][u] : this._color;
n[h][u] || (n[h][u] = {
node: m,
color: p
});
i[h][u].opacity = 0;
this._faceBlocks[h][u] = -1;
if (void 0 === o[s]) {
o[s] = i[h][u].convertToWorldSpaceAR(cc.Vec2.ZERO);
r++;
}
l.push({
row: h,
col: u,
color: p,
node: i[h][u]
});
}
}
return {
canEliminate: c,
eliminateCount: r,
putEliminates: l,
canEliminateInfos: n,
eliminateRowsCols: o,
grays: {}
};
};
t.prototype.getEliminateColor = function(e) {
switch (e) {
case hs.CollectionType.Gems101:
return 1;

case hs.CollectionType.Gems102:
return 6;

case hs.CollectionType.Gems103:
return 4;

case hs.CollectionType.Gems104:
return 2;

case hs.CollectionType.Gems105:
return 5;

case hs.CollectionType.Gems106:
return 3;

default:
return 1;
}
};
t.prototype.getRefreshAnim = function(e) {
switch (e) {
case hs.CollectionType.Gems101:
return "blue";

case hs.CollectionType.Gems102:
return "green";

case hs.CollectionType.Gems103:
return "orange";

case hs.CollectionType.Gems104:
return "yellow";

case hs.CollectionType.Gems105:
return "red";

case hs.CollectionType.Gems106:
return "purple";

default:
return "blue";
}
};
t.prototype.showItemAnim = function(e, t, o) {
var n = this, i = e.target, c = o.cacheCollectItems, r = o.collectInfosLength, l = o.color, s = o.positions, a = o.duration || hs.ChapterTopInfo_CollectEffect_Proxy.ANIMATION_DURATION;
cc.tween(t).delay(o.delayTime || 0).bezierBy(a, s.begin, s.center, s.end).call(function() {
t.parent && t.parent.removeChild(t);
var e = c.find(function(e) {
return Number(e.color) === Number(l);
});
if (e) {
var o = e.node.getComponent(hs.ChapterCollectTopItem);
if (o) {
var s = i.getRemainCollectCount(o, l);
o.setState({
color: l,
showMoveAnim: !0,
remainCollectCount: s,
targetCount: o.state.targetCount
});
var a = o.finishAnim.node.active;
o.playAction();
0 !== o.state.remainCollectCount || a || setTimeoutSafe(function() {
n.handleFaceEliminateAnim();
}, 300);
}
}
hs.audioInfo.play(hs.ChapterAudioConfig.travel_game_collect_item2);
i._playAnimCount++;
i._playAnimCount === r && hs.waitFor.end("chapterCollectItemAnimState");
}).start();
};
return c([ classId("CollectedItemsEliminateAndReplaceTrait"), classMethodWatch() ], t);
}(Trait);
o.CollectedItemsEliminateAndReplaceTrait = m;
cc._RF.pop();
}, {
"./components/ChapterCollectedEliminateAndReplaceComponent": "ChapterCollectedEliminateAndReplaceComponent",
"./interface/ICollectedItemsEliminateAndReplace": "ICollectedItemsEliminateAndReplace",
"./logic/CollectedItemsEliminateAndReplaceTouchEndLogic": "CollectedItemsEliminateAndReplaceTouchEndLogic"
} ],
ICollectedItemsEliminateAndReplace: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "f4838KTA2xJEbVX3JwQNY62", "ICollectedItemsEliminateAndReplace");
var n;
Object.defineProperty(o, "__esModule", {
value: !0
});
o.DragonbonesConfigType = o.satisfies = o.DragonBonesConfig = o.GEM_CENTER_INDEX_MAP = void 0;
o.GEM_CENTER_INDEX_MAP = ((n = {})[hs.BlocksProducerType.ID7] = 1, n[hs.BlocksProducerType.ID8] = 1, 
n[hs.BlocksProducerType.ID9] = 3, n[hs.BlocksProducerType.ID10] = 2, n[hs.BlocksProducerType.ID11] = 2, 
n[hs.BlocksProducerType.ID12] = 2, n[hs.BlocksProducerType.ID13] = 4, n[hs.BlocksProducerType.ID14] = 0, 
n[hs.BlocksProducerType.ID16] = 2, n[hs.BlocksProducerType.ID17] = 1, n[hs.BlocksProducerType.ID18] = 1, 
n[hs.BlocksProducerType.ID19] = 1, n[hs.BlocksProducerType.ID20] = 1, n[hs.BlocksProducerType.ID21] = 0, 
n[hs.BlocksProducerType.ID22] = 2, n[hs.BlocksProducerType.ID23] = 2, n[hs.BlocksProducerType.ID24] = 4, 
n[hs.BlocksProducerType.ID25] = 2, n[hs.BlocksProducerType.ID26] = 1, n[hs.BlocksProducerType.ID29] = 3, 
n[hs.BlocksProducerType.ID30] = 2, n[hs.BlocksProducerType.ID31] = 0, n[hs.BlocksProducerType.ID32] = 1, 
n[hs.BlocksProducerType.ID33] = 3, n[hs.BlocksProducerType.ID34] = 0, n[hs.BlocksProducerType.ID35] = 1, 
n[hs.BlocksProducerType.ID36] = 3, n[hs.BlocksProducerType.ID42] = 2, n);
o.DragonBonesConfig = {
collectedItemsEliminateAndReplace_Refresh: {
bundleName: "CollectedItemsEliminateAndReplaceTrait",
dragonAssetUrl: "dragonbones/refresh/gameplay_refresh_ske",
dragonAtlasAssetUrl: "dragonbones/refresh/gameplay_refresh_tex"
}
};
cc._RF.pop();
}, {} ]
}, {}, [ "CollectedItemsEliminateAndReplaceTrait", "ChapterCollectedEliminateAndReplaceComponent", "ICollectedItemsEliminateAndReplace", "CollectedItemsEliminateAndReplaceTouchEndLogic" ]);
//# sourceMappingURL=index.js.map
