package com.google.android.gms.common.util;

import a1.b2.c3;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class f {

    /* renamed from: a, reason: collision with root package name */
    private static Boolean f2612a;

    /* renamed from: b, reason: collision with root package name */
    private static Boolean f2613b;

    /* renamed from: c, reason: collision with root package name */
    private static Boolean f2614c;

    /* renamed from: d, reason: collision with root package name */
    private static Boolean f2615d;

    public static boolean a(Context context) {
        return h(context.getPackageManager());
    }

    public static boolean b() {
        int i4 = d1.l.f3114a;
        return c3.d4(1225).equals(Build.TYPE);
    }

    public static boolean c(Context context) {
        return e(context.getPackageManager());
    }

    public static boolean d(Context context) {
        if (c(context) && !i.b()) {
            return true;
        }
        if (f(context)) {
            return !i.c() || i.f();
        }
        return false;
    }

    public static boolean e(PackageManager packageManager) {
        if (f2612a == null) {
            f2612a = Boolean.valueOf(packageManager.hasSystemFeature("android.hardware.type.watch"));
        }
        return f2612a.booleanValue();
    }

    public static boolean f(Context context) {
        if (f2613b == null) {
            f2613b = Boolean.valueOf(context.getPackageManager().hasSystemFeature("cn.google"));
        }
        return f2613b.booleanValue();
    }

    public static boolean g(Context context) {
        if (f2614c == null) {
            f2614c = Boolean.valueOf(i.c() ? context.getPackageManager().hasSystemFeature("android.hardware.type.embedded") : context.getPackageManager().hasSystemFeature("android.hardware.type.iot"));
        }
        return f2614c.booleanValue();
    }

    public static boolean h(PackageManager packageManager) {
        if (f2615d == null) {
            boolean z3 = false;
            if (i.c() && packageManager.hasSystemFeature("android.hardware.type.automotive")) {
                z3 = true;
            }
            f2615d = Boolean.valueOf(z3);
        }
        return f2615d.booleanValue();
    }
}
