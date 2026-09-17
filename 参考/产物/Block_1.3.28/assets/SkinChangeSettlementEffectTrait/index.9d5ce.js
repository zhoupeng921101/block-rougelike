window.__require = function t(e, n, o) {
function i(a, s) {
if (!n[a]) {
if (!e[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!e[c]) {
var l = "function" == typeof __require && __require;
if (!s && l) return l(c, !0);
if (r) return r(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var p = n[a] = {
exports: {}
};
e[a][0].call(p.exports, function(t) {
return i(e[a][1][t] || t);
}, p, p.exports, t, e, n, o);
}
return n[a].exports;
}
for (var r = "function" == typeof __require && __require, a = 0; a < o.length; a++) i(o[a]);
return i;
}({
SkinChangeMaskComponent: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "e9ebbVoI/9Hlr8dS8bLbuqq", "SkinChangeMaskComponent");
var o, i = this && this.__extends || (o = function(t, e) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
})(t, e);
}, function(t, e) {
o(t, e);
function n() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
}), r = this && this.__decorate || function(t, e, n, o) {
var i, r = arguments.length, a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o); else for (var s = t.length - 1; s >= 0; s--) (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
return r > 3 && a && Object.defineProperty(e, n, a), a;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
var a = cc._decorator, s = a.ccclass, c = a.property, l = function(t) {
i(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.maskSpriteFrame = null;
e._material = null;
return e;
}
e.prototype.onLoad = function() {
this._material = this.node.getComponent(cc.Sprite).getMaterial(0);
this._material.setProperty("x_mul", 1);
this._material.setProperty("y_mul", 1);
this._material.setProperty("texture_mask", this.maskSpriteFrame.getTexture());
};
e.prototype.render = function() {
this.updateMask(this.state.scale);
};
e.prototype.updateMask = function(t) {
var e = this.node.width, n = this.node.height, o = this.maskSpriteFrame.getOriginalSize().width * t / e, i = this.maskSpriteFrame.getOriginalSize().height * t / n;
this._material.setProperty("x_mul", o);
this._material.setProperty("y_mul", i);
};
r([ c(cc.SpriteFrame) ], e.prototype, "maskSpriteFrame", void 0);
return r([ s ], e);
}(hs.Component);
n.default = l;
cc._RF.pop();
}, {} ],
SkinChangeSettlementEffectComponent: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "1234emuMpFGsZhAfOjxAC3t", "SkinChangeSettlementEffectComponent");
var o, i = this && this.__extends || (o = function(t, e) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
})(t, e);
}, function(t, e) {
o(t, e);
function n() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
}), r = this && this.__decorate || function(t, e, n, o) {
var i, r = arguments.length, a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o); else for (var s = t.length - 1; s >= 0; s--) (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
return r > 3 && a && Object.defineProperty(e, n, a), a;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.SkinChangeSettlementEffectComponent = void 0;
var a = t("./SkinChangeMaskComponent"), s = cc._decorator, c = s.ccclass, l = s.property, p = function(t) {
i(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.winComponent = null;
e.failComponent = null;
e._obj = {
scale: 1
};
return e;
}
e.prototype.onLoad = function() {
this.winComponent.node.active = !1;
this.failComponent.node.active = !1;
};
e.prototype.render = function() {
if (this.state.show) this.playTween(); else {
cc.Tween.stopAllByTarget(this._obj);
this.winComponent.node.active = !1;
this.failComponent.node.active = !1;
}
};
e.prototype.playTween = function() {
var t;
this.winComponent.node.active = this.state.win;
this.failComponent.node.active = !this.state.win;
var e = this.state.win ? this.winComponent : this.failComponent;
e.setState({
scale: 1
});
cc.Tween.stopAllByTarget(this._obj);
cc.tween(this._obj).set({
scale: 1
}).to(1 * (null !== (t = cc.director._kSpeed) && void 0 !== t ? t : 1), {
scale: 6
}, {
progress: function(t, n, o, i) {
var r = t + (n - t) * i;
e.setState({
scale: r
});
return r;
}
}).call(function() {
e.setState({
scale: 6
});
}).start();
};
r([ l(a.default) ], e.prototype, "winComponent", void 0);
r([ l(a.default) ], e.prototype, "failComponent", void 0);
return r([ c ], e);
}(hs.Component);
n.SkinChangeSettlementEffectComponent = p;
cc._RF.pop();
}, {
"./SkinChangeMaskComponent": "SkinChangeMaskComponent"
} ],
SkinChangeSettlementEffectTrait: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "c503eF6uLNOmbea/IKCRZVG", "SkinChangeSettlementEffectTrait");
var o, i = this && this.__extends || (o = function(t, e) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
})(t, e);
}, function(t, e) {
o(t, e);
function n() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
}), r = this && this.__decorate || function(t, e, n, o) {
var i, r = arguments.length, a = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o); else for (var s = t.length - 1; s >= 0; s--) (i = t[s]) && (a = (r < 3 ? i(a) : r > 3 ? i(e, n, a) : i(e, n)) || a);
return r > 3 && a && Object.defineProperty(e, n, a), a;
}, a = this && this.__awaiter || function(t, e, n, o) {
return new (n || (n = Promise))(function(i, r) {
function a(t) {
try {
c(o.next(t));
} catch (t) {
r(t);
}
}
function s(t) {
try {
c(o.throw(t));
} catch (t) {
r(t);
}
}
function c(t) {
t.done ? i(t.value) : (e = t.value, e instanceof n ? e : new n(function(t) {
t(e);
})).then(a, s);
var e;
}
c((o = o.apply(t, e || [])).next());
});
}, s = this && this.__generator || function(t, e) {
var n, o, i, r, a = {
label: 0,
sent: function() {
if (1 & i[0]) throw i[1];
return i[1];
},
trys: [],
ops: []
};
return r = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function s(t) {
return function(e) {
return c([ t, e ]);
};
}
function c(r) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, o && (i = 2 & r[0] ? o.return : r[0] ? o.throw || ((i = o.return) && i.call(o), 
0) : o.next) && !(i = i.call(o, r[1])).done) return i;
(o = 0, i) && (r = [ 2 & r[0], i.value ]);
switch (r[0]) {
case 0:
case 1:
i = r;
break;

case 4:
a.label++;
return {
value: r[1],
done: !1
};

case 5:
a.label++;
o = r[1];
r = [ 0 ];
continue;

case 7:
r = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(i = a.trys, i = i.length > 0 && i[i.length - 1]) && (6 === r[0] || 2 === r[0])) {
a = 0;
continue;
}
if (3 === r[0] && (!i || r[1] > i[0] && r[1] < i[3])) {
a.label = r[1];
break;
}
if (6 === r[0] && a.label < i[1]) {
a.label = i[1];
i = r;
break;
}
if (i && a.label < i[2]) {
a.label = i[2];
a.ops.push(r);
break;
}
i[2] && a.ops.pop();
a.trys.pop();
continue;
}
r = e.call(t, a);
} catch (t) {
r = [ 6, t ];
o = 0;
} finally {
n = i = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.SkinChangeSettlementEffectTrait = void 0;
var c = t("./SkinChangeSettlementEffectComponent"), l = function(t) {
i(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.isSkinChange = !1;
e._container = null;
e._loading = !1;
e._initSkinId = 0;
return e;
}
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassWin",
methodName: "onDisable"
}, {
className: "ClassFail",
methodName: "onDisable"
} ];
};
e.prototype.onCreate = function() {
this.loadPrefab();
};
e.prototype.onActive = function(t) {
var e, n;
if (hs.tp.isClassGame_ProxyOnGameStart(t)) {
(null === (n = null === (e = t.args[0]) || void 0 === e ? void 0 : e.data) || void 0 === n ? void 0 : n.newGame) && (this.isSkinChange = !1);
this._initSkinId = Number(hs.skinInfo.currentSkinId);
}
if (hs.tp.isClassSkin_ProxyOnSkinReadyComplete(t)) {
var o = Number(hs.skinInfo.currentSkinId);
o != Number(hs.skinInfo.originSkinId) && o !== this._initSkinId && (this.isSkinChange = !0);
}
hs.tp.isClassWinTraitOnTweenScore(t) && this.isSkinChange && this.showEffect(t.target.node, !0);
hs.tp.isClassFailTraitOnTweenScore(t) && this.isSkinChange && this.showEffect(t.target.node, !1);
(hs.tp.isClassWinOnDisable(t) || hs.tp.isClassFailOnDisable(t)) && this.hideEffect();
};
e.prototype.loadPrefab = function() {
return a(this, void 0, void 0, function() {
var t;
return s(this, function(e) {
switch (e.label) {
case 0:
if (this._loading || cc.isValid(this._container)) return [ 2 ];
this._loading = !0;
return [ 4, hs.ResLoader.asyncLoadByBundle(this.traitName, "prefabs/skinChangeSettlementEffect", cc.Prefab) ];

case 1:
(t = e.sent()) && (this._container = cc.instantiate(t));
this._loading = !1;
return [ 2 ];
}
});
});
};
e.prototype.showEffect = function(t, e) {
if (cc.isValid(this._container)) {
t.parent !== this._container.parent && t.addChild(this._container);
this._container.setSiblingIndex(0);
this._container.getComponent(c.SkinChangeSettlementEffectComponent).setState({
win: e,
show: !0
});
} else this.loadPrefab();
};
e.prototype.hideEffect = function() {
cc.isValid(this._container) && this._container.parent && this._container.removeFromParent();
};
r([ hs.storageProperty({
key: "SkinChangeSettlementEffectKey"
}) ], e.prototype, "isSkinChange", void 0);
return r([ classId("SkinChangeSettlementEffectTrait") ], e);
}(Trait);
n.SkinChangeSettlementEffectTrait = l;
cc._RF.pop();
}, {
"./SkinChangeSettlementEffectComponent": "SkinChangeSettlementEffectComponent"
} ]
}, {}, [ "SkinChangeMaskComponent", "SkinChangeSettlementEffectComponent", "SkinChangeSettlementEffectTrait" ]);
//# sourceMappingURL=index.js.map
