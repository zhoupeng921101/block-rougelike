window.__require = function t(e, r, o) {
function n(i, s) {
if (!r[i]) {
if (!e[i]) {
var a = i.split("/");
a = a[a.length - 1];
if (!e[a]) {
var u = "function" == typeof __require && __require;
if (!s && u) return u(a, !0);
if (c) return c(a, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = a;
}
var f = r[i] = {
exports: {}
};
e[i][0].call(f.exports, function(t) {
return n(e[i][1][t] || t);
}, f, f.exports, t, e, r, o);
}
return r[i].exports;
}
for (var c = "function" == typeof __require && __require, i = 0; i < o.length; i++) n(o[i]);
return n;
}({
ClassBtnShowScoreTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "b39ffccyalG0oQCtPn8mbmd", "ClassBtnShowScoreTrait");
var o, n = this && this.__extends || (o = function(t, e) {
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
}), c = this && this.__decorate || function(t, e, r, o) {
var n, c = arguments.length, i = c < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(t, e, r, o); else for (var s = t.length - 1; s >= 0; s--) (n = t[s]) && (i = (c < 3 ? n(i) : c > 3 ? n(e, r, i) : n(e, r)) || i);
return c > 3 && i && Object.defineProperty(e, r, i), i;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ClassBtnShowScoreTrait = void 0;
var i = {
name: "classBtnShowScore",
url: "prefabs/classCurrentScore",
bundleName: "Remote_classBtnShowScore"
}, s = function(t) {
n(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.onActive = function(t) {
if (hs.tp.isHomePageSectionClassBtnDefaultAddChildToBtn(t)) {
if (hs.gameInfo.gameEntryCount < 2) return;
var e = t.target.node, r = i;
hs.UI.show(r, e).then(function(t) {
var e;
t.setPosition(cc.v2(70, -40));
var r = null === (e = t.getChildByName("scoreLab")) || void 0 === e ? void 0 : e.getComponent(cc.Label);
r && (r.string = "" + hs.classScoreInfo.score);
}).catch(function() {});
}
};
return c([ classId("ClassBtnShowScoreTrait") ], e);
}(Trait);
r.ClassBtnShowScoreTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "ClassBtnShowScoreTrait" ]);
//# sourceMappingURL=index.js.map
