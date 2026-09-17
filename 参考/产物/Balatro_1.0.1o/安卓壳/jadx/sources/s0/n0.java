package s0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class n0 implements m0.b {

    /* renamed from: a, reason: collision with root package name */
    private final s2.a f4919a;

    /* renamed from: b, reason: collision with root package name */
    private final s2.a f4920b;

    /* renamed from: c, reason: collision with root package name */
    private final s2.a f4921c;

    /* renamed from: d, reason: collision with root package name */
    private final s2.a f4922d;

    /* renamed from: e, reason: collision with root package name */
    private final s2.a f4923e;

    public n0(s2.a aVar, s2.a aVar2, s2.a aVar3, s2.a aVar4, s2.a aVar5) {
        this.f4919a = aVar;
        this.f4920b = aVar2;
        this.f4921c = aVar3;
        this.f4922d = aVar4;
        this.f4923e = aVar5;
    }

    public static n0 a(s2.a aVar, s2.a aVar2, s2.a aVar3, s2.a aVar4, s2.a aVar5) {
        return new n0(aVar, aVar2, aVar3, aVar4, aVar5);
    }

    public static m0 c(u0.a aVar, u0.a aVar2, Object obj, Object obj2, s2.a aVar3) {
        return new m0(aVar, aVar2, (e) obj, (t0) obj2, aVar3);
    }

    @Override // s2.a
    /* renamed from: b, reason: merged with bridge method [inline-methods] */
    public m0 get() {
        return c((u0.a) this.f4919a.get(), (u0.a) this.f4920b.get(), this.f4921c.get(), this.f4922d.get(), this.f4923e);
    }
}
