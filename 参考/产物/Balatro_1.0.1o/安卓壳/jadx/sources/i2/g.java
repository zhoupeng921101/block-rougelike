package i2;

import java.lang.reflect.Array;
import java.util.Arrays;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class g {
    static Object[] a(Object[] objArr, int i4, int i5, Object[] objArr2) {
        return Arrays.copyOfRange(objArr, i4, i5, objArr2.getClass());
    }

    static Object[] b(Object[] objArr, int i4) {
        return (Object[]) Array.newInstance(objArr.getClass().getComponentType(), i4);
    }
}
