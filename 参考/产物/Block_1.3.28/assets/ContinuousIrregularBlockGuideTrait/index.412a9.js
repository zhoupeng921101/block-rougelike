window.__require = function t(e, o, n) {
function r(s, a) {
if (!o[s]) {
if (!e[s]) {
var c = s.split("/");
c = c[c.length - 1];
if (!e[c]) {
var l = "function" == typeof __require && __require;
if (!a && l) return l(c, !0);
if (i) return i(c, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = c;
}
var u = o[s] = {
exports: {}
};
e[s][0].call(u.exports, function(t) {
return r(e[s][1][t] || t);
}, u, u.exports, t, e, o, n);
}
return o[s].exports;
}
for (var i = "function" == typeof __require && __require, s = 0; s < n.length; s++) r(n[s]);
return r;
}({
ContinuousIrregularBlockGuideComponent: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "d6deaq+QItAMabGGbaYexlV", "ContinuousIrregularBlockGuideComponent");
var n, r = this && this.__extends || (n = function(t, e) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
n(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), i = this && this.__decorate || function(t, e, o, n) {
var r, i = arguments.length, s = i < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, o, n); else for (var a = t.length - 1; a >= 0; a--) (r = t[a]) && (s = (i < 3 ? r(s) : i > 3 ? r(e, o, s) : r(e, o)) || s);
return i > 3 && s && Object.defineProperty(e, o, s), s;
}, s = this && this.__awaiter || function(t, e, o, n) {
return new (o || (o = Promise))(function(r, i) {
function s(t) {
try {
c(n.next(t));
} catch (t) {
i(t);
}
}
function a(t) {
try {
c(n.throw(t));
} catch (t) {
i(t);
}
}
function c(t) {
t.done ? r(t.value) : (e = t.value, e instanceof o ? e : new o(function(t) {
t(e);
})).then(s, a);
var e;
}
c((n = n.apply(t, e || [])).next());
});
}, a = this && this.__generator || function(t, e) {
var o, n, r, i, s = {
label: 0,
sent: function() {
if (1 & r[0]) throw r[1];
return r[1];
},
trys: [],
ops: []
};
return i = {
next: a(0),
throw: a(1),
return: a(2)
}, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
return this;
}), i;
function a(t) {
return function(e) {
return c([ t, e ]);
};
}
function c(i) {
if (o) throw new TypeError("Generator is already executing.");
for (;s; ) try {
if (o = 1, n && (r = 2 & i[0] ? n.return : i[0] ? n.throw || ((r = n.return) && r.call(n), 
0) : n.next) && !(r = r.call(n, i[1])).done) return r;
(n = 0, r) && (i = [ 2 & i[0], r.value ]);
switch (i[0]) {
case 0:
case 1:
r = i;
break;

case 4:
s.label++;
return {
value: i[1],
done: !1
};

case 5:
s.label++;
n = i[1];
i = [ 0 ];
continue;

case 7:
i = s.ops.pop();
s.trys.pop();
continue;

default:
if (!(r = s.trys, r = r.length > 0 && r[r.length - 1]) && (6 === i[0] || 2 === i[0])) {
s = 0;
continue;
}
if (3 === i[0] && (!r || i[1] > r[0] && i[1] < r[3])) {
s.label = i[1];
break;
}
if (6 === i[0] && s.label < r[1]) {
s.label = r[1];
r = i;
break;
}
if (r && s.label < r[2]) {
s.label = r[2];
s.ops.push(i);
break;
}
r[2] && s.ops.pop();
s.trys.pop();
continue;
}
i = e.call(t, s);
} catch (t) {
i = [ 6, t ];
n = 0;
} finally {
o = r = 0;
}
if (5 & i[0]) throw i[1];
return {
value: i[0] ? i[1] : void 0,
done: !0
};
}
}, c = this && this.__values || function(t) {
var e = "function" == typeof Symbol && Symbol.iterator, o = e && t[e], n = 0;
if (o) return o.call(t);
if (t && "number" == typeof t.length) return {
next: function() {
t && n >= t.length && (t = void 0);
return {
value: t && t[n++],
done: !t
};
}
};
throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var l = cc._decorator.ccclass, u = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.blocks = null;
e.dark = null;
e.moveContainer = null;
e.isPlayingEffect = !1;
e.effectNode = null;
e.blockList = [];
e.animationIndex = 0;
e.blockAtlas = null;
return e;
}
e.prototype.onLoad = function() {
this.moveContainer = this.node.getChildByName("moveContainer");
this.blocks = this.moveContainer.getChildByName("blocks");
this.dark = this.node.getChildByName("dark");
this.loadEffect();
};
e.prototype.render = function() {
var t = this.state, e = t.showDarkMask, o = t.showAnimation, n = t.animations;
this.dark.active = e;
o && (null == n ? void 0 : n.length) > 0 ? this.showGuide() : this.hideGuide();
};
e.prototype.loadEffect = function() {
return s(this, void 0, void 0, function() {
var t;
return a(this, function(e) {
switch (e.label) {
case 0:
e.trys.push([ 0, 2, , 3 ]);
return [ 4, hs.ResLoader.asyncLoadByBundle("class", hs.ClassPrefabConfig.ClassGuideEffect.url, cc.Prefab) ];

case 1:
t = e.sent();
if (!cc.isValid(t) || !cc.isValid(this.node)) return [ 2 ];
this.effectNode = cc.instantiate(t);
this.isPlayingEffect && this.playBlockEffect(this.state.animations[this.animationIndex].blockId);
return [ 3, 3 ];

case 2:
e.sent();
return [ 3, 3 ];

case 3:
return [ 2 ];
}
});
});
};
e.prototype.showGuide = function() {
this.isPlayingEffect = !0;
this.animationIndex = 0;
this.node.opacity = 255;
this.blocks.opacity = 120;
this.moveContainer.stopAllActions();
this.moveContainer.opacity = 255;
this.moveBlocks();
};
e.prototype.moveBlocks = function() {
var t = this, e = this.state.animations[this.animationIndex];
this.createBlocks(e.blockId, e.blockColor);
var o = cc.Vec2.distance(e.start, e.end), n = Math.min(3, o / 200);
cc.tween(this.moveContainer).set({
x: e.start.x,
y: e.start.y
}).to(n, {
x: e.end.x,
y: e.end.y
}, {
easing: cc.easing.circOut
}).delay(.2).call(function() {
cc.isValid(t.node) && t.moveBlocks();
}).start();
this.playBlockEffect(e.blockId);
this.animationIndex = (this.animationIndex + 1) % this.state.animations.length;
};
e.prototype.hideGuide = function() {
var t;
this.isPlayingEffect = !1;
this.moveContainer.stopAllActions();
this.moveContainer.opacity = 0;
this.resetBlocksProducerItems();
null === (t = this.effectNode) || void 0 === t || t.removeFromParent();
};
e.prototype.resetBlocksProducerItems = function() {
var t, e, o, n, r, i = null !== (n = null === (o = cc.director.getScene()) || void 0 === o ? void 0 : o.getComponentsInChildren(hs.BlocksProducerItem)) && void 0 !== n ? n : [], s = null === (r = Cinst(hs.BlocksProducerTouch)) || void 0 === r ? void 0 : r.selectIndex;
try {
for (var a = c(i), l = a.next(); !l.done; l = a.next()) {
var u = l.value, h = u.node;
h.stopAllActions();
h.scale = u.state.index === s ? 1 : .45;
}
} catch (e) {
t = {
error: e
};
} finally {
try {
l && !l.done && (e = a.return) && e.call(a);
} finally {
if (t) throw t.error;
}
}
};
e.prototype.playBlockEffect = function(t) {
var e, o, n, r, i = null !== (r = null === (n = cc.director.getScene()) || void 0 === n ? void 0 : n.getComponentsInChildren(hs.BlocksProducerItem)) && void 0 !== r ? r : [];
try {
for (var s = c(i), a = s.next(); !a.done; a = s.next()) {
var l = a.value, u = l.node;
if (l.state.id === t) {
this.animateTargetBlock(u);
this.updateEffectPosition(u);
} else {
u.stopAllActions();
u.scale = .45;
}
}
} catch (t) {
e = {
error: t
};
} finally {
try {
a && !a.done && (o = s.return) && o.call(s);
} finally {
if (e) throw e.error;
}
}
};
e.prototype.animateTargetBlock = function(t) {
var e = cc.director._kSpeed || 1;
cc.tween(t).repeatForever(cc.tween(t).to(.2 * e, {
scale: .54
}).to(.2 * e, {
scale: .45
})).start();
};
e.prototype.updateEffectPosition = function(t) {
if (cc.isValid(this.effectNode)) {
var e = Cinst(hs.BlocksProducer);
if (cc.isValid(e) && cc.isValid(e.guideEffectContainer)) {
this.effectNode.parent !== e.guideEffectContainer && e.guideEffectContainer.addChild(this.effectNode);
this.effectNode.x = t.x;
this.effectNode.y = t.y;
}
}
};
e.prototype.createBlocks = function(t, e) {
var o = this, n = hs.blockPosInfo[t - 1];
if (n) {
for (var r = [], i = 0; i < n.length; i++) for (var s = 0; s < n[i].length; s++) 1 === n[i][s] && r.push({
x: -(n[i].length - 1) * hs.BLOCK_HALF_SIZE + s * hs.BLOCK_SIZE,
y: (n.length - 1) * hs.BLOCK_HALF_SIZE - i * hs.BLOCK_SIZE
});
for (i = 0; i < this.blockList.length; i++) this.blockList[i].opacity = i < r.length ? 255 : 0;
r.forEach(function(t, n) {
var r = o.getOrCreateBlockNode(n);
r.x = t.x;
r.y = t.y;
o.loadBlockSprite(r, e);
});
}
};
e.prototype.getOrCreateBlockNode = function(t) {
if (this.blockList[t]) return this.blockList[t];
var e = new cc.Node("block");
this.blockList[t] = e;
this.blocks.addChild(e);
return e;
};
e.prototype.loadBlockSprite = function(t, e) {
var o = this, n = t.getComponent(cc.Sprite) || t.addComponent(cc.Sprite);
this.blockAtlas ? n.spriteFrame = this.blockAtlas.getSpriteFrame("game_cube_" + e) : hs.ResLoader.load(hs.ResUrlType.BLOCKS_DARK, cc.SpriteAtlas, function(r, i) {
if (r) ; else if (cc.isValid(t) && cc.isValid(n) && i) {
o.blockAtlas = i;
n.spriteFrame = i.getSpriteFrame("game_cube_" + e);
}
});
};
return i([ l ], e);
}(hs.Component);
o.default = u;
cc._RF.pop();
}, {} ],
ContinuousIrregularBlockGuideTrait: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "2c81cDKJ61OP70cYEnJei6f", "ContinuousIrregularBlockGuideTrait");
var n, r = this && this.__extends || (n = function(t, e) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
n(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), i = this && this.__decorate || function(t, e, o, n) {
var r, i = arguments.length, s = i < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, o, n); else for (var a = t.length - 1; a >= 0; a--) (r = t[a]) && (s = (i < 3 ? r(s) : i > 3 ? r(e, o, s) : r(e, o)) || s);
return i > 3 && s && Object.defineProperty(e, o, s), s;
}, s = this && this.__awaiter || function(t, e, o, n) {
return new (o || (o = Promise))(function(r, i) {
function s(t) {
try {
c(n.next(t));
} catch (t) {
i(t);
}
}
function a(t) {
try {
c(n.throw(t));
} catch (t) {
i(t);
}
}
function c(t) {
t.done ? r(t.value) : (e = t.value, e instanceof o ? e : new o(function(t) {
t(e);
})).then(s, a);
var e;
}
c((n = n.apply(t, e || [])).next());
});
}, a = this && this.__generator || function(t, e) {
var o, n, r, i, s = {
label: 0,
sent: function() {
if (1 & r[0]) throw r[1];
return r[1];
},
trys: [],
ops: []
};
return i = {
next: a(0),
throw: a(1),
return: a(2)
}, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
return this;
}), i;
function a(t) {
return function(e) {
return c([ t, e ]);
};
}
function c(i) {
if (o) throw new TypeError("Generator is already executing.");
for (;s; ) try {
if (o = 1, n && (r = 2 & i[0] ? n.return : i[0] ? n.throw || ((r = n.return) && r.call(n), 
0) : n.next) && !(r = r.call(n, i[1])).done) return r;
(n = 0, r) && (i = [ 2 & i[0], r.value ]);
switch (i[0]) {
case 0:
case 1:
r = i;
break;

case 4:
s.label++;
return {
value: i[1],
done: !1
};

case 5:
s.label++;
n = i[1];
i = [ 0 ];
continue;

case 7:
i = s.ops.pop();
s.trys.pop();
continue;

default:
if (!(r = s.trys, r = r.length > 0 && r[r.length - 1]) && (6 === i[0] || 2 === i[0])) {
s = 0;
continue;
}
if (3 === i[0] && (!r || i[1] > r[0] && i[1] < r[3])) {
s.label = i[1];
break;
}
if (6 === i[0] && s.label < r[1]) {
s.label = r[1];
r = i;
break;
}
if (r && s.label < r[2]) {
s.label = r[2];
s.ops.push(i);
break;
}
r[2] && s.ops.pop();
s.trys.pop();
continue;
}
i = e.call(t, s);
} catch (t) {
i = [ 6, t ];
n = 0;
} finally {
o = r = 0;
}
if (5 & i[0]) throw i[1];
return {
value: i[0] ? i[1] : void 0,
done: !0
};
}
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.ContinuousIrregularBlockGuideTrait = void 0;
var c = t("./ContinuousIrregularBlockGuideComponent"), l = {
save_arr: [ [ -1, -1, -1, -1, -1, 1, 1, 1 ], [ -1, -1, -1, -1, -1, -1, 1, 1 ], [ -1, -1, -1, -1, -1, -1, 1, 1 ], [ -1, -1, -1, -1, -1, -1, -1, 1 ], [ -1, -1, -1, -1, -1, 1, 1, 1 ], [ 1, -1, -1, -1, 1, -1, 1, 1 ], [ 1, 1, -1, 1, 1, 1, -1, 1 ], [ 1, 1, 1, 1, 1, 1, 1, -1 ] ],
producerBlocks: [ 26, 42, 39 ],
blocksColors: [ 3, 5, 2 ]
}, u = cc.v2(0, 126.25), h = cc.v2(0, -553.75), d = [ {
row: 5,
col: 1,
start: new cc.Vec2(-280, h.y),
end: new cc.Vec2(u.x - 159, u.y - 212)
}, {
row: 1,
col: 5,
start: new cc.Vec2(0, h.y),
end: new cc.Vec2(u.x + 212, u.y + 159)
}, {
row: 5,
col: 5,
start: new cc.Vec2(280, h.y),
end: new cc.Vec2(u.x + 265, u.y - 265)
} ], f = function(t) {
r(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
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
className: "ClassGuide_Proxy",
methodName: "onTouchEnd"
} ];
};
e.prototype.onActive = function(t) {
hs.tp.isClassGuide_ProxyInitTraits(t) && this.handleInitTraits();
hs.tp.isClassGuide_ProxyShowClassGuide(t) && (t.replace = !0);
hs.tp.isClassGuide_ProxyOnClassGameCreate(t) && this.handleClassGameCreate();
hs.tp.isClassGuide_ProxyOnGuideChange(t) && this.handleGuideChange();
hs.tp.isClassGuide_ProxyOnTouchStart(t) && this.handleTouchStart();
hs.tp.isClassGuide_ProxyOnAnyTouchEnd(t) && this.handleAnyTouchEnd();
hs.tp.isClassGuide_ProxyOnTouchEnd(t) && this.handleTouchEnd();
hs.tp.isClassBlocksProducer_ProxyGuideRequestBlocksProducer(t) && this.handleGuideRequestBlocksProducer(t);
};
e.prototype.handleInitTraits = function() {
if (hs.classGuideInfo.show) {
storage.setItem("classGuideStep", 2);
Object.assign(hs.classGuideInfo.steps[2], l);
}
};
e.prototype.handleClassGameCreate = function() {
hs.classGuideInfo.show && this.showGuide({
showDarkMask: !0,
showAnim: !1
});
};
e.prototype.handleGuideChange = function() {
var t = hs.classGuideInfo, e = t.step, o = t.totalStep;
e < o ? this.showGuide({
showDarkMask: !0,
showAnim: !this.isLastBlockPlaced()
}) : e === o && this.showGuide({
showDarkMask: !1,
showAnim: !1
});
};
e.prototype.handleTouchStart = function() {
var t = hs.classGuideInfo, e = t.show, o = t.step, n = t.totalStep;
e && o !== n && this.showGuide({
showDarkMask: !0,
showAnim: !1
});
};
e.prototype.handleAnyTouchEnd = function() {
hs.classGuideInfo.show && this.showGuide({
showDarkMask: !0,
showAnim: !this.isLastBlockPlaced()
});
};
e.prototype.handleTouchEnd = function() {
hs.classGuideInfo.show && this.isLastBlockPlaced() && this.showGuide({
showDarkMask: !0,
showAnim: !1
});
};
e.prototype.handleGuideRequestBlocksProducer = function(t) {
var e;
(null === (e = t.args[0]) || void 0 === e ? void 0 : e.clearScreen) || t.disable([ "FirstEightGamesFixedBoardTrait" ]);
};
e.prototype.isLastBlockPlaced = function() {
return -1 === hs.classBlocksProducerInfo.producerBlocks[2];
};
e.prototype.showGuide = function(t) {
var e, o;
return s(this, void 0, void 0, function() {
var n, r, i, s, c, l;
return a(this, function(a) {
switch (a.label) {
case 0:
return [ 4, this.ensureGuideComponent() ];

case 1:
a.sent();
if (!cc.isValid(this.guideComp)) return [ 2 ];
n = hs.classGuideInfo, r = n.step, i = n.totalStep;
s = null !== (e = t.showDarkMask) && void 0 !== e ? e : r < i;
c = null !== (o = t.showAnim) && void 0 !== o ? o : r < i;
l = c ? this.getAnimations() : null;
this.guideComp.setState({
showDarkMask: s,
showAnimation: c,
animations: l
});
return [ 2 ];
}
});
});
};
e.prototype.ensureGuideComponent = function() {
return s(this, void 0, void 0, function() {
var t, e;
return a(this, function(o) {
switch (o.label) {
case 0:
return cc.isValid(this.guideComp) ? [ 2 ] : [ 4, CinstAsync(hs.ClassGame) ];

case 1:
t = o.sent();
return cc.isValid(t) && cc.isValid(t.guideContainer) ? [ 4, hs.UI.show(hs.ClassPrefabConfig.ClassGuideWithoutComp, t.guideContainer) ] : [ 2 ];

case 2:
e = o.sent();
cc.isValid(e) && (this.guideComp = e.addComponent(c.default));
return [ 2 ];
}
});
});
};
e.prototype.getAnimations = function() {
var t = hs.classBoardInfo.faceBlocks, e = hs.classBlocksProducerInfo.producerBlocks;
if (this.isLastBlockPlaced()) return [];
for (var o = [], n = 0; n < l.producerBlocks.length; n++) if (-1 !== e[n]) {
var r = l.producerBlocks[n], i = hs.blockPosInfo[r - 1];
if (i) {
var s = d[n], a = s.row, c = s.col, u = s.start, h = s.end;
this.checkHasBlockAtPosition(i, a, c, t) || o.push({
start: u,
end: h,
blockId: r,
blockColor: l.blocksColors[n]
});
}
}
return o;
};
e.prototype.checkHasBlockAtPosition = function(t, e, o, n) {
for (var r, i = 0; i < t.length; i++) for (var s = 0; s < t[i].length; s++) if (1 === t[i][s]) {
var a = null === (r = n[e + i]) || void 0 === r ? void 0 : r[o + s];
if (-1 !== a && 10 !== a) return !0;
}
return !1;
};
return i([ classId("ContinuousIrregularBlockGuideTrait") ], e);
}(Trait);
o.ContinuousIrregularBlockGuideTrait = f;
cc._RF.pop();
}, {
"./ContinuousIrregularBlockGuideComponent": "ContinuousIrregularBlockGuideComponent"
} ]
}, {}, [ "ContinuousIrregularBlockGuideComponent", "ContinuousIrregularBlockGuideTrait" ]);
//# sourceMappingURL=index.js.map
