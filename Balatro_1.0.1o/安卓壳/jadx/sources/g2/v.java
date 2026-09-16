package g2;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class v implements Runnable {

    /* renamed from: e, reason: collision with root package name */
    final /* synthetic */ h f3380e;

    /* renamed from: f, reason: collision with root package name */
    final /* synthetic */ w f3381f;

    v(w wVar, h hVar) {
        this.f3381f = wVar;
        this.f3380e = hVar;
    }

    @Override // java.lang.Runnable
    public final void run() {
        Object obj;
        f fVar;
        f fVar2;
        obj = this.f3381f.f3383b;
        synchronized (obj) {
            try {
                w wVar = this.f3381f;
                fVar = wVar.f3384c;
                if (fVar != null) {
                    fVar2 = wVar.f3384c;
                    fVar2.b(this.f3380e.n());
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }
}
