window.__require = function e(t, i, o) {
function n(r, s) {
if (!i[r]) {
if (!t[r]) {
var l = r.split("/");
l = l[l.length - 1];
if (!t[l]) {
var c = "function" == typeof __require && __require;
if (!s && c) return c(l, !0);
if (a) return a(l, !0);
throw new Error("Cannot find module '" + r + "'");
}
r = l;
}
var d = i[r] = {
exports: {}
};
t[r][0].call(d.exports, function(e) {
return n(t[r][1][e] || e);
}, d, d.exports, e, t, i, o);
}
return i[r].exports;
}
for (var a = "function" == typeof __require && __require, r = 0; r < o.length; r++) n(o[r]);
return n;
}({
CommonGameListUI2Item: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "5e6e9uLfBlIG4yAubdAMYBI", "CommonGameListUI2Item");
var o, n = this && this.__extends || (o = function(e, t) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
})(e, t);
}, function(e, t) {
o(e, t);
function i() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (i.prototype = t.prototype, new i());
}), a = this && this.__decorate || function(e, t, i, o) {
var n, a = arguments.length, r = a < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, i) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, i, o); else for (var s = e.length - 1; s >= 0; s--) (n = e[s]) && (r = (a < 3 ? n(r) : a > 3 ? n(t, i, r) : n(t, i)) || r);
return a > 3 && r && Object.defineProperty(t, i, r), r;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
var r = e("./CommonGameListUI2Types"), s = cc._decorator, l = s.ccclass, c = s.property, d = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.keepTimeNode = null;
t.keepTimeLabel = null;
t.progress = null;
t.newNode = null;
t._bg = null;
t._countdownRemaining = 0;
t._countdownTimer = null;
t._onLoadStateChange = null;
t._hasReportShow = !1;
t._lastReportGameName = null;
return t;
}
i = t;
t.prototype._registerLoadStateListener = function() {
var e = this;
if (!this._onLoadStateChange && this.state.updateEmitter && this.state.info && this.state.info.download !== r.common_game.DownloadState.SUCCESS) {
this._onLoadStateChange = function(t) {
var i, o, n;
if ((null === (o = null === (i = e.state) || void 0 === i ? void 0 : i.info) || void 0 === o ? void 0 : o.gameName) === t.gameName) {
var a = null !== (n = t.progress) && void 0 !== n ? n : t.total > 0 ? t.finish / t.total : 0;
t.state === r.common_game.DownloadState.SUCCESS && (a = 1);
e._updateProgress(a);
}
};
this.state.updateEmitter.event(this._onLoadStateChange);
}
};
t.prototype.setState = function(t, i, o) {
e.prototype.setState.call(this, t, i, o);
this._registerLoadStateListener();
};
t.prototype._ensureRefs = function() {
var e, t, i, o;
if (!this._bg) {
var n = null === (e = this.node.getChildByName("nodeRoot")) || void 0 === e ? void 0 : e.getChildByName("bg");
n && (this._bg = n.getComponent(cc.Sprite));
}
this.keepTimeNode || (this.keepTimeNode = null === (t = this.node.getChildByName("nodeRoot")) || void 0 === t ? void 0 : t.getChildByName("keepTimeNode"));
if (!this.keepTimeLabel && this.keepTimeNode) {
var a = this.keepTimeNode.getChildByName("keepTimeLabel");
a && (this.keepTimeLabel = a.getComponent(cc.Label));
}
this.newNode || (this.newNode = null === (i = this.node.getChildByName("nodeRoot")) || void 0 === i ? void 0 : i.getChildByName("nodeRed"));
if (!this.progress) {
var r = null === (o = this.node.getChildByName("nodeRoot")) || void 0 === o ? void 0 : o.getChildByName("loading");
r && (this.progress = r.getComponent(cc.Mask));
}
};
t.prototype.render = function() {
var e, t, o, n, a;
this._ensureRefs();
var s = this.state.info;
if (s && this._lastReportGameName !== s.gameName) {
this._hasReportShow = !1;
this._lastReportGameName = s.gameName;
}
if (s && !this._hasReportShow) {
var l = s.timestamp + 864e5 * s.duringTime, c = (Math.max(0, l - Date.now()), hs.atomengine4Info.getCommonGameTrackParams(s));
if (c) {
this._hasReportShow = !0;
this.state.shouldReportShow && !this.state.shouldReportShow(s.gameName, 2) || DS("ui_theme_adventure_show", {
game_type: c.game_type,
game_subtype: c.game_subtype,
button_position: 2,
is_download_complete: s.download === r.common_game.DownloadState.SUCCESS ? 1 : 0
});
}
}
var d = (this.state.entryAssets || [])[0];
d && cc.isValid(this._bg) && (this._bg.spriteFrame = d);
var m = this.isNewTag(s);
cc.isValid(this.newNode) && (this.newNode.active = m);
if (m) {
cc.isValid(this.keepTimeNode) && (this.keepTimeNode.active = !1);
this._stopCountdown();
} else this._updateKeepTime();
if (this.progress && this.progress.node) if ((null === (e = this.state.info) || void 0 === e ? void 0 : e.download) === r.common_game.DownloadState.SUCCESS) this.progress.node.active = !1; else if ((null === (t = this.state.info) || void 0 === t ? void 0 : t.isManualDownload) && (null === (o = this.state.info) || void 0 === o ? void 0 : o.download) === r.common_game.DownloadState.PENDING) {
this.progress.node.active = !0;
this._updateProgress(null !== (a = i._lastProgress[null === (n = this.state.info) || void 0 === n ? void 0 : n.gameName]) && void 0 !== a ? a : 0);
} else this.progress.node.active = !1;
};
t.prototype._updateKeepTime = function() {
this._stopCountdown();
if (this.keepTimeNode && this.keepTimeLabel) {
var e = this.state.info;
if (!e || e.duringTime < 0) this.keepTimeNode.active = !1; else {
var t = e.timestamp + 864e5 * e.duringTime - Date.now();
if (t <= 0) this.keepTimeNode.active = !1; else {
this._countdownRemaining = Math.floor(t / 1e3);
this.keepTimeNode.active = !0;
this._refreshCountdownLabel();
this._countdownRemaining > 0 && this._scheduleNextTick();
}
}
}
};
t.prototype._refreshCountdownLabel = function() {
cc.isValid(this.keepTimeLabel) && (this.keepTimeLabel.string = this._formatCountdownTime(this._countdownRemaining));
};
t.prototype.isNewTag = function(e) {
var t;
return e && (null !== (t = e.clickCount) && void 0 !== t ? t : 0) <= 0;
};
t.prototype._formatCountdownTime = function(e) {
var t = e, i = Math.floor(t / 86400);
t -= 86400 * i;
var o = Math.floor(t / 3600);
t -= 3600 * o;
var n = Math.floor(t / 60), a = t -= 60 * n;
return i > 0 ? i + "d" + o + "h" : o > 0 ? o + "h" + Math.floor(e % 3600 / 60) + "m" : n + "m" + a + "s";
};
t.prototype._scheduleNextTick = function() {
var e = this;
this._countdownTimer = setTimeoutSafe(function() {
if (cc.isValid(e.node)) {
e._countdownRemaining--;
e._refreshCountdownLabel();
if (e._countdownRemaining <= 0) {
e._countdownTimer = null;
cc.isValid(e.keepTimeNode) && (e.keepTimeNode.active = !1);
} else e._scheduleNextTick();
} else e._stopCountdown();
}, 1e3);
};
t.prototype._stopCountdown = function() {
if (null !== this._countdownTimer) {
clearTimeout(this._countdownTimer);
this._countdownTimer = null;
}
};
t.prototype.onDisable = function() {
this._stopCountdown();
this._hasReportShow = !1;
this._lastReportGameName = null;
};
t.prototype.onDestroy = function() {
this._stopCountdown();
};
t.prototype._updateProgress = function(e) {
var t;
if (this.progress && (null === (t = this.state.info) || void 0 === t ? void 0 : t.isManualDownload) && !(e < i._lastProgress[this.state.info.gameName])) {
i._lastProgress[this.state.info.gameName] = e;
this.progress.node.active = e < 1;
this.progress.node.width = 800 * (1 - e);
}
};
t.prototype.onClick = function() {
var e;
this.newNode && cc.isValid(this.newNode) && (this.newNode.active = !1);
null === (e = this.state.entryEmitter) || void 0 === e || e.fire({
gameName: this.state.info.gameName
});
if (this.state.entryEmitter) {
var t = this.state.info;
if (t) {
var i = hs.atomengine4Info.getCommonGameTrackParams(t);
i && DS("ui_theme_adventure_click", {
game_type: i.game_type,
game_subtype: i.game_subtype,
button_position: 2,
is_download_complete: 2 === t.download ? 1 : 0,
resource_version: this.getClickResourceVersion(t)
});
}
}
};
t.prototype.getClickResourceVersion = function(e) {
if ("DT" !== (null == e ? void 0 : e.gameName)) return "";
var t = TRAIT("MahjongMoreGameEntryTrait");
return (null == t ? void 0 : t.active) && "function" == typeof t.getDoubleTileCommonGameVersion && t.getDoubleTileCommonGameVersion() || "";
};
var i;
t._lastProgress = {};
a([ c(cc.Node) ], t.prototype, "keepTimeNode", void 0);
a([ c(cc.Label) ], t.prototype, "keepTimeLabel", void 0);
a([ c(cc.Mask) ], t.prototype, "progress", void 0);
a([ c(cc.Node) ], t.prototype, "newNode", void 0);
return i = a([ l, classMethodWatch() ], t);
}(hs.Component);
i.default = d;
cc._RF.pop();
}, {
"./CommonGameListUI2Types": "CommonGameListUI2Types"
} ],
CommonGameListUI2Trait: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "88e49fm1P5PBKHHPRRowvSr", "CommonGameListUI2Trait");
var o, n = this && this.__extends || (o = function(e, t) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
})(e, t);
}, function(e, t) {
o(e, t);
function i() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (i.prototype = t.prototype, new i());
}), a = this && this.__decorate || function(e, t, i, o) {
var n, a = arguments.length, r = a < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, i) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, i, o); else for (var s = e.length - 1; s >= 0; s--) (n = e[s]) && (r = (a < 3 ? n(r) : a > 3 ? n(t, i, r) : n(t, i)) || r);
return a > 3 && r && Object.defineProperty(t, i, r), r;
}, r = this && this.__values || function(e) {
var t = "function" == typeof Symbol && Symbol.iterator, i = t && e[t], o = 0;
if (i) return i.call(e);
if (e && "number" == typeof e.length) return {
next: function() {
e && o >= e.length && (e = void 0);
return {
value: e && e[o++],
done: !e
};
}
};
throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, s = this && this.__read || function(e, t) {
var i = "function" == typeof Symbol && e[Symbol.iterator];
if (!i) return e;
var o, n, a = i.call(e), r = [];
try {
for (;(void 0 === t || t-- > 0) && !(o = a.next()).done; ) r.push(o.value);
} catch (e) {
n = {
error: e
};
} finally {
try {
o && !o.done && (i = a.return) && i.call(a);
} finally {
if (n) throw n.error;
}
}
return r;
}, l = this && this.__spread || function() {
for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(s(arguments[t]));
return e;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
i.CommonGameListUI2Trait = void 0;
var c = e("./CommonGameListUI2Item"), d = {
adventure: "chapter",
blockSlide: "gl_blockslide",
waterSort: "gl_watersort",
oneLine: "gl_oneline",
mahjong: "gl_mahjong",
onet: "gl_onet",
fruitMerge: "gl_fruit",
ticTacToe: "gl_tictactoe",
sudoku: "gl_sudoku",
2248: "G5",
arrows: "G3",
sandCrush: "gl_sand",
blast_Io: "G2"
}, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._itemPrefab = null;
t._separatorPrefab = null;
t._innerGameSFMap = new Map();
t._itemList = [];
t._ui2Prefab = null;
t._ui2Node = null;
t._contentGuardOff = null;
t._tipsPrefab = null;
t._tipsNode = null;
t._minRemainingTime = null;
t._isRendering = !1;
t._assetsLoaded = !1;
t._assetsLoadPromise = null;
t._reportedShowKeys = new Set();
t._shouldReportShow = function(e, i) {
if (!e) return !1;
var o = i + ":" + e;
if (t._reportedShowKeys.has(o)) return !1;
t._reportedShowKeys.add(o);
return !0;
};
return t;
}
i = t;
t.prototype.onCreate = function() {
var e = this;
this._loadAllAssets().then(function(t) {
if (t) {
var i = TRAIT("CommonGameListDependenciesTrait");
i && i.active && i.setState({
traitId: e.id
});
}
});
};
t.prototype.onActive = function(e) {
hs.tp.isGameLobbyGLHallMoreGamesPopupViewAddSkinBg(e) && this._onAddSkinBg(e);
hs.tp.isGameLobbyGLHallMoreGamesPopupViewOnShow(e) && this._onPopupShowOrRefresh(e, !0);
hs.tp.isGameLobbyGLHallMoreGamesPopupViewRefreshGameList(e) && this._onPopupShowOrRefresh(e, !1);
};
t.prototype._onAddSkinBg = function(e) {
this._isUIReady() && (e.replace = !0);
};
t.prototype._onPopupShowOrRefresh = function(e, t) {
if (this._isUIReady()) {
t && this._resetPopupShowReports();
var i = TRAIT("CommonGameListTrait");
e.replace = !0;
i.setState({});
this._onPopupShow(e, i);
}
};
t.prototype._isUIReady = function() {
var e = TRAIT("CommonGameListTrait"), t = TRAIT("CommonGameListDependenciesTrait");
return (null == e ? void 0 : e.active) && e.state.output && t && t.active && t.state.uiReady;
};
t.prototype._resetPopupShowReports = function() {
this._reportedShowKeys.clear();
};
t.prototype._onPopupShow = function(e, t) {
var i = this, o = e.target, n = o.nodeScrollView, a = o.nodeBg;
if (cc.isValid(n)) {
var r = n.getComponent(cc.ScrollView);
if (r && !this._isRendering) {
this._isRendering = !0;
if (this._assetsLoaded && cc.isValid(this._itemPrefab)) {
this._doRender(a, n, r, t);
this._isRendering = !1;
} else this._loadAllAssets().then(function(e) {
if (e && cc.isValid(n) && cc.isValid(a) && cc.isValid(r)) if (cc.isValid(i._itemPrefab)) {
i._doRender(a, n, r, t);
i._isRendering = !1;
} else i._isRendering = !1; else i._isRendering = !1;
});
}
}
};
t.prototype._doRender = function(e, t, i, o) {
var n;
if ((null == o ? void 0 : o.active) && (null === (n = o.state) || void 0 === n ? void 0 : n.output)) {
o.setState({
input: o.state.input
});
this._applyFullScreenUI(e, t);
this._renderList(i, o);
this._guardContent(i.content);
this._showTips(t);
t.active = !0;
hs.storage.setItem("isShow_GLHallMoreGamesPopupView", 1);
}
};
t.prototype._guardContent = function(e) {
if (this._contentGuardOff) {
this._contentGuardOff();
this._contentGuardOff = null;
}
if (cc.isValid(e)) {
var t = function(e) {
return e.getComponent(c.default) || e.__ui2_owner__;
}, i = function() {
if (cc.isValid(e)) for (var i = e.children, o = i.length - 1; o >= 0; o--) {
var n = i[o];
if (!t(n)) {
n.removeFromParent();
n.destroy();
}
}
};
i();
var o = function() {
i();
};
e.on(cc.Node.EventType.CHILD_ADDED, o);
this._contentGuardOff = function() {
e.off(cc.Node.EventType.CHILD_ADDED, o);
};
}
};
t.prototype.matchList = function(e, t) {
e.removeFromParent(!1);
var i = t.getChildByName("list_container");
if (!i) {
(i = new cc.Node()).name = "list_container";
t.addChild(i);
var o = i.getComponent(cc.Widget) || i.addComponent(cc.Widget);
o.left = 0;
o.isAlignLeft = !0;
o.right = 0;
o.isAlignRight = !0;
o.top = 270;
o.isAlignTop = !0;
o.bottom = 160;
o.isAlignBottom = !0;
o.updateAlignment();
}
i.addChild(e);
var n = e.getComponent(cc.Widget) || e.addComponent(cc.Widget);
n.left = 0;
n.isAlignLeft = !0;
n.right = 0;
n.isAlignRight = !0;
n.top = 0;
n.isAlignTop = !0;
n.bottom = 0;
n.isAlignBottom = !0;
n.updateAlignment();
var a = e.getChildByName("view");
if (a) {
var r = a.getComponent(cc.Widget) || a.addComponent(cc.Widget);
r.left = 0;
r.isAlignLeft = !0;
r.right = 0;
r.isAlignRight = !0;
r.top = 0;
r.isAlignTop = !0;
r.bottom = 0;
r.isAlignBottom = !0;
r.updateAlignment();
}
};
t.prototype._applyFullScreenUI = function(e, t) {
if (cc.isValid(this._ui2Node)) {
this._ui2Node.active = !0;
e.active = !1;
} else if (cc.isValid(this._ui2Prefab) && cc.isValid(e)) {
var i = e.parent;
if (cc.isValid(i)) {
var o = cc.instantiate(this._ui2Prefab), n = o.getChildByName("New ScrollView");
n && n.destroy();
var a = o.getChildByName("midContainer");
a && a.destroy();
i.addChild(o);
o.setSiblingIndex(e.getSiblingIndex());
this.matchList(t, o);
var r = o.getChildByName("topContainer");
if (r) {
var s = r.getChildByName("backBtn");
if (s) {
var l = s.getComponent(cc.Button);
l && (l.clickEvents = []);
s.on("click", function() {
if (cc.isValid(i)) {
var e = i.getComponent("GameLobbyGLHallMoreGamesPopupView");
e && "function" == typeof e.onClickedClose && e.onClickedClose();
}
});
}
}
e.active = !1;
this._ui2Node = o;
}
}
};
t.prototype._renderList = function(e, t) {
var i, o = this;
if (this._contentGuardOff) {
this._contentGuardOff();
this._contentGuardOff = null;
}
var n = e.content;
if (cc.isValid(n)) {
this._setupLayout(n);
for (var a = t.state.output || {
newGames: [],
playedGames: [],
randomGames: []
}, r = a.newGames, s = a.playedGames, l = a.randomGames, d = [], m = [], p = n.children, u = p.length - 1; u >= 0; u--) {
var h = p[u];
h.removeFromParent(!1);
h.getComponent(c.default) ? d.push(h) : "separator" === h.name && h.__ui2_owner__ ? m.push(h) : h.destroy();
}
this._itemList = [];
var f = new Set(), _ = 0, g = 0, v = function(e) {
if (!f.has(e.gameName)) {
var i = o._getEntryAssets(e.gameName);
if (i[0]) {
f.add(e.gameName);
var a;
if (_ < d.length) {
a = d[_];
_++;
} else a = cc.instantiate(o._itemPrefab);
a.active = !0;
n.addChild(a);
var r = a.getComponent(c.default);
r || (r = a.addComponent(c.default));
a.name = e.gameName;
a.off("click", o._onClickItem, o);
a.on("click", o._onClickItem, o);
r.setState({
info: e,
selected: !1,
entryAssets: i,
updateEmitter: t.state.updateEmitter,
entryEmitter: t.state.entryEmitter,
shouldReportShow: o._shouldReportShow
});
o._itemList.push(r);
}
}
};
(r || []).forEach(function(e) {
return v(e);
});
var y = (s || []).filter(function(e) {
return !f.has(e.gameName);
});
if (y.length > 0) {
(function() {
var e;
if (g < m.length) {
e = m[g];
g++;
} else e = o._makeSeparator();
e.active = !0;
n.addChild(e);
})();
var w = !1, C = y.find(function(e) {
return "chapter" === e.gameName;
});
C && (w = (null !== (i = null == C ? void 0 : C.clickCount) && void 0 !== i ? i : 0) < 1);
w && v(C);
y.forEach(function(e) {
w && "chapter" === e.gameName || v(e);
});
} else l && l.length > 0 && l.forEach(function(e) {
return v(e);
});
var T = d.length;
for (u = _; u < T; u++) d[u].destroy();
var L = m.length;
for (u = g; u < L; u++) m[u].destroy();
}
};
t.prototype._setupLayout = function(e) {
var t = e.getComponent(cc.Layout);
t || (t = e.addComponent(cc.Layout));
t.type = cc.Layout.Type.VERTICAL;
t.resizeMode = cc.Layout.ResizeMode.CONTAINER;
t.paddingTop = 94;
t.paddingBottom = 168;
t.spacingY = 48;
};
t.prototype._loadAllAssets = function() {
var e = this;
if (this._assetsLoaded) return Promise.resolve(!0);
if (this._assetsLoadPromise) return this._assetsLoadPromise;
this._assetsLoadPromise = new Promise(function(t) {
hs.ResLoader.asyncLoadBundle(e.traitName).then(function(i) {
if (i) {
var o = 0, n = function() {
if (++o >= 5) {
e._assetsLoaded = cc.isValid(e._itemPrefab);
e._assetsLoaded || (e._assetsLoadPromise = null);
t(e._assetsLoaded);
}
};
i.loadDir("image", cc.SpriteFrame, function(i, o) {
var a, s;
if (i) return t(!1);
try {
for (var l = r(o), c = l.next(); !c.done; c = l.next()) {
var m = c.value;
if (cc.isValid(m)) {
var p = m.name;
if (p.startsWith("btn_") && p.endsWith("_big")) {
var u = p.slice(4, p.length - 4), h = d[u];
if (h) {
var f = e._innerGameSFMap.get(h) || [];
f[0] = m;
e._innerGameSFMap.set(h, f);
}
}
}
}
} catch (e) {
a = {
error: e
};
} finally {
try {
c && !c.done && (s = l.return) && s.call(l);
} finally {
if (a) throw a.error;
}
}
n();
});
i.load("prefabs/CommonGameListUI2Item", cc.Prefab, function(i, o) {
if (i || !cc.isValid(o)) return t(!1);
e._itemPrefab = o;
n();
});
i.load("prefabs/split_line", cc.Prefab, function(i, o) {
if (i || !cc.isValid(o)) return t(!1);
e._separatorPrefab = o;
n();
});
i.load("prefabs/CommonGameListUI2", cc.Prefab, function(i, o) {
if (i || !cc.isValid(o)) return t(!1);
e._ui2Prefab = o;
n();
});
i.load("prefabs/tips", cc.Prefab, function(i, o) {
if (i || !cc.isValid(o)) return t(!1);
e._tipsPrefab = o;
n();
});
} else {
e._assetsLoadPromise = null;
t(!1);
}
}).catch(function() {
e._assetsLoadPromise = null;
t(!1);
});
});
return this._assetsLoadPromise;
};
t.prototype._getEntryAssets = function(e) {
return this._innerGameSFMap.get(e) || [];
};
t.prototype._makeSeparator = function() {
var e;
if (cc.isValid(this._separatorPrefab)) e = cc.instantiate(this._separatorPrefab); else {
(e = new cc.Node()).height = 36;
var t = e.addComponent(cc.Label);
t.string = "Played";
t.fontSize = 26;
t.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
e.color = new cc.Color(180, 180, 180, 200);
}
e.name = "separator";
e.__ui2_owner__ = !0;
return e;
};
t.prototype._onClickItem = function(e) {
var t = (e instanceof cc.Node ? e : e.node).getComponent(c.default);
t && this._handleGameEntry(t);
};
t.prototype._handleGameEntry = function(e) {
var t;
if (null === (t = e.state) || void 0 === t ? void 0 : t.info) {
for (var i = this._itemList.length, o = 0; o < i; o++) this._itemList[o].setState({
selected: this._itemList[o] === e
});
e.onClick();
}
};
t.prototype._showTips = function(e) {
var t = this;
if (cc.isValid(e) && cc.isValid(e.parent) && this._checkTipsShow()) {
var i = e.parent;
if (cc.isValid(this._tipsNode)) {
if (this._tipsNode.parent !== i) {
this._tipsNode.removeFromParent(!1);
i.addChild(this._tipsNode);
}
this._setTipsLabelTime(this._tipsNode);
this._playTipsTween(this._tipsNode);
} else {
var o = this.traitName, n = function(e) {
if (cc.isValid(e) && cc.isValid(i)) {
t._tipsNode = cc.instantiate(e);
i.addChild(t._tipsNode);
t._setTipsLabelTime(t._tipsNode);
t._playTipsTween(t._tipsNode);
}
};
cc.isValid(this._tipsPrefab) ? n(this._tipsPrefab) : hs.ResLoader.loadByBundle(o, "prefabs/tips", cc.Prefab, function(e, i) {
if (!e && cc.isValid(i)) {
t._tipsPrefab = i;
n(i);
}
});
}
}
};
t.prototype._setTipsLabelTime = function(e) {
if (cc.isValid(e)) {
var t = e.getChildByName("label_time"), i = null == t ? void 0 : t.getComponent(cc.Label);
cc.isValid(i) && (this._minRemainingTime ? i.string = this._minRemainingTime.day + " d " + this._minRemainingTime.hour + "h " + this._minRemainingTime.minute + " min " : i.string = "");
}
};
t.prototype._playTipsTween = function(e) {
if (cc.isValid(e)) {
e.stopAllActions();
e.active = !0;
e.opacity = 255;
cc.tween(e).delay(.6).to(.2, {
opacity: 0
}).call(function() {
cc.isValid(e) && (e.active = !1);
}).start();
}
};
t.prototype._checkTipsShow = function() {
if (i._hasShownTipsInSession) return !1;
var e = this._getGameInfoList(), t = this._getMinRemainingTime(e);
if (!t) {
this._minRemainingTime = null;
return !1;
}
t.day < 2 && (this._minRemainingTime = t);
i._hasShownTipsInSession = !0;
return !0;
};
t.prototype._getGameInfoList = function() {
var e = TRAIT("CommonGameListTrait");
if (!(null == e ? void 0 : e.active) || !e.state.output) return [];
var t = e.state.output.newGames || [], i = e.state.output.playedGames || [], o = l(t, i);
if (o.length > 0) return o;
var n = e.state.output.randomGames || [];
return n.length > 0 ? n : [];
};
t.prototype._getMinRemainingTime = function(e) {
var t, i;
if (!Array.isArray(e) || 0 === e.length) return null;
var o = null, n = Number.MAX_SAFE_INTEGER;
try {
for (var a = r(e), s = a.next(); !s.done; s = a.next()) {
var l = s.value, c = this._getRemainingTime(l);
if (c) {
var d = 1440 * c.day + 60 * c.hour + c.minute;
if (!(d <= 0) && d < n) {
n = d;
o = c;
}
}
}
} catch (e) {
t = {
error: e
};
} finally {
try {
s && !s.done && (i = a.return) && i.call(a);
} finally {
if (t) throw t.error;
}
}
return o;
};
t.prototype._getRemainingTime = function(e) {
if (-1 === e.duringTime) return null;
var t = e.timestamp + 864e5 * e.duringTime, i = Math.max(0, t - Date.now());
return i >= 1728e5 ? null : {
day: Math.floor(i / 864e5),
hour: Math.floor(i % 864e5 / 36e5),
minute: Math.floor(i % 36e5 / 6e4)
};
};
var i;
t._hasShownTipsInSession = !1;
a([ hs.throttle(300) ], t.prototype, "_onClickItem", null);
return i = a([ classId("CommonGameListUI2Trait"), classMethodWatch() ], t);
}(Trait);
i.CommonGameListUI2Trait = m;
cc._RF.pop();
}, {
"./CommonGameListUI2Item": "CommonGameListUI2Item"
} ],
CommonGameListUI2Types: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "2f178d8GoJMN6VWVlKiZPp2", "CommonGameListUI2Types");
Object.defineProperty(i, "__esModule", {
value: !0
});
i.common_game = void 0;
(function(e) {
e.DownloadState = {
NONE: 0,
PENDING: 1,
SUCCESS: 2,
FAIL: 3
};
e.DownloadStateName = {
0: "NONE",
1: "PENDING",
2: "SUCCESS",
3: "FAIL"
};
e.EntryState = {
DOWNLOAD_ONLY: 1,
CANCEL: 2,
AUTO: 3
};
})(i.common_game || (i.common_game = {}));
cc._RF.pop();
}, {} ]
}, {}, [ "CommonGameListUI2Item", "CommonGameListUI2Trait", "CommonGameListUI2Types" ]);
//# sourceMappingURL=index.js.map
