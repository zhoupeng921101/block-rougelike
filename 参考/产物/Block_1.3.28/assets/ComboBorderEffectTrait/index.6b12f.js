window.__require = function e(t, o, r) {
function n(c, f) {
if (!o[c]) {
if (!t[c]) {
var a = c.split("/");
a = a[a.length - 1];
if (!t[a]) {
var s = "function" == typeof __require && __require;
if (!f && s) return s(a, !0);
if (i) return i(a, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = a;
}
var u = o[c] = {
exports: {}
};
t[c][0].call(u.exports, function(e) {
return n(t[c][1][e] || e);
}, u, u.exports, e, t, o, r);
}
return o[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < r.length; c++) n(r[c]);
return n;
}({
BorderEffectComponent: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "02db3uOHt5CiJmEARewd0sD", "BorderEffectComponent");
var r, n = this && this.__extends || (r = function(e, t) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
})(e, t);
}, function(e, t) {
r(e, t);
function o() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
}), i = this && this.__decorate || function(e, t, o, r) {
var n, i = arguments.length, c = i < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(e, t, o, r); else for (var f = e.length - 1; f >= 0; f--) (n = e[f]) && (c = (i < 3 ? n(c) : i > 3 ? n(t, o, c) : n(t, o)) || c);
return i > 3 && c && Object.defineProperty(t, o, c), c;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var c = cc._decorator, f = c.ccclass, a = (c.property, function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.effectAnim = null;
t.effectIndex = [ "blue", "cyan", "yellow" ];
return t;
}
t.prototype.onLoad = function() {
this.effectAnim = this.node.getComponent(dragonBones.ArmatureDisplay);
};
t.prototype.render = function() {
var e = this.state, t = e.comboLevel, o = e.effectLevel;
if (t >= this.limitCombNum() && cc.isValid(this.effectAnim)) {
this.node.opacity = 255;
this.effectAnim.playAnimation("in_" + this.effectIndex[o], 1);
} else this.node.opacity = 0;
};
t.prototype.limitCombNum = function() {
return 4;
};
return i([ classId("BorderEffectComponent"), f, classMethodWatch() ], t);
}(hs.Component));
o.default = a;
cc._RF.pop();
}, {} ],
BorderEffectType: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "04d22zjya1EdYCjcv/aAr82", "BorderEffectType");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.PREFABS_CONFIG = o.BorderEffectType = void 0;
(function(e) {
e[e.BLUE = 0] = "BLUE";
e[e.CYAN = 1] = "CYAN";
e[e.YELLOW = 2] = "YELLOW";
})(o.BorderEffectType || (o.BorderEffectType = {}));
o.PREFABS_CONFIG = {
BUNDLE_NAME: "ComboBorderEffectTrait",
PREFABS_PATH: "prefabs/borderEffect"
};
cc._RF.pop();
}, {} ],
ComboBorderEffectTrait: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "28616bjUKtFOJrzmcMPjHws", "ComboBorderEffectTrait");
var r, n = this && this.__extends || (r = function(e, t) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
})(e, t);
}, function(e, t) {
r(e, t);
function o() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
}), i = this && this.__decorate || function(e, t, o, r) {
var n, i = arguments.length, c = i < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(e, t, o, r); else for (var f = e.length - 1; f >= 0; f--) (n = e[f]) && (c = (i < 3 ? n(c) : i > 3 ? n(t, o, c) : n(t, o)) || c);
return i > 3 && c && Object.defineProperty(t, o, c), c;
}, c = this && this.__awaiter || function(e, t, o, r) {
return new (o || (o = Promise))(function(n, i) {
function c(e) {
try {
a(r.next(e));
} catch (e) {
i(e);
}
}
function f(e) {
try {
a(r.throw(e));
} catch (e) {
i(e);
}
}
function a(e) {
e.done ? n(e.value) : (t = e.value, t instanceof o ? t : new o(function(e) {
e(t);
})).then(c, f);
var t;
}
a((r = r.apply(e, t || [])).next());
});
}, f = this && this.__generator || function(e, t) {
var o, r, n, i, c = {
label: 0,
sent: function() {
if (1 & n[0]) throw n[1];
return n[1];
},
trys: [],
ops: []
};
return i = {
next: f(0),
throw: f(1),
return: f(2)
}, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
return this;
}), i;
function f(e) {
return function(t) {
return a([ e, t ]);
};
}
function a(i) {
if (o) throw new TypeError("Generator is already executing.");
for (;c; ) try {
if (o = 1, r && (n = 2 & i[0] ? r.return : i[0] ? r.throw || ((n = r.return) && n.call(r), 
0) : r.next) && !(n = n.call(r, i[1])).done) return n;
(r = 0, n) && (i = [ 2 & i[0], n.value ]);
switch (i[0]) {
case 0:
case 1:
n = i;
break;

case 4:
c.label++;
return {
value: i[1],
done: !1
};

case 5:
c.label++;
r = i[1];
i = [ 0 ];
continue;

case 7:
i = c.ops.pop();
c.trys.pop();
continue;

default:
if (!(n = c.trys, n = n.length > 0 && n[n.length - 1]) && (6 === i[0] || 2 === i[0])) {
c = 0;
continue;
}
if (3 === i[0] && (!n || i[1] > n[0] && i[1] < n[3])) {
c.label = i[1];
break;
}
if (6 === i[0] && c.label < n[1]) {
c.label = n[1];
n = i;
break;
}
if (n && c.label < n[2]) {
c.label = n[2];
c.ops.push(i);
break;
}
n[2] && c.ops.pop();
c.trys.pop();
continue;
}
i = t.call(e, c);
} catch (e) {
i = [ 6, e ];
r = 0;
} finally {
o = n = 0;
}
if (5 & i[0]) throw i[1];
return {
value: i[0] ? i[1] : void 0,
done: !0
};
}
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.ComboBorderEffectTrait = void 0;
var a = e("./components/BorderEffectComponent"), s = e("./types/BorderEffectType"), u = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._loadTimeoutBarrier = new hs.TimeoutBarrier(2e3);
t._effectAnim = null;
t.boardContainer = null;
t._flag = 0;
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassGame_Proxy",
methodName: "onClassGameShow"
} ];
};
t.prototype.onActive = function(e) {
return c(this, void 0, void 0, function() {
var t, o, r, n, i, c = this;
return f(this, function(f) {
switch (f.label) {
case 0:
hs.tp.isClassGame_ProxyOnClassGameShow(e) && (this.boardContainer = e.args[0].boardContainer);
hs.tp.isClassTopInfoInitComboAnim(e) && hs.ResLoader.asyncLoadByBundle(s.PREFABS_CONFIG.BUNDLE_NAME, s.PREFABS_CONFIG.PREFABS_PATH, cc.Prefab).then(function(e) {
if (cc.isValid(e)) {
if (!cc.isValid(c.boardContainer)) return;
var t = cc.instantiate(e);
t.setParent(c.boardContainer);
t.setPosition(cc.v2(0, 128));
t.zIndex = 500;
t.opacity = 0;
c._effectAnim = t.addComponent(a.default);
c._loadTimeoutBarrier.open();
}
});
return hs.tp.isClassTopInfoComboAnimState(e) ? this._loadTimeoutBarrier.isOpen ? [ 3, 2 ] : [ 4, this._loadTimeoutBarrier.wait() ] : [ 3, 3 ];

case 1:
f.sent();
f.label = 2;

case 2:
if (!this._effectAnim || !cc.isValid(this._effectAnim.node)) return [ 2 ];
t = e.args[0], o = t.comboAnimState, r = t.continuousEliminateTimes;
if (o == hs.TopInfoType.ShowCombo && this._flag) {
n = r - 1;
i = this.getComboLevel(n);
this._effectAnim.setState({
comboLevel: n,
effectLevel: i
});
}
this._flag = 1;
f.label = 3;

case 3:
return [ 2 ];
}
});
});
};
t.prototype.getComboLevel = function(e) {
return e < 8 ? s.BorderEffectType.BLUE : e < 14 ? s.BorderEffectType.CYAN : s.BorderEffectType.YELLOW;
};
return i([ classId("ComboBorderEffectTrait") ], t);
}(Trait);
o.ComboBorderEffectTrait = u;
cc._RF.pop();
}, {
"./components/BorderEffectComponent": "BorderEffectComponent",
"./types/BorderEffectType": "BorderEffectType"
} ]
}, {}, [ "ComboBorderEffectTrait", "BorderEffectComponent", "BorderEffectType" ]);
//# sourceMappingURL=index.js.map
