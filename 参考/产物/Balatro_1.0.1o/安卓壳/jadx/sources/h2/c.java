package h2;

import a1.b2.c3;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class c {
    private static String a(int i4, int i5, String str) {
        if (i4 < 0) {
            return d.a(c3.d4(697), str, Integer.valueOf(i4));
        }
        if (i5 >= 0) {
            return d.a("%s (%s) must be less than size (%s)", str, Integer.valueOf(i4), Integer.valueOf(i5));
        }
        throw new IllegalArgumentException("negative size: " + i5);
    }

    private static String b(int i4, int i5, String str) {
        if (i4 < 0) {
            return d.a("%s (%s) must not be negative", str, Integer.valueOf(i4));
        }
        if (i5 >= 0) {
            return d.a("%s (%s) must not be greater than size (%s)", str, Integer.valueOf(i4), Integer.valueOf(i5));
        }
        throw new IllegalArgumentException("negative size: " + i5);
    }

    private static String c(int i4, int i5, int i6) {
        return (i4 < 0 || i4 > i6) ? b(i4, i6, "start index") : (i5 < 0 || i5 > i6) ? b(i5, i6, "end index") : d.a("end index (%s) must not be less than start index (%s)", Integer.valueOf(i5), Integer.valueOf(i4));
    }

    public static int d(int i4, int i5) {
        return e(i4, i5, c3.d4(257));
    }

    public static int e(int i4, int i5, String str) {
        if (i4 < 0 || i4 >= i5) {
            throw new IndexOutOfBoundsException(a(i4, i5, str));
        }
        return i4;
    }

    public static Object f(Object obj) {
        obj.getClass();
        return obj;
    }

    public static int g(int i4, int i5) {
        return h(i4, i5, "index");
    }

    public static int h(int i4, int i5, String str) {
        if (i4 < 0 || i4 > i5) {
            throw new IndexOutOfBoundsException(b(i4, i5, str));
        }
        return i4;
    }

    public static void i(int i4, int i5, int i6) {
        if (i4 < 0 || i5 < i4 || i5 > i6) {
            throw new IndexOutOfBoundsException(c(i4, i5, i6));
        }
    }
}
