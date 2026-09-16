package com.google.android.gms.internal.play_billing;

import java.util.concurrent.atomic.AtomicReferenceFieldUpdater;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class j6 extends z1 {

    /* renamed from: a, reason: collision with root package name */
    final AtomicReferenceFieldUpdater f2816a;

    /* renamed from: b, reason: collision with root package name */
    final AtomicReferenceFieldUpdater f2817b;

    /* renamed from: c, reason: collision with root package name */
    final AtomicReferenceFieldUpdater f2818c;

    /* renamed from: d, reason: collision with root package name */
    final AtomicReferenceFieldUpdater f2819d;

    /* renamed from: e, reason: collision with root package name */
    final AtomicReferenceFieldUpdater f2820e;

    j6(AtomicReferenceFieldUpdater atomicReferenceFieldUpdater, AtomicReferenceFieldUpdater atomicReferenceFieldUpdater2, AtomicReferenceFieldUpdater atomicReferenceFieldUpdater3, AtomicReferenceFieldUpdater atomicReferenceFieldUpdater4, AtomicReferenceFieldUpdater atomicReferenceFieldUpdater5) {
        super(null);
        this.f2816a = atomicReferenceFieldUpdater;
        this.f2817b = atomicReferenceFieldUpdater2;
        this.f2818c = atomicReferenceFieldUpdater3;
        this.f2819d = atomicReferenceFieldUpdater4;
        this.f2820e = atomicReferenceFieldUpdater5;
    }

    @Override // com.google.android.gms.internal.play_billing.z1
    final void a(g8 g8Var, g8 g8Var2) {
        this.f2817b.lazySet(g8Var, g8Var2);
    }

    @Override // com.google.android.gms.internal.play_billing.z1
    final void b(g8 g8Var, Thread thread) {
        this.f2816a.lazySet(g8Var, thread);
    }

    @Override // com.google.android.gms.internal.play_billing.z1
    final boolean c(i8 i8Var, y4 y4Var, y4 y4Var2) {
        return o5.a(this.f2819d, i8Var, y4Var, y4Var2);
    }

    @Override // com.google.android.gms.internal.play_billing.z1
    final boolean d(i8 i8Var, Object obj, Object obj2) {
        return o5.a(this.f2820e, i8Var, obj, obj2);
    }

    @Override // com.google.android.gms.internal.play_billing.z1
    final boolean e(i8 i8Var, g8 g8Var, g8 g8Var2) {
        return o5.a(this.f2818c, i8Var, g8Var, g8Var2);
    }
}
