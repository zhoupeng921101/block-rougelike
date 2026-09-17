window.__require = function e(o, t, r) {
function n(c, l) {
if (!t[c]) {
if (!o[c]) {
var a = c.split("/");
a = a[a.length - 1];
if (!o[a]) {
var s = "function" == typeof __require && __require;
if (!l && s) return s(a, !0);
if (i) return i(a, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = a;
}
var u = t[c] = {
exports: {}
};
o[c][0].call(u.exports, function(e) {
return n(o[c][1][e] || e);
}, u, u.exports, e, o, t, r);
}
return t[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < r.length; c++) n(r[c]);
return n;
}({
MergeBlockNoComboFixedScoreTrait: [ function(e, o, t) {
"use strict";
cc._RF.push(o, "64d82UXL8xFtIZ/NddOlzqz", "MergeBlockNoComboFixedScoreTrait");
var r, n = this && this.__extends || (r = function(e, o) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, o) {
e.__proto__ = o;
} || function(e, o) {
for (var t in o) Object.prototype.hasOwnProperty.call(o, t) && (e[t] = o[t]);
})(e, o);
}, function(e, o) {
r(e, o);
function t() {
this.constructor = e;
}
e.prototype = null === o ? Object.create(o) : (t.prototype = o.prototype, new t());
}), i = this && this.__assign || function() {
return (i = Object.assign || function(e) {
for (var o, t = 1, r = arguments.length; t < r; t++) {
o = arguments[t];
for (var n in o) Object.prototype.hasOwnProperty.call(o, n) && (e[n] = o[n]);
}
return e;
}).apply(this, arguments);
}, c = this && this.__decorate || function(e, o, t, r) {
var n, i = arguments.length, c = i < 3 ? o : null === r ? r = Object.getOwnPropertyDescriptor(o, t) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(e, o, t, r); else for (var l = e.length - 1; l >= 0; l--) (n = e[l]) && (c = (i < 3 ? n(c) : i > 3 ? n(o, t, c) : n(o, t)) || c);
return i > 3 && c && Object.defineProperty(o, t, c), c;
}, l = this && this.__values || function(e) {
var o = "function" == typeof Symbol && Symbol.iterator, t = o && e[o], r = 0;
if (t) return t.call(e);
if (e && "number" == typeof e.length) return {
next: function() {
e && r >= e.length && (e = void 0);
return {
value: e && e[r++],
done: !e
};
}
};
throw new TypeError(o ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(t, "__esModule", {
value: !0
});
t.MergeBlockNoComboFixedScoreTrait = void 0;
var a = function(e) {
n(o, e);
function o() {
return null !== e && e.apply(this, arguments) || this;
}
o.prototype.onActive = function(e) {
(hs.tp.isClassScore_ProxyComputeScoreAddOption(e) || hs.tp.isMergeBlocksScore_ProxyComputeScoreAddOption(e)) && this._handleScoreComputation(e);
hs.tp.isBlocksProducerTouchOnAfterTouchEndAddActivityFilter(e) && !this.props.showComboEffect && (e.args[1].continuousEliminateTimes = 0);
};
Object.defineProperty(o.prototype, "onActiveCondition", {
get: function() {
var e = TRAIT("MergeBlockTrait");
return !0 === (null == e ? void 0 : e.active) && !0 === (null == e ? void 0 : e.isCurrentMode);
},
enumerable: !1,
configurable: !0
});
o.prototype._handleScoreComputation = function(e) {
var o, t, r, n, i = e.args[0], c = e.args[1];
if (i && (null == c ? void 0 : c.state)) {
i.comboScore = 0;
var a = this._computePureElimScore(c);
i.baseScore += a;
var s = hs.storage.getItem("mergeBlockTrait", null), u = null == s ? void 0 : s.lastEliminationResult;
if (u && u.eliminated.length > 0) {
var p = 0;
try {
for (var f = l(u.eliminated), d = f.next(); !d.done; d = f.next()) p += d.value.size * this.props.scorePerSize;
} catch (e) {
o = {
error: e
};
} finally {
try {
d && !d.done && (t = f.return) && t.call(f);
} finally {
if (o) throw o.error;
}
}
i.baseScore += p;
this._onMergeBlockEliminated(u.eliminated, p);
}
var h = i.curScore + i.baseScore + i.comboScore + i.screenScore + i.blockScore, m = null !== (n = null === (r = TRAIT("MergeBlockTrait")) || void 0 === r ? void 0 : r.scoreStorageKey) && void 0 !== n ? n : "classScore";
hs.storage.setItem(m, h);
}
};
o.prototype._computePureElimScore = function(e) {
var o = hs.gameInfo.gameMode === hs.GameMode.Class ? "classGuideStep" : "mergeBlocksGuideStep";
if (hs.storage.getItem(o, 0) < 2) return 0;
var t = e.state.eliminateCount;
return t <= 0 ? 0 : 1 === t ? 10 : 10 * t * (t - 1);
};
o.prototype._onMergeBlockEliminated = function(e) {
var o, t = this;
null === (o = TRAIT("MergeBlockTrait")) || void 0 === o || o.playMergeScore(e.map(function(e) {
return i(i({}, e), {
bonus: e.size * t.props.scorePerSize
});
}));
};
return c([ classId("MergeBlockNoComboFixedScoreTrait") ], o);
}(Trait);
t.MergeBlockNoComboFixedScoreTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "MergeBlockNoComboFixedScoreTrait" ]);
//# sourceMappingURL=index.js.map
