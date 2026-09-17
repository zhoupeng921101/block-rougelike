package com.google.android.gms.common.util;

import android.os.StrictMode;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class p {
    public static StrictMode.VmPolicy a() {
        StrictMode.VmPolicy vmPolicy = StrictMode.getVmPolicy();
        if (i.g()) {
            StrictMode.setVmPolicy(o.a(new StrictMode.VmPolicy.Builder(vmPolicy)).build());
        }
        return vmPolicy;
    }
}
