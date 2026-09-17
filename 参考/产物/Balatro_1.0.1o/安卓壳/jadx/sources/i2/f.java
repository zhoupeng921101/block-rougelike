package i2;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class f {
    static Object a(Object obj, int i4) {
        if (obj != null) {
            return obj;
        }
        throw new NullPointerException("at index " + i4);
    }

    static Object[] b(Object... objArr) {
        return c(objArr, objArr.length);
    }

    static Object[] c(Object[] objArr, int i4) {
        for (int i5 = 0; i5 < i4; i5++) {
            a(objArr[i5], i5);
        }
        return objArr;
    }

    public static Object[] d(Object[] objArr, int i4) {
        return g.b(objArr, i4);
    }
}
