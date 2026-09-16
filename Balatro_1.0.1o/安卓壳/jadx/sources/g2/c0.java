package g2;

import a1.b2.c3;
import android.app.Activity;
import java.util.concurrent.CancellationException;
import java.util.concurrent.Executor;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class c0 extends h {

    /* renamed from: a, reason: collision with root package name */
    private final Object f3347a = new Object();

    /* renamed from: b, reason: collision with root package name */
    private final y f3348b = new y();

    /* renamed from: c, reason: collision with root package name */
    private boolean f3349c;

    /* renamed from: d, reason: collision with root package name */
    private volatile boolean f3350d;

    /* renamed from: e, reason: collision with root package name */
    private Object f3351e;

    /* renamed from: f, reason: collision with root package name */
    private Exception f3352f;

    c0() {
    }

    private final void w() {
        h1.q.l(this.f3349c, "Task is not yet complete");
    }

    private final void x() {
        if (this.f3350d) {
            throw new CancellationException("Task is already canceled.");
        }
    }

    private final void y() {
        if (this.f3349c) {
            throw b.a(this);
        }
    }

    private final void z() {
        synchronized (this.f3347a) {
            try {
                if (this.f3349c) {
                    this.f3348b.b(this);
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    @Override // g2.h
    public final h a(Executor executor, c cVar) {
        this.f3348b.a(new q(executor, cVar));
        z();
        return this;
    }

    @Override // g2.h
    public final h b(Activity activity, d dVar) {
        s sVar = new s(j.f3354a, dVar);
        this.f3348b.a(sVar);
        b0.l(activity).m(sVar);
        z();
        return this;
    }

    @Override // g2.h
    public final h c(d dVar) {
        this.f3348b.a(new s(j.f3354a, dVar));
        z();
        return this;
    }

    @Override // g2.h
    public final h d(Executor executor, d dVar) {
        this.f3348b.a(new s(executor, dVar));
        z();
        return this;
    }

    @Override // g2.h
    public final h e(e eVar) {
        f(j.f3354a, eVar);
        return this;
    }

    @Override // g2.h
    public final h f(Executor executor, e eVar) {
        this.f3348b.a(new u(executor, eVar));
        z();
        return this;
    }

    @Override // g2.h
    public final h g(f fVar) {
        h(j.f3354a, fVar);
        return this;
    }

    @Override // g2.h
    public final h h(Executor executor, f fVar) {
        this.f3348b.a(new w(executor, fVar));
        z();
        return this;
    }

    @Override // g2.h
    public final h i(a aVar) {
        return j(j.f3354a, aVar);
    }

    @Override // g2.h
    public final h j(Executor executor, a aVar) {
        c0 c0Var = new c0();
        this.f3348b.a(new m(executor, aVar, c0Var));
        z();
        return c0Var;
    }

    @Override // g2.h
    public final h k(a aVar) {
        return l(j.f3354a, aVar);
    }

    @Override // g2.h
    public final h l(Executor executor, a aVar) {
        c0 c0Var = new c0();
        this.f3348b.a(new o(executor, aVar, c0Var));
        z();
        return c0Var;
    }

    @Override // g2.h
    public final Exception m() {
        Exception exc;
        synchronized (this.f3347a) {
            exc = this.f3352f;
        }
        return exc;
    }

    @Override // g2.h
    public final Object n() {
        Object obj;
        synchronized (this.f3347a) {
            try {
                w();
                x();
                Exception exc = this.f3352f;
                if (exc != null) {
                    throw new g(exc);
                }
                obj = this.f3351e;
            } catch (Throwable th) {
                throw th;
            }
        }
        return obj;
    }

    @Override // g2.h
    public final boolean o() {
        return this.f3350d;
    }

    @Override // g2.h
    public final boolean p() {
        boolean z3;
        synchronized (this.f3347a) {
            z3 = this.f3349c;
        }
        return z3;
    }

    @Override // g2.h
    public final boolean q() {
        boolean z3;
        synchronized (this.f3347a) {
            try {
                z3 = false;
                if (this.f3349c && !this.f3350d && this.f3352f == null) {
                    z3 = true;
                }
            } finally {
            }
        }
        return z3;
    }

    public final void r(Exception exc) {
        h1.q.j(exc, c3.d4(1174));
        synchronized (this.f3347a) {
            y();
            this.f3349c = true;
            this.f3352f = exc;
        }
        this.f3348b.b(this);
    }

    public final void s(Object obj) {
        synchronized (this.f3347a) {
            y();
            this.f3349c = true;
            this.f3351e = obj;
        }
        this.f3348b.b(this);
    }

    public final boolean t() {
        synchronized (this.f3347a) {
            try {
                if (this.f3349c) {
                    return false;
                }
                this.f3349c = true;
                this.f3350d = true;
                this.f3348b.b(this);
                return true;
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    public final boolean u(Exception exc) {
        h1.q.j(exc, "Exception must not be null");
        synchronized (this.f3347a) {
            try {
                if (this.f3349c) {
                    return false;
                }
                this.f3349c = true;
                this.f3352f = exc;
                this.f3348b.b(this);
                return true;
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    public final boolean v(Object obj) {
        synchronized (this.f3347a) {
            try {
                if (this.f3349c) {
                    return false;
                }
                this.f3349c = true;
                this.f3351e = obj;
                this.f3348b.b(this);
                return true;
            } catch (Throwable th) {
                throw th;
            }
        }
    }
}
