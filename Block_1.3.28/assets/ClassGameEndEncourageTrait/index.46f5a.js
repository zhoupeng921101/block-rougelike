window.__require = function e(s, a, t) {
function r(o, c) {
if (!a[o]) {
if (!s[o]) {
var i = o.split("/");
i = i[i.length - 1];
if (!s[i]) {
var u = "function" == typeof __require && __require;
if (!c && u) return u(i, !0);
if (n) return n(i, !0);
throw new Error("Cannot find module '" + o + "'");
}
o = i;
}
var g = a[o] = {
exports: {}
};
s[o][0].call(g.exports, function(e) {
return r(s[o][1][e] || e);
}, g, g.exports, e, s, a, t);
}
return a[o].exports;
}
for (var n = "function" == typeof __require && __require, o = 0; o < t.length; o++) r(t[o]);
return r;
}({
ClassGameEndEncourageTrait: [ function(e, s, a) {
"use strict";
cc._RF.push(s, "7d1bbkJKaJHhJwE1uo89YEc", "ClassGameEndEncourageTrait");
var t, r = this && this.__extends || (t = function(e, s) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, s) {
e.__proto__ = s;
} || function(e, s) {
for (var a in s) Object.prototype.hasOwnProperty.call(s, a) && (e[a] = s[a]);
})(e, s);
}, function(e, s) {
t(e, s);
function a() {
this.constructor = e;
}
e.prototype = null === s ? Object.create(s) : (a.prototype = s.prototype, new a());
}), n = this && this.__decorate || function(e, s, a, t) {
var r, n = arguments.length, o = n < 3 ? s : null === t ? t = Object.getOwnPropertyDescriptor(s, a) : t;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) o = Reflect.decorate(e, s, a, t); else for (var c = e.length - 1; c >= 0; c--) (r = e[c]) && (o = (n < 3 ? r(o) : n > 3 ? r(s, a, o) : r(s, a)) || o);
return n > 3 && o && Object.defineProperty(s, a, o), o;
}, o = this && this.__awaiter || function(e, s, a, t) {
return new (a || (a = Promise))(function(r, n) {
function o(e) {
try {
i(t.next(e));
} catch (e) {
n(e);
}
}
function c(e) {
try {
i(t.throw(e));
} catch (e) {
n(e);
}
}
function i(e) {
e.done ? r(e.value) : (s = e.value, s instanceof a ? s : new a(function(e) {
e(s);
})).then(o, c);
var s;
}
i((t = t.apply(e, s || [])).next());
});
}, c = this && this.__generator || function(e, s) {
var a, t, r, n, o = {
label: 0,
sent: function() {
if (1 & r[0]) throw r[1];
return r[1];
},
trys: [],
ops: []
};
return n = {
next: c(0),
throw: c(1),
return: c(2)
}, "function" == typeof Symbol && (n[Symbol.iterator] = function() {
return this;
}), n;
function c(e) {
return function(s) {
return i([ e, s ]);
};
}
function i(n) {
if (a) throw new TypeError("Generator is already executing.");
for (;o; ) try {
if (a = 1, t && (r = 2 & n[0] ? t.return : n[0] ? t.throw || ((r = t.return) && r.call(t), 
0) : t.next) && !(r = r.call(t, n[1])).done) return r;
(t = 0, r) && (n = [ 2 & n[0], r.value ]);
switch (n[0]) {
case 0:
case 1:
r = n;
break;

case 4:
o.label++;
return {
value: n[1],
done: !1
};

case 5:
o.label++;
t = n[1];
n = [ 0 ];
continue;

case 7:
n = o.ops.pop();
o.trys.pop();
continue;

default:
if (!(r = o.trys, r = r.length > 0 && r[r.length - 1]) && (6 === n[0] || 2 === n[0])) {
o = 0;
continue;
}
if (3 === n[0] && (!r || n[1] > r[0] && n[1] < r[3])) {
o.label = n[1];
break;
}
if (6 === n[0] && o.label < r[1]) {
o.label = r[1];
r = n;
break;
}
if (r && o.label < r[2]) {
o.label = r[2];
o.ops.push(n);
break;
}
r[2] && o.ops.pop();
o.trys.pop();
continue;
}
n = s.call(e, o);
} catch (e) {
n = [ 6, e ];
t = 0;
} finally {
a = r = 0;
}
if (5 & n[0]) throw n[1];
return {
value: n[0] ? n[1] : void 0,
done: !0
};
}
};
Object.defineProperty(a, "__esModule", {
value: !0
});
a.ClassGameEndEncourageTrait = void 0;
var i = e("./type/ClassGameOverEncourageType"), u = e("./components/ClassGameEndEncourage"), g = "ClassGameEndEncourage", l = function(e) {
r(s, e);
function s() {
return null !== e && e.apply(this, arguments) || this;
}
s.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassGameOver_ShowFinish_Proxy",
methodName: "onClassGameOverShowFinish"
}, {
className: "ClassGame_Proxy",
methodName: "onGameStart"
} ];
};
s.prototype.onActive = function(e) {
var s, a;
return o(this, void 0, void 0, function() {
var t, r, n;
return c(this, function(o) {
switch (o.label) {
case 0:
if (hs.tp.isClassGameOver_ShowFinish_ProxyOnClassGameOverShowFinish(e)) {
t = e.args[0].option, r = t.isWin, n = t.overNode;
storage.setItem("classGameEndEncourageMessage", "");
this.showHighScoreMessages(n, r);
}
if (!hs.tp.isClassGame_ProxyOnGameStart(e)) return [ 3, 2 ];
this._gameEncourageNode = null;
return [ 4, this.loadJsonAsset() ];

case 1:
o.sent();
this.initializeMessages();
o.label = 2;

case 2:
hs.tp.isClassGameOver_ProxyOnClassGameOverShowBtnFinish(e) && cc.isValid(this._gameEncourageNode) && this.showEncourageAnim(this._gameEncourageNode);
if (hs.tp.isClassWinShowAction(e)) {
n = null === (s = Cinst(hs.ClassWin)) || void 0 === s ? void 0 : s.node;
cc.isValid(n) && this.hideEncourage(n);
}
if (hs.tp.isClassFailShowAction(e)) {
n = null === (a = Cinst(hs.ClassFail)) || void 0 === a ? void 0 : a.node;
cc.isValid(n) && this.hideEncourage(n);
}
return [ 2 ];
}
});
});
};
s.prototype.showHighScoreMessages = function(e, s) {
var a = "";
if (s) {
a = this.getRandomMessageByType(i.ClassGameOverEncourageType.HighScore);
this.loadEncourage(e, a, s);
} else if (hs.classGameOverGameInfo.score >= .8 * hs.classGameOverGameInfo.highScore) {
a = this.getRandomMessageByType(i.ClassGameOverEncourageType.UnderScore);
this.loadEncourage(e, a, s);
} else if (hs.classGameOverGameInfo.score >= 1e4 && hs.classGameOverGameInfo.score < .8 * hs.classGameOverGameInfo.highScore) {
a = this.getRandomMessageByType(i.ClassGameOverEncourageType.LastScore);
this.loadEncourage(e, a, s);
} else this.hideEncourage(e);
storage.setItem("classGameEndEncourageMessage", a);
};
s.prototype.loadJsonAsset = function() {
return o(this, void 0, void 0, function() {
var e = this;
return c(this, function() {
return [ 2, new Promise(function(s) {
return o(e, void 0, void 0, function() {
var e = this;
return c(this, function() {
this._encourageJson ? s(null) : hs.ResLoader.loadByBundle("ClassGameEndEncourageTrait", "configs/high_score_messages", cc.JsonAsset, function(a, t) {
if (a) ; else {
t && t.json && (e._encourageJson = t.json);
s(null);
}
});
return [ 2 ];
});
});
}) ];
});
});
};
s.prototype.loadEncourage = function(e, s, a) {
var t = this;
void 0 === s && (s = "");
void 0 === a && (a = !1);
if (cc.isValid(e)) {
this._gameEncourageNode = e.getChildByName(g);
if (this._gameEncourageNode) {
this._gameEncourageNode.opacity = 0;
this._gameEncourageNode.getComponent(u.default).setState({
encourageStr: s
});
} else hs.ResLoader.asyncLoadByBundle("ClassGameEndEncourageTrait", "prefabs/ClassGameEndEncourage", cc.Prefab).then(function(a) {
if (a && cc.isValid(a) && cc.isValid(e) && !t._gameEncourageNode) {
t._gameEncourageNode = cc.instantiate(a);
t._gameEncourageNode.setParent(e);
t._gameEncourageNode.name = g;
t._gameEncourageNode.opacity = 0;
t._gameEncourageNode.getComponent(u.default).setState({
encourageStr: s
});
}
});
}
};
s.prototype.initializeMessages = function() {
var e, s, a;
this._messageIndexes = storage.getItem("classGameEndEncourageMessageIndexes", null);
if (this._messageIndexes) {
if (0 == this._messageIndexes.high_score_messages.length) {
this._messageIndexes.high_score_messages = Array.from(this._encourageJson.highScoreMessages.keys());
storage.setItem("classGameEndEncourageMessageIndexes", this._messageIndexes);
}
if (0 == this._messageIndexes.under_score_messages.length) {
this._messageIndexes.under_score_messages = Array.from(this._encourageJson.underScoreMessages.keys());
storage.setItem("classGameEndEncourageMessageIndexes", this._messageIndexes);
}
if (0 == this._messageIndexes.last_score_messages.length) {
this._messageIndexes.last_score_messages = Array.from(this._encourageJson.lastScoreMessages.keys());
storage.setItem("classGameEndEncourageMessageIndexes", this._messageIndexes);
}
} else {
this._messageIndexes = {
high_score_messages: [],
under_score_messages: [],
last_score_messages: []
};
this._messageIndexes.high_score_messages = (null === (e = this._encourageJson) || void 0 === e ? void 0 : e.highScoreMessages) ? Array.from(this._encourageJson.highScoreMessages.keys()) : [];
this._messageIndexes.under_score_messages = (null === (s = this._encourageJson) || void 0 === s ? void 0 : s.underScoreMessages) ? Array.from(this._encourageJson.underScoreMessages.keys()) : [];
this._messageIndexes.last_score_messages = (null === (a = this._encourageJson) || void 0 === a ? void 0 : a.lastScoreMessages) ? Array.from(this._encourageJson.lastScoreMessages.keys()) : [];
storage.setItem("classGameEndEncourageMessageIndexes", this._messageIndexes);
}
};
s.prototype.getRandomMessageByType = function(e) {
var s = this.getRandomMessageIndex(e);
if (null === s) return "";
switch (e) {
case i.ClassGameOverEncourageType.HighScore:
return this._encourageJson.highScoreMessages[s];

case i.ClassGameOverEncourageType.UnderScore:
return this._encourageJson.underScoreMessages[s];

case i.ClassGameOverEncourageType.LastScore:
return this._encourageJson.lastScoreMessages[s];

default:
return "";
}
};
s.prototype.getRandomMessageIndex = function(e) {
switch (e) {
case i.ClassGameOverEncourageType.HighScore:
return this.getRandomMessageIndexByType(this._messageIndexes.high_score_messages, e);

case i.ClassGameOverEncourageType.UnderScore:
return this.getRandomMessageIndexByType(this._messageIndexes.under_score_messages, e);

case i.ClassGameOverEncourageType.LastScore:
return this.getRandomMessageIndexByType(this._messageIndexes.last_score_messages, e);

default:
return null;
}
};
s.prototype.getRandomMessageIndexByType = function(e, s) {
if (!e || 0 === e.length) return null;
var a = Math.floor(Math.random() * e.length), t = e[a];
e.splice(a, 1);
if (0 === e.length) {
switch (s) {
case i.ClassGameOverEncourageType.HighScore:
this._messageIndexes.high_score_messages = Array.from(this._encourageJson.highScoreMessages.keys());
e = this._messageIndexes.high_score_messages;
break;

case i.ClassGameOverEncourageType.UnderScore:
this._messageIndexes.under_score_messages = Array.from(this._encourageJson.underScoreMessages.keys());
e = this._messageIndexes.under_score_messages;
break;

case i.ClassGameOverEncourageType.LastScore:
this._messageIndexes.last_score_messages = Array.from(this._encourageJson.lastScoreMessages.keys());
e = this._messageIndexes.last_score_messages;
}
e.splice(t, 1);
}
storage.setItem("classGameEndEncourageMessageIndexes", this._messageIndexes);
return t;
};
s.prototype.showEncourageAnim = function(e, s) {
void 0 === s && (s = .2);
e.y = -700;
e.opacity = 0;
e.active = !0;
cc.tween(e).delay(s).parallel(cc.tween(e).to(.6, {
y: -650
}, {
easing: cc.easing.backOut
}), cc.tween(e).to(.6, {
opacity: 255
}, {
easing: cc.easing.sineOut
})).start();
};
s.prototype.hideEncourage = function(e) {
if (cc.isValid(e)) {
var s = e.getChildByName(g);
if (cc.isValid(s)) {
cc.Tween.stopAllByTarget(s);
s.stopAllActions();
s.opacity = 0;
}
var a = e.getChildByName("playBtn");
cc.isValid(a) && cc.Tween.stopAllByTarget(a);
}
};
return n([ classId("ClassGameEndEncourageTrait") ], s);
}(Trait);
a.ClassGameEndEncourageTrait = l;
cc._RF.pop();
}, {
"./components/ClassGameEndEncourage": "ClassGameEndEncourage",
"./type/ClassGameOverEncourageType": "ClassGameOverEncourageType"
} ],
ClassGameEndEncourage: [ function(e, s, a) {
"use strict";
cc._RF.push(s, "709f3eWxdlFhrqCJBGpu7TM", "ClassGameEndEncourage");
var t, r = this && this.__extends || (t = function(e, s) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, s) {
e.__proto__ = s;
} || function(e, s) {
for (var a in s) Object.prototype.hasOwnProperty.call(s, a) && (e[a] = s[a]);
})(e, s);
}, function(e, s) {
t(e, s);
function a() {
this.constructor = e;
}
e.prototype = null === s ? Object.create(s) : (a.prototype = s.prototype, new a());
}), n = this && this.__decorate || function(e, s, a, t) {
var r, n = arguments.length, o = n < 3 ? s : null === t ? t = Object.getOwnPropertyDescriptor(s, a) : t;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) o = Reflect.decorate(e, s, a, t); else for (var c = e.length - 1; c >= 0; c--) (r = e[c]) && (o = (n < 3 ? r(o) : n > 3 ? r(s, a, o) : r(s, a)) || o);
return n > 3 && o && Object.defineProperty(s, a, o), o;
};
Object.defineProperty(a, "__esModule", {
value: !0
});
var o = cc._decorator, c = o.ccclass, i = o.property, u = function(e) {
r(s, e);
function s() {
var s = null !== e && e.apply(this, arguments) || this;
s.label = null;
return s;
}
s.prototype.render = function() {
this.label.string = this.state.encourageStr;
};
n([ i(cc.Label) ], s.prototype, "label", void 0);
return n([ c ], s);
}(hs.Component);
a.default = u;
cc._RF.pop();
}, {} ],
ClassGameOverEncourageType: [ function(e, s, a) {
"use strict";
cc._RF.push(s, "3c17d+uzk1J3rsPSTtxvryu", "ClassGameOverEncourageType");
Object.defineProperty(a, "__esModule", {
value: !0
});
a.ClassGameOverEncourageType = void 0;
(function(e) {
e[e.HighScore = 0] = "HighScore";
e[e.UnderScore = 1] = "UnderScore";
e[e.LastScore = 2] = "LastScore";
})(a.ClassGameOverEncourageType || (a.ClassGameOverEncourageType = {}));
cc._RF.pop();
}, {} ]
}, {}, [ "ClassGameEndEncourageTrait", "ClassGameEndEncourage", "ClassGameOverEncourageType" ]);
//# sourceMappingURL=index.js.map
