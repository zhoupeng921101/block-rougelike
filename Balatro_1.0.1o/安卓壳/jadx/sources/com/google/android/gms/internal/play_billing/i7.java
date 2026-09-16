package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class i7 extends d4 implements b5 {
    private static final i7 zzb;
    private int zzd;
    private int zze;

    static {
        i7 i7Var = new i7();
        zzb = i7Var;
        d4.j(i7.class, i7Var);
    }

    private i7() {
    }

    @Override // com.google.android.gms.internal.play_billing.d4
    protected final Object p(int i4, Object obj, Object obj2) {
        int i5 = i4 - 1;
        if (i5 == 0) {
            return (byte) 1;
        }
        if (i5 == 2) {
            return d4.A(zzb, "\u0004\u0001\u0000\u0001\u0001\u0001\u0001\u0000\u0000\u0000\u0001᠌\u0000", new Object[]{"zzd", "zze", g7.f2771a});
        }
        if (i5 == 3) {
            return new i7();
        }
        h7 h7Var = null;
        if (i5 == 4) {
            return new f7(h7Var);
        }
        if (i5 == 5) {
            return zzb;
        }
        throw null;
    }
}
