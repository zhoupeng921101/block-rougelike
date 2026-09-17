package com.google.android.gms.internal.play_billing;

import java.util.AbstractMap;
import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class r0 extends i0 {

    /* renamed from: h, reason: collision with root package name */
    final /* synthetic */ s0 f2973h;

    r0(s0 s0Var) {
        Objects.requireNonNull(s0Var);
        this.f2973h = s0Var;
    }

    @Override // java.util.List
    public final /* bridge */ /* synthetic */ Object get(int i4) {
        int i5;
        Object[] objArr;
        Object[] objArr2;
        s0 s0Var = this.f2973h;
        i5 = s0Var.f2988i;
        v.a(i4, i5, "index");
        objArr = s0Var.f2987h;
        int i6 = i4 + i4;
        Object obj = objArr[i6];
        Objects.requireNonNull(obj);
        objArr2 = s0Var.f2987h;
        Object obj2 = objArr2[i6 + 1];
        Objects.requireNonNull(obj2);
        return new AbstractMap.SimpleImmutableEntry(obj, obj2);
    }

    @Override // com.google.android.gms.internal.play_billing.f0
    public final boolean h() {
        return true;
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.util.List
    public final int size() {
        int i4;
        i4 = this.f2973h.f2988i;
        return i4;
    }
}
