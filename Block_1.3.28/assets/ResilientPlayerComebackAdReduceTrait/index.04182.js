window.__require = function t(e, i, r) {
function o(n, s) {
if (!i[n]) {
if (!e[n]) {
var l = n.split("/");
l = l[l.length - 1];
if (!e[l]) {
var u = "function" == typeof __require && __require;
if (!s && u) return u(l, !0);
if (a) return a(l, !0);
throw new Error("Cannot find module '" + n + "'");
}
n = l;
}
var c = i[n] = {
exports: {}
};
e[n][0].call(c.exports, function(t) {
return o(e[n][1][t] || t);
}, c, c.exports, t, e, i, r);
}
return i[n].exports;
}
for (var a = "function" == typeof __require && __require, n = 0; n < r.length; n++) o(r[n]);
return o;
}({
ResilientPlayerComebackAdReduceTrait: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "1d3a0NpCqNBhYF6VVkR3Uyy", "ResilientPlayerComebackAdReduceTrait");
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
var o, a = arguments.length, n = a < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, i) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(t, e, i, r); else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (n = (a < 3 ? o(n) : a > 3 ? o(e, i, n) : o(e, i)) || n);
return a > 3 && n && Object.defineProperty(e, i, n), n;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
i.ResilientPlayerComebackAdReduceTrait = void 0;
var n = function(t) {
o(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._isResilient = !1;
e._isRequestted = !1;
e._reduceCount = 0;
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
className: "AlgorithmProcessInfo",
methodName: "algorithmSuccess"
} ];
};
e.prototype.onActive = function(t) {
hs.tp.isLaunch_ProxyOnTraitConfigInitComplete(t) && this.init();
hs.tp.isAlgorithmProcessInfoAlgorithmSuccess(t) && this._recordAlgorithmData();
hs.tp.isClassAdvertisement_FullScreenProxyShieldPlayAdvertisement(t) && this._reduceAd(t);
};
e.prototype._loadStateFromStorage = function() {
var t = storage.getItem("ResilientPlayerComebackAdReduceTrait", this.data());
this.state.algorithmTime = t.algorithmTime || 0;
this.state.algorithmFlag = t.algorithmFlag || !1;
};
e.prototype._saveStateToStorage = function() {
var t = {
algorithmTime: this.state.algorithmTime,
algorithmFlag: this.state.algorithmFlag
};
storage.setItem("ResilientPlayerComebackAdReduceTrait", t);
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
if (this.state.algorithmTime && !1 === this.state.algorithmFlag) {
var i = null !== (e = null === (t = hs.gameInfo.entryTimeHistory) || void 0 === t ? void 0 : t.at(-2)) && void 0 !== e ? e : 0;
Date.now() - i > 108e5 ? this._reduceCount = 2 : hs.getDiffDays(Date.now(), i) >= 1 && (this._reduceCount = 2);
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
e.prototype._reduceAd = function(t) {
if (hs.advertisementGameInfo.interstitialAdState && hs.NativeAd.getReadyByAdType("inter") && !t.args[0] && this._reduceCount > 0) {
this._reduceCount--;
t.returnValue = !0;
t.returnState = !0;
}
};
e.prototype._requestDunGanPlayerModel = function(t, e) {
hs.http.requestAsync("https://hella-game-gateway-server.afafb.com/v1/maitong_duisi", t, {
type: hs.HttpType.POST
}).then(function(t) {
t && 1 === t.ds_uplift_label ? e(!0) : e(!1);
}).catch(function() {
e(!1);
});
};
return a([ classId("ResilientPlayerComebackAdReduceTrait") ], e);
}(Trait);
i.ResilientPlayerComebackAdReduceTrait = n;
cc._RF.pop();
}, {} ]
}, {}, [ "ResilientPlayerComebackAdReduceTrait" ]);
//# sourceMappingURL=index.js.map
