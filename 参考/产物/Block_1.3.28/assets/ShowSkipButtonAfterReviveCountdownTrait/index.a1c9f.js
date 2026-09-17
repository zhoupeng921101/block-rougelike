window.__require = function t(e, n, i) {
function o(u, c) {
if (!n[u]) {
if (!e[u]) {
var a = u.split("/");
a = a[a.length - 1];
if (!e[a]) {
var s = "function" == typeof __require && __require;
if (!c && s) return s(a, !0);
if (r) return r(a, !0);
throw new Error("Cannot find module '" + u + "'");
}
u = a;
}
var p = n[u] = {
exports: {}
};
e[u][0].call(p.exports, function(t) {
return o(e[u][1][t] || t);
}, p, p.exports, t, e, n, i);
}
return n[u].exports;
}
for (var r = "function" == typeof __require && __require, u = 0; u < i.length; u++) o(i[u]);
return o;
}({
ShowSkipButtonAfterReviveCountdownTrait: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "40c2d7zf89Pm7xoRSW02d1I", "ShowSkipButtonAfterReviveCountdownTrait");
var i, o = this && this.__extends || (i = function(t, e) {
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
}), r = this && this.__decorate || function(t, e, n, i) {
var o, r = arguments.length, u = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, n) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) u = Reflect.decorate(t, e, n, i); else for (var c = t.length - 1; c >= 0; c--) (o = t[c]) && (u = (r < 3 ? o(u) : r > 3 ? o(e, n, u) : o(e, n)) || u);
return r > 3 && u && Object.defineProperty(e, n, u), u;
}, u = this && this.__awaiter || function(t, e, n, i) {
return new (n || (n = Promise))(function(o, r) {
function u(t) {
try {
a(i.next(t));
} catch (t) {
r(t);
}
}
function c(t) {
try {
a(i.throw(t));
} catch (t) {
r(t);
}
}
function a(t) {
t.done ? o(t.value) : (e = t.value, e instanceof n ? e : new n(function(t) {
t(e);
})).then(u, c);
var e;
}
a((i = i.apply(t, e || [])).next());
});
}, c = this && this.__generator || function(t, e) {
var n, i, o, r, u = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
},
trys: [],
ops: []
};
return r = {
next: c(0),
throw: c(1),
return: c(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function c(t) {
return function(e) {
return a([ t, e ]);
};
}
function a(r) {
if (n) throw new TypeError("Generator is already executing.");
for (;u; ) try {
if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 
0) : i.next) && !(o = o.call(i, r[1])).done) return o;
(i = 0, o) && (r = [ 2 & r[0], o.value ]);
switch (r[0]) {
case 0:
case 1:
o = r;
break;

case 4:
u.label++;
return {
value: r[1],
done: !1
};

case 5:
u.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = u.ops.pop();
u.trys.pop();
continue;

default:
if (!(o = u.trys, o = o.length > 0 && o[o.length - 1]) && (6 === r[0] || 2 === r[0])) {
u = 0;
continue;
}
if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
u.label = r[1];
break;
}
if (6 === r[0] && u.label < o[1]) {
u.label = o[1];
o = r;
break;
}
if (o && u.label < o[2]) {
u.label = o[2];
u.ops.push(r);
break;
}
o[2] && u.ops.pop();
u.trys.pop();
continue;
}
r = e.call(t, u);
} catch (t) {
r = [ 6, t ];
i = 0;
} finally {
n = o = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.ShowSkipButtonAfterReviveCountdownTrait = void 0;
var a = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._nodeSkipButton = null;
return e;
}
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "Revive",
methodName: "handleNumIdExceeded"
}, {
className: "Revive_Proxy",
methodName: "onRewardOver"
} ];
};
e.prototype.onActive = function(t) {
return u(this, void 0, void 0, function() {
return c(this, function(e) {
switch (e.label) {
case 0:
if (!hs.tp.isReviveHandleNumIdExceeded(t)) return [ 3, 2 ];
t.replace = !0;
return [ 4, this._initSkipButton() ];

case 1:
e.sent();
this._showSkipButton();
e.label = 2;

case 2:
hs.tp.isRevive_ProxyOnRewardOver(t) && this._hideSkipButton();
return [ 2 ];
}
});
});
};
e.prototype._initSkipButton = function() {
return u(this, void 0, void 0, function() {
var t, e;
return c(this, function(n) {
switch (n.label) {
case 0:
if (cc.isValid(this._nodeSkipButton)) return [ 3, 2 ];
t = Cinst(hs.Revive);
return [ 4, hs.ResLoader.asyncLoadByBundle("ShowSkipButtonAfterReviveCountdownTrait", "prefabs/SkipButton", cc.Prefab) ];

case 1:
e = n.sent();
if (cc.isValid(t) && cc.isValid(e)) {
this._nodeSkipButton = cc.instantiate(e);
t.node.addChild(this._nodeSkipButton);
this._nodeSkipButton.setPosition(0, -300);
this._nodeSkipButton.on("click", this._onClickSkipButton, this);
}
n.label = 2;

case 2:
return [ 2 ];
}
});
});
};
e.prototype._showSkipButton = function() {
var t, e;
if (cc.isValid(this._nodeSkipButton)) {
var n = null !== (e = null === (t = this.props) || void 0 === t ? void 0 : t.time) && void 0 !== e ? e : 10;
this._nodeSkipButton.active = !0;
cc.Tween.stopAllByTarget(this._nodeSkipButton);
cc.tween(this._nodeSkipButton).set({
opacity: 0
}).to(.5, {
opacity: 255
}).delay(n).call(this._onClickSkipButton.bind(this)).start();
}
};
e.prototype._hideSkipButton = function() {
if (cc.isValid(this._nodeSkipButton)) {
cc.Tween.stopAllByTarget(this._nodeSkipButton);
this._nodeSkipButton.active = !1;
}
};
e.prototype._onClickSkipButton = function() {
this._hideSkipButton();
var t = Cinst(hs.Revive);
cc.isValid(t) && t.resetReviveView();
hs.EventManager.dispatchModuleEvent(new hs.E_Revive_Close());
};
return r([ classId("ShowSkipButtonAfterReviveCountdownTrait") ], e);
}(Trait);
n.ShowSkipButtonAfterReviveCountdownTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "ShowSkipButtonAfterReviveCountdownTrait" ]);
//# sourceMappingURL=index.js.map
