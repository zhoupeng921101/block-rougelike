package com.google.android.gms.internal.play_billing;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class v1 implements Runnable {

    /* renamed from: e, reason: collision with root package name */
    final Future f3013e;

    /* renamed from: f, reason: collision with root package name */
    final u1 f3014f;

    v1(Future future, u1 u1Var) {
        this.f3013e = future;
        this.f3014f = u1Var;
    }

    /* JADX WARN: Multi-variable type inference failed */
    @Override // java.lang.Runnable
    public final void run() {
        Object obj;
        Throwable a4;
        Future future = this.f3013e;
        if ((future instanceof i2) && (a4 = j2.a((i2) future)) != null) {
            this.f3014f.b(a4);
            return;
        }
        try {
            if (!future.isDone()) {
                throw new IllegalStateException(y.b("Future was expected to be done: %s", future));
            }
            boolean z3 = false;
            Future future2 = future;
            while (true) {
                try {
                    obj = future2.get();
                    break;
                } catch (InterruptedException unused) {
                    z3 = true;
                    future2 = future2;
                } catch (Throwable th) {
                    if (z3) {
                        Thread.currentThread().interrupt();
                    }
                    throw th;
                }
            }
            if (z3) {
                Thread.currentThread().interrupt();
            }
            this.f3014f.a(obj);
        } catch (ExecutionException e4) {
            this.f3014f.b(e4.getCause());
        } catch (Throwable th2) {
            this.f3014f.b(th2);
        }
    }

    public final String toString() {
        r a4 = t.a(this);
        a4.a(this.f3014f);
        return a4.toString();
    }
}
