window.__require = function e(t, o, r) {
function i(a, s) {
if (!o[a]) {
if (!t[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!t[c]) {
var l = "function" == typeof __require && __require;
if (!s && l) return l(c, !0);
if (n) return n(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var u = o[a] = {
exports: {}
};
t[a][0].call(u.exports, function(e) {
return i(t[a][1][e] || e);
}, u, u.exports, e, t, o, r);
}
return o[a].exports;
}
for (var n = "function" == typeof __require && __require, a = 0; a < r.length; a++) i(r[a]);
return i;
}({
IsOpenReplaceToRandomNoDieByTimeOutTrait: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "0480dLpRt5BdZUUleTy55NK", "IsOpenReplaceToRandomNoDieByTimeOutTrait");
var r, i = this && this.__extends || (r = function(e, t) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
})(e, t);
}, function(e, t) {
r(e, t);
function o() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
}), n = this && this.__decorate || function(e, t, o, r) {
var i, n = arguments.length, a = n < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, o, r); else for (var s = e.length - 1; s >= 0; s--) (i = e[s]) && (a = (n < 3 ? i(a) : n > 3 ? i(t, o, a) : i(t, o)) || a);
return n > 3 && a && Object.defineProperty(t, o, a), a;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.IsOpenReplaceToRandomNoDieByTimeOutTrait = void 0;
var a = "isOpenReplaceToRandomNoDie_timeoutAlgos", s = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._sdkCallStartTime = 0;
return t;
}
t.prototype.onActive = function(e) {
if (hs.gameInfo.gameMode == hs.GameMode.Class) {
hs.tp.isClassAlgorithmLifeCycle_GameStart_ProxyOnGameStart(e) && this._onGameStart(e);
hs.tp.isAlgorithmProcessInfoAlgorithmSdkCall(e) && this._checkAndReplaceTimeoutAlgorithm(e);
hs.tp.isAlgorithmProcessInfoChangeResult(e) && this._recordTimeoutAlgorithm(e);
}
};
t.prototype._onGameStart = function(e) {
e.args[0].data.newGame && hs.storage.setItem(a, []);
};
t.prototype._recordTimeoutAlgorithm = function() {
if (Date.now() - this._sdkCallStartTime >= this._getTimeoutThreshold()) {
var e = hs.algorithmName.algoActualId, t = hs.storage.getItem(a, []);
if (!t.includes(e)) {
t.push(e);
hs.storage.setItem(a, t);
}
}
};
t.prototype._checkAndReplaceTimeoutAlgorithm = function(e) {
var t = e.args[0];
this._sdkCallStartTime = Date.now();
hs.storage.getItem(a, []).includes(t) && (e.args[0] = hs.OFFER_TYPE.IOS_SUI_JI_WU_SI);
};
t.prototype._getTimeoutThreshold = function() {
var e;
return (null === (e = this.props) || void 0 === e ? void 0 : e.timeOut) || 100;
};
return n([ classId("IsOpenReplaceToRandomNoDieByTimeOutTrait") ], t);
}(Trait);
o.IsOpenReplaceToRandomNoDieByTimeOutTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "IsOpenReplaceToRandomNoDieByTimeOutTrait" ]);
//# sourceMappingURL=index.js.map
