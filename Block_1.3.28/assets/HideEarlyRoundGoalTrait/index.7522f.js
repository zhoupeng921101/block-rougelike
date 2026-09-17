window.__require = function i(e, o, n) {
function t(s, a) {
if (!o[s]) {
if (!e[s]) {
var l = s.split("/");
l = l[l.length - 1];
if (!e[l]) {
var c = "function" == typeof __require && __require;
if (!a && c) return c(l, !0);
if (r) return r(l, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = l;
}
var p = o[s] = {
exports: {}
};
e[s][0].call(p.exports, function(i) {
return t(e[s][1][i] || i);
}, p, p.exports, i, e, o, n);
}
return o[s].exports;
}
for (var r = "function" == typeof __require && __require, s = 0; s < n.length; s++) t(n[s]);
return t;
}({
HideEarlyRoundGoalTrait: [ function(i, e, o) {
"use strict";
cc._RF.push(e, "a8e9fOyxNFOWptsfY4PGis8", "HideEarlyRoundGoalTrait");
var n, t = this && this.__extends || (n = function(i, e) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(i, e) {
i.__proto__ = e;
} || function(i, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (i[o] = e[o]);
})(i, e);
}, function(i, e) {
n(i, e);
function o() {
this.constructor = i;
}
i.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), r = this && this.__decorate || function(i, e, o, n) {
var t, r = arguments.length, s = r < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(i, e, o, n); else for (var a = i.length - 1; a >= 0; a--) (t = i[a]) && (s = (r < 3 ? t(s) : r > 3 ? t(e, o, s) : t(e, o)) || s);
return r > 3 && s && Object.defineProperty(e, o, s), s;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.HideEarlyRoundGoalTrait = void 0;
var s = function(i) {
t(e, i);
function e() {
var e = null !== i && i.apply(this, arguments) || this;
e._roundNum = 0;
e._boneAniOriginalPos = null;
e._boneAni_1OriginalPos = null;
e._playOriginPos = null;
return e;
}
e.prototype.onActive = function(i) {
hs.tp.isChapterGameDataClear_Disk_ProxyResetRound(i) && (this._roundNum = hs.storage.getItem("chapterRoundNum", 0));
hs.tp.isChapterScoreFailShowAction(i) && this.changeNodePos(i.target);
hs.tp.isChapterCollectFailShowAction(i) && this.changeNodePos(i.target);
hs.tp.isChapterScoreFailOnDisable(i) && this.resetUIPos(i.target);
hs.tp.isChapterCollectFailOnDisable(i) && this.resetUIPos(i.target);
if (hs.tp.isReduceTravelSettlementTraitSetProgressActive(i)) {
var e = i.args[0];
if (cc.isValid(e)) {
var o = this._roundNum > this.props.roundNum;
e.active = o;
}
}
};
e.prototype.changeNodePos = function(i) {
if (cc.isValid(i)) {
var e = this._roundNum > this.props.roundNum;
i.progress ? i.progress.active = e : i.collectItemNode && (i.collectItemNode.active = e);
var o = i.boneAni, n = i.boneAni_1, t = i.playBtn.node;
this._boneAniOriginalPos = o.node.position.clone();
this._boneAni_1OriginalPos = n.node.position.clone();
this._playOriginPos = t.position.clone();
if (e) {
o.node.position = this._boneAniOriginalPos.clone();
n.node.position = this._boneAni_1OriginalPos.clone();
t.position = this._playOriginPos.clone();
} else {
var r = t.y;
n.node.position = new cc.Vec3(this._boneAni_1OriginalPos.x, 700 + r);
o.node.position = new cc.Vec3(this._boneAniOriginalPos.x, r + 140);
}
var s = i.node.getChildByName("IsOpenLevelOverTipsChangeTraitTipAni");
cc.isValid(s);
setTimeoutSafe(function() {
cc.isValid(s) && cc.isValid(o) && (s.y = o.node.y);
}, 0);
}
};
e.prototype.resetUIPos = function(i) {
if (cc.isValid(i) && this._boneAniOriginalPos && this._boneAni_1OriginalPos && this._playOriginPos) {
var e = i.boneAni, o = i.boneAni_1, n = i.playBtn.node;
e.node.position = this._boneAniOriginalPos.clone();
o.node.position = this._boneAni_1OriginalPos.clone();
n.position = this._playOriginPos.clone();
var t = i.node.getChildByName("IsOpenLevelOverTipsChangeTraitTipAni");
setTimeoutSafe(function() {
cc.isValid(t) && cc.isValid(e) && (t.y = e.node.y);
}, 0);
this._boneAniOriginalPos = null;
this._boneAni_1OriginalPos = null;
this._playOriginPos = null;
}
};
return r([ classId("HideEarlyRoundGoalTrait") ], e);
}(Trait);
o.HideEarlyRoundGoalTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "HideEarlyRoundGoalTrait" ]);
//# sourceMappingURL=index.js.map
