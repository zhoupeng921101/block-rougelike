window.__require = function e(t, n, o) {
function r(s, a) {
if (!n[s]) {
if (!t[s]) {
var d = s.split("/");
d = d[d.length - 1];
if (!t[d]) {
var h = "function" == typeof __require && __require;
if (!a && h) return h(d, !0);
if (i) return i(d, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = d;
}
var l = n[s] = {
exports: {}
};
t[s][0].call(l.exports, function(e) {
return r(t[s][1][e] || e);
}, l, l.exports, e, t, n, o);
}
return n[s].exports;
}
for (var i = "function" == typeof __require && __require, s = 0; s < o.length; s++) r(o[s]);
return r;
}({
G0_FXingYunListEntryTrait: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "29ab4yKS+dJIKwmH5xjX8rn", "G0_FXingYunListEntryTrait");
var o, r = this && this.__extends || (o = function(e, t) {
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
var r, i = arguments.length, s = i < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, n) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, n, o); else for (var a = e.length - 1; a >= 0; a--) (r = e[a]) && (s = (i < 3 ? r(s) : i > 3 ? r(t, n, s) : r(t, n)) || s);
return i > 3 && s && Object.defineProperty(t, n, s), s;
}, s = this && this.__read || function(e, t) {
var n = "function" == typeof Symbol && e[Symbol.iterator];
if (!n) return e;
var o, r, i = n.call(e), s = [];
try {
for (;(void 0 === t || t-- > 0) && !(o = i.next()).done; ) s.push(o.value);
} catch (e) {
r = {
error: e
};
} finally {
try {
o && !o.done && (n = i.return) && n.call(i);
} finally {
if (r) throw r.error;
}
}
return s;
}, a = this && this.__spread || function() {
for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(s(arguments[t]));
return e;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.G0_FXingYunListEntryTrait = void 0;
var d = function(e) {
r(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.registerTraitEventsMethods = function() {
return [];
};
t.prototype.onActive = function(e) {
var t, n, o = this, r = this.props.worldId;
hs.tp.isAtomengine4_ProxyOnFeatureListReady(e) && this._triggerPreload();
hs.tp.isHomePage_ProxyShowHomePage(e) && this._triggerPreload();
if (hs.tp.isHomePage_ProxyShowHomePage(e)) {
var i = hs.atomengine4Info.hasEntryRedDot(r);
hs.gameLobby_DataInfo.setIsRed(!i);
}
if (hs.tp.isHomePage_Game_ProxyOnEnterClass(e)) {
i = hs.atomengine4Info.hasEntryRedDot(r);
hs.gameLobby_DataInfo.setIsRed(!i);
}
hs.tp.isGameLobbyGLHallMoreGamesPopupViewGetLobbyGameList(e) && this._isReadyShowEntry && this._addGameConfigToList(e);
if (hs.tp.isGameLobbyGLHallMoreGamesPopupViewOnShow(e)) {
var s = e, a = s.target, d = null === (t = s.target.nodeScrollView) || void 0 === t ? void 0 : t.getComponent(cc.ScrollView);
if (!d || !d.content) return;
a.scheduleOnce(function() {
cc.isValid(null == d ? void 0 : d.content) && o._addEntryToList(null == d ? void 0 : d.content);
}, 0);
}
if (hs.tp.isGameLobbyGLHallMoreGamesPopupViewOnHide(e)) if (hs.atomengine4Info.hasEntryRedDot(r)) {
hs.gameLobby_DataInfo.setIsRed(!1);
this._refreshMoreGameBtnRedDot(!0);
} else {
hs.gameLobby_DataInfo.setIsRed(!0);
this._refreshMoreGameBtnRedDot(!1);
}
if (hs.tp.isSetup_ProxyOnClick_moreGames(e) && hs.atomengine4Info.hasEntryRedDot(r)) {
hs.atomengine4Info.clearEntryRedDot(r);
var h = Cinst(hs.Setup);
if (cc.isValid(null == h ? void 0 : h.node)) {
var l = null === (n = h.node.getComponentsInChildren(hs.SetupBtnItem)) || void 0 === n ? void 0 : n.find(function(e) {
return e.state.key === hs.enSetupKeys.moreGames;
});
l && l.redNode && (l.redNode.active = !1);
}
}
if (hs.tp.isSetupBtnItemRenderComplete(e)) {
var p = e.target;
p && p.state.key === hs.enSetupKeys.moreGames && (p.redNode.active = hs.atomengine4Info.hasEntryRedDot(r));
}
hs.tp.isClassTopInfoRefreshRedPoint(e) && hs.launchInfo.openChapterModule() && hs.atomengine4Info.hasEntryRedDot(r) && (e.args[1] = !0);
if (hs.tp.isChapterTopInfoBtnInitCompelte(e) && hs.atomengine4Info.hasEntryRedDot(r)) {
var f = e.args[0];
(c = null == f ? void 0 : f.getChildByName("red")) && (c.active = !0);
}
hs.tp.isChapterTopInfo_ProxyOnChapterTopInfoOpen(e) && hs.atomengine4Info.hasEntryRedDot(r) && (u = Cinst(hs.ChapterTopInfoBtn)) && u.setup && (c = u.setup.node.getChildByName("red")) && (c.active = !0);
if (hs.tp.isHomePage_ProxyShowHomePage(e)) {
var u;
if ((u = Cinst(hs.ChapterTopInfoBtn)) && u.setup) {
var c;
(c = u.setup.node.getChildByName("red")) && (c.active = !1);
}
}
};
t.prototype._addGameConfigToList = function(e) {
var t = this.props, n = t.gameItemConfig, o = t.insertBeforeIndex;
if (n) {
var r = {
name: n.name,
bundle: n.bundle || "",
cover: n.cover || "",
weight: n.weight || 100,
resName: n.resName || ""
}, i = e.args[0];
if (void 0 !== o && o >= 0) {
var s = Math.min(o, i.length);
e.args[0] = a(i.slice(0, s), [ r ], i.slice(s));
} else e.args[0] = a([ r ], i);
}
};
t.prototype._refreshMoreGameBtnRedDot = function(e) {
this.props.worldId;
var t, n = hs.uiLayer.getChildByName("homePage"), o = null == n ? void 0 : n.getChildByName("btn_layout"), r = null == o ? void 0 : o.getChildByName("GameLobbyAddMoreGame"), i = null == r ? void 0 : r.getChildByName("red");
i && (i.active = e);
var s = Cinst(hs.Setup);
if (cc.isValid(null == s ? void 0 : s.node)) {
var a = null === (t = s.node.getComponentsInChildren(hs.SetupBtnItem)) || void 0 === t ? void 0 : t.find(function(e) {
return e.state.key === hs.enSetupKeys.moreGames;
});
a && a.redNode && (a.redNode.active = e);
}
};
t.prototype._addEntryToList = function(e) {
var t = this.props, n = t.worldId, o = t.insertBeforeIndex;
if (cc.isValid(e)) {
var r = e.getChildByName(n);
if (r && cc.isValid(r)) ; else {
var i, s = e.children, a = {
x: 0,
y: 0
};
if (void 0 !== o && o >= 0 && o < s.length) {
var d = s[o];
a.x = d.x;
a.y = d.y;
i = o;
} else if (s.length > 0) {
var h = s[s.length - 1];
a.x = h.x;
a.y = h.y - h.height - 20;
}
this._isReadyShowEntry = !0;
hs.atomengine4Info.showEntry({
rootWorldId: n,
parentNode: e,
position: a,
siblingIndex: i,
isAlert: !0,
containerSize: {
width: 620,
height: 146
}
});
}
}
};
t.prototype._triggerPreload = function() {
var e = this.props.worldId;
hs.atomengine4Info.preloadUniverse(e);
};
return i([ classId("G0_FXingYunListEntryTrait") ], t);
}(Trait);
n.G0_FXingYunListEntryTrait = d;
cc._RF.pop();
}, {} ]
}, {}, [ "G0_FXingYunListEntryTrait" ]);
//# sourceMappingURL=index.js.map
