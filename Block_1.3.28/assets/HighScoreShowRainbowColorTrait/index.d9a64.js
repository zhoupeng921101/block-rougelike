window.__require = function o(e, t, i) {
function n(a, c) {
if (!t[a]) {
if (!e[a]) {
var s = a.split("/");
s = s[s.length - 1];
if (!e[s]) {
var l = "function" == typeof __require && __require;
if (!c && l) return l(s, !0);
if (r) return r(s, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = s;
}
var h = t[a] = {
exports: {}
};
e[a][0].call(h.exports, function(o) {
return n(e[a][1][o] || o);
}, h, h.exports, o, e, t, i);
}
return t[a].exports;
}
for (var r = "function" == typeof __require && __require, a = 0; a < i.length; a++) n(i[a]);
return n;
}({
ClassHighScoreShowRainbowColorAnim: [ function(o, e, t) {
"use strict";
cc._RF.push(e, "eaf80zvGEBMVJWWUyW+KS2V", "ClassHighScoreShowRainbowColorAnim");
var i, n = this && this.__extends || (i = function(o, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(o, e) {
o.__proto__ = e;
} || function(o, e) {
for (var t in e) Object.prototype.hasOwnProperty.call(e, t) && (o[t] = e[t]);
})(o, e);
}, function(o, e) {
i(o, e);
function t() {
this.constructor = o;
}
o.prototype = null === e ? Object.create(e) : (t.prototype = e.prototype, new t());
}), r = this && this.__decorate || function(o, e, t, i) {
var n, r = arguments.length, a = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, t) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(o, e, t, i); else for (var c = o.length - 1; c >= 0; c--) (n = o[c]) && (a = (r < 3 ? n(a) : r > 3 ? n(e, t, a) : n(e, t)) || a);
return r > 3 && a && Object.defineProperty(e, t, a), a;
};
Object.defineProperty(t, "__esModule", {
value: !0
});
t.ClassHighScoreShowRainbowColorAnim = void 0;
var a = cc._decorator, c = a.ccclass, s = a.property, l = function(o) {
n(e, o);
function e() {
var e = null !== o && o.apply(this, arguments) || this;
e.dragonHighScore = null;
e.dragonWhiteScore = null;
e.dragonYellowScore = null;
return e;
}
e.prototype.render = function() {
var o = this;
this.dragonHighScore.playAnimation("newhighscore", 1);
var e = Cinst(hs.ClassTopInfo);
if (e && cc.isValid(e.node)) {
var t = e.curNode.convertToWorldSpaceAR(cc.v2(0, 0)), i = this.node.convertToNodeSpaceAR(t);
this.dragonWhiteScore.node.x = i.x;
this.dragonWhiteScore.node.y = i.y - 20;
this.dragonWhiteScore.playAnimation("big", -1);
var n = e.highNode.convertToWorldSpaceAR(cc.v2(0, 0)), r = this.node.convertToNodeSpaceAR(n);
this.dragonYellowScore.node.x = r.x + 50;
this.dragonYellowScore.node.y = r.y;
this.dragonYellowScore.playAnimation("small", -1);
this.scheduleOnce(function() {
var e, t;
null === (t = (e = o.state).completeCallback) || void 0 === t || t.call(e);
}, 2.2);
}
};
r([ s(dragonBones.ArmatureDisplay) ], e.prototype, "dragonHighScore", void 0);
r([ s(dragonBones.ArmatureDisplay) ], e.prototype, "dragonWhiteScore", void 0);
r([ s(dragonBones.ArmatureDisplay) ], e.prototype, "dragonYellowScore", void 0);
return r([ c ], e);
}(hs.Component);
t.ClassHighScoreShowRainbowColorAnim = l;
cc._RF.pop();
}, {} ],
ClassHighScoreShowRainbowColorUI: [ function(o, e, t) {
"use strict";
cc._RF.push(e, "aaafcxa9ZRN1bZCm0GjTEA+", "ClassHighScoreShowRainbowColorUI");
var i, n = this && this.__extends || (i = function(o, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(o, e) {
o.__proto__ = e;
} || function(o, e) {
for (var t in e) Object.prototype.hasOwnProperty.call(e, t) && (o[t] = e[t]);
})(o, e);
}, function(o, e) {
i(o, e);
function t() {
this.constructor = o;
}
o.prototype = null === e ? Object.create(e) : (t.prototype = e.prototype, new t());
}), r = this && this.__decorate || function(o, e, t, i) {
var n, r = arguments.length, a = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, t) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(o, e, t, i); else for (var c = o.length - 1; c >= 0; c--) (n = o[c]) && (a = (r < 3 ? n(a) : r > 3 ? n(e, t, a) : n(e, t)) || a);
return r > 3 && a && Object.defineProperty(e, t, a), a;
};
Object.defineProperty(t, "__esModule", {
value: !0
});
t.ClassHighScoreShowRainbowColorUI = void 0;
var a = cc._decorator, c = a.ccclass, s = a.property, l = function(o) {
n(e, o);
function e() {
var e = null !== o && o.apply(this, arguments) || this;
e.nodeBg = null;
e.nodeBoardGrid = null;
e.nodeCrown = null;
e.nodeSetting = null;
return e;
}
e.prototype.render = function() {
var o = this;
this.setBg();
this.setBoardGrid();
this.setCrown();
this.setSetting();
this.scheduleOnce(function() {
var e, t;
null === (t = (e = o.state).completeCallback) || void 0 === t || t.call(e);
}, 2.2);
};
e.prototype.setBg = function() {
var o = Cinst(hs.ClassGame);
if (o && cc.isValid(o.node)) {
var e = Cinst(hs.Board);
if (cc.isValid(e) && cc.isValid(e.boardGrid)) {
var t = cc.instantiate(this.nodeBg);
t.parent = e.node;
t.setSiblingIndex(e.boardGrid.getSiblingIndex() + 1);
t.getComponent(cc.Widget).target = o.node;
t.setPosition(cc.v2(0, 0));
this.playAnim(t, !0);
}
}
};
e.prototype.setBoardGrid = function() {
var o = Cinst(hs.Board);
if (cc.isValid(o) && cc.isValid(o.boardGrid)) {
var e = cc.instantiate(this.nodeBoardGrid);
e.parent = o.node;
e.setSiblingIndex(o.boardGrid.getSiblingIndex() + 2);
e.setPosition(cc.v2(0, 0));
this.playAnim(e, !0);
}
};
e.prototype.setCrown = function() {
var o = Cinst(hs.ClassTopInfo);
if (cc.isValid(o) && cc.isValid(o.highNode)) {
var e = cc.instantiate(this.nodeCrown);
e.parent = o.highNode;
e.setPosition(cc.v2(0, 0));
this.playAnim(e, !0);
}
};
e.prototype.setSetting = function() {
var o = Cinst(hs.ClassTopInfo);
if (cc.isValid(o) && cc.isValid(o.setBtn)) {
var e = cc.instantiate(this.nodeSetting);
e.parent = o.setBtn.node;
e.setPosition(cc.v2(0, 0));
var t = o.setBtn.node.getChildByName("red");
cc.isValid(t) && e.setSiblingIndex(t.getSiblingIndex() - 1);
this.playAnim(e, !0);
}
};
e.prototype.playAnim = function(o, e) {
if (cc.isValid(o)) {
o.opacity = 0;
cc.tween(o).to(.9, {
opacity: 255
}).delay(.63).to(.57, {
opacity: 0
}).call(function() {
e && o.destroy();
}).start();
}
};
r([ s(cc.Node) ], e.prototype, "nodeBg", void 0);
r([ s(cc.Node) ], e.prototype, "nodeBoardGrid", void 0);
r([ s(cc.Node) ], e.prototype, "nodeCrown", void 0);
r([ s(cc.Node) ], e.prototype, "nodeSetting", void 0);
return r([ c ], e);
}(hs.Component);
t.ClassHighScoreShowRainbowColorUI = l;
cc._RF.pop();
}, {} ],
HighScoreShowRainbowColorTrait: [ function(o, e, t) {
"use strict";
cc._RF.push(e, "642e0tEXxdI0J70W/eu+Ur5", "HighScoreShowRainbowColorTrait");
var i, n = this && this.__extends || (i = function(o, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(o, e) {
o.__proto__ = e;
} || function(o, e) {
for (var t in e) Object.prototype.hasOwnProperty.call(e, t) && (o[t] = e[t]);
})(o, e);
}, function(o, e) {
i(o, e);
function t() {
this.constructor = o;
}
o.prototype = null === e ? Object.create(e) : (t.prototype = e.prototype, new t());
}), r = this && this.__decorate || function(o, e, t, i) {
var n, r = arguments.length, a = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, t) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(o, e, t, i); else for (var c = o.length - 1; c >= 0; c--) (n = o[c]) && (a = (r < 3 ? n(a) : r > 3 ? n(e, t, a) : n(e, t)) || a);
return r > 3 && a && Object.defineProperty(e, t, a), a;
}, a = this && this.__read || function(o, e) {
var t = "function" == typeof Symbol && o[Symbol.iterator];
if (!t) return o;
var i, n, r = t.call(o), a = [];
try {
for (;(void 0 === e || e-- > 0) && !(i = r.next()).done; ) a.push(i.value);
} catch (o) {
n = {
error: o
};
} finally {
try {
i && !i.done && (t = r.return) && t.call(r);
} finally {
if (n) throw n.error;
}
}
return a;
};
Object.defineProperty(t, "__esModule", {
value: !0
});
t.HighScoreShowRainbowColorTrait = void 0;
var c = o("./components/ClassHighScoreShowRainbowColorAnim"), s = o("./components/ClassHighScoreShowRainbowColorUI"), l = o("./interface/IHighScoreShowRainbowColor"), h = function(o) {
n(e, o);
function e() {
var e = null !== o && o.apply(this, arguments) || this;
e._animPrefab = null;
e._uiPrefab = null;
e._animCom = null;
e._uiCom = null;
return e;
}
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "Skin_Proxy",
methodName: "traitConfigInitComplete"
}, {
className: "ClearInitPanelEffectTrait",
methodName: "modifyEffectNodeSiblingIndex"
} ];
};
e.prototype.onCreate = function() {
this.preloadPrefab();
};
e.prototype.onActive = function(o) {
if (hs.tp.isEncourage_ProxyOnEncourageEffectsPlay(o)) {
if (hs.gameInfo.gameMode === hs.GameMode.Chapter) return;
if (o.args[0].state.type !== hs.EncourageType.NEW_HIGH_SCORE) return;
if (null == this._animPrefab || null == this._uiPrefab) return;
this.playRainbowColor();
o.returnState = !0;
o.replace = !0;
}
if (hs.tp.isClassCombo_ProxyChangeComboPos(o)) {
if (null == this._animPrefab || null == this._uiPrefab) return;
if (this._animCom && this._uiCom) {
var e = o.args[0], t = o.args[1], i = this.modifyComboPos(e, t);
o.args[1] = i.comboPosY;
}
}
if (hs.tp.isIsOpenRightPutTraitGetPerfectEffectPos(o)) {
if (null == this._animPrefab || null == this._uiPrefab) return;
this._animCom && this._uiCom && (o.args[1] = o.args[1] - 200);
}
if (hs.tp.isClearInitPanelEffectTraitModifyEffectNodeSiblingIndex(o)) {
if (null == this._animPrefab || null == this._uiPrefab) return;
this._animCom && this._uiCom && this.modifyEffectNodeSiblingIndex();
}
};
e.prototype.modifyComboPos = function(o, e) {
var t;
if (!this._animCom || !cc.isValid(this._animCom.node)) return {
comboPosX: o,
comboPosY: e
};
var i = null === (t = this._animCom.dragonHighScore) || void 0 === t ? void 0 : t.node;
return i && cc.isValid(i) ? {
comboPosX: o,
comboPosY: e += 100
} : {
comboPosX: o,
comboPosY: e
};
};
e.prototype.preloadPrefab = function() {
var o = this;
null != this._animPrefab && null != this._uiPrefab || Promise.all([ hs.ResLoader.asyncLoadByBundle(l.IHighScoreShowRainbowColor.BundleName, "prefabs/ClassNodeHighScoreShowRainbowColorAnim", cc.Prefab), hs.ResLoader.asyncLoadByBundle(l.IHighScoreShowRainbowColor.BundleName, "prefabs/ClassNodeHighScoreShowRainbowColorUI", cc.Prefab) ]).then(function(e) {
var t = a(e, 2), i = t[0], n = t[1];
if (null != i && null != n) {
o._animPrefab = i;
o._uiPrefab = n;
}
});
};
e.prototype.playRainbowColor = function() {
if (hs.gameEffectLayer && cc.isValid(hs.gameEffectLayer) && hs.gameUiLayer && cc.isValid(hs.gameUiLayer)) {
var o = cc.instantiate(this._animPrefab);
o.parent = hs.gameEffectLayer;
var e = Cinst(hs.Board);
if (e && cc.isValid(e.node)) {
var t = e.node.parent.convertToWorldSpaceAR(cc.v2(0, 0)), i = o.convertToNodeSpaceAR(t);
o.setPosition(i);
this._animCom = o.getComponent(c.ClassHighScoreShowRainbowColorAnim);
this._animCom.setState({
completeCallback: this.onAnimComplete.bind(this)
});
this.modifyEffectNodeSiblingIndex();
var n = cc.instantiate(this._uiPrefab);
n.parent = hs.gameUiLayer;
n.setPosition(cc.v2(0, 0));
this._uiCom = n.getComponent(s.ClassHighScoreShowRainbowColorUI);
this._uiCom.setState({
completeCallback: this.onUIComplete.bind(this)
});
}
}
};
e.prototype.modifyEffectNodeSiblingIndex = function() {
var o = hs.UI.getActiveUI(hs.ClassPrefabConfig.ClearInitPanelEffect.url);
cc.isValid(o) && this._animCom && cc.isValid(this._animCom.node) && this._animCom.node.setSiblingIndex(o.getSiblingIndex() + 1);
};
e.prototype.onAnimComplete = function() {
if (this._animCom && cc.isValid(this._animCom.node)) {
this._animCom.node.destroy();
this._animCom = null;
}
};
e.prototype.onUIComplete = function() {
if (this._uiCom && cc.isValid(this._uiCom.node)) {
this._uiCom.node.destroy();
this._uiCom = null;
}
};
return r([ classId("HighScoreShowRainbowColorTrait") ], e);
}(Trait);
t.HighScoreShowRainbowColorTrait = h;
cc._RF.pop();
}, {
"./components/ClassHighScoreShowRainbowColorAnim": "ClassHighScoreShowRainbowColorAnim",
"./components/ClassHighScoreShowRainbowColorUI": "ClassHighScoreShowRainbowColorUI",
"./interface/IHighScoreShowRainbowColor": "IHighScoreShowRainbowColor"
} ],
IHighScoreShowRainbowColor: [ function(o, e, t) {
"use strict";
cc._RF.push(e, "b7475YDThFJAoxBhsuknB8G", "IHighScoreShowRainbowColor");
Object.defineProperty(t, "__esModule", {
value: !0
});
t.IHighScoreShowRainbowColor = void 0;
var i = function() {
function o() {}
o.BundleName = "HighScoreShowRainbowColorTrait";
return o;
}();
t.IHighScoreShowRainbowColor = i;
cc._RF.pop();
}, {} ]
}, {}, [ "HighScoreShowRainbowColorTrait", "ClassHighScoreShowRainbowColorAnim", "ClassHighScoreShowRainbowColorUI", "IHighScoreShowRainbowColor" ]);
//# sourceMappingURL=index.js.map
