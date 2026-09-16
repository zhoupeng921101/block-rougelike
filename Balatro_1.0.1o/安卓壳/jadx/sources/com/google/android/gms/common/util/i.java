package com.google.android.gms.common.util;

import android.os.Build;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class i {
    public static boolean a() {
        return true;
    }

    public static boolean b() {
        return true;
    }

    public static boolean c() {
        return Build.VERSION.SDK_INT >= 26;
    }

    public static boolean d() {
        return Build.VERSION.SDK_INT >= 28;
    }

    public static boolean e() {
        return Build.VERSION.SDK_INT >= 29;
    }

    public static boolean f() {
        return Build.VERSION.SDK_INT >= 30;
    }

    public static boolean g() {
        return Build.VERSION.SDK_INT >= 31;
    }
}
