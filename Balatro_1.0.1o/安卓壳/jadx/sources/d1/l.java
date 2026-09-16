package d1;

import a1.b2.c3;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageInstaller;
import android.content.pm.PackageManager;
import android.content.res.Resources;
import android.os.Build;
import android.os.Bundle;
import android.os.UserManager;
import android.util.Log;
import com.google.android.gms.common.GooglePlayServicesIncorrectManifestValueException;
import com.google.android.gms.common.GooglePlayServicesMissingManifestValueException;
import h1.s0;
import java.util.Iterator;
import java.util.concurrent.atomic.AtomicBoolean;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class l {

    /* renamed from: a, reason: collision with root package name */
    public static final int f3114a = 12451000;

    /* renamed from: c, reason: collision with root package name */
    public static boolean f3116c;

    /* renamed from: d, reason: collision with root package name */
    public static boolean f3117d;

    /* renamed from: b, reason: collision with root package name */
    static final AtomicBoolean f3115b = new AtomicBoolean();

    /* renamed from: e, reason: collision with root package name */
    private static final AtomicBoolean f3118e = new AtomicBoolean();

    public static String a(int i4) {
        return a.n0(i4);
    }

    public static Resources b(Context context) {
        try {
            return context.getPackageManager().getResourcesForApplication("com.google.android.gms");
        } catch (PackageManager.NameNotFoundException unused) {
            return null;
        }
    }

    public static boolean c(Context context) {
        try {
            if (!f3117d) {
                try {
                    PackageInfo c4 = m1.d.a(context).c("com.google.android.gms", Build.VERSION.SDK_INT >= 28 ? 134217792 : 64);
                    p.a(context);
                    if (c4 == null || p.c(c4, false) || !p.c(c4, true)) {
                        f3116c = false;
                    } else {
                        f3116c = true;
                    }
                    f3117d = true;
                } catch (PackageManager.NameNotFoundException e4) {
                    Log.w("GooglePlayServicesUtil", "Cannot find Google Play services package name.", e4);
                    f3117d = true;
                }
            }
            return f3116c || !com.google.android.gms.common.util.f.b();
        } catch (Throwable th) {
            f3117d = true;
            throw th;
        }
    }

    public static int d(Context context, int i4) {
        PackageInfo packageInfo;
        try {
            context.getResources().getString(q.f3121a);
        } catch (Throwable unused) {
            Log.e("GooglePlayServicesUtil", c3.d4(631));
        }
        if (!"com.google.android.gms".equals(context.getPackageName()) && !f3118e.get()) {
            int a4 = s0.a(context);
            if (a4 == 0) {
                throw new GooglePlayServicesMissingManifestValueException();
            }
            if (a4 != f3114a) {
                throw new GooglePlayServicesIncorrectManifestValueException(a4);
            }
        }
        boolean z3 = (com.google.android.gms.common.util.f.d(context) || com.google.android.gms.common.util.f.g(context)) ? false : true;
        h1.q.a(i4 >= 0);
        String packageName = context.getPackageName();
        PackageManager packageManager = context.getPackageManager();
        if (z3) {
            try {
                packageInfo = packageManager.getPackageInfo("com.android.vending", Build.VERSION.SDK_INT >= 28 ? 134225984 : 8256);
            } catch (PackageManager.NameNotFoundException unused2) {
                Log.w("GooglePlayServicesUtil", String.valueOf(packageName).concat(c3.d4(120)));
            }
        } else {
            packageInfo = null;
        }
        try {
            PackageInfo packageInfo2 = packageManager.getPackageInfo("com.google.android.gms", Build.VERSION.SDK_INT >= 28 ? 134217792 : 64);
            p.a(context);
            if (p.c(packageInfo2, true)) {
                if (z3) {
                    h1.q.i(packageInfo);
                    if (!p.c(packageInfo, true)) {
                        Log.w("GooglePlayServicesUtil", String.valueOf(packageName).concat(" requires Google Play Store, but its signature is invalid."));
                    }
                }
                if (!z3 || packageInfo == null || packageInfo.signatures[0].equals(packageInfo2.signatures[0])) {
                    if (com.google.android.gms.common.util.m.a(packageInfo2.versionCode) >= com.google.android.gms.common.util.m.a(i4)) {
                        ApplicationInfo applicationInfo = packageInfo2.applicationInfo;
                        if (applicationInfo == null) {
                            try {
                                applicationInfo = packageManager.getApplicationInfo("com.google.android.gms", 0);
                            } catch (PackageManager.NameNotFoundException e4) {
                                Log.wtf("GooglePlayServicesUtil", String.valueOf(packageName).concat(" requires Google Play services, but they're missing when getting application info."), e4);
                                return 1;
                            }
                        }
                        return !applicationInfo.enabled ? 3 : 0;
                    }
                    int i5 = packageInfo2.versionCode;
                    StringBuilder sb = new StringBuilder(String.valueOf(packageName).length() + 49 + String.valueOf(i4).length() + 11 + String.valueOf(i5).length());
                    sb.append("Google Play services out of date for ");
                    sb.append(packageName);
                    sb.append(".  Requires ");
                    sb.append(i4);
                    sb.append(" but found ");
                    sb.append(i5);
                    Log.w("GooglePlayServicesUtil", sb.toString());
                    return 2;
                }
                Log.w("GooglePlayServicesUtil", String.valueOf(packageName).concat(" requires Google Play Store, but its signature doesn't match that of Google Play services."));
            } else {
                Log.w("GooglePlayServicesUtil", String.valueOf(packageName).concat(" requires Google Play services, but their signature is invalid."));
            }
            return 9;
        } catch (PackageManager.NameNotFoundException unused3) {
            Log.w("GooglePlayServicesUtil", String.valueOf(packageName).concat(c3.d4(1169)));
            return 1;
        }
    }

    public static boolean e(Context context, int i4) {
        if (i4 == 18) {
            return true;
        }
        if (i4 == 1) {
            return h(context, "com.google.android.gms");
        }
        return false;
    }

    public static boolean f(Context context) {
        Object systemService = context.getSystemService(c3.d4(485));
        h1.q.i(systemService);
        Bundle applicationRestrictions = ((UserManager) systemService).getApplicationRestrictions(context.getPackageName());
        return applicationRestrictions != null && "true".equals(applicationRestrictions.getString("restricted_profile"));
    }

    public static boolean g(int i4) {
        return i4 == 1 || i4 == 2 || i4 == 3 || i4 == 9;
    }

    static boolean h(Context context, String str) {
        ApplicationInfo applicationInfo;
        boolean equals = str.equals("com.google.android.gms");
        try {
            Iterator<PackageInstaller.SessionInfo> it = context.getPackageManager().getPackageInstaller().getAllSessions().iterator();
            while (it.hasNext()) {
                if (str.equals(it.next().getAppPackageName())) {
                    return true;
                }
            }
            applicationInfo = context.getPackageManager().getApplicationInfo(str, 8192);
        } catch (PackageManager.NameNotFoundException | Exception unused) {
        }
        return equals ? applicationInfo.enabled : applicationInfo.enabled && !f(context);
    }
}
