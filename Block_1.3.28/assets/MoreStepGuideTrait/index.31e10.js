window.__require = function e(t, o, r) {
function n(a, c) {
if (!o[a]) {
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
var l = o[a] = {
exports: {}
};
t[a][0].call(l.exports, function(e) {
return n(t[a][1][e] || e);
}, l, l.exports, e, t, o, r);
}
return o[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < r.length; a++) n(r[a]);
return n;
}({
MoreStepGuideConfig: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "fb4c3y1A/xO4b06Mwfw2VoZ", "MoreStepGuideConfig");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.MoreStepGuidePage = void 0;
(function(e) {
e[e.Normal = 0] = "Normal";
e[e.Page1 = 1] = "Page1";
e[e.Page2 = 2] = "Page2";
e[e.Page3 = 3] = "Page3";
e[e.Page4 = 4] = "Page4";
e[e.Page5 = 5] = "Page5";
e[e.Page6 = 6] = "Page6";
e[e.Page7 = 7] = "Page7";
e[e.Page8 = 8] = "Page8";
e[e.Page9 = 9] = "Page9";
})(o.MoreStepGuidePage || (o.MoreStepGuidePage = {}));
cc._RF.pop();
}, {} ],
MoreStepGuideInfo: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "48fadt9GU5B1ZzyL0IMtecc", "MoreStepGuideInfo");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.moreStepGuideInfo = void 0;
var r = e("./MoreStepGuideConfig"), n = function() {
function e() {
this._curPage = r.MoreStepGuidePage.Normal;
}
Object.defineProperty(e.prototype, "curPage", {
get: function() {
return this._curPage;
},
enumerable: !1,
configurable: !0
});
e.prototype.setCurPage = function(e) {
var t = storage.getItem("moreStepGuidePages", []);
if (-1 == t.indexOf(e)) {
t.push(e);
storage.setItem("moreStepGuidePages", t);
}
this._curPage = e;
};
e.prototype.getPageOver = function(e) {
return -1 != storage.getItem("moreStepGuidePages", []).indexOf(e);
};
Object.defineProperty(e.prototype, "getOperChapterNum", {
get: function() {
return storage.getItem("moreStepGuideOperChapterNum", 0);
},
enumerable: !1,
configurable: !0
});
e.prototype.openChapter = function() {
var e = this.getOperChapterNum;
storage.setItem("moreStepGuideOperChapterNum", e + 1);
};
e.prototype.openWin = function() {
var e = this.getOperWinNum;
storage.setItem("moreStepGuideOperWinNum", e + 1);
};
Object.defineProperty(e.prototype, "getOperWinNum", {
get: function() {
return storage.getItem("moreStepGuideOperWinNum", 0);
},
enumerable: !1,
configurable: !0
});
e.prototype.openFail = function() {
var e = this.getOperFailNum;
storage.setItem("moreStepGuideOperFailNum", e + 1);
};
Object.defineProperty(e.prototype, "getOperFailNum", {
get: function() {
return storage.getItem("moreStepGuideOperFailNum", 0);
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "getModeChoiceNum", {
get: function() {
return storage.getItem("moreStepGuideOperModeChoiceNum", 0);
},
enumerable: !1,
configurable: !0
});
e.prototype.openModeChoice = function() {
var e = this.getModeChoiceNum;
storage.setItem("moreStepGuideOperModeChoiceNum", e + 1);
};
Object.defineProperty(e.prototype, "getTouchBlockProducerInfo", {
get: function() {
return storage.getItem("moreStepGuideTouchBlockProducerInfo", {});
},
enumerable: !1,
configurable: !0
});
e.prototype.getTouchBlockProducerNumByKey = function(e) {
return this.getTouchBlockProducerInfo[e] || 0;
};
e.prototype.setTouchBlockProducerInfo = function(e) {
storage.setItem("moreStepGuideTouchBlockProducerInfo", e);
};
Object.defineProperty(e.prototype, "getTouchblockProducerNotDownInfo", {
get: function() {
return storage.getItem("moreStepGuideTouchblockProducerNotDownInfo", {});
},
enumerable: !1,
configurable: !0
});
e.prototype.getTouchblockProducerNotDownNumByKey = function(e) {
return this.getTouchblockProducerNotDownInfo[e] || 0;
};
e.prototype.setTouchblockProducerNotDown = function(e) {
storage.setItem("moreStepGuideTouchblockProducerNotDownInfo", e);
};
Object.defineProperty(e.prototype, "getClassResultNum", {
get: function() {
return storage.getItem("moreStepGuideClassResultNum", 0);
},
enumerable: !1,
configurable: !0
});
e.prototype.showClassResult = function() {
var e = this.getClassResultNum;
storage.setItem("moreStepGuideClassResultNum", e + 1);
};
Object.defineProperty(e.prototype, "curGameHasShow", {
get: function() {
return storage.getItem("moreStepGuideCurGameHasShow", {});
},
enumerable: !1,
configurable: !0
});
e.prototype.getCurGameHasShowByKey = function(e) {
return this.curGameHasShow[e] || 0;
};
e.prototype.setCurGameHasShow = function(e) {
var t = this.curGameHasShow;
t[e] = 1;
storage.setItem("moreStepGuideCurGameHasShow", t);
};
return e;
}();
o.moreStepGuideInfo = new n();
cc._RF.pop();
}, {
"./MoreStepGuideConfig": "MoreStepGuideConfig"
} ],
MoreStepGuideTrait: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "eec0az0K0dC/5aS98XOGZnP", "MoreStepGuideTrait");
var r, n = this && this.__extends || (r = function(e, t) {
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
var n, i = arguments.length, a = i < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, o, r); else for (var c = e.length - 1; c >= 0; c--) (n = e[c]) && (a = (i < 3 ? n(a) : i > 3 ? n(t, o, a) : n(t, o)) || a);
return i > 3 && a && Object.defineProperty(t, o, a), a;
}, a = this && this.__values || function(e) {
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
}, c = this && this.__read || function(e, t) {
var o = "function" == typeof Symbol && e[Symbol.iterator];
if (!o) return e;
var r, n, i = o.call(e), a = [];
try {
for (;(void 0 === t || t-- > 0) && !(r = i.next()).done; ) a.push(r.value);
} catch (e) {
n = {
error: e
};
} finally {
try {
r && !r.done && (o = i.return) && o.call(i);
} finally {
if (n) throw n.error;
}
}
return a;
}, u = this && this.__spread || function() {
for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(c(arguments[t]));
return e;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.MoreStepGuideTrait = void 0;
var s = e("./MoreStepGuide_MainUI"), l = e("./MoreStepGuideConfig"), p = e("./MoreStepGuideInfo"), f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._curPage = l.MoreStepGuidePage.Normal;
t._timer = -1;
t.isFirstBlock = !1;
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "Eliminate_Effects_Proxy",
methodName: "onBlockProducerAnyTouchEnd"
}, {
className: "BoardEffect_Proxy",
methodName: "onGenerateEnd"
}, {
className: "ChapterList",
methodName: "getTopContainer"
}, {
className: "AdventureOverdue_Proxy",
methodName: "onGameOverGameEndPre"
}, {
className: "AdventureOverdue_Proxy",
methodName: "onModeChoiceGame"
}, {
className: "Encourage_Proxy",
methodName: "onGameReplay"
} ];
};
t.prototype.onCreate = function() {
this.showGuide();
this.addEventListener();
};
t.prototype.addEventListener = function() {
var e = this, t = [ "ChapterScoreWin", "ChapterCollectWin", "ChapterReduceScoreWin", "ChapterReduceCollectWin" ], o = [ "ChapterScoreFail", "ChapterCollectFail", "ChapterReduceScoreFail", "ChapterReduceCollectFail" ], r = [ "ChapterList", "ClassFail", "ClassWin" ].concat(t, o);
hs.UI.addEventListener("open", function(r) {
if (r == hs.PrefabConfig.HomePage) {
e.clearTimer();
e.updateGuide({
block: null,
blockMoveInfo: null,
click: !1,
clickPos: null
});
p.moreStepGuideInfo.openModeChoice();
e.checkPage3();
}
if ("ChapterList" == r.name) {
e.updateGuide({
block: null,
blockMoveInfo: null,
click: !1,
clickPos: null
});
p.moreStepGuideInfo.openChapter();
e.checkPage4();
}
if (t.includes(r.name)) {
p.moreStepGuideInfo.openWin();
e.checkPage5();
}
if (o.includes(r.name)) {
p.moreStepGuideInfo.openFail();
e.checkPage6();
}
if ("ClassFail" == r.name || "ClassWin" == r.name) {
p.moreStepGuideInfo.showClassResult();
e.checkPage7();
}
r === hs.PrefabConfig.Achievement_Main && e.updateGuide({
block: null,
blockMoveInfo: null,
click: !1,
clickPos: null
});
});
hs.UI.addEventListener("close", function(t) {
if (r.includes(t.name)) {
e.clearTimer();
e.updateGuide({
block: null,
blockMoveInfo: null,
click: !1,
clickPos: null
});
}
});
};
t.prototype.onActive = function(e) {
if (hs.tp.isEliminate_Effects_ProxyOnBlockProducerAnyTouchEnd(e)) {
var t = hs.blocksProducerInfo.producerBlocks;
if (this.isFirstBlock && -1 == t.indexOf(-1)) {
var o = p.moreStepGuideInfo.getTouchblockProducerNotDownInfo;
o[r = this.getKey()] || (o[r] = 0);
o[r]++;
p.moreStepGuideInfo.setTouchblockProducerNotDown(o);
this.checkPage1();
this.checkPage8();
}
}
if (hs.tp.isBoardEffect_ProxyOnGenerateEnd(e) && -1 == (t = hs.blocksProducerInfo.producerBlocks).indexOf(-1)) {
this.checkPage1();
this.checkPage2();
this.checkPage8();
this.checkPage9();
}
if (hs.tp.isAdventureOverdue_ProxyOnGameOverGameEndPre(e) || hs.tp.isAdventureOverdue_ProxyOnModeChoiceGame(e) || hs.tp.isEncourage_ProxyOnGameReplay(e)) {
this.clearTimer();
this.updateGuide({
block: null,
blockMoveInfo: null,
click: !1,
clickPos: null
});
}
if (hs.tp.isBlocksProducerTouchOnTouchStart(e)) {
-1 == (t = hs.blocksProducerInfo.producerBlocks).indexOf(-1) ? this.isFirstBlock = !0 : this.isFirstBlock = !1;
var r, n = p.moreStepGuideInfo.getTouchBlockProducerInfo;
n[r = this.getKey()] || (n[r] = 0);
n[r]++;
p.moreStepGuideInfo.setTouchBlockProducerInfo(n);
this.clearTimer();
this.updateGuide({
block: null,
blockMoveInfo: null,
click: !1,
clickPos: null
});
}
if (hs.tp.isSetup_ProxyOnClick_home(e)) {
this.clearTimer();
this.updateGuide({
block: null,
blockMoveInfo: null,
click: !1,
clickPos: null
});
}
};
t.prototype.getKey = function(e) {
var t = "";
if (hs.gameInfo.gameMode == hs.GameMode.Class) {
var o = storage.getItem("classRoundNum", 0), r = storage.getItem("classGameNum", 0);
t = hs.gameInfo.gameMode + "_" + r + "_" + o;
} else if (hs.gameInfo.gameMode == hs.GameMode.Chapter) {
o = storage.getItem("chapterRoundNum", 0), r = storage.getItem("chapterGameNum", 0);
t = hs.gameInfo.gameMode + "_" + r + "_" + o;
}
e && (t += "_" + e);
return t;
};
t.prototype.getBlockGuideInfo = function() {
var e = this.checkCanAllDown();
if (e) {
var t = this.getBlockProducerItem(e.order[0]);
if (null == t ? void 0 : t.node) {
var o = t.node.parent.convertToWorldSpaceAR(t.node.position), r = hs.boardRendererInfo.blocks[e.positions[0].y][e.positions[0].x];
return {
info: e,
startPos: o,
endPos: r.parent.convertToWorldSpaceAR(r.position),
color: t.color
};
}
}
};
t.prototype.checkPage1 = function() {
var e = this;
if (p.moreStepGuideInfo.getPageOver(l.MoreStepGuidePage.Page1)) ; else if (hs.gameInfo.gameMode == hs.GameMode.Class) {
if (storage.getItem("classGameNum", 0) > 0) return;
if (1 == storage.getItem("classRoundNum", 0)) return;
if (p.moreStepGuideInfo.getTouchblockProducerNotDownNumByKey(this.getKey()) > 1) return;
this.startTimer(this.props.actionTime1, function() {
p.moreStepGuideInfo.setCurPage(l.MoreStepGuidePage.Page1);
var t = e.getBlockGuideInfo();
e.updateGuide({
block: t.info.order[0],
blockMoveInfo: {
start: t.startPos,
end: t.endPos
},
color: t.color,
click: !1,
clickPos: null
});
}, l.MoreStepGuidePage.Page1);
}
};
t.prototype.checkPage2 = function() {
var e = this;
if (p.moreStepGuideInfo.getPageOver(l.MoreStepGuidePage.Page2)) ; else if (hs.gameInfo.gameMode == hs.GameMode.Class) {
if (storage.getItem("classGameNum", 0) > 4) {
p.moreStepGuideInfo.setCurPage(l.MoreStepGuidePage.Page2);
return;
}
if (p.moreStepGuideInfo.getTouchBlockProducerNumByKey(this.getKey()) > 0) return;
if (p.moreStepGuideInfo.getCurGameHasShowByKey(this.getKey(l.MoreStepGuidePage.Page2 + "")) > 0) return;
storage.getItem("classRoundNum", 0) <= 1 && this.startTimer(this.props.actionTime2, function() {
p.moreStepGuideInfo.setCurGameHasShow(e.getKey(l.MoreStepGuidePage.Page2 + ""));
var t = e.getBlockGuideInfo();
e.updateGuide({
block: t.info.order[0],
blockMoveInfo: {
start: t.startPos,
end: t.endPos
},
color: t.color,
click: !1,
clickPos: null
});
}, l.MoreStepGuidePage.Page2);
}
};
t.prototype.checkPage3 = function() {
var e = this;
if (p.moreStepGuideInfo.getPageOver(l.MoreStepGuidePage.Page3)) ; else {
var t = p.moreStepGuideInfo.getModeChoiceNum;
if (t > 2) p.moreStepGuideInfo.setCurPage(l.MoreStepGuidePage.Page3); else {
var o = 1 == t ? this.props.actionTime2 : this.props.actionTime1;
this.startTimer(o, function() {
var t = Cinst(hs.HomePageSectionChapterBtnDefault);
if (t) {
var o = t, r = o.node.parent.convertToWorldSpaceAR(o.node.position);
e.updateGuide({
click: !0,
clickPos: cc.v3(r.x + 180, r.y),
block: null
});
}
}, l.MoreStepGuidePage.Page3);
}
}
};
t.prototype.checkPage4 = function() {
var e = this;
if (p.moreStepGuideInfo.getPageOver(l.MoreStepGuidePage.Page4)) ; else {
var t = p.moreStepGuideInfo.getOperChapterNum;
if (t > 2) p.moreStepGuideInfo.setCurPage(l.MoreStepGuidePage.Page4); else {
var o = 1 == t ? this.props.actionTime2 : this.props.actionTime1;
this.startTimer(o, function() {
var t = cc.director.getScene().getComponentInChildren("ChapterList");
if (t) {
var o = t.chapterBtn, r = o.parent.convertToWorldSpaceAR(o.position);
e.updateGuide({
click: !0,
clickPos: cc.v3(r.x + 180, r.y),
block: null
});
}
}, l.MoreStepGuidePage.Page4);
}
}
};
t.prototype.checkPage5 = function() {
var e = this;
if (p.moreStepGuideInfo.getPageOver(l.MoreStepGuidePage.Page5)) ; else {
var t = p.moreStepGuideInfo.getOperWinNum;
if (t > 2) p.moreStepGuideInfo.setCurPage(l.MoreStepGuidePage.Page5); else {
var o = 1 == t ? this.props.actionTime2 : this.props.actionTime1;
this.startTimer(o, function() {
var t = cc.director.getScene().getComponentInChildren("ChapterScoreWin");
t && t.node.active || (t = cc.director.getScene().getComponentInChildren("ChapterCollectWin"));
if (t) {
var o = t.playBtn.node, r = o.parent.convertToWorldSpaceAR(o.position);
e.updateGuide({
click: !0,
clickPos: cc.v3(r.x + 180, r.y),
block: null
});
}
}, l.MoreStepGuidePage.Page5);
}
}
};
t.prototype.checkPage6 = function() {
var e = this;
if (p.moreStepGuideInfo.getPageOver(l.MoreStepGuidePage.Page6)) ; else {
var t = p.moreStepGuideInfo.getOperFailNum;
if (t > 2) p.moreStepGuideInfo.setCurPage(l.MoreStepGuidePage.Page6); else {
var o = 1 == t ? this.props.actionTime2 : this.props.actionTime1;
this.startTimer(o, function() {
var t = cc.director.getScene().getComponentInChildren("ChapterScoreFail");
t && t.node.active || (t = cc.director.getScene().getComponentInChildren("ChapterCollectFail"));
if (t) {
var o = t.playBtn.node, r = o.parent.convertToWorldSpaceAR(o.position);
e.updateGuide({
click: !0,
clickPos: cc.v3(r.x + 180, r.y),
block: null
});
}
}, l.MoreStepGuidePage.Page6);
}
}
};
t.prototype.checkPage7 = function() {
var e = this;
if (p.moreStepGuideInfo.getPageOver(l.MoreStepGuidePage.Page7)) ; else {
var t = p.moreStepGuideInfo.getClassResultNum;
if (t > 2) p.moreStepGuideInfo.setCurPage(l.MoreStepGuidePage.Page7); else {
var o = 1 == t ? this.props.actionTime2 : this.props.actionTime1;
this.startTimer(o, function() {
var t = cc.director.getScene().getComponentInChildren("ClassFail");
t && t.node.active || (t = cc.director.getScene().getComponentInChildren("ClassWin"));
if (t) {
var o = t.playBtn.node, r = o.parent.convertToWorldSpaceAR(o.position);
e.updateGuide({
click: !0,
clickPos: cc.v3(r.x + 180, r.y),
block: null
});
}
}, l.MoreStepGuidePage.Page7);
}
}
};
t.prototype.checkPage8 = function() {
var e = this;
if (p.moreStepGuideInfo.getPageOver(l.MoreStepGuidePage.Page8)) ; else if (hs.gameInfo.gameMode == hs.GameMode.Chapter) {
if (storage.getItem("chapterGameNum", 0) > 0) {
p.moreStepGuideInfo.setCurPage(l.MoreStepGuidePage.Page8);
return;
}
if (p.moreStepGuideInfo.getTouchblockProducerNotDownNumByKey(this.getKey()) > 1) return;
storage.getItem("chapterRoundNum", 0) > 1 && this.startTimer(this.props.actionTime1, function() {
p.moreStepGuideInfo.setCurPage(l.MoreStepGuidePage.Page8);
var t = e.getBlockGuideInfo();
e.updateGuide({
block: t.info.order[0],
blockMoveInfo: {
start: t.startPos,
end: t.endPos
},
color: t.color,
click: !1,
clickPos: null
});
}, l.MoreStepGuidePage.Page8);
}
};
t.prototype.checkPage9 = function() {
var e = this;
if (p.moreStepGuideInfo.getPageOver(l.MoreStepGuidePage.Page9)) ; else if (hs.gameInfo.gameMode == hs.GameMode.Chapter) {
if (storage.getItem("chapterGameNum", 0) > 4) {
p.moreStepGuideInfo.setCurPage(l.MoreStepGuidePage.Page9);
return;
}
if (storage.getItem("chapterRoundNum", 0) > 1) return;
if (p.moreStepGuideInfo.getTouchBlockProducerNumByKey(this.getKey()) > 0) return;
if (p.moreStepGuideInfo.getCurGameHasShowByKey(this.getKey(l.MoreStepGuidePage.Page9 + "")) > 0) return;
this.startTimer(this.props.actionTime2, function() {
p.moreStepGuideInfo.setCurGameHasShow(e.getKey(l.MoreStepGuidePage.Page9 + ""));
var t = e.getBlockGuideInfo();
e.updateGuide({
block: t.info.order[0],
blockMoveInfo: {
start: t.startPos,
end: t.endPos
},
color: t.color,
click: !1,
clickPos: null
});
}, l.MoreStepGuidePage.Page9);
}
};
t.prototype.showGuide = function(e) {
hs.UI.show({
name: "MoreStepGuide",
url: "prefabs/MoreStepGuide",
bundleName: "MoreStepGuideTrait"
}, hs.uiLayer).then(function() {
var t = Cinst(s.default);
t && t.setState(e || {});
});
};
t.prototype.updateGuide = function(e) {
var t = Cinst(s.default);
t && t.setState(e);
};
t.prototype.startTimer = function(e, t) {
this.clearTimer();
this._timer = setTimeout(function() {
t && t();
}, 1e3 * e);
};
t.prototype.clearTimer = function() {
-1 != this._timer && clearTimeout(this._timer);
this._timer = -1;
};
t.prototype.getBlockProducerItem = function(e) {
var t = {
node: null,
color: null
}, o = Cinst(hs.BlocksProducer);
o && o.blocksContainer.children.forEach(function(o) {
var r = o.getComponent(hs.BlocksProducerItem);
if (r && r.state.id == e) {
t.node = r.node;
t.color = r.state.color;
}
});
return t;
};
t.prototype.checkCanAllDown = function() {
for (var e, t, o, r, n = hs.blocksProducerInfo.producerBlocks, i = hs.boardInfo.faceBlocks, c = {}, u = [], s = 0; s < n.length; s++) {
var l = n[s];
if (-1 != l) {
var p = [];
if (l >= hs.BlocksProducerType.ID1 && l < hs.BlocksProducerType.AllCountOfBlock) p = hs.blockPosInfo[l - 1]; else if (hs.blocksProducerInfo.checkAbnormalBlock(l) && 0 === (p = hs.abnormalBlockGameInfo.getBlockListById(l)).length) return null;
c[l] = p;
u.push(l);
}
}
if (0 === u.length) return null;
var f = this.getPermutations(u);
try {
for (var d = a(f), h = d.next(); !h.done; h = d.next()) {
var g = h.value;
if (y = this.tryPlaceBlocks(g, c, i)) return {
order: g,
positions: y
};
}
} catch (t) {
e = {
error: t
};
} finally {
try {
h && !h.done && (t = d.return) && t.call(d);
} finally {
if (e) throw e.error;
}
}
try {
for (var m = a(f), P = m.next(); !P.done; P = m.next()) {
var y;
g = P.value;
if (y = this.tryPlaceBlocksWithClear(g, c, i)) return {
order: g,
positions: y
};
}
} catch (e) {
o = {
error: e
};
} finally {
try {
P && !P.done && (r = m.return) && r.call(m);
} finally {
if (o) throw o.error;
}
}
return null;
};
t.prototype.getPermutations = function(e) {
var t, o;
if (e.length <= 1) return [ e ];
for (var r = [], n = 0; n < e.length; n++) {
var i = u(e.slice(0, n), e.slice(n + 1)), c = this.getPermutations(i);
try {
for (var s = (t = void 0, a(c)), l = s.next(); !l.done; l = s.next()) {
var p = l.value;
r.push(u([ e[n] ], p));
}
} catch (e) {
t = {
error: e
};
} finally {
try {
l && !l.done && (o = s.return) && o.call(s);
} finally {
if (t) throw t.error;
}
}
}
return r;
};
t.prototype.tryPlaceBlocks = function(e, t, o) {
var r, n, i = o.map(function(e) {
return u(e);
}), c = [];
try {
for (var s = a(e), l = s.next(); !l.done; l = s.next()) {
var p = t[l.value], f = this.findPlacePosition(p, i);
if (!f) return null;
this.placeBlockOnBoard(p, f, i, 1);
c.push(f);
}
} catch (e) {
r = {
error: e
};
} finally {
try {
l && !l.done && (n = s.return) && n.call(s);
} finally {
if (r) throw r.error;
}
}
return c;
};
t.prototype.findPlacePosition = function(e, t) {
for (var o = e.length, r = e[0] ? e[0].length : 0, n = 0; n <= t.length - o; n++) for (var i = 0; i <= t[0].length - r; i++) if (this.canPlaceAt(e, t, n, i)) return cc.v2(i, n);
return null;
};
t.prototype.canPlaceAt = function(e, t, o, r) {
for (var n = 0; n < e.length; n++) for (var i = 0; i < e[n].length; i++) if (1 === e[n][i]) {
var a = o + n, c = r + i;
if (a >= t.length || c >= t[0].length) return !1;
if (-1 !== t[a][c]) return !1;
}
return !0;
};
t.prototype.placeBlockOnBoard = function(e, t, o, r) {
for (var n = 0; n < e.length; n++) for (var i = 0; i < e[n].length; i++) if (1 === e[n][i]) {
var a = t.y + n, c = t.x + i;
o[a][c] = r;
}
};
t.prototype.tryPlaceBlocksWithClear = function(e, t, o) {
var r, n, i = o.map(function(e) {
return u(e);
}), c = [];
try {
for (var s = a(e), l = s.next(); !l.done; l = s.next()) {
var p = l.value, f = t[p], d = this.findPlacePosition(f, i);
if (!d) {
for (var h = [], g = !1, m = 0; m < e.length; m++) if (e[m] !== p) {
var P = t[e[m]], y = this.findPlacePosition(P, i);
if (y) {
this.placeBlockOnBoard(P, y, i, 1);
h.push(y);
if (this.checkAndClearBoard(i) && (d = this.findPlacePosition(f, i))) {
g = !0;
break;
}
if (!g) {
this.removeBlockFromBoard(P, y, i);
h.pop();
}
}
}
if (!g) return null;
c.push.apply(c, u(h));
}
this.placeBlockOnBoard(f, d, i, 1);
c.push(d);
this.checkAndClearBoard(i);
}
} catch (e) {
r = {
error: e
};
} finally {
try {
l && !l.done && (n = s.return) && n.call(s);
} finally {
if (r) throw r.error;
}
}
return c;
};
t.prototype.checkAndClearBoard = function(e) {
for (var t = !1, o = 0; o < 8; o++) {
for (var r = !0, n = 0; n < 8; n++) if (-1 === e[o][n]) {
r = !1;
break;
}
if (r) {
for (n = 0; n < 8; n++) e[o][n] = -1;
t = !0;
}
}
for (n = 0; n < 8; n++) {
for (r = !0, o = 0; o < 8; o++) if (-1 === e[o][n]) {
r = !1;
break;
}
if (r) {
for (o = 0; o < 8; o++) e[o][n] = -1;
t = !0;
}
}
return t;
};
t.prototype.removeBlockFromBoard = function(e, t, o) {
for (var r = 0; r < e.length; r++) for (var n = 0; n < e[r].length; n++) if (1 === e[r][n]) {
var i = t.y + r, a = t.x + n;
o[i][a] = -1;
}
};
return i([ classId("MoreStepGuideTrait") ], t);
}(Trait);
o.MoreStepGuideTrait = f;
cc._RF.pop();
}, {
"./MoreStepGuideConfig": "MoreStepGuideConfig",
"./MoreStepGuideInfo": "MoreStepGuideInfo",
"./MoreStepGuide_MainUI": "MoreStepGuide_MainUI"
} ],
MoreStepGuide_MainUI: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "83fd5SAVqpLxbQYR5QOGm1W", "MoreStepGuide_MainUI");
var r, n = this && this.__extends || (r = function(e, t) {
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
var n, i = arguments.length, a = i < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, o, r); else for (var c = e.length - 1; c >= 0; c--) (n = e[c]) && (a = (i < 3 ? n(a) : i > 3 ? n(t, o, a) : n(t, o)) || a);
return i > 3 && a && Object.defineProperty(t, o, a), a;
}, a = this && this.__awaiter || function(e, t, o, r) {
return new (o || (o = Promise))(function(n, i) {
function a(e) {
try {
u(r.next(e));
} catch (e) {
i(e);
}
}
function c(e) {
try {
u(r.throw(e));
} catch (e) {
i(e);
}
}
function u(e) {
e.done ? n(e.value) : (t = e.value, t instanceof o ? t : new o(function(e) {
e(t);
})).then(a, c);
var t;
}
u((r = r.apply(e, t || [])).next());
});
}, c = this && this.__generator || function(e, t) {
var o, r, n, i, a = {
label: 0,
sent: function() {
if (1 & n[0]) throw n[1];
return n[1];
},
trys: [],
ops: []
};
return i = {
next: c(0),
throw: c(1),
return: c(2)
}, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
return this;
}), i;
function c(e) {
return function(t) {
return u([ e, t ]);
};
}
function u(i) {
if (o) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (o = 1, r && (n = 2 & i[0] ? r.return : i[0] ? r.throw || ((n = r.return) && n.call(r), 
0) : r.next) && !(n = n.call(r, i[1])).done) return n;
(r = 0, n) && (i = [ 2 & i[0], n.value ]);
switch (i[0]) {
case 0:
case 1:
n = i;
break;

case 4:
a.label++;
return {
value: i[1],
done: !1
};

case 5:
a.label++;
r = i[1];
i = [ 0 ];
continue;

case 7:
i = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(n = a.trys, n = n.length > 0 && n[n.length - 1]) && (6 === i[0] || 2 === i[0])) {
a = 0;
continue;
}
if (3 === i[0] && (!n || i[1] > n[0] && i[1] < n[3])) {
a.label = i[1];
break;
}
if (6 === i[0] && a.label < n[1]) {
a.label = n[1];
n = i;
break;
}
if (n && a.label < n[2]) {
a.label = n[2];
a.ops.push(i);
break;
}
n[2] && a.ops.pop();
a.trys.pop();
continue;
}
i = t.call(e, a);
} catch (e) {
i = [ 6, e ];
r = 0;
} finally {
o = n = 0;
}
if (5 & i[0]) throw i[1];
return {
value: i[0] ? i[1] : void 0,
done: !0
};
}
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var u = cc._decorator, s = u.ccclass, l = u.property, p = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.headAni = null;
t.blockNode = null;
t.moveContainer = null;
t.blockList = [];
return t;
}
t.prototype.onLoad = function() {
this.node.zIndex = 100;
};
t.prototype.render = function() {
this.moveContainer.stopAllActions();
this.moveContainer.opacity = 255;
this.moveContainer.x = 0;
this.moveContainer.y = 0;
this.headAni.node.active = !(!this.state.click && !this.state.block);
if (this.state.click && this.state.clickPos) {
this.headAni.node.position = this.node.convertToNodeSpaceAR(this.state.clickPos);
this.headAni.playAnimation("dianji", -1);
}
this.blockNode.active = !!this.state.block;
if (this.state.block) {
this.headAni.node.position = cc.v3(0, 0);
this.headAni.playAnimation("tuodong", -1);
this.showBlock();
}
};
t.prototype.showBlock = function() {
return a(this, void 0, void 0, function() {
var e, t, o, r, n, i, a, u, s, l, p, f, d, h, g, m, P, y, v;
return c(this, function(c) {
switch (c.label) {
case 0:
e = 400;
t = this.state.color;
o = this.state.block;
r = [];
o >= hs.BlocksProducerType.ID1 && o < hs.BlocksProducerType.AllCountOfBlock ? r = hs.blockPosInfo[o - 1] : hs.blocksProducerInfo.checkAbnormalBlock(o) && (r = hs.abnormalBlockGameInfo.getBlockListById(o));
if (!r.length) return [ 2 ];
this.node.opacity = 255;
n = 0;
for (s = 0; s < r.length; s++) for (l = 0; l < r[s].length; l++) 1 === r[s][l] && n++;
if (this.blockList.length > n) for (s = n - 1; s < this.blockList.length; s++) (d = this.blockList[s]).opacity = 0;
i = 0;
a = 0;
u = 0;
s = 0;
c.label = 1;

case 1:
if (!(s < r.length)) return [ 3, 9 ];
l = 0;
c.label = 2;

case 2:
if (!(l < r[s].length)) return [ 3, 7 ];
if (1 !== r[s][l]) return [ 3, 6 ];
p = -(r[s].length - 1) * hs.BLOCK_HALF_SIZE + l * hs.BLOCK_SIZE;
f = (r.length - 1) * hs.BLOCK_HALF_SIZE - s * hs.BLOCK_SIZE;
d = void 0;
return this.blockList[i] ? [ 3, 4 ] : [ 4, hs.ResLoader.asyncLoad(hs.PrefabConfig.Block.url, cc.Prefab) ];

case 3:
h = c.sent();
g = hs.preloadInfo.producerItemPool;
(d = g.shift()) || (d = cc.instantiate(h));
this.blockNode && cc.isValid(this.blockNode) && this.blockNode.addChild(d);
this.blockList[i] = d;
return [ 3, 5 ];

case 4:
d = this.blockList[i];
c.label = 5;

case 5:
d.x = p;
d.y = f;
d.opacity = 255;
d.getComponent(hs.Block).setState({
color: t,
sourceColor: t
});
i++;
c.label = 6;

case 6:
l++;
return [ 3, 2 ];

case 7:
u = Math.max(u, r[s].length);
c.label = 8;

case 8:
s++;
return [ 3, 1 ];

case 9:
a = r.length;
m = cc.v3((u - 1) * hs.BLOCK_HALF_SIZE, -(a - 1) * hs.BLOCK_HALF_SIZE);
P = this.moveContainer.convertToNodeSpaceAR(this.state.blockMoveInfo.start);
y = this.moveContainer.convertToNodeSpaceAR(this.state.blockMoveInfo.end);
this.blockNode.opacity = 120;
v = this.getDistance2D(P.x, P.y, y.x, y.y) / e;
this.moveContainer.stopAllActions();
this.moveContainer.opacity = 255;
this.moveContainer.x = P.x;
this.moveContainer.y = P.y;
cc.tween(this.moveContainer).repeatForever(cc.tween(this.moveContainer).to(0, {
x: P.x,
y: P.y
}).to(v, {
x: y.x + m.x,
y: y.y + m.y
}, {
easing: cc.easing.circOut
}).delay(.2)).start();
return [ 2 ];
}
});
});
};
t.prototype.getDistance2D = function(e, t, o, r) {
var n = o - e, i = r - t;
return Math.sqrt(n * n + i * i);
};
i([ l(dragonBones.ArmatureDisplay) ], t.prototype, "headAni", void 0);
i([ l(cc.Node) ], t.prototype, "blockNode", void 0);
i([ l(cc.Node) ], t.prototype, "moveContainer", void 0);
return i([ s ], t);
}(hs.Component);
o.default = p;
cc._RF.pop();
}, {} ]
}, {}, [ "MoreStepGuideConfig", "MoreStepGuideInfo", "MoreStepGuideTrait", "MoreStepGuide_MainUI" ]);
//# sourceMappingURL=index.js.map
