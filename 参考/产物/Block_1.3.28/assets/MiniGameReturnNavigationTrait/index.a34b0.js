window.__require = function e(t, o, r) {
function n(i, s) {
if (!o[i]) {
if (!t[i]) {
var u = i.split("/");
u = u[u.length - 1];
if (!t[u]) {
var p = "function" == typeof __require && __require;
if (!s && p) return p(u, !0);
if (a) return a(u, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = u;
}
var m = o[i] = {
exports: {}
};
t[i][0].call(m.exports, function(e) {
return n(t[i][1][e] || e);
}, m, m.exports, e, t, o, r);
}
return o[i].exports;
}
for (var a = "function" == typeof __require && __require, i = 0; i < r.length; i++) n(r[i]);
return n;
}({
MiniGameReturnNavigationTrait: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "b204f68DJlJPYSFzBvEbF2M", "MiniGameReturnNavigationTrait");
var r, n, a = this && this.__extends || (r = function(e, t) {
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
var n, a = arguments.length, i = a < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(e, t, o, r); else for (var s = e.length - 1; s >= 0; s--) (n = e[s]) && (i = (a < 3 ? n(i) : a > 3 ? n(t, o, i) : n(t, o)) || i);
return a > 3 && i && Object.defineProperty(t, o, i), i;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.MiniGameReturnNavigationTrait = void 0;
(function(e) {
e[e.FromHomePageMoreGame = 1] = "FromHomePageMoreGame";
e[e.FromClassSetupMoreGame = 2] = "FromClassSetupMoreGame";
})(n || (n = {}));
var s = function(e) {
a(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.enterSourceType = null;
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "GameLobby_Proxy",
methodName: "onOpenMiniGame"
}, {
className: "Setup_Proxy",
methodName: "onClick_moreGames"
} ];
};
t.prototype.onActive = function(e) {
hs.tp.isGameLobby_ProxyOnOpenMiniGame(e) && this.recordEnterSource();
hs.tp.isSetup_ProxyOnClick_moreGames(e) && this.recordEnterSource();
hs.tp.isGameLobby_DataInfoExitGameLobby(e) && this.handleExitGameLobby(e);
hs.tp.isSetup_ProxyOnClick_exit(e) && this.handleMiniGameExit(e);
if (hs.tp.isJewelFail_ProxyOnExitClick(e)) {
e.replace = !0;
e.returnState = !0;
hs.launchInfo.openChapterModule() ? this.returnToHomePageMoreGamePopup() : this.returnToClassMoreGamePopup();
}
};
t.prototype.recordEnterSource = function() {
hs.gameInfo.gameMode === hs.GameMode.Class && hs.ModuleManager.moduleType === hs.ModuleType.Class ? this.enterSourceType = n.FromClassSetupMoreGame : this.enterSourceType = n.FromHomePageMoreGame;
};
t.prototype.handleExitGameLobby = function(e) {
var t, o = e.args[0], r = null !== (t = this.enterSourceType) && void 0 !== t ? t : n.FromHomePageMoreGame;
o === hs.GameLobbyExitGameType.FromGameResult ? e.args[1] = !1 : r === n.FromClassSetupMoreGame ? e.args[1] = !0 : e.args[1] = !1;
e.returnState = !0;
};
t.prototype.handleMiniGameExit = function(e) {
var t;
if (hs.gameInfo.gameMode == hs.GameMode.Jewel) {
e.replace = !0;
e.returnState = !0;
(null !== (t = this.enterSourceType) && void 0 !== t ? t : n.FromHomePageMoreGame) === n.FromClassSetupMoreGame ? this.returnToClassMoreGamePopup() : this.returnToHomePageMoreGamePopup();
this.enterSourceType = null;
}
};
t.prototype.returnToClassMoreGamePopup = function() {
hs.UI.hideUI(hs.PrefabConfig.Setup);
hs.ModuleManager.setCurrentModuleType(hs.ModuleType.Class);
hs.EventManager.dispatchModuleEvent(new hs.E_HomePage_Game(hs.GameType.Class));
setTimeoutSafe(function() {
hs.UI.show(hs.PrefabConfig.GLHallMoreGamesPopupView, hs.gameAlertLayer);
}, 10);
};
t.prototype.returnToHomePageMoreGamePopup = function() {
hs.UI.hideUI(hs.PrefabConfig.Setup);
hs.EventManager.dispatchModuleEvent(new hs.E_HomePage_Show());
setTimeoutSafe(function() {
hs.UI.show(hs.PrefabConfig.GLHallMoreGamesPopupView, hs.gameAlertLayer);
}, 10);
};
return i([ classId("MiniGameReturnNavigationTrait") ], t);
}(Trait);
o.MiniGameReturnNavigationTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "MiniGameReturnNavigationTrait" ]);
//# sourceMappingURL=index.js.map
