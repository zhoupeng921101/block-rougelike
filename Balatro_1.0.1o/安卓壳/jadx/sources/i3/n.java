package i3;

import com.google.android.gms.internal.play_billing.l1;
import java.util.concurrent.atomic.AtomicReferenceFieldUpdater;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class n extends o implements j {

    /* renamed from: h, reason: collision with root package name */
    private static final /* synthetic */ AtomicReferenceFieldUpdater f3643h = AtomicReferenceFieldUpdater.newUpdater(n.class, Object.class, "_queue");

    /* renamed from: i, reason: collision with root package name */
    private static final /* synthetic */ AtomicReferenceFieldUpdater f3644i = AtomicReferenceFieldUpdater.newUpdater(n.class, Object.class, "_delayed");
    private volatile /* synthetic */ Object _queue = null;
    private volatile /* synthetic */ Object _delayed = null;
    private volatile /* synthetic */ int _isCompleted = 0;

    private final Runnable l() {
        k3.j jVar;
        while (true) {
            Object obj = this._queue;
            if (obj == null) {
                return null;
            }
            if (obj instanceof k3.d) {
                k3.d dVar = (k3.d) obj;
                Object j4 = dVar.j();
                if (j4 != k3.d.f3997h) {
                    return (Runnable) j4;
                }
                l1.a(f3643h, this, obj, dVar.i());
            } else {
                jVar = p.f3646b;
                if (obj == jVar) {
                    return null;
                }
                if (l1.a(f3643h, this, obj, null)) {
                    return (Runnable) obj;
                }
            }
        }
    }

    private final boolean n(Runnable runnable) {
        k3.j jVar;
        while (true) {
            Object obj = this._queue;
            if (p()) {
                return false;
            }
            if (obj == null) {
                if (l1.a(f3643h, this, null, runnable)) {
                    return true;
                }
            } else if (obj instanceof k3.d) {
                k3.d dVar = (k3.d) obj;
                int a4 = dVar.a(runnable);
                if (a4 == 0) {
                    return true;
                }
                if (a4 == 1) {
                    l1.a(f3643h, this, obj, dVar.i());
                } else if (a4 == 2) {
                    return false;
                }
            } else {
                jVar = p.f3646b;
                if (obj == jVar) {
                    return false;
                }
                k3.d dVar2 = new k3.d(8, true);
                dVar2.a((Runnable) obj);
                dVar2.a(runnable);
                if (l1.a(f3643h, this, obj, dVar2)) {
                    return true;
                }
            }
        }
    }

    /* JADX WARN: Type inference failed for: r0v0, types: [boolean, int] */
    private final boolean p() {
        return this._isCompleted;
    }

    @Override // i3.c
    public final void a(v2.e eVar, Runnable runnable) {
        m(runnable);
    }

    @Override // i3.m
    protected long e() {
        k3.j jVar;
        if (super.e() == 0) {
            return 0L;
        }
        Object obj = this._queue;
        if (obj != null) {
            if (!(obj instanceof k3.d)) {
                jVar = p.f3646b;
                return obj == jVar ? Long.MAX_VALUE : 0L;
            }
            if (!((k3.d) obj).g()) {
                return 0L;
            }
        }
        h.d.a(this._delayed);
        return Long.MAX_VALUE;
    }

    public void m(Runnable runnable) {
        if (n(runnable)) {
            k();
        } else {
            h.f3632j.m(runnable);
        }
    }

    protected boolean r() {
        k3.j jVar;
        if (!h()) {
            return false;
        }
        h.d.a(this._delayed);
        Object obj = this._queue;
        if (obj == null) {
            return true;
        }
        if (obj instanceof k3.d) {
            return ((k3.d) obj).g();
        }
        jVar = p.f3646b;
        return obj == jVar;
    }

    public long s() {
        if (i()) {
            return 0L;
        }
        h.d.a(this._delayed);
        Runnable l3 = l();
        if (l3 == null) {
            return e();
        }
        l3.run();
        return 0L;
    }

    protected final void t() {
        this._queue = null;
        this._delayed = null;
    }
}
