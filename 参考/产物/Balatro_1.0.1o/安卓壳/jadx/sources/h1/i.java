package h1;

import android.content.Context;
import android.content.ServiceConnection;
import android.os.HandlerThread;
import java.util.concurrent.Executor;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class i {

    /* renamed from: a, reason: collision with root package name */
    private static final Object f3522a = new Object();

    /* renamed from: b, reason: collision with root package name */
    private static int f3523b = 9;

    /* renamed from: c, reason: collision with root package name */
    private static j1 f3524c;

    /* renamed from: d, reason: collision with root package name */
    static HandlerThread f3525d;

    /* renamed from: e, reason: collision with root package name */
    private static Executor f3526e;

    /* renamed from: f, reason: collision with root package name */
    private static boolean f3527f;

    public static i a(Context context) {
        synchronized (f3522a) {
            try {
                if (f3524c == null) {
                    f3524c = new j1(context.getApplicationContext(), f3527f ? b().getLooper() : context.getMainLooper(), f3526e);
                }
            } catch (Throwable th) {
                throw th;
            }
        }
        return f3524c;
    }

    public static HandlerThread b() {
        synchronized (f3522a) {
            try {
                HandlerThread handlerThread = f3525d;
                if (handlerThread != null) {
                    return handlerThread;
                }
                HandlerThread handlerThread2 = new HandlerThread("GoogleApiHandler", f3523b);
                f3525d = handlerThread2;
                handlerThread2.start();
                return f3525d;
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    protected abstract d1.a c(g1 g1Var, ServiceConnection serviceConnection, String str, Executor executor);

    public final void d(String str, String str2, int i4, ServiceConnection serviceConnection, String str3, boolean z3) {
        e(new g1(str, str2, 4225, z3), serviceConnection, str3);
    }

    protected abstract void e(g1 g1Var, ServiceConnection serviceConnection, String str);
}
