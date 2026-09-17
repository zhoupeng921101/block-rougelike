window.__require = function t(r, o, e) {
function i(n, a) {
if (!o[n]) {
if (!r[n]) {
var s = n.split("/");
s = s[s.length - 1];
if (!r[s]) {
var c = "function" == typeof __require && __require;
if (!a && c) return c(s, !0);
if (l) return l(s, !0);
throw new Error("Cannot find module '" + n + "'");
}
n = s;
}
var f = o[n] = {
exports: {}
};
r[n][0].call(f.exports, function(t) {
return i(r[n][1][t] || t);
}, f, f.exports, t, r, o, e);
}
return o[n].exports;
}
for (var l = "function" == typeof __require && __require, n = 0; n < e.length; n++) i(e[n]);
return i;
}({
NoFailBlockTrait: [ function(t, r, o) {
"use strict";
cc._RF.push(r, "bf9d4w1qJhHyZiFBK7abxNs", "NoFailBlockTrait");
var e, i = this && this.__extends || (e = function(t, r) {
return (e = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, r) {
t.__proto__ = r;
} || function(t, r) {
for (var o in r) Object.prototype.hasOwnProperty.call(r, o) && (t[o] = r[o]);
})(t, r);
}, function(t, r) {
e(t, r);
function o() {
this.constructor = t;
}
t.prototype = null === r ? Object.create(r) : (o.prototype = r.prototype, new o());
}), l = this && this.__decorate || function(t, r, o, e) {
var i, l = arguments.length, n = l < 3 ? r : null === e ? e = Object.getOwnPropertyDescriptor(r, o) : e;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(t, r, o, e); else for (var a = t.length - 1; a >= 0; a--) (i = t[a]) && (n = (l < 3 ? i(n) : l > 3 ? i(r, o, n) : i(r, o)) || n);
return l > 3 && n && Object.defineProperty(r, o, n), n;
}, n = this && this.__read || function(t, r) {
var o = "function" == typeof Symbol && t[Symbol.iterator];
if (!o) return t;
var e, i, l = o.call(t), n = [];
try {
for (;(void 0 === r || r-- > 0) && !(e = l.next()).done; ) n.push(e.value);
} catch (t) {
i = {
error: t
};
} finally {
try {
e && !e.done && (o = l.return) && o.call(l);
} finally {
if (i) throw i.error;
}
}
return n;
}, a = this && this.__spread || function() {
for (var t = [], r = 0; r < arguments.length; r++) t = t.concat(n(arguments[r]));
return t;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.NoFailBlockTrait = void 0;
var s = function(t) {
i(r, t);
function r() {
var r = null !== t && t.apply(this, arguments) || this;
r.failBlockIds = [];
return r;
}
r.prototype.onActive = function(t) {
hs.tp.isClassGameOver_GameEnd_ProxyOnGameEnd(t) && this.recordFailBlocks();
hs.tp.isClassGame_Replay_ProxyOnGameReplay(t) && this.clearFailBlocks();
if (hs.tp.isAlgorithmProcessInfoHandleArgs(t)) {
if (hs.gameInfo.gameMode !== hs.GameMode.Class) return;
this.filterFailBlocksInAlgorithm(t);
}
};
r.prototype.recordFailBlocks = function() {
var t = hs.classBlocksProducerInfo.producerBlocks;
this.failBlockIds = t.filter(function(t) {
return -1 !== t;
});
};
r.prototype.filterFailBlocksInAlgorithm = function(t) {
var r, o, e, i;
if (hs.algorithmStrategyInfo.algorithmSourceLevel1 !== hs.ClassAlgorithmSourceType.AlgoRevive && hs.algorithmStrategyInfo.algorithmSourceLevel1 !== hs.ClassAlgorithmSourceType.AlgoReviveTrait) if (hs.classGameInfo.roundNum > (this.props.round || 3)) (null === (r = this.failBlockIds) || void 0 === r ? void 0 : r.length) && this.clearFailBlocks(); else if (null === (o = this.failBlockIds) || void 0 === o ? void 0 : o.length) {
var l = t.args[0];
if (!l) return;
l.filterWeightBlocks = Array.from(new Set(a(null !== (e = l.filterWeightBlocks) && void 0 !== e ? e : [], this.failBlockIds)));
l.filterBlocks = Array.from(new Set(a(null !== (i = l.filterBlocks) && void 0 !== i ? i : [], this.failBlockIds)));
}
};
r.prototype.clearFailBlocks = function() {
this.failBlockIds = [];
};
l([ hs.storageProperty({
key: "NoFailBlockTrait_failBlockIds"
}) ], r.prototype, "failBlockIds", void 0);
return l([ classId("NoFailBlockTrait") ], r);
}(Trait);
o.NoFailBlockTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "NoFailBlockTrait" ]);
//# sourceMappingURL=index.js.map
