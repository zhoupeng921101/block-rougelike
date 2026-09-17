window.__require = function e(t, r, n) {
function o(c, f) {
if (!r[c]) {
if (!t[c]) {
var a = c.split("/");
a = a[a.length - 1];
if (!t[a]) {
var p = "function" == typeof __require && __require;
if (!f && p) return p(a, !0);
if (i) return i(a, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = a;
}
var u = r[c] = {
exports: {}
};
t[c][0].call(u.exports, function(e) {
return o(t[c][1][e] || e);
}, u, u.exports, e, t, r, n);
}
return r[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < n.length; c++) o(n[c]);
return o;
}({
HideSettingBeforeChapterTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "e7253wQWglF9bOO4SB4gBMv", "HideSettingBeforeChapterTrait");
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
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(e, t, r, n); else for (var f = e.length - 1; f >= 0; f--) (o = e[f]) && (c = (i < 3 ? o(c) : i > 3 ? o(t, r, c) : o(t, r)) || c);
return i > 3 && c && Object.defineProperty(t, r, c), c;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.HideSettingBeforeChapterTrait = void 0;
var c = function(e) {
o(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onActive = function(e) {
var t;
if (hs.tp.isClassTopInfoUpdateView(e)) {
var r = e.target;
cc.isValid(null === (t = null == r ? void 0 : r.setBtn) || void 0 === t ? void 0 : t.node) && (r.setBtn.node.active = hs.launchInfo.openChapterModule());
}
};
return i([ classId("HideSettingBeforeChapterTrait") ], t);
}(Trait);
r.HideSettingBeforeChapterTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "HideSettingBeforeChapterTrait" ]);
//# sourceMappingURL=index.js.map
