package o2;

import a1.b2.c3;
import java.io.IOException;
import java.util.HashMap;
import java.util.InvalidPropertiesFormatException;
import java.util.Iterator;
import java.util.Map;
import o2.n;
import org.json.JSONException;
import org.json.JSONObject;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class i extends h0 implements a {

    /* renamed from: f, reason: collision with root package name */
    private static final g0 f4387f = g0.f(i.class.getSimpleName());

    /* renamed from: e, reason: collision with root package name */
    protected boolean f4388e = false;

    public i(String str, long j4) {
        put("__TYPE__", str);
        put(c3.d4(1085), String.valueOf(j4));
    }

    public static i h(String str) {
        if (str == null) {
            throw new NullPointerException(c3.d4(1337));
        }
        Map i4 = i(str);
        String str2 = (String) i4.get("__TYPE__");
        String str3 = (String) i4.get("__TIMESTAMP__");
        long parseLong = !l0.V(str3) ? Long.parseLong(str3) : -1L;
        int s3 = l0.s(e0.r().l(), str3);
        if (s3 > 0) {
            i4.put("rc", String.valueOf(s3));
        }
        if ("CONFIG".equalsIgnoreCase(str2)) {
            b bVar = new b(parseLong);
            bVar.g(i4);
            return bVar;
        }
        if (c3.d4(842).equalsIgnoreCase(str2)) {
            h hVar = new h(parseLong);
            hVar.g(i4);
            return hVar;
        }
        if ("SESSION_START".equalsIgnoreCase(str2)) {
            g gVar = new g(parseLong);
            gVar.g(i4);
            return gVar;
        }
        if ("GDPR_CONSENT".equalsIgnoreCase(str2)) {
            d dVar = new d(parseLong);
            dVar.g(i4);
            return dVar;
        }
        if (c3.d4(389).equalsIgnoreCase(str2)) {
            e eVar = new e(parseLong);
            eVar.g(i4);
            return eVar;
        }
        if (!"CUSTOM_USER_ID".equalsIgnoreCase(str2)) {
            throw new InvalidPropertiesFormatException(String.format("Unknown type = %s", str2));
        }
        c cVar = new c(parseLong);
        cVar.g(i4);
        return cVar;
    }

    private static Map i(String str) {
        try {
            JSONObject jSONObject = new JSONObject(str);
            HashMap hashMap = new HashMap();
            Iterator<String> keys = jSONObject.keys();
            while (keys.hasNext()) {
                String next = keys.next();
                hashMap.put(next, (String) jSONObject.get(next));
            }
            return hashMap;
        } catch (JSONException e4) {
            throw new IOException(e4);
        }
    }

    public boolean a(e0 e0Var) {
        o(e0Var);
        p(e0Var);
        m(e0Var);
        return j0.g(e0Var, k(), j(), e(), b());
    }

    /* JADX WARN: Multi-variable type inference failed */
    public long e() {
        String str = (String) get(c3.d4(1186));
        if (l0.V(str)) {
            return -1L;
        }
        return Long.parseLong(str);
    }

    void g(Map map) {
        if (map == null) {
            f4387f.a("addParams: params is null, skipping");
        } else {
            putAll(map);
        }
    }

    Map j() {
        HashMap hashMap = new HashMap(this);
        hashMap.remove("__TYPE__");
        hashMap.remove("__TIMESTAMP__");
        return hashMap;
    }

    public String k() {
        return c3.d4(999) + c();
    }

    /* JADX WARN: Multi-variable type inference failed */
    public boolean l() {
        try {
            String str = (String) get("e");
            if (str != null) {
                return new JSONObject(str).getBoolean("is_admon_revenue");
            }
            return false;
        } catch (Throwable th) {
            f4387f.a("Not an admon event: " + th.getMessage());
            return false;
        }
    }

    /* JADX WARN: Type inference failed for: r9v3, types: [boolean, int] */
    void m(e0 e0Var) {
        boolean z3;
        n2.b z4 = e0Var.z();
        if (z4 == null) {
            f4387f.a("sanitizeRequestIfNeeded: config null. skipping.");
            return;
        }
        if (!z4.f4272t.booleanValue()) {
            f4387f.a("sanitizeRequestIfNeeded: not needed. skipping.");
            return;
        }
        if (!containsKey("k")) {
            f4387f.a("sanitizeRequestIfNeeded: no k param in request. skipping.");
            return;
        }
        String str = (String) get("k");
        if (l0.V(str)) {
            f4387f.a("sanitizeRequestIfNeeded: no &k= value. skipping.");
            return;
        }
        boolean z5 = false;
        if (n.a.f4441b.contains(str)) {
            f4387f.a(c3.d4(843) + str + " and &u= params.");
            remove("k");
            remove("u");
            z3 = true;
        } else {
            z3 = false;
        }
        for (String str2 : n.a.f4440a) {
            if (containsKey(str2)) {
                f4387f.a("sanitizeRequestIfNeeded: limited identifier found, removing param &" + str2);
                remove(str2);
                z5 = true;
            }
        }
        if (z3 || z5) {
            f4387f.a("sanitizeRequestIfNeeded: updating request params from withDeviceInfo according to current state of limitAdvertisingIdentifiers.");
            putAll(new i0().j(e0Var, this.f4388e));
        }
        ?? booleanValue = z4.f4272t.booleanValue();
        int i4 = booleanValue;
        if (z3) {
            i4 = booleanValue + 2;
        }
        if (z5) {
            i4 += 4;
        }
        put("lim", String.valueOf(i4));
        f4387f.a(c3.d4(445) + i4);
    }

    public String n() {
        return new JSONObject(this).toString();
    }

    void o(e0 e0Var) {
        try {
            if (o.c().b(m.c(), e0Var.l()) == null) {
                put("mg", "0");
                f4387f.a("BaseApi: no SDID model available in device id manager, skipping migration.");
                return;
            }
            if (((String) j().get("k")).equalsIgnoreCase("sdid")) {
                put("mg", "1");
                f4387f.a("BaseApi: not migrated, this api already has k=SDID, skipping migration.");
            } else if (!this.f4388e && !o.c().a(e0Var.l())) {
                put("mg", "3");
                f4387f.a("BaseApi: no session sent with SDID yet, skipping migration.");
            } else {
                putAll(new i0().j(e0Var, this.f4388e));
                put("mg", "2");
                f4387f.a("BaseApi: migrated api to k=SDID");
            }
        } catch (Throwable unused) {
            put("mg", c3.d4(1468));
            f4387f.c("BaseApi: failed to migrate event to SDID");
        }
    }

    void p(e0 e0Var) {
        try {
            if (j().containsKey("k")) {
                f4387f.a("BaseApi: this api already has 'k' param, skipping updating k and u");
                return;
            }
            f4387f.a("BaseApi: this api has no 'k' param, try updating the k and u");
            putAll(new i0().j(e0Var, this.f4388e));
            put("msk", "0");
        } catch (Throwable th) {
            f4387f.c(c3.d4(1134) + l0.l(th));
            put("msk", "1");
        }
    }
}
