package g2;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class t implements Runnable {

    /* renamed from: e, reason: collision with root package name */
    final /* synthetic */ h f3375e;

    /* renamed from: f, reason: collision with root package name */
    final /* synthetic */ u f3376f;

    t(u uVar, h hVar) {
        this.f3376f = uVar;
        this.f3375e = hVar;
    }

    @Override // java.lang.Runnable
    public final void run() {
        Object obj;
        e eVar;
        e eVar2;
        obj = this.f3376f.f3378b;
        synchronized (obj) {
            try {
                u uVar = this.f3376f;
                eVar = uVar.f3379c;
                if (eVar != null) {
                    eVar2 = uVar.f3379c;
                    eVar2.e((Exception) h1.q.i(this.f3375e.m()));
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }
}
