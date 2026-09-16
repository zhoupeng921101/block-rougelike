package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public enum u6 implements f4 {
    BROADCAST_ACTION_UNSPECIFIED(0),
    PURCHASES_UPDATED_ACTION(1),
    LOCAL_PURCHASES_UPDATED_ACTION(2),
    ALTERNATIVE_BILLING_ACTION(3);


    /* renamed from: e, reason: collision with root package name */
    private final int f3008e;

    u6(int i4) {
        this.f3008e = i4;
    }

    public final int a() {
        return this.f3008e;
    }

    @Override // java.lang.Enum
    public final String toString() {
        return Integer.toString(this.f3008e);
    }
}
