window.__require = function t(e, n, i) {
function r(a, s) {
if (!n[a]) {
if (!e[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!e[c]) {
var f = "function" == typeof __require && __require;
if (!s && f) return f(c, !0);
if (o) return o(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var l = n[a] = {
exports: {}
};
e[a][0].call(l.exports, function(t) {
return r(e[a][1][t] || t);
}, l, l.exports, t, e, n, i);
}
return n[a].exports;
}
for (var o = "function" == typeof __require && __require, a = 0; a < i.length; a++) r(i[a]);
return r;
}({
ClassDailySignTrait: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "4537bKFcNZHAbh7CvmgC+MS", "ClassDailySignTrait");
var i, r = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
})(t, e);
}, function(t, e) {
i(t, e);
function n() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
}), o = this && this.__decorate || function(t, e, n, i) {
var r, o = arguments.length, a = o < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, i); else for (var s = t.length - 1; s >= 0; s--) (r = t[s]) && (a = (o < 3 ? r(a) : o > 3 ? r(e, n, a) : r(e, n)) || a);
return o > 3 && a && Object.defineProperty(e, n, a), a;
}, a = this && this.__awaiter || function(t, e, n, i) {
return new (n || (n = Promise))(function(r, o) {
function a(t) {
try {
c(i.next(t));
} catch (t) {
o(t);
}
}
function s(t) {
try {
c(i.throw(t));
} catch (t) {
o(t);
}
}
function c(t) {
t.done ? r(t.value) : (e = t.value, e instanceof n ? e : new n(function(t) {
t(e);
})).then(a, s);
var e;
}
c((i = i.apply(t, e || [])).next());
});
}, s = this && this.__generator || function(t, e) {
var n, i, r, o, a = {
label: 0,
sent: function() {
if (1 & r[0]) throw r[1];
return r[1];
},
trys: [],
ops: []
};
return o = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (o[Symbol.iterator] = function() {
return this;
}), o;
function s(t) {
return function(e) {
return c([ t, e ]);
};
}
function c(o) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, i && (r = 2 & o[0] ? i.return : o[0] ? i.throw || ((r = i.return) && r.call(i), 
0) : i.next) && !(r = r.call(i, o[1])).done) return r;
(i = 0, r) && (o = [ 2 & o[0], r.value ]);
switch (o[0]) {
case 0:
case 1:
r = o;
break;

case 4:
a.label++;
return {
value: o[1],
done: !1
};

case 5:
a.label++;
i = o[1];
o = [ 0 ];
continue;

case 7:
o = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(r = a.trys, r = r.length > 0 && r[r.length - 1]) && (6 === o[0] || 2 === o[0])) {
a = 0;
continue;
}
if (3 === o[0] && (!r || o[1] > r[0] && o[1] < r[3])) {
a.label = o[1];
break;
}
if (6 === o[0] && a.label < r[1]) {
a.label = r[1];
r = o;
break;
}
if (r && a.label < r[2]) {
a.label = r[2];
a.ops.push(o);
break;
}
r[2] && a.ops.pop();
a.trys.pop();
continue;
}
o = e.call(t, a);
} catch (t) {
o = [ 6, t ];
i = 0;
} finally {
n = r = 0;
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
n.ClassDailySignTrait = void 0;
var c = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.signShowTime = 0;
e.isLoading = !1;
return e;
}
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "Advertisement_Proxy",
methodName: "onGameStart"
} ];
};
e.prototype.onActive = function(t) {
hs.tp.isAdvertisement_ProxyOnGameStart(t) && hs.gameInfo.gameType == hs.GameType.Class && (this.signShowTime = Date.now());
if (hs.tp.isHomePageSectionClassBtnDefaultAddChildToBtn(t)) {
var e = t.target.node;
this.isToday(this.signShowTime) ? this.hideSign() : this.showSign(e);
}
};
e.prototype.isToday = function(t) {
var e = new Date(t), n = new Date();
return e.getFullYear() === n.getFullYear() && e.getMonth() === n.getMonth() && e.getDate() === n.getDate();
};
e.prototype.showSign = function(t) {
var e;
return a(this, void 0, void 0, function() {
return s(this, function(n) {
switch (n.label) {
case 0:
return cc.isValid(this.effect) ? [ 3, 2 ] : [ 4, this.loadPrefab() ];

case 1:
n.sent();
n.label = 2;

case 2:
if (!cc.isValid(t) || !t.activeInHierarchy) return [ 2 ];
if (cc.isValid(null === (e = this.effect) || void 0 === e ? void 0 : e.node)) {
if (this.effect.node.parent !== t) {
t.addChild(this.effect.node);
this.effect.node.setPosition(-245, 38);
}
this.effect.timeScale = 1 / cc.director._kSpeed || 1;
this.effect.playAnimation("in", 1);
}
return [ 2 ];
}
});
});
};
e.prototype.hideSign = function() {
var t;
cc.isValid(null === (t = this.effect) || void 0 === t ? void 0 : t.node) && this.effect.node.removeFromParent();
};
e.prototype.loadPrefab = function() {
var t;
return a(this, void 0, void 0, function() {
var e, n, i = this;
return s(this, function(r) {
switch (r.label) {
case 0:
if (cc.isValid(null === (t = this.effect) || void 0 === t ? void 0 : t.node) || this.isLoading) return [ 2 ];
r.label = 1;

case 1:
r.trys.push([ 1, 3, 4, 5 ]);
this.isLoading = !0;
return [ 4, hs.ResLoader.asyncLoadByBundle(this.traitName, "prefabs/ClassDailySign", cc.Prefab) ];

case 2:
e = r.sent();
n = cc.instantiate(e);
this.effect = n.getComponent(dragonBones.ArmatureDisplay);
this.effect.addEventListener(dragonBones.EventObject.COMPLETE, function() {
cc.isValid(i.effect) && i.effect.node.activeInHierarchy && i.effect.playAnimation("init", 0);
}, this);
return [ 3, 5 ];

case 3:
r.sent();
return [ 3, 5 ];

case 4:
this.isLoading = !1;
return [ 7 ];

case 5:
return [ 2 ];
}
});
});
};
o([ hs.storageProperty({
key: "ClassDailySignShowTime"
}) ], e.prototype, "signShowTime", void 0);
return o([ classId("ClassDailySignTrait") ], e);
}(Trait);
n.ClassDailySignTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "ClassDailySignTrait" ]);
//# sourceMappingURL=index.js.map
