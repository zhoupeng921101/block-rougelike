window.__require = function e(t, r, o) {
function i(a, s) {
if (!r[a]) {
if (!t[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!t[c]) {
var f = "function" == typeof __require && __require;
if (!s && f) return f(c, !0);
if (n) return n(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var h = r[a] = {
exports: {}
};
t[a][0].call(h.exports, function(e) {
return i(t[a][1][e] || e);
}, h, h.exports, e, t, r, o);
}
return r[a].exports;
}
for (var n = "function" == typeof __require && __require, a = 0; a < o.length; a++) i(o[a]);
return i;
}({
ChapterReviveWithComboTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "7d2b1vg5WlNT5ipVWZGNy4f", "ChapterReviveWithComboTrait");
var o, i = this && this.__extends || (o = function(e, t) {
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
}), n = this && this.__decorate || function(e, t, r, o) {
var i, n = arguments.length, a = n < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, o); else for (var s = e.length - 1; s >= 0; s--) (i = e[s]) && (a = (n < 3 ? i(a) : n > 3 ? i(t, r, a) : i(t, r)) || a);
return n > 3 && a && Object.defineProperty(t, r, a), a;
}, a = this && this.__awaiter || function(e, t, r, o) {
return new (r || (r = Promise))(function(i, n) {
function a(e) {
try {
c(o.next(e));
} catch (e) {
n(e);
}
}
function s(e) {
try {
c(o.throw(e));
} catch (e) {
n(e);
}
}
function c(e) {
e.done ? i(e.value) : (t = e.value, t instanceof r ? t : new r(function(e) {
e(t);
})).then(a, s);
var t;
}
c((o = o.apply(e, t || [])).next());
});
}, s = this && this.__generator || function(e, t) {
var r, o, i, n, a = {
label: 0,
sent: function() {
if (1 & i[0]) throw i[1];
return i[1];
},
trys: [],
ops: []
};
return n = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (n[Symbol.iterator] = function() {
return this;
}), n;
function s(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(n) {
if (r) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (r = 1, o && (i = 2 & n[0] ? o.return : n[0] ? o.throw || ((i = o.return) && i.call(o), 
0) : o.next) && !(i = i.call(o, n[1])).done) return i;
(o = 0, i) && (n = [ 2 & n[0], i.value ]);
switch (n[0]) {
case 0:
case 1:
i = n;
break;

case 4:
a.label++;
return {
value: n[1],
done: !1
};

case 5:
a.label++;
o = n[1];
n = [ 0 ];
continue;

case 7:
n = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(i = a.trys, i = i.length > 0 && i[i.length - 1]) && (6 === n[0] || 2 === n[0])) {
a = 0;
continue;
}
if (3 === n[0] && (!i || n[1] > i[0] && n[1] < i[3])) {
a.label = n[1];
break;
}
if (6 === n[0] && a.label < i[1]) {
a.label = i[1];
i = n;
break;
}
if (i && a.label < i[2]) {
a.label = i[2];
a.ops.push(n);
break;
}
i[2] && a.ops.pop();
a.trys.pop();
continue;
}
n = t.call(e, a);
} catch (e) {
n = [ 6, e ];
o = 0;
} finally {
r = i = 0;
}
if (5 & n[0]) throw n[1];
return {
value: n[0] ? n[1] : void 0,
done: !0
};
}
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ChapterReviveWithComboTrait = void 0;
var c = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.dragon_asset = null;
t.dragon_atlas_asset = null;
t._dragonEffect = null;
t._serverTimeoutBarrier = new hs.TimeoutBarrier(2e3);
t.BUNDLE_NAME = "ChapterReviveWithComboTrait";
t.DRAGON_ASSET_PREFIX = "effects/shipinbt";
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ChapterGame_Proxy",
methodName: "onGameEndData"
}, {
className: "ChapterGame_Proxy",
methodName: "onChapterGameShow"
}, {
className: "Revive",
methodName: "resetReviveView"
} ];
};
t.prototype.onActive = function(e) {
if (hs.tp.isChapterGame_ProxyOnChapterGameShow(e) && this.hasScoreChapter()) {
this.preloadAsset();
this.isTriggerReVive && hs.chapterComboInfo.setComboState(!0);
}
hs.tp.isReviveResetReviveView(e) && this.setActiveEffect(!1);
if (hs.tp.isReviveEffectPlayAnimation(e)) if (this.hasScoreChapter()) {
var t = e.target, r = t.effect, o = t.btn;
this.playEffect(r, o);
e.replace = !0;
} else this.setActiveEffect(!1);
if (hs.tp.isReviveOnBtnActionCompleted(e) && cc.isValid(this._dragonEffect) && this._dragonEffect.node.active) {
r = e.target.effect;
cc.isValid(r) && (r.active = !1);
}
hs.tp.isChapterGame_ProxyOnGameEndData(e) && this.setComboState(!1);
if (hs.tp.isChapterScoreInfoComputeComboStateScore(e) && this.hasScoreChapter() && this.isTriggerReVive) {
var i = e.args[0], n = e.args[1];
(0 === n || isNaN(n) || void 0 === n) && (n = 1);
this.playShake(i, n);
e.returnValue = this.computedComboScore(i, n);
e.replace = !0;
}
};
t.prototype.hasScoreChapter = function() {
var e, t;
if (hs.gameInfo.gameMode === hs.GameMode.Chapter) {
var r = null === (t = null === (e = hs.chapterConfigInfo.getChapterCurData()) || void 0 === e ? void 0 : e.Condition) || void 0 === t ? void 0 : t.Way;
if (null == r) {
this.setActiveEffect(!1);
return !1;
}
if (r === hs.ChapterType.score) return !0;
}
this.setActiveEffect(!1);
return !1;
};
t.prototype.playEffect = function(e, t) {
return a(this, void 0, void 0, function() {
var r, o, i = this;
return s(this, function(n) {
switch (n.label) {
case 0:
return this._serverTimeoutBarrier.isOpen ? [ 3, 2 ] : [ 4, this._serverTimeoutBarrier.wait() ];

case 1:
n.sent();
n.label = 2;

case 2:
if (!cc.isValid(this.dragon_asset) || !cc.isValid(this.dragon_atlas_asset) || !cc.isValid(t)) return [ 2 ];
e.active = !1;
if (!this._dragonEffect || !cc.isValid(this._dragonEffect)) {
this._dragonEffect = new cc.Node("effect2").addComponent(dragonBones.ArmatureDisplay);
this._dragonEffect.node.setParent(t);
this._dragonEffect.node.setContentSize(cc.size(623.32, 165.65));
this._dragonEffect.node.position = e.position;
this._dragonEffect.dragonAsset = this.dragon_asset;
this._dragonEffect.dragonAtlasAsset = this.dragon_atlas_asset;
this._dragonEffect.armatureName = "armatureName";
(r = new cc.Node("TouchArea")).setParent(this._dragonEffect.node);
r.setContentSize(this._dragonEffect.node.getContentSize());
(o = r.addComponent(cc.Sprite)).spriteFrame = new cc.SpriteFrame();
o.sizeMode = cc.Sprite.SizeMode.CUSTOM;
r.addComponent(cc.Button);
r.on(cc.Node.EventType.TOUCH_END, function(e) {
i.setComboState();
var t = Cinst(hs.Revive);
null == t || t.onClick(e, {});
}, this);
}
this._dragonEffect.node.position = e.position;
this._dragonEffect.playAnimation("init", 0);
this.setActiveEffect();
return [ 2 ];
}
});
});
};
t.prototype.setActiveEffect = function(e) {
void 0 === e && (e = !0);
cc.isValid(this._dragonEffect) && (this._dragonEffect.node.active = e);
};
t.prototype.setComboState = function(e) {
void 0 === e && (e = !0);
this.isTriggerReVive = e;
hs.chapterComboInfo.setComboState(this.isTriggerReVive);
if (e) {
var t = Cinst(hs.BlocksProducerTouch);
t && t.reset();
}
};
t.prototype.playShake = function(e, t) {
e > 0 && (3 === t ? hs.shake.start(.15) : t > 3 && hs.shake.start(.3));
};
t.prototype.computedComboScore = function(e, t) {
var r = 0;
r = 1 === e ? 10 * t : 10 * t * e * (e - 1);
t >= 11 ? r *= 2 : t >= 6 && (r = Math.ceil(1.5 * r));
return r;
};
t.prototype.preloadAsset = function() {
var e = this;
hs.ResLoader.loadByBundle(this.BUNDLE_NAME, this.DRAGON_ASSET_PREFIX + "_ske", dragonBones.DragonBonesAsset, function(t, r) {
if (!t) {
e.dragon_asset = r;
e.dragon_atlas_asset && e._serverTimeoutBarrier.open();
}
});
hs.ResLoader.loadByBundle(this.BUNDLE_NAME, this.DRAGON_ASSET_PREFIX + "_tex", dragonBones.DragonBonesAtlasAsset, function(t, r) {
if (!t) {
e.dragon_atlas_asset = r;
e.dragon_asset && e._serverTimeoutBarrier.open();
}
});
};
n([ hs.cacheProperty(!1) ], t.prototype, "isTriggerReVive", void 0);
return n([ classId("ChapterReviveWithComboTrait") ], t);
}(Trait);
r.ChapterReviveWithComboTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "ChapterReviveWithComboTrait" ]);
//# sourceMappingURL=index.js.map
