window.__require = function t(e, i, r) {
function n(a, f) {
if (!i[a]) {
if (!e[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!e[c]) {
var u = "function" == typeof __require && __require;
if (!f && u) return u(c, !0);
if (o) return o(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var g = i[a] = {
exports: {}
};
e[a][0].call(g.exports, function(t) {
return n(e[a][1][t] || t);
}, g, g.exports, t, e, i, r);
}
return i[a].exports;
}
for (var o = "function" == typeof __require && __require, a = 0; a < r.length; a++) n(r[a]);
return n;
}({
FixOriginChapterConfigCacheTrait: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "760d0OXZsBI6KMFDDl0pXU4", "FixOriginChapterConfigCacheTrait");
var r, n = this && this.__extends || (r = function(t, e) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
})(t, e);
}, function(t, e) {
r(t, e);
function i() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype, new i());
}), o = this && this.__decorate || function(t, e, i, r) {
var n, o = arguments.length, a = o < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, i) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, i, r); else for (var f = t.length - 1; f >= 0; f--) (n = t[f]) && (a = (o < 3 ? n(a) : o > 3 ? n(e, i, a) : n(e, i)) || a);
return o > 3 && a && Object.defineProperty(e, i, a), a;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
i.FixOriginChapterConfigCacheTrait = void 0;
var a = function(t) {
n(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.onActive = function(t) {
var e, i;
if (hs.tp.isChapterCollectionProducerITMDAInfoCacheOriginChapterConfig(t)) {
t.replace = !0;
this.cacheOriginChapterConfig(null === (e = null == t ? void 0 : t.args) || void 0 === e ? void 0 : e[0]);
}
if (hs.tp.isChapterCollectionProducerITMDAInfoGetOriginChapterConfig(t)) {
t.replace = !0;
t.returnState = !0;
t.returnValue = this.getOriginChapterConfig(null === (i = null == t ? void 0 : t.args) || void 0 === i ? void 0 : i[0]);
}
};
e.prototype.cacheOriginChapterConfig = function(t) {
var e, i, r, n = storage.getItem("FixOriginChapterConfigCache-data", {
stage: 1,
config: null
}), o = null !== (i = null === (e = null === hs || void 0 === hs ? void 0 : hs.chapterGameInfo) || void 0 === e ? void 0 : e.stage) && void 0 !== i ? i : 1;
if ("undefined" != typeof (null == t ? void 0 : t.Num) && (o != n.stage || (null === (r = n.config) || void 0 === r ? void 0 : r.Num) != t.Num)) {
if (n.config && n.stage == o) {
n.config.Num = Number(n.config.Num);
for (var a = 0; a < hs.chapterConfigInfo.chapterDatasCfg.length; a++) if (Number(hs.chapterConfigInfo.chapterDatasCfg[a].Num) === n.config.Num) {
hs.chapterConfigInfo.chapterDatasCfg[a] = n.config;
break;
}
}
storage.setItem("FixOriginChapterConfigCache-data", {
stage: o,
config: t
});
}
};
e.prototype.getOriginChapterConfig = function(t) {
var e, i, r, n = storage.getItem("FixOriginChapterConfigCache-data", {
stage: 1,
config: null
}), o = null !== (i = null === (e = null === hs || void 0 === hs ? void 0 : hs.chapterGameInfo) || void 0 === e ? void 0 : e.stage) && void 0 !== i ? i : 1;
return n.stage !== o ? null : Number(null === (r = n.config) || void 0 === r ? void 0 : r.Num) === t + 1 ? n.config : null;
};
return o([ classId("FixOriginChapterConfigCacheTrait") ], e);
}(Trait);
i.FixOriginChapterConfigCacheTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "FixOriginChapterConfigCacheTrait" ]);
//# sourceMappingURL=index.js.map
