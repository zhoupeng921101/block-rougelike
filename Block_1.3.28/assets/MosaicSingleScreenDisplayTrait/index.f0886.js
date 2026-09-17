window.__require = function t(e, n, r) {
function i(c, a) {
if (!n[c]) {
if (!e[c]) {
var u = c.split("/");
u = u[u.length - 1];
if (!e[u]) {
var p = "function" == typeof __require && __require;
if (!a && p) return p(u, !0);
if (o) return o(u, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = u;
}
var s = n[c] = {
exports: {}
};
e[c][0].call(s.exports, function(t) {
return i(e[c][1][t] || t);
}, s, s.exports, t, e, n, r);
}
return n[c].exports;
}
for (var o = "function" == typeof __require && __require, c = 0; c < r.length; c++) i(r[c]);
return i;
}({
MosaicSingleScreenDisplayTrait: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "02b51X67CdPnJmxX8AEEahN", "MosaicSingleScreenDisplayTrait");
var r, i = this && this.__extends || (r = function(t, e) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(t, e) {
t.__proto__ = e;
} || function(t, e) {
for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
})(t, e);
}, function(t, e) {
r(t, e);
function n() {
this.constructor = t;
}
t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
}), o = this && this.__decorate || function(t, e, n, r) {
var i, o = arguments.length, c = o < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, n) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(t, e, n, r); else for (var a = t.length - 1; a >= 0; a--) (i = t[a]) && (c = (o < 3 ? i(c) : o > 3 ? i(e, n, c) : i(e, n)) || c);
return o > 3 && c && Object.defineProperty(e, n, c), c;
}, c = this && this.__awaiter || function(t, e, n, r) {
return new (n || (n = Promise))(function(i, o) {
function c(t) {
try {
u(r.next(t));
} catch (t) {
o(t);
}
}
function a(t) {
try {
u(r.throw(t));
} catch (t) {
o(t);
}
}
function u(t) {
t.done ? i(t.value) : (e = t.value, e instanceof n ? e : new n(function(t) {
t(e);
})).then(c, a);
var e;
}
u((r = r.apply(t, e || [])).next());
});
}, a = this && this.__generator || function(t, e) {
var n, r, i, o, c = {
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
function a(t) {
return function(e) {
return u([ t, e ]);
};
}
function u(o) {
if (n) throw new TypeError("Generator is already executing.");
for (;c; ) try {
if (n = 1, r && (i = 2 & o[0] ? r.return : o[0] ? r.throw || ((i = r.return) && i.call(r), 
0) : r.next) && !(i = i.call(r, o[1])).done) return i;
(r = 0, i) && (o = [ 2 & o[0], i.value ]);
switch (o[0]) {
case 0:
case 1:
i = o;
break;

case 4:
c.label++;
return {
value: o[1],
done: !1
};

case 5:
c.label++;
r = o[1];
o = [ 0 ];
continue;

case 7:
o = c.ops.pop();
c.trys.pop();
continue;

default:
if (!(i = c.trys, i = i.length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
c = 0;
continue;
}
if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
c.label = o[1];
break;
}
if (6 === o[0] && c.label < i[1]) {
c.label = i[1];
i = o;
break;
}
if (i && c.label < i[2]) {
c.label = i[2];
c.ops.push(o);
break;
}
i[2] && c.ops.pop();
c.trys.pop();
continue;
}
o = e.call(t, c);
} catch (t) {
o = [ 6, t ];
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
n.MosaicSingleScreenDisplayTrait = void 0;
var u = function(t) {
i(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e._cupHeight = 325;
e._cupScale = .77;
e._cupOffsetY = e._cupHeight * (1 - e._cupScale);
return e;
}
e.prototype.onActive = function(t) {
hs.tp.isChapterContentInitComplete(t) && this._adaptChapterContent();
};
e.prototype._adaptChapterContent = function() {
return c(this, void 0, void 0, function() {
var t, e, n, r, i, o, c, u, p;
return a(this, function(a) {
switch (a.label) {
case 0:
t = Cinst(hs.ChapterContent);
e = Cinst(hs.ChapterList);
if (!cc.isValid(t)) return [ 3, 2 ];
t.itemContainer.scale = t.cupContainer.scale = 1;
t.itemContainer.opacity = t.cupContainer.opacity = 0;
return [ 4, hs.nextFrame() ];

case 1:
a.sent();
if (!cc.isValid(t)) return [ 2 ];
t.itemContainer.opacity = t.cupContainer.opacity = 255;
n = Number.MAX_SAFE_INTEGER;
r = Number.MIN_SAFE_INTEGER;
t.itemList.forEach(function(t) {
var e = t.node.convertToWorldSpaceAR(cc.v2(0, 0));
n = Math.min(n, e.y);
r = Math.max(r, e.y);
});
i = t.cupContainer.convertToWorldSpaceAR(cc.v2(0, 0)).y;
o = e.topContainer.height + e.topContainer.getComponent(cc.Widget).top;
c = cc.view.getVisibleSize().height - o - this._cupHeight;
if (i > c || r > c) {
u = Math.min(c / r, 1);
t.itemContainer.scale = u;
t.cupContainer.scale = this._cupScale;
p = t.content.convertToNodeSpaceAR(cc.v2(0, c));
t.cupContainer.y = p.y + this._cupOffsetY;
if (t.curChapterBtn.parent !== t.itemContainer) {
t.curChapterBtn.removeFromParent();
t.itemContainer.addChild(t.curChapterBtn);
}
}
t.content.height = t.node.height;
t.contentPos.y = -t.node.height / 2;
a.label = 2;

case 2:
return [ 2 ];
}
});
});
};
return o([ classId("MosaicSingleScreenDisplayTrait") ], e);
}(Trait);
n.MosaicSingleScreenDisplayTrait = u;
cc._RF.pop();
}, {} ]
}, {}, [ "MosaicSingleScreenDisplayTrait" ]);
//# sourceMappingURL=index.js.map
