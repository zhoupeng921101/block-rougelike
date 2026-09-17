window.__require = function e(t, r, n) {
function a(i, s) {
if (!r[i]) {
if (!t[i]) {
var u = i.split("/");
u = u[u.length - 1];
if (!t[u]) {
var c = "function" == typeof __require && __require;
if (!s && c) return c(u, !0);
if (o) return o(u, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = u;
}
var h = r[i] = {
exports: {}
};
t[i][0].call(h.exports, function(e) {
return a(t[i][1][e] || e);
}, h, h.exports, e, t, r, n);
}
return r[i].exports;
}
for (var o = "function" == typeof __require && __require, i = 0; i < n.length; i++) a(n[i]);
return a;
}({
IsOpenTravelFailChangeDefaultBoardTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "6c91fe0puNEro+xkVI3s/fH", "IsOpenTravelFailChangeDefaultBoardTrait");
var n, a = this && this.__extends || (n = function(e, t) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
n(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), o = this && this.__decorate || function(e, t, r, n) {
var a, o = arguments.length, i = o < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, r) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(e, t, r, n); else for (var s = e.length - 1; s >= 0; s--) (a = e[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(t, r, i) : a(t, r)) || i);
return o > 3 && i && Object.defineProperty(t, r, i), i;
}, i = this && this.__awaiter || function(e, t, r, n) {
return new (r || (r = Promise))(function(a, o) {
function i(e) {
try {
u(n.next(e));
} catch (e) {
o(e);
}
}
function s(e) {
try {
u(n.throw(e));
} catch (e) {
o(e);
}
}
function u(e) {
e.done ? a(e.value) : (t = e.value, t instanceof r ? t : new r(function(e) {
e(t);
})).then(i, s);
var t;
}
u((n = n.apply(e, t || [])).next());
});
}, s = this && this.__generator || function(e, t) {
var r, n, a, o, i = {
label: 0,
sent: function() {
if (1 & a[0]) throw a[1];
return a[1];
},
trys: [],
ops: []
};
return o = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (o[Symbol.iterator] = function() {
return this;
}), o;
function s(e) {
return function(t) {
return u([ e, t ]);
};
}
function u(o) {
if (r) throw new TypeError("Generator is already executing.");
for (;i; ) try {
if (r = 1, n && (a = 2 & o[0] ? n.return : o[0] ? n.throw || ((a = n.return) && a.call(n), 
0) : n.next) && !(a = a.call(n, o[1])).done) return a;
(n = 0, a) && (o = [ 2 & o[0], a.value ]);
switch (o[0]) {
case 0:
case 1:
a = o;
break;

case 4:
i.label++;
return {
value: o[1],
done: !1
};

case 5:
i.label++;
n = o[1];
o = [ 0 ];
continue;

case 7:
o = i.ops.pop();
i.trys.pop();
continue;

default:
if (!(a = i.trys, a = a.length > 0 && a[a.length - 1]) && (6 === o[0] || 2 === o[0])) {
i = 0;
continue;
}
if (3 === o[0] && (!a || o[1] > a[0] && o[1] < a[3])) {
i.label = o[1];
break;
}
if (6 === o[0] && i.label < a[1]) {
i.label = a[1];
a = o;
break;
}
if (a && i.label < a[2]) {
i.label = a[2];
i.ops.push(o);
break;
}
a[2] && i.ops.pop();
i.trys.pop();
continue;
}
o = t.call(e, i);
} catch (e) {
o = [ 6, e ];
n = 0;
} finally {
r = a = 0;
}
if (5 & o[0]) throw o[1];
return {
value: o[0] ? o[1] : void 0,
done: !0
};
}
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.IsOpenTravelFailChangeDefaultBoardTrait = void 0;
var u = function(e) {
a(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._saveData = {
count: 0,
failCount: 0,
reviveCount: 0,
reviveCOuntList: []
};
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ChapterRevive_Proxy",
methodName: "onRevive_Success"
}, {
className: "Advertisement_Proxy",
methodName: "onGameOverGameEndPre"
}, {
className: "Advertisement_Proxy",
methodName: "onGameInitComplete"
} ];
};
t.prototype.onActive = function(e) {
return i(this, void 0, void 0, function() {
var t, r, n, a, o, i, u, c, h, l, f, p, v, d, g, _;
return s(this, function(s) {
switch (s.label) {
case 0:
if (!hs.tp.isChapterDefaultBoard_ProxyTraitSetChapterBoard(e)) return [ 3, 3 ];
t = storage.getItem("chapterPeriodsIndex", 1);
r = storage.getItem("chapterNum", 0);
n = storage.getItem("chapterFailChangeDefaultBoardInfo", {
stage: -1,
chapterNum: -1,
count: 0,
board: null
});
a = 0;
n.stage == t && n.chapterNum == r && (a = n.count);
if (a >= 2) {
n.board && storage.setItem("chapterFaceBlocks", n.board);
return [ 2 ];
}
o = this._saveData.reviveCOuntList.reduce(function(e, t) {
return e + t;
}, 0);
if (!(this._saveData.count <= 0 && this._saveData.failCount >= 3 && o >= 2)) return [ 3, 2 ];
this._saveData.count++;
i = hs.boardInfo.chapterFaceBlocks;
(u = hs.binaryExtend.calculateBoardWeight(i)) > 100 && (a > 0 || this.getReduceWeight()) && (u -= 100);
return [ 4, this.generateBoardFromWeight(u) ];

case 1:
if ((c = s.sent()).length > 0 && 8 == c.length && 8 == c[0].length) {
h = hs.chapterGameInfo.chapterCondition;
l = [];
f = [ 1, 2, 3, 4, 5, 6, 7 ];
i.forEach(function(e) {
e.forEach(function(e) {
var t = f.indexOf(e);
-1 != t && f.splice(t, 1);
});
});
p = [];
for (d = 0; d < 3; d++) {
v = Math.floor(Math.random() * f.length);
p.push(f[v]);
f.splice(v, 1);
}
for (d = 0; d < c.length; d++) for (g = 0; g < c[d].length; g++) if (1 === c[d][g]) {
c[d][g] = p[Math.floor(Math.random() * p.length)] || 1;
l.push({
r: d,
c: g
});
}
if (h.Way == hs.ChapterType.collect) {
_ = [];
i.forEach(function(e) {
e.forEach(function(e) {
h.RequiredCollections.some(function(t) {
return t.Key === e;
}) && _.push(e);
});
});
_.forEach(function(e) {
var t = Math.floor(Math.random() * l.length), r = l.splice(t, 1)[0];
c[r.r][r.c] = e;
});
}
storage.setItem("chapterFaceBlocks", c);
this.saveInfo(t, r, a + 1, c);
}
return [ 3, 3 ];

case 2:
n.board && storage.setItem("chapterFaceBlocks", n.board);
s.label = 3;

case 3:
if (hs.tp.isAdvertisement_ProxyOnGameOverGameEndPre(e)) {
if (hs.gameInfo.gameMode !== hs.GameMode.Chapter) return [ 2 ];
if (e.args[0].option.win) {
this._saveData = {
count: 0,
failCount: 0,
reviveCount: 0,
reviveCOuntList: []
};
this.saveInfo(-1, -1, 0, null);
} else {
this._saveData.failCount++;
this._saveData.reviveCOuntList.push(this._saveData.reviveCount);
this._saveData.reviveCount = 0;
this._saveData.reviveCOuntList.length > 3 && this._saveData.reviveCOuntList.splice(0, 1);
}
}
hs.tp.isChapterRevive_ProxyOnRevive_Success(e) && this._saveData.reviveCount++;
if (hs.tp.isAdvertisement_ProxyOnGameInitComplete(e)) {
if (hs.gameInfo.gameMode !== hs.GameMode.Chapter) return [ 2 ];
this._saveData = {
count: 0,
failCount: 0,
reviveCount: 0,
reviveCOuntList: []
};
}
return [ 2 ];
}
});
});
};
t.prototype.generateBoardFromWeight = function(e) {
return i(this, void 0, Promise, function() {
var t, r;
return s(this, function() {
r = Date.now();
do {
t = hs.binaryExtend.reconstructBoardFromWeight(e);
if (Date.now() - r >= 100) {
t = [];
break;
}
} while (!hs.binaryExtend.validateBoard(t, e));
return [ 2, t ];
});
});
};
t.prototype.saveInfo = function(e, t, r, n) {
storage.setItem("chapterFailChangeDefaultBoardInfo", {
stage: e,
chapterNum: t,
count: r,
board: n
});
};
t.prototype.getReduceWeight = function() {
return Math.random() < .3;
};
return o([ classId("IsOpenTravelFailChangeDefaultBoardTrait") ], t);
}(Trait);
r.IsOpenTravelFailChangeDefaultBoardTrait = u;
cc._RF.pop();
}, {} ]
}, {}, [ "IsOpenTravelFailChangeDefaultBoardTrait" ]);
//# sourceMappingURL=index.js.map
