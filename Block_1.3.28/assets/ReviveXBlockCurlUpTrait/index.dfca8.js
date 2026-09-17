window.__require = function e(t, r, n) {
function i(a, s) {
if (!r[a]) {
if (!t[a]) {
var l = a.split("/");
l = l[l.length - 1];
if (!t[l]) {
var c = "function" == typeof __require && __require;
if (!s && c) return c(l, !0);
if (o) return o(l, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = l;
}
var u = r[a] = {
exports: {}
};
t[a][0].call(u.exports, function(e) {
return i(t[a][1][e] || e);
}, u, u.exports, e, t, r, n);
}
return r[a].exports;
}
for (var o = "function" == typeof __require && __require, a = 0; a < n.length; a++) i(n[a]);
return i;
}({
ReviveXBlockCurlUpTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "a3f6auiVzlOba9TKopUzdRw", "ReviveXBlockCurlUpTrait");
var n, i = this && this.__extends || (n = function(e, t) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
n(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), o = this && this.__decorate || function(e, t, r, n) {
var i, o = arguments.length, a = o < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, r) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, n); else for (var s = e.length - 1; s >= 0; s--) (i = e[s]) && (a = (o < 3 ? i(a) : o > 3 ? i(t, r, a) : i(t, r)) || a);
return o > 3 && a && Object.defineProperty(t, r, a), a;
}, a = this && this.__awaiter || function(e, t, r, n) {
return new (r || (r = Promise))(function(i, o) {
function a(e) {
try {
l(n.next(e));
} catch (e) {
o(e);
}
}
function s(e) {
try {
l(n.throw(e));
} catch (e) {
o(e);
}
}
function l(e) {
e.done ? i(e.value) : (t = e.value, t instanceof r ? t : new r(function(e) {
e(t);
})).then(a, s);
var t;
}
l((n = n.apply(e, t || [])).next());
});
}, s = this && this.__generator || function(e, t) {
var r, n, i, o, a = {
label: 0,
sent: function() {
if (1 & i[0]) throw i[1];
return i[1];
},
trys: [],
ops: []
};
return o = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (o[Symbol.iterator] = function() {
return this;
}), o;
function s(e) {
return function(t) {
return l([ e, t ]);
};
}
function l(o) {
if (r) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (r = 1, n && (i = 2 & o[0] ? n.return : o[0] ? n.throw || ((i = n.return) && i.call(n), 
0) : n.next) && !(i = i.call(n, o[1])).done) return i;
(n = 0, i) && (o = [ 2 & o[0], i.value ]);
switch (o[0]) {
case 0:
case 1:
i = o;
break;

case 4:
a.label++;
return {
value: o[1],
done: !1
};

case 5:
a.label++;
n = o[1];
o = [ 0 ];
continue;

case 7:
o = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(i = a.trys, i = i.length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
a = 0;
continue;
}
if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
a.label = o[1];
break;
}
if (6 === o[0] && a.label < i[1]) {
a.label = i[1];
i = o;
break;
}
if (i && a.label < i[2]) {
a.label = i[2];
a.ops.push(o);
break;
}
i[2] && a.ops.pop();
a.trys.pop();
continue;
}
o = t.call(e, a);
} catch (e) {
o = [ 6, e ];
n = 0;
} finally {
r = i = 0;
}
if (5 & o[0]) throw o[1];
return {
value: o[0] ? o[1] : void 0,
done: !0
};
}
}, l = this && this.__read || function(e, t) {
var r = "function" == typeof Symbol && e[Symbol.iterator];
if (!r) return e;
var n, i, o = r.call(e), a = [];
try {
for (;(void 0 === t || t-- > 0) && !(n = o.next()).done; ) a.push(n.value);
} catch (e) {
i = {
error: e
};
} finally {
try {
n && !n.done && (r = o.return) && r.call(o);
} finally {
if (i) throw i.error;
}
}
return a;
}, c = this && this.__spread || function() {
for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(l(arguments[t]));
return e;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ReviveXBlockCurlUpTrait = void 0;
var u = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._mRealPos = new Map();
t._mChaosPos = new Map();
return t;
}
t.prototype.onCreate = function() {
this._reviveX = new cc.Node("reviveX");
this._reviveX.setContentSize(195, 234);
this._reviveX.addComponent(cc.Button);
this._reviveX.on("click", this.onClickX, this);
this.loadReviveX();
};
t.prototype.onActive = function(e) {
var t, r, n;
(hs.tp.isClassGame_ProxyOnClassGameStart(e) || hs.tp.isChapterGame_ProxyOnChapterGameShow(e)) && this.deletePropKey();
if (hs.tp.isClassBlocksProducer_ProxyRenderUpdate(e) || hs.tp.isChapterBlocksProducer_ProxyRenderUpdate(e)) {
var i = e.args[0].strategyState;
this._strategyType = i;
}
if (hs.tp.isRevivePlayNumBoneAni(e)) {
var o = Cinst(hs.Revive), a = this.isFirstTriggerRevive();
o.num.active = a;
o.progress.node.active = a;
if (a) this._reviveX.parent = null; else {
this._reviveX.parent = o.progress.node.parent;
this._reviveX.setPosition(o.progress.node.position);
e.replace = !0;
}
}
hs.tp.isReviveUpdateSprNum(e) && (this.isFirstTriggerRevive() || (e.replace = !0));
if (hs.tp.isBlocksProducerItemCalculateBlockPosition(e)) {
if (this.isFirstTriggerRevive()) return;
var s = e.target, l = e.args[0], c = e.args[1], u = e.args[2];
if (this._strategyType === hs.ALGO_STRATEGY_TYPE.REVIVE && (l.length > 1 || (null === (t = l[0]) || void 0 === t ? void 0 : t.length) > 1)) {
if (0 == c) {
var h = l[0].findIndex(function(e) {
return !!e;
});
if (h == u) {
var p = this.caclPosition(l), f = p.realPos, v = p.chaosPos;
this._mRealPos.set(s, f);
this._mChaosPos.set(s, v);
}
if (u < h) return;
}
var d = this._mChaosPos.get(s);
if (null === (r = null == d ? void 0 : d[c]) || void 0 === r ? void 0 : r[u]) {
e.replace = !0;
e.returnValue = d[c][u];
}
}
}
if (hs.tp.isBlocksProducer_ProxyOnTouchStart(e)) {
s = null === (n = e.args[0]) || void 0 === n ? void 0 : n.target;
var y = this._mRealPos.get(s);
if (cc.isValid(s) && y) {
f = y.flat().filter(function(e) {
return null !== e;
});
this._mRealPos.delete(s);
for (var _ = 0; _ < s.node.children.length; _++) {
var g = s.node.children[_];
if (g.opacity > 0 && f[_]) {
g.x = f[_].x;
g.y = f[_].y;
}
}
}
}
};
t.prototype.loadReviveX = function() {
return a(this, void 0, void 0, function() {
var e, t, r;
return s(this, function(n) {
switch (n.label) {
case 0:
if (this._reviveX.children.length > 0) return [ 2 ];
n.label = 1;

case 1:
n.trys.push([ 1, 3, , 4 ]);
return [ 4, hs.ResLoader.asyncLoadByBundle(this.traitName, "prefabs/reviveX", cc.Prefab) ];

case 2:
e = n.sent();
t = cc.instantiate(e);
(r = t.getComponentInChildren(cc.Animation)) && (r.defaultClip.speed = 1 / (cc.director._kSpeed || 1));
this._reviveX.addChild(t);
return [ 3, 4 ];

case 3:
n.sent();
return [ 2 ];

case 4:
return [ 2 ];
}
});
});
};
t.prototype.onClickX = function() {
Cinst(hs.Revive).setState({
closeRevive: !0
});
};
t.prototype.caclPosition = function(e) {
for (var t = Math.max.apply(Math, c(e.map(function(e) {
return e.length;
}))), r = Array.from({
length: e.length
}, function() {
return new Array(t).fill(null);
}), n = Array.from({
length: e.length
}, function() {
return new Array(t).fill(null);
}), i = 0, o = 0; o < e.length; o++) for (var a = 0; a < e[o].length; a++) if (1 === e[o][a]) {
var s = -(e[o].length - 1) * hs.BLOCK_HALF_SIZE + a * hs.BLOCK_SIZE, l = (e.length - 1) * hs.BLOCK_HALF_SIZE - o * hs.BLOCK_SIZE;
r[o][a] = {
x: s,
y: l
};
if (0 === i) n[o][a] = {
x: 0,
y: 0
}; else {
s = (20 * Math.random() + 20) * (Math.random() < .5 ? -1 : 1);
l = (20 * Math.random() + 20) * (Math.random() < .5 ? -1 : 1);
n[o][a] = {
x: s,
y: l
};
}
i++;
}
return {
realPos: r,
chaosPos: n
};
};
t.prototype.isFirstTriggerRevive = function() {
return hs.gameInfo.gameType == hs.GameType.Class ? storage.getItem("classActualReviveNum", 0) <= 1 : hs.gameInfo.gameType == hs.GameType.Chapter && storage.getItem("chapterActualReviveNum", 0) <= 1;
};
t.prototype.deletePropKey = function() {
this._mRealPos.clear();
this._mChaosPos.clear();
};
return o([ classId("ReviveXBlockCurlUpTrait") ], t);
}(Trait);
r.ReviveXBlockCurlUpTrait = u;
cc._RF.pop();
}, {} ]
}, {}, [ "ReviveXBlockCurlUpTrait" ]);
//# sourceMappingURL=index.js.map
