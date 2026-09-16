package w2;

import a1.b2.c3;
import b3.f;
import java.lang.reflect.Method;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class a {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: w2.a$a, reason: collision with other inner class name */
    private static final class C0082a {

        /* renamed from: a, reason: collision with root package name */
        public static final C0082a f5091a = new C0082a();

        /* renamed from: b, reason: collision with root package name */
        public static final Method f5092b;

        /* renamed from: c, reason: collision with root package name */
        public static final Method f5093c;

        static {
            Method method;
            Method method2;
            Method[] methods = Throwable.class.getMethods();
            f.d(methods, c3.d4(1301));
            int length = methods.length;
            int i4 = 0;
            int i5 = 0;
            while (true) {
                method = null;
                if (i5 >= length) {
                    method2 = null;
                    break;
                }
                method2 = methods[i5];
                if (f.a(method2.getName(), "addSuppressed")) {
                    Class<?>[] parameterTypes = method2.getParameterTypes();
                    f.d(parameterTypes, "it.parameterTypes");
                    if (f.a(u2.a.e(parameterTypes), Throwable.class)) {
                        break;
                    }
                }
                i5++;
            }
            f5092b = method2;
            int length2 = methods.length;
            while (true) {
                if (i4 >= length2) {
                    break;
                }
                Method method3 = methods[i4];
                if (f.a(method3.getName(), "getSuppressed")) {
                    method = method3;
                    break;
                }
                i4++;
            }
            f5093c = method;
        }

        private C0082a() {
        }
    }

    public void a(Throwable th, Throwable th2) {
        f.e(th, "cause");
        f.e(th2, "exception");
        Method method = C0082a.f5092b;
        if (method != null) {
            method.invoke(th, th2);
        }
    }

    public c3.c b() {
        return new c3.b();
    }
}
