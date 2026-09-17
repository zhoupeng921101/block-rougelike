package g2;

import java.util.concurrent.Executor;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class s implements x {

    /* renamed from: a, reason: collision with root package name */
    private final Executor f3372a;

    /* renamed from: b, reason: collision with root package name */
    private final Object f3373b = new Object();

    /* renamed from: c, reason: collision with root package name */
    private d f3374c;

    public s(Executor executor, d dVar) {
        this.f3372a = executor;
        this.f3374c = dVar;
    }

    @Override // g2.x
    public final void c() {
        synchronized (this.f3373b) {
            this.f3374c = null;
        }
    }

    @Override // g2.x
    public final void d(h hVar) {
        synchronized (this.f3373b) {
            try {
                if (this.f3374c == null) {
                    return;
                }
                this.f3372a.execute(new r(this, hVar));
            } catch (Throwable th) {
                throw th;
            }
        }
    }
}
