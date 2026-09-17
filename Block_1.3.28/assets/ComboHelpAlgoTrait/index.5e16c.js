window.__require = function t(e, o, i) {
function r(s, a) {
if (!o[s]) {
if (!e[s]) {
var l = s.split("/");
l = l[l.length - 1];
if (!e[l]) {
var u = "function" == typeof __require && __require;
if (!a && u) return u(l, !0);
if (n) return n(l, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = l;
}
var p = o[s] = {
exports: {}
};
e[s][0].call(p.exports, function(t) {
return r(e[s][1][t] || t);
}, p, p.exports, t, e, o, i);
}
return o[s].exports;
}
for (var n = "function" == typeof __require && __require, s = 0; s < i.length; s++) r(i[s]);
return r;
}({
ComboHelpAlgoTrait: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "3bb20YsPSxEFLquax0pwaUM", "ComboHelpAlgoTrait");
var i, r = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
i(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), n = this && this.__decorate || function(t, e, o, i) {
var r, n = arguments.length, s = n < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, o) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, o, i); else for (var a = t.length - 1; a >= 0; a--) (r = t[a]) && (s = (n < 3 ? r(s) : n > 3 ? r(e, o, s) : r(e, o)) || s);
return n > 3 && s && Object.defineProperty(e, o, s), s;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.ComboHelpAlgoTrait = void 0;
var s = function(t) {
r(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.onActive = function(t) {
if (hs.tp.isClassAlgorithmLifeCycle_GameStart_ProxyNewGameInit(t)) {
var e = this.comboHelpInfo, o = -1, i = e.continuousEliminateTimes, r = e.currentAllEliminateTimes + i;
e.currentAllEliminateTimes = r;
e.putBlockCount > 0 && (o = e.currentAllEliminateTimes / e.putBlockCount);
this.updateCanTriggerStatus();
this.setComboHelpDataByKey("preGamDensity", o);
this.resetComboHelpInfo();
}
if (hs.tp.isClassAlgorithmLifeCycle_TouchEnd_ProxyOnTouchEnd(t)) {
var n = t.args[0].state, s = n.continuousEliminateTimes, a = n.touchBlockId;
void 0 !== a && -1 !== a && this.setComboHelpDataByKey("putBlockCount", this.comboHelpInfo.putBlockCount + 1);
if (s > 0) {
s > 1 && this.setComboHelpDataByKey("isBreakCombo", !1);
this.setComboHelpDataByKey("continuousEliminateTimes", s - 1);
} else {
var l = this.comboHelpInfo.continuousEliminateTimes, u = this.comboHelpInfo.currentAllEliminateTimes + l;
this.setComboHelpDataByKey("currentAllEliminateTimes", u);
this.setComboHelpDataByKey("continuousEliminateTimes", 0);
l > 0 && this.setComboHelpDataByKey("isBreakCombo", !0);
}
}
hs.tp.isClassAlgorithmStrategy_Priority_ProxyOnAlgorithmStrategyPriority(t) && this.isCanTrigger() && hs.algorithmStrategyInfo.algorithmPriorityList.push(hs.OFFER_TYPE.DUO_XIAO);
if (hs.tp.isAlgorithmProcessInfoTriggerAlgorithmResult(t) && hs.algorithmName.algoActualId === hs.OFFER_TYPE.DUO_XIAO) {
this.setComboHelpDataByKey("canTrigger", !1);
this.setComboHelpDataByKey("runGameNum", 0);
}
};
e.prototype.updateCanTriggerStatus = function() {
var t = this.comboHelpInfo, e = t.runGameNum, o = t.canTrigger;
if (!o) {
if (++e > this.props.no_valid_num) {
e = 0;
o = !0;
this.setComboHelpDataByKey("canTrigger", o);
}
this.setComboHelpDataByKey("runGameNum", e);
}
};
e.prototype.resetComboHelpInfo = function() {
var t = this.comboHelpInfo;
t.currentAllEliminateTimes = 0;
t.continuousEliminateTimes = 0;
t.putBlockCount = 0;
t.isBreakCombo = !1;
this.setComboHelpInfo(t);
};
Object.defineProperty(e.prototype, "comboHelpInfo", {
get: function() {
return storage.getItem("comboHelpAlgoTraitData", {
currentAllEliminateTimes: 0,
continuousEliminateTimes: 0,
putBlockCount: 0,
preGamDensity: -1,
canTrigger: !0,
runGameNum: 0,
isBreakCombo: !1
});
},
enumerable: !1,
configurable: !0
});
e.prototype.isCanTrigger = function() {
var t = this.comboHelpInfo;
return !!t.isBreakCombo && (!!t.canTrigger && (t.preGamDensity >= 0 && t.preGamDensity < this.props.density));
};
e.prototype.setComboHelpDataByKey = function(t, e) {
var o = this.comboHelpInfo;
o[t] = e;
this.setComboHelpInfo(o);
};
e.prototype.setComboHelpInfo = function(t) {
storage.setItem("comboHelpAlgoTraitData", t);
};
return n([ classId("ComboHelpAlgoTrait") ], e);
}(Trait);
o.ComboHelpAlgoTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "ComboHelpAlgoTrait" ]);
//# sourceMappingURL=index.js.map
