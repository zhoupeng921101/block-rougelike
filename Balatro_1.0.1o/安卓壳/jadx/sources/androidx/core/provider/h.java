package androidx.core.provider;

import android.os.Handler;
import android.os.Process;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class h {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class a implements ThreadFactory {

        /* renamed from: a, reason: collision with root package name */
        private String f988a;

        /* renamed from: b, reason: collision with root package name */
        private int f989b;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        /* renamed from: androidx.core.provider.h$a$a, reason: collision with other inner class name */
        private static class C0011a extends Thread {

            /* renamed from: e, reason: collision with root package name */
            private final int f990e;

            C0011a(Runnable runnable, String str, int i4) {
                super(runnable, str);
                this.f990e = i4;
            }

            @Override // java.lang.Thread, java.lang.Runnable
            public void run() {
                Process.setThreadPriority(this.f990e);
                super.run();
            }
        }

        a(String str, int i4) {
            this.f988a = str;
            this.f989b = i4;
        }

        @Override // java.util.concurrent.ThreadFactory
        public Thread newThread(Runnable runnable) {
            return new C0011a(runnable, this.f988a, this.f989b);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static class b implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        private Callable f991e;

        /* renamed from: f, reason: collision with root package name */
        private androidx.core.util.a f992f;

        /* renamed from: g, reason: collision with root package name */
        private Handler f993g;

        /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
        class a implements Runnable {

            /* renamed from: e, reason: collision with root package name */
            final /* synthetic */ androidx.core.util.a f994e;

            /* renamed from: f, reason: collision with root package name */
            final /* synthetic */ Object f995f;

            a(androidx.core.util.a aVar, Object obj) {
                this.f994e = aVar;
                this.f995f = obj;
            }

            @Override // java.lang.Runnable
            public void run() {
                this.f994e.accept(this.f995f);
            }
        }

        b(Handler handler, Callable callable, androidx.core.util.a aVar) {
            this.f991e = callable;
            this.f992f = aVar;
            this.f993g = handler;
        }

        @Override // java.lang.Runnable
        public void run() {
            Object obj;
            try {
                obj = this.f991e.call();
            } catch (Exception unused) {
                obj = null;
            }
            this.f993g.post(new a(this.f992f, obj));
        }
    }

    static ThreadPoolExecutor a(String str, int i4, int i5) {
        ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(0, 1, i5, TimeUnit.MILLISECONDS, new LinkedBlockingDeque(), new a(str, i4));
        threadPoolExecutor.allowCoreThreadTimeOut(true);
        return threadPoolExecutor;
    }

    static void b(Executor executor, Callable callable, androidx.core.util.a aVar) {
        executor.execute(new b(androidx.core.provider.b.a(), callable, aVar));
    }

    static Object c(ExecutorService executorService, Callable callable, int i4) {
        try {
            return executorService.submit(callable).get(i4, TimeUnit.MILLISECONDS);
        } catch (InterruptedException e4) {
            throw e4;
        } catch (ExecutionException e5) {
            throw new RuntimeException(e5);
        } catch (TimeoutException unused) {
            throw new InterruptedException("timeout");
        }
    }
}
