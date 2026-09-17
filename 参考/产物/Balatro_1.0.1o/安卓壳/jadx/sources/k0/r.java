package k0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class r implements i0.f {

    /* renamed from: a, reason: collision with root package name */
    private final o f3969a;

    /* renamed from: b, reason: collision with root package name */
    private final String f3970b;

    /* renamed from: c, reason: collision with root package name */
    private final i0.b f3971c;

    /* renamed from: d, reason: collision with root package name */
    private final i0.e f3972d;

    /* renamed from: e, reason: collision with root package name */
    private final s f3973e;

    r(o oVar, String str, i0.b bVar, i0.e eVar, s sVar) {
        this.f3969a = oVar;
        this.f3970b = str;
        this.f3971c = bVar;
        this.f3972d = eVar;
        this.f3973e = sVar;
    }

    public static /* synthetic */ void b(Exception exc) {
    }

    @Override // i0.f
    public void a(i0.c cVar) {
        c(cVar, new i0.h() { // from class: k0.q
            @Override // i0.h
            public final void a(Exception exc) {
                r.b(exc);
            }
        });
    }

    public void c(i0.c cVar, i0.h hVar) {
        this.f3973e.a(n.a().e(this.f3969a).c(cVar).f(this.f3970b).d(this.f3972d).b(this.f3971c).a(), hVar);
    }
}
