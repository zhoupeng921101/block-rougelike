package o2;

import a1.b2.c3;
import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import o2.g;
import o2.h;
import org.json.JSONObject;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class e0 {

    /* renamed from: o, reason: collision with root package name */
    private static final g0 f4324o = g0.f(c3.d4(489));

    /* renamed from: p, reason: collision with root package name */
    private static int f4325p = 0;

    /* renamed from: q, reason: collision with root package name */
    private static e0 f4326q;

    /* renamed from: a, reason: collision with root package name */
    private final Context f4327a;

    /* renamed from: b, reason: collision with root package name */
    private final o2.f f4328b;

    /* renamed from: c, reason: collision with root package name */
    private final k0 f4329c;

    /* renamed from: d, reason: collision with root package name */
    private n2.b f4330d;

    /* renamed from: e, reason: collision with root package name */
    private d0 f4331e;

    /* renamed from: f, reason: collision with root package name */
    private r f4332f;

    /* renamed from: g, reason: collision with root package name */
    private HashMap f4333g;

    /* renamed from: h, reason: collision with root package name */
    Map f4334h;

    /* renamed from: i, reason: collision with root package name */
    Map f4335i;

    /* renamed from: j, reason: collision with root package name */
    Map f4336j;

    /* renamed from: k, reason: collision with root package name */
    String f4337k;

    /* renamed from: l, reason: collision with root package name */
    private boolean f4338l = false;

    /* renamed from: m, reason: collision with root package name */
    private boolean f4339m = false;

    /* renamed from: n, reason: collision with root package name */
    private double f4340n;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements p2.e {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ CountDownLatch f4341a;

        a(CountDownLatch countDownLatch) {
            this.f4341a = countDownLatch;
        }

        @Override // p2.e
        public void a(Map map) {
            e0.this.f4335i = map;
            this.f4341a.countDown();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b implements Runnable {
        b() {
        }

        @Override // java.lang.Runnable
        public void run() {
            e0.this.f4331e.t(l0.y());
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class c implements Runnable {
        c() {
        }

        @Override // java.lang.Runnable
        public void run() {
            e0.this.f4331e.t(l0.y());
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class d implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        final /* synthetic */ e0 f4345e;

        d(e0 e0Var) {
            this.f4345e = e0Var;
        }

        @Override // java.lang.Runnable
        public void run() {
            e0.this.B(this.f4345e);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class e implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        final /* synthetic */ h.c f4347e;

        e(h.c cVar) {
            this.f4347e = cVar;
        }

        @Override // java.lang.Runnable
        public void run() {
            e0.this.J(this.f4347e);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class f implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        final /* synthetic */ h.c f4349e;

        f(h.c cVar) {
            this.f4349e = cVar;
        }

        @Override // java.lang.Runnable
        public void run() {
            o2.h hVar = new o2.h(this.f4349e.f4386c);
            hVar.g(h.b.l(this.f4349e, e0.f4326q));
            if (!hVar.l() || o2.j.r() == null) {
                e0.f4326q.f4328b.c(hVar);
            } else {
                o2.j.r().n(hVar);
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class g implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        final /* synthetic */ long f4351e;

        g(long j4) {
            this.f4351e = j4;
        }

        @Override // java.lang.Runnable
        public void run() {
            if (e0.f4326q != null) {
                if (!e0.this.f4339m) {
                    e0.this.W(this.f4351e);
                    return;
                }
                e0.this.j();
                e0.this.h();
                e0.this.i(this.f4351e);
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class h implements p2.e {
        h() {
        }

        @Override // p2.e
        public void a(Map map) {
            e0.this.f4336j = map;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class i implements p2.e {
        i() {
        }

        @Override // p2.e
        public void a(Map map) {
            if (map == null || !map.containsKey("dt_referrer")) {
                return;
            }
            e0.this.f4337k = map.get("dt_referrer").toString();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class j implements p2.e {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ CountDownLatch f4355a;

        /* renamed from: b, reason: collision with root package name */
        final /* synthetic */ long f4356b;

        j(CountDownLatch countDownLatch, long j4) {
            this.f4355a = countDownLatch;
            this.f4356b = j4;
        }

        @Override // p2.e
        public void a(Map map) {
            e0.this.f4334h = map;
            this.f4355a.countDown();
            e0.this.f4340n = l0.f0(this.f4356b);
        }
    }

    private e0(Context context, n2.b bVar) {
        g0 g0Var = f4324o;
        g0Var.b("SDK version: %s", n.f4437b);
        g0Var.b("SDK build info: %s", n.f4436a);
        g0Var.b("new SingularInstance() with config: %s", bVar);
        Context applicationContext = context.getApplicationContext();
        if (!(applicationContext instanceof Application)) {
            throw new IllegalStateException("Context failed to cast to ApplicationContext");
        }
        this.f4327a = applicationContext;
        this.f4330d = bVar;
        k0 k0Var = new k0("worker");
        this.f4329c = k0Var;
        this.f4328b = new o2.f(new k0("api"), context, new c0(context));
        k0Var.start();
        C();
        O(new d(this));
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void B(e0 e0Var) {
        if (E()) {
            f4324o.c("Singular is already initialized, please don't call init() again.");
            return;
        }
        try {
            e0Var.f4339m = l0.t(l());
            if (!l0.V(this.f4330d.f4270r)) {
                T("fcm_device_token_key", this.f4330d.f4270r);
            }
            String str = this.f4330d.f4257e;
            if (str != null) {
                S(str);
            }
            Boolean bool = this.f4330d.f4271s;
            if (bool != null) {
                H(bool.booleanValue());
            }
            String str2 = this.f4330d.f4258f;
            if (str2 != null) {
                V(str2);
            }
            e0Var.f4332f = new r(e0Var.f4327a, this.f4330d.f4259g, Boolean.valueOf(F()), e0Var.f4339m);
            m.c().o();
            o.c().i(e0Var);
            o2.j.r().x(this.f4327a);
            o2.j.r().w();
            e0Var.f4331e = new d0(e0Var);
            this.f4338l = true;
            f4324o.h("Singular is initialized now.");
        } catch (Throwable th) {
            f4324o.d("error in init()", th);
        }
    }

    private void C() {
        this.f4333g = I();
        if (this.f4330d.f4260h.size() == 0) {
            return;
        }
        HashMap hashMap = (HashMap) this.f4333g.clone();
        Iterator it = this.f4330d.f4260h.values().iterator();
        if (it.hasNext()) {
            h.d.a(it.next());
            throw null;
        }
        if (hashMap.size() > 5) {
            return;
        }
        this.f4333g = hashMap;
        U();
        if (this.f4333g == null) {
            g();
        }
    }

    private boolean G() {
        return (!E() || r() == null || x() == null) ? false : true;
    }

    private void R(String str, boolean z3) {
        SharedPreferences.Editor edit = y().edit();
        edit.putBoolean(str, z3);
        edit.commit();
    }

    private void T(String str, String str2) {
        SharedPreferences.Editor edit = y().edit();
        edit.putString(str, str2);
        edit.commit();
    }

    private void U() {
        if (this.f4333g == null) {
            this.f4333g = new HashMap();
        }
        SharedPreferences.Editor edit = y().edit();
        edit.putString(c3.d4(163), o().toString());
        edit.commit();
    }

    public static e0 r() {
        return f4326q;
    }

    public static e0 s(Context context, n2.b bVar) {
        if (f4326q == null) {
            synchronized (e0.class) {
                try {
                    if (f4326q == null) {
                        g0.f4378c = bVar.f4262j;
                        g0.f4379d = bVar.f4263k;
                        f4326q = new e0(context, bVar);
                    }
                } finally {
                }
            }
        }
        e0 e0Var = f4326q;
        e0Var.f4330d = bVar;
        return e0Var;
    }

    private SharedPreferences y() {
        return this.f4327a.getSharedPreferences("singular-pref-session", 0);
    }

    public void A(JSONObject jSONObject) {
        try {
            Map a4 = r2.a.a(jSONObject);
            f4324o.a("device attribution json to map: " + a4);
            this.f4330d.getClass();
        } catch (Throwable th) {
            f4324o.a("could not convert device attribution json object to map" + th.getMessage());
        }
    }

    public boolean D() {
        return y().getBoolean("stop_all_tracking", false);
    }

    boolean E() {
        return this.f4338l;
    }

    public boolean F() {
        if (f4326q == null) {
            f4324o.a("isLimitAdvertisingIdentifiers: instance null, returning default false.");
            return false;
        }
        n2.b bVar = this.f4330d;
        if (bVar != null) {
            return bVar.f4272t.booleanValue();
        }
        f4324o.a("isLimitAdvertisingIdentifiers: config null, returning default false.");
        return false;
    }

    public void H(boolean z3) {
        R("limit_data_sharing", z3);
    }

    public HashMap I() {
        JSONObject jSONObject;
        try {
            jSONObject = new JSONObject(y().getString("global_properties", "{}"));
        } catch (Throwable th) {
            f4324o.c("Failed to parse global properties JSON, using empty object: " + l0.l(th));
            jSONObject = new JSONObject();
        }
        HashMap hashMap = new HashMap();
        Iterator<String> keys = jSONObject.keys();
        while (keys.hasNext()) {
            try {
                String next = keys.next();
                hashMap.put(next, jSONObject.getString(next));
            } catch (Throwable th2) {
                f4324o.c(c3.d4(1048) + l0.l(th2));
            }
        }
        return hashMap;
    }

    void J(h.c cVar) {
        if (D()) {
            f4324o.a(c3.d4(1289));
        } else if (G()) {
            O(new f(cVar));
        } else {
            N(new e(cVar));
        }
    }

    public boolean K(String str) {
        return L(str, null);
    }

    public boolean L(String str, String str2) {
        int length = (str != null ? str.length() : 0) + (str2 != null ? str2.length() : 0);
        if (length > 3746) {
            f4324o.b("Event discarded! payload length = %d", Integer.valueOf(length));
            return false;
        }
        J(new h.c(str, str2));
        return true;
    }

    void M(long j4) {
        if (D()) {
            f4324o.a("Tracking was stopped! not logging event!");
        } else {
            P(new g(j4));
        }
    }

    void N(Runnable runnable) {
        if (f4325p < 10) {
            Q(runnable, 200);
            f4325p++;
        }
    }

    void O(Runnable runnable) {
        this.f4329c.c(runnable);
    }

    void P(Runnable runnable) {
        this.f4329c.d(runnable);
    }

    void Q(Runnable runnable, int i4) {
        this.f4329c.e(runnable, i4);
    }

    public void S(String str) {
        SharedPreferences.Editor edit = y().edit();
        edit.putString("custom_user_id", str);
        edit.commit();
        r rVar = this.f4332f;
        if (rVar != null) {
            rVar.r(str);
        }
    }

    public void V(String str) {
        l0.o0(str);
    }

    void W(long j4) {
        o2.g gVar = new o2.g(j4);
        gVar.g(g.b.l(j4, f4326q));
        f4326q.f4328b.c(gVar);
        e0 e0Var = f4326q;
        e0Var.f4330d.f4256d = null;
        e0Var.f4339m = false;
    }

    public void X() {
        if (this.f4330d.f4264l == null) {
            return;
        }
        O(new c());
    }

    public void Y() {
        O(new b());
    }

    public void g() {
        this.f4333g = null;
        U();
    }

    void h() {
        new p2.c().c(l(), new i());
    }

    void i(long j4) {
        long y3 = l0.y();
        CountDownLatch countDownLatch = new CountDownLatch(2);
        new p2.d().d(l(), new j(countDownLatch, y3));
        new p2.g().a(l(), new a(countDownLatch));
        try {
            countDownLatch.await(3L, TimeUnit.SECONDS);
        } catch (InterruptedException e4) {
            f4324o.a("InterruptedException while waiting for install referrer: " + l0.l(e4));
        }
        W(j4);
    }

    void j() {
        new y().a(l(), new h());
    }

    o2.f k() {
        return this.f4328b;
    }

    Context l() {
        return this.f4327a;
    }

    public String m() {
        return this.f4337k;
    }

    r n() {
        return this.f4332f;
    }

    public JSONObject o() {
        return new JSONObject(this.f4333g);
    }

    public Map p() {
        return this.f4334h;
    }

    public double q() {
        return this.f4340n;
    }

    public boolean t() {
        return this.f4339m;
    }

    public Boolean u() {
        SharedPreferences y3 = y();
        if (y3.contains("limit_data_sharing")) {
            return Boolean.valueOf(y3.getBoolean("limit_data_sharing", false));
        }
        return null;
    }

    public Map v() {
        return this.f4336j;
    }

    public Map w() {
        return this.f4335i;
    }

    d0 x() {
        return this.f4331e;
    }

    n2.b z() {
        return this.f4330d;
    }
}
