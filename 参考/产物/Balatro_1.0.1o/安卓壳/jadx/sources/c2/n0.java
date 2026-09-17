package c2;

import f1.q;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class n0 implements p1.a {

    /* renamed from: a, reason: collision with root package name */
    private final h f2146a;

    public n0(h hVar) {
        this.f2146a = hVar;
    }

    @Override // p1.a
    public final g2.h a() {
        return this.f2146a.b(l0.f2140a);
    }

    @Override // p1.a
    public final void b(final String str) {
        this.f2146a.b(new g() { // from class: c2.i0
            @Override // c2.g
            public final /* synthetic */ g2.h a(e1.e eVar) {
                q.a a4 = f1.q.a();
                final String str2 = str;
                return eVar.i(a4.b(new f1.m() { // from class: c2.k0
                    @Override // f1.m
                    public final /* synthetic */ void accept(Object obj, Object obj2) {
                        ((q1.d) obj).k0((g2.i) obj2, str2);
                    }
                }).e(6695).a());
            }
        });
    }
}
