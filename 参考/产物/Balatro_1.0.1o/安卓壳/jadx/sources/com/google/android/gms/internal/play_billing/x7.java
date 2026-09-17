package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class x7 extends d4 implements b5 {
    private static final x7 zzb;
    private int zzd;
    private p6 zze;
    private long zzf;

    static {
        x7 x7Var = new x7();
        zzb = x7Var;
        d4.j(x7.class, x7Var);
    }

    private x7() {
    }

    public static v7 C() {
        return (v7) zzb.s();
    }

    static /* synthetic */ void E(x7 x7Var, p6 p6Var) {
        p6Var.getClass();
        x7Var.zze = p6Var;
        x7Var.zzd |= 1;
    }

    static /* synthetic */ void F(x7 x7Var, long j4) {
        x7Var.zzd |= 2;
        x7Var.zzf = j4;
    }

    @Override // com.google.android.gms.internal.play_billing.d4
    protected final Object p(int i4, Object obj, Object obj2) {
        int i5 = i4 - 1;
        if (i5 == 0) {
            return (byte) 1;
        }
        if (i5 == 2) {
            return d4.A(zzb, "\u0004\u0002\u0000\u0001\u0001\u0002\u0002\u0000\u0000\u0000\u0001ဉ\u0000\u0002ဂ\u0001", new Object[]{"zzd", a1.b2.c3.d4(1124), "zzf"});
        }
        if (i5 == 3) {
            return new x7();
        }
        w7 w7Var = null;
        if (i5 == 4) {
            return new v7(w7Var);
        }
        if (i5 == 5) {
            return zzb;
        }
        throw null;
    }
}
