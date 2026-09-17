window.__require = function t(o, r, e) {
function s(n, i) {
if (!r[n]) {
if (!o[n]) {
var l = n.split("/");
l = l[l.length - 1];
if (!o[l]) {
var c = "function" == typeof __require && __require;
if (!i && c) return c(l, !0);
if (a) return a(l, !0);
throw new Error("Cannot find module '" + n + "'");
}
n = l;
}
var h = r[n] = {
exports: {}
};
o[n][0].call(h.exports, function(t) {
return s(o[n][1][t] || t);
}, h, h.exports, t, o, r, e);
}
return r[n].exports;
}
for (var a = "function" == typeof __require && __require, n = 0; n < e.length; n++) s(e[n]);
return s;
}({
CleanComboChangeColorTrait: [ function(t, o, r) {
"use strict";
cc._RF.push(o, "11318ExVuZPgbzAkcg3VEQB", "CleanComboChangeColorTrait");
var e, s = this && this.__extends || (e = function(t, o) {
return (e = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, o) {
t.__proto__ = o;
} || function(t, o) {
for (var r in o) Object.prototype.hasOwnProperty.call(o, r) && (t[r] = o[r]);
})(t, o);
}, function(t, o) {
e(t, o);
function r() {
this.constructor = t;
}
t.prototype = null === o ? Object.create(o) : (r.prototype = o.prototype, new r());
}), a = this && this.__decorate || function(t, o, r, e) {
var s, a = arguments.length, n = a < 3 ? o : null === e ? e = Object.getOwnPropertyDescriptor(o, r) : e;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(t, o, r, e); else for (var i = t.length - 1; i >= 0; i--) (s = t[i]) && (n = (a < 3 ? s(n) : a > 3 ? s(o, r, n) : s(o, r)) || n);
return a > 3 && n && Object.defineProperty(o, r, n), n;
}, n = this && this.__values || function(t) {
var o = "function" == typeof Symbol && Symbol.iterator, r = o && t[o], e = 0;
if (r) return r.call(t);
if (t && "number" == typeof t.length) return {
next: function() {
t && e >= t.length && (t = void 0);
return {
value: t && t[e++],
done: !t
};
}
};
throw new TypeError(o ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.CleanComboChangeColorTrait = void 0;
var i = function(t) {
s(o, t);
function o() {
var o = null !== t && t.apply(this, arguments) || this;
o._skinCanChangeIdArr = [ "1024", "1003", "1002", "1004", "1027", "1014", "1016", "1038", "1010", "1023", "1017", "1018", "1026", "1031", "1032", "1011", "1012", "1022", "1013", "1015", "1006", "1030", "1028", "1029", "1007", "1009", "1008" ];
o._traitData = {};
o._isStopCombo = !0;
o._classCleanScreen = !1;
return o;
}
o.prototype.onActive = function(t) {
var o, r, e = this;
if (hs.tp.isClassColorProducer_ProxyProduceColorPostprocessing(t)) {
if (this.checkTravelNoSkinIsActive()) return;
this.changeColor();
}
if (hs.tp.isChapterColorProducer_ProxyProduceColorPostprocessing(t)) {
if (this.checkTravelNoSkinIsActive()) return;
this.changeColor();
}
if (hs.tp.isClassGame_ProxyOnGameStart(t)) {
if (this.checkTravelNoSkinIsActive() || !this.checkIsCanChangeColor()) return;
this.initTraitData(t);
}
hs.tp.isChapterDefaultBoard_ProxyOnProduceChapterDefaultBoard(t) && this.initTraitData(t);
if (hs.tp.isChapterGame_ProxyOnShowBoardFinished(t)) {
if (this.checkTravelNoSkinIsActive() || !this.checkIsCanChangeColor()) return;
if (this._traitData.chapterCanChangeColor && this._traitData.chapterCurrentUsedColors.length > 0) {
var s = (a = this.getCurrentUsedColorsArray())[a.length - 1];
s && this.updateChapterProducerBlock([ s, s, s ]);
}
}
if (hs.tp.isClassBlocksProducer_ProxyOnTouchEnd(t)) {
if (this.checkTravelNoSkinIsActive() || !this.checkIsCanChangeColor()) return;
this.onClassTouchEnd(t);
}
if (hs.tp.isChapterCollectionProducer_ProxyOnBlockProducerTouchEndExecuted(t)) {
if (this.checkTravelNoSkinIsActive() || !this.checkIsCanChangeColor()) return;
if (this.getSkinId() == hs.skinInfo.originSkinId) this.setTraitData({
canChangeColor: !1
}); else if (null === (r = null === (o = t.args[0]) || void 0 === o ? void 0 : o.state) || void 0 === r ? void 0 : r.clearScreen) {
this.setTraitData({
currentUsedColors: [],
canChangeColor: !0
});
(n = this.changeColor()).length > 0 && this.updateChapterProducerBlock(n);
}
}
if (hs.tp.isClassBlocksProducer_BlocksProducerValidate_ProxySetRecordOperationColor(t)) {
if (this.checkTravelNoSkinIsActive() || !this.checkIsCanChangeColor()) return;
var a;
if ((a = this.getCurrentUsedColorsArray()).length > 0) {
t.replace = !0;
hs.gameInfo.gameMode == hs.GameMode.Class ? hs.storage.setItem("classColorLists", a) : hs.storage.setItem("chapterColorLists", a);
}
}
if (hs.tp.isClassBlocksProducer_ProxyBeforeBlocksProducerUpdate(t)) {
if (this.checkTravelNoSkinIsActive() || !this.checkIsCanChangeColor()) return;
this.updateClassBoardBlock(t);
}
if (hs.tp.isClassSkin_ProxyOnSkinReadyComplete(t)) {
if (this.checkTravelNoSkinIsActive()) return;
CinstAsync(hs.BlocksProducerTouch).then(function(t) {
t && t._continuousEliminateTimes >= 2 && e.setTraitData({
canChangeColor: !0
});
});
var n;
if ((n = this.changeColor()).length > 0) {
this._classCleanScreen = !0;
this.updateClassProducerBlock(n[0]);
}
}
};
o.prototype.onClassTouchEnd = function(t) {
var o, r, e, s;
if ((null === (r = null === (o = t.args[0]) || void 0 === o ? void 0 : o.state) || void 0 === r ? void 0 : r.continuousEliminateTimes) >= 2 && !this._traitData.classIsStopCombo && this.getSkinId() != hs.skinInfo.originSkinId && !this._classCleanScreen) {
this.setTraitData({
currentUsedColors: [],
canChangeColor: !0,
isStopCombo: !0
});
var a = this.changeColor();
if (a.length > 0) {
this.updateClassProducerBlock(a[0]);
this.updateBoardBlock(a[0]);
}
}
if ((null === (s = null === (e = t.args[0]) || void 0 === e ? void 0 : e.state) || void 0 === s ? void 0 : s.continuousEliminateTimes) < 2) {
this._traitData.classIsStopCombo && this.setTraitData({
isStopCombo: !1
});
this._classCleanScreen = !1;
}
};
o.prototype.updateClassBoardBlock = function(t) {
var o = this.getCurrentUsedColorsArray(), r = o[o.length - 1];
r && (t.args[1] = Array(t.args[1].length).fill(r));
if (this._traitData.classCanChangeColor && this._traitData.classCurrentUsedColors.length > 0) {
var e = this.getCurrentUsedColorsArray();
this.updateBoardBlock(e[e.length - 1]);
}
};
o.prototype.initTraitData = function(t) {
t.args[0].data.newGame ? this.setTraitData({
skinId: hs.skinInfo.currentSkinId,
usedColors: [],
currentUsedColors: [],
canChangeColor: !1,
isStopCombo: !1
}) : this._traitData = hs.storage.getItem("cleanComboChangeColor", {
classUsedColors: [],
chapterUsedColors: [],
classCurrentUsedColors: [],
chapterCurrentUsedColors: [],
classCanChangeColor: !1,
chapterCanChangeColor: !1,
classIsStopCombo: !1,
chapterIsStopCombo: !1
});
};
o.prototype.changeColor = function() {
if (!this.getCanChangeColor()) return [];
if (this._skinCanChangeIdArr.includes(this.getSkinId())) {
var t = [];
if (0 == this.getCurrentUsedColorsArray().length) {
var o = this.randomColor();
t = Array.from({
length: 3
}, function() {
return o;
});
this.setTraitData({
currentUsedColors: t
});
} else t = this.getCurrentUsedColorsArray();
t.length > 0 && (hs.gameInfo.gameMode == hs.GameMode.Class ? hs.storage.setItem("classColorLists", t) : hs.storage.setItem("chapterColorLists", t));
return t;
}
return [];
};
o.prototype.getAllColors = function() {
return [ hs.ColorProducerType.COLOR_BLUE, hs.ColorProducerType.COLOR_YELLOW, hs.ColorProducerType.COLOR_PURPLE, hs.ColorProducerType.COLOR_ORANGE, hs.ColorProducerType.COLOR_RED, hs.ColorProducerType.COLOR_GREEN, hs.ColorProducerType.COLOR_LIGHTBLUE ];
};
o.prototype.getUsedColors = function() {
var t = this.getUsedColorsArray();
return Array.isArray(t) ? t : [];
};
o.prototype.saveUsedColors = function(t) {
this.setTraitData({
usedColors: t
});
};
o.prototype.randomColor = function() {
var t = this.getAllColors(), o = this.getUsedColors();
o.length >= t.length && (o = []);
var r = t.filter(function(t) {
return !o.includes(t);
});
if (0 === r.length) return hs.ColorProducerType.COLOR_BLUE;
var e = r[Math.floor(Math.random() * r.length)];
if (!e) return hs.ColorProducerType.COLOR_BLUE;
o.push(e);
this.saveUsedColors(o);
return e;
};
o.prototype.getSkinId = function() {
return hs.gameInfo.gameMode, hs.GameMode.Class, hs.skinInfo.currentSkinId;
};
o.prototype.getUsedColorsArray = function() {
return hs.gameInfo.gameMode == hs.GameMode.Class ? this._traitData.classUsedColors || [] : this._traitData.chapterUsedColors || [];
};
o.prototype.getCurrentUsedColorsArray = function() {
return hs.gameInfo.gameMode == hs.GameMode.Class ? this._traitData.classCurrentUsedColors || [] : this._traitData.chapterCurrentUsedColors || [];
};
o.prototype.getCanChangeColor = function() {
return hs.gameInfo.gameMode == hs.GameMode.Class ? this._traitData.classCanChangeColor || !1 : this._traitData.chapterCanChangeColor || !1;
};
o.prototype.setTraitData = function(t) {
var o = t.usedColors, r = void 0 === o ? null : o, e = t.currentUsedColors, s = void 0 === e ? null : e, a = t.canChangeColor, n = void 0 === a ? void 0 : a, i = t.isStopCombo, l = void 0 === i ? void 0 : i;
if (hs.gameInfo.gameMode == hs.GameMode.Class) {
null !== r && (this._traitData.classUsedColors = r);
null !== s && (this._traitData.classCurrentUsedColors = s);
void 0 !== n && (this._traitData.classCanChangeColor = n);
void 0 !== l && (this._traitData.classIsStopCombo = l);
} else {
null !== r && (this._traitData.chapterUsedColors = r);
null !== s && (this._traitData.chapterCurrentUsedColors = s);
void 0 !== n && (this._traitData.chapterCanChangeColor = n);
void 0 !== l && (this._traitData.chapterIsStopCombo = l);
}
hs.storage.setItem("cleanComboChangeColor", this._traitData);
};
o.prototype.updateClassProducerBlock = function(t) {
var o, r, e = Cinst(hs.BlocksProducer);
if (cc.isValid(e)) try {
for (var s = n(e.blocksContainer.children), a = s.next(); !a.done; a = s.next()) {
var i = a.value;
if (cc.isValid(i.children)) {
var l = i.getComponent(hs.BlocksProducerItem);
if (l) {
var c = Object.assign({}, l.state);
c.color = t;
l.setState(c);
}
}
}
} catch (t) {
o = {
error: t
};
} finally {
try {
a && !a.done && (r = s.return) && r.call(s);
} finally {
if (o) throw o.error;
}
}
};
o.prototype.updateBoardBlock = function(t) {
var o, r, e = Cinst(hs.Board);
if (cc.isValid(e)) try {
for (var s = n(e.blocks.children), a = s.next(); !a.done; a = s.next()) {
var i = a.value;
if (cc.isValid(i) && 255 == i.opacity) {
var l = i.getComponent(hs.Block);
l && l.setState({
color: t,
sourceColor: t
});
}
}
} catch (t) {
o = {
error: t
};
} finally {
try {
a && !a.done && (r = s.return) && r.call(s);
} finally {
if (o) throw o.error;
}
}
};
o.prototype.updateChapterProducerBlock = function(t) {
for (var o, r, e, s = Cinst(hs.BlocksProducer), a = [], n = 0; n < (null === (r = null === (o = s.state) || void 0 === o ? void 0 : o.itemsColors) || void 0 === r ? void 0 : r.length); n++) {
var i = null === (e = s.state) || void 0 === e ? void 0 : e.itemsColors[n];
for (var l in i) i[l] < 100 ? a[n][l] = t[0] : a[n][l] = i[l];
}
a.length > 0 ? s.setState({
producerBlocks: hs.blocksProducerInfo.producerBlocks,
itemsColors: a
}) : s.setState({
producerBlocks: hs.blocksProducerInfo.producerBlocks,
colors: t
});
};
o.prototype.checkTravelNoSkinIsActive = function(t) {
void 0 === t && (t = !1);
return hs.gameInfo.gameMode == hs.GameMode.Chapter && t;
};
o.prototype.checkIsCanChangeColor = function() {
return !!this._skinCanChangeIdArr.includes(this.getSkinId());
};
return a([ classId("CleanComboChangeColorTrait"), classMethodWatch() ], o);
}(Trait);
r.CleanComboChangeColorTrait = i;
cc._RF.pop();
}, {} ]
}, {}, [ "CleanComboChangeColorTrait" ]);
//# sourceMappingURL=index.js.map
