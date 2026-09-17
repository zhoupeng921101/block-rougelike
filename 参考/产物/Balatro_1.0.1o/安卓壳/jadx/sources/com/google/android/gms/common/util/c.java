package com.google.android.gms.common.util;

import a1.b2.c3;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class c {
    public static int a(Context context, String str) {
        ApplicationInfo applicationInfo;
        Bundle bundle;
        PackageInfo b4 = b(context, str);
        if (b4 == null || (applicationInfo = b4.applicationInfo) == null || (bundle = applicationInfo.metaData) == null) {
            return -1;
        }
        return bundle.getInt(c3.d4(66), -1);
    }

    public static PackageInfo b(Context context, String str) {
        try {
            return m1.d.a(context).c(str, 128);
        } catch (PackageManager.NameNotFoundException unused) {
            return null;
        }
    }
}
