package o2;

import a1.b2.c3;
import o2.a;
import org.json.JSONException;
import org.json.JSONObject;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class h extends i {

    /* renamed from: g, reason: collision with root package name */
    private static final g0 f4382g = g0.f(h.class.getSimpleName());

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public class a implements a.InterfaceC0063a {
        public a() {
        }

        @Override // o2.a.InterfaceC0063a
        public boolean a(e0 e0Var, int i4, String str) {
            if (i4 == 413) {
                return true;
            }
            if (i4 != 200) {
                return false;
            }
            try {
            } catch (JSONException e4) {
                h.f4382g.d("error in handle()", e4);
            }
            return new JSONObject(str).optString("status", "").equalsIgnoreCase("ok");
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class b extends i0 {
        private b() {
        }

        static b l(c cVar, e0 e0Var) {
            return new b().o(cVar.f4384a).n(cVar.f4385b).p((cVar.f4386c - r0) * 0.001d).r(e0Var.x().i()).q(e0Var.x().h()).s(e0Var.z()).m(e0Var);
        }

        private b n(String str) {
            try {
                boolean V = l0.V(str);
                String d4 = c3.d4(1423);
                if (V) {
                    str = new JSONObject().put(d4, false).toString();
                } else {
                    JSONObject jSONObject = new JSONObject(str);
                    if (!jSONObject.optBoolean(d4, false)) {
                        str = jSONObject.put(d4, false).toString();
                    }
                }
                put("e", str);
                return this;
            } catch (JSONException e4) {
                h.f4382g.d("Error in JSON serialization", e4);
                return this;
            }
        }

        private b o(String str) {
            put("n", str);
            return this;
        }

        private b p(double d4) {
            put("t", String.valueOf(d4));
            return this;
        }

        private b q(long j4) {
            put("seq", String.valueOf(j4));
            return this;
        }

        private b r(long j4) {
            put("s", String.valueOf(j4));
            return this;
        }

        protected b m(e0 e0Var) {
            super.i(e0Var);
            put("av", e0Var.n().f4465m);
            put("sdk", l0.I(e0Var));
            put(c3.d4(896), e0Var.n().R);
            return this;
        }

        protected b s(n2.b bVar) {
            super.k(bVar);
            return this;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class c {

        /* renamed from: a, reason: collision with root package name */
        final String f4384a;

        /* renamed from: b, reason: collision with root package name */
        final String f4385b;

        /* renamed from: c, reason: collision with root package name */
        final long f4386c;

        c(String str, String str2) {
            this.f4384a = str.replace("\\n", "");
            this.f4385b = !l0.V(str2) ? str2.replace("\\n", "") : null;
            this.f4386c = l0.y();
        }

        public String toString() {
            return c3.d4(348) + c3.d4(1133) + this.f4384a + "', extra='" + this.f4385b + "', timestamp=" + this.f4386c + '}';
        }
    }

    h(long j4) {
        super("EVENT", j4);
    }

    @Override // o2.i, o2.a
    public /* bridge */ /* synthetic */ boolean a(e0 e0Var) {
        return super.a(e0Var);
    }

    @Override // o2.a
    public a.InterfaceC0063a b() {
        return new a();
    }

    @Override // o2.a
    public String c() {
        return c3.d4(897);
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
