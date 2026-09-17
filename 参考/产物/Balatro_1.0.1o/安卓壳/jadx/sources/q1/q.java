package q1;

import android.app.Activity;
import android.app.Application;
import android.os.Looper;
import f1.d1;
import java.lang.ref.WeakReference;
import java.util.Collections;
import java.util.Iterator;
import java.util.Set;
import java.util.WeakHashMap;
import java.util.concurrent.atomic.AtomicReference;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class q {

    /* renamed from: g, reason: collision with root package name */
    private static final AtomicReference f4731g = new AtomicReference();

    /* renamed from: h, reason: collision with root package name */
    public static final /* synthetic */ int f4732h = 0;

    /* renamed from: a, reason: collision with root package name */
    private final Application f4733a;

    /* renamed from: e, reason: collision with root package name */
    private WeakReference f4737e;

    /* renamed from: b, reason: collision with root package name */
    private final Application.ActivityLifecycleCallbacks f4734b = new p(this, null);

    /* renamed from: c, reason: collision with root package name */
    private final Object f4735c = new Object();

    /* renamed from: d, reason: collision with root package name */
    private final Set f4736d = Collections.newSetFromMap(new WeakHashMap());

    /* renamed from: f, reason: collision with root package name */
    private boolean f4738f = false;

    public q(Application application) {
        this.f4733a = application;
    }

    public static q a(Application application) {
        h1.q.i(application);
        AtomicReference atomicReference = f4731g;
        q qVar = (q) atomicReference.get();
        if (qVar != null) {
            return qVar;
        }
        d1.a(atomicReference, null, new q(application));
        return (q) atomicReference.get();
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* renamed from: h, reason: merged with bridge method [inline-methods] */
    public final void e(n nVar) {
        Activity d4 = d();
        if (d4 == null) {
            return;
        }
        nVar.a(d4);
    }

    public final void b() {
        synchronized (this.f4735c) {
            try {
                if (!this.f4738f) {
                    this.f4733a.registerActivityLifecycleCallbacks(this.f4734b);
                    this.f4738f = true;
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    public final void c(final n nVar) {
        h1.q.i(nVar);
        synchronized (this.f4735c) {
            this.f4736d.add(nVar);
        }
        if (Looper.myLooper() == Looper.getMainLooper()) {
            e(nVar);
        } else {
            g2.j.f3354a.execute(new Runnable() { // from class: q1.o
                @Override // java.lang.Runnable
                public final /* synthetic */ void run() {
                    q.this.e(nVar);
                }
            });
        }
    }

    public final Activity d() {
        Activity activity;
        synchronized (this.f4735c) {
            WeakReference weakReference = this.f4737e;
            activity = weakReference == null ? null : (Activity) weakReference.get();
        }
        return activity;
    }

    final /* synthetic */ void f(Activity activity) {
        h1.q.i(activity);
        synchronized (this.f4735c) {
            try {
                if (d() == activity) {
                    return;
                }
                this.f4737e = new WeakReference(activity);
                Iterator it = this.f4736d.iterator();
                while (it.hasNext()) {
                    ((n) it.next()).a(activity);
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    final /* synthetic */ void g(Activity activity) {
        synchronized (this.f4735c) {
            try {
                WeakReference weakReference = this.f4737e;
                if (weakReference == null) {
                    return;
                }
                if (weakReference.get() == activity) {
                    this.f4737e = null;
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }
}
