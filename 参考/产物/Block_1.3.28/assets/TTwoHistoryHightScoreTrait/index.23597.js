window.__require = function t(e, o, n) {
function r(s, a) {
if (!o[s]) {
if (!e[s]) {
var c = s.split("/");
c = c[c.length - 1];
if (!e[c]) {
var l = "function" == typeof __require && __require;
if (!a && l) return l(c, !0);
if (i) return i(c, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = c;
}
var p = o[s] = {
exports: {}
};
e[s][0].call(p.exports, function(t) {
return r(e[s][1][t] || t);
}, p, p.exports, t, e, o, n);
}
return o[s].exports;
}
for (var i = "function" == typeof __require && __require, s = 0; s < n.length; s++) r(n[s]);
return r;
}({
TTwoHistoryHightScoreTrait: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "16eb6UDkNxIWqo17DT+FUnd", "TTwoHistoryHightScoreTrait");
var n, r = this && this.__extends || (n = function(t, e) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
n(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), i = this && this.__decorate || function(t, e, o, n) {
var r, i = arguments.length, s = i < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, o, n); else for (var a = t.length - 1; a >= 0; a--) (r = t[a]) && (s = (i < 3 ? r(s) : i > 3 ? r(e, o, s) : r(e, o)) || s);
return i > 3 && s && Object.defineProperty(e, o, s), s;
}, s = this && this.__awaiter || function(t, e, o, n) {
return new (o || (o = Promise))(function(r, i) {
function s(t) {
try {
c(n.next(t));
} catch (t) {
i(t);
}
}
function a(t) {
try {
c(n.throw(t));
} catch (t) {
i(t);
}
}
function c(t) {
t.done ? r(t.value) : (e = t.value, e instanceof o ? e : new o(function(t) {
t(e);
})).then(s, a);
var e;
}
c((n = n.apply(t, e || [])).next());
});
}, a = this && this.__generator || function(t, e) {
var o, n, r, i, s = {
label: 0,
sent: function() {
if (1 & r[0]) throw r[1];
return r[1];
},
trys: [],
ops: []
};
return i = {
next: a(0),
throw: a(1),
return: a(2)
}, "function" == typeof Symbol && (i[Symbol.iterator] = function() {
return this;
}), i;
function a(t) {
return function(e) {
return c([ t, e ]);
};
}
function c(i) {
if (o) throw new TypeError("Generator is already executing.");
for (;s; ) try {
if (o = 1, n && (r = 2 & i[0] ? n.return : i[0] ? n.throw || ((r = n.return) && r.call(n), 
0) : n.next) && !(r = r.call(n, i[1])).done) return r;
(n = 0, r) && (i = [ 2 & i[0], r.value ]);
switch (i[0]) {
case 0:
case 1:
r = i;
break;

case 4:
s.label++;
return {
value: i[1],
done: !1
};

case 5:
s.label++;
n = i[1];
i = [ 0 ];
continue;

case 7:
i = s.ops.pop();
s.trys.pop();
continue;

default:
if (!(r = s.trys, r = r.length > 0 && r[r.length - 1]) && (6 === i[0] || 2 === i[0])) {
s = 0;
continue;
}
if (3 === i[0] && (!r || i[1] > r[0] && i[1] < r[3])) {
s.label = i[1];
break;
}
if (6 === i[0] && s.label < r[1]) {
s.label = r[1];
r = i;
break;
}
if (r && s.label < r[2]) {
s.label = r[2];
s.ops.push(i);
break;
}
r[2] && s.ops.pop();
s.trys.pop();
continue;
}
i = e.call(t, s);
} catch (t) {
i = [ 6, t ];
n = 0;
} finally {
o = r = 0;
}
if (5 & i[0]) throw i[1];
return {
value: i[0] ? i[1] : void 0,
done: !0
};
}
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.TTwoHistoryHightScoreTrait = void 0;
var c = t("./compoments/TowHistoryHightScoreLabel"), l = {
name: "TowHistoryHightScoreLabel",
url: "prefabs/HistoryHightScoreLabel",
bundleName: "Remote_tTwoHistoryHightScore"
}, p = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.panelNode = null;
e.isClose = !1;
return e;
}
e.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassWin_Proxy",
methodName: "onPlayClick"
}, {
className: "ClassFail_Proxy",
methodName: "onPlayClick"
} ];
};
e.prototype.onActive = function(t) {
var e = this;
if (hs.tp.isClassFailShowBtn(t) || hs.tp.isClassWinShowBtn(t)) {
this.isClose = !1;
this.requestData().then(function(t) {
var o = null == t ? void 0 : t.split(",");
e.onShowTipsLabel(o);
});
}
(hs.tp.isClassWin_ProxyOnPlayClick(t) || hs.tp.isClassFail_ProxyOnPlayClick(t)) && this.onCloseTipsLabel();
};
e.prototype.onCloseTipsLabel = function() {
var t;
this.isClose = !0;
null === (t = this.panelNode) || void 0 === t || t.destroy();
this.panelNode = null;
};
e.prototype.requestData = function() {
return s(this, void 0, void 0, function() {
var t;
return a(this, function() {
t = "https://ucw.afafb.com/bbios/score_quantile.txt?" + Date.now();
return [ 2, new Promise(function(e, o) {
hs.ResLoader.load(t, cc.TextAsset, function(t, n) {
if (t) o(t); else {
var r = n.text;
e(r);
}
});
}) ];
});
});
};
e.prototype.onShowTipsLabel = function(t) {
if (!this.isClose && this.props.displayConditions) {
t.sort(function(t, e) {
return parseInt(t) - parseInt(e);
});
for (var e = this, o = this.props.displayConditions[0], n = hs.classGameOverGameInfo.score, r = 0; r < t.length; r++) {
var i = parseInt(t[r]), s = -1;
r < t.length - 1 && (s = parseInt(t[r + 1]));
if (i < n && (-1 == s || n < s)) {
var a = this.props.displayConditions[r];
o = a;
break;
}
}
o && hs.UI.show(l, hs.uiLayer).then(function(t) {
e.panelNode = t;
t.getComponent(c.default).setState({
percent: o.percent,
excitationStr: o.excitation
});
});
}
};
return i([ classId("TTwoHistoryHightScoreTrait") ], e);
}(Trait);
o.TTwoHistoryHightScoreTrait = p;
cc._RF.pop();
}, {
"./compoments/TowHistoryHightScoreLabel": "TowHistoryHightScoreLabel"
} ],
TowHistoryHightScoreLabel: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "eef229jsrFM95JV2UJTaQnl", "TowHistoryHightScoreLabel");
var n, r = this && this.__extends || (n = function(t, e) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
n(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), i = this && this.__decorate || function(t, e, o, n) {
var r, i = arguments.length, s = i < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(t, e, o, n); else for (var a = t.length - 1; a >= 0; a--) (r = t[a]) && (s = (i < 3 ? r(s) : i > 3 ? r(e, o, s) : r(e, o)) || s);
return i > 3 && s && Object.defineProperty(e, o, s), s;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var s = cc._decorator, a = s.ccclass, c = s.property, l = function(t) {
r(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.excitationLabel = null;
e.percentLab = null;
e.labelContainer = null;
e._tween = null;
return e;
}
e.prototype.onEnable = function() {
this.labelContainer.opacity = 0;
cc.tween(this.labelContainer).delay(.2).to(.33, {
opacity: 255
}).start();
this.percentLab.string = "0%";
};
Object.defineProperty(e.prototype, "lab", {
get: function() {
return parseInt(this.percentLab.string);
},
set: function(t) {
this.percentLab.string = t + "%";
},
enumerable: !1,
configurable: !0
});
e.prototype.render = function() {
var t = this;
this.excitationLabel.string = this.state.excitationStr;
this._tween = cc.tween({
percent: 0
}).to(.66, {
percent: this.state.percent
}, {
progress: function(e, o, n, r) {
t.percentLab.string = Math.floor(n) + "%";
return e + (o - e) * r;
}
}).call(function() {
t.percentLab.string = t.state.percent + "%";
t._tween = null;
});
this._tween.start();
};
e.prototype.onDisable = function() {
if (this._tween) {
this._tween.stop();
this._tween = null;
}
};
i([ c(cc.Label) ], e.prototype, "excitationLabel", void 0);
i([ c(cc.Label) ], e.prototype, "percentLab", void 0);
i([ c(cc.Node) ], e.prototype, "labelContainer", void 0);
return i([ a ], e);
}(hs.Component);
o.default = l;
cc._RF.pop();
}, {} ]
}, {}, [ "TTwoHistoryHightScoreTrait", "TowHistoryHightScoreLabel" ]);
//# sourceMappingURL=index.js.map
