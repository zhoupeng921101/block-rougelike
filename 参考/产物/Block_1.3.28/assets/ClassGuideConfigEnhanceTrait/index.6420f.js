window.__require = function t(e, o, i) {
function n(s, a) {
if (!o[s]) {
if (!e[s]) {
var c = s.split("/");
c = c[c.length - 1];
if (!e[c]) {
var l = "function" == typeof __require && __require;
if (!a && l) return l(c, !0);
if (r) return r(c, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = c;
}
var u = o[s] = {
exports: {}
};
e[s][0].call(u.exports, function(t) {
return n(e[s][1][t] || t);
}, u, u.exports, t, e, o, i);
}
return o[s].exports;
}
for (var r = "function" == typeof __require && __require, s = 0; s < i.length; s++) n(i[s]);
return n;
}({
ClassGuideConfigEnhanceComponent: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "a5e3dh5KQxIt7F4mUYwq0w/", "ClassGuideConfigEnhanceComponent");
var i, n = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
i(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), r = this && this.__decorate || function(t, e, o, i) {
var n, r = arguments.length, s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, o) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, o, i); else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (s = (r < 3 ? n(s) : r > 3 ? n(e, o, s) : n(e, o)) || s);
return r > 3 && s && Object.defineProperty(e, o, s), s;
}, s = this && this.__awaiter || function(t, e, o, i) {
return new (o || (o = Promise))(function(n, r) {
function s(t) {
try {
c(i.next(t));
} catch (t) {
r(t);
}
}
function a(t) {
try {
c(i.throw(t));
} catch (t) {
r(t);
}
}
function c(t) {
t.done ? n(t.value) : (e = t.value, e instanceof o ? e : new o(function(t) {
t(e);
})).then(s, a);
var e;
}
c((i = i.apply(t, e || [])).next());
});
}, a = this && this.__generator || function(t, e) {
var o, i, n, r, s = {
label: 0,
sent: function() {
if (1 & n[0]) throw n[1];
return n[1];
},
trys: [],
ops: []
};
return r = {
next: a(0),
throw: a(1),
return: a(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function a(t) {
return function(e) {
return c([ t, e ]);
};
}
function c(r) {
if (o) throw new TypeError("Generator is already executing.");
for (;s; ) try {
if (o = 1, i && (n = 2 & r[0] ? i.return : r[0] ? i.throw || ((n = i.return) && n.call(i), 
0) : i.next) && !(n = n.call(i, r[1])).done) return n;
(i = 0, n) && (r = [ 2 & r[0], n.value ]);
switch (r[0]) {
case 0:
case 1:
n = r;
break;

case 4:
s.label++;
return {
value: r[1],
done: !1
};

case 5:
s.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = s.ops.pop();
s.trys.pop();
continue;

default:
if (!(n = s.trys, n = n.length > 0 && n[n.length - 1]) && (6 === r[0] || 2 === r[0])) {
s = 0;
continue;
}
if (3 === r[0] && (!n || r[1] > n[0] && r[1] < n[3])) {
s.label = r[1];
break;
}
if (6 === r[0] && s.label < n[1]) {
s.label = n[1];
n = r;
break;
}
if (n && s.label < n[2]) {
s.label = n[2];
s.ops.push(r);
break;
}
n[2] && s.ops.pop();
s.trys.pop();
continue;
}
r = e.call(t, s);
} catch (t) {
r = [ 6, t ];
i = 0;
} finally {
o = n = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
}, c = this && this.__read || function(t, e) {
var o = "function" == typeof Symbol && t[Symbol.iterator];
if (!o) return t;
var i, n, r = o.call(t), s = [];
try {
for (;(void 0 === e || e-- > 0) && !(i = r.next()).done; ) s.push(i.value);
} catch (t) {
n = {
error: t
};
} finally {
try {
i && !i.done && (o = r.return) && o.call(r);
} finally {
if (n) throw n.error;
}
}
return s;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var l = cc._decorator.ccclass, u = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.blocks = null;
e.dark = null;
e.hand = null;
e.moveContainer = null;
e._lightSpine = null;
e._textNodes = {};
e._blockList = [];
e._endPos = cc.v2();
e._blocksAtlas = null;
return e;
}
e.prototype.onLoad = function() {
this.dark = this.node.getChildByName("dark");
this.moveContainer = this.node.getChildByName("moveContainer");
this.blocks = this.moveContainer.getChildByName("blocks");
this.hand = this.moveContainer.getChildByName("hand");
this.dark.opacity = 0;
};
e.prototype.onDisable = function() {
this.hideEffect(!1);
};
e.prototype.render = function() {
this.dark.active = this.state.showDarkMask;
this.state.showGuideAnimation ? this.showGuide() : this.hideGuide();
this.state.showLightAndText && (this.state.lightAnimation || this.state.textImage) ? this.showEffect() : this.hideEffect(!0);
};
e.prototype.hideGuide = function() {
this.moveContainer.opacity = 0;
this.moveContainer.stopAllActions();
};
e.prototype.showGuide = function() {
var t = hs.classBlocksProducerInfo.producerBlocks[1], e = hs.blockPosInfo[t - 1];
if (e) {
var o = this.state, i = o.color, n = o.moveTarget;
this.node.opacity = 255;
this.createOrUpdateBlocks(e, i);
var r = this.getCoord(t, n.row, n.col), s = r.startPos, a = r.endPos, c = cc.Vec2.distance(s, a) / 220;
this._endPos.set(a);
this.blocks.opacity = 120;
this.moveContainer.stopAllActions();
this.moveContainer.opacity = 255;
this.moveContainer.x = s.x;
this.moveContainer.y = s.y;
cc.tween(this.moveContainer).repeatForever(cc.tween(this.moveContainer).to(0, {
x: s.x,
y: s.y
}).to(c, {
x: a.x,
y: a.y
}, {
easing: cc.easing.circOut
}).delay(.2)).start();
}
};
e.prototype.hideEffect = function(t) {
var e, o = this;
cc.isValid(this._lightSpine) && this._lightSpine.node.removeFromParent();
var i = .001 * (null !== (e = this.state.hideTime) && void 0 !== e ? e : 500);
Object.values(this._textNodes).forEach(function(e) {
if (cc.isValid(e)) if (e.opacity > 0 && t) cc.tween(e).to(i, {
opacity: 0
}).call(function() {
!hs.classGuideInfo.show && cc.isValid(o.node) && o.node.removeFromParent();
}).start(); else {
e.stopAllActions();
e.opacity = 0;
}
});
};
e.prototype.showEffect = function() {
return s(this, void 0, void 0, function() {
var t;
return a(this, function(e) {
switch (e.label) {
case 0:
return cc.isValid(this._lightSpine) ? [ 3, 2 ] : [ 4, this.loadPrefab() ];

case 1:
e.sent();
e.label = 2;

case 2:
if (!cc.isValid(this._lightSpine) || !this.node.activeInHierarchy) return [ 2 ];
t = Cinst(hs.Board);
if (!cc.isValid(t)) return [ 2 ];
this.updateLightSpine(t);
this.updateTextNodes();
return [ 2 ];
}
});
});
};
e.prototype.updateLightSpine = function(t) {
var e, o = this.state.lightAnimation;
if (o && cc.isValid(null === (e = this._lightSpine) || void 0 === e ? void 0 : e.node)) {
this._lightSpine.node.parent !== t.node && this._lightSpine.node.setParent(t.node);
var i = t.node.convertToNodeSpaceAR(this.node.convertToWorldSpaceAR(this._endPos));
this._lightSpine.node.setPosition(i.x, i.y);
this._lightSpine.timeScale = 1 / this.speed;
this._lightSpine.setAnimation(0, o, !0);
} else cc.isValid(this._lightSpine) && this._lightSpine.node.removeFromParent();
};
e.prototype.updateTextNodes = function() {
var t = this, e = this.state, o = e.textImage, i = e.textImageY;
Object.entries(this._textNodes).forEach(function(e) {
var n = c(e, 2), r = n[0], s = n[1];
if (cc.isValid(s)) if (r === o) {
s.opacity = 255;
s.parent !== t.node && s.setParent(t.node);
s.setPosition(0, i);
} else {
s.stopAllActions();
s.opacity = 0;
}
});
};
e.prototype.loadPrefab = function() {
return s(this, void 0, void 0, function() {
var t, e, o = this;
return a(this, function(i) {
switch (i.label) {
case 0:
if (cc.isValid(this._lightSpine)) return [ 2 ];
i.label = 1;

case 1:
i.trys.push([ 1, 3, , 4 ]);
return [ 4, hs.ResLoader.asyncLoadByBundle("ClassGuideConfigEnhanceTrait", "prefabs/guideInfo", cc.Prefab) ];

case 2:
t = i.sent();
if (cc.isValid(this._lightSpine) || !t) return [ 2 ];
e = cc.instantiate(t);
this._lightSpine = e.getComponentInChildren(sp.Skeleton);
this._lightSpine.node.removeFromParent();
e.getComponentsInChildren(cc.Sprite).forEach(function(t) {
var e = t.node.name;
o._textNodes[e] = t.node;
t.node.removeFromParent();
});
e.destroy();
return [ 3, 4 ];

case 3:
i.sent();
return [ 3, 4 ];

case 4:
return [ 2 ];
}
});
});
};
e.prototype.createOrUpdateBlocks = function(t, e) {
var o = t.flat().filter(function(t) {
return 1 === t;
}).length;
this._blockList.slice(o).forEach(function(t) {
t.opacity = 0;
});
for (var i = 0, n = 0; n < t.length; n++) for (var r = 0; r < t[n].length; r++) if (1 === t[n][r]) {
var s = -(t[n].length - 1) * hs.BLOCK_HALF_SIZE + r * hs.BLOCK_SIZE, a = (t.length - 1) * hs.BLOCK_HALF_SIZE - n * hs.BLOCK_SIZE, c = this.getOrCreateBlock(i);
c.setPosition(s, a);
c.opacity = 255;
this.updateBlockSprite(c, e);
i++;
}
};
e.prototype.getOrCreateBlock = function(t) {
if (this._blockList[t]) return this._blockList[t];
var e = new cc.Node("block");
e.addComponent(cc.Sprite);
this._blockList[t] = e;
this.blocks.addChild(e);
return e;
};
e.prototype.updateBlockSprite = function(t, e) {
var o = this, i = t.getComponent(cc.Sprite);
i && (this._blocksAtlas ? i.spriteFrame = this._blocksAtlas.getSpriteFrame("game_cube_" + e) : hs.ResLoader.load(hs.ResUrlType.BLOCKS_DARK, cc.SpriteAtlas, function(t, n) {
if (!t && n) {
o._blocksAtlas = n;
cc.isValid(i.node) && (i.spriteFrame = n.getSpriteFrame("game_cube_" + e));
}
}));
};
e.prototype.getCoord = function(t, e, o) {
var i, n, r = {
startPos: cc.v2(),
endPos: cc.v2()
}, s = Cinst(hs.Board), a = Cinst(hs.BlocksProducer);
if (!cc.isValid(s) || !cc.isValid(a)) return r;
var c = hs.blockPosInfo[t - 1];
if (!(null == c ? void 0 : c.length)) return r;
var l = null === (i = hs.boardRendererInfo.blocks[e]) || void 0 === i ? void 0 : i[o], u = null !== (n = null == l ? void 0 : l.convertToWorldSpaceAR(cc.v2())) && void 0 !== n ? n : cc.v2(), h = cc.v2(u.x + (c[0].length - 1) * hs.BLOCK_HALF_SIZE, u.y - (c.length - 1) * hs.BLOCK_HALF_SIZE);
return {
startPos: cc.v2(0, -550),
endPos: this.node.convertToNodeSpaceAR(h)
};
};
Object.defineProperty(e.prototype, "speed", {
get: function() {
var t;
return null !== (t = cc.director._kSpeed) && void 0 !== t ? t : 1;
},
enumerable: !1,
configurable: !0
});
return r([ l ], e);
}(hs.Component);
o.default = u;
cc._RF.pop();
}, {} ],
ClassGuideConfigEnhanceTrait: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "2a4f5qThB9GoLOZu+02+vcw", "ClassGuideConfigEnhanceTrait");
var i, n = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
i(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), r = this && this.__decorate || function(t, e, o, i) {
var n, r = arguments.length, s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, o) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, o, i); else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (s = (r < 3 ? n(s) : r > 3 ? n(e, o, s) : n(e, o)) || s);
return r > 3 && s && Object.defineProperty(e, o, s), s;
}, s = this && this.__awaiter || function(t, e, o, i) {
return new (o || (o = Promise))(function(n, r) {
function s(t) {
try {
c(i.next(t));
} catch (t) {
r(t);
}
}
function a(t) {
try {
c(i.throw(t));
} catch (t) {
r(t);
}
}
function c(t) {
t.done ? n(t.value) : (e = t.value, e instanceof o ? e : new o(function(t) {
t(e);
})).then(s, a);
var e;
}
c((i = i.apply(t, e || [])).next());
});
}, a = this && this.__generator || function(t, e) {
var o, i, n, r, s = {
label: 0,
sent: function() {
if (1 & n[0]) throw n[1];
return n[1];
},
trys: [],
ops: []
};
return r = {
next: a(0),
throw: a(1),
return: a(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function a(t) {
return function(e) {
return c([ t, e ]);
};
}
function c(r) {
if (o) throw new TypeError("Generator is already executing.");
for (;s; ) try {
if (o = 1, i && (n = 2 & r[0] ? i.return : r[0] ? i.throw || ((n = i.return) && n.call(i), 
0) : i.next) && !(n = n.call(i, r[1])).done) return n;
(i = 0, n) && (r = [ 2 & r[0], n.value ]);
switch (r[0]) {
case 0:
case 1:
n = r;
break;

case 4:
s.label++;
return {
value: r[1],
done: !1
};

case 5:
s.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = s.ops.pop();
s.trys.pop();
continue;

default:
if (!(n = s.trys, n = n.length > 0 && n[n.length - 1]) && (6 === r[0] || 2 === r[0])) {
s = 0;
continue;
}
if (3 === r[0] && (!n || r[1] > n[0] && r[1] < n[3])) {
s.label = r[1];
break;
}
if (6 === r[0] && s.label < n[1]) {
s.label = n[1];
n = r;
break;
}
if (n && s.label < n[2]) {
s.label = n[2];
s.ops.push(r);
break;
}
n[2] && s.ops.pop();
s.trys.pop();
continue;
}
r = e.call(t, s);
} catch (t) {
r = [ 6, t ];
i = 0;
} finally {
o = n = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.ClassGuideConfigEnhanceTrait = void 0;
var c = t("./ClassGuideConfigEnhanceComponent"), l = t("./ClassGuideConfigEnhanceValidate"), u = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._steps = [];
e._isEliminate = !1;
e._shouldHideScore = !1;
e._component = null;
e._pollIntervalId = null;
e.localInfo = {
step: 0
};
return e;
}
Object.defineProperty(e.prototype, "isInGuide", {
get: function() {
return hs.classGuideInfo.show;
},
enumerable: !1,
configurable: !0
});
e.prototype.registerTraitEventsMethods = function() {
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
methodName: "onTouchStart"
}, {
className: "ClassGuide_Proxy",
methodName: "onAnyTouchEnd"
}, {
className: "BlocksProducerTouch",
methodName: "touchFollowUpEliminateTimes"
} ];
};
e.prototype.onActive = function(t) {
var e;
hs.tp.isClassGuide_ProxyInitTraits(t) && this.initTraits();
hs.tp.isClassGuide_ProxyShowClassGuide(t) && (t.replace = !0);
hs.tp.isClassGuide_ProxyOnBlockProducerItemOpen(t) && (t.replace = !0);
hs.tp.isClassGuide_ProxyOnClassGameCreate(t) && this.onClassCreate();
hs.tp.isClassGuide_ProxyOnGuideChange(t) && this.onGuideChange();
hs.tp.isClassGuide_ProxyOnTouchStart(t) && this.onTouchStart();
hs.tp.isBlocksProducerTouchTouchFollowUpEliminateTimes(t) && this.onTouchEnd();
hs.tp.isClassGuide_ProxyOnAnyTouchEnd(t) && this.onAnyTouchEnd();
if (hs.tp.isClassBlocksProducer_ProxyOnTouchEndDelay(t)) {
if (!hs.classGuideInfo.show) return;
this.onTouchEndDelay();
t.replace = this.localInfo.step < this._steps.length;
}
if (hs.tp.isClassTopInfo_ProxyModifyScoreInGuide(t)) {
t.replace = !0;
t.returnValue = t.args[0];
}
if (hs.tp.isClassTopInfoModifyScoreInGuide(t)) {
t.replace = !0;
t.returnValue = t.args[0];
}
if (hs.tp.isClassScoreTip_ProxyPlayComboScoreAnim(t)) {
if (!hs.classGuideInfo.show) return;
if (this._shouldHideScore) {
t.replace = !0;
t.returnState = !0;
this._shouldHideScore = !1;
}
}
hs.tp.isClassBlocksProducer_ProxyGuideRequestBlocksProducer(t) && ((null === (e = t.args[0]) || void 0 === e ? void 0 : e.clearScreen) || t.disable([ "FirstEightGamesFixedBoardTrait" ]));
hs.tp.isClassGuide_ProxyGuideEndDot(t) && hs.classGuideInfo.step === hs.classGuideInfo.totalStep - 1 && (t.replace = !0);
if (hs.tp.isHighWeightBoardAroundBlinkTraitIsWeightThreshold(t) && hs.classGuideInfo.show) {
t.replace = !0;
t.returnValue = !1;
}
if (hs.tp.is$22159_f_addHistoryBoardTraitCheckAndPlay(t) && hs.classGuideInfo.show) {
t.returnState = !0;
t.replace = !0;
}
};
e.prototype.initTraits = function() {
var t, e;
if (this.isInGuide) {
storage.setItem("classGuideStep", 2);
this._steps = new l.ClassGuideConfigEnhanceValidate().validateConfig(1 === (null === (t = this.props) || void 0 === t ? void 0 : t.enable), null === (e = this.props) || void 0 === e ? void 0 : e.steps);
this.localInfo.step < this._steps.length && Object.assign(hs.classGuideInfo.steps[2], this._steps[this.localInfo.step]);
}
};
e.prototype.onClassCreate = function() {
if (this.isInGuide) {
this.showGuide(!0, !1, !1);
this.updateTopInfoVisible();
}
};
e.prototype.onGuideChange = function() {
var t, e, o, i = this, n = hs.classGuideInfo, r = n.totalStep, s = n.step;
if (s < r) {
this.showGuide(!0, !0, !0);
this.playProduceItemEffect();
} else if (s === r) {
DS(null === (t = hs.classGuideInfo.steps[hs.classGuideInfo.step - 1]) || void 0 === t ? void 0 : t.dotEnd);
this.removeGuide();
setTimeoutSafe(function() {
i.updateTopInfoVisible();
}, null !== (o = null === (e = this._steps[this.localInfo.step]) || void 0 === e ? void 0 : e.delayTime) && void 0 !== o ? o : 400);
this.stopProduceItemEffect();
}
};
e.prototype.onTouchStart = function() {
if (this.isInGuide) {
this._component && this.setComponentState(!0, !1, !0);
this.stopProduceItemEffect();
}
};
e.prototype.onAnyTouchEnd = function() {
if (this.isInGuide) {
if (!this._isEliminate) {
this._component && this.setComponentState(!0, !0, !0);
this.playProduceItemEffect();
}
this._isEliminate = !1;
}
};
e.prototype.onTouchEnd = function() {
if (this.isInGuide) {
this._component && this.setComponentState(!0, !1, !1);
this._isEliminate = !0;
this._shouldHideScore = this.localInfo.step < this._steps.length - 1;
}
};
e.prototype.onTouchEndDelay = function() {
var t = this.localInfo.step + 1;
this.localInfo.step = t;
if (!(t >= this._steps.length)) {
var e = this._steps[t], o = e.producerBlocks, i = e.blocksColors, n = e.save_arr;
storage.setItem("classFaceBlocks", n);
storage.setItem("classProducerBlocks", o);
setTimeoutSafe(function() {
var t = Cinst(hs.BlocksProducer);
null == t || t.setState({
producerBlocks: o,
colors: i
});
hs.EventManager.dispatchModuleEvent(new hs.E_ClassBoard_Render(n));
}, 1200);
}
};
e.prototype.getProducerItemList = function() {
var t = Cinst(hs.BlocksProducer), e = null == t ? void 0 : t.blocksContainer;
if (cc.isValid(e) && hs.BlocksProducerItem) try {
return e.getComponentsInChildren(hs.BlocksProducerItem);
} catch (t) {
return [];
}
};
e.prototype.playProduceItemEffect = function() {
var t;
"date0211" === (null === (t = this.props) || void 0 === t ? void 0 : t.fixbug) ? this.playProduceItemEffectFix0211() : this.playProduceItemEffectNormal();
};
e.prototype.playProduceItemEffectNormal = function() {
var t = this;
this.clearPollInterval();
this._pollIntervalId = setInterval(function() {
var e, o = null === (e = cc.director.getScene()) || void 0 === e ? void 0 : e.getComponentsInChildren(hs.BlocksProducerItem);
if (null == o ? void 0 : o.length) {
t.clearPollInterval();
o.forEach(function(e) {
cc.isValid(e) && t.applyProducerItemEffect(e);
});
}
}, 10);
};
e.prototype.playProduceItemEffectFix0211 = function() {
var t = this;
this.clearPollInterval();
this._pollIntervalId = setInterval(function() {
var e = t.getProducerItemList();
if (null == e ? void 0 : e.length) {
t.clearPollInterval();
e.forEach(function(e) {
cc.isValid(e) && t.applyProducerItemEffect(e);
});
}
}, 10);
};
e.prototype.clearPollInterval = function() {
if (null !== this._pollIntervalId) {
clearInterval(this._pollIntervalId);
this._pollIntervalId = null;
}
};
e.prototype.applyProducerItemEffect = function(t) {
var e = t.node;
if (!(e.children.length <= 0)) {
cc.tween(e).repeatForever(cc.tween(e).to(.3, {
scale: .54
}).to(.3, {
scale: .45
})).start();
0 !== e.opacity && this.loadGuideEffect(e);
}
};
e.prototype.loadGuideEffect = function(t) {
hs.ResLoader.loadByBundle("class", hs.ClassPrefabConfig.ClassGuideEffect.url, cc.Prefab, function(e, o) {
if (e) ; else {
var i = Cinst(hs.BlocksProducer);
if (o && cc.isValid(t) && cc.isValid(null == i ? void 0 : i.guideEffectContainer)) {
var n = cc.instantiate(o);
if (cc.isValid(n)) {
i.guideEffectContainer.addChild(n);
n.setPosition(t.x, t.y);
}
}
}
});
};
e.prototype.stopProduceItemEffect = function() {
var t;
"date0211" === (null === (t = this.props) || void 0 === t ? void 0 : t.fixbug) ? this.stopProduceItemEffectFix0211() : this.stopProduceItemEffectNormal();
};
e.prototype.stopProduceItemEffectNormal = function() {
var t, e;
this.clearPollInterval();
var o = cc.director.getScene();
if (o) {
var i = o.getComponentsInChildren(hs.BlocksProducerItem), n = null !== (e = null === (t = Cinst(hs.BlocksProducerTouch)) || void 0 === t ? void 0 : t.selectIndex) && void 0 !== e ? e : -1;
i.forEach(function(t) {
var e = t.node;
cc.Tween.stopAllByTarget(e);
e.scale = t.state.index === n ? 1 : .45;
e.opacity = 255;
});
}
};
e.prototype.stopProduceItemEffectFix0211 = function() {
var t, e;
this.clearPollInterval();
var o = this.getProducerItemList();
if (null == o ? void 0 : o.length) {
var i = null !== (e = null === (t = Cinst(hs.BlocksProducerTouch)) || void 0 === t ? void 0 : t.selectIndex) && void 0 !== e ? e : -1;
o.forEach(function(t) {
var e = t.node;
cc.Tween.stopAllByTarget(e);
e.scale = t.state.index === i ? 1 : .45;
e.opacity = 255;
});
}
};
e.prototype.showGuide = function(t, e, o) {
return s(this, void 0, void 0, function() {
var i, n, r, s;
return a(this, function(a) {
switch (a.label) {
case 0:
return cc.isValid(this._component) ? [ 3, 3 ] : [ 4, CinstAsync(hs.ClassGame) ];

case 1:
i = a.sent();
return [ 4, hs.UI.show(hs.ClassPrefabConfig.ClassGuideWithoutComp, i.guideContainer) ];

case 2:
n = a.sent();
cc.isValid(n) && (this._component = n.addComponent(c.default));
a.label = 3;

case 3:
r = this.localInfo.step;
s = this._steps.length;
t = null != t ? t : r < s;
e = null != e ? e : r < s;
cc.isValid(this._component) && this.setComponentState(t, e, o);
return [ 2 ];
}
});
});
};
e.prototype.removeGuide = function() {
cc.isValid(this._component) && null != this._component.node.parent && this.setComponentState(!1, !1, !1);
};
e.prototype.updateTopInfoVisible = function() {
return s(this, void 0, void 0, function() {
var t;
return a(this, function(e) {
switch (e.label) {
case 0:
return [ 4, CinstAsync(hs.ClassTopInfo) ];

case 1:
if (t = e.sent()) {
t.curNode.active = !hs.classGuideInfo.show;
t.highNode.active = !hs.classGuideInfo.show;
}
return [ 2 ];
}
});
});
};
e.prototype.setComponentState = function(t, e, o) {
var i = this.localInfo.step, n = this._steps[i];
n ? this._component.setState({
showGuideAnimation: e,
showDarkMask: t,
color: n.color,
moveTarget: n.moveTarget,
showLightAndText: o,
lightAnimation: n.lightAnimation,
textImage: n.textImage,
textImageY: n.textImageY,
hideTime: n.delayTime
}) : this._component.setState({
showGuideAnimation: !1,
showDarkMask: !1,
showLightAndText: !1
});
};
r([ hs.storageProperty({
key: "ClassGuideConfigEnhanceTraitData"
}) ], e.prototype, "localInfo", void 0);
return r([ classId("ClassGuideConfigEnhanceTrait") ], e);
}(Trait);
o.ClassGuideConfigEnhanceTrait = u;
cc._RF.pop();
}, {
"./ClassGuideConfigEnhanceComponent": "ClassGuideConfigEnhanceComponent",
"./ClassGuideConfigEnhanceValidate": "ClassGuideConfigEnhanceValidate"
} ],
ClassGuideConfigEnhanceValidate: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "76ae24Dh3tLr4CHMUtlcXUh", "ClassGuideConfigEnhanceValidate");
var i = this && this.__read || function(t, e) {
var o = "function" == typeof Symbol && t[Symbol.iterator];
if (!o) return t;
var i, n, r = o.call(t), s = [];
try {
for (;(void 0 === e || e-- > 0) && !(i = r.next()).done; ) s.push(i.value);
} catch (t) {
n = {
error: t
};
} finally {
try {
i && !i.done && (o = r.return) && o.call(r);
} finally {
if (n) throw n.error;
}
}
return s;
}, n = (this && this.__spread, this && this.__values || function(t) {
var e = "function" == typeof Symbol && Symbol.iterator, o = e && t[e], i = 0;
if (o) return o.call(t);
if (t && "number" == typeof t.length) return {
next: function() {
t && i >= t.length && (t = void 0);
return {
value: t && t[i++],
done: !t
};
}
};
throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
});
Object.defineProperty(o, "__esModule", {
value: !0
});
o.ClassGuideConfigEnhanceValidate = void 0;
var r = function() {
function t() {
this.DefaultSteps = [ {
save_arr: [ [ 10, 10, 10, 5, 10, 10, 10, 10 ], [ 10, 10, 10, 4, 10, 10, 10, 10 ], [ 10, 10, 10, 2, 10, 10, 10, 10 ], [ 10, 10, 10, -1, 10, 10, 10, 10 ], [ 10, 10, 10, -1, 10, 10, 10, 10 ], [ 10, 10, 10, 7, 10, 10, 10, 10 ], [ 10, 10, 10, 1, 10, 10, 10, 10 ], [ 10, 10, 10, 3, 10, 10, 10, 10 ] ],
producerBlocks: [ -1, 2, -1 ],
blocksColors: [ 1, 6, 1 ],
color: 6,
moveTarget: {
row: 3,
col: 3
},
lightAnimation: "in1",
textImage: "text1",
textImageY: 650,
delayTime: 830
}, {
save_arr: [ [ 10, 10, 10, 10, 10, 10, 10, 10 ], [ 10, 10, 10, 10, 10, 10, 10, 10 ], [ 10, 10, 10, 10, 10, 10, 10, 10 ], [ 10, 10, 10, 10, 10, 10, 10, 10 ], [ 5, 4, -1, 2, 6, 7, 1, 3 ], [ 5, 4, -1, -1, -1, 7, 1, 3 ], [ 10, 10, 10, 10, 10, 10, 10, 10 ], [ 10, 10, 10, 10, 10, 10, 10, 10 ] ],
producerBlocks: [ -1, 8, -1 ],
blocksColors: [ 1, 1, 1 ],
color: 1,
moveTarget: {
row: 4,
col: 2
},
lightAnimation: "in2",
textImage: "text2",
textImageY: 333,
delayTime: 830
}, {
save_arr: [ [ -1, -1, -1, 5, 5, -1, -1, -1 ], [ -1, -1, -1, 5, 5, -1, -1, -1 ], [ -1, -1, -1, 2, 2, -1, -1, -1 ], [ 5, 5, 2, -1, -1, 2, 5, 5 ], [ 5, 5, 2, -1, -1, 2, 5, 5 ], [ -1, -1, -1, 2, 2, -1, -1, -1 ], [ -1, -1, -1, 5, 5, -1, -1, -1 ], [ -1, -1, -1, 5, 5, -1, -1, -1 ] ],
producerBlocks: [ -1, 9, -1 ],
blocksColors: [ 1, 6, 1 ],
color: 6,
moveTarget: {
row: 3,
col: 3
},
lightAnimation: "in3",
textImage: "text3",
textImageY: 650,
delayTime: 500
} ];
this.MaxStep = 5;
}
t.prototype.log = function(t) {
for (var e = [], o = 1; o < arguments.length; o++) e[o - 1] = arguments[o];
};
t.prototype.isNumberArray = function(t) {
return Array.isArray(t) && t.every(function(t) {
return "number" == typeof t;
});
};
t.prototype.is2DNumberArray = function(t) {
var e = this;
return Array.isArray(t) && t.every(function(t) {
return e.isNumberArray(t);
});
};
t.prototype.validateOptionalField = function(t, e, o) {
return void 0 === t[e] || typeof t[e] === o;
};
t.prototype.isValidMoveTarget = function(t) {
if (null === t || "object" != typeof t) return !1;
var e = t;
return "number" == typeof e.col && "number" == typeof e.row && e.col >= 0 && e.col < 8 && e.row >= 0 && e.row < 8;
};
t.prototype.isValidStep = function(t) {
var e, o, r = this;
if (!t || "object" != typeof t) return !1;
var s = t, a = [ [ this.isNumberArray(s.blocksColors), "blocksColors" ], [ "number" == typeof s.color, "color" ], [ this.isValidMoveTarget(s.moveTarget), "moveTarget" ], [ this.isNumberArray(s.producerBlocks), "producerBlocks" ], [ this.is2DNumberArray(s.save_arr), "save_arr" ], [ Array.isArray(s.save_arr) && 8 === s.save_arr.length && Array.isArray(s.save_arr[0]) && 8 === s.save_arr[0].length, "save_arr 长度不正确" ] ];
try {
for (var c = n(a), l = c.next(); !l.done; l = c.next()) {
var u = i(l.value, 2), h = u[0];
u[1];
if (!h) return !1;
}
} catch (t) {
e = {
error: t
};
} finally {
try {
l && !l.done && (o = c.return) && o.call(c);
} finally {
if (e) throw e.error;
}
}
return [ [ "lightAnimation", "string" ], [ "textImage", "string" ], [ "textImageY", "number" ], [ "delayTime", "number" ] ].every(function(t) {
var e = i(t, 2), o = e[0], n = e[1];
return r.validateOptionalField(s, o, n);
});
};
t.prototype.isValidStepsArray = function(t) {
var e = this;
return !!Array.isArray(t) && t.every(function(t) {
return e.isValidStep(t);
});
};
t.prototype.validateConfig = function(t, e) {
var o = t ? e.slice() : null;
if (!o || !this.isValidStepsArray(o)) return this.DefaultSteps;
o.length > this.MaxStep && (o.length = this.MaxStep);
return o;
};
return t;
}();
o.ClassGuideConfigEnhanceValidate = r;
cc._RF.pop();
}, {} ]
}, {}, [ "ClassGuideConfigEnhanceComponent", "ClassGuideConfigEnhanceTrait", "ClassGuideConfigEnhanceValidate" ]);
//# sourceMappingURL=index.js.map
