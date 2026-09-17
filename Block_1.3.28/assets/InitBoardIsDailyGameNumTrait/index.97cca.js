window.__require = function t(e, a, r) {
function o(n, s) {
if (!a[n]) {
if (!e[n]) {
var c = n.split("/");
c = c[c.length - 1];
if (!e[c]) {
var u = "function" == typeof __require && __require;
if (!s && u) return u(c, !0);
if (i) return i(c, !0);
throw new Error("Cannot find module '" + n + "'");
}
n = c;
}
var l = a[n] = {
exports: {}
};
e[n][0].call(l.exports, function(t) {
return o(e[n][1][t] || t);
}, l, l.exports, t, e, a, r);
}
return a[n].exports;
}
for (var i = "function" == typeof __require && __require, n = 0; n < r.length; n++) o(r[n]);
return o;
}({
InitBoardIsDailyGameNumTrait: [ function(t, e, a) {
"use strict";
cc._RF.push(e, "2ee0cCD1flNhrKXQT3K0Wgt", "InitBoardIsDailyGameNumTrait");
var r, o = this && this.__extends || (r = function(t, e) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var a in e) Object.prototype.hasOwnProperty.call(e, a) && (t[a] = e[a]);
})(t, e);
}, function(t, e) {
r(t, e);
function a() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (a.prototype = e.prototype, new a());
}), i = this && this.__decorate || function(t, e, a, r) {
var o, i = arguments.length, n = i < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, a) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(t, e, a, r); else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (n = (i < 3 ? o(n) : i > 3 ? o(e, a, n) : o(e, a)) || n);
return i > 3 && n && Object.defineProperty(e, a, n), n;
};
Object.defineProperty(a, "__esModule", {
value: !0
});
a.InitBoardIsDailyGameNumTrait = void 0;
var n = [ [ [ 1, 1, 1 ], [ 1, -1, 1 ], [ 1, -1, 1 ], [ 1, -1, 1 ], [ 1, 1, 1 ] ], [ [ -1, 1 ], [ 1, 1 ], [ -1, 1 ], [ -1, 1 ], [ -1, 1 ] ], [ [ 1, 1, 1 ], [ -1, -1, 1 ], [ -1, 1, -1 ], [ 1, -1, -1 ], [ 1, 1, 1 ] ], [ [ 1, 1, 1 ], [ -1, -1, 1 ], [ -1, 1, 1 ], [ -1, -1, 1 ], [ 1, 1, 1 ] ], [ [ 1, -1, 1 ], [ 1, -1, 1 ], [ 1, 1, 1 ], [ -1, -1, 1 ], [ -1, -1, 1 ] ], [ [ 1, 1, 1 ], [ 1, -1, -1 ], [ 1, 1, 1 ], [ -1, -1, 1 ], [ 1, 1, 1 ] ], [ [ 1, 1, 1 ], [ 1, -1, -1 ], [ 1, 1, 1 ], [ 1, -1, 1 ], [ 1, 1, 1 ] ], [ [ 1, 1, 1 ], [ -1, -1, 1 ], [ -1, -1, 1 ], [ -1, -1, 1 ], [ -1, -1, 1 ] ], [ [ 1, 1, 1 ], [ 1, -1, 1 ], [ 1, 1, 1 ], [ 1, -1, 1 ], [ 1, 1, 1 ] ], [ [ 1, 1, 1 ], [ 1, -1, 1 ], [ 1, 1, 1 ], [ -1, -1, 1 ], [ 1, 1, 1 ] ] ], s = function(t) {
o(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.onCreate = function() {
this.traitData = storage.getItem("InitBoardIsDailyGameNumData", {
curTime: 0,
todayGameNum: 0
});
};
e.prototype.onActive = function(t) {
if (hs.tp.isClassDefaultBoard_ProxyOnProduceClassDefaultBoard(t)) {
if (hs.isSameDate(this.traitData.curTime, Date.now())) t.args[0].data.newGame && this.traitData.todayGameNum++; else {
this.traitData.curTime = Date.now();
this.traitData.todayGameNum = 1;
}
storage.setItem("InitBoardIsDailyGameNumData", this.traitData);
if (!t.args[0].data.newGame && 1 === this.traitData.todayGameNum && 0 === hs.classScoreInfo.score && (e = this.getFaceBlocksByTodayGameCount(this.traitData.todayGameNum)) && 0 != hs.classGameInfo.gameNum) {
this.changeFaceBlocks(e);
storage.setItem("classFaceBlocks", e);
storage.setItem("classInitialFaceBlocks", e);
t.returnState = !0;
}
}
if (hs.tp.isClassDefaultBoard_ProxyProduceDefaultBoard(t)) {
var e, a = this.traitData.todayGameNum;
if ((e = this.getFaceBlocksByTodayGameCount(a)) && 0 != hs.classGameInfo.gameNum) {
this.changeFaceBlocks(e);
t.args[0] = e;
t.returnState = !0;
}
}
};
e.prototype.getFaceBlocksByTodayGameCount = function(t) {
if (t <= 99) {
var e = Array.from({
length: hs.ROW
}, function() {
return Array(hs.COL).fill(-1);
});
if (t < 10) {
var a = n[t];
this.placeNumberOnBoard(e, a, 1, 2);
} else {
var r = Math.floor(t / 10), o = n[r], i = n[t % 10];
this.placeNumberOnBoard(e, o, 1, 1);
var s = o[0].length;
this.placeNumberOnBoard(e, i, 1, 1 + s + 1);
}
return e;
}
return null;
};
e.prototype.placeNumberOnBoard = function(t, e, a, r) {
for (var o = 0; o < e.length; o++) for (var i = 0; i < e[o].length; i++) {
var n = a + o, s = r + i;
n < t.length && s < t[0].length && (t[n][s] = e[o][i]);
}
};
e.prototype.changeFaceBlocks = function() {};
return i([ classId("InitBoardIsDailyGameNumTrait"), classMethodWatch() ], e);
}(Trait);
a.InitBoardIsDailyGameNumTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "InitBoardIsDailyGameNumTrait" ]);
//# sourceMappingURL=index.js.map
