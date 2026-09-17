package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class t6 implements g4 {

    /* renamed from: a, reason: collision with root package name */
    static final g4 f2997a = new t6();

    private t6() {
    }

    @Override // com.google.android.gms.internal.play_billing.g4
    public final boolean c(int i4) {
        return (i4 != 0 ? i4 != 1 ? i4 != 2 ? i4 != 3 ? null : u6.ALTERNATIVE_BILLING_ACTION : u6.LOCAL_PURCHASES_UPDATED_ACTION : u6.PURCHASES_UPDATED_ACTION : u6.BROADCAST_ACTION_UNSPECIFIED) != null;
    }
}
