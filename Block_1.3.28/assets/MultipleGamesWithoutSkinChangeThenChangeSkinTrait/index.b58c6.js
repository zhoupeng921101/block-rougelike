window.__require = function e(r, t, a) {
function n(i, s) {
if (!t[i]) {
if (!r[i]) {
var c = i.split("/");
c = c[c.length - 1];
if (!r[c]) {
var l = "function" == typeof __require && __require;
if (!s && l) return l(c, !0);
if (o) return o(c, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = c;
}
var h = t[i] = {
exports: {}
};
r[i][0].call(h.exports, function(e) {
return n(r[i][1][e] || e);
}, h, h.exports, e, r, t, a);
}
return t[i].exports;
}
for (var o = "function" == typeof __require && __require, i = 0; i < a.length; i++) n(a[i]);
return n;
}({
MultipleGamesWithoutSkinChangeThenChangeSkinTrait: [ function(e, r, t) {
"use strict";
cc._RF.push(r, "a1330kGfbpNg4f630jX9HJt", "MultipleGamesWithoutSkinChangeThenChangeSkinTrait");
var a, n = this && this.__extends || (a = function(e, r) {
return (a = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, r) {
e.__proto__ = r;
} || function(e, r) {
for (var t in r) Object.prototype.hasOwnProperty.call(r, t) && (e[t] = r[t]);
})(e, r);
}, function(e, r) {
a(e, r);
function t() {
this.constructor = e;
}
e.prototype = null === r ? Object.create(r) : (t.prototype = r.prototype, new t());
}), o = this && this.__decorate || function(e, r, t, a) {
var n, o = arguments.length, i = o < 3 ? r : null === a ? a = Object.getOwnPropertyDescriptor(r, t) : a;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(e, r, t, a); else for (var s = e.length - 1; s >= 0; s--) (n = e[s]) && (i = (o < 3 ? n(i) : o > 3 ? n(r, t, i) : n(r, t)) || i);
return o > 3 && i && Object.defineProperty(r, t, i), i;
};
Object.defineProperty(t, "__esModule", {
value: !0
});
t.MultipleGamesWithoutSkinChangeThenChangeSkinTrait = void 0;
var i = function(e) {
n(r, e);
function r() {
var r = null !== e && e.apply(this, arguments) || this;
r.clearBoardGameNum = 0;
r.isClearBoard = !1;
r.clearScreenEmmitter = new hs.Emitter();
r.isUnlockClearScreenEffect = !1;
return r;
}
r.prototype.registerTraitEventsMethods = function() {
return [ {
className: "BlocksProducerTouch",
methodName: "computeRemainBlocksCanPut"
}, {
className: "ClassRevive_Proxy",
methodName: "onRevive_Success"
}, {
className: "ClassBoardSplashAnimation_Proxy",
methodName: "onDefaultBoardReadyComplete"
}, {
className: "ClassGameDataClear_Memory_Proxy",
methodName: "onClassMemoryClear"
}, {
className: "ClassBoardSplashAnimation_Proxy",
methodName: "addClearScreenEmitter"
}, {
className: "ClassBoardSplashAnimation_Proxy",
methodName: "isUnlockClearScreenEffect"
} ];
};
r.prototype.onActive = function(e) {
var r;
hs.tp.isBlocksProducerTouchComputeRemainBlocksCanPut(e) && this._canClearBoardWithCurrentBlocks() && (this.isClearBoard = !0);
hs.tp.isClassRevive_ProxyOnRevive_Success(e) && this.clearBoardGameNum >= 3 && this._changeSkin(!0);
if (hs.tp.isClassBoardSplashAnimation_ProxyOnDefaultBoardReadyComplete(e)) {
this.isClearBoard = !1;
this.clearBoardGameNum >= 6 && this._changeSkin(!1);
}
hs.tp.isClassGameDataClear_Memory_ProxyOnClassMemoryClear(e) && (this.isClearBoard ? this.clearBoardGameNum = 0 : this.clearBoardGameNum++);
if (hs.tp.isClassBoardSplashAnimation_ProxyAddClearScreenEmitter(e)) {
var t = null !== (r = e.args[0]) && void 0 !== r ? r : [];
t.push(this.clearScreenEmmitter);
e.args[0] = t;
}
if (hs.tp.isClassBoardSplashAnimation_ProxyIsUnlockClearScreenEffect(e) && this.isUnlockClearScreenEffect) {
e.returnValue = !0;
this.isUnlockClearScreenEffect = !1;
}
};
r.prototype._changeSkin = function(e) {
if (hs.skinInfo.currentSkinId !== hs.skinInfo.originSkinId) {
if (e) {
this.isUnlockClearScreenEffect = !0;
this.clearScreenEmmitter.fire(new hs.E_BlocksProducer_TouchEnd({
clearScreen: !0
}));
} else {
var r = TRAIT("CleanSceneUseSequenceSkinTrait");
if (null == r || !r.active) return;
r.changeSkin();
}
this.clearBoardGameNum = 0;
}
};
r.prototype._canClearBoardWithCurrentBlocks = function() {
var e = hs.blocksProducerInfo.producerBlocks, r = new hs.BinaryBoard();
r.convertToBinaryBoard(hs.boardInfo.faceBlocks);
for (var t = 0; t < e.length; t++) {
var a = e[t];
if (-1 !== a) for (var n = r.getCanPutPoss(a), o = 0; o < n.length; o++) {
var i = n[o], s = r.record();
r.putBlock(a, i);
r.canClearBlockArr(!0);
var c = r.getEmptyNumObj() >= 64;
r.reset(s);
if (c) return !0;
}
}
return !1;
};
o([ hs.storageProperty({
key: "MultipleGamesWithoutSkinChangeThenChangeSkinTrait"
}) ], r.prototype, "clearBoardGameNum", void 0);
return o([ classId("MultipleGamesWithoutSkinChangeThenChangeSkinTrait") ], r);
}(Trait);
t.MultipleGamesWithoutSkinChangeThenChangeSkinTrait = i;
cc._RF.pop();
}, {} ]
}, {}, [ "MultipleGamesWithoutSkinChangeThenChangeSkinTrait" ]);
//# sourceMappingURL=index.js.map
