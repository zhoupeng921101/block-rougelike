package androidx.core.graphics;

import a1.b2.c3;
import android.content.Context;
import android.content.res.AssetManager;
import android.content.res.Resources;
import android.graphics.Typeface;
import android.graphics.fonts.FontVariationAxis;
import android.os.CancellationSignal;
import android.os.ParcelFileDescriptor;
import android.util.Log;
import androidx.core.content.res.d;
import androidx.core.provider.g;
import java.io.IOException;
import java.lang.reflect.Array;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.nio.ByteBuffer;
import java.util.Map;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class k extends i {

    /* renamed from: g, reason: collision with root package name */
    protected final Class f929g;

    /* renamed from: h, reason: collision with root package name */
    protected final Constructor f930h;

    /* renamed from: i, reason: collision with root package name */
    protected final Method f931i;

    /* renamed from: j, reason: collision with root package name */
    protected final Method f932j;

    /* renamed from: k, reason: collision with root package name */
    protected final Method f933k;

    /* renamed from: l, reason: collision with root package name */
    protected final Method f934l;

    /* renamed from: m, reason: collision with root package name */
    protected final Method f935m;

    public k() {
        Class cls;
        Constructor constructor;
        Method method;
        Method method2;
        Method method3;
        Method method4;
        Method method5;
        try {
            cls = v();
            constructor = w(cls);
            method = s(cls);
            method2 = t(cls);
            method3 = x(cls);
            method4 = r(cls);
            method5 = u(cls);
        } catch (ClassNotFoundException | NoSuchMethodException e4) {
            Log.e(c3.d4(145), "Unable to collect necessary methods for class " + e4.getClass().getName(), e4);
            cls = null;
            constructor = null;
            method = null;
            method2 = null;
            method3 = null;
            method4 = null;
            method5 = null;
        }
        this.f929g = cls;
        this.f930h = constructor;
        this.f931i = method;
        this.f932j = method2;
        this.f933k = method3;
        this.f934l = method4;
        this.f935m = method5;
    }

    private Object l() {
        try {
            return this.f930h.newInstance(null);
        } catch (IllegalAccessException | InstantiationException | InvocationTargetException unused) {
            return null;
        }
    }

    private void m(Object obj) {
        try {
            this.f934l.invoke(obj, null);
        } catch (IllegalAccessException | InvocationTargetException unused) {
        }
    }

    private boolean n(Context context, Object obj, String str, int i4, int i5, int i6, FontVariationAxis[] fontVariationAxisArr) {
        try {
            return ((Boolean) this.f931i.invoke(obj, context.getAssets(), str, 0, Boolean.FALSE, Integer.valueOf(i4), Integer.valueOf(i5), Integer.valueOf(i6), fontVariationAxisArr)).booleanValue();
        } catch (IllegalAccessException | InvocationTargetException unused) {
            return false;
        }
    }

    private boolean o(Object obj, ByteBuffer byteBuffer, int i4, int i5, int i6) {
        try {
            return ((Boolean) this.f932j.invoke(obj, byteBuffer, Integer.valueOf(i4), null, Integer.valueOf(i5), Integer.valueOf(i6))).booleanValue();
        } catch (IllegalAccessException | InvocationTargetException unused) {
            return false;
        }
    }

    private boolean p(Object obj) {
        try {
            return ((Boolean) this.f933k.invoke(obj, null)).booleanValue();
        } catch (IllegalAccessException | InvocationTargetException unused) {
            return false;
        }
    }

    private boolean q() {
        if (this.f931i == null) {
            Log.w("TypefaceCompatApi26Impl", "Unable to collect necessary private methods. Fallback to legacy implementation.");
        }
        return this.f931i != null;
    }

    @Override // androidx.core.graphics.i, androidx.core.graphics.n
    public Typeface a(Context context, d.c cVar, Resources resources, int i4) {
        if (!q()) {
            return super.a(context, cVar, resources, i4);
        }
        Object l3 = l();
        if (l3 == null) {
            return null;
        }
        d.C0007d[] a4 = cVar.a();
        int length = a4.length;
        int i5 = 0;
        while (i5 < length) {
            d.C0007d c0007d = a4[i5];
            Context context2 = context;
            if (!n(context2, l3, c0007d.a(), c0007d.c(), c0007d.e(), c0007d.f() ? 1 : 0, FontVariationAxis.fromFontVariationSettings(c0007d.d()))) {
                m(l3);
                return null;
            }
            i5++;
            context = context2;
        }
        if (p(l3)) {
            return i(l3);
        }
        return null;
    }

    @Override // androidx.core.graphics.i, androidx.core.graphics.n
    public Typeface b(Context context, CancellationSignal cancellationSignal, g.b[] bVarArr, int i4) {
        Typeface i5;
        Object obj;
        if (bVarArr.length < 1) {
            return null;
        }
        if (q()) {
            Map h4 = o.h(context, bVarArr, cancellationSignal);
            Object l3 = l();
            if (l3 == null) {
                return null;
            }
            int length = bVarArr.length;
            int i6 = 0;
            boolean z3 = false;
            while (i6 < length) {
                g.b bVar = bVarArr[i6];
                ByteBuffer byteBuffer = (ByteBuffer) h4.get(bVar.d());
                if (byteBuffer == null) {
                    obj = l3;
                } else {
                    boolean o3 = o(l3, byteBuffer, bVar.c(), bVar.e(), bVar.f() ? 1 : 0);
                    obj = l3;
                    if (!o3) {
                        m(obj);
                        return null;
                    }
                    z3 = true;
                }
                i6++;
                l3 = obj;
                z3 = z3;
            }
            Object obj2 = l3;
            if (!z3) {
                m(obj2);
                return null;
            }
            if (p(obj2) && (i5 = i(obj2)) != null) {
                return Typeface.create(i5, i4);
            }
            return null;
        }
        g.b g4 = g(bVarArr, i4);
        try {
            ParcelFileDescriptor openFileDescriptor = context.getContentResolver().openFileDescriptor(g4.d(), "r", cancellationSignal);
            if (openFileDescriptor == null) {
                if (openFileDescriptor != null) {
                    openFileDescriptor.close();
                }
                return null;
            }
            try {
                Typeface build = new Typeface.Builder(openFileDescriptor.getFileDescriptor()).setWeight(g4.e()).setItalic(g4.f()).build();
                openFileDescriptor.close();
                return build;
            } finally {
            }
        } catch (IOException unused) {
            return null;
        }
    }

    @Override // androidx.core.graphics.n
    public Typeface d(Context context, Resources resources, int i4, String str, int i5) {
        if (!q()) {
            return super.d(context, resources, i4, str, i5);
        }
        Object l3 = l();
        if (l3 == null) {
            return null;
        }
        if (!n(context, l3, str, 0, -1, -1, null)) {
            m(l3);
            return null;
        }
        if (p(l3)) {
            return i(l3);
        }
        return null;
    }

    protected Typeface i(Object obj) {
        try {
            Object newInstance = Array.newInstance((Class<?>) this.f929g, 1);
            Array.set(newInstance, 0, obj);
            return (Typeface) this.f935m.invoke(null, newInstance, -1, -1);
        } catch (IllegalAccessException | InvocationTargetException unused) {
            return null;
        }
    }

    protected Method r(Class cls) {
        return cls.getMethod("abortCreation", null);
    }

    protected Method s(Class cls) {
        Class cls2 = Boolean.TYPE;
        Class cls3 = Integer.TYPE;
        return cls.getMethod(c3.d4(1019), AssetManager.class, String.class, cls3, cls2, cls3, cls3, cls3, FontVariationAxis[].class);
    }

    protected Method t(Class cls) {
        Class cls2 = Integer.TYPE;
        return cls.getMethod(c3.d4(185), ByteBuffer.class, cls2, FontVariationAxis[].class, cls2, cls2);
    }

    protected Method u(Class cls) {
        Class<?> cls2 = Array.newInstance((Class<?>) cls, 1).getClass();
        Class cls3 = Integer.TYPE;
        Method declaredMethod = Typeface.class.getDeclaredMethod("createFromFamiliesWithDefault", cls2, cls3, cls3);
        declaredMethod.setAccessible(true);
        return declaredMethod;
    }

    protected Class v() {
        return Class.forName("android.graphics.FontFamily");
    }

    protected Constructor w(Class cls) {
        return cls.getConstructor(null);
    }

    protected Method x(Class cls) {
        return cls.getMethod("freeze", null);
    }
}
