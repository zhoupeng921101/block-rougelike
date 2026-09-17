package o2;

import a1.b2.c3;
import android.app.Application;
import android.content.SharedPreferences;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class d0 {

    /* renamed from: g, reason: collision with root package name */
    private static final g0 f4310g = g0.f(c3.d4(1505));

    /* renamed from: a, reason: collision with root package name */
    private final e0 f4311a;

    /* renamed from: b, reason: collision with root package name */
    private boolean f4312b = false;

    /* renamed from: c, reason: collision with root package name */
    private long f4313c = -1;

    /* renamed from: d, reason: collision with root package name */
    private long f4314d = -1;

    /* renamed from: e, reason: collision with root package name */
    private long f4315e = 0;

    /* renamed from: f, reason: collision with root package name */
    private boolean f4316f = true;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        final /* synthetic */ long f4317e;

        a(long j4) {
            this.f4317e = j4;
        }

        @Override // java.lang.Runnable
        public void run() {
            d0.this.r(this.f4317e);
            d0.this.f4316f = false;
            j.r().w();
            v.p(d0.this.f4311a.l());
            l0.d();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        final /* synthetic */ Boolean f4319e;

        /* renamed from: f, reason: collision with root package name */
        final /* synthetic */ long f4320f;

        b(Boolean bool, long j4) {
            this.f4319e = bool;
            this.f4320f = j4;
        }

        @Override // java.lang.Runnable
        public void run() {
            if (this.f4319e.booleanValue()) {
                d0.this.u(this.f4320f);
            }
            d0.this.f4316f = true;
            if (d0.this.f4316f || !d0.this.f4312b) {
                v.l(d0.this.f4311a.l(), d0.this.f4311a.k());
            }
        }
    }

    d0(e0 e0Var) {
        this.f4311a = e0Var;
        l();
        u(l0.y());
        g((Application) e0Var.l());
        if (this.f4316f || !this.f4312b) {
            v.l(e0Var.l(), e0Var.k());
        }
    }

    private void g(Application application) {
        if (this.f4312b) {
            return;
        }
        if (l0.M() == null || !l0.M().equalsIgnoreCase("mParticle")) {
            new f0(this).a(application);
        }
    }

    private boolean j() {
        return this.f4313c > 0;
    }

    private boolean k(long j4) {
        return j4 - this.f4314d < this.f4311a.z().f4261i * 1000;
    }

    private void l() {
        SharedPreferences sharedPreferences = this.f4311a.l().getSharedPreferences("singular-pref-session", 0);
        this.f4313c = sharedPreferences.getLong(c3.d4(944), -1L);
        this.f4314d = sharedPreferences.getLong(c3.d4(1288), l0.y());
        this.f4315e = sharedPreferences.getLong("seq", 0L);
        f4310g.b("load() <= %s", toString());
    }

    private void o() {
        try {
            SharedPreferences.Editor edit = this.f4311a.l().getSharedPreferences("singular-pref-session", 0).edit();
            edit.putLong("id", this.f4313c);
            edit.putLong("lastSessionPauseTime", this.f4314d);
            edit.putLong("seq", this.f4315e);
            edit.commit();
        } catch (Throwable th) {
            f4310g.c(l0.l(th));
        }
    }

    private void p() {
        this.f4315e = 0L;
    }

    private void q() {
        if (j()) {
            this.f4311a.M(this.f4313c);
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public void r(long j4) {
        this.f4314d = j4;
        o();
    }

    private void s(long j4) {
        this.f4313c = j4;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public boolean u(long j4) {
        if (this.f4311a == null) {
            f4310g.a("can't start new session - singular instance is null");
            return false;
        }
        if (z.e().h(this.f4311a.z().f4274v, this.f4311a.z().f4275w).booleanValue()) {
            f4310g.a("app is opened with push link");
            z.e().b();
            t(j4);
            return true;
        }
        if (this.f4311a.z().f4264l != null) {
            f4310g.a("app is opened with deeplink.so starting new session");
            t(j4);
            return true;
        }
        o.c().e(this.f4311a.l());
        if (o.c().d(this.f4311a.l())) {
            f4310g.a("starting new session because current sdid is fresh");
            t(j4);
            return true;
        }
        if (j() && k(j4)) {
            f4310g.a("session is not expired yet");
            return false;
        }
        f4310g.a("session is expired. starting new session");
        t(j4);
        return true;
    }

    long h() {
        long j4 = this.f4315e + 1;
        this.f4315e = j4;
        return j4;
    }

    long i() {
        return this.f4313c;
    }

    void m(long j4) {
        f4310g.b("onEnterForeground() At %d", Long.valueOf(j4));
        this.f4311a.O(new b(Boolean.valueOf((l0.b0() || z.e().d().booleanValue()) ? false : true), j4));
    }

    void n(long j4) {
        f4310g.b("onExitForeground() At %d", Long.valueOf(j4));
        z.e().a();
        this.f4311a.O(new a(j4));
    }

    public void t(long j4) {
        f4310g.b("startNewSession() At %d", Long.valueOf(j4));
        s(j4);
        p();
        q();
    }

    public String toString() {
        return c3.d4(945) + "id=" + this.f4313c + ", lastSessionPauseTime=" + this.f4314d + ", seq=" + this.f4315e + '}';
    }

    void v() {
        this.f4312b = true;
    }
}
