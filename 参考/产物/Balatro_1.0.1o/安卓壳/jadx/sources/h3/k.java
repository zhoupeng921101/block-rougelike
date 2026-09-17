package h3;

/* JADX INFO: Access modifiers changed from: package-private */
/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class k extends j {
    public static Long a(String str) {
        b3.f.e(str, "<this>");
        return b(str, 10);
    }

    public static final Long b(String str, int i4) {
        boolean z3;
        b3.f.e(str, "<this>");
        a.a(i4);
        int length = str.length();
        Long l3 = null;
        if (length == 0) {
            return null;
        }
        int i5 = 0;
        char charAt = str.charAt(0);
        long j4 = -9223372036854775807L;
        if (b3.f.f(charAt, 48) < 0) {
            z3 = true;
            if (length == 1) {
                return null;
            }
            if (charAt == '-') {
                j4 = Long.MIN_VALUE;
                i5 = 1;
            } else {
                if (charAt != '+') {
                    return null;
                }
                z3 = false;
                i5 = 1;
            }
        } else {
            z3 = false;
        }
        long j5 = 0;
        long j6 = -256204778801521550L;
        while (i5 < length) {
            int b4 = a.b(str.charAt(i5), i4);
            if (b4 < 0) {
                return l3;
            }
            if (j5 < j6) {
                if (j6 != -256204778801521550L) {
                    return l3;
                }
                j6 = j4 / i4;
                if (j5 < j6) {
                    return l3;
                }
            }
            Long l4 = l3;
            int i6 = i5;
            long j7 = j5 * i4;
            long j8 = b4;
            if (j7 < j4 + j8) {
                return l4;
            }
            j5 = j7 - j8;
            i5 = i6 + 1;
            l3 = l4;
        }
        return z3 ? Long.valueOf(j5) : Long.valueOf(-j5);
    }
}
