window.__require = function o(r, e, t) {
function a(i, n) {
if (!e[i]) {
if (!r[i]) {
var l = i.split("/");
l = l[l.length - 1];
if (!r[l]) {
var d = "function" == typeof __require && __require;
if (!n && d) return d(l, !0);
if (s) return s(l, !0);
throw new Error("Cannot find module '" + i + "'");
}
i = l;
}
var c = e[i] = {
exports: {}
};
r[i][0].call(c.exports, function(o) {
return a(r[i][1][o] || o);
}, c, c.exports, o, r, e, t);
}
return e[i].exports;
}
for (var s = "function" == typeof __require && __require, i = 0; i < t.length; i++) a(t[i]);
return a;
}({
NewUserBoardDiffAnimConfig: [ function(o, r, e) {
"use strict";
cc._RF.push(r, "5e22e6kDydEVrdAMobVmLaS", "NewUserBoardDiffAnimConfig");
Object.defineProperty(e, "__esModule", {
value: !0
});
e.NEW_USER_BOARD_DIFF_INIT_BOARD_ANIM_CONFIG = void 0;
e.NEW_USER_BOARD_DIFF_INIT_BOARD_ANIM_CONFIG = {
enabled: 1,
longPressMs: 300,
patterns: [],
boards: [ {
bid: 1,
patterns: [ {
matchColor: 7,
steps: [ {
color: 7,
durationMs: 250
}, {
color: 2,
durationMs: 250
}, {
color: 7,
durationMs: 250
}, {
color: 2,
durationMs: 250
}, {
color: 7,
durationMs: 1e3
} ]
} ]
}, {
bid: 5,
patterns: [ {
matchColor: 1,
steps: [ {
color: 1,
durationMs: 250
}, {
color: 6,
durationMs: 250
}, {
color: 3,
durationMs: 250
}, {
color: 7,
durationMs: 250
}, {
color: 5,
durationMs: 250
} ]
} ]
}, {
bid: 8,
patterns: [ {
matchColor: 2,
steps: [ {
color: 2,
durationMs: 250
}, {
color: 6,
durationMs: 250
}, {
color: 1,
durationMs: 250
}, {
color: 3,
durationMs: 250
} ]
} ]
}, {
bid: 9,
patterns: [ {
matchColor: 2,
steps: [ {
color: 2,
durationMs: 250
}, {
color: 6,
durationMs: 500
}, {
color: 7,
durationMs: 500
}, {
color: 3,
durationMs: 250
} ]
} ]
}, {
bid: 10,
patterns: [ {
matchColor: 4,
steps: [ {
color: 4,
durationMs: 500
}, {
color: 2,
durationMs: 250
}, {
color: 7,
durationMs: 500
}, {
color: 2,
durationMs: 250
} ]
} ]
}, {
bid: 11,
patterns: [ {
matchColor: 6,
steps: [ {
color: 6,
durationMs: 250
}, {
color: 4,
durationMs: 250
}, {
color: 1,
durationMs: 250
}, {
color: 5,
durationMs: 250
}, {
color: 3,
durationMs: 250
} ]
} ]
}, {
bid: 109,
patterns: [ {
matchColor: 7,
steps: [ {
color: 7,
durationMs: 250
}, {
color: 3,
durationMs: 250
}, {
color: 7,
durationMs: 250
}, {
color: 3,
durationMs: 250
}, {
color: 7,
durationMs: 1e3
} ]
} ]
}, {
bid: 115,
patterns: [ {
matchColor: 5,
steps: [ {
color: 5,
durationMs: 400
}, {
color: 3,
durationMs: 400
}, {
color: 7,
durationMs: 400
}, {
color: 2,
durationMs: 400
} ]
} ]
}, {
bid: 164,
patterns: [ {
matchColor: 7,
steps: [ {
color: 7,
durationMs: 200
}, {
color: 2,
durationMs: 200
}, {
color: 6,
durationMs: 200
}, {
color: 4,
durationMs: 200
} ]
} ]
}, {
bid: 102,
patterns: [ {
matchColor: 2,
steps: [ {
color: 2,
durationMs: 200
}, {
color: 7,
durationMs: 200
}, {
color: 4,
durationMs: 200
} ]
} ]
}, {
bid: 122,
patterns: [ {
matchColor: 7,
steps: [ {
color: 7,
durationMs: 500
}, {
color: 6,
durationMs: 400
}, {
color: 4,
durationMs: 300
}, {
color: 7,
durationMs: 200
}, {
color: 6,
durationMs: 200
}, {
color: 4,
durationMs: 200
}, {
color: 7,
durationMs: 800
}, {
color: 6,
durationMs: 700
}, {
color: 4,
durationMs: 600
} ]
} ]
}, {
bid: 17,
patterns: [ {
matchColor: 2,
steps: [ {
color: 2,
durationMs: 250
}, {
color: 4,
durationMs: 250
}, {
color: 2,
durationMs: 250
}, {
color: 4,
durationMs: 250
}, {
color: 2,
durationMs: 1e3
} ]
} ]
}, {
bid: 142,
patterns: [ {
matchColor: 2,
steps: [ {
color: 2,
durationMs: 250
}, {
color: 4,
durationMs: 250
}, {
color: 2,
durationMs: 250
}, {
color: 4,
durationMs: 250
}, {
color: 2,
durationMs: 1e3
} ]
} ]
}, {
bid: 19,
patterns: [ {
matchColor: 5,
steps: [ {
color: 5,
durationMs: 250
}, {
color: 6,
durationMs: 250
}, {
color: 5,
durationMs: 250
}, {
color: 6,
durationMs: 250
}, {
color: 5,
durationMs: 1e3
} ]
} ]
}, {
bid: 79,
patterns: [ {
matchColor: 5,
steps: [ {
color: 5,
durationMs: 200
}, {
color: 6,
durationMs: 200
}, {
color: 7,
durationMs: 200
}, {
color: 3,
durationMs: 200
}, {
color: 2,
durationMs: 400
}, {
color: 5,
durationMs: 400
}, {
color: 6,
durationMs: 400
}, {
color: 7,
durationMs: 400
}, {
color: 3,
durationMs: 400
}, {
color: 2,
durationMs: 600
} ]
} ]
}, {
bid: 46,
patterns: [ {
matchColor: 2,
steps: [ {
color: 2,
durationMs: 250
}, {
color: 3,
durationMs: 250
}, {
color: 2,
durationMs: 250
}, {
color: 3,
durationMs: 250
}, {
color: 2,
durationMs: 1e3
} ]
} ]
}, {
bid: 73,
patterns: [ {
matchColor: 2,
steps: [ {
color: 2,
durationMs: 250
}, {
color: 3,
durationMs: 250
}, {
color: 2,
durationMs: 250
}, {
color: 3,
durationMs: 250
}, {
color: 2,
durationMs: 1e3
} ]
} ]
}, {
bid: 48,
patterns: [ {
matchColor: 7,
steps: [ {
color: 7,
durationMs: 250
}, {
color: 4,
durationMs: 250
}, {
color: 7,
durationMs: 250
}, {
color: 4,
durationMs: 250
}, {
color: 7,
durationMs: 1e3
} ]
} ]
}, {
bid: 108,
patterns: [ {
matchColor: 7,
steps: [ {
color: 7,
durationMs: 400
}, {
color: 4,
durationMs: 300
}, {
color: 7,
durationMs: 400
}, {
color: 3,
durationMs: 300
}, {
color: 7,
durationMs: 400
}, {
color: 5,
durationMs: 300
}, {
color: 7,
durationMs: 400
}, {
color: 2,
durationMs: 300
} ]
} ]
}, {
bid: 123,
patterns: [ {
matchColor: 7,
steps: [ {
color: 7,
durationMs: 400
}, {
color: 4,
durationMs: 300
}, {
color: 7,
durationMs: 400
}, {
color: 3,
durationMs: 300
}, {
color: 7,
durationMs: 400
}, {
color: 5,
durationMs: 300
}, {
color: 7,
durationMs: 400
}, {
color: 2,
durationMs: 300
} ]
} ]
}, {
bid: 117,
patterns: [ {
matchColor: 5,
steps: [ {
color: 5,
durationMs: 500
}, {
color: 4,
durationMs: 250
}, {
color: 2,
durationMs: 250
}, {
color: 1,
durationMs: 250
}, {
color: 6,
durationMs: 250
} ]
} ]
}, {
bid: 126,
patterns: [ {
matchColor: 7,
steps: [ {
color: 7,
durationMs: 250
}, {
color: 2,
durationMs: 250
}, {
color: 7,
durationMs: 250
}, {
color: 2,
durationMs: 250
}, {
color: 7,
durationMs: 1e3
} ]
} ]
}, {
bid: 78,
patterns: [ {
matchColor: 7,
steps: [ {
color: 7,
durationMs: 250
}, {
color: 3,
durationMs: 250
}, {
color: 7,
durationMs: 250
}, {
color: 3,
durationMs: 250
}, {
color: 7,
durationMs: 1e3
} ]
} ]
}, {
bid: 150,
patterns: [ {
matchColor: 7,
steps: [ {
color: 7,
durationMs: 250
}, {
color: 3,
durationMs: 250
}, {
color: 7,
durationMs: 250
}, {
color: 3,
durationMs: 250
}, {
color: 7,
durationMs: 1e3
} ]
} ]
}, {
bid: 57,
patterns: [ {
matchColor: 7,
steps: [ {
color: 7,
durationMs: 600
}, {
color: 5,
durationMs: 300
}, {
color: 6,
durationMs: 300
}, {
color: 3,
durationMs: 300
}, {
color: 4,
durationMs: 300
} ]
} ]
}, {
bid: 58,
patterns: [ {
matchColor: 7,
steps: [ {
color: 7,
durationMs: 250
}, {
color: 2,
durationMs: 250
}, {
color: 7,
durationMs: 250
}, {
color: 2,
durationMs: 250
}, {
color: 7,
durationMs: 1e3
} ]
} ]
}, {
bid: 104,
patterns: [ {
matchColor: 7,
steps: [ {
color: 7,
durationMs: 250
}, {
color: 2,
durationMs: 250
}, {
color: 7,
durationMs: 250
}, {
color: 2,
durationMs: 250
}, {
color: 7,
durationMs: 1e3
} ]
} ]
}, {
bid: 95,
patterns: [ {
matchColor: 7,
steps: [ {
color: 7,
durationMs: 250
}, {
color: 2,
durationMs: 250
}, {
color: 7,
durationMs: 250
}, {
color: 2,
durationMs: 250
}, {
color: 7,
durationMs: 1e3
} ]
} ]
}, {
bid: 34,
patterns: [ {
matchColor: 7,
steps: [ {
color: 7,
durationMs: 600
}, {
color: 5,
durationMs: 300
}, {
color: 6,
durationMs: 300
}, {
color: 3,
durationMs: 300
}, {
color: 4,
durationMs: 300
} ]
} ]
}, {
bid: 121,
patterns: [ {
matchColor: 2,
steps: [ {
color: 2,
durationMs: 250
}, {
color: 6,
durationMs: 250
}, {
color: 2,
durationMs: 250
}, {
color: 6,
durationMs: 250
}, {
color: 2,
durationMs: 1e3
} ]
} ]
}, {
bid: 129,
patterns: [ {
matchColor: 2,
steps: [ {
color: 2,
durationMs: 250
}, {
color: 7,
durationMs: 250
}, {
color: 2,
durationMs: 250
}, {
color: 7,
durationMs: 250
}, {
color: 2,
durationMs: 1e3
} ]
} ]
}, {
bid: 31,
patterns: [ {
matchColor: 2,
steps: [ {
color: 2,
durationMs: 250
}, {
color: 1,
durationMs: 250
}, {
color: 2,
durationMs: 250
}, {
color: 1,
durationMs: 250
}, {
color: 2,
durationMs: 1e3
} ]
} ]
}, {
bid: 18,
patterns: [ {
matchColor: 4,
steps: [ {
color: 4,
durationMs: 250
}, {
color: 2,
durationMs: 250
}, {
color: 4,
durationMs: 250
}, {
color: 2,
durationMs: 250
}, {
color: 4,
durationMs: 1e3
} ]
} ]
}, {
bid: 55,
patterns: [ {
matchColor: 5,
steps: [ {
color: 5,
durationMs: 200
}, {
color: 3,
durationMs: 200
}, {
color: 7,
durationMs: 300
}, {
color: 6,
durationMs: 300
} ]
} ]
}, {
bid: 53,
patterns: [ {
matchColor: 5,
steps: [ {
color: 5,
durationMs: 300
}, {
color: 7,
durationMs: 300
}, {
color: 3,
durationMs: 300
}, {
color: 6,
durationMs: 300
} ]
} ]
}, {
bid: 35,
patterns: [ {
matchColor: 5,
steps: [ {
color: 5,
durationMs: 300
}, {
color: 7,
durationMs: 300
}, {
color: 3,
durationMs: 300
}, {
color: 1,
durationMs: 300
} ]
} ]
}, {
bid: 61,
patterns: [ {
matchColor: 5,
steps: [ {
color: 5,
durationMs: 300
}, {
color: 7,
durationMs: 300
}, {
color: 3,
durationMs: 300
}, {
color: 4,
durationMs: 300
} ]
} ]
}, {
bid: 144,
patterns: [ {
matchColor: 2,
steps: [ {
color: 2,
durationMs: 300
}, {
color: 1,
durationMs: 300
}, {
color: 7,
durationMs: 300
}, {
color: 5,
durationMs: 400
} ]
} ]
}, {
bid: 44,
patterns: [ {
matchColor: 5,
steps: [ {
color: 5,
durationMs: 600
}, {
color: 7,
durationMs: 400
}, {
color: 3,
durationMs: 400
}, {
color: 4,
durationMs: 400
} ]
} ]
}, {
bid: 52,
patterns: [ {
matchColor: 5,
steps: [ {
color: 5,
durationMs: 600
}, {
color: 7,
durationMs: 400
}, {
color: 3,
durationMs: 400
}, {
color: 4,
durationMs: 400
} ]
} ]
}, {
bid: 16,
patterns: [ {
matchColor: 7,
steps: [ {
color: 7,
durationMs: 600
}, {
color: 4,
durationMs: 300
}, {
color: 3,
durationMs: 300
}, {
color: 6,
durationMs: 300
} ]
} ]
}, {
bid: 41,
patterns: [ {
matchColor: 2,
steps: [ {
color: 2,
durationMs: 200
}, {
color: 2,
durationMs: 200
}, {
color: 6,
durationMs: 600
}, {
color: 3,
durationMs: 200
} ]
} ]
}, {
bid: 162,
patterns: [ {
matchColor: 2,
steps: [ {
color: 2,
durationMs: 200
}, {
color: 6,
durationMs: 200
}, {
color: 7,
durationMs: 600
}, {
color: 3,
durationMs: 200
} ]
} ]
}, {
bid: 86,
patterns: [ {
matchColor: 1,
steps: [ {
color: 1,
durationMs: 200
}, {
color: 6,
durationMs: 200
}, {
color: 5,
durationMs: 200
}, {
color: 3,
durationMs: 400
} ]
} ]
}, {
bid: 127,
patterns: [ {
matchColor: 5,
steps: [ {
color: 5,
durationMs: 200
}, {
color: 3,
durationMs: 200
}, {
color: 7,
durationMs: 200
}, {
color: 6,
durationMs: 600
} ]
} ]
}, {
bid: 152,
patterns: [ {
matchColor: 2,
steps: [ {
color: 2,
durationMs: 200
}, {
color: 3,
durationMs: 200
}, {
color: 7,
durationMs: 200
}, {
color: 6,
durationMs: 600
} ]
} ]
}, {
bid: 128,
patterns: [ {
matchColor: 2,
steps: [ {
color: 2,
durationMs: 200
}, {
color: 3,
durationMs: 200
}, {
color: 7,
durationMs: 200
}, {
color: 6,
durationMs: 600
} ]
} ]
}, {
bid: 94,
patterns: [ {
matchColor: 5,
steps: [ {
color: 5,
durationMs: 600
}, {
color: 4,
durationMs: 400
}, {
color: 2,
durationMs: 600
}, {
color: 4,
durationMs: 400
} ]
} ]
}, {
bid: 147,
patterns: [ {
matchColor: 2,
steps: [ {
color: 2,
durationMs: 600
}, {
color: 4,
durationMs: 400
}, {
color: 3,
durationMs: 400
}, {
color: 5,
durationMs: 400
} ]
} ]
}, {
bid: 82,
patterns: [ {
matchColor: 5,
steps: [ {
color: 5,
durationMs: 600
}, {
color: 2,
durationMs: 200
}, {
color: 4,
durationMs: 200
}, {
color: 3,
durationMs: 200
}, {
color: 7,
durationMs: 200
}, {
color: 6,
durationMs: 200
} ]
} ]
}, {
bid: 137,
patterns: [ {
matchColor: 5,
steps: [ {
color: 5,
durationMs: 600
}, {
color: 2,
durationMs: 400
}, {
color: 4,
durationMs: 400
}, {
color: 3,
durationMs: 400
}, {
color: 7,
durationMs: 200
}, {
color: 6,
durationMs: 200
} ]
} ]
}, {
bid: 59,
patterns: [ {
matchColor: 1,
steps: [ {
color: 1,
durationMs: 400
}, {
color: 5,
durationMs: 400
}, {
color: 7,
durationMs: 600
}, {
color: 4,
durationMs: 400
}, {
color: 6,
durationMs: 200
}, {
color: 2,
durationMs: 400
} ]
} ]
}, {
bid: 68,
patterns: [ {
matchColor: 3,
steps: [ {
color: 3,
durationMs: 400
}, {
color: 5,
durationMs: 400
}, {
color: 7,
durationMs: 600
}, {
color: 4,
durationMs: 400
}, {
color: 6,
durationMs: 200
}, {
color: 2,
durationMs: 400
}, {
color: 1,
durationMs: 400
}, {
color: 3,
durationMs: 200
}, {
color: 5,
durationMs: 200
}, {
color: 7,
durationMs: 200
}, {
color: 4,
durationMs: 200
}, {
color: 6,
durationMs: 200
}, {
color: 2,
durationMs: 200
}, {
color: 1,
durationMs: 200
} ]
} ]
}, {
bid: 85,
patterns: [ {
matchColor: 3,
steps: [ {
color: 3,
durationMs: 400
}, {
color: 5,
durationMs: 400
}, {
color: 7,
durationMs: 600
}, {
color: 4,
durationMs: 400
}, {
color: 6,
durationMs: 200
}, {
color: 2,
durationMs: 400
}, {
color: 1,
durationMs: 400
}, {
color: 3,
durationMs: 200
}, {
color: 5,
durationMs: 200
}, {
color: 7,
durationMs: 200
}, {
color: 4,
durationMs: 200
}, {
color: 6,
durationMs: 200
}, {
color: 2,
durationMs: 200
}, {
color: 1,
durationMs: 200
} ]
} ]
}, {
bid: 50,
patterns: [ {
matchColor: 2,
steps: [ {
color: 2,
durationMs: 600
}, {
color: 5,
durationMs: 400
}, {
color: 7,
durationMs: 400
}, {
color: 4,
durationMs: 400
}, {
color: 6,
durationMs: 400
} ]
} ]
}, {
bid: 42,
patterns: [ {
matchColor: 2,
steps: [ {
color: 2,
durationMs: 400
}, {
color: 7,
durationMs: 400
}, {
color: 1,
durationMs: 400
}, {
color: 6,
durationMs: 400
}, {
color: 5,
durationMs: 400
}, {
color: 3,
durationMs: 400
}, {
color: 4,
durationMs: 600
}, {
color: 5,
durationMs: 200
}, {
color: 7,
durationMs: 200
}, {
color: 1,
durationMs: 200
}, {
color: 6,
durationMs: 200
}, {
color: 2,
durationMs: 200
}, {
color: 3,
durationMs: 200
} ]
} ]
}, {
bid: 69,
patterns: [ {
matchColor: 4,
steps: [ {
color: 4,
durationMs: 600
}, {
color: 7,
durationMs: 400
}, {
color: 1,
durationMs: 400
}, {
color: 6,
durationMs: 400
}, {
color: 2,
durationMs: 400
}, {
color: 3,
durationMs: 400
}, {
color: 4,
durationMs: 600
}, {
color: 5,
durationMs: 200
}, {
color: 7,
durationMs: 200
}, {
color: 1,
durationMs: 200
}, {
color: 6,
durationMs: 200
}, {
color: 2,
durationMs: 200
}, {
color: 3,
durationMs: 200
} ]
} ]
}, {
bid: 71,
patterns: [ {
matchColor: 1,
steps: [ {
color: 1,
durationMs: 400
}, {
color: 7,
durationMs: 400
}, {
color: 4,
durationMs: 400
}, {
color: 6,
durationMs: 400
}, {
color: 2,
durationMs: 400
}, {
color: 3,
durationMs: 400
}, {
color: 4,
durationMs: 600
}, {
color: 5,
durationMs: 200
}, {
color: 7,
durationMs: 200
}, {
color: 1,
durationMs: 200
}, {
color: 6,
durationMs: 200
}, {
color: 2,
durationMs: 200
}, {
color: 3,
durationMs: 200
} ]
} ]
}, {
bid: 80,
patterns: [ {
matchColor: 1,
steps: [ {
color: 1,
durationMs: 400
}, {
color: 7,
durationMs: 400
}, {
color: 4,
durationMs: 400
}, {
color: 6,
durationMs: 400
}, {
color: 2,
durationMs: 400
}, {
color: 3,
durationMs: 400
}, {
color: 4,
durationMs: 600
}, {
color: 5,
durationMs: 200
}, {
color: 7,
durationMs: 200
}, {
color: 1,
durationMs: 200
}, {
color: 6,
durationMs: 200
}, {
color: 2,
durationMs: 200
}, {
color: 3,
durationMs: 200
} ]
} ]
}, {
bid: 84,
patterns: [ {
matchColor: 7,
steps: [ {
color: 7,
durationMs: 400
}, {
color: 4,
durationMs: 400
}, {
color: 1,
durationMs: 400
}, {
color: 6,
durationMs: 400
}, {
color: 2,
durationMs: 400
}, {
color: 3,
durationMs: 400
}, {
color: 4,
durationMs: 200
}, {
color: 5,
durationMs: 200
}, {
color: 7,
durationMs: 200
}, {
color: 1,
durationMs: 200
}, {
color: 6,
durationMs: 200
}, {
color: 2,
durationMs: 200
}, {
color: 3,
durationMs: 200
} ]
} ]
}, {
bid: 87,
patterns: [ {
matchColor: 7,
steps: [ {
color: 7,
durationMs: 200
}, {
color: 4,
durationMs: 200
}, {
color: 1,
durationMs: 200
}, {
color: 6,
durationMs: 200
}, {
color: 2,
durationMs: 200
}, {
color: 3,
durationMs: 200
}, {
color: 5,
durationMs: 200
} ]
} ]
}, {
bid: 110,
patterns: [ {
matchColor: 2,
steps: [ {
color: 2,
durationMs: 400
}, {
color: 4,
durationMs: 400
}, {
color: 1,
durationMs: 400
}, {
color: 6,
durationMs: 400
}, {
color: 2,
durationMs: 400
}, {
color: 3,
durationMs: 400
}, {
color: 4,
durationMs: 200
}, {
color: 7,
durationMs: 200
}, {
color: 1,
durationMs: 200
}, {
color: 6,
durationMs: 200
}, {
color: 2,
durationMs: 200
}, {
color: 3,
durationMs: 200
} ]
} ]
}, {
bid: 112,
patterns: [ {
matchColor: 2,
steps: [ {
color: 2,
durationMs: 400
}, {
color: 4,
durationMs: 200
}, {
color: 3,
durationMs: 200
}, {
color: 7,
durationMs: 200
}, {
color: 2,
durationMs: 600
}, {
color: 4,
durationMs: 400
}, {
color: 3,
durationMs: 400
}, {
color: 7,
durationMs: 400
} ]
} ]
}, {
bid: 138,
patterns: [ {
matchColor: 7,
steps: [ {
color: 7,
durationMs: 400
}, {
color: 2,
durationMs: 200
}, {
color: 6,
durationMs: 400
}, {
color: 2,
durationMs: 200
}, {
color: 5,
durationMs: 400
}, {
color: 2,
durationMs: 200
}, {
color: 3,
durationMs: 400
}, {
color: 2,
durationMs: 200
} ]
} ]
}, {
bid: 163,
patterns: [ {
matchColor: 5,
steps: [ {
color: 5,
durationMs: 600
}, {
color: 7,
durationMs: 400
}, {
color: 3,
durationMs: 400
}, {
color: 4,
durationMs: 400
}, {
color: 5,
durationMs: 400
}, {
color: 7,
durationMs: 200
}, {
color: 3,
durationMs: 200
}, {
color: 4,
durationMs: 200
} ]
} ]
} ]
};
cc._RF.pop();
}, {} ],
NewUserBoardDiffAnimInfo: [ function(o, r, e) {
"use strict";
cc._RF.push(r, "9639ccnVf5L1KnPZb9dnWSG", "NewUserBoardDiffAnimInfo");
var t = this && this.__values || function(o) {
var r = "function" == typeof Symbol && Symbol.iterator, e = r && o[r], t = 0;
if (e) return e.call(o);
if (o && "number" == typeof o.length) return {
next: function() {
o && t >= o.length && (o = void 0);
return {
value: o && o[t++],
done: !o
};
}
};
throw new TypeError(r ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.newUserBoardDiffAnimInfo = e.NewUserBoardDiffAnimInfo = void 0;
var a = o("../configs/NewUserBoardDiffAnimConfig"), s = o("../types/NewUserBoardDiffType"), i = o("./NewUserBoardDiffInfo"), n = function() {
function o() {
this.running = !1;
this.activeAnimNodes = new WeakSet();
this.touchStartAtMs = 0;
this.touching = !1;
}
o.prototype.clear = function() {
this.stopInitBoardAnim();
this.running = !1;
this.activeAnimNodes = new WeakSet();
this.touchStartAtMs = 0;
this.touching = !1;
};
o.prototype.stopInitBoardAnim = function() {
var o, r, e, t;
if (this.running) {
this.running = !1;
this.activeAnimNodes = new WeakSet();
var a = null === (o = hs.boardRendererInfo) || void 0 === o ? void 0 : o.blocks;
if (a) for (var n = 0; n < Object.keys(a).length; n++) {
var l = a[n];
if (l) for (var d = 0; d < Object.keys(l).length; d++) {
var c = l[d];
if (c && cc.isValid(c)) {
var u = c.getComponent(hs.Block), f = null !== (e = null === (r = null == u ? void 0 : u.block) || void 0 === r ? void 0 : r.node) && void 0 !== e ? e : null;
if (f && cc.isValid(f)) {
null === (t = f.stopActionByTag) || void 0 === t || t.call(f, s.INIT_BOARD_ANIM_ACTION_TAG);
i.newUserBoardDiffInfo.resetManualInitBoardBlockColor(u);
}
}
}
}
}
};
o.prototype.buildPatternAction = function(o, r) {
var e, a;
if (!r || r.length <= 0) return null;
var s = [], i = function(r) {
var e = r.durationMs / 1e3;
if (!Number.isFinite(e) || e <= 0) return "continue";
s.push(cc.callFunc(function() {
return o(r.color);
}));
s.push(cc.delayTime(e));
};
try {
for (var n = t(r), l = n.next(); !l.done; l = n.next()) i(l.value);
} catch (o) {
e = {
error: o
};
} finally {
try {
l && !l.done && (a = n.return) && a.call(n);
} finally {
if (e) throw e.error;
}
}
return s.length <= 0 ? null : cc.repeatForever(cc.sequence(s));
};
o.prototype.isInAnim = function(o) {
return !(!o || !cc.isValid(o)) && this.running && this.activeAnimNodes.has(o);
};
o.prototype.runPatternActionForPosition = function(o, r, e, t) {
var a, n, l, d, c, u, f = i.newUserBoardDiffInfo.positionColorMap[o], p = r.get(f);
if (!p) return !1;
var h = o.split("_"), B = parseInt(h[0], 10), _ = parseInt(h[1], 10);
if (!Number.isFinite(B) || !Number.isFinite(_)) return !1;
var I = null === (a = e[B]) || void 0 === a ? void 0 : a[_];
if ("number" != typeof I || I !== f) return !1;
var y = null === (n = null == t ? void 0 : t[B]) || void 0 === n ? void 0 : n[_];
if (!y || !cc.isValid(y)) return !1;
var b = y.getComponent(hs.Block), g = null !== (d = null === (l = null == b ? void 0 : b.block) || void 0 === l ? void 0 : l.node) && void 0 !== d ? d : null;
if (!g || !cc.isValid(g)) return !1;
var m = this.buildPatternAction(function(o) {
i.newUserBoardDiffInfo.setBlockColor(b, o, !1);
}, p.steps);
if (!m) return !1;
null === (c = g.stopActionByTag) || void 0 === c || c.call(g, s.INIT_BOARD_ANIM_ACTION_TAG);
null === (u = m.setTag) || void 0 === u || u.call(m, s.INIT_BOARD_ANIM_ACTION_TAG);
this.activeAnimNodes.add(g);
g.runAction(m);
return !0;
};
o.prototype.startInitboardAnim = function() {
var o, r, e, s, n, l, d, c = a.NEW_USER_BOARD_DIFF_INIT_BOARD_ANIM_CONFIG;
if (c && 1 === c.enabled && !this.running) {
var u = i.newUserBoardDiffInfo.boardId, f = i.newUserBoardDiffInfo.positionColorMap, p = Cinst(hs.Board), h = null !== (l = null === (n = null == p ? void 0 : p.state) || void 0 === n ? void 0 : n.boards) && void 0 !== l ? l : null, B = null === (d = hs.boardRendererInfo) || void 0 === d ? void 0 : d.blocks;
if (!(u <= 0 || !f || Object.keys(f).length <= 0) && Array.isArray(h) && B) {
var _ = Array.isArray(c.boards) ? c.boards.find(function(o) {
return o && o.bid === u;
}) : null, I = c.patterns;
_ && Array.isArray(_.patterns) && (I = _.patterns);
if (I && !(I.length <= 0)) {
var y = new Map();
try {
for (var b = t(I), g = b.next(); !g.done; g = b.next()) {
var m = g.value;
"number" == typeof (null == m ? void 0 : m.matchColor) && Array.isArray(m.steps) && m.steps.length > 0 && y.set(m.matchColor, {
steps: m.steps
});
}
} catch (r) {
o = {
error: r
};
} finally {
try {
g && !g.done && (r = b.return) && r.call(b);
} finally {
if (o) throw o.error;
}
}
if (!(y.size <= 0)) {
var D = 0;
try {
for (var M = t(Object.keys(f)), C = M.next(); !C.done; C = M.next()) {
var S = C.value;
this.runPatternActionForPosition(S, y, h, B) && (D += 1);
}
} catch (o) {
e = {
error: o
};
} finally {
try {
C && !C.done && (s = M.return) && s.call(M);
} finally {
if (e) throw e.error;
}
}
D > 0 && (this.running = !0);
}
}
}
}
};
return o;
}();
e.NewUserBoardDiffAnimInfo = n;
e.newUserBoardDiffAnimInfo = new n();
cc._RF.pop();
}, {
"../configs/NewUserBoardDiffAnimConfig": "NewUserBoardDiffAnimConfig",
"../types/NewUserBoardDiffType": "NewUserBoardDiffType",
"./NewUserBoardDiffInfo": "NewUserBoardDiffInfo"
} ],
NewUserBoardDiffConfig: [ function(o, r, e) {
"use strict";
cc._RF.push(r, "bc72cPyeHhE26UE5kBvYlrj", "NewUserBoardDiffConfig");
Object.defineProperty(e, "__esModule", {
value: !0
});
e.NewUserBoardDiffConfig = e.TOTAL_BOARD_COUNT = void 0;
e.TOTAL_BOARD_COUNT = 164;
e.NewUserBoardDiffConfig = [ {
boardId: 1,
boardData: [ [ -1, -1, -1, 2, 2, 2, -1, -1 ], [ -1, -1, 2, 2, 2, 2, 2, -1 ], [ -1, -1, 2, 7, 2, 7, 2, -1 ], [ -1, 2, 2, 2, 4, 2, 2, 2 ], [ -1, 2, 2, 2, 2, 2, 2, 2 ], [ -1, -1, 2, 2, 2, 2, 2, -1 ], [ -1, -1, -1, 4, -1, 4, -1, -1 ], [ 6, 6, 6, -1, -1, -1, 6, 6 ] ],
producerBlocks: [ 24, 10, 32 ],
blocksColors: [ 7, 2, 4 ],
guideTargetCell: {
row: 7,
col: 4
},
move: [ {
x: 0,
y: -553.75
}, {
x: 0,
y: -245.75
} ],
spineTargetPositions: [ [ 7, 3 ], [ 7, 4 ], [ 7, 5 ] ]
}, {
boardId: 2,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 4, 4, -1, -1, -1, -1 ], [ -1, -1, 4, 4, -1, 4, -1, -1 ], [ 4, 4, 7, 7, 4, 4, -1, -1 ], [ 4, -1, 7, 7, -1, -1, 1, 1 ], [ -1, -1, 7, 7, 4, -1, 1, 1 ], [ -1, -1, 4, -1, -1, 6, -1, -1 ], [ -1, 6, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 25, 15, 9 ],
blocksColors: [ 7, 4, 4 ]
}, {
boardId: 3,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 5, 1, 2, 3, -1, -1 ], [ -1, -1, 6, -1, -1, 4, -1, -1 ], [ -1, -1, 7, -1, -1, -1, -1, -1 ], [ -1, -1, 4, 3, 2, 1, -1, -1 ], [ -1, -1, -1, -1, -1, 5, -1, -1 ], [ -1, -1, 1, -1, -1, 6, -1, -1 ], [ -1, -1, 2, 3, 4, 7, -1, -1 ] ],
producerBlocks: [ 9, 17, 28 ],
blocksColors: [ 2, 2, 7 ]
}, {
boardId: 4,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 7, -1, 7, -1, -1, -1 ], [ -1, 7, 1, 7, 1, 7, -1, -1 ], [ -1, 7, 7, 4, 7, 7, -1, -1 ], [ -1, -1, 7, 7, 7, -1, -1, 4 ], [ -1, -1, 7, 7, 7, 4, 4, -1 ], [ -1, -1, 7, 7, 7, 7, -1, -1 ], [ -1, 7, 7, 7, 7, 7, 7, -1 ] ],
producerBlocks: [ 9, 26, 25 ],
blocksColors: [ 2, 4, 1 ]
}, {
boardId: 5,
boardData: [ [ -1, -1, 2, 2, -1, -1, -1, -1 ], [ -1, 2, 4, 1, 4, 4, -1, -1 ], [ -1, 2, 4, 4, 4, -1, -1, -1 ], [ -1, 2, 4, 4, -1, -1, -1, -1 ], [ -1, -1, 2, 4, 4, -1, -1, -1 ], [ 7, -1, -1, 4, 4, -1, -1, -1 ], [ 7, -1, 7, 7, 4, -1, -1, -1 ], [ -1, 7, 7, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 31, 20, 35 ],
blocksColors: [ 4, 2, 7 ]
}, {
boardId: 6,
boardData: [ [ 4, -1, -1, -1, -1, -1, -1, 7 ], [ 3, 6, -1, -1, -1, -1, 4, 6 ], [ 2, -1, 5, 1, 2, 3, 7, 5 ], [ 1, -1, -1, -1, -1, -1, -1, 1 ], [ 5, -1, 7, -1, -1, 7, -1, 2 ], [ 6, -1, -1, -1, -1, -1, -1, 3 ], [ 7, -1, -1, -1, -1, -1, -1, 4 ], [ -1, 4, 3, 2, 1, 5, 6, -1 ] ],
producerBlocks: [ 20, 9, 15 ],
blocksColors: [ 2, 4, 7 ]
}, {
boardId: 7,
boardData: [ [ -1, -1, 2, 2, -1, -1, -1, -1 ], [ -1, 4, 2, -1, 2, -1, -1, -1 ], [ -1, 2, -1, -1, 2, -1, -1, -1 ], [ -1, -1, -1, 2, -1, -1, 4, 4 ], [ -1, -1, 2, -1, -1, 4, 2, 2 ], [ -1, 2, 2, 2, 4, 4, 2, -1 ], [ -1, -1, 2, 2, 2, 2, -1, -1 ], [ -1, 7, 7, 7, 7, 7, 7, 7 ] ],
producerBlocks: [ 19, 14, 32 ],
blocksColors: [ 7, 6, 5 ]
}, {
boardId: 8,
boardData: [ [ -1, -1, 7, -1, -1, 7, -1, -1 ], [ -1, -1, 2, -1, -1, 2, -1, -1 ], [ 7, 2, -1, 2, 2, -1, 2, 7 ], [ -1, -1, 2, -1, -1, 2, -1, -1 ], [ -1, -1, 2, -1, -1, 2, -1, -1 ], [ 7, 2, -1, 2, 2, -1, 2, 7 ], [ -1, -1, 2, -1, -1, 2, -1, -1 ], [ -1, -1, 7, -1, -1, 7, -1, -1 ] ],
producerBlocks: [ 41, 39, 9 ],
blocksColors: [ 6, 4, 7 ]
}, {
boardId: 9,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, 3, 3, 3, 3, 3, -1, -1 ], [ -1, 4, 1, 5, 6, 7, -1, -1 ], [ -1, 3, -1, -1, -1, 3, -1, -1 ], [ -1, -1, -1, 2, -1, -1, -1, -1 ], [ -1, 3, -1, -1, -1, 3, -1, -1 ], [ -1, 7, 6, 5, 1, 4, -1, -1 ], [ -1, 3, 3, 3, 3, 3, -1, -1 ] ],
producerBlocks: [ 29, 24, 11 ],
blocksColors: [ 5, 2, 4 ]
}, {
boardId: 10,
boardData: [ [ -1, -1, 2, -1, -1, -1, -1, -1 ], [ -1, -1, 2, -1, 4, -1, -1, -1 ], [ -1, -1, 2, 4, -1, -1, -1, -1 ], [ -1, 2, 4, -1, -1, -1, -1, -1 ], [ -1, 2, 2, -1, -1, -1, 2, -1 ], [ -1, -1, 2, 4, 4, 2, -1, -1 ], [ -1, 2, 2, 2, 2, 2, 2, -1 ], [ 4, 2, -1, -1, -1, 4, 2, -1 ] ],
producerBlocks: [ 20, 19, 25 ],
blocksColors: [ 4, 2, 6 ]
}, {
boardId: 11,
boardData: [ [ 2, 2, 3, 2, 2, 2, 7, -1 ], [ 2, 6, 2, 2, 2, 7, -1, 2 ], [ 5, 2, 2, 2, 7, -1, 2, 7 ], [ 2, 2, 2, 7, -1, 2, 7, 7 ], [ 2, 2, 7, -1, 2, 7, 7, 7 ], [ 2, 7, -1, 2, 7, 7, 7, 5 ], [ 7, -1, 2, 7, 7, 7, 6, 7 ], [ -1, 2, 7, 7, 7, 3, 7, 7 ] ],
producerBlocks: [ 41, 41, 38 ],
blocksColors: [ 6, 6, 1 ]
}, {
boardId: 12,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, 4, 6, 1, 2, -1 ], [ -1, -1, -1, 3, -1, -1, 3, -1 ], [ -1, -1, -1, 2, -1, -1, 4, -1 ], [ -1, -1, -1, 1, 5, 6, 7, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 13, 9, 13 ],
blocksColors: [ 7, 4, 2 ]
}, {
boardId: 13,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, 3, 2, 3, -1, -1 ], [ -1, -1, -1, 2, 5, 2, -1, -1 ], [ -1, -1, -1, 3, 2, 3, -1, -1 ], [ -1, -1, 1, 1, 1, 1, 1, -1 ], [ -1, -1, -1, -1, -1, 7, 7, -1 ], [ -1, -1, -1, 6, 6, 6, -1, -1 ] ],
producerBlocks: [ 35, 34, 22 ],
blocksColors: [ 2, 6, 2 ]
}, {
boardId: 14,
boardData: [ [ -1, 4, -1, -1, -1, -1, 4, -1 ], [ -1, -1, 4, -1, -1, 4, -1, -1 ], [ 4, 4, 4, -1, -1, 4, 4, 4 ], [ 4, -1, -1, -1, -1, -1, -1, 4 ], [ -1, -1, 6, -1, -1, 6, -1, -1 ], [ 4, -1, -1, -1, -1, -1, -1, 4 ], [ 4, 4, 4, -1, -1, 4, 4, 4 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 18, 14, 9 ],
blocksColors: [ 7, 2, 1 ]
}, {
boardId: 15,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, 2, 2, -1 ], [ 4, -1, -1, -1, -1, 7, 7, 2 ], [ -1, 4, -1, -1, -1, 7, -1, -1 ], [ -1, -1, 7, 7, 7, 7, -1, -1 ], [ -1, -1, 7, 7, 7, 7, -1, -1 ], [ -1, -1, 3, -1, -1, 3, -1, -1 ] ],
producerBlocks: [ 15, 9, 27 ],
blocksColors: [ 6, 4, 5 ]
}, {
boardId: 16,
boardData: [ [ -1, 1, -1, 5, 5, -1, 1, -1 ], [ 1, 1, -1, 5, 5, -1, 1, 1 ], [ 1, -1, 7, 5, 5, 7, -1, 1 ], [ 1, 1, -1, 5, 5, -1, 1, 1 ], [ -1, 1, -1, 5, 5, -1, 1, -1 ], [ -1, 1, -1, 2, 2, -1, 1, -1 ], [ 5, 5, 2, -1, -1, 2, 5, 5 ], [ 5, 5, 2, -1, -1, 2, 5, 5 ] ],
producerBlocks: [ 23, 9, 24 ],
blocksColors: [ 6, 4, 7 ]
}, {
boardId: 17,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 4, 7, 3, 4, -1, -1 ], [ -1, 1, -1, -1, -1, -1, 1, -1 ], [ 6, -1, -1, -1, -1, -1, -1, 6 ], [ 5, -1, 2, -1, -1, 2, -1, 5 ], [ -1, 7, -1, -1, -1, -1, 7, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 16, 19, 36 ],
blocksColors: [ 1, 2, 5 ]
}, {
boardId: 18,
boardData: [ [ -1, -1, -1, -1, 4, -1, -1, 4 ], [ -1, -1, 7, 7, -1, 2, 2, -1 ], [ -1, 7, 7, 7, 7, 2, 2, -1 ], [ -1, 7, 7, 7, 7, 2, 2, -1 ], [ -1, 7, 7, 7, 7, 2, 2, -1 ], [ -1, 2, 2, 2, 2, 2, 2, -1 ], [ 2, 2, 2, 2, 2, 2, 2, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 4, 14, 5 ],
blocksColors: [ 4, 5, 6 ]
}, {
boardId: 19,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, 5, -1, 5, -1 ], [ 6, 6, 6, 6, 6, 6, 6, -1 ], [ -1, -1, -1, 6, 6, 6, 6, 6 ], [ -1, 6, 6, 6, 6, 6, 6, -1 ] ],
producerBlocks: [ 34, 30, 11 ],
blocksColors: [ 2, 3, 1 ]
}, {
boardId: 20,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ 2, 7, 4, -1, -1, 2, 4, 2 ], [ 3, -1, -1, -1, -1, -1, -1, 1 ], [ -1, -1, 6, -1, -1, 5, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 14, 18, 9 ],
blocksColors: [ 4, 4, 2 ]
}, {
boardId: 21,
boardData: [ [ -1, -1, 3, -1, -1, 3, -1, -1 ], [ -1, -1, 5, 6, 1, 7, -1, -1 ], [ -1, -1, 3, -1, -1, 3, -1, -1 ], [ -1, -1, -1, 4, 4, -1, -1, -1 ], [ -1, -1, -1, 4, 4, -1, -1, -1 ], [ -1, -1, 3, -1, -1, 3, -1, -1 ], [ -1, -1, 7, 1, 6, 5, -1, -1 ], [ -1, -1, 3, -1, -1, 3, -1, -1 ] ],
producerBlocks: [ 2, 3, 35 ],
blocksColors: [ 6, 6, 3 ]
}, {
boardId: 22,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, 3, 3, 3, -1 ], [ -1, -1, -1, 3, 4, 4, 4, 3 ], [ -1, -1, -1, 3, 4, 4, 4, 3 ], [ 6, -1, 6, -1, 4, 4, 4, -1 ], [ -1, 6, -1, 4, 4, 4, 4, 4 ], [ -1, -1, 6, -1, 6, 6, 6, -1 ], [ -1, -1, -1, 6, 6, 6, -1, -1 ] ],
producerBlocks: [ 41, 38, 34 ],
blocksColors: [ 7, 2, 7 ]
}, {
boardId: 23,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ 4, 4, -1, 7, 7, -1, 3, -1 ], [ 4, -1, -1, 7, -1, -1, 3, -1 ], [ 4, 4, -1, 7, 7, -1, 3, 3 ] ],
producerBlocks: [ 25, 25, 12 ],
blocksColors: [ 5, 4, 5 ]
}, {
boardId: 24,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 1, 7, 5, -1, -1, -1 ], [ -1, -1, -1, -1, 7, -1, -1, -1 ], [ -1, -1, -1, -1, 1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, 6, 2, 4 ], [ -1, -1, -1, -1, -1, 2, -1, -1 ], [ -1, -1, -1, -1, -1, 4, -1, -1 ] ],
producerBlocks: [ 9, 9, 13 ],
blocksColors: [ 7, 2, 2 ]
}, {
boardId: 25,
boardData: [ [ -1, -1, -1, 1, 1, 1, -1, -1 ], [ -1, -1, 7, 7, 7, 7, 7, -1 ], [ -1, -1, 7, 7, 7, 7, 7, -1 ], [ 1, -1, 7, 4, 7, 4, 7, -1 ], [ 1, -1, 7, 7, 7, 7, 7, -1 ], [ 1, -1, -1, 7, 7, 7, -1, -1 ], [ -1, 1, -1, -1, 7, -1, -1, -1 ], [ -1, -1, 1, 1, -1, -1, -1, -1 ] ],
producerBlocks: [ 32, 18, 7 ],
blocksColors: [ 6, 2, 7 ]
}, {
boardId: 26,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, 5, -1, -1 ], [ 7, 7, 7, -1, -1, -1, 5, -1 ], [ -1, 7, 7, 3, 3, 3, 5, 5 ], [ 7, 7, 7, -1, -1, -1, 5, -1 ], [ -1, -1, -1, -1, -1, 5, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 15, 10, 25 ],
blocksColors: [ 6, 5, 5 ]
}, {
boardId: 27,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 3, -1, 3, 2, -1, -1 ], [ -1, -1, -1, -1, 2, 2, -1, -1 ], [ -1, -1, -1, -1, 7, 2, -1, -1 ], [ -1, -1, -1, -1, 7, 7, -1, -1 ], [ -1, -1, -1, 3, 7, 3, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 25, 20, 11 ],
blocksColors: [ 2, 7, 3 ]
}, {
boardId: 28,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ 6, 6, 6, -1, 6, 6, 6, -1 ], [ 6, 2, 2, -1, 2, 2, 6, -1 ], [ 6, 2, 2, 1, 2, 2, 6, -1 ], [ 6, 6, 6, 1, 6, 6, 6, -1 ], [ -1, 6, 2, 2, 2, 6, -1, -1 ], [ -1, 6, 6, -1, 6, 6, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 21, 5, 22 ],
blocksColors: [ 2, 2, 7 ]
}, {
boardId: 29,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, 7, 1, -1, -1, -1 ], [ -1, -1, 7, 1, 1, 1, -1, -1 ], [ -1, -1, 7, 1, 1, 1, -1, -1 ], [ -1, -1, 7, 1, 1, 1, -1, -1 ], [ -1, -1, 7, 1, 1, 1, -1, -1 ], [ -1, 1, 1, 1, 1, 1, 1, -1 ], [ -1, -1, -1, 1, 1, -1, -1, -1 ] ],
producerBlocks: [ 34, 8, 33 ],
blocksColors: [ 6, 4, 5 ]
}, {
boardId: 30,
boardData: [ [ -1, -1, -1, -1, -1, -1, 3, 3 ], [ -1, -1, -1, -1, -1, 3, 6, 3 ], [ -1, -1, -1, -1, 3, 1, 3, -1 ], [ -1, -1, -1, 3, 2, 3, -1, -1 ], [ 7, 7, 3, 4, 3, -1, -1, -1 ], [ -1, 7, 5, 3, -1, -1, -1, -1 ], [ -1, 7, 7, 7, -1, -1, -1, -1 ], [ 7, -1, -1, 7, -1, -1, -1, -1 ] ],
producerBlocks: [ 3, 12, 35 ],
blocksColors: [ 6, 4, 5 ]
}, {
boardId: 31,
boardData: [ [ 1, -1, -1, -1, -1, -1, -1, -1 ], [ 1, 1, -1, -1, -1, -1, -1, -1 ], [ 1, 1, 1, -1, 1, -1, -1, -1 ], [ 1, 1, 1, 1, 1, 1, -1, -1 ], [ -1, -1, 1, 1, 1, -1, -1, -1 ], [ -1, 2, 1, 1, 1, 1, -1, -1 ], [ -1, 4, 2, -1, 1, 1, 1, -1 ], [ -1, -1, -1, -1, 1, 1, 1, 1 ] ],
producerBlocks: [ 26, 23, 25 ],
blocksColors: [ 2, 5, 7 ]
}, {
boardId: 32,
boardData: [ [ -1, 7, -1, 3, 3, -1, 7, -1 ], [ -1, 7, -1, 3, 3, -1, 7, -1 ], [ 7, -1, 7, 3, 3, 7, -1, 7 ], [ -1, 7, -1, 3, 3, -1, 7, -1 ], [ -1, 7, -1, 3, 3, -1, 7, -1 ], [ -1, -1, -1, 4, 4, -1, -1, -1 ], [ 3, 3, 4, -1, -1, 4, 3, 3 ], [ 3, 3, 4, -1, -1, 4, 3, 3 ] ],
producerBlocks: [ 23, 9, 24 ],
blocksColors: [ 6, 5, 7 ]
}, {
boardId: 33,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 4, 3, 2, 1, 5, 6 ], [ -1, -1, -1, -1, -1, -1, -1, 7 ], [ -1, 4, 3, 2, 1, 5, -1, 4 ], [ -1, 7, -1, -1, -1, 6, -1, 3 ], [ -1, 6, -1, 3, 4, 7, -1, 2 ], [ -1, 5, -1, -1, -1, -1, -1, 1 ], [ -1, 1, 2, 3, 4, 7, 6, 5 ] ],
producerBlocks: [ 4, 34, 22 ],
blocksColors: [ 6, 5, 7 ]
}, {
boardId: 34,
boardData: [ [ 2, 2, -1, -1, -1, -1, 2, 2 ], [ -1, 2, 2, -1, -1, 2, 2, -1 ], [ 2, -1, 2, 2, 2, 2, -1, 2 ], [ 2, 2, -1, 2, 2, -1, 2, 2 ], [ 2, 2, 7, -1, -1, 7, 2, 2 ], [ -1, 2, 2, 2, 2, 2, 2, -1 ], [ -1, -1, 2, 2, 2, 2, -1, -1 ], [ -1, -1, -1, 2, 2, -1, -1, -1 ] ],
producerBlocks: [ 18, 39, 41 ],
blocksColors: [ 6, 5, 7 ]
}, {
boardId: 35,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, 5, -1 ], [ -1, -1, -1, -1, -1, 5, 2, 5 ], [ -1, 4, -1, -1, -1, 6, 5, -1 ], [ 4, 2, 4, -1, -1, 6, -1, -1 ], [ -1, 4, 6, -1, -1, 6, -1, -1 ], [ -1, -1, 6, -1, -1, 6, -1, -1 ], [ -1, -1, 6, -1, -1, 6, -1, -1 ] ],
producerBlocks: [ 36, 19, 6 ],
blocksColors: [ 4, 4, 7 ]
}, {
boardId: 36,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, 7, 7, 7, -1, -1, -1, -1 ], [ -1, 7, 4, -1, 7, -1, -1, -1 ], [ -1, 7, -1, 4, 7, -1, -1, -1 ], [ -1, 7, 7, 7, 7, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 41, 7, 35 ],
blocksColors: [ 6, 3, 5 ]
}, {
boardId: 37,
boardData: [ [ 4, 6, -1, -1, -1, -1, -1, -1 ], [ 3, -1, -1, -1, -1, -1, -1, -1 ], [ 2, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ 1, 3, -1, -1, -1, -1, -1, -1 ], [ 5, 7, 1, -1, -1, -1, -1, -1 ], [ 6, 4, 1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 19, 14, 25 ],
blocksColors: [ 2, 7, 5 ]
}, {
boardId: 38,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 4, 4, -1, -1, -1, -1 ], [ -1, -1, 4, 4, 3, -1, -1, -1 ], [ -1, -1, -1, 3, -1, 6, -1, -1 ], [ -1, -1, -1, -1, 6, 2, 2, -1 ], [ -1, -1, -1, -1, -1, 2, 2, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 41, 23, 12 ],
blocksColors: [ 1, 1, 7 ]
}, {
boardId: 39,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 4, -1, 4, -1, -1, -1 ], [ -1, 4, 1, 4, 1, 4, -1, -1 ], [ -1, -1, 4, 7, 4, -1, -1, -1 ], [ -1, -1, -1, 4, -1, -1, -1, -1 ], [ -1, -1, -1, 4, -1, -1, -1, 7 ], [ -1, -1, -1, 4, 4, 7, 7, -1 ], [ -1, -1, 4, 4, 4, 4, -1, -1 ] ],
producerBlocks: [ 19, 26, 14 ],
blocksColors: [ 6, 5, 5 ]
}, {
boardId: 40,
boardData: [ [ 1, 5, -1, -1, -1, -1, 5, 1 ], [ 5, 1, 5, -1, -1, 5, 1, 5 ], [ -1, 5, 1, 2, 2, 1, 5, -1 ], [ -1, -1, 2, -1, -1, 2, -1, -1 ], [ -1, -1, 2, -1, -1, 2, -1, -1 ], [ -1, 5, 1, 2, 2, 1, 5, -1 ], [ 5, 1, 5, -1, -1, 5, 1, 5 ], [ 1, 5, -1, -1, -1, -1, 5, 1 ] ],
producerBlocks: [ 19, 9, 14 ],
blocksColors: [ 6, 7, 5 ]
}, {
boardId: 41,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ 2, 2, 2, -1, 2, 2, 2, -1 ], [ 2, 1, 2, -1, 2, 1, 2, -1 ], [ 2, 2, 2, -1, 2, 2, 2, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, 7, -1, -1, -1, 7, -1, -1 ], [ -1, -1, 7, 7, 7, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 4, 4, 42 ],
blocksColors: [ 1, 2, 5 ]
}, {
boardId: 42,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, 6, -1, -1, -1, -1 ], [ -1, -1, 6, 6, 2, -1, -1, -1 ], [ -1, 2, 6, 6, 6, 6, -1, -1 ], [ 6, 6, 6, 6, 6, 2, 6, -1 ], [ -1, -1, -1, 3, -1, -1, -1, -1 ], [ -1, -1, -1, 3, -1, -1, -1, -1 ], [ -1, -1, -1, 3, -1, -1, -1, -1 ] ],
producerBlocks: [ 25, 20, 12 ],
blocksColors: [ 5, 4, 5 ]
}, {
boardId: 43,
boardData: [ [ -1, -1, -1, 6, 6, 6, 6, -1 ], [ -1, -1, 6, -1, 6, -1, -1, -1 ], [ -1, 3, 3, -1, 6, -1, -1, -1 ], [ 3, 3, 3, 3, -1, 6, -1, -1 ], [ 3, 3, 3, 3, -1, 3, 3, -1 ], [ -1, 3, 3, -1, 3, 3, 3, 3 ], [ -1, -1, -1, -1, 3, 3, 3, 3 ], [ -1, -1, -1, -1, -1, 3, 3, -1 ] ],
producerBlocks: [ 8, 2, 15 ],
blocksColors: [ 6, 5, 7 ]
}, {
boardId: 44,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, 5, -1, -1, -1, -1, -1, -1 ], [ 5, 2, 5, -1, -1, -1, -1, -1 ], [ -1, 5, -1, -1, 7, -1, -1, -1 ], [ -1, -1, -1, 7, 2, 7, -1, -1 ], [ -1, -1, -1, -1, 7, -1, -1, -1 ] ],
producerBlocks: [ 33, 19, 16 ],
blocksColors: [ 4, 2, 6 ]
}, {
boardId: 45,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ 3, 2, -1, -1, -1, -1, 2, 3 ], [ 5, 1, -1, -1, -1, -1, 1, 5 ], [ 7, -1, -1, -1, -1, -1, -1, 7 ], [ 7, -1, -1, -1, -1, -1, -1, 7 ], [ 7, -1, -1, 4, 4, -1, -1, 7 ], [ -1, -1, 4, -1, -1, 4, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 18, 14, 9 ],
blocksColors: [ 6, 6, 1 ]
}, {
boardId: 46,
boardData: [ [ -1, 3, 3, 3, 3, 3, -1, -1 ], [ -1, 3, 2, 3, 2, 3, -1, -1 ], [ -1, -1, 3, 3, 3, -1, -1, -1 ], [ -1, 3, -1, 3, -1, 3, -1, -1 ], [ -1, 3, -1, 3, -1, -1, 3, -1 ], [ -1, 3, -1, 3, 3, -1, 3, -1 ], [ 3, 3, -1, -1, 3, -1, 3, 3 ], [ 3, -1, -1, -1, 3, -1, -1, -1 ] ],
producerBlocks: [ 20, 16, 25 ],
blocksColors: [ 6, 5, 7 ]
}, {
boardId: 47,
boardData: [ [ -1, -1, -1, 7, -1, -1, -1, -1 ], [ -1, -1, -1, 7, -1, -1, -1, -1 ], [ -1, -1, 7, 7, 7, -1, -1, -1 ], [ -1, 7, 7, 7, 7, 7, -1, -1 ], [ 7, 7, -1, 7, -1, 7, 7, -1 ], [ 7, -1, -1, 7, -1, -1, 7, -1 ], [ -1, -1, -1, 7, -1, -1, -1, -1 ], [ -1, -1, 7, -1, 7, -1, -1, -1 ] ],
producerBlocks: [ 32, 39, 41 ],
blocksColors: [ 6, 5, 7 ]
}, {
boardId: 48,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ 4, 4, -1, -1, -1, -1, 4, 4 ], [ 4, -1, 4, 4, 4, 4, -1, 4 ], [ -1, 4, 4, 4, 4, 4, 4, -1 ], [ -1, 4, 7, 4, 4, 7, 4, -1 ], [ -1, 4, 2, 2, 2, 2, 4, -1 ], [ -1, 4, 2, 1, 1, 2, 4, -1 ], [ -1, -1, 4, 2, 2, 4, -1, -1 ] ],
producerBlocks: [ 41, 9, 39 ],
blocksColors: [ 3, 3, 7 ]
}, {
boardId: 49,
boardData: [ [ -1, -1, 1, 1, 1, -1, -1, -1 ], [ -1, -1, 1, 1, 1, -1, -1, -1 ], [ 4, 4, -1, 1, 1, -1, -1, -1 ], [ 4, 4, 4, -1, -1, 2, 2, 2 ], [ 4, 4, 4, -1, -1, 2, 2, 2 ], [ -1, -1, -1, 6, 6, -1, 2, 2 ], [ -1, -1, -1, 6, 6, 6, -1, -1 ], [ -1, -1, -1, 6, 6, 6, -1, -1 ] ],
producerBlocks: [ 9, 30, 39 ],
blocksColors: [ 6, 5, 7 ]
}, {
boardId: 50,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, 4, 6, 5, 1, 2, 3, -1 ], [ -1, 3, -1, -1, -1, -1, 4, -1 ], [ -1, 2, -1, -1, -1, -1, 7, -1 ], [ -1, 1, -1, -1, -1, -1, 6, -1 ], [ -1, 5, -1, -1, -1, -1, 5, -1 ], [ -1, 6, 7, 4, 3, 2, 1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 11, 12, 22 ],
blocksColors: [ 6, 7, 5 ]
}, {
boardId: 51,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, 6, 1, 6, -1 ], [ -1, -1, -1, -1, 2, 6, 7, -1 ], [ -1, 4, -1, -1, 6, 5, 6, -1 ], [ 4, 2, 4, -1, -1, 3, -1, -1 ], [ -1, 4, 6, -1, -1, 3, -1, -1 ], [ -1, -1, 6, -1, -1, 3, -1, -1 ], [ -1, -1, 6, -1, -1, 3, -1, -1 ] ],
producerBlocks: [ 36, 16, 9 ],
blocksColors: [ 4, 4, 7 ]
}, {
boardId: 52,
boardData: [ [ -1, -1, -1, -1, 5, -1, -1, -1 ], [ -1, -1, -1, 5, 2, 5, -1, -1 ], [ -1, -1, -1, 6, 5, -1, -1, -1 ], [ -1, -1, -1, 6, -1, -1, -1, -1 ], [ -1, -1, -1, 6, -1, -1, -1, -1 ], [ -1, -1, 1, 1, 1, 1, 1, -1 ], [ -1, -1, 1, 1, 1, 1, 1, -1 ], [ -1, -1, -1, 1, 1, 1, -1, -1 ] ],
producerBlocks: [ 31, 9, 25 ],
blocksColors: [ 6, 5, 7 ]
}, {
boardId: 53,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 1, 1, 2, 2, -1, -1 ], [ -1, 1, 1, 2, -1, -1, -1, -1 ], [ -1, 1, 2, -1, -1, -1, -1, -1 ], [ 1, 5, 2, 2, 2, 2, 2, -1 ], [ -1, 1, 2, -1, -1, -1, -1, -1 ], [ -1, 1, 1, 2, -1, -1, -1, -1 ], [ -1, -1, 1, 1, 2, 2, -1, -1 ] ],
producerBlocks: [ 27, 17, 7 ],
blocksColors: [ 6, 4, 5 ]
}, {
boardId: 54,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, 7, 7, -1 ], [ -1, 4, -1, -1, -1, 7, 2, 7 ], [ -1, 3, -1, -1, -1, 7, -1, -1 ], [ -1, 2, -1, -1, -1, -1, 7, -1 ], [ -1, 1, 5, 6, 7, 7, 7, -1 ], [ -1, 7, 7, 7, 7, 7, 7, -1 ], [ -1, -1, -1, -1, -1, 7, -1, 7 ] ],
producerBlocks: [ 30, 38, 7 ],
blocksColors: [ 6, 5, 7 ]
}, {
boardId: 55,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 7, 7, 7, 7, -1, -1 ], [ -1, -1, -1, 7, 7, -1, -1, -1 ], [ -1, -1, 4, 3, 2, 1, -1, -1 ], [ -1, 3, 5, 2, 4, 6, 5, -1 ], [ -1, -1, 2, 4, 6, 3, -1, -1 ], [ -1, -1, -1, 3, 4, -1, -1, -1 ] ],
producerBlocks: [ 24, 20, 23 ],
blocksColors: [ 6, 4, 2 ]
}, {
boardId: 56,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, 6, -1, -1, -1, -1 ], [ -1, -1, 6, 6, 6, -1, -1, -1 ], [ -1, 6, 5, 6, 6, 6, -1, -1 ], [ -1, -1, 6, 6, 6, -1, -1, -1 ], [ -1, 6, 3, 6, 6, 6, -1, -1 ], [ 6, 6, 6, 6, 2, 6, 6, -1 ], [ -1, -1, -1, 4, -1, -1, -1, -1 ] ],
producerBlocks: [ 25, 24, 20 ],
blocksColors: [ 2, 5, 4 ]
}, {
boardId: 57,
boardData: [ [ 2, -1, -1, 2, 2, -1, -1, 2 ], [ -1, 2, -1, 2, 2, -1, 2, -1 ], [ 2, -1, 7, 2, 2, 7, -1, 2 ], [ 2, -1, -1, 2, 2, -1, -1, 2 ], [ -1, 2, 2, 3, 3, 2, 2, -1 ], [ 2, 4, 3, -1, -1, 3, 4, 2 ], [ 4, 4, 3, -1, -1, 3, 4, 4 ], [ -1, -1, -1, 3, 3, -1, -1, -1 ] ],
producerBlocks: [ 8, 9, 37 ],
blocksColors: [ 6, 5, 7 ]
}, {
boardId: 58,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, 2, 2, 2, -1, -1 ], [ -1, -1, 2, 2, 2, 2, 2, -1 ], [ -1, -1, 2, 7, 4, 7, 2, -1 ], [ -1, 2, 2, 2, 2, 2, 2, 2 ], [ -1, -1, -1, 2, -1, 2, -1, -1 ], [ -1, -1, 4, 4, -1, 4, 4, -1 ] ],
producerBlocks: [ 32, 8, 15 ],
blocksColors: [ 6, 5, 7 ]
}, {
boardId: 59,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, 3, -1, -1, -1, -1 ], [ -1, -1, 3, 2, 3, -1, -1, -1 ], [ -1, 3, 1, 6, 1, 3, -1, -1 ], [ -1, 3, 6, 5, 6, 3, -1, -1 ], [ -1, 3, 1, 6, 1, 3, -1, -1 ], [ -1, -1, 3, 2, 3, -1, -1, -1 ], [ -1, -1, -1, 3, -1, -1, -1, -1 ] ],
producerBlocks: [ 15, 34, 28 ],
blocksColors: [ 6, 5, 7 ]
}, {
boardId: 60,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ 7, 7, -1, -1, -1, 7, 7, -1 ], [ 7, -1, 4, 4, 4, -1, 7, -1 ], [ -1, 2, -1, -1, -1, 2, -1, -1 ], [ 4, -1, -1, -1, -1, -1, 4, -1 ], [ 4, -1, -1, -1, -1, -1, 4, -1 ], [ 4, -1, -1, 2, -1, -1, 4, -1 ], [ -1, 4, 4, -1, 4, 4, -1, -1 ] ],
producerBlocks: [ 12, 39, 41 ],
blocksColors: [ 2, 5, 7 ]
}, {
boardId: 61,
boardData: [ [ -1, -1, 2, 2, -1, -1, -1, -1 ], [ -1, -1, 2, 6, -1, 5, 5, -1 ], [ -1, -1, -1, -1, 6, 6, 5, -1 ], [ -1, -1, -1, -1, 6, -1, -1, -1 ], [ -1, -1, -1, -1, 6, -1, -1, -1 ], [ -1, -1, 1, 1, 1, 1, 1, -1 ], [ -1, -1, 1, 1, 1, 1, 1, -1 ], [ -1, -1, -1, 1, 1, 1, -1, -1 ] ],
producerBlocks: [ 29, 35, 34 ],
blocksColors: [ 6, 7, 5 ]
}, {
boardId: 62,
boardData: [ [ -1, -1, 2, 2, 2, 2, -1, -1 ], [ -1, 2, -1, -1, -1, -1, 2, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, 3, -1, -1, -1, -1, 3, -1 ], [ -1, -1, 3, 3, 3, 3, -1, -1 ], [ -1, 7, -1, -1, -1, -1, 7, -1 ], [ 7, -1, 7, -1, -1, 7, -1, 7 ], [ -1, -1, 7, -1, -1, 7, -1, -1 ] ],
producerBlocks: [ 38, 14, 37 ],
blocksColors: [ 6, 7, 5 ]
}, {
boardId: 63,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ 3, 3, 3, -1, -1, 3, 3, 3 ], [ 3, -1, 5, -1, -1, 5, -1, 3 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, 6, 5, -1, -1, -1 ], [ -1, -1, -1, 5, 6, -1, -1, -1 ] ],
producerBlocks: [ 35, 10, 36 ],
blocksColors: [ 4, 7, 2 ]
}, {
boardId: 64,
boardData: [ [ -1, -1, 4, 2, 2, 6, -1, -1 ], [ -1, -1, -1, 2, -1, -1, 2, -1 ], [ -1, -1, -1, -1, 3, -1, -1, 5 ], [ -1, -1, -1, -1, 2, -1, -1, 2 ], [ -1, -1, -1, -1, 1, -1, -1, 1 ], [ -1, -1, -1, -1, 2, -1, -1, 2 ], [ -1, -1, -1, 5, -1, -1, 3, -1 ], [ -1, -1, 7, 2, 4, 2, -1, -1 ] ],
producerBlocks: [ 4, 36, 14 ],
blocksColors: [ 6, 2, 2 ]
}, {
boardId: 65,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 2, 2, -1, 2, 2, -1 ], [ -1, -1, -1, 7, 2, 7, -1, -1 ], [ -1, -1, -1, 2, 3, 2, -1, -1 ], [ -1, -1, -1, 2, -1, -1, -1, -1 ], [ 3, -1, -1, 2, -1, -1, -1, -1 ], [ 3, 3, 2, 2, -1, -1, -1, -1 ], [ -1, 2, 2, 2, 2, -1, -1, -1 ] ],
producerBlocks: [ 30, 26, 13 ],
blocksColors: [ 4, 2, 4 ]
}, {
boardId: 66,
boardData: [ [ -1, -1, 6, -1, -1, 6, -1, -1 ], [ -1, 5, 5, 5, 5, 5, 5, -1 ], [ 5, -1, 2, -1, -1, 2, -1, 5 ], [ 5, -1, -1, -1, -1, -1, -1, 5 ], [ 5, -1, -1, 5, 5, -1, -1, 5 ], [ -1, 6, 5, 5, 5, 5, 6, -1 ], [ -1, -1, -1, 5, 5, -1, -1, -1 ], [ -1, -1, 6, 5, 5, 6, -1, -1 ] ],
producerBlocks: [ 25, 9, 20 ],
blocksColors: [ 4, 2, 7 ]
}, {
boardId: 67,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, 4, 4, -1, 3, -1, -1, -1 ], [ -1, 4, 4, -1, -1, 3, -1, -1 ], [ 4, 7, 7, 3, 3, 3, 3, -1 ], [ 4, 4, 4, 4, -1, 3, -1, -1 ], [ -1, 7, 7, -1, -1, 3, -1, -1 ], [ -1, 7, 7, -1, 3, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 19, 9, 21 ],
blocksColors: [ 7, 5, 2 ]
}, {
boardId: 68,
boardData: [ [ -1, -1, 4, 4, -1, -1, -1, -1 ], [ -1, -1, 4, 4, -1, -1, -1, -1 ], [ 4, 4, 7, 7, 4, 4, 4, -1 ], [ -1, -1, 7, 7, -1, -1, -1, -1 ], [ -1, 4, 7, 7, 4, -1, -1, -1 ], [ -1, 4, -1, -1, -1, 4, -1, 3 ], [ 3, 3, 3, 3, 3, 3, 3, -1 ], [ -1, 6, -1, -1, -1, 6, -1, -1 ] ],
producerBlocks: [ 6, 26, 19 ],
blocksColors: [ 2, 5, 6 ]
}, {
boardId: 69,
boardData: [ [ -1, -1, -1, 4, 2, 4, -1, -1 ], [ -1, -1, 2, 4, 2, -1, -1, -1 ], [ -1, 4, 2, 4, 2, 4, -1, 4 ], [ 2, -1, 2, 4, 2, 4, 2, 4 ], [ -1, 4, 2, 4, 2, 4, -1, 4 ], [ -1, -1, 2, 4, 2, -1, -1, -1 ], [ -1, -1, -1, 4, 4, 4, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 20, 10, 26 ],
blocksColors: [ 6, 1, 5 ]
}, {
boardId: 70,
boardData: [ [ -1, 2, 2, 2, 2, 2, 2, -1 ], [ 2, -1, -1, 2, 2, -1, -1, 2 ], [ 2, 2, -1, -1, -1, -1, 2, 2 ], [ -1, 7, 6, 5, 4, 3, 1, -1 ], [ 2, 2, -1, 2, 2, -1, 2, 2 ], [ 2, -1, -1, 2, 2, -1, -1, 2 ], [ 2, -1, 2, 2, 2, 2, -1, 2 ], [ -1, 2, 2, 2, 2, 2, 2, -1 ] ],
producerBlocks: [ 19, 14, 16 ],
blocksColors: [ 6, 5, 7 ]
}, {
boardId: 71,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, 1, -1, -1, -1, -1 ], [ -1, -1, 1, 1, 1, -1, -1, -1 ], [ -1, 1, 1, 1, 1, 1, -1, -1 ], [ 1, 1, 1, 1, 1, 1, 1, -1 ], [ -1, 2, -1, 2, -1, 2, -1, -1 ], [ -1, 2, 2, 2, 2, 2, -1, -1 ], [ 6, 6, 6, 6, 6, 6, 6, -1 ] ],
producerBlocks: [ 16, 25, 20 ],
blocksColors: [ 6, 7, 7 ]
}, {
boardId: 72,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, 2, 7, -1, -1, -1 ], [ -1, -1, 7, 2, 7, 7, -1, -1 ], [ -1, 7, 7, 2, 7, 7, -1, -1 ], [ 7, 7, 7, 2, 7, 7, 7, -1 ], [ -1, -1, -1, 2, -1, -1, -1, -1 ], [ 4, 4, 4, 4, 4, 4, 4, -1 ], [ -1, 4, 4, 4, 4, 4, -1, -1 ] ],
producerBlocks: [ 6, 28, 25 ],
blocksColors: [ 5, 2, 4 ]
}, {
boardId: 73,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 3, 3, 3, 3, 3, -1 ], [ -1, -1, 3, 2, 3, 2, 3, -1 ], [ -1, 3, 3, 3, 3, 3, 3, 3 ], [ -1, -1, 3, 5, 5, 5, 3, -1 ], [ -1, -1, 3, 3, 3, 3, 3, -1 ], [ -1, -1, 3, -1, -1, -1, 3, -1 ], [ -1, -1, 3, -1, -1, -1, 3, -1 ] ],
producerBlocks: [ 7, 12, 25 ],
blocksColors: [ 4, 7, 7 ]
}, {
boardId: 74,
boardData: [ [ -1, -1, 7, -1, 7, -1, -1, -1 ], [ -1, -1, 7, 7, -1, -1, -1, -1 ], [ -1, 7, 7, -1, -1, -1, -1, -1 ], [ 1, 7, 7, -1, -1, -1, 7, -1 ], [ -1, 7, 7, 7, -1, -1, 7, -1 ], [ 7, 7, 7, 7, 7, 7, -1, -1 ], [ 7, -1, -1, -1, 7, 7, 7, -1 ], [ -1, 4, -1, -1, -1, -1, -1, 4 ] ],
producerBlocks: [ 8, 18, 25 ],
blocksColors: [ 4, 2, 6 ]
}, {
boardId: 75,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, 1, 1, 1, -1, -1 ], [ -1, -1, 1, 1, 1, 1, 1, -1 ], [ -1, 1, 1, 1, 1, 1, 1, 1 ], [ -1, 1, 1, 1, 1, 1, 1, 1 ], [ -1, 7, -1, -1, 7, -1, -1, 7 ], [ 7, -1, -1, 7, -1, -1, 7, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 14, 14, 31 ],
blocksColors: [ 5, 5, 2 ]
}, {
boardId: 76,
boardData: [ [ -1, -1, -1, -1, -1, -1, 4, 4 ], [ -1, -1, -1, 4, 4, -1, 4, 4 ], [ -1, -1, -1, -1, -1, 2, -1, -1 ], [ 6, -1, -1, 7, 2, 2, 4, 4 ], [ -1, 4, -1, 7, 7, -1, -1, -1 ], [ -1, -1, 4, 4, -1, 4, -1, -1 ], [ -1, -1, -1, -1, -1, 4, -1, -1 ], [ -1, -1, -1, -1, -1, 6, -1, -1 ] ],
producerBlocks: [ 38, 21, 12 ],
blocksColors: [ 7, 2, 5 ]
}, {
boardId: 77,
boardData: [ [ -1, 2, -1, -1, 2, -1, -1, -1 ], [ -1, 4, 4, 4, 4, -1, -1, -1 ], [ -1, 1, 4, 1, 4, -1, -1, 2 ], [ 4, 4, 4, 4, 4, -1, 2, -1 ], [ 4, 4, 4, 4, 4, 4, 4, -1 ], [ -1, -1, 4, 4, 4, 4, 4, 4 ], [ -1, 4, -1, -1, 4, -1, 4, 4 ], [ -1, 2, -1, 2, -1, -1, 2, 2 ] ],
producerBlocks: [ 6, 31, 28 ],
blocksColors: [ 6, 4, 5 ]
}, {
boardId: 78,
boardData: [ [ 3, -1, 3, -1, -1, 3, -1, 3 ], [ 3, 3, 3, -1, -1, 3, 3, 3 ], [ -1, 3, -1, -1, -1, -1, 3, -1 ], [ -1, -1, 7, -1, -1, 7, -1, -1 ], [ -1, 2, 3, 3, 3, 3, 2, -1 ], [ -1, 2, 3, 3, 3, 3, 2, -1 ], [ -1, 2, 3, 3, 3, 3, 2, -1 ], [ -1, 2, -1, -1, -1, -1, 2, -1 ] ],
producerBlocks: [ 9, 39, 41 ],
blocksColors: [ 7, 2, 4 ]
}, {
boardId: 79,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, 1, 1, 1, -1, -1 ], [ -1, -1, 1, 1, 1, 1, 1, -1 ], [ -1, 1, 1, 5, 1, 5, 1, 1 ], [ -1, 1, 1, 5, 1, 5, 1, 1 ], [ -1, 1, 1, 1, 1, 1, 1, 1 ], [ -1, 1, 1, 1, 1, 1, 1, 1 ], [ -1, 1, -1, 1, -1, 1, -1, 1 ] ],
producerBlocks: [ 25, 17, 29 ],
blocksColors: [ 4, 4, 2 ]
}, {
boardId: 80,
boardData: [ [ -1, -1, -1, 2, 2, -1, -1, 1 ], [ -1, -1, 2, 2, 2, 2, -1, 1 ], [ -1, -1, 2, 2, 2, 2, -1, 1 ], [ -1, -1, 3, 2, 2, 3, -1, 1 ], [ -1, 2, 3, 3, 3, 3, 2, 2 ], [ -1, 2, 5, 5, 5, 5, -1, -1 ], [ -1, -1, 5, 5, 5, 5, -1, -1 ], [ -1, -1, 2, -1, -1, 2, -1, -1 ] ],
producerBlocks: [ 32, 36, 9 ],
blocksColors: [ 2, 4, 7 ]
}, {
boardId: 81,
boardData: [ [ -1, -1, 4, 4, -1, -1, -1, -1 ], [ -1, -1, 4, 4, -1, 4, -1, -1 ], [ 4, 4, 7, 7, 4, 4, -1, -1 ], [ 4, -1, 7, 7, -1, -1, -1, -1 ], [ -1, -1, 7, 7, -1, -1, 1, 1 ], [ -1, 4, -1, -1, 4, -1, 1, 1 ], [ -1, 4, -1, -1, 4, 4, 6, -1 ], [ -1, 6, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 19, 36, 15 ],
blocksColors: [ 4, 2, 7 ]
}, {
boardId: 82,
boardData: [ [ -1, -1, 5, -1, -1, 5, -1, -1 ], [ -1, 5, 2, 5, 5, 2, 5, -1 ], [ 5, 2, 4, -1, -1, 4, 2, 5 ], [ 5, 2, 4, -1, -1, 4, 2, 5 ], [ 5, 2, 4, -1, -1, 4, 2, 5 ], [ -1, 5, 2, 4, 4, 2, 5, -1 ], [ -1, -1, 5, 2, 2, 5, -1, -1 ], [ -1, -1, -1, 5, 5, -1, -1, -1 ] ],
producerBlocks: [ 9, 6, 15 ],
blocksColors: [ 4, 2, 6 ]
}, {
boardId: 83,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ 1, 1, 1, -1, -1, 1, 1, 1 ], [ 1, -1, -1, 6, 4, -1, -1, 1 ], [ 1, -1, -1, 3, 5, -1, -1, 1 ], [ 2, 2, 2, -1, -1, 2, 2, 2 ], [ -1, -1, 2, -1, -1, 2, -1, -1 ], [ -1, -1, 2, -1, -1, 2, -1, -1 ], [ -1, -1, 1, 1, 1, 1, -1, -1 ] ],
producerBlocks: [ 36, 9, 9 ],
blocksColors: [ 4, 2, 7 ]
}, {
boardId: 84,
boardData: [ [ -1, -1, -1, -1, -1, 6, -1, -1 ], [ -1, -1, 6, 6, 6, 6, 6, -1 ], [ -1, 5, 7, 5, 5, 5, 7, 5 ], [ -1, 5, 5, 7, 5, 5, 5, 5 ], [ -1, 5, 5, 5, 5, 7, 5, 5 ], [ -1, -1, 5, 5, 7, 5, 5, -1 ], [ -1, -1, -1, 5, 5, 5, -1, -1 ], [ -1, -1, -1, -1, 5, -1, -1, -1 ] ],
producerBlocks: [ 9, 25, 10 ],
blocksColors: [ 4, 7, 7 ]
}, {
boardId: 85,
boardData: [ [ -1, -1, -1, 5, 5, -1, -1, -1 ], [ -1, -1, 4, 4, 4, 4, -1, -1 ], [ -1, 2, 2, 2, 2, 2, 2, -1 ], [ -1, 6, 6, 6, 6, 6, 6, -1 ], [ -1, -1, -1, -1, 3, -1, -1, -1 ], [ -1, -1, -1, -1, 3, -1, -1, -1 ], [ -1, -1, 3, -1, 3, -1, -1, -1 ], [ -1, -1, -1, 3, -1, -1, -1, -1 ] ],
producerBlocks: [ 32, 35, 31 ],
blocksColors: [ 4, 7, 7 ]
}, {
boardId: 86,
boardData: [ [ 1, -1, -1, -1, -1, -1, -1, 1 ], [ 1, 1, -1, -1, -1, -1, 1, 1 ], [ -1, 1, -1, -1, -1, -1, 1, -1 ], [ 2, 2, 2, -1, -1, 2, 2, 2 ], [ -1, 2, 2, 2, 2, 2, 2, -1 ], [ -1, 2, 7, 2, 2, 7, 2, -1 ], [ -1, 2, 2, 2, 2, 2, 2, -1 ], [ -1, -1, 2, 7, 7, 2, -1, -1 ] ],
producerBlocks: [ 29, 42, 14 ],
blocksColors: [ 4, 6, 6 ]
}, {
boardId: 87,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 7, 7, 7, 7, -1, -1 ], [ -1, -1, 7, -1, -1, 7, -1, -1 ], [ -1, -1, 7, -1, -1, 7, -1, -1 ], [ -1, 2, 2, 2, 2, 2, 2, -1 ], [ -1, 2, 1, 2, 2, 3, 2, -1 ], [ -1, 5, 2, 6, 4, 2, 7, -1 ], [ -1, 2, 2, 2, 2, 2, 2, -1 ] ],
producerBlocks: [ 27, 9, 31 ],
blocksColors: [ 4, 2, 7 ]
}, {
boardId: 88,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, 2, 2, -1, -1, 2, 2, -1 ], [ 2, -1, 2, -1, -1, 2, -1, 2 ], [ 2, -1, 2, 4, 4, 2, -1, 2 ], [ 2, -1, -1, 4, 4, -1, -1, 2 ], [ -1, 7, 7, -1, -1, 7, 7, -1 ], [ -1, 7, -1, -1, -1, -1, 7, -1 ], [ -1, -1, 7, 7, 7, 7, -1, -1 ] ],
producerBlocks: [ 14, 42, 29 ],
blocksColors: [ 5, 2, 4 ]
}, {
boardId: 89,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, 7, -1, -1, -1, -1, 7, -1 ], [ -1, 7, -1, -1, -1, -1, 7, -1 ], [ -1, 7, 7, 7, 7, 7, 7, -1 ], [ -1, 2, -1, 7, 7, -1, 2, -1 ], [ 7, -1, -1, 7, 7, -1, -1, 7 ], [ 7, -1, 7, 7, 7, 7, -1, 7 ], [ -1, 7, 7, -1, -1, 7, 7, -1 ] ],
producerBlocks: [ 16, 19, 29 ],
blocksColors: [ 4, 4, 2 ]
}, {
boardId: 90,
boardData: [ [ -1, -1, 5, 5, 5, 5, -1, -1 ], [ -1, 5, -1, 2, -1, -1, 5, -1 ], [ 5, -1, -1, 2, -1, -1, -1, 5 ], [ 5, -1, -1, 2, -1, -1, -1, 5 ], [ 5, -1, -1, 2, 2, 2, -1, 5 ], [ 5, -1, -1, -1, -1, -1, -1, 5 ], [ -1, 5, -1, -1, -1, -1, 5, -1 ], [ -1, -1, 5, 5, 5, 5, -1, -1 ] ],
producerBlocks: [ 27, 17, 28 ],
blocksColors: [ 3, 7, 4 ]
}, {
boardId: 91,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, 7, -1, -1, -1, 7, -1, -1 ], [ -1, 7, 2, 2, 2, 7, 7, 7 ], [ -1, 7, 2, 2, 2, 7, -1, 7 ], [ -1, 7, 2, 2, 2, 7, 7, 7 ], [ -1, 7, 2, 2, 2, 7, -1, -1 ], [ -1, 7, 7, 7, 7, 7, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 7, 9, 33 ],
blocksColors: [ 5, 3, 3 ]
}, {
boardId: 92,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, 1, 1, 1, -1, -1 ], [ -1, -1, -1, 1, -1, -1, -1, -1 ], [ -1, 7, -1, 1, -1, 7, -1, -1 ], [ -1, 7, 2, 1, 2, 7, -1, -1 ], [ -1, 7, 2, 1, 2, 7, -1, -1 ], [ -1, 7, 2, 2, 2, 7, -1, -1 ], [ -1, 7, 7, 7, 7, 7, -1, -1 ] ],
producerBlocks: [ 6, 25, 36 ],
blocksColors: [ 6, 2, 4 ]
}, {
boardId: 93,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 5, 4, 2, 6, -1, -1 ], [ -1, 6, 3, 1, 7, 2, 4, -1 ], [ 5, 4, 2, -1, -1, 6, 5, 5 ], [ 7, 3, -1, -1, -1, -1, 4, 3 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 18, 19, 16 ],
blocksColors: [ 6, 2, 4 ]
}, {
boardId: 94,
boardData: [ [ -1, -1, -1, 7, -1, -1, -1, -1 ], [ -1, -1, -1, 7, -1, -1, -1, -1 ], [ -1, -1, 7, 1, 7, -1, -1, -1 ], [ -1, 7, 7, 1, 7, 7, -1, -1 ], [ 7, 7, 7, 7, 7, 7, 7, -1 ], [ -1, -1, -1, 7, -1, -1, -1, -1 ], [ -1, 7, 7, 7, 7, 7, -1, -1 ], [ -1, -1, 5, -1, 5, -1, -1, -1 ] ],
producerBlocks: [ 7, 34, 30 ],
blocksColors: [ 4, 7, 7 ]
}, {
boardId: 95,
boardData: [ [ -1, 2, 2, 2, 2, -1, -1, -1 ], [ -1, 2, 7, 2, 2, -1, -1, -1 ], [ 4, 2, 2, 2, 2, -1, -1, 2 ], [ -1, -1, 2, 2, -1, -1, 2, 2 ], [ -1, -1, 2, 2, 2, 2, 2, 2 ], [ -1, 2, 2, 2, 2, 2, 2, 2 ], [ -1, 2, 2, 2, 2, 2, 2, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 9, 9, 14 ],
blocksColors: [ 4, 5, 5 ]
}, {
boardId: 96,
boardData: [ [ -1, -1, 6, -1, -1, -1, -1, -1 ], [ -1, 6, 6, -1, -1, -1, -1, -1 ], [ 6, 6, 6, 2, 2, -1, -1, -1 ], [ -1, -1, 2, 2, 2, 2, -1, -1 ], [ -1, -1, 2, 2, 2, 2, -1, -1 ], [ -1, -1, -1, 2, 2, 6, 6, 6 ], [ -1, -1, -1, -1, -1, 6, 6, -1 ], [ -1, -1, -1, -1, -1, 6, -1, -1 ] ],
producerBlocks: [ 9, 13, 9 ],
blocksColors: [ 5, 6, 6 ]
}, {
boardId: 97,
boardData: [ [ 2, 2, 2, 2, 2, 2, 2, -1 ], [ -1, -1, -1, 2, -1, -1, -1, -1 ], [ 4, -1, 4, 4, 4, 4, -1, -1 ], [ 4, 4, 4, 4, 1, 1, 4, -1 ], [ 4, -1, 4, 4, 4, 4, 4, -1 ], [ -1, -1, -1, 2, -1, 2, -1, -1 ], [ -1, -1, 2, 2, 2, 2, 2, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 26, 10, 32 ],
blocksColors: [ 7, 7, 4 ]
}, {
boardId: 98,
boardData: [ [ -1, -1, -1, -1, -1, 4, 4, -1 ], [ -1, -1, 4, 4, -1, 4, 4, -1 ], [ -1, -1, -1, -1, 7, -1, -1, -1 ], [ -1, -1, 7, 7, 7, 4, 4, -1 ], [ 6, -1, 7, 7, -1, -1, -1, -1 ], [ -1, 4, 4, -1, 4, -1, -1, -1 ], [ -1, -1, -1, -1, 4, -1, 1, 1 ], [ -1, -1, -1, -1, 6, -1, 1, 1 ] ],
producerBlocks: [ 2, 21, 12 ],
blocksColors: [ 4, 7, 2 ]
}, {
boardId: 99,
boardData: [ [ 1, 1, 1, -1, -1, -1, -1, -1 ], [ -1, 1, 1, 2, -1, 1, 1, 1 ], [ -1, 1, 1, 1, 2, -1, 1, 1 ], [ -1, -1, -1, 1, 1, 2, -1, 1 ], [ 1, 1, 1, -1, -1, -1, -1, -1 ], [ 1, -1, 1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ 1, 1, 1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 23, 10, 39 ],
blocksColors: [ 7, 7, 4 ]
}, {
boardId: 100,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 4, 4, 4, -1, -1, -1 ], [ -1, 4, -1, -1, -1, 4, -1, -1 ], [ 4, -1, -1, -1, -1, -1, 4, -1 ], [ 4, 4, 4, 4, 4, 4, 4, -1 ], [ -1, 2, -1, -1, -1, 2, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 10, 29, 18 ],
blocksColors: [ 3, 4, 7 ]
}, {
boardId: 101,
boardData: [ [ -1, 2, -1, -1, -1, -1, 2, -1 ], [ -1, -1, 2, -1, -1, 2, -1, -1 ], [ -1, 2, 2, 2, 2, 2, 2, -1 ], [ 2, -1, -1, -1, -1, -1, -1, 2 ], [ 2, -1, 7, -1, -1, 7, -1, 2 ], [ 2, -1, -1, -1, -1, -1, -1, 2 ], [ 2, -1, 2, 2, 2, 2, -1, 2 ], [ -1, 2, 2, 2, 2, 2, 2, -1 ] ],
producerBlocks: [ 9, 20, 25 ],
blocksColors: [ 2, 4, 7 ]
}, {
boardId: 102,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ 3, 3, 3, 3, 3, 3, 3, -1 ], [ -1, -1, -1, 2, 2, 2, 2, -1 ], [ -1, 1, 1, 2, 1, 1, 2, 1 ], [ -1, -1, -1, 2, -1, -1, 2, -1 ], [ 5, 5, 2, 2, 5, 5, 2, -1 ], [ -1, -1, -1, -1, -1, 2, 2, -1 ], [ -1, -1, 6, 6, 6, 6, 6, 6 ] ],
producerBlocks: [ 9, 8, 12 ],
blocksColors: [ 2, 4, 7 ]
}, {
boardId: 103,
boardData: [ [ -1, -1, -1, 4, 4, -1, -1, -1 ], [ -1, -1, 4, -1, -1, 4, -1, -1 ], [ -1, 4, -1, -1, -1, -1, 4, -1 ], [ 4, -1, -1, -1, -1, -1, -1, 4 ], [ 4, -1, 4, 4, 4, 4, -1, 4 ], [ -1, 2, -1, -1, -1, -1, 2, -1 ], [ -1, 2, -1, 2, 2, -1, 2, -1 ], [ -1, 2, -1, 2, 2, -1, 2, -1 ] ],
producerBlocks: [ 19, 36, 16 ],
blocksColors: [ 4, 6, 6 ]
}, {
boardId: 104,
boardData: [ [ -1, 2, 2, 2, 2, 2, 2, -1 ], [ -1, 2, -1, -1, -1, 2, -1, -1 ], [ -1, 2, -1, 7, -1, 2, 4, -1 ], [ 2, 2, -1, -1, -1, 2, 4, 4 ], [ 2, 2, 2, 2, 2, 2, -1, -1 ], [ -1, -1, 4, -1, -1, 4, -1, -1 ], [ -1, -1, 4, 4, -1, 4, 4, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 25, 34, 33 ],
blocksColors: [ 6, 4, 5 ]
}, {
boardId: 105,
boardData: [ [ -1, 6, -1, -1, -1, -1, -1, -1 ], [ -1, 6, -1, -1, -1, -1, -1, -1 ], [ 6, 6, 6, -1, -1, -1, -1, -1 ], [ 6, 5, 6, -1, -1, -1, -1, -1 ], [ 5, 5, 5, -1, -1, -1, -1, 5 ], [ 5, 5, 5, 5, -1, 5, 5, 5 ], [ -1, 5, 5, 5, 5, 5, 5, -1 ], [ -1, -1, 5, 5, 5, 5, -1, -1 ] ],
producerBlocks: [ 28, 26, 27 ],
blocksColors: [ 5, 4, 6 ]
}, {
boardId: 106,
boardData: [ [ -1, -1, 7, 2, 2, 2, -1, -1 ], [ -1, 7, 7, 2, 1, 2, 2, -1 ], [ -1, 1, 1, 2, 2, 2, 2, -1 ], [ -1, 1, 1, 1, 1, 2, 2, -1 ], [ -1, 1, 1, 2, 1, 4, 4, -1 ], [ -1, -1, 1, 1, 1, 4, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 20, 29, 6 ],
blocksColors: [ 4, 6, 6 ]
}, {
boardId: 107,
boardData: [ [ -1, -1, -1, 6, -1, 6, -1, -1 ], [ -1, 4, 6, 6, 6, 6, 6, -1 ], [ -1, 4, 6, 3, 6, 6, 6, -1 ], [ -1, 4, 6, 6, 5, 5, 5, -1 ], [ -1, 4, 6, 6, 6, -1, -1, -1 ], [ -1, -1, 6, 6, 6, -1, -1, -1 ], [ 6, 6, 6, 6, 6, -1, -1, -1 ], [ -1, -1, 6, -1, 6, -1, -1, -1 ] ],
producerBlocks: [ 31, 42, 29 ],
blocksColors: [ 4, 3, 3 ]
}, {
boardId: 108,
boardData: [ [ -1, -1, 7, 7, 7, -1, -1, -1 ], [ -1, 7, -1, -1, -1, 7, -1, 7 ], [ 7, -1, 2, -1, -1, -1, 7, 7 ], [ 7, -1, -1, -1, -1, -1, 7, 7 ], [ -1, 7, -1, -1, -1, 7, -1, 7 ], [ -1, -1, 7, 7, 7, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 27, 26, 10 ],
blocksColors: [ 3, 4, 2 ]
}, {
boardId: 109,
boardData: [ [ -1, -1, -1, -1, -1, 3, 3, -1 ], [ -1, -1, -1, -1, 3, 3, 3, 3 ], [ -1, -1, 2, 2, 2, 3, 7, 3 ], [ -1, 2, 2, 2, 2, 3, 3, 3 ], [ -1, 2, 2, 2, 2, 3, 3, 3 ], [ -1, 2, -1, -1, -1, 3, 3, 3 ], [ -1, -1, -1, -1, -1, -1, 3, 3 ], [ -1, -1, -1, -1, -1, -1, -1, 3 ] ],
producerBlocks: [ 31, 27, 27 ],
blocksColors: [ 2, 4, 6 ]
}, {
boardId: 110,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, 5, 5, -1 ], [ -1, -1, -1, -1, -1, 5, 5, 5 ], [ -1, -1, -1, -1, 5, 5, 5, 5 ], [ -1, -1, -1, 5, 5, 5, 5, -1 ], [ -1, -1, 5, 5, 5, -1, 5, -1 ], [ 5, 2, 5, 5, -1, -1, 5, -1 ], [ 5, 5, 5, -1, -1, -1, 5, -1 ] ],
producerBlocks: [ 9, 25, 30 ],
blocksColors: [ 2, 4, 6 ]
}, {
boardId: 111,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, 5, 5, -1, -1, -1 ], [ -1, -1, -1, 4, 4, -1, -1, -1 ], [ -1, -1, 2, 2, 2, 2, -1, -1 ], [ -1, -1, 2, 2, 2, 2, -1, -1 ], [ -1, 3, 3, 3, 3, 3, 3, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 8, 33, 16 ],
blocksColors: [ 4, 5, 5 ]
}, {
boardId: 112,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, 2, 2, -1, -1, -1 ], [ -1, -1, 2, 5, 5, 2, -1, -1 ], [ -1, -1, 2, 5, 5, 2, -1, -1 ], [ -1, 6, -1, 2, 2, -1, -1, -1 ], [ -1, -1, 6, 6, 6, -1, 6, -1 ], [ -1, -1, -1, 6, 6, 6, -1, -1 ], [ -1, -1, -1, 6, 6, -1, -1, -1 ] ],
producerBlocks: [ 19, 34, 10 ],
blocksColors: [ 5, 6, 6 ]
}, {
boardId: 113,
boardData: [ [ -1, -1, 5, 5, -1, -1, -1, -1 ], [ -1, 1, 5, 5, 5, 5, -1, -1 ], [ -1, 1, 5, 5, 5, 5, 5, 5 ], [ -1, 1, 5, 5, 5, 5, 5, 5 ], [ -1, 1, -1, -1, 5, 5, 5, 5 ], [ -1, 1, -1, -1, -1, -1, 5, 5 ], [ -1, 1, -1, -1, -1, -1, -1, -1 ], [ -1, 1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 31, 30, 36 ],
blocksColors: [ 4, 7, 2 ]
}, {
boardId: 114,
boardData: [ [ 2, 2, -1, -1, -1, -1, -1, -1 ], [ 2, 2, -1, -1, -1, -1, -1, -1 ], [ 2, 2, -1, -1, -1, -1, -1, -1 ], [ 2, 2, -1, -1, -1, -1, -1, -1 ], [ 2, 2, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 5, -1, -1, -1, -1, -1 ], [ -1, -1, -1, 7, 7, 7, 7, 7 ], [ -1, -1, -1, 7, 7, 7, 7, 7 ] ],
producerBlocks: [ 18, 8, 11 ],
blocksColors: [ 4, 7, 2 ]
}, {
boardId: 115,
boardData: [ [ -1, -1, 1, 4, 5, 4, -1, -1 ], [ -1, -1, 1, 6, 2, 3, 5, -1 ], [ -1, -1, 1, 6, 6, 5, 4, 3 ], [ -1, -1, 1, 6, 6, 6, 2, 5 ], [ -1, 7, 1, 6, 6, 6, 6, 4 ], [ -1, 7, 7, 1, 1, 1, 1, 1 ], [ 7, 7, 7, 7, -1, -1, -1, -1 ], [ -1, 7, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 33, 31, 15 ],
blocksColors: [ 7, 7, 4 ]
}, {
boardId: 116,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, 5, 5, -1, -1, 5, 5, -1 ], [ 5, 5, 5, 5, 5, 5, -1, 5 ], [ 5, 5, 5, 5, 5, -1, -1, 5 ], [ 5, 5, 5, 5, 5, 5, -1, 5 ], [ -1, 5, 5, 5, 5, 5, 5, -1 ], [ -1, -1, 5, 5, 5, 5, -1, -1 ], [ -1, -1, -1, 5, 5, -1, -1, -1 ] ],
producerBlocks: [ 16, 25, 4 ],
blocksColors: [ 3, 4, 7 ]
}, {
boardId: 117,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, 7, 7, 7, 7, 7, -1, -1 ], [ -1, 7, 5, 7, 5, 7, -1, -1 ], [ -1, 7, 7, 7, 7, 7, -1, -1 ], [ -1, 7, 7, 5, 7, 7, -1, -1 ], [ -1, 7, 7, 7, 7, 7, -1, -1 ], [ -1, -1, -1, 2, -1, -1, -1, -1 ], [ -1, -1, -1, 2, -1, -1, -1, -1 ] ],
producerBlocks: [ 9, 6, 1 ],
blocksColors: [ 2, 4, 7 ]
}, {
boardId: 118,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ 1, 1, -1, -1, -1, -1, 1, 1 ], [ 1, -1, 1, 1, 1, 1, -1, 1 ], [ 1, -1, -1, 7, 7, -1, -1, 1 ], [ -1, 1, -1, 7, 7, -1, 1, -1 ], [ -1, 1, 1, 7, 7, 1, 1, -1 ], [ -1, -1, 1, -1, -1, 1, -1, -1 ], [ -1, -1, -1, 1, 1, -1, -1, -1 ] ],
producerBlocks: [ 16, 19, 27 ],
blocksColors: [ 2, 4, 7 ]
}, {
boardId: 119,
boardData: [ [ -1, 2, 2, -1, -1, 2, 2, -1 ], [ 2, -1, -1, 2, 2, -1, -1, 2 ], [ 2, -1, -1, 2, 2, -1, -1, 2 ], [ -1, 2, 2, 4, 4, 2, 2, -1 ], [ -1, -1, -1, 4, 4, -1, -1, -1 ], [ -1, -1, -1, 4, 4, 4, -1, -1 ], [ -1, -1, -1, 4, 4, -1, -1, -1 ], [ -1, -1, -1, 4, 4, 4, -1, -1 ] ],
producerBlocks: [ 9, 9, 33 ],
blocksColors: [ 4, 6, 6 ]
}, {
boardId: 120,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 6, -1, 6, -1, 6, -1 ], [ -1, -1, -1, 6, 6, 6, -1, -1 ], [ -1, -1, -1, 4, 2, 4, -1, -1 ], [ -1, -1, 2, 4, 2, 4, 2, -1 ], [ -1, -1, 4, 2, 4, 2, 4, -1 ], [ -1, -1, 2, 4, 2, 4, 2, -1 ], [ -1, -1, -1, 2, 4, 2, -1, -1 ] ],
producerBlocks: [ 9, 32, 26 ],
blocksColors: [ 6, 4, 5 ]
}, {
boardId: 121,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, 6, 6, -1 ], [ -1, -1, -1, -1, -1, -1, 6, 6 ], [ -1, -1, -1, -1, -1, -1, -1, 6 ], [ -1, -1, 2, -1, 2, -1, -1, 6 ], [ 6, 6, 6, 6, 6, 6, -1, 6 ], [ -1, -1, -1, 6, 6, 6, 6, 6 ], [ -1, 6, 6, 6, 6, 6, 6, -1 ] ],
producerBlocks: [ 26, 34, 15 ],
blocksColors: [ 5, 4, 6 ]
}, {
boardId: 122,
boardData: [ [ -1, 7, 7, -1, -1, -1, -1, -1 ], [ -1, -1, 7, 7, -1, 3, -1, -1 ], [ 7, 7, -1, 7, 4, 2, 3, -1 ], [ -1, 7, 7, 4, 2, 4, -1, -1 ], [ -1, -1, -1, 2, 4, 7, 7, -1 ], [ -1, -1, 2, -1, 7, -1, 7, 7 ], [ -1, 2, -1, -1, 7, 7, -1, 7 ], [ 2, -1, -1, -1, -1, 7, -1, -1 ] ],
producerBlocks: [ 8, 42, 25 ],
blocksColors: [ 4, 6, 6 ]
}, {
boardId: 123,
boardData: [ [ -1, -1, -1, 7, 7, 7, -1, -1 ], [ -1, -1, 7, 7, 7, -1, 7, -1 ], [ -1, 7, 7, 7, -1, 7, 7, -1 ], [ 7, 2, 7, -1, 7, 7, 7, -1 ], [ 7, 7, 7, -1, 7, 7, 7, -1 ], [ -1, 7, 7, 7, -1, 7, 7, -1 ], [ -1, -1, 7, 7, 7, -1, 7, -1 ], [ -1, -1, -1, 7, 7, 7, -1, -1 ] ],
producerBlocks: [ 19, 41, 39 ],
blocksColors: [ 4, 3, 3 ]
}, {
boardId: 124,
boardData: [ [ 2, -1, 2, -1, -1, -1, -1, 4 ], [ 4, 2, 4, -1, -1, 4, 4, -1 ], [ 2, 2, 2, -1, 4, -1, -1, -1 ], [ -1, 2, -1, -1, -1, 4, -1, -1 ], [ -1, 2, -1, -1, -1, -1, 4, -1 ], [ 2, 2, 2, 2, 2, 2, 2, -1 ], [ 2, 2, 2, 2, 2, 2, 2, -1 ], [ 4, -1, -1, -1, -1, -1, 4, -1 ] ],
producerBlocks: [ 17, 4, 10 ],
blocksColors: [ 3, 4, 2 ]
}, {
boardId: 125,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 2, 2, 4, 4, -1, -1 ], [ -1, -1, 2, -1, -1, 4, -1, -1 ], [ -1, -1, 2, -1, -1, 4, -1, -1 ], [ -1, -1, -1, 2, 4, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 39, 41, 35 ],
blocksColors: [ 2, 4, 6 ]
}, {
boardId: 126,
boardData: [ [ -1, -1, -1, -1, -1, 2, 7, -1 ], [ -1, -1, -1, -1, -1, 2, 2, 4 ], [ -1, -1, -1, -1, -1, 2, -1, -1 ], [ -1, -1, -1, 2, 2, 2, 2, -1 ], [ -1, -1, 2, 2, 2, 2, 2, -1 ], [ -1, 2, 3, 3, 3, 2, -1, -1 ], [ -1, 2, 2, 2, 2, -1, -1, -1 ], [ -1, -1, -1, 4, -1, -1, -1, -1 ] ],
producerBlocks: [ 6, 32, 36 ],
blocksColors: [ 4, 7, 6 ]
}, {
boardId: 127,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, 3, 3, 3, -1 ], [ -1, -1, -1, 3, 3, 3, -1, 5 ], [ -1, -1, -1, 3, 3, 3, -1, -1 ], [ -1, -1, 3, 3, 3, 3, 3, -1 ], [ -1, -1, 2, 2, 2, 2, 2, -1 ], [ -1, 3, 3, 3, 3, 3, 3, 3 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 8, 32, 9 ],
blocksColors: [ 7, 7, 4 ]
}, {
boardId: 128,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, 6, -1, -1, -1 ], [ -1, -1, -1, 6, -1, -1, -1, -1 ], [ -1, 4, 4, 4, 4, 4, -1, -1 ], [ 4, 4, 2, 4, 2, 4, 4, -1 ], [ 4, 4, 4, 4, 4, 4, 4, -1 ], [ 4, 4, 2, 2, 2, 4, 4, -1 ], [ -1, 4, 4, 4, 4, 4, -1, -1 ] ],
producerBlocks: [ 34, 29, 25 ],
blocksColors: [ 3, 6, 7 ]
}, {
boardId: 129,
boardData: [ [ -1, -1, -1, -1, -1, 7, 7, -1 ], [ -1, -1, -1, -1, 7, 7, 7, 7 ], [ -1, -1, -1, -1, 7, 2, 7, 7 ], [ -1, -1, -1, -1, 7, 7, 7, 7 ], [ -1, -1, -1, -1, 7, -1, 7, 7 ], [ -1, 7, -1, -1, 7, -1, -1, 7 ], [ -1, 7, -1, -1, 7, -1, -1, -1 ], [ -1, -1, 7, 7, -1, -1, -1, -1 ] ],
producerBlocks: [ 2, 9, 20 ],
blocksColors: [ 2, 4, 5 ]
}, {
boardId: 130,
boardData: [ [ -1, 3, -1, -1, 3, -1, -1, -1 ], [ -1, 3, 3, 3, 3, -1, -1, -1 ], [ -1, 3, 3, 3, 3, -1, -1, 3 ], [ -1, -1, 2, 2, -1, -1, -1, 3 ], [ -1, -1, 3, 3, 3, -1, -1, 3 ], [ -1, -1, 3, 3, 3, 3, -1, 3 ], [ -1, -1, 3, 3, 3, 3, 3, -1 ], [ -1, 3, 3, 3, 3, 3, -1, -1 ] ],
producerBlocks: [ 3, 28, 25 ],
blocksColors: [ 2, 4, 7 ]
}, {
boardId: 131,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, 4, 4, -1, -1 ], [ -1, -1, -1, -1, 4, 2, 7, -1 ], [ -1, 7, -1, -1, 4, 7, 7, -1 ], [ -1, -1, 7, 1, 7, 7, -1, -1 ], [ -1, -1, 7, 7, 7, 7, -1, -1 ], [ -1, -1, 7, -1, -1, 7, -1, -1 ], [ -1, -1, 3, -1, -1, 3, -1, -1 ] ],
producerBlocks: [ 9, 36, 30 ],
blocksColors: [ 2, 4, 7 ]
}, {
boardId: 132,
boardData: [ [ -1, 5, -1, -1, -1, -1, -1, -1 ], [ 5, 5, 5, -1, -1, -1, -1, -1 ], [ 5, -1, 5, -1, -1, -1, -1, 2 ], [ -1, 5, 5, 5, 5, 5, 5, 2 ], [ -1, 5, 5, 5, 5, 5, 5, 2 ], [ 5, -1, -1, -1, -1, 5, 5, 2 ], [ -1, 5, -1, -1, -1, 5, 5, -1 ], [ -1, -1, -1, -1, 5, -1, 5, -1 ] ],
producerBlocks: [ 2, 9, 2 ],
blocksColors: [ 6, 4, 5 ]
}, {
boardId: 133,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, 4, 4, -1, 4, 4, -1, -1 ], [ -1, 4, 4, 2, 4, 4, -1, -1 ], [ -1, 2, 7, 2, 7, 2, -1, 4 ], [ -1, -1, 2, 3, 2, -1, -1, 4 ], [ -1, -1, 2, 2, 2, -1, 2, 4 ], [ -1, -1, 2, 2, 2, 2, 2, 2 ], [ -1, -1, 2, -1, 2, 2, -1, 2 ] ],
producerBlocks: [ 42, 26, 19 ],
blocksColors: [ 5, 4, 6 ]
}, {
boardId: 134,
boardData: [ [ -1, -1, -1, -1, -1, 3, 2, -1 ], [ -1, -1, -1, -1, -1, 3, 3, 2 ], [ -1, -1, -1, 3, 3, 3, 3, -1 ], [ -1, -1, 3, 3, 3, 3, 3, -1 ], [ -1, 3, 3, 3, 3, 3, -1, -1 ], [ 3, 3, 3, 3, 3, -1, -1, -1 ], [ 3, -1, -1, -1, 2, -1, -1, -1 ], [ -1, -1, -1, 2, 2, 2, -1, -1 ] ],
producerBlocks: [ 20, 29, 9 ],
blocksColors: [ 4, 6, 6 ]
}, {
boardId: 135,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 2, 2, 2, -1, -1, -1 ], [ -1, -1, 2, 5, 2, -1, -1, -1 ], [ -1, -1, 2, 2, 2, -1, -1, -1 ], [ -1, 4, -1, 6, -1, -1, -1, -1 ], [ -1, -1, 4, 6, -1, 4, -1, -1 ], [ -1, -1, -1, 6, 4, -1, -1, -1 ], [ -1, -1, -1, 6, -1, -1, -1, -1 ] ],
producerBlocks: [ 5, 19, 10 ],
blocksColors: [ 4, 3, 3 ]
}, {
boardId: 136,
boardData: [ [ -1, 4, 4, -1, -1, -1, -1, -1 ], [ 2, 4, 4, 4, -1, -1, -1, -1 ], [ -1, -1, 4, -1, -1, -1, -1, 4 ], [ -1, 4, 4, 4, -1, -1, 4, 4 ], [ -1, 4, 4, 4, 4, 4, 4, 4 ], [ -1, -1, 4, 4, 4, 4, 4, -1 ], [ -1, -1, -1, -1, 4, 4, -1, -1 ], [ -1, -1, -1, 2, 2, -1, -1, -1 ] ],
producerBlocks: [ 31, 14, 25 ],
blocksColors: [ 3, 6, 6 ]
}, {
boardId: 137,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, 4, -1, -1, -1, -1 ], [ -1, -1, 5, 5, 5, -1, -1, -1 ], [ -1, 5, 5, 5, 5, 5, -1, -1 ], [ -1, -1, 4, 4, 4, -1, -1, -1 ], [ 5, 5, 5, 5, 5, 5, 5, -1 ], [ -1, 4, 4, 4, 4, 4, -1, -1 ], [ -1, 4, 4, -1, 4, 4, -1, -1 ] ],
producerBlocks: [ 27, 30, 9 ],
blocksColors: [ 6, 1, 6 ]
}, {
boardId: 138,
boardData: [ [ -1, -1, 2, 2, 2, 2, -1, -1 ], [ -1, 2, 2, 2, 2, 2, 2, -1 ], [ -1, 2, 7, 2, 2, 7, 2, -1 ], [ -1, 2, 7, 2, 2, 7, 2, -1 ], [ -1, 2, 4, 4, 4, 4, 2, -1 ], [ -1, 2, 2, 4, 4, 2, 2, -1 ], [ -1, -1, 2, 2, 2, 2, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 31, 29, 42 ],
blocksColors: [ 3, 1, 6 ]
}, {
boardId: 139,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, 2, -1, -1, 2, -1, 2, -1 ], [ 4, 2, -1, 2, 2, -1, 2, 2 ], [ -1, 2, -1, 2, 2, 2, 2, 2 ], [ -1, 2, 2, 2, 2, 2, 2, 2 ], [ -1, -1, 2, 2, 2, 2, 2, 2 ], [ -1, -1, -1, 2, -1, -1, 2, -1 ], [ -1, -1, -1, 3, -1, -1, 3, -1 ] ],
producerBlocks: [ 2, 9, 31 ],
blocksColors: [ 2, 4, 1 ]
}, {
boardId: 140,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ 2, 2, 2, 2, 2, 2, -1, -1 ], [ 2, -1, -1, -1, -1, 2, 3, -1 ], [ 2, -1, -1, -1, -1, 2, 3, 3 ], [ 2, -1, -1, -1, -1, 2, 3, 3 ], [ -1, 1, 1, 2, 2, 1, 1, 3 ], [ -1, 1, 1, -1, -1, 1, 1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 42, 28, 25 ],
blocksColors: [ 2, 4, 6 ]
}, {
boardId: 141,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, 1, 1, -1 ], [ -1, -1, -1, -1, 1, 1, -1, 1 ], [ -1, -1, -1, -1, 1, 1, 5, -1 ], [ -1, -1, -1, 1, 1, 1, 5, -1 ], [ -1, -1, 1, 1, 5, 5, -1, -1 ], [ -1, 5, 5, 5, 4, -1, -1, -1 ], [ 5, -1, -1, -1, 4, 4, -1, -1 ] ],
producerBlocks: [ 5, 25, 34 ],
blocksColors: [ 2, 4, 7 ]
}, {
boardId: 142,
boardData: [ [ -1, 5, 5, 5, 5, 5, -1, -1 ], [ 5, 7, 7, 5, 7, 7, 5, -1 ], [ 5, 7, 7, 5, 7, 7, 5, -1 ], [ 5, 5, 5, 5, 5, 5, 5, -1 ], [ 5, -1, 5, 5, 5, -1, 5, -1 ], [ 5, 2, 5, 5, 5, 2, 5, -1 ], [ 5, 5, 5, 5, 5, 5, 5, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 8, 32, 29 ],
blocksColors: [ 2, 4, 6 ]
}, {
boardId: 143,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 2, 2, 2, -1, -1, -1 ], [ -1, 2, -1, -1, -1, 2, -1, -1 ], [ 2, -1, -1, 2, -1, 2, -1, -1 ], [ -1, 2, -1, -1, -1, -1, 2, 2 ], [ -1, 2, -1, -1, -1, -1, -1, 2 ], [ -1, -1, 2, -1, -1, -1, 2, -1 ], [ -1, -1, -1, 2, 2, 2, -1, -1 ] ],
producerBlocks: [ 10, 28, 20 ],
blocksColors: [ 5, 4, 7 ]
}, {
boardId: 144,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, 3, -1, -1, -1, -1 ], [ -1, -1, 3, 4, 3, -1, -1, -1 ], [ -1, 2, -1, 3, -1, -1, 7, -1 ], [ 2, 4, 2, 6, -1, 7, 4, 7 ], [ -1, 2, -1, 6, -1, -1, 7, -1 ], [ -1, 6, -1, 6, -1, -1, 6, -1 ], [ -1, 6, -1, 6, -1, -1, 6, -1 ] ],
producerBlocks: [ 4, 19, 4 ],
blocksColors: [ 7, 1, 6 ]
}, {
boardId: 145,
boardData: [ [ -1, -1, 2, 2, 3, 2, -1, -1 ], [ -1, 2, 6, 2, 2, 2, 2, -1 ], [ 2, 2, 2, -1, -1, 2, 2, 2 ], [ 6, 2, -1, -1, -1, -1, 2, 2 ], [ 2, 2, -1, -1, -1, -1, 2, 5 ], [ 4, 2, 2, -1, -1, 5, 2, 4 ], [ -1, 4, 1, 2, 2, 2, 4, -1 ], [ -1, -1, 4, 4, 4, 4, -1, -1 ] ],
producerBlocks: [ 27, 28, 9 ],
blocksColors: [ 2, 4, 7 ]
}, {
boardId: 146,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 4, 4, 4, 4, -1, -1 ], [ -1, 4, 2, 4, 4, 2, 4, -1 ], [ 2, 4, -1, 2, 2, -1, 4, 2 ], [ 2, 4, -1, 2, 2, -1, 4, 2 ], [ -1, 4, 2, 5, 5, 2, 4, -1 ], [ -1, 4, 2, 2, 2, 2, 4, -1 ], [ -1, -1, 2, 2, 2, 2, -1, -1 ] ],
producerBlocks: [ 34, 29, 30 ],
blocksColors: [ 2, 4, 7 ]
}, {
boardId: 147,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, 2, -1, -1, -1, -1 ], [ -1, 2, -1, -1, -1, 2, -1, -1 ], [ -1, -1, 4, 4, 4, -1, -1, -1 ], [ 2, -1, 4, 4, 4, -1, 2, -1 ], [ -1, -1, 4, 4, 4, -1, -1, -1 ], [ -1, 2, -1, -1, -1, 2, -1, -1 ], [ -1, -1, -1, 2, -1, -1, -1, -1 ] ],
producerBlocks: [ 23, 30, 10 ],
blocksColors: [ 2, 4, 7 ]
}, {
boardId: 148,
boardData: [ [ -1, 7, -1, -1, -1, -1, 3, -1 ], [ 7, -1, 7, -1, -1, 3, -1, 3 ], [ -1, 7, 2, 2, 2, 2, 3, -1 ], [ -1, -1, 2, -1, -1, 2, -1, -1 ], [ -1, -1, 2, -1, -1, 2, -1, -1 ], [ -1, 4, 2, 2, 2, 2, 1, -1 ], [ 4, -1, 4, -1, -1, 1, -1, 1 ], [ -1, 4, -1, -1, -1, -1, 1, -1 ] ],
producerBlocks: [ 9, 39, 41 ],
blocksColors: [ 2, 4, 6 ]
}, {
boardId: 149,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, 6, -1, -1, -1 ], [ -1, -1, 6, 6, 6, 6, 6, -1 ], [ -1, 5, 6, 5, 6, 5, 6, 5 ], [ -1, 5, 5, 5, 5, 5, 5, 5 ], [ -1, 5, 5, 5, 5, 5, 5, 5 ], [ -1, -1, 5, 5, 5, 5, 5, -1 ] ],
producerBlocks: [ 20, 25, 42 ],
blocksColors: [ 2, 4, 7 ]
}, {
boardId: 150,
boardData: [ [ -1, -1, 5, -1, -1, 5, -1, -1 ], [ -1, -1, -1, 5, 5, -1, -1, -1 ], [ -1, -1, 2, 2, 2, 2, -1, -1 ], [ -1, 2, -1, -1, -1, -1, 2, -1 ], [ -1, 2, 2, 2, 2, 2, 2, -1 ], [ -1, 2, 7, 2, 2, 7, 2, -1 ], [ -1, 2, 2, 2, 2, 2, 2, -1 ], [ -1, -1, 5, -1, -1, 5, -1, -1 ] ],
producerBlocks: [ 29, 42, 25 ],
blocksColors: [ 2, 4, 6 ]
}, {
boardId: 151,
boardData: [ [ -1, -1, -1, -1, -1, 7, 7, 7 ], [ -1, -1, -1, -1, -1, -1, 7, 7 ], [ -1, -1, -1, 4, -1, -1, -1, 7 ], [ 4, 4, 2, 2, 2, -1, 2, 2 ], [ 4, -1, 2, 2, 2, 2, 2, -1 ], [ -1, 4, 2, 2, 2, -1, -1, -1 ], [ -1, -1, -1, 4, -1, -1, -1, -1 ], [ -1, -1, 4, 4, 4, -1, -1, -1 ] ],
producerBlocks: [ 38, 25, 20 ],
blocksColors: [ 2, 4, 1 ]
}, {
boardId: 152,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 5, 5, -1, -1, -1, -1 ], [ -1, 2, -1, 5, 5, -1, -1, -1 ], [ -1, -1, -1, 5, 5, 5, -1, -1 ], [ -1, -1, 5, 5, 5, 5, 5, -1 ], [ -1, 4, 4, 4, 4, 4, 4, 4 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ] ],
producerBlocks: [ 8, 19, 25 ],
blocksColors: [ 2, 4, 7 ]
}, {
boardId: 153,
boardData: [ [ -1, -1, 5, -1, -1, -1, -1, -1 ], [ -1, 5, 5, 5, -1, -1, -1, -1 ], [ 2, 5, 4, -1, -1, -1, 4, -1 ], [ -1, 4, 4, 4, -1, 4, 4, 4 ], [ -1, 4, 4, 4, 4, 4, -1, 4 ], [ -1, -1, 4, 4, 4, 4, -1, -1 ], [ -1, -1, -1, 4, 4, -1, -1, -1 ], [ -1, -1, 2, 2, -1, -1, -1, -1 ] ],
producerBlocks: [ 42, 26, 20 ],
blocksColors: [ 2, 4, 7 ]
}, {
boardId: 154,
boardData: [ [ -1, -1, -1, 4, -1, -1, -1, -1 ], [ -1, -1, 4, 4, 4, -1, -1, -1 ], [ -1, -1, 2, 2, 2, -1, -1, -1 ], [ 2, -1, 2, 2, 2, -1, 2, -1 ], [ 2, 4, 4, 4, 4, 4, 2, -1 ], [ 2, 4, 4, 4, 4, 4, 2, -1 ], [ 2, 4, 4, -1, 4, 4, 2, -1 ], [ 2, 4, 4, -1, 4, 4, 2, -1 ] ],
producerBlocks: [ 20, 4, 25 ],
blocksColors: [ 2, 4, 7 ]
}, {
boardId: 155,
boardData: [ [ -1, -1, -1, 1, -1, -1, -1, -1 ], [ -1, -1, -1, 1, -1, -1, -1, -1 ], [ -1, 2, -1, 4, -1, -1, -1, -1 ], [ -1, -1, 2, 4, -1, 2, -1, -1 ], [ -1, 2, 2, 4, 2, -1, -1, -1 ], [ -1, 2, 2, -1, 2, 2, -1, -1 ], [ -1, 2, 2, 2, 2, 2, -1, -1 ], [ -1, -1, 2, 2, 2, -1, -1, -1 ] ],
producerBlocks: [ 20, 42, 10 ],
blocksColors: [ 5, 7, 6 ]
}, {
boardId: 156,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, 1, 1, -1, -1 ], [ -1, -1, -1, 1, 1, 1, 1, -1 ], [ -1, 2, 2, 2, 1, 2, 1, -1 ], [ 2, 2, 2, 2, 1, 1, 1, -1 ], [ 2, 4, 4, 4, 1, 1, 1, -1 ], [ 4, -1, -1, 1, 1, 1, 1, 1 ], [ -1, -1, 1, 1, 1, 1, 1, 1 ] ],
producerBlocks: [ 20, 14, 30 ],
blocksColors: [ 2, 4, 7 ]
}, {
boardId: 157,
boardData: [ [ -1, -1, -1, 3, 3, -1, -1, -1 ], [ -1, -1, 3, 3, -1, -1, -1, -1 ], [ -1, 3, 3, -1, 3, -1, -1, -1 ], [ 3, 3, -1, -1, -1, 3, -1, -1 ], [ 2, 4, 2, 4, 2, 4, 2, -1 ], [ 3, 3, 3, 3, 3, 3, 3, -1 ], [ -1, 3, -1, -1, -1, 3, -1, -1 ], [ -1, 3, -1, -1, -1, 3, -1, -1 ] ],
producerBlocks: [ 19, 32, 10 ],
blocksColors: [ 2, 4, 7 ]
}, {
boardId: 158,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ 5, -1, 5, -1, 5, -1, 5, -1 ], [ 5, 5, 5, 5, 5, 5, 5, -1 ], [ 4, 4, 4, 4, 4, 4, 4, -1 ], [ 2, 2, 2, 2, 2, 2, 2, -1 ], [ 4, 4, -1, -1, -1, 4, 4, -1 ], [ 2, 2, -1, -1, -1, 2, 2, -1 ], [ 4, 4, -1, -1, -1, 4, 4, -1 ] ],
producerBlocks: [ 26, 4, 26 ],
blocksColors: [ 6, 4, 7 ]
}, {
boardId: 159,
boardData: [ [ -1, -1, -1, 5, -1, -1, -1, -1 ], [ -1, -1, -1, 5, -1, -1, -1, -1 ], [ -1, -1, -1, 5, -1, -1, -1, -1 ], [ -1, -1, -1, 5, -1, -1, -1, -1 ], [ -1, -1, -1, 5, -1, -1, -1, -1 ], [ -1, -1, 5, 7, 5, -1, -1, -1 ], [ -1, 5, 7, -1, 7, 5, -1, -1 ], [ 5, 7, -1, -1, -1, 7, 5, -1 ] ],
producerBlocks: [ 20, 25, 10 ],
blocksColors: [ 2, 4, 6 ]
}, {
boardId: 160,
boardData: [ [ -1, 2, 7, 7, 7, 2, -1, -1 ], [ 2, 7, 7, 7, 7, 7, 2, -1 ], [ 2, 7, 7, 7, 7, 7, 2, -1 ], [ 2, 7, 7, 7, 7, 7, 2, -1 ], [ -1, 2, 7, 7, 7, 2, -1, -1 ], [ -1, -1, 2, -1, 2, -1, -1, -1 ], [ -1, -1, -1, 2, -1, -1, -1, -1 ], [ -1, -1, -1, 2, -1, -1, -1, -1 ] ],
producerBlocks: [ 20, 32, 25 ],
blocksColors: [ 3, 4, 6 ]
}, {
boardId: 161,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 4, 4, 4, 1, 7, -1 ], [ -1, -1, 4, 4, 4, 1, 7, 7 ], [ -1, -1, 4, 4, 4, 1, 7, 7 ], [ -1, 1, 1, 1, 1, 1, 1, 1 ], [ -1, 1, 3, 3, 1, 3, 3, 1 ], [ -1, -1, 3, 3, -1, 3, 3, -1 ] ],
producerBlocks: [ 9, 31, 42 ],
blocksColors: [ 2, 4, 6 ]
}, {
boardId: 162,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, 2, 2, -1, -1, 5, 5, -1 ], [ -1, 2, 2, 2, 5, 5, 5, -1 ], [ -1, 2, -1, 2, 5, -1, 5, -1 ], [ -1, 2, 2, 2, 5, 5, 5, -1 ], [ -1, 2, -1, -1, -1, -1, 5, -1 ], [ -1, -1, 2, -1, -1, 5, -1, -1 ], [ -1, -1, -1, 2, 5, -1, -1, -1 ] ],
producerBlocks: [ 9, 15, 6 ],
blocksColors: [ 6, 4, 6 ]
}, {
boardId: 163,
boardData: [ [ -1, -1, -1, -1, -1, -1, -1, -1 ], [ -1, -1, 2, 2, 2, -1, -1, -1 ], [ -1, 2, 5, 5, 5, 2, -1, -1 ], [ -1, 2, 5, 5, 5, 2, -1, -1 ], [ -1, 2, 5, 5, 5, 2, -1, -1 ], [ -1, -1, 2, 2, 2, -1, -1, -1 ], [ -1, 6, -1, 4, -1, 6, -1, -1 ], [ -1, -1, 6, 4, 6, -1, -1, -1 ] ],
producerBlocks: [ 34, 38, 37 ],
blocksColors: [ 2, 4, 6 ]
}, {
boardId: 164,
boardData: [ [ -1, -1, -1, 7, 7, 7, -1, -1 ], [ -1, -1, 7, -1, -1, -1, 7, -1 ], [ -1, 7, -1, -1, -1, 7, -1, -1 ], [ 7, -1, -1, -1, 7, -1, -1, -1 ], [ 2, 2, 2, 2, 2, -1, -1, -1 ], [ 2, 2, 3, 2, 2, -1, -1, -1 ], [ 4, 4, 3, 4, 4, -1, -1, -1 ], [ 4, 4, 4, 4, 4, -1, -1, -1 ] ],
producerBlocks: [ 41, 41, 41 ],
blocksColors: [ 7, 3, 6 ]
} ];
cc._RF.pop();
}, {} ],
NewUserBoardDiffGuideInfo: [ function(o, r, e) {
"use strict";
cc._RF.push(r, "af01fkTcTZC7LF0phS5fxbu", "NewUserBoardDiffGuideInfo");
var t = this && this.__awaiter || function(o, r, e, t) {
return new (e || (e = Promise))(function(a, s) {
function i(o) {
try {
l(t.next(o));
} catch (o) {
s(o);
}
}
function n(o) {
try {
l(t.throw(o));
} catch (o) {
s(o);
}
}
function l(o) {
o.done ? a(o.value) : (r = o.value, r instanceof e ? r : new e(function(o) {
o(r);
})).then(i, n);
var r;
}
l((t = t.apply(o, r || [])).next());
});
}, a = this && this.__generator || function(o, r) {
var e, t, a, s, i = {
label: 0,
sent: function() {
if (1 & a[0]) throw a[1];
return a[1];
},
trys: [],
ops: []
};
return s = {
next: n(0),
throw: n(1),
return: n(2)
}, "function" == typeof Symbol && (s[Symbol.iterator] = function() {
return this;
}), s;
function n(o) {
return function(r) {
return l([ o, r ]);
};
}
function l(s) {
if (e) throw new TypeError("Generator is already executing.");
for (;i; ) try {
if (e = 1, t && (a = 2 & s[0] ? t.return : s[0] ? t.throw || ((a = t.return) && a.call(t), 
0) : t.next) && !(a = a.call(t, s[1])).done) return a;
(t = 0, a) && (s = [ 2 & s[0], a.value ]);
switch (s[0]) {
case 0:
case 1:
a = s;
break;

case 4:
i.label++;
return {
value: s[1],
done: !1
};

case 5:
i.label++;
t = s[1];
s = [ 0 ];
continue;

case 7:
s = i.ops.pop();
i.trys.pop();
continue;

default:
if (!(a = i.trys, a = a.length > 0 && a[a.length - 1]) && (6 === s[0] || 2 === s[0])) {
i = 0;
continue;
}
if (3 === s[0] && (!a || s[1] > a[0] && s[1] < a[3])) {
i.label = s[1];
break;
}
if (6 === s[0] && i.label < a[1]) {
i.label = a[1];
a = s;
break;
}
if (a && i.label < a[2]) {
i.label = a[2];
i.ops.push(s);
break;
}
a[2] && i.ops.pop();
i.trys.pop();
continue;
}
s = r.call(o, i);
} catch (o) {
s = [ 6, o ];
t = 0;
} finally {
e = a = 0;
}
if (5 & s[0]) throw s[1];
return {
value: s[0] ? s[1] : void 0,
done: !0
};
}
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.newUserBoardDiffGuideInfo = e.NewUserBoardDiffGuideInfo = void 0;
var s = o("./NewUserBoardDiffTraitInfo"), i = function() {
function o() {
this.spineHighlight = null;
this.guideComponent = null;
this.spineDataCache = new Map();
}
o.prototype.preloadSpineData = function(o) {
return t(this, void 0, Promise, function() {
var r, e;
return a(this, function(t) {
switch (t.label) {
case 0:
if (!(r = s.NewUserBoardDiffTraitInfo.getSpinePath(o)) || this.spineDataCache.has(r)) return [ 2 ];
t.label = 1;

case 1:
t.trys.push([ 1, 3, , 4 ]);
return [ 4, hs.ResLoader.asyncLoadByBundle("NewUserBoardDiffTrait", r, sp.SkeletonData) ];

case 2:
(e = t.sent()) && this.spineDataCache.set(r, e);
return [ 3, 4 ];

case 3:
t.sent();
return [ 3, 4 ];

case 4:
return [ 2 ];
}
});
});
};
o.prototype.createTargetHighlight = function(o, r) {
return t(this, void 0, Promise, function() {
var e, t;
return a(this, function(a) {
switch (a.label) {
case 0:
return storage.getItem("isFinishedGuide", !1) || this.spineHighlight ? [ 2 ] : (e = Cinst(hs.Board)) && cc.isValid(e.node) && cc.isValid(e.node.parent) ? (t = s.NewUserBoardDiffTraitInfo.getSpinePath(o)) ? [ 4, this.createSpineHighlight(t, e.node, r) ] : [ 3, 2 ] : [ 2 ];

case 1:
a.sent();
a.label = 2;

case 2:
return [ 2 ];
}
});
});
};
o.prototype.createSpineHighlight = function(o, r, e) {
var i;
return t(this, void 0, Promise, function() {
var t, n, l, d, c;
return a(this, function(a) {
switch (a.label) {
case 0:
t = new cc.Node("SpineHighlight");
this.spineHighlight = t;
a.label = 1;

case 1:
a.trys.push([ 1, 4, , 5 ]);
return (n = this.spineDataCache.get(o)) ? [ 3, 3 ] : [ 4, hs.ResLoader.asyncLoadByBundle("NewUserBoardDiffTrait", o, sp.SkeletonData) ];

case 2:
(n = a.sent()) && this.spineDataCache.set(o, n);
a.label = 3;

case 3:
if (!n) {
this.clearSpineHighlight();
return [ 2 ];
}
(l = t.addComponent(sp.Skeleton)).skeletonData = n;
l.premultipliedAlpha = !1;
if (e && e.length > 0) {
d = s.NewUserBoardDiffTraitInfo.calculateTargetCenter(e);
t.setPosition(r.x + d.x, r.y + d.y);
}
t.parent = r.parent;
t.setSiblingIndex(r.getSiblingIndex() + 1);
c = null !== (i = cc.director._kSpeed) && void 0 !== i ? i : 1;
l.timeScale = 1 / c;
l.setAnimation(0, "in", !0);
return [ 3, 5 ];

case 4:
a.sent();
this.clearSpineHighlight();
return [ 3, 5 ];

case 5:
return [ 2 ];
}
});
});
};
o.prototype.clearSpineHighlight = function() {
if (this.spineHighlight && cc.isValid(this.spineHighlight)) {
this.spineHighlight.removeFromParent();
this.spineHighlight.destroy();
}
this.spineHighlight = null;
};
o.prototype.clear = function() {
var o, r;
this.clearSpineHighlight();
if (this.guideComponent) {
null === (r = (o = this.guideComponent).setState) || void 0 === r || r.call(o, {
showDarkMask: !1,
showHand: !1
});
this.guideComponent = null;
}
};
return o;
}();
e.NewUserBoardDiffGuideInfo = i;
e.newUserBoardDiffGuideInfo = new i();
cc._RF.pop();
}, {
"./NewUserBoardDiffTraitInfo": "NewUserBoardDiffTraitInfo"
} ],
NewUserBoardDiffInfo: [ function(o, r, e) {
"use strict";
cc._RF.push(r, "43ca9ah7jJCmoW1tbCI0jSp", "NewUserBoardDiffInfo");
var t = this && this.__assign || function() {
return (t = Object.assign || function(o) {
for (var r, e = 1, t = arguments.length; e < t; e++) {
r = arguments[e];
for (var a in r) Object.prototype.hasOwnProperty.call(r, a) && (o[a] = r[a]);
}
return o;
}).apply(this, arguments);
}, a = this && this.__decorate || function(o, r, e, t) {
var a, s = arguments.length, i = s < 3 ? r : null === t ? t = Object.getOwnPropertyDescriptor(r, e) : t;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(o, r, e, t); else for (var n = o.length - 1; n >= 0; n--) (a = o[n]) && (i = (s < 3 ? a(i) : s > 3 ? a(r, e, i) : a(r, e)) || i);
return s > 3 && i && Object.defineProperty(r, e, i), i;
}, s = this && this.__values || function(o) {
var r = "function" == typeof Symbol && Symbol.iterator, e = r && o[r], t = 0;
if (e) return e.call(o);
if (o && "number" == typeof o.length) return {
next: function() {
o && t >= o.length && (o = void 0);
return {
value: o && o[t++],
done: !o
};
}
};
throw new TypeError(r ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.newUserBoardDiffInfo = e.NewUserBoardDiffInfo = void 0;
var i = o("./NewUserBoardDiffTraitInfo"), n = o("../types/NewUserBoardDiffType"), l = o("../configs/NewUserBoardDiffConfig"), d = function() {
function o() {
this.tempAllowSkinNodes = new WeakSet();
this.blockNodeToPositionKeyCache = new Map();
this.positionColorMap = {};
this.boardId = 0;
this.logicalGameNum = 0;
this.firstRoundBlocksApplied = !1;
this.lastGameScore = 0;
this.prevLastGameScore = 0;
this.lastSystemBoardWeight = 0;
this.coldStartCount = 0;
this.lastSessionTs = 0;
this.coldStartBoardsUsed = 0;
this.usedManualIds = [];
this.consecutiveNonManual = 0;
this.hasEverReplayed = !1;
this.weightCycleIdx = 0;
this.replayCountThisGame = 0;
this.replayGameNum = -1;
this.firstReplayGameNum = -1;
this.firstReplayTriggerScore = -1;
this.replayTriggerBoardWeight = -1;
this.currentReplayGame = !1;
this.originalBoardWasEmpty = !1;
this.sessionColdStart = !1;
this.sessionGameCount = 0;
this.firstPlayTs = 0;
this.systemEmptyCycleIdx = 0;
this.currentGameStartTs = 0;
this.lastGameDurationMs = 0;
}
o.prototype.buildBlockNodeToPositionKeyCache = function() {
var o, r = null === (o = hs.boardRendererInfo) || void 0 === o ? void 0 : o.blocks;
this.blockNodeToPositionKeyCache = new Map();
if (r) for (var e = 0; e < Object.keys(r).length; e++) {
var t = r[e];
if (t) for (var a = 0; a < Object.keys(t).length; a++) {
var s = t[a];
s && cc.isValid(s) && this.blockNodeToPositionKeyCache.set(s, e + "_" + a);
}
}
};
o.prototype.getPositionKeyFromBlockNode = function(o) {
var r, e;
0 === this.blockNodeToPositionKeyCache.size && this.buildBlockNodeToPositionKeyCache();
var t = null !== (r = this.blockNodeToPositionKeyCache.get(o)) && void 0 !== r ? r : null;
if (null === t) {
this.buildBlockNodeToPositionKeyCache();
t = null !== (e = this.blockNodeToPositionKeyCache.get(o)) && void 0 !== e ? e : null;
}
return t;
};
o.prototype.markManualInitBoardBlock = function(o, r) {
if (o && cc.isValid(o) && "number" == typeof r && !(r <= 0)) {
var e = this.getPositionKeyFromBlockNode(o);
null == e || "" === e || e in this.positionColorMap || (this.positionColorMap[e] = r);
}
};
o.prototype.getManualInitBoardBlockInitialSourceColor = function(o) {
if (!o || !cc.isValid(o)) return null;
var r = this.getPositionKeyFromBlockNode(o);
if (null == r || "" === r) return null;
var e = this.positionColorMap[r];
return "number" == typeof e ? e : null;
};
o.prototype.setBlockColor = function(o, r, e) {
void 0 === e && (e = !1);
"number" != typeof r || !Number.isFinite(r) || r <= 0 || null == o || o.setState({
color: r,
sourceColor: r,
canEliminate: e
}, !0);
};
o.prototype.resetManualInitBoardBlockColor = function(o) {
var r, e = null !== (r = null == o ? void 0 : o.node) && void 0 !== r ? r : null;
if (e && cc.isValid(e)) {
var t = this.getManualInitBoardBlockInitialSourceColor(e);
if (null !== t) {
this.setManualInitBoardTempAllowSkin(e, !1);
this.setBlockColor(o, t, !1);
}
}
};
o.prototype.clearManualInitBoardBlock = function(o) {
if (o && cc.isValid(o)) {
var r = this.getPositionKeyFromBlockNode(o);
if (null != r && "" !== r && r in this.positionColorMap) {
delete this.positionColorMap[r];
this.flushPositionColorMap();
}
}
};
o.prototype.deletePositionColorMapKeys = function(o) {
var r, e, t = this.positionColorMap, a = 0;
try {
for (var i = s(o), n = i.next(); !n.done; n = i.next()) {
var l = n.value;
if (l in t) {
delete t[l];
a++;
}
}
} catch (o) {
r = {
error: o
};
} finally {
try {
n && !n.done && (e = i.return) && e.call(i);
} finally {
if (r) throw r.error;
}
}
a > 0 && this.flushPositionColorMap();
return a;
};
o.prototype.clearPosMap = function() {
this.positionColorMap = {};
this.flushPositionColorMap();
};
o.prototype.flushPositionColorMap = function() {
this.positionColorMap = t({}, this.positionColorMap);
};
o.prototype.syncPositionColorMapFromStorage = function() {
var o, r, e, t, a = null === (e = hs.boardInfo) || void 0 === e ? void 0 : e.faceBlocks;
if (a) {
var i = storage.getItem(n.STORAGE_KEY_MANUAL_INIT_BOARD_POSITION_COLOR_MAP);
if (i && "object" == typeof i) {
var l = {};
try {
for (var d = s(Object.keys(i)), c = d.next(); !c.done; c = d.next()) {
var u = c.value, f = u.split("_"), p = parseInt(f[0], 10), h = parseInt(f[1], 10);
if (isNaN(p) || isNaN(h)) ; else {
var B = null === (t = a[p]) || void 0 === t ? void 0 : t[h];
"number" == typeof B && B > 0 && (l[u] = i[u]);
}
}
} catch (r) {
o = {
error: r
};
} finally {
try {
c && !c.done && (r = d.return) && r.call(d);
} finally {
if (o) throw o.error;
}
}
this.positionColorMap = l;
}
}
};
o.prototype.setManualInitBoardTempAllowSkin = function(o, r) {
o && cc.isValid(o) && (r ? this.tempAllowSkinNodes.add(o) : this.tempAllowSkinNodes.delete(o));
};
o.prototype.isManualInitBoardTempAllowSkin = function(o) {
return !(!o || !cc.isValid(o)) && this.tempAllowSkinNodes.has(o);
};
o.prototype.buildPositionColorMapFromSnapshot = function(o) {
var r, e = {};
if (!Array.isArray(o) || o.length <= 0) return e;
for (var t = 0; t < o.length; t++) for (var a = null !== (r = o[t]) && void 0 !== r ? r : [], s = 0; s < a.length; s++) {
var i = a[s];
"number" == typeof i && i > 0 && 10 !== i && (e[t + "_" + s] = i);
}
return e;
};
o.prototype.boardModified = function() {
var o, r, e, t, a = this;
if (!this.isManualBoard()) return !1;
var s = l.NewUserBoardDiffConfig.find(function(o) {
return o.boardId === a.boardId;
});
if (!s || !Array.isArray(s.boardData)) return !1;
var i = this.buildPositionColorMapFromSnapshot(s.boardData), n = this.positionColorMap, d = Object.keys(i), c = Object.keys(n);
if (d.length !== c.length || d.some(function(o) {
return i[o] !== n[o];
})) return !0;
var u = null === (o = hs.boardInfo) || void 0 === o ? void 0 : o.faceBlocks;
if (!u) return !1;
for (var f = 0; f < s.boardData.length; f++) {
var p = null !== (r = s.boardData[f]) && void 0 !== r ? r : [], h = u[f];
if (!h) return !0;
for (var B = 0; B < p.length; B++) {
var _ = null !== (e = p[B]) && void 0 !== e ? e : -1, I = null !== (t = h[B]) && void 0 !== t ? t : -1;
if ((_ <= 0 || 10 === _) != (I <= 0 || 10 === I)) return !0;
}
}
return !1;
};
o.prototype.isManualBoard = function() {
return i.NewUserBoardDiffTraitInfo.isManualBoard(this.boardId);
};
o.prototype.clear = function() {
this.tempAllowSkinNodes = new WeakSet();
this.blockNodeToPositionKeyCache = new Map();
};
a([ hs.storageProperty({
key: n.STORAGE_KEY_MANUAL_INIT_BOARD_POSITION_COLOR_MAP
}) ], o.prototype, "positionColorMap", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_BOARD_ID
}) ], o.prototype, "boardId", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_LOGICAL_GAME_NUM
}) ], o.prototype, "logicalGameNum", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_FIRST_ROUND_BLOCKS_APPLIED_BOARD
}) ], o.prototype, "firstRoundBlocksApplied", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_LAST_GAME_SCORE
}) ], o.prototype, "lastGameScore", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_PREV_LAST_GAME_SCORE
}) ], o.prototype, "prevLastGameScore", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_LAST_SYSTEM_BOARD_WEIGHT
}) ], o.prototype, "lastSystemBoardWeight", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_COLD_START_COUNT
}) ], o.prototype, "coldStartCount", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_LAST_SESSION_TS
}) ], o.prototype, "lastSessionTs", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_COLD_START_BOARDS_USED
}) ], o.prototype, "coldStartBoardsUsed", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_USED_MANUAL_IDS
}) ], o.prototype, "usedManualIds", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_CONSECUTIVE_NON_MANUAL
}) ], o.prototype, "consecutiveNonManual", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_HAS_EVER_REPLAYED
}) ], o.prototype, "hasEverReplayed", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_WEIGHT_CYCLE_IDX
}) ], o.prototype, "weightCycleIdx", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_REPLAY_COUNT_THIS_GAME
}) ], o.prototype, "replayCountThisGame", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_REPLAY_GAME_NUM
}) ], o.prototype, "replayGameNum", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_FIRST_REPLAY_GAME_NUM
}) ], o.prototype, "firstReplayGameNum", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_FIRST_REPLAY_TRIGGER_SCORE
}) ], o.prototype, "firstReplayTriggerScore", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_REPLAY_TRIGGER_BOARD_WEIGHT
}) ], o.prototype, "replayTriggerBoardWeight", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_CURRENT_REPLAY_GAME
}) ], o.prototype, "currentReplayGame", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_ORIGINAL_BOARD_WAS_EMPTY
}) ], o.prototype, "originalBoardWasEmpty", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_SESSION_COLD_START
}) ], o.prototype, "sessionColdStart", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_SESSION_GAME_COUNT
}) ], o.prototype, "sessionGameCount", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_FIRST_PLAY_TS
}) ], o.prototype, "firstPlayTs", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_SYSTEM_EMPTY_CYCLE_IDX
}) ], o.prototype, "systemEmptyCycleIdx", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_CURRENT_GAME_START_TS
}) ], o.prototype, "currentGameStartTs", void 0);
a([ hs.storageProperty({
key: n.STORAGE_KEY_LAST_GAME_DURATION_MS
}) ], o.prototype, "lastGameDurationMs", void 0);
return o;
}();
e.NewUserBoardDiffInfo = d;
e.newUserBoardDiffInfo = new d();
window.newUserBoardDiffInfo = e.newUserBoardDiffInfo;
cc._RF.pop();
}, {
"../configs/NewUserBoardDiffConfig": "NewUserBoardDiffConfig",
"../types/NewUserBoardDiffType": "NewUserBoardDiffType",
"./NewUserBoardDiffTraitInfo": "NewUserBoardDiffTraitInfo"
} ],
NewUserBoardDiffTraitInfo: [ function(o, r, e) {
"use strict";
cc._RF.push(r, "444bclCtjtGhJKTXPGIScI3", "NewUserBoardDiffTraitInfo");
var t = this && this.__assign || function() {
return (t = Object.assign || function(o) {
for (var r, e = 1, t = arguments.length; e < t; e++) {
r = arguments[e];
for (var a in r) Object.prototype.hasOwnProperty.call(r, a) && (o[a] = r[a]);
}
return o;
}).apply(this, arguments);
}, a = this && this.__values || function(o) {
var r = "function" == typeof Symbol && Symbol.iterator, e = r && o[r], t = 0;
if (e) return e.call(o);
if (o && "number" == typeof o.length) return {
next: function() {
o && t >= o.length && (o = void 0);
return {
value: o && o[t++],
done: !o
};
}
};
throw new TypeError(r ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, s = this && this.__read || function(o, r) {
var e = "function" == typeof Symbol && o[Symbol.iterator];
if (!e) return o;
var t, a, s = e.call(o), i = [];
try {
for (;(void 0 === r || r-- > 0) && !(t = s.next()).done; ) i.push(t.value);
} catch (o) {
a = {
error: o
};
} finally {
try {
t && !t.done && (e = s.return) && e.call(s);
} finally {
if (a) throw a.error;
}
}
return i;
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.NewUserBoardDiffTraitInfo = void 0;
var i = o("../configs/NewUserBoardDiffConfig"), n = function() {
function o() {}
o.getSpinePath = function(r) {
return o.SPINE_PATH_MAP[r] || null;
};
o.computeGuideMoveFromScene = function(r, e, t) {
var a, s, i, n, l, d, c, u, f = Cinst(hs.ClassGame);
if (!f || !cc.isValid(f.node)) return null;
var p = null !== (a = f.guideContainer) && void 0 !== a ? a : null, h = null !== (s = f.boardContainer) && void 0 !== s ? s : null;
if (!cc.isValid(p) || !cc.isValid(h)) return null;
var B = cc.isValid(t) ? t : p, _ = Cinst(hs.BlocksProducer), I = null !== (i = null == _ ? void 0 : _.blocksContainer) && void 0 !== i ? i : null;
if (!_ || !cc.isValid(_.node) || !cc.isValid(I)) return null;
var y = null !== (l = null === (n = I.children) || void 0 === n ? void 0 : n[1]) && void 0 !== l ? l : null;
if (!cc.isValid(y)) return null;
var b = y.convertToWorldSpaceAR(cc.Vec2.ZERO), g = B.convertToNodeSpaceAR(b), m = o.resolveGuideTargetCell(r, e);
if (!m) return null;
var D, M = m.row, C = m.col, S = m.source, v = null === (d = hs.boardRendererInfo) || void 0 === d ? void 0 : d.blocks, A = null !== (u = null === (c = null == v ? void 0 : v[M]) || void 0 === c ? void 0 : c[C]) && void 0 !== u ? u : null;
D = A && cc.isValid(A) ? A.convertToWorldSpaceAR(cc.Vec2.ZERO) : h.convertToWorldSpaceAR(o.getBoardCellLocalPosByConstants(M, C));
var E = B.convertToNodeSpaceAR(D), k = hs.BLOCK_SIZE || 0, T = "fallback" === S || M >= o.BOTTOM_TARGET_ROW_THRESHOLD ? Math.round(k * o.END_Y_OFFSET_RATIO) : 0;
return [ {
x: Math.round(g.x),
y: Math.round(g.y)
}, {
x: Math.round(E.x),
y: Math.round(E.y + T)
} ];
};
o.getNewUserBoardDiffConfig = function(o) {
return i.NewUserBoardDiffConfig.find(function(r) {
return r.boardId === o;
});
};
o.calculateTargetCenter = function(o) {
var r, e, t = hs.BLOCK_SIZE, i = 8 * t / 2, n = Infinity, l = -Infinity, d = Infinity, c = -Infinity;
try {
for (var u = a(o), f = u.next(); !f.done; f = u.next()) {
var p = s(f.value, 2), h = p[0], B = p[1];
n = Math.min(n, h);
l = Math.max(l, h);
d = Math.min(d, B);
c = Math.max(c, B);
}
} catch (o) {
r = {
error: o
};
} finally {
try {
f && !f.done && (e = u.return) && e.call(u);
} finally {
if (r) throw r.error;
}
}
return {
x: ((d + c) / 2 + .5) * t - i,
y: -((n + l) / 2 + .5) * t + i
};
};
o.getBoardCellLocalPosByConstants = function(o, r) {
var e = hs.BOARD_CONTAINER_HALF_WIDTH || 0, t = hs.BOARD_CONTAINER_HALF_HEIGHT || 0, a = hs.BLOCK_SIZE || 0, s = hs.BLOCK_HALF_SIZE || Math.round(a / 2), i = (hs.OFFSETX || 0) - e + s + a * r, n = (hs.OFFSETY || 0) + t - s - a * o;
return cc.v2(i, n);
};
o.pickBottomRowGapCenter = function(o) {
if (!Array.isArray(o) || o.length < 8) return null;
var r = o[7];
if (!Array.isArray(r) || r.length < 8) return null;
for (var e = -1, t = -1, a = 0, s = Number.MAX_SAFE_INTEGER, i = 0; i < 8; ) if (-1 === r[i]) {
for (var n = i; i < 8 && -1 === r[i]; ) i++;
var l = i - 1, d = l - n + 1, c = (n + l) / 2, u = Math.abs(c - 3.5);
if (d > a || d === a && u < s) {
a = d;
e = n;
t = l;
s = u;
}
} else i++;
return a <= 0 ? null : {
row: 7,
col: Math.round((e + t) / 2)
};
};
o.resolveGuideTargetCell = function(r, e) {
if (e && "number" == typeof e.row && "number" == typeof e.col) {
var a = Math.floor(e.row), s = Math.floor(e.col);
if (a >= 0 && a < 8 && s >= 0 && s < 8) return {
row: a,
col: s,
source: "config"
};
}
var i = o.pickBottomRowGapCenter(r);
return i ? t(t({}, i), {
source: "fallback"
}) : null;
};
o.isManualBoard = function(o) {
return !(o <= 0) && i.NewUserBoardDiffConfig.some(function(r) {
return r.boardId === o;
});
};
o.END_Y_OFFSET_RATIO = .5;
o.BOTTOM_TARGET_ROW_THRESHOLD = 6;
o.SPINE_PATH_MAP = {
1: "spine/board1/gameplay_xinshou"
};
return o;
}();
e.NewUserBoardDiffTraitInfo = n;
cc._RF.pop();
}, {
"../configs/NewUserBoardDiffConfig": "NewUserBoardDiffConfig"
} ],
NewUserBoardDiffTraitInterface: [ function(o, r, e) {
"use strict";
cc._RF.push(r, "17957XKoZdPF7ZrfiqhF/y8", "NewUserBoardDiffTraitInterface");
Object.defineProperty(e, "__esModule", {
value: !0
});
cc._RF.pop();
}, {} ],
NewUserBoardDiffTrait: [ function(o, r, e) {
"use strict";
cc._RF.push(r, "b45132b3LtAb6qj59ocHHUy", "NewUserBoardDiffTrait");
var t, a = this && this.__extends || (t = function(o, r) {
return (t = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(o, r) {
o.__proto__ = r;
} || function(o, r) {
for (var e in r) Object.prototype.hasOwnProperty.call(r, e) && (o[e] = r[e]);
})(o, r);
}, function(o, r) {
t(o, r);
function e() {
this.constructor = o;
}
o.prototype = null === r ? Object.create(r) : (e.prototype = r.prototype, new e());
}), s = this && this.__assign || function() {
return (s = Object.assign || function(o) {
for (var r, e = 1, t = arguments.length; e < t; e++) {
r = arguments[e];
for (var a in r) Object.prototype.hasOwnProperty.call(r, a) && (o[a] = r[a]);
}
return o;
}).apply(this, arguments);
}, i = this && this.__decorate || function(o, r, e, t) {
var a, s = arguments.length, i = s < 3 ? r : null === t ? t = Object.getOwnPropertyDescriptor(r, e) : t;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) i = Reflect.decorate(o, r, e, t); else for (var n = o.length - 1; n >= 0; n--) (a = o[n]) && (i = (s < 3 ? a(i) : s > 3 ? a(r, e, i) : a(r, e)) || i);
return s > 3 && i && Object.defineProperty(r, e, i), i;
}, n = this && this.__read || function(o, r) {
var e = "function" == typeof Symbol && o[Symbol.iterator];
if (!e) return o;
var t, a, s = e.call(o), i = [];
try {
for (;(void 0 === r || r-- > 0) && !(t = s.next()).done; ) i.push(t.value);
} catch (o) {
a = {
error: o
};
} finally {
try {
t && !t.done && (e = s.return) && e.call(s);
} finally {
if (a) throw a.error;
}
}
return i;
}, l = this && this.__spread || function() {
for (var o = [], r = 0; r < arguments.length; r++) o = o.concat(n(arguments[r]));
return o;
}, d = this && this.__values || function(o) {
var r = "function" == typeof Symbol && Symbol.iterator, e = r && o[r], t = 0;
if (e) return e.call(o);
if (o && "number" == typeof o.length) return {
next: function() {
o && t >= o.length && (o = void 0);
return {
value: o && o[t++],
done: !o
};
}
};
throw new TypeError(r ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(e, "__esModule", {
value: !0
});
e.NewUserBoardDiffTrait = void 0;
var c = o("./vo/NewUserBoardDiffTraitInfo"), u = o("./types/NewUserBoardDiffType"), f = o("./vo/NewUserBoardDiffInfo"), p = o("./vo/NewUserBoardDiffAnimInfo"), h = o("./vo/NewUserBoardDiffGuideInfo"), B = o("./configs/NewUserBoardDiffConfig"), _ = o("./configs/NewUserBoardDiffWeightsConfig"), I = o("./configs/NewUserBoardDiffAnimConfig"), y = function(o) {
a(r, o);
function r() {
var r = null !== o && o.apply(this, arguments) || this;
r._algorithmResetEmitter = new hs.Emitter();
r._replayTriggered = !1;
r._guideHasEliminateHint = !1;
r._skipColorOverride = !1;
r._currentSystemBoardWeight = -1;
r._activeTimeSchedulerId = null;
r._coldStartSpecialBoard = !1;
r._traitInjectedSystemBoard = !1;
return r;
}
e = r;
r.prototype.setUsedFixedBoard = function(o) {
f.newUserBoardDiffInfo.firstRoundBlocksApplied = o;
};
r.prototype.getUsedFixedBoard = function() {
return f.newUserBoardDiffInfo.firstRoundBlocksApplied;
};
Object.defineProperty(r.prototype, "onActiveCondition", {
get: function() {
return hs.gameInfo.gameMode === hs.GameMode.Class;
},
enumerable: !1,
configurable: !0
});
r.prototype.onCreate = function() {
h.newUserBoardDiffGuideInfo.preloadSpineData(1);
f.newUserBoardDiffInfo.firstPlayTs <= 0 && (f.newUserBoardDiffInfo.firstPlayTs = Date.now());
this.checkColdStart();
this.startActiveTimeRecorder();
};
r.prototype.onActive = function(o) {
hs.tp.isClassAlgorithmStrategy_Reset_ProxyRegisterAlgorithmResetEmitter(o) ? o.args[0] = this._algorithmResetEmitter : hs.tp.isClassGame_ProxyOnGameBackHome(o) ? this.onGameBackHome() : hs.tp.isClassGameOver_GameEndPre_ProxyOnGameEndPre(o) ? this.handleGameEndPre() : hs.tp.isClassGameOver_GameEnd_ProxyOnGameEnd(o) ? this.handleGameEnd() : hs.tpManual.isClassAlgorithmBottomSequenceGPInfoTriggerBottomOfferAlgo(o) ? this.handleReplayScoreBasedAlgoReplace() : hs.tp.isClassAlgorithmStrategy_Replace_ProxyPreprocessingAlgorithm(o) ? this.handleReplayScoreBasedPreprocessingReplace() : hs.tp.isBlocksProducerTouchSetCanEliminateBlock(o) ? this.handleSetCanEliminateBlock(o) : hs.tp.isBlocksProducerTouchResetLastOneBlock(o) || hs.tp.isBlocksProducerTouchSetNoEliminateBlock(o) ? this.handleResetLastOneBlockOrSetNoEliminateBlock(o) : hs.tp.isBlocksProducerTouchOnTouchMove(o) ? this.handleInitBoardAnimOnTouchMove() : hs.tp.isBlocksProducerTouchAfterTouchStart(o) ? this.handleInitBoardAnimAfterTouchStart() : hs.tp.isBlocksProducerTouchChangeDragItem(o) ? this.handleGuideChangeDragItem(o) : hs.tp.isBlocksProducerTouchInterceptTouchEnd(o) ? this.handleGuideInterceptTouchEnd(o) : hs.tp.isBlocksProducerTouchBeforeOnTouchEnd(o) ? this.handleInitBoardAnimBeforeOnTouchEnd() : hs.tp.isBlocksProducerTouchOnAfterTouchEndAddActivityFilter(o) ? this.handleAfterTouchEndClearEliminated(o) : hs.tp.isBlockForceRender(o) ? this.handleBlockForceRender(o) : hs.tp.isBlockShouldComponentUpdateReturnValue(o) ? this.handleBlockShouldComponentUpdateReturnValue(o) : hs.tp.isBlockLoadBlockSpriteFrame(o) ? this.handleBlockLoadSpriteFrame(o) : hs.tp.isClassBoard_ProxyOnBoardInit(o) ? this.handleClassBoardProxyOnBoardInit() : hs.tp.isClassBlocksProducer_ProxyOnInit(o) ? this.handleClassBlocksProducerProxyOnInit() : hs.tp.isClassBlocksProducer_ProxyGuideRequestBlocksProducer(o) ? this.handleGuideRequestBlocksProducer() : hs.tp.isClassGuide_ProxyApplyGuideStepConfigOverrides(o) ? this.handleClassGuideProxyApplyGuideStepConfigOverrides() : hs.tp.isClassGuide_ProxyRenderGuideState(o) ? this.handleClassGuideProxyRenderGuideState(o) : hs.tp.isClassGuide_ProxyGuideEndDot(o) ? this.handleGuideEndDot(o) : hs.tp.isClassGuide_ProxyOnTouchEnd(o) ? this.handleGuideTouchEnd(o) : hs.tp.isEliminate_Effects_ProxyOnBlockProducerTouchEnd(o) ? this.handleBlockProducerTouchEnd(o) : hs.tp.isSetup_ProxyOnClick_replay(o) ? this.handleReplay() : hs.tp.isClassDefaultBoard_ProxyProduceDefaultBoard(o) ? this.handleProduceDefaultBoardEntry(o) : hs.tp.isClassDefaultBoard_ProxyProduceDefaultColor(o) ? this.handleProduceDefaultColor(o) : hs.tp.isClassDefaultBoard_ProxyProduceDefaultBoardTurnAround(o) ? this.handleProduceDefaultBoardTurnAround(o) : hs.tp.isClassDefaultBoard_ProxyOnBoardSplashAnimationEnd(o) ? this.handleDefaultBoardSplashAnimationEnd() : hs.tp.isClassAlgorithmStrategy_Priority_ProxyOnAlgorithmStrategyPriority(o) ? this.onActiveOnAlgorithmStrategyPriority(o) : hs.tp.isIsOpenOperaPosTraitGenerateOperaPosArrInfo(o) ? this.handleBlockOperaPosGuard(o) : hs.tp.isClassColorProducer_ProxyProduceColorBase(o) ? this.handleProduceColorBase(o) : hs.tp.isClassColorProducer_ProxyProduceColorPostprocessing(o) ? this.handleProduceColorPostprocessing(o) : hs.tp.isClassBlocksProducer_BlocksProducerValidate_ProxySetRecordOperationColor(o) ? this.handleSetRecordOperationColor(o) : hs.tp.isClassBlocksProducer_ProxyUpdateBlocksProducerState(o) ? this.handleUpdateBlocksProducerState(o) : hs.tp.isIsOpenFirstDayReplayGuideBoardTraitDiableThisTrait(o) ? this.handleDisableFirstDayReplayGuideBoardTrait(o) : hs.tp.isClassDefaultBoard_ProxyIsUseEmptyBoardBeforeInit(o) && this.handleIsUseEmptyBoardBeforeInit(o);
};
r.prototype.checkColdStart = function() {
var o = Date.now(), r = f.newUserBoardDiffInfo.lastSessionTs;
f.newUserBoardDiffInfo.sessionColdStart = !1;
this._coldStartSpecialBoard = !1;
if (!(f.newUserBoardDiffInfo.logicalGameNum < 5 || r <= 0)) {
var e = o - r;
if (e >= u.COLD_START_INTERVAL_MS) {
f.newUserBoardDiffInfo.sessionColdStart = !0;
f.newUserBoardDiffInfo.sessionGameCount = 0;
}
if (e >= u.COLD_START_SPECIAL_INTERVAL_MS && this.getHighScore() > 1e4 && f.newUserBoardDiffInfo.coldStartCount < 3 && f.newUserBoardDiffInfo.logicalGameNum >= 5) {
f.newUserBoardDiffInfo.coldStartCount++;
this._coldStartSpecialBoard = !0;
}
}
};
r.prototype.startActiveTimeRecorder = function() {
if (null === this._activeTimeSchedulerId) {
f.newUserBoardDiffInfo.lastSessionTs = Date.now();
this._activeTimeSchedulerId = setInterval(function() {
f.newUserBoardDiffInfo.lastSessionTs = Date.now();
}, 6e4);
}
};
r.prototype.getRuntimeProps = function() {
var o, r, e, t, a, s, i, n, l, d, c, u, f, p, h, B = null !== (r = null === (o = this.props) || void 0 === o ? void 0 : o.runProp) && void 0 !== r ? r : {}, _ = Array.isArray(B.lowScoreThresholds) && 3 === B.lowScoreThresholds.length ? B.lowScoreThresholds.slice() : [ 4e3, 6e3, 8e3 ];
return {
experimentGroup: Math.max(1, Math.min(9, Math.floor(null !== (e = B.experimentGroup) && void 0 !== e ? e : 1))),
guideScheme: null !== (t = B.guideScheme) && void 0 !== t ? t : 1,
scoreSegLow: null !== (a = B.scoreSegLow) && void 0 !== a ? a : 6e3,
scoreSegMid: null !== (s = B.scoreSegMid) && void 0 !== s ? s : 1e4,
scoreSegHigh: null !== (i = B.scoreSegHigh) && void 0 !== i ? i : 16e3,
manualBoardProb: null !== (n = B.manualBoardProb) && void 0 !== n ? n : 30,
lowScoreThresholds: _,
replayCScoreThreshold: null !== (l = B.replayCScoreThreshold) && void 0 !== l ? l : 4e3,
exp5ScoreThreshold: null !== (d = B.exp5ScoreThreshold) && void 0 !== d ? d : 1e3,
exp7ScoreThreshold: null !== (c = B.exp7ScoreThreshold) && void 0 !== c ? c : 1e3,
exp7DurationThresholdSec: null !== (u = B.exp7DurationThresholdSec) && void 0 !== u ? u : 600,
exp8ScoreThreshold: null !== (f = B.exp8ScoreThreshold) && void 0 !== f ? f : 1e3,
exp9ScoreThreshold: null !== (p = B.exp9ScoreThreshold) && void 0 !== p ? p : 1e3,
exp9DurationThresholdSec: null !== (h = B.exp9DurationThresholdSec) && void 0 !== h ? h : 600
};
};
r.prototype.getHighScore = function() {
return storage.getItem("classHighScore", 0);
};
r.prototype.logKeyNode = function() {};
r.prototype.formatDecision = function(o) {
var r, e;
return "manual" === o.type ? "人工盘面(盘面id=" + o.boardId + ", 首轮出块走配置=" + (null !== (r = o.useConfigBlocks) && void 0 !== r && r) + ", 颜色走配置=" + (null !== (e = o.useConfigColors) && void 0 !== e && e) + ")" : "system" === o.type ? "系统盘面(权重范围=" + (o.weightRange ? "[" + o.weightRange[0] + "," + o.weightRange[1] + "]" : "[]") + ")" : "empty" === o.type ? "空盘面" : "不干预";
};
r.prototype.formatRoundContext = function() {
return "去除replay局号=" + f.newUserBoardDiffInfo.logicalGameNum + "，系统局号=" + hs.classGameInfo.gameNum + "，冷启动会话局号=" + f.newUserBoardDiffInfo.sessionGameCount;
};
r.prototype.formatBoardForLog = function(o, r) {
void 0 === r && (r = !1);
return o.map(function(o) {
return o.map(function(o) {
return r ? -1 === o ? "0" : "1" : -1 === o ? "-1" : "" + o;
}).join(" ");
}).join("\n");
};
r.prototype.selectBoardDecision = function(o) {
var r = f.newUserBoardDiffInfo.logicalGameNum, e = this.getRuntimeProps(), t = e.experimentGroup;
this.logKeyNode("开始判断这一局出什么盘面", {
"去除replay局号": r + 1,
"是否重玩": o,
"实验组": t,
"历史最高分": this.getHighScore(),
"上一局得分": f.newUserBoardDiffInfo.lastGameScore,
"是否冷启动": f.newUserBoardDiffInfo.sessionColdStart,
"当前会话第几局": f.newUserBoardDiffInfo.sessionGameCount,
"本局已重玩次数": f.newUserBoardDiffInfo.replayCountThisGame,
"低分段分界": e.scoreSegLow,
"中分段分界": e.scoreSegMid,
"高分段分界": e.scoreSegHigh,
"人工盘概率": e.manualBoardProb + "%",
"低分空盘阈值": e.lowScoreThresholds
});
if (o) return this.selectReplayBoard(r, t);
if (0 === r) return {
type: "none"
};
var a = this.getHighScore();
return 1 === r ? this.selectRound2Board(a, t) : 2 === r ? this.selectRound3Board(a) : 3 === r ? this.selectRound4Board(a, t) : 4 === r ? this.selectRound5Board(a) : this.selectRound6PlusBoard(a, t);
};
r.prototype.selectRound2Board = function() {
return {
type: "empty"
};
};
r.prototype.selectRound3Board = function(o) {
var r = o >= 6e3 ? u.ROUND3_HIGH_SCORE_POOL : u.ROUND3_LOW_SCORE_POOL, e = new Set(f.newUserBoardDiffInfo.usedManualIds), t = r.filter(function(o) {
return !e.has(o);
});
if (0 === t.length) return {
type: "empty"
};
var a = t[Math.floor(Math.random() * t.length)];
f.newUserBoardDiffInfo.usedManualIds = l(f.newUserBoardDiffInfo.usedManualIds, [ a ]);
return {
type: "manual",
boardId: a,
useConfigBlocks: !0,
useConfigColors: !1
};
};
r.prototype.selectRound4Board = function() {
return {
type: "empty"
};
};
r.prototype.selectRound5Board = function(o) {
var r = o >= 1e4 ? u.ROUND5_HIGH_SCORE_POOL : u.ROUND5_LOW_SCORE_POOL, e = new Set(f.newUserBoardDiffInfo.usedManualIds), t = r.filter(function(o) {
return !e.has(o);
});
if (0 === t.length) return {
type: "empty"
};
var a = t[Math.floor(Math.random() * t.length)];
f.newUserBoardDiffInfo.usedManualIds = l(f.newUserBoardDiffInfo.usedManualIds, [ a ]);
return {
type: "manual",
boardId: a,
useConfigBlocks: !0,
useConfigColors: !1
};
};
r.prototype.selectRound6PlusBoard = function(o, r) {
if (f.newUserBoardDiffInfo.sessionColdStart && 1 === f.newUserBoardDiffInfo.sessionGameCount) {
this.logKeyNode("命中规则6.d，冷启动首局出空盘面");
return {
type: "empty"
};
}
if (this._coldStartSpecialBoard && 2 === f.newUserBoardDiffInfo.sessionGameCount) {
var e = this.selectColdStartBoard();
if (e) return e;
}
var t = f.newUserBoardDiffInfo.lastGameScore;
this.logKeyNode("第6局及以后，开始判断", {
"历史最高分": o,
"上一局得分": t,
"实验组": r
});
if (5 === r) return this.selectRound6PlusExp5Board();
if (7 === r) return this.selectRound6PlusExp7Board();
if (8 === r) return this.selectRound6PlusExp8Board();
if (9 === r) return this.selectRound6PlusExp9Board();
if (r >= 2 && r <= 6) return this.selectRound6PlusRatioBoard(o, r);
var a = this.getLowScoreThreshold6Plus(o);
if (t < a) {
this.logKeyNode("命中规则6.b，下一局出空盘面", {
"上一局得分": t,
"空盘阈值": a
});
return {
type: "empty"
};
}
return this.selectHighScoreBoard6Plus(o);
};
r.prototype.selectHighScoreBoard6Plus = function(o) {
var r = this.getManualBoardProbability6Plus(), e = Math.random(), t = e < r;
this.logKeyNode("命中规则6.e，开始判断要不要把系统盘换成人工盘", {
"历史最高分": o,
"上一局得分": f.newUserBoardDiffInfo.lastGameScore,
"连续非人工盘次数": f.newUserBoardDiffInfo.consecutiveNonManual,
"替换概率p(0~1)": r,
"替换概率(展示)": Math.round(100 * r) + "%",
"随机数r(0~1，未乘百分号)": e.toFixed(6),
"判定规则": "r < p 则替换为人工盘（例如 p=0.4 时 r=0.3598 命中）",
"是否命中人工替换": t
});
if (t) {
var a = this.pickRandomManualBoard6Plus();
if (a) return a;
}
return {
type: "system"
};
};
r.prototype.getManualBoardProbability6Plus = function() {
var o = f.newUserBoardDiffInfo.consecutiveNonManual;
return o <= 2 ? 0 : 3 === o ? .2 : 4 === o ? .3 : 5 === o ? .4 : 6 === o ? .6 : .8;
};
r.prototype.pickRandomManualBoard6Plus = function() {
var o = new Set(f.newUserBoardDiffInfo.usedManualIds), r = B.NewUserBoardDiffConfig.filter(function(r) {
return r.boardId > 0 && !o.has(r.boardId);
});
if (0 === r.length) return null;
var e = r[Math.floor(Math.random() * r.length)];
f.newUserBoardDiffInfo.usedManualIds = l(f.newUserBoardDiffInfo.usedManualIds, [ e.boardId ]);
return {
type: "manual",
boardId: e.boardId,
useConfigBlocks: !1,
useConfigColors: !1
};
};
r.prototype.pickExp9PriorityBoard = function() {
var o = new Set(f.newUserBoardDiffInfo.usedManualIds), r = u.ROUND6_PLUS_EXP9_PRIORITY_POOL.filter(function(r) {
return !o.has(r);
});
if (0 === r.length) return null;
var e = r[Math.floor(Math.random() * r.length)];
f.newUserBoardDiffInfo.usedManualIds = l(f.newUserBoardDiffInfo.usedManualIds, [ e ]);
return {
type: "manual",
boardId: e,
useConfigBlocks: !1,
useConfigColors: !1
};
};
r.prototype.getLowScoreThreshold6Plus = function(o) {
var r = this.getRuntimeProps().lowScoreThresholds;
return o <= 1e4 ? r[0] : o <= 3e4 ? r[1] : r[2];
};
r.prototype.selectRound6PlusExp5Board = function() {
var o = this.getRuntimeProps().exp5ScoreThreshold, r = f.newUserBoardDiffInfo.lastGameScore;
this.logKeyNode("实验5分数趋势决策", {
"当局分数(lastGameScore)": r,
"实验5分数阈值": o
});
if (r <= o) {
this.logKeyNode("实验5: 当局分数<=" + o + "，出空盘面");
return {
type: "empty"
};
}
return this.selectRound6PlusExp5TrendBoard("实验5");
};
r.prototype.selectRound6PlusExp5TrendBoard = function(o) {
var r = f.newUserBoardDiffInfo.lastGameScore, t = f.newUserBoardDiffInfo.prevLastGameScore, a = f.newUserBoardDiffInfo.consecutiveNonManual;
this.logKeyNode(o + "趋势复用决策", {
"上一局分数(lastGameScore)": r,
"上上局分数(prevLastGameScore)": t,
"连续非人工初始盘局数": a
});
if (r >= t) {
if (a >= e.EXP5_MANUAL_REPLACE_AFTER_NON_MANUAL_ROUNDS) {
var s = Math.random(), i = e.EXP5_MANUAL_REPLACE_PROB, n = s < i;
this.logKeyNode(o + ": 分数上升/持平，连续非人工达标，判断是否替换为人工盘", {
"连续非人工局数": a,
"替换概率p(0~1)": i,
"替换概率(展示)": Math.round(100 * i) + "%",
"随机数r(0~1，未乘百分号)": s.toFixed(6),
"判定规则": "r < p 则替换为人工盘（例如 p=0.4 时 r=0.3598 命中）",
"是否命中人工替换": n
});
if (n) {
var l = this.pickRandomManualBoard6Plus();
if (l) return l;
}
}
this.logKeyNode(o + ": 分数上升/持平，出系统盘面");
return {
type: "system"
};
}
this.logKeyNode(o + ": 分数下降，出空盘面");
return {
type: "empty"
};
};
r.prototype.selectRound6PlusExp7Board = function() {
var o = this.getRuntimeProps(), r = o.exp7ScoreThreshold, e = o.exp7DurationThresholdSec, t = f.newUserBoardDiffInfo.lastGameScore, a = f.newUserBoardDiffInfo.lastGameDurationMs, s = Math.floor(a / 1e3), i = 1e3 * e;
this.logKeyNode("实验7分数时长联合决策", {
"上一局分数(lastGameScore)": t,
"上一局时长ms(lastGameDurationMs)": a,
"上一局时长s(lastGameDurationSec)": s,
"实验7分数阈值": r,
"实验7时长阈值s": e
});
if (t <= r) {
this.logKeyNode("实验7: 上一局分数<=" + r + "，出空盘面");
return {
type: "empty"
};
}
if (a >= i) {
this.logKeyNode("实验7: 上一局时长>=" + e + "s，出空盘面");
return {
type: "empty"
};
}
return this.selectRound6PlusExp5TrendBoard("实验7");
};
r.prototype.selectRound6PlusExp8Board = function() {
var o = this.getRuntimeProps().exp8ScoreThreshold, r = f.newUserBoardDiffInfo.lastGameScore, t = f.newUserBoardDiffInfo.prevLastGameScore, a = f.newUserBoardDiffInfo.consecutiveNonManual;
this.logKeyNode("实验8分数趋势决策", {
"上一局分数(lastGameScore)": r,
"上上局分数(prevLastGameScore)": t,
"连续非人工初始盘局数": a,
"实验8分数阈值": o
});
if (r <= o) {
this.logKeyNode("实验8: 上一局分数<=" + o + "，出空盘面");
return {
type: "empty"
};
}
if (r >= t) {
this.logKeyNode("实验8: 分数上升/持平，出空盘面");
return {
type: "empty"
};
}
if (a >= e.EXP5_MANUAL_REPLACE_AFTER_NON_MANUAL_ROUNDS) {
var s = Math.random(), i = e.EXP5_MANUAL_REPLACE_PROB, n = s < i;
this.logKeyNode("实验8: 分数下降，连续非人工达标，判断是否替换为人工盘", {
"连续非人工局数": a,
"替换概率p(0~1)": i,
"替换概率(展示)": Math.round(100 * i) + "%",
"随机数r(0~1，未乘百分号)": s.toFixed(6),
"判定规则": "r < p 则替换为人工盘（例如 p=0.4 时 r=0.3598 命中）",
"是否命中人工替换": n
});
if (n) {
var l = this.pickRandomManualBoard6Plus();
if (l) return l;
}
}
this.logKeyNode("实验8: 分数下降，出系统盘面");
return {
type: "system"
};
};
r.prototype.selectRound6PlusExp9Board = function() {
var o = this.getRuntimeProps(), r = o.exp9ScoreThreshold, t = o.exp9DurationThresholdSec, a = f.newUserBoardDiffInfo.lastGameScore, s = f.newUserBoardDiffInfo.prevLastGameScore, i = f.newUserBoardDiffInfo.lastGameDurationMs, n = Math.floor(i / 1e3), l = f.newUserBoardDiffInfo.consecutiveNonManual, d = 1e3 * t;
this.logKeyNode("实验9分数时长联合决策", {
"上一局分数(lastGameScore)": a,
"上上局分数(prevLastGameScore)": s,
"上一局时长ms(lastGameDurationMs)": i,
"上一局时长s(lastGameDurationSec)": n,
"连续非人工初始盘局数": l,
"实验9分数阈值": r,
"实验9时长阈值s": t
});
if (a <= r) {
this.logKeyNode("实验9: 上一局分数<=" + r + "，出空盘面");
return {
type: "empty"
};
}
if (i >= d) {
this.logKeyNode("实验9: 上一局时长>=" + t + "s，出空盘面");
return {
type: "empty"
};
}
if (a < s) {
this.logKeyNode("实验9: 分数下降，出空盘面");
return {
type: "empty"
};
}
if (l >= e.EXP5_MANUAL_REPLACE_AFTER_NON_MANUAL_ROUNDS) {
var c = Math.random(), u = e.EXP5_MANUAL_REPLACE_PROB, p = c < u;
this.logKeyNode("实验9: 分数上升/持平，连续非人工达标，判断是否替换为人工盘", {
"连续非人工局数": l,
"替换概率p(0~1)": u,
"替换概率(展示)": Math.round(100 * u) + "%",
"随机数r(0~1，未乘百分号)": c.toFixed(6),
"判定规则": "r < p 则替换为人工盘（例如 p=0.4 时 r=0.3598 命中）",
"是否命中人工替换": p
});
if (p) {
var h = this.pickExp9PriorityBoard();
if (h) {
this.logKeyNode("实验9: 命中人工替换，优先出固定人工盘", {
"盘面id": h.boardId
});
return h;
}
var B = this.pickRandomManualBoard6Plus();
if (B) {
this.logKeyNode("实验9: 固定人工盘池已用尽，改从6+人工盘池随机", {
"盘面id": B.boardId
});
return B;
}
}
}
this.logKeyNode("实验9: 分数上升/持平，出系统盘面");
return {
type: "system"
};
};
r.prototype.selectRound6PlusRatioBoard = function(o, r) {
var e, t = 4 === r ? 5 : 6, a = f.newUserBoardDiffInfo.systemEmptyCycleIdx;
f.newUserBoardDiffInfo.systemEmptyCycleIdx = a + 1;
if (2 === r) {
var s = Math.random(), i = t / 10;
e = s < i;
this.logKeyNode("实验2完全随机系统盘判定", {
"系统盘概率p(0~1)": i,
"系统盘概率(展示)": Math.round(100 * i) + "%",
"随机数r(0~1，未乘百分号)": s.toFixed(6),
"判定规则": "r < p 则本次出系统盘",
"本次是否系统盘": e
});
} else e = a * t % 10 < t;
this.logKeyNode("实验2~6比例模式决策", {
"实验组": r,
"循环序号": a,
"系统盘比例": t + ":" + (10 - t),
"本次是否系统盘": e,
"历史最高分": o
});
if (!e) return {
type: "empty"
};
var n = this.getExpManualBoardProb(r);
if (n > 0) {
var l = Math.random(), d = l < n;
this.logKeyNode("实验2~6判断人工盘替换", {
"替换概率p(0~1)": n,
"替换概率(展示)": Math.round(100 * n) + "%",
"随机数r(0~1，未乘百分号)": l.toFixed(6),
"判定规则": "r < p 则替换为人工盘（例如 p=0.4 时 r=0.3598 命中）",
"是否命中人工替换": d
});
if (d) {
var c = this.pickRandomManualBoard6Plus();
if (c) return c;
}
}
return {
type: "system"
};
};
r.prototype.getExpManualBoardProb = function(o) {
if (2 === o) return 0;
if (3 === o) return .3;
if (4 === o) return .2;
if (5 === o) return 0;
if (6 === o) {
var r = f.newUserBoardDiffInfo.firstPlayTs;
return r > 0 && Date.now() - r >= 864e5 ? .3 : 0;
}
return 0;
};
r.prototype.selectColdStartBoard = function() {
var o, r = new Set(f.newUserBoardDiffInfo.usedManualIds), e = u.COLD_START_BOARD_IDS.filter(function(o) {
return !r.has(o);
});
if (0 === e.length) return null;
var t = e[0];
f.newUserBoardDiffInfo.coldStartBoardsUsed = (null !== (o = f.newUserBoardDiffInfo.coldStartBoardsUsed) && void 0 !== o ? o : 0) + 1;
f.newUserBoardDiffInfo.usedManualIds = l(f.newUserBoardDiffInfo.usedManualIds, [ t ]);
return {
type: "manual",
boardId: t,
useConfigBlocks: !1,
useConfigColors: !1
};
};
r.prototype.selectReplayBoard = function(o, r) {
var e = f.newUserBoardDiffInfo;
if (e.replayGameNum !== o) {
e.replayCountThisGame = 0;
e.replayGameNum = o;
}
e.replayCountThisGame++;
var t = e.replayCountThisGame;
if (e.firstReplayGameNum < 0) {
e.firstReplayGameNum = o;
e.hasEverReplayed = !0;
}
this.logKeyNode("开始判断重玩时出什么盘面", {
"去除replay局号": o + 1,
"实验组": r,
"这是本局第几次重玩": t,
"是否曾经重玩过": e.hasEverReplayed,
"首次发生重玩的局号": e.firstReplayGameNum + 1,
"原始盘面是否为空": e.originalBoardWasEmpty
});
return e.firstReplayGameNum === o ? this.selectFirstEverReplayBoard(t, e.originalBoardWasEmpty) : this.selectSubsequentReplayBoard(t, o);
};
r.prototype.selectFirstEverReplayBoard = function(o, r) {
var e, t, a = (o - 1) % 2, s = f.newUserBoardDiffInfo.firstReplayTriggerScore, i = s >= 0 ? s : null !== (t = null === (e = hs.classScoreInfo) || void 0 === e ? void 0 : e.score) && void 0 !== t ? t : 0, n = r && i <= 100;
this.logKeyNode("命中首次重玩交替逻辑", {
"本局第几次重玩": o,
"原始盘面是否为空": r,
"当局分数": i,
"当局分数来源": s >= 0 ? "首次点击Replay分数快照" : "classScoreInfo实时值",
"是否命中空盘低分特例": n,
"当前交替阶段": "phase" + a
});
var l = u.REPLAY_SYSTEM_WEIGHT_RANGE;
return n ? 0 === a ? {
type: "system",
weightRange: l
} : {
type: "empty"
} : 0 === a ? {
type: "empty"
} : {
type: "system",
weightRange: l
};
};
r.prototype.selectSubsequentReplayBoard = function(o, r) {
var e = (o - 1) % 2, t = this.shouldReplayStartWithEmpty(), a = u.REPLAY_SYSTEM_WEIGHT_RANGE;
this.logKeyNode("命中非首次重玩交替逻辑", {
"去除replay局号": r + 1,
"本局第几次重玩": o,
"当前交替阶段": "phase" + e,
"首次replay是否出空盘": t
});
return t ? 0 === e ? {
type: "empty"
} : {
type: "system",
weightRange: a
} : 0 === e ? {
type: "system",
weightRange: a
} : {
type: "empty"
};
};
r.prototype.shouldReplayStartWithEmpty = function() {
var o, r = this.getHighScore(), e = f.newUserBoardDiffInfo.replayTriggerBoardWeight >= 0 ? f.newUserBoardDiffInfo.replayTriggerBoardWeight : this.getRealtimeBoardWeight(), t = String(null !== (o = this.getCurrentAlgoName()) && void 0 !== o ? o : ""), a = /难题|熵增/.test(t);
this.logKeyNode("重玩空盘条件判断", {
"历史最高分": r,
"点击Replay时盘面权重": e,
"权重来源": f.newUserBoardDiffInfo.replayTriggerBoardWeight >= 0 ? "Replay点击快照" : "实时/缓存回退",
"当前题型": t,
"是否难题或熵增": a
});
return a || e >= 340 || r <= 1e4;
};
r.prototype.getRealtimeBoardWeight = function() {
var o, r, e, t = null === (o = hs.boardInfo) || void 0 === o ? void 0 : o.faceBlocks;
if (t && Array.isArray(t) && t.length > 0) {
var a = null === (e = null === (r = hs.binarySupport) || void 0 === r ? void 0 : r.getWeightValue) || void 0 === e ? void 0 : e.call(r, t);
if ("number" == typeof a && Number.isFinite(a)) return a;
}
return "number" == typeof this._currentSystemBoardWeight && this._currentSystemBoardWeight >= 0 ? this._currentSystemBoardWeight : f.newUserBoardDiffInfo.lastSystemBoardWeight;
};
r.prototype.getCurrentAlgoName = function() {
var o, r, e, t, a;
try {
var s = null === (o = hs.algorithmName) || void 0 === o ? void 0 : o.algoActualName;
if (Array.isArray(s)) return s.join(",");
if ("string" == typeof s) return s;
var i = null !== (e = null === (r = hs.algorithmInfo) || void 0 === r ? void 0 : r.algoType) && void 0 !== e ? e : 0;
return null !== (a = null === (t = hs.OFFER_TYPE_STRINGS) || void 0 === t ? void 0 : t[i]) && void 0 !== a ? a : "";
} catch (o) {
return "";
}
};
r.prototype.handleReplayScoreBasedAlgoReplace = function() {
var o, r, e = this, t = this.getRuntimeProps().replayCScoreThreshold;
if (f.newUserBoardDiffInfo.currentReplayGame) {
var a = this.getRealtimeBoardWeight();
this.logKeyNode("replay c 当前盘面权重判断", {
"当前盘面权重": a,
"阈值": 340
});
if (!(a < 340)) {
var s = null !== (r = null === (o = hs.classScoreInfo) || void 0 === o ? void 0 : o.score) && void 0 !== r ? r : 0;
if (!(s < 0 || s > t)) {
var i = hs.algorithmBottomSequenceInfo.algorithmBottomList || [];
if (0 !== i.length) {
var n = hs.OFFER_TYPE.TIAN_KONG_XIAO_CHU, l = !1, d = i.map(function(o) {
if (e.isHardOrEntropyAlgo(o)) {
l = !0;
return n;
}
return o;
});
if (l) {
hs.algorithmBottomSequenceInfo.setAlgorithmBottomList(d);
this.logKeyNode("命中 replay c，难题/熵增替换为填空消除", {
"当前分数": s,
"replay c 分数阈值": t,
"是否replay局": f.newUserBoardDiffInfo.currentReplayGame,
"当前盘面权重": a,
"替换前兜底算法列表": i.map(function(o) {
return e.getAlgoDisplayName(o);
}),
"兜底算法列表": d.map(function(o) {
return e.getAlgoDisplayName(o);
}),
"命中替换算法": i.filter(function(o) {
return e.isHardOrEntropyAlgo(o);
}).map(function(o) {
return {
"原始算法Id": o,
"原始算法": e.getAlgoDisplayName(o),
"替换后算法Id": hs.OFFER_TYPE.TIAN_KONG_XIAO_CHU,
"替换后算法": e.getAlgoDisplayName(hs.OFFER_TYPE.TIAN_KONG_XIAO_CHU)
};
})
});
}
}
}
}
}
};
r.prototype.handleReplayScoreBasedPreprocessingReplace = function() {
var o, r, e = this, t = this.getRuntimeProps().replayCScoreThreshold;
if (f.newUserBoardDiffInfo.currentReplayGame) {
var a = this.getRealtimeBoardWeight();
if (!(a < 340)) {
var i = null !== (r = null === (o = hs.classScoreInfo) || void 0 === o ? void 0 : o.score) && void 0 !== r ? r : 0;
if (!(i < 0 || i > t)) {
var n = hs.algorithmStrategyInfo.algorithmList || [];
if (0 !== n.length) {
var d = this.replaceHardOrEntropyAlgorithmsInList(n), c = (hs.algorithmStrategyInfo.algorithmFailList || []).slice(), u = (hs.algorithmStrategyInfo.algorithmSuccessList || []).slice(), p = this.replaceHardOrEntropyAlgorithmsInList(c), h = this.replaceHardOrEntropyAlgorithmsInList(u);
if (d.replaced || p.replaced || h.replaced) {
d.replaced && hs.algorithmStrategyInfo.setAlgorithmList(d.list);
p.replaced && hs.algorithmStrategyInfo.setAlgorithmFailList(p.list);
h.replaced && hs.algorithmStrategyInfo.setAlgorithmSuccessList(h.list);
this.logKeyNode("命中 replay c，算法 replace 阶段难题/熵增替换为填空消除", {
"当前分数": i,
"replay c 分数阈值": t,
"是否replay局": f.newUserBoardDiffInfo.currentReplayGame,
"当前盘面权重": a,
"替换前算法列表": n.map(function(o) {
return e.getAlgoDisplayName(o);
}),
"替换前失败算法列表": c.map(function(o) {
return e.getAlgoDisplayName(o);
}),
"替换前成功算法列表": u.map(function(o) {
return e.getAlgoDisplayName(o);
}),
"替换后算法列表": d.replaced ? d.list.map(function(o) {
return e.getAlgoDisplayName(o);
}) : n.map(function(o) {
return e.getAlgoDisplayName(o);
}),
"替换后失败算法列表": p.replaced ? p.list.map(function(o) {
return e.getAlgoDisplayName(o);
}) : c.map(function(o) {
return e.getAlgoDisplayName(o);
}),
"替换后成功算法列表": h.replaced ? h.list.map(function(o) {
return e.getAlgoDisplayName(o);
}) : u.map(function(o) {
return e.getAlgoDisplayName(o);
}),
"命中替换算法": l(d.replacements.map(function(o) {
return s({
"所属列表": "algorithmList"
}, o);
}), p.replacements.map(function(o) {
return s({
"所属列表": "algorithmFailList"
}, o);
}), h.replacements.map(function(o) {
return s({
"所属列表": "algorithmSuccessList"
}, o);
}))
});
}
}
}
}
}
};
r.prototype.replaceHardOrEntropyAlgorithmsInList = function(o) {
var r = this;
if (!Array.isArray(o) || 0 === o.length) return {
list: o,
replaced: !1,
replacements: []
};
var e = !1, t = [];
return {
list: o.map(function(o) {
if (r.isHardOrEntropyAlgo(o)) {
e = !0;
t.push({
"原始算法Id": o,
"原始算法": r.getAlgoDisplayName(o),
"替换后算法Id": hs.OFFER_TYPE.TIAN_KONG_XIAO_CHU,
"替换后算法": r.getAlgoDisplayName(hs.OFFER_TYPE.TIAN_KONG_XIAO_CHU)
});
return hs.OFFER_TYPE.TIAN_KONG_XIAO_CHU;
}
return o;
}),
replaced: e,
replacements: t
};
};
r.prototype.isHardOrEntropyAlgo = function(o) {
return /难题|熵增/.test(this.getAlgoDisplayName(o));
};
r.prototype.getAlgoDisplayName = function(o) {
var r, e, t, a;
return String(null !== (a = null !== (e = null === (r = hs.OFFER_TYPE_REAL_STRINGS) || void 0 === r ? void 0 : r[o]) && void 0 !== e ? e : null === (t = hs.OFFER_TYPE_STRINGS) || void 0 === t ? void 0 : t[o]) && void 0 !== a ? a : "");
};
r.prototype.handleProduceDefaultBoardEntry = function(o) {
this.resetAllBlockSkin();
p.newUserBoardDiffAnimInfo.stopInitBoardAnim();
this.setUsedFixedBoard(!1);
this._skipColorOverride = !1;
this._currentSystemBoardWeight = -1;
this._traitInjectedSystemBoard = !1;
f.newUserBoardDiffInfo.currentGameStartTs = Date.now();
var r = this._replayTriggered;
this._replayTriggered = !1;
var e = r || f.newUserBoardDiffInfo.currentReplayGame;
f.newUserBoardDiffInfo.currentReplayGame = e;
if (!e) {
f.newUserBoardDiffInfo.logicalGameNum++;
f.newUserBoardDiffInfo.sessionGameCount++;
}
this.logKeyNode("进入底板出盘入口", {
"去除replay局号": f.newUserBoardDiffInfo.logicalGameNum,
"系统局号": hs.classGameInfo.gameNum,
"是否重玩": e,
"是否点击replay": r,
"当前会话第几局": f.newUserBoardDiffInfo.sessionGameCount
});
var t = this.selectBoardDecision(e);
this.executeBoardDecision(o, t, e);
};
r.prototype.executeBoardDecision = function(o, r, e) {
var t = f.newUserBoardDiffInfo.logicalGameNum;
this.logKeyNode("执行盘决策", {
"决策结果": this.formatDecision(r)
});
switch (r.type) {
case "manual":
this.executeManualBoard(o, r, t, e);
break;

case "empty":
this.executeEmptyBoard(o, t, e);
break;

case "system":
this.executeSystemBoard(o, r, t, e);
}
e || "none" === r.type || (f.newUserBoardDiffInfo.originalBoardWasEmpty = "empty" === r.type);
};
r.prototype.executeManualBoard = function(o, r, e, t) {
var a, s, i, n, l;
f.newUserBoardDiffInfo.clear();
var d = r.boardId, u = c.NewUserBoardDiffTraitInfo.getNewUserBoardDiffConfig(d);
if (u) {
f.newUserBoardDiffInfo.boardId = d;
o.args && (o.args[0] = u.boardData);
o.returnState = !0;
f.newUserBoardDiffInfo.positionColorMap = f.newUserBoardDiffInfo.buildPositionColorMapFromSnapshot(u.boardData);
var p = null !== (a = r.useConfigBlocks) && void 0 !== a && a && Array.isArray(u.producerBlocks) && u.producerBlocks.length >= 3 && Array.isArray(u.blocksColors) && u.blocksColors.length >= 3;
this.setUsedFixedBoard(p);
this._skipColorOverride = !(null !== (s = r.useConfigColors) && void 0 !== s && s);
var h = null !== (l = null === (n = null === (i = hs.binarySupport) || void 0 === i ? void 0 : i.getWeightValue) || void 0 === n ? void 0 : n.call(i, u.boardData)) && void 0 !== l ? l : -1;
this._currentSystemBoardWeight = h;
t || (f.newUserBoardDiffInfo.lastSystemBoardWeight = h >= 0 ? h : 0);
t || (r.countAsNonManual ? f.newUserBoardDiffInfo.consecutiveNonManual++ : f.newUserBoardDiffInfo.consecutiveNonManual = 0);
}
};
r.prototype.executeEmptyBoard = function(o, r, e) {
f.newUserBoardDiffInfo.clear();
f.newUserBoardDiffInfo.boardId = u.EMPTY_BOARD_ID;
f.newUserBoardDiffInfo.clearPosMap();
var t = hs.boardInfo.NULL;
o.args && (o.args[0] = t);
o.returnState = !0;
this._currentSystemBoardWeight = 0;
e || (f.newUserBoardDiffInfo.lastSystemBoardWeight = 0);
e || f.newUserBoardDiffInfo.consecutiveNonManual++;
};
r.prototype.resolveExistingSystemBoardWeight = function(o) {
var r, e, t, a, s, i = null === (e = null === (r = hs.classDefaultBoardInfo) || void 0 === r ? void 0 : r.defaultBoardInfo) || void 0 === e ? void 0 : e.boardIndex;
if ("number" == typeof i && i >= 0 && i < _.BOARD_WEIGHTS.length) return _.BOARD_WEIGHTS[i];
var n = null !== (s = null === (a = null === (t = hs.binarySupport) || void 0 === t ? void 0 : t.getWeightValue) || void 0 === a ? void 0 : a.call(t, o)) && void 0 !== s ? s : -1;
return n >= 0 ? n : 0;
};
r.prototype.executeSystemBoard = function(o, r, e, t) {
var a;
f.newUserBoardDiffInfo.clear();
f.newUserBoardDiffInfo.boardId = 0;
f.newUserBoardDiffInfo.clearPosMap();
r.weightRange && (r.weightRange[0], r.weightRange[1]);
var s = null === (a = o.args) || void 0 === a ? void 0 : a[0], i = -1, n = !1;
if (r.weightRange) {
var l = this.pickBoardFromLibraryUsingBoardWeights(r.weightRange);
if (l) {
s = l.board;
i = l.configuredWeight;
n = !0;
}
}
if (n && s && o.args) {
o.args[0] = s;
o.returnState = !0;
this._traitInjectedSystemBoard = !0;
}
n || !s || this.isBoardEmpty(s) || (i = this.resolveExistingSystemBoardWeight(s));
this._currentSystemBoardWeight = i;
t || (f.newUserBoardDiffInfo.lastSystemBoardWeight = i >= 0 ? i : 0);
s && this.isBoardEmpty(s);
t || f.newUserBoardDiffInfo.consecutiveNonManual++;
};
r.prototype.isBoardEmpty = function(o) {
if (!o) return !0;
for (var r = 0; r < o.length; r++) {
var e = o[r];
if (e) for (var t = 0; t < e.length; t++) if (-1 !== e[t]) return !1;
}
return !0;
};
r.prototype.pickBoardFromLibraryUsingBoardWeights = function(o) {
var r, e, t, a = null === (r = hs.default2000Config) || void 0 === r ? void 0 : r.LevelConfigs;
if (!a || 0 === a.length) return null;
var s = _.BOARD_WEIGHTS, i = Math.min(a.length, s.length), n = function(r) {
for (var e, t = [], n = 0; n < i; n++) {
var l = s[n];
r && o && (l < o[0] || l > o[1]) || (null === (e = a[n]) || void 0 === e ? void 0 : e.Map) && t.push(n);
}
return t;
}, l = n(!!o);
0 === l.length && o && (l = n(!1));
if (0 === l.length) return null;
var d = l[Math.floor(Math.random() * l.length)], c = this.convertMapToBoard(a[d].Map), u = s[d];
null === (t = null === (e = hs.classDefaultBoardInfo) || void 0 === e ? void 0 : e.setDefaultBoardInfo) || void 0 === t || t.call(e, {
boardIndex: d,
boardSource: hs.DEFAULT_SOURCE_TYPE.DEFAULT
});
return {
board: c,
configuredWeight: u
};
};
r.prototype.convertMapToBoard = function(o) {
for (var r = [], e = 0; e < hs.ROW; e++) {
r[e] = [];
for (var t = 0; t < hs.COL; t++) {
var a = e * hs.COL + t;
r[e][t] = 0 === o[a] ? -1 : o[a];
}
}
return r;
};
r.prototype.handleReplay = function() {
var o, r;
f.newUserBoardDiffInfo.firstReplayGameNum < 0 && (f.newUserBoardDiffInfo.firstReplayTriggerScore = null !== (r = null === (o = hs.classScoreInfo) || void 0 === o ? void 0 : o.score) && void 0 !== r ? r : 0);
f.newUserBoardDiffInfo.replayTriggerBoardWeight = this.getRealtimeBoardWeight();
this._replayTriggered = !0;
f.newUserBoardDiffInfo.currentReplayGame = !0;
this._traitInjectedSystemBoard = !1;
f.newUserBoardDiffInfo.clear();
p.newUserBoardDiffAnimInfo.clear();
f.newUserBoardDiffInfo.clearPosMap();
this.resetAllBlockSkin();
};
r.prototype.handleDisableFirstDayReplayGuideBoardTrait = function(o) {
o.returnValue = !0;
o.returnState = !0;
o.replace = !0;
};
r.prototype.handleGameEndPre = function() {
var o, r, e = null !== (r = null === (o = hs.classScoreInfo) || void 0 === o ? void 0 : o.score) && void 0 !== r ? r : 0;
f.newUserBoardDiffInfo.prevLastGameScore = f.newUserBoardDiffInfo.lastGameScore;
f.newUserBoardDiffInfo.lastGameScore = e;
};
r.prototype.handleGameEnd = function() {
var o = f.newUserBoardDiffInfo.currentGameStartTs, r = o > 0 ? Math.max(0, Date.now() - o) : 0;
f.newUserBoardDiffInfo.lastGameDurationMs = r;
f.newUserBoardDiffInfo.currentReplayGame = !1;
this.logKeyNode("本局最终结束，记录上一局时长", {
"系统局号": hs.classGameInfo.gameNum,
"去除replay局号": f.newUserBoardDiffInfo.logicalGameNum,
"冷启动会话局号": f.newUserBoardDiffInfo.sessionGameCount,
"上一局时长ms": r
});
};
r.prototype.setGuideComponent = function(o) {
h.newUserBoardDiffGuideInfo.guideComponent = o;
};
r.prototype.getInitBoardAnimConfig = function() {
return null !== I.NEW_USER_BOARD_DIFF_INIT_BOARD_ANIM_CONFIG && void 0 !== I.NEW_USER_BOARD_DIFF_INIT_BOARD_ANIM_CONFIG ? I.NEW_USER_BOARD_DIFF_INIT_BOARD_ANIM_CONFIG : null;
};
r.prototype.maybeStopInitBoardAnimByLongPress = function() {
var o = this.getInitBoardAnimConfig();
o && 1 === o.enabled && (o.longPressMs <= 0 || p.newUserBoardDiffAnimInfo.running && (!p.newUserBoardDiffAnimInfo.touching || p.newUserBoardDiffAnimInfo.touchStartAtMs <= 0 || Date.now() - p.newUserBoardDiffAnimInfo.touchStartAtMs >= o.longPressMs && p.newUserBoardDiffAnimInfo.stopInitBoardAnim()));
};
r.prototype.handleInitBoardAnimOnTouchMove = function() {
p.newUserBoardDiffAnimInfo.stopInitBoardAnim();
};
r.prototype.handleInitBoardAnimAfterTouchStart = function() {
var o, r = this;
if (p.newUserBoardDiffAnimInfo.running) {
p.newUserBoardDiffAnimInfo.touching = !0;
p.newUserBoardDiffAnimInfo.touchStartAtMs = Date.now();
var e = this.getInitBoardAnimConfig(), t = null !== (o = null == e ? void 0 : e.longPressMs) && void 0 !== o ? o : 0;
t > 0 && setTimeout(function() {
return r.maybeStopInitBoardAnimByLongPress();
}, t);
}
};
r.prototype.handleInitBoardAnimBeforeOnTouchEnd = function() {
p.newUserBoardDiffAnimInfo.touching = !1;
p.newUserBoardDiffAnimInfo.touchStartAtMs = 0;
};
r.prototype.handleAfterTouchEndClearEliminated = function(o) {
var r, e, t, a, s;
if (!(this.getCurrentBoardId() <= 0)) {
var i = null === (t = o.args) || void 0 === t ? void 0 : t[1], n = null == i ? void 0 : i.putEliminatesInfo;
if (n && !(n.length <= 0)) {
var l = null === (a = hs.boardRendererInfo) || void 0 === a ? void 0 : a.blocks, c = [];
try {
for (var u = d(n), p = u.next(); !p.done; p = u.next()) {
var h = p.value, B = null == h ? void 0 : h.row, _ = null == h ? void 0 : h.col;
if ("number" == typeof B && "number" == typeof _) {
c.push(B + "_" + _);
var I = null === (s = null == l ? void 0 : l[B]) || void 0 === s ? void 0 : s[_];
I && cc.isValid(I) && f.newUserBoardDiffInfo.setManualInitBoardTempAllowSkin(I, !1);
}
}
} catch (o) {
r = {
error: o
};
} finally {
try {
p && !p.done && (e = u.return) && e.call(u);
} finally {
if (r) throw r.error;
}
}
f.newUserBoardDiffInfo.deletePositionColorMapKeys(c);
}
}
};
r.prototype.handleDefaultBoardSplashAnimationEnd = function() {
this.getCurrentBoardId() <= 0 || f.newUserBoardDiffInfo.logicalGameNum >= 1 && f.newUserBoardDiffInfo.logicalGameNum <= 4 || f.newUserBoardDiffInfo.boardModified() || p.newUserBoardDiffAnimInfo.startInitboardAnim();
};
r.prototype.getCurrentBoardId = function() {
return f.newUserBoardDiffInfo.boardId > 0 ? f.newUserBoardDiffInfo.boardId : 0;
};
r.prototype.getGuideBoardIdByGuideScheme = function(o) {
return 1 === o ? 1 : 0;
};
r.prototype.handleSetCanEliminateBlock = function(o) {
var r;
if (!(this.getCurrentBoardId() <= 0)) {
var e = null === (r = o.args) || void 0 === r ? void 0 : r[0];
e && cc.isValid(e) && null !== f.newUserBoardDiffInfo.getManualInitBoardBlockInitialSourceColor(e) && f.newUserBoardDiffInfo.setManualInitBoardTempAllowSkin(e, !0);
}
};
r.prototype.handleResetLastOneBlockOrSetNoEliminateBlock = function(o) {
var r;
if (!(this.getCurrentBoardId() <= 0)) {
var e = null === (r = o.args) || void 0 === r ? void 0 : r[0];
e && cc.isValid(e) && f.newUserBoardDiffInfo.setManualInitBoardTempAllowSkin(e, !1);
}
};
r.prototype.handleBlockLoadSpriteFrame = function(o) {
var r, e, t, a, s, i;
if (!(this.getCurrentBoardId() <= 0)) {
var n = o.target, l = null !== (r = null == n ? void 0 : n.node) && void 0 !== r ? r : null, d = null !== (t = null === (e = null == n ? void 0 : n.block) || void 0 === e ? void 0 : e.node) && void 0 !== t ? t : null;
if (!l || !cc.isValid(l)) return !1;
var c = f.newUserBoardDiffInfo.getManualInitBoardBlockInitialSourceColor(l), u = f.newUserBoardDiffInfo.isManualInitBoardTempAllowSkin(l);
if (null === c) return !1;
if (u) return !1;
if (d) {
var p = null === (s = null === (a = hs.skinInfo) || void 0 === a ? void 0 : a.getBlockMaterial) || void 0 === s ? void 0 : s.call(a, d);
null === (i = null == p ? void 0 : p.setMaterial) || void 0 === i || i.call(p, !1);
}
var h = o.method;
h && h.apply(o.target, o.args);
o.returnState = !0;
o.replace = !0;
}
};
r.prototype.handleBlockForceRender = function(o) {
o.returnValue = !0;
o.returnState = !0;
o.replace = !0;
};
r.prototype.handleBlockShouldComponentUpdateReturnValue = function(o) {
if (!(this.getCurrentBoardId() <= 0 || 0 === Object.keys(f.newUserBoardDiffInfo.positionColorMap).length)) {
o.returnValue = !0;
o.returnState = !0;
o.replace = !0;
}
};
r.prototype.handleClassBoardProxyOnBoardInit = function() {
f.newUserBoardDiffInfo.syncPositionColorMapFromStorage();
hs.classGuideInfo.show && storage.setItem("classFaceBlocks", hs.boardInfo.NULL);
};
r.prototype.handleClassBlocksProducerProxyOnInit = function() {
if (hs.classGuideInfo.show) {
storage.remove("classProducerBlocks");
storage.setItem("classGuideStep", hs.classGuideInfo.step);
}
};
r.prototype.handleClassGuideProxyApplyGuideStepConfigOverrides = function() {
var o;
if (0 === hs.classGameInfo.gameNum && !hs.classGuideInfo.isFinishedGuide) {
var r = this.getRuntimeProps().guideScheme, e = this.getGuideBoardIdByGuideScheme(r);
if (!(e <= 0)) {
var t = c.NewUserBoardDiffTraitInfo.getNewUserBoardDiffConfig(e);
if (t) {
f.newUserBoardDiffInfo.boardId = e;
f.newUserBoardDiffInfo.usedManualIds.includes(e) || (f.newUserBoardDiffInfo.usedManualIds = l(f.newUserBoardDiffInfo.usedManualIds, [ e ]));
var a = hs.classGuideInfo.steps || [], s = a[0] ? {
save_arr: (a[0].save_arr || []).map(function(o) {
return o.slice();
}),
producerBlocks: (t.producerBlocks || []).slice(),
blocksColors: (t.blocksColors || []).slice(),
color: a[0].color,
currentScore: a[0].currentScore,
highScore: a[0].highScore,
move: (a[0].move || []).map(function(o) {
return {
x: o.x,
y: o.y
};
})
} : null, i = a[1] ? {
save_arr: (a[1].save_arr || []).map(function(o) {
return o.slice();
}),
producerBlocks: (t.producerBlocks || []).slice(),
blocksColors: (t.blocksColors || []).slice(),
color: a[1].color,
currentScore: a[1].currentScore,
highScore: a[1].highScore,
move: (a[1].move || []).map(function(o) {
return {
x: o.x,
y: o.y
};
})
} : null, n = t.move && 2 === t.move.length ? t.move : [ {
x: 0,
y: -553.75
}, {
x: 0,
y: 126.25
} ], d = {
save_arr: (t.boardData || []).map(function(o) {
return o.slice();
}),
producerBlocks: (t.producerBlocks || []).slice(),
blocksColors: (t.blocksColors || []).slice(),
color: null !== (o = t.blocksColors[1]) && void 0 !== o ? o : 1,
currentScore: 0,
highScore: 0,
move: (n || []).map(function(o) {
return {
x: o.x,
y: o.y
};
})
};
storage.setItem("guideStepConfigOverride_0", s);
storage.setItem("guideStepConfigOverride_1", i);
storage.setItem("guideStepConfigOverride_2", d);
}
}
}
};
r.prototype.handleClassGuideProxyRenderGuideState = function(o) {
var r, e, t, a;
if (hs.classGuideInfo.show && !hs.classGuideInfo.isFinishedGuide) {
var s = null === (r = o.args) || void 0 === r ? void 0 : r[0], i = null !== (e = null == s ? void 0 : s.step) && void 0 !== e ? e : null === (t = null == s ? void 0 : s.state) || void 0 === t ? void 0 : t.step, n = storage.getItem("classGuideStep", 0);
if (2 === ("number" == typeof i ? i : n)) {
var l = this.getRuntimeProps().guideScheme, d = this.getGuideBoardIdByGuideScheme(l);
if (!(d <= 0)) {
var u = c.NewUserBoardDiffTraitInfo.getNewUserBoardDiffConfig(d);
if (u) {
var B = Cinst(hs.ClassGuide), _ = null !== (a = null == B ? void 0 : B.node) && void 0 !== a ? a : null, I = c.NewUserBoardDiffTraitInfo.computeGuideMoveFromScene(u.boardData, u.guideTargetCell, null != _ ? _ : void 0);
if (I) {
var y = hs.classGuideInfo.steps;
(null == y ? void 0 : y[2]) && (y[2].move = I);
B && this.setGuideComponent(B);
var b = u.spineTargetPositions;
b && 0 !== b.length || !u.guideTargetCell || (b = [ [ u.guideTargetCell.row, u.guideTargetCell.col ] ]);
b && b.length > 0 && h.newUserBoardDiffGuideInfo.createTargetHighlight(d, b);
f.newUserBoardDiffInfo.positionColorMap = f.newUserBoardDiffInfo.buildPositionColorMapFromSnapshot(u.boardData);
p.newUserBoardDiffAnimInfo.startInitboardAnim();
}
}
}
}
}
};
r.prototype.handleProduceDefaultColor = function(o) {
this.getCurrentBoardId() > 0 && (o.returnState = !0);
};
r.prototype.handleIsUseEmptyBoardBeforeInit = function(o) {
var r, e = f.newUserBoardDiffInfo.boardId;
if (e > 0 || e === u.EMPTY_BOARD_ID || this._traitInjectedSystemBoard) {
var t = e === u.EMPTY_BOARD_ID ? hs.boardInfo.NULL : null === (r = o.args) || void 0 === r ? void 0 : r[1];
if (t) {
o.args[0] = e === u.EMPTY_BOARD_ID;
o.args[1] = t;
o.returnValue = t;
o.returnState = !0;
o.replace = !0;
}
}
};
r.prototype.handleProduceDefaultBoardTurnAround = function(o) {
(this.getCurrentBoardId() > 0 || this._traitInjectedSystemBoard) && (o.returnState = !0);
};
r.prototype.handleProduceColorBase = function(o) {
if (!(this._skipColorOverride || 1 === hs.classGameInfo.roundNum && this.getUsedFixedBoard())) {
var r = this.getCurrentBoardId();
if (!(r <= 0)) {
var e = c.NewUserBoardDiffTraitInfo.getNewUserBoardDiffConfig(r);
if (e && Array.isArray(e.blocksColors) && !(e.blocksColors.length < 3)) {
hs.classColorProducerGameInfo.setColorList(e.blocksColors);
o.args && (o.args[0] = !0);
}
}
}
};
r.prototype.handleProduceColorPostprocessing = function(o) {
var r, e;
if (!this._skipColorOverride && 1 === hs.classGameInfo.roundNum && this.getUsedFixedBoard()) {
var t = this.getCurrentBoardId();
if (!(t <= 0)) {
var a = c.NewUserBoardDiffTraitInfo.getNewUserBoardDiffConfig(t);
if (a && Array.isArray(a.blocksColors) && !(a.blocksColors.length < 3)) {
var s = null === (r = hs.algorithmInfo) || void 0 === r ? void 0 : r.blockIdList, i = null !== (e = a.producerBlocks) && void 0 !== e ? e : [], n = a.blocksColors.slice(0, 3), l = n;
if (s && 3 === s.length) {
var d = new Set();
l = s.map(function(o) {
for (var r = 0; r < i.length; r++) if (!d.has(r) && i[r] === o) {
d.add(r);
return n[r];
}
return n[0];
});
}
hs.classColorProducerGameInfo.setColorList(l);
o.returnState = !0;
}
}
}
};
r.prototype.handleSetRecordOperationColor = function(o) {
if (this.getUsedFixedBoard() && 1 === hs.classGameInfo.roundNum) {
o.returnState = !0;
o.replace = !0;
}
};
r.prototype.handleUpdateBlocksProducerState = function(o) {
if (!(this._skipColorOverride || 1 === hs.classGameInfo.roundNum && this.getUsedFixedBoard())) {
var r = this.getCurrentBoardId();
if (!(r <= 0)) {
var e = c.NewUserBoardDiffTraitInfo.getNewUserBoardDiffConfig(r);
if (e && Array.isArray(e.blocksColors) && !(e.blocksColors.length < 3)) {
var t = e.blocksColors.slice(0, 3);
o.args && o.args.length >= 2 && (o.args[1] = t);
hs.classColorProducerGameInfo.setColorList(t);
}
}
}
};
r.prototype.onActiveOnAlgorithmStrategyPriority = function(o) {
var r = hs.classGameInfo, e = r.roundNum;
r.gameNum;
if (this.getUsedFixedBoard() && 1 === e) {
var t = this.getCurrentBoardId();
if (!(t <= 0)) {
var a = c.NewUserBoardDiffTraitInfo.getNewUserBoardDiffConfig(t);
if (a && Array.isArray(a.producerBlocks) && !(a.producerBlocks.length < 3)) {
hs.algorithmStrategyInfo.setAlgorithmPriorityList([ hs.OFFER_TYPE.NEW_USER_EARLY_ROUNDS_FIXED_BLOCK ]);
hs.algorithmHijackInfo.setHijackAlgoResult(hs.OFFER_TYPE.NEW_USER_EARLY_ROUNDS_FIXED_BLOCK, {
mainKey: "NewUserBoardDiffTrait",
hijackResult: {
algoType: hs.OFFER_TYPE.NEW_USER_EARLY_ROUNDS_FIXED_BLOCK,
algoList: [ hs.OFFER_TYPE.NEW_USER_EARLY_ROUNDS_FIXED_BLOCK ],
blockGroup: [],
blockIds: a.producerBlocks.slice(0, 3),
blockPoses: [],
blockRecords: [],
timeout: !1,
blockNames: Array(3).fill("NEW_USER_EARLY_ROUNDS_FIXED_BLOCK"),
errorCode: 0
}
});
var s = a.producerBlocks.slice(0, 3), i = a.blocksColors && a.blocksColors.length >= 3 ? a.blocksColors.slice(0, 3) : [];
storage.setItem("classProducerBlocks", s);
!this._skipColorOverride && i.length >= 3 && hs.classColorProducerGameInfo.setColorList(i);
o.returnState = !0;
}
}
}
};
r.prototype.handleBlockOperaPosGuard = function(o) {
this.getUsedFixedBoard() && 1 === hs.classGameInfo.roundNum && (o.replace = !0);
};
r.prototype.onGameBackHome = function() {
this.resetAllBlockSkin();
f.newUserBoardDiffInfo.clear();
p.newUserBoardDiffAnimInfo.clear();
h.newUserBoardDiffGuideInfo.clear();
this._replayTriggered = !1;
this._traitInjectedSystemBoard = !1;
};
r.prototype.resetAllBlockSkin = function() {
var o, r = null === (o = hs.boardRendererInfo) || void 0 === o ? void 0 : o.blocks;
if (r) for (var e = 0; e < Object.keys(r).length; e++) {
var t = r[e];
if (t) for (var a = 0; a < Object.keys(t).length; a++) {
var s = t[a];
if (s && cc.isValid(s)) {
var i = s.getComponent(hs.Block);
null == i || i.setState({}, !0);
}
}
}
};
r.prototype.handleGuideChangeDragItem = function(o) {
var r;
if (0 === hs.classGameInfo.gameNum && hs.classGuideInfo.show) {
var e = o.args[0], t = o.args[4], a = o.args[5];
if (e) {
var s = t && Object.keys(t).length > 0, i = a && Object.keys(a).length > 0;
this._guideHasEliminateHint = !(!s && !i);
if (!this._guideHasEliminateHint && hs.classGuideInfo.step < hs.classGuideInfo.totalStep) {
var n = o.args[2], l = o.args[3];
for (var d in n) for (var c in n[d]) {
var u = null === (r = l[d]) || void 0 === r ? void 0 : r[c];
u && cc.isValid(u) && cc.isValid(u.node) && (u.node.opacity = 0);
}
}
} else this._guideHasEliminateHint = !1;
}
};
r.prototype.handleGuideInterceptTouchEnd = function(o) {
if (0 === hs.classGameInfo.gameNum && hs.classGuideInfo.show && !(hs.classGuideInfo.step >= hs.classGuideInfo.totalStep)) {
var r = o.target;
if (r.canSnap && !this._guideHasEliminateHint) {
o.returnState = !0;
o.returnValue = !0;
r.backBlocks();
var e = Cinst(hs.ClassGuide);
e && e.setState && e.setState({
showHand: !0
});
}
}
};
r.prototype.handleGuideEndDot = function(o) {
var r;
if (0 === hs.classGameInfo.gameNum && hs.classGuideInfo.show && !hs.classGuideInfo.isFinishedGuide) {
var e = hs.classGuideInfo.totalStep;
if (!(hs.classGuideInfo.step < e - 1)) {
var t = o.args[0];
if (null === (r = null == t ? void 0 : t.state) || void 0 === r || !r.clearProducer) {
o.replace = !0;
o.originalCaller();
storage.setItem("classGuideStep", e);
p.newUserBoardDiffAnimInfo.stopInitBoardAnim();
h.newUserBoardDiffGuideInfo.clear();
f.newUserBoardDiffInfo.clear();
f.newUserBoardDiffInfo.clearPosMap();
}
}
}
};
r.prototype.handleGuideRequestBlocksProducer = function() {
if (0 === hs.classGameInfo.gameNum) {
p.newUserBoardDiffAnimInfo.stopInitBoardAnim();
h.newUserBoardDiffGuideInfo.clearSpineHighlight();
}
};
r.prototype.handleGuideTouchEnd = function() {
if (0 === hs.classGameInfo.gameNum && hs.classGuideInfo.show) {
p.newUserBoardDiffAnimInfo.stopInitBoardAnim();
h.newUserBoardDiffGuideInfo.clearSpineHighlight();
}
};
r.prototype.handleBlockProducerTouchEnd = function(o) {
var r, e, t;
(null === (t = null === (e = null === (r = o.args) || void 0 === r ? void 0 : r[0]) || void 0 === e ? void 0 : e.state) || void 0 === t ? void 0 : t.clearScreen) && f.newUserBoardDiffInfo.clearPosMap();
0 === hs.classGameInfo.gameNum && 0 === hs.classGameInfo.roundNum && (!hs.blocksProducerInfo.isNullProducerBlocks || this._algorithmResetEmitter.fire());
};
var e;
r.EXP5_MANUAL_REPLACE_AFTER_NON_MANUAL_ROUNDS = 3;
r.EXP5_MANUAL_REPLACE_PROB = .4;
return e = i([ classId("NewUserBoardDiffTrait") ], r);
}(Trait);
e.NewUserBoardDiffTrait = y;
cc._RF.pop();
}, {
"./configs/NewUserBoardDiffAnimConfig": "NewUserBoardDiffAnimConfig",
"./configs/NewUserBoardDiffConfig": "NewUserBoardDiffConfig",
"./configs/NewUserBoardDiffWeightsConfig": "NewUserBoardDiffWeightsConfig",
"./types/NewUserBoardDiffType": "NewUserBoardDiffType",
"./vo/NewUserBoardDiffAnimInfo": "NewUserBoardDiffAnimInfo",
"./vo/NewUserBoardDiffGuideInfo": "NewUserBoardDiffGuideInfo",
"./vo/NewUserBoardDiffInfo": "NewUserBoardDiffInfo",
"./vo/NewUserBoardDiffTraitInfo": "NewUserBoardDiffTraitInfo"
} ],
NewUserBoardDiffType: [ function(o, r, e) {
"use strict";
cc._RF.push(r, "c84243PjOhF9LxUjgPaVmpU", "NewUserBoardDiffType");
Object.defineProperty(e, "__esModule", {
value: !0
});
e.ROUND6_PLUS_EXP9_PRIORITY_POOL = e.ROUND5_LOW_SCORE_POOL = e.ROUND5_HIGH_SCORE_POOL = e.ROUND3_LOW_SCORE_POOL = e.ROUND3_HIGH_SCORE_POOL = e.REPLAY_SYSTEM_WEIGHT_RANGE = e.COLD_START_BOARD_IDS = e.COLD_START_SPECIAL_INTERVAL_MS = e.COLD_START_INTERVAL_MS = e.EMPTY_BOARD_ID = e.STORAGE_KEY_LAST_GAME_DURATION_MS = e.STORAGE_KEY_CURRENT_GAME_START_TS = e.STORAGE_KEY_SYSTEM_EMPTY_CYCLE_IDX = e.STORAGE_KEY_PREV_LAST_GAME_SCORE = e.STORAGE_KEY_FIRST_PLAY_TS = e.STORAGE_KEY_SESSION_GAME_COUNT = e.STORAGE_KEY_SESSION_COLD_START = e.STORAGE_KEY_ORIGINAL_BOARD_WAS_EMPTY = e.STORAGE_KEY_LAST_COUNTED_SYSTEM_GAME_NUM = e.STORAGE_KEY_CURRENT_REPLAY_GAME = e.STORAGE_KEY_REPLAY_TRIGGER_BOARD_WEIGHT = e.STORAGE_KEY_FIRST_REPLAY_TRIGGER_SCORE = e.STORAGE_KEY_FIRST_REPLAY_GAME_NUM = e.STORAGE_KEY_REPLAY_GAME_NUM = e.STORAGE_KEY_REPLAY_COUNT_THIS_GAME = e.STORAGE_KEY_WEIGHT_CYCLE_IDX = e.STORAGE_KEY_HAS_EVER_REPLAYED = e.STORAGE_KEY_CONSECUTIVE_NON_MANUAL = e.STORAGE_KEY_USED_MANUAL_IDS = e.STORAGE_KEY_COLD_START_BOARDS_USED = e.STORAGE_KEY_LAST_SESSION_TS = e.STORAGE_KEY_COLD_START_COUNT = e.STORAGE_KEY_LAST_SYSTEM_BOARD_WEIGHT = e.STORAGE_KEY_LAST_GAME_SCORE = e.INIT_BOARD_ANIM_ACTION_TAG = e.STORAGE_KEY_FIRST_ROUND_BLOCKS_APPLIED_BOARD = e.STORAGE_KEY_LOGICAL_GAME_NUM = e.STORAGE_KEY_CURRENT_BOARD_INDEX = e.STORAGE_KEY_BOARD_ID = e.STORAGE_KEY_MANUAL_INIT_BOARD_POSITION_COLOR_MAP = void 0;
e.STORAGE_KEY_MANUAL_INIT_BOARD_POSITION_COLOR_MAP = "NewUserBoardDiffTrait_manualInitBoardPositionColorMap";
e.STORAGE_KEY_BOARD_ID = "NewUserBoardDiffTrait_boardId";
e.STORAGE_KEY_CURRENT_BOARD_INDEX = "NewUserBoardDiffTrait_currentBoardIndex";
e.STORAGE_KEY_LOGICAL_GAME_NUM = "NewUserBoardDiffTrait_logicalGameNum";
e.STORAGE_KEY_FIRST_ROUND_BLOCKS_APPLIED_BOARD = "NewUserBoardDiffTrait_firstRoundBlocksAppliedBoard";
e.INIT_BOARD_ANIM_ACTION_TAG = 101001;
e.STORAGE_KEY_LAST_GAME_SCORE = "NewUserBoardDiffTrait_lastGameScore";
e.STORAGE_KEY_LAST_SYSTEM_BOARD_WEIGHT = "NewUserBoardDiffTrait_lastSystemBoardWeight";
e.STORAGE_KEY_COLD_START_COUNT = "NewUserBoardDiffTrait_coldStartCount";
e.STORAGE_KEY_LAST_SESSION_TS = "NewUserBoardDiffTrait_lastSessionTs";
e.STORAGE_KEY_COLD_START_BOARDS_USED = "NewUserBoardDiffTrait_coldStartBoardsUsed";
e.STORAGE_KEY_USED_MANUAL_IDS = "NewUserBoardDiffTrait_usedManualIds";
e.STORAGE_KEY_CONSECUTIVE_NON_MANUAL = "NewUserBoardDiffTrait_consecutiveNonManual";
e.STORAGE_KEY_HAS_EVER_REPLAYED = "NewUserBoardDiffTrait_hasEverReplayed";
e.STORAGE_KEY_WEIGHT_CYCLE_IDX = "NewUserBoardDiffTrait_weightCycleIdx";
e.STORAGE_KEY_REPLAY_COUNT_THIS_GAME = "NewUserBoardDiffTrait_replayCountThisGame";
e.STORAGE_KEY_REPLAY_GAME_NUM = "NewUserBoardDiffTrait_replayGameNum";
e.STORAGE_KEY_FIRST_REPLAY_GAME_NUM = "NewUserBoardDiffTrait_firstReplayGameNum";
e.STORAGE_KEY_FIRST_REPLAY_TRIGGER_SCORE = "NewUserBoardDiffTrait_firstReplayTriggerScore";
e.STORAGE_KEY_REPLAY_TRIGGER_BOARD_WEIGHT = "NewUserBoardDiffTrait_replayTriggerBoardWeight";
e.STORAGE_KEY_CURRENT_REPLAY_GAME = "NewUserBoardDiffTrait_currentReplayGame";
e.STORAGE_KEY_LAST_COUNTED_SYSTEM_GAME_NUM = "NewUserBoardDiffTrait_lastCountedSystemGameNum";
e.STORAGE_KEY_ORIGINAL_BOARD_WAS_EMPTY = "NewUserBoardDiffTrait_originalBoardWasEmpty";
e.STORAGE_KEY_SESSION_COLD_START = "NewUserBoardDiffTrait_sessionColdStart";
e.STORAGE_KEY_SESSION_GAME_COUNT = "NewUserBoardDiffTrait_sessionGameCount";
e.STORAGE_KEY_FIRST_PLAY_TS = "NewUserBoardDiffTrait_firstPlayTs";
e.STORAGE_KEY_PREV_LAST_GAME_SCORE = "NewUserBoardDiffTrait_prevLastGameScore";
e.STORAGE_KEY_SYSTEM_EMPTY_CYCLE_IDX = "NewUserBoardDiffTrait_systemEmptyCycleIdx";
e.STORAGE_KEY_CURRENT_GAME_START_TS = "NewUserBoardDiffTrait_currentGameStartTs";
e.STORAGE_KEY_LAST_GAME_DURATION_MS = "NewUserBoardDiffTrait_lastGameDurationMs";
e.EMPTY_BOARD_ID = 99999;
e.COLD_START_INTERVAL_MS = 144e5;
e.COLD_START_SPECIAL_INTERVAL_MS = 576e5;
e.COLD_START_BOARD_IDS = [ 148, 101, 48 ];
e.REPLAY_SYSTEM_WEIGHT_RANGE = [ 300, 400 ];
e.ROUND3_HIGH_SCORE_POOL = [ 12, 8, 27 ];
e.ROUND3_LOW_SCORE_POOL = [ 23, 24, 125 ];
e.ROUND5_HIGH_SCORE_POOL = [ 12, 8, 27, 107, 9, 40 ];
e.ROUND5_LOW_SCORE_POOL = [ 23, 24, 125, 19, 114 ];
e.ROUND6_PLUS_EXP9_PRIORITY_POOL = [ 12, 8, 27, 107, 9, 40, 23, 24, 125, 19, 114 ];
cc._RF.pop();
}, {} ],
NewUserBoardDiffWeightsConfig: [ function(o, r, e) {
"use strict";
cc._RF.push(r, "3db58kte9ZAqLbPpsdxKcQH", "NewUserBoardDiffWeightsConfig");
Object.defineProperty(e, "__esModule", {
value: !0
});
e.BOARD_WEIGHTS = void 0;
e.BOARD_WEIGHTS = [ 347, 444, 398, 397, 463, 354, 434, 420, 304, 383, 363, 446, 416, 399, 448, 387, 417, 424, 414, 357, 400, 502, 312, 351, 426, 357, 483, 322, 320, 455, 435, 426, 424, 438, 408, 476, 439, 408, 424, 441, 429, 435, 419, 441, 465, 355, 430, 420, 391, 439, 444, 430, 463, 426, 459, 455, 420, 372, 466, 319, 435, 327, 475, 357, 411, 440, 328, 319, 374, 454, 471, 458, 423, 383, 438, 418, 472, 447, 409, 432, 318, 416, 464, 464, 425, 461, 446, 463, 414, 332, 346, 390, 479, 445, 480, 451, 315, 481, 423, 314, 425, 440, 419, 475, 428, 442, 453, 421, 406, 431, 303, 433, 399, 390, 471, 463, 319, 461, 418, 444, 417, 414, 335, 456, 444, 437, 448, 441, 344, 420, 445, 429, 449, 452, 453, 409, 416, 336, 415, 460, 347, 449, 446, 379, 450, 421, 344, 424, 441, 455, 413, 346, 441, 400, 330, 404, 343, 421, 430, 452, 461, 412, 367, 462, 472, 469, 378, 301, 493, 443, 451, 431, 336, 438, 359, 485, 477, 437, 502, 434, 419, 382, 455, 331, 428, 429, 421, 398, 469, 402, 461, 359, 402, 490, 453, 428, 460, 396, 323, 407, 419, 465, 388, 466, 451, 318, 465, 411, 455, 469, 496, 406, 447, 469, 429, 434, 342, 355, 398, 417, 439, 464, 495, 464, 456, 390, 381, 440, 476, 468, 386, 520, 391, 455, 451, 432, 441, 452, 427, 449, 410, 362, 415, 426, 460, 391, 443, 421, 422, 304, 467, 376, 454, 506, 474, 486, 312, 434, 427, 479, 433, 474, 479, 427, 466, 421, 448, 337, 416, 471, 447, 368, 470, 453, 441, 439, 506, 463, 414, 452, 447, 432, 431, 394, 429, 400, 414, 308, 421, 457, 431, 365, 305, 416, 324, 415, 425, 355, 486, 423, 329, 387, 351, 455, 441, 439, 445, 331, 433, 401, 462, 399, 401, 432, 438, 395, 456, 446, 415, 438, 465, 445, 474, 422, 454, 425, 459, 482, 427, 419, 444, 462, 439, 423, 331, 446, 388, 447, 442, 428, 321, 469, 389, 429, 452, 343, 417, 353, 464, 460, 422, 441, 302, 426, 385, 423, 340, 474, 418, 404, 443, 451, 480, 438, 451, 418, 335, 342, 462, 436, 458, 431, 445, 410, 462, 456, 428, 424, 372, 453, 369, 448, 427, 360, 493, 319, 460, 444, 339, 425, 421, 433, 352, 443, 432, 436, 442, 430, 455, 471, 432, 421, 342, 437, 477, 411, 356, 443, 412, 473, 364, 375, 399, 417, 335, 446, 455, 465, 453, 419, 437, 430, 451, 470, 438, 388, 402, 394, 466, 442, 436, 412, 326, 432, 465, 299, 409, 421, 433, 423, 452, 419, 384, 470, 433, 408, 422, 416, 349, 482, 499, 441, 442, 380, 427, 423, 361, 383, 431, 439, 402, 304, 457, 435, 453, 321, 456, 482, 400, 419, 479, 452, 406, 404, 442, 436, 351, 443, 436, 438, 303, 359, 419, 394, 384, 477, 368, 340, 430, 461, 417, 457, 302, 437, 320, 442, 348, 361, 474, 480, 424, 394, 470, 494, 356, 462, 455, 406, 452, 399, 393, 437, 402, 450, 397, 420, 483, 443, 355, 501, 482, 436, 425, 423, 458, 440, 446, 421, 316, 399, 402, 344, 418, 496, 446, 457, 382, 458, 450, 464, 443, 423, 427, 441, 430, 477, 468, 395, 458, 356, 421, 447, 421, 499, 453, 421, 320, 405, 412, 363, 396, 438, 452, 429, 455, 366, 455, 468, 441, 374, 430, 410, 371, 435, 454, 398, 438, 464, 389, 417, 404, 450, 462, 429, 400, 457, 455, 430, 457, 439, 403, 381, 486, 481, 465, 316, 432, 307, 460, 397, 433, 445, 472, 448, 329, 318, 307, 451, 306, 425, 330, 461, 419, 424, 467, 329, 401, 429, 433, 468, 414, 447, 435, 461, 414, 439, 468, 452, 415, 469, 477, 395, 431, 419, 444, 438, 446, 350, 405, 412, 422, 416, 432, 305, 440, 458, 480, 419, 467, 447, 354, 435, 366, 393, 343, 457, 352, 463, 443, 451, 406, 444, 424, 454, 455, 450, 445, 412, 379, 321, 477, 370, 456, 406, 310, 456, 463, 340, 448, 306, 433, 492, 506, 409, 435, 350, 433, 313, 486, 417, 450, 495, 487, 451, 449, 452, 441, 461, 406, 368, 461, 431, 423, 379, 413, 368, 406, 458, 468, 492, 454, 454, 393, 423, 342, 419, 467, 475, 430, 460, 389, 438, 430, 436, 421, 470, 441, 400, 450, 451, 411, 491, 465, 452, 465, 415, 449, 345, 452, 487, 402, 489, 317, 459, 369, 453, 391, 444, 451, 365, 471, 441, 421, 339, 440, 436, 457, 430, 395, 433, 428, 483, 433, 455, 417, 434, 442, 333, 429, 467, 437, 455, 448, 492, 460, 427, 406, 500, 411, 460, 318, 435, 495, 445, 389, 443, 334, 471, 460, 327, 427, 376, 459, 446, 327, 395, 453, 314, 396, 428, 484, 422, 431, 425, 463, 428, 402, 407, 413, 452, 430, 432, 474, 423, 392, 439, 433, 413, 461, 467, 416, 506, 453, 371, 347, 473, 434, 354, 475, 418, 344, 448, 462, 432, 486, 450, 456, 479, 346, 445, 402, 479, 321, 316, 424, 330, 340, 417, 424, 312, 344, 331, 421, 394, 407, 352, 495, 448, 445, 383, 454, 428, 422, 445, 507, 437, 447, 399, 476, 433, 415, 311, 429, 466, 373, 356, 432, 454, 466, 423, 414, 326, 436, 385, 432, 456, 449, 449, 324, 473, 377, 439, 416, 480, 439, 379, 438, 486, 481, 451, 484, 435, 438, 420, 465, 443, 439, 425, 472, 445, 453, 457, 417, 464, 384, 449, 434, 499, 412, 459, 461, 456, 461, 480, 411, 427, 455, 437, 484, 470, 403, 497, 439, 430, 476, 420, 433, 453, 439, 479, 414, 442, 438, 360, 389, 302, 445, 389, 455, 483, 438, 408, 491, 418, 400, 443, 415, 310, 497, 305, 447, 429, 322, 489, 447, 469, 450, 451, 421, 447, 394, 434, 444, 436, 456, 439, 427, 464, 472, 429, 445, 439, 479, 477, 430, 478, 455, 471, 424, 426, 423, 440, 317, 429, 389, 441, 451, 415, 459, 367, 447, 445, 435, 427, 438, 439, 430, 389, 500, 416, 438, 341, 349, 439, 391, 452, 446, 462, 414, 444, 447, 412, 463, 418, 476, 453, 423, 416, 376, 386, 433, 437, 466, 450, 446, 481, 315, 476, 430, 431, 445, 393, 392, 381, 413, 403, 365, 360, 362, 438, 461, 440, 509, 319, 444, 436, 468, 449, 340, 489, 325, 461, 361, 446, 457, 471, 454, 453, 455, 441, 364, 439, 445, 452, 381, 457, 438, 368, 430, 423, 331, 454, 369, 344, 408, 458, 458, 474, 448, 452, 445, 301, 368, 415, 310, 301, 333, 458, 304, 413, 368, 448, 461, 440, 455, 417, 417, 468, 476, 311, 385, 427, 439, 361, 352, 399, 325, 316, 382, 326, 444, 406, 373, 495, 410, 437, 442, 465, 459, 402, 467, 457, 385, 382, 421, 405, 337, 428, 480, 454, 457, 418, 448, 450, 401, 457, 442, 419, 442, 479, 457, 351, 443, 449, 419, 339, 408, 425, 443, 369, 460, 448, 398, 372, 427, 402, 462, 419, 484, 314, 426, 446, 436, 445, 403, 501, 305, 347, 390, 462, 395, 453, 399, 358, 430, 423, 356, 457, 446, 442, 416, 430, 459, 416, 466, 338, 477, 354, 443, 447, 424, 451, 400, 464, 473, 341, 434, 434, 463, 464, 468, 336, 334, 384, 377, 499, 330, 485, 456, 443, 365, 468, 390, 439, 450, 416, 457, 482, 437, 454, 357, 486, 457, 477, 477, 457, 413, 459, 369, 450, 473, 435, 495, 461, 421, 400, 434, 447, 452, 383, 453, 365, 421, 412, 428, 468, 455, 373, 427, 383, 421, 376, 451, 430, 428, 451, 314, 451, 421, 469, 434, 423, 471, 384, 472, 451, 372, 443, 372, 438, 318, 437, 365, 465, 420, 443, 385, 359, 462, 352, 463, 344, 450, 436, 432, 424, 457, 440, 459, 448, 313, 462, 466, 445, 424, 327, 345, 490, 408, 450, 387, 402, 454, 461, 396, 377, 475, 423, 434, 451, 440, 395, 445, 455, 336, 355, 409, 378, 415, 468, 426, 310, 479, 440, 417, 389, 347, 452, 477, 457, 398, 437, 430, 430, 433, 419, 315, 394, 453, 462, 429, 448, 479, 335, 440, 444, 399, 391, 415, 437, 418, 350, 378, 376, 454, 452, 439, 391, 396, 422, 437, 435, 357, 344, 470, 409, 384, 373, 447, 450, 346, 485, 402, 463, 338, 369, 463, 414, 321, 468, 360, 430, 421, 468, 446, 457, 464, 355, 453, 476, 464, 440, 482, 415, 451, 425, 426, 426, 309, 338, 418, 374, 462, 435, 452, 325, 450, 439, 330, 459, 406, 440, 503, 446, 428, 450, 430, 416, 461, 430, 471, 441, 421, 452, 459, 438, 431, 466, 467, 495, 438, 467, 454, 391, 461, 470, 464, 423, 450, 434, 440, 443, 416, 423, 450, 358, 406, 453, 438, 469, 470, 458, 466, 443, 438, 407, 407, 332, 443, 445, 477, 461, 474, 453, 392, 439, 411, 364, 461, 386, 355, 433, 463, 325, 413, 452, 453, 467, 320, 409, 461, 431, 460, 456, 365, 437, 375, 415, 447, 441, 439, 320, 319, 300, 455, 448, 409, 341, 437, 443, 455, 442, 413, 453, 314, 330, 465, 465, 419, 471, 430, 318, 464, 454, 501, 426, 415, 468, 462, 359, 342, 341, 431, 458, 422, 461, 310, 410, 409, 400, 410, 422, 411, 424, 375, 318, 337, 458, 442, 468, 471, 431, 395, 421, 326, 419, 432, 424, 467, 456, 461, 429, 337, 332, 313, 301, 483, 424, 452, 452, 432, 451, 423, 338, 412, 312, 401, 475, 427, 467, 409, 435, 464, 401, 424, 438, 442, 462, 474, 316, 427, 440, 429, 347, 403, 513, 360, 353, 443, 410, 403, 344, 454, 470, 416, 415, 372, 410, 403, 419, 420, 344, 495, 452, 414, 457, 465, 388, 299, 348, 322, 453, 456, 464, 436, 368, 444, 465, 449, 410, 469, 463, 304, 426, 407, 397, 443, 416, 445, 464, 386, 441, 351, 405, 436, 362, 329, 421, 459, 465, 333, 440, 445, 417, 436, 343, 410, 417, 342, 437, 458, 457, 436, 410, 381, 403, 447, 348, 338, 434, 491, 380, 466, 472, 434, 434, 401, 439, 460, 469, 395, 477, 467, 479, 437, 396, 451, 447, 479, 405, 420, 368, 421, 432, 416, 434, 444, 431, 429, 442, 321, 485, 348, 471, 364, 449, 353, 403, 478, 314, 412, 333, 444, 392, 466, 440, 353, 442, 417, 326, 460, 381, 474, 436, 447, 451, 376, 450, 322, 440, 450, 377, 501, 471, 311, 436, 329, 422, 455, 437, 506, 303, 436, 453, 421, 436, 340, 386, 382, 466, 487, 486, 441, 369, 455, 456, 442, 453, 468, 434, 418, 445, 345, 444, 467, 436, 444, 440, 436, 333, 364, 410, 482, 353, 471, 424, 479, 306, 449, 421, 459, 396, 462, 348, 450, 450, 421, 481, 466, 439, 393, 474, 369, 314, 441, 465, 458, 478, 433, 456, 401, 387, 391, 479, 434, 325, 454, 447, 417, 399, 492, 422, 424, 444, 410, 407, 436, 397, 397, 437, 439, 416, 322, 456, 446, 369, 455, 422, 414, 392, 450, 479, 427, 451, 432, 447, 447, 411, 346, 359, 387, 401, 450, 431, 441, 453, 468, 405, 439, 438, 324, 391, 353, 315, 451, 334, 397, 451, 444, 394, 450, 454, 457, 470, 451, 456, 423, 467, 386, 431, 433, 328, 448, 435, 456, 382, 454, 435, 473, 451, 387, 491, 445, 352, 444, 462, 435, 454, 429, 495, 416, 384, 460, 419, 434, 420, 454, 435, 465, 423, 426, 466, 310, 474, 463, 431, 479, 482, 469, 408, 403, 413, 513, 430, 480, 469, 451, 345, 456, 431, 452, 450, 438, 412, 440, 494, 471, 432, 317, 462, 444, 458, 423, 448, 372, 413, 480, 444, 364, 456, 346, 417, 376, 305, 320, 418, 480, 446, 455, 443, 326, 455, 420, 456, 439, 385, 435, 401, 474, 480, 405, 464, 448, 352, 420, 403, 448, 417, 476, 454, 449, 439, 452, 450, 432, 318, 441, 430, 442, 423, 426, 457, 335, 344, 368, 474, 443, 419, 475, 448, 397, 420, 442, 424, 473, 436, 385, 429, 418, 464 ];
cc._RF.pop();
}, {} ]
}, {}, [ "NewUserBoardDiffTraitInterface", "NewUserBoardDiffTrait", "NewUserBoardDiffAnimConfig", "NewUserBoardDiffConfig", "NewUserBoardDiffWeightsConfig", "NewUserBoardDiffType", "NewUserBoardDiffAnimInfo", "NewUserBoardDiffGuideInfo", "NewUserBoardDiffInfo", "NewUserBoardDiffTraitInfo" ]);
//# sourceMappingURL=index.js.map
