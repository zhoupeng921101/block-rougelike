window.__require = function e(t, n, r) {
function o(a, s) {
if (!n[a]) {
if (!t[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!t[c]) {
var u = "function" == typeof __require && __require;
if (!s && u) return u(c, !0);
if (i) return i(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var h = n[a] = {
exports: {}
};
t[a][0].call(h.exports, function(e) {
return o(t[a][1][e] || e);
}, h, h.exports, e, t, n, r);
}
return n[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < r.length; a++) o(r[a]);
return o;
}({
ThreeSkinRandomOneTrait: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "6e320fFD89JOJvoyEEoCoK6", "ThreeSkinRandomOneTrait");
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
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, r); else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
return i > 3 && a && Object.defineProperty(t, n, a), a;
}, a = this && this.__awaiter || function(e, t, n, r) {
return new (n || (n = Promise))(function(o, i) {
function a(e) {
try {
c(r.next(e));
} catch (e) {
i(e);
}
}
function s(e) {
try {
c(r.throw(e));
} catch (e) {
i(e);
}
}
function c(e) {
e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, s);
var t;
}
c((r = r.apply(e, t || [])).next());
});
}, s = this && this.__generator || function(e, t) {
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
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
return this;
}), i;
function s(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(i) {
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
}, c = this && this.__read || function(e, t) {
var n = "function" == typeof Symbol && e[Symbol.iterator];
if (!n) return e;
var r, o, i = n.call(e), a = [];
try {
for (;(void 0 === t || t-- > 0) && !(r = i.next()).done; ) a.push(r.value);
} catch (e) {
o = {
error: e
};
} finally {
try {
r && !r.done && (n = i.return) && n.call(i);
} finally {
if (o) throw o.error;
}
}
return a;
}, u = this && this.__spread || function() {
for (var e = [], t = 0; t < arguments.length; t++) e = e.concat(c(arguments[t]));
return e;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.ThreeSkinRandomOneTrait = void 0;
var h = e("../components/ThreeSkinRandomOne"), l = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.usedIdAry = [];
t.skinPool = [];
return t;
}
t.prototype.onActive = function(e) {
var t = this;
hs.tp.isCleanSceneUseSequenceSkinTraitUpdateSkinPool(e) && (this.skinPool = e.args[0]);
if (hs.tp.isCleanSceneUseSequenceSkinTraitGetIsTrigger(e)) {
if (!this.getIsTrigger()) return;
e.returnValue = !1;
}
if (hs.tp.isClassBoardSplashAnimation_ProxySetBoardSplashAnimationState(e)) {
if (!this.getIsTrigger()) return;
if (storage.getItem("SetAddRandomSwitch_isClose", !1)) return;
if (!this.skinPool || this.skinPool.length <= 0) return;
setTimeoutSafe(function() {
t.showPopLayer();
}, 700);
}
};
t.prototype.getIsTrigger = function() {
return !0;
};
t.prototype.getSkinIdAry = function() {
var e = this;
this.usedIdAry.length <= 0 && (this.usedIdAry = storage.getItem("ThreeSkinRandomOne", []));
if (!this.skinPool || this.skinPool.length <= 0) return [];
var t = this.skinPool, n = parseInt(hs.skinInfo.originSkinId);
this.usedIdAry.push(Number(hs.skinInfo.currentSkinId));
storage.setItem("ThreeSkinRandomOne", this.usedIdAry);
var r = t.filter(function(t) {
return t.ID !== n && !e.usedIdAry.includes(t.ID);
});
if (r.length < 2) {
this.usedIdAry = [];
storage.setItem("ThreeSkinRandomOne", this.usedIdAry);
r = t.filter(function(t) {
return t.ID !== n && !e.usedIdAry.includes(t.ID);
});
}
if (r.length < 2) return 1 === r.length ? [ r[0].ID ] : [];
var o = [], i = u(r), a = Math.floor(Math.random() * i.length);
o.push(i[a].ID);
i.splice(a, 1);
var s = Math.floor(Math.random() * i.length);
o.push(i[s].ID);
return o;
};
t.prototype.showPopLayer = function() {
return a(this, void 0, void 0, function() {
var e, t, n;
return s(this, function(r) {
switch (r.label) {
case 0:
e = {
name: "ThreeSkinRandomOne",
url: "prefabs/ThreeSkinRandomOne",
bundleName: "ThreeSkinRandomOneTrait"
};
return [ 4, hs.UI.show(e, hs.gameAlertLayer) ];

case 1:
t = r.sent();
(n = t.getComponent(h.default)) && n.setState({
idAry: this.getSkinIdAry()
});
return [ 2 ];
}
});
});
};
return i([ classId("ThreeSkinRandomOneTrait"), classMethodWatch() ], t);
}(Trait);
n.ThreeSkinRandomOneTrait = l;
cc._RF.pop();
}, {
"../components/ThreeSkinRandomOne": "ThreeSkinRandomOne"
} ],
ThreeSkinRandomOne: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "85026/RymRKv67o11Ba45DY", "ThreeSkinRandomOne");
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
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, r); else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
return i > 3 && a && Object.defineProperty(t, n, a), a;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
var a = cc._decorator, s = a.ccclass, c = a.property, u = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.askImg = null;
t.bg = null;
t.iconAry = [];
t.effect = null;
t.atlas = null;
return t;
}
t.prototype.onLoad = function() {};
t.prototype.render = function() {
var e = storage.getItem("SetAddRandomSwitch_isClose", !1);
this.askImg.active = e;
this.onThreeSkinRandomOneRender(this.bg);
this.freshFristIcon(this.node, this.atlas, this.iconAry[0]);
this.freshIconImg();
this.bg.scaleX = 1;
this.bg.scaleY = 0;
this.bg.opacity = 0;
this.effect.playAnimation("animation", 1);
cc.tween(this.bg).parallel(cc.tween().to(.27, {
scaleX: 1,
scaleY: 1
}), cc.tween().to(.3, {
opacity: 255
})).start();
};
t.prototype.getSkinResourceName = function(e) {
var t = e.toString();
return t.length >= 3 ? t.slice(-3) : t;
};
t.prototype.freshFristIcon = function() {};
t.prototype.freshIconImg = function() {
if (this.state.idAry && 0 !== this.state.idAry.length) for (var e = 0; e < this.iconAry.length; e++) {
var t = this.iconAry[e], n = this.state.idAry[e];
if (cc.isValid(t) && n) {
var r = "skin_" + this.getSkinResourceName(n);
if (this.atlas) {
var o = this.atlas.getSpriteFrame(r);
o && (t.spriteFrame = o);
}
}
}
};
t.prototype.onConfirmClick = function(e, t) {
if (1 == t) this.firstSkinClick(hs.skinInfo.originSkinId); else {
var n = this.state.idAry[t - 2];
n && hs.EventManager.dispatchModuleEvent(new hs.E_Skin_Update(n.toString()));
}
this.closeDialog();
};
t.prototype.firstSkinClick = function(e) {
hs.EventManager.dispatchModuleEvent(new hs.E_Skin_Update(e));
};
t.prototype.onAskClick = function() {
storage.setItem("SetAddRandomSwitch_isClose", !this.askImg.active);
this.askImg.active = !this.askImg.active;
};
t.prototype.closeDialog = function() {
hs.UI.hideUI({
name: "ThreeSkinRandomOne",
url: "prefabs/ThreeSkinRandomOne",
bundleName: "ThreeSkinRandomOneTrait"
});
};
t.prototype.onThreeSkinRandomOneRender = function() {};
i([ c(cc.Node) ], t.prototype, "askImg", void 0);
i([ c(cc.Node) ], t.prototype, "bg", void 0);
i([ c(cc.Sprite) ], t.prototype, "iconAry", void 0);
i([ c(dragonBones.ArmatureDisplay) ], t.prototype, "effect", void 0);
i([ c(cc.SpriteAtlas) ], t.prototype, "atlas", void 0);
return i([ classId("ThreeSkinRandomOne"), s, classMethodWatch() ], t);
}(hs.Component);
n.default = u;
cc._RF.pop();
}, {} ]
}, {}, [ "ThreeSkinRandomOne", "ThreeSkinRandomOneTrait" ]);
//# sourceMappingURL=index.js.map
