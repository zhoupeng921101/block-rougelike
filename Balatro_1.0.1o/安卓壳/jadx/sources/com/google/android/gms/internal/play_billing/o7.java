package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class o7 extends d4 implements b5 {
    private static final o7 zzb;
    private int zzd;
    private i4 zze = d4.y();
    private String zzf = "";
    private boolean zzg;

    static {
        o7 o7Var = new o7();
        zzb = o7Var;
        d4.j(o7.class, o7Var);
    }

    private o7() {
    }

    public static o7 D() {
        return zzb;
    }

    static /* synthetic */ void E(o7 o7Var, boolean z3) {
        o7Var.zzd |= 2;
        o7Var.zzg = z3;
    }

    @Override // com.google.android.gms.internal.play_billing.d4
    protected final Object p(int i4, Object obj, Object obj2) {
        int i5 = i4 - 1;
        if (i5 == 0) {
            return (byte) 1;
        }
        if (i5 == 2) {
            return d4.A(zzb, "\u0004\u0003\u0000\u0001\u0001\u0003\u0003\u0000\u0001\u0000\u0001\u001b\u0002ဈ\u0000\u0003ဇ\u0001", new Object[]{a1.b2.c3.d4(526), a1.b2.c3.d4(885), m7.class, "zzf", "zzg"});
        }
        if (i5 == 3) {
            return new o7();
        }
        n7 n7Var = null;
        if (i5 == 4) {
            return new j7(n7Var);
        }
        if (i5 == 5) {
            return zzb;
        }
        throw null;
    }
}
