package com.google.android.gms.internal.play_billing;

import java.util.List;
import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class h0 extends i0 {

    /* renamed from: h, reason: collision with root package name */
    final transient int f2775h;

    /* renamed from: i, reason: collision with root package name */
    final transient int f2776i;

    /* renamed from: j, reason: collision with root package name */
    final /* synthetic */ i0 f2777j;

    h0(i0 i0Var, int i4, int i5) {
        Objects.requireNonNull(i0Var);
        this.f2777j = i0Var;
        this.f2775h = i4;
        this.f2776i = i5;
    }

    @Override // com.google.android.gms.internal.play_billing.f0
    final int e() {
        return this.f2777j.f() + this.f2775h + this.f2776i;
    }

    @Override // com.google.android.gms.internal.play_billing.f0
    final int f() {
        return this.f2777j.f() + this.f2775h;
    }

    @Override // java.util.List
    public final Object get(int i4) {
        v.a(i4, this.f2776i, "index");
        return this.f2777j.get(i4 + this.f2775h);
    }

    @Override // com.google.android.gms.internal.play_billing.f0
    final boolean h() {
        return true;
    }

    @Override // com.google.android.gms.internal.play_billing.f0
    final Object[] i() {
        return this.f2777j.i();
    }

    @Override // com.google.android.gms.internal.play_billing.i0
    /* renamed from: j */
    public final i0 subList(int i4, int i5) {
        v.d(i4, i5, this.f2776i);
        int i6 = this.f2775h;
        return this.f2777j.subList(i4 + i6, i5 + i6);
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.util.List
    public final int size() {
        return this.f2776i;
    }

    @Override // com.google.android.gms.internal.play_billing.i0, java.util.List
    public final /* bridge */ /* synthetic */ List subList(int i4, int i5) {
        return subList(i4, i5);
    }
}
