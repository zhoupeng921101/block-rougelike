window.__require = function e(t, i, n) {
function o(r, s) {
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
var h = i[r] = {
exports: {}
};
t[r][0].call(h.exports, function(e) {
return o(t[r][1][e] || e);
}, h, h.exports, e, t, i, n);
}
return i[r].exports;
}
for (var a = "function" == typeof __require && __require, r = 0; r < n.length; r++) o(n[r]);
return o;
}({
GameOverButtonShineEffectTrait: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "e2641nHMNdD5aJoQneCM6xQ", "GameOverButtonShineEffectTrait");
var n, o = this && this.__extends || (n = function(e, t) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
})(e, t);
}, function(e, t) {
n(e, t);
function i() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (i.prototype = t.prototype, new i());
}), a = this && this.__decorate || function(e, t, i, n) {
var o, a = arguments.length, r = a < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, i) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(e, t, i, n); else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (r = (a < 3 ? o(r) : a > 3 ? o(t, i, r) : o(t, i)) || r);
return a > 3 && r && Object.defineProperty(t, i, r), r;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
i.GameOverButtonShineEffectTrait = void 0;
var r = function(e) {
o(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ChapterFail_Proxy",
methodName: "chapterOverPanelShowFinished"
}, {
className: "ChapterWin_Proxy",
methodName: "chapterWinPanelShowFinished"
}, {
className: "ClassGameOver_Proxy",
methodName: "onClassGameOverShowFinish"
}, {
className: "ClassGameOver_Proxy",
methodName: "onClassGameOverShowBtnFinish"
} ];
};
t.prototype.onActive = function(e) {
var t, i, n, o, a, r, s, l, c, h;
if (hs.tp.isChapterFail_ProxyChapterOverPanelShowFinished(e)) {
var p = void 0;
(d = e.args[0]) === hs.ChapterOverPanelType.chapterScoreFail ? p = null === (t = Cinst(hs.ChapterScoreFail).playBtn) || void 0 === t ? void 0 : t.node : d === hs.ChapterOverPanelType.chapterCollectFail && (p = null === (i = Cinst(hs.ChapterCollectFail).playBtn) || void 0 === i ? void 0 : i.node);
cc.isValid(p) && this.showButtonShineEffect(p);
}
if (hs.tp.isChapterWin_ProxyChapterWinPanelShowFinished(e)) {
var d;
p = void 0;
(d = e.args[0]) === hs.ChapterWinType.chapterScoreWin ? p = null === (o = null === (n = Cinst(hs.ChapterScoreWin)) || void 0 === n ? void 0 : n.playBtn) || void 0 === o ? void 0 : o.node : d === hs.ChapterWinType.chapterCollectWin && (p = null === (r = null === (a = Cinst(hs.ChapterCollectWin)) || void 0 === a ? void 0 : a.playBtn) || void 0 === r ? void 0 : r.node);
cc.isValid(p) && this.showButtonShineEffect(p);
}
if (hs.tp.isClassGameOver_ProxyOnClassGameOverShowFinish(e)) if (e.args[0].option.isWin) (p = null === (s = null == (f = Cinst(hs.ClassWin)) ? void 0 : f.playBtn) || void 0 === s ? void 0 : s.node) && cc.isValid(p) && (u = p.getChildByName("saoguang")) && cc.isValid(u) && (u.active = !1); else if ((p = null === (l = null == (f = Cinst(hs.ClassFail)) ? void 0 : f.playBtn) || void 0 === l ? void 0 : l.node) && cc.isValid(p)) {
var u;
(u = p.getChildByName("saoguang")) && cc.isValid(u) && (u.active = !1);
}
if (hs.tp.isClassGameOver_ProxyOnClassGameOverShowBtnFinish(e)) if (e.args[0].state.isWin) (p = null === (c = null == (f = Cinst(hs.ClassWin)) ? void 0 : f.playBtn) || void 0 === c ? void 0 : c.node) && cc.isValid(p) && this.showButtonShineEffect(p); else {
var f;
(p = null === (h = null == (f = Cinst(hs.ClassFail)) ? void 0 : f.playBtn) || void 0 === h ? void 0 : h.node) && cc.isValid(p) && this.showButtonShineEffect(p);
}
};
t.prototype.showButtonShineEffect = function(e) {
if (e && cc.isValid(e)) {
var t = e.getChildByName("saoguang");
if (t) {
t.active = !0;
t.getComponent(dragonBones.ArmatureDisplay).playAnimation("in", 0);
} else hs.ResLoader.loadByBundle("GameOverButtonShineEffectTrait", "prefabs/saoguang", cc.Prefab, function(t, i) {
if (!t && e && cc.isValid(e) && !e.getChildByName("saoguang")) {
var n = cc.instantiate(i);
e.addChild(n);
n.y += 10;
n.getComponent(dragonBones.ArmatureDisplay).playAnimation("in", 0);
}
});
}
};
return a([ classId("GameOverButtonShineEffectTrait") ], t);
}(Trait);
i.GameOverButtonShineEffectTrait = r;
cc._RF.pop();
}, {} ]
}, {}, [ "GameOverButtonShineEffectTrait" ]);
//# sourceMappingURL=index.js.map
