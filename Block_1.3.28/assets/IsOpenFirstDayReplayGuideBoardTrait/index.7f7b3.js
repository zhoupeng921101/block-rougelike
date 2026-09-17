window.__require = function t(e, r, i) {
function o(a, n) {
if (!r[a]) {
if (!e[a]) {
var l = a.split("/");
l = l[l.length - 1];
if (!e[l]) {
var p = "function" == typeof __require && __require;
if (!n && p) return p(l, !0);
if (s) return s(l, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = l;
}
var u = r[a] = {
exports: {}
};
e[a][0].call(u.exports, function(t) {
return o(e[a][1][t] || t);
}, u, u.exports, t, e, r, i);
}
return r[a].exports;
}
for (var s = "function" == typeof __require && __require, a = 0; a < i.length; a++) o(i[a]);
return o;
}({
IsOpenFirstDayReplayGuideBoardTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "d4747SrPypMy7H/qGjl2x5m", "IsOpenFirstDayReplayGuideBoardTrait");
var i, o = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
})(t, e);
}, function(t, e) {
i(t, e);
function r() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
}), s = this && this.__decorate || function(t, e, r, i) {
var o, s = arguments.length, a = s < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, r) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, r, i); else for (var n = t.length - 1; n >= 0; n--) (o = t[n]) && (a = (s < 3 ? o(a) : s > 3 ? o(e, r, a) : o(e, r)) || a);
return s > 3 && a && Object.defineProperty(e, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.IsOpenFirstDayReplayGuideBoardTrait = void 0;
var a = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.INIT_BOARD = [ [ -1, -1, -1, 5, 5, -1, -1, -1 ], [ -1, -1, -1, 5, 5, -1, -1, -1 ], [ -1, -1, -1, 2, 2, -1, -1, -1 ], [ 5, 5, 2, -1, -1, 2, 5, 5 ], [ 5, 5, 2, -1, -1, 2, 5, 5 ], [ -1, -1, -1, 2, 2, -1, -1, -1 ], [ -1, -1, -1, 5, 5, -1, -1, -1 ], [ -1, -1, -1, 5, 5, -1, -1, -1 ] ];
e._isReplay = !1;
e.producerBlocks = [ -1, 9, -1 ];
e.blocksColors = [ 1, 1, 1 ];
e.isReplaceBoard = !1;
return e;
}
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "AlgorithmStrategyInfo",
methodName: "algorithmComplete"
} ];
};
e.prototype.onActive = function(t) {
if (hs.tp.isClassDefaultBoard_ProxyTriggerSpecialTrait(t)) {
if (this.diableThisTrait()) return;
storage.setItem("firstDayReplayGuideBoardNeedStop", !1);
this.isReplaceBoard = !1;
if (!this.timeCheck()) return;
if (this._isReplay) {
storage.setItem("firstDayReplayGuideBoardNeedStop", !0);
this.isReplaceBoard = !0;
t.args[0] = this.getInitBoard();
this.doReplace();
}
}
if (hs.tp.isClassDefaultBoard_ProxyOnGameReplayReady(t)) {
if (!this.timeCheck()) return;
if (this.diableThisTrait()) return;
this._isReplay = !0;
}
if (hs.tp.isClassDefaultBoard_ProxyProduceDefaultBoardTurnAround(t)) {
if (this.diableThisTrait()) return;
this.isReplaceBoard && (t.returnState = !0);
}
if (hs.tp.isClassBlocksProducer_ProxyBeforeBlocksProducerUpdate(t)) {
if (this.diableThisTrait()) return;
if (!this.timeCheck()) return;
if (this._isReplay) {
var e = t.args[0], r = t.args[1], i = this.getBlocksColors(), o = this.getProducerBlocks();
storage.setItem("classColorLists", i);
storage.setItem("classProducerBlocks", o);
i.forEach(function(t, e) {
r[e] = t;
});
o.forEach(function(t, r) {
e[r] = t;
});
this._isReplay = !1;
}
}
if (hs.tp.isAlgorithmStrategyInfoAlgorithmComplete(t)) {
if (hs.gameInfo.gameMode !== hs.GameMode.Class) return;
if (!this.timeCheck()) return;
if (this.diableThisTrait()) return;
if (this._isReplay) {
hs.algorithmInfo.setBlockIdList(this.getProducerBlocks());
t.returnState = !0;
}
}
if (hs.tp.isComboAddRemoveNumTraitIsStop(t)) {
if (!this.timeCheck()) return;
if (this.diableThisTrait()) return;
if (storage.getItem("firstDayReplayGuideBoardNeedStop", !1)) {
t.args[0] = !0;
storage.setItem("firstDayReplayGuideBoardNeedStop", !1);
}
}
};
e.prototype.getInitBoard = function() {
return this.INIT_BOARD;
};
e.prototype.getProducerBlocks = function() {
return this.producerBlocks;
};
e.prototype.getBlocksColors = function() {
return this.blocksColors;
};
e.prototype.diableThisTrait = function() {
return !1;
};
e.prototype.timeCheck = function() {
var t = storage.getItem("firstEntryTime", 0);
return this.isToday(t);
};
e.prototype.isToday = function(t) {
var e = new Date(t), r = new Date();
return e.getFullYear() === r.getFullYear() && e.getMonth() === r.getMonth() && e.getDate() === r.getDate();
};
e.prototype.setIsReplay = function(t) {
this._isReplay = t;
};
e.prototype.doReplace = function() {};
return s([ classId("IsOpenFirstDayReplayGuideBoardTrait"), classMethodWatch() ], e);
}(Trait);
r.IsOpenFirstDayReplayGuideBoardTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "IsOpenFirstDayReplayGuideBoardTrait" ]);
//# sourceMappingURL=index.js.map
