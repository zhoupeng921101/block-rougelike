package k0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class v implements m0.b {

    /* renamed from: a, reason: collision with root package name */
    private final s2.a f3979a;

    /* renamed from: b, reason: collision with root package name */
    private final s2.a f3980b;

    /* renamed from: c, reason: collision with root package name */
    private final s2.a f3981c;

    /* renamed from: d, reason: collision with root package name */
    private final s2.a f3982d;

    /* renamed from: e, reason: collision with root package name */
    private final s2.a f3983e;

    public v(s2.a aVar, s2.a aVar2, s2.a aVar3, s2.a aVar4, s2.a aVar5) {
        this.f3979a = aVar;
        this.f3980b = aVar2;
        this.f3981c = aVar3;
        this.f3982d = aVar4;
        this.f3983e = aVar5;
    }

    public static v a(s2.a aVar, s2.a aVar2, s2.a aVar3, s2.a aVar4, s2.a aVar5) {
        return new v(aVar, aVar2, aVar3, aVar4, aVar5);
    }

    public static t c(u0.a aVar, u0.a aVar2, q0.e eVar, r0.r rVar, r0.v vVar) {
        return new t(aVar, aVar2, eVar, rVar, vVar);
    }

    @Override // s2.a
    /* renamed from: b, reason: merged with bridge method [inline-methods] */
    public t get() {
        return c((u0.a) this.f3979a.get(), (u0.a) this.f3980b.get(), (q0.e) this.f3981c.get(), (r0.r) this.f3982d.get(), (r0.v) this.f3983e.get());
    }
}
