window.__require = function r(o, t, e) {
function l(n, a) {
if (!t[n]) {
if (!o[n]) {
var s = n.split("/");
s = s[s.length - 1];
if (!o[s]) {
var f = "function" == typeof __require && __require;
if (!a && f) return f(s, !0);
if (i) return i(s, !0);
throw new Error("Cannot find module '" + n + "'");
}
n = s;
}
var c = t[n] = {
exports: {}
};
o[n][0].call(c.exports, function(r) {
return l(o[n][1][r] || r);
}, c, c.exports, r, o, t, e);
}
return t[n].exports;
}
for (var i = "function" == typeof __require && __require, n = 0; n < e.length; n++) l(e[n]);
return l;
}({
SolidColorLevelOmitColorsTrait: [ function(r, o, t) {
"use strict";
cc._RF.push(o, "43eb8KVj9VOiotxK2w4lLje", "SolidColorLevelOmitColorsTrait");
var e, l = this && this.__extends || (e = function(r, o) {
return (e = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(r, o) {
r.__proto__ = o;
} || function(r, o) {
for (var t in o) Object.prototype.hasOwnProperty.call(o, t) && (r[t] = o[t]);
})(r, o);
}, function(r, o) {
e(r, o);
function t() {
this.constructor = r;
}
r.prototype = null === o ? Object.create(o) : (t.prototype = o.prototype, new t());
}), i = this && this.__decorate || function(r, o, t, e) {
var l, i = arguments.length, n = i < 3 ? o : null === e ? e = Object.getOwnPropertyDescriptor(o, t) : e;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(r, o, t, e); else for (var a = r.length - 1; a >= 0; a--) (l = r[a]) && (n = (i < 3 ? l(n) : i > 3 ? l(o, t, n) : l(o, t)) || n);
return i > 3 && n && Object.defineProperty(o, t, n), n;
}, n = this && this.__values || function(r) {
var o = "function" == typeof Symbol && Symbol.iterator, t = o && r[o], e = 0;
if (t) return t.call(r);
if (r && "number" == typeof r.length) return {
next: function() {
r && e >= r.length && (r = void 0);
return {
value: r && r[e++],
done: !r
};
}
};
throw new TypeError(o ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(t, "__esModule", {
value: !0
});
t.SolidColorLevelOmitColorsTrait = void 0;
var a = function(r) {
l(o, r);
function o() {
var o = null !== r && r.apply(this, arguments) || this;
o.omitColors = [ 1, 3 ];
o.allowedColors = [ 2, 4, 5, 6, 7 ];
return o;
}
o.prototype.onActive = function(r) {
var o, t, e, l, i, a;
if (hs.tp.isSolidColorTraitCheckSolidColor(r)) {
var s = hs.storage.getItem("classSolidColor", 0);
if (s > 0 && this.omitColors.includes(s)) {
var f = this.getRandomAllowedColor();
hs.storage.setItem("classSolidColor", f);
r.replace = !0;
r.returnState = !0;
}
}
if (hs.tp.isChapterDefaultBoard_ProxySetChapterColor(r)) {
var c = hs.storage.getItem("chapterFaceBlocks", null);
if (c && Array.isArray(c)) {
var u = -1, h = !0;
try {
for (var d = n(c), p = d.next(); !p.done; p = d.next()) {
var y = p.value;
if (Array.isArray(y)) try {
for (var v = (e = void 0, n(y)), C = v.next(); !C.done; C = v.next()) {
var _ = C.value;
if ("number" == typeof _ && _ >= 1 && _ <= 7) if (-1 === u) u = _; else if (u !== _) {
h = !1;
break;
}
}
} catch (r) {
e = {
error: r
};
} finally {
try {
C && !C.done && (l = v.return) && l.call(v);
} finally {
if (e) throw e.error;
}
}
if (!h) break;
}
} catch (r) {
o = {
error: r
};
} finally {
try {
p && !p.done && (t = d.return) && t.call(d);
} finally {
if (o) throw o.error;
}
}
if (h && u > 0 && this.omitColors.includes(u)) {
f = this.getRandomAllowedColor();
try {
for (var m = n(c), w = m.next(); !w.done; w = m.next()) {
y = w.value;
if (Array.isArray(y)) for (var b = 0; b < y.length; b++) "number" == typeof y[b] && y[b] >= 1 && y[b] <= 7 && (y[b] = f);
}
} catch (r) {
i = {
error: r
};
} finally {
try {
w && !w.done && (a = m.return) && a.call(m);
} finally {
if (i) throw i.error;
}
}
hs.chapterColorProducerGameInfo.setColorList([ f, f, f ]);
hs.storage.setItem("chapterFaceBlocks", c);
}
}
}
};
o.prototype.getRandomAllowedColor = function() {
var r = Math.floor(Math.random() * this.allowedColors.length);
return this.allowedColors[r];
};
return i([ classId("SolidColorLevelOmitColorsTrait") ], o);
}(Trait);
t.SolidColorLevelOmitColorsTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "SolidColorLevelOmitColorsTrait" ]);
//# sourceMappingURL=index.js.map
