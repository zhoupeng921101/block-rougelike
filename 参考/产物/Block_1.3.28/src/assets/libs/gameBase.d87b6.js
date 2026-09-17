(() => {
"use strict";
var t = {
9: (t, e) => {
Object.defineProperty(e, "__esModule", {
value: !0
}), e.Emitter = void 0;
var r = function() {
function t(t) {
this._options = t;
}
return Object.defineProperty(t.prototype, "event", {
get: function() {
var t, e = this;
return null !== (t = this._event) && void 0 !== t || (this._event = function(t, r) {
var n, i, a, o, s, c;
r && (t = t.bind(r)), e._callbacks || (null === (i = null === (n = e._options) || void 0 === n ? void 0 : n.onWillAddFirstListener) || void 0 === i || i.call(n, e), 
e._callbacks = [], null === (o = null === (a = e._options) || void 0 === a ? void 0 : a.onDidAddFirstListener) || void 0 === o || o.call(a, e)), 
null === (c = null === (s = e._options) || void 0 === s ? void 0 : s.onDidAddListener) || void 0 === c || c.call(s, e), 
e._callbacks.push({
callback: t,
thisArgs: r
});
}), this._event;
},
enumerable: !1,
configurable: !0
}), t.prototype.fire = function(t) {
for (var e = this._callbacks, r = 0; r < (null == e ? void 0 : e.length); r++) {
var n = e[r], i = n.callback, a = n.thisArgs;
i && i.apply(a, [ t ]);
}
}, t.prototype.dispose = function() {
var t, e;
this._disposed || (this._disposed = !0, this._callbacks = void 0, null === (e = null === (t = this._options) || void 0 === t ? void 0 : t.onDidRemoveLastListener) || void 0 === e || e.call(t));
}, t;
}();
e.Emitter = r;
},
58: function(t, e) {
var r = this && this.__awaiter || function(t, e, r, n) {
return new (r || (r = Promise))(function(i, a) {
function o(t) {
try {
c(n.next(t));
} catch (t) {
a(t);
}
}
function s(t) {
try {
c(n.throw(t));
} catch (t) {
a(t);
}
}
function c(t) {
var e;
t.done ? i(t.value) : (e = t.value, e instanceof r ? e : new r(function(t) {
t(e);
})).then(o, s);
}
c((n = n.apply(t, e || [])).next());
});
}, n = this && this.__generator || function(t, e) {
var r, n, i, a = {
label: 0,
sent: function() {
if (1 & i[0]) throw i[1];
return i[1];
},
trys: [],
ops: []
}, o = Object.create(("function" == typeof Iterator ? Iterator : Object).prototype);
return o.next = s(0), o.throw = s(1), o.return = s(2), "function" == typeof Symbol && (o[Symbol.iterator] = function() {
return this;
}), o;
function s(s) {
return function(c) {
return function(s) {
if (r) throw new TypeError("Generator is already executing.");
for (;o && (o = 0, s[0] && (a = 0)), a; ) try {
if (r = 1, n && (i = 2 & s[0] ? n.return : s[0] ? n.throw || ((i = n.return) && i.call(n), 
0) : n.next) && !(i = i.call(n, s[1])).done) return i;
switch (n = 0, i && (s = [ 2 & s[0], i.value ]), s[0]) {
case 0:
case 1:
i = s;
break;

case 4:
return a.label++, {
value: s[1],
done: !1
};

case 5:
a.label++, n = s[1], s = [ 0 ];
continue;

case 7:
s = a.ops.pop(), a.trys.pop();
continue;

default:
if (!((i = (i = a.trys).length > 0 && i[i.length - 1]) || 6 !== s[0] && 2 !== s[0])) {
a = 0;
continue;
}
if (3 === s[0] && (!i || s[1] > i[0] && s[1] < i[3])) {
a.label = s[1];
break;
}
if (6 === s[0] && a.label < i[1]) {
a.label = i[1], i = s;
break;
}
if (i && a.label < i[2]) {
a.label = i[2], a.ops.push(s);
break;
}
i[2] && a.ops.pop(), a.trys.pop();
continue;
}
s = e.call(t, a);
} catch (t) {
s = [ 6, t ], n = 0;
} finally {
r = i = 0;
}
if (5 & s[0]) throw s[1];
return {
value: s[0] ? s[1] : void 0,
done: !0
};
}([ s, c ]);
};
}
};
Object.defineProperty(e, "__esModule", {
value: !0
}), e.Trait = void 0;
var i = function() {
function t() {
this._state = {}, this._props = void 0, this._cachedStaticActive = void 0, this._dynamicActive = !0;
}
return Object.defineProperty(t, "activedListenerTraits", {
get: function() {
return t._activedListenerTraits;
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(t.prototype, "id", {
get: function() {
return this._id;
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(t.prototype, "traitName", {
get: function() {
return getClassName(this.constructor);
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(t.prototype, "state", {
get: function() {
return this._state;
},
enumerable: !1,
configurable: !0
}), t.prototype.data = function() {
return {};
}, Object.defineProperty(t.prototype, "props", {
get: function() {
return this._props;
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(t.prototype, "active", {
get: function() {
return this.dynamicActive && this.staticActive;
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(t.prototype, "staticActive", {
get: function() {
return void 0 === this._cachedStaticActive && (this._cachedStaticActive = t.traitIsActive(this.props)), 
this._cachedStaticActive;
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(t.prototype, "dynamicActive", {
get: function() {
return this._dynamicActive;
},
set: function(t) {
this._dynamicActive !== t && (this._dynamicActive = t, t ? this.onEnable() : this.onDisable());
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(t.prototype, "onActiveCondition", {
get: function() {
return !0;
},
enumerable: !1,
configurable: !0
}), t.prototype.registerTraitEventsMethods = function() {
return null;
}, t.prototype.onCreate = function() {}, t.prototype.onEnable = function() {}, t.prototype.onDisable = function() {}, 
t.prototype.setState = function(t) {
for (var e in t) {
var r = t[e];
this._state[e] = r;
}
}, t.prototype.onActive = function() {}, t.traitIsActive = function(t) {
return !!t && 0 !== t.firing && !1 !== t.active;
}, t.dynamicEnableTraits = function(t) {
if (t) for (var e = window.traitConfigInfo.traitsByIdMap, r = window.traitConfigInfo._traitsClassNameMap, n = window.__traitsClassMap__, i = 0; i < t.length; i++) {
var a = t[i], o = a.id, s = e[o];
if (s) {
var c = s.traitClassName;
if (!(null == n ? void 0 : n[c])) continue;
var u = TRAIT(c);
u ? (u._props = a, u.dynamicActive = !0, r[c] = {
id: o,
param: a
}) : r[c] = {
id: o,
param: a
};
}
}
}, t.dynamicEnableTraitsAsync = function(t) {
var e = this;
return new Promise(function(i) {
return r(e, void 0, void 0, function() {
var e, a, o, s, c, u, l, f, d, p, v = this;
return n(this, function(h) {
switch (h.label) {
case 0:
if (!t) return i(null), [ 2 ];
e = window.traitConfigInfo.traitsByIdMap, a = window.traitConfigInfo._traitsClassNameMap, 
o = window.__traitsClassMap__, s = [], c = function(c) {
var u, h, y, g, b, w, _;
return n(this, function(m) {
switch (m.label) {
case 0:
return u = t[c], h = u.id, y = e[h], g = function(e, r) {
if (r && e) {
var n = TRAIT(e);
n ? (n._props = u, n.dynamicActive = !0, a[e] = {
id: h,
param: u
}) : a[e] = {
id: h,
param: u
};
}
s.push({
traitClassName: e,
status: r
}), s.length === t.length && i(s);
}, b = function(t) {
return r(v, void 0, void 0, function() {
return n(this, function(e) {
switch (e.label) {
case 0:
return e.trys.push([ 0, 2, , 3 ]), [ 4, window.ResLoader.asyncLoadBundle(t) ];

case 1:
return e.sent(), g(t, !0), [ 3, 3 ];

case 2:
return e.sent(), g(t, !1), [ 3, 3 ];

case 3:
return [ 2 ];
}
});
});
}, y ? (w = y.traitClassName, (null == o ? void 0 : o[w]) ? [ 3, 7 ] : window.jsb ? [ 3, 2 ] : [ 4, b(w) ]) : [ 3, 8 ];

case 1:
return m.sent(), [ 3, 7 ];

case 2:
return (null === (f = null === (l = window.traitsInfo) || void 0 === l ? void 0 : l.traitsBundleLocalData) || void 0 === f ? void 0 : f.includes(w)) ? [ 4, b(w) ] : [ 3, 4 ];

case 3:
return m.sent(), [ 3, 7 ];

case 4:
return _ = window.ResLoader, (null === (p = null === (d = window.traitsInfo) || void 0 === d ? void 0 : d.isRemoteTraitLocalization) || void 0 === p ? void 0 : p.call(d, w)) ? (_.setCustomRemoteBundle(w), 
[ 4, b(w) ]) : [ 3, 6 ];

case 5:
return m.sent(), [ 3, 7 ];

case 6:
return _.setCustomRemoteBundle(w), _.loadBundle(w, function() {}), g(w, !1), [ 2, "continue" ];

case 7:
return g(w, !0), [ 3, 9 ];

case 8:
g(null, !1), m.label = 9;

case 9:
return [ 2 ];
}
});
}, u = 0, h.label = 1;

case 1:
return u < t.length ? [ 5, c(u) ] : [ 3, 4 ];

case 2:
h.sent(), h.label = 3;

case 3:
return u++, [ 3, 1 ];

case 4:
return [ 2 ];
}
});
});
});
}, t.dynamicDisableTraits = function(t) {
if (t) for (var e = window.traitConfigInfo.traitsByIdMap, r = window.traitConfigInfo._traitsClassNameMap, n = 0; n < t.length; n++) {
var i = e[t[n]];
if (i) {
var a = i.traitClassName, o = TRAIT(a);
o && r[a] && (delete o.__onEnabled__, delete r[a], o.dynamicActive = !1);
}
}
}, t.onTraitActive = function(t, e, r) {
this._activedListenerTraits.has(t) || this._activedListenerTraits.set(t, []), this._activedListenerTraits.get(t).push({
preActive: e,
actived: r
});
}, t._activedListenerTraits = new Map(), t;
}();
e.Trait = i, assignWindowSafe({
Trait: i
});
},
126: (t, e, r) => {
Object.defineProperty(e, "__esModule", {
value: !0
}), e.decorate = function(t) {
return function(e, r, i) {
var a = null, o = null;
if ("function" == typeof i.value ? (a = "value", o = i.value) : "function" == typeof i.get && (a = "get", 
o = i.get), !o || !a) throw new Error("not supported");
var s = t(o, r);
"function" == typeof s && (0, n.setOriginalMethod)(s, o), i[a] = s;
};
};
var n = r(747);
},
177: (t, e) => {
function r(t) {
return function(e, r) {
var n = [];
Object.defineProperty(e, r, {
get: function() {
return n;
},
set: function(e) {
if (!Array.isArray(e)) throw new Error("Property ".concat(r, " must be an array"));
n = e.length > t ? e.slice(-t) : e;
},
enumerable: !0,
configurable: !0
});
};
}
Object.defineProperty(e, "__esModule", {
value: !0
}), e.MaxListLength = r, assignWindowSafe({
MaxListLength: r
}), assignHsSafe({
MaxListLength: r
});
},
193: (t, e) => {
function r(t, e, r) {
var n = null, i = null;
if ("function" == typeof r.value ? (n = "value", (i = r.value).length) : "function" == typeof r.get && (n = "get", 
i = r.get), !i) throw new Error("not supported");
var a = "$memoize$".concat(e);
r[n] = function() {
for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
return this.hasOwnProperty(a) || Object.defineProperty(this, a, {
configurable: !1,
enumerable: !1,
writable: !1,
value: i.apply(this, t)
}), this[a];
};
}
Object.defineProperty(e, "__esModule", {
value: !0
}), e.memoize = r, assignWindowSafe({
memoize: r
}), assignHsSafe({
memoize: r
});
},
203: (t, e) => {
function r() {
for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
return function(e, r, n) {
var i = n.value;
return n.value = function() {
for (var e = this, r = [], n = 0; n < arguments.length; n++) r[n] = arguments[n];
return t.forEach(function(t) {
var r = e[t];
r && window.applyAdapterFringe(r);
}), i.apply(this, r);
}, n;
};
}
Object.defineProperty(e, "__esModule", {
value: !0
}), e.adapterFringe = r, assignWindowSafe({
adapterFringe: r
}), assignHsSafe({
adapterFringe: r
});
},
219: (t, e) => {
function r(t) {
if (t) {
for (var e in t) e in window && assertError(!1, "当前 key：".concat(e, ",不能重复赋值给 window 对象！"));
Object.assign(window, t);
}
}
Object.defineProperty(e, "__esModule", {
value: !0
}), e.assignWindowSafe = r, Object.assign(window, {
assignWindowSafe: r
});
},
247: (t, e, r) => {
Object.defineProperty(e, "__esModule", {
value: !0
}), e.classId = i, e.getClassName = a;
var n = r(219);
function i(t, e) {
return function(r) {
if (r.prototype instanceof Trait) {
window.__traitsClassMap__[t] || (window.__traitsClassMap__[t] = []), e && (r.__adjustParamShape__ = e), 
-1 === window.__traitsClassMap__[t].indexOf(r) && window.__traitsClassMap__[t].push(r);
var n = r.prototype.registerTraitEventsMethods;
if (n) {
var i = n();
if (i) for (var a = 0; a < i.length; a++) {
var o = i[a], s = o.className, c = o.methodName;
window.traitRegisterEvents[s] || (window.traitRegisterEvents[s] = {}), window.traitRegisterEvents[s][c] || (window.traitRegisterEvents[s][c] = new Map()), 
window.traitRegisterEvents[s][c].set(r, !0);
}
}
}
r.prototype.__classname__ || (r.prototype.__classname__ = t);
};
}
function a(t) {
var e;
return (null === (e = null == t ? void 0 : t.prototype) || void 0 === e ? void 0 : e.__classname__) || cc.js.getClassName(t);
}
window.traitRegisterEvents = {}, window.__traitsClassMap__ = {}, (0, n.assignWindowSafe)({
classId: i,
getClassName: a
}), assignHsSafe({
classId: i,
getClassName: a
});
},
271: (t, e, r) => {
Object.defineProperty(e, "__esModule", {
value: !0
}), e.INP = i;
var n = r(126);
function i(t, e) {
return void 0 === e && (e = 4e3), (0, n.decorate)(function(r, n) {
var i = {}, a = 0;
return window.UI.addEventListener("open", function(e) {
if (e.url === t) for (var r in i) {
var n = i[r];
n.isOpened || (n.isOpened = !0, clearTimeout(n.timeoutId), delete i[r]);
}
}), function() {
for (var o = [], s = 0; s < arguments.length; s++) o[s] = arguments[s];
var c = ++a, u = {
timeoutId: null,
isOpened: !1
};
return i[c] = u, u.timeoutId = setTimeout(function() {
var r = i[c];
r && !r.isOpened && (assertError(!1, '[@INP] 方法 "'.concat(n, '" 执行超时，面板 "').concat(t, '" 在 ').concat(e, "ms 内未打开，callId: ").concat(c)), 
delete i[c]);
}, e), r.apply(this, o);
};
});
}
assignWindowSafe({
INP: i
}), assignHsSafe({
INP: i
});
},
293: (t, e, r) => {
Object.defineProperty(e, "__esModule", {
value: !0
}), e.storageProperty = a;
var n = r(650), i = r(436);
function a(t) {
return function(e, r) {
var a, o = (null == t ? void 0 : t.key) ? t.key : r, s = "_" + r, c = n.storage.getItem(o), u = (0, 
i._reactive)(((a = {})[r] = e[r], a), e, r), l = function(t) {
if (Array.isArray(t)) {
var e = t.push, r = t.pop, i = t.splice, a = t.shift, s = t.unshift;
t.push = function() {
for (var r = [], i = 0; i < arguments.length; i++) r[i] = arguments[i];
var a = e.apply(this, r);
return n.storage.setItem(o, t), a;
}, t.pop = function() {
var e = r.apply(this);
return n.storage.setItem(o, t), e;
}, t.splice = function() {
for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
var a = i.apply(this, e);
return n.storage.setItem(o, t), a;
}, t.shift = function() {
var e = a.apply(this);
return n.storage.setItem(o, t), e;
}, t.unshift = function() {
for (var e = [], r = 0; r < arguments.length; r++) e[r] = arguments[r];
var i = s.apply(this, e);
return n.storage.setItem(o, t), i;
};
}
return t;
};
Array.isArray(u[r]) && (u[r] = l(u[r])), (0, i.reactive)({
target: e,
propertyName: r,
pos: s,
callback: function(t, e, i) {
void 0 === c ? (Array.isArray(i) && (i = l(i)), n.storage.setItem(o, i)) : void 0 === e ? u[r] = c : (Array.isArray(i) && (i = l(i)), 
n.storage.setItem(o, i));
}
}), Object.defineProperty(e, r, {
get: function() {
return u[r];
},
set: function(t) {
u[r] !== t && (Array.isArray(t) && (t = l(t)), u[r] = t);
},
enumerable: !0,
configurable: !0
});
};
}
assignWindowSafe({
storageProperty: a
}), assignHsSafe({
storageProperty: a
});
},
373: function(t, e, r) {
var n = this && this.__values || function(t) {
var e = "function" == typeof Symbol && Symbol.iterator, r = e && t[e], n = 0;
if (r) return r.call(t);
if (t && "number" == typeof t.length) return {
next: function() {
return t && n >= t.length && (t = void 0), {
value: t && t[n++],
done: !t
};
}
};
throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(e, "__esModule", {
value: !0
}), e.shareObjects = e.onDidTraitOnActive = e.onDidTraitOnActiveEmitter = e.GBMTraitsMaps = void 0, 
e.getTemplateTraits = u, e.isTraitReady = f, e.traitsReady = d, e.isTraitsConfigReady = p, 
e.traitsConfigReady = h, e.getGameTraitName = g, e.listenerTraitOnActive = b, e.GBM = w, 
e.templateTrait = _;
var i = r(219), a = r(9), o = new Map(), s = new Map();
e.GBMTraitsMaps = new Map();
var c = {};
function u() {
return c;
}
e.onDidTraitOnActiveEmitter = new a.Emitter(), e.onDidTraitOnActive = e.onDidTraitOnActiveEmitter.event;
var l = !1;
function f() {
return l;
}
function d(t) {
l = t;
}
function p() {
return v;
}
var v = !1;
function h(t) {
v = t;
}
function y(t) {
var e, r, i, a = window.traitConfigInfo.traitsClassNameMap[t];
if (a) {
var c = a, u = c.id, l = c.param, f = null === (i = window.__traitsClassMap__) || void 0 === i ? void 0 : i[t];
if (f) {
var d = l.adjustParamShape, p = "".concat(t, ":").concat(d), v = s.get(p);
if (void 0 === v) {
var h = void 0;
try {
for (var y = n(f), g = y.next(); !g.done; g = y.next()) {
var b = g.value;
if (b.__adjustParamShape__ === d) {
v = b;
break;
}
b.__adjustParamShape__ || (h = b);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
g && !g.done && (r = y.return) && r.call(y);
} finally {
if (e) throw e.error;
}
}
null != v || (v = null != h ? h : null), s.set(p, v);
}
if (v) {
var w = o.get(v);
return w || ((w = new v())._id = u, w._props = l, w._state = w.data(), w.onCreate(), 
o.set(v, w)), w;
}
}
}
return null;
}
function g(t) {
return t ? /^\d/.test(t) ? "$" + t + "Trait" : t.charAt(0).toUpperCase() + t.slice(1) + "Trait" : "";
}
function b(t, e, r) {
var n = Trait.activedListenerTraits.get(t.constructor);
if (n) for (var i = 0; i < n.length; i++) {
var a = n[i];
(null == a ? void 0 : a[r]) && a[r](t, e);
}
}
function w() {
return function(t) {
var r = t, n = getClassName(r);
e.GBMTraitsMaps.has(r) || e.GBMTraitsMaps.set(t, n);
};
}
function _(t) {
return function(e) {
if (t) {
var r = getClassName(e);
r && (c[r] = t);
}
};
}
e.shareObjects = new Map(), (0, i.assignWindowSafe)({
GBMTraitsMaps: e.GBMTraitsMaps,
getTemplateTraits: u,
onDidTraitOnActiveEmitter: e.onDidTraitOnActiveEmitter,
onDidTraitOnActive: e.onDidTraitOnActive,
isTraitReady: f,
traitsReady: d,
isTraitsConfigReady: p,
traitsConfigReady: h,
shareObjects: e.shareObjects,
TRAIT: y,
getGameTraitName: g,
listenerTraitOnActive: b,
GBM: w,
templateTrait: _
}), assignHsSafe({
GBMTraitsMaps: e.GBMTraitsMaps,
getTemplateTraits: u,
onDidTraitOnActiveEmitter: e.onDidTraitOnActiveEmitter,
onDidTraitOnActive: e.onDidTraitOnActive,
isTraitReady: f,
traitsReady: d,
isTraitsConfigReady: p,
traitsConfigReady: h,
shareObjects: e.shareObjects,
TRAIT: y,
getGameTraitName: g,
listenerTraitOnActive: b,
GBM: w,
templateTrait: _
});
},
436: (t, e, r) => {
Object.defineProperty(e, "__esModule", {
value: !0
}), e.reactive = o, e._reactive = s, e.watch = u, e.watchDebug = l;
var n = r(219);
function i(t) {
return !("object" != typeof t || null === t || Array.isArray(t) || t instanceof RegExp || t instanceof Date);
}
var a = new Map();
function o(t) {
var e = t.target, r = t.propertyName, n = t.pos, i = t.callback, o = a.get(e.constructor);
o || (o = {}, a.set(e.constructor, o)), o[r + n] = i;
}
function s(t, e, r) {
if (!i(t)) return t;
var n = {
get: function(t, n, a) {
var o = Reflect.get(t, n, a);
return i(o) ? s(o, e, r) : o;
},
set: function(t, n, o, u) {
var l = t[n], f = c(e[r]), d = Reflect.set(t, n, o, u);
if (l !== o) {
var p = a.get(e.constructor);
p && Object.keys(p).forEach(function(t) {
if (t.includes(r) && p[t]) {
var n = c(e[r]);
p[t](r, f, n);
}
}), i(o) && s(o, e, r);
}
return d;
}
};
return new Proxy(t, n);
}
function c(t, e) {
if (void 0 === e && (e = new WeakMap()), !i(t)) return t;
if (e.has(t)) return e.get(t);
if (Array.isArray(t)) {
var r = [];
e.set(t, r);
for (var n = 0; n < t.length; n++) r[n] = c(t[n], e);
return r;
}
var a = {};
return e.set(t, a), Object.keys(t).forEach(function(r) {
a[r] = c(t[r], e);
}), a;
}
function u() {
return function(t, e) {
var r, n = s(((r = {})[e] = t[e], r), t, e);
Object.defineProperty(t, e, {
get: function() {
return n[e];
},
set: function(t) {
n[e] = t;
},
enumerable: !0,
configurable: !0
});
};
}
function l(t, e, r, n) {
void 0 === r && (r = []), void 0 === n && (n = 2);
}
(0, n.assignWindowSafe)({
reactive: o,
_reactive: s,
watch: u,
watchDebug: l
}), assignHsSafe({
reactive: o,
_reactive: s,
watch: u,
watchDebug: l
});
},
496: function(t, e, r) {
var n = this && this.__read || function(t, e) {
var r = "function" == typeof Symbol && t[Symbol.iterator];
if (!r) return t;
var n, i, a = r.call(t), o = [];
try {
for (;(void 0 === e || e-- > 0) && !(n = a.next()).done; ) o.push(n.value);
} catch (t) {
i = {
error: t
};
} finally {
try {
n && !n.done && (r = a.return) && r.call(a);
} finally {
if (i) throw i.error;
}
}
return o;
}, i = this && this.__spreadArray || function(t, e, r) {
if (r || 2 === arguments.length) for (var n, i = 0, a = e.length; i < a; i++) !n && i in e || (n || (n = Array.prototype.slice.call(e, 0, i)), 
n[i] = e[i]);
return t.concat(n || Array.prototype.slice.call(e));
}, a = this && this.__values || function(t) {
var e = "function" == typeof Symbol && Symbol.iterator, r = e && t[e], n = 0;
if (r) return r.call(t);
if (t && "number" == typeof t.length) return {
next: function() {
return t && n >= t.length && (t = void 0), {
value: t && t[n++],
done: !t
};
}
};
throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(e, "__esModule", {
value: !0
}), e.classMethodWatch = c;
var o = r(219), s = r(747);
function c(t) {
return void 0 === t && (t = {}), function(e) {
var r = t.before, o = t.after, c = t.error, l = t.methods, f = t.excludeMethods, d = void 0 === f ? [] : f, p = i(i([], n([ "constructor" ]), !1), n(d), !1), v = e.prototype, h = Object.getOwnPropertyNames(e).filter(function(t) {
return ![ "length", "name", "prototype" ].includes(t);
}).filter(function(t) {
var r = Object.getOwnPropertyDescriptor(e, t);
return !!r && "function" == typeof r.value;
}), y = Object.getOwnPropertyNames(v).map(function(t) {
return {
propertyName: t,
isStatic: !1
};
}), g = h.map(function(t) {
return {
propertyName: t,
isStatic: !0
};
}).filter(function(t) {
return -1 === y.findIndex(function(e) {
return e.propertyName === t.propertyName;
});
});
y.concat(g).forEach(function(t) {
var i = t.propertyName, f = t.isStatic;
if (!p.includes(i) && (!(l && l.length > 0) || l.includes(i))) {
var d = Object.getOwnPropertyDescriptor(f ? e : v, i);
if (d && "function" == typeof d.value) {
var h = d.value, y = (0, s.getOriginalMethod)(h), g = function() {
for (var t, s, l, f, d = [], p = 0; p < arguments.length; p++) d[p] = arguments[p];
try {
if (r && r(i, d, this), window.traitsInfo) {
var v = getClassName(e), h = window.traitsInfo.traitsData, g = null == h ? void 0 : h[v], b = null == g ? void 0 : g[i], w = b ? JSON.parse(JSON.stringify(b)) : null, _ = null === (f = null === (l = window.traitRegisterEvents) || void 0 === l ? void 0 : l[v]) || void 0 === f ? void 0 : f[i];
if (_) {
w || (w = {
decorators: []
});
var m = function(t) {
var e = getClassName(t);
-1 === w.decorators.findIndex(function(t) {
return t.traitClassName === e;
}) && w.decorators.unshift({
traitClassName: e,
traitComment: ""
});
};
try {
for (var O = a(_), S = O.next(); !S.done; S = O.next()) {
var T = n(S.value, 2), M = T[0];
T[1], m(M);
}
} catch (e) {
t = {
error: e
};
} finally {
try {
S && !S.done && (s = O.return) && s.call(O);
} finally {
if (t) throw t.error;
}
}
}
if (w) {
var A = window.traitsInfo;
A && (w.decorators = A.filterLoadedRemoteTraits(w.decorators));
var j = window.hs.TraitSequence.sequenceDecorators(this, y, d, v, i, w.decorators), I = j.replace, P = j.returnValue, C = void 0;
return I || (C = u(this, i, y, d, o, c)), "##undefined##" !== P ? P : C;
}
return u(this, i, y, d, o, c);
}
return u(this, i, y, d, o, c);
} catch (t) {
return c && c(i, d, t, this), u(this, i, y, d, o, c);
}
};
(0, s.setOriginalMethod)(g, y), d.value = g, Object.defineProperty(f ? e : v, i, d);
}
}
});
};
}
function u(t, e, r, n, i, a) {
var o = r.apply(t, n);
return o instanceof Promise ? o.then(function(r) {
return i && i(e, n, r, t), r;
}).catch(function(r) {
throw a && a(e, n, r, t), r;
}) : (i && i(e, n, o, t), o);
}
(0, o.assignWindowSafe)({
classMethodWatch: c
}), assignHsSafe({
classMethodWatch: c
});
},
585: function(t, e) {
var r = this && this.__awaiter || function(t, e, r, n) {
return new (r || (r = Promise))(function(i, a) {
function o(t) {
try {
c(n.next(t));
} catch (t) {
a(t);
}
}
function s(t) {
try {
c(n.throw(t));
} catch (t) {
a(t);
}
}
function c(t) {
var e;
t.done ? i(t.value) : (e = t.value, e instanceof r ? e : new r(function(t) {
t(e);
})).then(o, s);
}
c((n = n.apply(t, e || [])).next());
});
}, n = this && this.__generator || function(t, e) {
var r, n, i, a = {
label: 0,
sent: function() {
if (1 & i[0]) throw i[1];
return i[1];
},
trys: [],
ops: []
}, o = Object.create(("function" == typeof Iterator ? Iterator : Object).prototype);
return o.next = s(0), o.throw = s(1), o.return = s(2), "function" == typeof Symbol && (o[Symbol.iterator] = function() {
return this;
}), o;
function s(s) {
return function(c) {
return function(s) {
if (r) throw new TypeError("Generator is already executing.");
for (;o && (o = 0, s[0] && (a = 0)), a; ) try {
if (r = 1, n && (i = 2 & s[0] ? n.return : s[0] ? n.throw || ((i = n.return) && i.call(n), 
0) : n.next) && !(i = i.call(n, s[1])).done) return i;
switch (n = 0, i && (s = [ 2 & s[0], i.value ]), s[0]) {
case 0:
case 1:
i = s;
break;

case 4:
return a.label++, {
value: s[1],
done: !1
};

case 5:
a.label++, n = s[1], s = [ 0 ];
continue;

case 7:
s = a.ops.pop(), a.trys.pop();
continue;

default:
if (!((i = (i = a.trys).length > 0 && i[i.length - 1]) || 6 !== s[0] && 2 !== s[0])) {
a = 0;
continue;
}
if (3 === s[0] && (!i || s[1] > i[0] && s[1] < i[3])) {
a.label = s[1];
break;
}
if (6 === s[0] && a.label < i[1]) {
a.label = i[1], i = s;
break;
}
if (i && a.label < i[2]) {
a.label = i[2], a.ops.push(s);
break;
}
i[2] && a.ops.pop(), a.trys.pop();
continue;
}
s = e.call(t, a);
} catch (t) {
s = [ 6, t ], n = 0;
} finally {
r = i = 0;
}
if (5 & s[0]) throw s[1];
return {
value: s[0] ? s[1] : void 0,
done: !0
};
}([ s, c ]);
};
}
};
function i(t, e, i) {
var a = i.value;
return i.value = function() {
for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
return r(this, void 0, void 0, function() {
return n(this, function() {
return [ 2, a.apply(this, t) ];
});
});
}, i;
}
Object.defineProperty(e, "__esModule", {
value: !0
}), e.measure = i, assignWindowSafe({
measure: i
}), assignHsSafe({
measure: i
});
},
650: function(t, e, r) {
var n = this && this.__read || function(t, e) {
var r = "function" == typeof Symbol && t[Symbol.iterator];
if (!r) return t;
var n, i, a = r.call(t), o = [];
try {
for (;(void 0 === e || e-- > 0) && !(n = a.next()).done; ) o.push(n.value);
} catch (t) {
i = {
error: t
};
} finally {
try {
n && !n.done && (r = a.return) && r.call(a);
} finally {
if (i) throw i.error;
}
}
return o;
};
Object.defineProperty(e, "__esModule", {
value: !0
}), e.storage = void 0;
var i = r(219), a = function() {
function t() {
this.cacheData = {};
}
return t.prototype.initPrefix = function(e) {
t.prefix = e;
}, t.prototype.setItem = function(e, r) {
try {
var n = t.prefix + e, i = void 0, a = typeof r;
null === r || "string" === a || "number" === a || "boolean" === a || "bigint" === a || "undefined" === a ? i = r : "object" === a && (i = JSON.stringify(r)), 
this.cacheData[e] = {
type: a,
data: i
};
var o = a + t.valueTypeSplit + i;
localStorage.setItem(n, o);
} catch (t) {
throw t instanceof DOMException && (22 === t.code || 1014 === t.code || "QuotaExceededError" === t.name || "NS_ERROR_DOM_QUOTA_REACHED" === t.name) ? new Error("LocalStorage is full") : t;
}
}, t.prototype.getItem = function(e, r) {
if (Object.prototype.hasOwnProperty.call(this.cacheData, e)) {
var i = this.cacheData[e], a = i.type, o = i.data;
return null === o ? o : "object" === a ? JSON.parse(o) : o;
}
var s = t.prefix + e, c = localStorage.getItem(s), u = void 0;
if (null !== c && "" !== c) {
var l = c.split(t.valueTypeSplit);
if (2 === (null == l ? void 0 : l.length)) {
var f = n(l, 2), d = f[0], p = f[1], v = void 0;
switch (d) {
case "string":
v = u = p;
break;

case "number":
case "bigint":
v = u = +p;
break;

case "boolean":
v = u = JSON.parse(p);
break;

case "undefined":
v = u = void 0;
break;

case "object":
u = JSON.parse(p), v = p;
}
this.cacheData[e] = {
type: d,
data: v
};
} else assertError(2 === (null == l ? void 0 : l.length), "【Storage-getItem】存储长度错误：应该为2, 错误key:".concat(s));
} else if (null == r) u = r; else if ("string" == (d = typeof r) || "number" === d || "boolean" === d || "bigint" === d || "undefined" === d) u = r; else if ("object" === d) try {
u = JSON.parse(JSON.stringify(r));
} catch (t) {
u = r;
} else u = r;
return u;
}, t.prototype.remove = function(e) {
Object.prototype.hasOwnProperty.call(this.cacheData, e) && delete this.cacheData[e];
var r = t.prefix + e;
localStorage.removeItem(r);
}, t.prototype.clear = function() {
this.cacheData = {}, localStorage.clear();
}, t.prefix = "block-blast-", t.valueTypeSplit = "^_^", t;
}();
e.storage = new a(), (0, i.assignWindowSafe)({
storage: e.storage
});
},
694: (t, e) => {
function r(t) {
if (t) {
for (var e in window.hs || (window.hs = {}), t) e in window.hs && assertError(!1, "当前 key：".concat(e, ",不能重复赋值给 hs 对象！"));
Object.assign(window.hs, t);
}
}
Object.defineProperty(e, "__esModule", {
value: !0
}), e.assignHsSafe = r, Object.assign(window, {
assignHsSafe: r
});
},
747: (t, e, r) => {
Object.defineProperty(e, "__esModule", {
value: !0
}), e.ORIGINAL_METHOD = void 0, e.getOriginalMethod = i, e.setOriginalMethod = a;
var n = r(219);
function i(t) {
return t[e.ORIGINAL_METHOD] || t;
}
function a(t, r) {
var n = i(r);
t[e.ORIGINAL_METHOD] = n;
}
e.ORIGINAL_METHOD = Symbol("ORIGINAL_METHOD"), (0, n.assignWindowSafe)({
getOriginalMethod: i,
setOriginalMethod: a
}), assignHsSafe({
getOriginalMethod: i,
setOriginalMethod: a
});
},
751: function(t, e, r) {
var n = this && this.__awaiter || function(t, e, r, n) {
return new (r || (r = Promise))(function(i, a) {
function o(t) {
try {
c(n.next(t));
} catch (t) {
a(t);
}
}
function s(t) {
try {
c(n.throw(t));
} catch (t) {
a(t);
}
}
function c(t) {
var e;
t.done ? i(t.value) : (e = t.value, e instanceof r ? e : new r(function(t) {
t(e);
})).then(o, s);
}
c((n = n.apply(t, e || [])).next());
});
}, i = this && this.__generator || function(t, e) {
var r, n, i, a = {
label: 0,
sent: function() {
if (1 & i[0]) throw i[1];
return i[1];
},
trys: [],
ops: []
}, o = Object.create(("function" == typeof Iterator ? Iterator : Object).prototype);
return o.next = s(0), o.throw = s(1), o.return = s(2), "function" == typeof Symbol && (o[Symbol.iterator] = function() {
return this;
}), o;
function s(s) {
return function(c) {
return function(s) {
if (r) throw new TypeError("Generator is already executing.");
for (;o && (o = 0, s[0] && (a = 0)), a; ) try {
if (r = 1, n && (i = 2 & s[0] ? n.return : s[0] ? n.throw || ((i = n.return) && i.call(n), 
0) : n.next) && !(i = i.call(n, s[1])).done) return i;
switch (n = 0, i && (s = [ 2 & s[0], i.value ]), s[0]) {
case 0:
case 1:
i = s;
break;

case 4:
return a.label++, {
value: s[1],
done: !1
};

case 5:
a.label++, n = s[1], s = [ 0 ];
continue;

case 7:
s = a.ops.pop(), a.trys.pop();
continue;

default:
if (!((i = (i = a.trys).length > 0 && i[i.length - 1]) || 6 !== s[0] && 2 !== s[0])) {
a = 0;
continue;
}
if (3 === s[0] && (!i || s[1] > i[0] && s[1] < i[3])) {
a.label = s[1];
break;
}
if (6 === s[0] && a.label < i[1]) {
a.label = i[1], i = s;
break;
}
if (i && a.label < i[2]) {
a.label = i[2], a.ops.push(s);
break;
}
i[2] && a.ops.pop(), a.trys.pop();
continue;
}
s = e.call(t, a);
} catch (t) {
s = [ 6, t ], n = 0;
} finally {
r = i = 0;
}
if (5 & s[0]) throw s[1];
return {
value: s[0] ? s[1] : void 0,
done: !0
};
}([ s, c ]);
};
}
};
function a(t, e, r) {
r.value;
return r.value = function() {
for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
return n(this, void 0, void 0, function() {
return i(this, function() {
return [ 2 ];
});
});
}, r;
}
Object.defineProperty(e, "__esModule", {
value: !0
}), e.Debug = a, (0, r(219).assignWindowSafe)({
Debug: a
}), assignHsSafe({
Debug: a
});
},
775: (t, e, r) => {
Object.defineProperty(e, "__esModule", {
value: !0
}), e.cacheProperty = i;
var n = r(650);
function i(t, e) {
return function(r, i) {
var a, o, s = (null !== (o = null !== (a = null != e ? e : r.constructor.featureName) && void 0 !== a ? a : r.constructor.name) && void 0 !== o ? o : "Default") + "_" + i, c = Symbol("__cache_".concat(i));
Object.defineProperty(r, i, {
get: function() {
if (!(c in this)) {
var e = n.storage.getItem(s);
null == e && (e = t, n.storage.setItem(s, e)), this[c] = e;
}
return this[c];
},
set: function(t) {
this[c] = t, n.storage.setItem(s, t);
}
});
};
}
assignWindowSafe({
cacheProperty: i
}), assignHsSafe({
cacheProperty: i
});
},
781: (t, e, r) => {
function n() {
return function(t, e, r) {
var n = r.value;
return r.value = function() {
for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
var r = cc.view.getVisibleSize();
if (r.height / r.width >= 1334 / 750) (i = cc.Canvas.instance).fitHeight = !1, i.fitWidth = !0; else if (r.height / r.width < 1334 / 750) {
var i;
(i = cc.Canvas.instance).fitHeight = !0, i.fitWidth = !1;
}
return n.apply(this, t);
}, r;
};
}
Object.defineProperty(e, "__esModule", {
value: !0
}), e.ScreenAdapter = n, (0, r(219).assignWindowSafe)({
ScreenAdapter: n
}), assignHsSafe({
ScreenAdapter: n
});
},
853: (t, e, r) => {
Object.defineProperty(e, "__esModule", {
value: !0
}), e.throttle = i, e.throttleCall = a;
var n = r(126);
function i(t, e) {
return void 0 === t && (t = 500), void 0 === e && (e = !0), (0, n.decorate)(function(r) {
var n = Date.now(), i = null;
return function() {
for (var a = [], o = 0; o < arguments.length; o++) a[o] = arguments[o];
var s = this;
if (e) {
var c = Date.now();
Math.abs(c - n) >= t && (r.apply(s, a), n = c);
} else clearTimeout(i), i = setTimeoutSafe(function() {
r.apply(s, a);
}, t);
};
});
}
function a(t, e, r) {
void 0 === e && (e = 500), void 0 === r && (r = !0);
var n = Date.now(), i = null;
return function() {
for (var a = [], o = 0; o < arguments.length; o++) a[o] = arguments[o];
var s = this;
if (r) {
var c = Date.now();
Math.abs(c - n) >= e && (t.apply(s, a), n = c);
} else clearTimeout(i), i = setTimeoutSafe(function() {
t.apply(s, a);
}, e);
};
}
assignWindowSafe({
throttle: i,
throttleCall: a
}), assignHsSafe({
throttle: i,
throttleCall: a
});
},
925: (t, e, r) => {
Object.defineProperty(e, "__esModule", {
value: !0
}), e.debounce = a;
var n = r(219), i = r(126);
function a(t) {
return void 0 === t && (t = 1e3), (0, i.decorate)(function(e, r) {
var n = "$debounce$".concat(r), i = {};
return i[n] = -1e7, function() {
for (var r = [], a = 0; a < arguments.length; a++) r[a] = arguments[a];
var o = Date.now(), s = i[n];
if (Math.abs(o - s) >= t) return i[n] = o, e.apply(this, r);
};
});
}
(0, n.assignWindowSafe)({
debounce: a
}), assignHsSafe({
debounce: a
});
},
959: function(t, e, r) {
var n, i, a = this && this.__read || function(t, e) {
var r = "function" == typeof Symbol && t[Symbol.iterator];
if (!r) return t;
var n, i, a = r.call(t), o = [];
try {
for (;(void 0 === e || e-- > 0) && !(n = a.next()).done; ) o.push(n.value);
} catch (t) {
i = {
error: t
};
} finally {
try {
n && !n.done && (r = a.return) && r.call(a);
} finally {
if (i) throw i.error;
}
}
return o;
}, o = this && this.__spreadArray || function(t, e, r) {
if (r || 2 === arguments.length) for (var n, i = 0, a = e.length; i < a; i++) !n && i in e || (n || (n = Array.prototype.slice.call(e, 0, i)), 
n[i] = e[i]);
return t.concat(n || Array.prototype.slice.call(e));
};
function s(t) {
n = t;
}
function c(t) {
i = t;
}
function u() {
return function(t, e, r) {
var i = r.value;
return r.value = function() {
for (var s = [], c = 0; c < arguments.length; c++) s[c] = arguments[c];
var u = i.apply(this, s);
return null == n || n.apply(this, o([ t, e, r ], a(s), !1)), u;
}, r;
};
}
function l() {
return function(t, e, r) {
var n = r.value;
return r.value = function() {
for (var s = [], c = 0; c < arguments.length; c++) s[c] = arguments[c];
var u = n.apply(this, s);
return null == i || i.apply(this, o([ t, e, r ], a(s), !1)), u;
}, r;
};
}
Object.defineProperty(e, "__esModule", {
value: !0
}), e.algorithmInitCall = s, e.algorithmCall = c, e.AlgorithmInit = u, e.Algorithm = l, 
(0, r(219).assignWindowSafe)({
algorithmInitCall: s,
algorithmCall: c,
Algorithm: l,
AlgorithmInit: u
}), assignHsSafe({
algorithmInitCall: s,
algorithmCall: c,
Algorithm: l,
AlgorithmInit: u
});
}
}, e = {};
function r(n) {
var i = e[n];
if (void 0 !== i) return i.exports;
var a = e[n] = {
exports: {}
};
return t[n].call(a.exports, a, a.exports, r), a.exports;
}
r(219), r(694), r(126), r(496), r(373), r(203), r(959), r(436), r(247), r(925), 
r(751), r(271), r(781), r(177), r(585), r(193), r(853), r(58), r(650), r(293), r(775);
})();