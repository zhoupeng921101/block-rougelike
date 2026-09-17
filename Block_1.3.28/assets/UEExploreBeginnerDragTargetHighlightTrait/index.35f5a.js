window.__require = function t(e, n, i) {
function o(s, a) {
if (!n[s]) {
if (!e[s]) {
var c = s.split("/");
c = c[c.length - 1];
if (!e[c]) {
var h = "function" == typeof __require && __require;
if (!a && h) return h(c, !0);
if (r) return r(c, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = c;
}
var u = n[s] = {
exports: {}
};
e[s][0].call(u.exports, function(t) {
return o(e[s][1][t] || t);
}, u, u.exports, t, e, n, i);
}
return n[s].exports;
}
for (var r = "function" == typeof __require && __require, s = 0; s < i.length; s++) o(i[s]);
return o;
}({
UEExploreBeginnerDragTargetHighlightComponent: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "f5060KDshxGSJjcX1Wco3TT", "UEExploreBeginnerDragTargetHighlightComponent");
var i, o = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
})(t, e);
}, function(t, e) {
i(t, e);
function n() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
}), r = this && this.__decorate || function(t, e, n, i) {
var o, r = arguments.length, s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, n, i); else for (var a = t.length - 1; a >= 0; a--) (o = t[a]) && (s = (r < 3 ? o(s) : r > 3 ? o(e, n, s) : o(e, n)) || s);
return r > 3 && s && Object.defineProperty(e, n, s), s;
}, s = this && this.__awaiter || function(t, e, n, i) {
return new (n || (n = Promise))(function(o, r) {
function s(t) {
try {
c(i.next(t));
} catch (t) {
r(t);
}
}
function a(t) {
try {
c(i.throw(t));
} catch (t) {
r(t);
}
}
function c(t) {
t.done ? o(t.value) : (e = t.value, e instanceof n ? e : new n(function(t) {
t(e);
})).then(s, a);
var e;
}
c((i = i.apply(t, e || [])).next());
});
}, a = this && this.__generator || function(t, e) {
var n, i, o, r, s = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
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
function a(t) {
return function(e) {
return c([ t, e ]);
};
}
function c(r) {
if (n) throw new TypeError("Generator is already executing.");
for (;s; ) try {
if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 
0) : i.next) && !(o = o.call(i, r[1])).done) return o;
(i = 0, o) && (r = [ 2 & r[0], o.value ]);
switch (r[0]) {
case 0:
case 1:
o = r;
break;

case 4:
s.label++;
return {
value: r[1],
done: !1
};

case 5:
s.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = s.ops.pop();
s.trys.pop();
continue;

default:
if (!(o = s.trys, o = o.length > 0 && o[o.length - 1]) && (6 === r[0] || 2 === r[0])) {
s = 0;
continue;
}
if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
s.label = r[1];
break;
}
if (6 === r[0] && s.label < o[1]) {
s.label = o[1];
o = r;
break;
}
if (o && s.label < o[2]) {
s.label = o[2];
s.ops.push(r);
break;
}
o[2] && s.ops.pop();
s.trys.pop();
continue;
}
r = e.call(t, s);
} catch (t) {
r = [ 6, t ];
i = 0;
} finally {
n = o = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
var c = cc._decorator, h = c.ccclass, u = (c.property, function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.blocks = null;
e.dark = null;
e.hand = null;
e.moveContainer = null;
e._effect = null;
e._isLoadingEffect = !1;
return e;
}
e.prototype.onLoad = function() {
this.dark = this.node.getChildByName("dark");
this.moveContainer = this.node.getChildByName("moveContainer");
this.blocks = this.moveContainer.getChildByName("blocks");
this.hand = this.moveContainer.getChildByName("hand");
this.moveContainer.active = !1;
};
e.prototype.render = function() {
this.dark.active = this.state.showDarkMask;
this.state.showGuideAnimation || this.state.showLightEff ? this.showGuide() : this.hideGuide();
};
e.prototype.loadEffect = function() {
var t;
return s(this, void 0, void 0, function() {
var e;
return a(this, function(n) {
switch (n.label) {
case 0:
if (cc.isValid(this._effect) || this._isLoadingEffect) return [ 2 ];
this._isLoadingEffect = !0;
n.label = 1;

case 1:
n.trys.push([ 1, 3, 4, 5 ]);
return [ 4, hs.ResLoader.asyncLoadByBundle("UEExploreBeginnerDragTargetHighlightTrait", "prefabs/highlight", cc.Prefab) ];

case 2:
e = n.sent();
if (cc.isValid(this._effect)) return [ 2 ];
this._effect = cc.instantiate(e).getComponent(sp.Skeleton);
this._effect.node.active = !1;
this._effect.timeScale = 1 / (null !== (t = cc.director._kSpeed) && void 0 !== t ? t : 1);
this.node.addChild(this._effect.node);
(this.state.showGuideAnimation || this.state.showLightEff) && this.showGuide();
return [ 3, 5 ];

case 3:
n.sent();
return [ 3, 5 ];

case 4:
this._isLoadingEffect = !1;
return [ 7 ];

case 5:
cc.isValid(this._effect) || this.scheduleOnce(this.networkCheck, 2);
return [ 2 ];
}
});
});
};
e.prototype.networkCheck = function() {
hs.NativeNetwork.getNetWorkState() ? this.loadEffect() : this.scheduleOnce(this.networkCheck, 1);
};
e.prototype.showGuide = function() {
if (cc.isValid(this._effect)) {
this._effect.node.active = !0;
this._effect.setAnimation(0, this.state.showGuideAnimation ? "in2" : "in", !0);
this._effect.node.setPosition(this.state.position);
} else this.loadEffect();
};
e.prototype.hideGuide = function() {
cc.isValid(this._effect) && (this._effect.node.active = !1);
};
return r([ h ], e);
}(hs.Component));
n.default = u;
cc._RF.pop();
}, {} ],
UEExploreBeginnerDragTargetHighlightTrait: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "61585gm71JAlYVTNC2ifWpq", "UEExploreBeginnerDragTargetHighlightTrait");
var i, o = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
})(t, e);
}, function(t, e) {
i(t, e);
function n() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
}), r = this && this.__decorate || function(t, e, n, i) {
var o, r = arguments.length, s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, n, i); else for (var a = t.length - 1; a >= 0; a--) (o = t[a]) && (s = (r < 3 ? o(s) : r > 3 ? o(e, n, s) : o(e, n)) || s);
return r > 3 && s && Object.defineProperty(e, n, s), s;
}, s = this && this.__awaiter || function(t, e, n, i) {
return new (n || (n = Promise))(function(o, r) {
function s(t) {
try {
c(i.next(t));
} catch (t) {
r(t);
}
}
function a(t) {
try {
c(i.throw(t));
} catch (t) {
r(t);
}
}
function c(t) {
t.done ? o(t.value) : (e = t.value, e instanceof n ? e : new n(function(t) {
t(e);
})).then(s, a);
var e;
}
c((i = i.apply(t, e || [])).next());
});
}, a = this && this.__generator || function(t, e) {
var n, i, o, r, s = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
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
function a(t) {
return function(e) {
return c([ t, e ]);
};
}
function c(r) {
if (n) throw new TypeError("Generator is already executing.");
for (;s; ) try {
if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 
0) : i.next) && !(o = o.call(i, r[1])).done) return o;
(i = 0, o) && (r = [ 2 & r[0], o.value ]);
switch (r[0]) {
case 0:
case 1:
o = r;
break;

case 4:
s.label++;
return {
value: r[1],
done: !1
};

case 5:
s.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = s.ops.pop();
s.trys.pop();
continue;

default:
if (!(o = s.trys, o = o.length > 0 && o[o.length - 1]) && (6 === r[0] || 2 === r[0])) {
s = 0;
continue;
}
if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
s.label = r[1];
break;
}
if (6 === r[0] && s.label < o[1]) {
s.label = o[1];
o = r;
break;
}
if (o && s.label < o[2]) {
s.label = o[2];
s.ops.push(r);
break;
}
o[2] && s.ops.pop();
s.trys.pop();
continue;
}
r = e.call(t, s);
} catch (t) {
r = [ 6, t ];
i = 0;
} finally {
n = o = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.UEExploreBeginnerDragTargetHighlightTrait = void 0;
var c = t("./UEExploreBeginnerDragTargetHighlightComponent"), h = {
save_arr: [ [ 10, 10, 10, 10, 10, 10, 10, 10 ], [ 10, 10, 10, 10, 10, 10, 10, 10 ], [ 10, 10, 10, 10, 10, 10, 10, 10 ], [ 5, 5, 4, 4, -1, 4, 5, 5 ], [ 5, 5, -1, -1, -1, 4, 5, 5 ], [ 10, 10, 10, 10, 10, 10, 10, 10 ], [ 10, 10, 10, 10, 10, 10, 10, 10 ], [ 10, 10, 10, 10, 10, 10, 10, 10 ] ],
producerBlocks: [ -1, 33, -1 ],
blocksColors: [ 3, 4, 3 ],
color: 4,
position: cc.v2(0, -77)
}, u = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._component = null;
e._isEliminate = !1;
return e;
}
e.prototype.onActive = function(t) {
if (hs.tp.isClassGuide_ProxyInitTraits(t)) {
if (!hs.classGuideInfo.show) return;
hs.storage.setItem("classGuideStep", 2);
this.initBoard();
}
hs.tp.isClassGuide_ProxyShowClassGuide(t) && (t.replace = !0);
hs.tp.isClassGuide_ProxyOnClassGameCreate(t) && this.onClassCreate();
hs.tp.isClassGuide_ProxyOnGuideChange(t) && this.onGuideChange();
hs.tp.isClassGuide_ProxyOnTouchStart(t) && this.onTouchStart();
hs.tp.isClassGuide_ProxyOnTouchEnd(t) && this.onTouchEnd();
hs.tp.isClassGuide_ProxyOnAnyTouchEnd(t) && this.onAnyTouchEnd();
if (hs.tp.isIsOpenFirstDayReplayGuideBoardTraitGetInitBoard(t)) {
t.returnValue = h.save_arr.map(function(t) {
return t.map(function(t) {
return 10 === t ? -1 : t;
});
});
t.replace = !0;
}
if (hs.tp.isIsOpenFirstDayReplayGuideBoardTraitGetProducerBlocks(t)) {
t.returnValue = h.producerBlocks.map(function(t) {
return t;
});
t.replace = !0;
}
if (hs.tp.isIsOpenFirstDayReplayGuideBoardTraitGetBlocksColors(t)) {
t.returnValue = h.blocksColors.map(function(t) {
return t;
});
t.replace = !0;
}
};
e.prototype.initBoard = function() {
Object.assign(hs.classGuideInfo.steps[2], h);
};
e.prototype.onClassCreate = function() {
if (hs.classGuideInfo.show) {
hs.classGuideInfo.step;
this.showGuide({
showDarkMask: !0,
showGuideAnimation: !1,
showLightEff: !1
});
}
};
e.prototype.onGuideChange = function() {
var t = hs.classGuideInfo, e = t.totalStep, n = t.step;
n < e ? this.showGuide({}) : n === e && this._component && this._component.setState({
showDarkMask: !1,
showGuideAnimation: !1,
showLightEff: !1
});
};
e.prototype.onTouchStart = function() {
hs.classGuideInfo.show && this._component && this._component.setState({
showDarkMask: !0,
showGuideAnimation: !1,
showLightEff: !0
});
};
e.prototype.onTouchEnd = function() {
hs.classGuideInfo.show && (this._isEliminate = !0);
};
e.prototype.onAnyTouchEnd = function() {
if (hs.classGuideInfo.show) {
this._component && (this._isEliminate ? this._component.setState({
showDarkMask: !0,
showGuideAnimation: !1,
showLightEff: !1
}) : this._component.setState({
showDarkMask: !0,
showGuideAnimation: !0,
showLightEff: !1
}));
this._isEliminate = !1;
}
};
e.prototype.showGuide = function(t) {
var e, n, i;
return s(this, void 0, void 0, function() {
var o, r, s, u, l, f, p;
return a(this, function(a) {
switch (a.label) {
case 0:
return [ 4, CinstAsync(hs.ClassGame) ];

case 1:
o = a.sent();
return [ 4, hs.UI.show(hs.ClassPrefabConfig.ClassGuideWithoutComp, o.guideContainer) ];

case 2:
r = a.sent();
cc.isValid(r) && (this._component = r.addComponent(c.default));
s = hs.classGuideInfo.totalStep;
u = hs.classGuideInfo.step;
l = null !== (e = t.showDarkMask) && void 0 !== e ? e : u < s;
f = null !== (n = t.showGuideAnimation) && void 0 !== n ? n : u < s;
p = null !== (i = t.showLightEff) && void 0 !== i && i;
cc.isValid(this._component) && this._component.setState({
showDarkMask: l,
showGuideAnimation: f,
showLightEff: p,
position: h.position
});
return [ 2 ];
}
});
});
};
return r([ classId("UEExploreBeginnerDragTargetHighlightTrait") ], e);
}(Trait);
n.UEExploreBeginnerDragTargetHighlightTrait = u;
cc._RF.pop();
}, {
"./UEExploreBeginnerDragTargetHighlightComponent": "UEExploreBeginnerDragTargetHighlightComponent"
} ]
}, {}, [ "UEExploreBeginnerDragTargetHighlightComponent", "UEExploreBeginnerDragTargetHighlightTrait" ]);
//# sourceMappingURL=index.js.map
