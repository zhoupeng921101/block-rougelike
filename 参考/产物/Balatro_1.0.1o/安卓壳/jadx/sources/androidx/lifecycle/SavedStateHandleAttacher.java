package androidx.lifecycle;

import a1.b2.c3;
import androidx.lifecycle.g;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class SavedStateHandleAttacher implements i {

    /* renamed from: a, reason: collision with root package name */
    private final v f1648a;

    public SavedStateHandleAttacher(v vVar) {
        b3.f.e(vVar, "provider");
        this.f1648a = vVar;
    }

    @Override // androidx.lifecycle.i
    public void g(k kVar, g.b bVar) {
        b3.f.e(kVar, "source");
        b3.f.e(bVar, "event");
        if (bVar == g.b.ON_CREATE) {
            kVar.q().c(this);
            this.f1648a.c();
        } else {
            throw new IllegalStateException((c3.d4(674) + bVar).toString());
        }
    }
}
