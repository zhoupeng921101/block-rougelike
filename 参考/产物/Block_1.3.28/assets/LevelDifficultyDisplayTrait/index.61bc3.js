window.__require = function e(t, r, i) {
function n(o, c) {
if (!r[o]) {
if (!t[o]) {
var l = o.split("/");
l = l[l.length - 1];
if (!t[l]) {
var u = "function" == typeof __require && __require;
if (!c && u) return u(l, !0);
if (a) return a(l, !0);
throw new Error("Cannot find module '" + o + "'");
}
o = l;
}
var s = r[o] = {
exports: {}
};
t[o][0].call(s.exports, function(e) {
return n(t[o][1][e] || e);
}, s, s.exports, e, t, r, i);
}
return r[o].exports;
}
for (var a = "function" == typeof __require && __require, o = 0; o < i.length; o++) n(i[o]);
return n;
}({
LevelDifficultyDisplayTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "99044bM6apCfJEpEfghibW7", "LevelDifficultyDisplayTrait");
var i, n = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
i(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), a = this && this.__decorate || function(e, t, r, i) {
var n, a = arguments.length, o = a < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, r) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) o = Reflect.decorate(e, t, r, i); else for (var c = e.length - 1; c >= 0; c--) (n = e[c]) && (o = (a < 3 ? n(o) : a > 3 ? n(t, r, o) : n(t, r)) || o);
return a > 3 && o && Object.defineProperty(t, r, o), o;
}, o = this && this.__awaiter || function(e, t, r, i) {
return new (r || (r = Promise))(function(n, a) {
function o(e) {
try {
l(i.next(e));
} catch (e) {
a(e);
}
}
function c(e) {
try {
l(i.throw(e));
} catch (e) {
a(e);
}
}
function l(e) {
e.done ? n(e.value) : (t = e.value, t instanceof r ? t : new r(function(e) {
e(t);
})).then(o, c);
var t;
}
l((i = i.apply(e, t || [])).next());
});
}, c = this && this.__generator || function(e, t) {
var r, i, n, a, o = {
label: 0,
sent: function() {
if (1 & n[0]) throw n[1];
return n[1];
},
trys: [],
ops: []
};
return a = {
next: c(0),
throw: c(1),
return: c(2)
}, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
return this;
}), a;
function c(e) {
return function(t) {
return l([ e, t ]);
};
}
function l(a) {
if (r) throw new TypeError("Generator is already executing.");
for (;o; ) try {
if (r = 1, i && (n = 2 & a[0] ? i.return : a[0] ? i.throw || ((n = i.return) && n.call(i), 
0) : i.next) && !(n = n.call(i, a[1])).done) return n;
(i = 0, n) && (a = [ 2 & a[0], n.value ]);
switch (a[0]) {
case 0:
case 1:
n = a;
break;

case 4:
o.label++;
return {
value: a[1],
done: !1
};

case 5:
o.label++;
i = a[1];
a = [ 0 ];
continue;

case 7:
a = o.ops.pop();
o.trys.pop();
continue;

default:
if (!(n = o.trys, n = n.length > 0 && n[n.length - 1]) && (6 === a[0] || 2 === a[0])) {
o = 0;
continue;
}
if (3 === a[0] && (!n || a[1] > n[0] && a[1] < n[3])) {
o.label = a[1];
break;
}
if (6 === a[0] && o.label < n[1]) {
o.label = n[1];
n = a;
break;
}
if (n && o.label < n[2]) {
o.label = n[2];
o.ops.push(a);
break;
}
n[2] && o.ops.pop();
o.trys.pop();
continue;
}
a = t.call(e, o);
} catch (e) {
a = [ 6, e ];
i = 0;
} finally {
r = n = 0;
}
if (5 & a[0]) throw a[1];
return {
value: a[0] ? a[1] : void 0,
done: !0
};
}
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.LevelDifficultyDisplayTrait = void 0;
var l = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.barrier = new hs.Barrier();
return t;
}
t.prototype.onActive = function(e) {
return o(this, void 0, void 0, function() {
var t;
return c(this, function() {
hs.tp.isChapterList_ProxyOpenUI(e) && this.preloadBundle();
if (hs.tp.isChapterGoalAddLevelDifficultyDisplay(e)) {
if (!(t = e.target) || !t.bg) return [ 2 ];
if (!this.barrier.isOpen) return [ 2 ];
this.executeLevelDifficultyDisplay(t);
}
return [ 2 ];
});
});
};
t.prototype.preloadBundle = function() {
var e = this;
hs.ResLoader.loadBundle("LevelDifficultyDisplayTrait", function(t, r) {
t || !r || r && e.barrier.open();
});
};
t.prototype.executeLevelDifficultyDisplay = function(e) {
return o(this, void 0, Promise, function() {
var t;
return c(this, function(r) {
switch (r.label) {
case 0:
return [ 4, this.getOrCreateLevelDifficultyDisplayNode(e) ];

case 1:
return (t = r.sent()) ? [ 4, this.setDifficultyIcon(t) ] : [ 2 ];

case 2:
r.sent();
return [ 2 ];
}
});
});
};
t.prototype.getOrCreateLevelDifficultyDisplayNode = function(e) {
var t;
return o(this, void 0, Promise, function() {
var r, i;
return c(this, function(n) {
switch (n.label) {
case 0:
if (null != (r = e.bg.getChildByName("LevelDifficultyDisplay"))) {
r.active = !0;
return [ 2, r ];
}
n.label = 1;

case 1:
n.trys.push([ 1, 3, , 4 ]);
return [ 4, hs.ResLoader.asyncLoadByBundle("LevelDifficultyDisplayTrait", "prefabs/LevelDifficultyDisplay", cc.Prefab) ];

case 2:
i = n.sent();
(r = cc.instantiate(i)).name = "LevelDifficultyDisplay";
r.parent = e.bg;
r.active = !0;
(null === (t = TRAIT("PercentStreamerTrait")) || void 0 === t ? void 0 : t.active) ? r.y = e.bg.height / 2 + 7 : r.y = e.bg.height / 2 + 11;
return [ 2, r ];

case 3:
n.sent();
return [ 2, null ];

case 4:
return [ 2 ];
}
});
});
};
t.prototype.setDifficultyIcon = function(e) {
return o(this, void 0, Promise, function() {
var t, r, i, n, a;
return c(this, function(o) {
switch (o.label) {
case 0:
t = hs.chapterDifficultyInfo.chapterDifficultyList.get(hs.chapterGameInfo.chapterNum);
if (!(r = e.getChildByName("levelTitle"))) return [ 2 ];
r.active = !1;
if (!(i = r.getComponent(cc.Sprite))) return [ 2 ];
if (!(n = this.getDifficultyIconPath(t))) return [ 3, 4 ];
o.label = 1;

case 1:
o.trys.push([ 1, 3, , 4 ]);
return [ 4, hs.ResLoader.asyncLoadByBundle("LevelDifficultyDisplayTrait", n, cc.SpriteFrame) ];

case 2:
a = o.sent();
i.spriteFrame = a;
r.active = !0;
return [ 3, 4 ];

case 3:
o.sent();
return [ 3, 4 ];

case 4:
return [ 2 ];
}
});
});
};
t.prototype.getDifficultyIconPath = function(e) {
switch (e) {
case hs.CHAPTER_DIFF_TYPE.DIFFICULT:
return "textures/gameplay_img_label_hard";

case hs.CHAPTER_DIFF_TYPE.MEDIUM:
return "textures/gameplay_img_label_normal";

case hs.CHAPTER_DIFF_TYPE.SIMPLE:
return "textures/gameplay_img_label_easy";

default:
return null;
}
};
return a([ classId("LevelDifficultyDisplayTrait"), classMethodWatch() ], t);
}(Trait);
r.LevelDifficultyDisplayTrait = l;
cc._RF.pop();
}, {} ]
}, {}, [ "LevelDifficultyDisplayTrait" ]);
//# sourceMappingURL=index.js.map
