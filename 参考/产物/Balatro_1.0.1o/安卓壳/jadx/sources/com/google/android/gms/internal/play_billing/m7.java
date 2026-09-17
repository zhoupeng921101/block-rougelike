package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class m7 extends d4 implements b5 {
    private static final m7 zzb;
    private int zzd;
    private int zze;
    private String zzf = a1.b2.c3.d4(1035);

    static {
        m7 m7Var = new m7();
        zzb = m7Var;
        d4.j(m7.class, m7Var);
    }

    private m7() {
    }

    @Override // com.google.android.gms.internal.play_billing.d4
    protected final Object p(int i4, Object obj, Object obj2) {
        int i5 = i4 - 1;
        if (i5 == 0) {
            return (byte) 1;
        }
        if (i5 == 2) {
            return d4.A(zzb, "\u0004\u0002\u0000\u0001\u0001\u0002\u0002\u0000\u0000\u0000\u0001᠌\u0000\u0002ဈ\u0001", new Object[]{a1.b2.c3.d4(21), "zze", l7.f2861a, "zzf"});
        }
        if (i5 == 3) {
            return new m7();
        }
        n7 n7Var = null;
        if (i5 == 4) {
            return new k7(n7Var);
        }
        if (i5 == 5) {
            return zzb;
        }
        throw null;
    }
}
