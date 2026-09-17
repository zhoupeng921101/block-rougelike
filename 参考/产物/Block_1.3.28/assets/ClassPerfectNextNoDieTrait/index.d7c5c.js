window.__require = function e(t, o, r) {
function i(n, a) {
if (!o[n]) {
if (!t[n]) {
var c = n.split("/");
c = c[c.length - 1];
if (!t[c]) {
var f = "function" == typeof __require && __require;
if (!a && f) return f(c, !0);
if (s) return s(c, !0);
throw new Error("Cannot find module '" + n + "'");
}
n = c;
}
var u = o[n] = {
exports: {}
};
t[n][0].call(u.exports, function(e) {
return i(t[n][1][e] || e);
}, u, u.exports, e, t, o, r);
}
return o[n].exports;
}
for (var s = "function" == typeof __require && __require, n = 0; n < r.length; n++) i(r[n]);
return i;
}({
ClassPerfectNextNoDieTrait: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "6e88aI/JeJOGLga5wuRWRH1", "ClassPerfectNextNoDieTrait");
var r, i = this && this.__extends || (r = function(e, t) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
})(e, t);
}, function(e, t) {
r(e, t);
function o() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
}), s = this && this.__decorate || function(e, t, o, r) {
var i, s = arguments.length, n = s < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(e, t, o, r); else for (var a = e.length - 1; a >= 0; a--) (i = e[a]) && (n = (s < 3 ? i(n) : s > 3 ? i(t, o, n) : i(t, o)) || n);
return s > 3 && n && Object.defineProperty(t, o, n), n;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.ClassPerfectNextNoDieTrait = void 0;
var n = function(e) {
i(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onActive = function(e) {
hs.tp.isBoardEffect_ProxyOnTouchEnd(e) && hs.gameInfo.gameMode === hs.GameMode.Class && this.addListener();
hs.tp.isAlgorithmProcessInfoChangeResult(e) && hs.gameInfo.gameMode === hs.GameMode.Class && this.checkDieLimit(e);
};
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "BoardEffect_Proxy",
methodName: "onTouchEnd"
} ];
};
t.prototype.checkDieLimit = function(e) {
var t = e.args[0];
if (hs.storage.getItem("classPerfectNextNoDie", !1)) {
var o = hs.boardInfo.faceBlocks;
hs.binarySupport.hasLiveWay(o, t.blockIds) ? this.setStorage(!1) : t.blockIds = [];
}
};
t.prototype.addListener = function() {
var e, t, o = this, r = TRAIT("IsOpenRightPutTrait");
(null == r ? void 0 : r.active) && (null === (e = r.rightPutEmitter) || void 0 === e || e.event(function(e) {
hs.gameInfo.gameMode === hs.GameMode.Class ? o.setStorage(e.isPrefect) : o.setStorage(!1);
}));
var i = TRAIT("RightPutHintCtrTrait");
(null == i ? void 0 : i.active) && (null === (t = i.rightPutEmitter) || void 0 === t || t.event(function(e) {
hs.gameInfo.gameMode === hs.GameMode.Class ? o.setStorage(e.isPrefect) : o.setStorage(!1);
}));
};
t.prototype.setStorage = function(e) {
void 0 === e && (e = !1);
hs.gameInfo.gameMode === hs.GameMode.Class ? hs.storage.setItem("classPerfectNextNoDie", e) : hs.storage.setItem("classPerfectNextNoDie", !1);
};
return s([ classId("ClassPerfectNextNoDieTrait") ], t);
}(Trait);
o.ClassPerfectNextNoDieTrait = n;
cc._RF.pop();
}, {} ]
}, {}, [ "ClassPerfectNextNoDieTrait" ]);
//# sourceMappingURL=index.js.map
