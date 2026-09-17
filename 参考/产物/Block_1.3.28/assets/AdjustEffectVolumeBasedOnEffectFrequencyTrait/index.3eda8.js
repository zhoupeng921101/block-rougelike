window.__require = function e(t, o, i) {
function n(a, s) {
if (!o[a]) {
if (!t[a]) {
var f = a.split("/");
f = f[f.length - 1];
if (!t[f]) {
var u = "function" == typeof __require && __require;
if (!s && u) return u(f, !0);
if (r) return r(f, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = f;
}
var c = o[a] = {
exports: {}
};
t[a][0].call(c.exports, function(e) {
return n(t[a][1][e] || e);
}, c, c.exports, e, t, o, i);
}
return o[a].exports;
}
for (var r = "function" == typeof __require && __require, a = 0; a < i.length; a++) n(i[a]);
return n;
}({
AdjustEffectVolumeBasedOnEffectFrequencyTrait: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "05e0fRUuwtMUq6LQSD0SMtN", "AdjustEffectVolumeBasedOnEffectFrequencyTrait");
var i, n = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
})(e, t);
}, function(e, t) {
i(e, t);
function o() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
}), r = this && this.__decorate || function(e, t, o, i) {
var n, r = arguments.length, a = r < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, o) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, o, i); else for (var s = e.length - 1; s >= 0; s--) (n = e[s]) && (a = (r < 3 ? n(a) : r > 3 ? n(t, o, a) : n(t, o)) || a);
return r > 3 && a && Object.defineProperty(t, o, a), a;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.AdjustEffectVolumeBasedOnEffectFrequencyTrait = void 0;
var a = [ 30, 180, 600, Infinity ], s = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._isInitialized = !1;
t._isPlaying = !1;
t._gameStartTime = 0;
t._effectArray = [];
t._comboCount = 0;
t._effectStartIndex = 0;
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassGame_Proxy",
methodName: "onClassGameStart"
}, {
className: "ClassGame_Proxy",
methodName: "onGameBackHome"
}, {
className: "Audio_Proxy",
methodName: "onGameInitComplete"
}, {
className: "ClassEliminate_Sound_Proxy",
methodName: "playEliminateSound"
} ];
};
t.prototype.onActive = function(e) {
var t, o, i;
if (hs.tp.isClassGame_ProxyOnClassGameStart(e)) {
this._isPlaying = !0;
this._gameStartTime = Date.now();
this._effectArray.length = 0;
this._effectStartIndex = 0;
}
if (hs.tp.isClassGame_ProxyOnGameBackHome(e)) {
this._isPlaying = !1;
this._comboCount = 0;
}
hs.tp.isAudio_ProxyOnGameInitComplete(e) && this._initialize();
if (hs.tp.isClassEliminate_Sound_ProxyPlayEliminateSound(e)) {
var n = null !== (i = null === (o = null === (t = e.args[0]) || void 0 === t ? void 0 : t.state) || void 0 === o ? void 0 : o.continuousEliminateTimes) && void 0 !== i ? i : 1;
this._comboCount = n - 1;
}
};
t.prototype._initialize = function() {
if (!1 === this._isInitialized) {
this._isInitialized = !0;
hs.audioInfo.onBeforePlay(this._onBeforePlay.bind(this));
}
};
t.prototype._onBeforePlay = function(e) {
if (!1 !== this._isPlaying && hs.gameInfo.gameType === hs.GameType.Class && e.type == hs.AudioType.EFFECT) {
var t = Date.now(), o = e.clip.name, i = this._getEffectCount(t), n = (t - this._gameStartTime) / 1e3;
n < a[0] || (n < a[1] ? i >= 6 && ("Unbelievable2" === o ? e.volume *= 1.2 : o.includes("e_score_streak") && this._comboCount > 0 && this._comboCount % 5 == 0 && (e.volume *= 1.2)) : n < a[2] ? i >= 6 && ("Unbelievable2" === o ? e.volume *= 1.1 : o.includes("e_score_streak") && this._comboCount % 5 != 0 && (e.volume *= .85)) : n < a[3] && "Unbelievable2" !== o && (e.volume *= .85));
this._effectArray.push(t);
}
};
t.prototype._getEffectCount = function(e) {
this._effectArray = this._effectArray.filter(function(t) {
return e - t <= 3e4;
});
return this._effectArray.length;
};
return r([ classId("AdjustEffectVolumeBasedOnEffectFrequencyTrait") ], t);
}(Trait);
o.AdjustEffectVolumeBasedOnEffectFrequencyTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "AdjustEffectVolumeBasedOnEffectFrequencyTrait" ]);
//# sourceMappingURL=index.js.map
