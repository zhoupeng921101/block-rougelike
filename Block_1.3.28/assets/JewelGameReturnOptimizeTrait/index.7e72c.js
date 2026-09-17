window.__require = function e(t, n, o) {
function r(a, c) {
if (!n[a]) {
if (!t[a]) {
var u = a.split("/");
u = u[u.length - 1];
if (!t[u]) {
var p = "function" == typeof __require && __require;
if (!c && p) return p(u, !0);
if (i) return i(u, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = u;
}
var s = n[a] = {
exports: {}
};
t[a][0].call(s.exports, function(e) {
return r(t[a][1][e] || e);
}, s, s.exports, e, t, n, o);
}
return n[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < o.length; a++) r(o[a]);
return r;
}({
IJewelGameReturnOptimize: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "a8f8bwiKNdIF4YhdtNHWH1q", "IJewelGameReturnOptimize");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.IJewelGameReturnOptimize = void 0;
var o = function() {
function e() {}
e.BundleName = "JewelGameReturnOptimizeTrait";
return e;
}();
n.IJewelGameReturnOptimize = o;
cc._RF.pop();
}, {} ],
JewelGameReturnOptimizeCom: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "a1486dHOXBBarA1JQP7df8J", "JewelGameReturnOptimizeCom");
var o, r = this && this.__extends || (o = function(e, t) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
o(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), i = this && this.__decorate || function(e, t, n, o) {
var r, i = arguments.length, a = i < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, n) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, o); else for (var c = e.length - 1; c >= 0; c--) (r = e[c]) && (a = (i < 3 ? r(a) : i > 3 ? r(t, n, a) : r(t, n)) || a);
return i > 3 && a && Object.defineProperty(t, n, a), a;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.JewelGameReturnOptimizeCom = void 0;
var a = cc._decorator, c = a.ccclass, u = a.property, p = function(e) {
r(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.btnBack = null;
t.btnReplay = null;
return t;
}
t.prototype.onPressClickBack = function() {
hs.ModuleManager.setCurrentModuleType(hs.ModuleType.Class);
hs.EventManager.dispatchModuleEvent(new hs.E_HomePage_Game(hs.GameType.Class));
setTimeoutSafe(function() {
hs.UI.show(hs.PrefabConfig.GLHallMoreGamesPopupView, hs.gameAlertLayer);
}, 10);
};
t.prototype.onPressClickReplay = function() {
DS("ui_setting_replay_button_click");
hs.EventManager.dispatchModuleEvent(new hs.E_JewelGame_Replay());
};
i([ u(cc.Button) ], t.prototype, "btnBack", void 0);
i([ u(cc.Button) ], t.prototype, "btnReplay", void 0);
i([ hs.throttle(300) ], t.prototype, "onPressClickBack", null);
i([ hs.throttle(300) ], t.prototype, "onPressClickReplay", null);
return i([ c ], t);
}(hs.Component);
n.JewelGameReturnOptimizeCom = p;
cc._RF.pop();
}, {} ],
JewelGameReturnOptimizeTrait: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "666a3hQ3cRFPLcNdJDmA+uT", "JewelGameReturnOptimizeTrait");
var o, r = this && this.__extends || (o = function(e, t) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
o(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), i = this && this.__decorate || function(e, t, n, o) {
var r, i = arguments.length, a = i < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, n) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, o); else for (var c = e.length - 1; c >= 0; c--) (r = e[c]) && (a = (i < 3 ? r(a) : i > 3 ? r(t, n, a) : r(t, n)) || a);
return i > 3 && a && Object.defineProperty(t, n, a), a;
}, a = this && this.__awaiter || function(e, t, n, o) {
return new (n || (n = Promise))(function(r, i) {
function a(e) {
try {
u(o.next(e));
} catch (e) {
i(e);
}
}
function c(e) {
try {
u(o.throw(e));
} catch (e) {
i(e);
}
}
function u(e) {
e.done ? r(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, c);
var t;
}
u((o = o.apply(e, t || [])).next());
});
}, c = this && this.__generator || function(e, t) {
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
function c(e) {
return function(t) {
return u([ e, t ]);
};
}
function u(i) {
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
i = t.call(e, a);
} catch (e) {
i = [ 6, e ];
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
n.JewelGameReturnOptimizeTrait = void 0;
var u = e("./interface/IJewelGameReturnOptimize"), p = function(e) {
r(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._nodeTopInfo = null;
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "JewelTopInfo_Proxy",
methodName: "onScoreUpdate"
}, {
className: "JewelTopInfo_Proxy",
methodName: "showTopInfoPostprocessing"
}, {
className: "Skin_Proxy",
methodName: "traitConfigInitComplete"
} ];
};
t.prototype.onCreate = function() {
this.preloadPrefab();
};
t.prototype.onActive = function(e) {
if (hs.tp.isJewelTopInfo_ProxyShowTopInfoPostprocessing(e)) {
if (null == this._nodeTopInfo) return;
this.onShowTopInfoPostprocessing();
}
if (hs.tp.isJewelTopInfo_ProxyOnScoreUpdate(e)) {
if (null == this._nodeTopInfo) return;
this.modifyPaddingRight();
}
};
t.prototype.preloadPrefab = function() {
return a(this, void 0, void 0, function() {
var e;
return c(this, function(t) {
switch (t.label) {
case 0:
return null != this._nodeTopInfo ? [ 2 ] : [ 4, hs.ResLoader.asyncLoadByBundle(u.IJewelGameReturnOptimize.BundleName, "prefabs/JewelGameReturnOptimizeCom", cc.Prefab) ];

case 1:
if (!(e = t.sent())) return [ 2 ];
this._nodeTopInfo = cc.instantiate(e);
return [ 2 ];
}
});
});
};
t.prototype.onShowTopInfoPostprocessing = function() {
return a(this, void 0, void 0, function() {
var e, t;
return c(this, function() {
if (!(e = Cinst(hs.JewelTopInfo)) || !cc.isValid(e.node)) return [ 2 ];
e.setBtn.node.active = !1;
e.highNode.active = !0;
e.highNode.getComponent(cc.Widget).enabled = !1;
e.highNode.x = 0;
e.highNode.y = e.curNode.y + 80;
if (null == this._nodeTopInfo.parent) {
e.node.addChild(this._nodeTopInfo);
(t = e.highNode.addComponent(cc.Layout)).type = cc.Layout.Type.HORIZONTAL;
t.resizeMode = cc.Layout.ResizeMode.CONTAINER;
}
this._nodeTopInfo.y = e.highNode.y;
this.modifyPaddingRight();
return [ 2 ];
});
});
};
t.prototype.modifyPaddingRight = function() {
var e = Cinst(hs.JewelTopInfo);
if (e) {
var t = e.highNode.getComponent(cc.Layout);
if (t) {
var n = Number(e.highScore.string), o = this.getDigitsCount(n);
t.paddingRight = -23 * o;
}
}
};
t.prototype.getDigitsCount = function(e) {
return 0 === e ? 1 : Math.abs(e).toString().length;
};
return i([ classId("JewelGameReturnOptimizeTrait") ], t);
}(Trait);
n.JewelGameReturnOptimizeTrait = p;
cc._RF.pop();
}, {
"./interface/IJewelGameReturnOptimize": "IJewelGameReturnOptimize"
} ]
}, {}, [ "JewelGameReturnOptimizeTrait", "JewelGameReturnOptimizeCom", "IJewelGameReturnOptimize" ]);
//# sourceMappingURL=index.js.map
