package com.google.android.gms.internal.play_billing;

import java.util.Iterator;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class t0 extends n0 {

    /* renamed from: g, reason: collision with root package name */
    private final transient l0 f2992g;

    /* renamed from: h, reason: collision with root package name */
    private final transient i0 f2993h;

    t0(l0 l0Var, i0 i0Var) {
        this.f2992g = l0Var;
        this.f2993h = i0Var;
    }

    @Override // com.google.android.gms.internal.play_billing.f0
    final int a(Object[] objArr, int i4) {
        return this.f2993h.a(objArr, 0);
    }

    @Override // com.google.android.gms.internal.play_billing.f0, java.util.AbstractCollection, java.util.Collection
    public final boolean contains(Object obj) {
        return this.f2992g.get(obj) != null;
    }

    @Override // com.google.android.gms.internal.play_billing.n0, com.google.android.gms.internal.play_billing.f0
    public final i0 g() {
        return this.f2993h;
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.lang.Iterable, java.util.Set
    public final /* synthetic */ Iterator iterator() {
        return this.f2993h.listIterator(0);
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.util.Set
    public final int size() {
        return this.f2992g.size();
    }
}
