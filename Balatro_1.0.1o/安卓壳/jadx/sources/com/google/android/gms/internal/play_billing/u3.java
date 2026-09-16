package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class u3 {

    /* renamed from: a, reason: collision with root package name */
    private final Object f3001a;

    /* renamed from: b, reason: collision with root package name */
    private final int f3002b;

    u3(Object obj, int i4) {
        this.f3001a = obj;
        this.f3002b = i4;
    }

    public final boolean equals(Object obj) {
        if (!(obj instanceof u3)) {
            return false;
        }
        u3 u3Var = (u3) obj;
        return this.f3001a == u3Var.f3001a && this.f3002b == u3Var.f3002b;
    }

    public final int hashCode() {
        return (System.identityHashCode(this.f3001a) * 65535) + this.f3002b;
    }
}
