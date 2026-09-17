window.__require = function t(e, n, o) {
function r(a, f) {
if (!n[a]) {
if (!e[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!e[c]) {
var p = "function" == typeof __require && __require;
if (!f && p) return p(c, !0);
if (i) return i(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var h = n[a] = {
exports: {}
};
e[a][0].call(h.exports, function(t) {
return r(e[a][1][t] || t);
}, h, h.exports, t, e, n, o);
}
return n[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < o.length; a++) r(o[a]);
return r;
}({
IShowEffectWhenInitEmptyBoard: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "a68f9Nu7TFCP6lkwxSZ8yqq", "IShowEffectWhenInitEmptyBoard");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.IShowEffectWhenInitEmptyBoard = void 0;
var o = function() {
function t() {}
t.Skin_Color_Map = {
1001: 1,
1003: 1,
1020: 2,
1025: 2,
1033: 2,
1016: 2,
1026: 2,
1005: 2,
1013: 2,
1028: 2,
1034: 3,
1036: 3,
1029: 3,
1010: 3,
1024: 4,
1004: 4,
1023: 4,
1031: 4,
1006: 4,
1007: 4,
1008: 4,
1039: 4,
1022: 4,
1018: 5,
1037: 5,
1014: 5,
1011: 5,
1019: 5,
1030: 5,
1027: 6,
1017: 6,
1032: 6,
1002: 7,
1038: 7,
1021: 7,
1015: 7,
1009: 7,
1012: 7,
1035: 7,
1e3: 7
};
t.BundleName = "ShowEffectWhenInitEmptyBoardTrait";
t.showEffectWhenInitEmptyBoard = {
bundleName: t.BundleName,
dragonAssetUrl: "dragonbones/gameplay_emptyNew_ske",
dragonAtlasAssetUrl: "dragonbones/gameplay_emptyNew_tex"
};
return t;
}();
n.IShowEffectWhenInitEmptyBoard = o;
cc._RF.pop();
}, {} ],
ShowEffectWhenInitEmptyBoardTrait: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "0b401te3wZMfoVKpH5htB71", "ShowEffectWhenInitEmptyBoardTrait");
var o, r = this && this.__extends || (o = function(t, e) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
})(t, e);
}, function(t, e) {
o(t, e);
function n() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
}), i = this && this.__decorate || function(t, e, n, o) {
var r, i = arguments.length, a = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o); else for (var f = t.length - 1; f >= 0; f--) (r = t[f]) && (a = (i < 3 ? r(a) : i > 3 ? r(e, n, a) : r(e, n)) || a);
return i > 3 && a && Object.defineProperty(e, n, a), a;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.ShowEffectWhenInitEmptyBoardTrait = void 0;
var a = t("../interface/IShowEffectWhenInitEmptyBoard"), f = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.animTagIndex = 0;
return e;
}
e.prototype.onActive = function(t) {
if ((hs.tp.isBoardSplashAnimation_ProxyOnBoardSplashAnimationEnd(t) || hs.tp.isChapterGame_ProxyOnChapterGoalPlayOver(t)) && hs.boardInfo.isNullBoard()) {
this.playInitEffect();
t.replace = !0;
}
};
e.prototype.playInitEffect = function() {
var t, e = null === (t = Cinst(hs.Board)) || void 0 === t ? void 0 : t.boardGrid;
if (e && cc.isValid(e)) {
var n = {
armatureName: "Armature",
animationName: this.getAnimName(),
playTimes: 1,
completeRemove: !0,
timeScale: this.props.animSpeed
}, o = hs.dragonbonesAnim.play(hs.gameEffectLayer, n, a.IShowEffectWhenInitEmptyBoard.showEffectWhenInitEmptyBoard);
if (o) {
var r = e.convertToWorldSpaceAR(cc.Vec2.ZERO), i = hs.gameEffectLayer.convertToNodeSpaceAR(r);
o.setPosition(i);
}
}
};
e.prototype.getAnimName = function() {
var t, e = [ "a", "b" ], n = e[this.animTagIndex];
this.animTagIndex = (this.animTagIndex + 1) % e.length;
return "in_" + n + "_" + (null !== (t = a.IShowEffectWhenInitEmptyBoard.Skin_Color_Map[hs.skinInfo.currentSkinId]) && void 0 !== t ? t : 7);
};
return i([ classId("ShowEffectWhenInitEmptyBoardTrait") ], e);
}(Trait);
n.ShowEffectWhenInitEmptyBoardTrait = f;
cc._RF.pop();
}, {
"../interface/IShowEffectWhenInitEmptyBoard": "IShowEffectWhenInitEmptyBoard"
} ]
}, {}, [ "IShowEffectWhenInitEmptyBoard", "ShowEffectWhenInitEmptyBoardTrait" ]);
//# sourceMappingURL=index.js.map
