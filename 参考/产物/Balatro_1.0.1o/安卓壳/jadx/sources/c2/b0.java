package c2;

import a1.b2.c3;
import android.app.Activity;
import android.app.Application;
import android.app.PendingIntent;
import android.content.pm.PackageInfo;
import android.os.Looper;
import com.google.android.gms.common.api.Status;
import java.util.ArrayDeque;
import java.util.Iterator;
import java.util.Locale;
import java.util.Queue;
import java.util.concurrent.atomic.AtomicReference;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class b0 implements m {

    /* renamed from: a, reason: collision with root package name */
    private final AtomicReference f2073a = new AtomicReference(r.UNINITIALIZED);

    /* renamed from: b, reason: collision with root package name */
    private final AtomicReference f2074b = new AtomicReference(p.AUTOMATIC);

    /* renamed from: c, reason: collision with root package name */
    private final Queue f2075c = new ArrayDeque();

    /* renamed from: d, reason: collision with root package name */
    private final AtomicReference f2076d = new AtomicReference();

    /* renamed from: e, reason: collision with root package name */
    private final AtomicReference f2077e = new AtomicReference();

    /* renamed from: f, reason: collision with root package name */
    private final Application f2078f;

    /* renamed from: g, reason: collision with root package name */
    private final q1.q f2079g;

    /* renamed from: h, reason: collision with root package name */
    private final c0 f2080h;

    b0(Application application, q1.q qVar, t1.b bVar, c0 c0Var) {
        this.f2078f = application;
        this.f2079g = qVar;
        this.f2080h = c0Var;
    }

    private final void h(int i4) {
        p pVar;
        StringBuilder sb = new StringBuilder(String.valueOf(i4).length() + 45);
        sb.append("startAuthenticationIfNecessary() signInType: ");
        sb.append(i4);
        e1.a("GamesApiManager", sb.toString());
        h1.q.e(c3.d4(1445));
        AtomicReference atomicReference = this.f2073a;
        r rVar = r.UNINITIALIZED;
        r rVar2 = r.AUTHENTICATING;
        int i5 = 0;
        if (!f1.d1.a(atomicReference, rVar, rVar2)) {
            if (i4 != 1) {
                if (f1.d1.a(atomicReference, r.AUTHENTICATION_FAILED, rVar2)) {
                    i4 = 0;
                } else {
                    boolean a4 = f1.d1.a(this.f2074b, p.AUTOMATIC, p.AUTOMATIC_PENDING_EXPLICIT);
                    StringBuilder sb2 = new StringBuilder(String.valueOf(a4).length() + 83);
                    sb2.append("Explicit sign-in during existing authentication. Marking pending explicit sign-in: ");
                    sb2.append(a4);
                    e1.a("GamesApiManager", sb2.toString());
                }
            }
            e1.a("GamesApiManager", "Authentication attempt skipped. Already authenticated or authenticating. State: ".concat(String.valueOf(atomicReference.get())));
            return;
        }
        AtomicReference atomicReference2 = this.f2076d;
        g2.i iVar = (g2.i) atomicReference2.get();
        if (iVar != null) {
            iVar.d(new IllegalStateException("New authentication attempt in progress"));
        }
        g2.i iVar2 = new g2.i();
        atomicReference2.set(iVar2);
        AtomicReference atomicReference3 = this.f2074b;
        if (i4 == 0) {
            pVar = p.f2153g;
        } else {
            pVar = p.AUTOMATIC;
            i5 = 1;
        }
        atomicReference3.set(pVar);
        i(iVar2, l2.h0(i5));
    }

    private final void i(final g2.i iVar, final l2 l2Var) {
        e1.a("GamesApiManager", "Attempting authentication: ".concat(l2Var.toString()));
        this.f2080h.a(l2Var).d(g2.j.f3354a, new g2.d() { // from class: c2.v
            @Override // g2.d
            public final /* synthetic */ void a(g2.h hVar) {
                b0.this.f(iVar, l2Var, hVar);
            }
        });
    }

    private final void j(final g2.i iVar, final int i4, PendingIntent pendingIntent, boolean z3, boolean z4) {
        Activity d4;
        h1.q.e(c3.d4(236));
        Application application = this.f2078f;
        int a4 = com.google.android.gms.common.util.c.a(application, "com.google.android.gms");
        Locale locale = Locale.US;
        String format = String.format(locale, "GmsCore version is %d", Integer.valueOf(a4));
        String d42 = c3.d4(1406);
        e1.a(d42, format);
        if (a4 < 220812000) {
            PackageInfo b4 = com.google.android.gms.common.util.c.b(application, "com.android.vending");
            if (b4 == null) {
                e1.a(d42, "PlayStore is not installed");
            } else {
                int i5 = b4.versionCode;
                if (i5 < 82470600) {
                    e1.a(d42, String.format(locale, "PlayStore version is below resolution threshold: %s", Integer.valueOf(i5)));
                } else {
                    e1.a(d42, "Installed PlayStore version can be used for resolution.");
                }
            }
            e1.e(d42, "PlayStore is too old or not available and the version of GmsCore would attempt PGA installation on automatic sign-in. Skipping it.");
            iVar.e(Boolean.FALSE);
            this.f2073a.set(r.AUTHENTICATION_FAILED);
            return;
        }
        if (z3 && pendingIntent != null && (d4 = this.f2079g.d()) != null) {
            t1.b.b(d4, pendingIntent).d(g2.j.f3354a, new g2.d() { // from class: c2.w
                @Override // g2.d
                public final /* synthetic */ void a(g2.h hVar) {
                    b0.this.g(iVar, i4, hVar);
                }
            });
            e1.a(d42, "Resolution triggered");
            return;
        }
        boolean a5 = f1.d1.a(this.f2074b, p.AUTOMATIC_PENDING_EXPLICIT, p.f2153g);
        if (!z4 && a5) {
            e1.a(d42, "Consumed pending explicit sign-in. Attempting explicit sign-in");
            i(iVar, l2.h0(0));
            return;
        }
        iVar.e(Boolean.FALSE);
        this.f2073a.set(r.AUTHENTICATION_FAILED);
        Iterator it = this.f2075c.iterator();
        while (it.hasNext()) {
            ((t) it.next()).b(m());
            it.remove();
        }
    }

    private static boolean k() {
        return Looper.myLooper() == Looper.getMainLooper();
    }

    private static g2.h l(final c2 c2Var) {
        if (k()) {
            return (g2.h) c2Var.a();
        }
        final g2.i iVar = new g2.i();
        g2.j.f3354a.execute(new Runnable() { // from class: c2.x
            @Override // java.lang.Runnable
            public final /* synthetic */ void run() {
                g2.h hVar = (g2.h) c2.this.a();
                final g2.i iVar2 = iVar;
                hVar.c(new g2.d() { // from class: c2.z
                    @Override // g2.d
                    public final /* synthetic */ void a(g2.h hVar2) {
                        g2.i iVar3 = g2.i.this;
                        if (hVar2.q()) {
                            iVar3.e(hVar2.n());
                            return;
                        }
                        Exception m3 = hVar2.m();
                        m1.a(m3);
                        iVar3.d(m3);
                    }
                });
            }
        });
        return iVar.a();
    }

    private static e1.b m() {
        return new e1.b(new Status(4));
    }

    private static g2.h n(AtomicReference atomicReference, g2.i iVar) {
        int ordinal = ((r) atomicReference.get()).ordinal();
        if (ordinal == 0) {
            return g2.k.a(new e1.b(new Status(10)));
        }
        if (ordinal == 2) {
            return g2.k.b(p1.b.f4608b);
        }
        if (ordinal != 3 && iVar != null) {
            g2.h a4 = iVar.a();
            if (a4.q()) {
                return ((Boolean) a4.n()).booleanValue() ? g2.k.b(p1.b.f4608b) : g2.k.b(p1.b.f4609c);
            }
            final g2.i iVar2 = new g2.i();
            a4.d(b2.a(), new g2.d() { // from class: c2.y
                @Override // g2.d
                public final /* synthetic */ void a(g2.h hVar) {
                    g2.i iVar3 = g2.i.this;
                    if (hVar.q() && ((Boolean) hVar.n()).booleanValue()) {
                        iVar3.e(p1.b.f4608b);
                    } else {
                        iVar3.e(p1.b.f4609c);
                    }
                }
            });
            return iVar2.a();
        }
        return g2.k.b(p1.b.f4609c);
    }

    final /* synthetic */ void a(t tVar) {
        h1.q.e("Must be called on the main thread.");
        r rVar = (r) this.f2073a.get();
        if (rVar == r.AUTHENTICATED) {
            tVar.a((e1.e) this.f2077e.get());
        } else if (rVar == r.AUTHENTICATION_FAILED) {
            tVar.b(m());
        } else {
            this.f2075c.add(tVar);
        }
    }

    final /* synthetic */ g2.h b() {
        h(1);
        return n(this.f2073a, (g2.i) this.f2076d.get());
    }

    @Override // c2.m
    public final g2.h c() {
        return n(this.f2073a, (g2.i) this.f2076d.get());
    }

    @Override // c2.m
    public final g2.h d() {
        return l(new c2() { // from class: c2.u
            @Override // c2.c2
            public final /* synthetic */ Object a() {
                return b0.this.b();
            }
        });
    }

    @Override // c2.m
    public final g2.h e(l lVar) {
        r rVar = (r) this.f2073a.get();
        e1.c(c3.d4(617), "Executing API call with authentication state: ".concat(String.valueOf(rVar)));
        if (rVar == r.AUTHENTICATED) {
            return lVar.a((e1.e) this.f2077e.get());
        }
        if (rVar == r.AUTHENTICATION_FAILED) {
            return g2.k.a(m());
        }
        if (rVar == r.UNINITIALIZED) {
            return g2.k.a(new e1.b(new Status(10)));
        }
        g2.i iVar = new g2.i();
        final t tVar = new t(lVar, iVar);
        Runnable runnable = new Runnable() { // from class: c2.a0
            @Override // java.lang.Runnable
            public final /* synthetic */ void run() {
                b0.this.a(tVar);
            }
        };
        if (k()) {
            runnable.run();
        } else {
            g2.j.f3354a.execute(runnable);
        }
        return iVar.a();
    }

    final /* synthetic */ void f(g2.i iVar, l2 l2Var, g2.h hVar) {
        boolean q3 = hVar.q();
        String d4 = c3.d4(1025);
        if (!q3) {
            Exception m3 = hVar.m();
            m1.a(m3);
            e1.b(d4, "Authentication task failed", m3);
            j(iVar, l2Var.j0(), null, false, !l2Var.d());
            return;
        }
        g0 g0Var = (g0) hVar.n();
        if (!g0Var.c()) {
            e1.a(d4, "Failed to authenticate: ".concat(String.valueOf(g0Var)));
            j(iVar, l2Var.j0(), g0Var.e(), true, !l2Var.d());
            return;
        }
        String d5 = g0Var.d();
        if (d5 == null) {
            e1.e(d4, c3.d4(1407));
            j(iVar, l2Var.j0(), null, false, !l2Var.d());
            return;
        }
        e1.a(d4, "Successfully authenticated");
        h1.q.e("Must be called on the main thread.");
        p1.v a4 = p1.w.a();
        a4.a(2101523);
        a4.b(d5);
        q1.s d6 = q1.t.d();
        d6.a(true);
        d6.b(true);
        d6.c(true);
        a4.c(d6.d());
        u0 u0Var = new u0(this.f2078f, a4.d());
        this.f2077e.set(u0Var);
        this.f2073a.set(r.AUTHENTICATED);
        iVar.e(Boolean.TRUE);
        Iterator it = this.f2075c.iterator();
        while (it.hasNext()) {
            ((t) it.next()).a(u0Var);
            it.remove();
        }
    }

    final /* synthetic */ void g(g2.i iVar, int i4, g2.h hVar) {
        if (!hVar.q()) {
            Exception m3 = hVar.m();
            m1.a(m3);
            e1.f("GamesApiManager", "Resolution failed", m3);
            j(iVar, i4, null, false, true);
            return;
        }
        t1.c cVar = (t1.c) hVar.n();
        if (cVar.c()) {
            e1.a("GamesApiManager", c3.d4(1159));
            i(iVar, l2.i0(i4, s2.h0(cVar.d())));
        } else {
            e1.a("GamesApiManager", c3.d4(425));
            j(iVar, i4, null, false, true);
        }
    }
}
