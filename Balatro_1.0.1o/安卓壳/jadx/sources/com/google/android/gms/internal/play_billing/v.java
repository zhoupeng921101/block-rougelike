package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class v {
    public static int a(int i4, int i5, String str) {
        String b4;
        if (i4 >= 0 && i4 < i5) {
            return i4;
        }
        if (i4 < 0) {
            b4 = y.b("%s (%s) must not be negative", "index", Integer.valueOf(i4));
        } else {
            if (i5 < 0) {
                throw new IllegalArgumentException(a1.b2.c3.d4(1038) + i5);
            }
            b4 = y.b("%s (%s) must be less than size (%s)", "index", Integer.valueOf(i4), Integer.valueOf(i5));
        }
        throw new IndexOutOfBoundsException(b4);
    }

    public static int b(int i4, int i5, String str) {
        if (i4 < 0 || i4 > i5) {
            throw new IndexOutOfBoundsException(f(i4, i5, a1.b2.c3.d4(577)));
        }
        return i4;
    }

    public static Object c(Object obj, Object obj2) {
        if (obj != null) {
            return obj;
        }
        throw new NullPointerException((String) obj2);
    }

    public static void d(int i4, int i5, int i6) {
        if (i4 < 0 || i5 < i4 || i5 > i6) {
            throw new IndexOutOfBoundsException((i4 < 0 || i4 > i6) ? f(i4, i6, "start index") : (i5 < 0 || i5 > i6) ? f(i5, i6, "end index") : y.b("end index (%s) must not be less than start index (%s)", Integer.valueOf(i5), Integer.valueOf(i4)));
        }
    }

    public static void e(boolean z3, Object obj) {
        if (!z3) {
            throw new IllegalStateException((String) obj);
        }
    }

    private static String f(int i4, int i5, String str) {
        if (i4 < 0) {
            return y.b(a1.b2.c3.d4(253), str, Integer.valueOf(i4));
        }
        if (i5 >= 0) {
            return y.b("%s (%s) must not be greater than size (%s)", str, Integer.valueOf(i4), Integer.valueOf(i5));
        }
        throw new IllegalArgumentException(a1.b2.c3.d4(1420) + i5);
    }
}
