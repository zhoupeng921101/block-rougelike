package androidx.fragment.app;

import android.app.Application;
import android.content.Context;
import android.content.ContextWrapper;
import android.os.Bundle;
import androidx.lifecycle.g;
import androidx.lifecycle.y;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class j0 implements androidx.lifecycle.f, z.e, androidx.lifecycle.b0 {

    /* renamed from: a, reason: collision with root package name */
    private final Fragment f1506a;

    /* renamed from: b, reason: collision with root package name */
    private final androidx.lifecycle.a0 f1507b;

    /* renamed from: c, reason: collision with root package name */
    private androidx.lifecycle.l f1508c = null;

    /* renamed from: d, reason: collision with root package name */
    private z.d f1509d = null;

    j0(Fragment fragment, androidx.lifecycle.a0 a0Var) {
        this.f1506a = fragment;
        this.f1507b = a0Var;
    }

    void a(g.b bVar) {
        this.f1508c.h(bVar);
    }

    @Override // z.e
    public z.c c() {
        d();
        return this.f1509d.b();
    }

    void d() {
        if (this.f1508c == null) {
            this.f1508c = new androidx.lifecycle.l(this);
            z.d a4 = z.d.a(this);
            this.f1509d = a4;
            a4.c();
        }
    }

    boolean e() {
        return this.f1508c != null;
    }

    void f(Bundle bundle) {
        this.f1509d.d(bundle);
    }

    void g(Bundle bundle) {
        this.f1509d.e(bundle);
    }

    void h(g.c cVar) {
        this.f1508c.o(cVar);
    }

    @Override // androidx.lifecycle.f
    public x.a j() {
        Application application;
        Context applicationContext = this.f1506a.n1().getApplicationContext();
        while (true) {
            if (!(applicationContext instanceof ContextWrapper)) {
                application = null;
                break;
            }
            if (applicationContext instanceof Application) {
                application = (Application) applicationContext;
                break;
            }
            applicationContext = ((ContextWrapper) applicationContext).getBaseContext();
        }
        x.d dVar = new x.d();
        if (application != null) {
            dVar.b(y.a.f1710e, application);
        }
        dVar.b(androidx.lifecycle.u.f1693a, this.f1506a);
        dVar.b(androidx.lifecycle.u.f1694b, this);
        if (this.f1506a.r() != null) {
            dVar.b(androidx.lifecycle.u.f1695c, this.f1506a.r());
        }
        return dVar;
    }

    @Override // androidx.lifecycle.b0
    public androidx.lifecycle.a0 o() {
        d();
        return this.f1507b;
    }

    @Override // androidx.lifecycle.k
    public androidx.lifecycle.g q() {
        d();
        return this.f1508c;
    }
}
