package com.google.android.gms.internal.play_billing;

import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class u0 extends i0 {

    /* renamed from: h, reason: collision with root package name */
    private final transient Object[] f2998h;

    /* renamed from: i, reason: collision with root package name */
    private final transient int f2999i;

    /* renamed from: j, reason: collision with root package name */
    private final transient int f3000j;

    u0(Object[] objArr, int i4, int i5) {
        this.f2998h = objArr;
        this.f2999i = i4;
        this.f3000j = i5;
    }

    @Override // java.util.List
    public final Object get(int i4) {
        v.a(i4, this.f3000j, "index");
        Object obj = this.f2998h[i4 + i4 + this.f2999i];
        Objects.requireNonNull(obj);
        return obj;
    }

    @Override // com.google.android.gms.internal.play_billing.f0
    final boolean h() {
        return true;
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.util.List
    public final int size() {
        return this.f3000j;
    }
}
