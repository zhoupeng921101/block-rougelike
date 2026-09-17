package q1;

import com.google.android.gms.common.data.DataHolder;
import p1.p;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class c extends a {

    /* renamed from: a, reason: collision with root package name */
    private final g2.i f4721a;

    c(g2.i iVar) {
        this.f4721a = iVar;
    }

    @Override // q1.a, q1.f
    public final void H(DataHolder dataHolder, String str, n1.a aVar, n1.a aVar2, n1.a aVar3) {
        v1.f fVar = new v1.f(dataHolder);
        try {
            if (fVar.getCount() >= 2 && str != null && aVar3 != null) {
                v1.d dVar = new v1.d(new v1.i(fVar.get(0)), new v1.c(aVar));
                v1.d dVar2 = new v1.d(new v1.i(fVar.get(1)), new v1.c(aVar2));
                fVar.close();
                this.f4721a.c(new p.a(null, new p.b(dVar, str, dVar2, new v1.c(aVar3))));
                return;
            }
            this.f4721a.c(null);
            fVar.close();
        } catch (Throwable th) {
            try {
                fVar.close();
            } catch (Throwable th2) {
                th.addSuppressed(th2);
            }
            throw th;
        }
    }

    @Override // q1.a, q1.f
    public final void a0(DataHolder dataHolder, n1.a aVar) {
        int l02 = dataHolder.l0();
        v1.f fVar = new v1.f(dataHolder);
        try {
            v1.d dVar = fVar.getCount() > 0 ? new v1.d(new v1.i(fVar.get(0)), new v1.c(aVar)) : null;
            fVar.close();
            if (l02 == 0) {
                this.f4721a.c(new p.a(dVar, null));
                return;
            }
            if (l02 == 4002) {
                if (dVar != null && dVar.M() != null) {
                    this.f4721a.b(new p.c(p1.x.a(4002), dVar.M()));
                    return;
                }
                l02 = 4002;
            }
            p1.g.b(this.f4721a, l02);
        } catch (Throwable th) {
            try {
                fVar.close();
            } catch (Throwable th2) {
                th.addSuppressed(th2);
            }
            throw th;
        }
    }
}
