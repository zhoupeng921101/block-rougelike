window.__require = function e(t, i, o) {
function n(a, s) {
if (!i[a]) {
if (!t[a]) {
var m = a.split("/");
m = m[m.length - 1];
if (!t[m]) {
var c = "function" == typeof __require && __require;
if (!s && c) return c(m, !0);
if (r) return r(m, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = m;
}
var l = i[a] = {
exports: {}
};
t[a][0].call(l.exports, function(e) {
return n(t[a][1][e] || e);
}, l, l.exports, e, t, i, o);
}
return i[a].exports;
}
for (var r = "function" == typeof __require && __require, a = 0; a < o.length; a++) n(o[a]);
return n;
}({
DailyPlayTimeLimitTrait: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "292fbvICARJK47wWAuoIeqJ", "DailyPlayTimeLimitTrait");
var o, n = this && this.__extends || (o = function(e, t) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
})(e, t);
}, function(e, t) {
o(e, t);
function i() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (i.prototype = t.prototype, new i());
}), r = this && this.__decorate || function(e, t, i, o) {
var n, r = arguments.length, a = r < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, i) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, i, o); else for (var s = e.length - 1; s >= 0; s--) (n = e[s]) && (a = (r < 3 ? n(a) : r > 3 ? n(t, i, a) : n(t, i)) || a);
return r > 3 && a && Object.defineProperty(t, i, a), a;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
i.DailyPlayTimeLimitTrait = void 0;
var a = e("./comp/MiniGameDailyTimeCompoment"), s = {
name: "DailyPlayTimeLimitBadge",
url: "prefabs/dailyDelayTimeBadge",
bundleName: "Remote_DailyPlayTimeLimit"
}, m = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.miniGameBtnNode = null;
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "HomePage",
methodName: "addActivityNode"
} ];
};
t.prototype.onActive = function(e) {
var t = TRAIT("AddMoreGameTrait");
if (null == t ? void 0 : t.active) {
if (hs.tp.isAddMoreGameTraitDoPostProcess(e)) {
var i = e.args[0];
if (cc.isValid(i)) {
i.active = this.isMoreGameButton;
this.miniGameBtnNode = i;
this.showDailyBadge(i);
}
}
hs.tp.isHomePageAddActivityNode(e) && this.refreshDailyBadgeTime();
hs.tp.isHomePage_ProxyOnGameShow(e) && this.miniGameDailyTime > 0 && this.refreshDailyBadgeTime();
if (hs.tp.isSetup_ProxyOnSetupShow(e)) {
var o = e.args[0];
this.isMoreGameButton || (o.keys = o.keys.filter(function(e) {
return e !== hs.enSetupKeys.moreGames;
}));
}
}
};
t.prototype.refreshDailyBadgeTime = function() {
this.updateDailyBadgeTime();
if (this.miniGameBtnNode) {
this.showDailyBadge(this.miniGameBtnNode);
this.miniGameBtnNode.active = this.isMoreGameButton;
}
};
Object.defineProperty(t.prototype, "miniGameDailyTime", {
get: function() {
return storage.getItem("miniGameDailyTime", 0);
},
set: function(e) {
storage.setItem("miniGameDailyTime", e);
},
enumerable: !1,
configurable: !0
});
t.prototype.updateDailyBadgeTime = function() {
if (hs.homePageInfo.isInHomePage) {
var e = Date.now(), t = hs.getDiffDays(this.miniGameDailyTime, e);
(0 == this.miniGameDailyTime || t >= 1) && (this.miniGameDailyTime = e);
}
};
Object.defineProperty(t.prototype, "endTime", {
get: function() {
return this.miniGameDailyTime + 36e5;
},
enumerable: !1,
configurable: !0
});
t.prototype.showDailyBadge = function(e) {
var t = this;
hs.UI.show(s, e).then(function(i) {
var o = i.getComponent(a.default), n = e.getContentSize();
o.setState({
posX: -.5 * n.width - 6,
posY: 13,
endTime: t.endTime,
isShow: t.isMoreGameButton
});
});
};
Object.defineProperty(t.prototype, "isMoreGameButton", {
get: function() {
var e = Date.now();
return e < this.endTime && e >= this.miniGameDailyTime;
},
enumerable: !1,
configurable: !0
});
return r([ classId("DailyPlayTimeLimitTrait") ], t);
}(Trait);
i.DailyPlayTimeLimitTrait = m;
cc._RF.pop();
}, {
"./comp/MiniGameDailyTimeCompoment": "MiniGameDailyTimeCompoment"
} ],
MiniGameDailyTimeCompoment: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "f0ee2KCE5FAUa0zTvdBVRsU", "MiniGameDailyTimeCompoment");
var o, n = this && this.__extends || (o = function(e, t) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
})(e, t);
}, function(e, t) {
o(e, t);
function i() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (i.prototype = t.prototype, new i());
}), r = this && this.__decorate || function(e, t, i, o) {
var n, r = arguments.length, a = r < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, i) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, i, o); else for (var s = e.length - 1; s >= 0; s--) (n = e[s]) && (a = (r < 3 ? n(a) : r > 3 ? n(t, i, a) : n(t, i)) || a);
return r > 3 && a && Object.defineProperty(t, i, a), a;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
var a = e("../../../../../../scripts/base/components/Component"), s = cc._decorator, m = s.ccclass, c = s.property, l = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.labelTime = null;
t.countDown = 0;
t._timeFlag = null;
return t;
}
t.prototype.onEnable = function() {
this.labelTime.string = "";
this.node.opacity = 0;
this._timeFlag = setInterval(this.updateTime.bind(this), 1e3);
};
t.prototype.onDisable = function() {
this.cleanTime();
};
t.prototype.cleanTime = function() {
if (this._timeFlag) {
clearInterval(this._timeFlag);
this._timeFlag = null;
}
};
t.prototype.render = function() {
this.node.active = this.state.isShow;
this.node.setPosition(this.state.posX, this.state.posY);
this.countDown = Math.floor((this.state.endTime - Date.now()) / 1e3);
};
t.prototype.updateTime = function() {
if (this.countDown < 0) {
this.node.active = !1;
this.node.parent.active = !1;
this.cleanTime();
} else {
var e = this.countDown--, t = Math.floor(e % 3600 / 60), i = Math.floor(e % 60);
this.labelTime.string = t.toString().padStart(2, "0") + ":" + i.toString().padStart(2, "0");
this.node.opacity = 255;
}
};
r([ c(cc.Label) ], t.prototype, "labelTime", void 0);
return r([ m ], t);
}(a.default);
i.default = l;
cc._RF.pop();
}, {
"../../../../../../scripts/base/components/Component": void 0
} ]
}, {}, [ "DailyPlayTimeLimitTrait", "MiniGameDailyTimeCompoment" ]);
//# sourceMappingURL=index.js.map
