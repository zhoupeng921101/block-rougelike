package o2;

import a1.b2.c3;
import android.content.SharedPreferences;
import o2.b;
import org.json.JSONObject;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class m {

    /* renamed from: b, reason: collision with root package name */
    private static m f4433b;

    /* renamed from: c, reason: collision with root package name */
    private static final g0 f4434c = g0.f(m.class.getSimpleName());

    /* renamed from: a, reason: collision with root package name */
    private b0 f4435a;

    private m() {
    }

    private void a() {
        try {
            f4434c.a("enqueueing config request");
            b bVar = new b(l0.y());
            bVar.g(b.c.l(e0.r()));
            e0.r().k().c(bVar);
        } catch (Throwable th) {
            f4434c.c("could not send and update local config from remote: " + l0.l(th));
        }
    }

    public static m c() {
        if (f4433b == null) {
            f4433b = new m();
        }
        return f4433b;
    }

    private long g() {
        try {
            return e0.r().l().getSharedPreferences("singular-pref-config-manager", 0).getLong("config_manager_config_request_last_enqueued", -1L);
        } catch (Throwable th) {
            f4434c.a(c3.d4(1002) + l0.l(th));
            return -1L;
        }
    }

    private b0 i() {
        try {
            String string = e0.r().l().getSharedPreferences("singular-pref-config-manager", 0).getString("config_manager_config", null);
            if (!l0.V(string)) {
                return new b0(new JSONObject(string));
            }
            f4434c.c("local config is empty or null. returning default config");
            return b0.b();
        } catch (Throwable th) {
            f4434c.c("failed loading config from shared pref with error: " + l0.l(th));
            return b0.b();
        }
    }

    private void l() {
        n(-1L);
    }

    private void m(b0 b0Var, e0 e0Var) {
        try {
            SharedPreferences.Editor edit = e0Var.l().getSharedPreferences("singular-pref-config-manager", 0).edit();
            edit.putString("config_manager_config", b0Var.h().toString());
            edit.commit();
        } catch (Throwable th) {
            f4434c.c("could not save config locally: " + l0.l(th));
        }
    }

    private void n(long j4) {
        try {
            SharedPreferences.Editor edit = e0.r().l().getSharedPreferences("singular-pref-config-manager", 0).edit();
            edit.putLong("config_manager_config_request_last_enqueued", j4);
            edit.commit();
        } catch (Throwable th) {
            f4434c.a("failed to persist is config enqueued " + l0.l(th));
        }
    }

    public int b() {
        b0 b0Var = this.f4435a;
        return b0Var != null ? b0Var.c() : b0.b().c();
    }

    public String d() {
        b0 b0Var = this.f4435a;
        if (b0Var != null && !l0.V(b0Var.d())) {
            return this.f4435a.d();
        }
        g0 g0Var = f4434c;
        StringBuilder sb = new StringBuilder();
        sb.append("getResolvedSdid: returning null, ");
        sb.append(this.f4435a == null ? "config == null" : "SDID is EmptyOrNull");
        g0Var.a(sb.toString());
        return null;
    }

    public boolean e() {
        b0 b0Var = this.f4435a;
        return b0Var != null ? b0Var.e() : b0.b().e();
    }

    public boolean f() {
        b0 b0Var = this.f4435a;
        return b0Var != null ? b0Var.f() : b0.b().f();
    }

    public boolean h() {
        b0 b0Var = this.f4435a;
        return b0Var != null ? b0Var.g() : b0.b().g();
    }

    public void j(String str) {
        f4434c.c(str);
    }

    public void k(b0 b0Var, e0 e0Var) {
        if (b0Var != null) {
            try {
                this.f4435a = b0Var;
                m(b0Var, e0Var);
                l();
            } catch (Throwable th) {
                f4434c.c("failed to handle config on success: " + l0.l(th));
            }
        }
    }

    public synchronized void o() {
        this.f4435a = i();
        if (g() < 0) {
            a();
            n(l0.y());
        }
    }
}
