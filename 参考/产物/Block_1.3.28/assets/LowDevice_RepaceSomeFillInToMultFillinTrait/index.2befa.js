window.__require = function t(e, i, r) {
function o(l, s) {
if (!i[l]) {
if (!e[l]) {
var c = l.split("/");
c = c[c.length - 1];
if (!e[c]) {
var a = "function" == typeof __require && __require;
if (!s && a) return a(c, !0);
if (n) return n(c, !0);
throw new Error("Cannot find module '" + l + "'");
}
l = c;
}
var u = i[l] = {
exports: {}
};
e[l][0].call(u.exports, function(t) {
return o(e[l][1][t] || t);
}, u, u.exports, t, e, i, r);
}
return i[l].exports;
}
for (var n = "function" == typeof __require && __require, l = 0; l < r.length; l++) o(r[l]);
return o;
}({
LowDevice_RepaceSomeFillInToMultFillinTrait: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "aa0c1DmnUVLgbK7Jqj/EQXq", "LowDevice_RepaceSomeFillInToMultFillinTrait");
var r, o = this && this.__extends || (r = function(t, e) {
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
}), n = this && this.__decorate || function(t, e, i, r) {
var o, n = arguments.length, l = n < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, i) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) l = Reflect.decorate(t, e, i, r); else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (l = (n < 3 ? o(l) : n > 3 ? o(e, i, l) : o(e, i)) || l);
return n > 3 && l && Object.defineProperty(e, i, l), l;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
i.LowDevice_RepaceSomeFillInToMultFillinTrait = void 0;
var l = [ hs.OFFER_TYPE.TIAN_KONG_XIAO_CHU, hs.OFFER_TYPE.TRAVEL_TIAN_KONG_XIAO_CHU, hs.OFFER_TYPE.EMPTYDONGFILL ], s = function(t) {
o(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.onActive = function(t) {
if (hs.gameInfo.gameMode == hs.GameMode.Class) {
hs.tp.isClassAlgorithmStrategy_Replace_ProxyPreprocessingAlgorithm(t) && this._tryInsertMultiClearAlgorithm();
if (hs.tp.isClassAlgorithmProcessInfoBottomOffer(t) && l.includes(hs.algorithmName.algoActualIdByPos)) {
t.args[0] = [ hs.OFFER_TYPE.DUO_XIAO ];
t.returnState = !0;
}
}
};
e.prototype._tryInsertMultiClearAlgorithm = function() {
var t = hs.algorithmStrategyInfo;
this._insertInList(t.algorithmList, "algorithmList");
this._insertInList(t.algorithmFailList, "algorithmFailList");
this._insertInList(t.algorithmSuccessList, "algorithmSuccessList");
this._insertInList(t.algorithmPriorityList, "algorithmPriorityList");
};
e.prototype._insertInList = function(t) {
if (t && 0 !== t.length) for (var e = t.length - 1; e >= 0; e--) {
var i = t[e];
l.includes(i) && t.splice(e, 0, hs.OFFER_TYPE.DUO_XIAO);
}
};
return n([ classId("LowDevice_RepaceSomeFillInToMultFillinTrait"), classMethodWatch() ], e);
}(Trait);
i.LowDevice_RepaceSomeFillInToMultFillinTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "LowDevice_RepaceSomeFillInToMultFillinTrait" ]);
//# sourceMappingURL=index.js.map
