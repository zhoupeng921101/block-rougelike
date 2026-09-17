window.__require = function t(e, r, i) {
function n(c, p) {
if (!r[c]) {
if (!e[c]) {
var s = c.split("/");
s = s[s.length - 1];
if (!e[s]) {
var u = "function" == typeof __require && __require;
if (!p && u) return u(s, !0);
if (o) return o(s, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = s;
}
var a = r[c] = {
exports: {}
};
e[c][0].call(a.exports, function(t) {
return n(e[c][1][t] || t);
}, a, a.exports, t, e, r, i);
}
return r[c].exports;
}
for (var o = "function" == typeof __require && __require, c = 0; c < i.length; c++) n(i[c]);
return n;
}({
AppendLockSkinFirstConditionTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "6d173mYQ3ZAr7qyxn4LkZFc", "AppendLockSkinFirstConditionTrait");
var i, n = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
})(t, e);
}, function(t, e) {
i(t, e);
function r() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
}), o = this && this.__decorate || function(t, e, r, i) {
var n, o = arguments.length, c = o < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, r) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, r, i); else for (var p = t.length - 1; p >= 0; p--) (n = t[p]) && (c = (o < 3 ? n(c) : o > 3 ? n(e, r, c) : n(e, r)) || c);
return o > 3 && c && Object.defineProperty(e, r, c), c;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.AppendLockSkinFirstConditionTrait = void 0;
var c = function(t) {
n(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.onActive = function(t) {
if (hs.tp.isSkin_ProxyOnSkinUpdate(t)) {
if (t.args[0].skinId === hs.skinInfo.currentSkinId) return;
if (this.isCanLockSkin()) return;
t.returnState = !0;
t.replace = !0;
}
if (hs.tp.isSetup_ProxyUpdateUI(t)) {
if (this.isCanLockSkin()) return;
t.disable([ "SetAddRandomSwitchTrait" ]);
}
if (hs.tp.isSetup_ProxyOnSetupShow(t)) {
if (this.isCanLockSkin()) return;
t.disable([ "SetAddRandomSwitchTrait", "SetAddDefultSkinBtnTrait" ]);
}
};
e.prototype.isCanLockSkin = function() {
return storage.getItem("classHighScore", 0) >= this.props.scoreLimit || (storage.getItem("chapterPeriodsIndex", 1) > 1 || storage.getItem("chapterNum", 0) >= this.props.chapterNumLimit);
};
return o([ classId("AppendLockSkinFirstConditionTrait") ], e);
}(Trait);
r.AppendLockSkinFirstConditionTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "AppendLockSkinFirstConditionTrait" ]);
//# sourceMappingURL=index.js.map
