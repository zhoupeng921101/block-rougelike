package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class j5 implements w4 {

    /* renamed from: a, reason: collision with root package name */
    private final a5 f2812a;

    /* renamed from: b, reason: collision with root package name */
    private final String f2813b;

    /* renamed from: c, reason: collision with root package name */
    private final Object[] f2814c;

    /* renamed from: d, reason: collision with root package name */
    private final int f2815d;

    j5(a5 a5Var, String str, Object[] objArr) {
        this.f2812a = a5Var;
        this.f2813b = str;
        this.f2814c = objArr;
        char charAt = str.charAt(0);
        if (charAt < 55296) {
            this.f2815d = charAt;
            return;
        }
        int i4 = charAt & 8191;
        int i5 = 1;
        int i6 = 13;
        while (true) {
            int i7 = i5 + 1;
            char charAt2 = str.charAt(i5);
            if (charAt2 < 55296) {
                this.f2815d = i4 | (charAt2 << i6);
                return;
            } else {
                i4 |= (charAt2 & 8191) << i6;
                i6 += 13;
                i5 = i7;
            }
        }
    }

    @Override // com.google.android.gms.internal.play_billing.w4
    public final a5 a() {
        return this.f2812a;
    }

    @Override // com.google.android.gms.internal.play_billing.w4
    public final boolean b() {
        return (this.f2815d & 2) == 2;
    }

    @Override // com.google.android.gms.internal.play_billing.w4
    public final int c() {
        int i4 = this.f2815d;
        if ((i4 & 1) != 0) {
            return 1;
        }
        return (i4 & 4) == 4 ? 3 : 2;
    }

    final String d() {
        return this.f2813b;
    }

    final Object[] e() {
        return this.f2814c;
    }
}
