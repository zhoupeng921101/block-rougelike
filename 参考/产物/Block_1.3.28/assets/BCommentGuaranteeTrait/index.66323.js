window.__require = function e(t, n, o) {
function r(i, m) {
if (!n[i]) {
if (!t[i]) {
var c = i.split("/");
c = c[c.length - 1];
if (!t[c]) {
var s = "function" == typeof __require && __require;
if (!m && s) return s(c, !0);
if (a) return a(c, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = c;
}
var u = n[i] = {
exports: {}
};
t[i][0].call(u.exports, function(e) {
return r(t[i][1][e] || e);
}, u, u.exports, e, t, n, o);
}
return n[i].exports;
}
for (var a = "function" == typeof __require && __require, i = 0; i < o.length; i++) r(o[i]);
return r;
}({
BCommentGuaranteeTrait: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "27f0a/LR3JMdZJoLer77yCG", "BCommentGuaranteeTrait");
var o, r = this && this.__extends || (o = function(e, t) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
o(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), a = this && this.__decorate || function(e, t, n, o) {
var r, a = arguments.length, i = a < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, n) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(e, t, n, o); else for (var m = e.length - 1; m >= 0; m--) (r = e[m]) && (i = (a < 3 ? r(i) : a > 3 ? r(t, n, i) : r(t, n)) || i);
return a > 3 && i && Object.defineProperty(t, n, i), i;
}, i = this && this.__awaiter || function(e, t, n, o) {
return new (n || (n = Promise))(function(r, a) {
function i(e) {
try {
c(o.next(e));
} catch (e) {
a(e);
}
}
function m(e) {
try {
c(o.throw(e));
} catch (e) {
a(e);
}
}
function c(e) {
e.done ? r(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(i, m);
var t;
}
c((o = o.apply(e, t || [])).next());
});
}, m = this && this.__generator || function(e, t) {
var n, o, r, a, i = {
label: 0,
sent: function() {
if (1 & r[0]) throw r[1];
return r[1];
},
trys: [],
ops: []
};
return a = {
next: m(0),
throw: m(1),
return: m(2)
}, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
return this;
}), a;
function m(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(a) {
if (n) throw new TypeError("Generator is already executing.");
for (;i; ) try {
if (n = 1, o && (r = 2 & a[0] ? o.return : a[0] ? o.throw || ((r = o.return) && r.call(o), 
0) : o.next) && !(r = r.call(o, a[1])).done) return r;
(o = 0, r) && (a = [ 2 & a[0], r.value ]);
switch (a[0]) {
case 0:
case 1:
r = a;
break;

case 4:
i.label++;
return {
value: a[1],
done: !1
};

case 5:
i.label++;
o = a[1];
a = [ 0 ];
continue;

case 7:
a = i.ops.pop();
i.trys.pop();
continue;

default:
if (!(r = i.trys, r = r.length > 0 && r[r.length - 1]) && (6 === a[0] || 2 === a[0])) {
i = 0;
continue;
}
if (3 === a[0] && (!r || a[1] > r[0] && a[1] < r[3])) {
i.label = a[1];
break;
}
if (6 === a[0] && i.label < r[1]) {
i.label = r[1];
r = a;
break;
}
if (r && i.label < r[2]) {
i.label = r[2];
i.ops.push(a);
break;
}
r[2] && i.ops.pop();
i.trys.pop();
continue;
}
a = t.call(e, i);
} catch (e) {
a = [ 6, e ];
o = 0;
} finally {
n = r = 0;
}
if (5 & a[0]) throw a[1];
return {
value: a[0] ? a[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.BCommentGuaranteeTrait = void 0;
var c = function(e) {
r(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "CommentSkin_Config_proxy",
methodName: "onGameInitComplete"
} ];
};
t.prototype.onCreate = function() {
var e = this;
hs.UI.addEventListener("open", function(t) {
t === hs.PrefabConfig.commentSkin && e.onEventShowComment();
});
};
t.prototype.onActive = function(e) {
hs.tp.isCommentSkin_Config_proxyOnGameInitComplete(e) && hs.commentSkinInfo.remoteCommentConfig();
(hs.tp.isCommentSkin_proxyOnGameEnd(e) || hs.tp.isCommentSkin_proxyOnGameReplay(e)) && this.onGameEnd();
if (hs.tp.isCommentSkin_proxyOnResultPanelShow(e)) {
var t = TRAIT("BCommentDisplayTrait");
if (null == t ? void 0 : t.active) return;
var n = hs.commentSkinInfo.getCommentLocalData, o = n.commentState, r = n.commentGameHighNum, a = n.commentGameNum;
if (o) return;
var i = hs.commentSkinInfo, m = i.gameHideTimes, c = i.gameTimes;
hs.commentSkinInfo.commentState ? hs.gameInfo.gameMode === hs.GameMode.Class && r >= m && this.showComment(2) : a >= c && this.showComment(1);
}
};
t.prototype.onGameEnd = function() {
var e = hs.commentSkinInfo.getCommentLocalData;
if (e) {
hs.commentSkinInfo.updateCommentLocalData("commentGameNum", e.commentGameNum + 1);
hs.gameInfo.gameMode === hs.GameMode.Class && storage.getItem("classRecordHigh", !1) && hs.commentSkinInfo.updateCommentLocalData("commentGameHighNum", e.commentGameHighNum + 1);
}
};
t.prototype.showComment = function(e) {
var t = this;
hs.commentSkinInfo.resetCommentLocalData(!0);
hs.commentSkinInfo.setCommentTypeId(e);
setTimeout(function() {
return i(t, void 0, void 0, function() {
var e, t;
return m(this, function(n) {
switch (n.label) {
case 0:
return hs.alertLayer && cc.isValid(hs.alertLayer) ? [ 4, hs.UI.show(hs.PrefabConfig.commentSkin, hs.alertLayer) ] : [ 2 ];

case 1:
e = n.sent();
null == (t = null == e ? void 0 : e.getComponent(hs.CommentSkin)) || t.setState({
startState: -1
});
return [ 2 ];
}
});
});
}, 1e3);
};
t.prototype.onEventShowComment = function() {
storage.setItem("commentStateKey", !0);
};
return a([ classId("BCommentGuaranteeTrait") ], t);
}(Trait);
n.BCommentGuaranteeTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "BCommentGuaranteeTrait" ]);
//# sourceMappingURL=index.js.map
