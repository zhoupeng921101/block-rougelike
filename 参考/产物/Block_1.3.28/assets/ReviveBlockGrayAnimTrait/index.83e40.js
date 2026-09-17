window.__require = function e(t, r, n) {
function i(a, s) {
if (!r[a]) {
if (!t[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!t[c]) {
var l = "function" == typeof __require && __require;
if (!s && l) return l(c, !0);
if (o) return o(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var f = r[a] = {
exports: {}
};
t[a][0].call(f.exports, function(e) {
return i(t[a][1][e] || e);
}, f, f.exports, e, t, r, n);
}
return r[a].exports;
}
for (var o = "function" == typeof __require && __require, a = 0; a < n.length; a++) i(n[a]);
return i;
}({
ReviveBlockGrayAnimTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "4be08hYQDVEFYhQqQcBgoy1", "ReviveBlockGrayAnimTrait");
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
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, n); else for (var s = e.length - 1; s >= 0; s--) (i = e[s]) && (a = (o < 3 ? i(a) : o > 3 ? i(t, r, a) : i(t, r)) || a);
return o > 3 && a && Object.defineProperty(t, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ReviveBlockGrayAnimTrait = void 0;
var a = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.grayAnimPrefab = null;
t.grayNodeParent = null;
t.animScale = 1;
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassGame_Proxy",
methodName: "onGameStart"
}, {
className: "ClassRevive_Proxy",
methodName: "onRevive_Success"
}, {
className: "ClassRevive_Proxy",
methodName: "reviveSuccessPostProcessing"
} ];
};
t.prototype.onActive = function(e) {
var t = this;
if (hs.tp.isClassGame_ProxyOnGameStart(e)) {
this.grayNodeParent && this.grayNodeParent.removeAllChildren();
this.grayAnimPrefab || hs.ResLoader.loadByBundle("ReviveBlockGrayAnimTrait", "prefabs/BlockGrayAnim", cc.Prefab, function(e, r) {
e || (t.grayAnimPrefab = r);
});
}
if (hs.tp.isClassRevive_ProxyReviveSuccessPostProcessing(e)) for (var r = hs.boardInfo.faceBlocks, n = function(e) {
for (var n = function(n) {
-1 !== r[e][n] && setTimeoutSafe(function() {
t.createGrayAnim(e, n);
}, 80 * e / i.animScale);
}, o = 0; o < r[e].length; o++) n(o);
}, i = this, o = 0; o < r.length; o++) n(o);
hs.tp.isClassRevive_ProxyOnRevive_Success(e) && this.grayNodeParent && this.grayNodeParent.children.forEach(function(e) {
e.active = !1;
});
};
t.prototype.createGrayAnim = function(e, t) {
var r = Cinst(hs.Board);
if (r && r.node && cc.isValid(r.node)) {
if (!this.grayNodeParent) {
this.grayNodeParent = new cc.Node();
this.grayNodeParent.name = "grayNodeParent";
r.blockOverPreEliminate.addChild(this.grayNodeParent);
this.grayNodeParent.setSiblingIndex(0);
}
var n = this.grayNodeParent.children.find(function(e) {
return !e.active;
});
if (!n) {
n = cc.instantiate(this.grayAnimPrefab);
this.grayNodeParent.addChild(n);
}
n.active = !0;
n.setPosition(hs.boardRendererInfo.blocks[e][t].position);
n.y += 4;
var i = n.getComponent(dragonBones.ArmatureDisplay);
i.timeScale = this.animScale;
i.playAnimation("in", 1);
}
};
return o([ classId("ReviveBlockGrayAnimTrait") ], t);
}(Trait);
r.ReviveBlockGrayAnimTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "ReviveBlockGrayAnimTrait" ]);
//# sourceMappingURL=index.js.map
