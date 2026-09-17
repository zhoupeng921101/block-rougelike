package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class f6 extends d4 implements b5 {
    private static final f6 zzb;
    private int zzd;
    private int zze = 0;
    private Object zzf;
    private int zzg;
    private p6 zzh;
    private int zzi;

    static {
        f6 f6Var = new f6();
        zzb = f6Var;
        d4.j(f6.class, f6Var);
    }

    private f6() {
    }

    static /* synthetic */ void C(f6 f6Var, o7 o7Var) {
        o7Var.getClass();
        f6Var.zzf = o7Var;
        f6Var.zze = 7;
    }

    static /* synthetic */ void D(f6 f6Var, e8 e8Var) {
        e8Var.getClass();
        f6Var.zzf = e8Var;
        f6Var.zze = 6;
    }

    static /* synthetic */ void E(f6 f6Var, int i4) {
        f6Var.zzg = i4 - 1;
        f6Var.zzd |= 1;
    }

    public static d6 F() {
        return (d6) zzb.s();
    }

    public static f6 H(byte[] bArr) {
        return (f6) d4.w(zzb, bArr);
    }

    static /* synthetic */ void J(f6 f6Var, u6 u6Var) {
        f6Var.zzi = u6Var.a();
        f6Var.zzd |= 4;
    }

    static /* synthetic */ void K(f6 f6Var, p6 p6Var) {
        p6Var.getClass();
        f6Var.zzh = p6Var;
        f6Var.zzd |= 2;
    }

    public final o7 I() {
        return this.zze == 7 ? (o7) this.zzf : o7.D();
    }

    @Override // com.google.android.gms.internal.play_billing.d4
    protected final Object p(int i4, Object obj, Object obj2) {
        int i5 = i4 - 1;
        if (i5 == 0) {
            return (byte) 1;
        }
        if (i5 == 2) {
            return d4.A(zzb, "\u0004\u0006\u0001\u0001\u0001\u0007\u0006\u0000\u0000\u0000\u0001᠌\u0000\u0002ဉ\u0001\u0004<\u0000\u0005᠌\u0002\u0006<\u0000\u0007<\u0000", new Object[]{"zzf", a1.b2.c3.d4(787), "zzd", "zzg", g6.f2770a, "zzh", i7.class, "zzi", t6.f2997a, e8.class, o7.class});
        }
        if (i5 == 3) {
            return new f6();
        }
        e6 e6Var = null;
        if (i5 == 4) {
            return new d6(e6Var);
        }
        if (i5 == 5) {
            return zzb;
        }
        throw null;
    }
}
