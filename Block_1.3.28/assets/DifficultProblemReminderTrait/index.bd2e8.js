window.__require = function e(n, t, o) {
function i(a, s) {
if (!t[a]) {
if (!n[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!n[c]) {
var d = "function" == typeof __require && __require;
if (!s && d) return d(c, !0);
if (r) return r(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var l = t[a] = {
exports: {}
};
n[a][0].call(l.exports, function(e) {
return i(n[a][1][e] || e);
}, l, l.exports, e, n, t, o);
}
return t[a].exports;
}
for (var r = "function" == typeof __require && __require, a = 0; a < o.length; a++) i(o[a]);
return i;
}({
DifficultProblemReminderTrait: [ function(e, n, t) {
"use strict";
cc._RF.push(n, "b147fh1J8pPXKZpPuSglUCq", "DifficultProblemReminderTrait");
var o, i = this && this.__extends || (o = function(e, n) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, n) {
e.__proto__ = n;
} || function(e, n) {
for (var t in n) Object.prototype.hasOwnProperty.call(n, t) && (e[t] = n[t]);
})(e, n);
}, function(e, n) {
o(e, n);
function t() {
this.constructor = e;
}
e.prototype = null === n ? Object.create(n) : (t.prototype = n.prototype, new t());
}), r = this && this.__decorate || function(e, n, t, o) {
var i, r = arguments.length, a = r < 3 ? n : null === o ? o = Object.getOwnPropertyDescriptor(n, t) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, n, t, o); else for (var s = e.length - 1; s >= 0; s--) (i = e[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(n, t, a) : i(n, t)) || a);
return r > 3 && a && Object.defineProperty(n, t, a), a;
};
Object.defineProperty(t, "__esModule", {
value: !0
});
t.DifficultProblemReminderTrait = void 0;
var a = function(e) {
i(n, e);
function n() {
var n = null !== e && e.apply(this, arguments) || this;
n.dragonBone = null;
return n;
}
n.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassBlocksProducer_Proxy",
methodName: "onGenerateEnd"
}, {
className: "ClassGame_Proxy",
methodName: "onGameBackHome"
}, {
className: "IsOpenChangeSkinTrait",
methodName: "changeSkinBlockCompelet"
} ];
};
n.prototype.onActive = function(e) {
hs.tp.isClassBlocksProducer_ProxyOnGenerateEnd(e) && this._showReminderAnimation();
hs.tp.isClassGame_ProxyOnGameBackHome(e) && this._hideReminderAnimation();
hs.tp.isIsOpenChangeSkinTraitChangeSkinBlockCompelet(e) && this._showReminderAnimation();
};
n.prototype._showReminderAnimation = function() {
var e = this, n = hs.algorithmInfo.getOfferTypeCategory(hs.algorithmName.algoActualId) === hs.algorithmMainType.DIFFICULT, t = this._isRed(hs.skinInfo.gameBgSkinInfo.color.colorParam);
if (n) if (this.dragonBone) {
this.dragonBone.node.active = !0;
this.dragonBone.node.opacity = 255;
this.dragonBone.playAnimation(t ? "in_feng" : "in", 1);
} else {
var o = Cinst(hs.BlocksProducer);
if (cc.isValid(o) && cc.isValid(o.shadersContainer)) {
var i = {
armatureName: "armatureName",
animationName: t ? "in_feng" : "in",
playTimes: 1,
timeScale: 1 / (cc.director._kSpeed || 1)
}, r = hs.dragonbonesAnim.play(o.shadersContainer, i, hs.ClassDragonBonesConfig.difficultProblemReminder);
this.dragonBone = r.getComponent(dragonBones.ArmatureDisplay);
this.dragonBone.addEventListener(dragonBones.EventObject.COMPLETE, this._onComplete, this);
}
} else if (this.dragonBone && cc.isValid(this.dragonBone.node)) if (hs.scoreInfo.score > 0) cc.tween(this.dragonBone.node).to(.16, {
opacity: 0
}).call(function() {
e.dragonBone.node.opacity = 255;
e.dragonBone.node.active = !1;
}).start(); else {
this.dragonBone.node.opacity = 255;
this.dragonBone.node.active = !1;
}
};
n.prototype._hideReminderAnimation = function() {
if (this.dragonBone && cc.isValid(this.dragonBone.node)) {
this.dragonBone.node.opacity = 0;
this.dragonBone.node.active = !1;
}
};
n.prototype._onComplete = function() {
"in" !== this.dragonBone.animationName && "in_feng" !== this.dragonBone.animationName || this.dragonBone.playAnimation("in_feng" === this.dragonBone.animationName ? "init_feng" : "init", 0);
};
n.prototype._rgbToHsv = function(e) {
var n = e.replace("#", ""), t = parseInt(n.substring(0, 2), 16) / 255, o = parseInt(n.substring(2, 4), 16) / 255, i = parseInt(n.substring(4, 6), 16) / 255, r = Math.max(t, o, i), a = r - Math.min(t, o, i), s = 0, c = 0;
0 !== r && (c = a / r);
0 !== a && (s = r === t ? (o - i) / a % 6 * 60 : r === o ? 60 * ((i - t) / a + 2) : 60 * ((t - o) / a + 4)) < 0 && (s += 360);
return {
h: s,
s: c,
v: r
};
};
n.prototype._isRed = function(e) {
var n = this._rgbToHsv(e), t = n.h, o = n.s, i = n.v;
return (t >= 0 && t <= 10 || t >= 350 && t <= 360) && o >= .3 && i >= .2;
};
return r([ classId("DifficultProblemReminderTrait") ], n);
}(Trait);
t.DifficultProblemReminderTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "DifficultProblemReminderTrait" ]);
//# sourceMappingURL=index.js.map
