window.__require = function t(e, r, o) {
function i(n, s) {
if (!r[n]) {
if (!e[n]) {
var l = n.split("/");
l = l[l.length - 1];
if (!e[l]) {
var c = "function" == typeof __require && __require;
if (!s && c) return c(l, !0);
if (a) return a(l, !0);
throw new Error("Cannot find module '" + n + "'");
}
n = l;
}
var d = r[n] = {
exports: {}
};
e[n][0].call(d.exports, function(t) {
return i(e[n][1][t] || t);
}, d, d.exports, t, e, r, o);
}
return r[n].exports;
}
for (var a = "function" == typeof __require && __require, n = 0; n < o.length; n++) i(o[n]);
return i;
}({
SlowPacedUserInitBoardTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "96958mSOBJJ0KdOOsbpo+2z", "SlowPacedUserInitBoardTrait");
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
var i, a = arguments.length, n = a < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(t, e, r, o); else for (var s = t.length - 1; s >= 0; s--) (i = t[s]) && (n = (a < 3 ? i(n) : a > 3 ? i(e, r, n) : i(e, r)) || n);
return a > 3 && n && Object.defineProperty(e, r, n), n;
}, n = this && this.__values || function(t) {
var e = "function" == typeof Symbol && Symbol.iterator, r = e && t[e], o = 0;
if (r) return r.call(t);
if (t && "number" == typeof t.length) return {
next: function() {
t && o >= t.length && (t = void 0);
return {
value: t && t[o++],
done: !t
};
}
};
throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.SlowPacedUserInitBoardTrait = void 0;
var s = function(t) {
i(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.data = function() {
return {
dailyRecord: {},
lastSpendTime: 0,
lastTime: 0
};
};
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassBlocksProducer_Proxy",
methodName: "onTouchEnd"
} ];
};
e.prototype.onCreate = function() {
this.loadLocalData();
};
e.prototype.onActive = function(t) {
var e, r;
if (hs.tp.isClassDefaultBoard_ProxyTriggerSpecialTrait(t)) {
var o = this.currentDayZoneTime();
this.state.dailyRecord[o].opGameNum++;
if (this.isSlowPacedUser()) {
t.args[0] = hs.boardInfo.NULL;
t.returnState = !0;
this.state.lastTime = 0;
this.state.lastSpendTime = hs.classTimerInfo.spendTime;
}
this.saveLocalData();
}
if (hs.tp.isClassBlocksProducer_ProxyOnTouchEnd(t)) {
o = this.currentDayZoneTime();
var i = null === (r = null === (e = t.args[0]) || void 0 === e ? void 0 : e.state) || void 0 === r ? void 0 : r.touchIndex;
if (this.needRecord(i)) {
var a = hs.classTimerInfo.spendTime - this.state.lastSpendTime;
a <= 0 && ((a = Date.now() - this.state.lastTime) <= 0 || a > 2e3) && (a = 2e3);
this.state.dailyRecord[o].opTime += a;
this.state.dailyRecord[o].opCount++;
}
this.state.lastTime = Date.now();
this.state.lastSpendTime = hs.classTimerInfo.spendTime;
this.saveLocalData();
}
};
e.prototype.currentDayZoneTime = function() {
var t = new Date().setHours(0, 0, 0, 0);
if (!this.state.dailyRecord[t]) {
this.state.dailyRecord[t] = {
opTime: 0,
opCount: 0,
opGameNum: 0
};
this.state.lastTime = 0;
var e = Object.keys(this.state.dailyRecord);
if (e.length > 7) {
var r = e.map(function(t) {
return Number(t);
});
r.sort(function(t, e) {
return t - e;
});
var o = r[0];
delete this.state.dailyRecord[o];
}
}
return t;
};
e.prototype.isSlowPacedUser = function() {
var t, e, r = this.state.dailyRecord, o = Object.keys(r);
if (0 == o.length) return !1;
var i = this.props.dayLimit ? this.props.dayLimit : 0;
if (i > 0 && o.length < i) return !1;
var a = this.props.gameLimit ? this.props.gameLimit : 0;
if (a > 0) {
var s = 0;
try {
for (var l = n(o), c = l.next(); !c.done; c = l.next()) r[f = c.value] && (s += r[f].opGameNum);
} catch (e) {
t = {
error: e
};
} finally {
try {
c && !c.done && (e = l.return) && e.call(l);
} finally {
if (t) throw t.error;
}
}
if (s < a) return !1;
}
for (var d = 0, u = 0, p = 0; p < o.length; p++) {
var f, h = r[f = Number(o[p])];
u += h.opTime;
d += h.opCount;
}
return (d > 0 ? u / d : 0) > 1e3 * this.props.avgStepTime;
};
e.prototype.needRecord = function(t) {
if (hs.boardInfo.isNullBoard()) ; else if (!(hs.binarySupport.getWeightValue(hs.boardInfo.faceBlocks) < this.props.boardWeightLimit)) return !1;
var e = !1, r = hs.algorithmName.algoActualName;
r && r.length > 0 && t >= 0 && t < r.length && (e = r[t] === hs.OFFER_TYPE_STRINGS[hs.OFFER_TYPE.TIAN_KONG_XIAO_CHU]);
return e;
};
e.prototype.loadLocalData = function() {
var t = storage.getItem("SlowPacedUserInitBoardTraitKey", {
dailyRecord: {},
lastTime: 0
});
if (t) {
this.state.dailyRecord = t.dailyRecord;
this.state.lastTime = t.lastTime;
} else {
this.state.dailyRecord = {};
this.state.lastTime = 0;
}
};
e.prototype.saveLocalData = function() {
storage.setItem("SlowPacedUserInitBoardTraitKey", this.state);
};
return a([ classId("SlowPacedUserInitBoardTrait") ], e);
}(Trait);
r.SlowPacedUserInitBoardTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "SlowPacedUserInitBoardTrait" ]);
//# sourceMappingURL=index.js.map
