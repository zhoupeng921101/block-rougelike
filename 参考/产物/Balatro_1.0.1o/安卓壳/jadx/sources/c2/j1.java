package c2;

import a1.b2.c3;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class j1 {
    public static int a(int i4, int i5, String str) {
        String a4;
        if (i4 >= 0 && i4 < i5) {
            return i4;
        }
        if (i4 < 0) {
            a4 = l1.a("%s (%s) must not be negative", "index", Integer.valueOf(i4));
        } else {
            if (i5 < 0) {
                StringBuilder sb = new StringBuilder(String.valueOf(i5).length() + 15);
                sb.append(c3.d4(920));
                sb.append(i5);
                throw new IllegalArgumentException(sb.toString());
            }
            a4 = l1.a(c3.d4(562), "index", Integer.valueOf(i4), Integer.valueOf(i5));
        }
        throw new IndexOutOfBoundsException(a4);
    }

    public static int b(int i4, int i5, String str) {
        if (i4 < 0 || i4 > i5) {
            throw new IndexOutOfBoundsException(d(i4, i5, "index"));
        }
        return i4;
    }

    public static void c(int i4, int i5, int i6) {
        if (i4 < 0 || i5 < i4 || i5 > i6) {
            throw new IndexOutOfBoundsException((i4 < 0 || i4 > i6) ? d(i4, i6, "start index") : (i5 < 0 || i5 > i6) ? d(i5, i6, "end index") : l1.a("end index (%s) must not be less than start index (%s)", Integer.valueOf(i5), Integer.valueOf(i4)));
        }
    }

    private static String d(int i4, int i5, String str) {
        if (i4 < 0) {
            return l1.a("%s (%s) must not be negative", str, Integer.valueOf(i4));
        }
        if (i5 >= 0) {
            return l1.a("%s (%s) must not be greater than size (%s)", str, Integer.valueOf(i4), Integer.valueOf(i5));
        }
        StringBuilder sb = new StringBuilder(String.valueOf(i5).length() + 15);
        sb.append(c3.d4(1360));
        sb.append(i5);
        throw new IllegalArgumentException(sb.toString());
    }
}
