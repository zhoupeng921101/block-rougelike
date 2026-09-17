package f1;

import a1.b2.c3;
import android.util.Log;
import e1.a;
import h1.d;
import java.util.Map;
import java.util.Set;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class h0 implements d.c, r0 {

    /* renamed from: a, reason: collision with root package name */
    private final a.f f3262a;

    /* renamed from: b, reason: collision with root package name */
    private final b f3263b;

    /* renamed from: c, reason: collision with root package name */
    private h1.k f3264c = null;

    /* renamed from: d, reason: collision with root package name */
    private Set f3265d = null;

    /* renamed from: e, reason: collision with root package name */
    private boolean f3266e = false;

    /* renamed from: f, reason: collision with root package name */
    final /* synthetic */ f f3267f;

    public h0(f fVar, a.f fVar2, b bVar) {
        this.f3267f = fVar;
        this.f3262a = fVar2;
        this.f3263b = bVar;
    }

    /* JADX INFO: Access modifiers changed from: private */
    public final void i() {
        h1.k kVar;
        if (!this.f3266e || (kVar = this.f3264c) == null) {
            return;
        }
        this.f3262a.e(kVar, this.f3265d);
    }

    @Override // f1.r0
    public final void a(d1.a aVar) {
        Map map;
        map = this.f3267f.f3248j;
        d0 d0Var = (d0) map.get(this.f3263b);
        if (d0Var != null) {
            d0Var.I(aVar);
        }
    }

    @Override // f1.r0
    public final void b(h1.k kVar, Set set) {
        if (kVar == null || set == null) {
            Log.wtf("GoogleApiManager", c3.d4(206), new Exception());
            a(new d1.a(4));
        } else {
            this.f3264c = kVar;
            this.f3265d = set;
            i();
        }
    }

    @Override // h1.d.c
    public final void c(d1.a aVar) {
        this.f3267f.f3252n.post(new g0(this, aVar));
    }

    @Override // f1.r0
    public final void d(int i4) {
        Map map;
        boolean z3;
        map = this.f3267f.f3248j;
        d0 d0Var = (d0) map.get(this.f3263b);
        if (d0Var != null) {
            z3 = d0Var.f3226i;
            if (z3) {
                d0Var.I(new d1.a(17));
            } else {
                d0Var.a(i4);
            }
        }
    }
}
