window.__require = function e(t, r, n) {
function i(o, s) {
if (!r[o]) {
if (!t[o]) {
var f = o.split("/");
f = f[f.length - 1];
if (!t[f]) {
var m = "function" == typeof __require && __require;
if (!s && m) return m(f, !0);
if (a) return a(f, !0);
throw new Error("Cannot find module '" + o + "'");
}
o = f;
}
var p = r[o] = {
exports: {}
};
t[o][0].call(p.exports, function(e) {
return i(t[o][1][e] || e);
}, p, p.exports, e, t, r, n);
}
return r[o].exports;
}
for (var a = "function" == typeof __require && __require, o = 0; o < n.length; o++) i(n[o]);
return i;
}({
MainUIDiffFrameRateDiffTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "7cbc5kd3HlB1IWulimAjh5q", "MainUIDiffFrameRateDiffTrait");
var n, i, a = this && this.__extends || (n = function(e, t) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
n(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), o = this && this.__decorate || function(e, t, r, n) {
var i, a = arguments.length, o = a < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, r) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) o = Reflect.decorate(e, t, r, n); else for (var s = e.length - 1; s >= 0; s--) (i = e[s]) && (o = (a < 3 ? i(o) : a > 3 ? i(t, r, o) : i(t, r)) || o);
return a > 3 && o && Object.defineProperty(t, r, o), o;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.MainUIDiffFrameRateDiffTrait = void 0;
(function(e) {
e.OpenGame_UI = "OpenGame_UI";
e.Game_InitComplete = "Game_InitComplete";
e.HomePage_Show = "HomePage_Show";
e.GameOver_GameEnd = "GameOver_GameEnd";
e.AtomEngine_enterGame = "AtomEngine_enterGame";
e.AtomEngine_exitGame = "AtomEngine_exitGame";
})(i || (i = {}));
var s = function(e) {
a(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "GameLobby_Proxy",
methodName: "onEnterMiniGameSuccess"
}, {
className: "GameLobby_DataInfo",
methodName: "exitGameLobby"
} ];
};
t.prototype.isMainSceneEvent = function(e) {
return e === i.OpenGame_UI || e === i.Game_InitComplete || e === i.AtomEngine_enterGame;
};
t.prototype.isOtherSceneEvent = function(e) {
return e === i.HomePage_Show || e === i.GameOver_GameEnd || e === i.AtomEngine_exitGame;
};
t.prototype.setFrameRate = function(e) {
cc.game.setFrameRate(e);
};
t.prototype.onActive = function(e) {
var t, r;
hs.tp.isGameLobby_ProxyOnEnterMiniGameSuccess(e) && (null === (t = this.props) || void 0 === t ? void 0 : t.mainFrameRate) && this.setFrameRate(this.props.mainFrameRate, "进入小游戏（主场景）");
hs.tp.isGameLobby_DataInfoExitGameLobby(e) && (null === (r = this.props) || void 0 === r ? void 0 : r.otherFrameRate) && this.setFrameRate(this.props.otherFrameRate, "退出小游戏（非主场景）");
if (hs.tp.isDevice_Low_ProxySetFrameRate(e)) {
if (!this.props || !this.props.mainFrameRate || !this.props.otherFrameRate) return;
var n = e.args[1];
this.isMainSceneEvent(n) ? e.args[0] = this.props.mainFrameRate : this.isOtherSceneEvent(n) && (e.args[0] = this.props.otherFrameRate);
}
};
return o([ classId("MainUIDiffFrameRateDiffTrait") ], t);
}(Trait);
r.MainUIDiffFrameRateDiffTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "MainUIDiffFrameRateDiffTrait" ]);
//# sourceMappingURL=index.js.map
