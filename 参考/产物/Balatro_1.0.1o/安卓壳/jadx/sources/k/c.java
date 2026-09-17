package k;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class c {

    /* renamed from: a, reason: collision with root package name */
    static final int[] f3853a = new int[0];

    /* renamed from: b, reason: collision with root package name */
    static final long[] f3854b = new long[0];

    /* renamed from: c, reason: collision with root package name */
    static final Object[] f3855c = new Object[0];

    static int a(int[] iArr, int i4, int i5) {
        int i6 = i4 - 1;
        int i7 = 0;
        while (i7 <= i6) {
            int i8 = (i7 + i6) >>> 1;
            int i9 = iArr[i8];
            if (i9 < i5) {
                i7 = i8 + 1;
            } else {
                if (i9 <= i5) {
                    return i8;
                }
                i6 = i8 - 1;
            }
        }
        return ~i7;
    }

    static int b(long[] jArr, int i4, long j4) {
        int i5 = i4 - 1;
        int i6 = 0;
        while (i6 <= i5) {
            int i7 = (i6 + i5) >>> 1;
            long j5 = jArr[i7];
            if (j5 < j4) {
                i6 = i7 + 1;
            } else {
                if (j5 <= j4) {
                    return i7;
                }
                i5 = i7 - 1;
            }
        }
        return ~i6;
    }

    public static boolean c(Object obj, Object obj2) {
        if (obj != obj2) {
            return obj != null && obj.equals(obj2);
        }
        return true;
    }

    public static int d(int i4) {
        for (int i5 = 4; i5 < 32; i5++) {
            int i6 = (1 << i5) - 12;
            if (i4 <= i6) {
                return i6;
            }
        }
        return i4;
    }

    public static int e(int i4) {
        return d(i4 * 4) / 4;
    }

    public static int f(int i4) {
        return d(i4 * 8) / 8;
    }
}
