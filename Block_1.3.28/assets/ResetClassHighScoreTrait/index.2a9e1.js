window.__require = function e(t, o, r) {
function s(c, i) {
if (!o[c]) {
if (!t[c]) {
var a = c.split("/");
a = a[a.length - 1];
if (!t[a]) {
var l = "function" == typeof __require && __require;
if (!i && l) return l(a, !0);
if (n) return n(a, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = a;
}
var h = o[c] = {
exports: {}
};
t[c][0].call(h.exports, function(e) {
return s(t[c][1][e] || e);
}, h, h.exports, e, t, o, r);
}
return o[c].exports;
}
for (var n = "function" == typeof __require && __require, c = 0; c < r.length; c++) s(r[c]);
return s;
}({
ResetClassHighScoreTrait: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "59557xxFVZLNLXt2orXJLV2", "ResetClassHighScoreTrait");
var r, s = this && this.__extends || (r = function(e, t) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
})(e, t);
}, function(e, t) {
r(e, t);
function o() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
}), n = this && this.__decorate || function(e, t, o, r) {
var s, n = arguments.length, c = n < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(e, t, o, r); else for (var i = e.length - 1; i >= 0; i--) (s = e[i]) && (c = (n < 3 ? s(c) : n > 3 ? s(t, o, c) : s(t, o)) || c);
return n > 3 && c && Object.defineProperty(t, o, c), c;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.ResetClassHighScoreTrait = void 0;
var c = e("./comp/ResetHightScoreAlertPanel"), i = {
name: "ResetClassHightScoreBtn",
url: "prefabs/resetBtn",
bundleName: "Remote_ResetClassHighScore"
}, a = {
name: "ResetHightScoreAlertPanel",
url: "prefabs/ResetHightScoreAlertPanel",
bundleName: "Remote_ResetClassHighScore"
}, l = function(e) {
s(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassFail",
methodName: "showAction"
} ];
};
t.prototype.onActive = function(e) {
var t = this;
if (hs.tp.isClassFailShowAction(e)) {
var o = Cinst(hs.ClassFail);
if (!(o.state.score < o.state.highScore * this.props.resetCondition)) return;
hs.UI.show(i, o.highNode).then(function(e) {
DC("game_classic_best_score_reset_click", {
best_score: o.state.highScore.toString(),
score: o.state.score.toString()
});
var r = Math.max(200, .5 * o.highScore.node.width + 74);
e.setPosition(r, -50);
e.on("click", t.onShowAlertPanel);
});
}
};
t.prototype.onShowAlertPanel = function() {
var e = this;
DC("game_classic_reset_best_score_popup_show");
hs.UI.show(a, hs.alertLayer).then(function(t) {
t.getComponent(c.default).setState({
resetCallback: function() {
var e = Cinst(hs.ClassFail);
storage.setItem("classHighScore", 0);
storage.setItem("classHighRecordScore", 0);
var t = storage.getItem("classResetHighScoreHistory", []);
t.push(t.length + 1 + ":" + e.state.highScore);
storage.setItem("classResetHighScoreHistory", t);
e.highScore.string = "0";
var o = t.join();
e.state.highScore = 0;
DC("game_classic_reset_best_score_success", {
best_score_history: o
});
},
thisObj: e
});
});
};
return n([ classId("ResetClassHighScoreTrait") ], t);
}(Trait);
o.ResetClassHighScoreTrait = l;
cc._RF.pop();
}, {
"./comp/ResetHightScoreAlertPanel": "ResetHightScoreAlertPanel"
} ],
ResetHightScoreAlertPanel: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "6bbd6Z3p0VBKL2Ugai9LJi1", "ResetHightScoreAlertPanel");
var r, s = this && this.__extends || (r = function(e, t) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
})(e, t);
}, function(e, t) {
r(e, t);
function o() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
}), n = this && this.__decorate || function(e, t, o, r) {
var s, n = arguments.length, c = n < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(e, t, o, r); else for (var i = e.length - 1; i >= 0; i--) (s = e[i]) && (c = (n < 3 ? s(c) : n > 3 ? s(t, o, c) : s(t, o)) || c);
return n > 3 && c && Object.defineProperty(t, o, c), c;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var c = cc._decorator, i = c.ccclass, a = c.property, l = function(e) {
s(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.closeBtn = null;
t.cancelBtn = null;
t.yesBtn = null;
t.maskBtn = null;
return t;
}
t.prototype.onLoad = function() {
var e = this;
this.closeBtn.node.on("click", this.onClose);
this.cancelBtn.node.on("click", function() {
DC("game_classic_reset_best_score_popup_click", {
click_type: "cancel"
});
e.onClose();
});
this.yesBtn.node.on("click", function() {
return e.resetHightScore();
});
this.maskBtn.node.on("click", function() {
e.onClose();
});
};
t.prototype.resetHightScore = function() {
var e, t;
DC("game_classic_reset_best_score_popup_click", {
click_type: "yes"
});
null === (t = null === (e = this.state) || void 0 === e ? void 0 : e.resetCallback) || void 0 === t || t.call(this.state.thisObj);
this.onClose();
};
t.prototype.onClose = function() {
hs.UI.hide(this);
};
t.prototype.render = function() {};
n([ a(cc.Button) ], t.prototype, "closeBtn", void 0);
n([ a(cc.Button) ], t.prototype, "cancelBtn", void 0);
n([ a(cc.Button) ], t.prototype, "yesBtn", void 0);
n([ a(cc.Button) ], t.prototype, "maskBtn", void 0);
return n([ classId("ClassFail"), i ], t);
}(hs.Component);
o.default = l;
cc._RF.pop();
}, {} ]
}, {}, [ "ResetClassHighScoreTrait", "ResetHightScoreAlertPanel" ]);
//# sourceMappingURL=index.js.map
