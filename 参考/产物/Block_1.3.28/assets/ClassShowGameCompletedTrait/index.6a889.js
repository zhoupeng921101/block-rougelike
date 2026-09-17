window.__require = function e(t, r, o) {
function n(a, s) {
if (!r[a]) {
if (!t[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!t[c]) {
var l = "function" == typeof __require && __require;
if (!s && l) return l(c, !0);
if (i) return i(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var p = r[a] = {
exports: {}
};
t[a][0].call(p.exports, function(e) {
return n(t[a][1][e] || e);
}, p, p.exports, e, t, r, o);
}
return r[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < o.length; a++) n(o[a]);
return n;
}({
ClassShowGameCompletedTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "b5daaZUT5tHfonYooTO+wyy", "ClassShowGameCompletedTrait");
var o, n = this && this.__extends || (o = function(e, t) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
o(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), i = this && this.__decorate || function(e, t, r, o) {
var n, i = arguments.length, a = i < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, o); else for (var s = e.length - 1; s >= 0; s--) (n = e[s]) && (a = (i < 3 ? n(a) : i > 3 ? n(t, r, a) : n(t, r)) || a);
return i > 3 && a && Object.defineProperty(t, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ClassShowGameCompletedTrait = void 0;
var a = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.sucReplace = !1;
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassGameOver_Proxy",
methodName: "onClassGameOverShowFinish"
} ];
};
t.prototype.onActive = function(e) {
var t = this;
if (hs.tp.isClassGameOver_ProxyOnClassGameOverShowFinish(e)) {
if (this.sucReplace) return;
var r = e.args[0].option.overNode;
hs.ResLoader.loadByBundle("ClassShowGameCompletedTrait", "textures/completed", cc.SpriteFrame, function(e, o) {
if (!e && r && cc.isValid(r)) {
var n = r.getChildByName("overTitle");
if (n && cc.isValid(n) && n.getComponent(cc.Sprite)) {
n.getComponent(cc.Sprite).spriteFrame = o;
t.sucReplace = !0;
}
}
});
}
};
return i([ classId("ClassShowGameCompletedTrait") ], t);
}(Trait);
r.ClassShowGameCompletedTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "ClassShowGameCompletedTrait" ]);
//# sourceMappingURL=index.js.map
