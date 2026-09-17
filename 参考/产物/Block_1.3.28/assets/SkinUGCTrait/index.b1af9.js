window.__require = function t(e, o, i) {
function n(a, s) {
if (!o[a]) {
if (!e[a]) {
var l = a.split("/");
l = l[l.length - 1];
if (!e[l]) {
var c = "function" == typeof __require && __require;
if (!s && c) return c(l, !0);
if (r) return r(l, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = l;
}
var h = o[a] = {
exports: {}
};
e[a][0].call(h.exports, function(t) {
return n(e[a][1][t] || t);
}, h, h.exports, t, e, o, i);
}
return o[a].exports;
}
for (var r = "function" == typeof __require && __require, a = 0; a < i.length; a++) n(i[a]);
return n;
}({
ColorTools: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "872fbfiNlVAJ4Cb3+Bgknf8", "ColorTools");
var i, n = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
i(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), r = this && this.__decorate || function(t, e, o, i) {
var n, r = arguments.length, a = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, o) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, o, i); else for (var s = t.length - 1; s >= 0; s--) (n = t[s]) && (a = (r < 3 ? n(a) : r > 3 ? n(e, o, a) : n(e, o)) || a);
return r > 3 && a && Object.defineProperty(e, o, a), a;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = t("./HueTools"), s = t("./LightAndSaturationTools"), l = cc._decorator, c = l.ccclass, h = l.property, d = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.hue_tools = null;
e.light_and_saturation_tools = null;
e.hue = 0;
e.light = 0;
e.saturation = 0;
e.colorData = null;
return e;
}
e.prototype.setState = function(t) {
this.colorData = new cc.Color().fromHEX("" + t);
this.initHueLightSaturationValue(this.colorData);
this.hue_tools.setHue(this.hue);
this.light_and_saturation_tools.setColorData(this.hue, this.light, this.saturation);
};
e.prototype.initColor = function(t, e, o) {
var i = this;
void 0 === o && (o = {
lightMin: .25,
lightMax: .9,
saturationMin: .2,
saturationMax: .9
});
this.colorData = new cc.Color().fromHEX("" + t);
this.initHueLightSaturationValue(this.colorData);
this.hue_tools.init(this.hue, function(t) {
i.hue = t;
i.light_and_saturation_tools.setHue(t);
i.setColor();
});
this.light_and_saturation_tools.init(this.light, this.saturation, o, this.hue, function(t, e) {
i.light = t;
i.saturation = e;
i.setColor();
});
this.callback = e;
};
e.prototype.setColor = function() {
var t = this;
this.scheduleOnce(function() {
t.hslToRgb(t.hue, t.saturation, t.light);
t.exportColor();
}, 0);
};
e.prototype.exportColor = function() {
var t = this.colorData.toHEX("#");
this.callback && this.callback("#" + t);
};
e.prototype.hslToRgb = function(t, e, o) {
var i = t / 360, n = e, r = o;
if (0 !== n) {
i = 6 * (i - Math.floor(i));
var a, s, l, c = Math.floor(i), h = i - c, d = r * (1 - n), u = r * (1 - n * h), p = r * (1 - n * (1 - h));
if (0 === c) {
a = r;
s = p;
l = d;
} else if (1 === c) {
a = u;
s = r;
l = d;
} else if (2 === c) {
a = d;
s = r;
l = p;
} else if (3 === c) {
a = d;
s = u;
l = r;
} else if (4 === c) {
a = p;
s = d;
l = r;
} else {
a = r;
s = d;
l = u;
}
this.colorData.r = Math.round(255 * a);
this.colorData.g = Math.round(255 * s);
this.colorData.b = Math.round(255 * l);
this.colorData.a = 255;
} else {
var f = Math.round(255 * r);
this.colorData.r = f;
this.colorData.g = f;
this.colorData.b = f;
this.colorData.a = 255;
}
};
e.prototype.initHueLightSaturationValue = function(t) {
var e = t.r / 255, o = t.g / 255, i = t.b / 255, n = Math.max(Math.max(e, o), i), r = n - Math.min(Math.min(e, o), i), a = 0, s = 0, l = n;
0 !== n && (s = r / n);
if (0 !== r) {
a = n === e ? (o - i) / r + (o < i ? 6 : 0) : n === o ? (i - e) / r + 2 : (e - o) / r + 4;
a /= 6;
}
this.hue = 360 * a;
this.saturation = s;
this.light = l;
};
r([ h(a.default) ], e.prototype, "hue_tools", void 0);
r([ h(s.default) ], e.prototype, "light_and_saturation_tools", void 0);
return r([ c ], e);
}(hs.Component);
o.default = d;
cc._RF.pop();
}, {
"./HueTools": "HueTools",
"./LightAndSaturationTools": "LightAndSaturationTools"
} ],
HueTools: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "e46ccbSEVNPTZQWS7I+fAZX", "HueTools");
var i, n = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
i(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), r = this && this.__decorate || function(t, e, o, i) {
var n, r = arguments.length, a = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, o) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, o, i); else for (var s = t.length - 1; s >= 0; s--) (n = t[s]) && (a = (r < 3 ? n(a) : r > 3 ? n(e, o, a) : n(e, o)) || a);
return r > 3 && a && Object.defineProperty(e, o, a), a;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = cc._decorator, s = a.ccclass, l = a.property, c = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.sprite = null;
e.select_node = null;
e.height = 0;
e.hue = 0;
e.startY = 0;
return e;
}
e.prototype.init = function(t, e) {
this.hue = t;
this.height = this.sprite.node.height;
this.callback = e;
this.setHueState(this.hue);
this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
};
e.prototype.setHue = function(t) {
this.hue = t;
this.setHueState(this.hue);
};
e.prototype.setHueState = function(t) {
var e = t / 360 * this.height - this.height / 2;
this.select_node.y = e;
};
e.prototype.onTouchStart = function(t) {
var e = t.getLocation();
(e = this.node.convertToNodeSpaceAR(e)).y < -this.height / 2 ? e.y = -this.height / 2 : e.y > this.height / 2 && (e.y = this.height / 2);
this.startY = e.y;
this.setSelectNodePositionByPosition(e);
};
e.prototype.onTouchMove = function(t) {
var e = t.getLocation();
(e = this.node.convertToNodeSpaceAR(e)).y < -this.height / 2 ? e.y = -this.height / 2 : e.y > this.height / 2 && (e.y = this.height / 2);
this.setSelectNodePositionByPosition(e);
};
e.prototype.onTouchEnd = function(t) {
var e = t.getLocation();
(e = this.node.convertToNodeSpaceAR(e)).y < -this.height / 2 ? e.y = -this.height / 2 : e.y > this.height / 2 && (e.y = this.height / 2);
this.setSelectNodePositionByPosition(e);
};
e.prototype.setSelectNodePositionByPosition = function(t) {
this.select_node.y = t.y;
var e = t.y + this.height / 2;
this.hue = e / this.height * 360;
this.callback(this.hue);
};
e.prototype.onDestroy = function() {
this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
};
r([ l(cc.Sprite) ], e.prototype, "sprite", void 0);
r([ l(cc.Node) ], e.prototype, "select_node", void 0);
return r([ s ], e);
}(hs.Component);
o.default = c;
cc._RF.pop();
}, {} ],
LightAndSaturationTools: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "49206XXcqNP7YYFn958gmKR", "LightAndSaturationTools");
var i, n = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
i(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), r = this && this.__decorate || function(t, e, o, i) {
var n, r = arguments.length, a = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, o) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, o, i); else for (var s = t.length - 1; s >= 0; s--) (n = t[s]) && (a = (r < 3 ? n(a) : r > 3 ? n(e, o, a) : n(e, o)) || a);
return r > 3 && a && Object.defineProperty(e, o, a), a;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = cc._decorator, s = a.ccclass, l = a.property, c = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.sprite = null;
e.select_node = null;
e.hue = 0;
e.light = 0;
e.saturation = 0;
e.material = null;
e.width = 0;
e.height = 0;
e.color = null;
e.option = {
lightMin: 0,
lightMax: 1,
saturationMin: 0,
saturationMax: 1
};
return e;
}
e.prototype.init = function(t, e, o, i, n) {
void 0 === o && (o = {
lightMin: 0,
lightMax: 1,
saturationMin: 0,
saturationMax: 1
});
this.option = o;
this.color = new cc.Color();
this.callback = n;
this.hue = i;
this.light = t;
this.saturation = e;
this.width = this.sprite.node.width;
this.height = this.sprite.node.height;
this.material = this.sprite.getMaterial(0);
this.material && this.material.setProperty("colorRange", [ this.option.saturationMin, this.option.saturationMax, this.option.lightMin, this.option.lightMax ]);
this.setHue(this.hue);
this.setSelectNodePosition(this.light, this.saturation);
this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
};
e.prototype.setHue = function(t) {
this.hue = t;
this.getColorFromHue(t);
this.material && this.material.setProperty("baseColor", this.color);
};
e.prototype.setColorData = function(t, e, o) {
this.hue = t;
this.light = e;
this.saturation = o;
this.setHue(this.hue);
this.setSelectNodePosition(this.light, this.saturation);
};
e.prototype.setSelectNodePosition = function(t, e) {
var o = this.width * (e - this.option.saturationMin) / (this.option.saturationMax - this.option.saturationMin) - this.width / 2, i = this.height * (t - this.option.lightMin) / (this.option.lightMax - this.option.lightMin) - this.height / 2;
this.select_node.setPosition(cc.v2(o, i));
};
e.prototype.onTouchStart = function(t) {
var e = t.getLocation();
e = this.node.convertToNodeSpaceAR(e);
if (!this.outMove(e)) {
e = this.sprite.node.convertToNodeSpaceAR(t.getLocation());
this.fixPosition(e);
this.setSelectNodePositionByPosition(e);
}
};
e.prototype.outMove = function(t) {
return t.x < -this.node.width / 2 || t.x > this.node.width / 2 || t.y < -this.node.height / 2 || t.y > this.node.height / 2;
};
e.prototype.fixPosition = function(t) {
t.x < -this.width / 2 + 10 && (t.x = -this.width / 2 + 10);
t.x > this.width / 2 - 10 && (t.x = this.width / 2 - 10);
t.y < -this.height / 2 + 10 && (t.y = -this.height / 2 + 10);
t.y > this.height / 2 - 10 && (t.y = this.height / 2 - 10);
};
e.prototype.onTouchMove = function(t) {
var e = t.getLocation();
e = this.node.convertToNodeSpaceAR(e);
if (!this.outMove(e)) {
e = this.sprite.node.convertToNodeSpaceAR(t.getLocation());
this.fixPosition(e);
this.setSelectNodePositionByPosition(e);
}
};
e.prototype.onTouchEnd = function(t) {
var e = t.getLocation();
e = this.node.convertToNodeSpaceAR(e);
if (!this.outMove(e)) {
e = this.sprite.node.convertToNodeSpaceAR(t.getLocation());
this.fixPosition(e);
this.setSelectNodePositionByPosition(e);
}
};
e.prototype.setSelectNodePositionByPosition = function(t) {
this.select_node.setPosition(t);
var e = t.x + this.width / 2, o = t.y + this.height / 2;
this.saturation = e / this.width * (this.option.saturationMax - this.option.saturationMin) + this.option.saturationMin;
this.light = o / this.height * (this.option.lightMax - this.option.lightMin) + this.option.lightMin;
this.callback(this.light, this.saturation);
};
e.prototype.onDestroy = function() {
this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
};
e.prototype.getColorFromHue = function(t) {
(t %= 360) < 0 && (t += 360);
var e, o, i, n = t % 60 / 60, r = 255 * (1 - n), a = 255 * n, s = 255;
switch (Math.floor(t / 60)) {
case 0:
e = s;
o = a;
i = 0;
break;

case 1:
e = r;
o = s;
i = 0;
break;

case 2:
e = 0;
o = s;
i = a;
break;

case 3:
e = 0;
o = r;
i = s;
break;

case 4:
e = a;
o = 0;
i = s;
break;

case 5:
e = s;
o = 0;
i = r;
break;

default:
e = o = i = 0;
}
this.color.r = Math.round(e);
this.color.g = Math.round(o);
this.color.b = Math.round(i);
this.color.a = 255;
};
r([ l(cc.Sprite) ], e.prototype, "sprite", void 0);
r([ l(cc.Node) ], e.prototype, "select_node", void 0);
return r([ s ], e);
}(hs.Component);
o.default = c;
cc._RF.pop();
}, {} ],
SkinEditItem: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "da613x7zfNHI5X2gmP6/uDR", "SkinEditItem");
var i, n = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
i(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), r = this && this.__decorate || function(t, e, o, i) {
var n, r = arguments.length, a = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, o) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, o, i); else for (var s = t.length - 1; s >= 0; s--) (n = t[s]) && (a = (r < 3 ? n(a) : r > 3 ? n(e, o, a) : n(e, o)) || a);
return r > 3 && a && Object.defineProperty(e, o, a), a;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = cc._decorator, s = a.ccclass, l = a.property, c = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.singleColor = null;
e.selectNd = null;
e.resetNd = null;
e.resetNd1 = null;
e.resetNd2 = null;
e._resetStyle = 1;
return e;
}
e.prototype.onLoad = function() {
this.setState({
isSelected: !1,
showReset: !1
});
this._resetStyle = 1;
if (2 === this._resetStyle) {
this.resetNd2 && (this.resetNd2.active = !0);
this.resetNd1 && (this.resetNd1.active = !1);
} else {
this.resetNd2 && (this.resetNd2.active = !1);
this.resetNd1 && (this.resetNd1.active = !0);
}
};
e.prototype.render = function() {
this.selectNd && (this.selectNd.active = this.state.isSelected || !1);
this.resetNd && (this.resetNd.active = this.state.showReset || !1);
};
e.prototype.setColor = function(t) {
this.singleColor && (this.singleColor.node.color = cc.color().fromHEX(t));
};
e.prototype.setSelected = function(t) {
this.setState({
isSelected: t
});
};
e.prototype.setShowReset = function(t) {
this.setState({
showReset: t
});
};
r([ l(cc.Sprite) ], e.prototype, "singleColor", void 0);
r([ l(cc.Node) ], e.prototype, "selectNd", void 0);
r([ l(cc.Node) ], e.prototype, "resetNd", void 0);
r([ l(cc.Node) ], e.prototype, "resetNd1", void 0);
r([ l(cc.Node) ], e.prototype, "resetNd2", void 0);
return r([ s ], e);
}(hs.Component);
o.default = c;
cc._RF.pop();
}, {} ],
SkinUGCBtn: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "346efkYcOZAOL6jTPkYRXUc", "SkinUGCBtn");
var i, n = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
i(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), r = this && this.__decorate || function(t, e, o, i) {
var n, r = arguments.length, a = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, o) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, o, i); else for (var s = t.length - 1; s >= 0; s--) (n = t[s]) && (a = (r < 3 ? n(a) : r > 3 ? n(e, o, a) : n(e, o)) || a);
return r > 3 && a && Object.defineProperty(e, o, a), a;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = t("../scripts/SkinUGCInfo"), s = cc._decorator, l = s.ccclass, c = s.property, h = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.btn = null;
e.redDot = null;
return e;
}
e.prototype.onLoad = function() {
this.setState({
showRedDot: !1
});
};
e.prototype.start = function() {
this.refreshRedDot();
this._sendExposureData();
};
e.prototype.onEnable = function() {
this.refreshRedDot();
};
e.prototype.render = function() {
this.redDot && (this.redDot.active = this.state.showRedDot || !1);
};
e.prototype.refreshRedDot = function() {
var t = !a.skinUGCInfo.enteredEdit;
this.setState({
showRedDot: t
});
};
e.prototype.onClick = function() {
var t = TRAIT("SkinUGCTrait");
(null == t ? void 0 : t.active) && t.openSkinList();
this._sendClickData();
};
e.prototype._sendExposureData = function() {
DS("usr_data_skin_ugc_entry_exp", {
GameType: a.skinUGCInfo.getGameType()
});
};
e.prototype._sendClickData = function() {
DS("usr_data_skin_ugc_entry_click", {
GameType: a.skinUGCInfo.getGameType()
});
};
r([ c(cc.Button) ], e.prototype, "btn", void 0);
r([ c(cc.Node) ], e.prototype, "redDot", void 0);
r([ hs.throttle(500) ], e.prototype, "onClick", null);
return r([ l ], e);
}(hs.Component);
o.default = h;
cc._RF.pop();
}, {
"../scripts/SkinUGCInfo": "SkinUGCInfo"
} ],
SkinUGCDelete: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "5b4eacXxeBA2I/ekhxxp6Fe", "SkinUGCDelete");
var i, n = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
i(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), r = this && this.__decorate || function(t, e, o, i) {
var n, r = arguments.length, a = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, o) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, o, i); else for (var s = t.length - 1; s >= 0; s--) (n = t[s]) && (a = (r < 3 ? n(a) : r > 3 ? n(e, o, a) : n(e, o)) || a);
return r > 3 && a && Object.defineProperty(e, o, a), a;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = t("../scripts/SkinUGCInfo"), s = t("./SkinUGCEdit"), l = t("./SkinUGCList"), c = cc._decorator, h = c.ccclass, d = c.property, u = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.label = null;
e._data = null;
return e;
}
e.prototype.show = function(t) {
this._data = t;
DS("usr_data_skin_ugc_del_confirm_exp", {
GameType: a.skinUGCInfo.getGameType()
});
};
e.prototype.onClickYes = function() {
var t = this;
if (this._data) {
this._sendClickData(!0);
var e = a.skinUGCInfo.extractBaseId(a.skinUGCInfo.getCurrentSkinId());
a.skinUGCInfo.deleteSkin(this._data);
if (this._data.id === e) {
var o = TRAIT("SkinUGCTrait");
null == o || o.dispatchSkinUpdate(hs.skinInfo.originSkinId, function() {
t._emitListRefresh();
});
}
var i = hs.gameAlertLayer;
if (cc.isValid(i)) {
var n = i.getChildByName("SkinUGCEdit");
if (cc.isValid(n)) {
var r = n.getComponent(s.default);
r && r.close();
}
}
this._emitListRefresh();
this._destroyNode();
}
};
e.prototype.onClickNo = function() {
this._sendClickData(!1);
this._destroyNode();
};
e.prototype._sendClickData = function(t) {
DS("usr_data_skin_ugc_del_confirm_click", {
GameType: a.skinUGCInfo.getGameType(),
click_type: t ? 1 : 0
});
};
e.prototype._emitListRefresh = function() {
var t = hs.gameAlertLayer;
if (cc.isValid(t)) {
var e = t.getChildByName("SkinUGCList");
if (cc.isValid(e)) {
var o = e.getComponent(l.default);
o && o.refresh();
}
}
};
e.prototype._destroyNode = function() {
var t = this;
cc.isValid(this.node) && cc.director.once(cc.Director.EVENT_AFTER_UPDATE, function() {
cc.isValid(t.node) && t.node.destroy();
});
};
r([ d(cc.Label) ], e.prototype, "label", void 0);
r([ hs.throttle(500) ], e.prototype, "onClickYes", null);
r([ hs.throttle(500) ], e.prototype, "onClickNo", null);
return r([ h ], e);
}(hs.Component);
o.default = u;
cc._RF.pop();
}, {
"../scripts/SkinUGCInfo": "SkinUGCInfo",
"./SkinUGCEdit": "SkinUGCEdit",
"./SkinUGCList": "SkinUGCList"
} ],
SkinUGCEdit: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "5d450YxFmpEDY3E0ODfEYot", "SkinUGCEdit");
var i, n = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
i(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), r = this && this.__decorate || function(t, e, o, i) {
var n, r = arguments.length, a = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, o) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, o, i); else for (var s = t.length - 1; s >= 0; s--) (n = t[s]) && (a = (r < 3 ? n(a) : r > 3 ? n(e, o, a) : n(e, o)) || a);
return r > 3 && a && Object.defineProperty(e, o, a), a;
}, a = this && this.__read || function(t, e) {
var o = "function" == typeof Symbol && t[Symbol.iterator];
if (!o) return t;
var i, n, r = o.call(t), a = [];
try {
for (;(void 0 === e || e-- > 0) && !(i = r.next()).done; ) a.push(i.value);
} catch (t) {
n = {
error: t
};
} finally {
try {
i && !i.done && (o = r.return) && o.call(r);
} finally {
if (n) throw n.error;
}
}
return a;
}, s = this && this.__spread || function() {
for (var t = [], e = 0; e < arguments.length; e++) t = t.concat(a(arguments[e]));
return t;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var l = t("../scripts/SkinUGCInfo"), c = t("../scripts/SkinUGCType"), h = t("./colorTools/ColorTools"), d = t("./SkinEditItem"), u = t("./SkinUGCList"), p = cc._decorator, f = p.ccclass, _ = p.property, g = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.gameBg = null;
e.board = null;
e.blocks = [];
e.blockSelectNd = null;
e.colorNd = null;
e.newColor = null;
e.oldColor = null;
e.bgItem = null;
e.boardItem = null;
e.boardFrame = null;
e.boardLine = null;
e.blockItems = [];
e.tipNd = null;
e.colorPanel = null;
e.oldNd = null;
e.newNd = null;
e.toolNd = null;
e._data = null;
e._originalData = null;
e._defaultData = null;
e._allItems = [];
e._curIndex = 2;
e._pnlTop = 0;
e._pnlLeft = 0;
e._colorPnl = null;
e._blockInited = !1;
e._colorTools = null;
return e;
}
e.prototype.start = function() {
var t;
if (null === (t = TRAIT("SkinUGCEditBackTrait")) || void 0 === t ? void 0 : t.active) {
var e = this.node.getChildByName("btnBack");
e && hs.applyAdapterFringe(e);
}
this.setState({
curIndex: 2
});
};
e.prototype.show = function(t) {
var e, o = this;
this._data = t;
this._originalData = JSON.parse(JSON.stringify(t));
this._defaultData = l.skinUGCInfo.getDefaultSkin();
this._allItems = s([ this.bgItem, this.boardItem ], this.blockItems);
if (this.colorPanel) {
this._pnlTop = this.colorPanel.height / 2;
this._pnlLeft = -this.colorPanel.width / 2;
}
this._initStyle();
if (!l.skinUGCInfo.enteredEdit) {
l.skinUGCInfo.enteredEdit = 1;
null === (e = TRAIT("SkinUGCTrait")) || void 0 === e || e.refreshBtn();
}
this._changeBgColor(t);
this.blocks[0] && (this.blocks[0].node.active = !1);
this.blockItems[0] && (this.blockItems[0].node.active = !1);
this.scheduleOnce(function() {
o._initBlocks();
for (var e = 0; e < t.blocks.length; e++) o._changeBlocksColor(t, e);
o._refreshSelect();
}, 0);
DS("usr_data_skin_ugc_edit_exp", {
GameType: l.skinUGCInfo.getGameType()
});
var i = TRAIT("IsOpenSkinUGCEditEnableClickTrait");
(null == i ? void 0 : i.active) && i.addExtraClickArea(this.node, function(t) {
o._curIndex = t;
o._refreshSelect();
});
};
e.prototype._initStyle = function() {
var t, e = this;
switch (l.skinUGCInfo.editStyle) {
case c.EditStyle.Tile1:
this.toolNd && (this.toolNd.active = !1);
this.colorPanel && (this.colorPanel.active = !0);
this._colorPnl = this.colorPanel;
this.colorNd && (this.colorNd.active = !1);
this.oldNd && (this.oldNd.active = !0);
break;

case c.EditStyle.Tile2:
this.toolNd && (this.toolNd.active = !1);
this.colorPanel && (this.colorPanel.active = !0);
this._colorPnl = this.colorPanel;
this.colorNd && (this.colorNd.active = !0);
this.oldNd && (this.oldNd.active = !1);
break;

case c.EditStyle.Palette:
this.toolNd && (this.toolNd.active = !0);
this.colorPanel && (this.colorPanel.active = !1);
this._colorPnl = this.toolNd;
this.colorNd && (this.colorNd.active = !0);
this._colorTools = this.toolNd.getComponent(h.default);
var o;
o = (null === (t = TRAIT("SkinUGCRemoveDarkTrait")) || void 0 === t ? void 0 : t.active) ? {
lightMin: .25,
lightMax: .9,
saturationMin: .2,
saturationMax: .9
} : {
lightMin: 0,
lightMax: 1,
saturationMin: 0,
saturationMax: 1
};
this._colorTools.initColor(this._getColor(this._data, this._curIndex), function(t) {
var o;
e._setColor(e._data, e._curIndex, t);
var i = (null === (o = TRAIT("SkinUGCResetTrait")) || void 0 === o ? void 0 : o.active) && !e._isDefaultColor(e._curIndex);
e._allItems[e._curIndex].resetNd.active = i;
e.newColor.color = cc.color().fromHEX(t);
}, o);
}
};
e.prototype.render = function() {
for (var t, e = null !== (t = this.state.curIndex) && void 0 !== t ? t : 2, o = 0; o < this._allItems.length; o++) this._allItems[o] && this._allItems[o].setSelected(o === e);
if (e > 1 && this._blockInited && this.blockSelectNd) {
this.blockSelectNd.active = !0;
var i = 4 * (e - 2);
this.blocks[i] && (this.blockSelectNd.y = this.blocks[i].node.y);
} else this.blockSelectNd && (this.blockSelectNd.active = !1);
};
e.prototype.onClickClose = function() {
this._data && this._originalData && l.skinUGCInfo.resetSkin(this._data, this._originalData);
this.close();
};
e.prototype.close = function() {
this._emitListRefresh();
this._destroyNode();
};
e.prototype.onClickBack = function() {
this._sendClickData("usr_data_skin_ugc_edit_back");
this._saveSkin();
};
e.prototype.onClickSave = function() {
this._sendClickData("usr_data_skin_ugc_edit_save");
this._saveSkin();
};
e.prototype._saveSkin = function() {
var t, e = this;
l.skinUGCInfo.saveSkin(this._data, !0);
var o = TRAIT("SkinUGCTrait"), i = l.skinUGCInfo.extractBaseId(l.skinUGCInfo.getCurrentSkinId());
this._data.id === i ? null == o || o.dispatchSkinUpdate(this._data.id) : (null === (t = TRAIT("SkinUGCAutoSwitchTrait")) || void 0 === t ? void 0 : t.active) && (null == o || o.dispatchSkinUpdate(this._data.id, function() {
e._emitListRefresh();
}));
this.close();
};
e.prototype.onClickDelete = function() {
this._sendClickData("usr_data_skin_ugc_edit_del");
if (this._data) {
var t = TRAIT("SkinUGCTrait");
null == t || t.openDelete(this._data);
}
};
e.prototype.onClickColorPnl = function(t) {
var e;
if (this.colorPanel && this._data) {
for (var o = this.colorPanel.convertToNodeSpaceAR(t.getLocation()), i = l.skinUGCInfo.colors, n = null, r = 0; r < i.length; r++) for (var a = 0; a < i[r].length; a++) if (o.x >= this._pnlLeft + 72 * a && o.x <= this._pnlLeft + 72 * (a + 1) && o.y >= this._pnlTop - 72 * (r + 1) && o.y <= this._pnlTop - 72 * r) {
n = i[r][a];
this._setNewPos(a, r);
break;
}
if (n) {
var s = null !== (e = this.state.curIndex) && void 0 !== e ? e : 2, c = this._getColor(this._data, s);
if (n && n !== c) {
this._setColor(this._data, s, n);
this._updateResetButton(s);
this.newColor && (this.newColor.color = cc.color().fromHEX(n));
}
}
}
};
e.prototype.onItemClick = function(t) {
var e, o = t.target.getComponent(d.default), i = this._allItems.indexOf(o);
if (i > -1 && i !== this.state.curIndex) {
this._curIndex = i;
this.setState({
curIndex: i
});
this._refreshSelect();
if ((null === (e = this.tipNd) || void 0 === e ? void 0 : e.active) && this._colorPnl) {
this.tipNd.active = !1;
this._colorPnl.active = !0;
}
}
};
e.prototype.onResetClick = function() {
var t, e;
if (this._data && this._defaultData && (null === (t = TRAIT("SkinUGCResetTrait")) || void 0 === t ? void 0 : t.active)) {
var o = null !== (e = this.state.curIndex) && void 0 !== e ? e : 2, i = this._getColor(this._defaultData, o);
this._setColor(this._data, o, i);
this.newColor && (this.newColor.color = cc.color().fromHEX(i));
this._updateResetButton(o);
this._setNewColor(i);
}
};
e.prototype.onOldClick = function() {
var t;
if (this._data && this._originalData) {
var e = null !== (t = this.state.curIndex) && void 0 !== t ? t : 2, o = this._getColor(this._originalData, e);
if (o !== this._getColor(this._data, e)) {
this._setColor(this._data, e, o);
this.newColor && (this.newColor.color = cc.color().fromHEX(o));
this._setNewColor(o);
}
}
};
e.prototype._initBlocks = function() {
for (var t = 0; t < 7; t++) if (this.blockItems.length <= t) {
(n = cc.instantiate(this.blockItems[0].node)).parent = this.blockItems[0].node.parent;
var e = n.getComponent(d.default);
if (e) {
this.blockItems.push(e);
this._allItems.push(e);
}
}
for (t = 0; t < 28; t++) {
var o = Math.floor(t / 4), i = t % 4;
if (this.blocks.length <= t) {
var n, r = (n = cc.instantiate(this.blocks[0].node)).getComponent(hs.BlockMaterialUpdate);
r && this.blocks.push(r);
n.parent = this.blocks[0].node.parent;
}
this.blocks[t].node.x = 106 * (2 + i) - 371;
this.blocks[t].node.y = 371 - 106 * (1 + o);
}
this.blockSelectNd && (this.blockSelectNd.zIndex = 100);
this._blockInited = !0;
};
e.prototype._changeBgColor = function(t) {
var e = t.bg, o = t.board;
if (e || o) {
var i = e ? l.skinUGCInfo.getChangeGameBgColorData(t) : null, n = o ? l.skinUGCInfo.getChangeBoardBgColorData(t) : null, r = o ? l.skinUGCInfo.getChangeBoardLineColorData(t) : null, a = e ? l.skinUGCInfo.getChangeBoardOutLineColorData(t) : null;
i && this.gameBg && (null == (s = this.gameBg.getComponent(hs.SkinGameBgComponent)) || s.setState({
colorData: i,
spriteFrame: null
}));
if (this.board && n && r && a) {
var s;
null == (s = this.board.getComponent(hs.SkinBoardComponent)) || s.setState({
colorData: {
board_out_line: a,
board_bg: n,
board_line: r
},
spriteFrame: null
});
}
this.bgItem && i && (this.bgItem.singleColor.node.color = cc.color().fromHEX(i.color.colorParam));
this.boardItem && n && (this.boardItem.singleColor.node.color = cc.color().fromHEX(n.color.colorParam));
this.boardLine && r && (this.boardLine.node.color = cc.color().fromHEX(r.color.colorParam));
this.boardFrame && a && (this.boardFrame.node.color = cc.color().fromHEX(a.color.colorParam));
}
};
e.prototype._changeBlocksColor = function(t, e) {
for (var o = t.blocks[e], i = 4 * e; i < 4 * e + 4; i++) {
var n = this.blocks[i];
if (n && cc.isValid(n.node)) {
var r = l.skinUGCInfo.getChangeBlocksColorData(t, e);
n.setMaterial(!0);
n.setAllParams(e, r.colorList);
n.node.active || (n.node.active = !0);
}
}
var a = this.blockItems[e];
if (a && cc.isValid(a.node)) {
a.singleColor.node.color = cc.color().fromHEX(o);
a.node.active || (a.node.active = !0);
}
};
e.prototype._getColor = function(t, e) {
return 0 === e ? t.bg : 1 === e ? t.board : t.blocks[e - 2];
};
e.prototype._setColor = function(t, e, o) {
if (0 === e) {
t.bg = o;
this._changeBgColor(t);
} else if (1 === e) {
t.board = o;
this._changeBgColor(t);
} else {
t.blocks[e - 2] = o;
this._changeBlocksColor(t, e - 2);
}
};
e.prototype._refreshSelect = function() {
for (var t, e = null !== (t = this.state.curIndex) && void 0 !== t ? t : 2, o = 0; o < this._allItems.length; o++) this._allItems[o] && this._allItems[o].setSelected(o === e);
if (e > 1 && this._blockInited && this.blockSelectNd) {
this.blockSelectNd.active = !0;
this.blockSelectNd.y = this.blocks[4 * (e - 2)].node.y;
} else this.blockSelectNd && (this.blockSelectNd.active = !1);
if (!(e < 0) && this._data) {
this._setOldColor(this._getColor(this._originalData, e), this._getColor(this._defaultData, e));
this._setNewColor(this._getColor(this._data, e));
this._updateResetButton(e);
}
};
e.prototype._updateResetButton = function(t) {
var e, o = null === (e = TRAIT("SkinUGCResetTrait")) || void 0 === e ? void 0 : e.active, i = this._isDefaultColor(t);
this._allItems[t] && this._allItems[t].setShowReset(!!o && !i);
};
e.prototype._isDefaultColor = function(t) {
return !this._data || !this._defaultData || this._getColor(this._defaultData, t) === this._getColor(this._data, t);
};
e.prototype._setOldColor = function(t, e) {
this.oldColor && (this.oldColor.color = cc.color().fromHEX(t));
if (this.oldNd) {
this.oldNd.active = !1;
for (var o = l.skinUGCInfo.colors, i = 0; i < o.length; i++) for (var n = 0; n < o[i].length; n++) if (e === o[i][n]) {
this.oldNd.y = this._pnlTop - 72 * i - 36;
this.oldNd.x = this._pnlLeft + 72 * n + 36;
this.oldNd.active = !0;
break;
}
}
};
e.prototype._setNewColor = function(t) {
this.newColor && (this.newColor.color = cc.color().fromHEX(t));
if (this.newNd) {
this.newNd.active = !1;
for (var e = l.skinUGCInfo.colors, o = 0; o < e.length; o++) for (var i = 0; i < e[o].length; i++) if (t === e[o][i]) {
this._setNewPos(i, o);
break;
}
}
};
e.prototype._setNewPos = function(t, e) {
if (this.newNd) {
this.newNd.y = this._pnlTop - 72 * e - 36;
this.newNd.x = this._pnlLeft + 72 * t + 36;
this.newNd.active = !0;
}
};
e.prototype._sendClickData = function(t) {
this._data && this._defaultData && DS(t, {
GameType: l.skinUGCInfo.getGameType(),
background: l.skinUGCInfo.getBg(this._data, this._defaultData),
board: l.skinUGCInfo.getBoard(this._data, this._defaultData),
block: l.skinUGCInfo.getBlocks(this._data, this._defaultData)
});
};
e.prototype._emitListRefresh = function() {
var t = hs.gameAlertLayer;
if (cc.isValid(t)) {
var e = t.getChildByName("SkinUGCList");
if (cc.isValid(e)) {
var o = e.getComponent(u.default);
o && o.refresh();
}
}
};
e.prototype._destroyNode = function() {
this.node && cc.isValid(this.node) && this.node.destroy();
};
r([ _(cc.Node) ], e.prototype, "gameBg", void 0);
r([ _(cc.Node) ], e.prototype, "board", void 0);
r([ _([ hs.BlockMaterialUpdate ]) ], e.prototype, "blocks", void 0);
r([ _(cc.Node) ], e.prototype, "blockSelectNd", void 0);
r([ _(cc.Node) ], e.prototype, "colorNd", void 0);
r([ _(cc.Node) ], e.prototype, "newColor", void 0);
r([ _(cc.Node) ], e.prototype, "oldColor", void 0);
r([ _(d.default) ], e.prototype, "bgItem", void 0);
r([ _(d.default) ], e.prototype, "boardItem", void 0);
r([ _(cc.Sprite) ], e.prototype, "boardFrame", void 0);
r([ _(cc.Sprite) ], e.prototype, "boardLine", void 0);
r([ _([ d.default ]) ], e.prototype, "blockItems", void 0);
r([ _(cc.Node) ], e.prototype, "tipNd", void 0);
r([ _(cc.Node) ], e.prototype, "colorPanel", void 0);
r([ _(cc.Node) ], e.prototype, "oldNd", void 0);
r([ _(cc.Node) ], e.prototype, "newNd", void 0);
r([ _(cc.Node) ], e.prototype, "toolNd", void 0);
r([ hs.throttle(500) ], e.prototype, "onClickClose", null);
r([ hs.throttle(500) ], e.prototype, "onClickBack", null);
r([ hs.throttle(500) ], e.prototype, "onClickSave", null);
r([ hs.throttle(500) ], e.prototype, "onClickDelete", null);
r([ hs.throttle(500) ], e.prototype, "onClickColorPnl", null);
r([ hs.throttle(500) ], e.prototype, "onItemClick", null);
r([ hs.throttle(500) ], e.prototype, "onResetClick", null);
r([ hs.throttle(500) ], e.prototype, "onOldClick", null);
return r([ f ], e);
}(hs.Component);
o.default = g;
cc._RF.pop();
}, {
"../scripts/SkinUGCInfo": "SkinUGCInfo",
"../scripts/SkinUGCType": "SkinUGCType",
"./SkinEditItem": "SkinEditItem",
"./SkinUGCList": "SkinUGCList",
"./colorTools/ColorTools": "ColorTools"
} ],
SkinUGCInfo: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "f4201VC/ZJI6J+Dhk/MQZGp", "SkinUGCInfo");
var i = this && this.__assign || function() {
return (i = Object.assign || function(t) {
for (var e, o = 1, i = arguments.length; o < i; o++) {
e = arguments[o];
for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
}
return t;
}).apply(this, arguments);
}, n = this && this.__awaiter || function(t, e, o, i) {
return new (o || (o = Promise))(function(n, r) {
function a(t) {
try {
l(i.next(t));
} catch (t) {
r(t);
}
}
function s(t) {
try {
l(i.throw(t));
} catch (t) {
r(t);
}
}
function l(t) {
t.done ? n(t.value) : (e = t.value, e instanceof o ? e : new o(function(t) {
t(e);
})).then(a, s);
var e;
}
l((i = i.apply(t, e || [])).next());
});
}, r = this && this.__generator || function(t, e) {
var o, i, n, r, a = {
label: 0,
sent: function() {
if (1 & n[0]) throw n[1];
return n[1];
},
trys: [],
ops: []
};
return r = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function s(t) {
return function(e) {
return l([ t, e ]);
};
}
function l(r) {
if (o) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (o = 1, i && (n = 2 & r[0] ? i.return : r[0] ? i.throw || ((n = i.return) && n.call(i), 
0) : i.next) && !(n = n.call(i, r[1])).done) return n;
(i = 0, n) && (r = [ 2 & r[0], n.value ]);
switch (r[0]) {
case 0:
case 1:
n = r;
break;

case 4:
a.label++;
return {
value: r[1],
done: !1
};

case 5:
a.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(n = a.trys, n = n.length > 0 && n[n.length - 1]) && (6 === r[0] || 2 === r[0])) {
a = 0;
continue;
}
if (3 === r[0] && (!n || r[1] > n[0] && r[1] < n[3])) {
a.label = r[1];
break;
}
if (6 === r[0] && a.label < n[1]) {
a.label = n[1];
n = r;
break;
}
if (n && a.label < n[2]) {
a.label = n[2];
a.ops.push(r);
break;
}
n[2] && a.ops.pop();
a.trys.pop();
continue;
}
r = e.call(t, a);
} catch (t) {
r = [ 6, t ];
i = 0;
} finally {
o = n = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
}, a = this && this.__values || function(t) {
var e = "function" == typeof Symbol && Symbol.iterator, o = e && t[e], i = 0;
if (o) return o.call(t);
if (t && "number" == typeof t.length) return {
next: function() {
t && i >= t.length && (t = void 0);
return {
value: t && t[i++],
done: !t
};
}
};
throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.skinUGCInfo = void 0;
var s = t("./SkinUGCType"), l = function() {
function t() {
this._data = [];
this._enteredEdit = 0;
this._editStyle = s.EditStyle.Tile1;
this._colorsConfig = null;
this._colors = [];
this._ugcColorTemplate = null;
this._originalSkinConfig = null;
this._presetSkinConfigMap = new Map();
this._presetSkinLoaded = !1;
}
Object.defineProperty(t.prototype, "data", {
get: function() {
return this._data;
},
set: function(t) {
this._data = t;
this._saveData();
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "enteredEdit", {
get: function() {
return this._enteredEdit;
},
set: function(e) {
this._enteredEdit = e;
hs.storage.setItem(t.STORAGE_KEY_ENTERED, e);
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "editStyle", {
get: function() {
return this._editStyle;
},
set: function(t) {
this._editStyle = t;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "colorsConfig", {
get: function() {
return this._colorsConfig;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(t.prototype, "colors", {
get: function() {
return this._colors;
},
enumerable: !1,
configurable: !0
});
t.prototype.init = function() {
this._data = hs.storage.getItem(t.STORAGE_KEY_DATA, []);
this._enteredEdit = hs.storage.getItem(t.STORAGE_KEY_ENTERED, 0);
};
t.prototype.loadAsset = function(t) {
void 0 === t && (t = !1);
return n(this, void 0, Promise, function() {
var e;
return r(this, function(o) {
switch (o.label) {
case 0:
e = [ Promise.resolve(this.loadUgcColorTemplate()), Promise.resolve(this.loadOriginalSkinConfig()), Promise.resolve(this.loadPresetSkinConfigs()) ];
t && e.push(this.loadColorsConfig());
return [ 4, Promise.all(e) ];

case 1:
o.sent();
return [ 2 ];
}
});
});
};
t.prototype.loadColorsConfig = function() {
return n(this, void 0, Promise, function() {
var t = this;
return r(this, function() {
return [ 2, new Promise(function(e) {
hs.ResLoader.loadByBundle("SkinUGCTrait", "config/ugc_colors", cc.JsonAsset, function(o, i) {
if (o) e(); else {
var n, r, a = i.json;
t._colors = [];
t._colorsConfig = {};
for (var s = 0; s < a.length; s++) {
n = s % 10;
r = Math.floor(s / 10);
t._colors[n] || (t._colors[n] = []);
t._colorsConfig[a[s].id] = a[s];
t._colors[n][r] = a[s].id;
}
e();
}
});
}) ];
});
});
};
t.prototype.getVersionedSkinId = function(t) {
return t.version && 0 !== t.version ? t.id + "_v" + t.version : t.id;
};
t.prototype.extractBaseId = function(t) {
var e = t.match(/^(.+)_v\d+$/);
return e ? e[1] : t;
};
t.prototype.isVersionedUGCSkinId = function(t) {
return /_v\d+$/.test(t);
};
t.prototype.isCurrentSkinUGC = function() {
var t = this.getCurrentSkinId();
return !!t && null !== this.getSkinById(t);
};
t.prototype.getCurrentSkin = function() {
return this.getSkinById(this.getCurrentSkinId()) || null;
};
t.prototype.getCurrentSkinId = function() {
return hs.storage.getItem("currentSkinId", "1000");
};
t.prototype.getSkinById = function(t) {
var e = this._data.find(function(e) {
return e.id === t;
});
if (e) return e;
var o = this.extractBaseId(t);
o !== t && (e = this._data.find(function(t) {
return t.id === o;
}));
return e || null;
};
t.prototype.getAllSkinIds = function() {
var t = this;
return this._data.map(function(e) {
return t.getVersionedSkinId(e);
});
};
t.prototype.getDefaultSkin = function() {
return this._editStyle === s.EditStyle.Palette ? {
id: "" + Date.now(),
blocks: [ "#1717e5", "#e5b217", "#9f17e5", "#e55c17", "#e61717", "#17e517", "#17c3e5" ],
bg: "#364c87",
board: "#1d2445"
} : {
id: "" + Date.now(),
blocks: [ "#0060fd", "#fde43f", "#854efd", "#ff6900", "#e12401", "#42ce2c", "#04c7fb" ],
bg: "#364c87",
board: "#1d2445"
};
};
t.prototype.saveSkin = function(t, e) {
void 0 === e && (e = !1);
var o = this._data.findIndex(function(e) {
return e.id === t.id;
});
if (-1 === o) {
t.version = 1;
o = this._data.length;
this._data.push(t);
} else {
t.version = e ? (this._data[o].version || 0) + 1 : this._data[o].version || 1;
this._data[o] = t;
this.updateSkinMapData(t);
}
this._saveData();
return o;
};
t.prototype.updateSkinMapData = function(t) {
var e = this.getVersionedSkinId(t);
if (hs.skinInfo.hasSkin(e) || hs.skinInfo.hasSkin(t.id)) {
var o = this.convertUGCDataToSkinConfig(t);
o && hs.skinInfo.setSkinMap(e, o);
}
};
t.prototype.resetSkin = function(t, e) {
var o = this._data.findIndex(function(e) {
return e.id === t.id;
});
if (o > -1) {
this._data[o] = e;
this._saveData();
}
};
t.prototype.deleteSkin = function(t) {
var e = this._data.findIndex(function(e) {
return e.id === t.id;
});
if (e > -1) {
this._data.splice(e, 1);
this._saveData();
}
return e;
};
t.prototype._saveData = function() {
hs.storage.setItem(t.STORAGE_KEY_DATA, this._data);
};
t.prototype.getBlockColor = function(t) {
return this._colorsConfig && this._colorsConfig[t] ? this._colorsConfig[t].colorList : this._editStyle === s.EditStyle.Palette ? this._generateDefaultColorList(t) : null;
};
t.prototype._generateDefaultColorList = function(t) {
var e = this.getColorCommon(t);
return [ e, e, e, e, e, e ];
};
t.prototype.getColorCommon = function(t) {
return {
colorParam: t,
gradientParam: t,
brightness: 1,
contrast: 1,
saturation: 1,
hue: 0,
hueEnabled: 0,
gradientEnabled: 0,
blendModeEnabled: 1,
gradientStrength: .5,
blendMode: 1,
gradientDirection: 90,
gradientType: 0
};
};
t.prototype.getBlockCfg = function() {
var t = this, e = this.getCurrentSkin();
return e ? {
blocks: e.blocks.map(function(e, o) {
return t._getBlocksType(e, o + 1);
}),
substrate: this._getSubstrate()
} : null;
};
t.prototype._getBlocksType = function(t, e) {
return {
colorList: this.getBlockColor(t, e - 1) || [],
rgbaPercentage: [ 0, 0, 0, 0 ],
isShade: 1,
type: 1,
shaderPrefabPath: "",
noShaderPrefabPath: ""
};
};
t.prototype._getSubstrate = function() {
return {
status_one: [ this.getColorCommon("#e0cea3"), this.getColorCommon("#8e6a4a"), this.getColorCommon("#e6cea5"), this.getColorCommon("#b59570"), this.getColorCommon("#d0af83"), this.getColorCommon("#4d2608") ],
status_two: [ this.getColorCommon("#fff9d7"), this.getColorCommon("#9b6e4f"), this.getColorCommon("#f1d3b2"), this.getColorCommon("#bd9c76"), this.getColorCommon("#e5c397"), this.getColorCommon("#4d2608") ],
isShade: 1,
type: 3,
shaderPrefabPath: "",
noShaderPrefabPath: ""
};
};
t.prototype.getProportionColor = function(t, e) {
var o = new cc.Color().fromHEX(t), i = o.r * e.rProportion, n = o.g * e.gProportion, r = o.b * e.bProportion;
i = Math.min(255, Math.max(0, Math.round(i)));
n = Math.min(255, Math.max(0, Math.round(n)));
r = Math.min(255, Math.max(0, Math.round(r)));
return "#" + new cc.Color(i, n, r).toHEX("#rrggbb");
};
t.prototype._deepCopy = function(t) {
return JSON.parse(JSON.stringify(t));
};
t.prototype.getChangeGameBgColorData = function(e) {
var o;
if (e.isPreset) {
var i = this._presetSkinConfigMap.get(e.id);
if (null == i ? void 0 : i.game_bg) return this._deepCopy(i.game_bg);
}
var n, r = e.bg;
r.startsWith("#") || (r = "#" + r);
(n = (null === (o = this._ugcColorTemplate) || void 0 === o ? void 0 : o.game_bg) ? this._deepCopy(this._ugcColorTemplate.game_bg) : {
color: {
colorParam: "#405aa0",
gradientParam: "#374f8f",
brightness: 1,
contrast: 1,
saturation: 1,
hue: 0,
hueEnabled: 0,
gradientEnabled: 1,
blendModeEnabled: 1,
gradientStrength: .5,
blendMode: 1,
gradientDirection: 90,
gradientType: 0
},
opacity: 255,
isShade: 1,
type: 2,
shaderPrefabPath: "prefabs/skin/GameBg/SkinGameBgPrefab",
noShaderPrefabPath: "",
gradientProportion: t.BG_GRADIENT_PROPORTION
}).color.colorParam = r;
var a = n.gradientProportion || t.BG_GRADIENT_PROPORTION;
n.color.gradientParam = this.getProportionColor(r, a);
return n;
};
t.prototype.getChangeBoardBgColorData = function(t) {
var e;
if (t.isPreset) {
var o = this._presetSkinConfigMap.get(t.id);
if (null == o ? void 0 : o.board_bg) return this._deepCopy(o.board_bg);
}
var i, n = t.board;
n.startsWith("#") || (n = "#" + n);
(i = (null === (e = this._ugcColorTemplate) || void 0 === e ? void 0 : e.board_bg) ? this._deepCopy(this._ugcColorTemplate.board_bg) : {
color: {
colorParam: "#242c54",
gradientParam: "#242c54",
brightness: 1,
contrast: 1,
saturation: 1,
hue: 0,
hueEnabled: 0,
gradientEnabled: 0,
blendModeEnabled: 1,
gradientStrength: .5,
blendMode: 1,
gradientDirection: 90,
gradientType: 0
},
opacity: 255,
isShade: 1,
type: 2,
shaderPrefabPath: "prefabs/skin/board/SkinBoardPrefab",
noShaderPrefabPath: "",
gradientProportion: {
rProportion: 1,
gProportion: 1,
bProportion: 1
}
}).color.colorParam = n;
var r = i.gradientProportion || {
rProportion: 1,
gProportion: 1,
bProportion: 1
};
i.color.gradientParam = this.getProportionColor(n, r);
return i;
};
t.prototype.getChangeBoardOutLineColorData = function(e) {
var o;
if (e.isPreset) {
var i = this._presetSkinConfigMap.get(e.id);
if (null == i ? void 0 : i.board_out_line) return this._deepCopy(i.board_out_line);
}
var n, r = e.bg;
r.startsWith("#") || (r = "#" + r);
var a = (n = (null === (o = this._ugcColorTemplate) || void 0 === o ? void 0 : o.board_out_line) ? this._deepCopy(this._ugcColorTemplate.board_out_line) : {
color: {
colorParam: "#304479",
gradientParam: "#304478",
brightness: 1,
contrast: 1,
saturation: 1,
hue: 0,
hueEnabled: 0,
gradientEnabled: 1,
blendModeEnabled: 1,
gradientStrength: .5,
blendMode: 1,
gradientDirection: 90,
gradientType: 0
},
opacity: 255,
isShade: 1,
type: 2,
shaderPrefabPath: "prefabs/skin/board/SkinBoardPrefab",
noShaderPrefabPath: "",
colorProportion: t.BOARD_OUTLINE_COLOR_PROPORTION,
gradientProportion: t.BOARD_OUTLINE_GRADIENT_PROPORTION
}).colorProportion || t.BOARD_OUTLINE_COLOR_PROPORTION;
n.color.colorParam = this.getProportionColor(r, a);
var s = n.gradientProportion || t.BOARD_OUTLINE_GRADIENT_PROPORTION;
n.color.gradientParam = this.getProportionColor(n.color.colorParam, s);
return n;
};
t.prototype.getChangeBoardLineColorData = function(e) {
var o;
if (e.isPreset) {
var i = this._presetSkinConfigMap.get(e.id);
if (null == i ? void 0 : i.board_line) return this._deepCopy(i.board_line);
}
var n, r = e.board;
r.startsWith("#") || (r = "#" + r);
var a = (n = (null === (o = this._ugcColorTemplate) || void 0 === o ? void 0 : o.board_line) ? this._deepCopy(this._ugcColorTemplate.board_line) : {
color: {
colorParam: "#1e264a",
gradientParam: "#1e264a",
brightness: 1,
contrast: 1,
saturation: 1,
hue: 0,
hueEnabled: 0,
gradientEnabled: 0,
blendModeEnabled: 1,
gradientStrength: .5,
blendMode: 1,
gradientDirection: 90,
gradientType: 0
},
opacity: 255,
isShade: 1,
type: 2,
shaderPrefabPath: "prefabs/skin/board/SkinBoardPrefab",
noShaderPrefabPath: "",
colorProportion: t.BOARD_LINE_COLOR_PROPORTION,
gradientProportion: {
rProportion: 1,
gProportion: 1,
bProportion: 1
}
}).colorProportion || t.BOARD_LINE_COLOR_PROPORTION;
n.color.colorParam = this.getProportionColor(r, a);
var s = n.gradientProportion || {
rProportion: 1,
gProportion: 1,
bProportion: 1
};
n.color.gradientParam = this.getProportionColor(n.color.colorParam, s);
return n;
};
t.prototype._getHue = function(t) {
var e = t.r / 255, o = t.g / 255, i = t.b / 255, n = Math.max(e, o, i), r = n - Math.min(e, o, i);
if (0 === r) return 0;
var a;
a = n === e ? (o - i) / r + (o < i ? 6 : 0) : n === o ? (i - e) / r + 2 : (e - o) / r + 4;
return Math.round(a / 6 * 360);
};
t.prototype._getHueLightSaturationValue = function(t) {
var e = t.r / 255, o = t.g / 255, i = t.b / 255, n = Math.max(e, o, i), r = n - Math.min(e, o, i), a = 0, s = 0, l = n;
0 !== n && (s = r / n);
if (0 !== r) {
a = n === e ? (o - i) / r + (o < i ? 6 : 0) : n === o ? (i - e) / r + 2 : (e - o) / r + 4;
a /= 6;
}
return {
hue: Math.round(360 * a),
saturation: s,
light: l
};
};
t.prototype._clamp = function(t, e, o) {
return Math.min(o, Math.max(e, t));
};
t.prototype._getBlockTemplateForHue = function(t) {
return this._ugcColorTemplate ? t < 12.5 ? this._ugcColorTemplate.block5 : t < 37.5 ? this._ugcColorTemplate.block4 : t < 75 ? this._ugcColorTemplate.block2 : t < 152.5 ? this._ugcColorTemplate.block6 : t < 202.5 ? this._ugcColorTemplate.block7 : t < 257.5 ? this._ugcColorTemplate.block1 : t < 317.5 ? this._ugcColorTemplate.block3 : this._ugcColorTemplate.block5 : null;
};
t.prototype._calculateColorByProportion = function(t, e) {
var o = this._clamp(Math.round(t.r * e.rProportion), 0, 255), i = this._clamp(Math.round(t.g * e.gProportion), 0, 255), n = this._clamp(Math.round(t.b * e.bProportion), 0, 255);
return "#" + new cc.Color(o, i, n).toHEX("#rrggbb");
};
t.prototype._createColorCommonFromTemplate = function(t, e, o) {
return o ? i(i({}, o), {
colorParam: t,
gradientParam: e
}) : {
colorParam: t,
gradientParam: e,
brightness: 1,
contrast: 1,
saturation: 1,
hue: 0,
hueEnabled: 0,
gradientEnabled: 1,
blendModeEnabled: 1,
gradientStrength: .5,
blendMode: 1,
gradientDirection: 90,
gradientType: 0
};
};
t.prototype.getChangeBlocksColorData = function(t, e) {
var o, i;
if (t.isPreset) {
var n = this._presetSkinConfigMap.get(t.id);
if (n) {
var r = n["block" + (e + 1)];
if (r) return this._deepCopy(r);
}
}
var a = t.blocks[e];
a.startsWith("#") || (a = "#" + a);
var s = new cc.Color().fromHEX(a), l = this._getHue(s), c = this._getBlockTemplateForHue(l);
if (!c || !c.colorProportion) return this._getChangeBlocksColorDataFallback(a, s);
for (var h = [], d = c.colorProportion, u = c.gradientProportion, p = 0; p < 6; p++) {
var f = this._calculateColorByProportion(s, d[p]), _ = f;
if (u && u[p]) {
var g = new cc.Color().fromHEX(f);
_ = this._calculateColorByProportion(g, u[p]);
}
var C = c.colorList[p];
h.push(this._createColorCommonFromTemplate(f, _, C));
}
return {
colorList: h,
rgbaPercentage: c.rgbaPercentage || [ 0, 0, 0, 0 ],
isShade: null !== (o = c.isShade) && void 0 !== o ? o : 1,
type: null !== (i = c.type) && void 0 !== i ? i : 1,
shaderPrefabPath: c.shaderPrefabPath || "",
noShaderPrefabPath: c.noShaderPrefabPath || ""
};
};
t.prototype._getChangeBlocksColorDataFallback = function(t, e) {
for (var o = [ .15, -.2, -.1, .05, 0, -.25 ], i = [], n = 0; n < 6; n++) {
var r = o[n], a = this._clamp(Math.round(e.r * (1 + r)), 0, 255), s = this._clamp(Math.round(e.g * (1 + r)), 0, 255), l = this._clamp(Math.round(e.b * (1 + r)), 0, 255), c = "#" + new cc.Color(a, s, l).toHEX("#rrggbb"), h = this._clamp(Math.round(.95 * a), 0, 255), d = this._clamp(Math.round(.95 * s), 0, 255), u = this._clamp(Math.round(.95 * l), 0, 255), p = "#" + new cc.Color(h, d, u).toHEX("#rrggbb");
i.push(this._createColorCommonFromTemplate(c, p));
}
return {
colorList: i,
rgbaPercentage: [ 0, 0, 0, 0 ],
isShade: 1,
type: 1,
shaderPrefabPath: "prefabs/skin/block/SkinBlockPrefab",
noShaderPrefabPath: ""
};
};
t.prototype.getChangeClearColorData = function(t, e) {
if (t.isPreset) {
var o = this._presetSkinConfigMap.get(t.id);
if (o) {
var i = o[d = "clear" + (e + 1)];
if (i) return this._deepCopy(i);
}
}
var n = t.blocks[e], r = t.board;
n.startsWith("#") || (n = "#" + n);
r.startsWith("#") || (r = "#" + r);
var a, s = new cc.Color().fromHEX(r), l = (this._getHueLightSaturationValue(s).light - .25) / .75, c = this._clamp(Math.round(80 * l + 70), 0, 255), h = this._clamp(Math.round(50 * l + 20), 0, 255);
if (this._ugcColorTemplate) {
var d = "clear" + (e + 1), u = this._ugcColorTemplate[d];
u && (a = this._deepCopy(u));
}
a || (a = {
colorList: [ {
color: "#008EFF",
opacity: 255
}, {
color: "#2647DB",
opacity: 255
}, {
color: "#0E2A9F",
opacity: 255
} ],
isShade: 0,
type: 4,
shaderPrefabPath: "",
noShaderPrefabPath: "prefabs/skin/eliminate/SkinEliminatePrefab"
});
a.colorList = [ {
color: n,
opacity: 255
}, {
color: n,
opacity: c
}, {
color: n,
opacity: h
} ];
return a;
};
t.prototype.getChangeBlockShadowColorData = function(t) {
var e;
if (t.isPreset) {
var o = this._presetSkinConfigMap.get(t.id);
if (null == o ? void 0 : o.blcokshadow) return this._deepCopy(o.blcokshadow);
}
return (null === (e = this._ugcColorTemplate) || void 0 === e ? void 0 : e.blcokshadow) ? this._deepCopy(this._ugcColorTemplate.blcokshadow) : {
color: {
colorParam: "#000000",
gradientParam: "#000000",
brightness: 1,
contrast: 1,
saturation: 1,
hue: 0,
hueEnabled: 0,
gradientEnabled: 0,
blendModeEnabled: 1,
gradientStrength: .5,
blendMode: 1,
gradientDirection: 90,
gradientType: 0
},
opacity: Math.round(76.5),
isShade: 1,
type: 2,
shaderPrefabPath: "prefabs/skin/block/SkinBlockShadowPrefab",
noShaderPrefabPath: ""
};
};
Object.defineProperty(t.prototype, "ugcColorTemplate", {
get: function() {
return this._ugcColorTemplate;
},
enumerable: !1,
configurable: !0
});
t.prototype.loadUgcColorTemplate = function() {
return n(this, void 0, Promise, function() {
var t = this;
return r(this, function() {
return this._ugcColorTemplate ? [ 2, this._ugcColorTemplate ] : [ 2, new Promise(function(e) {
hs.ResLoader.loadByBundle("SkinUGCTrait", "config/ugc_color_template", cc.JsonAsset, function(o, i) {
if (o) e(null); else {
t._ugcColorTemplate = i.json;
e(t._ugcColorTemplate);
}
});
}) ];
});
});
};
Object.defineProperty(t.prototype, "originalSkinConfig", {
get: function() {
return this._originalSkinConfig;
},
enumerable: !1,
configurable: !0
});
t.prototype.loadOriginalSkinConfig = function() {
return n(this, void 0, Promise, function() {
var t = this;
return r(this, function() {
return this._originalSkinConfig ? [ 2, this._originalSkinConfig ] : [ 2, new Promise(function(e) {
hs.ResLoader.load("configs/skin/default/skin_1000", cc.JsonAsset, function(o, i) {
if (o) e(null); else {
t._originalSkinConfig = i.json;
e(t._originalSkinConfig);
}
});
}) ];
});
});
};
t.prototype.getOriginalSkinConfig = function() {
return this._originalSkinConfig;
};
t.prototype.getUgcColorTemplate = function() {
return this._ugcColorTemplate;
};
t.prototype.getPresetSkinId = function(e) {
return "" + t.PRESET_ID_PREFIX + e;
};
t.prototype.isPresetSkinId = function(e) {
return e.startsWith(t.PRESET_ID_PREFIX);
};
t.prototype.getOriginalIdFromPresetId = function(e) {
if (!this.isPresetSkinId(e)) return null;
var o = e.substring(t.PRESET_ID_PREFIX.length), i = parseInt(o, 10);
return isNaN(i) ? null : i;
};
t.prototype.loadPresetSkinConfigs = function(t) {
return n(this, void 0, Promise, function() {
var e, o, i, n, a = this;
return r(this, function(r) {
switch (r.label) {
case 0:
if (void 0 === t) return [ 3, 2 ];
if (this._presetSkinConfigMap.has(t)) return [ 2 ];
if (null === (e = this.getOriginalIdFromPresetId(t))) return [ 2 ];
this._initPresetSkinToData([ e ]);
return [ 4, this._loadSinglePresetSkinConfig(e) ];

case 1:
r.sent();
return [ 2 ];

case 2:
if (this._presetSkinLoaded) return [ 2 ];
if (!(null == (o = TRAIT("PresetUgcSkinTrait")) ? void 0 : o.active)) return [ 2 ];
if (!(i = o.getPresetSkinIds()) || 0 === i.length) return [ 2 ];
this._initPresetSkinToData(i);
n = i.map(function(t) {
return a._loadSinglePresetSkinConfig(t);
});
return [ 4, Promise.all(n) ];

case 3:
r.sent();
this._presetSkinLoaded = !0;
return [ 2 ];
}
});
});
};
t.prototype._initPresetSkinToData = function(t) {
if (t && 0 !== t.length) {
for (var e = function(e) {
var i = t[e], n = o.getPresetSkinId(i);
if (-1 !== o._data.findIndex(function(t) {
return t.id === n;
})) return "continue";
var r = o._createPresetUGCData(i);
o._data.unshift(r);
}, o = this, i = t.length - 1; i >= 0; i--) e(i);
this._saveData();
}
};
t.prototype._createPresetUGCData = function(t) {
for (var e = this.getPresetSkinId(t), o = [], i = 1; i <= 7; i++) o.push(t + "_" + i);
return {
id: e,
blocks: o,
bg: "",
board: "",
isPreset: !0
};
};
t.prototype._loadSinglePresetSkinConfig = function(t) {
var e = this;
return new Promise(function(o) {
var i = "configs/skin/default/skin_" + t;
hs.ResLoader.load(i, cc.JsonAsset, function(i, n) {
if (i) o(); else {
var r = e.getPresetSkinId(t), a = n.json;
e._presetSkinConfigMap.set(r, a);
o();
}
});
});
};
t.prototype.getPresetSkinConfigById = function(t) {
return this._presetSkinConfigMap.get(t) || null;
};
t.prototype.getAllPresetSkinIds = function() {
return Array.from(this._presetSkinConfigMap.keys());
};
t.prototype.getPresetSkinCount = function() {
return this._presetSkinConfigMap.size;
};
t.prototype.convertPresetToUGCData = function(t) {
var e, o, i, n, r, a, s = this.getPresetSkinConfigById(t);
if (!s) return null;
for (var l = [], c = 1; c <= 7; c++) {
var h = s["block" + c];
(null === (o = null === (e = null == h ? void 0 : h.colorList) || void 0 === e ? void 0 : e[4]) || void 0 === o ? void 0 : o.colorParam) ? l.push(h.colorList[4].colorParam) : l.push("#ffffff");
}
return {
id: t,
blocks: l,
bg: (null === (n = null === (i = s.game_bg) || void 0 === i ? void 0 : i.color) || void 0 === n ? void 0 : n.colorParam) || "#364c87",
board: (null === (a = null === (r = s.board_bg) || void 0 === r ? void 0 : r.color) || void 0 === a ? void 0 : a.colorParam) || "#1d2445",
isPreset: !0
};
};
t.prototype.getAllPresetUGCData = function() {
var t, e, o = [];
try {
for (var i = a(this._presetSkinConfigMap.keys()), n = i.next(); !n.done; n = i.next()) {
var r = n.value, s = this.convertPresetToUGCData(r);
s && o.push(s);
}
} catch (e) {
t = {
error: e
};
} finally {
try {
n && !n.done && (e = i.return) && e.call(i);
} finally {
if (t) throw t.error;
}
}
return o;
};
t.prototype.getUgcTemplateBlockConfig = function(t) {
if (!this._ugcColorTemplate) return null;
var e = "block" + t;
return this._ugcColorTemplate[e] || null;
};
t.prototype.convertUGCDataToSkinConfig = function(t) {
var e, o, i, n, r, a, s;
if (!this._originalSkinConfig) return null;
var l = this._deepCopy(this._originalSkinConfig);
l.game_bg = this.getChangeGameBgColorData(t);
l.board_bg = this.getChangeBoardBgColorData(t);
l.board_out_line = this.getChangeBoardOutLineColorData(t);
l.board_line = this.getChangeBoardLineColorData(t);
if (t.blocks[0] && !(null === (e = t.blocksDelete) || void 0 === e ? void 0 : e[0])) {
l.block1 = this.getChangeBlocksColorData(t, 0);
l.clear1 = this.getChangeClearColorData(t, 0);
}
if (t.blocks[1] && !(null === (o = t.blocksDelete) || void 0 === o ? void 0 : o[1])) {
l.block2 = this.getChangeBlocksColorData(t, 1);
l.clear2 = this.getChangeClearColorData(t, 1);
}
if (t.blocks[2] && !(null === (i = t.blocksDelete) || void 0 === i ? void 0 : i[2])) {
l.block3 = this.getChangeBlocksColorData(t, 2);
l.clear3 = this.getChangeClearColorData(t, 2);
}
if (t.blocks[3] && !(null === (n = t.blocksDelete) || void 0 === n ? void 0 : n[3])) {
l.block4 = this.getChangeBlocksColorData(t, 3);
l.clear4 = this.getChangeClearColorData(t, 3);
}
if (t.blocks[4] && !(null === (r = t.blocksDelete) || void 0 === r ? void 0 : r[4])) {
l.block5 = this.getChangeBlocksColorData(t, 4);
l.clear5 = this.getChangeClearColorData(t, 4);
}
if (t.blocks[5] && !(null === (a = t.blocksDelete) || void 0 === a ? void 0 : a[5])) {
l.block6 = this.getChangeBlocksColorData(t, 5);
l.clear6 = this.getChangeClearColorData(t, 5);
}
if (t.blocks[6] && !(null === (s = t.blocksDelete) || void 0 === s ? void 0 : s[6])) {
l.block7 = this.getChangeBlocksColorData(t, 6);
l.clear7 = this.getChangeClearColorData(t, 6);
}
l.blcokshadow = this.getChangeBlockShadowColorData(t);
return l;
};
t.prototype.getGameType = function() {
var t;
return "journey" === (null === (t = hs.gameInfo) || void 0 === t ? void 0 : t.gameMode) ? 2 : 0;
};
t.prototype.getBg = function(t, e) {
return t.bg === e.bg ? "-1" : t.bg;
};
t.prototype.getBoard = function(t, e) {
return t.board === e.board ? "-1" : t.board;
};
t.prototype.getBlocks = function(t, e) {
for (var o = [], i = 0; i < t.blocks.length; i++) t.blocksDelete && t.blocksDelete[i] || (t.blocks[i] === e.blocks[i] ? o.push("-1") : o.push(t.blocks[i]));
return o;
};
t.STORAGE_KEY_DATA = "skinUGC_data";
t.STORAGE_KEY_ENTERED = "skinUGC_enteredEdit";
t.BG_GRADIENT_PROPORTION = {
rProportion: .859375,
gProportion: .8777777777777778,
bProportion: .89375
};
t.BOARD_OUTLINE_COLOR_PROPORTION = {
rProportion: .75,
gProportion: .7555555555555555,
bProportion: .75625
};
t.BOARD_OUTLINE_GRADIENT_PROPORTION = {
rProportion: 1,
gProportion: 1,
bProportion: .9917355371900827
};
t.BOARD_LINE_COLOR_PROPORTION = {
rProportion: .8333333333333334,
gProportion: .8636363636363636,
bProportion: .8809523809523809
};
t.PRESET_ID_PREFIX = "preset_";
return t;
}();
o.skinUGCInfo = new l();
cc._RF.pop();
}, {
"./SkinUGCType": "SkinUGCType"
} ],
SkinUGCItem: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "289c6vhk91KXrxG0fuI6JKF", "SkinUGCItem");
var i, n = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
i(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), r = this && this.__decorate || function(t, e, o, i) {
var n, r = arguments.length, a = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, o) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, o, i); else for (var s = t.length - 1; s >= 0; s--) (n = t[s]) && (a = (r < 3 ? n(a) : r > 3 ? n(e, o, a) : n(e, o)) || a);
return r > 3 && a && Object.defineProperty(e, o, a), a;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = t("../scripts/SkinUGCInfo"), s = t("./SkinUGCList"), l = cc._decorator, c = l.ccclass, h = l.property, d = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.addNd = null;
e.redDot = null;
e.itemNd = null;
e.gameBg = null;
e.boardFrame = null;
e.boardLine = null;
e.board = null;
e.blockBg = null;
e.blocks = [];
e.noShaderBlocks = [];
e.selectNd = null;
e.editNd = null;
e.useNd = null;
e.useSp = null;
e.usedSp = null;
e.unusedSp = null;
e._data = null;
return e;
}
e.prototype.start = function() {
var t;
if (null === (t = TRAIT("SkinUGCUseBtnTrait")) || void 0 === t ? void 0 : t.active) {
this.useNd && (this.useNd.active = !0);
this.editNd && (this.editNd.active = !1);
} else {
this.useNd && (this.useNd.active = !1);
this.editNd && (this.editNd.active = !0);
}
};
e.prototype.render = function() {
this.addNd && (this.addNd.active = this.state.isAddItem || !1);
this.itemNd && (this.itemNd.active = !this.state.isAddItem);
this.selectNd && (this.selectNd.active = this.state.isSelected || !1);
this.useSp && (this.useSp.spriteFrame = this.state.isSelected ? this.usedSp : this.unusedSp);
};
e.prototype.renderItem = function(t) {
var e;
this._data = t;
if (t) {
this.node.active = !0;
var o = a.skinUGCInfo.isCurrentSkinUGC() && (null === (e = a.skinUGCInfo.getCurrentSkin()) || void 0 === e ? void 0 : e.id) === t.id;
this.setState({
isAddItem: !1,
isSelected: o
});
this._updateColorPreview(t);
} else {
this.setState({
isAddItem: !0,
isSelected: !1
});
this.redDot && (this.redDot.active = !a.skinUGCInfo.enteredEdit);
}
};
e.prototype._updateColorPreview = function(t) {
var e, o = a.skinUGCInfo.getChangeGameBgColorData(t), i = a.skinUGCInfo.getChangeBoardOutLineColorData(t), n = a.skinUGCInfo.getChangeBoardBgColorData(t), r = a.skinUGCInfo.getChangeBoardLineColorData(t);
this.gameBg && o && (this.gameBg.node.color = cc.color().fromHEX(o.color.colorParam));
this.boardFrame && i && (this.boardFrame.node.color = cc.color().fromHEX(i.color.colorParam));
this.boardLine && r && (this.boardLine.node.color = cc.color().fromHEX(r.color.colorParam));
this.board && n && (this.board.node.color = cc.color().fromHEX(n.color.colorParam));
this.blockBg && r && (this.blockBg.node.color = cc.color().fromHEX(r.color.colorParam));
for (var s = 0; s < t.blocks.length; s++) {
var l = null === (e = a.skinUGCInfo.getChangeBlocksColorData(t, s)) || void 0 === e ? void 0 : e.colorList;
if (l && 0 !== l.length) {
var c = hs.skinAtlas.getBlockSpriteFrame(l[4].colorParam, s + 1);
if (c) {
this.noShaderBlocks[s].spriteFrame = c;
this.noShaderBlocks[s].node.active = !0;
this.blocks[s].node.active = !1;
} else {
this.noShaderBlocks[s].node.active = !1;
this.blocks[s].node.active = !0;
this.blocks[s].setMaterial(!0);
this.blocks[s].setAllParams(s, l);
}
}
}
};
e.prototype._findListComponent = function() {
for (var t = this.node.parent; t; ) {
var e = t.getComponent(s.default);
if (e) return e;
t = t.parent;
}
return null;
};
e.prototype.onClickAdd = function() {
var t = this._findListComponent();
t && t.onClickAdd();
};
e.prototype.onClickEdit = function() {
var t = this._findListComponent();
t && t.onClickEdit(this._data);
};
e.prototype.onClickItem = function() {
var t = this._findListComponent();
t && t.onClickItem(this._data);
};
r([ h(cc.Node) ], e.prototype, "addNd", void 0);
r([ h(cc.Node) ], e.prototype, "redDot", void 0);
r([ h(cc.Node) ], e.prototype, "itemNd", void 0);
r([ h(cc.Sprite) ], e.prototype, "gameBg", void 0);
r([ h(cc.Sprite) ], e.prototype, "boardFrame", void 0);
r([ h(cc.Sprite) ], e.prototype, "boardLine", void 0);
r([ h(cc.Sprite) ], e.prototype, "board", void 0);
r([ h(cc.Sprite) ], e.prototype, "blockBg", void 0);
r([ h([ hs.BlockMaterialUpdate ]) ], e.prototype, "blocks", void 0);
r([ h([ cc.Sprite ]) ], e.prototype, "noShaderBlocks", void 0);
r([ h(cc.Node) ], e.prototype, "selectNd", void 0);
r([ h(cc.Node) ], e.prototype, "editNd", void 0);
r([ h(cc.Node) ], e.prototype, "useNd", void 0);
r([ h(cc.Sprite) ], e.prototype, "useSp", void 0);
r([ h(cc.SpriteFrame) ], e.prototype, "usedSp", void 0);
r([ h(cc.SpriteFrame) ], e.prototype, "unusedSp", void 0);
return r([ c ], e);
}(hs.Component);
o.default = d;
cc._RF.pop();
}, {
"../scripts/SkinUGCInfo": "SkinUGCInfo",
"./SkinUGCList": "SkinUGCList"
} ],
SkinUGCList: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "bdc7ejd3YxACotA9sFyOx0C", "SkinUGCList");
var i, n = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
i(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), r = this && this.__decorate || function(t, e, o, i) {
var n, r = arguments.length, a = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, o) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, o, i); else for (var s = t.length - 1; s >= 0; s--) (n = t[s]) && (a = (r < 3 ? n(a) : r > 3 ? n(e, o, a) : n(e, o)) || a);
return r > 3 && a && Object.defineProperty(e, o, a), a;
}, a = this && this.__awaiter || function(t, e, o, i) {
return new (o || (o = Promise))(function(n, r) {
function a(t) {
try {
l(i.next(t));
} catch (t) {
r(t);
}
}
function s(t) {
try {
l(i.throw(t));
} catch (t) {
r(t);
}
}
function l(t) {
t.done ? n(t.value) : (e = t.value, e instanceof o ? e : new o(function(t) {
t(e);
})).then(a, s);
var e;
}
l((i = i.apply(t, e || [])).next());
});
}, s = this && this.__generator || function(t, e) {
var o, i, n, r, a = {
label: 0,
sent: function() {
if (1 & n[0]) throw n[1];
return n[1];
},
trys: [],
ops: []
};
return r = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function s(t) {
return function(e) {
return l([ t, e ]);
};
}
function l(r) {
if (o) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (o = 1, i && (n = 2 & r[0] ? i.return : r[0] ? i.throw || ((n = i.return) && n.call(i), 
0) : i.next) && !(n = n.call(i, r[1])).done) return n;
(i = 0, n) && (r = [ 2 & r[0], n.value ]);
switch (r[0]) {
case 0:
case 1:
n = r;
break;

case 4:
a.label++;
return {
value: r[1],
done: !1
};

case 5:
a.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(n = a.trys, n = n.length > 0 && n[n.length - 1]) && (6 === r[0] || 2 === r[0])) {
a = 0;
continue;
}
if (3 === r[0] && (!n || r[1] > n[0] && r[1] < n[3])) {
a.label = r[1];
break;
}
if (6 === r[0] && a.label < n[1]) {
a.label = n[1];
n = r;
break;
}
if (n && a.label < n[2]) {
a.label = n[2];
a.ops.push(r);
break;
}
n[2] && a.ops.pop();
a.trys.pop();
continue;
}
r = e.call(t, a);
} catch (t) {
r = [ 6, t ];
i = 0;
} finally {
o = n = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
}, l = this && this.__read || function(t, e) {
var o = "function" == typeof Symbol && t[Symbol.iterator];
if (!o) return t;
var i, n, r = o.call(t), a = [];
try {
for (;(void 0 === e || e-- > 0) && !(i = r.next()).done; ) a.push(i.value);
} catch (t) {
n = {
error: t
};
} finally {
try {
i && !i.done && (o = r.return) && o.call(r);
} finally {
if (n) throw n.error;
}
}
return a;
}, c = this && this.__spread || function() {
for (var t = [], e = 0; e < arguments.length; e++) t = t.concat(l(arguments[e]));
return t;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
var h = t("../scripts/SkinUGCInfo"), d = t("./SkinUGCItem"), u = cc._decorator, p = u.ccclass, f = u.property, _ = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.contentNd = null;
e.bg = null;
e.virtualList = null;
return e;
}
e.prototype.start = function() {
return a(this, void 0, Promise, function() {
return s(this, function(t) {
switch (t.label) {
case 0:
this.node.active = !1;
this.contentNd && hs.applyAdapterFringe(this.contentNd);
this._sendExposureData();
return this.virtualList ? [ 4, this.virtualList.init({
prefabUrl: "prefabs/SkinUGCItem",
bundleName: "SkinUGCTrait",
itemHeight: 140,
itemComponent: d.default,
bufferCount: 2
}) ] : [ 3, 2 ];

case 1:
t.sent();
t.label = 2;

case 2:
this.refresh();
return [ 2 ];
}
});
});
};
e.prototype.render = function() {
this.virtualList && this.state.dataList && this.virtualList.setState({
dataSource: c(this.state.dataList)
});
this._adjustBgHeight();
};
e.prototype.refresh = function() {
this.node.active = !0;
var t = this._getMaxNum(), e = h.skinUGCInfo.data.slice(0, t).reverse(), o = c(e);
o.length < t && o.unshift(null);
this.setState({
dataList: o
});
};
e.prototype._getMaxNum = function() {
return 15;
};
e.prototype._adjustBgHeight = function() {
var t, e, o, i;
if (this.bg && this.virtualList) {
if (((null === (t = this.state.dataList) || void 0 === t ? void 0 : t.length) || 0) <= 6) {
var n = (null === (o = null === (e = this.virtualList.scrollView) || void 0 === e ? void 0 : e.content) || void 0 === o ? void 0 : o.height) || 0;
this.bg.height = 90 + n;
this.virtualList.scrollView.enabled = !1;
} else {
this.bg.height = 969;
this.virtualList.scrollView.enabled = !0;
}
(null === (i = this.virtualList.scrollView) || void 0 === i ? void 0 : i.node) && (this.virtualList.scrollView.node.height = this.bg.height);
}
};
e.prototype.onClickAdd = function() {
DS("usr_data_skin_ugc_setting_add", {
GameType: h.skinUGCInfo.getGameType(),
skin_num: h.skinUGCInfo.data.length
});
var t = TRAIT("SkinUGCTrait");
(null == t ? void 0 : t.active) && t.openEdit(h.skinUGCInfo.getDefaultSkin());
};
e.prototype.onClickEdit = function(t) {
if (!t.isPreset) {
var e = TRAIT("SkinUGCTrait");
(null == e ? void 0 : e.active) && e.openEdit(t);
this.node.active = !1;
}
};
e.prototype.onClickItem = function(t) {
var e = this, o = h.skinUGCInfo.getDefaultSkin(), i = TRAIT("SkinUGCTrait"), n = h.skinUGCInfo.extractBaseId(h.skinUGCInfo.getCurrentSkinId());
if (t.id === n) {
null == i || i.dispatchSkinUpdate(hs.skinInfo.originSkinId, function() {
e.refresh();
});
DS("usr_data_skin_ugc_setting_cancel", {
GameType: h.skinUGCInfo.getGameType(),
background: h.skinUGCInfo.getBg(t, o),
board: h.skinUGCInfo.getBoard(t, o),
block: h.skinUGCInfo.getBlocks(t, o)
});
} else {
var r = h.skinUGCInfo.isCurrentSkinUGC() ? 1 : 0;
DS("usr_data_skin_ugc_setting_use", {
GameType: h.skinUGCInfo.getGameType(),
background: h.skinUGCInfo.getBg(t, o),
board: h.skinUGCInfo.getBoard(t, o),
block: h.skinUGCInfo.getBlocks(t, o),
status: r
});
null == i || i.dispatchSkinUpdate(t.id, function() {
e.refresh();
});
}
};
e.prototype.onClickClose = function() {
this._destroyNode();
};
e.prototype._destroyNode = function() {
var t = this;
if (this.node && cc.isValid(this.node)) {
cc.Tween.stopAllByTarget(this.node);
cc.director.once(cc.Director.EVENT_AFTER_UPDATE, function() {
t.node && cc.isValid(t.node) && t.node.destroy();
});
}
};
e.prototype._sendExposureData = function() {
DS("usr_data_skin_ugc_setting_exp", {
GameType: h.skinUGCInfo.getGameType(),
skin_num: h.skinUGCInfo.data.length
});
};
r([ f(cc.Node) ], e.prototype, "contentNd", void 0);
r([ f(cc.Node) ], e.prototype, "bg", void 0);
r([ f(hs.VirtualList) ], e.prototype, "virtualList", void 0);
r([ hs.throttle(500) ], e.prototype, "onClickAdd", null);
r([ hs.throttle(500) ], e.prototype, "onClickEdit", null);
r([ hs.throttle(500) ], e.prototype, "onClickItem", null);
r([ hs.throttle(500) ], e.prototype, "onClickClose", null);
return r([ p ], e);
}(hs.Component);
o.default = _;
cc._RF.pop();
}, {
"../scripts/SkinUGCInfo": "SkinUGCInfo",
"./SkinUGCItem": "SkinUGCItem"
} ],
SkinUGCTrait: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "56035WccA9JyqpXJ9BN4Rng", "SkinUGCTrait");
var i, n = this && this.__extends || (i = function(t, e) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
})(t, e);
}, function(t, e) {
i(t, e);
function o() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (o.prototype = e.prototype, new o());
}), r = this && this.__decorate || function(t, e, o, i) {
var n, r = arguments.length, a = r < 3 ? e : null === i ? i = Object.getOwnPropertyDescriptor(e, o) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, o, i); else for (var s = t.length - 1; s >= 0; s--) (n = t[s]) && (a = (r < 3 ? n(a) : r > 3 ? n(e, o, a) : n(e, o)) || a);
return r > 3 && a && Object.defineProperty(e, o, a), a;
}, a = this && this.__awaiter || function(t, e, o, i) {
return new (o || (o = Promise))(function(n, r) {
function a(t) {
try {
l(i.next(t));
} catch (t) {
r(t);
}
}
function s(t) {
try {
l(i.throw(t));
} catch (t) {
r(t);
}
}
function l(t) {
t.done ? n(t.value) : (e = t.value, e instanceof o ? e : new o(function(t) {
t(e);
})).then(a, s);
var e;
}
l((i = i.apply(t, e || [])).next());
});
}, s = this && this.__generator || function(t, e) {
var o, i, n, r, a = {
label: 0,
sent: function() {
if (1 & n[0]) throw n[1];
return n[1];
},
trys: [],
ops: []
};
return r = {
next: s(0),
throw: s(1),
return: s(2)
}, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
return this;
}), r;
function s(t) {
return function(e) {
return l([ t, e ]);
};
}
function l(r) {
if (o) throw new TypeError("Generator is already executing.");
for (;a; ) try {
if (o = 1, i && (n = 2 & r[0] ? i.return : r[0] ? i.throw || ((n = i.return) && n.call(i), 
0) : i.next) && !(n = n.call(i, r[1])).done) return n;
(i = 0, n) && (r = [ 2 & r[0], n.value ]);
switch (r[0]) {
case 0:
case 1:
n = r;
break;

case 4:
a.label++;
return {
value: r[1],
done: !1
};

case 5:
a.label++;
i = r[1];
r = [ 0 ];
continue;

case 7:
r = a.ops.pop();
a.trys.pop();
continue;

default:
if (!(n = a.trys, n = n.length > 0 && n[n.length - 1]) && (6 === r[0] || 2 === r[0])) {
a = 0;
continue;
}
if (3 === r[0] && (!n || r[1] > n[0] && r[1] < n[3])) {
a.label = r[1];
break;
}
if (6 === r[0] && a.label < n[1]) {
a.label = n[1];
n = r;
break;
}
if (n && a.label < n[2]) {
a.label = n[2];
a.ops.push(r);
break;
}
n[2] && a.ops.pop();
a.trys.pop();
continue;
}
r = e.call(t, a);
} catch (t) {
r = [ 6, t ];
i = 0;
} finally {
o = n = 0;
}
if (5 & r[0]) throw r[1];
return {
value: r[0] ? r[1] : void 0,
done: !0
};
}
}, l = this && this.__read || function(t, e) {
var o = "function" == typeof Symbol && t[Symbol.iterator];
if (!o) return t;
var i, n, r = o.call(t), a = [];
try {
for (;(void 0 === e || e-- > 0) && !(i = r.next()).done; ) a.push(i.value);
} catch (t) {
n = {
error: t
};
} finally {
try {
i && !i.done && (o = r.return) && o.call(r);
} finally {
if (n) throw n.error;
}
}
return a;
}, c = this && this.__spread || function() {
for (var t = [], e = 0; e < arguments.length; e++) t = t.concat(l(arguments[e]));
return t;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.SkinUGCTrait = void 0;
var h = t("../components/SkinUGCBtn"), d = t("../components/SkinUGCDelete"), u = t("../components/SkinUGCEdit"), p = t("../components/SkinUGCList"), f = t("./SkinUGCInfo"), _ = t("./SkinUGCType"), g = function(t) {
n(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._loadingList = !1;
e._loadingEdit = !1;
e._loadingDelete = !1;
e._btnNode = null;
e._btnAdded = !1;
e._assetLoaded = !1;
e._lastDispatchedSkinId = "1000";
return e;
}
o = e;
Object.defineProperty(e.prototype, "editStyle", {
get: function() {
var t;
return (null === (t = this.props) || void 0 === t ? void 0 : t.style) || _.EditStyle.Tile1;
},
enumerable: !1,
configurable: !0
});
e.prototype.isCurrentSkinUGC = function() {
return f.skinUGCInfo.isCurrentSkinUGC();
};
e.prototype.init = function() {
var t = this;
f.skinUGCInfo.init();
f.skinUGCInfo.editStyle = this.editStyle;
f.skinUGCInfo.loadAsset(this.editStyle !== _.EditStyle.Palette).then(function() {
t._assetLoaded = !0;
});
};
e.prototype.preLoadRes = function() {
var t = function(t) {
return new Promise(function(e, i) {
hs.ResLoader.loadByBundle(o.BUNDLE_NAME, t, cc.Prefab, function(o, n) {
o || !n ? i(o || new Error("Prefab not found: " + t)) : e(n);
});
});
};
Promise.all([ t(o.PREFAB_BTN).then(function() {}).catch(function() {}), t(o.PREFAB_ITEM).then(function() {}).catch(function() {}) ]).catch(function() {});
};
e.prototype.onCreate = function() {
this.init();
this.preLoadRes();
};
e.prototype.onActive = function(t) {
var e = this;
if (hs.tp.isClassTopInfoInitCompelte(t)) {
var o = t.args[0];
cc.isValid(o) && this._addGameBtn(o);
}
if (hs.tp.isChapterTopInfoBtnInitCompelte(t)) {
o = t.args[0];
cc.isValid(o) && this._addGameBtn(o);
}
if (hs.tp.isSkin_ProxyLoadSkinInfoConfig(t)) {
var i = t.args[0], n = f.skinUGCInfo.getSkinById(i);
if (n) {
t.replace = !0;
t.returnValue = new Promise(function(t) {
return a(e, void 0, void 0, function() {
var e, o;
return s(this, function(i) {
switch (i.label) {
case 0:
e = [ f.skinUGCInfo.loadUgcColorTemplate(), f.skinUGCInfo.loadOriginalSkinConfig() ];
n.isPreset && e.push(f.skinUGCInfo.loadPresetSkinConfigs(n.id));
return [ 4, Promise.all(e) ];

case 1:
i.sent();
o = f.skinUGCInfo.convertUGCDataToSkinConfig(n);
t({
json: o
});
return [ 2 ];
}
});
});
});
}
}
if (hs.tp.isSkin_ProxyIsValidSkinId(t)) {
var r = f.skinUGCInfo.getAllSkinIds(), l = t.args[1] || [];
t.args[1] = c(l, r);
}
(hs.tp.isSkinUGC_ProxyOnCloseChapterGame(t) || hs.tp.isSkinUGC_ProxyOnCloseClassGame(t) || hs.tp.isSkinUGC_ProxyOnGameEnd(t)) && this._hideSkinList();
if (hs.tp.isSkinAtlasChangeBlockParent(t) || hs.tp.isSkinAtlasGetBlockRenderRootNode(t)) {
var h = this.getOrCreateNodeInScene("SkinUGCTrait_BlockRTT");
cc.isValid(h) && (t.returnValue = h);
}
if (hs.tp.isSkinAtlasChangeBoardParent(t) || hs.tp.isSkinAtlasGetBoardRenderRootNode(t)) {
h = this.getOrCreateNodeInScene("SkinUGCTrait_BoardRTT");
cc.isValid(h) && (t.returnValue = h);
}
if (hs.tp.isSkinAtlasChangeBgParent(t) || hs.tp.isSkinAtlasGetBgRenderRootNode(t)) {
h = this.getOrCreateNodeInScene("SkinUGCTrait_BgRTT");
cc.isValid(h) && (t.returnValue = h);
}
};
e.prototype.getOrCreateNodeInScene = function(t) {
var e = cc.director.getScene();
if (cc.isValid(e)) {
var o = e.getChildByName(t);
if (!cc.isValid(o)) {
(o = new cc.Node(t)).zIndex = cc.macro.MAX_ZINDEX;
e.addChild(o);
}
return o;
}
};
e.prototype._hideSkinList = function() {
var t = hs.gameAlertLayer;
if (cc.isValid(t)) {
var e = t.getChildByName("SkinUGCList");
if (cc.isValid(e)) {
var o = e.getComponent(p.default);
cc.isValid(o) && o.onClickClose();
}
}
};
e.prototype._addGameBtn = function(t) {
var e = this, i = t.parent;
if (cc.isValid(i) && !cc.isValid(i.getChildByName("SkinUGCBtn"))) {
this._btnAdded = !0;
hs.ResLoader.loadByBundle(o.BUNDLE_NAME, o.PREFAB_BTN, cc.Prefab, function(o, n) {
if (o) ; else if (cc.isValid(i) && cc.isValid(t) && !cc.isValid(i.getChildByName("SkinUGCBtn"))) {
var r = cc.instantiate(n);
r.name = "SkinUGCBtn";
r.x = t.x - 65;
var a = t.getComponent(cc.Widget), s = r.getComponent(cc.Widget);
s && a && (s.top = a.top + 22);
i.addChild(r);
e._btnNode = r;
}
});
}
};
e.prototype.openSkinList = function() {
var t = this;
if (!this._loadingList) {
var e = hs.gameAlertLayer;
if (cc.isValid(e)) {
var i = e.getChildByName("SkinUGCList");
if (cc.isValid(i)) {
i.active = !0;
var n = i.getComponent(p.default);
cc.isValid(n) && n.refresh();
} else {
this._loadingList = !0;
hs.ResLoader.loadByBundle(o.BUNDLE_NAME, o.PREFAB_LIST, cc.Prefab, function(o, i) {
return a(t, void 0, void 0, function() {
var t;
return s(this, function(n) {
switch (n.label) {
case 0:
return [ 4, Promise.all([ f.skinUGCInfo.loadUgcColorTemplate(), f.skinUGCInfo.loadOriginalSkinConfig(), f.skinUGCInfo.loadPresetSkinConfigs() ]) ];

case 1:
n.sent();
this._loadingList = !1;
if (o) return [ 2 ];
if (!cc.isValid(e)) return [ 2 ];
if (cc.isValid(e.getChildByName("SkinUGCList"))) return [ 2 ];
t = cc.instantiate(i);
e.addChild(t);
return [ 2 ];
}
});
});
});
}
}
}
};
e.prototype.openEdit = function(t) {
var e = this;
if (!this._loadingEdit) {
var i = hs.gameAlertLayer;
if (cc.isValid(i)) {
this._loadingEdit = !0;
hs.ResLoader.loadByBundle(o.BUNDLE_NAME, o.PREFAB_EDIT, cc.Prefab, function(o, n) {
e._loadingEdit = !1;
if (o) ; else if (cc.isValid(i)) {
var r = cc.instantiate(n), a = r.getComponent(u.default);
cc.isValid(a) && a.show(t);
i.addChild(r);
}
});
}
}
};
e.prototype.openDelete = function(t) {
var e = this;
if (!this._loadingDelete) {
var i = hs.alertLayer;
if (cc.isValid(i) && !cc.isValid(i.getChildByName("SkinUGCDelete"))) {
this._loadingDelete = !0;
hs.ResLoader.loadByBundle(o.BUNDLE_NAME, o.PREFAB_DELETE, cc.Prefab, function(o, n) {
e._loadingDelete = !1;
if (o) ; else if (cc.isValid(i) && !cc.isValid(i.getChildByName("SkinUGCDelete"))) {
var r = cc.instantiate(n), a = r.getComponent(d.default);
a && a.show(t);
i.addChild(r);
}
});
}
}
};
e.prototype.dispatchSkinUpdate = function(t, e) {
var o = f.skinUGCInfo.getSkinById(t), i = o ? f.skinUGCInfo.getVersionedSkinId(o) : t;
hs.EventManager.dispatchModuleEvent(new hs.E_Skin_Update(i, e));
this._lastDispatchedSkinId = i;
};
e.prototype.refreshBtn = function() {
if (cc.isValid(this._btnNode)) {
var t = this._btnNode.getComponent(h.default);
cc.isValid(t) && t.refreshRedDot();
}
};
var o;
e.BUNDLE_NAME = "SkinUGCTrait";
e.PREFAB_BTN = "prefabs/SkinUGCBtn";
e.PREFAB_LIST = "prefabs/SkinUGCList";
e.PREFAB_ITEM = "prefabs/SkinUGCItem";
e.PREFAB_EDIT = "prefabs/SkinUGCEdit";
e.PREFAB_DELETE = "prefabs/SkinUGCDelete";
r([ hs.storageProperty({
key: "SkinUGCTrait_lastDispatchedSkinId"
}) ], e.prototype, "_lastDispatchedSkinId", void 0);
return o = r([ classId("SkinUGCTrait") ], e);
}(Trait);
o.SkinUGCTrait = g;
cc._RF.pop();
}, {
"../components/SkinUGCBtn": "SkinUGCBtn",
"../components/SkinUGCDelete": "SkinUGCDelete",
"../components/SkinUGCEdit": "SkinUGCEdit",
"../components/SkinUGCList": "SkinUGCList",
"./SkinUGCInfo": "SkinUGCInfo",
"./SkinUGCType": "SkinUGCType"
} ],
SkinUGCType: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "a2057SpR49FNYPHNRHdun9W", "SkinUGCType");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.EditStyle = void 0;
(function(t) {
t[t.Tile1 = 1] = "Tile1";
t[t.Tile2 = 2] = "Tile2";
t[t.Palette = 3] = "Palette";
})(o.EditStyle || (o.EditStyle = {}));
cc._RF.pop();
}, {} ]
}, {}, [ "SkinEditItem", "SkinUGCBtn", "SkinUGCDelete", "SkinUGCEdit", "SkinUGCItem", "SkinUGCList", "ColorTools", "HueTools", "LightAndSaturationTools", "SkinUGCInfo", "SkinUGCTrait", "SkinUGCType" ]);
//# sourceMappingURL=index.js.map
