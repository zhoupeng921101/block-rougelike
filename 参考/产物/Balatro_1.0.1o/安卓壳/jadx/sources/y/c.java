package y;

import a1.b2.c3;
import android.os.Binder;
import android.os.Handler;
import android.os.Looper;
import android.os.Process;
import android.util.Log;
import java.util.concurrent.Callable;
import java.util.concurrent.CancellationException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.FutureTask;
import java.util.concurrent.atomic.AtomicBoolean;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class c {

    /* renamed from: i, reason: collision with root package name */
    private static Handler f5147i;

    /* renamed from: f, reason: collision with root package name */
    private volatile e f5149f = e.PENDING;

    /* renamed from: g, reason: collision with root package name */
    final AtomicBoolean f5150g = new AtomicBoolean();

    /* renamed from: h, reason: collision with root package name */
    final AtomicBoolean f5151h = new AtomicBoolean();

    /* renamed from: e, reason: collision with root package name */
    private final FutureTask f5148e = new b(new a());

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements Callable {
        a() {
        }

        @Override // java.util.concurrent.Callable
        public Object call() {
            c.this.f5151h.set(true);
            Object obj = null;
            try {
                Process.setThreadPriority(10);
                obj = c.this.b();
                Binder.flushPendingCommands();
                return obj;
            } finally {
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b extends FutureTask {
        b(Callable callable) {
            super(callable);
        }

        @Override // java.util.concurrent.FutureTask
        protected void done() {
            try {
                c.this.j(get());
            } catch (InterruptedException e4) {
                Log.w("AsyncTask", e4);
            } catch (CancellationException unused) {
                c.this.j(null);
            } catch (ExecutionException e5) {
                throw new RuntimeException("An error occurred while executing doInBackground()", e5.getCause());
            } catch (Throwable th) {
                throw new RuntimeException("An error occurred while executing doInBackground()", th);
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: y.c$c, reason: collision with other inner class name */
    class RunnableC0085c implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        final /* synthetic */ Object f5154e;

        RunnableC0085c(Object obj) {
            this.f5154e = obj;
        }

        @Override // java.lang.Runnable
        public void run() {
            c.this.d(this.f5154e);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static /* synthetic */ class d {

        /* renamed from: a, reason: collision with root package name */
        static final /* synthetic */ int[] f5156a;

        static {
            int[] iArr = new int[e.values().length];
            f5156a = iArr;
            try {
                iArr[e.RUNNING.ordinal()] = 1;
            } catch (NoSuchFieldError unused) {
            }
            try {
                f5156a[e.FINISHED.ordinal()] = 2;
            } catch (NoSuchFieldError unused2) {
            }
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public enum e {
        PENDING,
        RUNNING,
        FINISHED
    }

    c() {
    }

    private static Handler e() {
        Handler handler;
        synchronized (c.class) {
            try {
                if (f5147i == null) {
                    f5147i = new Handler(Looper.getMainLooper());
                }
                handler = f5147i;
            } catch (Throwable th) {
                throw th;
            }
        }
        return handler;
    }

    public final boolean a(boolean z3) {
        this.f5150g.set(true);
        return this.f5148e.cancel(z3);
    }

    protected abstract Object b();

    public final void c(Executor executor) {
        if (this.f5149f == e.PENDING) {
            this.f5149f = e.RUNNING;
            executor.execute(this.f5148e);
            return;
        }
        int i4 = d.f5156a[this.f5149f.ordinal()];
        if (i4 == 1) {
            throw new IllegalStateException("Cannot execute task: the task is already running.");
        }
        if (i4 == 2) {
            throw new IllegalStateException("Cannot execute task: the task has already been executed (a task can be executed only once)");
        }
        throw new IllegalStateException(c3.d4(98));
    }

    void d(Object obj) {
        if (f()) {
            g(obj);
        } else {
            h(obj);
        }
        this.f5149f = e.FINISHED;
    }

    public final boolean f() {
        return this.f5150g.get();
    }

    protected abstract void g(Object obj);

    protected abstract void h(Object obj);

    void i(Object obj) {
        e().post(new RunnableC0085c(obj));
    }

    void j(Object obj) {
        if (this.f5151h.get()) {
            return;
        }
        i(obj);
    }
}
