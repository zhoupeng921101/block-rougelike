window.__require = function t(i, e, r) {
function n(s, a) {
if (!e[s]) {
if (!i[s]) {
var l = s.split("/");
l = l[l.length - 1];
if (!i[l]) {
var c = "function" == typeof __require && __require;
if (!a && c) return c(l, !0);
if (o) return o(l, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = l;
}
var O = e[s] = {
exports: {}
};
i[s][0].call(O.exports, function(t) {
return n(i[s][1][t] || t);
}, O, O.exports, t, i, e, r);
}
return e[s].exports;
}
for (var o = "function" == typeof __require && __require, s = 0; s < r.length; s++) n(r[s]);
return n;
}({
IsOpenChangeSkinByColorPoolTrait: [ function(t, i, e) {
"use strict";
cc._RF.push(i, "b407cwchZZMwZfDAUN68UDj", "IsOpenChangeSkinByColorPoolTrait");
var r, n = this && this.__extends || (r = function(t, i) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, i) {
t.__proto__ = i;
} || function(t, i) {
for (var e in i) Object.prototype.hasOwnProperty.call(i, e) && (t[e] = i[e]);
})(t, i);
}, function(t, i) {
r(t, i);
function e() {
this.constructor = t;
}
t.prototype = null === i ? Object.create(i) : (e.prototype = i.prototype, new e());
}), o = this && this.__decorate || function(t, i, e, r) {
var n, o = arguments.length, s = o < 3 ? i : null === r ? r = Object.getOwnPropertyDescriptor(i, e) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, i, e, r); else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (s = (o < 3 ? n(s) : o > 3 ? n(i, e, s) : n(i, e)) || s);
return o > 3 && s && Object.defineProperty(i, e, s), s;
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.IsOpenChangeSkinByColorPoolTrait = void 0;
var s = function(t) {
n(i, t);
function i() {
var i = null !== t && t.apply(this, arguments) || this;
i.COLOR_POOL = [ {
probability: 17.5,
skinList: [ "1001", "1003", "1034", "1036", "1029", "1010", "1024" ]
}, {
probability: 17.5,
skinList: [ "1025", "1033", "1016", "1026", "1005", "1013", "1028" ]
}, {
probability: 20,
skinList: [ "1000", "1021", "1002", "1038", "1035", "1012", "1015", "1009" ]
}, {
probability: 17.5,
skinList: [ "1020", "1037", "1014", "1018", "1011", "1019", "1030" ]
}, {
probability: 20,
skinList: [ "1004", "1023", "1031", "1022", "1006", "1007", "1008", "1039" ]
}, {
probability: 7.5,
skinList: [ "1027", "1017", "1032" ]
} ];
i.isClearScreen = !1;
return i;
}
i.prototype.registerTraitEventsMethods = function() {
return [ {
className: "Encourage_Proxy",
methodName: "onTouchEnd"
} ];
};
i.prototype.onActive = function(t) {
var i;
if (hs.tp.isSkin_ProxyOnSkinUpdate(t)) {
if ((r = t.args[0]).skinId === hs.skinInfo.originSkinId) return;
if (this.isClearScreen) {
var e = this.getSkin();
r.skinId = e;
this.isClearScreen = !1;
}
}
if (hs.tp.isEncourage_ProxyOnTouchEnd(t)) {
var r = t.args[0];
this.isClearScreen = null === (i = null == r ? void 0 : r.state) || void 0 === i ? void 0 : i.clearScreen;
}
};
i.prototype.getSkin = function() {
for (var t = storage.getItem("changeSkinByColorPoolInfo", [ this.COLOR_POOL[0].skinList.slice(), this.COLOR_POOL[1].skinList.slice(), this.COLOR_POOL[2].skinList.slice(), this.COLOR_POOL[3].skinList.slice(), this.COLOR_POOL[4].skinList.slice(), this.COLOR_POOL[5].skinList.slice() ]), i = 100 * Math.random(), e = 0, r = 0, n = 0; n < this.COLOR_POOL.length; n++) if (i < (e += this.COLOR_POOL[n].probability)) {
r = n;
break;
}
var o = r, s = t[o], a = Math.floor(Math.random() * s.length), l = s[a];
s.splice(a, 1);
0 === s.length && (t[o] = this.COLOR_POOL[o].skinList.slice());
storage.setItem("changeSkinByColorPoolInfo", t);
return l;
};
return o([ classId("IsOpenChangeSkinByColorPoolTrait") ], i);
}(Trait);
e.IsOpenChangeSkinByColorPoolTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "IsOpenChangeSkinByColorPoolTrait" ]);
//# sourceMappingURL=index.js.map
