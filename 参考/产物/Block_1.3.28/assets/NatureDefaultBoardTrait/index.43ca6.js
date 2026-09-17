window.__require = function r(t, e, o) {
function c(a, i) {
if (!e[a]) {
if (!t[a]) {
var l = a.split("/");
l = l[l.length - 1];
if (!t[l]) {
var u = "function" == typeof __require && __require;
if (!i && u) return u(l, !0);
if (n) return n(l, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = l;
}
var f = e[a] = {
exports: {}
};
t[a][0].call(f.exports, function(r) {
return c(t[a][1][r] || r);
}, f, f.exports, r, t, e, o);
}
return e[a].exports;
}
for (var n = "function" == typeof __require && __require, a = 0; a < o.length; a++) c(o[a]);
return c;
}({
NatureDefaultBoardTrait: [ function(r, t, e) {
"use strict";
cc._RF.push(t, "a597ce2JnpDOq+EA5YcbLE5", "NatureDefaultBoardTrait");
var o, c = this && this.__extends || (o = function(r, t) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(r, t) {
r.__proto__ = t;
} || function(r, t) {
for (var e in t) Object.prototype.hasOwnProperty.call(t, e) && (r[e] = t[e]);
})(r, t);
}, function(r, t) {
o(r, t);
function e() {
this.constructor = r;
}
r.prototype = null === t ? Object.create(t) : (e.prototype = t.prototype, new e());
}), n = this && this.__decorate || function(r, t, e, o) {
var c, n = arguments.length, a = n < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, e) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(r, t, e, o); else for (var i = r.length - 1; i >= 0; i--) (c = r[i]) && (a = (n < 3 ? c(a) : n > 3 ? c(t, e, a) : c(t, e)) || a);
return n > 3 && a && Object.defineProperty(t, e, a), a;
}, a = this && this.__values || function(r) {
var t = "function" == typeof Symbol && Symbol.iterator, e = t && r[t], o = 0;
if (e) return e.call(r);
if (r && "number" == typeof r.length) return {
next: function() {
r && o >= r.length && (r = void 0);
return {
value: r && r[o++],
done: !r
};
}
};
throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.NatureDefaultBoardTrait = void 0;
var i = function(r) {
c(t, r);
function t() {
var t = null !== r && r.apply(this, arguments) || this;
t.blockNewCenterOffsetMap = {
1: cc.v2(0, 0),
2: cc.v2(0, .5),
3: cc.v2(.5, 0),
4: cc.v2(0, 1),
5: cc.v2(1, 0),
6: cc.v2(0, 0),
7: cc.v2(0, 1.5),
8: cc.v2(1, 1),
9: cc.v2(.5, .5),
10: cc.v2(1, 1),
11: cc.v2(2, 0),
12: cc.v2(2, 0),
13: cc.v2(1, 1),
14: cc.v2(1, .5),
15: cc.v2(1, 0),
16: cc.v2(.5, 1),
17: cc.v2(1.5, 0),
18: cc.v2(1, .5),
19: cc.v2(.5, 1),
20: cc.v2(.5, 1),
21: cc.v2(0, 0),
22: cc.v2(0, 2),
23: cc.v2(0, 2),
24: cc.v2(2, 2),
25: cc.v2(1, 1),
26: cc.v2(1, .5),
27: cc.v2(0, 0),
28: cc.v2(1, 1),
29: cc.v2(1, 2),
30: cc.v2(0, 0),
31: cc.v2(0, 0),
32: cc.v2(1, 0),
33: cc.v2(1.5, .5),
34: cc.v2(0, 0),
35: cc.v2(1, .5),
36: cc.v2(.5, 1),
37: cc.v2(0, 0),
38: cc.v2(1, 0),
39: cc.v2(1, 1),
40: cc.v2(1, 1),
41: cc.v2(1, 1),
42: cc.v2(0, 2)
};
t.isTrigger = !1;
return t;
}
t.prototype.onActive = function(r) {
if (hs.tp.isClassDefaultBoard_ProxyProduceDefaultBoard(r)) if (Math.random() > .5) {
var t = this.createNatureBoard();
r.args[0] = t;
r.returnState = !0;
this.isTrigger = !0;
} else this.isTrigger = !1;
hs.tp.isClassDefaultBoard_ProxyProduceDefaultBoardTurnAround(r) && this.isTrigger && (r.returnState = !0);
};
t.prototype.createNatureBoard = function() {
var r = new hs.BinaryBoard();
r.convertToBinaryBoard(hs.boardInfo.NULL);
var t = this.props.blockPool.concat(), e = this.randomGetBlockFromPool(t), o = this.putBlockToBoardRandomCorner(r, e);
if (o) {
for (var c = e, n = o, a = o; a && t.length > 0; ) {
e = this.randomGetBlockFromPool(t);
if (a = this.putBlockToBoardMaxDis(e, n, c, r)) {
c = e;
n = a;
}
}
return r.convertToArr();
}
};
t.prototype.putBlockToBoardRandomCorner = function(r, t) {
var e, o, c = r.getConfig(t);
if (!c) return null;
var n = [ cc.v2(0, 0), cc.v2(hs.COL - c.width, 0), cc.v2(0, hs.ROW - c.height), cc.v2(hs.COL - c.width, hs.ROW - c.height) ].filter(function(r) {
return r.x >= 0 && r.y >= 0;
});
if (0 === n.length) return null;
r.record();
var i = [];
try {
for (var l = a(n), u = l.next(); !u.done; u = l.next()) {
var f = u.value;
r.revert();
r.canPutBlock(t, f) && i.push(f);
}
} catch (r) {
e = {
error: r
};
} finally {
try {
u && !u.done && (o = l.return) && o.call(l);
} finally {
if (e) throw e.error;
}
}
r.revert();
if (0 === i.length) return null;
var v = i[Math.floor(Math.random() * i.length)];
r.putBlock(t, v);
return v;
};
t.prototype.putBlockToBoardMaxDis = function(r, t, e, o) {
var c, n, i = o.getConfig(r), l = o.getConfig(e);
if (!i) return null;
if (!l) return null;
var u = cc.v2(t.x + this.blockNewCenterOffsetMap[e].x, t.y + this.blockNewCenterOffsetMap[e].y), f = o.getCanPutPoss(r);
if (0 === f.length) return null;
o.record();
var v = -1, s = null;
try {
for (var h = a(f), p = h.next(); !p.done; p = h.next()) {
var d = p.value;
o.revert();
o.putBlock(r, d);
if (o.getClearCount() > 0) ; else {
var y = cc.v2(d.x + this.blockNewCenterOffsetMap[r].x, d.y + this.blockNewCenterOffsetMap[r].y), g = y.x - u.x, B = y.y - u.y, _ = Math.sqrt(g * g + B * B);
if (_ > v) {
v = _;
s = d;
}
}
}
} catch (r) {
c = {
error: r
};
} finally {
try {
p && !p.done && (n = h.return) && n.call(h);
} finally {
if (c) throw c.error;
}
}
o.revert();
if (!s) return null;
o.putBlock(r, s);
return s;
};
t.prototype.randomGetBlockFromPool = function(r) {
var t = null;
null === t && (t = Math.floor(Math.random() * r.length));
var e = r[t];
r.splice(t, 1);
return e;
};
return n([ classId("NatureDefaultBoardTrait") ], t);
}(Trait);
e.NatureDefaultBoardTrait = i;
cc._RF.pop();
}, {} ]
}, {}, [ "NatureDefaultBoardTrait" ]);
//# sourceMappingURL=index.js.map
