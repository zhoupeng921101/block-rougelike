package g2;

import java.util.ArrayDeque;
import java.util.Queue;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class y {

    /* renamed from: a, reason: collision with root package name */
    private final Object f3385a = new Object();

    /* renamed from: b, reason: collision with root package name */
    private Queue f3386b;

    /* renamed from: c, reason: collision with root package name */
    private boolean f3387c;

    y() {
    }

    public final void a(x xVar) {
        synchronized (this.f3385a) {
            try {
                if (this.f3386b == null) {
                    this.f3386b = new ArrayDeque();
                }
                this.f3386b.add(xVar);
            } catch (Throwable th) {
                throw th;
            }
        }
    }

    public final void b(h hVar) {
        x xVar;
        synchronized (this.f3385a) {
            if (this.f3386b != null && !this.f3387c) {
                this.f3387c = true;
                while (true) {
                    synchronized (this.f3385a) {
                        try {
                            xVar = (x) this.f3386b.poll();
                            if (xVar == null) {
                                this.f3387c = false;
                                return;
                            }
                        } finally {
                        }
                    }
                    xVar.d(hVar);
                }
            }
        }
    }
}
