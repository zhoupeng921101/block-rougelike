window.__require = function e(t, n, r) {
function i(a, s) {
if (!n[a]) {
if (!t[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!t[c]) {
var l = "function" == typeof __require && __require;
if (!s && l) return l(c, !0);
if (o) return o(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var u = n[a] = {
exports: {}
};
t[a][0].call(u.exports, function(e) {
return i(t[a][1][e] || e);
}, u, u.exports, e, t, n, r);
}
return n[a].exports;
}
for (var o = "function" == typeof __require && __require, a = 0; a < r.length; a++) i(r[a]);
return i;
}({
ClassReloadSkinTrait: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "1ccfdQ522RITLA2lAlap3tQ", "ClassReloadSkinTrait");
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
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, r); else for (var s = e.length - 1; s >= 0; s--) (i = e[s]) && (a = (o < 3 ? i(a) : o > 3 ? i(t, n, a) : i(t, n)) || a);
return o > 3 && a && Object.defineProperty(t, n, a), a;
}, a = this && this.__awaiter || function(e, t, n, r) {
return new (n || (n = Promise))(function(i, o) {
function a(e) {
try {
c(r.next(e));
} catch (e) {
o(e);
}
}
function s(e) {
try {
c(r.throw(e));
} catch (e) {
o(e);
}
}
function c(e) {
e.done ? i(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, s);
var t;
}
c((r = r.apply(e, t || [])).next());
});
}, s = this && this.__generator || function(e, t) {
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
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (o[Symbol.iterator] = function() {
return this;
}), o;
function s(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(o) {
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
n.ClassReloadSkinTrait = void 0;
var c = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.switchingForEnter = !1;
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [];
};
t.prototype.onActive = function(e) {
return a(this, void 0, void 0, function() {
var t, n;
return s(this, function(r) {
switch (r.label) {
case 0:
if (hs.tp.isClassGame_ProxyOnClassGameStart(e)) {
t = hs.storage.getItem("currentSkinId", "1000");
if (hs.skinInfo.currentSkinId === t) return [ 2 ];
e.replace = !0;
this.switchingForEnter = !0;
this.switchSkin(t);
}
if (!hs.tp.isIsOpenChangeSkinTraitOnSwitchSkinId(e)) return [ 3, 7 ];
if (hs.gameInfo.gameMode !== hs.GameMode.Class) return [ 3, 7 ];
if (!this.switchingForEnter) return [ 2 ];
e.replace = !0;
return hs.skinLoadInfo.skinResLoadedBarrier.isOpen ? [ 3, 2 ] : [ 4, hs.skinLoadInfo.skinResLoadedBarrier.wait() ];

case 1:
r.sent();
r.label = 2;

case 2:
hs.skinInfo.upDataBlockColorValueMap();
(n = TRAIT("IsOpenChangeSkinTrait")).updateAllBlockShader();
n.changeSkinBlockCompelet();
return hs.skinAtlasInfo.skinAutoAtlas ? [ 4, hs.delayTimeFrame(30) ] : [ 3, 5 ];

case 3:
r.sent();
return [ 4, hs.skinAtlas.createBlockAtlas() ];

case 4:
r.sent();
r.label = 5;

case 5:
return [ 4, hs.UI.show(hs.PrefabConfig.ClassGame) ];

case 6:
r.sent();
this.switchingForEnter = !1;
r.label = 7;

case 7:
return [ 2 ];
}
});
});
};
t.prototype.switchSkin = function(e) {
if (e) {
hs.EventManager.dispatchModuleEvent(new hs.E_Skin_Show(!0));
hs.EventManager.dispatchModuleEvent(new hs.E_Skin_Update(e));
}
};
return o([ classId("ClassReloadSkinTrait") ], t);
}(Trait);
n.ClassReloadSkinTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "ClassReloadSkinTrait" ]);
//# sourceMappingURL=index.js.map
