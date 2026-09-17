window.__require = function t(e, n, r) {
function i(a, c) {
if (!n[a]) {
if (!e[a]) {
var f = a.split("/");
f = f[f.length - 1];
if (!e[f]) {
var s = "function" == typeof __require && __require;
if (!c && s) return s(f, !0);
if (o) return o(f, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = f;
}
var l = n[a] = {
exports: {}
};
e[a][0].call(l.exports, function(t) {
return i(e[a][1][t] || t);
}, l, l.exports, t, e, n, r);
}
return n[a].exports;
}
for (var o = "function" == typeof __require && __require, a = 0; a < r.length; a++) i(r[a]);
return i;
}({
LikeEffectComp: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "bb277gLXwRNW5AllxdRs3F1", "LikeEffectComp");
var r, i = this && this.__extends || (r = function(t, e) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
})(t, e);
}, function(t, e) {
r(t, e);
function n() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
}), o = this && this.__decorate || function(t, e, n, r) {
var i, o = arguments.length, a = o < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, n) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, r); else for (var c = t.length - 1; c >= 0; c--) (i = t[c]) && (a = (o < 3 ? i(a) : o > 3 ? i(e, n, a) : i(e, n)) || a);
return o > 3 && a && Object.defineProperty(e, n, a), a;
}, a = this && this.__awaiter || function(t, e, n, r) {
return new (n || (n = Promise))(function(i, o) {
function a(t) {
try {
f(r.next(t));
} catch (t) {
o(t);
}
}
function c(t) {
try {
f(r.throw(t));
} catch (t) {
o(t);
}
}
function f(t) {
t.done ? i(t.value) : (e = t.value, e instanceof n ? e : new n(function(t) {
t(e);
})).then(a, c);
var e;
}
f((r = r.apply(t, e || [])).next());
});
}, c = this && this.__generator || function(t, e) {
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
function c(t) {
return function(e) {
return f([ t, e ]);
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
o = e.call(t, a);
} catch (t) {
o = [ 6, t ];
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
var f = cc._decorator, s = f.ccclass, l = f.property, u = function(t) {
i(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.skeleton = null;
return e;
}
e.prototype.onLoad = function() {
this.skeleton.node.active = !1;
this.skeleton.setCompleteListener(this.onEndListener.bind(this));
};
e.prototype.onEndListener = function(t) {
this.skeleton.node.active = !1;
this.skeleton.setTrackCompleteListener(t, null);
};
e.prototype.render = function() {
return a(this, void 0, void 0, function() {
var t;
return c(this, function() {
this.skeleton.node.active = !0;
this.node.position = this.state.position;
if (!(t = this.skeleton.setAnimation(0, "in_" + this.animationName, !1))) {
this.skeleton.node.active = !1;
return [ 2 ];
}
this.skeleton.addAnimation(t.trackIndex, "idle_" + this.animationName, !1);
return [ 2 ];
});
});
};
Object.defineProperty(e.prototype, "animationName", {
get: function() {
return this.state.animation;
},
enumerable: !1,
configurable: !0
});
o([ l(sp.Skeleton) ], e.prototype, "skeleton", void 0);
return o([ s ], e);
}(hs.Component);
n.default = u;
cc._RF.pop();
}, {} ],
LikeEffectOptimizationTrait: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "2a72c6qPZpBOZfVPGE+SIZA", "LikeEffectOptimizationTrait");
var r, i = this && this.__extends || (r = function(t, e) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
})(t, e);
}, function(t, e) {
r(t, e);
function n() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
}), o = this && this.__decorate || function(t, e, n, r) {
var i, o = arguments.length, a = o < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, n) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, r); else for (var c = t.length - 1; c >= 0; c--) (i = t[c]) && (a = (o < 3 ? i(a) : o > 3 ? i(e, n, a) : i(e, n)) || a);
return o > 3 && a && Object.defineProperty(e, n, a), a;
}, a = this && this.__awaiter || function(t, e, n, r) {
return new (n || (n = Promise))(function(i, o) {
function a(t) {
try {
f(r.next(t));
} catch (t) {
o(t);
}
}
function c(t) {
try {
f(r.throw(t));
} catch (t) {
o(t);
}
}
function f(t) {
t.done ? i(t.value) : (e = t.value, e instanceof n ? e : new n(function(t) {
t(e);
})).then(a, c);
var e;
}
f((r = r.apply(t, e || [])).next());
});
}, c = this && this.__generator || function(t, e) {
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
function c(t) {
return function(e) {
return f([ t, e ]);
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
o = e.call(t, a);
} catch (t) {
o = [ 6, t ];
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
n.LikeEffectOptimizationTrait = void 0;
var f, s = t("./comp/LikeEffectComp"), l = "prefabs/likeEffect", u = "Remote_LikeEffectOptimization";
(function(t) {
t.none = "none";
t.blue = "blue1";
t.yellow = "yellow";
t.purple = "purple";
t.orange = "orange";
t.red = "red";
t.green = "green";
t.gray = "gray";
t.pink = "pink";
})(f || (f = {}));
var p = function(t) {
i(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.positionList = [];
e.colorArr = [];
e.likeEffectCompList = [];
e.colorName = [ f.none, f.blue, f.yellow, f.purple, f.orange, f.red, f.green, f.gray, f.pink ];
return e;
}
e.prototype.onActive = function(t) {
if (hs.tp.isGamePlayDianzanTraitLikeEffectData(t)) {
t.returnValue = this.likeEffectData();
t.replace = !0;
}
if (hs.tp.isRightPutHintCtrTraitGenPutHitComp(t)) {
t.replace = !0;
this.positionList = t.args[2];
this.colorArr = t.args[1];
var e = t.args[0].length;
this.genLikeEffect(e);
}
hs.tp.isRightPutHintCtrTraitHideRightPutHint(t) && this.hideLikeEffect();
};
e.prototype.hideLikeEffect = function() {
for (var t = 0; t < this.likeEffectCompList.length; t++) this.likeEffectCompList[t].node.active = !1;
this.likeEffectCompList = [];
};
e.prototype.likeEffectData = function() {
return {
tag: "LikeEffectOptimizationTrait",
prefabUrl: l,
bundleName: u,
typeOrClassName: s.default
};
};
e.prototype.genLikeEffect = function(t) {
return a(this, void 0, void 0, function() {
var e, n, r, i, o;
return c(this, function(a) {
switch (a.label) {
case 0:
e = this.likeEffectData();
return [ 4, hs.cacheRender.createOrUpdateCacheListComponents({
tag: e.tag,
prefabUrl: e.prefabUrl,
bundleName: e.bundleName,
count: t,
typeOrClassName: e.typeOrClassName,
parent: hs.gameEffectLayer
}) ];

case 1:
n = a.sent();
for (r = 0; r < n.length; r++) {
i = n[r];
21 === (o = this.colorArr[r]) && (o = 8);
if (hs.gameInfo.gameMode === hs.GameMode.Chapter) switch (o) {
case 101:
o = 7;
break;

case 102:
o = 6;
break;

case 103:
o = 4;
break;

case 104:
o = 2;
break;

case 105:
o = 5;
break;

case 106:
o = 3;
}
i.setState({
position: this.positionList[r],
animation: this.colorName[o]
});
this.likeEffectCompList.push(i);
}
return [ 2 ];
}
});
});
};
return o([ classId("LikeEffectOptimizationTrait") ], e);
}(Trait);
n.LikeEffectOptimizationTrait = p;
cc._RF.pop();
}, {
"./comp/LikeEffectComp": "LikeEffectComp"
} ]
}, {}, [ "LikeEffectOptimizationTrait", "LikeEffectComp" ]);
//# sourceMappingURL=index.js.map
