window.__require = function e(t, r, o) {
function n(s, a) {
if (!r[s]) {
if (!t[s]) {
var u = s.split("/");
u = u[u.length - 1];
if (!t[u]) {
var c = "function" == typeof __require && __require;
if (!a && c) return c(u, !0);
if (i) return i(u, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = u;
}
var l = r[s] = {
exports: {}
};
t[s][0].call(l.exports, function(e) {
return n(t[s][1][e] || e);
}, l, l.exports, e, t, r, o);
}
return r[s].exports;
}
for (var i = "function" == typeof __require && __require, s = 0; s < o.length; s++) n(o[s]);
return n;
}({
ClassNewPlayerGuideSkipCom: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "81ce1OfKnFAzZ6Jt2vKz5f/", "ClassNewPlayerGuideSkipCom");
var o, n = this && this.__extends || (o = function(e, t) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
o(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), i = this && this.__decorate || function(e, t, r, o) {
var n, i = arguments.length, s = i < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, o); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (i < 3 ? n(s) : i > 3 ? n(t, r, s) : n(t, r)) || s);
return i > 3 && s && Object.defineProperty(t, r, s), s;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
var s = cc._decorator, a = s.ccclass, u = s.property, c = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.btnInfo = null;
return t;
}
t.prototype.onClick = function() {
var e, t;
hs.audioInfo.play(hs.AudioConfig.s_button);
null === (t = (e = this.state).callback) || void 0 === t || t.call(e);
};
i([ u(cc.Button) ], t.prototype, "btnInfo", void 0);
i([ hs.throttle(300) ], t.prototype, "onClick", null);
return i([ a ], t);
}(hs.Component);
r.default = c;
cc._RF.pop();
}, {} ],
NewPlayerGuideSkipTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "acb6dkTk/hJZLWxfXRJ6u7D", "NewPlayerGuideSkipTrait");
var o, n = this && this.__extends || (o = function(e, t) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
o(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), i = this && this.__decorate || function(e, t, r, o) {
var n, i = arguments.length, s = i < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, o); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (i < 3 ? n(s) : i > 3 ? n(t, r, s) : n(t, r)) || s);
return i > 3 && s && Object.defineProperty(t, r, s), s;
}, s = this && this.__awaiter || function(e, t, r, o) {
return new (r || (r = Promise))(function(n, i) {
function s(e) {
try {
u(o.next(e));
} catch (e) {
i(e);
}
}
function a(e) {
try {
u(o.throw(e));
} catch (e) {
i(e);
}
}
function u(e) {
e.done ? n(e.value) : (t = e.value, t instanceof r ? t : new r(function(e) {
e(t);
})).then(s, a);
var t;
}
u((o = o.apply(e, t || [])).next());
});
}, a = this && this.__generator || function(e, t) {
var r, o, n, i, s = {
label: 0,
sent: function() {
if (1 & n[0]) throw n[1];
return n[1];
},
trys: [],
ops: []
};
return i = {
next: a(0),
throw: a(1),
return: a(2)
}, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
return this;
}), i;
function a(e) {
return function(t) {
return u([ e, t ]);
};
}
function u(i) {
if (r) throw new TypeError("Generator is already executing.");
for (;s; ) try {
if (r = 1, o && (n = 2 & i[0] ? o.return : i[0] ? o.throw || ((n = o.return) && n.call(o), 
0) : o.next) && !(n = n.call(o, i[1])).done) return n;
(o = 0, n) && (i = [ 2 & i[0], n.value ]);
switch (i[0]) {
case 0:
case 1:
n = i;
break;

case 4:
s.label++;
return {
value: i[1],
done: !1
};

case 5:
s.label++;
o = i[1];
i = [ 0 ];
continue;

case 7:
i = s.ops.pop();
s.trys.pop();
continue;

default:
if (!(n = s.trys, n = n.length > 0 && n[n.length - 1]) && (6 === i[0] || 2 === i[0])) {
s = 0;
continue;
}
if (3 === i[0] && (!n || i[1] > n[0] && i[1] < n[3])) {
s.label = i[1];
break;
}
if (6 === i[0] && s.label < n[1]) {
s.label = n[1];
n = i;
break;
}
if (n && s.label < n[2]) {
s.label = n[2];
s.ops.push(i);
break;
}
n[2] && s.ops.pop();
s.trys.pop();
continue;
}
i = t.call(e, s);
} catch (e) {
i = [ 6, e ];
o = 0;
} finally {
r = n = 0;
}
if (5 & i[0]) throw i[1];
return {
value: i[0] ? i[1] : void 0,
done: !0
};
}
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.NewPlayerGuideSkipTrait = void 0;
var u = e("./ClassNewPlayerGuideSkipCom"), c = {
name: "NewPlayerGuideSkip",
url: "prefabs/LayerNewPlayerGuideSkipCom",
bundleName: "NewPlayerGuideSkipTrait"
}, l = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._isPreloadComplete = !1;
t._proxy = null;
return t;
}
t.prototype.data = function() {
return {
skinPlayerItemConfig: c
};
};
t.prototype.onCreate = function() {};
t.prototype.preloadAssets = function() {
return s(this, void 0, void 0, function() {
return a(this, function(e) {
switch (e.label) {
case 0:
e.trys.push([ 0, 2, , 3 ]);
return [ 4, hs.ResLoader.asyncLoadByBundle("NewPlayerGuideSkipTrait", "prefabs/LayerNewPlayerGuideSkipCom", cc.Prefab) ];

case 1:
e.sent() ? this._isPreloadComplete = !0 : this._isPreloadComplete = !1;
return [ 3, 3 ];

case 2:
e.sent();
this._isPreloadComplete = !1;
return [ 3, 3 ];

case 3:
return [ 2 ];
}
});
});
};
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassGame_Ready_Proxy",
methodName: "onClassGameReady"
}, {
className: "ClassGuide_Proxy",
methodName: "onGuideChangeTrait"
}, {
className: "ClassBlocksProducer_Proxy",
methodName: "onGameStart"
} ];
};
t.prototype.onActive = function(e) {
hs.tp.isClassGame_Ready_ProxyOnClassGameReady(e) && this.doShowUI();
if (hs.tp.isClassGuide_ProxyOnGuideChangeTrait(e)) {
if (!this._isPreloadComplete) return;
var t = hs.classGuideInfo, r = t.totalStep;
t.step >= r && hs.UI.hideUI(c);
}
hs.tp.isClassBlocksProducer_ProxyOnGameStart(e) && (this._proxy = e.target);
};
t.prototype.doShowUI = function() {
return s(this, void 0, void 0, function() {
return a(this, function(e) {
switch (e.label) {
case 0:
return [ 4, this.preloadAssets() ];

case 1:
e.sent();
if (!this._isPreloadComplete) return [ 2 ];
hs.classGuideInfo.isFinishedGuide || this.showSkipUI();
return [ 2 ];
}
});
});
};
t.prototype.showSkipUI = function() {
return s(this, void 0, void 0, function() {
var e;
return a(this, function(t) {
switch (t.label) {
case 0:
return [ 4, hs.UI.show(c) ];

case 1:
if (!(e = t.sent()) || !cc.isValid(e)) return [ 2 ];
if (hs.classGuideInfo.isFinishedGuide) {
hs.UI.hideUI(c);
return [ 2 ];
}
this._isPreloadComplete = !0;
e.getComponent(u.default).setState({
callback: this.clickCallback.bind(this)
});
this.skipShowEnd(e);
return [ 2 ];
}
});
});
};
t.prototype.clickCallback = function() {
var e, t;
if (this._proxy) {
hs.UI.hideUI(c);
storage.setItem("classGuideStep", 3);
DS(null === (e = hs.classGuideInfo.steps[hs.classGuideInfo.step - 1]) || void 0 === e ? void 0 : e.dotEnd);
null === (t = this._proxy) || void 0 === t || t.guideRequestBlocksProducer({
clearScreen: !0,
strategyState: hs.ALGO_STRATEGY_TYPE.GUIDE,
needAlgorithmStrategyRequest: !0
});
}
};
t.prototype.skipShowEnd = function() {};
return i([ classId("NewPlayerGuideSkipTrait"), classMethodWatch() ], t);
}(Trait);
r.NewPlayerGuideSkipTrait = l;
cc._RF.pop();
}, {
"./ClassNewPlayerGuideSkipCom": "ClassNewPlayerGuideSkipCom"
} ]
}, {}, [ "ClassNewPlayerGuideSkipCom", "NewPlayerGuideSkipTrait" ]);
//# sourceMappingURL=index.js.map
