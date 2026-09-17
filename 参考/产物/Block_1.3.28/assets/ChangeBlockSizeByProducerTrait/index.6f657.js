window.__require = function e(t, r, o) {
function n(c, a) {
if (!r[c]) {
if (!t[c]) {
var s = c.split("/");
s = s[s.length - 1];
if (!t[s]) {
var l = "function" == typeof __require && __require;
if (!a && l) return l(s, !0);
if (i) return i(s, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = s;
}
var u = r[c] = {
exports: {}
};
t[c][0].call(u.exports, function(e) {
return n(t[c][1][e] || e);
}, u, u.exports, e, t, r, o);
}
return r[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < o.length; c++) n(o[c]);
return n;
}({
ChangeBlockSizeByProducerTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "008ecTZts9EXpPlD1+4sbJM", "ChangeBlockSizeByProducerTrait");
var o, n = this && this.__extends || (o = function(e, t) {
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
}), i = this && this.__decorate || function(e, t, r, o) {
var n, i = arguments.length, c = i < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(e, t, r, o); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (c = (i < 3 ? n(c) : i > 3 ? n(t, r, c) : n(t, r)) || c);
return i > 3 && c && Object.defineProperty(t, r, c), c;
}, c = this && this.__awaiter || function(e, t, r, o) {
return new (r || (r = Promise))(function(n, i) {
function c(e) {
try {
s(o.next(e));
} catch (e) {
i(e);
}
}
function a(e) {
try {
s(o.throw(e));
} catch (e) {
i(e);
}
}
function s(e) {
e.done ? n(e.value) : (t = e.value, t instanceof r ? t : new r(function(e) {
e(t);
})).then(c, a);
var t;
}
s((o = o.apply(e, t || [])).next());
});
}, a = this && this.__generator || function(e, t) {
var r, o, n, i, c = {
label: 0,
sent: function() {
if (1 & n[0]) throw n[1];
return n[1];
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
function a(e) {
return function(t) {
return s([ e, t ]);
};
}
function s(i) {
if (r) throw new TypeError("Generator is already executing.");
for (;c; ) try {
if (r = 1, o && (n = 2 & i[0] ? o.return : i[0] ? o.throw || ((n = o.return) && n.call(o), 
0) : o.next) && !(n = n.call(o, i[1])).done) return n;
(o = 0, n) && (i = [ 2 & i[0], n.value ]);
switch (i[0]) {
case 0:
case 1:
n = i;
break;

case 4:
c.label++;
return {
value: i[1],
done: !1
};

case 5:
c.label++;
o = i[1];
i = [ 0 ];
continue;

case 7:
i = c.ops.pop();
c.trys.pop();
continue;

default:
if (!(n = c.trys, n = n.length > 0 && n[n.length - 1]) && (6 === i[0] || 2 === i[0])) {
c = 0;
continue;
}
if (3 === i[0] && (!n || i[1] > n[0] && i[1] < n[3])) {
c.label = i[1];
break;
}
if (6 === i[0] && c.label < n[1]) {
c.label = n[1];
n = i;
break;
}
if (n && c.label < n[2]) {
c.label = n[2];
c.ops.push(i);
break;
}
n[2] && c.ops.pop();
c.trys.pop();
continue;
}
i = t.call(e, c);
} catch (e) {
i = [ 6, e ];
o = 0;
} finally {
r = n = 0;
}
if (5 & i[0]) throw i[1];
return {
value: i[0] ? i[1] : void 0,
done: !0
};
}
}, s = this && this.__read || function(e, t) {
var r = "function" == typeof Symbol && e[Symbol.iterator];
if (!r) return e;
var o, n, i = r.call(e), c = [];
try {
for (;(void 0 === t || t-- > 0) && !(o = i.next()).done; ) c.push(o.value);
} catch (e) {
n = {
error: e
};
} finally {
try {
o && !o.done && (r = i.return) && r.call(i);
} finally {
if (n) throw n.error;
}
}
return c;
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
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ChangeBlockSizeByProducerTrait = void 0;
var u = e("./component/ChapterChangeBlockSizeByProducerCom"), h = e("./interface/IChapterBlockSizeByProducer"), d = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._bigBlockNodes = new Map();
t._pureColors = [ -1, -1, -1 ];
t._uiNode = null;
t._animPrefab = null;
return t;
}
t.prototype.onCreate = function() {
this.preloadResource();
};
t.prototype.preloadResource = function() {
var e = this;
Promise.all([ hs.ResLoader.asyncLoadByBundle(h.ChapterBlockSizeByProducerDefine.BundleName, "prefabs/ChapterChangeBlockSizeByProducerUI", cc.Prefab), hs.ResLoader.asyncLoadByBundle(h.ChapterBlockSizeByProducerDefine.BundleName, "prefabs/ChapterChangeBlockSizeByProducerAnim", cc.Prefab) ]).then(function(t) {
var r = s(t, 2), o = r[0], n = r[1];
e._animPrefab = n;
e._uiNode = cc.instantiate(o);
});
};
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "Skin_Proxy",
methodName: "traitConfigInitComplete"
}, {
className: "BlocksProducer",
methodName: "setLastItemFinished"
}, {
className: "HomePage_Proxy",
methodName: "showHomePage"
} ];
};
t.prototype.onActive = function(e) {
var t, r;
if (hs.tp.isBlocksProducerSetLastItemFinished(e)) {
if (!this.isTrigger()) return;
if (hs.gameInfo.gameMode !== hs.GameMode.Chapter) return;
this.checkChangeBlocks();
}
if (hs.tp.isBlocksProducer_ProxyOnTouchEnd(e)) {
if (!this.isTrigger()) return;
if (hs.gameInfo.gameMode !== hs.GameMode.Chapter) return;
var o = e.args[0].state;
if (-1 === this._pureColors[o.touchIndex]) return;
var n = e.args[0].state.touchIndex;
this.destroyOneBigBlock(n);
if (o.canEliminate) return;
var i = o.putPos;
try {
for (var c = l(i), a = c.next(); !a.done; a = c.next()) {
var s = a.value;
this.playEffect(hs.boardRendererInfo.blockSprites[s.x][s.y], o.touchBlockId, o.touchIndex);
}
} catch (e) {
t = {
error: e
};
} finally {
try {
a && !a.done && (r = c.return) && r.call(c);
} finally {
if (t) throw t.error;
}
}
e.disable([ "ShowPutEffectTrait" ]);
}
hs.tp.isHomePage_ProxyShowHomePage(e) && this.destroyBigBlocks();
};
t.prototype.isTrigger = function() {
return this._animPrefab && this._uiNode;
};
t.prototype.checkChangeBlocks = function() {
this._pureColors = [ -1, -1, -1 ];
this.destroyBigBlocks();
if (hs.chapterGameInfo.chapterCondition.Way === hs.ChapterType.collect) {
var e = Cinst(hs.BlocksProducer);
if (e) {
var t = e.blocksContainer;
if (cc.isValid(t)) for (var r = storage.getItem("chapterCollectionLists", []), o = 0; o < t.children.length; o++) {
var n = t.children[o].getComponent(hs.BlocksProducerItem);
if (-1 !== n.state.id && null != r[o] && 0 !== Object.keys(r[o]).length) {
var i = this.getPureGemColor(n);
if (-1 !== i && (n.state.id === hs.BlocksProducerType.ID9 || n.state.id === hs.BlocksProducerType.ID13)) {
this._pureColors[o] = i;
this.createBigBlock(o, n, i, n.state.id);
}
}
}
}
}
};
t.prototype.changeOneBlockInfo = function(e, t, r, o) {
if (o === hs.BlocksProducerType.ID9 || o === hs.BlocksProducerType.ID13) {
this._pureColors[e] = r;
this.createBigBlock(e, t, r, o);
}
};
t.prototype.createBigBlock = function(e, t, r, o) {
return c(this, void 0, void 0, function() {
var n, i, c, s;
return a(this, function(a) {
switch (a.label) {
case 0:
return this._uiNode ? [ 3, 2 ] : [ 4, hs.ResLoader.asyncLoadByBundle(h.ChapterBlockSizeByProducerDefine.BundleName, "prefabs/ChapterChangeBlockSizeByProducerUI", cc.Prefab) ];

case 1:
n = a.sent();
this._uiNode = cc.instantiate(n);
a.label = 2;

case 2:
if (!cc.isValid(t.node)) return [ 2 ];
for (i = 0; i < t.caches.length; i++) if (c = t.caches[i].getComponent(hs.Block)) {
c.block.spriteFrame = null;
c.setLastColorValue("#FFFFFF");
}
(s = cc.instantiate(this._uiNode.getChildByName("Gems" + r))).active = !0;
s.zIndex = 100;
s.setPosition(cc.v2(0, 0));
s.scale = o === hs.BlocksProducerType.ID9 ? .66 : 1;
t.node.addChild(s);
this._bigBlockNodes.set(e, s);
return [ 2 ];
}
});
});
};
t.prototype.getPureGemColor = function(e) {
var t = e.state.itemColors;
if (!hs.AlgorithmPosType[e.state.id] || hs.AlgorithmPosType[e.state.id].length !== Object.keys(t).length) return -1;
var r = t[0];
for (var o in t) t[o] !== r && (r = -1);
return r;
};
t.prototype.playEffect = function(e, t, r) {
return c(this, void 0, void 0, function() {
var o, n, i, c, s;
return a(this, function(a) {
switch (a.label) {
case 0:
if (this._animPrefab) return [ 3, 2 ];
o = this;
return [ 4, hs.ResLoader.asyncLoadByBundle(h.ChapterBlockSizeByProducerDefine.BundleName, "prefabs/ChapterChangeBlockSizeByProducerAnim", cc.Prefab) ];

case 1:
o._animPrefab = a.sent();
a.label = 2;

case 2:
(n = cc.instantiate(this._animPrefab)).parent = hs.gameEffectLayer;
i = e.node.convertToWorldSpaceAR(cc.v2(0, 0));
c = n.convertToNodeSpaceAR(i);
n.setPosition(c);
null == (s = n.getComponent(u.default)) || s.setState({
id: t,
color: this._pureColors[r]
});
return [ 2 ];
}
});
});
};
t.prototype.destroyBigBlocks = function() {
if (this._bigBlockNodes) {
this._bigBlockNodes.forEach(function(e) {
cc.isValid(e) && e.destroy();
});
this._bigBlockNodes.clear();
}
};
t.prototype.destroyOneBigBlock = function(e) {
var t = this._bigBlockNodes.get(e);
cc.isValid(t) && t.destroy();
this._bigBlockNodes.delete(e);
};
return i([ classId("ChangeBlockSizeByProducerTrait") ], t);
}(Trait);
r.ChangeBlockSizeByProducerTrait = d;
cc._RF.pop();
}, {
"./component/ChapterChangeBlockSizeByProducerCom": "ChapterChangeBlockSizeByProducerCom",
"./interface/IChapterBlockSizeByProducer": "IChapterBlockSizeByProducer"
} ],
ChapterChangeBlockSizeByProducerCom: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "71e476TthxOd5idi7XcZ/sq", "ChapterChangeBlockSizeByProducerCom");
var o, n = this && this.__extends || (o = function(e, t) {
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
}), i = this && this.__decorate || function(e, t, r, o) {
var n, i = arguments.length, c = i < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(e, t, r, o); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (c = (i < 3 ? n(c) : i > 3 ? n(t, r, c) : n(t, r)) || c);
return i > 3 && c && Object.defineProperty(t, r, c), c;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var c = e("../interface/IChapterBlockSizeByProducer"), a = cc._decorator, s = a.ccclass, l = a.property, u = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.armature01 = null;
t.armature02 = null;
t.attachParentNode = null;
t._slotNode = null;
return t;
}
t.prototype.onLoad = function() {
var e;
null === (e = this.armature02) || void 0 === e || e.addEventListener(dragonBones.EventObject.COMPLETE, this.onComplete, this);
};
t.prototype.render = function() {
var e = this, t = "textures/Gems" + this.state.color;
hs.ResLoader.loadByBundle(c.ChapterBlockSizeByProducerDefine.BundleName, t, cc.SpriteFrame, function(t, r) {
if (!t) {
e.armature01.playAnimation("in_1", 1);
e.armature02.playAnimation("in_2", 1);
e.replaceSpecificSlot(r);
}
});
};
t.prototype.onDisable = function() {
var e;
null === (e = this.armature02) || void 0 === e || e.removeEventListener(dragonBones.EventObject.COMPLETE, this.onComplete, this);
if (this._slotNode) {
this._slotNode.destroy();
this._slotNode = null;
}
};
t.prototype.replaceSpecificSlot = function(e) {
this._slotNode = new cc.Node();
this._slotNode.addComponent(cc.Sprite).spriteFrame = e;
this._slotNode.setContentSize(e.getOriginalSize());
this._slotNode.scale = .3;
this.attachParentNode.addChild(this._slotNode);
};
t.prototype.onComplete = function() {
this.node.destroy();
};
i([ l(dragonBones.ArmatureDisplay) ], t.prototype, "armature01", void 0);
i([ l(dragonBones.ArmatureDisplay) ], t.prototype, "armature02", void 0);
i([ l(cc.Node) ], t.prototype, "attachParentNode", void 0);
return i([ s ], t);
}(hs.Component);
r.default = u;
cc._RF.pop();
}, {
"../interface/IChapterBlockSizeByProducer": "IChapterBlockSizeByProducer"
} ],
IChapterBlockSizeByProducer: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "6fc3cBC06tMsJsiYJe0vjpI", "IChapterBlockSizeByProducer");
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ChapterBlockSizeByProducerDefine = void 0;
var o = function() {
function e() {}
e.BundleName = "ChangeBlockSizeByProducerTrait";
return e;
}();
r.ChapterBlockSizeByProducerDefine = o;
cc._RF.pop();
}, {} ]
}, {}, [ "ChangeBlockSizeByProducerTrait", "ChapterChangeBlockSizeByProducerCom", "IChapterBlockSizeByProducer" ]);
//# sourceMappingURL=index.js.map
