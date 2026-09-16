package v2;

import a3.p;
import v2.e;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a implements e.b {
    private final e.c key;

    public a(e.c cVar) {
        b3.f.e(cVar, "key");
        this.key = cVar;
    }

    @Override // v2.e
    public <R> R fold(R r3, p pVar) {
        return (R) e.b.a.a(this, r3, pVar);
    }

    @Override // v2.e.b, v2.e
    public <E extends e.b> E get(e.c cVar) {
        return (E) e.b.a.b(this, cVar);
    }

    @Override // v2.e.b
    public e.c getKey() {
        return this.key;
    }

    @Override // v2.e
    public e minusKey(e.c cVar) {
        return e.b.a.c(this, cVar);
    }

    public e plus(e eVar) {
        return e.b.a.d(this, eVar);
    }
}
