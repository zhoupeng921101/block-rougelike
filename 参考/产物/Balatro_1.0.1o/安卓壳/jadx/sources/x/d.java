package x;

import x.a;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class d extends a {
    /* JADX WARN: Multi-variable type inference failed */
    public d() {
        this(null, 1, 0 == true ? 1 : 0);
    }

    public d(a aVar) {
        b3.f.e(aVar, "initialExtras");
        a().putAll(aVar.a());
    }

    public /* synthetic */ d(a aVar, int i4, b3.d dVar) {
        this((i4 & 1) != 0 ? a.C0083a.f5096b : aVar);
    }

    public final void b(a.b bVar, Object obj) {
        b3.f.e(bVar, "key");
        a().put(bVar, obj);
    }
}
