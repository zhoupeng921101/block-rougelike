package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class e3 extends g3 {

    /* renamed from: g, reason: collision with root package name */
    private final byte[] f2750g;

    /* renamed from: h, reason: collision with root package name */
    private final int f2751h;

    /* renamed from: i, reason: collision with root package name */
    private final int f2752i;

    e3(byte[] bArr, int i4, int i5) {
        super(null);
        j3.k(i4, i4 + i5, bArr.length);
        this.f2750g = bArr;
        this.f2751h = i4;
        this.f2752i = i5;
    }

    @Override // com.google.android.gms.internal.play_billing.j3
    public final byte a(int i4) {
        int i5 = this.f2752i;
        if (((i5 - (i4 + 1)) | i4) >= 0) {
            return this.f2750g[this.f2751h + i4];
        }
        if (i4 < 0) {
            throw new ArrayIndexOutOfBoundsException("Index < 0: " + i4);
        }
        throw new ArrayIndexOutOfBoundsException("Index > length: " + i4 + ", " + i5);
    }

    @Override // com.google.android.gms.internal.play_billing.j3
    final byte e(int i4) {
        return this.f2750g[this.f2751h + i4];
    }

    @Override // com.google.android.gms.internal.play_billing.j3
    protected final int f(int i4, int i5, int i6) {
        return k4.b(i4, this.f2750g, this.f2751h, i6);
    }

    @Override // com.google.android.gms.internal.play_billing.j3
    public final int g() {
        return this.f2752i;
    }

    @Override // com.google.android.gms.internal.play_billing.j3
    public final j3 h(int i4, int i5) {
        int k4 = j3.k(i4, i5, this.f2752i);
        return k4 == 0 ? j3.f2809f : new e3(this.f2750g, this.f2751h + i4, k4);
    }

    @Override // com.google.android.gms.internal.play_billing.j3
    final void i(b3 b3Var) {
        ((n3) b3Var).u(this.f2750g, this.f2751h, this.f2752i);
    }

    @Override // com.google.android.gms.internal.play_billing.j3
    protected final boolean j(j3 j3Var) {
        byte[] bArr;
        boolean z3 = j3Var instanceof h3;
        if (!z3 && !(j3Var instanceof e3)) {
            return j3Var.j(this);
        }
        int i4 = this.f2752i;
        if (i4 > j3Var.g()) {
            throw new IllegalArgumentException("Length too large: " + i4 + i4);
        }
        if (i4 > j3Var.g()) {
            throw new IllegalArgumentException("Ran off end of other: 0, " + i4 + ", " + j3Var.g());
        }
        if (z3) {
            byte[] bArr2 = this.f2750g;
            int i5 = this.f2751h;
            bArr = ((h3) j3Var).f2780g;
            return j3.m(bArr2, i5, bArr, 0, i4);
        }
        if (j3Var instanceof e3) {
            e3 e3Var = (e3) j3Var;
            return j3.m(this.f2750g, this.f2751h, e3Var.f2750g, e3Var.f2751h, i4);
        }
        j3 h4 = j3Var.h(0, i4);
        int i6 = this.f2751h;
        return h4.equals(h(i6, i4 + i6));
    }
}
