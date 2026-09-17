window.__require = function t(e, o, i) {
function n(s, r) {
if (!o[s]) {
if (!e[s]) {
var a = s.split("/");
a = a[a.length - 1];
if (!e[a]) {
var c = "function" == typeof __require && __require;
if (!r && c) return c(a, !0);
if (p) return p(a, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = a;
}
var u = o[s] = {
exports: {}
};
e[s][0].call(u.exports, function(t) {
return n(e[s][1][t] || t);
}, u, u.exports, t, e, o, i);
}
return o[s].exports;
}
for (var p = "function" == typeof __require && __require, s = 0; s < i.length; s++) n(i[s]);
return n;
}({
SwipeUpToContinueTrait: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "f42d4T957FFrKTh0HJmo3B7", "SwipeUpToContinueTrait");
var i, n = this && this.__extends || (i = function(t, e) {
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
}), p = this && this.__decorate || function(t, e, o, i) {
var n, p = arguments.length, s = p < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, o) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, o, i); else for (var r = t.length - 1; r >= 0; r--) (n = t[r]) && (s = (p < 3 ? n(s) : p > 3 ? n(e, o, s) : n(e, o)) || s);
return p > 3 && s && Object.defineProperty(e, o, s), s;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.SwipeUpToContinueTrait = void 0;
var s = t("../components/SwipeUpToContinue"), r = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.swipeUpToContinueState = {
classLabelShowCount: 0,
chapterLabelShowCount: 0
};
e._delayTime = 1.6;
return e;
}
e.prototype.onCreate = function() {
this.swipeUpToContinueState = storage.getItem("swipeUpToContinue", {
classLabelShowCount: 0,
chapterLabelShowCount: 0
});
};
e.prototype.onActive = function(t) {
if (hs.tp.isChapterFail_ProxyGetScoreFailNode(t)) {
this._delayTime = 2;
this.loadSwipeUpToContinue(t.args[0]);
}
if (hs.tp.isChapterFail_ProxyGetCollectFailNode(t)) {
this._delayTime = 2;
this.loadSwipeUpToContinue(t.args[0]);
}
if (hs.tp.isChapterWin_ProxyGetScoreWinNode(t)) {
this._delayTime = 3;
this.loadSwipeUpToContinue(t.args[0]);
}
if (hs.tp.isChapterWin_ProxyGetCollectWinNode(t)) {
this._delayTime = 3;
this.loadSwipeUpToContinue(t.args[0]);
}
if (hs.tp.isClassFail_ProxyGetFailNode(t)) {
this._delayTime = 1.5;
this.loadSwipeUpToContinue(t.args[0]);
}
if (hs.tp.isClassWin_ProxyGetWinNode(t)) {
this._delayTime = 2.2;
this.loadSwipeUpToContinue(t.args[0]);
}
};
e.prototype.loadSwipeUpToContinue = function(t) {
var e = this;
if (t) {
var o = null == t ? void 0 : t.getChildByName("SwipeUpToContinue");
if (cc.isValid(o)) {
this.changeSwipeUpToContinueState(o);
this.playAction(o, t);
} else hs.ResLoader.asyncLoadByBundle("SwipeUpToContinueTrait", "prefabs/SwipeUpToContinue", cc.Prefab).then(function(o) {
var i = null == t ? void 0 : t.getChildByName("playBtn");
if (i) {
var n = cc.instantiate(o);
n.name = "SwipeUpToContinue";
n.parent = t;
n.x = 0;
n.y = i.y - i.height / 2;
if (cc.isValid(n)) {
e.changeSwipeUpToContinueState(n);
e.playAction(n, t);
}
}
});
}
};
e.prototype.changeSwipeUpToContinueState = function(t) {
t.active = !1;
var e = t.getComponent(s.default), o = 0;
if (hs.gameInfo.gameType === hs.GameType.Class) {
o = this.swipeUpToContinueState.classLabelShowCount;
this.swipeUpToContinueState.classLabelShowCount++;
} else {
o = this.swipeUpToContinueState.chapterLabelShowCount;
this.swipeUpToContinueState.chapterLabelShowCount++;
}
e.setState({
isLabelShow: o < this.props.swipeUpTime
});
DS("usr_data_end_swipeup_show", {
has_text: o < this.props.swipeUpTime ? 1 : 0
});
storage.setItem("swipeUpToContinue", this.swipeUpToContinueState);
};
e.prototype.saveSwipeUpToContinueState = function(t) {
storage.setItem("swipeUpToContinue", t);
};
e.prototype.playAction = function(t, e) {
if (cc.isValid(t) && cc.isValid(e)) {
t.scale = .6;
cc.tween(e).delay(this._delayTime).call(function() {
if (cc.isValid(t)) {
t.active = !0;
cc.tween(t).to(.13, {
scale: 1.1
}).to(.07, {
scale: 1
}).call(function() {}).start();
}
}).start();
}
};
return p([ classId("SwipeUpToContinueTrait") ], e);
}(Trait);
o.SwipeUpToContinueTrait = r;
cc._RF.pop();
}, {
"../components/SwipeUpToContinue": "SwipeUpToContinue"
} ],
SwipeUpToContinue: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "0dff0ToAt9BAYJ6FXF89n5P", "SwipeUpToContinue");
var i, n = this && this.__extends || (i = function(t, e) {
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
}), p = this && this.__decorate || function(t, e, o, i) {
var n, p = arguments.length, s = p < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, o) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, o, i); else for (var r = t.length - 1; r >= 0; r--) (n = t[r]) && (s = (p < 3 ? n(s) : p > 3 ? n(e, o, s) : n(e, o)) || s);
return p > 3 && s && Object.defineProperty(e, o, s), s;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var s = cc._decorator, r = s.ccclass, a = s.property, c = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.labelShowNode = null;
e.labelHideNode = null;
e.startTouchPos = null;
e.swipeThreshold = 50;
return e;
}
e.prototype.onLoad = function() {
this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
};
e.prototype.onDestroy = function() {
this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
};
e.prototype.render = function() {
if (this.state.isLabelShow) {
this.labelShowNode.active = !0;
this.labelHideNode.active = !1;
} else {
this.labelShowNode.active = !1;
this.labelHideNode.active = !0;
}
};
e.prototype.onTouchStart = function(t) {
this.startTouchPos = t.getLocation();
};
e.prototype.onTouchMove = function() {};
e.prototype.onTouchEnd = function(t) {
if (this.startTouchPos) {
t.getLocation().y - this.startTouchPos.y > this.swipeThreshold && this.onSwipeUp();
this.startTouchPos = null;
}
};
e.prototype.onSwipeUp = function() {
this.triggerContinueGame();
};
e.prototype.triggerContinueGame = function() {
var t, e = null === (t = this.node.parent) || void 0 === t ? void 0 : t.getChildByName("playBtn");
if (e) {
cc.Tween.stopAllByTarget(e);
var o = e.getComponent(cc.Button);
if (o && o.clickEvents.length > 0) {
DS("usr_data_end_swipeup", {
has_text: this.state.isLabelShow ? 1 : 0
});
o.clickEvents[0].emit([ "click" ]);
}
}
};
p([ a(cc.Node) ], e.prototype, "labelShowNode", void 0);
p([ a(cc.Node) ], e.prototype, "labelHideNode", void 0);
return p([ r ], e);
}(hs.Component);
o.default = c;
cc._RF.pop();
}, {} ]
}, {}, [ "SwipeUpToContinue", "SwipeUpToContinueTrait" ]);
//# sourceMappingURL=index.js.map
