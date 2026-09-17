package x1;

import android.content.Context;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class r implements x0.b {

    /* renamed from: a, reason: collision with root package name */
    private final x0.b f5129a;

    /* renamed from: b, reason: collision with root package name */
    private final x0.b f5130b;

    public r(Context context) {
        this.f5129a = new p(context, d1.j.e());
        this.f5130b = l.d(context);
    }

    public static /* synthetic */ g2.h b(r rVar, g2.h hVar) {
        if (!hVar.q() && !hVar.o()) {
            Exception m3 = hVar.m();
            if (m3 instanceof e1.b) {
                int b4 = ((e1.b) m3).b();
                if (b4 == 43001 || b4 == 43002 || b4 == 43003 || b4 == 17) {
                    return rVar.f5130b.a();
                }
                if (b4 == 43000) {
                    return g2.k.a(new Exception("Failed to get app set ID due to an internal error. Please try again later."));
                }
                if (b4 == 15) {
                    return g2.k.a(new Exception("The operation to get app set ID timed out. Please try again later."));
                }
            }
        }
        return hVar;
    }

    @Override // x0.b
    public final g2.h a() {
        return this.f5129a.a().k(new g2.a() { // from class: x1.q
            @Override // g2.a
            public final Object a(g2.h hVar) {
                return r.b(r.this, hVar);
            }
        });
    }
}
