package com.google.android.gms.common.util;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class b {
    public static boolean a(int[] iArr, int i4) {
        if (iArr != null) {
            for (int i5 : iArr) {
                if (i5 == i4) {
                    return true;
                }
            }
        }
        return false;
    }

    public static boolean b(Object[] objArr, Object obj) {
        int length = objArr != null ? objArr.length : 0;
        int i4 = 0;
        while (true) {
            if (i4 >= length) {
                break;
            }
            if (!h1.o.a(objArr[i4], obj)) {
                i4++;
            } else if (i4 >= 0) {
                return true;
            }
        }
        return false;
    }
}
