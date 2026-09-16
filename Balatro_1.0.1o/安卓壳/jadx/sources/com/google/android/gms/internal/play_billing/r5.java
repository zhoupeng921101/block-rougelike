package com.google.android.gms.internal.play_billing;

import java.util.Arrays;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class r5 {

    /* renamed from: f, reason: collision with root package name */
    private static final r5 f2980f = new r5(0, new int[0], new Object[0], false);

    /* renamed from: a, reason: collision with root package name */
    private int f2981a;

    /* renamed from: b, reason: collision with root package name */
    private int[] f2982b;

    /* renamed from: c, reason: collision with root package name */
    private Object[] f2983c;

    /* renamed from: d, reason: collision with root package name */
    private int f2984d = -1;

    /* renamed from: e, reason: collision with root package name */
    private boolean f2985e;

    private r5(int i4, int[] iArr, Object[] objArr, boolean z3) {
        this.f2981a = i4;
        this.f2982b = iArr;
        this.f2983c = objArr;
        this.f2985e = z3;
    }

    public static r5 c() {
        return f2980f;
    }

    static r5 e(r5 r5Var, r5 r5Var2) {
        int i4 = r5Var.f2981a + r5Var2.f2981a;
        int[] copyOf = Arrays.copyOf(r5Var.f2982b, i4);
        System.arraycopy(r5Var2.f2982b, 0, copyOf, r5Var.f2981a, r5Var2.f2981a);
        Object[] copyOf2 = Arrays.copyOf(r5Var.f2983c, i4);
        System.arraycopy(r5Var2.f2983c, 0, copyOf2, r5Var.f2981a, r5Var2.f2981a);
        return new r5(i4, copyOf, copyOf2, true);
    }

    static r5 f() {
        return new r5(0, new int[8], new Object[8], true);
    }

    private final void l(int i4) {
        int[] iArr = this.f2982b;
        if (i4 > iArr.length) {
            int i5 = this.f2981a;
            int i6 = i5 + (i5 / 2);
            if (i6 >= i4) {
                i4 = i6;
            }
            if (i4 < 8) {
                i4 = 8;
            }
            this.f2982b = Arrays.copyOf(iArr, i4);
            this.f2983c = Arrays.copyOf(this.f2983c, i4);
        }
    }

    public final int a() {
        int s3;
        int t3;
        int i4;
        int i5 = this.f2984d;
        if (i5 != -1) {
            return i5;
        }
        int i6 = 0;
        for (int i7 = 0; i7 < this.f2981a; i7++) {
            int i8 = this.f2982b[i7];
            int i9 = i8 >>> 3;
            int i10 = i8 & 7;
            if (i10 != 0) {
                if (i10 == 1) {
                    ((Long) this.f2983c[i7]).getClass();
                    i4 = r3.s(i9 << 3) + 8;
                } else if (i10 == 2) {
                    int i11 = i9 << 3;
                    j3 j3Var = (j3) this.f2983c[i7];
                    int s4 = r3.s(i11);
                    int g4 = j3Var.g();
                    i4 = s4 + r3.s(g4) + g4;
                } else if (i10 == 3) {
                    int s5 = r3.s(i9 << 3);
                    s3 = s5 + s5;
                    t3 = ((r5) this.f2983c[i7]).a();
                } else {
                    if (i10 != 5) {
                        throw new IllegalStateException(new l4(a1.b2.c3.d4(1230)));
                    }
                    ((Integer) this.f2983c[i7]).getClass();
                    i4 = r3.s(i9 << 3) + 4;
                }
                i6 += i4;
            } else {
                int i12 = i9 << 3;
                long longValue = ((Long) this.f2983c[i7]).longValue();
                s3 = r3.s(i12);
                t3 = r3.t(longValue);
            }
            i4 = s3 + t3;
            i6 += i4;
        }
        this.f2984d = i6;
        return i6;
    }

    public final int b() {
        int i4 = this.f2984d;
        if (i4 != -1) {
            return i4;
        }
        int i5 = 0;
        for (int i6 = 0; i6 < this.f2981a; i6++) {
            int i7 = this.f2982b[i6] >>> 3;
            j3 j3Var = (j3) this.f2983c[i6];
            int s3 = r3.s(8);
            int s4 = r3.s(16) + r3.s(i7);
            int s5 = r3.s(24);
            int g4 = j3Var.g();
            i5 += s3 + s3 + s4 + s5 + r3.s(g4) + g4;
        }
        this.f2984d = i5;
        return i5;
    }

    final r5 d(r5 r5Var) {
        if (r5Var.equals(f2980f)) {
            return this;
        }
        g();
        int i4 = this.f2981a + r5Var.f2981a;
        l(i4);
        System.arraycopy(r5Var.f2982b, 0, this.f2982b, this.f2981a, r5Var.f2981a);
        System.arraycopy(r5Var.f2983c, 0, this.f2983c, this.f2981a, r5Var.f2981a);
        this.f2981a = i4;
        return this;
    }

    public final boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || !(obj instanceof r5)) {
            return false;
        }
        r5 r5Var = (r5) obj;
        int i4 = this.f2981a;
        if (i4 == r5Var.f2981a) {
            int[] iArr = this.f2982b;
            int[] iArr2 = r5Var.f2982b;
            int i5 = 0;
            while (true) {
                if (i5 >= i4) {
                    Object[] objArr = this.f2983c;
                    Object[] objArr2 = r5Var.f2983c;
                    int i6 = this.f2981a;
                    for (int i7 = 0; i7 < i6; i7++) {
                        if (objArr[i7].equals(objArr2[i7])) {
                        }
                    }
                    return true;
                }
                if (iArr[i5] != iArr2[i5]) {
                    break;
                }
                i5++;
            }
        }
        return false;
    }

    final void g() {
        if (!this.f2985e) {
            throw new UnsupportedOperationException();
        }
    }

    public final void h() {
        if (this.f2985e) {
            this.f2985e = false;
        }
    }

    public final int hashCode() {
        int i4 = this.f2981a;
        int i5 = i4 + 527;
        int[] iArr = this.f2982b;
        int i6 = 17;
        int i7 = 17;
        for (int i8 = 0; i8 < i4; i8++) {
            i7 = (i7 * 31) + iArr[i8];
        }
        int i9 = ((i5 * 31) + i7) * 31;
        Object[] objArr = this.f2983c;
        int i10 = this.f2981a;
        for (int i11 = 0; i11 < i10; i11++) {
            i6 = (i6 * 31) + objArr[i11].hashCode();
        }
        return i9 + i6;
    }

    final void i(StringBuilder sb, int i4) {
        for (int i5 = 0; i5 < this.f2981a; i5++) {
            c5.b(sb, i4, String.valueOf(this.f2982b[i5] >>> 3), this.f2983c[i5]);
        }
    }

    final void j(int i4, Object obj) {
        g();
        l(this.f2981a + 1);
        int[] iArr = this.f2982b;
        int i5 = this.f2981a;
        iArr[i5] = i4;
        this.f2983c[i5] = obj;
        this.f2981a = i5 + 1;
    }

    public final void k(c6 c6Var) {
        if (this.f2981a != 0) {
            for (int i4 = 0; i4 < this.f2981a; i4++) {
                int i5 = this.f2982b[i4];
                Object obj = this.f2983c[i4];
                int i6 = i5 & 7;
                int i7 = i5 >>> 3;
                if (i6 == 0) {
                    c6Var.r(i7, ((Long) obj).longValue());
                } else if (i6 == 1) {
                    c6Var.B(i7, ((Long) obj).longValue());
                } else if (i6 == 2) {
                    c6Var.n(i7, (j3) obj);
                } else if (i6 == 3) {
                    c6Var.g(i7);
                    ((r5) obj).k(c6Var);
                    c6Var.H(i7);
                } else {
                    if (i6 != 5) {
                        throw new RuntimeException(new l4("Protocol message tag had invalid wire type."));
                    }
                    c6Var.k(i7, ((Integer) obj).intValue());
                }
            }
        }
    }
}
