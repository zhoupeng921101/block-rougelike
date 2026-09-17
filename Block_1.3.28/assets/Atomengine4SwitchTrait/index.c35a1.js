window.__require = function e(t, n, i) {
function o(a, c) {
if (!n[a]) {
if (!t[a]) {
var s = a.split("/");
s = s[s.length - 1];
if (!t[s]) {
var u = "function" == typeof __require && __require;
if (!c && u) return u(s, !0);
if (r) return r(s, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = s;
}
var h = n[a] = {
exports: {}
};
t[a][0].call(h.exports, function(e) {
return o(t[a][1][e] || e);
}, h, h.exports, e, t, n, i);
}
return n[a].exports;
}
for (var r = "function" == typeof __require && __require, a = 0; a < i.length; a++) o(i[a]);
return o;
}({
Atomengine4SwitchTrait: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "b7a10F7xP1Bv4a5WKzBKssi", "Atomengine4SwitchTrait");
var i, o = this && this.__extends || (i = function(e, t) {
return (i = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
i(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), r = this && this.__decorate || function(e, t, n, i) {
var o, r = arguments.length, a = r < 3 ? t : null === i ? i = Object.getOwnPropertyDescriptor(t, n) : i;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, i); else for (var c = e.length - 1; c >= 0; c--) (o = e[c]) && (a = (r < 3 ? o(a) : r > 3 ? o(t, n, a) : o(t, n)) || a);
return r > 3 && a && Object.defineProperty(t, n, a), a;
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.Atomengine4SwitchTrait = void 0;
var a = function(e) {
o(t, e);
function t() {
return e.call(this) || this;
}
t.prototype.registerTraitEventsMethods = function() {
return [];
};
t.prototype.onCreate = function() {};
t.prototype.onEnable = function() {};
t.prototype.onActive = function(e) {
if (hs.tp.isAtomengine4_ProxyUpdateTraitStatus(e)) {
hs.EventManager.dispatchModuleEvent(new hs.E_Dot_Start(hs.DotUploadType.SHUCANG, "atomengine_active", {
atomengine_version: ae.AE_VERSION
}));
this.initAtomengine4();
}
};
t.prototype.initAtomengine4 = function() {
if (!hs.atomengine4Info.fullScreenGameNode) {
var e = new cc.Node("atomengine4GameNode");
e.x = hs.uiLayer.width / 2;
e.y = hs.uiLayer.height / 2;
e.width = cc.winSize.width;
e.height = cc.winSize.height;
hs.gameUiLayer.addChild(e, cc.macro.MAX_ZINDEX);
hs.atomengine4Info.setFullScreenGameNode(e);
}
if (!hs.atomengine4Info.fullScreenGameAlertNode) {
var t = new cc.Node("atomengine4GameAlertNode");
t.x = hs.uiLayer.width / 2;
t.y = hs.uiLayer.height / 2;
t.width = cc.winSize.width;
t.height = cc.winSize.height;
hs.gameAlertLayer.addChild(t, cc.macro.MAX_ZINDEX);
hs.atomengine4Info.setFullScreenGameAlertNode(t);
}
var n = [], i = hs.traitConfigInfo.traitsClassNameMap, o = [];
for (var r in i) {
var a = i[r];
null != a.param.atomFeatureName && (a.param.isAtomenginePreloadFeature ? o.push(a.param) : n.push(a.param));
}
if ((null == n ? void 0 : n.length) || (null == o ? void 0 : o.length)) {
hs.atomengine4Info.setFeatureList(n.concat());
hs.atomengine4Info.setPreloadFeatureList(o.concat());
hs.EventManager.dispatchModuleEvent(new hs.E_Atomengine4_FeatureListReady());
}
};
t.prototype.getFeatureConfigs = function() {
var e;
return null === (e = this.props) || void 0 === e ? void 0 : e.featureConfigs;
};
return r([ classId("Atomengine4SwitchTrait") ], t);
}(Trait);
n.Atomengine4SwitchTrait = a;
cc._RF.pop();
}, {} ]
}, {}, [ "Atomengine4SwitchTrait" ]);
//# sourceMappingURL=index.js.map
