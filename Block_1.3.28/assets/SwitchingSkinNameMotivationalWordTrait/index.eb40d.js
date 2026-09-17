window.__require = function e(t, n, r) {
function o(a, c) {
if (!n[a]) {
if (!t[a]) {
var s = a.split("/");
s = s[s.length - 1];
if (!t[s]) {
var u = "function" == typeof __require && __require;
if (!c && u) return u(s, !0);
if (i) return i(s, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = s;
}
var l = n[a] = {
exports: {}
};
t[a][0].call(l.exports, function(e) {
return o(t[a][1][e] || e);
}, l, l.exports, e, t, n, r);
}
return n[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < r.length; a++) o(r[a]);
return o;
}({
SwitchingSkinNameEncourage: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "cb53aBu5a1G67/LvFrpp21w", "SwitchingSkinNameEncourage");
var r, o = this && this.__extends || (r = function(e, t) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
r(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), i = this && this.__decorate || function(e, t, n, r) {
var o, i = arguments.length, a = i < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, n) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, r); else for (var c = e.length - 1; c >= 0; c--) (o = e[c]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
return i > 3 && a && Object.defineProperty(t, n, a), a;
}, a = this && this.__awaiter || function(e, t, n, r) {
return new (n || (n = Promise))(function(o, i) {
function a(e) {
try {
s(r.next(e));
} catch (e) {
i(e);
}
}
function c(e) {
try {
s(r.throw(e));
} catch (e) {
i(e);
}
}
function s(e) {
e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, c);
var t;
}
s((r = r.apply(e, t || [])).next());
});
}, c = this && this.__generator || function(e, t) {
var n, r, o, i, a = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
},
trys: [],
ops: []
};
return i = {
next: c(0),
throw: c(1),
return: c(2)
}, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
return this;
}), i;
function c(e) {
return function(t) {
return s([ e, t ]);
};
}
function s(i) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, r && (o = 2 & i[0] ? r.return : i[0] ? r.throw || ((o = r.return) && o.call(r), 
0) : r.next) && !(o = o.call(r, i[1])).done) return o;
(r = 0, o) && (i = [ 2 & i[0], o.value ]);
switch (i[0]) {
case 0:
case 1:
o = i;
break;

case 4:
a.label++;
return {
value: i[1],
done: !1
};

case 5:
a.label++;
r = i[1];
i = [ 0 ];
continue;

case 7:
i = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(o = a.trys, o = o.length > 0 && o[o.length - 1]) && (6 === i[0] || 2 === i[0])) {
a = 0;
continue;
}
if (3 === i[0] && (!o || i[1] > o[0] && i[1] < o[3])) {
a.label = i[1];
break;
}
if (6 === i[0] && a.label < o[1]) {
a.label = o[1];
o = i;
break;
}
if (o && a.label < o[2]) {
a.label = o[2];
a.ops.push(i);
break;
}
o[2] && a.ops.pop();
a.trys.pop();
continue;
}
i = t.call(e, a);
} catch (e) {
i = [ 6, e ];
r = 0;
} finally {
n = o = 0;
}
if (5 & i[0]) throw i[1];
return {
value: i[0] ? i[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
var s = cc._decorator, u = s.ccclass, l = s.property, h = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.root = null;
t.encourageBg = null;
t.encourage = null;
return t;
}
t.prototype.onLoad = function() {};
t.prototype.render = function() {
var e = this, t = this.state, n = (t.skinName, t.skinId);
this.node.active = !0;
this.checkSkinnameBg(n);
this.checkSkinname(n);
this.checkMaterial();
this.root.scale = 0;
this.root.opacity = 255;
this.scheduleOnce(function() {
e.playAnimation();
}, this.state.delayTime);
};
t.prototype.checkSkinnameBg = function(e) {
return a(this, void 0, void 0, function() {
var t;
return c(this, function(n) {
switch (n.label) {
case 0:
return [ 4, hs.ResLoader.asyncLoadByBundle("SwitchingSkinNameMotivationalWordTrait", "textures/" + e + "/gameplay_skinname_bg_" + e, cc.SpriteFrame) ];

case 1:
t = n.sent();
this.encourageBg.getComponent(cc.Sprite).spriteFrame = t;
return [ 2 ];
}
});
});
};
t.prototype.checkSkinname = function(e) {
return a(this, void 0, void 0, function() {
var t;
return c(this, function(n) {
switch (n.label) {
case 0:
return [ 4, hs.ResLoader.asyncLoadByBundle("SwitchingSkinNameMotivationalWordTrait", "textures/" + e + "/gameplay_skinname_" + e, cc.SpriteFrame) ];

case 1:
t = n.sent();
this.encourage.getComponent(cc.Sprite).spriteFrame = t;
return [ 2 ];
}
});
});
};
t.prototype.checkMaterial = function() {
var e = this.state.params;
if (e) {
this.encourage.color = cc.Color.fromHEX(new cc.Color(), e.color);
var t = this.encourageBg.getComponent(cc.Sprite).getMaterial(0);
if (t) {
var n = new cc.Color();
cc.Color.fromHEX(n, e.colorParam);
var r = new cc.Color();
cc.Color.fromHEX(r, e.gradientParam);
t.setProperty("topColor", n);
t.setProperty("bottomColor", r);
}
}
};
t.prototype.colorToArray = function(e) {
return [ e.r / 255, e.g / 255, e.b / 255, e.a / 255 ];
};
t.prototype.playAnimation = function() {
var e = this;
this.state.pos;
cc.Tween.stopAllByTarget(this.root);
cc.tween(this.root).to(.23, {
scale: 1.2
}).to(.17, {
scale: 1
}).delay(1.13).to(.1, {
scale: .9
}).to(.15, {
scale: 1.2,
opacity: 0
}).call(function() {
e.node && cc.isValid(e.node) && (e.node.active = !1);
}).start();
};
t.prototype.onDestroy = function() {
this.node && cc.isValid(this.node) && cc.Tween.stopAllByTarget(this.node);
};
i([ l(cc.Node) ], t.prototype, "root", void 0);
i([ l(cc.Node) ], t.prototype, "encourageBg", void 0);
i([ l(cc.Node) ], t.prototype, "encourage", void 0);
return i([ u ], t);
}(hs.Component);
n.default = h;
cc._RF.pop();
}, {} ],
SwitchingSkinNameMotivationalWordTrait: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "ab549vXyfhBIryN2FkDA6Rq", "SwitchingSkinNameMotivationalWordTrait");
var r, o = this && this.__extends || (r = function(e, t) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
r(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), i = this && this.__decorate || function(e, t, n, r) {
var o, i = arguments.length, a = i < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, n) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, r); else for (var c = e.length - 1; c >= 0; c--) (o = e[c]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
return i > 3 && a && Object.defineProperty(t, n, a), a;
}, a = this && this.__awaiter || function(e, t, n, r) {
return new (n || (n = Promise))(function(o, i) {
function a(e) {
try {
s(r.next(e));
} catch (e) {
i(e);
}
}
function c(e) {
try {
s(r.throw(e));
} catch (e) {
i(e);
}
}
function s(e) {
e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, c);
var t;
}
s((r = r.apply(e, t || [])).next());
});
}, c = this && this.__generator || function(e, t) {
var n, r, o, i, a = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
},
trys: [],
ops: []
};
return i = {
next: c(0),
throw: c(1),
return: c(2)
}, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
return this;
}), i;
function c(e) {
return function(t) {
return s([ e, t ]);
};
}
function s(i) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, r && (o = 2 & i[0] ? r.return : i[0] ? r.throw || ((o = r.return) && o.call(r), 
0) : r.next) && !(o = o.call(r, i[1])).done) return o;
(r = 0, o) && (i = [ 2 & i[0], o.value ]);
switch (i[0]) {
case 0:
case 1:
o = i;
break;

case 4:
a.label++;
return {
value: i[1],
done: !1
};

case 5:
a.label++;
r = i[1];
i = [ 0 ];
continue;

case 7:
i = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(o = a.trys, o = o.length > 0 && o[o.length - 1]) && (6 === i[0] || 2 === i[0])) {
a = 0;
continue;
}
if (3 === i[0] && (!o || i[1] > o[0] && i[1] < o[3])) {
a.label = i[1];
break;
}
if (6 === i[0] && a.label < o[1]) {
a.label = o[1];
o = i;
break;
}
if (o && a.label < o[2]) {
a.label = o[2];
a.ops.push(i);
break;
}
o[2] && a.ops.pop();
a.trys.pop();
continue;
}
i = t.call(e, a);
} catch (e) {
i = [ 6, e ];
r = 0;
} finally {
n = o = 0;
}
if (5 & i[0]) throw i[1];
return {
value: i[0] ? i[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.SwitchingSkinNameMotivationalWordTrait = void 0;
var s = {
1001: "Pure Pink",
1002: "Macaron",
1003: "Gradient Pink",
1004: "Morandi ",
1005: "Pure Green",
1006: "Sunflowers",
1007: "The Starry Night",
1008: "Dark Pop",
1009: "Mondrian",
1010: "Cyberpunk",
1011: "Countryside",
1012: "Ocean",
1013: "Forest",
1014: "Ukiyoe",
1015: "Memphis",
1016: "Rococo",
1017: "Matisse",
1018: "Latte",
1019: "Pantone",
1020: "Ground",
1021: "Blue-white",
1022: "Classic Black",
1023: "Earth",
1024: "Air Pink",
1025: "Tiffany Blue",
1026: "Dessert",
1027: "Macaw",
1028: "Mountains",
1029: "Glaciers",
1030: "Warm Cold",
1031: "Wizard",
1032: "Passion",
1033: "Peaceful",
1034: "Mystery",
1035: "Fresh",
1036: "Romantic",
1037: "Calm",
1038: "Lovely",
1039: "Energy"
}, u = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.skinEncourageConfig = null;
t.prevSkinIdCache = "";
t.hasShownSkinNameThisRound = !1;
t.encouragePrefab = null;
t.encourageNode = null;
t.isClearScreen = !1;
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "Encourage_Proxy",
methodName: "onTouchEnd"
} ];
};
t.prototype.onActive = function(e) {
var t, n;
hs.tp.isClassEncourage_ProxyPlayEncourageUnbelievable(e) && (e.args[1] = 1e3);
hs.tp.isClassEncourage_ProxyPlayEncourageUnbelievableAudio(e) && (e.args[1] = 1e3);
hs.tp.isClassEncourage_ProxyPlayEncourageUnbelievableDelayEndEffect(e) && this.handlePlayEncourageUnbelievable2(e);
hs.tp.isFeatclearscreenbombTraitAnimPlayAnimation(e) && this.handleAnimPlayAnimation(e);
hs.tp.isSkin_ProxyOnSkinUpdate(e) && this.handleSkinUpdate(e);
if (hs.tp.isEncourage_ProxyOnTouchEnd(e)) {
var r = e.args[0];
this.isClearScreen = null !== (n = null === (t = null == r ? void 0 : r.state) || void 0 === t ? void 0 : t.clearScreen) && void 0 !== n && n;
}
};
t.prototype.handleSkinUpdate = function(e) {
var t = e.args[0];
t && t.skinId && "" !== t.skinId && t.skinId !== this.prevSkinIdCache && (this.prevSkinIdCache = t.skinId);
};
t.prototype.handlePlayEncourageUnbelievable = function(e) {
var t = this;
if (this.isPlaySkinEncourage()) {
e.replace = !0;
var n = e.args[1];
cc.tween(new cc.Node()).delay(n / 1e3).call(function() {
var e = t.prevSkinIdCache;
t.prevSkinIdCache = "";
e && t.showSkinNameEncourage(e);
}).start();
}
};
t.prototype.handlePlayEncourageUnbelievable2 = function(e) {
if (this.isPlaySkinEncourage()) {
e.replace = !0;
var t = this.prevSkinIdCache;
this.prevSkinIdCache = "";
t && this.showSkinNameEncourage(t);
}
};
t.prototype.showSkinNameEncourage = function(e) {
var t, n;
return a(this, void 0, void 0, function() {
var r, o, i;
return c(this, function(a) {
switch (a.label) {
case 0:
a.label = 1;

case 1:
a.trys.push([ 1, 5, , 6 ]);
if (this.skinEncourageConfig) return [ 3, 3 ];
r = this;
return [ 4, this.loadSkinEncourageConfig() ];

case 2:
r.skinEncourageConfig = a.sent();
a.label = 3;

case 3:
(o = s[e]) || (o = "");
return (i = null === (n = null === (t = this.skinEncourageConfig) || void 0 === t ? void 0 : t["skin_" + e]) || void 0 === n ? void 0 : n[0]) ? [ 4, this.showSkinNamePrefab(e, o, i) ] : [ 2 ];

case 4:
case 5:
a.sent();
return [ 3, 6 ];

case 6:
return [ 2 ];
}
});
});
};
t.prototype.loadSkinEncourageConfig = function() {
return a(this, void 0, Promise, function() {
return c(this, function() {
return [ 2, new Promise(function(e, t) {
hs.ResLoader.loadByBundle("SwitchingSkinNameMotivationalWordTrait", "json/skinEncourage", cc.JsonAsset, function(n, r) {
n ? t(n) : e(r.json);
});
}) ];
});
});
};
t.prototype.showSkinNamePrefab = function(e, t, n) {
return a(this, void 0, void 0, function() {
var r, o, i, a;
return c(this, function(c) {
switch (c.label) {
case 0:
if (this.encouragePrefab) return [ 3, 2 ];
r = this;
return [ 4, hs.ResLoader.asyncLoadByBundle("SwitchingSkinNameMotivationalWordTrait", "prefabs/SwitchingSkinNameEncourage", cc.Prefab) ];

case 1:
r.encouragePrefab = c.sent();
c.label = 2;

case 2:
if (!this.encouragePrefab) return [ 2 ];
if (!this.encourageNode) {
this.encourageNode = cc.instantiate(this.encouragePrefab);
hs.gameEffectLayer.addChild(this.encourageNode);
o = hs.gameEffectLayer.getContentSize();
this.encourageNode.setPosition(o.width / 2, .5 * o.height + 110, 0);
}
i = this.encourageNode;
if (!(a = i.getComponent("SwitchingSkinNameEncourage"))) return [ 2 ];
a.setState({
skinName: t,
skinId: e,
delayTime: 0,
pos: cc.v2(0, 0),
params: n
});
return [ 2 ];
}
});
});
};
t.prototype.isPlaySkinEncourage = function() {
return !(hs.gameInfo.gameMode !== hs.GameMode.Class || hs.storage.getItem("classRoundNum", 0) < 6 || !this.predictWillChangeSkin());
};
t.prototype.predictWillChangeSkin = function() {
var e, t;
return !!this.isClearScreen && (!((null !== (t = null === (e = hs.classGameInfo) || void 0 === e ? void 0 : e.roundNum) && void 0 !== t ? t : 0) <= 5) && !!this.isChangeSkin(!0));
};
t.prototype.isChangeSkin = function(e) {
return e;
};
t.prototype.handleAnimPlayAnimation = function(e) {
if (this.isPlaySkinEncourage()) {
var t = e.args[0];
if (t && cc.isValid(t.node)) {
t.playAnimation("in", 1);
e.replace = !0;
e.returnState = !0;
}
}
};
return i([ classId("SwitchingSkinNameMotivationalWordTrait"), classMethodWatch() ], t);
}(Trait);
n.SwitchingSkinNameMotivationalWordTrait = u;
cc._RF.pop();
}, {} ]
}, {}, [ "SwitchingSkinNameEncourage", "SwitchingSkinNameMotivationalWordTrait" ]);
//# sourceMappingURL=index.js.map
