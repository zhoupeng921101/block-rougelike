package o2;

import a1.b2.c3;
import android.app.Application;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class f0 implements InvocationHandler {

    /* renamed from: b, reason: collision with root package name */
    private static final g0 f4365b = g0.f(f0.class.getSimpleName());

    /* renamed from: a, reason: collision with root package name */
    private final d0 f4366a;

    f0(d0 d0Var) {
        this.f4366a = d0Var;
        d0Var.v();
    }

    void a(Application application) {
        Method method;
        try {
            Object newProxyInstance = Proxy.newProxyInstance(Application.class.getClassLoader(), new Class[]{Application.ActivityLifecycleCallbacks.class}, this);
            Method[] methods = Application.class.getMethods();
            int length = methods.length;
            int i4 = 0;
            while (true) {
                if (i4 >= length) {
                    method = null;
                    break;
                }
                method = methods[i4];
                if (method.getName().equals("registerActivityLifecycleCallbacks")) {
                    break;
                } else {
                    i4++;
                }
            }
            if (method == null) {
                f4365b.c("ActivityLifecycleCallbacks registration not available, Automatic session management will not work");
            } else {
                method.invoke(application, newProxyInstance);
                f4365b.a("ActivityLifecycleCallbacks registration successful, Automatic session management will work.");
            }
        } catch (Throwable th) {
            f4365b.d(c3.d4(213), th);
        }
    }

    @Override // java.lang.reflect.InvocationHandler
    public Object invoke(Object obj, Method method, Object[] objArr) {
        if ("onActivityResumed".equals(method.getName())) {
            this.f4366a.m(l0.y());
            return null;
        }
        if (!"onActivityPaused".equals(method.getName())) {
            return null;
        }
        this.f4366a.n(l0.y());
        return null;
    }
}
