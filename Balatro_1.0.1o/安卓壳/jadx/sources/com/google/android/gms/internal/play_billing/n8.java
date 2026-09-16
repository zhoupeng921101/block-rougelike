package com.google.android.gms.internal.play_billing;

import java.lang.ref.WeakReference;
import java.util.concurrent.Executor;
import java.util.concurrent.TimeUnit;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class n8 implements c2 {

    /* renamed from: e, reason: collision with root package name */
    final WeakReference f2958e;

    /* renamed from: f, reason: collision with root package name */
    private final i8 f2959f = new m8(this);

    n8(j8 j8Var) {
        this.f2958e = new WeakReference(j8Var);
    }

    @Override // com.google.android.gms.internal.play_billing.c2
    public final void a(Runnable runnable, Executor executor) {
        this.f2959f.a(runnable, executor);
    }

    final boolean b(Object obj) {
        return this.f2959f.d(obj);
    }

    final boolean c(Throwable th) {
        j4 j4Var = new j4(th);
        z1 z1Var = i8.f2798j;
        i8 i8Var = this.f2959f;
        if (!z1Var.d(i8Var, null, j4Var)) {
            return false;
        }
        i8.c(i8Var);
        return true;
    }

    @Override // java.util.concurrent.Future
    public final boolean cancel(boolean z3) {
        j8 j8Var = (j8) this.f2958e.get();
        boolean cancel = this.f2959f.cancel(z3);
        if (!cancel || j8Var == null) {
            return cancel;
        }
        j8Var.a();
        return true;
    }

    @Override // java.util.concurrent.Future
    public final Object get() {
        return this.f2959f.get();
    }

    @Override // java.util.concurrent.Future
    public final Object get(long j4, TimeUnit timeUnit) {
        return this.f2959f.get(j4, timeUnit);
    }

    @Override // java.util.concurrent.Future
    public final boolean isCancelled() {
        return this.f2959f.f2800e instanceof p2;
    }

    @Override // java.util.concurrent.Future
    public final boolean isDone() {
        return this.f2959f.isDone();
    }

    public final String toString() {
        return this.f2959f.toString();
    }
}
