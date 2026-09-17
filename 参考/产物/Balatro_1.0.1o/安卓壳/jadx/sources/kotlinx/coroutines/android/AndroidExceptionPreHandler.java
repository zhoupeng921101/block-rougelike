package kotlinx.coroutines.android;

import android.os.Build;
import i3.d;
import java.lang.Thread;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import v2.a;
import v2.e;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class AndroidExceptionPreHandler extends a implements d {
    private volatile Object _preHandler;

    public AndroidExceptionPreHandler() {
        super(d.f3629b);
        this._preHandler = this;
    }

    private final Method preHandler() {
        Object obj = this._preHandler;
        if (obj != this) {
            return (Method) obj;
        }
        Method method = null;
        try {
            Method declaredMethod = Thread.class.getDeclaredMethod("getUncaughtExceptionPreHandler", null);
            if (Modifier.isPublic(declaredMethod.getModifiers())) {
                if (Modifier.isStatic(declaredMethod.getModifiers())) {
                    method = declaredMethod;
                }
            }
        } catch (Throwable unused) {
        }
        this._preHandler = method;
        return method;
    }

    @Override // i3.d
    public void handleException(e eVar, Throwable th) {
        int i4 = Build.VERSION.SDK_INT;
        if (26 > i4 || i4 >= 28) {
            return;
        }
        Method preHandler = preHandler();
        Object invoke = preHandler == null ? null : preHandler.invoke(null, null);
        Thread.UncaughtExceptionHandler uncaughtExceptionHandler = invoke instanceof Thread.UncaughtExceptionHandler ? (Thread.UncaughtExceptionHandler) invoke : null;
        if (uncaughtExceptionHandler == null) {
            return;
        }
        uncaughtExceptionHandler.uncaughtException(Thread.currentThread(), th);
    }
}
