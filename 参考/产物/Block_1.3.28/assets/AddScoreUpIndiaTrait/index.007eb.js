window.__require = function t(e, r, o) {
function n(c, s) {
if (!r[c]) {
if (!e[c]) {
var a = c.split("/");
a = a[a.length - 1];
if (!e[a]) {
var p = "function" == typeof __require && __require;
if (!s && p) return p(a, !0);
if (i) return i(a, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = a;
}
var u = r[c] = {
exports: {}
};
e[c][0].call(u.exports, function(t) {
return n(e[c][1][t] || t);
}, u, u.exports, t, e, r, o);
}
return r[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < o.length; c++) n(o[c]);
return n;
}({
AddScoreUpIndiaTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "07218ZT29dBEa6aLAV03lE+", "AddScoreUpIndiaTrait");
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
r.AddScoreUpIndiaTrait = void 0;
var c = function(t) {
n(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.onActive = function(t) {
hs.tp.isClassGameOver_GameEnd_ProxyOnGameEnd(t) && this.send(hs.scoreInfo.score, hs.scoreInfo.highScore);
hs.tp.isChapterGameOver_GameEnd_ProxyOnGameOver(t) && this.send(0, 0);
};
e.prototype.send = function(t, e) {
this.isTrigger() && hs.HActivityCommon.sendScore(this.props.url, {
total_score: t,
top_score: e,
act_id: this.props.actId
}).then(function() {});
};
e.prototype.isTrigger = function() {
return !1;
};
return i([ classId("AddScoreUpIndiaTrait"), classMethodWatch() ], e);
}(Trait);
r.AddScoreUpIndiaTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "AddScoreUpIndiaTrait" ]);
//# sourceMappingURL=index.js.map
