window.__require = function e(t, i, r) {
function n(a, c) {
if (!i[a]) {
if (!t[a]) {
var l = a.split("/");
l = l[l.length - 1];
if (!t[l]) {
var h = "function" == typeof __require && __require;
if (!c && h) return h(l, !0);
if (o) return o(l, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = l;
}
var s = i[a] = {
exports: {}
};
t[a][0].call(s.exports, function(e) {
return n(t[a][1][e] || e);
}, s, s.exports, e, t, i, r);
}
return i[a].exports;
}
for (var o = "function" == typeof __require && __require, a = 0; a < r.length; a++) n(r[a]);
return n;
}({
IsOpenShowUpdateTipWhenLaunchTrait: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "dce0eBrQbFFRKG9uaAjm4O7", "IsOpenShowUpdateTipWhenLaunchTrait");
var r, n = this && this.__extends || (r = function(e, t) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
})(e, t);
}, function(e, t) {
r(e, t);
function i() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (i.prototype = t.prototype, new i());
}), o = this && this.__decorate || function(e, t, i, r) {
var n, o = arguments.length, a = o < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, i) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, i, r); else for (var c = e.length - 1; c >= 0; c--) (n = e[c]) && (a = (o < 3 ? n(a) : o > 3 ? n(t, i, a) : n(t, i)) || a);
return o > 3 && a && Object.defineProperty(t, i, a), a;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
i.IsOpenShowUpdateTipWhenLaunchTrait = void 0;
var a = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.Template1 = "We'll upgrade after <color=#ffd614><size=58>10</size></c> days";
t.Template2 = "We'll upgrade <color=#ffd614><size=52>tomorrow</size></c>";
t.Template3 = "Google Store <color=#ffd614><size=54>Go Go Go</size></c>";
return t;
}
t.prototype.onActive = function(e) {
var t;
if (hs.tp.isLaunchStartEnter(e)) {
if ("1" != hs.gameWayInfo.gameWayNum) return;
if (hs.gameInfo.firstTimeEntry) return;
var i = null === (t = Cinst(hs.Launch)) || void 0 === t ? void 0 : t.node;
if (!cc.isValid(i)) return;
this.originalCaller = e.originalCaller;
this.createLabel(i);
this.updateLabel();
e.replace = !0;
}
};
t.prototype.createLabel = function(e) {
var t = this;
this.richLabel = new cc.Node("updateTip").addComponent(cc.RichText);
this.richLabel.string = "";
this.richLabel.fontSize = 44;
this.richLabel.node.color = new cc.Color(255, 255, 255, 255);
this.richLabel.horizontalAlign = cc.macro.TextAlignment.CENTER;
this.richLabel.lineHeight = 100;
this.richLabel.cacheMode = cc.Label.CacheMode.NONE;
this.richLabel.useSystemFont = !1;
this.richLabel.handleTouchEvent = !1;
this.richLabel.node.setPosition(2, 123, 0);
this.richLabel.node.parent = e;
this.richLabel.node.active = !1;
hs.ResLoader.load("fonts/achievement/Use Font", cc.Font, function(e, i) {
t.delayEnterGame(e ? 0 : t.props.delayTime);
if (!e && cc.isValid(t.richLabel)) {
t.richLabel.useSystemFont = !1;
t.richLabel.font = i;
t.richLabel.node.active = !0;
}
});
};
t.prototype.updateLabel = function() {
if (cc.isValid(this.richLabel)) {
var e = hs.gameInfo.installTime, t = Math.floor((Date.now() - e) / 1e3 / 60 / 60 / 24);
if (14 == t) this.richLabel.string = this.Template2; else if (t < 14) {
var i = 14 - t;
this.richLabel.string = i > 14 ? this.Template1.replace("10", "X") : this.Template1.replace("10", i.toString());
} else this.richLabel.string = this.Template3;
}
};
t.prototype.delayEnterGame = function(e) {
var t = this;
setTimeoutSafe(function() {
var e;
null === (e = t.originalCaller) || void 0 === e || e.call(t);
t.destroyLabel();
}, e);
};
t.prototype.destroyLabel = function() {
if (this.richLabel) {
this.richLabel.node.destroy();
this.richLabel = null;
}
};
return o([ classId("IsOpenShowUpdateTipWhenLaunchTrait") ], t);
}(Trait);
i.IsOpenShowUpdateTipWhenLaunchTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "IsOpenShowUpdateTipWhenLaunchTrait" ]);
//# sourceMappingURL=index.js.map
