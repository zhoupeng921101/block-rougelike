window.__require = function t(e, n, o) {
function i(l, c) {
if (!n[l]) {
if (!e[l]) {
var a = l.split("/");
a = a[a.length - 1];
if (!e[a]) {
var u = "function" == typeof __require && __require;
if (!c && u) return u(a, !0);
if (r) return r(a, !0);
throw new Error("Cannot find module '" + l + "'");
}
l = a;
}
var d = n[l] = {
exports: {}
};
e[l][0].call(d.exports, function(t) {
return i(e[l][1][t] || t);
}, d, d.exports, t, e, n, o);
}
return n[l].exports;
}
for (var r = "function" == typeof __require && __require, l = 0; l < o.length; l++) i(o[l]);
return i;
}({
ChapterClickBlankToContinueTrait: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "a7625X+kXtN2Iva9GeSjVkt", "ChapterClickBlankToContinueTrait");
var o, i = this && this.__extends || (o = function(t, e) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
})(t, e);
}, function(t, e) {
o(t, e);
function n() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
}), r = this && this.__decorate || function(t, e, n, o) {
var i, r = arguments.length, l = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) l = Reflect.decorate(t, e, n, o); else for (var c = t.length - 1; c >= 0; c--) (i = t[c]) && (l = (r < 3 ? i(l) : r > 3 ? i(e, n, l) : i(e, n)) || l);
return r > 3 && l && Object.defineProperty(e, n, l), l;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.ChapterClickBlankToContinueTrait = void 0;
var l = function(t) {
i(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.onActive = function(t) {
var e, n, o, i, r, l, c;
if (hs.tp.isChapterScoreWinAddNode(t) || hs.tp.isChapterScoreFailAddNode(t) || hs.tp.isChapterCollectWinAddNode(t) || hs.tp.isChapterCollectFailAddNode(t)) {
var a = t.target;
if (a) {
var u = this.createBlankNode("blankNode");
u.on("click", function() {
var t;
cc.isValid(a) && (null === (t = a.onClickPlay) || void 0 === t || t.call(a, null, null));
});
null === (e = a.node) || void 0 === e || e.addChild(u);
var d = Math.min(null !== (i = null === (o = null === (n = a.playBtn) || void 0 === n ? void 0 : n.node) || void 0 === o ? void 0 : o.getSiblingIndex()) && void 0 !== i ? i : 0, null !== (c = null === (l = null === (r = a.backBtn) || void 0 === r ? void 0 : r.node) || void 0 === l ? void 0 : l.getSiblingIndex()) && void 0 !== c ? c : 0);
u.setSiblingIndex(d);
}
}
};
e.prototype.createBlankNode = function(t) {
var e, n, o = new cc.Node(t);
o.width = null !== (e = this.props.width) && void 0 !== e ? e : cc.winSize.width;
o.height = null !== (n = this.props.height) && void 0 !== n ? n : .6 * cc.winSize.height;
o.addComponent(cc.Button);
return o;
};
return r([ classId("ChapterClickBlankToContinueTrait") ], e);
}(Trait);
n.ChapterClickBlankToContinueTrait = l;
cc._RF.pop();
}, {} ]
}, {}, [ "ChapterClickBlankToContinueTrait" ]);
//# sourceMappingURL=index.js.map
