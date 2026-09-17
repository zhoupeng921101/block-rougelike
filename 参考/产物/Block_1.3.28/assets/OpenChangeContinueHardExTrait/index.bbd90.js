window.__require = function t(e, r, o) {
function a(n, s) {
if (!r[n]) {
if (!e[n]) {
var l = n.split("/");
l = l[l.length - 1];
if (!e[l]) {
var c = "function" == typeof __require && __require;
if (!s && c) return c(l, !0);
if (i) return i(l, !0);
throw new Error("Cannot find module '" + n + "'");
}
n = l;
}
var u = r[n] = {
exports: {}
};
e[n][0].call(u.exports, function(t) {
return a(e[n][1][t] || t);
}, u, u.exports, t, e, r, o);
}
return r[n].exports;
}
for (var i = "function" == typeof __require && __require, n = 0; n < o.length; n++) a(o[n]);
return a;
}({
BehaviorDrivenAdjustmentStrategy: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "63d614hAO9I55Pjl7xCabMt", "BehaviorDrivenAdjustmentStrategy");
var o, a = this && this.__extends || (o = function(t, e) {
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
}), i = this && this.__decorate || function(t, e, r, o) {
var a, i = arguments.length, n = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(t, e, r, o); else for (var s = t.length - 1; s >= 0; s--) (a = t[s]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, r, n) : a(e, r)) || n);
return i > 3 && n && Object.defineProperty(e, r, n), n;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.BehaviorDrivenAdjustmentStrategy = void 0;
var n = function(t) {
a(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.persistentData = {
startSessionId: null,
lastSession: null,
currentSession: null,
totalRevivePopupCount: 0
};
return e;
}
e.prototype.onCreate = function() {
var t, e = hs.gameInfo.restartTimes;
hs.isUndefinedOrNull(this.persistentData.startSessionId) && (this.persistentData.startSessionId = e);
if ((null === (t = this.persistentData.currentSession) || void 0 === t ? void 0 : t.sessionId) !== e) {
this.persistentData.lastSession = this.persistentData.currentSession;
this.persistentData.currentSession = {
sessionId: e,
sessionGameNum: 0,
sessionRevivePopupCount: 0
};
}
};
e.prototype.onNewGameInit = function() {
this.persistentData.currentSession.sessionGameNum++;
};
e.prototype.onReviveShow = function() {
this.persistentData.totalRevivePopupCount++;
this.persistentData.currentSession.sessionRevivePopupCount++;
};
Object.defineProperty(e.prototype, "totalSessionCount", {
get: function() {
return hs.isUndefinedOrNull(this.persistentData.startSessionId) ? 1 : hs.gameInfo.restartTimes - this.persistentData.startSessionId + 1;
},
enumerable: !1,
configurable: !0
});
e.prototype.getReplaceData = function() {
var t = !1, e = this.props.initialProbability, r = this.persistentData, o = r.lastSession, a = r.currentSession, i = r.totalRevivePopupCount;
if (o && (null == o ? void 0 : o.sessionGameNum) > 0) {
var n = o.sessionGameNum;
if ((n - a.sessionGameNum) / n > this.props.lowRoundRatioThreshold) {
e = this.props.lowRoundAdjustedProbability;
t = !0;
}
}
if (t) ; else {
var s = i / this.totalSessionCount;
s > 0 && (s - a.sessionRevivePopupCount) / s > this.props.lowReviveRateRatioThreshold && (e = this.props.lowReviveRateAdjustedProbability);
}
return {
isReplace: Math.random() < e,
replaceAlgo: this.props.replaceAlgorithm
};
};
i([ hs.storageProperty({
key: "OpenChangeContinueHardExTrait_BehaviorDrivenAdjustmentStrategy"
}) ], e.prototype, "persistentData", void 0);
return e;
}(t("./Strategy").Strategy);
r.BehaviorDrivenAdjustmentStrategy = n;
cc._RF.pop();
}, {
"./Strategy": "Strategy"
} ],
ConditionalProbabilisticReplacementStrategy: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "aec5c/tZxlAvbbvss8vwYvY", "ConditionalProbabilisticReplacementStrategy");
var o, a = this && this.__extends || (o = function(t, e) {
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
});
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ConditionalProbabilisticReplacementStrategy = void 0;
var i, n = t("./Strategy");
(function(t) {
t[t.BeforeRecordBreakOnly = 1] = "BeforeRecordBreakOnly";
})(i || (i = {}));
var s = function(t) {
a(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.getReplaceData = function() {
return this.isValid() ? {
isReplace: Math.random() < this.props.probability,
replaceAlgo: this.props.replaceAlgorithm
} : {
isReplace: !1,
replaceAlgo: hs.OFFER_TYPE.NONE
};
};
e.prototype.isValid = function() {
return !(this.props.conditions.includes(i.BeforeRecordBreakOnly) && hs.scoreInfo.score >= hs.scoreInfo.highScore);
};
return e;
}(n.Strategy);
r.ConditionalProbabilisticReplacementStrategy = s;
cc._RF.pop();
}, {
"./Strategy": "Strategy"
} ],
ConstraintTriggerStrategy: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "4264dna04NMSoin2WZ5CTZ/", "ConstraintTriggerStrategy");
var o, a = this && this.__extends || (o = function(t, e) {
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
}), i = this && this.__decorate || function(t, e, r, o) {
var a, i = arguments.length, n = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(t, e, r, o); else for (var s = t.length - 1; s >= 0; s--) (a = t[s]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, r, n) : a(e, r)) || n);
return i > 3 && n && Object.defineProperty(e, r, n), n;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ConstraintTriggerStrategy = void 0;
var n = function(t) {
a(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.persistentData = {
reviveCount: 0
};
return e;
}
e.prototype.onNewGameInit = function() {
this.persistentData.reviveCount = 0;
};
e.prototype.onReviveShow = function() {
this.persistentData.reviveCount++;
};
e.prototype.getReplaceData = function() {
var t = 0;
hs.binarySupport.getWeightValue(hs.boardInfo.faceBlocks) >= this.props.weightThreshold && t++;
hs.scoreInfo.score < hs.scoreInfo.highScore * this.props.highScoreRatioThreshold && t++;
this.persistentData.reviveCount === this.props.reviveCount && t++;
return t >= 2 ? {
isReplace: !0,
replaceAlgo: this.props.replaceAlgorithm
} : 1 === t ? {
isReplace: Math.random() < this.props.probability,
replaceAlgo: this.props.replaceAlgorithm
} : {
isReplace: !1,
replaceAlgo: hs.OFFER_TYPE.NONE
};
};
i([ hs.storageProperty({
key: "OpenChangeContinueHardExTrait_ConstraintTriggerStrategy"
}) ], e.prototype, "persistentData", void 0);
return e;
}(t("./Strategy").Strategy);
r.ConstraintTriggerStrategy = n;
cc._RF.pop();
}, {
"./Strategy": "Strategy"
} ],
DecayBySolveCountStrategy: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "c9e81iIEZhD/Kbn26lHUjMH", "DecayBySolveCountStrategy");
var o, a = this && this.__extends || (o = function(t, e) {
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
}), i = this && this.__decorate || function(t, e, r, o) {
var a, i = arguments.length, n = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(t, e, r, o); else for (var s = t.length - 1; s >= 0; s--) (a = t[s]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, r, n) : a(e, r)) || n);
return i > 3 && n && Object.defineProperty(e, r, n), n;
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
}, s = this && this.__read || function(t, e) {
var r = "function" == typeof Symbol && t[Symbol.iterator];
if (!r) return t;
var o, a, i = r.call(t), n = [];
try {
for (;(void 0 === e || e-- > 0) && !(o = i.next()).done; ) n.push(o.value);
} catch (t) {
a = {
error: t
};
} finally {
try {
o && !o.done && (r = i.return) && r.call(i);
} finally {
if (a) throw a.error;
}
}
return n;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.DecayBySolveCountStrategy = void 0;
var l = function(t) {
a(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.persistentData = {
solveCount: 0
};
return e;
}
e.prototype.onNewGameInit = function() {
this.persistentData.solveCount = 0;
};
e.prototype.getReplaceData = function() {
var t, e, r, o, a = this.props.algoWeights;
if (!a || 0 === a.length) return {
isReplace: !0,
replaceAlgo: this.props.replaceAlgorithm
};
var i = a[Math.min(this.persistentData.solveCount, a.length - 1)];
if (!i || 0 === i.length) return {
isReplace: !0,
replaceAlgo: this.props.replaceAlgorithm
};
var l = 0;
try {
for (var c = n(i), u = c.next(); !u.done; u = c.next()) l += s(u.value, 2)[1];
} catch (e) {
t = {
error: e
};
} finally {
try {
u && !u.done && (e = c.return) && e.call(c);
} finally {
if (t) throw t.error;
}
}
if (l <= 0) return {
isReplace: !0,
replaceAlgo: this.props.replaceAlgorithm
};
var p = Math.random() * l, h = 0, y = i[0][0];
try {
for (var f = n(i), g = f.next(); !g.done; g = f.next()) {
var v = s(g.value, 2), d = v[0];
if (p < (h += v[1])) {
y = d;
break;
}
}
} catch (t) {
r = {
error: t
};
} finally {
try {
g && !g.done && (o = f.return) && o.call(f);
} finally {
if (r) throw r.error;
}
}
this.persistentData.solveCount++;
return {
isReplace: y != hs.OFFER_TYPE.NONE,
replaceAlgo: y
};
};
i([ hs.storageProperty({
key: "OpenChangeContinueHardExTrait_DecayBySolveCountStrategy"
}) ], e.prototype, "persistentData", void 0);
return e;
}(t("./Strategy").Strategy);
r.DecayBySolveCountStrategy = l;
cc._RF.pop();
}, {
"./Strategy": "Strategy"
} ],
DefaultStrategy: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "84e30tXrRZDsZuqn1Akk7aW", "DefaultStrategy");
var o, a = this && this.__extends || (o = function(t, e) {
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
});
Object.defineProperty(r, "__esModule", {
value: !0
});
r.DefaultStrategy = void 0;
var i = function(t) {
a(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.getReplaceData = function() {
return {
isReplace: !0,
replaceAlgo: this.props.replaceAlgorithm
};
};
return e;
}(t("./Strategy").Strategy);
r.DefaultStrategy = i;
cc._RF.pop();
}, {
"./Strategy": "Strategy"
} ],
LayerByPlayerHistoricalHighScoreStrategy: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "7cffdAenxNJu5EjuAR9Uoof", "LayerByPlayerHistoricalHighScoreStrategy");
var o, a = this && this.__extends || (o = function(t, e) {
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
}), i = this && this.__values || function(t) {
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
r.LayerByPlayerHistoricalHighScoreStrategy = void 0;
var n = function(t) {
a(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.getReplaceData = function() {
var t, e, r = hs.scoreInfo.highScore, o = this.props.scoreThresholds, a = 0;
try {
for (var n = i(o), s = n.next(); !s.done && !(r < s.value); s = n.next()) a++;
} catch (e) {
t = {
error: e
};
} finally {
try {
s && !s.done && (e = n.return) && e.call(n);
} finally {
if (t) throw t.error;
}
}
var l = this.props.probabilities[a];
return {
isReplace: Math.random() < l,
replaceAlgo: this.props.replaceAlgorithm
};
};
return e;
}(t("./Strategy").Strategy);
r.LayerByPlayerHistoricalHighScoreStrategy = n;
cc._RF.pop();
}, {
"./Strategy": "Strategy"
} ],
MultipleQuestionTypesStrategy: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "88162lqdp9A3od+qSzEaMKf", "MultipleQuestionTypesStrategy");
var o, a = this && this.__extends || (o = function(t, e) {
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
}), i = this && this.__values || function(t) {
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
}, n = this && this.__read || function(t, e) {
var r = "function" == typeof Symbol && t[Symbol.iterator];
if (!r) return t;
var o, a, i = r.call(t), n = [];
try {
for (;(void 0 === e || e-- > 0) && !(o = i.next()).done; ) n.push(o.value);
} catch (t) {
a = {
error: t
};
} finally {
try {
o && !o.done && (r = i.return) && r.call(i);
} finally {
if (a) throw a.error;
}
}
return n;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.MultipleQuestionTypesStrategy = void 0;
var s = function(t) {
a(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.getReplaceData = function() {
var t, e, r, o, a, s, l = hs.scoreInfo.highScore, c = this.props.scoreThresholds, u = this.props.algoWeights, p = 0;
try {
for (var h = i(c), y = h.next(); !y.done && !(l < y.value); y = h.next()) p++;
} catch (e) {
t = {
error: e
};
} finally {
try {
y && !y.done && (e = h.return) && e.call(h);
} finally {
if (t) throw t.error;
}
}
var f = u[p], g = 0;
try {
for (var v = i(f), d = v.next(); !d.done; d = v.next()) g += n(d.value, 2)[1];
} catch (t) {
r = {
error: t
};
} finally {
try {
d && !d.done && (o = v.return) && o.call(v);
} finally {
if (r) throw r.error;
}
}
var S = Math.random() * g, m = 0, _ = f[0][0];
try {
for (var b = i(f), R = b.next(); !R.done; R = b.next()) {
var O = n(R.value, 2), P = O[0];
if (S < (m += O[1])) {
_ = P;
break;
}
}
} catch (t) {
a = {
error: t
};
} finally {
try {
R && !R.done && (s = b.return) && s.call(b);
} finally {
if (a) throw a.error;
}
}
return {
isReplace: _ != hs.OFFER_TYPE.NONE,
replaceAlgo: _
};
};
return e;
}(t("./Strategy").Strategy);
r.MultipleQuestionTypesStrategy = s;
cc._RF.pop();
}, {
"./Strategy": "Strategy"
} ],
OpenChangeContinueHardExTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "dd299pT8fZJZ6Zo2SjKX6gY", "OpenChangeContinueHardExTrait");
var o, a = this && this.__extends || (o = function(t, e) {
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
}), i = this && this.__decorate || function(t, e, r, o) {
var a, i = arguments.length, n = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(t, e, r, o); else for (var s = t.length - 1; s >= 0; s--) (a = t[s]) && (n = (i < 3 ? a(n) : i > 3 ? a(e, r, n) : a(e, r)) || n);
return i > 3 && n && Object.defineProperty(e, r, n), n;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.OpenChangeContinueHardExTrait = void 0;
var n, s = t("./strategy/BehaviorDrivenAdjustmentStrategy"), l = t("./strategy/ConditionalProbabilisticReplacementStrategy"), c = t("./strategy/ConstraintTriggerStrategy"), u = t("./strategy/DecayBySolveCountStrategy"), p = t("./strategy/DefaultStrategy"), h = t("./strategy/LayerByPlayerHistoricalHighScoreStrategy"), y = t("./strategy/MultipleQuestionTypesStrategy"), f = t("./strategy/ProbabilisticReplacementStrategy"), g = t("./strategy/WeightedProbabilisticReplacementStrategy");
(function(t) {
t[t.Default = 0] = "Default";
t[t.ProbabilisticReplacement = 1] = "ProbabilisticReplacement";
t[t.MultipleQuestionTypes = 2] = "MultipleQuestionTypes";
t[t.BehaviorDrivenAdjustment = 3] = "BehaviorDrivenAdjustment";
t[t.ConstraintTrigger = 4] = "ConstraintTrigger";
t[t.LayerByPlayerHistoricalHighScore = 5] = "LayerByPlayerHistoricalHighScore";
t[t.DecayBySolveCount = 6] = "DecayBySolveCount";
t[t.WeightedProbabilisticReplacement = 7] = "WeightedProbabilisticReplacement";
t[t.ConditionalProbabilisticReplacement = 8] = "ConditionalProbabilisticReplacement";
})(n || (n = {}));
var v = function(t) {
a(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.isLoadLocalData = !1;
e.localData = {};
e.isTkXiaoChuSuccess = !1;
return e;
}
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassRevive_Proxy",
methodName: "onShowReviveView"
}, {
className: "ClassRevive_Proxy",
methodName: "onRevive_Success"
} ];
};
e.prototype.onCreate = function() {
this.createStrategy();
};
e.prototype.data = function() {
if (!this.isLoadLocalData) {
this.loadLocalData();
this.isLoadLocalData = !0;
}
return this.localData;
};
Object.defineProperty(e.prototype, "consecutiveTimes", {
get: function() {
return hs.traitConfigSafePropsInfo.getSafePropValueByKey(this.traitName, "consecutiveTimes", this.props, 2);
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "replaceAlgorithm", {
get: function() {
return hs.traitConfigSafePropsInfo.getSafePropValueByKey(this.traitName, "replaceAlgorithm", this.props, hs.OFFER_TYPE.TRAVEL_TIAN_KONG_XIAO_CHU);
},
enumerable: !1,
configurable: !0
});
e.prototype.onActive = function(t) {
var e, r, o, a, i, n, s;
if (hs.gameInfo.gameMode == hs.GameMode.Class) {
hs.tp.isClassRevive_ProxyOnShowReviveView(t) && (null === (r = null === (e = this.strategy) || void 0 === e ? void 0 : e.onReviveShow) || void 0 === r || r.call(e));
hs.tp.isClassRevive_ProxyOnRevive_Success(t) && (null === (a = null === (o = this.strategy) || void 0 === o ? void 0 : o.onReviveSuccess) || void 0 === a || a.call(o));
if (hs.tp.isClassGame_ProxyNewGameInit(t)) {
var l = hs.storage.getItem("classGameNum", 0);
this.state.gameNum = l;
this.state.lastRoundNum = null;
this.state.hardSuccessContinueNum = 0;
this.saveLocalData();
null === (n = null === (i = this.strategy) || void 0 === i ? void 0 : i.onNewGameInit) || void 0 === n || n.call(i);
}
if (hs.tp.isAlgorithmProcessInfoOnResultSuccess(t)) {
if (hs.gameInfo.gameMode != hs.GameMode.Class) return;
l = hs.storage.getItem("classGameNum", 0);
var c = hs.storage.getItem("classRoundNum", 0), u = !1;
if (this.state.gameNum != l) {
this.state.gameNum = l;
this.state.lastRoundNum = null;
this.state.hardSuccessContinueNum = 0;
u = !0;
}
if (this.state.lastRoundNum != c && (null === (s = hs.algorithmName.algoActualName[0]) || void 0 === s ? void 0 : s.includes("难题"))) {
this.state.hardSuccessContinueNum++;
this.state.lastRoundNum = c;
u = !0;
}
u && this.saveLocalData();
}
this.handleGP(t);
}
};
e.prototype.handleGP = function(t) {
var e, r;
if (hs.tp.isClassAlgorithmProcessInfoBottomStart(t) && (this.state.hardSuccessContinueNum == this.consecutiveTimes && (hs.algorithmName.algoActualName.every(function(t) {
return t == hs.ALGO_NAME_TYPE.NAME_RANDOM;
}) || hs.algorithmName.algoActualName.every(function(t) {
return t == hs.ALGO_NAME_TYPE.NAME_SHANG3;
})) || this.state.hardSuccessContinueNum == this.consecutiveTimes + 1)) {
var o = null === (e = this.strategy) || void 0 === e ? void 0 : e.getReplaceData(), a = o.isReplace, i = o.replaceAlgo;
if (a) {
t.args[0] = t.args[0] || [];
t.args[0].push(i);
hs.algorithmName.setAlgoExpectedId(hs.OFFER_TYPE.NONE);
hs.algorithmName.setAlgoExpectedId(i);
}
this.state.hardSuccessContinueNum = 0;
this.saveLocalData();
}
if (hs.tpManual.isClassAlgorithmBottomSequenceGPInfoTriggerBottomOfferAlgo(t) && (this.state.hardSuccessContinueNum == this.consecutiveTimes && (hs.algorithmName.algoActualName.every(function(t) {
return t == hs.ALGO_NAME_TYPE.NAME_RANDOM;
}) || hs.algorithmName.algoActualName.every(function(t) {
return t == hs.ALGO_NAME_TYPE.NAME_SHANG3;
})) || this.state.hardSuccessContinueNum == this.consecutiveTimes + 1)) {
var n = null === (r = this.strategy) || void 0 === r ? void 0 : r.getReplaceData();
a = n.isReplace, i = n.replaceAlgo;
if (a) {
hs.algorithmBottomSequenceInfo.setAlgorithmBottomList([ i ]);
hs.algorithmName.forceSetAlgoExpectedId(i);
}
this.state.hardSuccessContinueNum = 0;
this.saveLocalData();
}
};
e.prototype.handleIOS = function(t) {
if (hs.tpManual.isClassAlgorithmBottomSequenceInfoTriggerAfterOfferAlgo(t) && (this.state.hardSuccessContinueNum == this.consecutiveTimes && (hs.algorithmName.algoActualName.every(function(t) {
return t == hs.ALGO_NAME_TYPE.NAME_RANDOM;
}) || hs.algorithmName.algoActualName.every(function(t) {
return t == hs.ALGO_NAME_TYPE.NAME_SHANG3;
})) || this.state.hardSuccessContinueNum == this.consecutiveTimes + 1)) {
hs.algorithmBottomSequenceInfo.setAlgorithmAfterList(hs.algorithmStrategyIOSBlankInfo.offerBitTravelTianKongXiaoChu());
hs.algorithmName.setAlgoExpectedId(hs.OFFER_TYPE.NONE);
hs.algorithmName.setAlgoExpectedId(hs.OFFER_TYPE.TIAN_KONG_XIAO_CHU);
this.isTkXiaoChuSuccess = !0;
this.state.hardSuccessContinueNum = 0;
this.saveLocalData();
}
if (hs.tpManual.isClassAlgorithmBottomSequenceInfoOnDisableAfterAlgo(t)) {
var e = t.args[0];
if (e && e.callReturnValue && hs.algorithmName.algoActualName.some(function(t) {
return "旅行小保底" === t;
})) {
var r = hs.OFFER_TYPE_STRINGS[hs.OFFER_TYPE.TRAVEL_FILL_FUNCTION_BIT];
hs.algorithmName.setAlgoActualName([ r, r, r ]);
}
}
if (hs.tp.isAlgorithmProcessInfoAlgoSuccessAfter(t) && this.isTkXiaoChuSuccess) {
this.isTkXiaoChuSuccess = !1;
if (hs.algorithmName.algoActualId == hs.OFFER_TYPE.TRAVEL_FILL_FUNCTION_BIT) {
r = hs.OFFER_TYPE_STRINGS[hs.OFFER_TYPE.TRAVEL_FILL_FUNCTION_BIT];
hs.algorithmName.setAlgoActualName([ r, r, r ]);
}
}
};
e.prototype.loadLocalData = function() {
var t = hs.storage.getItem("OpenChangeContinueHardTraitState", {});
this.localData = t || {};
};
e.prototype.saveLocalData = function() {
hs.storage.setItem("OpenChangeContinueHardTraitState", this.localData);
};
e.prototype.createStrategy = function() {
var t, e, r;
switch (this.props.scheme) {
case n.ProbabilisticReplacement:
r = f.ProbabilisticReplacementStrategy;
break;

case n.MultipleQuestionTypes:
r = y.MultipleQuestionTypesStrategy;
break;

case n.BehaviorDrivenAdjustment:
r = s.BehaviorDrivenAdjustmentStrategy;
break;

case n.ConstraintTrigger:
r = c.ConstraintTriggerStrategy;
break;

case n.LayerByPlayerHistoricalHighScore:
r = h.LayerByPlayerHistoricalHighScoreStrategy;
break;

case n.DecayBySolveCount:
r = u.DecayBySolveCountStrategy;
break;

case n.WeightedProbabilisticReplacement:
r = g.WeightedProbabilisticReplacementStrategy;
break;

case n.ConditionalProbabilisticReplacement:
r = l.ConditionalProbabilisticReplacementStrategy;
break;

default:
r = p.DefaultStrategy;
}
this.strategy = new r(this.traitName, this.props);
null === (e = (t = this.strategy).onCreate) || void 0 === e || e.call(t);
};
i([ hs.Algorithm() ], e.prototype, "onActive", null);
return i([ classId("OpenChangeContinueHardExTrait") ], e);
}(Trait);
r.OpenChangeContinueHardExTrait = v;
cc._RF.pop();
}, {
"./strategy/BehaviorDrivenAdjustmentStrategy": "BehaviorDrivenAdjustmentStrategy",
"./strategy/ConditionalProbabilisticReplacementStrategy": "ConditionalProbabilisticReplacementStrategy",
"./strategy/ConstraintTriggerStrategy": "ConstraintTriggerStrategy",
"./strategy/DecayBySolveCountStrategy": "DecayBySolveCountStrategy",
"./strategy/DefaultStrategy": "DefaultStrategy",
"./strategy/LayerByPlayerHistoricalHighScoreStrategy": "LayerByPlayerHistoricalHighScoreStrategy",
"./strategy/MultipleQuestionTypesStrategy": "MultipleQuestionTypesStrategy",
"./strategy/ProbabilisticReplacementStrategy": "ProbabilisticReplacementStrategy",
"./strategy/WeightedProbabilisticReplacementStrategy": "WeightedProbabilisticReplacementStrategy"
} ],
ProbabilisticReplacementStrategy: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "aa50fk8HjhKcpdwRFU9QX25", "ProbabilisticReplacementStrategy");
var o, a = this && this.__extends || (o = function(t, e) {
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
});
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ProbabilisticReplacementStrategy = void 0;
var i = function(t) {
a(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.getReplaceData = function() {
return {
isReplace: Math.random() < this.props.probability,
replaceAlgo: this.props.replaceAlgorithm
};
};
return e;
}(t("./Strategy").Strategy);
r.ProbabilisticReplacementStrategy = i;
cc._RF.pop();
}, {
"./Strategy": "Strategy"
} ],
Strategy: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "e215dLN8bhHx7O9nbgNREH7", "Strategy");
Object.defineProperty(r, "__esModule", {
value: !0
});
r.Strategy = void 0;
r.Strategy = function(t, e) {
this.traitName = t;
this.props = e;
};
cc._RF.pop();
}, {} ],
WeightedProbabilisticReplacementStrategy: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "a19ebTruslBgLrGij7701Sl", "WeightedProbabilisticReplacementStrategy");
var o, a = this && this.__extends || (o = function(t, e) {
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
}), i = this && this.__values || function(t) {
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
}, n = this && this.__read || function(t, e) {
var r = "function" == typeof Symbol && t[Symbol.iterator];
if (!r) return t;
var o, a, i = r.call(t), n = [];
try {
for (;(void 0 === e || e-- > 0) && !(o = i.next()).done; ) n.push(o.value);
} catch (t) {
a = {
error: t
};
} finally {
try {
o && !o.done && (r = i.return) && r.call(i);
} finally {
if (a) throw a.error;
}
}
return n;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.WeightedProbabilisticReplacementStrategy = void 0;
var s = function(t) {
a(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.getReplaceData = function() {
var t, e, r, o, a = this.props.weights, s = 0;
try {
for (var l = i(a), c = l.next(); !c.done; c = l.next()) s += n(c.value, 2)[1];
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
var u = Math.random() * s, p = 0, h = a[0][0];
try {
for (var y = i(a), f = y.next(); !f.done; f = y.next()) {
var g = n(f.value, 2), v = g[0];
if (u < (p += g[1])) {
h = v;
break;
}
}
} catch (t) {
r = {
error: t
};
} finally {
try {
f && !f.done && (o = y.return) && o.call(y);
} finally {
if (r) throw r.error;
}
}
return {
isReplace: h != hs.OFFER_TYPE.NONE,
replaceAlgo: h
};
};
return e;
}(t("./Strategy").Strategy);
r.WeightedProbabilisticReplacementStrategy = s;
cc._RF.pop();
}, {
"./Strategy": "Strategy"
} ]
}, {}, [ "OpenChangeContinueHardExTrait", "BehaviorDrivenAdjustmentStrategy", "ConditionalProbabilisticReplacementStrategy", "ConstraintTriggerStrategy", "DecayBySolveCountStrategy", "DefaultStrategy", "LayerByPlayerHistoricalHighScoreStrategy", "MultipleQuestionTypesStrategy", "ProbabilisticReplacementStrategy", "Strategy", "WeightedProbabilisticReplacementStrategy" ]);
//# sourceMappingURL=index.js.map
