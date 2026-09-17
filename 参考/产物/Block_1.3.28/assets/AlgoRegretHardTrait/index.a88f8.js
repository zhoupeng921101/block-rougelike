window.__require = function t(r, e, o) {
function n(a, l) {
if (!e[a]) {
if (!r[a]) {
var s = a.split("/");
s = s[s.length - 1];
if (!r[s]) {
var u = "function" == typeof __require && __require;
if (!l && u) return u(s, !0);
if (i) return i(s, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = s;
}
var c = e[a] = {
exports: {}
};
r[a][0].call(c.exports, function(t) {
return n(r[a][1][t] || t);
}, c, c.exports, t, r, e, o);
}
return e[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < o.length; a++) n(o[a]);
return n;
}({
AlgoRegretHardTrait: [ function(t, r, e) {
"use strict";
cc._RF.push(r, "9baf31d4UxNILx8b3xKOisc", "AlgoRegretHardTrait");
var o, n = this && this.__extends || (o = function(t, r) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, r) {
t.__proto__ = r;
} || function(t, r) {
for (var e in r) Object.prototype.hasOwnProperty.call(r, e) && (t[e] = r[e]);
})(t, r);
}, function(t, r) {
o(t, r);
function e() {
this.constructor = t;
}
t.prototype = null === r ? Object.create(r) : (e.prototype = r.prototype, new e());
}), i = this && this.__decorate || function(t, r, e, o) {
var n, i = arguments.length, a = i < 3 ? r : null === o ? o = Object.getOwnPropertyDescriptor(r, e) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, r, e, o); else for (var l = t.length - 1; l >= 0; l--) (n = t[l]) && (a = (i < 3 ? n(a) : i > 3 ? n(r, e, a) : n(r, e)) || a);
return i > 3 && a && Object.defineProperty(r, e, a), a;
}, a = this && this.__values || function(t) {
var r = "function" == typeof Symbol && Symbol.iterator, e = r && t[r], o = 0;
if (e) return e.call(t);
if (t && "number" == typeof t.length) return {
next: function() {
t && o >= t.length && (t = void 0);
return {
value: t && t[o++],
done: !t
};
}
};
throw new TypeError(r ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, l = this && this.__read || function(t, r) {
var e = "function" == typeof Symbol && t[Symbol.iterator];
if (!e) return t;
var o, n, i = e.call(t), a = [];
try {
for (;(void 0 === r || r-- > 0) && !(o = i.next()).done; ) a.push(o.value);
} catch (t) {
n = {
error: t
};
} finally {
try {
o && !o.done && (e = i.return) && e.call(i);
} finally {
if (n) throw n.error;
}
}
return a;
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.AlgoRegretHardTrait = void 0;
var s = function(t) {
n(r, t);
function r() {
return null !== t && t.apply(this, arguments) || this;
}
r.prototype.onActive = function(t) {
hs.tp.isClassAlgorithmLifeCycle_GameStart_ProxyOnGameStart(t) && this.onGameStart(t);
hs.tp.isClassAlgorithmStrategy_Condition_ProxyOnAlgorithmStrategyCondition(t) && this.onAlgorithmStrategyCondition();
};
r.prototype.onGameStart = function(t) {
var r, e = t.args[0];
(null === (r = null == e ? void 0 : e.data) || void 0 === r ? void 0 : r.newGame) && hs.storage.setItem("AlgoRegretHard", []);
};
r.prototype.onAlgorithmStrategyCondition = function() {
var t, r, e, o, n = null !== (e = hs.storage.getItem("AlgoRegretHard", [])) && void 0 !== e ? e : [];
n.push({
round: hs.classGameInfo.roundNum,
canPut: this.canPut13()
});
var i = new Map();
try {
for (var l = a(n), s = l.next(); !s.done; s = l.next()) {
var u = s.value;
i.set(u.round, u);
}
} catch (r) {
t = {
error: r
};
} finally {
try {
s && !s.done && (r = l.return) && r.call(l);
} finally {
if (t) throw t.error;
}
}
var c = Array.from(i.values());
c.length > 2 && c.splice(0, c.length - 2);
hs.storage.setItem("AlgoRegretHard", c);
if (this.shouldTriggerRegretLogic(c)) {
hs.algorithmStrategyInfo.setAlgorithmList([ hs.OFFER_TYPE.INCLUDE_3X3_HARD, hs.OFFER_TYPE.INCLUDE_3X3_INSTINCT, hs.OFFER_TYPE.KUN_NAN_TI ]);
1 === (null === (o = this.props) || void 0 === o ? void 0 : o.down) && hs.algorithmStrategyInfo.setAlgorithmFailList([ hs.OFFER_TYPE.KUN_NAN_TI ]);
}
};
r.prototype.canPut13 = function() {
var t = new hs.BinaryBoard();
t.convertToBinaryBoard(hs.boardInfo.faceBlocks);
return t.canPut(13);
};
r.prototype.shouldTriggerRegretLogic = function(t) {
if (0 == hs.classGameInfo.gameNum || hs.scoreInfo.score <= .3 * hs.scoreInfo.highScore) return !1;
if (t.length < 2) return !1;
var r = l(t, 2), e = r[0], o = r[1];
return o.round - e.round == 1 && o.round === hs.classGameInfo.roundNum && !0 === e.canPut && !1 === o.canPut;
};
return i([ classId("AlgoRegretHardTrait") ], r);
}(Trait);
e.AlgoRegretHardTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "AlgoRegretHardTrait" ]);
//# sourceMappingURL=index.js.map
