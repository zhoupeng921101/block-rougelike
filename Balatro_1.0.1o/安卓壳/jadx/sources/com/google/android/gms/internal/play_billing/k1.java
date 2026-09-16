package com.google.android.gms.internal.play_billing;

import java.util.Locale;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.concurrent.locks.LockSupport;
import java.util.logging.Level;
import java.util.logging.Logger;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class k1 extends i2 implements c2 {

    /* renamed from: h, reason: collision with root package name */
    static final Object f2828h = new Object();

    /* renamed from: i, reason: collision with root package name */
    static final b2 f2829i = new b2(e1.class);

    /* renamed from: j, reason: collision with root package name */
    static final boolean f2830j;

    /* renamed from: k, reason: collision with root package name */
    private static final f1 f2831k;

    /* renamed from: e, reason: collision with root package name */
    volatile Object f2832e;

    /* renamed from: f, reason: collision with root package name */
    volatile c1 f2833f;

    /* renamed from: g, reason: collision with root package name */
    volatile j1 f2834g;

    static {
        boolean z3;
        Throwable th;
        Throwable th2;
        f1 h1Var;
        try {
            z3 = Boolean.parseBoolean(System.getProperty("guava.concurrent.generate_cancellation_cause", "false"));
        } catch (SecurityException unused) {
            z3 = false;
        }
        f2830j = z3;
        String property = System.getProperty("java.runtime.name", "");
        q1 q1Var = null;
        if (property == null || property.contains(a1.b2.c3.d4(1033))) {
            try {
                h1Var = new i1(q1Var);
            } catch (Error | Exception e4) {
                try {
                    h1Var = new g1(q1Var);
                    th = null;
                    th2 = e4;
                } catch (Error | Exception e5) {
                    th = e5;
                    th2 = e4;
                    h1Var = new h1(q1Var);
                }
            }
        } else {
            try {
                h1Var = new g1(q1Var);
            } catch (NoClassDefFoundError unused2) {
                h1Var = new h1(q1Var);
            }
        }
        th = null;
        th2 = null;
        f2831k = h1Var;
        if (th != null) {
            b2 b2Var = f2829i;
            Logger a4 = b2Var.a();
            Level level = Level.SEVERE;
            a4.logp(level, "com.google.common.util.concurrent.AbstractFutureState", "<clinit>", "UnsafeAtomicHelper is broken!", th2);
            b2Var.a().logp(level, "com.google.common.util.concurrent.AbstractFutureState", "<clinit>", a1.b2.c3.d4(984), th);
        }
    }

    k1() {
    }

    private final void c(j1 j1Var) {
        j1Var.f2807a = null;
        while (true) {
            j1 j1Var2 = this.f2834g;
            if (j1Var2 != j1.f2806c) {
                j1 j1Var3 = null;
                while (j1Var2 != null) {
                    j1 j1Var4 = j1Var2.f2808b;
                    if (j1Var2.f2807a != null) {
                        j1Var3 = j1Var2;
                    } else if (j1Var3 != null) {
                        j1Var3.f2808b = j1Var4;
                        if (j1Var3.f2807a == null) {
                            break;
                        }
                    } else if (!f2831k.g(this, j1Var2, j1Var4)) {
                        break;
                    }
                    j1Var2 = j1Var4;
                }
                return;
            }
            return;
        }
    }

    static boolean j(k1 k1Var, Object obj, Object obj2) {
        return f2831k.f(k1Var, obj, obj2);
    }

    final c1 d(c1 c1Var) {
        return f2831k.a(this, c1Var);
    }

    final Object e() {
        Object obj;
        if (Thread.interrupted()) {
            throw new InterruptedException();
        }
        Object obj2 = this.f2832e;
        if ((obj2 != null) && e1.p(obj2)) {
            return e1.l(obj2);
        }
        j1 j1Var = this.f2834g;
        if (j1Var != j1.f2806c) {
            j1 j1Var2 = new j1();
            do {
                f1 f1Var = f2831k;
                f1Var.c(j1Var2, j1Var);
                if (f1Var.g(this, j1Var, j1Var2)) {
                    do {
                        LockSupport.park(this);
                        if (Thread.interrupted()) {
                            c(j1Var2);
                            throw new InterruptedException();
                        }
                        obj = this.f2832e;
                    } while (!((obj != null) & e1.p(obj)));
                    return e1.l(obj);
                }
                j1Var = this.f2834g;
            } while (j1Var != j1.f2806c);
        }
        Object obj3 = this.f2832e;
        Objects.requireNonNull(obj3);
        return e1.l(obj3);
    }

    final Object f(long j4, TimeUnit timeUnit) {
        long nanos = timeUnit.toNanos(j4);
        if (Thread.interrupted()) {
            throw new InterruptedException();
        }
        Object obj = this.f2832e;
        boolean z3 = true;
        if ((obj != null) && e1.p(obj)) {
            return e1.l(obj);
        }
        long nanoTime = nanos > 0 ? System.nanoTime() + nanos : 0L;
        if (nanos >= 1000) {
            j1 j1Var = this.f2834g;
            if (j1Var != j1.f2806c) {
                j1 j1Var2 = new j1();
                do {
                    f1 f1Var = f2831k;
                    f1Var.c(j1Var2, j1Var);
                    if (f1Var.g(this, j1Var, j1Var2)) {
                        do {
                            LockSupport.parkNanos(this, Math.min(nanos, 2147483647999999999L));
                            if (Thread.interrupted()) {
                                c(j1Var2);
                                throw new InterruptedException();
                            }
                            Object obj2 = this.f2832e;
                            if ((obj2 != null) && e1.p(obj2)) {
                                return e1.l(obj2);
                            }
                            nanos = nanoTime - System.nanoTime();
                        } while (nanos >= 1000);
                        c(j1Var2);
                    } else {
                        j1Var = this.f2834g;
                    }
                } while (j1Var != j1.f2806c);
            }
            Object obj3 = this.f2832e;
            Objects.requireNonNull(obj3);
            return e1.l(obj3);
        }
        while (nanos > 0) {
            Object obj4 = this.f2832e;
            if ((obj4 != null) && e1.p(obj4)) {
                return e1.l(obj4);
            }
            if (Thread.interrupted()) {
                throw new InterruptedException();
            }
            nanos = nanoTime - System.nanoTime();
        }
        String obj5 = toString();
        String obj6 = timeUnit.toString();
        Locale locale = Locale.ROOT;
        String lowerCase = obj6.toLowerCase(locale);
        String str = "Waited " + j4 + " " + timeUnit.toString().toLowerCase(locale);
        if (nanos + 1000 < 0) {
            String concat = str.concat(" (plus ");
            long j5 = -nanos;
            long convert = timeUnit.convert(j5, TimeUnit.NANOSECONDS);
            long nanos2 = j5 - timeUnit.toNanos(convert);
            if (convert != 0 && nanos2 <= 1000) {
                z3 = false;
            }
            if (convert > 0) {
                String str2 = concat + convert + " " + lowerCase;
                if (z3) {
                    str2 = str2.concat(a1.b2.c3.d4(289));
                }
                concat = str2.concat(" ");
            }
            if (z3) {
                concat = concat + nanos2 + a1.b2.c3.d4(627);
            }
            str = concat.concat("delay)");
        }
        if (isDone()) {
            throw new TimeoutException(str.concat(" but future completed as timeout expired"));
        }
        throw new TimeoutException(str + a1.b2.c3.d4(1492) + obj5);
    }

    final void h() {
        for (j1 b4 = f2831k.b(this, j1.f2806c); b4 != null; b4 = b4.f2808b) {
            Thread thread = b4.f2807a;
            if (thread != null) {
                b4.f2807a = null;
                LockSupport.unpark(thread);
            }
        }
    }

    final boolean i(c1 c1Var, c1 c1Var2) {
        return f2831k.e(this, c1Var, c1Var2);
    }
}
