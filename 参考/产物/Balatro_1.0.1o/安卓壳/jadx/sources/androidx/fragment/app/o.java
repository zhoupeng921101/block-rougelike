package androidx.fragment.app;

import a1.b2.c3;
import androidx.fragment.app.Fragment;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class o {

    /* renamed from: a, reason: collision with root package name */
    private static final k.g f1554a = new k.g();

    static boolean b(ClassLoader classLoader, String str) {
        try {
            return Fragment.class.isAssignableFrom(c(classLoader, str));
        } catch (ClassNotFoundException unused) {
            return false;
        }
    }

    private static Class c(ClassLoader classLoader, String str) {
        k.g gVar = f1554a;
        k.g gVar2 = (k.g) gVar.get(classLoader);
        if (gVar2 == null) {
            gVar2 = new k.g();
            gVar.put(classLoader, gVar2);
        }
        Class cls = (Class) gVar2.get(str);
        if (cls != null) {
            return cls;
        }
        Class<?> cls2 = Class.forName(str, false, classLoader);
        gVar2.put(str, cls2);
        return cls2;
    }

    public static Class d(ClassLoader classLoader, String str) {
        String d4 = c3.d4(1213);
        try {
            return c(classLoader, str);
        } catch (ClassCastException e4) {
            throw new Fragment.h(d4 + str + ": make sure class is a valid subclass of Fragment", e4);
        } catch (ClassNotFoundException e5) {
            throw new Fragment.h(d4 + str + ": make sure class name exists", e5);
        }
    }

    public abstract Fragment a(ClassLoader classLoader, String str);
}
