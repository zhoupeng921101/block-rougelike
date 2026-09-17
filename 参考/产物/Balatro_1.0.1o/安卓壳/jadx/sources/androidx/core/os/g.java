package androidx.core.os;

import a1.b2.c3;
import android.os.Build;
import android.os.Trace;
import android.util.Log;
import java.lang.reflect.Method;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class g {

    /* renamed from: a, reason: collision with root package name */
    private static long f945a;

    /* renamed from: b, reason: collision with root package name */
    private static Method f946b;

    /* renamed from: c, reason: collision with root package name */
    private static Method f947c;

    /* renamed from: d, reason: collision with root package name */
    private static Method f948d;

    /* renamed from: e, reason: collision with root package name */
    private static Method f949e;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {
        static void a(String str) {
            Trace.beginSection(str);
        }

        static void b() {
            Trace.endSection();
        }
    }

    static {
        if (Build.VERSION.SDK_INT < 29) {
            try {
                f945a = Trace.class.getField("TRACE_TAG_APP").getLong(null);
                Class cls = Long.TYPE;
                f946b = Trace.class.getMethod("isTagEnabled", cls);
                Class cls2 = Integer.TYPE;
                f947c = Trace.class.getMethod("asyncTraceBegin", cls, String.class, cls2);
                f948d = Trace.class.getMethod("asyncTraceEnd", cls, String.class, cls2);
                f949e = Trace.class.getMethod("traceCounter", cls, String.class, cls2);
            } catch (Exception e4) {
                Log.i(c3.d4(869), "Unable to initialize via reflection.", e4);
            }
        }
    }

    public static void a(String str) {
        a.a(str);
    }

    public static void b() {
        a.b();
    }
}
