window.__require = function e(t, r, o) {
function i(a, l) {
if (!r[a]) {
if (!t[a]) {
var s = a.split("/");
s = s[s.length - 1];
if (!t[s]) {
var c = "function" == typeof __require && __require;
if (!l && c) return c(s, !0);
if (n) return n(s, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = s;
}
var h = r[a] = {
exports: {}
};
t[a][0].call(h.exports, function(e) {
return i(t[a][1][e] || e);
}, h, h.exports, e, t, r, o);
}
return r[a].exports;
}
for (var n = "function" == typeof __require && __require, a = 0; a < o.length; a++) i(o[a]);
return i;
}({
ChapterCollectPreClearEffectInterface: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "8c2fbflGA5PjYjJ3ClL8i5G", "ChapterCollectPreClearEffectInterface");
Object.defineProperty(r, "__esModule", {
value: !0
});
cc._RF.pop();
}, {} ],
ChapterCollectPreClearEffectTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "dc34f5lkuFJ06NwFAFR/ycJ", "ChapterCollectPreClearEffectTrait");
var o, i = this && this.__extends || (o = function(e, t) {
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
}), n = this && this.__decorate || function(e, t, r, o) {
var i, n = arguments.length, a = n < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, o); else for (var l = e.length - 1; l >= 0; l--) (i = e[l]) && (a = (n < 3 ? i(a) : n > 3 ? i(t, r, a) : i(t, r)) || a);
return n > 3 && a && Object.defineProperty(t, r, a), a;
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
}, l = this && this.__read || function(e, t) {
var r = "function" == typeof Symbol && e[Symbol.iterator];
if (!r) return e;
var o, i, n = r.call(e), a = [];
try {
for (;(void 0 === t || t-- > 0) && !(o = n.next()).done; ) a.push(o.value);
} catch (e) {
i = {
error: e
};
} finally {
try {
o && !o.done && (r = n.return) && r.call(n);
} finally {
if (i) throw i.error;
}
}
return a;
}, s = this && this.__spread || function() {
for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(l(arguments[t]));
return e;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ChapterCollectPreClearEffectTrait = void 0;
var c = e("./ChapterCollectPreClearEffect"), h = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._board = null;
t._blockUnderNode = null;
t._blockOverNode = null;
t._boardSize = 8;
t._upperRowPreEliNodes = [];
t._lowerRowPreEliNodes = [];
t._upperColPreEliNodes = [];
t._lowerColPreEliNodes = [];
t._activeRowCount = 0;
t._activeColCount = 0;
t._currentWayNum = -1;
t._currentPreEliminateRows = new Set();
t._currentPreEliminateCols = new Set();
t._reusableNodeSet = new Set();
t._reusablePositionSet = new Set();
t._preEliPrefab = null;
t._loadedSkinConfigs = new Map();
t._totalSkins = 40;
return t;
}
t.prototype.onActive = function(e) {
var t;
if (hs.tp.isChapterGame_ProxyOnShowBoardFinished(e)) {
this._currentWayNum = null === (t = hs.chapterConfigInfo.getChapterCurData()) || void 0 === t ? void 0 : t.Condition.Way;
var r = e.args[0];
if (cc.isValid(r)) {
var o = r.getComponent(hs.Board);
this._board = o;
this._createChapterPreEliminateNodes();
this._loadPreEliArray();
}
}
if (hs.tp.isChapterEliminate_Effects_ProxyOnBlockProducerTouchEnd(e)) {
this._hideParentPreEliminateNodes();
this._showOriginalPreEliminateNodes();
}
if (hs.tp.isChapterEliminate_Effects_ProxyTouchOnMoveNoCanSnap(e)) {
this._hideParentPreEliminateNodes();
this._showOriginalPreEliminateNodes();
}
if (hs.tp.isChapterEliminate_Effects_ProxyOnCloseChapterGame(e) || hs.tp.isChapterEliminate_Effects_ProxyOnChapterGameEnd(e)) {
this._hideParentPreEliminateNodes();
this._showOriginalPreEliminateNodes();
}
if (hs.tp.isChapterEliminate_Effects_ProxyTouchOnMoveCanSnap(e)) {
var i = e.args[0], n = i.rowCanEliminateShaders, a = i.colCanEliminateShaders, l = i.rowsEffect, s = i.colsEffect, c = i.color;
this._handlePreEliminateChange(n, a);
if (this._currentWayNum == hs.ChapterType.collect) {
var h = this._countCollectItemsInEliminateArea(n, a, i);
if (h > 0) {
this._hideOtherPreEliminateNodes();
this._hasKeys(n) && this._showPreEliminateForRows(n, h, c);
this._hasKeys(a) && this._showPreEliminateForCols(a, h, c);
}
} else if (this._currentWayNum == hs.ChapterType.score) {
var d = this._getObjectSize(l) + this._getObjectSize(s);
if (d > 0) {
this._hideOtherPreEliminateNodes();
this._hasKeys(l) && this._showPreEliminateForRows(n, d, c);
this._hasKeys(s) && this._showPreEliminateForCols(a, d, c);
}
}
}
};
t.prototype._hideParentPreEliminateNodes = function() {
cc.isValid(this._board.blockUnderPreEliminate) && (this._board.blockUnderPreEliminate.opacity = 0);
cc.isValid(this._board.blockOverPreEliminate) && (this._board.blockOverPreEliminate.opacity = 0);
};
t.prototype._hasKeys = function(e) {
for (var t in e) return !0;
return !1;
};
t.prototype._getObjectSize = function(e) {
var t = 0;
for (var r in e) t++;
return t;
};
t.prototype._getObjectKeys = function(e) {
var t = [];
for (var r in e) t.push(parseInt(r));
return t;
};
t.prototype._getReuseableNodeSet = function() {
this._reusableNodeSet.clear();
return this._reusableNodeSet;
};
t.prototype._getReuseablePositionSet = function() {
this._reusablePositionSet.clear();
return this._reusablePositionSet;
};
t.prototype._createChapterPreEliminateNodes = function() {
if (cc.isValid(this._board.node)) {
var e = this._board.node, t = this._board.blockUnderPreEliminate, r = this._board.blockOverPreEliminate, o = e.getChildByName("chapterBlockUnderPreEliminate");
if (!cc.isValid(o)) {
(o = new cc.Node("chapterBlockUnderPreEliminate")).position = t.position;
o.width = t.width;
o.height = t.height;
e.addChild(o);
o.setSiblingIndex(t.getSiblingIndex() + 1);
}
var i = e.getChildByName("chapterBlockOverPreEliminate");
if (!cc.isValid(i)) {
(i = new cc.Node("chapterBlockOverPreEliminate")).position = r.position;
i.width = r.width;
i.height = r.height;
e.addChild(i);
i.setSiblingIndex(r.getSiblingIndex() + 1);
}
this._blockUnderNode = o;
this._blockOverNode = i;
this.outGetBlockOverNode(this._blockOverNode);
}
};
t.prototype.outGetBlockOverNode = function() {};
t.prototype._loadPreEliArray = function() {
var e = this, t = this._preEliPrefab, r = hs.skinInfo.eliminateSkinInfo && hs.skinInfo.eliminateSkinInfo.length > 0 || this._loadedSkinConfigs.size === this._totalSkins;
if (t && r) ; else {
this._preEliPrefab || hs.ResLoader.loadByBundle("ChapterCollectPreClearEffectTrait", "prefabs/ChapterCollectPreClearEffect", cc.Prefab, function(t, r) {
t || (e._preEliPrefab = r);
});
this._loadColorConfig();
}
};
t.prototype._loadColorConfig = function() {
for (var e, t, r = this, o = [], i = 1e3; i < 1040; i++) this._loadedSkinConfigs.has(i) || o.push(i);
if (0 !== o.length) {
var n = function(e) {
var t = "configs/chapterCollectPreClear_skin_" + e;
hs.ResLoader.loadByBundle("ChapterCollectPreClearEffectTrait", t, cc.JsonAsset, function(t, i) {
if (!t && i && i.json) try {
var n = i.json, a = [];
"object" == typeof n && null !== n && (a = [ "preClear1", "preClear2", "preClear3", "preClear4", "preClear5", "preClear6", "preClear7" ].map(function(e) {
return n[e];
}).filter(function(e) {
return null != e;
}));
a.length > 0 && r._loadedSkinConfigs.set(e, a);
} catch (e) {}
o.length;
});
};
try {
for (var l = a(o), s = l.next(); !s.done; s = l.next()) n(i = s.value);
} catch (t) {
e = {
error: t
};
} finally {
try {
s && !s.done && (t = l.return) && t.call(l);
} finally {
if (e) throw e.error;
}
}
}
};
t.prototype._getColorConfig = function() {
var e, t, r = hs.skinInfo.eliminateSkinInfo;
if (r && r.length > 0) return r;
var o = [];
try {
for (var i = a(this._loadedSkinConfigs), n = i.next(); !n.done; n = i.next()) {
var c = l(n.value, 2), h = (c[0], c[1]);
o.push.apply(o, s(h));
}
} catch (t) {
e = {
error: t
};
} finally {
try {
n && !n.done && (t = i.return) && t.call(i);
} finally {
if (e) throw e.error;
}
}
return o;
};
t.prototype._getColorConfigByColorId = function(e) {
var t = this._getColorConfig();
return !t || 0 === t.length || e < 1 || e > 7 ? null : t[e - 1] || null;
};
t.prototype._ensureResourcesLoaded = function() {
var e = this._preEliPrefab, t = hs.skinInfo.eliminateSkinInfo && hs.skinInfo.eliminateSkinInfo.length > 0 || this._loadedSkinConfigs.size === this._totalSkins;
if (!e || !t) {
this._loadPreEliArray();
return !1;
}
return !0;
};
t.prototype._getRowPreEliNode = function(e, t, r, o, i, n) {
if (!this._ensureResourcesLoaded()) return null;
for (var a = i ? this._upperRowPreEliNodes : this._lowerRowPreEliNodes; a.length <= e; ) {
var l = cc.instantiate(this._preEliPrefab);
l.angle = 0;
l.opacity = 0;
a.push(l);
}
if (e < a.length) {
var s = a[e];
if (cc.isValid(s)) {
s.x = 0;
s.y = t;
s.opacity = 255;
if (s.parent !== n) {
s.parent && s.removeFromParent();
n.addChild(s);
}
var h = s.getComponent(c.default);
h && h.setState({
level: r,
colorId: o,
isUpperLayer: i,
colorConfig: this._getColorConfigByColorId(o)
});
return s;
}
}
return null;
};
t.prototype._getColPreEliNode = function(e, t, r, o, i, n) {
if (!this._ensureResourcesLoaded()) return null;
for (var a = i ? this._upperColPreEliNodes : this._lowerColPreEliNodes; a.length <= e; ) {
var l = cc.instantiate(this._preEliPrefab);
l.angle = -90;
l.opacity = 0;
a.push(l);
}
if (e < a.length) {
var s = a[e];
if (cc.isValid(s)) {
s.x = t;
s.y = 0;
s.opacity = 255;
if (s.parent !== n) {
s.parent && s.removeFromParent();
n.addChild(s);
}
var h = s.getComponent(c.default);
h && h.setState({
level: r,
colorId: o,
isUpperLayer: i,
colorConfig: this._getColorConfigByColorId(o)
});
return s;
}
}
return null;
};
t.prototype._getGridPosX = function(e) {
return 106 * -(this._boardSize - 1) / 2 + 106 * e;
};
t.prototype._getGridPosY = function(e) {
return 106 * (this._boardSize - 1) / 2 - 106 * e;
};
t.prototype._handlePreEliminateChange = function(e, t) {
var r = new Set(Object.keys(e)), o = new Set(this._getColKeysFromShaders(t)), i = !this._setsEqual(this._currentPreEliminateRows, r), n = !this._setsEqual(this._currentPreEliminateCols, o);
if (i || n) {
this._recycleAllPreEliminate();
this._currentPreEliminateRows = r;
this._currentPreEliminateCols = o;
}
};
t.prototype._getColKeysFromShaders = function(e) {
var t = new Set();
for (var r in e) for (var o in e[r]) t.add(o);
return Array.from(t);
};
t.prototype._setsEqual = function(e, t) {
var r, o;
if (e.size !== t.size) return !1;
try {
for (var i = a(e), n = i.next(); !n.done; n = i.next()) {
var l = n.value;
if (!t.has(l)) return !1;
}
} catch (e) {
r = {
error: e
};
} finally {
try {
n && !n.done && (o = i.return) && o.call(i);
} finally {
if (r) throw r.error;
}
}
return !0;
};
t.prototype._recycleAllPreEliminate = function() {
for (var e = 0; e < this._upperRowPreEliNodes.length; e++) {
var t = this._upperRowPreEliNodes[e];
cc.isValid(t) && (t.active = !1);
}
for (e = 0; e < this._lowerRowPreEliNodes.length; e++) {
t = this._lowerRowPreEliNodes[e];
cc.isValid(t) && (t.active = !1);
}
for (e = 0; e < this._upperColPreEliNodes.length; e++) {
t = this._upperColPreEliNodes[e];
cc.isValid(t) && (t.active = !1);
}
for (e = 0; e < this._lowerColPreEliNodes.length; e++) {
t = this._lowerColPreEliNodes[e];
cc.isValid(t) && (t.active = !1);
}
this._activeRowCount = 0;
this._activeColCount = 0;
};
t.prototype._hideOtherPreEliminateNodes = function() {
if (cc.isValid(this._board.node)) {
cc.isValid(this._board.blockUnderPreEliminate) && (this._board.blockUnderPreEliminate.opacity = 0);
cc.isValid(this._board.blockOverPreEliminate) && (this._board.blockOverPreEliminate.opacity = 0);
cc.isValid(this._blockUnderNode) && (this._blockUnderNode.opacity = 255);
cc.isValid(this._blockOverNode) && (this._blockOverNode.opacity = 255);
}
};
t.prototype._showOriginalPreEliminateNodes = function() {
if (this._board && cc.isValid(this._board.node)) {
cc.isValid(this._board.blockUnderPreEliminate) && (this._board.blockUnderPreEliminate.opacity = 255);
cc.isValid(this._board.blockOverPreEliminate) && (this._board.blockOverPreEliminate.opacity = 255);
cc.isValid(this._blockUnderNode) && (this._blockUnderNode.opacity = 0);
cc.isValid(this._blockOverNode) && (this._blockOverNode.opacity = 0);
}
};
t.prototype._showPreEliminateForRows = function(e, t, r) {
void 0 === r && (r = 0);
var o = this._getLevelByCount(t), i = this._getObjectKeys(e), n = i.length;
n > this._activeRowCount && (this._activeRowCount = n);
for (var a = 0; a < i.length; a++) {
var l = i[a];
if (l >= 0 && l < this._boardSize) {
var s = this._getGridPosY(l), c = a;
this._getRowPreEliNode(c, s, o, r, !0, this._blockOverNode);
this._getRowPreEliNode(c, s, o, r, !1, this._blockUnderNode);
}
}
};
t.prototype._showPreEliminateForCols = function(e, t, r) {
void 0 === r && (r = 0);
var o = this._getLevelByCount(t), i = new Set();
for (var n in e) for (var a in e[n]) i.add(parseInt(a));
var l = Array.from(i), s = l.length;
s > this._activeColCount && (this._activeColCount = s);
for (var c = 0; c < l.length; c++) if ((a = l[c]) >= 0 && a < this._boardSize) {
var h = this._getGridPosX(a), d = c;
this._getColPreEliNode(d, h, o, r, !0, this._blockOverNode);
this._getColPreEliNode(d, h, o, r, !1, this._blockUnderNode);
}
};
t.prototype._countCollectItemsInEliminateArea = function(e, t, r) {
var o, i, n = 0, a = this._getReuseableNodeSet();
for (var l in e) {
var s = e[l];
for (var c in s) {
var h = s[c];
if (cc.isValid(h) && !a.has(h) && (null === (o = null == (f = h.getComponent(hs.Block)) ? void 0 : f.state) || void 0 === o ? void 0 : o.sourceColor) > 100) {
n++;
a.add(h);
}
}
}
for (var l in t) {
var d = t[l];
for (var c in d) {
h = d[c];
if (cc.isValid(h) && !a.has(h)) {
var f;
if ((null === (i = null == (f = h.getComponent(hs.Block)) ? void 0 : f.state) || void 0 === i ? void 0 : i.sourceColor) > 100) {
n++;
a.add(h);
}
}
}
}
r && r._showShaders && (n += this._countProducerItemCollectInEliminateArea(r, e, t));
return n;
};
t.prototype._countProducerItemCollectInEliminateArea = function(e, t, r) {
var o = e._showShaders, i = 0, n = this._getReuseablePositionSet();
for (var a in t) if (h = o[c = parseInt(a)]) for (var l in h) {
var s = c + "_" + l;
if (!n.has(s) && h[l] > 100) {
i++;
n.add(s);
}
}
for (var a in r) {
var c, h;
if (h = o[c = parseInt(a)]) for (var l in r[a]) {
s = c + "_" + l;
if (!n.has(s) && void 0 !== h[l] && h[l] > 100) {
i++;
n.add(s);
}
}
}
return i;
};
t.prototype._getLevelByCount = function(e) {
var t;
return (null === (t = hs.chapterConfigInfo.getChapterCurData()) || void 0 === t ? void 0 : t.Condition.Way) === hs.ChapterType.collect ? e < 3 ? 1 : e >= 3 && e <= 6 ? 2 : 3 : e < 3 ? 1 : 3 === e || 4 === e ? 2 : 3;
};
t.prototype._getTotalEliminateGridCount = function(e, t) {
var r = this._getReuseablePositionSet(), o = 0;
for (var i in e) {
var n = e[i];
for (var a in n) {
var l = i + "_" + a;
if (!r.has(l)) {
r.add(l);
o++;
}
}
}
for (var i in t) {
var s = t[i];
for (var a in s) {
l = i + "_" + a;
if (!r.has(l)) {
r.add(l);
o++;
}
}
}
return o;
};
return n([ classId("ChapterCollectPreClearEffectTrait"), classMethodWatch() ], t);
}(Trait);
r.ChapterCollectPreClearEffectTrait = h;
cc._RF.pop();
}, {
"./ChapterCollectPreClearEffect": "ChapterCollectPreClearEffect"
} ],
ChapterCollectPreClearEffect: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "a077cnB3LpEh6FqCfl3mW8x", "ChapterCollectPreClearEffect");
var o, i = this && this.__extends || (o = function(e, t) {
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
}), n = this && this.__decorate || function(e, t, r, o) {
var i, n = arguments.length, a = n < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, o); else for (var l = e.length - 1; l >= 0; l--) (i = e[l]) && (a = (n < 3 ? i(a) : n > 3 ? i(t, r, a) : i(t, r)) || a);
return n > 3 && a && Object.defineProperty(t, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var a = cc._decorator, l = a.ccclass, s = a.property, c = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.dragon = null;
return t;
}
t.prototype.render = function() {
if (void 0 !== this.state.level) {
var e = this._getAnimationNameByLevel(this.state.level, this.state.colorId || 0, this.state.isUpperLayer);
this._playAnimation(e, 0);
}
};
t.prototype._playAnimation = function(e, t) {
void 0 === t && (t = 0);
if (cc.isValid(this.dragon)) {
this.node.active = !0;
this.node.opacity = 255;
try {
this.dragon.playAnimation(e, t);
this._applyColorToAnimation();
} catch (e) {}
}
};
t.prototype._getAnimationNameByLevel = function(e, t, r) {
void 0 === t && (t = 0);
var o = void 0 !== r ? r : 90 === Math.abs(this.node.angle);
switch (e) {
case 1:
return o ? "build_in_1_1" : "build_in_2_2";

case 2:
return o ? "build_in_1_2" : "build_in_2_3";

case 3:
return o ? "color_in_1" : "color_in_2";
}
};
t.prototype._getCurrentColorConfig = function() {
return this.state.colorConfig || null;
};
t.prototype._hexToColor = function(e) {
return new cc.Color().fromHEX(e);
};
t.prototype._applyColorToAnimation = function() {
if (cc.isValid(this.dragon)) {
var e = this._getCurrentColorConfig();
if (e) try {
var t = this.state.level || 1;
if (1 === t || 2 === t) {
var r = (void 0 !== this.state.isUpperLayer ? this.state.isUpperLayer : 90 === Math.abs(this.node.angle)) ? 0 : e.colorList.length > 1 ? 1 : 0, o = e.colorList[r];
if (o) {
var i = this._hexToColor(o.color);
if (cc.isValid(this.dragon.node)) {
this.dragon.node.color = i;
this.dragon.node.opacity = o.opacity;
}
}
} else if (cc.isValid(this.dragon.node)) {
this.dragon.node.color = cc.Color.WHITE;
this.dragon.node.opacity = 255;
}
} catch (e) {}
}
};
n([ s(dragonBones.ArmatureDisplay) ], t.prototype, "dragon", void 0);
return n([ l ], t);
}(hs.Component);
r.default = c;
cc._RF.pop();
}, {} ]
}, {}, [ "ChapterCollectPreClearEffect", "ChapterCollectPreClearEffectInterface", "ChapterCollectPreClearEffectTrait" ]);
//# sourceMappingURL=index.js.map
