package androidx.lifecycle;

import a1.b2.c3;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class m {

    /* renamed from: a, reason: collision with root package name */
    private static Map f1678a = new HashMap();

    /* renamed from: b, reason: collision with root package name */
    private static Map f1679b = new HashMap();

    private static e a(Constructor constructor, Object obj) {
        try {
            h.d.a(constructor.newInstance(obj));
            return null;
        } catch (IllegalAccessException e4) {
            throw new RuntimeException(e4);
        } catch (InstantiationException e5) {
            throw new RuntimeException(e5);
        } catch (InvocationTargetException e6) {
            throw new RuntimeException(e6);
        }
    }

    private static Constructor b(Class cls) {
        try {
            Package r02 = cls.getPackage();
            String canonicalName = cls.getCanonicalName();
            String name = r02 != null ? r02.getName() : "";
            if (!name.isEmpty()) {
                canonicalName = canonicalName.substring(name.length() + 1);
            }
            String c4 = c(canonicalName);
            if (!name.isEmpty()) {
                c4 = name + "." + c4;
            }
            Constructor<?> declaredConstructor = Class.forName(c4).getDeclaredConstructor(cls);
            if (!declaredConstructor.isAccessible()) {
                declaredConstructor.setAccessible(true);
            }
            return declaredConstructor;
        } catch (ClassNotFoundException unused) {
            return null;
        } catch (NoSuchMethodException e4) {
            throw new RuntimeException(e4);
        }
    }

    public static String c(String str) {
        return str.replace(c3.d4(973), "_") + "_LifecycleAdapter";
    }

    private static int d(Class cls) {
        Integer num = (Integer) f1678a.get(cls);
        if (num != null) {
            return num.intValue();
        }
        int g4 = g(cls);
        f1678a.put(cls, Integer.valueOf(g4));
        return g4;
    }

    private static boolean e(Class cls) {
        return cls != null && j.class.isAssignableFrom(cls);
    }

    static i f(Object obj) {
        boolean z3 = obj instanceof i;
        boolean z4 = obj instanceof d;
        if (z3 && z4) {
            return new FullLifecycleObserverAdapter((d) obj, (i) obj);
        }
        if (z4) {
            return new FullLifecycleObserverAdapter((d) obj, null);
        }
        if (z3) {
            return (i) obj;
        }
        Class<?> cls = obj.getClass();
        if (d(cls) != 2) {
            return new ReflectiveGenericLifecycleObserver(obj);
        }
        List list = (List) f1679b.get(cls);
        if (list.size() == 1) {
            a((Constructor) list.get(0), obj);
            return new SingleGeneratedAdapterObserver(null);
        }
        e[] eVarArr = new e[list.size()];
        for (int i4 = 0; i4 < list.size(); i4++) {
            a((Constructor) list.get(i4), obj);
            eVarArr[i4] = null;
        }
        return new CompositeGeneratedAdaptersObserver(eVarArr);
    }

    private static int g(Class cls) {
        ArrayList arrayList;
        if (cls.getCanonicalName() == null) {
            return 1;
        }
        Constructor b4 = b(cls);
        if (b4 != null) {
            f1679b.put(cls, Collections.singletonList(b4));
            return 2;
        }
        if (a.f1650c.d(cls)) {
            return 1;
        }
        Class superclass = cls.getSuperclass();
        if (!e(superclass)) {
            arrayList = null;
        } else {
            if (d(superclass) == 1) {
                return 1;
            }
            arrayList = new ArrayList((Collection) f1679b.get(superclass));
        }
        for (Class<?> cls2 : cls.getInterfaces()) {
            if (e(cls2)) {
                if (d(cls2) == 1) {
                    return 1;
                }
                if (arrayList == null) {
                    arrayList = new ArrayList();
                }
                arrayList.addAll((Collection) f1679b.get(cls2));
            }
        }
        if (arrayList == null) {
            return 1;
        }
        f1679b.put(cls, arrayList);
        return 2;
    }
}
