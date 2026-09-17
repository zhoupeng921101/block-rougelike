window.__require = function e(t, r, n) {
function o(a, c) {
if (!r[a]) {
if (!t[a]) {
var u = a.split("/");
u = u[u.length - 1];
if (!t[u]) {
var p = "function" == typeof __require && __require;
if (!c && p) return p(u, !0);
if (i) return i(u, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = u;
}
var s = r[a] = {
exports: {}
};
t[a][0].call(s.exports, function(e) {
return o(t[a][1][e] || e);
}, s, s.exports, e, t, r, n);
}
return r[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < n.length; a++) o(n[a]);
return o;
}({
MiniGameSetEnterChangeColorTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "ac7c56uY/tPhJo0X+K6SLgj", "MiniGameSetEnterChangeColorTrait");
var n, o = this && this.__extends || (n = function(e, t) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
n(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), i = this && this.__decorate || function(e, t, r, n) {
var o, i = arguments.length, a = i < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, r) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, n); else for (var c = e.length - 1; c >= 0; c--) (o = e[c]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, r, a) : o(t, r)) || a);
return i > 3 && a && Object.defineProperty(t, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.MiniGameSetEnterChangeColorTrait = void 0;
var a = function(e) {
o(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onActive = function(e) {
if (hs.tp.isSetupBtnItemInitUI(e)) {
var t = e.target;
if (t && t.state.key === hs.enSetupKeys.moreGames) {
var r = t.node.getComponent(cc.Sprite);
hs.ResLoader.renderSpriteByBundle(r, "img/setting_btn_common_purple", "MiniGameSetEnterChangeColorTrait");
var n = t.icon_img;
hs.ResLoader.renderSpriteByBundle(n, "img/setting_icon_moreGames_purple", "MiniGameSetEnterChangeColorTrait");
var o = t.txt_img;
hs.ResLoader.renderSpriteByBundle(o, "img/setting_txt_moreGames_purple", "MiniGameSetEnterChangeColorTrait");
t.refreshRedPointUI();
e.replace = !0;
e.returnState = !0;
}
}
};
return i([ classId("MiniGameSetEnterChangeColorTrait") ], t);
}(Trait);
r.MiniGameSetEnterChangeColorTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "MiniGameSetEnterChangeColorTrait" ]);
//# sourceMappingURL=index.js.map
