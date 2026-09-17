package c2;

import android.app.Activity;
import android.app.Application;
import android.os.Bundle;
import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class i implements Application.ActivityLifecycleCallbacks {

    /* renamed from: a, reason: collision with root package name */
    private final Application f2122a;

    /* renamed from: b, reason: collision with root package name */
    private boolean f2123b;

    /* renamed from: c, reason: collision with root package name */
    private boolean f2124c;

    /* renamed from: d, reason: collision with root package name */
    final /* synthetic */ j f2125d;

    /* synthetic */ i(j jVar, Application application, byte[] bArr) {
        Objects.requireNonNull(jVar);
        this.f2125d = jVar;
        this.f2123b = false;
        this.f2122a = application;
    }

    final /* synthetic */ void a() {
        if (this.f2123b) {
            return;
        }
        this.f2122a.registerActivityLifecycleCallbacks(this);
        this.f2123b = true;
    }

    @Override // android.app.Application.ActivityLifecycleCallbacks
    public final void onActivityCreated(Activity activity, Bundle bundle) {
        String className = activity.getComponentName().getClassName();
        if (this.f2124c) {
            if (!Objects.equals(className, "com.epicgames.unreal.GameActivity")) {
                return;
            }
        } else if (Objects.equals(className, "com.epicgames.unreal.SplashActivity") && k.f2136c.a(activity)) {
            this.f2124c = true;
            return;
        }
        this.f2122a.unregisterActivityLifecycleCallbacks(this);
        if (this.f2123b) {
            this.f2123b = false;
            e1.a("AutomaticGamesAuthenticator", "Automatic connection attempt triggered");
            this.f2125d.c().d();
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
}
