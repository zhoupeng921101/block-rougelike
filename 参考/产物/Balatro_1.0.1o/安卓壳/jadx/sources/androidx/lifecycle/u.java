package androidx.lifecycle;

import a1.b2.c3;
import androidx.lifecycle.g;
import x.a;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class u {

    /* renamed from: a, reason: collision with root package name */
    public static final a.b f1693a = new b();

    /* renamed from: b, reason: collision with root package name */
    public static final a.b f1694b = new c();

    /* renamed from: c, reason: collision with root package name */
    public static final a.b f1695c = new a();

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a implements a.b {
        a() {
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class b implements a.b {
        b() {
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class c implements a.b {
        c() {
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static final class d extends b3.g implements a3.l {

        /* renamed from: f, reason: collision with root package name */
        public static final d f1696f = new d();

        d() {
            super(1);
        }

        @Override // a3.l
        /* renamed from: d, reason: merged with bridge method [inline-methods] */
        public final w c(x.a aVar) {
            b3.f.e(aVar, c3.d4(1314));
            return new w();
        }
    }

    public static final void a(z.e eVar) {
        b3.f.e(eVar, "<this>");
        g.c b4 = eVar.q().b();
        b3.f.d(b4, "lifecycle.currentState");
        if (b4 != g.c.INITIALIZED && b4 != g.c.CREATED) {
            throw new IllegalArgumentException("Failed requirement.");
        }
        z.c c4 = eVar.c();
        String d4 = c3.d4(675);
        if (c4.c(d4) == null) {
            v vVar = new v(eVar.c(), (b0) eVar);
            eVar.c().h(d4, vVar);
            eVar.q().a(new SavedStateHandleAttacher(vVar));
        }
    }

    public static final w b(b0 b0Var) {
        b3.f.e(b0Var, "<this>");
        x.c cVar = new x.c();
        cVar.a(b3.h.a(w.class), d.f1696f);
        return (w) new y(b0Var, cVar.b()).b("androidx.lifecycle.internal.SavedStateHandlesVM", w.class);
    }
}
