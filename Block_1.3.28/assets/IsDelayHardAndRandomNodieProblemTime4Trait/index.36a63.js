window.__require = function t(e, a, r) {
function o(s, n) {
if (!a[s]) {
if (!e[s]) {
var h = s.split("/");
h = h[h.length - 1];
if (!e[h]) {
var l = "function" == typeof __require && __require;
if (!n && l) return l(h, !0);
if (i) return i(h, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = h;
}
var c = a[s] = {
exports: {}
};
e[s][0].call(c.exports, function(t) {
return o(e[s][1][t] || t);
}, c, c.exports, t, e, a, r);
}
return a[s].exports;
}
for (var i = "function" == typeof __require && __require, s = 0; s < r.length; s++) o(r[s]);
return o;
}({
IsDelayHardAndRandomNodieProblemTime4Trait: [ function(t, e, a) {
"use strict";
cc._RF.push(e, "f855bYr/YBG3KQwvJQOBCj7", "IsDelayHardAndRandomNodieProblemTime4Trait");
var r, o = this && this.__extends || (r = function(t, e) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var a in e) Object.prototype.hasOwnProperty.call(e, a) && (t[a] = e[a]);
})(t, e);
}, function(t, e) {
r(t, e);
function a() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (a.prototype = e.prototype, new a());
}), i = this && this.__decorate || function(t, e, a, r) {
var o, i = arguments.length, s = i < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, a) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, a, r); else for (var n = t.length - 1; n >= 0; n--) (o = t[n]) && (s = (i < 3 ? o(s) : i > 3 ? o(e, a, s) : o(e, a)) || s);
return i > 3 && s && Object.defineProperty(e, a, s), s;
};
Object.defineProperty(a, "__esModule", {
value: !0
});
a.IsDelayHardAndRandomNodieProblemTime4Trait = void 0;
var s = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.plData = {};
e.baseScore = 2e4;
e.faildDayCount = 0;
e.workGameNum = 2;
e.faildGameNum = 0;
return e;
}
e.prototype.data = function() {
return this.plData;
};
e.prototype.onCreate = function() {
this.plData = storage.getItem("DelayHardAndRandomNodieProblemTrait", {});
var t = this.props;
this.baseScore = t.baseScore || 2e4;
this.workGameNum = t.workGameNum || 2;
this.faildGameNum = 0;
this.saveData();
};
e.prototype.saveData = function() {
storage.setItem("DelayHardAndRandomNodieProblemTrait", this.plData);
};
e.prototype.onActive = function(t) {
if (hs.tp.isClassAlgorithmLifeCycle_GameStart_ProxyNewGameInit(t)) {
this.markCureBestScore(this.highCord);
this.markCurGameIsWork();
}
hs.tp.isClassGame_Replay_ProxyOnGameReplay(t) && this.updateFaildBreakBestScoreCount(this.highCord);
hs.tp.isClassScore_ProxyComputeScoreAddOption(t) && this.markBreakBestScoreTime();
hs.tp.isClassAlgorithmLifeCycle_GameEnd_ProxyOnGameEnd(t) && this.updateFaildBreakBestScoreCount(this.highCord);
if (hs.tp.isClassAlgorithmStrategy_Deal_ProxyTriggerAlgorithm_PuzzleTime(t)) {
var e = TRAIT("IsPuzzleTimeTrait");
e && (this.checkIsDelayTimeHard() ? e.setState({
puzzleTimeStatus: hs.IsPuzzleTimeStatus.close
}) : e.setState({
puzzleTimeStatus: hs.IsPuzzleTimeStatus.default
}));
}
hs.tp.isClassAlgorithmStrategy_Deal_ProxyTriggerAlgorithm_Puzzle100(t) && this.checkHard100IsCanWork(t);
hs.tp.isClassAlgorithmStrategy_Condition_ProxyOnAlgorithmStrategyCondition(t) && this.isWork && this.checkIsBreakHighScore() && hs.algorithmStrategyInfo.algorithmList.unshift(hs.OFFER_TYPE.ZHI_SI_TI);
};
e.prototype.markCureBestScore = function(t) {
if (t > this.baseScore) {
this.plData.startHightScore = t;
this.saveData();
}
};
e.prototype.updateFaildBreakBestScoreCount = function(t) {
if (this.plData.startHightScore && this.plData.startHightScore >= t) {
this.plData.faildGameNumCount = this.plData.faildGameNumCount || 0;
this.plData.faildGameNumCount++;
} else {
delete this.plData.faildGameNumCount;
this.plData.startHightScore ? this.plData.breakBestScoreDayStr = "" + new Date().toLocaleDateString() : hs.scoreInfo.score >= this.highCord && this.highCord > this.baseScore && (this.plData.breakBestScoreDayStr = "" + new Date().toLocaleDateString());
}
this.saveData();
};
e.prototype.checkIsDelayHardAndRandomNodieProblemTime = function() {
this.plData.faildGameNumCount = this.plData.faildGameNumCount || 0;
return this.plData.faildGameNumCount >= this.faildGameNum;
};
e.prototype.checkHard100IsCanWork = function() {
if (this.isWork && this.checkIsDelayHardAndRandomNodieProblemTime()) {
var t = new Date().toLocaleDateString();
if (this.plData.breakBestScoreDayStr != t) if (hs.scoreInfo.score < Math.floor(.8 * this.plData.startHightScore)) (null == (e = TRAIT("Puzzle100Trait")) ? void 0 : e.active) && e.setState({
hard100Status: hs.Hard100Status.close
}); else {
var e;
(null == (e = TRAIT("Puzzle100Trait")) ? void 0 : e.active) && e.setState({
hard100Status: hs.Hard100Status.default
});
}
}
};
e.prototype.checkIsDelayTimeHard = function() {
if (!this.isWork) return !1;
if (!this.checkIsDelayHardAndRandomNodieProblemTime()) return !1;
var t = new Date().toLocaleDateString();
return this.plData.breakBestScoreDayStr != t && hs.scoreInfo.score < Math.floor(.8 * this.plData.startHightScore);
};
e.prototype.checkIsBreakHighScore = function() {
return !!(this.highCord && this.highCord > this.baseScore && hs.scoreInfo.score >= this.highCord);
};
Object.defineProperty(e.prototype, "faildGameNumCount", {
get: function() {
return this.plData.faildGameNumCount || 0;
},
enumerable: !1,
configurable: !0
});
e.prototype.markCurGameIsWork = function() {
var t = this.faildGameNumCount >= this.faildGameNum;
if (this.highCord > this.baseScore && t) {
var e = new Date().toLocaleDateString(), a = this.plData.workGameIdList || [];
if (this.plData.breakBestScoreDayStr != e && !a.includes(e + "_" + hs.classGameInfo.gameNum)) {
var r = 0;
a.forEach(function(t) {
t && -1 != t.indexOf(e) && r++;
});
var o = Math.random();
if (r < this.workGameNum && this.plData.lastWorkGameID != hs.classGameInfo.gameNum - 1 && o < .75) {
this.plData.lastWorkGameID = hs.classGameInfo.gameNum;
this.plData.workGameIdList = this.plData.workGameIdList || [];
this.plData.workGameIdList.push(e + "_" + hs.classGameInfo.gameNum);
this.plData.workGameIdList.length > 10 && this.plData.workGameIdList.shift();
this.saveData();
}
}
}
};
e.prototype.checkIsOpenHard100 = function() {
return !!(this.isWork && this.plData.startHightScore < this.highCord);
};
Object.defineProperty(e.prototype, "isWork", {
get: function() {
return this.plData.lastWorkGameID == hs.classGameInfo.gameNum;
},
enumerable: !1,
configurable: !0
});
e.prototype.markBreakBestScoreTime = function() {
var t = this.highCord;
if (hs.scoreInfo.score >= t && t > this.baseScore) {
delete this.plData.faildGameNumCount;
delete this.plData.failDayStartTime;
this.plData.breakBestScoreDayStr = "" + new Date().toLocaleDateString();
this.saveData();
}
};
Object.defineProperty(e.prototype, "highCord", {
get: function() {
return hs.scoreInfo.highScore;
},
enumerable: !1,
configurable: !0
});
return i([ classId("IsDelayHardAndRandomNodieProblemTime4Trait") ], e);
}(Trait);
a.IsDelayHardAndRandomNodieProblemTime4Trait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "IsDelayHardAndRandomNodieProblemTime4Trait" ]);
//# sourceMappingURL=index.js.map
