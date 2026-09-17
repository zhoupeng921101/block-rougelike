window.__require = function e(t, i, o) {
function c(s, r) {
if (!i[s]) {
if (!t[s]) {
var a = s.split("/");
a = a[a.length - 1];
if (!t[a]) {
var f = "function" == typeof __require && __require;
if (!r && f) return f(a, !0);
if (n) return n(a, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = a;
}
var l = i[s] = {
exports: {}
};
t[s][0].call(l.exports, function(e) {
return c(t[s][1][e] || e);
}, l, l.exports, e, t, i, o);
}
return i[s].exports;
}
for (var n = "function" == typeof __require && __require, s = 0; s < o.length; s++) c(o[s]);
return c;
}({
ClickEffectConfig: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "e709c3+Vj1H467l8e+L5Gt8", "ClickEffectConfig");
var o, c, n, s;
Object.defineProperty(i, "__esModule", {
value: !0
});
i.ClickEffectTypeMap = i.ClickEffectEmojiMap = i.ClickEffectDSEmoji = i.ClickEffectDSType = i.ClickEffectRevivePlaneName = i.ClickEffectOverPlaneName = i.ClickEffectBestPlaneName = i.ClickEffectReviveEmojiConfig = i.ClickEffectOverEmojiConfig = i.ClickEffectBestEmojiConfig = void 0;
i.ClickEffectBestEmojiConfig = [ "best1", "best2", "best3", "best4" ];
i.ClickEffectOverEmojiConfig = [ "over1", "over2", "over3", "over4" ];
i.ClickEffectReviveEmojiConfig = [ "revive1", "revive2", "revive3", "revive4" ];
i.ClickEffectBestPlaneName = [ "ClassWin", "ChapterScoreWin", "ChapterCollectWin", "ChapterReduceScoreWin", "ChapterReduceCollectWin" ];
i.ClickEffectOverPlaneName = [ "ClassFail", "ChapterScoreFail", "ChapterCollectFail", "ChapterReduceScoreFail", "ChapterReduceCollectFail" ];
i.ClickEffectRevivePlaneName = [ "revive" ];
(function(e) {
e[e.ClassWin = 1] = "ClassWin";
e[e.ChapterWin = 2] = "ChapterWin";
e[e.ClassFail = 3] = "ClassFail";
e[e.ChapterFail = 4] = "ChapterFail";
e[e.ClassRevive = 5] = "ClassRevive";
e[e.ChapterRevive = 6] = "ChapterRevive";
})(n = i.ClickEffectDSType || (i.ClickEffectDSType = {}));
(function(e) {
e[e.Best1 = 1] = "Best1";
e[e.Best2 = 2] = "Best2";
e[e.Best3 = 3] = "Best3";
e[e.Best4 = 4] = "Best4";
e[e.Over1 = 5] = "Over1";
e[e.Over2 = 6] = "Over2";
e[e.Over3 = 7] = "Over3";
e[e.Over4 = 8] = "Over4";
e[e.Revive1 = 9] = "Revive1";
e[e.Revive2 = 10] = "Revive2";
e[e.Revive3 = 11] = "Revive3";
e[e.Revive4 = 12] = "Revive4";
})(s = i.ClickEffectDSEmoji || (i.ClickEffectDSEmoji = {}));
i.ClickEffectEmojiMap = ((o = {}).best1 = s.Best1, o.best2 = s.Best2, o.best3 = s.Best3, 
o.best4 = s.Best4, o.over1 = s.Over1, o.over2 = s.Over2, o.over3 = s.Over3, o.over4 = s.Over4, 
o.revive1 = s.Revive1, o.revive2 = s.Revive2, o.revive3 = s.Revive3, o.revive4 = s.Revive4, 
o);
i.ClickEffectTypeMap = ((c = {}).ClassWin = n.ClassWin, c.ChapterScoreWin = n.ChapterWin, 
c.ChapterCollectWin = n.ChapterWin, c.ChapterReduceScoreWin = n.ChapterWin, c.ChapterReduceCollectWin = n.ChapterWin, 
c.ClassFail = n.ClassFail, c.ChapterScoreFail = n.ChapterFail, c.ChapterCollectFail = n.ChapterFail, 
c.ChapterReduceScoreFail = n.ChapterFail, c.ChapterReduceCollectFail = n.ChapterFail, 
c);
cc._RF.pop();
}, {} ],
ClickEffect: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "674752KnBtBRZ9BkdogFrjW", "ClickEffect");
var o, c = this && this.__extends || (o = function(e, t) {
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
}), n = this && this.__decorate || function(e, t, i, o) {
var c, n = arguments.length, s = n < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, i) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, i, o); else for (var r = e.length - 1; r >= 0; r--) (c = e[r]) && (s = (n < 3 ? c(s) : n > 3 ? c(t, i, s) : c(t, i)) || s);
return n > 3 && s && Object.defineProperty(t, i, s), s;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
var s = e("./ClickEffectConfig"), r = cc._decorator, a = r.ccclass, f = r.property, l = function(e) {
c(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.effect = null;
t._nodeCache = [];
t._bestList = [];
t._overList = [];
t._reviveList = [];
t._bestEndEmoji = "";
t._overEndEmoji = "";
t._reviveEndEmoji = "";
return t;
}
t.prototype.onLoad = function() {
this._nodeCache = [ this.effect ];
this.effect.opacity = 0;
this.reset();
};
t.prototype.onDisable = function() {
var e = this;
this._nodeCache = [];
this.node.children.forEach(function(t) {
t.opacity = 0;
e._nodeCache.push(t);
});
};
t.prototype.render = function() {
var e = this, t = this.getRandomEmoji();
if (t) {
var i = this._nodeCache.shift();
if (!i) {
i = cc.instantiate(this.effect);
this.node.addChild(i);
}
i.opacity = 255;
i.setPosition(this.node.convertToNodeSpaceAR(this.state.pos));
var o = i.getComponent(dragonBones.ArmatureDisplay);
o.playAnimation(t, 1);
o.off(dragonBones.EventObject.COMPLETE);
o.on(dragonBones.EventObject.COMPLETE, function() {
if (i) {
i.opacity = 0;
e._nodeCache.push(i);
}
}, this);
if (this.state.needDS) {
var c = s.ClickEffectTypeMap[this.state.planeName];
"revive" == this.state.planeName && (c = hs.gameInfo.gameMode == hs.GameMode.Class ? s.ClickEffectDSType.ClassRevive : s.ClickEffectDSType.ChapterRevive);
this.clickEffectDC(c, s.ClickEffectEmojiMap[t]);
}
}
};
t.prototype.getPlaneType = function() {
return s.ClickEffectBestPlaneName.includes(this.state.planeName) ? "best" : s.ClickEffectOverPlaneName.includes(this.state.planeName) ? "over" : s.ClickEffectRevivePlaneName.includes(this.state.planeName) ? "revive" : void 0;
};
t.prototype.getRandomEmoji = function() {
var e = this.getPlaneType();
if ("best" === e) {
var t = this.getRandIndex(this._bestList.length == s.ClickEffectBestEmojiConfig.length ? this._bestEndEmoji : "", this._bestList), i = this._bestList[t];
this._bestList.splice(t, 1);
if (0 === this._bestList.length) {
this._bestEndEmoji = i;
this._bestList = s.ClickEffectBestEmojiConfig.slice();
}
return i;
}
if ("over" === e) {
t = this.getRandIndex(this._overList.length == s.ClickEffectOverEmojiConfig.length ? this._overEndEmoji : "", this._overList), 
i = this._overList[t];
this._overList.splice(t, 1);
if (0 === this._overList.length) {
this._overEndEmoji = i;
this._overList = s.ClickEffectOverEmojiConfig.slice();
}
return i;
}
if ("revive" === e) {
t = this.getRandIndex(this._reviveList.length == s.ClickEffectReviveEmojiConfig.length ? this._reviveEndEmoji : "", this._reviveList), 
i = this._reviveList[t];
this._reviveList.splice(t, 1);
if (0 === this._reviveList.length) {
this._reviveEndEmoji = i;
this._reviveList = s.ClickEffectReviveEmojiConfig.slice();
}
return i;
}
};
t.prototype.getRandIndex = function(e, t) {
var i = Math.floor(Math.random() * t.length);
return t[i] === e ? this.getRandIndex(e, t) : i;
};
t.prototype.reset = function() {
this.resetBest();
this.resetOver();
this.resetRevive();
};
t.prototype.resetBest = function() {
this._bestEndEmoji = "";
this._bestList = s.ClickEffectBestEmojiConfig.slice();
};
t.prototype.resetOver = function() {
this._overEndEmoji = "";
this._overList = s.ClickEffectOverEmojiConfig.slice();
};
t.prototype.resetRevive = function() {
this._reviveEndEmoji = "";
this._reviveList = s.ClickEffectReviveEmojiConfig.slice();
};
t.prototype.clickEffectDC = function(e, t) {
DS("empty_space_click_effect", {
effective_scene: e,
emoji_type: t
});
};
n([ f(cc.Node) ], t.prototype, "effect", void 0);
return n([ a ], t);
}(hs.Component);
i.default = l;
cc._RF.pop();
}, {
"./ClickEffectConfig": "ClickEffectConfig"
} ],
IsOpenResultClickEffectTrait: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "bbf14Rz7qdET5HI6ch1d5Dw", "IsOpenResultClickEffectTrait");
var o, c = this && this.__extends || (o = function(e, t) {
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
}), n = this && this.__decorate || function(e, t, i, o) {
var c, n = arguments.length, s = n < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, i) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, i, o); else for (var r = e.length - 1; r >= 0; r--) (c = e[r]) && (s = (n < 3 ? c(s) : n > 3 ? c(t, i, s) : c(t, i)) || s);
return n > 3 && s && Object.defineProperty(t, i, s), s;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
i.IsOpenResultClickEffectTrait = void 0;
var s = e("./ClickEffect"), r = function(e) {
c(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._effectPrefab = null;
t._needDS = !1;
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "Revive",
methodName: "onEnable"
}, {
className: "ClassFail",
methodName: "showAction"
}, {
className: "ClassWin",
methodName: "showAction"
}, {
className: "ChapterScoreFail",
methodName: "showAction"
}, {
className: "ChapterCollectFail",
methodName: "showAction"
}, {
className: "ChapterScoreWin",
methodName: "showAction"
}, {
className: "ChapterCollectWin",
methodName: "showAction"
}, {
className: "Revive_Proxy",
methodName: "onGameReady"
}, {
className: "Encourage_Proxy",
methodName: "onGameOverGameEnd"
} ];
};
t.prototype.onActive = function(e) {
if (hs.tp.isClassFailShowAction(e)) {
var t = e.target.node;
if (t) {
t.off(cc.Node.EventType.TOUCH_START, this.touchPlaneBg, this);
t.on(cc.Node.EventType.TOUCH_START, this.touchPlaneBg, this);
}
}
if (hs.tp.isClassWinShowAction(e)) {
var i = e.target.node;
if (i) {
i.off(cc.Node.EventType.TOUCH_START, this.touchPlaneBg, this);
i.on(cc.Node.EventType.TOUCH_START, this.touchPlaneBg, this);
}
}
if (hs.tp.isChapterScoreFailShowAction(e)) {
var o = e.target.node;
if (o) {
(r = o.getChildByName("bg1") || o).off(cc.Node.EventType.TOUCH_START, this.touchPlaneBg, this);
r.on(cc.Node.EventType.TOUCH_START, this.touchPlaneBg, this);
}
}
if (hs.tp.isChapterCollectFailShowAction(e)) {
var c = e.target.node;
if (c) {
(r = c.getChildByName("bg1") || c).off(cc.Node.EventType.TOUCH_START, this.touchPlaneBg, this);
r.on(cc.Node.EventType.TOUCH_START, this.touchPlaneBg, this);
}
}
if (hs.tp.isChapterScoreWinShowAction(e)) {
var n = e.target.node;
if (n) {
(r = n.getChildByName("bg1") || n).off(cc.Node.EventType.TOUCH_START, this.touchPlaneBg, this);
r.on(cc.Node.EventType.TOUCH_START, this.touchPlaneBg, this);
}
}
if (hs.tp.isChapterCollectWinShowAction(e)) {
var s = e.target.node;
if (s) {
var r;
(r = s.getChildByName("bg1") || s).off(cc.Node.EventType.TOUCH_START, this.touchPlaneBg, this);
r.on(cc.Node.EventType.TOUCH_START, this.touchPlaneBg, this);
}
}
if (hs.tp.isReviveOnEnable(e)) {
var a = e.target.node;
if (a) {
a.off(cc.Node.EventType.TOUCH_START, this.touchPlaneBg, this);
a.on(cc.Node.EventType.TOUCH_START, this.touchPlaneBg, this);
}
}
hs.tp.isRevive_ProxyOnGameReady(e) && (this._needDS = !0);
hs.tp.isEncourage_ProxyOnGameOverGameEnd(e) && (this._needDS = !0);
};
t.prototype.touchPlaneBg = function(e) {
var t = this, i = e.target;
"bg1" == i.name && (i = i.parent);
var o = e.touch.getLocation();
if (i && cc.isValid(i)) {
var c = i.getChildByName("clickEffect");
if (c) {
c.getComponent(s.default).setState({
pos: new cc.Vec3(o.x, o.y, 0),
planeName: i.name,
needDS: this._needDS
});
this._needDS = !1;
} else if (this._effectPrefab) {
var n = cc.instantiate(this._effectPrefab);
i.addChild(n, 100);
n.getComponent(s.default).setState({
pos: new cc.Vec3(o.x, o.y, 0),
planeName: i.name,
needDS: this._needDS
});
this._needDS = !1;
} else hs.ResLoader.loadByBundle("IsOpenResultClickEffectTrait", "prefabs/clickEffect", cc.Prefab, function(e, c) {
if (!e) {
t._effectPrefab = c;
var n = i.getChildByName("clickEffect");
if (!n) {
n = cc.instantiate(t._effectPrefab);
i.addChild(n, 100);
}
n.getComponent(s.default).setState({
pos: new cc.Vec3(o.x, o.y, 0),
planeName: i.name,
needDS: t._needDS
});
t._needDS = !1;
}
});
}
};
return n([ classId("IsOpenResultClickEffectTrait") ], t);
}(Trait);
i.IsOpenResultClickEffectTrait = r;
cc._RF.pop();
}, {
"./ClickEffect": "ClickEffect"
} ]
}, {}, [ "ClickEffect", "ClickEffectConfig", "IsOpenResultClickEffectTrait" ]);
//# sourceMappingURL=index.js.map
