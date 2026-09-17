window.__require = function r(e, t, o) {
function n(i, c) {
if (!t[i]) {
if (!e[i]) {
var f = i.split("/");
f = f[f.length - 1];
if (!e[f]) {
var p = "function" == typeof __require && __require;
if (!c && p) return p(f, !0);
if (a) return a(f, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = f;
}
var s = t[i] = {
exports: {}
};
e[i][0].call(s.exports, function(r) {
return n(e[i][1][r] || r);
}, s, s.exports, r, e, t, o);
}
return t[i].exports;
}
for (var a = "function" == typeof __require && __require, i = 0; i < o.length; i++) n(o[i]);
return n;
}({
ChapterTopInfoScoreVariableSpeedBarTrait: [ function(r, e, t) {
"use strict";
cc._RF.push(e, "b3c4dXm96hLnA0eLzpLXG1+", "ChapterTopInfoScoreVariableSpeedBarTrait");
var o, n = this && this.__extends || (o = function(r, e) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(r, e) {
r.__proto__ = e;
} || function(r, e) {
for (var t in e) Object.prototype.hasOwnProperty.call(e, t) && (r[t] = e[t]);
})(r, e);
}, function(r, e) {
o(r, e);
function t() {
this.constructor = r;
}
r.prototype = null === e ? Object.create(e) : (t.prototype = e.prototype, new t());
}), a = this && this.__decorate || function(r, e, t, o) {
var n, a = arguments.length, i = a < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, t) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(r, e, t, o); else for (var c = r.length - 1; c >= 0; c--) (n = r[c]) && (i = (a < 3 ? n(i) : a > 3 ? n(e, t, i) : n(e, t)) || i);
return a > 3 && i && Object.defineProperty(e, t, i), i;
}, i = this && this.__read || function(r, e) {
var t = "function" == typeof Symbol && r[Symbol.iterator];
if (!t) return r;
var o, n, a = t.call(r), i = [];
try {
for (;(void 0 === e || e-- > 0) && !(o = a.next()).done; ) i.push(o.value);
} catch (r) {
n = {
error: r
};
} finally {
try {
o && !o.done && (t = a.return) && t.call(a);
} finally {
if (n) throw n.error;
}
}
return i;
};
Object.defineProperty(t, "__esModule", {
value: !0
});
t.ChapterTopInfoScoreVariableSpeedBarTrait = void 0;
var c = function(r) {
n(e, r);
function e() {
return null !== r && r.apply(this, arguments) || this;
}
e.prototype.onActive = function(r) {
if (hs.tp.isChapterTopInfoScoreRefreshProgress(r)) {
r.replace = !0;
this.refreshProgress(r);
}
};
e.prototype.refreshProgress = function(r) {
var e = r.target, t = r.args[0], o = e.state.targetScore, n = 0;
if (t >= o) n = hs.ChapterTopInfoConfig.scoreMaskWith; else {
var a = t / o, i = this.calcVariablePercent(a);
n = Math.min(hs.ChapterTopInfoConfig.scoreMaskWith, Math.floor(i * hs.ChapterTopInfoConfig.scoreMaskWith));
}
e.mask.width = n;
e.curScoreLab.string = "" + t;
e.curScoreBg.x = e.mask.x + e.mask.width;
};
e.prototype.calcVariablePercent = function(r) {
var e, t = this.props.index || [], o = this.props.sections || [], n = this.props.grow_rate || [];
if (o.length !== t.length || o.length !== n.length) return r;
if (o.length <= 0) return r;
for (var a = 0, c = Math.max(0, Math.min(r, 1)), f = 0; f < o.length; f++) {
var p = i(o[f] || [], 2), s = p[0], h = void 0 === s ? 0 : s, l = p[1], u = void 0 === l ? 0 : l, d = null !== (e = n[f]) && void 0 !== e ? e : 1;
if (f === o.length - 1) {
if (c >= u) {
a += Math.max(u - h, 0) * d;
break;
}
if (c >= h) {
a += Math.max(c - h, 0) * d;
break;
}
} else {
if (c > u) {
a += Math.max(u - h, 0) * d;
continue;
}
if (c >= h) {
a += Math.max(c - h, 0) * d;
break;
}
}
}
var v = o.reduce(function(r, e, t) {
var o, a = i(e || [], 2), c = a[0], f = void 0 === c ? 0 : c, p = a[1], s = void 0 === p ? 0 : p, h = null !== (o = n[t]) && void 0 !== o ? o : 1;
return r + Math.max(s - f, 0) * h;
}, 0), _ = v > 0 ? v : 1;
return Math.min(a / _, 1);
};
return a([ classId("ChapterTopInfoScoreVariableSpeedBarTrait") ], e);
}(Trait);
t.ChapterTopInfoScoreVariableSpeedBarTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "ChapterTopInfoScoreVariableSpeedBarTrait" ]);
//# sourceMappingURL=index.js.map
