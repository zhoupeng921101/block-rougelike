window.__require = function e(t, r, i) {
function a(n, c) {
if (!r[n]) {
if (!t[n]) {
var s = n.split("/");
s = s[s.length - 1];
if (!t[s]) {
var h = "function" == typeof __require && __require;
if (!c && h) return h(s, !0);
if (o) return o(s, !0);
throw new Error("Cannot find module '" + n + "'");
}
n = s;
}
var l = r[n] = {
exports: {}
};
t[n][0].call(l.exports, function(e) {
return a(t[n][1][e] || e);
}, l, l.exports, e, t, r, i);
}
return r[n].exports;
}
for (var o = "function" == typeof __require && __require, n = 0; n < i.length; n++) a(i[n]);
return a;
}({
EntropyIncreaseBeforeFillReduceTimeTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "59570RbCMFM+5I1Zs5kwhaD", "EntropyIncreaseBeforeFillReduceTimeTrait");
var i, a = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
i(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), o = this && this.__decorate || function(e, t, r, i) {
var a, o = arguments.length, n = o < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(e, t, r, i); else for (var c = e.length - 1; c >= 0; c--) (a = e[c]) && (n = (o < 3 ? a(n) : o > 3 ? a(t, r, n) : a(t, r)) || n);
return o > 3 && n && Object.defineProperty(t, r, n), n;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.EntropyIncreaseBeforeFillReduceTimeTrait = void 0;
var n = function(e) {
a(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._cacheData = {
weightState: 0
};
return t;
}
t.prototype.onCreate = function() {
this._cacheData = storage.getItem("EntropyIncreaseBeforeFillReduceTimeData", this._cacheData);
};
t.prototype.onActive = function(e) {
if (hs.tp.isEntropyIncreaseBeforeFillTraitTriggerLogic(e)) {
e.returnState = !0;
e.replace = !0;
if (3 === this._cacheData.weightState) return;
if (hs.classScoreInfo.highScore > this.highScoreLimit) return;
var t = Date.now(), r = storage.getItem("entropyIncreaseBeforeFill", {
state: 0,
startTime: 0
}), i = r.state, a = r.startTime;
if ((t - a) / 1e3 > this.timeLimit) {
storage.setItem("entropyIncreaseBeforeFill", {
state: i,
startTime: a
});
return;
}
hs.binarySupport.getWeightValue(hs.boardInfo.faceBlocks) < this.weightLimit ? 2 === this._cacheData.weightState ? this._cacheData.weightState = 3 : this._cacheData.weightState = 1 : 1 === this._cacheData.weightState && (this._cacheData.weightState = 2);
this.saveLocalData();
if (3 === this._cacheData.weightState) return;
var o = 1 === this._cacheData.weightState ? hs.OFFER_TYPE.SHANG_ZENG_3 : hs.OFFER_TYPE.TIAN_KONG_XIAO_CHU;
hs.algorithmStrategyInfo.setAlgorithmList([ o ]);
hs.algorithmStrategyInfo.setAlgorithmSourceLevel1(hs.ClassAlgorithmSourceType.AlgoTrait);
hs.algorithmStrategyInfo.setAlgorithmSourceLevel2(this.traitName);
}
if (hs.tp.isEntropyIncreaseBeforeFillTraitResetTrait(e)) {
this._cacheData.weightState = 0;
this.saveLocalData();
}
};
t.prototype.saveLocalData = function() {
hs.storage.setItem("EntropyIncreaseBeforeFillReduceTimeData", this._cacheData);
};
Object.defineProperty(t.prototype, "highScoreLimit", {
get: function() {
var e;
return null !== (e = this.props.highScoreLimit) && void 0 !== e ? e : 5e4;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "timeLimit", {
get: function() {
var e;
return null !== (e = this.props.time) && void 0 !== e ? e : 90;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "weightLimit", {
get: function() {
var e;
return null !== (e = this.props.weightLimit) && void 0 !== e ? e : 310;
},
enumerable: !1,
configurable: !0
});
return o([ classId("EntropyIncreaseBeforeFillReduceTimeTrait") ], t);
}(Trait);
r.EntropyIncreaseBeforeFillReduceTimeTrait = n;
cc._RF.pop();
}, {} ]
}, {}, [ "EntropyIncreaseBeforeFillReduceTimeTrait" ]);
//# sourceMappingURL=index.js.map
