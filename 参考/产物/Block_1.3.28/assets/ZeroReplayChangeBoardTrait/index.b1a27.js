window.__require = function r(t, o, e) {
function a(n, s) {
if (!o[n]) {
if (!t[n]) {
var h = n.split("/");
h = h[h.length - 1];
if (!t[h]) {
var f = "function" == typeof __require && __require;
if (!s && f) return f(h, !0);
if (i) return i(h, !0);
throw new Error("Cannot find module '" + n + "'");
}
n = h;
}
var l = o[n] = {
exports: {}
};
t[n][0].call(l.exports, function(r) {
return a(t[n][1][r] || r);
}, l, l.exports, r, t, o, e);
}
return o[n].exports;
}
for (var i = "function" == typeof __require && __require, n = 0; n < e.length; n++) a(e[n]);
return a;
}({
ZeroReplayChangeBoardTrait: [ function(r, t, o) {
"use strict";
cc._RF.push(t, "05650X7CMBEyL+iOjQtnWKN", "ZeroReplayChangeBoardTrait");
var e, a = this && this.__extends || (e = function(r, t) {
return (e = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(r, t) {
r.__proto__ = t;
} || function(r, t) {
for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (r[o] = t[o]);
})(r, t);
}, function(r, t) {
e(r, t);
function o() {
this.constructor = r;
}
r.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
}), i = this && this.__decorate || function(r, t, o, e) {
var a, i = arguments.length, n = i < 3 ? t : null === e ? e = Object.getOwnPropertyDescriptor(t, o) : e;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(r, t, o, e); else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (n = (i < 3 ? a(n) : i > 3 ? a(t, o, n) : a(t, o)) || n);
return i > 3 && n && Object.defineProperty(t, o, n), n;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.ZeroReplayChangeBoardTrait = void 0;
var n = function(r) {
a(t, r);
function t() {
var t = null !== r && r.apply(this, arguments) || this;
t._lastInitBoard = [];
t._isTriggerTrait = !1;
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassBoard_Color_Proxy",
methodName: "onGameReplay"
} ];
};
t.prototype.onActive = function(r) {
if (hs.tp.isClassBoard_Color_ProxyOnGameReplay(r)) if (0 === hs.classScoreInfo.score) {
this._lastInitBoard = hs.classBoardInfo.initialFaceBlocks;
this._isTriggerTrait = !0;
} else {
this._lastInitBoard = [];
this._isTriggerTrait = !1;
}
if (hs.tp.isClassDefaultBoard_ProxyProduceDefaultBoardTurnAround(r) && this._isTriggerTrait) {
var t = this.generateBoard();
if (t && t.length > 0) {
r.args[0] = t;
r.returnState = !0;
}
this._isTriggerTrait = !1;
}
};
t.prototype.generateBoard = function() {
var r = this;
if (!this._lastInitBoard || 0 === this._lastInitBoard.length) return [];
var t = [ {
method: "move",
handler: function() {
return r.getMoveBoard();
}
}, {
method: "transform",
handler: function() {
return r.getTransformBoard();
}
}, {
method: "rotate",
handler: function() {
return r.getRotateBoard();
}
}, {
method: "mirror",
handler: function() {
return r.getMirrorBoard();
}
} ];
return t[Math.floor(Math.random() * t.length)].handler();
};
t.prototype.getMoveBoard = function() {
for (var r = Math.floor(7 * Math.random()) + 1, t = Math.floor(7 * Math.random()) + 1, o = [], e = 0; e < hs.ROW; e++) {
o[e] = [];
for (var a = 0; a < hs.COL; a++) o[e][a] = -1;
}
for (e = 0; e < hs.ROW; e++) if (this._lastInitBoard[e]) for (a = 0; a < hs.COL; a++) if (void 0 !== this._lastInitBoard[e][a]) {
var i = (a + r) % hs.COL;
o[(e + t) % hs.ROW][i] = this._lastInitBoard[e][a];
}
return o;
};
t.prototype.getTransformBoard = function() {
for (var r = [], t = 0; t < hs.ROW; t++) {
r[t] = [];
if (this._lastInitBoard[t]) for (e = 0; e < hs.COL; e++) {
var o = this._lastInitBoard[t][e];
r[t][e] = -1 === o || void 0 === o ? 1 : -1;
} else for (var e = 0; e < hs.COL; e++) r[t][e] = -1;
}
return r;
};
t.prototype.getRotateBoard = function() {
var r, t = [ 90, 180, 270 ];
switch (t[Math.floor(Math.random() * t.length)]) {
case 90:
r = this.rotate90Clockwise(this._lastInitBoard);
break;

case 180:
r = this.rotate180(this._lastInitBoard);
break;

case 270:
r = this.rotate270Clockwise(this._lastInitBoard);
break;

default:
r = this._lastInitBoard;
}
return r;
};
t.prototype.rotate90Clockwise = function(r) {
for (var t = [], o = 0; o < hs.ROW; o++) {
t[o] = [];
for (var e = 0; e < hs.COL; e++) t[o][e] = -1;
}
for (o = 0; o < hs.ROW; o++) if (r[o]) for (e = 0; e < hs.COL; e++) if (void 0 !== r[o][e]) {
var a = e, i = hs.ROW - 1 - o;
a >= 0 && a < hs.ROW && i >= 0 && i < hs.COL && (t[a][i] = r[o][e]);
}
return t;
};
t.prototype.rotate180 = function(r) {
for (var t = [], o = 0; o < hs.ROW; o++) {
t[o] = [];
for (var e = 0; e < hs.COL; e++) t[o][e] = -1;
}
for (o = 0; o < hs.ROW; o++) if (r[o]) for (e = 0; e < hs.COL; e++) if (void 0 !== r[o][e]) {
var a = hs.ROW - 1 - o, i = hs.COL - 1 - e;
t[a][i] = r[o][e];
}
return t;
};
t.prototype.rotate270Clockwise = function(r) {
for (var t = [], o = 0; o < hs.ROW; o++) {
t[o] = [];
for (var e = 0; e < hs.COL; e++) t[o][e] = -1;
}
for (o = 0; o < hs.ROW; o++) if (r[o]) for (e = 0; e < hs.COL; e++) if (void 0 !== r[o][e]) {
var a = hs.COL - 1 - e, i = o;
a >= 0 && a < hs.ROW && i >= 0 && i < hs.COL && (t[a][i] = r[o][e]);
}
return t;
};
t.prototype.getMirrorBoard = function() {
var r = [ "vertical", "horizontal" ];
return "vertical" === r[Math.floor(Math.random() * r.length)] ? this.mirrorVertical(this._lastInitBoard) : this.mirrorHorizontal(this._lastInitBoard);
};
t.prototype.mirrorVertical = function(r) {
for (var t = [], o = 0; o < hs.ROW; o++) {
t[o] = [];
for (var e = 0; e < hs.COL; e++) t[o][e] = -1;
}
for (o = 0; o < hs.ROW; o++) if (r[o]) for (e = 0; e < hs.COL; e++) if (void 0 !== r[o][e]) {
var a = o, i = hs.COL - 1 - e;
t[a][i] = r[o][e];
}
return t;
};
t.prototype.mirrorHorizontal = function(r) {
for (var t = [], o = 0; o < hs.ROW; o++) {
t[o] = [];
for (var e = 0; e < hs.COL; e++) t[o][e] = -1;
}
for (o = 0; o < hs.ROW; o++) if (r[o]) for (e = 0; e < hs.COL; e++) if (void 0 !== r[o][e]) {
var a = e;
t[hs.ROW - 1 - o][a] = r[o][e];
}
return t;
};
return i([ classId("ZeroReplayChangeBoardTrait") ], t);
}(Trait);
o.ZeroReplayChangeBoardTrait = n;
cc._RF.pop();
}, {} ]
}, {}, [ "ZeroReplayChangeBoardTrait" ]);
//# sourceMappingURL=index.js.map
