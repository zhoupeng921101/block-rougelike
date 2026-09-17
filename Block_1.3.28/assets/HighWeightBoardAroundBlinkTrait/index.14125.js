window.__require = function t(e, r, n) {
function i(a, s) {
if (!r[a]) {
if (!e[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!e[c]) {
var u = "function" == typeof __require && __require;
if (!s && u) return u(c, !0);
if (o) return o(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var f = r[a] = {
exports: {}
};
e[a][0].call(f.exports, function(t) {
return i(e[a][1][t] || t);
}, f, f.exports, t, e, r, n);
}
return r[a].exports;
}
for (var o = "function" == typeof __require && __require, a = 0; a < n.length; a++) i(n[a]);
return i;
}({
HighWeightBoardAroundBlinkTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "3cec23+EzRKHabqiPl+aB6m", "HighWeightBoardAroundBlinkTrait");
var n, i = this && this.__extends || (n = function(t, e) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
})(t, e);
}, function(t, e) {
n(t, e);
function r() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
}), o = this && this.__decorate || function(t, e, r, n) {
var i, o = arguments.length, a = o < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, r) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, r, n); else for (var s = t.length - 1; s >= 0; s--) (i = t[s]) && (a = (o < 3 ? i(a) : o > 3 ? i(e, r, a) : i(e, r)) || a);
return o > 3 && a && Object.defineProperty(e, r, a), a;
}, a = this && this.__awaiter || function(t, e, r, n) {
return new (r || (r = Promise))(function(i, o) {
function a(t) {
try {
c(n.next(t));
} catch (t) {
o(t);
}
}
function s(t) {
try {
c(n.throw(t));
} catch (t) {
o(t);
}
}
function c(t) {
t.done ? i(t.value) : (e = t.value, e instanceof r ? e : new r(function(t) {
t(e);
})).then(a, s);
var e;
}
c((n = n.apply(t, e || [])).next());
});
}, s = this && this.__generator || function(t, e) {
var r, n, i, o, a = {
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
function s(t) {
return function(e) {
return c([ t, e ]);
};
}
function c(o) {
if (r) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (r = 1, n && (i = 2 & o[0] ? n.return : o[0] ? n.throw || ((i = n.return) && i.call(n), 
0) : n.next) && !(i = i.call(n, o[1])).done) return i;
(n = 0, i) && (o = [ 2 & o[0], i.value ]);
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
n = o[1];
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
n = 0;
} finally {
r = i = 0;
}
if (5 & o[0]) throw o[1];
return {
value: o[0] ? o[1] : void 0,
done: !0
};
}
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.HighWeightBoardAroundBlinkTrait = void 0;
var c = function(t) {
i(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.curEffect = null;
e.curEffectSkinId = null;
e.isNewGame = !1;
return e;
}
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassGame_Proxy",
methodName: "onClassGameStart"
}, {
className: "ClassRevive_Proxy",
methodName: "onRevive_Success"
}, {
className: "ClassGame_Proxy",
methodName: "onGameBackHome"
}, {
className: "ClassBoardEffect_Proxy",
methodName: "onTouchEnd"
} ];
};
e.prototype.onActive = function(t) {
if (hs.tp.isClassGame_ProxyOnClassGameStart(t)) {
this.gameStartInit();
if (this.isNewGame) this.judgeWeight(); else if (this.curEffect) this.curEffect.active = !0; else {
var e = storage.getItem("HighWeightBoardAroundBlinkData", {
isShowLight: !1,
animName: null
}), r = e.isShowLight, n = e.animName;
r && this.playEffect(null != n ? n : null);
}
}
if (hs.tp.isClassBoardEffect_ProxyOnTouchEnd(t)) {
var i = !0;
hs.classBlocksProducerInfo.producerBlocks.forEach(function(t) {
-1 !== t && (i = !1);
});
i && this.judgeWeight();
}
hs.tp.isClassRevive_ProxyOnRevive_Success(t) && this.judgeWeight();
hs.tp.isClassGame_ProxyOnGameStart(t) && (this.isNewGame = t.args[0].data.newGame);
hs.tp.isClassGame_ProxyOnGameBackHome(t) && this.curEffect && (this.curEffect.active = !1);
};
e.prototype.isWeightThreshold = function(t) {
return t > this.props.weightThreshold;
};
e.prototype.judgeWeight = function() {
return a(this, void 0, void 0, function() {
var t, e;
return s(this, function(r) {
switch (r.label) {
case 0:
t = hs.binarySupport.getWeightValue(hs.boardInfo.faceBlocks);
if (!this.isWeightThreshold(t)) return [ 3, 4 ];
if (this.curEffectSkinId !== hs.skinInfo.currentSkinId && this.curEffect) {
this.curEffect.destroy();
this.curEffect = null;
}
return this.curEffect ? [ 3, 2 ] : [ 4, this.playEffect() ];

case 1:
e = r.sent();
this.setHighWeightBoardAroundBlinkData(!0, e);
return [ 3, 3 ];

case 2:
this.curEffect.active = !0;
r.label = 3;

case 3:
return [ 3, 5 ];

case 4:
if (this.curEffect) {
this.curEffect.destroy();
this.curEffect = null;
}
this.setHighWeightBoardAroundBlinkData(!1, null);
r.label = 5;

case 5:
return [ 2 ];
}
});
});
};
e.prototype.gameStartInit = function() {};
e.prototype.setHighWeightBoardAroundBlinkData = function(t, e) {
hs.gameInfo.gameMode === hs.GameMode.Chapter ? storage.setItem("ChapterHighWeightBoardAroundBlinkData", {
isShowLight: t,
animName: e
}) : hs.gameInfo.gameMode === hs.GameMode.Class && storage.setItem("HighWeightBoardAroundBlinkData", {
isShowLight: t,
animName: e
});
};
e.prototype.playEffect = function(t) {
return a(this, void 0, void 0, function() {
var e, r;
return s(this, function(n) {
switch (n.label) {
case 0:
n.trys.push([ 0, 2, , 3 ]);
return [ 4, CinstAsync(hs.Board) ];

case 1:
e = n.sent().node;
if (this.curEffect) {
this.curEffect.destroy();
this.curEffect = null;
}
r = hs.skinInfo.currentSkinId;
if (!t) {
t = "randomcyan";
switch (r) {
case "1012":
t = "skin_012";
break;

case "1021":
t = "skin_021";
break;

case "1025":
t = "skin_025";
break;

case "1038":
t = "skin_038";
break;

default:
t = [ "randomcyan", "randomgreen", "randomyellow" ][hs.randomIntInclusive(0, 2)];
}
}
this.curEffectSkinId = r;
this.curEffect = hs.dragonbonesAnim.play(e, {
armatureName: "armatureName",
animationName: t,
playTimes: 0
}, {
bundleName: "HighWeightBoardAroundBlinkTrait",
dragonAssetUrl: "dragonbones/gameplay_bg_skinlight_ske",
dragonAtlasAssetUrl: "dragonbones/gameplay_bg_skinlight_tex"
});
this.curEffect.y = -125;
this.playEffectComplete(t);
return [ 2, t ];

case 2:
n.sent();
return [ 3, 3 ];

case 3:
return [ 2 ];
}
});
});
};
e.prototype.playEffectComplete = function() {};
e.prototype.setCurEffect = function(t, e) {
this.curEffect = t;
void 0 !== e && (this.curEffectSkinId = e);
};
e.prototype.clearCurEffect = function() {
this.curEffect = null;
};
return o([ classId("HighWeightBoardAroundBlinkTrait"), classMethodWatch() ], e);
}(Trait);
r.HighWeightBoardAroundBlinkTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "HighWeightBoardAroundBlinkTrait" ]);
//# sourceMappingURL=index.js.map
