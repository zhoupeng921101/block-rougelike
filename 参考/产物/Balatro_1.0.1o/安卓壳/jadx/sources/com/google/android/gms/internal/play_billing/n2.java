package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class n2 extends d4 implements b5 {
    private static final n2 zzb;
    private i4 zzd = d4.y();

    static {
        n2 n2Var = new n2();
        zzb = n2Var;
        d4.j(n2.class, n2Var);
    }

    private n2() {
    }

    public static m2 C() {
        return (m2) zzb.s();
    }

    static /* synthetic */ void E(n2 n2Var, Iterable iterable) {
        i4 i4Var = n2Var.zzd;
        if (!i4Var.c()) {
            int size = i4Var.size();
            n2Var.zzd = i4Var.d(size + size);
        }
        w2.e(iterable, n2Var.zzd);
    }

    @Override // com.google.android.gms.internal.play_billing.d4
    protected final Object p(int i4, Object obj, Object obj2) {
        int i5 = i4 - 1;
        if (i5 == 0) {
            return (byte) 1;
        }
        if (i5 == 2) {
            return d4.A(zzb, "\u0004\u0001\u0000\u0000\u0001\u0001\u0001\u0000\u0001\u0000\u0001\u001b", new Object[]{a1.b2.c3.d4(986), l2.class});
        }
        if (i5 == 3) {
            return new n2();
        }
        o2 o2Var = null;
        if (i5 == 4) {
            return new m2(o2Var);
        }
        if (i5 == 5) {
            return zzb;
        }
        throw null;
    }
}
