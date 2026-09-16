package o2;

import a1.b2.c3;
import android.content.Context;
import android.content.SharedPreferences;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class o {

    /* renamed from: e, reason: collision with root package name */
    private static o f4442e;

    /* renamed from: f, reason: collision with root package name */
    private static final g0 f4443f = g0.f(o.class.getSimpleName());

    /* renamed from: b, reason: collision with root package name */
    private a f4445b;

    /* renamed from: c, reason: collision with root package name */
    private a f4446c;

    /* renamed from: a, reason: collision with root package name */
    private a f4444a = null;

    /* renamed from: d, reason: collision with root package name */
    private boolean f4447d = false;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class a {

        /* renamed from: a, reason: collision with root package name */
        private final String f4448a;

        /* renamed from: b, reason: collision with root package name */
        private final EnumC0069a f4449b;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        /* renamed from: o2.o$a$a, reason: collision with other inner class name */
        public enum EnumC0069a {
            custom,
            resolved
        }

        a(String str, EnumC0069a enumC0069a) {
            this.f4448a = str;
            this.f4449b = enumC0069a;
        }

        public EnumC0069a a() {
            return this.f4449b;
        }

        public String b() {
            return this.f4448a;
        }
    }

    public static o c() {
        if (f4442e == null) {
            f4442e = new o();
        }
        return f4442e;
    }

    private a f(m mVar, Context context) {
        try {
            if (context == null) {
                f4443f.a("failed to pick actual sdid model because context is null");
                return null;
            }
            SharedPreferences sharedPreferences = context.getSharedPreferences("singular-pref-session", 0);
            String string = sharedPreferences.getString("custom-sdid", null);
            if (!l0.V(string)) {
                f4443f.a("returning persisted custom sdid from prefs");
                return new a(string, a.EnumC0069a.custom);
            }
            String string2 = sharedPreferences.getString("pref-singular-device-id", null);
            if (!l0.V(string2)) {
                f4443f.a("returning persisted resolved sdid from prefs");
                return new a(string2, a.EnumC0069a.resolved);
            }
            boolean j4 = j();
            boolean h4 = mVar.h();
            if (j4 && h4) {
                g0 g0Var = f4443f;
                g0Var.a("persisting custom set sdid to prefs");
                SharedPreferences.Editor edit = sharedPreferences.edit();
                edit.putString("custom-sdid", this.f4444a.b());
                edit.commit();
                g0Var.a("returning custom set sdid");
                return this.f4444a;
            }
            String d4 = mVar.d();
            if (l0.V(d4)) {
                f4443f.a("returning null - can't pick an actual valid SDID.");
                return null;
            }
            g0 g0Var2 = f4443f;
            g0Var2.a("persisting resolved sdid to prefs");
            SharedPreferences.Editor edit2 = sharedPreferences.edit();
            edit2.putString("pref-singular-device-id", d4);
            edit2.commit();
            g0Var2.a("returning resolved sdid from config");
            return new a(d4, a.EnumC0069a.resolved);
        } catch (Throwable th) {
            f4443f.c("caught throwable during pick actual sdid model. returning null: " + l0.l(th));
            return null;
        }
    }

    private void g(e0 e0Var) {
        if (b(m.c(), e0Var.l()) != null) {
            f4443f.a("ignoring set candidate custom sdid because one exists.");
            return;
        }
        String str = e0Var.z().f4273u;
        if (l0.V(str)) {
            this.f4444a = null;
            f4443f.a(c3.d4(86));
            return;
        }
        this.f4444a = new a(str, a.EnumC0069a.custom);
        f4443f.a("setting candidate custom sdid: " + str);
    }

    boolean a(Context context) {
        try {
            if (this.f4447d) {
                return true;
            }
            boolean z3 = context.getSharedPreferences("singular-pref-session", 0).getBoolean("DID_SEND_START_SESSION_WITH_SDID", false);
            this.f4447d = z3;
            return z3;
        } catch (Throwable unused) {
            f4443f.a(c3.d4(1343));
            return false;
        }
    }

    public a b(m mVar, Context context) {
        if (this.f4446c == null) {
            f4443f.a("current sdid is null, trying to pick actual sdid model");
            this.f4446c = f(mVar, context);
        }
        return this.f4446c;
    }

    public boolean d(Context context) {
        a b4 = b(m.c(), context);
        boolean z3 = this.f4445b == null && b4 != null;
        this.f4445b = b4;
        g0 g0Var = f4443f;
        StringBuilder sb = new StringBuilder();
        sb.append("is fresh sdid = ");
        sb.append(z3 ? "true" : "false");
        g0Var.a(sb.toString());
        return z3;
    }

    void e(Context context) {
        this.f4445b = b(m.c(), context);
        f4443f.a("loaded previous sdid for comparison");
    }

    void h(Context context) {
        try {
            f4443f.a("setting pref did send start session with SDID to true");
            this.f4447d = true;
            SharedPreferences.Editor edit = context.getSharedPreferences("singular-pref-session", 0).edit();
            edit.putBoolean("DID_SEND_START_SESSION_WITH_SDID", this.f4447d);
            edit.commit();
        } catch (Throwable unused) {
            f4443f.a("failed setting pref did send start session with SDID");
        }
    }

    public void i(e0 e0Var) {
        e(e0Var.l());
        c().g(e0Var);
    }

    public boolean j() {
        return this.f4444a != null;
    }
}
