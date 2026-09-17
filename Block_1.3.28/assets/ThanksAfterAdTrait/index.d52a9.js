window.__require = function e(t, r, n) {
function a(s, i) {
if (!r[s]) {
if (!t[s]) {
var c = s.split("/");
c = c[c.length - 1];
if (!t[c]) {
var l = "function" == typeof __require && __require;
if (!i && l) return l(c, !0);
if (o) return o(c, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = c;
}
var h = r[s] = {
exports: {}
};
t[s][0].call(h.exports, function(e) {
return a(t[s][1][e] || e);
}, h, h.exports, e, t, r, n);
}
return r[s].exports;
}
for (var o = "function" == typeof __require && __require, s = 0; s < n.length; s++) a(n[s]);
return a;
}({
ThanksAfterAdTraitConst: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "3f8behw43JEYJagixAFmKfH", "ThanksAfterAdTraitConst");
Object.defineProperty(r, "__esModule", {
value: !0
});
r.STORAGE_KEY = r.ANIM_PREFABS = void 0;
r.ANIM_PREFABS = [ {
name: "ThanksAfterAd1",
url: "prefabs/ThanksAfterAd1",
bundleName: "ThanksAfterAdTrait"
}, {
name: "ThanksAfterAd3",
url: "prefabs/ThanksAfterAd3",
bundleName: "ThanksAfterAdTrait"
} ];
r.STORAGE_KEY = "ThanksAfterAdTraitData";
cc._RF.pop();
}, {} ],
ThanksAfterAdTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "280a6nqBxVKNYaS3eFZFdLu", "ThanksAfterAdTrait");
var n, a = this && this.__extends || (n = function(e, t) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
n(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), o = this && this.__assign || function() {
return (o = Object.assign || function(e) {
for (var t, r = 1, n = arguments.length; r < n; r++) {
t = arguments[r];
for (var a in t) Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
}
return e;
}).apply(this, arguments);
}, s = this && this.__decorate || function(e, t, r, n) {
var a, o = arguments.length, s = o < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, r) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, r, n); else for (var i = e.length - 1; i >= 0; i--) (a = e[i]) && (s = (o < 3 ? a(s) : o > 3 ? a(t, r, s) : a(t, r)) || s);
return o > 3 && s && Object.defineProperty(t, r, s), s;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.ThanksAfterAdTrait = void 0;
var i = e("./ThanksAfterAdTraitConst"), c = function(e) {
a(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.resLoaded = [ !1, !1 ];
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassAdvertisement_FullScreenProxy",
methodName: "onGameStart"
}, {
className: "ChapterAdvertisement_FullScreenProxy",
methodName: "onGameStart"
}, {
className: "ChapterWin_Proxy",
methodName: "chapterWinPanelShowFinished"
}, {
className: "ChapterFail_Proxy",
methodName: "chapterOverPanelShowFinished"
}, {
className: "ClassAdvertisement_FullScreenProxy",
methodName: "onClassGameOverShowFinish"
} ];
};
t.prototype.onActive = function(e) {
if (hs.tp.isClassAdvertisement_FullScreenProxyOnGameStart(e) || hs.tp.isChapterAdvertisement_FullScreenProxyOnGameStart(e)) {
this.preloadResources();
this.hideAnim();
}
(hs.tp.isChapterWin_ProxyChapterWinPanelShowFinished(e) || hs.tp.isChapterFail_ProxyChapterOverPanelShowFinished(e) || hs.tp.isClassAdvertisement_FullScreenProxyOnClassGameOverShowFinish(e)) && this.hideAnim();
if (hs.tp.isClassAdvertisement_FullScreenProxyAdvertisementCallBack(e)) {
var t = e.args[1];
this.fullScreenCallback(e, t);
}
if (hs.tp.isChapterAdvertisement_FullScreenProxyAdvertisementCallBack(e)) {
t = e.args[0];
this.fullScreenCallback(e, t);
}
};
Object.defineProperty(t.prototype, "localData", {
get: function() {
var e = hs.storage.getItem(i.STORAGE_KEY, {
loopIndex: -1,
date: 0,
count: 0
}), t = e.loopIndex, r = e.date, n = e.count, a = Date.now();
if (!hs.isSameDate(r, a)) {
n = 0;
r = a;
}
return {
loopIndex: t,
date: r,
count: n
};
},
enumerable: !1,
configurable: !0
});
t.prototype.setLoopIndex = function(e) {
hs.storage.setItem(i.STORAGE_KEY, o(o({}, this.localData), {
loopIndex: e
}));
};
t.prototype.setCount = function(e) {
hs.storage.setItem(i.STORAGE_KEY, o(o({}, this.localData), {
count: e
}));
};
t.prototype.fullScreenCallback = function(e, t) {
var r;
if (t == hs.AdvertiseCallBackState.Advertise_Success) {
var n = this.localData, a = n.loopIndex, o = (n.date, n.count);
o < (null !== (r = this.props.time) && void 0 !== r ? r : 1) && this.playThanksAnimation(e, a, o);
}
};
t.prototype.playThanksAnimation = function(e, t, r) {
t = (t + 1) % i.ANIM_PREFABS.length;
this.setLoopIndex(t);
var n = this.resLoaded.findIndex(function(e, r) {
return r >= t && e;
});
-1 === n && (n = this.resLoaded.findIndex(function(e, r) {
return r < t && e;
}));
if (-1 !== n) {
e.replace = !0;
this.setLoopIndex(n);
this.setCount(r + 1);
var a = i.ANIM_PREFABS[n];
hs.UI.show(a, hs.tipLayer).then(function(t) {
var r = t.getComponentInChildren(dragonBones.ArmatureDisplay);
r.once(dragonBones.EventObject.COMPLETE, function() {
e.originalCaller();
});
r.playAnimation("in", 1);
});
}
};
t.prototype.preloadResources = function() {
var e = this;
this.resLoaded.every(function(e) {
return e;
}) || i.ANIM_PREFABS.forEach(function(t, r) {
hs.ResLoader.asyncLoadByBundle(t.bundleName, t.url, cc.Prefab).then(function(t) {
t && (e.resLoaded[r] = !0);
}).catch(function() {});
});
};
t.prototype.hideAnim = function() {
i.ANIM_PREFABS.forEach(function(e) {
hs.UI.hideUI(e);
});
};
return s([ classId("ThanksAfterAdTrait") ], t);
}(Trait);
r.ThanksAfterAdTrait = c;
cc._RF.pop();
}, {
"./ThanksAfterAdTraitConst": "ThanksAfterAdTraitConst"
} ]
}, {}, [ "ThanksAfterAdTrait", "ThanksAfterAdTraitConst" ]);
//# sourceMappingURL=index.js.map
