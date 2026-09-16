package b2;

import a1.b2.c3;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class j {
    static Object[] a(Object[] objArr, int i4) {
        for (int i5 = 0; i5 < i4; i5++) {
            if (objArr[i5] == null) {
                StringBuilder sb = new StringBuilder(String.valueOf(i5).length() + 9);
                sb.append(c3.d4(1271));
                sb.append(i5);
                throw new NullPointerException(sb.toString());
            }
        }
        return objArr;
    }
}
