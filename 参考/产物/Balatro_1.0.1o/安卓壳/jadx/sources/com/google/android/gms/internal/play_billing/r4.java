package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class r4 implements x4 {

    /* renamed from: a, reason: collision with root package name */
    private final x4[] f2979a;

    r4(x4... x4VarArr) {
        this.f2979a = x4VarArr;
    }

    @Override // com.google.android.gms.internal.play_billing.x4
    public final w4 a(Class cls) {
        for (int i4 = 0; i4 < 2; i4++) {
            x4 x4Var = this.f2979a[i4];
            if (x4Var.b(cls)) {
                return x4Var.a(cls);
            }
        }
        throw new UnsupportedOperationException(a1.b2.c3.d4(693).concat(cls.getName()));
    }

    @Override // com.google.android.gms.internal.play_billing.x4
    public final boolean b(Class cls) {
        for (int i4 = 0; i4 < 2; i4++) {
            if (this.f2979a[i4].b(cls)) {
                return true;
            }
        }
        return false;
    }
}
