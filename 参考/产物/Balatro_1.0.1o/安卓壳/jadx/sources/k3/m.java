package k3;

import a1.b2.c3;

/* JADX INFO: Access modifiers changed from: package-private */
/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract /* synthetic */ class m {
    public static final int a(String str, int i4, int i5, int i6) {
        return (int) k.c(str, i4, i5, i6);
    }

    public static final long b(String str, long j4, long j5, long j6) {
        String d4 = k.d(str);
        if (d4 == null) {
            return j4;
        }
        Long a4 = h3.c.a(d4);
        String d42 = c3.d4(585);
        if (a4 == null) {
            throw new IllegalStateException((d42 + str + c3.d4(442) + d4 + '\'').toString());
        }
        long longValue = a4.longValue();
        if (j5 <= longValue && longValue <= j6) {
            return longValue;
        }
        throw new IllegalStateException((d42 + str + "' should be in range " + j5 + ".." + j6 + ", but is '" + longValue + '\'').toString());
    }

    public static final boolean c(String str, boolean z3) {
        String d4 = k.d(str);
        return d4 == null ? z3 : Boolean.parseBoolean(d4);
    }

    public static /* synthetic */ int d(String str, int i4, int i5, int i6, int i7, Object obj) {
        if ((i7 & 4) != 0) {
            i5 = 1;
        }
        if ((i7 & 8) != 0) {
            i6 = Integer.MAX_VALUE;
        }
        return k.b(str, i4, i5, i6);
    }

    public static /* synthetic */ long e(String str, long j4, long j5, long j6, int i4, Object obj) {
        if ((i4 & 4) != 0) {
            j5 = 1;
        }
        long j7 = j5;
        if ((i4 & 8) != 0) {
            j6 = Long.MAX_VALUE;
        }
        return k.c(str, j4, j7, j6);
    }
}
