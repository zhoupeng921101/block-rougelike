window.__require = function t(e, o, r) {
function i(s, c) {
if (!o[s]) {
if (!e[s]) {
var a = s.split("/");
a = a[a.length - 1];
if (!e[a]) {
var u = "function" == typeof __require && __require;
if (!c && u) return u(a, !0);
if (n) return n(a, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = a;
}
var l = o[s] = {
exports: {}
};
e[s][0].call(l.exports, function(t) {
return i(e[s][1][t] || t);
}, l, l.exports, t, e, o, r);
}
return o[s].exports;
}
for (var n = "function" == typeof __require && __require, s = 0; s < r.length; s++) i(r[s]);
return i;
}({
LowDevice_ReplaceSomeAlgoToRandomNoDieTrait: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "bb49fURjS1MtoIOEMGB6d4b", "LowDevice_ReplaceSomeAlgoToRandomNoDieTrait");
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
}), n = this && this.__decorate || function(t, e, o, r) {
var i, n = arguments.length, s = n < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, o, r); else for (var c = t.length - 1; c >= 0; c--) (i = t[c]) && (s = (n < 3 ? i(s) : n > 3 ? i(e, o, s) : i(e, o)) || s);
return n > 3 && s && Object.defineProperty(e, o, s), s;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.LowDevice_ReplaceSomeAlgoToRandomNoDieTrait = void 0;
var s = [ 4, 11, 1003, 1004, 1e3, 2, 10, 9, 14019 ], c = function(t) {
i(e, t);
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
e.prototype._isHighCostAlgorithm = function(t) {
return s.includes(t);
};
e.prototype._checkAndReplaceToRandomNoDie = function(t) {
if (this._currentRoundTimeout) {
t.args[0];
t.args[0] = hs.OFFER_TYPE.SUI_JI_WU_SI;
}
};
e.prototype._limitOverTime = function(t) {
var e = t.args[0], o = t.args[1];
if (this._isHighCostAlgorithm(o)) {
var r = this._getOutTime();
if (e.overTime > r) {
e.overTime = r;
t.args[0] = e;
}
}
};
e.prototype._checkTimeout = function() {
var t = hs.algorithmName.algoActualId, e = Date.now() - this._sdkCallStartTime, o = this._getOutTime();
this._isHighCostAlgorithm(t) && e > o && (this._currentRoundTimeout = !0);
};
n([ hs.Algorithm() ], e.prototype, "onActive", null);
return n([ classId("LowDevice_ReplaceSomeAlgoToRandomNoDieTrait") ], e);
}(Trait);
o.LowDevice_ReplaceSomeAlgoToRandomNoDieTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "LowDevice_ReplaceSomeAlgoToRandomNoDieTrait" ]);
//# sourceMappingURL=index.js.map
