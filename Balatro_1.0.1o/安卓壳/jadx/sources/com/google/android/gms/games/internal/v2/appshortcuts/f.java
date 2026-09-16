package com.google.android.gms.games.internal.v2.appshortcuts;

import android.content.Context;
import android.os.Build;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class f {
    public /* synthetic */ f(byte[] bArr) {
    }

    public static f b(Context context) {
        return Build.VERSION.SDK_INT < 25 ? new a() : new e(context);
    }

    public void a() {
    }
}
