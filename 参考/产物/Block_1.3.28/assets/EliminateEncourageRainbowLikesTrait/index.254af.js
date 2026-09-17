window.__require = function e(n, t, o) {
function i(a, s) {
if (!t[a]) {
if (!n[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!n[c]) {
var u = "function" == typeof __require && __require;
if (!s && u) return u(c, !0);
if (r) return r(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var l = t[a] = {
exports: {}
};
n[a][0].call(l.exports, function(e) {
return i(n[a][1][e] || e);
}, l, l.exports, e, n, t, o);
}
return t[a].exports;
}
for (var r = "function" == typeof __require && __require, a = 0; a < o.length; a++) i(o[a]);
return i;
}({
EliminateEncourageRainbowLikesTrait: [ function(e, n, t) {
"use strict";
cc._RF.push(n, "c3003WQURtFE6Y/Jt3p6szK", "EliminateEncourageRainbowLikesTrait");
var o, i = this && this.__extends || (o = function(e, n) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, n) {
e.__proto__ = n;
} || function(e, n) {
for (var t in n) Object.prototype.hasOwnProperty.call(n, t) && (e[t] = n[t]);
})(e, n);
}, function(e, n) {
o(e, n);
function t() {
this.constructor = e;
}
e.prototype = null === n ? Object.create(n) : (t.prototype = n.prototype, new t());
}), r = this && this.__decorate || function(e, n, t, o) {
var i, r = arguments.length, a = r < 3 ? n : null === o ? o = Object.getOwnPropertyDescriptor(n, t) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, n, t, o); else for (var s = e.length - 1; s >= 0; s--) (i = e[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(n, t, a) : i(n, t)) || a);
return r > 3 && a && Object.defineProperty(n, t, a), a;
};
Object.defineProperty(t, "__esModule", {
value: !0
});
t.EliminateEncourageRainbowLikesTrait = void 0;
var a = function(e) {
i(n, e);
function n() {
var n = null !== e && e.apply(this, arguments) || this;
n._bone = null;
return n;
}
n.prototype.onActive = function(e) {
var n, t;
if (hs.tp.isEncourage_ProxySetEffectState(e) && e.args[0].type == hs.EncourageType.LEVEL_COLOR) {
var o = this.getEliminateCount(null === (n = null == e ? void 0 : e.args[0]) || void 0 === n ? void 0 : n.eliminateCount);
if (2 === o) {
e.args[1] && (e.args[1].x = cc.view.getVisibleSize().width / 2);
this.chanePositionInEliminateCount2(e);
} else if (o > 2) {
var i = this.getPromptType(null === (t = null == e ? void 0 : e.args[0]) || void 0 === t ? void 0 : t.promptType, o), r = i + "_5";
if (-1 != [ "great_5", "excellect_5", "amazing_5", "unbelievable_5" ].indexOf(r)) {
this.chanePositionInEliminateCount2Plus(e);
if (!this.isTrigger(i)) return;
this.playAnimation(r, null == e ? void 0 : e.args[1]);
}
}
}
if (hs.tp.isEncourage_ProxyGetPosition(e)) {
var a = Cinst(hs.Board).node.convertToWorldSpaceAR(cc.v3(0, 0)), s = hs.gameUiLayer.convertToNodeSpaceAR(a), c = e.args[0];
c.y = s.y + 294;
e.args[0] = c;
}
};
n.prototype.isTrigger = function() {
return !0;
};
n.prototype.getEliminateCount = function(e) {
return e;
};
n.prototype.getPromptType = function(e) {
return e;
};
n.prototype.chanePositionInEliminateCount2 = function() {};
n.prototype.chanePositionInEliminateCount2Plus = function() {};
n.prototype.playAnimation = function(e, n) {
var t = this;
n.x = cc.view.getVisibleSize().width / 2;
if (this._bone) {
this._bone.node.opacity = 255;
this._bone.node.x = n.x;
this._bone.node.y = n.y;
this._bone.node.setSiblingIndex(this.getBoneSiblingIndex());
this._bone.node.zIndex = this.getBone_zIndex(this._bone.node.zIndex);
this._bone.playAnimation(e, 1);
} else {
var o = this.getBundleInfo(), i = o.bundleName, r = o.url;
hs.ResLoader.asyncLoadByBundle(i, r, cc.Prefab).then(function(o) {
if (cc.isValid(o)) {
var i = cc.instantiate(o);
i.name = "RainbowLikes";
i.setParent(t.getBoneParent());
t._bone = i.getComponent(dragonBones.ArmatureDisplay);
t._bone.node.setSiblingIndex(t.getBoneSiblingIndex());
t._bone.node.x = n.x;
t._bone.node.y = n.y;
t._bone.node.opacity = 255;
t._bone.node.zIndex = t.getBone_zIndex(t._bone.node.zIndex);
t._bone.addEventListener(dragonBones.EventObject.COMPLETE, function(e) {
e && e.animationState && e.animationState.name && (t._bone.node.opacity = 0);
}, t);
t._bone.playAnimation(e, 1);
}
});
}
};
n.prototype.getBoneParent = function() {
return hs.gameUiLayer;
};
n.prototype.getBone_zIndex = function(e) {
return e;
};
n.prototype.getBoneSiblingIndex = function() {
return hs.gameUiLayer.childrenCount;
};
n.prototype.getBundleInfo = function() {
return {
bundleName: this.traitName,
url: "prefabs/RainbowLikes"
};
};
return r([ classId("EliminateEncourageRainbowLikesTrait"), classMethodWatch() ], n);
}(Trait);
t.EliminateEncourageRainbowLikesTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "EliminateEncourageRainbowLikesTrait" ]);
//# sourceMappingURL=index.js.map
