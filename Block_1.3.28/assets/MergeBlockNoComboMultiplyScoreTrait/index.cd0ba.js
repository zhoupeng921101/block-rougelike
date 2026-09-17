window.__require = function e(o, t, r) {
function n(c, l) {
if (!t[c]) {
if (!o[c]) {
var u = c.split("/");
u = u[u.length - 1];
if (!o[u]) {
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
o[c][0].call(s.exports, function(e) {
return n(o[c][1][e] || e);
}, s, s.exports, e, o, t, r);
}
return t[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < r.length; c++) n(r[c]);
return n;
}({
MergeBlockNoComboMultiplyScoreTrait: [ function(e, o, t) {
"use strict";
cc._RF.push(o, "ebf15Emz4FNtpLQJB47pJ1W", "MergeBlockNoComboMultiplyScoreTrait");
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
};
Object.defineProperty(t, "__esModule", {
value: !0
});
t.MergeBlockNoComboMultiplyScoreTrait = void 0;
var l = function(e) {
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
var o, t, r, n = e.args[0], i = e.args[1];
if (n && (null == i ? void 0 : i.state)) {
n.comboScore = 0;
var c = this._computePureElimScore(i);
n.baseScore += c;
var l = hs.storage.getItem("mergeBlockTrait", null), u = null == l ? void 0 : l.lastEliminationResult, a = null !== (o = null == u ? void 0 : u.maxSize) && void 0 !== o ? o : 0;
if (a > 0) {
var s = n.baseScore, p = n.screenScore, f = n.blockScore;
n.baseScore = s * a;
n.screenScore = p * a;
n.blockScore = f * a;
var d = s + p + f, v = d * a;
this._onMergeBlockEliminated(u.eliminated, a, d, v);
}
var g = n.curScore + n.baseScore + n.comboScore + n.screenScore + n.blockScore, h = null !== (r = null === (t = TRAIT("MergeBlockTrait")) || void 0 === t ? void 0 : t.scoreStorageKey) && void 0 !== r ? r : "classScore";
hs.storage.setItem(h, g);
}
};
o.prototype._computePureElimScore = function(e) {
var o = hs.gameInfo.gameMode === hs.GameMode.Class ? "classGuideStep" : "mergeBlocksGuideStep";
if (hs.storage.getItem(o, 0) < 2) return 0;
var t = e.state.eliminateCount;
return t <= 0 ? 0 : 1 === t ? 10 : 10 * t * (t - 1);
};
o.prototype._onMergeBlockEliminated = function(e, o, t, r) {
var n, c, l = r - t, u = null !== (n = e.find(function(e) {
return e.size === o;
})) && void 0 !== n ? n : e[0];
u && l > 0 && (null === (c = TRAIT("MergeBlockTrait")) || void 0 === c || c.playMergeScore([ i(i({}, u), {
bonus: l
}) ]));
};
return c([ classId("MergeBlockNoComboMultiplyScoreTrait") ], o);
}(Trait);
t.MergeBlockNoComboMultiplyScoreTrait = l;
cc._RF.pop();
}, {} ]
}, {}, [ "MergeBlockNoComboMultiplyScoreTrait" ]);
//# sourceMappingURL=index.js.map
