package c2;

import a1.b2.c3;
import android.app.Activity;
import android.app.Application;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class f0 implements c0 {

    /* renamed from: a, reason: collision with root package name */
    private final Application f2107a;

    /* renamed from: b, reason: collision with root package name */
    private final q1.q f2108b;

    /* renamed from: c, reason: collision with root package name */
    private final n f2109c;

    f0(Application application, q1.q qVar, n nVar) {
        this.f2107a = application;
        this.f2108b = qVar;
        this.f2109c = nVar;
    }

    private final f2 c() {
        Activity d4 = this.f2108b.d();
        if (d4 != null) {
            return e2.a(d4, this.f2109c.f2145b);
        }
        n nVar = this.f2109c;
        return e2.a(nVar.f2144a, nVar.f2145b);
    }

    @Override // c2.c0
    public final g2.h a(final l2 l2Var) {
        final boolean z3 = false;
        if (l2Var.j0() == 0 && !m1.b.a(this.f2107a)) {
            z3 = true;
        }
        g2.h c4 = c().c(l2Var, z3);
        final g2.i iVar = new g2.i();
        c4.l(b2.a(), new g2.a() { // from class: c2.e0
            @Override // g2.a
            public final /* synthetic */ Object a(g2.h hVar) {
                return f0.this.b(l2Var, z3, hVar);
            }
        }).d(b2.a(), new g2.d() { // from class: c2.d0
            @Override // g2.d
            public final /* synthetic */ void a(g2.h hVar) {
                g2.i iVar2 = g2.i.this;
                if (hVar.q()) {
                    iVar2.e(g0.a(((n2) hVar.n()).a()));
                    return;
                }
                Exception m3 = hVar.m();
                if (m3 instanceof e1.b) {
                    iVar2.e(g0.b(((e1.b) m3).a()));
                } else {
                    m1.a(m3);
                    iVar2.d(m3);
                }
            }
        });
        return iVar.a();
    }

    final /* synthetic */ g2.h b(l2 l2Var, boolean z3, g2.h hVar) {
        if (!hVar.q()) {
            Exception m3 = hVar.m();
            if ((m3 instanceof e1.b) && ((e1.b) m3).b() == 20) {
                e1.a("GamesAuthenticator", c3.d4(331));
                return c().c(l2Var, z3);
            }
        }
        return hVar;
    }
}
