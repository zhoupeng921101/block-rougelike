package com.google.android.gms.internal.play_billing;

import java.util.Objects;
import java.util.concurrent.CancellationException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class e1 extends k1 {
    protected e1() {
    }

    static Object l(Object obj) {
        if (obj instanceof z0) {
            Throwable th = ((z0) obj).f3043b;
            CancellationException cancellationException = new CancellationException("Task was cancelled.");
            cancellationException.initCause(th);
            throw cancellationException;
        }
        if (obj instanceof b1) {
            throw new ExecutionException(((b1) obj).f2717a);
        }
        if (obj == k1.f2828h) {
            return null;
        }
        return obj;
    }

    static boolean p(Object obj) {
        return !(obj instanceof a1);
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* JADX WARN: Multi-variable type inference failed */
    public static Object s(c2 c2Var) {
        Throwable b4;
        if (c2Var instanceof d1) {
            Object obj = ((e1) c2Var).f2832e;
            if (obj instanceof z0) {
                z0 z0Var = (z0) obj;
                if (z0Var.f3042a) {
                    Throwable th = z0Var.f3043b;
                    obj = th != null ? new z0(false, th) : z0.f3041d;
                }
            }
            Objects.requireNonNull(obj);
            return obj;
        }
        if ((c2Var instanceof i2) && (b4 = ((i2) c2Var).b()) != null) {
            return new b1(b4);
        }
        boolean isCancelled = c2Var.isCancelled();
        if ((!k1.f2830j) && isCancelled) {
            z0 z0Var2 = z0.f3041d;
            Objects.requireNonNull(z0Var2);
            return z0Var2;
        }
        try {
            Object t3 = t(c2Var);
            if (!isCancelled) {
                return t3 == null ? k1.f2828h : t3;
            }
            return new z0(false, new IllegalArgumentException("get() did not throw CancellationException, despite reporting isCancelled() == true: " + String.valueOf(c2Var)));
        } catch (Error | Exception e4) {
            return new b1(e4);
        } catch (CancellationException e5) {
            return !isCancelled ? new b1(new IllegalArgumentException("get() threw CancellationException, despite reporting isCancelled() == false: ".concat(String.valueOf(c2Var)), e5)) : new z0(false, e5);
        } catch (ExecutionException e6) {
            return isCancelled ? new z0(false, new IllegalArgumentException("get() did not throw CancellationException, despite reporting isCancelled() == true: ".concat(String.valueOf(c2Var)), e6)) : new b1(e6.getCause());
        }
    }

    private static Object t(Future future) {
        Object obj;
        boolean z3 = false;
        while (true) {
            try {
                obj = future.get();
                break;
            } catch (InterruptedException unused) {
                z3 = true;
            } catch (Throwable th) {
                if (z3) {
                    Thread.currentThread().interrupt();
                }
                throw th;
            }
        }
        if (z3) {
            Thread.currentThread().interrupt();
        }
        return obj;
    }

    private final void u(StringBuilder sb) {
        try {
            Object t3 = t(this);
            sb.append("SUCCESS, result=[");
            if (t3 == null) {
                sb.append("null");
            } else if (t3 == this) {
                sb.append("this future");
            } else {
                sb.append(t3.getClass().getName());
                sb.append("@");
                sb.append(Integer.toHexString(System.identityHashCode(t3)));
            }
            sb.append("]");
        } catch (CancellationException unused) {
            sb.append("CANCELLED");
        } catch (ExecutionException e4) {
            sb.append("FAILURE, cause=[");
            sb.append(e4.getCause());
            sb.append("]");
        } catch (Exception e5) {
            sb.append("UNKNOWN, cause=[");
            sb.append(e5.getClass());
            sb.append(" thrown from get()]");
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    public static void v(e1 e1Var, boolean z3) {
        c1 c1Var;
        c1 c1Var2 = null;
        while (true) {
            e1Var.h();
            e1Var.o();
            c1 c1Var3 = c1Var2;
            c1 d4 = e1Var.d(c1.f2726d);
            c1 c1Var4 = c1Var3;
            while (d4 != null) {
                c1 c1Var5 = d4.f2729c;
                d4.f2729c = c1Var4;
                c1Var4 = d4;
                d4 = c1Var5;
            }
            while (c1Var4 != null) {
                Runnable runnable = c1Var4.f2727a;
                c1Var = c1Var4.f2729c;
                Objects.requireNonNull(runnable);
                Runnable runnable2 = runnable;
                if (runnable2 instanceof a1) {
                    a1 a1Var = (a1) runnable2;
                    e1Var = a1Var.f2709e;
                    if (e1Var.f2832e == a1Var && k1.j(e1Var, a1Var, s(a1Var.f2710f))) {
                        break;
                    }
                } else {
                    Executor executor = c1Var4.f2728b;
                    Objects.requireNonNull(executor);
                    w(runnable2, executor);
                }
                c1Var4 = c1Var;
            }
            return;
            c1Var2 = c1Var;
        }
    }

    private static void w(Runnable runnable, Executor executor) {
        try {
            executor.execute(runnable);
        } catch (Exception e4) {
            k1.f2829i.a().logp(Level.SEVERE, "com.google.common.util.concurrent.AbstractFuture", a1.b2.c3.d4(68), "RuntimeException while executing runnable " + String.valueOf(runnable) + a1.b2.c3.d4(1453) + String.valueOf(executor), (Throwable) e4);
        }
    }

    @Override // com.google.android.gms.internal.play_billing.c2
    public final void a(Runnable runnable, Executor executor) {
        c1 c1Var;
        v.c(executor, "Executor was null.");
        if (!isDone() && (c1Var = this.f2833f) != c1.f2726d) {
            c1 c1Var2 = new c1(runnable, executor);
            do {
                c1Var2.f2729c = c1Var;
                if (i(c1Var, c1Var2)) {
                    return;
                } else {
                    c1Var = this.f2833f;
                }
            } while (c1Var != c1.f2726d);
        }
        w(runnable, executor);
    }

    @Override // com.google.android.gms.internal.play_billing.i2
    protected final Throwable b() {
        if (!(this instanceof d1)) {
            return null;
        }
        Object obj = this.f2832e;
        if (obj instanceof b1) {
            return ((b1) obj).f2717a;
        }
        return null;
    }

    @Override // java.util.concurrent.Future
    public final boolean cancel(boolean z3) {
        z0 z0Var;
        Object obj = this.f2832e;
        if (!(obj instanceof a1) && !(obj == null)) {
            return false;
        }
        if (k1.f2830j) {
            z0Var = new z0(z3, new CancellationException("Future.cancel() was called."));
        } else {
            z0Var = z3 ? z0.f3040c : z0.f3041d;
            Objects.requireNonNull(z0Var);
        }
        e1 e1Var = this;
        boolean z4 = false;
        while (true) {
            if (k1.j(e1Var, obj, z0Var)) {
                v(e1Var, z3);
                if (!(obj instanceof a1)) {
                    break;
                }
                c2 c2Var = ((a1) obj).f2710f;
                if (!(c2Var instanceof d1)) {
                    c2Var.cancel(z3);
                    break;
                }
                e1Var = (e1) c2Var;
                obj = e1Var.f2832e;
                if (!(obj == null) && !(obj instanceof a1)) {
                    return true;
                }
                z4 = true;
            } else {
                obj = e1Var.f2832e;
                if (p(obj)) {
                    return z4;
                }
            }
        }
        return true;
    }

    @Override // java.util.concurrent.Future
    public final Object get() {
        return e();
    }

    @Override // java.util.concurrent.Future
    public final Object get(long j4, TimeUnit timeUnit) {
        return f(j4, timeUnit);
    }

    @Override // java.util.concurrent.Future
    public final boolean isCancelled() {
        return this.f2832e instanceof z0;
    }

    @Override // java.util.concurrent.Future
    public final boolean isDone() {
        Object obj = this.f2832e;
        return (obj != null) & p(obj);
    }

    protected abstract String m();

    protected abstract void o();

    protected final boolean q(Throwable th) {
        if (!k1.j(this, null, new b1(th))) {
            return false;
        }
        v(this, false);
        return true;
    }

    protected final boolean r(c2 c2Var) {
        b1 b1Var;
        Object obj = this.f2832e;
        if (obj == null) {
            if (c2Var.isDone()) {
                if (!k1.j(this, null, s(c2Var))) {
                    return false;
                }
                v(this, false);
                return true;
            }
            a1 a1Var = new a1(this, c2Var);
            if (k1.j(this, null, a1Var)) {
                try {
                    c2Var.a(a1Var, r1.INSTANCE);
                } catch (Throwable th) {
                    try {
                        b1Var = new b1(th);
                    } catch (Error | Exception unused) {
                        b1Var = b1.f2716b;
                    }
                    k1.j(this, a1Var, b1Var);
                }
                return true;
            }
            obj = this.f2832e;
        }
        if (obj instanceof z0) {
            c2Var.cancel(((z0) obj).f3042a);
        }
        return false;
    }

    public final String toString() {
        String concat;
        StringBuilder sb = new StringBuilder();
        if (getClass().getName().startsWith("com.google.common.util.concurrent.")) {
            sb.append(getClass().getSimpleName());
        } else {
            sb.append(getClass().getName());
        }
        sb.append('@');
        sb.append(Integer.toHexString(System.identityHashCode(this)));
        sb.append("[status=");
        boolean z3 = this.f2832e instanceof z0;
        String d4 = a1.b2.c3.d4(1491);
        if (z3) {
            sb.append("CANCELLED");
        } else if (isDone()) {
            u(sb);
        } else {
            int length = sb.length();
            sb.append(a1.b2.c3.d4(1119));
            Object obj = this.f2832e;
            if (obj instanceof a1) {
                sb.append(", setFuture=[");
                c2 c2Var = ((a1) obj).f2710f;
                try {
                    if (c2Var == this) {
                        sb.append("this future");
                    } else {
                        sb.append(c2Var);
                    }
                } catch (Throwable th) {
                    d2.a(th);
                    sb.append("Exception thrown from implementation: ");
                    sb.append(th.getClass());
                }
                sb.append(d4);
            } else {
                try {
                    concat = y.a(m());
                } catch (Throwable th2) {
                    d2.a(th2);
                    concat = "Exception thrown from implementation: ".concat(String.valueOf(th2.getClass()));
                }
                if (concat != null) {
                    sb.append(a1.b2.c3.d4(928));
                    sb.append(concat);
                    sb.append(d4);
                }
            }
            if (isDone()) {
                sb.delete(length, sb.length());
                u(sb);
            }
        }
        sb.append(d4);
        return sb.toString();
    }
}
