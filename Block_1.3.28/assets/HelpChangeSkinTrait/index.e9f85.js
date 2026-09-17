window.__require = function t(r, e, o) {
function i(s, a) {
if (!e[s]) {
if (!r[s]) {
var l = s.split("/");
l = l[l.length - 1];
if (!r[l]) {
var h = "function" == typeof __require && __require;
if (!a && h) return h(l, !0);
if (n) return n(l, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = l;
}
var c = e[s] = {
exports: {}
};
r[s][0].call(c.exports, function(t) {
return i(r[s][1][t] || t);
}, c, c.exports, t, r, e, o);
}
return e[s].exports;
}
for (var n = "function" == typeof __require && __require, s = 0; s < o.length; s++) i(o[s]);
return i;
}({
HelpChangeSkinTrait: [ function(t, r, e) {
"use strict";
cc._RF.push(r, "a1c46w9gdRMUr1HsNyfCpcR", "HelpChangeSkinTrait");
var o, i = this && this.__extends || (o = function(t, r) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, r) {
t.__proto__ = r;
} || function(t, r) {
for (var e in r) Object.prototype.hasOwnProperty.call(r, e) && (t[e] = r[e]);
})(t, r);
}, function(t, r) {
o(t, r);
function e() {
this.constructor = t;
}
t.prototype = null === r ? Object.create(r) : (e.prototype = r.prototype, new e());
}), n = this && this.__decorate || function(t, r, e, o) {
var i, n = arguments.length, s = n < 3 ? r : null === o ? o = Object.getOwnPropertyDescriptor(r, e) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, r, e, o); else for (var a = t.length - 1; a >= 0; a--) (i = t[a]) && (s = (n < 3 ? i(s) : n > 3 ? i(r, e, s) : i(r, e)) || s);
return n > 3 && s && Object.defineProperty(r, e, s), s;
}, s = this && this.__read || function(t, r) {
var e = "function" == typeof Symbol && t[Symbol.iterator];
if (!e) return t;
var o, i, n = e.call(t), s = [];
try {
for (;(void 0 === r || r-- > 0) && !(o = n.next()).done; ) s.push(o.value);
} catch (t) {
i = {
error: t
};
} finally {
try {
o && !o.done && (e = n.return) && e.call(n);
} finally {
if (i) throw i.error;
}
}
return s;
}, a = this && this.__spread || function() {
for (var t = [], r = 0; r < arguments.length; r++) t = t.concat(s(arguments[r]));
return t;
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.HelpChangeSkinTrait = void 0;
var l = t("../../../../../scripts/modules/algorithm/type/AlgorithmType"), h = function(t) {
i(r, t);
function r() {
return null !== t && t.apply(this, arguments) || this;
}
r.prototype.onActive = function(t) {
hs.tp.isAlgorithm_Skin_ProxyOnSkinReadyComplete(t) && hs.storage.setItem("hasChangedSkin", !0);
hs.tp.isSkin_Block_ProxyOnSkinReadyComplete(t) && hs.storage.setItem("hasChangedSkin", !0);
if (hs.tp.isClassAlgorithmStrategy_Priority_ProxyOnAlgorithmStrategyPriority(t)) {
if (hs.storage.getItem("hasChangedSkin", !1)) return;
var r = hs.algorithmStrategyInfo.algorithmList, e = r && r[0], o = "number" == typeof e && Object.values(hs.OFFER_TYPE_BLANK).includes(e), i = Array.isArray(r) ? a(r) : [];
if (hs.scoreInfo.score <= 3e3) {
hs.algorithmStrategyInfo.setAlgorithmList([ l.OFFER_TYPE.CLEAR_BOARD ]);
i.length && hs.algorithmStrategyInfo.setAlgorithmFailList(i);
hs.algorithmStrategyInfo.setAlgorithmSourceLevel1(hs.ClassAlgorithmSourceType.Priority);
hs.algorithmStrategyInfo.setAlgorithmSourceLevel2(this.traitName);
t.returnState = !0;
} else if (o) {
hs.algorithmStrategyInfo.setAlgorithmList([ l.OFFER_TYPE.CLEAR_BOARD ]);
i.length && hs.algorithmStrategyInfo.setAlgorithmFailList(i);
hs.algorithmStrategyInfo.setAlgorithmSourceLevel1(hs.ClassAlgorithmSourceType.Priority);
hs.algorithmStrategyInfo.setAlgorithmSourceLevel2(this.traitName);
t.returnState = !0;
}
}
if (hs.tp.isAlgorithmProcessInfoTriggerAlgorithmResult(t)) {
var n = t.args[0];
if ((Array.isArray(null == n ? void 0 : n.blockNames) ? n.blockNames : []).some(function(t) {
return "string" == typeof t && -1 !== t.indexOf("清盘");
})) {
hs.algorithmStrategyInfo.setAlgorithmSourceLevel1(hs.ClassAlgorithmSourceType.AlgoTrait);
hs.algorithmStrategyInfo.setAlgorithmSourceLevel2(this.traitName);
}
}
};
return n([ classId("HelpChangeSkinTrait") ], r);
}(Trait);
e.HelpChangeSkinTrait = h;
cc._RF.pop();
}, {
"../../../../../scripts/modules/algorithm/type/AlgorithmType": void 0
} ]
}, {}, [ "HelpChangeSkinTrait" ]);
//# sourceMappingURL=index.js.map
