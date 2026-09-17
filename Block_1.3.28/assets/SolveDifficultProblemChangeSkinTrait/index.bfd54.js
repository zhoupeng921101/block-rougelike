window.__require = function e(t, r, o) {
function i(a, s) {
if (!r[a]) {
if (!t[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!t[c]) {
var l = "function" == typeof __require && __require;
if (!s && l) return l(c, !0);
if (n) return n(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var f = r[a] = {
exports: {}
};
t[a][0].call(f.exports, function(e) {
return i(t[a][1][e] || e);
}, f, f.exports, e, t, r, o);
}
return r[a].exports;
}
for (var n = "function" == typeof __require && __require, a = 0; a < o.length; a++) i(o[a]);
return i;
}({
SolveDifficultProblemChangeSkinTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "71b1e4Y2OVGs4LYKQ9iURAQ", "SolveDifficultProblemChangeSkinTrait");
var o, i = this && this.__extends || (o = function(e, t) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
o(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), n = this && this.__decorate || function(e, t, r, o) {
var i, n = arguments.length, a = n < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, o); else for (var s = e.length - 1; s >= 0; s--) (i = e[s]) && (a = (n < 3 ? i(a) : n > 3 ? i(t, r, a) : i(t, r)) || a);
return n > 3 && a && Object.defineProperty(t, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.SolveDifficultProblemChangeSkinTrait = void 0;
var a = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._triggerTime = 0;
t._gameOver = !1;
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassGame_Proxy",
methodName: "onClassGameStart"
}, {
className: "ClassGameOver_Proxy",
methodName: "calcOver"
}, {
className: "ClassBlocksProducer_Round_Proxy",
methodName: "onAlgorithmStrategyRequest"
} ];
};
t.prototype.onActive = function(e) {
hs.tp.isClassGame_ProxyOnClassGameStart(e) && this.gameStart();
hs.tp.isClassGameOver_ProxyCalcOver(e) && this.gameOver();
hs.tp.isClassBlocksProducer_Round_ProxyOnAlgorithmStrategyRequest(e) && this.changeSkin();
};
t.prototype.gameStart = function() {
this._triggerTime = 0;
this._gameOver = !1;
};
t.prototype.gameOver = function() {
this._gameOver = !0;
};
t.prototype.changeSkin = function() {
if (this._gameOver) this._gameOver = !1; else if (hs.classScoreInfo.score && hs.algorithmInfo.getOfferTypeCategory(hs.algorithmName.algoActualId) === hs.algorithmMainType.DIFFICULT && Date.now() - this._triggerTime > 1e3 * this.props.time) {
this._triggerTime = Date.now();
var e = hs.skinRandomInfo.getRandomSkin(1);
e.length && e[0] && e[0].ID && hs.EventManager.dispatchModuleEvent(new hs.E_Skin_Update("" + e[0].ID));
}
};
return n([ classId("SolveDifficultProblemChangeSkinTrait") ], t);
}(Trait);
r.SolveDifficultProblemChangeSkinTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "SolveDifficultProblemChangeSkinTrait" ]);
//# sourceMappingURL=index.js.map
