package g2;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class l implements Runnable {

    /* renamed from: e, reason: collision with root package name */
    final /* synthetic */ h f3356e;

    /* renamed from: f, reason: collision with root package name */
    final /* synthetic */ m f3357f;

    l(m mVar, h hVar) {
        this.f3357f = mVar;
        this.f3356e = hVar;
    }

    @Override // java.lang.Runnable
    public final void run() {
        c0 c0Var;
        c0 c0Var2;
        c0 c0Var3;
        a aVar;
        c0 c0Var4;
        c0 c0Var5;
        if (this.f3356e.o()) {
            c0Var5 = this.f3357f.f3360c;
            c0Var5.t();
            return;
        }
        try {
            aVar = this.f3357f.f3359b;
            Object a4 = aVar.a(this.f3356e);
            c0Var4 = this.f3357f.f3360c;
            c0Var4.s(a4);
        } catch (g e4) {
            if (e4.getCause() instanceof Exception) {
                c0Var3 = this.f3357f.f3360c;
                c0Var3.r((Exception) e4.getCause());
            } else {
                c0Var2 = this.f3357f.f3360c;
                c0Var2.r(e4);
            }
        } catch (Exception e5) {
            c0Var = this.f3357f.f3360c;
            c0Var.r(e5);
        }
    }
}
