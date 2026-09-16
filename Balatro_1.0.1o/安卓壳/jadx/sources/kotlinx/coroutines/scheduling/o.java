package kotlinx.coroutines.scheduling;

import a1.b2.c3;
import com.google.android.gms.internal.play_billing.l1;
import java.util.concurrent.atomic.AtomicIntegerFieldUpdater;
import java.util.concurrent.atomic.AtomicReferenceArray;
import java.util.concurrent.atomic.AtomicReferenceFieldUpdater;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class o {

    /* renamed from: b, reason: collision with root package name */
    private static final /* synthetic */ AtomicReferenceFieldUpdater f4055b = AtomicReferenceFieldUpdater.newUpdater(o.class, Object.class, "lastScheduledTask");

    /* renamed from: c, reason: collision with root package name */
    private static final /* synthetic */ AtomicIntegerFieldUpdater f4056c = AtomicIntegerFieldUpdater.newUpdater(o.class, "producerIndex");

    /* renamed from: d, reason: collision with root package name */
    private static final /* synthetic */ AtomicIntegerFieldUpdater f4057d = AtomicIntegerFieldUpdater.newUpdater(o.class, "consumerIndex");

    /* renamed from: e, reason: collision with root package name */
    private static final /* synthetic */ AtomicIntegerFieldUpdater f4058e = AtomicIntegerFieldUpdater.newUpdater(o.class, c3.d4(208));

    /* renamed from: a, reason: collision with root package name */
    private final AtomicReferenceArray f4059a = new AtomicReferenceArray(128);
    private volatile /* synthetic */ Object lastScheduledTask = null;
    private volatile /* synthetic */ int producerIndex = 0;
    private volatile /* synthetic */ int consumerIndex = 0;
    private volatile /* synthetic */ int blockingTasksInBuffer = 0;

    public static /* synthetic */ h b(o oVar, h hVar, boolean z3, int i4, Object obj) {
        if ((i4 & 2) != 0) {
            z3 = false;
        }
        return oVar.a(hVar, z3);
    }

    private final h c(h hVar) {
        if (hVar.f4044f.b() == 1) {
            f4058e.incrementAndGet(this);
        }
        if (e() == 127) {
            return hVar;
        }
        int i4 = this.producerIndex & 127;
        while (this.f4059a.get(i4) != null) {
            Thread.yield();
        }
        this.f4059a.lazySet(i4, hVar);
        f4056c.incrementAndGet(this);
        return null;
    }

    private final void d(h hVar) {
        if (hVar == null || hVar.f4044f.b() != 1) {
            return;
        }
        f4058e.decrementAndGet(this);
    }

    private final h i() {
        h hVar;
        while (true) {
            int i4 = this.consumerIndex;
            if (i4 - this.producerIndex == 0) {
                return null;
            }
            int i5 = i4 & 127;
            if (f4057d.compareAndSet(this, i4, i4 + 1) && (hVar = (h) this.f4059a.getAndSet(i5, null)) != null) {
                d(hVar);
                return hVar;
            }
        }
    }

    private final boolean j(d dVar) {
        h i4 = i();
        if (i4 == null) {
            return false;
        }
        dVar.a(i4);
        return true;
    }

    private final long m(o oVar, boolean z3) {
        h hVar;
        do {
            hVar = (h) oVar.lastScheduledTask;
            if (hVar == null) {
                return -2L;
            }
            if (z3 && hVar.f4044f.b() != 1) {
                return -2L;
            }
            long a4 = l.f4051e.a() - hVar.f4043e;
            long j4 = l.f4047a;
            if (a4 < j4) {
                return j4 - a4;
            }
        } while (!l1.a(f4055b, oVar, hVar, null));
        b(this, hVar, false, 2, null);
        return -1L;
    }

    public final h a(h hVar, boolean z3) {
        if (z3) {
            return c(hVar);
        }
        h hVar2 = (h) f4055b.getAndSet(this, hVar);
        if (hVar2 == null) {
            return null;
        }
        return c(hVar2);
    }

    public final int e() {
        return this.producerIndex - this.consumerIndex;
    }

    public final int f() {
        return this.lastScheduledTask != null ? e() + 1 : e();
    }

    public final void g(d dVar) {
        h hVar = (h) f4055b.getAndSet(this, null);
        if (hVar != null) {
            dVar.a(hVar);
        }
        while (j(dVar)) {
        }
    }

    public final h h() {
        h hVar = (h) f4055b.getAndSet(this, null);
        return hVar == null ? i() : hVar;
    }

    public final long k(o oVar) {
        int i4 = oVar.producerIndex;
        AtomicReferenceArray atomicReferenceArray = oVar.f4059a;
        for (int i5 = oVar.consumerIndex; i5 != i4; i5++) {
            int i6 = i5 & 127;
            if (oVar.blockingTasksInBuffer == 0) {
                break;
            }
            h hVar = (h) atomicReferenceArray.get(i6);
            if (hVar != null && hVar.f4044f.b() == 1 && n.a(atomicReferenceArray, i6, hVar, null)) {
                f4058e.decrementAndGet(oVar);
                b(this, hVar, false, 2, null);
                return -1L;
            }
        }
        return m(oVar, true);
    }

    public final long l(o oVar) {
        h i4 = oVar.i();
        if (i4 == null) {
            return m(oVar, false);
        }
        b(this, i4, false, 2, null);
        return -1L;
    }
}
