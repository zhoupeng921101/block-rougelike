window.__require = function t(e, n, o) {
function r(a, c) {
if (!n[a]) {
if (!e[a]) {
var l = a.split("/");
l = l[l.length - 1];
if (!e[l]) {
var s = "function" == typeof __require && __require;
if (!c && s) return s(l, !0);
if (i) return i(l, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = l;
}
var u = n[a] = {
exports: {}
};
e[a][0].call(u.exports, function(t) {
return r(e[a][1][t] || t);
}, u, u.exports, t, e, n, o);
}
return n[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < o.length; a++) r(o[a]);
return r;
}({
ChapterScoreSettlementModifyAnimationTrait: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "4a93cinLSRG0ZUBLPVds1ka", "ChapterScoreSettlementModifyAnimationTrait");
var o, r, i = this && this.__extends || (o = function(t, e) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
})(t, e);
}, function(t, e) {
o(t, e);
function n() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
}), a = this && this.__decorate || function(t, e, n, o) {
var r, i = arguments.length, a = i < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, o); else for (var c = t.length - 1; c >= 0; c--) (r = t[c]) && (a = (i < 3 ? r(a) : i > 3 ? r(e, n, a) : r(e, n)) || a);
return i > 3 && a && Object.defineProperty(e, n, a), a;
}, c = this && this.__awaiter || function(t, e, n, o) {
return new (n || (n = Promise))(function(r, i) {
function a(t) {
try {
l(o.next(t));
} catch (t) {
i(t);
}
}
function c(t) {
try {
l(o.throw(t));
} catch (t) {
i(t);
}
}
function l(t) {
t.done ? r(t.value) : (e = t.value, e instanceof n ? e : new n(function(t) {
t(e);
})).then(a, c);
var e;
}
l((o = o.apply(t, e || [])).next());
});
}, l = this && this.__generator || function(t, e) {
var n, o, r, i, a = {
label: 0,
sent: function() {
if (1 & r[0]) throw r[1];
return r[1];
},
trys: [],
ops: []
};
return i = {
next: c(0),
throw: c(1),
return: c(2)
}, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
return this;
}), i;
function c(t) {
return function(e) {
return l([ t, e ]);
};
}
function l(i) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, o && (r = 2 & i[0] ? o.return : i[0] ? o.throw || ((r = o.return) && r.call(o), 
0) : o.next) && !(r = r.call(o, i[1])).done) return r;
(o = 0, r) && (i = [ 2 & i[0], r.value ]);
switch (i[0]) {
case 0:
case 1:
r = i;
break;

case 4:
a.label++;
return {
value: i[1],
done: !1
};

case 5:
a.label++;
o = i[1];
i = [ 0 ];
continue;

case 7:
i = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(r = a.trys, r = r.length > 0 && r[r.length - 1]) && (6 === i[0] || 2 === i[0])) {
a = 0;
continue;
}
if (3 === i[0] && (!r || i[1] > r[0] && i[1] < r[3])) {
a.label = i[1];
break;
}
if (6 === i[0] && a.label < r[1]) {
a.label = r[1];
r = i;
break;
}
if (r && a.label < r[2]) {
a.label = r[2];
a.ops.push(i);
break;
}
r[2] && a.ops.pop();
a.trys.pop();
continue;
}
i = e.call(t, a);
} catch (t) {
i = [ 6, t ];
o = 0;
} finally {
n = r = 0;
}
if (5 & i[0]) throw i[1];
return {
value: i[0] ? i[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.ChapterScoreSettlementModifyAnimationTrait = void 0;
(function(t) {
t[t.Unloaded = 0] = "Unloaded";
t[t.Loading = 1] = "Loading";
t[t.Loaded = 2] = "Loaded";
})(r || (r = {}));
var s = function(t) {
i(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._loadState = r.Unloaded;
return e;
}
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ChapterGame_Proxy",
methodName: "onStartGame"
}, {
className: "ChapterScoreWin",
methodName: "showAction"
} ];
};
e.prototype.onActive = function(t) {
hs.tp.isChapterGame_ProxyOnStartGame(t) && this._loadAnimation();
hs.tp.isChapterScoreWinShowAction(t) && this._loadState == r.Loaded && this._playAnimation(t);
};
e.prototype._playAnimation = function(t) {
t.replace = !0;
t.disable([ "ReduceTravelSettlementTrait" ]);
t.originalCaller();
var e = Cinst(hs.ChapterScoreWin);
if (cc.isValid(e)) {
if (this._newAnimation) this._newAnimation.node.y = 176; else {
var n = cc.instantiate(this._prefab);
n.name = "ChapterScoreSettlementModifyAnimationTrait";
n.setParent(e.node);
this._newAnimation = n.getComponent(dragonBones.ArmatureDisplay);
this._newAnimation.node.y = 276;
}
this._newAnimation.playAnimation("in", 1);
e.boneAni.node.active = !1;
e.scoreImg.active = !1;
e.scoreBoneAni.node.active = !1;
cc.tween(e.node).delay(.58).call(function() {
e.scoreImg.active = !1;
}).delay(.33).call(function() {
e.scoreBoneAni.node.active = !1;
}).start();
}
};
e.prototype._loadAnimation = function() {
return c(this, void 0, void 0, function() {
var t;
return l(this, function(e) {
switch (e.label) {
case 0:
if (this._loadState !== r.Unloaded) return [ 3, 2 ];
this._loadState = r.Loading;
return [ 4, hs.ResLoader.asyncLoadByBundle("ChapterScoreSettlementModifyAnimationTrait", "prefabs/CheckAnimation", cc.Prefab) ];

case 1:
t = e.sent();
if (cc.isValid(t)) {
this._prefab = t;
this._loadState = r.Loaded;
} else this._loadState = r.Unloaded;
e.label = 2;

case 2:
return [ 2 ];
}
});
});
};
return a([ classId("ChapterScoreSettlementModifyAnimationTrait") ], e);
}(Trait);
n.ChapterScoreSettlementModifyAnimationTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "ChapterScoreSettlementModifyAnimationTrait" ]);
//# sourceMappingURL=index.js.map
