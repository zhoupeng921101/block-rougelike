package w2;

import a1.b2.c3;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class c {
    private static final int a(int i4, int i5, int i6) {
        return c(c(i4, i6) - c(i5, i6), i6);
    }

    public static final int b(int i4, int i5, int i6) {
        if (i6 > 0) {
            if (i4 < i5) {
                return i5 - a(i5, i4, i6);
            }
        } else {
            if (i6 >= 0) {
                throw new IllegalArgumentException(c3.d4(1261));
            }
            if (i4 > i5) {
                return i5 + a(i4, i5, -i6);
            }
        }
        return i5;
    }

    private static final int c(int i4, int i5) {
        int i6 = i4 % i5;
        return i6 >= 0 ? i6 : i6 + i5;
    }
}
