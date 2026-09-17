window.__require = function t(e, o, i) {
function r(s, c) {
if (!o[s]) {
if (!e[s]) {
var a = s.split("/");
a = a[a.length - 1];
if (!e[a]) {
var p = "function" == typeof __require && __require;
if (!c && p) return p(a, !0);
if (n) return n(a, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = a;
}
var f = o[s] = {
exports: {}
};
e[s][0].call(f.exports, function(t) {
return r(e[s][1][t] || t);
}, f, f.exports, t, e, o, i);
}
return o[s].exports;
}
for (var n = "function" == typeof __require && __require, s = 0; s < i.length; s++) r(i[s]);
return r;
}({
LDDisableSnapHotZoneTrait: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "a9ecfTAQ2BDVo6sEBSBZBk5", "LDDisableSnapHotZoneTrait");
var i, r = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
i(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), n = this && this.__decorate || function(t, e, o, i) {
var r, n = arguments.length, s = n < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, o) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, o, i); else for (var c = t.length - 1; c >= 0; c--) (r = t[c]) && (s = (n < 3 ? r(s) : n > 3 ? r(e, o, s) : r(e, o)) || s);
return n > 3 && s && Object.defineProperty(e, o, s), s;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.LDDisableSnapHotZoneTrait = void 0;
var s = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.ids = [];
return e;
}
e.prototype.onCreate = function() {
var t = this.props;
t && t.condition && t.ids && (this.ids = t.ids);
};
e.prototype.onActive = function(t) {
hs.tp.isDevice_Low_ProxyOnInitComplete(t) && this.ids.length > 0 && this.checkDisableTraits();
hs.tp.isDevice_Low_ProxyOnGameReadyHandler(t) && this.ids.length > 0 && this.checkDisableTraits();
};
e.prototype.checkDisableTraits = function() {
hs.deviceScoreInfo.isDeviceMatchConditions(this.props.condition) && (this.ids = hs.deviceLowInfo.delTraits(this.ids));
};
return n([ classId("LDDisableSnapHotZoneTrait") ], e);
}(Trait);
o.LDDisableSnapHotZoneTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "LDDisableSnapHotZoneTrait" ]);
//# sourceMappingURL=index.js.map
