package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class r7 extends d4 implements b5 {
    private static final r7 zzb;
    private int zzd;
    private int zze = 0;
    private Object zzf;
    private b7 zzg;
    private e7 zzh;

    static {
        r7 r7Var = new r7();
        zzb = r7Var;
        d4.j(r7.class, r7Var);
    }

    private r7() {
    }

    static /* synthetic */ void C(r7 r7Var, b8 b8Var) {
        r7Var.zzf = b8Var;
        r7Var.zze = 4;
    }

    public static p7 D() {
        return (p7) zzb.s();
    }

    static /* synthetic */ void F(r7 r7Var, f6 f6Var) {
        r7Var.zzf = f6Var;
        r7Var.zze = 2;
    }

    static /* synthetic */ void G(r7 r7Var, k6 k6Var) {
        r7Var.zzf = k6Var;
        r7Var.zze = 3;
    }

    static /* synthetic */ void H(r7 r7Var, s6 s6Var) {
        s6Var.getClass();
        r7Var.zzf = s6Var;
        r7Var.zze = 7;
    }

    static /* synthetic */ void I(r7 r7Var, b7 b7Var) {
        b7Var.getClass();
        r7Var.zzg = b7Var;
        r7Var.zzd |= 1;
    }

    static /* synthetic */ void J(r7 r7Var, x7 x7Var) {
        x7Var.getClass();
        r7Var.zzf = x7Var;
        r7Var.zze = 8;
    }

    @Override // com.google.android.gms.internal.play_billing.d4
    protected final Object p(int i4, Object obj, Object obj2) {
        int i5 = i4 - 1;
        if (i5 == 0) {
            return (byte) 1;
        }
        if (i5 == 2) {
            return d4.A(zzb, "\u0004\b\u0001\u0001\u0001\b\b\u0000\u0000\u0000\u0001ဉ\u0000\u0002<\u0000\u0003<\u0000\u0004<\u0000\u0005<\u0000\u0006ဉ\u0001\u0007<\u0000\b<\u0000", new Object[]{"zzf", "zze", a1.b2.c3.d4(932), "zzg", f6.class, k6.class, b8.class, y6.class, "zzh", s6.class, x7.class});
        }
        if (i5 == 3) {
            return new r7();
        }
        q7 q7Var = null;
        if (i5 == 4) {
            return new p7(q7Var);
        }
        if (i5 == 5) {
            return zzb;
        }
        throw null;
    }
}
