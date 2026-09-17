window.__require = function t(e, i, a) {
function n(s, o) {
if (!i[s]) {
if (!e[s]) {
var c = s.split("/");
c = c[c.length - 1];
if (!e[c]) {
var p = "function" == typeof __require && __require;
if (!o && p) return p(c, !0);
if (r) return r(c, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = c;
}
var l = i[s] = {
exports: {}
};
e[s][0].call(l.exports, function(t) {
return n(e[s][1][t] || t);
}, l, l.exports, t, e, i, a);
}
return i[s].exports;
}
for (var r = "function" == typeof __require && __require, s = 0; s < a.length; s++) n(a[s]);
return n;
}({
ChapterWinStreakType: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "93217PxwLxMfKkVZSizKNtQ", "ChapterWinStreakType");
Object.defineProperty(i, "__esModule", {
value: !0
});
i.WinStreakStage = void 0;
(function(t) {
t[t.stage_1 = 0] = "stage_1";
t[t.stage_2 = 1] = "stage_2";
t[t.stage_3 = 2] = "stage_3";
})(i.WinStreakStage || (i.WinStreakStage = {}));
cc._RF.pop();
}, {} ],
ScriptsWinStreakAdjustConfig: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "2cfcc+e3I5IPa1C48SJS6Uw", "ScriptsWinStreakAdjustConfig");
var a;
Object.defineProperty(i, "__esModule", {
value: !0
});
i.WinStreakIcon = void 0;
var n = t("../type/ChapterWinStreakType");
i.WinStreakIcon = ((a = {})[n.WinStreakStage.stage_1] = "adventure_icon_star", a[n.WinStreakStage.stage_2] = "adventure_icon_sun", 
a[n.WinStreakStage.stage_3] = "adventure_icon_crown", a);
cc._RF.pop();
}, {
"../type/ChapterWinStreakType": "ChapterWinStreakType"
} ],
WinStreakAdjustView: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "709dbMMdIpMtrJrwZOHp3gL", "WinStreakAdjustView");
var a, n = this && this.__extends || (a = function(t, e) {
return (a = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
})(t, e);
}, function(t, e) {
a(t, e);
function i() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype, new i());
}), r = this && this.__decorate || function(t, e, i, a) {
var n, r = arguments.length, s = r < 3 ? e : null === a ? a = Object.getOwnPropertyDescriptor(e, i) : a;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, i, a); else for (var o = t.length - 1; o >= 0; o--) (n = t[o]) && (s = (r < 3 ? n(s) : r > 3 ? n(e, i, s) : n(e, i)) || s);
return r > 3 && s && Object.defineProperty(e, i, s), s;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
var s = t("../config/ScriptsWinStreakAdjustConfig"), o = t("../type/ChapterWinStreakType"), c = cc._decorator, p = c.ccclass, l = c.property, h = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.drangon = null;
e.streakLbl = null;
e.iconSprite = null;
e.currentStage = o.WinStreakStage.stage_1;
return e;
}
e.prototype.render = function() {
var t, e;
if (cc.isValid(this.node, !0)) {
cc.isValid(this.drangon, !0) && (this.drangon.node.active = !1);
cc.isValid(this.iconSprite, !0) && (this.iconSprite.node.active = !0);
cc.isValid(this.streakLbl, !0) && (this.streakLbl.string = "" + (null !== (t = this.state.oldStreaKNum) && void 0 !== t ? t : 0));
this.currentStage = this.state.oldStage;
this.updateIcon(s.WinStreakIcon[this.state.oldStage >= this.state.stage ? this.state.stage : this.state.oldStage]);
0 === this.state.type ? this.setStreakLbl(null !== (e = this.state.oldStreaKNum) && void 0 !== e ? e : 0) : this.updateStreak();
}
};
e.prototype.updateIcon = function(t) {
t && cc.isValid(this.state.spriteAtlas) && this.state.spriteAtlas.getSpriteFrame(t) && (this.iconSprite.spriteFrame = this.state.spriteAtlas.getSpriteFrame(t));
};
e.prototype.updateStreak = function() {
var t = this.state.streakNum - this.state.oldStreaKNum;
if (t > 0) {
this.setStreakLbl(this.state.oldStreaKNum);
this.updateLblAni(this.state.oldStreaKNum, t, 0, .07);
} else this.setStreakLbl(this.state.streakNum);
};
e.prototype.updateLblAni = function(t, e, i, a) {
var n = this, r = t;
i < e && r < this.state.streakNum && this.scheduleOnce(function() {
r++;
n.setStreakLbl(r);
var t = TRAIT("WinStreakEffectAdjustTrait").getStageForStreakNum(r);
n.currentStage < t ? n.updateStreakAni(t, function() {
n.updateLblAni(r, e, i + 1, 0);
}) : n.updateLblAni(r, e, i + 1, .07);
}, a);
};
e.prototype.updateStreakAni = function(t, e) {
this.setIconActive(!1);
this.drangon.node.active = !0;
t === o.WinStreakStage.stage_2 ? this.drangon.playAnimation("sun", 1) : t === o.WinStreakStage.stage_3 && this.drangon.playAnimation("crown", 1);
this.currentStage = t;
this.drangon.once(dragonBones.EventObject.COMPLETE, function() {
e();
}, this);
};
e.prototype.setIconActive = function(t) {
this.iconSprite && cc.isValid(this.iconSprite.node, !0) && (this.iconSprite.node.active = t);
};
e.prototype.setStreakLbl = function(t) {
cc.isValid(this.node, !0) && this.streakLbl && cc.isValid(this.streakLbl.node, !0) && (this.streakLbl.string = "" + t);
};
r([ l(dragonBones.ArmatureDisplay) ], e.prototype, "drangon", void 0);
r([ l(cc.Label) ], e.prototype, "streakLbl", void 0);
r([ l(cc.Sprite) ], e.prototype, "iconSprite", void 0);
return r([ p ], e);
}(hs.Component);
i.default = h;
cc._RF.pop();
}, {
"../config/ScriptsWinStreakAdjustConfig": "ScriptsWinStreakAdjustConfig",
"../type/ChapterWinStreakType": "ChapterWinStreakType"
} ],
WinStreakBreakView: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "8eb1fUg9U1POL1mjnAuIIFr", "WinStreakBreakView");
var a, n = this && this.__extends || (a = function(t, e) {
return (a = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
})(t, e);
}, function(t, e) {
a(t, e);
function i() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype, new i());
}), r = this && this.__decorate || function(t, e, i, a) {
var n, r = arguments.length, s = r < 3 ? e : null === a ? a = Object.getOwnPropertyDescriptor(e, i) : a;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, i, a); else for (var o = t.length - 1; o >= 0; o--) (n = t[o]) && (s = (r < 3 ? n(s) : r > 3 ? n(e, i, s) : n(e, i)) || s);
return r > 3 && s && Object.defineProperty(e, i, s), s;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
var s = t("../config/ScriptsWinStreakAdjustConfig"), o = t("../type/ChapterWinStreakType"), c = cc._decorator, p = c.ccclass, l = c.property, h = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.boneAni1 = null;
e.boneAni2 = null;
e.iconSprite = null;
e.streakTxt = null;
return e;
}
e.prototype.render = function() {
var t = this;
if (cc.isValid(this.node, !0)) {
this.node.opacity = 0;
this.node.scale = 0;
if (cc.isValid(this.boneAni1, !0)) {
this.boneAni1.node.active = !1;
this.boneAni1.node.scale = 0;
}
if (cc.isValid(this.boneAni2, !0)) {
this.boneAni2.node.active = !1;
this.boneAni2.node.scale = 0;
}
if (this.state.streakNum <= 0) this.node.active = !1; else {
this.setStreakNum(this.state.streakNum);
this.iconSprite && cc.isValid(this.iconSprite.node, !0) && (this.iconSprite.node.scale = 1);
this.setIcon(this.state.stage);
cc.tween(this.node).to(.2, {
opacity: 255,
scale: 1
}, {
easing: cc.easing.backOut
}).call(function() {
t.startRunAni(t.state.streakNum, t.state.streakNum > 5 ? .1 : .3);
}).start();
}
}
};
e.prototype.setIcon = function(t) {
var e = s.WinStreakIcon[t];
e && cc.isValid(this.state.spriteAtlas) && this.state.spriteAtlas.getSpriteFrame(e) && (this.iconSprite.spriteFrame = this.state.spriteAtlas.getSpriteFrame(e));
};
e.prototype.startRunAni = function(t, e) {
var i = this;
void 0 === e && (e = .1);
this.scheduleOnce(function() {
if (t > 0) {
i.setStreakNum(t - 1);
i.startRunAni(t - 1, e);
} else i.playIconAniAndShowBone();
}, e);
};
e.prototype.playIconAniAndShowBone = function() {
var t = this;
this.iconSprite && cc.isValid(this.iconSprite.node, !0) && cc.tween(this.iconSprite.node).to(.2, {
scale: 0
}, {
easing: cc.easing.backOut
}).call(function() {}).start();
var e = null;
this.state.stage === o.WinStreakStage.stage_1 || this.state.stage === o.WinStreakStage.stage_2 ? e = this.boneAni1.node : this.state.stage === o.WinStreakStage.stage_3 && (e = this.boneAni2.node);
cc.isValid(e, !0) && cc.tween(e).to(.2, {
scale: 1
}, {
easing: cc.easing.backOut
}).call(function() {
t.startPlayBoneAni();
}).start();
};
e.prototype.startPlayBoneAni = function() {
var t = this;
if (this.state.stage === o.WinStreakStage.stage_1 || this.state.stage === o.WinStreakStage.stage_2) {
if (cc.isValid(this.boneAni1, !0)) {
this.boneAni1.node.stopAllActions();
this.boneAni1.node.active = !0;
this.boneAni1.playAnimation("light", 0);
}
} else if (this.state.stage === o.WinStreakStage.stage_3 && this.boneAni2 && cc.isValid(this.boneAni2.node, !0)) {
this.boneAni2.node.stopAllActions();
this.boneAni2.playAnimation("in", 1);
this.boneAni2.once(dragonBones.EventObject.COMPLETE, function() {
t.boneAni2 && cc.isValid(t.boneAni2.node, !0) && t.boneAni2.playAnimation("idle", 0);
}, this);
this.boneAni2.node.active = !0;
}
};
e.prototype.setStreakNum = function(t) {
this.streakTxt && cc.isValid(this.streakTxt.node, !0) && (this.streakTxt.string = "" + t);
};
r([ l(dragonBones.ArmatureDisplay) ], e.prototype, "boneAni1", void 0);
r([ l(dragonBones.ArmatureDisplay) ], e.prototype, "boneAni2", void 0);
r([ l(cc.Sprite) ], e.prototype, "iconSprite", void 0);
r([ l(cc.Label) ], e.prototype, "streakTxt", void 0);
return r([ p ], e);
}(hs.Component);
i.default = h;
cc._RF.pop();
}, {
"../config/ScriptsWinStreakAdjustConfig": "ScriptsWinStreakAdjustConfig",
"../type/ChapterWinStreakType": "ChapterWinStreakType"
} ],
WinStreakEffectAdjustTrait: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "78a22PHjQpMcrhi0IWPtEiw", "WinStreakEffectAdjustTrait");
var a, n = this && this.__extends || (a = function(t, e) {
return (a = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
})(t, e);
}, function(t, e) {
a(t, e);
function i() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype, new i());
}), r = this && this.__decorate || function(t, e, i, a) {
var n, r = arguments.length, s = r < 3 ? e : null === a ? a = Object.getOwnPropertyDescriptor(e, i) : a;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, i, a); else for (var o = t.length - 1; o >= 0; o--) (n = t[o]) && (s = (r < 3 ? n(s) : r > 3 ? n(e, i, s) : n(e, i)) || s);
return r > 3 && s && Object.defineProperty(e, i, s), s;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
i.WinStreakEffectAdjustTrait = void 0;
var s = t("./type/ChapterWinStreakType"), o = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.winStreakUINode = null;
e.isMoveChapter = !1;
e.loadCount = 0;
e.isReady = !1;
e.bundleName = "WinStreakEffectAdjustTrait";
return e;
}
e.prototype.data = function() {
var t = storage.getItem("winStreakCount", 0);
return {
winBreakPrefab: null,
winEffectPrefab: null,
spriteAtlas: null,
oldStreakNum: storage.getItem("streakEffectAdjustOldStreakNum", t),
stageList: this.props.streakRange
};
};
e.prototype.onActive = function(t) {
var e;
if (hs.tp.isChapterContentMoveChapter(t)) if ((null !== (e = this.props.startTimes) && void 0 !== e ? e : 0) <= storage.getItem("winStreakCount", 0)) {
this.isMoveChapter = !0;
this.startTxtRollAni();
} else cc.isValid(this.winStreakUINode, !0) && (this.winStreakUINode.active = !1);
hs.tp.isChapterList_ProxyOpenUI(t) && this.showChapterListReady();
if (hs.tp.isChapterList_ProxyChapterListOpened(t)) {
this.isReady = !0;
this.createWinStreakUIAndShow();
}
hs.tp.isRevive_ProxyOnReviveOpened(t) && hs.gameInfo.gameMode === hs.GameMode.Chapter && this.showWinBreakUI();
};
e.prototype.showWinBreakUI = function() {
var t = Cinst(hs.Revive);
if (cc.isValid(t) && cc.isValid(t.node, !0) && cc.isValid(this.state.winBreakPrefab) && cc.isValid(this.state.spriteAtlas)) {
var e = t.node.getChildByName("WinStreakBreakView");
if (cc.isValid(e, !0) && hs.gameInfo.gameMode !== hs.GameMode.Chapter) e.active = !1; else if (hs.gameInfo.gameMode === hs.GameMode.Chapter) {
if (!cc.isValid(e, !0)) {
(e = cc.instantiate(this.state.winBreakPrefab)).name = "WinStreakBreakView";
t.node.addChild(e);
if (cc.isValid(t.btn, !0)) {
var i = t.btn.getPosition();
e.setPosition(cc.v2(0, i.y + 178));
}
}
if (cc.isValid(e, !0)) {
e.active = !0;
this.updateWinBreakUI(e);
}
}
}
};
e.prototype.updateWinBreakUI = function(t) {
var e = t.getComponent("WinStreakBreakView"), i = storage.getItem("winStreakCount", 0);
e.setState({
streakNum: i,
stage: this.getStageForStreakNum(i),
spriteAtlas: this.state.spriteAtlas
});
};
e.prototype.startTxtRollAni = function(t) {
void 0 === t && (t = 1);
if (cc.isValid(this.winStreakUINode, !0)) {
this.winStreakUINode.active = !0;
var e = this.winStreakUINode.getComponent("WinStreakAdjustView"), i = storage.getItem("winStreakCount", 0), a = storage.getItem("streakEffectAdjustOldStreakNum", i);
e.setState({
streakNum: i,
oldStreaKNum: a,
stage: this.getStageForStreakNum(i),
oldStage: this.getStageForStreakNum(a < 0 ? 0 : a),
stageList: this.state.stageList,
lastChapter: hs.chapterGameInfo.lastChapterNum,
curChapter: hs.chapterGameInfo.chapterNum,
spriteAtlas: this.state.spriteAtlas,
type: t
});
1 == t && storage.setItem("streakEffectAdjustOldStreakNum", i);
}
};
e.prototype.showChapterListReady = function() {
this.loadWinBreakPrefab();
this.loadWinEffectPrefab();
this.loadSpriteAtlas();
};
e.prototype.getStageForStreakNum = function(t) {
for (var e = 0; e < this.state.stageList.length; e++) if (t <= this.state.stageList[e]) return e;
return s.WinStreakStage.stage_3;
};
e.prototype.createWinStreakUIAndShow = function() {
var t = Cinst(hs.ChapterList);
if (cc.isValid(t) && cc.isValid(t.node, !0) && cc.isValid(this.state.winEffectPrefab) && cc.isValid(this.state.spriteAtlas)) {
var e = t.node, i = e.getChildByName("bottomContainer");
if (!e.getChildByName("WinStreakEffectAdjust") && cc.isValid(i, !0)) {
var a = cc.instantiate(this.state.winEffectPrefab);
a.parent = e;
var n = i.getPosition();
a.setPosition(cc.v2(n.x, n.y + 86.25));
a.name = "WinStreakEffectAdjust";
this.winStreakUINode = a;
var r = storage.getItem("winStreakCount", 0);
if (this.props.startTimes <= r) {
a.active = !0;
this.startTxtRollAni(0);
} else a.active = !1;
}
}
};
e.prototype.loadSpriteAtlas = function() {
var t = this;
cc.isValid(this.state.spriteAtlas) || hs.ResLoader.loadByBundle(this.bundleName, "res/textures/winStreakAdjust", cc.SpriteAtlas, function(e, i) {
if (e) ; else if (cc.isValid(i)) {
t.state.spriteAtlas = i;
t.loadComplete();
}
});
};
e.prototype.loadWinBreakPrefab = function() {
var t = this;
cc.isValid(this.state.winBreakPrefab) || hs.ResLoader.loadByBundle(this.bundleName, "res/prefabs/WinStreakBreakView", cc.Prefab, function(e, i) {
if (e) ; else if (cc.isValid(i)) {
t.state.winBreakPrefab = i;
t.loadComplete();
}
});
};
e.prototype.loadComplete = function() {
this.loadCount++;
if (this.loadCount >= 3 && this.isReady) {
this.createWinStreakUIAndShow();
this.isMoveChapter && this.startTxtRollAni();
}
};
e.prototype.loadWinEffectPrefab = function() {
var t = this;
cc.isValid(this.state.winEffectPrefab) || hs.ResLoader.loadByBundle(this.bundleName, "res/prefabs/WinStreakAdjustView", cc.Prefab, function(e, i) {
if (e) ; else if (cc.isValid(i)) {
t.state.winEffectPrefab = i;
t.loadComplete();
}
});
};
return r([ classId("WinStreakEffectAdjustTrait") ], e);
}(Trait);
i.WinStreakEffectAdjustTrait = o;
cc._RF.pop();
}, {
"./type/ChapterWinStreakType": "ChapterWinStreakType"
} ]
}, {}, [ "WinStreakEffectAdjustTrait", "WinStreakAdjustView", "WinStreakBreakView", "ScriptsWinStreakAdjustConfig", "ChapterWinStreakType" ]);
//# sourceMappingURL=index.js.map
