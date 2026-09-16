package kotlinx.coroutines.scheduling;

import a1.b2.c3;
import java.io.Closeable;
import java.util.ArrayList;
import java.util.concurrent.Executor;
import java.util.concurrent.RejectedExecutionException;
import java.util.concurrent.atomic.AtomicIntegerFieldUpdater;
import java.util.concurrent.atomic.AtomicLongFieldUpdater;
import java.util.concurrent.locks.LockSupport;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a implements Executor, Closeable {
    private volatile /* synthetic */ int _isTerminated;
    volatile /* synthetic */ long controlState;

    /* renamed from: e, reason: collision with root package name */
    public final int f4012e;

    /* renamed from: f, reason: collision with root package name */
    public final int f4013f;

    /* renamed from: g, reason: collision with root package name */
    public final long f4014g;

    /* renamed from: h, reason: collision with root package name */
    public final String f4015h;

    /* renamed from: i, reason: collision with root package name */
    public final kotlinx.coroutines.scheduling.d f4016i;

    /* renamed from: j, reason: collision with root package name */
    public final kotlinx.coroutines.scheduling.d f4017j;

    /* renamed from: k, reason: collision with root package name */
    public final k3.i f4018k;
    private volatile /* synthetic */ long parkedWorkersStack;

    /* renamed from: l, reason: collision with root package name */
    public static final C0057a f4007l = new C0057a(null);

    /* renamed from: p, reason: collision with root package name */
    public static final k3.j f4011p = new k3.j(c3.d4(79));

    /* renamed from: m, reason: collision with root package name */
    private static final /* synthetic */ AtomicLongFieldUpdater f4008m = AtomicLongFieldUpdater.newUpdater(a.class, "parkedWorkersStack");

    /* renamed from: n, reason: collision with root package name */
    static final /* synthetic */ AtomicLongFieldUpdater f4009n = AtomicLongFieldUpdater.newUpdater(a.class, c3.d4(295));

    /* renamed from: o, reason: collision with root package name */
    private static final /* synthetic */ AtomicIntegerFieldUpdater f4010o = AtomicIntegerFieldUpdater.newUpdater(a.class, "_isTerminated");

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: kotlinx.coroutines.scheduling.a$a, reason: collision with other inner class name */
    public static final class C0057a {
        private C0057a() {
        }

        public /* synthetic */ C0057a(b3.d dVar) {
            this();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public /* synthetic */ class b {

        /* renamed from: a, reason: collision with root package name */
        public static final /* synthetic */ int[] f4019a;

        static {
            int[] iArr = new int[d.values().length];
            iArr[d.PARKING.ordinal()] = 1;
            iArr[d.f4029f.ordinal()] = 2;
            iArr[d.f4028e.ordinal()] = 3;
            iArr[d.DORMANT.ordinal()] = 4;
            iArr[d.TERMINATED.ordinal()] = 5;
            f4019a = iArr;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public final class c extends Thread {

        /* renamed from: l, reason: collision with root package name */
        static final /* synthetic */ AtomicIntegerFieldUpdater f4020l = AtomicIntegerFieldUpdater.newUpdater(c.class, "workerCtl");

        /* renamed from: e, reason: collision with root package name */
        public final o f4021e;

        /* renamed from: f, reason: collision with root package name */
        public d f4022f;

        /* renamed from: g, reason: collision with root package name */
        private long f4023g;

        /* renamed from: h, reason: collision with root package name */
        private long f4024h;

        /* renamed from: i, reason: collision with root package name */
        private int f4025i;
        private volatile int indexInArray;

        /* renamed from: j, reason: collision with root package name */
        public boolean f4026j;
        private volatile Object nextParkedWorker;
        volatile /* synthetic */ int workerCtl;

        private c() {
            setDaemon(true);
            this.f4021e = new o();
            this.f4022f = d.DORMANT;
            this.workerCtl = 0;
            this.nextParkedWorker = a.f4011p;
            this.f4025i = c3.c.f2210e.b();
        }

        public c(int i4) {
            this();
            o(i4);
        }

        private final void b(int i4) {
            if (i4 == 0) {
                return;
            }
            a.f4009n.addAndGet(a.this, -2097152L);
            if (this.f4022f != d.TERMINATED) {
                this.f4022f = d.DORMANT;
            }
        }

        private final void c(int i4) {
            if (i4 != 0 && s(d.f4029f)) {
                a.this.n();
            }
        }

        private final void d(h hVar) {
            int b4 = hVar.f4044f.b();
            i(b4);
            c(b4);
            a.this.k(hVar);
            b(b4);
        }

        private final h e(boolean z3) {
            h m3;
            h m4;
            if (z3) {
                boolean z4 = k(a.this.f4012e * 2) == 0;
                if (z4 && (m4 = m()) != null) {
                    return m4;
                }
                h h4 = this.f4021e.h();
                if (h4 != null) {
                    return h4;
                }
                if (!z4 && (m3 = m()) != null) {
                    return m3;
                }
            } else {
                h m5 = m();
                if (m5 != null) {
                    return m5;
                }
            }
            return t(false);
        }

        private final void i(int i4) {
            this.f4023g = 0L;
            if (this.f4022f == d.PARKING) {
                this.f4022f = d.f4029f;
            }
        }

        private final boolean j() {
            return this.nextParkedWorker != a.f4011p;
        }

        private final void l() {
            if (this.f4023g == 0) {
                this.f4023g = System.nanoTime() + a.this.f4014g;
            }
            LockSupport.parkNanos(a.this.f4014g);
            if (System.nanoTime() - this.f4023g >= 0) {
                this.f4023g = 0L;
                u();
            }
        }

        private final h m() {
            if (k(2) == 0) {
                h hVar = (h) a.this.f4016i.d();
                return hVar == null ? (h) a.this.f4017j.d() : hVar;
            }
            h hVar2 = (h) a.this.f4017j.d();
            return hVar2 == null ? (h) a.this.f4016i.d() : hVar2;
        }

        private final void n() {
            loop0: while (true) {
                boolean z3 = false;
                while (!a.this.isTerminated() && this.f4022f != d.TERMINATED) {
                    h f4 = f(this.f4026j);
                    if (f4 != null) {
                        this.f4024h = 0L;
                        d(f4);
                    } else {
                        this.f4026j = false;
                        if (this.f4024h == 0) {
                            r();
                        } else if (z3) {
                            s(d.PARKING);
                            Thread.interrupted();
                            LockSupport.parkNanos(this.f4024h);
                            this.f4024h = 0L;
                        } else {
                            z3 = true;
                        }
                    }
                }
            }
            s(d.TERMINATED);
        }

        private final boolean q() {
            long j4;
            if (this.f4022f == d.f4028e) {
                return true;
            }
            a aVar = a.this;
            do {
                j4 = aVar.controlState;
                if (((int) ((9223367638808264704L & j4) >> 42)) == 0) {
                    return false;
                }
            } while (!a.f4009n.compareAndSet(aVar, j4, j4 - 4398046511104L));
            this.f4022f = d.f4028e;
            return true;
        }

        private final void r() {
            if (!j()) {
                a.this.i(this);
                return;
            }
            this.workerCtl = -1;
            while (j() && this.workerCtl == -1 && !a.this.isTerminated() && this.f4022f != d.TERMINATED) {
                s(d.PARKING);
                Thread.interrupted();
                l();
            }
        }

        private final h t(boolean z3) {
            int i4 = (int) (a.this.controlState & 2097151);
            if (i4 < 2) {
                return null;
            }
            int k4 = k(i4);
            a aVar = a.this;
            int i5 = 0;
            long j4 = Long.MAX_VALUE;
            while (i5 < i4) {
                i5++;
                k4++;
                if (k4 > i4) {
                    k4 = 1;
                }
                c cVar = (c) aVar.f4018k.b(k4);
                if (cVar != null && cVar != this) {
                    long k5 = z3 ? this.f4021e.k(cVar.f4021e) : this.f4021e.l(cVar.f4021e);
                    if (k5 == -1) {
                        return this.f4021e.h();
                    }
                    if (k5 > 0) {
                        j4 = Math.min(j4, k5);
                    }
                }
            }
            if (j4 == Long.MAX_VALUE) {
                j4 = 0;
            }
            this.f4024h = j4;
            return null;
        }

        private final void u() {
            a aVar = a.this;
            synchronized (aVar.f4018k) {
                try {
                    if (aVar.isTerminated()) {
                        return;
                    }
                    if (((int) (aVar.controlState & 2097151)) <= aVar.f4012e) {
                        return;
                    }
                    if (f4020l.compareAndSet(this, -1, 1)) {
                        int g4 = g();
                        o(0);
                        aVar.j(this, g4, 0);
                        int andDecrement = (int) (a.f4009n.getAndDecrement(aVar) & 2097151);
                        if (andDecrement != g4) {
                            Object b4 = aVar.f4018k.b(andDecrement);
                            b3.f.b(b4);
                            c cVar = (c) b4;
                            aVar.f4018k.c(g4, cVar);
                            cVar.o(g4);
                            aVar.j(cVar, andDecrement, g4);
                        }
                        aVar.f4018k.c(andDecrement, null);
                        t2.n nVar = t2.n.f5000a;
                        this.f4022f = d.TERMINATED;
                    }
                } catch (Throwable th) {
                    throw th;
                }
            }
        }

        public final h f(boolean z3) {
            h hVar;
            if (q()) {
                return e(z3);
            }
            if (z3) {
                hVar = this.f4021e.h();
                if (hVar == null) {
                    hVar = (h) a.this.f4017j.d();
                }
            } else {
                hVar = (h) a.this.f4017j.d();
            }
            return hVar == null ? t(true) : hVar;
        }

        public final int g() {
            return this.indexInArray;
        }

        public final Object h() {
            return this.nextParkedWorker;
        }

        public final int k(int i4) {
            int i5 = this.f4025i;
            int i6 = i5 ^ (i5 << 13);
            int i7 = i6 ^ (i6 >> 17);
            int i8 = i7 ^ (i7 << 5);
            this.f4025i = i8;
            int i9 = i4 - 1;
            return (i9 & i4) == 0 ? i8 & i9 : (i8 & Integer.MAX_VALUE) % i4;
        }

        public final void o(int i4) {
            StringBuilder sb = new StringBuilder();
            sb.append(a.this.f4015h);
            sb.append("-worker-");
            sb.append(i4 == 0 ? "TERMINATED" : String.valueOf(i4));
            setName(sb.toString());
            this.indexInArray = i4;
        }

        public final void p(Object obj) {
            this.nextParkedWorker = obj;
        }

        @Override // java.lang.Thread, java.lang.Runnable
        public void run() {
            n();
        }

        public final boolean s(d dVar) {
            d dVar2 = this.f4022f;
            boolean z3 = dVar2 == d.f4028e;
            if (z3) {
                a.f4009n.addAndGet(a.this, 4398046511104L);
            }
            if (dVar2 != dVar) {
                this.f4022f = dVar;
            }
            return z3;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public enum d {
        f4028e,
        f4029f,
        PARKING,
        DORMANT,
        TERMINATED
    }

    public a(int i4, int i5, long j4, String str) {
        this.f4012e = i4;
        this.f4013f = i5;
        this.f4014g = j4;
        this.f4015h = str;
        if (i4 < 1) {
            throw new IllegalArgumentException(("Core pool size " + i4 + " should be at least 1").toString());
        }
        String d4 = c3.d4(444);
        if (i5 < i4) {
            throw new IllegalArgumentException((d4 + i5 + c3.d4(1335) + i4).toString());
        }
        if (i5 > 2097150) {
            throw new IllegalArgumentException((d4 + i5 + " should not exceed maximal supported number of threads 2097150").toString());
        }
        if (j4 <= 0) {
            throw new IllegalArgumentException(("Idle worker keep alive time " + j4 + " must be positive").toString());
        }
        this.f4016i = new kotlinx.coroutines.scheduling.d();
        this.f4017j = new kotlinx.coroutines.scheduling.d();
        this.parkedWorkersStack = 0L;
        this.f4018k = new k3.i(i4 + 1);
        this.controlState = i4 << 42;
        this._isTerminated = 0;
    }

    private final boolean a(h hVar) {
        return hVar.f4044f.b() == 1 ? this.f4017j.a(hVar) : this.f4016i.a(hVar);
    }

    private final int b() {
        synchronized (this.f4018k) {
            if (isTerminated()) {
                return -1;
            }
            long j4 = this.controlState;
            int i4 = (int) (j4 & 2097151);
            int a4 = e3.d.a(i4 - ((int) ((j4 & 4398044413952L) >> 21)), 0);
            if (a4 >= this.f4012e) {
                return 0;
            }
            if (i4 >= this.f4013f) {
                return 0;
            }
            int i5 = ((int) (this.controlState & 2097151)) + 1;
            if (i5 <= 0 || this.f4018k.b(i5) != null) {
                throw new IllegalArgumentException("Failed requirement.");
            }
            c cVar = new c(i5);
            this.f4018k.c(i5, cVar);
            if (i5 != ((int) (2097151 & f4009n.incrementAndGet(this)))) {
                throw new IllegalArgumentException("Failed requirement.");
            }
            cVar.start();
            return a4 + 1;
        }
    }

    private final c d() {
        Thread currentThread = Thread.currentThread();
        c cVar = currentThread instanceof c ? (c) currentThread : null;
        if (cVar != null && b3.f.a(a.this, this)) {
            return cVar;
        }
        return null;
    }

    public static /* synthetic */ void f(a aVar, Runnable runnable, i iVar, boolean z3, int i4, Object obj) {
        if ((i4 & 2) != 0) {
            iVar = l.f4052f;
        }
        if ((i4 & 4) != 0) {
            z3 = false;
        }
        aVar.e(runnable, iVar, z3);
    }

    private final int g(c cVar) {
        Object h4 = cVar.h();
        while (h4 != f4011p) {
            if (h4 == null) {
                return 0;
            }
            c cVar2 = (c) h4;
            int g4 = cVar2.g();
            if (g4 != 0) {
                return g4;
            }
            h4 = cVar2.h();
        }
        return -1;
    }

    private final c h() {
        while (true) {
            long j4 = this.parkedWorkersStack;
            c cVar = (c) this.f4018k.b((int) (2097151 & j4));
            if (cVar == null) {
                return null;
            }
            long j5 = (2097152 + j4) & (-2097152);
            int g4 = g(cVar);
            if (g4 >= 0 && f4008m.compareAndSet(this, j4, g4 | j5)) {
                cVar.p(f4011p);
                return cVar;
            }
        }
    }

    private final void m(boolean z3) {
        long addAndGet = f4009n.addAndGet(this, 2097152L);
        if (z3 || t() || r(addAndGet)) {
            return;
        }
        t();
    }

    private final h p(c cVar, h hVar, boolean z3) {
        if (cVar == null || cVar.f4022f == d.TERMINATED) {
            return hVar;
        }
        if (hVar.f4044f.b() == 0 && cVar.f4022f == d.f4029f) {
            return hVar;
        }
        cVar.f4026j = true;
        return cVar.f4021e.a(hVar, z3);
    }

    private final boolean r(long j4) {
        if (e3.d.a(((int) (2097151 & j4)) - ((int) ((j4 & 4398044413952L) >> 21)), 0) < this.f4012e) {
            int b4 = b();
            if (b4 == 1 && this.f4012e > 1) {
                b();
            }
            if (b4 > 0) {
                return true;
            }
        }
        return false;
    }

    static /* synthetic */ boolean s(a aVar, long j4, int i4, Object obj) {
        if ((i4 & 1) != 0) {
            j4 = aVar.controlState;
        }
        return aVar.r(j4);
    }

    private final boolean t() {
        c h4;
        do {
            h4 = h();
            if (h4 == null) {
                return false;
            }
        } while (!c.f4020l.compareAndSet(h4, -1, 0));
        LockSupport.unpark(h4);
        return true;
    }

    public final h c(Runnable runnable, i iVar) {
        long a4 = l.f4051e.a();
        if (!(runnable instanceof h)) {
            return new k(runnable, a4, iVar);
        }
        h hVar = (h) runnable;
        hVar.f4043e = a4;
        hVar.f4044f = iVar;
        return hVar;
    }

    @Override // java.io.Closeable, java.lang.AutoCloseable
    public void close() {
        l(10000L);
    }

    public final void e(Runnable runnable, i iVar, boolean z3) {
        i3.b.a();
        h c4 = c(runnable, iVar);
        c d4 = d();
        h p3 = p(d4, c4, z3);
        if (p3 != null && !a(p3)) {
            throw new RejectedExecutionException(b3.f.j(this.f4015h, " was terminated"));
        }
        boolean z4 = z3 && d4 != null;
        if (c4.f4044f.b() != 0) {
            m(z4);
        } else {
            if (z4) {
                return;
            }
            n();
        }
    }

    @Override // java.util.concurrent.Executor
    public void execute(Runnable runnable) {
        f(this, runnable, null, false, 6, null);
    }

    public final boolean i(c cVar) {
        long j4;
        int g4;
        if (cVar.h() != f4011p) {
            return false;
        }
        do {
            j4 = this.parkedWorkersStack;
            g4 = cVar.g();
            cVar.p(this.f4018k.b((int) (2097151 & j4)));
        } while (!f4008m.compareAndSet(this, j4, ((2097152 + j4) & (-2097152)) | g4));
        return true;
    }

    /* JADX WARN: Type inference failed for: r0v0, types: [boolean, int] */
    public final boolean isTerminated() {
        return this._isTerminated;
    }

    public final void j(c cVar, int i4, int i5) {
        while (true) {
            long j4 = this.parkedWorkersStack;
            int i6 = (int) (2097151 & j4);
            long j5 = (2097152 + j4) & (-2097152);
            if (i6 == i4) {
                i6 = i5 == 0 ? g(cVar) : i5;
            }
            if (i6 >= 0) {
                if (f4008m.compareAndSet(this, j4, j5 | i6)) {
                    return;
                }
            }
        }
    }

    public final void k(h hVar) {
        try {
            hVar.run();
        } catch (Throwable th) {
            try {
                Thread currentThread = Thread.currentThread();
                currentThread.getUncaughtExceptionHandler().uncaughtException(currentThread, th);
            } finally {
                i3.b.a();
            }
        }
    }

    public final void l(long j4) {
        int i4;
        if (f4010o.compareAndSet(this, 0, 1)) {
            c d4 = d();
            synchronized (this.f4018k) {
                i4 = (int) (this.controlState & 2097151);
            }
            if (1 <= i4) {
                int i5 = 1;
                while (true) {
                    int i6 = i5 + 1;
                    Object b4 = this.f4018k.b(i5);
                    b3.f.b(b4);
                    c cVar = (c) b4;
                    if (cVar != d4) {
                        while (cVar.isAlive()) {
                            LockSupport.unpark(cVar);
                            cVar.join(j4);
                        }
                        cVar.f4021e.g(this.f4017j);
                    }
                    if (i5 == i4) {
                        break;
                    } else {
                        i5 = i6;
                    }
                }
            }
            this.f4017j.b();
            this.f4016i.b();
            while (true) {
                h f4 = d4 == null ? null : d4.f(true);
                if (f4 == null && (f4 = (h) this.f4016i.d()) == null && (f4 = (h) this.f4017j.d()) == null) {
                    break;
                } else {
                    k(f4);
                }
            }
            if (d4 != null) {
                d4.s(d.TERMINATED);
            }
            this.parkedWorkersStack = 0L;
            this.controlState = 0L;
        }
    }

    public final void n() {
        if (t() || s(this, 0L, 1, null)) {
            return;
        }
        t();
    }

    public String toString() {
        ArrayList arrayList = new ArrayList();
        int a4 = this.f4018k.a();
        int i4 = 0;
        int i5 = 0;
        int i6 = 0;
        int i7 = 0;
        int i8 = 0;
        int i9 = 1;
        while (i9 < a4) {
            int i10 = i9 + 1;
            c cVar = (c) this.f4018k.b(i9);
            if (cVar != null) {
                int f4 = cVar.f4021e.f();
                int i11 = b.f4019a[cVar.f4022f.ordinal()];
                if (i11 == 1) {
                    i6++;
                } else if (i11 == 2) {
                    i5++;
                    StringBuilder sb = new StringBuilder();
                    sb.append(f4);
                    sb.append('b');
                    arrayList.add(sb.toString());
                } else if (i11 == 3) {
                    i4++;
                    StringBuilder sb2 = new StringBuilder();
                    sb2.append(f4);
                    sb2.append('c');
                    arrayList.add(sb2.toString());
                } else if (i11 == 4) {
                    i7++;
                    if (f4 > 0) {
                        StringBuilder sb3 = new StringBuilder();
                        sb3.append(f4);
                        sb3.append('d');
                        arrayList.add(sb3.toString());
                    }
                } else if (i11 == 5) {
                    i8++;
                }
            }
            i9 = i10;
        }
        long j4 = this.controlState;
        return this.f4015h + '@' + i3.g.b(this) + "[Pool Size {core = " + this.f4012e + ", max = " + this.f4013f + "}, Worker States {CPU = " + i4 + ", blocking = " + i5 + ", parked = " + i6 + ", dormant = " + i7 + ", terminated = " + i8 + "}, running workers queues = " + arrayList + ", global CPU queue size = " + this.f4016i.c() + ", global blocking queue size = " + this.f4017j.c() + ", Control State {created workers= " + ((int) (2097151 & j4)) + ", blocking tasks = " + ((int) ((4398044413952L & j4) >> 21)) + ", CPUs acquired = " + (this.f4012e - ((int) ((9223367638808264704L & j4) >> 42))) + "}]";
    }
}
