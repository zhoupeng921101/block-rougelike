window.__require = function e(t, r, n) {
function o(a, c) {
if (!r[a]) {
if (!t[a]) {
var s = a.split("/");
s = s[s.length - 1];
if (!t[s]) {
var l = "function" == typeof __require && __require;
if (!c && l) return l(s, !0);
if (i) return i(s, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = s;
}
var u = r[a] = {
exports: {}
};
t[a][0].call(u.exports, function(e) {
return o(t[a][1][e] || e);
}, u, u.exports, e, t, r, n);
}
return r[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < n.length; a++) o(n[a]);
return o;
}({
LightColorSkinEnlargeBlockChangeShadowTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "7146bxABmpEuY1Ezdl+yzPW", "LightColorSkinEnlargeBlockChangeShadowTrait");
var n, o = this && this.__extends || (n = function(e, t) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
n(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), i = this && this.__decorate || function(e, t, r, n) {
var o, i = arguments.length, a = i < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, r) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, n); else for (var c = e.length - 1; c >= 0; c--) (o = e[c]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, r, a) : o(t, r)) || a);
return i > 3 && a && Object.defineProperty(t, r, a), a;
}, a = this && this.__awaiter || function(e, t, r, n) {
return new (r || (r = Promise))(function(o, i) {
function a(e) {
try {
s(n.next(e));
} catch (e) {
i(e);
}
}
function c(e) {
try {
s(n.throw(e));
} catch (e) {
i(e);
}
}
function s(e) {
e.done ? o(e.value) : (t = e.value, t instanceof r ? t : new r(function(e) {
e(t);
})).then(a, c);
var t;
}
s((n = n.apply(e, t || [])).next());
});
}, c = this && this.__generator || function(e, t) {
var r, n, o, i, a = {
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
if (r) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (r = 1, n && (o = 2 & i[0] ? n.return : i[0] ? n.throw || ((o = n.return) && o.call(n), 
0) : n.next) && !(o = o.call(n, i[1])).done) return o;
(n = 0, o) && (i = [ 2 & i[0], o.value ]);
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
n = i[1];
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
n = 0;
} finally {
r = o = 0;
}
if (5 & i[0]) throw i[1];
return {
value: i[0] ? i[1] : void 0,
done: !0
};
}
}, s = this && this.__values || function(e) {
var t = "function" == typeof Symbol && Symbol.iterator, r = t && e[t], n = 0;
if (r) return r.call(e);
if (e && "number" == typeof e.length) return {
next: function() {
e && n >= e.length && (e = void 0);
return {
value: e && e[n++],
done: !e
};
}
};
throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.LightColorSkinEnlargeBlockChangeShadowTrait = void 0;
var l = [ 1001, 1025, 1034, 1024, 1033, 1002, 1036, 1027, 1014, 1016, 1038, 1018, 1026, 1035, 1011, 1012, 1015, 1028, 1029 ], u = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._cachedSpriteFrame = null;
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "BlocksProducerItem",
methodName: "setShadowSprite"
}, {
className: "IsOpenChangeSkinTrait",
methodName: "setBlockShadowMaterial"
}, {
className: "BlocksProducer",
methodName: "playBlockAppearAnimation"
}, {
className: "BlocksProducerTouch",
methodName: "resetBlocksOriPos"
} ];
};
t.prototype.onActive = function(e) {
return a(this, void 0, void 0, function() {
var t, r, n, o, i;
return c(this, function() {
if (hs.tp.isBlocksProducerItemSetShadowSprite(e) && this.isLightColorSkin) {
t = e.args[0];
this._replaceProducerShadow(e, t);
}
hs.tp.isIsOpenChangeSkinTraitSetBlockShadowMaterial(e) && this._replaceChangeSkinShadow(e);
if (hs.tp.isBlocksProducerPlayBlockAppearAnimation(e) && this.isLightColorSkin) {
r = e.args[0];
n = e.args[2];
this._playBlockAppearScaleAnimation(e, r, n);
}
if (hs.tp.isBlocksProducerTouchResetBlocksOriPos(e) && this.isLightColorSkin) {
o = e.args[0];
i = e.args[1];
this._resetBlocksOriPos(e, o, i);
}
return [ 2 ];
});
});
};
t.prototype._replaceProducerShadow = function(e, t) {
return a(this, void 0, void 0, function() {
var r;
return c(this, function(n) {
switch (n.label) {
case 0:
return [ 4, this._getShadowSpriteFrame() ];

case 1:
r = n.sent();
if (t && t.shadow && r) {
e.replace = !0;
t.shadow.spriteFrame = r;
t.shadow.node.x = t.shadow.node.y = 0;
t.shadow.node.opacity = 255;
}
return [ 2 ];
}
});
});
};
t.prototype._replaceChangeSkinShadow = function(e) {
return a(this, void 0, void 0, function() {
var t, r, n, o, i, a, l, u, h, p, f, d, y, g, S, w;
return c(this, function(c) {
switch (c.label) {
case 0:
t = this.isLightColorSkin;
r = Cinst(hs.BlocksProducer);
if (!cc.isValid(r)) return [ 3, 14 ];
e.replace = t;
c.label = 1;

case 1:
c.trys.push([ 1, 12, 13, 14 ]);
n = s(r.blocksContainer.children), o = n.next();
c.label = 2;

case 2:
if (o.done) return [ 3, 11 ];
i = o.value;
if (!cc.isValid(i)) return [ 3, 10 ];
i.scale = t ? this.scale : .45;
c.label = 3;

case 3:
c.trys.push([ 3, 8, 9, 10 ]);
a = (S = void 0, s(i.children)), l = a.next();
c.label = 4;

case 4:
if (l.done) return [ 3, 7 ];
u = l.value;
if (!cc.isValid(u)) return [ 3, 6 ];
h = u.getComponent(hs.Block).shadow;
return [ 4, this._getShadowSpriteFrame() ];

case 5:
p = c.sent();
if (cc.isValid(h) && cc.isValid(p)) {
t ? h.spriteFrame = p : hs.ResLoader.renderSprite(h, hs.ResUrlType.SHADOW);
h.node.x = t ? 0 : 20;
h.node.y = t ? 0 : -20;
h.node.opacity = t ? 255 : h.node.opacity;
}
c.label = 6;

case 6:
l = a.next();
return [ 3, 4 ];

case 7:
return [ 3, 10 ];

case 8:
f = c.sent();
S = {
error: f
};
return [ 3, 10 ];

case 9:
try {
l && !l.done && (w = a.return) && w.call(a);
} finally {
if (S) throw S.error;
}
return [ 7 ];

case 10:
o = n.next();
return [ 3, 2 ];

case 11:
return [ 3, 14 ];

case 12:
d = c.sent();
y = {
error: d
};
return [ 3, 14 ];

case 13:
try {
o && !o.done && (g = n.return) && g.call(n);
} finally {
if (y) throw y.error;
}
return [ 7 ];

case 14:
return [ 2 ];
}
});
});
};
t.prototype._playBlockAppearScaleAnimation = function(e, t, r) {
if (cc.isValid(t) && "function" == typeof r) {
e.replace = !0;
cc.tween(t).to(.16, {
scale: this.scale,
opacity: 255
}).call(function() {
r();
}).start();
}
};
t.prototype._resetBlocksOriPos = function(e, t, r) {
if (cc.isValid(t)) {
e.replace = !0;
var n = t, o = this.scale;
n.scaleX = n.scaleY = o;
n.x = 280 * (r - 1);
n.y = 0;
var i = n.getComponent(hs.BlocksProducerItem);
if (cc.isValid(i)) for (var a = 0; a < i.caches.length; a++) {
var c = i.caches[a].getComponent(hs.Block);
if (cc.isValid(c) && cc.isValid(c.shadow)) {
c.shadow.node.opacity = 255;
c.shadow.node.scale = 1;
}
}
}
};
Object.defineProperty(t.prototype, "scale", {
get: function() {
return .9 * this.props.side / 106;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "isLightColorSkin", {
get: function() {
var e = Number(hs.skinInfo.currentSkinId);
return l.includes(e);
},
enumerable: !1,
configurable: !0
});
t.prototype._getShadowSpriteFrame = function() {
return a(this, void 0, Promise, function() {
var e;
return c(this, function(t) {
switch (t.label) {
case 0:
if (this._cachedSpriteFrame) return [ 3, 2 ];
e = this;
return [ 4, hs.ResLoader.asyncLoadByBundle("LightColorSkinEnlargeBlockChangeShadowTrait", "textures/bg", cc.SpriteFrame) ];

case 1:
e._cachedSpriteFrame = t.sent();
t.label = 2;

case 2:
return [ 2, this._cachedSpriteFrame ];
}
});
});
};
return i([ classId("LightColorSkinEnlargeBlockChangeShadowTrait") ], t);
}(Trait);
r.LightColorSkinEnlargeBlockChangeShadowTrait = u;
cc._RF.pop();
}, {} ]
}, {}, [ "LightColorSkinEnlargeBlockChangeShadowTrait" ]);
//# sourceMappingURL=index.js.map
