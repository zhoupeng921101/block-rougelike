package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class k6 extends d4 implements b5 {
    private static final k6 zzb;
    private int zzd;
    private int zze = 0;
    private Object zzf;
    private int zzg;
    private int zzh;

    static {
        k6 k6Var = new k6();
        zzb = k6Var;
        d4.j(k6.class, k6Var);
    }

    private k6() {
    }

    static /* synthetic */ void C(k6 k6Var, int i4) {
        k6Var.zzg = i4 - 1;
        k6Var.zzd |= 1;
    }

    public static h6 D() {
        return (h6) zzb.s();
    }

    static /* synthetic */ void G(k6 k6Var, u6 u6Var) {
        k6Var.zzh = u6Var.a();
        k6Var.zzd |= 2;
    }

    static /* synthetic */ void H(k6 k6Var, o7 o7Var) {
        o7Var.getClass();
        k6Var.zzf = o7Var;
        k6Var.zze = 4;
    }

    static /* synthetic */ void I(k6 k6Var, e8 e8Var) {
        e8Var.getClass();
        k6Var.zzf = e8Var;
        k6Var.zze = 3;
    }

    public final o7 F() {
        return this.zze == 4 ? (o7) this.zzf : o7.D();
    }

    @Override // com.google.android.gms.internal.play_billing.d4
    protected final Object p(int i4, Object obj, Object obj2) {
        int i5 = i4 - 1;
        if (i5 == 0) {
            return (byte) 1;
        }
        if (i5 == 2) {
            return d4.A(zzb, "\u0004\u0005\u0001\u0001\u0001\u0005\u0005\u0000\u0000\u0000\u0001᠌\u0000\u0002<\u0000\u0003<\u0000\u0004<\u0000\u0005᠌\u0001", new Object[]{"zzf", "zze", "zzd", "zzg", g6.f2770a, i7.class, e8.class, o7.class, "zzh", t6.f2997a});
        }
        if (i5 == 3) {
            return new k6();
        }
        i6 i6Var = null;
        if (i5 == 4) {
            return new h6(i6Var);
        }
        if (i5 == 5) {
            return zzb;
        }
        throw null;
    }
}
