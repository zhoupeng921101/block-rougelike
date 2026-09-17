window.__require = function e(t, n, r) {
function o(c, u) {
if (!n[c]) {
if (!t[c]) {
var s = c.split("/");
s = s[s.length - 1];
if (!t[s]) {
var l = "function" == typeof __require && __require;
if (!u && l) return l(s, !0);
if (i) return i(s, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = s;
}
var a = n[c] = {
exports: {}
};
t[c][0].call(a.exports, function(e) {
return o(t[c][1][e] || e);
}, a, a.exports, e, t, n, r);
}
return n[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < r.length; c++) o(r[c]);
return o;
}({
DeleteContinuePercentLowSkinsTrait: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "64987oUncVOvrn4NSDtrEZT", "DeleteContinuePercentLowSkinsTrait");
var r, o = this && this.__extends || (r = function(e, t) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
r(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), i = this && this.__decorate || function(e, t, n, r) {
var o, i = arguments.length, c = i < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, n) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(e, t, n, r); else for (var u = e.length - 1; u >= 0; u--) (o = e[u]) && (c = (i < 3 ? o(c) : i > 3 ? o(t, n, c) : o(t, n)) || c);
return i > 3 && c && Object.defineProperty(t, n, c), c;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.DeleteContinuePercentLowSkinsTrait = void 0;
var c = e("./interface/IDeleteContinuePercentLowSkins"), u = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.skinPool = [];
return t;
}
t.prototype.onActive = function(e) {
if (hs.tp.isCleanSceneUseSequenceSkinTraitUpdateSkinPool(e) || hs.tp.isSkinRandomInfoRefreshRandomSkinPool(e)) {
var t = e.args[0], n = this.getModifySkinPool(t);
this.skinPool = n;
e.returnState = !0;
}
if (hs.tp.isCleanSceneUseSequenceSkinTraitGetNextAvailableSkinId(e)) {
e.args[0] = this.skinPool;
e.returnState = !0;
}
};
t.prototype.getModifySkinPool = function(e) {
return e && 0 !== e.length ? e.filter(function(e) {
var t = String(e.ID);
return !c.IDeleteContinuePercentLowSkins.DeleteSkinIds.includes(t);
}) : e;
};
return i([ classId("DeleteContinuePercentLowSkinsTrait") ], t);
}(Trait);
n.DeleteContinuePercentLowSkinsTrait = u;
cc._RF.pop();
}, {
"./interface/IDeleteContinuePercentLowSkins": "IDeleteContinuePercentLowSkins"
} ],
IDeleteContinuePercentLowSkins: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "41e6aAauKRIOa6W9XjxtH6c", "IDeleteContinuePercentLowSkins");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.IDeleteContinuePercentLowSkins = void 0;
var r = function() {
function e() {}
e.DeleteSkinIds = [ "1001", "1020", "1034", "1025", "1021", "1024", "1003", "1037", "1002", "1033" ];
return e;
}();
n.IDeleteContinuePercentLowSkins = r;
cc._RF.pop();
}, {} ]
}, {}, [ "DeleteContinuePercentLowSkinsTrait", "IDeleteContinuePercentLowSkins" ]);
//# sourceMappingURL=index.js.map
