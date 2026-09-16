package com.google.android.gms.internal.play_billing;

import java.util.concurrent.atomic.AtomicReferenceFieldUpdater;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class g1 extends f1 {

    /* renamed from: a, reason: collision with root package name */
    private static final AtomicReferenceFieldUpdater f2764a = AtomicReferenceFieldUpdater.newUpdater(j1.class, Thread.class, a1.b2.c3.d4(788));

    /* renamed from: b, reason: collision with root package name */
    private static final AtomicReferenceFieldUpdater f2765b = AtomicReferenceFieldUpdater.newUpdater(j1.class, j1.class, "b");

    /* renamed from: c, reason: collision with root package name */
    private static final AtomicReferenceFieldUpdater f2766c = AtomicReferenceFieldUpdater.newUpdater(k1.class, j1.class, "g");

    /* renamed from: d, reason: collision with root package name */
    private static final AtomicReferenceFieldUpdater f2767d = AtomicReferenceFieldUpdater.newUpdater(k1.class, c1.class, "f");

    /* renamed from: e, reason: collision with root package name */
    private static final AtomicReferenceFieldUpdater f2768e = AtomicReferenceFieldUpdater.newUpdater(k1.class, Object.class, "e");

    /* synthetic */ g1(q1 q1Var) {
        super(null);
    }

    @Override // com.google.android.gms.internal.play_billing.f1
    final c1 a(k1 k1Var, c1 c1Var) {
        return (c1) f2767d.getAndSet(k1Var, c1Var);
    }

    @Override // com.google.android.gms.internal.play_billing.f1
    final j1 b(k1 k1Var, j1 j1Var) {
        return (j1) f2766c.getAndSet(k1Var, j1Var);
    }

    @Override // com.google.android.gms.internal.play_billing.f1
    final void c(j1 j1Var, j1 j1Var2) {
        f2765b.lazySet(j1Var, j1Var2);
    }

    /* JADX INFO: Access modifiers changed from: package-private */
    @Override // com.google.android.gms.internal.play_billing.f1
    public final void d(j1 j1Var, Thread thread) {
        f2764a.lazySet(j1Var, thread);
    }

    @Override // com.google.android.gms.internal.play_billing.f1
    final boolean e(k1 k1Var, c1 c1Var, c1 c1Var2) {
        return m1.a(f2767d, k1Var, c1Var, c1Var2);
    }

    @Override // com.google.android.gms.internal.play_billing.f1
    final boolean f(k1 k1Var, Object obj, Object obj2) {
        return m1.a(f2768e, k1Var, obj, obj2);
    }

    @Override // com.google.android.gms.internal.play_billing.f1
    final boolean g(k1 k1Var, j1 j1Var, j1 j1Var2) {
        return m1.a(f2766c, k1Var, j1Var, j1Var2);
    }
}
