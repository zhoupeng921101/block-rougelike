window.__require = function t(e, r, i) {
function o(a, s) {
if (!r[a]) {
if (!e[a]) {
var p = a.split("/");
p = p[p.length - 1];
if (!e[p]) {
var u = "function" == typeof __require && __require;
if (!s && u) return u(p, !0);
if (n) return n(p, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = p;
}
var l = r[a] = {
exports: {}
};
e[a][0].call(l.exports, function(t) {
return o(e[a][1][t] || t);
}, l, l.exports, t, e, r, i);
}
return r[a].exports;
}
for (var n = "function" == typeof __require && __require, a = 0; a < i.length; a++) o(i[a]);
return o;
}({
FixLastStageRepeatDisplayTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "3853dzqFd5FjIRF4zmB0l+I", "FixLastStageRepeatDisplayTrait");
var i, o = this && this.__extends || (i = function(t, e) {
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
}), n = this && this.__decorate || function(t, e, r, i) {
var o, n = arguments.length, a = n < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, r) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, r, i); else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (a = (n < 3 ? o(a) : n > 3 ? o(e, r, a) : o(e, r)) || a);
return n > 3 && a && Object.defineProperty(e, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.FixLastStageRepeatDisplayTrait = void 0;
var a = function(t) {
o(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.onActive = function(t) {
hs.tp.isTravel_pass_animationTraitGetIsThrough(t) && t.args[0] && !this._is_exist_next_data_() && (t.args[0] = !1);
hs.tp.isTravel_pass_animationTraitGetIsOverChapterMaxNum(t) && (t.args[0] = hs.chapterConfigInfo.isChapterMaxNum);
};
e.prototype._is_exist_next_data_ = function() {
var t, e, r, i, o;
return (null !== (e = null === (t = null === hs || void 0 === hs ? void 0 : hs.chapterGameInfo) || void 0 === t ? void 0 : t.stage) && void 0 !== e ? e : 1) < (null !== (o = null === (i = null === (r = null === hs || void 0 === hs ? void 0 : hs.themeInfo) || void 0 === r ? void 0 : r.getThemeConfig()) || void 0 === i ? void 0 : i.length) && void 0 !== o ? o : 0);
};
return n([ classId("FixLastStageRepeatDisplayTrait") ], e);
}(Trait);
r.FixLastStageRepeatDisplayTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "FixLastStageRepeatDisplayTrait" ]);
//# sourceMappingURL=index.js.map
