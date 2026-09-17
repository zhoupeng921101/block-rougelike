package com.google.android.gms.internal.play_billing;

import java.util.Locale;
import java.util.concurrent.CancellationException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.concurrent.atomic.AtomicReferenceFieldUpdater;
import java.util.concurrent.locks.LockSupport;
import java.util.logging.Level;
import java.util.logging.Logger;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class i8 implements c2 {

    /* renamed from: h, reason: collision with root package name */
    static final boolean f2796h = Boolean.parseBoolean(System.getProperty("guava.concurrent.generate_cancellation_cause", "false"));

    /* renamed from: i, reason: collision with root package name */
    private static final Logger f2797i = Logger.getLogger(i8.class.getName());

    /* renamed from: j, reason: collision with root package name */
    static final z1 f2798j;

    /* renamed from: k, reason: collision with root package name */
    private static final Object f2799k;

    /* renamed from: e, reason: collision with root package name */
    volatile Object f2800e;

    /* renamed from: f, reason: collision with root package name */
    volatile y4 f2801f;

    /* renamed from: g, reason: collision with root package name */
    volatile g8 f2802g;

    static {
        z1 f8Var;
        try {
            f8Var = new j6(AtomicReferenceFieldUpdater.newUpdater(g8.class, Thread.class, "a"), AtomicReferenceFieldUpdater.newUpdater(g8.class, g8.class, "b"), AtomicReferenceFieldUpdater.newUpdater(i8.class, g8.class, "g"), AtomicReferenceFieldUpdater.newUpdater(i8.class, y4.class, "f"), AtomicReferenceFieldUpdater.newUpdater(i8.class, Object.class, "e"));
            th = null;
        } catch (Throwable th) {
            th = th;
            f8Var = new f8();
        }
        Throwable th2 = th;
        f2798j = f8Var;
        if (th2 != null) {
            f2797i.logp(Level.SEVERE, a1.b2.c3.d4(1328), "<clinit>", "SafeAtomicHelper is broken!", th2);
        }
        f2799k = new Object();
    }

    protected i8() {
    }

    static void c(i8 i8Var) {
        g8 g8Var;
        z1 z1Var;
        y4 y4Var;
        y4 y4Var2;
        y4 y4Var3;
        do {
            g8Var = i8Var.f2802g;
            z1Var = f2798j;
        } while (!z1Var.e(i8Var, g8Var, g8.f2772c));
        while (true) {
            y4Var = null;
            if (g8Var == null) {
                break;
            }
            Thread thread = g8Var.f2773a;
            if (thread != null) {
                g8Var.f2773a = null;
                LockSupport.unpark(thread);
            }
            g8Var = g8Var.f2774b;
        }
        do {
            y4Var2 = i8Var.f2801f;
        } while (!z1Var.c(i8Var, y4Var2, y4.f3036d));
        while (true) {
            y4Var3 = y4Var;
            y4Var = y4Var2;
            if (y4Var == null) {
                break;
            }
            y4Var2 = y4Var.f3039c;
            y4Var.f3039c = y4Var3;
        }
        while (y4Var3 != null) {
            Runnable runnable = y4Var3.f3037a;
            y4 y4Var4 = y4Var3.f3039c;
            f(runnable, y4Var3.f3038b);
            y4Var3 = y4Var4;
        }
    }

    private final void e(StringBuilder sb) {
        Object obj;
        String d4 = a1.b2.c3.d4(626);
        boolean z3 = false;
        while (true) {
            try {
                try {
                    obj = get();
                    break;
                } catch (InterruptedException unused) {
                    z3 = true;
                } catch (Throwable th) {
                    if (z3) {
                        Thread.currentThread().interrupt();
                    }
                    throw th;
                }
            } catch (CancellationException unused2) {
                sb.append("CANCELLED");
                return;
            } catch (RuntimeException e4) {
                sb.append("UNKNOWN, cause=[");
                sb.append(e4.getClass());
                sb.append(" thrown from get()]");
                return;
            } catch (ExecutionException e5) {
                sb.append("FAILURE, cause=[");
                sb.append(e5.getCause());
                sb.append(d4);
                return;
            }
        }
        if (z3) {
            Thread.currentThread().interrupt();
        }
        sb.append("SUCCESS, result=[");
        sb.append(obj == this ? "this future" : String.valueOf(obj));
        sb.append(d4);
    }

    private static void f(Runnable runnable, Executor executor) {
        try {
            executor.execute(runnable);
        } catch (RuntimeException e4) {
            f2797i.logp(Level.SEVERE, "com.android.billingclient.util.concurrent.AbstractResolvableFuture", "executeListener", "RuntimeException while executing runnable " + String.valueOf(runnable) + " with executor " + String.valueOf(executor), (Throwable) e4);
        }
    }

    private final void g(g8 g8Var) {
        g8Var.f2773a = null;
        while (true) {
            g8 g8Var2 = this.f2802g;
            if (g8Var2 != g8.f2772c) {
                g8 g8Var3 = null;
                while (g8Var2 != null) {
                    g8 g8Var4 = g8Var2.f2774b;
                    if (g8Var2.f2773a != null) {
                        g8Var3 = g8Var2;
                    } else if (g8Var3 != null) {
                        g8Var3.f2774b = g8Var4;
                        if (g8Var3.f2773a == null) {
                            break;
                        }
                    } else if (!f2798j.e(this, g8Var2, g8Var4)) {
                        break;
                    }
                    g8Var2 = g8Var4;
                }
                return;
            }
            return;
        }
    }

    private static final Object h(Object obj) {
        if (obj instanceof p2) {
            Throwable th = ((p2) obj).f2963a;
            CancellationException cancellationException = new CancellationException("Task was cancelled.");
            cancellationException.initCause(th);
            throw cancellationException;
        }
        if (obj instanceof j4) {
            throw new ExecutionException(((j4) obj).f2811a);
        }
        if (obj == f2799k) {
            return null;
        }
        return obj;
    }

    @Override // com.google.android.gms.internal.play_billing.c2
    public final void a(Runnable runnable, Executor executor) {
        executor.getClass();
        y4 y4Var = this.f2801f;
        y4 y4Var2 = y4.f3036d;
        if (y4Var != y4Var2) {
            y4 y4Var3 = new y4(runnable, executor);
            do {
                y4Var3.f3039c = y4Var;
                if (f2798j.c(this, y4Var, y4Var3)) {
                    return;
                } else {
                    y4Var = this.f2801f;
                }
            } while (y4Var != y4Var2);
        }
        f(runnable, executor);
    }

    /* JADX WARN: Multi-variable type inference failed */
    protected String b() {
        if (!(this instanceof ScheduledFuture)) {
            return null;
        }
        return "remaining delay=[" + ((ScheduledFuture) this).getDelay(TimeUnit.MILLISECONDS) + " ms]";
    }

    @Override // java.util.concurrent.Future
    public final boolean cancel(boolean z3) {
        Object obj = this.f2800e;
        if (obj == null) {
            if (f2798j.d(this, obj, f2796h ? new p2(z3, new CancellationException("Future.cancel() was called.")) : z3 ? p2.f2961b : p2.f2962c)) {
                c(this);
                return true;
            }
        }
        return false;
    }

    protected boolean d(Object obj) {
        if (obj == null) {
            obj = f2799k;
        }
        if (!f2798j.d(this, null, obj)) {
            return false;
        }
        c(this);
        return true;
    }

    @Override // java.util.concurrent.Future
    public final Object get() {
        Object obj;
        if (Thread.interrupted()) {
            throw new InterruptedException();
        }
        Object obj2 = this.f2800e;
        if (obj2 != null) {
            return h(obj2);
        }
        g8 g8Var = this.f2802g;
        g8 g8Var2 = g8.f2772c;
        if (g8Var != g8Var2) {
            g8 g8Var3 = new g8();
            do {
                z1 z1Var = f2798j;
                z1Var.a(g8Var3, g8Var);
                if (z1Var.e(this, g8Var, g8Var3)) {
                    do {
                        LockSupport.park(this);
                        if (Thread.interrupted()) {
                            g(g8Var3);
                            throw new InterruptedException();
                        }
                        obj = this.f2800e;
                    } while (!(obj != null));
                    return h(obj);
                }
                g8Var = this.f2802g;
            } while (g8Var != g8Var2);
        }
        return h(this.f2800e);
    }

    @Override // java.util.concurrent.Future
    public final Object get(long j4, TimeUnit timeUnit) {
        long nanos = timeUnit.toNanos(j4);
        if (Thread.interrupted()) {
            throw new InterruptedException();
        }
        Object obj = this.f2800e;
        if (obj != null) {
            return h(obj);
        }
        long nanoTime = nanos > 0 ? System.nanoTime() + nanos : 0L;
        if (nanos >= 1000) {
            g8 g8Var = this.f2802g;
            g8 g8Var2 = g8.f2772c;
            if (g8Var != g8Var2) {
                g8 g8Var3 = new g8();
                do {
                    z1 z1Var = f2798j;
                    z1Var.a(g8Var3, g8Var);
                    if (z1Var.e(this, g8Var, g8Var3)) {
                        do {
                            LockSupport.parkNanos(this, nanos);
                            if (Thread.interrupted()) {
                                g(g8Var3);
                                throw new InterruptedException();
                            }
                            Object obj2 = this.f2800e;
                            if (obj2 != null) {
                                return h(obj2);
                            }
                            nanos = nanoTime - System.nanoTime();
                        } while (nanos >= 1000);
                        g(g8Var3);
                    } else {
                        g8Var = this.f2802g;
                    }
                } while (g8Var != g8Var2);
            }
            return h(this.f2800e);
        }
        while (nanos > 0) {
            Object obj3 = this.f2800e;
            if (obj3 != null) {
                return h(obj3);
            }
            if (Thread.interrupted()) {
                throw new InterruptedException();
            }
            nanos = nanoTime - System.nanoTime();
        }
        String i8Var = toString();
        String obj4 = timeUnit.toString();
        Locale locale = Locale.ROOT;
        String lowerCase = obj4.toLowerCase(locale);
        String str = "Waited " + j4 + " " + timeUnit.toString().toLowerCase(locale);
        if (nanos + 1000 < 0) {
            String concat = str.concat(" (plus ");
            long j5 = -nanos;
            long convert = timeUnit.convert(j5, TimeUnit.NANOSECONDS);
            long nanos2 = j5 - timeUnit.toNanos(convert);
            boolean z3 = convert == 0 || nanos2 > 1000;
            if (convert > 0) {
                String str2 = concat + convert + " " + lowerCase;
                if (z3) {
                    str2 = str2.concat(a1.b2.c3.d4(1373));
                }
                concat = str2.concat(" ");
            }
            if (z3) {
                concat = concat + nanos2 + " nanoseconds ";
            }
            str = concat.concat("delay)");
        }
        if (isDone()) {
            throw new TimeoutException(str.concat(" but future completed as timeout expired"));
        }
        throw new TimeoutException(str + " for " + i8Var);
    }

    @Override // java.util.concurrent.Future
    public final boolean isCancelled() {
        return this.f2800e instanceof p2;
    }

    @Override // java.util.concurrent.Future
    public final boolean isDone() {
        return this.f2800e != null;
    }

    public final String toString() {
        String concat;
        StringBuilder sb = new StringBuilder();
        sb.append(super.toString());
        sb.append("[status=");
        if (this.f2800e instanceof p2) {
            sb.append("CANCELLED");
        } else if (isDone()) {
            e(sb);
        } else {
            try {
                concat = b();
            } catch (RuntimeException e4) {
                concat = "Exception thrown from implementation: ".concat(String.valueOf(e4.getClass()));
            }
            if (concat != null && !concat.isEmpty()) {
                sb.append("PENDING, info=[");
                sb.append(concat);
                sb.append("]");
            } else if (isDone()) {
                e(sb);
            } else {
                sb.append(a1.b2.c3.d4(333));
            }
        }
        sb.append("]");
        return sb.toString();
    }
}
