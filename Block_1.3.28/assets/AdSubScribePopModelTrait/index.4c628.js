window.__require = function e(t, o, r) {
function i(a, s) {
if (!o[a]) {
if (!t[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!t[c]) {
var p = "function" == typeof __require && __require;
if (!s && p) return p(c, !0);
if (n) return n(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var l = o[a] = {
exports: {}
};
t[a][0].call(l.exports, function(e) {
return i(t[a][1][e] || e);
}, l, l.exports, e, t, o, r);
}
return o[a].exports;
}
for (var n = "function" == typeof __require && __require, a = 0; a < r.length; a++) i(r[a]);
return i;
}({
AdSubScibePopModelPriceItemNode: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "71ae29l7SFJk77LC+WkA2rO", "AdSubScibePopModelPriceItemNode");
var r, i = this && this.__extends || (r = function(e, t) {
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
}), n = this && this.__decorate || function(e, t, o, r) {
var i, n = arguments.length, a = n < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, o, r); else for (var s = e.length - 1; s >= 0; s--) (i = e[s]) && (a = (n < 3 ? i(a) : n > 3 ? i(t, o, a) : i(t, o)) || a);
return n > 3 && a && Object.defineProperty(t, o, a), a;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = cc._decorator, s = a.ccclass, c = a.property, p = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.spineAnim = null;
t.spItems = [];
return t;
}
t.prototype.onLoad = function() {};
t.prototype.render = function() {
var e = this;
this.spItems.forEach(function(t, o) {
t.node.active = o === e.state.index;
});
this.spineAnim.node.active = this.state.isSelect;
this.state.isSelect && this.spineAnim.setAnimation(0, "init2", !0);
};
n([ c(sp.Skeleton) ], t.prototype, "spineAnim", void 0);
n([ c(cc.Sprite) ], t.prototype, "spItems", void 0);
return n([ s ], t);
}(hs.Component);
o.default = p;
cc._RF.pop();
}, {} ],
AdSubScribePopModelSubscribePanel: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "dda65QwNWRIDb5Oit0DFi3k", "AdSubScribePopModelSubscribePanel");
var r, i = this && this.__extends || (r = function(e, t) {
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
}), n = this && this.__decorate || function(e, t, o, r) {
var i, n = arguments.length, a = n < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, o, r); else for (var s = e.length - 1; s >= 0; s--) (i = e[s]) && (a = (n < 3 ? i(a) : n > 3 ? i(t, o, a) : i(t, o)) || a);
return n > 3 && a && Object.defineProperty(t, o, a), a;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = cc._decorator, s = a.ccclass, c = a.property, p = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.nodeBg = null;
t.startTime = 0;
return t;
}
t.prototype.onEnable = function() {
this.startTime = Date.now();
};
t.prototype.onLoad = function() {
this.nodeBg.on(cc.Node.EventType.TOUCH_START, this.onBtnCloseClick, this);
};
t.prototype.onBtnCloseClick = function() {
hs.UI.hide(this);
this.onDotClose();
};
t.prototype.onBtnSubscribeClick = function() {
hs.UI.hide(this);
hs.UI.show(hs.IpaPrefabConfig.IpaPreRemoveAdMain, hs.alertLayer).then(function(e) {
if (e && cc.isValid(e)) {
var t = e.getComponent("IpaPreRemoveAdMain");
t && t.setState({
eventType: 0
});
}
});
this.onDotClose();
this.onDotToSubscribe();
};
t.prototype.onDotClose = function() {
var e = storage.getItem("AdSubscirbePopLastViewTrigge", 0);
DS("g_game_subscribepopup_close", {
viewtiming: e,
viewtype: 1,
viewtime: Date.now() - this.startTime
});
};
t.prototype.onDotToSubscribe = function() {
DS("g_game_popupbutton_click", {
buttontype: 1
});
};
n([ c(cc.Node) ], t.prototype, "nodeBg", void 0);
return n([ s ], t);
}(hs.Component);
o.default = p;
cc._RF.pop();
}, {} ],
AdSubScribePopModelTrait: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "bbcacNEg6xA+6FlRQlLv4ub", "AdSubScribePopModelTrait");
var r, i, n = this && this.__extends || (r = function(e, t) {
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
var i, n = arguments.length, a = n < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, o, r); else for (var s = e.length - 1; s >= 0; s--) (i = e[s]) && (a = (n < 3 ? i(a) : n > 3 ? i(t, o, a) : i(t, o)) || a);
return n > 3 && a && Object.defineProperty(t, o, a), a;
}, s = this && this.__awaiter || function(e, t, o, r) {
return new (o || (o = Promise))(function(i, n) {
function a(e) {
try {
c(r.next(e));
} catch (e) {
n(e);
}
}
function s(e) {
try {
c(r.throw(e));
} catch (e) {
n(e);
}
}
function c(e) {
e.done ? i(e.value) : (t = e.value, t instanceof o ? t : new o(function(e) {
e(t);
})).then(a, s);
var t;
}
c((r = r.apply(e, t || [])).next());
});
}, c = this && this.__generator || function(e, t) {
var o, r, i, n, a = {
label: 0,
sent: function() {
if (1 & i[0]) throw i[1];
return i[1];
},
trys: [],
ops: []
};
return n = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (n[Symbol.iterator] = function() {
return this;
}), n;
function s(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(n) {
if (o) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (o = 1, r && (i = 2 & n[0] ? r.return : n[0] ? r.throw || ((i = r.return) && i.call(r), 
0) : r.next) && !(i = i.call(r, n[1])).done) return i;
(r = 0, i) && (n = [ 2 & n[0], i.value ]);
switch (n[0]) {
case 0:
case 1:
i = n;
break;

case 4:
a.label++;
return {
value: n[1],
done: !1
};

case 5:
a.label++;
r = n[1];
n = [ 0 ];
continue;

case 7:
n = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(i = a.trys, i = i.length > 0 && i[i.length - 1]) && (6 === n[0] || 2 === n[0])) {
a = 0;
continue;
}
if (3 === n[0] && (!i || n[1] > i[0] && n[1] < i[3])) {
a.label = n[1];
break;
}
if (6 === n[0] && a.label < i[1]) {
a.label = i[1];
i = n;
break;
}
if (i && a.label < i[2]) {
a.label = i[2];
a.ops.push(n);
break;
}
i[2] && a.ops.pop();
a.trys.pop();
continue;
}
n = t.call(e, a);
} catch (e) {
n = [ 6, e ];
r = 0;
} finally {
o = i = 0;
}
if (5 & n[0]) throw n[1];
return {
value: n[0] ? n[1] : void 0,
done: !0
};
}
}, p = this && this.__values || function(e) {
var t = "function" == typeof Symbol && Symbol.iterator, o = t && e[t], r = 0;
if (o) return o.call(e);
if (e && "number" == typeof e.length) return {
next: function() {
e && r >= e.length && (e = void 0);
return {
value: e && e[r++],
done: !e
};
}
};
throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.AdSubScribePopModelTrait = void 0;
var l, d, u = e("./config/ScriptsAdSubscribePopModelConfig");
(function(e) {
e[e.A_SubscribePanel = 1] = "A_SubscribePanel";
e[e.B_SetPanel = 2] = "B_SetPanel";
e[e.C_RemoveAdMain = 3] = "C_RemoveAdMain";
})(l || (l = {}));
(function(e) {
e[e.GameOver = 1] = "GameOver";
e[e.ColdStart = 2] = "ColdStart";
e[e.BackToHome = 3] = "BackToHome";
e[e.D_GameOverBtn = 4] = "D_GameOverBtn";
})(d || (d = {}));
var h = ((i = {})[l.A_SubscribePanel] = "A", i[l.B_SetPanel] = "B", i[l.C_RemoveAdMain] = "C", 
i), b = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._isPreloadComplete = !1;
t._prefabPriceItem = null;
t._gameOverNode = null;
t._isCreatingGameOverNode = !1;
t._adSubscribePopModelData = null;
t._coldStartPopShown = !1;
t.barrierPreloadPrefab = null;
return t;
}
t.prototype.onCreate = function() {
this.preloadPrefab();
this._requestIfNeeded();
this._registerGmMenu();
};
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassGame_Proxy",
methodName: "onClassGameShow"
}, {
className: "ChapterGame_Proxy",
methodName: "onChapterGoalPlayOver"
} ];
};
t.prototype._tryOpenSettingForEndless = function() {
if (storage.getItem("AdSubscribePopNeedOpenSetting", !1)) {
storage.setItem("AdSubscribePopNeedOpenSetting", !1);
hs.EventManager.dispatchModuleEvent(new hs.E_ClassTopInfo_Click());
}
};
t.prototype._tryOpenSettingForChapter = function() {
if (storage.getItem("AdSubscribePopNeedOpenSetting", !1)) {
storage.setItem("AdSubscribePopNeedOpenSetting", !1);
var e = Cinst(hs.ChapterTopInfoBtn);
e && e.onClickSetup && e.onClickSetup();
}
};
t.prototype._isVipActive = function() {
var e = hs.ipaModelRemoveAdMethodInfo.getVipState();
return !!(e && e.isVip && e.expire_in_seconds >= 0);
};
t.prototype._isNotDo = function() {
return 1 !== this.adSubscribePopModelData.is_do;
};
Object.defineProperty(t.prototype, "onActiveCondition", {
get: function() {
return !this._isNotDo();
},
enumerable: !1,
configurable: !0
});
t.prototype.onActive = function(e) {
if (hs.tp.isIpaPreRemoveAdMainOnRender(e) && (a = e.target).svPrice) {
var t = a.svPrice.node.parent;
if (t) {
var o = t.getChildByName("New Node");
o && (o.active = !1);
var r = t.getChildByName("sp_icon");
if (r) {
var i = r.getComponent(cc.Sprite);
i && this.replaceSpIcon(i);
}
}
}
if (hs.tp.isIpaPreRemoveAdPriceItemSetLoaded(e) && this._prefabPriceItem) {
e.replace = !0;
var n = e.target;
n && cc.isValid(n.node) && n.node.children.forEach(function(e) {
e.active = !1;
});
}
if (hs.tp.isIpaPreRemoveAdPriceItemInitSkin(e)) {
var a = e.target;
this._isPreloadComplete || this.preloadPrefab();
if (this._prefabPriceItem && a && cc.isValid(a.node)) {
this.addSubScribePopItem(a);
e.replace = !0;
}
}
(hs.tp.isClassWinOnDisable(e) || hs.tp.isClassFailOnDisable(e) || hs.tp.isChapterCollectWinOnDisable(e) || hs.tp.isChapterCollectFailOnDisable(e) || hs.tp.isChapterScoreWinOnDisable(e) || hs.tp.isChapterScoreFailOnDisable(e)) && this._handleSettlementOnDisable();
hs.tp.isClassGame_ProxyOnClassGameShow(e) && (this._isVipActive() || this._tryOpenSettingForEndless());
hs.tp.isChapterGame_ProxyOnChapterGoalPlayOver(e) && (this._isVipActive() || this._tryOpenSettingForChapter());
hs.tp.isHomePage_ProxyShowHomePage(e) && (this._isVipActive() || this._handleShowHomePage());
(hs.tp.isClassWinAddNode(e) || hs.tp.isClassFailAddNode(e) || hs.tp.isChapterCollectWinAddNode(e) || hs.tp.isChapterCollectFailAddNode(e) || hs.tp.isChapterScoreWinAddNode(e) || hs.tp.isChapterScoreFailAddNode(e)) && (this._isVipActive() || this._handleSettlementAddNode());
(hs.tp.isClassWinOnEnable(e) || hs.tp.isClassFailOnEnable(e) || hs.tp.isChapterCollectWinOnEnable(e) || hs.tp.isChapterCollectFailOnEnable(e) || hs.tp.isChapterScoreWinOnEnable(e) || hs.tp.isChapterScoreFailOnEnable(e)) && (this._isVipActive() || this._handleSettlementOnEnable());
};
t.prototype._handleShowHomePage = function() {
if (!this._coldStartPopShown && this._isShowTiming(d.ColdStart)) {
this._coldStartPopShown = !0;
this._showRandomPopup(d.ColdStart);
} else this._isShowTiming(d.BackToHome) && this._showRandomPopup(d.BackToHome);
};
t.prototype._handleSettlementOnDisable = function() {
this.hideGameOverNode();
};
t.prototype._handleSettlementAddNode = function() {
this._isShowTiming(d.D_GameOverBtn) && this.addGameOverNode();
};
t.prototype._handleSettlementOnEnable = function() {
this._isShowTiming(d.GameOver) && this._showRandomPopup(d.GameOver);
this._isShowTiming(d.D_GameOverBtn) && (cc.isValid(this._gameOverNode) ? this.showGameOverNode() : this.addGameOverNode());
};
t.prototype.addGameOverNode = function() {
return s(this, void 0, void 0, function() {
var e, t;
return c(this, function(o) {
switch (o.label) {
case 0:
if (cc.isValid(this._gameOverNode)) return [ 2 ];
if (this._isCreatingGameOverNode) return [ 2 ];
this._isCreatingGameOverNode = !0;
o.label = 1;

case 1:
o.trys.push([ 1, 3, 4, 5 ]);
return [ 4, hs.UI.show(u.AdSubScribePopPrefabConfig.GameOverNode, hs.gameAlertLayer) ];

case 2:
if (!(e = o.sent()) || !cc.isValid(e)) return [ 2 ];
this._gameOverNode = e;
(t = e.getComponent(cc.Widget)) && t.updateAlignment();
return [ 3, 5 ];

case 3:
o.sent();
return [ 3, 5 ];

case 4:
this._isCreatingGameOverNode = !1;
return [ 7 ];

case 5:
return [ 2 ];
}
});
});
};
t.prototype.showGameOverNode = function() {
if (cc.isValid(this._gameOverNode)) {
this._gameOverNode.active = !0;
var e = this._gameOverNode.getComponent("AdSubscribePopGameOverBtnNode");
e && e.setState({});
}
};
t.prototype.hideGameOverNode = function() {
cc.isValid(this._gameOverNode) && (this._gameOverNode.active = !1);
};
t.prototype.replaceSpIcon = function(e) {
return s(this, void 0, void 0, function() {
var t;
return c(this, function(o) {
switch (o.label) {
case 0:
return [ 4, hs.ResLoader.asyncLoadByBundle(u.AD_SUBSCRIBE_POP_MODEL_BUNDLE_NAME, u.AdSubScribePopResConfig.SpIconSpriteFrame, cc.SpriteFrame) ];

case 1:
t = o.sent();
if (cc.isValid(t) && cc.isValid(e.node)) {
e.spriteFrame = t;
e.node.x = 0;
}
return [ 2 ];
}
});
});
};
t.prototype.preloadPrefab = function() {
var e = this;
this.barrierPreloadPrefab || (this.barrierPreloadPrefab = new hs.TimeoutBarrier(2e3));
if (!this._prefabPriceItem && !this._isPreloadComplete) {
this.barrierPreloadPrefab.reset();
this._isPreloadComplete = !0;
hs.ResLoader.asyncLoadByBundle(u.AdSubScribePopPrefabConfig.PopItem.bundleName, u.AdSubScribePopPrefabConfig.PopItem.url, cc.Prefab).then(function(t) {
e.barrierPreloadPrefab.open();
e._prefabPriceItem = t;
}).finally(function() {
e._isPreloadComplete = !1;
});
}
};
t.prototype.addSubScribePopItem = function(e) {
var t, o;
if (cc.isValid(this._prefabPriceItem) && cc.isValid(e.node)) {
var r = e.node.getChildByName("adSubScribePopItem");
if (r) {
r.active = !0;
var i = r.getComponent("AdSubScibePopModelPriceItemNode");
i && i.setState({
isSelect: e.isSelect,
index: e.index,
id: null === (t = e.info) || void 0 === t ? void 0 : t.productId
});
} else {
var n = cc.instantiate(this._prefabPriceItem);
n.name = "adSubScribePopItem";
e.node.addChild(n);
var a = n.getComponent("AdSubScibePopModelPriceItemNode");
a && a.setState({
isSelect: e.isSelect,
index: e.index,
id: null === (o = e.info) || void 0 === o ? void 0 : o.productId
});
}
}
};
t.prototype._archiveYesterdayClicks = function() {
var e, t = this.adSubscribePopModelData.today_show_count;
if (!(t <= 0)) {
var o = h[this.adSubscribePopModelData.popup_type];
if (o) {
var r = this.adSubscribePopModelData.click_history;
r.push(((e = {})[o] = t, e));
for (;r.length > 50; ) r.shift();
}
}
};
t.prototype._buildGameData = function() {
var e, t, o, r, i = {}, n = this.adSubscribePopModelData.click_history.slice(-30);
try {
for (var a = p(n), s = a.next(); !s.done; s = a.next()) {
var c = s.value;
try {
for (var l = (o = void 0, p(Object.keys(c))), d = l.next(); !d.done; d = l.next()) {
var u = d.value;
i[u] = (i[u] || 0) + (c[u] || 0);
}
} catch (e) {
o = {
error: e
};
} finally {
try {
d && !d.done && (r = l.return) && r.call(l);
} finally {
if (o) throw o.error;
}
}
}
} catch (t) {
e = {
error: t
};
} finally {
try {
s && !s.done && (t = a.return) && t.call(a);
} finally {
if (e) throw e.error;
}
}
return i;
};
t.prototype._isShowTiming = function(e) {
return this.adSubscribePopModelData.popup_trigger.includes(e);
};
t.prototype._canShowPopup = function() {
return this.adSubscribePopModelData.max_daily_popups > 0 && this.adSubscribePopModelData.today_show_count < this.adSubscribePopModelData.max_daily_popups;
};
t.prototype._showRandomPopup = function(e) {
return s(this, void 0, void 0, function() {
var t;
return c(this, function(o) {
switch (o.label) {
case 0:
if (!this._canShowPopup()) return [ 2 ];
storage.setItem("AdSubscirbePopLastViewTrigge", e);
if ((t = this.adSubscribePopModelData.popup_type) < l.A_SubscribePanel || t > l.C_RemoveAdMain) return [ 2 ];
if (e !== d.ColdStart || t !== l.C_RemoveAdMain) return [ 3, 3 ];
this.preloadPrefab();
return !this.barrierPreloadPrefab || this.barrierPreloadPrefab.isOpen ? [ 3, 2 ] : [ 4, this.barrierPreloadPrefab.wait() ];

case 1:
o.sent();
o.label = 2;

case 2:
this._showPopupByType(t);
return [ 3, 4 ];

case 3:
this._showPopupByType(t);
o.label = 4;

case 4:
return [ 2 ];
}
});
});
};
t.prototype._showPopupByType = function(e) {
this.adSubscribePopModelData.today_show_count++;
this._saveLocalData();
switch (e) {
case l.A_SubscribePanel:
hs.UI.show(u.AdSubScribePopPrefabConfig.SubscribePanel, hs.alertLayer);
break;

case l.B_SetPanel:
hs.UI.show(u.AdSubScribePopPrefabConfig.SetPanel, hs.alertLayer);
break;

case l.C_RemoveAdMain:
hs.UI.show(hs.IpaPrefabConfig.IpaPreRemoveAdMain, hs.alertLayer).then(function(e) {
if (e && cc.isValid(e)) {
var t = e.getComponent("IpaPreRemoveAdMain");
t && t.setState({
eventType: 0
});
}
});
}
};
t.prototype._getTodayDateString = function() {
var e = new Date();
return e.getFullYear() + "-" + String(e.getMonth() + 1).padStart(2, "0") + "-" + String(e.getDate()).padStart(2, "0");
};
Object.defineProperty(t.prototype, "adSubscribePopModelData", {
get: function() {
if (!this._adSubscribePopModelData) {
this._adSubscribePopModelData = hs.storage.getItem("AdSubScribePopModelTraitData", {
lastRequestDate: "",
popup_trigger: [],
popup_type: 0,
max_daily_popups: 0,
today_show_count: 0,
is_do: 0,
click_history: []
});
Array.isArray(this._adSubscribePopModelData.click_history) || (this._adSubscribePopModelData.click_history = []);
}
return this._adSubscribePopModelData;
},
enumerable: !1,
configurable: !0
});
t.prototype._saveLocalData = function() {
hs.storage.setItem("AdSubScribePopModelTraitData", this.adSubscribePopModelData);
};
t.prototype.resetClickHistory = function(e, t) {
void 0 === t && (t = !1);
t && (this.adSubscribePopModelData.click_history = []);
};
t.prototype.getUrl = function(e) {
void 0 === e && (e = !0);
return "https://ai-server.afafb.com/infer/v1/pay_free_ad_popup_rec";
};
t.prototype._requestIfNeeded = function(e) {
var t = this;
void 0 === e && (e = !0);
var o = this._getTodayDateString();
if (this.adSubscribePopModelData.lastRequestDate !== o) {
this._archiveYesterdayClicks();
this.resetClickHistory(this.props.req_type);
this.adSubscribePopModelData.today_show_count = 0;
this.adSubscribePopModelData.is_do = 0;
this.adSubscribePopModelData.lastRequestDate = o;
this._saveLocalData();
var r = this.getUrl(e), i = {
key: hs.traitServerRequestInfo.uid,
req_type: this.props.req_type,
platform: "gp",
game_data: this._buildGameData()
};
hs.http.requestAsync(r, i, {
type: hs.HttpType.POST,
contentType: "application/x-www-form-urlencoded",
crypto: hs.UrlCrypto
}).then(function(e) {
if (e && 0 === e.code) {
var o = e[t.props.req_type];
if (!o) return;
var r = o.max_daily_popups, i = void 0 === r ? 0 : r, n = o.popup_trigger, a = void 0 === n ? [] : n, s = o.popup_type, c = void 0 === s ? 0 : s, p = o.is_do, l = void 0 === p ? 0 : p;
t.adSubscribePopModelData.max_daily_popups = i;
t.adSubscribePopModelData.popup_trigger = a;
t.adSubscribePopModelData.popup_type = c;
t.adSubscribePopModelData.is_do = l;
t._saveLocalData();
}
}).catch(function() {});
}
};
t.prototype._registerGmMenu = function() {};
t._gmRegistered = !1;
return a([ classId("AdSubScribePopModelTrait"), classMethodWatch() ], t);
}(Trait);
o.AdSubScribePopModelTrait = b;
cc._RF.pop();
}, {
"./config/ScriptsAdSubscribePopModelConfig": "ScriptsAdSubscribePopModelConfig"
} ],
AdSubscribePopGameOverBtnNode: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "524b81ANmZCrJIUt741CcaQ", "AdSubscribePopGameOverBtnNode");
var r, i = this && this.__extends || (r = function(e, t) {
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
}), n = this && this.__decorate || function(e, t, o, r) {
var i, n = arguments.length, a = n < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, o, r); else for (var s = e.length - 1; s >= 0; s--) (i = e[s]) && (a = (n < 3 ? i(a) : n > 3 ? i(t, o, a) : i(t, o)) || a);
return n > 3 && a && Object.defineProperty(t, o, a), a;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = cc._decorator, s = a.ccclass, c = a.property, p = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.btnGameOver = null;
return t;
}
t.prototype.onLoad = function() {
this.btnGameOver.node.on("click", this.onBtnGameOverClick, this);
};
t.prototype.render = function() {
this.playShowAnim();
};
t.prototype.playShowAnim = function() {
var e = this.node;
e.opacity = 0;
e.scale = 0;
cc.tween(e).to(.133, {
scale: .55
}).to(.167, {
scale: 1.08,
opacity: 255
}).to(.13, {
scale: 1
}).start();
};
t.prototype.onBtnGameOverClick = function() {
hs.UI.show(hs.IpaPrefabConfig.IpaPreRemoveAdMain, hs.alertLayer).then(function(e) {
if (e && cc.isValid(e)) {
var t = e.getComponent("IpaPreRemoveAdMain");
t && t.setState({
eventType: 0
});
}
});
this.onDotToSubscribe();
};
t.prototype.onDotToSubscribe = function() {
DS("g_game_popupbutton_click", {
buttontype: 3
});
};
n([ c(cc.Button) ], t.prototype, "btnGameOver", void 0);
return n([ s ], t);
}(hs.Component);
o.default = p;
cc._RF.pop();
}, {} ],
AdSubscribePopModelSetPanel: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "397e33Hsh5BaJoqu/w8AwAH", "AdSubscribePopModelSetPanel");
var r, i = this && this.__extends || (r = function(e, t) {
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
}), n = this && this.__decorate || function(e, t, o, r) {
var i, n = arguments.length, a = n < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, o, r); else for (var s = e.length - 1; s >= 0; s--) (i = e[s]) && (a = (n < 3 ? i(a) : n > 3 ? i(t, o, a) : i(t, o)) || a);
return n > 3 && a && Object.defineProperty(t, o, a), a;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = cc._decorator, s = a.ccclass, c = a.property, p = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.nodeBg = null;
t.spKuang = null;
t.spArrow = null;
t.startTime = 0;
return t;
}
t.prototype.onEnable = function() {
this.startTime = Date.now();
this.playShowAnim();
};
t.prototype.playShowAnim = function() {
if (this.spKuang) {
this.spKuang.setAnimation(0, "in2", !1);
this.spKuang.addAnimation(0, "init2", !0);
}
if (this.spArrow) {
this.spArrow.setAnimation(0, "in1", !1);
this.spArrow.addAnimation(0, "init1", !0);
}
};
t.prototype.onLoad = function() {
this.nodeBg.on(cc.Node.EventType.TOUCH_START, this.onBtnCloseClick, this);
};
t.prototype.onBtnCloseClick = function() {
hs.UI.hide(this);
this.onDotClose();
};
t.prototype.onBtnSubscribeClick = function() {
hs.UI.hide(this);
var e = storage.getItem("AdSubscirbePopLastViewTrigge", 0);
storage.setItem("AdSubscribePopNeedOpenSetting", !0);
1 === e ? hs.EventManager.dispatchModuleEvent(new hs.E_Game_Ready()) : hs.EventManager.dispatchModuleEvent(new hs.E_HomePage_Game(hs.GameType.Class));
this.onDotClose();
this.onDotToSubscribe();
};
t.prototype.onDotClose = function() {
var e = storage.getItem("AdSubscirbePopLastViewTrigge", 0);
DS("g_game_subscribepopup_close", {
viewtiming: e,
viewtype: 2,
viewtime: Date.now() - this.startTime
});
};
t.prototype.onDotToSubscribe = function() {
DS("g_game_popupbutton_click", {
buttontype: 2
});
};
n([ c(cc.Node) ], t.prototype, "nodeBg", void 0);
n([ c(sp.Skeleton) ], t.prototype, "spKuang", void 0);
n([ c(sp.Skeleton) ], t.prototype, "spArrow", void 0);
return n([ s ], t);
}(hs.Component);
o.default = p;
cc._RF.pop();
}, {} ],
ScriptsAdSubscribePopModelConfig: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "50e0fSstPtHyoPHK+RJr3gl", "ScriptsAdSubscribePopModelConfig");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.AdSubScribePopPrefabConfig = o.AdSubScribePopResConfig = o.AD_SUBSCRIBE_POP_MODEL_BUNDLE_NAME = void 0;
o.AD_SUBSCRIBE_POP_MODEL_BUNDLE_NAME = "AdSubScribePopModelTrait";
o.AdSubScribePopResConfig = {
SpIconSpriteFrame: "textures/img_ads02"
};
o.AdSubScribePopPrefabConfig = {
SubscribePanel: {
name: "adSubScribePopSubscribePanel",
url: "prefabs/adSubScribePopSubscribePanel",
bundleName: o.AD_SUBSCRIBE_POP_MODEL_BUNDLE_NAME,
ease: hs.PanelScaleEase
},
SetPanel: {
name: "adSubScribePopSetPanel",
url: "prefabs/adSubScribePopSetPanel",
bundleName: o.AD_SUBSCRIBE_POP_MODEL_BUNDLE_NAME,
ease: hs.PanelScaleEase
},
GameOverNode: {
name: "adSubscribePopGameOverNode",
url: "prefabs/adSubscribePopGameOverNode",
bundleName: o.AD_SUBSCRIBE_POP_MODEL_BUNDLE_NAME
},
PopItem: {
name: "adSubScribePopItem",
url: "prefabs/adSubScribePopItem",
bundleName: o.AD_SUBSCRIBE_POP_MODEL_BUNDLE_NAME
}
};
cc._RF.pop();
}, {} ]
}, {}, [ "AdSubScribePopModelTrait", "AdSubScibePopModelPriceItemNode", "AdSubScribePopModelSubscribePanel", "AdSubscribePopGameOverBtnNode", "AdSubscribePopModelSetPanel", "ScriptsAdSubscribePopModelConfig" ]);
//# sourceMappingURL=index.js.map
