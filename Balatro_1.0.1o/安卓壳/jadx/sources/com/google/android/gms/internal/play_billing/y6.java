package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class y6 extends d4 implements b5 {
    private static final y6 zzb;
    private int zzd;
    private int zzf;
    private p6 zzi;
    private boolean zzj;
    private boolean zzk;
    private String zze = "";
    private h4 zzg = d4.x();
    private i4 zzh = d4.y();

    static {
        y6 y6Var = new y6();
        zzb = y6Var;
        d4.j(y6.class, y6Var);
    }

    private y6() {
    }

    @Override // com.google.android.gms.internal.play_billing.d4
    protected final Object p(int i4, Object obj, Object obj2) {
        int i5 = i4 - 1;
        if (i5 == 0) {
            return (byte) 1;
        }
        if (i5 == 2) {
            return d4.A(zzb, "\u0004\u0007\u0000\u0001\u0001\u0007\u0007\u0000\u0002\u0000\u0001ဈ\u0000\u0002᠌\u0001\u0003ࠬ\u0004\u001b\u0005ဉ\u0002\u0006ဇ\u0003\u0007ဇ\u0004", new Object[]{"zzd", "zze", "zzf", w6.f3020a, "zzg", t6.f2997a, "zzh", u7.class, a1.b2.c3.d4(578), "zzj", "zzk"});
        }
        if (i5 == 3) {
            return new y6();
        }
        x6 x6Var = null;
        if (i5 == 4) {
            return new v6(x6Var);
        }
        if (i5 == 5) {
            return zzb;
        }
        throw null;
    }
}
