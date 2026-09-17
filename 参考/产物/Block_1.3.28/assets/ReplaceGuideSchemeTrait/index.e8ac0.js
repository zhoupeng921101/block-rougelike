window.__require = function e(t, n, o) {
function i(a, c) {
if (!n[a]) {
if (!t[a]) {
var l = a.split("/");
l = l[l.length - 1];
if (!t[l]) {
var s = "function" == typeof __require && __require;
if (!c && s) return s(l, !0);
if (r) return r(l, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = l;
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
ReplaceGuideSchemeComp: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "7e53a9mEp1MWoExzgqEaY08", "ReplaceGuideSchemeComp");
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
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, o); else for (var c = e.length - 1; c >= 0; c--) (i = e[c]) && (a = (r < 3 ? i(a) : r > 3 ? i(t, n, a) : i(t, n)) || a);
return r > 3 && a && Object.defineProperty(t, n, a), a;
}, a = this && this.__awaiter || function(e, t, n, o) {
return new (n || (n = Promise))(function(i, r) {
function a(e) {
try {
l(o.next(e));
} catch (e) {
r(e);
}
}
function c(e) {
try {
l(o.throw(e));
} catch (e) {
r(e);
}
}
function l(e) {
e.done ? i(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, c);
var t;
}
l((o = o.apply(e, t || [])).next());
});
}, c = this && this.__generator || function(e, t) {
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
next: c(0),
throw: c(1),
return: c(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function c(e) {
return function(t) {
return l([ e, t ]);
};
}
function l(r) {
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
var l = cc._decorator, s = l.ccclass, u = l.property, f = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.skeleton = null;
t.labScore = null;
t.playBtn = null;
return t;
}
t.prototype.onLoad = function() {
this.skeleton && this.skeleton.setEventListener(this.onFrameEvent.bind(this));
this.labScore && (this.labScore.opacity = 0);
if (this.playBtn) {
this.playBtn.opacity = 0;
this.playBtn.on(cc.Node.EventType.TOUCH_END, this.onClickPlay, this);
}
this.playAnimation("in");
};
t.prototype.onDestroy = function() {
this.playBtn && this.playBtn.off(cc.Node.EventType.TOUCH_END, this.onClickPlay, this);
};
t.prototype.playAnimation = function(e) {
if (this.skeleton && cc.isValid(this.skeleton)) {
this.skeleton.timeScale = 1 / (cc.director._kSpeed || 1);
this.skeleton.setAnimation(0, e, !1);
}
};
t.prototype.onFrameEvent = function(e, t) {
var n = t.data.name;
"xiaochu1" === n ? this.playElminationEffect(this.state.singleEffect, "yellow_elimination_A", cc.v2(196, 89)) : "xiaochu2" === n && this.playMultipleElminationEffect();
};
t.prototype.playElminationEffect = function(e, t, n) {
if (e && cc.isValid(e.node)) {
e.node.parent !== this.node && this.node.addChild(e.node);
e.playAnimation(t, 1);
e.node.scale = .35;
e.node.opacity = 255;
e.node.x = n.x;
e.node.y = n.y;
}
};
t.prototype.playMultipleElminationEffect = function() {
return a(this, void 0, Promise, function() {
var e, t, n, o = this;
return c(this, function(i) {
switch (i.label) {
case 0:
if (this.state.colorfulEffect && this.state.colorfulEffect.length >= 3) {
this.playElminationEffect(this.state.colorfulEffect[0], "colour_elimination_A", cc.v2(-188, -220));
this.playElminationEffect(this.state.colorfulEffect[1], "colour_elimination_A", cc.v2(-188, -258));
this.playElminationEffect(this.state.colorfulEffect[2], "colour_elimination_A", cc.v2(-188, -296));
}
this.state.colorfulEffect[2] && cc.isValid(this.state.colorfulEffect[2].node) && this.state.colorfulEffect[2].once(dragonBones.EventObject.COMPLETE, function() {
o.playBtn && cc.isValid(o.playBtn) && cc.tween(o.playBtn).to(.3, {
opacity: 255
}).to(.2, {
scale: .9
}).to(.2, {
scale: 1
}).start();
});
return [ 4, hs.UI.show(hs.PrefabConfig.Encourage, this.node) ];

case 1:
(e = i.sent()).setPosition(0, 0);
t = e.getComponent("Encourage");
(n = t.getComponent(dragonBones.ArmatureDisplay)).node.parent = this.node;
n.node.scale = .35;
n.node.setPosition(-188, -250);
cc.isValid(n.node) && n.playAnimation("excellect_yellow", 1);
if (this.labScore && cc.isValid(this.labScore)) {
this.labScore.scale = 0;
this.labScore.opacity = 0;
this.labScore.setPosition(-188, -295);
this.labScore.getComponent(cc.Label).string = "+200";
this.labScore.setSiblingIndex(this.labScore.parent.children.length);
cc.tween(this.labScore).to(.3, {
opacity: 255,
scale: .35
}, {
easing: cc.easing.backInOut
}).delay(.6).to(.1, {
opacity: 0,
scale: .18
}, {
easing: cc.easing.sineOut
}).call(function() {
o.labScore.scale = 0;
o.labScore.opacity = 0;
}).start();
}
return [ 2 ];
}
});
});
};
t.prototype.onClickPlay = function() {
this.node.destroy();
};
r([ u(sp.Skeleton) ], t.prototype, "skeleton", void 0);
r([ u(cc.Node) ], t.prototype, "labScore", void 0);
r([ u(cc.Node) ], t.prototype, "playBtn", void 0);
return r([ s ], t);
}(hs.Component);
n.default = f;
cc._RF.pop();
}, {} ],
ReplaceGuideSchemeTrait: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "a948bLMv1NOSKXbopRhZBrZ", "ReplaceGuideSchemeTrait");
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
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, o); else for (var c = e.length - 1; c >= 0; c--) (i = e[c]) && (a = (r < 3 ? i(a) : r > 3 ? i(t, n, a) : i(t, n)) || a);
return r > 3 && a && Object.defineProperty(t, n, a), a;
}, a = this && this.__awaiter || function(e, t, n, o) {
return new (n || (n = Promise))(function(i, r) {
function a(e) {
try {
l(o.next(e));
} catch (e) {
r(e);
}
}
function c(e) {
try {
l(o.throw(e));
} catch (e) {
r(e);
}
}
function l(e) {
e.done ? i(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, c);
var t;
}
l((o = o.apply(e, t || [])).next());
});
}, c = this && this.__generator || function(e, t) {
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
next: c(0),
throw: c(1),
return: c(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function c(e) {
return function(t) {
return l([ e, t ]);
};
}
function l(r) {
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
}, l = this && this.__values || function(e) {
var t = "function" == typeof Symbol && Symbol.iterator, n = t && e[t], o = 0;
if (n) return n.call(e);
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
Object.defineProperty(n, "__esModule", {
value: !0
});
n.ReplaceGuideSchemeTrait = void 0;
var s = e("./ReplaceGuideSchemeComp"), u = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._needShowGuide = !1;
return t;
}
t.prototype.onActive = function(e) {
if (hs.tp.isLaunch_ProxyOnTraitConfigInitComplete(e) && hs.storage.getItem("classGuideStep", 0) < 3) {
this._needShowGuide = !0;
hs.storage.setItem("classGuideStep", 3);
hs.storage.remove("classFaceBlocks");
hs.storage.remove("classProducerBlocks");
DS("usr_data_guide_3_end");
}
if (hs.tp.isClassGame_ProxyOnClassGameShow(e) && this._needShowGuide) {
this._needShowGuide = !1;
this.showReplaceGuide();
}
};
t.prototype.showReplaceGuide = function() {
var e = this;
hs.ResLoader.loadByBundle("ReplaceGuideSchemeTrait", "prefabs/ReplaceGuideScheme", cc.Prefab, function(t, n) {
return a(e, void 0, void 0, function() {
var e, o, i;
return c(this, function(r) {
switch (r.label) {
case 0:
return t ? [ 2 ] : [ 4, CinstAsync(hs.ClassGame) ];

case 1:
if (!(e = r.sent()) || !cc.isValid(e.node)) return [ 2 ];
o = cc.instantiate(n);
e.node.addChild(o);
o.setPosition(0, 0);
o.zIndex = 9999;
(i = o.getComponent(s.default)) && this.loadEliminationEffects(o, i);
return [ 2 ];
}
});
});
});
};
t.prototype.loadEliminationEffects = function(e, t) {
var n, o;
if (cc.isValid(e) && cc.isValid(null == t ? void 0 : t.node)) {
var i = new cc.Node("SingleEffect");
i.opacity = 0;
e.addChild(i);
for (var r = i.addComponent(dragonBones.ArmatureDisplay), a = [], c = 0; c < 3; c++) {
var s = new cc.Node("ColorfulEffect_" + c);
s.opacity = 0;
e.addChild(s);
var u = s.addComponent(dragonBones.ArmatureDisplay);
a.push(u);
}
hs.ResLoader.renderDragonbonesByBundle({
bundleName: "mainTraits",
dragonBonesArmatureDisplay: r,
dragonAssetUrl: "dragonbones/eliminate/comboRainbow/playgame_elimination_ske",
dragonAtlasAssetUrl: "dragonbones/eliminate/comboRainbow/playgame_elimination_tex",
armatureName: "Armature",
animationName: "yellow_elimination_A",
completeRemove: !1
});
try {
for (var f = l(a), p = f.next(); !p.done; p = f.next()) {
u = p.value;
hs.ResLoader.renderDragonbonesByBundle({
bundleName: "mainTraits",
dragonBonesArmatureDisplay: u,
dragonAssetUrl: "dragonbones/eliminate/comboRainbow/playgame_elimination2_ske",
dragonAtlasAssetUrl: "dragonbones/eliminate/comboRainbow/playgame_elimination2_tex",
armatureName: "Armature",
animationName: "colour_elimination_A",
completeRemove: !1
});
}
} catch (e) {
n = {
error: e
};
} finally {
try {
p && !p.done && (o = f.return) && o.call(f);
} finally {
if (n) throw n.error;
}
}
t.setState({
singleEffect: r,
colorfulEffect: a
});
}
};
return r([ classId("ReplaceGuideSchemeTrait") ], t);
}(Trait);
n.ReplaceGuideSchemeTrait = u;
cc._RF.pop();
}, {
"./ReplaceGuideSchemeComp": "ReplaceGuideSchemeComp"
} ]
}, {}, [ "ReplaceGuideSchemeComp", "ReplaceGuideSchemeTrait" ]);
//# sourceMappingURL=index.js.map
