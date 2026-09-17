window.__require = function t(e, o, r) {
function n(i, a) {
if (!o[i]) {
if (!e[i]) {
var f = i.split("/");
f = f[f.length - 1];
if (!e[f]) {
var s = "function" == typeof __require && __require;
if (!a && s) return s(f, !0);
if (c) return c(f, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = f;
}
var u = o[i] = {
exports: {}
};
e[i][0].call(u.exports, function(t) {
return n(e[i][1][t] || t);
}, u, u.exports, t, e, o, r);
}
return o[i].exports;
}
for (var c = "function" == typeof __require && __require, i = 0; i < r.length; i++) n(r[i]);
return n;
}({
ClickStarEffectFeedbackTrait: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "218baMKVF5MIq/Uiuh5meTM", "ClickStarEffectFeedbackTrait");
var r, n = this && this.__extends || (r = function(t, e) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
r(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), c = this && this.__decorate || function(t, e, o, r) {
var n, c = arguments.length, i = c < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(t, e, o, r); else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (i = (c < 3 ? n(i) : c > 3 ? n(e, o, i) : n(e, o)) || i);
return c > 3 && i && Object.defineProperty(e, o, i), i;
}, i = this && this.__awaiter || function(t, e, o, r) {
return new (o || (o = Promise))(function(n, c) {
function i(t) {
try {
f(r.next(t));
} catch (t) {
c(t);
}
}
function a(t) {
try {
f(r.throw(t));
} catch (t) {
c(t);
}
}
function f(t) {
t.done ? n(t.value) : (e = t.value, e instanceof o ? e : new o(function(t) {
t(e);
})).then(i, a);
var e;
}
f((r = r.apply(t, e || [])).next());
});
}, a = this && this.__generator || function(t, e) {
var o, r, n, c, i = {
label: 0,
sent: function() {
if (1 & n[0]) throw n[1];
return n[1];
},
trys: [],
ops: []
};
return c = {
next: a(0),
throw: a(1),
return: a(2)
}, "function" == typeof Symbol && (c[Symbol.iterator] = function() {
return this;
}), c;
function a(t) {
return function(e) {
return f([ t, e ]);
};
}
function f(c) {
if (o) throw new TypeError("Generator is already executing.");
for (;i; ) try {
if (o = 1, r && (n = 2 & c[0] ? r.return : c[0] ? r.throw || ((n = r.return) && n.call(r), 
0) : r.next) && !(n = n.call(r, c[1])).done) return n;
(r = 0, n) && (c = [ 2 & c[0], n.value ]);
switch (c[0]) {
case 0:
case 1:
n = c;
break;

case 4:
i.label++;
return {
value: c[1],
done: !1
};

case 5:
i.label++;
r = c[1];
c = [ 0 ];
continue;

case 7:
c = i.ops.pop();
i.trys.pop();
continue;

default:
if (!(n = i.trys, n = n.length > 0 && n[n.length - 1]) && (6 === c[0] || 2 === c[0])) {
i = 0;
continue;
}
if (3 === c[0] && (!n || c[1] > n[0] && c[1] < n[3])) {
i.label = c[1];
break;
}
if (6 === c[0] && i.label < n[1]) {
i.label = n[1];
n = c;
break;
}
if (n && i.label < n[2]) {
i.label = n[2];
i.ops.push(c);
break;
}
n[2] && i.ops.pop();
i.trys.pop();
continue;
}
c = e.call(t, i);
} catch (t) {
c = [ 6, t ];
r = 0;
} finally {
o = n = 0;
}
if (5 & c[0]) throw c[1];
return {
value: c[0] ? c[1] : void 0,
done: !0
};
}
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.ClickStarEffectFeedbackTrait = void 0;
var f = t("./comp/TouchStarEffectComp"), s = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.isOpen = !0;
return e;
}
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "GameLobby_DataInfo",
methodName: "exitGameLobby"
} ];
};
e.prototype.onActive = function(t) {
if (hs.tp.isTouchEffect_ProxyMountTouchEffectTrait(t)) {
t.replace = !0;
t.returnState = !0;
var e = t.args[0];
this.isOpen && this.play(e);
}
hs.tp.isHomePage_MiniGame_ProxyOnOpenMiniGame(t) && (this.isOpen = !1);
(hs.tp.isHomePage_MiniGame_ProxyOnEnterGame(t) || hs.tp.isGameLobby_DataInfoExitGameLobby(t)) && (this.isOpen = !0);
};
e.prototype.play = function(t) {
return i(this, void 0, void 0, function() {
return a(this, function() {
hs.ResLoader.asyncLoadByBundle("Remote_ClickStarEffectFeedback", "prefabs/touchStarEffect", cc.Prefab).then(function(e) {
var o = cc.instantiate(e);
o.parent = hs.effectLayer;
o.getComponent(f.TouchStarEffectComp).setState({
pos: t
});
});
return [ 2 ];
});
});
};
return c([ classId("ClickStarEffectFeedbackTrait") ], e);
}(Trait);
o.ClickStarEffectFeedbackTrait = s;
cc._RF.pop();
}, {
"./comp/TouchStarEffectComp": "TouchStarEffectComp"
} ],
TouchStarEffectComp: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "031b1DzVW9BALN8czrwgDCa", "TouchStarEffectComp");
var r, n = this && this.__extends || (r = function(t, e) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
r(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), c = this && this.__decorate || function(t, e, o, r) {
var n, c = arguments.length, i = c < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(t, e, o, r); else for (var a = t.length - 1; a >= 0; a--) (n = t[a]) && (i = (c < 3 ? n(i) : c > 3 ? n(e, o, i) : n(e, o)) || i);
return c > 3 && i && Object.defineProperty(e, o, i), i;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.TouchStarEffectComp = void 0;
var i = cc._decorator, a = i.ccclass, f = i.property, s = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.skeleton = null;
return e;
}
e.prototype.onLoad = function() {
var t = this;
this.skeleton.setCompleteListener(function() {
t.skeleton.setCompleteListener(null);
t.node.destroy();
});
};
e.prototype.onDestroy = function() {
this.skeleton.setEndListener(null);
};
e.prototype.render = function() {
this.node.setPosition(this.state.pos);
var t = 360 * Math.random();
this.skeleton.node.setRotation(t);
var e = cc.director._kSpeed || 1;
this.skeleton.timeScale = 1 / e;
this.skeleton.setAnimation(0, "in", !1);
};
c([ f(sp.Skeleton) ], e.prototype, "skeleton", void 0);
return c([ a ], e);
}(hs.Component);
o.TouchStarEffectComp = s;
cc._RF.pop();
}, {} ]
}, {}, [ "ClickStarEffectFeedbackTrait", "TouchStarEffectComp" ]);
//# sourceMappingURL=index.js.map
