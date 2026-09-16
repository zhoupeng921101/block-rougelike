package x;

import a1.b2.c3;
import androidx.lifecycle.x;
import androidx.lifecycle.y;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class b implements y.b {

    /* renamed from: b, reason: collision with root package name */
    private final f[] f5097b;

    public b(f... fVarArr) {
        b3.f.e(fVarArr, "initializers");
        this.f5097b = fVarArr;
    }

    @Override // androidx.lifecycle.y.b
    public x b(Class cls, a aVar) {
        b3.f.e(cls, c3.d4(1151));
        b3.f.e(aVar, c3.d4(1522));
        x xVar = null;
        for (f fVar : this.f5097b) {
            if (b3.f.a(fVar.a(), cls)) {
                Object c4 = fVar.b().c(aVar);
                xVar = c4 instanceof x ? (x) c4 : null;
            }
        }
        if (xVar != null) {
            return xVar;
        }
        throw new IllegalArgumentException("No initializer set for given class " + cls.getName());
    }
}
