package com.google.android.gms.dynamite;

import a1.b2.c3;
import android.content.Context;
import android.util.Log;
import h1.o;
import java.lang.reflect.Field;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class DynamiteModule {

    /* renamed from: g, reason: collision with root package name */
    private static final ThreadLocal f2628g = new ThreadLocal();

    /* renamed from: h, reason: collision with root package name */
    private static final ThreadLocal f2629h = new b();

    /* renamed from: i, reason: collision with root package name */
    private static final a.InterfaceC0039a f2630i = new c();

    /* renamed from: a, reason: collision with root package name */
    public static final a f2622a = new d();

    /* renamed from: b, reason: collision with root package name */
    public static final a f2623b = new e();

    /* renamed from: c, reason: collision with root package name */
    public static final a f2624c = new f();

    /* renamed from: d, reason: collision with root package name */
    public static final a f2625d = new g();

    /* renamed from: e, reason: collision with root package name */
    public static final a f2626e = new h();

    /* renamed from: f, reason: collision with root package name */
    public static final a f2627f = new i();

    /* renamed from: j, reason: collision with root package name */
    public static final a f2631j = new j();

    /* renamed from: k, reason: collision with root package name */
    public static final a f2632k = new com.google.android.gms.dynamite.a();

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class DynamiteLoaderClassLoader {
        public static ClassLoader sClassLoader;
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface a {

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        /* renamed from: com.google.android.gms.dynamite.DynamiteModule$a$a, reason: collision with other inner class name */
        public interface InterfaceC0039a {
        }
    }

    public static int a(Context context, String str) {
        String d4 = c3.d4(1278);
        String d42 = c3.d4(1031);
        try {
            ClassLoader classLoader = context.getApplicationContext().getClassLoader();
            StringBuilder sb = new StringBuilder(String.valueOf(str).length() + 61);
            sb.append("com.google.android.gms.dynamite.descriptors.");
            sb.append(str);
            sb.append(".ModuleDescriptor");
            Class<?> loadClass = classLoader.loadClass(sb.toString());
            Field declaredField = loadClass.getDeclaredField("MODULE_ID");
            Field declaredField2 = loadClass.getDeclaredField("MODULE_VERSION");
            if (o.a(declaredField.get(null), str)) {
                return declaredField2.getInt(null);
            }
            String valueOf = String.valueOf(declaredField.get(null));
            StringBuilder sb2 = new StringBuilder(valueOf.length() + 50 + String.valueOf(str).length() + 1);
            sb2.append(d42);
            sb2.append(valueOf);
            sb2.append(d4);
            sb2.append(str);
            sb2.append("'");
            Log.e("DynamiteModule", sb2.toString());
            return 0;
        } catch (ClassNotFoundException unused) {
            StringBuilder sb3 = new StringBuilder(String.valueOf(str).length() + 45);
            sb3.append("Local module descriptor class for ");
            sb3.append(str);
            sb3.append(" not found.");
            Log.w("DynamiteModule", sb3.toString());
            return 0;
        } catch (Exception e4) {
            Log.e("DynamiteModule", c3.d4(625).concat(String.valueOf(e4.getMessage())));
            return 0;
        }
    }
}
