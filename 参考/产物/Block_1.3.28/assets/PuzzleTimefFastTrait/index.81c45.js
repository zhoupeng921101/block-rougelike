window.__require = function t(i, e, r) {
function a(o, l) {
if (!e[o]) {
if (!i[o]) {
var h = o.split("/");
h = h[h.length - 1];
if (!i[h]) {
var n = "function" == typeof __require && __require;
if (!l && n) return n(h, !0);
if (s) return s(h, !0);
throw new Error("Cannot find module '" + o + "'");
}
o = h;
}
var u = e[o] = {
exports: {}
};
i[o][0].call(u.exports, function(t) {
return a(i[o][1][t] || t);
}, u, u.exports, t, i, e, r);
}
return e[o].exports;
}
for (var s = "function" == typeof __require && __require, o = 0; o < r.length; o++) a(r[o]);
return a;
}({
PuzzleTimefFastTrait: [ function(t, i, e) {
"use strict";
cc._RF.push(i, "b9364t/OM5Gc7EdlMJgmi6O", "PuzzleTimefFastTrait");
var r, a = this && this.__extends || (r = function(t, i) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, i) {
t.__proto__ = i;
} || function(t, i) {
for (var e in i) Object.prototype.hasOwnProperty.call(i, e) && (t[e] = i[e]);
})(t, i);
}, function(t, i) {
r(t, i);
function e() {
this.constructor = t;
}
t.prototype = null === i ? Object.create(i) : (e.prototype = i.prototype, new e());
}), s = this && this.__decorate || function(t, i, e, r) {
var a, s = arguments.length, o = s < 3 ? i : null === r ? r = Object.getOwnPropertyDescriptor(i, e) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) o = Reflect.decorate(t, i, e, r); else for (var l = t.length - 1; l >= 0; l--) (a = t[l]) && (o = (s < 3 ? a(o) : s > 3 ? a(i, e, o) : a(i, e)) || o);
return s > 3 && o && Object.defineProperty(i, e, o), o;
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.PuzzleTimefFastTrait = void 0;
var o = function(t) {
a(i, t);
function i() {
var i = null !== t && t.apply(this, arguments) || this;
i._traitData = null;
i._isPlanB = !1;
return i;
}
i.prototype.data = function() {
return {
puzzleTimeFirst: 0,
puzzleTimeOther: 0,
roundStartTime: 0,
roundTimeOffMap: [],
isColdStart: !1,
isWarmStart: !1,
isTriggerPuzzleTime: !1,
isFirstPuzzleTimeSet: !1
};
};
i.prototype.onCreate = function() {
this.loadData();
};
i.prototype.onActive = function(t) {
hs.tp.isClassAlgorithmStrategy_Reset_ProxyPreprocessing_PuzzleTime(t) && this._traitData.isCanTriggerSimpleZhiJue && this.setPuzzleTime();
if (hs.tp.isClassAlgorithmStrategy_Deal_ProxyPostPreprocessing(t) && (hs.algorithmStrategyInfo.algorithmSourceLevel1 == hs.ClassAlgorithmSourceType.PuzzleTimeFirst || hs.algorithmStrategyInfo.algorithmSourceLevel1 == hs.ClassAlgorithmSourceType.PuzzleTimeOther)) if (!this._traitData.isPuzzleTimeRound && this._traitData.isCanTriggerSimpleZhiJue) {
t.disable([ "CTAgloStrategyTrait" ]);
this.setAlgorithmListPlanB();
this._traitData.isPuzzleTimeRound = !0;
var i = TRAIT("IsPuzzleTimeTrait");
(null == i ? void 0 : i.active) && i.state.isHardFirst && i.setState({
isHardFirst: !1,
initTime: Date.now()
});
this._isPlanB = !0;
} else if (this._traitData.isPuzzleTimeRound && this._traitData.isCanTriggerSimpleZhiJue) {
this.setAlgorithmListPlanA();
this.state.isTriggerPuzzleTime = !0;
this._isPlanB = !1;
} else this.state.isTriggerPuzzleTime = !0;
hs.tp.isClassBlocksProducer_ProxyOnTouchEnd(t) && this.onTouchEndDone(t);
if (hs.tp.isClassAlgorithmProcessInfoStrategyOver(t)) {
if (this._traitData.isCanTriggerSimpleZhiJue) {
var e = hs.algorithmInfo.algoSource == hs.algorithmSource.NORMAL && hs.isValueInEnum(hs.algorithmName.algoExpectedId, hs.OFFER_TYPE_DIFFICULTY) || hs.algorithmInfo.algoSource == hs.algorithmSource.SUCCESS || hs.algorithmStrategyInfo.algorithmSourceLevel2 == this.traitName && hs.algorithmInfo.algoSource == hs.algorithmSource.NORMAL || hs.algorithmStrategyInfo.algorithmSourceLevel2 == this.traitName && hs.algorithmInfo.algoSource == hs.algorithmSource.NORMAL && (hs.algorithmStrategyInfo.algorithmSourceLevel1 == hs.ClassAlgorithmSourceType.PuzzleTimeFirst || hs.algorithmStrategyInfo.algorithmSourceLevel1 == hs.ClassAlgorithmSourceType.PuzzleTimeOther);
if (this._traitData.isPuzzleTimeRound && this.state.isTriggerPuzzleTime) {
if (e) {
this._traitData.isPuzzleTimeRound = !1;
this.saveData();
}
} else !this._traitData.isPuzzleTimeRound && this._isPlanB;
}
this._isPlanB = !1;
this.state.isTriggerPuzzleTime = !1;
}
if (hs.tp.isClassAlgorithmLifeCycle_GameStart_ProxyOnGameStart(t)) if (t.args[0].data.newGame) {
this._traitData.roundTimeOffMap = [];
this._traitData.isPuzzleTimeRound = !1;
this._traitData.isCanTriggerSimpleZhiJue = !1;
this._traitData.roundNum = 0;
this.saveData();
this.state.isColdStart = !1;
this.state.roundStartTime = 0;
this.state.isTriggerPuzzleTime = !1;
this.state.isFirstPuzzleTimeSet = !1;
} else {
this.state.isColdStart = !0;
this.state.roundStartTime = 0;
this.state.isTriggerPuzzleTime = !1;
this.state.isFirstPuzzleTimeSet = !1;
this.loadData();
}
if (hs.tp.isGame_ProxyOnGameShow(t)) {
this.state.isWarmStart = !0;
this.state.roundStartTime = 0;
}
};
i.prototype.onTouchEndDone = function(t) {
var i, e;
if ((null === (i = null == t ? void 0 : t.args[0]) || void 0 === i ? void 0 : i.state).clearProducer && hs.classGuideInfo.isFinishedGuide) if (0 == this.state.roundStartTime) {
this.state.isColdStart = !1;
this.state.isWarmStart = !1;
this.state.roundStartTime = Date.now();
} else if (!this.state.isColdStart && !this.state.isWarmStart && (null === (e = this._traitData) || void 0 === e ? void 0 : e.roundNum) < 10) {
var r = Date.now() - this.state.roundStartTime;
this.state.roundStartTime = Date.now();
this._traitData.roundTimeOffMap.push(r);
this._traitData.roundNum++;
this.isCanTriggerSimpleZhiJue();
this.saveData();
} else {
this.state.isColdStart = !1;
this.state.isWarmStart = !1;
}
};
i.prototype.setAlgorithmListPlanB = function() {
hs.algorithmStrategyInfo.setAlgorithmSourceLevel2(this.traitName);
hs.algorithmStrategyInfo.setAlgorithmList([ hs.OFFER_TYPE.SIMPLE_ZHIJUE ]);
hs.algorithmStrategyInfo.setAlgorithmFailList([ hs.OFFER_TYPE.TIAN_KONG_XIAO_CHU ]);
};
i.prototype.setAlgorithmListPlanA = function() {
hs.algorithmStrategyInfo.setAlgorithmSourceLevel2(this.traitName);
};
i.prototype.isCanTriggerSimpleZhiJue = function() {
var t;
if ((null === (t = this._traitData) || void 0 === t ? void 0 : t.roundNum) >= 10 && this._traitData.roundTimeOffMap.length > 0 && this._traitData.roundTimeOffMap.reduce(function(t, i) {
return t + i;
}, 0) / this._traitData.roundTimeOffMap.length <= 4600) {
this._traitData.isCanTriggerSimpleZhiJue = !0;
this.setPuzzleTime();
}
};
i.prototype.loadData = function() {
this._traitData = storage.getItem("classRoundTimeOffMap", null);
null == this._traitData && (this._traitData = {
roundTimeOffMap: [],
isPuzzleTimeRound: !1,
isCanTriggerSimpleZhiJue: !1,
roundNum: 0
});
};
i.prototype.saveData = function() {
storage.setItem("classRoundTimeOffMap", this._traitData);
};
i.prototype.setPuzzleTime = function() {
var t = TRAIT("IsPuzzleTimeTrait");
if (null == t ? void 0 : t.active) {
if (!this.state.isFirstPuzzleTimeSet) {
this.state.puzzleTimeFirst = t.state.puzzleTimeFirst - 30;
t.setState({
puzzleTimeFirst: this.state.puzzleTimeFirst
});
this.state.isFirstPuzzleTimeSet = !0;
}
this.state.puzzleTimeOther = hs.randomInt(20, 45);
t.setState({
puzzleTimeOther: this.state.puzzleTimeOther
});
}
};
return s([ classId("PuzzleTimefFastTrait") ], i);
}(Trait);
e.PuzzleTimefFastTrait = o;
cc._RF.pop();
}, {} ]
}, {}, [ "PuzzleTimefFastTrait" ]);
//# sourceMappingURL=index.js.map
