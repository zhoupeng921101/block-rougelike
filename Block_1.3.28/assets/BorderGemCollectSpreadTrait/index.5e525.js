window.__require = function e(t, r, o) {
function n(a, c) {
if (!r[a]) {
if (!t[a]) {
var l = a.split("/");
l = l[l.length - 1];
if (!t[l]) {
var p = "function" == typeof __require && __require;
if (!c && p) return p(l, !0);
if (i) return i(l, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = l;
}
var s = r[a] = {
exports: {}
};
t[a][0].call(s.exports, function(e) {
return n(t[a][1][e] || e);
}, s, s.exports, e, t, r, o);
}
return r[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < o.length; a++) n(o[a]);
return n;
}({
BorderGemCollectSpreadTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "5a65dJohD5GPIG6gSHPdsXZ", "BorderGemCollectSpreadTrait");
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
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, o); else for (var c = e.length - 1; c >= 0; c--) (n = e[c]) && (a = (i < 3 ? n(a) : i > 3 ? n(t, r, a) : n(t, r)) || a);
return i > 3 && a && Object.defineProperty(t, r, a), a;
}, a = this && this.__awaiter || function(e, t, r, o) {
return new (r || (r = Promise))(function(n, i) {
function a(e) {
try {
l(o.next(e));
} catch (e) {
i(e);
}
}
function c(e) {
try {
l(o.throw(e));
} catch (e) {
i(e);
}
}
function l(e) {
e.done ? n(e.value) : (t = e.value, t instanceof r ? t : new r(function(e) {
e(t);
})).then(a, c);
var t;
}
l((o = o.apply(e, t || [])).next());
});
}, c = this && this.__generator || function(e, t) {
var r, o, n, i, a = {
label: 0,
sent: function() {
if (1 & n[0]) throw n[1];
return n[1];
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
return l([ e, t ]);
};
}
function l(i) {
if (r) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (r = 1, o && (n = 2 & i[0] ? o.return : i[0] ? o.throw || ((n = o.return) && n.call(o), 
0) : o.next) && !(n = n.call(o, i[1])).done) return n;
(o = 0, n) && (i = [ 2 & i[0], n.value ]);
switch (i[0]) {
case 0:
case 1:
n = i;
break;

case 4:
a.label++;
return {
value: i[1],
done: !1
};

case 5:
a.label++;
o = i[1];
i = [ 0 ];
continue;

case 7:
i = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(n = a.trys, n = n.length > 0 && n[n.length - 1]) && (6 === i[0] || 2 === i[0])) {
a = 0;
continue;
}
if (3 === i[0] && (!n || i[1] > n[0] && i[1] < n[3])) {
a.label = i[1];
break;
}
if (6 === i[0] && a.label < n[1]) {
a.label = n[1];
n = i;
break;
}
if (n && a.label < n[2]) {
a.label = n[2];
a.ops.push(i);
break;
}
n[2] && a.ops.pop();
a.trys.pop();
continue;
}
i = t.call(e, a);
} catch (e) {
i = [ 6, e ];
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
r.BorderGemCollectSpreadTrait = void 0;
var l = e("./components/ChapterCollectGemSpreadEffect"), p = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._effectComponent = null;
return t;
}
t.prototype.onActive = function(e) {
var t, r, o;
return a(this, void 0, void 0, function() {
var n, i, a;
return c(this, function(c) {
switch (c.label) {
case 0:
if (hs.tp.isChapterCollect_ProxyOnGameStart(e)) {
n = null === (t = null == e ? void 0 : e.args) || void 0 === t ? void 0 : t[0];
null !== (o = null === (r = null == n ? void 0 : n.data) || void 0 === r ? void 0 : r.newGame) && void 0 !== o && o && storage.setItem("chapterBorderGemCollectSpreadNum", 0);
}
return hs.tp.isChapterGame_ProxyOnChapterGameShow(e) ? hs.chapterGameInfo.chapterCondition.Way !== hs.ChapterType.collect ? [ 2 ] : [ 4, this.loadEffectPrefab(e) ] : [ 3, 2 ];

case 1:
c.sent();
c.label = 2;

case 2:
if (hs.tp.isChapterTopInfo_CollectEffect_ProxyShowBoardAnim(e)) {
i = hs.chapterCollectInfo.getAllCollectNum();
a = storage.getItem("chapterBorderGemCollectSpreadNum", 0);
i - a >= 6 && this.playEffect();
storage.setItem("chapterBorderGemCollectSpreadNum", i);
}
return [ 2 ];
}
});
});
};
t.prototype.loadEffectPrefab = function(e) {
return a(this, void 0, Promise, function() {
var t, r, o;
return c(this, function(n) {
switch (n.label) {
case 0:
t = e.args[0].boardContainer;
return cc.isValid(t) ? this._effectComponent ? [ 2 ] : [ 4, hs.ResLoader.asyncLoadByBundle("BorderGemCollectSpreadTrait", "prefabs/BorderGemCollectSpread", cc.Prefab) ] : [ 2 ];

case 1:
r = n.sent();
if (!cc.isValid(r)) return [ 2 ];
(o = cc.instantiate(r)).name = "BorderGemCollectSpread";
o.setParent(t);
o.zIndex = 500;
o.active = !1;
this._effectComponent = o.getComponent(l.default);
return [ 2 ];
}
});
});
};
t.prototype.playEffect = function() {
this._effectComponent && this._effectComponent.setState({
play: !0
});
};
return i([ classId("BorderGemCollectSpreadTrait") ], t);
}(Trait);
r.BorderGemCollectSpreadTrait = p;
cc._RF.pop();
}, {
"./components/ChapterCollectGemSpreadEffect": "ChapterCollectGemSpreadEffect"
} ],
ChapterCollectGemSpreadEffect: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "b07e9MdMCdIyYl7nynp6OxE", "ChapterCollectGemSpreadEffect");
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
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, o); else for (var c = e.length - 1; c >= 0; c--) (n = e[c]) && (a = (i < 3 ? n(a) : i > 3 ? n(t, r, a) : n(t, r)) || a);
return i > 3 && a && Object.defineProperty(t, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var a = cc._decorator, c = a.ccclass, l = a.property, p = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.dragon = null;
t.isPlaying = !1;
return t;
}
t.prototype.onEnable = function() {
this.dragon && this.dragon.addEventListener(dragonBones.EventObject.COMPLETE, this.onAnimationCompleteHandler, this);
};
t.prototype.onDisable = function() {
this.dragon && this.dragon.removeEventListener(dragonBones.EventObject.COMPLETE, this.onAnimationCompleteHandler, this);
};
t.prototype.render = function() {
if (this.state.play) {
if (this.isPlaying) return;
this.isPlaying = !0;
this.node.active = !0;
this.dragon.playAnimation("in", 1);
}
};
t.prototype.onAnimationCompleteHandler = function() {
cc.isValid(this.node) && (this.node.active = !1);
this.isPlaying = !1;
};
i([ l(dragonBones.ArmatureDisplay) ], t.prototype, "dragon", void 0);
return i([ c ], t);
}(hs.Component);
r.default = p;
cc._RF.pop();
}, {} ]
}, {}, [ "BorderGemCollectSpreadTrait", "ChapterCollectGemSpreadEffect" ]);
//# sourceMappingURL=index.js.map
