window.__require = function e(t, n, r) {
function o(a, c) {
if (!n[a]) {
if (!t[a]) {
var l = a.split("/");
l = l[l.length - 1];
if (!t[l]) {
var u = "function" == typeof __require && __require;
if (!c && u) return u(l, !0);
if (i) return i(l, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = l;
}
var s = n[a] = {
exports: {}
};
t[a][0].call(s.exports, function(e) {
return o(t[a][1][e] || e);
}, s, s.exports, e, t, n, r);
}
return n[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < r.length; a++) o(r[a]);
return o;
}({
DualColorSkinByClearBoardTrait: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "c3c20FztkZJ/K1W9y7vRPBP", "DualColorSkinByClearBoardTrait");
var r, o = this && this.__extends || (r = function(e, t) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
r(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), i = this && this.__decorate || function(e, t, n, r) {
var o, i = arguments.length, a = i < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, n) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, r); else for (var c = e.length - 1; c >= 0; c--) (o = e[c]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
return i > 3 && a && Object.defineProperty(t, n, a), a;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.DualColorSkinByClearBoardTrait = void 0;
var a = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._skinPool = [];
return t;
}
Object.defineProperty(t.prototype, "onActiveCondition", {
get: function() {
return hs.gameInfo.gameMode === hs.GameMode.MergeBlocks;
},
enumerable: !1,
configurable: !0
});
t.prototype.onActive = function(e) {
if (hs.tp.isMergeBlocksBoardSplashAnimation_ProxySetBoardSplashAnimationState(e)) {
this.onChangeSkinBySelf();
var t = TRAIT("CleanSceneUseSequenceSkinTrait");
t && t.active && t.changeSkin();
}
if (hs.tp.isCleanSceneUseSequenceSkinTraitShowDontTouchLayer(e)) {
e.returnState = !0;
e.replace = !0;
this.showDontTouchLayer();
}
if (hs.tp.isCleanSceneUseSequenceSkinTraitGetSkinId(e)) {
e.returnValue = this.getNextSkinId();
e.replace = !0;
e.returnState = !0;
}
};
t.prototype.getNextSkinId = function() {
var e = this.getSkinPool();
if (!e || 0 === e.length) return "1000";
var t = this.getSkinIndex();
(t += 1) >= e.length && (t = 0);
this.saveSkinIndex(t);
var n = e[t];
return n ? n.ID.toString() : e[0].ID.toString();
};
t.prototype.getSkinPool = function() {
var e = TRAIT("DualColorSkinSelectorTrait");
return (null == e ? void 0 : e.active) ? e.getSkinPool() : [];
};
t.prototype.getSkinIndex = function() {
return hs.storage.getItem("DualColorSkinByClearBoardTrait_skinIndex", 0);
};
t.prototype.saveSkinIndex = function(e) {
hs.storage.setItem("DualColorSkinByClearBoardTrait_skinIndex", e);
};
t.prototype.showDontTouchLayer = function() {
var e, t = TRAIT("CleanSceneUseSequenceSkinTrait");
if (t && t.active && !t.isUnOpenClearSceneRound(hs.mergeBlocksGameInfo.roundNum)) {
var n = null === (e = Cinst(hs.MergeBlocksGame)) || void 0 === e ? void 0 : e.operator;
if (cc.isValid(n)) {
var r = hs.skinLoadInfo.skinResList.skinDontTouchLayer.asset, o = n.getChildByName("SkinDontTouchLayer");
if (!cc.isValid(o) && r) {
(o = cc.instantiate(r)).name = "SkinDontTouchLayer";
n.addChild(o);
} else cc.isValid(o) && (o.active = !0);
setTimeoutSafe(function() {
t.hideDontTouchLayer();
}, 3e3);
}
}
};
t.prototype.onChangeSkinBySelf = function() {};
return i([ classId("DualColorSkinByClearBoardTrait") ], t);
}(Trait);
n.DualColorSkinByClearBoardTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "DualColorSkinByClearBoardTrait" ]);
//# sourceMappingURL=index.js.map
