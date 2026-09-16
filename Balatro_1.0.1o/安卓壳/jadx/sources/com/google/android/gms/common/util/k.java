package com.google.android.gms.common.util;

import android.os.Process;
import b2.r;
import b2.t;
import b2.u;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class k {

    /* renamed from: a, reason: collision with root package name */
    private static Boolean f2616a;

    public static boolean a() {
        boolean isIsolated;
        Boolean bool = f2616a;
        if (bool == null) {
            if (i.d()) {
                isIsolated = Process.isIsolated();
                bool = Boolean.valueOf(isIsolated);
            } else {
                try {
                    Object a4 = r.a(Process.class, "isIsolated", new b2.q[0]);
                    Object[] objArr = new Object[0];
                    if (a4 == null) {
                        throw new u(t.a("expected a non-null reference", objArr));
                    }
                    bool = (Boolean) a4;
                } catch (ReflectiveOperationException unused) {
                    bool = Boolean.FALSE;
                }
            }
            f2616a = bool;
        }
        return bool.booleanValue();
    }
}
