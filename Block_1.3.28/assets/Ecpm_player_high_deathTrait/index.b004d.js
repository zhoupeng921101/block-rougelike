window.__require = function e(t, a, r) {
function o(l, s) {
if (!a[l]) {
if (!t[l]) {
var h = l.split("/");
h = h[h.length - 1];
if (!t[h]) {
var n = "function" == typeof __require && __require;
if (!s && n) return n(h, !0);
if (i) return i(h, !0);
throw new Error("Cannot find module '" + l + "'");
}
l = h;
}
var u = a[l] = {
exports: {}
};
t[l][0].call(u.exports, function(e) {
return o(t[l][1][e] || e);
}, u, u.exports, e, t, a, r);
}
return a[l].exports;
}
for (var i = "function" == typeof __require && __require, l = 0; l < r.length; l++) o(r[l]);
return o;
}({
Ecpm_player_high_deathTrait: [ function(e, t, a) {
"use strict";
cc._RF.push(t, "9d0e9AvVPlKwaqLpTpludvN", "Ecpm_player_high_deathTrait");
var r, o = this && this.__extends || (r = function(e, t) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var a in t) Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
})(e, t);
}, function(e, t) {
r(e, t);
function a() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (a.prototype = t.prototype, new a());
}), i = this && this.__decorate || function(e, t, a, r) {
var o, i = arguments.length, l = i < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, a) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) l = Reflect.decorate(e, t, a, r); else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (l = (i < 3 ? o(l) : i > 3 ? o(t, a, l) : o(t, a)) || l);
return i > 3 && l && Object.defineProperty(t, a, l), l;
};
Object.defineProperty(a, "__esModule", {
value: !0
});
a.Ecpm_player_high_deathTrait = void 0;
var l = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._dataEcpmPlayerAll = null;
t._hasCheckCanOfferThisRound = !1;
t._canOfferThisRound = !1;
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassGame_Proxy",
methodName: "onGameStart"
}, {
className: "ChapterGame_Proxy",
methodName: "onStartGame"
}, {
className: "ChapterAlgorithmStrategy_Deal_Proxy",
methodName: "triggerAlgorithmTrait"
}, {
className: "AlgorithmProcessInfo",
methodName: "triggerAlgorithmResult"
}, {
className: "ClassGame_Replay_Proxy",
methodName: "onGameReplay"
}, {
className: "ChapterGame_Replay_Proxy",
methodName: "onGameReplay"
} ];
};
t.prototype.onActive = function(e) {
(hs.tp.isClassGame_ProxyOnGameStart(e) || hs.tp.isChapterGame_ProxyOnStartGame(e)) && this.initClass();
(hs.tp.isClassAlgorithmStrategy_Deal_ProxyTriggerSpecialTrait(e) || hs.tp.isChapterAlgorithmStrategy_Deal_ProxyTriggerAlgorithmTrait(e)) && this.canOfferThisRound && this.offerDeathProblem();
if (hs.tp.isAlgorithmProcessInfoTriggerAlgorithmResult(e)) {
this.offerDeathProblemResult();
this._hasCheckCanOfferThisRound = !1;
}
if ((hs.tp.isClassGame_Replay_ProxyOnGameReplay(e) || hs.tp.isChapterGame_Replay_ProxyOnGameReplay(e)) && this.canOffer && this.dataEcpmPlayerModule.algoDeath) {
this.dataEcpmPlayerModule.algoDeath = !1;
this.saveData();
}
if (hs.tp.isMoreAreaTKXCTraitCheckNoReplace(e) && this.canOfferThisRound) {
e.returnState = !0;
e.returnValue = !0;
}
if (hs.tp.isEveryGamePreRoundForceToAlgoTraitTargetReturnFalse(e) && this.canOfferThisRound) {
e.returnState = !0;
e.returnValue = !0;
}
};
t.prototype.initClass = function() {
var e;
if (this.dataEcpmPlayerModule.gameNum != this.curGameNum || this.curRoundNum <= 1) {
this.dataEcpmPlayerModule.lastEcpmValue = null !== (e = hs.ecpmInfo.getLastAdEcpm(hs.AdvertiseType.interstitial)) && void 0 !== e ? e : 0;
this.dataEcpmPlayerModule.gameNum = this.curGameNum;
this.dataEcpmPlayerModule.algoTime = 0;
this.dataEcpmPlayerModule.algoTriggerRound = 0;
this.dataEcpmPlayerModule.canOfferResult = -1;
if (this.canOffer) {
this.dataEcpmPlayerModule.algoTime = Math.floor(Math.random() * this.props.startRandTime) + 1;
this.dataEcpmPlayerModule.algoSuc = 0;
this.dataEcpmPlayerModule.algoDeath = !1;
}
this.saveData();
}
};
Object.defineProperty(t.prototype, "curGameNum", {
get: function() {
return hs.gameInfo.gameNum;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "curRoundNum", {
get: function() {
return hs.gameInfo.gameMode == hs.GameMode.Chapter ? hs.storage.getItem("chapterRoundNum", 0) : hs.storage.getItem("classRoundNum", 0);
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "curGameTime", {
get: function() {
return (hs.gameInfo.gameMode === hs.GameMode.Class ? hs.classTimerInfo.spendTime : hs.chapterTimerInfo.spendTime) / 1e3;
},
enumerable: !1,
configurable: !0
});
t.prototype.saveData = function() {
storage.setItem("ecpm_player_high_deathTrait_local", this._dataEcpmPlayerAll);
};
Object.defineProperty(t.prototype, "dataEcpmPlayerModule", {
get: function() {
this._dataEcpmPlayerAll || (this._dataEcpmPlayerAll = storage.getItem("ecpm_player_high_deathTrait_local", {
chapter: {
gameNum: -1,
lastTriggerGameNum: -1,
lastEcpmValue: -1,
algoSuc: 0,
algoDeath: !1,
algoTime: 0,
algoTriggerRound: 0
},
class: {
gameNum: -1,
lastTriggerGameNum: -1,
lastEcpmValue: -1,
algoSuc: 0,
algoDeath: !1,
algoTime: 0,
algoTriggerRound: 0
}
}));
return hs.gameInfo.gameMode == hs.GameMode.Chapter ? this._dataEcpmPlayerAll.chapter : this._dataEcpmPlayerAll.class;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "canOffer", {
get: function() {
if (this.dataEcpmPlayerModule.canOfferResult >= 0) return 1 == this.dataEcpmPlayerModule.canOfferResult;
if (this.dataEcpmPlayerModule.lastEcpmValue < this.props.ecpm || hs.gameInfo.gameMode == hs.GameMode.Chapter && hs.chapterGameInfo.chapterNum < this.props.chapterNum) {
this.dataEcpmPlayerModule.canOfferResult = 0;
return 1 == this.dataEcpmPlayerModule.canOfferResult;
}
var e;
e = this.dataEcpmPlayerModule.algoSuc <= 0 ? 0 : this.dataEcpmPlayerModule.algoDeath ? 3 : 1;
this.dataEcpmPlayerModule.canOfferResult = this.dataEcpmPlayerModule.lastTriggerGameNum + e < this.curGameNum ? 1 : 0;
return 1 == this.dataEcpmPlayerModule.canOfferResult;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "canOfferThisRound", {
get: function() {
if (this._hasCheckCanOfferThisRound) return this._canOfferThisRound;
this._hasCheckCanOfferThisRound = !0;
this._canOfferThisRound = this.checkCanOffer();
return this._canOfferThisRound;
},
enumerable: !1,
configurable: !0
});
t.prototype.checkCanOffer = function() {
if (!this.canOffer) return !1;
if (1 == this.curRoundNum) return !1;
var e = this.curGameTime;
return !(e < this.dataEcpmPlayerModule.algoTime || e > this.props.endTime || 1 == this.dataEcpmPlayerModule.algoSuc);
};
t.prototype.offerDeathProblem = function() {
this.dataEcpmPlayerModule.lastTriggerGameNum = this.curGameNum;
this.dataEcpmPlayerModule.algoTriggerRound = this.curRoundNum;
this.dataEcpmPlayerModule.algoSuc = 0;
this.saveData();
hs.algorithmStrategyInfo.algorithmList.unshift(hs.OFFER_TYPE.ZHI_SI_TI);
hs.gameInfo.gameMode == hs.GameMode.Chapter ? hs.algorithmStrategyInfo.setAlgorithmSourceLevel1(hs.ChapterAlgorithmSourceType.TravelTrait) : hs.algorithmStrategyInfo.setAlgorithmSourceLevel1(hs.ClassAlgorithmSourceType.AlgoTrait);
};
t.prototype.offerDeathProblemResult = function() {
if (this.dataEcpmPlayerModule.algoTriggerRound == this.curRoundNum) {
if (hs.algorithmName.algoActualId == hs.OFFER_TYPE.ZHI_SI_TI) {
this.dataEcpmPlayerModule.algoSuc = 1;
this.dataEcpmPlayerModule.algoDeath = !0;
} else this.dataEcpmPlayerModule.algoSuc = 2;
this.saveData();
}
};
return i([ classId("Ecpm_player_high_deathTrait") ], t);
}(Trait);
a.Ecpm_player_high_deathTrait = l;
cc._RF.pop();
}, {} ]
}, {}, [ "Ecpm_player_high_deathTrait" ]);
//# sourceMappingURL=index.js.map
