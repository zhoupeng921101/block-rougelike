window.__require = function n(i, e, o) {
function a(r, s) {
if (!e[r]) {
if (!i[r]) {
var l = r.split("/");
l = l[l.length - 1];
if (!i[l]) {
var u = "function" == typeof __require && __require;
if (!s && u) return u(l, !0);
if (t) return t(l, !0);
throw new Error("Cannot find module '" + r + "'");
}
r = l;
}
var p = e[r] = {
exports: {}
};
i[r][0].call(p.exports, function(n) {
return a(i[r][1][n] || n);
}, p, p.exports, n, i, e, o);
}
return e[r].exports;
}
for (var t = "function" == typeof __require && __require, r = 0; r < o.length; r++) a(o[r]);
return a;
}({
BrandVisionDesignTraitAudioConfig: [ function(n, i, e) {
"use strict";
cc._RF.push(i, "999afqmOGBOC4/uoTqbz92H", "BrandVisionDesignTraitAudioConfig");
Object.defineProperty(e, "__esModule", {
value: !0
});
e.AudioConfigType = e.satisfies = e.BrandVisionDesignTraitAudioConfig = void 0;
var o = n("../../../../../scripts/base/audio/AudioInfo");
e.BrandVisionDesignTraitAudioConfig = {
man_gaokang: {
url: "audios/man_gaokang",
type: o.AudioType.EFFECT,
volume: 1,
bundleName: "BrandVisionDesignTrait"
},
man_lengjing: {
url: "audios/man_lengjing",
type: o.AudioType.EFFECT,
volume: 1,
bundleName: "BrandVisionDesignTrait"
},
man_huopo: {
url: "audios/man_huopo",
type: o.AudioType.EFFECT,
volume: 1,
bundleName: "BrandVisionDesignTrait"
},
man_dichen: {
url: "audios/man_dichen",
type: o.AudioType.EFFECT,
volume: 1,
bundleName: "BrandVisionDesignTrait"
},
woman_lengjing: {
url: "audios/woman_lengjing",
type: o.AudioType.EFFECT,
volume: 1,
bundleName: "BrandVisionDesignTrait"
},
woman_huopo: {
url: "audios/woman_huopo",
type: o.AudioType.EFFECT,
volume: 1,
bundleName: "BrandVisionDesignTrait"
}
};
cc._RF.pop();
}, {
"../../../../../scripts/base/audio/AudioInfo": void 0
} ],
BrandVisionDesignTrait: [ function(n, i, e) {
"use strict";
cc._RF.push(i, "aaea8F6L5tIa5nFycvt7X6E", "BrandVisionDesignTrait");
var o, a = this && this.__extends || (o = function(n, i) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(n, i) {
n.__proto__ = i;
} || function(n, i) {
for (var e in i) Object.prototype.hasOwnProperty.call(i, e) && (n[e] = i[e]);
})(n, i);
}, function(n, i) {
o(n, i);
function e() {
this.constructor = n;
}
n.prototype = null === i ? Object.create(i) : (e.prototype = i.prototype, new e());
}), t = this && this.__decorate || function(n, i, e, o) {
var a, t = arguments.length, r = t < 3 ? i : null === o ? o = Object.getOwnPropertyDescriptor(i, e) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) r = Reflect.decorate(n, i, e, o); else for (var s = n.length - 1; s >= 0; s--) (a = n[s]) && (r = (t < 3 ? a(r) : t > 3 ? a(i, e, r) : a(i, e)) || r);
return t > 3 && r && Object.defineProperty(i, e, r), r;
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.BrandVisionDesignTrait = void 0;
var r = function(n) {
a(i, n);
function i() {
return null !== n && n.apply(this, arguments) || this;
}
i.prototype.onActive = function(n) {
hs.tp.isClassScoreTip_ProxyPlayHighScoreAudio(n) && this.playAudio(hs.BlockBlastAudioType.ClassNewRecord);
(hs.tp.isClassWin_ProxyOpenUI(n) || hs.tp.isClassFail_ProxyOpenUI(n) || hs.tp.isChapterWin_ProxyOpenUI(n) || hs.tp.isChapterFail_ProxyOpenUI(n)) && this.playAudio(hs.BlockBlastAudioType.GameOver);
if (hs.tp.isHomePageSectionClassBtnDefaultOnClick(n) && hs.noSignalInfo.canOpenNoSignal(hs.NoSignalType.EnterGameIng)) {
n.replace = !0;
hs.EventManager.dispatchModuleEvent(new hs.E_NoSignal_ShowUI({
noSignalType: hs.NoSignalType.EnterGameIng,
callback: function() {
n.originalCaller();
}
}));
}
if (hs.tp.isAddMoreGameTraitOnClickMoreGame(n) && hs.noSignalInfo.canOpenNoSignal(hs.NoSignalType.EnterGameIng)) {
n.replace = !0;
hs.EventManager.dispatchModuleEvent(new hs.E_NoSignal_ShowUI({
noSignalType: hs.NoSignalType.EnterGameIng,
callback: function() {
n.originalCaller();
}
}));
}
if (hs.tp.isHomePageSectionChapterBtnDefaultOnClick(n) && hs.noSignalInfo.canOpenNoSignal(hs.NoSignalType.EnterGameIng)) {
n.replace = !0;
hs.EventManager.dispatchModuleEvent(new hs.E_NoSignal_ShowUI({
noSignalType: hs.NoSignalType.EnterGameIng,
callback: function() {
n.originalCaller();
}
}));
}
if (!hs.tp.isHomePage_ProxyShowNoSignal(n) || !hs.noSignalInfo.canOpenNoSignal(hs.NoSignalType.HomePage)) {
if (hs.tp.isLaunch_ProxyEnterGame(n) && hs.noSignalInfo.canOpenNoSignal(hs.NoSignalType.Loading)) {
n.replace = !0;
hs.EventManager.dispatchModuleEvent(new hs.E_NoSignal_ShowUI({
noSignalType: hs.NoSignalType.Loading,
callback: function() {
n.originalCaller();
}
}));
}
hs.tp.isButtonClick_ProxyPlayButtonClickSound(n) && hs.UI.activeState(hs.PrefabConfig.NoSignal.url) && (n.replace = !0);
}
};
i.prototype.playAudio = function(n) {
var i, e, o = null === (e = ((null === (i = this.props) || void 0 === i ? void 0 : i.audio) || []).find(function(i) {
return i.pos === n;
})) || void 0 === e ? void 0 : e.audio;
if (o) {
hs.audioInfo.play({
url: "audios/" + o,
bundleName: "BrandVisionDesignTrait"
});
hs.EventManager.dispatchModuleEvent(new hs.E_NoSignal_PlayAudioDot({
audioType: n,
is_of_success: 1
}));
}
};
return t([ classId("BrandVisionDesignTrait") ], i);
}(Trait);
e.BrandVisionDesignTrait = r;
cc._RF.pop();
}, {} ]
}, {}, [ "BrandVisionDesignTraitAudioConfig", "BrandVisionDesignTrait" ]);
//# sourceMappingURL=index.js.map
