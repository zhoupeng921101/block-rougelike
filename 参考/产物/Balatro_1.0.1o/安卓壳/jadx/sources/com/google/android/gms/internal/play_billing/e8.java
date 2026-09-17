package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class e8 extends d4 implements b5 {
    private static final e8 zzb;
    private int zzd;
    private int zze;
    private boolean zzf;
    private long zzg;
    private boolean zzh;
    private int zzi;
    private int zzj;

    static {
        e8 e8Var = new e8();
        zzb = e8Var;
        d4.j(e8.class, e8Var);
    }

    private e8() {
    }

    public static c8 C() {
        return (c8) zzb.s();
    }

    static /* synthetic */ void E(e8 e8Var, boolean z3) {
        e8Var.zzd |= 8;
        e8Var.zzh = z3;
    }

    static /* synthetic */ void F(e8 e8Var, int i4) {
        e8Var.zzd |= 16;
        e8Var.zzi = i4;
    }

    static /* synthetic */ void G(e8 e8Var, long j4) {
        e8Var.zzd |= 4;
        e8Var.zzg = j4;
    }

    static /* synthetic */ void H(e8 e8Var, int i4) {
        e8Var.zzd |= 32;
        e8Var.zzj = 0;
    }

    static /* synthetic */ void I(e8 e8Var, boolean z3) {
        e8Var.zzd |= 2;
        e8Var.zzf = true;
    }

    @Override // com.google.android.gms.internal.play_billing.d4
    protected final Object p(int i4, Object obj, Object obj2) {
        int i5 = i4 - 1;
        if (i5 == 0) {
            return (byte) 1;
        }
        if (i5 == 2) {
            return d4.A(zzb, "\u0004\u0006\u0000\u0001\u0001\u0006\u0006\u0000\u0000\u0000\u0001င\u0000\u0002ဇ\u0001\u0003ဂ\u0002\u0004ဇ\u0003\u0005င\u0004\u0006င\u0005", new Object[]{"zzd", "zze", "zzf", "zzg", "zzh", a1.b2.c3.d4(1372), "zzj"});
        }
        if (i5 == 3) {
            return new e8();
        }
        d8 d8Var = null;
        if (i5 == 4) {
            return new c8(d8Var);
        }
        if (i5 == 5) {
            return zzb;
        }
        throw null;
    }
}
