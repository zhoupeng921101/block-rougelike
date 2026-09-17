window.__require = function e(t, n, o) {
function i(a, s) {
if (!n[a]) {
if (!t[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!t[c]) {
var l = "function" == typeof __require && __require;
if (!s && l) return l(c, !0);
if (r) return r(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var u = n[a] = {
exports: {}
};
t[a][0].call(u.exports, function(e) {
return i(t[a][1][e] || e);
}, u, u.exports, e, t, n, o);
}
return n[a].exports;
}
for (var r = "function" == typeof __require && __require, a = 0; a < o.length; a++) i(o[a]);
return i;
}({
UEExplorePopViewGuideComponent: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "bd2156oE0ROJrcN3gN5x/gF", "UEExplorePopViewGuideComponent");
var o, i = this && this.__extends || (o = function(e, t) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
o(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), r = this && this.__decorate || function(e, t, n, o) {
var i, r = arguments.length, a = r < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, n) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, o); else for (var s = e.length - 1; s >= 0; s--) (i = e[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(t, n, a) : i(t, n)) || a);
return r > 3 && a && Object.defineProperty(t, n, a), a;
}, a = this && this.__awaiter || function(e, t, n, o) {
return new (n || (n = Promise))(function(i, r) {
function a(e) {
try {
c(o.next(e));
} catch (e) {
r(e);
}
}
function s(e) {
try {
c(o.throw(e));
} catch (e) {
r(e);
}
}
function c(e) {
e.done ? i(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, s);
var t;
}
c((o = o.apply(e, t || [])).next());
});
}, s = this && this.__generator || function(e, t) {
var n, o, i, r, a = {
label: 0,
sent: function() {
if (1 & i[0]) throw i[1];
return i[1];
},
trys: [],
ops: []
};
return r = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function s(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(r) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, o && (i = 2 & r[0] ? o.return : r[0] ? o.throw || ((i = o.return) && i.call(o), 
0) : o.next) && !(i = i.call(o, r[1])).done) return i;
(o = 0, i) && (r = [ 2 & r[0], i.value ]);
switch (r[0]) {
case 0:
case 1:
i = r;
break;

case 4:
a.label++;
return {
value: r[1],
done: !1
};

case 5:
a.label++;
o = r[1];
r = [ 0 ];
continue;

case 7:
r = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(i = a.trys, i = i.length > 0 && i[i.length - 1]) && (6 === r[0] || 2 === r[0])) {
a = 0;
continue;
}
if (3 === r[0] && (!i || r[1] > i[0] && r[1] < i[3])) {
a.label = r[1];
break;
}
if (6 === r[0] && a.label < i[1]) {
a.label = i[1];
i = r;
break;
}
if (i && a.label < i[2]) {
a.label = i[2];
a.ops.push(r);
break;
}
i[2] && a.ops.pop();
a.trys.pop();
continue;
}
r = t.call(e, a);
} catch (e) {
r = [ 6, e ];
o = 0;
} finally {
n = i = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
var c = cc._decorator, l = c.ccclass, u = c.property, f = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.skeleton = null;
t.labScore = null;
t.animations = [ "1hang", "3hang" ];
t.currentAnimation = 0;
t.excellentY = 400;
t.elmininateCenter = cc.v2(0, 300);
t.labScoreOffY = 300;
return t;
}
t.prototype.onLoad = function() {
this.skeleton.setCompleteListener(this.onAnimationComplete.bind(this));
this.skeleton.setEventListener(this.onFrameEvent.bind(this));
this.labScore.opacity = 0;
};
t.prototype.render = function() {
this.currentAnimation = 0;
this.playAnimation(this.animations[this.currentAnimation]);
};
t.prototype.onClickClose = function() {
hs.UI.hide(this);
};
t.prototype.playAnimation = function(e) {
this.skeleton.timeScale = 1 / (cc.director._kSpeed || 1);
this.skeleton.setAnimation(0, e, !1);
};
t.prototype.onFrameEvent = function() {
0 === this.currentAnimation ? this.playElminationEffect(this.state.singleEffect, "yellow_elimination_A", cc.v2(0, 230)) : this.playMultipleElminationEffect();
};
t.prototype.playElminationEffect = function(e, t, n) {
e.node.parent != this.node && this.node.addChild(e.node);
e.playAnimation(t, 1);
e.node.scale = .7;
e.node.x = n.x;
e.node.y = n.y;
};
t.prototype.onAnimationComplete = function() {
this.currentAnimation = (this.currentAnimation + 1) % this.animations.length;
this.playAnimation(this.animations[this.currentAnimation]);
};
t.prototype.playMultipleElminationEffect = function() {
return a(this, void 0, void 0, function() {
var e, t, n, o = this;
return s(this, function(i) {
switch (i.label) {
case 0:
this.playElminationEffect(this.state.colorfulEffect[0], "colour_elimination_A", cc.v2(0, 300));
this.playElminationEffect(this.state.colorfulEffect[1], "colour_elimination_A", cc.v2(0, 226));
this.playElminationEffect(this.state.colorfulEffect[2], "colour_elimination_A", cc.v2(0, 152));
return [ 4, hs.UI.show(hs.PrefabConfig.Encourage, this.node) ];

case 1:
e = i.sent();
if (!(cc.isValid(this.node) && cc.isValid(e) && cc.isValid(this.labScore) && cc.isValid(this.labScore.parent))) return [ 2 ];
e.setPosition(0, 0);
t = e.getComponent("Encourage");
n = null == t ? void 0 : t.getComponent(dragonBones.ArmatureDisplay);
if (!cc.isValid(null == n ? void 0 : n.node)) return [ 2 ];
n.node.parent = this.node;
n.node.setPosition(0, this.excellentY);
cc.isValid(n.node) && n.playAnimation("excellect_yellow", 1);
this.labScore.scale = 0;
this.labScore.opacity = 0;
this.labScore.setPosition(0, this.labScoreOffY);
this.labScore.setSiblingIndex(this.labScore.parent.children.length);
cc.tween(this.labScore).to(.3, {
opacity: 255,
scale: 1
}, {
easing: cc.easing.backInOut
}).delay(.6).to(.1, {
opacity: 0,
scale: .5
}, {
easing: cc.easing.sineOut
}).call(function() {
o.labScore.scale = 0;
o.labScore.opacity = 0;
}).start();
return [ 2 ];
}
});
});
};
r([ u(sp.Skeleton) ], t.prototype, "skeleton", void 0);
r([ u(cc.Node) ], t.prototype, "labScore", void 0);
return r([ l ], t);
}(hs.Component);
n.default = f;
cc._RF.pop();
}, {} ],
UEExplorePopViewGuideTrait: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "5f9f8r6/OtCbbdq2+foO7hZ", "UEExplorePopViewGuideTrait");
var o, i = this && this.__extends || (o = function(e, t) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
o(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), r = this && this.__decorate || function(e, t, n, o) {
var i, r = arguments.length, a = r < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, n) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, o); else for (var s = e.length - 1; s >= 0; s--) (i = e[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(t, n, a) : i(t, n)) || a);
return r > 3 && a && Object.defineProperty(t, n, a), a;
}, a = this && this.__awaiter || function(e, t, n, o) {
return new (n || (n = Promise))(function(i, r) {
function a(e) {
try {
c(o.next(e));
} catch (e) {
r(e);
}
}
function s(e) {
try {
c(o.throw(e));
} catch (e) {
r(e);
}
}
function c(e) {
e.done ? i(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, s);
var t;
}
c((o = o.apply(e, t || [])).next());
});
}, s = this && this.__generator || function(e, t) {
var n, o, i, r, a = {
label: 0,
sent: function() {
if (1 & i[0]) throw i[1];
return i[1];
},
trys: [],
ops: []
};
return r = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function s(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(r) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, o && (i = 2 & r[0] ? o.return : r[0] ? o.throw || ((i = o.return) && i.call(o), 
0) : o.next) && !(i = i.call(o, r[1])).done) return i;
(o = 0, i) && (r = [ 2 & r[0], i.value ]);
switch (r[0]) {
case 0:
case 1:
i = r;
break;

case 4:
a.label++;
return {
value: r[1],
done: !1
};

case 5:
a.label++;
o = r[1];
r = [ 0 ];
continue;

case 7:
r = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(i = a.trys, i = i.length > 0 && i[i.length - 1]) && (6 === r[0] || 2 === r[0])) {
a = 0;
continue;
}
if (3 === r[0] && (!i || r[1] > i[0] && r[1] < i[3])) {
a.label = r[1];
break;
}
if (6 === r[0] && a.label < i[1]) {
a.label = i[1];
i = r;
break;
}
if (i && a.label < i[2]) {
a.label = i[2];
a.ops.push(r);
break;
}
i[2] && a.ops.pop();
a.trys.pop();
continue;
}
r = t.call(e, a);
} catch (e) {
r = [ 6, e ];
o = 0;
} finally {
n = i = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
}, c = this && this.__read || function(e, t) {
var n = "function" == typeof Symbol && e[Symbol.iterator];
if (!n) return e;
var o, i, r = n.call(e), a = [];
try {
for (;(void 0 === t || t-- > 0) && !(o = r.next()).done; ) a.push(o.value);
} catch (e) {
i = {
error: e
};
} finally {
try {
o && !o.done && (n = r.return) && n.call(r);
} finally {
if (i) throw i.error;
}
}
return a;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.UEExplorePopViewGuideTrait = void 0;
var l = e("./UEExplorePopViewGuideComponent"), u = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._loadingPromise = null;
t._singleEffect = null;
t._colorfulEffect = null;
t._popView = null;
t._hasShowed = !1;
return t;
}
t.prototype.onCreate = function() {
this._hasShowed || this.loadRes();
};
t.prototype.onActive = function(e) {
if (hs.tp.isClassGuide_ProxyInitTraits(e) && !storage.getItem("isFinishedGuide", !1)) {
storage.setItem("isFinishedGuide", !0);
storage.setItem("classGuideStep", storage.getItem("classGuideTotalStep", 3));
storage.setItem("classFaceBlocks", hs.boardInfo.NULL);
storage.setItem("classProducerBlocks", []);
}
hs.tp.isClassGuide_ProxyOnGameStart(e) && (this._hasShowed || this.showGuide());
};
t.prototype.showGuide = function() {
return a(this, void 0, void 0, function() {
var e;
return s(this, function(t) {
switch (t.label) {
case 0:
return [ 4, this.loadRes() ];

case 1:
t.sent();
return null == this._singleEffect || null == this._colorfulEffect ? [ 2 ] : [ 4, hs.UI.show({
name: this.traitName,
bundleName: this.traitName,
url: "prefabs/popView"
}, hs.uiLayer) ];

case 2:
e = t.sent();
if (cc.isValid(e)) {
this._popView = e.getComponent(l.default);
this._popView.setState({
singleEffect: this._singleEffect,
colorfulEffect: this._colorfulEffect
});
this._hasShowed = !0;
}
return [ 2 ];
}
});
});
};
t.prototype.loadRes = function() {
var e = this;
if (null != this._loadingPromise) return this._loadingPromise;
if (cc.isValid(this._singleEffect)) return Promise.resolve();
this._loadingPromise = Promise.all([ hs.ResLoader.asyncLoadByBundle(hs.MainDragonBonesConfig.comboRainbowEffectEliminate2.bundleName, hs.MainDragonBonesConfig.comboRainbowEffectEliminate2.dragonAssetUrl, dragonBones.DragonBonesAsset), hs.ResLoader.asyncLoadByBundle(hs.MainDragonBonesConfig.comboRainbowEffectEliminate2.bundleName, hs.MainDragonBonesConfig.comboRainbowEffectEliminate2.dragonAtlasAssetUrl, dragonBones.DragonBonesAtlasAsset), hs.ResLoader.asyncLoadByBundle(hs.MainDragonBonesConfig.comboRainbowEffectEliminate1.bundleName, hs.MainDragonBonesConfig.comboRainbowEffectEliminate1.dragonAssetUrl, dragonBones.DragonBonesAsset), hs.ResLoader.asyncLoadByBundle(hs.MainDragonBonesConfig.comboRainbowEffectEliminate1.bundleName, hs.MainDragonBonesConfig.comboRainbowEffectEliminate1.dragonAtlasAssetUrl, dragonBones.DragonBonesAtlasAsset), hs.ResLoader.asyncLoadByBundle(this.traitName, "prefabs/popView", cc.Prefab) ]).then(function(t) {
var n = c(t, 5), o = n[0], i = n[1], r = n[2], a = n[3];
n[4];
null != o && null != i && (e._singleEffect = e.createEliEffect(o, i));
null != r && null != a && (e._colorfulEffect = [ e.createEliEffect(r, a), e.createEliEffect(r, a), e.createEliEffect(r, a) ]);
}).catch(function() {});
return this._loadingPromise;
};
t.prototype.createEliEffect = function(e, t) {
var n = new cc.Node().addComponent(dragonBones.ArmatureDisplay);
n.enableBatch = !0;
n.setAnimationCacheMode(dragonBones.ArmatureDisplay.AnimationCacheMode.REALTIME);
n.dragonAsset = e;
n.dragonAtlasAsset = t;
n.armatureName = "Armature";
return n;
};
r([ hs.storageProperty({
key: "UEExplorePopViewGuideTrait_hasShowed"
}) ], t.prototype, "_hasShowed", void 0);
return r([ classId("UEExplorePopViewGuideTrait") ], t);
}(Trait);
n.UEExplorePopViewGuideTrait = u;
cc._RF.pop();
}, {
"./UEExplorePopViewGuideComponent": "UEExplorePopViewGuideComponent"
} ]
}, {}, [ "UEExplorePopViewGuideComponent", "UEExplorePopViewGuideTrait" ]);
//# sourceMappingURL=index.js.map
