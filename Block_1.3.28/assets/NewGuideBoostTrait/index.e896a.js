window.__require = function e(t, o, i) {
function s(r, n) {
if (!o[r]) {
if (!t[r]) {
var c = r.split("/");
c = c[c.length - 1];
if (!t[c]) {
var l = "function" == typeof __require && __require;
if (!n && l) return l(c, !0);
if (a) return a(c, !0);
throw new Error("Cannot find module '" + r + "'");
}
r = c;
}
var h = o[r] = {
exports: {}
};
t[r][0].call(h.exports, function(e) {
return s(t[r][1][e] || e);
}, h, h.exports, e, t, o, i);
}
return o[r].exports;
}
for (var a = "function" == typeof __require && __require, r = 0; r < i.length; r++) s(i[r]);
return s;
}({
NewGuideBoostComponent: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "15a666qVdhPvJxh/K9J3Pb3", "NewGuideBoostComponent");
var i, s = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
})(e, t);
}, function(e, t) {
i(e, t);
function o() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
}), a = this && this.__decorate || function(e, t, o, i) {
var s, a = arguments.length, r = a < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, o) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, i); else for (var n = e.length - 1; n >= 0; n--) (s = e[n]) && (r = (a < 3 ? s(r) : a > 3 ? s(t, o, r) : s(t, o)) || r);
return a > 3 && r && Object.defineProperty(t, o, r), r;
}, r = this && this.__read || function(e, t) {
var o = "function" == typeof Symbol && e[Symbol.iterator];
if (!o) return e;
var i, s, a = o.call(e), r = [];
try {
for (;(void 0 === t || t-- > 0) && !(i = a.next()).done; ) r.push(i.value);
} catch (e) {
s = {
error: e
};
} finally {
try {
i && !i.done && (o = a.return) && o.call(a);
} finally {
if (s) throw s.error;
}
}
return r;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, c = n.ccclass, l = (n.property, function(e) {
s(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.blocks = null;
t.dark = null;
t.hand = null;
t.moveContainer = null;
t._emitter = new hs.Emitter();
t._showEffectTimes = -1;
t._blockList = [];
return t;
}
Object.defineProperty(t.prototype, "emitter", {
get: function() {
return this._emitter;
},
enumerable: !1,
configurable: !0
});
t.prototype.onLoad = function() {
this.dark = this.node.getChildByName("dark");
this.moveContainer = this.node.getChildByName("moveContainer");
this.blocks = this.moveContainer.getChildByName("blocks");
this.hand = this.moveContainer.getChildByName("hand");
};
t.prototype.render = function() {
this.dark.active = this.state.showDarkMask;
if (this.state.clearPreEliminateData) {
this._emiterParam && (this._emiterParam.preEliminateState = null);
this.state.clearPreEliminateData = !1;
}
this.state.showGuideAnimation ? this.showGuide() : this.hideGuide();
};
t.prototype.showGuide = function() {
var e = hs.classBlocksProducerInfo.producerBlocks[1], t = hs.blockPosInfo[e - 1];
if (t) {
var o = this.state, i = o.step, s = o.color, a = hs.classGuideInfo.steps[i].move;
this._showEffectTimes = this.state.showEffectTimes;
this.node.opacity = 255;
this.createOrUpdateBlocks(t, s);
this.updateEmitterParam();
var n = r(a, 2), c = n[0], l = n[1];
this._moveStart = cc.v2(c.x, c.y);
this._moveEnd = cc.v2(l.x, l.y);
this.moveContainer.stopAllActions();
this.changeBlocksColor(!1);
this.playGuideEffect();
}
};
t.prototype.createOrUpdateBlocks = function(e, t) {
for (var o = 0, i = 0; i < e.length; i++) for (var s = 0; s < e[i].length; s++) 1 === e[i][s] && o++;
for (i = o; i < this._blockList.length; i++) this._blockList[i].opacity = 0;
var a = 0;
for (i = 0; i < e.length; i++) {
var r = function(o) {
if (1 !== e[i][o]) return "continue";
var s = -(e[i].length - 1) * hs.BLOCK_HALF_SIZE + o * hs.BLOCK_SIZE, r = (e.length - 1) * hs.BLOCK_HALF_SIZE - i * hs.BLOCK_SIZE, c = n._blockList[a];
if (!c) {
(c = new cc.Node()).name = "block";
c.addComponent(cc.Sprite);
n._blockList[a] = c;
n.blocks.addChild(c);
}
c.opacity = 255;
c.x = s;
c.y = r;
var l = c.getComponent(cc.Sprite);
hs.ResLoader.load(hs.ResUrlType.BLOCKS_DARK, cc.SpriteAtlas, function(e, o) {
e || o && cc.isValid(l) && (l.spriteFrame = o.getSpriteFrame("game_cube_" + t));
});
a++;
}, n = this;
for (s = 0; s < e[i].length; s++) r(s);
}
};
t.prototype.updateEmitterParam = function() {
this._emiterParam = {
preEliminateState: {
rowCanEliminateShaders: {},
colCanEliminateShaders: {},
color: 4
},
eliminateState: {
putPos: [],
eliminateRows: {},
eliminateCols: {},
color: 4
}
};
var e = hs.boardRendererInfo.blocks, t = this._emiterParam.preEliminateState.rowCanEliminateShaders, o = this._emiterParam.preEliminateState.colCanEliminateShaders, i = this._emiterParam.eliminateState.eliminateRows, s = this._emiterParam.eliminateState.eliminateCols;
t[6] = {};
for (var a = 6; a < 8; a++) {
t[a] || (t[a] = {});
for (var r = 0; r < 8; r++) {
var n = e[a][r];
t[a][r] = n;
i[a] || (i[a] = e[a][r].convertToWorldSpaceAR(cc.Vec2.ZERO));
}
}
for (a = 0; a < 8; a++) {
o[a] || (o[a] = {});
for (r = 3; r <= 4; r++) {
n = e[a][r];
o[a][r] = n;
s[r] || (s[r] = e[a][r].convertToWorldSpaceAR(cc.Vec2.ZERO));
}
}
this._emiterParam.eliminateState.color = 4;
this._emiterParam.eliminateState.putPos = [ cc.v2(5, 3), cc.v2(5, 4), cc.v2(6, 3), cc.v2(6, 4) ];
};
Object.defineProperty(t.prototype, "speed", {
get: function() {
var e;
return null !== (e = cc.director._kSpeed) && void 0 !== e ? e : 1;
},
enumerable: !1,
configurable: !0
});
t.prototype.playGuideEffect = function() {
var e = this, t = this._showEffectTimes > 0, o = cc.tween(this.moveContainer).call(function() {
if (cc.isValid(e.node) && cc.isValid(e.moveContainer) && cc.isValid(e.hand) && cc.isValid(e.blocks)) {
e.moveContainer.setPosition(e._moveStart);
e.moveContainer.opacity = 255;
e.hand.opacity = 255;
e.blocks.opacity = 120;
}
}).to(t ? 1.1 * this.speed : .5 * this.speed, {
x: this._moveEnd.x,
y: this._moveEnd.y
}, {
easing: cc.easing.circOut
});
t && (o = o.call(function() {
if (cc.isValid(e.node) && cc.isValid(e.hand) && cc.isValid(e.blocks)) {
e.hand.opacity = 0;
e.blocks.opacity = 255;
e.playPreEliminateEffect();
}
}).delay(.3 * this.speed).call(function() {
if (cc.isValid(e.node)) {
e.blocks.opacity = 0;
e.playClearTipEffect();
}
}).delay(.4 * this.speed).call(function() {
cc.isValid(e.node) && e.onClearEffectEnd();
}));
o.delay(.2).call(function() {
cc.isValid(e.node) && e.playGuideEffect();
}).start();
};
t.prototype.playPreEliminateEffect = function() {
this.changeBlocksColor(!0);
this.emitter.fire({
recycleEffect: !0
});
this.emitter.fire({
preEliminateState: this._emiterParam.preEliminateState
});
};
t.prototype.playClearTipEffect = function() {
this.showHidePreEliminateBlocks(!1);
this.emitter.fire({
recycleEffect: !0
});
this.emitter.fire({
eliminateState: this._emiterParam.eliminateState
});
};
t.prototype.onClearEffectEnd = function() {
this._showEffectTimes--;
this.emitter.fire({
decreaseShowEffectTimes: !0
});
this.changeBlocksColor(!1);
this.showHidePreEliminateBlocks(!0);
};
t.prototype.changeBlocksColor = function(e) {
var t, o;
if (null === (t = this._emiterParam) || void 0 === t ? void 0 : t.preEliminateState) {
var i = null === (o = hs.classGuideInfo.steps[this.state.step]) || void 0 === o ? void 0 : o.save_arr;
if (i) {
var s = this._emiterParam.preEliminateState, a = s.rowCanEliminateShaders, r = s.colCanEliminateShaders;
for (var n in a) for (var c in a[n]) this.updateBlockColor(a[n][c], i, +n, +c, e);
for (var n in r) for (var c in r[n]) this.updateBlockColor(r[n][c], i, +n, +c, e);
}
}
};
t.prototype.updateBlockColor = function(e, t, o, i, s) {
var a, r = null === (a = t[o]) || void 0 === a ? void 0 : a[i];
if (null != r && -1 !== r && 10 !== r) {
var n = e.getComponent(hs.Block);
n && n.setState({
color: s ? this.state.color : r
});
}
};
t.prototype.showHidePreEliminateBlocks = function(e) {
var t, o;
if (null === (t = this._emiterParam) || void 0 === t ? void 0 : t.preEliminateState) {
var i = null === (o = hs.classGuideInfo.steps[this.state.step]) || void 0 === o ? void 0 : o.save_arr;
if (i) {
var s = this._emiterParam.preEliminateState, a = s.rowCanEliminateShaders, r = s.colCanEliminateShaders, n = e ? 255 : 0;
for (var c in a) for (var l in a[c]) this.updateBlockOpacity(a[c][l], i, +c, +l, n);
for (var c in r) for (var l in r[c]) this.updateBlockOpacity(r[c][l], i, +c, +l, n);
}
}
};
t.prototype.updateBlockOpacity = function(e, t, o, i, s) {
var a, r = null === (a = t[o]) || void 0 === a ? void 0 : a[i];
null != r && -1 !== r && 10 !== r && (e.opacity = s);
};
t.prototype.hideGuide = function() {
this.moveContainer.opacity = 0;
this.moveContainer.stopAllActions();
this.changeBlocksColor(!1);
this.showHidePreEliminateBlocks(!0);
this.emitter.fire({
recycleEffect: !0
});
};
return a([ c ], t);
}(hs.Component));
o.default = l;
cc._RF.pop();
}, {} ],
NewGuideBoostTrait: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "c74bdF+nyNCF5LP4dvq5GnX", "NewGuideBoostTrait");
var i, s = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
})(e, t);
}, function(e, t) {
i(e, t);
function o() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
}), a = this && this.__decorate || function(e, t, o, i) {
var s, a = arguments.length, r = a < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, o) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, o, i); else for (var n = e.length - 1; n >= 0; n--) (s = e[n]) && (r = (a < 3 ? s(r) : a > 3 ? s(t, o, r) : s(t, o)) || r);
return a > 3 && r && Object.defineProperty(t, o, r), r;
}, r = this && this.__awaiter || function(e, t, o, i) {
return new (o || (o = Promise))(function(s, a) {
function r(e) {
try {
c(i.next(e));
} catch (e) {
a(e);
}
}
function n(e) {
try {
c(i.throw(e));
} catch (e) {
a(e);
}
}
function c(e) {
e.done ? s(e.value) : (t = e.value, t instanceof o ? t : new o(function(e) {
e(t);
})).then(r, n);
var t;
}
c((i = i.apply(e, t || [])).next());
});
}, n = this && this.__generator || function(e, t) {
var o, i, s, a, r = {
label: 0,
sent: function() {
if (1 & s[0]) throw s[1];
return s[1];
},
trys: [],
ops: []
};
return a = {
next: n(0),
throw: n(1),
return: n(2)
}, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
return this;
}), a;
function n(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(a) {
if (o) throw new TypeError("Generator is already executing.");
for (;r; ) try {
if (o = 1, i && (s = 2 & a[0] ? i.return : a[0] ? i.throw || ((s = i.return) && s.call(i), 
0) : i.next) && !(s = s.call(i, a[1])).done) return s;
(i = 0, s) && (a = [ 2 & a[0], s.value ]);
switch (a[0]) {
case 0:
case 1:
s = a;
break;

case 4:
r.label++;
return {
value: a[1],
done: !1
};

case 5:
r.label++;
i = a[1];
a = [ 0 ];
continue;

case 7:
a = r.ops.pop();
r.trys.pop();
continue;

default:
if (!(s = r.trys, s = s.length > 0 && s[s.length - 1]) && (6 === a[0] || 2 === a[0])) {
r = 0;
continue;
}
if (3 === a[0] && (!s || a[1] > s[0] && a[1] < s[3])) {
r.label = a[1];
break;
}
if (6 === a[0] && r.label < s[1]) {
r.label = s[1];
s = a;
break;
}
if (s && r.label < s[2]) {
r.label = s[2];
r.ops.push(a);
break;
}
s[2] && r.ops.pop();
r.trys.pop();
continue;
}
a = t.call(e, r);
} catch (e) {
a = [ 6, e ];
i = 0;
} finally {
o = s = 0;
}
if (5 & a[0]) throw a[1];
return {
value: a[0] ? a[1] : void 0,
done: !0
};
}
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.NewGuideBoostTrait = void 0;
var c = e("./NewGuideBoostComponent"), l = [ {
save_arr: [ [ 10, 10, 10, 1, 1, 10, 10, 10 ], [ 10, 10, 10, 1, 1, 10, 10, 10 ], [ 10, 10, 10, 1, 1, 10, 10, 10 ], [ 10, 10, 10, 1, 1, 10, 10, 10 ], [ 10, 10, 10, 1, 1, 10, 10, 10 ], [ 10, 10, 10, 2, 2, 10, 10, 10 ], [ 1, 1, 2, -1, -1, 2, 1, 1 ], [ 1, 1, 2, -1, -1, 2, 1, 1 ] ],
producerBlocks: [ -1, 9, -1 ],
blocksColors: [ 3, 5, 3 ],
color: 5,
grid: [ 6, 3 ],
move: [ {
x: 0,
y: -553.75
}, {
x: 0,
y: -191.75
} ]
}, {
save_arr: [ [ 1, 1, -1, 1, 1, -1, 1, 1 ], [ 1, 1, -1, 1, 1, -1, 1, 1 ], [ 1, 1, -1, 1, 1, -1, 1, 1 ], [ 1, 1, -1, 1, 1, -1, 1, 1 ], [ 1, 1, -1, 1, 1, -1, 1, 1 ], [ -1, -1, -1, 2, 2, -1, -1, -1 ], [ 1, 1, 2, -1, -1, 2, 1, 1 ], [ 1, 1, 2, -1, -1, 2, 1, 1 ] ],
producerBlocks: [ 17, 9, 17 ],
blocksColors: [ 3, 5, 3 ],
color: 5,
grid: [ 6, 3 ],
move: [ {
x: 0,
y: -553.75
}, {
x: 0,
y: -191.75
} ]
} ], h = [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, 4, -1, -1, -1, -1, 4, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, 4, -1, -1, -1, -1, 4, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ], u = [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, 4, 4, -1, -1, 4, 4, -1 ], [ -1, 4, 4, -1, -1, 4, 4, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, 4, 4, -1, -1, -1 ], [ -1, -1, -1, 4, 4, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ], d = function(e) {
s(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.localInfo = {
avoidClearBoardBeginTime: 0,
avoidHandAnim: !1
};
t._component = null;
t._showEffectTimes = -1;
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassGuide_Proxy",
methodName: "initTraits"
}, {
className: "ClassGuide_Proxy",
methodName: "onClassGameCreate"
}, {
className: "ClassGuide_Proxy",
methodName: "onGuideChange"
}, {
className: "ClassGuide_Proxy",
methodName: "onTouchEnd"
}, {
className: "ClassGuide_Proxy",
methodName: "onAnyTouchEnd"
}, {
className: "ClassGuide_Proxy",
methodName: "onTouchStart"
} ];
};
t.prototype.onCreate = function() {
DS("first_expose_type_show", {
show_type: this.props.plan
});
};
t.prototype.onActive = function(e) {
var t, o;
if (hs.tp.isClassGuide_ProxyInitTraits(e)) {
if (!hs.classGuideInfo.show) return;
storage.setItem("classGuideStep", 2);
this.initBoard();
}
hs.tp.isClassGuide_ProxyShowClassGuide(e) && (e.replace = !0);
hs.tp.isClassGuide_ProxyOnClassGameCreate(e) && this.onClassGameCreate();
hs.tp.isClassGuide_ProxyOnGuideChange(e) && this.onGuideChange();
hs.tp.isClassGuide_ProxyOnTouchStart(e) && this.onTouchStart();
hs.tp.isClassGuide_ProxyOnAnyTouchEnd(e) && this.onAnyTouchEnd();
hs.tp.isClassGuide_ProxyOnTouchEnd(e) && this.onTouchEnd();
if (hs.tp.isClassDefaultBoard_ProxyProduceDefaultBoard(e)) {
if (hs.classGuideInfo.show) return;
if (this.shouldUpdateDefaultBoard() && this.isNewGameAfterGuide()) {
e.args[0] = u;
e.returnState = !0;
}
}
hs.tp.isClassDefaultBoard_ProxyProduceDefaultBoardTurnAround(e) && this.shouldUpdateDefaultBoard() && this.isNewGameAfterGuide() && (e.returnState = !0);
hs.tp.isClassBlocksProducer_ProxyGuideRequestBlocksProducer(e) && ((null === (t = e.args[0]) || void 0 === t ? void 0 : t.clearScreen) || e.disable([ "FirstEightGamesFixedBoardTrait" ]));
hs.tp.isClassGuide_ProxyOnGameStart(e) && (null === (o = e.args[0].data) || void 0 === o ? void 0 : o.newGame) && 3 === this.props.plan && this.props.avoidClearBlockTime > 0 && 1 === hs.classGameInfo.gameNum && (this.localInfo.avoidClearBoardBeginTime = Date.now());
if (hs.tp.isClassAlgorithmProcessInfoBottomOffer(e) && this.triggerAvoidClearBoard()) {
var i = e.args[0] || [];
i.push(hs.OFFER_TYPE.ALGO_AVOID_CLEAR_BOARD);
e.args[0] = i;
}
if (hs.tp.isAlgorithmSDKArgsInfoOnBlockInfo(e) && hs.algorithmName.algoActualId === hs.OFFER_TYPE.ALGO_AVOID_CLEAR_BOARD && this.triggerAvoidClearBoard()) {
hs.algorithmSDKArgsInfo.setBlockIds(hs.algorithmInfo.blockIdList);
hs.algorithmSDKArgsInfo.setBlockNames(hs.algorithmName.algoActualName);
hs.algorithmSDKArgsInfo.setBlockPoses(hs.algorithmInfo.blockPosList);
}
hs.tp.isClassGuide_ProxyGuideEndDot(e) && hs.classGuideInfo.step === hs.classGuideInfo.totalStep - 1 && (e.replace = !0);
};
t.prototype.initBoard = function() {
var e = 2 === this.props.plan ? l[1] : l[0];
Object.assign(hs.classGuideInfo.steps[2], e);
};
t.prototype.onClassGameCreate = function() {
if (hs.classGuideInfo.show) {
this._showEffectTimes = this.initShowEffectTimes();
var e = hs.classGuideInfo.step;
this.showGuide({
step: e,
showDarkMask: !0,
showGuideAnimation: !1
});
}
};
t.prototype.onGuideChange = function() {
var e, t = hs.classGuideInfo, o = t.totalStep, i = t.step;
if (i < o) this.showGuide({
step: i
}); else if (i === o) {
this._component && this._component.setState({
step: i,
showDarkMask: !1,
showGuideAnimation: !1
});
DS(null === (e = hs.classGuideInfo.steps[hs.classGuideInfo.step - 1]) || void 0 === e ? void 0 : e.dotEnd);
this.localInfo.avoidClearBoardBeginTime = Date.now();
if (this.shouldUpdateDefaultBoard()) {
storage.setItem("classFaceBlocks", h);
hs.EventManager.dispatchModuleEvent(new hs.E_ClassBoard_Render(h));
}
}
};
t.prototype.onEmitter = function(e) {
e.preEliminateState && hs.EventManager.dispatchModuleEvent(new hs.E_ClassEliminate_Play_PreEliminateEffect(e.preEliminateState));
e.eliminateState && hs.EventManager.dispatchModuleEvent(new hs.E_ClassEliminate_Play_EliminateEffect(e.eliminateState));
e.recycleEffect && hs.EventManager.dispatchModuleEvent(new hs.E_ClassEliminate_Recycle_Effect());
e.decreaseShowEffectTimes && this._showEffectTimes--;
};
t.prototype.onTouchStart = function() {
if (hs.classGuideInfo.show) {
var e = hs.classGuideInfo.step;
this._component && this._component.setState({
step: e,
showDarkMask: !0,
showGuideAnimation: !1
});
}
};
t.prototype.onAnyTouchEnd = function() {
if (hs.classGuideInfo.show) {
var e = hs.classGuideInfo.step;
if (this._component) {
var t = !this.localInfo.avoidHandAnim;
this._component.setState({
step: e,
showDarkMask: !0,
showGuideAnimation: t,
showEffectTimes: this._showEffectTimes
});
}
}
};
t.prototype.onTouchEnd = function() {
if (hs.classGuideInfo.show && -1 !== hs.blocksProducerInfo.producerBlocks.findIndex(function(e) {
return -1 !== e;
})) {
this.localInfo.avoidHandAnim = !0;
if (this._component) {
var e = hs.classGuideInfo.step;
this._component.setState({
step: e,
showDarkMask: !0,
showGuideAnimation: !1,
showEffectTimes: this._showEffectTimes,
clearPreEliminateData: !0
});
}
}
};
t.prototype.showGuide = function(e) {
var t, o, i;
return r(this, void 0, void 0, function() {
var s, a, r, l, h, u, d, f, p;
return n(this, function(n) {
switch (n.label) {
case 0:
return cc.isValid(this._component) ? [ 3, 3 ] : [ 4, CinstAsync(hs.ClassGame) ];

case 1:
s = n.sent();
return [ 4, hs.UI.show(hs.ClassPrefabConfig.ClassGuideWithoutComp, s.guideContainer) ];

case 2:
a = n.sent();
if (cc.isValid(a)) {
this._component = a.addComponent(c.default);
this._component.emitter.event(this.onEmitter, this);
}
n.label = 3;

case 3:
r = hs.classGuideInfo, l = r.totalStep, h = r.steps;
u = e.step;
d = null !== (t = e.showDarkMask) && void 0 !== t ? t : u < l;
f = (null !== (o = e.showGuideAnimation) && void 0 !== o ? o : u < l) && !this.localInfo.avoidHandAnim;
p = null !== (i = e.color) && void 0 !== i ? i : h[u].color;
cc.isValid(this._component) && this._component.setState({
step: u,
showDarkMask: d,
showGuideAnimation: f,
color: p,
showEffectTimes: this._showEffectTimes
});
return [ 2 ];
}
});
});
};
t.prototype.initShowEffectTimes = function() {
var e, t = null !== (e = this.props.showEffectTimes) && void 0 !== e ? e : -1;
return -1 === t ? Number.MAX_SAFE_INTEGER : t;
};
t.prototype.shouldUpdateDefaultBoard = function() {
return 1 === this.props.afterGuideBoardPlan;
};
t.prototype.isNewGameAfterGuide = function() {
return 1 == hs.gameInfo.gameNum;
};
t.prototype.triggerAvoidClearBoard = function() {
return !(this.props.avoidClearBlockTime <= 0) && !(3 === this.props.plan && hs.classGameInfo.gameNum > 1) && this.getAvoidClearBoardSurplusTime() > 0;
};
t.prototype.getAvoidClearBoardSurplusTime = function() {
var e = 0 === this.localInfo.avoidClearBoardBeginTime ? Date.now() : this.localInfo.avoidClearBoardBeginTime, t = Date.now() - e;
return 1e3 * this.props.avoidClearBlockTime - t;
};
a([ hs.storageProperty({
key: "NewGuideBoostTraitData"
}) ], t.prototype, "localInfo", void 0);
return a([ classId("NewGuideBoostTrait") ], t);
}(Trait);
o.NewGuideBoostTrait = d;
cc._RF.pop();
}, {
"./NewGuideBoostComponent": "NewGuideBoostComponent"
} ]
}, {}, [ "NewGuideBoostComponent", "NewGuideBoostTrait" ]);
//# sourceMappingURL=index.js.map
