package o2;

import a1.b2.c3;
import com.android.support.BuildConfig;
import org.json.JSONObject;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class b0 {

    /* renamed from: d, reason: collision with root package name */
    private static final g0 f4295d = g0.f(b0.class.getSimpleName());

    /* renamed from: a, reason: collision with root package name */
    private a f4296a;

    /* renamed from: b, reason: collision with root package name */
    private boolean f4297b;

    /* renamed from: c, reason: collision with root package name */
    private b f4298c;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class a {

        /* renamed from: a, reason: collision with root package name */
        private boolean f4299a;

        /* renamed from: b, reason: collision with root package name */
        private boolean f4300b;

        /* renamed from: c, reason: collision with root package name */
        private int f4301c;

        a(JSONObject jSONObject) {
            this.f4299a = false;
            this.f4300b = false;
            this.f4301c = 0;
            try {
                this.f4299a = jSONObject.optBoolean("AggregateAdmonEvents", false);
                this.f4300b = jSONObject.optBoolean(BuildConfig.BUILD_TYPE, false);
                this.f4301c = Math.max(0, jSONObject.optInt("AggregateAdmonMinIntervalSeconds", 0));
            } catch (Throwable th) {
                b0.f4295d.c("failed parsing admon batching json with error: " + l0.l(th));
            }
        }

        public int a() {
            return this.f4301c;
        }

        public boolean b() {
            return this.f4299a;
        }

        public boolean c() {
            return this.f4300b;
        }

        public JSONObject d() {
            try {
                JSONObject jSONObject = new JSONObject();
                jSONObject.put("AggregateAdmonEvents", this.f4299a);
                jSONObject.put(BuildConfig.BUILD_TYPE, this.f4300b);
                jSONObject.put("AggregateAdmonMinIntervalSeconds", this.f4301c);
                return jSONObject;
            } catch (Throwable th) {
                b0.f4295d.c("failed to create json object with error: " + l0.l(th));
                return new JSONObject();
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class b {

        /* renamed from: a, reason: collision with root package name */
        private String f4302a;

        public b(JSONObject jSONObject) {
            try {
                if (jSONObject.has("sdid")) {
                    this.f4302a = jSONObject.getString("sdid");
                }
            } catch (Throwable th) {
                b0.f4295d.c(c3.d4(895) + l0.l(th));
            }
        }

        public String a() {
            return this.f4302a;
        }

        public JSONObject b() {
            try {
                JSONObject jSONObject = new JSONObject();
                if (l0.V(this.f4302a)) {
                    return jSONObject;
                }
                jSONObject.put("sdid", this.f4302a);
                return jSONObject;
            } catch (Throwable th) {
                b0.f4295d.c(c3.d4(388) + l0.l(th));
                return new JSONObject();
            }
        }
    }

    b0(JSONObject jSONObject) {
        this.f4297b = false;
        try {
            if (jSONObject.has("admon_batching")) {
                this.f4296a = new a(jSONObject.getJSONObject("admon_batching"));
            } else {
                this.f4296a = new a(new JSONObject());
            }
            if (jSONObject.has("set_sdid_enabled")) {
                this.f4297b = jSONObject.getBoolean("set_sdid_enabled");
            }
            if (jSONObject.has("resolve")) {
                this.f4298c = new b(jSONObject.getJSONObject("resolve"));
            } else {
                this.f4298c = new b(new JSONObject());
            }
        } catch (Throwable th) {
            f4295d.c("failed parsing remote configuration json with error: " + l0.l(th));
        }
    }

    public static b0 b() {
        return new b0(new JSONObject());
    }

    public int c() {
        a aVar = this.f4296a;
        return aVar == null ? b().c() : aVar.a();
    }

    public String d() {
        b bVar = this.f4298c;
        return bVar == null ? b().d() : bVar.a();
    }

    public boolean e() {
        a aVar = this.f4296a;
        return aVar == null ? b().e() : aVar.c();
    }

    public boolean f() {
        a aVar = this.f4296a;
        return aVar == null ? b().f() : aVar.b();
    }

    public boolean g() {
        return this.f4297b;
    }

    public JSONObject h() {
        try {
            JSONObject jSONObject = new JSONObject();
            jSONObject.put("set_sdid_enabled", this.f4297b);
            a aVar = this.f4296a;
            if (aVar != null) {
                jSONObject.put("admon_batching", aVar.d());
            }
            b bVar = this.f4298c;
            if (bVar != null) {
                jSONObject.put("resolve", bVar.b());
            }
            return jSONObject;
        } catch (Throwable th) {
            f4295d.c("failed to create json object with error: " + l0.l(th));
            return new JSONObject();
        }
    }
}
