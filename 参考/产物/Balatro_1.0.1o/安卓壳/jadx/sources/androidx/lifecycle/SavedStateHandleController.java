package androidx.lifecycle;

import androidx.lifecycle.g;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class SavedStateHandleController implements i {

    /* renamed from: a, reason: collision with root package name */
    private boolean f1649a;

    @Override // androidx.lifecycle.i
    public void g(k kVar, g.b bVar) {
        if (bVar == g.b.ON_DESTROY) {
            this.f1649a = false;
            kVar.q().c(this);
        }
    }

    void h(z.c cVar, g gVar) {
        if (this.f1649a) {
            throw new IllegalStateException("Already attached to lifecycleOwner");
        }
        this.f1649a = true;
        gVar.a(this);
        throw null;
    }

    boolean i() {
        return this.f1649a;
    }
}
