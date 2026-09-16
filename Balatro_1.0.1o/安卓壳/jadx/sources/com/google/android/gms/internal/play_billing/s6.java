package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class s6 extends d4 implements b5 {
    private static final s6 zzb;

    static {
        s6 s6Var = new s6();
        zzb = s6Var;
        d4.j(s6.class, s6Var);
    }

    private s6() {
    }

    public static s6 D() {
        return zzb;
    }

    @Override // com.google.android.gms.internal.play_billing.d4
    protected final Object p(int i4, Object obj, Object obj2) {
        int i5 = i4 - 1;
        if (i5 == 0) {
            return (byte) 1;
        }
        r6 r6Var = null;
        if (i5 == 2) {
            return d4.A(zzb, "\u0004\u0000", null);
        }
        if (i5 == 3) {
            return new s6();
        }
        if (i5 == 4) {
            return new q6(r6Var);
        }
        if (i5 == 5) {
            return zzb;
        }
        throw null;
    }
}
