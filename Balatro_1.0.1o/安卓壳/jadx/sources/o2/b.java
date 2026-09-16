package o2;

import a1.b2.c3;
import java.util.concurrent.Executors;
import o2.a;
import org.json.JSONException;
import org.json.JSONObject;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class b extends i {

    /* renamed from: g, reason: collision with root package name */
    private static final g0 f4291g = g0.f(b.class.getSimpleName());

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        final /* synthetic */ e0 f4292e;

        a(e0 e0Var) {
            this.f4292e = e0Var;
        }

        @Override // java.lang.Runnable
        public void run() {
            try {
                e0 e0Var = this.f4292e;
                if (e0Var == null) {
                    b.f4291g.a("can't invoke sdid handlers - singular instance is null");
                } else if (e0Var.z() == null) {
                    b.f4291g.a("can't invoke sdid handlers - singular config is null");
                } else {
                    b.f4291g.a("can't invoke sdid handlers - SDID accessor handler is null");
                }
            } catch (Throwable th) {
                b.f4291g.a("invoking sdid accessor handlers handlers failed with error: " + l0.l(th));
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: o2.b$b, reason: collision with other inner class name */
    public class C0064b implements a.InterfaceC0063a {
        public C0064b() {
        }

        @Override // o2.a.InterfaceC0063a
        public boolean a(e0 e0Var, int i4, String str) {
            if (i4 != 200 || l0.V(str)) {
                m.c().j("invalid remote config response");
                return false;
            }
            try {
                m.c().k(new b0(new JSONObject(str)), e0Var);
                b.this.s(e0Var);
                return true;
            } catch (JSONException e4) {
                b.f4291g.c(l0.l(e4));
                m.c().j(l0.l(e4));
                return false;
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class c extends i0 {
        private c() {
        }

        static c l(e0 e0Var) {
            return new c().o(e0Var).m(e0Var).n(e0Var.z());
        }

        private c o(e0 e0Var) {
            put(c3.d4(1464), l0.I(e0Var));
            return this;
        }

        protected c m(e0 e0Var) {
            super.i(e0Var);
            return this;
        }

        protected c n(n2.b bVar) {
            super.k(bVar);
            return this;
        }
    }

    public b(long j4) {
        super("CONFIG", j4);
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void s(e0 e0Var) {
        Executors.newSingleThreadExecutor().execute(new a(e0Var));
    }

    @Override // o2.i, o2.a
    public /* bridge */ /* synthetic */ boolean a(e0 e0Var) {
        return super.a(e0Var);
    }

    @Override // o2.a
    public a.InterfaceC0063a b() {
        return new C0064b();
    }

    @Override // o2.a
    public String c() {
        return "/config";
    }

    @Override // o2.i, o2.a
    public /* bridge */ /* synthetic */ long e() {
        return super.e();
    }

    @Override // o2.i
    public /* bridge */ /* synthetic */ String k() {
        return super.k();
    }

    @Override // o2.i
    public /* bridge */ /* synthetic */ boolean l() {
        return super.l();
    }

    @Override // o2.i
    public /* bridge */ /* synthetic */ String n() {
        return super.n();
    }
}
