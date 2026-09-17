package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class r2 extends d4 implements b5 {
    private static final r2 zzb;
    private int zzd;
    private String zze = a1.b2.c3.d4(252);

    static {
        r2 r2Var = new r2();
        zzb = r2Var;
        d4.j(r2.class, r2Var);
    }

    private r2() {
    }

    @Override // com.google.android.gms.internal.play_billing.d4
    protected final Object p(int i4, Object obj, Object obj2) {
        int i5 = i4 - 1;
        if (i5 == 0) {
            return (byte) 1;
        }
        if (i5 == 2) {
            return d4.A(zzb, "\u0004\u0001\u0000\u0001\u0001\u0001\u0001\u0000\u0000\u0000\u0001ဈ\u0000", new Object[]{"zzd", "zze"});
        }
        if (i5 == 3) {
            return new r2();
        }
        s2 s2Var = null;
        if (i5 == 4) {
            return new q2(s2Var);
        }
        if (i5 == 5) {
            return zzb;
        }
        throw null;
    }
}
