window.__require = function e(t, a, r) {
function i(s, o) {
if (!a[s]) {
if (!t[s]) {
var h = s.split("/");
h = h[h.length - 1];
if (!t[h]) {
var c = "function" == typeof __require && __require;
if (!o && c) return c(h, !0);
if (n) return n(h, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = h;
}
var p = a[s] = {
exports: {}
};
t[s][0].call(p.exports, function(e) {
return i(t[s][1][e] || e);
}, p, p.exports, e, t, a, r);
}
return a[s].exports;
}
for (var n = "function" == typeof __require && __require, s = 0; s < r.length; s++) i(r[s]);
return i;
}({
BoardClearChangeSkinTrait: [ function(e, t, a) {
"use strict";
cc._RF.push(t, "7127dD2jXRCmoZfpWjBeZ8N", "BoardClearChangeSkinTrait");
var r, i = this && this.__extends || (r = function(e, t) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var a in t) Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
})(e, t);
}, function(e, t) {
r(e, t);
function a() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (a.prototype = t.prototype, new a());
}), n = this && this.__decorate || function(e, t, a, r) {
var i, n = arguments.length, s = n < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, a) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, a, r); else for (var o = e.length - 1; o >= 0; o--) (i = e[o]) && (s = (n < 3 ? i(s) : n > 3 ? i(t, a, s) : i(t, a)) || s);
return n > 3 && s && Object.defineProperty(t, a, s), s;
};
Object.defineProperty(a, "__esModule", {
value: !0
});
a.BoardClearChangeSkinTrait = void 0;
var s = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.classSaveName = "ClassBoardClearChangeSkin";
t.chapterSaveName = "ChapterBoardClearChangeSkin";
t.saveName = "";
t.boardMap = {};
t.isCanChangeSkin = !1;
t.isSkin = !1;
return t;
}
t.prototype.onActive = function(e) {
this.saveName = hs.gameInfo.gameMode == hs.GameMode.Class ? this.classSaveName : this.chapterSaveName;
hs.tp.isIsOpenChangeSkinTraitBlockParentOpacity(e) && this.isSkin && (e.returnValue = !0);
hs.tp.isIsOpenChangeSkinTraitBlockOpacity(e) && this.isSkin && (e.returnValue = !0);
if (hs.tp.isSkin_BoardClear_ProxyOnBoardReadyComplete(e)) {
if (this.isDeny()) return;
this.isSkin = !1;
this.isCanChangeSkin = !1;
var t = e.args[0].newGame;
this.boardMap = {};
if (t) {
for (var a = hs.boardInfo.faceBlocks, r = 0; r < a.length; r++) for (var i = 0; i < a[r].length; i++) {
var n = r + "," + i, s = a[r][i];
-1 != s && (this.boardMap[n] = s);
}
storage.setItem(this.saveName, this.boardMap);
} else this.boardMap = storage.getItem(this.saveName, {});
Object.keys(this.boardMap).length > 0 && (this.isCanChangeSkin = !0);
}
if (hs.tp.isSkin_BoardClear_ProxyOnGameReplay(e)) {
if (this.isDeny()) return;
this.isSkin = !1;
this.isCanChangeSkin = !1;
this.boardMap = {};
storage.setItem(this.saveName, {});
}
if (hs.tp.isSkin_BoardClear_ProxyOnBlocksProducerTouchEnd(e)) {
if (this.isDeny()) return;
if (this.isCanChangeSkin) {
this.isSkin = !1;
var o = e.args[0].state, h = o.eliminateInfos, c = o.clearScreen;
for (var r in h) for (var i in h[r]) this.deleteKeyBoard(r + "," + i);
h && Object.keys(h).length > 0 && storage.setItem(this.saveName, this.boardMap);
if (Object.keys(this.boardMap).length <= 0) {
this.isCanChangeSkin = !1;
if (c && hs.classGameInfo.roundNum > 5) return;
var p = TRAIT("CleanSceneUseSequenceSkinTrait");
if (null == p ? void 0 : p.active) {
this.isSkin = !0;
p.changeSkin();
}
}
}
}
};
t.prototype.deleteKeyBoard = function(e) {
this.boardMap.hasOwnProperty(e) && delete this.boardMap[e];
};
t.prototype.isDeny = function() {
return hs.gameInfo.gameMode == hs.GameMode.Chapter;
};
return n([ classId("BoardClearChangeSkinTrait"), classMethodWatch() ], t);
}(Trait);
a.BoardClearChangeSkinTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "BoardClearChangeSkinTrait" ]);
//# sourceMappingURL=index.js.map
