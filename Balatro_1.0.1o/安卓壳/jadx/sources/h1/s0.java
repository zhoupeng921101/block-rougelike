package h1;

import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class s0 {

    /* renamed from: a, reason: collision with root package name */
    private static final Object f3579a = new Object();

    /* renamed from: b, reason: collision with root package name */
    private static boolean f3580b;

    /* renamed from: c, reason: collision with root package name */
    private static String f3581c;

    /* renamed from: d, reason: collision with root package name */
    private static int f3582d;

    public static int a(Context context) {
        b(context);
        return f3582d;
    }

    private static void b(Context context) {
        Bundle bundle;
        synchronized (f3579a) {
            try {
                if (f3580b) {
                    return;
                }
                f3580b = true;
                try {
                    bundle = m1.d.a(context).a(context.getPackageName(), 128).metaData;
                } catch (PackageManager.NameNotFoundException e4) {
                    Log.wtf("MetadataValueReader", "This should never happen.", e4);
                }
                if (bundle == null) {
                    return;
                }
                f3581c = bundle.getString("com.google.app.id");
                f3582d = bundle.getInt("com.google.android.gms.version");
            } catch (Throwable th) {
                throw th;
            }
        }
    }
}
