window.__require = function t(e, r, s) {
function o(n, a) {
if (!r[n]) {
if (!e[n]) {
var h = n.split("/");
h = h[h.length - 1];
if (!e[h]) {
var u = "function" == typeof __require && __require;
if (!a && u) return u(h, !0);
if (i) return i(h, !0);
throw new Error("Cannot find module '" + n + "'");
}
n = h;
}
var c = r[n] = {
exports: {}
};
e[n][0].call(c.exports, function(t) {
return o(e[n][1][t] || t);
}, c, c.exports, t, e, r, s);
}
return r[n].exports;
}
for (var i = "function" == typeof __require && __require, n = 0; n < s.length; n++) o(s[n]);
return o;
}({
PreLostUserPushTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "e3dd6T8CudB77FNxfUV5c3d", "PreLostUserPushTrait");
var s, o = this && this.__extends || (s = function(t, e) {
return (s = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
})(t, e);
}, function(t, e) {
s(t, e);
function r() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
}), i = this && this.__decorate || function(t, e, r, s) {
var o, i = arguments.length, n = i < 3 ? e : null === s ? s = Object.getOwnPropertyDescriptor(e, r) : s;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(t, e, r, s); else for (var a = t.length - 1; a >= 0; a--) (o = t[a]) && (n = (i < 3 ? o(n) : i > 3 ? o(e, r, n) : o(e, r)) || n);
return i > 3 && n && Object.defineProperty(e, r, n), n;
}, n = this && this.__read || function(t, e) {
var r = "function" == typeof Symbol && t[Symbol.iterator];
if (!r) return t;
var s, o, i = r.call(t), n = [];
try {
for (;(void 0 === e || e-- > 0) && !(s = i.next()).done; ) n.push(s.value);
} catch (t) {
o = {
error: t
};
} finally {
try {
s && !s.done && (r = i.return) && r.call(i);
} finally {
if (o) throw o.error;
}
}
return n;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.PreLostUserPushTrait = void 0;
var a = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._hasCheckedEnterFromPush = !1;
e._isEnterFromPush = !1;
e.algoStopTime = 0;
e._isEnterFromPushResetBlock = !1;
e._isNewGame = !1;
e._preLostUserPushData = null;
return e;
}
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassGame_Proxy",
methodName: "onClassGameShow"
}, {
className: "ClassGame_Proxy",
methodName: "newGameInit"
} ];
};
e.prototype.onCreate = function() {};
e.prototype.onActive = function(t) {
if (hs.tp.isLaunchChangeLaunchScene(t)) {
if (this.isEnterFromPush) {
t.args[0] = "class";
t.returnState = !0;
}
this.tryPush();
}
if (hs.tp.isClassGame_ProxyOnClassGameShow(t) && this.isEnterFromPush && !this._isNewGame && !this._isEnterFromPushResetBlock) {
this._isEnterFromPushResetBlock = !0;
storage.setItem("classFaceBlocks", hs.boardInfo.NULL);
storage.setItem("classProducerBlocks", [ -1, -1, -1 ]);
}
if (hs.tp.isClassGame_ProxyNewGameInit(t)) {
this._isNewGame = !0;
this.isEnterFromPush && this._isEnterFromPushResetBlock && (this._isEnterFromPush = !1);
}
if (hs.tp.isClassDefaultBoard_ProxyProduceDefaultBoard(t) && this.isEnterFromPush && !this._isEnterFromPushResetBlock) {
this._isEnterFromPushResetBlock = !0;
this._isNewGame = !0;
t.args[0] = hs.boardInfo.NULL;
t.returnState = !0;
}
if (hs.tp.isClassAlgorithmStrategy_Priority_ProxyOnAlgorithmStrategyPriority(t)) {
if (!this.isEnterFromPush) return;
var e = this.currentGameTimeInSeconds;
if (e < 0 || e >= this.algoStopTime) return;
this.triggerAlgorithmPriority(e);
t.returnState = !0;
}
hs.tp.isAlgorithmStrategyLogicNeedCheckSameBlock(t) && hs.algorithmName.algoActualId == hs.OFFER_TYPE.ALGO_RANDOM_CLEAR_COMBINATION && (t.returnValue = !1);
if (hs.tp.isFirstEightGamesFixedBoardTraitShouldUseFixedBoard(t) && this.isEnterFromPush) {
t.returnValue = !1;
t.returnState = !0;
}
};
Object.defineProperty(e.prototype, "currentGameTimeInSeconds", {
get: function() {
return (Date.now() - hs.classTimerInfo.timeSinceGameReady) / 1e3;
},
enumerable: !1,
configurable: !0
});
e.prototype.triggerAlgorithmPriority = function() {
hs.algorithmStrategyInfo.algorithmPriorityList.unshift(hs.OFFER_TYPE.ALGO_RANDOM_CLEAR_COMBINATION);
};
Object.defineProperty(e.prototype, "isEnterFromPush", {
get: function() {
var t, e;
if (hs.classGuideInfo.step <= 2) return !1;
if (this._hasCheckedEnterFromPush) return this._isEnterFromPush;
this._hasCheckedEnterFromPush = !0;
var r = !1, s = hs.NativeAppCenterInterface.noticeAppGetOpenAppOpeway(), o = this.props.openwaynum;
(null === (t = null == s ? void 0 : s.click) || void 0 === t ? void 0 : t.length) > 0 ? o === s.click && (r = !0) : (null === (e = null == s ? void 0 : s.show) || void 0 === e ? void 0 : e.length) > 0 && s.show.some(function(t) {
return t.opewaynum === o;
}) && (r = !0);
this.algoStopTime = 30 + 30 * Math.random();
this._isEnterFromPush = r;
return this._isEnterFromPush;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "preLostUserPushData", {
get: function() {
this._preLostUserPushData || (this._preLostUserPushData = storage.getItem("PreLostUserPushTraitData", {
lastPushTime: 0,
hasTouch: !1,
hasCanceled: !1,
__gmPushState: !1
}));
return this._preLostUserPushData;
},
enumerable: !1,
configurable: !0
});
e.prototype.savePreLostUserPushData = function() {
storage.setItem("PreLostUserPushTraitData", this.preLostUserPushData);
};
e.prototype.tryPush = function() {
if (hs.classGuideInfo.step <= 2) ; else if (hs.isToday(this.preLostUserPushData.lastPushTime)) ; else {
this.preLostUserPushData.lastPushTime = Date.now();
this.savePreLostUserPushData();
hs.NativeAppCenterInterface.noticeAppCommonSendPush({
opewaynum: this.props.openwaynum,
taskType: this.props.taskType,
sendTime: this.getPushTimeMs(this.props.pushTime) + 864e5
});
this.dot(!0);
}
};
e.prototype.tryCancelPush = function() {
hs.NativeAppCenterInterface.noticeAppCommonRemovePush();
this.dot(!1);
};
e.prototype.dot = function(t) {
DS("usr_data_push_yls_all_clear", {
yls_all_clear_send: t ? "0" : "1"
});
};
e.prototype.getPushTimeMs = function(t) {
var e = n(t.split(":").map(Number), 3), r = e[0], s = e[1];
e[2];
(isNaN(r) || r > 24 || r < 0) && (r = 0);
(isNaN(s) || s > 60 || s < 0) && (s = 0);
var o = new Date();
o.setHours(r, s, 0, 0);
return Math.floor(o.getTime());
};
return i([ classId("PreLostUserPushTrait") ], e);
}(Trait);
r.PreLostUserPushTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "PreLostUserPushTrait" ]);
//# sourceMappingURL=index.js.map
