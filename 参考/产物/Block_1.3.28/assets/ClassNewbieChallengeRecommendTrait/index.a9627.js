window.__require = function e(t, r, n) {
function o(s, i) {
if (!r[s]) {
if (!t[s]) {
var l = s.split("/");
l = l[l.length - 1];
if (!t[l]) {
var c = "function" == typeof __require && __require;
if (!i && c) return c(l, !0);
if (a) return a(l, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = l;
}
var m = r[s] = {
exports: {}
};
t[s][0].call(m.exports, function(e) {
return o(t[s][1][e] || e);
}, m, m.exports, e, t, r, n);
}
return r[s].exports;
}
for (var a = "function" == typeof __require && __require, s = 0; s < n.length; s++) o(n[s]);
return o;
}({
ClassNewbieChallengeRecommendInfo: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "de674EXPcFFVZtEdFMCN5Ff", "ClassNewbieChallengeRecommendInfo");
Object.defineProperty(r, "__esModule", {
value: !0
});
r.classNewbieChallengeRecommendInfo = void 0;
var n = function() {
function e() {
this.MAX_REQUEST_GAMES = 5;
this.MAX_APPLY_GAMES = 6;
this._isReplayMode = !1;
this.STORAGE_PREFIX = "classNewbieChallengeRecommend";
}
Object.defineProperty(e.prototype, "gameHistory", {
get: function() {
return hs.storage.getItem(this.STORAGE_PREFIX + "_GameHistory", []);
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "currentGameCount", {
get: function() {
return hs.storage.getItem(this.STORAGE_PREFIX + "_TotalGameCount", 0);
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "currentGameStartTime", {
get: function() {
return hs.storage.getItem(this.STORAGE_PREFIX + "_CurrentGameStartTime", 0);
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "firstHardTimestamp", {
get: function() {
return hs.storage.getItem(this.STORAGE_PREFIX + "_FirstHardTimestamp", 0);
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "firstHardRound", {
get: function() {
return hs.storage.getItem(this.STORAGE_PREFIX + "_FirstHardRound", 0);
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "recommendedHardTime", {
get: function() {
return hs.storage.getItem(this.STORAGE_PREFIX + "_RecommendTime", 0);
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "shouldRequest", {
get: function() {
return this.currentGameCount <= this.MAX_REQUEST_GAMES;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "shouldApplyRecommendedTime", {
get: function() {
return this.recommendedHardTime > 0 && this.currentGameCount < this.MAX_APPLY_GAMES && !this._isReplayMode;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "shouldContinueTracking", {
get: function() {
return this.currentGameCount < this.MAX_APPLY_GAMES;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "isReplayMode", {
get: function() {
return this._isReplayMode;
},
enumerable: !1,
configurable: !0
});
e.prototype.addGameData = function(e) {
var t = this.gameHistory;
t.push(e);
t.length > 5 && t.splice(0, t.length - 5);
hs.storage.setItem(this.STORAGE_PREFIX + "_GameHistory", t);
var r = this.currentGameCount + 1;
hs.storage.setItem(this.STORAGE_PREFIX + "_TotalGameCount", r);
};
e.prototype.updateRecommendedHardTime = function(e) {
hs.storage.setItem(this.STORAGE_PREFIX + "_RecommendTime", e);
};
e.prototype.buildRequestData = function(e, t, r) {
return {
key: r,
req_type: e,
platform: t,
game_data: this.gameHistory
};
};
e.prototype.recordGameStartTime = function() {
var e = new Date().getTime();
hs.storage.setItem(this.STORAGE_PREFIX + "_CurrentGameStartTime", e);
};
e.prototype.recordFirstHardRound = function() {
0 === this.firstHardRound && hs.storage.setItem(this.STORAGE_PREFIX + "_FirstHardRound", hs.classGameInfo.roundNum);
};
e.prototype.recordFirstHardTimestamp = function() {
if (!(this.firstHardTimestamp > 0)) {
var e = new Date().getTime();
hs.storage.setItem(this.STORAGE_PREFIX + "_FirstHardTimestamp", e);
}
};
e.prototype.calculateFirstHardTime = function() {
var e = this.currentGameStartTime, t = this.firstHardTimestamp;
if (0 === e || 0 === t) return 0;
var r = Math.floor((t - e) / 1e3);
return Math.max(0, r);
};
e.prototype.clearCurrentGameTimestamps = function() {
hs.storage.setItem(this.STORAGE_PREFIX + "_CurrentGameStartTime", 0);
hs.storage.setItem(this.STORAGE_PREFIX + "_FirstHardTimestamp", 0);
hs.storage.setItem(this.STORAGE_PREFIX + "_FirstHardRound", 0);
};
e.prototype.setReplayMode = function() {
this._isReplayMode = !0;
};
e.prototype.resetReplayMode = function() {
this._isReplayMode = !1;
};
e.prototype.reset = function() {
hs.storage.setItem(this.STORAGE_PREFIX + "_GameHistory", []);
hs.storage.setItem(this.STORAGE_PREFIX + "_RecommendTime", 0);
hs.storage.setItem(this.STORAGE_PREFIX + "_TotalGameCount", 0);
this.clearCurrentGameTimestamps();
this.resetReplayMode();
};
return e;
}();
r.classNewbieChallengeRecommendInfo = new n();
cc._RF.pop();
}, {} ],
ClassNewbieChallengeRecommendTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "61732EsIRZG4KboYdPbIr0z", "ClassNewbieChallengeRecommendTrait");
var n, o = this && this.__extends || (n = function(e, t) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
n(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), a = this && this.__decorate || function(e, t, r, n) {
var o, a = arguments.length, s = a < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, r) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, n); else for (var i = e.length - 1; i >= 0; i--) (o = e[i]) && (s = (a < 3 ? o(s) : a > 3 ? o(t, r, s) : o(t, r)) || s);
return a > 3 && s && Object.defineProperty(t, r, s), s;
}, s = this && this.__awaiter || function(e, t, r, n) {
return new (r || (r = Promise))(function(o, a) {
function s(e) {
try {
l(n.next(e));
} catch (e) {
a(e);
}
}
function i(e) {
try {
l(n.throw(e));
} catch (e) {
a(e);
}
}
function l(e) {
e.done ? o(e.value) : (t = e.value, t instanceof r ? t : new r(function(e) {
e(t);
})).then(s, i);
var t;
}
l((n = n.apply(e, t || [])).next());
});
}, i = this && this.__generator || function(e, t) {
var r, n, o, a, s = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
},
trys: [],
ops: []
};
return a = {
next: i(0),
throw: i(1),
return: i(2)
}, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
return this;
}), a;
function i(e) {
return function(t) {
return l([ e, t ]);
};
}
function l(a) {
if (r) throw new TypeError("Generator is already executing.");
for (;s; ) try {
if (r = 1, n && (o = 2 & a[0] ? n.return : a[0] ? n.throw || ((o = n.return) && o.call(n), 
0) : n.next) && !(o = o.call(n, a[1])).done) return o;
(n = 0, o) && (a = [ 2 & a[0], o.value ]);
switch (a[0]) {
case 0:
case 1:
o = a;
break;

case 4:
s.label++;
return {
value: a[1],
done: !1
};

case 5:
s.label++;
n = a[1];
a = [ 0 ];
continue;

case 7:
a = s.ops.pop();
s.trys.pop();
continue;

default:
if (!(o = s.trys, o = o.length > 0 && o[o.length - 1]) && (6 === a[0] || 2 === a[0])) {
s = 0;
continue;
}
if (3 === a[0] && (!o || a[1] > o[0] && a[1] < o[3])) {
s.label = a[1];
break;
}
if (6 === a[0] && s.label < o[1]) {
s.label = o[1];
o = a;
break;
}
if (o && s.label < o[2]) {
s.label = o[2];
s.ops.push(a);
break;
}
o[2] && s.ops.pop();
s.trys.pop();
continue;
}
a = t.call(e, s);
} catch (e) {
a = [ 6, e ];
n = 0;
} finally {
r = o = 0;
}
if (5 & a[0]) throw a[1];
return {
value: a[0] ? a[1] : void 0,
done: !0
};
}
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ClassNewbieChallengeRecommendTrait = void 0;
var l = e("../vo/ClassNewbieChallengeRecommendInfo"), c = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.HTTP_URL = "https://ai-robot-hub.afafb.com/infer/v1/block_user_hard_newuser_v1";
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassAlgorithmLifeCycle_GameOver_Proxy",
methodName: "updateGameOverPreDataClear"
}, {
className: "ClassGame_Proxy",
methodName: "onGameStart"
}, {
className: "IsPuzzleTimeTrait",
methodName: "firstPuzzleTimeCall"
}, {
className: "ClassGame_Replay_Proxy",
methodName: "onGameReplay"
} ];
};
t.prototype.onActive = function(e) {
var t, r;
hs.tp.isClassGame_Replay_ProxyOnGameReplay(e) && l.classNewbieChallengeRecommendInfo.setReplayMode();
if (l.classNewbieChallengeRecommendInfo.shouldContinueTracking) {
hs.tp.isClassGame_ProxyOnGameStart(e) && (null === (r = null === (t = e.args[0]) || void 0 === t ? void 0 : t.data) || void 0 === r ? void 0 : r.newGame) && this.onGameReady();
hs.tp.isIsPuzzleTimeTraitFirstPuzzleTimeCall(e) && this.onPuzzleTimeTriggered();
hs.tp.isClassAlgorithmStrategy_Reset_ProxyPreprocessing_PuzzleTime(e) && this.applyRecommendedTime();
if (hs.tp.isClassAlgorithmLifeCycle_GameOver_ProxyUpdateGameOverPreDataClear(e)) {
if (e.args[0]) {
l.classNewbieChallengeRecommendInfo.clearCurrentGameTimestamps();
return;
}
l.classNewbieChallengeRecommendInfo.resetReplayMode();
var n = this.collectCurrentGameData();
if (!n) {
l.classNewbieChallengeRecommendInfo.clearCurrentGameTimestamps();
return;
}
l.classNewbieChallengeRecommendInfo.addGameData(n);
l.classNewbieChallengeRecommendInfo.clearCurrentGameTimestamps();
if (!l.classNewbieChallengeRecommendInfo.shouldRequest) return;
this.sendHttpRequest();
}
}
};
t.prototype.onGameReady = function() {
l.classNewbieChallengeRecommendInfo.isReplayMode || l.classNewbieChallengeRecommendInfo.recordGameStartTime();
};
t.prototype.onPuzzleTimeTriggered = function() {
if (l.classNewbieChallengeRecommendInfo.isReplayMode) ; else {
l.classNewbieChallengeRecommendInfo.recordFirstHardRound();
l.classNewbieChallengeRecommendInfo.recordFirstHardTimestamp();
}
};
t.prototype.applyRecommendedTime = function() {
return s(this, void 0, Promise, function() {
var e, t;
return i(this, function() {
if (l.classNewbieChallengeRecommendInfo.isReplayMode) return [ 2 ];
e = l.classNewbieChallengeRecommendInfo.recommendedHardTime;
if (l.classNewbieChallengeRecommendInfo.shouldApplyRecommendedTime && (t = TRAIT("IsPuzzleTimeTrait")) && t.state) {
t.state.puzzleTimeFirst;
t.state.puzzleTimeFirst = e;
}
return [ 2 ];
});
});
};
t.prototype.collectCurrentGameData = function() {
try {
var e = hs.classGameInfo.gameNum, t = hs.classGameInfo.roundNum, r = hs.classScoreInfo.score, n = hs.classDataStatisticsTimeInfo.gameStartTime, o = new Date().getTime(), a = Math.floor((o - n) / 1e3), s = l.classNewbieChallengeRecommendInfo.firstHardRound, i = l.classNewbieChallengeRecommendInfo.calculateFirstHardTime(), c = i > 0;
if (!c) {
i = a;
s = t;
}
var m = this.getDeadRecType();
c || (m = -1);
return {
game_id: e,
time: a,
first_hard_time: i,
first_hard_round: s,
round_id: t,
dead_rec: m,
score: r
};
} catch (e) {
return null;
}
};
t.prototype.getDeadRecType = function() {
var e, t = hs.classAlgorithmName.algoActualId, r = null === (e = hs.classSolveDiffChallengeIOSInfo) || void 0 === e ? void 0 : e.getAlgorithmStrategy;
if (!r) return -1;
for (var n = 1; n <= 100; n++) {
var o = r(n);
if (!o) break;
if (o.algorithmId && o.algorithmId[0] === t) return n;
}
return -1;
};
t.prototype.sendHttpRequest = function() {
var e;
return s(this, void 0, Promise, function() {
var t, r, n, o;
return i(this, function(a) {
switch (a.label) {
case 0:
t = (null === (e = this.props) || void 0 === e ? void 0 : e.req_type) || "gp_user_new_5_game_time_1_1";
r = hs.traitServerRequestInfo.uid;
n = l.classNewbieChallengeRecommendInfo.buildRequestData(t, "gp", r);
a.label = 1;

case 1:
a.trys.push([ 1, 3, , 4 ]);
return [ 4, hs.http.requestAsync(this.HTTP_URL, n, {
type: hs.HttpType.POST,
contentType: "application/x-www-form-urlencoded",
crypto: hs.UrlCrypto
}) ];

case 2:
o = a.sent();
this.handleServerResponse(o, t);
return [ 3, 4 ];

case 3:
a.sent();
return [ 3, 4 ];

case 4:
return [ 2 ];
}
});
});
};
t.prototype.handleServerResponse = function(e, t) {
var r;
if (e && 0 === e.code) {
var n = null === (r = e[t]) || void 0 === r ? void 0 : r.first_hard_time;
"number" == typeof n && n > 0 && l.classNewbieChallengeRecommendInfo.updateRecommendedHardTime(n);
}
};
return a([ classId("ClassNewbieChallengeRecommendTrait"), classMethodWatch() ], t);
}(Trait);
r.ClassNewbieChallengeRecommendTrait = c;
cc._RF.pop();
}, {
"../vo/ClassNewbieChallengeRecommendInfo": "ClassNewbieChallengeRecommendInfo"
} ]
}, {}, [ "ClassNewbieChallengeRecommendTrait", "ClassNewbieChallengeRecommendInfo" ]);
//# sourceMappingURL=index.js.map
