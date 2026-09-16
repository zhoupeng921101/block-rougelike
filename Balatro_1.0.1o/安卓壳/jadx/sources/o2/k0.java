package o2;

import android.os.Handler;
import android.os.HandlerThread;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class k0 extends HandlerThread {

    /* renamed from: e, reason: collision with root package name */
    private Handler f4417e;

    public k0(String str) {
        super(str);
    }

    private synchronized void a() {
        if (this.f4417e == null) {
            this.f4417e = new Handler(getLooper());
        }
    }

    Handler b() {
        a();
        return this.f4417e;
    }

    public void c(Runnable runnable) {
        b().post(runnable);
    }

    public void d(Runnable runnable) {
        b().postAtFrontOfQueue(runnable);
    }

    public void e(Runnable runnable, int i4) {
        b().postDelayed(runnable, i4);
    }
}
