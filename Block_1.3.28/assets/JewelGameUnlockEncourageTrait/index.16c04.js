window.__require = function e(t, o, n) {
function r(i, s) {
if (!o[i]) {
if (!t[i]) {
var c = i.split("/");
c = c[c.length - 1];
if (!t[c]) {
var l = "function" == typeof __require && __require;
if (!s && l) return l(c, !0);
if (a) return a(c, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = c;
}
var u = o[i] = {
exports: {}
};
t[i][0].call(u.exports, function(e) {
return r(t[i][1][e] || e);
}, u, u.exports, e, t, o, n);
}
return o[i].exports;
}
for (var a = "function" == typeof __require && __require, i = 0; i < n.length; i++) r(n[i]);
return r;
}({
JewelGameUnlockEncourageTrait: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "02b942uXi1DH6XxYozRwyZl", "JewelGameUnlockEncourageTrait");
var n, r = this && this.__extends || (n = function(e, t) {
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
}), a = this && this.__decorate || function(e, t, o, n) {
var r, a = arguments.length, i = a < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(e, t, o, n); else for (var s = e.length - 1; s >= 0; s--) (r = e[s]) && (i = (a < 3 ? r(i) : a > 3 ? r(t, o, i) : r(t, o)) || i);
return a > 3 && i && Object.defineProperty(t, o, i), i;
}, i = this && this.__awaiter || function(e, t, o, n) {
return new (o || (o = Promise))(function(r, a) {
function i(e) {
try {
c(n.next(e));
} catch (e) {
a(e);
}
}
function s(e) {
try {
c(n.throw(e));
} catch (e) {
a(e);
}
}
function c(e) {
e.done ? r(e.value) : (t = e.value, t instanceof o ? t : new o(function(e) {
e(t);
})).then(i, s);
var t;
}
c((n = n.apply(e, t || [])).next());
});
}, s = this && this.__generator || function(e, t) {
var o, n, r, a, i = {
label: 0,
sent: function() {
if (1 & r[0]) throw r[1];
return r[1];
},
trys: [],
ops: []
};
return a = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
return this;
}), a;
function s(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(a) {
if (o) throw new TypeError("Generator is already executing.");
for (;i; ) try {
if (o = 1, n && (r = 2 & a[0] ? n.return : a[0] ? n.throw || ((r = n.return) && r.call(n), 
0) : n.next) && !(r = r.call(n, a[1])).done) return r;
(n = 0, r) && (a = [ 2 & a[0], r.value ]);
switch (a[0]) {
case 0:
case 1:
r = a;
break;

case 4:
i.label++;
return {
value: a[1],
done: !1
};

case 5:
i.label++;
n = a[1];
a = [ 0 ];
continue;

case 7:
a = i.ops.pop();
i.trys.pop();
continue;

default:
if (!(r = i.trys, r = r.length > 0 && r[r.length - 1]) && (6 === a[0] || 2 === a[0])) {
i = 0;
continue;
}
if (3 === a[0] && (!r || a[1] > r[0] && a[1] < r[3])) {
i.label = a[1];
break;
}
if (6 === a[0] && i.label < r[1]) {
i.label = r[1];
r = a;
break;
}
if (r && i.label < r[2]) {
i.label = r[2];
i.ops.push(a);
break;
}
r[2] && i.ops.pop();
i.trys.pop();
continue;
}
a = t.call(e, i);
} catch (e) {
a = [ 6, e ];
n = 0;
} finally {
o = r = 0;
}
if (5 & a[0]) throw a[1];
return {
value: a[0] ? a[1] : void 0,
done: !0
};
}
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.JewelGameUnlockEncourageTrait = void 0;
var c = function(e) {
r(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.isHasPlay = !1;
t.isOpenJewel = !1;
t.classRecordHigh = !1;
t.encouragePrefab = null;
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "HomePageTrait",
methodName: "isMoreGameBtnActive"
}, {
className: "HomePageSectionButtonGroupDefault",
methodName: "addMoreGame"
}, {
className: "HomePageSectionMoreGameBtnDefault",
methodName: "addOtherNode"
}, {
className: "GameLobby_DataInfo",
methodName: "setIsRed"
}, {
className: "ClassScoreTip_Proxy",
methodName: "onClassScoreUpdate"
} ];
};
t.prototype.onCreate = function() {
this.isHasPlay = hs.storage.getItem("classJewelGameUnlockEncourageHasPlay", !1);
};
t.prototype.onActive = function(e) {
hs.tp.isHomePageTraitIsMoreGameBtnActive(e) && this.checkAddOtherNode(e);
hs.tp.isHomePageSectionButtonGroupDefaultAddMoreGame(e) && this.checkAddOtherNode(e);
hs.tp.isHomePageSectionMoreGameBtnDefaultAddOtherNode(e) && this.checkAddOtherNode(e);
hs.tp.isGameLobby_DataInfoSetIsRed(e) && this.checkSetIsRed(e);
hs.tp.isClassScoreTip_ProxyOnClassScoreUpdate(e) && this.onClassScoreUpdate(e);
hs.tp.isClassScoreTip_ProxyPlayHighScoreEffects(e) && hs.gameInfo.gameMode === hs.GameMode.Class && this.showNewBestScoreEffect(e);
};
t.prototype.checkSetIsRed = function(e) {
var t = e.args[0];
t && hs.storage.setItem("classJewelGameUnlockIsRedOpen", t);
};
t.prototype.onClassScoreUpdate = function() {
var e = hs.storage.getItem("classHighScore", 0);
hs.storage.getItem("classScore", 0) > e && 0 != hs.classGameInfo.gameNum && (this.classRecordHigh = !0);
};
t.prototype.showNewBestScoreEffect = function() {
return i(this, void 0, void 0, function() {
var e, t, o, n, r, a, i;
return s(this, function(s) {
switch (s.label) {
case 0:
if (!this.isOpenJewelGame() || this.isHasPlay) return [ 3, 7 ];
this.isHasPlay = !0;
hs.storage.setItem("classJewelGameUnlockEncourageHasPlay", !0);
e = hs.storage.getItem("classHighScoreEncourageEffectsSate", !1);
t = hs.storage.getItem("classGameNum", 0);
return e || 0 == t ? [ 3, 2 ] : [ 4, this.delay(3) ];

case 1:
s.sent();
return [ 3, 4 ];

case 2:
return [ 4, this.delay(.5) ];

case 3:
s.sent();
s.label = 4;

case 4:
if (this.encouragePrefab) return [ 3, 6 ];
o = this;
return [ 4, hs.ResLoader.asyncLoadByBundle("JewelGameUnlockEncourageTrait", "prefabs/JewelGameUnlockEncourage", cc.Prefab) ];

case 5:
o.encouragePrefab = s.sent();
s.label = 6;

case 6:
if (!cc.isValid(this.encouragePrefab)) return [ 2 ];
n = cc.instantiate(this.encouragePrefab);
if (!cc.isValid(n)) return [ 2 ];
n.parent = hs.gameEffectLayer;
n.active = !0;
r = Cinst(hs.Board);
if (!cc.isValid(r) || !cc.isValid(r.node)) return [ 2 ];
a = r.node.parent.convertToWorldSpaceAR(r.node.getPosition());
i = hs.gameUiLayer.convertToNodeSpaceAR(a);
n.setPosition(i);
n.getComponent("JewelGameUnlockEncourage").setState({
delayTime: .5
});
s.label = 7;

case 7:
return [ 2 ];
}
});
});
};
t.prototype.delay = function(e) {
return new Promise(function(t) {
cc.tween(hs.gameEffectLayer).delay(e).call(function() {
t();
}).start();
});
};
t.prototype.isOpenJewelGame = function() {
if (this.isOpenJewel) return !0;
if (0 === hs.storage.getItem("classGameNum", 0)) return !1;
if (!this.classRecordHigh) return !1;
if (hs.storage.getItem("classJewelGameUnlockIsRedOpen", !1)) return !0;
var e = TRAIT("AddMoreGameTrait");
if (null == e ? void 0 : e.active) return !0;
var t = TRAIT("GameLobbyOpenOpentionByScoreTrait");
if (null == t ? void 0 : t.active) {
if (t.isGetHighScore()) return !0;
} else {
var o = TRAIT("IsOpenGLHallMoreGamesPopupTrait");
if (null == o ? void 0 : o.active) return !0;
}
var n = TRAIT("GameLobbyNewEntryCtrlTrait");
return !(null == n || !n.active);
};
t.prototype.checkAddOtherNode = function() {
this.isOpenJewel = this.isOpenJewelGame();
};
return a([ classId("JewelGameUnlockEncourageTrait") ], t);
}(Trait);
o.JewelGameUnlockEncourageTrait = c;
cc._RF.pop();
}, {} ],
JewelGameUnlockEncourage: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "686c8vNyt1J46csugj7u0XI", "JewelGameUnlockEncourage");
var n, r = this && this.__extends || (n = function(e, t) {
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
}), a = this && this.__decorate || function(e, t, o, n) {
var r, a = arguments.length, i = a < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(e, t, o, n); else for (var s = e.length - 1; s >= 0; s--) (r = e[s]) && (i = (a < 3 ? r(i) : a > 3 ? r(t, o, i) : r(t, o)) || i);
return a > 3 && i && Object.defineProperty(t, o, i), i;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = cc._decorator, s = i.ccclass, c = i.property, l = function(e) {
r(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.gamePlay = null;
return t;
}
t.prototype.onLoad = function() {};
t.prototype.render = function() {
var e, t = this, o = null !== (e = this.state.delayTime) && void 0 !== e ? e : 0;
o > 0 ? this.scheduleOnce(function() {
t.playAnimation();
}, o) : this.playAnimation();
};
t.prototype.playAnimation = function() {
var e = this;
this.gamePlay && cc.isValid(this.gamePlay) ? this.playSpine(this.gamePlay, "moregames", !1, function() {
e.destroySelf();
}) : this.destroySelf();
};
t.prototype.playSpine = function(e, t, o, n) {
if (e && cc.isValid(e)) {
e.setAnimation(0, t, o);
e.setCompleteListener(function(e) {
(e.animation ? e.animation.name : "") === t && n && n();
});
} else null == n || n();
};
t.prototype.destroySelf = function() {
this.node && cc.isValid(this.node) && this.node.destroy();
};
t.prototype.onDestroy = function() {
this.unscheduleAllCallbacks();
this.node && cc.isValid(this.node) && cc.Tween.stopAllByTarget(this.node);
};
a([ c(sp.Skeleton) ], t.prototype, "gamePlay", void 0);
return a([ s ], t);
}(hs.Component);
o.default = l;
cc._RF.pop();
}, {} ]
}, {}, [ "JewelGameUnlockEncourage", "JewelGameUnlockEncourageTrait" ]);
//# sourceMappingURL=index.js.map
