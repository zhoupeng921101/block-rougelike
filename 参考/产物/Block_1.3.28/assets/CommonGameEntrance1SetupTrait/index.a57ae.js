window.__require = function t(e, n, i) {
function r(a, s) {
if (!n[a]) {
if (!e[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!e[c]) {
var l = "function" == typeof __require && __require;
if (!s && l) return l(c, !0);
if (o) return o(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var u = n[a] = {
exports: {}
};
e[a][0].call(u.exports, function(t) {
return r(e[a][1][t] || t);
}, u, u.exports, t, e, n, i);
}
return n[a].exports;
}
for (var o = "function" == typeof __require && __require, a = 0; a < i.length; a++) r(i[a]);
return r;
}({
CommonGameEntrance1SetupTrait: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "ebb11ASwblA5ZfRSJRmTB3C", "CommonGameEntrance1SetupTrait");
var i, r = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
})(t, e);
}, function(t, e) {
i(t, e);
function n() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
}), o = this && this.__decorate || function(t, e, n, i) {
var r, o = arguments.length, a = o < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, i); else for (var s = t.length - 1; s >= 0; s--) (r = t[s]) && (a = (o < 3 ? r(a) : o > 3 ? r(e, n, a) : r(e, n)) || a);
return o > 3 && a && Object.defineProperty(e, n, a), a;
}, a = this && this.__awaiter || function(t, e, n, i) {
return new (n || (n = Promise))(function(r, o) {
function a(t) {
try {
c(i.next(t));
} catch (t) {
o(t);
}
}
function s(t) {
try {
c(i.throw(t));
} catch (t) {
o(t);
}
}
function c(t) {
t.done ? r(t.value) : (e = t.value, e instanceof n ? e : new n(function(t) {
t(e);
})).then(a, s);
var e;
}
c((i = i.apply(t, e || [])).next());
});
}, s = this && this.__generator || function(t, e) {
var n, i, r, o, a = {
label: 0,
sent: function() {
if (1 & r[0]) throw r[1];
return r[1];
},
trys: [],
ops: []
};
return o = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (o[Symbol.iterator] = function() {
return this;
}), o;
function s(t) {
return function(e) {
return c([ t, e ]);
};
}
function c(o) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, i && (r = 2 & o[0] ? i.return : o[0] ? i.throw || ((r = i.return) && r.call(i), 
0) : i.next) && !(r = r.call(i, o[1])).done) return r;
(i = 0, r) && (o = [ 2 & o[0], r.value ]);
switch (o[0]) {
case 0:
case 1:
r = o;
break;

case 4:
a.label++;
return {
value: o[1],
done: !1
};

case 5:
a.label++;
i = o[1];
o = [ 0 ];
continue;

case 7:
o = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(r = a.trys, r = r.length > 0 && r[r.length - 1]) && (6 === o[0] || 2 === o[0])) {
a = 0;
continue;
}
if (3 === o[0] && (!r || o[1] > r[0] && o[1] < r[3])) {
a.label = o[1];
break;
}
if (6 === o[0] && a.label < r[1]) {
a.label = r[1];
r = o;
break;
}
if (r && a.label < r[2]) {
a.label = r[2];
a.ops.push(o);
break;
}
r[2] && a.ops.pop();
a.trys.pop();
continue;
}
o = e.call(t, a);
} catch (t) {
o = [ 6, t ];
i = 0;
} finally {
n = r = 0;
}
if (5 & o[0]) throw o[1];
return {
value: o[0] ? o[1] : void 0,
done: !0
};
}
}, c = this && this.__values || function(t) {
var e = "function" == typeof Symbol && Symbol.iterator, n = e && t[e], i = 0;
if (n) return n.call(t);
if (t && "number" == typeof t.length) return {
next: function() {
t && i >= t.length && (t = void 0);
return {
value: t && t[i++],
done: !t
};
}
};
throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.CommonGameEntrance1SetupTrait = void 0;
var l = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.settingBtnNode = null;
e.achievementBtnNode = null;
e.settingBtnPrefab = null;
e.medalBtnPrefab = null;
e.moreGamesBtnItem = null;
e.moreGamesOriginalChildren = [];
e.dailyStreakPrefab = null;
e.dailyStreakNode = null;
e.isFromHomeSetting = !1;
return e;
}
e.prototype.onCreate = function() {
var t = this;
Promise.all([ this.loadPrefab("prefab/btn_seting").then(function(e) {
e && t.active && (t.settingBtnPrefab = e);
}), this.loadPrefab("prefab/MedalSetupBtnItem").then(function(e) {
e && t.active && (t.medalBtnPrefab = e);
}), this.loadPrefab("prefab/winStreakIcon").then(function(e) {
e && t.active && (t.dailyStreakPrefab = e);
}) ]).then(function() {
var e = TRAIT("CommonGameListDependenciesTrait");
e && e.active && e.setState({
traitId: t.id
});
});
};
e.prototype.loadPrefab = function(t) {
return hs.ResLoader.asyncLoadByBundle(this.traitName, t, cc.Prefab).then(function(t) {
return t;
});
};
Object.defineProperty(e.prototype, "uiReady", {
get: function() {
var t = TRAIT("CommonGameListDependenciesTrait");
return !!(t && t.active && t.state.uiReady);
},
enumerable: !1,
configurable: !0
});
e.prototype.onActive = function(t) {
if (hs.tp.isHomePageSectionMedalBtnDefaultAddOtherNode(t)) {
if (!this.uiReady) return;
t.replace = !0;
t.returnState = !0;
this.showSettingButton(t);
}
if (hs.tp.isSetupAddOtherNode(t)) {
if (!this.uiReady) return;
this.addCustomNodesToSetup(t);
}
if (hs.tp.isSetup_ProxyOnSetupClose(t)) {
if (!this.uiReady) return;
this.cleanupSetupCustomNodes();
}
};
e.prototype.showSettingButton = function(t) {
var e = this, n = t.target.node;
if (cc.isValid(n)) {
this.hideExistingMedalBtn(n);
this.settingBtnNode && cc.isValid(this.settingBtnNode) ? this.settingBtnNode.active = !0 : this.settingBtnPrefab ? this.createSettingButton(n, this.settingBtnPrefab) : this.loadPrefab("prefab/btn_seting").then(function(t) {
if (t && cc.isValid(n) && e.active) {
e.settingBtnPrefab = t;
e.createSettingButton(n, t);
}
});
}
};
e.prototype.createSettingButton = function(t, e) {
this.settingBtnNode = cc.instantiate(e);
if (cc.isValid(this.settingBtnNode)) {
t.addChild(this.settingBtnNode);
hs.applyAdapterFringe(this.settingBtnNode);
this.settingBtnNode.on("click", this.onSettingBtnClick, this);
}
};
e.prototype.hideExistingMedalBtn = function(t) {
var e, n;
if (cc.isValid(t)) try {
for (var i = c(t.children), r = i.next(); !r.done; r = i.next()) {
var o = r.value;
o !== this.settingBtnNode && !this.isNoHide(o) && o.active && (o.active = !1);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
r && !r.done && (n = i.return) && n.call(i);
} finally {
if (e) throw e.error;
}
}
};
e.prototype.isNoHide = function() {
return !1;
};
e.prototype.onSettingBtnClick = function() {
this.isFromHomeSetting = !0;
var t = [ hs.enSetupKeys.sound, hs.enSetupKeys.BGM, hs.enSetupKeys.moreGames, hs.enSetupKeys.moreSettings ];
hs.UI.show(hs.PrefabConfig.Setup, hs.gameAlertLayer).then(function() {
var e = Cinst(hs.Setup);
e && e.setState({
keys: t
});
});
};
e.prototype.addCustomNodesToSetup = function(t) {
var e = this;
if (this.isFromHomeSetting) {
var n = t.target;
if (n && cc.isValid(n.node)) {
this.addDailyStreakToSetup(n);
var i = n.bottomNode;
if (i && cc.isValid(i)) {
this.achievementBtnNode = null;
var r = this.findMoreGamesBtnItem(i);
if (r) this.transformToMedalBtn(r); else {
var o = function() {
var t = e.findMoreGamesBtnItem(i);
if (t) {
e.transformToMedalBtn(t);
i.off(cc.Node.EventType.CHILD_ADDED, o);
}
};
i.on(cc.Node.EventType.CHILD_ADDED, o);
}
}
}
}
};
e.prototype.addDailyStreakToSetup = function(t) {
var e = t.inNode;
if (e && cc.isValid(e)) {
var n = t.node;
if (n && cc.isValid(n)) {
if (this.dailyStreakNode && cc.isValid(this.dailyStreakNode)) n.addChild(this.dailyStreakNode); else {
if (!this.dailyStreakPrefab) return;
this.dailyStreakNode = cc.instantiate(this.dailyStreakPrefab);
n.addChild(this.dailyStreakNode);
}
var i = e.y + e.height / 2, r = this.dailyStreakNode.height;
this.dailyStreakNode.y = i + r + 100;
}
}
};
e.prototype.findMoreGamesBtnItem = function(t) {
var e, n, i;
if (!cc.isValid(t)) return null;
try {
for (var r = c(t.children), o = r.next(); !o.done; o = r.next()) {
var a = o.value.getComponent(hs.SetupBtnItem);
if (a && (null === (i = a.state) || void 0 === i ? void 0 : i.key) === hs.enSetupKeys.moreGames) return a;
}
} catch (t) {
e = {
error: t
};
} finally {
try {
o && !o.done && (n = r.return) && n.call(r);
} finally {
if (e) throw e.error;
}
}
return null;
};
e.prototype.cleanupSetupCustomNodes = function() {
var t, e;
this.isFromHomeSetting = !1;
this.dailyStreakNode && cc.isValid(this.dailyStreakNode) && this.dailyStreakNode.removeFromParent();
if (this.moreGamesBtnItem && cc.isValid(this.moreGamesBtnItem.node)) {
try {
for (var n = c(this.moreGamesOriginalChildren), i = n.next(); !i.done; i = n.next()) {
var r = i.value;
cc.isValid(r) && (r.active = !0);
}
} catch (e) {
t = {
error: e
};
} finally {
try {
i && !i.done && (e = n.return) && e.call(n);
} finally {
if (t) throw t.error;
}
}
this.moreGamesBtnItem.btn && (this.moreGamesBtnItem.btn.interactable = !0);
}
this.achievementBtnNode && cc.isValid(this.achievementBtnNode) && this.achievementBtnNode.removeFromParent();
this.moreGamesBtnItem = null;
this.moreGamesOriginalChildren = [];
};
e.prototype.transformToMedalBtn = function(t) {
return a(this, void 0, void 0, function() {
var e, n, i, r, o, a, l, u, h, d;
return s(this, function(s) {
switch (s.label) {
case 0:
if (!(e = t.node) || !cc.isValid(e)) return [ 2 ];
if (this.medalBtnPrefab) return [ 3, 2 ];
n = this;
return [ 4, this.loadPrefab("prefab/MedalSetupBtnItem") ];

case 1:
n.medalBtnPrefab = s.sent();
s.label = 2;

case 2:
if (!this.medalBtnPrefab || !this.active) return [ 2 ];
if (!cc.isValid(e) || !cc.isValid(t.node)) return [ 2 ];
this.moreGamesBtnItem = t;
this.moreGamesOriginalChildren = [];
try {
for (i = c(e.children), r = i.next(); !r.done; r = i.next()) if ((o = r.value) !== this.achievementBtnNode) {
this.moreGamesOriginalChildren.push(o);
o.active = !1;
}
} catch (t) {
h = {
error: t
};
} finally {
try {
r && !r.done && (d = i.return) && d.call(i);
} finally {
if (h) throw h.error;
}
}
(a = t.btn) && (a.interactable = !1);
if (this.achievementBtnNode && cc.isValid(this.achievementBtnNode)) e.addChild(this.achievementBtnNode); else {
if (!this.medalBtnPrefab) return [ 2 ];
this.achievementBtnNode = cc.instantiate(this.medalBtnPrefab);
e.addChild(this.achievementBtnNode);
this.achievementBtnNode.setPosition(0, 0);
this.achievementBtnNode.on("click", this.onMedalBtnClick, this);
}
if (l = this.achievementBtnNode.getChildByName("red")) {
u = hs.achievementInfo.getRedPointState();
l.active = u;
}
return [ 2 ];
}
});
});
};
e.prototype.onMedalBtnClick = function() {
hs.UI.hideUI(hs.PrefabConfig.Setup);
hs.UI.show(hs.PrefabConfig.Achievement_Main, hs.uiLayer).then(function(t) {
if (t && cc.isValid(t)) {
var e = t.getComponent(hs.Achievement_Main);
e && e.setState({
statisticsDataList: hs.achievementInfo.achievementStatisticsData,
awardDataList: hs.achievementInfo.achievementAwardData
});
}
});
};
return o([ classId("CommonGameEntrance1SetupTrait"), classMethodWatch() ], e);
}(Trait);
n.CommonGameEntrance1SetupTrait = l;
cc._RF.pop();
}, {} ],
WinStreakIcon: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "4119bcCr81OTav4W68lYcP3", "WinStreakIcon");
var i, r = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
})(t, e);
}, function(t, e) {
i(t, e);
function n() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
}), o = this && this.__decorate || function(t, e, n, i) {
var r, o = arguments.length, a = o < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, i); else for (var s = t.length - 1; s >= 0; s--) (r = t[s]) && (a = (o < 3 ? r(a) : o > 3 ? r(e, n, a) : r(e, n)) || a);
return o > 3 && a && Object.defineProperty(e, n, a), a;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.WinStreakIcon = void 0;
var a = cc._decorator, s = a.ccclass, c = a.property, l = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.anim = null;
e.countLabel = null;
return e;
}
e.prototype.onEnable = function() {
this.updateState();
};
e.prototype.updateState = function() {
var t = hs.dailyWinStreakStateInfo.dailyWinStreakStateInfoData, e = 0;
e = t.winCount > t.winCountOld ? 3 : 0 === hs.getDiffDays(Date.now(), t.winCountTime) && t.winCount === t.winCountOld ? 2 : 1;
this.setState({
winState: e,
winCount: t.winCount,
oldWinCount: t.winCountOld
});
};
e.prototype.render = function() {
if (this.anim) {
var t = this.state, e = t.winState, n = t.winCount, i = t.oldWinCount;
0 === n ? this.anim.setAnimation(0, "winningstreat_Unlocked", !1) : n === i ? 1 === e ? this.anim.setAnimation(0, "winningstreat_Unlocked", !1) : this.anim.setAnimation(0, "winningstreat", !1) : n > i && this.anim.setAnimation(0, "winningstreat", !1);
this.countLabel && (this.countLabel.string = (n || 0).toString());
}
};
o([ c(sp.Skeleton) ], e.prototype, "anim", void 0);
o([ c(cc.Label) ], e.prototype, "countLabel", void 0);
return o([ s ], e);
}(hs.Component);
n.WinStreakIcon = l;
cc._RF.pop();
}, {} ]
}, {}, [ "CommonGameEntrance1SetupTrait", "WinStreakIcon" ]);
//# sourceMappingURL=index.js.map
