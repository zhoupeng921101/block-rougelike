window.__require = function t(e, r, i) {
function o(n, c) {
if (!r[n]) {
if (!e[n]) {
var h = n.split("/");
h = h[h.length - 1];
if (!e[h]) {
var s = "function" == typeof __require && __require;
if (!c && s) return s(h, !0);
if (a) return a(h, !0);
throw new Error("Cannot find module '" + n + "'");
}
n = h;
}
var u = r[n] = {
exports: {}
};
e[n][0].call(u.exports, function(t) {
return o(e[n][1][t] || t);
}, u, u.exports, t, e, r, i);
}
return r[n].exports;
}
for (var a = "function" == typeof __require && __require, n = 0; n < i.length; n++) o(i[n]);
return o;
}({
EntropyIncreaseBeforeFillWithRoundTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "2d834CBYBxEgq1myUaDjPhh", "EntropyIncreaseBeforeFillWithRoundTrait");
var i, o = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
})(t, e);
}, function(t, e) {
i(t, e);
function r() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
}), a = this && this.__decorate || function(t, e, r, i) {
var o, a = arguments.length, n = a < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, r) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(t, e, r, i); else for (var c = t.length - 1; c >= 0; c--) (o = t[c]) && (n = (a < 3 ? o(n) : a > 3 ? o(e, r, n) : o(e, r)) || n);
return a > 3 && n && Object.defineProperty(e, r, n), n;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.EntropyIncreaseBeforeFillWithRoundTrait = void 0;
var n = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._cacheData = {
weightState: 0,
round: 0
};
return e;
}
e.prototype.onCreate = function() {
this._cacheData = storage.getItem("EntropyIncreaseBeforeFillWithRoundData", this._cacheData);
};
e.prototype.onActive = function(t) {
if (hs.tp.isEntropyIncreaseBeforeFillTraitTriggerLogic(t)) {
t.returnState = !0;
t.replace = !0;
if (3 === this._cacheData.weightState) return;
this._cacheData.round += 1;
if (this._cacheData.round > this.roundLimit) {
this.saveLocalData();
return;
}
hs.binarySupport.getWeightValue(hs.boardInfo.faceBlocks) < this.weightLimit ? 2 === this._cacheData.weightState ? this._cacheData.weightState = 3 : this._cacheData.weightState = 1 : 1 === this._cacheData.weightState && (this._cacheData.weightState = 2);
this.saveLocalData();
if (3 === this._cacheData.weightState) return;
var e = 1 === this._cacheData.weightState ? hs.OFFER_TYPE.SHANG_ZENG_3 : hs.OFFER_TYPE.TIAN_KONG_XIAO_CHU;
hs.algorithmStrategyInfo.setAlgorithmList([ e ]);
hs.algorithmStrategyInfo.setAlgorithmSourceLevel1(hs.ClassAlgorithmSourceType.AlgoTrait);
hs.algorithmStrategyInfo.setAlgorithmSourceLevel2(this.traitName);
}
if (hs.tp.isEntropyIncreaseBeforeFillTraitResetTrait(t)) {
this._cacheData.weightState = 0;
this._cacheData.round = 0;
this.saveLocalData();
}
};
e.prototype.saveLocalData = function() {
hs.storage.setItem("EntropyIncreaseBeforeFillWithRoundData", this._cacheData);
};
Object.defineProperty(e.prototype, "highScoreLimit", {
get: function() {
var t, e;
return null !== (e = null === (t = this.props) || void 0 === t ? void 0 : t.highScoreLimit) && void 0 !== e ? e : 5e4;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "roundLimit", {
get: function() {
var t, e;
return null !== (e = null === (t = this.props) || void 0 === t ? void 0 : t.round) && void 0 !== e ? e : 30;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "weightLimit", {
get: function() {
var t, e;
return null !== (e = null === (t = this.props) || void 0 === t ? void 0 : t.weightLimit) && void 0 !== e ? e : 310;
},
enumerable: !1,
configurable: !0
});
return a([ classId("EntropyIncreaseBeforeFillWithRoundTrait") ], e);
}(Trait);
r.EntropyIncreaseBeforeFillWithRoundTrait = n;
cc._RF.pop();
}, {} ]
}, {}, [ "EntropyIncreaseBeforeFillWithRoundTrait" ]);
//# sourceMappingURL=index.js.map
