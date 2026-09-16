package com.android.support;

import android.content.Context;
import np.dcc.protect.EntryPoint;

/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class Main {
    private static native void CheckOverlayPermission(Context context);

    public static native void Start(Context context);

    public static native void StartWithoutPermission(Context context);

    public static native String getConfig(String str);

    private static native String resolveConfig(String str);

    static {
        EntryPoint.stub(5);
        try {
            System.loadLibrary("APKVISION");
        } catch (Throwable th) {
        }
    }
}
