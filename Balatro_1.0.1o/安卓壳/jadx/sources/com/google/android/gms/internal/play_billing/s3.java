package com.google.android.gms.internal.play_billing;

import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class s3 implements c6 {

    /* renamed from: a, reason: collision with root package name */
    private final r3 f2989a;

    private s3(r3 r3Var) {
        byte[] bArr = k4.f2839b;
        this.f2989a = r3Var;
        r3Var.f2978a = this;
    }

    public static s3 K(r3 r3Var) {
        Object obj = r3Var.f2978a;
        return obj != null ? (s3) obj : new s3(r3Var);
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void A(int i4, Object obj, k5 k5Var) {
        r3 r3Var = this.f2989a;
        w2 w2Var = (w2) obj;
        r3Var.n(i4, 2);
        r3Var.p(w2Var.c(k5Var));
        k5Var.h(w2Var, this);
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void B(int i4, long j4) {
        this.f2989a.i(i4, j4);
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void C(int i4, List list, boolean z3) {
        int i5 = 0;
        if (!(list instanceof e4)) {
            if (!z3) {
                while (i5 < list.size()) {
                    r3 r3Var = this.f2989a;
                    int intValue = ((Integer) list.get(i5)).intValue();
                    r3Var.o(i4, (intValue >> 31) ^ (intValue + intValue));
                    i5++;
                }
                return;
            }
            r3 r3Var2 = this.f2989a;
            r3Var2.n(i4, 2);
            int i6 = 0;
            for (int i7 = 0; i7 < list.size(); i7++) {
                int intValue2 = ((Integer) list.get(i7)).intValue();
                i6 += r3.s((intValue2 >> 31) ^ (intValue2 + intValue2));
            }
            r3Var2.p(i6);
            while (i5 < list.size()) {
                int intValue3 = ((Integer) list.get(i5)).intValue();
                r3Var2.p((intValue3 >> 31) ^ (intValue3 + intValue3));
                i5++;
            }
            return;
        }
        e4 e4Var = (e4) list;
        if (!z3) {
            while (i5 < e4Var.size()) {
                r3 r3Var3 = this.f2989a;
                int e4 = e4Var.e(i5);
                r3Var3.o(i4, (e4 >> 31) ^ (e4 + e4));
                i5++;
            }
            return;
        }
        r3 r3Var4 = this.f2989a;
        r3Var4.n(i4, 2);
        int i8 = 0;
        for (int i9 = 0; i9 < e4Var.size(); i9++) {
            int e5 = e4Var.e(i9);
            i8 += r3.s((e5 >> 31) ^ (e5 + e5));
        }
        r3Var4.p(i8);
        while (i5 < e4Var.size()) {
            int e6 = e4Var.e(i5);
            r3Var4.p((e6 >> 31) ^ (e6 + e6));
            i5++;
        }
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void D(int i4, int i5) {
        this.f2989a.k(i4, i5);
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void E(int i4, List list, boolean z3) {
        int i5 = 0;
        if (!(list instanceof e4)) {
            if (!z3) {
                while (i5 < list.size()) {
                    this.f2989a.k(i4, ((Integer) list.get(i5)).intValue());
                    i5++;
                }
                return;
            }
            r3 r3Var = this.f2989a;
            r3Var.n(i4, 2);
            int i6 = 0;
            for (int i7 = 0; i7 < list.size(); i7++) {
                i6 += r3.t(((Integer) list.get(i7)).intValue());
            }
            r3Var.p(i6);
            while (i5 < list.size()) {
                r3Var.l(((Integer) list.get(i5)).intValue());
                i5++;
            }
            return;
        }
        e4 e4Var = (e4) list;
        if (!z3) {
            while (i5 < e4Var.size()) {
                this.f2989a.k(i4, e4Var.e(i5));
                i5++;
            }
            return;
        }
        r3 r3Var2 = this.f2989a;
        r3Var2.n(i4, 2);
        int i8 = 0;
        for (int i9 = 0; i9 < e4Var.size(); i9++) {
            i8 += r3.t(e4Var.e(i9));
        }
        r3Var2.p(i8);
        while (i5 < e4Var.size()) {
            r3Var2.l(e4Var.e(i5));
            i5++;
        }
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void F(int i4, List list, boolean z3) {
        int i5 = 0;
        if (!z3) {
            while (i5 < list.size()) {
                this.f2989a.q(i4, ((Long) list.get(i5)).longValue());
                i5++;
            }
            return;
        }
        r3 r3Var = this.f2989a;
        r3Var.n(i4, 2);
        int i6 = 0;
        for (int i7 = 0; i7 < list.size(); i7++) {
            i6 += r3.t(((Long) list.get(i7)).longValue());
        }
        r3Var.p(i6);
        while (i5 < list.size()) {
            r3Var.r(((Long) list.get(i5)).longValue());
            i5++;
        }
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void G(int i4, int i5) {
        this.f2989a.o(i4, (i5 >> 31) ^ (i5 + i5));
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void H(int i4) {
        this.f2989a.n(i4, 4);
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void I(int i4, String str) {
        this.f2989a.m(i4, str);
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void J(int i4, int i5) {
        this.f2989a.k(i4, i5);
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void a(int i4, long j4) {
        this.f2989a.q(i4, j4);
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void b(int i4, double d4) {
        this.f2989a.i(i4, Double.doubleToRawLongBits(d4));
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void c(int i4, List list, boolean z3) {
        int i5 = 0;
        if (!(list instanceof e4)) {
            if (!z3) {
                while (i5 < list.size()) {
                    this.f2989a.g(i4, ((Integer) list.get(i5)).intValue());
                    i5++;
                }
                return;
            }
            r3 r3Var = this.f2989a;
            r3Var.n(i4, 2);
            int i6 = 0;
            for (int i7 = 0; i7 < list.size(); i7++) {
                ((Integer) list.get(i7)).getClass();
                i6 += 4;
            }
            r3Var.p(i6);
            while (i5 < list.size()) {
                r3Var.h(((Integer) list.get(i5)).intValue());
                i5++;
            }
            return;
        }
        e4 e4Var = (e4) list;
        if (!z3) {
            while (i5 < e4Var.size()) {
                this.f2989a.g(i4, e4Var.e(i5));
                i5++;
            }
            return;
        }
        r3 r3Var2 = this.f2989a;
        r3Var2.n(i4, 2);
        int i8 = 0;
        for (int i9 = 0; i9 < e4Var.size(); i9++) {
            e4Var.e(i9);
            i8 += 4;
        }
        r3Var2.p(i8);
        while (i5 < e4Var.size()) {
            r3Var2.h(e4Var.e(i5));
            i5++;
        }
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void d(int i4, List list) {
        for (int i5 = 0; i5 < list.size(); i5++) {
            this.f2989a.f(i4, (j3) list.get(i5));
        }
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void e(int i4, List list, boolean z3) {
        int i5 = 0;
        if (!z3) {
            while (i5 < list.size()) {
                this.f2989a.i(i4, ((Long) list.get(i5)).longValue());
                i5++;
            }
            return;
        }
        r3 r3Var = this.f2989a;
        r3Var.n(i4, 2);
        int i6 = 0;
        for (int i7 = 0; i7 < list.size(); i7++) {
            ((Long) list.get(i7)).getClass();
            i6 += 8;
        }
        r3Var.p(i6);
        while (i5 < list.size()) {
            r3Var.j(((Long) list.get(i5)).longValue());
            i5++;
        }
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void f(int i4, float f4) {
        this.f2989a.g(i4, Float.floatToRawIntBits(f4));
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void g(int i4) {
        this.f2989a.n(i4, 3);
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void h(int i4, List list, boolean z3) {
        int i5 = 0;
        if (!z3) {
            while (i5 < list.size()) {
                this.f2989a.i(i4, ((Long) list.get(i5)).longValue());
                i5++;
            }
            return;
        }
        r3 r3Var = this.f2989a;
        r3Var.n(i4, 2);
        int i6 = 0;
        for (int i7 = 0; i7 < list.size(); i7++) {
            ((Long) list.get(i7)).getClass();
            i6 += 8;
        }
        r3Var.p(i6);
        while (i5 < list.size()) {
            r3Var.j(((Long) list.get(i5)).longValue());
            i5++;
        }
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void i(int i4, List list, boolean z3) {
        int i5 = 0;
        if (!z3) {
            while (i5 < list.size()) {
                this.f2989a.q(i4, ((Long) list.get(i5)).longValue());
                i5++;
            }
            return;
        }
        r3 r3Var = this.f2989a;
        r3Var.n(i4, 2);
        int i6 = 0;
        for (int i7 = 0; i7 < list.size(); i7++) {
            i6 += r3.t(((Long) list.get(i7)).longValue());
        }
        r3Var.p(i6);
        while (i5 < list.size()) {
            r3Var.r(((Long) list.get(i5)).longValue());
            i5++;
        }
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void j(int i4, List list, boolean z3) {
        int i5 = 0;
        if (!z3) {
            while (i5 < list.size()) {
                r3 r3Var = this.f2989a;
                long longValue = ((Long) list.get(i5)).longValue();
                r3Var.q(i4, (longValue >> 63) ^ (longValue + longValue));
                i5++;
            }
            return;
        }
        r3 r3Var2 = this.f2989a;
        r3Var2.n(i4, 2);
        int i6 = 0;
        for (int i7 = 0; i7 < list.size(); i7++) {
            long longValue2 = ((Long) list.get(i7)).longValue();
            i6 += r3.t((longValue2 >> 63) ^ (longValue2 + longValue2));
        }
        r3Var2.p(i6);
        while (i5 < list.size()) {
            long longValue3 = ((Long) list.get(i5)).longValue();
            r3Var2.r((longValue3 >> 63) ^ (longValue3 + longValue3));
            i5++;
        }
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void k(int i4, int i5) {
        this.f2989a.g(i4, i5);
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void l(int i4, boolean z3) {
        this.f2989a.e(i4, z3);
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void m(int i4, long j4) {
        this.f2989a.q(i4, (j4 >> 63) ^ (j4 + j4));
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void n(int i4, j3 j3Var) {
        this.f2989a.f(i4, j3Var);
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void o(int i4, List list, boolean z3) {
        int i5 = 0;
        if (!(list instanceof e4)) {
            if (!z3) {
                while (i5 < list.size()) {
                    this.f2989a.o(i4, ((Integer) list.get(i5)).intValue());
                    i5++;
                }
                return;
            }
            r3 r3Var = this.f2989a;
            r3Var.n(i4, 2);
            int i6 = 0;
            for (int i7 = 0; i7 < list.size(); i7++) {
                i6 += r3.s(((Integer) list.get(i7)).intValue());
            }
            r3Var.p(i6);
            while (i5 < list.size()) {
                r3Var.p(((Integer) list.get(i5)).intValue());
                i5++;
            }
            return;
        }
        e4 e4Var = (e4) list;
        if (!z3) {
            while (i5 < e4Var.size()) {
                this.f2989a.o(i4, e4Var.e(i5));
                i5++;
            }
            return;
        }
        r3 r3Var2 = this.f2989a;
        r3Var2.n(i4, 2);
        int i8 = 0;
        for (int i9 = 0; i9 < e4Var.size(); i9++) {
            i8 += r3.s(e4Var.e(i9));
        }
        r3Var2.p(i8);
        while (i5 < e4Var.size()) {
            r3Var2.p(e4Var.e(i5));
            i5++;
        }
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void p(int i4, Object obj, k5 k5Var) {
        r3 r3Var = this.f2989a;
        r3Var.n(i4, 3);
        k5Var.h((w2) obj, this);
        r3Var.n(i4, 4);
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void q(int i4, long j4) {
        this.f2989a.i(i4, j4);
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void r(int i4, long j4) {
        this.f2989a.q(i4, j4);
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void s(int i4, List list) {
        for (int i5 = 0; i5 < list.size(); i5++) {
            this.f2989a.m(i4, (String) list.get(i5));
        }
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void t(int i4, List list, boolean z3) {
        int i5 = 0;
        if (!z3) {
            while (i5 < list.size()) {
                this.f2989a.e(i4, ((Boolean) list.get(i5)).booleanValue());
                i5++;
            }
            return;
        }
        r3 r3Var = this.f2989a;
        r3Var.n(i4, 2);
        int i6 = 0;
        for (int i7 = 0; i7 < list.size(); i7++) {
            ((Boolean) list.get(i7)).getClass();
            i6++;
        }
        r3Var.p(i6);
        while (i5 < list.size()) {
            r3Var.d(((Boolean) list.get(i5)).booleanValue() ? (byte) 1 : (byte) 0);
            i5++;
        }
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void u(int i4, int i5) {
        this.f2989a.g(i4, i5);
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void v(int i4, List list, boolean z3) {
        int i5 = 0;
        if (!z3) {
            while (i5 < list.size()) {
                this.f2989a.i(i4, Double.doubleToRawLongBits(((Double) list.get(i5)).doubleValue()));
                i5++;
            }
            return;
        }
        r3 r3Var = this.f2989a;
        r3Var.n(i4, 2);
        int i6 = 0;
        for (int i7 = 0; i7 < list.size(); i7++) {
            ((Double) list.get(i7)).getClass();
            i6 += 8;
        }
        r3Var.p(i6);
        while (i5 < list.size()) {
            r3Var.j(Double.doubleToRawLongBits(((Double) list.get(i5)).doubleValue()));
            i5++;
        }
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void w(int i4, int i5) {
        this.f2989a.o(i4, i5);
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void x(int i4, List list, boolean z3) {
        int i5 = 0;
        if (!(list instanceof e4)) {
            if (!z3) {
                while (i5 < list.size()) {
                    this.f2989a.g(i4, ((Integer) list.get(i5)).intValue());
                    i5++;
                }
                return;
            }
            r3 r3Var = this.f2989a;
            r3Var.n(i4, 2);
            int i6 = 0;
            for (int i7 = 0; i7 < list.size(); i7++) {
                ((Integer) list.get(i7)).getClass();
                i6 += 4;
            }
            r3Var.p(i6);
            while (i5 < list.size()) {
                r3Var.h(((Integer) list.get(i5)).intValue());
                i5++;
            }
            return;
        }
        e4 e4Var = (e4) list;
        if (!z3) {
            while (i5 < e4Var.size()) {
                this.f2989a.g(i4, e4Var.e(i5));
                i5++;
            }
            return;
        }
        r3 r3Var2 = this.f2989a;
        r3Var2.n(i4, 2);
        int i8 = 0;
        for (int i9 = 0; i9 < e4Var.size(); i9++) {
            e4Var.e(i9);
            i8 += 4;
        }
        r3Var2.p(i8);
        while (i5 < e4Var.size()) {
            r3Var2.h(e4Var.e(i5));
            i5++;
        }
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void y(int i4, List list, boolean z3) {
        int i5 = 0;
        if (!z3) {
            while (i5 < list.size()) {
                this.f2989a.g(i4, Float.floatToRawIntBits(((Float) list.get(i5)).floatValue()));
                i5++;
            }
            return;
        }
        r3 r3Var = this.f2989a;
        r3Var.n(i4, 2);
        int i6 = 0;
        for (int i7 = 0; i7 < list.size(); i7++) {
            ((Float) list.get(i7)).getClass();
            i6 += 4;
        }
        r3Var.p(i6);
        while (i5 < list.size()) {
            r3Var.h(Float.floatToRawIntBits(((Float) list.get(i5)).floatValue()));
            i5++;
        }
    }

    @Override // com.google.android.gms.internal.play_billing.c6
    public final void z(int i4, List list, boolean z3) {
        int i5 = 0;
        if (!(list instanceof e4)) {
            if (!z3) {
                while (i5 < list.size()) {
                    this.f2989a.k(i4, ((Integer) list.get(i5)).intValue());
                    i5++;
                }
                return;
            }
            r3 r3Var = this.f2989a;
            r3Var.n(i4, 2);
            int i6 = 0;
            for (int i7 = 0; i7 < list.size(); i7++) {
                i6 += r3.t(((Integer) list.get(i7)).intValue());
            }
            r3Var.p(i6);
            while (i5 < list.size()) {
                r3Var.l(((Integer) list.get(i5)).intValue());
                i5++;
            }
            return;
        }
        e4 e4Var = (e4) list;
        if (!z3) {
            while (i5 < e4Var.size()) {
                this.f2989a.k(i4, e4Var.e(i5));
                i5++;
            }
            return;
        }
        r3 r3Var2 = this.f2989a;
        r3Var2.n(i4, 2);
        int i8 = 0;
        for (int i9 = 0; i9 < e4Var.size(); i9++) {
            i8 += r3.t(e4Var.e(i9));
        }
        r3Var2.p(i8);
        while (i5 < e4Var.size()) {
            r3Var2.l(e4Var.e(i5));
            i5++;
        }
    }
}
