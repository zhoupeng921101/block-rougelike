package com.android.billingclient.api;

import java.util.Objects;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.atomic.AtomicInteger;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class u implements ThreadFactory {

    /* renamed from: a, reason: collision with root package name */
    private final ThreadFactory f2462a;

    /* renamed from: b, reason: collision with root package name */
    private final AtomicInteger f2463b;

    u(b bVar) {
        Objects.requireNonNull(bVar);
        this.f2462a = Executors.defaultThreadFactory();
        this.f2463b = new AtomicInteger(1);
    }

    @Override // java.util.concurrent.ThreadFactory
    public final Thread newThread(Runnable runnable) {
        AtomicInteger atomicInteger = this.f2463b;
        Thread newThread = this.f2462a.newThread(runnable);
        newThread.setName("PlayBillingLibrary-" + atomicInteger.getAndIncrement());
        return newThread;
    }
}
