window.__require = function e(r, t, o) {
function n(c, l) {
if (!t[c]) {
if (!r[c]) {
var u = c.split("/");
u = u[u.length - 1];
if (!r[u]) {
var a = "function" == typeof __require && __require;
if (!l && a) return a(u, !0);
if (i) return i(u, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = u;
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
MergeBlockMultiplyScoreTrait: [ function(e, r, t) {
"use strict";
cc._RF.push(r, "7c02fgPxbtKRaT/Z28Yc9SP", "MergeBlockMultiplyScoreTrait");
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
};
Object.defineProperty(t, "__esModule", {
value: !0
});
t.MergeBlockMultiplyScoreTrait = void 0;
var l = function(e) {
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
var r, t, o, n = e.args[0], i = e.args[1];
if (n && (null == i ? void 0 : i.state)) {
var c = hs.storage.getItem("mergeBlockTrait", null), l = null == c ? void 0 : c.lastEliminationResult, u = null !== (r = null == l ? void 0 : l.maxSize) && void 0 !== r ? r : 0;
if (0 !== u) {
var a = n.baseScore, s = n.comboScore, p = n.screenScore, f = n.blockScore;
n.baseScore = a * u;
n.comboScore = s * u;
n.screenScore = p * u;
n.blockScore = f * u;
var d = a + s + p + f, v = d * u;
this._onMergeBlockEliminated(l.eliminated, u, d, v);
var _ = n.curScore + n.baseScore + n.comboScore + n.screenScore + n.blockScore, y = null !== (o = null === (t = TRAIT("MergeBlockTrait")) || void 0 === t ? void 0 : t.scoreStorageKey) && void 0 !== o ? o : "classScore";
hs.storage.setItem(y, _);
}
}
};
r.prototype._onMergeBlockEliminated = function(e, r, t, o) {
var n, c, l = o - t, u = null !== (n = e.find(function(e) {
return e.size === r;
})) && void 0 !== n ? n : e[0];
u && l > 0 && (null === (c = TRAIT("MergeBlockTrait")) || void 0 === c || c.playMergeScore([ i(i({}, u), {
bonus: l
}) ]));
};
return c([ classId("MergeBlockMultiplyScoreTrait") ], r);
}(Trait);
t.MergeBlockMultiplyScoreTrait = l;
cc._RF.pop();
}, {} ]
}, {}, [ "MergeBlockMultiplyScoreTrait" ]);
//# sourceMappingURL=index.js.map
