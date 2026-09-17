window.__require = function e(t, o, r) {
function n(i, s) {
if (!o[i]) {
if (!t[i]) {
var l = i.split("/");
l = l[l.length - 1];
if (!t[l]) {
var u = "function" == typeof __require && __require;
if (!s && u) return u(l, !0);
if (a) return a(l, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = l;
}
var c = o[i] = {
exports: {}
};
t[i][0].call(c.exports, function(e) {
return n(t[i][1][e] || e);
}, c, c.exports, e, t, o, r);
}
return o[i].exports;
}
for (var a = "function" == typeof __require && __require, i = 0; i < r.length; i++) n(r[i]);
return n;
}({
CombBorderFlashingTrait: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "04dbfD35lxJYogariSJTm5I", "CombBorderFlashingTrait");
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
}), a = this && this.__decorate || function(e, t, o, r) {
var n, a = arguments.length, i = a < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(e, t, o, r); else for (var s = e.length - 1; s >= 0; s--) (n = e[s]) && (i = (a < 3 ? n(i) : a > 3 ? n(t, o, i) : n(t, o)) || i);
return a > 3 && i && Object.defineProperty(t, o, i), i;
}, i = this && this.__awaiter || function(e, t, o, r) {
return new (o || (o = Promise))(function(n, a) {
function i(e) {
try {
l(r.next(e));
} catch (e) {
a(e);
}
}
function s(e) {
try {
l(r.throw(e));
} catch (e) {
a(e);
}
}
function l(e) {
e.done ? n(e.value) : (t = e.value, t instanceof o ? t : new o(function(e) {
e(t);
})).then(i, s);
var t;
}
l((r = r.apply(e, t || [])).next());
});
}, s = this && this.__generator || function(e, t) {
var o, r, n, a, i = {
label: 0,
sent: function() {
if (1 & n[0]) throw n[1];
return n[1];
},
trys: [],
ops: []
};
return a = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
return this;
}), a;
function s(e) {
return function(t) {
return l([ e, t ]);
};
}
function l(a) {
if (o) throw new TypeError("Generator is already executing.");
for (;i; ) try {
if (o = 1, r && (n = 2 & a[0] ? r.return : a[0] ? r.throw || ((n = r.return) && n.call(r), 
0) : r.next) && !(n = n.call(r, a[1])).done) return n;
(r = 0, n) && (a = [ 2 & a[0], n.value ]);
switch (a[0]) {
case 0:
case 1:
n = a;
break;

case 4:
i.label++;
return {
value: a[1],
done: !1
};

case 5:
i.label++;
r = a[1];
a = [ 0 ];
continue;

case 7:
a = i.ops.pop();
i.trys.pop();
continue;

default:
if (!(n = i.trys, n = n.length > 0 && n[n.length - 1]) && (6 === a[0] || 2 === a[0])) {
i = 0;
continue;
}
if (3 === a[0] && (!n || a[1] > n[0] && a[1] < n[3])) {
i.label = a[1];
break;
}
if (6 === a[0] && i.label < n[1]) {
i.label = n[1];
n = a;
break;
}
if (n && i.label < n[2]) {
i.label = n[2];
i.ops.push(a);
break;
}
n[2] && i.ops.pop();
i.trys.pop();
continue;
}
a = t.call(e, i);
} catch (e) {
a = [ 6, e ];
r = 0;
} finally {
o = n = 0;
}
if (5 & a[0]) throw a[1];
return {
value: a[0] ? a[1] : void 0,
done: !0
};
}
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.CombBorderFlashingTrait = void 0;
var l = {
bundleName: "Remote_CombBorderFlashing",
dragonAssetUrl: "dragonbones/purple/gameplay_lamp_purple_ske",
dragonAtlasAssetUrl: "dragonbones/purple/gameplay_lamp_purple_tex"
}, u = {
bundleName: "Remote_CombBorderFlashing",
dragonAssetUrl: "dragonbones/yellow/gameplay_lamp_yellow_ske",
dragonAtlasAssetUrl: "dragonbones/yellow/gameplay_lamp_yellow_tex"
}, c = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.boardFlashNode = null;
t.curretCombNum = 0;
t.eliminateCount = 0;
return t;
}
o = t;
Object.defineProperty(t.prototype, "effectSkin", {
get: function() {
var e = parseInt(hs.skinInfo.currentSkinId);
return o.SkinColorType.A.includes(e) ? u : l;
},
enumerable: !1,
configurable: !0
});
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassCombo_Proxy",
methodName: "onTouchEnd"
}, {
className: "ChapterCombo_Proxy",
methodName: "onTouchEnd"
}, {
className: "ClassGame_Proxy",
methodName: "clearCombBoardFlashingEffect"
}, {
className: "ChapterGame_Proxy",
methodName: "cleanCombBoardFlashingEffect"
}, {
className: "ClassCombo_Proxy",
methodName: "onSkinUpdateComplete"
} ];
};
t.prototype.onActive = function(e) {
(hs.tp.isChapterCombo_ProxyOnTouchEnd(e) || hs.tp.isClassCombo_ProxyOnTouchEnd(e)) && this.refreshCombBorderFlashingEffect(e);
if (hs.tp.isClassTopInfoComboAnimState(e)) {
var t = e.args[0];
this.curretCombNum = t.continuousEliminateTimes - 1;
switch (t.comboAnimState) {
case hs.TopInfoType.ShowCombo:
this.enterCombState();
break;

case hs.TopInfoType.CancelCombo:
case hs.TopInfoType.None:
this.outCombState();
}
}
if (hs.tp.isClassGame_ProxyClearCombBoardFlashingEffect(e) || hs.tp.isChapterGame_ProxyCleanCombBoardFlashingEffect(e)) {
if (e.args[0] && this.curretCombNum > 0) {
this.curretCombNum = 0;
this.eliminateCount = 0;
return;
}
this.onDisable();
this.curretCombNum = 0;
this.eliminateCount = 0;
}
hs.tp.isClassCombo_ProxyOnSkinUpdateComplete(e) && this.updateBoardFlashStyle();
};
t.prototype.refreshCombBorderFlashingEffect = function(e) {
var t = e.args[0].state.continuousEliminateTimes - 1;
this.curretCombNum = t;
t > 1 ? this.enterCombState() : this.outCombState();
};
t.prototype.updateBoardFlashStyle = function() {
hs.skinInfo.currentSkinId;
this.onDisable();
this.curretCombNum > 1 && this.initBorderFlash("idle", 0);
};
t.prototype.outCombState = function() {
var e = this;
if (this.boardFlashNode) {
var t = this.boardFlashNode.getComponent(dragonBones.ArmatureDisplay);
if (t) {
t.playAnimation("out", 1);
t.once(dragonBones.EventObject.COMPLETE, function() {
e.onDisable();
}, this);
}
this.curretCombNum = 0;
this.eliminateCount = 0;
}
};
t.prototype.enterCombState = function() {
if (this.boardFlashNode) {
var e = this.boardFlashNode.getComponent(dragonBones.ArmatureDisplay);
if (e) {
this.playIdle(e);
e.playAnimation("in", 1);
}
} else this.initBorderFlash("in", 1);
};
t.prototype.playIdle = function(e) {
var t = e || this.boardFlashNode.getComponent(dragonBones.ArmatureDisplay);
t && t.once(dragonBones.EventObject.COMPLETE, function() {
t.playAnimation("idle", 0);
}, this);
};
t.prototype.initBorderFlash = function(e, t) {
void 0 === e && (e = "");
void 0 === t && (t = 0);
return i(this, void 0, void 0, function() {
var o, r, n;
return s(this, function(a) {
switch (a.label) {
case 0:
return [ 4, CinstAsync(hs.Board) ];

case 1:
if (!(o = a.sent())) return [ 2 ];
r = {
armatureName: "armatureName",
animationName: e || "",
playTimes: t,
completeRemove: !1
};
n = hs.dragonbonesAnim.play(hs.gameUiLayer, r, this.effectSkin);
this.boardFlashNode = n;
if (n) {
"in" === e && this.playIdle();
n.name = "combBorderFlashingAnimNode";
n.parent = o.boardGrid;
}
return [ 2 ];
}
});
});
};
t.prototype.onDisable = function() {
if (this.boardFlashNode) {
this.boardFlashNode.destroy();
this.boardFlashNode = null;
}
};
var o;
t.SkinColorType = {
A: [ 1e3, 1001, 1003, 1037, 1033, 1036, 1027, 1014, 1017, 1018, 1031, 1032, 1011, 1019, 1030, 1028, 1039 ],
B: [ 1020, 1025, 1021, 1034, 1024, 1002, 1004, 1016, 1038, 1010, 1023, 1026, 1035, 1005, 1012, 1022, 1013, 1015, 1006, 1029, 1007, 1009, 1008 ]
};
return o = a([ classId("CombBorderFlashingTrait") ], t);
}(Trait);
o.CombBorderFlashingTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "CombBorderFlashingTrait" ]);
//# sourceMappingURL=index.js.map
