package i3;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class m extends c {

    /* renamed from: f, reason: collision with root package name */
    private long f3641f;

    /* renamed from: g, reason: collision with root package name */
    private boolean f3642g;

    private final long d(boolean z3) {
        return z3 ? 4294967296L : 1L;
    }

    public static /* synthetic */ void g(m mVar, boolean z3, int i4, Object obj) {
        if (obj != null) {
            throw new UnsupportedOperationException("Super calls with default arguments not supported in this target, function: incrementUseCount");
        }
        if ((i4 & 1) != 0) {
            z3 = false;
        }
        mVar.f(z3);
    }

    protected long e() {
        return Long.MAX_VALUE;
    }

    public final void f(boolean z3) {
        this.f3641f += d(z3);
        if (z3) {
            return;
        }
        this.f3642g = true;
    }

    public final boolean h() {
        return true;
    }

    public final boolean i() {
        return false;
    }
}
