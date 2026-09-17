window.__require = function e(t, o, r) {
function s(c, n) {
if (!o[c]) {
if (!t[c]) {
var l = c.split("/");
l = l[l.length - 1];
if (!t[l]) {
var a = "function" == typeof __require && __require;
if (!n && a) return a(l, !0);
if (i) return i(l, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = l;
}
var p = o[c] = {
exports: {}
};
t[c][0].call(p.exports, function(e) {
return s(t[c][1][e] || e);
}, p, p.exports, e, t, o, r);
}
return o[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < r.length; c++) s(r[c]);
return s;
}({
IsOpenEstablishCollectTargetsTrait: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "0aeb4UwyTdJn6dKKPMQ3Rxv", "IsOpenEstablishCollectTargetsTrait");
var r, s = this && this.__extends || (r = function(e, t) {
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
var s, i = arguments.length, c = i < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(e, t, o, r); else for (var n = e.length - 1; n >= 0; n--) (s = e[n]) && (c = (i < 3 ? s(c) : i > 3 ? s(t, o, c) : s(t, o)) || c);
return i > 3 && c && Object.defineProperty(t, o, c), c;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.IsOpenEstablishCollectTargetsTrait = void 0;
var c = e("./TopInfoCollectTargetsInfo"), n = e("./TopInfoCollectTargetsPlane"), l = function(e) {
s(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.COLLECT_TARGETS = [ {
score: [ 500, 1e3 ],
color: 6
}, {
score: [ 1e3, 5e3 ],
color: 5
}, {
score: [ 5e3, 1e4 ],
color: 2
}, {
score: [ 1e4, 2e4 ],
color: 1
}, {
score: [ 2e4, 4e4 ],
color: 3
}, {
score: [ 4e4, 6e4 ],
color: 7
}, {
score: [ 6e4, -1 ],
color: 4
} ];
t._collectTargetsView = null;
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassScoreTip_Proxy",
methodName: "playScoreAnim"
}, {
className: "Advertisement_Proxy",
methodName: "onGameOverGameEndPre"
}, {
className: "Advertisement_Proxy",
methodName: "onGameStart"
} ];
};
t.prototype.onActive = function(e) {
if (hs.tp.isClassDefaultBoard_ProxyProduceDefaultColor(e)) {
var t = e.args[0];
e.returnValue = this.getFaceBlocks(t);
e.returnState = !0;
}
if (hs.tp.isClassBoard_ProxyGetGuideFaceBlocks(e)) {
t = e.args[0];
e.returnValue = this.getFaceBlocks(t);
}
if (hs.tp.isChapterDefaultBoard_ProxySetChapterColor(e)) {
var o = hs.boardInfo.chapterFaceBlocks, r = this.getFaceBlocks(o);
hs.boardInfo.setChapterFaceBlocks(r);
}
if (hs.tp.isClassColorProducer_ProxyProduceColorPostprocessing(e)) {
var s = storage.getItem("classColorLists", [ 1, 4, 2 ]);
0 === (n = c.topInfoCollectTargetsInfo.unLockColor).length && (n = [ 6 ]);
for (var i = 0; i < s.length; i++) (h = s[i]) > 0 && !n.includes(h) && h < 10 && (s[i] = n[Math.floor(Math.random() * n.length)]);
storage.setItem("classColorLists", s);
e.returnState = !0;
}
hs.tp.isClassBlocksProducer_BlocksProducerValidate_ProxySetRecordOperationColor(e) && (e.replace = !0);
if (hs.tp.isChapterColorProducer_ProxyProduceColorPostprocessing(e)) {
var n = c.topInfoCollectTargetsInfo.unLockColor;
s = storage.getItem("chapterColorLists", []);
0 === n.length && (n = [ 6 ]);
for (i = 0; i < s.length; i++) (h = s[i]) > 0 && !n.includes(h) && h < 10 && (s[i] = n[Math.floor(Math.random() * n.length)]);
storage.setItem("chapterColorLists", s);
}
if (hs.tp.isClassScoreTip_ProxyPlayScoreAnim(e)) {
var l = storage.getItem("classScore", 0), a = this.getColorByScore(l);
if (a >= 0) {
var p = this.COLLECT_TARGETS[a];
if (!(n = c.topInfoCollectTargetsInfo.unLockColor).includes(p.color)) {
var f = a + 1;
this.showView(this.COLLECT_TARGETS[f > this.COLLECT_TARGETS.length - 1 ? this.COLLECT_TARGETS.length - 1 : f]);
}
c.topInfoCollectTargetsInfo.setUnLockColor(p.color);
}
}
hs.tp.isAdvertisement_ProxyOnGameOverGameEndPre(e) && this.hideView();
hs.tp.isAdvertisement_ProxyOnGameStart(e) && this.hideView();
if (hs.tp.isClassGuide_ProxyGetGuideColor(e)) {
var h = e.args[0];
(n = c.topInfoCollectTargetsInfo.unLockColor).includes(h) || (e.returnValue = 6);
}
};
t.prototype.showView = function(e) {
var t = this, o = null;
if (o = hs.gameInfo.gameMode === hs.GameMode.Chapter ? hs.gameUiLayer.getChildByName("ChapterGame") : hs.gameUiLayer.getChildByName("ClassGame")) if (this._collectTargetsView) {
this._collectTargetsView.active = !0;
this._collectTargetsView.getComponent(n.default).setState({
score: e.score[0],
color: e.color,
time: this.props.time
});
} else hs.ResLoader.loadByBundle("IsOpenEstablishCollectTargetsTrait", "prefabs/topCollectTargets", cc.Prefab, function(r, s) {
if (r) ; else if (o && cc.isValid(o)) {
if (!t._collectTargetsView) {
t._collectTargetsView = cc.instantiate(s);
o.addChild(t._collectTargetsView);
}
t._collectTargetsView.active = !0;
t._collectTargetsView.getComponent(n.default).setState({
score: e.score[0],
color: e.color,
time: t.props.time
});
} else t.hideView();
}); else this.hideView();
};
t.prototype.hideView = function() {
this._collectTargetsView && (this._collectTargetsView.active = !1);
};
t.prototype.getFaceBlocks = function(e) {
for (var t = c.topInfoCollectTargetsInfo.unLockColor, o = 0; o < e.length; o++) for (var r = 0; r < e[o].length; r++) {
var s = e[o][r];
s > 0 && !t.includes(s) && s < 10 && (e[o][r] = 6);
}
return e;
};
t.prototype.getColorByScore = function(e) {
for (var t = 0; t < this.COLLECT_TARGETS.length; t++) {
var o = this.COLLECT_TARGETS[t];
if (e >= o.score[0]) {
if (-1 === o.score[1]) return t;
if (e < o.score[1]) return t;
}
}
return -1;
};
return i([ classId("IsOpenEstablishCollectTargetsTrait") ], t);
}(Trait);
o.IsOpenEstablishCollectTargetsTrait = l;
cc._RF.pop();
}, {
"./TopInfoCollectTargetsInfo": "TopInfoCollectTargetsInfo",
"./TopInfoCollectTargetsPlane": "TopInfoCollectTargetsPlane"
} ],
TopInfoCollectTargetsInfo: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "93064+u7gJF0YQSguP4rJwv", "TopInfoCollectTargetsInfo");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.topInfoCollectTargetsInfo = void 0;
var r = function() {
function e() {}
Object.defineProperty(e.prototype, "unLockColor", {
get: function() {
return storage.getItem("TopInfoCollectTargetsUnLockColor", []);
},
enumerable: !1,
configurable: !0
});
e.prototype.setUnLockColor = function(e) {
var t = this.unLockColor;
if (!t.includes(e)) {
t.push(e);
storage.setItem("TopInfoCollectTargetsUnLockColor", t);
}
};
return e;
}();
o.topInfoCollectTargetsInfo = new r();
cc._RF.pop();
}, {} ],
TopInfoCollectTargetsPlane: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "ff60ePdB89MAoyedkS5ct31", "TopInfoCollectTargetsPlane");
var r, s = this && this.__extends || (r = function(e, t) {
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
var s, i = arguments.length, c = i < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(e, t, o, r); else for (var n = e.length - 1; n >= 0; n--) (s = e[n]) && (c = (i < 3 ? s(c) : i > 3 ? s(t, o, c) : s(t, o)) || c);
return i > 3 && c && Object.defineProperty(t, o, c), c;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var c = cc._decorator, n = c.ccclass, l = c.property, a = function(e) {
s(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.blockSprite = null;
t.scoreLabel = null;
t.timeLabel = null;
t.bgNode = null;
t._timer = -1;
t._time = 5;
return t;
}
t.prototype.render = function() {
var e = this;
this.stopTimer();
if (this.bgNode) {
this.bgNode.position = cc.v3(0, cc.winSize.height / 2 - this.bgNode.height / 2);
this.bgNode.stopAllActions();
this.bgNode.opacity = 0;
cc.tween(this.bgNode).to(.3, {
opacity: 255
}).start();
}
hs.ResLoader.load(hs.ResUrlType.BLOCKS_DARK, cc.SpriteAtlas, function(t, o) {
t || o && e.blockSprite && e.blockSprite.node && cc.isValid(e.blockSprite.node) && (e.blockSprite.spriteFrame = o.getSpriteFrame("game_cube_" + e.state.color));
});
this.scoreLabel && (this.scoreLabel.string = this.state.score.toString());
if (this.timeLabel) {
this.timeLabel.string = this.state.time.toString() + "s";
this._time = this.state.time;
this.startTimer();
}
};
t.prototype.hideAni = function() {
var e = this;
if (this.bgNode && cc.isValid(this.bgNode)) {
this.bgNode.opacity = 255;
cc.tween(this.bgNode).to(.5, {
y: cc.winSize.height / 2 + this.bgNode.height,
opacity: 0
}).call(function() {
e.node && cc.isValid(e.node) && (e.node.active = !1);
}).start();
}
};
t.prototype.startTimer = function() {
var e = this;
this._timer = setInterval(function() {
e._time--;
e.timeLabel.string = e._time.toString() + "s";
if (e._time <= 0) {
e.stopTimer();
e.hideAni();
}
}, 1e3);
};
t.prototype.stopTimer = function() {
if (-1 !== this._timer) {
clearInterval(this._timer);
this._timer = -1;
}
};
i([ l(cc.Sprite) ], t.prototype, "blockSprite", void 0);
i([ l(cc.Label) ], t.prototype, "scoreLabel", void 0);
i([ l(cc.Label) ], t.prototype, "timeLabel", void 0);
i([ l(cc.Node) ], t.prototype, "bgNode", void 0);
return i([ n ], t);
}(hs.Component);
o.default = a;
cc._RF.pop();
}, {} ]
}, {}, [ "IsOpenEstablishCollectTargetsTrait", "TopInfoCollectTargetsInfo", "TopInfoCollectTargetsPlane" ]);
//# sourceMappingURL=index.js.map
