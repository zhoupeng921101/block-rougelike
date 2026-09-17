window.__require = function t(e, r, n) {
function o(i, c) {
if (!r[i]) {
if (!e[i]) {
var p = i.split("/");
p = p[p.length - 1];
if (!e[p]) {
var h = "function" == typeof __require && __require;
if (!c && h) return h(p, !0);
if (a) return a(p, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = p;
}
var u = r[i] = {
exports: {}
};
e[i][0].call(u.exports, function(t) {
return o(e[i][1][t] || t);
}, u, u.exports, t, e, r, n);
}
return r[i].exports;
}
for (var a = "function" == typeof __require && __require, i = 0; i < n.length; i++) o(n[i]);
return o;
}({
ChapterRankPercentTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "cbdb3JyFOhFha3iDCFnzLTG", "ChapterRankPercentTrait");
var n, o = this && this.__extends || (n = function(t, e) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
})(t, e);
}, function(t, e) {
n(t, e);
function r() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
}), a = this && this.__decorate || function(t, e, r, n) {
var o, a = arguments.length, i = a < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, r) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(t, e, r, n); else for (var c = t.length - 1; c >= 0; c--) (o = t[c]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
return a > 3 && i && Object.defineProperty(e, r, i), i;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ChapterRankPercentTrait = void 0;
var i = {
name: "ChapterRankPercent",
url: "prefabs/RankTopIcon",
bundleName: "Remote_ChapterRankPercent"
}, c = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.chapterTopRankNode = null;
return e;
}
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ChapterList",
methodName: "showChapterRankPercent"
} ];
};
e.prototype.onActive = function(t) {
if (hs.tp.isChapterListShowChapterRankPercent(t)) {
var e = t.args[1], r = t.args[0], n = t.target;
if (r) {
this.chapterTopRankNode && hs.UI.hide(this.chapterTopRankNode);
return;
}
var o = 0 == e ? 100 : this.props.rankData[e.toString()];
if (!o) return;
if (n) {
var a = this;
hs.UI.show(i, n.topContainer).then(function(t) {
a.chapterTopRankNode = t;
a.refreshRankData(o);
});
}
}
};
e.prototype.refreshRankData = function(t) {
var e = this.chapterTopRankNode.getComponentInChildren(cc.Label);
if (e) {
var r = this.randomVariation(t);
e.string = r.toString();
}
};
e.prototype.randomVariation = function(t) {
if (100 == t) return t;
var e = .02 * Math.random() - .01;
return Number((t * (1 + e)).toFixed(1));
};
return a([ classId("ChapterRankPercentTrait") ], e);
}(Trait);
r.ChapterRankPercentTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "ChapterRankPercentTrait" ]);
//# sourceMappingURL=index.js.map
