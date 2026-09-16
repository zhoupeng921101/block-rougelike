package q0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class g implements m0.b {

    /* renamed from: a, reason: collision with root package name */
    private final s2.a f4715a;

    public g(s2.a aVar) {
        this.f4715a = aVar;
    }

    public static r0.f a(u0.a aVar) {
        return (r0.f) m0.d.c(f.a(aVar), "Cannot return null from a non-@Nullable @Provides method");
    }

    public static g b(s2.a aVar) {
        return new g(aVar);
    }

    @Override // s2.a
    /* renamed from: c, reason: merged with bridge method [inline-methods] */
    public r0.f get() {
        return a((u0.a) this.f4715a.get());
    }
}
