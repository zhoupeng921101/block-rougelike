package i;

import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import java.lang.reflect.InvocationTargetException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.atomic.AtomicInteger;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class c extends d {

    /* renamed from: a, reason: collision with root package name */
    private final Object f3603a = new Object();

    /* renamed from: b, reason: collision with root package name */
    private final ExecutorService f3604b = Executors.newFixedThreadPool(4, new a());

    /* renamed from: c, reason: collision with root package name */
    private volatile Handler f3605c;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements ThreadFactory {

        /* renamed from: a, reason: collision with root package name */
        private final AtomicInteger f3606a = new AtomicInteger(0);

        a() {
        }

        @Override // java.util.concurrent.ThreadFactory
        public Thread newThread(Runnable runnable) {
            Thread thread = new Thread(runnable);
            thread.setName(String.format("arch_disk_io_%d", Integer.valueOf(this.f3606a.getAndIncrement())));
            return thread;
        }
    }

    private static Handler d(Looper looper) {
        Handler createAsync;
        if (Build.VERSION.SDK_INT >= 28) {
            createAsync = Handler.createAsync(looper);
            return createAsync;
        }
        try {
            return (Handler) Handler.class.getDeclaredConstructor(Looper.class, Handler.Callback.class, Boolean.TYPE).newInstance(looper, null, Boolean.TRUE);
        } catch (IllegalAccessException | InstantiationException | NoSuchMethodException unused) {
            return new Handler(looper);
        } catch (InvocationTargetException unused2) {
            return new Handler(looper);
        }
    }

    @Override // i.d
    public void a(Runnable runnable) {
        this.f3604b.execute(runnable);
    }

    @Override // i.d
    public boolean b() {
        return Looper.getMainLooper().getThread() == Thread.currentThread();
    }

    @Override // i.d
    public void c(Runnable runnable) {
        if (this.f3605c == null) {
            synchronized (this.f3603a) {
                try {
                    if (this.f3605c == null) {
                        this.f3605c = d(Looper.getMainLooper());
                    }
                } finally {
                }
            }
        }
        this.f3605c.post(runnable);
    }
}
