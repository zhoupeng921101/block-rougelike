window.__require = function t(e, r, a) {
function o(i, c) {
if (!r[i]) {
if (!e[i]) {
var l = i.split("/");
l = l[l.length - 1];
if (!e[l]) {
var u = "function" == typeof __require && __require;
if (!c && u) return u(l, !0);
if (n) return n(l, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = l;
}
var h = r[i] = {
exports: {}
};
e[i][0].call(h.exports, function(t) {
return o(e[i][1][t] || t);
}, h, h.exports, t, e, r, a);
}
return r[i].exports;
}
for (var n = "function" == typeof __require && __require, i = 0; i < a.length; i++) o(a[i]);
return o;
}({
ChangeCollectByLevelFailCountTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "a5a77KuLBFB4qs0xNnuoshO", "ChangeCollectByLevelFailCountTrait");
var a, o = this && this.__extends || (a = function(t, e) {
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
}), n = this && this.__decorate || function(t, e, r, a) {
var o, n = arguments.length, i = n < 3 ? e : null === a ? a = Object.getOwnPropertyDescriptor(e, r) : a;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(t, e, r, a); else for (var c = t.length - 1; c >= 0; c--) (o = t[c]) && (i = (n < 3 ? o(i) : n > 3 ? o(e, r, i) : o(e, r)) || i);
return n > 3 && i && Object.defineProperty(e, r, i), i;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ChangeCollectByLevelFailCountTrait = void 0;
var i = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._cacheData = {
chapterNum: 0,
failCount: 0
};
e._numArray = [ 0, 0, 0 ];
return e;
}
e.prototype.onCreate = function() {
this._cacheData = hs.storage.getItem("ChangeCollectByLevelFailCountTraitKey", this._cacheData);
};
e.prototype.onActive = function(t) {
if (hs.tp.isMultiElementCollectTraitGetElementArrayByWeight(t)) {
this._numArray = [ 0, 0, 0 ];
for (var e = 0, r = 0; r < 3; r++) {
this._numArray[r] = Math.floor(Math.random() * this.maxGenNum) + 1;
e += this._numArray[r];
}
t.args[1] = e;
}
if (hs.tp.isMultiElementCollectTraitGetElementMapOnBlock(t)) {
var a = t.args[0], o = [ [], [], [] ], n = 0;
for (r = 0; r < 3; r++) {
o[r] = a.slice(n, n + this._numArray[r]);
n += this._numArray[r];
}
t.returnValue = o;
t.replace = !0;
t.returnState = !0;
}
if (hs.tp.isChapterCollectionProducer_ProxyOnGameEnd(t) && !hs.gameOverGameInfo.isChapterWin) {
this._cacheData.failCount++;
this.saveLocalData();
}
if (hs.tp.isChapterCollectionProducer_ProxyOnGameStart(t) && t.args && t.args[0] && t.args[0].data && t.args[0].data.newGame && this._cacheData.chapterNum != hs.chapterGameInfo.chapterNum) {
this._cacheData.chapterNum = hs.chapterGameInfo.chapterNum;
this._cacheData.failCount = 0;
this.saveLocalData();
}
};
Object.defineProperty(e.prototype, "maxGenNum", {
get: function() {
var t = this.countArray, e = Math.max(0, Math.min(t.length - 1, this._cacheData.failCount));
return this.countNormal + t[e];
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "countNormal", {
get: function() {
return hs.traitConfigSafePropsInfo.getSafePropValueByKey("ChangeCollectByLevelFailCountTrait", "countNormal", this.props, 2);
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "countArray", {
get: function() {
return hs.traitConfigSafePropsInfo.getSafePropValueByKey("ChangeCollectByLevelFailCountTrait", "countArray", this.props, [ 0, 1, 2, 3, 4, 5 ]);
},
enumerable: !1,
configurable: !0
});
e.prototype.saveLocalData = function() {
hs.storage.setItem("ChangeCollectByLevelFailCountTraitKey", this._cacheData);
};
return n([ classId("ChangeCollectByLevelFailCountTrait") ], e);
}(Trait);
r.ChangeCollectByLevelFailCountTrait = i;
cc._RF.pop();
}, {} ]
}, {}, [ "ChangeCollectByLevelFailCountTrait" ]);
//# sourceMappingURL=index.js.map
