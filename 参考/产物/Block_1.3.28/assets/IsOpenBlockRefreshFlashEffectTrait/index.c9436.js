window.__require = function e(t, r, n) {
function o(f, a) {
if (!r[f]) {
if (!t[f]) {
var c = f.split("/");
c = c[c.length - 1];
if (!t[c]) {
var s = "function" == typeof __require && __require;
if (!a && s) return s(c, !0);
if (i) return i(c, !0);
throw new Error("Cannot find module '" + f + "'");
}
f = c;
}
var h = r[f] = {
exports: {}
};
t[f][0].call(h.exports, function(e) {
return o(t[f][1][e] || e);
}, h, h.exports, e, t, r, n);
}
return r[f].exports;
}
for (var i = "function" == typeof __require && __require, f = 0; f < n.length; f++) o(n[f]);
return o;
}({
IsOpenBlockRefreshFlashEffectTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "391a9AUpFRDIbLuFjvSgkKr", "IsOpenBlockRefreshFlashEffectTrait");
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
var o, i = arguments.length, f = i < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, r) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) f = Reflect.decorate(e, t, r, n); else for (var a = e.length - 1; a >= 0; a--) (o = e[a]) && (f = (i < 3 ? o(f) : i > 3 ? o(t, r, f) : o(t, r)) || f);
return i > 3 && f && Object.defineProperty(t, r, f), f;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.IsOpenBlockRefreshFlashEffectTrait = void 0;
var f = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._effectPrefab = null;
t._effNodeCache = [];
t._curAniName = "in1";
t.BUNDLE_NAME = "IsOpenBlockRefreshFlashEffectTrait";
t.URL = "prefabs/blockRefreshFlashEffect";
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "BoardEffect_Proxy",
methodName: "onGenerateEnd"
} ];
};
t.prototype.onActive = function(e) {
if (hs.tp.isBlocksProducerShowShaderAnim(e)) {
if (storage.getItem("classRoundNum", 0) <= 0) return;
var t = e.target;
this.showShaderAnim(e.args[0], e.args[1], t.shadersContainer);
e.replace = !0;
}
hs.tp.isBoardEffect_ProxyOnGenerateEnd(e) && (this._curAniName = "in1" == this._curAniName ? "in2" : "in1");
};
t.prototype.showShaderAnim = function(e, t, r) {
var n = this;
this._effectPrefab ? this.playDragonbonesAnim(e, t, r) : hs.ResLoader.loadByBundle("IsOpenBlockRefreshFlashEffectTrait", this.URL, cc.Prefab, function(o, i) {
if (!o) {
n._effectPrefab = i;
n.playDragonbonesAnim(e, t, r);
}
});
};
t.prototype.playDragonbonesAnim = function(e, t, r) {
var n = this, o = this._effNodeCache.shift();
if (!o) {
o = cc.instantiate(this._effectPrefab);
r.addChild(o);
}
o.opacity = 255;
var i = o.getComponent(dragonBones.ArmatureDisplay), f = 1 / (cc.director._kSpeed || 1);
i.timeScale = f;
i.playAnimation(this._curAniName, 1);
i.off(dragonBones.EventObject.COMPLETE);
i.on(dragonBones.EventObject.COMPLETE, function() {
if (o && cc.isValid(o)) {
o.opacity = 0;
n._effNodeCache.push(o);
}
}, null);
o.x = e;
o.y = t;
};
return i([ classId("IsOpenBlockRefreshFlashEffectTrait") ], t);
}(Trait);
r.IsOpenBlockRefreshFlashEffectTrait = f;
cc._RF.pop();
}, {} ]
}, {}, [ "IsOpenBlockRefreshFlashEffectTrait" ]);
//# sourceMappingURL=index.js.map
