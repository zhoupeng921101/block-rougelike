package androidx.core.content.res;

import java.lang.reflect.Array;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class e {
    public static int[] a(int[] iArr, int i4, int i5) {
        if (i4 + 1 > iArr.length) {
            int[] iArr2 = new int[c(i4)];
            System.arraycopy(iArr, 0, iArr2, 0, i4);
            iArr = iArr2;
        }
        iArr[i4] = i5;
        return iArr;
    }

    public static Object[] b(Object[] objArr, int i4, Object obj) {
        if (i4 + 1 > objArr.length) {
            Object[] objArr2 = (Object[]) Array.newInstance(objArr.getClass().getComponentType(), c(i4));
            System.arraycopy(objArr, 0, objArr2, 0, i4);
            objArr = objArr2;
        }
        objArr[i4] = obj;
        return objArr;
    }

    public static int c(int i4) {
        if (i4 <= 4) {
            return 8;
        }
        return i4 * 2;
    }
}
