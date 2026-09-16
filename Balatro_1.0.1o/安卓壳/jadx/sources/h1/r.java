package h1;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class r {

    /* renamed from: b, reason: collision with root package name */
    private static r f3570b;

    /* renamed from: c, reason: collision with root package name */
    private static final s f3571c = new s(0, false, false, 0, 0);

    /* renamed from: a, reason: collision with root package name */
    private s f3572a;

    private r() {
    }

    public static synchronized r b() {
        r rVar;
        synchronized (r.class) {
            try {
                if (f3570b == null) {
                    f3570b = new r();
                }
                rVar = f3570b;
            } catch (Throwable th) {
                throw th;
            }
        }
        return rVar;
    }

    public s a() {
        return this.f3572a;
    }

    public final synchronized void c(s sVar) {
        if (sVar == null) {
            this.f3572a = f3571c;
            return;
        }
        s sVar2 = this.f3572a;
        if (sVar2 == null || sVar2.l0() < sVar.l0()) {
            this.f3572a = sVar;
        }
    }
}
