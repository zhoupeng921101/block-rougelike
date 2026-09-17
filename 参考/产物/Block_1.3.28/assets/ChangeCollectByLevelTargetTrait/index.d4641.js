window.__require = function e(t, r, o) {
function n(i, l) {
if (!r[i]) {
if (!t[i]) {
var c = i.split("/");
c = c[c.length - 1];
if (!t[c]) {
var f = "function" == typeof __require && __require;
if (!l && f) return f(c, !0);
if (a) return a(c, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = c;
}
var h = r[i] = {
exports: {}
};
t[i][0].call(h.exports, function(e) {
return n(t[i][1][e] || e);
}, h, h.exports, e, t, r, o);
}
return r[i].exports;
}
for (var a = "function" == typeof __require && __require, i = 0; i < o.length; i++) n(o[i]);
return n;
}({
ChangeCollectByLevelTargetTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "66ea1YvT/VFkZS/q1rN4a4+", "ChangeCollectByLevelTargetTrait");
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
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ChangeCollectByLevelTargetTrait = void 0;
var l = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onActive = function(e) {
var t, r;
if (hs.tp.isChapterCollectionProducer_ProxyChangeCollection(e)) {
var o = hs.chapterConfigInfo.chapterDatasCfg[hs.chapterGameInfo.chapterNum].Condition.RequiredCollections, n = 0;
try {
for (var a = i(o), l = a.next(); !l.done; l = a.next()) n += l.value.Value;
} catch (e) {
t = {
error: e
};
} finally {
try {
l && !l.done && (r = a.return) && r.call(a);
} finally {
if (t) throw t.error;
}
}
for (var c = 0, f = this.targetGroup; c < f.length && !(n <= f[c]); ) c++;
var h = this.collectGroup, u = h[c = Math.min(c, h.length - 1)];
if (!u || 2 !== u.length) return;
for (var p = [], s = [ [], [], [] ], g = storage.getItem("chapterCollectionLists", []), y = 0; y < g.length; y++) {
var v = g[y];
for (var _ in v) {
var d = v[_];
if (d && (!Array.isArray(d) || 0 !== d.length)) {
s[y].push(d);
-1 == p.indexOf(d.Key) && p.push(d.Key);
}
}
}
var C = hs.algorithmName.algoActualName, m = this.getBlockLenArray();
for (y = 0; y < s.length; y++) if (C[y] != hs.OFFER_TYPE_STRINGS[hs.OFFER_TYPE.ELIMINTE_PLEASURE] && s[y].length !== m[y]) {
var T = hs.randomIntInclusive(u[0], u[1]);
if (s[y].length > T) for (var b = s[y].length - T; b > 0; ) {
var P = hs.randomInt(0, s[y].length);
s[y].splice(P, 1);
b--;
} else if (s[y].length < T) {
var I = T - s[y].length, L = m[y] - s[y].length, O = Math.max(0, Math.min(I, L));
if (O > 0) for (;O > 0; ) {
for (var S = new Set(s[y].map(function(e) {
return e.pos;
})), B = [], w = 0; w < m[y]; w++) S.has(w) || B.push(w);
if (!(B.length > 0)) break;
var x = B[Math.floor(Math.random() * B.length)], E = p[Math.floor(Math.random() * p.length)];
s[y].push({
Key: E,
pos: x
});
O--;
}
}
}
var j = [], A = function(e) {
if (s[e].length > 0) {
var t = {};
s[e].forEach(function(e) {
t[e.pos] = e;
});
j.push(t);
} else j.push({});
};
for (y = 0; y < s.length; y++) A(y);
var R = [].concat(j);
storage.setItem("chapterCollectionLists", R);
e.returnState = !0;
}
};
t.prototype.getBlockLenArray = function() {
for (var e = [ 0, 0, 0 ], t = 0; t < 3; t++) {
var r = hs.AlgorithmPosType[hs.chapterAlgorithmInfo.blockIdList[t]].length;
e[t] = r;
}
return e;
};
Object.defineProperty(t.prototype, "targetGroup", {
get: function() {
return hs.traitConfigSafePropsInfo.getSafePropValueByKey("ChangeCollectByLevelTargetTrait", "targetGroup", this.props, [ 30, 60 ]);
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "collectGroup", {
get: function() {
return hs.traitConfigSafePropsInfo.getSafePropValueByKey("ChangeCollectByLevelTargetTrait", "collectGroup", this.props, [ [ 1, 1 ], [ 1, 2 ], [ 2, 3 ] ]);
},
enumerable: !1,
configurable: !0
});
return a([ classId("ChangeCollectByLevelTargetTrait") ], t);
}(Trait);
r.ChangeCollectByLevelTargetTrait = l;
cc._RF.pop();
}, {} ]
}, {}, [ "ChangeCollectByLevelTargetTrait" ]);
//# sourceMappingURL=index.js.map
