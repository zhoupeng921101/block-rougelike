package g2;

import java.util.concurrent.Executor;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class q implements x {

    /* renamed from: a, reason: collision with root package name */
    private final Executor f3367a;

    /* renamed from: b, reason: collision with root package name */
    private final Object f3368b = new Object();

    /* renamed from: c, reason: collision with root package name */
    private c f3369c;

    public q(Executor executor, c cVar) {
        this.f3367a = executor;
        this.f3369c = cVar;
    }

    @Override // g2.x
    public final void c() {
        synchronized (this.f3368b) {
            this.f3369c = null;
        }
    }

    @Override // g2.x
    public final void d(h hVar) {
        if (hVar.o()) {
            synchronized (this.f3368b) {
                try {
                    if (this.f3369c == null) {
                        return;
                    }
                    this.f3367a.execute(new p(this));
                } catch (Throwable th) {
                    throw th;
                }
            }
        }
    }
}
