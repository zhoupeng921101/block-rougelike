package w2;

import b3.f;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class b {

    /* renamed from: a, reason: collision with root package name */
    public static final a f5094a;

    static {
        a aVar;
        Object newInstance;
        Object newInstance2;
        int a4 = a();
        if (a4 >= 65544 || a4 < 65536) {
            try {
                newInstance = y2.a.class.newInstance();
                f.d(newInstance, "forName(\"kotlin.internal…entations\").newInstance()");
                try {
                    try {
                    } catch (ClassCastException e4) {
                        ClassLoader classLoader = newInstance.getClass().getClassLoader();
                        ClassLoader classLoader2 = a.class.getClassLoader();
                        if (f.a(classLoader, classLoader2)) {
                            throw e4;
                        }
                        throw new ClassNotFoundException("Instance class was loaded from a different classloader: " + classLoader + ", base type classloader: " + classLoader2, e4);
                    }
                } catch (ClassNotFoundException unused) {
                }
            } catch (ClassNotFoundException unused2) {
                Object newInstance3 = Class.forName("kotlin.internal.JRE8PlatformImplementations").newInstance();
                f.d(newInstance3, "forName(\"kotlin.internal…entations\").newInstance()");
                try {
                    if (newInstance3 == null) {
                        throw new NullPointerException("null cannot be cast to non-null type kotlin.internal.PlatformImplementations");
                    }
                    aVar = (a) newInstance3;
                } catch (ClassCastException e5) {
                    ClassLoader classLoader3 = newInstance3.getClass().getClassLoader();
                    ClassLoader classLoader4 = a.class.getClassLoader();
                    if (f.a(classLoader3, classLoader4)) {
                        throw e5;
                    }
                    throw new ClassNotFoundException("Instance class was loaded from a different classloader: " + classLoader3 + ", base type classloader: " + classLoader4, e5);
                }
            }
            if (newInstance == null) {
                throw new NullPointerException("null cannot be cast to non-null type kotlin.internal.PlatformImplementations");
            }
            aVar = (a) newInstance;
            f5094a = aVar;
        }
        if (a4 >= 65543 || a4 < 65536) {
            try {
                try {
                    newInstance2 = x2.a.class.newInstance();
                    f.d(newInstance2, "forName(\"kotlin.internal…entations\").newInstance()");
                    try {
                    } catch (ClassCastException e6) {
                        ClassLoader classLoader5 = newInstance2.getClass().getClassLoader();
                        ClassLoader classLoader6 = a.class.getClassLoader();
                        if (f.a(classLoader5, classLoader6)) {
                            throw e6;
                        }
                        throw new ClassNotFoundException("Instance class was loaded from a different classloader: " + classLoader5 + ", base type classloader: " + classLoader6, e6);
                    }
                } catch (ClassNotFoundException unused3) {
                    Object newInstance4 = Class.forName("kotlin.internal.JRE7PlatformImplementations").newInstance();
                    f.d(newInstance4, "forName(\"kotlin.internal…entations\").newInstance()");
                    try {
                        if (newInstance4 == null) {
                            throw new NullPointerException("null cannot be cast to non-null type kotlin.internal.PlatformImplementations");
                        }
                        aVar = (a) newInstance4;
                    } catch (ClassCastException e7) {
                        ClassLoader classLoader7 = newInstance4.getClass().getClassLoader();
                        ClassLoader classLoader8 = a.class.getClassLoader();
                        if (f.a(classLoader7, classLoader8)) {
                            throw e7;
                        }
                        throw new ClassNotFoundException("Instance class was loaded from a different classloader: " + classLoader7 + ", base type classloader: " + classLoader8, e7);
                    }
                }
            } catch (ClassNotFoundException unused4) {
            }
            if (newInstance2 == null) {
                throw new NullPointerException("null cannot be cast to non-null type kotlin.internal.PlatformImplementations");
            }
            aVar = (a) newInstance2;
            f5094a = aVar;
        }
        aVar = new a();
        f5094a = aVar;
    }

    private static final int a() {
        String property = System.getProperty("java.specification.version");
        if (property != null) {
            int e4 = h3.c.e(property, '.', 0, false, 6, null);
            if (e4 < 0) {
                try {
                    return Integer.parseInt(property) * 65536;
                } catch (NumberFormatException unused) {
                    return 65542;
                }
            }
            int i4 = e4 + 1;
            int e5 = h3.c.e(property, '.', i4, false, 4, null);
            if (e5 < 0) {
                e5 = property.length();
            }
            String substring = property.substring(0, e4);
            f.d(substring, "this as java.lang.String…ing(startIndex, endIndex)");
            String substring2 = property.substring(i4, e5);
            f.d(substring2, "this as java.lang.String…ing(startIndex, endIndex)");
            try {
                return (Integer.parseInt(substring) * 65536) + Integer.parseInt(substring2);
            } catch (NumberFormatException unused2) {
            }
        }
        return 65542;
    }
}
