package b2;

import a1.b2.c3;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class s {
    public static void a(boolean z3) {
        if (!z3) {
            throw new IllegalStateException();
        }
    }

    public static int b(int i4, int i5, String str) {
        String a4;
        if (i4 >= 0 && i4 < i5) {
            return i4;
        }
        String d4 = c3.d4(516);
        if (i4 < 0) {
            a4 = t.a("%s (%s) must not be negative", d4, Integer.valueOf(i4));
        } else {
            if (i5 < 0) {
                StringBuilder sb = new StringBuilder(String.valueOf(i5).length() + 15);
                sb.append("negative size: ");
                sb.append(i5);
                throw new IllegalArgumentException(sb.toString());
            }
            a4 = t.a("%s (%s) must be less than size (%s)", d4, Integer.valueOf(i4), Integer.valueOf(i5));
        }
        throw new IndexOutOfBoundsException(a4);
    }

    public static int c(int i4, int i5, String str) {
        if (i4 < 0 || i4 > i5) {
            throw new IndexOutOfBoundsException(e(i4, i5, c3.d4(1317)));
        }
        return i4;
    }

    public static void d(int i4, int i5, int i6) {
        if (i4 < 0 || i5 < i4 || i5 > i6) {
            throw new IndexOutOfBoundsException((i4 < 0 || i4 > i6) ? e(i4, i6, "start index") : (i5 < 0 || i5 > i6) ? e(i5, i6, "end index") : t.a("end index (%s) must not be less than start index (%s)", Integer.valueOf(i5), Integer.valueOf(i4)));
        }
    }

    private static String e(int i4, int i5, String str) {
        if (i4 < 0) {
            return t.a("%s (%s) must not be negative", str, Integer.valueOf(i4));
        }
        if (i5 >= 0) {
            return t.a("%s (%s) must not be greater than size (%s)", str, Integer.valueOf(i4), Integer.valueOf(i5));
        }
        StringBuilder sb = new StringBuilder(String.valueOf(i5).length() + 15);
        sb.append("negative size: ");
        sb.append(i5);
        throw new IllegalArgumentException(sb.toString());
    }
}
