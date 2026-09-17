window.__require = function e(t, r, o) {
function n(c, l) {
if (!r[c]) {
if (!t[c]) {
var u = c.split("/");
u = u[u.length - 1];
if (!t[u]) {
var a = "function" == typeof __require && __require;
if (!l && a) return a(u, !0);
if (i) return i(u, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = u;
}
var f = r[c] = {
exports: {}
};
t[c][0].call(f.exports, function(e) {
return n(t[c][1][e] || e);
}, f, f.exports, e, t, r, o);
}
return r[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < o.length; c++) n(o[c]);
return n;
}({
MergeBlockComboAddTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "a4c41CD2bRIeq7FBe728X79", "MergeBlockComboAddTrait");
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
var n, i = arguments.length, c = i < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(e, t, r, o); else for (var l = e.length - 1; l >= 0; l--) (n = e[l]) && (c = (i < 3 ? n(c) : i > 3 ? n(t, r, c) : n(t, r)) || c);
return i > 3 && c && Object.defineProperty(t, r, c), c;
}, c = this && this.__values || function(e) {
var t = "function" == typeof Symbol && Symbol.iterator, r = t && e[t], o = 0;
if (r) return r.call(e);
if (e && "number" == typeof e.length) return {
next: function() {
e && o >= e.length && (e = void 0);
return {
value: e && e[o++],
done: !e
};
}
};
throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.MergeBlockComboAddTrait = void 0;
var l = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onActive = function(e) {
var t, r, o;
if (hs.tp.isBlocksProducerTouchTouchFollowUpEliminateTimes(e)) {
var n = e.args[0], i = hs.storage.getItem("mergeBlockTrait", null), l = null !== (o = null == i ? void 0 : i.mergeBlocks) && void 0 !== o ? o : [];
if (0 === l.length) return;
var u = e.target.faceBlocks, a = 0, f = [];
try {
for (var s = c(l), p = s.next(); !p.done; p = s.next()) {
var d = p.value;
if (this._isFullyEliminated(d, u)) {
f.push(d);
d.size > a && (a = d.size);
}
}
} catch (e) {
t = {
error: e
};
} finally {
try {
p && !p.done && (r = s.return) && r.call(s);
} finally {
if (t) throw t.error;
}
}
if (a > 0) {
n.continuousEliminateTimes;
n.continuousEliminateTimes += a;
}
}
};
Object.defineProperty(t.prototype, "onActiveCondition", {
get: function() {
var e = TRAIT("MergeBlockTrait");
return !0 === (null == e ? void 0 : e.active) && !0 === (null == e ? void 0 : e.isCurrentMode);
},
enumerable: !1,
configurable: !0
});
t.prototype._isFullyEliminated = function(e, t) {
for (var r = 0; r < e.size; r++) for (var o = 0; o < e.size; o++) {
var n = e.anchorRow + r, i = e.anchorCol + o;
if (!t[n] || -1 !== t[n][i]) return !1;
}
return !0;
};
return i([ classId("MergeBlockComboAddTrait") ], t);
}(Trait);
r.MergeBlockComboAddTrait = l;
cc._RF.pop();
}, {} ]
}, {}, [ "MergeBlockComboAddTrait" ]);
//# sourceMappingURL=index.js.map
