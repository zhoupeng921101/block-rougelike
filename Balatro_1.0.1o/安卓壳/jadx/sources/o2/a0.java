package o2;

import a1.b2.c3;
import android.content.res.Configuration;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Locale;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a0 {

    /* renamed from: a, reason: collision with root package name */
    private static final g0 f4290a = g0.f(a0.class.getSimpleName());

    static Class a(String str) {
        try {
            return Class.forName(str);
        } catch (Throwable th) {
            f4290a.a("Failed to find class " + str + c3.d4(1502) + l0.l(th));
            return null;
        }
    }

    static String b() {
        try {
            return (String) i("android.os.Build", "CPU_ABI");
        } catch (Throwable th) {
            f4290a.a("Failed to get CPU ABI via reflection: " + l0.l(th));
            return null;
        }
    }

    static Locale c(Configuration configuration) {
        try {
            return (Locale) j("android.content.res.Configuration", "locale", configuration);
        } catch (Throwable th) {
            f4290a.a("Failed to get locale from field via reflection: " + l0.l(th));
            return null;
        }
    }

    static Locale d(Configuration configuration) {
        try {
            Object f4 = f(configuration, "getLocales", null, new Object[0]);
            if (f4 != null) {
                return (Locale) f(f4, "get", new Class[]{Integer.TYPE}, 0);
            }
            f4290a.a("getLocaleFromLocaleList: locales list is null");
            return null;
        } catch (Throwable th) {
            f4290a.a(c3.d4(996) + l0.l(th));
            return null;
        }
    }

    static String[] e() {
        try {
            return (String[]) i("android.os.Build", "SUPPORTED_ABIS");
        } catch (Throwable th) {
            f4290a.a("Failed to get supported ABIs via reflection: " + l0.l(th));
            return null;
        }
    }

    public static Object f(Object obj, String str, Class[] clsArr, Object... objArr) {
        return g(obj.getClass(), str, obj, clsArr, objArr);
    }

    static Object g(Class cls, String str, Object obj, Class[] clsArr, Object... objArr) {
        Method method = cls.getMethod(str, clsArr);
        if (method != null) {
            return method.invoke(obj, objArr);
        }
        f4290a.a("invokeMethod: method object is null for method: " + str);
        return null;
    }

    public static Object h(String str, String str2, Class[] clsArr, Object... objArr) {
        return g(Class.forName(str), str2, null, clsArr, objArr);
    }

    static Object i(String str, String str2) {
        return j(str, str2, null);
    }

    static Object j(String str, String str2, Object obj) {
        Class a4 = a(str);
        if (a4 == null) {
            f4290a.a("readField: class object is null for class: " + str);
            return null;
        }
        Field field = a4.getField(str2);
        if (field != null) {
            return field.get(obj);
        }
        f4290a.a("readField: field object is null for field: " + str2 + c3.d4(1503) + str);
        return null;
    }
}
