window.__require = function t(r, e, o) {
function n(i, c) {
if (!e[i]) {
if (!r[i]) {
var s = i.split("/");
s = s[s.length - 1];
if (!r[s]) {
var p = "function" == typeof __require && __require;
if (!c && p) return p(s, !0);
if (a) return a(s, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = s;
}
var d = e[i] = {
exports: {}
};
r[i][0].call(d.exports, function(t) {
return n(r[i][1][t] || t);
}, d, d.exports, t, r, e, o);
}
return e[i].exports;
}
for (var a = "function" == typeof __require && __require, i = 0; i < o.length; i++) n(o[i]);
return n;
}({
ChapterWinTarotWord: [ function(t, r, e) {
"use strict";
cc._RF.push(r, "602a6HetD5G76vzqicipVF8", "ChapterWinTarotWord");
var o, n = this && this.__extends || (o = function(t, r) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, r) {
t.__proto__ = r;
} || function(t, r) {
for (var e in r) Object.prototype.hasOwnProperty.call(r, e) && (t[e] = r[e]);
})(t, r);
}, function(t, r) {
o(t, r);
function e() {
this.constructor = t;
}
t.prototype = null === r ? Object.create(r) : (e.prototype = r.prototype, new e());
}), a = this && this.__decorate || function(t, r, e, o) {
var n, a = arguments.length, i = a < 3 ? r : null === o ? o = Object.getOwnPropertyDescriptor(r, e) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(t, r, e, o); else for (var c = t.length - 1; c >= 0; c--) (n = t[c]) && (i = (a < 3 ? n(i) : a > 3 ? n(r, e, i) : n(r, e)) || i);
return a > 3 && i && Object.defineProperty(r, e, i), i;
};
Object.defineProperty(e, "__esModule", {
value: !0
});
var i = cc._decorator, c = i.ccclass, s = i.property, p = function(t) {
n(r, t);
function r() {
var r = null !== t && t.apply(this, arguments) || this;
r.tarotLabel = null;
return r;
}
r.prototype.render = function() {
this.tarotLabel.getComponent(cc.Label).string = this.state.tarotWord;
this.tarotLabel.angle = this.state.frontSide ? 0 : 180;
this.tarotLabel.opacity = this.state.frontSide ? 12.75 : 25.5;
};
a([ s(cc.Node) ], r.prototype, "tarotLabel", void 0);
return a([ c ], r);
}(hs.Component);
e.default = p;
cc._RF.pop();
}, {} ],
GameWinShowTarotWordTrait: [ function(t, r, e) {
"use strict";
cc._RF.push(r, "11782zhTgNBv4zAAd2BhZQ8", "GameWinShowTarotWordTrait");
var o, n = this && this.__extends || (o = function(t, r) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, r) {
t.__proto__ = r;
} || function(t, r) {
for (var e in r) Object.prototype.hasOwnProperty.call(r, e) && (t[e] = r[e]);
})(t, r);
}, function(t, r) {
o(t, r);
function e() {
this.constructor = t;
}
t.prototype = null === r ? Object.create(r) : (e.prototype = r.prototype, new e());
}), a = this && this.__decorate || function(t, r, e, o) {
var n, a = arguments.length, i = a < 3 ? r : null === o ? o = Object.getOwnPropertyDescriptor(r, e) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(t, r, e, o); else for (var c = t.length - 1; c >= 0; c--) (n = t[c]) && (i = (a < 3 ? n(i) : a > 3 ? n(r, e, i) : n(r, e)) || i);
return a > 3 && i && Object.defineProperty(r, e, i), i;
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.GameWinShowTarotWordTrait = void 0;
var i = t("./components/ChapterWinTarotWord"), c = function(t) {
n(r, t);
function r() {
var r = null !== t && t.apply(this, arguments) || this;
r.tarotWordList = [ "THE FOOL", "THE MAGICIAN", "THE HIGH PRIESTESS", "THE EMPRESS", "THE EMPEROR", "THE HIEROPHANT", "THE LOVERS", "THE CHARIOT", "STRENGTH", "THE HERMIT", "WHEEL OF FORTUNE", "JUSTICE", "THE HANGED MAN", "DEATH", "TEMPERANCE", "THE DEVIL", "THE TOWER", "THE STAR", "THE MOON", "THE SUN", "JUDGEMENT", "THE WORLD" ];
return r;
}
r.prototype.onActive = function(t) {
if (hs.tp.isChapterScoreWinExtraUI(t)) {
var r = t.target;
this.loadTarotWord(r.node);
}
if (hs.tp.isChapterCollectWinExtraUI(t)) {
var e = t.target;
this.loadTarotWord(e.node);
}
hs.tp.isChapterGame_ProxyOnGameStart(t) && t.args[0].data.newGame && this.hideProduceItem(!1);
};
r.prototype.loadTarotWord = function(t) {
var r = this, e = t.getChildByName("playBtn");
if (cc.isValid(e)) {
this.hideProduceItem(!0);
var o = e.getChildByName("ChapterWinTarotWord");
cc.isValid(o) ? this.showTarotWord(o) : hs.ResLoader.loadByBundle(this.traitName, "prefabs/ChapterWinTarotWord", cc.Prefab, function(t, o) {
if (t) ; else {
var n = cc.instantiate(o);
n.name = "ChapterWinTarotWord";
n.y = -150;
e.addChild(n);
r.showTarotWord(n);
}
});
}
};
r.prototype.showTarotWord = function(t) {
var r = this.tarotWordList[Math.floor(Math.random() * this.tarotWordList.length)], e = Math.random() > .5;
t.active = !0;
t.getComponent(i.default).setState({
tarotWord: r,
frontSide: e
});
};
r.prototype.hideProduceItem = function(t) {
var r;
void 0 === t && (t = !0);
var e = null === (r = Cinst(hs.BlocksProducer)) || void 0 === r ? void 0 : r.blocksContainer;
if (!cc.isValid(e)) return null;
for (var o = 0; o < e.children.length; o++) e.children[o].active = !t;
};
return a([ classId("GameWinShowTarotWordTrait") ], r);
}(Trait);
e.GameWinShowTarotWordTrait = c;
cc._RF.pop();
}, {
"./components/ChapterWinTarotWord": "ChapterWinTarotWord"
} ]
}, {}, [ "GameWinShowTarotWordTrait", "ChapterWinTarotWord" ]);
//# sourceMappingURL=index.js.map
