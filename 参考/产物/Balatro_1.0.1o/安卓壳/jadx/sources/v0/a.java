package v0;

import a1.b2.c3;
import android.util.SparseArray;
import i0.d;
import java.util.HashMap;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a {

    /* renamed from: a, reason: collision with root package name */
    private static SparseArray f5044a = new SparseArray();

    /* renamed from: b, reason: collision with root package name */
    private static HashMap f5045b;

    static {
        HashMap hashMap = new HashMap();
        f5045b = hashMap;
        hashMap.put(d.DEFAULT, 0);
        f5045b.put(d.f3613f, 1);
        f5045b.put(d.HIGHEST, 2);
        for (d dVar : f5045b.keySet()) {
            f5044a.append(((Integer) f5045b.get(dVar)).intValue(), dVar);
        }
    }

    public static int a(d dVar) {
        Integer num = (Integer) f5045b.get(dVar);
        if (num != null) {
            return num.intValue();
        }
        throw new IllegalStateException(c3.d4(1300) + dVar);
    }

    public static d b(int i4) {
        d dVar = (d) f5044a.get(i4);
        if (dVar != null) {
            return dVar;
        }
        throw new IllegalArgumentException("Unknown Priority for value " + i4);
    }
}
