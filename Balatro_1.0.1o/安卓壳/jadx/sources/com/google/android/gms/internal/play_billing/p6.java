package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class p6 extends d4 implements b5 {
    private static final p6 zzb;
    private int zzd;
    private int zze;
    private int zzg;
    private int zzi;
    private int zzj;
    private String zzf = "";
    private String zzh = "";

    static {
        p6 p6Var = new p6();
        zzb = p6Var;
        d4.j(p6.class, p6Var);
    }

    private p6() {
    }

    static /* synthetic */ void C(p6 p6Var, int i4) {
        p6Var.zzd |= 1;
        p6Var.zze = i4;
    }

    public static l6 D() {
        return (l6) zzb.s();
    }

    static /* synthetic */ void F(p6 p6Var, String str) {
        p6Var.zzd |= 8;
        p6Var.zzh = str;
    }

    static /* synthetic */ void G(p6 p6Var, String str) {
        str.getClass();
        p6Var.zzd |= 2;
        p6Var.zzf = str;
    }

    static /* synthetic */ void H(p6 p6Var, int i4) {
        p6Var.zzd |= 32;
        p6Var.zzj = 0;
    }

    static /* synthetic */ void I(p6 p6Var, int i4) {
        p6Var.zzd |= 16;
        p6Var.zzi = i4;
    }

    static /* synthetic */ void J(p6 p6Var, n6 n6Var) {
        p6Var.zzg = n6Var.a();
        p6Var.zzd |= 4;
    }

    @Override // com.google.android.gms.internal.play_billing.d4
    protected final Object p(int i4, Object obj, Object obj2) {
        int i5 = i4 - 1;
        if (i5 == 0) {
            return (byte) 1;
        }
        if (i5 == 2) {
            return d4.A(zzb, "\u0004\u0006\u0000\u0001\u0001\b\u0006\u0000\u0000\u0000\u0001င\u0000\u0002ဈ\u0001\u0004᠌\u0002\u0005ဈ\u0003\u0007င\u0004\bင\u0005", new Object[]{a1.b2.c3.d4(1123), "zze", a1.b2.c3.d4(990), "zzg", m6.f2866a, "zzh", "zzi", "zzj"});
        }
        if (i5 == 3) {
            return new p6();
        }
        o6 o6Var = null;
        if (i5 == 4) {
            return new l6(o6Var);
        }
        if (i5 == 5) {
            return zzb;
        }
        throw null;
    }
}
