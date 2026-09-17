window.__require = function e(t, n, i) {
function o(a, c) {
if (!n[a]) {
if (!t[a]) {
var s = a.split("/");
s = s[s.length - 1];
if (!t[s]) {
var u = "function" == typeof __require && __require;
if (!c && u) return u(s, !0);
if (r) return r(s, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = s;
}
var l = n[a] = {
exports: {}
};
t[a][0].call(l.exports, function(e) {
return o(t[a][1][e] || e);
}, l, l.exports, e, t, n, i);
}
return n[a].exports;
}
for (var r = "function" == typeof __require && __require, a = 0; a < i.length; a++) o(i[a]);
return o;
}({
SkinSwitchOpenAtOnceChangeSkinTrait: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "ce8b5dFMOFEPq0rTEWo+hz6", "SkinSwitchOpenAtOnceChangeSkinTrait");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), r = this && this.__decorate || function(e, t, n, i) {
var o, r = arguments.length, a = r < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, i); else for (var c = e.length - 1; c >= 0; c--) (o = e[c]) && (a = (r < 3 ? o(a) : r > 3 ? o(t, n, a) : o(t, n)) || a);
return r > 3 && a && Object.defineProperty(t, n, a), a;
}, a = this && this.__awaiter || function(e, t, n, i) {
return new (n || (n = Promise))(function(o, r) {
function a(e) {
try {
s(i.next(e));
} catch (e) {
r(e);
}
}
function c(e) {
try {
s(i.throw(e));
} catch (e) {
r(e);
}
}
function s(e) {
e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(a, c);
var t;
}
s((i = i.apply(e, t || [])).next());
});
}, c = this && this.__generator || function(e, t) {
var n, i, o, r, a = {
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
function c(e) {
return function(t) {
return s([ e, t ]);
};
}
function s(r) {
if (n) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 
0) : i.next) && !(o = o.call(i, r[1])).done) return o;
(i = 0, o) && (r = [ 2 & r[0], o.value ]);
switch (r[0]) {
case 0:
case 1:
o = r;
break;

case 4:
a.label++;
return {
value: r[1],
done: !1
};

case 5:
a.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(o = a.trys, o = o.length > 0 && o[o.length - 1]) && (6 === r[0] || 2 === r[0])) {
a = 0;
continue;
}
if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
a.label = r[1];
break;
}
if (6 === r[0] && a.label < o[1]) {
a.label = o[1];
o = r;
break;
}
if (o && a.label < o[2]) {
a.label = o[2];
a.ops.push(r);
break;
}
o[2] && a.ops.pop();
a.trys.pop();
continue;
}
r = t.call(e, a);
} catch (e) {
r = [ 6, e ];
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
n.SkinSwitchOpenAtOnceChangeSkinTrait = void 0;
var s = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.skinPool = [];
return t;
}
t.prototype.onCreate = function() {
this.loadSkinPool();
};
t.prototype.loadSkinPool = function() {
this.skinPool = hs.skinRandomInfo.randomSkinPool;
};
t.prototype.onActive = function(e) {
hs.tp.isSetup_SetAddRandomSwitch_ProxySetAddRandomSwitchSwitch(e) && this.onSkinSwitchToggle(e);
hs.tp.isSetup_SetAddDefultSkinBtn_ProxySetAddRandomSwitchSwitch(e) && this.onSkinSwitchToggle(e);
};
t.prototype.onSkinSwitchToggle = function(e) {
return a(this, void 0, void 0, function() {
var t, n, i, o, r;
return c(this, function(a) {
switch (a.label) {
case 0:
e.returnState = !0;
return hs.skinRandomInfo.cleanSequenceBarrier.isOpen ? [ 3, 2 ] : [ 4, hs.skinRandomInfo.cleanSequenceBarrier.wait() ];

case 1:
a.sent();
a.label = 2;

case 2:
t = storage.getItem("SetAddRandomSwitch_classClickNum", 0);
n = storage.getItem("SetAddRandomSwitch_travelClickNum", 0);
i = storage.getItem("SetAddRandomSwitch_isClose", !1);
storage.setItem("SetAddRandomSwitch_isClose", !i);
hs.gameInfo.gameType === hs.GameType.Chapter ? n++ : hs.gameInfo.gameType === hs.GameType.Class && t++;
o = i ? 1 : 0;
DS("ui_setting_randomskin_click", {
GameType: hs.gameInfo.gameType,
type: o,
skin_used: Number(hs.skinInfo.currentSkinId)
});
storage.setItem("SetAddRandomSwitch_travelClickNum", n);
storage.setItem("SetAddRandomSwitch_classClickNum", t);
if (i) {
if (hs.skinInfo.setAddRandomSwitchBeforeId != hs.skinInfo.originSkinId && (r = this.getNextSkinId(hs.skinInfo.prevSkinId))) {
r = null == r ? void 0 : r.toString();
hs.EventManager.dispatchModuleEvent(new hs.E_Skin_Update(r));
}
} else {
if (!hs.skinInfo.skinEnabled) return [ 2 ];
storage.setItem("SetAddRandomSwitch_beforeId", hs.skinInfo.currentSkinId);
hs.EventManager.dispatchModuleEvent(new hs.E_Skin_Update(hs.skinInfo.originSkinId));
}
return [ 2 ];
}
});
});
};
t.prototype.getNextSkinId = function(e) {
var t = TRAIT("CleanSceneUseSequenceSkinTrait");
t && (null == t ? void 0 : t.active) && (e = "" + t.getSkinId());
return e;
};
return r([ classId("SkinSwitchOpenAtOnceChangeSkinTrait"), classMethodWatch() ], t);
}(Trait);
n.SkinSwitchOpenAtOnceChangeSkinTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "SkinSwitchOpenAtOnceChangeSkinTrait" ]);
//# sourceMappingURL=index.js.map
