window.__require = function e(t, o, r) {
function n(s, i) {
if (!o[s]) {
if (!t[s]) {
var u = s.split("/");
u = u[u.length - 1];
if (!t[u]) {
var c = "function" == typeof __require && __require;
if (!i && c) return c(u, !0);
if (a) return a(u, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = u;
}
var l = o[s] = {
exports: {}
};
t[s][0].call(l.exports, function(e) {
return n(t[s][1][e] || e);
}, l, l.exports, e, t, o, r);
}
return o[s].exports;
}
for (var a = "function" == typeof __require && __require, s = 0; s < r.length; s++) n(r[s]);
return n;
}({
ClassModeAutoSkinAfterThreeTrait: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "af8e63YHLtF9pGXSRcSHNAy", "ClassModeAutoSkinAfterThreeTrait");
var r, n = this && this.__extends || (r = function(e, t) {
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
}), a = this && this.__decorate || function(e, t, o, r) {
var n, a = arguments.length, s = a < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, o, r); else for (var i = e.length - 1; i >= 0; i--) (n = e[i]) && (s = (a < 3 ? n(s) : a > 3 ? n(t, o, s) : n(t, o)) || s);
return a > 3 && s && Object.defineProperty(t, o, s), s;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.ClassModeAutoSkinAfterThreeTrait = void 0;
var s = e("./interface/IClassModeAutoSkinAfterThree"), i = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._isPreload = !1;
return t;
}
t.prototype.onCreate = function() {};
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassSkin_TopInfo_Proxy",
methodName: "onSkinReadyComplete"
}, {
className: "ClassSkin_Board_Proxy",
methodName: "OnGameStart"
}, {
className: "ClassGame_Proxy",
methodName: "onIntoGame"
} ];
};
t.prototype.onActive = function(e) {
if (hs.tp.isClassSkin_TopInfo_ProxyOnSkinReadyComplete(e)) {
if (0 == storage.getItem("classScore", 0)) return;
storage.setItem(s.IClassModeAutoSkinAfterThree.StorageKey_NextReplaceGameRound, hs.classGameInfo.gameNum + this.props.changeSkinBout + 1);
}
if (hs.tp.isClassSkin_Board_ProxyOnGameStart(e)) {
var t = storage.getItem(s.IClassModeAutoSkinAfterThree.StorageKey_NextReplaceGameRound, 0);
if (0 == t) {
storage.setItem(s.IClassModeAutoSkinAfterThree.StorageKey_NextReplaceGameRound, hs.classGameInfo.gameNum + this.props.changeSkinBout);
return;
}
if (t == hs.classGameInfo.gameNum) {
var o = TRAIT("CleanSceneUseSequenceSkinTrait");
(null == o ? void 0 : o.active) && o.changeSkin();
storage.setItem(s.IClassModeAutoSkinAfterThree.StorageKey_NextReplaceGameRound, hs.classGameInfo.gameNum + this.props.changeSkinBout);
}
}
hs.tp.isClassGame_ProxyOnIntoGame(e) && this.preloadSkinPool();
};
t.prototype.preloadSkinPool = function() {
if (!this._isPreload) {
this._isPreload = !0;
var e = TRAIT("CleanSceneUseSequenceSkinTrait");
(null == e ? void 0 : e.active) && e.loadSkinPool();
}
};
return a([ classId("ClassModeAutoSkinAfterThreeTrait") ], t);
}(Trait);
o.ClassModeAutoSkinAfterThreeTrait = i;
cc._RF.pop();
}, {
"./interface/IClassModeAutoSkinAfterThree": "IClassModeAutoSkinAfterThree"
} ],
IClassModeAutoSkinAfterThree: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "3f3aauHmFxBnYq+FtAemgsE", "IClassModeAutoSkinAfterThree");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.IClassModeAutoSkinAfterThree = void 0;
var r = function() {
function e() {}
e.StorageKey_NextReplaceGameRound = "ClassModeAutoSkinAfterThreeTrait_nextReplaceGameRound";
return e;
}();
o.IClassModeAutoSkinAfterThree = r;
cc._RF.pop();
}, {} ]
}, {}, [ "ClassModeAutoSkinAfterThreeTrait", "IClassModeAutoSkinAfterThree" ]);
//# sourceMappingURL=index.js.map
