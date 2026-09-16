package com.google.android.gms.internal.play_billing;

import java.util.concurrent.Executor;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class a2 implements c2 {

    /* renamed from: f, reason: collision with root package name */
    private static final b2 f2711f = new b2(a2.class);

    /* renamed from: e, reason: collision with root package name */
    private final Object f2712e;

    a2(Object obj) {
        this.f2712e = obj;
    }

    @Override // com.google.android.gms.internal.play_billing.c2
    public final void a(Runnable runnable, Executor executor) {
        v.c(executor, a1.b2.c3.d4(1166));
        try {
            executor.execute(runnable);
        } catch (Exception e4) {
            f2711f.a().logp(Level.SEVERE, "com.google.common.util.concurrent.ImmediateFuture", "addListener", a1.b2.c3.d4(785) + runnable.toString() + " with executor " + String.valueOf(executor), (Throwable) e4);
        }
    }

    @Override // java.util.concurrent.Future
    public final boolean cancel(boolean z3) {
        return false;
    }

    @Override // java.util.concurrent.Future
    public final Object get() {
        return this.f2712e;
    }

    @Override // java.util.concurrent.Future
    public final Object get(long j4, TimeUnit timeUnit) {
        timeUnit.getClass();
        return this.f2712e;
    }

    @Override // java.util.concurrent.Future
    public final boolean isCancelled() {
        return false;
    }

    @Override // java.util.concurrent.Future
    public final boolean isDone() {
        return true;
    }

    public final String toString() {
        Object obj = this.f2712e;
        return super.toString() + "[status=SUCCESS, result=[" + obj.toString() + "]]";
    }
}
