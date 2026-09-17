window.__require = function e(t, i, o) {
function a(n, s) {
if (!i[n]) {
if (!t[n]) {
var c = n.split("/");
c = c[c.length - 1];
if (!t[c]) {
var l = "function" == typeof __require && __require;
if (!s && l) return l(c, !0);
if (r) return r(c, !0);
throw new Error("Cannot find module '" + n + "'");
}
n = c;
}
var h = i[n] = {
exports: {}
};
t[n][0].call(h.exports, function(e) {
return a(t[n][1][e] || e);
}, h, h.exports, e, t, i, o);
}
return i[n].exports;
}
for (var r = "function" == typeof __require && __require, n = 0; n < o.length; n++) a(o[n]);
return a;
}({
$28510_f_TravelPassTipsTrait: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "7edcb6Li3BP86O59tSns4y3", "$28510_f_TravelPassTipsTrait");
var o, a = this && this.__extends || (o = function(e, t) {
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
}), r = this && this.__assign || function() {
return (r = Object.assign || function(e) {
for (var t, i = 1, o = arguments.length; i < o; i++) {
t = arguments[i];
for (var a in t) Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
}
return e;
}).apply(this, arguments);
}, n = this && this.__decorate || function(e, t, i, o) {
var a, r = arguments.length, n = r < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, i) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(e, t, i, o); else for (var s = e.length - 1; s >= 0; s--) (a = e[s]) && (n = (r < 3 ? a(n) : r > 3 ? a(t, i, n) : a(t, i)) || n);
return r > 3 && n && Object.defineProperty(t, i, n), n;
}, s = this && this.__awaiter || function(e, t, i, o) {
return new (i || (i = Promise))(function(a, r) {
function n(e) {
try {
c(o.next(e));
} catch (e) {
r(e);
}
}
function s(e) {
try {
c(o.throw(e));
} catch (e) {
r(e);
}
}
function c(e) {
e.done ? a(e.value) : (t = e.value, t instanceof i ? t : new i(function(e) {
e(t);
})).then(n, s);
var t;
}
c((o = o.apply(e, t || [])).next());
});
}, c = this && this.__generator || function(e, t) {
var i, o, a, r, n = {
label: 0,
sent: function() {
if (1 & a[0]) throw a[1];
return a[1];
},
trys: [],
ops: []
};
return r = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function s(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(r) {
if (i) throw new TypeError("Generator is already executing.");
for (;n; ) try {
if (i = 1, o && (a = 2 & r[0] ? o.return : r[0] ? o.throw || ((a = o.return) && a.call(o), 
0) : o.next) && !(a = a.call(o, r[1])).done) return a;
(o = 0, a) && (r = [ 2 & r[0], a.value ]);
switch (r[0]) {
case 0:
case 1:
a = r;
break;

case 4:
n.label++;
return {
value: r[1],
done: !1
};

case 5:
n.label++;
o = r[1];
r = [ 0 ];
continue;

case 7:
r = n.ops.pop();
n.trys.pop();
continue;

default:
if (!(a = n.trys, a = a.length > 0 && a[a.length - 1]) && (6 === r[0] || 2 === r[0])) {
n = 0;
continue;
}
if (3 === r[0] && (!a || r[1] > a[0] && r[1] < a[3])) {
n.label = r[1];
break;
}
if (6 === r[0] && n.label < a[1]) {
n.label = a[1];
a = r;
break;
}
if (a && n.label < a[2]) {
n.label = a[2];
n.ops.push(r);
break;
}
a[2] && n.ops.pop();
n.trys.pop();
continue;
}
r = t.call(e, n);
} catch (e) {
r = [ 6, e ];
o = 0;
} finally {
i = a = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
}, l = this && this.__values || function(e) {
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
};
Object.defineProperty(i, "__esModule", {
value: !0
});
i.$28510_f_TravelPassTipsTrait = void 0;
var h = e("../components/TravelPassLevelTipComponent"), p = function(e) {
a(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.storeKey = "28510_f_TravelPassTips";
t.tipPrefab = null;
t.tipNode = null;
t.tipComp = null;
t.mosaicNodeRef = null;
t.mosaicRowTween = null;
t.mosaicDistanceTween = null;
t.PREFAB_BUNDLE = "$28510_f_TravelPassTipsTrait";
t.PREFAB_PATH = "prefab/gpTravelPassLevelTip";
t.PREFAB_PATH_NEW = "prefab/gpTravelPassLevelTipNew";
t.prefabPath = t.PREFAB_PATH;
t.curBundle = null;
t.initPromise = null;
return t;
}
t.prototype.getFixedPassTarget = function() {
return 0;
};
t.prototype.loadData = function() {
var e = {
refreshTime: Date.now(),
passTimes: 0,
currentPassNum: hs.chapterGameInfo.chapterNum,
recordPassNum: 0,
gp_dem: 10,
gp_stage: 0,
gp_dem_ori: 0
}, t = storage.getItem(this.storeKey, e);
if (t.gp_stage !== hs.chapterGameInfo.stage) {
t.gp_stage = hs.chapterGameInfo.stage;
t.gp_dem = 10;
t.gp_dem_ori = 10;
t.refreshTime = Date.now();
t.passTimes = 0;
t.recordPassNum = 0;
t.gp_dem_ori = t.gp_dem;
t.currentPassNum = hs.chapterGameInfo.chapterNum;
this.saveData(t);
}
return r(r({}, e), t);
};
t.prototype.saveData = function(e) {
storage.setItem(this.storeKey, e);
};
t.prototype.onCreate = function() {
var e = this;
if (this.getIsUseNewArt()) {
this.initPromise = this.initUseNewArt();
this.initPromise.then(function() {
return e.ensureTipInstance();
}).catch(function() {});
} else this.ensureTipInstance().catch(function() {});
};
t.prototype.initUseNewArt = function() {
return s(this, void 0, void 0, function() {
var e;
return c(this, function(t) {
switch (t.label) {
case 0:
e = this;
return [ 4, hs.ResLoader.asyncLoadBundle(this.PREFAB_BUNDLE) ];

case 1:
e.curBundle = t.sent();
if (!this.curBundle || !cc.isValid(this.curBundle)) return [ 2 ];
if (hs.ResLoader.isBundleAssetDownloaded(this.curBundle, this.PREFAB_PATH_NEW, {
type: cc.Prefab,
target: "import"
})) {
this.prefabPath = this.PREFAB_PATH_NEW;
return [ 2 ];
}
if (!hs.ResLoader.isBundleAssetDownloaded(this.curBundle, this.PREFAB_PATH, {
type: cc.Prefab,
target: "import"
})) {
this.prefabPath = this.PREFAB_PATH_NEW;
return [ 2 ];
}
hs.ResLoader.loadByBundle(this.PREFAB_BUNDLE, this.PREFAB_PATH_NEW, cc.Prefab, function() {});
return [ 2 ];
}
});
});
};
t.prototype.ensureTipInstance = function() {
return s(this, void 0, Promise, function() {
var e;
return c(this, function(t) {
switch (t.label) {
case 0:
t.trys.push([ 0, 5, , 6 ]);
return this.getIsUseNewArt() && this.initPromise ? [ 4, this.initPromise ] : [ 3, 2 ];

case 1:
t.sent();
t.label = 2;

case 2:
if (this.tipPrefab && cc.isValid(this.tipPrefab)) return [ 3, 4 ];
e = this;
return [ 4, hs.ResLoader.asyncLoadByBundle(this.PREFAB_BUNDLE, this.prefabPath, cc.Prefab) ];

case 3:
e.tipPrefab = t.sent();
t.label = 4;

case 4:
if (!this.tipNode || !cc.isValid(this.tipNode)) {
this.tipNode = cc.instantiate(this.tipPrefab);
this.tipComp = this.tipNode.getComponent(h.default);
}
return [ 2, this.tipComp ];

case 5:
throw t.sent();

case 6:
return [ 2 ];
}
});
});
};
t.prototype.getIsUseNewArt = function() {
var e, t;
return null !== (t = null === (e = this.props) || void 0 === e ? void 0 : e.useNewArt) && void 0 !== t && t;
};
t.prototype.isSameDay = function(e, t) {
var i = new Date(e), o = new Date(t);
return i.getFullYear() === o.getFullYear() && i.getMonth() === o.getMonth() && i.getDate() === o.getDate();
};
t.prototype.getRemainSecondsToNextMondayZero = function(e) {
void 0 === e && (e = Date.now());
var t = new Date(e), i = t.getDay(), o = 1 === i ? 7 : 0 === i ? 1 : 8 - i, a = new Date(t);
a.setHours(0, 0, 0, 0);
a.setDate(a.getDate() + o);
return Math.max(0, Math.floor((a.getTime() - e) / 1e3));
};
t.prototype.getRemainRefreshTime = function() {
var e = Date.now(), t = storage.getItem("chapterPeriodsBeginTime", e), i = 604800 - Math.floor((e - t) / 1e3);
i < 0 && (i = 0);
return i;
};
t.prototype.calcPassTarget = function(e, t) {
var i = this.getFixedPassTarget();
if (i > 0) return i;
var o = Math.max(0, t - e), a = this.loadData();
return Math.max(1, Math.ceil(o / (a.gp_dem_ori || 10)));
};
t.prototype.computeTipState = function(e, t, i, o) {
var a = Math.floor(e / Math.max(1, o + 1)), r = this.loadData(), n = {
state: "NO_SHOW",
nextRecord: t
};
(a = Math.floor(e / Math.max(1, r.gp_dem || 10))) > 0 && a > t && (n = {
state: "NO_SHOW",
nextRecord: a
});
e >= i && (n = {
state: e === i ? "BE_LIKE" : "NO_SHOW",
nextRecord: t
});
1 === e && 1 !== i && (n = {
state: "NOT_PASS",
nextRecord: t
});
var s = hs.chapterGameInfo.chapterAllNum || 96;
hs.chapterGameInfo.chapterNum >= s && (n = {
state: "BE_LIKE",
nextRecord: t
});
return n;
};
t.prototype.mapToPassState = function(e) {
switch (e) {
case "BE_LIKE":
return h.PASS_STATE.BE_LIKE;

case "NOT_PASS":
return h.PASS_STATE.NOT_PASS;

default:
return h.PASS_STATE.NO_SHOW;
}
};
t.prototype.showTipWhenUiReady = function(e) {
return s(this, void 0, void 0, function() {
var t, i, o;
return c(this, function(a) {
switch (a.label) {
case 0:
return [ 4, this.waitForWinRootNode(2e3) ];

case 1:
return (t = a.sent()) && cc.isValid(t) ? [ 4, this.waitForOptimizingOrHardNode(t, 500) ] : [ 2 ];

case 2:
a.sent();
return [ 4, this.ensureTipInstance() ];

case 3:
i = a.sent();
this.tipNode && this.tipNode.parent !== t && (this.tipNode.parent = t);
this.tipNode.active = !1;
o = this.mapToPassState(e);
i.init(o, t, this);
return [ 2 ];
}
});
});
};
t.prototype.waitForOptimizingOrHardNode = function(e, t) {
void 0 === t && (t = 2e3);
return s(this, void 0, Promise, function() {
var i;
return c(this, function() {
i = Date.now();
return [ 2, new Promise(function(o) {
var a = function() {
if (cc.isValid(e)) {
var r = !!e.getChildByName("ResultOptimizing_UI"), n = !!e.getChildByName("hardLevelDefeat");
r || n ? o() : Date.now() - i >= t ? o() : setTimeoutSafe(a, 50);
} else o();
};
a();
}) ];
});
});
};
t.prototype.waitForWinRootNode = function(e) {
void 0 === e && (e = 2e3);
return s(this, void 0, Promise, function() {
var t;
return c(this, function() {
t = Date.now();
return [ 2, new Promise(function(i) {
var o = function() {
var a, r, n = "undefined" != typeof hs.ChapterScoreWin ? Cinst(hs.ChapterScoreWin) : null, s = "undefined" != typeof hs.ChapterCollectWin ? Cinst(hs.ChapterCollectWin) : null, c = null;
(null === (a = null == n ? void 0 : n.node) || void 0 === a ? void 0 : a.active) && cc.isValid(n.node) ? c = n.node : (null === (r = null == s ? void 0 : s.node) || void 0 === r ? void 0 : r.active) && cc.isValid(s.node) && (c = s.node);
c ? i(c) : Date.now() - t >= e ? i(null) : setTimeoutSafe(o, 50);
};
o();
}) ];
});
});
};
t.prototype.showCompletedLevelsInstantlyForMosaic = function(e) {
for (var t = hs.chapterGameInfo, i = t.chapterNum, o = t.lastChapterNum, a = 0; a < e.itemList.length; a++) {
var r = e.itemList[a];
a < i && r.setState({
isStopAllAction: !0,
isShowAnimation: !1,
showColor: !0,
isOpacityAni: !1,
opacity: 255
});
}
i <= o && !hs.chapterGameInfo.isThroughAll && storage.setItem("lastChapterNum", i);
};
t.prototype.playGlowEffect = function(e) {
if (e) {
var t = null, i = e.colorImg;
i && (i instanceof cc.Node ? t = i : i.node && i.node instanceof cc.Node && (t = i.node));
var o = null, a = e.light;
a && (a instanceof cc.Node ? o = a : a.node && a.node instanceof cc.Node && (o = a.node));
if (t && cc.isValid(t)) {
var r = cc.instantiate(t);
r.parent = t.parent;
r.position = t.position;
var n = r.getComponent(cc.Sprite);
if (n) {
n.srcBlendFactor = cc.macro.BlendFactor.SRC_ALPHA;
n.dstBlendFactor = cc.macro.BlendFactor.ONE;
}
r.opacity = 0;
cc.Tween.stopAllByTarget(r);
cc.tween(r).to(.1, {
opacity: 255
}).to(.3, {
opacity: 0
}).call(function() {
cc.Tween.stopAllByTarget(r);
cc.isValid(r) && r.destroy();
}).start();
}
if (o && cc.isValid(o)) {
o.opacity = 0;
cc.Tween.stopAllByTarget(o);
cc.tween(o).to(.1, {
opacity: 255
}).to(.17, {
opacity: 0
}).call(function() {
cc.Tween.stopAllByTarget(o);
}).start();
}
}
};
t.prototype.showRowByRowAnimation = function(e) {
var t = this, i = e.target, o = e.args[0];
if (o && cc.isValid(o) && i._rowItems && 0 !== i._rowItems.length) {
this.mosaicNodeRef = o;
if (this.mosaicRowTween) {
this.mosaicRowTween.stop();
this.mosaicRowTween = null;
}
cc.Tween.stopAllByTarget(o);
var a = 0;
this.showCompletedLevelsInstantlyForMosaic(i);
var r = function() {
if (o && cc.isValid(o)) if (a > i._heightLength - 1) {
if (t.mosaicRowTween) {
t.mosaicRowTween.stop();
t.mosaicRowTween = null;
}
t.playDistanceBasedAnimation(e);
} else {
var n = i._rowItems[a];
n && n.length > 0 && n.forEach(function(e) {
e && cc.isValid(e) && (e.node.active = !0);
});
a++;
if (o && cc.isValid(o)) {
cc.Tween.stopAllByTarget(o);
t.mosaicRowTween = cc.tween(o).delay(.03).call(r);
t.mosaicRowTween.start();
}
} else if (t.mosaicRowTween) {
t.mosaicRowTween.stop();
t.mosaicRowTween = null;
}
};
r();
}
};
t.prototype.playDistanceBasedAnimation = function(e) {
var t, i, o, a, r = this, n = e.target, s = e.args[0];
if (n._itemPositions && 0 !== n._itemPositions.length) {
this.mosaicNodeRef = s;
if (this.mosaicDistanceTween) {
this.mosaicDistanceTween.stop();
this.mosaicDistanceTween = null;
}
s && cc.isValid(s) && cc.Tween.stopAllByTarget(s);
var c = hs.chapterGameInfo;
if (!(c.chapterNum - c.lastChapterNum <= 0)) {
var h = Infinity;
try {
for (var p = l(n._itemPositions), u = p.next(); !u.done; u = p.next()) (v = u.value).col < h && (h = v.col);
} catch (e) {
t = {
error: e
};
} finally {
try {
u && !u.done && (i = p.return) && i.call(p);
} finally {
if (t) throw t.error;
}
}
var d = new Map();
try {
for (var f = l(n._itemPositions), m = f.next(); !m.done; m = f.next()) {
var v = m.value, y = Math.abs(v.row - 0) + Math.abs(v.col - h);
d.has(y) || d.set(y, []);
d.get(y).push(v.item);
}
} catch (e) {
o = {
error: e
};
} finally {
try {
m && !m.done && (a = f.return) && a.call(f);
} finally {
if (o) throw o.error;
}
}
var g = Array.from(d.keys()).sort(function(e, t) {
return e - t;
}), _ = 0, w = function() {
if (_ >= g.length) {
if (r.mosaicDistanceTween) {
r.mosaicDistanceTween.stop();
r.mosaicDistanceTween = null;
}
} else {
var e = g[_];
d.get(e).forEach(function(e) {
e && e.state && e.state.showColor && r.playGlowEffect(e);
});
_++;
if (s && cc.isValid(s)) {
cc.Tween.stopAllByTarget(s);
r.mosaicDistanceTween = cc.tween(s).delay(.08).call(function() {
w();
});
r.mosaicDistanceTween.start();
}
}
};
w();
}
}
};
t.prototype.stopMosaicAnimations = function() {
if (this.mosaicRowTween) {
this.mosaicRowTween.stop();
this.mosaicRowTween = null;
}
if (this.mosaicDistanceTween) {
this.mosaicDistanceTween.stop();
this.mosaicDistanceTween = null;
}
this.mosaicNodeRef && cc.isValid(this.mosaicNodeRef) && cc.Tween.stopAllByTarget(this.mosaicNodeRef);
this.mosaicNodeRef = null;
};
t.prototype.addPassTimes = function() {
var e = this.loadData();
e.passTimes = Math.max(0, e.passTimes || 0) + 1;
this.saveData(e);
};
t.prototype.getLeftPassTimes = function() {
var e = this.getFixedPassTarget();
if (e > 0) return e;
var t = this.loadData(), i = hs.chapterGameInfo.chapterAllNum || 96;
return Math.max(1, Math.ceil((i - hs.chapterGameInfo.chapterNum) / (t.gp_dem || 10)));
};
t.prototype.getGpDem = function() {
var e = this.loadData();
return e.gp_dem_ori || e.gp_dem || 10;
};
t.prototype.onActive = function(e) {
var t, i;
if (hs.tp.isChapterGame_ProxyOnStartGame(e)) {
var o = this.loadData();
if (!this.isSameDay(o.refreshTime, Date.now())) {
o.refreshTime = Date.now();
o.passTimes = 0;
o.recordPassNum = 0;
o.gp_dem_ori = o.gp_dem;
o.currentPassNum = hs.chapterGameInfo.chapterNum;
}
this.saveData(o);
} else if (hs.tp.isChapterGame_ProxyOnGameOver(e)) {
if (!hs.gameOverGameInfo.isChapterWin) return;
o = this.loadData();
if (!this.isSameDay(o.refreshTime, Date.now())) {
o.refreshTime = Date.now();
o.passTimes = 0;
o.recordPassNum = 0;
o.gp_dem_ori = o.gp_dem;
o.currentPassNum = hs.chapterGameInfo.chapterNum;
}
o.passTimes = Math.max(0, o.passTimes || 0) + 1;
this.saveData(o);
} else if (hs.tp.isChapterCollectWinShowOtherTraitAnim(e) || hs.tp.isChapterScoreWinShowOtherTraitAnim(e)) this.tryShowTravelPassTips(); else if (hs.tp.isChapterCollectWinOnDisable(e) || hs.tp.isChapterScoreWinOnDisable(e)) {
var a = e.target.node.getChildByName("TravelPassLevelTip");
a && (a.active = !1);
this.stopMosaicAnimations();
} else if (hs.tp.isTravelResultOptimizingTraitShowMosaicNode(e)) {
(n = e.args[0]).active = !1;
e.replace = !0;
} else if (hs.tp.isTravelResultOptimizingTraitMoveChapter(e)) {
e.replace = !0;
var r = e.target, n = e.args[0];
r._rowItems = [];
r._itemPositions = [];
if (!r._rowItems || 0 === r._rowItems.length) {
for (var s = Array.isArray(r.itemList) ? r.itemList : [], c = [], h = new Map(), p = 0; p < s.length; p++) {
var u = s[p], d = u && u.node;
if (d && cc.isValid(d)) {
var f = Math.round(d.y), m = void 0;
try {
for (var v = (t = void 0, l(c)), y = v.next(); !y.done; y = v.next()) {
var g = y.value;
if (Math.abs(g - f) <= 1) {
m = g;
break;
}
}
} catch (e) {
t = {
error: e
};
} finally {
try {
y && !y.done && (i = v.return) && i.call(v);
} finally {
if (t) throw t.error;
}
}
if (void 0 === m) {
m = f;
c.push(m);
}
h.has(m) || h.set(m, []);
h.get(m).push(u);
u.setState({
isStopAllAction: !0,
isShowAnimation: !1,
showColor: !1,
isOpacityAni: !1,
opacity: 0
});
u.node.active = !1;
}
}
n.active = !0;
c.sort(function(e, t) {
return e - t;
});
r._rowItems = c.map(function(e) {
var t = h.get(e) || [];
t.sort(function(e, t) {
return e.node.x - t.node.x;
});
return t;
});
r._rowItems.forEach(function(e, t) {
e.forEach(function(e, i) {
r._itemPositions.push({
item: e,
row: t,
col: i
});
});
});
"number" == typeof r._heightLength && r._heightLength === r._rowItems.length || (r._heightLength = r._rowItems.length);
}
var _ = hs.chapterGameInfo;
if (_.chapterNum - _.lastChapterNum <= 0) {
n.active = !0;
this.showCompletedLevelsInstantlyForMosaic(r);
return;
}
this.showRowByRowAnimation(e);
}
};
t.prototype.tryShowTravelPassTips = function() {
var e = this.loadData(), t = this.getRemainRefreshTime(), i = hs.chapterGameInfo.chapterAllNum || 96, o = Math.floor(t / 86400), a = this.calcPassTarget("number" == typeof e.currentPassNum ? e.currentPassNum : hs.chapterGameInfo.chapterNum, i, t), r = this.computeTipState(Math.max(0, e.passTimes || 0), Math.max(0, e.recordPassNum || 0), a, o), n = r.state, s = r.nextRecord;
e.recordPassNum = s;
if ("NO_SHOW" !== n) {
this.showTipWhenUiReady(n);
"BE_LIKE" === n && (e.gp_dem = Math.max(1, e.gp_dem - 1));
this.saveData(e);
} else this.saveData(e);
};
return n([ classId("$28510_f_TravelPassTipsTrait"), classMethodWatch() ], t);
}(Trait);
i.$28510_f_TravelPassTipsTrait = p;
cc._RF.pop();
}, {
"../components/TravelPassLevelTipComponent": "TravelPassLevelTipComponent"
} ],
TravelPassLevelTipComponent: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "77a55MKF9RPlI1RE1dT1y4A", "TravelPassLevelTipComponent");
var o, a = this && this.__extends || (o = function(e, t) {
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
}), r = this && this.__decorate || function(e, t, i, o) {
var a, r = arguments.length, n = r < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, i) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(e, t, i, o); else for (var s = e.length - 1; s >= 0; s--) (a = e[s]) && (n = (r < 3 ? a(n) : r > 3 ? a(t, i, n) : a(t, i)) || n);
return r > 3 && n && Object.defineProperty(t, i, n), n;
}, n = this && this.__values || function(e) {
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
};
Object.defineProperty(i, "__esModule", {
value: !0
});
i.PASS_STATE = void 0;
var s, c = cc._decorator, l = c.ccclass, h = c.property;
(function(e) {
e[e.NO_SHOW = 0] = "NO_SHOW";
e[e.PASS = 1] = "PASS";
e[e.NOT_PASS = 2] = "NOT_PASS";
e[e.BE_LIKE = 3] = "BE_LIKE";
})(s = i.PASS_STATE || (i.PASS_STATE = {}));
var p = function(e) {
a(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.dragonBones = null;
t.word_1 = null;
t.word_2 = null;
t.rootNode = null;
t.tipsTrait = null;
return t;
}
t.prototype.init = function(e, t, i) {
var o = this;
this.__state = e;
this.rootNode = t;
this.tipsTrait = i;
this.changeSkin();
setTimeout(function() {
if (cc.isValid(o.node)) {
o.node.active = !0;
o.updateTipsView();
}
}, 100);
if (hs.multiLangInfo.checkLangIsKorean()) {
null != this.word_1 && (this.word_1.font = null);
null != this.word_2 && (this.word_2.font = null);
}
};
t.prototype.changeSkin = function() {};
t.prototype.updateTipsView = function() {
var e, t = "gold1";
this.word_2.string = "Finish the season and full mosaic!";
var i = null, o = null;
if (cc.isValid(this.word_1) && (i = this.word_1.node.parent.getChildByName("gpLayout"))) {
o = null === (e = i.children[1]) || void 0 === e ? void 0 : e.getComponent(cc.Label);
i.active = !1;
}
switch (this.__state) {
case s.PASS:
t = "gold3";
this.word_1.string = "";
break;

case s.NOT_PASS:
t = "gold1";
if (this.tipsTrait.getFixedPassTarget() > 0) {
this.word_1.node.active = !0;
this.word_1.string = "Daily Goal: {0} levels";
var a = this.word_1.string;
a = hs.multiLangInfo.replaceString(a, [ this.tipsTrait.getLeftPassTimes() + "" ]);
this.word_1.string = a;
} else {
this.word_1.node.active = !0;
var r = (hs.chapterGameInfo.chapterAllNum || 96) - hs.chapterGameInfo.chapterNum;
this.word_1.string = "{0} Levels! Finish the season.";
a = this.word_1.string;
a = hs.multiLangInfo.replaceString(a, [ r + "" ]);
this.word_1.string = a;
}
break;

case s.BE_LIKE:
t = "gold2";
if (this.tipsTrait.getFixedPassTarget() > 0) {
this.word_1.node.active = !0;
this.word_1.string = "Daily Goal Complete!";
} else if (cc.isValid(i) && cc.isValid(o)) {
this.word_1.node.active = !1;
if (0 == (r = (hs.chapterGameInfo.chapterAllNum || 96) - hs.chapterGameInfo.chapterNum)) {
this.word_1.node.active = !0;
this.word_1.string = "Daily Goal Complete!";
} else {
i.active = !0;
var n = this.tipsTrait.getGpDem(), c = r < n ? 1 : n;
o.string = "" + c;
}
} else {
this.word_1.node.active = !0;
this.word_1.string = "Daily Goal Complete!";
}
}
if (this.__state !== s.NO_SHOW) {
this.dragonBones.playAnimation(t, 1);
this.autoAdapt();
} else this.node.active = !1;
};
t.prototype.autoAdapt = function() {
var e, t, i, o, a, r, n, s, c;
(null === (e = this.rootNode.getChildByName("ResultOptimizing_UI")) || void 0 === e ? void 0 : e.active) ? c = this.rootNode.getChildByName("ResultOptimizing_UI") : (null === (t = this.rootNode.getChildByName("scoreBoneAni")) || void 0 === t ? void 0 : t.active) ? c = this.rootNode.getChildByName("scoreBoneAni") : (null === (i = this.rootNode.getChildByName("scoreEffect")) || void 0 === i ? void 0 : i.active) ? c = this.rootNode.getChildByName("scoreEffect") : (null === (o = this.rootNode.getChildByName("Collect")) || void 0 === o ? void 0 : o.active) ? c = this.rootNode.getChildByName("Collect") : (null === (a = this.rootNode.getChildByName("collectItemNode")) || void 0 === a ? void 0 : a.active) ? c = this.rootNode.getChildByName("collectItemNode") : (null === (r = this.rootNode.getChildByName("Score")) || void 0 === r ? void 0 : r.active) && (c = this.rootNode.getChildByName("Score"));
(null === (n = this.rootNode.getChildByName("hardLevelDefeat")) || void 0 === n ? void 0 : n.active) && (c = this.rootNode.getChildByName("hardLevelDefeat"));
if (cc.isValid(c)) {
var l = this.rootNode.getChildByName("playBtn"), h = this.rootNode.getChildByName("playBtnIOS"), p = c.y, u = "ResultOptimizing_UI" === c.name ? -220 : this.getNodeBoundingBox(c).height, d = null === (s = this.rootNode) || void 0 === s ? void 0 : s.getChildByName("PassLevelReward"), f = 0;
if ("collectItemNode" === c.name) {
f = 40;
d && d.active && (d.y -= 20);
}
var m = 0;
if (d && d.active && "ResultOptimizing_UI" === c.name) d.y -= d.height + 40 + 150; else if (d && d.active && "scoreBoneAni" === c.name) {
m += 20;
d.y -= 50;
}
this.node.y = p - u / 2 - 40 - 42 - f;
var v = this.rootNode.name;
"scoreEffect" === c.name && "ChapterReduceScoreWin" == v ? this.node.y = this.node.y - 50 : "Score" === c.name ? this.node.y = this.node.y - 200 : "Collect" === c.name && (this.node.y = this.node.y + 80);
if ("hardLevelDefeat" === c.name) {
this.node.y = c.y - 513;
d && d.active && (d.y -= 50);
}
l && (l.y = this.node.y - 84 - 66 - l.height / 2 + m);
h && (h.y = this.node.y - 84 - 66 - h.height / 2 + m);
this.afterAutoAdapt();
} else this.node.active = !1;
};
t.prototype.afterAutoAdapt = function() {};
t.prototype.getNodeBoundingBox = function(e) {
var t = e || this.node, i = t.getBoundingBox();
if (0 === t.children.length) return i;
var o = i.x, a = i.y, r = i.x + i.width, s = i.y + i.height, c = function(e) {
var t, i;
try {
for (var l = n(e.children), h = l.next(); !h.done; h = l.next()) {
var p = h.value, u = p.getBoundingBox();
o = Math.min(o, u.x);
a = Math.min(a, u.y);
r = Math.max(r, u.x + u.width);
s = Math.max(s, u.y + u.height);
c(p);
}
} catch (e) {
t = {
error: e
};
} finally {
try {
h && !h.done && (i = l.return) && i.call(l);
} finally {
if (t) throw t.error;
}
}
};
c(t);
return cc.rect(o, a, r - o, s - a);
};
r([ h(dragonBones.ArmatureDisplay) ], t.prototype, "dragonBones", void 0);
r([ h(cc.Label) ], t.prototype, "word_1", void 0);
r([ h(cc.Label) ], t.prototype, "word_2", void 0);
return r([ classId("TravelPassLevelTipComponent"), l, classMethodWatch() ], t);
}(hs.Component);
i.default = p;
cc._RF.pop();
}, {} ]
}, {}, [ "TravelPassLevelTipComponent", "$28510_f_TravelPassTipsTrait" ]);
//# sourceMappingURL=index.js.map
