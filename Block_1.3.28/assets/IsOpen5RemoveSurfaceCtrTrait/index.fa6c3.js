window.__require = function t(e, r, o) {
function s(i, n) {
if (!r[i]) {
if (!e[i]) {
var l = i.split("/");
l = l[l.length - 1];
if (!e[l]) {
var u = "function" == typeof __require && __require;
if (!n && u) return u(l, !0);
if (a) return a(l, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = l;
}
var f = r[i] = {
exports: {}
};
e[i][0].call(f.exports, function(t) {
return s(e[i][1][t] || t);
}, f, f.exports, t, e, r, o);
}
return r[i].exports;
}
for (var a = "function" == typeof __require && __require, i = 0; i < o.length; i++) s(o[i]);
return s;
}({
IsOpen5RemoveSurfaceCtrTrait: [ function(t, e, r) {
"use strict";
cc._RF.push(e, "8949dgT8z1GUpc12o+bqnFX", "IsOpen5RemoveSurfaceCtrTrait");
var o, s = this && this.__extends || (o = function(t, e) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
})(t, e);
}, function(t, e) {
o(t, e);
function r() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (r.prototype = e.prototype, new r());
}), a = this && this.__decorate || function(t, e, r, o) {
var s, a = arguments.length, i = a < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(t, e, r, o); else for (var n = t.length - 1; n >= 0; n--) (s = t[n]) && (i = (a < 3 ? s(i) : a > 3 ? s(e, r, i) : s(e, r)) || i);
return a > 3 && i && Object.defineProperty(e, r, i), i;
}, i = this && this.__read || function(t, e) {
var r = "function" == typeof Symbol && t[Symbol.iterator];
if (!r) return t;
var o, s, a = r.call(t), i = [];
try {
for (;(void 0 === e || e-- > 0) && !(o = a.next()).done; ) i.push(o.value);
} catch (t) {
s = {
error: t
};
} finally {
try {
o && !o.done && (r = a.return) && r.call(a);
} finally {
if (s) throw s.error;
}
}
return i;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.IsOpen5RemoveSurfaceCtrTrait = void 0;
var n = function(t) {
s(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.KEY_REPLAY_DISABLED = "classFiveRemoveReplayDisabledDate";
e.KEY_POOL_ORDER = "classFiveRemovePoolOrder";
e.KEY_POOL_IDX = "classFiveRemovePoolIdx";
e.KEY_POOL_isUse = "classFiveRemovePoolIsUse";
e.isLoadData = !1;
e.fiveRemoveInitBoardConfig = null;
return e;
}
e.prototype.data = function() {
return {
useType: storage.getItem(this.KEY_POOL_isUse, 0)
};
};
e.prototype.onActive = function(t) {
var e;
hs.tp.isClassDefaultBoard_ProxyOnProduceClassDefaultBoard(t) && this.loadData();
if (hs.tp.isClassDefaultBoard_ProxyOnClearData(t)) {
this.state.useType = 0;
storage.setItem(this.KEY_POOL_isUse, this.state.useType);
}
if (hs.tp.isClassDefaultBoard_ProxyOnGameReplay(t)) {
var r = this.todayKey;
storage.setItem(this.KEY_REPLAY_DISABLED, r);
}
hs.tp.isClassDefaultBoard_ProxyProduceDefaultBoardTurnAround(t) && 1 === this.state.useType && (t.returnState = !0);
if (hs.tp.isClassDefaultBoard_ProxyProduceDefaultBoard(t)) {
if (!this.isLoadData) {
this.state.useType = 0;
storage.setItem(this.KEY_POOL_isUse, this.state.useType);
return;
}
this.state.useType = 0;
if (!this.isTodayDisabledByReplay()) {
var o = null !== (e = this.props.rate) && void 0 !== e ? e : .2;
o = this.updateRandomValue(o);
if (Math.random() <= o) {
var s = this.nextFiveRemove;
if (s) {
t.args[0] = s.matrix;
this.state.useType = 1;
t.returnState = !0;
}
} else this.state.useType = 0;
}
storage.setItem(this.KEY_POOL_isUse, this.state.useType);
}
if (hs.tp.isClassAlgorithmStrategy_Priority_ProxyOnAlgorithmStrategyPriority(t) && 1 === this.state.useType && 1 === hs.classGameInfo.roundNum) {
hs.algorithmStrategyInfo.setAlgorithmPriorityList([ hs.OFFER_TYPE.FIVE_REMOVE_SURFACE ]);
this.updateHijackResult();
t.returnState = !0;
}
};
e.prototype.updateHijackResult = function() {
var t;
if (hs.gameInfo.gameMode === hs.GameMode.Class && 1 === this.state.useType && 1 === hs.classGameInfo.roundNum) {
var e = storage.getItem(this.KEY_POOL_IDX, 0), r = storage.getItem(this.KEY_POOL_ORDER, [])[e - 1], o = null !== (t = this.fiveRemoveInitBoardConfig[r]) && void 0 !== t ? t : null;
o && o.block_list.length > 0 && hs.algorithmHijackInfo.setHijackAlgoResult(hs.OFFER_TYPE.FIVE_REMOVE_SURFACE, {
mainKey: this.traitName,
hijackResult: {
algoType: hs.OFFER_ALGORITHM_SDK_TYPE[hs.OFFER_TYPE.FIVE_REMOVE_SURFACE],
algoList: [ hs.OFFER_ALGORITHM_SDK_TYPE[hs.OFFER_TYPE.FIVE_REMOVE_SURFACE] ],
blockGroup: [],
blockIds: o.block_list,
blockPoses: [],
blockRecords: [],
timeout: !1,
blockNames: Array(3).fill(hs.OFFER_TYPE_STRINGS[hs.OFFER_TYPE.FIVE_REMOVE_SURFACE]),
errorCode: 0
}
});
storage.setItem(this.KEY_POOL_isUse, this.state.useType);
}
};
e.prototype.isTodayDisabledByReplay = function() {
var t = this.todayKey;
return storage.getItem(this.KEY_REPLAY_DISABLED, "") === t;
};
e.prototype.loadData = function() {
var t = this;
this.isLoadData || hs.ResLoader.asyncLoadByBundle("IsOpen5RemoveSurfaceCtrTrait", "config/FiveRemoveInitBoardConfig", cc.JsonAsset).then(function(e) {
var r = e.json, o = Array.isArray(r) ? r : r && (r.list || r.data) || [], s = function(t) {
return "string" == typeof t ? JSON.parse(t) : t;
};
t.fiveRemoveInitBoardConfig = (o || []).map(function(t, e) {
return {
matrix: s(t.matrix),
block_list: s(t.block_list),
idx: e
};
}).filter(function(t) {
return Array.isArray(t.matrix) && t.matrix.length > 0 && Array.isArray(t.block_list) && 3 === t.block_list.length;
});
t.isLoadData = t.fiveRemoveInitBoardConfig.length > 0;
}).catch(function() {});
};
Object.defineProperty(e.prototype, "todayKey", {
get: function() {
var t = new Date();
return t.getFullYear() + "-" + (t.getMonth() + 1).toString().padStart(2, "0") + "-" + t.getDate().toString().padStart(2, "0");
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "nextFiveRemove", {
get: function() {
var t = this.fiveRemoveInitBoardConfig.length;
if (t <= 0) return null;
var e = storage.getItem(this.KEY_POOL_ORDER, []), r = storage.getItem(this.KEY_POOL_IDX, 0);
if (!Array.isArray(e) || e.length !== t) {
e = this.shuffle(Array.from({
length: t
}, function(t, e) {
return e;
}));
storage.setItem(this.KEY_POOL_ORDER, e);
r = 0;
}
if (r >= e.length) {
e = this.shuffle(e);
storage.setItem(this.KEY_POOL_ORDER, e);
r = 0;
}
var o = e[r], s = this.fiveRemoveInitBoardConfig[o];
storage.setItem(this.KEY_POOL_IDX, r + 1);
return null != s ? s : null;
},
enumerable: !1,
configurable: !0
});
e.prototype.shuffle = function(t) {
for (var e, r = t.slice(), o = r.length - 1; o > 0; o--) {
var s = Math.floor(Math.random() * (o + 1));
e = i([ r[s], r[o] ], 2), r[o] = e[0], r[s] = e[1];
}
return r;
};
e.prototype.updateRandomValue = function(t) {
return t;
};
return a([ classId("IsOpen5RemoveSurfaceCtrTrait"), classMethodWatch() ], e);
}(Trait);
r.IsOpen5RemoveSurfaceCtrTrait = n;
cc._RF.pop();
}, {} ]
}, {}, [ "IsOpen5RemoveSurfaceCtrTrait" ]);
//# sourceMappingURL=index.js.map
