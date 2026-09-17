window.__require = function t(e, r, n) {
function o(a, c) {
if (!r[a]) {
if (!e[a]) {
var p = a.split("/");
p = p[p.length - 1];
if (!e[p]) {
var u = "function" == typeof __require && __require;
if (!c && u) return u(p, !0);
if (i) return i(p, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = p;
}
var l = r[a] = {
exports: {}
};
e[a][0].call(l.exports, function(t) {
return o(e[a][1][t] || t);
}, l, l.exports, t, e, r, n);
}
return r[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < n.length; a++) o(n[a]);
return o;
}({
ChapterSkipGoalPopupTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "5f9e4CYzidHhb1nbv27i5LI", "ChapterSkipGoalPopupTrait");
var n, o = this && this.__extends || (n = function(t, e) {
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
}), i = this && this.__decorate || function(t, e, r, n) {
var o, i = arguments.length, a = i < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, r) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, r, n); else for (var c = t.length - 1; c >= 0; c--) (o = t[c]) && (a = (i < 3 ? o(a) : i > 3 ? o(e, r, a) : o(e, r)) || a);
return i > 3 && a && Object.defineProperty(e, r, a), a;
}, a = this && this.__awaiter || function(t, e, r, n) {
return new (r || (r = Promise))(function(o, i) {
function a(t) {
try {
p(n.next(t));
} catch (t) {
i(t);
}
}
function c(t) {
try {
p(n.throw(t));
} catch (t) {
i(t);
}
}
function p(t) {
t.done ? o(t.value) : (e = t.value, e instanceof r ? e : new r(function(t) {
t(e);
})).then(a, c);
var e;
}
p((n = n.apply(t, e || [])).next());
});
}, c = this && this.__generator || function(t, e) {
var r, n, o, i, a = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
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
function c(t) {
return function(e) {
return p([ t, e ]);
};
}
function p(i) {
if (r) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (r = 1, n && (o = 2 & i[0] ? n.return : i[0] ? n.throw || ((o = n.return) && o.call(n), 
0) : n.next) && !(o = o.call(n, i[1])).done) return o;
(n = 0, o) && (i = [ 2 & i[0], o.value ]);
switch (i[0]) {
case 0:
case 1:
o = i;
break;

case 4:
a.label++;
return {
value: i[1],
done: !1
};

case 5:
a.label++;
n = i[1];
i = [ 0 ];
continue;

case 7:
i = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(o = a.trys, o = o.length > 0 && o[o.length - 1]) && (6 === i[0] || 2 === i[0])) {
a = 0;
continue;
}
if (3 === i[0] && (!o || i[1] > o[0] && i[1] < o[3])) {
a.label = i[1];
break;
}
if (6 === i[0] && a.label < o[1]) {
a.label = o[1];
o = i;
break;
}
if (o && a.label < o[2]) {
a.label = o[2];
a.ops.push(i);
break;
}
o[2] && a.ops.pop();
a.trys.pop();
continue;
}
i = e.call(t, a);
} catch (t) {
i = [ 6, t ];
n = 0;
} finally {
r = o = 0;
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
r.ChapterSkipGoalPopupTrait = void 0;
var p = function(t) {
o(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.onActive = function(t) {
if (hs.tp.isChapterGoal_ProxyOnShowGoalUI(t) && this.isLevelMeet()) {
t.replace = !0;
t.returnState = !0;
hs.waitFor.start("chapterTopInfoRender");
var e = hs.chapterGameInfo.chapterCondition.Way;
e === hs.ChapterType.score ? this.handleScore() : e === hs.ChapterType.collect && this.handleCollect();
}
};
e.prototype.isLevelMeet = function() {
var t = hs.chapterGameInfo, e = t.stage, r = t.chapterNum;
return e > 1 || r + 1 > this.props.level;
};
e.prototype.handleScore = function() {
var t;
return a(this, void 0, void 0, function() {
var e, r;
return c(this, function(n) {
switch (n.label) {
case 0:
return [ 4, CinstAsync(hs.ChapterTopInfoScore) ];

case 1:
e = n.sent();
if (cc.isValid(null === (t = null == e ? void 0 : e.targetLab) || void 0 === t ? void 0 : t.node)) {
(r = e.targetLab.node).active = !0;
cc.tween(r).to(.1, {
scale: 1.1 * .4
}).to(.1, {
scale: .4
}).start();
}
return [ 2 ];
}
});
});
};
e.prototype.handleCollect = function() {
return a(this, void 0, void 0, function() {
var t;
return c(this, function(e) {
switch (e.label) {
case 0:
return [ 4, CinstAsync(hs.ChapterTopInfoCollect) ];

case 1:
t = e.sent();
return [ 4, hs.waitFor.wait("chapterTopInfoRender") ];

case 2:
e.sent();
cc.isValid(t) && t.cacheCollectItems.forEach(function(t) {
t.node.getComponent(hs.ChapterCollectTopItem).playAction();
});
return [ 2 ];
}
});
});
};
return i([ classId("ChapterSkipGoalPopupTrait") ], e);
}(Trait);
r.ChapterSkipGoalPopupTrait = p;
cc._RF.pop();
}, {} ]
}, {}, [ "ChapterSkipGoalPopupTrait" ]);
//# sourceMappingURL=index.js.map
