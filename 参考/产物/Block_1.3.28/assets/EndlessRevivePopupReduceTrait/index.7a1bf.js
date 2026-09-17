window.__require = function e(s, r, t) {
function p(i, n) {
if (!r[i]) {
if (!s[i]) {
var u = i.split("/");
u = u[u.length - 1];
if (!s[u]) {
var a = "function" == typeof __require && __require;
if (!n && a) return a(u, !0);
if (o) return o(u, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = u;
}
var c = r[i] = {
exports: {}
};
s[i][0].call(c.exports, function(e) {
return p(s[i][1][e] || e);
}, c, c.exports, e, s, r, t);
}
return r[i].exports;
}
for (var o = "function" == typeof __require && __require, i = 0; i < t.length; i++) p(t[i]);
return p;
}({
EndlessRevivePopupReduceTrait: [ function(e, s, r) {
"use strict";
cc._RF.push(s, "9b81batO/JH7K8rPGE4VOuJ", "EndlessRevivePopupReduceTrait");
var t, p = this && this.__extends || (t = function(e, s) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, s) {
e.__proto__ = s;
} || function(e, s) {
for (var r in s) Object.prototype.hasOwnProperty.call(s, r) && (e[r] = s[r]);
})(e, s);
}, function(e, s) {
t(e, s);
function r() {
this.constructor = e;
}
e.prototype = null === s ? Object.create(s) : (r.prototype = s.prototype, new r());
}), o = this && this.__decorate || function(e, s, r, t) {
var p, o = arguments.length, i = o < 3 ? s : null === t ? t = Object.getOwnPropertyDescriptor(s, r) : t;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(e, s, r, t); else for (var n = e.length - 1; n >= 0; n--) (p = e[n]) && (i = (o < 3 ? p(i) : o > 3 ? p(s, r, i) : p(s, r)) || i);
return o > 3 && i && Object.defineProperty(s, r, i), i;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.EndlessRevivePopupReduceTrait = void 0;
var i = "332111001_revivePopupReduce", n = {
suppressScore: 0,
wasLastGameSuppressed: !1
}, u = function(e) {
p(s, e);
function s() {
var s = null !== e && e.apply(this, arguments) || this;
s.TAG_TRAIT_NAME = "[EndlessRevivePopupReduceTrait]";
s._isCurrentGameSuppressed = !1;
s._currentSuppressScore = 0;
return s;
}
s.prototype.onActive = function(e) {
hs.tp.isClassRevive_ProxyOnGameStart(e) && this.handleGameStart(e);
hs.tp.isClassRevive_ProxyChangeLastReviveResult(e) && this.handleReviveCheck(e);
hs.tp.isClassRevive_ProxyOnClick_close(e) && this.handleReviveDecline();
hs.tp.isClassRevive_ProxyOnRevive_Success(e) && this.handleReviveSuccess();
};
s.prototype.handleGameStart = function(e) {
var s, r = e.args[0], t = !!(null === (s = null == r ? void 0 : r.data) || void 0 === s ? void 0 : s.newGame), p = hs.storage.getItem(i, n);
t ? this.handleNewGame(p) : this.handleResumeGame(p);
};
s.prototype.handleNewGame = function(e) {
if (e.wasLastGameSuppressed) {
this._isCurrentGameSuppressed = !1;
this._currentSuppressScore = 0;
hs.storage.setItem(i, {
suppressScore: 0,
wasLastGameSuppressed: !1
});
} else if (e.suppressScore > 0) {
this._isCurrentGameSuppressed = !0;
this._currentSuppressScore = e.suppressScore;
hs.storage.setItem(i, {
suppressScore: e.suppressScore,
wasLastGameSuppressed: !0
});
} else {
this._isCurrentGameSuppressed = !1;
this._currentSuppressScore = 0;
}
};
s.prototype.handleResumeGame = function(e) {
if (e.wasLastGameSuppressed) {
this._isCurrentGameSuppressed = !0;
this._currentSuppressScore = e.suppressScore;
} else {
this._isCurrentGameSuppressed = !1;
this._currentSuppressScore = 0;
}
};
s.prototype.handleReviveCheck = function(e) {
this._isCurrentGameSuppressed && hs.classScoreInfo.score < this._currentSuppressScore && (e.args[0] = !1);
};
s.prototype.handleReviveDecline = function() {
if (this._isCurrentGameSuppressed) ; else {
var e = hs.classScoreInfo.score;
hs.storage.setItem(i, {
suppressScore: e,
wasLastGameSuppressed: !1
});
}
};
s.prototype.handleReviveSuccess = function() {
this._isCurrentGameSuppressed || hs.storage.setItem(i, {
suppressScore: 0,
wasLastGameSuppressed: !1
});
};
return o([ classId("EndlessRevivePopupReduceTrait") ], s);
}(Trait);
r.EndlessRevivePopupReduceTrait = u;
cc._RF.pop();
}, {} ]
}, {}, [ "EndlessRevivePopupReduceTrait" ]);
//# sourceMappingURL=index.js.map
