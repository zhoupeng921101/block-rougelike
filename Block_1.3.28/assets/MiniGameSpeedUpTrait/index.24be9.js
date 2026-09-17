window.__require = function e(t, r, n) {
function o(p, c) {
if (!r[p]) {
if (!t[p]) {
var a = p.split("/");
a = a[a.length - 1];
if (!t[a]) {
var s = "function" == typeof __require && __require;
if (!c && s) return s(a, !0);
if (i) return i(a, !0);
throw new Error("Cannot find module '" + p + "'");
}
p = a;
}
var u = r[p] = {
exports: {}
};
t[p][0].call(u.exports, function(e) {
return o(t[p][1][e] || e);
}, u, u.exports, e, t, r, n);
}
return r[p].exports;
}
for (var i = "function" == typeof __require && __require, p = 0; p < n.length; p++) o(n[p]);
return o;
}({
MiniGameSpeedUpTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "6a1a7eT4KlLN4mQ7rwdc4nA", "MiniGameSpeedUpTrait");
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
var o, i = arguments.length, p = i < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, r) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) p = Reflect.decorate(e, t, r, n); else for (var c = e.length - 1; c >= 0; c--) (o = e[c]) && (p = (i < 3 ? o(p) : i > 3 ? o(t, r, p) : o(t, r)) || p);
return i > 3 && p && Object.defineProperty(t, r, p), p;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.MiniGameSpeedUpTrait = void 0;
var p = function(e) {
o(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "JewelKSpeed_Proxy",
methodName: "setKSpeed"
} ];
};
t.prototype.getAcc = function() {
return this.props.acc <= 0 ? 1 : this.props.acc;
};
t.prototype.onActive = function(e) {
if (hs.tp.isGameLobby_ProxyOnEnterMiniGameSuccess(e)) {
this.setSpeedUp();
e.replace = !0;
}
hs.tp.isJewelKSpeed_ProxySetKSpeed(e) && (e.args[0] = this.getAcc());
};
t.prototype.setSpeedUp = function() {
cc.director._kSpeed = this.getAcc();
};
return i([ classId("MiniGameSpeedUpTrait") ], t);
}(Trait);
r.MiniGameSpeedUpTrait = p;
cc._RF.pop();
}, {} ]
}, {}, [ "MiniGameSpeedUpTrait" ]);
//# sourceMappingURL=index.js.map
