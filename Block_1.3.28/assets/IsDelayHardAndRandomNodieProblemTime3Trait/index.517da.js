window.__require = function t(e, a, i) {
function r(s, l) {
if (!a[s]) {
if (!e[s]) {
var n = s.split("/");
n = n[n.length - 1];
if (!e[n]) {
var h = "function" == typeof __require && __require;
if (!l && h) return h(n, !0);
if (o) return o(n, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = n;
}
var c = a[s] = {
exports: {}
};
e[s][0].call(c.exports, function(t) {
return r(e[s][1][t] || t);
}, c, c.exports, t, e, a, i);
}
return a[s].exports;
}
for (var o = "function" == typeof __require && __require, s = 0; s < i.length; s++) r(i[s]);
return r;
}({
IsDelayHardAndRandomNodieProblemTime3Trait: [ function(t, e, a) {
"use strict";
cc._RF.push(e, "ef472UpvkRK8aBeRyBrpV+5", "IsDelayHardAndRandomNodieProblemTime3Trait");
var i, r = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var a in e) Object.prototype.hasOwnProperty.call(e, a) && (t[a] = e[a]);
})(t, e);
}, function(t, e) {
i(t, e);
function a() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (a.prototype = e.prototype, new a());
}), o = this && this.__decorate || function(t, e, a, i) {
var r, o = arguments.length, s = o < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, a) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, a, i); else for (var l = t.length - 1; l >= 0; l--) (r = t[l]) && (s = (o < 3 ? r(s) : o > 3 ? r(e, a, s) : r(e, a)) || s);
return o > 3 && s && Object.defineProperty(e, a, s), s;
};
Object.defineProperty(a, "__esModule", {
value: !0
});
a.IsDelayHardAndRandomNodieProblemTime3Trait = void 0;
var s = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.plData = {};
e.baseScore = 2e4;
e.faildDayCount = 3;
e.workGameNum = 3;
e.faildGameNum = 0;
return e;
}
e.prototype.onCreate = function() {
var t;
this.plData = storage.getItem("DelayHardAndRandomNodieProblemTrait", {});
var e = this.props;
this.baseScore = e.baseScore || 2e4;
this.faildDayCount = e.dayCount || 3;
this.workGameNum = e.workGameNum || 3;
this.faildGameNum = 0;
if (!this.plData.featureIsWork) {
this.plData.featureIsWork = !0;
(null === (t = hs.scoreInfo) || void 0 === t ? void 0 : t.highScore) >= this.baseScore && (this.plData.isCompleteOldPlayerCondition = !0);
}
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
hs.tp.isClassAlgorithmLifeCycle_GameStart_ProxyOnGameStart(t) && this.feature2_markFaildDayStartTime();
hs.tp.isClassGame_Replay_ProxyOnGameReplay(t) && this.updateFaildBreakBestScoreCount(this.highCord);
hs.tp.isClassScore_ProxyComputeScoreAddOption(t) && this.feature2_markBreakBestScoreTime();
hs.tp.isClassAlgorithmLifeCycle_GameEnd_ProxyOnGameEnd(t) && this.updateFaildBreakBestScoreCount(this.highCord);
if (hs.tp.isClassAlgorithmStrategy_Deal_ProxyTriggerAlgorithm_PuzzleTime(t)) {
var e = TRAIT("IsPuzzleTimeTrait");
(null == e ? void 0 : e.active) && (this.checkIsDelayTimeHard() ? e.setState({
puzzleTimeStatus: hs.IsPuzzleTimeStatus.close
}) : e.setState({
puzzleTimeStatus: hs.IsPuzzleTimeStatus.default
}));
}
if (hs.tp.isClassAlgorithmStrategy_Deal_ProxyTriggerAlgorithm_Puzzle100(t)) {
this.checkHard100IsCanWork(t);
if (this.checkIsOpenHard100()) {
var a = TRAIT("Puzzle100Trait");
(null == a ? void 0 : a.active) && a.setState({
isHard: !0
});
}
}
};
e.prototype.markCureBestScore = function(t) {
if (t > this.baseScore) {
this.plData.startHightScore = t;
this.saveData();
}
};
e.prototype.updateFaildBreakBestScoreCount = function(t) {
var e;
if (this.plData.startHightScore && this.plData.startHightScore >= t) {
this.plData.faildGameNumCount = this.plData.faildGameNumCount || 0;
this.plData.faildGameNumCount++;
} else {
delete this.plData.faildGameNumCount;
if (this.plData.startHightScore) {
this.plData.breakBestScoreDayStr = "" + new Date().toLocaleDateString();
this.plData.isCompleteOldPlayerCondition && delete this.plData.isCompleteOldPlayerCondition;
} else if ((null === (e = hs.scoreInfo) || void 0 === e ? void 0 : e.score) >= this.highCord && this.highCord > this.baseScore) {
this.plData.breakBestScoreDayStr = "" + new Date().toLocaleDateString();
this.plData.isCompleteOldPlayerCondition && delete this.plData.isCompleteOldPlayerCondition;
}
}
this.saveData();
};
e.prototype.checkIsDelayHardAndRandomNodieProblemTime = function() {
return this.feature2_checkBaseConditionIsWork();
};
e.prototype.checkHard100IsCanWork = function() {
var t;
if (this.isWork && this.checkIsDelayHardAndRandomNodieProblemTime()) {
var e = new Date().toLocaleDateString();
if (this.plData.breakBestScoreDayStr != e) if ((null === (t = hs.scoreInfo) || void 0 === t ? void 0 : t.score) < Math.floor(.8 * this.plData.startHightScore)) (null == (a = TRAIT("Puzzle100Trait")) ? void 0 : a.active) && a.setState({
hard100Status: hs.Hard100Status.close
}); else {
var a;
(null == (a = TRAIT("Puzzle100Trait")) ? void 0 : a.active) && a.setState({
hard100Status: hs.Hard100Status.default
});
}
}
};
e.prototype.checkIsDelayTimeHard = function() {
var t;
if (!this.isWork) return !1;
if (!this.checkIsDelayHardAndRandomNodieProblemTime()) return !1;
var e = new Date().toLocaleDateString();
return this.plData.breakBestScoreDayStr != e && (null === (t = hs.scoreInfo) || void 0 === t ? void 0 : t.score) < Math.floor(.8 * this.plData.startHightScore);
};
e.prototype.markCurGameIsWork = function() {
var t = this.feature2_checkBaseConditionIsWork();
if (this.highCord > this.baseScore && t) {
var e = new Date().toLocaleDateString(), a = this.plData.workGameIdList || [];
if (this.plData.breakBestScoreDayStr != e && !a.includes(e + "_" + hs.classGameInfo.gameNum)) {
var i = 0;
a.forEach(function(t) {
t && -1 != t.indexOf(e) && i++;
});
var r = Math.random();
if (i < this.workGameNum && this.plData.lastWorkGameID != hs.classGameInfo.gameNum - 1 && r < .75) {
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
e.prototype.feature2_checkBaseConditionIsWork = function() {
return !!this.plData.isCompleteOldPlayerCondition || !!this.plData.failDayStartTime && this.plData.failDayStartTime.length > this.faildDayCount;
};
e.prototype.feature2_markFaildDayStartTime = function() {
var t = new Date().toLocaleDateString();
if (this.plData.breakBestScoreDayStr == t || this.highCord <= this.baseScore) {
if (this.plData.failDayStartTime) {
delete this.plData.failDayStartTime;
this.saveData();
}
} else {
this.plData.failDayStartTime = this.plData.failDayStartTime || [];
var e = new Date().getTime();
e = new Date(e).setHours(0, 0, 0, 0);
if (-1 == this.plData.failDayStartTime.indexOf(e)) {
for (var a = !0, i = 0; i < this.plData.failDayStartTime.length; i++) if (this.plData.failDayStartTime[i] > e) {
a = !1;
break;
}
if (a) {
this.plData.failDayStartTime.push(e);
this.saveData();
}
}
}
};
e.prototype.feature2_markBreakBestScoreTime = function() {
var t, e = this.highCord;
if ((null === (t = hs.scoreInfo) || void 0 === t ? void 0 : t.score) >= e && e > this.baseScore) {
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
return o([ classId("IsDelayHardAndRandomNodieProblemTime3Trait") ], e);
}(Trait);
a.IsDelayHardAndRandomNodieProblemTime3Trait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "IsDelayHardAndRandomNodieProblemTime3Trait" ]);
//# sourceMappingURL=index.js.map
