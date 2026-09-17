window.__require = function r(o, e, t) {
function l(i, a) {
if (!e[i]) {
if (!o[i]) {
var s = i.split("/");
s = s[s.length - 1];
if (!o[s]) {
var c = "function" == typeof __require && __require;
if (!a && c) return c(s, !0);
if (n) return n(s, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = s;
}
var u = e[i] = {
exports: {}
};
o[i][0].call(u.exports, function(r) {
return l(o[i][1][r] || r);
}, u, u.exports, r, o, e, t);
}
return e[i].exports;
}
for (var n = "function" == typeof __require && __require, i = 0; i < t.length; i++) l(t[i]);
return l;
}({
DualColorMoreWithBigBlockTrait: [ function(r, o, e) {
"use strict";
cc._RF.push(o, "68f1cKiLXpD+KRdI1ukWYdC", "DualColorMoreWithBigBlockTrait");
var t, l = this && this.__extends || (t = function(r, o) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(r, o) {
r.__proto__ = o;
} || function(r, o) {
for (var e in o) Object.prototype.hasOwnProperty.call(o, e) && (r[e] = o[e]);
})(r, o);
}, function(r, o) {
t(r, o);
function e() {
this.constructor = r;
}
r.prototype = null === o ? Object.create(o) : (e.prototype = o.prototype, new e());
}), n = this && this.__decorate || function(r, o, e, t) {
var l, n = arguments.length, i = n < 3 ? o : null === t ? t = Object.getOwnPropertyDescriptor(o, e) : t;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(r, o, e, t); else for (var a = r.length - 1; a >= 0; a--) (l = r[a]) && (i = (n < 3 ? l(i) : n > 3 ? l(o, e, i) : l(o, e)) || i);
return n > 3 && i && Object.defineProperty(o, e, i), i;
}, i = this && this.__values || function(r) {
var o = "function" == typeof Symbol && Symbol.iterator, e = o && r[o], t = 0;
if (e) return e.call(r);
if (r && "number" == typeof r.length) return {
next: function() {
r && t >= r.length && (r = void 0);
return {
value: r && r[t++],
done: !r
};
}
};
throw new TypeError(o ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, a = this && this.__read || function(r, o) {
var e = "function" == typeof Symbol && r[Symbol.iterator];
if (!e) return r;
var t, l, n = e.call(r), i = [];
try {
for (;(void 0 === o || o-- > 0) && !(t = n.next()).done; ) i.push(t.value);
} catch (r) {
l = {
error: r
};
} finally {
try {
t && !t.done && (e = n.return) && e.call(n);
} finally {
if (l) throw l.error;
}
}
return i;
}, s = this && this.__spread || function() {
for (var r = [], o = 0; o < arguments.length; o++) r = r.concat(a(arguments[o]));
return r;
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.DualColorMoreWithBigBlockTrait = void 0;
var c = function(r) {
l(o, r);
function o() {
return null !== r && r.apply(this, arguments) || this;
}
e = o;
o.prototype.onActive = function(r) {
if (hs.tp.isDualColorMoreColorPriorityTraitCanUseBigBlock(r)) {
var o = r.args[0], e = r.args[1], t = hs.boardInfo.faceBlocks, l = this.getMergeBlockAreaByColor(o, e), n = l.areaA, i = l.areaB, a = n > 0 || i > 0, s = this.isBigBlockEnabled() && !!t && this.isFillBlankAlgorithm() && a;
r.returnValue = s;
r.replace = !0;
}
if (hs.tp.isDualColorMoreColorPriorityTraitApplyEdgeBasedColorStrategy(r)) {
var c = r.args[0], u = (t = r.args[1], r.args[2]), f = r.args[3];
this.applyEdgeBasedColorStrategy(c, t, u, f);
}
if (hs.tp.isDualColorMoreColorPriorityTraitApplyBigBlockCellStrategy(r)) {
c = r.args[0], u = r.args[1], f = r.args[2];
var h = this.applyBigBlockCellStrategy(c, u, f);
r.returnValue = h;
r.replace = !0;
}
};
o.prototype.isBigBlockEnabled = function() {
var r, o;
return null !== (o = null === (r = this.props) || void 0 === r ? void 0 : r.enableBigBlock) && void 0 !== o && o;
};
o.prototype.getMergeBlockAreaByColor = function(r, o) {
var e, t, l = hs.storage.getItem("mergeBlockTrait", null), n = null == l ? void 0 : l.mergeBlocks;
if (!n || 0 === n.length) return {
areaA: 0,
areaB: 0
};
var a = 0, s = 0;
try {
for (var c = i(n), u = c.next(); !u.done; u = c.next()) {
var f = u.value;
f.color === r ? a += f.size * f.size : f.color === o && (s += f.size * f.size);
}
} catch (r) {
e = {
error: r
};
} finally {
try {
u && !u.done && (t = c.return) && t.call(c);
} finally {
if (e) throw e.error;
}
}
return {
areaA: a,
areaB: s
};
};
o.prototype.getMergeBlockCells = function(r, o) {
var e, t, l = hs.storage.getItem("mergeBlockTrait", null), n = null == l ? void 0 : l.mergeBlocks, a = new Set(), s = new Set();
if (!n || 0 === n.length) return {
cellsA: a,
cellsB: s
};
try {
for (var c = i(n), u = c.next(); !u.done; u = c.next()) {
var f = u.value, h = f.color === r ? a : f.color === o ? s : null;
if (h) for (var g = f.anchorRow; g < f.anchorRow + f.size; g++) for (var y = f.anchorCol; y < f.anchorCol + f.size; y++) h.add(g + "," + y);
}
} catch (r) {
e = {
error: r
};
} finally {
try {
u && !u.done && (t = c.return) && t.call(c);
} finally {
if (e) throw e.error;
}
}
return {
cellsA: a,
cellsB: s
};
};
o.prototype.isFillBlankAlgorithm = function() {
return !!hs.algorithmName.algoActualName[0].includes("填空消除");
};
o.prototype.applyEdgeBasedColorStrategy = function(r, o, t, l) {
for (var n = t.colorA, i = t.colorB, a = [], c = 0; c < r.length; c++) a.push(n);
var u = this.getMergeBlockCells(n, i), f = u.cellsA, h = u.cellsB;
for (c = 0; c < r.length; c++) {
var g = r[c];
if (-1 !== g) {
var y = this.findBestPosition(o, g, c);
if (y) {
var d = this.countColorEdges(o, g, y, f, h), p = d.edgesA, v = d.edgesB, B = d.totalTouched, C = B > 0 ? v / B : 0;
if ((B > 0 ? p / B : 0) >= e.EDGE_RATE_THRESHOLD || C >= e.EDGE_RATE_THRESHOLD) {
a[c] = this.chooseColorByEdgeTouching(p, v, n, i);
continue;
}
}
var _ = Math.random();
a[c] = _ < l ? n : i;
}
}
this.setColorList(s(a));
};
o.prototype.findBestPosition = function(r, o, e) {
var t, l, n = null;
if (-1 !== hs.algorithmInfo.blockIdList[e]) {
var a = hs.algorithmInfo.blockPosList[e];
if (a && "number" == typeof a.row && "number" == typeof a.col) return cc.v2(a.col, a.row);
}
var s = new hs.BinaryBoard();
s.convertToBinaryBoard(r);
var c = s.getCanPutPoss(o);
if (!c || 0 === c.length) return null;
var u = Infinity;
try {
for (var f = i(c), h = f.next(); !h.done; h = f.next()) {
var g = h.value, y = s.clone();
y.putBlock(o, g);
var d = y.getEdgeGameNum();
if (d < u) {
u = d;
n = g;
}
}
} catch (r) {
t = {
error: r
};
} finally {
try {
h && !h.done && (l = f.return) && l.call(f);
} finally {
if (t) throw t.error;
}
}
return n;
};
o.prototype.getBlockCellPositions = function(r, o) {
var e = hs.blockPosInfo[r - 1];
if (!Array.isArray(e)) return null;
for (var t = new Set(), l = [], n = 0; n < e.length; n++) for (var i = 0; i < e[n].length; i++) if (1 === e[n][i]) {
var a = o.y + n, s = o.x + i;
t.add(a + "," + s);
l.push([ a, s ]);
}
return {
cellSet: t,
cellList: l
};
};
o.prototype.countColorEdges = function(r, o, e, t, l) {
var n, a, s, c, u, f, h = this.getBlockCellPositions(o, e);
if (!h) return {
edgesA: 0,
edgesB: 0,
totalTouched: 0
};
var g = r.length, y = null !== (f = null === (u = r[0]) || void 0 === u ? void 0 : u.length) && void 0 !== f ? f : 0, d = [ [ 0, 1 ], [ 0, -1 ], [ 1, 0 ], [ -1, 0 ] ], p = 0, v = 0, B = 0;
try {
for (var C = i(h.cellList), _ = C.next(); !_.done; _ = C.next()) {
var k = _.value;
try {
for (var E = (s = void 0, i(d)), T = E.next(); !T.done; T = E.next()) {
var m = T.value, A = k[0] + m[0], b = k[1] + m[1];
if (!h.cellSet.has(A + "," + b)) {
var w = A < 0 || A >= g || b < 0 || b >= y;
if (w || r[A][b] > 0) {
B++;
if (!w) {
var M = A + "," + b;
t.has(M) ? p++ : l.has(M) && v++;
}
}
}
}
} catch (r) {
s = {
error: r
};
} finally {
try {
T && !T.done && (c = E.return) && c.call(E);
} finally {
if (s) throw s.error;
}
}
}
} catch (r) {
n = {
error: r
};
} finally {
try {
_ && !_.done && (a = C.return) && a.call(C);
} finally {
if (n) throw n.error;
}
}
return {
edgesA: p,
edgesB: v,
totalTouched: B
};
};
o.prototype.chooseColorByEdgeTouching = function(r, o, e, t) {
if (r > o) return e;
if (o > r) return t;
var l = this.getMergeBlockAreaByColor(e, t);
return l.areaA >= l.areaB ? e : t;
};
o.prototype.applyBigBlockCellStrategy = function(r, o, e) {
for (var t = hs.boardInfo.faceBlocks, l = [], n = 0; n < r.length; n++) {
var i = r[n];
if (-1 !== i) {
var a = t ? this.findBestPosition(t, i, n) : null, s = this.tryEdgeBasedColor(i, t, a, o);
l[n] = null !== s ? this.assignUniformCellColors(i, s, n) : this.assignRandomCellColors(i, o, e, n);
}
}
return l.length > 0 ? l : null;
};
o.prototype.tryEdgeBasedColor = function(r, o, t, l) {
var n = l.colorA, i = l.colorB;
if (!o || !t) return null;
var a = this.getMergeBlockCells(n, i), s = a.cellsA, c = a.cellsB, u = this.countColorEdges(o, r, t, s, c), f = u.edgesA, h = u.edgesB, g = u.totalTouched, y = g > 0 ? h / g : 0;
return (g > 0 ? f / g : 0) >= e.EDGE_RATE_THRESHOLD || y >= e.EDGE_RATE_THRESHOLD ? this.chooseColorByEdgeTouching(f, h, n, i) : null;
};
o.prototype.assignUniformCellColors = function(r, o) {
for (var e = hs.BinaryClip.countBlockCells(r), t = {}, l = 0; l < e; l++) t[l] = o;
return t;
};
o.prototype.assignRandomCellColors = function(r, o, e) {
for (var t = o.colorA, l = o.colorB, n = hs.BinaryClip.countBlockCells(r), i = {}, a = 0; a < n; a++) i[a] = Math.random() < e ? t : l;
return i;
};
o.prototype.isMergeBlocksClassMode = function() {
var r = TRAIT("DualColorSkinSelectorTrait");
return !(null == r || !r.active) && r.isClassMode();
};
o.prototype.setColorList = function(r) {
this.isMergeBlocksClassMode() ? hs.classColorProducerGameInfo.setColorList(r) : hs.mergeBlocksColorProducerGameInfo.setColorList(r);
};
var e;
o.EDGE_RATE_THRESHOLD = .3;
return e = n([ classId("DualColorMoreWithBigBlockTrait") ], o);
}(Trait);
e.DualColorMoreWithBigBlockTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "DualColorMoreWithBigBlockTrait" ]);
//# sourceMappingURL=index.js.map
