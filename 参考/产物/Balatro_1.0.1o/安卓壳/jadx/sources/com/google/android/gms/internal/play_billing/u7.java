package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class u7 extends d4 implements b5 {
    private static final u7 zzb;
    private int zzd;
    private int zzf;
    private i4 zze = d4.y();
    private String zzg = "";

    static {
        u7 u7Var = new u7();
        zzb = u7Var;
        d4.j(u7.class, u7Var);
    }

    private u7() {
    }

    @Override // com.google.android.gms.internal.play_billing.d4
    protected final Object p(int i4, Object obj, Object obj2) {
        int i5 = i4 - 1;
        if (i5 == 0) {
            return (byte) 1;
        }
        if (i5 == 2) {
            return d4.A(zzb, "\u0004\u0003\u0000\u0001\u0001\u0003\u0003\u0000\u0001\u0000\u0001\u001a\u0002င\u0000\u0003ဈ\u0001", new Object[]{"zzd", "zze", a1.b2.c3.d4(1168), a1.b2.c3.d4(435)});
        }
        if (i5 == 3) {
            return new u7();
        }
        t7 t7Var = null;
        if (i5 == 4) {
            return new s7(t7Var);
        }
        if (i5 == 5) {
            return zzb;
        }
        throw null;
    }
}
