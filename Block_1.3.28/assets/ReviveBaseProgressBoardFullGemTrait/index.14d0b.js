window.__require = function e(t, r, o) {
function n(a, l) {
if (!r[a]) {
if (!t[a]) {
var s = a.split("/");
s = s[s.length - 1];
if (!t[s]) {
var u = "function" == typeof __require && __require;
if (!l && u) return u(s, !0);
if (i) return i(s, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = s;
}
var c = r[a] = {
exports: {}
};
t[a][0].call(c.exports, function(e) {
return n(t[a][1][e] || e);
}, c, c.exports, e, t, r, o);
}
return r[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < o.length; a++) n(o[a]);
return n;
}({
ReviveBaseProgressBoardFullGemTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "07d457h4W1MgIJUaDqkgvBx", "ReviveBaseProgressBoardFullGemTrait");
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
}), i = this && this.__decorate || function(e, t, r, o) {
var n, i = arguments.length, a = i < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, o); else for (var l = e.length - 1; l >= 0; l--) (n = e[l]) && (a = (i < 3 ? n(a) : i > 3 ? n(t, r, a) : n(t, r)) || a);
return i > 3 && a && Object.defineProperty(t, r, a), a;
}, a = this && this.__values || function(e) {
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
var o, n, i = r.call(e), a = [];
try {
for (;(void 0 === t || t-- > 0) && !(o = i.next()).done; ) a.push(o.value);
} catch (e) {
n = {
error: e
};
} finally {
try {
o && !o.done && (r = i.return) && r.call(i);
} finally {
if (n) throw n.error;
}
}
return a;
}, s = this && this.__spread || function() {
for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(l(arguments[t]));
return e;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ReviveBaseProgressBoardFullGemTrait = void 0;
var u = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onActive = function(e) {
hs.tp.isChapterRevive_ProxyOnRevive_Success(e) && this.handleReviveSuccess();
};
t.prototype.handleReviveSuccess = function() {
if (this.isCollectLevel()) {
var e = this.getRemainGems();
if (0 !== e.length && 0 !== this.getTotalRemainCount(e)) {
var t = hs.chapterConfigInfo.getChapterProgress() >= .8;
this.fillBoardWithGems(e, t);
}
}
};
t.prototype.isCollectLevel = function() {
var e = hs.storage.getItem("chapterCondition");
return 1 === (null == e ? void 0 : e.Way);
};
t.prototype.getRemainGems = function() {
return hs.chapterCollectInfo.remainCollections.filter(function(e) {
return e.Value > 0;
});
};
t.prototype.getTotalRemainCount = function(e) {
return e.reduce(function(e, t) {
return e + t.Value;
}, 0);
};
t.prototype.getRandomGemType = function(e) {
var t, r, o, n, i = this.getTotalRemainCount(e);
if (0 === i) return null !== (n = null === (o = e[0]) || void 0 === o ? void 0 : o.Key) && void 0 !== n ? n : 101;
var l = Math.random() * i, s = 0;
try {
for (var u = a(e), c = u.next(); !c.done; c = u.next()) {
var f = c.value;
if (l < (s += f.Value)) return f.Key;
}
} catch (e) {
t = {
error: e
};
} finally {
try {
c && !c.done && (r = u.return) && r.call(u);
} finally {
if (t) throw t.error;
}
}
return e[e.length - 1].Key;
};
t.prototype.fillBoardWithGems = function(e, t) {
var r = hs.boardInfo.chapterFaceBlocks;
if (r && Array.isArray(r)) {
for (var o = r.map(function(e) {
return s(e);
}), n = 0, i = new Map(), a = 0; a < o.length; a++) for (var l = 0; l < o[a].length; l++) {
var u = o[a][l];
if (u >= 0 && u < 100) {
var c = Math.random();
if (t || c < .5) {
var f = this.getRandomGemType(e);
o[a][l] = f;
i.has(f) ? i.set(f, i.get(f) + 1) : i.set(f, 1);
n++;
}
}
}
if (n > 0) {
Cinst(hs.Board).setState({
boards: o
});
hs.storage.setItem("chapterFaceBlocks", o);
}
}
};
return i([ classId("ReviveBaseProgressBoardFullGemTrait") ], t);
}(Trait);
r.ReviveBaseProgressBoardFullGemTrait = u;
cc._RF.pop();
}, {} ]
}, {}, [ "ReviveBaseProgressBoardFullGemTrait" ]);
//# sourceMappingURL=index.js.map
