window.__require = function t(e, r, o) {
function i(a, s) {
if (!r[a]) {
if (!e[a]) {
var l = a.split("/");
l = l[l.length - 1];
if (!e[l]) {
var p = "function" == typeof __require && __require;
if (!s && p) return p(l, !0);
if (n) return n(l, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = l;
}
var u = r[a] = {
exports: {}
};
e[a][0].call(u.exports, function(t) {
return i(e[a][1][t] || t);
}, u, u.exports, t, e, r, o);
}
return r[a].exports;
}
for (var n = "function" == typeof __require && __require, a = 0; a < o.length; a++) i(o[a]);
return i;
}({
ClassTenLoopTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "c3b6btamnJOKJ8ObYoMbbfP", "ClassTenLoopTrait");
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
}), n = this && this.__decorate || function(t, e, r, o) {
var i, n = arguments.length, a = n < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, r, o); else for (var s = t.length - 1; s >= 0; s--) (i = t[s]) && (a = (n < 3 ? i(a) : n > 3 ? i(e, r, a) : i(e, r)) || a);
return n > 3 && a && Object.defineProperty(e, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ClassTenLoopTrait = void 0;
var a = function(t) {
i(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.onActive = function(t) {
hs.tp.isClassAlgorithmLifeCycle_GameStart_ProxyOnGameStart(t) ? this.onGameStart(t) : hs.tp.isClassAlgorithmStrategy_Priority_ProxyOnAlgorithmStrategyPriority(t) && this.onAlgorithmStrategyPriority();
};
e.prototype.onGameStart = function(t) {
var e, r, o = null === (e = t.args) || void 0 === e ? void 0 : e[0];
(2 !== hs.storage.getItem("classTenLoop", {
state: 0,
startTime: 0
}).state || (null === (r = null == o ? void 0 : o.data) || void 0 === r ? void 0 : r.newGame)) && hs.storage.setItem("classTenLoop", {
state: 0,
startTime: Date.now()
});
};
e.prototype.onAlgorithmStrategyPriority = function() {
var t = Date.now(), e = hs.storage.getItem("classTenLoop", {
state: 0,
startTime: 0
}), r = e.state, o = e.startTime;
if (2 === r || (t - o) / 1e3 > 180) {
r = 2;
hs.storage.setItem("classTenLoop", {
state: r,
startTime: o
});
} else {
var i = hs.BinaryBoard.getWeightValue(), n = hs.classGameInfo.gameNum;
if (this.shouldTriggerTenLoop(n, i)) {
hs.algorithmStrategyInfo.setAlgorithmPriorityList([ hs.OFFER_TYPE.TIAN_KONG_XIAO_CHU ]);
hs.algorithmInfo._algoSource = hs.algorithmSource.PRIORITY;
}
}
};
e.prototype.shouldTriggerTenLoop = function(t, e) {
var r = t % 10, o = this.getWeightParam("weight1", 400), i = this.getWeightParam("weight2", 450), n = this.getWeightParam("weight3", 500), a = {
0: o,
1: o,
2: o,
4: o,
6: o,
8: o,
3: i,
7: i,
5: n,
9: n
}[r];
return void 0 !== a && e > a;
};
e.prototype.getWeightParam = function(t, e) {
var r, o = null === (r = this.props) || void 0 === r ? void 0 : r[t];
return "number" == typeof o && Number.isFinite(o) && o > 0 ? o : e;
};
return n([ classId("ClassTenLoopTrait") ], e);
}(Trait);
r.ClassTenLoopTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "ClassTenLoopTrait" ]);
//# sourceMappingURL=index.js.map
