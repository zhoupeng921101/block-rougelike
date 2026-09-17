window.__require = function t(o, r, e) {
function n(i, u) {
if (!r[i]) {
if (!o[i]) {
var a = i.split("/");
a = a[a.length - 1];
if (!o[a]) {
var l = "function" == typeof __require && __require;
if (!u && l) return l(a, !0);
if (c) return c(a, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = a;
}
var f = r[i] = {
exports: {}
};
o[i][0].call(f.exports, function(t) {
return n(o[i][1][t] || t);
}, f, f.exports, t, o, r, e);
}
return r[i].exports;
}
for (var c = "function" == typeof __require && __require, i = 0; i < e.length; i++) n(e[i]);
return n;
}({
BlockBackPlayAudioTrait: [ function(t, o, r) {
"use strict";
cc._RF.push(o, "8dfb4UU3/NDz5PHr59zRQtO", "BlockBackPlayAudioTrait");
var e, n = this && this.__extends || (e = function(t, o) {
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
}), c = this && this.__decorate || function(t, o, r, e) {
var n, c = arguments.length, i = c < 3 ? o : null === e ? e = Object.getOwnPropertyDescriptor(o, r) : e;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(t, o, r, e); else for (var u = t.length - 1; u >= 0; u--) (n = t[u]) && (i = (c < 3 ? n(i) : c > 3 ? n(o, r, i) : n(o, r)) || i);
return c > 3 && i && Object.defineProperty(o, r, i), i;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.BlockBackPlayAudioTrait = void 0;
var i = function(t) {
n(o, t);
function o() {
return null !== t && t.apply(this, arguments) || this;
}
o.prototype.onActive = function(t) {
hs.tp.isBlocksProducerTouchBackBlocks(t) && this.onBackBlocks(t);
};
o.prototype.onBackBlocks = function() {
hs.audioInfo.play(hs.AudioConfig.BlockReturn);
};
return c([ classId("BlockBackPlayAudioTrait") ], o);
}(Trait);
r.BlockBackPlayAudioTrait = i;
cc._RF.pop();
}, {} ]
}, {}, [ "BlockBackPlayAudioTrait" ]);
//# sourceMappingURL=index.js.map
