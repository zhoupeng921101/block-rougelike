package h1;

import android.content.Context;
import android.util.SparseIntArray;
import e1.a;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class g0 {

    /* renamed from: a, reason: collision with root package name */
    private final SparseIntArray f3508a = new SparseIntArray();

    /* renamed from: b, reason: collision with root package name */
    private d1.j f3509b;

    public g0(d1.j jVar) {
        q.i(jVar);
        this.f3509b = jVar;
    }

    public final int a(Context context, int i4) {
        return this.f3508a.get(i4, -1);
    }

    public final int b(Context context, a.f fVar) {
        q.i(context);
        q.i(fVar);
        int i4 = 0;
        if (!fVar.d()) {
            return 0;
        }
        int f4 = fVar.f();
        int a4 = a(context, f4);
        if (a4 != -1) {
            return a4;
        }
        int i5 = 0;
        while (true) {
            if (i5 >= this.f3508a.size()) {
                i4 = -1;
                break;
            }
            int keyAt = this.f3508a.keyAt(i5);
            if (keyAt > f4 && this.f3508a.get(keyAt) == 0) {
                break;
            }
            i5++;
        }
        if (i4 == -1) {
            i4 = this.f3509b.g(context, f4);
        }
        this.f3508a.put(f4, i4);
        return i4;
    }

    public final void c() {
        this.f3508a.clear();
    }
}
