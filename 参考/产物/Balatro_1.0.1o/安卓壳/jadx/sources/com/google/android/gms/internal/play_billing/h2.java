package com.google.android.gms.internal.play_billing;

import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class h2 extends s1 {

    /* renamed from: l, reason: collision with root package name */
    private c2 f2778l;

    /* renamed from: m, reason: collision with root package name */
    private ScheduledFuture f2779m;

    private h2(c2 c2Var) {
        this.f2778l = c2Var;
    }

    static c2 y(c2 c2Var, long j4, TimeUnit timeUnit, ScheduledExecutorService scheduledExecutorService) {
        h2 h2Var = new h2(c2Var);
        e2 e2Var = new e2(h2Var);
        h2Var.f2779m = scheduledExecutorService.schedule(e2Var, 28500L, timeUnit);
        c2Var.a(e2Var, r1.INSTANCE);
        return h2Var;
    }

    @Override // com.google.android.gms.internal.play_billing.e1
    protected final String m() {
        c2 c2Var = this.f2778l;
        ScheduledFuture scheduledFuture = this.f2779m;
        if (c2Var == null) {
            return null;
        }
        String str = "inputFuture=[" + c2Var.toString() + "]";
        if (scheduledFuture == null) {
            return str;
        }
        long delay = scheduledFuture.getDelay(TimeUnit.MILLISECONDS);
        if (delay <= 0) {
            return str;
        }
        return str + a1.b2.c3.d4(1227) + delay + a1.b2.c3.d4(574);
    }

    @Override // com.google.android.gms.internal.play_billing.e1
    protected final void o() {
        c2 c2Var = this.f2778l;
        if ((this.f2832e instanceof z0) & (c2Var != null)) {
            Object obj = this.f2832e;
            c2Var.cancel((obj instanceof z0) && ((z0) obj).f3042a);
        }
        ScheduledFuture scheduledFuture = this.f2779m;
        if (scheduledFuture != null) {
            scheduledFuture.cancel(false);
        }
        this.f2778l = null;
        this.f2779m = null;
    }
}
