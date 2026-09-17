package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class e7 extends d4 implements b5 {
    private static final e7 zzb;
    private int zzd;
    private boolean zze;
    private boolean zzf;

    static {
        e7 e7Var = new e7();
        zzb = e7Var;
        d4.j(e7.class, e7Var);
    }

    private e7() {
    }

    @Override // com.google.android.gms.internal.play_billing.d4
    protected final Object p(int i4, Object obj, Object obj2) {
        int i5 = i4 - 1;
        if (i5 == 0) {
            return (byte) 1;
        }
        if (i5 == 2) {
            return d4.A(zzb, "\u0004\u0002\u0000\u0001\u0001\u0002\u0002\u0000\u0000\u0000\u0001ဇ\u0000\u0002ဇ\u0001", new Object[]{"zzd", "zze", a1.b2.c3.d4(883)});
        }
        if (i5 == 3) {
            return new e7();
        }
        d7 d7Var = null;
        if (i5 == 4) {
            return new c7(d7Var);
        }
        if (i5 == 5) {
            return zzb;
        }
        throw null;
    }
}
