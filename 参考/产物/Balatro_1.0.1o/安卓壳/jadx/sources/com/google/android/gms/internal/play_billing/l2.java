package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class l2 extends d4 implements b5 {
    private static final l2 zzb;
    private int zzd;
    private r2 zze;
    private r2 zzf;
    private int zzg;

    static {
        l2 l2Var = new l2();
        zzb = l2Var;
        d4.j(l2.class, l2Var);
    }

    private l2() {
    }

    @Override // com.google.android.gms.internal.play_billing.d4
    protected final Object p(int i4, Object obj, Object obj2) {
        int i5 = i4 - 1;
        if (i5 == 0) {
            return (byte) 1;
        }
        if (i5 == 2) {
            return d4.A(zzb, "\u0004\u0003\u0000\u0001\u0001\u0003\u0003\u0000\u0000\u0000\u0001ဉ\u0000\u0002ဉ\u0001\u0003᠌\u0002", new Object[]{"zzd", "zze", "zzf", "zzg", u2.a()});
        }
        if (i5 == 3) {
            return new l2();
        }
        o2 o2Var = null;
        if (i5 == 4) {
            return new k2(o2Var);
        }
        if (i5 == 5) {
            return zzb;
        }
        throw null;
    }
}
