window.__require = function e(t, n, o) {
function a(r, c) {
if (!n[r]) {
if (!t[r]) {
var h = r.split("/");
h = h[h.length - 1];
if (!t[h]) {
var s = "function" == typeof __require && __require;
if (!c && s) return s(h, !0);
if (i) return i(h, !0);
throw new Error("Cannot find module '" + r + "'");
}
r = h;
}
var u = n[r] = {
exports: {}
};
t[r][0].call(u.exports, function(e) {
return a(t[r][1][e] || e);
}, u, u.exports, e, t, n, o);
}
return n[r].exports;
}
for (var i = "function" == typeof __require && __require, r = 0; r < o.length; r++) a(o[r]);
return a;
}({
ComebackLaunchChangeSkinTrait: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "127dfV3o9ZK9J8gAeKUhSIT", "ComebackLaunchChangeSkinTrait");
var o, a = this && this.__extends || (o = function(e, t) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
o(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), i = this && this.__decorate || function(e, t, n, o) {
var a, i = arguments.length, r = i < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, n) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, n, o); else for (var c = e.length - 1; c >= 0; c--) (a = e[c]) && (r = (i < 3 ? a(r) : i > 3 ? a(t, n, r) : a(t, n)) || r);
return i > 3 && r && Object.defineProperty(t, n, r), r;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.ComebackLaunchChangeSkinTrait = void 0;
var r = function(e) {
a(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._isChangeSkin = !1;
return t;
}
t.prototype.onCreate = function() {
cc.game.on(cc.game.EVENT_SHOW, this._onGameShow, this);
cc.game.on(cc.game.EVENT_HIDE, this._onGameHide, this);
};
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "Launch_Proxy",
methodName: "onTraitConfigInitComplete"
}, {
className: "ClassGame_Proxy",
methodName: "onClassGameShow"
}, {
className: "ChapterGame_Proxy",
methodName: "onChapterGameShow"
} ];
};
t.prototype.onActive = function(e) {
hs.tp.isLaunch_ProxyOnTraitConfigInitComplete(e) && this._coldLaunch();
(hs.tp.isClassGame_ProxyOnClassGameShow(e) || hs.tp.isChapterGame_ProxyOnChapterGameShow(e)) && this._changeSkin();
};
t.prototype._coldLaunch = function() {
var e, t = null !== (e = hs.gameInfo.entryTimeHistory.at(-1)) && void 0 !== e ? e : 0;
this.launchTime > 0 && t > 0 && hs.getDiffDays(this.launchTime, t) > this.props.time && (this._isChangeSkin = !0);
this.launchTime = t;
};
t.prototype._hotLaunch = function() {
hs.getDiffDays(this.launchTime, Date.now()) > this.props.time && (this._isChangeSkin = !0);
this.launchTime = Date.now();
};
t.prototype._changeSkin = function() {
if (this._isChangeSkin) {
this._isChangeSkin = !1;
var e = hs.skinRandomInfo.getRandomSkin(1);
e && e[0] && e[0].ID && hs.EventManager.dispatchModuleEvent(new hs.E_Skin_Update(e[0].ID.toString()));
}
};
t.prototype._onGameShow = function() {
this._hotLaunch();
(hs.UI.activeState(hs.PrefabConfig.ClassGame.url) || hs.UI.activeState("prefabs/game/ChapterGame")) && this._changeSkin();
};
t.prototype._onGameHide = function() {
this.launchTime = Date.now();
};
Object.defineProperty(t.prototype, "launchTime", {
get: function() {
return storage.getItem("ComebackLaunchChangeSkinTrait", 0);
},
set: function(e) {
storage.setItem("ComebackLaunchChangeSkinTrait", e);
},
enumerable: !1,
configurable: !0
});
return i([ classId("ComebackLaunchChangeSkinTrait") ], t);
}(Trait);
n.ComebackLaunchChangeSkinTrait = r;
cc._RF.pop();
}, {} ]
}, {}, [ "ComebackLaunchChangeSkinTrait" ]);
//# sourceMappingURL=index.js.map
