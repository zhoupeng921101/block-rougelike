window.__require = function t(e, r, o) {
function n(c, s) {
if (!r[c]) {
if (!e[c]) {
var u = c.split("/");
u = u[u.length - 1];
if (!e[u]) {
var a = "function" == typeof __require && __require;
if (!s && a) return a(u, !0);
if (i) return i(u, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = u;
}
var l = r[c] = {
exports: {}
};
e[c][0].call(l.exports, function(t) {
return n(e[c][1][t] || t);
}, l, l.exports, t, e, r, o);
}
return r[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < o.length; c++) n(o[c]);
return n;
}({
ReturnToRegionSlotTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "b85977hRaRFDpWB/veJCsEN", "ReturnToRegionSlotTrait");
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
var n, i = arguments.length, c = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, r, o); else for (var s = t.length - 1; s >= 0; s--) (n = t[s]) && (c = (i < 3 ? n(c) : i > 3 ? n(e, r, c) : n(e, r)) || c);
return i > 3 && c && Object.defineProperty(e, r, c), c;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ReturnToRegionSlotTrait = void 0;
var c = function(t) {
n(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.registerTraitEventsMethods = function() {
return [];
};
e.prototype.onActive = function(t) {
if (hs.gameInfo.gameMode === hs.GameMode.Class && hs.tp.isBlocksProducerTouchBackBlocks(t)) {
var e = t, r = e.target, o = r._selectItem, n = r._selectIndex;
if (!o || null == n) return;
var i = Number.isFinite(r._targetPosX) ? r._targetPosX : o.x, c = 1;
i < -140 ? c = 0 : i > 140 && (c = 2);
var s = -1 === (r._producerBlocks || [ -1, -1, -1 ])[c] || c === n ? c : n;
r.resetBlocksOriPos(o, s);
r._selectIndex = s;
var u = o.getComponent(hs.BlocksProducerItem);
u && u.state && (u.state.index = s);
try {
var a = r._producerBlocks || [];
if (Array.isArray(a) && n !== s) {
var l = a[n];
if (void 0 !== l && -1 !== l && -1 === a[s]) {
a[s] = l;
a[n] = -1;
storage.setItem("classProducerBlocks", a);
}
}
} catch (t) {}
e.returnState = !0;
}
};
return i([ classId("ReturnToRegionSlotTrait") ], e);
}(Trait);
r.ReturnToRegionSlotTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "ReturnToRegionSlotTrait" ]);
//# sourceMappingURL=index.js.map
