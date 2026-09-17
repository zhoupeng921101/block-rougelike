window.__require = function e(t, n, r) {
function i(s, a) {
if (!n[s]) {
if (!t[s]) {
var c = s.split("/");
c = c[c.length - 1];
if (!t[c]) {
var u = "function" == typeof __require && __require;
if (!a && u) return u(c, !0);
if (o) return o(c, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = c;
}
var p = n[s] = {
exports: {}
};
t[s][0].call(p.exports, function(e) {
return i(t[s][1][e] || e);
}, p, p.exports, e, t, n, r);
}
return n[s].exports;
}
for (var o = "function" == typeof __require && __require, s = 0; s < r.length; s++) i(r[s]);
return i;
}({
UEExploreGuideCompleteLikeTrait: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "87483UDJclJkLVe7nvn4adj", "UEExploreGuideCompleteLikeTrait");
var r, i = this && this.__extends || (r = function(e, t) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
})(e, t);
}, function(e, t) {
r(e, t);
function n() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
}), o = this && this.__decorate || function(e, t, n, r) {
var i, o = arguments.length, s = o < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, n) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, n, r); else for (var a = e.length - 1; a >= 0; a--) (i = e[a]) && (s = (o < 3 ? i(s) : o > 3 ? i(t, n, s) : i(t, n)) || s);
return o > 3 && s && Object.defineProperty(t, n, s), s;
}, s = this && this.__awaiter || function(e, t, n, r) {
return new (n || (n = Promise))(function(i, o) {
function s(e) {
try {
c(r.next(e));
} catch (e) {
o(e);
}
}
function a(e) {
try {
c(r.throw(e));
} catch (e) {
o(e);
}
}
function c(e) {
e.done ? i(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
e(t);
})).then(s, a);
var t;
}
c((r = r.apply(e, t || [])).next());
});
}, a = this && this.__generator || function(e, t) {
var n, r, i, o, s = {
label: 0,
sent: function() {
if (1 & i[0]) throw i[1];
return i[1];
},
trys: [],
ops: []
};
return o = {
next: a(0),
throw: a(1),
return: a(2)
}, "function" == typeof Symbol && (o[Symbol.iterator] = function() {
return this;
}), o;
function a(e) {
return function(t) {
return c([ e, t ]);
};
}
function c(o) {
if (n) throw new TypeError("Generator is already executing.");
for (;s; ) try {
if (n = 1, r && (i = 2 & o[0] ? r.return : o[0] ? r.throw || ((i = r.return) && i.call(r), 
0) : r.next) && !(i = i.call(r, o[1])).done) return i;
(r = 0, i) && (o = [ 2 & o[0], i.value ]);
switch (o[0]) {
case 0:
case 1:
i = o;
break;

case 4:
s.label++;
return {
value: o[1],
done: !1
};

case 5:
s.label++;
r = o[1];
o = [ 0 ];
continue;

case 7:
o = s.ops.pop();
s.trys.pop();
continue;

default:
if (!(i = s.trys, i = i.length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
s = 0;
continue;
}
if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
s.label = o[1];
break;
}
if (6 === o[0] && s.label < i[1]) {
s.label = i[1];
i = o;
break;
}
if (i && s.label < i[2]) {
s.label = i[2];
s.ops.push(o);
break;
}
i[2] && s.ops.pop();
s.trys.pop();
continue;
}
o = t.call(e, s);
} catch (e) {
o = [ 6, e ];
r = 0;
} finally {
n = i = 0;
}
if (5 & o[0]) throw o[1];
return {
value: o[0] ? o[1] : void 0,
done: !0
};
}
};
Object.defineProperty(n, "__esModule", {
value: !0
});
n.UEExploreGuideCompleteLikeTrait = void 0;
var c = function(e) {
i(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.isPromptNone = !1;
t.isScoreNone = !1;
return t;
}
t.prototype.onCreate = function() {
storage.getItem("classGuideStep", 0) <= 2 && this.loadPrefab();
};
t.prototype.onActive = function(e) {
if (hs.tp.isClassGuide_ProxyOnGuideChange(e)) {
var t = hs.classGuideInfo;
t.step === t.totalStep && this.showLike();
}
if (hs.tp.isClassGuide_ProxyOnTouchEnd(e)) {
var n = hs.classGuideInfo;
if (n.step === n.totalStep - 1) {
this.isPromptNone = !0;
this.isScoreNone = !0;
}
}
if (hs.tp.isClassEncourage_ProxyOnTouchEnd(e) && this.isPromptNone) {
e.args[0].state.promptType = hs.EncouragePromptType.PROMPT_NONE;
e.replace = !0;
this.isPromptNone = !1;
}
if (hs.tp.isClassScoreTip_ProxyPlayComboScoreAnim(e) && this.isScoreNone) {
e.replace = !0;
this.isScoreNone = !1;
}
};
t.prototype.loadPrefab = function() {
return s(this, void 0, void 0, function() {
var e, t;
return a(this, function(n) {
switch (n.label) {
case 0:
if (cc.isValid(this.spine)) return [ 2 ];
n.label = 1;

case 1:
n.trys.push([ 1, 3, , 4 ]);
return [ 4, hs.ResLoader.asyncLoadByBundle(this.traitName, "prefabs/effect", cc.Prefab) ];

case 2:
e = n.sent();
if (cc.isValid(this.spine)) return [ 2 ];
if (e) {
t = cc.instantiate(e);
this.spine = t.getComponent(sp.Skeleton);
}
return [ 3, 4 ];

case 3:
n.sent();
return [ 3, 4 ];

case 4:
return [ 2 ];
}
});
});
};
t.prototype.showLike = function() {
return s(this, void 0, void 0, function() {
var e, t = this;
return a(this, function(n) {
switch (n.label) {
case 0:
return [ 4, hs.delayTime(300) ];

case 1:
n.sent();
if (!cc.isValid(this.spine)) return [ 2 ];
e = Cinst(hs.ClassGame);
if (!cc.isValid(e) || !e.node.activeInHierarchy) return [ 2 ];
this.spine.node.parent !== e.guideContainer && e.guideContainer.addChild(this.spine.node);
this.spine.setAnimation(0, "in", !1);
this.spine.node.setPosition(0, 120);
this.spine.timeScale = 1 / (cc.director._kSpeed || 1);
this.spine.setCompleteListener(function() {
cc.isValid(t.spine) && t.spine.node.removeFromParent();
});
return [ 2 ];
}
});
});
};
return o([ classId("UEExploreGuideCompleteLikeTrait") ], t);
}(Trait);
n.UEExploreGuideCompleteLikeTrait = c;
cc._RF.pop();
}, {} ]
}, {}, [ "UEExploreGuideCompleteLikeTrait" ]);
//# sourceMappingURL=index.js.map
