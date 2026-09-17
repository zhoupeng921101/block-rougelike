window.__require = function t(r, i, e) {
function o(a, s) {
if (!i[a]) {
if (!r[a]) {
var l = a.split("/");
l = l[l.length - 1];
if (!r[l]) {
var h = "function" == typeof __require && __require;
if (!s && h) return h(l, !0);
if (n) return n(l, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = l;
}
var g = i[a] = {
exports: {}
};
r[a][0].call(g.exports, function(t) {
return o(r[a][1][t] || t);
}, g, g.exports, t, r, i, e);
}
return i[a].exports;
}
for (var n = "function" == typeof __require && __require, a = 0; a < e.length; a++) o(e[a]);
return o;
}({
FourRegionLargeFillTrait: [ function(t, r, i) {
"use strict";
cc._RF.push(r, "63da4pNpa5JZJAYrlG29a56", "FourRegionLargeFillTrait");
var e, o = this && this.__extends || (e = function(t, r) {
return (e = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, r) {
t.__proto__ = r;
} || function(t, r) {
for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (t[i] = r[i]);
})(t, r);
}, function(t, r) {
e(t, r);
function i() {
this.constructor = t;
}
t.prototype = null === r ? Object.create(r) : (i.prototype = r.prototype, new i());
}), n = this && this.__decorate || function(t, r, i, e) {
var o, n = arguments.length, a = n < 3 ? r : null === e ? e = Object.getOwnPropertyDescriptor(r, i) : e;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, r, i, e); else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (a = (n < 3 ? o(a) : n > 3 ? o(r, i, a) : o(r, i)) || a);
return n > 3 && a && Object.defineProperty(r, i, a), a;
}, a = this && this.__read || function(t, r) {
var i = "function" == typeof Symbol && t[Symbol.iterator];
if (!i) return t;
var e, o, n = i.call(t), a = [];
try {
for (;(void 0 === r || r-- > 0) && !(e = n.next()).done; ) a.push(e.value);
} catch (t) {
o = {
error: t
};
} finally {
try {
e && !e.done && (i = n.return) && i.call(n);
} finally {
if (o) throw o.error;
}
}
return a;
}, s = this && this.__spread || function() {
for (var t = [], r = 0; r < arguments.length; r++) t = t.concat(a(arguments[r]));
return t;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
i.FourRegionLargeFillTrait = void 0;
var l = function(t) {
o(r, t);
function r() {
return null !== t && t.apply(this, arguments) || this;
}
r.prototype.onActive = function(t) {
if (hs.tp.isClassAlgorithmStrategy_Condition_ProxyOnAlgorithmStrategyCondition(t) || hs.tp.isClassAlgorithmStrategyIOS_Condition_ProxyOnAlgorithmStrategyCondition(t)) {
var r = [ hs.OFFER_TYPE.TIAN_KONG_XIAO_CHU, hs.OFFER_TYPE.ALGO_QUICK, hs.OFFER_TYPE.ALGO_MIX_TKXC, hs.OFFER_TYPE.ALGO_FILL_MORE_AREA, hs.OFFER_TYPE.EMPTYDONGFILL, hs.OFFER_TYPE.IOS_EMPTYDONGFILL ], i = hs.OFFER_TYPE.FOUR_REGION_LARGE_FILL, e = hs.OFFER_TYPE.ALGO_FILL_MORE_AREA;
if (!(hs.algorithmStrategyLogic.haveAlgorithms(hs.algorithmStrategyInfo.algorithmList, r) || hs.algorithmStrategyLogic.haveAlgorithms(hs.algorithmStrategyInfo.algorithmFailList, r) || hs.algorithmStrategyLogic.haveAlgorithms(hs.algorithmStrategyInfo.algorithmSuccessList, r) || hs.algorithmStrategyLogic.haveAlgorithms(hs.algorithmStrategyInfo.algorithmPriorityList, r))) return;
var o = Array.isArray(hs.algorithmStrategyInfo.algorithmList) ? hs.algorithmStrategyInfo.algorithmList : [];
if (!hs.algorithmStrategyLogic.haveAlgorithms(o, r)) return;
var n = [ hs.OFFER_TYPE.TIAN_KONG_XIAO_CHU, hs.OFFER_TYPE.ALGO_QUICK, hs.OFFER_TYPE.ALGO_MIX_TKXC, hs.OFFER_TYPE.EMPTYDONGFILL, hs.OFFER_TYPE.IOS_EMPTYDONGFILL ], a = -1;
a = (f = (_ = o.filter(function(t) {
return t !== i;
})).indexOf(e)) >= 0 ? f + 1 : (F = _.findIndex(function(t) {
return n.indexOf(t) >= 0;
})) >= 0 ? F : _.length;
var l = s(_.slice(0, a), [ i ], _.slice(a));
hs.algorithmStrategyInfo.setAlgorithmList(l);
}
if (hs.tp.isClassAlgorithmStrategy_Deal_ProxyTriggerSpecialTraitBeforePuzzleTime(t) || hs.tp.isClassAlgorithmStrategyIOS_Deal_ProxyTriggerSpecialTraitBeforePuzzleTime(t)) {
var h = hs.OFFER_TYPE.FOUR_REGION_LARGE_FILL;
e = hs.OFFER_TYPE.ALGO_FILL_MORE_AREA;
if (!(Array.isArray(hs.algorithmStrategyInfo.algorithmList) ? hs.algorithmStrategyInfo.algorithmList : []).includes(hs.OFFER_TYPE.CLEAR_BOARD)) return;
var g = Array.isArray(hs.algorithmStrategyInfo.algorithmFailList) ? hs.algorithmStrategyInfo.algorithmFailList : [];
if (g.length <= 0) return;
var _, f, u = [ hs.OFFER_TYPE.TIAN_KONG_XIAO_CHU, hs.OFFER_TYPE.ALGO_QUICK, hs.OFFER_TYPE.ALGO_MIX_TKXC, hs.OFFER_TYPE.EMPTYDONGFILL, hs.OFFER_TYPE.IOS_EMPTYDONGFILL ];
if (!hs.algorithmStrategyLogic.haveAlgorithms(g, u)) return;
if (g.includes(h)) return;
a = -1;
if ((f = (_ = g.filter(function(t) {
return t !== h;
})).indexOf(e)) >= 0) a = f + 1; else {
var F;
a = (F = _.findIndex(function(t) {
return u.indexOf(t) >= 0;
})) >= 0 ? F : _.length;
}
var c = s(_.slice(0, a), [ h ], _.slice(a));
hs.algorithmStrategyInfo.setAlgorithmFailList(c);
}
};
return n([ classId("FourRegionLargeFillTrait") ], r);
}(Trait);
i.FourRegionLargeFillTrait = l;
cc._RF.pop();
}, {} ]
}, {}, [ "FourRegionLargeFillTrait" ]);
//# sourceMappingURL=index.js.map
