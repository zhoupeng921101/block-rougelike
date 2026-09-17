package m1;

import android.content.Context;
import com.google.android.gms.common.util.i;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class b {

    /* renamed from: a, reason: collision with root package name */
    private static Context f4168a;

    /* renamed from: b, reason: collision with root package name */
    private static Boolean f4169b;

    public static synchronized boolean a(Context context) {
        boolean isInstantApp;
        Boolean bool;
        synchronized (b.class) {
            Context applicationContext = context.getApplicationContext();
            Context context2 = f4168a;
            if (context2 != null && (bool = f4169b) != null && context2 == applicationContext) {
                return bool.booleanValue();
            }
            f4169b = null;
            if (i.c()) {
                isInstantApp = applicationContext.getPackageManager().isInstantApp();
                f4169b = Boolean.valueOf(isInstantApp);
            } else {
                try {
                    context.getClassLoader().loadClass("com.google.android.instantapps.supervisor.InstantAppsRuntime");
                    f4169b = Boolean.TRUE;
                } catch (ClassNotFoundException unused) {
                    f4169b = Boolean.FALSE;
                }
            }
            f4168a = applicationContext;
            return f4169b.booleanValue();
        }
    }
}
