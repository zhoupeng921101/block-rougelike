window.__require = function t(e, r, o) {
function a(i, n) {
if (!r[i]) {
if (!e[i]) {
var l = i.split("/");
l = l[l.length - 1];
if (!e[l]) {
var c = "function" == typeof __require && __require;
if (!n && c) return c(l, !0);
if (s) return s(l, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = l;
}
var h = r[i] = {
exports: {}
};
e[i][0].call(h.exports, function(t) {
return a(e[i][1][t] || t);
}, h, h.exports, t, e, r, o);
}
return r[i].exports;
}
for (var s = "function" == typeof __require && __require, i = 0; i < o.length; i++) a(o[i]);
return a;
}({
ShapeColorProposal2Trait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "b0fccXhG39LtYcs0h5cBvFX", "ShapeColorProposal2Trait");
var o, a = this && this.__extends || (o = function(t, e) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
})(t, e);
}, function(t, e) {
o(t, e);
function r() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
}), s = this && this.__decorate || function(t, e, r, o) {
var a, s = arguments.length, i = s < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(t, e, r, o); else for (var n = t.length - 1; n >= 0; n--) (a = t[n]) && (i = (s < 3 ? a(i) : s > 3 ? a(e, r, i) : a(e, r)) || i);
return s > 3 && i && Object.defineProperty(e, r, i), i;
}, i = this && this.__read || function(t, e) {
var r = "function" == typeof Symbol && t[Symbol.iterator];
if (!r) return t;
var o, a, s = r.call(t), i = [];
try {
for (;(void 0 === e || e-- > 0) && !(o = s.next()).done; ) i.push(o.value);
} catch (t) {
a = {
error: t
};
} finally {
try {
o && !o.done && (r = s.return) && r.call(s);
} finally {
if (a) throw a.error;
}
}
return i;
}, n = this && this.__values || function(t) {
var e = "function" == typeof Symbol && Symbol.iterator, r = e && t[e], o = 0;
if (r) return r.call(t);
if (t && "number" == typeof t.length) return {
next: function() {
t && o >= t.length && (t = void 0);
return {
value: t && t[o++],
done: !t
};
}
};
throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ShapeColorProposal2Trait = void 0;
var l = function(t) {
a(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.saveKey = "ShapeColorProposal2Trait";
e.saveColorKey = "ShapeColorProposal2TraitColorNum";
e._data = {
todayStr: "",
colorMap: {},
todayGamesNum: 0
};
e.blockShapeMap = {
1: [ 9, 13, 36, 35 ],
2: [ 2, 4, 7, 22, 3, 5, 11, 17 ],
3: [ 37, 38, 39, 40, 41 ],
4: [ 14, 16, 18, 19 ],
5: [ 10, 20, 25, 26 ],
6: [ 6, 15, 27, 28, 8, 29, 30, 31, 32, 33, 34, 42, 12, 21, 23, 24, 25 ],
7: [ 1 ]
};
e.shapeIdMap = {
1: "O",
2: "I",
3: "/",
4: "SZ",
5: "T",
6: "JL",
7: "复活"
};
return e;
}
e.prototype.onActive = function(t) {
if (hs.tp.isClassColorProducer_ProxyOnGameStart(t)) {
if (!this.getIsTrigger(!1)) return;
var e = t.args[0], r = storage.getItem(this.saveKey, this._data);
this.setState(r);
var o = this.getTodayStr();
if (e.data.newGame) {
if (this.state.todayStr != o) {
this.state.todayStr = o;
this.state.colorMap = {};
this.state.todayGamesNum = 0;
}
this.state.todayGamesNum++;
this.gainColor();
storage.setItem(this.saveColorKey, {});
} else if (this.state.todayStr != o) {
this.state.todayStr = o;
if (0 === Object.keys(this.state.colorMap).length) {
this.gainColor();
this.state.todayGamesNum = 1;
}
}
storage.setItem(this.saveKey, this.state);
}
if (hs.tp.isClassColorProducer_ProxyProduceColorPostprocessing(t)) {
if (!this.getIsTrigger()) return;
for (var a = hs.algorithmInfo.blockIdList, s = [], i = 0; i < a.length; i++) {
var n = this.getShapeId(a[i]);
s.push(this.state.colorMap[n]);
}
hs.classColorProducerGameInfo.setColorList(s);
t.returnState = !0;
this.setShapeColorNum();
}
if (hs.tp.isClassBlocksProducer_BlocksProducerValidate_ProxySetRecordOperationColor(t)) {
if (!this.getIsTrigger()) return;
t.returnState = !0;
t.replace = !0;
}
};
e.prototype.gainColor = function() {
if (1 == this.state.todayGamesNum) {
var t = [ 1, 2, 3, 4, 5, 6, 7 ];
this.shuffleArrayInPlace(t);
this.setColor(t);
} else {
var e = storage.getItem(this.saveColorKey, {}), r = 0, o = 0;
for (var a in e) {
var s = e[a].num;
if (s > o) {
o = s;
r = parseInt(a);
}
}
t = [ 1, 2, 3, 4, 5, 6, 7 ];
if (r > 0) {
var i = e[r].color;
t = t.filter(function(t) {
return t !== i;
});
this.shuffleArrayInPlace(t);
t.splice(r - 1, 0, i);
} else this.shuffleArrayInPlace(t);
this.setColor(t);
}
};
e.prototype.setColor = function(t) {
this.state.colorMap = {
1: t[0],
2: t[0],
3: t[0],
4: t[1],
5: t[1],
6: t[2],
7: t[3]
};
};
e.prototype.getBlockType = function(t) {
var e = this.getShapeId(t);
return 1 == e || 2 == e || 3 == e ? 1 : 4 == e || 5 == e ? 2 : 6 == e ? 3 : 7 == e ? 4 : 0;
};
e.prototype.shuffleArrayInPlace = function(t) {
for (var e, r = t.length - 1; r > 0; r--) {
var o = Math.floor(Math.random() * (r + 1));
e = i([ t[o], t[r] ], 2), t[r] = e[0], t[o] = e[1];
}
return t;
};
e.prototype.getTodayStr = function() {
var t = new Date();
return t.getFullYear() + "_" + (t.getMonth() + 1) + "_" + t.getDate();
};
e.prototype.getShapeId = function(t) {
for (var e in this.blockShapeMap) if (this.blockShapeMap[e].includes(t)) return +e;
return 0;
};
e.prototype.setShapeColorNum = function() {
var t, e, r = storage.getItem(this.saveColorKey, {}), o = hs.algorithmInfo.blockIdList;
try {
for (var a = n(o), s = a.next(); !s.done; s = a.next()) {
var i = s.value, l = this.getShapeId(i);
if (l > 0) {
var c = this.getBlockType(i);
r[c] || (r[c] = {
num: 0,
color: 0
});
var h = r[c].num + 1;
r[c].num = h;
r[c].color = this.state.colorMap[l];
}
}
} catch (e) {
t = {
error: e
};
} finally {
try {
s && !s.done && (e = a.return) && e.call(a);
} finally {
if (t) throw t.error;
}
}
storage.setItem(this.saveColorKey, r);
};
e.prototype.getIsTrigger = function(t) {
void 0 === t && (t = !0);
return !(t && storage.getItem("classGuideStep", 0) <= 2) && !(storage.getItem("classSolidColor", 0) > 0 || hs.skinInfo.skinEnabled);
};
return s([ classId("ShapeColorProposal2Trait") ], e);
}(Trait);
r.ShapeColorProposal2Trait = l;
cc._RF.pop();
}, {} ]
}, {}, [ "ShapeColorProposal2Trait" ]);
//# sourceMappingURL=index.js.map
