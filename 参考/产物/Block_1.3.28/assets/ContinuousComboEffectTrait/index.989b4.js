window.__require = function e(t, o, n) {
function a(i, r) {
if (!o[i]) {
if (!t[i]) {
var l = i.split("/");
l = l[l.length - 1];
if (!t[l]) {
var s = "function" == typeof __require && __require;
if (!r && s) return s(l, !0);
if (c) return c(l, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = l;
}
var u = o[i] = {
exports: {}
};
t[i][0].call(u.exports, function(e) {
return a(t[i][1][e] || e);
}, u, u.exports, e, t, o, n);
}
return o[i].exports;
}
for (var c = "function" == typeof __require && __require, i = 0; i < n.length; i++) a(n[i]);
return a;
}({
ContinuousComboEffectTrait: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "66b57rUDlJD/asu2Ky/V8LQ", "ContinuousComboEffectTrait");
var n, a = this && this.__extends || (n = function(e, t) {
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
var a, c = arguments.length, i = c < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(e, t, o, n); else for (var r = e.length - 1; r >= 0; r--) (a = e[r]) && (i = (c < 3 ? a(i) : c > 3 ? a(t, o, i) : a(t, o)) || i);
return c > 3 && i && Object.defineProperty(t, o, i), i;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.ContinuousComboEffectTrait = void 0;
var i = function(e) {
a(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.num = 0;
return t;
}
t.prototype.onActive = function(e) {
if (hs.tp.isClassCombo_ProxyOnTouchEnd(e)) {
var t = e.args[0].state, o = t.eliminateCount, n = t.continuousEliminateTimes;
o > 0 && n > 1 ? this.num++ : this.num = 0;
}
if (hs.tp.isComboBaseChangeAnim(e)) {
var a = e.target;
if (this.num > 1) {
cc.Tween.stopAllByTarget(a.combo);
a.combo.opacity = 255;
this.playCombo(a.combo, function() {
hs.UI.hide(a);
});
cc.Tween.stopAllByTarget(a.countLabel.node);
a.countLabel.node.opacity = 255;
this.playCombo(a.countLabel.node);
this.playShadow(a, 1, 39);
this.playShadow(a, 2, -39);
} else {
a.combo.opacity = 255;
a.countLabel.node.opacity = 255;
}
}
if (hs.tp.isSkinComboComponentChangeAnim(e)) {
var c = e.target;
if (this.num > 1) {
cc.Tween.stopAllByTarget(c.comboBgNode);
c.comboBgNode.opacity = 255;
this.playCombo(c.comboBgNode, function() {
hs.UI.hide(c);
});
cc.Tween.stopAllByTarget(c.numBgLabel.node);
c.numBgLabel.node.opacity = 255;
this.playCombo(c.numBgLabel.node);
this.playSkinShadow(c, 1, 39);
this.playSkinShadow(c, 2, -39);
}
}
};
t.prototype.playCombo = function(e, t) {
var o, n = null !== (o = cc.director._kSpeed) && void 0 !== o ? o : 1, a = cc.tween(e).to(.1 * n, {
scale: 1.2
}, {
easing: cc.easing.circOut
}).to(.33 * n, {
scale: .85
}, {
easing: cc.easing.cubicIn
}).to(.17 * n, {
scale: 1
}, {
easing: cc.easing.sineInOut
}).delay(.33 * n).to(.1 * n, {
scale: .5,
opacity: 0
}, {
easing: cc.easing.circOut
});
t && a.call(t);
a.start();
};
t.prototype.playShadow = function(e, t, o) {
var n, a = "ContinuousComboShadow" + t, c = e.node.getChildByName(a);
if (!cc.isValid(c)) {
(c = new cc.Node()).name = a;
var i = cc.instantiate(e.combo);
i.name = "combo";
i.scale = 1;
i.setParent(c);
var r = cc.instantiate(e.countLabel.node);
r.name = "countLabel";
r.scale = 1;
r.setParent(c);
var l = cc.instantiate(e.effects.node);
l.name = "effects";
l.setParent(c);
e.node.addChild(c);
c.setSiblingIndex(0);
}
var s = null !== (n = cc.director._kSpeed) && void 0 !== n ? n : 1;
cc.Tween.stopAllByTarget(c);
c.x = 0;
c.y = 0;
c.opacity = 0;
cc.tween(c).delay(.26 * s).set({
y: o
}).to(.34 * s, {
y: 0
}).start();
cc.tween(c).to(.1 * s, {
opacity: 96.9
}).delay(.33 * s).to(.17 * s, {
opacity: 0
}).start();
var u = c.getChildByName("countLabel");
u.getComponent(cc.Label).string = e.countLabel.string;
var d = c.getChildByName("effects").getComponent(dragonBones.ArmatureDisplay);
d.node.active = !1;
cc.tween(c).delay(.05).call(function() {
d.node.x = u.x + u.width / 2;
}).delay(.08).call(function() {
d.node.active = !0;
d.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("newAnimation", 1);
}).start();
};
t.prototype.playSkinShadow = function(e, t, o) {
var n, a = "ContinuousComboShadow" + t, c = e.node.getChildByName(a);
if (!cc.isValid(c)) {
(c = new cc.Node()).name = a;
var i = cc.instantiate(e.comboBgNode);
i.name = "combo";
i.scale = 1;
i.setParent(c);
var r = cc.instantiate(e.numBgLabel.node);
r.name = "countLabel";
r.scale = 1;
r.setParent(c);
var l = cc.instantiate(e.bone.node);
l.name = "effects";
l.setParent(c);
e.node.addChild(c);
c.setSiblingIndex(0);
}
var s = c.getChildByName("combo");
s.color = e.comboBgNode.color;
s.opacity = e.comboBgNode.opacity;
s.children[0].color = e.comboNode.color;
s.children[0].opacity = e.comboNode.opacity;
var u = c.getChildByName("countLabel");
u.getComponent(cc.Label).string = e.numBgLabel.string;
u.color = e.numBgLabel.node.color;
u.opacity = e.numBgLabel.node.opacity;
u.children[0].getComponent(cc.Label).string = e.numLabel.string;
u.children[0].color = e.numLabel.node.color;
u.children[0].opacity = e.numLabel.node.opacity;
var d = null !== (n = cc.director._kSpeed) && void 0 !== n ? n : 1;
cc.Tween.stopAllByTarget(c);
c.x = 0;
c.y = 0;
c.opacity = 0;
cc.tween(c).delay(.26 * d).set({
y: o
}).to(.34 * d, {
y: 0
}).start();
cc.tween(c).to(.1 * d, {
opacity: 96.9
}).delay(.33 * d).to(.17 * d, {
opacity: 0
}).start();
var p = c.getChildByName("effects").getComponent(dragonBones.ArmatureDisplay);
p.node.active = !1;
cc.tween(c).delay(.05).call(function() {
p.node.x = u.x + u.width / 2;
}).delay(.08).call(function() {
p.node.active = !0;
p.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("newAnimation", 1);
}).start();
};
c([ hs.storageProperty({
key: "ContinuousComboEffectTrait_num"
}) ], t.prototype, "num", void 0);
return c([ classId("ContinuousComboEffectTrait") ], t);
}(Trait);
o.ContinuousComboEffectTrait = i;
cc._RF.pop();
}, {} ]
}, {}, [ "ContinuousComboEffectTrait" ]);
//# sourceMappingURL=index.js.map
