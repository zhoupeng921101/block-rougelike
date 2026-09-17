window.__require = function t(e, r, o) {
function n(l, p) {
if (!r[l]) {
if (!e[l]) {
var s = l.split("/");
s = s[s.length - 1];
if (!e[s]) {
var a = "function" == typeof __require && __require;
if (!p && a) return a(s, !0);
if (i) return i(s, !0);
throw new Error("Cannot find module '" + l + "'");
}
l = s;
}
var u = r[l] = {
exports: {}
};
e[l][0].call(u.exports, function(t) {
return n(e[l][1][t] || t);
}, u, u.exports, t, e, r, o);
}
return r[l].exports;
}
for (var i = "function" == typeof __require && __require, l = 0; l < o.length; l++) n(o[l]);
return n;
}({
PollCPUTemperatureIntervalsTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "2d743VOh9hOgqf9q/h1JKuW", "PollCPUTemperatureIntervalsTrait");
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
var n, i = arguments.length, l = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) l = Reflect.decorate(t, e, r, o); else for (var p = t.length - 1; p >= 0; p--) (n = t[p]) && (l = (i < 3 ? n(l) : i > 3 ? n(e, r, l) : n(e, r)) || l);
return i > 3 && l && Object.defineProperty(e, r, l), l;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.PollCPUTemperatureIntervalsTrait = void 0;
var l = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._intervalId = null;
e._lastCpuTemperature = null;
e._isStarted = !1;
return e;
}
e.prototype.onCreate = function() {
if (this.props && this.props.millisecond) {
var t = this.props, e = null == t ? void 0 : t.millisecond;
this.startPolling(e);
}
};
e.prototype.onActive = function(t) {
hs.tp.isDevice_Low_ProxyOnInitComplete(t);
};
e.prototype.onEnable = function() {
var t, e = null === (t = this.props) || void 0 === t ? void 0 : t.millisecond;
this.startPolling(e);
};
e.prototype.onDisable = function() {
this.stopPolling();
};
e.prototype.startPolling = function(t) {
var e = this;
if (t && !this._isStarted && cc.sys.isNative) if (t <= 0) ; else {
this.pollCpuTemperature();
this._intervalId = setInterval(function() {
e.pollCpuTemperature();
}, t);
this._isStarted = !0;
}
};
e.prototype.stopPolling = function() {
if (null !== this._intervalId) {
clearInterval(this._intervalId);
this._intervalId = null;
}
this._isStarted = !1;
};
e.prototype.pollCpuTemperature = function() {
var t = hs.deviceLowInfo.getCpuTemperature();
this._lastCpuTemperature = t;
t > 0 && hs.deviceLowInfo.setCachedCpuTemperature(t);
};
e.prototype.getLastCpuTemperature = function() {
return this._lastCpuTemperature;
};
return i([ classId("PollCPUTemperatureIntervalsTrait") ], e);
}(Trait);
r.PollCPUTemperatureIntervalsTrait = l;
cc._RF.pop();
}, {} ]
}, {}, [ "PollCPUTemperatureIntervalsTrait" ]);
//# sourceMappingURL=index.js.map
