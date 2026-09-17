window.__require = function t(e, n, o) {
function i(s, c) {
if (!n[s]) {
if (!e[s]) {
var a = s.split("/");
a = a[a.length - 1];
if (!e[a]) {
var l = "function" == typeof __require && __require;
if (!c && l) return l(a, !0);
if (r) return r(a, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = a;
}
var u = n[s] = {
exports: {}
};
e[s][0].call(u.exports, function(t) {
return i(e[s][1][t] || t);
}, u, u.exports, t, e, n, o);
}
return n[s].exports;
}
for (var r = "function" == typeof __require && __require, s = 0; s < o.length; s++) i(o[s]);
return i;
}({
AddChapterUnlockProcessTraitConst: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "99b49Qllk1Hor/3vIja62xR", "AddChapterUnlockProcessTraitConst");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.AnimationConfig = n.PrefabConfig = n.AudioConfig = n.RED_POINT_SCALE = n.BUNDLE_NAME = void 0;
n.BUNDLE_NAME = "AddChapterUnlockProcessTrait";
n.RED_POINT_SCALE = 2;
n.AudioConfig = {
unlock_ingame: {
url: "audios/unlock_ingame",
type: hs.AudioType.EFFECT,
bundleName: n.BUNDLE_NAME
},
unlock_main: {
url: "audios/unlock_main",
type: hs.AudioType.EFFECT,
bundleName: n.BUNDLE_NAME
},
unlock_setting: {
url: "audios/unlock_setting",
type: hs.AudioType.EFFECT,
bundleName: n.BUNDLE_NAME
}
};
n.PrefabConfig = {
ChapterBtnUnlockAnim: {
name: "ChapterBtnUnlockAnim",
url: "prefabs/chapterBtnUnlockAnim",
bundleName: n.BUNDLE_NAME
},
SettingUnlockAnim: {
name: "SettingUnlockAnim",
url: "prefabs/settingUnlockAnim",
bundleName: n.BUNDLE_NAME
}
};
n.AnimationConfig = {
Reddot: {
url: "animations/ChapterBtnUnlockReddotAnim",
bundleName: n.BUNDLE_NAME
}
};
cc._RF.pop();
}, {} ],
AddChapterUnlockProcessTrait: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "e7fc1fU8PFJfag2iQvNDEry", "AddChapterUnlockProcessTrait");
var o, i = this && this.__extends || (o = function(t, e) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
})(t, e);
}, function(t, e) {
o(t, e);
function n() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
}), r = this && this.__decorate || function(t, e, n, o) {
var i, r = arguments.length, s = r < 3 ? e : null === o ? o = Object.getOwnPropertyDescriptor(e, n) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, n, o); else for (var c = t.length - 1; c >= 0; c--) (i = t[c]) && (s = (r < 3 ? i(s) : r > 3 ? i(e, n, s) : i(e, n)) || s);
return r > 3 && s && Object.defineProperty(e, n, s), s;
}, s = this && this.__awaiter || function(t, e, n, o) {
return new (n || (n = Promise))(function(i, r) {
function s(t) {
try {
a(o.next(t));
} catch (t) {
r(t);
}
}
function c(t) {
try {
a(o.throw(t));
} catch (t) {
r(t);
}
}
function a(t) {
t.done ? i(t.value) : (e = t.value, e instanceof n ? e : new n(function(t) {
t(e);
})).then(s, c);
var e;
}
a((o = o.apply(t, e || [])).next());
});
}, c = this && this.__generator || function(t, e) {
var n, o, i, r, s = {
label: 0,
sent: function() {
if (1 & i[0]) throw i[1];
return i[1];
},
trys: [],
ops: []
};
return r = {
next: c(0),
throw: c(1),
return: c(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function c(t) {
return function(e) {
return a([ t, e ]);
};
}
function a(r) {
if (n) throw new TypeError("Generator is already executing.");
for (;s; ) try {
if (n = 1, o && (i = 2 & r[0] ? o.return : r[0] ? o.throw || ((i = o.return) && i.call(o), 
0) : o.next) && !(i = i.call(o, r[1])).done) return i;
(o = 0, i) && (r = [ 2 & r[0], i.value ]);
switch (r[0]) {
case 0:
case 1:
i = r;
break;

case 4:
s.label++;
return {
value: r[1],
done: !1
};

case 5:
s.label++;
o = r[1];
r = [ 0 ];
continue;

case 7:
r = s.ops.pop();
s.trys.pop();
continue;

default:
if (!(i = s.trys, i = i.length > 0 && i[i.length - 1]) && (6 === r[0] || 2 === r[0])) {
s = 0;
continue;
}
if (3 === r[0] && (!i || r[1] > i[0] && r[1] < i[3])) {
s.label = r[1];
break;
}
if (6 === r[0] && s.label < i[1]) {
s.label = i[1];
i = r;
break;
}
if (i && s.label < i[2]) {
s.label = i[2];
s.ops.push(r);
break;
}
i[2] && s.ops.pop();
s.trys.pop();
continue;
}
r = e.call(t, s);
} catch (t) {
r = [ 6, t ];
o = 0;
} finally {
n = i = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.AddChapterUnlockProcessTrait = void 0;
var a = t("./AddChapterUnlockProcessTraitConst"), l = function(t) {
i(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.btnUnlock = !1;
e.isGameStart = !1;
e.clip = null;
e.shouldSetHomeBtnUnlockOnFirstTime = !0;
e._showFirstHomeGuide = !0;
return e;
}
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassTopInfo_Proxy",
methodName: "onGameStart"
}, {
className: "FirstHomeGuideComponent",
methodName: "render"
} ];
};
e.prototype.onCreate = function() {
this.preloadAssets();
};
e.prototype.onActive = function(t) {
hs.tp.isClassTopInfo_ProxyOnGameStart(t) && (this.isGameStart = !0);
hs.tp.isClassTopInfoRefreshRedPoint(t) && this.setUnlockOfClassTopInfo(t);
hs.tp.isSetupBtnItemOnEnable(t) && this.setUnlockOfSetupBtnItem(t);
hs.tp.isSetupBtnItemRefreshRedPointUI(t) && this.shouldSetHomeBtnUnlockOnFirstTime && this.setUnlockOfSetupBtnItem(t);
hs.tp.isHomePageSectionChapterBtnDefaultSetRedDot(t) && this.setUnlockOfHomePage(t);
hs.tp.isFirstHomeGuideComponentRender(t) && this.modifyShowFirstHomeGuideComp(t);
};
Object.defineProperty(e.prototype, "showFirstHomeGuide", {
get: function() {
return this._showFirstHomeGuide;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "isTrigger", {
get: function() {
return 1 === hs.launchInfo.isShowChapterRedPoint;
},
enumerable: !1,
configurable: !0
});
e.prototype.preloadAssets = function() {
var t = this;
this.preload(a.PrefabConfig.SettingUnlockAnim, cc.Prefab);
this.preload(a.PrefabConfig.ChapterBtnUnlockAnim, cc.Prefab);
this.preload(a.AudioConfig.unlock_ingame, cc.AudioClip);
this.preload(a.AudioConfig.unlock_main, cc.AudioClip);
this.preload(a.AudioConfig.unlock_setting, cc.AudioClip);
this.preload(a.AnimationConfig.Reddot, cc.AnimationClip).then(function(e) {
e && (t.clip = e);
});
};
e.prototype.preload = function(t, e) {
return hs.ResLoader.asyncLoadByBundle(t.bundleName, t.url, e).then(function(t) {
return t || null;
}).catch(function() {
return null;
});
};
e.prototype.setUnlockOfClassTopInfo = function(t) {
var e = this;
if (!this.btnUnlock && this.isTrigger) {
t.replace = !0;
var n = t.target;
n.setupRed && (n.setupRed.active = !1);
if (this.isGameStart) {
this.isGameStart = !1;
this.ensureSettingBtnUnlock(n).then(function() {
if (!e.btnUnlock && e.isTrigger && cc.isValid(e.settingBtnUnlock)) {
hs.audioInfo.play(a.AudioConfig.unlock_ingame);
e.playSettingUnlockAnim(e.settingBtnUnlock, n.state.setupRed);
}
});
}
} else if (this.settingBtnUnlock) {
this.settingBtnUnlock.removeFromParent();
this.settingBtnUnlock = null;
}
};
e.prototype.setUnlockOfSetupBtnItem = function(t) {
var e = this;
if (this.homeBtnUnlock) {
this.homeBtnUnlock.removeFromParent();
this.homeBtnUnlock.destroy();
this.homeBtnUnlock = null;
}
var n = t.target;
if (n.state.key === hs.enSetupKeys.home) {
this.shouldSetHomeBtnUnlockOnFirstTime = !1;
if (!this.btnUnlock && this.isTrigger) {
t.replace = !0;
n.redNode && (n.redNode.active = !1);
this.ensureHomeBtnUnlock().then(function() {
if (!e.btnUnlock && e.isTrigger && cc.isValid(e.homeBtnUnlock) && cc.isValid(n.node)) {
n.node.addChild(e.homeBtnUnlock);
e.homeBtnUnlock.setPosition(293, 55);
hs.audioInfo.play(a.AudioConfig.unlock_setting);
e.playSettingUnlockAnim(e.homeBtnUnlock, !!n.state.redPoint);
}
});
}
}
};
e.prototype.setUnlockOfHomePage = function(t) {
var e, n, o, i, r = this, s = t.target;
null === (e = s.redDot) || void 0 === e || e.setState({
show: s.state.redPoint
});
null === (o = null === (n = s.redDot) || void 0 === n ? void 0 : n.node) || void 0 === o || o.setScale(a.RED_POINT_SCALE);
if (!this.btnUnlock && this.isTrigger) {
t.replace = !0;
null === (i = s.redDot) || void 0 === i || i.setState({
show: !1
});
this.setShowFirstHomeGuide(!1);
this.btnUnlock = !0;
this.ensureChapterBtnUnlock().then(function() {
var t;
if (r.isTrigger && cc.isValid(r.chapterBtnUnlock) && cc.isValid(s)) {
hs.audioInfo.play(a.AudioConfig.unlock_main);
r.playHomeUnlockAnim(r.chapterBtnUnlock);
r.playRedPointAnim(null === (t = s.redDot) || void 0 === t ? void 0 : t.node);
}
});
} else if (this.chapterBtnUnlock) {
this.chapterBtnUnlock.removeFromParent();
this.chapterBtnUnlock = null;
}
};
e.prototype.modifyShowFirstHomeGuideComp = function(t) {
var e = t.target;
this.isTrigger ? "newMod_init" === e.state.aniName && (e.node.opacity = this.showFirstHomeGuide ? 255 : 0) : e.node.opacity = 255;
};
e.prototype.setShowFirstHomeGuide = function(t) {
var e, n;
this._showFirstHomeGuide = t;
var o = null === (n = null === (e = Cinst(hs.HomePage)) || void 0 === e ? void 0 : e.getComponentsInChildren(hs.FirstHomeGuideComponent)) || void 0 === n ? void 0 : n.find(function(t) {
return "newMod_init" === t.state.aniName;
});
o && (o.node.opacity = t ? 255 : 0);
};
e.prototype.ensureSettingBtnUnlock = function(t) {
return s(this, void 0, Promise, function() {
var e, n;
return c(this, function(o) {
switch (o.label) {
case 0:
return this.settingBtnUnlock ? [ 3, 2 ] : [ 4, this.preload(a.PrefabConfig.SettingUnlockAnim, cc.Prefab) ];

case 1:
if (e = o.sent()) {
this.settingBtnUnlock = cc.instantiate(e);
this.settingBtnUnlock.name = "settingBtnUnlock";
if (cc.isValid(null == t ? void 0 : t.setupRed)) {
n = t.setupRed;
this.settingBtnUnlock.setPosition(n.position);
cc.isValid(n.parent) && n.parent.addChild(this.settingBtnUnlock);
}
}
o.label = 2;

case 2:
return [ 2 ];
}
});
});
};
e.prototype.ensureHomeBtnUnlock = function() {
return s(this, void 0, Promise, function() {
var t;
return c(this, function(e) {
switch (e.label) {
case 0:
return this.homeBtnUnlock ? [ 3, 2 ] : [ 4, this.preload(a.PrefabConfig.SettingUnlockAnim, cc.Prefab) ];

case 1:
if (t = e.sent()) {
this.homeBtnUnlock = cc.instantiate(t);
this.homeBtnUnlock.name = "homeBtnUnlock";
}
e.label = 2;

case 2:
return [ 2 ];
}
});
});
};
e.prototype.ensureChapterBtnUnlock = function() {
var t;
return s(this, void 0, Promise, function() {
var e, n;
return c(this, function(o) {
switch (o.label) {
case 0:
return this.chapterBtnUnlock ? [ 3, 2 ] : [ 4, this.preload(a.PrefabConfig.ChapterBtnUnlockAnim, cc.Prefab) ];

case 1:
if (e = o.sent()) {
this.chapterBtnUnlock = cc.instantiate(e);
this.chapterBtnUnlock.name = "chapterBtnUnlock";
n = null === (t = Cinst(hs.HomePageSectionChapterBtnDefault)) || void 0 === t ? void 0 : t.node;
cc.isValid(n) && n.addChild(this.chapterBtnUnlock);
}
o.label = 2;

case 2:
return [ 2 ];
}
});
});
};
e.prototype.playSettingUnlockAnim = function(t, e) {
if (t) {
t.active = !0;
var n = t.getComponent(dragonBones.ArmatureDisplay);
if (n) if (e) {
n.once(dragonBones.EventObject.COMPLETE, function() {
cc.isValid(n.node) && n.playAnimation("init_unlock", 0);
});
n.playAnimation("out", 1);
} else n.playAnimation("init_lock", 0);
}
};
e.prototype.playHomeUnlockAnim = function(t) {
if (t) {
t.active = !0;
var e = t.getComponentInChildren(dragonBones.ArmatureDisplay);
e.once(dragonBones.EventObject.COMPLETE, function() {
cc.isValid(e.node) && (t.active = !1);
});
e.playAnimation("out", 1);
e.timeScale = 1;
t.getChildByName("btn").once("click", function() {
cc.isValid(e) && (e.timeScale = 3);
}, this);
}
};
e.prototype.playRedPointAnim = function(t) {
var e = this;
t.active = !0;
cc.tween(t).set({
scale: 0
}).delay(1.16).call(function() {
var n;
e.setShowFirstHomeGuide(!0);
if (null === (n = TRAIT("IsFirstHomeGuideTrait")) || void 0 === n || !n.active) if (e.clip) t.setScale(a.RED_POINT_SCALE); else {
var o = t.getComponent(cc.Animation);
o || (o = t.addComponent(cc.Animation));
o.addClip(e.clip);
o.play("ChapterBtnUnlockReddotAnim");
}
}).start();
};
r([ hs.storageProperty({
key: "AddChapterUnlockProcessTrait_btnUnlock"
}) ], e.prototype, "btnUnlock", void 0);
return r([ classId("AddChapterUnlockProcessTrait") ], e);
}(Trait);
n.AddChapterUnlockProcessTrait = l;
cc._RF.pop();
}, {
"./AddChapterUnlockProcessTraitConst": "AddChapterUnlockProcessTraitConst"
} ]
}, {}, [ "AddChapterUnlockProcessTrait", "AddChapterUnlockProcessTraitConst" ]);
//# sourceMappingURL=index.js.map
