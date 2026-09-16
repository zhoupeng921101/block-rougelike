package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class s4 implements l5 {

    /* renamed from: b, reason: collision with root package name */
    private static final x4 f2990b = new q4();

    /* renamed from: a, reason: collision with root package name */
    private final x4 f2991a;

    public s4() {
        a4 c4 = a4.c();
        int i4 = y2.f3034a;
        r4 r4Var = new r4(c4, f2990b);
        byte[] bArr = k4.f2839b;
        this.f2991a = r4Var;
    }

    @Override // com.google.android.gms.internal.play_billing.l5
    public final k5 a(Class cls) {
        int i4 = m5.f2865b;
        if (!d4.class.isAssignableFrom(cls)) {
            int i5 = y2.f3034a;
        }
        w4 a4 = this.f2991a.a(cls);
        if (a4.b()) {
            int i6 = y2.f3034a;
            return e5.b(m5.t(), y3.a(), a4.a());
        }
        int i7 = y2.f3034a;
        return d5.A(cls, a4, g5.a(), p4.a(), m5.t(), a4.c() + (-1) != 1 ? y3.a() : null, v4.a());
    }
}
