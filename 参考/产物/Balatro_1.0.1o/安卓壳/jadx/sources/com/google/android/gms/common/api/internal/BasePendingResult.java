package com.google.android.gms.common.api.internal;

import a1.b2.c3;
import a2.h;
import android.os.Looper;
import android.os.Message;
import android.util.Log;
import android.util.Pair;
import com.google.android.gms.common.api.Status;
import e1.f;
import e1.g;
import e1.i;
import e1.k;
import h.d;
import h1.q;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class BasePendingResult<R extends k> extends g {

    /* renamed from: m, reason: collision with root package name */
    static final ThreadLocal f2570m = new b();

    /* renamed from: b, reason: collision with root package name */
    protected final a f2572b;

    /* renamed from: c, reason: collision with root package name */
    protected final WeakReference f2573c;

    /* renamed from: g, reason: collision with root package name */
    private k f2577g;

    /* renamed from: h, reason: collision with root package name */
    private Status f2578h;

    /* renamed from: i, reason: collision with root package name */
    private volatile boolean f2579i;

    /* renamed from: j, reason: collision with root package name */
    private boolean f2580j;

    /* renamed from: k, reason: collision with root package name */
    private boolean f2581k;
    private c resultGuardian;

    /* renamed from: a, reason: collision with root package name */
    private final Object f2571a = new Object();

    /* renamed from: d, reason: collision with root package name */
    private final CountDownLatch f2574d = new CountDownLatch(1);

    /* renamed from: e, reason: collision with root package name */
    private final ArrayList f2575e = new ArrayList();

    /* renamed from: f, reason: collision with root package name */
    private final AtomicReference f2576f = new AtomicReference();

    /* renamed from: l, reason: collision with root package name */
    private boolean f2582l = false;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class a extends h {
        public a(Looper looper) {
            super(looper);
        }

        @Override // android.os.Handler
        public final void handleMessage(Message message) {
            int i4 = message.what;
            if (i4 == 1) {
                Pair pair = (Pair) message.obj;
                d.a(pair.first);
                k kVar = (k) pair.second;
                try {
                    throw null;
                } catch (RuntimeException e4) {
                    BasePendingResult.m(kVar);
                    throw e4;
                }
            }
            if (i4 == 2) {
                ((BasePendingResult) message.obj).f(Status.f2562m);
                return;
            }
            Log.wtf("BasePendingResult", "Don't know how to handle message: " + i4, new Exception());
        }
    }

    protected BasePendingResult(f fVar) {
        this.f2572b = new a(fVar != null ? fVar.c() : Looper.getMainLooper());
        this.f2573c = new WeakReference(fVar);
    }

    private final k i() {
        k kVar;
        synchronized (this.f2571a) {
            q.l(!this.f2579i, "Result has already been consumed.");
            q.l(g(), "Result is not ready.");
            kVar = this.f2577g;
            this.f2577g = null;
            this.f2579i = true;
        }
        d.a(this.f2576f.getAndSet(null));
        return (k) q.i(kVar);
    }

    private final void j(k kVar) {
        this.f2577g = kVar;
        this.f2578h = kVar.H();
        this.f2574d.countDown();
        if (!this.f2580j && (this.f2577g instanceof i)) {
            this.resultGuardian = new c(this, null);
        }
        ArrayList arrayList = this.f2575e;
        int size = arrayList.size();
        for (int i4 = 0; i4 < size; i4++) {
            ((g.a) arrayList.get(i4)).a(this.f2578h);
        }
        this.f2575e.clear();
    }

    public static void m(k kVar) {
        if (kVar instanceof i) {
            try {
                ((i) kVar).a();
            } catch (RuntimeException e4) {
                Log.w(c3.d4(1277), "Unable to release ".concat(String.valueOf(kVar)), e4);
            }
        }
    }

    @Override // e1.g
    public final void c(g.a aVar) {
        q.b(aVar != null, "Callback cannot be null.");
        synchronized (this.f2571a) {
            try {
                if (g()) {
                    aVar.a(this.f2578h);
                } else {
                    this.f2575e.add(aVar);
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    @Override // e1.g
    public final k d(long j4, TimeUnit timeUnit) {
        if (j4 > 0) {
            q.h("await must not be called on the UI thread when time is greater than zero.");
        }
        q.l(!this.f2579i, "Result has already been consumed.");
        q.l(true, "Cannot await if then() has been called.");
        try {
            if (!this.f2574d.await(j4, timeUnit)) {
                f(Status.f2562m);
            }
        } catch (InterruptedException unused) {
            f(Status.f2560k);
        }
        q.l(g(), "Result is not ready.");
        return i();
    }

    protected abstract k e(Status status);

    public final void f(Status status) {
        synchronized (this.f2571a) {
            try {
                if (!g()) {
                    h(e(status));
                    this.f2581k = true;
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    public final boolean g() {
        return this.f2574d.getCount() == 0;
    }

    public final void h(k kVar) {
        synchronized (this.f2571a) {
            try {
                if (this.f2581k || this.f2580j) {
                    m(kVar);
                    return;
                }
                g();
                q.l(!g(), "Results have already been set");
                q.l(!this.f2579i, "Result has already been consumed");
                j(kVar);
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    public final void l() {
        boolean z3 = true;
        if (!this.f2582l && !((Boolean) f2570m.get()).booleanValue()) {
            z3 = false;
        }
        this.f2582l = z3;
    }
}
