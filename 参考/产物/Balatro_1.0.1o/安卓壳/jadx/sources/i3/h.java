package i3;

import a1.b2.c3;
import java.util.concurrent.RejectedExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.LockSupport;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class h extends n implements Runnable {
    private static volatile Thread _thread;
    private static volatile int debugStatus;

    /* renamed from: j, reason: collision with root package name */
    public static final h f3632j;

    /* renamed from: k, reason: collision with root package name */
    private static final long f3633k;

    static {
        Long l3;
        h hVar = new h();
        f3632j = hVar;
        m.g(hVar, false, 1, null);
        TimeUnit timeUnit = TimeUnit.MILLISECONDS;
        try {
            l3 = Long.getLong("kotlinx.coroutines.DefaultExecutor.keepAlive", 1000L);
        } catch (SecurityException unused) {
            l3 = 1000L;
        }
        f3633k = timeUnit.toNanos(l3.longValue());
    }

    private h() {
    }

    private final synchronized boolean A() {
        if (z()) {
            return false;
        }
        debugStatus = 1;
        notifyAll();
        return true;
    }

    private final void B() {
        throw new RejectedExecutionException(c3.d4(1042));
    }

    private final synchronized void u() {
        if (z()) {
            debugStatus = 3;
            t();
            notifyAll();
        }
    }

    private final synchronized Thread w() {
        Thread thread;
        thread = _thread;
        if (thread == null) {
            thread = new Thread(this, "kotlinx.coroutines.DefaultExecutor");
            _thread = thread;
            thread.setDaemon(true);
            thread.start();
        }
        return thread;
    }

    private final boolean x() {
        return debugStatus == 4;
    }

    private final boolean z() {
        int i4 = debugStatus;
        return i4 == 2 || i4 == 3;
    }

    @Override // i3.o
    protected Thread j() {
        Thread thread = _thread;
        return thread == null ? w() : thread;
    }

    @Override // i3.n
    public void m(Runnable runnable) {
        if (x()) {
            B();
        }
        super.m(runnable);
    }

    @Override // java.lang.Runnable
    public void run() {
        boolean r3;
        v.f3651a.a(this);
        b.a();
        try {
            if (!A()) {
                if (r3) {
                    return;
                } else {
                    return;
                }
            }
            long j4 = Long.MAX_VALUE;
            while (true) {
                Thread.interrupted();
                long s3 = s();
                if (s3 == Long.MAX_VALUE) {
                    b.a();
                    long nanoTime = System.nanoTime();
                    if (j4 == Long.MAX_VALUE) {
                        j4 = f3633k + nanoTime;
                    }
                    long j5 = j4 - nanoTime;
                    if (j5 <= 0) {
                        _thread = null;
                        u();
                        b.a();
                        if (r()) {
                            return;
                        }
                        j();
                        return;
                    }
                    s3 = e3.d.c(s3, j5);
                } else {
                    j4 = Long.MAX_VALUE;
                }
                if (s3 > 0) {
                    if (z()) {
                        _thread = null;
                        u();
                        b.a();
                        if (r()) {
                            return;
                        }
                        j();
                        return;
                    }
                    b.a();
                    LockSupport.parkNanos(this, s3);
                }
            }
        } finally {
            _thread = null;
            u();
            b.a();
            if (!r()) {
                j();
            }
        }
    }
}
