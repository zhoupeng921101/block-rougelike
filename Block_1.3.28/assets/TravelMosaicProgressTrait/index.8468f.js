window.__require = function t(e, r, o) {
function n(s, a) {
if (!r[s]) {
if (!e[s]) {
var c = s.split("/");
c = c[c.length - 1];
if (!e[c]) {
var l = "function" == typeof __require && __require;
if (!a && l) return l(c, !0);
if (i) return i(c, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = c;
}
var f = r[s] = {
exports: {}
};
e[s][0].call(f.exports, function(t) {
return n(e[s][1][t] || t);
}, f, f.exports, t, e, r, o);
}
return r[s].exports;
}
for (var i = "function" == typeof __require && __require, s = 0; s < o.length; s++) n(o[s]);
return n;
}({
TravelMosaicItemComponent: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "c36263DINVPcqNVV3UJPX8T", "TravelMosaicItemComponent");
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
var n, i = arguments.length, s = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, r, o); else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (s = (i < 3 ? n(s) : i > 3 ? n(e, r, s) : n(e, r)) || s);
return i > 3 && s && Object.defineProperty(e, r, s), s;
}, s = this && this.__awaiter || function(t, e, r, o) {
return new (r || (r = Promise))(function(n, i) {
function s(t) {
try {
c(o.next(t));
} catch (t) {
i(t);
}
}
function a(t) {
try {
c(o.throw(t));
} catch (t) {
i(t);
}
}
function c(t) {
t.done ? n(t.value) : (e = t.value, e instanceof r ? e : new r(function(t) {
t(e);
})).then(s, a);
var e;
}
c((o = o.apply(t, e || [])).next());
});
}, a = this && this.__generator || function(t, e) {
var r, o, n, i, s = {
label: 0,
sent: function() {
if (1 & n[0]) throw n[1];
return n[1];
},
trys: [],
ops: []
};
return i = {
next: a(0),
throw: a(1),
return: a(2)
}, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
return this;
}), i;
function a(t) {
return function(e) {
return c([ t, e ]);
};
}
function c(i) {
if (r) throw new TypeError("Generator is already executing.");
for (;s; ) try {
if (r = 1, o && (n = 2 & i[0] ? o.return : i[0] ? o.throw || ((n = o.return) && n.call(o), 
0) : o.next) && !(n = n.call(o, i[1])).done) return n;
(o = 0, n) && (i = [ 2 & i[0], n.value ]);
switch (i[0]) {
case 0:
case 1:
n = i;
break;

case 4:
s.label++;
return {
value: i[1],
done: !1
};

case 5:
s.label++;
o = i[1];
i = [ 0 ];
continue;

case 7:
i = s.ops.pop();
s.trys.pop();
continue;

default:
if (!(n = s.trys, n = n.length > 0 && n[n.length - 1]) && (6 === i[0] || 2 === i[0])) {
s = 0;
continue;
}
if (3 === i[0] && (!n || i[1] > n[0] && i[1] < n[3])) {
s.label = i[1];
break;
}
if (6 === i[0] && s.label < n[1]) {
s.label = n[1];
n = i;
break;
}
if (n && s.label < n[2]) {
s.label = n[2];
s.ops.push(i);
break;
}
n[2] && s.ops.pop();
s.trys.pop();
continue;
}
i = e.call(t, s);
} catch (t) {
i = [ 6, t ];
o = 0;
} finally {
r = n = 0;
}
if (5 & i[0]) throw i[1];
return {
value: i[0] ? i[1] : void 0,
done: !0
};
}
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var c = {
334: 321,
314: 297,
312: 279,
226: 213,
224: 215,
209: 182,
208: 181,
126: 102
}, l = cc._decorator, f = l.ccclass, u = l.property, h = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.bg = null;
e.colorImg = null;
return e;
}
e.prototype.render = function() {
this.loadBgSprite();
this.state.showColor && this.setColorImage();
this.colorImg.node.active = this.state.showColor;
};
e.prototype.loadBgSprite = function() {
return s(this, void 0, void 0, function() {
var t;
return a(this, function(e) {
switch (e.label) {
case 0:
return [ 4, hs.ResLoader.asyncLoadByBundle("chapter", hs.ChapterResPathConfig_Config.commonBgPath, cc.SpriteFrame).catch(function() {}) ];

case 1:
t = e.sent();
cc.isValid(this.bg) && t && (this.bg.spriteFrame = t);
return [ 2 ];
}
});
});
};
e.prototype.colorInfo = function(t, e) {
return e;
};
e.prototype.setColorImage = function() {
var t = this, e = this.colorInfo(this.state.color, {
type: "local",
url: this.getBlockColorResUrl(this.state.color)
}), r = e.type, o = e.url;
"local" !== r || hs.themeInfo.remoteLoad ? hs.ResLoader.asyncLoad(o, cc.Texture2D).then(function(e) {
if (cc.isValid(t.colorImg)) {
t.colorImg.spriteFrame = new cc.SpriteFrame();
t.colorImg.spriteFrame.setTexture(e);
}
}).catch(function() {}) : hs.ResLoader.asyncLoadByBundle("chapter", o, cc.SpriteFrame).then(function(e) {
cc.isValid(t.colorImg) && (t.colorImg.spriteFrame = e);
}).catch(function() {});
};
e.prototype.reset = function() {
this.colorImg.spriteFrame = null;
};
e.prototype.getBlockColorResUrl = function(t) {
var e = "textures/chapterList/periods/block";
return isNaN(t) || 0 === t ? e + "/1" : c[t] ? e + "/" + c[t] : e + "/" + t;
};
i([ u(cc.Sprite) ], e.prototype, "bg", void 0);
i([ u(cc.Sprite) ], e.prototype, "colorImg", void 0);
return i([ f ], e);
}(hs.Component);
r.default = h;
cc._RF.pop();
}, {} ],
TravelMosaicProgressComponent: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "89100TM/XFIJqtyYDFh23SS", "TravelMosaicProgressComponent");
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
var n, i = arguments.length, s = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, r, o); else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (s = (i < 3 ? n(s) : i > 3 ? n(e, r, s) : n(e, r)) || s);
return i > 3 && s && Object.defineProperty(e, r, s), s;
}, s = this && this.__awaiter || function(t, e, r, o) {
return new (r || (r = Promise))(function(n, i) {
function s(t) {
try {
c(o.next(t));
} catch (t) {
i(t);
}
}
function a(t) {
try {
c(o.throw(t));
} catch (t) {
i(t);
}
}
function c(t) {
t.done ? n(t.value) : (e = t.value, e instanceof r ? e : new r(function(t) {
t(e);
})).then(s, a);
var e;
}
c((o = o.apply(t, e || [])).next());
});
}, a = this && this.__generator || function(t, e) {
var r, o, n, i, s = {
label: 0,
sent: function() {
if (1 & n[0]) throw n[1];
return n[1];
},
trys: [],
ops: []
};
return i = {
next: a(0),
throw: a(1),
return: a(2)
}, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
return this;
}), i;
function a(t) {
return function(e) {
return c([ t, e ]);
};
}
function c(i) {
if (r) throw new TypeError("Generator is already executing.");
for (;s; ) try {
if (r = 1, o && (n = 2 & i[0] ? o.return : i[0] ? o.throw || ((n = o.return) && n.call(o), 
0) : o.next) && !(n = n.call(o, i[1])).done) return n;
(o = 0, n) && (i = [ 2 & i[0], n.value ]);
switch (i[0]) {
case 0:
case 1:
n = i;
break;

case 4:
s.label++;
return {
value: i[1],
done: !1
};

case 5:
s.label++;
o = i[1];
i = [ 0 ];
continue;

case 7:
i = s.ops.pop();
s.trys.pop();
continue;

default:
if (!(n = s.trys, n = n.length > 0 && n[n.length - 1]) && (6 === i[0] || 2 === i[0])) {
s = 0;
continue;
}
if (3 === i[0] && (!n || i[1] > n[0] && i[1] < n[3])) {
s.label = i[1];
break;
}
if (6 === i[0] && s.label < n[1]) {
s.label = n[1];
n = i;
break;
}
if (n && s.label < n[2]) {
s.label = n[2];
s.ops.push(i);
break;
}
n[2] && s.ops.pop();
s.trys.pop();
continue;
}
i = e.call(t, s);
} catch (t) {
i = [ 6, t ];
o = 0;
} finally {
r = n = 0;
}
if (5 & i[0]) throw i[1];
return {
value: i[0] ? i[1] : void 0,
done: !0
};
}
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var c = t("./TravelMosaicItemComponent"), l = cc._decorator, f = l.ccclass, u = l.property, h = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.mainEff = null;
e.lightEff = null;
e.labProgress = null;
e.mosaicNode = null;
e._lastProgress = 0;
e._itemList = [];
return e;
}
e.prototype.onDisable = function() {
this._lastProgress = 0;
};
e.prototype.shouldComponentUpdate = function(t) {
return t.progress !== this._lastProgress;
};
e.prototype.render = function() {
this.labProgress.string = this.state.progress + "%";
this._lastProgress = this.state.progress;
this.playEffect();
this.updateMosaic();
};
Object.defineProperty(e.prototype, "speed", {
get: function() {
var t;
return null !== (t = cc.director._kSpeed) && void 0 !== t ? t : 1;
},
enumerable: !1,
configurable: !0
});
e.prototype.playEffect = function() {
var t = this;
this.mainEff.setAnimation(0, "in", !1);
this.mainEff.timeScale = 1 / this.speed;
this.mainEff.setCompleteListener(function() {
if (cc.isValid(t.node) && t.node.activeInHierarchy && cc.isValid(t.mainEff)) {
t.mainEff.setCompleteListener(null);
t.mainEff.setAnimation(0, "init", !0);
}
});
this.lightEff.setAnimation(0, "in", !1);
this.lightEff.setCompleteListener(function() {
if (cc.isValid(t.node) && t.node.activeInHierarchy && cc.isValid(t.lightEff)) {
t.lightEff.setCompleteListener(null);
t.lightEff.setAnimation(0, "init", !0);
}
});
this.lightEff.timeScale = 1 / this.speed;
this.labProgress.node.stopAllActions();
cc.tween(this.labProgress.node).set({
opacity: 0
}).to(.13 * this.speed, {
opacity: 255
}).start();
this.mosaicNode.stopAllActions();
cc.tween(this.mosaicNode).set({
opacity: 0
}).to(.13 * this.speed, {
opacity: 255
}).start();
};
e.prototype.updateMosaic = function() {
return s(this, void 0, void 0, function() {
var t, e, r, o, n, i, s, l, f, u, h, p, d, g, y;
return a(this, function(a) {
switch (a.label) {
case 0:
t = hs.chapterConfigInfo.chapterListCfg;
e = t.length;
r = t[0].length;
o = 80;
this._itemList = [];
n = 0;
t.forEach(function(t) {
t.forEach(function(t) {
-1 !== t && n++;
});
});
return [ 4, hs.cacheRender.createOrUpdateCacheListComponents({
tag: "TravelMosaicProgress",
parent: this.mosaicNode,
prefabUrl: "prefabs/mosaicItem",
count: n,
typeOrClassName: c.default,
bundleName: "TravelMosaicProgressTrait"
}) ];

case 1:
i = a.sent();
if (!cc.isValid(this.node) && this.node.activeInHierarchy) return [ 2 ];
s = e * o;
this.mosaicNode.scale = 105 / s;
l = 0;
for (f = e - 1; f >= 0; f--) {
u = e % 2;
for (h = 0; h < t[f].length; h++) if (-1 != (p = t[f][h])) {
d = 0 != u ? -Math.floor(r / 2) * o + o * h : -r / 2 * o + o / 2 + o * h;
g = (e - f) * o;
if (y = i[l]) {
l++;
y.node.setPosition(d, g);
y.setState({
color: p,
showColor: !1
});
this._itemList.push(y);
}
}
}
this.setItemListOrder(this.mosaicNode);
return [ 2 ];
}
});
});
};
e.prototype.getItemListColor = function() {
for (var t = hs.chapterConfigInfo.chapterListCfg, e = [], r = t.length - 1; r >= 0; r--) for (var o = 0; o < t[r].length; o++) -1 != t[r][o] && e.push(t[r][o]);
return e;
};
e.prototype.setItemListOrder = function() {
var t = storage.getItem("chapterNum", 0), e = storage.getItem("chapterPeriodsIndex", 1), r = this.getItemListColor();
if (1 == hs.chapterConfigInfo.way[0]) {
var o = storage.getItem("chapterContentItemOrder", {
stage: 1,
orderList: []
});
if (o.stage == e && o.orderList.length > 0) {
for (var n = [], i = 0; i < o.orderList.length; i++) n.push(this._itemList[o.orderList[i]]);
this._itemList = n;
var s = [];
for (i = 0; i < o.orderList.length; i++) s.push(r[o.orderList[i]]);
r = s;
} else {
var a = [];
for (i = 0; i < this._itemList.length; i++) a.push(i);
a.sort(function() {
return Math.random() - .5;
});
for (n = [], i = 0; i < a.length; i++) n.push(this._itemList[a[i]]);
for (s = [], i = 0; i < a.length; i++) s.push(r[a[i]]);
r = s;
this._itemList = n;
}
} else if (2 == hs.chapterConfigInfo.way[0]) {
var c = hs.chapterConfigInfo.order, l = [];
for (s = [], i = 0; i < c.length; i++) for (var f = 0; f < r.length; f++) if (r[f] == c[i]) {
l.push(f);
s.push(r[f]);
}
for (n = [], i = 0; i < l.length; i++) n.push(this._itemList[l[i]]);
r = s;
this._itemList = n;
}
for (i = 0; i < this._itemList.length; i++) this._itemList[i].setState({
color: r[i],
showColor: i + 1 <= t
});
};
i([ u(sp.Skeleton) ], e.prototype, "mainEff", void 0);
i([ u(sp.Skeleton) ], e.prototype, "lightEff", void 0);
i([ u(cc.Label) ], e.prototype, "labProgress", void 0);
i([ u(cc.Node) ], e.prototype, "mosaicNode", void 0);
return i([ f ], e);
}(hs.Component);
r.default = h;
cc._RF.pop();
}, {
"./TravelMosaicItemComponent": "TravelMosaicItemComponent"
} ],
TravelMosaicProgressTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "2c0f2N4tH5B4rPMmyIWRU+8", "TravelMosaicProgressTrait");
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
var n, i = arguments.length, s = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, r, o); else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (s = (i < 3 ? n(s) : i > 3 ? n(e, r, s) : n(e, r)) || s);
return i > 3 && s && Object.defineProperty(e, r, s), s;
}, s = this && this.__awaiter || function(t, e, r, o) {
return new (r || (r = Promise))(function(n, i) {
function s(t) {
try {
c(o.next(t));
} catch (t) {
i(t);
}
}
function a(t) {
try {
c(o.throw(t));
} catch (t) {
i(t);
}
}
function c(t) {
t.done ? n(t.value) : (e = t.value, e instanceof r ? e : new r(function(t) {
t(e);
})).then(s, a);
var e;
}
c((o = o.apply(t, e || [])).next());
});
}, a = this && this.__generator || function(t, e) {
var r, o, n, i, s = {
label: 0,
sent: function() {
if (1 & n[0]) throw n[1];
return n[1];
},
trys: [],
ops: []
};
return i = {
next: a(0),
throw: a(1),
return: a(2)
}, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
return this;
}), i;
function a(t) {
return function(e) {
return c([ t, e ]);
};
}
function c(i) {
if (r) throw new TypeError("Generator is already executing.");
for (;s; ) try {
if (r = 1, o && (n = 2 & i[0] ? o.return : i[0] ? o.throw || ((n = o.return) && n.call(o), 
0) : o.next) && !(n = n.call(o, i[1])).done) return n;
(o = 0, n) && (i = [ 2 & i[0], n.value ]);
switch (i[0]) {
case 0:
case 1:
n = i;
break;

case 4:
s.label++;
return {
value: i[1],
done: !1
};

case 5:
s.label++;
o = i[1];
i = [ 0 ];
continue;

case 7:
i = s.ops.pop();
s.trys.pop();
continue;

default:
if (!(n = s.trys, n = n.length > 0 && n[n.length - 1]) && (6 === i[0] || 2 === i[0])) {
s = 0;
continue;
}
if (3 === i[0] && (!n || i[1] > n[0] && i[1] < n[3])) {
s.label = i[1];
break;
}
if (6 === i[0] && s.label < n[1]) {
s.label = n[1];
n = i;
break;
}
if (n && s.label < n[2]) {
s.label = n[2];
s.ops.push(i);
break;
}
n[2] && s.ops.pop();
s.trys.pop();
continue;
}
i = e.call(t, s);
} catch (t) {
i = [ 6, t ];
o = 0;
} finally {
r = n = 0;
}
if (5 & i[0]) throw i[1];
return {
value: i[0] ? i[1] : void 0,
done: !0
};
}
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.TravelMosaicProgressTrait = void 0;
var c = t("./TravelMosaicProgressComponent"), l = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._mosaicProgress = null;
return e;
}
e.prototype.onActive = function(t) {
if (hs.tp.isHomePageSectionChapterBtnDefaultAddChildToBtn(t)) {
this._parent = t.target.node;
this.checkConfigComplete();
}
};
e.prototype.checkConfigComplete = function() {
var t = this, e = storage.getItem("chapterNum", 0), r = hs.chapterConfigInfo.chapterDatasCfg.length;
if (0 !== r && 0 !== hs.chapterConfigInfo.chapterListCfg.length) {
var o = Math.floor(e / r * 100);
o >= 10 ? this.showProgress(o) : this.hideView();
} else setTimeoutSafe(function() {
t.checkConfigComplete();
}, 100);
};
e.prototype.loadPrefab = function() {
return s(this, void 0, void 0, function() {
var t, e;
return a(this, function(r) {
switch (r.label) {
case 0:
if (cc.isValid(this._mosaicProgress)) return [ 2 ];
r.label = 1;

case 1:
r.trys.push([ 1, 3, , 4 ]);
return [ 4, hs.ResLoader.asyncLoadByBundle(this.traitName, "prefabs/mosaicProgress", cc.Prefab) ];

case 2:
t = r.sent();
e = cc.instantiate(t);
if (cc.isValid(this._mosaicProgress)) return [ 2 ];
this._mosaicProgress = e.getComponent(c.default);
return [ 3, 4 ];

case 3:
r.sent();
return [ 3, 4 ];

case 4:
return [ 2 ];
}
});
});
};
e.prototype.showProgress = function(t) {
return s(this, void 0, void 0, function() {
return a(this, function(e) {
switch (e.label) {
case 0:
return cc.isValid(this._mosaicProgress) ? [ 3, 2 ] : [ 4, this.loadPrefab() ];

case 1:
e.sent();
e.label = 2;

case 2:
if (!cc.isValid(this._mosaicProgress)) return [ 2 ];
if (!cc.isValid(this._parent) || !this._parent.activeInHierarchy) return [ 2 ];
this._mosaicProgress.node.parent != this._parent && this._mosaicProgress.node.setParent(this._parent);
this._mosaicProgress.node.setPosition(367, 11);
this._mosaicProgress.setState({
progress: t,
showAnim: !0
});
return [ 2 ];
}
});
});
};
e.prototype.hideView = function() {
cc.isValid(this._mosaicProgress) && this._mosaicProgress.node.removeFromParent();
};
return i([ classId("TravelMosaicProgressTrait") ], e);
}(Trait);
r.TravelMosaicProgressTrait = l;
cc._RF.pop();
}, {
"./TravelMosaicProgressComponent": "TravelMosaicProgressComponent"
} ]
}, {}, [ "TravelMosaicItemComponent", "TravelMosaicProgressComponent", "TravelMosaicProgressTrait" ]);
//# sourceMappingURL=index.js.map
