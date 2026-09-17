window.__require = function e(r, t, o) {
function n(c, l) {
if (!t[c]) {
if (!r[c]) {
var a = c.split("/");
a = a[a.length - 1];
if (!r[a]) {
var u = "function" == typeof __require && __require;
if (!l && u) return u(a, !0);
if (i) return i(a, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = a;
}
var s = t[c] = {
exports: {}
};
r[c][0].call(s.exports, function(e) {
return n(r[c][1][e] || e);
}, s, s.exports, e, r, t, o);
}
return t[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < o.length; c++) n(o[c]);
return n;
}({
MergeBlockCreateFixedScoreTrait: [ function(e, r, t) {
"use strict";
cc._RF.push(r, "69547/dPPpG0L9+Bx0ZOfmp", "MergeBlockCreateFixedScoreTrait");
var o, n = this && this.__extends || (o = function(e, r) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, r) {
e.__proto__ = r;
} || function(e, r) {
for (var t in r) Object.prototype.hasOwnProperty.call(r, t) && (e[t] = r[t]);
})(e, r);
}, function(e, r) {
o(e, r);
function t() {
this.constructor = e;
}
e.prototype = null === r ? Object.create(r) : (t.prototype = r.prototype, new t());
}), i = this && this.__assign || function() {
return (i = Object.assign || function(e) {
for (var r, t = 1, o = arguments.length; t < o; t++) {
r = arguments[t];
for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
}
return e;
}).apply(this, arguments);
}, c = this && this.__decorate || function(e, r, t, o) {
var n, i = arguments.length, c = i < 3 ? r : null === o ? o = Object.getOwnPropertyDescriptor(r, t) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(e, r, t, o); else for (var l = e.length - 1; l >= 0; l--) (n = e[l]) && (c = (i < 3 ? n(c) : i > 3 ? n(r, t, c) : n(r, t)) || c);
return i > 3 && c && Object.defineProperty(r, t, c), c;
}, l = this && this.__values || function(e) {
var r = "function" == typeof Symbol && Symbol.iterator, t = r && e[r], o = 0;
if (t) return t.call(e);
if (e && "number" == typeof e.length) return {
next: function() {
e && o >= e.length && (e = void 0);
return {
value: e && e[o++],
done: !e
};
}
};
throw new TypeError(r ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(t, "__esModule", {
value: !0
});
t.MergeBlockCreateFixedScoreTrait = void 0;
var a = function(e) {
n(r, e);
function r() {
return null !== e && e.apply(this, arguments) || this;
}
r.prototype.onActive = function(e) {
(hs.tp.isClassScore_ProxyComputeScoreAddOption(e) || hs.tp.isMergeBlocksScore_ProxyComputeScoreAddOption(e)) && this._handleScoreComputation(e);
};
Object.defineProperty(r.prototype, "onActiveCondition", {
get: function() {
var e = TRAIT("MergeBlockTrait");
return !0 === (null == e ? void 0 : e.active) && !0 === (null == e ? void 0 : e.isCurrentMode);
},
enumerable: !1,
configurable: !0
});
r.prototype._handleScoreComputation = function(e) {
var r, t, o, n, i = e.args[0], c = e.args[1];
if (i && (null == c ? void 0 : c.state)) {
var a = hs.storage.getItem("mergeBlockTrait", null), u = null == a ? void 0 : a.lastMergeResult;
if (u && 0 !== u.mergedBlocks.length) {
var s = 0, f = [];
try {
for (var p = l(u.mergedBlocks), d = p.next(); !d.done; d = p.next()) {
var y = d.value, g = this._getScoreBySize(y.size);
if (g > 0) {
s += g;
f.push({
block: y,
bonus: g
});
}
}
} catch (e) {
r = {
error: e
};
} finally {
try {
d && !d.done && (t = p.return) && t.call(p);
} finally {
if (r) throw r.error;
}
}
if (0 !== s) {
i.baseScore += s;
this._onMergeBlockCreated(f, s);
var h = i.curScore + i.baseScore + i.comboScore + i.screenScore + i.blockScore, v = null !== (n = null === (o = TRAIT("MergeBlockTrait")) || void 0 === o ? void 0 : o.scoreStorageKey) && void 0 !== n ? n : "classScore";
hs.storage.setItem(v, h);
}
}
}
};
r.prototype._getScoreBySize = function(e) {
var r, t = e - 2, o = this.props.sizeScoreList;
return t < 0 || t >= o.length ? 0 : null !== (r = o[t]) && void 0 !== r ? r : 0;
};
r.prototype.getScoreForSize = function(e) {
return this._getScoreBySize(e);
};
r.prototype._onMergeBlockCreated = function(e) {
var r;
null === (r = TRAIT("MergeBlockTrait")) || void 0 === r || r.playMergeScore(e.map(function(e) {
var r = e.block, t = e.bonus;
return i(i({}, r), {
bonus: t
});
}));
};
return c([ classId("MergeBlockCreateFixedScoreTrait") ], r);
}(Trait);
t.MergeBlockCreateFixedScoreTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "MergeBlockCreateFixedScoreTrait" ]);
//# sourceMappingURL=index.js.map
