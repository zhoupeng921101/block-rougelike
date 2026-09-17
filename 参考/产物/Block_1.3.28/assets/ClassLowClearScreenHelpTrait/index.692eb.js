window.__require = function e(t, r, a) {
function o(i, s) {
if (!r[i]) {
if (!t[i]) {
var l = i.split("/");
l = l[l.length - 1];
if (!t[l]) {
var c = "function" == typeof __require && __require;
if (!s && c) return c(l, !0);
if (n) return n(l, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = l;
}
var p = r[i] = {
exports: {}
};
t[i][0].call(p.exports, function(e) {
return o(t[i][1][e] || e);
}, p, p.exports, e, t, r, a);
}
return r[i].exports;
}
for (var n = "function" == typeof __require && __require, i = 0; i < a.length; i++) o(a[i]);
return o;
}({
ClassLowClearScreenHelpInfo: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "40344gmJ4ZET6EQlChvRVMM", "ClassLowClearScreenHelpInfo");
var a = this && this.__decorate || function(e, t, r, a) {
var o, n = arguments.length, i = n < 3 ? t : null === a ? a = Object.getOwnPropertyDescriptor(t, r) : a;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(e, t, r, a); else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (i = (n < 3 ? o(i) : n > 3 ? o(t, r, i) : o(t, r)) || i);
return n > 3 && i && Object.defineProperty(t, r, i), i;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.classLowClearScreenHelpInfo = void 0;
var o = hs.storageProperty, n = function() {
function e() {
this._strategyData = {
req_type: "",
data: null,
date: "",
todayMaxScore: 0,
todayClearCount: 0,
hasBreakRecord: !1,
historicalHighScore: 0
};
}
Object.defineProperty(e.prototype, "strategyData", {
get: function() {
return this._strategyData;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "serverData", {
get: function() {
return this._strategyData.data;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "reqType", {
get: function() {
return this._strategyData.req_type;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "todayMaxScore", {
get: function() {
return this._strategyData.todayMaxScore;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "todayClearCount", {
get: function() {
return this._strategyData.todayClearCount;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "hasBreakRecord", {
get: function() {
return this._strategyData.hasBreakRecord;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "historicalHighScore", {
get: function() {
return this._strategyData.historicalHighScore;
},
enumerable: !1,
configurable: !0
});
e.prototype.updateServerData = function(e, t) {
this._strategyData.req_type = e;
this._strategyData.data = t;
};
e.prototype.updateTodayMaxScore = function(e) {
e > this._strategyData.todayMaxScore && (this._strategyData.todayMaxScore = e);
};
e.prototype.recordBreakHighScore = function(e, t) {
if (!this._strategyData.hasBreakRecord && e >= t && e > this._strategyData.historicalHighScore) {
hs.gameInfo.gameNum > 0 && (this._strategyData.hasBreakRecord = !0);
this._strategyData.historicalHighScore = t;
}
};
e.prototype.incrementClearCount = function() {
storage.getItem("classGuideStep", 0) < 3 || this._strategyData.todayClearCount++;
};
e.prototype.checkAndUpdateDate = function() {
var e = this.getTodayString();
if (this._strategyData.date !== e) {
this._strategyData.date = e;
this._strategyData.todayMaxScore = 0;
this._strategyData.todayClearCount = 0;
this._strategyData.hasBreakRecord = !1;
this._strategyData.historicalHighScore = hs.classScoreInfo.highScore;
}
};
e.prototype.isSameDay = function(e) {
return e === this.getTodayString();
};
e.prototype.getTodayString = function() {
var e = new Date();
return e.getFullYear() + "-" + String(e.getMonth() + 1).padStart(2, "0") + "-" + String(e.getDate()).padStart(2, "0");
};
e.prototype.isDataValid = function() {
return null !== this._strategyData.data && this.isSameDay(this._strategyData.date);
};
e.prototype.clearServerData = function() {
this._strategyData.req_type = "";
this._strategyData.data = null;
};
e.prototype.resetAllData = function() {
this._strategyData = {
req_type: "",
data: null,
date: "",
todayMaxScore: 0,
todayClearCount: 0,
hasBreakRecord: !1,
historicalHighScore: 0
};
};
a([ o({
key: "classLowClearScreenHelp_StrategyData"
}) ], e.prototype, "_strategyData", void 0);
return e;
}();
r.classLowClearScreenHelpInfo = new n();
cc._RF.pop();
}, {} ],
ClassLowClearScreenHelpTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "73154NXVmZAwZTPnqcrAg2z", "ClassLowClearScreenHelpTrait");
var a, o = this && this.__extends || (a = function(e, t) {
return (a = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
a(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), n = this && this.__decorate || function(e, t, r, a) {
var o, n = arguments.length, i = n < 3 ? t : null === a ? a = Object.getOwnPropertyDescriptor(t, r) : a;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(e, t, r, a); else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (i = (n < 3 ? o(i) : n > 3 ? o(t, r, i) : o(t, r)) || i);
return n > 3 && i && Object.defineProperty(t, r, i), i;
}, i = this && this.__awaiter || function(e, t, r, a) {
return new (r || (r = Promise))(function(o, n) {
function i(e) {
try {
l(a.next(e));
} catch (e) {
n(e);
}
}
function s(e) {
try {
l(a.throw(e));
} catch (e) {
n(e);
}
}
function l(e) {
e.done ? o(e.value) : (t = e.value, t instanceof r ? t : new r(function(e) {
e(t);
})).then(i, s);
var t;
}
l((a = a.apply(e, t || [])).next());
});
}, s = this && this.__generator || function(e, t) {
var r, a, o, n, i = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
},
trys: [],
ops: []
};
return n = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (n[Symbol.iterator] = function() {
return this;
}), n;
function s(e) {
return function(t) {
return l([ e, t ]);
};
}
function l(n) {
if (r) throw new TypeError("Generator is already executing.");
for (;i; ) try {
if (r = 1, a && (o = 2 & n[0] ? a.return : n[0] ? a.throw || ((o = a.return) && o.call(a), 
0) : a.next) && !(o = o.call(a, n[1])).done) return o;
(a = 0, o) && (n = [ 2 & n[0], o.value ]);
switch (n[0]) {
case 0:
case 1:
o = n;
break;

case 4:
i.label++;
return {
value: n[1],
done: !1
};

case 5:
i.label++;
a = n[1];
n = [ 0 ];
continue;

case 7:
n = i.ops.pop();
i.trys.pop();
continue;

default:
if (!(o = i.trys, o = o.length > 0 && o[o.length - 1]) && (6 === n[0] || 2 === n[0])) {
i = 0;
continue;
}
if (3 === n[0] && (!o || n[1] > o[0] && n[1] < o[3])) {
i.label = n[1];
break;
}
if (6 === n[0] && i.label < o[1]) {
i.label = o[1];
o = n;
break;
}
if (o && i.label < o[2]) {
i.label = o[2];
i.ops.push(n);
break;
}
o[2] && i.ops.pop();
i.trys.pop();
continue;
}
n = t.call(e, i);
} catch (e) {
n = [ 6, e ];
a = 0;
} finally {
r = o = 0;
}
if (5 & n[0]) throw n[1];
return {
value: n[0] ? n[1] : void 0,
done: !0
};
}
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ClassLowClearScreenHelpTrait = void 0;
var l = e("../vo/ClassLowClearScreenHelpInfo"), c = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.requestFailed = !1;
return t;
}
t.prototype.data = function() {
return {
clearScreenTime: -1,
replaceClearScreenTime: !1,
originalPuzzleTimeFirst: 0
};
};
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassAlgorithmLifeCycle_GameStart_Proxy",
methodName: "onGameStart"
}, {
className: "ClassAlgorithmLifeCycle_GameEnd_Proxy",
methodName: "onGameEnd"
}, {
className: "ClassAlgorithmLifeCycle_Replay_Proxy",
methodName: "onGameReplay"
}, {
className: "ClassDataStatistics_Proxy",
methodName: "onClearScreen"
} ];
};
t.prototype.onActive = function(e) {
return i(this, void 0, void 0, function() {
return s(this, function() {
hs.tp.isClassAlgorithmLifeCycle_GameStart_ProxyOnGameStart(e) && this.onGameStart();
hs.tp.isClassAlgorithmLifeCycle_GameEnd_ProxyOnGameEnd(e) && this.onGameEnd();
hs.tp.isClassAlgorithmLifeCycle_Replay_ProxyOnGameReplay(e) && this.onGameReplay();
hs.tp.isClassDataStatistics_ProxyOnClearScreen(e) && this.onClearScreenHappened();
hs.tp.isClearBoardPlusTraitGetClearScreenTime(e) && this.getClearScreenTime(e);
hs.tp.isClearBoardPlusTraitGetOriginalPuzzleTimeFirst(e) && this.getOriginalPuzzleTimeFirst(e);
hs.tp.isClassAlgorithmStrategy_Reset_ProxyPreprocessing_PuzzleTime(e) && this.applyStrategy4();
return [ 2 ];
});
});
};
t.prototype.onGameStart = function() {
var e = l.classLowClearScreenHelpInfo;
e.checkAndUpdateDate();
if (e.isDataValid() && hs.classScoreInfo.score > 0) {
this.applyStrategy1();
this.applyStrategy2();
} else this.requestNextStrategy();
};
t.prototype.onGameEnd = function() {
var e = l.classLowClearScreenHelpInfo;
e.checkAndUpdateDate();
var t = hs.classScoreInfo.score;
e.updateTodayMaxScore(t);
var r = hs.classScoreInfo.highScore;
e.recordBreakHighScore(t, r);
this.clearState();
};
t.prototype.requestNextStrategy = function() {
var e = this, t = this.props;
if (null == t ? void 0 : t.req_type) {
var r = t.req_type, a = t.platform, o = t.active_type, n = hs.traitServerRequestInfo.uid;
if (n) {
var i = {
key: n,
req_type: r,
platform: a,
active_type: o
};
this.sendRequest("https://user-skill-eval.afafb.com/infer/v1/user_recent_adjust_20251201", i).then(function(t) {
var a = t[r];
if (a && 0 === a.code && a.data) {
l.classLowClearScreenHelpInfo.updateServerData(r, a.data);
e.requestFailed = !1;
e.applyStrategy1();
e.applyStrategy2();
} else e.requestFailed = !0;
}).catch(function() {
e.requestFailed = !0;
});
} else this.requestFailed = !0;
}
};
t.prototype.sendRequest = function(e, t) {
return hs.http.requestAsync(e, t, {
type: hs.HttpType.POST,
contentType: "application/x-www-form-urlencoded",
crypto: hs.UrlCrypto
});
};
t.prototype.onGameReplay = function() {
this.requestFailed = !1;
};
t.prototype.clearState = function() {
this.state.clearScreenTime = -1;
this.state.replaceClearScreenTime = !1;
};
t.prototype.validateStrategyData = function(e) {
var t = l.classLowClearScreenHelpInfo;
if (this.requestFailed || !t.isDataValid()) {
this.clearState();
return null;
}
if (t.reqType !== e) return null;
if (!t.serverData) {
this.clearState();
return null;
}
return t.serverData;
};
t.prototype.applyStrategy1 = function() {
var e = this.validateStrategyData("user_recent_adjust_clean_20251201_1");
if (e) {
var t = e.p, r = void 0 === t ? 0 : t, a = e.time;
Math.random() > r ? this.clearState() : this.setClearScreenTime(a);
}
};
t.prototype.applyStrategy2 = function() {
var e = this.validateStrategyData("user_recent_adjust_clean_20251201_2");
if (e) {
var t = e.time;
l.classLowClearScreenHelpInfo.hasBreakRecord ? this.clearState() : this.setClearScreenTime(t);
}
};
t.prototype.setClearScreenTime = function(e) {
if (e < 0) {
this.state.clearScreenTime = 0;
this.state.replaceClearScreenTime = !0;
} else {
this.state.clearScreenTime = e;
this.state.replaceClearScreenTime = !0;
}
};
t.prototype.applyStrategy3 = function() {
var e = this.validateStrategyData("user_recent_adjust_clean_20251201_3");
if (e) {
var t = e.c, r = e.time;
l.classLowClearScreenHelpInfo.todayClearCount >= t ? this.clearState() : this.setClearScreenTime(r);
}
};
t.prototype.applyStrategy4 = function() {
var e = TRAIT("IsPuzzleTimeTrait");
this.state.originalPuzzleTimeFirst = (null == e ? void 0 : e.active) ? e.state.puzzleTimeFirst : 0;
var t = this.validateStrategyData("user_recent_adjust_clean_20251201_4");
if (t) {
var r = t.t, a = void 0 === r ? 0 : r, o = t.time;
l.classLowClearScreenHelpInfo.hasBreakRecord && this.adjustFirstPuzzleTime(a);
this.setClearScreenTime(o);
}
};
t.prototype.adjustFirstPuzzleTime = function(e) {
var t = TRAIT("IsPuzzleTimeTrait");
if (null == t ? void 0 : t.active) {
var r = t.state.puzzleTimeFirst, a = Math.max(0, r - e);
t.setState({
puzzleTimeFirst: a
});
}
};
t.prototype.onClearScreenHappened = function() {
var e = l.classLowClearScreenHelpInfo;
e.checkAndUpdateDate();
e.incrementClearCount();
};
t.prototype.getClearScreenTime = function(e) {
this.applyStrategy3();
if (this.state.replaceClearScreenTime) {
e.returnValue = this.state.clearScreenTime;
e.returnState = !0;
}
};
t.prototype.getOriginalPuzzleTimeFirst = function(e) {
e.returnValue = this.state.originalPuzzleTimeFirst;
e.returnState = !0;
};
return n([ classId("ClassLowClearScreenHelpTrait") ], t);
}(Trait);
r.ClassLowClearScreenHelpTrait = c;
cc._RF.pop();
}, {
"../vo/ClassLowClearScreenHelpInfo": "ClassLowClearScreenHelpInfo"
} ]
}, {}, [ "ClassLowClearScreenHelpTrait", "ClassLowClearScreenHelpInfo" ]);
//# sourceMappingURL=index.js.map
