window.__require = function e(t, s, a) {
function r(n, h) {
if (!s[n]) {
if (!t[n]) {
var u = n.split("/");
u = u[u.length - 1];
if (!t[u]) {
var o = "function" == typeof __require && __require;
if (!h && o) return o(u, !0);
if (i) return i(u, !0);
throw new Error("Cannot find module '" + n + "'");
}
n = u;
}
var p = s[n] = {
exports: {}
};
t[n][0].call(p.exports, function(e) {
return r(t[n][1][e] || e);
}, p, p.exports, e, t, s, a);
}
return s[n].exports;
}
for (var i = "function" == typeof __require && __require, n = 0; n < a.length; n++) r(a[n]);
return r;
}({
AchievementPushMixTrait: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "c1f7c/0mzxMP6Wi9uhoxuqt", "AchievementPushMixTrait");
var a, r, i = this && this.__extends || (a = function(e, t) {
return (a = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var s in t) Object.prototype.hasOwnProperty.call(t, s) && (e[s] = t[s]);
})(e, t);
}, function(e, t) {
a(e, t);
function s() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (s.prototype = t.prototype, new s());
}), n = this && this.__decorate || function(e, t, s, a) {
var r, i = arguments.length, n = i < 3 ? t : null === a ? a = Object.getOwnPropertyDescriptor(t, s) : a;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(e, t, s, a); else for (var h = e.length - 1; h >= 0; h--) (r = e[h]) && (n = (i < 3 ? r(n) : i > 3 ? r(t, s, n) : r(t, s)) || n);
return i > 3 && n && Object.defineProperty(t, s, n), n;
}, h = this && this.__values || function(e) {
var t = "function" == typeof Symbol && Symbol.iterator, s = t && e[t], a = 0;
if (s) return s.call(e);
if (e && "number" == typeof e.length) return {
next: function() {
e && a >= e.length && (e = void 0);
return {
value: e && e[a++],
done: !e
};
}
};
throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, u = this && this.__read || function(e, t) {
var s = "function" == typeof Symbol && e[Symbol.iterator];
if (!s) return e;
var a, r, i = s.call(e), n = [];
try {
for (;(void 0 === t || t-- > 0) && !(a = i.next()).done; ) n.push(a.value);
} catch (e) {
r = {
error: e
};
} finally {
try {
a && !a.done && (s = i.return) && s.call(i);
} finally {
if (r) throw r.error;
}
}
return n;
};
Object.defineProperty(s, "__esModule", {
value: !0
});
s.AchievementPushMixTrait = void 0;
(function(e) {
e[e.send = 0] = "send";
e[e.cancel = 1] = "cancel";
})(r || (r = {}));
var o = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._savePushData = null;
t._adventurePushSaveData = null;
t._achievementPushMixMapData = null;
t.isPriorityPush = !0;
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "HomePage_Proxy",
methodName: "showHomePage"
}, {
className: "ClassGame_Proxy",
methodName: "onClassGameShow"
}, {
className: "ChapterGame_Proxy",
methodName: "onChapterGameShow"
} ];
};
t.prototype.onCreate = function() {
this.registerGmMenu();
};
t.prototype.registerGmMenu = function() {};
t.prototype.onActive = function(e) {
var t;
if (hs.tp.isLaunchChangeLaunchScene(e)) {
var s = hs.NativeAppCenterInterface.noticeAppGetOpenAppOpeway(), a = null !== (t = null == s ? void 0 : s.click) && void 0 !== t ? t : "";
if (a) {
var r = this.changeLaunchScene(a);
if (r) {
e.args[0] = r;
e.returnState = !0;
}
}
this.checkCanTriggerPushByPushType();
}
if (hs.tp.isHomePage_ProxyShowHomePage(e) || hs.tp.isClassGame_ProxyOnClassGameShow(e) || hs.tp.isChapterGame_ProxyOnChapterGameShow(e)) {
-1 === this.savePushData.pushCurrentType || hs.isToday(this.savePushData.pushCurrentTriggerTimeMs) || (this.savePushData.isTodayPush = !1);
this.checkIsTravelThemeUpdate();
}
hs.tp.isAchievementInfoUpdataAchievementStatisticsData(e) && this.checkCanTriggerPushByPushType();
};
t.prototype.isOpen = function() {
return !0;
};
Object.defineProperty(t.prototype, "isAlways", {
get: function() {
return this.props.always;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "isRepush", {
get: function() {
return this.props.repush;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "isMixAdventureValue", {
get: function() {
var e;
return null !== (e = this.props.isMixAdventure) && void 0 !== e ? e : 0;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "adventurePushData", {
get: function() {
if (this.isMixAdventureValue > 0) {
var e = this.props.pushTypesArray.length > 0 ? this.props.pushTypesArray[0] : 0;
return hs.PushAndAchievementTypeMix.get(e);
}
return null;
},
enumerable: !1,
configurable: !0
});
t.prototype.isCanPushContinue = function(e, t, s) {
var a = this.getAchievementPushMixMapDataByPushType(e);
return a.pushMixEndTimeMs <= 0 || a.pushKeyIndexTarget !== t || !!this.isAlways && (a.pushMixEndTimeMs < s || this.isRepush && this.savePushData.pushCurrentType !== e);
};
t.prototype.changeLaunchScene = function(e) {
var t, s, a, r;
if (e == (null !== (r = null === (a = this.adventurePushData) || void 0 === a ? void 0 : a.scheme) && void 0 !== r ? r : "")) return "choice";
if (e) try {
for (var i = h(Object.entries(hs.PushScenesMix)), n = i.next(); !n.done; n = i.next()) {
var o = u(n.value, 2), p = o[0];
if (o[1].includes(e)) return p;
}
} catch (e) {
t = {
error: e
};
} finally {
try {
n && !n.done && (s = i.return) && s.call(i);
} finally {
if (t) throw t.error;
}
}
return null;
};
Object.defineProperty(t.prototype, "savePushData", {
get: function() {
if (this._savePushData) return this._savePushData;
this._savePushData = storage.getItem("achievementPushMixTrait_currentSaveData", {
pushCurrentType: -1,
pushCurrentEndTimeMs: 0,
isTodayPush: !1,
pushCurrentTriggerTimeMs: 0
});
return this._savePushData;
},
enumerable: !1,
configurable: !0
});
t.prototype.resetSavePushData = function(e, t) {
void 0 === e && (e = -1);
void 0 === t && (t = 0);
this._savePushData = {
pushCurrentType: e,
pushCurrentEndTimeMs: t,
isTodayPush: !1,
pushCurrentTriggerTimeMs: 0
};
if (-1 !== e) {
this._savePushData.isTodayPush = !0;
this._savePushData.pushCurrentTriggerTimeMs = Date.now();
}
storage.setItem("achievementPushMixTrait_currentSaveData", this._savePushData);
};
Object.defineProperty(t.prototype, "achievementPushMixMapData", {
get: function() {
if (this._achievementPushMixMapData) return this._achievementPushMixMapData;
this._achievementPushMixMapData = storage.getItem("achievementPushMixTrait_achievementMap", {});
return this._achievementPushMixMapData;
},
enumerable: !1,
configurable: !0
});
t.prototype.resetAchievementPushMixMapData = function(e) {
void 0 === e && (e = !1);
e && (this._achievementPushMixMapData = {});
storage.setItem("achievementPushMixTrait_achievementMap", this._achievementPushMixMapData);
};
t.prototype.getAchievementPushMixMapDataByPushType = function(e) {
var t = this.getSchemeByPushType(e);
this.achievementPushMixMapData[t] || (this.achievementPushMixMapData[t] = {
key: "",
pushKeyIndexTarget: "",
pushResult: 0,
pushMixEndTimeMs: 0
});
return this.achievementPushMixMapData[t];
};
t.prototype.checkCanTriggerPushByPushType = function() {
var e = this.props.pushTypesArray || [];
if (this.pushIsChanged) {
this.resetSavePushData();
this.resetAdventurePushSaveData();
this.resetAchievementPushMixMapData(!0);
}
if (this.isAdventurePushing) ; else {
var t = -1, s = this.savePushData;
-1 !== s.pushCurrentType && s.pushCurrentEndTimeMs > Date.now() && (t = s.pushCurrentType);
for (var a = [], r = [], i = 0; i < e.length; i++) {
(h = e[i]) && !isNaN(h) && this.checkCanTriggerPush(h, a, r);
if (this.isPriorityPush && h === t && -1 === r.indexOf(h)) break;
}
if (r.length > 0) {
var n = a.length > 0;
for (i = 0; i < r.length; i++) {
var h = r[i];
this.tryCancelPushTaskByPushType(h, n);
}
}
if (a.length > 0) {
var u = a[0];
this.tryPushTaskByPushType(u.pushType, u.pushKeyIndexTarget, u.pushResult);
}
}
};
t.prototype.tryPushTaskByPushType = function(e, t) {
var s = hs.PushAndAchievementTypeMix.get(e);
if (s) {
var a = s.scheme, i = s.cjpushcftype, n = s.key, h = s.strategy, u = this.getPushTimeMs("13:00");
hs.NativeAppCenterInterface.noticeAppCommonSendPush({
opewaynum: a,
taskType: null != h ? h : "",
sendTime: u
});
DS("usr_data_gamefinish_cjpushcf_success", {
cjpushcftype: i,
cjpushcfsend: r.send,
cj_push_strategy: a
});
var o = this.savePushData.pushCurrentType;
if (-1 !== o && o !== e) {
var p = this.getAchievementPushMixMapDataByPushType(o);
if (1 === p.pushResult) {
p.pushResult = 2;
p.pushMixEndTimeMs = 0;
this.resetAchievementPushMixMapData();
}
}
this.achievementPushMixMapData[a] = {
key: n,
pushKeyIndexTarget: t,
pushResult: 1,
pushMixEndTimeMs: this.pushEndTimeMs
};
this.resetAchievementPushMixMapData();
this.resetSavePushData(e, this.pushEndTimeMs);
}
};
t.prototype.tryCancelPushTaskByPushType = function(e, t) {
void 0 === t && (t = !1);
var s = this.getAchievementPushMixMapDataByPushType(e);
if (1 === s.pushResult) {
s.pushResult = 2;
s.pushMixEndTimeMs = 0;
this.resetAchievementPushMixMapData();
var a = hs.PushAndAchievementTypeMix.get(e);
if (a) {
if (!t) {
var i = a.scheme;
hs.NativeAppCenterInterface.noticeAppCommonRemovePush();
DS("usr_data_gamefinish_cjpushcf_success", {
cjpushcftype: a.cjpushcftype,
cjpushcfsend: r.cancel,
cj_push_strategy: i
});
}
this.savePushData.pushCurrentType === e && this.resetSavePushData();
}
}
};
t.prototype.getSchemeByPushType = function(e) {
return "cj" + (e < 10 ? "0" + e : e);
};
Object.defineProperty(t.prototype, "pushIsChanged", {
get: function() {
var e = this.props.pushTypesArray || [], t = this.props.pushTargePercentArray || [], s = this.props.isMixAdventure || 0, a = e.toString() + ",|" + t.toString() + ",|" + s, r = storage.getItem("achievementPushMixTrait_pushCombineKey", ""), i = "" === r || r === a;
i && "" !== r || storage.setItem("achievementPushMixTrait_pushCombineKey", a);
return !i;
},
enumerable: !1,
configurable: !0
});
t.prototype.getNearPercent = function(e) {
for (var t = this.props.pushTargePercentArray || [], s = 100, a = 0; a < t.length; a++) {
var r = t[a];
r && !isNaN(r) && e >= r && (s = r);
}
return s;
};
t.prototype.checkCanTriggerPush = function(e, t, s) {
try {
var a = e;
if (!hs.PushAndAchievementTypeMix.has(a)) return;
var r = hs.PushAndAchievementTypeMix.get(a);
if (r) {
if (9999 === r.AchievementTargetType) return;
var i = r.key, n = this.getAchievementPushMixMapDataByPushType(e), h = (hs.achievementInfo.achievementAwardData || []).find(function(e) {
return e.key === i;
});
if (!h) return;
var u = hs.achievementInfo.getAchievementInfoData(i);
if (!u) return;
if (h.curAchieveIndex >= u.achieve_list.length - 1) "" !== n.key && 2 !== n.pushResult && s.push(e); else {
var o = h.curAchieveIndex + 1, p = hs.achievementInfo.getQueryAchievementStatisticsData(r.AchievementTargetType, i), c = u.achieve_list[o];
if (!c) {
s.push(e);
return;
}
var v = this.isChapterPush(a) ? this.chapterNumStorage / 96 : p / c, y = this.getNearPercent(Math.floor(100 * v)) / 100, P = i + "_" + (h.curAchieveIndex + 1) + "_" + y;
y > 0 && v >= y ? this.isCanPushContinue(e, P, Date.now()) && t.push({
pushType: e,
pushKeyIndexTarget: P,
pushResult: 1
}) : s.push(e);
}
}
} catch (e) {}
};
t.prototype.isChapterPush = function(e) {
return 23 == e || 24 == e || 37 == e || 38 == e;
};
Object.defineProperty(t.prototype, "chapterNumStorage", {
get: function() {
return storage.getItem("chapterNum", 0);
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "chapterStageStorage", {
get: function() {
return storage.getItem("chapterPeriodsIndex", 1);
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "adventurePushSaveData", {
get: function() {
if (this._adventurePushSaveData) return this._adventurePushSaveData;
this._adventurePushSaveData = storage.getItem("achievementPushMixTrait_adventure", {
travelId: -1,
isPushed: !1,
isCancelPushed: !1,
pushAdventureEndTimeMs: 0
});
return this._adventurePushSaveData;
},
enumerable: !1,
configurable: !0
});
t.prototype.resetAdventurePushSaveData = function(e, t, s, a) {
void 0 === e && (e = -1);
void 0 === t && (t = !1);
void 0 === s && (s = !1);
void 0 === a && (a = 0);
this._adventurePushSaveData = {
travelId: e,
isPushed: t,
isCancelPushed: s,
pushAdventureEndTimeMs: a
};
storage.setItem("achievementPushMixTrait_adventure", this._adventurePushSaveData);
};
t.prototype.checkIsTravelThemeUpdate = function() {
if (!(this.isMixAdventureValue <= 0)) try {
var e = storage.getItem("chapterPeriodsBeginTime", 0), t = new Date().getTime(), s = e > 0 ? e + 864e5 * hs.homePageInfo.chapterPeriodDay - t : 864e5 * hs.homePageInfo.chapterPeriodDay, a = this.chapterStageStorage;
this.adventurePushSaveData.travelId < 0 && 1 === this.chapterStageStorage && hs.launchInfo.openChapterModule() ? this.adventurePushTask(a + 1) : a > 0 && s <= 0 && this.adventurePushSaveData.travelId <= a ? this.adventurePushTask(a + 1) : s > 0 && this.adventurePushSaveData.isPushed && a == this.adventurePushSaveData.travelId && !this.adventurePushSaveData.isCancelPushed && this.adventureCancelPushTask(a);
} catch (e) {}
};
t.prototype.adventureCancelPushTask = function(e) {
hs.NativeAppCenterInterface.noticeAppCommonRemovePush();
DS("game_push_adventure_success", {
adventurepushsend: 0
});
this.resetAdventurePushSaveData(e, !0, !0, 0);
};
t.prototype.adventurePushTask = function(e) {
var t = this.adventurePushData;
if (t) {
var s = this.getPushTimeMs("13:00"), a = {
opewaynum: t.scheme,
taskType: t.strategy,
sendTime: s
};
hs.NativeAppCenterInterface.noticeAppCommonSendPush(a);
DS("game_push_adventure_success", {
adventurepushsend: 1
});
this.resetAdventurePushSaveData(e, !0, !1, this.pushEndTimeMs);
var r = this.savePushData.pushCurrentType;
if (-1 != r) {
var i = this.getAchievementPushMixMapDataByPushType(r);
1 === i.pushResult && i.pushMixEndTimeMs > Date.now() && this.tryCancelPushTaskByPushType(r, !0);
}
}
};
t.prototype.getPushTimeMs = function(e) {
var t = u(e.split(":").map(Number), 3), s = t[0], a = t[1];
t[2];
(isNaN(s) || s > 24 || s < 0) && (s = 0);
(isNaN(a) || a > 60 || a < 0) && (a = 0);
var r = new Date();
r.setHours(s, a, 0, 0);
return Math.floor(r.getTime());
};
Object.defineProperty(t.prototype, "isAdventurePushing", {
get: function() {
return this.adventurePushSaveData.isPushed && !this.adventurePushSaveData.isCancelPushed && this.adventurePushSaveData.pushAdventureEndTimeMs > Date.now();
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "pushEndTimeMs", {
get: function() {
return Date.now() + 2592e5;
},
enumerable: !1,
configurable: !0
});
return n([ classId("AchievementPushMixTrait") ], t);
}(Trait);
s.AchievementPushMixTrait = o;
cc._RF.pop();
}, {} ]
}, {}, [ "AchievementPushMixTrait" ]);
//# sourceMappingURL=index.js.map
