package com.google.android.gms.internal.play_billing;

import java.util.concurrent.Executor;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class w1 extends y1 {
    public static c2 a(Object obj) {
        return new a2(obj);
    }

    public static c2 b(c2 c2Var, long j4, TimeUnit timeUnit, ScheduledExecutorService scheduledExecutorService) {
        return c2Var.isDone() ? c2Var : h2.y(c2Var, 28500L, timeUnit, scheduledExecutorService);
    }

    public static void c(c2 c2Var, u1 u1Var, Executor executor) {
        c2Var.a(new v1(c2Var, u1Var), executor);
    }
}
