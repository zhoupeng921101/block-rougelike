window.__require = function e(t, r, n) {
function o(c, a) {
if (!r[c]) {
if (!t[c]) {
var u = c.split("/");
u = u[u.length - 1];
if (!t[u]) {
var s = "function" == typeof __require && __require;
if (!a && s) return s(u, !0);
if (i) return i(u, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = u;
}
var f = r[c] = {
exports: {}
};
t[c][0].call(f.exports, function(e) {
return o(t[c][1][e] || e);
}, f, f.exports, e, t, r, n);
}
return r[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < n.length; c++) o(n[c]);
return o;
}({
NoLimitClearScreenTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "c3b8ciUi7NOmpuLDQyX8XnE", "NoLimitClearScreenTrait");
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
var o, i = arguments.length, c = i < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, r) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(e, t, r, n); else for (var a = e.length - 1; a >= 0; a--) (o = e[a]) && (c = (i < 3 ? o(c) : i > 3 ? o(t, r, c) : o(t, r)) || c);
return i > 3 && c && Object.defineProperty(t, r, c), c;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.NoLimitClearScreenTrait = void 0;
var c = function(e) {
o(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onActive = function(e) {
if (hs.tp.isClassBoardSplashAnimation_ProxyIsUnlockClearScreenEffect(e) && hs.storage.getItem("classGuideStep", 0) > 2) {
e.returnState = !0;
e.returnValue = !0;
e.replace = !0;
}
if (hs.tp.isClassScore_ProxyIsUnlockClearScreenEffect(e) && hs.storage.getItem("classGuideStep", 0) > 2) {
e.returnState = !0;
e.returnValue = !0;
e.replace = !0;
}
};
return i([ classId("NoLimitClearScreenTrait") ], t);
}(Trait);
r.NoLimitClearScreenTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "NoLimitClearScreenTrait" ]);
//# sourceMappingURL=index.js.map
