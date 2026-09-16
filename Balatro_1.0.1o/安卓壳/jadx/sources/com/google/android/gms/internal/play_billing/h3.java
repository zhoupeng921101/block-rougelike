package com.google.android.gms.internal.play_billing;

import java.util.Arrays;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class h3 extends g3 {

    /* renamed from: g, reason: collision with root package name */
    private final byte[] f2780g;

    h3(byte[] bArr) {
        super(null);
        bArr.getClass();
        this.f2780g = bArr;
    }

    @Override // com.google.android.gms.internal.play_billing.j3
    public final byte a(int i4) {
        return this.f2780g[i4];
    }

    @Override // com.google.android.gms.internal.play_billing.j3
    final byte e(int i4) {
        return this.f2780g[i4];
    }

    @Override // com.google.android.gms.internal.play_billing.j3
    protected final int f(int i4, int i5, int i6) {
        return k4.b(i4, this.f2780g, 0, i6);
    }

    @Override // com.google.android.gms.internal.play_billing.j3
    public final int g() {
        return this.f2780g.length;
    }

    @Override // com.google.android.gms.internal.play_billing.j3
    public final j3 h(int i4, int i5) {
        byte[] bArr = this.f2780g;
        int k4 = j3.k(0, i5, bArr.length);
        return k4 == 0 ? j3.f2809f : new e3(bArr, 0, k4);
    }

    @Override // com.google.android.gms.internal.play_billing.j3
    final void i(b3 b3Var) {
        byte[] bArr = this.f2780g;
        ((n3) b3Var).u(bArr, 0, bArr.length);
    }

    @Override // com.google.android.gms.internal.play_billing.j3
    protected final boolean j(j3 j3Var) {
        boolean z3 = j3Var instanceof h3;
        if (z3) {
            return Arrays.equals(this.f2780g, ((h3) j3Var).f2780g);
        }
        boolean z4 = j3Var instanceof e3;
        if (!z4) {
            return j3Var.j(this);
        }
        byte[] bArr = this.f2780g;
        int g4 = j3Var.g();
        int length = bArr.length;
        if (length > g4) {
            throw new IllegalArgumentException("Length too large: " + length + length);
        }
        if (length <= j3Var.g()) {
            if (z3) {
                return j3.m(bArr, 0, ((h3) j3Var).f2780g, 0, length);
            }
            if (!z4) {
                return j3Var.h(0, length).equals(h(0, length));
            }
            e3 e3Var = (e3) j3Var;
            return j3.m(bArr, 0, e3Var.f2750g, e3Var.f2751h, length);
        }
        throw new IllegalArgumentException("Ran off end of other: 0, " + length + a1.b2.c3.d4(20) + j3Var.g());
    }
}
