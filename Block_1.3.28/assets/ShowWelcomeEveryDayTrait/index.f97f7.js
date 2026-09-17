window.__require = function t(e, o, i) {
function n(s, a) {
if (!o[s]) {
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
var l = o[s] = {
exports: {}
};
e[s][0].call(l.exports, function(t) {
return n(e[s][1][t] || t);
}, l, l.exports, t, e, o, i);
}
return o[s].exports;
}
for (var r = "function" == typeof __require && __require, s = 0; s < i.length; s++) n(i[s]);
return n;
}({
ShowWelcomeEveryDayTrait: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "5fb97QZ+wpDmrY2sRPz6VQu", "ShowWelcomeEveryDayTrait");
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
}), r = this && this.__decorate || function(t, e, o, i) {
var n, r = arguments.length, s = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, o) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, o, i); else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (s = (r < 3 ? n(s) : r > 3 ? n(e, o, s) : n(e, o)) || s);
return r > 3 && s && Object.defineProperty(e, o, s), s;
}, s = this && this.__awaiter || function(t, e, o, i) {
return new (o || (o = Promise))(function(n, r) {
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
t.done ? n(t.value) : (e = t.value, e instanceof o ? e : new o(function(t) {
t(e);
})).then(s, a);
var e;
}
c((i = i.apply(t, e || [])).next());
});
}, a = this && this.__generator || function(t, e) {
var o, i, n, r, s = {
label: 0,
sent: function() {
if (1 & n[0]) throw n[1];
return n[1];
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
if (o) throw new TypeError("Generator is already executing.");
for (;s; ) try {
if (o = 1, i && (n = 2 & r[0] ? i.return : r[0] ? i.throw || ((n = i.return) && n.call(i), 
0) : i.next) && !(n = n.call(i, r[1])).done) return n;
(i = 0, n) && (r = [ 2 & r[0], n.value ]);
switch (r[0]) {
case 0:
case 1:
n = r;
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
if (!(n = s.trys, n = n.length > 0 && n[n.length - 1]) && (6 === r[0] || 2 === r[0])) {
s = 0;
continue;
}
if (3 === r[0] && (!n || r[1] > n[0] && r[1] < n[3])) {
s.label = r[1];
break;
}
if (6 === r[0] && s.label < n[1]) {
s.label = n[1];
n = r;
break;
}
if (n && s.label < n[2]) {
s.label = n[2];
s.ops.push(r);
break;
}
n[2] && s.ops.pop();
s.trys.pop();
continue;
}
r = e.call(t, s);
} catch (t) {
r = [ 6, t ];
i = 0;
} finally {
o = n = 0;
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
o.ShowWelcomeEveryDayTrait = void 0;
var c = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.showWelcomeLastShowTime = 0;
e.chapterBtn = null;
e.winStreakContainer = null;
e._root = null;
return e;
}
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "HomePageSectionChapterBtnDefault",
methodName: "render"
}, {
className: "HomePageSectionWinStreakTipDefault",
methodName: "render"
}, {
className: "Advertisement_FullScene_Proxy",
methodName: "onAppShow"
}, {
className: "HomePage",
methodName: "onDisable"
}, {
className: "Launch_Proxy",
methodName: "onTraitConfigInitComplete"
} ];
};
e.prototype.onActive = function(t) {
hs.tp.isLaunch_ProxyOnTraitConfigInitComplete(t) && this.loadPrefab();
if (hs.tp.isHomePageSectionChapterBtnDefaultRender(t)) {
cc.isValid(this.chapterBtn) && this.chapterBtn.targetOff(this);
var e = t.target.node;
this.chapterBtn = e;
this.chapterBtn.on(cc.Node.EventType.POSITION_CHANGED, this.onChapterBtnPositionChanged, this);
this.updatePosition(this.chapterBtn);
}
hs.tp.isHomePageOnDisable(t) && this.hideEffect();
if (hs.tp.isHomePageSectionWinStreakTipDefaultRender(t)) {
cc.isValid(this.winStreakContainer) && this.winStreakContainer.targetOff(this);
var o = t.target.node;
this.winStreakContainer = o;
this.winStreakContainer.on(cc.Node.EventType.CHILD_ADDED, this.onWinStreakContainerChildAdd, this);
this.updateWinSteakShow();
}
hs.tp.isAdvertisement_FullScene_ProxyOnAppShow(t) && this.shouldShowEffect() && this.showEffect();
hs.tp.isHomePage_ProxyShowComplete(t) && this.shouldShowEffect() && this.showEffect();
};
e.prototype.onChapterBtnPositionChanged = function() {
this.updatePosition(this.chapterBtn);
};
e.prototype.onWinStreakContainerChildAdd = function() {
this.updateWinSteakShow();
};
e.prototype.shouldShowEffect = function() {
return !hs.isToday(this.showWelcomeLastShowTime) && (!hs.isToday(hs.gameInfo.firstEntryTime) && !!hs.homePageInfo.isInHomePage);
};
e.prototype.getDaysSinceFirstEntry = function() {
var t, e = new Date(null !== (t = hs.gameInfo.firstEntryTime) && void 0 !== t ? t : Date.now()), o = new Date();
e.setHours(0, 0, 0, 0);
o.setHours(0, 0, 0, 0);
var i = o.getTime() - e.getTime();
return Math.floor(i / 864e5);
};
e.prototype.loadPrefab = function() {
return s(this, void 0, void 0, function() {
var t;
return a(this, function(e) {
switch (e.label) {
case 0:
if (cc.isValid(this._root)) return [ 2 ];
e.label = 1;

case 1:
e.trys.push([ 1, 3, , 4 ]);
return [ 4, hs.ResLoader.asyncLoadByBundle(this.traitName, "prefabs/effect", cc.Prefab) ];

case 2:
t = e.sent();
if (cc.isValid(this._root)) return [ 2 ];
this._root = cc.instantiate(t);
this._root.active = !1;
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
e.prototype.showEffect = function() {
return s(this, void 0, void 0, function() {
var t, e, o, i, n, r, s = this;
return a(this, function(a) {
switch (a.label) {
case 0:
return [ 4, hs.nextFrame() ];

case 1:
a.sent();
return cc.isValid(this._root) ? [ 3, 3 ] : [ 4, this.loadPrefab() ];

case 2:
a.sent();
a.label = 3;

case 3:
if (!cc.isValid(this._root)) return [ 2 ];
if (!this.shouldShowEffect()) return [ 2 ];
this.showWelcomeLastShowTime = Date.now();
if (!(t = Cinst(hs.HomePage)) || !cc.isValid(t.node)) return [ 2 ];
this._root.parent !== t.node && t.node.addChild(this._root);
this._root.active = !0;
this.updatePosition(this.chapterBtn);
this.updateWinSteakShow();
(e = this._root.getChildByName("arrow")).stopAllActions();
cc.tween(e).set({
scale: 0
}).delay(.21 * this.speed).set({
scale: .3
}).to(.12 * this.speed, {
scale: 1.06
}, {
easing: cc.easing.sineInOut
}).to(.12 * this.speed, {
scale: .985
}, {
easing: cc.easing.sineInOut
}).to(.12 * this.speed, {
scale: 1
}, {
easing: cc.easing.sineInOut
}).delay(1.59 * this.speed).to(.06 * this.speed, {
scale: 1.1
}, {
easing: cc.easing.sineInOut
}).to(.09 * this.speed, {
scale: .3
}).start();
cc.tween(e).set({
opacity: 0
}).delay(.21 * this.speed).to(.12 * this.speed, {
opacity: 255
}).delay(1.89 * this.speed).to(.09 * this.speed, {
opacity: 0
}).start();
o = this._root.getComponentInChildren(cc.Label);
i = this.getDaysSinceFirstEntry() + 1;
o.string = "Welcome  back  for \nDay {0}";
n = o.string;
n = hs.multiLangInfo.replaceString(n, [ i + "" ]);
o.string = n;
o.node.stopAllActions();
cc.tween(o.node).set({
opacity: 0
}).delay(.21 * this.speed).to(.12 * this.speed, {
opacity: 255
}).delay(1.89 * this.speed).to(.09 * this.speed, {
opacity: 0
}).start();
this.startShowEffect();
(r = this._root.getComponentInChildren(sp.Skeleton)).timeScale = 1 / this.speed;
r.setAnimation(0, "in_1", !1);
r.setCompleteListener(function() {
s.hideEffect();
});
return [ 2 ];
}
});
});
};
e.prototype.startShowEffect = function() {};
e.prototype.hideEffect = function() {
if (cc.isValid(this._root)) {
this._root.active = !1;
this.updateWinSteakShow();
}
};
e.prototype.updatePosition = function(t, e, o) {
void 0 === e && (e = 0);
void 0 === o && (o = 0);
if (cc.isValid(this._root) && this._root.parent && cc.isValid(t)) {
var i = this._root.parent.convertToNodeSpaceAR(t.convertToWorldSpaceAR(cc.v2(-264 + e, 310 + o)));
this._root.setPosition(i);
}
};
e.prototype.updateWinSteakShow = function() {
var t, e = null === (t = this.winStreakContainer) || void 0 === t ? void 0 : t.children.find(function(t) {
return t.name.startsWith("DailyWinStreakState");
});
if (e) {
var o = cc.isValid(this._root) && this._root.active;
e.opacity = o ? 0 : 255;
}
};
Object.defineProperty(e.prototype, "speed", {
get: function() {
return cc.director._kSpeed || 1;
},
enumerable: !1,
configurable: !0
});
r([ hs.storageProperty({
key: "showWelcomeLastShowTime"
}) ], e.prototype, "showWelcomeLastShowTime", void 0);
return r([ classId("ShowWelcomeEveryDayTrait"), classMethodWatch() ], e);
}(Trait);
o.ShowWelcomeEveryDayTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "ShowWelcomeEveryDayTrait" ]);
//# sourceMappingURL=index.js.map
