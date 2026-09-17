window.__require = function t(r, e, o) {
function n(a, l) {
if (!e[a]) {
if (!r[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!r[c]) {
var u = "function" == typeof __require && __require;
if (!l && u) return u(c, !0);
if (i) return i(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var f = e[a] = {
exports: {}
};
r[a][0].call(f.exports, function(t) {
return n(r[a][1][t] || t);
}, f, f.exports, t, r, e, o);
}
return e[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < o.length; a++) n(o[a]);
return n;
}({
OneRoundNoCleanBlockTrait: [ function(t, r, e) {
"use strict";
cc._RF.push(r, "05bb8D1rRBHsbrv87XK7ZnP", "OneRoundNoCleanBlockTrait");
var o, n = this && this.__extends || (o = function(t, r) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, r) {
t.__proto__ = r;
} || function(t, r) {
for (var e in r) Object.prototype.hasOwnProperty.call(r, e) && (t[e] = r[e]);
})(t, r);
}, function(t, r) {
o(t, r);
function e() {
this.constructor = t;
}
t.prototype = null === r ? Object.create(r) : (e.prototype = r.prototype, new e());
}), i = this && this.__decorate || function(t, r, e, o) {
var n, i = arguments.length, a = i < 3 ? r : null === o ? o = Object.getOwnPropertyDescriptor(r, e) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, r, e, o); else for (var l = t.length - 1; l >= 0; l--) (n = t[l]) && (a = (i < 3 ? n(a) : i > 3 ? n(r, e, a) : n(r, e)) || a);
return i > 3 && a && Object.defineProperty(r, e, a), a;
}, a = this && this.__values || function(t) {
var r = "function" == typeof Symbol && Symbol.iterator, e = r && t[r], o = 0;
if (e) return e.call(t);
if (t && "number" == typeof t.length) return {
next: function() {
t && o >= t.length && (t = void 0);
return {
value: t && t[o++],
done: !t
};
}
};
throw new TypeError(r ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.OneRoundNoCleanBlockTrait = void 0;
var l = function(t) {
n(r, t);
function r() {
return null !== t && t.apply(this, arguments) || this;
}
e = r;
r.prototype.canBlockProduceClear = function(t) {
var r = hs.boardInfo.faceBlocks, e = new hs.BinaryBoard();
e.convertToBinaryBoard(r);
e.record();
for (var o = e.getConfig(t), n = hs.COL - o.width + 1, i = e.rowBinary.length - o.height + 1, a = 0; a < i; a++) for (var l = 0; l < n; l++) {
e.revert();
if (e.canPutBlock(t, cc.v2(l, a))) {
e.putBlock(t, cc.v2(l, a));
if (e.canClearBlockArr(!1)) return !0;
}
}
return !1;
};
r.prototype.randomCleanBlock = function(t) {
for (var r = [], o = 7; o < 43 && !(r.length >= 3); o++) this.canBlockProduceClear(o) && o !== t && !e.FILTER_BLOCK_ID_LIST_KEY.includes(o) && r.push(o);
if (0 == r.length) for (o = 7; o < 43 && !(r.length >= 3); o++) hs.algorithmStrategyLogic.canPutBlock(o) && o !== t && !e.FILTER_BLOCK_ID_LIST_KEY.includes(o) && r.push(o);
return r.length > 0 ? r[Math.floor(Math.random() * r.length)] : -1;
};
r.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassBlockOutStrategy_Proxy",
methodName: "modifyBlockOutResult"
} ];
};
r.prototype.onActive = function(t) {
var r, e, o, n;
if (hs.tp.isClassBlockOutStrategy_ProxyModifyBlockOutResult(t)) {
var i = hs.algorithmInfo.blockIdList;
if (i && i.length > 1) {
var l = [], c = [];
try {
for (var u = a(i), f = u.next(); !f.done; f = u.next()) -1 != (p = f.value) && (hs.algorithmStrategyLogic.canPutBlock(p) ? l.push(p) : c.push(p));
} catch (t) {
r = {
error: t
};
} finally {
try {
f && !f.done && (e = u.return) && e.call(u);
} finally {
if (r) throw r.error;
}
}
if (1 === c.length) {
var s = !1;
try {
for (var h = a(l), d = h.next(); !d.done; d = h.next()) {
var p;
if (-1 != (p = d.value) && this.canBlockProduceClear(p)) {
s = !0;
break;
}
}
} catch (t) {
o = {
error: t
};
} finally {
try {
d && !d.done && (n = h.return) && n.call(h);
} finally {
if (o) throw o.error;
}
}
if (!s) {
var y = i.indexOf(l[0]);
-1 != (_ = this.randomCleanBlock(l[1])) && (i[y] = _);
hs.algorithmInfo.setBlockIdList(i);
}
} else if (2 === c.length) {
var _, v = i.indexOf(c[0]);
-1 != (_ = this.randomCleanBlock(l[0])) && (i[v] = _);
hs.algorithmInfo.setBlockIdList(i);
}
}
}
};
var e;
r.FILTER_BLOCK_ID_LIST_KEY = [ 15, 27, 28, 37, 38, 39, 40, 41 ];
return e = i([ classId("OneRoundNoCleanBlockTrait") ], r);
}(Trait);
e.OneRoundNoCleanBlockTrait = l;
cc._RF.pop();
}, {} ]
}, {}, [ "OneRoundNoCleanBlockTrait" ]);
//# sourceMappingURL=index.js.map
