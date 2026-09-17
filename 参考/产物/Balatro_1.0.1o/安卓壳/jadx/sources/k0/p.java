package k0;

import java.util.Set;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class p implements i0.g {

    /* renamed from: a, reason: collision with root package name */
    private final Set f3966a;

    /* renamed from: b, reason: collision with root package name */
    private final o f3967b;

    /* renamed from: c, reason: collision with root package name */
    private final s f3968c;

    p(Set set, o oVar, s sVar) {
        this.f3966a = set;
        this.f3967b = oVar;
        this.f3968c = sVar;
    }

    @Override // i0.g
    public i0.f a(String str, Class cls, i0.b bVar, i0.e eVar) {
        if (this.f3966a.contains(bVar)) {
            return new r(this.f3967b, str, bVar, eVar, this.f3968c);
        }
        throw new IllegalArgumentException(String.format("%s is not supported byt this factory. Supported encodings are: %s.", bVar, this.f3966a));
    }
}
