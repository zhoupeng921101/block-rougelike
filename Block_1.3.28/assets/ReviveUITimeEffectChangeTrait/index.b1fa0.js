window.__require = function e(t, n, r) {
function i(a, c) {
if (!n[a]) {
if (!t[a]) {
var f = a.split("/");
f = f[f.length - 1];
if (!t[f]) {
var u = "function" == typeof __require && __require;
if (!c && u) return u(f, !0);
if (o) return o(f, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = f;
}
var s = n[a] = {
exports: {}
};
t[a][0].call(s.exports, function(e) {
return i(t[a][1][e] || e);
}, s, s.exports, e, t, n, r);
}
return n[a].exports;
}
for (var o = "function" == typeof __require && __require, a = 0; a < r.length; a++) i(r[a]);
return i;
}({
ReviveUITimeEffectChangeConst: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "131ecSg9kdJwpt+gtZ56VrA", "ReviveUITimeEffectChangeConst");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.ReviveUITimeEffectChangeBundleName = void 0;
n.ReviveUITimeEffectChangeBundleName = "ReviveUITimeEffectChangeTrait";
cc._RF.pop();
}, {} ],
ReviveUITimeEffectChangeTrait: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "5de31eGgkhKK6esPZ2gskyJ", "ReviveUITimeEffectChangeTrait");
var r, i = this && this.__extends || (r = function(e, t) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
r(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), o = this && this.__decorate || function(e, t, n, r) {
var i, o = arguments.length, a = o < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, n) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, r); else for (var c = e.length - 1; c >= 0; c--) (i = e[c]) && (a = (o < 3 ? i(a) : o > 3 ? i(t, n, a) : i(t, n)) || a);
return o > 3 && a && Object.defineProperty(t, n, a), a;
}, a = this && this.__awaiter || function(e, t, n, r) {
return new (n || (n = Promise))(function(i, o) {
function a(e) {
try {
f(r.next(e));
} catch (e) {
o(e);
}
}
function c(e) {
try {
f(r.throw(e));
} catch (e) {
o(e);
}
}
function f(e) {
e.done ? i(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, c);
var t;
}
f((r = r.apply(e, t || [])).next());
});
}, c = this && this.__generator || function(e, t) {
var n, r, i, o, a = {
label: 0,
sent: function() {
if (1 & i[0]) throw i[1];
return i[1];
},
trys: [],
ops: []
};
return o = {
next: c(0),
throw: c(1),
return: c(2)
}, "function" == typeof Symbol && (o[Symbol.iterator] = function() {
return this;
}), o;
function c(e) {
return function(t) {
return f([ e, t ]);
};
}
function f(o) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, r && (i = 2 & o[0] ? r.return : o[0] ? r.throw || ((i = r.return) && i.call(r), 
0) : r.next) && !(i = i.call(r, o[1])).done) return i;
(r = 0, i) && (o = [ 2 & o[0], i.value ]);
switch (o[0]) {
case 0:
case 1:
i = o;
break;

case 4:
a.label++;
return {
value: o[1],
done: !1
};

case 5:
a.label++;
r = o[1];
o = [ 0 ];
continue;

case 7:
o = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(i = a.trys, i = i.length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
a = 0;
continue;
}
if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
a.label = o[1];
break;
}
if (6 === o[0] && a.label < i[1]) {
a.label = i[1];
i = o;
break;
}
if (i && a.label < i[2]) {
a.label = i[2];
a.ops.push(o);
break;
}
i[2] && a.ops.pop();
a.trys.pop();
continue;
}
o = t.call(e, a);
} catch (e) {
o = [ 6, e ];
r = 0;
} finally {
n = i = 0;
}
if (5 & o[0]) throw o[1];
return {
value: o[0] ? o[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.ReviveUITimeEffectChangeTrait = void 0;
var f = e("./const/ReviveUITimeEffectChangeConst"), u = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._prefab = null;
t._nodeNum = null;
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "Revive_Proxy",
methodName: "onGameReady"
} ];
};
t.prototype.onActive = function(e) {
hs.tp.isRevive_ProxyOnGameReady(e) && this.preloadResources();
if (hs.tp.isRevivePlayNumEffect(e)) {
if (!this._prefab) return;
this.initNode(e);
var t = e.target;
t && (t.num.active = !1);
this._nodeNum && this._nodeNum.getComponent(sp.Skeleton).setAnimation(0, "blue", !1);
e.replace = !0;
}
if (hs.tp.isReviveSetNumBoneTimeScale(e)) {
if (!this._prefab) return;
this.initNode(e);
this._nodeNum && (this._nodeNum.getComponent(sp.Skeleton).timeScale = e.args[0]);
e.replace = !0;
}
};
t.prototype.preloadResources = function() {
return a(this, void 0, void 0, function() {
var e;
return c(this, function(t) {
switch (t.label) {
case 0:
if (this._prefab) return [ 2 ];
e = this;
return [ 4, hs.ResLoader.asyncLoadByBundle(f.ReviveUITimeEffectChangeBundleName, "prefabs/NodeReviveUITimeEffectChange", cc.Prefab) ];

case 1:
e._prefab = t.sent();
return [ 2 ];
}
});
});
};
t.prototype.initNode = function(e) {
if (!this._nodeNum) {
this._nodeNum = cc.instantiate(this._prefab);
var t = e.target;
if (t) {
this._nodeNum.parent = t.num.parent;
this._nodeNum.setPosition(t.num.position);
}
}
};
return o([ classId("ReviveUITimeEffectChangeTrait") ], t);
}(Trait);
n.ReviveUITimeEffectChangeTrait = u;
cc._RF.pop();
}, {
"./const/ReviveUITimeEffectChangeConst": "ReviveUITimeEffectChangeConst"
} ]
}, {}, [ "ReviveUITimeEffectChangeTrait", "ReviveUITimeEffectChangeConst" ]);
//# sourceMappingURL=index.js.map
