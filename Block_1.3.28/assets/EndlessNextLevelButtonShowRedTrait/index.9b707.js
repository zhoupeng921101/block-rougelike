window.__require = function e(t, n, r) {
function o(c, a) {
if (!n[c]) {
if (!t[c]) {
var u = c.split("/");
u = u[u.length - 1];
if (!t[u]) {
var s = "function" == typeof __require && __require;
if (!a && s) return s(u, !0);
if (i) return i(u, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = u;
}
var l = n[c] = {
exports: {}
};
t[c][0].call(l.exports, function(e) {
return o(t[c][1][e] || e);
}, l, l.exports, e, t, n, r);
}
return n[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < r.length; c++) o(r[c]);
return o;
}({
EndlessNextLevelButtonShowRedTrait: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "59bf700n9JCB5hIGTijHqUJ", "EndlessNextLevelButtonShowRedTrait");
var r, o = this && this.__extends || (r = function(e, t) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
r(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), i = this && this.__decorate || function(e, t, n, r) {
var o, i = arguments.length, c = i < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, n) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(e, t, n, r); else for (var a = e.length - 1; a >= 0; a--) (o = e[a]) && (c = (i < 3 ? o(c) : i > 3 ? o(t, n, c) : o(t, n)) || c);
return i > 3 && c && Object.defineProperty(t, n, c), c;
}, c = this && this.__awaiter || function(e, t, n, r) {
return new (n || (n = Promise))(function(o, i) {
function c(e) {
try {
u(r.next(e));
} catch (e) {
i(e);
}
}
function a(e) {
try {
u(r.throw(e));
} catch (e) {
i(e);
}
}
function u(e) {
e.done ? o(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(c, a);
var t;
}
u((r = r.apply(e, t || [])).next());
});
}, a = this && this.__generator || function(e, t) {
var n, r, o, i, c = {
label: 0,
sent: function() {
if (1 & o[0]) throw o[1];
return o[1];
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
if (n) throw new TypeError("Generator is already executing.");
for (;c; ) try {
if (n = 1, r && (o = 2 & i[0] ? r.return : i[0] ? r.throw || ((o = r.return) && o.call(r), 
0) : r.next) && !(o = o.call(r, i[1])).done) return o;
(r = 0, o) && (i = [ 2 & i[0], o.value ]);
switch (i[0]) {
case 0:
case 1:
o = i;
break;

case 4:
c.label++;
return {
value: i[1],
done: !1
};

case 5:
c.label++;
r = i[1];
i = [ 0 ];
continue;

case 7:
i = c.ops.pop();
c.trys.pop();
continue;

default:
if (!(o = c.trys, o = o.length > 0 && o[o.length - 1]) && (6 === i[0] || 2 === i[0])) {
c = 0;
continue;
}
if (3 === i[0] && (!o || i[1] > o[0] && i[1] < o[3])) {
c.label = i[1];
break;
}
if (6 === i[0] && c.label < o[1]) {
c.label = o[1];
o = i;
break;
}
if (o && c.label < o[2]) {
c.label = o[2];
c.ops.push(i);
break;
}
o[2] && c.ops.pop();
c.trys.pop();
continue;
}
i = t.call(e, c);
} catch (e) {
i = [ 6, e ];
r = 0;
} finally {
n = o = 0;
}
if (5 & i[0]) throw i[1];
return {
value: i[0] ? i[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.EndlessNextLevelButtonShowRedTrait = void 0;
var u = function(e) {
o(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onActive = function(e) {
hs.tp.isChapterCollectWinRender(e) && this.redPointShowLogic(e);
hs.tp.isChapterScoreWinRender(e) && this.redPointShowLogic(e);
};
t.prototype.redPointShowLogic = function(e) {
return c(this, void 0, void 0, function() {
var t, n, r, o, i, c, u, s;
return a(this, function(a) {
switch (a.label) {
case 0:
t = !1;
if (hs.chapterConfigInfo.isChapterMaxNum) t = !1; else {
n = hs.chapterConfigInfo._chapterDatas;
r = hs.chapterGameInfo.chapterNum;
o = n[r >= 96 ? 0 : r].Condition.Way;
i = n[0 === r ? 95 : r - 1].Condition.Way;
o !== i && (t = !0);
}
c = e.target.playBtn;
u = c.node;
s = u.getChildByName("redNode");
if (!t) return [ 3, 2 ];
if (s) {
s.active = !0;
return [ 2 ];
}
return [ 4, hs.ResLoader.asyncLoadByBundle("EndlessNextLevelButtonShowRedTrait", "prefab/NextLevelButtonRed", cc.Prefab).then(function(e) {
if (cc.isValid(e) && cc.isValid(u)) {
var t = cc.instantiate(e);
t.name = "redNode";
t.setPosition(new cc.Vec2(276, 70));
u.addChild(t);
}
}) ];

case 1:
a.sent();
return [ 3, 3 ];

case 2:
s && (s.active = !1);
a.label = 3;

case 3:
return [ 2 ];
}
});
});
};
return i([ classId("EndlessNextLevelButtonShowRedTrait") ], t);
}(Trait);
n.EndlessNextLevelButtonShowRedTrait = u;
cc._RF.pop();
}, {} ]
}, {}, [ "EndlessNextLevelButtonShowRedTrait" ]);
//# sourceMappingURL=index.js.map
