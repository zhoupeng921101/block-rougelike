package o0;

import android.os.Build;
import android.util.Log;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a {
    private static String a(String str, String str2) {
        String str3 = str + str2;
        return str3.length() > 23 ? str3.substring(0, 23) : str3;
    }

    public static void b(String str, String str2, Object obj) {
        String e4 = e(str);
        if (Log.isLoggable(e4, 3)) {
            Log.d(e4, String.format(str2, obj));
        }
    }

    public static void c(String str, String str2, Object... objArr) {
        String e4 = e(str);
        if (Log.isLoggable(e4, 3)) {
            Log.d(e4, String.format(str2, objArr));
        }
    }

    public static void d(String str, String str2, Throwable th) {
        String e4 = e(str);
        if (Log.isLoggable(e4, 6)) {
            Log.e(e4, str2, th);
        }
    }

    private static String e(String str) {
        if (Build.VERSION.SDK_INT < 26) {
            return a("TRuntime.", str);
        }
        return "TRuntime." + str;
    }

    public static void f(String str, String str2, Object obj) {
        String e4 = e(str);
        if (Log.isLoggable(e4, 4)) {
            Log.i(e4, String.format(str2, obj));
        }
    }

    public static void g(String str, String str2, Object obj) {
        String e4 = e(str);
        if (Log.isLoggable(e4, 5)) {
            Log.w(e4, String.format(str2, obj));
        }
    }
}
