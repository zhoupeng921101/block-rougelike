window.__require = function t(e, o, n) {
function r(s, a) {
if (!o[s]) {
if (!e[s]) {
var h = s.split("/");
h = h[h.length - 1];
if (!e[h]) {
var p = "function" == typeof __require && __require;
if (!a && p) return p(h, !0);
if (i) return i(h, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = h;
}
var c = o[s] = {
exports: {}
};
e[s][0].call(c.exports, function(t) {
return r(e[s][1][t] || t);
}, c, c.exports, t, e, o, n);
}
return o[s].exports;
}
for (var i = "function" == typeof __require && __require, s = 0; s < n.length; s++) r(n[s]);
return r;
}({
G0_FHomeRightDownEntryTrait: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "7ecc3Dey/lPCYYpxmxx1Edq", "G0_FHomeRightDownEntryTrait");
var n, r = this && this.__extends || (n = function(t, e) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
n(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), i = this && this.__decorate || function(t, e, o, n) {
var r, i = arguments.length, s = i < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, o, n); else for (var a = t.length - 1; a >= 0; a--) (r = t[a]) && (s = (i < 3 ? r(s) : i > 3 ? r(e, o, s) : r(e, o)) || s);
return i > 3 && s && Object.defineProperty(e, o, s), s;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.G0_FHomeRightDownEntryTrait = void 0;
var s = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._isReadyShowEntry = !1;
return e;
}
e.prototype.registerTraitEventsMethods = function() {
return [];
};
e.prototype.onActive = function(t) {
var e = this.props.worldId;
hs.tp.isAtomengine4_ProxyOnFeatureListReady(t) && this._triggerPreload();
hs.tp.isHomePage_ProxyShowHomePage(t) && this._triggerPreload();
if (hs.tp.isAtomengine4_ProxyOnPreloadSuccess(t) && t.args[0].rootWorldId === e) {
this._isReadyShowEntry = !0;
this._showEntry(e);
}
hs.tp.isHomePage_Game_ProxyOnEnterClass(t) && hs.atomengine4Info.setHostActive(e, !1);
hs.tp.isHomePage_Game_ProxyOnEnterChapter(t) && hs.atomengine4Info.setHostActive(e, !1);
hs.tp.isAchievement_ProxyOnAchievement_Entrance(t) && hs.atomengine4Info.setHostActive(e, !1);
hs.tp.isGameLobby_DataInfoEnterGameLobby(t) && hs.atomengine4Info.setHostActive(e, !1);
if (hs.tp.isSetupBtnItemRenderComplete(t)) {
var o = t.target;
o && o.state.key === hs.enSetupKeys.home && hs.atomengine4Info.hasEntryRedDot(e) && (o.redNode.active = !0);
}
hs.tp.isClassTopInfoRefreshRedPoint(t) && hs.launchInfo.openChapterModule() && hs.atomengine4Info.hasEntryRedDot(e) && (t.args[1] = !0);
if (hs.tp.isChapterTopInfoBtnInitCompelte(t) && hs.atomengine4Info.hasEntryRedDot(e)) {
var n = t.args[0];
(i = null == n ? void 0 : n.getChildByName("red")) && (i.active = !0);
}
hs.tp.isChapterTopInfo_ProxyOnChapterTopInfoOpen(t) && hs.atomengine4Info.hasEntryRedDot(e) && (r = Cinst(hs.ChapterTopInfoBtn)) && r.setup && (i = r.setup.node.getChildByName("red")) && (i.active = !0);
if (hs.tp.isHomePage_ProxyShowHomePage(t)) {
var r;
if ((r = Cinst(hs.ChapterTopInfoBtn)) && r.setup) {
var i;
(i = r.setup.node.getChildByName("red")) && (i.active = !1);
}
this._isReadyShowEntry && this._showEntry(e);
}
if (hs.tp.isAddMoreGameTraitDoPostProcess(t)) {
this._isReadyShowEntry = !0;
this._showEntry(e);
}
};
e.prototype._showEntry = function(t) {
var e, o = TRAIT("Atomengine4EntryLimitTrait");
if (!o || o.canShowEntry()) {
var n = hs.uiLayer.getChildByName("homePage"), r = n.getChildByName("btn_layout"), i = null == r ? void 0 : r.getChildByName("GameLobbyAddMoreGame"), s = cc.v2(233, 740);
if (i) {
null === (e = r.getComponent(cc.Layout)) || void 0 === e || e.updateLayout();
s.x = i.x + 380;
s.y = i.y + 20;
s = n.convertToNodeSpaceAR(r.convertToWorldSpaceAR(s));
hs.atomengine4Info.showEntry({
rootWorldId: t,
parentNode: n,
position: s
});
}
}
};
e.prototype._triggerPreload = function() {
var t = this.props.worldId;
hs.atomengine4Info.preloadUniverse(t);
};
return i([ classId("G0_FHomeRightDownEntryTrait") ], e);
}(Trait);
o.G0_FHomeRightDownEntryTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "G0_FHomeRightDownEntryTrait" ]);
//# sourceMappingURL=index.js.map
