window.__require = function e(t, r, o) {
function n(a, l) {
if (!r[a]) {
if (!t[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!t[c]) {
var s = "function" == typeof __require && __require;
if (!l && s) return s(c, !0);
if (i) return i(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var f = r[a] = {
exports: {}
};
t[a][0].call(f.exports, function(e) {
return n(t[a][1][e] || e);
}, f, f.exports, e, t, r, o);
}
return r[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < o.length; a++) n(o[a]);
return n;
}({
MergeBlockAssetLoader: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "d07c28xUyRMroaf51YdsYzQ", "MergeBlockAssetLoader");
Object.defineProperty(r, "__esModule", {
value: !0
});
r.MergeBlockAssetLoader = void 0;
var o = e("./components/MergeBlockMaterialUpdate"), n = "Remote_MergeBlocksClassRes", i = function() {
function e(e) {
this._prefabLoaded = !1;
this._materialLoaded = !1;
this._spriteFrameLoaded = !1;
this._prefab = null;
this._eliminatePrefab = null;
this._preEliminatePrefab = null;
this._borderEffectPrefab = null;
this._entranceEffectPrefab = null;
this._encouragePrefab = null;
this._comboPrefab = null;
this._scorePrefab = null;
this._linePreEliminatePrefab = null;
this._framePreEliminatePrefab = null;
this._onAllReady = e;
}
Object.defineProperty(e.prototype, "prefab", {
get: function() {
return this._prefab;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "eliminatePrefab", {
get: function() {
return this._eliminatePrefab;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "preEliminatePrefab", {
get: function() {
return this._preEliminatePrefab;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "borderEffectPrefab", {
get: function() {
return this._borderEffectPrefab;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "entranceEffectPrefab", {
get: function() {
return this._entranceEffectPrefab;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "encouragePrefab", {
get: function() {
return this._encouragePrefab;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "comboPrefab", {
get: function() {
return this._comboPrefab;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "scorePrefab", {
get: function() {
return this._scorePrefab;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "linePreEliminatePrefab", {
get: function() {
return this._linePreEliminatePrefab;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "framePreEliminatePrefab", {
get: function() {
return this._framePreEliminatePrefab;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "isReady", {
get: function() {
return this._prefabLoaded && this._materialLoaded && this._spriteFrameLoaded;
},
enumerable: !1,
configurable: !0
});
e.prototype.load = function() {
this._loadCorePrefab();
this._loadMaterial();
this._bindSpriteFrame();
this._loadOptionalPrefabs();
};
e.prototype._loadCorePrefab = function() {
var e = this;
hs.ResLoader.loadByBundle("MergeBlockTrait", "prefabs/MergeSkinBlockPrefab", cc.Prefab, function(t, r) {
if (t) ; else {
e._prefab = r;
e._prefabLoaded = !0;
e._checkAllReady();
}
});
};
e.prototype._loadMaterial = function() {
var e = this;
hs.ResLoader.loadByBundle("MergeBlockTrait", "materials/MergeBlock", cc.Material, function(t, r) {
if (t) ; else {
o.default.mergeBlockMaterial = r;
e._materialLoaded = !0;
e._checkAllReady();
}
});
};
e.prototype._bindSpriteFrame = function() {
var e = this;
hs.ResLoader.load("textures/skin/block/blocks", cc.SpriteFrame, function(t, r) {
if (t) ; else {
o.default.mergeBlockSpriteFrame = r;
e._spriteFrameLoaded = !0;
e._checkAllReady();
}
});
};
e.prototype._loadOptionalPrefabs = function() {
var e = this;
hs.ResLoader.loadByBundle(n, "prefabs/MergeEliminatePrefab", cc.Prefab, function(t, r) {
t || (e._eliminatePrefab = r);
});
hs.ResLoader.loadByBundle(n, "prefabs/MergePreEliminatePrefab", cc.Prefab, function(t, r) {
t || (e._preEliminatePrefab = r);
});
hs.ResLoader.loadByBundle(n, "prefabs/MergeBlockBorderEffectPrefab", cc.Prefab, function(t, r) {
t || (e._borderEffectPrefab = r);
});
hs.ResLoader.loadByBundle(n, "prefabs/MergeBlockEntranceEffectPrefab", cc.Prefab, function(t, r) {
t || (e._entranceEffectPrefab = r);
});
hs.ResLoader.loadByBundle(n, "prefabs/MergeEncouragePrefab", cc.Prefab, function(t, r) {
t || (e._encouragePrefab = r);
});
hs.ResLoader.loadByBundle(n, "prefabs/MergeBlockComboPrefab", cc.Prefab, function(t, r) {
t || (e._comboPrefab = r);
});
hs.ResLoader.loadByBundle(n, "prefabs/MergeBlockScorePrefab", cc.Prefab, function(t, r) {
t || (e._scorePrefab = r);
});
hs.ResLoader.loadByBundle(n, "prefabs/MergeLinePreEliminatePrefab", cc.Prefab, function(t, r) {
t || (e._linePreEliminatePrefab = r);
});
hs.ResLoader.loadByBundle(n, "prefabs/MergePreEliminateFramePrefab", cc.Prefab, function(t, r) {
t || (e._framePreEliminatePrefab = r);
});
};
e.prototype._checkAllReady = function() {
this.isReady && this._onAllReady();
};
return e;
}();
r.MergeBlockAssetLoader = i;
cc._RF.pop();
}, {
"./components/MergeBlockMaterialUpdate": "MergeBlockMaterialUpdate"
} ],
MergeBlockBorderEffectComponent: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "5eb44j1bkdKr4naRA5AF4r0", "MergeBlockBorderEffectComponent");
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
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, o); else for (var l = e.length - 1; l >= 0; l--) (n = e[l]) && (a = (i < 3 ? n(a) : i > 3 ? n(t, r, a) : n(t, r)) || a);
return i > 3 && a && Object.defineProperty(t, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var a = cc._decorator.ccclass, l = {
2: 1,
3: 2,
4: 3,
5: 4,
6: 5,
7: 6
}, c = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.anim = null;
return t;
}
t.prototype.render = function() {
var e = this.state, t = e.mode, r = e.size, o = e.color;
if ("none" !== t) {
var n = l[r];
if (n) if (this.anim && cc.isValid(this.anim.node)) {
this.node.active = !0;
o && (this.anim.node.color = new cc.Color().fromHEX(o));
this.anim.setAnimation(0, "in_" + n, !1);
} else this.node.active = !1; else this.node.active = !1;
} else {
this.anim && this.anim.clearTrack(0);
this.node.active = !1;
}
};
return i([ a ], t);
}(hs.Component);
r.default = c;
cc._RF.pop();
}, {} ],
MergeBlockBorderEffectManager: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "99afbBt+ftFfIY0iSyzKFL5", "MergeBlockBorderEffectManager");
Object.defineProperty(r, "__esModule", {
value: !0
});
r.MergeBlockBorderEffectManager = void 0;
var o = e("./components/MergeBlockBorderEffectComponent"), n = function() {
function e(e, t) {
this._pool = [];
this._prefab = e;
this._layer = t;
this._initPool();
}
e.prototype.play = function(e, t, r, o) {
var n = this._popFromPool();
if (n) {
n.node.setPosition(e, t);
n.node.active = !0;
n.inUse = !0;
var i = {
mode: "play",
size: r,
color: o
};
n.comp.setState(i);
}
};
e.prototype._initPool = function() {
for (var e, t, r = this, n = function() {
var n = cc.instantiate(i._prefab);
n.active = !1;
n.zIndex = 3;
i._layer.addChild(n);
var a = n.addComponent(o.default);
a.anim = null !== (t = null === (e = n.getChildByName("anim")) || void 0 === e ? void 0 : e.getComponent(sp.Skeleton)) && void 0 !== t ? t : null;
var l = {
node: n,
comp: a,
inUse: !1
};
a.anim && a.anim.setCompleteListener(function() {
l.inUse && r._releaseItem(l);
});
i._pool.push(l);
}, i = this, a = 0; a < 7; a++) n();
};
e.prototype._popFromPool = function() {
return this._pool.length > 0 ? this._pool.pop() : null;
};
e.prototype._releaseItem = function(e) {
e.inUse = !1;
e.node.active = !1;
this._pool.push(e);
};
return e;
}();
r.MergeBlockBorderEffectManager = n;
cc._RF.pop();
}, {
"./components/MergeBlockBorderEffectComponent": "MergeBlockBorderEffectComponent"
} ],
MergeBlockComboComponent: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "855190UFu1CaZcBuyTe7oVl", "MergeBlockComboComponent");
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
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, o); else for (var l = e.length - 1; l >= 0; l--) (n = e[l]) && (a = (i < 3 ? n(a) : i > 3 ? n(t, r, a) : n(t, r)) || a);
return i > 3 && a && Object.defineProperty(t, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var a = cc._decorator.ccclass, l = {
2: "combo_1",
3: "combo_1",
4: "combo_2",
5: "combo_2",
6: "combo_3",
7: "combo_3"
}, c = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.combo = null;
t.countLabel = null;
t.effects = null;
return t;
}
t.prototype.render = function() {
var e, t = this, r = this.state, o = r.mode, n = r.count, i = r.size, a = r.onComplete;
if (this.combo && this.countLabel && this.effects) {
cc.Tween.stopAllByTarget(this.countLabel.node);
cc.Tween.stopAllByTarget(this.combo);
cc.Tween.stopAllByTarget(this.node);
this.effects.node.active = !1;
if ("none" !== o) {
this.node.active = !0;
this.countLabel.node.scale = 0;
this.combo.scale = 0;
if (2 === n) {
this.countLabel.string = "";
this.combo.x = 0;
} else {
this.countLabel.string = "" + (n - 1);
this.combo.x = -(510 + 90 * (n.toString().length - 1)) / 2 + 190;
this.countLabel.node.x = 440 + -(510 + 90 * (n.toString().length - 1)) / 2;
cc.tween(this.node).delay(.05).call(function() {
cc.isValid(t.countLabel) && cc.isValid(t.effects) && (t.effects.node.x = t.countLabel.node.x + t.countLabel.node.width / 2);
}).start();
}
var c = this.combo.x, s = this.countLabel.node.x;
cc.tween(this.combo).to(.17, {
scale: 1.35
}).to(.08, {
scale: 1
}).delay(.6).to(.08, {
scale: 1.35
}).to(.08, {
scale: 0,
x: c - 20
}).start();
cc.tween(this.countLabel.node).to(.08, {
scale: 0
}).to(.12, {
scale: 2
}).to(.13, {
scale: 1
}).delay(.52).to(.08, {
scale: 1.35
}).to(.08, {
scale: 0,
x: s + 80
}).call(function() {
null == a || a();
}).start();
if (2 !== n) {
var f = null !== (e = l[i]) && void 0 !== e ? e : "combo_1";
cc.tween(this.node).delay(.08).call(function() {
if (cc.isValid(t.effects)) {
t.effects.node.active = !0;
t.effects.setAnimation(0, f, !1);
}
}).start();
}
} else this.node.active = !1;
} else {
this.node.active = !1;
null == a || a();
}
};
return i([ a ], t);
}(hs.Component);
r.default = c;
cc._RF.pop();
}, {} ],
MergeBlockComboManager: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "247cfN2FYFKka8E8D71bu2Y", "MergeBlockComboManager");
Object.defineProperty(r, "__esModule", {
value: !0
});
r.MergeBlockComboManager = void 0;
var o = e("./components/MergeBlockComboComponent"), n = function() {
function e(e) {
this._pool = [];
this._prefab = e;
this._initPool();
}
e.prototype.play = function(e, t, r, o, n) {
var i = this;
if (cc.isValid(r)) {
var a = this._popFromPool();
if (a) {
r.addChild(a.node);
a.node.setPosition(o, n);
a.inUse = !0;
a.node.active = !0;
var l = {
mode: "play",
count: e,
size: t,
onComplete: function() {
i._releaseItem(a);
}
};
a.comp.setState(l);
}
}
};
e.prototype._initPool = function() {
for (var e, t, r, n, i, a = 0; a < 2; a++) {
var l = cc.instantiate(this._prefab);
l.active = !1;
var c = l.addComponent(o.default);
c.combo = null !== (e = l.getChildByName("combo")) && void 0 !== e ? e : null;
c.countLabel = null !== (r = null === (t = l.getChildByName("countLabel")) || void 0 === t ? void 0 : t.getComponent(cc.Label)) && void 0 !== r ? r : null;
c.effects = null !== (i = null === (n = l.getChildByName("effects")) || void 0 === n ? void 0 : n.getComponent(sp.Skeleton)) && void 0 !== i ? i : null;
var s = {
node: l,
comp: c,
inUse: !1
};
this._pool.push(s);
}
};
e.prototype._popFromPool = function() {
return this._pool.length > 0 ? this._pool.pop() : null;
};
e.prototype._releaseItem = function(e) {
e.inUse = !1;
e.comp.setState({
mode: "none",
count: 0,
size: 2,
onComplete: null
});
e.node.removeFromParent(!1);
this._pool.push(e);
};
return e;
}();
r.MergeBlockComboManager = n;
cc._RF.pop();
}, {
"./components/MergeBlockComboComponent": "MergeBlockComboComponent"
} ],
MergeBlockDetector: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "0d4697U/55Ls6v63/QzUhJj", "MergeBlockDetector");
var o = this && this.__assign || function() {
return (o = Object.assign || function(e) {
for (var t, r = 1, o = arguments.length; r < o; r++) {
t = arguments[r];
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
}
return e;
}).apply(this, arguments);
}, n = this && this.__values || function(e) {
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
}, i = this && this.__read || function(e, t) {
var r = "function" == typeof Symbol && e[Symbol.iterator];
if (!r) return e;
var o, n, i = r.call(e), a = [];
try {
for (;(void 0 === t || t-- > 0) && !(o = i.next()).done; ) a.push(o.value);
} catch (e) {
n = {
error: e
};
} finally {
try {
o && !o.done && (r = i.return) && r.call(i);
} finally {
if (n) throw n.error;
}
}
return a;
}, a = this && this.__spread || function() {
for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(i(arguments[t]));
return e;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.MergeBlockDetector = void 0;
var l = e("./MergeBlockNodeManager"), c = function() {
function e() {
this.nextId = 1;
}
e.prototype.detect = function(e, t) {
for (var r, a, l, c, s, f, d, u, h = this._buildColorValGrid(e), p = [], _ = 0; _ < 8; _++) {
p[_] = [];
for (var v = 0; v < 8; v++) p[_][v] = -1;
}
var y = new Map(), g = [];
try {
for (var m = n(t), M = m.next(); !M.done; M = m.next()) {
var b = M.value;
if (this._isBlockStillValid(h, b)) {
var k = o({}, b);
g.push(k);
y.set(b.id, k);
for (_ = b.anchorRow; _ < b.anchorRow + b.size; _++) for (v = b.anchorCol; v < b.anchorCol + b.size; v++) p[_][v] = b.id;
}
}
} catch (e) {
r = {
error: e
};
} finally {
try {
M && !M.done && (a = m.return) && a.call(m);
} finally {
if (r) throw r.error;
}
}
for (var B = this._createEmptyBoolMap(), E = new Set(), P = 7; P >= 2; P--) for (var C = 8 - P; C >= 0; C--) for (var S = 0; S <= 8 - P; S++) if (!this._hasStep2Claim(B, C, S, P) && !((N = e[C][S]) < 1 || N > 7)) {
var w = h[C][S];
if (this._isAllSameColor(h, C, S, P, w)) {
var x = this._findValidUpgradeOverlap(p, E, y, C, S, P);
if (x) {
var R = function(e) {
E.add(e);
var t = g.findIndex(function(t) {
return t.id === e;
});
-1 !== t && g.splice(t, 1);
};
try {
for (var O = (l = void 0, n(x)), L = O.next(); !L.done; L = O.next()) R(T = L.value);
} catch (e) {
l = {
error: e
};
} finally {
try {
L && !L.done && (c = O.return) && c.call(O);
} finally {
if (l) throw l.error;
}
}
g.push({
id: this.nextId++,
size: P,
color: N,
anchorRow: C,
anchorCol: S
});
this._markOccupied(B, C, S, P);
}
}
}
var A = this._createEmptyBoolMap();
try {
for (var F = n(y), I = F.next(); !I.done; I = F.next()) {
var z = i(I.value, 2), T = z[0], j = z[1];
E.has(T) || this._markOccupied(A, j.anchorRow, j.anchorCol, j.size);
}
} catch (e) {
s = {
error: e
};
} finally {
try {
I && !I.done && (f = F.return) && f.call(F);
} finally {
if (s) throw s.error;
}
}
for (_ = 0; _ < 8; _++) for (v = 0; v < 8; v++) B[_][v] && (A[_][v] = !0);
for (P = 7; P >= 2; P--) {
var V = [];
for (C = 8 - P; C >= 0; C--) for (S = 0; S <= 8 - P; S++) if (!A[C][S]) {
var N;
if (!((N = e[C][S]) < 1 || N > 7)) {
w = h[C][S];
this._isValidSquare(h, A, C, S, P, w) && V.push({
id: 0,
size: P,
color: N,
anchorRow: C,
anchorCol: S
});
}
}
if (0 !== V.length) {
var D = this._resolveCandidates(V);
try {
for (var H = (d = void 0, n(D)), U = H.next(); !U.done; U = H.next()) {
(j = U.value).id = this.nextId++;
g.push(j);
this._markOccupied(A, j.anchorRow, j.anchorCol, j.size);
}
} catch (e) {
d = {
error: e
};
} finally {
try {
U && !U.done && (u = H.return) && u.call(H);
} finally {
if (d) throw d.error;
}
}
}
}
return g;
};
e.prototype.computeEliminationResult = function(e, t, r) {
var o, i, c = new Set(t.map(function(e) {
return e.id;
})), s = [];
try {
for (var f = n(e), d = f.next(); !d.done; d = f.next()) {
var u = d.value;
c.has(u.id) || l.isBlockCompletelyEliminated(r, u) && s.push({
id: u.id,
size: u.size,
color: u.color,
anchorRow: u.anchorRow,
anchorCol: u.anchorCol
});
}
} catch (e) {
o = {
error: e
};
} finally {
try {
d && !d.done && (i = f.return) && i.call(f);
} finally {
if (o) throw o.error;
}
}
var h = s.length > 0 ? Math.max.apply(Math, a(s.map(function(e) {
return e.size;
}))) : 0;
return {
eliminated: s,
maxSize: h
};
};
e.prototype.isFaceBlocksMatch = function(e, t) {
var r, o, n, i;
if (!t) return !1;
for (var a = 0; a < 8; a++) for (var l = 0; l < 8; l++) if ((null !== (o = null === (r = e[a]) || void 0 === r ? void 0 : r[l]) && void 0 !== o ? o : -1) !== (null !== (i = null === (n = t[a]) || void 0 === n ? void 0 : n[l]) && void 0 !== i ? i : -1)) return !1;
return !0;
};
e.prototype.isValidStoredBlock = function(e) {
return "number" == typeof e.id && e.id > 0 && "number" == typeof e.size && e.size >= 2 && e.size <= 7 && "number" == typeof e.color && e.color >= 1 && e.color <= 7 && "number" == typeof e.anchorRow && e.anchorRow >= 0 && e.anchorRow + e.size <= 8 && "number" == typeof e.anchorCol && e.anchorCol >= 0 && e.anchorCol + e.size <= 8;
};
e.prototype._hasStep2Claim = function(e, t, r, o) {
for (var n = t; n < t + o; n++) for (var i = r; i < r + o; i++) if (e[n][i]) return !0;
return !1;
};
e.prototype._buildColorValGrid = function(e) {
for (var t = [], r = 0; r < 8; r++) {
t[r] = [];
for (var o = 0; o < 8; o++) {
var n = e[r][o];
t[r][o] = n >= 1 && n <= 7 ? hs.blockInfo.getBlockColorValueById(n) : "";
}
}
return t;
};
e.prototype._isAllSameColor = function(e, t, r, o, n) {
for (var i = t; i < t + o; i++) for (var a = r; a < r + o; a++) if (e[i][a] !== n) return !1;
return !0;
};
e.prototype._findValidUpgradeOverlap = function(e, t, r, o, i, a) {
for (var l, c, s = new Set(), f = o; f < o + a; f++) for (var d = i; d < i + a; d++) -1 === (p = e[f][d]) || t.has(p) || s.add(p);
if (0 === s.size) return null;
try {
for (var u = n(s), h = u.next(); !h.done; h = u.next()) {
var p = h.value, _ = r.get(p);
if (!_ || _.size >= a || _.anchorRow < o || _.anchorCol < i || _.anchorRow + _.size > o + a || _.anchorCol + _.size > i + a) return null;
}
} catch (e) {
l = {
error: e
};
} finally {
try {
h && !h.done && (c = u.return) && c.call(u);
} finally {
if (l) throw l.error;
}
}
return s;
};
e.prototype._isBlockStillValid = function(e, t) {
for (var r = hs.blockInfo.getBlockColorValueById(t.color), o = t.anchorRow; o < t.anchorRow + t.size; o++) for (var n = t.anchorCol; n < t.anchorCol + t.size; n++) if (e[o][n] !== r) return !1;
return !0;
};
e.prototype._markOccupied = function(e, t, r, o) {
for (var n = t; n < t + o; n++) for (var i = r; i < r + o; i++) e[n][i] = !0;
};
e.prototype._isValidSquare = function(e, t, r, o, n, i) {
for (var a = r; a < r + n; a++) for (var l = o; l < o + n; l++) {
if (e[a][l] !== i) return !1;
if (t[a][l]) return !1;
}
return !0;
};
e.prototype._resolveCandidates = function(e) {
var t, r, o = [], i = this._createEmptyBoolMap();
try {
for (var a = n(e), l = a.next(); !l.done; l = a.next()) {
for (var c = l.value, s = c.anchorRow, f = c.anchorCol, d = c.size, u = !1, h = s; h < s + d && !u; h++) for (var p = f; p < f + d && !u; p++) i[h][p] && (u = !0);
if (!u) {
o.push(c);
for (h = s; h < s + d; h++) for (p = f; p < f + d; p++) i[h][p] = !0;
}
}
} catch (e) {
t = {
error: e
};
} finally {
try {
l && !l.done && (r = a.return) && r.call(a);
} finally {
if (t) throw t.error;
}
}
return o;
};
e.prototype._createEmptyBoolMap = function() {
return Array.from({
length: 8
}, function() {
return new Array(8).fill(!1);
});
};
return e;
}();
r.MergeBlockDetector = c;
cc._RF.pop();
}, {
"./MergeBlockNodeManager": "MergeBlockNodeManager"
} ],
MergeBlockDotProxy: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "be6b7XnPsVKO6wAmuJzBlT+", "MergeBlockDotProxy");
var o = this && this.__values || function(e) {
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
r.MergeBlockDotProxy = void 0;
var n = function() {
function e() {}
e.reportCombineSuccess = function(e) {
var t, r;
if (0 !== e.mergedBlocks.length) {
var n = TRAIT("MergeBlockCreateFixedScoreTrait"), i = !0 === (null == n ? void 0 : n.active);
try {
for (var a = o(e.mergedBlocks), l = a.next(); !l.done; l = a.next()) {
var c = l.value, s = i ? n.getScoreForSize(c.size) : 0;
DS("g_game_block_combine_success", {
game_type: "16",
combine_size: c.size,
combine_count: c.size * c.size,
combine_score: s,
position: c.anchorRow + "," + c.anchorCol
});
}
} catch (e) {
t = {
error: e
};
} finally {
try {
l && !l.done && (r = a.return) && r.call(a);
} finally {
if (t) throw t.error;
}
}
}
};
e.reportEliminateSuccess = function(e, t, r, n) {
var i, a, l, c = new Set(t.map(function(e) {
return e.id;
})), s = null == n ? void 0 : n.state, f = null == s ? void 0 : s.eliminateRows, d = null == s ? void 0 : s.eliminateCols, u = (f ? Object.keys(f).length : 0) + (d ? Object.keys(d).length : 0), h = (null == s ? void 0 : s.clearScreen) ? 1 : 0;
try {
for (var p = o(e), _ = p.next(); !_.done; _ = p.next()) {
var v = _.value;
if (!c.has(v.id)) {
for (var y = 0, g = v.anchorRow; g < v.anchorRow + v.size; g++) for (var m = v.anchorCol; m < v.anchorCol + v.size; m++) -1 === (null === (l = r[g]) || void 0 === l ? void 0 : l[m]) && y++;
0 !== y && DS("g_game_block_eliminate_success", {
game_type: "16",
eliminate_size: v.size,
eliminate_count: y,
clean_num: u,
is_clean: h,
position: v.anchorRow + "," + v.anchorCol
});
}
}
} catch (e) {
i = {
error: e
};
} finally {
try {
_ && !_.done && (a = p.return) && a.call(p);
} finally {
if (i) throw i.error;
}
}
};
return e;
}();
r.MergeBlockDotProxy = n;
cc._RF.pop();
}, {} ],
MergeBlockEliminateManager: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "d4fc5zMmVxNhI8NvsQ7Oe+J", "MergeBlockEliminateManager");
Object.defineProperty(r, "__esModule", {
value: !0
});
r.MergeBlockEliminateManager = void 0;
var o = e("./components/MergeEliminateComponent"), n = e("./MergeBlockNodeManager"), i = e("./MergeBlockSkinHelper"), a = function() {
function e(e, t) {
this._pool = [];
this._prefab = e;
this._layer = t;
this._initPool();
}
e.prototype.play = function(e) {
var t = this._popFromPool();
if (t) {
var r = n.calcMergeBlockPos(e.anchorRow, e.anchorCol, e.size);
t.node.setPosition(r.x, r.y);
t.inUse = !0;
t.node.active = !0;
var o = {
mode: "play",
size: e.size,
colors: i.getBigClearColors(e.color)
};
t.comp.setState(o);
}
};
e.prototype._initPool = function() {
for (var e, t, r, n, i, a, l = this, c = function() {
var c = cc.instantiate(s._prefab);
c.active = !1;
c.zIndex = 2;
s._layer.addChild(c);
var f = c.addComponent(o.default);
f.anim_1 = null !== (t = null === (e = c.getChildByName("anim_1")) || void 0 === e ? void 0 : e.getComponent(sp.Skeleton)) && void 0 !== t ? t : null;
f.anim_2 = null !== (n = null === (r = c.getChildByName("anim_2")) || void 0 === r ? void 0 : r.getComponent(sp.Skeleton)) && void 0 !== n ? n : null;
f.anim_3 = null !== (a = null === (i = c.getChildByName("anim_3")) || void 0 === i ? void 0 : i.getComponent(sp.Skeleton)) && void 0 !== a ? a : null;
var d = {
node: c,
comp: f,
inUse: !1
};
f.anim_1 && f.anim_1.setCompleteListener(function() {
d.inUse && l._releaseItem(d);
});
s._pool.push(d);
}, s = this, f = 0; f < 5; f++) c();
};
e.prototype._popFromPool = function() {
return this._pool.length > 0 ? this._pool.pop() : null;
};
e.prototype._releaseItem = function(e) {
e.inUse = !1;
e.node.active = !1;
this._pool.push(e);
};
return e;
}();
r.MergeBlockEliminateManager = a;
cc._RF.pop();
}, {
"./MergeBlockNodeManager": "MergeBlockNodeManager",
"./MergeBlockSkinHelper": "MergeBlockSkinHelper",
"./components/MergeEliminateComponent": "MergeEliminateComponent"
} ],
MergeBlockEncourageManager: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "6e2f1JiljdMk7LfiJBNipnR", "MergeBlockEncourageManager");
Object.defineProperty(r, "__esModule", {
value: !0
});
r.MergeBlockEncourageManager = void 0;
var o = e("./components/MergeEncourageComponent"), n = function() {
function e(e) {
this._pool = [];
this._prefab = e;
this._initPool();
}
e.prototype.play = function(e, t, r, o) {
if (cc.isValid(t)) {
var n = this._popFromPool();
if (n) {
t.addChild(n.node);
n.node.setPosition(r, o);
n.inUse = !0;
n.node.active = !0;
var i = {
mode: "play",
animName: e
};
n.comp.setState(i);
}
}
};
e.prototype._initPool = function() {
for (var e, t, r = this, n = function() {
var n = cc.instantiate(i._prefab);
n.active = !1;
var a = n.addComponent(o.default);
a.anim = null !== (t = null === (e = n.getChildByName("anim")) || void 0 === e ? void 0 : e.getComponent(sp.Skeleton)) && void 0 !== t ? t : null;
var l = {
node: n,
comp: a,
inUse: !1
};
a.anim && a.anim.setCompleteListener(function() {
l.inUse && r._releaseItem(l);
});
i._pool.push(l);
}, i = this, a = 0; a < 2; a++) n();
};
e.prototype._popFromPool = function() {
return this._pool.length > 0 ? this._pool.pop() : null;
};
e.prototype._releaseItem = function(e) {
e.inUse = !1;
e.node.active = !1;
e.node.removeFromParent(!1);
this._pool.push(e);
};
return e;
}();
r.MergeBlockEncourageManager = n;
cc._RF.pop();
}, {
"./components/MergeEncourageComponent": "MergeEncourageComponent"
} ],
MergeBlockEntranceEffectComponent: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "e503d3tIf5AB4VJD9v9/gj7", "MergeBlockEntranceEffectComponent");
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
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, o); else for (var l = e.length - 1; l >= 0; l--) (n = e[l]) && (a = (i < 3 ? n(a) : i > 3 ? n(t, r, a) : n(t, r)) || a);
return i > 3 && a && Object.defineProperty(t, r, a), a;
}, a = this && this.__values || function(e) {
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
var l = e("./MergeBlockMaterialUpdate"), c = cc._decorator.ccclass, s = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.efx1 = null;
t.efx2 = null;
t.efx3 = null;
t.efx4 = null;
t.efx5 = null;
t.efx6 = null;
t.efx7 = null;
return t;
}
t.prototype.render = function() {
var e, t, r = this, o = this.state, n = o.mode, i = o.size, c = o.colors, s = o.bevelStyle, f = o.onComplete;
cc.Tween.stopAllByTarget(this.node);
this.node.active = !1;
if ("none" !== n) {
this.node.active = !0;
var d = s === l.BEVEL_STYLE_WIDE;
this.efx3 && (this.efx3.node.active = d);
this.efx4 && (this.efx4.node.active = d);
this.efx6 && (this.efx6.node.active = !d);
this.efx7 && (this.efx7.node.active = !d);
this._applyHex(this.efx2, c[0]);
this._applyHex(this.efx4, c[1]);
this._applyHex(this.efx5, c[2]);
this._applyHex(this.efx7, c[1]);
var u = [ {
skel: this.efx1,
n: 1
}, {
skel: this.efx2,
n: 2
}, {
skel: this.efx3,
n: 3
}, {
skel: this.efx4,
n: 4
}, {
skel: this.efx5,
n: 5
}, {
skel: this.efx6,
n: 6
}, {
skel: this.efx7,
n: 7
} ];
try {
for (var h = a(u), p = h.next(); !p.done; p = h.next()) {
var _ = p.value, v = _.skel, y = _.n;
if (v && v.node.active) {
v.setAnimation(0, "in_" + i + "_efx" + y, !1);
v.timeScale = .5;
}
}
} catch (t) {
e = {
error: t
};
} finally {
try {
p && !p.done && (t = h.return) && t.call(h);
} finally {
if (e) throw e.error;
}
}
cc.tween(this.node).delay(1.6).call(function() {
cc.isValid(r.node) && (null == f || f());
}).start();
}
};
t.prototype._applyHex = function(e, t) {
e && e.node.active && (e.node.color = new cc.Color().fromHEX(t));
};
return i([ c ], t);
}(hs.Component);
r.default = s;
cc._RF.pop();
}, {
"./MergeBlockMaterialUpdate": "MergeBlockMaterialUpdate"
} ],
MergeBlockEntranceEffectManager: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "9ff5czn9VpH8KBgoZ9BSGFJ", "MergeBlockEntranceEffectManager");
var o = this && this.__values || function(e) {
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
r.MergeBlockEntranceEffectManager = void 0;
var n = e("./components/MergeBlockMaterialUpdate"), i = e("./components/MergeBlockEntranceEffectComponent"), a = e("./MergeBlockSkinHelper"), l = function() {
function e(e, t) {
this._pool = [];
this._allNodes = [];
this._prefab = e;
this._layer = t;
this._initPool();
}
e.prototype.play = function(e, t, r, o, n) {
var l = this, c = this._pool.pop();
if (!c || !cc.isValid(c)) return null;
c.setPosition(e, t);
c.active = !1;
var s = !1, f = function() {
if (!s) {
s = !0;
if (cc.isValid(c)) {
cc.Tween.stopAllByTarget(c);
c.active = !1;
}
l._release(c);
}
}, d = {
mode: "play",
size: r,
colors: a.getMergeEntranceColors(o),
bevelStyle: n,
onComplete: f
};
c.getComponent(i.default).setState(d);
return f;
};
e.prototype.stopAll = function() {
var e, t;
try {
for (var r = o(this._allNodes), n = r.next(); !n.done; n = r.next()) {
var a = n.value;
if (cc.isValid(a) && a.active) {
cc.Tween.stopAllByTarget(a);
var l = a.getComponent(i.default);
l && l.setState({
mode: "none",
size: 2,
colors: [ "#ffffff", "#ffffff", "#ffffff" ],
bevelStyle: 0,
onComplete: null
});
a.active = !1;
this._pool.includes(a) || this._pool.push(a);
}
}
} catch (t) {
e = {
error: t
};
} finally {
try {
n && !n.done && (t = r.return) && t.call(r);
} finally {
if (e) throw e.error;
}
}
};
e.prototype._initPool = function() {
var e, t, r, o, a, l, c, s, f, d, u, h, p, _;
if (cc.isValid(this._layer)) for (var v = 0; v < 4; v++) {
var y = cc.instantiate(this._prefab);
y.active = !1;
y.zIndex = 4;
this._layer.addChild(y);
var g = y.addComponent(i.default);
g.efx1 = null !== (t = null === (e = y.getChildByName("efx1_node")) || void 0 === e ? void 0 : e.getComponent(sp.Skeleton)) && void 0 !== t ? t : null;
g.efx2 = null !== (o = null === (r = y.getChildByName("efx2_node")) || void 0 === r ? void 0 : r.getComponent(sp.Skeleton)) && void 0 !== o ? o : null;
g.efx3 = null !== (l = null === (a = y.getChildByName("efx3_node")) || void 0 === a ? void 0 : a.getComponent(sp.Skeleton)) && void 0 !== l ? l : null;
g.efx4 = null !== (s = null === (c = y.getChildByName("efx4_node")) || void 0 === c ? void 0 : c.getComponent(sp.Skeleton)) && void 0 !== s ? s : null;
g.efx5 = null !== (d = null === (f = y.getChildByName("efx5_node")) || void 0 === f ? void 0 : f.getComponent(sp.Skeleton)) && void 0 !== d ? d : null;
g.efx6 = null !== (h = null === (u = y.getChildByName("efx6_node")) || void 0 === u ? void 0 : u.getComponent(sp.Skeleton)) && void 0 !== h ? h : null;
g.efx7 = null !== (_ = null === (p = y.getChildByName("efx7_node")) || void 0 === p ? void 0 : p.getComponent(sp.Skeleton)) && void 0 !== _ ? _ : null;
g.setState({
mode: "none",
size: 2,
colors: [ "#ffffff", "#ffffff", "#ffffff" ],
bevelStyle: n.BEVEL_STYLE_WIDE,
onComplete: null
});
this._pool.push(y);
this._allNodes.push(y);
}
};
e.prototype._release = function(e) {
if (cc.isValid(e)) {
e.active = !1;
this._pool.length < 4 ? this._pool.push(e) : e.destroy();
}
};
return e;
}();
r.MergeBlockEntranceEffectManager = l;
cc._RF.pop();
}, {
"./MergeBlockSkinHelper": "MergeBlockSkinHelper",
"./components/MergeBlockEntranceEffectComponent": "MergeBlockEntranceEffectComponent",
"./components/MergeBlockMaterialUpdate": "MergeBlockMaterialUpdate"
} ],
MergeBlockMaterialUpdate: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "9cc21iEPGpL8KZxYg9RaeeY", "MergeBlockMaterialUpdate");
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
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, o); else for (var l = e.length - 1; l >= 0; l--) (n = e[l]) && (a = (i < 3 ? n(a) : i > 3 ? n(t, r, a) : n(t, r)) || a);
return i > 3 && a && Object.defineProperty(t, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.BEVEL_STYLE_NARROW = r.BEVEL_STYLE_WIDE = void 0;
var a = cc._decorator, l = a.ccclass;
a.property;
r.BEVEL_STYLE_WIDE = 0;
r.BEVEL_STYLE_NARROW = 1;
var c = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._materialVariant = null;
t.attributeList = [ "top", "bottom", "left", "right", "center", "outer" ];
t._currentParams = null;
t._colorId = 0;
t._scaleFactor = 1;
t._bevelStyle = r.BEVEL_STYLE_WIDE;
return t;
}
o = t;
t.prototype.setMaterial = function() {
var e = this.node.getComponent(cc.Sprite);
if (e) {
var t = o.mergeBlockMaterial, r = o.mergeBlockSpriteFrame;
if (t && r) {
e.spriteFrame || (e.spriteFrame = r);
if (!this._materialVariant) {
this._materialVariant = cc.MaterialVariant.create(t, e);
e.setMaterial(0, this._materialVariant);
}
}
}
};
t.prototype.setBevelStyle = function(e) {
this._bevelStyle = e;
};
t.prototype.setAllParams = function(e, t, r) {
void 0 === r && (r = 1);
this._colorId = e;
this._scaleFactor = r;
this._currentParams = hs.skinBlockInfo.blockDefaultShaderInfo;
for (var o = 0; o < this.attributeList.length; o++) {
var n = t[o];
if (n) {
var i = this.attributeList[o], a = this._currentParams[i];
for (var l in a) (n[l] || 0 === n[l]) && ("colorParam" === l ? a.colorParam = new cc.Color().fromHEX("" + n.colorParam) : "gradientParam" === l ? a.gradientParam = new cc.Color().fromHEX("" + n.gradientParam) : "gradientEnabled" === l ? a.gradientEnabled = 1 === n.gradientEnabled : "blendModeEnabled" === l ? a.blendModeEnabled = 1 === n.blendModeEnabled : a[l] = n[l]);
}
}
this._updateShaderParams();
};
t.prototype._updateShaderParams = function() {
if (this._materialVariant) {
var e = this.node.width * this._scaleFactor;
this._materialVariant.setProperty("blockSizePx", [ e, this._bevelStyle, 0, 0 ]);
for (var t = 0; t < this.attributeList.length; t++) {
var r = this.attributeList[t], o = this._currentParams[r];
this._updateAreaParams(r, o);
}
}
};
t.prototype._updateAreaParams = function(e, t) {
if (this._materialVariant) {
this._materialVariant.setProperty(e + "ColorParam", this._colorToArray(t.colorParam));
this._materialVariant.setProperty(e + "GradientParam", this._colorToArray(t.gradientParam));
this._materialVariant.setProperty(e + "Params1", [ t.brightness, t.contrast, t.saturation, t.hue ]);
this._materialVariant.setProperty(e + "Params2", [ t.gradientStrength, t.blendMode, t.gradientDirection, t.gradientType ]);
this._materialVariant.setProperty(e + "Params3", [ t.gradientEnabled ? 1 : 0, t.blendModeEnabled ? 1 : 0, 0, 0 ]);
}
};
t.prototype._colorToArray = function(e) {
return [ e.r / 255, e.g / 255, e.b / 255, e.a / 255 ];
};
var o;
t.mergeBlockMaterial = null;
t.mergeBlockSpriteFrame = null;
return o = i([ l ], t);
}(hs.Component);
r.default = c;
cc._RF.pop();
}, {} ],
MergeBlockNodeManager: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "b86c2v/Vh9Ig6p6T7fBiNP8", "MergeBlockNodeManager");
var o = this && this.__values || function(e) {
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
}, n = this && this.__read || function(e, t) {
var r = "function" == typeof Symbol && e[Symbol.iterator];
if (!r) return e;
var o, n, i = r.call(e), a = [];
try {
for (;(void 0 === t || t-- > 0) && !(o = i.next()).done; ) a.push(o.value);
} catch (e) {
n = {
error: e
};
} finally {
try {
o && !o.done && (r = i.return) && r.call(i);
} finally {
if (n) throw n.error;
}
}
return a;
}, i = this && this.__spread || function() {
for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(n(arguments[t]));
return e;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.MergeBlockNodeManager = r.isBlockCompletelyEliminated = r.computeMergeResult = r.calcMergeBlockPos = void 0;
var a = e("./components/MergeBlockMaterialUpdate"), l = e("./components/MergeSkinBlockComponent"), c = e("./MergeBlockSkinHelper"), s = 106, f = 424, d = -4;
function u(e, t, r) {
var o = s / 2;
return {
x: -f + o + s * t + (r - 1) * s / 2,
y: d + f - o - s * e - (r - 1) * s / 2
};
}
r.calcMergeBlockPos = u;
r.computeMergeResult = function(e, t) {
var r, n, i, a, l = new Set(e.map(function(e) {
return e.id;
})), c = new Set(t.map(function(e) {
return e.id;
}).filter(function(e) {
return l.has(e);
})), s = e.filter(function(e) {
return !c.has(e.id);
}), f = t.filter(function(e) {
return !c.has(e.id);
}), d = new Set(), u = function(e) {
var t = f.find(function(t) {
return t.size > e.size && t.anchorRow <= e.anchorRow && t.anchorCol <= e.anchorCol && t.anchorRow + t.size >= e.anchorRow + e.size && t.anchorCol + t.size >= e.anchorCol + e.size;
});
t && d.add(t.id);
};
try {
for (var h = o(s), p = h.next(); !p.done; p = h.next()) u(p.value);
} catch (e) {
r = {
error: e
};
} finally {
try {
p && !p.done && (n = h.return) && n.call(h);
} finally {
if (r) throw r.error;
}
}
var _ = [], v = function(t) {
if (d.has(t.id)) {
_.push({
id: t.id,
size: t.size,
anchorRow: t.anchorRow,
anchorCol: t.anchorCol
});
return "continue";
}
e.some(function(e) {
return t.anchorRow >= e.anchorRow && t.anchorCol >= e.anchorCol && t.anchorRow + t.size <= e.anchorRow + e.size && t.anchorCol + t.size <= e.anchorCol + e.size;
}) || _.push({
id: t.id,
size: t.size,
anchorRow: t.anchorRow,
anchorCol: t.anchorCol
});
};
try {
for (var y = o(f), g = y.next(); !g.done; g = y.next()) v(g.value);
} catch (e) {
i = {
error: e
};
} finally {
try {
g && !g.done && (a = y.return) && a.call(y);
} finally {
if (i) throw i.error;
}
}
return {
mergedBlocks: _,
totalCount: _.length
};
};
function h(e, t) {
for (var r = t.anchorRow; r < t.anchorRow + t.size; r++) for (var o = t.anchorCol; o < t.anchorCol + t.size; o++) if (-1 !== e[r][o]) return !1;
return !0;
}
r.isBlockCompletelyEliminated = h;
var p = function() {
function e(e, t) {
this._nodes = new Map();
this.eliminateManager = null;
this.borderEffectManager = null;
this.entranceEffectManager = null;
this.bevelStyle = a.BEVEL_STYLE_WIDE;
this._nodeConvergeClones = new Map();
this._nodeHiddenEntries = new Map();
this._nodeEntranceEffectStop = new Map();
this._layer = e;
this._assetLoader = t;
}
e.prototype.sync = function(e, t) {
var r, i, a, l, s, f, d, p, _, v, y, g, m, M = this;
if (t) {
var b = this._classifyChanges(t, e), k = b.upgradeMap, B = b.shrinkMap, E = b.fullSplitIds, P = b.freshNewIds;
if (k.size > 0 || P.size > 0) {
hs.audioInfo.play({
url: "audios/block_big",
type: hs.AudioType.EFFECT,
volume: 1.5,
bundleName: "Remote_MergeBlocksClassRes"
});
if (P.size > 0) {
var C = hs.gameInfo.gameMode === hs.GameMode.MergeBlocks ? "MergeBlocksIsOpenVibrateTrait" : "IsOpenVibrateTrait", S = TRAIT(C);
(null == S ? void 0 : S.active) && S.doShake("playEffect_1");
}
}
B.size > 0 && hs.audioInfo.play({
url: "audios/block_small",
type: hs.AudioType.EFFECT,
volume: 1.5,
bundleName: "Remote_MergeBlocksClassRes"
});
var w = function(e, t) {
var r = x._nodes.get(e);
x._nodes.delete(e);
if (!r || !cc.isValid(r)) return "continue";
x._cancelConvergeForNode(r);
x._updateNodeState(r, t);
var o = u(t.anchorRow, t.anchorCol, t.size);
r.name = "MergeBlock_" + t.id;
var n = c.getMergeBorderColor(t.color);
cc.tween(r).to(.4, {
x: o.x,
y: o.y,
scaleX: t.size,
scaleY: t.size
}, {
easing: "sineOut"
}).call(function() {
var e;
null === (e = M.borderEffectManager) || void 0 === e || e.play(o.x, o.y, t.size, n);
}).start();
x._nodes.set(t.id, r);
}, x = this;
try {
for (var R = o(k), O = R.next(); !O.done; O = R.next()) {
var L = n(O.value, 2);
w(L[0], L[1]);
}
} catch (e) {
s = {
error: e
};
} finally {
try {
O && !O.done && (f = R.return) && f.call(R);
} finally {
if (s) throw s.error;
}
}
var A = function(e, t) {
var r = F._nodes.get(e);
F._nodes.delete(e);
if (!r || !cc.isValid(r)) return "continue";
F._cancelConvergeForNode(r);
F._updateNodeState(r, t);
var o = u(t.anchorRow, t.anchorCol, t.size);
r.name = "MergeBlock_" + t.id;
var n = c.getMergeBorderColor(t.color);
cc.tween(r).to(.5, {
x: o.x,
y: o.y,
scaleX: t.size,
scaleY: t.size
}, {
easing: "sineOut"
}).call(function() {
var e;
null === (e = M.borderEffectManager) || void 0 === e || e.play(o.x, o.y, t.size, n);
}).start();
F._nodes.set(t.id, r);
}, F = this;
try {
for (var I = o(B), z = I.next(); !z.done; z = I.next()) {
var T = n(z.value, 2);
A(T[0], T[1]);
}
} catch (e) {
d = {
error: e
};
} finally {
try {
z && !z.done && (p = I.return) && p.call(I);
} finally {
if (d) throw d.error;
}
}
var j = hs.boardInfo.faceBlocks, V = new Map(t.map(function(e) {
return [ e.id, e ];
}));
try {
for (var N = o(E), D = N.next(); !D.done; D = N.next()) {
J = D.value, q = this._nodes.get(J);
this._nodes.delete(J);
if (q && cc.isValid(q)) {
this._cancelConvergeForNode(q);
var H = V.get(J);
if (H && j && h(j, H)) {
null === (m = this.eliminateManager) || void 0 === m || m.play(H);
q.destroy();
} else this._playFullSplitAnim(q);
}
}
} catch (e) {
_ = {
error: e
};
} finally {
try {
D && !D.done && (v = N.return) && v.call(N);
} finally {
if (_) throw _.error;
}
}
try {
for (var U = o(e), G = U.next(); !G.done; G = U.next()) {
$ = G.value;
if (!this._nodes.has($.id) && (q = this._createNode($))) {
this._nodes.set($.id, q);
if (P.has($.id)) {
q.scale = 0;
this._playConvergeAnim($, q, function() {});
}
}
}
} catch (e) {
y = {
error: e
};
} finally {
try {
G && !G.done && (g = U.return) && g.call(U);
} finally {
if (y) throw y.error;
}
}
} else {
var Y = new Set(e.map(function(e) {
return e.id;
}));
try {
for (var X = o(this._nodes), W = X.next(); !W.done; W = X.next()) {
var Z = n(W.value, 2), J = Z[0], q = Z[1];
if (!Y.has(J)) {
this._cancelConvergeForNode(q);
cc.isValid(q) && q.destroy();
this._nodes.delete(J);
}
}
} catch (e) {
r = {
error: e
};
} finally {
try {
W && !W.done && (i = X.return) && i.call(X);
} finally {
if (r) throw r.error;
}
}
try {
for (var K = o(e), Q = K.next(); !Q.done; Q = K.next()) {
var $ = Q.value;
this._nodes.has($.id) || (q = this._createNode($)) && this._nodes.set($.id, q);
}
} catch (e) {
a = {
error: e
};
} finally {
try {
Q && !Q.done && (l = K.return) && l.call(K);
} finally {
if (a) throw a.error;
}
}
}
};
e.prototype.syncSkin = function(e) {
var t, r, n;
try {
for (var i = o(e), a = i.next(); !a.done; a = i.next()) {
var c = a.value, s = this._nodes.get(c.id);
if (s && cc.isValid(s)) {
var f = s.getComponent(l.default);
if (f) {
var d = null === (n = hs.skinInfo.blockSkinInfoList) || void 0 === n ? void 0 : n[c.color - 1];
(null == d ? void 0 : d.colorList) && f.setState({
color: c.color,
size: c.size,
colorDataList: d.colorList,
blockSpriteFrame: null,
bevelStyle: this.bevelStyle
});
}
}
}
} catch (e) {
t = {
error: e
};
} finally {
try {
a && !a.done && (r = i.return) && r.call(i);
} finally {
if (t) throw t.error;
}
}
};
e.prototype.setAllVisibility = function(e) {
var t, r, i, a;
try {
for (var l = o(this._nodes), c = l.next(); !c.done; c = l.next()) {
var s = n(c.value, 2)[1];
cc.isValid(s) && (s.active = e);
}
} catch (e) {
t = {
error: e
};
} finally {
try {
c && !c.done && (r = l.return) && r.call(l);
} finally {
if (t) throw t.error;
}
}
if (!e && this._nodeHiddenEntries.size > 0) {
try {
for (var f = o(this._nodeHiddenEntries), d = f.next(); !d.done; d = f.next()) {
var u = n(d.value, 2)[1];
this._restoreHiddenEntries(u);
}
} catch (e) {
i = {
error: e
};
} finally {
try {
d && !d.done && (a = f.return) && a.call(f);
} finally {
if (i) throw i.error;
}
}
this._nodeHiddenEntries.clear();
}
};
e.prototype.clear = function() {
var e, t, r, a, l, c, s, f;
try {
for (var d = o(i(this._nodeConvergeClones.keys())), u = d.next(); !u.done; u = d.next()) {
var h = u.value;
this._cancelConvergeForNode(h);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
u && !u.done && (t = d.return) && t.call(d);
} finally {
if (e) throw e.error;
}
}
try {
for (var p = o(this._nodeHiddenEntries), _ = p.next(); !_.done; _ = p.next()) {
var v = n(_.value, 2), y = (h = v[0], v[1]);
cc.isValid(h) && cc.Tween.stopAllByTarget(h);
this._restoreHiddenEntries(y);
}
} catch (e) {
r = {
error: e
};
} finally {
try {
_ && !_.done && (a = p.return) && a.call(p);
} finally {
if (r) throw r.error;
}
}
this._nodeHiddenEntries.clear();
try {
for (var g = o(this._nodeEntranceEffectStop.values()), m = g.next(); !m.done; m = g.next()) (0, 
m.value)();
} catch (e) {
l = {
error: e
};
} finally {
try {
m && !m.done && (c = g.return) && c.call(g);
} finally {
if (l) throw l.error;
}
}
this._nodeEntranceEffectStop.clear();
try {
for (var M = o(this._nodes), b = M.next(); !b.done; b = M.next()) {
h = n(b.value, 2)[1];
cc.isValid(h) && h.destroy();
}
} catch (e) {
s = {
error: e
};
} finally {
try {
b && !b.done && (f = M.return) && f.call(M);
} finally {
if (s) throw s.error;
}
}
this._nodes.clear();
};
e.prototype._createNode = function(e) {
var t, r;
if (!cc.isValid(this._layer) || !(null === (t = this._assetLoader) || void 0 === t ? void 0 : t.isReady)) return null;
var o = e.anchorRow, n = e.anchorCol, i = e.size, a = e.color, c = u(o, n, i), s = cc.instantiate(this._assetLoader.prefab);
s.name = "MergeBlock_" + e.id;
s.setPosition(c.x, c.y);
s.scaleX = i;
s.scaleY = i;
var f = s.getComponent(l.default), d = null === (r = hs.skinInfo.blockSkinInfoList) || void 0 === r ? void 0 : r[a - 1];
(null == d ? void 0 : d.colorList) && f.setState({
color: a,
size: i,
colorDataList: d.colorList,
blockSpriteFrame: null,
bevelStyle: this.bevelStyle
});
this._layer.addChild(s);
return s;
};
e.prototype._updateNodeState = function(e, t) {
var r, o = e.getComponent(l.default);
if (o) {
var n = t.size, i = t.color, a = null === (r = hs.skinInfo.blockSkinInfoList) || void 0 === r ? void 0 : r[i - 1];
(null == a ? void 0 : a.colorList) && o.setState({
color: i,
size: n,
colorDataList: a.colorList,
blockSpriteFrame: null,
bevelStyle: this.bevelStyle
});
}
};
e.prototype._playEntranceAnim = function(e, t, r, o, n, i) {
void 0 === i && (i = 0);
e.scale = i;
var a = {
scaleX: o,
scaleY: o
}, l = t > 0 ? cc.tween(e).delay(t).to(r, a, {
easing: "backOut"
}) : cc.tween(e).to(r, a, {
easing: "backOut"
});
n && l.call(n);
l.start();
};
e.prototype._restoreHiddenEntries = function(e) {
var t, r;
try {
for (var n = o(e), i = n.next(); !i.done; i = n.next()) {
var a = i.value;
cc.isValid(a.node) && (a.node.scale = a.originalScale);
}
} catch (e) {
t = {
error: e
};
} finally {
try {
i && !i.done && (r = n.return) && r.call(n);
} finally {
if (t) throw t.error;
}
}
};
e.prototype.cancelAllConverge = function() {
var e, t, r, a;
try {
for (var l = o(i(this._nodeConvergeClones.keys())), c = l.next(); !c.done; c = l.next()) {
var s = c.value;
this._cancelConvergeForNode(s);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
c && !c.done && (t = l.return) && t.call(l);
} finally {
if (e) throw e.error;
}
}
try {
for (var f = o(i(this._nodeHiddenEntries)), d = f.next(); !d.done; d = f.next()) {
var u = n(d.value, 2), h = (s = u[0], u[1]);
this._restoreHiddenEntries(h);
cc.isValid(s) && cc.Tween.stopAllByTarget(s);
}
} catch (e) {
r = {
error: e
};
} finally {
try {
d && !d.done && (a = f.return) && a.call(f);
} finally {
if (r) throw r.error;
}
}
this._nodeHiddenEntries.clear();
};
e.prototype._cancelConvergeForNode = function(e) {
var t, r, n = this._nodeConvergeClones.get(e);
if (n) {
try {
for (var i = o(n), a = i.next(); !a.done; a = i.next()) {
var l = a.value;
if (cc.isValid(l)) {
cc.Tween.stopAllByTarget(l);
l.destroy();
}
}
} catch (e) {
t = {
error: e
};
} finally {
try {
a && !a.done && (r = i.return) && r.call(i);
} finally {
if (t) throw t.error;
}
}
this._nodeConvergeClones.delete(e);
}
cc.isValid(e) && cc.Tween.stopAllByTarget(e);
var c = this._nodeHiddenEntries.get(e);
if (c) {
this._restoreHiddenEntries(c);
this._nodeHiddenEntries.delete(e);
}
var s = this._nodeEntranceEffectStop.get(e);
if (s) {
s();
this._nodeEntranceEffectStop.delete(e);
}
};
e.prototype._playConvergeAnim = function(e, t, r) {
var n, i, a, l, c, f, d, h, p, _, v = this;
if (cc.isValid(this._layer)) {
for (var y = u(e.anchorRow, e.anchorCol, e.size), g = [], m = [], M = e.anchorRow; M < e.anchorRow + e.size; M++) for (var b = e.anchorCol; b < e.anchorCol + e.size; b++) {
var k = null === (l = null === (a = hs.boardRendererInfo.blocks) || void 0 === a ? void 0 : a[M]) || void 0 === l ? void 0 : l[b], B = null === (f = null === (c = hs.boardRendererInfo.blockSprites) || void 0 === c ? void 0 : c[M]) || void 0 === f ? void 0 : f[b];
if (k && cc.isValid(k)) {
var E = null === (h = null === (d = null == B ? void 0 : B.block) || void 0 === d ? void 0 : d._materials) || void 0 === h ? void 0 : h[0];
if (!E || "builtin-2d-sprite (Instance)" === E.name) {
var P = null === (p = null == B ? void 0 : B.block) || void 0 === p ? void 0 : p.spriteFrame;
if (P) {
var C = k.scale;
k.scale = 0;
m.push({
node: k,
originalScale: C
});
(A = new cc.Node()).addComponent(cc.Sprite).spriteFrame = P;
A.width = s;
A.height = s;
A.color = cc.color(k.color.r, k.color.g, k.color.b, k.color.a);
var S = k.convertToWorldSpaceAR(cc.Vec2.ZERO), w = this._layer.convertToNodeSpaceAR(S);
A.setPosition(w.x, w.y);
this._layer.addChild(A);
g.push({
clone: A,
lx: w.x,
ly: w.y
});
}
}
}
}
this._nodeConvergeClones.set(t, g.map(function(e) {
return e.clone;
}));
this._nodeHiddenEntries.set(t, m);
if (0 !== g.length) {
var x = g.length, R = function(o, n, i) {
var a = n - y.x, l = i - y.y, c = Math.sqrt(a * a + l * l), s = c > 1 ? n + a / c * 7 : n, f = c > 1 ? i + l / c * 7 : i;
cc.tween(o).to(.1, {
x: s,
y: f
}, {
easing: "sineOut"
}).to(.2, {
x: y.x,
y: y.y
}, {
easing: "sineIn"
}).call(function() {
var n;
cc.isValid(o) && o.destroy();
if (!(--x > 0) && v._nodeConvergeClones.has(t)) {
v._nodeConvergeClones.delete(t);
if (cc.isValid(t)) {
var i = null === (n = v.entranceEffectManager) || void 0 === n ? void 0 : n.play(t.x, t.y, e.size, e.color, v.bevelStyle);
i && v._nodeEntranceEffectStop.set(t, i);
v._playEntranceAnim(t, 0, .5, e.size, function() {
v._nodeEntranceEffectStop.delete(t);
if (cc.isValid(t)) {
var e = v._nodeHiddenEntries.get(t);
if (e) {
v._restoreHiddenEntries(e);
v._nodeHiddenEntries.delete(t);
}
r();
}
}, 1);
} else {
var a = v._nodeHiddenEntries.get(t);
if (a) {
v._restoreHiddenEntries(a);
v._nodeHiddenEntries.delete(t);
}
}
}
}).start();
};
try {
for (var O = o(g), L = O.next(); !L.done; L = O.next()) {
var A, F = L.value;
R(A = F.clone, F.lx, F.ly);
}
} catch (e) {
n = {
error: e
};
} finally {
try {
L && !L.done && (i = O.return) && i.call(O);
} finally {
if (n) throw n.error;
}
}
} else {
this._cancelConvergeForNode(t);
var I = null === (_ = this.entranceEffectManager) || void 0 === _ ? void 0 : _.play(t.x, t.y, e.size, e.color, this.bevelStyle);
I && this._nodeEntranceEffectStop.set(t, I);
this._playEntranceAnim(t, 0, .5, e.size, function() {
v._nodeEntranceEffectStop.delete(t);
cc.isValid(t) && r();
});
}
} else this._playEntranceAnim(t, 0, .5, e.size, r);
};
e.prototype._playFullSplitAnim = function(e) {
cc.tween(e).to(.3, {
scale: 0,
opacity: 0
}, {
easing: "sineIn"
}).call(function() {
cc.isValid(e) && e.destroy();
}).start();
};
e.prototype._classifyChanges = function(e, t) {
var r, n, a = new Set(t.map(function(e) {
return e.id;
})), l = new Set(e.map(function(e) {
return e.id;
})), c = new Set(i(a).filter(function(e) {
return l.has(e);
})), s = e.filter(function(e) {
return !c.has(e.id);
}), f = t.filter(function(e) {
return !c.has(e.id);
}), d = new Map(), u = new Map(), h = new Set(), p = new Set(), _ = function(e) {
var t = f.find(function(t) {
return !p.has(t.id) && t.size > e.size && t.anchorRow <= e.anchorRow && t.anchorCol <= e.anchorCol && t.anchorRow + t.size >= e.anchorRow + e.size && t.anchorCol + t.size >= e.anchorCol + e.size;
});
if (t) {
d.set(e.id, t);
p.add(t.id);
return "continue";
}
var r = f.find(function(t) {
return !p.has(t.id) && t.size < e.size && t.anchorRow >= e.anchorRow && t.anchorCol >= e.anchorCol && t.anchorRow + t.size <= e.anchorRow + e.size && t.anchorCol + t.size <= e.anchorCol + e.size;
});
if (r) {
u.set(e.id, r);
p.add(r.id);
return "continue";
}
h.add(e.id);
};
try {
for (var v = o(s), y = v.next(); !y.done; y = v.next()) _(y.value);
} catch (e) {
r = {
error: e
};
} finally {
try {
y && !y.done && (n = v.return) && n.call(v);
} finally {
if (r) throw r.error;
}
}
var g = new Set(f.filter(function(e) {
return !p.has(e.id);
}).map(function(e) {
return e.id;
}));
return {
upgradeMap: d,
shrinkMap: u,
fullSplitIds: h,
freshNewIds: g
};
};
return e;
}();
r.MergeBlockNodeManager = p;
cc._RF.pop();
}, {
"./MergeBlockSkinHelper": "MergeBlockSkinHelper",
"./components/MergeBlockMaterialUpdate": "MergeBlockMaterialUpdate",
"./components/MergeSkinBlockComponent": "MergeSkinBlockComponent"
} ],
MergeBlockPreEliminateFrameManager: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "93e65lBK0BNKI7Fc/1wyocW", "MergeBlockPreEliminateFrameManager");
var o = this && this.__values || function(e) {
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
}, n = this && this.__read || function(e, t) {
var r = "function" == typeof Symbol && e[Symbol.iterator];
if (!r) return e;
var o, n, i = r.call(e), a = [];
try {
for (;(void 0 === t || t-- > 0) && !(o = i.next()).done; ) a.push(o.value);
} catch (e) {
n = {
error: e
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
r.MergeBlockPreEliminateFrameManager = void 0;
var i = e("./components/MergePreEliminateFrameComponent"), a = e("./MergeBlockNodeManager"), l = e("./MergeBlockSkinHelper"), c = function() {
function e(e, t) {
this._pool = [];
this._active = [];
this._prefab = e;
this._layer = t;
this._initPool();
}
e.prototype.show = function(e, t, r) {
var i, c, s, f, d, u;
this._releaseAll();
var h = this._extractRows(t), p = this._extractCols(r);
if (0 !== h.size || 0 !== p.size) try {
for (var _ = o(e), v = _.next(); !v.done; v = _.next()) {
var y = v.value, g = a.calcMergeBlockPos(y.anchorRow, y.anchorCol, y.size), m = l.getBigPreClearColors(y.color)[0], M = this._intersectRows(y, h);
try {
for (var b = (s = void 0, o(this._groupConsecutive(M))), k = b.next(); !k.done; k = b.next()) {
var B = n(k.value, 2), E = B[0], P = B[1];
if (!(A = this._popFromPool())) return;
var C = 106 * y.size, S = 106 * (P - E + 1), w = g.x, x = g.y + 106 * ((y.size - 1) / 2 - (E + P) / 2);
this._applyFrame(A, w, x, C, S, m);
}
} catch (e) {
s = {
error: e
};
} finally {
try {
k && !k.done && (f = b.return) && f.call(b);
} finally {
if (s) throw s.error;
}
}
var R = this._intersectCols(y, p);
try {
for (var O = (d = void 0, o(this._groupConsecutive(R))), L = O.next(); !L.done; L = O.next()) {
var A, F = n(L.value, 2), I = F[0], z = F[1];
if (!(A = this._popFromPool())) return;
C = 106 * (z - I + 1), S = 106 * y.size, w = g.x + 106 * ((I + z) / 2 - (y.size - 1) / 2), 
x = g.y;
this._applyFrame(A, w, x, C, S, m);
}
} catch (e) {
d = {
error: e
};
} finally {
try {
L && !L.done && (u = O.return) && u.call(O);
} finally {
if (d) throw d.error;
}
}
}
} catch (e) {
i = {
error: e
};
} finally {
try {
v && !v.done && (c = _.return) && c.call(_);
} finally {
if (i) throw i.error;
}
}
};
e.prototype.hide = function() {
this._releaseAll();
};
e.prototype._initPool = function() {
for (var e = 0; e < 30; e++) {
var t = cc.instantiate(this._prefab);
t.active = !1;
t.name = "MergePreEliminateFrame_" + e;
t.zIndex = 1;
t.addComponent(i.default);
this._layer.addChild(t);
this._pool.push(t);
}
};
e.prototype._applyFrame = function(e, t, r, o, n, a) {
e.setPosition(t, r);
e.getComponent(i.default).setState({
mode: "show",
width: o,
height: n,
color: a
});
this._active.push(e);
};
e.prototype._popFromPool = function() {
var e = this._pool.pop();
return e && cc.isValid(e) ? e : null;
};
e.prototype._releaseAll = function() {
var e, t;
try {
for (var r = o(this._active), n = r.next(); !n.done; n = r.next()) {
var i = n.value;
cc.isValid(i) && (i.active = !1);
this._pool.push(i);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
n && !n.done && (t = r.return) && t.call(r);
} finally {
if (e) throw e.error;
}
}
this._active.length = 0;
};
e.prototype._extractRows = function(e) {
return new Set(Object.keys(e).map(Number));
};
e.prototype._extractCols = function(e) {
var t, r, n, i, a = new Set();
try {
for (var l = o(Object.values(e)), c = l.next(); !c.done; c = l.next()) {
var s = c.value;
try {
for (var f = (n = void 0, o(Object.keys(s))), d = f.next(); !d.done; d = f.next()) {
var u = d.value;
a.add(Number(u));
}
} catch (e) {
n = {
error: e
};
} finally {
try {
d && !d.done && (i = f.return) && i.call(f);
} finally {
if (n) throw n.error;
}
}
}
} catch (e) {
t = {
error: e
};
} finally {
try {
c && !c.done && (r = l.return) && r.call(l);
} finally {
if (t) throw t.error;
}
}
return a;
};
e.prototype._intersectRows = function(e, t) {
for (var r = [], o = 0; o < e.size; o++) t.has(e.anchorRow + o) && r.push(o);
return r;
};
e.prototype._intersectCols = function(e, t) {
for (var r = [], o = 0; o < e.size; o++) t.has(e.anchorCol + o) && r.push(o);
return r;
};
e.prototype._groupConsecutive = function(e) {
if (0 === e.length) return [];
for (var t = [], r = e[0], o = e[0], n = 1; n < e.length; n++) if (e[n] === o + 1) o = e[n]; else {
t.push([ r, o ]);
r = e[n];
o = e[n];
}
t.push([ r, o ]);
return t;
};
return e;
}();
r.MergeBlockPreEliminateFrameManager = c;
cc._RF.pop();
}, {
"./MergeBlockNodeManager": "MergeBlockNodeManager",
"./MergeBlockSkinHelper": "MergeBlockSkinHelper",
"./components/MergePreEliminateFrameComponent": "MergePreEliminateFrameComponent"
} ],
MergeBlockPreEliminateManager: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "5b99eJiy7tBCaC5g0HH7i/N", "MergeBlockPreEliminateManager");
var o = this && this.__values || function(e) {
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
}, n = this && this.__read || function(e, t) {
var r = "function" == typeof Symbol && e[Symbol.iterator];
if (!r) return e;
var o, n, i = r.call(e), a = [];
try {
for (;(void 0 === t || t-- > 0) && !(o = i.next()).done; ) a.push(o.value);
} catch (e) {
n = {
error: e
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
r.MergeBlockPreEliminateManager = r.calcMergeBlockEliminateMode = void 0;
var i = e("./components/MergePreEliminateComponent"), a = e("./MergeBlockNodeManager"), l = e("./MergeBlockSkinHelper");
r.calcMergeBlockEliminateMode = function(e, t, r) {
var n, i, a, l, c = new Set(Object.keys(t).map(Number)), s = new Set();
try {
for (var f = o(Object.values(r)), d = f.next(); !d.done; d = f.next()) {
var u = d.value;
try {
for (var h = (a = void 0, o(Object.keys(u))), p = h.next(); !p.done; p = h.next()) {
var _ = p.value;
s.add(Number(_));
}
} catch (e) {
a = {
error: e
};
} finally {
try {
p && !p.done && (l = h.return) && l.call(h);
} finally {
if (a) throw a.error;
}
}
}
} catch (e) {
n = {
error: e
};
} finally {
try {
d && !d.done && (i = f.return) && i.call(f);
} finally {
if (n) throw n.error;
}
}
for (var v = 0, y = e.size * e.size, g = e.anchorRow; g < e.anchorRow + e.size; g++) for (var m = e.anchorCol; m < e.anchorCol + e.size; m++) (c.has(g) || s.has(m)) && v++;
return 0 === v ? "none" : v === y ? "full" : "partial";
};
var c = function() {
function e(e, t) {
this._pool = [];
this._active = new Map();
this._prefab = e;
this._layer = t;
this._initPool();
}
e.prototype.show = function(e, t, r) {
var n, i;
this._releaseAll();
try {
for (var c = o(e), s = c.next(); !s.done; s = c.next()) {
var f = s.value, d = this._determineMode(f, t, r);
if ("none" !== d) {
var u = this._popFromPool();
if (!u) break;
var h = a.calcMergeBlockPos(f.anchorRow, f.anchorCol, f.size);
u.node.setPosition(h.x, h.y);
u.node.active = !0;
var p = {
mode: d,
size: f.size,
colors: l.getBigPreClearColors(f.color)
};
u.comp.setState(p);
this._active.set(f.id, u);
}
}
} catch (e) {
n = {
error: e
};
} finally {
try {
s && !s.done && (i = c.return) && i.call(c);
} finally {
if (n) throw n.error;
}
}
};
e.prototype.hide = function() {
this._releaseAll();
};
e.prototype._initPool = function() {
for (var e, t, r, o, n, a, l = 0; l < 7; l++) {
var c = cc.instantiate(this._prefab);
c.active = !1;
c.zIndex = 1;
this._layer.addChild(c);
var s = c.addComponent(i.default);
s.anim_1 = null !== (t = null === (e = c.getChildByName("anim_1")) || void 0 === e ? void 0 : e.getComponent(sp.Skeleton)) && void 0 !== t ? t : null;
s.anim_2 = null !== (o = null === (r = c.getChildByName("anim_2")) || void 0 === r ? void 0 : r.getComponent(sp.Skeleton)) && void 0 !== o ? o : null;
s.anim_3 = null !== (a = null === (n = c.getChildByName("anim_3")) || void 0 === n ? void 0 : n.getComponent(sp.Skeleton)) && void 0 !== a ? a : null;
this._pool.push({
node: c,
comp: s
});
}
};
e.prototype._popFromPool = function() {
return this._pool.length > 0 ? this._pool.pop() : null;
};
e.prototype._releaseAll = function() {
var e, t;
try {
for (var r = o(this._active), i = r.next(); !i.done; i = r.next()) {
var a = n(i.value, 2)[1];
a.node.active = !1;
this._pool.push(a);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
i && !i.done && (t = r.return) && t.call(r);
} finally {
if (e) throw e.error;
}
}
this._active.clear();
};
e.prototype._determineMode = function(e, t, r) {
var n, i, a, l, c = new Set(Object.keys(t).map(Number)), s = new Set();
try {
for (var f = o(Object.values(r)), d = f.next(); !d.done; d = f.next()) {
var u = d.value;
try {
for (var h = (a = void 0, o(Object.keys(u))), p = h.next(); !p.done; p = h.next()) {
var _ = p.value;
s.add(Number(_));
}
} catch (e) {
a = {
error: e
};
} finally {
try {
p && !p.done && (l = h.return) && l.call(h);
} finally {
if (a) throw a.error;
}
}
}
} catch (e) {
n = {
error: e
};
} finally {
try {
d && !d.done && (i = f.return) && i.call(f);
} finally {
if (n) throw n.error;
}
}
for (var v = 0, y = e.size * e.size, g = e.anchorRow; g < e.anchorRow + e.size; g++) for (var m = e.anchorCol; m < e.anchorCol + e.size; m++) (c.has(g) || s.has(m)) && v++;
return 0 === v ? "none" : v === y ? "full" : "partial";
};
return e;
}();
r.MergeBlockPreEliminateManager = c;
cc._RF.pop();
}, {
"./MergeBlockNodeManager": "MergeBlockNodeManager",
"./MergeBlockSkinHelper": "MergeBlockSkinHelper",
"./components/MergePreEliminateComponent": "MergePreEliminateComponent"
} ],
MergeBlockPreEliminatePreviewManager: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "e7450rZ8OhC87ZlgJ9lLe2O", "MergeBlockPreEliminatePreviewManager");
var o = this && this.__values || function(e) {
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
r.MergeBlockPreEliminatePreviewManager = void 0;
var n = e("./MergeBlockDetector"), i = e("./MergeBlockNodeManager"), a = e("./MergeBlockPreEliminateManager"), l = e("./components/MergeSkinBlockComponent"), c = function() {
function e(e, t, r) {
this._previewDetector = new n.MergeBlockDetector();
this._pool = [];
this._active = [];
this._hypotheticalFaceBlocks = [];
this._lastPreviewBlocks = [];
this.bevelStyle = 0;
this._assetLoader = e;
this._layer = t;
this._nodeManager = r;
this._initHypotheticalGrid();
this._initPool();
}
e.prototype.show = function(e, t, r) {
var n, i, l, c, s, f = hs.boardInfo.faceBlocks;
if (f && (null === (s = this._assetLoader) || void 0 === s ? void 0 : s.isReady)) {
var d = this._extractRows(t), u = this._extractCols(r);
this._buildHypotheticalFaceBlocks(f, d, u);
this._lastPreviewBlocks = this._previewDetector.detect(this._hypotheticalFaceBlocks, e);
this._nodeManager.setAllVisibility(!1);
this._releaseAll();
try {
for (var h = o(this._lastPreviewBlocks), p = h.next(); !p.done; p = h.next()) {
var _ = p.value;
this._showPreviewNode(_);
}
} catch (e) {
n = {
error: e
};
} finally {
try {
p && !p.done && (i = h.return) && i.call(h);
} finally {
if (n) throw n.error;
}
}
try {
for (var v = o(e), y = v.next(); !y.done; y = v.next()) {
_ = y.value;
"full" === a.calcMergeBlockEliminateMode(_, t, r) && this._showPreviewNode(_);
}
} catch (e) {
l = {
error: e
};
} finally {
try {
y && !y.done && (c = v.return) && c.call(v);
} finally {
if (l) throw l.error;
}
}
}
};
e.prototype.hide = function() {
this._nodeManager.setAllVisibility(!0);
this._releaseAll();
};
e.prototype._initHypotheticalGrid = function() {
for (var e = 0; e < 8; e++) this._hypotheticalFaceBlocks[e] = new Array(8).fill(0);
};
e.prototype._initPool = function() {
var e;
if ((null === (e = this._assetLoader) || void 0 === e ? void 0 : e.prefab) && cc.isValid(this._layer)) for (var t = 0; t < 16; t++) {
var r = cc.instantiate(this._assetLoader.prefab);
r.active = !1;
r.name = "MergePreviewBlock_" + t;
this._layer.addChild(r);
this._pool.push(r);
}
};
e.prototype._showPreviewNode = function(e) {
var t, r = this._pool.pop();
if (r && cc.isValid(r)) {
var o = i.calcMergeBlockPos(e.anchorRow, e.anchorCol, e.size);
r.setPosition(o.x, o.y);
r.scaleX = e.size;
r.scaleY = e.size;
var n = r.getComponent(l.default), a = null === (t = hs.skinInfo.blockSkinInfoList) || void 0 === t ? void 0 : t[e.color - 1];
n && (null == a ? void 0 : a.colorList) && n.setState({
color: e.color,
size: e.size,
colorDataList: a.colorList,
blockSpriteFrame: null,
bevelStyle: this.bevelStyle
});
r.active = !0;
this._active.push(r);
}
};
e.prototype._releaseAll = function() {
var e, t;
try {
for (var r = o(this._active), n = r.next(); !n.done; n = r.next()) {
var i = n.value;
cc.isValid(i) && (i.active = !1);
this._pool.push(i);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
n && !n.done && (t = r.return) && t.call(r);
} finally {
if (e) throw e.error;
}
}
this._active.length = 0;
};
e.prototype._buildHypotheticalFaceBlocks = function(e, t, r) {
for (var o, n, i = 0; i < 8; i++) for (var a = 0; a < 8; a++) t.has(i) || r.has(a) ? this._hypotheticalFaceBlocks[i][a] = -1 : this._hypotheticalFaceBlocks[i][a] = null !== (n = null === (o = e[i]) || void 0 === o ? void 0 : o[a]) && void 0 !== n ? n : -1;
};
e.prototype._extractRows = function(e) {
return new Set(Object.keys(e).map(Number));
};
e.prototype._extractCols = function(e) {
var t, r, n, i, a = new Set();
try {
for (var l = o(Object.values(e)), c = l.next(); !c.done; c = l.next()) {
var s = c.value;
try {
for (var f = (n = void 0, o(Object.keys(s))), d = f.next(); !d.done; d = f.next()) {
var u = d.value;
a.add(Number(u));
}
} catch (e) {
n = {
error: e
};
} finally {
try {
d && !d.done && (i = f.return) && i.call(f);
} finally {
if (n) throw n.error;
}
}
}
} catch (e) {
t = {
error: e
};
} finally {
try {
c && !c.done && (r = l.return) && r.call(l);
} finally {
if (t) throw t.error;
}
}
return a;
};
return e;
}();
r.MergeBlockPreEliminatePreviewManager = c;
cc._RF.pop();
}, {
"./MergeBlockDetector": "MergeBlockDetector",
"./MergeBlockNodeManager": "MergeBlockNodeManager",
"./MergeBlockPreEliminateManager": "MergeBlockPreEliminateManager",
"./components/MergeSkinBlockComponent": "MergeSkinBlockComponent"
} ],
MergeBlockScoreComponent: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "f751d1rhs1Dy79VhQVlYPKg", "MergeBlockScoreComponent");
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
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, o); else for (var l = e.length - 1; l >= 0; l--) (n = e[l]) && (a = (i < 3 ? n(a) : i > 3 ? n(t, r, a) : n(t, r)) || a);
return i > 3 && a && Object.defineProperty(t, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var a = cc._decorator.ccclass, l = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.scoreLabel = null;
t.trail = null;
return t;
}
r = t;
t.prototype.render = function() {
var e, t = this, o = this.state, n = o.mode, i = o.score, a = o.blockSize, l = o.x, c = o.y, s = o.targetX, f = o.targetY, d = o.onComplete;
cc.Tween.stopAllByTarget(this.node);
if (this.trail) {
cc.Tween.stopAllByTarget(this.trail.node);
this.trail.node.active = !1;
}
if ("none" !== n) {
this.node.active = !0;
this.node.opacity = 0;
this.node.scale = 0;
this.node.setPosition(l, c);
this.scoreLabel.string = "+" + i;
this.scoreLabel.fontSize = null !== (e = r.FONT_SIZE_MAP[a]) && void 0 !== e ? e : r.FONT_SIZE_MAX;
var u = cc.director._kSpeed || 1, h = r.T_APPEAR_BASE / 2 * u, p = r.T_DELAY_BASE / 2 * u, _ = r.T_FLY_BASE / 2 * u, v = r.T_MERGE_BASE / 2 * u;
if (this.trail) {
var y = s - l, g = f - c, m = Math.atan2(-y, g) * (180 / Math.PI);
cc.tween(this.trail.node).delay(h + p).call(function() {
var e;
if (cc.isValid(null === (e = t.trail) || void 0 === e ? void 0 : e.node)) {
t.trail.node.angle = m;
t.trail.node.active = !0;
t.trail.timeScale = .5;
t.trail.setAnimation(0, "in", !1);
t.trail.addAnimation(0, "init", !0, 0);
}
}).delay(_).call(function() {
var e;
cc.isValid(null === (e = t.trail) || void 0 === e ? void 0 : e.node) && t.trail.setAnimation(0, "out", !1);
}).start();
}
cc.tween(this.node).to(h, {
opacity: 255,
scale: 1
}, {
easing: cc.easing.backInOut
}).delay(p).to(_, {
x: s,
y: f,
scale: .7
}, {
easing: cc.easing.sineIn
}).to(v, {
scale: 0,
opacity: 0
}, {
easing: cc.easing.sineIn
}).call(function() {
null == d || d();
}).start();
} else this.node.active = !1;
};
var r;
t.FONT_SIZE_MAP = {
2: 100,
3: 108,
4: 120,
5: 126,
6: 138
};
t.FONT_SIZE_MAX = 138;
t.T_APPEAR_BASE = .6;
t.T_DELAY_BASE = 1;
t.T_FLY_BASE = .9;
t.T_MERGE_BASE = .3;
return r = i([ a ], t);
}(hs.Component);
r.default = l;
cc._RF.pop();
}, {} ],
MergeBlockScoreManager: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "3e35ccBAtNCUq8OCqVLo0tP", "MergeBlockScoreManager");
Object.defineProperty(r, "__esModule", {
value: !0
});
r.MergeBlockScoreManager = void 0;
var o = e("./components/MergeBlockScoreComponent"), n = function() {
function e(e) {
this._pool = [];
this._prefab = e;
this._initPool();
}
e.prototype.play = function(e, t, r, o, n, i) {
var a = this, l = hs.gameEffectLayer;
if (cc.isValid(l)) {
var c = this._popFromPool();
if (c) {
l.addChild(c.node);
c.inUse = !0;
c.node.active = !0;
var s = {
mode: "play",
score: e,
blockSize: t,
x: r,
y: o,
targetX: n,
targetY: i,
onComplete: function() {
a._releaseItem(c);
}
};
c.comp.setState(s);
}
}
};
e.prototype._initPool = function() {
for (var e, t, r, n, i = 0; i < 8; i++) {
var a = cc.instantiate(this._prefab);
a.active = !1;
var l = a.addComponent(o.default);
l.scoreLabel = null !== (t = null === (e = a.getChildByName("score")) || void 0 === e ? void 0 : e.getComponent(cc.Label)) && void 0 !== t ? t : null;
l.trail = null !== (n = null === (r = a.getChildByName("trail")) || void 0 === r ? void 0 : r.getComponent(sp.Skeleton)) && void 0 !== n ? n : null;
var c = {
node: a,
comp: l,
inUse: !1
};
this._pool.push(c);
}
};
e.prototype._popFromPool = function() {
return this._pool.length > 0 ? this._pool.pop() : null;
};
e.prototype._releaseItem = function(e) {
e.inUse = !1;
e.comp.setState({
mode: "none",
score: 0,
blockSize: 2,
x: 0,
y: 0,
targetX: 0,
targetY: 0,
onComplete: null
});
e.node.removeFromParent(!1);
this._pool.push(e);
};
return e;
}();
r.MergeBlockScoreManager = n;
cc._RF.pop();
}, {
"./components/MergeBlockScoreComponent": "MergeBlockScoreComponent"
} ],
MergeBlockSkinHelper: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "39f8e4vW4FFcrQ/qkuLKObi", "MergeBlockSkinHelper");
Object.defineProperty(r, "__esModule", {
value: !0
});
r.getPreClearColor = r.getBigPreClearColors = r.getBigClearColors = r.getMergeEntranceColors = r.getMergeBorderColor = void 0;
function o(e, t, r) {
var o, n, i, a;
void 0 === r && (r = "#ffffff");
var l = hs.skinInfo.currentSkinInfo;
return null !== (a = null === (i = null === (n = null === (o = null == l ? void 0 : l["" + e + t]) || void 0 === o ? void 0 : o.colorList) || void 0 === n ? void 0 : n[0]) || void 0 === i ? void 0 : i.color) && void 0 !== a ? a : r;
}
function n(e, t, r, o) {
var n, i;
void 0 === o && (o = "#ffffff");
var a = hs.skinInfo.currentSkinInfo, l = null !== (i = null === (n = null == a ? void 0 : a["" + e + t]) || void 0 === n ? void 0 : n.colorList) && void 0 !== i ? i : [];
return Array.from({
length: r
}, function(e, t) {
var r, n;
return null !== (n = null === (r = l[t]) || void 0 === r ? void 0 : r.color) && void 0 !== n ? n : o;
});
}
r.getMergeBorderColor = function(e) {
return o("merge", e);
};
r.getMergeEntranceColors = function(e) {
var t = n("merge", e, 3);
return [ t[0], t[1], t[2] ];
};
r.getBigClearColors = function(e) {
var t = n("bigClear", e, 3);
return [ t[0], t[1], t[2] ];
};
r.getBigPreClearColors = function(e) {
var t = n("bigPreClear", e, 3);
return [ t[0], t[1], t[2] ];
};
r.getPreClearColor = function(e) {
return o("preClear", e);
};
cc._RF.pop();
}, {} ],
MergeBlockTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "9b421Q5nbpAza40WVu7QnNz", "MergeBlockTrait");
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
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, o); else for (var l = e.length - 1; l >= 0; l--) (n = e[l]) && (a = (i < 3 ? n(a) : i > 3 ? n(t, r, a) : n(t, r)) || a);
return i > 3 && a && Object.defineProperty(t, r, a), a;
}, a = this && this.__read || function(e, t) {
var r = "function" == typeof Symbol && e[Symbol.iterator];
if (!r) return e;
var o, n, i = r.call(e), a = [];
try {
for (;(void 0 === t || t-- > 0) && !(o = i.next()).done; ) a.push(o.value);
} catch (e) {
n = {
error: e
};
} finally {
try {
o && !o.done && (r = i.return) && r.call(i);
} finally {
if (n) throw n.error;
}
}
return a;
}, l = this && this.__spread || function() {
for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(a(arguments[t]));
return e;
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
r.MergeBlockTrait = void 0;
var s = e("./MergeBlockAssetLoader"), f = e("./MergeBlockBorderEffectManager"), d = e("./MergeBlockComboManager"), u = e("./MergeBlockDetector"), h = e("./MergeBlockDotProxy"), p = e("./MergeBlockEliminateManager"), _ = e("./MergeBlockEncourageManager"), v = e("./MergeBlockEntranceEffectManager"), y = e("./MergeBlockNodeManager"), g = e("./MergeBlockPreEliminateFrameManager"), m = e("./MergeBlockPreEliminateManager"), M = e("./MergeBlockPreEliminatePreviewManager"), b = e("./MergeBlockScoreManager"), k = e("./MergeBlockSkinHelper"), B = e("./MergeLinePreEliminateManager"), E = "mergeBlockTrait", P = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._mergeBlocks = [];
t._mergeLayer = null;
t._nodeManager = null;
t._assetLoader = null;
t._detector = new u.MergeBlockDetector();
t._preEliminateManager = null;
t._eliminateManager = null;
t._borderEffectManager = null;
t._entranceEffectManager = null;
t._encourageManager = null;
t._comboManager = null;
t._scoreManager = null;
t._linePreEliminateManager = null;
t._previewManager = null;
t._frameManager = null;
t._variant = null;
t._blockUnderPreEliminateLayer = null;
t._scoreTargetNode = null;
t._hasPendingMergeScore = !1;
t._pendingGameMode = null;
return t;
}
r = t;
t.prototype.onCreate = function() {
var e = this;
this._assetLoader = new s.MergeBlockAssetLoader(function() {
return e._onAssetsReady();
});
this._assetLoader.load();
};
t.prototype.onActive = function(e) {
var t, r;
(hs.tp.isClassGame_ProxyOnClassGameStart(e) || hs.tp.isMergeBlocksGame_ProxyOnMergeBlocksGameStart(e)) && this._onGameStart();
if (hs.tp.isBoardInitBoard(e)) {
this._initLayer(e.target);
"reset" === this._pendingGameMode ? this._resetAndScan() : this._restoreFromStorage();
this._pendingGameMode = null;
}
hs.tp.isGameOver_ProxyOnBoardShowBoardFinished(e) && this._isCurrentMode() && cc.isValid(this._mergeLayer) && this._resetAndScan();
(hs.tp.isClassGame_ProxyOnClassGameShow(e) || hs.tp.isMergeBlocksGame_ProxyOnMergeBlocksGameShow(e)) && this._onGameShow();
(hs.tp.isClassBlocksProducer_ProxyOnClassGameHide(e) || hs.tp.isMergeBlocksBlocksProducer_ProxyOnMergeBlocksGameHide(e)) && this._onGameHide();
hs.tp.isBlocksProducer_ProxyOnTouchEnd(e) && this._onBlocksProducerTouchEnd(e.args[0]);
hs.tp.isEliminate_Effects_ProxyTouchOnMoveCanSnap(e) && this._onCanSnap(e);
(hs.tp.isClassEliminate_Effects_ProxyDealEliminateClearEffect(e) || hs.tp.isMergeBlocksEliminate_Effects_ProxyDealEliminateClearEffect(e) || hs.tp.isClassEliminate_Effects_ProxyRecycleEffect(e) || hs.tp.isMergeBlocksEliminate_Effects_ProxyRecycleEffect(e) || hs.tp.isBlocksProducerTouchBackBlocks(e) || hs.tp.isEliminate_Effects_ProxyOnBlockProducerAnyTouchEnd(e) || hs.tp.isEliminate_Effects_ProxyTouchOnMoveNoCanSnap(e)) && this._onHidePreEliminate();
hs.tp.isSkin_ProxyLoadSkinCfgComplete(e) && this._onSyncSkin();
(hs.tp.isClassSkin_ProxyOnSkinReadyComplete(e) || hs.tp.isMergeBlocksSkin_ProxyOnSkinReadyComplete(e)) && this._onSkinChanged();
hs.tp.isEncourage_ProxySetEffectState(e) && this._onEncourageSetEffectState(e);
(hs.tp.isEncourage_ProxyOnEncourageSoundPlay(e) || hs.tp.isClassEncourage_ProxyPlayEncourageUnbelievableAudio(e) || hs.tp.isMergeBlocksEncourage_ProxyPlayEncourageUnbelievableAudio(e)) && this._onInterceptEncourageAudio(e);
(hs.tp.isClassCombo_ProxyShowCombo(e) || hs.tp.isMergeBlocksCombo_ProxyShowCombo(e)) && this._onInterceptComboShow(e);
(hs.tp.isClassScoreTip_ProxyGetScoreGroupDelay(e) || hs.tp.isMergeBlocksScoreTip_ProxyGetScoreGroupDelay(e)) && this._onInterceptScoreGroupDelay(e);
hs.tp.isSkinChangeClearEffectsTraitChangeColorConfig(e) && this._onInterceptPreClearColorConfig(e);
hs.tp.isClearBoardUnbelievableEffectTraitIsOnActive(e) && this._onInterceptClearBoardUnbelievable(e);
(hs.tp.isAddClearTipsExTrait_showPreEliminateEffect(e) || hs.tp.isMergeBlocksAddClearTipsExTrait_showPreEliminateEffect(e)) && this._onShowLinePreEliminateEffect(e);
if (hs.tp.isComboRainbowTraitCheckPlayRainbowForSkin(e) && hs.gameInfo.gameMode === hs.GameMode.MergeBlocks) {
e.args[0] = !1;
e.replace = !0;
}
if ((hs.tp.isClassGame_ProxyOnGameOverPre(e) || hs.tp.isMergeBlocksGame_ProxyOnGameOverPre(e)) && this._isCurrentMode()) {
null === (t = this._nodeManager) || void 0 === t || t.cancelAllConverge();
null === (r = this._entranceEffectManager) || void 0 === r || r.stopAll();
}
};
t.prototype._onGameShow = function() {
this._isCurrentMode() && cc.isValid(this._mergeLayer) && (this._mergeLayer.active = !0);
};
t.prototype._onGameHide = function() {
this._isCurrentMode() && cc.isValid(this._mergeLayer) && (this._mergeLayer.active = !1);
};
t.prototype._onHidePreEliminate = function() {
var e, t, r, o;
if (this._isCurrentMode()) {
null === (e = this._preEliminateManager) || void 0 === e || e.hide();
null === (t = this._linePreEliminateManager) || void 0 === t || t.hide();
null === (r = this._previewManager) || void 0 === r || r.hide();
null === (o = this._frameManager) || void 0 === o || o.hide();
}
};
t.prototype._onShowLinePreEliminateEffect = function(e) {
var t, r, o;
if (this._isCurrentMode() && this._linePreEliminateManager && !0 !== e.replace) {
var n = null === (t = e.args) || void 0 === t ? void 0 : t[0], i = null === (r = e.args) || void 0 === r ? void 0 : r[1], a = null === (o = e.args) || void 0 === o ? void 0 : o[2];
if (n) {
var l = TRAIT("DualColorMoreColorPriorityTrait");
if ((null == l ? void 0 : l.active) && !l.IsColorSolid()) {
var c = l.cachedMajorityPreEliminateColor;
c > 0 && (a = c);
}
var s = k.getPreClearColor(a);
this._linePreEliminateManager.showLine(n, i, s);
e.replace = !0;
}
}
};
t.prototype._onSyncSkin = function() {
var e;
this._isCurrentMode() && (null === (e = this._nodeManager) || void 0 === e || e.syncSkin(this._mergeBlocks));
};
t.prototype._onCanSnap = function(e) {
var t, r, o, n, i, a;
if (this._isCurrentMode()) {
this._tryInitLinePreEliminateManager();
null === (t = this._linePreEliminateManager) || void 0 === t || t.hide();
var l = null === (r = e.args) || void 0 === r ? void 0 : r[0];
if (l) {
var c = this._resolveVariant(), s = l.rowCanEliminateShaders, f = l.colCanEliminateShaders, d = function(e) {
return m.calcMergeBlockEliminateMode(e, s, f);
}, u = this._mergeBlocks.filter(function(e) {
return "partial" === d(e);
});
if ("preview" === c) {
this._tryInitPreviewManager();
null === (o = this._previewManager) || void 0 === o || o.show(this._mergeBlocks, s, f);
} else if ("frame" === c) {
this._tryInitFrameManager();
u.length > 0 ? null === (n = this._frameManager) || void 0 === n || n.show(u, s, f) : null === (i = this._frameManager) || void 0 === i || i.hide();
}
this._tryInitPreEliminateManager();
null === (a = this._preEliminateManager) || void 0 === a || a.show(this._mergeBlocks.filter(function(e) {
return "full" === d(e);
}), s, f);
}
}
};
t.prototype._onInterceptEncourageAudio = function(e) {
var t, r;
if (this._isCurrentMode()) {
var o = hs.storage.getItem(E, null);
(null === (r = null === (t = null == o ? void 0 : o.lastEliminationResult) || void 0 === t ? void 0 : t.eliminated) || void 0 === r ? void 0 : r.length) > 0 && (e.replace = !0);
}
};
t.prototype._onInterceptComboShow = function(e) {
var t, r, o, n, i, a, c;
if (this._isCurrentMode()) {
var s = hs.storage.getItem(E, null);
if ((null === (r = null === (t = null == s ? void 0 : s.lastEliminationResult) || void 0 === t ? void 0 : t.eliminated) || void 0 === r ? void 0 : r.length) > 0) {
e.replace = !0;
e.returnState = !0;
var f = e.args[0], d = e.args[1], u = null !== (n = null === (o = null == f ? void 0 : f.state) || void 0 === o ? void 0 : o.continuousEliminateTimes) && void 0 !== n ? n : 2, h = Math.max.apply(Math, l(s.lastEliminationResult.eliminated.map(function(e) {
return e.size;
})));
this._tryInitComboManager();
null === (i = this._comboManager) || void 0 === i || i.play(u, h, hs.gameUiLayer, null !== (a = null == d ? void 0 : d.x) && void 0 !== a ? a : 0, null !== (c = null == d ? void 0 : d.y) && void 0 !== c ? c : 0);
}
}
};
t.prototype._onInterceptPreClearColorConfig = function(e) {
if (this._isCurrentMode()) {
var t = e.args[1];
if (!(t < 1 || t > 7)) {
var r = k.getPreClearColor(t);
e.replace = !0;
e.returnValue = {
colorList: [ {
color: r
} ]
};
}
}
};
t.prototype._onInterceptClearBoardUnbelievable = function(e) {
var t, r;
if (this._isCurrentMode()) {
var o = hs.storage.getItem(E, null);
if ((null === (r = null === (t = null == o ? void 0 : o.lastEliminationResult) || void 0 === t ? void 0 : t.eliminated) || void 0 === r ? void 0 : r.length) > 0) {
e.replace = !0;
e.returnValue = !1;
}
}
};
t.prototype._onInterceptScoreGroupDelay = function(e) {
if (this._isCurrentMode() && this._hasPendingMergeScore) {
this._hasPendingMergeScore = !1;
e.replace = !0;
var t = cc.director._kSpeed || 1;
e.returnValue = r.SCORE_FLY_DELAY_MS_BASE / t;
}
};
t.prototype._onBlocksProducerTouchEnd = function(e) {
var t, r, o, n, i, a, l, c = this;
if (this._isCurrentMode()) {
this._onTouchEnd(e);
var s = null !== (r = null === (t = hs.storage.getItem(E, null)) || void 0 === t ? void 0 : t.lastEliminationResult) && void 0 !== r ? r : null, f = null !== (n = null === (o = null == e ? void 0 : e.state) || void 0 === o ? void 0 : o.clearScreen) && void 0 !== n && n;
if ((null === (i = null == s ? void 0 : s.eliminated) || void 0 === i ? void 0 : i.length) > 0) {
var d = (null !== (l = null === (a = null == e ? void 0 : e.state) || void 0 === a ? void 0 : a.continuousEliminateTimes) && void 0 !== l ? l : 0) > 1 ? 1e3 : 30;
setTimeoutSafe(function() {
c._tryPlayMergeEncourage(s, f);
}, d);
}
}
};
t.prototype._onEncourageSetEffectState = function(e) {
var t, r;
if (this._isCurrentMode()) {
var o = hs.storage.getItem(E, null);
if ((null === (r = null === (t = null == o ? void 0 : o.lastEliminationResult) || void 0 === t ? void 0 : t.eliminated) || void 0 === r ? void 0 : r.length) > 0) {
e.replace = !0;
e.returnState = !0;
}
}
};
t.prototype._calcBoardCenterInUiLayer = function() {
if (!cc.isValid(this._mergeLayer) || !cc.isValid(hs.gameUiLayer)) return cc.v2(0, 0);
var e = this._mergeLayer.convertToWorldSpaceAR(cc.Vec2.ZERO);
return hs.gameUiLayer.convertToNodeSpaceAR(e);
};
t.prototype._tryPlayMergeEncourage = function(e, t) {
this._tryInitEncourageManager();
if (this._encourageManager) {
var r, o = this._calcBoardCenterInUiLayer(), n = o.x, i = o.y;
if (t) r = "unbelievable"; else {
i += 265;
var a = e.maxSize;
r = a >= 5 ? "amazing" : 4 === a ? "excellent" : 3 === a ? "great" : "good";
}
this._encourageManager.play(r, hs.gameUiLayer, n, i);
var l = {
good: hs.AudioConfig.Good2,
great: hs.AudioConfig.Great2,
excellent: hs.AudioConfig.Excellect2,
amazing: hs.AudioConfig.Amazing2,
unbelievable: hs.AudioConfig.Unbelievable2
}[r];
l && hs.audioInfo.play(l);
}
};
Object.defineProperty(t.prototype, "isCurrentMode", {
get: function() {
return this._isCurrentMode();
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "scoreStorageKey", {
get: function() {
return "entry" === this.props.model ? "mergeBlocksScore" : "classScore";
},
enumerable: !1,
configurable: !0
});
t.prototype._isCurrentMode = function() {
var e = "entry" === this.props.model ? hs.GameMode.MergeBlocks : hs.GameMode.Class;
return hs.gameInfo.gameMode === e;
};
t.prototype._tryInitPreEliminateManager = function() {
var e;
if (!this._preEliminateManager && cc.isValid(this._mergeLayer)) {
var t = null === (e = this._assetLoader) || void 0 === e ? void 0 : e.preEliminatePrefab;
t && (this._preEliminateManager = new m.MergeBlockPreEliminateManager(t, this._mergeLayer));
}
};
t.prototype._tryInitEliminateManager = function() {
var e;
if (!this._eliminateManager && cc.isValid(this._mergeLayer)) {
var t = null === (e = this._assetLoader) || void 0 === e ? void 0 : e.eliminatePrefab;
if (t) {
this._eliminateManager = new p.MergeBlockEliminateManager(t, this._mergeLayer);
this._nodeManager && (this._nodeManager.eliminateManager = this._eliminateManager);
}
}
};
t.prototype._tryInitBorderEffectManager = function() {
var e;
if (!this._borderEffectManager && cc.isValid(this._mergeLayer)) {
var t = null === (e = this._assetLoader) || void 0 === e ? void 0 : e.borderEffectPrefab;
if (t) {
this._borderEffectManager = new f.MergeBlockBorderEffectManager(t, this._mergeLayer);
this._nodeManager && (this._nodeManager.borderEffectManager = this._borderEffectManager);
}
}
};
t.prototype._tryInitEntranceEffectManager = function() {
var e;
if (!this._entranceEffectManager && cc.isValid(this._mergeLayer)) {
var t = null === (e = this._assetLoader) || void 0 === e ? void 0 : e.entranceEffectPrefab;
if (t) {
this._entranceEffectManager = new v.MergeBlockEntranceEffectManager(t, this._mergeLayer);
this._nodeManager && (this._nodeManager.entranceEffectManager = this._entranceEffectManager);
}
}
};
t.prototype._tryInitEncourageManager = function() {
var e;
if (!this._encourageManager) {
var t = null === (e = this._assetLoader) || void 0 === e ? void 0 : e.encouragePrefab;
t && (this._encourageManager = new _.MergeBlockEncourageManager(t));
}
};
t.prototype._tryInitComboManager = function() {
var e;
if (!this._comboManager) {
var t = null === (e = this._assetLoader) || void 0 === e ? void 0 : e.comboPrefab;
t && (this._comboManager = new d.MergeBlockComboManager(t));
}
};
t.prototype._tryInitScoreManager = function() {
var e;
if (!this._scoreManager) {
var t = null === (e = this._assetLoader) || void 0 === e ? void 0 : e.scorePrefab;
t && (this._scoreManager = new b.MergeBlockScoreManager(t));
}
};
t.prototype._tryInitLinePreEliminateManager = function() {
var e;
if (!this._linePreEliminateManager) {
var t = null === (e = this._assetLoader) || void 0 === e ? void 0 : e.linePreEliminatePrefab;
t && cc.isValid(this._blockUnderPreEliminateLayer) && (this._linePreEliminateManager = new B.MergeLinePreEliminateManager(t, this._blockUnderPreEliminateLayer));
}
};
t.prototype._resolveVariant = function() {
var e;
if (null === this._variant) {
var t = TRAIT("MergeBlockPreEliminateVariantTrait"), r = !0 === (null == t ? void 0 : t.active) ? null === (e = null == t ? void 0 : t.props) || void 0 === e ? void 0 : e.variant : null;
this._variant = "preview" === r || "frame" === r ? r : "highlight";
}
return this._variant;
};
t.prototype._initPreEliminateManagerByVariant = function() {
var e = this._resolveVariant();
"preview" === e ? this._tryInitPreviewManager() : "frame" === e ? this._tryInitFrameManager() : this._tryInitPreEliminateManager();
};
t.prototype._tryInitPreviewManager = function() {
var e, t, r;
if (!this._previewManager && cc.isValid(this._mergeLayer) && (null === (e = this._assetLoader) || void 0 === e ? void 0 : e.isReady) && this._nodeManager) {
this._previewManager = new M.MergeBlockPreEliminatePreviewManager(this._assetLoader, this._mergeLayer, this._nodeManager);
this._previewManager.bevelStyle = null !== (r = null === (t = this.props) || void 0 === t ? void 0 : t.bevelStyle) && void 0 !== r ? r : 0;
}
};
t.prototype._tryInitFrameManager = function() {
var e;
if (!this._frameManager && cc.isValid(this._mergeLayer)) {
var t = null === (e = this._assetLoader) || void 0 === e ? void 0 : e.framePreEliminatePrefab;
t && (this._frameManager = new g.MergeBlockPreEliminateFrameManager(t, this._mergeLayer));
}
};
t.prototype.playMergeScore = function(e) {
var t, r;
this._tryInitScoreManager();
if (this._scoreManager && cc.isValid(this._mergeLayer) && cc.isValid(hs.gameEffectLayer)) {
var o = this._calcScoreTargetInEffectLayer();
try {
for (var n = c(e), i = n.next(); !i.done; i = n.next()) {
var a = i.value, l = a.size, s = a.anchorRow, f = a.anchorCol, d = a.bonus, u = y.calcMergeBlockPos(s, f, l), h = this._mergeLayer.convertToWorldSpaceAR(cc.v2(u.x, u.y)), p = hs.gameEffectLayer.convertToNodeSpaceAR(h);
this._scoreManager.play(d, l, p.x, p.y, o.x, o.y);
}
} catch (e) {
t = {
error: e
};
} finally {
try {
i && !i.done && (r = n.return) && r.call(n);
} finally {
if (t) throw t.error;
}
}
this._hasPendingMergeScore = !0;
}
};
t.prototype._calcScoreTargetInEffectLayer = function() {
var e = hs.gameEffectLayer;
if (!cc.isValid(e)) return cc.v2(0, 0);
cc.isValid(this._scoreTargetNode) || (this._scoreTargetNode = this._findScoreCurrentNode());
if (cc.isValid(this._scoreTargetNode)) {
var t = this._scoreTargetNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
return e.convertToNodeSpaceAR(cc.v2(t.x, t.y - 40));
}
if (!cc.isValid(this._mergeLayer)) return cc.v2(0, 0);
var r = this._mergeLayer.convertToWorldSpaceAR(cc.Vec2.ZERO), o = r.y + this._mergeLayer.height / 2, n = cc.v2(r.x, o + 80);
return e.convertToNodeSpaceAR(n);
};
t.prototype._findScoreCurrentNode = function() {
var e = "entry" === this.props.model ? Cinst(hs.MergeBlocksTopInfo) : Cinst(hs.ClassTopInfo), t = null == e ? void 0 : e.curNode;
return cc.isValid(t) ? t : null;
};
t.prototype._onGameStart = function() {
var e;
if (this._isCurrentMode()) {
this._hasPendingMergeScore = !1;
var t = hs.boardInfo.faceBlocks;
if (t) {
var r = hs.storage.getItem(E, null), o = this._detector.isFaceBlocksMatch(t, null !== (e = null == r ? void 0 : r.faceBlocksSnapshot) && void 0 !== e ? e : null);
cc.isValid(this._mergeLayer) ? o ? this._restoreFromStorage() : this._resetAndScan() : this._pendingGameMode = o ? "restore" : "reset";
}
}
};
t.prototype._onSkinChanged = function() {
var e, t, r;
if (this._isCurrentMode()) {
var o = hs.boardInfo.faceBlocks;
if (o && cc.isValid(this._mergeLayer)) {
var n = this._mergeBlocks.slice(), i = this._detector.detect(o, n);
this._mergeBlocks = i;
null === (t = this._nodeManager) || void 0 === t || t.sync(i, null);
null === (r = this._nodeManager) || void 0 === r || r.syncSkin(i);
this._saveToStorage();
} else null === (e = this._nodeManager) || void 0 === e || e.syncSkin(this._mergeBlocks);
}
};
t.prototype._resetAndScan = function() {
var e, t;
null === (e = this._nodeManager) || void 0 === e || e.clear();
this._mergeBlocks = [];
this._detector.nextId = 1;
var r = hs.boardInfo.faceBlocks;
if (r && cc.isValid(this._mergeLayer)) {
var o = this._detector.detect(r, []);
this._mergeBlocks = o;
null === (t = this._nodeManager) || void 0 === t || t.sync(o, null);
this._saveToStorage();
}
};
t.prototype._onAssetsReady = function() {
var e, t;
if (cc.isValid(this._mergeLayer) && 0 !== this._mergeBlocks.length) {
null === (e = this._nodeManager) || void 0 === e || e.clear();
null === (t = this._nodeManager) || void 0 === t || t.sync(this._mergeBlocks, null);
this._tryInitEliminateManager();
this._tryInitBorderEffectManager();
this._tryInitEntranceEffectManager();
this._tryInitEncourageManager();
this._tryInitComboManager();
this._tryInitScoreManager();
this._tryInitLinePreEliminateManager();
this._initPreEliminateManagerByVariant();
}
};
t.prototype._initLayer = function(e) {
var t, r, o, n, i, a = e.node.getChildByName("MergeBlockLayer");
if (a) {
this._mergeLayer = a;
if (!this._nodeManager) {
this._nodeManager = new y.MergeBlockNodeManager(this._mergeLayer, this._assetLoader);
this._nodeManager.bevelStyle = null !== (r = null === (t = this.props) || void 0 === t ? void 0 : t.bevelStyle) && void 0 !== r ? r : 0;
}
} else {
var l = new cc.Node("MergeBlockLayer");
l.setContentSize(e.blocks.width, e.blocks.height);
l.setPosition(e.blocks.x, e.blocks.y);
l.anchorX = e.blocks.anchorX;
l.anchorY = e.blocks.anchorY;
l.zIndex = 999;
e.node.addChild(l);
cc.isValid(e.blockSplash) && e.blockSplash.zIndex <= 999 && (e.blockSplash.zIndex = 1e3);
this._mergeLayer = l;
this._nodeManager = new y.MergeBlockNodeManager(this._mergeLayer, this._assetLoader);
this._nodeManager.bevelStyle = null !== (n = null === (o = this.props) || void 0 === o ? void 0 : o.bevelStyle) && void 0 !== n ? n : 0;
this._mergeLayer.active = this._isCurrentMode();
this._blockUnderPreEliminateLayer = null !== (i = e.blockUnderPreEliminate) && void 0 !== i ? i : null;
this._tryInitEliminateManager();
this._tryInitBorderEffectManager();
this._tryInitEntranceEffectManager();
this._tryInitEncourageManager();
this._tryInitComboManager();
this._tryInitScoreManager();
this._tryInitLinePreEliminateManager();
this._initPreEliminateManagerByVariant();
}
};
t.prototype._restoreFromStorage = function() {
var e, t = this, r = hs.storage.getItem(E, null);
if (r && Array.isArray(r.mergeBlocks) && 0 !== r.mergeBlocks.length) {
var o = r.mergeBlocks.filter(function(e) {
return t._detector.isValidStoredBlock(e);
});
if (0 !== o.length) {
this._mergeBlocks = o;
var n = o.reduce(function(e, t) {
return Math.max(e, t.id);
}, 0);
this._detector.nextId = Math.max(n + 1, "number" == typeof r.nextId ? r.nextId : 1);
null === (e = this._nodeManager) || void 0 === e || e.sync(this._mergeBlocks, null);
}
}
};
t.prototype._onTouchEnd = function(e) {
var t;
if (cc.isValid(this._mergeLayer)) {
var r = hs.boardInfo.faceBlocks;
if (r) {
var o = this._mergeBlocks.slice(), n = this._detector.detect(r, o), i = this._detector.computeEliminationResult(o, n, r), a = y.computeMergeResult(o, n);
this._mergeBlocks = n;
null === (t = this._nodeManager) || void 0 === t || t.sync(n, o);
this._saveToStorage(i, a);
a.mergedBlocks.length > 0 && h.MergeBlockDotProxy.reportCombineSuccess(a);
h.MergeBlockDotProxy.reportEliminateSuccess(o, n, r, e);
}
}
};
t.prototype._saveToStorage = function(e, t) {
var r, o, n, i = void 0 === e || void 0 === t ? hs.storage.getItem(E, null) : null, a = {
mergeBlocks: this._mergeBlocks,
nextId: this._detector.nextId,
faceBlocksSnapshot: null !== (r = hs.boardInfo.faceBlocks) && void 0 !== r ? r : null,
lastEliminationResult: void 0 !== e ? e : null !== (o = null == i ? void 0 : i.lastEliminationResult) && void 0 !== o ? o : null,
lastMergeResult: void 0 !== t ? t : null !== (n = null == i ? void 0 : i.lastMergeResult) && void 0 !== n ? n : null
};
hs.storage.setItem(E, a);
};
var r;
t.SCORE_FLY_DELAY_MS_BASE = 1600;
return r = i([ classId("MergeBlockTrait") ], t);
}(Trait);
r.MergeBlockTrait = P;
cc._RF.pop();
}, {
"./MergeBlockAssetLoader": "MergeBlockAssetLoader",
"./MergeBlockBorderEffectManager": "MergeBlockBorderEffectManager",
"./MergeBlockComboManager": "MergeBlockComboManager",
"./MergeBlockDetector": "MergeBlockDetector",
"./MergeBlockDotProxy": "MergeBlockDotProxy",
"./MergeBlockEliminateManager": "MergeBlockEliminateManager",
"./MergeBlockEncourageManager": "MergeBlockEncourageManager",
"./MergeBlockEntranceEffectManager": "MergeBlockEntranceEffectManager",
"./MergeBlockNodeManager": "MergeBlockNodeManager",
"./MergeBlockPreEliminateFrameManager": "MergeBlockPreEliminateFrameManager",
"./MergeBlockPreEliminateManager": "MergeBlockPreEliminateManager",
"./MergeBlockPreEliminatePreviewManager": "MergeBlockPreEliminatePreviewManager",
"./MergeBlockScoreManager": "MergeBlockScoreManager",
"./MergeBlockSkinHelper": "MergeBlockSkinHelper",
"./MergeLinePreEliminateManager": "MergeLinePreEliminateManager"
} ],
MergeEliminateComponent: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "aa80fzXpZpMN69ofOlszZYO", "MergeEliminateComponent");
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
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, o); else for (var l = e.length - 1; l >= 0; l--) (n = e[l]) && (a = (i < 3 ? n(a) : i > 3 ? n(t, r, a) : n(t, r)) || a);
return i > 3 && a && Object.defineProperty(t, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var a = cc._decorator.ccclass, l = {
2: 1,
3: 2,
4: 3,
5: 4
}, c = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.anim_1 = null;
t.anim_2 = null;
t.anim_3 = null;
return t;
}
t.prototype.render = function() {
var e = this.state, t = e.mode, r = e.size, o = e.colors;
if ("none" !== t) {
var n = l[r];
if (n) {
var i = this.anim_1, a = this.anim_2, c = this.anim_3;
if (i && a && c && cc.isValid(i.node) && cc.isValid(a.node) && cc.isValid(c.node)) {
this.node.active = !0;
this._applyColor(i, o[0]);
this._applyColor(a, o[1]);
this._applyColor(c, o[2]);
i.setAnimation(0, "in_" + n + "_1", !1);
a.setAnimation(0, "in_" + n + "_2", !1);
c.setAnimation(0, "in_" + n + "_3", !1);
i.timeScale = .5;
a.timeScale = .5;
c.timeScale = .5;
} else this.node.active = !1;
} else this.node.active = !1;
} else {
this._clearTrack(this.anim_1);
this._clearTrack(this.anim_2);
this._clearTrack(this.anim_3);
this.node.active = !1;
}
};
t.prototype._applyColor = function(e, t) {
e && t && (e.node.color = new cc.Color().fromHEX(t));
};
t.prototype._clearTrack = function(e) {
e && e.clearTrack(0);
};
return i([ a ], t);
}(hs.Component);
r.default = c;
cc._RF.pop();
}, {} ],
MergeEncourageComponent: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "51e1cxY9UNG9IveuWujrOhN", "MergeEncourageComponent");
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
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, o); else for (var l = e.length - 1; l >= 0; l--) (n = e[l]) && (a = (i < 3 ? n(a) : i > 3 ? n(t, r, a) : n(t, r)) || a);
return i > 3 && a && Object.defineProperty(t, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var a = cc._decorator.ccclass, l = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.anim = null;
return t;
}
t.prototype.render = function() {
this.anim && this.state && "play" === this.state.mode && this.anim.setAnimation(0, this.state.animName, !1);
};
return i([ a ], t);
}(hs.Component);
r.default = l;
cc._RF.pop();
}, {} ],
MergeLinePreEliminateComponent: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "3edb0ApSfNMDZ7GAiV7JGJf", "MergeLinePreEliminateComponent");
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
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, o); else for (var l = e.length - 1; l >= 0; l--) (n = e[l]) && (a = (i < 3 ? n(a) : i > 3 ? n(t, r, a) : n(t, r)) || a);
return i > 3 && a && Object.defineProperty(t, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var a = cc._decorator.ccclass, l = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.anim = null;
return t;
}
t.prototype.render = function() {
var e = this.state, t = e.mode, r = e.color, o = e.angle;
if ("hide" !== t) {
this.node.active = !0;
this.node.angle = o;
if (this.anim) {
this.anim.node.color = new cc.Color().fromHEX(r);
this.anim.playAnimation("in", 0);
}
} else this.node.active = !1;
};
return i([ a ], t);
}(hs.Component);
r.default = l;
cc._RF.pop();
}, {} ],
MergeLinePreEliminateManager: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "994cfwEz4NAp4mG05tJMvAI", "MergeLinePreEliminateManager");
var o = this && this.__values || function(e) {
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
r.MergeLinePreEliminateManager = void 0;
var n = e("./components/MergeLinePreEliminateComponent"), i = function() {
function e(e, t) {
this._pool = [];
this._active = [];
this._prefab = e;
this._layer = t;
this._initPool();
}
e.prototype.showLine = function(e, t, r) {
this._showLine(t, e.x, e.y, r);
};
e.prototype.hide = function() {
this._releaseAll();
};
e.prototype._initPool = function() {
for (var e, t, r = 0; r < 16; r++) {
var o = cc.instantiate(this._prefab);
o.active = !1;
this._layer.addChild(o);
var i = o.addComponent(n.default);
i.anim = null !== (t = null === (e = o.getChildByName("anim")) || void 0 === e ? void 0 : e.getComponent(dragonBones.ArmatureDisplay)) && void 0 !== t ? t : null;
this._pool.push({
node: o,
comp: i
});
}
};
e.prototype._showLine = function(e, t, r, o) {
var n = this._popFromPool();
if (n) {
n.node.setPosition(t, r);
n.node.active = !0;
n.comp.setState({
mode: "show",
color: o,
angle: e
});
this._active.push(n);
}
};
e.prototype._popFromPool = function() {
return this._pool.length > 0 ? this._pool.pop() : null;
};
e.prototype._releaseAll = function() {
var e, t;
try {
for (var r = o(this._active), n = r.next(); !n.done; n = r.next()) {
var i = n.value;
i.node.active = !1;
this._pool.push(i);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
n && !n.done && (t = r.return) && t.call(r);
} finally {
if (e) throw e.error;
}
}
this._active.length = 0;
};
return e;
}();
r.MergeLinePreEliminateManager = i;
cc._RF.pop();
}, {
"./components/MergeLinePreEliminateComponent": "MergeLinePreEliminateComponent"
} ],
MergePreEliminateComponent: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "39cb1xQiT1MIJWE8w2Lzz1O", "MergePreEliminateComponent");
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
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, o); else for (var l = e.length - 1; l >= 0; l--) (n = e[l]) && (a = (i < 3 ? n(a) : i > 3 ? n(t, r, a) : n(t, r)) || a);
return i > 3 && a && Object.defineProperty(t, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var a = cc._decorator.ccclass, l = {
2: 1,
3: 2,
4: 3,
5: 4,
6: 5,
7: 6
}, c = new Set([ 5, 6 ]), s = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.anim_1 = null;
t.anim_2 = null;
t.anim_3 = null;
return t;
}
t.prototype.render = function() {
var e = this.state, t = e.mode, r = e.size, o = e.colors;
if ("none" !== t) {
var n = l[r];
if (n) {
this.node.active = !0;
var i = c.has(n);
if ("full" !== t || i) {
this._clearTrack(this.anim_1);
this._clearTrack(this.anim_2);
this._playAnim(this.anim_3, o[2], "init_" + n + "_3");
} else {
this._playAnim(this.anim_1, o[0], "init_" + n + "_1");
this._playAnim(this.anim_2, o[1], "init_" + n + "_2");
this._playAnim(this.anim_3, o[2], "init_" + n + "_3");
}
}
} else {
this._clearTrack(this.anim_1);
this._clearTrack(this.anim_2);
this._clearTrack(this.anim_3);
this.node.active = !1;
}
};
t.prototype._playAnim = function(e, t, r) {
if (e) {
e.node.active = !0;
e.node.color = new cc.Color().fromHEX(t);
e.setAnimation(0, r, !0);
}
};
t.prototype._clearTrack = function(e) {
if (e) {
e.clearTrack(0);
e.node.active = !1;
}
};
return i([ a ], t);
}(hs.Component);
r.default = s;
cc._RF.pop();
}, {} ],
MergePreEliminateFrameComponent: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "e6db1I0X/VJzaUbmXHARS5G", "MergePreEliminateFrameComponent");
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
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, o); else for (var l = e.length - 1; l >= 0; l--) (n = e[l]) && (a = (i < 3 ? n(a) : i > 3 ? n(t, r, a) : n(t, r)) || a);
return i > 3 && a && Object.defineProperty(t, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var a = cc._decorator.ccclass, l = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.render = function() {
var e = this.state, t = e.mode, r = e.width, o = e.height, n = e.color;
if ("hide" !== t) {
this.node.active = !0;
this.node.width = r;
this.node.height = o;
n && (this.node.color = new cc.Color().fromHEX(n));
} else this.node.active = !1;
};
return i([ a ], t);
}(hs.Component);
r.default = l;
cc._RF.pop();
}, {} ],
MergeSkinBlockComponent: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "80d87DY0nFPDLy40Cg0LLng", "MergeSkinBlockComponent");
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
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, o); else for (var l = e.length - 1; l >= 0; l--) (n = e[l]) && (a = (i < 3 ? n(a) : i > 3 ? n(t, r, a) : n(t, r)) || a);
return i > 3 && a && Object.defineProperty(t, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var a = e("./MergeBlockMaterialUpdate"), l = cc._decorator, c = l.ccclass, s = l.property, f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.customBlock = null;
t.blockSprite = null;
return t;
}
t.prototype.render = function() {
var e = this.state, t = e.color, r = e.blockSpriteFrame, o = e.colorDataList, n = e.size, i = e.bevelStyle;
this.blockSprite.node.active = !1;
this.customBlock.node.active = !1;
if (r) {
this.blockSprite.node.active = !0;
this.blockSprite.spriteFrame = r;
}
if (o) {
this.customBlock.node.active = !0;
this.customBlock.setMaterial();
this.customBlock.setBevelStyle(null != i ? i : a.BEVEL_STYLE_WIDE);
this.customBlock.setAllParams(t, o, n);
}
};
i([ s(a.default) ], t.prototype, "customBlock", void 0);
i([ s(cc.Sprite) ], t.prototype, "blockSprite", void 0);
return i([ c ], t);
}(hs.Component);
r.default = f;
cc._RF.pop();
}, {
"./MergeBlockMaterialUpdate": "MergeBlockMaterialUpdate"
} ]
}, {}, [ "MergeBlockAssetLoader", "MergeBlockBorderEffectManager", "MergeBlockComboManager", "MergeBlockDetector", "MergeBlockDotProxy", "MergeBlockEliminateManager", "MergeBlockEncourageManager", "MergeBlockEntranceEffectManager", "MergeBlockNodeManager", "MergeBlockPreEliminateFrameManager", "MergeBlockPreEliminateManager", "MergeBlockPreEliminatePreviewManager", "MergeBlockScoreManager", "MergeBlockSkinHelper", "MergeBlockTrait", "MergeLinePreEliminateManager", "MergeBlockBorderEffectComponent", "MergeBlockComboComponent", "MergeBlockEntranceEffectComponent", "MergeBlockMaterialUpdate", "MergeBlockScoreComponent", "MergeEliminateComponent", "MergeEncourageComponent", "MergeLinePreEliminateComponent", "MergePreEliminateComponent", "MergePreEliminateFrameComponent", "MergeSkinBlockComponent" ]);
//# sourceMappingURL=index.js.map
