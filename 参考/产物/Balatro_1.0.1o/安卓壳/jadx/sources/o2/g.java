package o2;

import a1.b2.c3;
import android.net.Uri;
import java.util.HashMap;
import o2.a;
import o2.h;
import o2.t;
import org.json.JSONException;
import org.json.JSONObject;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class g extends i {

    /* renamed from: h, reason: collision with root package name */
    private static final g0 f4367h = g0.f(g.class.getSimpleName());

    /* renamed from: g, reason: collision with root package name */
    private int f4368g;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public class a implements a.InterfaceC0063a {

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        /* renamed from: o2.g$a$a, reason: collision with other inner class name */
        class RunnableC0065a implements Runnable {

            /* renamed from: e, reason: collision with root package name */
            final /* synthetic */ e0 f4370e;

            /* renamed from: f, reason: collision with root package name */
            final /* synthetic */ String f4371f;

            /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
            /* renamed from: o2.g$a$a$a, reason: collision with other inner class name */
            class C0066a extends t.a {

                /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
                /* renamed from: o2.g$a$a$a$a, reason: collision with other inner class name */
                class RunnableC0067a implements Runnable {

                    /* renamed from: e, reason: collision with root package name */
                    final /* synthetic */ int f4374e;

                    /* renamed from: f, reason: collision with root package name */
                    final /* synthetic */ String f4375f;

                    /* renamed from: g, reason: collision with root package name */
                    final /* synthetic */ String f4376g;

                    RunnableC0067a(int i4, String str, String str2) {
                        this.f4374e = i4;
                        this.f4375f = str;
                        this.f4376g = str2;
                    }

                    @Override // java.lang.Runnable
                    public void run() {
                        try {
                            if (!a.this.d(this.f4374e) && g.this.f4368g < 3) {
                                Thread.sleep(g.this.f4368g * 3000);
                                RunnableC0065a runnableC0065a = RunnableC0065a.this;
                                a.this.e(runnableC0065a.f4370e, runnableC0065a.f4371f);
                            } else {
                                JSONObject jSONObject = new JSONObject();
                                jSONObject.put("responseCode", String.valueOf(this.f4374e));
                                jSONObject.put("signedData", this.f4375f);
                                jSONObject.put("signature", this.f4376g);
                                RunnableC0065a.this.f4370e.J(new h.c("__LicensingStatus", jSONObject.toString()));
                            }
                        } catch (Throwable th) {
                            g.f4367h.d("Error occurred while trying to send licensing status event", th);
                        }
                    }
                }

                C0066a() {
                }

                @Override // o2.t.a
                public void a(int i4, String str, String str2) {
                    new Thread(new RunnableC0067a(i4, str, str2)).start();
                }
            }

            RunnableC0065a(e0 e0Var, String str) {
                this.f4370e = e0Var;
                this.f4371f = str;
            }

            @Override // java.lang.Runnable
            public void run() {
                g.s(g.this);
                t.a(this.f4370e.l(), new C0066a());
            }
        }

        public a() {
        }

        /* JADX INFO: Access modifiers changed from: private */
        public boolean d(int i4) {
            return (i4 == -1 || i4 == 257 || i4 == 4) ? false : true;
        }

        /* JADX WARN: Multi-variable type inference failed */
        @Override // o2.a.InterfaceC0063a
        public boolean a(e0 e0Var, int i4, String str) {
            String str2;
            if (i4 != 200) {
                return false;
            }
            try {
                JSONObject jSONObject = new JSONObject(str);
                if (!jSONObject.optString("status", "").equalsIgnoreCase("ok")) {
                    return false;
                }
                if (g.this.containsKey("k") && ((String) g.this.get("k")).equalsIgnoreCase("SDID") && !o.c().a(e0Var.l())) {
                    o.c().h(e0Var.l());
                }
                String optString = jSONObject.optString("ddl", null);
                String optString2 = jSONObject.optString("deferred_passthrough", null);
                if (!l0.b0() && (!l0.V(optString) || !l0.V(optString2))) {
                    c(e0Var, optString, optString2);
                }
                String optString3 = jSONObject.optString("resolved_singular_link", null);
                if (!l0.V(optString3) && (str2 = (String) g.this.get("singular_link_resolve_required")) != null && Boolean.parseBoolean(str2) && l0.f0(g.this.e()) < e0.r().z().f4265m) {
                    l0.O(Uri.parse(optString3));
                }
                JSONObject optJSONObject = jSONObject.optJSONObject("attribution_info");
                if (optJSONObject != null) {
                    e0Var.A(optJSONObject);
                }
                String str3 = (String) g.this.get("u");
                if (l0.V(str3) || l0.Y(e0Var.l(), str3)) {
                    return true;
                }
                l0.l0(e0Var.l(), str3);
                e(e0Var, str3);
                return true;
            } catch (JSONException e4) {
                g.f4367h.d("error in handle()", e4);
                return false;
            }
        }

        void c(e0 e0Var, String str, String str2) {
            e0Var.z().getClass();
            g.f4367h.e("DDLHandler is not configured, ignoring callback for url = %s", str);
        }

        void e(e0 e0Var, String str) {
            g.f4367h.a("Trying to fetch license key from the Licensing Service");
            new Thread(new RunnableC0065a(e0Var, str)).start();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class b extends i0 {
        private b() {
        }

        static b l(long j4, e0 e0Var) {
            return new b().p(j4).r(e0Var.z()).o(e0Var).m(e0Var).q(e0Var).n(e0Var).s();
        }

        private b m(e0 e0Var) {
            if (e0Var.t()) {
                put("is", "true");
                return this;
            }
            put("is", "false");
            return this;
        }

        private b n(e0 e0Var) {
            if (e0Var.t() & (e0Var.m() != null)) {
                put("dt_referrer", e0Var.m());
            }
            return this;
        }

        private b p(long j4) {
            put(c3.d4(30), String.valueOf(j4));
            return this;
        }

        private b q(e0 e0Var) {
            if (e0Var.t()) {
                if (e0Var.p() != null) {
                    put(c3.d4(1422), new JSONObject(e0Var.p()).toString());
                }
                put("install_ref_timeinterval", String.valueOf(e0Var.q()));
                HashMap hashMap = new HashMap();
                if (e0Var.w() != null) {
                    hashMap.putAll(e0Var.w());
                }
                if (e0Var.v() != null) {
                    hashMap.putAll(e0Var.v());
                }
                put("referrer_data", new JSONObject(hashMap).toString());
            }
            return this;
        }

        private b s() {
            put(c3.d4(532), String.valueOf(l0.p()));
            put(c3.d4(1336), String.valueOf(l0.o()));
            String A = l0.A();
            if (!l0.V(A)) {
                put("ek", A);
            }
            return this;
        }

        /* JADX WARN: Code restructure failed: missing block: B:26:0x0067, code lost:
        
            if (r0.f4460h != false) goto L6;
         */
        /* JADX WARN: Code restructure failed: missing block: B:4:0x005d, code lost:
        
            if (r0.f4460h != false) goto L6;
         */
        /* JADX WARN: Code restructure failed: missing block: B:5:0x005f, code lost:
        
            r1 = "1";
         */
        /*
            Code decompiled incorrectly, please refer to instructions dump.
            To view partially-correct add '--show-bad-code' argument
        */
        protected o2.g.b o(o2.e0 r4) {
            /*
                Method dump skipped, instructions count: 307
                To view this dump add '--comments-level debug' option
            */
            throw new UnsupportedOperationException("Method not decompiled: o2.g.b.o(o2.e0):o2.g$b");
        }

        protected b r(n2.b bVar) {
            super.k(bVar);
            Uri uri = bVar.f4256d;
            if (r2.b.a(uri)) {
                put("ref", uri.getQueryParameter("referrer"));
                put("extra", uri.getQuery());
            }
            Uri uri2 = bVar.f4264l;
            if (z.e().d().booleanValue()) {
                uri2 = z.e().f();
                put("pu", "1");
            }
            put("ddl_enabled", "false");
            if (r2.b.a(uri2)) {
                String queryParameter = uri2.getQueryParameter("referrer");
                String query = uri2.getQuery();
                if (!l0.V(queryParameter)) {
                    put("ref", queryParameter);
                }
                if (!l0.V(query)) {
                    put("extra", query);
                }
                if (l0.U(uri2)) {
                    put("esp_link", uri2.toString());
                    uri2 = l0.i0(uri2);
                }
                if (l0.q0(uri2)) {
                    boolean c02 = l0.c0(uri2);
                    if (!c02) {
                        l0.O(uri2);
                    }
                    put(c3.d4(82), uri2.toString());
                    put("singular_link_resolve_timeout", String.valueOf(bVar.f4265m));
                    put(c3.d4(299), String.valueOf(c02));
                }
                bVar.f4264l = null;
            }
            return this;
        }
    }

    g(long j4) {
        super(c3.d4(1132), j4);
        this.f4368g = 0;
        this.f4388e = true;
    }

    static /* synthetic */ int s(g gVar) {
        int i4 = gVar.f4368g;
        gVar.f4368g = i4 + 1;
        return i4;
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
        return c3.d4(1506);
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
