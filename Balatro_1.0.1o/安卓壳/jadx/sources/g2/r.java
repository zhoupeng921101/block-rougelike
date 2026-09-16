package g2;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class r implements Runnable {

    /* renamed from: e, reason: collision with root package name */
    final /* synthetic */ h f3370e;

    /* renamed from: f, reason: collision with root package name */
    final /* synthetic */ s f3371f;

    r(s sVar, h hVar) {
        this.f3371f = sVar;
        this.f3370e = hVar;
    }

    @Override // java.lang.Runnable
    public final void run() {
        Object obj;
        d dVar;
        d dVar2;
        obj = this.f3371f.f3373b;
        synchronized (obj) {
            try {
                s sVar = this.f3371f;
                dVar = sVar.f3374c;
                if (dVar != null) {
                    dVar2 = sVar.f3374c;
                    dVar2.a(this.f3370e);
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }
}
