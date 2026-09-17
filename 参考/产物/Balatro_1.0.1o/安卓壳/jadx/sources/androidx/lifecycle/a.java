package androidx.lifecycle;

import androidx.lifecycle.g;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class a {

    /* renamed from: c, reason: collision with root package name */
    static a f1650c = new a();

    /* renamed from: a, reason: collision with root package name */
    private final Map f1651a = new HashMap();

    /* renamed from: b, reason: collision with root package name */
    private final Map f1652b = new HashMap();

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: androidx.lifecycle.a$a, reason: collision with other inner class name */
    static class C0020a {

        /* renamed from: a, reason: collision with root package name */
        final Map f1653a = new HashMap();

        /* renamed from: b, reason: collision with root package name */
        final Map f1654b;

        C0020a(Map map) {
            this.f1654b = map;
            for (Map.Entry entry : map.entrySet()) {
                g.b bVar = (g.b) entry.getValue();
                List list = (List) this.f1653a.get(bVar);
                if (list == null) {
                    list = new ArrayList();
                    this.f1653a.put(bVar, list);
                }
                list.add((b) entry.getKey());
            }
        }

        private static void b(List list, k kVar, g.b bVar, Object obj) {
            if (list != null) {
                for (int size = list.size() - 1; size >= 0; size--) {
                    ((b) list.get(size)).a(kVar, bVar, obj);
                }
            }
        }

        void a(k kVar, g.b bVar, Object obj) {
            b((List) this.f1653a.get(bVar), kVar, bVar, obj);
            b((List) this.f1653a.get(g.b.ON_ANY), kVar, bVar, obj);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static final class b {

        /* renamed from: a, reason: collision with root package name */
        final int f1655a;

        /* renamed from: b, reason: collision with root package name */
        final Method f1656b;

        b(int i4, Method method) {
            this.f1655a = i4;
            this.f1656b = method;
            method.setAccessible(true);
        }

        void a(k kVar, g.b bVar, Object obj) {
            try {
                int i4 = this.f1655a;
                if (i4 == 0) {
                    this.f1656b.invoke(obj, null);
                } else if (i4 == 1) {
                    this.f1656b.invoke(obj, kVar);
                } else {
                    if (i4 != 2) {
                        return;
                    }
                    this.f1656b.invoke(obj, kVar, bVar);
                }
            } catch (IllegalAccessException e4) {
                throw new RuntimeException(e4);
            } catch (InvocationTargetException e5) {
                throw new RuntimeException("Failed to call observer method", e5.getCause());
            }
        }

        public boolean equals(Object obj) {
            if (this == obj) {
                return true;
            }
            if (!(obj instanceof b)) {
                return false;
            }
            b bVar = (b) obj;
            return this.f1655a == bVar.f1655a && this.f1656b.getName().equals(bVar.f1656b.getName());
        }

        public int hashCode() {
            return (this.f1655a * 31) + this.f1656b.getName().hashCode();
        }
    }

    a() {
    }

    private C0020a a(Class cls, Method[] methodArr) {
        int i4;
        C0020a c4;
        Class superclass = cls.getSuperclass();
        HashMap hashMap = new HashMap();
        if (superclass != null && (c4 = c(superclass)) != null) {
            hashMap.putAll(c4.f1654b);
        }
        for (Class<?> cls2 : cls.getInterfaces()) {
            for (Map.Entry entry : c(cls2).f1654b.entrySet()) {
                e(hashMap, (b) entry.getKey(), (g.b) entry.getValue(), cls);
            }
        }
        if (methodArr == null) {
            methodArr = b(cls);
        }
        boolean z3 = false;
        for (Method method : methodArr) {
            q qVar = (q) method.getAnnotation(q.class);
            if (qVar != null) {
                Class<?>[] parameterTypes = method.getParameterTypes();
                if (parameterTypes.length <= 0) {
                    i4 = 0;
                } else {
                    if (!parameterTypes[0].isAssignableFrom(k.class)) {
                        throw new IllegalArgumentException("invalid parameter type. Must be one and instanceof LifecycleOwner");
                    }
                    i4 = 1;
                }
                g.b value = qVar.value();
                if (parameterTypes.length > 1) {
                    if (!parameterTypes[1].isAssignableFrom(g.b.class)) {
                        throw new IllegalArgumentException("invalid parameter type. second arg must be an event");
                    }
                    if (value != g.b.ON_ANY) {
                        throw new IllegalArgumentException("Second arg is supported only for ON_ANY value");
                    }
                    i4 = 2;
                }
                if (parameterTypes.length > 2) {
                    throw new IllegalArgumentException("cannot have more than 2 params");
                }
                e(hashMap, new b(i4, method), value, cls);
                z3 = true;
            }
        }
        C0020a c0020a = new C0020a(hashMap);
        this.f1651a.put(cls, c0020a);
        this.f1652b.put(cls, Boolean.valueOf(z3));
        return c0020a;
    }

    private Method[] b(Class cls) {
        try {
            return cls.getDeclaredMethods();
        } catch (NoClassDefFoundError e4) {
            throw new IllegalArgumentException("The observer class has some methods that use newer APIs which are not available in the current OS version. Lifecycles cannot access even other methods so you should make sure that your observer classes only access framework classes that are available in your min API level OR use lifecycle:compiler annotation processor.", e4);
        }
    }

    private void e(Map map, b bVar, g.b bVar2, Class cls) {
        g.b bVar3 = (g.b) map.get(bVar);
        if (bVar3 == null || bVar2 == bVar3) {
            if (bVar3 == null) {
                map.put(bVar, bVar2);
                return;
            }
            return;
        }
        throw new IllegalArgumentException("Method " + bVar.f1656b.getName() + " in " + cls.getName() + " already declared with different @OnLifecycleEvent value: previous value " + bVar3 + ", new value " + bVar2);
    }

    C0020a c(Class cls) {
        C0020a c0020a = (C0020a) this.f1651a.get(cls);
        return c0020a != null ? c0020a : a(cls, null);
    }

    boolean d(Class cls) {
        Boolean bool = (Boolean) this.f1652b.get(cls);
        if (bool != null) {
            return bool.booleanValue();
        }
        Method[] b4 = b(cls);
        for (Method method : b4) {
            if (((q) method.getAnnotation(q.class)) != null) {
                a(cls, b4);
                return true;
            }
        }
        this.f1652b.put(cls, Boolean.FALSE);
        return false;
    }
}
