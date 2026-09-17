window.__require = function t(e, r, o) {
function a(i, s) {
if (!r[i]) {
if (!e[i]) {
var c = i.split("/");
c = c[c.length - 1];
if (!e[c]) {
var l = "function" == typeof __require && __require;
if (!s && l) return l(c, !0);
if (n) return n(c, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = c;
}
var u = r[i] = {
exports: {}
};
e[i][0].call(u.exports, function(t) {
return a(e[i][1][t] || t);
}, u, u.exports, t, e, r, o);
}
return r[i].exports;
}
for (var n = "function" == typeof __require && __require, i = 0; i < o.length; i++) a(o[i]);
return a;
}({
InitBoardToleranceTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "46995UF3fhFRKV5BO+9XemX", "InitBoardToleranceTrait");
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
}), n = this && this.__decorate || function(t, e, r, o) {
var a, n = arguments.length, i = n < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(t, e, r, o); else for (var s = t.length - 1; s >= 0; s--) (a = t[s]) && (i = (n < 3 ? a(i) : n > 3 ? a(e, r, i) : a(e, r)) || i);
return n > 3 && i && Object.defineProperty(e, r, i), i;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.InitBoardToleranceTrait = void 0;
var i = function(t) {
a(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassDefaultBoard_Proxy",
methodName: "onGameOverPre"
}, {
className: "ClassDefaultBoard_Proxy",
methodName: "postPreprocessing"
}, {
className: "ClassDefaultBoard_Proxy",
methodName: "triggerSpecialTrait"
} ];
};
e.prototype.onCreate = function() {
this.initBoardToleranceData = storage.getItem("InitBoardToleranceTraitKey", {
lastNoNullBoard: !1,
initBoardContinueDieCount: 0
});
};
e.prototype.onActive = function(t) {
hs.tp.isClassDefaultBoard_ProxyTriggerSpecialTrait(t) && (this.initBoardToleranceData.initBoardContinueDieCount >= 2 ? t.args[0] = hs.boardInfo.NULL : 1 === this.initBoardToleranceData.initBoardContinueDieCount && Math.random() < .4 && (t.args[0] = hs.boardInfo.NULL));
if (hs.tp.isClassDefaultBoard_ProxyPostPreprocessing(t) && t.args[0].data.newGame) {
hs.boardInfo.isNullBoard(hs.boardInfo.faceBlocks) ? this.initBoardToleranceData.lastNoNullBoard = !1 : this.initBoardToleranceData.lastNoNullBoard = !0;
storage.setItem("InitBoardToleranceTraitKey", this.initBoardToleranceData);
}
if (hs.tp.isClassDefaultBoard_ProxyOnGameOverPre(t)) {
this.initBoardToleranceData.lastNoNullBoard && hs.classScoreInfo.score <= 100 ? this.initBoardToleranceData.initBoardContinueDieCount++ : this.initBoardToleranceData.initBoardContinueDieCount = 0;
storage.setItem("InitBoardToleranceTraitKey", this.initBoardToleranceData);
}
};
return n([ classId("InitBoardToleranceTrait") ], e);
}(Trait);
r.InitBoardToleranceTrait = i;
cc._RF.pop();
}, {} ]
}, {}, [ "InitBoardToleranceTrait" ]);
//# sourceMappingURL=index.js.map
