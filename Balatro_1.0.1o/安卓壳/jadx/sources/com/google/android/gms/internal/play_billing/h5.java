package com.google.android.gms.internal.play_billing;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class h5 {

    /* renamed from: c, reason: collision with root package name */
    private static final h5 f2781c = new h5();

    /* renamed from: b, reason: collision with root package name */
    private final ConcurrentMap f2783b = new ConcurrentHashMap();

    /* renamed from: a, reason: collision with root package name */
    private final l5 f2782a = new s4();

    private h5() {
    }

    static h5 a() {
        return f2781c;
    }

    final k5 b(Class cls) {
        byte[] bArr = k4.f2839b;
        if (cls == null) {
            throw new NullPointerException("messageType");
        }
        ConcurrentMap concurrentMap = this.f2783b;
        k5 k5Var = (k5) concurrentMap.get(cls);
        if (k5Var == null) {
            k5Var = this.f2782a.a(cls);
            k5 k5Var2 = (k5) concurrentMap.putIfAbsent(cls, k5Var);
            if (k5Var2 != null) {
                return k5Var2;
            }
        }
        return k5Var;
    }
}
