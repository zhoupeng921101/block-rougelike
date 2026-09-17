window.__require = function e(t, o, r) {
function s(n, c) {
if (!o[n]) {
if (!t[n]) {
var a = n.split("/");
a = a[a.length - 1];
if (!t[a]) {
var u = "function" == typeof __require && __require;
if (!c && u) return u(a, !0);
if (i) return i(a, !0);
throw new Error("Cannot find module '" + n + "'");
}
n = a;
}
var f = o[n] = {
exports: {}
};
t[n][0].call(f.exports, function(e) {
return s(t[n][1][e] || e);
}, f, f.exports, e, t, o, r);
}
return o[n].exports;
}
for (var i = "function" == typeof __require && __require, n = 0; n < r.length; n++) s(r[n]);
return s;
}({
TwoStepGuideTrait: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "921c88EOUlMoIeD5M8AW80+", "TwoStepGuideTrait");
var r, s = this && this.__extends || (r = function(e, t) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
})(e, t);
}, function(e, t) {
r(e, t);
function o() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
}), i = this && this.__decorate || function(e, t, o, r) {
var s, i = arguments.length, n = i < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(e, t, o, r); else for (var c = e.length - 1; c >= 0; c--) (s = e[c]) && (n = (i < 3 ? s(n) : i > 3 ? s(t, o, n) : s(t, o)) || n);
return i > 3 && n && Object.defineProperty(t, o, n), n;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.TwoStepGuideTrait = void 0;
var n = [ [ 3, 3 ], [ 3, 4 ], [ 4, 4 ], [ 4, 5 ] ], c = function(e) {
s(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._isInjected = !1;
return t;
}
t.prototype.onActive = function(e) {
hs.tp.isLaunch_ProxyOnTraitConfigInitComplete(e) && this.modifyGuideStep();
(hs.tp.isClassBlocksProducer_ProxyOnInit(e) || hs.tp.isClassBoard_ProxyOnBoardInit(e)) && this.injectGuideStep();
hs.tp.isBlocksProducerTouchInterceptTouchEnd(e) && this.placeGuideBlock(e);
hs.tp.isClassGuide_ProxyOnBlockProducerItemOpen(e) && this.removeGuideEffectNode();
};
t.prototype.removeGuideEffectNode = function() {
var e = hs.classGuideInfo, t = e.totalStep;
if (e.step === t) {
var o = Cinst(hs.BlocksProducer);
if (!o || !o.guideEffectContainer) return;
cc.isValid(o) && cc.isValid(o.guideEffectContainer) && o.guideEffectContainer.removeAllChildren();
}
};
t.prototype.modifyGuideStep = function() {
if (hs.classGuideInfo.isFinishedGuide) ; else {
var e = hs.storage.getItem("classGuideStep", 0), t = hs.storage.getItem("TwoStepGuideIsFirst", !1);
if (2 == e && !t) {
hs.storage.setItem("classGuideStep", 1);
hs.storage.setItem("classGuideTotalStep", 3);
}
}
};
t.prototype.injectGuideStep = function() {
if (hs.gameInfo.gameMode === hs.GameMode.Class) if (this._isInjected) ; else {
var e = hs.classGuideInfo;
if (e) if (e.isFinishedGuide) ; else {
if (1 == e.step) {
var t = e.steps, o = {
save_arr: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ 5, 5, 5, -1, -1, 5, 5, 5 ], [ 5, 5, 5, 5, -1, -1, 5, 5 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ -1, 18, -1 ],
blocksColors: [ 2, 2, 2 ],
color: 2,
move: [ {
x: 53,
y: -553.75
}, {
x: 53,
y: 126.25
} ]
};
Object.assign(t[1], o);
hs.storage.setItem("classFaceBlocks", o.save_arr);
hs.storage.setItem("classProducerBlocks", o.producerBlocks);
}
this._isInjected = !0;
}
}
};
t.prototype.placeGuideBlock = function(e) {
if (hs.classGuideInfo.isFinishedGuide) ; else if (1 === hs.storage.getItem("classGuideStep", 0)) {
var t = e.target, o = t._showShaders;
if (t._canSnap && o && 0 !== Object.keys(o).length) {
var r = n, s = !0, i = function(e) {
var t = function(t) {
if (!r.some(function(o) {
return o[0] === +e && o[1] === +t;
})) {
s = !1;
return "break";
}
};
for (var i in o[e]) if ("break" === t(i)) break;
if (!s) return "break";
};
for (var c in o) if ("break" === i(c)) break;
if (s) hs.storage.setItem("TwoStepGuideIsFirst", !0); else {
this.resetBlockToHand(t);
e.returnState = !0;
e.returnValue = !0;
}
}
}
};
t.prototype.resetBlockToHand = function(e) {
"function" == typeof e.resetLastBlocks && e.resetLastBlocks();
"function" == typeof e.backBlocks && e.backBlocks();
"function" == typeof e.hideShadersNodes && e.hideShadersNodes(0);
"function" == typeof e.resetTouchData && e.resetTouchData();
e._selectItem = null;
e._selectIndex = -1;
e._lastSelectItem = null;
e._lastSelectIndex = -1;
hs.EventManager.dispatchModuleEvent(new hs.E_BlocksProducer_AnyTouchEnd());
};
return i([ classId("TwoStepGuideTrait") ], t);
}(Trait);
o.TwoStepGuideTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "TwoStepGuideTrait" ]);
//# sourceMappingURL=index.js.map
