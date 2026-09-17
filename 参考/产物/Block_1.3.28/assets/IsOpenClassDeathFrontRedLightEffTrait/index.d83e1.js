window.__require = function t(e, r, o) {
function n(a, c) {
if (!r[a]) {
if (!e[a]) {
var f = a.split("/");
f = f[f.length - 1];
if (!e[f]) {
var l = "function" == typeof __require && __require;
if (!c && l) return l(f, !0);
if (i) return i(f, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = f;
}
var s = r[a] = {
exports: {}
};
e[a][0].call(s.exports, function(t) {
return n(e[a][1][t] || t);
}, s, s.exports, t, e, r, o);
}
return r[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < o.length; a++) n(o[a]);
return n;
}({
DeathRedLightEffInfo: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "41a64rTCbRCuqvCc9D0yvcY", "DeathRedLightEffInfo");
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
}), i = this && this.__decorate || function(t, e, r, o) {
var n, i = arguments.length, a = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, r, o); else for (var c = t.length - 1; c >= 0; c--) (n = t[c]) && (a = (i < 3 ? n(a) : i > 3 ? n(e, r, a) : n(e, r)) || a);
return i > 3 && a && Object.defineProperty(e, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var a = cc._decorator, c = a.ccclass, f = a.property, l = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.sideItem = null;
e.blockItem = null;
return e;
}
e.prototype.render = function() {
var t = this, e = 0, r = 0, o = [], n = hs.boardInfo.faceBlocks;
this.state.maxEmptyGather.forEach(function(i) {
var a = [];
i.forEach(function(o) {
var i, c, f, l, s = -1 === (null === (i = n[o.row]) || void 0 === i ? void 0 : i[o.col - 1]), h = -1 === (null === (c = n[o.row]) || void 0 === c ? void 0 : c[o.col + 1]), p = -1 === (null === (f = n[o.row - 1]) || void 0 === f ? void 0 : f[o.col]), u = -1 === (null === (l = n[o.row + 1]) || void 0 === l ? void 0 : l[o.col]), d = hs.boardRendererInfo.blocks[o.row][o.col];
if (s || h || p || u) {
var y = t.sideItem.parent.children[e];
y || (y = cc.instantiate(t.sideItem)).setParent(t.sideItem.parent);
y.position = d.position;
t.updateSide(y, s, h, p, u);
e++;
y.opacity = 255;
}
var v = t.blockItem.parent.children[r];
v || (v = cc.instantiate(t.blockItem)).setParent(t.blockItem.parent);
v.position = d.position;
v.opacity = 0;
a.push(v);
r++;
});
a.length > 0 && o.push(a);
});
for (var i = e; i < this.sideItem.parent.children.length; i++) {
var a = this.sideItem.parent.children[i];
a && a.active && cc.isValid(a) && (a.opacity = 0);
}
for (i = r; i < this.blockItem.parent.children.length; i++) {
var c = this.blockItem.parent.children[i];
c && c.active && cc.isValid(c) && (c.opacity = 0);
}
this.playAin(o);
};
e.prototype.playAin = function(t) {
var e = this;
this.sideItem.parent.stopAllActions();
this.sideItem.parent.opacity = 255;
cc.tween(this.sideItem.parent).to(1, {
opacity: 0
}).to(1, {
opacity: 255
}).call(function() {
e.sideItem.parent.opacity = 0;
e.blockItem.parent.opacity = 0;
}).start();
this.blockItem.parent.opacity = 255;
var r = 0, o = function() {
var e = t[r];
e && e.length > 0 && e.forEach(function(t) {
t && cc.isValid(t) && cc.tween(t).to(.5, {
opacity: 30
}).to(.5, {
opacity: 0
}).start();
});
++r < t.length && setTimeoutSafe(o, 100);
};
o();
};
e.prototype.updateSide = function(t, e, r, o, n) {
var i = t.getChildByName("left"), a = t.getChildByName("right"), c = t.getChildByName("top"), f = t.getChildByName("bot");
i && (i.active = !e);
a && (a.active = !r);
c && (c.active = !o);
f && (f.active = !n);
};
i([ f(cc.Node) ], e.prototype, "sideItem", void 0);
i([ f(cc.Node) ], e.prototype, "blockItem", void 0);
return i([ c ], e);
}(hs.Component);
r.default = l;
cc._RF.pop();
}, {} ],
IsOpenClassDeathFrontRedLightEffTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "c3bc8HDFCpFo5bHAUpsxGSr", "IsOpenClassDeathFrontRedLightEffTrait");
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
}), i = this && this.__decorate || function(t, e, r, o) {
var n, i = arguments.length, a = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, r, o); else for (var c = t.length - 1; c >= 0; c--) (n = t[c]) && (a = (i < 3 ? n(a) : i > 3 ? n(e, r, a) : n(e, r)) || a);
return i > 3 && a && Object.defineProperty(e, r, a), a;
}, a = this && this.__values || function(t) {
var e = "function" == typeof Symbol && Symbol.iterator, r = e && t[e], o = 0;
if (r) return r.call(t);
if (t && "number" == typeof t.length) return {
next: function() {
t && o >= t.length && (t = void 0);
return {
value: t && t[o++],
done: !t
};
}
};
throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, c = this && this.__read || function(t, e) {
var r = "function" == typeof Symbol && t[Symbol.iterator];
if (!r) return t;
var o, n, i = r.call(t), a = [];
try {
for (;(void 0 === e || e-- > 0) && !(o = i.next()).done; ) a.push(o.value);
} catch (t) {
n = {
error: t
};
} finally {
try {
o && !o.done && (r = i.return) && r.call(i);
} finally {
if (n) throw n.error;
}
}
return a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.IsOpenClassDeathFrontRedLightEffTrait = void 0;
var f = t("./DeathRedLightEffInfo"), l = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.effPrefab = null;
e.effNode = null;
return e;
}
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassBoardSplashAnimation_Proxy",
methodName: "onGameStart"
} ];
};
e.prototype.onCreate = function() {
this.preLoadRes();
};
e.prototype.onActive = function(t) {
var e, r, o, n;
if (hs.tp.isClassGameOver_GameEndPre_ProxyOnGameEndPre(t) && this.effPrefab) {
var i = Cinst(hs.Board);
if (!i || !i.node || !cc.isValid(i.node)) return;
var c = this.effNode;
if (!c) {
c = cc.instantiate(this.effPrefab);
this.effNode = c;
i.node.addChild(c);
c.setPosition(0, 0);
c.name = "gameOverBoardRedLightEff";
}
c.active = !0;
var l = hs.boardInfo.faceBlocks, s = this.findEmptyGather(l), h = null;
try {
for (var p = a(s), u = p.next(); !u.done; u = p.next()) {
var d = u.value;
h ? d.length > h.length && (h = d) : h = d;
}
} catch (t) {
e = {
error: t
};
} finally {
try {
u && !u.done && (r = p.return) && r.call(p);
} finally {
if (e) throw e.error;
}
}
var y = [];
try {
for (var v = a(h), m = v.next(); !m.done; m = v.next()) (d = m.value).length == h.length && y.push(d.length);
} catch (t) {
o = {
error: t
};
} finally {
try {
m && !m.done && (n = v.return) && n.call(v);
} finally {
if (o) throw o.error;
}
}
y.length > 1 && (h = y[Math.floor(Math.random() * y.length)]);
c.getComponent(f.default).setState({
maxEmptyGather: this.getBevelGather(h)
});
t.replace = !0;
setTimeoutSafe(function() {
t.originalCaller();
}, 2e3);
}
hs.tp.isClassBoardSplashAnimation_ProxyOnGameStart(t) && this.effNode && (this.effNode.active = !1);
};
e.prototype.preLoadRes = function() {
var t = this;
hs.ResLoader.loadByBundle("IsOpenClassDeathFrontRedLightEffTrait", "prefabs/gameOverBoardRedLightEff", cc.Prefab, function(e, r) {
e || (t.effPrefab = r);
});
};
e.prototype.findEmptyGather = function(t) {
if (!t || 0 === t.length) return [];
for (var e = t.length, r = t[0].length, o = Array.from({
length: e
}, function() {
return Array(r).fill(!1);
}), n = [], i = function(n, i) {
var c, f, l = [ {
row: n,
col: i
} ], s = [];
o[n][i] = !0;
for (var h = [ {
row: -1,
col: 0
}, {
row: 1,
col: 0
}, {
row: 0,
col: -1
}, {
row: 0,
col: 1
} ]; l.length > 0; ) {
var p = l.shift();
s.push(p);
try {
for (var u = (c = void 0, a(h)), d = u.next(); !d.done; d = u.next()) {
var y = d.value, v = p.row + y.row, m = p.col + y.col;
if (v >= 0 && v < e && m >= 0 && m < r && -1 === t[v][m] && !o[v][m]) {
o[v][m] = !0;
l.push({
row: v,
col: m
});
}
}
} catch (t) {
c = {
error: t
};
} finally {
try {
d && !d.done && (f = u.return) && f.call(u);
} finally {
if (c) throw c.error;
}
}
}
return s;
}, c = 0; c < e; c++) for (var f = 0; f < r; f++) if (-1 === t[c][f] && !o[c][f]) {
var l = i(c, f);
l.length > 0 && n.push(l);
}
return n;
};
e.prototype.getBevelGather = function(t) {
var e, r;
if (!t || 0 === t.length) return [];
var o = new Map();
try {
for (var n = a(t), i = n.next(); !i.done; i = n.next()) {
var f = i.value, l = f.row + f.col;
o.has(l) || o.set(l, []);
o.get(l).push(f);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
i && !i.done && (r = n.return) && r.call(n);
} finally {
if (e) throw e.error;
}
}
return Array.from(o.entries()).sort(function(t, e) {
return t[0] - e[0];
}).map(function(t) {
var e = c(t, 2);
e[0];
return e[1].sort(function(t, e) {
return t.row !== e.row ? t.row - e.row : t.col - e.col;
});
});
};
return i([ classId("IsOpenClassDeathFrontRedLightEffTrait") ], e);
}(Trait);
r.IsOpenClassDeathFrontRedLightEffTrait = l;
cc._RF.pop();
}, {
"./DeathRedLightEffInfo": "DeathRedLightEffInfo"
} ]
}, {}, [ "DeathRedLightEffInfo", "IsOpenClassDeathFrontRedLightEffTrait" ]);
//# sourceMappingURL=index.js.map
