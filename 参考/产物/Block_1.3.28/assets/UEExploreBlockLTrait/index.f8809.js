window.__require = function e(r, t, o) {
function n(c, s) {
if (!t[c]) {
if (!r[c]) {
var a = c.split("/");
a = a[a.length - 1];
if (!r[a]) {
var u = "function" == typeof __require && __require;
if (!s && u) return u(a, !0);
if (i) return i(a, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = a;
}
var p = t[c] = {
exports: {}
};
r[c][0].call(p.exports, function(e) {
return n(r[c][1][e] || e);
}, p, p.exports, e, r, t, o);
}
return t[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < o.length; c++) n(o[c]);
return n;
}({
UEExploreBlockLTrait: [ function(e, r, t) {
"use strict";
cc._RF.push(r, "4c4d8qZyIxKNq1yCpVSe7Vt", "UEExploreBlockLTrait");
var o, n = this && this.__extends || (o = function(e, r) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, r) {
e.__proto__ = r;
} || function(e, r) {
for (var t in r) Object.prototype.hasOwnProperty.call(r, t) && (e[t] = r[t]);
})(e, r);
}, function(e, r) {
o(e, r);
function t() {
this.constructor = e;
}
e.prototype = null === r ? Object.create(r) : (t.prototype = r.prototype, new t());
}), i = this && this.__decorate || function(e, r, t, o) {
var n, i = arguments.length, c = i < 3 ? r : null === o ? o = Object.getOwnPropertyDescriptor(r, t) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) c = Reflect.decorate(e, r, t, o); else for (var s = e.length - 1; s >= 0; s--) (n = e[s]) && (c = (i < 3 ? n(c) : i > 3 ? n(r, t, c) : n(r, t)) || c);
return i > 3 && c && Object.defineProperty(r, t, c), c;
};
Object.defineProperty(t, "__esModule", {
value: !0
});
t.UEExploreBlockLTrait = void 0;
var c = {
save_arr: [ [ 10, 10, 10, 5, 5, 10, 10, 10 ], [ 10, 10, 10, 5, 5, 10, 10, 10 ], [ 10, 10, 10, 4, 4, 10, 10, 10 ], [ 10, 10, 10, -1, -1, 10, 10, 10 ], [ 10, 10, 10, 4, -1, 10, 10, 10 ], [ 10, 10, 10, 4, -1, 10, 10, 10 ], [ 10, 10, 10, 5, 5, 10, 10, 10 ], [ 10, 10, 10, 5, 5, 10, 10, 10 ] ],
producerBlocks: [ -1, 32, -1 ],
blocksColors: [ 1, 5, 1 ],
color: 5,
move: [ {
x: 0,
y: -553.75
}, {
x: 0,
y: 73.25
} ]
}, s = function(e) {
n(r, e);
function r() {
return null !== e && e.apply(this, arguments) || this;
}
r.prototype.onActive = function(e) {
if (hs.tp.isClassGuide_ProxyInitTraits(e) && hs.classGuideInfo.show) {
storage.setItem("classGuideStep", 2);
Object.assign(hs.classGuideInfo.steps[2], c);
}
if (hs.tp.isIsOpenFirstDayReplayGuideBoardTraitGetInitBoard(e)) {
e.returnValue = c.save_arr.map(function(e) {
return e.map(function(e) {
return 10 === e ? -1 : e;
});
});
e.replace = !0;
}
if (hs.tp.isIsOpenFirstDayReplayGuideBoardTraitGetProducerBlocks(e)) {
e.returnValue = c.producerBlocks.map(function(e) {
return e;
});
e.replace = !0;
}
if (hs.tp.isIsOpenFirstDayReplayGuideBoardTraitGetBlocksColors(e)) {
e.returnValue = c.blocksColors.map(function(e) {
return e;
});
e.replace = !0;
}
};
return i([ classId("UEExploreBlockLTrait") ], r);
}(Trait);
t.UEExploreBlockLTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "UEExploreBlockLTrait" ]);
//# sourceMappingURL=index.js.map
