window.__require = function e(t, r, n) {
function a(o, s) {
if (!r[o]) {
if (!t[o]) {
var h = o.split("/");
h = h[h.length - 1];
if (!t[h]) {
var c = "function" == typeof __require && __require;
if (!s && c) return c(h, !0);
if (i) return i(h, !0);
throw new Error("Cannot find module '" + o + "'");
}
o = h;
}
var u = r[o] = {
exports: {}
};
t[o][0].call(u.exports, function(e) {
return a(t[o][1][e] || e);
}, u, u.exports, e, t, r, n);
}
return r[o].exports;
}
for (var i = "function" == typeof __require && __require, o = 0; o < n.length; o++) a(n[o]);
return a;
}({
ChapterHardSequenceSkinTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "eac1e35gCpO1LMdc13w7XFd", "ChapterHardSequenceSkinTrait");
var n, a = this && this.__extends || (n = function(e, t) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
n(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), i = this && this.__decorate || function(e, t, r, n) {
var a, i = arguments.length, o = i < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, r) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) o = Reflect.decorate(e, t, r, n); else for (var s = e.length - 1; s >= 0; s--) (a = e[s]) && (o = (i < 3 ? a(o) : i > 3 ? a(t, r, o) : a(t, r)) || o);
return i > 3 && o && Object.defineProperty(t, r, o), o;
}, o = this && this.__awaiter || function(e, t, r, n) {
return new (r || (r = Promise))(function(a, i) {
function o(e) {
try {
h(n.next(e));
} catch (e) {
i(e);
}
}
function s(e) {
try {
h(n.throw(e));
} catch (e) {
i(e);
}
}
function h(e) {
e.done ? a(e.value) : (t = e.value, t instanceof r ? t : new r(function(e) {
e(t);
})).then(o, s);
var t;
}
h((n = n.apply(e, t || [])).next());
});
}, s = this && this.__generator || function(e, t) {
var r, n, a, i, o = {
label: 0,
sent: function() {
if (1 & a[0]) throw a[1];
return a[1];
},
trys: [],
ops: []
};
return i = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
return this;
}), i;
function s(e) {
return function(t) {
return h([ e, t ]);
};
}
function h(i) {
if (r) throw new TypeError("Generator is already executing.");
for (;o; ) try {
if (r = 1, n && (a = 2 & i[0] ? n.return : i[0] ? n.throw || ((a = n.return) && a.call(n), 
0) : n.next) && !(a = a.call(n, i[1])).done) return a;
(n = 0, a) && (i = [ 2 & i[0], a.value ]);
switch (i[0]) {
case 0:
case 1:
a = i;
break;

case 4:
o.label++;
return {
value: i[1],
done: !1
};

case 5:
o.label++;
n = i[1];
i = [ 0 ];
continue;

case 7:
i = o.ops.pop();
o.trys.pop();
continue;

default:
if (!(a = o.trys, a = a.length > 0 && a[a.length - 1]) && (6 === i[0] || 2 === i[0])) {
o = 0;
continue;
}
if (3 === i[0] && (!a || i[1] > a[0] && i[1] < a[3])) {
o.label = i[1];
break;
}
if (6 === i[0] && o.label < a[1]) {
o.label = a[1];
a = i;
break;
}
if (a && o.label < a[2]) {
o.label = a[2];
o.ops.push(i);
break;
}
a[2] && o.ops.pop();
o.trys.pop();
continue;
}
i = t.call(e, o);
} catch (e) {
i = [ 6, e ];
n = 0;
} finally {
r = a = 0;
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
r.ChapterHardSequenceSkinTrait = void 0;
var h = [ "1001", "1020", "1025", "1021", "1034", "1024", "1003", "1037", "1033", "1002", "1036", "1004", "1027", "1014", "1016", "1038", "1010", "1023", "1017", "1018", "1026", "1035", "1031", "1032", "1011", "1005", "1012", "1022", "1019", "1013", "1015", "1006", "1030", "1028", "1029", "1007", "1009", "1008", "1039" ], c = function(e) {
a(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.currentSkinId = hs.skinInfo.originSkinId;
t.hardSkinIndex = -1;
t.lastHardChapterNum = 0;
t.lastHardStage = 0;
t.switchingForEnter = !1;
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [];
};
t.prototype.onActive = function(e) {
var t;
return o(this, void 0, void 0, function() {
var r, n, a, i, o, c, u, p, f, l, d;
return s(this, function(s) {
switch (s.label) {
case 0:
if (hs.tp.isChapterGame_ProxyOnStartGame(e)) {
if (hs.gameInfo.gameMode !== hs.GameMode.Chapter) return [ 2 ];
r = hs.chapterGameInfo.chapterNum;
n = hs.chapterGameInfo.stage || 0;
e.replace = !0;
a = hs.chapterDifficultyInfo.chapterDifficultyList.get(r);
i = hs.chapterDifficultyInfo.isChapterDifficulty(a);
o = hs.skinInfo.originSkinId;
c = o;
if (i) {
u = h.length;
p = this.lastHardChapterNum !== r || this.lastHardStage !== n;
if (u > 0 && (p || this.hardSkinIndex < 0)) {
this.hardSkinIndex = (this.hardSkinIndex + 1 + u) % u;
this.lastHardChapterNum = r;
this.lastHardStage = n;
}
if (0 === u) ; else {
f = this.hardSkinIndex;
c = null !== (t = h[f]) && void 0 !== t ? t : o;
}
}
if (hs.skinInfo.currentSkinId === c) {
hs.UI.show(hs.ChapterPrefabConfig.ChapterGame);
return [ 2 ];
}
this.switchingForEnter = !0;
this.switchSkin(c);
}
if (!hs.tp.isIsOpenChangeSkinTraitOnSwitchSkinId(e)) return [ 3, 6 ];
if (hs.gameInfo.gameMode !== hs.GameMode.Chapter) return [ 3, 6 ];
if (!this.switchingForEnter) return [ 2 ];
e.replace = !0;
return hs.skinLoadInfo.skinResLoadedBarrier.isOpen ? [ 3, 2 ] : [ 4, hs.skinLoadInfo.skinResLoadedBarrier.wait() ];

case 1:
s.sent();
s.label = 2;

case 2:
hs.skinInfo.upDataBlockColorValueMap();
(l = TRAIT("IsOpenChangeSkinTrait")).updateAllBlockShader();
l.changeSkinBlockCompelet();
return hs.skinAtlasInfo.skinAutoAtlas ? [ 4, hs.delayTimeFrame(30) ] : [ 3, 5 ];

case 3:
s.sent();
return [ 4, hs.skinAtlas.createBlockAtlas() ];

case 4:
s.sent();
s.label = 5;

case 5:
hs.UI.show(hs.ChapterPrefabConfig.ChapterGame);
this.switchingForEnter = !1;
s.label = 6;

case 6:
if (hs.tp.isSkin_ProxyUpdateCurSkinIdStorage(e) && hs.gameInfo.gameMode === hs.GameMode.Chapter) {
d = e.args[0];
this.currentSkinId = d;
e.replace = !0;
}
if (hs.tp.isSkin_ProxyGetCurSkinIdStorage(e) && hs.gameInfo.gameMode === hs.GameMode.Chapter) {
e.replace = !0;
return [ 2, this.currentSkinId ];
}
return [ 2 ];
}
});
});
};
t.prototype.switchSkin = function(e) {
if (e) {
hs.EventManager.dispatchModuleEvent(new hs.E_Skin_Show(!0));
hs.EventManager.dispatchModuleEvent(new hs.E_Skin_Update(e));
}
};
i([ hs.storageProperty({
key: "ChapterHardSequenceSkin_currentSkinId"
}) ], t.prototype, "currentSkinId", void 0);
i([ hs.storageProperty({
key: "ChapterHardSequenceSkin_index"
}) ], t.prototype, "hardSkinIndex", void 0);
i([ hs.storageProperty({
key: "ChapterHardSequenceSkin_lastHardChapterNum"
}) ], t.prototype, "lastHardChapterNum", void 0);
i([ hs.storageProperty({
key: "ChapterHardSequenceSkin_lastHardStage"
}) ], t.prototype, "lastHardStage", void 0);
return i([ classId("ChapterHardSequenceSkinTrait") ], t);
}(Trait);
r.ChapterHardSequenceSkinTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "ChapterHardSequenceSkinTrait" ]);
//# sourceMappingURL=index.js.map
