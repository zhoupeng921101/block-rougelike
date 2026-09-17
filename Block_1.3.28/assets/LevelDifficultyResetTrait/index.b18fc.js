window.__require = function t(e, r, a) {
function i(o, c) {
if (!r[o]) {
if (!e[o]) {
var s = o.split("/");
s = s[s.length - 1];
if (!e[s]) {
var f = "function" == typeof __require && __require;
if (!c && f) return f(s, !0);
if (n) return n(s, !0);
throw new Error("Cannot find module '" + o + "'");
}
o = s;
}
var u = r[o] = {
exports: {}
};
e[o][0].call(u.exports, function(t) {
return i(e[o][1][t] || t);
}, u, u.exports, t, e, r, a);
}
return r[o].exports;
}
for (var n = "function" == typeof __require && __require, o = 0; o < a.length; o++) i(a[o]);
return i;
}({
LevelDifficultyResetTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "16d94Oz75ZJpKfCjWW2lprx", "LevelDifficultyResetTrait");
var a, i = this && this.__extends || (a = function(t, e) {
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
}), n = this && this.__decorate || function(t, e, r, a) {
var i, n = arguments.length, o = n < 3 ? e : null === a ? a = Object.getOwnPropertyDescriptor(e, r) : a;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) o = Reflect.decorate(t, e, r, a); else for (var c = t.length - 1; c >= 0; c--) (i = t[c]) && (o = (n < 3 ? i(o) : n > 3 ? i(e, r, o) : i(e, r)) || o);
return n > 3 && o && Object.defineProperty(e, r, o), o;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.LevelDifficultyResetTrait = void 0;
var o = function(t) {
i(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._cacheData = {
todayChapterStart: 0,
nextResetTime: 0
};
return e;
}
e.prototype.onCreate = function() {
this._cacheData = storage.getItem("LevelDifficultyResetTraitKey", this._cacheData);
this.checkAndReset();
};
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ChapterGame_GameInfoUpdate_Proxy",
methodName: "updateChapterGameNumAfter"
} ];
};
e.prototype.onActive = function(t) {
if (hs.tp.isChapterDifficultyStrategy_ProxyDetermineDifficulty(t)) {
var e = t.args[0], r = this.getChapterDifficulty(e);
t.replace = !0;
t.returnValue = r;
t.returnState = !0;
}
hs.tp.isChapterGame_GameInfoUpdate_ProxyUpdateChapterGameNumAfter(t) && this.checkAndReset(!1);
};
e.prototype.getChapterDifficulty = function(t) {
var e = (t - this._cacheData.todayChapterStart) % 10;
return [ 4, 8 ].includes(e) ? hs.CHAPTER_DIFF_TYPE.DIFFICULT : [ 2, 6 ].includes(e) ? hs.CHAPTER_DIFF_TYPE.MEDIUM : hs.CHAPTER_DIFF_TYPE.SIMPLE;
};
e.prototype.calculateNextResetTime = function() {
var t = new Date(), e = new Date(t);
e.setDate(t.getDate() + 1);
e.setHours(4, 0, 0, 0);
return e.getTime();
};
e.prototype.checkAndReset = function(t) {
void 0 === t && (t = !0);
if (this._cacheData.nextResetTime < Date.now()) {
this._cacheData.todayChapterStart = hs.storage.getItem("chapterNum", 0);
this._cacheData.nextResetTime = this.calculateNextResetTime();
storage.setItem("LevelDifficultyResetTraitKey", this._cacheData);
t || hs.EventManager.dispatchModuleEvent(new hs.E_ChapterDifficultyStrategy_Event());
}
};
return n([ classId("LevelDifficultyResetTrait") ], e);
}(Trait);
r.LevelDifficultyResetTrait = o;
cc._RF.pop();
}, {} ]
}, {}, [ "LevelDifficultyResetTrait" ]);
//# sourceMappingURL=index.js.map
