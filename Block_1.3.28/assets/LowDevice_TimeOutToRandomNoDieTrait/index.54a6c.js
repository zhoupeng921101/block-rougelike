window.__require = function t(e, o, i) {
function r(u, s) {
if (!o[u]) {
if (!e[u]) {
var a = u.split("/");
a = a[a.length - 1];
if (!e[a]) {
var c = "function" == typeof __require && __require;
if (!s && c) return c(a, !0);
if (n) return n(a, !0);
throw new Error("Cannot find module '" + u + "'");
}
u = a;
}
var l = o[u] = {
exports: {}
};
e[u][0].call(l.exports, function(t) {
return r(e[u][1][t] || t);
}, l, l.exports, t, e, o, i);
}
return o[u].exports;
}
for (var n = "function" == typeof __require && __require, u = 0; u < i.length; u++) r(i[u]);
return r;
}({
LowDevice_TimeOutToRandomNoDieTrait: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "5a357VACUlEF51wJktA9rIK", "LowDevice_TimeOutToRandomNoDieTrait");
var i, r = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
i(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), n = this && this.__decorate || function(t, e, o, i) {
var r, n = arguments.length, u = n < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, o) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) u = Reflect.decorate(t, e, o, i); else for (var s = t.length - 1; s >= 0; s--) (r = t[s]) && (u = (n < 3 ? r(u) : n > 3 ? r(e, o, u) : r(e, o)) || u);
return n > 3 && u && Object.defineProperty(e, o, u), u;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.LowDevice_TimeOutToRandomNoDieTrait = void 0;
var u = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._currentRoundTimeout = !1;
e._sdkCallStartTime = 0;
return e;
}
e.prototype.onActive = function(t) {
if (hs.gameInfo.gameMode == hs.GameMode.Class) {
hs.tp.isClassAlgorithmStrategy_Run_ProxyOnTriggerStrategyRun(t) && this._resetTimeoutStatus();
if (hs.tp.isAlgorithmProcessInfoAlgorithmSdkCall(t)) {
this._sdkCallStartTime = Date.now();
this._checkAndReplaceToRandomNoDie(t);
}
hs.tp.isAlgorithmProcessInfoHandleArgs(t) && this._limitOverTime(t);
hs.tp.isAlgorithmProcessInfoChangeResult(t) && this._checkTimeout(t);
}
};
e.prototype._resetTimeoutStatus = function() {
this._currentRoundTimeout = !1;
};
e.prototype._getOutTime = function() {
var t;
return (null === (t = this.props) || void 0 === t ? void 0 : t.outTime) || 100;
};
e.prototype._isNonDifficultAlgorithm = function(t) {
hs.algorithmInfo.getOfferTypeCategory(t);
return !hs.isValueInEnum(t, hs.OFFER_TYPE_DIFFICULTY) && !hs.isValueInEnum(t, hs.OFFER_TYPE_DIE);
};
e.prototype._checkAndReplaceToRandomNoDie = function(t) {
if (this._currentRoundTimeout) {
t.args[0];
t.args[0] = hs.OFFER_TYPE.SUI_JI_WU_SI;
}
};
e.prototype._limitOverTime = function(t) {
var e = t.args[0], o = t.args[1];
if (this._isNonDifficultAlgorithm(o)) {
var i = this._getOutTime();
if (e.overTime > i) {
e.overTime = i;
t.args[0] = e;
}
}
};
e.prototype._checkTimeout = function() {
var t = hs.algorithmName.algoActualId, e = Date.now() - this._sdkCallStartTime, o = this._getOutTime();
this._isNonDifficultAlgorithm(t) && e > o && (this._currentRoundTimeout = !0);
};
n([ hs.Algorithm() ], e.prototype, "onActive", null);
return n([ classId("LowDevice_TimeOutToRandomNoDieTrait") ], e);
}(Trait);
o.LowDevice_TimeOutToRandomNoDieTrait = u;
cc._RF.pop();
}, {} ]
}, {}, [ "LowDevice_TimeOutToRandomNoDieTrait" ]);
//# sourceMappingURL=index.js.map
