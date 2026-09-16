package i3;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class f {
    public static final void a(v2.e eVar, Throwable th) {
        try {
            d dVar = (d) eVar.get(d.f3629b);
            if (dVar == null) {
                e.a(eVar, th);
            } else {
                dVar.handleException(eVar, th);
            }
        } catch (Throwable th2) {
            e.a(eVar, b(th, th2));
        }
    }

    public static final Throwable b(Throwable th, Throwable th2) {
        if (th == th2) {
            return th;
        }
        RuntimeException runtimeException = new RuntimeException("Exception while trying to handle coroutine exception", th2);
        t2.a.a(runtimeException, th);
        return runtimeException;
    }
}
