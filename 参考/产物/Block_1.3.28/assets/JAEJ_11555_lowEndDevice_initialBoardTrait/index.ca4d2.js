window.__require = function e(t, o, r) {
function a(i, s) {
if (!o[i]) {
if (!t[i]) {
var l = i.split("/");
l = l[l.length - 1];
if (!t[l]) {
var d = "function" == typeof __require && __require;
if (!s && d) return d(l, !0);
if (n) return n(l, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = l;
}
var c = o[i] = {
exports: {}
};
t[i][0].call(c.exports, function(e) {
return a(t[i][1][e] || e);
}, c, c.exports, e, t, o, r);
}
return o[i].exports;
}
for (var n = "function" == typeof __require && __require, i = 0; i < r.length; i++) a(r[i]);
return a;
}({
JAEJ_11555_lowEndDevice_initialBoardTrait: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "e4e27q+hQhKipEN74tONROT", "JAEJ_11555_lowEndDevice_initialBoardTrait");
var r, a = this && this.__extends || (r = function(e, t) {
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
var a, n = arguments.length, i = n < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, o) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(e, t, o, r); else for (var s = e.length - 1; s >= 0; s--) (a = e[s]) && (i = (n < 3 ? a(i) : n > 3 ? a(t, o, i) : a(t, o)) || i);
return n > 3 && i && Object.defineProperty(t, o, i), i;
};
Object.defineProperty(o, "__esModule", {
value: !0
});
o.JAEJ_11555_lowEndDevice_initialBoardTrait = void 0;
var i = {
nowGame: {
put_num: 0,
eliminate_num: 0
},
lastGame: {
canTrigger: !1
},
useBoardId: -1
}, s = function(e) {
a(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.logKey = "JAEJ_11555_lowEndDevice_initialBoard";
t.specifyBoardId = [ 1, 9, 23, 24, 28, 29, 60, 62, 67, 68, 81, 90, 91, 97, 100, 111, 117, 123, 129, 138, 141, 147, 152, 155, 157, 168, 173, 184, 199, 206, 217, 250, 257, 268, 288, 293, 295, 301, 303, 308, 335, 341, 346, 353, 357, 367, 368, 386, 389, 403, 415, 433, 449, 462, 466, 477, 481, 488, 493, 495, 497, 529, 532, 557, 596, 598, 605, 606, 607, 609, 611, 616, 638, 644, 655, 670, 675, 678, 680, 686, 688, 715, 738, 743, 754, 768, 781, 787, 790, 795, 798, 825, 831, 839, 843, 844, 846, 847, 850, 851, 852, 872, 882, 889, 946, 958, 960, 963, 993, 1012, 1013, 1037, 1054, 1059, 1061, 1081, 1084, 1092, 1095, 1096, 1097, 1099, 1110, 1117, 1118, 1120, 1137, 1156, 1170, 1177, 1178, 1196, 1206, 1212, 1213, 1217, 1267, 1281, 1292, 1301, 1306, 1307, 1325, 1332, 1337, 1347, 1354, 1362, 1374, 1381, 1385, 1389, 1409, 1410, 1416, 1419, 1468, 1484, 1489, 1502, 1503, 1504, 1508, 1515, 1516, 1522, 1531, 1532, 1537, 1546, 1547, 1555, 1563, 1564, 1565, 1566, 1574, 1576, 1590, 1594, 1602, 1612, 1620, 1621, 1633, 1647, 1651, 1656, 1659, 1668, 1669, 1701, 1703, 1710, 1712, 1720, 1729, 1735, 1737, 1742, 1747, 1763, 1770, 1778, 1784, 1794, 1806, 1823, 1839, 1851, 1854, 1856, 1872, 1903, 1918, 1929, 1941, 1944, 1945, 1951, 1976, 1983, 1984 ];
return t;
}
t.prototype.registerTraitEventsMethods = function() {
return [ {
className: "ClassBoard_Proxy",
methodName: "onBlocksProducerTouchEnd"
}, {
className: "ClassGameOver_GameEnd_Proxy",
methodName: "onGameEnd"
}, {
className: "ClassGame_Replay_Proxy",
methodName: "onGameReplay"
} ];
};
t.prototype.onActive = function(e) {
if (hs.tp.isClassBoard_ProxyOnBlocksProducerTouchEnd(e)) {
var t = hs.storage.getItem("JAEJ_11555_lowEndDevice_initialBoardInfo", i), o = e.args[0];
if (-1 === o.touchBlockId) return;
o.canEliminate && (t.nowGame.eliminate_num += 1);
t.nowGame.put_num += 1;
hs.storage.setItem("JAEJ_11555_lowEndDevice_initialBoardInfo", t);
}
if (hs.tp.isClassGameOver_GameEnd_ProxyOnGameEnd(e) || hs.tp.isClassGame_Replay_ProxyOnGameReplay(e)) {
(t = hs.storage.getItem("JAEJ_11555_lowEndDevice_initialBoardInfo", i)).lastGame.canTrigger = !1;
hs.classGameInfo.roundNum > this.props.roundNum && Number((t.nowGame.eliminate_num / t.nowGame.put_num).toFixed(2)) < this.props.ratio && (t.lastGame.canTrigger = !0);
t.nowGame = {
put_num: 0,
eliminate_num: 0
};
hs.storage.setItem("JAEJ_11555_lowEndDevice_initialBoardInfo", t);
}
if (hs.tp.isClassDefaultBoard_ProxyProduceDefaultBoard(e) && (t = hs.storage.getItem("JAEJ_11555_lowEndDevice_initialBoardInfo", i)).lastGame.canTrigger) {
var r = t.useBoardId, a = this.getNextBoardId(r), n = this.getFaceBlocksByBoardId(this.specifyBoardId[a]);
t.useBoardId = a;
hs.storage.setItem("JAEJ_11555_lowEndDevice_initialBoardInfo", t);
e.args[0] = n;
e.returnState = !0;
}
};
t.prototype.getNextBoardId = function(e) {
return e < this.specifyBoardId.length - 1 ? e + 1 : 0;
};
t.prototype.getFaceBlocksByBoardId = function(e) {
hs.storage.setItem("classDefaultBoardConfigType", hs.ClassDefautBoardConfigType.BOARD_2000);
var t = hs.classDefaultBoardInfo.usedLevelConfigs;
if (e > t.length) return hs.boardInfo.NULL;
for (var o = t[e -= 1].Map, r = hs.boardInfo.NULL, a = 0; a < o.length; a++) {
var n = Math.floor(a / hs.ROW), i = Math.floor(a % hs.COL);
0 == o[a] ? r[n][i] = -1 : r[n][i] = o[a];
}
hs.classDefaultBoardInfo.setDefaultBoardInfo({
boardIndex: e,
boardSource: hs.DEFAULT_SOURCE_TYPE.DEFAULT
});
return r;
};
return n([ classId("JAEJ_11555_lowEndDevice_initialBoardTrait") ], t);
}(Trait);
o.JAEJ_11555_lowEndDevice_initialBoardTrait = s;
cc._RF.pop();
}, {} ]
}, {}, [ "JAEJ_11555_lowEndDevice_initialBoardTrait" ]);
//# sourceMappingURL=index.js.map
