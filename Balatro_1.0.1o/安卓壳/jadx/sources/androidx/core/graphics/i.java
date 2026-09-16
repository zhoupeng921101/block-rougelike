package androidx.core.graphics;

import android.content.Context;
import android.content.res.Resources;
import android.graphics.Typeface;
import android.os.CancellationSignal;
import android.os.ParcelFileDescriptor;
import android.system.ErrnoException;
import android.system.Os;
import android.system.OsConstants;
import android.util.Log;
import androidx.core.content.res.d;
import androidx.core.provider.g;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.lang.reflect.Array;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class i extends n {

    /* renamed from: b, reason: collision with root package name */
    private static Class f920b;

    /* renamed from: c, reason: collision with root package name */
    private static Constructor f921c;

    /* renamed from: d, reason: collision with root package name */
    private static Method f922d;

    /* renamed from: e, reason: collision with root package name */
    private static Method f923e;

    /* renamed from: f, reason: collision with root package name */
    private static boolean f924f;

    i() {
    }

    private static boolean h(Object obj, String str, int i4, boolean z3) {
        k();
        try {
            return ((Boolean) f922d.invoke(obj, str, Integer.valueOf(i4), Boolean.valueOf(z3))).booleanValue();
        } catch (IllegalAccessException | InvocationTargetException e4) {
            throw new RuntimeException(e4);
        }
    }

    private static Typeface i(Object obj) {
        k();
        try {
            Object newInstance = Array.newInstance((Class<?>) f920b, 1);
            Array.set(newInstance, 0, obj);
            return (Typeface) f923e.invoke(null, newInstance);
        } catch (IllegalAccessException | InvocationTargetException e4) {
            throw new RuntimeException(e4);
        }
    }

    private File j(ParcelFileDescriptor parcelFileDescriptor) {
        try {
            String readlink = Os.readlink("/proc/self/fd/" + parcelFileDescriptor.getFd());
            if (OsConstants.S_ISREG(Os.stat(readlink).st_mode)) {
                return new File(readlink);
            }
        } catch (ErrnoException unused) {
        }
        return null;
    }

    private static void k() {
        Method method;
        Class<?> cls;
        Method method2;
        if (f924f) {
            return;
        }
        f924f = true;
        Constructor<?> constructor = null;
        try {
            cls = Class.forName("android.graphics.FontFamily");
            Constructor<?> constructor2 = cls.getConstructor(null);
            method2 = cls.getMethod("addFontWeightStyle", String.class, Integer.TYPE, Boolean.TYPE);
            method = Typeface.class.getMethod("createFromFamiliesWithDefault", Array.newInstance(cls, 1).getClass());
            constructor = constructor2;
        } catch (ClassNotFoundException | NoSuchMethodException e4) {
            Log.e("TypefaceCompatApi21Impl", e4.getClass().getName(), e4);
            method = null;
            cls = null;
            method2 = null;
        }
        f921c = constructor;
        f920b = cls;
        f922d = method2;
        f923e = method;
    }

    private static Object l() {
        k();
        try {
            return f921c.newInstance(null);
        } catch (IllegalAccessException | InstantiationException | InvocationTargetException e4) {
            throw new RuntimeException(e4);
        }
    }

    @Override // androidx.core.graphics.n
    public Typeface a(Context context, d.c cVar, Resources resources, int i4) {
        Object l3 = l();
        for (d.C0007d c0007d : cVar.a()) {
            File e4 = o.e(context);
            if (e4 == null) {
                return null;
            }
            try {
                if (!o.c(e4, resources, c0007d.b())) {
                    return null;
                }
                if (!h(l3, e4.getPath(), c0007d.e(), c0007d.f())) {
                    return null;
                }
                e4.delete();
            } catch (RuntimeException unused) {
                return null;
            } finally {
                e4.delete();
            }
        }
        return i(l3);
    }

    @Override // androidx.core.graphics.n
    public Typeface b(Context context, CancellationSignal cancellationSignal, g.b[] bVarArr, int i4) {
        FileInputStream fileInputStream;
        Typeface c4;
        if (bVarArr.length < 1) {
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
                File j4 = j(openFileDescriptor);
                try {
                    if (j4 != null && j4.canRead()) {
                        c4 = Typeface.createFromFile(j4);
                        openFileDescriptor.close();
                        return c4;
                    }
                    c4 = super.c(context, fileInputStream);
                    fileInputStream.close();
                    openFileDescriptor.close();
                    return c4;
                } finally {
                }
                fileInputStream = new FileInputStream(openFileDescriptor.getFileDescriptor());
            } finally {
            }
        } catch (IOException unused) {
            return null;
        }
    }
}
