package k0;

import a1.b2.c3;
import java.util.concurrent.Executor;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class m implements Executor {

    /* renamed from: e, reason: collision with root package name */
    private final Executor f3964e;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a implements Runnable {

        /* renamed from: e, reason: collision with root package name */
        private final Runnable f3965e;

        a(Runnable runnable) {
            this.f3965e = runnable;
        }

        @Override // java.lang.Runnable
        public void run() {
            try {
                this.f3965e.run();
            } catch (Exception e4) {
                o0.a.d("Executor", c3.d4(1044), e4);
            }
        }
    }

    m(Executor executor) {
        this.f3964e = executor;
    }

    @Override // java.util.concurrent.Executor
    public void execute(Runnable runnable) {
        this.f3964e.execute(new a(runnable));
    }
}
