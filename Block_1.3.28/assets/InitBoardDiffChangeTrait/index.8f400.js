window.__require = function t(e, r, a) {
function o(n, f) {
if (!r[n]) {
if (!e[n]) {
var c = n.split("/");
c = c[c.length - 1];
if (!e[c]) {
var h = "function" == typeof __require && __require;
if (!f && h) return h(c, !0);
if (i) return i(c, !0);
throw new Error("Cannot find module '" + n + "'");
}
n = c;
}
var s = r[n] = {
exports: {}
};
e[n][0].call(s.exports, function(t) {
return o(e[n][1][t] || t);
}, s, s.exports, t, e, r, a);
}
return r[n].exports;
}
for (var i = "function" == typeof __require && __require, n = 0; n < a.length; n++) o(a[n]);
return o;
}({
InitBoardDiffChangeTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "30aa5YE66dB7YcJ2oIPPEne", "InitBoardDiffChangeTrait");
var a, o = this && this.__extends || (a = function(t, e) {
return (a = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
})(t, e);
}, function(t, e) {
a(t, e);
function r() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
}), i = this && this.__decorate || function(t, e, r, a) {
var o, i = arguments.length, n = i < 3 ? e : null === a ? a = Object.getOwnPropertyDescriptor(e, r) : a;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(t, e, r, a); else for (var f = t.length - 1; f >= 0; f--) (o = t[f]) && (n = (i < 3 ? o(n) : i > 3 ? o(e, r, n) : o(e, r)) || n);
return i > 3 && n && Object.defineProperty(e, r, n), n;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.InitBoardDiffChangeTrait = void 0;
var n = function(t) {
o(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ChapterGameOver_GameEndPre_Proxy",
methodName: "onGameEndPre"
}, {
className: "ChapterDefaultBoard_Proxy",
methodName: "traitSetChapterBoard"
} ];
};
e.prototype.onCreate = function() {
this.initBoardDiffChangeData = storage.getItem("InitBoardDiffChangeData", {
failRecord: {
level: 0,
failCount: 0
}
});
};
e.prototype.onActive = function(t) {
if (hs.tp.isChapterGameOver_GameEndPre_ProxyOnGameEndPre(t)) {
if (t.args[0].option.win) {
this.initBoardDiffChangeData.failRecord.level = hs.chapterGameInfo.chapterNum;
this.initBoardDiffChangeData.failRecord.failCount = 0;
} else if (this.initBoardDiffChangeData.failRecord.level === hs.chapterGameInfo.chapterNum) this.initBoardDiffChangeData.failRecord.failCount++; else {
this.initBoardDiffChangeData.failRecord.level = hs.chapterGameInfo.chapterNum;
this.initBoardDiffChangeData.failRecord.failCount = 1;
}
storage.setItem("InitBoardDiffChangeData", this.initBoardDiffChangeData);
}
if (hs.tp.isChapterDefaultBoard_ProxyTraitSetChapterBoard(t) && this.initBoardDiffChangeData.failRecord.failCount >= 2) {
this.removeNonFourConnectedBlocks();
storage.setItem("InitBoardDiffChangeData", this.initBoardDiffChangeData);
}
};
e.prototype.removeNonFourConnectedBlocks = function() {
var t = hs.chapterBoardInfo.faceBlocks;
t.forEach(function(e, r) {
e.forEach(function(e, a) {
var o, i, n, f, c = null === (o = t[r - 1]) || void 0 === o ? void 0 : o[a], h = null === (i = t[r + 1]) || void 0 === i ? void 0 : i[a], s = null === (n = t[r]) || void 0 === n ? void 0 : n[a - 1], l = null === (f = t[r]) || void 0 === f ? void 0 : f[a + 1];
-1 === e || c && -1 !== c || h && -1 !== h || s && -1 !== s || l && -1 !== l || (t[r][a] = -1);
});
});
storage.setItem("chapterFaceBlocks", t);
};
return i([ classId("InitBoardDiffChangeTrait") ], e);
}(Trait);
r.InitBoardDiffChangeTrait = n;
cc._RF.pop();
}, {} ]
}, {}, [ "InitBoardDiffChangeTrait" ]);
//# sourceMappingURL=index.js.map
