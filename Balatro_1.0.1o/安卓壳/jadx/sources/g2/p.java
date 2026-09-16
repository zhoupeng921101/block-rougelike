package g2;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class p implements Runnable {

    /* renamed from: e, reason: collision with root package name */
    final /* synthetic */ q f3366e;

    p(q qVar) {
        this.f3366e = qVar;
    }

    @Override // java.lang.Runnable
    public final void run() {
        Object obj;
        c cVar;
        c cVar2;
        obj = this.f3366e.f3368b;
        synchronized (obj) {
            try {
                q qVar = this.f3366e;
                cVar = qVar.f3369c;
                if (cVar != null) {
                    cVar2 = qVar.f3369c;
                    cVar2.a();
                }
            } catch (Throwable th) {
                throw th;
            }
        }
    }
}
