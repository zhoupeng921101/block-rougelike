window.__require = function t(e, r, o) {
function i(s, a) {
if (!r[s]) {
if (!e[s]) {
var u = s.split("/");
u = u[u.length - 1];
if (!e[u]) {
var c = "function" == typeof __require && __require;
if (!a && c) return c(u, !0);
if (n) return n(u, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = u;
}
var d = r[s] = {
exports: {}
};
e[s][0].call(d.exports, function(t) {
return i(e[s][1][t] || t);
}, d, d.exports, t, e, r, o);
}
return r[s].exports;
}
for (var n = "function" == typeof __require && __require, s = 0; s < o.length; s++) i(o[s]);
return i;
}({
GuideBoardAndBlockAdjustTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "2852fSZTYRBHJygFBzzW0jj", "GuideBoardAndBlockAdjustTrait");
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
var i, n = arguments.length, s = n < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, r, o); else for (var a = t.length - 1; a >= 0; a--) (i = t[a]) && (s = (n < 3 ? i(s) : n > 3 ? i(e, r, s) : i(e, r)) || s);
return n > 3 && s && Object.defineProperty(e, r, s), s;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.GuideBoardAndBlockAdjustTrait = void 0;
var s = [ -1, -1, -1, 2, 2, 5, 5, 5, -1, -1, -1, 2, 2, 5, 5, 5, -1, -1, -1, 2, 2, 5, 5, 5, 2, 2, 2, -1, -1, 2, 2, 2, 2, 2, 2, -1, -1, 2, 2, 2, 5, 5, 5, 2, 2, -1, -1, -1, 5, 5, 5, 2, 2, -1, -1, -1, 5, 5, 5, 2, 2, -1, -1, -1 ], a = function(t) {
i(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "Launch_Proxy",
methodName: "onTraitConfigInitComplete"
} ];
};
e.prototype.onActive = function(t) {
if (hs.tp.isLaunch_ProxyOnTraitConfigInitComplete(t)) {
if (hs.classGuideInfo.isFinishedGuide) return;
storage.setItem("classGuideStep", 2);
for (var e = this.boardData, r = [], o = 0; o < 8; o++) r.push(e.slice(8 * o, 8 * (o + 1)));
storage.setItem("classFaceBlocks", r);
storage.setItem("classProducerBlocks", this.blockList);
}
if (hs.tp.isClassGuide_ProxyRenderGuideState(t)) {
var i = Cinst(hs.ClassGuide);
if (i) {
i.setState({
step: 2,
showDarkMask: !0,
showHand: !0,
color: 2
});
t.replace = !0;
t.returnState = !0;
}
}
if (hs.tp.isClassBlocksProducer_ProxyBeforeBlocksProducerUpdate(t) && 2 === hs.classGuideInfo.step) {
storage.setItem("classColorLists", this.colorList);
t.args[1][1] = 2;
t.returnState = !0;
}
if (hs.tp.isBoardSplashAnimationDoAnimation(t)) {
if (hs.classGuideInfo.isFinishedGuide) return;
t.replace = !0;
t.returnState = !0;
}
};
Object.defineProperty(e.prototype, "boardData", {
get: function() {
var t;
return null !== (t = this.props.boardData) && void 0 !== t ? t : s;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "blockList", {
get: function() {
return hs.traitConfigSafePropsInfo.getSafePropValueByKey("GuideBoardAndBlockAdjustTrait", "blockList", this.props, [ -1, 9, -1 ]);
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "colorList", {
get: function() {
return hs.traitConfigSafePropsInfo.getSafePropValueByKey("GuideBoardAndBlockAdjustTrait", "colorList", this.props, [ 1, 2, 1 ]);
},
enumerable: !1,
configurable: !0
});
return n([ classId("GuideBoardAndBlockAdjustTrait") ], e);
}(Trait);
r.GuideBoardAndBlockAdjustTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "GuideBoardAndBlockAdjustTrait" ]);
//# sourceMappingURL=index.js.map
