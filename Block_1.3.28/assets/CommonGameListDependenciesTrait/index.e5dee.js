window.__require = function e(t, i, r) {
function o(s, a) {
if (!i[s]) {
if (!t[s]) {
var c = s.split("/");
c = c[c.length - 1];
if (!t[c]) {
var p = "function" == typeof __require && __require;
if (!a && p) return p(c, !0);
if (n) return n(c, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = c;
}
var h = i[s] = {
exports: {}
};
t[s][0].call(h.exports, function(e) {
return o(t[s][1][e] || e);
}, h, h.exports, e, t, i, r);
}
return i[s].exports;
}
for (var n = "function" == typeof __require && __require, s = 0; s < r.length; s++) o(r[s]);
return o;
}({
CommonGameListDependenciesTrait: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "11963/wypdE7bMArooQUZQS", "CommonGameListDependenciesTrait");
var r, o = this && this.__extends || (r = function(e, t) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
})(e, t);
}, function(e, t) {
r(e, t);
function i() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (i.prototype = t.prototype, new i());
}), n = this && this.__decorate || function(e, t, i, r) {
var o, n = arguments.length, s = n < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, i) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, i, r); else for (var a = e.length - 1; a >= 0; a--) (o = e[a]) && (s = (n < 3 ? o(s) : n > 3 ? o(t, i, s) : o(t, i)) || s);
return n > 3 && s && Object.defineProperty(t, i, s), s;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
i.CommonGameListDependenciesTrait = void 0;
var s = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._entrance = !1;
t._list = !1;
t._setting = !1;
t._session = !0;
t._shouldBlockHomePage = !1;
t._timer = -1;
t._showPageMethod = null;
return t;
}
t.prototype.onCreate = function() {
this.disableTraits();
};
t.prototype.onActive = function(e) {
var t = this;
if (hs.tp.isHomePage_ProxyShowHomePageEvent(e)) {
if (!this._session) return;
this.disableTraits();
this.clearTimer();
var i = storage.getItem("commonGameListDependenciesEntrance", 0), r = storage.getItem("commonGameListDependenciesList", 0), o = storage.getItem("commonGameListDependenciesSetting", 0);
if (i !== this.props.entrance || r !== this.props.list || o !== this.props.setting) return;
if (this._entrance && this._list && this._setting) return;
e.replace = !0;
this._showPageMethod = e.originalCaller;
this._timer = setTimeoutSafe(function() {
t.clearStorage();
if (t._showPageMethod) {
t._showPageMethod();
t._showPageMethod = null;
}
}, this.getTime());
}
};
t.prototype.clearStorage = function() {
storage.remove("commonGameListDependenciesEntrance");
storage.remove("commonGameListDependenciesList");
storage.remove("commonGameListDependenciesSetting");
};
t.prototype.clearTimer = function() {
if (-1 !== this._timer) {
clearTimeout(this._timer);
this._timer = -1;
}
};
t.prototype.data = function() {
var e = this;
return {
get uiReady() {
return e.uiReady;
}
};
};
Object.defineProperty(t.prototype, "uiReady", {
get: function() {
if (!this._session) return !1;
var e = this._entrance && this._list && this._setting;
this._session = e;
return e;
},
enumerable: !1,
configurable: !0
});
t.prototype.setState = function(e) {
var t = null == e ? void 0 : e.traitId;
if (t === this.props.entrance) {
storage.setItem("commonGameListDependenciesEntrance", t);
this.checkHomePage() ? this._entrance = !1 : this._entrance = !0;
} else if (t === this.props.list) {
this._list = !0;
storage.setItem("commonGameListDependenciesList", t);
} else if (t === this.props.setting) {
storage.setItem("commonGameListDependenciesSetting", t);
this.checkHomePage() ? this._session = !1 : this._setting = !0;
}
if (this._entrance && this._list && this._setting) {
if (this._showPageMethod) {
this._showPageMethod();
this._showPageMethod = null;
}
this.clearTimer();
}
};
t.prototype.checkHomePage = function() {
var e = Cinst(hs.HomePage);
return !(!e || !cc.isValid(e.node));
};
t.prototype.getTime = function() {
return 1e4;
};
t.prototype.disableTraits = function() {
var e = this.getDisableTraits();
(null == e ? void 0 : e.length) > 0 && e.forEach(function(e) {
var t = TRAIT(e);
t && (t.dynamicActive = !1);
});
};
t.prototype.getDisableTraits = function() {
return [ "AddActivityCommon1Trait", "AddActivityCommon2Trait" ];
};
return n([ classId("CommonGameListDependenciesTrait"), classMethodWatch() ], t);
}(Trait);
i.CommonGameListDependenciesTrait = s;
cc._RF.pop();
}, {} ],
CommonGameListDependencies_List_Trait: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "b415f6LtzFPAo9IQdzPrk83", "CommonGameListDependencies_List_Trait");
var r, o = this && this.__extends || (r = function(e, t) {
return (r = Object.setPrototypeOf || {
__proto__: []
} instanceof Array && function(e, t) {
e.__proto__ = t;
} || function(e, t) {
for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
})(e, t);
}, function(e, t) {
r(e, t);
function i() {
this.constructor = e;
}
e.prototype = null === t ? Object.create(t) : (i.prototype = t.prototype, new i());
}), n = this && this.__decorate || function(e, t, i, r) {
var o, n = arguments.length, s = n < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, i) : r;
if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, i, r); else for (var a = e.length - 1; a >= 0; a--) (o = e[a]) && (s = (n < 3 ? o(s) : n > 3 ? o(t, i, s) : o(t, i)) || s);
return n > 3 && s && Object.defineProperty(t, i, s), s;
};
Object.defineProperty(i, "__esModule", {
value: !0
});
i.CommonGameListDependencies_List_Trait = void 0;
var s = e("./CommonGameListDependenciesTrait"), a = "commonGameListDependenciesTraitList", c = function(e) {
o(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t._listSession = !0;
t._listTimer = -1;
t._listShowPageMethod = null;
t._traitReadyMap = {};
return t;
}
t.prototype.onActive = function(e) {
var t = this;
if (hs.tp.isHomePage_ProxyShowHomePageEvent(e)) {
if (!this._listSession) return;
this.disableTraits();
this.clearWaitTimer();
var i = this.getTraitList();
if (i.length <= 0) return;
if (!this.checkStorageMatched(i)) return;
if (this.isAllTraitsReady(i)) return;
e.replace = !0;
this._listShowPageMethod = e.originalCaller;
this._listTimer = setTimeoutSafe(function() {
t.clearTraitStorage();
if (t._listShowPageMethod) {
t._listShowPageMethod();
t._listShowPageMethod = null;
}
}, this.getTime());
}
};
t.prototype.data = function() {
var e = this;
return {
get uiReady() {
return e.listUiReady;
}
};
};
Object.defineProperty(t.prototype, "listUiReady", {
get: function() {
var e = this.getTraitList(), t = this.isAllTraitsReady(e);
if (!this._listSession) return !1;
this._listSession = t;
return t;
},
enumerable: !1,
configurable: !0
});
t.prototype.setState = function(e) {
var t = null == e ? void 0 : e.traitId, i = this.getTraitList();
if ("number" == typeof t && -1 !== i.indexOf(t)) {
this.saveTraitReady(i, t);
this.checkHomePage() ? this._listSession = !1 : this._traitReadyMap[t] = !0;
if (this.isAllTraitsReady(i)) {
if (this._listShowPageMethod) {
this._listShowPageMethod();
this._listShowPageMethod = null;
}
this.clearWaitTimer();
}
}
};
t.prototype.getReadyCount = function(e) {
var t = this;
return e.filter(function(e) {
return t._traitReadyMap[e];
}).length;
};
t.prototype.checkStorageMatched = function(e) {
var t = storage.getItem(a, null);
return !!(t && Array.isArray(t.ids) && t.readyMap) && !!this.isSameIdSet(t.ids, e) && e.every(function(e) {
return !0 === t.readyMap[e];
});
};
t.prototype.isAllTraitsReady = function(e) {
var t = this;
return !(e.length <= 0) && e.every(function(e) {
return !0 === t._traitReadyMap[e];
});
};
t.prototype.saveTraitReady = function(e, t) {
var i = storage.getItem(a, null);
i && Array.isArray(i.ids) && this.isSameIdSet(i.ids, e) || (i = {
ids: e.slice(),
readyMap: {}
});
i.readyMap[t] = !0;
storage.setItem(a, i);
};
t.prototype.isSameIdSet = function(e, t) {
if (e.length !== t.length) return !1;
var i = e.slice().sort(), r = t.slice().sort();
return i.every(function(e, t) {
return e === r[t];
});
};
t.prototype.clearTraitStorage = function() {
storage.remove(a);
};
t.prototype.clearWaitTimer = function() {
if (-1 !== this._listTimer) {
clearTimeout(this._listTimer);
this._listTimer = -1;
}
};
t.prototype.getTraitList = function() {
var e = this.props, t = null == e ? void 0 : e.traitList;
return Array.isArray(t) ? t.filter(function(e) {
return "number" == typeof e;
}) : [];
};
return n([ classId("CommonGameListDependenciesTrait", "List") ], t);
}(s.CommonGameListDependenciesTrait);
i.CommonGameListDependencies_List_Trait = c;
cc._RF.pop();
}, {
"./CommonGameListDependenciesTrait": "CommonGameListDependenciesTrait"
} ]
}, {}, [ "CommonGameListDependenciesTrait", "CommonGameListDependencies_List_Trait" ]);
//# sourceMappingURL=index.js.map
