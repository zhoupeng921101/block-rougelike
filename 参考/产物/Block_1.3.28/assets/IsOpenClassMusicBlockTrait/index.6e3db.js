window.__require = function o(e, t, i) {
function c(l, n) {
if (!t[l]) {
if (!e[l]) {
var a = l.split("/");
a = a[a.length - 1];
if (!e[a]) {
var r = "function" == typeof __require && __require;
if (!n && r) return r(a, !0);
if (s) return s(a, !0);
throw new Error("Cannot find module '" + l + "'");
}
l = a;
}
var u = t[l] = {
exports: {}
};
e[l][0].call(u.exports, function(o) {
return c(e[l][1][o] || o);
}, u, u.exports, o, e, t, i);
}
return t[l].exports;
}
for (var s = "function" == typeof __require && __require, l = 0; l < i.length; l++) c(i[l]);
return c;
}({
BoardEffectMusicBlockEff: [ function(o, e, t) {
"use strict";
cc._RF.push(e, "76fb7Pd7AhG/oXGs/Yiwa+i", "BoardEffectMusicBlockEff");
var i, c = this && this.__extends || (i = function(o, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(o, e) {
o.__proto__ = e;
} || function(o, e) {
for (var t in e) Object.prototype.hasOwnProperty.call(e, t) && (o[t] = e[t]);
})(o, e);
}, function(o, e) {
i(o, e);
function t() {
this.constructor = o;
}
o.prototype = null === e ? Object.create(e) : (t.prototype = e.prototype, new t());
}), s = this && this.__decorate || function(o, e, t, i) {
var c, s = arguments.length, l = s < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, t) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) l = Reflect.decorate(o, e, t, i); else for (var n = o.length - 1; n >= 0; n--) (c = o[n]) && (l = (s < 3 ? c(l) : s > 3 ? c(e, t, l) : c(e, t)) || l);
return s > 3 && l && Object.defineProperty(e, t, l), l;
};
Object.defineProperty(t, "__esModule", {
value: !0
});
var l = o("./MusicBlockConfig"), n = cc._decorator, a = n.ccclass, r = n.property, u = function(o) {
c(e, o);
function e() {
var e = null !== o && o.apply(this, arguments) || this;
e.itmeNode = null;
e.blockContent = null;
e.clickEffContent = null;
e.clickEffItem = null;
e._clickEffCache = [];
return e;
}
e.prototype.onLoad = function() {
this._clickEffCache = [ this.clickEffItem ];
};
e.prototype.render = function() {
var o = this, e = 0, t = storage.getItem("classMusicBlockInfo", []);
0 === t.length && this.state.cb && this.state.cb();
t.forEach(function(t) {
var i = o.blockContent.children[e];
if (!i) {
i = cc.instantiate(o.itmeNode);
o.blockContent.addChild(i);
}
i.opacity = 255;
var c = hs.boardRendererInfo.blocks[t.row][t.col];
c && (i.position = cc.v3(c.x, c.y + 2));
o.showOneItem(i, t, o.state.isAni && t.showAni);
e++;
});
for (var i = e; i < this.blockContent.children.length; i++) {
var c = this.blockContent.children[i];
c && cc.isValid(c) && (c.opacity = 0);
}
};
e.prototype.showOneItem = function(o, e, t) {
var i = this, c = o.getChildByName("bright"), s = o.getChildByName("dark");
if (c && s) {
for (var n = [ "blockItemTop", "blockItemCenter", "blockItemBot" ], a = [ [ l.MusicBlockConfig.MusicBlockPlus1, l.MusicBlockConfig.MusicBlockPlus2, l.MusicBlockConfig.MusicBlockPlus3, l.MusicBlockConfig.MusicBlockPlus4, l.MusicBlockConfig.MusicBlockPlus5, l.MusicBlockConfig.MusicBlockPlus6, l.MusicBlockConfig.MusicBlockPlus7 ], [ l.MusicBlockConfig.MusicBlock1, l.MusicBlockConfig.MusicBlock2, l.MusicBlockConfig.MusicBlock3, l.MusicBlockConfig.MusicBlock4, l.MusicBlockConfig.MusicBlock5, l.MusicBlockConfig.MusicBlock6, l.MusicBlockConfig.MusicBlock7 ], [ l.MusicBlockConfig.MusicBlockMinus1, l.MusicBlockConfig.MusicBlockMinus2, l.MusicBlockConfig.MusicBlockMinus3, l.MusicBlockConfig.MusicBlockMinus4, l.MusicBlockConfig.MusicBlockMinus5, l.MusicBlockConfig.MusicBlockMinus6, l.MusicBlockConfig.MusicBlockMinus7 ] ], r = 0; r < 3; r++) for (var u = 0; u < 7; u++) {
var f = e.list[r][u], p = c.getChildByName("" + n[r] + (u + 1)), d = s.getChildByName("" + n[r] + (u + 1));
p && (p.active = !(!f || -1 === f));
if (d) {
d.active = !(!f || -1 === f);
d.off(cc.Node.EventType.TOUCH_START);
if (d.active) {
var h = d.getChildByName("drak"), k = d.getChildByName("bright");
if (h) {
h.active = !0;
h.scale = 1;
h.stopAllActions();
}
if (k) {
k.opacity = 0;
k.stopAllActions();
k.scale = 1;
}
d.audioTpe = a[r][u];
d.boardPos = {
row: e.row + r,
col: e.col + u
};
d.darkNum = h;
d.brightNum = k;
}
}
}
c.stopAllActions();
s.stopAllActions();
if (t) {
c.opacity = 0;
s.opacity = 0;
cc.tween(c).to(.2, {
opacity: 255
}).to(.3, {
opacity: 0
}).start();
cc.tween(s).delay(.33).to(.1, {
opacity: 255
}).call(function() {
i.state.cb && i.state.cb();
}).start();
} else {
c.opacity = 0;
s.opacity = 255;
this.state.cb && this.state.cb();
}
} else o.opacity = 0;
};
e.prototype.onMusicClickByBlock = function(o, e) {
var t = storage.getItem("classMusicBlockInfo", []), i = -1, c = -1, s = -1;
t.forEach(function(t, l) {
t.list.forEach(function(n, a) {
if (a + t.row === o && 1 === n[e - t.col]) {
i = l;
c = a;
s = e - t.col;
}
});
});
if (-1 !== i) {
var l = this.blockContent.children[i];
if (l) {
var n = l.getChildByName("dark");
if (n) {
var a = n.getChildByName("" + [ "blockItemTop", "blockItemCenter", "blockItemBot" ][c] + (s + 1));
a && this.onMusicClick(cc.v3(a.position.x + a.parent.parent.position.x, a.position.y + a.parent.parent.position.y), a.audioTpe, a.boardPos, a.darkNum, a.brightNum);
}
}
}
};
e.prototype.onMusicClick = function(o, e, t, i, c) {
var s, l = this;
if (e) {
DS("usr_data_music_click", {
sound_effect: e.url.split("/").pop()
});
hs.audioInfo.play(e);
var n = this._clickEffCache.shift();
if (!n) {
n = cc.instantiate(this.clickEffItem);
this.clickEffContent.addChild(n);
this._clickEffCache.push(n);
}
n.active = !0;
n.position = cc.v3(o.x - hs.BLOCK_HALF_SIZE, o.y + hs.BLOCK_HALF_SIZE);
var a = n.getComponent(dragonBones.ArmatureDisplay);
if (t) {
var r = null === (s = hs.boardRendererInfo.blocks[t.row]) || void 0 === s ? void 0 : s[t.col];
if (r) {
r.scale = 1;
r.stopAllActions();
cc.tween(r).to(.2, {
scale: .95
}).to(.23, {
scale: 1
}).start();
}
}
if (c) {
c.scale = 1.2;
c.opacity = 0;
cc.tween(c).to(.2, {
scale: .95
}).to(.23, {
scale: 1
}).start();
cc.tween(c).to(.1, {
opacity: 255
}).to(.27, {
opacity: 0
}).start();
}
if (a) {
a.playAnimation("animation", -1);
a.once(dragonBones.EventObject.COMPLETE, function() {
if (n && cc.isValid(n)) {
n.active = !1;
l._clickEffCache.push(n);
}
}, this);
}
}
};
s([ r(cc.Node) ], e.prototype, "itmeNode", void 0);
s([ r(cc.Node) ], e.prototype, "blockContent", void 0);
s([ r(cc.Node) ], e.prototype, "clickEffContent", void 0);
s([ r(cc.Node) ], e.prototype, "clickEffItem", void 0);
s([ hs.throttle(300) ], e.prototype, "onMusicClick", null);
return s([ a ], e);
}(hs.Component);
t.default = u;
cc._RF.pop();
}, {
"./MusicBlockConfig": "MusicBlockConfig"
} ],
BoardEffectMusicBlockMusicTimeEff: [ function(o, e, t) {
"use strict";
cc._RF.push(e, "345f5OnnDxGy779z2v2pykk", "BoardEffectMusicBlockMusicTimeEff");
var i, c = this && this.__extends || (i = function(o, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(o, e) {
o.__proto__ = e;
} || function(o, e) {
for (var t in e) Object.prototype.hasOwnProperty.call(e, t) && (o[t] = e[t]);
})(o, e);
}, function(o, e) {
i(o, e);
function t() {
this.constructor = o;
}
o.prototype = null === e ? Object.create(e) : (t.prototype = e.prototype, new t());
}), s = this && this.__decorate || function(o, e, t, i) {
var c, s = arguments.length, l = s < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, t) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) l = Reflect.decorate(o, e, t, i); else for (var n = o.length - 1; n >= 0; n--) (c = o[n]) && (l = (s < 3 ? c(l) : s > 3 ? c(e, t, l) : c(e, t)) || l);
return s > 3 && l && Object.defineProperty(e, t, l), l;
};
Object.defineProperty(t, "__esModule", {
value: !0
});
var l = o("./MusicBlockConfig"), n = cc._decorator, a = n.ccclass, r = n.property, u = function(o) {
c(e, o);
function e() {
var e = null !== o && o.apply(this, arguments) || this;
e.ani = null;
return e;
}
e.prototype.render = function() {
var o = this;
hs.audioInfo.play(l.MusicBlockConfig.MusicBlockTime);
this.ani.off(dragonBones.EventObject.COMPLETE);
this.ani.on(dragonBones.EventObject.COMPLETE, function() {
o.state.cb && o.state.cb();
}, this);
this.ani.playAnimation("animation", -1);
};
s([ r(dragonBones.ArmatureDisplay) ], e.prototype, "ani", void 0);
return s([ a ], e);
}(hs.Component);
t.default = u;
cc._RF.pop();
}, {
"./MusicBlockConfig": "MusicBlockConfig"
} ],
IsOpenClassMusicBlockTrait: [ function(o, e, t) {
"use strict";
cc._RF.push(e, "25269b2ETlNh5wAyfsQVbxl", "IsOpenClassMusicBlockTrait");
var i, c = this && this.__extends || (i = function(o, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(o, e) {
o.__proto__ = e;
} || function(o, e) {
for (var t in e) Object.prototype.hasOwnProperty.call(e, t) && (o[t] = e[t]);
})(o, e);
}, function(o, e) {
i(o, e);
function t() {
this.constructor = o;
}
o.prototype = null === e ? Object.create(e) : (t.prototype = e.prototype, new t());
}), s = this && this.__decorate || function(o, e, t, i) {
var c, s = arguments.length, l = s < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, t) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) l = Reflect.decorate(o, e, t, i); else for (var n = o.length - 1; n >= 0; n--) (c = o[n]) && (l = (s < 3 ? c(l) : s > 3 ? c(e, t, l) : c(e, t)) || l);
return s > 3 && l && Object.defineProperty(e, t, l), l;
};
Object.defineProperty(t, "__esModule", {
value: !0
});
t.IsOpenClassMusicBlockTrait = void 0;
var l = o("./BoardEffectMusicBlockEff"), n = o("./BoardEffectMusicBlockMusicTimeEff"), a = function(o) {
c(e, o);
function e() {
var e = null !== o && o.apply(this, arguments) || this;
e._timeEffPrefab = null;
e._blockEffPrefab = null;
e._timeEffNode = null;
e._blockEffNode = null;
e._playTimeEff = !1;
e._playBlockEff = !1;
return e;
}
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassBoardEffect_Proxy",
methodName: "onTouchEnd"
}, {
className: "ClassDefaultBoard_Proxy",
methodName: "onProduceClassDefaultBoard"
}, {
className: "ClassGame_Proxy",
methodName: "onGameBackHome"
}, {
className: "ClassEliminate_Effects_Proxy",
methodName: "dealEliminateClearEffect"
}, {
className: "ClassDefaultBoard_Proxy",
methodName: "onGameOverPre"
} ];
};
e.prototype.onActive = function(o) {
var e, t, i;
if (hs.tp.isClassBoardEffect_ProxyOnTouchEnd(o)) {
var c = null === (e = null == (a = o.args[0]) ? void 0 : a.state) || void 0 === e ? void 0 : e.putEliminatesInfo, s = storage.getItem("classMusicBlockInfo", []);
if (null === (t = null == a ? void 0 : a.state) || void 0 === t ? void 0 : t.clearScreen) {
s = [];
storage.setItem("classMusicBlockInfo", s);
}
if (c && c.length > 0) {
c.forEach(function(o) {
s.forEach(function(e) {
if (o.row >= e.row && o.row < e.row + 3) {
var t = o.row - e.row;
if (e.list[t].length > 0) {
e.list[t][o.col - e.col] = -1;
e.list[t].includes(1) || (e.list[t] = []);
}
}
});
for (var e = s.length - 1; e >= 0; e--) 0 === s[e].list.length && s.splice(e, 1);
});
storage.setItem("classMusicBlockInfo", s);
this._playTimeEff || this.showBlockEff(s, !1);
}
if ((u = this.get3x7BlockArray(s)).length > 0) {
var n = storage.getItem("classMusicBlockCount", 0);
n++;
storage.setItem("classMusicBlockCount", n);
(s = []).forEach(function(o) {
o.showAni = !1;
});
u.forEach(function(o) {
s.push(o);
});
storage.setItem("classMusicBlockInfo", s);
this.showTimeEff(s);
}
}
if (hs.tp.isClassDefaultBoard_ProxyOnProduceClassDefaultBoard(o)) {
var a = o.args[0];
this._playTimeEff = !1;
this._playBlockEff = !1;
if (null === (i = null == a ? void 0 : a.data) || void 0 === i ? void 0 : i.newGame) {
storage.setItem("classMusicBlockCount", 0);
storage.setItem("classMusicBlockInfo", []);
}
if (Cinst(hs.ClassGame)) {
var r = storage.getItem("classMusicBlockInfo", []);
this.showBlockEff(r, !1);
}
}
hs.tp.isClassGame_ProxyOnGameBackHome(o) && this._timeEffNode && (this._timeEffNode.active = !1);
if (hs.tp.isClassEliminate_Effects_ProxyDealEliminateClearEffect(o)) if ((r = storage.getItem("classMusicBlockInfo", [])).length > 0) this.showBlockEff(r, !1); else {
if ((u = this.get3x7BlockArray()).length > 0) {
n = storage.getItem("classMusicBlockCount", 0);
n++;
storage.setItem("classMusicBlockCount", n);
this.showTimeEff(u);
}
storage.setItem("classMusicBlockInfo", u);
}
if (hs.tp.isBlocksProducerTouchOnTouchStart(o)) {
if (this._playBlockEff || this._playTimeEff) {
o.replace = !0;
return;
}
a = o.args[0];
var u, f = Cinst(hs.Board);
(u = this.isClickOnBlock(a.getLocation(), f.node)).node && this._blockEffNode && this._blockEffNode.getComponent(l.default).onMusicClickByBlock(u.row, u.col);
}
if (hs.tp.isClassDefaultBoard_ProxyOnGameOverPre(o)) {
storage.setItem("classMusicBlockInfo", []);
this.showBlockEff([], !1);
}
};
e.prototype.showBlockEff = function(o, e) {
var t = this, i = Cinst(hs.ClassGame);
if (i && i.node && cc.isValid(i.node)) {
this._playBlockEff = !0;
var c = setTimeoutSafe(function() {
t._playBlockEff = !1;
}, 5e3);
if (this._blockEffPrefab) {
if (!this._blockEffNode) {
this._blockEffNode = cc.instantiate(this._blockEffPrefab);
i.boardContainer.addChild(this._blockEffNode, 100);
}
this._blockEffNode.getComponent(l.default).setState({
blockInfo: o,
isAni: e,
cb: function() {
clearTimeout(c);
t._playBlockEff = !1;
}
});
} else hs.ResLoader.loadByBundle("IsOpenClassMusicBlockTrait", "prefabs/musicBlockEff", cc.Prefab, function(s, n) {
if (s) {
t._playBlockEff = !1;
clearTimeout(c);
} else if (i && i.boardContainer && cc.isValid(i.boardContainer)) {
t._blockEffPrefab = n;
if (!t._blockEffNode) {
t._blockEffNode = cc.instantiate(t._blockEffPrefab);
i.boardContainer.addChild(t._blockEffNode, 100);
}
t._blockEffNode.getComponent(l.default).setState({
blockInfo: o,
isAni: e,
cb: function() {
clearTimeout(c);
t._playBlockEff = !1;
}
});
}
});
}
};
e.prototype.showTimeEff = function(o) {
var e = this;
if (!this._playTimeEff) {
this._playTimeEff = !0;
var t = setTimeoutSafe(function() {
e._playTimeEff = !1;
}, 5e3);
if (this._timeEffPrefab) {
if (!this._timeEffNode) {
this._timeEffNode = cc.instantiate(this._timeEffPrefab);
hs.uiLayer.addChild(this._timeEffNode);
}
this._timeEffNode.active = !0;
setTimeoutSafe(function() {
e.showBlockEff(o, !0);
}, 1100);
this._timeEffNode.getComponent(n.default).setState({
cb: function() {
clearTimeout(t);
e._playTimeEff = !1;
}
});
} else hs.ResLoader.loadByBundle("IsOpenClassMusicBlockTrait", "prefabs/musicBlockMusicTimeEff", cc.Prefab, function(i, c) {
if (i) {
e._playTimeEff = !1;
clearTimeout(t);
e.showBlockEff(o, !0);
} else if (hs.uiLayer && cc.isValid(hs.uiLayer)) {
e._timeEffPrefab = c;
if (!e._timeEffNode) {
e._timeEffNode = cc.instantiate(e._timeEffPrefab);
hs.uiLayer.addChild(e._timeEffNode);
}
e._timeEffNode.active = !0;
setTimeoutSafe(function() {
e.showBlockEff(o, !0);
}, 1100);
e._timeEffNode.getComponent(n.default).setState({
cb: function() {
clearTimeout(t);
e._playTimeEff = !1;
}
});
}
});
}
};
e.prototype.get3x7BlockArray = function(o) {
var e = this, t = hs.boardInfo.faceBlocks, i = -1, c = -1, s = 0, l = [], n = [];
o && o.length > 0 && o.forEach(function(o) {
o.list.forEach(function(e, t) {
e.length > 0 && n.push(o.row + t);
});
});
t.forEach(function(o, t) {
if (n.includes(t)) {
s = 0;
c = -1;
i = -1;
} else {
var a = -1, r = 0;
o.forEach(function(o, e) {
if (-1 !== o) {
-1 === a && (a = e);
r++;
} else r < 7 && (r = 0);
});
if (r >= 7) {
-1 === i && (i = t);
-1 === c && (c = a);
if (c !== a) {
s = 0;
c = -1;
i = -1;
} else s++;
if (3 === s) {
l.push(e.createOneInfo({
row: i,
col: c
}));
s = 0;
c = -1;
i = -1;
}
} else {
s = 0;
c = -1;
i = -1;
}
}
});
return l;
};
e.prototype.createOneInfo = function(o) {
for (var e = [], t = 0; t < 3; t++) {
for (var i = [], c = 0; c < 7; c++) i.push(1);
e.push(i);
}
return {
row: o.row,
col: o.col,
list: e,
showAni: !0
};
};
e.prototype.isClickOnBlock = function(o, e) {
var t = e.convertToNodeSpaceAR(o), i = Math.floor((t.x + hs.BOARD_CONTAINER_HALF_WIDTH) / hs.BLOCK_SIZE), c = Math.floor((hs.BOARD_CONTAINER_HALF_HEIGHT - t.y) / hs.BLOCK_SIZE);
if (c < 0 || c >= hs.ROW || i < 0 || i >= hs.COL) return {
node: null,
row: c,
col: i,
color: -1
};
var s = hs.boardInfo.faceBlocks;
if (!s || !s[c] || void 0 === s[c][i]) return {
node: null,
row: c,
col: i,
color: -1
};
var l = s[c][i];
if (-1 === l) return {
node: null,
row: c,
col: i,
color: -1
};
var n = hs.boardRendererInfo.blocks;
if (!n[c] || !n[c][i]) return {
node: null,
row: c,
col: i,
color: -1
};
var a = n[c][i];
return a.opacity <= 0 ? {
node: a,
row: c,
col: i,
color: -1
} : {
node: a,
row: c,
col: i,
color: l
};
};
e.prototype.getDot = function() {
var o = storage.getItem("classMusicBlockCount", 0);
return {
music_times: o,
has_music: o > 0 ? 1 : 0
};
};
return s([ classId("IsOpenClassMusicBlockTrait") ], e);
}(Trait);
t.IsOpenClassMusicBlockTrait = a;
cc._RF.pop();
}, {
"./BoardEffectMusicBlockEff": "BoardEffectMusicBlockEff",
"./BoardEffectMusicBlockMusicTimeEff": "BoardEffectMusicBlockMusicTimeEff"
} ],
MusicBlockConfig: [ function(o, e, t) {
"use strict";
cc._RF.push(e, "4ea21qm1cFGH701mGN3F4SL", "MusicBlockConfig");
Object.defineProperty(t, "__esModule", {
value: !0
});
t.MusicBlockConfig = void 0;
t.MusicBlockConfig = {
MusicBlock1: {
url: "audios/note 1",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: "IsOpenClassMusicBlockTrait"
},
MusicBlock2: {
url: "audios/note 2",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: "IsOpenClassMusicBlockTrait"
},
MusicBlock3: {
url: "audios/note 3",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: "IsOpenClassMusicBlockTrait"
},
MusicBlock4: {
url: "audios/note 4",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: "IsOpenClassMusicBlockTrait"
},
MusicBlock5: {
url: "audios/note 5",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: "IsOpenClassMusicBlockTrait"
},
MusicBlock6: {
url: "audios/note 6",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: "IsOpenClassMusicBlockTrait"
},
MusicBlock7: {
url: "audios/note 7",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: "IsOpenClassMusicBlockTrait"
},
MusicBlockPlus1: {
url: "audios/note+1",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: "IsOpenClassMusicBlockTrait"
},
MusicBlockPlus2: {
url: "audios/note+2",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: "IsOpenClassMusicBlockTrait"
},
MusicBlockPlus3: {
url: "audios/note+3",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: "IsOpenClassMusicBlockTrait"
},
MusicBlockPlus4: {
url: "audios/note+4",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: "IsOpenClassMusicBlockTrait"
},
MusicBlockPlus5: {
url: "audios/note+5",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: "IsOpenClassMusicBlockTrait"
},
MusicBlockPlus6: {
url: "audios/note+6",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: "IsOpenClassMusicBlockTrait"
},
MusicBlockPlus7: {
url: "audios/note+7",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: "IsOpenClassMusicBlockTrait"
},
MusicBlockMinus1: {
url: "audios/note-1",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: "IsOpenClassMusicBlockTrait"
},
MusicBlockMinus2: {
url: "audios/note-2",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: "IsOpenClassMusicBlockTrait"
},
MusicBlockMinus3: {
url: "audios/note-3",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: "IsOpenClassMusicBlockTrait"
},
MusicBlockMinus4: {
url: "audios/note-4",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: "IsOpenClassMusicBlockTrait"
},
MusicBlockMinus5: {
url: "audios/note-5",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: "IsOpenClassMusicBlockTrait"
},
MusicBlockMinus6: {
url: "audios/note-6",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: "IsOpenClassMusicBlockTrait"
},
MusicBlockMinus7: {
url: "audios/note-7",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: "IsOpenClassMusicBlockTrait"
},
MusicBlockTime: {
url: "audios/music_time",
type: hs.AudioType.EFFECT,
volume: 1,
bundleName: "IsOpenClassMusicBlockTrait"
}
};
cc._RF.pop();
}, {} ]
}, {}, [ "BoardEffectMusicBlockEff", "BoardEffectMusicBlockMusicTimeEff", "IsOpenClassMusicBlockTrait", "MusicBlockConfig" ]);
//# sourceMappingURL=index.js.map
