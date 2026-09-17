window.__require = function o(r, e, n) {
function t(i, s) {
if (!e[i]) {
if (!r[i]) {
var l = i.split("/");
l = l[l.length - 1];
if (!r[l]) {
var d = "function" == typeof __require && __require;
if (!s && d) return d(l, !0);
if (a) return a(l, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = l;
}
var u = e[i] = {
exports: {}
};
r[i][0].call(u.exports, function(o) {
return t(r[i][1][o] || o);
}, u, u.exports, o, r, e, n);
}
return e[i].exports;
}
for (var a = "function" == typeof __require && __require, i = 0; i < n.length; i++) t(n[i]);
return t;
}({
NewUserEarlyRoundsBoardAnimConfig: [ function(o, r, e) {
"use strict";
cc._RF.push(r, "6dc36CglCFCe4mHSxeFm4GX", "NewUserEarlyRoundsBoardAnimConfig");
Object.defineProperty(e, "__esModule", {
value: !0
});
e.NEW_USER_EARLY_ROUNDS_INIT_BOARD_ANIM_CONFIG = void 0;
e.NEW_USER_EARLY_ROUNDS_INIT_BOARD_ANIM_CONFIG = {
enabled: 1,
longPressMs: 300,
patterns: [],
boards: [ {
bid: 1,
patterns: [ {
matchColor: 7,
steps: [ {
color: 7,
durationMs: 250
}, {
color: 2,
durationMs: 250
}, {
color: 7,
durationMs: 250
}, {
color: 2,
durationMs: 250
}, {
color: 7,
durationMs: 1e3
} ]
} ]
}, {
bid: 44,
patterns: [ {
matchColor: 5,
steps: [ {
color: 5,
durationMs: 600
}, {
color: 7,
durationMs: 400
}, {
color: 3,
durationMs: 400
}, {
color: 4,
durationMs: 400
} ]
} ]
}, {
bid: 48,
patterns: [ {
matchColor: 7,
steps: [ {
color: 7,
durationMs: 250
}, {
color: 4,
durationMs: 250
}, {
color: 7,
durationMs: 250
}, {
color: 4,
durationMs: 250
}, {
color: 7,
durationMs: 1e3
} ]
} ]
} ]
};
cc._RF.pop();
}, {} ],
NewUserEarlyRoundsBoardAnimInfo: [ function(o, r, e) {
"use strict";
cc._RF.push(r, "1d457dfInJEsq2jHYHHH2TY", "NewUserEarlyRoundsBoardAnimInfo");
var n = this && this.__values || function(o) {
var r = "function" == typeof Symbol && Symbol.iterator, e = r && o[r], n = 0;
if (e) return e.call(o);
if (o && "number" == typeof o.length) return {
next: function() {
o && n >= o.length && (o = void 0);
return {
value: o && o[n++],
done: !o
};
}
};
throw new TypeError(r ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.newUserEarlyRoundsBoardAnimInfo = e.NewUserEarlyRoundsBoardAnimInfo = void 0;
var t = o("../NewUserEarlyRoundsBoardAnimConfig"), a = o("../NewUserEarlyRoundsBoardType"), i = o("./NewUserEarlyRoundsBoardInfo"), s = function() {
function o() {
this.running = !1;
this.activeAnimNodes = new WeakSet();
this.touchStartAtMs = 0;
this.touching = !1;
}
o.prototype.clear = function() {
this.stopInitBoardAnim();
this.running = !1;
this.activeAnimNodes = new WeakSet();
this.touchStartAtMs = 0;
this.touching = !1;
};
o.prototype.stopInitBoardAnim = function() {
var o, r, e, n;
if (this.running) {
this.running = !1;
this.activeAnimNodes = new WeakSet();
var t = null === (o = hs.boardRendererInfo) || void 0 === o ? void 0 : o.blocks;
if (t) for (var s = 0; s < Object.keys(t).length; s++) {
var l = t[s];
if (l) for (var d = 0; d < Object.keys(l).length; d++) {
var u = l[d];
if (u && cc.isValid(u)) {
var c = u.getComponent(hs.Block), h = null !== (e = null === (r = null == c ? void 0 : c.block) || void 0 === r ? void 0 : r.node) && void 0 !== e ? e : null;
if (h && cc.isValid(h)) {
null === (n = h.stopActionByTag) || void 0 === n || n.call(h, a.INIT_BOARD_ANIM_ACTION_TAG);
i.newUserEarlyRoundsBoardInfo.resetManualInitBoardBlockColor(c);
}
}
}
}
}
};
o.prototype.buildPatternAction = function(o, r) {
var e, t;
if (!r || r.length <= 0) return null;
var a = [], i = function(r) {
var e = r.durationMs / 1e3;
if (!Number.isFinite(e) || e <= 0) return "continue";
a.push(cc.callFunc(function() {
return o(r.color);
}));
a.push(cc.delayTime(e));
};
try {
for (var s = n(r), l = s.next(); !l.done; l = s.next()) i(l.value);
} catch (o) {
e = {
error: o
};
} finally {
try {
l && !l.done && (t = s.return) && t.call(s);
} finally {
if (e) throw e.error;
}
}
return a.length <= 0 ? null : cc.repeatForever(cc.sequence(a));
};
o.prototype.isInAnim = function(o) {
return !(!o || !cc.isValid(o)) && this.running && this.activeAnimNodes.has(o);
};
o.prototype.runPatternActionForPosition = function(o, r, e, n) {
var t, s, l, d, u, c, h = i.newUserEarlyRoundsBoardInfo.positionColorMap[o], f = r.get(h);
if (!f) return !1;
var p = o.split("_"), y = parseInt(p[0], 10), B = parseInt(p[1], 10);
if (!Number.isFinite(y) || !Number.isFinite(B)) return !1;
var v = null === (t = e[y]) || void 0 === t ? void 0 : t[B];
if ("number" != typeof v || v !== h) return !1;
var I = null === (s = null == n ? void 0 : n[y]) || void 0 === s ? void 0 : s[B];
if (!I || !cc.isValid(I)) return !1;
var g = I.getComponent(hs.Block), R = null !== (d = null === (l = null == g ? void 0 : g.block) || void 0 === l ? void 0 : l.node) && void 0 !== d ? d : null;
if (!R || !cc.isValid(R)) return !1;
var E = this.buildPatternAction(function(o) {
i.newUserEarlyRoundsBoardInfo.setBlockColor(g, o, !1);
}, f.steps);
if (!E) return !1;
null === (u = R.stopActionByTag) || void 0 === u || u.call(R, a.INIT_BOARD_ANIM_ACTION_TAG);
null === (c = E.setTag) || void 0 === c || c.call(E, a.INIT_BOARD_ANIM_ACTION_TAG);
this.activeAnimNodes.add(R);
R.runAction(E);
return !0;
};
o.prototype.startInitboardAnim = function() {
var o, r, e, a, s, l, d, u = t.NEW_USER_EARLY_ROUNDS_INIT_BOARD_ANIM_CONFIG;
if (u && 1 === u.enabled && !this.running) {
var c = i.newUserEarlyRoundsBoardInfo.boardId, h = i.newUserEarlyRoundsBoardInfo.positionColorMap, f = Cinst(hs.Board), p = null !== (l = null === (s = null == f ? void 0 : f.state) || void 0 === s ? void 0 : s.boards) && void 0 !== l ? l : null, y = null === (d = hs.boardRendererInfo) || void 0 === d ? void 0 : d.blocks;
if (!(c <= 0 || !h || Object.keys(h).length <= 0) && Array.isArray(p) && y) {
var B = Array.isArray(u.boards) ? u.boards.find(function(o) {
return o && o.bid === c;
}) : null, v = B && Array.isArray(B.patterns) ? B.patterns : u.patterns;
if (v && !(v.length <= 0)) {
var I = new Map();
try {
for (var g = n(v), R = g.next(); !R.done; R = g.next()) {
var E = R.value;
"number" == typeof (null == E ? void 0 : E.matchColor) && Array.isArray(E.steps) && E.steps.length > 0 && I.set(E.matchColor, {
steps: E.steps
});
}
} catch (r) {
o = {
error: r
};
} finally {
try {
R && !R.done && (r = g.return) && r.call(g);
} finally {
if (o) throw o.error;
}
}
if (!(I.size <= 0)) {
var m = 0;
try {
for (var _ = n(Object.keys(h)), C = _.next(); !C.done; C = _.next()) {
var w = C.value;
this.runPatternActionForPosition(w, I, p, y) && (m += 1);
}
} catch (o) {
e = {
error: o
};
} finally {
try {
C && !C.done && (a = _.return) && a.call(_);
} finally {
if (e) throw e.error;
}
}
m > 0 && (this.running = !0);
}
}
}
}
};
return o;
}();
e.NewUserEarlyRoundsBoardAnimInfo = s;
e.newUserEarlyRoundsBoardAnimInfo = new s();
cc._RF.pop();
}, {
"../NewUserEarlyRoundsBoardAnimConfig": "NewUserEarlyRoundsBoardAnimConfig",
"../NewUserEarlyRoundsBoardType": "NewUserEarlyRoundsBoardType",
"./NewUserEarlyRoundsBoardInfo": "NewUserEarlyRoundsBoardInfo"
} ],
NewUserEarlyRoundsBoardConfig: [ function(o, r, e) {
"use strict";
cc._RF.push(r, "53e855PzPpJnr3wbyALrwto", "NewUserEarlyRoundsBoardConfig");
Object.defineProperty(e, "__esModule", {
value: !0
});
e.NewUserEarlyRoundsBoardConfig = e.TOTAL_BOARD_COUNT = void 0;
e.TOTAL_BOARD_COUNT = 164;
e.NewUserEarlyRoundsBoardConfig = [ {
boardId: 1,
boardData: [ [ -1, -1, -1, 2, 2, 2, -1, -1 ], [ -1, -1, 2, 2, 2, 2, 2, -1 ], [ -1, -1, 2, 7, 2, 7, 2, -1 ], [ -1, 2, 2, 2, 4, 2, 2, 2 ], [ -1, 2, 2, 2, 2, 2, 2, 2 ], [ -1, -1, 2, 2, 2, 2, 2, -1 ], [ -1, -1, -1, 4, -1, 4, -1, -1 ], [ 6, 6, 6, -1, -1, -1, 6, 6 ] ],
producerBlocks: [ 24, 10, 32 ],
blocksColors: [ 7, 2, 4 ],
guideTargetCell: {
row: 7,
col: 4
},
move: [ {
x: 0,
y: -553.75
}, {
x: 0,
y: -245.75
} ],
spineTargetPositions: [ [ 7, 3 ], [ 7, 4 ], [ 7, 5 ] ]
}, {
boardId: 12,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, 4, 6, 1, 2, -1 ], [ -1, -1, -1, 3, -1, -1, 3, -1 ], [ -1, -1, -1, 2, -1, -1, 4, -1 ], [ -1, -1, -1, 1, 5, 6, 7, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 13, 9, 13 ],
blocksColors: [ 7, 4, 2 ]
}, {
boardId: 14,
boardData: [ [ -1, 4, -1, -1, -1, -1, 4, -1 ], [ -1, -1, 4, -1, -1, 4, -1, -1 ], [ 4, 4, 4, -1, -1, 4, 4, 4 ], [ 4, -1, -1, -1, -1, -1, -1, 4 ], [ -1, -1, 6, -1, -1, 6, -1, -1 ], [ 4, -1, -1, -1, -1, -1, -1, 4 ], [ 4, 4, 4, -1, -1, 4, 4, 4 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 18, 14, 9 ],
blocksColors: [ 7, 2, 1 ]
}, {
boardId: 19,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, 5, -1, 5, -1 ], [ 6, 6, 6, 6, 6, 6, 6, -1 ], [ -1, -1, -1, 6, 6, 6, 6, 6 ], [ -1, 6, 6, 6, 6, 6, 6, -1 ] ],
producerBlocks: [ 34, 30, 11 ],
blocksColors: [ 2, 3, 1 ]
}, {
boardId: 20,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ 2, 7, 4, -1, -1, 2, 4, 2 ], [ 3, -1, -1, -1, -1, -1, -1, 1 ], [ -1, -1, 6, -1, -1, 5, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 14, 18, 9 ],
blocksColors: [ 4, 4, 2 ]
}, {
boardId: 23,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ 4, 4, -1, 7, 7, -1, 3, -1 ], [ 4, -1, -1, 7, -1, -1, 3, -1 ], [ 4, 4, -1, 7, 7, -1, 3, 3 ] ],
producerBlocks: [ 25, 25, 12 ],
blocksColors: [ 5, 4, 5 ]
}, {
boardId: 24,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 1, 7, 5, -1, -1, -1 ], [ -1, -1, -1, -1, 7, -1, -1, -1 ], [ -1, -1, -1, -1, 1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, 6, 2, 4 ], [ -1, -1, -1, -1, -1, 2, -1, -1 ], [ -1, -1, -1, -1, -1, 4, -1, -1 ] ],
producerBlocks: [ 9, 9, 13 ],
blocksColors: [ 7, 2, 2 ]
}, {
boardId: 44,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, 5, -1, -1, -1, -1, -1, -1 ], [ 5, 2, 5, -1, -1, -1, -1, -1 ], [ -1, 5, -1, -1, 7, -1, -1, -1 ], [ -1, -1, -1, 7, 2, 7, -1, -1 ], [ -1, -1, -1, -1, 7, -1, -1, -1 ] ],
producerBlocks: [ 33, 19, 16 ],
blocksColors: [ 4, 2, 6 ]
}, {
boardId: 48,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ 4, 4, -1, -1, -1, -1, 4, 4 ], [ 4, -1, 4, 4, 4, 4, -1, 4 ], [ -1, 4, 4, 4, 4, 4, 4, -1 ], [ -1, 4, 7, 4, 4, 7, 4, -1 ], [ -1, 4, 2, 2, 2, 2, 4, -1 ], [ -1, 4, 2, 1, 1, 2, 4, -1 ], [ -1, -1, 4, 2, 2, 4, -1, -1 ] ],
producerBlocks: [ 38, 9, 37 ],
blocksColors: [ 3, 3, 7 ]
}, {
boardId: 101,
boardData: [ [ -1, 2, -1, -1, -1, -1, 2, -1 ], [ -1, -1, 2, -1, -1, 2, -1, -1 ], [ -1, 2, 2, 2, 2, 2, 2, -1 ], [ 2, -1, -1, -1, -1, -1, -1, 2 ], [ 2, -1, 7, -1, -1, 7, -1, 2 ], [ 2, -1, -1, -1, -1, -1, -1, 2 ], [ 2, -1, 2, 2, 2, 2, -1, 2 ], [ -1, 2, 2, 2, 2, 2, 2, -1 ] ],
producerBlocks: [ 9, 20, 25 ],
blocksColors: [ 2, 4, 7 ]
}, {
boardId: 102,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ 3, 3, 3, 3, 3, 3, 3, -1 ], [ -1, -1, -1, 2, 2, 2, 2, -1 ], [ -1, 1, 1, 2, 1, 1, 2, 1 ], [ -1, -1, -1, 2, -1, -1, 2, -1 ], [ 5, 5, 2, 2, 5, 5, 2, -1 ], [ -1, -1, -1, -1, -1, 2, 2, -1 ], [ -1, -1, 6, 6, 6, 6, 6, 6 ] ],
producerBlocks: [ 9, 8, 12 ],
blocksColors: [ 2, 4, 7 ]
}, {
boardId: 148,
boardData: [ [ -1, 7, -1, -1, -1, -1, 3, -1 ], [ 7, -1, 7, -1, -1, 3, -1, 3 ], [ -1, 7, 2, 2, 2, 2, 3, -1 ], [ -1, -1, 2, -1, -1, 2, -1, -1 ], [ -1, -1, 2, -1, -1, 2, -1, -1 ], [ -1, 4, 2, 2, 2, 2, 1, -1 ], [ 4, -1, 4, -1, -1, 1, -1, 1 ], [ -1, 4, -1, -1, -1, -1, 1, -1 ] ],
producerBlocks: [ 9, 39, 41 ],
blocksColors: [ 2, 4, 6 ]
}, {
boardId: 180,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, 7, -1, -1, -1, -1, 7, -1 ], [ -1, 7, 7, 7, 7, 7, 7, -1 ], [ -1, -1, -1, 2, 2, -1, -1, -1 ] ],
producerBlocks: [ 24, 36, 23 ],
blocksColors: [ 2, 4, 6 ]
}, {
boardId: 99999,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [],
blocksColors: []
} ];
cc._RF.pop();
}, {} ],
NewUserEarlyRoundsBoardGuideInfo: [ function(o, r, e) {
"use strict";
cc._RF.push(r, "9449fqIJUtPH722LSa3o2uE", "NewUserEarlyRoundsBoardGuideInfo");
var n = this && this.__awaiter || function(o, r, e, n) {
return new (e || (e = Promise))(function(t, a) {
function i(o) {
try {
l(n.next(o));
} catch (o) {
a(o);
}
}
function s(o) {
try {
l(n.throw(o));
} catch (o) {
a(o);
}
}
function l(o) {
o.done ? t(o.value) : (r = o.value, r instanceof e ? r : new e(function(o) {
o(r);
})).then(i, s);
var r;
}
l((n = n.apply(o, r || [])).next());
});
}, t = this && this.__generator || function(o, r) {
var e, n, t, a, i = {
label: 0,
sent: function() {
if (1 & t[0]) throw t[1];
return t[1];
},
trys: [],
ops: []
};
return a = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
return this;
}), a;
function s(o) {
return function(r) {
return l([ o, r ]);
};
}
function l(a) {
if (e) throw new TypeError("Generator is already executing.");
for (;i; ) try {
if (e = 1, n && (t = 2 & a[0] ? n.return : a[0] ? n.throw || ((t = n.return) && t.call(n), 
0) : n.next) && !(t = t.call(n, a[1])).done) return t;
(n = 0, t) && (a = [ 2 & a[0], t.value ]);
switch (a[0]) {
case 0:
case 1:
t = a;
break;

case 4:
i.label++;
return {
value: a[1],
done: !1
};

case 5:
i.label++;
n = a[1];
a = [ 0 ];
continue;

case 7:
a = i.ops.pop();
i.trys.pop();
continue;

default:
if (!(t = i.trys, t = t.length > 0 && t[t.length - 1]) && (6 === a[0] || 2 === a[0])) {
i = 0;
continue;
}
if (3 === a[0] && (!t || a[1] > t[0] && a[1] < t[3])) {
i.label = a[1];
break;
}
if (6 === a[0] && i.label < t[1]) {
i.label = t[1];
t = a;
break;
}
if (t && i.label < t[2]) {
i.label = t[2];
i.ops.push(a);
break;
}
t[2] && i.ops.pop();
i.trys.pop();
continue;
}
a = r.call(o, i);
} catch (o) {
a = [ 6, o ];
n = 0;
} finally {
e = t = 0;
}
if (5 & a[0]) throw a[1];
return {
value: a[0] ? a[1] : void 0,
done: !0
};
}
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.newUserEarlyRoundsBoardGuideInfo = e.NewUserEarlyRoundsBoardGuideInfo = void 0;
var a = o("../NewUserEarlyRoundsBoardTraitUtil"), i = function() {
function o() {
this.spineHighlight = null;
this.guideComponent = null;
this.spineDataCache = new Map();
}
o.prototype.preloadSpineData = function(o) {
return n(this, void 0, Promise, function() {
var r, e;
return t(this, function(n) {
switch (n.label) {
case 0:
if (!(r = a.NewUserEarlyRoundsBoardTraitUtil.getSpinePath(o)) || this.spineDataCache.has(r)) return [ 2 ];
n.label = 1;

case 1:
n.trys.push([ 1, 3, , 4 ]);
return [ 4, hs.ResLoader.asyncLoadByBundle("NewUserEarlyRoundsBoardTrait", r, sp.SkeletonData) ];

case 2:
(e = n.sent()) && this.spineDataCache.set(r, e);
return [ 3, 4 ];

case 3:
n.sent();
return [ 3, 4 ];

case 4:
return [ 2 ];
}
});
});
};
o.prototype.createTargetHighlight = function(o, r) {
return n(this, void 0, Promise, function() {
var e, n;
return t(this, function(t) {
switch (t.label) {
case 0:
return storage.getItem("isFinishedGuide", !1) || this.spineHighlight ? [ 2 ] : (e = Cinst(hs.Board)) && cc.isValid(e.node) && cc.isValid(e.node.parent) ? (n = a.NewUserEarlyRoundsBoardTraitUtil.getSpinePath(o)) ? [ 4, this.createSpineHighlight(n, e.node, r) ] : [ 3, 2 ] : [ 2 ];

case 1:
t.sent();
t.label = 2;

case 2:
return [ 2 ];
}
});
});
};
o.prototype.createSpineHighlight = function(o, r, e) {
var i;
return n(this, void 0, Promise, function() {
var n, s, l, d, u;
return t(this, function(t) {
switch (t.label) {
case 0:
n = new cc.Node("SpineHighlight");
this.spineHighlight = n;
t.label = 1;

case 1:
t.trys.push([ 1, 4, , 5 ]);
return (s = this.spineDataCache.get(o)) ? [ 3, 3 ] : [ 4, hs.ResLoader.asyncLoadByBundle("NewUserEarlyRoundsBoardTrait", o, sp.SkeletonData) ];

case 2:
(s = t.sent()) && this.spineDataCache.set(o, s);
t.label = 3;

case 3:
if (!s) {
this.clearSpineHighlight();
return [ 2 ];
}
(l = n.addComponent(sp.Skeleton)).skeletonData = s;
l.premultipliedAlpha = !1;
if (e && e.length > 0) {
d = a.NewUserEarlyRoundsBoardTraitUtil.calculateTargetCenter(e);
n.setPosition(r.x + d.x, r.y + d.y);
}
n.parent = r.parent;
n.setSiblingIndex(r.getSiblingIndex() + 1);
u = null !== (i = cc.director._kSpeed) && void 0 !== i ? i : 1;
l.timeScale = 1 / u;
l.setAnimation(0, "in", !0);
return [ 3, 5 ];

case 4:
t.sent();
this.clearSpineHighlight();
return [ 3, 5 ];

case 5:
return [ 2 ];
}
});
});
};
o.prototype.clearSpineHighlight = function() {
if (this.spineHighlight && cc.isValid(this.spineHighlight)) {
this.spineHighlight.removeFromParent();
this.spineHighlight.destroy();
}
this.spineHighlight = null;
};
o.prototype.clear = function() {
var o, r;
this.clearSpineHighlight();
if (this.guideComponent) {
null === (r = (o = this.guideComponent).setState) || void 0 === r || r.call(o, {
showDarkMask: !1,
showHand: !1
});
this.guideComponent = null;
}
};
return o;
}();
e.NewUserEarlyRoundsBoardGuideInfo = i;
e.newUserEarlyRoundsBoardGuideInfo = new i();
cc._RF.pop();
}, {
"../NewUserEarlyRoundsBoardTraitUtil": "NewUserEarlyRoundsBoardTraitUtil"
} ],
NewUserEarlyRoundsBoardInfo: [ function(o, r, e) {
"use strict";
cc._RF.push(r, "fcfaal8z6VLuaO+Sp/L8l1L", "NewUserEarlyRoundsBoardInfo");
var n = this && this.__assign || function() {
return (n = Object.assign || function(o) {
for (var r, e = 1, n = arguments.length; e < n; e++) {
r = arguments[e];
for (var t in r) Object.prototype.hasOwnProperty.call(r, t) && (o[t] = r[t]);
}
return o;
}).apply(this, arguments);
}, t = this && this.__decorate || function(o, r, e, n) {
var t, a = arguments.length, i = a < 3 ? r : null === n ? n = Object.getOwnPropertyDescriptor(r, e) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(o, r, e, n); else for (var s = o.length - 1; s >= 0; s--) (t = o[s]) && (i = (a < 3 ? t(i) : a > 3 ? t(r, e, i) : t(r, e)) || i);
return a > 3 && i && Object.defineProperty(r, e, i), i;
}, a = this && this.__values || function(o) {
var r = "function" == typeof Symbol && Symbol.iterator, e = r && o[r], n = 0;
if (e) return e.call(o);
if (o && "number" == typeof o.length) return {
next: function() {
o && n >= o.length && (o = void 0);
return {
value: o && o[n++],
done: !o
};
}
};
throw new TypeError(r ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.newUserEarlyRoundsBoardInfo = e.NewUserEarlyRoundsBoardInfo = void 0;
var i = o("../NewUserEarlyRoundsBoardTraitUtil"), s = o("../NewUserEarlyRoundsBoardType"), l = o("../NewUserEarlyRoundsBoardConfig"), d = function() {
function o() {
this.tempAllowSkinNodes = new WeakSet();
this.blockNodeToPositionKeyCache = new Map();
this.positionColorMap = {};
this.boardId = 0;
this.currentBoardIndex = -1;
this.currentGameNum = -1;
this.firstRoundBlocksApplied = !1;
this.nextGameUseEmptyBoard = !1;
}
o.prototype.buildBlockNodeToPositionKeyCache = function() {
var o, r = null === (o = hs.boardRendererInfo) || void 0 === o ? void 0 : o.blocks;
this.blockNodeToPositionKeyCache = new Map();
if (r) for (var e = 0; e < Object.keys(r).length; e++) {
var n = r[e];
if (n) for (var t = 0; t < Object.keys(n).length; t++) {
var a = n[t];
a && cc.isValid(a) && this.blockNodeToPositionKeyCache.set(a, e + "_" + t);
}
}
};
o.prototype.getPositionKeyFromBlockNode = function(o) {
var r, e;
0 === this.blockNodeToPositionKeyCache.size && this.buildBlockNodeToPositionKeyCache();
var n = null !== (r = this.blockNodeToPositionKeyCache.get(o)) && void 0 !== r ? r : null;
if (null === n) {
this.buildBlockNodeToPositionKeyCache();
n = null !== (e = this.blockNodeToPositionKeyCache.get(o)) && void 0 !== e ? e : null;
}
return n;
};
o.prototype.markManualInitBoardBlock = function(o, r) {
if (o && cc.isValid(o) && "number" == typeof r && !(r <= 0)) {
var e = this.getPositionKeyFromBlockNode(o);
null == e || "" === e || e in this.positionColorMap || (this.positionColorMap[e] = r);
}
};
o.prototype.getManualInitBoardBlockInitialSourceColor = function(o) {
if (!o || !cc.isValid(o)) return null;
var r = this.getPositionKeyFromBlockNode(o);
if (null == r || "" === r) return null;
var e = this.positionColorMap[r];
return "number" == typeof e ? e : null;
};
o.prototype.setBlockColor = function(o, r, e) {
void 0 === e && (e = !1);
"number" != typeof r || !Number.isFinite(r) || r <= 0 || null == o || o.setState({
color: r,
sourceColor: r,
canEliminate: e
}, !0);
};
o.prototype.resetManualInitBoardBlockColor = function(o) {
var r, e = null !== (r = null == o ? void 0 : o.node) && void 0 !== r ? r : null;
if (e && cc.isValid(e)) {
var n = this.getManualInitBoardBlockInitialSourceColor(e);
if (null !== n) {
this.setManualInitBoardTempAllowSkin(e, !1);
this.setBlockColor(o, n, !1);
}
}
};
o.prototype.clearManualInitBoardBlock = function(o) {
if (o && cc.isValid(o)) {
var r = this.getPositionKeyFromBlockNode(o);
if (null != r && "" !== r && r in this.positionColorMap) {
delete this.positionColorMap[r];
this.flushPositionColorMap();
}
}
};
o.prototype.deletePositionColorMapKeys = function(o) {
var r, e, n = this.positionColorMap, t = 0;
try {
for (var i = a(o), s = i.next(); !s.done; s = i.next()) {
var l = s.value;
if (l in n) {
delete n[l];
t++;
}
}
} catch (o) {
r = {
error: o
};
} finally {
try {
s && !s.done && (e = i.return) && e.call(i);
} finally {
if (r) throw r.error;
}
}
t > 0 && this.flushPositionColorMap();
return t;
};
o.prototype.clearPosMap = function() {
this.positionColorMap = {};
};
o.prototype.flushPositionColorMap = function() {
this.positionColorMap = n({}, this.positionColorMap);
};
o.prototype.syncPositionColorMapFromStorage = function() {
var o, r, e, n, t = null === (e = hs.boardInfo) || void 0 === e ? void 0 : e.faceBlocks;
if (t) {
var i = storage.getItem(s.STORAGE_KEY_MANUAL_INIT_BOARD_POSITION_COLOR_MAP);
if (i && "object" == typeof i) {
var l = {};
try {
for (var d = a(Object.keys(i)), u = d.next(); !u.done; u = d.next()) {
var c = u.value, h = c.split("_"), f = parseInt(h[0], 10), p = parseInt(h[1], 10);
if (isNaN(f) || isNaN(p)) ; else {
var y = null === (n = t[f]) || void 0 === n ? void 0 : n[p];
"number" == typeof y && y > 0 && (l[c] = i[c]);
}
}
} catch (r) {
o = {
error: r
};
} finally {
try {
u && !u.done && (r = d.return) && r.call(d);
} finally {
if (o) throw o.error;
}
}
this.positionColorMap = l;
}
}
};
o.prototype.setManualInitBoardTempAllowSkin = function(o, r) {
o && cc.isValid(o) && (r ? this.tempAllowSkinNodes.add(o) : this.tempAllowSkinNodes.delete(o));
};
o.prototype.isManualInitBoardTempAllowSkin = function(o) {
return !(!o || !cc.isValid(o)) && this.tempAllowSkinNodes.has(o);
};
o.prototype.buildPositionColorMapFromSnapshot = function(o) {
var r, e = {};
if (!Array.isArray(o) || o.length <= 0) return e;
for (var n = 0; n < o.length; n++) for (var t = null !== (r = o[n]) && void 0 !== r ? r : [], a = 0; a < t.length; a++) {
var i = t[a];
"number" == typeof i && i > 0 && 10 !== i && (e[n + "_" + a] = i);
}
return e;
};
o.prototype.boardModified = function() {
var o, r, e, n, t = this;
if (!this.isManualBoard()) return !1;
var a = l.NewUserEarlyRoundsBoardConfig.find(function(o) {
return o.boardId === t.boardId;
});
if (!a || !Array.isArray(a.boardData)) return !1;
var i = this.buildPositionColorMapFromSnapshot(a.boardData), s = this.positionColorMap, d = Object.keys(i), u = Object.keys(s);
if (d.length !== u.length || d.some(function(o) {
return i[o] !== s[o];
})) return !0;
var c = null === (o = hs.boardInfo) || void 0 === o ? void 0 : o.faceBlocks;
if (!c) return !1;
for (var h = 0; h < a.boardData.length; h++) {
var f = null !== (r = a.boardData[h]) && void 0 !== r ? r : [], p = c[h];
if (!p) return !0;
for (var y = 0; y < f.length; y++) {
var B = null !== (e = f[y]) && void 0 !== e ? e : -1, v = null !== (n = p[y]) && void 0 !== n ? n : -1;
if ((B <= 0 || 10 === B) != (v <= 0 || 10 === v)) return !0;
}
}
return !1;
};
o.prototype.isManualBoard = function() {
return i.NewUserEarlyRoundsBoardTraitUtil.isManualBoard(this.boardId);
};
o.prototype.clear = function() {
this.tempAllowSkinNodes = new WeakSet();
this.blockNodeToPositionKeyCache = new Map();
};
t([ hs.storageProperty({
key: s.STORAGE_KEY_MANUAL_INIT_BOARD_POSITION_COLOR_MAP
}) ], o.prototype, "positionColorMap", void 0);
t([ hs.storageProperty({
key: s.STORAGE_KEY_BOARD_ID
}) ], o.prototype, "boardId", void 0);
t([ hs.storageProperty({
key: s.STORAGE_KEY_CURRENT_BOARD_INDEX
}) ], o.prototype, "currentBoardIndex", void 0);
t([ hs.storageProperty({
key: s.STORAGE_KEY_CURRENT_GAME_NUM
}) ], o.prototype, "currentGameNum", void 0);
t([ hs.storageProperty({
key: s.STORAGE_KEY_FIRST_ROUND_BLOCKS_APPLIED_BOARD
}) ], o.prototype, "firstRoundBlocksApplied", void 0);
t([ hs.storageProperty({
key: s.STORAGE_KEY_NEXT_GAME_USE_EMPTY_BOARD
}) ], o.prototype, "nextGameUseEmptyBoard", void 0);
return o;
}();
e.NewUserEarlyRoundsBoardInfo = d;
e.newUserEarlyRoundsBoardInfo = new d();
window.newUserEarlyRoundsBoardInfo = e.newUserEarlyRoundsBoardInfo;
cc._RF.pop();
}, {
"../NewUserEarlyRoundsBoardConfig": "NewUserEarlyRoundsBoardConfig",
"../NewUserEarlyRoundsBoardTraitUtil": "NewUserEarlyRoundsBoardTraitUtil",
"../NewUserEarlyRoundsBoardType": "NewUserEarlyRoundsBoardType"
} ],
NewUserEarlyRoundsBoardTraitUtil: [ function(o, r, e) {
"use strict";
cc._RF.push(r, "21784C9JUZJgoO8IyPmWdcI", "NewUserEarlyRoundsBoardTraitUtil");
var n = this && this.__assign || function() {
return (n = Object.assign || function(o) {
for (var r, e = 1, n = arguments.length; e < n; e++) {
r = arguments[e];
for (var t in r) Object.prototype.hasOwnProperty.call(r, t) && (o[t] = r[t]);
}
return o;
}).apply(this, arguments);
}, t = this && this.__values || function(o) {
var r = "function" == typeof Symbol && Symbol.iterator, e = r && o[r], n = 0;
if (e) return e.call(o);
if (o && "number" == typeof o.length) return {
next: function() {
o && n >= o.length && (o = void 0);
return {
value: o && o[n++],
done: !o
};
}
};
throw new TypeError(r ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, a = this && this.__read || function(o, r) {
var e = "function" == typeof Symbol && o[Symbol.iterator];
if (!e) return o;
var n, t, a = e.call(o), i = [];
try {
for (;(void 0 === r || r-- > 0) && !(n = a.next()).done; ) i.push(n.value);
} catch (o) {
t = {
error: o
};
} finally {
try {
n && !n.done && (e = a.return) && e.call(a);
} finally {
if (t) throw t.error;
}
}
return i;
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.NewUserEarlyRoundsBoardTraitUtil = void 0;
var i = o("./NewUserEarlyRoundsBoardConfig"), s = function() {
function o() {}
o.getSpinePath = function(r) {
return o.SPINE_PATH_MAP[r] || null;
};
o.computeGuideMoveFromScene = function(r, e, n) {
var t, a, i, s, l, d, u, c, h = Cinst(hs.ClassGame);
if (!h || !cc.isValid(h.node)) return null;
var f = null !== (t = h.guideContainer) && void 0 !== t ? t : null, p = null !== (a = h.boardContainer) && void 0 !== a ? a : null;
if (!cc.isValid(f) || !cc.isValid(p)) return null;
var y = cc.isValid(n) ? n : f, B = Cinst(hs.BlocksProducer), v = null !== (i = null == B ? void 0 : B.blocksContainer) && void 0 !== i ? i : null;
if (!B || !cc.isValid(B.node) || !cc.isValid(v)) return null;
var I = null !== (l = null === (s = v.children) || void 0 === s ? void 0 : s[1]) && void 0 !== l ? l : null;
if (!cc.isValid(I)) return null;
var g = I.convertToWorldSpaceAR(cc.Vec2.ZERO), R = y.convertToNodeSpaceAR(g), E = o.resolveGuideTargetCell(r, e);
if (!E) return null;
var m = E.row, _ = E.col, C = E.source, w = null === (d = hs.boardRendererInfo) || void 0 === d ? void 0 : d.blocks, A = null !== (c = null === (u = null == w ? void 0 : w[m]) || void 0 === u ? void 0 : u[_]) && void 0 !== c ? c : null, U = cc.isValid(A) ? A.convertToWorldSpaceAR(cc.Vec2.ZERO) : p.convertToWorldSpaceAR(o.getBoardCellLocalPosByConstants(m, _)), N = y.convertToNodeSpaceAR(U), b = hs.BLOCK_SIZE || 0, S = "fallback" === C || m >= o.BOTTOM_TARGET_ROW_THRESHOLD ? Math.round(b * o.END_Y_OFFSET_RATIO) : 0;
return [ {
x: Math.round(R.x),
y: Math.round(R.y)
}, {
x: Math.round(N.x),
y: Math.round(N.y + S)
} ];
};
o.getNewUserEarlyRoundsBoardConfig = function(o) {
return i.NewUserEarlyRoundsBoardConfig.find(function(r) {
return r.boardId === o;
});
};
o.calculateTargetCenter = function(o) {
var r, e, n = hs.BLOCK_SIZE, i = 8 * n / 2, s = Infinity, l = -Infinity, d = Infinity, u = -Infinity;
try {
for (var c = t(o), h = c.next(); !h.done; h = c.next()) {
var f = a(h.value, 2), p = f[0], y = f[1];
s = Math.min(s, p);
l = Math.max(l, p);
d = Math.min(d, y);
u = Math.max(u, y);
}
} catch (o) {
r = {
error: o
};
} finally {
try {
h && !h.done && (e = c.return) && e.call(c);
} finally {
if (r) throw r.error;
}
}
return {
x: ((d + u) / 2 + .5) * n - i,
y: -((s + l) / 2 + .5) * n + i
};
};
o.getBoardCellLocalPosByConstants = function(o, r) {
var e = hs.BOARD_CONTAINER_HALF_WIDTH || 0, n = hs.BOARD_CONTAINER_HALF_HEIGHT || 0, t = hs.BLOCK_SIZE || 0, a = hs.BLOCK_HALF_SIZE || Math.round(t / 2), i = (hs.OFFSETX || 0) - e + a + t * r, s = (hs.OFFSETY || 0) + n - a - t * o;
return cc.v2(i, s);
};
o.pickBottomRowGapCenter = function(o) {
if (!Array.isArray(o) || o.length < 8) return null;
var r = o[7];
if (!Array.isArray(r) || r.length < 8) return null;
for (var e = -1, n = -1, t = 0, a = Number.MAX_SAFE_INTEGER, i = 0; i < 8; ) if (-1 === r[i]) {
for (var s = i; i < 8 && -1 === r[i]; ) i++;
var l = i - 1, d = l - s + 1, u = (s + l) / 2, c = Math.abs(u - 3.5);
if (d > t || d === t && c < a) {
t = d;
e = s;
n = l;
a = c;
}
} else i++;
return t <= 0 ? null : {
row: 7,
col: Math.round((e + n) / 2)
};
};
o.resolveGuideTargetCell = function(r, e) {
if (e && "number" == typeof e.row && "number" == typeof e.col) {
var t = Math.floor(e.row), a = Math.floor(e.col);
if (t >= 0 && t < 8 && a >= 0 && a < 8) return {
row: t,
col: a,
source: "config"
};
}
var i = o.pickBottomRowGapCenter(r);
return i ? n(n({}, i), {
source: "fallback"
}) : null;
};
o.isManualBoard = function(o) {
return !(o <= 0) && i.NewUserEarlyRoundsBoardConfig.some(function(r) {
return r.boardId === o;
});
};
o.END_Y_OFFSET_RATIO = .5;
o.BOTTOM_TARGET_ROW_THRESHOLD = 6;
o.SPINE_PATH_MAP = {
1: "spine/board1/gameplay_xinshou"
};
return o;
}();
e.NewUserEarlyRoundsBoardTraitUtil = s;
cc._RF.pop();
}, {
"./NewUserEarlyRoundsBoardConfig": "NewUserEarlyRoundsBoardConfig"
} ],
NewUserEarlyRoundsBoardTrait: [ function(o, r, e) {
"use strict";
cc._RF.push(r, "b2c3dTl9qdIkLEjRWeJq83v", "NewUserEarlyRoundsBoardTrait");
var n, t = this && this.__extends || (n = function(o, r) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(o, r) {
o.__proto__ = r;
} || function(o, r) {
for (var e in r) Object.prototype.hasOwnProperty.call(r, e) && (o[e] = r[e]);
})(o, r);
}, function(o, r) {
n(o, r);
function e() {
this.constructor = o;
}
o.prototype = null === r ? Object.create(r) : (e.prototype = r.prototype, new e());
}), a = this && this.__decorate || function(o, r, e, n) {
var t, a = arguments.length, i = a < 3 ? r : null === n ? n = Object.getOwnPropertyDescriptor(r, e) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(o, r, e, n); else for (var s = o.length - 1; s >= 0; s--) (t = o[s]) && (i = (a < 3 ? t(i) : a > 3 ? t(r, e, i) : t(r, e)) || i);
return a > 3 && i && Object.defineProperty(r, e, i), i;
}, i = this && this.__values || function(o) {
var r = "function" == typeof Symbol && Symbol.iterator, e = r && o[r], n = 0;
if (e) return e.call(o);
if (o && "number" == typeof o.length) return {
next: function() {
o && n >= o.length && (o = void 0);
return {
value: o && o[n++],
done: !o
};
}
};
throw new TypeError(r ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.NewUserEarlyRoundsBoardTrait = void 0;
var s = o("./NewUserEarlyRoundsBoardTraitUtil"), l = o("./NewUserEarlyRoundsBoardType"), d = o("./vo/NewUserEarlyRoundsBoardInfo"), u = o("./vo/NewUserEarlyRoundsBoardAnimInfo"), c = o("./vo/NewUserEarlyRoundsBoardGuideInfo"), h = o("./NewUserEarlyRoundsBoardAnimConfig"), f = function(o) {
t(r, o);
function r() {
var r = null !== o && o.apply(this, arguments) || this;
r._algorithmResetEmitter = new hs.Emitter();
r._replayTriggered = !1;
r._guideHasEliminateHint = !1;
r._lowScoreEmptyBoardTriggered = !1;
return r;
}
r.prototype.setUsedFixedBoard = function(o) {
d.newUserEarlyRoundsBoardInfo.firstRoundBlocksApplied = o;
};
r.prototype.getUsedFixedBoard = function() {
return d.newUserEarlyRoundsBoardInfo.firstRoundBlocksApplied;
};
Object.defineProperty(r.prototype, "onActiveCondition", {
get: function() {
return hs.gameInfo.gameMode === hs.GameMode.Class;
},
enumerable: !1,
configurable: !0
});
r.prototype.onCreate = function() {
c.newUserEarlyRoundsBoardGuideInfo.preloadSpineData(1);
};
r.prototype.onActive = function(o) {
hs.tp.isClassAlgorithmStrategy_Reset_ProxyRegisterAlgorithmResetEmitter(o) ? o.args[0] = this._algorithmResetEmitter : hs.tp.isClassGame_ProxyOnGameBackHome(o) ? this.onGameBackHome() : hs.tp.isClassGame_ProxyOnGameOverPre(o) ? this.handleGameOverPre() : hs.tp.isBlocksProducerTouchSetCanEliminateBlock(o) ? this.handleSetCanEliminateBlock(o) : hs.tp.isBlocksProducerTouchResetLastOneBlock(o) || hs.tp.isBlocksProducerTouchSetNoEliminateBlock(o) ? this.handleResetLastOneBlockOrSetNoEliminateBlock(o) : hs.tp.isBlocksProducerTouchOnTouchMove(o) ? this.handleInitBoardAnimOnTouchMove() : hs.tp.isBlocksProducerTouchAfterTouchStart(o) ? this.handleInitBoardAnimAfterTouchStart() : hs.tp.isBlocksProducerTouchChangeDragItem(o) ? this.handleGuideChangeDragItem(o) : hs.tp.isBlocksProducerTouchInterceptTouchEnd(o) ? this.handleGuideInterceptTouchEnd(o) : hs.tp.isBlocksProducerTouchBeforeOnTouchEnd(o) ? this.handleInitBoardAnimBeforeOnTouchEnd() : hs.tp.isBlocksProducerTouchOnAfterTouchEndAddActivityFilter(o) ? this.handleAfterTouchEndClearEliminated(o) : hs.tp.isBlockForceRender(o) ? this.handleBlockForceRender(o) : hs.tp.isBlockShouldComponentUpdateReturnValue(o) ? this.handleBlockShouldComponentUpdateReturnValue(o) : hs.tp.isBlockLoadBlockSpriteFrame(o) ? this.handleBlockLoadSpriteFrame(o) : hs.tp.isClassBoard_ProxyOnBoardInit(o) ? this.handleClassBoardProxyOnBoardInit() : hs.tp.isClassBlocksProducer_ProxyOnInit(o) ? this.handleClassBlocksProducerProxyOnInit() : hs.tp.isClassBlocksProducer_ProxyGuideRequestBlocksProducer(o) ? this.handleGuideRequestBlocksProducer() : hs.tp.isClassGuide_ProxyApplyGuideStepConfigOverrides(o) ? this.handleClassGuideProxyApplyGuideStepConfigOverrides() : hs.tp.isClassGuide_ProxyRenderGuideState(o) ? this.handleClassGuideProxyRenderGuideState(o) : hs.tp.isClassGuide_ProxyGuideEndDot(o) ? this.handleGuideEndDot(o) : hs.tp.isClassGuide_ProxyOnTouchEnd(o) ? this.handleGuideTouchEnd(o) : hs.tp.isEliminate_Effects_ProxyOnBlockProducerTouchEnd(o) ? this.handleBlockProducerTouchEnd(o) : hs.tp.isSetup_ProxyOnClick_replay(o) ? this.handleReplay() : hs.tp.isClassDefaultBoard_ProxyProduceDefaultBoard(o) ? this.handleProduceDefaultBoardEntry(o) : hs.tp.isClassDefaultBoard_ProxyProduceDefaultColor(o) ? this.handleProduceDefaultColor(o) : hs.tp.isClassDefaultBoard_ProxyProduceDefaultBoardTurnAround(o) ? this.handleProduceDefaultBoardTurnAround(o) : hs.tp.isClassDefaultBoard_ProxyOnBoardSplashAnimationEnd(o) ? this.handleDefaultBoardSplashAnimationEnd() : hs.tp.isClassAlgorithmStrategy_Priority_ProxyOnAlgorithmStrategyPriority(o) ? this.onActiveOnAlgorithmStrategyPriority(o) : hs.tp.isIsOpenOperaPosTraitGenerateOperaPosArrInfo(o) ? this.handleBlockOperaPosGuard(o) : hs.tp.isClassColorProducer_ProxyProduceColorBase(o) ? this.handleProduceColorBase(o) : hs.tp.isClassColorProducer_ProxyProduceColorPostprocessing(o) ? this.handleProduceColorPostprocessing(o) : hs.tp.isClassBlocksProducer_BlocksProducerValidate_ProxySetRecordOperationColor(o) ? this.handleSetRecordOperationColor(o) : hs.tp.isClassBlocksProducer_ProxyUpdateBlocksProducerState(o) && this.handleUpdateBlocksProducerState(o);
};
r.prototype.setGuideComponent = function(o) {
c.newUserEarlyRoundsBoardGuideInfo.guideComponent = o;
};
r.prototype.getInitBoardAnimConfig = function() {
return null !== h.NEW_USER_EARLY_ROUNDS_INIT_BOARD_ANIM_CONFIG && void 0 !== h.NEW_USER_EARLY_ROUNDS_INIT_BOARD_ANIM_CONFIG ? h.NEW_USER_EARLY_ROUNDS_INIT_BOARD_ANIM_CONFIG : null;
};
r.prototype.maybeStopInitBoardAnimByLongPress = function() {
var o = this.getInitBoardAnimConfig();
!o || 1 !== o.enabled || o.longPressMs <= 0 || !u.newUserEarlyRoundsBoardAnimInfo.running || !u.newUserEarlyRoundsBoardAnimInfo.touching || u.newUserEarlyRoundsBoardAnimInfo.touchStartAtMs <= 0 || Date.now() - u.newUserEarlyRoundsBoardAnimInfo.touchStartAtMs >= o.longPressMs && u.newUserEarlyRoundsBoardAnimInfo.stopInitBoardAnim();
};
r.prototype.handleInitBoardAnimOnTouchMove = function() {
u.newUserEarlyRoundsBoardAnimInfo.stopInitBoardAnim();
};
r.prototype.handleInitBoardAnimAfterTouchStart = function() {
var o, r = this;
if (u.newUserEarlyRoundsBoardAnimInfo.running) {
u.newUserEarlyRoundsBoardAnimInfo.touching = !0;
u.newUserEarlyRoundsBoardAnimInfo.touchStartAtMs = Date.now();
var e = this.getInitBoardAnimConfig(), n = null !== (o = null == e ? void 0 : e.longPressMs) && void 0 !== o ? o : 0;
n > 0 && setTimeout(function() {
return r.maybeStopInitBoardAnimByLongPress();
}, n);
}
};
r.prototype.handleInitBoardAnimBeforeOnTouchEnd = function() {
u.newUserEarlyRoundsBoardAnimInfo.touching = !1;
u.newUserEarlyRoundsBoardAnimInfo.touchStartAtMs = 0;
};
r.prototype.handleAfterTouchEndClearEliminated = function(o) {
var r, e, n, t, a;
if (!(this.getCurrentBoardId() <= 0)) {
var s = null === (n = o.args) || void 0 === n ? void 0 : n[1], l = null == s ? void 0 : s.putEliminatesInfo;
if (l && !(l.length <= 0)) {
var u = null === (t = hs.boardRendererInfo) || void 0 === t ? void 0 : t.blocks, c = [];
try {
for (var h = i(l), f = h.next(); !f.done; f = h.next()) {
var p = f.value, y = null == p ? void 0 : p.row, B = null == p ? void 0 : p.col;
if ("number" == typeof y && "number" == typeof B) {
c.push(y + "_" + B);
var v = null === (a = null == u ? void 0 : u[y]) || void 0 === a ? void 0 : a[B];
v && cc.isValid(v) && d.newUserEarlyRoundsBoardInfo.setManualInitBoardTempAllowSkin(v, !1);
}
}
} catch (o) {
r = {
error: o
};
} finally {
try {
f && !f.done && (e = h.return) && e.call(h);
} finally {
if (r) throw r.error;
}
}
d.newUserEarlyRoundsBoardInfo.deletePositionColorMapKeys(c);
}
}
};
r.prototype.handleDefaultBoardSplashAnimationEnd = function() {
this.getCurrentBoardId() <= 0 || d.newUserEarlyRoundsBoardInfo.boardModified() || u.newUserEarlyRoundsBoardAnimInfo.startInitboardAnim();
};
r.prototype.getRuntimeProps = function() {
var o, r, e, n, t, a, i, s = null !== (r = null === (o = this.props) || void 0 === o ? void 0 : o.runProp) && void 0 !== r ? r : {}, l = Array.isArray(s.earlyRoundsBoardIds) ? s.earlyRoundsBoardIds.slice() : [];
return {
useManualBottomBlocks: null !== (e = s.useManualBottomBlocks) && void 0 !== e ? e : 0,
earlyRoundsBoardIds: l,
experimentGroup: Math.max(1, Math.min(4, Math.floor(null !== (n = s.experimentGroup) && void 0 !== n ? n : 1))),
guideScheme: null !== (t = s.guideScheme) && void 0 !== t ? t : 1,
guideFinishBoardId: null !== (a = s.guideFinishBoardId) && void 0 !== a ? a : 0,
lowScoreThreshold: null !== (i = s.lowScoreThreshold) && void 0 !== i ? i : 0
};
};
r.prototype.getOrSelectBoardIdForCurrentGame = function() {
var o;
if (hs.gameInfo.gameMode !== hs.GameMode.Class) return 0;
var r = hs.classGameInfo.gameNum;
if (r < 1) return 0;
if (d.newUserEarlyRoundsBoardInfo.currentGameNum === r && d.newUserEarlyRoundsBoardInfo.boardId > 0) return d.newUserEarlyRoundsBoardInfo.boardId;
if (d.newUserEarlyRoundsBoardInfo.nextGameUseEmptyBoard) {
d.newUserEarlyRoundsBoardInfo.nextGameUseEmptyBoard = !1;
this._lowScoreEmptyBoardTriggered = !0;
return l.EMPTY_BOARD_ID;
}
var e = this.getRuntimeProps().earlyRoundsBoardIds;
if (!e.length) return 0;
var n = d.newUserEarlyRoundsBoardInfo.currentBoardIndex < 0 ? 0 : d.newUserEarlyRoundsBoardInfo.currentBoardIndex + 1;
if (n >= e.length) return 0;
var t = null !== (o = e[n]) && void 0 !== o ? o : 0;
if (t <= 0) return 0;
l.EMPTY_BOARD_ID;
return t;
};
r.prototype.getCurrentBoardId = function() {
return d.newUserEarlyRoundsBoardInfo.boardId > 0 ? d.newUserEarlyRoundsBoardInfo.boardId : 0;
};
r.prototype.persistCurrentBoardId = function(o, r, e) {
d.newUserEarlyRoundsBoardInfo.currentGameNum = o;
d.newUserEarlyRoundsBoardInfo.boardId = r;
d.newUserEarlyRoundsBoardInfo.currentBoardIndex = r <= 0 || void 0 === e ? -1 : e;
};
r.prototype.handleSetCanEliminateBlock = function(o) {
var r;
if (!(this.getCurrentBoardId() <= 0)) {
var e = null === (r = o.args) || void 0 === r ? void 0 : r[0];
e && cc.isValid(e) && null !== d.newUserEarlyRoundsBoardInfo.getManualInitBoardBlockInitialSourceColor(e) && d.newUserEarlyRoundsBoardInfo.setManualInitBoardTempAllowSkin(e, !0);
}
};
r.prototype.handleResetLastOneBlockOrSetNoEliminateBlock = function(o) {
var r;
if (!(this.getCurrentBoardId() <= 0)) {
var e = null === (r = o.args) || void 0 === r ? void 0 : r[0];
e && cc.isValid(e) && d.newUserEarlyRoundsBoardInfo.setManualInitBoardTempAllowSkin(e, !1);
}
};
r.prototype.handleBlockLoadSpriteFrame = function(o) {
var r, e, n, t, a, i, s, l;
if (!(this.getCurrentBoardId() <= 0)) {
var c = o.target, h = null !== (r = null == c ? void 0 : c.node) && void 0 !== r ? r : null, f = null !== (n = null === (e = null == c ? void 0 : c.block) || void 0 === e ? void 0 : e.node) && void 0 !== n ? n : null;
if (!h || !cc.isValid(h)) return !1;
d.newUserEarlyRoundsBoardInfo.getPositionKeyFromBlockNode(h);
var p = d.newUserEarlyRoundsBoardInfo.getManualInitBoardBlockInitialSourceColor(h), y = d.newUserEarlyRoundsBoardInfo.isManualInitBoardTempAllowSkin(h);
u.newUserEarlyRoundsBoardAnimInfo.isInAnim(f), null === (t = null == c ? void 0 : c.state) || void 0 === t || t.color, 
null === (a = null == c ? void 0 : c.state) || void 0 === a || a.canEliminate;
if (null === p) return !1;
if (y) return !1;
if (f) {
var B = null === (s = null === (i = hs.skinInfo) || void 0 === i ? void 0 : i.getBlockMaterial) || void 0 === s ? void 0 : s.call(i, f);
null === (l = null == B ? void 0 : B.setMaterial) || void 0 === l || l.call(B, !1);
}
var v = o.method;
v && v.apply(o.target, o.args);
o.returnState = !0;
o.replace = !0;
}
};
r.prototype.handleBlockForceRender = function(o) {
o.returnValue = !0;
o.returnState = !0;
o.replace = !0;
};
r.prototype.handleBlockShouldComponentUpdateReturnValue = function(o) {
if (!(this.getCurrentBoardId() <= 0 || 0 === Object.keys(d.newUserEarlyRoundsBoardInfo.positionColorMap).length)) {
o.returnValue = !0;
o.returnState = !0;
o.replace = !0;
}
};
r.prototype.getGuideBoardIdByGuideScheme = function(o) {
return 1 === o ? 1 : 0;
};
r.prototype.handleClassBoardProxyOnBoardInit = function() {
d.newUserEarlyRoundsBoardInfo.syncPositionColorMapFromStorage();
hs.classGuideInfo.show && storage.setItem("classFaceBlocks", hs.boardInfo.NULL);
};
r.prototype.handleClassBlocksProducerProxyOnInit = function() {
if (hs.classGuideInfo.show) {
storage.remove("classProducerBlocks");
storage.setItem("classGuideStep", hs.classGuideInfo.step);
}
};
r.prototype.handleClassGuideProxyApplyGuideStepConfigOverrides = function() {
var o;
if (0 === hs.classGameInfo.gameNum && !hs.classGuideInfo.isFinishedGuide) {
var r = this.getRuntimeProps().guideScheme, e = this.getGuideBoardIdByGuideScheme(r);
if (!(e <= 0)) {
var n = s.NewUserEarlyRoundsBoardTraitUtil.getNewUserEarlyRoundsBoardConfig(e);
if (n) {
this.persistCurrentBoardId(hs.classGameInfo.gameNum, e, -1);
var t = hs.classGuideInfo.steps || [], a = t[0] ? {
save_arr: (t[0].save_arr || []).map(function(o) {
return o.slice();
}),
producerBlocks: (n.producerBlocks || []).slice(),
blocksColors: (n.blocksColors || []).slice(),
color: t[0].color,
currentScore: t[0].currentScore,
highScore: t[0].highScore,
move: (t[0].move || []).map(function(o) {
return {
x: o.x,
y: o.y
};
})
} : null, i = t[1] ? {
save_arr: (t[1].save_arr || []).map(function(o) {
return o.slice();
}),
producerBlocks: (n.producerBlocks || []).slice(),
blocksColors: (n.blocksColors || []).slice(),
color: t[1].color,
currentScore: t[1].currentScore,
highScore: t[1].highScore,
move: (t[1].move || []).map(function(o) {
return {
x: o.x,
y: o.y
};
})
} : null, l = n.move && 2 === n.move.length ? n.move : [ {
x: 0,
y: -553.75
}, {
x: 0,
y: 126.25
} ], d = {
save_arr: (n.boardData || []).map(function(o) {
return o.slice();
}),
producerBlocks: (n.producerBlocks || []).slice(),
blocksColors: (n.blocksColors || []).slice(),
color: null !== (o = n.blocksColors[1]) && void 0 !== o ? o : 1,
currentScore: 0,
highScore: 0,
move: (l || []).map(function(o) {
return {
x: o.x,
y: o.y
};
})
};
storage.setItem("guideStepConfigOverride_0", a);
storage.setItem("guideStepConfigOverride_1", i);
storage.setItem("guideStepConfigOverride_2", d);
}
}
}
};
r.prototype.handleClassGuideProxyRenderGuideState = function(o) {
var r, e, n, t;
if (hs.classGuideInfo.show && !hs.classGuideInfo.isFinishedGuide) {
var a = null === (r = o.args) || void 0 === r ? void 0 : r[0], i = null !== (e = null == a ? void 0 : a.step) && void 0 !== e ? e : null === (n = null == a ? void 0 : a.state) || void 0 === n ? void 0 : n.step, l = storage.getItem("classGuideStep", 0);
if (2 === ("number" == typeof i ? i : l)) {
var h = this.getRuntimeProps().guideScheme, f = this.getGuideBoardIdByGuideScheme(h);
if (!(f <= 0)) {
var p = s.NewUserEarlyRoundsBoardTraitUtil.getNewUserEarlyRoundsBoardConfig(f);
if (p) {
var y = Cinst(hs.ClassGuide), B = null !== (t = null == y ? void 0 : y.node) && void 0 !== t ? t : null, v = s.NewUserEarlyRoundsBoardTraitUtil.computeGuideMoveFromScene(p.boardData, p.guideTargetCell, null != B ? B : void 0);
if (v) {
var I = hs.classGuideInfo.steps;
(null == I ? void 0 : I[2]) && (I[2].move = v);
y && this.setGuideComponent(y);
var g = p.spineTargetPositions;
g && 0 !== g.length || !p.guideTargetCell || (g = [ [ p.guideTargetCell.row, p.guideTargetCell.col ] ]);
g && g.length > 0 && c.newUserEarlyRoundsBoardGuideInfo.createTargetHighlight(f, g);
d.newUserEarlyRoundsBoardInfo.positionColorMap = d.newUserEarlyRoundsBoardInfo.buildPositionColorMapFromSnapshot(p.boardData);
u.newUserEarlyRoundsBoardAnimInfo.startInitboardAnim();
}
}
}
}
}
};
r.prototype.handleReplay = function() {
this._replayTriggered = !0;
d.newUserEarlyRoundsBoardInfo.clear();
u.newUserEarlyRoundsBoardAnimInfo.clear();
d.newUserEarlyRoundsBoardInfo.clearPosMap();
this.resetAllBlockSkin();
};
r.prototype.handleProduceDefaultBoardEntry = function(o) {
u.newUserEarlyRoundsBoardAnimInfo.stopInitBoardAnim();
this.setUsedFixedBoard(!1);
if (this._replayTriggered) {
this._replayTriggered = !1;
d.newUserEarlyRoundsBoardInfo.currentGameNum = hs.classGameInfo.gameNum;
d.newUserEarlyRoundsBoardInfo.boardId = 0;
} else this.handleProduceDefaultBoard(o);
};
r.prototype.handleBlockOperaPosGuard = function(o) {
this.getUsedFixedBoard() && 1 === hs.classGameInfo.roundNum && (o.replace = !0);
};
r.prototype.handleProduceDefaultBoard = function(o) {
d.newUserEarlyRoundsBoardInfo.clear();
var r = this.getOrSelectBoardIdForCurrentGame();
if (r <= 0) {
d.newUserEarlyRoundsBoardInfo.positionColorMap = {};
d.newUserEarlyRoundsBoardInfo.boardId = 0;
} else {
var e = s.NewUserEarlyRoundsBoardTraitUtil.getNewUserEarlyRoundsBoardConfig(r);
if (e) {
var n = hs.classGameInfo.gameNum, t = this._lowScoreEmptyBoardTriggered;
this._lowScoreEmptyBoardTriggered = !1;
var a = d.newUserEarlyRoundsBoardInfo.currentBoardIndex, i = t ? a : a < 0 ? 0 : a + 1;
this.persistCurrentBoardId(n, r, i);
o.args && (o.args[0] = e.boardData);
o.returnState = !0;
d.newUserEarlyRoundsBoardInfo.positionColorMap = d.newUserEarlyRoundsBoardInfo.buildPositionColorMapFromSnapshot(e.boardData);
var u = Array.isArray(e.producerBlocks) && e.producerBlocks.length >= 3 && Array.isArray(e.blocksColors) && e.blocksColors.length >= 3;
this.setUsedFixedBoard(u);
l.EMPTY_BOARD_ID;
}
}
};
r.prototype.handleProduceDefaultColor = function(o) {
this.getCurrentBoardId() > 0 && (o.returnState = !0);
};
r.prototype.handleProduceDefaultBoardTurnAround = function(o) {
this.getCurrentBoardId() > 0 && (o.returnState = !0);
};
r.prototype.handleProduceColorBase = function(o) {
if (1 !== hs.classGameInfo.roundNum || !this.getUsedFixedBoard()) {
var r = this.getCurrentBoardId();
r <= 0 && (r = this.getOrSelectBoardIdForCurrentGame());
if (!(r <= 0)) {
var e = s.NewUserEarlyRoundsBoardTraitUtil.getNewUserEarlyRoundsBoardConfig(r);
if (e && Array.isArray(e.blocksColors) && !(e.blocksColors.length < 3)) {
hs.classColorProducerGameInfo.setColorList(e.blocksColors);
o.args && (o.args[0] = !0);
}
}
}
};
r.prototype.handleProduceColorPostprocessing = function(o) {
var r, e;
if (1 === hs.classGameInfo.roundNum && this.getUsedFixedBoard()) {
var n = this.getCurrentBoardId();
n <= 0 && (n = this.getOrSelectBoardIdForCurrentGame());
if (!(n <= 0)) {
var t = s.NewUserEarlyRoundsBoardTraitUtil.getNewUserEarlyRoundsBoardConfig(n);
if (t && Array.isArray(t.blocksColors) && !(t.blocksColors.length < 3)) {
var a = null === (r = hs.algorithmInfo) || void 0 === r ? void 0 : r.blockIdList, i = null !== (e = t.producerBlocks) && void 0 !== e ? e : [], l = t.blocksColors.slice(0, 3), d = l;
if (a && 3 === a.length) {
var u = new Set();
d = a.map(function(o) {
for (var r = 0; r < i.length; r++) if (!u.has(r) && i[r] === o) {
u.add(r);
return l[r];
}
return l[0];
});
}
hs.classColorProducerGameInfo.setColorList(d);
o.returnState = !0;
}
}
}
};
r.prototype.handleSetRecordOperationColor = function(o) {
if (this.getUsedFixedBoard() && 1 === hs.classGameInfo.roundNum) {
o.returnState = !0;
o.replace = !0;
}
};
r.prototype.handleUpdateBlocksProducerState = function(o) {
if (1 !== hs.classGameInfo.roundNum || !this.getUsedFixedBoard()) {
var r = this.getCurrentBoardId();
r <= 0 && (r = this.getOrSelectBoardIdForCurrentGame());
if (!(r <= 0)) {
var e = s.NewUserEarlyRoundsBoardTraitUtil.getNewUserEarlyRoundsBoardConfig(r);
if (e && Array.isArray(e.blocksColors) && !(e.blocksColors.length < 3)) {
var n = e.blocksColors.slice(0, 3);
o.args && o.args.length >= 2 && (o.args[1] = n);
hs.classColorProducerGameInfo.setColorList(n);
}
}
}
};
r.prototype.onActiveOnAlgorithmStrategyPriority = function(o) {
var r = hs.classGameInfo, e = r.roundNum;
r.gameNum;
if (this.getUsedFixedBoard() && 1 === e) {
var n = this.getCurrentBoardId();
n <= 0 && (n = this.getOrSelectBoardIdForCurrentGame());
if (!(n <= 0)) {
var t = s.NewUserEarlyRoundsBoardTraitUtil.getNewUserEarlyRoundsBoardConfig(n);
if (t && Array.isArray(t.producerBlocks) && !(t.producerBlocks.length < 3)) {
hs.algorithmStrategyInfo.setAlgorithmPriorityList([ hs.OFFER_TYPE.NEW_USER_EARLY_ROUNDS_FIXED_BLOCK ]);
hs.algorithmHijackInfo.setHijackAlgoResult(hs.OFFER_TYPE.NEW_USER_EARLY_ROUNDS_FIXED_BLOCK, {
mainKey: "NewUserEarlyRoundsBoardTrait",
hijackResult: {
algoType: hs.OFFER_TYPE.NEW_USER_EARLY_ROUNDS_FIXED_BLOCK,
algoList: [ hs.OFFER_TYPE.NEW_USER_EARLY_ROUNDS_FIXED_BLOCK ],
blockGroup: [],
blockIds: t.producerBlocks.slice(0, 3),
blockPoses: [],
blockRecords: [],
timeout: !1,
blockNames: Array(3).fill("NEW_USER_EARLY_ROUNDS_FIXED_BLOCK"),
errorCode: 0
}
});
var a = t.producerBlocks.slice(0, 3), i = t.blocksColors && t.blocksColors.length >= 3 ? t.blocksColors.slice(0, 3) : [];
storage.setItem("classProducerBlocks", a);
i.length >= 3 && hs.classColorProducerGameInfo.setColorList(i);
o.returnState = !0;
}
}
}
};
r.prototype.handleGameOverPre = function() {
var o, r, e, n = this.getRuntimeProps().lowScoreThreshold;
if (!(n <= 0)) {
var t = null !== (r = null === (o = hs.classScoreInfo) || void 0 === o ? void 0 : o.score) && void 0 !== r ? r : 0;
null === (e = hs.classGameInfo) || void 0 === e ? void 0 : e.gameNum;
t >= n || (d.newUserEarlyRoundsBoardInfo.nextGameUseEmptyBoard = !0);
}
};
r.prototype.onGameBackHome = function() {
this.resetAllBlockSkin();
d.newUserEarlyRoundsBoardInfo.clear();
u.newUserEarlyRoundsBoardAnimInfo.clear();
c.newUserEarlyRoundsBoardGuideInfo.clear();
this._replayTriggered = !1;
};
r.prototype.resetAllBlockSkin = function() {
var o, r = null === (o = hs.boardRendererInfo) || void 0 === o ? void 0 : o.blocks;
if (r) for (var e = 0; e < Object.keys(r).length; e++) {
var n = r[e];
if (n) for (var t = 0; t < Object.keys(n).length; t++) {
var a = n[t];
if (a && cc.isValid(a)) {
var i = a.getComponent(hs.Block);
null == i || i.setState({}, !0);
}
}
}
};
r.prototype.handleGuideChangeDragItem = function(o) {
var r;
if (0 === hs.classGameInfo.gameNum && hs.classGuideInfo.show) {
var e = o.args[0], n = o.args[4], t = o.args[5];
if (e) {
var a = n && Object.keys(n).length > 0, i = t && Object.keys(t).length > 0;
this._guideHasEliminateHint = !(!a && !i);
if (!this._guideHasEliminateHint && hs.classGuideInfo.step < hs.classGuideInfo.totalStep) {
var s = o.args[2], l = o.args[3];
for (var d in s) for (var u in s[d]) {
var c = null === (r = l[d]) || void 0 === r ? void 0 : r[u];
c && cc.isValid(c) && cc.isValid(c.node) && (c.node.opacity = 0);
}
}
} else this._guideHasEliminateHint = !1;
}
};
r.prototype.handleGuideInterceptTouchEnd = function(o) {
if (0 === hs.classGameInfo.gameNum && hs.classGuideInfo.show && !(hs.classGuideInfo.step >= hs.classGuideInfo.totalStep)) {
var r = o.target;
if (r.canSnap && !this._guideHasEliminateHint) {
o.returnState = !0;
o.returnValue = !0;
r.backBlocks();
var e = Cinst(hs.ClassGuide);
(null == e ? void 0 : e.setState) && e.setState({
showHand: !0
});
}
}
};
r.prototype.handleGuideEndDot = function(o) {
var r;
if (0 === hs.classGameInfo.gameNum && hs.classGuideInfo.show && !hs.classGuideInfo.isFinishedGuide) {
var e = hs.classGuideInfo.totalStep;
if (!(hs.classGuideInfo.step < e - 1)) {
var n = o.args[0];
if (null === (r = null == n ? void 0 : n.state) || void 0 === r || !r.clearProducer) {
o.replace = !0;
o.originalCaller();
storage.setItem("classGuideStep", e);
var t = Cinst(hs.ClassGuide);
(null == t ? void 0 : t.setState) && t.setState({
showDarkMask: !1,
showHand: !1
});
u.newUserEarlyRoundsBoardAnimInfo.stopInitBoardAnim();
c.newUserEarlyRoundsBoardGuideInfo.clear();
d.newUserEarlyRoundsBoardInfo.clear();
d.newUserEarlyRoundsBoardInfo.clearPosMap();
}
}
}
};
r.prototype.handleGuideRequestBlocksProducer = function() {
if (0 === hs.classGameInfo.gameNum) {
u.newUserEarlyRoundsBoardAnimInfo.stopInitBoardAnim();
c.newUserEarlyRoundsBoardGuideInfo.clearSpineHighlight();
}
};
r.prototype.handleGuideTouchEnd = function() {
if (0 === hs.classGameInfo.gameNum && hs.classGuideInfo.show) {
u.newUserEarlyRoundsBoardAnimInfo.stopInitBoardAnim();
c.newUserEarlyRoundsBoardGuideInfo.clearSpineHighlight();
}
};
r.prototype.handleBlockProducerTouchEnd = function(o) {
var r, e, n;
(null === (n = null === (e = null === (r = o.args) || void 0 === r ? void 0 : r[0]) || void 0 === e ? void 0 : e.state) || void 0 === n ? void 0 : n.clearScreen) && d.newUserEarlyRoundsBoardInfo.clearPosMap();
0 === hs.classGameInfo.gameNum && 0 === hs.classGameInfo.roundNum && hs.blocksProducerInfo.isNullProducerBlocks && this._algorithmResetEmitter.fire();
};
return a([ classId("NewUserEarlyRoundsBoardTrait") ], r);
}(Trait);
e.NewUserEarlyRoundsBoardTrait = f;
cc._RF.pop();
}, {
"./NewUserEarlyRoundsBoardAnimConfig": "NewUserEarlyRoundsBoardAnimConfig",
"./NewUserEarlyRoundsBoardTraitUtil": "NewUserEarlyRoundsBoardTraitUtil",
"./NewUserEarlyRoundsBoardType": "NewUserEarlyRoundsBoardType",
"./vo/NewUserEarlyRoundsBoardAnimInfo": "NewUserEarlyRoundsBoardAnimInfo",
"./vo/NewUserEarlyRoundsBoardGuideInfo": "NewUserEarlyRoundsBoardGuideInfo",
"./vo/NewUserEarlyRoundsBoardInfo": "NewUserEarlyRoundsBoardInfo"
} ],
NewUserEarlyRoundsBoardType: [ function(o, r, e) {
"use strict";
cc._RF.push(r, "55ec6jBHelC3r5dgyQWm97a", "NewUserEarlyRoundsBoardType");
Object.defineProperty(e, "__esModule", {
value: !0
});
e.EMPTY_BOARD_ID = e.INIT_BOARD_ANIM_ACTION_TAG = e.STORAGE_KEY_NEXT_GAME_USE_EMPTY_BOARD = e.STORAGE_KEY_FIRST_ROUND_BLOCKS_APPLIED_BOARD = e.STORAGE_KEY_CURRENT_GAME_NUM = e.STORAGE_KEY_CURRENT_BOARD_INDEX = e.STORAGE_KEY_BOARD_ID = e.STORAGE_KEY_MANUAL_INIT_BOARD_POSITION_COLOR_MAP = void 0;
e.STORAGE_KEY_MANUAL_INIT_BOARD_POSITION_COLOR_MAP = "NewUserEarlyRoundsBoardTrait_manualInitBoardPositionColorMap";
e.STORAGE_KEY_BOARD_ID = "NewUserEarlyRoundsBoardTrait_boardId";
e.STORAGE_KEY_CURRENT_BOARD_INDEX = "NewUserEarlyRoundsBoardTrait_currentBoardIndex";
e.STORAGE_KEY_CURRENT_GAME_NUM = "NewUserEarlyRoundsBoardTrait_currentGameNum";
e.STORAGE_KEY_FIRST_ROUND_BLOCKS_APPLIED_BOARD = "NewUserEarlyRoundsBoardTrait_firstRoundBlocksAppliedBoard";
e.STORAGE_KEY_NEXT_GAME_USE_EMPTY_BOARD = "NewUserEarlyRoundsBoardTrait_nextGameUseEmptyBoard";
e.INIT_BOARD_ANIM_ACTION_TAG = 101001;
e.EMPTY_BOARD_ID = 99999;
cc._RF.pop();
}, {} ]
}, {}, [ "NewUserEarlyRoundsBoardAnimConfig", "NewUserEarlyRoundsBoardConfig", "NewUserEarlyRoundsBoardTrait", "NewUserEarlyRoundsBoardTraitUtil", "NewUserEarlyRoundsBoardType", "NewUserEarlyRoundsBoardAnimInfo", "NewUserEarlyRoundsBoardGuideInfo", "NewUserEarlyRoundsBoardInfo" ]);
//# sourceMappingURL=index.js.map
