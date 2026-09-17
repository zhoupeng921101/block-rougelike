window.__require = function t(r, o, e) {
function a(l, s) {
if (!o[l]) {
if (!r[l]) {
var i = l.split("/");
i = i[i.length - 1];
if (!r[i]) {
var c = "function" == typeof __require && __require;
if (!s && c) return c(i, !0);
if (n) return n(i, !0);
throw new Error("Cannot find module '" + l + "'");
}
l = i;
}
var u = o[l] = {
exports: {}
};
r[l][0].call(u.exports, function(t) {
return a(r[l][1][t] || t);
}, u, u.exports, t, r, o, e);
}
return o[l].exports;
}
for (var n = "function" == typeof __require && __require, l = 0; l < e.length; l++) a(e[l]);
return a;
}({
NotOutBoardColorLeastColorBlockTrait: [ function(t, r, o) {
"use strict";
cc._RF.push(r, "6feb1HGWyJLBa3ARO0SpXpH", "NotOutBoardColorLeastColorBlockTrait");
var e, a = this && this.__extends || (e = function(t, r) {
return (e = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, r) {
t.__proto__ = r;
} || function(t, r) {
for (var o in r) Object.prototype.hasOwnProperty.call(r, o) && (t[o] = r[o]);
})(t, r);
}, function(t, r) {
e(t, r);
function o() {
this.constructor = t;
}
t.prototype = null === r ? Object.create(r) : (o.prototype = r.prototype, new o());
}), n = this && this.__decorate || function(t, r, o, e) {
var a, n = arguments.length, l = n < 3 ? r : null === e ? e = Object.getOwnPropertyDescriptor(r, o) : e;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) l = Reflect.decorate(t, r, o, e); else for (var s = t.length - 1; s >= 0; s--) (a = t[s]) && (l = (n < 3 ? a(l) : n > 3 ? a(r, o, l) : a(r, o)) || l);
return n > 3 && l && Object.defineProperty(r, o, l), l;
}, l = this && this.__read || function(t, r) {
var o = "function" == typeof Symbol && t[Symbol.iterator];
if (!o) return t;
var e, a, n = o.call(t), l = [];
try {
for (;(void 0 === r || r-- > 0) && !(e = n.next()).done; ) l.push(e.value);
} catch (t) {
a = {
error: t
};
} finally {
try {
e && !e.done && (o = n.return) && o.call(n);
} finally {
if (a) throw a.error;
}
}
return l;
}, s = this && this.__spread || function() {
for (var t = [], r = 0; r < arguments.length; r++) t = t.concat(l(arguments[r]));
return t;
}, i = this && this.__values || function(t) {
var r = "function" == typeof Symbol && Symbol.iterator, o = r && t[r], e = 0;
if (o) return o.call(t);
if (t && "number" == typeof t.length) return {
next: function() {
t && e >= t.length && (t = void 0);
return {
value: t && t[e++],
done: !t
};
}
};
throw new TypeError(r ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.NotOutBoardColorLeastColorBlockTrait = void 0;
var c = function(t) {
a(r, t);
function r() {
var r = null !== t && t.apply(this, arguments) || this;
r.MIN_COLOR = 1;
r.MAX_COLOR = 7;
r.STORAGE_KEY = "notOutBoardColorLeastColorBlockTraitKey";
r._traitData = {
colorList: []
};
return r;
}
r.prototype.onActive = function(t) {
hs.tp.isClassColorProducer_ProxyProduceColorPostprocessing(t) && this.processColorFilter2(t);
hs.tp.isClassBlocksProducer_BlocksProducerValidate_ProxySetRecordOperationColor(t) && this.handleColdStartColorRestore(t);
};
r.prototype.handleColdStartColorRestore = function(t) {
var r = hs.storage.getItem(this.STORAGE_KEY, null);
if (r && r.colorList && r.colorList.length > 0) {
hs.storage.setItem("classColorLists", r.colorList);
t.replace = !0;
t.returnState = !0;
}
};
r.prototype.saveColorData = function(t) {
this._traitData.colorList = t;
hs.storage.setItem(this.STORAGE_KEY, this._traitData);
};
r.prototype.clearColorData = function() {
this._traitData.colorList = [];
hs.storage.setItem(this.STORAGE_KEY, this._traitData);
};
r.prototype.processColorFilter = function() {
var t = this.getBoardFaceBlocks();
if (t && !this.isBoardEmpty(t)) {
var r = this.countBoardColors(t), o = this.getExistingColors(r);
if (o.length <= 1) ; else {
var e = this.findLeastCountColors(r), a = hs.storage.getItem("classColorLists", [ 1, 4, 2 ]), n = this.filterBlockColors(a, e, o);
n.length >= 3 && hs.storage.setItem("classColorLists", n.slice(0, 3));
}
}
};
r.prototype.getBoardFaceBlocks = function() {
return hs.storage.getItem("classFaceBlocks", null);
};
r.prototype.isBoardEmpty = function(t) {
for (var r = 0; r < t.length; r++) for (var o = 0; o < t[r].length; o++) if (this.isValidColor(t[r][o])) return !1;
return !0;
};
r.prototype.isValidColor = function(t) {
return t >= this.MIN_COLOR && t <= this.MAX_COLOR;
};
r.prototype.countBoardColors = function(t) {
for (var r = new Map(), o = this.MIN_COLOR; o <= this.MAX_COLOR; o++) r.set(o, 0);
for (o = 0; o < t.length; o++) for (var e = 0; e < t[o].length; e++) {
var a = t[o][e];
if (this.isValidColor(a)) {
var n = r.get(a) || 0;
r.set(a, n + 1);
}
}
return r;
};
r.prototype.getExistingColors = function(t) {
var r = [];
t.forEach(function(t, o) {
t > 0 && r.push(o);
});
return r;
};
r.prototype.findLeastCountColors = function(t) {
var r = Infinity, o = [];
t.forEach(function(t) {
t > 0 && t < r && (r = t);
});
t.forEach(function(t, e) {
t === r && o.push(e);
});
return o;
};
r.prototype.filterBlockColors = function(t, r, o) {
var e = o.filter(function(t) {
return !r.includes(t);
});
if (0 === e.length) return t;
for (var a = [], n = 0; n < t.length && a.length < 3; n++) {
var l = t[n];
if (e.includes(l)) a.push(l); else if (r.includes(l)) if (1 === r.length) {
var s = this.getRandomAvailableColor(e, a);
a.push(s);
} else {
s = this.getRandomAvailableColor(e, a);
a.push(s);
} else {
s = this.getRandomAvailableColor(e, a);
a.push(s);
}
}
for (;a.length < 3; ) {
s = this.getRandomAvailableColor(e, a);
a.push(s);
}
return a;
};
r.prototype.getRandomAvailableColor = function(t, r) {
var o = t.filter(function(t) {
return !r.includes(t);
});
return o.length > 0 ? o[Math.floor(Math.random() * o.length)] : t[Math.floor(Math.random() * t.length)];
};
r.prototype.processColorFilter2 = function(t) {
if (hs.storage.getItem("classSolidColor", 0) > 0) this.clearColorData(); else {
var r = this.getBoardFaceBlocks();
if (r && !this.isBoardEmpty(r)) {
var o = this.getNewColorList();
hs.storage.setItem("classColorLists", o);
this.saveColorData(o);
t.replace = !0;
t.returnState = !0;
} else {
var e = Math.floor(Math.random() * this.MAX_COLOR) + this.MIN_COLOR, a = hs.storage.getItem("classColorLists", null);
3 == a.length && a[0] == a[1] && a[1] == a[2] && (e = a[0]);
var n = [ e, e, e ];
hs.storage.setItem("classColorLists", n);
this.saveColorData(n);
t.replace = !0;
t.returnState = !0;
}
}
};
r.prototype.getNewColorList = function() {
var t = [], r = hs.boardInfo.faceBlocks, o = this.getBlocksColorNum(r);
if (o.size <= 2) {
var e = this.getMaxColorList(o), a = this.randomList(e, 3);
t.push.apply(t, s(a));
return t;
}
var n = this.getMinColorList(o), l = this.getRemoveMinColorList(o, n);
0 == l.length && l.push.apply(l, s(n));
var i = this.randomList(l, 3);
t.push.apply(t, s(i));
return t;
};
r.prototype.getBlocksColorNum = function(t) {
for (var r = new Map(), o = 0; o < t.length; o++) for (var e = 0; e < t[o].length; e++) {
var a = t[o][e];
a > -1 && (r.has(a) ? r.set(a, r.get(a) + 1) : r.set(a, 1));
}
return r;
};
r.prototype.getMinColorList = function(t) {
var r, o, e = [];
try {
for (var a = i(t.entries()), n = a.next(); !n.done; n = a.next()) {
var c = l(n.value, 2), u = c[0];
c[1] === Math.min.apply(Math, s(t.values())) && e.push(u);
}
} catch (t) {
r = {
error: t
};
} finally {
try {
n && !n.done && (o = a.return) && o.call(a);
} finally {
if (r) throw r.error;
}
}
return e;
};
r.prototype.getRemoveMinColorList = function(t, r) {
var o, e, a, n, c = [], u = new Map();
try {
for (var h = i(t.entries()), f = h.next(); !f.done; f = h.next()) {
var p = l(f.value, 2), v = p[0], y = p[1];
u.has(y) ? u.get(y).push(v) : u.set(y, [ v ]);
}
} catch (t) {
o = {
error: t
};
} finally {
try {
f && !f.done && (e = h.return) && e.call(h);
} finally {
if (o) throw o.error;
}
}
var d = Math.max.apply(Math, s(u.keys()));
try {
for (var C = i(u.entries()), g = C.next(); !g.done; g = C.next()) {
var _ = l(g.value, 2), m = (y = _[0], _[1]);
if (!r.includes(m[0])) if (y == d) c.push.apply(c, s(m)); else {
v = m[Math.floor(Math.random() * m.length)];
c.push(v);
}
}
} catch (t) {
a = {
error: t
};
} finally {
try {
g && !g.done && (n = C.return) && n.call(C);
} finally {
if (a) throw a.error;
}
}
return c;
};
r.prototype.getMaxColorList = function(t) {
var r, o, e = [];
try {
for (var a = i(t.entries()), n = a.next(); !n.done; n = a.next()) {
var c = l(n.value, 2), u = c[0];
c[1] === Math.max.apply(Math, s(t.values())) && e.push(u);
}
} catch (t) {
r = {
error: t
};
} finally {
try {
n && !n.done && (o = a.return) && o.call(a);
} finally {
if (r) throw r.error;
}
}
return e;
};
r.prototype.randomList = function(t, r) {
for (var o = [], e = 0; e < r; e++) {
for (var a = t.length - 1; a > 0; a--) {
var n = Math.floor(Math.random() * a), l = t[a];
t[a] = t[n];
t[n] = l;
}
o.push(t[0]);
}
return o;
};
return n([ classId("NotOutBoardColorLeastColorBlockTrait") ], r);
}(Trait);
o.NotOutBoardColorLeastColorBlockTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "NotOutBoardColorLeastColorBlockTrait" ]);
//# sourceMappingURL=index.js.map
