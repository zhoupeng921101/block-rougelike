package f1;

import android.util.Log;
import e1.a;
import java.util.Map;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class g0 implements Runnable {

    /* renamed from: e, reason: collision with root package name */
    final /* synthetic */ d1.a f3257e;

    /* renamed from: f, reason: collision with root package name */
    final /* synthetic */ h0 f3258f;

    g0(h0 h0Var, d1.a aVar) {
        this.f3258f = h0Var;
        this.f3257e = aVar;
    }

    @Override // java.lang.Runnable
    public final void run() {
        Map map;
        b bVar;
        a.f fVar;
        a.f fVar2;
        a.f fVar3;
        a.f fVar4;
        h0 h0Var = this.f3258f;
        map = h0Var.f3267f.f3248j;
        bVar = h0Var.f3263b;
        d0 d0Var = (d0) map.get(bVar);
        if (d0Var == null) {
            return;
        }
        if (!this.f3257e.m0()) {
            d0Var.H(this.f3257e, null);
            return;
        }
        this.f3258f.f3266e = true;
        fVar = this.f3258f.f3262a;
        if (fVar.m()) {
            this.f3258f.i();
            return;
        }
        try {
            h0 h0Var2 = this.f3258f;
            fVar3 = h0Var2.f3262a;
            fVar4 = h0Var2.f3262a;
            fVar3.e(null, fVar4.b());
        } catch (SecurityException e4) {
            Log.e("GoogleApiManager", "Failed to get service from broker. ", e4);
            fVar2 = this.f3258f.f3262a;
            fVar2.c("Failed to get service from broker.");
            d0Var.H(new d1.a(10), null);
        }
    }
}
