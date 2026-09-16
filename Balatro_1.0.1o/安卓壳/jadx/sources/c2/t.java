package c2;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class t {

    /* renamed from: a, reason: collision with root package name */
    private final l f2170a;

    /* renamed from: b, reason: collision with root package name */
    private final g2.i f2171b;

    public t(l lVar, g2.i iVar) {
        this.f2170a = lVar;
        this.f2171b = iVar;
    }

    public final void a(e1.e eVar) {
        this.f2170a.a(eVar).d(b2.a(), new g2.d() { // from class: c2.s
            @Override // g2.d
            public final /* synthetic */ void a(g2.h hVar) {
                t.this.c(hVar);
            }
        });
    }

    public final void b(Exception exc) {
        this.f2171b.b(exc);
    }

    final /* synthetic */ void c(g2.h hVar) {
        if (hVar.q()) {
            this.f2171b.c(hVar.n());
            return;
        }
        g2.i iVar = this.f2171b;
        Exception m3 = hVar.m();
        m1.a(m3);
        iVar.b(m3);
    }
}
