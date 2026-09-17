window.__require = function t(r, e, o) {
function s(a, n) {
if (!e[a]) {
if (!r[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!r[c]) {
var u = "function" == typeof __require && __require;
if (!n && u) return u(c, !0);
if (i) return i(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var l = e[a] = {
exports: {}
};
r[a][0].call(l.exports, function(t) {
return s(r[a][1][t] || t);
}, l, l.exports, t, r, e, o);
}
return e[a].exports;
}
for (var i = "function" == typeof __require && __require, a = 0; a < o.length; a++) s(o[a]);
return s;
}({
FirstEightGamesConfig: [ function(t, r, e) {
"use strict";
cc._RF.push(r, "bb2d76hHltJfJxDKAYwh7Tb", "FirstEightGamesConfig");
Object.defineProperty(e, "__esModule", {
value: !0
});
e.isInFirstEightGames = e.getFirstEightGameConfig = e.FirstEightGamesConfig = void 0;
e.FirstEightGamesConfig = [ {
gameNum: 1,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ 4, 4, 4, -1, -1, 4, 4, 4 ], [ 4, -1, -1, -1, -1, -1, -1, 4 ], [ -1, -1, 7, -1, -1, 7, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 14, 18, 9 ],
blocksColors: [ 6, 3, 1 ]
}, {
gameNum: 2,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, 7, -1, -1, -1, -1, 7, -1 ], [ -1, 7, 7, 7, 7, 7, 7, -1 ], [ -1, -1, -1, 2, 2, -1, -1, -1 ] ],
producerBlocks: [ 24, 36, 23 ],
blocksColors: [ 6, 4, 5 ]
}, {
gameNum: 3,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, 5, -1, -1, -1, -1, -1, -1 ], [ 5, 2, 5, -1, -1, -1, -1, -1 ], [ -1, 5, -1, -1, 7, -1, -1, -1 ], [ -1, -1, -1, 7, 2, 7, -1, -1 ], [ -1, -1, -1, -1, 7, -1, -1, -1 ] ],
producerBlocks: [ 33, 19, 16 ],
blocksColors: [ 4, 2, 6 ]
}, {
gameNum: 4,
boardData: [ [ -1, 4, -1, -1, -1, -1, 4, -1 ], [ -1, -1, 4, -1, -1, 4, -1, -1 ], [ 4, 4, 4, -1, -1, 4, 4, 4 ], [ 4, -1, -1, -1, -1, -1, -1, 4 ], [ -1, -1, 6, -1, -1, 6, -1, -1 ], [ 4, -1, -1, -1, -1, -1, -1, 4 ], [ 4, 4, 4, -1, -1, 4, 4, 4 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 18, 14, 9 ],
blocksColors: [ 7, 2, 1 ]
}, {
gameNum: 5,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, 2, 2, 2, 2, 2, 2, -1 ], [ -1, 3, 3, -1, -1, 3, 3, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 24, 36, 23 ],
blocksColors: [ 4, 3, 7 ]
}, {
gameNum: 6,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, 5, -1 ], [ -1, -1, -1, -1, -1, 5, 2, 5 ], [ -1, 4, -1, -1, -1, 6, 5, -1 ], [ 4, 2, 4, -1, -1, 6, -1, -1 ], [ -1, 4, 6, -1, -1, 6, -1, -1 ], [ -1, -1, 6, -1, -1, 6, -1, -1 ], [ -1, -1, 6, -1, -1, 6, -1, -1 ] ],
producerBlocks: [ 36, 19, 15 ],
blocksColors: [ 4, 4, 7 ]
}, {
gameNum: 7,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ 3, 3, 3, -1, -1, 3, 3, 3 ], [ 3, -1, 5, -1, -1, 5, -1, 3 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, 6, 5, -1, -1, -1 ], [ -1, -1, -1, 5, 6, -1, -1, -1 ] ],
producerBlocks: [ 35, 10, 36 ],
blocksColors: [ 4, 7, 2 ]
}, {
gameNum: 8,
boardData: [ [ -1, 1, -1, 5, 5, -1, 1, -1 ], [ 1, 1, -1, 5, 5, -1, 1, 1 ], [ 1, -1, 7, 5, 5, 7, -1, 1 ], [ 1, 1, -1, 5, 5, -1, 1, 1 ], [ -1, 1, -1, 5, 5, -1, 1, -1 ], [ -1, 1, -1, 5, 5, -1, 1, -1 ], [ 5, 5, 2, -1, -1, 2, 5, 5 ], [ 5, 5, 2, -1, -1, 2, 5, 5 ] ],
producerBlocks: [ 23, 9, 24 ],
blocksColors: [ 6, 5, 7 ]
} ];
e.getFirstEightGameConfig = function(t, r) {
void 0 === r && (r = !1);
r && t--;
return e.FirstEightGamesConfig.find(function(r) {
return r.gameNum === t;
});
};
e.isInFirstEightGames = function(t, r) {
void 0 === r && (r = !1);
r && t--;
return t >= 1 && t <= 8;
};
cc._RF.pop();
}, {} ],
FirstEightGamesFixedBoardTrait: [ function(t, r, e) {
"use strict";
cc._RF.push(r, "e7349dzhJRDr7mynjlcMS0T", "FirstEightGamesFixedBoardTrait");
var o, s = this && this.__extends || (o = function(t, r) {
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
}), i = this && this.__decorate || function(t, r, e, o) {
var s, i = arguments.length, a = i < 3 ? r : null === o ? o = Object.getOwnPropertyDescriptor(r, e) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, r, e, o); else for (var n = t.length - 1; n >= 0; n--) (s = t[n]) && (a = (i < 3 ? s(a) : i > 3 ? s(r, e, a) : s(r, e)) || a);
return i > 3 && a && Object.defineProperty(r, e, a), a;
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.FirstEightGamesFixedBoardTrait = void 0;
var a = t("./FirstEightGamesConfig"), n = function(t) {
s(r, t);
function r() {
return null !== t && t.apply(this, arguments) || this;
}
Object.defineProperty(r.prototype, "fixGameNum", {
get: function() {
return this.props.fixGameNum;
},
enumerable: !1,
configurable: !0
});
r.prototype.shouldUseFixedBoard = function() {
return !0;
};
r.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassBlocksProducer_BlocksProducerValidate_Proxy",
methodName: "onBoardSplashAnimationEnd"
} ];
};
Object.defineProperty(r.prototype, "onActiveCondition", {
get: function() {
return this.shouldUseFixedBoard();
},
enumerable: !1,
configurable: !0
});
r.prototype.onActive = function(t) {
if (hs.tp.isClassDefaultBoard_ProxyProduceDefaultBoard(t)) {
var r = hs.classGameInfo.gameNum;
if (!a.isInFirstEightGames(r)) return;
var e = r + 1;
if (!(c = a.getFirstEightGameConfig(e, this.fixGameNum))) return;
t.args[0] = c.boardData;
t.returnState = !0;
}
if (hs.tp.isClassDefaultBoard_ProxyProduceDefaultColor(t)) {
r = hs.classGameInfo.gameNum;
a.isInFirstEightGames(r) && (t.returnState = !0);
}
if (hs.tp.isClassDefaultBoard_ProxyProduceDefaultBoardTurnAround(t)) {
r = hs.classGameInfo.gameNum;
a.isInFirstEightGames(r) && (t.returnState = !0);
}
if (hs.tp.isClassBlocksProducer_ProxyGuideRequestBlocksProducer(t)) {
var o = hs.classGameInfo, s = (r = o.gameNum, o.roundNum);
if (this.fixGameNum && r < 1) return;
var i = (c = a.getFirstEightGameConfig(r + 1, this.fixGameNum)).blocksColors;
i = this.updateBlocksColors(i);
var n = c.boardData;
n = this.updateFaceBlocks(n);
Cinst(hs.BlocksProducer).setState(this.getBlocksProducerState({
producerBlocks: c.producerBlocks,
colors: i
}));
storage.setItem("classFaceBlocks", n);
this.setFristProducerBlocks(c.producerBlocks);
hs.EventManager.dispatchModuleEvent(new hs.E_ClassBoard_Render(n));
t.replace = !0;
}
if (hs.tp.isClassBlocksProducer_BlocksProducerValidate_ProxyOnBoardSplashAnimationEnd(t)) {
var c, u = hs.classGameInfo;
r = u.gameNum, s = u.roundNum;
if (!a.isInFirstEightGames(r)) return;
if (0 !== s) return;
e = r + 1;
if (!(c = a.getFirstEightGameConfig(e, this.fixGameNum))) return;
this.setFristProducerBlocks(c.producerBlocks);
i = c.blocksColors;
i = this.updateBlocksColors(i);
hs.classColorProducerGameInfo.setColorList(i);
}
if (hs.tp.isClassBlocksProducer_BlocksProducerValidate_ProxySetRecordOperationColor(t)) {
var l = hs.classGameInfo;
r = l.gameNum, s = l.roundNum;
if (!this.checkInFirstEightGames(r)) return;
if (0 === s) {
t.returnState = !0;
t.replace = !0;
}
}
};
r.prototype.updateBlocksColors = function(t) {
return t;
};
r.prototype.updateFaceBlocks = function(t) {
return t;
};
r.prototype.checkInFirstEightGames = function(t) {
return a.isInFirstEightGames(t);
};
r.prototype.setFristProducerBlocks = function(t) {
storage.setItem("classProducerBlocks", t);
};
r.prototype.getBlocksProducerState = function(t) {
return t;
};
return i([ classId("FirstEightGamesFixedBoardTrait"), classMethodWatch() ], r);
}(Trait);
e.FirstEightGamesFixedBoardTrait = n;
cc._RF.pop();
}, {
"./FirstEightGamesConfig": "FirstEightGamesConfig"
} ]
}, {}, [ "FirstEightGamesConfig", "FirstEightGamesFixedBoardTrait" ]);
//# sourceMappingURL=index.js.map
