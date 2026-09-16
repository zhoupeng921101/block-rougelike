package b2;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class f extends v {

    /* renamed from: g, reason: collision with root package name */
    private final i f1804g;

    f(i iVar, int i4) {
        super(iVar.size(), i4);
        this.f1804g = iVar;
    }

    @Override // b2.v
    protected final Object b(int i4) {
        return this.f1804g.get(i4);
    }
}
