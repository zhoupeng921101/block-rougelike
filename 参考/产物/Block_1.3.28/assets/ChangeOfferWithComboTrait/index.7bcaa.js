window.__require = function t(e, o, a) {
function r(h, s) {
if (!o[h]) {
if (!e[h]) {
var n = h.split("/");
n = n[n.length - 1];
if (!e[n]) {
var c = "function" == typeof __require && __require;
if (!s && c) return c(n, !0);
if (i) return i(n, !0);
throw new Error("Cannot find module '" + h + "'");
}
h = n;
}
var g = o[h] = {
exports: {}
};
e[h][0].call(g.exports, function(t) {
return r(e[h][1][t] || t);
}, g, g.exports, t, e, o, a);
}
return o[h].exports;
}
for (var i = "function" == typeof __require && __require, h = 0; h < a.length; h++) r(a[h]);
return r;
}({
ChangeOfferWithComboTrait: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "474236jjx1E57gLoG32UvtN", "ChangeOfferWithComboTrait");
var a, r = this && this.__extends || (a = function(t, e) {
return (a = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
a(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), i = this && this.__decorate || function(t, e, o, a) {
var r, i = arguments.length, h = i < 3 ? e : null === a ? a = Object.getOwnPropertyDescriptor(e, o) : a;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) h = Reflect.decorate(t, e, o, a); else for (var s = t.length - 1; s >= 0; s--) (r = t[s]) && (h = (i < 3 ? r(h) : i > 3 ? r(e, o, h) : r(e, o)) || h);
return i > 3 && h && Object.defineProperty(e, o, h), h;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.ChangeOfferWithComboTrait = void 0;
var h = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._cacheData = {
combo30Shangzeng3Num: 2,
comboTouchNum: 0
};
return e;
}
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassAlgorithmStrategy_Deal_Proxy",
methodName: "postPreprocessing"
}, {
className: "ClassBlocksProducer_Proxy",
methodName: "onTouchEnd"
} ];
};
e.prototype.onCreate = function() {
this._cacheData = storage.getItem("ChangeOfferWithComboTraitKey", this._cacheData);
};
e.prototype.onActive = function(t) {
hs.tp.isClassAlgorithmLifeCycle_GameStart_ProxyNewGameInit(t) && this.resetCacheData();
if (hs.tp.isClassAlgorithmStrategy_Deal_ProxyPostPreprocessing(t)) if ((e = this._cacheData.comboTouchNum) <= 10) this.resetCombo30Shangzeng3Num(); else if (e > 30 && this._cacheData.combo30Shangzeng3Num > 0) {
hs.algorithmStrategyInfo.algorithmList.unshift(hs.OFFER_TYPE.SHANG_ZENG_3);
this._cacheData.combo30Shangzeng3Num--;
this.saveCacheData();
}
if (hs.tp.isClassAlgorithmStrategy_Replace_ProxyPreprocessingBlankAlgorithm(t)) {
var e;
if ((e = this._cacheData.comboTouchNum) <= 10) this.resetCombo30Shangzeng3Num(); else if (e > 10 && e <= 20) {
if (-1 != hs.algorithmStrategyInfo.algorithmList.indexOf(hs.OFFER_TYPE.TIAN_KONG_XIAO_CHU)) {
var o = hs.algorithmStrategyLogic.replaceAlgorithmType(hs.algorithmStrategyInfo.algorithmList, hs.OFFER_TYPE.TIAN_KONG_XIAO_CHU, hs.OFFER_TYPE.ALL_COMBINATION_ID70);
hs.algorithmStrategyInfo.setAlgorithmList(o);
t.returnState = !0;
}
} else if (e > 20 && e <= 30) {
var a = !1;
if (-1 != hs.algorithmStrategyInfo.algorithmList.indexOf(hs.OFFER_TYPE.TIAN_KONG_XIAO_CHU)) {
o = hs.algorithmStrategyLogic.replaceAlgorithmType(hs.algorithmStrategyInfo.algorithmList, hs.OFFER_TYPE.TIAN_KONG_XIAO_CHU, hs.OFFER_TYPE.SUI_JI_WU_SI);
hs.algorithmStrategyInfo.setAlgorithmList(o);
a = !0;
}
if (-1 != hs.algorithmStrategyInfo.algorithmList.indexOf(hs.OFFER_TYPE.ALL_COMBINATION_ID70)) {
o = hs.algorithmStrategyLogic.replaceAlgorithmType(hs.algorithmStrategyInfo.algorithmList, hs.OFFER_TYPE.ALL_COMBINATION_ID70, hs.OFFER_TYPE.SUI_JI_WU_SI);
hs.algorithmStrategyInfo.setAlgorithmList(o);
a = !0;
}
a && (t.returnState = !0);
}
}
if (hs.tp.isClassBlocksProducer_ProxyOnTouchEnd(t)) {
var r = t.args[0].state, i = r.eliminateCount, h = r.continuousEliminateTimes;
if (i > 0 && h > 1) {
this._cacheData.comboTouchNum = h - 1;
this.saveCacheData();
} else if (0 === h || 1 === h) {
this._cacheData.comboTouchNum = 0;
this.saveCacheData();
}
}
};
e.prototype.resetCombo30Shangzeng3Num = function() {
if (2 != this._cacheData.combo30Shangzeng3Num) {
this._cacheData.combo30Shangzeng3Num = 2;
this.saveCacheData();
}
};
e.prototype.resetCacheData = function() {
this._cacheData.combo30Shangzeng3Num = 2;
this._cacheData.comboTouchNum = 0;
this.saveCacheData();
};
e.prototype.saveCacheData = function() {
storage.setItem("ChangeOfferWithComboTraitKey", this._cacheData);
};
i([ hs.Algorithm() ], e.prototype, "onActive", null);
return i([ classId("ChangeOfferWithComboTrait") ], e);
}(Trait);
o.ChangeOfferWithComboTrait = h;
cc._RF.pop();
}, {} ]
}, {}, [ "ChangeOfferWithComboTrait" ]);
//# sourceMappingURL=index.js.map
