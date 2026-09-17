window.__require = function e(t, r, o) {
function n(c, i) {
if (!r[c]) {
if (!t[c]) {
var p = c.split("/");
p = p[p.length - 1];
if (!t[p]) {
var f = "function" == typeof __require && __require;
if (!i && f) return f(p, !0);
if (a) return a(p, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = p;
}
var u = r[c] = {
exports: {}
};
t[c][0].call(u.exports, function(e) {
return n(t[c][1][e] || e);
}, u, u.exports, e, t, r, o);
}
return r[c].exports;
}
for (var a = "function" == typeof __require && __require, c = 0; c < o.length; c++) n(o[c]);
return n;
}({
IsOpenChapterRemoveCollectionTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "bbdaaMIwp1DzqVfZi3Ekydt", "IsOpenChapterRemoveCollectionTrait");
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
var n, a = arguments.length, c = a < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(e, t, r, o); else for (var i = e.length - 1; i >= 0; i--) (n = e[i]) && (c = (a < 3 ? n(c) : a > 3 ? n(t, r, c) : n(t, r)) || c);
return a > 3 && c && Object.defineProperty(t, r, c), c;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.IsOpenChapterRemoveCollectionTrait = void 0;
var c = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onActive = function(e) {
if (hs.tp.isChapterDefaultBoard_ProxyTraitSetChapterBoard(e)) {
var t = hs.chapterGameInfo.chapterCondition;
if (t.Way == hs.ChapterType.collect) {
var r = storage.getItem("chapterPeriodsIndex", 1), o = storage.getItem("chapterNum", 0), n = storage.getItem("chapterRemoveCollectionInfo", []);
if (-1 !== n.findIndex(function(e) {
return e.chapterNum == o && e.stage == r;
})) return;
var a = hs.boardInfo.chapterFaceBlocks, c = [], i = [];
a.forEach(function(e, r) {
e.forEach(function(e, o) {
-1 !== e && (t.RequiredCollections.some(function(t) {
return t.Key === e;
}) ? i.push({
row: r,
col: o
}) : c.push(e));
});
});
0 === c.length && c.push(Math.floor(7 * Math.random()) + 1);
i.forEach(function(e) {
a[e.row][e.col] = c[Math.floor(Math.random() * c.length)];
});
n.push({
chapterNum: o,
stage: r,
board: a
});
storage.setItem("chapterRemoveCollectionInfo", n);
storage.setItem("chapterFaceBlocks", a);
}
}
};
return a([ classId("IsOpenChapterRemoveCollectionTrait") ], t);
}(Trait);
r.IsOpenChapterRemoveCollectionTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "IsOpenChapterRemoveCollectionTrait" ]);
//# sourceMappingURL=index.js.map
