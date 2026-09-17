window.__require = function e(o, t, r) {
function n(i, a) {
if (!t[i]) {
if (!o[i]) {
var c = i.split("/");
c = c[c.length - 1];
if (!o[c]) {
var u = "function" == typeof __require && __require;
if (!a && u) return u(c, !0);
if (s) return s(c, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = c;
}
var f = t[i] = {
exports: {}
};
o[i][0].call(f.exports, function(e) {
return n(o[i][1][e] || e);
}, f, f.exports, e, o, t, r);
}
return t[i].exports;
}
for (var s = "function" == typeof __require && __require, i = 0; i < r.length; i++) n(r[i]);
return n;
}({
SolveDiffProblemEncourageTrait: [ function(e, o, t) {
"use strict";
cc._RF.push(o, "48e77SkynhG1JDI0kwbPs3Z", "SolveDiffProblemEncourageTrait");
var r, n = this && this.__extends || (r = function(e, o) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, o) {
e.__proto__ = o;
} || function(e, o) {
for (var t in o) Object.prototype.hasOwnProperty.call(o, t) && (e[t] = o[t]);
})(e, o);
}, function(e, o) {
r(e, o);
function t() {
this.constructor = e;
}
e.prototype = null === o ? Object.create(o) : (t.prototype = o.prototype, new t());
}), s = this && this.__decorate || function(e, o, t, r) {
var n, s = arguments.length, i = s < 3 ? o : null === r ? r = Object.getOwnPropertyDescriptor(o, t) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(e, o, t, r); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (i = (s < 3 ? n(i) : s > 3 ? n(o, t, i) : n(o, t)) || i);
return s > 3 && i && Object.defineProperty(o, t, i), i;
};
Object.defineProperty(t, "__esModule", {
value: !0
});
t.SolveDiffProblemEncourageTrait = void 0;
var i = function(e) {
n(o, e);
function o() {
var o = null !== e && e.apply(this, arguments) || this;
o.showEncourage = !1;
o.diffCount = 0;
o.DIFFTYPE = [ 8, 4e3, 4012, 6, 4001, 4002, 4003, 4004, 4005, 4006, 4007, 4008, 4010, 4011, 4014, 4015, 4016, 4009 ];
return o;
}
o.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassEncourage_Proxy",
methodName: "onGameStart"
}, {
className: "ClassEncourage_Proxy",
methodName: "onBlocksProducerTouchEnd"
}, {
className: "AlgorithmProcessInfo",
methodName: "algorithmSuccess"
} ];
};
o.prototype.onCreate = function() {
var e = storage.getItem("solveDiffProblemEncourage", {
show: !1,
diffCount: 0
});
this.diffCount = 0 | e.diffCount;
this.showEncourage = e.show;
};
o.prototype.onActive = function(e) {
var o;
if (hs.tp.isClassEncourage_ProxyOnGameStart(e) && e.args[0].data.newGame) {
this.diffCount = 0;
this.showEncourage = !1;
storage.setItem("solveDiffProblemEncourage", {
show: this.showEncourage,
diffCount: this.diffCount
});
}
if (hs.tp.isAlgorithmProcessInfoAlgorithmSuccess(e) && hs.gameInfo.gameMode == hs.GameMode.Class) {
this.showEncourage = !1;
if (this.DIFFTYPE.includes(hs.algorithmName.algoActualId)) {
this.diffCount++;
(this.diffCount <= 3 || this.diffCount % 2 == 1) && (this.showEncourage = !0);
}
storage.setItem("solveDiffProblemEncourage", {
show: this.showEncourage,
diffCount: this.diffCount
});
}
if (hs.tp.isClassEncourage_ProxyOnBlocksProducerTouchEnd(e) && 3 == e.args[0].state.producerBlocks.filter(function(e) {
return -1 == e;
}).length && this.showEncourage) {
this.showEncourage = !1;
storage.setItem("solveDiffProblemEncourage", {
show: this.showEncourage,
diffCount: this.diffCount
});
try {
var t = hs.dragonbonesAnim.play(hs.gameUiLayer, {
armatureName: "armatureName",
animationName: "in",
playTimes: 1,
completeRemove: !0
}, {
bundleName: "SolveDiffProblemEncourageTrait",
dragonAssetUrl: "anim/gameplay_ohgenius_ske",
dragonAtlasAssetUrl: "anim/gameplay_ohgenius_tex"
});
if (t) {
var r = (null === (o = Cinst(hs.Board)) || void 0 === o ? void 0 : o.node).convertToWorldSpaceAR(cc.v2(0, 0)), n = hs.gameUiLayer.convertToNodeSpaceAR(r);
t.setPosition(n);
t.zIndex = 1e3;
}
} catch (e) {}
}
if (hs.tp.isIsOpenRightPutTraitPlayPerfect(e) && 3 == hs.classBlocksProducerInfo.producerBlocks.filter(function(e) {
return -1 == e;
}).length && this.showEncourage) {
e.replace = !0;
e.returnState = !0;
}
};
return s([ classId("SolveDiffProblemEncourageTrait") ], o);
}(Trait);
t.SolveDiffProblemEncourageTrait = i;
cc._RF.pop();
}, {} ]
}, {}, [ "SolveDiffProblemEncourageTrait" ]);
//# sourceMappingURL=index.js.map
