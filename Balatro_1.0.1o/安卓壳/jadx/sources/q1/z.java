package q1;

import com.google.android.gms.common.data.DataHolder;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class z extends a {

    /* renamed from: a, reason: collision with root package name */
    private final g2.i f4750a;

    z(g2.i iVar) {
        this.f4750a = iVar;
    }

    @Override // q1.a, q1.f
    public final void G(DataHolder dataHolder) {
        int l02 = dataHolder.l0();
        if (l02 != 0) {
            p1.g.b(this.f4750a, l02);
            dataHolder.close();
            return;
        }
        v1.f fVar = new v1.f(dataHolder);
        try {
            v1.i iVar = fVar.getCount() > 0 ? new v1.i(fVar.get(0)) : null;
            fVar.close();
            this.f4750a.c(iVar);
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
