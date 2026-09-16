package i3;

import java.util.concurrent.locks.LockSupport;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class o extends m {
    protected abstract Thread j();

    protected final void k() {
        Thread j4 = j();
        if (Thread.currentThread() != j4) {
            b.a();
            LockSupport.unpark(j4);
        }
    }
}
