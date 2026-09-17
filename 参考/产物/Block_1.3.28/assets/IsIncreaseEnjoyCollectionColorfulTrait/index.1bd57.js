window.__require = function t(e, o, n) {
function r(s, a) {
if (!o[s]) {
if (!e[s]) {
var c = s.split("/");
c = c[c.length - 1];
if (!e[c]) {
var l = "function" == typeof __require && __require;
if (!a && l) return l(c, !0);
if (i) return i(c, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = c;
}
var u = o[s] = {
exports: {}
};
e[s][0].call(u.exports, function(t) {
return r(e[s][1][t] || t);
}, u, u.exports, t, e, o, n);
}
return o[s].exports;
}
for (var i = "function" == typeof __require && __require, s = 0; s < n.length; s++) r(n[s]);
return r;
}({
IsIncreaseEnjoyCollectionColorfulNode: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "c660fxwifJG6Y0esvcqmBLZ", "IsIncreaseEnjoyCollectionColorfulNode");
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
var r, i = arguments.length, s = i < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, o, n); else for (var a = t.length - 1; a >= 0; a--) (r = t[a]) && (s = (i < 3 ? r(s) : i > 3 ? r(e, o, s) : r(e, o)) || s);
return i > 3 && s && Object.defineProperty(e, o, s), s;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var s = cc._decorator, a = s.ccclass, c = s.property, l = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.colorfurNode = null;
e.dragon = null;
return e;
}
e.prototype.render = function() {
if (this.state.coordinate) {
var t = this.state.coordinate, e = t.x, o = t.y, n = hs.OFFSETX - hs.BOARD_CONTAINER_HALF_WIDTH + hs.BLOCK_HALF_SIZE + hs.BLOCK_SIZE * o - 1, r = hs.OFFSETY + hs.BOARD_CONTAINER_HALF_HEIGHT - hs.BLOCK_HALF_SIZE - hs.BLOCK_SIZE * e + 4;
this.node.setPosition(n, r);
this.playColorfulAnimation();
}
};
e.prototype.playColorfulAnimation = function() {
this.dragon.playAnimation("in", 1);
this.dragon.addEventListener(dragonBones.EventObject.COMPLETE, this.onInAnimationComplete, this);
};
e.prototype.onInAnimationComplete = function() {
if (cc.isValid(this.node)) {
this.dragon.removeEventListener(dragonBones.EventObject.COMPLETE, this.onInAnimationComplete, this);
this.dragon.playAnimation("loop", 0);
}
};
i([ c(cc.Node) ], e.prototype, "colorfurNode", void 0);
i([ c(dragonBones.ArmatureDisplay) ], e.prototype, "dragon", void 0);
return i([ a ], e);
}(hs.Component);
o.default = l;
cc._RF.pop();
}, {} ],
IsIncreaseEnjoyCollectionColorfulTrait: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "bcd2fv8bx9ME44enZUjPYgX", "IsIncreaseEnjoyCollectionColorfulTrait");
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
var r, i = arguments.length, s = i < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, o, n); else for (var a = t.length - 1; a >= 0; a--) (r = t[a]) && (s = (i < 3 ? r(s) : i > 3 ? r(e, o, s) : r(e, o)) || s);
return i > 3 && s && Object.defineProperty(e, o, s), s;
}, s = this && this.__awaiter || function(t, e, o, n) {
return new (o || (o = Promise))(function(r, i) {
function s(t) {
try {
c(n.next(t));
} catch (t) {
i(t);
}
}
function a(t) {
try {
c(n.throw(t));
} catch (t) {
i(t);
}
}
function c(t) {
t.done ? r(t.value) : (e = t.value, e instanceof o ? e : new o(function(t) {
t(e);
})).then(s, a);
var e;
}
c((n = n.apply(t, e || [])).next());
});
}, a = this && this.__generator || function(t, e) {
var o, n, r, i, s = {
label: 0,
sent: function() {
if (1 & r[0]) throw r[1];
return r[1];
},
trys: [],
ops: []
};
return i = {
next: a(0),
throw: a(1),
return: a(2)
}, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
return this;
}), i;
function a(t) {
return function(e) {
return c([ t, e ]);
};
}
function c(i) {
if (o) throw new TypeError("Generator is already executing.");
for (;s; ) try {
if (o = 1, n && (r = 2 & i[0] ? n.return : i[0] ? n.throw || ((r = n.return) && r.call(n), 
0) : n.next) && !(r = r.call(n, i[1])).done) return r;
(n = 0, r) && (i = [ 2 & i[0], r.value ]);
switch (i[0]) {
case 0:
case 1:
r = i;
break;

case 4:
s.label++;
return {
value: i[1],
done: !1
};

case 5:
s.label++;
n = i[1];
i = [ 0 ];
continue;

case 7:
i = s.ops.pop();
s.trys.pop();
continue;

default:
if (!(r = s.trys, r = r.length > 0 && r[r.length - 1]) && (6 === i[0] || 2 === i[0])) {
s = 0;
continue;
}
if (3 === i[0] && (!r || i[1] > r[0] && i[1] < r[3])) {
s.label = i[1];
break;
}
if (6 === i[0] && s.label < r[1]) {
s.label = r[1];
r = i;
break;
}
if (r && s.label < r[2]) {
s.label = r[2];
s.ops.push(i);
break;
}
r[2] && s.ops.pop();
s.trys.pop();
continue;
}
i = e.call(t, s);
} catch (t) {
i = [ 6, t ];
n = 0;
} finally {
o = r = 0;
}
if (5 & i[0]) throw i[1];
return {
value: i[0] ? i[1] : void 0,
done: !0
};
}
}, c = this && this.__read || function(t, e) {
var o = "function" == typeof Symbol && t[Symbol.iterator];
if (!o) return t;
var n, r, i = o.call(t), s = [];
try {
for (;(void 0 === e || e-- > 0) && !(n = i.next()).done; ) s.push(n.value);
} catch (t) {
r = {
error: t
};
} finally {
try {
n && !n.done && (o = i.return) && o.call(i);
} finally {
if (r) throw r.error;
}
}
return s;
}, l = this && this.__spread || function() {
for (var t = [], e = 0; e < arguments.length; e++) t = t.concat(c(arguments[e]));
return t;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.IsIncreaseEnjoyCollectionColorfulTrait = void 0;
var u = t("./IsIncreaseEnjoyCollectionColorfulNode"), f = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.cachedPrefab = null;
return e;
}
e.prototype.data = function() {
return {
parentNode: null,
colorfulNodes: []
};
};
e.prototype.onActive = function(t) {
var e, o, n;
return s(this, void 0, void 0, function() {
var r, i, s;
return a(this, function(a) {
switch (a.label) {
case 0:
return hs.chapterConfigInfo && hs.chapterConfigInfo.getChapterCurData() && (null === (e = hs.chapterConfigInfo.getChapterCurData()) || void 0 === e ? void 0 : e.Condition.Way) == hs.ChapterType.collect ? hs.tp.isChapterGame_ProxyOnShowBoardFinished(t) ? [ 4, this.preLoad() ] : [ 3, 2 ] : [ 2 ];

case 1:
a.sent();
a.label = 2;

case 2:
(hs.tp.isChapterCollect_ProxyOnTouchAnyEnd(t) || hs.tp.isChapterGame_ProxyOnShowBoardFinished(t)) && this.checkAndShowColorfulLight();
if (hs.tp.isChapterCollect_ProxyOnTouchMoved(t) && (null === (n = null === (o = t.args) || void 0 === o ? void 0 : o[0]) || void 0 === n ? void 0 : n.state)) {
r = t.args[0].state, i = r.rowsEffect, s = r.colsEffect;
(i && Object.keys(i).length > 0 || s && Object.keys(s).length > 0) && this.hideColorfulNodes();
}
(hs.tp.isChapterCollect_ProxyOnChapterGameEnd(t) || hs.tp.isChapterCollect_ProxyOnChapterSceneClose(t)) && this.clearColorfulNodes();
return [ 2 ];
}
});
});
};
e.prototype.onDisable = function() {
this.clearColorfulNodes();
if (this.state.parentNode && cc.isValid(this.state.parentNode)) {
this.state.parentNode.destroy();
this.state.parentNode = null;
}
this.cachedPrefab = null;
};
e.prototype.preLoad = function() {
return s(this, void 0, Promise, function() {
var t;
return a(this, function(e) {
switch (e.label) {
case 0:
if (this.cachedPrefab) return [ 2 ];
e.label = 1;

case 1:
e.trys.push([ 1, 3, , 4 ]);
return [ 4, hs.ResLoader.asyncLoadByBundle("IsIncreaseEnjoyCollectionColorfulTrait", "prefabs/chapterCollectionColorfulNode", cc.Prefab) ];

case 2:
t = e.sent();
this.cachedPrefab = t;
return [ 3, 4 ];

case 3:
e.sent();
return [ 3, 4 ];

case 4:
return [ 2 ];
}
});
});
};
e.prototype.checkAndShowColorfulLight = function() {
var t = this.findPileUpRowsAndCols();
0 !== t.emptyPositions.length && this.showColorfulLight(t);
};
e.prototype.canCollect = function(t) {
return t > 100 && t < 1e3;
};
e.prototype.getOrCreateParentNode = function() {
if (cc.isValid(this.state.parentNode)) return this.state.parentNode;
var t = Cinst(hs.Board);
if (!t) return null;
var e = new cc.Node("ColorfulLightParent");
t.node.addChild(e);
if (cc.isValid(t.blocks)) {
var o = t.blocks.zIndex || 0;
e.zIndex = o + 1;
}
e.opacity = 255;
this.state.parentNode = e;
return e;
};
e.prototype.clearColorfulNodes = function() {
this.state.colorfulNodes.forEach(function(t) {
cc.isValid(t.node) && t.node.destroy();
});
this.state.colorfulNodes = [];
};
e.prototype.hideColorfulNodes = function() {
cc.isValid(this.state.parentNode) && (this.state.parentNode.opacity = 0);
};
e.prototype.showColorfulNodes = function() {
cc.isValid(this.state.parentNode) && (this.state.parentNode.opacity = 255);
};
e.prototype.createColorfulNodes = function(t) {
var e = this, o = this.getOrCreateParentNode();
if (cc.isValid(o)) {
var n = new Set(t.map(function(t) {
return t.x + "_" + t.y;
})), r = l(this.state.colorfulNodes), i = [];
r.forEach(function(t, e) {
if (t && t.state && t.state.coordinate) {
var o = t.state.coordinate.x + "_" + t.state.coordinate.y;
if (!n.has(o)) {
t.node && cc.isValid(t.node) && t.node.destroy();
i.push(e);
}
} else {
t && t.node && cc.isValid(t.node) && t.node.destroy();
i.push(e);
}
});
i.reverse().forEach(function(t) {
e.state.colorfulNodes.splice(t, 1);
});
var s = new Set();
this.state.colorfulNodes.forEach(function(t) {
t && t.state && t.state.coordinate && s.add(t.state.coordinate.x + "_" + t.state.coordinate.y);
});
var a = t.filter(function(t) {
return !s.has(t.x + "_" + t.y);
});
if (0 !== a.length) try {
if (!this.cachedPrefab) {
this.preLoad();
return;
}
a.forEach(function(t) {
var n = cc.instantiate(e.cachedPrefab);
n.name = "ColorfulNode_" + t.x + "_" + t.y;
o.addChild(n);
var r = n.getComponent(u.default);
if (r) {
r.setState({
coordinate: {
x: t.x,
y: t.y
}
});
e.state.colorfulNodes.push(r);
} else n.destroy();
});
} catch (t) {}
}
};
e.prototype.findPileUpRowsAndCols = function() {
for (var t, e = hs.boardInfo.faceBlocks, o = {
emptyPositions: [],
collectPositions: []
}, n = 0; n < 8; n++) {
for (var r = null, i = 0, s = [], a = 0; a < 8; a++) if (e[n][a] < 0) {
if (null !== r) {
r = null;
break;
}
r = {
x: n,
y: a
};
} else if (this.canCollect(e[n][a])) {
i++;
s.push({
x: n,
y: a
});
}
if (r && i >= 3) {
o.emptyPositions.push(r);
(t = o.collectPositions).push.apply(t, l(s));
}
}
var c = function(t) {
for (var n = null, r = 0, i = [], s = 0; s < 8; s++) if (e[s][t] < 0) {
if (null !== n) {
n = null;
break;
}
n = {
x: s,
y: t
};
} else if (u.canCollect(e[s][t])) {
r++;
i.push({
x: s,
y: t
});
}
if (n && r >= 3) {
o.emptyPositions.find(function(t) {
return t.x === n.x && t.y === n.y;
}) || o.emptyPositions.push(n);
i.forEach(function(t) {
o.collectPositions.find(function(e) {
return e.x === t.x && e.y === t.y;
}) || o.collectPositions.push(t);
});
}
}, u = this;
for (a = 0; a < 8; a++) c(a);
return o;
};
e.prototype.showColorfulLight = function(t) {
var e = l(t.emptyPositions, t.collectPositions);
this.createColorfulNodes(e);
this.showColorfulNodes();
};
return i([ classId("IsIncreaseEnjoyCollectionColorfulTrait") ], e);
}(Trait);
o.IsIncreaseEnjoyCollectionColorfulTrait = f;
cc._RF.pop();
}, {
"./IsIncreaseEnjoyCollectionColorfulNode": "IsIncreaseEnjoyCollectionColorfulNode"
} ]
}, {}, [ "IsIncreaseEnjoyCollectionColorfulNode", "IsIncreaseEnjoyCollectionColorfulTrait" ]);
//# sourceMappingURL=index.js.map
