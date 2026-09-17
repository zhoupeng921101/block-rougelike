window.__require = function t(a, r, e) {
function s(i, n) {
if (!r[i]) {
if (!a[i]) {
var l = i.split("/");
l = l[l.length - 1];
if (!a[l]) {
var u = "function" == typeof __require && __require;
if (!n && u) return u(l, !0);
if (o) return o(l, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = l;
}
var d = r[i] = {
exports: {}
};
a[i][0].call(d.exports, function(t) {
return s(a[i][1][t] || t);
}, d, d.exports, t, a, r, e);
}
return r[i].exports;
}
for (var o = "function" == typeof __require && __require, i = 0; i < e.length; i++) s(e[i]);
return s;
}({
ClassStartBoardTrait: [ function(t, a, r) {
"use strict";
cc._RF.push(a, "2d35by7v8FBEoLou6jbD67H", "ClassStartBoardTrait");
var e, s, o = this && this.__extends || (e = function(t, a) {
return (e = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, a) {
t.__proto__ = a;
} || function(t, a) {
for (var r in a) Object.prototype.hasOwnProperty.call(a, r) && (t[r] = a[r]);
})(t, a);
}, function(t, a) {
e(t, a);
function r() {
this.constructor = t;
}
t.prototype = null === a ? Object.create(a) : (r.prototype = a.prototype, new r());
}), i = this && this.__decorate || function(t, a, r, e) {
var s, o = arguments.length, i = o < 3 ? a : null === e ? e = Object.getOwnPropertyDescriptor(a, r) : e;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(t, a, r, e); else for (var n = t.length - 1; n >= 0; n--) (s = t[n]) && (i = (o < 3 ? s(i) : o > 3 ? s(a, r, i) : s(a, r)) || i);
return o > 3 && i && Object.defineProperty(a, r, i), i;
}, n = this && this.__read || function(t, a) {
var r = "function" == typeof Symbol && t[Symbol.iterator];
if (!r) return t;
var e, s, o = r.call(t), i = [];
try {
for (;(void 0 === a || a-- > 0) && !(e = o.next()).done; ) i.push(e.value);
} catch (t) {
s = {
error: t
};
} finally {
try {
e && !e.done && (r = o.return) && r.call(o);
} finally {
if (s) throw s.error;
}
}
return i;
}, l = this && this.__spread || function() {
for (var t = [], a = 0; a < arguments.length; a++) t = t.concat(n(arguments[a]));
return t;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ClassStartBoardTrait = void 0;
(function(t) {
t[t.TYPE_5_DYNAMIC_DIFFICULTY = 5] = "TYPE_5_DYNAMIC_DIFFICULTY";
t[t.TYPE_4_DAILY_FIRST_HIGH_DIFFICULTY = 4] = "TYPE_4_DAILY_FIRST_HIGH_DIFFICULTY";
t[t.TYPE_3_DEATH_ROUND_LESS_THAN_5 = 3] = "TYPE_3_DEATH_ROUND_LESS_THAN_5";
t[t.TYPE_2_DEATH_ROUND_LESS_THAN_6_10 = 2] = "TYPE_2_DEATH_ROUND_LESS_THAN_6_10";
t[t.TYPE_1_DEATH_ROUND_LESS_THAN_10 = 1] = "TYPE_1_DEATH_ROUND_LESS_THAN_10";
})(s || (s = {}));
var u = function(t) {
o(a, t);
function a() {
var a = null !== t && t.apply(this, arguments) || this;
a.dataJsonPath = "https://ucw.afafb.com/bbios/init_matrix_support";
a.dataJson = [];
a._classStartBoardData = null;
a.lastLastFailRound = 0;
a._useBoard = !1;
return a;
}
a.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassGame_Replay_Proxy",
methodName: "onGameReplay"
}, {
className: "ClassDefaultBoard_Proxy",
methodName: "onGameOverPre"
} ];
};
a.prototype.onActive = function(t) {
if (hs.tp.isClassDefaultBoard_ProxyProduceDefaultBoard(t)) {
this.loadData();
this._useBoard = !1;
var a = this.getStartBoard();
if (-1 !== a.boardId) {
a.faceBlocks.length > 0 && (t.args[0] = a.faceBlocks);
storage.setItem("classDefaultBoardInfo", {
boardIndex: a.boardId - 1,
boardSource: hs.DEFAULT_SOURCE_TYPE.DEFAULT
});
t.returnState = !0;
}
}
hs.tp.isClassDefaultBoard_ProxyProduceDefaultBoardTurnAround(t) && this._useBoard && (t.returnState = !0);
hs.tp.isClassGame_Replay_ProxyOnGameReplay(t) && this.setBeforeGameReplay();
hs.tp.isClassDefaultBoard_ProxyOnGameOverPre(t) && this.setBeforeGameFailRunNum();
};
a.prototype.getStartBoard = function() {
var t, a = {
faceBlocks: [],
boardId: -1
};
if (!this.dataJson || this.dataJson.length <= 0 || this.props.percentileList.length <= 0) return a;
if (this.classStartBoardData.replayGameNum === hs.classGameInfo.gameNum - 1) return a;
if (hs.classGameInfo.gameNum <= 1) return a;
var r = this.percentileIndex;
if (-1 === r || this.props.percentileList.length <= r) return a;
for (var e = this.props.percentileList[r], s = "p" + e, o = null, i = 0; i < this.dataJson.length; i++) {
var n = this.dataJson[i];
if (n.percentile === s) {
o = n.rno_list;
break;
}
}
if (!o || o.length <= 0) return a;
var l = o[Math.floor(Math.random() * o.length)];
if (!l) return a;
if ("" + this.classStartBoardData.boardPre == "" + s) for (;this.classStartBoardData.boardNum === l.rno && o.length > 1; ) l = o[Math.floor(Math.random() * o.length)];
if (!l.init_matrix_info || !l.init_matrix_info.init_matrix) return a;
this._useBoard = !0;
a.faceBlocks = null !== (t = JSON.parse(l.init_matrix_info.init_matrix)) && void 0 !== t ? t : [];
a.boardId = parseInt("" + l.init_matrix_info.init_id);
var u = e.split("-")[1];
this.setBeforeGameFailRunNumByDataJson(l.rno, "" + u, a.boardId, hs.classGameInfo.gameNum);
return a;
};
Object.defineProperty(a.prototype, "percentileIndex", {
get: function() {
var t = -1, a = this.classStartBoardData.failRunNum, r = this.classStartBoardData.lastFailRound;
if (this.props.type === s.TYPE_5_DYNAMIC_DIFFICULTY) t = a <= 5 ? 0 : a >= 45 ? 1 : -1; else if (this.props.type === s.TYPE_4_DAILY_FIRST_HIGH_DIFFICULTY) hs.isSameDate(this.classStartBoardData.triggerTime, Date.now()) || (t = 0); else if (this.props.type === s.TYPE_3_DEATH_ROUND_LESS_THAN_5) a <= 5 && (t = r <= 5 ? 0 : r >= 45 ? 1 : -1); else for (var e = 0; e < this.props.failRunNumList.length; e++) {
var o = this.props.failRunNumList[e].split("-"), i = parseInt(o[0]), n = parseInt(o[1]);
if (a >= i && a <= n) {
t = e;
break;
}
}
return t;
},
enumerable: !1,
configurable: !0
});
a.prototype.loadData = function() {
var t = this;
if (!(this.dataJson.length > 0)) {
this.dataJson = [];
for (var a = function(a) {
var e = r.props.percentileList[a], s = r.dataJsonPath + "_p" + e + ".json?" + Date.now();
hs.ResLoader.load(s, cc.JsonAsset, function(a, r) {
var e;
if (a) ; else {
var s = r.json;
(e = t.dataJson).push.apply(e, l(s));
}
});
}, r = this, e = 0; e < this.props.percentileList.length; e++) a(e);
}
};
a.prototype.setBeforeGameFailRunNum = function() {
var t;
this.lastLastFailRound = this.classStartBoardData.lastFailRound;
this.classStartBoardData.lastFailRound = this.classStartBoardData.failRunNum;
this.classStartBoardData.failRunNum = null !== (t = hs.classGameInfo.roundNum) && void 0 !== t ? t : 0;
this.saveData();
};
a.prototype.setBeforeGameFailRunNumByDataJson = function(t, a, r, e) {
this.classStartBoardData.boardId = r;
this.classStartBoardData.boardPre = a;
this.classStartBoardData.boardNum = t;
this.classStartBoardData.gameOkNum = e;
this.classStartBoardData.triggerTime = Date.now();
this.saveData();
};
Object.defineProperty(a.prototype, "classStartBoardData", {
get: function() {
this._classStartBoardData || (this._classStartBoardData = hs.storage.getItem("ClassStartBoardControlKey", {
failRunNum: 0,
boardNum: 0,
boardPre: "",
gameOkNum: 0,
boardId: 0
}));
return this._classStartBoardData;
},
enumerable: !1,
configurable: !0
});
a.prototype.saveData = function() {
hs.storage.setItem("ClassStartBoardControlKey", this.classStartBoardData);
};
a.prototype.setBeforeGameReplay = function() {
this.classStartBoardData.replayGameNum = hs.classGameInfo.gameNum;
this.saveData();
};
a.prototype.getEventUsrDataGameEnd = function() {
var t, a, r, e = {}, s = this.classStartBoardData;
hs.classGameInfo.gameNum === s.gameOkNum ? e.initial_quantile = s.boardPre : e.initial_quantile = "";
e.pre_round = null !== (t = this.classStartBoardData.lastFailRound) && void 0 !== t ? t : 0;
e.pre_pre_round = null !== (a = this.lastLastFailRound) && void 0 !== a ? a : 0;
e.quantile = Number(null !== (r = e.initial_quantile) && void 0 !== r ? r : 0);
if (hs.classGameInfo.gameNum <= 1) return e;
if (hs.classGameInfo.gameNum === this.classStartBoardData.gameOkNum) return e;
e.deadBoard = this.classStartBoardData.boardId;
return e;
};
return i([ classId("ClassStartBoardTrait") ], a);
}(Trait);
r.ClassStartBoardTrait = u;
cc._RF.pop();
}, {} ]
}, {}, [ "ClassStartBoardTrait" ]);
//# sourceMappingURL=index.js.map
