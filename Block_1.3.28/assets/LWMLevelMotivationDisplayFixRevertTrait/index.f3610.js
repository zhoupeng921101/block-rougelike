window.__require = function t(e, r, i) {
function o(a, c) {
if (!r[a]) {
if (!e[a]) {
var u = a.split("/");
u = u[u.length - 1];
if (!e[u]) {
var l = "function" == typeof __require && __require;
if (!c && l) return l(u, !0);
if (n) return n(u, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = u;
}
var p = r[a] = {
exports: {}
};
e[a][0].call(p.exports, function(t) {
return o(e[a][1][t] || t);
}, p, p.exports, t, e, r, i);
}
return r[a].exports;
}
for (var n = "function" == typeof __require && __require, a = 0; a < i.length; a++) o(i[a]);
return o;
}({
LWMLevelMotivationDisplayFixRevertTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "b0ee8PG+hdI4aAFQH8L445X", "LWMLevelMotivationDisplayFixRevertTrait");
var i, o = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
})(t, e);
}, function(t, e) {
i(t, e);
function r() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
}), n = this && this.__decorate || function(t, e, r, i) {
var o, n = arguments.length, a = n < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, r) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, r, i); else for (var c = t.length - 1; c >= 0; c--) (o = t[c]) && (a = (n < 3 ? o(a) : n > 3 ? o(e, r, a) : o(e, r)) || a);
return n > 3 && a && Object.defineProperty(e, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.LWMLevelMotivationDisplayFixRevertTrait = void 0;
var a = function(t) {
o(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.onActive = function(t) {
hs.tp.isLWMLevelMotivationDisplayTraitUseOldLogic(t) && (t.returnValue = !0);
};
return n([ classId("LWMLevelMotivationDisplayFixRevertTrait") ], e);
}(Trait);
r.LWMLevelMotivationDisplayFixRevertTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "LWMLevelMotivationDisplayFixRevertTrait" ]);
//# sourceMappingURL=index.js.map
