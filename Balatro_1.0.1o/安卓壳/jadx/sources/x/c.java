package x;

import a1.b2.c3;
import a3.l;
import androidx.lifecycle.y;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class c {

    /* renamed from: a, reason: collision with root package name */
    private final List f5098a = new ArrayList();

    public final void a(f3.a aVar, l lVar) {
        b3.f.e(aVar, c3.d4(760));
        b3.f.e(lVar, "initializer");
        this.f5098a.add(new f(z2.a.a(aVar), lVar));
    }

    public final y.b b() {
        Object[] array = this.f5098a.toArray(new f[0]);
        if (array == null) {
            throw new NullPointerException("null cannot be cast to non-null type kotlin.Array<T of kotlin.collections.ArraysKt__ArraysJVMKt.toTypedArray>");
        }
        f[] fVarArr = (f[]) array;
        return new b((f[]) Arrays.copyOf(fVarArr, fVarArr.length));
    }
}
