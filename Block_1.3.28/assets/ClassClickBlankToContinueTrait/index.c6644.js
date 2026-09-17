window.__require = function t(n, e, o) {
function i(l, c) {
if (!e[l]) {
if (!n[l]) {
var a = l.split("/");
a = a[a.length - 1];
if (!n[a]) {
var u = "function" == typeof __require && __require;
if (!c && u) return u(a, !0);
if (r) return r(a, !0);
throw new Error("Cannot find module '" + l + "'");
}
l = a;
}
var s = e[l] = {
exports: {}
};
n[l][0].call(s.exports, function(t) {
return i(n[l][1][t] || t);
}, s, s.exports, t, n, e, o);
}
return e[l].exports;
}
for (var r = "function" == typeof __require && __require, l = 0; l < o.length; l++) i(o[l]);
return i;
}({
ClassClickBlankToContinueTrait: [ function(t, n, e) {
"use strict";
cc._RF.push(n, "f26bcF95XxNJ7hrnySJQ32o", "ClassClickBlankToContinueTrait");
var o, i = this && this.__extends || (o = function(t, n) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, n) {
t.__proto__ = n;
} || function(t, n) {
for (var e in n) Object.prototype.hasOwnProperty.call(n, e) && (t[e] = n[e]);
})(t, n);
}, function(t, n) {
o(t, n);
function e() {
this.constructor = t;
}
t.prototype = null === n ? Object.create(n) : (e.prototype = n.prototype, new e());
}), r = this && this.__decorate || function(t, n, e, o) {
var i, r = arguments.length, l = r < 3 ? n : null === o ? o = Object.getOwnPropertyDescriptor(n, e) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) l = Reflect.decorate(t, n, e, o); else for (var c = t.length - 1; c >= 0; c--) (i = t[c]) && (l = (r < 3 ? i(l) : r > 3 ? i(n, e, l) : i(n, e)) || l);
return r > 3 && l && Object.defineProperty(n, e, l), l;
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.ClassClickBlankToContinueTrait = void 0;
var l = function(t) {
i(n, t);
function n() {
return null !== t && t.apply(this, arguments) || this;
}
n.prototype.onActive = function(t) {
var n, e, o, i;
if (hs.tp.isClassWinAddNode(t) || hs.tp.isClassFailAddNode(t)) {
var r = t.target;
if (r) {
var l = this.createBlankNode("blankNode");
l.on("click", function() {
var t;
cc.isValid(r) && (null === (t = r.onClickPlay) || void 0 === t || t.call(r, null, null));
});
null === (n = r.node) || void 0 === n || n.addChild(l);
l.setSiblingIndex(null !== (i = null === (o = null === (e = r.playBtn) || void 0 === e ? void 0 : e.node) || void 0 === o ? void 0 : o.getSiblingIndex()) && void 0 !== i ? i : 0);
}
}
};
n.prototype.createBlankNode = function(t) {
var n, e, o = new cc.Node(t);
o.width = null !== (n = this.props.width) && void 0 !== n ? n : cc.winSize.width;
o.height = null !== (e = this.props.height) && void 0 !== e ? e : .6 * cc.winSize.height;
o.addComponent(cc.Button);
return o;
};
return r([ classId("ClassClickBlankToContinueTrait") ], n);
}(Trait);
e.ClassClickBlankToContinueTrait = l;
cc._RF.pop();
}, {} ]
}, {}, [ "ClassClickBlankToContinueTrait" ]);
//# sourceMappingURL=index.js.map
