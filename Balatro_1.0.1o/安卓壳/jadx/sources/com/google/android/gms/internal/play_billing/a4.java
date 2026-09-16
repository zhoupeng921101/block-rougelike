package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class a4 implements x4 {

    /* renamed from: a, reason: collision with root package name */
    private static final a4 f2715a = new a4();

    private a4() {
    }

    public static a4 c() {
        return f2715a;
    }

    @Override // com.google.android.gms.internal.play_billing.x4
    public final w4 a(Class cls) {
        if (!d4.class.isAssignableFrom(cls)) {
            throw new IllegalArgumentException("Unsupported message type: ".concat(cls.getName()));
        }
        try {
            return (w4) d4.u(cls.asSubclass(d4.class)).p(3, null, null);
        } catch (Exception e4) {
            throw new RuntimeException(a1.b2.c3.d4(67).concat(cls.getName()), e4);
        }
    }

    @Override // com.google.android.gms.internal.play_billing.x4
    public final boolean b(Class cls) {
        return d4.class.isAssignableFrom(cls);
    }
}
