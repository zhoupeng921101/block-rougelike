window.__require = function t(r, i, o) {
function e(s, l) {
if (!i[s]) {
if (!r[s]) {
var n = s.split("/");
n = n[n.length - 1];
if (!r[n]) {
var h = "function" == typeof __require && __require;
if (!l && h) return h(n, !0);
if (a) return a(n, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = n;
}
var u = i[s] = {
exports: {}
};
r[s][0].call(u.exports, function(t) {
return e(r[s][1][t] || t);
}, u, u.exports, t, r, i, o);
}
return i[s].exports;
}
for (var a = "function" == typeof __require && __require, s = 0; s < o.length; s++) e(o[s]);
return e;
}({
OptimalFillClearTrait: [ function(t, r, i) {
"use strict";
cc._RF.push(r, "6c294e/Hg9LCLD3kSsc9K8t", "OptimalFillClearTrait");
var o, e = this && this.__extends || (o = function(t, r) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, r) {
t.__proto__ = r;
} || function(t, r) {
for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (t[i] = r[i]);
})(t, r);
}, function(t, r) {
o(t, r);
function i() {
this.constructor = t;
}
t.prototype = null === r ? Object.create(r) : (i.prototype = r.prototype, new i());
}), a = this && this.__decorate || function(t, r, i, o) {
var e, a = arguments.length, s = a < 3 ? r : null === o ? o = Object.getOwnPropertyDescriptor(r, i) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, r, i, o); else for (var l = t.length - 1; l >= 0; l--) (e = t[l]) && (s = (a < 3 ? e(s) : a > 3 ? e(r, i, s) : e(r, i)) || s);
return a > 3 && s && Object.defineProperty(r, i, s), s;
}, s = this && this.__read || function(t, r) {
var i = "function" == typeof Symbol && t[Symbol.iterator];
if (!i) return t;
var o, e, a = i.call(t), s = [];
try {
for (;(void 0 === r || r-- > 0) && !(o = a.next()).done; ) s.push(o.value);
} catch (t) {
e = {
error: t
};
} finally {
try {
o && !o.done && (i = a.return) && i.call(a);
} finally {
if (e) throw e.error;
}
}
return s;
}, l = this && this.__spread || function() {
for (var t = [], r = 0; r < arguments.length; r++) t = t.concat(s(arguments[r]));
return t;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
i.OptimalFillClearTrait = void 0;
var n = function(t) {
e(r, t);
function r() {
return null !== t && t.apply(this, arguments) || this;
}
i = r;
r.prototype.onActive = function(t) {
var r, i, o, e, a = hs.tp.isAlgorithm_ProxyFailStrategy(t), s = hs.tp.isAlgorithmIOS_ProxyFailStrategy(t), n = hs.tp.isClassAlgorithmStrategy_Replace_ProxyPreprocessingBlankAlgorithm(t), h = hs.tp.isClassAlgorithmStrategyIOS_Replace_ProxyPreprocessingBlankAlgorithm(t), u = hs.tp.isClassAlgorithmStrategy_Condition_ProxyOnAlgorithmStrategyCondition(t), g = hs.tp.isClassAlgorithmStrategyIOS_Condition_ProxyOnAlgorithmStrategyCondition(t), f = hs.tp.isClassCombo_ProxyOnGameStart(t), _ = hs.tp.isClassCombo_ProxyTraitsContinuousEliminateTimes(t), c = hs.tp.isClassAlgorithmStrategy_BlocksPos_ProxyTriggerBlocksPosTrait(t), m = hs.tp.isClassAlgorithmStrategyIOS_BlocksPos_ProxyTriggerBlocksPosTrait(t);
f && hs.algorithmSDKTraitInfo.setTraitData({
comboNum: 0
});
if (_) {
var p = "number" == typeof (null === (r = t.args) || void 0 === r ? void 0 : r[0]) ? t.args[0] : 0, y = Number.isFinite(p) && p >= 0 ? p : 0;
hs.algorithmSDKTraitInfo.setTraitData({
comboNum: y
});
}
if (c || m) {
if ((null === (i = hs.algorithmName) || void 0 === i ? void 0 : i.algoActualId) !== hs.OFFER_TYPE.OPTIMAL_FILL_CLEAR) return;
if (Array.isArray(null === (o = hs.algorithmInfo) || void 0 === o ? void 0 : o.blockIdList) && 3 === hs.algorithmInfo.blockIdList.length) {
hs.algorithmStrategyBlocksPosInfo.adjustBlocksPosList(hs.operaPosMiddle);
hs.algorithmStrategyBlocksPosInfo.setBlocksPosList(hs.OPERA_POS_TYPE.MIDDLE);
t.replace = !0;
}
}
if (!n && !h) if (a || s) {
if (hs.classGameInfo.roundNum <= this.getRoundThreshold()) return;
var A = Array.isArray(null === (e = hs.algorithmStrategyInfo) || void 0 === e ? void 0 : e.algorithmFailList) ? hs.algorithmStrategyInfo.algorithmFailList : [];
if (A.length <= 0) return;
var F = A[0];
if ("number" != typeof F) return;
if (!this.isFillChainAlgo(F)) return;
if (A[0] === hs.OFFER_TYPE.OPTIMAL_FILL_CLEAR) return;
if (Math.random() >= this.getChance()) return;
var I = l([ hs.OFFER_TYPE.OPTIMAL_FILL_CLEAR ], A);
hs.algorithmStrategyInfo.setAlgorithmFailList(I);
hs.algorithmStrategyInfo.setAlgorithmSourceLevel1(hs.ClassAlgorithmSourceType.AlgoTrait);
hs.algorithmStrategyInfo.setAlgorithmSourceLevel2(this.traitName);
} else if (u || g) {
if (hs.classGameInfo.roundNum <= this.getRoundThreshold()) return;
if (!this.isPrimaryFillChain()) return;
if (Math.random() >= this.getChance()) return;
this.applyOptimalFillClearAsPrimary();
}
};
r.prototype.getRoundThreshold = function() {
var t, r = null === (t = this.props) || void 0 === t ? void 0 : t.round, i = "number" == typeof r ? r : 6;
return Number.isFinite(i) && i >= 0 ? i : 6;
};
r.prototype.getChance = function() {
var t, r = null === (t = this.props) || void 0 === t ? void 0 : t.chance, i = "number" == typeof r ? r : .5;
return Number.isFinite(i) ? Math.max(0, Math.min(1, i)) : .5;
};
r.prototype.isPrimaryFillChain = function() {
var t, r = Array.isArray(null === (t = hs.algorithmStrategyInfo) || void 0 === t ? void 0 : t.algorithmList) ? hs.algorithmStrategyInfo.algorithmList : [];
if (r.length <= 0) return !1;
var i = r[0];
return "number" == typeof i && this.isFillChainAlgo(i);
};
r.prototype.isFillChainAlgo = function(t) {
return i.FILL_CHAIN_TYPES.indexOf(t) >= 0;
};
r.prototype.applyOptimalFillClearAsPrimary = function() {
var t, r = (Array.isArray(null === (t = hs.algorithmStrategyInfo) || void 0 === t ? void 0 : t.algorithmList) ? hs.algorithmStrategyInfo.algorithmList : []).filter(function(t) {
return t !== hs.OFFER_TYPE.OPTIMAL_FILL_CLEAR;
}), i = l([ hs.OFFER_TYPE.OPTIMAL_FILL_CLEAR ], r);
hs.algorithmStrategyInfo.setAlgorithmList(i);
hs.algorithmStrategyInfo.setAlgorithmFailList([ hs.OFFER_TYPE.SUI_JI_WU_SI ]);
hs.algorithmStrategyInfo.setAlgorithmSourceLevel1(hs.ClassAlgorithmSourceType.AlgoTrait);
hs.algorithmStrategyInfo.setAlgorithmSourceLevel2(this.traitName);
};
var i;
r.FILL_CHAIN_TYPES = [ hs.OFFER_TYPE.TIAN_KONG_XIAO_CHU, hs.OFFER_TYPE.TIAN_KONG_XIAO_CHU_NO_BIT, hs.OFFER_TYPE.ALGO_QUICK, hs.OFFER_TYPE.ALGO_MIX_TKXC, hs.OFFER_TYPE.ALGO_FILL_MORE_AREA, hs.OFFER_TYPE.EMPTYDONGFILL, hs.OFFER_TYPE.IOS_EMPTYDONGFILL, hs.OFFER_TYPE.OPTIMAL_FILL_CLEAR ];
return i = a([ classId("OptimalFillClearTrait") ], r);
}(Trait);
i.OptimalFillClearTrait = n;
cc._RF.pop();
}, {} ]
}, {}, [ "OptimalFillClearTrait" ]);
//# sourceMappingURL=index.js.map
