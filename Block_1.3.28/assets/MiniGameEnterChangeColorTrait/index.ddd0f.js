window.__require = function e(r, t, n) {
function o(a, c) {
if (!t[a]) {
if (!r[a]) {
var s = a.split("/");
s = s[s.length - 1];
if (!r[s]) {
var u = "function" == typeof __require && __require;
if (!c && u) return u(s, !0);
if (i) return i(s, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = s;
}
var l = t[a] = {
exports: {}
};
r[a][0].call(l.exports, function(e) {
return o(r[a][1][e] || e);
}, l, l.exports, e, r, t, n);
}
return t[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < n.length; a++) o(n[a]);
return o;
}({
MiniGameEnterChangeColorTrait: [ function(e, r, t) {
"use strict";
cc._RF.push(r, "914a9+6zElMsLIy3k50rQiq", "MiniGameEnterChangeColorTrait");
var n, o = this && this.__extends || (n = function(e, r) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, r) {
e.__proto__ = r;
} || function(e, r) {
for (var t in r) Object.prototype.hasOwnProperty.call(r, t) && (e[t] = r[t]);
})(e, r);
}, function(e, r) {
n(e, r);
function t() {
this.constructor = e;
}
e.prototype = null === r ? Object.create(r) : (t.prototype = r.prototype, new t());
}), i = this && this.__decorate || function(e, r, t, n) {
var o, i = arguments.length, a = i < 3 ? r : null === n ? n = Object.getOwnPropertyDescriptor(r, t) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, r, t, n); else for (var c = e.length - 1; c >= 0; c--) (o = e[c]) && (a = (i < 3 ? o(a) : i > 3 ? o(r, t, a) : o(r, t)) || a);
return i > 3 && a && Object.defineProperty(r, t, a), a;
};
Object.defineProperty(t, "__esModule", {
value: !0
});
t.MiniGameEnterChangeColorTrait = void 0;
var a = function(e) {
o(r, e);
function r() {
return null !== e && e.apply(this, arguments) || this;
}
r.prototype.onActive = function(e) {
var r;
if (hs.tp.isGameLobbyGameLobbyNewEntryRefreshBtnAni(e)) {
var t = e.args[0];
if (!cc.isValid(t)) return;
var n = null === (r = t.getChildByName("icon_entrance_export_ske")) || void 0 === r ? void 0 : r.getComponent(dragonBones.ArmatureDisplay);
hs.ResLoader.renderDragonbonesByBundle({
bundleName: "MiniGameEnterChangeColorTrait",
dragonBonesArmatureDisplay: n,
dragonAssetUrl: "dragonbones/icon_entrance_ske",
dragonAtlasAssetUrl: "dragonbones/icon_entrance_tex",
armatureName: null == n ? void 0 : n.armatureName,
animationName: "icon_entrance",
playTimes: 0,
completeRemove: !1
});
}
};
return i([ classId("MiniGameEnterChangeColorTrait") ], r);
}(Trait);
t.MiniGameEnterChangeColorTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "MiniGameEnterChangeColorTrait" ]);
//# sourceMappingURL=index.js.map
