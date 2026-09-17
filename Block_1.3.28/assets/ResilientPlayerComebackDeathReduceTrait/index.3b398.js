window.__require = function t(e, i, r) {
function o(s, n) {
if (!i[s]) {
if (!e[s]) {
var l = s.split("/");
l = l[l.length - 1];
if (!e[l]) {
var h = "function" == typeof __require && __require;
if (!n && h) return h(l, !0);
if (a) return a(l, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = l;
}
var c = i[s] = {
exports: {}
};
e[s][0].call(c.exports, function(t) {
return o(e[s][1][t] || t);
}, c, c.exports, t, e, i, r);
}
return i[s].exports;
}
for (var a = "function" == typeof __require && __require, s = 0; s < r.length; s++) o(r[s]);
return o;
}({
ResilientPlayerComebackDeathReduceTrait: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "450e69SfU5AZoRmFsbMP6B1", "ResilientPlayerComebackDeathReduceTrait");
var r, o = this && this.__extends || (r = function(t, e) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
})(t, e);
}, function(t, e) {
r(t, e);
function i() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (i.prototype = e.prototype, new i());
}), a = this && this.__decorate || function(t, e, i, r) {
var o, a = arguments.length, s = a < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, i) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, i, r); else for (var n = t.length - 1; n >= 0; n--) (o = t[n]) && (s = (a < 3 ? o(s) : a > 3 ? o(e, i, s) : o(e, i)) || s);
return a > 3 && s && Object.defineProperty(e, i, s), s;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
i.ResilientPlayerComebackDeathReduceTrait = void 0;
var s = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._isResilient = !1;
e._isRequestted = !1;
e._reduceAlgorithm = !1;
e._isFirstReplace = !1;
return e;
}
e.prototype.data = function() {
return {
algorithmTime: 0,
algorithmFlag: !1
};
};
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "Launch_Proxy",
methodName: "onTraitConfigInitComplete"
}, {
className: "ClassGame_Proxy",
methodName: "onClassGameStart"
}, {
className: "AlgorithmProcessInfo",
methodName: "algorithmSuccess"
} ];
};
e.prototype.onActive = function(t) {
hs.tp.isLaunch_ProxyOnTraitConfigInitComplete(t) && this.init();
hs.tp.isClassGame_ProxyOnClassGameStart(t) && (this._isFirstReplace = !1);
hs.tp.isAlgorithmProcessInfoAlgorithmSuccess(t) && this._recordAlgorithmData();
hs.tp.isClassAlgorithmProcessInfoBottomOffer(t) && this._replaceDeathAlgorithm(t);
};
e.prototype._loadStateFromStorage = function() {
var t = storage.getItem("ResilientPlayerComebackDeathReduceTrait", this.data());
this.state.algorithmTime = t.algorithmTime || 0;
this.state.algorithmFlag = t.algorithmFlag || !1;
};
e.prototype._saveStateToStorage = function() {
var t = {
algorithmTime: this.state.algorithmTime,
algorithmFlag: this.state.algorithmFlag
};
storage.setItem("ResilientPlayerComebackDeathReduceTrait", t);
};
e.prototype.requestData = function(t) {
var e = this;
if (this._isRequestted) t(); else {
var i = {
uid: hs.traitServerRequestInfo.uid,
os: "android"
};
this._requestDunGanPlayerModel(i, function(i) {
e._isResilient = i;
e._isRequestted = !0;
t();
});
}
};
e.prototype.init = function() {
this._loadStateFromStorage();
this.requestData(this._onResilientData.bind(this));
};
e.prototype._onResilientData = function() {
var t, e;
if (this.state.algorithmTime && 0 == this.state.algorithmFlag) {
var i = null !== (e = null === (t = hs.gameInfo.entryTimeHistory) || void 0 === t ? void 0 : t.at(-2)) && void 0 !== e ? e : 0;
if (0 === i) return;
if (hs.gameInfo.entryTime - i > 108e5) this._reduceAlgorithm = !0; else if (hs.getDiffDays(hs.gameInfo.entryTime, i) >= 1) {
this._reduceAlgorithm = !0;
this._isFirstReplace = !1;
}
this.state.algorithmTime = 0;
this._saveStateToStorage();
}
};
e.prototype._recordAlgorithmData = function() {
var t = this;
if (!this._isResilient && hs.gameInfo.gameMode === hs.GameMode.Class && hs.algorithmName.algoActualId === hs.OFFER_TYPE.ZHI_SI_TI) {
this.state.algorithmTime = Date.now();
this.state.algorithmFlag = !1;
this._saveStateToStorage();
cc.Tween.stopAllByTarget(this);
cc.tween(this).delay(30).call(function() {
clearTimeout(t._timeoutId);
t._timeoutId = null;
t.state.algorithmFlag = !0;
t._saveStateToStorage();
}).start();
}
};
e.prototype._replaceDeathAlgorithm = function(t) {
if (hs.algorithmName.algoActualId === hs.OFFER_TYPE.ZHI_SI_TI) {
if (!this._reduceAlgorithm || this._isFirstReplace) return;
t.returnState = !0;
hs.scoreInfo.score > .4 * hs.scoreInfo.highScore ? t.args[0] = [ hs.OFFER_TYPE.SUI_JI_WU_SI ] : t.args[0] = [ hs.OFFER_TYPE.TIAN_KONG_XIAO_CHU ];
this._isFirstReplace = !0;
}
};
e.prototype._requestDunGanPlayerModel = function(t, e) {
hs.http.requestAsync("https://hella-game-gateway-server.afafb.com/v1/maitong_duisi", t, {
type: hs.HttpType.POST
}).then(function(t) {
t && 1 == t.ds_uplift_label ? e(!0) : e(!1);
}).catch(function() {
e(!1);
});
};
a([ hs.Algorithm() ], e.prototype, "onActive", null);
return a([ classId("ResilientPlayerComebackDeathReduceTrait") ], e);
}(Trait);
i.ResilientPlayerComebackDeathReduceTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "ResilientPlayerComebackDeathReduceTrait" ]);
//# sourceMappingURL=index.js.map
