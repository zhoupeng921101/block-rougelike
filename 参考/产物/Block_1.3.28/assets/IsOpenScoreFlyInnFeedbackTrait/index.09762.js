window.__require = function e(o, r, t) {
function c(i, a) {
if (!r[i]) {
if (!o[i]) {
var s = i.split("/");
s = s[s.length - 1];
if (!o[s]) {
var p = "function" == typeof __require && __require;
if (!a && p) return p(s, !0);
if (n) return n(s, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = s;
}
var l = r[i] = {
exports: {}
};
o[i][0].call(l.exports, function(e) {
return c(o[i][1][e] || e);
}, l, l.exports, e, o, r, t);
}
return r[i].exports;
}
for (var n = "function" == typeof __require && __require, i = 0; i < t.length; i++) c(t[i]);
return c;
}({
IsOpenScoreFlyInnFeedbackTrait: [ function(e, o, r) {
"use strict";
cc._RF.push(o, "db860wglrxOzbDCKEEjXVbr", "IsOpenScoreFlyInnFeedbackTrait");
var t, c, n = this && this.__extends || (t = function(e, o) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, o) {
e.__proto__ = o;
} || function(e, o) {
for (var r in o) Object.prototype.hasOwnProperty.call(o, r) && (e[r] = o[r]);
})(e, o);
}, function(e, o) {
t(e, o);
function r() {
this.constructor = e;
}
e.prototype = null === o ? Object.create(o) : (r.prototype = o.prototype, new r());
}), i = this && this.__decorate || function(e, o, r, t) {
var c, n = arguments.length, i = n < 3 ? o : null === t ? t = Object.getOwnPropertyDescriptor(o, r) : t;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(e, o, r, t); else for (var a = e.length - 1; a >= 0; a--) (c = e[a]) && (i = (n < 3 ? c(i) : n > 3 ? c(o, r, i) : c(o, r)) || i);
return n > 3 && i && Object.defineProperty(o, r, i), i;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.IsOpenScoreFlyInnFeedbackTrait = void 0;
(function(e) {
e[e.Combo = 0] = "Combo";
e[e.ClearScreen = 1] = "ClearScreen";
})(c || (c = {}));
var a = function(e) {
n(o, e);
function o() {
var o = null !== e && e.apply(this, arguments) || this;
o._scoreGroup = {
curScore: 0,
baseScore: 0,
comboScore: 0,
screenScore: 0,
blockScore: 0
};
o._clip = null;
return o;
}
o.prototype.onCreate = function() {
var e = this;
hs.ResLoader.loadByBundle(this.traitName, "animations/IsOpenScoreFlyInnFeedback", cc.AnimationClip, function(o, r) {
o || (e._clip = r);
});
};
o.prototype.onActive = function(e) {
if (hs.gameInfo.gameMode === hs.GameMode.Class) {
hs.tp.isClassScore_ProxyComputeScoreAddOption(e) && Object.assign(this._scoreGroup, e.args[0]);
if (hs.tp.isComboScoreTipAnimalEndScoreNode(e)) {
if (!this._clip) return;
e.disable([ "ComboflyScoreTrait" ]);
e.replace = !0;
this.playComboScoreFlyAnim(e.target);
}
if (hs.tp.isClassBoardSplashAnimation_ProxyOnClearScreenAnimationComplete(e)) {
if (!this._clip) return;
this.playScaleAnimation(c.ClearScreen);
}
}
};
o.prototype.playComboScoreFlyAnim = function(e) {
var o = this, r = e.node, t = Cinst(hs.ClassTopInfo);
if (cc.isValid(t)) {
var n = t.curNode.parent.convertToWorldSpaceAR(t.curNode.getPosition()), i = hs.gameUiLayer.convertToNodeSpaceAR(n);
cc.tween(r).to(.3, {
position: new cc.Vec3(i.x, i.y, 0)
}).call(function() {
o.playScaleAnimation(c.Combo);
}).to(.2, {
scale: 0
}, {
easing: cc.easing.sineOut
}).call(function() {
e.setState({
type: "reset"
});
r.opacity = 0;
hs.comboScoreTipInfo.putComboScoreTip(e);
}).start();
}
};
o.prototype.playScaleAnimation = function(e) {
var o, r = this._scoreGroup.curScore, t = 0;
if (e === c.Combo) {
r += this._scoreGroup.baseScore;
t = this._scoreGroup.comboScore + this._scoreGroup.blockScore;
} else if (e === c.ClearScreen) {
r += this._scoreGroup.baseScore + this._scoreGroup.comboScore + this._scoreGroup.blockScore;
t = this._scoreGroup.screenScore;
}
o = r + t;
var n = Math.floor(Math.log10(Math.max(t, 1))), i = Math.floor(t / Math.pow(10, n)) * Math.pow(10, n), a = Cinst(hs.ClassTopInfo);
if (cc.isValid(null == a ? void 0 : a.curNode)) {
var s = a.curNode.children.find(function(e) {
return e.active && e.opacity > 0 && e.getComponent(cc.Label);
});
if (cc.isValid(s)) {
var p = Number(a.curScore.string);
a.setScoreLabel(Math.max(isNaN(p) ? 0 : p, r + i));
var l = s.getComponent(cc.Animation);
l || (l = s.addComponent(cc.Animation)).addClip(this._clip);
this._clip.speed = 1 / (cc.director._kSpeed || 1);
l.play("IsOpenScoreFlyInnFeedback");
}
cc.tween(a.curNode).delay(.3).call(function() {
if (cc.isValid(a.curScore)) {
var e = Number(a.curScore.string), r = Math.max(o, isNaN(e) ? 0 : e);
hs.EventManager.dispatchModuleEvent(new hs.E_ComboScoreTip_ScoreAnim({
score: r,
highScore: hs.classScoreInfo.highScore
}));
}
}).start();
}
};
return i([ classId("IsOpenScoreFlyInnFeedbackTrait") ], o);
}(Trait);
r.IsOpenScoreFlyInnFeedbackTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "IsOpenScoreFlyInnFeedbackTrait" ]);
//# sourceMappingURL=index.js.map
