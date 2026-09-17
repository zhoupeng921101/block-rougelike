package f1;

import android.app.Activity;
import android.app.ActivityManager;
import android.app.Application;
import android.content.ComponentCallbacks2;
import android.content.res.Configuration;
import android.os.Bundle;
import java.util.ArrayList;
import java.util.concurrent.atomic.AtomicBoolean;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class c implements Application.ActivityLifecycleCallbacks, ComponentCallbacks2 {

    /* renamed from: e, reason: collision with root package name */
    private static final c f3210e = new c();

    /* renamed from: a, reason: collision with root package name */
    private final AtomicBoolean f3211a = new AtomicBoolean();

    /* renamed from: b, reason: collision with root package name */
    private final AtomicBoolean f3212b = new AtomicBoolean();

    /* renamed from: c, reason: collision with root package name */
    private final ArrayList f3213c = new ArrayList();

    /* renamed from: d, reason: collision with root package name */
    private boolean f3214d = false;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public interface a {
        void a(boolean z3);
    }

    private c() {
    }

    public static c b() {
        return f3210e;
    }

    public static void c(Application application) {
        c cVar = f3210e;
        synchronized (cVar) {
            try {
                if (!cVar.f3214d) {
                    application.registerActivityLifecycleCallbacks(cVar);
                    application.registerComponentCallbacks(cVar);
                    cVar.f3214d = true;
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    private final void f(boolean z3) {
        synchronized (f3210e) {
            try {
                ArrayList arrayList = this.f3213c;
                int size = arrayList.size();
                int i4 = 0;
                while (i4 < size) {
                    Object obj = arrayList.get(i4);
                    i4++;
                    ((a) obj).a(z3);
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    public void a(a aVar) {
        synchronized (f3210e) {
            this.f3213c.add(aVar);
        }
    }

    public boolean d() {
        return this.f3211a.get();
    }

    public boolean e(boolean z3) {
        AtomicBoolean atomicBoolean = this.f3212b;
        if (!atomicBoolean.get()) {
            if (com.google.android.gms.common.util.k.a()) {
                return z3;
            }
            ActivityManager.RunningAppProcessInfo runningAppProcessInfo = new ActivityManager.RunningAppProcessInfo();
            ActivityManager.getMyMemoryState(runningAppProcessInfo);
            if (!atomicBoolean.getAndSet(true) && runningAppProcessInfo.importance > 100) {
                this.f3211a.set(true);
            }
        }
        return d();
    }

    @Override // android.app.Application.ActivityLifecycleCallbacks
    public final void onActivityCreated(Activity activity, Bundle bundle) {
        AtomicBoolean atomicBoolean = this.f3212b;
        boolean compareAndSet = this.f3211a.compareAndSet(true, false);
        atomicBoolean.set(true);
        if (compareAndSet) {
            f(false);
        }
    }

    @Override // android.app.Application.ActivityLifecycleCallbacks
    public final void onActivityDestroyed(Activity activity) {
    }

    @Override // android.app.Application.ActivityLifecycleCallbacks
    public final void onActivityPaused(Activity activity) {
    }

    @Override // android.app.Application.ActivityLifecycleCallbacks
    public final void onActivityResumed(Activity activity) {
        AtomicBoolean atomicBoolean = this.f3212b;
        boolean compareAndSet = this.f3211a.compareAndSet(true, false);
        atomicBoolean.set(true);
        if (compareAndSet) {
            f(false);
        }
    }

    @Override // android.app.Application.ActivityLifecycleCallbacks
    public final void onActivitySaveInstanceState(Activity activity, Bundle bundle) {
    }

    @Override // android.app.Application.ActivityLifecycleCallbacks
    public final void onActivityStarted(Activity activity) {
    }

    @Override // android.app.Application.ActivityLifecycleCallbacks
    public final void onActivityStopped(Activity activity) {
    }

    @Override // android.content.ComponentCallbacks
    public final void onConfigurationChanged(Configuration configuration) {
    }

    @Override // android.content.ComponentCallbacks
    public final void onLowMemory() {
    }

    @Override // android.content.ComponentCallbacks2
    public final void onTrimMemory(int i4) {
        if (i4 == 20 && this.f3211a.compareAndSet(false, true)) {
            this.f3212b.set(true);
            f(true);
        }
    }
}
