package v2;

import a3.l;
import v2.e;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class b implements e.c {

    /* renamed from: a, reason: collision with root package name */
    private final l f5076a;

    /* renamed from: b, reason: collision with root package name */
    private final e.c f5077b;

    public b(e.c cVar, l lVar) {
        b3.f.e(cVar, "baseKey");
        b3.f.e(lVar, "safeCast");
        this.f5076a = lVar;
        this.f5077b = cVar instanceof b ? ((b) cVar).f5077b : cVar;
    }

    public final boolean a(e.c cVar) {
        b3.f.e(cVar, "key");
        return cVar == this || this.f5077b == cVar;
    }

    public final e.b b(e.b bVar) {
        b3.f.e(bVar, "element");
        return (e.b) this.f5076a.c(bVar);
    }
}
