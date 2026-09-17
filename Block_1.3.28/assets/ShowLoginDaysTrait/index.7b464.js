window.__require = function t(e, n, o) {
function i(r, s) {
if (!n[r]) {
if (!e[r]) {
var c = r.split("/");
c = c[c.length - 1];
if (!e[c]) {
var l = "function" == typeof __require && __require;
if (!s && l) return l(c, !0);
if (a) return a(c, !0);
throw new Error("Cannot find module '" + r + "'");
}
r = c;
}
var h = n[r] = {
exports: {}
};
e[r][0].call(h.exports, function(t) {
return i(e[r][1][t] || t);
}, h, h.exports, t, e, n, o);
}
return n[r].exports;
}
for (var a = "function" == typeof __require && __require, r = 0; r < o.length; r++) i(o[r]);
return i;
}({
LaunchLoginDays: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "79b01dyX5ZH6rAhng7j/ZZZ", "LaunchLoginDays");
var o, i = this && this.__extends || (o = function(t, e) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
})(t, e);
}, function(t, e) {
o(t, e);
function n() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
}), a = this && this.__decorate || function(t, e, n, o) {
var i, a = arguments.length, r = a < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(t, e, n, o); else for (var s = t.length - 1; s >= 0; s--) (i = t[s]) && (r = (a < 3 ? i(r) : a > 3 ? i(e, n, r) : i(e, n)) || r);
return a > 3 && r && Object.defineProperty(e, n, r), r;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.LaunchLoginDays = void 0;
var r = cc._decorator, s = r.ccclass, c = r.property, l = function(t) {
i(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.audioClip = null;
e.daysLow = null;
e.daysMiddle = null;
e.dayHigh = null;
e.daysHigh = null;
e.effect = null;
e.anim = null;
e.end = null;
return e;
}
e.prototype.onLoad = function() {
hs.applyAdapterFringe(this.end);
};
e.prototype.render = function() {
this.setLabel();
if (this.state.show) {
this.anim.setScale(0);
cc.Tween.stopAllByTarget(this.anim);
cc.tween(this.anim).to(.18, {
scale: 1.2
}).to(.12, {
scale: 1
}).start();
}
if (this.state.hide) {
var t = this.state.achievementActive ? this.end.position.clone() : this.anim.position.clone(), e = this.state.achievementActive ? .5 : 1, n = this.state.achievementActive ? 255 : 0;
cc.Tween.stopAllByTarget(this.anim);
cc.tween(this.anim).set({
scale: 1,
opacity: 255
}).to(.34, {
position: t,
scale: e,
opacity: n
}).start();
} else this.audioClip && hs.audioInfo.play({
url: "audios/day_number",
volume: 1,
type: hs.AudioType.EFFECT,
bundleName: "ShowLoginDaysTrait"
});
};
e.prototype.setLabel = function() {
var t, e, n, o = null !== (t = this.state.loginDays) && void 0 !== t ? t : 1;
if (1 === o) {
this.dayHigh.active = !0;
e = this.dayHigh;
n = "third_lz";
} else if (o >= 10 && o % 10 == 0) {
this.daysHigh.active = !0;
e = this.daysHigh;
n = "third_lz";
} else if (o <= 7 || o % 7 == 0) {
this.daysMiddle.active = !0;
e = this.daysMiddle;
n = "second_lz";
} else {
this.daysLow.active = !0;
e = this.daysLow;
n = "first_lz";
}
e.getChildByName("label").getComponent(cc.Label).string = o.toString();
this.effect.playAnimation(n, 1);
};
a([ c(cc.AudioClip) ], e.prototype, "audioClip", void 0);
a([ c(cc.Node) ], e.prototype, "daysLow", void 0);
a([ c(cc.Node) ], e.prototype, "daysMiddle", void 0);
a([ c(cc.Node) ], e.prototype, "dayHigh", void 0);
a([ c(cc.Node) ], e.prototype, "daysHigh", void 0);
a([ c(dragonBones.ArmatureDisplay) ], e.prototype, "effect", void 0);
a([ c(cc.Node) ], e.prototype, "anim", void 0);
a([ c(cc.Node) ], e.prototype, "end", void 0);
return a([ classId("LaunchLoginDays"), s, classMethodWatch() ], e);
}(hs.Component);
n.LaunchLoginDays = l;
cc._RF.pop();
}, {} ],
ShowLoginDaysTrait: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "ae375klZQtLyb+AG0AVZ/Ii", "ShowLoginDaysTrait");
var o, i = this && this.__extends || (o = function(t, e) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
})(t, e);
}, function(t, e) {
o(t, e);
function n() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
}), a = this && this.__decorate || function(t, e, n, o) {
var i, a = arguments.length, r = a < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(t, e, n, o); else for (var s = t.length - 1; s >= 0; s--) (i = t[s]) && (r = (a < 3 ? i(r) : a > 3 ? i(e, n, r) : i(e, n)) || r);
return a > 3 && r && Object.defineProperty(e, n, r), r;
}, r = this && this.__awaiter || function(t, e, n, o) {
return new (n || (n = Promise))(function(i, a) {
function r(t) {
try {
c(o.next(t));
} catch (t) {
a(t);
}
}
function s(t) {
try {
c(o.throw(t));
} catch (t) {
a(t);
}
}
function c(t) {
t.done ? i(t.value) : (e = t.value, e instanceof n ? e : new n(function(t) {
t(e);
})).then(r, s);
var e;
}
c((o = o.apply(t, e || [])).next());
});
}, s = this && this.__generator || function(t, e) {
var n, o, i, a, r = {
label: 0,
sent: function() {
if (1 & i[0]) throw i[1];
return i[1];
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
function s(t) {
return function(e) {
return c([ t, e ]);
};
}
function c(a) {
if (n) throw new TypeError("Generator is already executing.");
for (;r; ) try {
if (n = 1, o && (i = 2 & a[0] ? o.return : a[0] ? o.throw || ((i = o.return) && i.call(o), 
0) : o.next) && !(i = i.call(o, a[1])).done) return i;
(o = 0, i) && (a = [ 2 & a[0], i.value ]);
switch (a[0]) {
case 0:
case 1:
i = a;
break;

case 4:
r.label++;
return {
value: a[1],
done: !1
};

case 5:
r.label++;
o = a[1];
a = [ 0 ];
continue;

case 7:
a = r.ops.pop();
r.trys.pop();
continue;

default:
if (!(i = r.trys, i = i.length > 0 && i[i.length - 1]) && (6 === a[0] || 2 === a[0])) {
r = 0;
continue;
}
if (3 === a[0] && (!i || a[1] > i[0] && a[1] < i[3])) {
r.label = a[1];
break;
}
if (6 === a[0] && r.label < i[1]) {
r.label = i[1];
i = a;
break;
}
if (i && r.label < i[2]) {
r.label = i[2];
r.ops.push(a);
break;
}
i[2] && r.ops.pop();
r.trys.pop();
continue;
}
a = e.call(t, r);
} catch (t) {
a = [ 6, t ];
o = 0;
} finally {
n = i = 0;
}
if (5 & a[0]) throw a[1];
return {
value: a[0] ? a[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.ShowLoginDaysTrait = void 0;
var c = t("./LaunchLoginDays"), l = function(t) {
i(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.date = 0;
return e;
}
e.prototype.onCreate = function() {
var t = this;
this.ensureLoginDaysNode();
hs.UI.addEventListener("open", function(e) {
t.handlePageOpen(e);
});
};
e.prototype.onActive = function(t) {
if (hs.tp.isLaunchStartEnter(t)) {
var e = Date.now(), n = this.isSameDay(e, this.date);
if (n = this.updateIsSameDayByOtherTrait(n)) return;
if (hs.launchInfo.intoModeChoice && hs.launchInfo.chapterModelSwitch()) {
t.replace = !0;
this.showLoginDays().catch(function() {}).finally(function() {
var e;
null === (e = t.originalCaller) || void 0 === e || e.call(t);
});
}
}
};
e.prototype.handlePageOpen = function(t) {
var e, n, o = null === (n = null === (e = hs.homePageInfo) || void 0 === e ? void 0 : e.homeConfig) || void 0 === n ? void 0 : n.name;
t.name !== o && "ClassMain" !== t.name && "ChapterMain" !== t.name || this.loginDaysHideAnim();
};
e.prototype.isSameDay = function(t, e) {
var n = new Date(t), o = new Date(e);
return n.getFullYear() === o.getFullYear() && n.getMonth() === o.getMonth() && n.getDate() === o.getDate();
};
e.prototype.showLoginDays = function() {
return r(this, void 0, void 0, function() {
var t, e, n, o, i;
return s(this, function(a) {
switch (a.label) {
case 0:
t = this.props, e = t.launchTime, n = t.totalTime;
o = Date.now();
i = hs.gameInfo.entryTime;
return o - i > 1e3 * e ? [ 2 ] : [ 4, this.ensureLoginDaysNode() ];

case 1:
a.sent();
return this.loginDaysNode ? Date.now() - o > 1e3 * n ? [ 2 ] : [ 4, this.loginDaysShowAnim() ] : [ 2 ];

case 2:
a.sent();
return [ 2 ];
}
});
});
};
e.prototype.ensureLoginDaysNode = function() {
return r(this, void 0, void 0, function() {
var t = this;
return s(this, function() {
return this.loginDaysNode ? [ 2 ] : [ 2, new Promise(function(e) {
hs.ResLoader.loadByBundle("ShowLoginDaysTrait", "prefabs/LaunchLoginDays", cc.Prefab, function(n, o) {
n || o && (t.loginDaysNode || (t.loginDaysNode = cc.instantiate(o)));
e();
});
}) ];
});
});
};
e.prototype.loginDaysShowAnim = function() {
var t, e, n, o;
return r(this, void 0, void 0, function() {
var i, a, r = this;
return s(this, function() {
this.date = Date.now();
(i = null === (e = null === (t = Cinst(hs.Launch)) || void 0 === t ? void 0 : t.node) || void 0 === e ? void 0 : e.getChildByName("loading")) && (i.active = !1);
hs.effectLayer.addChild(this.loginDaysNode);
a = hs.achievementInfo.getQueryAchievementStatisticsData(hs.Achievement_Target_Type.achieve_login_day);
this.loginDaysNode.getComponent(c.LaunchLoginDays).setState({
loginDays: a,
startY: hs.effectLayer.height / 2 + (null !== (o = null === (n = null == i ? void 0 : i.position) || void 0 === n ? void 0 : n.y) && void 0 !== o ? o : -193),
show: !0
});
cc.Tween.stopAllByTarget(this.loginDaysNode);
return [ 2, new Promise(function(t) {
cc.tween(r.loginDaysNode).delay(.66).call(function() {
return t();
}).start();
}) ];
});
});
};
e.prototype.loginDaysHideAnim = function() {
var t, e = this;
if (this.loginDaysNode) {
this.loginDaysNode.getComponent(c.LaunchLoginDays).setState({
hide: !0,
achievementActive: null === (t = TRAIT("IsShowAchievementTrait")) || void 0 === t ? void 0 : t.active
});
cc.Tween.stopAllByTarget(this.loginDaysNode);
cc.tween(this.loginDaysNode).delay(1 - .66).call(function() {
return e.clearLoginDaysAnim();
}).start();
}
};
e.prototype.clearLoginDaysAnim = function() {
var t, e;
(null === (e = null === (t = Cinst(hs.Launch)) || void 0 === t ? void 0 : t.node) || void 0 === e ? void 0 : e.getChildByName("loading")) && (Cinst(hs.Launch).node.getChildByName("loading").active = !0);
if (this.loginDaysNode) {
this.loginDaysNode.removeFromParent();
this.loginDaysNode.destroy();
this.loginDaysNode = null;
}
};
e.prototype.updateIsSameDayByOtherTrait = function(t) {
return t;
};
a([ hs.storageProperty({
key: "ShowLoginDaysTrait_Date"
}) ], e.prototype, "date", void 0);
return a([ classId("ShowLoginDaysTrait"), classMethodWatch() ], e);
}(Trait);
n.ShowLoginDaysTrait = l;
cc._RF.pop();
}, {
"./LaunchLoginDays": "LaunchLoginDays"
} ]
}, {}, [ "LaunchLoginDays", "ShowLoginDaysTrait" ]);
//# sourceMappingURL=index.js.map
