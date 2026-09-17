window.__require = function t(r, e, o) {
function n(s, a) {
if (!e[s]) {
if (!r[s]) {
var c = s.split("/");
c = c[c.length - 1];
if (!r[c]) {
var u = "function" == typeof __require && __require;
if (!a && u) return u(c, !0);
if (i) return i(c, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = c;
}
var l = e[s] = {
exports: {}
};
r[s][0].call(l.exports, function(t) {
return n(r[s][1][t] || t);
}, l, l.exports, t, r, e, o);
}
return e[s].exports;
}
for (var i = "function" == typeof __require && __require, s = 0; s < o.length; s++) n(o[s]);
return n;
}({
IsOpenComboInterruptionStrategyBlockLimitTrait: [ function(t, r, e) {
"use strict";
cc._RF.push(r, "46bd6Y3XDdCv4g96eV1A3bG", "IsOpenComboInterruptionStrategyBlockLimitTrait");
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
var n, i = arguments.length, s = i < 3 ? r : null === o ? o = Object.getOwnPropertyDescriptor(r, e) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, r, e, o); else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (s = (i < 3 ? n(s) : i > 3 ? n(r, e, s) : n(r, e)) || s);
return i > 3 && s && Object.defineProperty(r, e, s), s;
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.IsOpenComboInterruptionStrategyBlockLimitTrait = void 0;
var s = function(t) {
n(r, t);
function r() {
var r = null !== t && t.apply(this, arguments) || this;
r.curComboNum = 0;
r.curRandom = 0;
r._hasRandom = !1;
r._cache = new Map();
return r;
}
r.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassBlocksProducer_Proxy",
methodName: "onTouchEnd"
}, {
className: "ClassGame_Proxy",
methodName: "newGameInit"
}, {
className: "ClassAlgorithmStrategy_Run_Proxy",
methodName: "onTriggerStrategyRun"
} ];
};
r.prototype.onActive = function(t) {
if (hs.tp.isClassBlocksProducer_ProxyOnTouchEnd(t)) {
var r = t.args[0].state;
this.curComboNum = r.continuousEliminateTimes - 1;
}
hs.tp.isClassGame_ProxyNewGameInit(t) && (this.curComboNum = 0);
hs.tp.isClassAlgorithmStrategy_Run_ProxyOnTriggerStrategyRun(t) && (this.curRandom = Math.random());
if (hs.tp.isAlgorithmProcessInfoHandleArgs(t)) {
if (hs.gameInfo.gameMode !== hs.GameMode.Class) return;
if (this.curComboNum < this.props.comboThreshold) return;
var e = this.curRandom;
if (0 === this.curRandom && !0 !== this._hasRandom) {
this.curRandom = Math.random();
this._hasRandom = !0;
}
if (e > this.props.probability) return;
var o = this.getThanCellNumBlockId(this.props.cellNumThreshold), n = t.args[0];
o.forEach(function(t) {
n.filterBlocks.includes(t) || n.filterBlocks.push(t);
n.filterWeightBlocks = n.filterWeightBlocks || [];
n.filterWeightBlocks.includes(t) || n.filterWeightBlocks.push(t);
});
n.addBlocks = n.addBlocks.filter(function(t) {
return !o.includes(t);
});
}
};
r.prototype.getThanCellNumBlockId = function(t) {
var r = this._cache.get(t);
if (r) return r;
var e = [], o = hs.BlockShapeMap;
for (var n in o) {
var i = Number(n);
hs.BinaryClip.countBlockCells(i) > t && e.push(i);
}
this._cache.set(t, e);
return e;
};
return i([ classId("IsOpenComboInterruptionStrategyBlockLimitTrait") ], r);
}(Trait);
e.IsOpenComboInterruptionStrategyBlockLimitTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "IsOpenComboInterruptionStrategyBlockLimitTrait" ]);
//# sourceMappingURL=index.js.map
