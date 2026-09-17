window.__require = function e(t, r, o) {
function a(n, i) {
if (!r[n]) {
if (!t[n]) {
var f = n.split("/");
f = f[f.length - 1];
if (!t[f]) {
var l = "function" == typeof __require && __require;
if (!i && l) return l(f, !0);
if (s) return s(f, !0);
throw new Error("Cannot find module '" + n + "'");
}
n = f;
}
var u = r[n] = {
exports: {}
};
t[n][0].call(u.exports, function(e) {
return a(t[n][1][e] || e);
}, u, u.exports, e, t, r, o);
}
return r[n].exports;
}
for (var s = "function" == typeof __require && __require, n = 0; n < o.length; n++) a(o[n]);
return a;
}({
IsOpenClassNewUserDefaultBoardTrait: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "277319sARdFpaeppiQ6aQEN", "IsOpenClassNewUserDefaultBoardTrait");
var o, a = this && this.__extends || (o = function(e, t) {
return (o = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
})(e, t);
}, function(e, t) {
o(e, t);
function r() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r());
}), s = this && this.__decorate || function(e, t, r, o) {
var a, s = arguments.length, n = s < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(e, t, r, o); else for (var i = e.length - 1; i >= 0; i--) (a = e[i]) && (n = (s < 3 ? a(n) : s > 3 ? a(t, r, n) : a(t, r)) || n);
return s > 3 && n && Object.defineProperty(t, r, n), n;
};
Object.defineProperty(r, "__esModule", {
value: !0
});
r.IsOpenClassNewUserDefaultBoardTrait = void 0;
var n = function(e) {
a(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.BOARD_LIST = [ 2, 3, 21, 31, 62, 92, 118, 121, 133, 158, 180, 189, 194, 201, 204, 208, 210, 212, 218, 233, 236, 248, 255, 283, 301, 361, 363, 365, 372, 380, 386, 397, 407, 421, 444, 475, 485, 506, 513, 523, 525, 534, 553, 555, 563, 586, 594, 596, 607, 617, 653, 655, 691, 705, 709, 722, 739, 745, 748, 750, 754, 756, 778, 793, 795, 800, 801, 820, 829, 831, 841, 856, 858, 873, 887, 898, 919, 933, 954, 971, 993, 999, 1024, 1034, 1038, 1044, 1051, 1055, 1059, 1067, 1075, 1078, 1084, 1088, 1108, 1134, 1140, 1166, 1171, 1173, 1185, 1190, 1232, 1237, 1242, 1248, 1250, 1253, 1269, 1290, 1293, 1295, 1296, 1307, 1312, 1321, 1322, 1333, 1350, 1365, 1366, 1375, 1387, 1412, 1413, 1421, 1423, 1436, 1437, 1444, 1456, 1462, 1471, 1486, 1489, 1500, 1506, 1537, 1540, 1541, 1548, 1558, 1559, 1568, 1571, 1574, 1586, 1592, 1604, 1614, 1626, 1628, 1631, 1639, 1684, 1694, 1703, 1727, 1732, 1738, 1740, 1744, 1750, 1755, 1758, 1765, 1791, 1799, 1806, 1810, 1830, 1835, 1836, 1844, 1857, 1867, 1884, 1893, 1896, 1904, 1912, 1925, 1933, 1936, 1973, 1974, 1993 ];
t.isReplaceBoard = !1;
return t;
}
t.prototype.onActive = function(e) {
if (hs.tp.isClassDefaultBoard_ProxyTriggerSpecialTrait(e)) {
var t = storage.getItem("firstEntryTime", 0), r = new Date(t), o = new Date();
this.isReplaceBoard = !1;
if (r.getFullYear() !== o.getFullYear() || r.getMonth() !== o.getMonth() || r.getDate() !== o.getDate() && r.getDate() + 1 !== o.getDate()) storage.setItem("classDefaultBoardConfigType", hs.ClassDefautBoardConfigType.BOARD_DEFAULT); else {
storage.setItem("classDefaultBoardConfigType", hs.ClassDefautBoardConfigType.BOARD_2000);
var a = hs.classDefaultBoardInfo.usedLevelConfigs, s = this.getBoard(a);
e.returnValue = s;
this.isReplaceBoard = !0;
}
}
hs.tp.isClassDefaultBoard_ProxyProduceDefaultBoardTurnAround(e) && this.isReplaceBoard && (e.returnState = !0);
};
t.prototype.getRandomIndex = function(e) {
var t = Math.floor(Math.random() * this.BOARD_LIST.length);
return this.BOARD_LIST[t] ? this.BOARD_LIST[t] : this.getRandomIndex(e);
};
t.prototype.getBoard = function(e) {
var t = this.getRandomIndex(e);
storage.setItem("classDefaultBoardInfo", {
boardIndex: t,
boardSource: hs.DEFAULT_SOURCE_TYPE.DEFAULT
});
for (var r = e[t].Map, o = hs.boardInfo.NULL, a = 0; a < r.length; a++) if (0 == r[a]) {
var s = Math.floor(a / hs.ROW), n = Math.floor(a % hs.COL);
o[s][n] = -1;
} else {
s = Math.floor(a / hs.ROW), n = Math.floor(a % hs.COL);
o[s][n] = r[a];
}
return o;
};
return s([ classId("IsOpenClassNewUserDefaultBoardTrait") ], t);
}(Trait);
r.IsOpenClassNewUserDefaultBoardTrait = n;
cc._RF.pop();
}, {} ]
}, {}, [ "IsOpenClassNewUserDefaultBoardTrait" ]);
//# sourceMappingURL=index.js.map
