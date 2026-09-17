window.__require = function t(e, r, o) {
function a(i, n) {
if (!r[i]) {
if (!e[i]) {
var l = i.split("/");
l = l[l.length - 1];
if (!e[l]) {
var p = "function" == typeof __require && __require;
if (!n && p) return p(l, !0);
if (s) return s(l, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = l;
}
var c = r[i] = {
exports: {}
};
e[i][0].call(c.exports, function(t) {
return a(e[i][1][t] || t);
}, c, c.exports, t, e, r, o);
}
return r[i].exports;
}
for (var s = "function" == typeof __require && __require, i = 0; i < o.length; i++) a(o[i]);
return a;
}({
ShapeColorProposal1Trait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "ad485vEPXpA9LF8xd1GyTLU", "ShapeColorProposal1Trait");
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
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ShapeColorProposal1Trait = void 0;
var n = function(t) {
a(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.saveKey = "ShapeColorProposal1Trait";
e.shapeIdMap = {
1: "O",
2: "I",
3: "/",
4: "SZ",
5: "T",
6: "JL",
7: "复活"
};
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
} else if (this.state.todayStr != o) {
this.state.todayStr = o;
if (0 === Object.keys(this.state.colorMap).length) {
this.state.todayGamesNum = 1;
this.gainColor();
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
}
if (hs.tp.isClassBlocksProducer_BlocksProducerValidate_ProxySetRecordOperationColor(t)) {
if (!this.getIsTrigger()) return;
t.returnState = !0;
t.replace = !0;
}
};
e.prototype.gainColor = function() {
if (this.state.todayGamesNum <= 2) this.state.colorMap = {
1: 4,
2: 1,
3: 7,
4: 3,
5: 2,
6: 5,
7: 6
}; else if ((this.state.todayGamesNum + 1) % 2 == 0) {
var t = [ 1, 2, 3, 4, 5, 6, 7 ];
this.shuffleArrayInPlace(t);
this.state.colorMap = {
1: t[0],
2: t[1],
3: t[2],
4: t[3],
5: t[4],
6: t[5],
7: t[6]
};
}
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
e.prototype.getIsTrigger = function(t) {
void 0 === t && (t = !0);
return !(t && storage.getItem("classGuideStep", 0) <= 2) && !(storage.getItem("classSolidColor", 0) > 0 || hs.skinInfo.skinEnabled);
};
return s([ classId("ShapeColorProposal1Trait") ], e);
}(Trait);
r.ShapeColorProposal1Trait = n;
cc._RF.pop();
}, {} ]
}, {}, [ "ShapeColorProposal1Trait" ]);
//# sourceMappingURL=index.js.map
