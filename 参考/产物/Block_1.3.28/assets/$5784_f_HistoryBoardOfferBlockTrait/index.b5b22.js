window.__require = function t(e, o, r) {
function i(n, _) {
if (!o[n]) {
if (!e[n]) {
var a = n.split("/");
a = a[a.length - 1];
if (!e[a]) {
var f = "function" == typeof __require && __require;
if (!_ && f) return f(a, !0);
if (s) return s(a, !0);
throw new Error("Cannot find module '" + n + "'");
}
n = a;
}
var l = o[n] = {
exports: {}
};
e[n][0].call(l.exports, function(t) {
return i(e[n][1][t] || t);
}, l, l.exports, t, e, o, r);
}
return o[n].exports;
}
for (var s = "function" == typeof __require && __require, n = 0; n < r.length; n++) i(r[n]);
return i;
}({
$5784_f_HistoryBoardOfferBlockTrait: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "774a2onwvlA74E58Wp06BF+", "$5784_f_HistoryBoardOfferBlockTrait");
var r, i = this && this.__extends || (r = function(t, e) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
r(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), s = this && this.__decorate || function(t, e, o, r) {
var i, s = arguments.length, n = s < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(t, e, o, r); else for (var _ = t.length - 1; _ >= 0; _--) (i = t[_]) && (n = (s < 3 ? i(n) : s > 3 ? i(e, o, n) : i(e, o)) || n);
return s > 3 && n && Object.defineProperty(e, o, n), n;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.$5784_f_HistoryBoardOfferBlockTrait = void 0;
var n = function(t) {
i(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.isLoaded = !1;
e.noUseStringsList = [ hs.OFFER_TYPE_STRINGS[hs.OFFER_TYPE.CLEAR_BOARD], hs.OFFER_TYPE_STRINGS[hs.OFFER_TYPE.HISTORY_CLEAR_BOARD], hs.OFFER_TYPE_STRINGS[hs.OFFER_TYPE.CLASSTERMINATE_CYCLE], hs.OFFER_TYPE_STRINGS[hs.OFFER_TYPE.CHAPTERTERMINATE_CYCLE], hs.OFFER_TYPE_STRINGS[hs.OFFER_TYPE.TERMINATE_REFRESH_SCORE_FIX] ];
return e;
}
e.prototype.onCreate = function() {
this.loadConfig();
};
e.prototype.onActive = function(t) {
if (hs.tpManual.isClassAlgorithmBottomSequenceInfoTriggerAfterOfferAlgo(t)) {
if ((e = hs.OFFER_TYPE_STRINGS[hs.algorithmName.algoExpectedId]) === hs.OFFER_TYPE_STRINGS[hs.OFFER_TYPE.HISTORY_CLEAR_BOARD] || e === hs.OFFER_TYPE_STRINGS[hs.OFFER_TYPE.CLEAR_BOARD]) return;
if (!this.isLoaded) return;
hs.algorithmBottomSequenceInfo.setAlgorithmAfterList([ hs.OFFER_TYPE.ALGO_HISTORY_MORE_CLEAR ]);
}
if (hs.tpManual.isChapterAlgorithmBottomSequenceInfoTriggerBottomOfferAlgo(t)) {
var e;
if ((e = hs.OFFER_TYPE_STRINGS[hs.algorithmName.algoExpectedId]) === hs.OFFER_TYPE_STRINGS[hs.OFFER_TYPE.HISTORY_CLEAR_BOARD] || e === hs.OFFER_TYPE_STRINGS[hs.OFFER_TYPE.CLEAR_BOARD]) return;
if (!this.isLoaded) return;
hs.algorithmBottomSequenceInfo.setAlgorithmBottomList([ hs.OFFER_TYPE.ALGO_HISTORY_MORE_CLEAR ]);
}
if (hs.tpManual.isChapterAlgorithmBottomSequenceInfoOnDisableBottomOfferAlgo(t) || hs.tpManual.isClassAlgorithmBottomSequenceInfoOnDisableAfterAlgo(t)) {
var o = t.args[0];
o && o.callReturnValue && hs.algorithmName.forceSetAlgoExpectedId(hs.OFFER_TYPE.ALGO_HISTORY_MORE_CLEAR);
}
if (hs.tp.isClassAlgorithmProcessInfoBottomOffer(t) || hs.tp.isChapterAlgorithmProcessInfoBottomOffer(t)) {
if (!this.isLoaded) return;
var r = hs.OFFER_TYPE_STRINGS[hs.OFFER_TYPE.CLEAR_BOARD], i = hs.OFFER_TYPE_STRINGS[hs.OFFER_TYPE.HISTORY_CLEAR_BOARD];
if (hs.algorithmName.algoActualName.includes(r) || hs.algorithmName.algoActualName.includes(i)) return;
if (this.noUseStringsList.some(function(t) {
return hs.algorithmName.algoActualName.includes(t);
})) return;
var s = t.args[0] || [];
s.push(hs.OFFER_TYPE.ALGO_HISTORY_MORE_CLEAR);
t.args[0] = s;
}
hs.tp.isAlgorithmLifeCycle_GameInit_ProxyOnGameInitComplete(t) && this.loadConfig();
};
e.prototype.loadConfig = function() {
var t = this;
this.isLoaded || hs.ResLoader.loadByBundle("$5784_f_HistoryBoardOfferBlockTrait", "config/boardBlock", cc.JsonAsset, function(e, o) {
if (e) ; else {
var r = o.json;
hs.PuzzleUtil.setConfig({
historyMoreClearJson: r
});
t.isLoaded = !0;
}
});
};
s([ hs.Algorithm() ], e.prototype, "onActive", null);
return s([ classId("$5784_f_HistoryBoardOfferBlockTrait") ], e);
}(Trait);
o.$5784_f_HistoryBoardOfferBlockTrait = n;
cc._RF.pop();
}, {} ]
}, {}, [ "$5784_f_HistoryBoardOfferBlockTrait" ]);
//# sourceMappingURL=index.js.map
