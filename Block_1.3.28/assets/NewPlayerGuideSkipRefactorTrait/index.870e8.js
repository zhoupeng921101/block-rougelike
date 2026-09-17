window.__require = function e(t, r, o) {
function n(s, a) {
if (!r[s]) {
if (!t[s]) {
var c = s.split("/");
c = c[c.length - 1];
if (!t[c]) {
var u = "function" == typeof __require && __require;
if (!a && u) return u(c, !0);
if (i) return i(c, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = c;
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
ClassNewPlayerGuideSkipComRefactor: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "ed24e/E3cxHsoMaAIGeiznb", "ClassNewPlayerGuideSkipComRefactor");
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
var s = cc._decorator, a = s.ccclass, c = s.property, u = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.btnInfo = null;
return t;
}
t.prototype.onClick = function() {
var e;
if (this.state.blocksProducer) {
hs.audioInfo.play(hs.AudioConfig.s_button);
hs.UI.hideUI(this.state.prefabConfigItem);
storage.setItem("classGuideStep", 3);
DS(null === (e = hs.classGuideInfo.steps[hs.classGuideInfo.step - 1]) || void 0 === e ? void 0 : e.dotEnd);
this.state.blocksProducer.guideRequestBlocksProducer({
clearScreen: !0,
strategyState: hs.ALGO_STRATEGY_TYPE.GUIDE,
needAlgorithmStrategyRequest: !0
});
}
};
i([ c(cc.Button) ], t.prototype, "btnInfo", void 0);
i([ hs.throttle(300) ], t.prototype, "onClick", null);
return i([ a ], t);
}(hs.Component);
r.default = u;
cc._RF.pop();
}, {} ],
NewPlayerGuideSkipRefactorTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "ea673jRy9dLxp8kt9SSP+e1", "NewPlayerGuideSkipRefactorTrait");
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
c(o.next(e));
} catch (e) {
i(e);
}
}
function a(e) {
try {
c(o.throw(e));
} catch (e) {
i(e);
}
}
function c(e) {
e.done ? n(e.value) : (t = e.value, t instanceof r ? t : new r(function(e) {
e(t);
})).then(s, a);
var t;
}
c((o = o.apply(e, t || [])).next());
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
return c([ e, t ]);
};
}
function c(i) {
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
r.NewPlayerGuideSkipRefactorTrait = void 0;
var c = e("./ClassNewPlayerGuideSkipComRefactor"), u = {
name: "NewPlayerGuideSkip",
url: "prefabs/LayerNewPlayerGuideSkipCom",
bundleName: "NewPlayerGuideSkipRefactorTrait"
}, l = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._isPreloadComplete = !1;
t._blocksProducer = null;
return t;
}
t.prototype.preloadAssets = function() {
return s(this, void 0, void 0, function() {
return a(this, function(e) {
switch (e.label) {
case 0:
e.trys.push([ 0, 2, , 3 ]);
return [ 4, hs.ResLoader.asyncLoadByBundle("NewPlayerGuideSkipRefactorTrait", "prefabs/LayerNewPlayerGuideSkipCom", cc.Prefab) ];

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
className: "ClassBlocksProducer_Proxy",
methodName: "onGameStart"
} ];
};
t.prototype.onActive = function(e) {
hs.tp.isClassGame_Ready_ProxyOnClassGameReady(e) && this.doShowUI();
hs.tp.isClassBlocksProducer_ProxyOnGameStart(e) && (this._blocksProducer = e.target);
if (hs.tp.isClassGuide_ProxyOnGuideChangeTrait(e)) {
if (!this._isPreloadComplete) return;
var t = hs.classGuideInfo, r = t.totalStep;
t.step >= r && hs.UI.hideUI(u);
}
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
return [ 4, hs.UI.show(u) ];

case 1:
if (!(e = t.sent()) || !cc.isValid(e)) return [ 2 ];
if (hs.classGuideInfo.isFinishedGuide) {
hs.UI.hideUI(u);
return [ 2 ];
}
this._isPreloadComplete = !0;
e.getComponent(c.default).setState({
blocksProducer: this._blocksProducer,
prefabConfigItem: u
});
return [ 2 ];
}
});
});
};
return i([ classId("NewPlayerGuideSkipRefactorTrait") ], t);
}(Trait);
r.NewPlayerGuideSkipRefactorTrait = l;
cc._RF.pop();
}, {
"./ClassNewPlayerGuideSkipComRefactor": "ClassNewPlayerGuideSkipComRefactor"
} ]
}, {}, [ "ClassNewPlayerGuideSkipComRefactor", "NewPlayerGuideSkipRefactorTrait" ]);
//# sourceMappingURL=index.js.map
