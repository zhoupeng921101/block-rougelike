window.__require = function e(t, r, o) {
function n(l, a) {
if (!r[l]) {
if (!t[l]) {
var s = l.split("/");
s = s[s.length - 1];
if (!t[s]) {
var u = "function" == typeof __require && __require;
if (!a && u) return u(s, !0);
if (i) return i(s, !0);
throw new Error("Cannot find module '" + l + "'");
}
l = s;
}
var c = r[l] = {
exports: {}
};
t[l][0].call(c.exports, function(e) {
return n(t[l][1][e] || e);
}, c, c.exports, e, t, r, o);
}
return r[l].exports;
}
for (var i = "function" == typeof __require && __require, l = 0; l < o.length; l++) n(o[l]);
return n;
}({
DualColorSkinByRoundWithClearSwapTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "2c020WhNWtOCpf5DORR1fuN", "DualColorSkinByRoundWithClearSwapTrait");
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
var n, i = arguments.length, l = i < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) l = Reflect.decorate(e, t, r, o); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (l = (i < 3 ? n(l) : i > 3 ? n(t, r, l) : n(t, r)) || l);
return i > 3 && l && Object.defineProperty(t, r, l), l;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.DualColorSkinByRoundWithClearSwapTrait = void 0;
var l = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._skinPool = [];
return t;
}
t.prototype.onActive = function(e) {
if (hs.tp.isSkin_ProxyIsSameSkinId(e) && this.isMergeBlocksMode()) {
e.returnValue = !1;
e.replace = !0;
}
if (hs.tp.isDualColorSkinByRoundTraitGetSkinPool(e) && this.isMergeBlocksMode()) {
e.returnValue = this.getSkinPool();
e.replace = !0;
}
if (hs.tp.isCleanSceneUseSequenceSkinTraitGetSkinId(e) && this.isMergeBlocksMode()) {
e.returnValue = hs.skinInfo.currentSkinId;
e.replace = !0;
e.returnState = !0;
}
if (hs.tp.isCleanSceneUseSequenceSkinTraitGetIsTrigger(e) && this.isMergeBlocksMode()) {
e.returnValue = !0;
e.returnState = !0;
e.replace = !0;
}
if (hs.tp.isCleanSceneRandomSkinTraitGetIsTrigger(e) && this.isMergeBlocksMode()) {
e.returnValue = !1;
e.returnState = !0;
e.replace = !0;
}
};
t.prototype.getSkinPool = function() {
if (this._skinPool && 0 === this._skinPool.length) {
var e = TRAIT("DualColorSkinSelectorTrait");
if (!(null == e ? void 0 : e.active)) return [];
var t = e.getSkinPool();
t && t.length > 0 && (this._skinPool = t.filter(function(t) {
return e.getSkinGroups(String(t.ID)).length >= 3;
}));
}
return this._skinPool;
};
t.prototype.isMergeBlocksClassMode = function() {
var e = TRAIT("DualColorSkinSelectorTrait");
return !(null == e || !e.active) && e.isClassMode();
};
t.prototype.isMergeBlocksMode = function() {
return !(hs.gameInfo.gameMode !== hs.GameMode.MergeBlocks && !this.isMergeBlocksClassMode());
};
return i([ classId("DualColorSkinByRoundWithClearSwapTrait") ], t);
}(Trait);
r.DualColorSkinByRoundWithClearSwapTrait = l;
cc._RF.pop();
}, {} ]
}, {}, [ "DualColorSkinByRoundWithClearSwapTrait" ]);
//# sourceMappingURL=index.js.map
