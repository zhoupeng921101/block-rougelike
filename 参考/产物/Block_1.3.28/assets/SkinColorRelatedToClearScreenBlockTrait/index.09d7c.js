window.__require = function e(o, r, t) {
function n(c, l) {
if (!r[c]) {
if (!o[c]) {
var a = c.split("/");
a = a[a.length - 1];
if (!o[a]) {
var s = "function" == typeof __require && __require;
if (!l && s) return s(a, !0);
if (i) return i(a, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = a;
}
var S = r[c] = {
exports: {}
};
o[c][0].call(S.exports, function(e) {
return n(o[c][1][e] || e);
}, S, S.exports, e, o, r, t);
}
return r[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < t.length; c++) n(t[c]);
return n;
}({
SkinColorRelatedToClearScreenBlockTraitConst: [ function(e, o, r) {
"use strict";
cc._RF.push(o, "572625sYmlMOJ6znFb6rSrG", "SkinColorRelatedToClearScreenBlockTraitConst");
var t, n, i;
Object.defineProperty(r, "__esModule", {
value: !0
});
r.StorageKey = r.satisfies = r.STORAGE_KEY_USED_TIMES = r.DEFAULT_SKIN_ID = r.BlockColorSchemeMap = r.SkinIdColorSchemeList = r.SkinBlockColorSchemeMap = r.ColorSchemeSkinIdList = r.SkinColorScheme = void 0;
(function(e) {
e[e.RED = 0] = "RED";
e[e.ORANGE_BROWN = 1] = "ORANGE_BROWN";
e[e.YELLOW = 2] = "YELLOW";
e[e.GREEN = 3] = "GREEN";
e[e.CYAN_BLUE = 4] = "CYAN_BLUE";
e[e.PURPLE_PINK = 5] = "PURPLE_PINK";
e[e.OTHER = 6] = "OTHER";
})(i = r.SkinColorScheme || (r.SkinColorScheme = {}));
r.ColorSchemeSkinIdList = ((t = {})[i.RED] = [ 1027, 1017, 1008 ], t[i.ORANGE_BROWN] = [ 1014, 1018, 1032, 1011, 1019, 1030 ], 
t[i.YELLOW] = [ 1037, 1006, 1007, 1039 ], t[i.GREEN] = [ 1020, 1033, 1016, 1026, 1005, 1013, 1028 ], 
t[i.CYAN_BLUE] = [ 1025, 1021, 1002, 1038, 1035, 1012, 1015, 1009 ], t[i.PURPLE_PINK] = [ 1001, 1034, 1003, 1036, 1010, 1029 ], 
t[i.OTHER] = [ 1024, 1004, 1023, 1031, 1022 ], t);
r.SkinBlockColorSchemeMap = {
1002: {
7: 5
},
1004: {
1: 0,
2: 1,
3: 2,
4: 3,
5: 4,
6: 4,
7: 5
},
1006: {
1: 2,
2: 1,
3: 3,
4: 1,
5: 2,
6: 1
},
1007: {
1: 2,
2: 4,
3: 4,
4: 5,
5: 2,
6: 4,
7: 4
},
1008: {
1: 5,
2: 4,
3: 5,
4: 4,
5: 5,
6: 4,
7: 5
},
1009: {
1: 0,
2: 6,
3: 4,
4: 2,
6: 6,
7: 4
},
1010: {
1: 5,
2: 4,
3: 3,
4: 2,
5: 5,
6: 4,
7: 3
},
1011: {
1: 3,
2: 3,
3: 1,
4: 3,
5: 2,
6: 6,
7: 3
},
1013: {
1: 3,
3: 6,
4: 4,
5: 3,
6: 3,
7: 6
},
1014: {
1: 5,
2: 0,
3: 2,
4: 6,
5: 4,
6: 4,
7: 5
},
1015: {
1: 0,
3: 3,
4: 5,
6: 2,
7: 3
},
1016: {
1: 3,
3: 3,
4: 2,
5: 3,
6: 2,
7: 3
},
1017: {
1: 2,
2: 1,
3: 4,
4: 3,
5: 2,
6: 1,
7: 4
},
1018: {
1: 6,
2: 1,
3: 6,
5: 6,
6: 1,
7: 6
},
1023: {
1: 1,
2: 1,
3: 1,
4: 3,
6: 4,
7: 6
},
1024: {
1: 6,
2: 5,
3: 4,
4: 6,
5: 5,
6: 4,
7: 6
},
1026: {
2: 5,
3: 5,
5: 4,
6: 5,
7: 5
},
1027: {
1: 0,
3: 3,
4: 4,
6: 2,
7: 3
},
1028: {
1: 3,
2: 4,
3: 3,
4: 4,
5: 3,
6: 4,
7: 3
},
1029: {
1: 5,
2: 4,
3: 5,
4: 5,
5: 4,
6: 5,
7: 4
},
1030: {
2: 0,
3: 1,
4: 5,
5: 5,
6: 4,
7: 0
},
1031: {
1: 0,
2: 3,
3: 2,
4: 4,
7: 2
},
1032: {
1: 1,
3: 0,
5: 2,
6: 0,
7: 1
},
1038: {
1: 5,
2: 4,
3: 2,
4: 5,
5: 4,
6: 2,
7: 5
}
};
r.SkinIdColorSchemeList = {
1019: i.ORANGE_BROWN,
1037: i.YELLOW,
1039: i.YELLOW,
1020: i.GREEN,
1033: i.GREEN,
1005: i.GREEN,
1025: i.CYAN_BLUE,
1021: i.CYAN_BLUE,
1035: i.CYAN_BLUE,
1012: i.CYAN_BLUE,
1001: i.PURPLE_PINK,
1034: i.PURPLE_PINK,
1003: i.PURPLE_PINK,
1036: i.PURPLE_PINK
};
r.BlockColorSchemeMap = ((n = {})[hs.ColorProducerType.COLOR_BLUE] = i.CYAN_BLUE, 
n[hs.ColorProducerType.COLOR_YELLOW] = i.YELLOW, n[hs.ColorProducerType.COLOR_PURPLE] = i.PURPLE_PINK, 
n[hs.ColorProducerType.COLOR_ORANGE] = i.ORANGE_BROWN, n[hs.ColorProducerType.COLOR_RED] = i.RED, 
n[hs.ColorProducerType.COLOR_GREEN] = i.GREEN, n[hs.ColorProducerType.COLOR_LIGHTBLUE] = i.CYAN_BLUE, 
n[hs.ColorProducerType.COLOR_GREY] = i.RED, n);
r.DEFAULT_SKIN_ID = 1e3;
r.STORAGE_KEY_USED_TIMES = "SkinColorRelatedToClearScreenBlock_UsedTimes";
cc._RF.pop();
}, {} ],
SkinColorRelatedToClearScreenBlockTrait: [ function(e, o, r) {
"use strict";
cc._RF.push(o, "6e3e55yP/1OloG5DuW21qKk", "SkinColorRelatedToClearScreenBlockTrait");
var t, n = this && this.__extends || (t = function(e, o) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, o) {
e.__proto__ = o;
} || function(e, o) {
for (var r in o) Object.prototype.hasOwnProperty.call(o, r) && (e[r] = o[r]);
})(e, o);
}, function(e, o) {
t(e, o);
function r() {
this.constructor = e;
}
e.prototype = null === o ? Object.create(o) : (r.prototype = o.prototype, new r());
}), i = this && this.__decorate || function(e, o, r, t) {
var n, i = arguments.length, c = i < 3 ? o : null === t ? t = Object.getOwnPropertyDescriptor(o, r) : t;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(e, o, r, t); else for (var l = e.length - 1; l >= 0; l--) (n = e[l]) && (c = (i < 3 ? n(c) : i > 3 ? n(o, r, c) : n(o, r)) || c);
return i > 3 && c && Object.defineProperty(o, r, c), c;
}, c = this && this.__read || function(e, o) {
var r = "function" == typeof Symbol && e[Symbol.iterator];
if (!r) return e;
var t, n, i = r.call(e), c = [];
try {
for (;(void 0 === o || o-- > 0) && !(t = i.next()).done; ) c.push(t.value);
} catch (e) {
n = {
error: e
};
} finally {
try {
t && !t.done && (r = i.return) && r.call(i);
} finally {
if (n) throw n.error;
}
}
return c;
}, l = this && this.__spread || function() {
for (var e = [], o = 0; o < arguments.length; o++) e = e.concat(c(arguments[o]));
return e;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.SkinColorRelatedToClearScreenBlockTrait = void 0;
var a = e("./SkinColorRelatedToClearScreenBlockTraitConst"), s = function(e) {
n(o, e);
function o() {
var o = null !== e && e.apply(this, arguments) || this;
o.clearScreenBlockColor = hs.ColorProducerType.COLOR_BLUE;
return o;
}
o.prototype.registerTraitEventsMethods = function() {
return [ {
className: "Skin_Eliminate_Proxy",
methodName: "onBlockProducerTouchEnd"
}, {
className: "Skin_Proxy",
methodName: "onSkinUpdate"
} ];
};
o.prototype.onActive = function(e) {
if (hs.tp.isSkin_Eliminate_ProxyOnBlockProducerTouchEnd(e)) {
var o = e.args[0];
this.clearScreenBlockColor = o.state.color;
}
if (hs.tp.isSkin_ProxyOnSkinUpdate(e)) {
var r = e.args[0].skinId;
this.recordSkinTimes(r);
}
if (hs.tp.isCleanSceneUseSequenceSkinTraitGetIsTrigger(e) || hs.tp.isCleanSceneRandomSkinTraitGetIsTrigger(e)) {
e.returnState = !0;
e.returnValue = !1;
}
hs.tp.isClassBoardSplashAnimation_ProxySetBoardSplashAnimationState(e) && this.sendSkinUpdate(this.clearScreenBlockColor);
};
o.prototype.recordSkinTimes = function(e) {
var o = Date.now(), r = this.getTimesInfo();
if (!this.getIsSameDay(r.date, o)) {
r.date = o;
r.usedTimes = {};
}
r.usedTimes[e] = (r.usedTimes[e] || 0) + 1;
storage.setItem(a.STORAGE_KEY_USED_TIMES, r);
};
o.prototype.getTimesInfo = function() {
return storage.getItem(a.STORAGE_KEY_USED_TIMES, {
date: Date.now(),
usedSkinIds: [],
usedTimes: {}
});
};
o.prototype.getIsSameDay = function(e, o) {
var r = new Date(e), t = new Date(o);
return r.getFullYear() === t.getFullYear() && r.getMonth() === t.getMonth() && r.getDate() === t.getDate();
};
o.prototype.sendSkinUpdate = function(e) {
var o = this.getSkinData(e);
if (o && o.ID) {
var r = this.getTimesInfo();
r.usedSkinIds.push(o.ID.toString());
storage.setItem(a.STORAGE_KEY_USED_TIMES, r);
hs.EventManager.dispatchModuleEvent(new hs.E_Skin_Update("" + o.ID));
}
};
o.prototype.getSkinData = function(e) {
var o = this.getTimesInfo(), r = hs.skinRandomInfo.randomSkinPool.filter(function(e) {
return !o.usedSkinIds.includes(e.ID.toString()) && e.ID !== a.DEFAULT_SKIN_ID;
});
if (0 === r.length) {
o.usedSkinIds = [];
storage.setItem(a.STORAGE_KEY_USED_TIMES, o);
return this.getSkinData(e);
}
var t = this.getColorSchemeByColor(e), n = this.getSkinByScheme(t, r, o);
if (n) return n;
for (var i = a.SkinColorScheme.RED; i <= a.SkinColorScheme.OTHER; i++) {
var c = this.getSkinByScheme(i, r, o);
if (c) return c;
}
};
o.prototype.getColorSchemeByColor = function(e) {
var o = hs.skinInfo.currentSkinId;
if (Object.keys(a.SkinBlockColorSchemeMap).includes(o.toString())) {
var r = a.SkinBlockColorSchemeMap[o];
if (Object.keys(r).includes(e.toString())) return r[e];
}
return a.SkinIdColorSchemeList[o] ? a.SkinIdColorSchemeList[o] : a.BlockColorSchemeMap[e];
};
o.prototype.getSkinByScheme = function(e, o, r) {
var t, n = this.getSkinIdsByScheme(e);
return null === (t = o.filter(function(e) {
return n.includes(e.ID);
}).sort(function(e, o) {
var t = r.usedTimes[e.ID.toString()] || 0, n = r.usedTimes[o.ID.toString()] || 0;
return t === n ? Math.random() - .5 : t - n;
})) || void 0 === t ? void 0 : t[0];
};
o.prototype.getSkinIdsByScheme = function(e) {
if (e !== a.SkinColorScheme.OTHER) return a.ColorSchemeSkinIdList[e];
var o = a.ColorSchemeSkinIdList[a.SkinColorScheme.OTHER], r = Object.values(a.ColorSchemeSkinIdList).flat();
return l(o, hs.skinRandomInfo.randomSkinPool.map(function(e) {
return e.ID;
}).filter(function(e) {
return !r.includes(e);
}));
};
return i([ classId("SkinColorRelatedToClearScreenBlockTrait") ], o);
}(Trait);
r.SkinColorRelatedToClearScreenBlockTrait = s;
cc._RF.pop();
}, {
"./SkinColorRelatedToClearScreenBlockTraitConst": "SkinColorRelatedToClearScreenBlockTraitConst"
} ]
}, {}, [ "SkinColorRelatedToClearScreenBlockTrait", "SkinColorRelatedToClearScreenBlockTraitConst" ]);
//# sourceMappingURL=index.js.map
