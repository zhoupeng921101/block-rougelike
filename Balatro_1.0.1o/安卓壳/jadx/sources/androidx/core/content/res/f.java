package androidx.core.content.res;

import android.content.Context;
import android.content.res.ColorStateList;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.util.SparseArray;
import android.util.TypedValue;
import androidx.core.content.res.f;
import java.util.WeakHashMap;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class f {

    /* renamed from: a, reason: collision with root package name */
    private static final ThreadLocal f876a = new ThreadLocal();

    /* renamed from: b, reason: collision with root package name */
    private static final WeakHashMap f877b = new WeakHashMap(0);

    /* renamed from: c, reason: collision with root package name */
    private static final Object f878c = new Object();

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {
        static Drawable a(Resources resources, int i4, Resources.Theme theme) {
            return resources.getDrawable(i4, theme);
        }

        static Drawable b(Resources resources, int i4, int i5, Resources.Theme theme) {
            return resources.getDrawableForDensity(i4, i5, theme);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class b {
        static int a(Resources resources, int i4, Resources.Theme theme) {
            return resources.getColor(i4, theme);
        }

        static ColorStateList b(Resources resources, int i4, Resources.Theme theme) {
            return resources.getColorStateList(i4, theme);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class c {

        /* renamed from: a, reason: collision with root package name */
        final ColorStateList f879a;

        /* renamed from: b, reason: collision with root package name */
        final Configuration f880b;

        /* renamed from: c, reason: collision with root package name */
        final int f881c;

        c(ColorStateList colorStateList, Configuration configuration, Resources.Theme theme) {
            this.f879a = colorStateList;
            this.f880b = configuration;
            this.f881c = theme == null ? 0 : theme.hashCode();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static final class d {

        /* renamed from: a, reason: collision with root package name */
        final Resources f882a;

        /* renamed from: b, reason: collision with root package name */
        final Resources.Theme f883b;

        d(Resources resources, Resources.Theme theme) {
            this.f882a = resources;
            this.f883b = theme;
        }

        public boolean equals(Object obj) {
            if (this == obj) {
                return true;
            }
            if (obj != null && d.class == obj.getClass()) {
                d dVar = (d) obj;
                if (this.f882a.equals(dVar.f882a) && androidx.core.util.b.a(this.f883b, dVar.f883b)) {
                    return true;
                }
            }
            return false;
        }

        public int hashCode() {
            return androidx.core.util.b.b(this.f882a, this.f883b);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static abstract class e {
        public static Handler e(Handler handler) {
            return handler == null ? new Handler(Looper.getMainLooper()) : handler;
        }

        public final void c(final int i4, Handler handler) {
            e(handler).post(new Runnable() { // from class: androidx.core.content.res.h
                @Override // java.lang.Runnable
                public final void run() {
                    f.e.this.f(i4);
                }
            });
        }

        public final void d(final Typeface typeface, Handler handler) {
            e(handler).post(new Runnable() { // from class: androidx.core.content.res.g
                @Override // java.lang.Runnable
                public final void run() {
                    f.e.this.g(typeface);
                }
            });
        }

        public abstract void f(int i4);

        public abstract void g(Typeface typeface);
    }

    private static void a(d dVar, int i4, ColorStateList colorStateList, Resources.Theme theme) {
        synchronized (f878c) {
            try {
                WeakHashMap weakHashMap = f877b;
                SparseArray sparseArray = (SparseArray) weakHashMap.get(dVar);
                if (sparseArray == null) {
                    sparseArray = new SparseArray();
                    weakHashMap.put(dVar, sparseArray);
                }
                sparseArray.append(i4, new c(colorStateList, dVar.f882a.getConfiguration(), theme));
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    /* JADX WARN: Code restructure failed: missing block: B:23:0x003c, code lost:
    
        if (r2.f881c == r5.hashCode()) goto L22;
     */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    private static android.content.res.ColorStateList b(androidx.core.content.res.f.d r5, int r6) {
        /*
            java.lang.Object r0 = androidx.core.content.res.f.f878c
            monitor-enter(r0)
            java.util.WeakHashMap r1 = androidx.core.content.res.f.f877b     // Catch: java.lang.Throwable -> L32
            java.lang.Object r1 = r1.get(r5)     // Catch: java.lang.Throwable -> L32
            android.util.SparseArray r1 = (android.util.SparseArray) r1     // Catch: java.lang.Throwable -> L32
            if (r1 == 0) goto L45
            int r2 = r1.size()     // Catch: java.lang.Throwable -> L32
            if (r2 <= 0) goto L45
            java.lang.Object r2 = r1.get(r6)     // Catch: java.lang.Throwable -> L32
            androidx.core.content.res.f$c r2 = (androidx.core.content.res.f.c) r2     // Catch: java.lang.Throwable -> L32
            if (r2 == 0) goto L45
            android.content.res.Configuration r3 = r2.f880b     // Catch: java.lang.Throwable -> L32
            android.content.res.Resources r4 = r5.f882a     // Catch: java.lang.Throwable -> L32
            android.content.res.Configuration r4 = r4.getConfiguration()     // Catch: java.lang.Throwable -> L32
            boolean r3 = r3.equals(r4)     // Catch: java.lang.Throwable -> L32
            if (r3 == 0) goto L42
            android.content.res.Resources$Theme r5 = r5.f883b     // Catch: java.lang.Throwable -> L32
            if (r5 != 0) goto L34
            int r3 = r2.f881c     // Catch: java.lang.Throwable -> L32
            if (r3 == 0) goto L3e
            goto L34
        L32:
            r5 = move-exception
            goto L48
        L34:
            if (r5 == 0) goto L42
            int r3 = r2.f881c     // Catch: java.lang.Throwable -> L32
            int r5 = r5.hashCode()     // Catch: java.lang.Throwable -> L32
            if (r3 != r5) goto L42
        L3e:
            android.content.res.ColorStateList r5 = r2.f879a     // Catch: java.lang.Throwable -> L32
            monitor-exit(r0)     // Catch: java.lang.Throwable -> L32
            return r5
        L42:
            r1.remove(r6)     // Catch: java.lang.Throwable -> L32
        L45:
            monitor-exit(r0)     // Catch: java.lang.Throwable -> L32
            r5 = 0
            return r5
        L48:
            monitor-exit(r0)     // Catch: java.lang.Throwable -> L32
            throw r5
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.core.content.res.f.b(androidx.core.content.res.f$d, int):android.content.res.ColorStateList");
    }

    public static ColorStateList c(Resources resources, int i4, Resources.Theme theme) {
        d dVar = new d(resources, theme);
        ColorStateList b4 = b(dVar, i4);
        if (b4 != null) {
            return b4;
        }
        ColorStateList h4 = h(resources, i4, theme);
        if (h4 == null) {
            return b.b(resources, i4, theme);
        }
        a(dVar, i4, h4, theme);
        return h4;
    }

    public static Drawable d(Resources resources, int i4, Resources.Theme theme) {
        return a.a(resources, i4, theme);
    }

    public static Drawable e(Resources resources, int i4, int i5, Resources.Theme theme) {
        return a.b(resources, i4, i5, theme);
    }

    public static Typeface f(Context context, int i4, TypedValue typedValue, int i5, e eVar) {
        if (context.isRestricted()) {
            return null;
        }
        return j(context, i4, typedValue, i5, eVar, null, true, false);
    }

    private static TypedValue g() {
        ThreadLocal threadLocal = f876a;
        TypedValue typedValue = (TypedValue) threadLocal.get();
        if (typedValue != null) {
            return typedValue;
        }
        TypedValue typedValue2 = new TypedValue();
        threadLocal.set(typedValue2);
        return typedValue2;
    }

    private static ColorStateList h(Resources resources, int i4, Resources.Theme theme) {
        if (i(resources, i4)) {
            return null;
        }
        try {
            return androidx.core.content.res.c.a(resources, resources.getXml(i4), theme);
        } catch (Exception e4) {
            Log.w("ResourcesCompat", "Failed to inflate ColorStateList, leaving it to the framework", e4);
            return null;
        }
    }

    private static boolean i(Resources resources, int i4) {
        TypedValue g4 = g();
        resources.getValue(i4, g4, true);
        int i5 = g4.type;
        return i5 >= 28 && i5 <= 31;
    }

    private static Typeface j(Context context, int i4, TypedValue typedValue, int i5, e eVar, Handler handler, boolean z3, boolean z4) {
        Resources resources = context.getResources();
        resources.getValue(i4, typedValue, true);
        Typeface k4 = k(context, resources, typedValue, i4, i5, eVar, handler, z3, z4);
        if (k4 != null || eVar != null || z4) {
            return k4;
        }
        throw new Resources.NotFoundException("Font resource ID #0x" + Integer.toHexString(i4) + " could not be retrieved.");
    }

    /* JADX WARN: Removed duplicated region for block: B:36:0x00bd  */
    /*
        Code decompiled incorrectly, please refer to instructions dump.
        To view partially-correct add '--show-bad-code' argument
    */
    private static android.graphics.Typeface k(android.content.Context r13, android.content.res.Resources r14, android.util.TypedValue r15, int r16, int r17, androidx.core.content.res.f.e r18, android.os.Handler r19, boolean r20, boolean r21) {
        /*
            Method dump skipped, instructions count: 245
            To view this dump add '--comments-level debug' option
        */
        throw new UnsupportedOperationException("Method not decompiled: androidx.core.content.res.f.k(android.content.Context, android.content.res.Resources, android.util.TypedValue, int, int, androidx.core.content.res.f$e, android.os.Handler, boolean, boolean):android.graphics.Typeface");
    }
}
