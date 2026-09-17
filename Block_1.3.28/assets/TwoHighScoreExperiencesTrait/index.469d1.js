window.__require = function t(e, r, o) {
function i(h, s) {
if (!r[h]) {
if (!e[h]) {
var l = h.split("/");
l = l[l.length - 1];
if (!e[l]) {
var g = "function" == typeof __require && __require;
if (!s && g) return g(l, !0);
if (a) return a(l, !0);
throw new Error("Cannot find module '" + h + "'");
}
h = l;
}
var n = r[h] = {
exports: {}
};
e[h][0].call(n.exports, function(t) {
return i(e[h][1][t] || t);
}, n, n.exports, t, e, r, o);
}
return r[h].exports;
}
for (var a = "function" == typeof __require && __require, h = 0; h < o.length; h++) i(o[h]);
return i;
}({
TwoHighScoreExperiencesTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "0d0c5L0q41AQ7vDJ5GHHCNa", "TwoHighScoreExperiencesTrait");
var o, i = this && this.__extends || (o = function(t, e) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
})(t, e);
}, function(t, e) {
o(t, e);
function r() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
}), a = this && this.__decorate || function(t, e, r, o) {
var i, a = arguments.length, h = a < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) h = Reflect.decorate(t, e, r, o); else for (var s = t.length - 1; s >= 0; s--) (i = t[s]) && (h = (a < 3 ? i(h) : a > 3 ? i(e, r, h) : i(e, r)) || h);
return a > 3 && h && Object.defineProperty(e, r, h), h;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.TwoHighScoreExperiencesTrait = void 0;
var h = function(t) {
i(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._twoHighScoreData = null;
return e;
}
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassAlgorithmLifeCycle_GameOver_Proxy",
methodName: "updateGameOverPreDataClear"
} ];
};
e.prototype.onActive = function(t) {
if (hs.tp.isClassAlgorithmLifeCycle_GameOver_ProxyUpdateGameOverPreDataClear(t)) {
var e = t.args[0];
this.updateGameState(e);
}
if (hs.tp.isClassAlgorithmStrategy_Condition_ProxyOnAlgorithmStrategyCondition(t) && this.checkCanOffer()) {
this.handleAlgorithmStrategy();
t.returnState = !0;
}
};
e.prototype.updateGameState = function(t) {
if (!hs.isSameDate(this.twoHighScoreData.lastTriggerDate, Date.now())) {
this.twoHighScoreData.todayBreakHighScoreGameNum = 0;
this.twoHighScoreData.todayBreakHighScoreReplayCount = 0;
this.saveData();
}
if (hs.classGameInfo.gameNum < 1) {
this.twoHighScoreData.lastHighScore = hs.classScoreInfo.highScore;
this.saveData();
} else {
t && this.twoHighScoreData.todayBreakHighScoreReplayCount++;
if (hs.classScoreInfo.recordHigh) {
0 === this.twoHighScoreData.firstBreakHighScoreGameNum && (this.twoHighScoreData.firstBreakHighScoreGameNum = hs.classGameInfo.gameNum);
this.twoHighScoreData.todayBreakHighScoreGameNum = hs.classGameInfo.gameNum;
this.twoHighScoreData.lastTriggerDate = Date.now();
this.twoHighScoreData.todayBreakHighScoreReplayCount = 0;
this.twoHighScoreData.historyHighScore = hs.classScoreInfo.highScoreRecords.length > 0 ? hs.classScoreInfo.highScoreRecords[hs.classScoreInfo.highScoreRecords.length - 1] : 0;
this.twoHighScoreData.lastHighScore = hs.classScoreInfo.highScore;
}
this.saveData();
}
};
e.prototype.checkCanOffer = function() {
return !(hs.classGameInfo.gameNum < 1) && (hs.algorithmStrategyInfo.algorithmSourceLevel1 !== hs.ClassAlgorithmSourceType.Puzzle100 && (this.twoHighScoreData.firstBreakHighScoreGameNum > 0 && hs.classGameInfo.gameNum > this.twoHighScoreData.firstBreakHighScoreGameNum));
};
e.prototype.handleAlgorithmStrategy = function() {
var t = this.twoHighScoreData.lastHighScore, e = hs.classScoreInfo.score;
t <= 3e3 ? this.handleLowScoreStrategy(e, t) : t <= 1e4 ? this.handleMidScoreStrategy(e, t) : this.handleHighScoreStrategy(e, t);
};
e.prototype.handleLowScoreStrategy = function(t, e) {
t >= e || this.setFillBlankAlgorithm();
};
e.prototype.handleMidScoreStrategy = function(t, e) {
if (this.twoHighScoreData.todayBreakHighScoreGameNum <= 0) {
if (t >= e) {
this.setBottomBoardOrVeryDifficultHardAlgorithm();
return;
}
this.setFillBlankAlgorithm();
} else this.handleBreakHighScoreLogic(t);
};
e.prototype.handleHighScoreStrategy = function(t) {
this.handleBreakHighScoreLogic(t);
};
e.prototype.handleBreakHighScoreLogic = function(t) {
var e = this.twoHighScoreData.historyHighScore, r = this.twoHighScoreData.lastHighScore, o = Math.min(.8 * r, e), i = r - o, a = hs.classGameInfo.gameNum - this.twoHighScoreData.todayBreakHighScoreGameNum - this.twoHighScoreData.todayBreakHighScoreReplayCount;
if (a <= 1) this.handleGameNum1Logic(t, o, r); else if (a >= 2 && a <= 3) this.handleGameNum2to3Logic(t, o, r, i); else if (a >= 4 && a <= 6) this.handleGameNum4to6Logic(t, o, r, i); else {
if (!(a > 6)) {
this.setBottomBoardOrVeryDifficultHardAlgorithm();
return;
}
this.handleGameNumOver6Logic(t, r);
}
};
e.prototype.handleGameNum1Logic = function(t, e, r) {
if (t <= e) this.setFillBlankAlgorithm(); else {
if (!(t > e && t <= r)) {
this.setBottomBoardOrVeryDifficultHardAlgorithm();
return;
}
this.setFillBlankAndHardAlgorithm();
}
};
e.prototype.handleGameNum2to3Logic = function(t, e, r, o) {
var i = e + .5 * o;
if (t <= e) this.setFillBlankAlgorithm(); else if (t > e && t <= i) this.setFillBlankAndHardAlgorithm2To1(); else {
if (!(t > i && t <= r)) {
this.setBottomBoardOrVeryDifficultHardAlgorithm();
return;
}
this.setIntuitiveAndExtremeHardAlgorithm();
}
};
e.prototype.handleGameNum4to6Logic = function(t, e, r, o) {
var i = e + .5 * o;
if (t <= i) this.setFillBlankAlgorithm(); else {
if (!(t > i && t <= r)) {
this.setBottomBoardOrVeryDifficultHardAlgorithm();
return;
}
this.setIntuitiveAndExtremeHardAlgorithm();
}
};
e.prototype.handleGameNumOver6Logic = function(t, e) {
t <= e ? this.setFillBlankAlgorithm() : this.setBottomBoardOrVeryDifficultHardAlgorithm();
};
e.prototype.setFillBlankAlgorithm = function() {
if (hs.binarySupport.getWeightValue(hs.boardInfo.faceBlocks) <= 410) {
hs.algorithmStrategyInfo.setAlgorithmSourceLevel1(hs.ClassAlgorithmSourceType.AlgoTrait);
hs.algorithmStrategyInfo.setAlgorithmList([ hs.OFFER_TYPE.CLEAR_MORE_BLOCK ]);
hs.algorithmStrategyInfo.setAlgorithmSourceLevel2(this.traitName);
} else {
hs.algorithmStrategyInfo.setAlgorithmSourceLevel1(hs.ClassAlgorithmSourceType.AlgoTrait);
hs.algorithmStrategyInfo.setAlgorithmList([ hs.OFFER_TYPE.ALGO_CLEAR_BOARD_GATHER ]);
hs.algorithmStrategyInfo.setAlgorithmSourceLevel2(this.traitName);
}
};
e.prototype.setFillBlankAndHardAlgorithm = function() {
if (Math.random() < .5) this.setFillBlankAlgorithm(); else {
hs.algorithmStrategyInfo.setAlgorithmSourceLevel1(hs.ClassAlgorithmSourceType.AlgoTrait);
hs.algorithmStrategyInfo.setAlgorithmList([ hs.OFFER_TYPE.VERY_DIFFICULT_HARD ]);
hs.algorithmStrategyInfo.setAlgorithmSourceLevel2(this.traitName);
}
};
e.prototype.setFillBlankAndHardAlgorithm2To1 = function() {
if (Math.random() < .67) this.setFillBlankAlgorithm(); else {
hs.algorithmStrategyInfo.setAlgorithmSourceLevel1(hs.ClassAlgorithmSourceType.AlgoTrait);
hs.algorithmStrategyInfo.setAlgorithmList([ hs.OFFER_TYPE.KUN_NAN_TI ]);
hs.algorithmStrategyInfo.setAlgorithmSourceLevel2(this.traitName);
}
};
e.prototype.setIntuitiveAndExtremeHardAlgorithm = function() {
if (Math.random() < .5) {
hs.algorithmStrategyInfo.setAlgorithmSourceLevel1(hs.ClassAlgorithmSourceType.AlgoTrait);
hs.algorithmStrategyInfo.setAlgorithmList([ hs.OFFER_TYPE.ZHI_JUE_NAN_TI ]);
hs.algorithmStrategyInfo.setAlgorithmSourceLevel2(this.traitName);
} else {
hs.algorithmStrategyInfo.setAlgorithmSourceLevel1(hs.ClassAlgorithmSourceType.AlgoTrait);
hs.algorithmStrategyInfo.setAlgorithmList([ hs.OFFER_TYPE.VERY_DIFFICULT_HARD ]);
hs.algorithmStrategyInfo.setAlgorithmSourceLevel2(this.traitName);
}
};
e.prototype.setBottomBoardOrVeryDifficultHardAlgorithm = function() {
if (Math.random() < .7) {
hs.algorithmStrategyInfo.setAlgorithmSourceLevel1(hs.ClassAlgorithmSourceType.AlgoTrait);
hs.algorithmStrategyInfo.setAlgorithmList([ hs.OFFER_TYPE.VERY_DIFFICULT_HARD ]);
hs.algorithmStrategyInfo.setAlgorithmSourceLevel2(this.traitName);
}
};
e.prototype.saveData = function() {
storage.setItem("twoHighScoreExperiencesData", this.twoHighScoreData);
};
Object.defineProperty(e.prototype, "twoHighScoreData", {
get: function() {
this._twoHighScoreData || (this._twoHighScoreData = storage.getItem("twoHighScoreExperiencesData", {
todayBreakHighScoreGameNum: 0,
lastTriggerDate: 0,
lastHighScore: 0,
historyHighScore: 0,
firstBreakHighScoreGameNum: 0,
todayBreakHighScoreReplayCount: 0
}));
return this._twoHighScoreData;
},
enumerable: !1,
configurable: !0
});
return a([ classId("TwoHighScoreExperiencesTrait") ], e);
}(Trait);
r.TwoHighScoreExperiencesTrait = h;
cc._RF.pop();
}, {} ]
}, {}, [ "TwoHighScoreExperiencesTrait" ]);
//# sourceMappingURL=index.js.map
