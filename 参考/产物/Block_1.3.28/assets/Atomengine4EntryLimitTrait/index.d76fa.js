window.__require = function t(e, r, n) {
function i(c, u) {
if (!r[c]) {
if (!e[c]) {
var a = c.split("/");
a = a[a.length - 1];
if (!e[a]) {
var f = "function" == typeof __require && __require;
if (!u && f) return f(a, !0);
if (o) return o(a, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = a;
}
var p = r[c] = {
exports: {}
};
e[c][0].call(p.exports, function(t) {
return i(e[c][1][t] || t);
}, p, p.exports, t, e, r, n);
}
return r[c].exports;
}
for (var o = "function" == typeof __require && __require, c = 0; c < n.length; c++) i(n[c]);
return i;
}({
Atomengine4EntryLimitTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "d351dlQEhtFo7cyvjM8dTpC", "Atomengine4EntryLimitTrait");
var n, i = this && this.__extends || (n = function(t, e) {
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
}), o = this && this.__decorate || function(t, e, r, n) {
var i, o = arguments.length, c = o < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, r) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, r, n); else for (var u = t.length - 1; u >= 0; u--) (i = t[u]) && (c = (o < 3 ? i(c) : o > 3 ? i(e, r, c) : i(e, r)) || c);
return o > 3 && c && Object.defineProperty(e, r, c), c;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.Atomengine4EntryLimitTrait = void 0;
var c = function(t) {
i(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._totalRAMMB = -1;
return e;
}
e.prototype.onActive = function() {};
e.prototype.getTotalRAMLimit = function() {
var t, e;
return null !== (e = null === (t = this.props) || void 0 === t ? void 0 : t.totalRAM) && void 0 !== e ? e : 0;
};
e.prototype.canShowEntry = function() {
if (!this.active) return !0;
var t = this.getTotalRAMLimit();
if (t <= 0) return !0;
try {
-1 == this._totalRAMMB && (this._totalRAMMB = hs.NativeDevice.getRAMTotalValueMB());
var e = this._totalRAMMB;
if (!e || e <= 0) return !0;
if (e / 1024 <= t) return !1;
} catch (t) {}
return !0;
};
return o([ classId("Atomengine4EntryLimitTrait") ], e);
}(Trait);
r.Atomengine4EntryLimitTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "Atomengine4EntryLimitTrait" ]);
//# sourceMappingURL=index.js.map
