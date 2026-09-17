!function(t, e) {
"object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define([ "exports" ], e) : e((t = "undefined" != typeof globalThis ? globalThis : t || self).ae = {});
}(this, function(t) {
"use strict";
var e = function(t, n) {
return (e = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
})(t, n);
};
function n(t, n) {
if ("function" != typeof n && null !== n) throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");
function o() {
this.constructor = t;
}
e(t, n), t.prototype = null === n ? Object.create(n) : (o.prototype = n.prototype, 
new o());
}
var o = function() {
return (o = Object.assign || function(t) {
for (var e, n = 1, o = arguments.length; n < o; n++) for (var r in e = arguments[n]) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
return t;
}).apply(this, arguments);
};
function r(t, e) {
var n = {};
for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && e.indexOf(o) < 0 && (n[o] = t[o]);
if (null != t && "function" == typeof Object.getOwnPropertySymbols) {
var r = 0;
for (o = Object.getOwnPropertySymbols(t); r < o.length; r++) e.indexOf(o[r]) < 0 && Object.prototype.propertyIsEnumerable.call(t, o[r]) && (n[o[r]] = t[o[r]]);
}
return n;
}
function i(t, e, n, o) {
var r, i = arguments.length, a = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o); else for (var s = t.length - 1; s >= 0; s--) (r = t[s]) && (a = (i < 3 ? r(a) : i > 3 ? r(e, n, a) : r(e, n)) || a);
return i > 3 && a && Object.defineProperty(e, n, a), a;
}
function a(t, e) {
if ("object" == typeof Reflect && "function" == typeof Reflect.metadata) return Reflect.metadata(t, e);
}
function s(t, e, n, o) {
return new (n || (n = Promise))(function(r, i) {
function a(t) {
try {
u(o.next(t));
} catch (t) {
i(t);
}
}
function s(t) {
try {
u(o.throw(t));
} catch (t) {
i(t);
}
}
function u(t) {
var e;
t.done ? r(t.value) : (e = t.value, e instanceof n ? e : new n(function(t) {
t(e);
})).then(a, s);
}
u((o = o.apply(t, e || [])).next());
});
}
function u(t, e) {
var n, o, r, i = {
label: 0,
sent: function() {
if (1 & r[0]) throw r[1];
return r[1];
},
trys: [],
ops: []
}, a = Object.create(("function" == typeof Iterator ? Iterator : Object).prototype);
return a.next = s(0), a.throw = s(1), a.return = s(2), "function" == typeof Symbol && (a[Symbol.iterator] = function() {
return this;
}), a;
function s(s) {
return function(u) {
return function(s) {
if (n) throw new TypeError("Generator is already executing.");
for (;a && (a = 0, s[0] && (i = 0)), i; ) try {
if (n = 1, o && (r = 2 & s[0] ? o.return : s[0] ? o.throw || ((r = o.return) && r.call(o), 
0) : o.next) && !(r = r.call(o, s[1])).done) return r;
switch (o = 0, r && (s = [ 2 & s[0], r.value ]), s[0]) {
case 0:
case 1:
r = s;
break;

case 4:
return i.label++, {
value: s[1],
done: !1
};

case 5:
i.label++, o = s[1], s = [ 0 ];
continue;

case 7:
s = i.ops.pop(), i.trys.pop();
continue;

default:
if (!((r = (r = i.trys).length > 0 && r[r.length - 1]) || 6 !== s[0] && 2 !== s[0])) {
i = 0;
continue;
}
if (3 === s[0] && (!r || s[1] > r[0] && s[1] < r[3])) {
i.label = s[1];
break;
}
if (6 === s[0] && i.label < r[1]) {
i.label = r[1], r = s;
break;
}
if (r && i.label < r[2]) {
i.label = r[2], i.ops.push(s);
break;
}
r[2] && i.ops.pop(), i.trys.pop();
continue;
}
s = e.call(t, i);
} catch (t) {
s = [ 6, t ], o = 0;
} finally {
n = r = 0;
}
if (5 & s[0]) throw s[1];
return {
value: s[0] ? s[1] : void 0,
done: !0
};
}([ s, u ]);
};
}
}
function l(t) {
var e = "function" == typeof Symbol && Symbol.iterator, n = e && t[e], o = 0;
if (n) return n.call(t);
if (t && "number" == typeof t.length) return {
next: function() {
return t && o >= t.length && (t = void 0), {
value: t && t[o++],
done: !t
};
}
};
throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function c(t, e) {
var n = "function" == typeof Symbol && t[Symbol.iterator];
if (!n) return t;
var o, r, i = n.call(t), a = [];
try {
for (;(void 0 === e || e-- > 0) && !(o = i.next()).done; ) a.push(o.value);
} catch (t) {
r = {
error: t
};
} finally {
try {
o && !o.done && (n = i.return) && n.call(i);
} finally {
if (r) throw r.error;
}
}
return a;
}
function d(t, e, n) {
if (n || 2 === arguments.length) for (var o, r = 0, i = e.length; r < i; r++) !o && r in e || (o || (o = Array.prototype.slice.call(e, 0, r)), 
o[r] = e[r]);
return t.concat(o || Array.prototype.slice.call(e));
}
function h(t) {
var e = t.atomFeatureName;
return e && "atomFeatureName" !== e ? e : void 0;
}
"function" == typeof SuppressedError && SuppressedError;
var p, f, m, y = new Set([ "id", "worldId", "worldIdList", "atomFeatureName", "sort", "silent", "skipLoadWorlds", "compressedBundleWorlds" ]), v = function() {
function t(t) {
var e, n, o, r, i, a, s, u;
this._rawEntriesByWorld = new Map(), this._featureSetCache = new Map(), this._skipLoadWorlds = new Set(), 
this._compressedWorldSet = new Set(), this._configOverrides = null, this._allEntries = t;
var c = this._expandWorldIdList(t);
try {
for (var d = l(c), h = d.next(); !h.done; h = d.next()) if ((v = h.value).worldId) {
var p = v.worldId, f = this._rawEntriesByWorld.get(p);
f ? f.push(v) : this._rawEntriesByWorld.set(p, [ v ]);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
h && !h.done && (n = d.return) && n.call(d);
} finally {
if (e) throw e.error;
}
}
try {
for (var m = l(t), y = m.next(); !y.done; y = m.next()) {
var v;
if ((v = y.value).skipLoadWorlds) try {
for (var _ = (i = void 0, l(v.skipLoadWorlds)), g = _.next(); !g.done; g = _.next()) {
var A = g.value;
this._skipLoadWorlds.add(A);
}
} catch (t) {
i = {
error: t
};
} finally {
try {
g && !g.done && (a = _.return) && a.call(_);
} finally {
if (i) throw i.error;
}
}
if (v.compressedBundleWorlds) try {
for (var C = (s = void 0, l(v.compressedBundleWorlds)), R = C.next(); !R.done; R = C.next()) A = R.value, 
this._compressedWorldSet.add(A);
} catch (t) {
s = {
error: t
};
} finally {
try {
R && !R.done && (u = C.return) && u.call(C);
} finally {
if (s) throw s.error;
}
}
}
} catch (t) {
o = {
error: t
};
} finally {
try {
y && !y.done && (r = m.return) && r.call(m);
} finally {
if (o) throw o.error;
}
}
}
return t.prototype.hasFeatures = function(t) {
var e, n;
return (null !== (n = null === (e = this._rawEntriesByWorld.get(t)) || void 0 === e ? void 0 : e.length) && void 0 !== n ? n : 0) > 0;
}, t.prototype.getWorldIds = function() {
return this._rawEntriesByWorld.keys();
}, t.prototype.getFeatureSet = function(t) {
var e = this._featureSetCache.get(t);
return e || (e = this._parseFeatureSet(t), this._featureSetCache.set(t, e)), e;
}, t.prototype.getFeatureEntry = function(t, e) {
return this.getFeatureSet(t).get(e);
}, t.prototype.shouldSkipNonSilentLoadAtoms = function(t) {
return this._skipLoadWorlds.has(t);
}, t.prototype.hasFeatureInUniverse = function(t) {
var e, n;
if (!this._universeFeatureNames) {
this._universeFeatureNames = new Set();
try {
for (var o = l(this._allEntries), r = o.next(); !r.done; r = o.next()) {
var i = h(r.value);
i && this._universeFeatureNames.add(i);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
r && !r.done && (n = o.return) && n.call(o);
} finally {
if (e) throw e.error;
}
}
}
return this._universeFeatureNames.has(t);
}, t.prototype._ensureCompressedFeatureNames = function() {
var t, e, n, o;
if (!this._compressedFeatureNames) {
this._compressedFeatureNames = new Set();
try {
for (var r = l(this._compressedWorldSet), i = r.next(); !i.done; i = r.next()) {
var a = i.value;
try {
for (var s = (n = void 0, l(this.getFeatureSet(a).keys())), u = s.next(); !u.done; u = s.next()) {
var c = u.value;
this._compressedFeatureNames.add(c);
}
} catch (t) {
n = {
error: t
};
} finally {
try {
u && !u.done && (o = s.return) && o.call(s);
} finally {
if (n) throw n.error;
}
}
}
} catch (e) {
t = {
error: e
};
} finally {
try {
i && !i.done && (e = r.return) && e.call(r);
} finally {
if (t) throw t.error;
}
}
}
return this._compressedFeatureNames;
}, t.prototype.isFeatureCompressed = function(t) {
return 0 !== this._compressedWorldSet.size && this._ensureCompressedFeatureNames().has(t);
}, t.prototype.markFeaturesCompressed = function(t) {
var e, n;
if (0 !== this._compressedWorldSet.size) {
var o = this._ensureCompressedFeatureNames();
try {
for (var r = l(t), i = r.next(); !i.done; i = r.next()) {
var a = i.value;
o.add(a);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
i && !i.done && (n = r.return) && n.call(r);
} finally {
if (e) throw e.error;
}
}
}
}, t.prototype.getFeatureNamesForWorlds = function(t) {
var e, n, o, r, i = new Set();
try {
for (var a = l(t), s = a.next(); !s.done; s = a.next()) {
var u = s.value;
try {
for (var h = (o = void 0, l(this.getFeatureSet(u).keys())), p = h.next(); !p.done; p = h.next()) {
var f = p.value;
i.add(f);
}
} catch (t) {
o = {
error: t
};
} finally {
try {
p && !p.done && (r = h.return) && r.call(h);
} finally {
if (o) throw o.error;
}
}
}
} catch (t) {
e = {
error: t
};
} finally {
try {
s && !s.done && (n = a.return) && n.call(a);
} finally {
if (e) throw e.error;
}
}
return d([], c(i), !1);
}, t.prototype.applyOverrides = function(t, e) {
var n = this._ensureConfigOverrides().get(t);
n && this._deepMerge(e, n);
}, t.prototype._expandWorldIdList = function(t) {
var e, n, i, a, s = [];
try {
for (var u = l(t), c = u.next(); !c.done; c = u.next()) {
var d = c.value, h = d.worldIdList;
if (h && 0 !== h.length) {
d.worldIdList, d.worldId;
var p = r(d, [ "worldIdList", "worldId" ]);
try {
for (var f = (i = void 0, l(h)), m = f.next(); !m.done; m = f.next()) {
var y = m.value;
s.push(o(o({}, p), {
worldId: y
}));
}
} catch (t) {
i = {
error: t
};
} finally {
try {
m && !m.done && (a = f.return) && a.call(f);
} finally {
if (i) throw i.error;
}
}
} else s.push(d);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
c && !c.done && (n = u.return) && n.call(u);
} finally {
if (e) throw e.error;
}
}
return s;
}, t.prototype._parseFeatureSet = function(t) {
var e, n, o, r = null !== (o = this._rawEntriesByWorld.get(t)) && void 0 !== o ? o : [], i = new Map();
try {
for (var a = l(r), s = a.next(); !s.done; s = a.next()) {
var u = s.value, c = h(u);
c && i.set(c, u);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
s && !s.done && (n = a.return) && n.call(a);
} finally {
if (e) throw e.error;
}
}
return i;
}, t.prototype._ensureConfigOverrides = function() {
return this._configOverrides || (this._configOverrides = this._parseConfigOverrides()), 
this._configOverrides;
}, t.prototype._parseConfigOverrides = function() {
var t, e, n = [];
try {
for (var o = l(this._allEntries), r = o.next(); !r.done; r = o.next()) {
var i = r.value;
this._collectConfigEntry(i, n);
}
} catch (e) {
t = {
error: e
};
} finally {
try {
r && !r.done && (e = o.return) && e.call(o);
} finally {
if (t) throw t.error;
}
}
n.sort(function(t, e) {
return e.sort - t.sort || e.id - t.id;
});
var a = this._mergeConfigs(n);
n.map(function(t) {
return "    id=".concat(t.id, " sort=").concat(t.sort, " ").concat(t.atomName).concat(t.path.length ? "." + t.path.join(".") : "", " = ").concat(JSON.stringify(t.value));
});
return a;
}, t.prototype._collectConfigEntry = function(t, e) {
var n = t.sort, o = void 0 === n ? 0 : n, r = t.id, i = void 0 === r ? 0 : r;
for (var a in t) if (!y.has(a) && "G" === a[0] && /_.*_/.test(a)) {
var s = a.split("."), u = s[0], l = s.slice(1), c = t[a];
e.push({
id: i,
sort: o,
atomName: u,
path: l,
value: c
});
}
}, t.prototype._mergeConfigs = function(t) {
for (var e = new Map(), n = new Map(), o = t.length - 1; o >= 0; o--) {
var r = t[o], i = r.id, a = r.atomName, s = r.path, u = r.value, l = e.get(a);
l || (l = {}, e.set(a, l));
var c = n.get(a);
c || (c = new Map(), n.set(a, c)), this._mergeAtPath(l, s, u, i, c);
}
return this._warnConflicts(n), e;
}, t.prototype._mergeAtPath = function(t, e, n, o, r) {
if (0 === e.length) n && "object" == typeof n && !Array.isArray(n) && this._deepMergeWithConflict(t, n, "", o, r); else {
for (var i = t, a = 0; a < e.length - 1; a++) {
var s = e[a];
i[s] && "object" == typeof i[s] || (i[s] = {}), i = i[s];
}
var u = e[e.length - 1], l = e.join("."), c = i[u];
n && "object" == typeof n && !Array.isArray(n) ? (c && "object" == typeof c && !Array.isArray(c) || (i[u] = {}), 
this._deepMergeWithConflict(i[u], n, l, o, r)) : (this._recordConflict(r, l, o, n), 
i[u] = n);
}
}, t.prototype._deepMergeWithConflict = function(t, e, n, o, r) {
for (var i in e) {
var a = n ? "".concat(n, ".").concat(i) : i, s = e[i], u = t[i];
s && "object" == typeof s && !Array.isArray(s) ? (u && "object" == typeof u && !Array.isArray(u) || (t[i] = {}), 
this._deepMergeWithConflict(t[i], s, a, o, r)) : (this._recordConflict(r, a, o, s), 
t[i] = s);
}
}, t.prototype._recordConflict = function(t, e, n, o) {
var r = t.get(e);
r || (r = [], t.set(e, r)), r.push({
id: n,
value: o
});
}, t.prototype._warnConflicts = function(t) {
var e, n, o, r;
try {
for (var i = l(t), a = i.next(); !a.done; a = i.next()) {
var s = c(a.value, 2), u = (s[0], s[1]);
try {
for (var d = (o = void 0, l(u)), h = d.next(); !h.done; h = d.next()) {
var p = c(h.value, 2), f = (p[0], p[1]);
f.length > 1 && f.map(function(t, e) {
return "  ".concat(e + 1, '. id="').concat(t.id, '" value=').concat(JSON.stringify(t.value));
}).join("\n");
}
} catch (t) {
o = {
error: t
};
} finally {
try {
h && !h.done && (r = d.return) && r.call(d);
} finally {
if (o) throw o.error;
}
}
}
} catch (t) {
e = {
error: t
};
} finally {
try {
a && !a.done && (n = i.return) && n.call(i);
} finally {
if (e) throw e.error;
}
}
}, t.prototype._deepMerge = function(t, e) {
for (var n in e) {
var o = e[n], r = t[n];
o && "object" == typeof o && !Array.isArray(o) ? (r && "object" == typeof r && !Array.isArray(r) || (t[n] = {}), 
this._deepMerge(t[n], o)) : t[n] = o;
}
}, t;
}(), _ = function(t, e, n) {
return Object.defineProperty(t, e, {
value: n,
enumerable: !1,
writable: !0,
configurable: !0
});
}, g = function() {
return {
aliveCount: 0,
dense: [],
sparse: [],
maxId: 0,
versioning: !1,
versionBits: 8,
entityMask: 16777215,
versionShift: 24,
versionMask: 255 << 24
};
}, A = function(t, e) {
var n = function(t, e) {
return e & t.entityMask;
}(t, e), o = t.sparse[n];
return void 0 !== o && o < t.aliveCount && t.dense[o] === e;
}, C = Symbol.for("bitecs_internal"), R = function() {
var t = [], e = [], n = function(n) {
return t[e[n]] === n;
};
return {
add: function(o) {
n(o) || (e[o] = t.push(o) - 1);
},
remove: function(o) {
if (n(o)) {
var r = e[o], i = t.pop();
i !== o && (t[r] = i, e[i] = r);
}
},
has: n,
sparse: e,
dense: t,
reset: function() {
t.length = 0, e.length = 0;
},
sort: function(n) {
t.sort(n);
for (var o = 0; o < t.length; o++) e[t[o]] = o;
}
};
}, S = "undefined" != typeof SharedArrayBuffer ? SharedArrayBuffer : ArrayBuffer, T = function(t) {
void 0 === t && (t = 1e3);
var e = [], n = 0, o = new Uint32Array(new S(4 * t)), r = function(t) {
return t < e.length && e[t] < n && o[e[t]] === t;
};
return {
add: function(t) {
if (!r(t)) {
if (n >= o.length) {
var i = new Uint32Array(new S(8 * o.length));
i.set(o), o = i;
}
o[n] = t, e[t] = n, n++;
}
},
remove: function(t) {
if (r(t)) {
n--;
var i = e[t], a = o[n];
o[i] = a, e[a] = i;
}
},
has: r,
sparse: e,
get dense() {
return new Uint32Array(o.buffer, 0, n);
},
reset: function() {
n = 0, e.length = 0;
},
sort: function(t) {
var r = Array.from(o.subarray(0, n));
r.sort(t);
for (var i = 0; i < r.length; i++) o[i] = r[i];
for (i = 0; i < n; i++) e[o[i]] = i;
}
};
}, b = function() {
var t = new Set();
return {
subscribe: function(e) {
return t.add(e), function() {
t.delete(e);
};
},
notify: function(e) {
for (var n = [], r = 1; r < arguments.length; r++) n[r - 1] = arguments[r];
return Array.from(t).reduce(function(t, r) {
var i = r.apply(void 0, d([ e ], c(n), !1));
return i && "object" == typeof i ? o(o({}, t), i) : t;
}, {});
}
};
}, w = Symbol.for("bitecs-relation"), F = Symbol.for("bitecs-pairTarget"), E = Symbol.for("bitecs-isPairComponent"), N = Symbol.for("bitecs-relationData"), x = function() {
var t = {
pairsMap: new Map(),
initStore: void 0,
exclusiveRelation: !1,
autoRemoveSubject: !1,
onTargetRemoved: void 0,
onAdd: void 0,
onRemove: void 0
}, e = function(n) {
if (void 0 === n) throw Error("Relation target is undefined");
var o = "*" === n ? G : n;
if (!t.pairsMap.has(o)) {
var r = {};
_(r, w, e), _(r, F, o), _(r, E, !0), t.pairsMap.set(o, r);
}
return t.pairsMap.get(o);
};
return _(e, N, t), e;
}, I = function(t) {
return t[N].exclusiveRelation = !0, t;
}, D = function(t) {
return t[N].autoRemoveSubject = !0, t;
}, M = function(t) {
return function(e) {
return e[N].onTargetRemoved = t, e;
};
}, P = function(t) {
return function(e) {
return e[N].onAdd = t, e;
};
}, W = function(t) {
return function(e) {
return e[N].onRemove = t, e;
};
}, O = function(t, e) {
if (void 0 === t) throw Error("Relation is undefined");
return t(e);
}, L = function(t, e, n) {
var o, r, i = Dt(t, e), a = [];
try {
for (var s = l(i), u = s.next(); !u.done; u = s.next()) {
var c = u.value;
c[w] !== n || c[F] === G || V(c[F]) || a.push(c[F]);
}
} catch (t) {
o = {
error: t
};
} finally {
try {
u && !u.done && (r = s.return) && r.call(s);
} finally {
if (o) throw o.error;
}
}
return a;
}, B = Symbol.for("bitecs-wildcard"), G = (f = Symbol.for("bitecs-global-wildcard"), 
globalThis[f] || (globalThis[f] = (p = x(), Object.defineProperty(p, B, {
value: !0,
enumerable: !1,
writable: !1,
configurable: !1
}), p)), globalThis[f]), k = (m = Symbol.for("bitecs-global-isa"), globalThis[m] || (globalThis[m] = x()), 
globalThis[m]);
function V(t) {
return !!t && Object.getOwnPropertySymbols(t).includes(N);
}
var j, H = 4294967295;
function z(t, e) {
var n = t.depths;
if (e < n.length) return n;
var o = Math.max(e + 1, 2 * n.length, n.length + 1024), r = new Uint32Array(o);
return r.fill(H), r.set(n), t.depths = r, r;
}
function U(t, e, n, o) {
var r = t.depthToEntities;
if (void 0 !== o && o !== H) {
var i = r.get(o);
i && (i.remove(e), 0 === i.dense.length && r.delete(o));
}
n !== H && (r.has(n) || r.set(n, T()), r.get(n).add(e));
}
function Y(t, e, n, o) {
t.depths[e] = n, U(t, e, n, o), function(t, e) {
e > t.maxDepth && (t.maxDepth = e);
}(t, n);
}
function q(t, e) {
t[C].hierarchyQueryCache.delete(e);
}
function X(t, e) {
var n = t[C];
return n.hierarchyActiveRelations.has(e) || (n.hierarchyActiveRelations.add(e), 
Q(t, e), function(t, e) {
var n, o, r, i, a, s, u = ft(t, [ O(e, G) ]);
try {
for (var c = l(u), d = c.next(); !d.done; d = c.next()) K(t, e, m = d.value);
} catch (t) {
n = {
error: t
};
} finally {
try {
d && !d.done && (o = c.return) && o.call(c);
} finally {
if (n) throw n.error;
}
}
var h = new Set();
try {
for (var p = l(u), f = p.next(); !f.done; f = p.next()) {
var m = f.value;
try {
for (var y = (a = void 0, l(L(t, m, e))), v = y.next(); !v.done; v = y.next()) {
var _ = v.value;
h.has(_) || (h.add(_), K(t, e, _));
}
} catch (t) {
a = {
error: t
};
} finally {
try {
v && !v.done && (s = y.return) && s.call(y);
} finally {
if (a) throw a.error;
}
}
}
} catch (t) {
r = {
error: t
};
} finally {
try {
f && !f.done && (i = p.return) && i.call(p);
} finally {
if (r) throw r.error;
}
}
}(t, e)), n.hierarchyData.get(e);
}
function Q(t, e) {
var n = t[C];
if (!n.hierarchyData.has(e)) {
var o = Math.max(1024, 2 * n.entityIndex.dense.length), r = new Uint32Array(o);
r.fill(H), n.hierarchyData.set(e, {
depths: r,
dirty: R(),
depthToEntities: new Map(),
maxDepth: 0
});
}
}
function J(t, e, n, o) {
var r, i;
if (void 0 === o && (o = new Set()), o.has(n)) return 0;
o.add(n);
var a = L(t, n, e);
if (0 === a.length) return 0;
if (1 === a.length) return Z(t, e, a[0], o) + 1;
var s = 1 / 0;
try {
for (var u = l(a), c = u.next(); !c.done; c = u.next()) {
var d = Z(t, e, c.value, o);
if (d < s && 0 === (s = d)) break;
}
} catch (t) {
r = {
error: t
};
} finally {
try {
c && !c.done && (i = u.return) && i.call(u);
} finally {
if (r) throw r.error;
}
}
return s === 1 / 0 ? 0 : s + 1;
}
function Z(t, e, n, o) {
var r = t[C];
Q(t, e);
var i = r.hierarchyData.get(e), a = i.depths;
if ((a = z(i, n))[n] === H) {
var s = J(t, e, n, o);
return Y(i, n, s), s;
}
return a[n];
}
function K(t, e, n) {
return Z(t, e, n, new Set());
}
function $(t, e, n, o, r) {
var i, a;
if (void 0 === r && (r = R()), !r.has(n)) {
r.add(n);
var s = ft(t, [ e(n) ]);
try {
for (var u = l(s), c = u.next(); !c.done; c = u.next()) {
var d = c.value;
o.add(d), $(t, e, d, o, r);
}
} catch (t) {
i = {
error: t
};
} finally {
try {
c && !c.done && (a = u.return) && a.call(u);
} finally {
if (i) throw i.error;
}
}
}
}
function tt(t, e, n, o, r) {
void 0 === r && (r = new Set());
var i = t[C];
if (i.hierarchyActiveRelations.has(e)) {
Q(t, e);
var a = i.hierarchyData.get(e);
if (r.has(n)) a.dirty.add(n); else {
r.add(n);
var s = a.depths, u = a.dirty, l = void 0 !== o ? K(t, e, o) + 1 : 0;
if (!(l > 64)) {
var c = s[n];
Y(a, n, l, c === H ? void 0 : c), c !== l && ($(t, e, n, u, R()), q(t, e));
}
}
}
}
function et(t, e, n) {
var o = t[C];
if (o.hierarchyActiveRelations.has(e)) {
var r = o.hierarchyData.get(e);
r.depths, nt(t, e, n, z(r, n), R()), q(t, e);
}
}
function nt(t, e, n, o, r) {
var i, a;
if (!r.has(n)) {
r.add(n);
var s = t[C].hierarchyData.get(e);
if (n < o.length) {
var u = o[n];
u !== H && (s.depths[n] = H, U(s, n, H, u));
}
var c = ft(t, [ e(n) ]);
try {
for (var d = l(c), h = d.next(); !h.done; h = d.next()) nt(t, e, h.value, o, r);
} catch (t) {
i = {
error: t
};
} finally {
try {
h && !h.done && (a = d.return) && a.call(d);
} finally {
if (i) throw i.error;
}
}
}
}
function ot(t, e) {
var n, o, r = t[C].hierarchyData.get(e);
if (r) {
var i = r.dirty, a = r.depths;
if (0 !== i.dense.length) {
try {
for (var s = l(i.dense), u = s.next(); !u.done; u = s.next()) {
var c = u.value;
a[c] === H && Y(r, c, J(t, e, c));
}
} catch (t) {
n = {
error: t
};
} finally {
try {
u && !u.done && (o = s.return) && o.call(s);
} finally {
if (n) throw n.error;
}
}
i.reset();
}
}
}
var rt = Symbol.for("bitecs-opType"), it = Symbol.for("bitecs-opTerms"), at = Symbol.for("bitecs-hierarchyType"), st = Symbol.for("bitecs-hierarchyRel"), ut = Symbol.for("bitecs-hierarchyDepth"), lt = Symbol.for("bitecs-modifierType"), ct = ((j = {})[lt] = "nested", 
j), dt = function(t, e) {
var n = t[C], o = function(e) {
return rt in e ? "".concat(e[rt].toLowerCase(), "(").concat(e[it].map(o).sort().join(","), ")") : (r = e, 
n.componentMap.has(r) || Ct(t, r), n.componentMap.get(r).id).toString();
var r;
};
return e.map(o).sort().join("-");
}, ht = function(t, e, n) {
void 0 === n && (n = {});
var o = t[C], r = dt(t, e), i = [], a = function(e) {
rt in e ? e[it].forEach(a) : (o.componentMap.has(e) || Ct(t, e), i.push(e));
};
e.forEach(a);
var s = [], u = [], l = [], h = function(e, n) {
n.forEach(function(n) {
o.componentMap.has(n) || Ct(t, n), e.push(n);
});
};
e.forEach(function(e) {
if (rt in e) {
var n = e, r = n[rt], i = n[it];
if ("Not" === r) h(u, i); else if ("Or" === r) h(l, i); else {
if ("And" !== r) throw new Error("Nested combinator ".concat(r, " not supported yet - use simple queries for best performance"));
h(s, i);
}
} else o.componentMap.has(e) || Ct(t, e), s.push(e);
});
var p = i.map(function(t) {
return o.componentMap.get(t);
}), f = d([], c(new Set(p.map(function(t) {
return t.generationId;
}))), !1), m = function(t, e) {
return t[e.generationId] = (t[e.generationId] || 0) | e.bitflag, t;
}, y = s.map(function(t) {
return o.componentMap.get(t);
}).reduce(m, {}), v = u.map(function(t) {
return o.componentMap.get(t);
}).reduce(m, {}), _ = l.map(function(t) {
return o.componentMap.get(t);
}).reduce(m, {}), g = p.reduce(m, {}), A = Object.assign(n.buffered ? T() : R(), {
allComponents: i,
orComponents: l,
notComponents: u,
masks: y,
notMasks: v,
orMasks: _,
hasMasks: g,
generations: f,
toRemove: R(),
addObservable: b(),
removeObservable: b(),
queues: {}
});
o.queries.add(A), o.queriesHashMap.set(r, A), p.forEach(function(t) {
t.queries.add(A);
}), u.length && o.notQueries.add(A);
for (var S = o.entityIndex, w = 0; w < S.aliveCount; w++) {
var F = S.dense[w];
Rt(t, F, xt) || mt(t, A, F) && yt(A, F);
}
return A;
};
function pt(t, e, n) {
void 0 === n && (n = {});
var o = t[C], r = dt(t, e), i = o.queriesHashMap.get(r);
return i ? n.buffered && !("buffer" in i.dense) && (i = ht(t, e, {
buffered: !0
})) : i = ht(t, e, n), n.buffered, i.dense;
}
function ft(t, e) {
for (var n, o, r = [], i = 2; i < arguments.length; i++) r[i - 2] = arguments[i];
var a = e.find(function(t) {
return t && "object" == typeof t && at in t;
}), s = e.filter(function(t) {
return !(t && "object" == typeof t && at in t);
}), u = !1, h = !0, p = r.some(function(t) {
return t && "object" == typeof t && lt in t;
});
try {
for (var f = l(r), m = f.next(); !m.done; m = f.next()) {
var y = m.value;
if (p && y && "object" == typeof y && lt in y) {
var v = y;
"buffer" === v[lt] && (u = !0), "nested" === v[lt] && (h = !1);
} else if (!p) {
var _ = y;
void 0 !== _.buffered && (u = _.buffered), void 0 !== _.commit && (h = _.commit);
}
}
} catch (t) {
n = {
error: t
};
} finally {
try {
m && !m.done && (o = f.return) && o.call(f);
} finally {
if (n) throw n.error;
}
}
if (a) {
var g = a, A = g[st], R = g[ut];
return void 0 !== R ? function(t, e, n, o) {
void 0 === o && (o = {});
var r = X(t, e);
ot(t, e);
var i = r.depthToEntities.get(n);
return i ? (o.buffered, i.dense) : o.buffered ? new Uint32Array(0) : [];
}(t, A, R, {
buffered: u
}) : function(t, e, n, o) {
void 0 === o && (o = {});
var r = t[C];
X(t, e);
var i = dt(t, d([ e ], c(n), !1)), a = r.hierarchyQueryCache.get(e);
if (a && a.hash === i) return a.result;
ot(t, e), pt(t, n, o);
var s = r.queriesHashMap.get(dt(t, n)), u = r.hierarchyData.get(e).depths;
s.sort(function(t, e) {
var n = u[t], o = u[e];
return n !== o ? n - o : t - e;
});
var l = (o.buffered, s.dense);
return r.hierarchyQueryCache.set(e, {
hash: i,
result: l
}), l;
}(t, A, s, {
buffered: u
});
}
return h && _t(t), pt(t, s, {
buffered: u
});
}
function mt(t, e, n) {
for (var o = t[C], r = e.masks, i = e.notMasks, a = e.orMasks, s = e.generations, u = 0 === Object.keys(a).length, l = 0; l < s.length; l++) {
var c = s[l], d = r[c], h = i[c], p = a[c], f = o.entityMasks[c][n];
if (h && 0 != (f & h)) return !1;
if (d && (f & d) !== d) return !1;
p && 0 != (f & p) && (u = !0);
}
return u;
}
var yt = function(t, e) {
t.toRemove.remove(e), t.addObservable.notify(e), t.add(e);
}, vt = function(t) {
for (var e = 0; e < t.toRemove.dense.length; e++) {
var n = t.toRemove.dense[e];
t.remove(n);
}
t.toRemove.reset();
}, _t = function(t) {
var e = t[C];
e.dirtyQueries.size && (e.dirtyQueries.forEach(vt), e.dirtyQueries.clear());
}, gt = function(t, e, n) {
var o = t[C];
e.has(n) && !e.toRemove.has(n) && (e.toRemove.add(n), o.dirtyQueries.add(e), e.removeObservable.notify(n));
}, At = function(t, e) {
var n = t[C], o = dt(t, e), r = n.queriesHashMap.get(o);
r && (n.queries.delete(r), n.queriesHashMap.delete(o));
}, Ct = function(t, e) {
if (!e) throw new Error("bitECS - Cannot register null or undefined component");
var n = t[C], o = new Set(), r = {
id: n.componentCount++,
generationId: n.entityMasks.length - 1,
bitflag: n.bitflag,
ref: e,
queries: o,
setObservable: b(),
getObservable: b()
};
return n.componentMap.set(e, r), n.bitflag *= 2, n.bitflag >= Math.pow(2, 31) && (n.bitflag = 1, 
n.entityMasks.push([])), r;
}, Rt = function(t, e, n) {
var o = t[C], r = o.componentMap.get(n);
if (!r) return !1;
var i = r.generationId, a = r.bitflag;
return (o.entityMasks[i][e] & a) === a;
}, St = function(t, e, n) {
var o = t[C].componentMap.get(n);
if (o && Rt(t, e, n)) return o.getObservable.notify(e);
}, Tt = function(t, e, n, o, r) {
var i, a, s, u;
if (void 0 === r && (r = new Set()), !r.has(o)) {
r.add(o), bt(e, n, k(o));
try {
for (var c = l(Dt(e, o)), d = c.next(); !d.done; d = c.next()) {
var h = d.value;
if (h !== xt && !Rt(e, n, h)) {
bt(e, n, h);
var p = t.componentMap.get(h);
if (null == p ? void 0 : p.setObservable) {
var f = St(e, o, h);
p.setObservable.notify(n, f);
}
}
}
} catch (t) {
i = {
error: t
};
} finally {
try {
d && !d.done && (a = c.return) && a.call(c);
} finally {
if (i) throw i.error;
}
}
try {
for (var m = l(L(e, o, k)), y = m.next(); !y.done; y = m.next()) {
var v = y.value;
Tt(t, e, n, v, r);
}
} catch (t) {
s = {
error: t
};
} finally {
try {
y && !y.done && (u = m.return) && u.call(m);
} finally {
if (s) throw s.error;
}
}
}
}, bt = function(t, e, n) {
var o, r;
if (!Mt(t, e)) throw new Error("Cannot add component - entity ".concat(e, " does not exist in the world."));
var i = t[C], a = "component" in n ? n.component : n, s = "data" in n ? n.data : void 0;
i.componentMap.has(a) || Ct(t, a);
var u = i.componentMap.get(a);
if (Rt(t, e, a)) return void 0 !== s && u.setObservable.notify(e, s), !1;
var c = u.generationId, d = u.bitflag, h = u.queries;
if (i.entityMasks[c][e] |= d, Rt(t, e, xt) || h.forEach(function(n) {
n.toRemove.remove(e), mt(t, n, e) ? yt(n, e) : gt(t, n, e);
}), i.entityComponents.get(e).add(a), void 0 !== s && u.setObservable.notify(e, s), 
a[E]) {
var p = a[w], f = a[F];
if (wt(t, e, O(p, G), O(G, f)), "number" == typeof f) {
var m = f;
wt(t, m, O(G, e), O(G, p)), i.entitiesWithRelations.add(m), i.entitiesWithRelations.add(e);
}
i.entitiesWithRelations.add(f);
var y = p[N];
if (!0 === y.exclusiveRelation && f !== G) {
var v = L(t, e, p)[0];
null != v && v !== f && Nt(t, e, p(v));
}
if (p === k) {
var _ = L(t, e, k);
try {
for (var g = l(_), A = g.next(); !A.done; A = g.next()) {
var R = A.value;
Tt(i, t, e, R);
}
} catch (t) {
o = {
error: t
};
} finally {
try {
A && !A.done && (r = g.return) && r.call(g);
} finally {
if (o) throw o.error;
}
}
}
tt(t, p, e, "number" == typeof f ? f : void 0), y.onAdd && "number" == typeof f && y.onAdd(e, f);
}
return !0;
};
function wt(t, e) {
for (var n = [], o = 2; o < arguments.length; o++) n[o - 2] = arguments[o];
(Array.isArray(n[0]) ? n[0] : n).forEach(function(n) {
bt(t, e, n);
});
}
var Ft, Et, Nt = function(t, e) {
for (var n = [], o = 2; o < arguments.length; o++) n[o - 2] = arguments[o];
var r = t[C];
if (!Mt(t, e)) throw new Error("Cannot remove component - entity ".concat(e, " does not exist in the world."));
n.forEach(function(n) {
if (Rt(t, e, n)) {
var o = r.componentMap.get(n), i = o.generationId, a = o.bitflag, s = o.queries;
if (r.entityMasks[i][e] &= ~a, s.forEach(function(n) {
n.toRemove.remove(e), mt(t, n, e) ? yt(n, e) : gt(t, n, e);
}), r.entityComponents.get(e).delete(n), n[E]) {
var u = n[F], l = n[w];
if (et(t, l, e), Nt(t, e, O(G, u)), "number" == typeof u) {
var c = u;
Mt(t, c) && (Nt(t, c, O(G, e)), Nt(t, c, O(G, l)));
}
0 === L(t, e, l).length && Nt(t, e, O(l, G));
var d = l[N];
d.onRemove && "number" == typeof u && d.onRemove(e, u);
}
}
});
}, xt = {}, It = function(t, e) {
var n = t[C];
if (A(n.entityIndex, e)) for (var o = [ e ], r = new Set(), i = function() {
var e, i, a, s, u, h, p, f, m, y, v = o.shift();
if (r.has(v)) return "continue";
r.add(v);
var _ = [];
if (n.entitiesWithRelations.has(v)) {
var g = function(e) {
var r, i;
if (!Mt(t, e)) return "continue";
var a = function(n) {
if (!n[E]) return "continue";
var r = n[w][N];
_.push(function() {
return Nt(t, e, O(G, v));
}), n[F] === v && (_.push(function() {
return Nt(t, e, n);
}), r.autoRemoveSubject && o.push(e), r.onTargetRemoved && _.push(function() {
return r.onTargetRemoved(e, v);
}));
};
try {
for (var s = (r = void 0, l(n.entityComponents.get(e))), u = s.next(); !u.done; u = s.next()) a(u.value);
} catch (t) {
r = {
error: t
};
} finally {
try {
u && !u.done && (i = s.return) && i.call(s);
} finally {
if (r) throw r.error;
}
}
};
try {
for (var A = (e = void 0, l(ft(t, [ G(v) ], ct))), C = A.next(); !C.done; C = A.next()) g(C.value);
} catch (t) {
e = {
error: t
};
} finally {
try {
C && !C.done && (i = A.return) && i.call(A);
} finally {
if (e) throw e.error;
}
}
n.entitiesWithRelations.delete(v);
}
try {
for (var R = (a = void 0, l(_)), S = R.next(); !S.done; S = R.next()) (0, S.value)();
} catch (t) {
a = {
error: t
};
} finally {
try {
S && !S.done && (s = R.return) && s.call(R);
} finally {
if (a) throw a.error;
}
}
try {
for (var T = (u = void 0, l(o)), b = T.next(); !b.done; b = T.next()) {
var x = b.value;
It(t, x);
}
} catch (t) {
u = {
error: t
};
} finally {
try {
b && !b.done && (h = T.return) && h.call(T);
} finally {
if (u) throw u.error;
}
}
try {
for (var I = (p = void 0, l(n.queries)), D = I.next(); !D.done; D = I.next()) {
var M = D.value;
gt(t, M, v);
}
} catch (t) {
p = {
error: t
};
} finally {
try {
D && !D.done && (f = I.return) && f.call(I);
} finally {
if (p) throw p.error;
}
}
var P = n.entityComponents.get(v);
if (P) {
var W = [];
try {
for (var L = (m = void 0, l(P)), B = L.next(); !B.done; B = L.next()) {
var k = B.value;
k[E] && W.push(k);
}
} catch (t) {
m = {
error: t
};
} finally {
try {
B && !B.done && (y = L.return) && y.call(L);
} finally {
if (m) throw m.error;
}
}
W.length > 0 && Nt.apply(void 0, d([ t, v ], c(W), !1));
}
!function(t, e) {
var n = t.sparse[e];
if (!(void 0 === n || n >= t.aliveCount)) {
var o = t.aliveCount - 1, r = t.dense[o];
if (t.sparse[r] = n, t.dense[n] = r, t.sparse[e] = o, t.dense[o] = e, t.versioning) {
var i = function(t, e) {
var n = function(t, e) {
return e >>> t.versionShift & (1 << t.versionBits) - 1;
}(t, e) + 1 & (1 << t.versionBits) - 1;
return e & t.entityMask | n << t.versionShift;
}(t, e);
t.dense[o] = i;
}
t.aliveCount--;
}
}(n.entityIndex, v), n.entityComponents.delete(v);
for (var V = 0; V < n.entityMasks.length; V++) n.entityMasks[V][v] = 0;
}; o.length > 0; ) i();
}, Dt = function(t, e) {
var n = t[C];
if (void 0 === e) throw new Error("getEntityComponents: entity id is undefined.");
if (!A(n.entityIndex, e)) throw new Error("getEntityComponents: entity ".concat(e, " does not exist in the world."));
return Array.from(n.entityComponents.get(e));
}, Mt = function(t, e) {
return A(t[C].entityIndex, e);
};
!function(t) {
t[t.BindAtomDuplicate = 1010] = "BindAtomDuplicate", t[t.VariantOfDuplicate = 1011] = "VariantOfDuplicate", 
t[t.AttachToDuplicate = 1012] = "AttachToDuplicate", t[t.EntityRendererDuplicate = 1013] = "EntityRendererDuplicate", 
t[t.OnChainDuplicate = 1014] = "OnChainDuplicate", t[t.RouteFromDuplicate = 1015] = "RouteFromDuplicate", 
t[t.RouteToDuplicate = 1016] = "RouteToDuplicate", t[t.OrderDecoratorDuplicate = 1017] = "OrderDecoratorDuplicate", 
t[t.BindAtomRequired = 1020] = "BindAtomRequired", t[t.DomainBindingRequired = 1021] = "DomainBindingRequired", 
t[t.RouteEndpointRequired = 1022] = "RouteEndpointRequired", t[t.OrderTargetRequired = 1023] = "OrderTargetRequired", 
t[t.AttachToRequired = 1024] = "AttachToRequired", t[t.OnChainRequired = 1025] = "OnChainRequired", 
t[t.RoutePhaseRequired = 1026] = "RoutePhaseRequired", t[t.BindAtomTypeNotAllowed = 1030] = "BindAtomTypeNotAllowed", 
t[t.DomainTargetInvalid = 1031] = "DomainTargetInvalid", t[t.OrderTargetTypeInvalid = 1032] = "OrderTargetTypeInvalid", 
t[t.VariantOfNotVariantAtom = 1033] = "VariantOfNotVariantAtom", t[t.AttachToNotExtensionAtom = 1034] = "AttachToNotExtensionAtom", 
t[t.EntityDataNotLogicAtom = 1035] = "EntityDataNotLogicAtom", t[t.OnChainNotLogicAtom = 1036] = "OnChainNotLogicAtom", 
t[t.OnChainTargetNotChainable = 1037] = "OnChainTargetNotChainable", t[t.SignalStartConflict = 1040] = "SignalStartConflict", 
t[t.SignalEndConflict = 1041] = "SignalEndConflict", t[t.RouteReceiveConflict = 1042] = "RouteReceiveConflict", 
t[t.RouteDispatchConflict = 1043] = "RouteDispatchConflict", t[t.RouteTransformConflict = 1044] = "RouteTransformConflict", 
t[t.RouteFilterConflict = 1045] = "RouteFilterConflict", t[t.ReservedPropertyConflict = 1050] = "ReservedPropertyConflict", 
t[t.StorageReplaceDenied = 3010] = "StorageReplaceDenied", t[t.StorageDeleteDenied = 3011] = "StorageDeleteDenied", 
t[t.RoutePhaseOutOfScope = 3012] = "RoutePhaseOutOfScope", t[t.RoutePhasePropertyDenied = 3013] = "RoutePhasePropertyDenied", 
t[t.ChainBindingRequired = 3014] = "ChainBindingRequired", t[t.ChainPhaseOutOfScope = 3015] = "ChainPhaseOutOfScope", 
t[t.EntityDestroyDenied = 3018] = "EntityDestroyDenied", t[t.BoundaryBindingForbidden = 4010] = "BoundaryBindingForbidden", 
t[t.OrderScopeConflict = 4020] = "OrderScopeConflict", t[t.SignalDomainConflict = 4021] = "SignalDomainConflict", 
t[t.SelfBinding = 4030] = "SelfBinding", t[t.TransformEidInvalid = 5010] = "TransformEidInvalid", 
t[t.BroadcastFilterForbidden = 5011] = "BroadcastFilterForbidden", t[t.EntityDataConfigInvalid = 5012] = "EntityDataConfigInvalid", 
t[t.WorldFeaturesEmpty = 5013] = "WorldFeaturesEmpty", t[t.WorldEntityNoId = 5014] = "WorldEntityNoId", 
t[t.GraphicsRequired = 5015] = "GraphicsRequired", t[t.RenderGroupAssign = 6011] = "RenderGroupAssign", 
t[t.RenderPropertyNotExist = 6012] = "RenderPropertyNotExist", t[t.RenderEventNotRegistered = 6013] = "RenderEventNotRegistered", 
t[t.AtomClassNotRegistered = 7010] = "AtomClassNotRegistered", t[t.AtomInstanceNotFound = 7011] = "AtomInstanceNotFound", 
t[t.AtomTypeQueryFailed = 7012] = "AtomTypeQueryFailed", t[t.TopologicalConflict = 7020] = "TopologicalConflict", 
t[t.TopologicalCycle = 7021] = "TopologicalCycle", t[t.PriorityConstraintDuplicate = 7030] = "PriorityConstraintDuplicate", 
t[t.DomainRenderNotRegistered = 7040] = "DomainRenderNotRegistered", t[t.DomainRenderNoMatch = 7041] = "DomainRenderNoMatch", 
t[t.InheritanceForbidden = 8010] = "InheritanceForbidden", t[t.AtomClassParamMissing = 8011] = "AtomClassParamMissing", 
t[t.AtomNameInvalid = 8012] = "AtomNameInvalid", t[t.UnsupportedNodeType = 8013] = "UnsupportedNodeType", 
t[t.WarnSignalDomainCollect = 9010] = "WarnSignalDomainCollect", t[t.WarnRootControlledProperty = 9011] = "WarnRootControlledProperty";
}(Et || (Et = {}));
var Pt, Wt, Ot, Lt, Bt, Gt, kt, Vt, jt, Ht, zt, Ut, Yt, qt, Xt, Qt, Jt, Zt, Kt, $t, te, ee, ne = ((Ft = {})[Et.BindAtomDuplicate] = "同一原子被多个属性绑定", 
Ft[Et.VariantOfDuplicate] = "@variantOf 重复标记", Ft[Et.AttachToDuplicate] = "@attachTo 重复标记", 
Ft[Et.EntityRendererDuplicate] = "@entityRenderer 重复标记", Ft[Et.OnChainDuplicate] = "@onChain 重复标记", 
Ft[Et.RouteFromDuplicate] = "@routeFrom 重复标记", Ft[Et.RouteToDuplicate] = "@routeTo 重复标记", 
Ft[Et.OrderDecoratorDuplicate] = "排序装饰器重复标记", Ft[Et.BindAtomRequired] = "装饰器需要配合 @bindAtom 使用", 
Ft[Et.DomainBindingRequired] = "SignalAtom 必须恰好绑定一个 EntityDomainAtom", Ft[Et.RouteEndpointRequired] = "SignalRouterAtom 缺少 @routeFrom 或 @routeTo", 
Ft[Et.OrderTargetRequired] = "OrderAtom 缺少 @orderBefore 或 @orderAfter", Ft[Et.AttachToRequired] = "DomainExtensionAtom 必须声明 @attachTo", 
Ft[Et.OnChainRequired] = "LogicAtom 必须声明 @onChain", Ft[Et.RoutePhaseRequired] = "@onChain 绑定路由器时必须指定路由阶段装饰器", 
Ft[Et.BindAtomTypeNotAllowed] = "@bindAtom 绑定的原子类型不允许", Ft[Et.DomainTargetInvalid] = "装饰器目标必须是 EntityDomainAtom", 
Ft[Et.OrderTargetTypeInvalid] = "排序目标必须是 LogicAtom / RenderAtom / SignalRouterAtom / VariantAtom", 
Ft[Et.VariantOfNotVariantAtom] = "@variantOf 仅限 VariantAtom 使用", Ft[Et.AttachToNotExtensionAtom] = "@attachTo 仅限 DomainExtensionAtom 使用", 
Ft[Et.EntityDataNotLogicAtom] = "@entityData 仅限 LogicAtom 使用", Ft[Et.OnChainNotLogicAtom] = "@onChain 仅限 LogicAtom 使用", 
Ft[Et.OnChainTargetNotChainable] = "@onChain 目标必须是可链接原子类型", Ft[Et.SignalStartConflict] = "@signalStart 与已有阶段冲突", 
Ft[Et.SignalEndConflict] = "@signalEnd 与已有阶段冲突", Ft[Et.RouteReceiveConflict] = "@routeReceive 与已有路由阶段冲突", 
Ft[Et.RouteDispatchConflict] = "@routeDispatch 与已有路由阶段冲突", Ft[Et.RouteTransformConflict] = "@routeTransform 与已有路由阶段冲突", 
Ft[Et.RouteFilterConflict] = "@routeFilter 与已有路由阶段冲突", Ft[Et.ReservedPropertyConflict] = "@bindAtom 属性名与基类保留属性冲突", 
Ft[Et.StorageReplaceDenied] = "禁止整体替换 runtime/storage，请修改具体字段", Ft[Et.StorageDeleteDenied] = "禁止删除 runtime/storage", 
Ft[Et.RoutePhaseOutOfScope] = "不在路由执行阶段内，禁止写入", Ft[Et.RoutePhasePropertyDenied] = "当前路由阶段不允许写入此属性", 
Ft[Et.ChainBindingRequired] = "需要 @onChain 声明才能修改", Ft[Et.ChainPhaseOutOfScope] = "不在生成链执行阶段内，禁止修改", 
Ft[Et.EntityDestroyDenied] = "实体不在当前域查询范围内，禁止销毁", Ft[Et.BoundaryBindingForbidden] = "LogicAtom 禁止直接 @onChain 绑定边界原子", 
Ft[Et.OrderScopeConflict] = "排序的两个原子不在同一执行链上", Ft[Et.SignalDomainConflict] = "路由绑定的实体域与信号域冲突", 
Ft[Et.SelfBinding] = "原子绑定了自身", Ft[Et.TransformEidInvalid] = "路由转换产生了不在目标域内的实体 ID", 
Ft[Et.BroadcastFilterForbidden] = "Broadcast 路由器禁止绑定 @routeFilter", Ft[Et.EntityDataConfigInvalid] = "@entityData 与 defineEntityData() 必须同时使用", 
Ft[Et.WorldFeaturesEmpty] = "世界未配置任何特性", Ft[Et.WorldEntityNoId] = "世界实体缺少 worldId", 
Ft[Et.GraphicsRequired] = "Graphics 组件未配置", Ft[Et.RenderGroupAssign] = "渲染属性分组不能直接赋值，请设置具体子属性", 
Ft[Et.RenderPropertyNotExist] = "渲染节点属性不存在", Ft[Et.RenderEventNotRegistered] = "渲染事件不在标准列表中", 
Ft[Et.AtomClassNotRegistered] = "原子类未注册", Ft[Et.AtomInstanceNotFound] = "原子实例不存在", 
Ft[Et.AtomTypeQueryFailed] = "原子类型查询失败（类未注册）", Ft[Et.TopologicalConflict] = "优先级约束与已有约束冲突", 
Ft[Et.TopologicalCycle] = "拓扑排序检测到循环依赖", Ft[Et.PriorityConstraintDuplicate] = "重复添加相同的优先级约束", 
Ft[Et.DomainRenderNotRegistered] = "域未注册渲染原子", Ft[Et.DomainRenderNoMatch] = "域所有渲染变体的 renderCondition() 均不满足", 
Ft[Et.InheritanceForbidden] = "原子类禁止继承", Ft[Et.AtomClassParamMissing] = "@atomClass 缺少 atomName 参数", 
Ft[Et.AtomNameInvalid] = "原子名不符合命名规范", Ft[Et.UnsupportedNodeType] = "不支持的渲染节点类型", 
Ft[Et.WarnSignalDomainCollect] = "信号执行期间禁止收集实体域", Ft[Et.WarnRootControlledProperty] = "根节点受控属性被显式设置", 
Ft), oe = ((Pt = {})[Et.BindAtomDuplicate] = "error", Pt[Et.VariantOfDuplicate] = "error", 
Pt[Et.AttachToDuplicate] = "error", Pt[Et.EntityRendererDuplicate] = "error", Pt[Et.OnChainDuplicate] = "error", 
Pt[Et.RouteFromDuplicate] = "error", Pt[Et.RouteToDuplicate] = "error", Pt[Et.OrderDecoratorDuplicate] = "error", 
Pt[Et.BindAtomRequired] = "error", Pt[Et.DomainBindingRequired] = "throw", Pt[Et.RouteEndpointRequired] = "throw", 
Pt[Et.OrderTargetRequired] = "throw", Pt[Et.AttachToRequired] = "throw", Pt[Et.OnChainRequired] = "throw", 
Pt[Et.RoutePhaseRequired] = "throw", Pt[Et.BindAtomTypeNotAllowed] = "error", Pt[Et.DomainTargetInvalid] = "error", 
Pt[Et.OrderTargetTypeInvalid] = "error", Pt[Et.VariantOfNotVariantAtom] = "error", 
Pt[Et.AttachToNotExtensionAtom] = "error", Pt[Et.EntityDataNotLogicAtom] = "error", 
Pt[Et.OnChainNotLogicAtom] = "error", Pt[Et.OnChainTargetNotChainable] = "throw", 
Pt[Et.SignalStartConflict] = "error", Pt[Et.SignalEndConflict] = "error", Pt[Et.RouteReceiveConflict] = "error", 
Pt[Et.RouteDispatchConflict] = "error", Pt[Et.RouteTransformConflict] = "error", 
Pt[Et.RouteFilterConflict] = "error", Pt[Et.ReservedPropertyConflict] = "error", 
Pt[Et.StorageReplaceDenied] = "error", Pt[Et.StorageDeleteDenied] = "error", Pt[Et.RoutePhaseOutOfScope] = "error", 
Pt[Et.RoutePhasePropertyDenied] = "error", Pt[Et.ChainBindingRequired] = "error", 
Pt[Et.ChainPhaseOutOfScope] = "error", Pt[Et.EntityDestroyDenied] = "error", Pt[Et.BoundaryBindingForbidden] = "error", 
Pt[Et.OrderScopeConflict] = "error", Pt[Et.SignalDomainConflict] = "error", Pt[Et.SelfBinding] = "error", 
Pt[Et.TransformEidInvalid] = "warn", Pt[Et.BroadcastFilterForbidden] = "error", 
Pt[Et.EntityDataConfigInvalid] = "error", Pt[Et.WorldFeaturesEmpty] = "throw", Pt[Et.WorldEntityNoId] = "error", 
Pt[Et.GraphicsRequired] = "throw", Pt[Et.RenderGroupAssign] = "error", Pt[Et.RenderPropertyNotExist] = "error", 
Pt[Et.RenderEventNotRegistered] = "error", Pt[Et.AtomClassNotRegistered] = "throw", 
Pt[Et.AtomInstanceNotFound] = "throw", Pt[Et.AtomTypeQueryFailed] = "error", Pt[Et.TopologicalConflict] = "throw", 
Pt[Et.TopologicalCycle] = "throw", Pt[Et.PriorityConstraintDuplicate] = "error", 
Pt[Et.DomainRenderNotRegistered] = "error", Pt[Et.DomainRenderNoMatch] = "error", 
Pt[Et.InheritanceForbidden] = "error", Pt[Et.AtomClassParamMissing] = "error", Pt[Et.AtomNameInvalid] = "error", 
Pt[Et.UnsupportedNodeType] = "throw", Pt[Et.WarnSignalDomainCollect] = "warn", Pt[Et.WarnRootControlledProperty] = "warn", 
Pt);
function re(t, e) {
var n = oe[t], o = function(t, e) {
var n, o, r = null !== (n = ne[t]) && void 0 !== n ? n : "未知错误", i = "[AE".concat(t, "] ").concat(r), a = null !== (o = e.reason) && void 0 !== o ? o : e.context, s = Object.entries(e).filter(function(t) {
var e = c(t, 2), n = e[0];
return void 0 !== e[1] && "reason" !== n && "context" !== n;
});
if (!a && 0 === s.length) return i;
var u = [];
return s.length > 0 && u.push(s.map(function(t) {
var e = c(t, 2), n = e[0], o = e[1];
return "".concat(n, "=").concat(o);
}).join(", ")), a && u.push("→ ".concat(a)), u.length > 0 ? "".concat(i, " | ").concat(u.join(" ")) : i;
}(t, e);
if ("throw" === n) throw new Error(o);
}
t.RouteMode = void 0, (Ot = t.RouteMode || (t.RouteMode = {})).Direct = "direct", 
Ot.Broadcast = "broadcast", t.ReceiveAction = void 0, (Lt = t.ReceiveAction || (t.ReceiveAction = {})).Queue = "queue", 
Lt.Replace = "replace", Lt.Discard = "discard", t.DispatchAction = void 0, (Bt = t.DispatchAction || (t.DispatchAction = {})).FireOnce = "fireOnce", 
Bt.Defer = "defer", Bt.Cancel = "cancel", t.FilterAction = void 0, (Gt = t.FilterAction || (t.FilterAction = {})).FireOnce = "fireOnce", 
Gt.FireRepeat = "fireRepeat", Gt.Defer = "defer", Gt.Cancel = "cancel", t.RoutePhase = void 0, 
(kt = t.RoutePhase || (t.RoutePhase = {}))[kt.Receive = 1] = "Receive", kt[kt.Transform = 2] = "Transform", 
kt[kt.Dispatch = 3] = "Dispatch", kt[kt.Filter = 4] = "Filter", (Wt = {})[t.RoutePhase.Receive] = "receiveAction", 
Wt[t.RoutePhase.Transform] = "transformedEidList", Wt[t.RoutePhase.Dispatch] = "dispatchAction", 
Wt[t.RoutePhase.Filter] = "filterAction";
var ie = {
getBindValue: function(t) {
return t.atomState;
}
};
function ae(t, e) {
if ("function" != typeof t.atomState) throw new TypeError('[AtomEngine] 原子 "'.concat(t.atomName, '" 的函数实现不可调用'));
return t.atomState.apply(t, d([], c(e), !1));
}
function se(t) {
var e;
return (null === (e = t.variantChain) || void 0 === e ? void 0 : e.resolve()) || t;
}
var ue = ((Vt = {}).EntityDomainAtom = {
getBindValue: function(t, e, n) {
return e.isComponentQuery(n) ? Object.create(t, {
collect: {
value: t.collectByComponent.bind(t)
},
has: {
value: t.hasByComponent.bind(t)
},
count: {
value: t.countByComponent.bind(t)
}
}) : t;
}
}, Vt.EntityRelationAtom = {
getBindValue: function(t) {
return t;
}
}, Vt.FunctionAtom = {
getBindValue: function(t) {
return function() {
for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
return ae(se(t), e);
};
}
}, Vt.SignalAtom = {
getBindValue: function(t) {
return t;
}
}, Vt.AudioAtom = {
getBindValue: function(t) {
return t;
}
}, Vt.WorldInputAtom = {
getBindValue: function(t) {
return t;
}
}, Vt.DomainExtensionAtom = {
getBindValue: function(t) {
return t;
}
}, Vt);
function le(t, e) {
var n, o;
void 0 === e && (e = {});
var r = ue[t];
return {
getBindValue: null !== (o = null !== (n = e.getBindValue) && void 0 !== n ? n : null == r ? void 0 : r.getBindValue) && void 0 !== o ? o : ie.getBindValue
};
}
var ce = ((jt = {}).RenderAtom = ((Ht = {}).EntityDomainAtom = le("EntityDomainAtom"), 
Ht.DomainExtensionAtom = le("DomainExtensionAtom"), Ht.LogicAtom = le("LogicAtom"), 
Ht.LoadAtom = le("LoadAtom"), Ht.RenderAtom = le("RenderAtom"), Ht.ConfigAtom = le("ConfigAtom"), 
Ht.SignalRouterAtom = le("SignalRouterAtom"), Ht.InputAtom = le("InputAtom"), Ht.FunctionAtom = le("FunctionAtom"), 
Ht.EntityRelationAtom = le("EntityRelationAtom"), Ht), jt.SignalAtom = ((zt = {}).EntityDomainAtom = le("EntityDomainAtom"), 
zt), jt.SignalRouterAtom = ((Ut = {}).SignalAtom = le("SignalAtom"), Ut.InputAtom = le("InputAtom"), 
Ut.WorldInputAtom = le("WorldInputAtom"), Ut), jt.LogicAtom = ((Yt = {}).NativeAtom = le("NativeAtom"), 
Yt.LogicAtom = le("LogicAtom"), Yt.OutputAtom = le("OutputAtom"), Yt.LoadAtom = le("LoadAtom"), 
Yt.InputAtom = le("InputAtom"), Yt.FunctionAtom = le("FunctionAtom"), Yt.ConfigAtom = le("ConfigAtom"), 
Yt.WorldAtom = le("WorldAtom"), Yt.RenderAtom = le("RenderAtom"), Yt.SignalAtom = le("SignalAtom"), 
Yt.SignalRouterAtom = le("SignalRouterAtom"), Yt.WorldInputAtom = le("WorldInputAtom"), 
Yt.EntityDomainAtom = le("EntityDomainAtom"), Yt.EntityRelationAtom = le("EntityRelationAtom"), 
Yt.DomainExtensionAtom = le("DomainExtensionAtom"), Yt.AudioAtom = le("AudioAtom"), 
Yt), jt.ConfigAtom = ((qt = {}).ConfigAtom = le("ConfigAtom"), qt), jt.EntityDomainAtom = ((Xt = {}).EntityComponentAtom = le("EntityComponentAtom"), 
Xt.EntityDomainAtom = le("EntityDomainAtom"), Xt.EntityRelationAtom = le("EntityRelationAtom"), 
Xt), jt.DomainExtensionAtom = ((Qt = {}).EntityDomainAtom = le("EntityDomainAtom"), 
Qt.EntityComponentAtom = le("EntityComponentAtom"), Qt), jt.FunctionAtom = ((Jt = {}).NativeAtom = le("NativeAtom"), 
Jt.LogicAtom = le("LogicAtom"), Jt.OutputAtom = le("OutputAtom"), Jt.LoadAtom = le("LoadAtom"), 
Jt.InputAtom = le("InputAtom"), Jt.FunctionAtom = le("FunctionAtom"), Jt.ConfigAtom = le("ConfigAtom"), 
Jt.WorldAtom = le("WorldAtom"), Jt.RenderAtom = le("RenderAtom"), Jt.SignalRouterAtom = le("SignalRouterAtom"), 
Jt.WorldInputAtom = le("WorldInputAtom"), Jt.EntityDomainAtom = le("EntityDomainAtom"), 
Jt.EntityRelationAtom = le("EntityRelationAtom"), Jt.DomainExtensionAtom = le("DomainExtensionAtom"), 
Jt.AudioAtom = le("AudioAtom"), Jt), jt.VariantAtom = ((Zt = {}).NativeAtom = le("NativeAtom"), 
Zt.LogicAtom = le("LogicAtom"), Zt.OutputAtom = le("OutputAtom"), Zt.LoadAtom = le("LoadAtom"), 
Zt.InputAtom = le("InputAtom"), Zt.FunctionAtom = {
getBindValue: function(t, e, n) {
var o = t;
return n && (null == e ? void 0 : e.isVariantSource(n)) ? function() {
for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
return ae(o, t);
} : function() {
for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
return ae(se(o), t);
};
}
}, Zt.ConfigAtom = le("ConfigAtom"), Zt.WorldAtom = le("WorldAtom"), Zt.RenderAtom = le("RenderAtom"), 
Zt.SignalAtom = le("SignalAtom"), Zt.SignalRouterAtom = le("SignalRouterAtom"), 
Zt.WorldInputAtom = le("WorldInputAtom"), Zt.EntityDomainAtom = le("EntityDomainAtom"), 
Zt.EntityRelationAtom = le("EntityRelationAtom"), Zt.DomainExtensionAtom = le("DomainExtensionAtom"), 
Zt.AudioAtom = le("AudioAtom"), Zt), jt.InputAtom = ((Kt = {}).EntityDomainAtom = le("EntityDomainAtom"), 
Kt), jt.WorldInputAtom = (($t = {}).EntityDomainAtom = le("EntityDomainAtom"), $t), 
jt.OrderAtom = ((te = {}).OrderAtom = le("OrderAtom"), te.LogicAtom = le("LogicAtom"), 
te.RenderAtom = le("RenderAtom"), te.VariantAtom = le("VariantAtom"), te.SignalRouterAtom = le("SignalRouterAtom"), 
te), jt.LoadAtom = ((ee = {}).ConfigAtom = le("ConfigAtom"), ee.LogicAtom = le("LogicAtom"), 
ee.LoadAtom = le("LoadAtom"), ee.FunctionAtom = le("FunctionAtom"), ee), jt.WorldAtom = {}, 
jt.EntityComponentAtom = {}, jt.EntityRelationAtom = {}, jt.OutputAtom = {}, jt), de = {
getBindValue: function(t, e, n) {
var o = t.atomWorld.getAtomIns(e), r = ce[t.atomType][o.atomType].getBindValue(o, t, n);
return r[ye] || _(r, ye, o.atomName), r[ve] || _(r, ve, o.atomType), r;
},
canBind: function(t, e) {
var n;
return Boolean(null === (n = ce[t]) || void 0 === n ? void 0 : n[e]);
}
}, he = new Map(), pe = function(t, e) {
he.set(t, e);
};
pe("SignalAtom", function(t) {
var e = t.filterDepsByType("EntityDomainAtom");
1 !== e.length && re(Et.DomainBindingRequired, {
atom: t.atomName,
reason: "当前绑定数量: ".concat(e.length, "，需要恰好 1 个")
});
}), pe("SignalRouterAtom", function(t) {
var e = t.getRouteFromAtomName(), n = t.getRouteToAtomName();
e && n || re(Et.RouteEndpointRequired, {
atom: t.atomName,
routeFrom: null != e ? e : "未标记",
routeTo: null != n ? n : "未标记"
});
}), pe("OrderAtom", function(t) {
var e = t.getOrderBeforeAtomName(), n = t.getOrderAfterAtomName();
e && n || re(Et.OrderTargetRequired, {
atom: t.atomName,
orderBefore: null != e ? e : "未标记",
orderAfter: null != n ? n : "未标记"
});
}), pe("DomainExtensionAtom", function(t) {
var e = t.constructor, n = e.__bindingMeta;
if (n) if (n.attachToProperty) {
var o = n.propToAtom.get(n.attachToProperty);
if (o) {
var r = t.getDepAtomType(o);
"EntityDomainAtom" !== r && re(Et.DomainTargetInvalid, {
class: e.name,
decorator: "@attachTo",
actual: r
});
}
} else re(Et.AttachToRequired, {
atom: t.atomName
});
});
var fe, me, ye = Symbol.for("atomengine.atomName"), ve = Symbol.for("atomengine.atomType"), _e = Symbol.for("atomengine.inheritableAtom"), ge = function() {
function t() {
this.atomType = this.constructor.atomType, this.atomWorld = null, this.atomName = null, 
this._isReady = !1;
}
return Object.defineProperty(t, "atomType", {
get: function() {
return null;
},
enumerable: !1,
configurable: !0
}), t.prototype.getDependencies = function() {
return this.constructor.__dependencies;
}, t.prototype.getFeatureName = function() {
return this.constructor.__atomFeatureName;
}, t.prototype.getDepAtomType = function(t) {
return this.atomWorld.getAtomType(t);
}, t.prototype.findDepByType = function(t) {
var e = this;
return this.getDependencies().find(function(n) {
return e.atomWorld.getAtomType(n) === t;
});
}, t.prototype.filterDepsByType = function(t) {
var e = this;
return this.getDependencies().filter(function(n) {
return e.atomWorld.getAtomType(n) === t;
});
}, t.prototype.isDepType = function(t, e) {
return this.atomWorld.getAtomType(t) === e;
}, t.prototype.isComponentQuery = function(t) {
var e, n, o;
return null !== (o = null === (n = null === (e = this.constructor.__bindingMeta) || void 0 === e ? void 0 : e.componentQueryProps) || void 0 === n ? void 0 : n.has(t)) && void 0 !== o && o;
}, t.prototype.isVariantSource = function(t) {
var e;
return (null === (e = this.constructor.__bindingMeta) || void 0 === e ? void 0 : e.variantSourceProperty) === t;
}, t.prototype.getBoundAtomName = function(t) {
var e;
return null === (e = this.constructor.__bindingMeta) || void 0 === e ? void 0 : e.propToAtom.get(t);
}, t.prototype.ready = function() {
return s(this, void 0, void 0, function() {
var t, e, n, o, r, i;
return u(this, function(a) {
switch (a.label) {
case 0:
if (this._isReady) return [ 2 ];
this._isReady = !0, a.label = 1;

case 1:
a.trys.push([ 1, 6, 7, 8 ]), t = l(this.getDependencies()), e = t.next(), a.label = 2;

case 2:
return e.done ? [ 3, 5 ] : (n = e.value, [ 4, this.atomWorld.getAtomIns(n).ready() ]);

case 3:
if (a.sent(), !this.atomWorld) return [ 2 ];
a.label = 4;

case 4:
return e = t.next(), [ 3, 2 ];

case 5:
return [ 3, 8 ];

case 6:
return o = a.sent(), r = {
error: o
}, [ 3, 8 ];

case 7:
try {
e && !e.done && (i = t.return) && i.call(t);
} finally {
if (r) throw r.error;
}
return [ 7 ];

case 8:
return [ 4, this.onReady() ];

case 9:
return a.sent(), [ 2 ];
}
});
});
}, t.prototype.onReady = function() {
return s(this, void 0, void 0, function() {
return u(this, function() {
return [ 2 ];
});
});
}, t.prototype.collectLoad = function() {}, t.prototype.registerToChain = function() {
return null;
}, t.prototype.unregisterFromChain = function() {
return !1;
}, t.prototype.getChain = function() {
return null;
}, t.prototype.getTopologicalChain = function() {
return null;
}, t.prototype.init = function(t, e) {
var n, o;
this.atomName = t, this.atomWorld = e, ze(this);
try {
for (var r = l(this.getDependencies()), i = r.next(); !i.done; i = r.next()) {
var a = i.value;
this.atomWorld._createAtom(a, t);
}
} catch (t) {
n = {
error: t
};
} finally {
try {
i && !i.done && (o = r.return) && o.call(r);
} finally {
if (n) throw n.error;
}
}
this.collectLoad();
}, t.prototype.dispose = function() {
this.atomState = null, this.atomWorld = null;
}, t;
}(), Ae = function() {
function t(t) {
this.atoms = [], this.constraints = new Map(), this.needsSorting = !0, this.sortedCache = null, 
this.instanceCache = null, this._atomWorld = t;
}
return t.prototype.hasAtoms = function() {
return this.atoms.length > 0;
}, t.prototype.addAtom = function(t) {
this.atoms.includes(t) || (this.atoms.push(t), this.markDirty(), this.onAtomRegistered(t));
}, t.prototype.removeAtom = function(t) {
var e, n, o = this.atoms.indexOf(t);
-1 !== o && (this.atoms.splice(o, 1), this.markDirty(), this.onAtomUnregistered(t)), 
this.constraints.delete(t);
try {
for (var r = l(this.constraints.values()), i = r.next(); !i.done; i = r.next()) i.value.delete(t);
} catch (t) {
e = {
error: t
};
} finally {
try {
i && !i.done && (n = r.return) && n.call(r);
} finally {
if (e) throw e.error;
}
}
return 0 === this.atoms.length;
}, t.prototype.onAtomRegistered = function() {}, t.prototype.onAtomUnregistered = function() {}, 
t.prototype.addConstraint = function(t, e) {
var n, o;
if (null === (n = this.constraints.get(e)) || void 0 === n ? void 0 : n.has(t)) re(Et.PriorityConstraintDuplicate, {
higher: t,
lower: e
}); else {
(null === (o = this.constraints.get(t)) || void 0 === o ? void 0 : o.has(e)) && re(Et.TopologicalConflict, {
higher: t,
lower: e,
reason: "已存在 ".concat(e, " -> ").concat(t, "，尝试添加 ").concat(t, " -> ").concat(e)
});
var r = this.constraints.get(e);
r || (r = new Set(), this.constraints.set(e, r)), r.add(t), this.markDirty();
}
}, t.prototype.removeConstraint = function(t, e) {
var n = this.constraints.get(e);
n && (n.delete(t), 0 === n.size && this.constraints.delete(e)), this.markDirty();
}, t.prototype.markDirty = function() {
this.needsSorting = !0, this.instanceCache = null;
}, t.prototype.getInstances = function() {
var t = this;
return this.needsSorting && (this.sortedCache = this.topologicalSort(), this.needsSorting = !1, 
this.instanceCache = null), this.instanceCache || (this.instanceCache = this.sortedCache.map(function(e) {
return t._atomWorld.atomInstanceMap.get(e);
})), this.instanceCache;
}, t.prototype.compareAtoms = function(t, e) {
return t.localeCompare(e);
}, t.prototype.topologicalSort = function() {
var t, e, n, o, r, i, a, s, u, h, p, f, m, y, v, _, g = this.atoms, A = new Set(g);
if (g.length <= 1) return d([], c(g), !1);
var C = new Map(), R = new Map();
try {
for (var S = l(g), T = S.next(); !T.done; T = S.next()) {
var b = T.value;
C.set(b, []), R.set(b, 0);
}
} catch (e) {
t = {
error: e
};
} finally {
try {
T && !T.done && (e = S.return) && e.call(S);
} finally {
if (t) throw t.error;
}
}
try {
for (var w = l(g), F = w.next(); !F.done; F = w.next()) {
var E = F.value, N = this.getExtraDependencies(E);
try {
for (var x = (r = void 0, l(N)), I = x.next(); !I.done; I = x.next()) {
var D = I.value;
A.has(D) && (C.get(D).push(E), R.set(E, R.get(E) + 1));
}
} catch (t) {
r = {
error: t
};
} finally {
try {
I && !I.done && (i = x.return) && i.call(x);
} finally {
if (r) throw r.error;
}
}
}
} catch (t) {
n = {
error: t
};
} finally {
try {
F && !F.done && (o = w.return) && o.call(w);
} finally {
if (n) throw n.error;
}
}
try {
for (var M = l(g), P = M.next(); !P.done; P = M.next()) {
E = P.value;
var W = this.constraints.get(E);
if (W) try {
for (var O = (u = void 0, l(W)), L = O.next(); !L.done; L = O.next()) {
var B = L.value;
A.has(B) && (C.get(B).push(E), R.set(E, R.get(E) + 1));
}
} catch (t) {
u = {
error: t
};
} finally {
try {
L && !L.done && (h = O.return) && h.call(O);
} finally {
if (u) throw u.error;
}
}
}
} catch (t) {
a = {
error: t
};
} finally {
try {
P && !P.done && (s = M.return) && s.call(M);
} finally {
if (a) throw a.error;
}
}
var G = new Set(), k = [];
try {
for (var V = l(g), j = V.next(); !j.done; j = V.next()) {
var H = j.value;
0 === R.get(H) && G.add(H);
}
} catch (t) {
p = {
error: t
};
} finally {
try {
j && !j.done && (f = V.return) && f.call(V);
} finally {
if (p) throw p.error;
}
}
for (;G.size > 0; ) {
var z = null;
try {
for (var U = (m = void 0, l(G)), Y = U.next(); !Y.done; Y = U.next()) {
var q = Y.value;
(!z || this.compareAtoms(q, z) < 0) && (z = q);
}
} catch (t) {
m = {
error: t
};
} finally {
try {
Y && !Y.done && (y = U.return) && y.call(U);
} finally {
if (m) throw m.error;
}
}
G.delete(z), k.push(z);
try {
for (var X = (v = void 0, l(C.get(z))), Q = X.next(); !Q.done; Q = X.next()) {
var J = Q.value, Z = R.get(J) - 1;
R.set(J, Z), 0 === Z && G.add(J);
}
} catch (t) {
v = {
error: t
};
} finally {
try {
Q && !Q.done && (_ = X.return) && _.call(X);
} finally {
if (v) throw v.error;
}
}
}
if (k.length !== g.length) {
var K = g.filter(function(t) {
return !k.includes(t);
});
re(Et.TopologicalCycle, {
nodes: K.join(", ")
});
}
return k;
}, t;
}(), Ce = function(t) {
function e(e, n) {
var o = t.call(this, e) || this;
return o._ownerAtomName = n, o;
}
return n(e, t), e.prototype.getExtraDependencies = function() {
return [];
}, e.prototype.execute = function(t) {
return s(this, void 0, void 0, function() {
var e, n, o, r, i, a, s, c, d, h, p, f, m;
return u(this, function(u) {
switch (u.label) {
case 0:
u.trys.push([ 0, 6, 7, 8 ]), e = l(this.getInstances()), n = e.next(), u.label = 1;

case 1:
return n.done ? [ 3, 5 ] : [ 4, (s = n.value).ready() ];

case 2:
return u.sent(), [ 4, this._readyVariantChain(s.variantChain) ];

case 3:
u.sent(), u.label = 4;

case 4:
return n = e.next(), [ 3, 1 ];

case 5:
return [ 3, 8 ];

case 6:
return o = u.sent(), d = {
error: o
}, [ 3, 8 ];

case 7:
try {
n && !n.done && (h = e.return) && h.call(e);
} finally {
if (d) throw d.error;
}
return [ 7 ];

case 8:
r = null != t ? t : this._atomWorld.rootEid, this._atomWorld.currentGenChainOwner = this._ownerAtomName;
try {
for (i = l(this.getInstances()), a = i.next(); !a.done; a = i.next()) s = a.value, 
(c = null === (m = s.variantChain) || void 0 === m ? void 0 : m.resolve()) ? c.atomState(r, s.atomState) : s.onExecute(r, s.atomState);
} catch (t) {
p = {
error: t
};
} finally {
try {
a && !a.done && (f = i.return) && f.call(i);
} finally {
if (p) throw p.error;
}
}
return this._atomWorld.currentGenChainOwner = null, [ 2 ];
}
});
});
}, e.prototype._readyVariantChain = function(t) {
return s(this, void 0, void 0, function() {
var e, n, o, r, i;
return u(this, function(a) {
switch (a.label) {
case 0:
if (!t) return [ 2 ];
a.label = 1;

case 1:
a.trys.push([ 1, 6, 7, 8 ]), e = l(t.getInstances()), n = e.next(), a.label = 2;

case 2:
return n.done ? [ 3, 5 ] : [ 4, n.value.ready() ];

case 3:
a.sent(), a.label = 4;

case 4:
return n = e.next(), [ 3, 2 ];

case 5:
return [ 3, 8 ];

case 6:
return o = a.sent(), r = {
error: o
}, [ 3, 8 ];

case 7:
try {
n && !n.done && (i = e.return) && i.call(e);
} finally {
if (r) throw r.error;
}
return [ 7 ];

case 8:
return [ 2 ];
}
});
});
}, e.prototype.topologicalSort = function() {
var e = t.prototype.topologicalSort.call(this);
return e.length, e;
}, e;
}(Ae), Re = new Map(), Se = new Map(), Te = new Set([ "FunctionAtom", "ConfigAtom", "EntityDomainAtom", "EntityComponentAtom", "EntityRelationAtom", "AudioAtom", "WorldAtom", "DomainExtensionAtom" ]);
function be(t) {
return t.__bindingMeta || (t.__bindingMeta = {
propToAtom: new Map(),
entityRenderer: null,
componentQueryProps: null,
routeFromProperty: null,
routeToProperty: null,
routeMode: null,
orderBeforeProperty: null,
orderAfterProperty: null,
chainRegistration: null,
variantSourceProperty: null,
chainWritableProperties: null,
signalPhase: null,
routePhase: null,
attachToProperty: null,
entityDataProperty: null
}), t.__bindingMeta;
}
function we(t, e) {
var n = Re.get(t);
return n || re(Et.AtomClassNotRegistered, {
atom: t,
requestedBy: e
}), n;
}
function Fe(t) {
var e = t.lastIndexOf("_");
return -1 === e ? (re(Et.AtomNameInvalid, {
atom: t,
reason: "缺少下划线分隔符"
}), t) : t.substring(0, e);
}
function Ee(t, e) {
Te.has(t.atomType) || function(t, e) {
var n = t.__atomFeatureName, o = Se.get(n);
o ? o.push(e) : Se.set(n, [ e ]);
}(t, e);
}
function Ne(t) {
t.__dependencies || (t.__dependencies = []);
}
function xe(t, e) {
Ne(t), t.__dependencies.includes(e) || t.__dependencies.push(e);
}
function Ie(t) {
return function(e) {
return Ne(e), e.__atomName = t, e.__atomFeatureName = Fe(t), Ee(e, t), Re.set(t, e), 
e;
};
}
function De(t) {
return function(e, n) {
var o = e.constructor, r = be(o);
xe(o, t), r.propToAtom.set(n, t), Object.defineProperty(e, n, {
get: function() {
var e = de.getBindValue(this, t, n);
return Object.defineProperty(this, n, {
value: e,
writable: !1,
enumerable: !1,
configurable: !1
}), e;
},
set: function() {},
enumerable: !1,
configurable: !0
});
};
}
function Me(t, e) {
be(t.constructor).entityRenderer = e;
}
function Pe(t, e) {
be(t.constructor).chainRegistration = {
ownerProperty: e,
chainType: null,
chainField: null,
chainCtor: null
};
}
function We(e) {
be(e.constructor).routePhase = t.RoutePhase.Receive;
}
function Oe(t, e) {
be(t.constructor).routeFromProperty = e;
}
function Le(t) {
return function(e, n) {
var o = be(e.constructor);
o.routeToProperty = n, o.routeMode = t;
};
}
function Be(t, e) {
return function(t, n) {
var o = be(t.constructor);
e(o, n);
};
}
var Ge = Be(0, function(t, e) {
return t.orderBeforeProperty = e;
}), ke = Be(0, function(t, e) {
return t.orderAfterProperty = e;
}), Ve = {
start: {
chainType: "SignalStart",
chainField: "beginChain"
},
trigger: {
chainType: "SignalTrigger",
chainField: "triggerChain"
},
end: {
chainType: "SignalEnd",
chainField: "endChain"
}
}, je = ((fe = {})[t.RoutePhase.Receive] = {
chainType: "RouteReceive",
chainField: "receiveChain"
}, fe[t.RoutePhase.Transform] = {
chainType: "RouteTransform",
chainField: "transformChain"
}, fe[t.RoutePhase.Dispatch] = {
chainType: "RouteDispatch",
chainField: "dispatchChain"
}, fe[t.RoutePhase.Filter] = {
chainType: "RouteFilter",
chainField: "filterChain"
}, fe), He = ((me = {}).ConfigAtom = {
chainType: "ConfigGen",
chainField: "genChain"
}, me.RenderAtom = {
chainType: "RenderGen",
chainField: "genChain"
}, me);
function ze(t) {
var e, n, o = t.constructor, r = o.__bindingMeta;
if (r) {
var i = r.chainRegistration;
if (i && null === i.chainType) {
var a = r.propToAtom.get(i.ownerProperty);
if (a) {
var s = t.getDepAtomType(a);
if ("SignalAtom" === s) {
var u = null !== (e = r.signalPhase) && void 0 !== e ? e : "trigger", l = Ve[u];
i.chainType = l.chainType, i.chainField = l.chainField, i.chainCtor = null;
} else if ("SignalRouterAtom" === s) {
if (!(u = r.routePhase)) return void re(Et.RoutePhaseRequired, {
class: o.name,
property: i.ownerProperty,
target: a
});
l = je[u], i.chainType = l.chainType, i.chainField = l.chainField, i.chainCtor = null;
} else {
if (!(l = He[s])) return void re(Et.OnChainTargetNotChainable, {
class: o.name,
target: a,
actual: s
});
i.chainType = l.chainType, i.chainField = l.chainField, i.chainCtor = Ce, (null !== (n = r.chainWritableProperties) && void 0 !== n ? n : r.chainWritableProperties = new Set()).add(i.ownerProperty);
}
}
}
}
}
var Ue, Ye, qe = "G_FAtom_RootDomain", Xe = "G_FAtom_WorldDomain", Qe = "G_FAtom_Update", Je = "G_FAtom_Pointer", Ze = "G_FAtom_Keyboard", Ke = "G_FAtom_WindowSize", $e = "G_FAtom_Scroll", tn = "G_FAtom_SizeInput", en = "G_FAtom_PositionInput", nn = "G_FAtom_Edit", on = "G_FAtom_Animation", rn = "G_FAtom_WorldCreate", an = "G_FAtom_WorldLoadProgress", sn = "G_FAtom_PageHide", un = "G_FAtom_PageShow", ln = "G_FAtom_DateNow", cn = "G_FAtom_SaveProgress", dn = "G_FAtom_AutoSaveSignal", hn = "G_FAtom_AutoSaveRouter", pn = "G_FAtom_TweenRunnerSignal", fn = "G_FAtom_TweenRunner", mn = "G_FAtom_ChildOf", yn = "G_FAtom_Transform", vn = "G_FAtom_BoxComponent", _n = "G_FAtom_WorldState", gn = "G_FAtom_DomainOf", An = "G_FAtom_OriginalCtrlInput", Cn = "G_FAtom_ReloadConfigInput", Rn = "G_FAtom_Silent", Sn = "G_FAtom_JsonData", Tn = "G_FAtom_PreButtonClick", bn = "G_FAtom_PreTouchEnd", wn = "G_FAtom_RichTextClick", Fn = function() {
function t(t) {
this._bundleTotal = 0, this._bundleCompleted = 0, this._atomTotal = null, this._atomCompleted = 0, 
this._error = null, this._cancelled = !1, this._lastNotified = 0, this._world = t;
}
return Object.defineProperty(t.prototype, "progress", {
get: function() {
return .3 * (this._bundleTotal > 0 ? this._bundleCompleted / this._bundleTotal : 1) + .7 * (null === this._atomTotal ? 0 : this._atomTotal > 0 ? this._atomCompleted / this._atomTotal : 1);
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(t.prototype, "isDone", {
get: function() {
return this._bundleCompleted >= this._bundleTotal && null !== this._atomTotal && this._atomCompleted >= this._atomTotal && !this._error && !this._cancelled;
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(t.prototype, "completed", {
get: function() {
return this._bundleCompleted + this._atomCompleted;
},
enumerable: !1,
configurable: !0
}), t.prototype.addBundleItems = function(t) {
void 0 === t && (t = 1), this._bundleTotal += t;
}, t.prototype.completeBundle = function(t) {
void 0 === t && (t = 1), this._bundleCompleted += t, this._tryNotify();
}, t.prototype.addItems = function(t) {
var e;
void 0 === t && (t = 1), this._atomTotal = (null !== (e = this._atomTotal) && void 0 !== e ? e : 0) + t;
}, t.prototype.startAtomPhase = function() {
var t;
null !== (t = this._atomTotal) && void 0 !== t || (this._atomTotal = 0), this._tryNotify();
}, t.prototype.complete = function(t) {
void 0 === t && (t = 1), this._atomCompleted += t, this._tryNotify();
}, t.prototype.fail = function(t) {
var e;
this._error = t;
var n = this._world.config;
null === (e = n.onLoadError) || void 0 === e || e.call(n, t), this._notifyParent(!1, t);
var o = n.parentWorld, r = n.entityInParent;
if (o && !o.disposed && r) {
var i = o.getAtomIns(Xe);
i.has(r) && i.destroy(r);
}
}, t.prototype._tryNotify = function() {
if (!this._error && !this._cancelled) {
var t = this.progress;
(t - this._lastNotified >= .02 || t >= 1) && (this._lastNotified = t, this._notifyProgress());
}
}, t.prototype._notifyProgress = function() {
var t, e = this._world.config;
e.parentWorld, null === (t = e.onLoadProgress) || void 0 === t || t.call(e, this.progress, this.completed), 
this._notifyParent(this.isDone);
}, t.prototype._notifyParent = function(t, e, n) {
var o, r = this._world.config, i = r.parentWorld, a = r.entityInParent;
if (i && a && !i.disposed && i.getAtomIns(Xe).has(a)) {
var s = i.getAtomIns(an);
s.data.worldId = this._world.config.worldId, s.data.progress = t ? 1 : this.progress, 
s.data.isDone = t, s.data.isCancelled = null != n && n, s.data.error = null !== (o = null == e ? void 0 : e.message) && void 0 !== o ? o : "", 
s.emit(a), this._world.universe.host.notifyWorldLoadState(i.config.worldId, s.data);
}
}, t.prototype.cancel = function() {
this.isDone || this._error || this._cancelled || (this._cancelled = !0, this._notifyParent(!1, void 0, !0));
}, t;
}(), En = globalThis, Nn = En.__errorHandler;
function xn(t, e, n, o) {
var r, i, a, s;
if (Nn) {
var u;
if (o.includes("atomengine") && (u = En.__atomEngineCurrentWorld)) {
var l = null !== (r = En.__atomEngineCurrentRenderAtom) && void 0 !== r ? r : "-";
n = "[AtomEngine logic=".concat(null !== (i = u.currentExecutingLogicAtom) && void 0 !== i ? i : "-", " domain=").concat(null !== (a = u.currentSignalEntityDomain) && void 0 !== a ? a : "-", " genChainOwner=").concat(null !== (s = u.currentGenChainOwner) && void 0 !== s ? s : "-", " renderAtom=").concat(l, " worldId=").concat(u.config.worldId, " worldPath=").concat(u.config.worldPath, "] ").concat(n);
}
Nn(t, e, n, o);
}
}
function In(t) {
var e = En.__atomEngineCurrentWorld;
return En.__atomEngineCurrentWorld = t, e;
}
function Dn(t) {
En.__atomEngineCurrentWorld === t && (En.__atomEngineCurrentWorld = void 0);
}
function Mn(t) {
En.__atomEngineCurrentRenderAtom = t;
}
Object.defineProperty(En, "__errorHandler", {
configurable: !0,
get: function() {
return xn;
},
set: function(t) {
Nn = t;
}
}), t.G_FAtom = void 0, ((Ue = t.G_FAtom || (t.G_FAtom = {})).FeatureName || (Ue.FeatureName = {})).Name = "G_FAtom", 
function(t) {
t[t.RenderCreate = 0] = "RenderCreate", t[t.RenderDestroy = 1] = "RenderDestroy", 
t[t.RelationAdd = 2] = "RelationAdd", t[t.RelationRemove = 3] = "RelationRemove", 
t[t.WorldCreate = 4] = "WorldCreate", t[t.WorldDestroy = 5] = "WorldDestroy", t[t.WorldRestart = 6] = "WorldRestart";
}(Ye || (Ye = {}));
var Pn, Wn, On, Ln, Bn, Gn, kn, Vn, jn, Hn, zn = function() {
function e(t) {
this.universe = null, this.config = {
worldId: "",
worldPath: "",
randomSeed: 0,
parentWorld: null,
entityInParent: 0,
initialWidth: 0,
initialHeight: 0,
multiTouch: !1
}, this.isPaused = !1, this.disposed = !1, this._creationOrder = [], this.frameTimeIncrement = 1 / 60, 
this.performanceCutoff = 1, this.minimumUpdateInterval = 1 / 60, this._childWorlds = new Map(), 
this.atomSnapshots = {}, this.pendingRouterSignals = [], this.randomSeed = 0, this.ecsWorld = function() {
for (var t, e, n = [], o = 0; o < arguments.length; o++) n[o] = arguments[o];
return n.forEach(function(n) {
"object" == typeof n && "dense" in n && "sparse" in n && "aliveCount" in n ? t = n : "object" == typeof n && (e = n);
}), function(t, e) {
return _(t || {}, C, {
entityIndex: e || g(),
entityMasks: [ [] ],
entityComponents: new Map(),
bitflag: 1,
componentMap: new Map(),
componentCount: 0,
queries: new Set(),
queriesHashMap: new Map(),
notQueries: new Set(),
dirtyQueries: new Set(),
entitiesWithRelations: new Set(),
hierarchyData: new Map(),
hierarchyActiveRelations: new Set(),
hierarchyQueryCache: new Map()
});
}(e, t);
}(), this.ready = !1, this.autoResizeBox = !1, this.accumulatedTimeParameter = 0, 
this.atomInstanceMap = new Map(), this.signalRouters = new Map(), this.dirtyEntityComponents = new Map(), 
this.domainToLogicMap = new Map(), this.storageAtoms = new Set(), this.dirtyStorageAtoms = new Set(), 
this._shouldSaveProgress = !1, this.expandedEntityDirtyAtomsCache = null, this.prevMultiTouch = !1, 
this.worldChanges = [], this.pendingInputs = [], this.pendingReadyAtoms = [], this.currentSignalEntityDomain = null, 
this.currentExecutingLogicAtom = null, this.currentGenChainOwner = null, this.universe = t;
}
return e.prototype.isSignalEntityDomain = function(t) {
return this.currentSignalEntityDomain === t;
}, e.prototype.initFromConfig = function(t) {
this.config = o({}, t), this.config.randomSeed = t.randomSeed || Math.floor(2147483646 * Math.random()) + 1;
}, e.prototype._computeTimeSteps = function(t, e, n) {
if ((t += n) < e) return [ 0, t ];
var o = Math.min(Math.floor(t / e), this.performanceCutoff), r = t - o * e;
return [ o, Math.min(r, this.minimumUpdateInterval) ];
}, e.prototype.worldUpdate = function(t) {
var e = -1 === t ? this.frameTimeIncrement : t, n = c(this._computeTimeSteps(this.accumulatedTimeParameter, this.frameTimeIncrement, e), 2), o = n[0], r = n[1];
this.accumulatedTimeParameter = r;
for (var i = 0; i < o; i++) this.updateSignal.emit(), this._processAllSignals();
this._shouldSaveProgress && (this._shouldSaveProgress = !1, this.universe.saveAllStorage(this.dirtyStorageAtoms), 
this.dirtyStorageAtoms.clear());
}, e.prototype.markSaveProgress = function() {
this._shouldSaveProgress = !0;
}, e.prototype.markEntityComponentDirty = function(t, e) {
var n = this.dirtyEntityComponents.get(t);
n || (n = new Set(), this.dirtyEntityComponents.set(t, n)), n.add(e);
}, e.prototype.markStorageDirty = function(t) {
this.storageAtoms.has(t) && this.dirtyStorageAtoms.add(t);
}, e.prototype.expandEntityDirtyAtoms = function(t) {
var e, n, o, r;
if (this.expandedEntityDirtyAtomsCache) return this.expandedEntityDirtyAtomsCache;
var i = new Map(), a = function(t) {
var e = i.get(t);
return e || (e = new Set(), i.set(t, e)), e;
};
try {
for (var s = l(this.dirtyEntityComponents), u = s.next(); !u.done; u = s.next()) {
var d = c(u.value, 2), h = d[0], p = d[1], f = a(h);
try {
for (var m = (o = void 0, l(p)), y = m.next(); !y.done; y = m.next()) {
var v = y.value;
f.add(v);
}
} catch (t) {
o = {
error: t
};
} finally {
try {
y && !y.done && (r = m.return) && r.call(m);
} finally {
if (o) throw o.error;
}
}
}
} catch (t) {
e = {
error: t
};
} finally {
try {
u && !u.done && (n = s.return) && n.call(s);
} finally {
if (e) throw e.error;
}
}
return this.expandedEntityDirtyAtomsCache = i, i;
}, e.prototype.markRelationChange = function(t, e, n, o) {
this.worldChanges.push({
type: o ? Ye.RelationAdd : Ye.RelationRemove,
relationName: t,
source: e,
target: n
});
}, e.prototype.markRenderCreate = function(t, e) {
this.worldChanges.push({
type: Ye.RenderCreate,
eid: t,
domainName: e
});
}, e.prototype.markRenderDestroy = function(t) {
this.worldChanges.push({
type: Ye.RenderDestroy,
eid: t
});
}, e.prototype.markWorldCreate = function(t) {
this.worldChanges.push({
type: Ye.WorldCreate,
eid: t
});
}, e.prototype.markWorldDestroy = function(t) {
this.worldChanges.push({
type: Ye.WorldDestroy,
eid: t
});
}, e.prototype.markWorldRestart = function(t) {
this.worldChanges.push({
type: Ye.WorldRestart,
eid: t
});
}, e.prototype.getAtomData = function(t, e) {
var n = this.atomInstanceMap.get(t);
return "EntityDomainAtom" === e ? n : null == n ? void 0 : n.atomState;
}, e.prototype.hasAtomIns = function(t) {
return this.atomInstanceMap.has(t);
}, e.prototype.getAtomIns = function(t) {
var e = this.atomInstanceMap.get(t);
return e || re(Et.AtomInstanceNotFound, {
atom: t
}), e;
}, e.prototype.getAtomType = function(t) {
var e = Re.get(t);
if (e) return e.atomType;
re(Et.AtomTypeQueryFailed, {
atom: t
});
}, e.prototype._processAllSignals = function() {
for (;this.pendingInputs.length > 0; ) {
var t = this.pendingInputs.shift(), e = this.getAtomIns(t.signalName);
Object.assign(e.atomState, t.inputData), e.trigger(t.eidList);
}
var n = this.pendingRouterSignals;
for (this.pendingRouterSignals = []; n.length > 0; ) (t = n.shift()).fromRouterName ? this.getAtomIns(t.fromRouterName).handleSignal(t) : (e = this.getAtomIns(t.signalName)).trigger(t.eidList);
}, e.prototype.pushInput = function(t, e, n) {
this.pendingInputs.push({
signalName: t.atomName,
eidList: [ e ],
fromRouterName: null,
inputData: n
});
}, e.prototype.registerFeatures = function(t) {
this.loadTracker = new Fn(this), this.universe.featureResolver.hasFeatures(this.config.worldId) || re(Et.WorldFeaturesEmpty, {
worldId: this.config.worldId
}), this._loadAndInit(t);
}, e.prototype._triggerSilentPreloads = function() {
var t, e, n = this.universe.featureResolver.getFeatureSet(this.config.worldId), o = [];
try {
for (var r = l(n), i = r.next(); !i.done; i = r.next()) {
var a = c(i.value, 2), s = a[0];
a[1].silent && o.push(s);
}
} catch (e) {
t = {
error: e
};
} finally {
try {
i && !i.done && (e = r.return) && e.call(r);
} finally {
if (t) throw t.error;
}
}
0 !== o.length && this.universe.asset.preloadFeatures(o).catch(function() {});
}, e.prototype._loadAndInit = function(e) {
return s(this, void 0, void 0, function() {
var n, o, r, i, a, s, d, h, p, f, m, y, v, _, g, A, C, R, S, T, b, w, F, E, N, x, I, D, M = this;
return u(this, function(u) {
switch (u.label) {
case 0:
n = this.universe.featureResolver, o = this.config.worldId, r = n.getFeatureSet(o), 
u.label = 1;

case 1:
return u.trys.push([ 1, 5, , 6 ]), In(this), [ 4, this.universe.asset.ensureSessionPlan(o) ];

case 2:
if (u.sent(), this.disposed) return [ 2 ];
In(this), i = new Map();
try {
for (a = l(r), s = a.next(); !s.done; s = a.next()) d = c(s.value, 2), h = d[0], 
(!(p = d[1]).silent || this.universe.asset.isResourcesDownloaded(h)) && i.set(h, p);
} catch (t) {
b = {
error: t
};
} finally {
try {
s && !s.done && (w = a.return) && w.call(a);
} finally {
if (b) throw b.error;
}
}
return this.loadTracker.addBundleItems(i.size), [ 4, this.universe.asset.retainFeatures(i, function() {
M.loadTracker.completeBundle();
}) ];

case 3:
if (f = u.sent(), this.disposed) return [ 2 ];
In(this);
try {
for (m = l([ gn, mn ]), y = m.next(); !y.done; y = m.next()) S = y.value, this._createAtom(S, "核心原子");
} catch (t) {
F = {
error: t
};
} finally {
try {
y && !y.done && (E = m.return) && E.call(m);
} finally {
if (F) throw F.error;
}
}
f.add(t.G_FAtom.FeatureName.Name), this.loadedFeatureNames = f;
try {
for (v = l(f), _ = v.next(); !_.done; _ = v.next()) {
g = _.value, A = Se.get(g) || [];
try {
for (I = void 0, C = l(A), R = C.next(); !R.done; R = C.next()) S = R.value, this._createAtom(S, "特性 ".concat(g));
} catch (t) {
I = {
error: t
};
} finally {
try {
R && !R.done && (D = C.return) && D.call(C);
} finally {
if (I) throw I.error;
}
}
}
} catch (t) {
N = {
error: t
};
} finally {
try {
_ && !_.done && (x = v.return) && x.call(v);
} finally {
if (N) throw N.error;
}
}
return this.loadTracker.startAtomPhase(), [ 4, this._initAndStart(e) ];

case 4:
return u.sent(), Dn(this), [ 3, 6 ];

case 5:
return T = u.sent(), this.loadTracker.fail(T), [ 3, 6 ];

case 6:
return [ 2 ];
}
});
});
}, e.prototype._initAndStart = function(t) {
return s(this, void 0, void 0, function() {
var e, n, o, r, i, a;
return u(this, function(s) {
switch (s.label) {
case 0:
s.trys.push([ 0, 9, , 10 ]), In(this), 0 === this.randomSeed && (this.randomSeed = this.config.randomSeed), 
s.label = 1;

case 1:
s.trys.push([ 1, 6, 7, 8 ]), e = l(this.pendingReadyAtoms), n = e.next(), s.label = 2;

case 2:
return n.done ? [ 3, 5 ] : [ 4, n.value.ready() ];

case 3:
if (s.sent(), this.disposed) return [ 2 ];
In(this), s.label = 4;

case 4:
return n = e.next(), [ 3, 2 ];

case 5:
return [ 3, 8 ];

case 6:
return o = s.sent(), i = {
error: o
}, [ 3, 8 ];

case 7:
try {
n && !n.done && (a = e.return) && a.call(e);
} finally {
if (i) throw i.error;
}
return [ 7 ];

case 8:
return this.pendingReadyAtoms = [], this._start(), this.ready = !0, this._triggerSilentPreloads(), 
null == t || t(), Dn(this), [ 3, 10 ];

case 9:
return r = s.sent(), this.loadTracker.fail(r), [ 3, 10 ];

case 10:
return [ 2 ];
}
});
});
}, e.prototype._start = function() {
this.updateSignal = this.getAtomIns(Qe), this.config.parentWorld && (this.prevMultiTouch = this.universe.render.setMultiTouch(this.config.multiTouch));
var t = this.getAtomIns(qe);
this.rootEid = t.create();
var e = this.config, n = e.initialWidth, o = e.initialHeight;
if (n > 0 || o > 0) {
var r = this.getAtomIns(Ke);
r.data.width = n, r.data.height = o;
}
this.markRelationChange(mn, null, this.rootEid, !0), this.getAtomIns(rn).emit(this.rootEid);
}, e.prototype._createAtom = function(t, e) {
if (!this.atomInstanceMap.has(t)) {
var n = new (we(t, e))();
this.atomInstanceMap.set(t, n), n.init(t, this), this.pendingReadyAtoms.push(n), 
this._creationOrder.push(t);
}
}, e.prototype.addChildWorld = function(t, e) {
this._childWorlds.set(t, e);
}, e.prototype.removeChildWorld = function(t) {
this._childWorlds.delete(t);
}, e.prototype.getChildWorld = function(t) {
return this._childWorlds.get(t);
}, e.prototype.forEachChildWorld = function(t) {
var e, n;
try {
for (var o = l(this._childWorlds.entries()), r = o.next(); !r.done; r = o.next()) {
var i = c(r.value, 2), a = i[0];
t(i[1], a);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
r && !r.done && (n = o.return) && n.call(o);
} finally {
if (e) throw e.error;
}
}
}, e.prototype.resolveChildWorldConfig = function(t) {
var e = this.getAtomIns(Xe), n = e.worldState, o = n.worldId[t];
if (!o) return re(Et.WorldEntityNoId, {
entity: String(t)
}), null;
var r = n.randomSeed[t] || Math.floor(2147483646 * Math.random()) + 1, i = n.multiTouch[t];
return {
worldId: o,
worldPath: "".concat(this.config.worldPath, "/").concat(o),
randomSeed: r,
parentWorld: this,
entityInParent: t,
initialWidth: e.box.width[t],
initialHeight: e.box.height[t],
multiTouch: i
};
}, e.prototype.dispose = function() {
var t, e, n, o, r, i, a, s = "开始销毁";
try {
if (s = "还原多点触摸状态", this.universe && this.config.parentWorld && this.universe.render.setMultiTouch(this.prevMultiTouch), 
s = "标记世界已销毁", this.disposed = !0, s = "取消未完成的加载", !this.ready && this.loadTracker && this.loadTracker.cancel(), 
this.universe) {
s = "读取世界特性";
var u = this.universe.featureResolver.getFeatureSet(this.config.worldId), l = d([], c(u.keys()), !1);
u.size > 0 && (s = "释放特性 [".concat(l.join(", "), "]"), this.universe.asset.releaseFeatures(u)), 
s = "清理渲染资源", this.universe.destroyWorldRender(this), s = "通知宿主世界销毁", this.universe.host.notifyWorldDestroy(this.config.worldId);
}
s = "逆序销毁原子，共 ".concat(this._creationOrder.length, " 个");
for (var h = this._creationOrder.length - 1; h >= 0; h--) {
var p = this._creationOrder[h];
a = p, s = "销毁原子 ".concat(p, " (").concat(this._creationOrder.length - h, "/").concat(this._creationOrder.length, ")");
var f = this.atomInstanceMap.get(p);
f && (f.dispose(), this.atomInstanceMap.delete(p));
}
a = void 0, this._creationOrder = [], s = "断开外部引用", (null === (t = null == this ? void 0 : this.universe) || void 0 === t ? void 0 : t.host) && this.universe.host.clearAdRequestWorld(this), 
this.universe = null, this.config.parentWorld = null, this._childWorlds.clear(), 
s = "清理原子实例和路由缓存", this.atomInstanceMap.clear(), this.signalRouters.clear(), this.domainToLogicMap.clear(), 
this.storageAtoms.clear(), s = "清理运行时状态", this.dirtyStorageAtoms.clear(), this.dirtyEntityComponents.clear(), 
this.expandedEntityDirtyAtomsCache = null, this.worldChanges.length = 0, this.pendingInputs.length = 0, 
this.pendingReadyAtoms.length = 0, s = "清理运行时快照", this.atomSnapshots = {}, this.pendingRouterSignals.length = 0, 
this.randomSeed = 0, s = "清理 bitecs ECS World", delete this.ecsWorld[C];
} catch (t) {
if (t instanceof Error) {
var m = null !== (n = null === (e = this.config.parentWorld) || void 0 === e ? void 0 : e.config.worldId) && void 0 !== n ? n : "-", y = this.universe ? "alive" : "cleared", v = [ "worldId=".concat(this.config.worldId), "worldPath=".concat(this.config.worldPath), "stage=".concat(s), "disposingAtom=".concat(null != a ? a : "-"), "ready=".concat(this.ready), "disposed=".concat(this.disposed), "parentWorld=".concat(m), "entityInParent=".concat(this.config.entityInParent), "universe=".concat(y), "atoms=".concat(this.atomInstanceMap.size), "creationOrder=".concat(this._creationOrder.length), "currentLogic=".concat(null !== (o = this.currentExecutingLogicAtom) && void 0 !== o ? o : "-"), "currentDomain=".concat(null !== (r = this.currentSignalEntityDomain) && void 0 !== r ? r : "-"), "genChainOwner=".concat(null !== (i = this.currentGenChainOwner) && void 0 !== i ? i : "-") ].join(" ");
t.message = "[AtomEngine][销毁] 世界销毁失败: ".concat(v, " ---\x3e ").concat(t.message);
}
throw t;
} finally {
Dn(this);
}
}, e;
}();
function Un(t, e) {
for (var n = [], o = 2; o < arguments.length; o++) n[o - 2] = arguments[o];
return {
type: t,
props: e,
children: n.length ? n : void 0
};
}
t.WidgetAlignMode = void 0, (Pn = t.WidgetAlignMode || (t.WidgetAlignMode = {})).Once = "Once", 
Pn.OnWindowResize = "OnWindowResize", Pn.Always = "Always", t.LayoutResizeMode = void 0, 
(Wn = t.LayoutResizeMode || (t.LayoutResizeMode = {})).None = "None", Wn.Container = "Container", 
Wn.Children = "Children", t.LayoutAxisDirection = void 0, (On = t.LayoutAxisDirection || (t.LayoutAxisDirection = {})).Horizontal = "Horizontal", 
On.Vertical = "Vertical", t.LayoutVerticalDirection = void 0, (Ln = t.LayoutVerticalDirection || (t.LayoutVerticalDirection = {})).TopToBottom = "TopToBottom", 
Ln.BottomToTop = "BottomToTop", t.LayoutHorizontalDirection = void 0, (Bn = t.LayoutHorizontalDirection || (t.LayoutHorizontalDirection = {})).LeftToRight = "LeftToRight", 
Bn.RightToLeft = "RightToLeft", t.ButtonTransition = void 0, (Gn = t.ButtonTransition || (t.ButtonTransition = {})).None = "None", 
Gn.Color = "Color", Gn.Sprite = "Sprite", Gn.Scale = "Scale", t.TextHorizontalAlign = void 0, 
(kn = t.TextHorizontalAlign || (t.TextHorizontalAlign = {}))[kn.LEFT = 0] = "LEFT", 
kn[kn.CENTER = 1] = "CENTER", kn[kn.RIGHT = 2] = "RIGHT", t.LabelCacheMode = void 0, 
(Vn = t.LabelCacheMode || (t.LabelCacheMode = {}))[Vn.NONE = 0] = "NONE", Vn[Vn.BITMAP = 1] = "BITMAP", 
Vn[Vn.CHAR = 2] = "CHAR", t.RenderNodeType = void 0, (jn = t.RenderNodeType || (t.RenderNodeType = {})).Node = "Node", 
jn.Sprite = "Sprite", jn.Text = "Text", jn.Spine = "Spine", jn.Graphics = "Graphics", 
jn.TraceGraphics = "TraceGraphics", jn.Mask = "Mask", jn.ScrollView = "ScrollView", 
jn.Camera = "Camera", jn.Streak = "Streak", jn.Particle = "Particle", jn.EditBox = "EditBox", 
jn.Mesh = "Mesh", jn.Texture2D = "Texture2D", jn.RichText = "RichText", t.LayoutType = void 0, 
(Hn = t.LayoutType || (t.LayoutType = {})).Horizontal = "Horizontal", Hn.Vertical = "Vertical", 
Hn.Grid = "Grid";
var Yn, qn = {
name: function(t, e) {
return t.setName(e);
},
cameraLayer: function(t, e) {
return t.setCameraLayer(e);
},
x: function(t, e) {
return t.setX(e);
},
y: function(t, e) {
return t.setY(e);
},
z: function(t, e) {
return t.setZ(e);
},
angle: function(t, e) {
return t.setAngle(e);
},
scale: function(t, e) {
return t.setScale(e);
},
quatX: function(t, e) {
return t.setQuatX(e);
},
quatY: function(t, e) {
return t.setQuatY(e);
},
quatZ: function(t, e) {
return t.setQuatZ(e);
},
quatW: function(t, e) {
return t.setQuatW(e);
},
scaleX: function(t, e) {
return t.setScaleX(e);
},
scaleY: function(t, e) {
return t.setScaleY(e);
},
scaleZ: function(t, e) {
return t.setScaleZ(e);
},
alpha: function(t, e) {
return t.setAlpha(e);
},
rgb: function(t, e) {
return t.setRgb(e);
},
active: function(t, e) {
return t.setActiveBase(e);
},
width: function(t, e) {
return t.setWidth(e);
},
height: function(t, e) {
return t.setHeight(e);
},
anchorX: function(t, e) {
return t.setAnchorX(e);
},
anchorY: function(t, e) {
return t.setAnchorY(e);
},
anchorZ: function(t, e) {
return t.setAnchorZ(e);
},
zIndex: function(t, e) {
return t.setZIndex(e);
},
depth: function(t, e) {
return t.setDepth(e);
},
event: {
buttonClick: function(t, e) {
return t.setButtonClick(e);
},
touchStart: function(t, e) {
return t.setOnTouchStart(e);
},
touchMove: function(t, e) {
return t.setOnTouchMove(e);
},
touchEnd: function(t, e) {
return t.setOnTouchEnd(e);
},
touchCancel: function(t, e) {
return t.setOnTouchCancel(e);
},
sizeChanged: function(t, e) {
return t.setOnSizeChanged(e);
},
positionChanged: function(t, e) {
return t.setOnPositionChanged(e);
}
},
eventOptions: {
touchStart: function(t, e) {
return t.setTouchStartOption(e);
},
touchMove: function(t, e) {
return t.setTouchMoveOption(e);
},
touchEnd: function(t, e) {
return t.setTouchEndOption(e);
},
touchCancel: function(t, e) {
return t.setTouchCancelOption(e);
}
},
blockInputEvents: function(t, e) {
return t.setBlockInputEvents(e);
},
widget: {
enabled: function(t, e) {
return t.setWidgetEnabled(e);
},
safeArea: function(t, e) {
return t.setSafeAreaEnabled(e);
},
isAlignTop: function(t, e) {
return t.setWidgetAlignTop(e);
},
isAlignBottom: function(t, e) {
return t.setWidgetAlignBottom(e);
},
isAlignLeft: function(t, e) {
return t.setWidgetAlignLeft(e);
},
isAlignRight: function(t, e) {
return t.setWidgetAlignRight(e);
},
isAlignHorizontalCenter: function(t, e) {
return t.setWidgetAlignHorizontalCenter(e);
},
isAlignVerticalCenter: function(t, e) {
return t.setWidgetAlignVerticalCenter(e);
},
top: function(t, e) {
return t.setWidgetTop(e);
},
bottom: function(t, e) {
return t.setWidgetBottom(e);
},
left: function(t, e) {
return t.setWidgetLeft(e);
},
right: function(t, e) {
return t.setWidgetRight(e);
},
horizontalCenter: function(t, e) {
return t.setWidgetHorizontalCenter(e);
},
verticalCenter: function(t, e) {
return t.setWidgetVerticalCenter(e);
},
alignMode: function(t, e) {
return t.setWidgetAlignMode(e);
}
},
layout: {
enabled: function(t, e) {
return t.setLayoutEnabled(e);
},
type: function(t, e) {
return t.setLayoutType(e);
},
resizeMode: function(t, e) {
return t.setLayoutResizeMode(e);
},
spacingX: function(t, e) {
return t.setLayoutSpacingX(e);
},
spacingY: function(t, e) {
return t.setLayoutSpacingY(e);
},
paddingLeft: function(t, e) {
return t.setLayoutPaddingLeft(e);
},
paddingRight: function(t, e) {
return t.setLayoutPaddingRight(e);
},
paddingTop: function(t, e) {
return t.setLayoutPaddingTop(e);
},
paddingBottom: function(t, e) {
return t.setLayoutPaddingBottom(e);
},
startAxis: function(t, e) {
return t.setLayoutStartAxis(e);
},
verticalDirection: function(t, e) {
return t.setLayoutVerticalDirection(e);
},
horizontalDirection: function(t, e) {
return t.setLayoutHorizontalDirection(e);
}
},
button: {
enabled: function(t, e) {
return t.setButtonEnabled(e);
},
interactable: function(t, e) {
return t.setButtonInteractable(e);
},
enableAutoGrayEffect: function(t, e) {
return t.setButtonEnableAutoGrayEffect(e);
},
transition: function(t, e) {
return t.setButtonTransition(e);
},
duration: function(t, e) {
return t.setButtonDuration(e);
},
zoomScale: function(t, e) {
return t.setButtonZoomScale(e);
},
normalColor: function(t, e) {
return t.setButtonNormalColor(e);
},
normalAlpha: function(t, e) {
return t.setButtonNormalAlpha(e);
},
pressedColor: function(t, e) {
return t.setButtonPressedColor(e);
},
pressedAlpha: function(t, e) {
return t.setButtonPressedAlpha(e);
},
hoverColor: function(t, e) {
return t.setButtonHoverColor(e);
},
hoverAlpha: function(t, e) {
return t.setButtonHoverAlpha(e);
},
disabledColor: function(t, e) {
return t.setButtonDisabledColor(e);
},
disabledAlpha: function(t, e) {
return t.setButtonDisabledAlpha(e);
},
normalSprite: function(t, e) {
return t.setButtonNormalSprite(e);
},
pressedSprite: function(t, e) {
return t.setButtonPressedSprite(e);
},
hoverSprite: function(t, e) {
return t.setButtonHoverSprite(e);
},
disabledSprite: function(t, e) {
return t.setButtonDisabledSprite(e);
},
target: function(t, e) {
return t.setButtonTarget(e);
}
},
material: function(t, e) {
return t.setMaterial(e);
}
}, Xn = function() {
function t(t) {
this.universe = t, this.root = null, this._lastPageHideTimeMs = 0, this.shouldRestoreContext = !1;
}
return t.prototype.onPageHide = function() {
this._lastPageHideTimeMs = Date.now(), this.universe.emitInputToAllWorlds(sn, {}), 
this.universe.update(-1), this.universe.forceSaveAllStorage();
}, t.prototype.onPageShow = function() {
this.shouldRestoreContext && this.universe.onContextRestore();
var t = Date.now(), e = this._lastPageHideTimeMs > 0 ? Math.max(0, t - this._lastPageHideTimeMs) : 0;
this._lastPageHideTimeMs = 0, this.universe.emitInputToAllWorlds(un, {
durationMs: e
});
}, t;
}(), Qn = "remote://";
t.LoaderAssetType = void 0, (Yn = t.LoaderAssetType || (t.LoaderAssetType = {})).SpriteFrame = "SpriteFrame", 
Yn.SpriteAtlas = "SpriteAtlas", Yn.Font = "Font", Yn.SkeletonData = "SkeletonData", 
Yn.Texture = "Texture", Yn.AudioClip = "AudioClip", Yn.Material = "Material", Yn.Effect = "Effect", 
Yn.Json = "Json", Yn.DragonBonesAsset = "DragonBonesAsset", Yn.DragonBonesAtlasAsset = "DragonBonesAtlasAsset", 
Yn.Particle = "Particle", Yn.Buffer = "Buffer";
var Jn = function() {
function t(t) {
this._refCounts = new Map(), this._featureDeps = new Map(), this._loadingFeatures = new Map(), 
this._preRelease = !1, this._versionState = {}, this._versionStateLoaded = !1, this._versionStateDirtyFeatures = new Set(), 
this._bundleOpChain = Promise.resolve(), this._pendingStageTasks = new Map(), this._stageWorkerRunning = !1, 
this._mainLoadDepth = 0, this._sessionGroupPlans = new Map(), this._worldToGroupId = new Map(), 
this._featureToGroupId = new Map(), this._manifestCache = new Map(), this.universe = t;
}
return t.prototype.setRemoteBundleUrl = function(t) {
this._remoteBundleUrl = t;
}, t.prototype.setRemoteAssetUrl = function(t) {
this._remoteAssetUrl = t;
}, t.prototype.setPreRelease = function(t) {
this._preRelease = t;
}, t.prototype.ensureSessionPlan = function(t) {
return s(this, void 0, void 0, function() {
var e, n = this;
return u(this, function(o) {
switch (o.label) {
case 0:
return this._remoteBundleUrl ? this._worldToGroupId.has(t) ? [ 2 ] : (null !== (e = this._buildPromise) && void 0 !== e || (this._buildPromise = this._buildAllConsistencyGroups().catch(function(t) {
throw n._buildPromise = void 0, t;
})), [ 4, this._buildPromise ]) : [ 2 ];

case 1:
return o.sent(), [ 2 ];
}
});
});
}, t.prototype.getSessionFeatureVersion = function(t) {
if (this._remoteBundleUrl) {
var e = this._featureToGroupId.get(t);
if (e) {
if ("applyTarget" === this._sessionGroupPlans.get(e).mode) return {
version: null == (o = this._manifestCache.get(t)) ? void 0 : o.version,
deps: null == o ? void 0 : o.deps,
source: "target"
};
var n = this._ensureVersionStateLoaded()[t];
if (void 0 === (null == n ? void 0 : n.appliedVersion)) {
var o = this._manifestCache.get(t);
return {
version: null == o ? void 0 : o.version,
deps: null == o ? void 0 : o.deps,
source: "target"
};
}
return {
version: n.appliedVersion,
deps: n.appliedDeps,
source: "applied"
};
}
}
}, t.prototype.commitFeatureApplied = function(t, e, n) {
var o;
if (this._remoteBundleUrl && void 0 !== e) {
var r = this._ensureVersionStateLoaded(), i = null !== (o = r[t]) && void 0 !== o ? o : {}, a = i.stagedVersion === e;
i.appliedVersion = e, i.appliedDeps = n, a && (delete i.stagedVersion, delete i.stagedDeps), 
r[t] = i, this._versionStateDirtyFeatures.add(t);
}
}, t.prototype.flushPendingVersionState = function() {
0 !== this._versionStateDirtyFeatures.size && (this._versionStateDirtyFeatures.clear(), 
this.saveVersionState(this._versionState));
}, t.prototype._logAppliedFeatureVersions = function(t) {
if (this._remoteBundleUrl && 0 !== t.size) {
var e = this._ensureVersionStateLoaded(), n = d([], c(t), !1).sort().map(function(t) {
var n, o = null === (n = e[t]) || void 0 === n ? void 0 : n.appliedVersion;
return "".concat(t, "#").concat(o);
}).join("_");
this.universe.host.track("g_game_applied_start", {
features_version: n
});
}
}, t.prototype._discardDirtyVersionState = function() {
0 !== this._versionStateDirtyFeatures.size && (this._versionStateLoaded = !1, this._versionState = {}, 
this._versionStateDirtyFeatures.clear());
}, t.prototype._ensureVersionStateLoaded = function() {
return this._versionStateLoaded || (this._versionStateLoaded = !0, this._versionState = this.loadVersionState()), 
this._versionState;
}, t.prototype._persistStagedVersion = function(t, e, n) {
var o, r, i = this.loadVersionState(), a = null !== (o = i[t]) && void 0 !== o ? o : {};
if (a.stagedVersion = e, a.stagedDeps = n, i[t] = a, this.saveVersionState(i), this._versionStateLoaded) {
var s = null !== (r = this._versionState[t]) && void 0 !== r ? r : {};
s.stagedVersion = e, s.stagedDeps = n, this._versionState[t] = s;
}
}, t.prototype.enqueueBundleOp = function(t) {
var e = this._bundleOpChain.then(t, t);
return this._bundleOpChain = e.catch(function() {}), e;
}, t.prototype.enqueueStageTask = function(t) {
var e = this._pendingStageTasks.get(t.featureName);
e && e.version >= t.version || this._pendingStageTasks.set(t.featureName, {
version: t.version,
deps: t.deps
});
}, t.prototype._kickStageWorker = function() {
this._stageWorkerRunning || 0 !== this._pendingStageTasks.size && (this._stageWorkerRunning = !0, 
s(this, void 0, void 0, function() {
var t, e, n, o, r;
return u(this, function(i) {
switch (i.label) {
case 0:
return this._pendingStageTasks.size > 0 ? [ 4, this._waitMainLoadIdle() ] : [ 3, 6 ];

case 1:
if (i.sent(), (t = this._pendingStageTasks.entries().next()).done) return [ 3, 6 ];
if (e = c(t.value, 2), n = e[0], o = e[1], this._pendingStageTasks.delete(n), void 0 !== (null == (r = this._ensureVersionStateLoaded()[n]) ? void 0 : r.appliedVersion) && r.appliedVersion >= o.version) return [ 3, 0 ];
if (void 0 !== (null == r ? void 0 : r.stagedVersion) && r.stagedVersion >= o.version) return [ 3, 0 ];
i.label = 2;

case 2:
return i.trys.push([ 2, 4, , 5 ]), [ 4, this.stageFeaturePackage(n, o.version) ];

case 3:
return i.sent(), this._persistStagedVersion(n, o.version, o.deps), [ 3, 5 ];

case 4:
return i.sent(), [ 3, 5 ];

case 5:
return [ 3, 0 ];

case 6:
return this._stageWorkerRunning = !1, [ 2 ];
}
});
}));
}, t.prototype._bumpMainLoad = function() {
if (0 === this._mainLoadDepth) {
var t, e = new Promise(function(e) {
return t = e;
});
this._mainLoadIdleSignal = {
promise: e,
resolve: t
};
}
this._mainLoadDepth++;
}, t.prototype._dropMainLoad = function() {
var t;
this._mainLoadDepth--, 0 === this._mainLoadDepth && (null === (t = this._mainLoadIdleSignal) || void 0 === t || t.resolve(), 
this._mainLoadIdleSignal = void 0);
}, t.prototype._waitMainLoadIdle = function() {
return s(this, void 0, void 0, function() {
var t;
return u(this, function(e) {
switch (e.label) {
case 0:
return this._mainLoadDepth > 0 ? [ 4, null === (t = this._mainLoadIdleSignal) || void 0 === t ? void 0 : t.promise ] : [ 3, 2 ];

case 1:
return e.sent(), [ 3, 0 ];

case 2:
return [ 2 ];
}
});
});
}, t.prototype._resolveManifestCached = function(t) {
return s(this, void 0, void 0, function() {
var e, n, o, r, i, a, s, l;
return u(this, function(u) {
switch (u.label) {
case 0:
if (e = this._manifestCache.get(t)) return [ 2, e ];
if (n = this._ensureVersionStateLoaded(), void 0 !== (null == (o = n[t]) ? void 0 : o.stagedVersion) && o.stagedVersion !== (null == o ? void 0 : o.appliedVersion)) return r = {
version: o.stagedVersion,
deps: null !== (s = o.stagedDeps) && void 0 !== s ? s : []
}, this._manifestCache.set(t, r), [ 2, r ];
u.label = 1;

case 1:
return u.trys.push([ 1, 3, , 4 ]), [ 4, this.resolveFeatureManifest(t) ];

case 2:
return r = u.sent(), this._manifestCache.set(t, r), [ 2, r ];

case 3:
if (i = u.sent(), void 0 !== (null == o ? void 0 : o.appliedVersion)) return a = {
version: o.appliedVersion,
deps: null !== (l = o.appliedDeps) && void 0 !== l ? l : []
}, this._manifestCache.set(t, a), [ 2, a ];
throw i;

case 4:
return [ 2 ];
}
});
});
}, t.prototype._resolveTargetClosure = function(t) {
return s(this, void 0, void 0, function() {
var e, n, o, r, i, a, s, d, h, p, f, m, y, v, _, g, A;
return u(this, function(u) {
switch (u.label) {
case 0:
e = this.universe.featureResolver, n = e.getFeatureSet(t), o = new Set(), r = [];
try {
for (i = l(n), a = i.next(); !a.done; a = i.next()) s = c(a.value, 2), d = s[0], 
s[1].silent || r.push(d);
} catch (t) {
v = {
error: t
};
} finally {
try {
a && !a.done && (_ = i.return) && _.call(i);
} finally {
if (v) throw v.error;
}
}
u.label = 1;

case 1:
return r.length > 0 ? (h = r.pop(), o.has(h) ? [ 3, 1 ] : (o.add(h), [ 4, this._resolveManifestCached(h) ])) : [ 3, 3 ];

case 2:
p = u.sent();
try {
for (g = void 0, f = l(p.deps), m = f.next(); !m.done; m = f.next()) y = m.value, 
o.has(y) || r.push(y);
} catch (t) {
g = {
error: t
};
} finally {
try {
m && !m.done && (A = f.return) && A.call(f);
} finally {
if (g) throw g.error;
}
}
return [ 3, 1 ];

case 3:
return [ 2, o ];
}
});
});
}, t.prototype._buildAllConsistencyGroups = function() {
return s(this, void 0, void 0, function() {
var t, e, n, o, r, i, a, s, h, p, f, m, y, v, _, g, A, C, R, S, T, b, w, F, E, N, x, I, D, M, P, W, O, L, B, G, k, V, j, H, z, U, Y, q, X, Q, J, Z, K, $, tt, et, nt, ot, rt, it, at, st, ut, lt, ct, dt, ht, pt, ft, mt, yt, vt, _t, gt, At, Ct, Rt;
return u(this, function(u) {
switch (u.label) {
case 0:
t = this.universe.featureResolver, e = d([], c(t.getWorldIds()), !1), n = new Map(), 
u.label = 1;

case 1:
u.trys.push([ 1, 6, 7, 8 ]), o = l(e), r = o.next(), u.label = 2;

case 2:
return r.done ? [ 3, 5 ] : (I = r.value, a = (i = n).set, s = [ I ], [ 4, this._resolveTargetClosure(I) ]);

case 3:
a.apply(i, s.concat([ u.sent() ])), u.label = 4;

case 4:
return r = o.next(), [ 3, 2 ];

case 5:
return [ 3, 8 ];

case 6:
return h = u.sent(), ot = {
error: h
}, [ 3, 8 ];

case 7:
try {
r && !r.done && (rt = o.return) && rt.call(o);
} finally {
if (ot) throw ot.error;
}
return [ 7 ];

case 8:
p = new Map();
try {
for (f = l(n), m = f.next(); !m.done; m = f.next()) {
y = c(m.value, 2), I = y[0], D = y[1];
try {
for (st = void 0, v = l(D), _ = v.next(); !_.done; _ = v.next()) Y = _.value, (T = p.get(Y)) || (T = new Set(), 
p.set(Y, T)), T.add(I);
} catch (t) {
st = {
error: t
};
} finally {
try {
_ && !_.done && (ut = v.return) && ut.call(v);
} finally {
if (st) throw st.error;
}
}
}
} catch (t) {
it = {
error: t
};
} finally {
try {
m && !m.done && (at = f.return) && at.call(f);
} finally {
if (it) throw it.error;
}
}
g = new Map(), A = function(t) {
return g.has(t) || g.set(t, t), g.get(t) !== t && g.set(t, A(g.get(t))), g.get(t);
}, C = function(t, e) {
var n = A(t), o = A(e);
n !== o && g.set(n, o);
};
try {
for (R = l(p.values()), S = R.next(); !S.done; S = R.next()) for (T = S.value, b = d([], c(T), !1), 
w = 1; w < b.length; w++) C(b[0], b[w]);
} catch (t) {
lt = {
error: t
};
} finally {
try {
S && !S.done && (ct = R.return) && ct.call(R);
} finally {
if (lt) throw lt.error;
}
}
F = new Map();
try {
for (E = l(n), N = E.next(); !N.done; N = E.next()) {
x = c(N.value, 2), I = x[0], D = x[1], G = A(I), (k = F.get(G)) || (k = {
worldIds: new Set(),
featureNames: new Set()
}, F.set(G, k)), k.worldIds.add(I);
try {
for (pt = void 0, M = l(D), P = M.next(); !P.done; P = M.next()) nt = P.value, k.featureNames.add(nt);
} catch (t) {
pt = {
error: t
};
} finally {
try {
P && !P.done && (ft = M.return) && ft.call(M);
} finally {
if (pt) throw pt.error;
}
}
}
} catch (t) {
dt = {
error: t
};
} finally {
try {
N && !N.done && (ht = E.return) && ht.call(E);
} finally {
if (dt) throw dt.error;
}
}
W = this._ensureVersionStateLoaded();
try {
for (O = l(F), L = O.next(); !L.done; L = O.next()) {
B = c(L.value, 2), G = B[0], k = B[1], V = !1, j = !0, H = !1;
try {
for (vt = void 0, z = l(k.featureNames), U = z.next(); !U.done; U = z.next()) Y = U.value, 
q = this._manifestCache.get(Y), void 0 !== (null == (X = W[Y]) ? void 0 : X.appliedVersion) && (H = !0), 
q.version !== (null == X ? void 0 : X.appliedVersion) && (V = !0, this.hasLocalBundlePackage(Y, q.version) || (j = !1));
} catch (t) {
vt = {
error: t
};
} finally {
try {
U && !U.done && (_t = z.return) && _t.call(z);
} finally {
if (vt) throw vt.error;
}
}
J = {
groupId: G,
mode: Q = V && !j && H ? "useApplied" : "applyTarget",
worldIds: k.worldIds,
featureNames: k.featureNames
}, this._sessionGroupPlans.set(G, J);
try {
for (gt = void 0, Z = l(k.worldIds), K = Z.next(); !K.done; K = Z.next()) $ = K.value, 
this._worldToGroupId.set($, G);
} catch (t) {
gt = {
error: t
};
} finally {
try {
K && !K.done && (At = Z.return) && At.call(Z);
} finally {
if (gt) throw gt.error;
}
}
try {
for (Ct = void 0, tt = l(k.featureNames), et = tt.next(); !et.done; et = tt.next()) nt = et.value, 
this._featureToGroupId.set(nt, G);
} catch (t) {
Ct = {
error: t
};
} finally {
try {
et && !et.done && (Rt = tt.return) && Rt.call(tt);
} finally {
if (Ct) throw Ct.error;
}
}
"useApplied" === Q && this._stageGroupInBackground(J);
}
} catch (t) {
mt = {
error: t
};
} finally {
try {
L && !L.done && (yt = O.return) && yt.call(O);
} finally {
if (mt) throw mt.error;
}
}
return [ 2 ];
}
});
});
}, t.prototype._stageGroupInBackground = function(t) {
var e, n, o = this._ensureVersionStateLoaded();
try {
for (var r = l(t.featureNames), i = r.next(); !i.done; i = r.next()) {
var a = i.value, s = this._manifestCache.get(a), u = o[a];
void 0 === s.version || s.version === (null == u ? void 0 : u.appliedVersion) || this.hasLocalBundlePackage(a, s.version) || this.enqueueStageTask({
featureName: a,
version: s.version,
deps: s.deps
});
}
} catch (t) {
e = {
error: t
};
} finally {
try {
i && !i.done && (n = r.return) && n.call(r);
} finally {
if (e) throw e.error;
}
}
}, t.prototype.buildBundleUrl = function(t) {
if (!this._remoteBundleUrl) return t;
var e = this.getPlatformName(), n = this.getSystemName();
return "".concat(this._remoteBundleUrl).concat(e, "/").concat(t, "/").concat(n);
}, t.prototype.buildRemoteUrl = function(e, n) {
if (n.startsWith(Qn)) {
var o = n.slice(9), r = this._remoteAssetUrl || t.DefaultRemoteUrl;
return {
isRemote: !0,
resolvedPath: "".concat(r, "remote/").concat(e, "/").concat(o)
};
}
return {
isRemote: !1,
resolvedPath: n
};
}, t.prototype.retainFeature = function(t) {
return s(this, void 0, void 0, function() {
var e, n, o, r, i, a, s = this;
return u(this, function() {
return (e = h(t)) ? (n = this._loadingFeatures.get(e)) ? [ 2, n.then(function(t) {
var n, o = (null !== (n = s._refCounts.get(e)) && void 0 !== n ? n : 0) + 1;
return s._refCounts.set(e, o), t;
}) ] : (o = null !== (i = this._refCounts.get(e)) && void 0 !== i ? i : 0) > 0 ? (this._refCounts.set(e, o + 1), 
[ 2, null !== (a = this._featureDeps.get(e)) && void 0 !== a ? a : [] ]) : (r = this.doLoadFeature(t).then(function(t) {
return s._refCounts.set(e, 1), s._featureDeps.set(e, t), t;
}).finally(function() {
s._loadingFeatures.delete(e);
}), this._loadingFeatures.set(e, r), [ 2, r ]) : [ 2, [] ];
});
});
}, t.prototype.retainFeatures = function(t, e) {
return s(this, void 0, void 0, function() {
var n, o, r, i, a, s, h, p, f, m, y, v, _, g, A, C, R, S, T, b, w, F;
return u(this, function(u) {
switch (u.label) {
case 0:
n = [], this._bumpMainLoad(), u.label = 1;

case 1:
u.trys.push([ 1, , 21, 22 ]), u.label = 2;

case 2:
u.trys.push([ 2, 19, , 20 ]), u.label = 3;

case 3:
u.trys.push([ 3, 8, 9, 10 ]), o = l(t.values()), r = o.next(), u.label = 4;

case 4:
return r.done ? [ 3, 7 ] : (i = r.value, [ 4, this.retainFeature(i) ]);

case 5:
a = u.sent(), n.push.apply(n, d([], c(a), !1)), null == e || e(), u.label = 6;

case 6:
return r = o.next(), [ 3, 4 ];

case 7:
return [ 3, 10 ];

case 8:
return s = u.sent(), R = {
error: s
}, [ 3, 10 ];

case 9:
try {
r && !r.done && (S = o.return) && S.call(o);
} finally {
if (R) throw R.error;
}
return [ 7 ];

case 10:
if (!(n.length > 0)) return [ 3, 18 ];
h = new Set(n.map(function(t) {
return t.atomFeatureName;
})), u.label = 11;

case 11:
u.trys.push([ 11, 16, 17, 18 ]), p = l(h), f = p.next(), u.label = 12;

case 12:
return f.done ? [ 3, 15 ] : (m = f.value, [ 4, this.retainFeature({
atomFeatureName: m
}) ]);

case 13:
u.sent(), u.label = 14;

case 14:
return f = p.next(), [ 3, 12 ];

case 15:
return [ 3, 18 ];

case 16:
return y = u.sent(), T = {
error: y
}, [ 3, 18 ];

case 17:
try {
f && !f.done && (b = p.return) && b.call(p);
} finally {
if (T) throw T.error;
}
return [ 7 ];

case 18:
return [ 3, 20 ];

case 19:
throw v = u.sent(), this._discardDirtyVersionState(), v;

case 20:
_ = new Set(t.keys());
try {
for (g = l(n), A = g.next(); !A.done; A = g.next()) C = A.value, _.add(C.atomFeatureName);
} catch (t) {
w = {
error: t
};
} finally {
try {
A && !A.done && (F = g.return) && F.call(g);
} finally {
if (w) throw w.error;
}
}
return this.flushPendingVersionState(), this._logAppliedFeatureVersions(_), this.onFeaturesRetained(_), 
[ 2, _ ];

case 21:
return this._dropMainLoad(), this._kickStageWorker(), [ 7 ];

case 22:
return [ 2 ];
}
});
});
}, t.prototype._decrementRef = function(t) {
var e, n = null !== (e = this._refCounts.get(t)) && void 0 !== e ? e : 0;
return !(0 === n || n > 1 && (this._refCounts.set(t, n - 1), 1));
}, t.prototype.releaseFeature = function(t) {
this._decrementRef(t) && (this.doReleaseFeatureAssets(t), this.doRemoveFeatureBundle(t), 
this._refCounts.delete(t), this._featureDeps.delete(t));
}, t.prototype.releaseFeatures = function(t) {
var e, n, o, r, i = [], a = [];
try {
for (var s = l(t.keys()), u = s.next(); !u.done; u = s.next()) {
var h = u.value, p = this._featureDeps.get(h);
p && p.length > 0 && a.push.apply(a, d([], c(p), !1)), this._decrementRef(h) && i.push(h);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
u && !u.done && (n = s.return) && n.call(s);
} finally {
if (e) throw e.error;
}
}
if (a.length > 0) {
var f = new Set(a.map(function(t) {
return t.atomFeatureName;
}));
try {
for (var m = l(f), y = m.next(); !y.done; y = m.next()) {
var v = y.value;
this._decrementRef(v) && i.push(v);
}
} catch (t) {
o = {
error: t
};
} finally {
try {
y && !y.done && (r = m.return) && r.call(m);
} finally {
if (o) throw o.error;
}
}
}
this._executeTwoPhaseUnload(i);
}, t.prototype.forceReleaseAll = function() {
this._executeTwoPhaseUnload(d([], c(this._refCounts.keys()), !1));
}, t.prototype._executeTwoPhaseUnload = function(t) {
if (0 !== t.length) {
for (var e = t.length, n = t.join(", "), o = 0; o < e; o++) {
var r = t[o];
try {
this.doReleaseFeatureAssets(r);
} catch (t) {
throw t instanceof Error && (t.message = "[AtomEngine][卸载] Phase1 doReleaseFeatureAssets 失败: featureName=".concat(r, " index=").concat(o + 1, "/").concat(e, " toUnload=[").concat(n, "] ---\x3e ").concat(t.message)), 
t;
}
}
for (o = 0; o < e; o++) {
r = t[o];
try {
this.doRemoveFeatureBundle(r);
} catch (t) {
throw t instanceof Error && (t.message = "[AtomEngine][卸载] Phase2 doRemoveFeatureBundle 失败: featureName=".concat(r, " index=").concat(o + 1, "/").concat(e, " toUnload=[").concat(n, "] ---\x3e ").concat(t.message)), 
t;
}
this._refCounts.delete(r), this._featureDeps.delete(r);
}
}
}, t.prototype.isFeatureLoaded = function(t) {
var e;
return (null !== (e = this._refCounts.get(t)) && void 0 !== e ? e : 0) > 0;
}, t.DefaultRemoteUrl = "https://starlink-live.hungrystudio.pp.ua/atomEngine/", 
t;
}(), Zn = "|";
function Kn(t) {
var e = t, n = e.split(Zn);
return n.length < 2 ? {
featureName: "",
assetPath: e
} : {
featureName: n[0],
assetPath: n[1]
};
}
var $n, to = function(e) {
function o() {
var t = e.apply(this, d([], c(arguments), !1)) || this;
return t.genChain = null, t;
}
return n(o, e), Object.defineProperty(o, "atomType", {
get: function() {
return "ConfigAtom";
},
enumerable: !1,
configurable: !0
}), o.prototype.collectLoad = function() {
this.atomWorld.loadTracker.addItems();
}, o.prototype._loadConfig = function() {
return s(this, void 0, void 0, function() {
var t, e;
return u(this, function(n) {
switch (n.label) {
case 0:
return t = this.atomWorld.universe, (e = t.configDataStore.get(this.atomName)) || (e = {}, 
t.configDataStore.set(this.atomName, e)), this.atomState = e, [ 4, this._generateConfigInto(e) ];

case 1:
return n.sent(), [ 2 ];
}
});
});
}, o.prototype._generateConfigInto = function(e) {
return s(this, void 0, void 0, function() {
var n, o, r, i, a, s, l;
return u(this, function(u) {
switch (u.label) {
case 0:
return n = this.defineConfig(), Object.assign(e, n), this.atomWorld ? (this.atomWorld.universe.featureResolver.applyOverrides(this.atomName, e), 
(o = n.JsonAsset) ? (r = Kn(o), i = r.featureName, a = r.assetPath, [ 4, this.atomWorld.universe.asset.loadAsset(i, a, t.LoaderAssetType.Json) ]) : [ 3, 2 ]) : [ 2 ];

case 1:
if (s = u.sent(), !this.atomWorld) return [ 2 ];
if (null == s ? void 0 : s.json) {
for (l in e) delete e[l];
Object.assign(e, s.json);
}
u.label = 2;

case 2:
return this.genChain ? [ 4, this.genChain.execute() ] : [ 3, 4 ];

case 3:
u.sent(), u.label = 4;

case 4:
return [ 2 ];
}
});
});
}, o.prototype.onReady = function() {
return s(this, void 0, void 0, function() {
return u(this, function(t) {
switch (t.label) {
case 0:
return [ 4, this._loadConfig() ];

case 1:
return t.sent(), this.atomWorld ? (this.atomWorld.loadTracker.complete(), [ 2 ]) : [ 2 ];
}
});
});
}, o.prototype.reloadAsync = function() {
return s(this, void 0, void 0, function() {
return u(this, function(t) {
switch (t.label) {
case 0:
return [ 4, this._generateConfigInto(this.atomState) ];

case 1:
return t.sent(), [ 2 ];
}
});
});
}, o.prototype.registerToChain = function(t) {
return this.genChain || (this.genChain = new Ce(this.atomWorld, this.atomName)), 
this.genChain.addAtom(t), this.genChain;
}, o.prototype.unregisterFromChain = function(t) {
if (!this.genChain) return !1;
var e = this.genChain.removeAtom(t);
return e && (this.genChain = null), e;
}, o.prototype.getChain = function() {
return this.genChain;
}, o.prototype.url = function(t) {
return function(e, n) {
return "".concat(n || t).concat(Zn).concat(e);
};
}, o[_e] = !0, o;
}(ge), eo = function() {
function e(t) {
this.worldId = "", this.isActive = !0, this.nodeName = "", this._assetLoadingUrls = {}, 
this._currentMaterial = null, this._lastMaterialParams = null, this._eventBindings = new Map(), 
this.universe = t;
}
return e.prototype.restoreMaterial = function() {
this._currentMaterial && (this.applyMaterial(this._currentMaterial), this._lastMaterialParams && this.applyMaterialProperties(this._currentMaterial, this._lastMaterialParams, !0));
}, e.prototype.initRender = function(t, e) {
this.eid = t, this.worldId = e;
}, e.prototype.disposeRender = function() {
var t = this;
this.eid = 0, this._assetLoadingUrls = {}, this._currentMaterial = null, this._lastMaterialParams = null, 
this._eventBindings.forEach(function(e, n) {
e.listener && t.offNative(n, e.listener, e.appliedCapture);
}), this._eventBindings.clear();
}, e.prototype.bindTouchEvent = function(t, e) {
var n = this;
this.bindBaseEvent(t, e, function(e) {
return n.createNativeListener(t, e);
});
}, e.prototype.bindSizeInputEvent = function(t, e) {
var n = this;
this.bindBaseEvent(t, e, function(t) {
return function() {
var e = {
width: n.getWidth(),
height: n.getHeight(),
eid: n.eid,
worldId: n.worldId
};
n.universe.handleSizeInputEvent(e), t(e);
};
});
}, e.prototype.bindPositionInputEvent = function(t, e) {
var n = this;
this.bindBaseEvent(t, e, function(t) {
return function() {
var e = {
x: n.getX(),
y: n.getY(),
eid: n.eid,
worldId: n.worldId
};
n.universe.handlePositionInputEvent(e), t(e);
};
});
}, e.prototype.bindBaseEvent = function(t, e, n) {
var o = this._getOrCreateBinding(t);
o.callback = e, o.listenerCreator = n, this._rebindEvent(t);
}, e.prototype.bindTouchEventOption = function(t, e) {
this._getOrCreateBinding(t).options = !0 === e ? {
capture: !0
} : !1 !== e && void 0 !== e ? e : void 0, this._rebindEvent(t);
}, e.prototype._getOrCreateBinding = function(t) {
var e = this._eventBindings.get(t);
return e || (e = {
callback: null,
appliedCapture: !1
}, this._eventBindings.set(t, e)), e;
}, e.prototype._rebindEvent = function(t) {
var e, n, o = this._eventBindings.get(t);
if (o) if (o.listener && (this.offNative(t, o.listener, o.appliedCapture), o.listener = void 0), 
o.callback && o.listenerCreator) {
var r = !0 === (null === (e = o.options) || void 0 === e ? void 0 : e.capture), i = !0 === (null === (n = o.options) || void 0 === n ? void 0 : n.stopPropagation), a = o.listenerCreator(o.callback), s = i ? this.wrapStopPropagation(a) : a;
o.listener = s, o.appliedCapture = r, this.onNative(t, s, r);
} else o.callback || o.options || this._eventBindings.delete(t);
}, e.prototype.loadAsset = function(t, e, n, o, r) {
var i = this;
this._assetLoadingUrls[t] = e;
var a = Kn(e), s = a.featureName, u = a.assetPath;
this.universe.asset.loadAsset(s, u, n).then(function(n) {
i._assetLoadingUrls[t] === e && o(n);
}).catch(function(n) {
i._assetLoadingUrls[t] === e && (null == r || r(n));
});
}, e.prototype.setMaterial = function(e) {
var n = this;
this.nativeRenderer && (this._lastMaterialParams = e, this._assetLoadingUrls.material === e.url && this._currentMaterial ? this.applyMaterialProperties(this._currentMaterial, e) : (this._currentMaterial = null, 
this.loadAsset("material", e.url, t.LoaderAssetType.Material, function(t) {
n._currentMaterial = t, n.applyMaterial(t), n.applyMaterialProperties(t, e);
})));
}, e.prototype.applyMaterialProperties = function(e, n, o) {
var r = this;
if (void 0 === o && (o = !1), e) {
var i = function(e) {
if ("url" === e) return "continue";
var i = n[e];
"string" == typeof i && i.includes(Zn) ? a.loadAsset("material_prop_".concat(e), i, t.LoaderAssetType.Texture, function(t) {
r._setMaterialProperty(e, t, o && n.url);
}) : a._setMaterialProperty(e, i, o && n.url);
}, a = this;
for (var s in n) i(s);
}
}, e.prototype._setMaterialProperty = function(t, e, n) {
if (n) try {
this.setMaterialProperty(t, e);
} catch (t) {} else this.setMaterialProperty(t, e);
}, e.prototype.setActiveBase = function(t) {
this.isActive = t, this.setActive(t);
}, e;
}();
t.CameraLayer = void 0, ($n = t.CameraLayer || (t.CameraLayer = {}))[$n.Host = 1] = "Host", 
$n[$n.Background = 2] = "Background", $n[$n.GameWorld = 4] = "GameWorld", $n[$n.UI = 8] = "UI", 
$n[$n.Gizmos = 16] = "Gizmos", $n[$n.Everything = 31] = "Everything";
var no, oo, ro = function() {
function e(e) {
if (this._mapping = new Map([ [ t.CameraLayer.UI, t.CameraLayer.UI ], [ t.CameraLayer.GameWorld, t.CameraLayer.GameWorld ], [ t.CameraLayer.Background, t.CameraLayer.Background ], [ t.CameraLayer.Gizmos, t.CameraLayer.Gizmos ], [ t.CameraLayer.Host, t.CameraLayer.Host ] ]), 
e) for (var n in e) {
var o = Number(n);
this._mapping.set(o, e[o]);
}
}
return e.prototype.getPhysicalIndex = function(t) {
var e, n = null !== (e = this._mapping.get(t)) && void 0 !== e ? e : t;
return Math.log2(n);
}, e.prototype.toPhysicalMask = function(t) {
var e, n, o = 0;
try {
for (var r = l(this._mapping), i = r.next(); !i.done; i = r.next()) {
var a = c(i.value, 2), s = a[0], u = a[1];
t & s && (o |= u);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
i && !i.done && (n = r.return) && n.call(r);
} finally {
if (e) throw e.error;
}
}
return o;
}, e;
}();
t.ProjectionType = void 0, (no = t.ProjectionType || (t.ProjectionType = {}))[no.Perspective = 0] = "Perspective", 
no[no.Orthographic = 1] = "Orthographic", t.CameraClearFlags = void 0, (oo = t.CameraClearFlags || (t.CameraClearFlags = {}))[oo.None = 0] = "None", 
oo[oo.Color = 1] = "Color", oo[oo.Depth = 2] = "Depth", oo[oo.Stencil = 4] = "Stencil", 
oo[oo.ColorAndDepth = 3] = "ColorAndDepth", oo[oo.All = 7] = "All";
var io, ao, so = {
viewport: {
x: function(t, e) {
return t.setViewportX(e);
},
y: function(t, e) {
return t.setViewportY(e);
},
width: function(t, e) {
return t.setViewportWidth(e);
},
height: function(t, e) {
return t.setViewportHeight(e);
}
},
cullingMask: function(t, e) {
return t.setCullingMask(e);
},
cameraDepth: function(t, e) {
return t.setCameraDepth(e);
},
projection: function(t, e) {
return t.setProjection(e);
},
fov: function(t, e) {
return t.setFov(e);
},
orthoHeight: function(t, e) {
return t.setOrthoHeight(e);
},
near: function(t, e) {
return t.setNear(e);
},
far: function(t, e) {
return t.setFar(e);
},
cameraRgb: function(t, e) {
return t.setCameraRgb(e);
},
cameraAlpha: function(t, e) {
return t.setCameraAlpha(e);
},
clearFlags: function(t, e) {
return t.setClearFlags(e);
},
zoomRatio: function(t, e) {
return t.setZoomRatio(e);
},
alignWithScreen: function(t, e) {
return t.setAlignWithScreen(e);
},
renderStages: function(t, e) {
return t.setRenderStages(e);
}
}, uo = {
v2: new cc.Vec2(),
v3: new cc.Vec3(),
color: new cc.Color(),
quat: new cc.Quat(),
_v2Pool: [],
_v3Pool: [],
_v4Pool: [],
getV2s: function(t) {
for (var e = this._v2Pool; e.length < t; ) e.push(cc.v2());
return e;
},
getV3s: function(t) {
for (var e = this._v3Pool; e.length < t; ) e.push(cc.v3());
return e;
},
getV4s: function(t) {
for (var e = this._v4Pool; e.length < t; ) e.push(new cc.Color());
return e;
}
}, lo = function(e) {
function o(n) {
var o = e.call(this, n) || this;
return o._quat = new cc.Quat(), o._width = 0, o._height = 0, o._depth = 0, o._cameraLayerExplicitlySet = !1, 
o._cameraLayer = t.CameraLayer.GameWorld, o.widgetComp = null, o.layoutComp = null, 
o.buttonComp = null, o.blockInputComp = null, o.safeAreaComp = null, o.nativeRenderer = void 0, 
o.nativeNode = new cc.Node(), o.nativeNode._cocosNodeRef = o, o.setCameraLayer(t.CameraLayer.Host, !1), 
o;
}
return n(o, e), o.prototype.applyMaterial = function(t) {
var e = this.nativeRenderer;
(null == e ? void 0 : e.setMaterial) && e.setMaterial(0, t);
}, o.prototype.setMaterialProperty = function(t, e) {
var n, o, r = this.nativeRenderer, i = null === (n = null == r ? void 0 : r.getMaterial) || void 0 === n ? void 0 : n.call(r, 0);
i && (null === (o = i.setProperty) || void 0 === o || o.call(i, t, e));
}, o.prototype.onNative = function(t, e, n) {
this.nativeNode.on(t, e, this, n);
}, o.prototype.offNative = function(t, e, n) {
this.nativeNode.off(t, e, this, n);
}, o.prototype.wrapStopPropagation = function(t) {
return function(e) {
null == e || e.stopPropagation(), t(e);
};
}, o.prototype.createNativeListener = function(t, e) {
var n = this;
return function(o) {
var r = o.getLocation(), i = o.getDelta(), a = n.nativeNode.convertToNodeSpaceAR(r), s = cc.view.getVisibleOrigin(), u = cc.macro.ENABLE_MULTI_TOUCH ? o.getTouches().map(function(t) {
var e = t.getLocation(), o = t.getDelta(), r = n.nativeNode.convertToNodeSpaceAR(e);
return {
x: e.x - s.x,
y: e.y - s.y,
dx: o.x,
dy: o.y,
touchId: t.getID(),
eid: n.eid,
localX: r.x,
localY: r.y
};
}) : [], l = {
x: r.x - s.x,
y: r.y - s.y,
dx: i.x,
dy: i.y,
touchId: o.getID(),
eid: n.eid,
localX: a.x,
localY: a.y,
eventType: t,
worldId: n.worldId,
multiTouchs: u
};
n.universe.handlePointerEvent(l), e(l);
};
}, o.prototype.setButtonClick = function(t) {
this.ensureButton();
var e = this.nativeNode.getComponent(co);
e || (e = this.nativeNode.addComponent(co)), e.callback = t;
var n = new cc.Component.EventHandler();
n.target = this.nativeNode, n.component = "AEButtonProxy", n.handler = "onClick", 
this.ensureButton().clickEvents = [ n ];
}, o.prototype.setOnTouchStart = function(t) {
this.bindTouchEvent(cc.Node.EventType.TOUCH_START, t);
}, o.prototype.setOnTouchMove = function(t) {
this.bindTouchEvent(cc.Node.EventType.TOUCH_MOVE, t);
}, o.prototype.setOnTouchEnd = function(t) {
this.bindTouchEvent(cc.Node.EventType.TOUCH_END, t);
}, o.prototype.setOnTouchCancel = function(t) {
this.bindTouchEvent(cc.Node.EventType.TOUCH_CANCEL, t);
}, o.prototype.setOnSizeChanged = function(t) {
this.bindSizeInputEvent(cc.Node.EventType.SIZE_CHANGED, t);
}, o.prototype.setOnPositionChanged = function(t) {
this.bindPositionInputEvent(cc.Node.EventType.POSITION_CHANGED, t);
}, o.prototype.setTouchStartOption = function(t) {
this.bindTouchEventOption(cc.Node.EventType.TOUCH_START, t);
}, o.prototype.setTouchMoveOption = function(t) {
this.bindTouchEventOption(cc.Node.EventType.TOUCH_MOVE, t);
}, o.prototype.setTouchEndOption = function(t) {
this.bindTouchEventOption(cc.Node.EventType.TOUCH_END, t);
}, o.prototype.setTouchCancelOption = function(t) {
this.bindTouchEventOption(cc.Node.EventType.TOUCH_CANCEL, t);
}, o.prototype.getName = function() {
return this.nodeName;
}, o.prototype.getX = function() {
return this.nativeNode.x;
}, o.prototype.getY = function() {
return this.nativeNode.y;
}, o.prototype.getZ = function() {
return this.nativeNode.z;
}, o.prototype.getWidth = function() {
return this.nativeNode.width;
}, o.prototype.getHeight = function() {
return this.nativeNode.height;
}, o.prototype.setName = function(t) {
this.nodeName = t, isNaN(this.eid) || (t += ":eid=" + this.eid), this.nativeNode.name = t;
}, o.prototype.setCameraLayer = function(t, e) {
void 0 === e && (e = !0);
var n = t, o = this.universe.layerMapping.getPhysicalIndex(n);
this.nativeNode.groupIndex = o, this._cameraLayer = n, this._cameraLayerExplicitlySet = e, 
e && this._applyLayerRecursively(this.nativeNode, n, o);
}, o.prototype._applyLayerRecursively = function(t, e, n) {
for (var o = t.children, r = 0; r < o.length; r++) {
var i = o[r], a = i._cocosNodeRef;
a && (a._cameraLayerExplicitlySet || (i.groupIndex = n, a._cameraLayer = e, a._cameraLayerExplicitlySet = !1, 
this._applyLayerRecursively(i, e, n)));
}
}, o.prototype.addChild = function(t) {
if (this.nativeNode.addChild(t.nativeNode), !t._cameraLayerExplicitlySet) {
var e = this.universe.layerMapping.getPhysicalIndex(this._cameraLayer);
t.nativeNode.groupIndex = e, t._cameraLayer = this._cameraLayer, this._applyLayerRecursively(t.nativeNode, this._cameraLayer, e);
}
}, o.prototype.removeChild = function(t) {
this.nativeNode.removeChild(t.nativeNode);
}, o.prototype.removeFromParent = function() {
this.nativeNode.removeFromParent(!1);
}, o.prototype.destroyNative = function() {
this.nativeNode._cocosNodeRef = void 0, cc.isValid(this.nativeNode) && this.nativeNode.destroy();
}, o.prototype.setX = function(t) {
this.nativeNode.x = t;
}, o.prototype.setY = function(t) {
this.nativeNode.y = t;
}, o.prototype.setZ = function(t) {
this.nativeNode.z = t;
}, o.prototype.setAngle = function(t) {
this.nativeNode.angle = t;
}, o.prototype.setQuatX = function(t) {
this._quat.x = t, this.updateRotation();
}, o.prototype.setQuatY = function(t) {
this._quat.y = t, this.updateRotation();
}, o.prototype.setQuatZ = function(t) {
this._quat.z = t, this.updateRotation();
}, o.prototype.setQuatW = function(t) {
this._quat.w = t, this.updateRotation();
}, o.prototype.updateRotation = function() {
this.nativeNode.setRotation(this._quat);
}, o.prototype.setScale = function(t) {
this.nativeNode.scale = t;
}, o.prototype.setScaleX = function(t) {
this.nativeNode.scaleX = t;
}, o.prototype.setScaleY = function(t) {
this.nativeNode.scaleY = t;
}, o.prototype.setScaleZ = function() {}, o.prototype.setAnchorX = function(t) {
this.nativeNode.anchorX = t;
}, o.prototype.setAnchorY = function(t) {
this.nativeNode.anchorY = t;
}, o.prototype.setAnchorZ = function() {}, o.prototype.setZIndex = function(t) {
this.nativeNode.zIndex = t;
}, o.prototype.setDepth = function(t) {
this._depth = t;
}, o.prototype.setWidth = function(t) {
this._width = t, this.nativeNode.width = t;
}, o.prototype.setHeight = function(t) {
this._height = t, this.nativeNode.height = t;
}, o.prototype.opacityToAlpha = function(t) {
return Math.floor(255 * t);
}, o.prototype.setAlpha = function(t) {
this.nativeNode.opacity = this.opacityToAlpha(t);
}, o.prototype.setActive = function(t) {
this.nativeNode.active = t;
}, o.prototype.setBlockInputEvents = function(t) {
t ? (this.blockInputComp || (this.blockInputComp = this.nativeNode.addComponent(cc.BlockInputEvents)), 
this.blockInputComp.enabled = !0) : this.blockInputComp && (this.blockInputComp.enabled = !1);
}, o.prototype.setWidgetEnabled = function(t) {
this.ensureWidget().enabled = t;
}, o.prototype.ensureWidget = function() {
return this.widgetComp || (this.widgetComp = this.nativeNode.addComponent(cc.Widget)), 
this.widgetComp;
}, o.prototype.setWidgetAlignTop = function(t) {
this.ensureWidget().isAlignTop = t;
}, o.prototype.setWidgetAlignBottom = function(t) {
this.ensureWidget().isAlignBottom = t;
}, o.prototype.setWidgetAlignLeft = function(t) {
this.ensureWidget().isAlignLeft = t;
}, o.prototype.setWidgetAlignRight = function(t) {
this.ensureWidget().isAlignRight = t;
}, o.prototype.setWidgetAlignHorizontalCenter = function(t) {
this.ensureWidget().isAlignHorizontalCenter = t;
}, o.prototype.setWidgetAlignVerticalCenter = function(t) {
this.ensureWidget().isAlignVerticalCenter = t;
}, o.prototype.setWidgetTop = function(t) {
var e = this.ensureWidget();
e.isAlignTop = !0, e.top = t;
}, o.prototype.setWidgetBottom = function(t) {
var e = this.ensureWidget();
e.isAlignBottom = !0, e.bottom = t;
}, o.prototype.setWidgetLeft = function(t) {
var e = this.ensureWidget();
e.isAlignLeft = !0, e.left = t;
}, o.prototype.setWidgetRight = function(t) {
var e = this.ensureWidget();
e.isAlignRight = !0, e.right = t;
}, o.prototype.setWidgetHorizontalCenter = function(t) {
var e = this.ensureWidget();
e.isAlignHorizontalCenter = !0, e.horizontalCenter = t;
}, o.prototype.setWidgetVerticalCenter = function(t) {
var e = this.ensureWidget();
e.isAlignVerticalCenter = !0, e.verticalCenter = t;
}, o.prototype.setWidgetAlignMode = function(e) {
var n, o = ((n = {})[t.WidgetAlignMode.Once] = cc.Widget.AlignMode.ONCE, n[t.WidgetAlignMode.OnWindowResize] = cc.Widget.AlignMode.ON_WINDOW_RESIZE, 
n[t.WidgetAlignMode.Always] = cc.Widget.AlignMode.ALWAYS, n);
this.ensureWidget().alignMode = o[e];
}, o.prototype.ensureSafeArea = function() {
return this.safeAreaComp || (this.ensureWidget(), this.safeAreaComp = this.nativeNode.addComponent(cc.SafeArea)), 
this.safeAreaComp;
}, o.prototype.setSafeAreaEnabled = function(t) {
this.ensureSafeArea().enabled = t;
}, o.prototype.ensureLayout = function() {
return this.layoutComp || (this.layoutComp = this.nativeNode.addComponent(cc.Layout)), 
this.layoutComp;
}, o.prototype.setLayoutType = function(e) {
var n, o = ((n = {})[t.LayoutType.Horizontal] = cc.Layout.Type.HORIZONTAL, n[t.LayoutType.Vertical] = cc.Layout.Type.VERTICAL, 
n[t.LayoutType.Grid] = cc.Layout.Type.GRID, n);
this.ensureLayout().type = o[e];
}, o.prototype.setLayoutResizeMode = function(e) {
var n, o = ((n = {})[t.LayoutResizeMode.None] = cc.Layout.ResizeMode.NONE, n[t.LayoutResizeMode.Container] = cc.Layout.ResizeMode.CONTAINER, 
n[t.LayoutResizeMode.Children] = cc.Layout.ResizeMode.CHILDREN, n);
this.ensureLayout().resizeMode = o[e];
}, o.prototype.setLayoutSpacingX = function(t) {
this.ensureLayout().spacingX = t;
}, o.prototype.setLayoutSpacingY = function(t) {
this.ensureLayout().spacingY = t;
}, o.prototype.setLayoutPaddingLeft = function(t) {
this.ensureLayout().paddingLeft = t;
}, o.prototype.setLayoutPaddingRight = function(t) {
this.ensureLayout().paddingRight = t;
}, o.prototype.setLayoutPaddingTop = function(t) {
this.ensureLayout().paddingTop = t;
}, o.prototype.setLayoutPaddingBottom = function(t) {
this.ensureLayout().paddingBottom = t;
}, o.prototype.setLayoutStartAxis = function(e) {
var n, o = ((n = {})[t.LayoutAxisDirection.Horizontal] = cc.Layout.AxisDirection.HORIZONTAL, 
n[t.LayoutAxisDirection.Vertical] = cc.Layout.AxisDirection.VERTICAL, n);
this.ensureLayout().startAxis = o[e];
}, o.prototype.setLayoutVerticalDirection = function(e) {
var n, o = ((n = {})[t.LayoutVerticalDirection.TopToBottom] = cc.Layout.VerticalDirection.TOP_TO_BOTTOM, 
n[t.LayoutVerticalDirection.BottomToTop] = cc.Layout.VerticalDirection.BOTTOM_TO_TOP, 
n);
this.ensureLayout().verticalDirection = o[e];
}, o.prototype.setLayoutHorizontalDirection = function(e) {
var n, o = ((n = {})[t.LayoutHorizontalDirection.LeftToRight] = cc.Layout.HorizontalDirection.LEFT_TO_RIGHT, 
n[t.LayoutHorizontalDirection.RightToLeft] = cc.Layout.HorizontalDirection.RIGHT_TO_LEFT, 
n);
this.ensureLayout().horizontalDirection = o[e];
}, o.prototype.setLayoutEnabled = function(t) {
this.ensureLayout().enabled = t;
}, o.prototype.ensureButton = function() {
return this.buttonComp || (this.buttonComp = this.nativeNode.addComponent(cc.Button), 
this.buttonComp.target = this.nativeNode), this.buttonComp;
}, o.prototype.setRgbColor = function(t, e) {
e.r = t >>> 16 & 255, e.g = t >>> 8 & 255, e.b = 255 & t;
}, o.prototype.setRgb = function(t) {
this.setRgbColor(t, uo.color), uo.color.a = this.nativeNode.color.a, this.nativeNode.color = uo.color;
}, o.prototype.setButtonInteractable = function(t) {
this.ensureButton().interactable = t;
}, o.prototype.setButtonEnableAutoGrayEffect = function(t) {
this.ensureButton().enableAutoGrayEffect = t;
}, o.prototype.setButtonTransition = function(e) {
var n, o = ((n = {})[t.ButtonTransition.None] = cc.Button.Transition.NONE, n[t.ButtonTransition.Color] = cc.Button.Transition.COLOR, 
n[t.ButtonTransition.Sprite] = cc.Button.Transition.SPRITE, n[t.ButtonTransition.Scale] = cc.Button.Transition.SCALE, 
n);
this.ensureButton().transition = o[e];
}, o.prototype.setButtonDuration = function(t) {
this.ensureButton().duration = t;
}, o.prototype.setButtonZoomScale = function(t) {
this.ensureButton().zoomScale = t;
}, o.prototype.setButtonNormalColor = function(t) {
var e = this.ensureButton();
this.setRgbColor(t, uo.color), uo.color.a = e.normalColor.a, e.normalColor = uo.color.clone();
}, o.prototype.setButtonNormalAlpha = function(t) {
var e = this.ensureButton();
uo.color.set(e.normalColor), uo.color.a = this.opacityToAlpha(t), e.normalColor = uo.color.clone();
}, o.prototype.setButtonPressedColor = function(t) {
var e = this.ensureButton();
this.setRgbColor(t, uo.color), uo.color.a = e.pressedColor.a, e.pressedColor = uo.color.clone();
}, o.prototype.setButtonPressedAlpha = function(t) {
var e = this.ensureButton();
uo.color.set(e.pressedColor), uo.color.a = this.opacityToAlpha(t), e.pressedColor = uo.color.clone();
}, o.prototype.setButtonHoverColor = function(t) {
var e = this.ensureButton();
this.setRgbColor(t, uo.color), uo.color.a = e.hoverColor.a, e.hoverColor = uo.color.clone();
}, o.prototype.setButtonHoverAlpha = function(t) {
var e = this.ensureButton();
uo.color.set(e.hoverColor), uo.color.a = this.opacityToAlpha(t), e.hoverColor = uo.color.clone();
}, o.prototype.setButtonDisabledColor = function(t) {
var e = this.ensureButton();
this.setRgbColor(t, uo.color), uo.color.a = e.disabledColor.a, e.disabledColor = uo.color.clone();
}, o.prototype.setButtonDisabledAlpha = function(t) {
var e = this.ensureButton();
uo.color.set(e.disabledColor), uo.color.a = this.opacityToAlpha(t), e.disabledColor = uo.color.clone();
}, o.prototype.setButtonNormalSprite = function(e) {
var n = this;
this.loadAsset("btnNormal", e, t.LoaderAssetType.SpriteFrame, function(t) {
n.ensureButton().normalSprite = t;
});
}, o.prototype.setButtonPressedSprite = function(e) {
var n = this;
this.loadAsset("btnPressed", e, t.LoaderAssetType.SpriteFrame, function(t) {
n.ensureButton().pressedSprite = t;
});
}, o.prototype.setButtonHoverSprite = function(e) {
var n = this;
this.loadAsset("btnHover", e, t.LoaderAssetType.SpriteFrame, function(t) {
n.ensureButton().hoverSprite = t;
});
}, o.prototype.setButtonDisabledSprite = function(e) {
var n = this;
this.loadAsset("btnDisabled", e, t.LoaderAssetType.SpriteFrame, function(t) {
n.ensureButton().disabledSprite = t;
});
}, o.prototype.setButtonTarget = function(t) {
var e = this, n = this.ensureButton();
if (t) {
var o = 0, r = function() {
if (cc.isValid(e.nativeNode)) {
var i = e._findNodeInDescendants(e.nativeNode, t);
i ? n.target = i : o < 5 && (o++, cc.director.once(cc.Director.EVENT_AFTER_UPDATE, r));
}
};
r();
} else n.target = this.nativeNode;
}, o.prototype._findNodeInDescendants = function(t, e) {
for (var n = t.children, o = 0; o < n.length; o++) {
var r = n[o], i = r._cocosNodeRef;
if (i && i.nodeName === e || r.name === e) return r;
var a = this._findNodeInDescendants(r, e);
if (a) return a;
}
}, o.prototype.setButtonEnabled = function(t) {
this.ensureButton().enabled = t;
}, o;
}(eo), co = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.onClick = function() {
this.callback && this.callback();
}, i([ cc._decorator.ccclass("AEButtonProxy") ], e);
}(cc.Component);
t.TextOverflow = void 0, (io = t.TextOverflow || (t.TextOverflow = {}))[io.NONE = 0] = "NONE", 
io[io.CLAMP = 1] = "CLAMP", io[io.SHRINK = 2] = "SHRINK", io[io.RESIZE_HEIGHT = 3] = "RESIZE_HEIGHT", 
t.TextVerticalAlign = void 0, (ao = t.TextVerticalAlign || (t.TextVerticalAlign = {}))[ao.TOP = 0] = "TOP", 
ao[ao.CENTER = 1] = "CENTER", ao[ao.BOTTOM = 2] = "BOTTOM";
var ho, po = {
text: function(t, e) {
return t.setText(e);
},
fontSize: function(t, e) {
return t.setFontSize(e);
},
horizontalAlign: function(t, e) {
return t.setHorizontalAlign(e);
},
verticalAlign: function(t, e) {
return t.setVerticalAlign(e);
},
overflow: function(t, e) {
return t.setOverflow(e);
},
enableBold: function(t, e) {
return t.setEnableBold(e);
},
enableItalic: function(t, e) {
return t.setEnableItalic(e);
},
fontFamily: function(t, e) {
return t.setFontFamily(e);
},
lineHeight: function(t, e) {
return t.setLineHeight(e);
},
enableWrapText: function(t, e) {
return t.setEnableWrapText(e);
},
font: function(t, e) {
return t.setFont(e);
},
spacingX: function(t, e) {
return t.setSpacingX(e);
},
cacheMode: function(t, e) {
return t.setCacheMode(e);
},
enableUnderline: function(t, e) {
return t.setEnableUnderline(e);
},
underlineHeight: function(t, e) {
return t.setUnderlineHeight(e);
},
outline: {
rgb: function(t, e) {
return t.setOutlineRgb(e);
},
alpha: function(t, e) {
return t.setOutlineAlpha(e);
},
width: function(t, e) {
return t.setOutlineWidth(e);
}
},
shadow: {
rgb: function(t, e) {
return t.setShadowRgb(e);
},
alpha: function(t, e) {
return t.setShadowAlpha(e);
},
offset: function(t, e) {
return t.setShadowOffset(e[0], e[1]);
},
blur: function(t, e) {
return t.setShadowBlur(e);
}
}
}, fo = function(e) {
function o(t) {
var n = e.call(this, t) || this;
return n.nativeRenderer = n.nativeNode.getComponent(cc.Label) || n.nativeNode.addComponent(cc.Label), 
n.nativeRenderer.verticalAlign = cc.Label.VerticalAlign.CENTER, n;
}
return n(o, e), o.prototype.setText = function(t) {
this.nativeRenderer.string = t;
}, o.prototype.setFontSize = function(t) {
this.nativeRenderer.fontSize = t, this.nativeRenderer.lineHeight < t && (this.nativeRenderer.lineHeight = t);
}, o.prototype.setHorizontalAlign = function(e) {
switch (e) {
case t.TextHorizontalAlign.LEFT:
this.nativeRenderer.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
break;

case t.TextHorizontalAlign.CENTER:
this.nativeRenderer.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
break;

case t.TextHorizontalAlign.RIGHT:
this.nativeRenderer.horizontalAlign = cc.Label.HorizontalAlign.RIGHT;
}
}, o.prototype.setVerticalAlign = function(e) {
switch (e) {
case t.TextVerticalAlign.TOP:
this.nativeRenderer.verticalAlign = cc.Label.VerticalAlign.TOP;
break;

case t.TextVerticalAlign.CENTER:
this.nativeRenderer.verticalAlign = cc.Label.VerticalAlign.CENTER;
break;

case t.TextVerticalAlign.BOTTOM:
this.nativeRenderer.verticalAlign = cc.Label.VerticalAlign.BOTTOM;
}
}, o.prototype.setOverflow = function(e) {
switch (e) {
case t.TextOverflow.NONE:
this.nativeRenderer.overflow = cc.Label.Overflow.NONE;
break;

case t.TextOverflow.CLAMP:
this.nativeRenderer.overflow = cc.Label.Overflow.CLAMP;
break;

case t.TextOverflow.SHRINK:
this.nativeRenderer.overflow = cc.Label.Overflow.SHRINK;
break;

case t.TextOverflow.RESIZE_HEIGHT:
this.nativeRenderer.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
}
}, o.prototype.setEnableBold = function(t) {
this.nativeRenderer.enableBold = t;
}, o.prototype.setEnableItalic = function(t) {
this.nativeRenderer.enableItalic = t;
}, o.prototype.setFontFamily = function(t) {
this.nativeRenderer.fontFamily = t;
}, o.prototype.setLineHeight = function(t) {
this.nativeRenderer.lineHeight = t;
}, o.prototype.setEnableWrapText = function(t) {
this.nativeRenderer.enableWrapText = t;
}, o.prototype.setFont = function(e) {
var n = this;
this.loadAsset("font", e, t.LoaderAssetType.Font, function(t) {
n.nativeRenderer.font = t, n.nativeNode._renderFlag |= 96;
});
}, o.prototype.setAlpha = function(t) {
var n, o;
e.prototype.setAlpha.call(this, t), (null === (o = (n = this.nativeRenderer)._nativeTTF) || void 0 === o ? void 0 : o.call(n)) && this.nativeRenderer.setVertsDirty();
}, o.prototype.setSpacingX = function(t) {
this.nativeRenderer.spacingX = t;
}, o.prototype.setCacheMode = function(e) {
switch (e) {
case t.LabelCacheMode.NONE:
this.nativeRenderer.cacheMode = cc.Label.CacheMode.NONE;
break;

case t.LabelCacheMode.BITMAP:
this.nativeRenderer.cacheMode = cc.Label.CacheMode.BITMAP;
break;

case t.LabelCacheMode.CHAR:
this.nativeRenderer.cacheMode = cc.Label.CacheMode.CHAR;
}
}, o.prototype.setEnableUnderline = function(t) {
this.nativeRenderer.enableUnderline = t;
}, o.prototype.setUnderlineHeight = function(t) {
this.nativeRenderer.underlineHeight = t;
}, o.prototype.ensureOutline = function() {
return this._outlineComp || (this._outlineComp = this.nativeNode.getComponent(cc.LabelOutline) || this.nativeNode.addComponent(cc.LabelOutline)), 
this._outlineComp;
}, o.prototype.setOutlineRgb = function(t) {
var e = this.ensureOutline();
this.setRgbColor(t, uo.color), uo.color.a = e.color.a, e.color = uo.color;
}, o.prototype.setOutlineAlpha = function(t) {
var e = this.ensureOutline();
uo.color.set(e.color), uo.color.a = this.opacityToAlpha(t), e.color = uo.color;
}, o.prototype.setOutlineWidth = function(t) {
this.ensureOutline().width = t;
}, o.prototype.ensureShadow = function() {
return this._shadowComp || (this._shadowComp = this.nativeNode.getComponent(cc.LabelShadow) || this.nativeNode.addComponent(cc.LabelShadow)), 
this._shadowComp;
}, o.prototype.setShadowRgb = function(t) {
var e = this.ensureShadow();
this.setRgbColor(t, uo.color), uo.color.a = e.color.a, e.color = uo.color;
}, o.prototype.setShadowAlpha = function(t) {
var e = this.ensureShadow();
uo.color.set(e.color), uo.color.a = this.opacityToAlpha(t), e.color = uo.color;
}, o.prototype.setShadowOffset = function(t, e) {
this.ensureShadow().offset = new cc.Vec2(t, e);
}, o.prototype.setShadowBlur = function(t) {
this.ensureShadow().blur = t;
}, o;
}(lo);
t.SpineControl = void 0, (ho = t.SpineControl || (t.SpineControl = {}))[ho.Pause = 1] = "Pause", 
ho[ho.Resume = 2] = "Resume", ho[ho.Stop = 3] = "Stop";
var mo = {
spineUrl: function(t, e) {
return t.setSpineUrl(e);
},
animation: {
name: function(t, e) {
return t.setAnimationName(e);
},
index: function(t, e) {
return t.setAnimationIndex(e);
},
loop: function(t, e) {
return t.setAnimationLoop(e);
}
},
skin: function(t, e) {
return t.setSkin(e);
},
timeScale: function(t, e) {
return t.setTimeScale(e);
},
premultipliedAlpha: function(t, e) {
return t.setPremultipliedAlpha(e);
},
enableBatch: function(t, e) {
return t.setEnableBatch(e);
},
spineCtrl: function(t, e) {
return t.setSpineCtrl(e);
}
}, yo = {
complete: function(t, e) {
return t.setAnimationComplete(e);
},
frame: function(t, e) {
return t.setAnimationFrameEvent(e);
}
};
function vo(t) {
var e, n;
if (!t) return [];
var r = [];
try {
for (var i = l(Object.entries(t)), a = i.next(); !a.done; a = i.next()) {
var s = c(a.value, 2), u = s[0], d = s[1];
r.push(o(o({}, d), {
_boneName: u,
_bindAlpha: d.bindAlpha
}));
}
} catch (t) {
e = {
error: t
};
} finally {
try {
a && !a.done && (n = i.return) && n.call(i);
} finally {
if (e) throw e.error;
}
}
return r;
}
var _o, go, Ao, Co = function(e) {
function o(t) {
var n = e.call(this, t) || this;
return n._pendingAnimationIndex = 0, n._pendingBoneAttachments = [], n.nativeRenderer = n.nativeNode.getComponent(sp.Skeleton) || n.nativeNode.addComponent(sp.Skeleton), 
n.nativeRenderer.premultipliedAlpha = !1, n.nativeRenderer.loop = !0, n;
}
return n(o, e), Object.defineProperty(o.prototype, "_attachUtil", {
get: function() {
var t;
return null === (t = this.nativeRenderer) || void 0 === t ? void 0 : t.attachUtil;
},
enumerable: !1,
configurable: !0
}), o.prototype.setSpineUrl = function(e) {
var n = this;
this._spineUrl !== e && (this._spineUrl = e, this.loadAsset("spine", e, t.LoaderAssetType.SkeletonData, function(t) {
if (t) {
if (n.nativeRenderer.skeletonData === t) return;
n.nativeRenderer.skeletonData = t, n._alphaSyncComp && n._alphaSyncComp.clearCache(), 
n.nativeRenderer._updateMaterial(), n._pendingSkin && n.nativeRenderer.setSkin(n._pendingSkin), 
n._applyAnimation(), n._applyPendingBoneAttachments(), n._width > 0 && (n.nativeNode.width = n._width), 
n._height > 0 && (n.nativeNode.height = n._height);
}
}, function() {
n._spineUrl = void 0;
}));
}, o.prototype.setAnimationName = function(t) {
this._pendingAnimationName = t, this._applyAnimation();
}, o.prototype.setAnimationIndex = function(t) {
this._pendingAnimationIndex = t;
}, o.prototype.setAnimationLoop = function(t) {
this.nativeRenderer.loop = t;
var e = this.nativeRenderer.getCurrent(this._pendingAnimationIndex);
if (e) {
if (!t && e.loop) {
var n = e.animationStart, o = e.animationEnd - n;
o > 0 && e.trackTime > e.animationEnd && (e.trackTime = n + (e.trackTime - n) % o);
}
e.loop = t;
}
}, o.prototype._applyAnimation = function() {
this.nativeRenderer.skeletonData && this._pendingAnimationName && (this.nativeRenderer.setAnimation(this._pendingAnimationIndex, this._pendingAnimationName, this.nativeRenderer.loop), 
this.nativeRenderer.defaultAnimation = this._pendingAnimationName);
}, o.prototype.setSkin = function(t) {
this._pendingSkin = t, this.nativeRenderer.skeletonData && this.nativeRenderer.setSkin(t);
}, o.prototype.setTimeScale = function(t) {
this.nativeRenderer.timeScale = t;
}, o.prototype.setPremultipliedAlpha = function(t) {
this.nativeRenderer.premultipliedAlpha = t;
}, o.prototype.setEnableBatch = function(t) {
this.nativeRenderer.enableBatch = t;
}, o.prototype.setSpineCtrl = function(e) {
e === t.SpineControl.Pause ? this.nativeRenderer.paused = !0 : e === t.SpineControl.Resume ? this.nativeRenderer.paused = !1 : e === t.SpineControl.Stop && (this.nativeRenderer.clearTracks(), 
this.nativeRenderer.paused = !1);
}, o.prototype.setAnimationComplete = function(t) {
this.nativeRenderer.setCompleteListener(function() {
t && t();
});
}, o.prototype.setAnimationFrameEvent = function(t) {
var e = this;
this.nativeRenderer.setEventListener(function(n, o) {
var r = {
frameEventName: o.data.name,
eid: e.eid,
worldId: e.worldId
};
e.universe.handleSpineFrameEvent(r), t && t(r);
});
}, o.prototype.setMaterialProperty = function(t, n) {
e.prototype.setMaterialProperty.call(this, t, n), this.nativeRenderer._updateMaterial();
}, o.prototype.attachToBone = function(t, e, n) {
this.nativeRenderer.skeletonData ? this._attachToBoneInternal(t, e, n) : this._pendingBoneAttachments.push({
childNode: t,
boneName: e,
bindAlpha: n
});
}, o.prototype._attachToBoneInternal = function(t, e, n) {
var o = this._attachUtil;
if (o) {
var r = o.getAttachedNodes(e);
r && 0 !== r.length || (r = o.generateAttachedNodes(e)), r && r.length > 0 && (t.nativeNode.setParent(r[0]), 
n && (this._alphaSyncComp || (this._alphaSyncComp = this.nativeNode.getComponent(Ro) || this.nativeNode.addComponent(Ro)), 
this._alphaSyncComp.skeleton = this.nativeRenderer, this._alphaSyncComp.attachments.some(function(e) {
return e.childNode === t;
}) || this._alphaSyncComp.attachments.push({
childNode: t,
slotName: n,
cachedSlot: this.nativeRenderer.findSlot(n)
})));
}
}, o.prototype._applyPendingBoneAttachments = function() {
var t = this;
0 !== this._pendingBoneAttachments.length && this._pendingBoneAttachments.splice(0).forEach(function(e) {
var n = e.childNode, o = e.boneName, r = e.bindAlpha;
t._attachToBoneInternal(n, o, r);
});
}, o.prototype._detachAllBoneChildren = function() {
var t, e, n, o, r, i, a = this._attachUtil;
if (a) {
var s = a._attachedRootNode;
if (s) {
var u = [];
try {
for (var c = l(s.children), d = c.next(); !d.done; d = c.next()) {
var h = d.value;
try {
for (var p = (n = void 0, l(h.children)), f = p.next(); !f.done; f = p.next()) {
var m = f.value;
u.push(m);
}
} catch (t) {
n = {
error: t
};
} finally {
try {
f && !f.done && (o = p.return) && o.call(p);
} finally {
if (n) throw n.error;
}
}
}
} catch (e) {
t = {
error: e
};
} finally {
try {
d && !d.done && (e = c.return) && e.call(c);
} finally {
if (t) throw t.error;
}
}
try {
for (var y = l(u), v = y.next(); !v.done; v = y.next()) (m = v.value).setParent(this.nativeNode);
} catch (t) {
r = {
error: t
};
} finally {
try {
v && !v.done && (i = y.return) && i.call(y);
} finally {
if (r) throw r.error;
}
}
}
}
}, o.prototype.disposeRender = function() {
var t;
this._pendingBoneAttachments.length = 0, this._alphaSyncComp && (this._alphaSyncComp.attachments.length = 0, 
this._alphaSyncComp.skeleton = void 0), this._detachAllBoneChildren(), null === (t = this._attachUtil) || void 0 === t || t.destroyAllAttachedNodes(), 
this.nativeRenderer.setCompleteListener(null), this.nativeRenderer.setEventListener(null), 
this.nativeRenderer.clearTracks(), this.nativeRenderer.loop = !0, this.nativeRenderer.paused = !1, 
this.nativeRenderer.skeletonData = void 0, this._spineUrl = void 0, this._pendingAnimationName = void 0, 
this._pendingAnimationIndex = 0, this._pendingSkin = void 0, e.prototype.disposeRender.call(this);
}, o;
}(lo), Ro = function(t) {
function e() {
var e = t.apply(this, d([], c(arguments), !1)) || this;
return e.attachments = [], e;
}
return n(e, t), e.prototype.clearCache = function() {
for (var t = 0; t < this.attachments.length; t++) this.attachments[t].cachedSlot = void 0;
}, e.prototype.lateUpdate = function() {
if (this.skeleton && this.skeleton.skeletonData && 0 !== this.attachments.length) for (var t = 0; t < this.attachments.length; t++) {
var e = this.attachments[t], n = e.childNode.nativeNode;
if (n && cc.isValid(n)) {
var o = e.cachedSlot;
o && o.color || (e.cachedSlot = this.skeleton.findSlot(e.slotName), o = e.cachedSlot), 
o && o.color && (n.opacity = Math.floor(255 * o.color.a));
}
}
}, i([ cc._decorator.ccclass("AESpineAlphaSync") ], e);
}(cc.Component);
t.GraphicsCmd = void 0, (_o = t.GraphicsCmd || (t.GraphicsCmd = {})).MoveTo = "moveTo", 
_o.LineTo = "lineTo", _o.BezierCurveTo = "bezierCurveTo", _o.QuadraticCurveTo = "quadraticCurveTo", 
_o.Arc = "arc", _o.Circle = "circle", _o.Rect = "rect", _o.RoundRect = "roundRect", 
_o.Ellipse = "ellipse", _o.Close = "close", _o.Fill = "fill", _o.Stroke = "stroke", 
_o.Clear = "clear", _o.FillColor = "fillColor", _o.FillAlpha = "fillAlpha", _o.StrokeColor = "strokeColor", 
_o.StrokeAlpha = "strokeAlpha", _o.StrokeWidth = "strokeWidth", _o.LineJoin = "lineJoin", 
_o.LineCap = "lineCap", t.GraphicsLineJoin = void 0, (go = t.GraphicsLineJoin || (t.GraphicsLineJoin = {})).Miter = "Miter", 
go.Round = "Round", go.Bevel = "Bevel", t.GraphicsLineCap = void 0, (Ao = t.GraphicsLineCap || (t.GraphicsLineCap = {})).Butt = "Butt", 
Ao.Round = "Round", Ao.Square = "Square";
var So = {
autoClear: function(t, e) {
return t.setAutoClear(e);
},
draw: function(t, e) {
return t.draw(e);
}
}, To = function(e) {
function o(t) {
var n = this;
return t || re(Et.GraphicsRequired, {}), (n = e.call(this) || this).graphics = t, 
n._strokeColor = new cc.Color(255, 255, 255), n._fillColor = new cc.Color(255, 255, 255), 
n;
}
return n(o, e), o.prototype.moveTo = function(t, e) {
this.graphics.moveTo(t, e);
}, o.prototype.lineTo = function(t, e) {
this.graphics.lineTo(t, e);
}, o.prototype.close = function() {
this.graphics.close();
}, o.prototype.closePath = function() {
this.graphics.close();
}, o.prototype.rect = function(t, e, n, o) {
this.graphics.rect(t, e, n, o);
}, o.prototype.circle = function(t, e, n) {
this.graphics.circle(t, e, n);
}, o.prototype.roundRect = function(t, e, n, o, r) {
this.graphics.roundRect(t, e, n, o, r);
}, o.prototype.ellipse = function(t, e, n, o) {
this.graphics.ellipse(t, e, n, o);
}, o.prototype.arc = function(t, e, n, o, r, i) {
this.graphics.arc(t, e, n, o, r, i);
}, o.prototype.bezierCurveTo = function(t, e, n, o, r, i) {
this.graphics.bezierCurveTo(t, e, n, o, r, i);
}, o.prototype.quadraticCurveTo = function(t, e, n, o) {
this.graphics.quadraticCurveTo(t, e, n, o);
}, o.prototype.stroke = function() {
this.graphics.stroke();
}, o.prototype.fill = function() {
this.graphics.fill();
}, o.prototype.fillRect = function(t, e, n, o) {
this.graphics.fillRect(t, e, n, o);
}, o.prototype.clear = function() {
this.graphics.clear();
}, o.prototype.setRgbColor = function(t, e) {
e.r = t >>> 16 & 255, e.g = t >>> 8 & 255, e.b = 255 & t;
}, Object.defineProperty(o.prototype, "strokeColor", {
get: function() {
return Number(this._strokeColor.toHEX("#rrggbb").substring(1));
},
set: function(t) {
this.setRgbColor(t, this._strokeColor), this._strokeColor.a = this.graphics.strokeColor.a, 
this.graphics.strokeColor = this._strokeColor;
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(o.prototype, "strokeAlpha", {
get: function() {
return this._strokeColor.a / 255;
},
set: function(t) {
this._strokeColor.a = Math.floor(255 * t), this.graphics.strokeColor = this._strokeColor;
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(o.prototype, "strokeWidth", {
get: function() {
return this.graphics.lineWidth;
},
set: function(t) {
this.graphics.lineWidth = t;
},
enumerable: !1,
configurable: !0
}), o.prototype.setFillColor = function(t) {
this.setRgbColor(t, this._fillColor), this._fillColor.a = this.graphics.fillColor.a, 
this.graphics.fillColor = this._fillColor;
}, o.prototype.setFillAlpha = function(t) {
this.graphics.fillColor.a = Math.floor(255 * t);
}, o.prototype.setStrokeColor = function(t) {
this.strokeColor = t;
}, o.prototype.setStrokeAlpha = function(t) {
this.strokeAlpha = t;
}, o.prototype.setStrokeWidth = function(t) {
this.strokeWidth = t;
}, o.prototype.setLineJoin = function(e) {
e === t.GraphicsLineJoin.Bevel ? this.graphics.lineJoin = cc.Graphics.LineJoin.BEVEL : e === t.GraphicsLineJoin.Round ? this.graphics.lineJoin = cc.Graphics.LineJoin.ROUND : this.graphics.lineJoin = cc.Graphics.LineJoin.MITER;
}, o.prototype.setLineCap = function(e) {
e === t.GraphicsLineCap.Round ? this.graphics.lineCap = cc.Graphics.LineCap.ROUND : e === t.GraphicsLineCap.Square ? this.graphics.lineCap = cc.Graphics.LineCap.SQUARE : this.graphics.lineCap = cc.Graphics.LineCap.BUTT;
}, o;
}(function() {
function e() {}
return e.prototype.execute = function(e) {
if (e && 0 !== e.length) for (var n = 0, o = e.length; n < o; n++) {
var r = e[n];
switch (r[0]) {
case t.GraphicsCmd.MoveTo:
this.moveTo(r[1], r[2]);
break;

case t.GraphicsCmd.LineTo:
this.lineTo(r[1], r[2]);
break;

case t.GraphicsCmd.Rect:
this.rect(r[1], r[2], r[3], r[4]);
break;

case t.GraphicsCmd.Circle:
this.circle(r[1], r[2], r[3]);
break;

case t.GraphicsCmd.RoundRect:
this.roundRect(r[1], r[2], r[3], r[4], r[5]);
break;

case t.GraphicsCmd.Ellipse:
this.ellipse(r[1], r[2], r[3], r[4]);
break;

case t.GraphicsCmd.Arc:
this.arc(r[1], r[2], r[3], r[4], r[5], Boolean(r[6]));
break;

case t.GraphicsCmd.BezierCurveTo:
this.bezierCurveTo(r[1], r[2], r[3], r[4], r[5], r[6]);
break;

case t.GraphicsCmd.QuadraticCurveTo:
this.quadraticCurveTo(r[1], r[2], r[3], r[4]);
break;

case t.GraphicsCmd.Close:
this.close();
break;

case t.GraphicsCmd.Fill:
this.fill();
break;

case t.GraphicsCmd.Stroke:
this.stroke();
break;

case t.GraphicsCmd.Clear:
this.clear();
break;

case t.GraphicsCmd.FillColor:
this.setFillColor(r[1]);
break;

case t.GraphicsCmd.FillAlpha:
this.setFillAlpha(r[1]);
break;

case t.GraphicsCmd.StrokeColor:
this.setStrokeColor(r[1]);
break;

case t.GraphicsCmd.StrokeAlpha:
this.setStrokeAlpha(r[1]);
break;

case t.GraphicsCmd.StrokeWidth:
this.setStrokeWidth(r[1]);
break;

case t.GraphicsCmd.LineJoin:
this.setLineJoin(r[1]);
break;

case t.GraphicsCmd.LineCap:
this.setLineCap(r[1]);
}
}
}, e;
}()), bo = function(t) {
function e(e) {
var n = t.call(this, e) || this;
return n.autoClear = !0, n.nativeRenderer = n.nativeNode.getComponent(cc.Graphics) || n.nativeNode.addComponent(cc.Graphics), 
n.driver = new To(n.nativeRenderer), n;
}
return n(e, t), e.prototype.setAutoClear = function(t) {
this.autoClear = t;
}, e.prototype.draw = function(t) {
this.autoClear && this.nativeRenderer.clear(), this.driver.execute(t);
}, e.prototype.setMaterialProperty = function(e, n) {
t.prototype.setMaterialProperty.call(this, e, n), this.nativeRenderer.markForRender(!0);
}, e;
}(lo), wo = cc._decorator.ccclass, Fo = cc.Graphics.LineJoin, Eo = cc.Graphics.LineCap, No = Math.PI, xo = Math.max, Io = Math.ceil, Do = Math.acos, Mo = cc.Enum({
PT_CORNER: 1,
PT_LEFT: 2,
PT_BEVEL: 4,
PT_INNERBEVEL: 8
}), Po = cc.gfx, Wo = new Po.VertexFormat([ {
name: Po.ATTR_POSITION,
type: Po.ATTR_TYPE_FLOAT32,
num: 2
}, {
name: Po.ATTR_COLOR,
type: Po.ATTR_TYPE_UINT8,
num: 4,
normalize: !0
}, {
name: "a_dist",
type: Po.ATTR_TYPE_FLOAT32,
num: 1
}, {
name: "a_lines",
type: Po.ATTR_TYPE_FLOAT32,
num: 1
} ]);
Wo.name = "vfmtPosColorSdfLines";
var Oo = {
getConstructor: function() {
return function(t) {
function e(e) {
var n = t.call(this, e) || this;
return n.lines = 0, n;
}
return n(e, t), e.prototype.getVfmt = function() {
return Wo;
}, e.prototype.getVfmtFloatCount = function() {
return 5;
}, e.prototype._expandStroke = function(t) {
var e, n, o, r, i = .5 * t.lineWidth, a = t.lineCap, s = t.lineJoin, u = t.miterLimit, l = t._impl, c = (e = i, 
n = No, o = l._tessTol, r = 2 * Do(e / (e + o)), xo(2, Io(n / r)));
this._calculateJoins(l, i, s, u);
for (var d = l._paths, h = 0, p = l._pathOffset, f = l._pathLength; p < f; p++) {
var m = (A = d[p]).points.length;
s === Fo.ROUND ? h += 2 * (m + A.nbevel * (c + 2) + 1) : h += 2 * (m + 5 * A.nbevel + 1), 
A.closed || (a === Eo.ROUND ? h += 2 * (2 * c + 2) : h += 12);
}
var y = this.genBuffer(t, h), v = y.meshbuffer, _ = v._vData, g = v._iData;
for (p = l._pathOffset, f = l._pathLength; p < f; p++) {
var A, C = (A = d[p]).points, R = (m = C.length, y.vertexStart), S = void 0, T = void 0, b = void 0, w = void 0, F = A.closed;
if (F ? (S = C[m - 1], T = C[0], b = 0, w = m) : (S = C[0], T = C[1], b = 1, w = m - 1), 
T = T || S, this.lines = 0, !F) {
(M = T.sub(S)).normalizeSelf();
var E = M.x, N = M.y;
a === Eo.BUTT ? this._buttCapStart(S, E, N, i, 0) : a === Eo.SQUARE ? this._buttCapStart(S, E, N, i, i) : a === Eo.ROUND && this._roundCapStart(S, E, N, i, c);
}
this.lines += T.sub(S).mag();
for (var x = b; x < w; ++x) s === Fo.ROUND ? this._roundJoin(S, T, i, i, c) : 0 != (T.flags & (Mo.PT_BEVEL | Mo.PT_INNERBEVEL)) ? this._bevelJoin(S, T, i, i) : (this._vset(T.x + T.dmx * i, T.y + T.dmy * i, 1), 
this._vset(T.x - T.dmx * i, T.y - T.dmy * i, -1)), S = T, T = C[x + 1], this.lines += T.sub(S).mag();
if (F) {
var I = this.getVfmtFloatCount(), D = R * I;
this._vset(_[D], _[D + 1], 1), this._vset(_[D + I], _[D + I + 1], -1);
} else {
var M;
(M = T.sub(S)).normalizeSelf(), E = M.x, N = M.y, a === Eo.BUTT ? this._buttCapEnd(T, E, N, i, 0) : a === Eo.SQUARE ? this._buttCapEnd(T, E, N, i, i) : a === Eo.ROUND && this._roundCapEnd(T, E, N, i, c);
}
for (var P = y.indiceStart, W = R + 2, O = y.vertexStart; W < O; W++) g[P++] = W - 2, 
g[P++] = W - 1, g[P++] = W;
y.indiceStart = P;
}
}, e.prototype._vset = function(t, e, n) {
void 0 === n && (n = 0);
var o = this._buffer, r = o.meshbuffer, i = o.vertexStart * this.getVfmtFloatCount(), a = r._vData, s = r._uintVData;
a[i] = t, a[i + 1] = e, s[i + 2] = this._curColor, a[i + 3] = n, a[i + 4] = this.lines, 
o.vertexStart++, r._dirty = !0;
}, e;
}(cc.Graphics.__assembler__);
}
}, Lo = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), i([ wo ], e);
}(cc.Graphics);
cc.Assembler.register(Lo, Oo);
var Bo, Go = function(t) {
function e(e) {
var n = t.call(this, e) || this;
return n.nativeRenderer = n.nativeNode.getComponent(Lo) || n.nativeNode.addComponent(Lo), 
n.driver = new To(n.nativeRenderer), n;
}
return n(e, t), e;
}(bo);
t.MaskType = void 0, (Bo = t.MaskType || (t.MaskType = {})).Rect = "Rect", Bo.Ellipse = "Ellipse", 
Bo.Image = "Image", Bo.Graphics = "Graphics";
var ko, Vo, jo, Ho = {
type: function(t, e) {
return t.setMaskType(e);
},
inverted: function(t, e) {
return t.setMaskInverted(e);
},
maskImage: function(t, e) {
return t.setMaskImage(e);
},
maskTexture: function(t, e) {
return t.setMaskTexture(e);
},
alphaThreshold: function(t, e) {
return t.setMaskAlphaThreshold(e);
},
maskGraphics: function(t, e) {
return t.setMaskGraphics(e);
},
enabled: function(t, e) {
return t.setMaskEnabled(e);
}
};
function zo(e) {
switch (e) {
case t.PixelFormat.RGBA8888:
return 4;

case t.PixelFormat.RGB888:
return 3;

case t.PixelFormat.RGB565:
case t.PixelFormat.RGBA4444:
case t.PixelFormat.AI88:
return 2;

case t.PixelFormat.A8:
case t.PixelFormat.I8:
return 1;

default:
return 4;
}
}
t.PixelFormat = void 0, (ko = t.PixelFormat || (t.PixelFormat = {}))[ko.RGBA8888 = 0] = "RGBA8888", 
ko[ko.RGB888 = 1] = "RGB888", ko[ko.RGB565 = 2] = "RGB565", ko[ko.RGBA4444 = 3] = "RGBA4444", 
ko[ko.A8 = 4] = "A8", ko[ko.I8 = 5] = "I8", ko[ko.AI88 = 6] = "AI88", t.TextureFilter = void 0, 
(Vo = t.TextureFilter || (t.TextureFilter = {}))[Vo.Nearest = 0] = "Nearest", Vo[Vo.Linear = 1] = "Linear", 
t.TextureWrapMode = void 0, (jo = t.TextureWrapMode || (t.TextureWrapMode = {}))[jo.Repeat = 0] = "Repeat", 
jo[jo.ClampToEdge = 1] = "ClampToEdge", jo[jo.MirroredRepeat = 2] = "MirroredRepeat";
var Uo, Yo, qo = {
texWidth: function(t, e) {
return t.setTexWidth(e);
},
texHeight: function(t, e) {
return t.setTexHeight(e);
},
format: function(t, e) {
return t.setFormat(e);
},
filterMin: function(t, e) {
return t.setFilterMin(e);
},
filterMag: function(t, e) {
return t.setFilterMag(e);
},
wrapS: function(t, e) {
return t.setWrapS(e);
},
wrapT: function(t, e) {
return t.setWrapT(e);
},
pixels: function(t, e) {
return t.setPixels(e);
}
};
function Xo(e) {
switch (e) {
case t.BlendFactor.One:
return cc.macro.BlendFactor.ONE;

case t.BlendFactor.Zero:
return cc.macro.BlendFactor.ZERO;

case t.BlendFactor.SrcAlpha:
return cc.macro.BlendFactor.SRC_ALPHA;

case t.BlendFactor.SrcColor:
return cc.macro.BlendFactor.SRC_COLOR;

case t.BlendFactor.DstAlpha:
return cc.macro.BlendFactor.DST_ALPHA;

case t.BlendFactor.DstColor:
return cc.macro.BlendFactor.DST_COLOR;

case t.BlendFactor.OneMinusSrcAlpha:
return cc.macro.BlendFactor.ONE_MINUS_SRC_ALPHA;

case t.BlendFactor.OneMinusSrcColor:
return cc.macro.BlendFactor.ONE_MINUS_SRC_COLOR;

case t.BlendFactor.OneMinusDstAlpha:
return cc.macro.BlendFactor.ONE_MINUS_DST_ALPHA;

case t.BlendFactor.OneMinusDstColor:
return cc.macro.BlendFactor.ONE_MINUS_DST_COLOR;

default:
return cc.macro.BlendFactor.SRC_ALPHA;
}
}
function Qo(e) {
switch (e) {
case t.PixelFormat.RGBA8888:
return cc.Texture2D.PixelFormat.RGBA8888;

case t.PixelFormat.RGB888:
return cc.Texture2D.PixelFormat.RGB888;

case t.PixelFormat.RGB565:
return cc.Texture2D.PixelFormat.RGB565;

case t.PixelFormat.RGBA4444:
return cc.Texture2D.PixelFormat.RGBA4444;

case t.PixelFormat.A8:
return cc.Texture2D.PixelFormat.A8;

case t.PixelFormat.I8:
return cc.Texture2D.PixelFormat.I8;

case t.PixelFormat.AI88:
return cc.Texture2D.PixelFormat.AI88;

default:
return cc.Texture2D.PixelFormat.RGBA8888;
}
}
function Jo(e) {
switch (e) {
case t.TextureFilter.Nearest:
return cc.Texture2D.Filter.NEAREST;

case t.TextureFilter.Linear:
default:
return cc.Texture2D.Filter.LINEAR;
}
}
function Zo(e) {
switch (e) {
case t.TextureWrapMode.Repeat:
return cc.Texture2D.WrapMode.REPEAT;

case t.TextureWrapMode.ClampToEdge:
return cc.Texture2D.WrapMode.CLAMP_TO_EDGE;

case t.TextureWrapMode.MirroredRepeat:
return cc.Texture2D.WrapMode.MIRRORED_REPEAT;

default:
return cc.Texture2D.WrapMode.CLAMP_TO_EDGE;
}
}
t.BlendFactor = void 0, (Uo = t.BlendFactor || (t.BlendFactor = {}))[Uo.One = 0] = "One", 
Uo[Uo.Zero = 1] = "Zero", Uo[Uo.SrcAlpha = 2] = "SrcAlpha", Uo[Uo.SrcColor = 3] = "SrcColor", 
Uo[Uo.DstAlpha = 4] = "DstAlpha", Uo[Uo.DstColor = 5] = "DstColor", Uo[Uo.OneMinusSrcAlpha = 6] = "OneMinusSrcAlpha", 
Uo[Uo.OneMinusSrcColor = 7] = "OneMinusSrcColor", Uo[Uo.OneMinusDstAlpha = 8] = "OneMinusDstAlpha", 
Uo[Uo.OneMinusDstColor = 9] = "OneMinusDstColor";
var Ko, $o = ((Yo = {})[t.MaskType.Rect] = cc.Mask.Type.RECT, Yo[t.MaskType.Ellipse] = cc.Mask.Type.ELLIPSE, 
Yo[t.MaskType.Image] = cc.Mask.Type.IMAGE_STENCIL, Yo[t.MaskType.Graphics] = void 0, 
Yo), tr = function(e) {
function o(t) {
var n = e.call(this, t) || this;
return n.nativeRenderer = n.nativeNode.getComponent(cc.Mask) || n.nativeNode.addComponent(cc.Mask), 
n;
}
return n(o, e), o.prototype.setMaskType = function(e) {
var n = this;
this.nativeRenderer.enabledInHierarchy || !cc.isValid(this.nativeRenderer) ? this.nativeRenderer.type !== $o[e] && (this.nativeRenderer.type = $o[e], 
e === t.MaskType.Image && (this._maskImageUrl ? this._loadMaskImage(this._maskImageUrl) : this._pendingTextureData && this._applyTextureData(this._pendingTextureData))) : this.nativeRenderer.scheduleOnce(function() {
return n.setMaskType(e);
});
}, o.prototype.setMaskInverted = function(t) {
this.nativeRenderer.inverted = t;
}, o.prototype.setMaskImage = function(t) {
if (!t) return this._pendingTextureData = void 0, this._clearDynamicTexture(), this.nativeRenderer.spriteFrame = void 0, 
void (this._maskImageUrl = void 0);
this._maskImageUrl !== t && (this._maskImageUrl = t, this._pendingTextureData = void 0, 
this._clearDynamicTexture(), this.nativeRenderer.type === cc.Mask.Type.IMAGE_STENCIL && this._loadMaskImage(t));
}, o.prototype._loadMaskImage = function(e) {
var n = this;
this.loadAsset("maskSprite", e, t.LoaderAssetType.SpriteFrame, function(t) {
n._maskImageUrl === e && (n.nativeRenderer.spriteFrame = t);
});
}, o.prototype.setMaskTexture = function(t) {
if (!t) return this._maskImageUrl = void 0, this._pendingTextureData = void 0, this._clearDynamicTexture(), 
void (this.nativeRenderer.spriteFrame = void 0);
this._maskImageUrl = void 0, this._pendingTextureData = t, this.nativeRenderer.type === cc.Mask.Type.IMAGE_STENCIL && this._applyTextureData(t);
}, o.prototype._applyTextureData = function(e) {
var n, o, r = null !== (n = e.format) && void 0 !== n ? n : t.PixelFormat.RGBA8888;
if (!e.pixels || !e.pixels.length || e.width <= 0 || e.height <= 0) this._rejectTextureDataApply(); else {
var i = e.width * e.height * zo(r);
if (e.pixels.length !== i) return "[CocosMaskNode] pixels 大小不匹配: 期望 ".concat(i, " 字节 "), 
"(".concat(e.width, "x").concat(e.height, ", ").concat(t.PixelFormat[r], "), 实际 ").concat(e.pixels.length, " 字节"), 
void this._rejectTextureDataApply();
var a = Qo(r), s = Jo(null !== (o = e.filter) && void 0 !== o ? o : t.TextureFilter.Linear);
if (this._dynamicTex) this._dynamicTex.initWithData(e.pixels, a, e.width, e.height), 
this._dynamicTex.setFilters(s, s), this._dynamicSpriteFrame.setTexture(this._dynamicTex), 
this.nativeRenderer.spriteFrame = this._dynamicSpriteFrame; else {
var u = new cc.Texture2D();
u.initWithData(e.pixels, a, e.width, e.height), u.packable = !1, u.setFilters(s, s), 
this._dynamicTex = u, this._dynamicSpriteFrame = new cc.SpriteFrame(u), this.nativeRenderer.spriteFrame = this._dynamicSpriteFrame;
}
}
}, o.prototype._clearDynamicTexture = function() {
this._dynamicTex && (this._dynamicSpriteFrame && (this.nativeRenderer.spriteFrame === this._dynamicSpriteFrame && (this.nativeRenderer.spriteFrame = void 0), 
this._dynamicSpriteFrame = void 0), this._dynamicTex.destroy(), this._dynamicTex = void 0);
}, o.prototype._rejectTextureDataApply = function() {
this._pendingTextureData = void 0, this._clearDynamicTexture(), this.nativeRenderer.spriteFrame = void 0;
}, o.prototype.setMaskAlphaThreshold = function(t) {
this.nativeRenderer.alphaThreshold = t;
}, o.prototype.setMaskGraphics = function(t) {
var e = this, n = this.nativeRenderer._graphics;
if (n) {
this._driver || (this._driver = new To(n));
var o = function() {
e.nativeRenderer.enabledInHierarchy && (e._driver.execute(t), e.nativeRenderer.setVertsDirty());
};
this.nativeRenderer._updateGraphics = o, o();
} else this.nativeRenderer.scheduleOnce(function() {
return e.setMaskGraphics(t);
});
}, o.prototype.setMaskEnabled = function(t) {
this.nativeRenderer.enabled = t;
}, o.prototype.disposeRender = function() {
cc.isValid(this.nativeRenderer) && this.nativeRenderer.unscheduleAllCallbacks(), 
this._pendingTextureData = void 0, this._clearDynamicTexture(), this._driver = void 0, 
e.prototype.disposeRender.call(this);
}, o.prototype.destroyNative = function() {
cc.isValid(this.nativeRenderer) && (this.nativeRenderer._spriteFrame = void 0), 
this._pendingTextureData = void 0, this._clearDynamicTexture(), e.prototype.destroyNative.call(this);
}, o;
}(lo);
t.ScrollControl = void 0, (Ko = t.ScrollControl || (t.ScrollControl = {}))[Ko.Normal = 0] = "Normal", 
Ko[Ko.Refresh = 1] = "Refresh";
var er, nr, or, rr = {
horizontal: function(t, e) {
return t.setScrollViewHorizontal(e);
},
vertical: function(t, e) {
return t.setScrollViewVertical(e);
},
inertia: function(t, e) {
return t.setScrollViewInertia(e);
},
elastic: function(t, e) {
return t.setScrollViewElastic(e);
},
bounceDuration: function(t, e) {
return t.setScrollViewBounceDuration(e);
},
brake: function(t, e) {
return t.setScrollViewBrake(e);
},
content: {
name: function(t, e) {
return t.setScrollViewContentName(e);
},
x: function(t, e) {
return t.setScrollViewContentX(e);
},
y: function(t, e) {
return t.setScrollViewContentY(e);
},
itemCount: function(t, e) {
return t.setItemCount(e);
},
itemHeight: function(t, e) {
return t.setItemHeight(e);
},
bufferSize: function(t, e) {
return t.setBufferSize(e);
},
itemRender: function(t, e) {
return t.setOnItemRender(e);
},
scrollCtrl: function(t, e) {
return t.setScrollCtrl(e);
},
scrollTarget: function(t, e) {
e >= 0 && t.scrollToIndex(e);
}
}
}, ir = {
scrollBegan: function(t, e) {
return t.setOnScrollBegan(e);
},
scrollEnded: function(t, e) {
return t.setOnScrollEnded(e);
},
scrolling: function(t, e) {
return t.setOnScrolling(e);
}
};
t.RenderType = void 0, (er = t.RenderType || (t.RenderType = {}))[er.Simple = 0] = "Simple", 
er[er.Sliced = 1] = "Sliced", er[er.Tiled = 2] = "Tiled", er[er.Filled = 3] = "Filled", 
er[er.Mesh = 4] = "Mesh", t.SpriteFillType = void 0, (nr = t.SpriteFillType || (t.SpriteFillType = {}))[nr.Horizontal = 0] = "Horizontal", 
nr[nr.Vertical = 1] = "Vertical", nr[nr.Radial = 2] = "Radial", t.SizeMode = void 0, 
(or = t.SizeMode || (t.SizeMode = {}))[or.Custom = 0] = "Custom", or[or.Trimmed = 1] = "Trimmed", 
or[or.Raw = 2] = "Raw";
var ar, sr, ur, lr = {
img: function(t, e) {
return t.setImage(e);
},
atlas: function(t, e) {
return t.setAtlas(e);
},
frameName: function(t, e) {
return t.setFrameName(e);
},
defaultImg: function(t, e) {
return t.setDefaultImage(e);
},
renderType: function(t, e) {
return t.setRenderType(e);
},
sizeMode: function(t, e) {
return t.setSizeMode(e);
},
dstBlendFactor: function(t, e) {
return t.setDstBlendFactor(e);
},
srcBlendFactor: function(t, e) {
return t.setSrcBlendFactor(e);
},
trim: function(t, e) {
return t.setTrim(e);
},
fillType: function(t, e) {
return t.setFillType(e);
},
fillCenterX: function(t, e) {
return t.setFillCenterX(e);
},
fillCenterY: function(t, e) {
return t.setFillCenterY(e);
},
fillStart: function(t, e) {
return t.setFillStart(e);
},
fillRange: function(t, e) {
return t.setFillRange(e);
},
hideUntilLoaded: function(t, e) {
return t.setHideUntilLoaded(e);
}
}, cr = {
fadeTime: function(t, e) {
return t.setFadeTime(e);
},
minSeg: function(t, e) {
return t.setMinSeg(e);
},
stroke: function(t, e) {
return t.setStroke(e);
},
texture: function(t, e) {
return t.setTexture(e);
},
streakColor: function(t, e) {
return t.setStreakColor(e);
},
fastMode: function(t, e) {
return t.setFastMode(e);
},
srcBlendFactor: function(t, e) {
return t.setSrcBlendFactor(e);
},
dstBlendFactor: function(t, e) {
return t.setDstBlendFactor(e);
}
};
t.ParticlePositionType = void 0, (ar = t.ParticlePositionType || (t.ParticlePositionType = {}))[ar.Free = 0] = "Free", 
ar[ar.Relative = 1] = "Relative", ar[ar.Grouped = 2] = "Grouped", t.ParticleEmitterMode = void 0, 
(sr = t.ParticleEmitterMode || (t.ParticleEmitterMode = {}))[sr.Gravity = 0] = "Gravity", 
sr[sr.Radius = 1] = "Radius", t.ParticleControl = void 0, (ur = t.ParticleControl || (t.ParticleControl = {}))[ur.Normal = 0] = "Normal", 
ur[ur.Stop = 1] = "Stop", ur[ur.Reset = 2] = "Reset";
var dr, hr, pr, fr = {
file: function(t, e) {
return t.setFile(e);
},
particleImg: function(t, e) {
return t.setParticleAsset(e);
},
duration: function(t, e) {
return t.setDuration(e);
},
emissionRate: function(t, e) {
return t.setEmissionRate(e);
},
life: function(t, e) {
return t.setLife(e);
},
totalParticles: function(t, e) {
return t.setTotalParticles(e);
},
startRgb: function(t, e) {
return t.setStartRgb(e);
},
startAlpha: function(t, e) {
return t.setStartAlpha(e);
},
startRgbVar: function(t, e) {
return t.setStartRgbVar(e);
},
startAlphaVar: function(t, e) {
return t.setStartAlphaVar(e);
},
endRgb: function(t, e) {
return t.setEndRgb(e);
},
endAlpha: function(t, e) {
return t.setEndAlpha(e);
},
endRgbVar: function(t, e) {
return t.setEndRgbVar(e);
},
endAlphaVar: function(t, e) {
return t.setEndAlphaVar(e);
},
particleAngle: function(t, e) {
return t.setParticleAngle(e);
},
startSize: function(t, e) {
return t.setStartSize(e);
},
endSize: function(t, e) {
return t.setEndSize(e);
},
startSpin: function(t, e) {
return t.setStartSpin(e);
},
endSpin: function(t, e) {
return t.setEndSpin(e);
},
posVar: function(t, e) {
return t.setPosVar(e.x, e.y);
},
positionType: function(t, e) {
return t.setPositionType(e);
},
emitterMode: function(t, e) {
return t.setEmitterMode(e);
},
gravity: function(t, e) {
return t.setGravity(e.x, e.y);
},
speed: function(t, e) {
return t.setSpeed(e);
},
tangentialAccel: function(t, e) {
return t.setTangentialAccel(e);
},
radialAccel: function(t, e) {
return t.setRadialAccel(e);
},
rotationIsDir: function(t, e) {
return t.setRotationIsDir(e);
},
startRadius: function(t, e) {
return t.setStartRadius(e);
},
endRadius: function(t, e) {
return t.setEndRadius(e);
},
rotatePerS: function(t, e) {
return t.setRotatePerS(e);
},
srcBlendFactor: function(t, e) {
return t.setSrcBlendFactor(e);
},
dstBlendFactor: function(t, e) {
return t.setDstBlendFactor(e);
},
particleCtrl: function(t, e) {
return t.setParticleCtrl(e);
}
};
t.EditBoxInputMode = void 0, (dr = t.EditBoxInputMode || (t.EditBoxInputMode = {}))[dr.ANY = 0] = "ANY", 
dr[dr.EMAIL_ADDR = 1] = "EMAIL_ADDR", dr[dr.NUMERIC = 2] = "NUMERIC", dr[dr.PHONENUMBER = 3] = "PHONENUMBER", 
dr[dr.URL = 4] = "URL", dr[dr.DECIMAL = 5] = "DECIMAL", dr[dr.SINGLE_LINE = 6] = "SINGLE_LINE", 
t.EditBoxInputFlag = void 0, (hr = t.EditBoxInputFlag || (t.EditBoxInputFlag = {}))[hr.PASSWORD = 0] = "PASSWORD", 
hr[hr.SENSITIVE = 1] = "SENSITIVE", hr[hr.INITIAL_CAPS_WORD = 2] = "INITIAL_CAPS_WORD", 
hr[hr.INITIAL_CAPS_SENTENCE = 3] = "INITIAL_CAPS_SENTENCE", hr[hr.INITIAL_CAPS_ALL_CHARACTERS = 4] = "INITIAL_CAPS_ALL_CHARACTERS", 
hr[hr.LOWERCASE_ALL_CHARACTERS = 5] = "LOWERCASE_ALL_CHARACTERS", t.EditBoxReturnType = void 0, 
(pr = t.EditBoxReturnType || (t.EditBoxReturnType = {}))[pr.DEFAULT = 0] = "DEFAULT", 
pr[pr.DONE = 1] = "DONE", pr[pr.SEND = 2] = "SEND", pr[pr.SEARCH = 3] = "SEARCH", 
pr[pr.GO = 4] = "GO";
var mr, yr = {
text: function(t, e) {
return t.setText(e);
},
backgroundImage: function(t, e) {
return t.setBackgroundImage(e);
},
returnType: function(t, e) {
return t.setReturnType(e);
},
inputFlag: function(t, e) {
return t.setInputFlag(e);
},
inputMode: function(t, e) {
return t.setInputMode(e);
},
fontSize: function(t, e) {
return t.setFontSize(e);
},
lineHeight: function(t, e) {
return t.setLineHeight(e);
},
fontRgb: function(t, e) {
return t.setFontRgb(e);
},
fontAlpha: function(t, e) {
return t.setFontAlpha(e);
},
placeholder: function(t, e) {
return t.setPlaceholder(e);
},
placeholderFontSize: function(t, e) {
return t.setPlaceholderFontSize(e);
},
placeholderFontRgb: function(t, e) {
return t.setPlaceholderFontRgb(e);
},
placeholderFontAlpha: function(t, e) {
return t.setPlaceholderFontAlpha(e);
},
backgroundRgb: function(t, e) {
return t.setBackgroundRgb(e);
},
backgroundAlpha: function(t, e) {
return t.setBackgroundAlpha(e);
},
maxLength: function(t, e) {
return t.setMaxLength(e);
}
}, vr = {
editBegin: function(t, e) {
return t.setOnEditBegin(e);
},
editChange: function(t, e) {
return t.setOnEditChange(e);
},
editEnd: function(t, e) {
return t.setOnEditEnd(e);
}
};
t.ShadowCastingMode = void 0, (mr = t.ShadowCastingMode || (t.ShadowCastingMode = {}))[mr.Off = 0] = "Off", 
mr[mr.On = 1] = "On";
var _r, gr, Ar = {
mesh: function(t, e) {
return t.setMesh(e);
},
shadowCastingMode: function(t, e) {
return t.setShadowCastingMode(e);
},
receiveShadows: function(t, e) {
return t.setReceiveShadows(e);
}
}, Cr = {
text: function(t, e) {
return t.setText(e);
},
fontSize: function(t, e) {
return t.setFontSize(e);
},
horizontalAlign: function(t, e) {
return t.setHorizontalAlign(e);
},
maxWidth: function(t, e) {
return t.setMaxWidth(e);
},
lineHeight: function(t, e) {
return t.setLineHeight(e);
},
fontFamily: function(t, e) {
return t.setFontFamily(e);
},
font: function(t, e) {
return t.setFont(e);
},
useSystemFont: function(t, e) {
return t.setUseSystemFont(e);
},
cacheMode: function(t, e) {
return t.setCacheMode(e);
},
imageAtlas: function(t, e) {
return t.setImageAtlas(e);
},
handleTouchEvent: function(t, e) {
return t.setHandleTouchEvent(e);
}
}, Rr = {
click: function(t, e) {
return t.setOnClick(e);
}
}, Sr = o(o(o(o(o(o(o(o(o(o(o(o(o(o(o({}, qn), lr), po), mo), So), Ho), rr), so), cr), fr), yr), Ar), qo), Cr), {
event: o(o(o(o(o({}, qn.event), yo), ir), vr), Rr)
}), Tr = new Set([ "name", "event", "slots" ]);
function br(t, e, n, o) {
for (var r in e) if (!(null == o ? void 0 : o.has(r))) {
var i = e[r], a = n[r];
if ("function" == typeof a) {
var s = i;
Array.isArray(i) && i.length >= 1 && "function" == typeof i[0] && (s = i[0]()), 
a(t, s);
} else "object" == typeof a && null !== a && "object" == typeof i && null !== i && br(t, i, a);
}
}
function wr(t, e) {
var n, o, r = e(t.type);
if (t.props.name && (r.nodeName = t.props.name, r.setName(t.props.name)), br(r, t.props, Sr, Tr), 
t.children) try {
for (var i = l(t.children), a = i.next(); !a.done; a = i.next()) {
var s = a.value;
r.addChild(wr(s, e));
}
} catch (t) {
n = {
error: t
};
} finally {
try {
a && !a.done && (o = i.return) && o.call(i);
} finally {
if (n) throw n.error;
}
}
return r;
}
function Fr(t, e, n) {
return -(Math.max(t, 0) + Math.min(t - e, 0)) * n;
}
function Er(t, e) {
return Math.min(0, t - e);
}
function Nr(t, e) {
return Math.max(e, Math.min(0, t));
}
function xr(t, e) {
return t > 0 || t < e;
}
function Ir(t, e, n, o, r, i, a) {
var s = xr(t, n), u = Fr(t, n, i), l = e * Math.exp(-r * o) + u * o, c = t + l * o;
s && (t > 0 && c <= 0 ? (c = 0, l = 0) : t < n && c >= n && (c = n, l = 0));
var d = Math.abs(l) < a && !xr(c, n);
return d && (l = 0, c = Nr(c, n)), [ c, l, d ];
}
function Dr(t, e, n, o) {
return t > 0 && e > 0 || t < n && e < 0 ? e * o : e;
}
function Mr(e, n, o) {
var r = Math.abs(e), i = Math.abs(n);
return r < o && i < o ? t.ScrollDirectionLock.None : r > i ? t.ScrollDirectionLock.Horizontal : t.ScrollDirectionLock.Vertical;
}
function Pr(t, e, n, o, r) {
return n <= 0 || o <= 0 ? [ 0, -1 ] : [ Math.max(0, Math.floor(-t / n) - r), Math.min(o - 1, Math.ceil((-t + e) / n) + r) ];
}
function Wr(t, e) {
return t * e;
}
t.ScrollPhase = void 0, (_r = t.ScrollPhase || (t.ScrollPhase = {}))[_r.Idle = 0] = "Idle", 
_r[_r.Dragging = 1] = "Dragging", _r[_r.Decelerating = 2] = "Decelerating", _r[_r.Animating = 3] = "Animating", 
t.ScrollDirectionLock = void 0, (gr = t.ScrollDirectionLock || (t.ScrollDirectionLock = {}))[gr.None = 0] = "None", 
gr[gr.Horizontal = 1] = "Horizontal", gr[gr.Vertical = 2] = "Vertical";
var Or, Lr = function() {
function e(e) {
this.horizontal = !1, this.vertical = !0, this.inertia = !0, this.elastic = !0, 
this.brake = .75, this.bounceDuration = .23, this.initialContentX = 0, this.initialContentY = 0, 
this._itemCount = 0, this._itemHeight = 100, this._bufferSize = 2, this._offsetX = 0, 
this._offsetY = 0, this._velocityX = 0, this._velocityY = 0, this._phase = t.ScrollPhase.Idle, 
this._visibleStart = -1, this._visibleEnd = -1, this._lastTouchX = 0, this._lastTouchY = 0, 
this._totalDragX = 0, this._totalDragY = 0, this._directionLock = t.ScrollDirectionLock.None, 
this._slopExceeded = !1, this._lastPhase = t.ScrollPhase.Idle, this._velIndex = 0, 
this._velCount = 0, this._animStartOffset = 0, this._animTargetOffset = 0, this._animDuration = .3, 
this._animElapsed = 0, this._cachedSize = {
width: 0,
height: 0
}, this._cachedPos = {
x: 0,
y: 0
}, this._cachedDelta = {
dx: 0,
dy: 0
}, this._host = e, this._velSamples = [];
for (var n = 0; n < 5; n++) this._velSamples[n] = {
dx: 0,
dy: 0,
dt: 0
};
}
return Object.defineProperty(e.prototype, "itemCount", {
get: function() {
return this._itemCount;
},
set: function(t) {
this._itemCount = t, this._invalidateVisible();
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(e.prototype, "itemHeight", {
get: function() {
return this._itemHeight;
},
set: function(t) {
this._itemHeight = t, this._invalidateVisible();
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(e.prototype, "bufferSize", {
get: function() {
return this._bufferSize;
},
set: function(t) {
this._bufferSize = t, this._invalidateVisible();
},
enumerable: !1,
configurable: !0
}), e.prototype._invalidateVisible = function() {
this._visibleStart = -1, this._visibleEnd = -1;
}, Object.defineProperty(e.prototype, "offsetX", {
get: function() {
return this._offsetX;
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(e.prototype, "offsetY", {
get: function() {
return this._offsetY;
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(e.prototype, "velocityX", {
get: function() {
return this._velocityX;
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(e.prototype, "velocityY", {
get: function() {
return this._velocityY;
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(e.prototype, "phase", {
get: function() {
return this._phase;
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(e.prototype, "isVirtualMode", {
get: function() {
return this.itemCount > 0;
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(e.prototype, "visibleStart", {
get: function() {
return this._visibleStart;
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(e.prototype, "visibleEnd", {
get: function() {
return this._visibleEnd;
},
enumerable: !1,
configurable: !0
}), e.prototype.invalidateVisibleRange = function() {
this._invalidateVisible();
}, e.prototype.resetScrollState = function() {
this._offsetX = 0, this._offsetY = 0, this._velocityX = 0, this._velocityY = 0, 
this._phase = t.ScrollPhase.Idle;
}, e.prototype.syncOffsetFromContentPosition = function(t, e) {
this._offsetX = t - this.initialContentX, this._offsetY = this.initialContentY - e, 
this._velocityX = 0, this._velocityY = 0;
}, e.prototype.getContentSize = function() {
var t = this._cachedSize;
if (this.isVirtualMode) {
var e = Wr(this.itemCount, this.itemHeight);
this.horizontal ? (t.width = e, t.height = this._host.getViewportHeight()) : (t.width = this._host.getViewportWidth(), 
t.height = e);
} else {
var n = this._host.getNonVirtualContentSize();
t.width = n.width, t.height = n.height;
}
return t;
}, e.prototype.getContentPosition = function() {
var t = this._cachedPos;
return t.x = this.initialContentX + this._offsetX, t.y = this.initialContentY - this._offsetY, 
t;
}, e.prototype.onDragStart = function(e, n) {
this._phase = t.ScrollPhase.Dragging, this._velocityX = 0, this._velocityY = 0, 
this._lastTouchX = e, this._lastTouchY = n, this._totalDragX = 0, this._totalDragY = 0, 
this._directionLock = t.ScrollDirectionLock.None, this._slopExceeded = !1, this._velIndex = 0, 
this._velCount = 0;
}, e.prototype.onDragMove = function(e, n, o) {
var r = e - this._lastTouchX, i = -(n - this._lastTouchY);
if (this._totalDragX += r, this._totalDragY += i, !this._slopExceeded) {
if (Math.abs(this._totalDragX) + Math.abs(this._totalDragY) < 7) {
this._lastTouchX = e, this._lastTouchY = n;
var a = this._cachedDelta;
return a.dx = 0, a.dy = 0, a;
}
this._slopExceeded = !0;
}
this._directionLock === t.ScrollDirectionLock.None && (this._directionLock = Mr(this._totalDragX, this._totalDragY, 5)), 
this._directionLock === t.ScrollDirectionLock.Horizontal && (i = 0), this._directionLock === t.ScrollDirectionLock.Vertical && (r = 0), 
this.horizontal || (r = 0), this.vertical || (i = 0);
var s = this.getContentSize(), u = Er(this._host.getViewportWidth(), s.width), l = Er(this._host.getViewportHeight(), s.height);
if (this.elastic ? (r = Dr(this._offsetX, r, u, .5), i = Dr(this._offsetY, i, l, .5)) : (r = Nr(this._offsetX + r, u) - this._offsetX, 
i = Nr(this._offsetY + i, l) - this._offsetY), this._offsetX += r, this._offsetY += i, 
this.inertia) {
var c = this._velSamples[this._velIndex];
c.dx = r, c.dy = i, c.dt = o, this._velIndex = (this._velIndex + 1) % 5, this._velCount < 5 && this._velCount++;
}
this._lastTouchX = e, this._lastTouchY = n;
var d = this._cachedDelta;
return d.dx = r, d.dy = i, d;
}, e.prototype.onDragEnd = function() {
this._computeAverageVelocity();
var e = this.getContentSize(), n = Er(this._host.getViewportWidth(), e.width), o = Er(this._host.getViewportHeight(), e.height), r = xr(this._offsetX, n), i = xr(this._offsetY, o), a = Math.abs(this._velocityX) > .5 || Math.abs(this._velocityY) > .5;
return (r || i) && this.elastic || a && this.inertia ? this._phase = t.ScrollPhase.Decelerating : this._phase = t.ScrollPhase.Idle, 
this._phase;
}, e.prototype.onFrameUpdate = function(e) {
e = Math.min(e, .1), this._phase === t.ScrollPhase.Decelerating ? this._updatePhysics(e) : this._phase === t.ScrollPhase.Animating && this._updateAnimation(e);
var n = this._lastPhase !== t.ScrollPhase.Idle && this._phase === t.ScrollPhase.Idle;
return this._lastPhase = this._phase, n;
}, e.prototype.scrollToIndex = function(e, n) {
if (this.isVirtualMode) {
var o = -e * this.itemHeight, r = this.getContentSize(), i = Nr(o, this.horizontal ? Er(this._host.getViewportWidth(), r.width) : Er(this._host.getViewportHeight(), r.height));
n ? (this._animStartOffset = this.horizontal ? this._offsetX : this._offsetY, this._animTargetOffset = i, 
this._animElapsed = 0, this._phase = t.ScrollPhase.Animating, this._velocityX = 0, 
this._velocityY = 0) : this.horizontal ? (this._offsetX = i, this._velocityX = 0) : (this._offsetY = i, 
this._velocityY = 0);
}
}, e.prototype.computeNewVisibleRange = function() {
if (!this.isVirtualMode) return null;
var t = this.horizontal ? this._host.getViewportWidth() : this._host.getViewportHeight(), e = c(Pr(this.horizontal ? this._offsetX : this._offsetY, t, this.itemHeight, this.itemCount, this.bufferSize), 2), n = e[0], o = e[1];
return n === this._visibleStart && o === this._visibleEnd ? null : (this._visibleStart = n, 
this._visibleEnd = o, [ n, o ]);
}, e.prototype.reset = function() {
this._offsetX = 0, this._offsetY = 0, this._velocityX = 0, this._velocityY = 0, 
this._phase = t.ScrollPhase.Idle, this._lastPhase = t.ScrollPhase.Idle, this._directionLock = t.ScrollDirectionLock.None, 
this._slopExceeded = !1, this._totalDragX = 0, this._totalDragY = 0, this._velIndex = 0, 
this._velCount = 0, this._visibleStart = -1, this._visibleEnd = -1, this.horizontal = !1, 
this.vertical = !0, this.inertia = !0, this.elastic = !0, this.brake = .75, this.bounceDuration = .23, 
this.initialContentX = 0, this.initialContentY = 0, this._itemCount = 0, this._itemHeight = 100, 
this._bufferSize = 2;
}, e.prototype._updatePhysics = function(e) {
var n = this.getContentSize(), o = Er(this._host.getViewportWidth(), n.width), r = Er(this._host.getViewportHeight(), n.height), i = 2 + 13 * this.brake, a = 15 / (this.bounceDuration * this.bounceDuration), s = !0, u = !0;
if (this.horizontal) {
var l = c(Ir(this._offsetX, this._velocityX, o, e, i, a, .5), 3), d = l[0], h = l[1], p = l[2];
this._offsetX = d, this._velocityX = h, s = p;
}
if (this.vertical) {
var f = c(Ir(this._offsetY, this._velocityY, r, e, i, a, .5), 3);
d = f[0], h = f[1], p = f[2], this._offsetY = d, this._velocityY = h, u = p;
}
s && u && (this._phase = t.ScrollPhase.Idle);
}, e.prototype._updateAnimation = function(e) {
this._animElapsed += e;
var n = Math.min(this._animElapsed / this._animDuration, 1), o = 1 - Math.pow(1 - n, 3), r = this._animStartOffset + (this._animTargetOffset - this._animStartOffset) * o;
this.horizontal ? this._offsetX = r : this._offsetY = r, n >= 1 && (this._phase = t.ScrollPhase.Idle);
}, e.prototype._computeAverageVelocity = function() {
if (0 !== this._velCount) {
for (var t = 0, e = 0, n = 0, o = 0; o < this._velCount; o++) {
var r = this._velSamples[o];
t += r.dx, e += r.dy, n += r.dt;
}
n > 0 && (this._velocityX = t / n, this._velocityY = e / n), this._velIndex = 0, 
this._velCount = 0;
}
}, e;
}(), Br = function(e) {
function o(t) {
var n = e.call(this, t) || this;
return n._contentNode = null, n._contentName = "", n._scheduled = !1, n._boundUpdate = function(t) {
return n.update(t);
}, n._cachedHostSize = {
width: 0,
height: 0
}, n._onScrollBegan = null, n._onScrollEnded = null, n._onScrolling = null, n._scrollBeganEmitted = !1, 
n._dispatchingCancel = !1, n._savedContentState = null, n._onItemRender = null, 
n._itemPool = [], n._activeItems = new Map(), n._nodeFactory = function(t) {
return n.universe.render.createRenderNode(t);
}, n._cachedScrollData = {
contentX: 0,
contentY: 0,
eid: 0,
eventType: "",
worldId: ""
}, n._driver = new Lr(n), n._bindTouchEvents(), n;
}
return n(o, e), o.prototype.getViewportWidth = function() {
return this.nativeNode.width;
}, o.prototype.getViewportHeight = function() {
return this.nativeNode.height;
}, o.prototype.getNonVirtualContentSize = function() {
var t = this._cachedHostSize;
return this._contentNode ? (t.width = this._contentNode.width, t.height = this._contentNode.height) : (t.width = 0, 
t.height = 0), t;
}, o.prototype._bindTouchEvents = function() {
var t = this.nativeNode;
t.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this, !0), t.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this, !0), 
t.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this, !0), t.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this, !0), 
t.on(cc.Node.EventType.SIZE_CHANGED, this._onViewportSizeChanged, this);
}, o.prototype._onViewportSizeChanged = function() {
this.eid && this._contentNode && this._driver.isVirtualMode && this._onItemRender && (this._driver.invalidateVisibleRange(), 
this._syncContentPosition());
}, o.prototype._onTouchStart = function(t) {
if (!this._dispatchingCancel && this.eid && (this._isReady() || (this._findContentNode(), 
this._isReady()))) {
var e = t.getLocation();
this._driver.onDragStart(e.x, e.y), this._scrollBeganEmitted = !1, this._ensureScheduled();
}
}, o.prototype._onTouchMove = function(e) {
if (!this._dispatchingCancel && this._driver.phase === t.ScrollPhase.Dragging && this._isReady()) {
var n = e.getLocation(), o = cc.director.getDeltaTime() || 1 / 60, r = this._driver.onDragMove(n.x, n.y, o), i = r.dx, a = r.dy, s = 0 !== i || 0 !== a;
s && !this._scrollBeganEmitted && (this._scrollBeganEmitted = !0, this._emitScrollEvent("scroll-began", this._onScrollBegan), 
this._cancelChildTouch(e)), s && (this._syncContentPosition(), this._emitScrollEvent("scrolling", this._onScrolling), 
e.stopPropagation());
}
}, o.prototype._onTouchEnd = function(e) {
this._dispatchingCancel || this._driver.phase === t.ScrollPhase.Dragging && this._isReady() && (this._driver.onDragEnd() === t.ScrollPhase.Idle ? (this._scrollBeganEmitted && (this._emitScrollEvent("scroll-ended", this._onScrollEnded), 
e.stopPropagation()), this._unschedule()) : e.stopPropagation());
}, o.prototype._cancelChildTouch = function(t) {
var e = t.target;
if (e && e !== this.nativeNode && cc.isValid(e)) {
var n = new cc.Event.EventTouch(t.getTouches(), !0);
n.type = cc.Node.EventType.TOUCH_CANCEL, n.touch = t.touch, this._dispatchingCancel = !0;
try {
e.dispatchEvent(n);
} finally {
this._dispatchingCancel = !1;
}
}
}, o.prototype._ensureScheduled = function() {
this._scheduled || (cc.director.getScheduler().schedule(this._boundUpdate, this.nativeNode, 0, cc.macro.REPEAT_FOREVER, 0, !1), 
this._scheduled = !0);
}, o.prototype._unschedule = function() {
this._scheduled && (cc.director.getScheduler().unschedule(this._boundUpdate, this.nativeNode), 
this._scheduled = !1);
}, o.prototype.update = function(e) {
if (this.eid) {
!this._contentNode && this._contentName && this._findContentNode();
var n = this._driver.phase, o = n === t.ScrollPhase.Decelerating || n === t.ScrollPhase.Animating, r = this._driver.onFrameUpdate(e);
o && (this._syncContentPosition(), this._emitScrollEvent("scrolling", this._onScrolling)), 
r && (this._emitScrollEvent("scroll-ended", this._onScrollEnded), this._unschedule());
} else this._unschedule();
}, o.prototype._isReady = function() {
return !(!this._contentNode || this._driver.isVirtualMode && null === this._onItemRender);
}, o.prototype._findContentNode = function() {
var t;
if (this._contentName && !this._contentNode) for (var e = this.nativeNode.children, n = 0; n < e.length; n++) {
var o = e[n], r = o._cocosNodeRef;
if ((null !== (t = null == r ? void 0 : r.nodeName) && void 0 !== t ? t : o.name) === this._contentName) {
this._contentNode = o, this._activateContentNode();
break;
}
}
}, o.prototype._applyVirtualLayout = function() {
this._contentNode && (this._savedContentState || (this._savedContentState = {
anchorX: this._contentNode.anchorX,
anchorY: this._contentNode.anchorY,
width: this._contentNode.width,
height: this._contentNode.height
}), this._driver.horizontal ? (this._contentNode.anchorX = 0, this._contentNode.anchorY = .5) : (this._contentNode.anchorX = .5, 
this._contentNode.anchorY = 1));
}, o.prototype._restoreContentState = function() {
this._contentNode && this._savedContentState && (this._contentNode.anchorX = this._savedContentState.anchorX, 
this._contentNode.anchorY = this._savedContentState.anchorY, this._contentNode.width = this._savedContentState.width, 
this._contentNode.height = this._savedContentState.height), this._savedContentState = null;
}, o.prototype._activateContentNode = function() {
this._driver.isVirtualMode && this._applyVirtualLayout(), this._driver.resetScrollState(), 
this._syncContentPosition();
}, o.prototype._syncContentPosition = function() {
if (this._contentNode) {
var t = this._driver.getContentPosition();
if (this._contentNode.x = t.x, this._contentNode.y = t.y, this._driver.isVirtualMode) {
var e = this._driver.getContentSize();
this._contentNode.width = e.width, this._contentNode.height = e.height, this._onItemRender && this._updateVisibleItems();
}
}
}, o.prototype._emitScrollEvent = function(t, e) {
var n = this._cachedScrollData;
if (this._contentNode) n.contentX = this._contentNode.x, n.contentY = this._contentNode.y; else {
var o = this._driver.getContentPosition();
n.contentX = o.x, n.contentY = o.y;
}
n.eid = this.eid, n.eventType = t, n.worldId = this.worldId, this.universe.handleScrollEvent(n), 
e && e(n);
}, o.prototype._updateVisibleItems = function() {
var t, e;
if (this._contentNode) {
var n = this._driver.computeNewVisibleRange();
if (n) {
var o = c(n, 2), r = o[0], i = o[1];
try {
for (var a = l(this._activeItems), s = a.next(); !s.done; s = a.next()) {
var u = c(s.value, 2), d = u[0], h = u[1];
(d < r || d > i) && (h.active = !1, this._itemPool.push(h), this._activeItems.delete(d));
}
} catch (e) {
t = {
error: e
};
} finally {
try {
s && !s.done && (e = a.return) && e.call(a);
} finally {
if (t) throw t.error;
}
}
for (var p = r; p <= i; p++) this._activeItems.has(p) || this._createOrReuseItem(p);
}
} else this._driver.itemCount;
}, o.prototype._createOrReuseItem = function(t) {
var e = this._itemPool.pop();
e || ((e = new cc.Node("item_".concat(t))).anchorX = .5, e.anchorY = 1, this._contentNode.addChild(e)), 
e.active = !0, e.name = "item_".concat(t);
var n = this._driver;
if (e.width = n.horizontal ? n.itemHeight : this.nativeNode.width, e.height = n.horizontal ? this.nativeNode.height : n.itemHeight, 
n.horizontal ? (e.x = t * n.itemHeight, e.y = 0) : (e.x = 0, e.y = -t * n.itemHeight), 
this._activeItems.set(t, e), this._onItemRender) {
var o = this._onItemRender(t);
if (!o) return;
if (e.children.length > 0) this._updateContentTree(e.children[0], o); else {
var r = wr(o, this._nodeFactory);
e.addChild(r.nativeNode);
}
}
}, o.prototype._updateContentTree = function(t, e, n) {
var o, r, i = t._cocosNodeRef;
if (i) if (n) try {
for (var a = l(n), s = a.next(); !s.done; s = a.next()) {
var u = s.value;
this._applyDirtyField(i, e.props, Sr, u);
}
} catch (t) {
o = {
error: t
};
} finally {
try {
s && !s.done && (r = a.return) && r.call(a);
} finally {
if (o) throw o.error;
}
} else br(i, e.props, Sr, Tr);
if (e.children) for (var c = t.children, d = 0; d < e.children.length && d < c.length; d++) this._updateContentTree(c[d], e.children[d], n);
}, o.prototype._applyDirtyField = function(t, e, n, o) {
var r = o.split(".");
if (!Tr.has(r[0])) {
for (var i = e, a = n, s = 0; s < r.length - 1; s++) {
var u = r[s], l = i[u], c = a[u];
if (!l || "object" != typeof l || !c || "object" != typeof c) return;
i = l, a = c;
}
var d = r[r.length - 1];
if (d in i) {
var h = a[d];
if (h) {
var p = i[d];
if ("function" == typeof h) {
var f = p;
Array.isArray(p) && p.length >= 1 && "function" == typeof p[0] && (f = p[0]()), 
h(t, f);
} else "object" == typeof h && "object" == typeof p && null !== p && br(t, p, h);
}
}
}
}, o.prototype._disposeChildRenderNodes = function(t) {
for (var e = t.children, n = 0; n < e.length; n++) this._disposeRenderNodeTree(e[n]);
}, o.prototype._disposeRenderNodeTree = function(t) {
for (var e = t.children, n = 0; n < e.length; n++) this._disposeRenderNodeTree(e[n]);
var o = t._cocosNodeRef;
o && (o.disposeRender(), t._cocosNodeRef = void 0);
}, o.prototype._cleanupContainerChildren = function(t) {
this._disposeChildRenderNodes(t);
for (var e = t.children, n = e.length - 1; n >= 0; n--) {
var o = e[n];
o.removeFromParent(), cc.isValid(o) && o.destroy();
}
}, o.prototype._clearVirtualItems = function() {
var t, e, n, o;
try {
for (var r = l(this._activeItems.values()), i = r.next(); !i.done; i = r.next()) {
var a = i.value;
this._cleanupContainerChildren(a), a.removeFromParent(), cc.isValid(a) && a.destroy();
}
} catch (e) {
t = {
error: e
};
} finally {
try {
i && !i.done && (e = r.return) && e.call(r);
} finally {
if (t) throw t.error;
}
}
try {
for (var s = l(this._itemPool), u = s.next(); !u.done; u = s.next()) a = u.value, 
this._cleanupContainerChildren(a), a.removeFromParent(), cc.isValid(a) && a.destroy();
} catch (t) {
n = {
error: t
};
} finally {
try {
u && !u.done && (o = s.return) && o.call(s);
} finally {
if (n) throw n.error;
}
}
this._activeItems.clear(), this._itemPool = [], this._driver.invalidateVisibleRange();
}, o.prototype.setScrollViewHorizontal = function(t) {
var e = this._driver.horizontal;
this._driver.horizontal = t, t !== e && this._contentNode && (this._driver.syncOffsetFromContentPosition(this._contentNode.x, this._contentNode.y), 
this._driver.isVirtualMode && (this._clearVirtualItems(), this._applyVirtualLayout()), 
this._syncContentPosition());
}, o.prototype.setScrollViewVertical = function(t) {
var e = this._driver.vertical;
this._driver.vertical = t, t !== e && this._contentNode && (this._driver.syncOffsetFromContentPosition(this._contentNode.x, this._contentNode.y), 
this._driver.isVirtualMode && (this._clearVirtualItems(), this._applyVirtualLayout()), 
this._syncContentPosition());
}, o.prototype.setScrollViewInertia = function(t) {
this._driver.inertia = t;
}, o.prototype.setScrollViewElastic = function(t) {
this._driver.elastic = t;
}, o.prototype.setScrollViewBounceDuration = function(t) {
this._driver.bounceDuration = t;
}, o.prototype.setScrollViewBrake = function(t) {
this._driver.brake = t;
}, o.prototype.setScrollViewContentName = function(t) {
t === this._contentName && this._contentNode || (this._contentName = t, this._clearVirtualItems(), 
this._restoreContentState(), this._contentNode = null, this._findContentNode());
}, o.prototype.setScrollViewContentX = function(t) {
this._driver.initialContentX = t, this._driver.isVirtualMode && this._onItemRender ? this._syncContentPosition() : this._contentNode && (this._driver.resetScrollState(), 
this._contentNode.x = t);
}, o.prototype.setScrollViewContentY = function(t) {
this._driver.initialContentY = t, this._driver.isVirtualMode && this._onItemRender ? this._syncContentPosition() : this._contentNode && (this._driver.resetScrollState(), 
this._contentNode.y = t);
}, o.prototype.setOnScrollBegan = function(t) {
this._onScrollBegan = t;
}, o.prototype.setOnScrollEnded = function(t) {
this._onScrollEnded = t;
}, o.prototype.setOnScrolling = function(t) {
this._onScrolling = t;
}, o.prototype.rebuildScrollViewContent = function(t) {
if (t && t.nativeNode) {
var e = t.nativeNode;
e !== this._contentNode && this._restoreContentState(), this._contentNode = e, this._activateContentNode();
}
}, o.prototype.setItemCount = function(t) {
var e = this._driver.isVirtualMode;
this._driver.itemCount = t;
var n = this._driver.isVirtualMode;
e && !n ? (this._clearVirtualItems(), this._restoreContentState(), this._activateContentNode()) : !e && n && (this._applyVirtualLayout(), 
this._syncContentPosition()), n && this._onItemRender && this._updateVisibleItems();
}, o.prototype.setItemHeight = function(t) {
this._driver.itemHeight = t, this._driver.isVirtualMode && this._onItemRender && this._updateVisibleItems();
}, o.prototype.setBufferSize = function(t) {
this._driver.bufferSize = t, this._driver.isVirtualMode && this._onItemRender && this._updateVisibleItems();
}, o.prototype.setOnItemRender = function(t) {
this._onItemRender = t, this._driver.isVirtualMode && this._onItemRender && this._updateVisibleItems();
}, o.prototype.scrollToIndex = function(t, e) {
void 0 === e && (e = !1), this._driver.isVirtualMode && this._onItemRender && (this._driver.scrollToIndex(t, e), 
e ? this._ensureScheduled() : this._syncContentPosition());
}, o.prototype.setScrollCtrl = function(e) {
Array.isArray(e) ? e.length > 0 && this._refreshActiveItems(new Set(e)) : e === t.ScrollControl.Refresh && this._refreshActiveItems();
}, o.prototype._refreshActiveItems = function(t) {
var e, n;
if (this._onItemRender) try {
for (var o = l(this._activeItems), r = o.next(); !r.done; r = o.next()) {
var i = c(r.value, 2), a = i[0], s = i[1], u = this._onItemRender(a);
u && s.children.length > 0 && this._updateContentTree(s.children[0], u, t);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
r && !r.done && (n = o.return) && n.call(o);
} finally {
if (e) throw e.error;
}
}
}, o.prototype.disposeRender = function() {
this._unschedule(), this._driver.phase !== t.ScrollPhase.Idle && this._scrollBeganEmitted && this._emitScrollEvent("scroll-ended", this._onScrollEnded), 
this._clearVirtualItems(), this._restoreContentState(), this._contentNode = null, 
this._contentName = "", this._onItemRender = null, this._onScrollBegan = null, this._onScrollEnded = null, 
this._onScrolling = null, this._scrollBeganEmitted = !1, this._dispatchingCancel = !1, 
this._driver.reset(), e.prototype.disposeRender.call(this);
}, o.prototype.destroyNative = function() {
this._unschedule(), this.nativeNode.off(cc.Node.EventType.TOUCH_START, this._onTouchStart, this, !0), 
this.nativeNode.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this, !0), 
this.nativeNode.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this, !0), this.nativeNode.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this, !0), 
this.nativeNode.off(cc.Node.EventType.SIZE_CHANGED, this._onViewportSizeChanged, this), 
this._contentNode = null, this._onScrollBegan = null, this._onScrollEnded = null, 
this._onScrolling = null, this._activeItems.clear(), this._itemPool = [], e.prototype.destroyNative.call(this);
}, o;
}(lo), Gr = function(e) {
function o(n) {
var o = e.call(this, n) || this;
return o._projection = t.ProjectionType.Orthographic, o._fov = 60, o._orthoHeight = 10, 
o._near = .1, o._far = 1e3, o._viewportRect = new cc.Rect(0, 0, 1, 1), o.nativeRenderer = o.nativeNode.getComponent(cc.Camera) || o.nativeNode.addComponent(cc.Camera), 
o.setCameraDepth(0), o.setCullingMask(t.CameraLayer.Everything), o.setProjection(t.ProjectionType.Orthographic), 
o.setOrthoHeight(o._orthoHeight), o.setNear(o._near), o.setFar(o._far), o.setClearFlags(t.CameraClearFlags.All), 
o;
}
return n(o, e), o.prototype.setCameraDepth = function(t) {
this.nativeRenderer.depth = t;
}, o.prototype.setViewportX = function(t) {
this._viewportRect.x = t, this.nativeRenderer.rect = this._viewportRect;
}, o.prototype.setViewportY = function(t) {
this._viewportRect.y = t, this.nativeRenderer.rect = this._viewportRect;
}, o.prototype.setViewportWidth = function(t) {
this._viewportRect.width = t, this.nativeRenderer.rect = this._viewportRect;
}, o.prototype.setViewportHeight = function(t) {
this._viewportRect.height = t, this.nativeRenderer.rect = this._viewportRect;
}, o.prototype.setCullingMask = function(t) {
this.nativeRenderer.cullingMask = this.universe.layerMapping.toPhysicalMask(t);
}, o.prototype.setProjection = function(e) {
this._projection = e, this.nativeRenderer.ortho = e === t.ProjectionType.Orthographic, 
this._updateProjection();
}, o.prototype.setFov = function(e) {
this._fov = e, this._projection === t.ProjectionType.Perspective && (this.nativeRenderer.fov = e);
}, o.prototype.setOrthoHeight = function(e) {
this._orthoHeight = e, this._projection === t.ProjectionType.Orthographic && (this.nativeRenderer.orthoSize = e / 2);
}, o.prototype.setNear = function(t) {
this._near = t;
}, o.prototype.setFar = function(t) {
this._far = t;
}, o.prototype.setCameraRgb = function(t) {
this.setRgbColor(t, uo.color), uo.color.a = this.nativeRenderer.backgroundColor.a, 
this.nativeRenderer.backgroundColor = uo.color;
}, o.prototype.setCameraAlpha = function(t) {
uo.color.set(this.nativeRenderer.backgroundColor), uo.color.a = this.opacityToAlpha(t), 
this.nativeRenderer.backgroundColor = uo.color;
}, o.prototype.setClearFlags = function(e) {
var n = 0;
e & t.CameraClearFlags.Color && (n |= cc.Camera.ClearFlags.COLOR), e & t.CameraClearFlags.Depth && (n |= cc.Camera.ClearFlags.DEPTH), 
e & t.CameraClearFlags.Stencil && (n |= cc.Camera.ClearFlags.STENCIL), this.nativeRenderer.clearFlags = n;
}, o.prototype.setZoomRatio = function(t) {
this.nativeRenderer.zoomRatio = t;
}, o.prototype.setAlignWithScreen = function(t) {
this.nativeRenderer.alignWithScreen = t;
}, o.prototype.setRenderStages = function(t) {
this.nativeRenderer.renderStages = t;
}, o.prototype.destroyNative = function() {
this.nativeRenderer && cc.isValid(this.nativeNode) && (this.nativeRenderer.enabled = !1), 
e.prototype.destroyNative.call(this);
}, o.prototype._updateProjection = function() {
this._projection === t.ProjectionType.Perspective ? this.nativeRenderer.fov = this._fov : this.nativeRenderer.orthoSize = this._orthoHeight / 2;
}, o;
}(lo);
t.KeyCode = void 0, (Or = t.KeyCode || (t.KeyCode = {}))[Or.A = 65] = "A", Or[Or.B = 66] = "B", 
Or[Or.C = 67] = "C", Or[Or.D = 68] = "D", Or[Or.E = 69] = "E", Or[Or.F = 70] = "F", 
Or[Or.G = 71] = "G", Or[Or.H = 72] = "H", Or[Or.I = 73] = "I", Or[Or.J = 74] = "J", 
Or[Or.K = 75] = "K", Or[Or.L = 76] = "L", Or[Or.M = 77] = "M", Or[Or.N = 78] = "N", 
Or[Or.O = 79] = "O", Or[Or.P = 80] = "P", Or[Or.Q = 81] = "Q", Or[Or.R = 82] = "R", 
Or[Or.S = 83] = "S", Or[Or.T = 84] = "T", Or[Or.U = 85] = "U", Or[Or.V = 86] = "V", 
Or[Or.W = 87] = "W", Or[Or.X = 88] = "X", Or[Or.Y = 89] = "Y", Or[Or.Z = 90] = "Z", 
Or[Or.Num0 = 48] = "Num0", Or[Or.Num1 = 49] = "Num1", Or[Or.Num2 = 50] = "Num2", 
Or[Or.Num3 = 51] = "Num3", Or[Or.Num4 = 52] = "Num4", Or[Or.Num5 = 53] = "Num5", 
Or[Or.Num6 = 54] = "Num6", Or[Or.Num7 = 55] = "Num7", Or[Or.Num8 = 56] = "Num8", 
Or[Or.Num9 = 57] = "Num9", Or[Or.ArrowLeft = 37] = "ArrowLeft", Or[Or.ArrowUp = 38] = "ArrowUp", 
Or[Or.ArrowRight = 39] = "ArrowRight", Or[Or.ArrowDown = 40] = "ArrowDown", Or[Or.Escape = 27] = "Escape", 
Or[Or.Space = 32] = "Space", Or[Or.Enter = 13] = "Enter", Or[Or.Tab = 9] = "Tab", 
Or[Or.Backspace = 8] = "Backspace", Or[Or.Delete = 46] = "Delete", Or[Or.Insert = 45] = "Insert", 
Or[Or.PrintScreen = 44] = "PrintScreen", Or[Or.ScrollLock = 145] = "ScrollLock", 
Or[Or.Pause = 19] = "Pause", Or[Or.ContextMenu = 93] = "ContextMenu", Or[Or.Shift = 16] = "Shift", 
Or[Or.Ctrl = 17] = "Ctrl", Or[Or.Alt = 18] = "Alt", Or[Or.CapsLock = 20] = "CapsLock", 
Or[Or.Meta = 91] = "Meta", Or[Or.NumLock = 144] = "NumLock", Or[Or.MobileBack = 6] = "MobileBack", 
Or[Or.Home = 36] = "Home", Or[Or.End = 35] = "End", Or[Or.PageUp = 33] = "PageUp", 
Or[Or.PageDown = 34] = "PageDown", Or[Or.F1 = 112] = "F1", Or[Or.F2 = 113] = "F2", 
Or[Or.F3 = 114] = "F3", Or[Or.F4 = 115] = "F4", Or[Or.F5 = 116] = "F5", Or[Or.F6 = 117] = "F6", 
Or[Or.F7 = 118] = "F7", Or[Or.F8 = 119] = "F8", Or[Or.F9 = 120] = "F9", Or[Or.F10 = 121] = "F10", 
Or[Or.F11 = 122] = "F11", Or[Or.F12 = 123] = "F12", Or[Or.Semicolon = 186] = "Semicolon", 
Or[Or.Equal = 187] = "Equal", Or[Or.Comma = 188] = "Comma", Or[Or.Minus = 189] = "Minus", 
Or[Or.Period = 190] = "Period", Or[Or.Slash = 191] = "Slash", Or[Or.Backquote = 192] = "Backquote", 
Or[Or.BracketLeft = 219] = "BracketLeft", Or[Or.Backslash = 220] = "Backslash", 
Or[Or.BracketRight = 221] = "BracketRight", Or[Or.Quote = 222] = "Quote", Or[Or.Numpad0 = 96] = "Numpad0", 
Or[Or.Numpad1 = 97] = "Numpad1", Or[Or.Numpad2 = 98] = "Numpad2", Or[Or.Numpad3 = 99] = "Numpad3", 
Or[Or.Numpad4 = 100] = "Numpad4", Or[Or.Numpad5 = 101] = "Numpad5", Or[Or.Numpad6 = 102] = "Numpad6", 
Or[Or.Numpad7 = 103] = "Numpad7", Or[Or.Numpad8 = 104] = "Numpad8", Or[Or.Numpad9 = 105] = "Numpad9", 
Or[Or.NumpadMultiply = 106] = "NumpadMultiply", Or[Or.NumpadAdd = 107] = "NumpadAdd", 
Or[Or.NumpadSubtract = 109] = "NumpadSubtract", Or[Or.NumpadDecimal = 110] = "NumpadDecimal", 
Or[Or.NumpadDivide = 111] = "NumpadDivide";
var kr, Vr = function(e) {
function o(t) {
var n = e.call(this, t) || this;
return n._frameName = "", n._hideUntilLoaded = !1, n._hiddenForLoad = !1, n._isLoading = !1, 
n.nativeRenderer = n.nativeNode.getComponent(cc.Sprite) || n.nativeNode.addComponent(cc.Sprite), 
n;
}
return n(o, e), o.prototype.setAtlas = function(t) {
this._atlasUrl = t, this._atlas = void 0, this._updateSpriteFrame();
}, o.prototype.setFrameName = function(t) {
this._frameName = t || "", this._updateSpriteFrame();
}, o.prototype.setImage = function(t) {
this._spriteUrl = t, this._updateSpriteFrame();
}, o.prototype.setDefaultImage = function(e) {
var n = this;
this._defaultImgUrl !== e && (this._defaultImgUrl = e, this._defaultSpriteFrame = void 0, 
e && this.loadAsset("defaultImg", e, t.LoaderAssetType.SpriteFrame, function(t) {
n._defaultSpriteFrame = t, n.nativeRenderer.spriteFrame || n._applyFrame(t);
}));
}, o.prototype.setHideUntilLoaded = function(t) {
this._hideUntilLoaded = t, this._syncHideState();
}, o.prototype._setLoading = function(t) {
this._isLoading !== t && (this._isLoading = t, this._syncHideState());
}, o.prototype._syncHideState = function() {
var t = this._hideUntilLoaded && this._isLoading;
t && !this._hiddenForLoad ? (this.nativeRenderer.enabled = !1, this._hiddenForLoad = !0) : !t && this._hiddenForLoad && (this.nativeRenderer.enabled = !0, 
this._hiddenForLoad = !1);
}, o.prototype._applyFrame = function(t) {
this.nativeRenderer.spriteFrame = t, this._width > 0 && (this.nativeNode.width = this._width), 
this._height > 0 && (this.nativeNode.height = this._height);
}, o.prototype._showDefault = function() {
this._defaultSpriteFrame && this._applyFrame(this._defaultSpriteFrame);
}, o.prototype._updateSpriteFrame = function() {
var e = this;
if (this._atlasUrl && this._frameName) {
if (!this._atlas) return this._showDefault(), this._setLoading(!0), void this._loadAtlas();
var n = this._atlas.getSpriteFrame(this._frameName);
return n ? this._applyFrame(n) : ('[CocosSpriteNode] SpriteFrame "'.concat(this._frameName, '" not found in atlas "').concat(this._atlasUrl, '"'), 
this._showDefault()), void this._setLoading(!1);
}
this._spriteUrl ? (this._showDefault(), this._setLoading(!0), this.loadAsset("image", this._spriteUrl, t.LoaderAssetType.SpriteFrame, function(t) {
e._applyFrame(t), e._setLoading(!1);
}, function() {
return e._setLoading(!1);
})) : this._setLoading(!1);
}, o.prototype._loadAtlas = function() {
var e = this;
this._atlasUrl && this.loadAsset("atlas", this._atlasUrl, t.LoaderAssetType.SpriteAtlas, function(t) {
e._atlas = t, e._updateSpriteFrame();
}, function() {
return e._setLoading(!1);
});
}, o.prototype.setRenderType = function(e) {
var n, o = ((n = {})[t.RenderType.Simple] = cc.Sprite.Type.SIMPLE, n[t.RenderType.Sliced] = cc.Sprite.Type.SLICED, 
n[t.RenderType.Tiled] = cc.Sprite.Type.TILED, n[t.RenderType.Filled] = cc.Sprite.Type.FILLED, 
n[t.RenderType.Mesh] = cc.Sprite.Type.MESH, n);
this.nativeRenderer.type = o[e];
}, o.prototype.setSizeMode = function(e) {
var n, o = ((n = {})[t.SizeMode.Custom] = cc.Sprite.SizeMode.CUSTOM, n[t.SizeMode.Trimmed] = cc.Sprite.SizeMode.TRIMMED, 
n[t.SizeMode.Raw] = cc.Sprite.SizeMode.RAW, n);
this.nativeRenderer.sizeMode = o[e];
}, o.prototype.setTrim = function(t) {
this.nativeRenderer.trim = t;
}, o.prototype.setFillType = function(e) {
var n, o = ((n = {})[t.SpriteFillType.Horizontal] = cc.Sprite.FillType.HORIZONTAL, 
n[t.SpriteFillType.Vertical] = cc.Sprite.FillType.VERTICAL, n[t.SpriteFillType.Radial] = cc.Sprite.FillType.RADIAL, 
n);
this.nativeRenderer.fillType = o[e];
}, o.prototype.setFillCenterX = function(t) {
var e = this.nativeRenderer.fillCenter;
uo.v2.x = t, uo.v2.y = e.y, this.nativeRenderer.fillCenter = uo.v2;
}, o.prototype.setFillCenterY = function(t) {
var e = this.nativeRenderer.fillCenter;
uo.v2.x = e.x, uo.v2.y = t, this.nativeRenderer.fillCenter = uo.v2;
}, o.prototype.setFillStart = function(t) {
this.nativeRenderer.fillStart = t;
}, o.prototype.setFillRange = function(t) {
this.nativeRenderer.fillRange = t;
}, o.prototype.setSrcBlendFactor = function(t) {
this.nativeRenderer.srcBlendFactor = Xo(t);
}, o.prototype.setDstBlendFactor = function(t) {
this.nativeRenderer.dstBlendFactor = Xo(t);
}, o.prototype.disposeRender = function() {
this._hiddenForLoad && (this.nativeRenderer.enabled = !0), this._hideUntilLoaded = !1, 
this._hiddenForLoad = !1, this._isLoading = !1, e.prototype.disposeRender.call(this);
}, o;
}(lo), jr = function(e) {
function o(t) {
var n = e.call(this, t) || this;
return n._textureUrl = "", n.nativeRenderer = n.nativeNode.getComponent(cc.MotionStreak) || n.nativeNode.addComponent(cc.MotionStreak), 
n;
}
return n(o, e), o.prototype.setFadeTime = function(t) {
this.nativeRenderer.fadeTime = t;
}, o.prototype.setMinSeg = function(t) {
this.nativeRenderer.minSeg = t;
}, o.prototype.setStroke = function(t) {
this.nativeRenderer.stroke = t;
}, o.prototype.setStreakColor = function(t) {
this.setRgbColor(t, uo.color), this.nativeRenderer.color = uo.color;
}, o.prototype.setFastMode = function(t) {
this.nativeRenderer.fastMode = t;
}, o.prototype.reset = function() {
this.nativeRenderer.reset();
}, o.prototype.setTexture = function(e) {
var n = this;
if (!e) return this.nativeRenderer.texture = null, void (this._textureUrl = "");
this._textureUrl !== e && (this._textureUrl = e, this.loadAsset("texture", e, t.LoaderAssetType.Texture, function(t) {
n._textureUrl === e && (n.nativeRenderer.texture = t);
}));
}, o.prototype.setSrcBlendFactor = function(t) {
this.nativeRenderer.srcBlendFactor = Xo(t);
}, o.prototype.setDstBlendFactor = function(t) {
this.nativeRenderer.dstBlendFactor = Xo(t);
}, o;
}(lo), Hr = function(e) {
function o(t) {
var n = e.call(this, t) || this;
return n._particleImgUrl = "", n._fileUrl = "", n.nativeRenderer = n.nativeNode.getComponent(cc.ParticleSystem) || n.nativeNode.addComponent(cc.ParticleSystem), 
n._startColor = new cc.Color(255, 255, 255, 255), n._startColorVar = new cc.Color(0, 0, 0, 0), 
n._endColor = new cc.Color(255, 255, 255, 255), n._endColorVar = new cc.Color(0, 0, 0, 0), 
n.nativeRenderer.custom = !0, n;
}
return n(o, e), o.prototype.setParticleAsset = function(e) {
var n = this;
if (!e) return this.nativeRenderer.spriteFrame = null, void (this._particleImgUrl = "");
this._particleImgUrl !== e && (this._particleImgUrl = e, this.loadAsset("particleImg", e, t.LoaderAssetType.SpriteFrame, function(t) {
n._particleImgUrl === e && (n.nativeRenderer.spriteFrame = t);
}));
}, o.prototype.setFile = function(e) {
var n = this;
if (!e) return this.nativeRenderer.file = null, void (this._fileUrl = "");
this._fileUrl !== e && (this._fileUrl = e, this.loadAsset("file", e, t.LoaderAssetType.Particle, function(t) {
n._fileUrl === e && (n.nativeRenderer.file = t);
}));
}, o.prototype.setDuration = function(t) {
this.nativeRenderer.duration = t;
}, o.prototype.setEmissionRate = function(t) {
this.nativeRenderer.emissionRate = t;
}, o.prototype.setLife = function(t) {
this.setPropWithVar("life", t);
}, o.prototype.setTotalParticles = function(t) {
this.nativeRenderer.totalParticles = t;
}, o.prototype.setStartRgb = function(t) {
this.setRgbColor(t, this._startColor), this.nativeRenderer.startColor = this._startColor;
}, o.prototype.setStartAlpha = function(t) {
this._startColor.a = this.opacityToAlpha(t), this.nativeRenderer.startColor = this._startColor;
}, o.prototype.setStartRgbVar = function(t) {
this.setRgbColor(t, this._startColorVar), this.nativeRenderer.startColorVar = this._startColorVar;
}, o.prototype.setStartAlphaVar = function(t) {
this._startColorVar.a = this.opacityToAlpha(t), this.nativeRenderer.startColorVar = this._startColorVar;
}, o.prototype.setEndRgb = function(t) {
this.setRgbColor(t, this._endColor), this.nativeRenderer.endColor = this._endColor;
}, o.prototype.setEndAlpha = function(t) {
this._endColor.a = this.opacityToAlpha(t), this.nativeRenderer.endColor = this._endColor;
}, o.prototype.setEndRgbVar = function(t) {
this.setRgbColor(t, this._endColorVar), this.nativeRenderer.endColorVar = this._endColorVar;
}, o.prototype.setEndAlphaVar = function(t) {
this._endColorVar.a = this.opacityToAlpha(t), this.nativeRenderer.endColorVar = this._endColorVar;
}, o.prototype.setParticleAngle = function(t) {
this.setPropWithVar("angle", t);
}, o.prototype.setStartSize = function(t) {
this.setPropWithVar("startSize", t);
}, o.prototype.setEndSize = function(t) {
this.setPropWithVar("endSize", t);
}, o.prototype.setStartSpin = function(t) {
this.setPropWithVar("startSpin", t);
}, o.prototype.setEndSpin = function(t) {
this.setPropWithVar("endSpin", t);
}, o.prototype.setPosVar = function(t, e) {
this.nativeRenderer.posVar = cc.v2(t, e);
}, o.prototype.setPositionType = function(e) {
var n, o, r = ((n = {})[t.ParticlePositionType.Free] = cc.ParticleSystem.PositionType.FREE, 
n[t.ParticlePositionType.Relative] = cc.ParticleSystem.PositionType.RELATIVE, n[t.ParticlePositionType.Grouped] = cc.ParticleSystem.PositionType.GROUPED, 
n);
this.nativeRenderer.positionType = null !== (o = r[e]) && void 0 !== o ? o : cc.ParticleSystem.PositionType.FREE;
}, o.prototype.setEmitterMode = function(e) {
var n, o, r = ((n = {})[t.ParticleEmitterMode.Gravity] = cc.ParticleSystem.EmitterMode.GRAVITY, 
n[t.ParticleEmitterMode.Radius] = cc.ParticleSystem.EmitterMode.RADIUS, n);
this.nativeRenderer.emitterMode = null !== (o = r[e]) && void 0 !== o ? o : cc.ParticleSystem.EmitterMode.GRAVITY;
}, o.prototype.setGravity = function(t, e) {
this.nativeRenderer.gravity = cc.v2(t, e);
}, o.prototype.setSpeed = function(t) {
this.setPropWithVar("speed", t);
}, o.prototype.setTangentialAccel = function(t) {
this.setPropWithVar("tangentialAccel", t);
}, o.prototype.setRadialAccel = function(t) {
this.setPropWithVar("radialAccel", t);
}, o.prototype.setRotationIsDir = function(t) {
this.nativeRenderer.rotationIsDir = t;
}, o.prototype.setStartRadius = function(t) {
this.setPropWithVar("startRadius", t);
}, o.prototype.setEndRadius = function(t) {
this.setPropWithVar("endRadius", t);
}, o.prototype.setRotatePerS = function(t) {
this.setPropWithVar("rotatePerS", t);
}, o.prototype.setSrcBlendFactor = function(t) {
this.nativeRenderer.srcBlendFactor = Xo(t);
}, o.prototype.setDstBlendFactor = function(t) {
this.nativeRenderer.dstBlendFactor = Xo(t);
}, o.prototype.setParticleCtrl = function(e) {
e === t.ParticleControl.Stop ? this.nativeRenderer.stopSystem() : e === t.ParticleControl.Reset && this.nativeRenderer.resetSystem();
}, o.prototype.setPropWithVar = function(t, e) {
Array.isArray(e) ? (this.nativeRenderer[t] = e[0], this.nativeRenderer[t + "Var"] = e[1]) : (this.nativeRenderer[t] = e, 
this.nativeRenderer[t + "Var"] = 0);
}, o;
}(lo), zr = function(e) {
function o(n) {
var o = e.call(this, n) || this;
o.backgroundNode = new cc.Node("BACKGROUND_SPRITE"), o.textLabelNode = new cc.Node("TEXT_LABEL"), 
o.placeholderLabelNode = new cc.Node("PLACEHOLDER_LABEL"), o.backgroundSprite = o.backgroundNode.addComponent(cc.Sprite);
var r = new Uint8Array(new Array(16).fill(255)), i = new cc.Texture2D();
i.initWithData(r, cc.Texture2D.PixelFormat.RGBA8888, 2, 2);
var a = new cc.SpriteFrame();
return a.setTexture(i), o.backgroundSprite.spriteFrame = a, o.backgroundNode.color = cc.Color.GRAY, 
o.textLabel = o.textLabelNode.addComponent(cc.Label), o.textLabel.overflow = cc.Label.Overflow.CLAMP, 
o.textLabel.enableWrapText = !1, o.placeholderLabel = o.placeholderLabelNode.addComponent(cc.Label), 
o.placeholderLabel.overflow = cc.Label.Overflow.CLAMP, o.placeholderLabel.enableWrapText = !1, 
o.addFullWidget(o.backgroundNode), o.addFullWidget(o.textLabelNode), o.addFullWidget(o.placeholderLabelNode), 
o.nativeNode.addChild(o.backgroundNode), o.nativeNode.addChild(o.textLabelNode), 
o.nativeNode.addChild(o.placeholderLabelNode), o.nativeRenderer = o.nativeNode.addComponent(cc.EditBox), 
o.nativeRenderer.background = o.backgroundSprite, o.nativeRenderer.textLabel = o.textLabel, 
o.nativeRenderer.placeholderLabel = o.placeholderLabel, o.setInputMode(t.EditBoxInputMode.SINGLE_LINE), 
o;
}
return n(o, e), o.prototype.addFullWidget = function(t) {
var e = t.addComponent(cc.Widget);
e.isAlignTop = !0, e.isAlignBottom = !0, e.isAlignLeft = !0, e.isAlignRight = !0, 
e.top = 0, e.bottom = 0, e.left = 0, e.right = 0, e.alignMode = cc.Widget.AlignMode.ALWAYS;
}, o.prototype.setText = function(t) {
this.nativeRenderer.string = t;
}, o.prototype.setBackgroundImage = function(e) {
var n = this;
this.loadAsset("editbox_bg", e, t.LoaderAssetType.SpriteFrame, function(t) {
t && (n.backgroundSprite.spriteFrame = t, n.nativeRenderer.backgroundImage = t);
});
}, o.prototype.setReturnType = function(e) {
var n, o = ((n = {})[t.EditBoxReturnType.DEFAULT] = cc.EditBox.KeyboardReturnType.DEFAULT, 
n[t.EditBoxReturnType.DONE] = cc.EditBox.KeyboardReturnType.DONE, n[t.EditBoxReturnType.SEND] = cc.EditBox.KeyboardReturnType.SEND, 
n[t.EditBoxReturnType.SEARCH] = cc.EditBox.KeyboardReturnType.SEARCH, n[t.EditBoxReturnType.GO] = cc.EditBox.KeyboardReturnType.GO, 
n);
this.nativeRenderer.returnType = o[e];
}, o.prototype.setInputFlag = function(e) {
var n, o = ((n = {})[t.EditBoxInputFlag.PASSWORD] = cc.EditBox.InputFlag.PASSWORD, 
n[t.EditBoxInputFlag.SENSITIVE] = cc.EditBox.InputFlag.SENSITIVE, n[t.EditBoxInputFlag.INITIAL_CAPS_WORD] = cc.EditBox.InputFlag.INITIAL_CAPS_WORD, 
n[t.EditBoxInputFlag.INITIAL_CAPS_SENTENCE] = cc.EditBox.InputFlag.INITIAL_CAPS_SENTENCE, 
n[t.EditBoxInputFlag.INITIAL_CAPS_ALL_CHARACTERS] = cc.EditBox.InputFlag.INITIAL_CAPS_ALL_CHARACTERS, 
n[t.EditBoxInputFlag.LOWERCASE_ALL_CHARACTERS] = cc.EditBox.InputFlag.INITIAL_CAPS_ALL_CHARACTERS, 
n);
this.nativeRenderer.inputFlag = o[e];
}, o.prototype.setInputMode = function(e) {
var n, o = ((n = {})[t.EditBoxInputMode.ANY] = cc.EditBox.InputMode.ANY, n[t.EditBoxInputMode.EMAIL_ADDR] = cc.EditBox.InputMode.EMAIL_ADDR, 
n[t.EditBoxInputMode.NUMERIC] = cc.EditBox.InputMode.NUMERIC, n[t.EditBoxInputMode.PHONENUMBER] = cc.EditBox.InputMode.PHONE_NUMBER, 
n[t.EditBoxInputMode.URL] = cc.EditBox.InputMode.URL, n[t.EditBoxInputMode.DECIMAL] = cc.EditBox.InputMode.DECIMAL, 
n[t.EditBoxInputMode.SINGLE_LINE] = cc.EditBox.InputMode.SINGLE_LINE, n);
this.nativeRenderer.inputMode = o[e];
}, o.prototype.setFontSize = function(t) {
this.nativeRenderer.fontSize = t;
}, o.prototype.setLineHeight = function(t) {
this.nativeRenderer.lineHeight = t;
}, o.prototype.setFontRgb = function(t) {
this.setRgbColor(t, uo.color), uo.color.a = this.nativeRenderer.fontColor.a, this.nativeRenderer.textLabel.node.color = uo.color;
}, o.prototype.setFontAlpha = function(t) {
uo.color.set(this.nativeRenderer.fontColor), uo.color.a = this.opacityToAlpha(t), 
this.nativeRenderer.textLabel.node.color = uo.color;
}, o.prototype.setPlaceholder = function(t) {
this.nativeRenderer.placeholder = t;
}, o.prototype.setPlaceholderFontSize = function(t) {
this.nativeRenderer.placeholderFontSize = t;
}, o.prototype.setPlaceholderFontRgb = function(t) {
this.setRgbColor(t, uo.color), uo.color.a = this.nativeRenderer.placeholderFontColor.a, 
this.nativeRenderer.placeholderLabel.node.color = uo.color;
}, o.prototype.setPlaceholderFontAlpha = function(t) {
uo.color.set(this.nativeRenderer.placeholderFontColor), uo.color.a = this.opacityToAlpha(t), 
this.nativeRenderer.placeholderLabel.node.color = uo.color;
}, o.prototype.setBackgroundRgb = function(t) {
this.setRgbColor(t, uo.color), uo.color.a = this.backgroundNode.color.a, this.backgroundNode.color = uo.color;
}, o.prototype.setBackgroundAlpha = function(t) {
this.backgroundNode.opacity = this.opacityToAlpha(t);
}, o.prototype.setMaxLength = function(t) {
this.nativeRenderer.maxLength = t;
}, o.prototype._bindEditBoxEvent = function(t, e) {
var n = this;
this.bindBaseEvent(t, e, function(e) {
return function() {
var o = {
text: n.nativeRenderer.string,
eid: n.eid,
eventType: t,
worldId: n.worldId
};
n.universe.handleEditBoxEvent(o), null == e || e();
};
});
}, o.prototype.setOnEditBegin = function(t) {
this._bindEditBoxEvent("editing-did-began", t);
}, o.prototype.setOnEditChange = function(t) {
this._bindEditBoxEvent("text-changed", t);
}, o.prototype.setOnEditEnd = function(t) {
this._bindEditBoxEvent("editing-did-ended", t);
}, o;
}(lo), Ur = function(t) {
function e(e) {
var n = t.call(this, e) || this;
return n._pendingUpdate = !1, n.nativeRenderer = n.nativeNode.getComponent(cc.MeshRenderer) || n.nativeNode.addComponent(cc.MeshRenderer), 
n;
}
return n(e, t), e.prototype.setMesh = function(t) {
this._currentCustomMeshData !== t && (this._currentCustomMeshData = t, this._updateMesh());
}, e.prototype.setShadowCastingMode = function(t) {
this.nativeRenderer.shadowCastingMode = t;
}, e.prototype.setReceiveShadows = function(t) {
this.nativeRenderer.receiveShadows = t;
}, e.prototype._updateMesh = function() {
var t, e, n, o, r = this, i = this._currentCustomMeshData;
if (i && i.positions && i.indices) {
if (!this.nativeRenderer._assembler) {
if (this._pendingUpdate) return;
return this._pendingUpdate = !0, void cc.director.once(cc.Director.EVENT_AFTER_UPDATE, function() {
r._pendingUpdate = !1, cc.isValid(r.nativeNode) && r._updateMesh();
});
}
var a = cc.gfx;
if (a) {
var s = i.positions.length / 3, u = a.ATTR_POSITION || "a_position", c = a.ATTR_UV0 || "a_uv0", d = [ {
name: u,
type: a.ATTR_TYPE_FLOAT32,
num: 3
}, {
name: c,
type: a.ATTR_TYPE_FLOAT32,
num: 2
} ], h = Object.keys(i).filter(function(t) {
return "positions" !== t && "uvs" !== t && "indices" !== t && Array.isArray(i[t]);
});
try {
for (var p = l(h), f = p.next(); !f.done; f = p.next()) {
var m = f.value, y = (b = i[m]).length / s, v = m.startsWith("a_") ? m : "a_".concat(m);
d.push({
name: v,
type: a.ATTR_TYPE_FLOAT32,
num: y
});
}
} catch (e) {
t = {
error: e
};
} finally {
try {
f && !f.done && (e = p.return) && e.call(p);
} finally {
if (t) throw t.error;
}
}
var _ = new a.VertexFormat(d), g = new cc.Mesh();
g.init(_, s, !0);
for (var A = uo.getV3s(s).slice(0, s), C = 0; C < s; C++) (F = A[C]).x = i.positions[3 * C], 
F.y = i.positions[3 * C + 1], F.z = i.positions[3 * C + 2];
if (g.setVertices(u, A), i.uvs) {
var R = uo.getV2s(s).slice(0, s);
for (C = 0; C < s; C++) (F = R[C]).x = i.uvs[2 * C], F.y = i.uvs[2 * C + 1];
g.setVertices(c, R);
}
try {
for (var S = l(h), T = S.next(); !T.done; T = S.next()) {
var b;
if (m = T.value, y = (b = i[m]).length / s, v = m.startsWith("a_") ? m : "a_".concat(m), 
1 === y) g.setVertices(v, b); else if (2 === y) {
for (R = uo.getV2s(s).slice(0, s), C = 0; C < s; C++) (F = R[C]).x = b[2 * C], F.y = b[2 * C + 1];
g.setVertices(v, R);
} else if (3 === y) {
var w = uo.getV3s(s).slice(0, s);
for (C = 0; C < s; C++) {
var F;
(F = w[C]).x = b[3 * C], F.y = b[3 * C + 1], F.z = b[3 * C + 2];
}
g.setVertices(v, w);
} else if (4 === y) {
var E = uo.getV4s(s).slice(0, s);
for (C = 0; C < s; C++) {
var N = E[C];
N.r = b[4 * C], N.g = b[4 * C + 1], N.b = b[4 * C + 2], N.a = b[4 * C + 3];
}
g.setVertices(v, E);
}
}
} catch (t) {
n = {
error: t
};
} finally {
try {
T && !T.done && (o = S.return) && o.call(S);
} finally {
if (n) throw n.error;
}
}
g.setIndices(i.indices), this.nativeRenderer.mesh = g;
}
} else this.nativeRenderer.mesh = null;
}, e.prototype.disposeRender = function() {
this.nativeRenderer.mesh && (this.nativeRenderer.mesh.destroy(), this.nativeRenderer.mesh = null), 
this._currentCustomMeshData = null, this._pendingUpdate = !1, t.prototype.disposeRender.call(this);
}, e;
}(lo), Yr = function(e) {
function o(n) {
var o = e.call(this, n) || this;
return o._nativeTex = null, o._texW = 0, o._texH = 0, o._texFmt = t.PixelFormat.RGBA8888, 
o._filterMin = t.TextureFilter.Linear, o._filterMag = t.TextureFilter.Linear, o._wrapS = t.TextureWrapMode.ClampToEdge, 
o._wrapT = t.TextureWrapMode.ClampToEdge, o._spriteFrame = null, o.nativeRenderer = o.nativeNode.getComponent(cc.Sprite) || o.nativeNode.addComponent(cc.Sprite), 
o.nativeRenderer.sizeMode = cc.Sprite.SizeMode.CUSTOM, o;
}
return n(o, e), o.prototype.setTexWidth = function(t) {
this._texW = t;
}, o.prototype.setTexHeight = function(t) {
this._texH = t;
}, o.prototype.setFormat = function(t) {
this._texFmt = t;
}, o.prototype.setFilterMin = function(t) {
this._filterMin = t, this._nativeTex && this._nativeTex.setFilters(Jo(this._filterMin), Jo(this._filterMag));
}, o.prototype.setFilterMag = function(t) {
this._filterMag = t, this._nativeTex && this._nativeTex.setFilters(Jo(this._filterMin), Jo(this._filterMag));
}, o.prototype.setWrapS = function(t) {
this._wrapS = t, this._nativeTex && this._nativeTex.setWrapMode(Zo(this._wrapS), Zo(this._wrapT));
}, o.prototype.setWrapT = function(t) {
this._wrapT = t, this._nativeTex && this._nativeTex.setWrapMode(Zo(this._wrapS), Zo(this._wrapT));
}, o.prototype.setPixels = function(e) {
if (!e || !e.length || this._texW <= 0 || this._texH <= 0) this._clearTexture(); else {
var n = this._texW * this._texH * zo(this._texFmt);
if (e.length !== n) return "[CocosTexture2DNode] pixels 大小不匹配: 期望 ".concat(n, " 字节 "), 
"(".concat(this._texW, "x").concat(this._texH, ", ").concat(t.PixelFormat[this._texFmt], "), 实际 ").concat(e.length, " 字节"), 
void this._clearTexture();
if (this._nativeTex) this._nativeTex.initWithData(e, Qo(this._texFmt), this._texW, this._texH), 
this._refreshSpriteFrame(); else {
var o = new cc.Texture2D();
o.initWithData(e, Qo(this._texFmt), this._texW, this._texH), o.packable = !1, o.setFilters(Jo(this._filterMin), Jo(this._filterMag)), 
o.setWrapMode(Zo(this._wrapS), Zo(this._wrapT)), this._nativeTex = o, this._bindSpriteFrame();
}
}
}, o.prototype._bindSpriteFrame = function() {
this._nativeTex && (this._spriteFrame = new cc.SpriteFrame(this._nativeTex), this.nativeRenderer.spriteFrame = this._spriteFrame, 
this._width > 0 && (this.nativeNode.width = this._width), this._height > 0 && (this.nativeNode.height = this._height));
}, o.prototype._refreshSpriteFrame = function() {
this._nativeTex && this._spriteFrame && (this._spriteFrame.setTexture(this._nativeTex), 
this.nativeRenderer.spriteFrame = this._spriteFrame);
}, o.prototype._clearTexture = function() {
this._nativeTex && (this._spriteFrame && (this.nativeRenderer.spriteFrame === this._spriteFrame && (this.nativeRenderer.spriteFrame = null), 
this._spriteFrame = null), this._nativeTex.destroy(), this._nativeTex = null);
}, o.prototype.disposeRender = function() {
this._clearTexture(), e.prototype.disposeRender.call(this);
}, o.prototype.destroyNative = function() {
this._clearTexture(), e.prototype.destroyNative.call(this);
}, o;
}(lo), qr = function(e) {
function o(t) {
var n = e.call(this, t) || this;
return n.nativeRenderer = n.nativeNode.getComponent(cc.RichText) || n.nativeNode.addComponent(cc.RichText), 
n;
}
return n(o, e), o.prototype.setText = function(t) {
this.nativeRenderer.string = t;
}, o.prototype.setFontSize = function(t) {
this.nativeRenderer.fontSize = t;
}, o.prototype.setHorizontalAlign = function(e) {
switch (e) {
case t.TextHorizontalAlign.LEFT:
this.nativeRenderer.horizontalAlign = cc.macro.TextAlignment.LEFT;
break;

case t.TextHorizontalAlign.CENTER:
this.nativeRenderer.horizontalAlign = cc.macro.TextAlignment.CENTER;
break;

case t.TextHorizontalAlign.RIGHT:
this.nativeRenderer.horizontalAlign = cc.macro.TextAlignment.RIGHT;
}
}, o.prototype.setMaxWidth = function(t) {
this.nativeRenderer.maxWidth = t;
}, o.prototype.setLineHeight = function(t) {
this.nativeRenderer.lineHeight = t;
}, o.prototype.setFontFamily = function(t) {
this.nativeRenderer.fontFamily = t;
}, o.prototype.setFont = function(e) {
var n = this;
this.loadAsset("font", e, t.LoaderAssetType.Font, function(t) {
n.nativeRenderer.font = t;
});
}, o.prototype.setUseSystemFont = function(t) {
this.nativeRenderer.useSystemFont = t;
}, o.prototype.setCacheMode = function(e) {
switch (e) {
case t.LabelCacheMode.NONE:
this.nativeRenderer.cacheMode = cc.Label.CacheMode.NONE;
break;

case t.LabelCacheMode.BITMAP:
this.nativeRenderer.cacheMode = cc.Label.CacheMode.BITMAP;
break;

case t.LabelCacheMode.CHAR:
this.nativeRenderer.cacheMode = cc.Label.CacheMode.CHAR;
}
}, o.prototype.setImageAtlas = function(e) {
var n = this;
this.loadAsset("imageAtlas", e, t.LoaderAssetType.SpriteAtlas, function(t) {
n.nativeRenderer.imageAtlas = t;
});
}, o.prototype.setHandleTouchEvent = function(t) {
this.nativeRenderer.handleTouchEvent = t;
}, o.prototype.setOnClick = function(t) {
var e = this, n = this.nativeNode.getComponent(Xr);
n || (n = this.nativeNode.addComponent(Xr)), n.callback = t ? function(n) {
var o = {
param: null != n ? n : "",
eid: e.eid,
worldId: e.worldId
};
e.universe.handleRichTextClickEvent(o), t(o);
} : void 0;
}, o;
}(lo), Xr = function(t) {
function e() {
var e = t.apply(this, d([], c(arguments), !1)) || this;
return e.callback = void 0, e;
}
return n(e, t), e.prototype.onClick = function(t, e) {
var n;
null === (n = this.callback) || void 0 === n || n.call(this, e);
}, i([ cc._decorator.ccclass("AERichTextClickProxy") ], e);
}(cc.Component), Qr = function(e) {
function o() {
var t = e.apply(this, d([], c(arguments), !1)) || this;
return t.root = null, t.shouldRestoreContext = cc.sys.os === cc.sys.OS_ANDROID, 
t;
}
return n(o, e), o.prototype.createRenderNode = function(e) {
switch (e) {
case t.RenderNodeType.Node:
return new lo(this.universe);

case t.RenderNodeType.Text:
return new fo(this.universe);

case t.RenderNodeType.Sprite:
return new Vr(this.universe);

case t.RenderNodeType.Streak:
return new jr(this.universe);

case t.RenderNodeType.Particle:
return new Hr(this.universe);

case t.RenderNodeType.EditBox:
return new zr(this.universe);

case t.RenderNodeType.Mesh:
return new Ur(this.universe);

case t.RenderNodeType.Spine:
return new Co(this.universe);

case t.RenderNodeType.Graphics:
return new bo(this.universe);

case t.RenderNodeType.TraceGraphics:
return new Go(this.universe);

case t.RenderNodeType.Mask:
return new tr(this.universe);

case t.RenderNodeType.ScrollView:
return new Br(this.universe);

case t.RenderNodeType.Camera:
return new Gr(this.universe);

case t.RenderNodeType.Texture2D:
return new Yr(this.universe);

case t.RenderNodeType.RichText:
return new qr(this.universe);

default:
return void re(Et.UnsupportedNodeType, {
type: String(e)
});
}
}, o.prototype.createRootNode = function(e, n) {
var o = new lo(this.universe);
o.setName("AtomEngineRoot"), o.setWidgetTop(0), o.setWidgetBottom(0), o.setWidgetLeft(0), 
o.setWidgetRight(0), o.setWidgetAlignMode(t.WidgetAlignMode.Always), this.root = o.nativeNode, 
this.root.on(cc.Node.EventType.SIZE_CHANGED, this.onWindowResize, this), cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this), 
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this), cc.game.on(cc.game.EVENT_HIDE, this.onPageHide, this), 
cc.game.on(cc.game.EVENT_SHOW, this.onPageShow, this);
var r = null != e ? e : cc.winSize.width, i = null != n ? n : cc.winSize.height;
return this.universe.handleWindowResize(r, i), o;
}, o.prototype.destroyRootNode = function() {
this.root && (this.root.off(cc.Node.EventType.SIZE_CHANGED, this.onWindowResize, this), 
cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this), cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this), 
cc.game.off(cc.game.EVENT_HIDE, this.onPageHide, this), cc.game.off(cc.game.EVENT_SHOW, this.onPageShow, this), 
this.root = null);
}, o.prototype.onWindowResize = function() {
this.root && this.universe.handleWindowResize(this.root.width, this.root.height);
}, o.prototype.onKeyDown = function(t) {
var e = t.keyCode;
this.universe.handleKeyboardEvent(e, !0);
}, o.prototype.onKeyUp = function(t) {
var e = t.keyCode;
this.universe.handleKeyboardEvent(e, !1);
}, o.prototype.getWinSize = function() {
var t = cc.winSize;
return {
width: t.width,
height: t.height
};
}, o.prototype.getDesignSize = function() {
var t = cc.view.getDesignResolutionSize();
return {
width: t.width,
height: t.height
};
}, o.prototype.setMultiTouch = function(t) {
var e = cc.macro.ENABLE_MULTI_TOUCH;
return cc.macro.ENABLE_MULTI_TOUCH = t, e;
}, o.prototype.getSafeAreaRect = function() {
var t = cc.sys.getSafeAreaRect();
return {
x: t.x,
y: t.y,
width: t.width,
height: t.height
};
}, o.prototype.updateRootNodeAlignment = function() {
var t, e;
if (this.root) {
var n = this.root.getComponent(cc.Widget);
n && n.updateAlignment();
try {
for (var o = l(this.root.children), r = o.next(); !r.done; r = o.next()) {
var i = r.value.getComponent(cc.Widget);
i && i.updateAlignment();
}
} catch (e) {
t = {
error: e
};
} finally {
try {
r && !r.done && (e = o.return) && e.call(o);
} finally {
if (t) throw t.error;
}
}
this.onWindowResize();
}
}, o;
}(Xn), Jr = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.setItem = function(t, e) {
cc.sys.localStorage.setItem(t, e);
}, e.prototype.getItem = function(t) {
return cc.sys.localStorage.getItem(t);
}, e.prototype.removeItem = function(t) {
cc.sys.localStorage.removeItem(t);
}, e.prototype.hasItem = function(t) {
return null !== cc.sys.localStorage.getItem(t);
}, e.prototype.clear = function() {
cc.sys.localStorage.clear();
}, e;
}(function() {
function t() {}
return t.prototype.readRawItem = function(t) {
return this.getItem(t);
}, t.prototype.saveStorage = function(t, e) {
this.setItem("ae_storage_" + t, JSON.stringify(e));
}, t.prototype.loadStorage = function(t) {
var e = this.getItem("ae_storage_" + t);
return e ? JSON.parse(e) : null;
}, t.prototype.clearStorage = function() {
this.clear();
}, t.prototype.saveJsonEntry = function(t, e) {
this.setItem("ae_json_" + t, JSON.stringify(e));
}, t.prototype.loadJsonEntry = function(t) {
var e = this.getItem("ae_json_" + t);
return e ? JSON.parse(e) : null;
}, t.prototype.removeJsonEntry = function(t) {
this.removeItem("ae_json_" + t);
}, t;
}()), Zr = "atom_preloaded_assets", Kr = "atom_feature_versions", $r = ((kr = {})[t.LoaderAssetType.SpriteFrame] = cc.SpriteFrame, 
kr[t.LoaderAssetType.SpriteAtlas] = cc.SpriteAtlas, kr[t.LoaderAssetType.Font] = cc.Font, 
kr[t.LoaderAssetType.SkeletonData] = sp.SkeletonData, kr[t.LoaderAssetType.DragonBonesAsset] = dragonBones.DragonBonesAsset, 
kr[t.LoaderAssetType.DragonBonesAtlasAsset] = dragonBones.DragonBonesAtlasAsset, 
kr[t.LoaderAssetType.Particle] = cc.ParticleAsset, kr[t.LoaderAssetType.Texture] = cc.Texture2D, 
kr[t.LoaderAssetType.AudioClip] = cc.AudioClip, kr[t.LoaderAssetType.Material] = cc.Material, 
kr[t.LoaderAssetType.Json] = cc.JsonAsset, kr[t.LoaderAssetType.Buffer] = cc.BufferAsset, 
kr[t.LoaderAssetType.Effect] = cc.EffectAsset, kr), ti = function(e) {
function o(t) {
var n = e.call(this, t) || this;
return n._bundles = new Map(), n._remoteAssetCache = new Map(), n._sessionMeta = new Map(), 
n._preloadCache = {}, n._preloadCacheLoaded = !1, n._savePending = !1, n;
}
return n(o, e), o.prototype._loadRemoteWithTimeout = function(t, e) {
return void 0 === e && (e = 18e4), new Promise(function(n, o) {
var r = !1, i = setTimeout(function() {
r || (r = !0);
}, e);
cc.assetManager.loadRemote(t, function(t, e) {
r = !0, clearTimeout(i), t ? o(t) : n(e);
});
});
}, o.prototype._assetCacheKey = function(t, e) {
return "".concat(t, "_").concat(e);
}, o.prototype._dirCacheKey = function(t) {
return "dir:".concat(t);
}, o.prototype._isPreloaded = function(t, e) {
var n;
return this._ensureCacheLoaded(), Boolean(null === (n = this._preloadCache[t]) || void 0 === n ? void 0 : n.assets[e]);
}, o.prototype._isPathCoveredByDir = function(t, e) {
var n, o = null === (n = this._preloadCache[t]) || void 0 === n ? void 0 : n.assets;
if (!o) return !1;
for (var r in o) if (r.startsWith("dir:")) {
var i = r.slice(4);
if ("" === i || e === i || e.startsWith(i + "/")) return !0;
}
return !1;
}, o.prototype._markPreloaded = function(t, e) {
this._ensureCacheLoaded(), this._preloadCache[t].assets[e] = !0, this._scheduleSave();
}, o.prototype._initFeaturePreloadCache = function(t, e) {
this._ensureCacheLoaded();
var n = this._preloadCache[t];
n ? n.version !== e && (n.version = e, n.assets = {}, delete n.bundleDownloaded, 
delete n.resourcesDownloaded, delete n.compressed, delete n.deps, this._invalidateDependents(t), 
this._scheduleSave()) : (this._preloadCache[t] = {
version: e,
assets: {}
}, this._scheduleSave());
}, o.prototype._invalidateDependents = function(t) {
var e, n, o;
try {
for (var r = l(Object.values(this._preloadCache)), i = r.next(); !i.done; i = r.next()) {
var a = i.value;
(null === (o = a.deps) || void 0 === o ? void 0 : o.includes(t)) && (delete a.bundleDownloaded, 
delete a.resourcesDownloaded);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
i && !i.done && (n = r.return) && n.call(r);
} finally {
if (e) throw e.error;
}
}
}, o.prototype._ensureCacheLoaded = function() {
if (!this._preloadCacheLoaded) {
this._preloadCacheLoaded = !0;
var t = cc.sys.localStorage.getItem(Zr);
t && (this._preloadCache = JSON.parse(t));
}
}, o.prototype._scheduleSave = function(t) {
var e = this;
if (void 0 === t && (t = !1), t) return this._savePending = !1, void cc.sys.localStorage.setItem(Zr, JSON.stringify(this._preloadCache));
this._savePending || (this._savePending = !0, setTimeout(function() {
e._savePending = !1, cc.sys.localStorage.setItem(Zr, JSON.stringify(e._preloadCache));
}, 500));
}, o.prototype.isBundleDownloaded = function(t) {
var e;
return this._ensureCacheLoaded(), !0 === (null === (e = this._preloadCache[t]) || void 0 === e ? void 0 : e.bundleDownloaded);
}, o.prototype.isResourcesDownloaded = function(t) {
var e;
return this._ensureCacheLoaded(), !0 === (null === (e = this._preloadCache[t]) || void 0 === e ? void 0 : e.resourcesDownloaded);
}, o.prototype.isAssetDownloaded = function(t, e, n) {
var o, r, i, a = this.buildRemoteUrl(t, e), s = a.isRemote, u = a.resolvedPath;
if (s) {
var l = "".concat(u, "_").concat(n);
return !!(null === (o = this._remoteAssetCache.get(t)) || void 0 === o ? void 0 : o.has(l)) || Boolean(null === (r = cc.assetManager.cacheManager) || void 0 === r ? void 0 : r.getCache(u));
}
return this._ensureCacheLoaded(), !!(null === (i = this._preloadCache[t]) || void 0 === i ? void 0 : i.resourcesDownloaded) || !!this._isPreloaded(t, this._assetCacheKey(e, n)) || this._isPathCoveredByDir(t, e);
}, o.prototype.isDirDownloaded = function(t, e) {
var n;
return this._ensureCacheLoaded(), !!(null === (n = this._preloadCache[t]) || void 0 === n ? void 0 : n.resourcesDownloaded) || this._isPathCoveredByDir(t, e);
}, o.prototype.preloadBundles = function(t, e) {
return s(this, void 0, void 0, function() {
var n, o, r, i, a, s, c, d, h, p, f, m, y, v, _, g, A, C;
return u(this, function(u) {
switch (u.label) {
case 0:
this._ensureCacheLoaded(), n = [], u.label = 1;

case 1:
u.trys.push([ 1, 17, 18, 19 ]), o = l(t), r = o.next(), u.label = 2;

case 2:
if (r.done) return [ 3, 16 ];
i = r.value, u.label = 3;

case 3:
return u.trys.push([ 3, 13, , 14 ]), (null === (C = this._preloadCache[i]) || void 0 === C ? void 0 : C.bundleDownloaded) ? (null == e || e(), 
[ 3, 15 ]) : [ 4, this._loadBundleWithMeta(i) ];

case 4:
a = u.sent().deps, s = a.map(function(t) {
return t.atomFeatureName;
}), u.label = 5;

case 5:
u.trys.push([ 5, 10, 11, 12 ]), g = void 0, c = l(s), d = c.next(), u.label = 6;

case 6:
return d.done ? [ 3, 9 ] : (h = d.value, [ 4, this._loadBundleWithMeta(h) ]);

case 7:
u.sent(), this._preloadCache[h].bundleDownloaded = !0, u.label = 8;

case 8:
return d = c.next(), [ 3, 6 ];

case 9:
return [ 3, 12 ];

case 10:
return p = u.sent(), g = {
error: p
}, [ 3, 12 ];

case 11:
try {
d && !d.done && (A = c.return) && A.call(c);
} finally {
if (g) throw g.error;
}
return [ 7 ];

case 12:
return this._preloadCache[i].bundleDownloaded = !0, [ 3, 14 ];

case 13:
return f = u.sent(), m = "".concat(i, ": ").concat(f instanceof Error ? f.message : f), 
n.push(m), [ 3, 14 ];

case 14:
null == e || e(), u.label = 15;

case 15:
return r = o.next(), [ 3, 2 ];

case 16:
return [ 3, 19 ];

case 17:
return y = u.sent(), v = {
error: y
}, [ 3, 19 ];

case 18:
try {
r && !r.done && (_ = o.return) && _.call(o);
} finally {
if (v) throw v.error;
}
return [ 7 ];

case 19:
if (this._scheduleSave(!0), n.length > 0) throw new Error("preloadBundles 部分失败(".concat(n.length, "/").concat(t.length, "): ").concat(n.join("; ")));
return [ 2 ];
}
});
});
}, o.prototype.preloadFeatures = function(t) {
return s(this, void 0, void 0, function() {
var e, n, o, r, i, a;
return u(this, function(s) {
switch (s.label) {
case 0:
s.trys.push([ 0, 5, 6, 7 ]), e = l(t), n = e.next(), s.label = 1;

case 1:
return n.done ? [ 3, 4 ] : (o = n.value, [ 4, this._preloadFeatureWithDeps(o) ]);

case 2:
s.sent(), s.label = 3;

case 3:
return n = e.next(), [ 3, 1 ];

case 4:
return [ 3, 7 ];

case 5:
return r = s.sent(), i = {
error: r
}, [ 3, 7 ];

case 6:
try {
n && !n.done && (a = e.return) && a.call(e);
} finally {
if (i) throw i.error;
}
return [ 7 ];

case 7:
return [ 2 ];
}
});
});
}, o.prototype._preloadFeatureWithDeps = function(t) {
return s(this, void 0, void 0, function() {
var e, n, o, r, i, a, s, c, d, h, p, f;
return u(this, function(u) {
switch (u.label) {
case 0:
return this._ensureCacheLoaded(), (null === (f = this._preloadCache[t]) || void 0 === f ? void 0 : f.resourcesDownloaded) ? [ 2 ] : [ 4, this._loadBundleWithMeta(t) ];

case 1:
return e = u.sent(), n = e.bundle, o = e.deps, [ 4, this._preloadDirNative(n, "", t) ];

case 2:
if (u.sent(), !((r = o.map(function(t) {
return t.atomFeatureName;
})).length > 0)) return [ 3, 11 ];
u.label = 3;

case 3:
u.trys.push([ 3, 9, 10, 11 ]), i = l(r), a = i.next(), u.label = 4;

case 4:
return a.done ? [ 3, 8 ] : (s = a.value, [ 4, this._loadBundleWithMeta(s) ]);

case 5:
return c = u.sent().bundle, [ 4, this._preloadDirNative(c, "", s) ];

case 6:
u.sent(), this._preloadCache[s].bundleDownloaded = !0, this._preloadCache[s].resourcesDownloaded = !0, 
u.label = 7;

case 7:
return a = i.next(), [ 3, 4 ];

case 8:
return [ 3, 11 ];

case 9:
return d = u.sent(), h = {
error: d
}, [ 3, 11 ];

case 10:
try {
a && !a.done && (p = i.return) && p.call(i);
} finally {
if (h) throw h.error;
}
return [ 7 ];

case 11:
return this._preloadCache[t].bundleDownloaded = !0, this._preloadCache[t].resourcesDownloaded = !0, 
this._scheduleSave(!0), [ 2 ];
}
});
});
}, o.prototype._loadBundleWithMeta = function(t, e) {
return s(this, void 0, void 0, function() {
var n, o, r, i, a, s, l, c, d, h, p;
return u(this, function(u) {
switch (u.label) {
case 0:
return (n = this._bundles.get(t)) ? (this._ensureCacheLoaded(), i = this._preloadCache[t], 
[ 2, {
bundle: n,
version: null == i ? void 0 : i.version,
deps: (null !== (d = null == i ? void 0 : i.deps) && void 0 !== d ? d : []).map(function(t) {
return {
atomFeatureName: t
};
})
} ]) : (r = [], this._remoteBundleUrl ? e ? (o = e.version, r = e.deps, [ 3, 3 ]) : [ 3, 1 ] : [ 3, 3 ]);

case 1:
return [ 4, this._resolveBundleMeta(t) ];

case 2:
c = u.sent(), o = c.version, r = null !== (h = c.dependencies) && void 0 !== h ? h : [], 
c.createTime, c.buildTime, this.universe.host.getNetworkState() || (this._ensureCacheLoaded(), 
void 0 !== (null == (i = this._preloadCache[t]) ? void 0 : i.version) && (o = i.version), 
(null == i ? void 0 : i.deps) && (r = i.deps.map(function(t) {
return {
atomFeatureName: t
};
}))), u.label = 3;

case 3:
return [ 4, this._loadBundleRaw(t, o) ];

case 4:
return a = u.sent(), s = a.bundle, l = a.useCompressed, this._remoteBundleUrl ? [ 3, 6 ] : [ 4, new Promise(function(t) {
s.load("bundleMeta", cc.JsonAsset, function(e, n) {
t(e ? null : n.json);
});
}) ];

case 5:
(c = u.sent()) && (r = null !== (p = c.dependencies) && void 0 !== p ? p : [], c.createTime, 
c.buildTime), u.label = 6;

case 6:
return this._bundles.set(t, s), this._initFeaturePreloadCache(t, o), this._preloadCache[t].deps = r.map(function(t) {
return t.atomFeatureName;
}), this._preloadCache[t].compressed = Boolean(l), l && r.length > 0 && this.universe.featureResolver.markFeaturesCompressed(r.map(function(t) {
return t.atomFeatureName;
})), [ 2, {
bundle: s,
version: o,
deps: r
} ];
}
});
});
}, o.prototype._shouldUseCompressed = function(t) {
var e;
if (!this._remoteBundleUrl) return !1;
this._ensureCacheLoaded();
var n = null === (e = this._preloadCache[t]) || void 0 === e ? void 0 : e.compressed;
return void 0 !== n ? n : this.universe.featureResolver.isFeatureCompressed(t);
}, o.prototype._loadBundleRaw = function(t, e) {
return s(this, arguments, void 0, function(t, e, n) {
var o = this;
return void 0 === n && (n = {}), u(this, function() {
return [ 2, this.enqueueBundleOp(function() {
return s(o, void 0, void 0, function() {
var o, r, i;
return u(this, function(a) {
switch (a.label) {
case 0:
return o = this.buildBundleUrl(t), r = {}, void 0 !== e && (r.version = String(e)), 
n.dontExecuteScript && (r._dontExecuteScript = !0), (i = void 0 !== e && this._shouldUseCompressed(t)) && (r.bundleName = t, 
r.hspkg = !0, r.hspkgUrl = "".concat(o, "/").concat(t, ".").concat(e, ".hspkg")), 
[ 4, new Promise(function(t, e) {
cc.assetManager.loadBundle(o, r, function(n, o) {
n ? e(n) : t(o);
});
}) ];

case 1:
return [ 2, {
bundle: a.sent(),
useCompressed: i
} ];
}
});
});
}) ];
});
});
}, o.prototype.onFeaturesRetained = function(t) {
var e, n;
this._ensureCacheLoaded();
try {
for (var o = l(t), r = o.next(); !r.done; r = o.next()) {
var i = r.value;
this._preloadCache[i] && (this._preloadCache[i].bundleDownloaded = !0);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
r && !r.done && (n = o.return) && n.call(o);
} finally {
if (e) throw e.error;
}
}
this._scheduleSave(!0);
}, o.prototype.doLoadFeature = function(t) {
return s(this, void 0, void 0, function() {
var e, n, o, r, i, a, s, l, c, d;
return u(this, function(u) {
switch (u.label) {
case 0:
return e = t.atomFeatureName, (n = this.getSessionFeatureVersion(e)) ? (o = (null !== (d = n.deps) && void 0 !== d ? d : []).map(function(t) {
return {
atomFeatureName: t
};
}), [ 4, this._loadBundleWithMeta(e, {
version: n.version,
deps: o
}) ]) : [ 3, 2 ];

case 1:
return r = u.sent(), i = r.version, a = r.deps, "target" === n.source && this.commitFeatureApplied(e, i, a.map(function(t) {
return t.atomFeatureName;
})), [ 2, a ];

case 2:
return [ 4, this._loadBundleWithMeta(e) ];

case 3:
return s = u.sent(), l = s.version, c = s.deps, this.commitFeatureApplied(e, l, c.map(function(t) {
return t.atomFeatureName;
})), [ 2, c ];
}
});
});
}, o.prototype._resolveBundleMeta = function(t) {
return s(this, void 0, void 0, function() {
var e, n, o, r, i;
return u(this, function(a) {
switch (a.label) {
case 0:
return (e = this._sessionMeta.get(t)) ? [ 2, e ] : (n = "atom_meta_".concat(t), 
(o = cc.sys.localStorage.getItem(n)) ? (r = JSON.parse(o), this._sessionMeta.set(t, r), 
this.universe.host.getNetworkState() && this._refreshMetaInBackground(t, n), [ 2, r ]) : [ 4, this._fetchBundleMeta(t, n) ]);

case 1:
return i = a.sent(), this._sessionMeta.set(t, i), [ 2, i ];
}
});
});
}, o.prototype._refreshMetaInBackground = function(t, e) {
var n = this;
this._fetchBundleMeta(t, e).then(function(e) {
return s(n, void 0, void 0, function() {
var n, o, r, i, a, s, c, d, h, p, f;
return u(this, function(u) {
switch (u.label) {
case 0:
n = this.loadVersionState(), void 0 === (null == (o = n[t]) ? void 0 : o.appliedVersion) || e.version === o.appliedVersion || this.hasLocalBundlePackage(t, e.version) || (this.enqueueStageTask({
featureName: t,
version: e.version,
deps: e.dependencies.map(function(t) {
return t.atomFeatureName;
})
}), this._kickStageWorker()), u.label = 1;

case 1:
u.trys.push([ 1, 8, 9, 10 ]), r = l(e.dependencies), i = r.next(), u.label = 2;

case 2:
if (i.done) return [ 3, 7 ];
a = i.value, u.label = 3;

case 3:
return u.trys.push([ 3, 5, , 6 ]), s = "atom_meta_".concat(a.atomFeatureName), [ 4, this._fetchBundleMeta(a.atomFeatureName, s) ];

case 4:
return c = u.sent(), (null == (d = this.loadVersionState()[a.atomFeatureName]) ? void 0 : d.appliedVersion) === c.version || this.hasLocalBundlePackage(a.atomFeatureName, c.version) || (this.enqueueStageTask({
featureName: a.atomFeatureName,
version: c.version,
deps: c.dependencies.map(function(t) {
return t.atomFeatureName;
})
}), this._kickStageWorker()), [ 3, 6 ];

case 5:
return u.sent(), [ 3, 6 ];

case 6:
return i = r.next(), [ 3, 2 ];

case 7:
return [ 3, 10 ];

case 8:
return h = u.sent(), p = {
error: h
}, [ 3, 10 ];

case 9:
try {
i && !i.done && (f = r.return) && f.call(r);
} finally {
if (p) throw p.error;
}
return [ 7 ];

case 10:
return [ 2 ];
}
});
});
}).catch(function() {});
}, o.prototype._fetchBundleMeta = function(t, e) {
return s(this, void 0, void 0, function() {
var n, o, r, i;
return u(this, function(a) {
switch (a.label) {
case 0:
return n = this._preRelease ? "bundleMetaPre.json" : "bundleMeta.json", o = "".concat(this.buildBundleUrl(t), "/").concat(n, "?t=").concat(Date.now()), 
[ 4, this._loadRemoteWithTimeout(o) ];

case 1:
return r = a.sent(), i = r.json, cc.sys.localStorage.setItem(e, JSON.stringify(i)), 
[ 2, i ];
}
});
});
}, o.prototype.getPlatformName = function() {
return "creator2";
}, o.prototype.getSystemName = function() {
if (cc.sys.isNative) {
if (cc.sys.os === cc.sys.OS_IOS) return "ios";
if (cc.sys.os === cc.sys.OS_ANDROID) return "android";
}
return "web-desktop";
}, o.prototype.doReleaseFeatureAssets = function(t) {
var e, n, o = this._bundles.get(t);
o && o.releaseAll();
var r = this._remoteAssetCache.get(t);
if (r) {
try {
for (var i = l(r.values()), a = i.next(); !a.done; a = i.next()) {
var s = a.value;
s instanceof cc.Asset && cc.assetManager.releaseAsset(s);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
a && !a.done && (n = i.return) && n.call(i);
} finally {
if (e) throw e.error;
}
}
this._remoteAssetCache.delete(t);
}
}, o.prototype.doRemoveFeatureBundle = function(t) {
var e = this._bundles.get(t);
e && (cc.assetManager.removeBundle(e), this._bundles.delete(t));
}, o.prototype.resolveFeatureManifest = function(t) {
return s(this, void 0, void 0, function() {
var e, n;
return u(this, function(o) {
switch (o.label) {
case 0:
return this._remoteBundleUrl ? [ 4, this._resolveBundleMeta(t) ] : [ 2, {
deps: []
} ];

case 1:
return [ 2, {
version: (e = o.sent()).version,
deps: (null !== (n = e.dependencies) && void 0 !== n ? n : []).map(function(t) {
return t.atomFeatureName;
})
} ];
}
});
});
}, o.prototype.hasLocalBundlePackage = function(t, e) {
var n;
this._ensureCacheLoaded();
var o = this._preloadCache[t];
if (void 0 === e || (null == o ? void 0 : o.version) === e) {
if (this._bundles.has(t)) return !0;
if (null == o ? void 0 : o.bundleDownloaded) return !0;
}
return void 0 !== e && (null === (n = this._ensureVersionStateLoaded()[t]) || void 0 === n ? void 0 : n.stagedVersion) === e;
}, o.prototype.stageFeaturePackage = function(t, e) {
return s(this, void 0, void 0, function() {
return u(this, function(n) {
switch (n.label) {
case 0:
if (!this.universe.host.getNetworkState()) throw new Error("[AtomEngine] 版本冻结 stage 跳过(离线): ".concat(t, " v").concat(null != e ? e : "unknown"));
return [ 4, this._loadBundleRaw(t, e, {
dontExecuteScript: !0
}) ];

case 1:
return n.sent(), [ 2 ];
}
});
});
}, o.prototype.loadVersionState = function() {
var t = cc.sys.localStorage.getItem(Kr);
return t ? JSON.parse(t) : {};
}, o.prototype.saveVersionState = function(t) {
cc.sys.localStorage.setItem(Kr, JSON.stringify(t));
}, o.prototype.loadAsset = function(t, e, n) {
return s(this, void 0, void 0, function() {
var o, r, i, a, s, l, c = this;
return u(this, function() {
return o = this.buildRemoteUrl(t, e), r = o.isRemote, i = o.resolvedPath, r ? [ 2, this._loadRemoteAsset(t, i, n) ] : (a = this._bundles.get(t)) ? (s = $r[n]) ? (l = a.get(e, s)) ? [ 2, l ] : [ 2, new Promise(function(o, r) {
a.load(e, s, function(i, a) {
i ? r(new Error("加载资源失败 [".concat(t, "/").concat(e, "]: ").concat(i.message))) : (c._markPreloaded(t, c._assetCacheKey(e, n)), 
o(a));
});
}) ] : [ 2, Promise.reject(new Error("不支持的资源类型: ".concat(n))) ] : [ 2, Promise.reject(new Error("特性未加载: ".concat(t))) ];
});
});
}, o.prototype._loadRemoteAsset = function(t, e, n) {
var o = this, r = "".concat(e, "_").concat(n), i = this._remoteAssetCache.get(t);
i || (i = new Map(), this._remoteAssetCache.set(t, i));
var a = i.get(r);
return void 0 !== a ? Promise.resolve(a) : this._loadRemoteWithTimeout(e).then(function(t) {
var e = o._normalizeRemoteAsset(t, n);
return i.set(r, e), e;
});
}, o.prototype._normalizeRemoteAsset = function(e, n) {
switch (n) {
case t.LoaderAssetType.Json:
return e;

case t.LoaderAssetType.SpriteFrame:
if (e instanceof cc.Texture2D) {
var o = new cc.SpriteFrame();
return o.setTexture(e), o;
}
return e;

default:
return e;
}
}, o.prototype.loadDir = function(t, e, n) {
return s(this, void 0, void 0, function() {
var o, r, i, a, l, c, d, h, p = this;
return u(this, function(f) {
switch (f.label) {
case 0:
return (o = this._bundles.get(t)) ? (r = o.getDirWithPath(e), i = "".concat(t, "/").concat(e), 
a = 0, l = r.length, c = function() {
return s(p, void 0, void 0, function() {
var t;
return u(this, function(e) {
switch (e.label) {
case 0:
t = function() {
var t;
return u(this, function(e) {
switch (e.label) {
case 0:
return (t = r[a++]) ? [ 4, new Promise(function(e, n) {
o.load(t.path, t.ctor, function(o) {
o ? n(new Error("加载资源失败 [".concat(i, "/").concat(t.path, "]: ").concat(o.message))) : e();
});
}) ] : [ 2, "continue" ];

case 1:
return e.sent(), [ 2 ];
}
});
}, e.label = 1;

case 1:
return a < l ? [ 5, t() ] : [ 3, 3 ];

case 2:
return e.sent(), [ 3, 1 ];

case 3:
return [ 2 ];
}
});
});
}, d = this._resolveConcurrency(n, 8), (h = 0 === d ? l : Math.min(d, l)) <= 0 ? [ 2 ] : [ 4, Promise.all(Array.from({
length: h
}, c)) ]) : [ 2, Promise.reject(new Error("特性未加载: ".concat(t))) ];

case 1:
return f.sent(), this._markPreloaded(t, this._dirCacheKey(e)), [ 2 ];
}
});
});
}, o.prototype.preloadAsset = function(t, e, n) {
return s(this, void 0, void 0, function() {
var o, r, i, a, s, l, c = this;
return u(this, function(u) {
switch (u.label) {
case 0:
return o = this.buildRemoteUrl(t, e), r = o.isRemote, i = o.resolvedPath, r ? [ 4, this._loadRemoteAsset(t, i, n) ] : [ 3, 2 ];

case 1:
return u.sent(), [ 2 ];

case 2:
if (a = this._assetCacheKey(e, n), this._isPreloaded(t, a)) return [ 2 ];
if (!(s = $r[n])) throw new Error("不支持的资源类型: ".concat(n));
return [ 4, this._loadBundleWithMeta(t) ];

case 3:
return l = u.sent().bundle, [ 2, new Promise(function(n, o) {
l.preload(e, s, function(r) {
r ? o(new Error("预加载资源失败 [".concat(t, "/").concat(e, "]: ").concat(r.message))) : (c._markPreloaded(t, a), 
n());
});
}) ];
}
});
});
}, o.prototype.preloadDir = function(t, e, n) {
return s(this, void 0, void 0, function() {
var o, r, i, a, s;
return u(this, function(u) {
switch (u.label) {
case 0:
return o = this._dirCacheKey(e), this._isPreloaded(t, o) ? [ 2 ] : [ 4, this._loadBundleWithMeta(t) ];

case 1:
return r = u.sent().bundle, i = "".concat(t, "/").concat(e), 0 !== (a = this._resolveConcurrency(n, -4)) ? [ 3, 3 ] : [ 4, this._preloadDirNative(r, e, i) ];

case 2:
return u.sent(), [ 3, 5 ];

case 3:
return s = r.getDirWithPath(e), [ 4, this._preloadWithConcurrency(r, s, a, i) ];

case 4:
u.sent(), u.label = 5;

case 5:
return this._markPreloaded(t, o), [ 2 ];
}
});
});
}, o.prototype._resolveConcurrency = function(t, e) {
var n = null != t ? t : e;
return 0 === n ? 0 : n > 0 ? n : this.universe.host.isLowEndDevice() ? -n : 0;
}, o.prototype._preloadDirNative = function(t, e, n) {
return new Promise(function(o, r) {
t.preloadDir(e, function(t) {
t ? r(new Error("预加载目录失败 [".concat(n, "]: ").concat(t.message))) : o();
});
});
}, o.prototype._preloadWithConcurrency = function(t, e, n, o) {
return s(this, void 0, void 0, function() {
var r, i, a, l = this;
return u(this, function(c) {
switch (c.label) {
case 0:
return r = 0, i = e.length, a = function() {
return s(l, void 0, void 0, function() {
var n;
return u(this, function(a) {
switch (a.label) {
case 0:
n = function() {
var n;
return u(this, function(i) {
switch (i.label) {
case 0:
return n = e[r++], [ 4, new Promise(function(e, r) {
t.preload(n.path, n.ctor, function(t) {
t ? r(new Error("预加载失败 [".concat(o, "/").concat(n.path, "]: ").concat(t.message))) : e();
});
}) ];

case 1:
return i.sent(), [ 2 ];
}
});
}, a.label = 1;

case 1:
return r < i ? [ 5, n() ] : [ 3, 3 ];

case 2:
return a.sent(), [ 3, 1 ];

case 3:
return [ 2 ];
}
});
});
}, [ 4, Promise.all(Array.from({
length: n
}, a)) ];

case 1:
return c.sent(), [ 2 ];
}
});
});
}, o;
}(Jn), ei = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.playEffect = function(t, e, n) {
if (!t) return -1;
var o = cc.audioEngine.playEffect(t, n);
return cc.audioEngine.setVolume(o, e), o;
}, e.prototype.stopEffect = function(t) {
t >= 0 && cc.audioEngine.stopEffect(t);
}, e.prototype.setEffectsVolume = function(t) {
cc.audioEngine.setEffectsVolume(t);
}, e.prototype.stopAllEffects = function() {
cc.audioEngine.stopAllEffects();
}, e.prototype.playMusic = function(t, e, n) {
t && (cc.audioEngine.playMusic(t, e), cc.audioEngine.setMusicVolume(n));
}, e.prototype.stopMusic = function() {
cc.audioEngine.stopMusic();
}, e.prototype.pauseMusic = function() {
cc.audioEngine.pauseMusic();
}, e.prototype.resumeMusic = function() {
cc.audioEngine.resumeMusic();
}, e.prototype.setMusicVolume = function(t) {
cc.audioEngine.setMusicVolume(t);
}, e;
}(function() {}), ni = function(e) {
function o() {
return null !== e && e.apply(this, arguments) || this;
}
return n(o, e), o.prototype.tryGetNativeModule = function(t) {
var e = window.jsb;
if (!(null == e ? void 0 : e.getNativeModule)) return null;
var n = e.getNativeModule(t);
return n && 0 !== Object.keys(n).length ? n : null;
}, o.prototype.loadWasmBinary = function(e) {
return s(this, void 0, void 0, function() {
return u(this, function(n) {
switch (n.label) {
case 0:
return [ 4, this.universe.asset.loadAsset(e.featureName, e.path, t.LoaderAssetType.Buffer) ];

case 1:
return [ 2, n.sent()._buffer ];
}
});
});
}, o;
}(function() {
function t(t) {
this.universe = t, this._modules = new Map();
}
return t.prototype.getModule = function(t) {
return s(this, void 0, void 0, function() {
var e, n, o, r, i;
return u(this, function(a) {
switch (a.label) {
case 0:
return (e = this._modules.get(t.moduleName)) ? [ 2, e ] : (n = this.tryGetNativeModule(t.moduleName)) ? (this._modules.set(t.moduleName, n), 
[ 2, n ]) : [ 4, this.loadWasmBinary(t) ];

case 1:
if (o = a.sent(), !t.emscriptenInit) return [ 3, 6 ];
a.label = 2;

case 2:
return a.trys.push([ 2, 4, , 5 ]), [ 4, t.emscriptenInit({
wasmBinary: o
}) ];

case 3:
return r = a.sent(), [ 3, 5 ];

case 4:
return a.sent(), r = {}, [ 3, 5 ];

case 5:
return [ 3, 9 ];

case 6:
return a.trys.push([ 6, 8, , 9 ]), [ 4, WebAssembly.instantiate(o) ];

case 7:
return i = a.sent(), r = i.instance.exports, [ 3, 9 ];

case 8:
return a.sent(), r = {}, [ 3, 9 ];

case 9:
return this._modules.set(t.moduleName, r), [ 2, r ];
}
});
});
}, t;
}()), oi = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.restartApplication = function() {
cc.sys.isBrowser ? location.reload() : cc.game.restart();
}, e;
}(function() {});
function ri(t) {
return Boolean(t) && t.ready && !t.isPaused;
}
var ii = function() {
function t(t) {
this.storageDataStore = new Map(), this.configDataStore = new Map(), this._worlds = new Map(), 
this._mainWorld = null, this._worldInstanceMaps = new Map(), this._worldLogicSubscribers = new Map(), 
this._worldRootNodes = new Map(), this.fieldWatchers = new Map(), this._onReady = null, 
this._onLoadProgress = null, this._onLoadError = null, this.disableSaveStorage = !1;
var e = t.mainWorldId, n = t.universeFeatureList, o = t.remoteBundleUrl, r = t.remoteAssetUrl, i = t.preRelease, a = t.onReady, s = t.host, u = t.initialWidth, l = void 0 === u ? 0 : u, c = t.initialHeight, d = void 0 === c ? 0 : c, h = t.onLoadProgress, p = t.onLoadError, f = t.layerMapping, m = e;
this.layerMapping = new ro(f), this._onReady = a, this._onLoadProgress = null != h ? h : null, 
this._onLoadError = null != p ? p : null, this.featureResolver = new v(n), this.render = new Qr(this), 
this.storage = new Jr(), this.asset = new ti(this), this.audio = new ei(), this.native = new ni(this), 
this.runtime = new oi(), this.host = s, this.host.universe = this, o && this.asset.setRemoteBundleUrl(o), 
r && this.asset.setRemoteAssetUrl(r), i && this.asset.setPreRelease(i), this._createMainWorld(m, l, d);
}
return t.create = function(e) {
return new t(e);
}, t.prototype.forEachWorld = function(t) {
var e, n;
try {
for (var o = l(this._worlds.values()), r = o.next(); !r.done; r = o.next()) t(r.value);
} catch (t) {
e = {
error: t
};
} finally {
try {
r && !r.done && (n = o.return) && n.call(o);
} finally {
if (e) throw e.error;
}
}
}, t.prototype._createMainWorld = function(t, e, n) {
var o, r, i = this;
this._mainWorld = this._createWorld({
worldId: t,
worldPath: t,
randomSeed: 0,
parentWorld: null,
entityInParent: 0,
initialWidth: e,
initialHeight: n,
multiTouch: !1,
onLoadProgress: null !== (o = this._onLoadProgress) && void 0 !== o ? o : void 0,
onLoadError: null !== (r = this._onLoadError) && void 0 !== r ? r : void 0
}, function() {
var t;
i.host.setMainWorld(i._mainWorld), null === (t = i._onReady) || void 0 === t || t.call(i);
});
}, t.prototype._getInputAtomInWorld = function(t, e) {
var n = this._worlds.get(t);
if (ri(n)) return n.getAtomIns(e);
}, t.prototype.handlePointerEvent = function(t) {
var e = this._getInputAtomInWorld(t.worldId, Je);
if (e) {
var n = e.data;
n.x = t.x, n.y = t.y, n.dx = t.dx, n.dy = t.dy, n.touchId = t.touchId, n.localX = t.localX, 
n.localY = t.localY, n.multiTouchs = t.multiTouchs, e.emit(t.eid);
}
}, t.prototype.handleScrollEvent = function(t) {
var e = this._getInputAtomInWorld(t.worldId, $e);
if (e) {
var n = e.data;
n.contentX = t.contentX, n.contentY = t.contentY, e.emit(t.eid);
}
}, t.prototype.handleSizeInputEvent = function(t) {
var e = this._getInputAtomInWorld(t.worldId, tn);
if (e) {
var n = e.data;
n.width = t.width, n.height = t.height, e.emit(t.eid);
}
}, t.prototype.handlePositionInputEvent = function(t) {
var e = this._getInputAtomInWorld(t.worldId, en);
if (e) {
var n = e.data;
n.x = t.x, n.y = t.y, e.emit(t.eid);
}
}, t.prototype.handleRichTextClickEvent = function(t) {
var e = this._getInputAtomInWorld(t.worldId, wn);
e && (e.data.param = t.param);
}, t.prototype.handleEditBoxEvent = function(t) {
var e = this._getInputAtomInWorld(t.worldId, nn);
e && (e.data.text = t.text, e.emit(t.eid));
}, t.prototype.handleSpineFrameEvent = function(t) {
var e = this._getInputAtomInWorld(t.worldId, on);
e && (e.data.frameEventName = t.frameEventName, e.emit(t.eid));
}, t.prototype.handleKeyboardEvent = function(t, e) {
var n, o;
try {
for (var r = l(this._worlds.values()), i = r.next(); !i.done; i = r.next()) {
var a = i.value;
if (ri(a)) {
var s = a.getAtomIns(Ze), u = s.data;
u.keyCode = t, u.isDown = e, s.emit();
}
}
} catch (t) {
n = {
error: t
};
} finally {
try {
i && !i.done && (o = r.return) && o.call(r);
} finally {
if (n) throw n.error;
}
}
}, t.prototype.handleWindowResize = function(t, e) {
var n = this._mainWorld;
if (null == n ? void 0 : n.ready) {
var o = n.getAtomIns(Ke), r = o.data.width, i = o.data.height;
r === t && i === e || (o.data.width = t, o.data.height = e, o.emit());
}
}, t.prototype.createRootNode = function(t, e) {
return this._rootNode = this.render.createRootNode(t, e), this._worldRootNodes.set(this._mainWorld.config.worldId, this._rootNode), 
this._rootNode;
}, t.prototype.onFieldWrite = function(t, e, n) {
var o, r, i, a, s = "".concat(t, ":").concat(e.join(".")), u = this.fieldWatchers.get(s);
if (u) try {
for (var c = l(u), d = c.next(); !d.done; d = c.next()) {
var h = d.value, p = h.instance;
if ((void 0 === n || p.eid === n) && !(A = p.renderAtom.atomWorld).disposed) {
var f = p._dirtyPreciseOps;
if (f) {
var m = p.renderAtom.atomName, y = 0 === f.size;
if (!y) {
var v = A.dirtyEntityComponents.get(p.eid);
y = !(null == v ? void 0 : v.has(m));
}
y && A.markEntityComponentDirty(p.eid, m), f.add(h.opIndex);
}
}
}
} catch (t) {
o = {
error: t
};
} finally {
try {
d && !d.done && (r = c.return) && r.call(c);
} finally {
if (o) throw o.error;
}
}
if ("storage" === e[0]) try {
for (var _ = l(this._worlds.values()), g = _.next(); !g.done; g = _.next()) {
var A;
!(A = g.value).disposed && A.hasAtomIns(t) && A.markStorageDirty(t);
}
} catch (t) {
i = {
error: t
};
} finally {
try {
g && !g.done && (a = _.return) && a.call(_);
} finally {
if (i) throw i.error;
}
}
}, t.prototype.update = function(t) {
var e, n;
try {
for (var o = l(this._worlds.values()), r = o.next(); !r.done; r = o.next()) {
var i = r.value;
if (i.ready && !i.disposed) {
var a = In(i);
i.isPaused || i.worldUpdate(t), this._rootNode && (this._processWorldChanges(i), 
this._syncWorldRenderData(i)), a && !a.disposed ? In(a) : Dn(i);
}
}
} catch (t) {
e = {
error: t
};
} finally {
try {
r && !r.done && (n = o.return) && n.call(o);
} finally {
if (e) throw e.error;
}
}
}, t.prototype.switchInstanceEid = function(t, e) {
var n, o;
if (t.eid !== e) {
t.eid = e;
try {
for (var r = l(t.nodes), i = r.next(); !i.done; i = r.next()) i.value.eid = e;
} catch (t) {
n = {
error: t
};
} finally {
try {
i && !i.done && (o = r.return) && o.call(r);
} finally {
if (n) throw n.error;
}
}
t.renderAtom.refreshInstance(t, e);
}
}, t.prototype._createWorld = function(t, e) {
var n = new zn(this), o = t.worldId;
return n.initFromConfig(t), this._worldInstanceMaps.set(o, {}), this._worldLogicSubscribers.set(o, new Map()), 
this._worlds.set(o, n), n.registerFeatures(e), n;
}, t.prototype._processWorldChanges = function(t) {
var e, n, o = t.worldChanges;
if (0 !== o.length) {
var r = this._worldInstanceMaps.get(t.config.worldId);
try {
for (var i = l(o), a = i.next(); !a.done; a = i.next()) {
var s = a.value;
switch (s.type) {
case Ye.RenderCreate:
this._createRenderInstance(t, r, s.eid, s.domainName);
break;

case Ye.RenderDestroy:
this._destroyRenderInstance(t, r, s.eid);
break;

case Ye.RelationAdd:
s.relationName === mn && this._addChild(t, r, s.source, s.target);
break;

case Ye.RelationRemove:
if (s.relationName === mn) {
var u = t.getAtomIns(mn);
Mt(t.ecsWorld, s.target) && u.getParent(s.target) || u.mountSlots.delete(s.target), 
this._removeChild(r, s.target);
}
break;

case Ye.WorldCreate:
this._worldCreate(t, s.eid);
break;

case Ye.WorldDestroy:
this._worldDestroy(t, s.eid);
break;

case Ye.WorldRestart:
this._worldRestart(t, s.eid);
}
}
} catch (t) {
e = {
error: t
};
} finally {
try {
a && !a.done && (n = i.return) && n.call(i);
} finally {
if (e) throw e.error;
}
}
o.length = 0;
}
}, t.prototype._getRootWindowSize = function(t) {
for (var e = t; e.config.parentWorld; ) e = e.config.parentWorld;
if (e.disposed || !e.hasAtomIns(Ke)) return {
width: 0,
height: 0
};
var n = e.getAtomIns(Ke);
return {
width: n.data.width,
height: n.data.height
};
}, t.prototype._worldCreate = function(t, e) {
var n = this, o = t.getAtomIns(Xe), r = 0 === o.box.width[e] && 0 === o.box.height[e], i = this._getRootWindowSize(t);
r && (o.box.width.set(e, i.width), o.box.height.set(e, i.height));
var a = t.resolveChildWorldConfig(e);
if (a) {
var s = this._worldInstanceMaps.get(t.config.worldId);
if ((null == s ? void 0 : s[e]) && (this._worldRootNodes.set(a.worldId, s[e].rootNode), 
r)) {
var u = s[e];
u.renderAtom.refreshInstance(u, e);
}
var l = this._createWorld(a, function() {
var e = n._getRootWindowSize(t), o = l.getAtomIns(Ke);
o.data.width = e.width, o.data.height = e.height, o.emit(l.rootEid);
});
l.autoResizeBox = r, t.addChildWorld(e, l);
}
}, t.prototype.onContextRestore = function() {
var t, e;
try {
for (var n = l(this._worldInstanceMaps.values()), o = n.next(); !o.done; o = n.next()) {
var r = o.value;
for (var i in r) {
var a = r[i];
a && a.renderAtom.onContextRestore(a);
}
}
} catch (e) {
t = {
error: e
};
} finally {
try {
o && !o.done && (e = n.return) && e.call(n);
} finally {
if (t) throw t.error;
}
}
}, t.prototype.destroyWorldRender = function(t) {
var e = t.config.worldId, n = this._worldInstanceMaps.get(e);
if (n) for (var o in n) {
var r = n[Number(o)];
r && r.renderAtom.destroyRender(r);
}
this._worldInstanceMaps.delete(e), this._worldLogicSubscribers.delete(e), this._worldRootNodes.delete(e);
}, t.prototype._worldDestroy = function(t, e) {
var n = t.getChildWorld(e);
n && (this._destroyWorldTree(n), t.removeChildWorld(e));
}, t.prototype._destroyWorldTree = function(t) {
var e, n, o = [];
t.forEachChildWorld(function(t, e) {
o.push(e);
});
try {
for (var r = l(o), i = r.next(); !i.done; i = r.next()) {
var a = i.value, s = t.getChildWorld(a);
s && this._destroyWorldTree(s);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
i && !i.done && (n = r.return) && n.call(r);
} finally {
if (e) throw e.error;
}
}
this._unmountChildWorldRoot(t), t.dispose(), this._worlds.delete(t.config.worldId);
}, t.prototype._worldRestart = function(t, e) {
var n = this, o = t.getChildWorld(e);
if (o && o.ready) {
var r = o.config.worldId, i = t.resolveChildWorldConfig(e);
if (i) {
o.isPaused = !0;
var a = o.autoResizeBox;
o.config.parentWorld && this.render.setMultiTouch(o.prevMultiTouch);
var s = this._worldInstanceMaps.get(r), u = new Map(this.featureResolver.getFeatureSet(r));
this._worlds.delete(r), this._worldInstanceMaps.delete(r), this._worldLogicSubscribers.delete(r);
var c = this._createWorld(i, function() {
var e, r, i = [];
o.forEachChildWorld(function(t, e) {
i.push(e);
});
try {
for (var a = l(i), d = a.next(); !d.done; d = a.next()) {
var h = d.value, p = o.getChildWorld(h);
p && n._destroyWorldTree(p);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
d && !d.done && (r = a.return) && r.call(a);
} finally {
if (e) throw e.error;
}
}
if (s) for (var f in s) {
var m = s[Number(f)];
m && m.renderAtom.destroyRender(m);
}
u.size > 0 && n.asset.releaseFeatures(u), n.host.clearAdRequestWorld(o), o.universe = null, 
o.dispose();
var y = n._getRootWindowSize(t), v = c.getAtomIns(Ke);
v.data.width = y.width, v.data.height = y.height, v.emit(c.rootEid);
});
c.autoResizeBox = a, t.removeChildWorld(e), t.addChildWorld(e, c);
}
}
}, t.prototype.restartWorld = function(t) {
var e = this._worlds.get(t);
if (e) {
var n = e.config.parentWorld;
n && n.markWorldRestart(e.config.entityInParent);
}
}, t.prototype._unmountChildWorldRoot = function(t) {
var e = this._worldInstanceMaps.get(t.config.worldId), n = null == e ? void 0 : e[t.rootEid];
n && n.rootNode.removeFromParent();
}, t.prototype._createRenderInstance = function(t, e, n, o) {
var r, i;
if (e[n]) ; else {
var a = t.getAtomIns(o).renderVariantChain;
if (a) {
var s = a.resolve();
if (s) {
var u = s.createRender(this.render, n), c = this._worldLogicSubscribers.get(t.config.worldId);
try {
for (var d = l(s.getLogicDependencies()), h = d.next(); !h.done; h = d.next()) {
var p = h.value, f = c.get(p);
f || (f = new Set(), c.set(p, f)), f.add(n);
}
} catch (t) {
r = {
error: t
};
} finally {
try {
h && !h.done && (i = d.return) && i.call(d);
} finally {
if (r) throw r.error;
}
}
e[n] = u;
} else re(Et.DomainRenderNoMatch, {
domain: o
});
} else re(Et.DomainRenderNotRegistered, {
domain: o
});
}
}, t.prototype._destroyRenderInstance = function(t, e, n) {
var o, r, i = e[n];
if (i) {
var a = this._worldLogicSubscribers.get(t.config.worldId);
try {
for (var s = l(i.renderAtom.getLogicDependencies()), u = s.next(); !u.done; u = s.next()) {
var c = u.value, d = a.get(c);
d && d.delete(n);
}
} catch (t) {
o = {
error: t
};
} finally {
try {
u && !u.done && (r = s.return) && r.call(s);
} finally {
if (o) throw o.error;
}
}
i.renderAtom.destroyRender(i), delete e[n];
}
}, t.prototype._addChild = function(t, e, n, o) {
var r = e[o];
if (r) {
var i = t.getAtomIns(mn).mountSlots.get(o);
if (i) {
var a = e[n];
if (a) {
var s = a.renderAtom.getSlotNode(a, i);
if (s) return void this._addChildWithDiagnostics(t, e, n, o, s, r, i);
}
}
var u = this._getParentNode(t, e, n);
this._addChildWithDiagnostics(t, e, n, o, u, r, i);
}
}, t.prototype._addChildWithDiagnostics = function(t, e, n, o, r, i, a) {
try {
r.addChild(i.rootNode);
} catch (h) {
var s = t.getAtomIns(mn), u = t.getAtomIns(gn), l = s.getParent(o), c = e[n], d = [ "[AtomEngine] addChild failed while syncing ChildOf relation", "worldId=".concat(t.config.worldId), "changeParentEid=".concat(String(n)), "changeChildEid=".concat(String(o)), "currentRelationParent=".concat(String(l)), "relationMatchesChange=".concat(l === n), "slotName=".concat(null != a ? a : "undefined"), "parentDomain=".concat(String(u.atomState.name[n])), "childDomain=".concat(String(u.atomState.name[o])), "pendingChildOfChanges=".concat(this._describePendingChildOfChanges(t, o)), "parentInstance=".concat(c ? "yes" : "no"), "childInstanceEid=".concat(String(i.eid)), "targetParentNode=".concat(this._describeRenderNode(r)), "childRootNode=".concat(this._describeRenderNode(i.rootNode)), "childNativeParent=".concat(this._describeNativeParent(i.rootNode)) ].join(" | ");
if (h instanceof Error) throw h.message = "".concat(d, "   >>>   original=").concat(h.message), 
h;
throw new Error("".concat(d, "   >>>   original=").concat(String(h)));
}
}, t.prototype._describePendingChildOfChanges = function(t, e) {
var n, o, r = [];
try {
for (var i = l(t.worldChanges), a = i.next(); !a.done; a = i.next()) {
var s = a.value;
s.type !== Ye.RelationAdd && s.type !== Ye.RelationRemove || s.relationName !== mn || s.target !== e || r.push("".concat(Ye[s.type], ":").concat(String(s.source), "->").concat(String(s.target)));
}
} catch (t) {
n = {
error: t
};
} finally {
try {
a && !a.done && (o = i.return) && o.call(i);
} finally {
if (n) throw n.error;
}
}
return r.length > 0 ? r.join(",") : "none";
}, t.prototype._describeRenderNode = function(t) {
if (!t) return "undefined";
var e = t.nativeNode, n = t.getName(), o = null == e ? void 0 : e.name;
return o ? "".concat(n, "(native=").concat(o, ")") : n;
}, t.prototype._describeNativeParent = function(t) {
var e, n, o = t.nativeNode;
return null !== (n = null === (e = null == o ? void 0 : o.parent) || void 0 === e ? void 0 : e.name) && void 0 !== n ? n : "undefined";
}, t.prototype._removeChild = function(t, e) {
var n = t[e];
n && n.rootNode.removeFromParent();
}, t.prototype._getParentNode = function(t, e, n) {
var o, r = e[n];
return r ? r.rootNode : null !== (o = this._worldRootNodes.get(t.config.worldId)) && void 0 !== o ? o : this._rootNode;
}, t.prototype.getSlotData = function(t, e, n) {
var o, r, i = this._worldInstanceMaps.get(t), a = null == i ? void 0 : i[e];
if (a) r = a.renderAtom; else {
var s = this._worlds.get(t);
if (!s) return;
var u = s.getAtomIns(gn).atomState.name[e];
if (!u) return;
if (!(r = null === (o = s.getAtomIns(u).renderVariantChain) || void 0 === o ? void 0 : o.resolve())) return;
}
var l = r.findSlotPath(n);
if (l) return {
path: l,
propsMap: r.atomState
};
}, t.prototype._syncWorldRenderData = function(t) {
var e, n, o = this._worldInstanceMaps.get(t.config.worldId), r = this._worldLogicSubscribers.get(t.config.worldId), i = t.updateSignal.data.framecount;
this._syncChildWorldBoxFromWindowSize(t, o, i);
var a = t.expandEntityDirtyAtoms(r);
try {
for (var s = l(a), u = s.next(); !u.done; u = s.next()) {
var d = c(u.value, 2), h = d[0], p = d[1], f = o[h];
f && f._lastRefreshFrame !== i && (f._lastRefreshFrame = i, f.renderAtom.refreshInstance(f, h), 
p.has(vn) && this._syncChildWorldWindowSize(t, h));
}
} catch (t) {
e = {
error: t
};
} finally {
try {
u && !u.done && (n = s.return) && n.call(s);
} finally {
if (e) throw e.error;
}
}
t.dirtyEntityComponents.clear(), t.expandedEntityDirtyAtomsCache = null;
}, t.prototype._syncChildWorldBoxFromWindowSize = function(t, e, n) {
var o = this._getRootWindowSize(t), r = o.width, i = o.height, a = t.getAtomIns(Xe);
t.forEachChildWorld(function(t, o) {
if (t.ready) {
var s = a.box.width[o], u = a.box.height[o], l = t.getAtomIns(Ke);
if (l.data.width === r && l.data.height === i || (l.data.width = r, l.data.height = i, 
l.emit(t.rootEid)), (s !== r || u !== i) && t.autoResizeBox) {
a.box.width.set(o, r), a.box.height.set(o, i);
var c = null == e ? void 0 : e[o];
c && c._lastRefreshFrame !== n && (c._lastRefreshFrame = n, c.renderAtom.refreshInstance(c, o));
}
}
});
}, t.prototype._syncChildWorldWindowSize = function(t, e) {
var n = t.getChildWorld(e);
if (null == n ? void 0 : n.ready) {
var o = t.getAtomIns(Xe), r = o.box.width[e], i = o.box.height[e], a = this._getRootWindowSize(t);
r === a.width && i === a.height || n.autoResizeBox && (n.autoResizeBox = !1);
}
}, t.prototype.saveAllStorage = function(t) {
var e, n;
if (!this.disableSaveStorage) try {
for (var o = l(t), r = o.next(); !r.done; r = o.next()) {
var i = r.value, a = this.storageDataStore.get(i);
void 0 !== a && this.storage.saveStorage(i, a);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
r && !r.done && (n = o.return) && n.call(o);
} finally {
if (e) throw e.error;
}
}
}, t.prototype.forceSaveAllStorage = function() {
this.storageDataStore.size > 0 && this.saveAllStorage(new Set(this.storageDataStore.keys()));
}, t.prototype.broadcastWorldInput = function(t) {
var e, n, o = t.atomWorld, r = t.atomName, i = JSON.stringify(t.atomState);
try {
for (var a = l(this._worlds.values()), s = a.next(); !s.done; s = a.next()) {
var u = s.value;
u !== o && u.ready && u.hasAtomIns(r) && u.getAtomIns(r).receive(JSON.parse(i));
}
} catch (t) {
e = {
error: t
};
} finally {
try {
s && !s.done && (n = a.return) && n.call(a);
} finally {
if (e) throw e.error;
}
}
}, t.prototype.sendToParentWorldInput = function(t) {
var e = t.atomWorld, n = e.config.parentWorld;
if (n) {
var o = t.atomName;
if (n.hasAtomIns(o)) {
var r = JSON.parse(JSON.stringify(t.atomState));
n.getAtomIns(o).receive(r, e.config.entityInParent);
}
}
}, t.prototype.emitInputToAllWorlds = function(t, e) {
var n, o;
try {
for (var r = l(this._worlds.values()), i = r.next(); !i.done; i = r.next()) {
var a = i.value;
if (a.ready && !a.disposed) if (a.isPaused) ; else if (a.hasAtomIns(t)) {
var s = a.getAtomIns(t);
Object.assign(s.data, e), s.emit();
}
}
} catch (t) {
n = {
error: t
};
} finally {
try {
i && !i.done && (o = r.return) && o.call(r);
} finally {
if (n) throw n.error;
}
}
}, t.prototype.dispose = function() {
var t, e, n, o, r, i;
try {
this.forceSaveAllStorage(), this.audio.stopAllEffects(), this.audio.stopMusic();
var a = [];
try {
for (var s = l(this._worlds.values()), u = s.next(); !u.done; u = s.next()) {
var h = u.value;
a.push(h);
}
} catch (e) {
t = {
error: e
};
} finally {
try {
u && !u.done && (e = s.return) && e.call(s);
} finally {
if (t) throw t.error;
}
}
var p = function(t) {
for (var e = 0, n = t.config.parentWorld; n; ) e++, n = n.config.parentWorld;
return e;
};
a.sort(function(t, e) {
return p(e) - p(t);
}), this.asset.forceReleaseAll();
try {
for (var f = l(a), m = f.next(); !m.done; m = f.next()) {
var y = (h = m.value).config.worldId, v = this._worldInstanceMaps.get(y);
if (v) for (var _ in v) {
var g = v[Number(_)];
g && g.renderAtom.destroyRender(g);
}
h.dispose();
}
} catch (t) {
n = {
error: t
};
} finally {
try {
m && !m.done && (o = f.return) && o.call(f);
} finally {
if (n) throw n.error;
}
}
this._rootNode && (this.render.destroyRootNode(), this._rootNode = null), this._worlds.clear(), 
this._mainWorld = null, this._worldInstanceMaps.clear(), this._worldLogicSubscribers.clear(), 
this._worldRootNodes.clear(), this.fieldWatchers.clear(), this.storageDataStore.clear(), 
this.configDataStore.clear(), this._onReady = null;
} catch (t) {
var A = d([], c(this._worlds.keys()), !1), C = null !== (i = null === (r = this._mainWorld) || void 0 === r ? void 0 : r.config.worldId) && void 0 !== i ? i : "cleared", R = d([], c(this._worldInstanceMaps.entries()), !1).map(function(t) {
var e = c(t, 2), n = e[0], o = e[1];
return "".concat(n, ":").concat(Object.keys(o).length);
}).join(",");
"remainingWorlds=[".concat(A.join(","), "], mainWorld=").concat(C, ", rootNodeAlive=").concat(Boolean(this._rootNode), ", renderInstances={").concat(R, "}");
}
}, t;
}();
function ai(t, e) {
var n, o, r = {};
try {
for (var i = l(Object.keys(e)), a = i.next(); !a.done; a = i.next()) {
var s = a.value, u = [];
Object.defineProperty(u, "set", {
value: function(t, e) {
this[t] = e;
},
writable: !0,
enumerable: !1,
configurable: !0
}), r[s] = u;
}
} catch (t) {
n = {
error: t
};
} finally {
try {
a && !a.done && (o = i.return) && o.call(i);
} finally {
if (n) throw n.error;
}
}
return Ct(t, r), r;
}
function si(t, e, n, o) {
for (var r in o) {
var i = o[r];
n[r][e] = Array.isArray(i) || i instanceof Uint8Array ? i.slice() : i;
}
bt(t, e, n);
}
var ui = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), Object.defineProperty(e, "atomType", {
get: function() {
return "EntityComponentAtom";
},
enumerable: !1,
configurable: !0
}), e.prototype.onReady = function() {
return s(this, void 0, void 0, function() {
return u(this, function() {
return this.defaultValues = this.defineComponent(), this.atomState = function(t, e) {
var n, o, r = {};
try {
for (var i = l(Object.keys(e)), a = i.next(); !a.done; a = i.next()) {
var s = a.value, u = [];
Object.defineProperty(u, "set", {
value: function(t, e) {
this[t] = e;
},
writable: !0,
enumerable: !1,
configurable: !0
}), r[s] = u;
}
} catch (t) {
n = {
error: t
};
} finally {
try {
a && !a.done && (o = i.return) && o.call(i);
} finally {
if (n) throw n.error;
}
}
return Ct(t, r), r;
}(this.atomWorld.ecsWorld, this.defaultValues), this.atomWorld.atomSnapshots[this.atomName] = this.atomState, 
[ 2 ];
});
});
}, e[_e] = !0, e;
}(ge), li = function(t) {
function e() {
var e = t.apply(this, d([], c(arguments), !1)) || this;
return e._tagComponent = null, e._tagQuery = null, e._componentQuery = null, e._componentQueryTerms = null, 
e._allComponentAtoms = null, e._domainOf = null, e.renderVariantChain = null, e;
}
return n(e, t), Object.defineProperty(e, "atomType", {
get: function() {
return "EntityDomainAtom";
},
enumerable: !1,
configurable: !0
}), e.prototype._createStructure = function() {
if (this._domainOf = this.atomWorld.getAtomIns(gn).atomState, this._tagComponent = {}, 
Ct(this.atomWorld.ecsWorld, this._tagComponent), this._tagQuery = ht(this.atomWorld.ecsWorld, [ this._tagComponent ]), 
this._allComponentAtoms = [], this._collectAllComponentAtoms(this._allComponentAtoms, new Set()), 
this._allComponentAtoms.length > 0) {
var t = this._allComponentAtoms.map(function(t) {
return t.atomState;
});
this._componentQueryTerms = t, this._componentQuery = ht(this.atomWorld.ecsWorld, t);
} else this._componentQuery = this._tagQuery;
this.atomState = this._tagComponent;
}, e.prototype.onReady = function() {
return s(this, void 0, void 0, function() {
return u(this, function() {
return this._createStructure(), [ 2 ];
});
});
}, e.prototype.dispose = function() {
var e = this._componentQuery === this._tagQuery;
this._tagQuery && (At(this.atomWorld.ecsWorld, [ this._tagComponent ]), this._tagQuery = null), 
this._componentQuery && !e && At(this.atomWorld.ecsWorld, this._componentQueryTerms), 
this._componentQuery = null, this._tagComponent = null, this._allComponentAtoms = null, 
this._componentQueryTerms = null, t.prototype.dispose.call(this);
}, e.prototype.create = function() {
var t = this.atomWorld, e = function(t) {
var e = t[C], n = function(t) {
if (t.aliveCount < t.dense.length) {
var e = t.dense[t.aliveCount], n = e;
return t.sparse[n] = t.aliveCount, t.aliveCount++, e;
}
var o = ++t.maxId;
return t.dense.push(o), t.sparse[o] = t.aliveCount, t.aliveCount++, o;
}(e.entityIndex);
return e.notQueries.forEach(function(e) {
mt(t, e, n) && yt(e, n);
}), e.entityComponents.set(n, new Set()), n;
}(t.ecsWorld);
return this._domainOf.name[e] = this.atomName, this._applyToEntity(e), this.renderVariantChain && t.markRenderCreate(e, this.atomName), 
this.atomName === Xe && t.markWorldCreate(e), e;
}, e.prototype.destroy = function(t) {
var e = this.atomWorld;
this.has(t) || re(Et.EntityDestroyDenied, {
entity: String(t),
owner: this._domainOf.name[t] || "unknown"
});
var n = this._domainOf.name[t], o = e.getAtomIns(n);
It(e.ecsWorld, t), o.renderVariantChain && e.markRenderDestroy(t), n === Xe && e.markWorldDestroy(t);
}, e.prototype.collect = function() {
var t, e;
return this.atomWorld.isSignalEntityDomain(this.atomName) && re(Et.WarnSignalDomainCollect, {
domain: this.atomName,
source: null !== (t = this.atomWorld.currentExecutingLogicAtom) && void 0 !== t ? t : "unknown",
method: "collect",
signalDomain: null !== (e = this.atomWorld.currentSignalEntityDomain) && void 0 !== e ? e : "unknown"
}), _t(this.atomWorld.ecsWorld), this._tagQuery.dense;
}, e.prototype.has = function(t) {
return _t(this.atomWorld.ecsWorld), this._tagQuery.has(t);
}, e.prototype.count = function() {
return _t(this.atomWorld.ecsWorld), this._tagQuery.dense.length;
}, e.prototype.collectByComponent = function() {
var t, e;
return this.atomWorld.isSignalEntityDomain(this.atomName) && re(Et.WarnSignalDomainCollect, {
domain: this.atomName,
source: null !== (t = this.atomWorld.currentExecutingLogicAtom) && void 0 !== t ? t : "unknown",
method: "collectByComponent",
signalDomain: null !== (e = this.atomWorld.currentSignalEntityDomain) && void 0 !== e ? e : "unknown"
}), _t(this.atomWorld.ecsWorld), this._componentQuery.dense;
}, e.prototype.hasByComponent = function(t) {
return _t(this.atomWorld.ecsWorld), this._componentQuery.has(t);
}, e.prototype.countByComponent = function() {
return _t(this.atomWorld.ecsWorld), this._componentQuery.dense.length;
}, e.prototype._collectAllComponentAtoms = function(t, e) {
var n, o;
if (!e.has(this.atomName)) {
e.add(this.atomName);
try {
for (var r = l(this.getDependencies()), i = r.next(); !i.done; i = r.next()) {
var a = i.value, s = this.atomWorld.getAtomIns(a);
this.isDepType(a, "EntityComponentAtom") ? t.push(s) : this.isDepType(a, "EntityDomainAtom") && s._collectAllComponentAtoms(t, e);
}
} catch (t) {
n = {
error: t
};
} finally {
try {
i && !i.done && (o = r.return) && o.call(r);
} finally {
if (n) throw n.error;
}
}
}
}, e.prototype._applyToEntity = function(t) {
var e, n, o = this.atomWorld.ecsWorld;
bt(o, t, this._tagComponent);
try {
for (var r = l(this._allComponentAtoms), i = r.next(); !i.done; i = r.next()) {
var a = i.value, s = a.atomState;
Rt(o, t, s) || si(o, t, s, a.defaultValues);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
i && !i.done && (n = r.return) && n.call(r);
} finally {
if (e) throw e.error;
}
}
this._initLogicEntityData(t);
}, e.prototype._initLogicEntityData = function(t) {
var e, n, o = this.atomWorld.domainToLogicMap.get(this.atomName);
if (o) {
var r = this.atomWorld.ecsWorld;
try {
for (var i = l(o), a = i.next(); !a.done; a = i.next()) {
var s = a.value, u = this.atomWorld.getAtomIns(s), c = u.entityDataDefaults;
c && u.atomState.entity && si(r, t, u.atomState.entity, c);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
a && !a.done && (n = i.return) && n.call(i);
} finally {
if (e) throw e.error;
}
}
}
}, e[_e] = !0, e;
}(ge), ci = function(t) {
function e() {
var e = t.apply(this, d([], c(arguments), !1)) || this;
return e._ctx = null, e;
}
return n(e, t), Object.defineProperty(e, "atomType", {
get: function() {
return "EntityRelationAtom";
},
enumerable: !1,
configurable: !0
}), e.prototype.defineRelation = function() {
return {
exclusive: !0,
autoRemoveSubject: !1
};
}, e.prototype._createRelation = function() {
var t = this.defineRelation(), e = {
world: this.atomWorld
}, n = this.atomName;
this._ctx = e, this.atomState = function() {
for (var t, e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
if (1 === e.length && "object" == typeof e[0]) {
var o = e[0], r = o.store, i = o.exclusive, a = o.autoRemoveSubject, s = o.onTargetRemoved, u = o.onAdd, l = o.onRemove;
return [ r && (t = r, function(e) {
return e[N].initStore = t, e;
}), i && I, a && D, s && M(s), u && P(u), l && W(l) ].filter(Boolean).reduce(function(t, e) {
return e(t);
}, x());
}
return e.reduce(function(t, e) {
return e(t);
}, x());
}(o(o({}, t), {
onAdd: function(t, o) {
var r;
null === (r = e.world) || void 0 === r || r.markRelationChange(n, o, t, !0);
},
onRemove: function(t, o) {
var r;
null === (r = e.world) || void 0 === r || r.markRelationChange(n, o, t, !1);
},
onTargetRemoved: t.autoRemoveSubject ? function(t) {
var n = e.world;
if (n) {
var o = n.getAtomIns(gn).atomState.name[t];
if (o) {
var r = n.getAtomIns(o);
(null == r ? void 0 : r.renderVariantChain) && n.markRenderDestroy(t), o === Xe && n.markWorldDestroy(t);
}
}
} : void 0
}));
}, e.prototype.onReady = function() {
return s(this, void 0, void 0, function() {
return u(this, function() {
return this._createRelation(), [ 2 ];
});
});
}, e.prototype.dispose = function() {
this._ctx && (this._ctx.world = null), this._ctx = null, t.prototype.dispose.call(this);
}, e.prototype.set = function(t, e) {
return !(!e || !t) && bt(this.atomWorld.ecsWorld, e, O(this.atomState, t));
}, e.prototype.remove = function(t, e) {
return Nt(this.atomWorld.ecsWorld, e, O(this.atomState, t)), !0;
}, e.prototype.getSource = function(t) {
return L(this.atomWorld.ecsWorld, t, this.atomState)[0];
}, e.prototype.getTargets = function(t) {
return ft(this.atomWorld.ecsWorld, [ O(this.atomState, t) ]);
}, e.prototype.has = function(t, e) {
return void 0 !== e ? Rt(this.atomWorld.ecsWorld, e, O(this.atomState, t)) : this.getTargets(t).length > 0;
}, e[_e] = !0, e;
}(ge), di = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), Object.defineProperty(e, "atomType", {
get: function() {
return "DomainExtensionAtom";
},
enumerable: !1,
configurable: !0
}), e.prototype.onReady = function() {
return s(this, void 0, void 0, function() {
var t, e, n, o, r, i, a, s, c, d, h;
return u(this, function() {
if (!(t = null === (d = this.constructor.__bindingMeta) || void 0 === d ? void 0 : d.attachToProperty)) return [ 2 ];
if (!(e = null === (h = this.constructor.__bindingMeta) || void 0 === h ? void 0 : h.propToAtom.get(t))) return [ 2 ];
n = this.atomWorld.getAtomIns(e);
try {
for (o = l(this.getDependencies()), r = o.next(); !r.done; r = o.next()) i = r.value, 
this.isDepType(i, "EntityComponentAtom") && (a = this.atomWorld.getAtomIns(i), n._allComponentAtoms.includes(a) || n._allComponentAtoms.push(a));
} catch (t) {
s = {
error: t
};
} finally {
try {
r && !r.done && (c = o.return) && c.call(o);
} finally {
if (s) throw s.error;
}
}
return [ 2 ];
});
});
}, e[_e] = !0, e;
}(ge), hi = function(t) {
function e() {
var e = t.apply(this, d([], c(arguments), !1)) || this;
return e.variantChain = null, e;
}
return n(e, t), Object.defineProperty(e, "atomType", {
get: function() {
return "FunctionAtom";
},
enumerable: !1,
configurable: !0
}), e.prototype.onReady = function() {
return s(this, void 0, void 0, function() {
var t, e, n, o, r;
return u(this, function(i) {
switch (i.label) {
case 0:
if (this.atomState = this.defineFunction(), !this.variantChain) return [ 2 ];
i.label = 1;

case 1:
i.trys.push([ 1, 6, 7, 8 ]), t = l(this.variantChain.getInstances()), e = t.next(), 
i.label = 2;

case 2:
return e.done ? [ 3, 5 ] : [ 4, e.value.ready() ];

case 3:
if (i.sent(), !this.atomWorld) return [ 2 ];
i.label = 4;

case 4:
return e = t.next(), [ 3, 2 ];

case 5:
return [ 3, 8 ];

case 6:
return n = i.sent(), o = {
error: n
}, [ 3, 8 ];

case 7:
try {
e && !e.done && (r = t.return) && r.call(t);
} finally {
if (o) throw o.error;
}
return [ 7 ];

case 8:
return [ 2 ];
}
});
});
}, e[_e] = !0, e;
}(ge), pi = function(t) {
function e() {
var e = t.apply(this, d([], c(arguments), !1)) || this;
return e.variantChain = null, e._chain = null, e.entityDataDefaults = null, e.entityDataDomain = null, 
e;
}
return n(e, t), Object.defineProperty(e, "atomType", {
get: function() {
return "LogicAtom";
},
enumerable: !1,
configurable: !0
}), e.prototype.defineStorageData = function() {
return null;
}, e.prototype.defineRuntimeData = function() {
return null;
}, e.prototype.defineEntityData = function() {
return null;
}, e.prototype.executeAll = function(t) {
var e, n, o, r;
if ("function" != typeof this.onExecute) throw new TypeError("[AtomEngine] this.onExecute is not a function." + "atomName=".concat(this.atomName) + "constructor=".concat(null === (e = this.constructor) || void 0 === e ? void 0 : e.name, " ") + "proto=".concat(null === (o = null === (n = Object.getPrototypeOf(this)) || void 0 === n ? void 0 : n.constructor) || void 0 === o ? void 0 : o.name, " ") + "onExecute=".concat(String(this.onExecute)));
for (var i = this.atomWorld.ecsWorld, a = null === (r = this.variantChain) || void 0 === r ? void 0 : r.resolve(), s = 0, u = t.length; s < u; s++) {
var l = t[s];
Mt(i, l) && (a ? a.atomState(l, this.atomState) : this.onExecute(l, this.atomState));
}
}, e.prototype.getChainRegistration = function() {
var t;
return null === (t = this.constructor.__bindingMeta) || void 0 === t ? void 0 : t.chainRegistration;
}, e.prototype.getEntityDataDomainName = function() {
var t, e = null === (t = this.constructor.__bindingMeta) || void 0 === t ? void 0 : t.entityDataProperty;
return e ? this.getBoundAtomName(e) : null;
}, e.prototype.init = function(e, n) {
t.prototype.init.call(this, e, n), this._registerToChain();
var o = this.getEntityDataDomainName();
if (o) {
this.entityDataDomain = o;
var r = n.domainToLogicMap.get(o);
r || (r = [], n.domainToLogicMap.set(o, r)), r.push(e);
}
}, e.prototype.dispose = function() {
if (this._unregisterFromChain(), this.atomWorld.storageAtoms.delete(this.atomName), 
this.entityDataDomain) {
var e = this.atomWorld.domainToLogicMap.get(this.entityDataDomain);
if (e) {
var n = e.indexOf(this.atomName);
-1 !== n && e.splice(n, 1);
}
}
t.prototype.dispose.call(this);
}, e.prototype._registerToChain = function() {
var t = this.getChainRegistration();
if (t) {
var e = this.getBoundAtomName(t.ownerProperty);
if (e) {
var n = this.atomWorld.getAtomIns(e);
this._chain = n.registerToChain(this.atomName, t.chainType);
}
}
}, e.prototype._unregisterFromChain = function() {
var t = this.getChainRegistration();
if (t) {
var e = this.getBoundAtomName(t.ownerProperty);
e && this.atomWorld.getAtomIns(e).unregisterFromChain(this.atomName, t.chainType);
}
}, e.prototype._loadOrCreateStorage = function() {
var t = this.defineStorageData();
if (!t) return null;
var e = this.atomWorld.universe, n = e.storageDataStore.get(this.atomName);
if (void 0 === n) {
var o = e.storage.loadStorage(this.atomName);
n = null != o ? o : t, e.storageDataStore.set(this.atomName, n);
}
return this.atomWorld.storageAtoms.add(this.atomName), n;
}, e.prototype.onReady = function() {
return s(this, void 0, void 0, function() {
var t, e, n;
return u(this, function() {
return (t = this._loadOrCreateStorage()) && this._wrapStorageWithTracking(t, [ "storage" ]), 
e = null, this.entityDataDomain && (n = this.defineEntityData(), this.entityDataDefaults = n, 
e = ai(this.atomWorld.ecsWorld, n)), this.atomState = {
runtime: this.defineRuntimeData(),
storage: t,
entity: e
}, null !== this.atomState.runtime && (this.atomWorld.atomSnapshots[this.atomName] = this.atomState.runtime), 
[ 2 ];
});
});
}, e.prototype._wrapStorageWithTracking = function(t, e) {
for (var n in t) {
var o = t[n], r = d(d([], c(e), !1), [ n ], !1);
"function" == typeof o || n.startsWith("_") || (o && "object" == typeof o && !Array.isArray(o) ? this._wrapStorageWithTracking(o, r) : this._installStorageFieldInterceptor(t, n, r));
}
}, e.prototype._installStorageFieldInterceptor = function(t, e, n) {
var o = Object.getOwnPropertyDescriptor(t, e);
if (!(null == o ? void 0 : o.set) || !o.set.__isAtomInterceptor) {
var r = t[e], i = this.atomWorld.universe, a = this.atomName, s = function(t) {
r = t, i.onFieldWrite(a, n);
};
s.__isAtomInterceptor = !0, Object.defineProperty(t, e, {
get: function() {
return r;
},
set: s,
enumerable: !0,
configurable: !0
});
}
}, e.prototype.getTopologicalChain = function() {
return this._chain;
}, e[_e] = !0, e;
}(ge), fi = new Set([ "InputAtom", "OutputAtom", "WorldInputAtom" ]);
pe("LogicAtom", function(e) {
var n = e.constructor, o = n.__bindingMeta, r = e.getChainRegistration();
if (r || re(Et.OnChainRequired, {
class: n.name,
atom: e.atomName
}), r) {
var i = e.getBoundAtomName(r.ownerProperty);
if (i) {
var a = e.getDepAtomType(i);
fi.has(a) && re(Et.BoundaryBindingForbidden, {
class: n.name,
boundaryType: a,
target: i
});
}
}
if ((null == o ? void 0 : o.routePhase) === t.RoutePhase.Filter && o.chainRegistration) {
var s = o.propToAtom.get(o.chainRegistration.ownerProperty);
s && e.atomWorld.getAtomIns(s).mode === t.RouteMode.Broadcast && re(Et.BroadcastFilterForbidden, {
atom: e.atomName,
router: s
});
}
var u = Boolean(null == o ? void 0 : o.entityDataProperty);
u !== Object.getPrototypeOf(e).hasOwnProperty("defineEntityData") && re(Et.EntityDataConfigInvalid, {
atom: e.atomName,
reason: u ? "@entityData 装饰器需要重写 defineEntityData() 方法" : "重写 defineEntityData() 需要配合 @entityData 装饰器指定挂载的域"
});
});
var mi, yi = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.getExtraDependencies = function() {
return [];
}, e.prototype.getTargetAtomName = function(t) {
var e = this._atomWorld.atomInstanceMap.get(t), n = e.constructor.__bindingMeta.variantSourceProperty;
return e.getBoundAtomName(n);
}, e.prototype.resolve = function() {
for (var t = this.getInstances(), e = 0, n = t.length; e < n; e++) {
var o = t[e];
if ("function" == typeof o.atomState && o.variantCondition()) return o;
}
return null;
}, e.prototype.topologicalSort = function() {
var e = t.prototype.topologicalSort.call(this);
return e.length, e;
}, e;
}(Ae), vi = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), Object.defineProperty(e, "atomType", {
get: function() {
return "VariantAtom";
},
enumerable: !1,
configurable: !0
}), e.prototype.variantCondition = function() {
return !0;
}, e.prototype.getVariantSourceAtomName = function() {
var t, e = null === (t = this.constructor.__bindingMeta) || void 0 === t ? void 0 : t.variantSourceProperty;
return e ? this.getBoundAtomName(e) : void 0;
}, e.prototype.onReady = function() {
return s(this, void 0, void 0, function() {
return u(this, function() {
return this.atomState = this.defineFunction(), [ 2 ];
});
});
}, e.prototype.init = function(e, n) {
t.prototype.init.call(this, e, n);
var o = this.getVariantSourceAtomName(), r = n.getAtomIns(o);
r.variantChain || (r.variantChain = new yi(n)), r.variantChain.addAtom(e);
}, e.prototype.dispose = function() {
var e = this.getVariantSourceAtomName(), n = this.atomWorld.getAtomIns(e);
n.variantChain.removeAtom(this.atomName) && (n.variantChain = null), t.prototype.dispose.call(this);
}, e.prototype.getTopologicalChain = function() {
var t = this.getVariantSourceAtomName();
return t ? this.atomWorld.getAtomIns(t).variantChain : null;
}, e[_e] = !0, e;
}(ge), _i = function(t) {
function e(e) {
return t.call(this, e) || this;
}
return n(e, t), e.prototype.getExtraDependencies = function(t) {
return this._atomWorld.getAtomIns(t).getDependencies();
}, e.prototype.execute = function(t, e) {
if (0 !== this.atoms.length) {
this._atomWorld.currentSignalEntityDomain = e;
for (var n = this.getInstances(), o = 0, r = n.length; o < r; o++) {
var i = n[o];
this._atomWorld.currentExecutingLogicAtom = i.atomName, i.executeAll(t);
}
this._atomWorld.currentExecutingLogicAtom = null, this._atomWorld.currentSignalEntityDomain = null;
}
}, e;
}(Ae), gi = function(t) {
function e() {
var e = t.apply(this, d([], c(arguments), !1)) || this;
return e._domain = null, e;
}
return n(e, t), Object.defineProperty(e, "atomType", {
get: function() {
return "SignalAtom";
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(e.prototype, "domain", {
get: function() {
var t, e;
if (!this._domain) {
var n = this.constructor.__bindingMeta;
try {
for (var o = l(n.propToAtom), r = o.next(); !r.done; r = o.next()) {
var i = c(r.value, 2), a = i[0], s = i[1];
if (this.isDepType(s, "EntityDomainAtom")) {
this._domain = this[a];
break;
}
}
} catch (e) {
t = {
error: e
};
} finally {
try {
r && !r.done && (e = o.return) && e.call(o);
} finally {
if (t) throw t.error;
}
}
}
return this._domain;
},
enumerable: !1,
configurable: !0
}), e.prototype.init = function(e, n) {
t.prototype.init.call(this, e, n), this.beginChain = new _i(n), this.triggerChain = new _i(n), 
this.endChain = new _i(n);
}, e.prototype.trigger = function(t) {
if (0 !== t.length) {
var e = this.domain.atomName;
this.beginChain.execute(t, e), this.triggerChain.execute(t, e), this._propagateSuccessorSignals(t), 
this.endChain.execute(t, e);
}
}, e.prototype._propagateSuccessorSignals = function(t) {
var e, n, o = this.atomWorld.signalRouters.get(this.atomName);
if (o) {
var r = o.getInstances();
try {
for (var i = l(r), a = i.next(); !a.done; a = i.next()) {
var s = a.value;
s.handleSignal({
fromRouterName: s.atomName,
signalName: s.to.atomName,
eidList: d([], c(t), !1)
});
}
} catch (t) {
e = {
error: t
};
} finally {
try {
a && !a.done && (n = i.return) && n.call(i);
} finally {
if (e) throw e.error;
}
}
}
}, e.prototype.registerToChain = function(t, e) {
var n = this.getChain(e);
return n && n.addAtom(t), n;
}, e.prototype.unregisterFromChain = function(t, e) {
var n = this.getChain(e);
return !!n && n.removeAtom(t);
}, e.prototype.getChain = function(t) {
switch (t) {
case "SignalStart":
return this.beginChain;

case "SignalTrigger":
return this.triggerChain;

case "SignalEnd":
return this.endChain;

default:
return null;
}
}, e[_e] = !0, e;
}(ge), Ai = function(t) {
function e(e, n, o) {
var r = t.call(this, e) || this;
return r._router = n, r._phase = o, r;
}
return n(e, t), e.prototype.getExtraDependencies = function(t) {
return this._atomWorld.getAtomIns(t).getDependencies();
}, e.prototype.execute = function(t) {
if (0 !== this.atoms.length) {
this._router.currentPhase = this._phase;
for (var e = this.getInstances(), n = 0, o = e.length; n < o; n++) {
var r = e[n];
this._atomWorld.currentExecutingLogicAtom = r.atomName, r.executeAll(t);
}
this._atomWorld.currentExecutingLogicAtom = null, this._router.currentPhase = null;
}
}, e;
}(Ae), Ci = function(t) {
function e(e) {
return t.call(this, e) || this;
}
return n(e, t), e.prototype.getExtraDependencies = function() {
return [];
}, e;
}(Ae), Ri = function(e) {
function o() {
var t = e.apply(this, d([], c(arguments), !1)) || this;
return t._signalVersion = 0, t.currentPhase = null, t._routerChain = null, t;
}
return n(o, e), Object.defineProperty(o, "atomType", {
get: function() {
return "SignalRouterAtom";
},
enumerable: !1,
configurable: !0
}), o.prototype.defineDecisionState = function() {
return {
receiveAction: t.ReceiveAction.Queue,
dispatchAction: t.DispatchAction.FireOnce,
filterAction: {},
transformedEidList: null
};
}, o.prototype.onReady = function() {
return s(this, void 0, void 0, function() {
return u(this, function() {
return this.atomState = this.defineDecisionState(), [ 2 ];
});
});
}, o.prototype.getRouteFromAtomName = function() {
var t, e = null === (t = this.constructor.__bindingMeta) || void 0 === t ? void 0 : t.routeFromProperty;
return e ? this.getBoundAtomName(e) : void 0;
}, o.prototype.getRouteToAtomName = function() {
var t, e = null === (t = this.constructor.__bindingMeta) || void 0 === t ? void 0 : t.routeToProperty;
return e ? this.getBoundAtomName(e) : void 0;
}, o.prototype.init = function(n, o) {
var r, i, a, s, u;
e.prototype.init.call(this, n, o);
var c = this.getRouteFromAtomName(), d = this.getRouteToAtomName();
this.from = this.atomWorld.getAtomIns(c), this.to = this.atomWorld.getAtomIns(d), 
this.mode = null === (a = this.constructor.__bindingMeta) || void 0 === a ? void 0 : a.routeMode, 
this.receiveChain = new Ai(o, this, t.RoutePhase.Receive), this.transformChain = new Ai(o, this, t.RoutePhase.Transform), 
this.dispatchChain = new Ai(o, this, t.RoutePhase.Dispatch), this.filterChain = new Ai(o, this, t.RoutePhase.Filter);
var h = this.getDependencies();
if (h.length > 0) {
var p = "InputAtom" === this.from.atomType ? null : null === (s = this.from.domain) || void 0 === s ? void 0 : s.atomName, f = null === (u = this.to.domain) || void 0 === u ? void 0 : u.atomName;
try {
for (var m = l(h), y = m.next(); !y.done; y = m.next()) {
var v = y.value;
this.isDepType(v, "EntityDomainAtom") && (v !== p && v !== f || re(Et.SignalDomainConflict, {
class: this.constructor.name,
domain: v,
reason: "已通过 from/to 信号隐含域信息 (toSignalDomain: ".concat(f, ")")
}));
}
} catch (t) {
r = {
error: t
};
} finally {
try {
y && !y.done && (i = m.return) && i.call(m);
} finally {
if (r) throw r.error;
}
}
}
if ("InputAtom" === this.from.atomType) {
var _ = o.universe.featureResolver.getFeatureSet(o.config.worldId), g = this.getFeatureName();
if (!_.has(g) && g !== t.G_FAtom.FeatureName.Name) return;
}
var A = this.from.atomName, C = o.signalRouters.get(A);
C || (C = new Ci(o), o.signalRouters.set(A, C)), C.addAtom(n), this._routerChain = C;
}, o.prototype.dispose = function() {
var t = this.atomWorld, n = this.atomName;
this._routerChain && (this._routerChain.removeAtom(n) && t.signalRouters.delete(this.from.atomName), 
this._routerChain = null), t.pendingRouterSignals = t.pendingRouterSignals.filter(function(t) {
return t.fromRouterName !== n;
}), e.prototype.dispose.call(this);
}, o.prototype.getTopologicalChain = function() {
return this._routerChain;
}, o.prototype.registerToChain = function(t, e) {
var n = this.getChain(e);
return n && n.addAtom(t), n;
}, o.prototype.unregisterFromChain = function(t, e) {
var n = this.getChain(e);
return !!n && n.removeAtom(t);
}, o.prototype.getChain = function(t) {
switch (t) {
case "RouteReceive":
return this.receiveChain;

case "RouteTransform":
return this.transformChain;

case "RouteDispatch":
return this.dispatchChain;

case "RouteFilter":
return this.filterChain;

default:
return null;
}
}, o.prototype.handleSignal = function(e) {
var n, o;
if (void 0 === e.routerVersion || e.routerVersion === this._signalVersion) {
e.inputData && "InputAtom" === this.from.atomType && Object.assign(this.from.atomState, e.inputData);
var r, i = null !== (n = e.startPhase) && void 0 !== n ? n : t.RoutePhase.Receive, a = e.eidList, s = this.atomState;
if (i <= t.RoutePhase.Receive) switch (s.receiveAction = t.ReceiveAction.Queue, 
this.receiveChain.execute([ this.atomWorld.rootEid ]), s.receiveAction) {
case t.ReceiveAction.Discard:
return;

case t.ReceiveAction.Replace:
this._signalVersion++;
}
if (i <= t.RoutePhase.Transform) {
if (this.transformChain.hasAtoms()) {
if (s.transformedEidList = a, this.transformChain.execute([ this.atomWorld.rootEid ]), 
!s.transformedEidList || 0 === s.transformedEidList.length) return;
a = s.transformedEidList;
}
if (this.mode === t.RouteMode.Direct) {
var u = this.to.domain, l = a.length;
if (0 === (a = a.filter(function(t) {
return u.has(t);
})).length) return;
a.length < l && re(Et.TransformEidInvalid, {
atom: this.atomName,
domain: u.atomName
});
}
}
if (i <= t.RoutePhase.Dispatch) {
s.dispatchAction = t.DispatchAction.FireOnce, this.dispatchChain.execute([ this.atomWorld.rootEid ]);
var h = s.dispatchAction;
if (h === t.DispatchAction.Cancel) return;
if (h === t.DispatchAction.Defer) return e.eidList = a, e.startPhase = t.RoutePhase.Dispatch, 
e.routerVersion = this._signalVersion, void this.atomWorld.pendingRouterSignals.push(e);
}
var p = null;
if (this.filterChain.hasAtoms()) {
s.filterAction = {}, this.filterChain.execute(a);
var f = this.atomWorld.ecsWorld;
r = [];
for (var m = 0, y = a.length; m < y; m++) {
var v = a[m];
if (Mt(f, v)) {
var _ = null !== (o = s.filterAction[v]) && void 0 !== o ? o : t.FilterAction.Cancel;
_ !== t.FilterAction.Cancel && (_ === t.FilterAction.FireOnce ? r.push(v) : _ === t.FilterAction.FireRepeat ? (r.push(v), 
p || (p = []), p.push(v)) : _ === t.FilterAction.Defer && (p || (p = []), p.push(v)));
}
}
} else r = a;
if (r.length > 0) {
var g;
(g = this.mode === t.RouteMode.Broadcast ? d([], c(this.to.domain.collect()), !1) : r).length > 0 && this.atomWorld.getAtomIns(e.signalName).trigger(g);
}
p && (e.eidList = p, e.startPhase = t.RoutePhase.Filter, e.routerVersion = this._signalVersion, 
this.atomWorld.pendingRouterSignals.push(e));
}
}, o[_e] = !0, o;
}(ge), Si = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), Object.defineProperty(e, "atomType", {
get: function() {
return "OrderAtom";
},
enumerable: !1,
configurable: !0
}), e.prototype.getOrderBeforeAtomName = function() {
var t, e = null === (t = this.constructor.__bindingMeta) || void 0 === t ? void 0 : t.orderBeforeProperty;
return e ? this.getBoundAtomName(e) : void 0;
}, e.prototype.getOrderAfterAtomName = function() {
var t, e = null === (t = this.constructor.__bindingMeta) || void 0 === t ? void 0 : t.orderAfterProperty;
return e ? this.getBoundAtomName(e) : void 0;
}, e.prototype.init = function(e, n) {
t.prototype.init.call(this, e, n);
var o = this.getOrderBeforeAtomName(), r = this.getOrderAfterAtomName(), i = this.atomWorld.getAtomIns(o), a = this.atomWorld.getAtomIns(r), s = i.getTopologicalChain();
s && s === a.getTopologicalChain() ? (s.addConstraint(o, r), this.atomState = {
chain: s,
before: o,
after: r
}) : re(Et.OrderScopeConflict, {
class: this.constructor.name,
before: o,
after: r
});
}, e.prototype.dispose = function() {
var e = this.atomState;
(null == e ? void 0 : e.chain) ? (e.chain.removeConstraint(e.before, e.after), t.prototype.dispose.call(this)) : t.prototype.dispose.call(this);
}, e[_e] = !0, e;
}(ge), Ti = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), Object.defineProperty(e, "atomType", {
get: function() {
return "WorldAtom";
},
enumerable: !1,
configurable: !0
}), e.prototype.defineWorld = function() {
return {
worldId: this.atomName
};
}, e.prototype.onReady = function() {
return s(this, void 0, void 0, function() {
return u(this, function() {
return this.atomState = this.defineWorld(), [ 2 ];
});
});
}, e[_e] = !0, e;
}(ge), bi = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), Object.defineProperty(e, "atomType", {
get: function() {
return "WorldInputAtom";
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(e.prototype, "data", {
get: function() {
return this.atomState;
},
enumerable: !1,
configurable: !0
}), e.prototype.onReady = function() {
return s(this, void 0, void 0, function() {
return u(this, function() {
return this.atomState = o(o({}, this.defineInputData()), {
childWorldEid: void 0
}), [ 2 ];
});
});
}, e.prototype.emit = function(t) {
t && (this.atomState = t), this.atomWorld.universe.broadcastWorldInput(this);
}, e.prototype.emitToParent = function(t) {
t && (this.atomState = t), this.atomWorld.universe.sendToParentWorldInput(this);
}, e.prototype.receive = function(t, e) {
this.atomState = t, this.atomState.childWorldEid = e, this.atomWorld.pushInput(this, this.atomWorld.rootEid, this.atomState);
}, e[_e] = !0, i([ De(qe), a("design:type", Object) ], e.prototype, "rootDomain", void 0), 
e;
}(gi), wi = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), Object.defineProperty(e.prototype, "world", {
get: function() {
return this.atomWorld;
},
enumerable: !1,
configurable: !0
}), e.prototype.triggerRouter = function(t, e) {
this.atomWorld.universe.forEachWorld(function(n) {
var o = n.atomInstanceMap.get(t);
if (o) {
var r = d([], c(void 0 === e ? o.to.domain.collect() : e), !1);
n.pendingRouterSignals.push({
fromRouterName: o.atomName,
signalName: o.to.atomName,
eidList: r
});
}
});
}, e[_e] = !0, e;
}(hi), Fi = function(e) {
function o() {
return null !== e && e.apply(this, arguments) || this;
}
return n(o, e), Object.defineProperty(o, "atomType", {
get: function() {
return "AudioAtom";
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(o.prototype, "_audio", {
get: function() {
var t, e;
return null === (e = null === (t = this.atomWorld) || void 0 === t ? void 0 : t.universe) || void 0 === e ? void 0 : e.audio;
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(o.prototype, "_asset", {
get: function() {
var t, e;
return null === (e = null === (t = this.atomWorld) || void 0 === t ? void 0 : t.universe) || void 0 === e ? void 0 : e.asset;
},
enumerable: !1,
configurable: !0
}), o.prototype.playEffect = function(e) {
return s(this, arguments, void 0, function(e, n, o) {
var r, i, a, s, l;
return void 0 === n && (n = 1), void 0 === o && (o = !1), u(this, function(u) {
switch (u.label) {
case 0:
r = Kn(e), u.label = 1;

case 1:
return u.trys.push([ 1, 3, , 4 ]), [ 4, null === (a = this._asset) || void 0 === a ? void 0 : a.loadAsset(r.featureName, r.assetPath, t.LoaderAssetType.AudioClip) ];

case 2:
return (i = u.sent()) ? [ 2, null !== (l = null === (s = this._audio) || void 0 === s ? void 0 : s.playEffect(i, n, o)) && void 0 !== l ? l : -1 ] : [ 2, -1 ];

case 3:
return u.sent(), [ 2, -1 ];

case 4:
return [ 2 ];
}
});
});
}, o.prototype.stopEffect = function(t) {
var e;
null === (e = this._audio) || void 0 === e || e.stopEffect(t);
}, o.prototype.setEffectsVolume = function(t) {
var e;
null === (e = this._audio) || void 0 === e || e.setEffectsVolume(t);
}, o.prototype.stopAllEffects = function() {
var t;
null === (t = this._audio) || void 0 === t || t.stopAllEffects();
}, o.prototype.playMusic = function(e, n, o) {
var r, i = this;
void 0 === n && (n = !0), void 0 === o && (o = 1), this._currentMusicUrl = e;
var a = Kn(e);
null === (r = this._asset) || void 0 === r || r.loadAsset(a.featureName, a.assetPath, t.LoaderAssetType.AudioClip).then(function(t) {
var r;
i._currentMusicUrl === e && (null === (r = i._audio) || void 0 === r || r.playMusic(t, n, o));
}).catch(function() {});
}, o.prototype.stopMusic = function() {
var t;
this._currentMusicUrl = void 0, null === (t = this._audio) || void 0 === t || t.stopMusic();
}, o.prototype.pauseMusic = function() {
var t;
null === (t = this._audio) || void 0 === t || t.pauseMusic();
}, o.prototype.resumeMusic = function() {
var t;
null === (t = this._audio) || void 0 === t || t.resumeMusic();
}, o.prototype.setMusicVolume = function(t) {
var e;
null === (e = this._audio) || void 0 === e || e.setMusicVolume(t);
}, o[_e] = !0, o;
}(ge), Ei = function(e) {
for (var n = [], o = 1; o < arguments.length; o++) n[o - 1] = arguments[o];
return Un.apply(void 0, d([ t.RenderNodeType.Node, e ], c(n), !1));
}, Ni = function() {
function t(t) {
void 0 === t && (t = 1 / 0), this.pool = [], this.maxSize = t;
}
return t.prototype.acquire = function() {
var t;
return null !== (t = this.pool.pop()) && void 0 !== t ? t : null;
}, t.prototype.release = function(t) {
var e, n;
if (this.pool.length < this.maxSize) this.pool.push(t); else try {
for (var o = l(t.nodes), r = o.next(); !r.done; r = o.next()) r.value.destroyNative();
} catch (t) {
e = {
error: t
};
} finally {
try {
r && !r.done && (n = o.return) && n.call(o);
} finally {
if (e) throw e.error;
}
}
}, t.prototype.dispose = function() {
var t, e, n, o;
try {
for (var r = l(this.pool), i = r.next(); !i.done; i = r.next()) {
var a = i.value;
try {
for (var s = (n = void 0, l(a.nodes)), u = s.next(); !u.done; u = s.next()) u.value.destroyNative();
} catch (t) {
n = {
error: t
};
} finally {
try {
u && !u.done && (o = s.return) && o.call(s);
} finally {
if (n) throw n.error;
}
}
}
} catch (e) {
t = {
error: e
};
} finally {
try {
i && !i.done && (e = r.return) && e.call(r);
} finally {
if (t) throw t.error;
}
}
this.pool.length = 0;
}, t;
}(), xi = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.getExtraDependencies = function() {
return [];
}, e.prototype.getTargetDomainName = function(t) {
var e = this._atomWorld.atomInstanceMap.get(t), n = e.constructor.__bindingMeta.entityRenderer;
return e.getBoundAtomName(n);
}, e.prototype.compareAtoms = function(t, e) {
var n = this._atomWorld.atomInstanceMap.get(t), o = this._atomWorld.atomInstanceMap.get(e), r = void 0 === n.renderCondition(), i = void 0 === o.renderCondition();
return r && !i ? 1 : !r && i ? -1 : t.localeCompare(e);
}, e.prototype.resolve = function() {
for (var t = this.getInstances(), e = 0, n = t.length; e < n; e++) {
var o = t[e];
if (!1 !== o.renderCondition()) return o;
}
return null;
}, e.prototype.topologicalSort = function() {
var e = t.prototype.topologicalSort.call(this);
return e.length, e;
}, e;
}(Ae), Ii = new Set([ "x", "y", "z", "quatX", "quatY", "quatZ", "quatW", "scaleX", "scaleY", "scaleZ", "angle", "scale", "width", "height", "depth", "anchorX", "anchorY", "anchorZ" ]), Di = function() {
this.preciseUpdateOps = [], this.logicDependencies = [], this.totalNodes = 0, this.renderConfig = null, 
this.nodeInitOps = [], this.nodeEventOps = [], this.boneAttachments = [], this.scrollViewContent = null;
}, Mi = function(e) {
function o() {
var t = e.apply(this, d([], c(arguments), !1)) || this;
return t.pool = null, t._compiledRender = null, t._renderConfig = null, t._domain = null, 
t.genChain = null, t;
}
return n(o, e), Object.defineProperty(o, "atomType", {
get: function() {
return "RenderAtom";
},
enumerable: !1,
configurable: !0
}), o.prototype.renderCondition = function() {}, o.prototype.poolMaxSize = function() {
return 1 / 0;
}, o.prototype.getEntityRendererDomain = function() {
var t, e = null === (t = this.constructor.__bindingMeta) || void 0 === t ? void 0 : t.entityRenderer;
return e ? this.getBoundAtomName(e) : void 0;
}, o.prototype.getDependencies = function() {
var t = e.prototype.getDependencies.call(this);
return t.includes(yn) || t.push(yn), t.includes(vn) || t.push(vn), t;
}, o.prototype.init = function(t, n) {
e.prototype.init.call(this, t, n);
var o = this.getEntityRendererDomain();
o && (this._domain = this.atomWorld.getAtomIns(o), this._domain.renderVariantChain || (this._domain.renderVariantChain = new xi(n)), 
this._domain.renderVariantChain.addAtom(t));
}, o.prototype.onReady = function() {
return s(this, void 0, void 0, function() {
return u(this, function(t) {
switch (t.label) {
case 0:
return this._renderConfig = this.defineRender(), this.atomState = this._buildPropsMap(this._renderConfig), 
this.genChain ? [ 4, this.genChain.execute() ] : [ 3, 2 ];

case 1:
t.sent(), t.label = 2;

case 2:
return this._normalizeSpineSlots(this._renderConfig, this.atomState), this._compiledRender = this._compile(this._renderConfig), 
this.pool = new Ni(this.poolMaxSize()), [ 2 ];
}
});
});
}, o.prototype.dispose = function() {
var t, n;
(null === (t = this._domain) || void 0 === t ? void 0 : t.renderVariantChain) && this._domain.renderVariantChain.removeAtom(this.atomName) && (this._domain.renderVariantChain = null), 
this._domain = null, null === (n = this.pool) || void 0 === n || n.dispose(), this.pool = null, 
this._compiledRender = null, this._renderConfig = null, e.prototype.dispose.call(this);
}, o.prototype.getTopologicalChain = function() {
var t, e;
return null !== (e = null === (t = this._domain) || void 0 === t ? void 0 : t.renderVariantChain) && void 0 !== e ? e : null;
}, o.prototype.refreshInstance = function(t, e) {
var n;
(null === (n = t._dirtyPreciseOps) || void 0 === n ? void 0 : n.size) > 0 && this._refreshPrecise(t, e);
}, o.prototype._refreshPrecise = function(t, e) {
var n = this._compiledRender, o = t._dirtyPreciseOps;
this._withInstanceContext(t, function() {
var r, i, a = t.nodes;
try {
for (var s = l(o), u = s.next(); !u.done; u = s.next()) {
var c = u.value, d = n.preciseUpdateOps[c], h = a[d.nodeIndex];
d.setter(h, d.getter(e));
}
} catch (t) {
r = {
error: t
};
} finally {
try {
u && !u.done && (i = s.return) && i.call(s);
} finally {
if (r) throw r.error;
}
}
}), o.clear();
}, o.prototype.getLogicDependencies = function() {
return this._compiledRender.logicDependencies;
}, o.prototype.createRender = function(t, e) {
var n = this, o = this.pool.acquire();
if (o) return this._reuseInstance(o, e), o;
var r = {
rootNode: null,
nodes: [],
renderAtom: this,
_lastRefreshFrame: -1,
eid: e
};
return this._withInstanceContext(r, function() {
r.rootNode = n._createNodeTree(t, n._compiledRender.renderConfig, r, e);
}), this._rebuildScrollViewContent(r), this._registerPreciseTracking(r), r;
}, o.prototype._reuseInstance = function(t, e) {
var n = this;
t.eid = e, t._lastRefreshFrame = -1, t._valueCache = void 0, t.nodeCache = void 0, 
t._dirtyPreciseOps && (t._dirtyPreciseOps.clear(), t._preciseValueCache = void 0), 
this._withInstanceContext(t, function() {
for (var o = t.nodes, r = 0; r < o.length; r++) n._initNode(o[r], r, e);
}), this._rebuildBoneAttachments(t), this._rebuildScrollViewContent(t), this._registerPreciseTracking(t);
}, o.prototype._rebuildBoneAttachments = function(t) {
var e, n, o = this._compiledRender;
if (0 !== o.boneAttachments.length) {
var r = t.nodes;
try {
for (var i = l(o.boneAttachments), a = i.next(); !a.done; a = i.next()) {
var s = a.value, u = r[s.parentIndex], c = r[s.childIndex];
u.attachToBone(c, s.boneName, s.bindAlpha);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
a && !a.done && (n = i.return) && n.call(i);
} finally {
if (e) throw e.error;
}
}
}
}, o.prototype._rebuildScrollViewContent = function(t) {
var e = this._compiledRender.scrollViewContent;
if (e) {
var n = t.nodes, o = n[e.scrollViewIndex], r = n[e.contentIndex];
o.rebuildScrollViewContent(r);
}
}, o.prototype._initNode = function(t, e, n) {
var o = this;
Mn(this.atomName), t.initRender(n, this.atomWorld.config.worldId);
var r = this._compiledRender, i = r.nodeInitOps[e];
if (i) for (var a = 0; a < i.length; a++) {
var s = i[a];
s.setter(t, s.getter(n));
}
var u = r.nodeEventOps[e];
if (u) {
var l = function(e) {
var r = u[e], i = "buttonClick" === r.eventName ? c.atomWorld.getAtomIns(Tn) : "touchEnd" === r.eventName ? c.atomWorld.getAtomIns(bn) : void 0;
r.setter(t, function(t) {
if (o.atomWorld) {
var e = r.getter(n);
e && (null == i || i.emit(n), o.atomWorld.pendingRouterSignals.push({
fromRouterName: e.atomName,
signalName: e.to.atomName,
eidList: [ n ],
inputData: t
}));
}
});
}, c = this;
for (a = 0; a < u.length; a++) l(a);
}
Mn(void 0);
}, o.prototype._createNodeTree = function(t, e, n, o) {
var r, i, a = t.createRenderNode(e.type), s = n.nodes.length;
if (n.nodes.push(a), this._initNode(a, s, o), e.children) try {
for (var u = l(e.children), c = u.next(); !c.done; c = u.next()) {
var d = c.value, h = this._createNodeTree(t, d, n, o);
d._boneName && "attachToBone" in a ? a.attachToBone(h, d._boneName, d._bindAlpha) : a.addChild(h);
}
} catch (t) {
r = {
error: t
};
} finally {
try {
c && !c.done && (i = u.return) && i.call(u);
} finally {
if (r) throw r.error;
}
}
return a;
}, o.prototype.onContextRestore = function(t) {
var e, n;
try {
for (var o = l(t.nodes), r = o.next(); !r.done; r = o.next()) r.value.restoreMaterial();
} catch (t) {
e = {
error: t
};
} finally {
try {
r && !r.done && (n = o.return) && n.call(o);
} finally {
if (e) throw e.error;
}
}
}, o.prototype.destroyRender = function(t) {
this._prepareForPooling(t), this.pool.release(t);
}, o.prototype._prepareForPooling = function(t) {
var e, n;
this._unregisterPreciseTracking(t);
try {
for (var o = l(t.nodes), r = o.next(); !r.done; r = o.next()) r.value.disposeRender();
} catch (t) {
e = {
error: t
};
} finally {
try {
r && !r.done && (n = o.return) && n.call(o);
} finally {
if (e) throw e.error;
}
}
t.rootNode.removeFromParent();
}, o.prototype.getNode = function(t) {
var e = this._currentInstance;
if (e) {
var n = this._ensureNodeCache(e)[t];
if (n) return {
x: n.getX(),
y: n.getY(),
width: n.getWidth(),
height: n.getHeight()
};
}
}, o.prototype.getSlotNode = function(t, e) {
return this._ensureNodeCache(t)[e];
}, o.prototype.findSlotPath = function(t) {
if (this._renderConfig) {
if (this._renderConfig.props.name === t) return [];
var e = [];
return this._findSlotDFS(this._renderConfig, t, e) ? e : void 0;
}
}, o.prototype._findSlotDFS = function(t, e, n) {
var o, r;
if (!t.children) return !1;
try {
for (var i = l(t.children), a = i.next(); !a.done; a = i.next()) {
var s = a.value;
if (n.push(s.props.name), s.props.name === e) return !0;
if (this._findSlotDFS(s, e, n)) return !0;
n.pop();
}
} catch (t) {
o = {
error: t
};
} finally {
try {
a && !a.done && (r = i.return) && r.call(i);
} finally {
if (o) throw o.error;
}
}
return !1;
}, o.prototype._withInstanceContext = function(t, e) {
var n = this._currentInstance;
this._currentInstance = t;
try {
e();
} finally {
this._currentInstance = n;
}
}, o.prototype._ensureNodeCache = function(t) {
var e, n;
if (!t.nodeCache) {
var o = {};
try {
for (var r = l(t.nodes), i = r.next(); !i.done; i = r.next()) {
var a = i.value, s = a.getName();
s && void 0 === o[s] && (o[s] = a);
}
} catch (t) {
e = {
error: t
};
} finally {
try {
i && !i.done && (n = r.return) && n.call(r);
} finally {
if (e) throw e.error;
}
}
t.nodeCache = o;
}
return t.nodeCache;
}, o.prototype._buildPropsMap = function(t) {
var e = {}, n = function(t) {
var o, r;
if (t && (e[t.props.name] = t.props, t.children)) try {
for (var i = l(t.children), a = i.next(); !a.done; a = i.next()) {
var s = a.value;
n(s);
}
} catch (t) {
o = {
error: t
};
} finally {
try {
a && !a.done && (r = i.return) && r.call(i);
} finally {
if (o) throw o.error;
}
}
};
return n(t), e;
}, o.prototype._normalizeSpineSlots = function(e, n) {
var o, r, i, a, s, u, h, p;
if (e.children) try {
for (var f = l(e.children), m = f.next(); !m.done; m = f.next()) {
var y = m.value;
this._normalizeSpineSlots(y, n);
}
} catch (t) {
o = {
error: t
};
} finally {
try {
m && !m.done && (r = f.return) && r.call(f);
} finally {
if (o) throw o.error;
}
}
if (e.type === t.RenderNodeType.Spine) {
var v = [];
if (e.children) try {
for (var _ = l(e.children), g = _.next(); !g.done; g = _.next()) (y = g.value)._boneName ? (null === (h = y.props) || void 0 === h ? void 0 : h.name) && delete n[y.props.name] : v.push(y);
} catch (t) {
i = {
error: t
};
} finally {
try {
g && !g.done && (a = _.return) && a.call(_);
} finally {
if (i) throw i.error;
}
}
var A = vo(e.props.slots);
try {
for (var C = l(A), R = C.next(); !R.done; R = C.next()) (null === (p = (y = R.value).props) || void 0 === p ? void 0 : p.name) && (n[y.props.name] = y.props);
} catch (t) {
s = {
error: t
};
} finally {
try {
R && !R.done && (u = C.return) && u.call(C);
} finally {
if (s) throw s.error;
}
}
var S = d(d([], c(A), !1), c(v), !1);
e.children = S.length > 0 ? S : void 0, delete e.props.slots;
}
}, o.prototype._compile = function(e) {
var n, o, r = this, i = new Di();
i.renderConfig = e;
try {
for (var a = l(this.getDependencies()), s = a.next(); !s.done; s = a.next()) {
var u = s.value;
"LogicAtom" === this.getDepAtomType(u) && i.logicDependencies.push(u);
}
} catch (t) {
n = {
error: t
};
} finally {
try {
s && !s.done && (o = a.return) && o.call(a);
} finally {
if (n) throw n.error;
}
}
var c = 0, d = function(e, n) {
var o, a, s, u, h, p = c++;
if (r._compileNodeProps(i, e, p, n), e.children) {
var f = e.type === t.RenderNodeType.ScrollView ? null === (u = null === (s = e.props) || void 0 === s ? void 0 : s.content) || void 0 === u ? void 0 : u.name : void 0;
try {
for (var m = l(e.children), y = m.next(); !y.done; y = m.next()) {
var v = y.value;
if (v._boneName) {
var _ = c;
i.boneAttachments.push({
childIndex: _,
parentIndex: p,
boneName: v._boneName,
bindAlpha: v._bindAlpha
});
}
f && (null === (h = v.props) || void 0 === h ? void 0 : h.name) === f && (i.scrollViewContent = {
scrollViewIndex: p,
contentIndex: c
}), d(v, !1);
}
} catch (t) {
o = {
error: t
};
} finally {
try {
y && !y.done && (a = m.return) && a.call(m);
} finally {
if (o) throw o.error;
}
}
}
};
return d(e, !0), i.totalNodes = c, i;
}, o.prototype._compileNodeProps = function(t, e, n, o) {
if (o) {
for (var r in e.props) Ii.has(r) && re(Et.WarnRootControlledProperty, {
atom: this.atomName,
property: r,
reason: "根节点的变换/尺寸属性应由 G_FAtom_Transform / G_FAtom_BoxComponent 控制，请勿在 defineRender 中显式设置"
});
this._injectTransformSync(t, e, n), this._injectBoxSync(t, e, n);
}
this._walkProps(t, e, n, e.props, Sr, "");
}, o.prototype._walkProps = function(t, e, n, o, r, i) {
for (var a in o) {
var s = o[a], u = i ? "".concat(i, ".").concat(a) : a, l = null == r ? void 0 : r[a];
if (this._isPlainObject(s) && l && "object" == typeof l) this._walkProps(t, e, n, s, l, u); else if ("event" !== i) {
var c = this._resolveSetter(l, u, e.type);
this._compileValue(t, n, c, s, a);
} else this._compileEvent(t, e, n, a, s);
}
}, o.prototype._resolveSetter = function(t, e, n) {
return t && "object" == typeof t && re(Et.RenderGroupAssign, {
node: n,
property: e
}), t || re(Et.RenderPropertyNotExist, {
node: n,
property: e
}), t;
}, o.prototype._isDynamicBinding = function(t) {
return Array.isArray(t) && "function" == typeof t[0];
}, o.prototype._makeFieldKey = function(t, e) {
return "".concat(t, ":").concat(e.join("."));
}, o.prototype._compileValue = function(t, e, n, o, r) {
var i, a, s, u;
this._isDynamicBinding(o) ? 1 === o.length ? (null !== (i = (s = t.nodeInitOps)[e]) && void 0 !== i ? i : s[e] = []).push({
nodeIndex: e,
setter: n,
getter: o[0]
}) : this._compilePreciseBinding(t, e, n, o, r) : (null !== (a = (u = t.nodeInitOps)[e]) && void 0 !== a ? a : u[e] = []).push({
nodeIndex: e,
setter: n,
getter: function() {
return o;
}
});
}, o.prototype._compilePreciseBinding = function(t, e, n, o) {
var r, i, a, s, u, d = c(o), h = d[0], p = d.slice(1), f = [];
try {
for (var m = l(p), y = m.next(); !y.done; y = m.next()) {
var v = c(y.value), _ = v[0], g = v.slice(1), A = null !== (a = _.atomName) && void 0 !== a ? a : _[ye];
if (A) {
var C = {
atomName: A,
fieldPath: g
};
f.push(C);
var R = this.atomWorld.getAtomIns(A);
"EntityComponentAtom" === (null == R ? void 0 : R.atomType) && this._injectComponentSetMethod(R, C);
}
}
} catch (t) {
r = {
error: t
};
} finally {
try {
y && !y.done && (i = m.return) && i.call(m);
} finally {
if (r) throw r.error;
}
}
var S = {
nodeIndex: e,
setter: n,
getter: h,
dependencies: f
};
t.preciseUpdateOps.push(S), (null !== (s = (u = t.nodeInitOps)[e]) && void 0 !== s ? s : u[e] = []).push({
nodeIndex: e,
setter: n,
getter: h
});
}, o.prototype._isPlainObject = function(t) {
if ("object" != typeof t || null === t) return !1;
var e = Object.getPrototypeOf(t);
return e === Object.prototype || null === e;
}, o.prototype._compileEvent = function(t, e, n, o, r) {
var i, a, s = Sr.event, u = s ? s[o] : void 0, l = null;
u && "function" == typeof u && (l = u), l || re(Et.RenderEventNotRegistered, {
node: e.type,
event: o
});
var c = this.atomWorld.getAtomIns(r[ye]);
(null !== (i = (a = t.nodeEventOps)[n]) && void 0 !== i ? i : a[n] = []).push({
eventName: o,
setter: l,
getter: function() {
return c;
}
});
}, o.prototype._injectTransformSync = function(t, e, n) {
this._injectComponentBindings(t, e, n, yn, 0);
}, o.prototype._injectBoxSync = function(t, e, n) {
this._injectComponentBindings(t, e, n, vn);
}, o.prototype._injectComponentBindings = function(t, e, n, o, r) {
var i = this.atomWorld.getAtomIns(o);
if (i) {
var a = i.atomState, s = this.atomWorld.ecsWorld, u = function(o) {
if (o in e.props) return "continue";
var u = Sr[o];
if (!u) return "continue";
l._compilePreciseBinding(t, n, function(t, e) {
void 0 !== e && u(t, e);
}, [ function(t) {
if (!Rt(s, t, a)) return r;
var e = a[o];
return e ? e[t] : r;
}, [ i, o ] ], o);
}, l = this;
for (var c in a) u(c);
}
}, o.prototype._registerPreciseTracking = function(t) {
var e, n, o = this._compiledRender;
if (0 !== o.preciseUpdateOps.length) {
t._dirtyPreciseOps = new Set();
for (var r = 0; r < o.preciseUpdateOps.length; r++) {
var i = o.preciseUpdateOps[r];
try {
for (var a = (e = void 0, l(i.dependencies)), s = a.next(); !s.done; s = a.next()) {
var u = s.value, c = this._makeFieldKey(u.atomName, u.fieldPath), d = this.atomWorld.universe, h = d.fieldWatchers.get(c);
h || (h = new Set(), d.fieldWatchers.set(c, h)), this._setupFieldInterceptor(u), 
h.add({
instance: t,
opIndex: r
});
}
} catch (t) {
e = {
error: t
};
} finally {
try {
s && !s.done && (n = a.return) && n.call(a);
} finally {
if (e) throw e.error;
}
}
}
}
}, o.prototype._unregisterPreciseTracking = function(t) {
var e, n, o, r, i, a;
if (t._dirtyPreciseOps) {
var s = this._compiledRender;
try {
for (var u = l(s.preciseUpdateOps), c = u.next(); !c.done; c = u.next()) {
var d = c.value;
try {
for (var h = (o = void 0, l(d.dependencies)), p = h.next(); !p.done; p = h.next()) {
var f = p.value, m = this._makeFieldKey(f.atomName, f.fieldPath), y = this.atomWorld.universe, v = y.fieldWatchers.get(m);
if (v) {
try {
for (var _ = (i = void 0, l(v)), g = _.next(); !g.done; g = _.next()) {
var A = g.value;
A.instance === t && v.delete(A);
}
} catch (t) {
i = {
error: t
};
} finally {
try {
g && !g.done && (a = _.return) && a.call(_);
} finally {
if (i) throw i.error;
}
}
0 === v.size && y.fieldWatchers.delete(m);
}
}
} catch (t) {
o = {
error: t
};
} finally {
try {
p && !p.done && (r = h.return) && r.call(h);
} finally {
if (o) throw o.error;
}
}
}
} catch (t) {
e = {
error: t
};
} finally {
try {
c && !c.done && (n = u.return) && n.call(u);
} finally {
if (e) throw e.error;
}
}
t._dirtyPreciseOps = void 0, t._preciseValueCache = void 0;
}
}, o.prototype._injectComponentSetMethod = function(t, e) {
var n, o = t.atomState;
if (o) {
for (var r = 0; r < e.fieldPath.length; r++) {
var i = e.fieldPath[r];
if (void 0 === (o = o[i])) return;
}
if (!(null === (n = o.set) || void 0 === n ? void 0 : n.__isAtomInterceptor)) {
var a = this.atomWorld.universe, s = function(t, n) {
o[t] = n, a.onFieldWrite(e.atomName, e.fieldPath, t);
};
s.__isAtomInterceptor = !0, Object.defineProperty(o, "set", {
value: s,
writable: !1,
enumerable: !1,
configurable: !0
});
}
}
}, o.prototype._setupFieldInterceptor = function(t) {
var e, n = this.atomWorld.getAtomIns(t.atomName);
if (n && "EntityComponentAtom" !== n.atomType) {
var o = n.atomState;
if (o) for (var r = function(n) {
var r = t.fieldPath[n];
if (!(r in o)) return {
value: void 0
};
if (n < t.fieldPath.length - 1) return o = o[r], "continue";
var a = Object.getOwnPropertyDescriptor(o, r);
if (null === (e = null == a ? void 0 : a.set) || void 0 === e ? void 0 : e.__isAtomInterceptor) return {
value: void 0
};
var s = o[r], u = i.atomWorld.universe, l = function(e) {
s = e, u.onFieldWrite(t.atomName, t.fieldPath);
};
l.__isAtomInterceptor = !0, Object.defineProperty(o, r, {
get: function() {
return s;
},
set: l,
enumerable: !0,
configurable: !0
});
}, i = this, a = 0; a < t.fieldPath.length; a++) {
var s = r(a);
if ("object" == typeof s) return s.value;
}
}
}, o.prototype.registerToChain = function(t) {
return this.genChain || (this.genChain = new Ce(this.atomWorld, this.atomName)), 
this.genChain.addAtom(t), this.genChain;
}, o.prototype.unregisterFromChain = function(t) {
if (!this.genChain) return !1;
var e = this.genChain.removeAtom(t);
return e && (this.genChain = null), e;
}, o.prototype.getChain = function() {
return this.genChain;
}, o[_e] = !0, o;
}(ge), Pi = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), Object.defineProperty(e, "atomType", {
get: function() {
return "LoadAtom";
},
enumerable: !1,
configurable: !0
}), e.prototype.collectLoad = function() {
this.atomWorld.loadTracker.addItems(e.LOAD_WEIGHT);
}, e.prototype.executeLoadDef = function(t, e) {
return s(this, void 0, void 0, function() {
var n, o, r, i, a, s, c, d, h, p, f, m, y, v, _, g, A, C, R, S, T, b, w, F, E, N, x, I, D, M, P, W, O, L, B, G, k, V = this;
return u(this, function(u) {
switch (u.label) {
case 0:
return this.atomWorld ? (n = t.paths, o = void 0 === n ? {} : n, r = t.directories, 
i = void 0 === r ? [] : r, a = t.onlyDownload, s = void 0 !== a && a, c = t.concurrency, 
d = t.downloadWorldBundles, h = this.atomWorld.universe.asset, p = (null == d ? void 0 : d.length) ? this.atomWorld.universe.featureResolver.getFeatureNamesForWorlds(d) : [], 
f = Object.values(o).reduce(function(t, e) {
var n;
return t + (null !== (n = null == e ? void 0 : e.length) && void 0 !== n ? n : 0);
}, 0), m = p.length + f + i.length, y = 0, p.length > 0 ? [ 4, h.preloadBundles(p, function() {
V.atomWorld && (y++, null == e || e(m > 0 ? y / m : 1));
}) ] : [ 3, 2 ]) : [ 2 ];

case 1:
if (u.sent(), !this.atomWorld) return [ 2 ];
u.label = 2;

case 2:
for (C in v = s ? h.preloadAsset.bind(h) : h.loadAsset.bind(h), _ = s ? h.preloadDir.bind(h) : h.loadDir.bind(h), 
A = [], g = o) A.push(C);
R = 0, u.label = 3;

case 3:
if (!(R < A.length)) return [ 3, 12 ];
if (!((C = A[R]) in g)) return [ 3, 11 ];
if (!(T = o[S = C])) return [ 3, 11 ];
u.label = 4;

case 4:
u.trys.push([ 4, 9, 10, 11 ]), L = void 0, b = l(T), w = b.next(), u.label = 5;

case 5:
return w.done ? [ 3, 8 ] : (D = w.value, F = Kn(D), P = F.featureName, E = F.assetPath, 
[ 4, v(P, E, S) ]);

case 6:
if (u.sent(), !this.atomWorld) return [ 2 ];
y++, null == e || e(m > 0 ? y / m : 1), u.label = 7;

case 7:
return w = b.next(), [ 3, 5 ];

case 8:
return [ 3, 11 ];

case 9:
return N = u.sent(), L = {
error: N
}, [ 3, 11 ];

case 10:
try {
w && !w.done && (B = b.return) && B.call(b);
} finally {
if (L) throw L.error;
}
return [ 7 ];

case 11:
return R++, [ 3, 3 ];

case 12:
u.trys.push([ 12, 17, 18, 19 ]), x = l(i), I = x.next(), u.label = 13;

case 13:
return I.done ? [ 3, 16 ] : (D = I.value, M = Kn(D), P = M.featureName, W = M.assetPath, 
[ 4, _(P, W, c) ]);

case 14:
if (u.sent(), !this.atomWorld) return [ 2 ];
y++, null == e || e(m > 0 ? y / m : 1), u.label = 15;

case 15:
return I = x.next(), [ 3, 13 ];

case 16:
return [ 3, 19 ];

case 17:
return O = u.sent(), G = {
error: O
}, [ 3, 19 ];

case 18:
try {
I && !I.done && (k = x.return) && k.call(x);
} finally {
if (G) throw G.error;
}
return [ 7 ];

case 19:
return [ 2 ];
}
});
});
}, e.prototype.onReady = function() {
return s(this, void 0, void 0, function() {
var t, n;
return u(this, function(o) {
switch (o.label) {
case 0:
return !(t = this.atomState = this.defineLoad()) || t.silent ? (this.atomWorld.loadTracker.complete(e.LOAD_WEIGHT), 
[ 2 ]) : (n = this.atomWorld.config.worldId, this.atomWorld.universe.featureResolver.shouldSkipNonSilentLoadAtoms(n) ? (this.atomWorld.loadTracker.complete(e.LOAD_WEIGHT), 
[ 2 ]) : [ 4, this.executeLoadDef(t) ]);

case 1:
return o.sent(), this.atomWorld ? (this.atomWorld.loadTracker.complete(e.LOAD_WEIGHT), 
[ 2 ]) : [ 2 ];
}
});
});
}, e[_e] = !0, e.LOAD_WEIGHT = 20, e;
}(ge), Wi = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), i([ Ie("G_FAtom_AudioPlayer") ], e);
}(Fi), Oi = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), i([ De("G_FAtom_Transform"), a("design:type", Object) ], e.prototype, "transform", void 0), 
i([ Ie(qe) ], e);
}(li), Li = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), i([ De(yn), a("design:type", Object) ], e.prototype, "transform", void 0), 
i([ De(vn), a("design:type", Object) ], e.prototype, "box", void 0), i([ De(_n), a("design:type", Object) ], e.prototype, "worldState", void 0), 
i([ Ie(Xe) ], e);
}(li), Bi = function(e) {
function o() {
return null !== e && e.apply(this, arguments) || this;
}
return n(o, e), o.prototype.defineRender = function() {
return Ei({
name: "Root",
blockInputEvents: !0,
widget: {
top: 0,
bottom: 0,
left: 0,
right: 0,
alignMode: t.WidgetAlignMode.Always
}
});
}, i([ Me, De("G_FAtom_RootDomain"), a("design:type", Object) ], o.prototype, "root", void 0), 
i([ Ie("G_FAtom_RootRender") ], o);
}(Mi), Gi = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineRender = function() {
return Ei({
name: "WorldContainer"
});
}, i([ Me, De(Xe), a("design:type", Object) ], e.prototype, "world", void 0), i([ Ie("G_FAtom_WorldRender") ], e);
}(Mi), ki = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineComponent = function() {
return {
x: 0,
y: 0,
z: 0,
quatX: 0,
quatY: 0,
quatZ: 0,
quatW: 1,
scaleX: 1,
scaleY: 1,
scaleZ: 1
};
}, i([ Ie(yn) ], e);
}(ui), Vi = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineComponent = function() {
return {
width: 0,
height: 0,
depth: 0,
anchorX: .5,
anchorY: .5,
anchorZ: .5
};
}, i([ Ie(vn) ], e);
}(ui), ji = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineComponent = function() {
return {
receiveInput: 1,
worldId: "",
randomSeed: 0,
multiTouch: !1
};
}, i([ Ie(_n) ], e);
}(ui), Hi = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineComponent = function() {
return {
name: ""
};
}, i([ Ie(gn) ], e);
}(ui), zi = function(t) {
function e() {
var e = t.apply(this, d([], c(arguments), !1)) || this;
return e.mountSlots = new Map(), e;
}
return n(e, t), e.prototype.defineRelation = function() {
return {
exclusive: !0,
autoRemoveSubject: !0
};
}, e.prototype.addChild = function(t, e, n) {
return this.getParent(e) === t && this.remove(t, e), n ? this.mountSlots.set(e, n) : this.mountSlots.delete(e), 
this.set(t, e);
}, e.prototype.removeChild = function(t, e) {
return this.mountSlots.delete(e), this.remove(t, e);
}, e.prototype.getParent = function(t) {
return this.getSource(t);
}, e.prototype.getChildren = function(t) {
return this.getTargets(t);
}, e.prototype.hasParent = function(t) {
return void 0 !== this.getParent(t);
}, e.prototype.hasChild = function(t, e) {
return this.has(t, e);
}, i([ Ie(mn) ], e);
}(ci), Ui = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), Object.defineProperty(e, "atomType", {
get: function() {
return "InputAtom";
},
enumerable: !1,
configurable: !0
}), Object.defineProperty(e.prototype, "data", {
get: function() {
return this.atomState;
},
enumerable: !1,
configurable: !0
}), e.prototype.fill = function(t) {
Object.assign(this.atomState, t);
}, e.prototype.onReady = function() {
return s(this, void 0, void 0, function() {
return u(this, function() {
return this.atomState = o(o({}, this.defineInputData()), {
eid: 0
}), [ 2 ];
});
});
}, e.prototype.emit = function(t) {
var e = null != t ? t : this.atomState.eid || this.atomWorld.rootEid;
this.atomState.eid = e, this.atomWorld.pushInput(this, e, o({}, this.atomState));
}, e.prototype.emitByRouter = function(t, e) {
var n = null != e ? e : this.atomState.eid || this.atomWorld.rootEid;
this.atomState.eid = n;
var r = this.atomWorld.getAtomIns(t);
this.atomWorld.pendingRouterSignals.push({
fromRouterName: t,
signalName: r.to.atomName,
eidList: [ n ],
inputData: o({}, this.atomState)
});
}, e[_e] = !0, e;
}(gi), Yi = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {
x: 0,
y: 0,
dx: 0,
dy: 0,
touchId: 0,
eid: 0,
localX: 0,
localY: 0,
multiTouchs: []
};
}, i([ De(qe), a("design:type", Object) ], e.prototype, "rootDomain", void 0), i([ Ie(Je) ], e);
}(Ui), qi = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {
contentX: 0,
contentY: 0,
eid: 0
};
}, i([ De("G_FAtom_RootDomain"), a("design:type", Object) ], e.prototype, "rootDomain", void 0), 
i([ Ie($e) ], e);
}(Ui), Xi = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {
width: 0,
height: 0,
eid: 0
};
}, i([ De("G_FAtom_RootDomain"), a("design:type", Object) ], e.prototype, "rootDomain", void 0), 
i([ Ie(tn) ], e);
}(Ui), Qi = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {
x: 0,
y: 0,
eid: 0
};
}, i([ De("G_FAtom_RootDomain"), a("design:type", Object) ], e.prototype, "rootDomain", void 0), 
i([ Ie(en) ], e);
}(Ui), Ji = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {
text: "",
eid: 0
};
}, i([ De("G_FAtom_RootDomain"), a("design:type", Object) ], e.prototype, "rootDomain", void 0), 
i([ Ie(nn) ], e);
}(Ui), Zi = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {
frameEventName: "",
eid: 0
};
}, i([ De("G_FAtom_RootDomain"), a("design:type", Object) ], e.prototype, "rootDomain", void 0), 
i([ Ie(on) ], e);
}(Ui), Ki = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {
keyCode: 0,
isDown: !1
};
}, i([ De("G_FAtom_RootDomain"), a("design:type", Object) ], e.prototype, "root", void 0), 
i([ Ie(Ze) ], e);
}(Ui), $i = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {
width: 0,
height: 0
};
}, i([ De("G_FAtom_RootDomain"), a("design:type", Object) ], e.prototype, "root", void 0), 
i([ Ie(Ke) ], e);
}(Ui), ta = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
var t = Date.now() / 1e3, e = this.atomWorld.universe.storage, n = e.loadStorage(this.atomName);
if (n) {
var o = n.lastWorldStartTime;
t < o && (t = o);
}
return e.saveStorage(this.atomName, {
lastWorldStartTime: t
}), {
worldTime: 0,
framecount: 0,
deltaTime: this.atomWorld.frameTimeIncrement,
worldStartTime: t
};
}, e.prototype.emit = function() {
this.data.worldTime += this.atomWorld.frameTimeIncrement, this.data.framecount += 1, 
this.data.deltaTime = this.atomWorld.frameTimeIncrement, t.prototype.emit.call(this);
}, i([ De("G_FAtom_RootDomain"), a("design:type", Object) ], e.prototype, "root", void 0), 
i([ Ie(Qe) ], e);
}(Ui), ea = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {
rootEid: 0
};
}, i([ De("G_FAtom_RootDomain"), a("design:type", Object) ], e.prototype, "rootDomain", void 0), 
i([ Ie(rn) ], e);
}(Ui), na = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {};
}, i([ De("G_FAtom_RootDomain"), a("design:type", Object) ], e.prototype, "rootDomain", void 0), 
i([ Ie("G_FAtom_WorldResume") ], e);
}(Ui), oa = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {};
}, i([ De("G_FAtom_RootDomain"), a("design:type", Object) ], e.prototype, "root", void 0), 
i([ Ie("G_FAtom_UIEvent") ], e);
}(Ui), ra = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {};
}, i([ De(qe), a("design:type", Object) ], e.prototype, "rootDomain", void 0), i([ Ie(Tn) ], e);
}(Ui), ia = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {};
}, i([ De(qe), a("design:type", Object) ], e.prototype, "rootDomain", void 0), i([ Ie(bn) ], e);
}(Ui), aa = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {
param: ""
};
}, i([ De(qe), a("design:type", Object) ], e.prototype, "rootDomain", void 0), i([ Ie(wn) ], e);
}(Ui), sa = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {};
}, i([ De("G_FAtom_RootDomain"), a("design:type", Object) ], e.prototype, "root", void 0), 
i([ Ie("G_FAtom_TweenEvent") ], e);
}(Ui), ua = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {
x: 0,
y: 0
};
}, i([ De("G_FAtom_RootDomain"), a("design:type", Object) ], e.prototype, "root", void 0), 
i([ Ie("G_FAtom_UniverseOffsetInput") ], e);
}(Ui);
t.OriginalCtrlOperation = void 0, (mi = t.OriginalCtrlOperation || (t.OriginalCtrlOperation = {})).Create = "create", 
mi.Destroy = "destroy", mi.Restart = "restart";
var la, ca = function(e) {
function o() {
return null !== e && e.apply(this, arguments) || this;
}
return n(o, e), o.prototype.defineInputData = function() {
return {
operation: t.OriginalCtrlOperation.Create,
worldId: ""
};
}, i([ De(qe), a("design:type", Object) ], o.prototype, "rootDomain", void 0), i([ Ie(An) ], o);
}(Ui), da = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {};
}, i([ De("G_FAtom_RootDomain"), a("design:type", Object) ], e.prototype, "root", void 0), 
i([ Ie(sn) ], e);
}(Ui), ha = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {
durationMs: 0
};
}, i([ De("G_FAtom_RootDomain"), a("design:type", Object) ], e.prototype, "root", void 0), 
i([ Ie(un) ], e);
}(Ui), pa = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), Object.defineProperty(e, "atomType", {
get: function() {
return "OutputAtom";
},
enumerable: !1,
configurable: !0
}), e.prototype.onReady = function() {
return s(this, void 0, void 0, function() {
var t;
return u(this, function() {
return t = this.defineFunction(), this.atomState = function() {
for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
return t.apply(void 0, d([], c(e), !1));
}, [ 2 ];
});
});
}, e[_e] = !0, e;
}(hi), fa = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
t.atomWorld.markSaveProgress();
};
}, i([ Ie(cn) ], e);
}(pa), ma = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
t.atomWorld.universe.host.showBanner();
};
}, i([ Ie("G_FAtom_ADShowBanner") ], e);
}(hi), ya = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
t.atomWorld.universe.host.hideBanner();
};
}, i([ Ie("G_FAtom_ADHideBanner") ], e);
}(hi), va = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
var e = t.atomWorld.universe.host;
e.setAdRequestWorld(t.atomWorld), e.showRewardVideo();
};
}, i([ Ie("G_FAtom_ADShowRewardVideo") ], e);
}(hi), _a = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
var e = t.atomWorld.universe.host;
e.setAdRequestWorld(t.atomWorld), e.showInterstitial();
};
}, i([ Ie("G_FAtom_ADShowInterstitial") ], e);
}(hi), ga = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
var e = t.atomWorld.universe.host;
e.setAdRequestWorld(t.atomWorld), e.showFullscreenAd();
};
}, i([ Ie("G_FAtom_ADShowFullscreenAd") ], e);
}(hi), Aa = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
t.atomWorld.universe.host.loadRewardAd();
};
}, i([ Ie("G_FAtom_ADLoadRewardAd") ], e);
}(hi), Ca = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
t.atomWorld.universe.host.loadInterstitialAd();
};
}, i([ Ie("G_FAtom_ADLoadInterstitialAd") ], e);
}(hi), Ra = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
t.atomWorld.universe.host.loadFullscreenAd();
};
}, i([ Ie("G_FAtom_ADLoadFullscreenAd") ], e);
}(hi), Sa = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
t.atomWorld.universe.host.loadAllAds();
};
}, i([ Ie("G_FAtom_ADLoadAllAds") ], e);
}(hi), Ta = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
return t.atomWorld.universe.host.canShowAd();
};
}, i([ Ie("G_FAtom_ADCanShowAd") ], e);
}(hi), ba = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
return t.atomWorld.universe.host.isAdLoading();
};
}, i([ Ie("G_FAtom_ADIsAdLoading") ], e);
}(hi), wa = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e) {
return t.atomWorld.universe.host.getAdReadyState(e);
};
}, i([ Ie("G_FAtom_ADGetAdReadyState") ], e);
}(hi), Fa = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e, n) {
void 0 === e && (e = 1), void 0 === n && (n = 15), t.atomWorld.universe.host.vibrate(e, n);
};
}, i([ Ie("G_FAtom_Vibrate") ], e);
}(pa), Ea = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
return t.atomWorld.universe.host.getNetworkState();
};
}, i([ Ie("G_FAtom_GetNetworkState") ], e);
}(hi), Na = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
return t.atomWorld.universe.host.getNetworkType();
};
}, i([ Ie("G_FAtom_GetNetworkType") ], e);
}(hi), xa = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
return t.atomWorld.universe.render.getWinSize();
};
}, i([ Ie("G_FAtom_GetWinSize") ], e);
}(hi), Ia = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
return t.atomWorld.universe.render.getDesignSize();
};
}, i([ Ie("G_FAtom_GetDesignSize") ], e);
}(hi), Da = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
return t.atomWorld.universe.render.getSafeAreaRect();
};
}, i([ Ie("G_FAtom_GetSafeArea") ], e);
}(hi), Ma = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
return t.atomWorld.universe.host.getUniverseOffset();
};
}, i([ Ie("G_FAtom_GetUniverseOffset") ], e);
}(hi), Pa = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
return t.atomWorld.universe.host.getDeviceInfo();
};
}, i([ Ie("G_FAtom_GetDeviceInfo") ], e);
}(pa), Wa = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
return t.atomWorld.universe.host.getTotalRAM();
};
}, i([ Ie("G_FAtom_GetTotalRAM") ], e);
}(pa), Oa = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
return t.atomWorld.universe.host.getAvailableRAM();
};
}, i([ Ie("G_FAtom_GetAvailableRAM") ], e);
}(pa), La = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
return t.atomWorld.universe.host.getCPUCores();
};
}, i([ Ie("G_FAtom_GetCPUCores") ], e);
}(pa), Ba = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
return t.atomWorld.universe.host.getCPUMaxFreq();
};
}, i([ Ie("G_FAtom_GetCPUMaxFreq") ], e);
}(pa), Ga = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
return t.atomWorld.universe.host.isLowEndDevice();
};
}, i([ Ie("G_FAtom_IsLowEndDevice") ], e);
}(pa), ka = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), i([ De(qe), a("design:type", Object) ], e.prototype, "rootDomain", void 0), 
i([ Ie(dn) ], e);
}(gi), Va = function(e) {
function o() {
return null !== e && e.apply(this, arguments) || this;
}
return n(o, e), i([ Oe, De(Qe), a("design:type", Object) ], o.prototype, "update", void 0), 
i([ Le(t.RouteMode.Direct), De(dn), a("design:type", Object) ], o.prototype, "signal", void 0), 
i([ Ie(hn) ], o);
}(Ri), ja = function(e) {
function o() {
return null !== e && e.apply(this, arguments) || this;
}
return n(o, e), o.prototype.defineRuntimeData = function() {
return {
lastSaveTime: 0,
interval: 1
};
}, o.prototype.onExecute = function(e, n) {
var o = this.atomWorld.updateSignal.data.worldTime;
o - n.runtime.lastSaveTime >= n.runtime.interval ? n.runtime.lastSaveTime = o : this.router.receiveAction = t.ReceiveAction.Discard;
}, i([ We, Pe, De(hn), a("design:type", Object) ], o.prototype, "router", void 0), 
i([ Ie("G_FAtom_AutoSaveReceive") ], o);
}(pi), Ha = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineRuntimeData = function() {
return {};
}, e.prototype.onExecute = function() {
this.saveProgress();
}, i([ Pe, De(dn), a("design:type", Object) ], e.prototype, "signal", void 0), i([ De(cn), a("design:type", Object) ], e.prototype, "saveProgress", void 0), 
i([ Ie("G_FAtom_AutoSaveLogic") ], e);
}(pi), za = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {};
}, e.prototype.receive = function(e, n) {
t.prototype.receive.call(this, e, n), this.atomWorld.getAtomIns(Xe).destroy(this.data.childWorldEid);
}, e[_e] = !0, i([ Ie("G_FAtom_ExitRequest") ], e);
}(bi), Ua = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this.atomWorld;
return function(e, n) {
if (e > n) return e;
var o = 16807 * (Math.abs(t.randomSeed) % 2147483646 || 1) % 2147483647;
return t.randomSeed = o, e + (o - 1) / 2147483646 * (n - e);
};
}, i([ Ie("G_FAtom_MathRandom") ], e);
}(hi), Ya = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e, n) {
return Math.floor(t.random(e, n + 1));
};
}, i([ De("G_FAtom_MathRandom"), a("design:type", Object) ], e.prototype, "random", void 0), 
i([ Ie("G_FAtom_MathRandomInt") ], e);
}(hi), qa = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.abs(t);
};
}, i([ Ie("G_FAtom_MathAbs") ], e);
}(hi), Xa = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.sign(t);
};
}, i([ Ie("G_FAtom_MathSign") ], e);
}(hi), Qa = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.ceil(t);
};
}, i([ Ie("G_FAtom_MathCeil") ], e);
}(hi), Ja = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.floor(t);
};
}, i([ Ie("G_FAtom_MathFloor") ], e);
}(hi), Za = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.round(t);
};
}, i([ Ie("G_FAtom_MathRound") ], e);
}(hi), Ka = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.trunc(t);
};
}, i([ Ie("G_FAtom_MathTrunc") ], e);
}(hi), $a = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t, e) {
return Math.pow(t, e);
};
}, i([ Ie("G_FAtom_MathPow") ], e);
}(hi), ts = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.sqrt(t);
};
}, i([ Ie("G_FAtom_MathSqrt") ], e);
}(hi), es = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.cbrt(t);
};
}, i([ Ie("G_FAtom_MathCbrt") ], e);
}(hi), ns = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function() {
for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
return Math.hypot.apply(Math, d([], c(t), !1));
};
}, i([ Ie("G_FAtom_MathHypot") ], e);
}(hi), os = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.exp(t);
};
}, i([ Ie("G_FAtom_MathExp") ], e);
}(hi), rs = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.expm1(t);
};
}, i([ Ie("G_FAtom_MathExpm1") ], e);
}(hi), is = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.log(t);
};
}, i([ Ie("G_FAtom_MathLog") ], e);
}(hi), as = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.log10(t);
};
}, i([ Ie("G_FAtom_MathLog10") ], e);
}(hi), ss = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.log2(t);
};
}, i([ Ie("G_FAtom_MathLog2") ], e);
}(hi), us = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.log1p(t);
};
}, i([ Ie("G_FAtom_MathLog1p") ], e);
}(hi), ls = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.sin(t);
};
}, i([ Ie("G_FAtom_MathSin") ], e);
}(hi), cs = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.cos(t);
};
}, i([ Ie("G_FAtom_MathCos") ], e);
}(hi), ds = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.tan(t);
};
}, i([ Ie("G_FAtom_MathTan") ], e);
}(hi), hs = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.asin(t);
};
}, i([ Ie("G_FAtom_MathAsin") ], e);
}(hi), ps = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.acos(t);
};
}, i([ Ie("G_FAtom_MathAcos") ], e);
}(hi), fs = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.atan(t);
};
}, i([ Ie("G_FAtom_MathAtan") ], e);
}(hi), ms = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t, e) {
return Math.atan2(t, e);
};
}, i([ Ie("G_FAtom_MathAtan2") ], e);
}(hi), ys = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.sinh(t);
};
}, i([ Ie("G_FAtom_MathSinh") ], e);
}(hi), vs = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.cosh(t);
};
}, i([ Ie("G_FAtom_MathCosh") ], e);
}(hi), _s = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.tanh(t);
};
}, i([ Ie("G_FAtom_MathTanh") ], e);
}(hi), gs = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.asinh(t);
};
}, i([ Ie("G_FAtom_MathAsinh") ], e);
}(hi), As = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.acosh(t);
};
}, i([ Ie("G_FAtom_MathAcosh") ], e);
}(hi), Cs = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.atanh(t);
};
}, i([ Ie("G_FAtom_MathAtanh") ], e);
}(hi), Rs = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function() {
for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
return Math.max.apply(Math, d([], c(t), !1));
};
}, i([ Ie("G_FAtom_MathMax") ], e);
}(hi), Ss = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function() {
for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
return Math.min.apply(Math, d([], c(t), !1));
};
}, i([ Ie("G_FAtom_MathMin") ], e);
}(hi), Ts = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.clz32(t);
};
}, i([ Ie("G_FAtom_MathClz32") ], e);
}(hi), bs = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t, e) {
return Math.imul(t, e);
};
}, i([ Ie("G_FAtom_MathImul") ], e);
}(hi), ws = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return Math.fround(t);
};
}, i([ Ie("G_FAtom_MathFround") ], e);
}(hi), Fs = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e, n, o) {
return t.max(n, t.min(o, e));
};
}, i([ De("G_FAtom_MathMin"), a("design:type", Object) ], e.prototype, "min", void 0), 
i([ De("G_FAtom_MathMax"), a("design:type", Object) ], e.prototype, "max", void 0), 
i([ Ie("G_FAtom_MathClamp") ], e);
}(hi), Es = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t, e, n) {
return t + (e - t) * n;
};
}, i([ Ie("G_FAtom_MathLerp") ], e);
}(hi), Ns = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e, n, o, r) {
return t.hypot(o - e, r - n);
};
}, i([ De("G_FAtom_MathHypot"), a("design:type", Object) ], e.prototype, "hypot", void 0), 
i([ Ie("G_FAtom_MathDistance") ], e);
}(hi), xs = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return t * (Math.PI / 180);
};
}, i([ Ie("G_FAtom_MathDegToRad") ], e);
}(hi), Is = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
return t * (180 / Math.PI);
};
}, i([ Ie("G_FAtom_MathRadToDeg") ], e);
}(hi), Ds = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t, e, n) {
return t === e ? 0 : (n - t) / (e - t);
};
}, i([ Ie("G_FAtom_MathInverseLerp") ], e);
}(hi), Ms = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e, n, o) {
var r = t.clamp((o - e) / (n - e), 0, 1);
return r * r * (3 - 2 * r);
};
}, i([ De("G_FAtom_MathClamp"), a("design:type", Object) ], e.prototype, "clamp", void 0), 
i([ Ie("G_FAtom_MathSmoothstep") ], e);
}(hi), Ps = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e, n, o) {
return t.abs(n - e) <= o ? n : e + Math.sign(n - e) * o;
};
}, i([ De("G_FAtom_MathAbs"), a("design:type", Object) ], e.prototype, "abs", void 0), 
i([ Ie("G_FAtom_MathMoveTowards") ], e);
}(hi), Ws = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t, e) {
return 0 === e ? 0 : t - Math.floor(t / e) * e;
};
}, i([ Ie("G_FAtom_MathRepeat") ], e);
}(hi), Os = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e, n) {
if (0 === n) return 0;
var o = t.repeat(e, 2 * n);
return n - t.abs(o - n);
};
}, i([ De("G_FAtom_MathRepeat"), a("design:type", Object) ], e.prototype, "repeat", void 0), 
i([ De("G_FAtom_MathAbs"), a("design:type", Object) ], e.prototype, "abs", void 0), 
i([ Ie("G_FAtom_MathPingPong") ], e);
}(hi), Ls = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e, n) {
return t.abs(e - n) < t.max(1e-6 * t.max(t.abs(e), t.abs(n)), 1e-6);
};
}, i([ De("G_FAtom_MathAbs"), a("design:type", Object) ], e.prototype, "abs", void 0), 
i([ De("G_FAtom_MathMax"), a("design:type", Object) ], e.prototype, "max", void 0), 
i([ Ie("G_FAtom_MathApproximately") ], e);
}(hi), Bs = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e, n, o, r, i) {
var a = t.inverseLerp(n, o, e);
return t.lerp(r, i, a);
};
}, i([ De("G_FAtom_MathInverseLerp"), a("design:type", Object) ], e.prototype, "inverseLerp", void 0), 
i([ De("G_FAtom_MathLerp"), a("design:type", Object) ], e.prototype, "lerp", void 0), 
i([ Ie("G_FAtom_MathRemap") ], e);
}(hi), Gs = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t, e) {
return 0 === e ? t : Math.round(t / e) * e;
};
}, i([ Ie("G_FAtom_MathSnap") ], e);
}(hi), ks = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e) {
return t.repeat(e + 180, 360) - 180;
};
}, i([ De("G_FAtom_MathRepeat"), a("design:type", Object) ], e.prototype, "repeat", void 0), 
i([ Ie("G_FAtom_MathWrapAngle") ], e);
}(hi), Vs = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e, n, o, r, i, a) {
return t.hypot(r - e, i - n, a - o);
};
}, i([ De("G_FAtom_MathHypot"), a("design:type", Object) ], e.prototype, "hypot", void 0), 
i([ Ie("G_FAtom_MathDistance3D") ], e);
}(hi), js = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e, n) {
var o = t.repeat(n - e, 360);
return o > 180 && (o -= 360), o;
};
}, i([ De("G_FAtom_MathRepeat"), a("design:type", Object) ], e.prototype, "repeat", void 0), 
i([ Ie("G_FAtom_MathDeltaAngle") ], e);
}(hi), Hs = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e, n, o) {
var r = t.deltaAngle(e, n);
return t.moveTowards(e, e + r, o);
};
}, i([ De("G_FAtom_MathDeltaAngle"), a("design:type", Object) ], e.prototype, "deltaAngle", void 0), 
i([ De("G_FAtom_MathMoveTowards"), a("design:type", Object) ], e.prototype, "moveTowards", void 0), 
i([ Ie("G_FAtom_MathMoveTowardsAngle") ], e);
}(hi), zs = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e, n) {
if (void 0 === n && (n = 1), e > 0 && n > 0) {
var o = 1 / e;
t.atomWorld.frameTimeIncrement = o, t.atomWorld.performanceCutoff = n, t.atomWorld.minimumUpdateInterval = n * o;
}
};
}, i([ Ie("G_FAtom_SetFrameRate") ], e);
}(hi), Us = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return function(t) {
for (var e = 5381, n = 0; n < t.length; n++) e = (e << 5) + e + t.charCodeAt(n);
return e >>> 0;
};
}, i([ Ie("G_FAtom_StringHash") ], e);
}(hi), Ys = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
return t.atomWorld.universe.host.getLaunchParams();
};
}, i([ Ie("G_FAtom_GetLaunchParams") ], e);
}(hi), qs = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
var e = new Date(t.dateNow()), n = e.getFullYear(), o = String(e.getMonth() + 1).padStart(2, "0"), r = String(e.getDate()).padStart(2, "0");
return "".concat(n, "-").concat(o, "-").concat(r);
};
}, i([ De(ln), a("design:type", Object) ], e.prototype, "dateNow", void 0), i([ Ie("G_FAtom_GetCurrentDate") ], e);
}(hi), Xs = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
return 1e3 * (t.update.worldStartTime + t.update.worldTime);
};
}, i([ De("G_FAtom_Update"), a("design:type", Object) ], e.prototype, "update", void 0), 
i([ Ie(ln) ], e);
}(hi);
if ("undefined" != typeof performance && "function" == typeof performance.now) la = function() {
return performance.now();
}; else {
var Qs = Date.now(), Js = 0;
la = function() {
var t = Date.now() - Qs;
return t >= Js && (Js = t), Js;
};
}
var Zs, Ks, $s, tu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
return la;
}, i([ Ie("G_FAtom_PerformanceNow") ], e);
}(hi);
t.TweenStepType = void 0, (Ks = t.TweenStepType || (t.TweenStepType = {}))[Ks.To = 0] = "To", 
Ks[Ks.By = 1] = "By", Ks[Ks.Delay = 2] = "Delay", Ks[Ks.Router = 3] = "Router", 
Ks[Ks.Parallel = 4] = "Parallel", Ks[Ks.Repeat = 5] = "Repeat", Ks[Ks.Destroy = 6] = "Destroy", 
t.TweenEasing = void 0, ($s = t.TweenEasing || (t.TweenEasing = {}))[$s.Linear = 0] = "Linear", 
$s[$s.QuadIn = 1] = "QuadIn", $s[$s.QuadOut = 2] = "QuadOut", $s[$s.QuadInOut = 3] = "QuadInOut", 
$s[$s.CubicIn = 4] = "CubicIn", $s[$s.CubicOut = 5] = "CubicOut", $s[$s.CubicInOut = 6] = "CubicInOut", 
$s[$s.QuartIn = 7] = "QuartIn", $s[$s.QuartOut = 8] = "QuartOut", $s[$s.QuartInOut = 9] = "QuartInOut", 
$s[$s.QuintIn = 10] = "QuintIn", $s[$s.QuintOut = 11] = "QuintOut", $s[$s.QuintInOut = 12] = "QuintInOut", 
$s[$s.SineIn = 13] = "SineIn", $s[$s.SineOut = 14] = "SineOut", $s[$s.SineInOut = 15] = "SineInOut", 
$s[$s.ExpoIn = 16] = "ExpoIn", $s[$s.ExpoOut = 17] = "ExpoOut", $s[$s.ExpoInOut = 18] = "ExpoInOut", 
$s[$s.CircIn = 19] = "CircIn", $s[$s.CircOut = 20] = "CircOut", $s[$s.CircInOut = 21] = "CircInOut", 
$s[$s.ElasticIn = 22] = "ElasticIn", $s[$s.ElasticOut = 23] = "ElasticOut", $s[$s.ElasticInOut = 24] = "ElasticInOut", 
$s[$s.BackIn = 25] = "BackIn", $s[$s.BackOut = 26] = "BackOut", $s[$s.BackInOut = 27] = "BackInOut", 
$s[$s.BounceIn = 28] = "BounceIn", $s[$s.BounceOut = 29] = "BounceOut", $s[$s.BounceInOut = 30] = "BounceInOut";
var eu = ((Zs = {})[t.TweenEasing.Linear] = function(t) {
return t;
}, Zs[t.TweenEasing.QuadIn] = function(t) {
return t * t;
}, Zs[t.TweenEasing.QuadOut] = function(t) {
return t * (2 - t);
}, Zs[t.TweenEasing.QuadInOut] = function(t) {
return t < .5 ? 2 * t * t : (4 - 2 * t) * t - 1;
}, Zs[t.TweenEasing.CubicIn] = function(t) {
return t * t * t;
}, Zs[t.TweenEasing.CubicOut] = function(t) {
return --t * t * t + 1;
}, Zs[t.TweenEasing.CubicInOut] = function(t) {
return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}, Zs[t.TweenEasing.QuartIn] = function(t) {
return t * t * t * t;
}, Zs[t.TweenEasing.QuartOut] = function(t) {
return 1 - --t * t * t * t;
}, Zs[t.TweenEasing.QuartInOut] = function(t) {
return t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
}, Zs[t.TweenEasing.QuintIn] = function(t) {
return t * t * t * t * t;
}, Zs[t.TweenEasing.QuintOut] = function(t) {
return 1 + --t * t * t * t * t;
}, Zs[t.TweenEasing.QuintInOut] = function(t) {
return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}, Zs[t.TweenEasing.SineIn] = function(t) {
return 1 - Math.cos(t * Math.PI / 2);
}, Zs[t.TweenEasing.SineOut] = function(t) {
return Math.sin(t * Math.PI / 2);
}, Zs[t.TweenEasing.SineInOut] = function(t) {
return .5 * (1 - Math.cos(Math.PI * t));
}, Zs[t.TweenEasing.ExpoIn] = function(t) {
return 0 === t ? 0 : Math.pow(2, 10 * (t - 1));
}, Zs[t.TweenEasing.ExpoOut] = function(t) {
return 1 === t ? 1 : 1 - Math.pow(2, -10 * t);
}, Zs[t.TweenEasing.ExpoInOut] = function(t) {
return 0 === t || 1 === t ? t : (t *= 2) < 1 ? .5 * Math.pow(2, 10 * (t - 1)) : .5 * (2 - Math.pow(2, -10 * (t - 1)));
}, Zs[t.TweenEasing.CircIn] = function(t) {
return 1 - Math.sqrt(1 - t * t);
}, Zs[t.TweenEasing.CircOut] = function(t) {
return Math.sqrt(1 - --t * t);
}, Zs[t.TweenEasing.CircInOut] = function(t) {
return (t *= 2) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
}, Zs[t.TweenEasing.ElasticIn] = function(t) {
return 0 === t || 1 === t ? t : -Math.pow(2, 10 * (t - 1)) * Math.sin(5 * (t - 1.1) * Math.PI);
}, Zs[t.TweenEasing.ElasticOut] = function(t) {
return 0 === t || 1 === t ? t : Math.pow(2, -10 * t) * Math.sin(5 * (t - .1) * Math.PI) + 1;
}, Zs[t.TweenEasing.ElasticInOut] = function(t) {
return 0 === t || 1 === t ? t : (t *= 2) < 1 ? -.5 * Math.pow(2, 10 * (t - 1)) * Math.sin(5 * (t - 1.1) * Math.PI) : .5 * Math.pow(2, -10 * (t - 1)) * Math.sin(5 * (t - 1.1) * Math.PI) + 1;
}, Zs[t.TweenEasing.BackIn] = function(t) {
return t * t * (2.70158 * t - 1.70158);
}, Zs[t.TweenEasing.BackOut] = function(t) {
return --t * t * (2.70158 * t + 1.70158) + 1;
}, Zs[t.TweenEasing.BackInOut] = function(t) {
var e = 2.5949095;
return (t *= 2) < 1 ? t * t * ((e + 1) * t - e) * .5 : .5 * ((t -= 2) * t * ((e + 1) * t + e) + 2);
}, Zs[t.TweenEasing.BounceIn] = function(e) {
return 1 - eu[t.TweenEasing.BounceOut](1 - e);
}, Zs[t.TweenEasing.BounceOut] = function(t) {
return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375;
}, Zs[t.TweenEasing.BounceInOut] = function(e) {
return e < .5 ? .5 * eu[t.TweenEasing.BounceIn](2 * e) : .5 * eu[t.TweenEasing.BounceOut](2 * e - 1) + .5;
}, Zs), nu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e, n, o) {
if (null != e && Array.isArray(n)) {
var r = t.runner.runtime, i = r.tasksMap[e];
i || (i = [], r.tasksMap[e] = i), i.push({
eid: e,
steps: n,
tag: o,
currentStepIndex: 0,
elapsedTime: 0,
isFinished: !1,
stepData: void 0
});
}
};
}, i([ De(fn), a("design:type", Object) ], e.prototype, "runner", void 0), i([ Ie("G_FAtom_Tween") ], e);
}(hi), ou = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e, n) {
if (void 0 !== e) {
var o = t.runner.runtime;
if (null !== e) {
if (!(a = o.tasksMap[e])) return;
if (n) {
for (var r = a.length - 1; r >= 0; r--) a[r].tag === n && a.splice(r, 1);
0 === a.length && delete o.tasksMap[e];
} else delete o.tasksMap[e];
} else if (n) for (var i in o.tasksMap) {
var a;
for (r = (a = o.tasksMap[i]).length - 1; r >= 0; r--) a[r].tag === n && a.splice(r, 1);
0 === a.length && delete o.tasksMap[i];
}
}
};
}, i([ De(fn), a("design:type", Object) ], e.prototype, "runner", void 0), i([ Ie("G_FAtom_StopTween") ], e);
}(hi), ru = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {
progress: 0,
isDone: !1,
error: ""
};
}, i([ De("G_FAtom_RootDomain"), a("design:type", Object) ], e.prototype, "root", void 0), 
i([ Ie(Rn) ], e);
}(Ui), iu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this, e = {}, n = function(n, o, r, i) {
if (!t.atomWorld.disposed) {
var a = e[n];
if (a) {
var s = t.atomWorld.getAtomIns(Rn), u = s.data;
u.progress = o, u.isDone = r, u.error = i, s.emitByRouter(a), (r || i) && delete e[n];
}
}
};
return function(o, r) {
var i = o[ye], a = t.atomWorld.getAtomIns(i).atomState;
if (null == a ? void 0 : a.silent) {
if (r) {
var l = r[ye];
e[i] = l;
}
!function(e, o) {
s(t, void 0, void 0, function() {
var t, r;
return u(this, function(i) {
switch (i.label) {
case 0:
if (!this.atomWorld) return [ 2 ];
n(e, 0, !1, ""), i.label = 1;

case 1:
return i.trys.push([ 1, 3, , 4 ]), [ 4, this.atomWorld.getAtomIns(e).executeLoadDef(o, function(t) {
n(e, t, !1, "");
}) ];

case 2:
return i.sent(), this.atomWorld ? (n(e, 1, !0, ""), [ 3, 4 ]) : [ 2 ];

case 3:
return t = i.sent(), r = t instanceof Error ? t.message : String(t), this.atomWorld ? (n(e, 0, !1, r), 
[ 3, 4 ]) : [ 2 ];

case 4:
return [ 2 ];
}
});
});
}(i, a);
}
};
}, i([ De(Rn), a("design:type", Object) ], e.prototype, "input", void 0), i([ Ie("G_FAtom_SilentLoad") ], e);
}(hi), au = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {
url: "",
jsonData: "",
error: ""
};
}, i([ De("G_FAtom_RootDomain"), a("design:type", Object) ], e.prototype, "root", void 0), 
i([ Ie(Sn) ], e);
}(Ui), su = function(e) {
function o() {
return null !== e && e.apply(this, arguments) || this;
}
return n(o, e), o.prototype.defineFunction = function() {
var e = this;
return function(n, o) {
var r = o[ye];
s(e, void 0, void 0, function() {
var e, o, i, a, s, l, c, d, h;
return u(this, function(u) {
switch (u.label) {
case 0:
e = "", o = "", u.label = 1;

case 1:
return u.trys.push([ 1, 3, , 4 ]), i = Kn(n), a = i.featureName, s = i.assetPath, 
[ 4, this.atomWorld.universe.asset.loadAsset(a, s, t.LoaderAssetType.Json) ];

case 2:
return l = u.sent(), !this.atomWorld || this.atomWorld.disposed ? [ 2 ] : (o = l.json, 
[ 3, 4 ]);

case 3:
return c = u.sent(), e = c instanceof Error ? c.message : String(c), [ 3, 4 ];

case 4:
return !this.atomWorld || this.atomWorld.disposed || (d = this.atomWorld.getAtomIns(Sn), 
(h = d.data).url = n, h.jsonData = o, h.error = e, d.emitByRouter(r)), [ 2 ];
}
});
});
};
}, i([ De(Sn), a("design:type", Object) ], o.prototype, "input", void 0), i([ Ie("G_FAtom_ReadJsonAsset") ], o);
}(hi), uu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e) {
return t.atomWorld.universe.asset.isBundleDownloaded(e);
};
}, i([ Ie("G_FAtom_IsBundleDownloaded") ], e);
}(hi), lu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e, n) {
var o = Kn(e), r = o.featureName, i = o.assetPath;
return t.atomWorld.universe.asset.isAssetDownloaded(r, i, n);
};
}, i([ Ie("G_FAtom_IsAssetDownloaded") ], e);
}(hi), cu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e) {
var n = Kn(e), o = n.featureName, r = n.assetPath;
return t.atomWorld.universe.asset.isDirDownloaded(o, r);
};
}, i([ Ie("G_FAtom_IsDirDownloaded") ], e);
}(hi), du = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this.atomWorld.loadedFeatureNames;
return function(e) {
return t.has(e);
};
}, i([ Ie("G_FAtom_HasFeature") ], e);
}(hi), hu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this.atomWorld.universe.featureResolver;
return function(e) {
return t.hasFeatureInUniverse(e);
};
}, i([ Ie("G_FAtom_HasUniverseFeature") ], e);
}(hi), pu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this.atomWorld.universe.storage;
return function(e, n) {
t.saveJsonEntry(e, n);
};
}, i([ Ie("G_FAtom_SaveJson") ], e);
}(hi), fu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this.atomWorld.universe.storage;
return function(e) {
return t.loadJsonEntry(e);
};
}, i([ Ie("G_FAtom_LoadJson") ], e);
}(hi), mu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this.atomWorld.universe.storage;
return function(e) {
t.removeJsonEntry(e);
};
}, i([ Ie("G_FAtom_RemoveJson") ], e);
}(hi), yu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this.atomWorld.universe.storage;
return function(e) {
return t.readRawItem(e);
};
}, i([ Ie("G_FAtom_GetStorageItem") ], e);
}(hi), vu = function(t, e, n, o, r, i, a, s, u, l, c) {
var d = e + e, h = n + n, p = o + o, f = e * d, m = e * h, y = e * p, v = n * h, _ = n * p, g = o * p, A = r * d, C = r * h, R = r * p;
return t[0] = (1 - (v + g)) * u, t[1] = (m + R) * u, t[2] = (y - C) * u, t[3] = 0, 
t[4] = (m - R) * l, t[5] = (1 - (f + g)) * l, t[6] = (_ + A) * l, t[7] = 0, t[8] = (y + C) * c, 
t[9] = (_ - A) * c, t[10] = (1 - (f + v)) * c, t[11] = 0, t[12] = i, t[13] = a, 
t[14] = s, t[15] = 1, t;
}, _u = function(t, e, n) {
var o = e[0], r = e[1], i = e[2], a = e[3], s = e[4], u = e[5], l = e[6], c = e[7], d = e[8], h = e[9], p = e[10], f = e[11], m = e[12], y = e[13], v = e[14], _ = e[15], g = n[0], A = n[1], C = n[2], R = n[3];
return t[0] = g * o + A * s + C * d + R * m, t[1] = g * r + A * u + C * h + R * y, 
t[2] = g * i + A * l + C * p + R * v, t[3] = g * a + A * c + C * f + R * _, g = n[4], 
A = n[5], C = n[6], R = n[7], t[4] = g * o + A * s + C * d + R * m, t[5] = g * r + A * u + C * h + R * y, 
t[6] = g * i + A * l + C * p + R * v, t[7] = g * a + A * c + C * f + R * _, g = n[8], 
A = n[9], C = n[10], R = n[11], t[8] = g * o + A * s + C * d + R * m, t[9] = g * r + A * u + C * h + R * y, 
t[10] = g * i + A * l + C * p + R * v, t[11] = g * a + A * c + C * f + R * _, g = n[12], 
A = n[13], C = n[14], R = n[15], t[12] = g * o + A * s + C * d + R * m, t[13] = g * r + A * u + C * h + R * y, 
t[14] = g * i + A * l + C * p + R * v, t[15] = g * a + A * c + C * f + R * _, t;
}, gu = function(t, e) {
var n = e[0], o = e[1], r = e[2], i = e[3], a = e[4], s = e[5], u = e[6], l = e[7], c = e[8], d = e[9], h = e[10], p = e[11], f = e[12], m = e[13], y = e[14], v = e[15], _ = n * s - o * a, g = n * u - r * a, A = n * l - i * a, C = o * u - r * s, R = o * l - i * s, S = r * l - i * u, T = c * m - d * f, b = c * y - h * f, w = c * v - p * f, F = d * y - h * m, E = d * v - p * m, N = h * v - p * y, x = _ * N - g * E + A * F + C * w - R * b + S * T;
if (x) return x = 1 / x, t[0] = (s * N - u * E + l * F) * x, t[1] = (r * E - o * N - i * F) * x, 
t[2] = (m * S - y * R + v * C) * x, t[3] = (h * R - d * S - p * C) * x, t[4] = (u * w - a * N - l * b) * x, 
t[5] = (n * N - r * w + i * b) * x, t[6] = (y * A - f * S - v * g) * x, t[7] = (c * S - h * A + p * g) * x, 
t[8] = (a * E - s * w + l * T) * x, t[9] = (o * w - n * E - i * T) * x, t[10] = (f * R - m * A + v * _) * x, 
t[11] = (d * A - c * R - p * _) * x, t[12] = (s * b - a * F - u * T) * x, t[13] = (n * F - o * b + r * T) * x, 
t[14] = (m * g - f * C - y * _) * x, t[15] = (c * C - d * g + h * _) * x, t;
}, Au = function(t, e, n) {
var o = n.x, r = n.y, i = n.z, a = e[3] * o + e[7] * r + e[11] * i + e[15];
a = a || 1, t.x = (e[0] * o + e[4] * r + e[8] * i + e[12]) / a, t.y = (e[1] * o + e[5] * r + e[9] * i + e[13]) / a, 
t.z = (e[2] * o + e[6] * r + e[10] * i + e[14]) / a;
}, Cu = function(t) {
return t.fill(0), t[0] = t[5] = t[10] = t[15] = 1, t;
}, Ru = new Float32Array(16), Su = new Float32Array(16), Tu = new Float32Array(16);
function bu(t, e, n) {
return void 0 === t ? n : Array.isArray(t) && "function" == typeof t[0] ? t[0](e) : t;
}
function wu(t, e, n) {
var o, r, i, a, s, u, l, c = bu(e.x, n, 0), d = bu(e.y, n, 0), h = bu(e.z, n, 0);
if (void 0 !== e.angle) {
var p = bu(e.angle, n, 0) * Math.PI / 360;
o = 0, r = 0, i = Math.sin(p), a = Math.cos(p);
} else o = bu(e.quatX, n, 0), r = bu(e.quatY, n, 0), i = bu(e.quatZ, n, 0), a = bu(e.quatW, n, 1);
void 0 !== e.scale ? s = u = l = bu(e.scale, n, 1) : (s = bu(e.scaleX, n, 1), u = bu(e.scaleY, n, 1), 
l = bu(e.scaleZ, n, 1)), vu(t, o, r, i, a, c, d, h, s, u, l);
}
function Fu(t, e, n, o) {
var r, i;
Cu(o);
try {
for (var a = l(t), s = a.next(); !s.done; s = a.next()) {
var u = e[s.value];
u && (wu(Tu, u, n), _u(o, o, Tu));
}
} catch (t) {
r = {
error: t
};
} finally {
try {
s && !s.done && (i = a.return) && i.call(a);
} finally {
if (r) throw r.error;
}
}
}
function Eu(t, e, n, o, r) {
for (var i, a, s, u, l = [], c = t; void 0 !== c; ) {
l.push(c);
var d = o.getParent(c);
if (c === e || void 0 === d) break;
c = d;
}
Cu(r);
for (var h = l.length - 1; h >= 0; h--) {
var p = l[h];
if (vu(Ru, n.quatX[p] || 0, n.quatY[p] || 0, n.quatZ[p] || 0, null !== (i = n.quatW[p]) && void 0 !== i ? i : 1, n.x[p] || 0, n.y[p] || 0, n.z[p] || 0, null !== (a = n.scaleX[p]) && void 0 !== a ? a : 1, null !== (s = n.scaleY[p]) && void 0 !== s ? s : 1, null !== (u = n.scaleZ[p]) && void 0 !== u ? u : 1), 
_u(r, r, Ru), h > 0) {
var f = o.mountSlots.get(l[h - 1]);
if (f) {
var m = o.atomWorld.universe.getSlotData(o.atomWorld.config.worldId, p, f);
m && m.path.length && (Fu(m.path, m.propsMap, p, Su), _u(r, r, Su));
}
}
}
}
var Nu, xu, Iu, Du = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this, e = new Float32Array(16);
return function(n) {
return Eu(n, t.atomWorld.rootEid, t.rootDomain.transform, t.childOf, e), {
x: e[12],
y: e[13],
z: e[14]
};
};
}, i([ De(qe), a("design:type", Object) ], e.prototype, "rootDomain", void 0), i([ De(mn), a("design:type", Object) ], e.prototype, "childOf", void 0), 
i([ Ie("G_FAtom_GetWorldPosition") ], e);
}(hi), Mu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this, e = new Float32Array(16), n = {
x: 0,
y: 0,
z: 0
};
return function(r, i) {
var a = i || {
x: 0,
y: 0,
z: 0
};
return Eu(r, t.atomWorld.rootEid, t.rootDomain.transform, t.childOf, e), Au(n, e, a), 
o({}, n);
};
}, i([ De(qe), a("design:type", Object) ], e.prototype, "rootDomain", void 0), i([ De(mn), a("design:type", Object) ], e.prototype, "childOf", void 0), 
i([ Ie("G_FAtom_ConvertToWorld") ], e);
}(hi), Pu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this, e = new Float32Array(16), n = new Float32Array(16), r = new Float32Array(16), i = {
x: 0,
y: 0,
z: 0
}, a = {
x: 0,
y: 0,
z: 0
};
return function(s, u, l) {
return Eu(u, t.atomWorld.rootEid, t.rootDomain.transform, t.childOf, e), Au(i, e, l), 
Eu(s, t.atomWorld.rootEid, t.rootDomain.transform, t.childOf, n), gu(r, n) && Au(a, r, i), 
o({}, a);
};
}, i([ De(qe), a("design:type", Object) ], e.prototype, "rootDomain", void 0), i([ De(mn), a("design:type", Object) ], e.prototype, "childOf", void 0), 
i([ Ie("G_FAtom_ConvertToNode") ], e);
}(hi), Wu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this, e = new Float32Array(16), n = new Float32Array(16), r = new Float32Array(16), i = new Float32Array(16), a = {
x: 0,
y: 0,
z: 0
}, s = {
x: 0,
y: 0,
z: 0
};
return function(u, l, c, d) {
Eu(c, t.atomWorld.rootEid, t.rootDomain.transform, t.childOf, e), Au(a, e, d), Eu(u, t.atomWorld.rootEid, t.rootDomain.transform, t.childOf, n);
var h = t.atomWorld.universe.getSlotData(t.atomWorld.config.worldId, u, l);
return h && (Fu(h.path, h.propsMap, u, r), _u(n, n, r)), gu(i, n) && Au(s, i, a), 
o({}, s);
};
}, i([ De(qe), a("design:type", Object) ], e.prototype, "rootDomain", void 0), i([ De(mn), a("design:type", Object) ], e.prototype, "childOf", void 0), 
i([ Ie("G_FAtom_ConvertToSlot") ], e);
}(hi), Ou = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e) {
t.atomWorld.universe.host.destroyUniverse(e);
};
}, i([ Ie("G_FAtom_DestroyUniverse") ], e);
}(pa), Lu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e) {
void 0 === e && (e = !1), e && t.atomWorld.universe.forceSaveAllStorage(), t.atomWorld.universe.runtime.restartApplication();
};
}, i([ Ie("G_FAtom_RestartApplication") ], e);
}(pa), Bu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e) {
t.atomWorld.universe.restartWorld(e);
};
}, i([ Ie("G_FAtom_RestartWorld") ], e);
}(pa), Gu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e, n) {
t.atomWorld.universe.host.setRenderMountMode(e, n), t.atomWorld.universe.render.updateRootNodeAlignment();
};
}, i([ Ie("G_FAtom_SetRenderMountMode") ], e);
}(pa), ku = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e) {
t.atomWorld.universe.host.dismissEntryRedDot(e);
};
}, i([ Ie("G_FAtom_DismissEntryRedDot") ], e);
}(pa), Vu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e, n, o) {
t.atomWorld.universe.host.setUniverseParentSize(e, n, o);
};
}, i([ Ie("G_FAtom_SetUniverseParentSize") ], e);
}(pa), ju = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e) {
t.atomWorld.universe.host.openHostView(e);
};
}, i([ Ie("G_FAtom_OpenHostView") ], e);
}(pa), Hu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e) {
t.atomWorld.universe.host.showNativeToast(e);
};
}, i([ Ie("G_FAtom_ShowNativeToast") ], e);
}(pa), zu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e) {
t.atomWorld.universe.host.showTips(e);
};
}, i([ Ie("G_FAtom_ShowTips") ], e);
}(pa), Uu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
t.atomWorld.universe.host.showXingYunLoading();
};
}, i([ Ie("G_FAtom_ShowXingYunLoading") ], e);
}(pa), Yu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
t.atomWorld.universe.host.hideXingYunLoading();
};
}, i([ Ie("G_FAtom_HideXingYunLoading") ], e);
}(pa), qu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
t.atomWorld.universe.host.showXingYunLoadingFailed();
};
}, i([ Ie("G_FAtom_ShowXingYunLoadingFailed") ], e);
}(pa), Xu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
t.atomWorld.universe.host.showXingYunLoadingNoNet();
};
}, i([ Ie("G_FAtom_ShowXingYunLoadingNoNet") ], e);
}(pa), Qu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
t.atomWorld.universe.host.showXingYunNoNetPopup();
};
}, i([ Ie("G_FAtom_ShowXingYunNoNetPopup") ], e);
}(pa), Ju = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function() {
t.atomWorld.universe.host.hideXingYunNoNetPopup();
};
}, i([ Ie("G_FAtom_HideXingYunNoNetPopup") ], e);
}(pa), Zu = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), i([ De("G_FAtom_RootDomain"), a("design:type", Object) ], e.prototype, "rootDomain", void 0), 
i([ Ie(pn) ], e);
}(gi), Ku = function(e) {
function o() {
return null !== e && e.apply(this, arguments) || this;
}
return n(o, e), i([ Oe, De(Qe), a("design:type", Object) ], o.prototype, "update", void 0), 
i([ Le(t.RouteMode.Direct), De(pn), a("design:type", Object) ], o.prototype, "signal", void 0), 
i([ Ie("G_FAtom_TweenRunnerRouter") ], o);
}(Ri), $u = function(e) {
function o() {
return null !== e && e.apply(this, arguments) || this;
}
return n(o, e), o.prototype.defineRuntimeData = function() {
return {
tasksMap: {}
};
}, o.prototype.onExecute = function(t, e) {
var n = this.update.deltaTime, o = e.runtime.tasksMap;
for (var r in o) {
var i = Number(r);
if (Mt(this.atomWorld.ecsWorld, i)) {
var a = o[i];
if (a) for (var s = a.length - 1; s >= 0; s--) {
var u = a[s], l = {
elapsedTime: u.elapsedTime,
data: u.stepData
}, c = u.steps[u.currentStepIndex];
this._runStep(u.eid, n, l, c) ? this._nextStep(u) : (u.elapsedTime = l.elapsedTime, 
u.stepData = l.data), u.isFinished && a.splice(s, 1);
}
a && 0 !== a.length || delete o[i];
} else delete o[i];
}
}, o.prototype._runStep = function(e, n, o, r) {
switch (o.elapsedTime += n, r[0]) {
case t.TweenStepType.To:
return this._handleInterpolation(e, o, r, !1);

case t.TweenStepType.By:
return this._handleInterpolation(e, o, r, !0);

case t.TweenStepType.Delay:
return o.elapsedTime >= r[1];

case t.TweenStepType.Router:
return this._handleRouterStep(e, r), !0;

case t.TweenStepType.Destroy:
return this._handleDestroyStep(e, r), !0;

case t.TweenStepType.Parallel:
return this._handleParallel(e, n, o, r);

case t.TweenStepType.Repeat:
return this._handleRepeat(e, n, o, r);

default:
return !0;
}
}, o.prototype._handleInterpolation = function(e, n, o, r) {
var i = c(o, 5), a = i[1], s = i[2], u = i[3], l = i[4], d = void 0 === l ? t.TweenEasing.Linear : l;
if (!n.data) {
var h = {}, p = this._collectLeafPaths(s);
for (var f in p) h[f] = this._getDeepValue(a, f.split("."), e);
n.data = h;
}
var m = n.data, y = u > 0 ? Math.min(1, n.elapsedTime / u) : 1, v = y;
for (var f in d !== t.TweenEasing.Linear && (v = eu[d](y)), m) {
var _ = f.split("."), g = m[f], A = this._getNestedValue(s, _);
if ("number" == typeof A && "number" == typeof g) {
var C = r ? A : A - g;
this._setDeepValue(a, _, e, g + C * v);
} else y >= 1 && this._setDeepValue(a, _, e, A);
}
return y >= 1;
}, o.prototype._handleParallel = function(t, e, n, o) {
var r = c(o, 2)[1];
n.data || (n.data = {
subStates: r.map(function() {
return {
elapsedTime: 0,
data: void 0,
finished: !1
};
})
});
for (var i = n.data, a = !0, s = 0; s < r.length; s++) {
var u = i.subStates[s];
if (!u.finished) {
var l = {
elapsedTime: u.elapsedTime,
data: u.data
};
this._runStep(t, e, l, r[s]) ? u.finished = !0 : (u.elapsedTime = l.elapsedTime, 
u.data = l.data, a = !1);
}
}
return a;
}, o.prototype._handleRepeat = function(t, e, n, o) {
var r = c(o, 3), i = r[1], a = r[2];
n.data || (n.data = {
iter: 0,
subIdx: 0,
subElapsed: 0,
subData: void 0
});
for (var s = n.data, u = e; s.iter < i || 0 === i; ) {
var l = a[s.subIdx], d = {
elapsedTime: s.subElapsed,
data: s.subData
};
if (!this._runStep(t, u, d, l)) return s.subElapsed = d.elapsedTime, s.subData = d.data, 
!1;
if (s.subIdx++, s.subElapsed = 0, s.subData = void 0, u = 0, s.subIdx >= a.length && (s.iter++, 
s.subIdx = 0), i > 0 && s.iter >= i) return !0;
}
return !0;
}, o.prototype._handleRouterStep = function(t, e) {
var n = c(e), o = n[1], r = n.slice(2), i = o[ye], a = this.atomWorld.getAtomIns(i);
0 === r.length && r.push(t), this.atomWorld.pendingRouterSignals.push({
fromRouterName: i,
signalName: a.to.atomName,
eidList: r
});
}, o.prototype._handleDestroyStep = function(t, e) {
var n, o, r = c(e).slice(1);
0 === r.length && r.push(t);
var i = this.atomWorld.getAtomIns(gn).atomState.name;
try {
for (var a = l(r), s = a.next(); !s.done; s = a.next()) {
var u = s.value, d = i[u];
this.atomWorld.getAtomIns(d).destroy(u);
}
} catch (t) {
n = {
error: t
};
} finally {
try {
s && !s.done && (o = a.return) && o.call(a);
} finally {
if (n) throw n.error;
}
}
}, o.prototype._nextStep = function(t) {
t.currentStepIndex++, t.elapsedTime = 0, t.stepData = void 0, t.currentStepIndex >= t.steps.length && (t.isFinished = !0);
}, o.prototype._collectLeafPaths = function(t, e) {
void 0 === e && (e = "");
var n = {};
for (var o in t) {
var r = t[o], i = e ? "".concat(e, ".").concat(o) : o;
r && "object" == typeof r && !Array.isArray(r) ? Object.assign(n, this._collectLeafPaths(r, i)) : n[i] = r;
}
return n;
}, o.prototype._resolvePath = function(t, e, n) {
var o, r = t, i = e;
if ("EntityComponentAtom" === t[ve]) {
var a = e[0], s = t[a];
if (!s) return;
if (1 === e.length) return {
parent: t,
key: a,
isComponent: !0
};
if (2 === e.length && (null === (o = s[e[1]]) || void 0 === o ? void 0 : o.set)) return {
parent: s,
key: e[1],
isComponent: !0
};
r = s[n], i = e.slice(1);
}
for (var u = 0; u < i.length - 1; u++) if ("object" != typeof (r = null == r ? void 0 : r[i[u]]) || null === r) return;
var l = i[i.length - 1];
return r ? {
parent: r,
key: l,
isComponent: !1
} : void 0;
}, o.prototype._getNestedValue = function(t, e) {
var n, o, r = t;
try {
for (var i = l(e), a = i.next(); !a.done; a = i.next()) {
var s = a.value;
r = null == r ? void 0 : r[s];
}
} catch (t) {
n = {
error: t
};
} finally {
try {
a && !a.done && (o = i.return) && o.call(i);
} finally {
if (n) throw n.error;
}
}
return r;
}, o.prototype._getDeepValue = function(t, e, n) {
var o, r = this._resolvePath(t, e, n);
if (r) {
var i = r.parent, a = r.key;
return r.isComponent ? null === (o = i[a]) || void 0 === o ? void 0 : o[n] : i[a];
}
}, o.prototype._setDeepValue = function(t, e, n, o) {
var r = this._resolvePath(t, e, n);
if (r) {
var i = r.parent, a = r.key;
r.isComponent ? i[a].set(n, o) : i[a] = o;
}
}, i([ Pe, De(pn), a("design:type", Object) ], o.prototype, "signal", void 0), i([ De(Qe), a("design:type", Object) ], o.prototype, "update", void 0), 
i([ Ie(fn) ], o);
}(pi), tl = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this.atomWorld.universe.host;
return function(e, n) {
void 0 === n && (n = {}), t.track(e, n);
};
}, i([ Ie("G_FAtom_Track") ], e);
}(pa), el = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this.atomWorld.universe.host;
return function(e) {
t.setThinkingDataEnabled(e);
};
}, i([ Ie("G_FAtom_SetThinkingDataEnabled") ], e);
}(pa), nl = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this.atomWorld.universe.host;
return function(e) {
t.reportGameRuntime(e);
};
}, i([ Ie("G_FAtom_ReportGameRuntime") ], e);
}(pa), ol = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this;
return function(e) {
t.atomWorld.universe.host.setUserPreferences(e);
};
}, i([ Ie("G_FAtom_SetUserPreferences") ], e);
}(pa);
t.RenderMountMode = void 0, (Nu = t.RenderMountMode || (t.RenderMountMode = {})).Embedded = "embedded", 
Nu.Fullscreen = "fullscreen", t.AdResultState = void 0, (xu = t.AdResultState || (t.AdResultState = {}))[xu.Success = 1] = "Success", 
xu[xu.Fail = 2] = "Fail", xu[xu.Timeout = 3] = "Timeout", t.AdType = void 0, (Iu = t.AdType || (t.AdType = {})).Reward = "reward", 
Iu.Interstitial = "inter", Iu.Fullscreen = "fullscreen", Iu.Banner = "banner", t.HostViewType = void 0, 
(t.HostViewType || (t.HostViewType = {})).XingYunGameList = "xingyun_game_list";
var rl = function() {
function t() {
this.universe = null, this._mainWorld = null, this._adRequestWorld = null, this._universeOffset = {
x: 0,
y: 0
};
}
return t.prototype.setMainWorld = function(t) {
this._mainWorld = t;
}, t.prototype.setAdRequestWorld = function(t) {
this._adRequestWorld = t;
}, t.prototype.clearAdRequestWorld = function(t) {
this._adRequestWorld === t && (this._adRequestWorld = null);
}, t.prototype.getUniverseOffset = function() {
return this._universeOffset;
}, t.prototype.isWorldBundlesDownloaded = function(t) {
var e, n, o = this.universe.featureResolver.getFeatureSet(t);
try {
for (var r = l(o), i = r.next(); !i.done; i = r.next()) {
var a = c(i.value, 2), s = a[0];
if (!a[1].silent && !this.universe.asset.isBundleDownloaded(s)) return !1;
}
} catch (t) {
e = {
error: t
};
} finally {
try {
i && !i.done && (n = r.return) && n.call(r);
} finally {
if (e) throw e.error;
}
}
return !0;
}, t.prototype._emit = function(t, e) {
if (this._mainWorld) {
var n = this._mainWorld.getAtomIns(t);
Object.assign(n.data, e), n.emit();
}
}, t.prototype.originalCtrlWorld = function(t) {
this._emit(An, t);
}, t.prototype.onAdResult = function(e) {
var n, o, r = null !== (n = this._adRequestWorld) && void 0 !== n ? n : this._mainWorld;
if (r && r.hasAtomIns(t.ATOM_AD_RESULT)) {
var i = r.getAtomIns(t.ATOM_AD_RESULT), a = i.data;
a.adType = e.adType, a.state = e.state, a.typeCode = null !== (o = e.typeCode) && void 0 !== o ? o : "", 
i.emit();
}
}, t.prototype.onRewardAdReady = function(e) {
this.universe.emitInputToAllWorlds(t.ATOM_REWARD_AD_READY, {
ready: e
});
}, t.prototype.onInterstitialAdReady = function(e) {
this.universe.emitInputToAllWorlds(t.ATOM_INTERSTITIAL_AD_READY, {
ready: e
});
}, t.prototype.onFullscreenAdReady = function(e) {
this.universe.emitInputToAllWorlds(t.ATOM_FULLSCREEN_AD_READY, {
ready: e
});
}, t.prototype.updateUniverseOffset = function(e, n) {
this._universeOffset.x = e, this._universeOffset.y = n, this.universe.emitInputToAllWorlds(t.ATOM_UNIVERSE_OFFSET_INPUT, {
x: e,
y: n
});
}, t.prototype.setHostActive = function(e) {
this._emit(t.ATOM_HOST_ACTIVE, {
active: e
});
}, t.ATOM_AD_RESULT = "G_FAtom_ADResult", t.ATOM_REWARD_AD_READY = "G_FAtom_ADRewardAdReady", 
t.ATOM_INTERSTITIAL_AD_READY = "G_FAtom_ADInterstitialAdReady", t.ATOM_FULLSCREEN_AD_READY = "G_FAtom_ADFullscreenAdReady", 
t.ATOM_UNIVERSE_OFFSET_INPUT = "G_FAtom_UniverseOffsetInput", t.ATOM_HOST_ACTIVE = "G_FAtom_HostActive", 
t;
}(), il = function(e) {
function o() {
return null !== e && e.apply(this, arguments) || this;
}
return n(o, e), o.prototype.defineInputData = function() {
return {
adType: t.AdType.Reward,
state: t.AdResultState.Success,
typeCode: ""
};
}, i([ De("G_FAtom_RootDomain"), a("design:type", Object) ], o.prototype, "rootDomain", void 0), 
i([ Ie("G_FAtom_ADResult") ], o);
}(Ui), al = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {
ready: !1
};
}, i([ De("G_FAtom_RootDomain"), a("design:type", Object) ], e.prototype, "rootDomain", void 0), 
i([ Ie("G_FAtom_ADRewardAdReady") ], e);
}(Ui), sl = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {
ready: !1
};
}, i([ De("G_FAtom_RootDomain"), a("design:type", Object) ], e.prototype, "rootDomain", void 0), 
i([ Ie("G_FAtom_ADInterstitialAdReady") ], e);
}(Ui), ul = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {
ready: !1
};
}, i([ De("G_FAtom_RootDomain"), a("design:type", Object) ], e.prototype, "rootDomain", void 0), 
i([ Ie("G_FAtom_ADFullscreenAdReady") ], e);
}(Ui), ll = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {
worldId: "",
progress: 0,
isDone: !1,
isCancelled: !1,
error: ""
};
}, i([ De(Xe), a("design:type", Object) ], e.prototype, "worldDomain", void 0), 
i([ Ie(an) ], e);
}(Ui), cl = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {
active: !0
};
}, i([ De("G_FAtom_RootDomain"), a("design:type", Object) ], e.prototype, "root", void 0), 
i([ Ie("G_FAtom_HostActive") ], e);
}(Ui), dl = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineInputData = function() {
return {
configAtomName: ""
};
}, i([ De("G_FAtom_RootDomain"), a("design:type", Object) ], e.prototype, "root", void 0), 
i([ Ie(Cn) ], e);
}(Ui), hl = function(t) {
function e() {
return null !== t && t.apply(this, arguments) || this;
}
return n(e, t), e.prototype.defineFunction = function() {
var t = this, e = {};
return function(n, o) {
var r = n[ye], i = t.atomWorld.getAtomIns(r);
if (o) {
var a = o[ye];
e[r] = a;
}
i.reloadAsync().then(function() {
if (!t.atomWorld.disposed) {
var n = e[r];
if (n) {
var o = t.atomWorld.getAtomIns(Cn);
o.data.configAtomName = r, o.emitByRouter(n), delete e[r];
}
}
});
};
}, i([ De(Cn), a("design:type", Object) ], e.prototype, "input", void 0), i([ Ie("G_FAtom_ReloadConfig") ], e);
}(hi), pl = !1;
!function() {
if (globalThis.jsb && !pl && "object" == typeof WebAssembly) {
var t = WebAssembly.compile, e = WebAssembly.instantiate;
WebAssembly.compile = function(e) {
return new Promise(function(n, o) {
if (e) try {
n(new WebAssembly.Module(e));
} catch (r) {
t.call(WebAssembly, e).then(n).catch(o);
} else o(new Error("WebAssembly.compile: Invalid buffer source!"));
});
}, WebAssembly.instantiate = function(t, n) {
return t instanceof WebAssembly.Module ? e.call(WebAssembly, t, n) : WebAssembly.compile(t).then(function(t) {
return e.call(WebAssembly, t, n).then(function(e) {
return {
instance: e,
module: t
};
});
});
}, pl = !0;
}
}();
var fl = function(t) {
function e() {
var e = t.apply(this, d([], c(arguments), !1)) || this;
return e.exports = {}, e;
}
return n(e, t), Object.defineProperty(e, "atomType", {
get: function() {
return "NativeAtom";
},
enumerable: !1,
configurable: !0
}), e.prototype.onReady = function() {
return s(this, void 0, void 0, function() {
var t, e;
return u(this, function(n) {
switch (n.label) {
case 0:
return t = this.defineModule(), e = this, [ 4, this.atomWorld.universe.native.getModule(t) ];

case 1:
return e.exports = n.sent(), this.atomWorld ? (this.atomState = this.defineFunction(), 
[ 2 ]) : [ 2 ];
}
});
});
}, e[_e] = !0, e;
}(ge);
t.AssetFoundation = Jn, t.AssetMeta = {
image: function() {},
autoAtlas: function() {}
}, t.AssetUrlSeparator = Zn, t.AtomUniverse = ii, t.AudioAtom = Fi, t.BaseSetters = qn, 
t.Camera = function(e) {
for (var n = [], o = 1; o < arguments.length; o++) n[o - 1] = arguments[o];
return Un.apply(void 0, d([ t.RenderNodeType.Camera, e ], c(n), !1));
}, t.CameraSetters = so, t.ConfigAtom = to, t.DomainExtensionAtom = di, t.EasingFunctions = eu, 
t.EditBox = function(e) {
for (var n = [], o = 1; o < arguments.length; o++) n[o - 1] = arguments[o];
return Un.apply(void 0, d([ t.RenderNodeType.EditBox, e ], c(n), !1));
}, t.EditBoxEventSetters = vr, t.EditBoxSetters = yr, t.EntityComponentAtom = ui, 
t.EntityDomainAtom = li, t.EntityRelationAtom = ci, t.FunctionAtom = hi, t.GMAtom = wi, 
t.G_FAtom_ADCanShowAd = Ta, t.G_FAtom_ADFullscreenAdReady = ul, t.G_FAtom_ADGetAdReadyState = wa, 
t.G_FAtom_ADHideBanner = ya, t.G_FAtom_ADInterstitialAdReady = sl, t.G_FAtom_ADIsAdLoading = ba, 
t.G_FAtom_ADLoadAllAds = Sa, t.G_FAtom_ADLoadFullscreenAd = Ra, t.G_FAtom_ADLoadInterstitialAd = Ca, 
t.G_FAtom_ADLoadRewardAd = Aa, t.G_FAtom_ADResult = il, t.G_FAtom_ADRewardAdReady = al, 
t.G_FAtom_ADShowBanner = ma, t.G_FAtom_ADShowFullscreenAd = ga, t.G_FAtom_ADShowInterstitial = _a, 
t.G_FAtom_ADShowRewardVideo = va, t.G_FAtom_Animation = Zi, t.G_FAtom_AudioPlayer = Wi, 
t.G_FAtom_AutoSaveLogic = Ha, t.G_FAtom_AutoSaveReceive = ja, t.G_FAtom_AutoSaveRouter = Va, 
t.G_FAtom_AutoSaveSignal = ka, t.G_FAtom_BoxComponent = Vi, t.G_FAtom_ChildOf = zi, 
t.G_FAtom_ConvertToNode = Pu, t.G_FAtom_ConvertToSlot = Wu, t.G_FAtom_ConvertToWorld = Mu, 
t.G_FAtom_DateNow = Xs, t.G_FAtom_DestroyUniverse = Ou, t.G_FAtom_DismissEntryRedDot = ku, 
t.G_FAtom_DomainOf = Hi, t.G_FAtom_Edit = Ji, t.G_FAtom_ExitRequest = za, t.G_FAtom_GetAvailableRAM = Oa, 
t.G_FAtom_GetCPUCores = La, t.G_FAtom_GetCPUMaxFreq = Ba, t.G_FAtom_GetCurrentDate = qs, 
t.G_FAtom_GetDesignSize = Ia, t.G_FAtom_GetDeviceInfo = Pa, t.G_FAtom_GetLaunchParams = Ys, 
t.G_FAtom_GetNetworkState = Ea, t.G_FAtom_GetNetworkType = Na, t.G_FAtom_GetSafeArea = Da, 
t.G_FAtom_GetStorageItem = yu, t.G_FAtom_GetTotalRAM = Wa, t.G_FAtom_GetUniverseOffset = Ma, 
t.G_FAtom_GetWinSize = xa, t.G_FAtom_GetWorldPosition = Du, t.G_FAtom_HasFeature = du, 
t.G_FAtom_HasUniverseFeature = hu, t.G_FAtom_HideXingYunLoading = Yu, t.G_FAtom_HideXingYunNoNetPopup = Ju, 
t.G_FAtom_HostActive = cl, t.G_FAtom_IsAssetDownloaded = lu, t.G_FAtom_IsBundleDownloaded = uu, 
t.G_FAtom_IsDirDownloaded = cu, t.G_FAtom_IsLowEndDevice = Ga, t.G_FAtom_JsonData = au, 
t.G_FAtom_Keyboard = Ki, t.G_FAtom_LoadJson = fu, t.G_FAtom_MathAbs = qa, t.G_FAtom_MathAcos = ps, 
t.G_FAtom_MathAcosh = As, t.G_FAtom_MathApproximately = Ls, t.G_FAtom_MathAsin = hs, 
t.G_FAtom_MathAsinh = gs, t.G_FAtom_MathAtan = fs, t.G_FAtom_MathAtan2 = ms, t.G_FAtom_MathAtanh = Cs, 
t.G_FAtom_MathCbrt = es, t.G_FAtom_MathCeil = Qa, t.G_FAtom_MathClamp = Fs, t.G_FAtom_MathClz32 = Ts, 
t.G_FAtom_MathCos = cs, t.G_FAtom_MathCosh = vs, t.G_FAtom_MathDegToRad = xs, t.G_FAtom_MathDeltaAngle = js, 
t.G_FAtom_MathDistance = Ns, t.G_FAtom_MathDistance3D = Vs, t.G_FAtom_MathExp = os, 
t.G_FAtom_MathExpm1 = rs, t.G_FAtom_MathFloor = Ja, t.G_FAtom_MathFround = ws, t.G_FAtom_MathHypot = ns, 
t.G_FAtom_MathImul = bs, t.G_FAtom_MathInverseLerp = Ds, t.G_FAtom_MathLerp = Es, 
t.G_FAtom_MathLog = is, t.G_FAtom_MathLog10 = as, t.G_FAtom_MathLog1p = us, t.G_FAtom_MathLog2 = ss, 
t.G_FAtom_MathMax = Rs, t.G_FAtom_MathMin = Ss, t.G_FAtom_MathMoveTowards = Ps, 
t.G_FAtom_MathMoveTowardsAngle = Hs, t.G_FAtom_MathPingPong = Os, t.G_FAtom_MathPow = $a, 
t.G_FAtom_MathRadToDeg = Is, t.G_FAtom_MathRandom = Ua, t.G_FAtom_MathRandomInt = Ya, 
t.G_FAtom_MathRemap = Bs, t.G_FAtom_MathRepeat = Ws, t.G_FAtom_MathRound = Za, t.G_FAtom_MathSign = Xa, 
t.G_FAtom_MathSin = ls, t.G_FAtom_MathSinh = ys, t.G_FAtom_MathSmoothstep = Ms, 
t.G_FAtom_MathSnap = Gs, t.G_FAtom_MathSqrt = ts, t.G_FAtom_MathTan = ds, t.G_FAtom_MathTanh = _s, 
t.G_FAtom_MathTrunc = Ka, t.G_FAtom_MathWrapAngle = ks, t.G_FAtom_OpenHostView = ju, 
t.G_FAtom_OriginalCtrlInput = ca, t.G_FAtom_PageHide = da, t.G_FAtom_PageShow = ha, 
t.G_FAtom_PerformanceNow = tu, t.G_FAtom_Pointer = Yi, t.G_FAtom_PositionInput = Qi, 
t.G_FAtom_PreButtonClick = ra, t.G_FAtom_PreTouchEnd = ia, t.G_FAtom_ReadJsonAsset = su, 
t.G_FAtom_ReloadConfig = hl, t.G_FAtom_ReloadConfigInput = dl, t.G_FAtom_RemoveJson = mu, 
t.G_FAtom_ReportGameRuntime = nl, t.G_FAtom_RestartApplication = Lu, t.G_FAtom_RestartWorld = Bu, 
t.G_FAtom_RichTextClick = aa, t.G_FAtom_RootDomain = Oi, t.G_FAtom_RootRender = Bi, 
t.G_FAtom_SaveJson = pu, t.G_FAtom_SaveProgress = fa, t.G_FAtom_Scroll = qi, t.G_FAtom_SetFrameRate = zs, 
t.G_FAtom_SetRenderMountMode = Gu, t.G_FAtom_SetThinkingDataEnabled = el, t.G_FAtom_SetUniverseParentSize = Vu, 
t.G_FAtom_SetUserPreferences = ol, t.G_FAtom_ShowNativeToast = Hu, t.G_FAtom_ShowTips = zu, 
t.G_FAtom_ShowXingYunLoading = Uu, t.G_FAtom_ShowXingYunLoadingFailed = qu, t.G_FAtom_ShowXingYunLoadingNoNet = Xu, 
t.G_FAtom_ShowXingYunNoNetPopup = Qu, t.G_FAtom_Silent = ru, t.G_FAtom_SilentLoad = iu, 
t.G_FAtom_SizeInput = Xi, t.G_FAtom_StopTween = ou, t.G_FAtom_StringHash = Us, t.G_FAtom_Track = tl, 
t.G_FAtom_Transform = ki, t.G_FAtom_Tween = nu, t.G_FAtom_TweenEvent = sa, t.G_FAtom_TweenRunner = $u, 
t.G_FAtom_TweenRunnerRouter = Ku, t.G_FAtom_TweenRunnerSignal = Zu, t.G_FAtom_UIEvent = oa, 
t.G_FAtom_UniverseOffsetInput = ua, t.G_FAtom_Update = ta, t.G_FAtom_Vibrate = Fa, 
t.G_FAtom_WindowSize = $i, t.G_FAtom_WorldCreate = ea, t.G_FAtom_WorldDomain = Li, 
t.G_FAtom_WorldLoadProgress = ll, t.G_FAtom_WorldRender = Gi, t.G_FAtom_WorldResume = na, 
t.G_FAtom_WorldState = ji, t.Graphics = function(e) {
for (var n = [], o = 1; o < arguments.length; o++) n[o - 1] = arguments[o];
return Un.apply(void 0, d([ t.RenderNodeType.Graphics, e ], c(n), !1));
}, t.GraphicsSetters = So, t.HostFoundation = rl, t.LayerMapping = ro, t.LoadAtom = Pi, 
t.LogicAtom = pi, t.Mask = function(e) {
for (var n = [], o = 1; o < arguments.length; o++) n[o - 1] = arguments[o];
return Un.apply(void 0, d([ t.RenderNodeType.Mask, e ], c(n), !1));
}, t.MaskSetters = Ho, t.Mesh = function(e) {
for (var n = [], o = 1; o < arguments.length; o++) n[o - 1] = arguments[o];
return Un.apply(void 0, d([ t.RenderNodeType.Mesh, e ], c(n), !1));
}, t.MeshSetters = Ar, t.NativeAtom = fl, t.Node = Ei, t.OrderAtom = Si, t.Particle = function(e) {
for (var n = [], o = 1; o < arguments.length; o++) n[o - 1] = arguments[o];
return Un.apply(void 0, d([ t.RenderNodeType.Particle, e ], c(n), !1));
}, t.ParticleSetters = fr, t.RemoteCdnProtocol = Qn, t.RenderAtom = Mi, t.RichText = function(e) {
for (var n = [], o = 1; o < arguments.length; o++) n[o - 1] = arguments[o];
return Un.apply(void 0, d([ t.RenderNodeType.RichText, e ], c(n), !1));
}, t.RichTextEventSetters = Rr, t.RichTextSetters = Cr, t.ScrollView = function(e) {
for (var n = [], o = 1; o < arguments.length; o++) n[o - 1] = arguments[o];
return Un.apply(void 0, d([ t.RenderNodeType.ScrollView, e ], c(n), !1));
}, t.ScrollViewEventSetters = ir, t.ScrollViewSetters = rr, t.SignalAtom = gi, t.SignalRouterAtom = Ri, 
t.Spine = function(e) {
for (var n = [], o = 1; o < arguments.length; o++) n[o - 1] = arguments[o];
var r = vo(e.slots);
return Un.apply(void 0, d(d([ t.RenderNodeType.Spine, e ], c(r), !1), c(n), !1));
}, t.SpineEventSetters = yo, t.SpineSetters = mo, t.Sprite = function(e) {
for (var n = [], o = 1; o < arguments.length; o++) n[o - 1] = arguments[o];
return Un.apply(void 0, d([ t.RenderNodeType.Sprite, e ], c(n), !1));
}, t.SpriteSetters = lr, t.StandardSetters = Sr, t.Streak = function(e) {
for (var n = [], o = 1; o < arguments.length; o++) n[o - 1] = arguments[o];
return Un.apply(void 0, d([ t.RenderNodeType.Streak, e ], c(n), !1));
}, t.StreakSetters = cr, t.TOP_LEVEL_SKIP = Tr, t.Text = function(e) {
for (var n = [], o = 1; o < arguments.length; o++) n[o - 1] = arguments[o];
return Un.apply(void 0, d([ t.RenderNodeType.Text, e ], c(n), !1));
}, t.TextSetters = po, t.Texture2D = function(e) {
for (var n = [], o = 1; o < arguments.length; o++) n[o - 1] = arguments[o];
return Un.apply(void 0, d([ t.RenderNodeType.Texture2D, e ], c(n), !1));
}, t.Texture2DSetters = qo, t.TopologicalChain = Ae, t.TraceGraphics = function(e) {
for (var n = [], o = 1; o < arguments.length; o++) n[o - 1] = arguments[o];
return Un.apply(void 0, d([ t.RenderNodeType.TraceGraphics, e ], c(n), !1));
}, t.VariantAtom = vi, t.WorldAtom = Ti, t.WorldInputAtom = bi, t.addComponentWithDefaults = si, 
t.applyBoundaryResistance = Dr, t.applyConfigProps = br, t.atomBind = de, t.atomClass = Ie, 
t.atomClassMap = Re, t.attachTo = function(t, e) {
be(t.constructor).attachToProperty = e;
}, t.autoRegisterAtomType = Ee, t.bindAtom = De, t.bytesPerPixel = zo, t.clampOffset = Nr, 
t.cocosTemp = uo, t.componentQuery = function(t, e) {
var n, o = be(t.constructor);
(null !== (n = o.componentQueryProps) && void 0 !== n ? n : o.componentQueryProps = new Set()).add(e);
}, t.computeBoundaryForce = Fr, t.computeMaxOffset = Er, t.computeTotalContentSize = Wr, 
t.computeVisibleRange = Pr, t.createEntityDataComponent = ai, t.createNodeTreeFromConfig = wr, 
t.detectDirectionLock = Mr, t.entityData = function(t, e) {
be(t.constructor).entityDataProperty = e;
}, t.entityRenderer = Me, t.expandSlots = vo, t.featureAtomMap = Se, t.getAtomClass = we, 
t.getBindingMeta = be, t.injectDependency = xe, t.isOutOfBounds = xr, t.mapCocosKeyCode = function(t) {
return t;
}, t.node = Un, t.onChain = Pe, t.orderAfter = ke, t.orderBefore = Ge, t.parseAssetUrl = Kn, 
t.parseFeatureName = Fe, t.resolveChainRegistration = ze, t.routeDispatch = function(e) {
be(e.constructor).routePhase = t.RoutePhase.Dispatch;
}, t.routeFilter = function(e) {
be(e.constructor).routePhase = t.RoutePhase.Filter;
}, t.routeFrom = Oe, t.routeReceive = We, t.routeTo = Le, t.routeTransform = function(e) {
be(e.constructor).routePhase = t.RoutePhase.Transform;
}, t.signalEnd = function(t) {
be(t.constructor).signalPhase = "end";
}, t.signalStart = function(t) {
be(t.constructor).signalPhase = "start";
}, t.updateAxisPhysics = Ir, t.variantOf = function(t, e) {
be(t.constructor).variantSourceProperty = e;
};
}), ae.AE_VERSION = "4.9.17";