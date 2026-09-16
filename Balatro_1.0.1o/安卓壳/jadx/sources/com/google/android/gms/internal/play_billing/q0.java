package com.google.android.gms.internal.play_billing;

import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class q0 extends i0 {

    /* renamed from: j, reason: collision with root package name */
    static final i0 f2967j = new q0(new Object[0], 0);

    /* renamed from: h, reason: collision with root package name */
    final transient Object[] f2968h;

    /* renamed from: i, reason: collision with root package name */
    private final transient int f2969i;

    q0(Object[] objArr, int i4) {
        this.f2968h = objArr;
        this.f2969i = i4;
    }

    @Override // com.google.android.gms.internal.play_billing.i0, com.google.android.gms.internal.play_billing.f0
    final int a(Object[] objArr, int i4) {
        Object[] objArr2 = this.f2968h;
        int i5 = this.f2969i;
        System.arraycopy(objArr2, 0, objArr, 0, i5);
        return i5;
    }

    @Override // com.google.android.gms.internal.play_billing.f0
    final int e() {
        return this.f2969i;
    }

    @Override // com.google.android.gms.internal.play_billing.f0
    final int f() {
        return 0;
    }

    @Override // java.util.List
    public final Object get(int i4) {
        v.a(i4, this.f2969i, "index");
        Object obj = this.f2968h[i4];
        Objects.requireNonNull(obj);
        return obj;
    }

    @Override // com.google.android.gms.internal.play_billing.f0
    final boolean h() {
        return false;
    }

    @Override // com.google.android.gms.internal.play_billing.f0
    final Object[] i() {
        return this.f2968h;
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.util.List
    public final int size() {
        return this.f2969i;
    }
}
