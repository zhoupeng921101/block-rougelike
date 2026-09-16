package g2;

import java.util.concurrent.Executor;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class u implements x {

    /* renamed from: a, reason: collision with root package name */
    private final Executor f3377a;

    /* renamed from: b, reason: collision with root package name */
    private final Object f3378b = new Object();

    /* renamed from: c, reason: collision with root package name */
    private e f3379c;

    public u(Executor executor, e eVar) {
        this.f3377a = executor;
        this.f3379c = eVar;
    }

    @Override // g2.x
    public final void c() {
        synchronized (this.f3378b) {
            this.f3379c = null;
        }
    }

    @Override // g2.x
    public final void d(h hVar) {
        if (hVar.q() || hVar.o()) {
            return;
        }
        synchronized (this.f3378b) {
            try {
                if (this.f3379c == null) {
                    return;
                }
                this.f3377a.execute(new t(this, hVar));
            } catch (Throwable th) {
                throw th;
            }
        }
    }
}
