package androidx.lifecycle;

import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import androidx.lifecycle.g;
import androidx.lifecycle.t;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class r implements k {

    /* renamed from: i, reason: collision with root package name */
    private static final r f1681i = new r();

    /* renamed from: e, reason: collision with root package name */
    private Handler f1686e;

    /* renamed from: a, reason: collision with root package name */
    private int f1682a = 0;

    /* renamed from: b, reason: collision with root package name */
    private int f1683b = 0;

    /* renamed from: c, reason: collision with root package name */
    private boolean f1684c = true;

    /* renamed from: d, reason: collision with root package name */
    private boolean f1685d = true;

    /* renamed from: f, reason: collision with root package name */
    private final l f1687f = new l(this);

    /* renamed from: g, reason: collision with root package name */
    private Runnable f1688g = new a();

    /* renamed from: h, reason: collision with root package name */
    t.a f1689h = new b();

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements Runnable {
        a() {
        }

        @Override // java.lang.Runnable
        public void run() {
            r.this.h();
            r.this.i();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b implements t.a {
        b() {
        }

        @Override // androidx.lifecycle.t.a
        public void a() {
        }

        @Override // androidx.lifecycle.t.a
        public void b() {
            r.this.d();
        }

        @Override // androidx.lifecycle.t.a
        public void c() {
            r.this.e();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class c extends androidx.lifecycle.c {

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        class a extends androidx.lifecycle.c {
            a() {
            }

            @Override // android.app.Application.ActivityLifecycleCallbacks
            public void onActivityPostResumed(Activity activity) {
                r.this.d();
            }

            @Override // android.app.Application.ActivityLifecycleCallbacks
            public void onActivityPostStarted(Activity activity) {
                r.this.e();
            }
        }

        c() {
        }

        @Override // androidx.lifecycle.c, android.app.Application.ActivityLifecycleCallbacks
        public void onActivityCreated(Activity activity, Bundle bundle) {
            if (Build.VERSION.SDK_INT < 29) {
                t.f(activity).h(r.this.f1689h);
            }
        }

        @Override // androidx.lifecycle.c, android.app.Application.ActivityLifecycleCallbacks
        public void onActivityPaused(Activity activity) {
            r.this.a();
        }

        @Override // android.app.Application.ActivityLifecycleCallbacks
        public void onActivityPreCreated(Activity activity, Bundle bundle) {
            activity.registerActivityLifecycleCallbacks(new a());
        }

        @Override // androidx.lifecycle.c, android.app.Application.ActivityLifecycleCallbacks
        public void onActivityStopped(Activity activity) {
            r.this.f();
        }
    }

    private r() {
    }

    public static k j() {
        return f1681i;
    }

    static void k(Context context) {
        f1681i.g(context);
    }

    void a() {
        int i4 = this.f1683b - 1;
        this.f1683b = i4;
        if (i4 == 0) {
            this.f1686e.postDelayed(this.f1688g, 700L);
        }
    }

    void d() {
        int i4 = this.f1683b + 1;
        this.f1683b = i4;
        if (i4 == 1) {
            if (!this.f1684c) {
                this.f1686e.removeCallbacks(this.f1688g);
            } else {
                this.f1687f.h(g.b.ON_RESUME);
                this.f1684c = false;
            }
        }
    }

    void e() {
        int i4 = this.f1682a + 1;
        this.f1682a = i4;
        if (i4 == 1 && this.f1685d) {
            this.f1687f.h(g.b.ON_START);
            this.f1685d = false;
        }
    }

    void f() {
        this.f1682a--;
        i();
    }

    void g(Context context) {
        this.f1686e = new Handler();
        this.f1687f.h(g.b.ON_CREATE);
        ((Application) context.getApplicationContext()).registerActivityLifecycleCallbacks(new c());
    }

    void h() {
        if (this.f1683b == 0) {
            this.f1684c = true;
            this.f1687f.h(g.b.ON_PAUSE);
        }
    }

    void i() {
        if (this.f1682a == 0 && this.f1684c) {
            this.f1687f.h(g.b.ON_STOP);
            this.f1685d = true;
        }
    }

    @Override // androidx.lifecycle.k
    public g q() {
        return this.f1687f;
    }
}
