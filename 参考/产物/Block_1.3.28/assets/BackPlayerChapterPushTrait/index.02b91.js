window.__require = function t(e, r, a) {
function s(o, h) {
if (!r[o]) {
if (!e[o]) {
var n = o.split("/");
n = n[n.length - 1];
if (!e[n]) {
var u = "function" == typeof __require && __require;
if (!h && u) return u(n, !0);
if (i) return i(n, !0);
throw new Error("Cannot find module '" + o + "'");
}
o = n;
}
var c = r[o] = {
exports: {}
};
e[o][0].call(c.exports, function(t) {
return s(e[o][1][t] || t);
}, c, c.exports, t, e, r, a);
}
return r[o].exports;
}
for (var i = "function" == typeof __require && __require, o = 0; o < a.length; o++) s(a[o]);
return s;
}({
BackPlayerChapterPushTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "2b8efombLlBk46E9EULRVK7", "BackPlayerChapterPushTrait");
var a, s = this && this.__extends || (a = function(t, e) {
return (a = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
})(t, e);
}, function(t, e) {
a(t, e);
function r() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
}), i = this && this.__decorate || function(t, e, r, a) {
var s, i = arguments.length, o = i < 3 ? e : null === a ? a = Object.getOwnPropertyDescriptor(e, r) : a;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) o = Reflect.decorate(t, e, r, a); else for (var h = t.length - 1; h >= 0; h--) (s = t[h]) && (o = (i < 3 ? s(o) : i > 3 ? s(e, r, o) : s(e, r)) || o);
return i > 3 && o && Object.defineProperty(e, r, o), o;
}, o = this && this.__values || function(t) {
var e = "function" == typeof Symbol && Symbol.iterator, r = e && t[e], a = 0;
if (r) return r.call(t);
if (t && "number" == typeof t.length) return {
next: function() {
t && a >= t.length && (t = void 0);
return {
value: t && t[a++],
done: !t
};
}
};
throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, h = this && this.__read || function(t, e) {
var r = "function" == typeof Symbol && t[Symbol.iterator];
if (!r) return t;
var a, s, i = r.call(t), o = [];
try {
for (;(void 0 === e || e-- > 0) && !(a = i.next()).done; ) o.push(a.value);
} catch (t) {
s = {
error: t
};
} finally {
try {
a && !a.done && (r = i.return) && r.call(i);
} finally {
if (s) throw s.error;
}
}
return o;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.BackPlayerChapterPushTrait = void 0;
var n = function(t) {
s(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._backPlayerChapterPushData = null;
e._bFirstChapterTouch = !0;
e._chapterConditionWay = 0;
e._isEnterFromPush = !1;
e._hasCheckEnterFromPush = !1;
e._isPushValid = !0;
return e;
}
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ChapterBlocksProducer_Proxy",
methodName: "onTouchEnd"
}, {
className: "ChapterGame_Replay_Proxy",
methodName: "onGameReplay"
}, {
className: "ChapterGameOver_GameEnd_Proxy",
methodName: "onGameOver"
} ];
};
e.prototype.onCreate = function() {};
e.prototype.onActive = function(t) {
if (hs.tp.isLaunchChangeLaunchScene(t)) {
this._isPushValid = this.isPushValid();
if (!this._isPushValid) return;
if (this.isEnterFromPush) {
t.args[0] = "chapter";
t.returnState = !0;
} else this.canTriggerPush() && this.tryPush();
}
if (hs.tp.isCollectionProducer_ProxyOnOpenChapterView(t)) {
if (!this._isPushValid) return;
var e = storage.getItem("chapterNum", 0);
this._chapterConditionWay = hs.chapterConfigInfo.chapterDatasCfg[e].Condition.Way;
if (!this.isEnterFromPush) return;
if (0 == this._chapterConditionWay) return;
if (this.backPlayerChapterPushData.collectReduceNum > 0) return;
if (storage.getItem("eightHoursTravelReduceGameNum", -1) === hs.gameInfo.gameNum) return;
this.reductionTarget();
}
if (hs.tp.isChapterBlocksProducer_ProxyOnTouchEnd(t)) {
if (!this._isPushValid) return;
this.backPlayerChapterPushData.lastPutBlockTime = hs.getCurentDate().getTime() / 1e3;
this.saveBackPlayerChapterPushData();
if (this._bFirstChapterTouch) {
this._bFirstChapterTouch = !1;
this.tryCancelPush();
}
}
if (hs.tp.isChapterAlgorithmStrategy_Deal_ProxyPostPreprocessing(t)) {
if (!this._isPushValid) return;
if (this.isEnterFromPush && 0 == this._chapterConditionWay) {
hs.algorithmStrategyInfo.setAlgorithmList([ hs.OFFER_TYPE.ALL_COMBINATION_ID70, hs.OFFER_TYPE.ALL_COMBINATION_ID9 ]);
t.returnState = !0;
}
}
if (hs.tp.isChapterGameOver_GameEnd_ProxyOnGameOver(t) || hs.tp.isChapterGame_Replay_ProxyOnGameReplay(t)) {
if (!this._isPushValid) return;
var r = hs.chapterGameInfo.tryTimes, a = (e = hs.chapterGameInfo.chapterNum, hs.chapterGameInfo.stage);
this.backPlayerChapterPushData.failCount = 1 === a && 0 === e ? r - 1 : r;
this.backPlayerChapterPushData.collectReduceNum = 0;
this.saveBackPlayerChapterPushData();
this._isEnterFromPush = !1;
}
};
e.prototype.reductionTarget = function() {
var t, e, r = storage.getItem("chapterNum", 0);
if (0 == this._chapterConditionWay) ; else {
var a = hs.chapterConfigInfo.chapterDatasCfg[r].Condition.RequiredCollections, s = hs.chapterCollectInfo.collectTotalCollectItems, i = hs.chapterCollectInfo.collectRemainCollectItems, h = [], n = 0;
try {
for (var u = o(a), c = u.next(); !c.done; c = u.next()) {
var p = c.value, l = s[p.Key], P = Math.ceil(l * this.props.reducePercent), f = Math.ceil(.1 * l), y = i[p.Key], m = Math.min(y, Math.max(y - P, f));
h.push(y - m);
n += y - m;
i[p.Key] = m;
}
} catch (e) {
t = {
error: e
};
} finally {
try {
c && !c.done && (e = u.return) && e.call(u);
} finally {
if (t) throw t.error;
}
}
storage.setItem("chapterCollectRemainCollectItems", i);
this.backPlayerChapterPushData.collectReduceNum = n;
this.saveBackPlayerChapterPushData();
}
};
e.prototype.isPushValid = function() {
return hs.NativeSudokuIPAUtils.checkAppFuncSupport(hs.E_APP_FUNC_VERSION.NOTICE_PUSH_VERSION);
};
Object.defineProperty(e.prototype, "isEnterFromPush", {
get: function() {
var t, e, r = this;
if (this._hasCheckEnterFromPush) return this._isEnterFromPush;
var a = !1, s = hs.NativeAppCenterInterface.noticeAppGetOpenAppOpeway();
(null === (t = null == s ? void 0 : s.click) || void 0 === t ? void 0 : t.length) > 0 ? s.click === this.props.opewaynum && (a = !0) : (null === (e = null == s ? void 0 : s.show) || void 0 === e ? void 0 : e.length) > 0 && s.show.some(function(t) {
return t.opewaynum === r.props.opewaynum;
}) && (a = !0);
this._isEnterFromPush = a;
this._hasCheckEnterFromPush = !0;
return this._isEnterFromPush;
},
enumerable: !1,
configurable: !0
});
e.prototype.canTriggerPush = function() {
var t = hs.getCurentDate().getTime() / 1e3;
return !(this.backPlayerChapterPushData.lastPushTime + 259200 > t) && (this.backPlayerChapterPushData.failCount >= this.props.failCount && this.backPlayerChapterPushData.lastPutBlockTime + this.props.pushDelay < t);
};
e.prototype.tryPush = function() {
hs.NativeAppCenterInterface.noticeAppCommonSendPush({
opewaynum: this.props.opewaynum,
taskType: this.props.taskType,
sendTime: this.getPushTimeMs(this.props.sendTime)
});
this.backPlayerChapterPushData.lastPushTime = hs.getCurentDate().getTime() / 1e3;
this.saveBackPlayerChapterPushData();
this.doDotPush(!0);
};
e.prototype.tryCancelPush = function() {
hs.NativeAppCenterInterface.noticeAppCommonRemovePush();
this.backPlayerChapterPushData.lastPushTime = 0;
this.saveBackPlayerChapterPushData();
this.doDotPush(!1);
};
e.prototype.doDotPush = function(t) {
DS("usr_data_push_gq_return", {
gq_return_send: t ? "0" : "1"
});
};
e.prototype.getPushTimeMs = function(t) {
var e = h(t.split(":").map(Number), 3), r = e[0], a = e[1];
e[2];
(isNaN(r) || r > 24 || r < 0) && (r = 0);
(isNaN(a) || a > 60 || a < 0) && (a = 0);
var s = new Date();
s.setHours(r, a, 0, 0);
return Math.floor(s.getTime());
};
Object.defineProperty(e.prototype, "backPlayerChapterPushData", {
get: function() {
null === this._backPlayerChapterPushData && (this._backPlayerChapterPushData = storage.getItem("backPlayerChapterPushData", {
chapterNum: 0,
failCount: 0,
lastPutBlockTime: 0,
lastPushTime: 0,
collectReduceNum: 0,
__gmPushState: !1
}));
return this._backPlayerChapterPushData;
},
enumerable: !1,
configurable: !0
});
e.prototype.saveBackPlayerChapterPushData = function() {
storage.setItem("backPlayerChapterPushData", this.backPlayerChapterPushData);
};
return i([ classId("BackPlayerChapterPushTrait") ], e);
}(Trait);
r.BackPlayerChapterPushTrait = n;
cc._RF.pop();
}, {} ]
}, {}, [ "BackPlayerChapterPushTrait" ]);
//# sourceMappingURL=index.js.map
