package com.google.android.gms.internal.play_billing;

import java.util.Iterator;
import java.util.Map;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class s0 extends n0 {

    /* renamed from: g, reason: collision with root package name */
    private final transient l0 f2986g;

    /* renamed from: h, reason: collision with root package name */
    private final transient Object[] f2987h;

    /* renamed from: i, reason: collision with root package name */
    private final transient int f2988i;

    s0(l0 l0Var, Object[] objArr, int i4, int i5) {
        this.f2986g = l0Var;
        this.f2987h = objArr;
        this.f2988i = i5;
    }

    @Override // com.google.android.gms.internal.play_billing.f0
    final int a(Object[] objArr, int i4) {
        return g().a(objArr, 0);
    }

    @Override // com.google.android.gms.internal.play_billing.f0, java.util.AbstractCollection, java.util.Collection
    public final boolean contains(Object obj) {
        if (obj instanceof Map.Entry) {
            Map.Entry entry = (Map.Entry) obj;
            Object key = entry.getKey();
            Object value = entry.getValue();
            if (value != null && value.equals(this.f2986g.get(key))) {
                return true;
            }
        }
        return false;
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.lang.Iterable, java.util.Set
    public final /* synthetic */ Iterator iterator() {
        return g().listIterator(0);
    }

    @Override // com.google.android.gms.internal.play_billing.n0
    final i0 j() {
        return new r0(this);
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.util.Set
    public final int size() {
        return this.f2988i;
    }
}
