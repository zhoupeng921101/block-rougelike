window.__require = function e(t, o, r) {
function n(a, s) {
if (!o[a]) {
if (!t[a]) {
var f = a.split("/");
f = f[f.length - 1];
if (!t[f]) {
var c = "function" == typeof __require && __require;
if (!s && c) return c(f, !0);
if (i) return i(f, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = f;
}
var l = o[a] = {
exports: {}
};
t[a][0].call(l.exports, function(e) {
return n(t[a][1][e] || e);
}, l, l.exports, e, t, o, r);
}
return o[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < r.length; a++) n(r[a]);
return n;
}({
ChapterReplaySkipGoalTrait: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "b16d7Snv5RNeZkDtwTEglMl", "ChapterReplaySkipGoalTrait");
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
}), i = this && this.__decorate || function(e, t, o, r) {
var n, i = arguments.length, a = i < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, o, r); else for (var s = e.length - 1; s >= 0; s--) (n = e[s]) && (a = (i < 3 ? n(a) : i > 3 ? n(t, o, a) : n(t, o)) || a);
return i > 3 && a && Object.defineProperty(t, o, a), a;
}, a = this && this.__awaiter || function(e, t, o, r) {
return new (o || (o = Promise))(function(n, i) {
function a(e) {
try {
f(r.next(e));
} catch (e) {
i(e);
}
}
function s(e) {
try {
f(r.throw(e));
} catch (e) {
i(e);
}
}
function f(e) {
e.done ? n(e.value) : (t = e.value, t instanceof o ? t : new o(function(e) {
e(t);
})).then(a, s);
var t;
}
f((r = r.apply(e, t || [])).next());
});
}, s = this && this.__generator || function(e, t) {
var o, r, n, i, a = {
label: 0,
sent: function() {
if (1 & n[0]) throw n[1];
return n[1];
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
return f([ e, t ]);
};
}
function f(i) {
if (o) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (o = 1, r && (n = 2 & i[0] ? r.return : i[0] ? r.throw || ((n = r.return) && n.call(r), 
0) : r.next) && !(n = n.call(r, i[1])).done) return n;
(r = 0, n) && (i = [ 2 & i[0], n.value ]);
switch (i[0]) {
case 0:
case 1:
n = i;
break;

case 4:
a.label++;
return {
value: i[1],
done: !1
};

case 5:
a.label++;
r = i[1];
i = [ 0 ];
continue;

case 7:
i = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(n = a.trys, n = n.length > 0 && n[n.length - 1]) && (6 === i[0] || 2 === i[0])) {
a = 0;
continue;
}
if (3 === i[0] && (!n || i[1] > n[0] && i[1] < n[3])) {
a.label = i[1];
break;
}
if (6 === i[0] && a.label < n[1]) {
a.label = n[1];
n = i;
break;
}
if (n && a.label < n[2]) {
a.label = n[2];
a.ops.push(i);
break;
}
n[2] && a.ops.pop();
a.trys.pop();
continue;
}
i = t.call(e, a);
} catch (e) {
i = [ 6, e ];
r = 0;
} finally {
o = n = 0;
}
if (5 & i[0]) throw i[1];
return {
value: i[0] ? i[1] : void 0,
done: !0
};
}
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.ChapterReplaySkipGoalTrait = void 0;
var f = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._gemTemplate = null;
t._effBoard = null;
t._effGemPool = [];
t._effGemInUseList = [];
t._hideEffectsTimeout = null;
t.isSkipGoal = !1;
return t;
}
t.prototype.onActive = function(e) {
hs.tp.isChapterGoal_ProxyOnGameReplay(e) && (this.isSkipGoal = !0);
if (hs.tp.isChapterGoal_ProxyOnChapterGameShow(e)) if (this.isSkipGoal) {
this.isSkipGoal = !1;
e.replace = !0;
this.showEffect();
} else this.loadPrefab();
};
t.prototype.loadPrefab = function() {
return a(this, void 0, void 0, function() {
var e, t;
return s(this, function(o) {
switch (o.label) {
case 0:
if (cc.isValid(this._effBoard)) return [ 2 ];
o.label = 1;

case 1:
o.trys.push([ 1, 3, , 4 ]);
return [ 4, hs.ResLoader.asyncLoadByBundle(this.traitName, "prefabs/ChapterReplaySkipGoal", cc.Prefab) ];

case 2:
e = o.sent();
if (cc.isValid(this._effBoard)) return [ 2 ];
t = cc.instantiate(e);
this._effBoard = t.getChildByName("board").getComponent(sp.Skeleton);
this._effBoard.node.removeFromParent();
this._gemTemplate = t.getChildByName("gem").getComponent(sp.Skeleton);
this._gemTemplate.node.removeFromParent();
this._effGemPool.push(this._gemTemplate);
t.destroy();
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
t.prototype.getGemEff = function() {
var e = null;
(e = this._effGemPool.length > 0 ? this._effGemPool.shift() : cc.instantiate(this._gemTemplate.node).getComponent(sp.Skeleton)).node.removeFromParent();
this._effGemInUseList.push(e);
return e;
};
t.prototype.hideEffects = function() {
var e = this;
if (this._hideEffectsTimeout) {
clearTimeout(this._hideEffectsTimeout);
this._hideEffectsTimeout = null;
}
this._effGemInUseList.forEach(function(t) {
t.node.removeFromParent();
e._effGemPool.push(t);
});
this._effGemInUseList.length = 0;
this._effBoard.node.removeFromParent();
};
t.prototype.showEffect = function() {
return a(this, void 0, void 0, function() {
var e = this;
return s(this, function(t) {
switch (t.label) {
case 0:
return [ 4, this.waitTopRender() ];

case 1:
t.sent();
if (!cc.isValid(this._effBoard)) return [ 2 ];
this.hideEffects();
this.showBoardEffect();
this.showTopEffect();
this._hideEffectsTimeout = setTimeoutSafe(function() {
e.hideEffects();
}, 2e3 * this.speed);
return [ 2 ];
}
});
});
};
t.prototype.waitTopRender = function() {
return a(this, void 0, void 0, function() {
var e, t;
return s(this, function(o) {
switch (o.label) {
case 0:
e = hs.chapterGameInfo.chapterCondition.Way;
hs.waitFor.start("chapterTopInfoRender");
return e != hs.ChapterType.collect ? [ 3, 2 ] : [ 4, hs.waitFor.wait("chapterTopInfoRender") ];

case 1:
o.sent();
t = Cinst(hs.ChapterTopInfoCollect);
if (!cc.isValid(t)) return [ 2 ];
t.cacheCollectItems.forEach(function(e) {
if (e.node.parent) {
var t = e.node.getComponent(hs.ChapterCollectTopItem);
if (!cc.isValid(t)) return;
t.numLab.node.active = !0;
}
});
o.label = 2;

case 2:
return [ 2 ];
}
});
});
};
t.prototype.showBoardEffect = function() {
var e = Cinst(hs.Board);
if (cc.isValid(e)) {
this._effBoard.node.setPosition(0, 0);
e.node.addChild(this._effBoard.node);
var t = hs.skinInfo.currentSkinId.toString(), o = t[0] + "0" + t.slice(1);
this._effBoard.setAnimation(0, o, !1);
this._effBoard.timeScale = 1 / this.speed;
}
};
t.prototype.showTopEffect = function() {
var e = this, t = hs.chapterGameInfo.chapterCondition.Way;
if (t == hs.ChapterType.score) {
var o = Cinst(hs.ChapterTopInfoScore);
if (!cc.isValid(o)) return;
} else if (t == hs.ChapterType.collect) {
var r = Cinst(hs.ChapterTopInfoCollect);
if (!cc.isValid(r)) return;
r.cacheCollectItems.forEach(function(t) {
if (t.node.parent) {
var o = t.node.getComponent(hs.ChapterCollectTopItem);
if (!cc.isValid(o)) return;
var r = e.getGemEff();
o.node.addChild(r.node);
r.node.setPosition(o.gemImg.node.position);
r.setAnimation(0, o.state.color + "_in", !1);
r.timeScale = 1 / e.speed;
}
});
}
};
Object.defineProperty(t.prototype, "speed", {
get: function() {
var e;
return null !== (e = cc.director._kSpeed) && void 0 !== e ? e : 1;
},
enumerable: !1,
configurable: !0
});
return i([ classId("ChapterReplaySkipGoalTrait") ], t);
}(Trait);
o.ChapterReplaySkipGoalTrait = f;
cc._RF.pop();
}, {} ]
}, {}, [ "ChapterReplaySkipGoalTrait" ]);
//# sourceMappingURL=index.js.map
