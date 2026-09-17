window.__require = function t(e, r, o) {
function i(a, c) {
if (!r[a]) {
if (!e[a]) {
var s = a.split("/");
s = s[s.length - 1];
if (!e[s]) {
var l = "function" == typeof __require && __require;
if (!c && l) return l(s, !0);
if (n) return n(s, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = s;
}
var p = r[a] = {
exports: {}
};
e[a][0].call(p.exports, function(t) {
return i(e[a][1][t] || t);
}, p, p.exports, t, e, r, o);
}
return r[a].exports;
}
for (var n = "function" == typeof __require && __require, a = 0; a < o.length; a++) i(o[a]);
return i;
}({
ReplaceRewardADToInterstitialTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "56693llrDpE8I7VJMJWVruS", "ReplaceRewardADToInterstitialTrait");
var o, i = this && this.__extends || (o = function(t, e) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
})(t, e);
}, function(t, e) {
o(t, e);
function r() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
}), n = this && this.__decorate || function(t, e, r, o) {
var i, n = arguments.length, a = n < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, r, o); else for (var c = t.length - 1; c >= 0; c--) (i = t[c]) && (a = (n < 3 ? i(a) : n > 3 ? i(e, r, a) : i(e, r)) || a);
return n > 3 && a && Object.defineProperty(e, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ReplaceRewardADToInterstitialTrait = void 0;
var a = function(t) {
i(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.onActive = function(t) {
hs.tp.isClassAdvertisement_RewardProxyShowRewardVideo(t) && this.shouldReplaceWithInterstitial() ? t.args[2] = hs.AD_TYPE.TYPE_4 : hs.tp.isChapterAdvertisement_RewardProxyShowRewardVideo(t) && this.shouldReplaceWithInterstitial() && (t.args[2] = hs.AD_TYPE.TYPE_45);
};
e.prototype.shouldReplaceWithInterstitial = function() {
var t, e = null !== (t = this.props.ad_percent) && void 0 !== t ? t : 0;
return !(e <= 0) && (e >= 100 || 100 * Math.random() <= e);
};
return n([ classId("ReplaceRewardADToInterstitialTrait") ], e);
}(Trait);
r.ReplaceRewardADToInterstitialTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "ReplaceRewardADToInterstitialTrait" ]);
//# sourceMappingURL=index.js.map
