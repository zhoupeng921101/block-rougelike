window.__require = function e(t, n, o) {
function r(i, s) {
if (!n[i]) {
if (!t[i]) {
var c = i.split("/");
c = c[c.length - 1];
if (!t[c]) {
var l = "function" == typeof __require && __require;
if (!s && l) return l(c, !0);
if (a) return a(c, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = c;
}
var p = n[i] = {
exports: {}
};
t[i][0].call(p.exports, function(e) {
return r(t[i][1][e] || e);
}, p, p.exports, e, t, n, o);
}
return n[i].exports;
}
for (var a = "function" == typeof __require && __require, i = 0; i < o.length; i++) r(o[i]);
return r;
}({
IsOpenChangeSkinNotChangeBlockTrait: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "dc0c9TLSlBFGp65tUYXhxkx", "IsOpenChangeSkinNotChangeBlockTrait");
var o, r = this && this.__extends || (o = function(e, t) {
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
}), a = this && this.__decorate || function(e, t, n, o) {
var r, a = arguments.length, i = a < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, n) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(e, t, n, o); else for (var s = e.length - 1; s >= 0; s--) (r = e[s]) && (i = (a < 3 ? r(i) : a > 3 ? r(t, n, i) : r(t, n)) || i);
return a > 3 && i && Object.defineProperty(t, n, i), i;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.IsOpenChangeSkinNotChangeBlockTrait = void 0;
var i = function(e) {
r(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassSkin_Board_Proxy",
methodName: "OnGameStart"
}, {
className: "ChapterSkin_Board_Proxy",
methodName: "OnGameStart"
} ];
};
t.prototype.onActive = function(e) {
var t;
(hs.tp.isCTSkinBonesTraitOnPlayRowEliminateEffects(e) || hs.tp.isCTSkinBonesTraitOnPlayColumnEliminateEffects(e) || hs.tp.isCTSkinBonesTraitOnPlayEncourage(e) || hs.tp.isCTSkinBonesTraitOnLoadGemsBlockSpriteFrame(e) || hs.tp.isCTSkinBonesTraitOnLoadOtherCollectionSpriteFrame(e) || hs.tp.isCTClassSkinBonesTraitOnPlayComboTips(e)) && hs.gameInfo.gameMode === hs.GameMode.Class && (e.returnState = !0);
if (hs.tp.isCTSkinBonesTraitOnBoard(e) && hs.gameInfo.gameMode === hs.GameMode.Class) {
e.returnState = !0;
var n = e.args[0];
if (n) {
var o = n.getChildByName("SkinBoard");
o && (o.active = !1);
var r = n.getComponent(cc.Sprite);
r && (r.enabled = !0);
}
}
hs.tp.isCTClassSkinBonesTraitOnPlayCombo(e) && hs.gameInfo.gameMode === hs.GameMode.Class && (e.returnState = !0);
hs.tp.isClassSkin_Board_ProxyOnGameStart(e) && hs.skinInfo.restoreBlockColorValueMap();
hs.tp.isCTSkinBonesTraitOnLoadBlockSpriteFrame(e) && hs.gameInfo.gameMode === hs.GameMode.Class && (e.returnState = !0);
hs.tp.isChapterSkin_Board_ProxyOnGameStart(e) && ((null === (t = TRAIT("TravelNoSkinTrait")) || void 0 === t ? void 0 : t.active) ? hs.skinInfo.restoreBlockColorValueMap() : hs.skinInfo.upDataBlockColorValueMap());
};
return a([ classId("IsOpenChangeSkinNotChangeBlockTrait") ], t);
}(Trait);
n.IsOpenChangeSkinNotChangeBlockTrait = i;
cc._RF.pop();
}, {} ]
}, {}, [ "IsOpenChangeSkinNotChangeBlockTrait" ]);
//# sourceMappingURL=index.js.map
