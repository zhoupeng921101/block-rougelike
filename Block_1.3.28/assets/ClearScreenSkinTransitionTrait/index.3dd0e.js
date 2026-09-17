window.__require = function e(t, r, n) {
function i(a, c) {
if (!r[a]) {
if (!t[a]) {
var s = a.split("/");
s = s[s.length - 1];
if (!t[s]) {
var l = "function" == typeof __require && __require;
if (!c && l) return l(s, !0);
if (o) return o(s, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = s;
}
var u = r[a] = {
exports: {}
};
t[a][0].call(u.exports, function(e) {
return i(t[a][1][e] || e);
}, u, u.exports, e, t, r, n);
}
return r[a].exports;
}
for (var o = "function" == typeof __require && __require, a = 0; a < n.length; a++) i(n[a]);
return i;
}({
ClearScreenSkinTransitionComp: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "d557cSwgHJNqqW39GFhrX4J", "ClearScreenSkinTransitionComp");
var n, i = this && this.__extends || (n = function(e, t) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
n(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), o = this && this.__decorate || function(e, t, r, n) {
var i, o = arguments.length, a = o < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, r) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, n); else for (var c = e.length - 1; c >= 0; c--) (i = e[c]) && (a = (o < 3 ? i(a) : o > 3 ? i(t, r, a) : i(t, r)) || a);
return o > 3 && a && Object.defineProperty(t, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var a = e("../../../../../scripts/base/components/Component"), c = e("../../../../../scripts/modules/skin/vo/SkinInfo"), s = cc._decorator, l = s.ccclass, u = s.property, p = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.armatureDisplay = null;
return t;
}
t.prototype.render = function() {
var e = this.state, t = e.animationName, r = e.callback;
if (t && this.armatureDisplay) {
"in_2" === t && this.applySkinColor();
this.playAnimation(t, r);
}
};
t.prototype.playAnimation = function(e, t) {
if (this.armatureDisplay) {
this.armatureDisplay.playAnimation(e, 1);
t && this.armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, t, this);
}
};
t.prototype.applySkinColor = function() {
var e = this.getSkinColorConfig("board_out_line", this.state.targetSkinId);
e && this.applyColorToArmature(e);
};
t.prototype.getSkinColorConfig = function(e, t) {
var r;
if (t) {
var n = c.skinInfo.getSkinInfoBySkinId(t);
if (n && "board_out_line" === e) return n.board_out_line || null;
}
return "board_out_line" === e && (null === (r = c.skinInfo.boardSkinInfo) || void 0 === r ? void 0 : r.board_out_line) || null;
};
t.prototype.applyColorToArmature = function(e) {
if (this.armatureDisplay && e) {
var t = e.color.colorParam;
if (t) {
var r = new cc.Color().fromHEX(t);
this.armatureDisplay.node.color = r;
this.armatureDisplay.node.opacity = e.opacity || 255;
}
}
};
o([ u(dragonBones.ArmatureDisplay) ], t.prototype, "armatureDisplay", void 0);
return o([ l ], t);
}(a.default);
r.default = p;
cc._RF.pop();
}, {
"../../../../../scripts/base/components/Component": void 0,
"../../../../../scripts/modules/skin/vo/SkinInfo": void 0
} ],
ClearScreenSkinTransitionTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "ae23emSBSxE7JFhtxSrFpjt", "ClearScreenSkinTransitionTrait");
var n, i = this && this.__extends || (n = function(e, t) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
n(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), o = this && this.__decorate || function(e, t, r, n) {
var i, o = arguments.length, a = o < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, r) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, n); else for (var c = e.length - 1; c >= 0; c--) (i = e[c]) && (a = (o < 3 ? i(a) : o > 3 ? i(t, r, a) : i(t, r)) || a);
return o > 3 && a && Object.defineProperty(t, r, a), a;
}, a = this && this.__awaiter || function(e, t, r, n) {
return new (r || (r = Promise))(function(i, o) {
function a(e) {
try {
s(n.next(e));
} catch (e) {
o(e);
}
}
function c(e) {
try {
s(n.throw(e));
} catch (e) {
o(e);
}
}
function s(e) {
e.done ? i(e.value) : (t = e.value, t instanceof r ? t : new r(function(e) {
e(t);
})).then(a, c);
var t;
}
s((n = n.apply(e, t || [])).next());
});
}, c = this && this.__generator || function(e, t) {
var r, n, i, o, a = {
label: 0,
sent: function() {
if (1 & i[0]) throw i[1];
return i[1];
},
trys: [],
ops: []
};
return o = {
next: c(0),
throw: c(1),
return: c(2)
}, "function" == typeof Symbol && (o[Symbol.iterator] = function() {
return this;
}), o;
function c(e) {
return function(t) {
return s([ e, t ]);
};
}
function s(o) {
if (r) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (r = 1, n && (i = 2 & o[0] ? n.return : o[0] ? n.throw || ((i = n.return) && i.call(n), 
0) : n.next) && !(i = i.call(n, o[1])).done) return i;
(n = 0, i) && (o = [ 2 & o[0], i.value ]);
switch (o[0]) {
case 0:
case 1:
i = o;
break;

case 4:
a.label++;
return {
value: o[1],
done: !1
};

case 5:
a.label++;
n = o[1];
o = [ 0 ];
continue;

case 7:
o = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(i = a.trys, i = i.length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
a = 0;
continue;
}
if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
a.label = o[1];
break;
}
if (6 === o[0] && a.label < i[1]) {
a.label = i[1];
i = o;
break;
}
if (i && a.label < i[2]) {
a.label = i[2];
a.ops.push(o);
break;
}
i[2] && a.ops.pop();
a.trys.pop();
continue;
}
o = t.call(e, a);
} catch (e) {
o = [ 6, e ];
n = 0;
} finally {
r = i = 0;
}
if (5 & o[0]) throw o[1];
return {
value: o[0] ? o[1] : void 0,
done: !0
};
}
}, s = this && this.__read || function(e, t) {
var r = "function" == typeof Symbol && e[Symbol.iterator];
if (!r) return e;
var n, i, o = r.call(e), a = [];
try {
for (;(void 0 === t || t-- > 0) && !(n = o.next()).done; ) a.push(n.value);
} catch (e) {
i = {
error: e
};
} finally {
try {
n && !n.done && (r = o.return) && r.call(o);
} finally {
if (i) throw i.error;
}
}
return a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ClearScreenSkinTransitionTrait = void 0;
var l = e("./ClearScreenSkinTransitionComp"), u = e("./ClearScreenWipeEffect"), p = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._prefab = null;
t._material = null;
t._targetSkinId = null;
return t;
}
r = t;
t.prototype.onActive = function(e) {
return a(this, void 0, void 0, function() {
var t, r, n, i, o;
return c(this, function(a) {
switch (a.label) {
case 0:
return hs.tp.isClassSkin_ProxyOnReadyComplete(e) ? [ 4, this.preloadPrefab() ] : [ 3, 2 ];

case 1:
a.sent();
a.label = 2;

case 2:
if (!hs.tp.isCleanSceneUseSequenceSkinTraitSendChangeSkinEvent(e)) return [ 3, 4 ];
e.replace = !0;
t = s(e.args, 1);
if (!(r = t[0])) return [ 3, 4 ];
this._targetSkinId = "" + r;
return [ 4, this.playAni() ];

case 3:
a.sent();
this.sendChangeSkin(r);
a.label = 4;

case 4:
if (!hs.tp.isCleanSceneRandomSkinTraitSendChangeSkinEvent(e)) return [ 3, 6 ];
e.replace = !0;
n = s(e.args, 1);
if (!((i = n[0]) && i[0] && i[0].ID)) return [ 3, 6 ];
this._targetSkinId = "" + i[0].ID;
return [ 4, this.playAni() ];

case 5:
a.sent();
this.sendChangeSkin(i[0].ID);
a.label = 6;

case 6:
hs.tp.isClassBoardSplashAnimation_ProxySetBoardSplashAnimationState(e) && (null == (o = TRAIT("IsComboEffNewTrait")) ? void 0 : o.active) && (e.args[4] = hs.BoardSplashAnimationPlayType.UP_UP);
return [ 2 ];
}
});
});
};
t.prototype.sendChangeSkin = function(e) {
hs.EventManager.dispatchModuleEvent(new hs.E_Skin_Update("" + e));
};
t.prototype.preloadPrefab = function() {
return a(this, void 0, void 0, function() {
var e, t;
return c(this, function(r) {
switch (r.label) {
case 0:
if (this._prefab && this._material) return [ 2 ];
r.label = 1;

case 1:
r.trys.push([ 1, 4, , 5 ]);
e = this;
return [ 4, hs.ResLoader.asyncLoadByBundle("ClearScreenSkinTransitionTrait", "prefabs/ClearScreenSkinTransition", cc.Prefab) ];

case 2:
e._prefab = r.sent();
t = this;
return [ 4, hs.ResLoader.asyncLoadByBundle("ClearScreenSkinTransitionTrait", "shader/swipe", cc.Material) ];

case 3:
t._material = r.sent();
return [ 3, 5 ];

case 4:
r.sent();
return [ 3, 5 ];

case 5:
return [ 2 ];
}
});
});
};
t.prototype.playAni = function() {
return a(this, void 0, void 0, function() {
var e, t, r, n;
return c(this, function(i) {
switch (i.label) {
case 0:
return this._prefab && this._material ? [ 3, 2 ] : [ 4, this.preloadPrefab() ];

case 1:
i.sent();
if (!this._prefab || !this._material) return [ 2 ];
i.label = 2;

case 2:
e = Cinst(hs.ClassGame);
t = null;
r = null;
n = -1;
if (!cc.isValid(e)) return [ 2 ];
i.label = 3;

case 3:
i.trys.push([ 3, 8, , 9 ]);
cc.isValid(e.blocksProducerContainer) && (n = e.blocksProducerContainer.getSiblingIndex());
return [ 4, this.prepareGameNodeForCapture(e) ];

case 4:
t = i.sent();
if (!this.checkClonedNode(t)) {
cc.isValid(t) && t.destroy();
this.restoreBlocksProducerLayer(e, n);
return [ 2 ];
}
return [ 4, this.captureNodeToSprite(t) ];

case 5:
r = i.sent();
if (!cc.isValid(t) || !cc.isValid(r)) {
this.restoreBlocksProducerLayer(e, n);
return [ 2 ];
}
this.addScreenshotToScene(r, e);
return [ 4, this.screenWipeEffect(r) ];

case 6:
i.sent();
return [ 4, this.playAnimationSequence(e, n) ];

case 7:
i.sent();
return [ 3, 9 ];

case 8:
i.sent();
this.restoreBlocksProducerLayer(e, n);
return [ 3, 9 ];

case 9:
return [ 2 ];
}
});
});
};
t.prototype.checkClonedNode = function(e) {
if (!cc.isValid(e)) return !1;
try {
var t = e.getChildByName("blocksProducerContainer");
if (!cc.isValid(t)) return !1;
var r = t.getChildByName("BlockProducer");
if (!cc.isValid(r)) return !1;
var n = r.getChildByName("blocksContainer");
if (!cc.isValid(n)) return !1;
var i = n.children.filter(function(e) {
return "BlockProducerItem" === e.name && cc.isValid(e);
});
if (0 === i.length) return !1;
var o = i[0].getChildByName("Block");
if (!cc.isValid(o)) return !1;
var a = o.getChildByName("block");
if (!cc.isValid(a)) return !1;
var c = a.getComponent(cc.Sprite);
if (!c) return !1;
var s = c.getMaterial(0);
return !!s && s.name !== hs.skinBlockMaterialName;
} catch (e) {
return !1;
}
};
t.prototype.screenWipeEffect = function(e) {
return a(this, void 0, void 0, function() {
return c(this, function(t) {
switch (t.label) {
case 0:
return this._material ? [ 3, 2 ] : [ 4, this.preloadPrefab() ];

case 1:
t.sent();
if (!this._material) return [ 2 ];
t.label = 2;

case 2:
e.addComponent(u.ClearScreenWipeEffect).setState({
material: this._material,
sprite: e.getComponent(cc.Sprite)
});
return [ 2 ];
}
});
});
};
t.prototype.restoreBlocksProducerLayer = function(e, t) {
cc.isValid(e) && cc.isValid(e.blocksProducerContainer) && t >= 0 && e.blocksProducerContainer.setSiblingIndex(t);
};
t.prototype.prepareGameNodeForCapture = function(e) {
var t = this;
return new Promise(function(n, i) {
if (cc.isValid(e) && cc.isValid(e.node)) try {
var o = new cc.Node("ScreenshotContainer");
o.setContentSize(e.node.getContentSize());
o.setPosition(e.node.getPosition());
o.setAnchorPoint(e.node.getAnchorPoint());
for (var a = [ e.bgContainer, e.boardContainer, e.blocksProducerContainer ], c = 0; c < r.CONTAINERS_TO_CLONE.length; c++) {
var s = a[c], l = r.CONTAINERS_TO_CLONE[c].name;
if (cc.isValid(s)) {
var u = cc.instantiate(s);
if (cc.isValid(u)) {
u.name = l;
t.copyNodeProperties(u, s);
t.removeSpecificComponents(u, l);
o.addChild(u);
}
}
}
o.setParent(hs.sceneLayer);
o.setPosition(-5e3, -5e3);
n(o);
} catch (e) {
i(e);
} else i(new Error("ClearScreenSkinTransitionTrait ClassGame节点无效"));
});
};
t.prototype.copyNodeProperties = function(e, t) {
e.setPosition(t.getPosition());
e.setContentSize(t.getContentSize());
e.setAnchorPoint(t.getAnchorPoint());
e.setScale(t.scaleX, t.scaleY);
e.opacity = t.opacity;
e.active = t.active;
};
t.prototype.removeSpecificComponents = function(e, t) {
if (cc.isValid(e)) try {
var n = r.COMPONENT_REMOVAL_MAP[t];
n && this.removeComponentByType(e, t, n);
if ("boardContainer" === t) {
this.removeDragonBonesNodes(e);
this.removeBoardEffectLayers(e);
}
} catch (e) {}
};
t.prototype.removeBoardEffectLayers = function(e) {
if (cc.isValid(e)) {
var t = e.getChildByName("Board");
if (cc.isValid(t)) for (var r = [ "blockUnderPreEliminate", "EliminateEffectLayer", "blockOverPreEliminate" ], n = 0; n < r.length; n++) {
var i = r[n], o = t.getChildByName(i);
cc.isValid(o) && o.destroy();
}
}
};
t.prototype.removeDragonBonesNodes = function(e) {
if (cc.isValid(e)) {
var t = [];
e.children.forEach(function(e) {
cc.isValid(e) && e.getComponent(dragonBones.ArmatureDisplay) && t.push(e);
});
t.forEach(function(e) {
cc.isValid(e) && e.destroy();
});
}
};
t.prototype.removeComponentByType = function(e, t, r) {
var n = {
bgContainer: "SkinGameBg",
boardContainer: "Board",
blocksProducerContainer: "BlockProducer"
}[t];
if (n) {
var i = e.getChildByName(n);
if (cc.isValid(i)) {
var o = i.getComponent(r);
o && i.removeComponent(o);
}
}
};
t.prototype.captureNodeToSprite = function(e) {
return a(this, void 0, Promise, function() {
var t, r, n, i, o, a, s;
return c(this, function(c) {
switch (c.label) {
case 0:
t = hs.sceneLayer;
if (!cc.isValid(e) || !cc.isValid(t)) return [ 2, null ];
r = null;
c.label = 1;

case 1:
c.trys.push([ 1, 3, , 4 ]);
n = e.getContentSize();
(i = new cc.RenderTexture()).initWithSize(n.width, n.height);
(r = new cc.Node("CaptureCamera")).width = n.width;
r.height = n.height;
t.addChild(r);
o = r.addComponent(cc.Camera);
r.setPosition(e.x, e.y);
o.alignWithScreen = !1;
o.ortho = !0;
o.targetTexture = i;
o.orthoSize = n.height / 2;
o.cullingMask = 4294967295;
return [ 4, hs.skinAtlasInfo.waitForAfterDraw() ];

case 2:
c.sent();
o.render(e);
i.getImpl();
(a = new cc.SpriteFrame(i)).setFlipX(!1);
a.setFlipY(!0);
(s = new cc.Node("CapturedSprite")).addComponent(cc.Sprite).spriteFrame = a;
s.setContentSize(n);
cc.isValid(r) && r.destroy();
cc.isValid(e) && e.destroy();
return [ 2, s ];

case 3:
c.sent();
cc.isValid(r) && r.destroy();
cc.isValid(e) && e.destroy();
return [ 2, null ];

case 4:
return [ 2 ];
}
});
});
};
t.prototype.addScreenshotToScene = function(e, t) {
if (cc.isValid(e) && cc.isValid(t)) {
e.name = "ScreenShotNode";
if (cc.isValid(t.topContainer)) {
var r = t.topContainer.getSiblingIndex();
t.node.addChild(e);
e.setSiblingIndex(r);
} else t.node.addChild(e);
e.setPosition(0, 0);
if (cc.isValid(t.blocksProducerContainer)) {
var n = e.getSiblingIndex();
t.blocksProducerContainer.setSiblingIndex(n - 1);
}
}
};
t.prototype.playAnimationSequence = function(e, t) {
return a(this, void 0, Promise, function() {
var n, i, o, a, s, u, p = this;
return c(this, function(c) {
switch (c.label) {
case 0:
return this._prefab ? [ 3, 2 ] : [ 4, this.preloadPrefab() ];

case 1:
c.sent();
if (!this._prefab) {
this.restoreBlocksProducerLayer(e, t);
return [ 2 ];
}
c.label = 2;

case 2:
if (!cc.isValid(e)) {
this.restoreBlocksProducerLayer(e, t);
return [ 2 ];
}
n = new Array(r.ANIMATION_NAMES.length);
for (i = 0; i < r.ANIMATION_NAMES.length; i++) {
o = r.ANIMATION_NAMES[i];
(a = cc.instantiate(this._prefab)).setPosition(0, 0);
a.name = "Animation_" + o;
(s = a.getComponent(l.default)) && (n[i] = {
node: a,
component: s,
animationName: o
});
}
u = new cc.Node();
cc.tween(u).delay(.5).call(function() {
p.playRemainingAnimations(n, e.node);
p.restoreBlocksProducerLayer(e, t);
cc.isValid(u) && u.destroy();
}).start();
return [ 2 ];
}
});
});
};
t.prototype.playRemainingAnimations = function(e, t) {
for (var r = function(r) {
var i = e[r];
if (i && i.component) {
i.node.parent = t;
i.component.setState({
animationName: i.animationName,
targetSkinId: n._targetSkinId,
callback: function() {
i.node.destroy();
}
});
}
}, n = this, i = 0; i < e.length; i++) r(i);
e.sort(function(e, t) {
return e.node.getSiblingIndex() - t.node.getSiblingIndex();
});
};
var r;
t.CONTAINERS_TO_CLONE = [ {
name: "bgContainer"
}, {
name: "boardContainer"
}, {
name: "blocksProducerContainer"
} ];
t.ANIMATION_NAMES = [ "in_2", "in_3" ];
t.COMPONENT_REMOVAL_MAP = {
bgContainer: "SkinGameBgComponent",
boardContainer: "Board",
blocksProducerContainer: "BlocksProducer"
};
return r = o([ classId("ClearScreenSkinTransitionTrait") ], t);
}(Trait);
r.ClearScreenSkinTransitionTrait = p;
cc._RF.pop();
}, {
"./ClearScreenSkinTransitionComp": "ClearScreenSkinTransitionComp",
"./ClearScreenWipeEffect": "ClearScreenWipeEffect"
} ],
ClearScreenWipeEffect: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "a38a9xKgfpBFJ4uWWoMzPIJ", "ClearScreenWipeEffect");
var n, i = this && this.__extends || (n = function(e, t) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
n(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), o = this && this.__decorate || function(e, t, r, n) {
var i, o = arguments.length, a = o < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, r) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, n); else for (var c = e.length - 1; c >= 0; c--) (i = e[c]) && (a = (o < 3 ? i(a) : o > 3 ? i(t, r, a) : i(t, r)) || a);
return o > 3 && a && Object.defineProperty(t, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ClearScreenWipeEffect = void 0;
var a = e("../../../../../scripts/base/components/Component"), c = cc._decorator, s = c.ccclass, l = (c.property, 
function(e) {
i(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.render = function() {
if (cc.isValid(this.state.sprite) && this.state.material) {
this.state.sprite.setMaterial(0, this.state.material);
this.playEraseEffect();
}
};
t.prototype.playEraseEffect = function() {
var e = this;
if (this.state.material) {
this.state.material.setProperty("eraseProgress", 0);
this.state.material.setProperty("edgeSoftness", .1);
var t = {
progress: 1
};
cc.tween(t).to(1.5, {
progress: 0
}, {
easing: "sineInOut",
progress: function(r, n, i, o) {
e.state && e.state.material && cc.isValid(e.node) ? e.state.material.setProperty("eraseProgress", o) : cc.Tween.stopAllByTarget(t);
}
}).call(function() {
if (cc.isValid(e.node)) {
e.node.destroy();
cc.Tween.stopAllByTarget(t);
}
}).start();
}
};
t.prototype.onDestroy = function() {
this.unscheduleAllCallbacks();
};
return o([ s ], t);
}(a.default));
r.ClearScreenWipeEffect = l;
cc._RF.pop();
}, {
"../../../../../scripts/base/components/Component": void 0
} ]
}, {}, [ "ClearScreenSkinTransitionComp", "ClearScreenSkinTransitionTrait", "ClearScreenWipeEffect" ]);
//# sourceMappingURL=index.js.map
