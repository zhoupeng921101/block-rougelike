package j3;

import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.view.Choreographer;
import t2.i;
import t2.j;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class c {

    /* renamed from: a, reason: collision with root package name */
    public static final b f3839a;
    private static volatile Choreographer choreographer;

    static {
        Object a4;
        try {
            i.a aVar = i.f4994e;
            a4 = i.a(new a(a(Looper.getMainLooper(), true), null, 2, null));
        } catch (Throwable th) {
            i.a aVar2 = i.f4994e;
            a4 = i.a(j.a(th));
        }
        f3839a = (b) (i.b(a4) ? null : a4);
    }

    public static final Handler a(Looper looper, boolean z3) {
        if (!z3) {
            return new Handler(looper);
        }
        if (Build.VERSION.SDK_INT < 28) {
            try {
                return (Handler) Handler.class.getDeclaredConstructor(Looper.class, Handler.Callback.class, Boolean.TYPE).newInstance(looper, null, Boolean.TRUE);
            } catch (NoSuchMethodException unused) {
                return new Handler(looper);
            }
        }
        Object invoke = Handler.class.getDeclaredMethod("createAsync", Looper.class).invoke(null, looper);
        if (invoke != null) {
            return (Handler) invoke;
        }
        throw new NullPointerException("null cannot be cast to non-null type android.os.Handler");
    }
}
