window.__require = function t(e, o, r) {
function s(i, a) {
if (!o[i]) {
if (!e[i]) {
var c = i.split("/");
c = c[c.length - 1];
if (!e[c]) {
var l = "function" == typeof __require && __require;
if (!a && l) return l(c, !0);
if (n) return n(c, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = c;
}
var u = o[i] = {
exports: {}
};
e[i][0].call(u.exports, function(t) {
return s(e[i][1][t] || t);
}, u, u.exports, t, e, o, r);
}
return o[i].exports;
}
for (var n = "function" == typeof __require && __require, i = 0; i < r.length; i++) s(r[i]);
return s;
}({
ClassGuideDirectThreeBlockComponent: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "e3ea2rL+a5P+bcHymP7OPpM", "ClassGuideDirectThreeBlockComponent");
var r, s = this && this.__extends || (r = function(t, e) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
r(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), n = this && this.__decorate || function(t, e, o, r) {
var s, n = arguments.length, i = n < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(t, e, o, r); else for (var a = t.length - 1; a >= 0; a--) (s = t[a]) && (i = (n < 3 ? s(i) : n > 3 ? s(e, o, i) : s(e, o)) || i);
return n > 3 && i && Object.defineProperty(e, o, i), i;
}, i = this && this.__values || function(t) {
var e = "function" == typeof Symbol && Symbol.iterator, o = e && t[e], r = 0;
if (o) return o.call(t);
if (t && "number" == typeof t.length) return {
next: function() {
t && r >= t.length && (t = void 0);
return {
value: t && t[r++],
done: !t
};
}
};
throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, a = this && this.__read || function(t, e) {
var o = "function" == typeof Symbol && t[Symbol.iterator];
if (!o) return t;
var r, s, n = o.call(t), i = [];
try {
for (;(void 0 === e || e-- > 0) && !(r = n.next()).done; ) i.push(r.value);
} catch (t) {
s = {
error: t
};
} finally {
try {
r && !r.done && (o = n.return) && o.call(n);
} finally {
if (s) throw s.error;
}
}
return i;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var c = cc._decorator, l = c.ccclass, u = c.property, h = function(t) {
s(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.blocks = null;
e.dark = null;
e.moveContainer = null;
e.blockList = [];
e._spriteAtlas = null;
return e;
}
e.prototype.onLoad = function() {
this.dark = this.node.getChildByName("dark");
this.moveContainer = this.node.getChildByName("moveContainer");
if (this.moveContainer) {
this.blocks = this.moveContainer.getChildByName("blocks");
this.blocks && this.preloadSpriteAtlas();
}
};
e.prototype.preloadSpriteAtlas = function() {
var t = this;
hs.ResLoader.load(hs.ResUrlType.BLOCKS_DARK, cc.SpriteAtlas, function(e, o) {
e || (t._spriteAtlas = o);
});
};
e.prototype.render = function() {
var t, e = this.state, o = e.step, r = e.showDarkMask, s = e.showHand, n = e.color, i = Math.max(1, null !== (t = this.state.speed) && void 0 !== t ? t : 200);
this.dark.active = r;
if (s) {
var a = hs.classBlocksProducerInfo.producerBlocks[1], c = hs.blockPosInfo[a - 1];
if (c) {
var l = hs.classGuideInfo.steps[o];
if (l) {
var u = l.move;
this.node.opacity = 255;
var h = this.countBlocks(c);
this.hideExtraBlocks(h);
this.updateBlocks(c, n);
this.playMoveAnimation(u, i);
}
}
} else this.moveContainer.opacity = 0;
};
e.prototype.countBlocks = function(t) {
var e, o, r, s, n = 0;
try {
for (var a = i(t), c = a.next(); !c.done; c = a.next()) {
var l = c.value;
try {
for (var u = (r = void 0, i(l)), h = u.next(); !h.done; h = u.next()) 1 === h.value && n++;
} catch (t) {
r = {
error: t
};
} finally {
try {
h && !h.done && (s = u.return) && s.call(u);
} finally {
if (r) throw r.error;
}
}
}
} catch (t) {
e = {
error: t
};
} finally {
try {
c && !c.done && (o = a.return) && o.call(a);
} finally {
if (e) throw e.error;
}
}
return n;
};
e.prototype.hideExtraBlocks = function(t) {
for (var e = t; e < this.blockList.length; e++) this.blockList[e].opacity = 0;
};
e.prototype.updateBlocks = function(t, e) {
for (var o = 0, r = 0; r < t.length; r++) for (var s = 0; s < t[r].length; s++) if (1 === t[r][s]) {
var n = -(t[r].length - 1) * hs.BLOCK_HALF_SIZE + s * hs.BLOCK_SIZE, i = (t.length - 1) * hs.BLOCK_HALF_SIZE - r * hs.BLOCK_SIZE, a = this.getOrCreateBlock(o);
a.setPosition(n, i);
a.opacity = 255;
this.updateBlockSprite(a, e);
o++;
}
};
e.prototype.getOrCreateBlock = function(t) {
if (this.blockList[t]) return this.blockList[t];
var e = new cc.Node("block");
e.addComponent(cc.Sprite);
this.blocks.addChild(e);
this.blockList[t] = e;
return e;
};
e.prototype.updateBlockSprite = function(t, e) {
var o = this, r = t.getComponent(cc.Sprite);
if (r) {
var s = this.getBlockColorStr(e);
this._spriteAtlas ? r.spriteFrame = this._spriteAtlas.getSpriteFrame(s) : hs.ResLoader.load(hs.ResUrlType.BLOCKS_DARK, cc.SpriteAtlas, function(e, n) {
if (e) ; else if (cc.isValid(t)) {
o._spriteAtlas = n;
r.spriteFrame = n.getSpriteFrame(s);
}
});
}
};
e.prototype.playMoveAnimation = function(t, e) {
var o = a(t, 2), r = o[0], s = o[1];
this.blocks.opacity = 120;
var n = this.getDistance2D(r.x, r.y, s.x, s.y) / e;
this.moveContainer.stopAllActions();
this.moveContainer.opacity = 255;
this.moveContainer.setPosition(r.x, r.y);
cc.tween(this.moveContainer).repeatForever(cc.tween(this.moveContainer).to(0, {
x: r.x,
y: r.y
}).to(n, {
x: s.x,
y: s.y
}, {
easing: cc.easing.circOut
}).delay(.2)).start();
};
e.prototype.getBlockColorStr = function(t) {
return "game_cube_" + t;
};
e.prototype.getDistance2D = function(t, e, o, r) {
var s = o - t, n = r - e;
return Math.sqrt(s * s + n * n);
};
e.prototype.onDestroy = function() {
this.blockList.length = 0;
this._spriteAtlas = null;
};
n([ u(cc.Node) ], e.prototype, "blocks", void 0);
n([ u(cc.Node) ], e.prototype, "dark", void 0);
n([ u(cc.Node) ], e.prototype, "moveContainer", void 0);
return n([ l ], e);
}(hs.Component);
o.default = h;
cc._RF.pop();
}, {} ],
ClassGuideDirectThreeBlockTrait: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "e4739hHcUJNrqXRnxtBVTOH", "ClassGuideDirectThreeBlockTrait");
var r, s = this && this.__extends || (r = function(t, e) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
r(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), n = this && this.__decorate || function(t, e, o, r) {
var s, n = arguments.length, i = n < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(t, e, o, r); else for (var a = t.length - 1; a >= 0; a--) (s = t[a]) && (i = (n < 3 ? s(i) : n > 3 ? s(e, o, i) : s(e, o)) || i);
return n > 3 && i && Object.defineProperty(e, o, i), i;
}, i = this && this.__awaiter || function(t, e, o, r) {
return new (o || (o = Promise))(function(s, n) {
function i(t) {
try {
c(r.next(t));
} catch (t) {
n(t);
}
}
function a(t) {
try {
c(r.throw(t));
} catch (t) {
n(t);
}
}
function c(t) {
t.done ? s(t.value) : (e = t.value, e instanceof o ? e : new o(function(t) {
t(e);
})).then(i, a);
var e;
}
c((r = r.apply(t, e || [])).next());
});
}, a = this && this.__generator || function(t, e) {
var o, r, s, n, i = {
label: 0,
sent: function() {
if (1 & s[0]) throw s[1];
return s[1];
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
function a(t) {
return function(e) {
return c([ t, e ]);
};
}
function c(n) {
if (o) throw new TypeError("Generator is already executing.");
for (;i; ) try {
if (o = 1, r && (s = 2 & n[0] ? r.return : n[0] ? r.throw || ((s = r.return) && s.call(r), 
0) : r.next) && !(s = s.call(r, n[1])).done) return s;
(r = 0, s) && (n = [ 2 & n[0], s.value ]);
switch (n[0]) {
case 0:
case 1:
s = n;
break;

case 4:
i.label++;
return {
value: n[1],
done: !1
};

case 5:
i.label++;
r = n[1];
n = [ 0 ];
continue;

case 7:
n = i.ops.pop();
i.trys.pop();
continue;

default:
if (!(s = i.trys, s = s.length > 0 && s[s.length - 1]) && (6 === n[0] || 2 === n[0])) {
i = 0;
continue;
}
if (3 === n[0] && (!s || n[1] > s[0] && n[1] < s[3])) {
i.label = n[1];
break;
}
if (6 === n[0] && i.label < s[1]) {
i.label = s[1];
s = n;
break;
}
if (s && i.label < s[2]) {
i.label = s[2];
i.ops.push(n);
break;
}
s[2] && i.ops.pop();
i.trys.pop();
continue;
}
n = e.call(t, i);
} catch (t) {
n = [ 6, t ];
r = 0;
} finally {
o = s = 0;
}
if (5 & n[0]) throw n[1];
return {
value: n[0] ? n[1] : void 0,
done: !0
};
}
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.ClassGuideDirectThreeBlockTrait = void 0;
var c = t("./ClassGuideDirectThreeBlockComponent"), l = function(t) {
s(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._effect = null;
e._component = null;
e.localInfo = {
avoidHandAnim: !1,
hasPutBlock: !1
};
return e;
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
var e;
if (hs.tp.isClassGuide_ProxyInitTraits(t)) {
this.initTraits();
this.loadPrefab();
}
hs.tp.isClassGuide_ProxyOnClassGameCreate(t) && this.onClassGameCreate();
hs.tp.isClassGuide_ProxyShowClassGuide(t) && (t.replace = !0);
hs.tp.isClassGuide_ProxyOnGuideChange(t) && this.onGuideChange();
hs.tp.isClassGuide_ProxyOnTouchStart(t) && this.onTouchStart();
hs.tp.isClassGuide_ProxyOnAnyTouchEnd(t) && this.onAnyTouchEnd();
hs.tp.isClassGuide_ProxyOnTouchEnd(t) && this.onTouchEnd();
hs.tp.isClassGuide_ProxyGuideEndDot(t) && hs.classGuideInfo.step === hs.classGuideInfo.totalStep - 1 && (t.replace = !0);
hs.tp.isClassBoard_ProxyGetGuideFaceBlocks(t) && hs.classGuideInfo.show && this.localInfo.hasPutBlock && (t.args[0] = storage.getItem("classFaceBlocks", hs.boardInfo.NULL));
if (hs.tp.isClassBlocksProducer_ProxyGuideRequestBlocksProducer(t)) {
if (null === (e = t.args[0]) || void 0 === e ? void 0 : e.clearScreen) return;
t.disable([ "FirstEightGamesFixedBoardTrait" ]);
}
};
e.prototype.initTraits = function() {
if (hs.classGuideInfo.show) {
storage.setItem("classGuideStep", 2);
Object.assign(hs.classGuideInfo.steps[2], {
producerBlocks: this.producerBlocks,
blocksColors: this.blocksColors,
color: this.color
});
}
};
e.prototype.onClassGameCreate = function() {
if (hs.classGuideInfo.show) {
var t = hs.classGuideInfo.step;
this.showGuide({
step: t,
showDarkMask: !0,
showHand: !1
});
}
};
e.prototype.onGuideChange = function() {
var t, e, o = hs.classGuideInfo, r = o.totalStep, s = o.step;
if (s < r) this.showGuide({
step: s
}); else if (s === r) {
DS(null === (t = hs.classGuideInfo.steps[hs.classGuideInfo.step - 1]) || void 0 === t ? void 0 : t.dotEnd);
null === (e = this._component) || void 0 === e || e.setState({
step: s,
showDarkMask: !1,
showHand: !1
});
}
};
e.prototype.onTouchStart = function() {
var t;
if (hs.classGuideInfo.show) {
var e = hs.classGuideInfo.step;
null === (t = this._component) || void 0 === t || t.setState({
step: e,
showDarkMask: !0,
showHand: !1
});
}
};
e.prototype.onAnyTouchEnd = function() {
var t;
if (hs.classGuideInfo.show) {
var e = hs.classGuideInfo.step;
null === (t = this._component) || void 0 === t || t.setState({
step: e,
showDarkMask: !0,
showHand: !this.localInfo.avoidHandAnim
});
}
};
e.prototype.onTouchEnd = function() {
var t;
if (hs.classGuideInfo.show) {
this.localInfo.hasPutBlock = !0;
this.playEffect();
if (hs.blocksProducerInfo.producerBlocks.some(function(t) {
return -1 !== t;
})) {
this.localInfo.avoidHandAnim = !0;
var e = hs.classGuideInfo.step;
null === (t = this._component) || void 0 === t || t.setState({
step: e,
showDarkMask: !0,
showHand: !1
});
}
}
};
e.prototype.showGuide = function(t) {
var e, o, r;
return i(this, void 0, void 0, function() {
var s, n, i, l, u, h, p, f, d;
return a(this, function(a) {
switch (a.label) {
case 0:
return cc.isValid(this._component) ? [ 3, 3 ] : [ 4, CinstAsync(hs.ClassGame) ];

case 1:
s = a.sent();
return [ 4, hs.UI.show(hs.ClassPrefabConfig.ClassGuideWithoutComp, s.guideContainer) ];

case 2:
n = a.sent();
cc.isValid(n) && (this._component = n.addComponent(c.default));
a.label = 3;

case 3:
i = hs.classGuideInfo, l = i.totalStep, u = i.steps;
h = t.step;
p = null !== (e = t.showDarkMask) && void 0 !== e ? e : h < l;
f = (null !== (o = t.showHand) && void 0 !== o ? o : h < l) && !this.localInfo.avoidHandAnim;
d = null !== (r = t.color) && void 0 !== r ? r : u[h].color;
cc.isValid(this._component) && this._component.setState({
step: h,
showDarkMask: p,
showHand: f,
color: d
});
return [ 2 ];
}
});
});
};
e.prototype.loadPrefab = function() {
return i(this, void 0, void 0, function() {
var t;
return a(this, function(e) {
switch (e.label) {
case 0:
if (cc.isValid(this._effect)) return [ 2 ];
e.label = 1;

case 1:
e.trys.push([ 1, 3, , 4 ]);
return [ 4, hs.ResLoader.asyncLoadByBundle("ClassGuideDirectThreeBlockTrait", "prefabs/effect", cc.Prefab) ];

case 2:
t = e.sent();
if (cc.isValid(this._effect)) return [ 2 ];
this._effect = cc.instantiate(t).getComponent(sp.Skeleton);
return [ 3, 4 ];

case 3:
e.sent();
return [ 3, 4 ];

case 4:
return [ 2 ];
}
});
});
};
e.prototype.playEffect = function() {
var t = this;
if (cc.isValid(this._effect)) {
var e = Cinst(hs.ClassGame);
if (cc.isValid(null == e ? void 0 : e.guideContainer)) {
e.guideContainer.addChild(this._effect.node);
this._effect.node.setPosition(0, 130);
this._effect.timeScale = 1 / (cc.director._kSpeed || 1);
this._effect.setAnimation(0, "in", !1);
this._effect.setCompleteListener(function() {
if (cc.isValid(t._effect)) {
t._effect.node.removeFromParent();
t._effect.node.destroy();
t._effect = null;
}
});
}
}
};
Object.defineProperty(e.prototype, "producerBlocks", {
get: function() {
var t;
if (null === (t = this.props) || void 0 === t ? void 0 : t.producerBlocks) {
var e = this.props.producerBlocks.map(function(t) {
return Number.isInteger(t) ? t : Math.floor(t);
});
if (3 === e.length && e.every(function(t) {
return t >= 1 && t <= 42 || -1 === t;
})) return e;
}
return [ 13, 9, 13 ];
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "blocksColors", {
get: function() {
var t;
if (null === (t = this.props) || void 0 === t ? void 0 : t.blocksColors) {
var e = this.props.blocksColors.map(function(t) {
return Number.isInteger(t) ? t : Math.floor(t);
});
if (3 === e.length && e.every(function(t) {
return t >= 1 && t <= 7 || -1 === t;
})) return e;
}
return [ 4, 1, 6 ];
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "color", {
get: function() {
return this.blocksColors[1];
},
enumerable: !1,
configurable: !0
});
n([ hs.storageProperty({
key: "ClassGuideDirectThreeBlockTraitData"
}) ], e.prototype, "localInfo", void 0);
return n([ classId("ClassGuideDirectThreeBlockTrait") ], e);
}(Trait);
o.ClassGuideDirectThreeBlockTrait = l;
cc._RF.pop();
}, {
"./ClassGuideDirectThreeBlockComponent": "ClassGuideDirectThreeBlockComponent"
} ]
}, {}, [ "ClassGuideDirectThreeBlockComponent", "ClassGuideDirectThreeBlockTrait" ]);
//# sourceMappingURL=index.js.map
