package n2;

import a1.b2.c3;
import android.content.Context;
import java.io.IOException;
import java.lang.reflect.Method;
import java.util.Map;
import o2.e0;
import o2.g0;
import o2.l0;
import o2.z;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a {

    /* renamed from: b, reason: collision with root package name */
    private static e0 f4251b;

    /* renamed from: a, reason: collision with root package name */
    private static final g0 f4250a = g0.f(a.class.getSimpleName());

    /* renamed from: c, reason: collision with root package name */
    private static boolean f4252c = false;

    public static boolean a(String str, String str2, double d4) {
        return f(str, "pcc", str2, "r", Double.valueOf(d4), "is_revenue_event", Boolean.TRUE);
    }

    public static boolean b(String str, String str2, double d4, Object obj) {
        return c(str, str2, d4, obj, null);
    }

    public static boolean c(String str, String str2, double d4, Object obj, Map map) {
        if (obj != null && obj.getClass().getName().equals("com.android.billingclient.api.Purchase")) {
            try {
                Class<?> cls = obj.getClass();
                Object h4 = h(obj);
                String str3 = (String) cls.getDeclaredMethod("getOriginalJson", null).invoke(obj, null);
                String str4 = (String) cls.getDeclaredMethod("getSignature", null).invoke(obj, null);
                if (map != null) {
                    try {
                        JSONObject jSONObject = new JSONObject(map);
                        jSONObject.put("pcc", str2);
                        jSONObject.put("r", d4);
                        jSONObject.put("is_revenue_event", true);
                        jSONObject.put("receipt", str3);
                        jSONObject.put("receipt_signature", str4);
                        jSONObject.put("pk", h4);
                        return g(str, jSONObject);
                    } catch (JSONException e4) {
                        f4250a.c(l0.l(e4));
                    }
                }
                return f(str, "pcc", str2, "r", Double.valueOf(d4), "pk", h4, "receipt", str3, "receipt_signature", str4, "is_revenue_event", Boolean.TRUE);
            } catch (Throwable th) {
                f4250a.d("customRevenue has encountered an unexpected exception. Please verify that the 'purchase' object is of type 'com.android.billingclient.api.Purchase'", th);
            }
        }
        return d(str, str2, d4, map);
    }

    public static boolean d(String str, String str2, double d4, Map map) {
        if (map != null) {
            try {
                JSONObject jSONObject = new JSONObject(map);
                jSONObject.put("pcc", str2);
                jSONObject.put("r", d4);
                jSONObject.put("is_revenue_event", true);
                return g(str, jSONObject);
            } catch (JSONException e4) {
                f4250a.c(l0.l(e4));
            }
        }
        return a(str, str2, d4);
    }

    public static boolean e(String str) {
        try {
            if (!j()) {
                return false;
            }
            if (!l0.V(str)) {
                return f4251b.K(str);
            }
            f4250a.c("Event name can not be null or empty");
            return false;
        } catch (Throwable th) {
            f4250a.c(l0.l(th));
            return false;
        }
    }

    public static boolean f(String str, Object... objArr) {
        try {
            if (!j()) {
                return false;
            }
            if (l0.V(str)) {
                f4250a.c("Event name can not be null or empty");
                return false;
            }
            if (objArr.length % 2 != 0) {
                f4250a.c("Extra arguments must be in even numbers.");
                return false;
            }
            try {
                JSONObject jSONObject = new JSONObject();
                for (int i4 = 0; i4 < objArr.length; i4 += 2) {
                    jSONObject.put((String) objArr[i4], objArr[i4 + 1]);
                }
                return g(str, jSONObject);
            } catch (JSONException e4) {
                f4250a.d("error in serializing extra args", e4);
                return false;
            }
        } catch (Throwable th) {
            f4250a.d("Exception", th);
        }
    }

    public static boolean g(String str, JSONObject jSONObject) {
        try {
            if (!j()) {
                return false;
            }
            if (!l0.V(str)) {
                return f4251b.L(str, jSONObject != null ? jSONObject.toString() : null);
            }
            f4250a.c("Event name can not be null or empty");
            return false;
        } catch (Throwable th) {
            f4250a.d("Exception", th);
            return false;
        }
    }

    private static Object h(Object obj) {
        Method z3 = l0.z(obj, c3.d4(298), new Class[0]);
        if (z3 != null) {
            return new JSONArray(z3.invoke(obj, null).toString());
        }
        Method z4 = l0.z(obj, "getSku", new Class[0]);
        if (z4 != null) {
            return (String) z4.invoke(obj, null);
        }
        Method z5 = l0.z(obj, "getSkus", new Class[0]);
        if (z5 != null) {
            return new JSONArray(z5.invoke(obj, null).toString());
        }
        return null;
    }

    public static boolean i(Context context, b bVar) {
        try {
        } catch (IOException e4) {
            g0 g0Var = f4250a;
            g0Var.a("Failed to init() Singular SDK");
            g0Var.c(l0.l(e4));
            f4251b = null;
        } catch (Throwable th) {
            f4250a.c(l0.l(th));
        }
        if (context == null || bVar == null) {
            g0 g0Var2 = f4250a;
            StringBuilder sb = new StringBuilder();
            sb.append("SDK initialization failed: ");
            sb.append(context == null ? "context == null " : "");
            sb.append(bVar == null ? "config == null" : "");
            sb.append(". Please provide a valid Context, SingularConfig.");
            g0Var2.c(sb.toString());
            return false;
        }
        f4252c = f4251b != null;
        if (bVar.f4253a.endsWith("_sl")) {
            l0.n0(bVar.f4253a);
        }
        f4251b = e0.s(context, b.a(bVar));
        if (!f4252c) {
            f4250a.a("singular instance is not initialized. start will be sent from session manager.");
        } else if (z.e().h(bVar.f4274v, bVar.f4275w).booleanValue()) {
            z.e().b();
            f4251b.Y();
        } else {
            f4251b.X();
        }
        return j();
    }

    private static boolean j() {
        if (f4251b != null) {
            return true;
        }
        f4250a.c("Singular not initialized. You must call Singular.init() ");
        return false;
    }

    public static boolean k(String str, double d4, Object obj) {
        return b("__iap__", str, d4, obj);
    }
}
