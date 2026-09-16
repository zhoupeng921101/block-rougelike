package b0;

import android.os.Trace;
import android.util.Log;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class b {

    /* renamed from: a, reason: collision with root package name */
    private static long f1775a;

    /* renamed from: b, reason: collision with root package name */
    private static Method f1776b;

    public static void a(String str) {
        c.a(str);
    }

    public static void b() {
        c.b();
    }

    private static void c(String str, Exception exc) {
        if (exc instanceof InvocationTargetException) {
            Throwable cause = exc.getCause();
            if (!(cause instanceof RuntimeException)) {
                throw new RuntimeException(cause);
            }
            throw ((RuntimeException) cause);
        }
        Log.v("Trace", "Unable to call " + str + " via reflection", exc);
    }

    public static boolean d() {
        boolean isEnabled;
        try {
            if (f1776b == null) {
                isEnabled = Trace.isEnabled();
                return isEnabled;
            }
        } catch (NoClassDefFoundError | NoSuchMethodError unused) {
        }
        return e();
    }

    private static boolean e() {
        try {
            if (f1776b == null) {
                f1775a = Trace.class.getField("TRACE_TAG_APP").getLong(null);
                f1776b = Trace.class.getMethod("isTagEnabled", Long.TYPE);
            }
            return ((Boolean) f1776b.invoke(null, Long.valueOf(f1775a))).booleanValue();
        } catch (Exception e4) {
            c("isTagEnabled", e4);
            return false;
        }
    }
}
