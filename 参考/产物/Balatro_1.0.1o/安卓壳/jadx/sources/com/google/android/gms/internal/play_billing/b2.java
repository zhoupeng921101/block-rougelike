package com.google.android.gms.internal.play_billing;

import java.util.logging.Logger;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class b2 {

    /* renamed from: a, reason: collision with root package name */
    private final b0 f2718a = new b0();

    /* renamed from: b, reason: collision with root package name */
    private final String f2719b;

    /* renamed from: c, reason: collision with root package name */
    private volatile Logger f2720c;

    b2(Class cls) {
        this.f2719b = cls.getName();
    }

    final Logger a() {
        Logger logger = this.f2720c;
        if (logger != null) {
            return logger;
        }
        synchronized (this.f2718a) {
            try {
                Logger logger2 = this.f2720c;
                if (logger2 != null) {
                    return logger2;
                }
                Logger logger3 = Logger.getLogger(this.f2719b);
                this.f2720c = logger3;
                return logger3;
            } catch (Throwable th) {
                throw th;
            }
        }
    }
}
