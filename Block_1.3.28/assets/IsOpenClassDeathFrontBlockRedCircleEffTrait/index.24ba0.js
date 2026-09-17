window.__require = function e(t, o, r) {
function n(i, a) {
if (!o[i]) {
if (!t[i]) {
var f = i.split("/");
f = f[f.length - 1];
if (!t[f]) {
var l = "function" == typeof __require && __require;
if (!a && l) return l(f, !0);
if (c) return c(f, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = f;
}
var s = o[i] = {
exports: {}
};
t[i][0].call(s.exports, function(e) {
return n(t[i][1][e] || e);
}, s, s.exports, e, t, o, r);
}
return o[i].exports;
}
for (var c = "function" == typeof __require && __require, i = 0; i < r.length; i++) n(r[i]);
return n;
}({
BlocksProducerRedCircleEffectInfo: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "347f0bL+vZFh46u+1AIUEuU", "BlocksProducerRedCircleEffectInfo");
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
}), c = this && this.__decorate || function(e, t, o, r) {
var n, c = arguments.length, i = c < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(e, t, o, r); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (i = (c < 3 ? n(i) : c > 3 ? n(t, o, i) : n(t, o)) || i);
return c > 3 && i && Object.defineProperty(t, o, i), i;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = cc._decorator, a = i.ccclass, f = i.property, l = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.blockItem = null;
t.itemNode = null;
return t;
}
t.prototype.render = function() {
var e = this, t = 0;
this.state.info.forEach(function(o) {
var r = [];
o.id >= hs.BlocksProducerType.ID1 && o.id < hs.BlocksProducerType.AllCountOfBlock ? r = hs.blockPosInfo[o.id - 1] : hs.blocksProducerInfo.checkAbnormalBlock(o.id) && (r = hs.abnormalBlockGameInfo.getBlockListById(o.id));
if (r.length > 0) {
var n = e.node.children[t];
if (!n) {
n = cc.instantiate(e.itemNode);
e.node.addChild(n);
}
n.position = o.pos;
e.showOne(n, r);
t++;
}
});
for (var o = t; o < this.node.children.length; o++) {
var r = this.node.children[o];
r && r.active && cc.isValid(r) && (r.opacity = 0);
}
};
t.prototype.showOne = function(e, t) {
var o, r, n, c, i = 0;
e.opacity = 0;
e.stopAllActions();
for (var a = 0; a < t.length; a++) for (var f = 0; f < t[a].length; f++) if (1 === t[a][f]) {
var l = -(t[a].length - 1) * hs.BLOCK_HALF_SIZE + f * hs.BLOCK_SIZE, s = (t.length - 1) * hs.BLOCK_HALF_SIZE - a * hs.BLOCK_SIZE, d = 1 === (null === (o = t[a]) || void 0 === o ? void 0 : o[f - 1]), u = 1 === (null === (r = t[a]) || void 0 === r ? void 0 : r[f + 1]), p = 1 === (null === (n = t[a - 1]) || void 0 === n ? void 0 : n[f]), h = 1 === (null === (c = t[a + 1]) || void 0 === c ? void 0 : c[f]);
if (!(P = e.children[i])) {
P = cc.instantiate(this.blockItem);
e.addChild(P);
}
var v = P.getChildByName("left"), y = P.getChildByName("right"), _ = P.getChildByName("top"), C = P.getChildByName("bot");
v && (v.active = !d);
y && (y.active = !u);
_ && (_.active = !p);
C && (C.active = !h);
_.active = !p;
C.active = !h;
P.opacity = 255;
P.position = cc.v3(l, s);
i++;
}
for (var B = i; B < e.children.length; B++) {
var P;
(P = e.children[B]) && P.active && cc.isValid(P) && (P.opacity = 0);
}
cc.tween(e).to(1, {
opacity: 255
}).to(1, {
opacity: 0
}).call(function() {
e && cc.isValid(e) && (e.opacity = 0);
}).start();
};
c([ f(cc.Node) ], t.prototype, "blockItem", void 0);
c([ f(cc.Node) ], t.prototype, "itemNode", void 0);
return c([ a ], t);
}(hs.Component);
o.default = l;
cc._RF.pop();
}, {} ],
IsOpenClassDeathFrontBlockRedCircleEffTrait: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "47922yvuydLAJmcCSki4cB9", "IsOpenClassDeathFrontBlockRedCircleEffTrait");
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
}), c = this && this.__decorate || function(e, t, o, r) {
var n, c = arguments.length, i = c < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(e, t, o, r); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (i = (c < 3 ? n(i) : c > 3 ? n(t, o, i) : n(t, o)) || i);
return c > 3 && i && Object.defineProperty(t, o, i), i;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.IsOpenClassDeathFrontBlockRedCircleEffTrait = void 0;
var i = e("./BlocksProducerRedCircleEffectInfo"), a = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.effPrefab = null;
t.effNode = null;
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassDefaultBoard_Proxy",
methodName: "onProduceClassDefaultBoard"
} ];
};
t.prototype.onCreate = function() {
this.preLoadRes();
};
t.prototype.onActive = function(e) {
if (hs.tp.isClassGameOver_GameEndPre_ProxyOnGameEndPre(e) && this.effPrefab) {
var t = hs.boardInfo.faceBlocks, o = hs.blocksProducerInfo.producerBlocks, r = this.getNotPutBlockIds(t, o);
if (0 === r.length) return;
var n = Cinst(hs.BlocksProducer), c = [];
if (n) {
n.blocksContainer.children.forEach(function(e) {
if (e && e.active && 255 === e.opacity) {
var t = e.getComponent(hs.BlocksProducerItem);
r.find(function(e) {
return e === t.state.id;
}) && c.push({
pos: e.position,
id: t.state.id
});
}
});
var a = this.effNode;
if (!a) {
a = cc.instantiate(this.effPrefab);
this.effNode = a;
n.node.addChild(a);
a.name = "Remote_BlockRedCircleEff";
}
a.active = !0;
a.getComponent(i.default).setState({
info: c
});
}
e.replace = !0;
setTimeoutSafe(function() {
e.originalCaller();
}, 1500);
}
hs.tp.isClassDefaultBoard_ProxyOnProduceClassDefaultBoard(e) && this.effNode && (this.effNode.active = !1);
};
t.prototype.preLoadRes = function() {
var e = this;
hs.ResLoader.loadByBundle("IsOpenClassDeathFrontBlockRedCircleEffTrait", "prefabs/gameOverBlockRedCircleEff", cc.Prefab, function(t, o) {
t || (e.effPrefab = o);
});
};
t.prototype.getNotPutBlockIds = function(e, t) {
var o = [], r = new hs.BinaryBoard();
r.convertToBinaryBoard(e);
t.forEach(function(e) {
-1 === e || r.canPut(e) || o.push(e);
});
return o;
};
return c([ classId("IsOpenClassDeathFrontBlockRedCircleEffTrait") ], t);
}(Trait);
o.IsOpenClassDeathFrontBlockRedCircleEffTrait = a;
cc._RF.pop();
}, {
"./BlocksProducerRedCircleEffectInfo": "BlocksProducerRedCircleEffectInfo"
} ]
}, {}, [ "BlocksProducerRedCircleEffectInfo", "IsOpenClassDeathFrontBlockRedCircleEffTrait" ]);
//# sourceMappingURL=index.js.map
