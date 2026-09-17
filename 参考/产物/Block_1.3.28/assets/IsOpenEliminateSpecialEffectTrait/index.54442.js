window.__require = function t(e, o, n) {
function r(c, a) {
if (!o[c]) {
if (!e[c]) {
var f = c.split("/");
f = f[f.length - 1];
if (!e[f]) {
var s = "function" == typeof __require && __require;
if (!a && s) return s(f, !0);
if (i) return i(f, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = f;
}
var l = o[c] = {
exports: {}
};
e[c][0].call(l.exports, function(t) {
return r(e[c][1][t] || t);
}, l, l.exports, t, e, o, n);
}
return o[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < n.length; c++) r(n[c]);
return r;
}({
EliminateSpecialEffect: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "d49bewNEtlNlrI6Up22Dimf", "EliminateSpecialEffect");
var n, r = this && this.__extends || (n = function(t, e) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
n(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), i = this && this.__decorate || function(t, e, o, n) {
var r, i = arguments.length, c = i < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, o, n); else for (var a = t.length - 1; a >= 0; a--) (r = t[a]) && (c = (i < 3 ? r(c) : i > 3 ? r(e, o, c) : r(e, o)) || c);
return i > 3 && c && Object.defineProperty(e, o, c), c;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var c = cc._decorator, a = c.ccclass, f = c.property, s = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.aniNode = null;
return e;
}
e.prototype.render = function() {
var t = this;
this.state.block >= hs.BlocksProducerType.ID1 && this.state.block < hs.BlocksProducerType.AllCountOfBlock ? hs.blockPosInfo[this.state.block - 1] : hs.blocksProducerInfo.checkAbnormalBlock(this.state.block) && hs.abnormalBlockGameInfo.getBlockListById(this.state.block);
var e = 0;
this.state.posList.forEach(function(o, n) {
var r = t.node.children[n];
if (!r) {
r = cc.instantiate(t.aniNode);
t.node.addChild(r);
}
r.opacity = 255;
var i = t.node.convertToNodeSpaceAR(o);
r.setPosition(i.x, i.y);
var c = r.getComponent(dragonBones.ArmatureDisplay);
c.playAnimation("in", 1);
c.off(dragonBones.EventObject.COMPLETE);
c.on(dragonBones.EventObject.COMPLETE, function() {
r && cc.isValid(r) && (r.opacity = 0);
});
e++;
});
for (var o = e; o < this.node.children.length; o++) this.node.children[o] && (this.node.children[o].opacity = 0);
};
i([ f(cc.Node) ], e.prototype, "aniNode", void 0);
return i([ a ], e);
}(hs.Component);
o.default = s;
cc._RF.pop();
}, {} ],
IsOpenEliminateSpecialEffectTrait: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "043dbglgKNP9q7C0jYrnJLF", "IsOpenEliminateSpecialEffectTrait");
var n, r = this && this.__extends || (n = function(t, e) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
n(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), i = this && this.__decorate || function(t, e, o, n) {
var r, i = arguments.length, c = i < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, o, n); else for (var a = t.length - 1; a >= 0; a--) (r = t[a]) && (c = (i < 3 ? r(c) : i > 3 ? r(e, o, c) : r(e, o)) || c);
return i > 3 && c && Object.defineProperty(e, o, c), c;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.IsOpenEliminateSpecialEffectTrait = void 0;
var c = t("./EliminateSpecialEffect"), a = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._effectNode = null;
return e;
}
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "Eliminate_Effects_Proxy",
methodName: "onBlockProducerTouchEnd"
} ];
};
e.prototype.onActive = function(t) {
if (hs.tp.isEliminate_Effects_ProxyOnBlockProducerTouchEnd(t)) {
var e = t.args[0];
this.showEffect(e.state);
}
};
e.prototype.showEffect = function(t) {
var e = this;
if (!(t.eliminateCount < 3)) {
var o = this.getPosList(t.putPosOriginal, t.putPosition);
this._effectNode ? this._effectNode.getComponent(c.default).setState({
block: t.touchBlockId,
posList: o
}) : hs.ResLoader.loadByBundle("IsOpenEliminateSpecialEffectTrait", "prefabs/eliminateSpecialEffect", cc.Prefab, function(n, r) {
if (!n) {
e._effectNode = cc.instantiate(r);
var i = Cinst(hs.Board);
if (i && i.boardGrid && cc.isValid(i.boardGrid)) {
i.boardGrid.addChild(e._effectNode);
e._effectNode.getComponent(c.default).setState({
block: t.touchBlockId,
posList: o
});
}
}
});
}
};
e.prototype.getPosList = function(t, e) {
for (var o = t.slice(), n = o.length - 1; n >= 0; n--) {
var r = o[n];
this.findPos(e, r) && o.splice(n, 1);
}
return o;
};
e.prototype.findPos = function(t, e) {
for (var o = 0; o < t.length; o++) {
var n = t[o];
if (Math.abs(n.x - e.x) < 5 && Math.abs(n.y - e.y) < 5) return !0;
}
return !1;
};
return i([ classId("IsOpenEliminateSpecialEffectTrait") ], e);
}(Trait);
o.IsOpenEliminateSpecialEffectTrait = a;
cc._RF.pop();
}, {
"./EliminateSpecialEffect": "EliminateSpecialEffect"
} ]
}, {}, [ "EliminateSpecialEffect", "IsOpenEliminateSpecialEffectTrait" ]);
//# sourceMappingURL=index.js.map
