package androidx.activity;

import android.window.OnBackInvokedCallback;
import android.window.OnBackInvokedDispatcher;
import androidx.lifecycle.g;
import java.util.ArrayDeque;
import java.util.Iterator;
import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class OnBackPressedDispatcher {

    /* renamed from: a, reason: collision with root package name */
    private final Runnable f52a;

    /* renamed from: c, reason: collision with root package name */
    private androidx.core.util.a f54c;

    /* renamed from: d, reason: collision with root package name */
    private OnBackInvokedCallback f55d;

    /* renamed from: e, reason: collision with root package name */
    private OnBackInvokedDispatcher f56e;

    /* renamed from: b, reason: collision with root package name */
    final ArrayDeque f53b = new ArrayDeque();

    /* renamed from: f, reason: collision with root package name */
    private boolean f57f = false;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class LifecycleOnBackPressedCancellable implements androidx.lifecycle.i, androidx.activity.a {

        /* renamed from: a, reason: collision with root package name */
        private final androidx.lifecycle.g f58a;

        /* renamed from: b, reason: collision with root package name */
        private final h f59b;

        /* renamed from: c, reason: collision with root package name */
        private androidx.activity.a f60c;

        LifecycleOnBackPressedCancellable(androidx.lifecycle.g gVar, h hVar) {
            this.f58a = gVar;
            this.f59b = hVar;
            gVar.a(this);
        }

        @Override // androidx.activity.a
        public void cancel() {
            this.f58a.c(this);
            this.f59b.e(this);
            androidx.activity.a aVar = this.f60c;
            if (aVar != null) {
                aVar.cancel();
                this.f60c = null;
            }
        }

        @Override // androidx.lifecycle.i
        public void g(androidx.lifecycle.k kVar, g.b bVar) {
            if (bVar == g.b.ON_START) {
                this.f60c = OnBackPressedDispatcher.this.c(this.f59b);
                return;
            }
            if (bVar != g.b.ON_STOP) {
                if (bVar == g.b.ON_DESTROY) {
                    cancel();
                }
            } else {
                androidx.activity.a aVar = this.f60c;
                if (aVar != null) {
                    aVar.cancel();
                }
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a {
        static OnBackInvokedCallback a(Runnable runnable) {
            Objects.requireNonNull(runnable);
            return new k(runnable);
        }

        static void b(Object obj, int i4, Object obj2) {
            ((OnBackInvokedDispatcher) obj).registerOnBackInvokedCallback(i4, (OnBackInvokedCallback) obj2);
        }

        static void c(Object obj, Object obj2) {
            ((OnBackInvokedDispatcher) obj).unregisterOnBackInvokedCallback((OnBackInvokedCallback) obj2);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private class b implements androidx.activity.a {

        /* renamed from: a, reason: collision with root package name */
        private final h f62a;

        b(h hVar) {
            this.f62a = hVar;
        }

        @Override // androidx.activity.a
        public void cancel() {
            OnBackPressedDispatcher.this.f53b.remove(this.f62a);
            this.f62a.e(this);
            if (androidx.core.os.a.c()) {
                this.f62a.g(null);
                OnBackPressedDispatcher.this.g();
            }
        }
    }

    public OnBackPressedDispatcher(Runnable runnable) {
        this.f52a = runnable;
        if (androidx.core.os.a.c()) {
            this.f54c = new androidx.core.util.a() { // from class: androidx.activity.i
                @Override // androidx.core.util.a
                public final void accept(Object obj) {
                    OnBackPressedDispatcher.a(OnBackPressedDispatcher.this, (Boolean) obj);
                }
            };
            this.f55d = a.a(new Runnable() { // from class: androidx.activity.j
                @Override // java.lang.Runnable
                public final void run() {
                    OnBackPressedDispatcher.this.e();
                }
            });
        }
    }

    public static /* synthetic */ void a(OnBackPressedDispatcher onBackPressedDispatcher, Boolean bool) {
        onBackPressedDispatcher.getClass();
        if (androidx.core.os.a.c()) {
            onBackPressedDispatcher.g();
        }
    }

    public void b(androidx.lifecycle.k kVar, h hVar) {
        androidx.lifecycle.g q3 = kVar.q();
        if (q3.b() == g.c.f1661e) {
            return;
        }
        hVar.a(new LifecycleOnBackPressedCancellable(q3, hVar));
        if (androidx.core.os.a.c()) {
            g();
            hVar.g(this.f54c);
        }
    }

    androidx.activity.a c(h hVar) {
        this.f53b.add(hVar);
        b bVar = new b(hVar);
        hVar.a(bVar);
        if (androidx.core.os.a.c()) {
            g();
            hVar.g(this.f54c);
        }
        return bVar;
    }

    public boolean d() {
        Iterator descendingIterator = this.f53b.descendingIterator();
        while (descendingIterator.hasNext()) {
            if (((h) descendingIterator.next()).c()) {
                return true;
            }
        }
        return false;
    }

    public void e() {
        Iterator descendingIterator = this.f53b.descendingIterator();
        while (descendingIterator.hasNext()) {
            h hVar = (h) descendingIterator.next();
            if (hVar.c()) {
                hVar.b();
                return;
            }
        }
        Runnable runnable = this.f52a;
        if (runnable != null) {
            runnable.run();
        }
    }

    public void f(OnBackInvokedDispatcher onBackInvokedDispatcher) {
        this.f56e = onBackInvokedDispatcher;
        g();
    }

    void g() {
        boolean d4 = d();
        OnBackInvokedDispatcher onBackInvokedDispatcher = this.f56e;
        if (onBackInvokedDispatcher != null) {
            if (d4 && !this.f57f) {
                a.b(onBackInvokedDispatcher, 0, this.f55d);
                this.f57f = true;
            } else {
                if (d4 || !this.f57f) {
                    return;
                }
                a.c(onBackInvokedDispatcher, this.f55d);
                this.f57f = false;
            }
        }
    }
}
