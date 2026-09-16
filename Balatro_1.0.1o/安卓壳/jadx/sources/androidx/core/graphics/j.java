package androidx.core.graphics;

import a1.b2.c3;
import android.content.Context;
import android.content.res.Resources;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.CancellationSignal;
import android.util.Log;
import androidx.core.content.res.d;
import androidx.core.provider.g;
import java.lang.reflect.Array;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.nio.ByteBuffer;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class j extends n {

    /* renamed from: b, reason: collision with root package name */
    private static final Class f925b;

    /* renamed from: c, reason: collision with root package name */
    private static final Constructor f926c;

    /* renamed from: d, reason: collision with root package name */
    private static final Method f927d;

    /* renamed from: e, reason: collision with root package name */
    private static final Method f928e;

    static {
        Class<?> cls;
        Method method;
        Method method2;
        Constructor<?> constructor = null;
        try {
            cls = Class.forName("android.graphics.FontFamily");
            Constructor<?> constructor2 = cls.getConstructor(null);
            Class cls2 = Integer.TYPE;
            method2 = cls.getMethod("addFontWeightStyle", ByteBuffer.class, cls2, List.class, cls2, Boolean.TYPE);
            method = Typeface.class.getMethod("createFromFamiliesWithDefault", Array.newInstance(cls, 1).getClass());
            constructor = constructor2;
        } catch (ClassNotFoundException | NoSuchMethodException e4) {
            Log.e(c3.d4(1060), e4.getClass().getName(), e4);
            cls = null;
            method = null;
            method2 = null;
        }
        f926c = constructor;
        f925b = cls;
        f927d = method2;
        f928e = method;
    }

    j() {
    }

    private static boolean h(Object obj, ByteBuffer byteBuffer, int i4, int i5, boolean z3) {
        try {
            return ((Boolean) f927d.invoke(obj, byteBuffer, Integer.valueOf(i4), null, Integer.valueOf(i5), Boolean.valueOf(z3))).booleanValue();
        } catch (IllegalAccessException | InvocationTargetException unused) {
            return false;
        }
    }

    private static Typeface i(Object obj) {
        try {
            Object newInstance = Array.newInstance((Class<?>) f925b, 1);
            Array.set(newInstance, 0, obj);
            return (Typeface) f928e.invoke(null, newInstance);
        } catch (IllegalAccessException | InvocationTargetException unused) {
            return null;
        }
    }

    public static boolean j() {
        Method method = f927d;
        if (method == null) {
            Log.w("TypefaceCompatApi24Impl", "Unable to collect necessary private methods.Fallback to legacy implementation.");
        }
        return method != null;
    }

    private static Object k() {
        try {
            return f926c.newInstance(null);
        } catch (IllegalAccessException | InstantiationException | InvocationTargetException unused) {
            return null;
        }
    }

    @Override // androidx.core.graphics.n
    public Typeface a(Context context, d.c cVar, Resources resources, int i4) {
        Object k4 = k();
        if (k4 == null) {
            return null;
        }
        for (d.C0007d c0007d : cVar.a()) {
            ByteBuffer b4 = o.b(context, resources, c0007d.b());
            if (b4 == null || !h(k4, b4, c0007d.c(), c0007d.e(), c0007d.f())) {
                return null;
            }
        }
        return i(k4);
    }

    @Override // androidx.core.graphics.n
    public Typeface b(Context context, CancellationSignal cancellationSignal, g.b[] bVarArr, int i4) {
        Object k4 = k();
        if (k4 == null) {
            return null;
        }
        k.g gVar = new k.g();
        for (g.b bVar : bVarArr) {
            Uri d4 = bVar.d();
            ByteBuffer byteBuffer = (ByteBuffer) gVar.get(d4);
            if (byteBuffer == null) {
                byteBuffer = o.f(context, cancellationSignal, d4);
                gVar.put(d4, byteBuffer);
            }
            if (byteBuffer == null || !h(k4, byteBuffer, bVar.c(), bVar.e(), bVar.f())) {
                return null;
            }
        }
        Typeface i5 = i(k4);
        if (i5 == null) {
            return null;
        }
        return Typeface.create(i5, i4);
    }
}
