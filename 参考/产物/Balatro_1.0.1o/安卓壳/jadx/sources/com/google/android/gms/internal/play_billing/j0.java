package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class j0 {

    /* renamed from: a, reason: collision with root package name */
    private final Object f2803a;

    /* renamed from: b, reason: collision with root package name */
    private final Object f2804b;

    /* renamed from: c, reason: collision with root package name */
    private final Object f2805c;

    j0(Object obj, Object obj2, Object obj3) {
        this.f2803a = obj;
        this.f2804b = obj2;
        this.f2805c = obj3;
    }

    final IllegalArgumentException a() {
        Object obj = this.f2805c;
        Object obj2 = this.f2804b;
        Object obj3 = this.f2803a;
        return new IllegalArgumentException(a1.b2.c3.d4(433) + String.valueOf(obj3) + "=" + String.valueOf(obj2) + " and " + String.valueOf(obj3) + "=" + String.valueOf(obj));
    }
}
