package g2;

import java.util.concurrent.Executor;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class w implements x {

    /* renamed from: a, reason: collision with root package name */
    private final Executor f3382a;

    /* renamed from: b, reason: collision with root package name */
    private final Object f3383b = new Object();

    /* renamed from: c, reason: collision with root package name */
    private f f3384c;

    public w(Executor executor, f fVar) {
        this.f3382a = executor;
        this.f3384c = fVar;
    }

    @Override // g2.x
    public final void c() {
        synchronized (this.f3383b) {
            this.f3384c = null;
        }
    }

    @Override // g2.x
    public final void d(h hVar) {
        if (hVar.q()) {
            synchronized (this.f3383b) {
                try {
                    if (this.f3384c == null) {
                        return;
                    }
                    this.f3382a.execute(new v(this, hVar));
                } catch (Throwable th) {
                    throw th;
                }
            }
        }
    }
}
