package h1;

import android.os.Bundle;
import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class b1 extends q0 {

    /* renamed from: g, reason: collision with root package name */
    final /* synthetic */ d f3435g;

    /* JADX WARN: 'super' call moved to the top of the method (can break code semantics) */
    public b1(d dVar, int i4, Bundle bundle) {
        super(dVar, i4, bundle);
        Objects.requireNonNull(dVar);
        this.f3435g = dVar;
    }

    @Override // h1.q0
    protected final boolean e() {
        this.f3435g.f3457p.c(d1.a.f3079j);
        return true;
    }

    @Override // h1.q0
    protected final void f(d1.a aVar) {
        d dVar = this.f3435g;
        if (dVar.s() && dVar.X()) {
            dVar.W(16);
        } else {
            dVar.f3457p.c(aVar);
            dVar.K(aVar);
        }
    }
}
