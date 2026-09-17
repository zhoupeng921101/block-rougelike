package com.google.android.gms.internal.play_billing;

import sun.misc.Unsafe;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract /* synthetic */ class o1 {
    public static /* synthetic */ boolean a(Unsafe unsafe, Object obj, long j4, Object obj2, Object obj3) {
        while (!n1.a(unsafe, obj, j4, obj2, obj3)) {
            if (unsafe.getObject(obj, j4) != obj2) {
                return false;
            }
        }
        return true;
    }
}
