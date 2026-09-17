window.__require = function t(e, r, a) {
function s(n, h) {
if (!r[n]) {
if (!e[n]) {
var i = n.split("/");
i = i[i.length - 1];
if (!e[i]) {
var p = "function" == typeof __require && __require;
if (!h && p) return p(i, !0);
if (o) return o(i, !0);
throw new Error("Cannot find module '" + n + "'");
}
n = i;
}
var u = r[n] = {
exports: {}
};
e[n][0].call(u.exports, function(t) {
return s(e[n][1][t] || t);
}, u, u.exports, t, e, r, a);
}
return r[n].exports;
}
for (var o = "function" == typeof __require && __require, n = 0; n < a.length; n++) s(a[n]);
return s;
}({
Travel_chapter_pushTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "bd275x40iNFy6xARGpnDlER", "Travel_chapter_pushTrait");
var a, s = this && this.__extends || (a = function(t, e) {
return (a = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
})(t, e);
}, function(t, e) {
a(t, e);
function r() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
}), o = this && this.__decorate || function(t, e, r, a) {
var s, o = arguments.length, n = o < 3 ? e : null === a ? a = Object.getOwnPropertyDescriptor(e, r) : a;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(t, e, r, a); else for (var h = t.length - 1; h >= 0; h--) (s = t[h]) && (n = (o < 3 ? s(n) : o > 3 ? s(e, r, n) : s(e, r)) || n);
return o > 3 && n && Object.defineProperty(e, r, n), n;
}, n = this && this.__read || function(t, e) {
var r = "function" == typeof Symbol && t[Symbol.iterator];
if (!r) return t;
var a, s, o = r.call(t), n = [];
try {
for (;(void 0 === e || e-- > 0) && !(a = o.next()).done; ) n.push(a.value);
} catch (t) {
s = {
error: t
};
} finally {
try {
a && !a.done && (r = o.return) && r.call(o);
} finally {
if (s) throw s.error;
}
}
return n;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.Travel_chapter_pushTrait = void 0;
var h = function(t) {
s(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._dataPush = null;
return e;
}
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ChapterGameOver_GameEnd_Proxy",
methodName: "onGameOver"
} ];
};
e.prototype.onCreate = function() {
var t = this;
this._dataPush = storage.getItem("Travel_chapter_pushTrait_dataPush", {
travelId: 0,
last_push_chapter: 0,
last_cancel_chapter: 0
});
hs.reactive({
target: this,
propertyName: "_dataPush",
pos: "Travel_chapter_pushTrait_dataPush_reactive",
callback: function() {
storage.setItem("Travel_chapter_pushTrait_dataPush", t._dataPush);
}
});
};
e.prototype.onActive = function(t) {
hs.tp.isChapterGameOver_GameEnd_ProxyOnGameOver(t) && t.args[1] && this.checkCanPush();
};
e.prototype.checkCanPush = function() {
if (hs.NativeSudokuIPAUtils.checkAppFuncSupport(hs.E_APP_FUNC_VERSION.NOTICE_PUSH_VERSION)) {
var t = hs.chapterGameInfo.chapterNum + 1, e = this.props.travelList.find(function(e) {
return e >= t;
});
if (!isNaN(e)) {
var r = this._dataPush.last_push_chapter;
e == t + this.props.chapterLimit ? this.tryPush(e) : r > 0 && (r == t || 96 === r && 1 === t) && this.tryCancelPush(r);
}
}
};
e.prototype.tryPush = function(t) {
if (this._dataPush.last_push_chapter !== t || this._dataPush.travelId !== hs.chapterGameInfo.stage) {
this._dataPush.last_push_chapter = t;
this._dataPush.travelId = hs.chapterGameInfo.stage;
var e = this.getPushTimeMs(this.props.sendTime), r = {
opewaynum: this.props.opewaynum,
taskType: this.props.taskType,
sendTime: e
};
hs.NativeAppCenterInterface.noticeAppCommonSendPush(r);
this.dotPushEvent(t, !1);
}
};
e.prototype.tryCancelPush = function(t) {
if (this._dataPush.last_cancel_chapter !== t || this._dataPush.travelId !== hs.chapterGameInfo.stage) {
this._dataPush.last_cancel_chapter = t;
this._dataPush.travelId = hs.chapterGameInfo.stage;
hs.NativeAppCenterInterface.noticeAppCommonRemovePush();
this.dotPushEvent(t, !0);
}
};
e.prototype.getPushTimeMs = function(t) {
var e = n(t.split(":").map(Number), 3), r = e[0], a = e[1];
e[2];
(isNaN(r) || r > 24 || r < 0) && (r = 0);
(isNaN(a) || a > 60 || a < 0) && (a = 0);
var s = new Date();
s.setHours(r, a, 0, 0);
return Math.floor(s.getTime());
};
e.prototype.dotPushEvent = function(t, e) {
DS("usr_data_adventure_activekeynode_success", {
keynopushcfsend: e ? "1" : "0",
keynopushcftype: "" + t
});
};
o([ hs.watch() ], e.prototype, "_dataPush", void 0);
return o([ classId("Travel_chapter_pushTrait") ], e);
}(Trait);
r.Travel_chapter_pushTrait = h;
cc._RF.pop();
}, {} ]
}, {}, [ "Travel_chapter_pushTrait" ]);
//# sourceMappingURL=index.js.map
