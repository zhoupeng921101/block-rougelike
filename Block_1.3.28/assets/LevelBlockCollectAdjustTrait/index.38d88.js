window.__require = function e(t, r, o) {
function n(i, l) {
if (!r[i]) {
if (!t[i]) {
var u = i.split("/");
u = u[u.length - 1];
if (!t[u]) {
var s = "function" == typeof __require && __require;
if (!l && s) return s(u, !0);
if (a) return a(u, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = u;
}
var c = r[i] = {
exports: {}
};
t[i][0].call(c.exports, function(e) {
return n(t[i][1][e] || e);
}, c, c.exports, e, t, r, o);
}
return r[i].exports;
}
for (var a = "function" == typeof __require && __require, i = 0; i < o.length; i++) n(o[i]);
return n;
}({
LevelBlockCollectAdjustTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "bdace56slBD1r6Due+Q8hTs", "LevelBlockCollectAdjustTrait");
var o, n = this && this.__extends || (o = function(e, t) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
o(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), a = this && this.__decorate || function(e, t, r, o) {
var n, a = arguments.length, i = a < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(e, t, r, o); else for (var l = e.length - 1; l >= 0; l--) (n = e[l]) && (i = (a < 3 ? n(i) : a > 3 ? n(t, r, i) : n(t, r)) || i);
return a > 3 && i && Object.defineProperty(t, r, i), i;
}, i = this && this.__values || function(e) {
var t = "function" == typeof Symbol && Symbol.iterator, r = t && e[t], o = 0;
if (r) return r.call(e);
if (e && "number" == typeof e.length) return {
next: function() {
e && o >= e.length && (e = void 0);
return {
value: e && e[o++],
done: !e
};
}
};
throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, l = this && this.__read || function(e, t) {
var r = "function" == typeof Symbol && e[Symbol.iterator];
if (!r) return e;
var o, n, a = r.call(e), i = [];
try {
for (;(void 0 === t || t-- > 0) && !(o = a.next()).done; ) i.push(o.value);
} catch (e) {
n = {
error: e
};
} finally {
try {
o && !o.done && (r = a.return) && r.call(a);
} finally {
if (n) throw n.error;
}
}
return i;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.LevelBlockCollectAdjustTrait = void 0;
var u = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.adjustData = {
roundGen6Array: [ 0, 0, 0 ],
onlyGenOne: !1
};
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ChapterGame_GameInfoUpdate_Proxy",
methodName: "updateChapterGameNumAfter"
} ];
};
t.prototype.onCreate = function() {
this.adjustData = storage.getItem("LevelBlockCollectAdjustTraitKey", {
roundGen6Array: [ 0, 0, 0 ],
onlyGenOne: !1
});
};
t.prototype.onActive = function(e) {
if (hs.tp.isChapterCollectionProducer_ProxyProduceCollection(e)) {
if (hs.algorithmStrategyInfo.algorithmSourceLevel1 === hs.ChapterAlgorithmSourceType.TravelRevive || hs.algorithmStrategyInfo.algorithmSourceLevel1 === hs.ChapterAlgorithmSourceType.TravelReviveTrait) return;
this.produceItemsForBlock();
e.returnState = !0;
e.replace = !0;
}
hs.tp.isChapterGame_GameInfoUpdate_ProxyUpdateChapterGameNumAfter(e) && this.resetData();
};
t.prototype.produceItemsForBlock = function() {
var e, t, r = this.getElementsInfo(), o = r.elementsInfo, n = r.totalNumInBoard, a = r.totalNumLeft;
if (0 !== a) {
var l = this.getGenNumArray(n), u = this.getBlockLenArray();
this.adjustGenNumArrayByBlockLen(l, u);
var s = l.reduce(function(e, t) {
return e + t;
}, 0);
s > a && (s = a);
var c = this.getElementArrayByWeight(o, s), f = [], h = 0;
try {
for (var p = i(l), y = p.next(); !y.done; y = p.next()) {
var d = y.value;
f.push(c.slice(h, h + d));
h += d;
}
} catch (t) {
e = {
error: t
};
} finally {
try {
y && !y.done && (t = p.return) && t.call(p);
} finally {
if (e) throw e.error;
}
}
this.generateElementPosOnBlock(u, f);
}
};
t.prototype.getElementsInfo = function() {
for (var e = hs.chapterConfigInfo.chapterDatasCfg[hs.chapterGameInfo.chapterNum].Condition.RequiredCollections, t = hs.chapterCollectInfo.collectRemainCollectItems, r = e.length, o = hs.boardInfo.faceBlocks, n = [], a = 0, i = 0, l = function(r) {
var l = e[r], u = o.reduce(function(e, t) {
return e + t.reduce(function(e, t) {
return e + (t == l.Key ? 1 : 0);
}, 0);
}, 0);
a += u;
var s = t[l.Key];
if (0 == s) return "continue";
var c = l.Value, f = c - (c - s);
if (f > 0) {
n.push([ l.Key, f ]);
i += f;
}
}, u = 0; u < r; u++) l(u);
return {
elementsInfo: n,
totalNumInBoard: a,
totalNumLeft: i
};
};
t.prototype.getBlockLenArray = function() {
for (var e = [ 0, 0, 0 ], t = 0; t < 3; t++) {
var r = hs.AlgorithmPosType[hs.chapterAlgorithmInfo.blockIdList[t]].length;
e[t] = r;
}
return e;
};
t.prototype.adjustGenNumArrayByBlockLen = function(e, t) {
for (var r = 0, o = 0; o < e.length; o++) if (e[o] > t[o]) {
r += e[o] - t[o];
e[o] = t[o];
} else for (;e[o] < t[o] && r > 0; ) {
e[o]++;
r--;
}
};
t.prototype.getGenNumArray = function(e) {
var t = [ 0, 0, 0 ];
if (this.adjustData.onlyGenOne) {
t[this.randomValueByIndex([ 0, 1, 2 ])] = 1;
this.resetData();
} else {
var r = hs.BinaryBoard.getWeightValue(), o = e <= 0 ? 35 : r / e;
if (o >= 35) {
t[0] = this.randomValueByIndex([ 2, 3 ]);
t[1] = this.randomValueByIndex([ 2, 3 ]);
t[2] = 1;
} else if (o > 25 && o < 35) {
t[0] = this.randomValueByIndex([ 2, 3 ]);
t[1] = 1;
} else t[this.randomValueByIndex([ 0, 1, 2 ])] = 1;
if (t.reduce(function(e, t) {
return e + t;
}, 0) >= 6) {
for (var n = -1, a = 0; a < this.adjustData.roundGen6Array.length; a++) if (1 != this.adjustData.roundGen6Array[a]) {
this.adjustData.roundGen6Array[a] = 1;
n = a;
break;
}
if (n >= 2) {
(t = [ 0, 0, 0 ])[this.randomValueByIndex([ 0, 1, 2 ])] = 1;
this.adjustData.onlyGenOne = !0;
}
this.saveLocalData();
} else this.resetData();
}
return t;
};
t.prototype.randomValueByIndex = function(e) {
return e[Math.floor(Math.random() * e.length)];
};
t.prototype.getElementArrayByWeight = function(e, t) {
if (0 == t) return [];
for (var r = Array.from(Array(e.length), function(t, r) {
var o = e[r];
return [ o[0], 1, o[1] ];
}), o = [], n = 0; n < t && r.length > 0; n++) {
var a = this.getElementByWeight(r), i = a[0];
o.push(i);
0 == --a[2] && r.splice(r.indexOf(a), 1);
}
return o;
};
t.prototype.getElementByWeight = function(e) {
var t, r, o = e.reduce(function(e, t) {
var r = l(t, 2);
r[0];
return e + r[1];
}, 0), n = Math.random() * o;
try {
for (var a = i(e), u = a.next(); !u.done; u = a.next()) {
var s = u.value;
if (n < s[1]) return s;
n -= s[1];
}
} catch (e) {
t = {
error: e
};
} finally {
try {
u && !u.done && (r = a.return) && r.call(a);
} finally {
if (t) throw t.error;
}
}
return e[e.length - 1];
};
t.prototype.generateElementPosOnBlock = function(e, t) {
for (var r = [ [], [], [] ], o = 0; o < 3; o++) {
var n = e[o], a = t[o], i = a.length;
if (-1 != [ 2 ].indexOf(i) && n >= 3) for (var l = Math.floor(Math.random() * (n - 2 + 1)), u = 0; u < i; u++) {
var s = a[u], c = (l + 2 * u) % n;
r[o].push({
Key: s,
pos: c
});
} else if (-1 != [ 3 ].indexOf(i) && n >= 5) for (l = Math.floor(Math.random() * (n - 3 + 1)), 
u = 0; u < i; u++) {
s = a[u], c = (l + 2 * u) % n;
r[o].push({
Key: s,
pos: c
});
} else if (i > 1 && n >= 2 * i) for (l = Math.floor(Math.random() * (n - 2 * i + 1)), 
u = 0; u < i; u++) {
s = a[u], c = (l + 2 * u) % n;
r[o].push({
Key: s,
pos: c
});
} else {
var f = Math.min(n, i);
for (l = Math.floor(Math.random() * n), u = 0; u < f; u++) {
s = a[u], c = (l + u) % n;
r[o].push({
Key: s,
pos: c
});
}
}
}
for (var h = [], p = function(e) {
if (r[e].length > 0) {
var t = {};
r[e].forEach(function(e) {
t[e.pos] = e;
});
h.push(t);
} else h.push({});
}, y = 0; y < r.length; y++) p(y);
var d = [].concat(h);
storage.setItem("chapterCollectionLists", d);
};
t.prototype.resetData = function() {
this.adjustData.roundGen6Array = [ 0, 0, 0 ];
this.adjustData.onlyGenOne = !1;
this.saveLocalData();
};
t.prototype.saveLocalData = function() {
storage.setItem("LevelBlockCollectAdjustTraitKey", this.adjustData);
};
return a([ classId("LevelBlockCollectAdjustTrait") ], t);
}(Trait);
r.LevelBlockCollectAdjustTrait = u;
cc._RF.pop();
}, {} ]
}, {}, [ "LevelBlockCollectAdjustTrait" ]);
//# sourceMappingURL=index.js.map
