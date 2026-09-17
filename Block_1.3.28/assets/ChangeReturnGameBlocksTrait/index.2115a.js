window.__require = function e(t, r, s) {
function n(i, a) {
if (!r[i]) {
if (!t[i]) {
var u = i.split("/");
u = u[u.length - 1];
if (!t[u]) {
var g = "function" == typeof __require && __require;
if (!a && g) return g(u, !0);
if (o) return o(u, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = u;
}
var c = r[i] = {
exports: {}
};
t[i][0].call(c.exports, function(e) {
return n(t[i][1][e] || e);
}, c, c.exports, e, t, r, s);
}
return r[i].exports;
}
for (var o = "function" == typeof __require && __require, i = 0; i < s.length; i++) n(s[i]);
return n;
}({
ChangeReturnGameBlocksTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "61212eS8QlJRIBzJ1vqUVtE", "ChangeReturnGameBlocksTrait");
var s, n = this && this.__extends || (s = function(e, t) {
return (s = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
s(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), o = this && this.__decorate || function(e, t, r, s) {
var n, o = arguments.length, i = o < 3 ? t : null === s ? s = Object.getOwnPropertyDescriptor(t, r) : s;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(e, t, r, s); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (i = (o < 3 ? n(i) : o > 3 ? n(t, r, i) : n(t, r)) || i);
return o > 3 && i && Object.defineProperty(t, r, i), i;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ChangeReturnGameBlocksTrait = void 0;
var i = {
chapterTriggerCount: {
curGameNum: 0,
triggerCount: 0
},
classTriggerCount: {
curGameNum: 0,
triggerCount: 0
}
}, a = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.curTriggerCount = 0;
t.isNewGame = !1;
t.isTrigger = !1;
return t;
}
t.prototype.onActive = function(e) {
if (hs.tp.isClassGame_Ready_ProxyOnClassGameReadyComplete(e)) {
this.isNewGame = !1;
!(storage.getItem("classGuideStep", 0) <= 2) && 0 == storage.getItem("classGameInProcess", !1) && hs.gameInfo.gameNum > 0 && 0 == hs.scoreInfo.score && hs.boardInfo.isNullBoard() && (this.isNewGame = !0);
this.judgeIsReturnGame(e);
}
if (hs.tp.isChapterGame_Ready_ProxyOnChapterGameReadyComplete(e)) {
this.isNewGame = !1;
0 == hs.blocksProducerInfo.hasValidBlock() && 0 == hs.scoreInfo.score && hs.boardInfo.isNullBoard() && (this.isNewGame = !0);
this.judgeIsReturnGame(e);
}
hs.tp.isIsWarmhandsTraitClassTriggerJudge(e) && this.isTrigger && (e.replace = !0);
hs.tp.isIsWarmhandsTraitChapterTriggerJudge(e) && this.isTrigger && (e.replace = !0);
};
t.prototype.judgeIsReturnGame = function() {
this.isTrigger = !1;
if (this.curTriggerCount >= 2 || this.isNewGame || hs.gameInfo.entryTimeHistory.length < 2) {
this.curTriggerCount;
this.isNewGame;
hs.gameInfo.entryTimeHistory.length;
} else if (hs.gameInfo.entryTimeHistory[hs.gameInfo.entryTimeHistory.length - 1] - hs.gameInfo.entryTimeHistory[hs.gameInfo.entryTimeHistory.length - 2] >= 126e5) {
var e = hs.storage.getItem("ChangeReturnGameBlocksData", i);
if (hs.gameInfo.gameMode == hs.GameMode.Chapter) {
var t = hs.storage.getItem("chapterGameNum", 0);
if (t != e.chapterTriggerCount.curGameNum) {
e.chapterTriggerCount.curGameNum = t;
e.chapterTriggerCount.triggerCount = 0;
}
if (e.chapterTriggerCount.triggerCount >= 2) return;
if ((r = storage.getItem("chapterProducerBlocks", [ -1, -1, -1 ])).filter(function(e) {
return -1 != e;
}).length <= 1) return;
if ((s = this.getCanPutBlocks(r)).length <= 0) return;
(n = hs.randomList(s, 1)).unshift(-1);
n.push(-1);
storage.setItem("chapterProducerBlocks", n);
e.chapterTriggerCount.triggerCount++;
storage.setItem("ChangeReturnGameBlocksData", e);
this.curTriggerCount++;
this.isTrigger = !0;
} else {
var r, s, n, o = storage.getItem("classGameNum", 0);
if (o != e.classTriggerCount.curGameNum) {
e.classTriggerCount.curGameNum = o;
e.classTriggerCount.triggerCount = 0;
}
if (e.classTriggerCount.triggerCount >= 2) return;
if ((r = storage.getItem("classProducerBlocks", [ -1, -1, -1 ])).filter(function(e) {
return -1 != e;
}).length <= 1) return;
if ((s = this.getCanPutBlocks(r)).length <= 0) return;
(n = hs.randomList(s, 1)).unshift(-1);
n.push(-1);
storage.setItem("classProducerBlocks", n);
e.classTriggerCount.triggerCount++;
storage.setItem("ChangeReturnGameBlocksData", e);
this.curTriggerCount++;
this.isTrigger = !0;
}
}
};
t.prototype.getCanPutBlocks = function(e) {
var t = new hs.BinaryBoard();
t.convertToBinaryBoard(hs.boardInfo.faceBlocks);
return e.filter(function(e) {
return -1 != e && t.canPut(e);
});
};
return o([ classId("ChangeReturnGameBlocksTrait") ], t);
}(Trait);
r.ChangeReturnGameBlocksTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "ChangeReturnGameBlocksTrait" ]);
//# sourceMappingURL=index.js.map
