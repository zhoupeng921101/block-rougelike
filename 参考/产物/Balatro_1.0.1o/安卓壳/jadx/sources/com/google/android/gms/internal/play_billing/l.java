package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
enum l {
    RESPONSE_CODE_UNSPECIFIED(-999),
    SERVICE_TIMEOUT(-3),
    f2842h(-2),
    SERVICE_DISCONNECTED(-1),
    OK(0),
    USER_CANCELED(1),
    SERVICE_UNAVAILABLE(2),
    f2847m(3),
    f2848n(4),
    DEVELOPER_ERROR(5),
    ERROR(6),
    ITEM_ALREADY_OWNED(7),
    ITEM_NOT_OWNED(8),
    EXPIRED_OFFER_TOKEN(11),
    NETWORK_ERROR(12);


    /* renamed from: u, reason: collision with root package name */
    private static final l0 f2855u;

    /* renamed from: e, reason: collision with root package name */
    private final int f2857e;

    static {
        k0 k0Var = new k0();
        for (l lVar : values()) {
            k0Var.a(Integer.valueOf(lVar.f2857e), lVar);
        }
        f2855u = k0Var.b();
    }

    l(int i4) {
        this.f2857e = i4;
    }

    static l a(int i4) {
        l0 l0Var = f2855u;
        Integer valueOf = Integer.valueOf(i4);
        return !l0Var.containsKey(valueOf) ? RESPONSE_CODE_UNSPECIFIED : (l) l0Var.get(valueOf);
    }
}
