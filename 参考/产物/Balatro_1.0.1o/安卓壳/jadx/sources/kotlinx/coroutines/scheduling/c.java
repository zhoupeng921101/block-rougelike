package kotlinx.coroutines.scheduling;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class c extends f {

    /* renamed from: l, reason: collision with root package name */
    public static final c f4036l = new c();

    private c() {
        super(l.f4048b, l.f4049c, l.f4050d, "DefaultDispatcher");
    }

    @Override // java.io.Closeable, java.lang.AutoCloseable
    public void close() {
        throw new UnsupportedOperationException("Dispatchers.Default cannot be closed");
    }

    @Override // i3.c
    public String toString() {
        return "Dispatchers.Default";
    }
}
