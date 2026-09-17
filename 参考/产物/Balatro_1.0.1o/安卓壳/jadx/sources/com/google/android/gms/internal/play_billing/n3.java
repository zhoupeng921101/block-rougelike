package com.google.android.gms.internal.play_billing;

import java.util.Locale;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class n3 extends r3 {

    /* renamed from: d, reason: collision with root package name */
    private final byte[] f2869d;

    /* renamed from: e, reason: collision with root package name */
    private final int f2870e;

    /* renamed from: f, reason: collision with root package name */
    private int f2871f;

    n3(byte[] bArr, int i4, int i5) {
        super(null);
        int length = bArr.length;
        if (((length - i5) | i5) < 0) {
            throw new IllegalArgumentException(String.format(Locale.US, "Array range is invalid. Buffer.length=%d, offset=%d, length=%d", Integer.valueOf(length), 0, Integer.valueOf(i5)));
        }
        this.f2869d = bArr;
        this.f2871f = 0;
        this.f2870e = i5;
    }

    @Override // com.google.android.gms.internal.play_billing.r3
    public final int c() {
        return this.f2870e - this.f2871f;
    }

    @Override // com.google.android.gms.internal.play_billing.r3
    public final void d(byte b4) {
        int i4 = this.f2871f;
        try {
            int i5 = i4 + 1;
            try {
                this.f2869d[i4] = b4;
                this.f2871f = i5;
            } catch (IndexOutOfBoundsException e4) {
                e = e4;
                i4 = i5;
                throw new p3(i4, this.f2870e, 1, e);
            }
        } catch (IndexOutOfBoundsException e5) {
            e = e5;
        }
    }

    @Override // com.google.android.gms.internal.play_billing.r3
    public final void e(int i4, boolean z3) {
        p(i4 << 3);
        d(z3 ? (byte) 1 : (byte) 0);
    }

    @Override // com.google.android.gms.internal.play_billing.r3
    public final void f(int i4, j3 j3Var) {
        p((i4 << 3) | 2);
        v(j3Var);
    }

    @Override // com.google.android.gms.internal.play_billing.r3
    public final void g(int i4, int i5) {
        p((i4 << 3) | 5);
        h(i5);
    }

    @Override // com.google.android.gms.internal.play_billing.r3
    public final void h(int i4) {
        int i5 = this.f2871f;
        try {
            byte[] bArr = this.f2869d;
            bArr[i5] = (byte) i4;
            bArr[i5 + 1] = (byte) (i4 >> 8);
            bArr[i5 + 2] = (byte) (i4 >> 16);
            bArr[i5 + 3] = (byte) (i4 >> 24);
            this.f2871f = i5 + 4;
        } catch (IndexOutOfBoundsException e4) {
            throw new p3(i5, this.f2870e, 4, e4);
        }
    }

    @Override // com.google.android.gms.internal.play_billing.r3
    public final void i(int i4, long j4) {
        p((i4 << 3) | 1);
        j(j4);
    }

    @Override // com.google.android.gms.internal.play_billing.r3
    public final void j(long j4) {
        int i4 = this.f2871f;
        try {
            byte[] bArr = this.f2869d;
            bArr[i4] = (byte) j4;
            bArr[i4 + 1] = (byte) (j4 >> 8);
            bArr[i4 + 2] = (byte) (j4 >> 16);
            bArr[i4 + 3] = (byte) (j4 >> 24);
            bArr[i4 + 4] = (byte) (j4 >> 32);
            bArr[i4 + 5] = (byte) (j4 >> 40);
            bArr[i4 + 6] = (byte) (j4 >> 48);
            bArr[i4 + 7] = (byte) (j4 >> 56);
            this.f2871f = i4 + 8;
        } catch (IndexOutOfBoundsException e4) {
            throw new p3(i4, this.f2870e, 8, e4);
        }
    }

    @Override // com.google.android.gms.internal.play_billing.r3
    public final void k(int i4, int i5) {
        p(i4 << 3);
        l(i5);
    }

    @Override // com.google.android.gms.internal.play_billing.r3
    public final void l(int i4) {
        if (i4 >= 0) {
            p(i4);
        } else {
            r(i4);
        }
    }

    @Override // com.google.android.gms.internal.play_billing.r3
    public final void m(int i4, String str) {
        p((i4 << 3) | 2);
        w(str);
    }

    @Override // com.google.android.gms.internal.play_billing.r3
    public final void n(int i4, int i5) {
        p((i4 << 3) | i5);
    }

    @Override // com.google.android.gms.internal.play_billing.r3
    public final void o(int i4, int i5) {
        p(i4 << 3);
        p(i5);
    }

    @Override // com.google.android.gms.internal.play_billing.r3
    public final void p(int i4) {
        int i5;
        IndexOutOfBoundsException indexOutOfBoundsException;
        int i6 = this.f2871f;
        while ((i4 & (-128)) != 0) {
            try {
                i5 = i6 + 1;
                try {
                    this.f2869d[i6] = (byte) (i4 | 128);
                    i4 >>>= 7;
                    i6 = i5;
                } catch (IndexOutOfBoundsException e4) {
                    indexOutOfBoundsException = e4;
                    i6 = i5;
                    throw new p3(i6, this.f2870e, 1, indexOutOfBoundsException);
                }
            } catch (IndexOutOfBoundsException e5) {
                indexOutOfBoundsException = e5;
                throw new p3(i6, this.f2870e, 1, indexOutOfBoundsException);
            }
        }
        i5 = i6 + 1;
        this.f2869d[i6] = (byte) i4;
        this.f2871f = i5;
    }

    @Override // com.google.android.gms.internal.play_billing.r3
    public final void q(int i4, long j4) {
        p(i4 << 3);
        r(j4);
    }

    @Override // com.google.android.gms.internal.play_billing.r3
    public final void r(long j4) {
        boolean z3;
        int i4;
        IndexOutOfBoundsException indexOutOfBoundsException;
        int i5 = this.f2871f;
        z3 = r3.f2976b;
        if (!z3 || this.f2870e - i5 < 10) {
            int i6 = i5;
            while ((j4 & (-128)) != 0) {
                try {
                    int i7 = i6 + 1;
                    try {
                        this.f2869d[i6] = (byte) (((int) j4) | 128);
                        j4 >>>= 7;
                        i6 = i7;
                    } catch (IndexOutOfBoundsException e4) {
                        indexOutOfBoundsException = e4;
                        i6 = i7;
                        throw new p3(i6, this.f2870e, 1, indexOutOfBoundsException);
                    }
                } catch (IndexOutOfBoundsException e5) {
                    indexOutOfBoundsException = e5;
                }
            }
            i4 = i6 + 1;
            try {
                this.f2869d[i6] = (byte) j4;
            } catch (IndexOutOfBoundsException e6) {
                indexOutOfBoundsException = e6;
                i6 = i4;
                throw new p3(i6, this.f2870e, 1, indexOutOfBoundsException);
            }
        } else {
            while ((j4 & (-128)) != 0) {
                x5.s(this.f2869d, i5, (byte) (((int) j4) | 128));
                j4 >>>= 7;
                i5++;
            }
            i4 = i5 + 1;
            x5.s(this.f2869d, i5, (byte) j4);
        }
        this.f2871f = i4;
    }

    public final void u(byte[] bArr, int i4, int i5) {
        try {
            System.arraycopy(bArr, i4, this.f2869d, this.f2871f, i5);
            this.f2871f += i5;
        } catch (IndexOutOfBoundsException e4) {
            throw new p3(this.f2871f, this.f2870e, i5, e4);
        }
    }

    public final void v(j3 j3Var) {
        p(j3Var.g());
        j3Var.i(this);
    }

    public final void w(String str) {
        int i4 = this.f2871f;
        try {
            int s3 = r3.s(str.length() * 3);
            int s4 = r3.s(str.length());
            if (s4 != s3) {
                p(b6.b(str));
                byte[] bArr = this.f2869d;
                int i5 = this.f2871f;
                this.f2871f = b6.a(str, bArr, i5, this.f2870e - i5);
                return;
            }
            int i6 = i4 + s4;
            this.f2871f = i6;
            int a4 = b6.a(str, this.f2869d, i6, this.f2870e - i6);
            this.f2871f = i4;
            p((a4 - i4) - s4);
            this.f2871f = a4;
        } catch (IndexOutOfBoundsException e4) {
            throw new p3(e4);
        }
    }
}
