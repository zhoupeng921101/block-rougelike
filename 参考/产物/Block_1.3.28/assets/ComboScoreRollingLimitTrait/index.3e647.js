window.__require = function e(t, r, o) {
function i(a, l) {
if (!r[a]) {
if (!t[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!t[c]) {
var s = "function" == typeof __require && __require;
if (!l && s) return s(c, !0);
if (n) return n(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var u = r[a] = {
exports: {}
};
t[a][0].call(u.exports, function(e) {
return i(t[a][1][e] || e);
}, u, u.exports, e, t, r, o);
}
return r[a].exports;
}
for (var n = "function" == typeof __require && __require, a = 0; a < o.length; a++) i(o[a]);
return i;
}({
ComboScoreRollingLimitTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "34d6ajY35RLj5zuqoaO3F95", "ComboScoreRollingLimitTrait");
var o, i = this && this.__extends || (o = function(e, t) {
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
}), n = this && this.__decorate || function(e, t, r, o) {
var i, n = arguments.length, a = n < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, r, o); else for (var l = e.length - 1; l >= 0; l--) (i = e[l]) && (a = (n < 3 ? i(a) : n > 3 ? i(t, r, a) : i(t, r)) || a);
return n > 3 && a && Object.defineProperty(t, r, a), a;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ComboScoreRollingLimitTrait = void 0;
var a = function(e) {
i(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.registerTraitEventsMethods = function() {
return [];
};
t.prototype.onActive = function(e) {
if (hs.gameInfo.gameMode === hs.GameMode.Class) {
if (hs.tp.isClassTopInfoUpdateScoreCurrentScoreWithAnimation(e)) {
var t = (i = e.target).state, r = e.args[1], o = t.currentScore;
if (null == o || o === r) return;
this.handleScoreRolling({
com: i,
dataInfo: t,
startValue: r,
endValue: o,
intervalIdKey: "curScoreIntervalId",
labelNodeKey: "curScore",
labelSetter: "setScoreLabel",
logLabel: "当前分滚动",
initialStep: 1
});
e.replace = !0;
}
if (hs.tp.isClassTopInfoUpdateScoreHighScoreWithAnimation(e)) {
t = (i = e.target).state;
var i, n = e.args[1], a = t.highScore;
if (null == a || a === n) return;
this.handleScoreRolling({
com: i,
dataInfo: t,
startValue: n,
endValue: a,
intervalIdKey: "highScoreIntervalId",
labelNodeKey: "highScore",
labelSetter: "setHighScoreLabel",
logLabel: "最高分滚动",
initialStep: 0
});
e.replace = !0;
}
}
};
t.prototype.handleScoreRolling = function(e) {
var t = e.com, r = e.dataInfo, o = e.startValue, i = e.endValue, n = e.intervalIdKey, a = e.labelNodeKey, l = e.labelSetter, c = (e.logLabel, 
e.initialStep);
r.oneScoreRollingTime = .2;
var s = i - o, u = Math.min(.2, s * r.oneScoreRollingTime);
u < 0 && (u = 0);
var f = 1e3 * r.oneScoreRollingTime;
f = f > 2 ? f : 2;
var p = s, h = Math.max(Math.floor(u / .002), 1), d = (i - o) / (p = p > h ? h : p), m = this.props && "number" == typeof this.props.maxTime ? this.props.maxTime : 1e3, g = Math.max(500, Math.min(3e3, m)), v = p * f;
if (v > g && p > 0) {
var S = g / v;
f = Math.max(2, f * S);
v = p * f;
}
var _ = o, b = c, y = n;
if (t[y]) {
clearInterval(t[y]);
t[y] = null;
}
t[y] = setInterval(function() {
if (++b >= p) {
clearInterval(t[y]);
t[y] = null;
cc.isValid(t[a]) && t[l](i);
} else if (cc.isValid(t[a])) {
_ += d;
t[l](Math.floor(_));
} else {
clearInterval(t[y]);
t[y] = null;
}
}, f);
};
return n([ classId("ComboScoreRollingLimitTrait") ], t);
}(Trait);
r.ComboScoreRollingLimitTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "ComboScoreRollingLimitTrait" ]);
//# sourceMappingURL=index.js.map
