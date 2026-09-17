window.__require = function e(t, n, r) {
function o(a, c) {
if (!n[a]) {
if (!t[a]) {
var u = a.split("/");
u = u[u.length - 1];
if (!t[u]) {
var s = "function" == typeof __require && __require;
if (!c && s) return s(u, !0);
if (i) return i(u, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = u;
}
var m = n[a] = {
exports: {}
};
t[a][0].call(m.exports, function(e) {
return o(t[a][1][e] || e);
}, m, m.exports, e, t, n, r);
}
return n[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < r.length; a++) o(r[a]);
return o;
}({
CommonGameEntrance1Define: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "08756VTGcxAPLw1TihNThaY", "CommonGameEntrance1Define");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.CommonGameDefine = void 0;
(function(e) {
e.DownloadState = {
NONE: 0,
PENDING: 1,
SUCCESS: 2,
FAIL: 3
};
(function(e) {
e[e.DOWNLOAD_ONLY = 1] = "DOWNLOAD_ONLY";
})(e.EntryState || (e.EntryState = {}));
})(n.CommonGameDefine || (n.CommonGameDefine = {}));
cc._RF.pop();
}, {} ],
CommonGameEntrance1Trait: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "7c944ppMWNIt6trM8M0Btvl", "CommonGameEntrance1Trait");
var r, o, i = this && this.__extends || (r = function(e, t) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
r(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), a = this && this.__decorate || function(e, t, n, r) {
var o, i = arguments.length, a = i < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, n) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, r); else for (var c = e.length - 1; c >= 0; c--) (o = e[c]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
return i > 3 && a && Object.defineProperty(t, n, a), a;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.CommonGameEntrance1Trait = void 0;
(function(e) {
e.THREE_BUTTONS = "threeButtons";
e.FOUR_BUTTONS_A = "fourButtonsA";
e.FOUR_BUTTONS_B = "fourButtonsB";
e.DEFAULT = "default";
})(o || (o = {}));
var c = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._redNumberPrefab = null;
t.btnLayoutAdjusted = !1;
return t;
}
t.prototype.onCreate = function() {
var t = this, n = this.computeEntranceState();
e.prototype.setState.call(this, n);
this._preloadResources().then(function() {
var e = TRAIT("CommonGameListDependenciesTrait");
e && e.active && e.setState({
traitId: t.id
});
});
};
t.prototype._preloadResources = function() {
var e = this;
return new Promise(function(t, n) {
hs.ResLoader.loadByBundle(e.traitName, "prefabs/redNumber", cc.Prefab, function(r, o) {
if (!r && cc.isValid(o)) {
e._redNumberPrefab = o;
t();
} else n(r);
});
});
};
t.prototype.computeEntranceState = function() {
return {
layoutMode: o.DEFAULT,
showAchievementInHome: !1,
showStreakInHome: !1,
showAchievementInSetting: !1,
showStreakInSetting: !1,
chapterBtnShow: !0
};
};
Object.defineProperty(t.prototype, "uiReady", {
get: function() {
var e = TRAIT("CommonGameListDependenciesTrait");
return !!(e && e.active && e.state.uiReady);
},
enumerable: !1,
configurable: !0
});
t.prototype.onActive = function(e) {
if (hs.tp.isHomePage_ProxyShowComplete(e)) {
if (!this.uiReady) return;
this.hideWinStreakNode();
this.hideChapterBtn();
}
if (hs.tp.isAddMoreGameTraitDoPostProcess(e)) {
if (!this.uiReady) return;
var t = e.args[0];
this._tryAttachMoreGameBadge(t);
}
if (hs.tp.isGameLobbyGLHallMoreGamesPopupViewOnHide(e)) {
if (!this.uiReady) return;
this._refreshMoreGameBadgeFromHomePage();
}
};
t.prototype._getNewGameCount = function() {
var e = TRAIT("CommonGameListTrait");
if (!(null == e ? void 0 : e.active) || !e.state.output) return 0;
e.setState({});
var t = e.state.output, n = "FilterResult" in t ? t.FilterResult : t;
return (Array.isArray(null == n ? void 0 : n.newGames) ? n.newGames : []).filter(function(e) {
var t;
return (null !== (t = e.clickCount) && void 0 !== t ? t : 0) <= 0;
}).length;
};
t.prototype._tryAttachMoreGameBadge = function(e) {
if (cc.isValid(e)) {
var t = this._getNewGameCount();
if (t <= 0) {
var n = e.getChildByName("CommonGameEntrance1Trait_redNumber");
cc.isValid(n) && (n.active = !1);
} else cc.isValid(this._redNumberPrefab) && function(n) {
var r;
if (cc.isValid(n) && cc.isValid(e)) {
var o = e.getChildByName("CommonGameEntrance1Trait_redNumber");
if (!cc.isValid(o)) {
(o = cc.instantiate(n)).name = "CommonGameEntrance1Trait_redNumber";
e.addChild(o);
o.setPosition(277, 68);
}
o.active = !0;
var i = null === (r = o.getChildByName("label_number")) || void 0 === r ? void 0 : r.getComponent(cc.Label);
cc.isValid(i) && (i.string = "" + t);
}
}(this._redNumberPrefab);
}
};
t.prototype._refreshMoreGameBadgeFromHomePage = function() {
var e, t, n = Cinst(hs.HomePage);
if (n && cc.isValid(n.node)) {
var r = null === (t = null === (e = null == n ? void 0 : n.node) || void 0 === e ? void 0 : e.getChildByName("btn_layout")) || void 0 === t ? void 0 : t.getChildByName("GameLobbyAddMoreGame");
this._tryAttachMoreGameBadge(r);
}
};
t.prototype.hideChapterBtn = function() {
var e = TRAIT("CommonGameListTrait");
if (null == e ? void 0 : e.active) {
var t = Cinst(hs.HomePage);
if (t && cc.isValid(t.node)) {
var n = cc.find("btn_layout/btn_JourneyLoading", t.node);
n && cc.isValid(n) && (n.active = !e.checkChapterInList());
}
}
};
t.prototype.hideWinStreakNode = function() {
var e = Cinst(hs.HomePage);
if (e && cc.isValid(e.node)) {
var t = e.node.getChildByName("winStreak");
if (t && cc.isValid(t)) {
if (t.active) {
t.active = !1;
t.opacity = 0;
}
if (!this.btnLayoutAdjusted) {
var n = e.node.getChildByName("btn_layout");
if (n && cc.isValid(n)) {
n.y += n.height / 2 + 10;
this.btnLayoutAdjusted = !0;
}
}
}
}
};
return a([ classId("CommonGameEntrance1Trait") ], t);
}(Trait);
n.CommonGameEntrance1Trait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "CommonGameEntrance1Define", "CommonGameEntrance1Trait" ]);
//# sourceMappingURL=index.js.map
