window.__require = function e(t, o, n) {
function r(i, s) {
if (!o[i]) {
if (!t[i]) {
var c = i.split("/");
c = c[c.length - 1];
if (!t[c]) {
var l = "function" == typeof __require && __require;
if (!s && l) return l(c, !0);
if (a) return a(c, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = c;
}
var p = o[i] = {
exports: {}
};
t[i][0].call(p.exports, function(e) {
return r(t[i][1][e] || e);
}, p, p.exports, e, t, o, n);
}
return o[i].exports;
}
for (var a = "function" == typeof __require && __require, i = 0; i < n.length; i++) r(n[i]);
return r;
}({
ChangeMoreGamesDoubleColTrait: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "56f187OBilFbqVZfrsWxsza", "ChangeMoreGamesDoubleColTrait");
var n, r = this && this.__extends || (n = function(e, t) {
return (n = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
})(e, t);
}, function(e, t) {
n(e, t);
function o() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (o.prototype = t.prototype, new o());
}), a = this && this.__decorate || function(e, t, o, n) {
var r, a = arguments.length, i = a < 3 ? t : null === n ? n = Object.getOwnPropertyDescriptor(t, o) : n;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(e, t, o, n); else for (var s = e.length - 1; s >= 0; s--) (r = e[s]) && (i = (a < 3 ? r(i) : a > 3 ? r(t, o, i) : r(t, o)) || i);
return a > 3 && i && Object.defineProperty(t, o, i), i;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.ChangeMoreGamesDoubleColTrait = void 0;
var i = function(e) {
r(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._bundleName = "ChangeMoreGamesDoubleColTrait";
t._contentPrefab = null;
t._spriteFrameMap = new Map();
return t;
}
t.prototype.onCreate = function() {
this.preloadRes();
};
t.prototype.onActive = function(e) {
if (hs.tp.isGameLobbyGLHallMoreGamesPopupViewOnShow(e)) {
e.replace = !0;
cc.isValid(this._contentPrefab) ? this.initContent(e) : this.preloadRes(e);
}
if (hs.tp.isGameLobbyGlhallMoreGamesPopupItemLoadIcon(e)) {
e.replace = !0;
this.updateItemIcon(e);
}
};
t.prototype.initContent = function(e) {
var t = e.target, o = e.target.nodeScrollView, n = o.getComponent(cc.ScrollView), r = t.getLobbyGameList(hs.GameLobby_HallMoreGameConfigs), a = null;
if ("content2" != n.content.name) {
n.content.active = !1;
var i = cc.instantiate(this._contentPrefab);
i.getChildByName("nodeItem").active = !1;
i.name = "content2";
n.content.parent.addChild(i);
n.content = i;
(a = i.getChildByName("nodeItem")).active = !1;
} else a = n.content.getChildByName("nodeItem");
n.content.removeAllChildren();
for (var s = 0; s < r.length; s++) {
var c = r[s];
if (cc.sys.isNative && c.bundle == hs.GameLobbyBundleName.GL_FRUIT) {
var l = hs.Version.getProjectManifest();
if ((null == l ? void 0 : l.version) && hs.Version.compare(l.version, hs.GL_FRUIT_VERSION) < 0) continue;
}
var p = cc.instantiate(a);
if (p) {
p.active = !0;
n.content.addChild(p);
p.getComponent(hs.GameLobbyGlhallMoreGamesPopupItem).updateData(c);
}
}
o.active = !0;
hs.storage.setItem("isShow_GLHallMoreGamesPopupView", 1);
};
t.prototype.updateItemIcon = function(e) {
var t = this, o = e.args[0], n = e.args[1];
if (cc.isValid(o) && n) {
var r = n.substring(n.lastIndexOf("/") + 1), a = this._spriteFrameMap.get(r);
a && cc.isValid(a) ? o.spriteFrame = a : hs.ResLoader.loadByBundle(this._bundleName, "textures/" + r, cc.SpriteFrame, function(e, n) {
if (e) ; else if (cc.isValid(o) && cc.isValid(n)) {
o.spriteFrame = n;
t._spriteFrameMap && t._spriteFrameMap.set(r, n);
}
});
}
};
t.prototype.preloadRes = function(e) {
var t = this;
hs.ResLoader.loadByBundle(this._bundleName, "prefabs/GLHallMoreGamesPopupContent", cc.Prefab, function(o, n) {
if (o) ; else if (cc.isValid(n) && cc.isValid(e)) {
t._contentPrefab = n;
t.initContent(e);
}
});
};
return a([ classId("ChangeMoreGamesDoubleColTrait") ], t);
}(Trait);
o.ChangeMoreGamesDoubleColTrait = i;
cc._RF.pop();
}, {} ]
}, {}, [ "ChangeMoreGamesDoubleColTrait" ]);
//# sourceMappingURL=index.js.map
