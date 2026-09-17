window.__require = function t(e, o, i) {
function r(s, a) {
if (!o[s]) {
if (!e[s]) {
var c = s.split("/");
c = c[c.length - 1];
if (!e[c]) {
var h = "function" == typeof __require && __require;
if (!a && h) return h(c, !0);
if (n) return n(c, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = c;
}
var u = o[s] = {
exports: {}
};
e[s][0].call(u.exports, function(t) {
return r(e[s][1][t] || t);
}, u, u.exports, t, e, o, i);
}
return o[s].exports;
}
for (var n = "function" == typeof __require && __require, s = 0; s < i.length; s++) r(i[s]);
return r;
}({
IsShowAdPicReplaceOfGuideTrait: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "2da6fc3p9NLebOu1eVu7Qyk", "IsShowAdPicReplaceOfGuideTrait");
var i, r = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
i(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), n = this && this.__decorate || function(t, e, o, i) {
var r, n = arguments.length, s = n < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, o) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, o, i); else for (var a = t.length - 1; a >= 0; a--) (r = t[a]) && (s = (n < 3 ? r(s) : n > 3 ? r(e, o, s) : r(e, o)) || s);
return n > 3 && s && Object.defineProperty(e, o, s), s;
}, s = this && this.__awaiter || function(t, e, o, i) {
return new (o || (o = Promise))(function(r, n) {
function s(t) {
try {
c(i.next(t));
} catch (t) {
n(t);
}
}
function a(t) {
try {
c(i.throw(t));
} catch (t) {
n(t);
}
}
function c(t) {
t.done ? r(t.value) : (e = t.value, e instanceof o ? e : new o(function(t) {
t(e);
})).then(s, a);
var e;
}
c((i = i.apply(t, e || [])).next());
});
}, a = this && this.__generator || function(t, e) {
var o, i, r, n, s = {
label: 0,
sent: function() {
if (1 & r[0]) throw r[1];
return r[1];
},
trys: [],
ops: []
};
return n = {
next: a(0),
throw: a(1),
return: a(2)
}, "function" == typeof Symbol && (n[Symbol.iterator] = function() {
return this;
}), n;
function a(t) {
return function(e) {
return c([ t, e ]);
};
}
function c(n) {
if (o) throw new TypeError("Generator is already executing.");
for (;s; ) try {
if (o = 1, i && (r = 2 & n[0] ? i.return : n[0] ? i.throw || ((r = i.return) && r.call(i), 
0) : i.next) && !(r = r.call(i, n[1])).done) return r;
(i = 0, r) && (n = [ 2 & n[0], r.value ]);
switch (n[0]) {
case 0:
case 1:
r = n;
break;

case 4:
s.label++;
return {
value: n[1],
done: !1
};

case 5:
s.label++;
i = n[1];
n = [ 0 ];
continue;

case 7:
n = s.ops.pop();
s.trys.pop();
continue;

default:
if (!(r = s.trys, r = r.length > 0 && r[r.length - 1]) && (6 === n[0] || 2 === n[0])) {
s = 0;
continue;
}
if (3 === n[0] && (!r || n[1] > r[0] && n[1] < r[3])) {
s.label = n[1];
break;
}
if (6 === n[0] && s.label < r[1]) {
s.label = r[1];
r = n;
break;
}
if (r && s.label < r[2]) {
s.label = r[2];
s.ops.push(n);
break;
}
r[2] && s.ops.pop();
s.trys.pop();
continue;
}
n = e.call(t, s);
} catch (t) {
n = [ 6, t ];
i = 0;
} finally {
o = r = 0;
}
if (5 & n[0]) throw n[1];
return {
value: n[0] ? n[1] : void 0,
done: !0
};
}
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.IsShowAdPicReplaceOfGuideTrait = void 0;
var c = t("./ShowAdPicReplaceOfGuideUI"), h = "IsShowAdPicReplaceOfGuideTrait", u = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._prefab = null;
e._stageUI = null;
e._barrier = new hs.Barrier();
e.step = 0;
return e;
}
o = e;
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassGame_Proxy",
methodName: "onClassGameStart"
}, {
className: "HomePage_Proxy",
methodName: "showHomePage"
} ];
};
e.prototype.onCreate = function() {
this.preloadResources();
};
e.prototype.onActive = function(t) {
hs.tp.isClassGame_ProxyOnClassGameStart(t) && this.onClassGameStart();
hs.tp.isHomePage_ProxyShowHomePage(t) && this.hideUI();
};
e.prototype.onClassGameStart = function() {
return s(this, void 0, Promise, function() {
return a(this, function(t) {
switch (t.label) {
case 0:
if (!this.shouldShow()) {
this.step = o.MAX_STEP + 1;
return [ 2 ];
}
hs.storage.setItem(o.STORAGE_KEY, {
isFinished: 1
});
return [ 4, this.showUI() ];

case 1:
t.sent();
return [ 2 ];
}
});
});
};
e.prototype.shouldShow = function() {
if (hs.storage.getItem("classGuideStep", 0) >= 3) return !1;
if (this.hasGuide()) {
this.step = o.MAX_STEP + 1;
return !1;
}
return !0;
};
e.prototype.preloadResources = function() {
return s(this, void 0, Promise, function() {
var t;
return a(this, function(e) {
switch (e.label) {
case 0:
e.label = 1;

case 1:
e.trys.push([ 1, 3, , 4 ]);
t = this;
return [ 4, hs.ResLoader.asyncLoadByBundle(h, "res/ShowAdPicReplaceOfGuide", cc.Prefab) ];

case 2:
t._prefab = e.sent();
this._barrier.open();
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
e.prototype.showUI = function() {
return s(this, void 0, Promise, function() {
var t;
return a(this, function(e) {
switch (e.label) {
case 0:
return this._prefab ? [ 3, 2 ] : this._barrier.isOpen ? [ 3, 2 ] : [ 4, this._barrier.wait() ];

case 1:
e.sent();
e.label = 2;

case 2:
if (!this._prefab) return [ 2 ];
(t = cc.instantiate(this._prefab)).active = !0;
if (hs.uiLayer && cc.isValid(hs.uiLayer)) {
hs.uiLayer.addChild(t);
t.setSiblingIndex(t.parent.childrenCount + 1);
} else {
cc.Canvas.instance.node.addChild(t);
t.setSiblingIndex(t.parent.childrenCount + 1);
}
this._stageUI = t.getComponent(c.default);
if (this._stageUI) {
this._stageUI.setTrait(this);
this._stageUI.openUI();
}
this.playSoundRankPop();
return [ 2 ];
}
});
});
};
e.prototype.hideUI = function() {
if (this._stageUI && cc.isValid(this._stageUI.node)) {
this._stageUI.node.active = !1;
this._stageUI.node.destroy();
this._stageUI = null;
}
};
e.prototype.hasGuide = function() {
return hs.storage.getItem(h, {
isFinished: 0
}).isFinished > 0;
};
e.prototype.isLastStep = function(t) {
return t == o.MAX_STEP;
};
e.prototype.moveTo = function(t) {
var e = this.step + (t ? 1 : -1);
if (e < 0) return !1;
if (e > o.MAX_STEP) {
this.finishShow();
return !0;
}
this.step = e;
return !0;
};
e.prototype.finishShow = function() {
if (!(this.step > o.MAX_STEP)) {
this.hideUI();
hs.audioInfo.play(hs.AudioConfig.s_restart);
this.step = o.MAX_STEP + 1;
}
};
e.prototype.playSoundRankPop = function() {
hs.audioInfo.play({
url: "res/sound/rank_pop",
bundleName: h,
type: hs.AudioType.EFFECT,
volume: 1
});
};
e.prototype.playSoundSlide = function() {
hs.audioInfo.play({
url: "res/sound/slide",
bundleName: h,
type: hs.AudioType.EFFECT,
volume: 1
});
};
e.prototype.playSoundLastPage = function() {
this.playSoundSlide();
hs.audioInfo.play({
url: "res/sound/logo_click",
bundleName: h,
type: hs.AudioType.EFFECT,
volume: 1
});
};
var o;
e.MAX_STEP = 3;
e.BLOCK_ANIM_DELAY = 2;
e.STORAGE_KEY = "IsShowAdPicReplaceOfGuideTrait";
return o = n([ classId("IsShowAdPicReplaceOfGuideTrait") ], e);
}(Trait);
o.IsShowAdPicReplaceOfGuideTrait = u;
cc._RF.pop();
}, {
"./ShowAdPicReplaceOfGuideUI": "ShowAdPicReplaceOfGuideUI"
} ],
ShowAdPicReplaceOfGuideUI: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "6bc06QDyrpDBplxQkIR0giP", "ShowAdPicReplaceOfGuideUI");
var i, r = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
i(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), n = this && this.__decorate || function(t, e, o, i) {
var r, n = arguments.length, s = n < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, o) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, o, i); else for (var a = t.length - 1; a >= 0; a--) (r = t[a]) && (s = (n < 3 ? r(s) : n > 3 ? r(e, o, s) : r(e, o)) || s);
return n > 3 && s && Object.defineProperty(e, o, s), s;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var s = t("./IsShowAdPicReplaceOfGuideTrait"), a = cc._decorator, c = a.ccclass, h = a.property, u = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.btnSkip = null;
e.progressNodes = [];
e.sprAdPics = [];
e.leftArrow = null;
e.rightArrow = null;
e.operateNode = null;
e.lastTouchPos = null;
e.isTouchStart = !1;
e.moveMinDis = 20;
e.curStep = -1;
e._trait = null;
e._autoSlideTimerId = null;
e._hasTouched = !1;
return e;
}
o = e;
e.prototype.onLoad = function() {
this.rightArrow.node.active = !1;
this.btnSkip.node.on("click", this.onBtnSkip, this);
this.updateTouchEventStatus(!0);
};
e.prototype.setTrait = function(t) {
this._trait = t;
};
e.prototype.openUI = function() {
this.curStep = -1;
if (this._trait) {
this.showByStep(this._trait.step);
this.startAutoSlide();
}
};
e.prototype.updateTouchEventStatus = function(t) {
if (t) {
this.operateNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
this.operateNode.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
this.operateNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
this.operateNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
} else {
this.operateNode.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
this.operateNode.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
this.operateNode.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
this.operateNode.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
}
};
e.prototype.onTouchStart = function(t) {
this.isTouchStart = !0;
this.lastTouchPos = t.getLocation();
this._hasTouched = !0;
if (this._autoSlideTimerId) {
clearTimeout(this._autoSlideTimerId);
this._autoSlideTimerId = null;
}
};
e.prototype.onTouchMove = function() {};
e.prototype.onTouchEnd = function(t) {
if (t && this.isTouchStart) {
this.isTouchStart = !1;
t.getLocation().x - this.lastTouchPos.x > this.moveMinDis ? this.moveTo(!1) : this.moveTo(!0);
}
};
e.prototype.onTouchCancel = function() {
this.onTouchEnd(null);
};
e.prototype.onBtnSkip = function() {
hs.audioInfo.play(hs.AudioConfig.s_button);
this._trait && this._trait.finishShow();
};
e.prototype.showByStep = function(t) {
this.setProgress(t);
this.showAdPic(t);
this.showSkip();
this.showArrow(t);
this.curStep = t;
};
e.prototype.moveTo = function(t) {
if (this._trait) {
this._trait.step;
if (this._trait.moveTo(t)) {
this._trait.isLastStep(this._trait.step) ? this._trait.playSoundLastPage() : this._trait.playSoundSlide();
this.showByStep(this._trait.step);
this.showSkip();
this.startAutoSlide();
}
}
};
e.prototype.setProgress = function(t) {
if (t < 0 || t >= this.progressNodes.length) this.onBtnSkip(); else for (var e = 0; e < this.progressNodes.length; e++) {
var o = this.progressNodes[e];
if (cc.isValid(o)) {
var i = e === t;
o.childrenCount > 0 && (o.children[0].active = i);
}
}
};
e.prototype.showAdPic = function(t) {
if (t < 0 || t >= this.sprAdPics.length) this.onBtnSkip(); else if (this.curStep < 0) for (var e = 0; e < this.sprAdPics.length; e++) this.sprAdPics[e].node.active = e === t; else {
var o = this.sprAdPics[this.curStep], i = this.sprAdPics[t];
for (e = 0; e < this.sprAdPics.length; e++) this.sprAdPics[e].node.active = e === t || e === this.curStep;
if (o && i) {
i.node.setSiblingIndex(o.node.getSiblingIndex() + 1);
cc.Tween.stopAllByTarget(i.node);
var r = t > this.curStep ? 200 : -200;
i.node.x = r;
i.node.opacity = 0;
cc.tween(i.node).to(.2, {
x: 0,
opacity: 255
}).start();
}
}
};
e.prototype.showSkip = function() {
if (this._trait) {
var t = this._trait.step >= 1;
this.btnSkip.node.opacity = 255;
if (this.btnSkip.node.active !== t) {
this.btnSkip.node.active = t;
if (t) {
var e = this.btnSkip.node;
e.opacity = 0;
cc.Tween.stopAllByTarget(e);
cc.tween(e).to(.2, {
opacity: 255
}).start();
}
}
}
};
e.prototype.showArrow = function() {
var t = this;
if (this._trait) {
this.leftArrow.node.active = !0;
cc.Tween.stopAllByTarget(this.leftArrow.node);
if (this.leftArrow.node.active) {
var e = cc.tween().call(function() {
if (cc.isValid(t.leftArrow)) {
t.leftArrow.timeScale = 1 / t.getAniScale();
t.leftArrow.playAnimation("arrow", 2);
}
}).delay(o.ARROW_PLAY_INTERVAL_SEC * this.getAniScale());
cc.tween(this.leftArrow.node).repeatForever(e).start();
}
}
};
e.prototype.getAniScale = function() {
return cc.director._kSpeed;
};
e.prototype.onDestroy = function() {
this.updateTouchEventStatus(!1);
if (this._autoSlideTimerId) {
clearTimeout(this._autoSlideTimerId);
this._autoSlideTimerId = null;
}
};
e.prototype.startAutoSlide = function() {
var t = this;
if (!this._hasTouched) if (this._trait.step >= s.IsShowAdPicReplaceOfGuideTrait.MAX_STEP + 1) {
clearTimeout(this._autoSlideTimerId);
this._autoSlideTimerId = null;
this.onBtnSkip();
} else this._autoSlideTimerId = setTimeoutSafe(function() {
clearTimeout(t._autoSlideTimerId);
t._autoSlideTimerId = null;
t.moveTo(!0);
}, 1500 * this.getAniScale());
};
var o;
e.ARROW_PLAY_INTERVAL_SEC = 3;
n([ h(cc.Button) ], e.prototype, "btnSkip", void 0);
n([ h({
type: [ cc.Node ]
}) ], e.prototype, "progressNodes", void 0);
n([ h({
type: [ cc.Sprite ]
}) ], e.prototype, "sprAdPics", void 0);
n([ h(dragonBones.ArmatureDisplay) ], e.prototype, "leftArrow", void 0);
n([ h(dragonBones.ArmatureDisplay) ], e.prototype, "rightArrow", void 0);
n([ h(cc.Node) ], e.prototype, "operateNode", void 0);
return o = n([ c ], e);
}(hs.Component);
o.default = u;
cc._RF.pop();
}, {
"./IsShowAdPicReplaceOfGuideTrait": "IsShowAdPicReplaceOfGuideTrait"
} ]
}, {}, [ "IsShowAdPicReplaceOfGuideTrait", "ShowAdPicReplaceOfGuideUI" ]);
//# sourceMappingURL=index.js.map
