window.__require = function r(t, e, o) {
function i(n, a) {
if (!e[n]) {
if (!t[n]) {
var c = n.split("/");
c = c[c.length - 1];
if (!t[c]) {
var s = "function" == typeof __require && __require;
if (!a && s) return s(c, !0);
if (l) return l(c, !0);
throw new Error("Cannot find module '" + n + "'");
}
n = c;
}
var f = e[n] = {
exports: {}
};
t[n][0].call(f.exports, function(r) {
return i(t[n][1][r] || r);
}, f, f.exports, r, t, e, o);
}
return e[n].exports;
}
for (var l = "function" == typeof __require && __require, n = 0; n < o.length; n++) i(o[n]);
return i;
}({
AlgoFillSortReplaceTraitOfferConfig: [ function(r, t, e) {
"use strict";
cc._RF.push(t, "a51adD7+AZLK4Du0D3A4DC/", "AlgoFillSortReplaceTraitOfferConfig");
Object.defineProperty(e, "__esModule", {
value: !0
});
e.AlgoFillSortReplaceIdConfig = e.AlgoFillSortSourceIdConfig = void 0;
e.AlgoFillSortSourceIdConfig = {
1: hs.OFFER_TYPE.ALL_COMBINATION_ID70,
2: hs.OFFER_TYPE.ALL_COMBINATION_ID9
};
e.AlgoFillSortReplaceIdConfig = {
1: hs.OFFER_TYPE.ALL_COMBINATION_ID70,
2: hs.OFFER_TYPE.ALL_COMBINATION_ID9
};
cc._RF.pop();
}, {} ],
AlgoFillSortReplaceTrait: [ function(r, t, e) {
"use strict";
cc._RF.push(t, "b3297X6zSBJGLnmF4ODz/A8", "AlgoFillSortReplaceTrait");
var o, i = this && this.__extends || (o = function(r, t) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(r, t) {
r.__proto__ = t;
} || function(r, t) {
for (var e in t) Object.prototype.hasOwnProperty.call(t, e) && (r[e] = t[e]);
})(r, t);
}, function(r, t) {
o(r, t);
function e() {
this.constructor = r;
}
r.prototype = null === t ? Object.create(t) : (e.prototype = t.prototype, new e());
}), l = this && this.__decorate || function(r, t, e, o) {
var i, l = arguments.length, n = l < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, e) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(r, t, e, o); else for (var a = r.length - 1; a >= 0; a--) (i = r[a]) && (n = (l < 3 ? i(n) : l > 3 ? i(t, e, n) : i(t, e)) || n);
return l > 3 && n && Object.defineProperty(t, e, n), n;
}, n = this && this.__values || function(r) {
var t = "function" == typeof Symbol && Symbol.iterator, e = t && r[t], o = 0;
if (e) return e.call(r);
if (r && "number" == typeof r.length) return {
next: function() {
r && o >= r.length && (r = void 0);
return {
value: r && r[o++],
done: !r
};
}
};
throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.AlgoFillSortReplaceTrait = void 0;
var a = r("../config/AlgoFillSortReplaceTraitOfferConfig"), c = function(r) {
i(t, r);
function t() {
var t = null !== r && r.apply(this, arguments) || this;
t.random = -1;
return t;
}
t.prototype.onActive = function(r) {
var t;
if (hs.tp.isClassAlgorithmProcessInfoBottomOfferBefore(r) && (null === (t = r.args[0]) || void 0 === t ? void 0 : t.length) > 0) {
var e = r.args[0], o = this.props.sid, i = a.AlgoFillSortSourceIdConfig[o];
if (!this.checkIsReplace(e)) return;
var l = this.props.replaceIdList || [];
r.args[0] = this.replaceAlgo(e, l, i);
}
if (hs.tp.isClassAlgorithmStrategy_Replace_ProxyPreprocessingAlgorithm(r)) {
var n = hs.algorithmStrategyInfo.algorithmList, c = hs.algorithmStrategyInfo.algorithmFailList, s = hs.algorithmStrategyInfo.algorithmSuccessList, f = hs.algorithmStrategyInfo.algorithmPriorityList;
l = this.props.replaceIdList || [], o = a.AlgoFillSortSourceIdConfig[this.props.sid];
this.replaceAlgo(n, l, o);
this.replaceAlgo(c, l, o);
this.replaceAlgo(f, l, o);
this.replaceAlgo(s, l, o);
}
hs.tp.isClassAlgorithmStrategy_Run_ProxyResetAlgorithmData(r) && (this.random = Math.random());
};
t.prototype.replaceAlgo = function(r, t, e) {
var o, i, l = 0;
t.sort(function(r, t) {
return r.rate - t.rate;
});
try {
for (var c = n(t), s = c.next(); !s.done; s = c.next()) {
var f = s.value, p = f.rate, g = f.rid;
l += p;
var u = a.AlgoFillSortReplaceIdConfig[g];
if (u && this.random <= l) {
r = hs.algorithmStrategyLogic.replaceAlgorithmType(r, e, u);
break;
}
}
} catch (r) {
o = {
error: r
};
} finally {
try {
s && !s.done && (i = c.return) && i.call(c);
} finally {
if (o) throw o.error;
}
}
return r;
};
t.prototype.checkIsReplace = function(r) {
var t = this.props.sid, e = a.AlgoFillSortSourceIdConfig[t];
return !!e && !!r.includes(e);
};
return l([ classId("AlgoFillSortReplaceTrait") ], t);
}(Trait);
e.AlgoFillSortReplaceTrait = c;
cc._RF.pop();
}, {
"../config/AlgoFillSortReplaceTraitOfferConfig": "AlgoFillSortReplaceTraitOfferConfig"
} ]
}, {}, [ "AlgoFillSortReplaceTraitOfferConfig", "AlgoFillSortReplaceTrait" ]);
//# sourceMappingURL=index.js.map
