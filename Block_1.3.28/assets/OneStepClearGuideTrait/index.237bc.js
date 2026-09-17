window.__require = function e(t, o, n) {
function i(s, a) {
if (!o[s]) {
if (!t[s]) {
var c = s.split("/");
c = c[c.length - 1];
if (!t[c]) {
var u = "function" == typeof __require && __require;
if (!a && u) return u(c, !0);
if (r) return r(c, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = c;
}
var l = o[s] = {
exports: {}
};
t[s][0].call(l.exports, function(e) {
return i(t[s][1][e] || e);
}, l, l.exports, e, t, o, n);
}
return o[s].exports;
}
for (var r = "function" == typeof __require && __require, s = 0; s < n.length; s++) i(n[s]);
return i;
}({
OneStepClearGuideComponent: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "71b34r6hpFMk5d79c/SGuSH", "OneStepClearGuideComponent");
var n, i = this && this.__extends || (n = function(e, t) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
})(e, t);
}, function(e, t) {
n(e, t);
function o() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
}), r = this && this.__decorate || function(e, t, o, n) {
var i, r = arguments.length, s = r < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, o, n); else for (var a = e.length - 1; a >= 0; a--) (i = e[a]) && (s = (r < 3 ? i(s) : r > 3 ? i(t, o, s) : i(t, o)) || s);
return r > 3 && s && Object.defineProperty(t, o, s), s;
}, s = this && this.__awaiter || function(e, t, o, n) {
return new (o || (o = Promise))(function(i, r) {
function s(e) {
try {
c(n.next(e));
} catch (e) {
r(e);
}
}
function a(e) {
try {
c(n.throw(e));
} catch (e) {
r(e);
}
}
function c(e) {
e.done ? i(e.value) : (t = e.value, t instanceof o ? t : new o(function(e) {
e(t);
})).then(s, a);
var t;
}
c((n = n.apply(e, t || [])).next());
});
}, a = this && this.__generator || function(e, t) {
var o, n, i, r, s = {
label: 0,
sent: function() {
if (1 & i[0]) throw i[1];
return i[1];
},
trys: [],
ops: []
};
return r = {
next: a(0),
throw: a(1),
return: a(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function a(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(r) {
if (o) throw new TypeError("Generator is already executing.");
for (;s; ) try {
if (o = 1, n && (i = 2 & r[0] ? n.return : r[0] ? n.throw || ((i = n.return) && i.call(n), 
0) : n.next) && !(i = i.call(n, r[1])).done) return i;
(n = 0, i) && (r = [ 2 & r[0], i.value ]);
switch (r[0]) {
case 0:
case 1:
i = r;
break;

case 4:
s.label++;
return {
value: r[1],
done: !1
};

case 5:
s.label++;
n = r[1];
r = [ 0 ];
continue;

case 7:
r = s.ops.pop();
s.trys.pop();
continue;

default:
if (!(i = s.trys, i = i.length > 0 && i[i.length - 1]) && (6 === r[0] || 2 === r[0])) {
s = 0;
continue;
}
if (3 === r[0] && (!i || r[1] > i[0] && r[1] < i[3])) {
s.label = r[1];
break;
}
if (6 === r[0] && s.label < i[1]) {
s.label = i[1];
i = r;
break;
}
if (i && s.label < i[2]) {
s.label = i[2];
s.ops.push(r);
break;
}
i[2] && s.ops.pop();
s.trys.pop();
continue;
}
r = t.call(e, s);
} catch (e) {
r = [ 6, e ];
n = 0;
} finally {
o = i = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var c = cc._decorator, u = c.ccclass, l = (c.property, function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.blocks = null;
t.dark = null;
t.moveContainer = null;
t.boardEffectNode = null;
t.blockList = [];
return t;
}
t.prototype.onLoad = function() {
this.moveContainer = this.node.getChildByName("moveContainer");
this.blocks = this.moveContainer.getChildByName("blocks");
this.dark = this.node.getChildByName("dark");
this.loadEffect();
};
t.prototype.render = function() {
var e = this.state, t = e.showDarkMask, o = e.showAnimation;
this.dark.active = t;
o ? this.showGuide() : this.hideGuide();
this.state.showGuideEffect ? this.showGuideEffect() : this.hideGuideEffect();
};
t.prototype.loadEffect = function() {
return s(this, void 0, void 0, function() {
var e;
return a(this, function(t) {
switch (t.label) {
case 0:
t.trys.push([ 0, 2, , 3 ]);
return [ 4, hs.ResLoader.asyncLoadByBundle("OneStepClearGuideTrait", "prefabs/guideEffect", cc.Prefab) ];

case 1:
if (!(e = t.sent()) || !cc.isValid(this.node)) return [ 2 ];
this.boardEffectNode = cc.instantiate(e);
this.state.showGuideEffect && cc.isValid(this.node) && this.node.activeInHierarchy && this.showGuideEffect();
return [ 3, 3 ];

case 2:
t.sent();
return [ 3, 3 ];

case 3:
return [ 2 ];
}
});
});
};
t.prototype.showGuide = function() {
this.node.opacity = 255;
this.blocks.opacity = 120;
this.moveContainer.stopAllActions();
this.moveContainer.opacity = 255;
this.moveBlocks();
};
t.prototype.moveBlocks = function() {
this.createBlocks(this.state.blockId, this.state.blockColor);
var e = Math.min(3, cc.Vec2.distance(this.state.startPos, this.state.endPos) / 200), t = cc.tween(this.moveContainer).set({
x: this.state.startPos.x,
y: this.state.startPos.y
}).to(e, {
x: this.state.endPos.x,
y: this.state.endPos.y
}, {
easing: cc.easing.circOut
}).delay(.2);
cc.tween(this.moveContainer).repeatForever(t).start();
};
t.prototype.hideGuide = function() {
this.moveContainer.stopAllActions();
this.moveContainer.opacity = 0;
};
t.prototype.showGuideEffect = function() {
if (cc.isValid(this.boardEffectNode)) {
this.boardEffectNode.setPosition(this.state.endPos);
this.boardEffectNode.parent != this.node && this.node.addChild(this.boardEffectNode);
this.boardEffectNode.setSiblingIndex(this.node.children.length - 2);
}
};
t.prototype.hideGuideEffect = function() {
cc.isValid(this.boardEffectNode) && this.boardEffectNode.removeFromParent();
};
t.prototype.createBlocks = function(e, t) {
var o = this, n = hs.blockPosInfo[e - 1];
if (n) {
var i = n.reduce(function(e, t) {
return e + t.filter(function(e) {
return 1 === e;
}).length;
}, 0);
this.blockList.forEach(function(e, t) {
e.opacity = t < i ? 255 : 0;
});
hs.ResLoader.load(hs.ResUrlType.BLOCKS_DARK, cc.SpriteAtlas, function(e, i) {
if (e) ; else if (i) {
var r = i.getSpriteFrame("game_cube_" + t);
o.createBlockNodes(n, r);
}
});
}
};
t.prototype.createBlockNodes = function(e, t) {
for (var o = 0, n = e.length, i = 0; i < n; i++) for (var r = e[i], s = r.length, a = 0; a < s; a++) if (1 === r[a]) {
var c = -(s - 1) * hs.BLOCK_HALF_SIZE + a * hs.BLOCK_SIZE, u = (n - 1) * hs.BLOCK_HALF_SIZE - i * hs.BLOCK_SIZE, l = this.getOrCreateBlockNode(o);
l.setPosition(c, u);
(l.getComponent(cc.Sprite) || l.addComponent(cc.Sprite)).spriteFrame = t;
o++;
}
};
t.prototype.getOrCreateBlockNode = function(e) {
if (this.blockList[e]) return this.blockList[e];
var t = new cc.Node("block");
this.blockList[e] = t;
this.blocks.addChild(t);
return t;
};
return r([ u ], t);
}(hs.Component));
o.default = l;
cc._RF.pop();
}, {} ],
OneStepClearGuideTrait: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "6a15cYDVp9Ax4fe//put918", "OneStepClearGuideTrait");
var n, i = this && this.__extends || (n = function(e, t) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
})(e, t);
}, function(e, t) {
n(e, t);
function o() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
}), r = this && this.__decorate || function(e, t, o, n) {
var i, r = arguments.length, s = r < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, o, n); else for (var a = e.length - 1; a >= 0; a--) (i = e[a]) && (s = (r < 3 ? i(s) : r > 3 ? i(t, o, s) : i(t, o)) || s);
return r > 3 && s && Object.defineProperty(t, o, s), s;
}, s = this && this.__awaiter || function(e, t, o, n) {
return new (o || (o = Promise))(function(i, r) {
function s(e) {
try {
c(n.next(e));
} catch (e) {
r(e);
}
}
function a(e) {
try {
c(n.throw(e));
} catch (e) {
r(e);
}
}
function c(e) {
e.done ? i(e.value) : (t = e.value, t instanceof o ? t : new o(function(e) {
e(t);
})).then(s, a);
var t;
}
c((n = n.apply(e, t || [])).next());
});
}, a = this && this.__generator || function(e, t) {
var o, n, i, r, s = {
label: 0,
sent: function() {
if (1 & i[0]) throw i[1];
return i[1];
},
trys: [],
ops: []
};
return r = {
next: a(0),
throw: a(1),
return: a(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function a(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(r) {
if (o) throw new TypeError("Generator is already executing.");
for (;s; ) try {
if (o = 1, n && (i = 2 & r[0] ? n.return : r[0] ? n.throw || ((i = n.return) && i.call(n), 
0) : n.next) && !(i = i.call(n, r[1])).done) return i;
(n = 0, i) && (r = [ 2 & r[0], i.value ]);
switch (r[0]) {
case 0:
case 1:
i = r;
break;

case 4:
s.label++;
return {
value: r[1],
done: !1
};

case 5:
s.label++;
n = r[1];
r = [ 0 ];
continue;

case 7:
r = s.ops.pop();
s.trys.pop();
continue;

default:
if (!(i = s.trys, i = i.length > 0 && i[i.length - 1]) && (6 === r[0] || 2 === r[0])) {
s = 0;
continue;
}
if (3 === r[0] && (!i || r[1] > i[0] && r[1] < i[3])) {
s.label = r[1];
break;
}
if (6 === r[0] && s.label < i[1]) {
s.label = i[1];
i = r;
break;
}
if (i && s.label < i[2]) {
s.label = i[2];
s.ops.push(r);
break;
}
i[2] && s.ops.pop();
s.trys.pop();
continue;
}
r = t.call(e, s);
} catch (e) {
r = [ 6, e ];
n = 0;
} finally {
o = i = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
}, c = this && this.__values || function(e) {
var t = "function" == typeof Symbol && Symbol.iterator, o = t && e[t], n = 0;
if (o) return o.call(e);
if (e && "number" == typeof e.length) return {
next: function() {
e && n >= e.length && (e = void 0);
return {
value: e && e[n++],
done: !e
};
}
};
throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.OneStepClearGuideTrait = void 0;
var u = e("./OneStepClearGuideComponent"), l = {
save_arr: [ [ 10, 10, 5, 5, 5, 10, 10, 10 ], [ 10, 10, 4, 4, 4, 10, 10, 10 ], [ 10, 10, 2, 2, 2, 10, 10, 10 ], [ 3, 1, -1, 6, 6, 2, 4, 5 ], [ 3, 1, -1, 6, 6, 2, 4, 5 ], [ 3, 1, -1, -1, -1, 2, 4, 5 ], [ 10, 10, 1, 1, 1, 10, 10, 10 ], [ 10, 10, 3, 3, 3, 10, 10, 10 ] ],
producerBlocks: [ -1, 23, -1 ],
blocksColors: [ 1, 7, 1 ]
}, f = {
start: new cc.Vec2(0, -553.75),
end: new cc.Vec2(-53, 73.25)
}, h = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.guideEffectNode = null;
t._isEliminate = !1;
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassGuide_Proxy",
methodName: "initTraits"
}, {
className: "ClassGuide_Proxy",
methodName: "onClassGameCreate"
}, {
className: "ClassGuide_Proxy",
methodName: "onGuideChange"
}, {
className: "ClassGuide_Proxy",
methodName: "onTouchStart"
}, {
className: "ClassGuide_Proxy",
methodName: "onTouchEnd"
}, {
className: "ClassGuide_Proxy",
methodName: "onAnyTouchEnd"
} ];
};
t.prototype.onActive = function(e) {
if (hs.tp.isClassGuide_ProxyInitTraits(e)) {
if (!hs.classGuideInfo.show) return;
storage.setItem("classGuideStep", 2);
Object.assign(hs.classGuideInfo.steps[2], l);
}
hs.tp.isClassGuide_ProxyShowClassGuide(e) && (e.replace = !0);
hs.tp.isClassGuide_ProxyOnBlockProducerItemOpen(e) && (e.replace = !0);
if (hs.tp.isClassGuide_ProxyOnClassGameCreate(e)) {
if (!hs.classGuideInfo.show) return;
this.showGuide({
showDarkMask: !0,
showAnim: !1,
showGuideEffect: !1
});
}
hs.tp.isClassGuide_ProxyOnGuideChange(e) && this.onGuideChange();
hs.tp.isClassGuide_ProxyOnTouchStart(e) && this.onTouchStart();
hs.tp.isClassGuide_ProxyOnTouchEnd(e) && this.onTouchEnd();
hs.tp.isClassGuide_ProxyOnAnyTouchEnd(e) && this.onAnyTouchEnd();
hs.tp.isClassEncourage_ProxyOnTouchEnd(e) && hs.classGuideInfo.show && e.args[0].state.touchEndState.eliminateCount >= 6 && (e.args[0].state.promptType = hs.EncouragePromptType.PROMPT4);
if (hs.tp.isClassScore_ProxyComputeScoreAddOption(e) && hs.classGuideInfo.show) {
e.returnValue = !0;
var t = e.args[0];
t.baseScore = 5;
t.comboScore = 300;
storage.setItem("classScore", 305);
}
};
t.prototype.showGuide = function(e) {
var t, o;
return s(this, void 0, void 0, function() {
var n, i, r, s, c, h, d;
return a(this, function(a) {
switch (a.label) {
case 0:
return cc.isValid(this.guideComp) ? [ 3, 3 ] : [ 4, CinstAsync(hs.ClassGame) ];

case 1:
n = a.sent();
return [ 4, hs.UI.show(hs.ClassPrefabConfig.ClassGuideWithoutComp, n.guideContainer) ];

case 2:
i = a.sent();
cc.isValid(i) && (this.guideComp = i.addComponent(u.default));
a.label = 3;

case 3:
if (!cc.isValid(this.guideComp)) return [ 2 ];
if (!hs.classGuideInfo.show) {
this.removeGuide();
return [ 2 ];
}
r = hs.classGuideInfo, s = r.step, c = r.totalStep;
h = null !== (t = e.showDarkMask) && void 0 !== t ? t : s < c;
d = null !== (o = e.showAnim) && void 0 !== o ? o : s < c;
this.guideComp.setState({
showDarkMask: h,
showAnimation: d,
showGuideEffect: e.showGuideEffect,
blockId: l.producerBlocks[1],
blockColor: l.blocksColors[1],
startPos: f.start,
endPos: f.end
});
return [ 2 ];
}
});
});
};
t.prototype.removeGuide = function() {
cc.isValid(this.guideComp) && this.guideComp.node.parent && this.guideComp.setState({
showDarkMask: !1,
showAnimation: !1,
showGuideEffect: !1
});
};
t.prototype.onGuideChange = function() {
var e = hs.classGuideInfo, t = e.step, o = e.totalStep;
if (t < o) {
this.showGuide({
showDarkMask: !0,
showAnim: !0,
showGuideEffect: !0
});
this.playProduceItemEffect();
} else if (t === o) {
this.removeGuide();
this.stopProduceItemEffect(!0);
}
};
t.prototype.onTouchStart = function() {
if (hs.classGuideInfo.show) {
this.showGuide({
showDarkMask: !0,
showAnim: !1,
showGuideEffect: !0
});
this.stopProduceItemEffect(!1);
}
};
t.prototype.onTouchEnd = function() {
hs.classGuideInfo.show && (this._isEliminate = !0);
};
t.prototype.onAnyTouchEnd = function() {
if (hs.classGuideInfo.show) {
if (this._isEliminate) this.showGuide({
showDarkMask: !0,
showAnim: !1,
showGuideEffect: !1
}); else {
this.showGuide({
showDarkMask: !0,
showAnim: !0,
showGuideEffect: !0
});
this.playProduceItemEffect();
}
this._isEliminate = !1;
}
};
t.prototype.playProduceItemEffect = function() {
var e = this, t = 0, o = setInterval(function() {
var n, i, r, s = null === (r = cc.director.getScene()) || void 0 === r ? void 0 : r.getComponentsInChildren(hs.BlocksProducerItem);
if (null == s ? void 0 : s.length) {
clearInterval(o);
try {
for (var a = c(s), u = a.next(); !u.done; u = a.next()) {
var l = u.value;
if (cc.isValid(l)) {
var f = l.node;
if (cc.isValid(f) && !(f.children.length <= 0)) {
var h = cc.tween(f).to(.3, {
scale: .54
}).to(.3, {
scale: .45
});
cc.tween(f).repeatForever(h).start();
0 !== f.opacity && e.loadGuideEffect(f);
}
}
}
} catch (e) {
n = {
error: e
};
} finally {
try {
u && !u.done && (i = a.return) && i.call(a);
} finally {
if (n) throw n.error;
}
}
} else ++t >= 300 && clearInterval(o);
}, 10);
};
t.prototype.loadGuideEffect = function(e) {
var t = this;
hs.ResLoader.loadByBundle("class", hs.ClassPrefabConfig.ClassGuideEffect.url, cc.Prefab, function(o, n) {
if (o) ; else if (n && cc.isValid(e)) {
var i = Cinst(hs.BlocksProducer);
if (i && cc.isValid(i.node)) {
cc.isValid(t.guideEffectNode) || (t.guideEffectNode = cc.instantiate(n));
t.guideEffectNode.setPosition(e.x, e.y);
t.guideEffectNode.parent != i.guideEffectContainer && i.guideEffectContainer.addChild(t.guideEffectNode);
}
}
});
};
t.prototype.stopProduceItemEffect = function(e) {
var t, o, n;
cc.isValid(this.guideEffectNode) && this.guideEffectNode.removeFromParent();
var i = null === (n = cc.director.getScene()) || void 0 === n ? void 0 : n.getComponentsInChildren(hs.BlocksProducerItem);
if (i) try {
for (var r = c(i), s = r.next(); !s.done; s = r.next()) {
var a = s.value.node;
cc.Tween.stopAllByTarget(a);
if (e) {
a.scale = .45;
a.opacity = 255;
}
}
} catch (e) {
t = {
error: e
};
} finally {
try {
s && !s.done && (o = r.return) && o.call(r);
} finally {
if (t) throw t.error;
}
}
};
return r([ classId("OneStepClearGuideTrait") ], t);
}(Trait);
o.OneStepClearGuideTrait = h;
cc._RF.pop();
}, {
"./OneStepClearGuideComponent": "OneStepClearGuideComponent"
} ]
}, {}, [ "OneStepClearGuideComponent", "OneStepClearGuideTrait" ]);
//# sourceMappingURL=index.js.map
