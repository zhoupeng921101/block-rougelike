package kotlinx.coroutines.scheduling;

import a1.b2.c3;
import i3.q;
import java.util.concurrent.Executor;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class b extends q implements Executor {

    /* renamed from: g, reason: collision with root package name */
    public static final b f4034g = new b();

    /* renamed from: h, reason: collision with root package name */
    private static final i3.c f4035h;

    static {
        int d4;
        m mVar = m.f4054f;
        d4 = k3.m.d(c3.d4(1080), e3.d.a(64, k3.k.a()), 0, 0, 12, null);
        f4035h = mVar.c(d4);
    }

    private b() {
    }

    @Override // i3.c
    public void a(v2.e eVar, Runnable runnable) {
        f4035h.a(eVar, runnable);
    }

    @Override // java.io.Closeable, java.lang.AutoCloseable
    public void close() {
        throw new IllegalStateException(c3.d4(701));
    }

    @Override // java.util.concurrent.Executor
    public void execute(Runnable runnable) {
        a(v2.f.f5084e, runnable);
    }

    @Override // i3.c
    public String toString() {
        return c3.d4(1182);
    }
}
