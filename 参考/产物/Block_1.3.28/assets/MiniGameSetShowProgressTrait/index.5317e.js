window.__require = function e(t, r, o) {
function n(s, a) {
if (!r[s]) {
if (!t[s]) {
var c = s.split("/");
c = c[c.length - 1];
if (!t[c]) {
var l = "function" == typeof __require && __require;
if (!a && l) return l(c, !0);
if (i) return i(c, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = c;
}
var u = r[s] = {
exports: {}
};
t[s][0].call(u.exports, function(e) {
return n(t[s][1][e] || e);
}, u, u.exports, e, t, r, o);
}
return r[s].exports;
}
for (var i = "function" == typeof __require && __require, s = 0; s < o.length; s++) n(o[s]);
return n;
}({
MiniGameSetShowProgressTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "db7a3WfVqNCDr/HJUo4gYs1", "MiniGameSetShowProgressTrait");
var o, n = this && this.__extends || (o = function(e, t) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
o(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), i = this && this.__decorate || function(e, t, r, o) {
var n, i = arguments.length, s = i < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, o); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (i < 3 ? n(s) : i > 3 ? n(t, r, s) : n(t, r)) || s);
return i > 3 && s && Object.defineProperty(t, r, s), s;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.MiniGameSetShowProgressTrait = void 0;
var s = e("../components/MiniGameSetShowProgress"), a = function(e) {
n(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onActive = function(e) {
if (hs.tp.isGameLobbyGlhallMoreGamesPopupItemAddOtherUI(e)) {
var t = e.args[0], r = e.args[1];
if (!cc.isValid(t)) return;
var o = t.getChildByName("MiniGameSetShowProgress");
if (cc.isValid(o)) {
o.getComponent(s.default).setState({
name: r.name
});
return;
}
hs.ResLoader.loadByBundle("MiniGameSetShowProgressTrait", "prefabs/MiniGameSetShowProgress", cc.Prefab, function(e, o) {
if (!e && cc.isValid(t) && o) {
var n = cc.instantiate(o);
n.setPosition(213, 47);
t.addChild(n);
n.getComponent(s.default).setState({
name: r.name
});
}
});
}
if (hs.tp.isGameLobbyGLHallMoreGamesPopupViewFreshInitState(e)) {
e.returnState = !0;
e.returnValue = !1;
}
};
return i([ classId("MiniGameSetShowProgressTrait"), classMethodWatch() ], t);
}(Trait);
r.MiniGameSetShowProgressTrait = a;
cc._RF.pop();
}, {
"../components/MiniGameSetShowProgress": "MiniGameSetShowProgress"
} ],
MiniGameSetShowProgress: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "9b05aW+2vNK/5/NdU+WjH1R", "MiniGameSetShowProgress");
var o, n = this && this.__extends || (o = function(e, t) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
o(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), i = this && this.__decorate || function(e, t, r, o) {
var n, i = arguments.length, s = i < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, o); else for (var a = e.length - 1; a >= 0; a--) (n = e[a]) && (s = (i < 3 ? n(s) : i > 3 ? n(t, r, s) : n(t, r)) || s);
return i > 3 && s && Object.defineProperty(t, r, s), s;
}, s = this && this.__awaiter || function(e, t, r, o) {
return new (r || (r = Promise))(function(n, i) {
function s(e) {
try {
c(o.next(e));
} catch (e) {
i(e);
}
}
function a(e) {
try {
c(o.throw(e));
} catch (e) {
i(e);
}
}
function c(e) {
e.done ? n(e.value) : (t = e.value, t instanceof r ? t : new r(function(e) {
e(t);
})).then(s, a);
var t;
}
c((o = o.apply(e, t || [])).next());
});
}, a = this && this.__generator || function(e, t) {
var r, o, n, i, s = {
label: 0,
sent: function() {
if (1 & n[0]) throw n[1];
return n[1];
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
return c([ e, t ]);
};
}
function c(i) {
if (r) throw new TypeError("Generator is already executing.");
for (;s; ) try {
if (r = 1, o && (n = 2 & i[0] ? o.return : i[0] ? o.throw || ((n = o.return) && n.call(o), 
0) : o.next) && !(n = n.call(o, i[1])).done) return n;
(o = 0, n) && (i = [ 2 & i[0], n.value ]);
switch (i[0]) {
case 0:
case 1:
n = i;
break;

case 4:
s.label++;
return {
value: i[1],
done: !1
};

case 5:
s.label++;
o = i[1];
i = [ 0 ];
continue;

case 7:
i = s.ops.pop();
s.trys.pop();
continue;

default:
if (!(n = s.trys, n = n.length > 0 && n[n.length - 1]) && (6 === i[0] || 2 === i[0])) {
s = 0;
continue;
}
if (3 === i[0] && (!n || i[1] > n[0] && i[1] < n[3])) {
s.label = i[1];
break;
}
if (6 === i[0] && s.label < n[1]) {
s.label = n[1];
n = i;
break;
}
if (n && s.label < n[2]) {
s.label = n[2];
s.ops.push(i);
break;
}
n[2] && s.ops.pop();
s.trys.pop();
continue;
}
i = t.call(e, s);
} catch (e) {
i = [ 6, e ];
o = 0;
} finally {
r = n = 0;
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
var c = cc._decorator, l = c.ccclass, u = c.property, h = function(e) {
n(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.progress = null;
t.progressBg = null;
return t;
}
t.prototype.render = function() {
return s(this, void 0, void 0, function() {
var e, t;
return a(this, function(r) {
switch (r.label) {
case 0:
e = this.state.name;
this.node.active = !0;
t = this.getProgress(e);
this.progress.string = t;
return [ 4, hs.nextFrame() ];

case 1:
r.sent();
if (this.progress.node.width > 150) {
this.progressBg.width = this.progress.node.width - 150 + 184;
this.node.x = 213 - (this.progress.node.width - 150) / 2;
}
return [ 2 ];
}
});
});
};
t.prototype.getProgress = function(e) {
var t;
switch (e) {
case "一笔画":
if ((t = localStorage.getItem("BlockFillPlayerData")) && (t = JSON.parse(t)).BeforeEasyDataList) {
var r = t.BeforeEasyDataList.length;
if (r > 0) return "Level " + this.getProgressShow(r);
}
this.node.active = !1;
return "";

case "井字棋":
this.node.active = !1;
return "";

case "合成大西瓜":
if ((t = localStorage.getItem("gl_fruit_user")) && (t = JSON.parse(t)).bestScore) return "Score " + this.getProgressShow(t.bestScore);
this.node.active = !1;
return "";

case "水排序":
if (localStorage.getItem("GlWaterGuilde")) return (t = localStorage.getItem("GLWaterLevelId")) ? "Level " + this.getProgressShow(t) : "Level 1";
this.node.active = !1;
return "";

case "连连看":
if ((t = localStorage.getItem("HsOnet_local")) && (t = JSON.parse(t)).Level) return "Level " + this.getProgressShow(t.Level);
this.node.active = !1;
return "";

case "麻将":
if ((t = localStorage.getItem("gl_mahjong_user")) && (t = JSON.parse(t)).level) return "Level " + this.getProgressShow(t.level);
this.node.active = !1;
return "";

case "数独":
if ((t = localStorage.getItem("LS_SudokuData")) && (t = JSON.parse(t)).data && !t.data.showGuide) return "Level " + this.getProgressShow(t.data.winCount + 1);
this.node.active = !1;
return "";

case "土耳其方块":
if (t = storage.getItem("jewelHighScore", 0)) return "Score " + this.getProgressShow(t);
this.node.active = !1;
return "";

default:
this.node.active = !1;
return "";
}
};
t.prototype.getProgressShow = function(e) {
var t = Math.floor(e).toString();
return t.length >= 10 ? Math.floor(e / 1e6) + "m" : t.length >= 7 ? Math.floor(e / 1e3) + "k" : Math.floor(e).toString();
};
i([ u(cc.Label) ], t.prototype, "progress", void 0);
i([ u(cc.Node) ], t.prototype, "progressBg", void 0);
return i([ l ], t);
}(hs.Component);
r.default = h;
cc._RF.pop();
}, {} ]
}, {}, [ "MiniGameSetShowProgress", "MiniGameSetShowProgressTrait" ]);
//# sourceMappingURL=index.js.map
