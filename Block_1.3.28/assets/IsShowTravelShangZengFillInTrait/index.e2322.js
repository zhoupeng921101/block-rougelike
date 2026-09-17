window.__require = function t(r, e, o) {
function i(a, l) {
if (!e[a]) {
if (!r[a]) {
var h = a.split("/");
h = h[h.length - 1];
if (!r[h]) {
var s = "function" == typeof __require && __require;
if (!l && s) return s(h, !0);
if (n) return n(h, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = h;
}
var _ = e[a] = {
exports: {}
};
r[a][0].call(_.exports, function(t) {
return i(r[a][1][t] || t);
}, _, _.exports, t, r, e, o);
}
return e[a].exports;
}
for (var n = "function" == typeof __require && __require, a = 0; a < o.length; a++) i(o[a]);
return i;
}({
IsShowTravelShangZengFillInTrait: [ function(t, r, e) {
"use strict";
cc._RF.push(r, "72f39i1m01AU4MNk/xdssRx", "IsShowTravelShangZengFillInTrait");
var o, i = this && this.__extends || (o = function(t, r) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, r) {
t.__proto__ = r;
} || function(t, r) {
for (var e in r) Object.prototype.hasOwnProperty.call(r, e) && (t[e] = r[e]);
})(t, r);
}, function(t, r) {
o(t, r);
function e() {
this.constructor = t;
}
t.prototype = null === r ? Object.create(r) : (e.prototype = r.prototype, new e());
}), n = this && this.__decorate || function(t, r, e, o) {
var i, n = arguments.length, a = n < 3 ? r : null === o ? o = Object.getOwnPropertyDescriptor(r, e) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, r, e, o); else for (var l = t.length - 1; l >= 0; l--) (i = t[l]) && (a = (n < 3 ? i(a) : n > 3 ? i(r, e, a) : i(r, e)) || a);
return n > 3 && a && Object.defineProperty(r, e, a), a;
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.IsShowTravelShangZengFillInTrait = void 0;
var a = function(t) {
i(r, t);
function r() {
return null !== t && t.apply(this, arguments) || this;
}
r.prototype.onActive = function(t) {
var r, e;
if (hs.tp.isChapterAlgorithmStrategy_Replace_ProxyPreprocessingBlankAlgorithm(t) && Math.random() < (null !== (e = null === (r = this.props) || void 0 === r ? void 0 : r.ratio) && void 0 !== e ? e : .8)) {
var o = hs.algorithmStrategyLogic.replaceAlgorithmType(hs.algorithmStrategyInfo.algorithmList, hs.OFFER_TYPE.TRAVEL_TIAN_KONG_XIAO_CHU, hs.OFFER_TYPE.ALGO_SHENG_ZENG_TRAVEL_FILL);
hs.algorithmStrategyInfo.setAlgorithmList(o);
var i = hs.algorithmStrategyLogic.replaceAlgorithmType(hs.algorithmStrategyInfo.algorithmFailList, hs.OFFER_TYPE.TRAVEL_TIAN_KONG_XIAO_CHU, hs.OFFER_TYPE.ALGO_SHENG_ZENG_TRAVEL_FILL);
hs.algorithmStrategyInfo.setAlgorithmFailList(i);
var n = hs.algorithmStrategyLogic.replaceAlgorithmType(hs.algorithmStrategyInfo.algorithmPriorityList, hs.OFFER_TYPE.TRAVEL_TIAN_KONG_XIAO_CHU, hs.OFFER_TYPE.ALGO_SHENG_ZENG_TRAVEL_FILL);
hs.algorithmStrategyInfo.setAlgorithmPriorityList(n);
}
};
return n([ classId("IsShowTravelShangZengFillInTrait") ], r);
}(Trait);
e.IsShowTravelShangZengFillInTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "IsShowTravelShangZengFillInTrait" ]);
//# sourceMappingURL=index.js.map
