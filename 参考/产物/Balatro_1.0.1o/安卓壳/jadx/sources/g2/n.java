package g2;

import java.util.concurrent.Executor;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class n implements Runnable {

    /* renamed from: e, reason: collision with root package name */
    final /* synthetic */ h f3361e;

    /* renamed from: f, reason: collision with root package name */
    final /* synthetic */ o f3362f;

    n(o oVar, h hVar) {
        this.f3362f = oVar;
        this.f3361e = hVar;
    }

    @Override // java.lang.Runnable
    public final void run() {
        c0 c0Var;
        c0 c0Var2;
        c0 c0Var3;
        a aVar;
        try {
            aVar = this.f3362f.f3364b;
            h hVar = (h) aVar.a(this.f3361e);
            if (hVar == null) {
                this.f3362f.e(new NullPointerException("Continuation returned null"));
                return;
            }
            o oVar = this.f3362f;
            Executor executor = j.f3355b;
            hVar.h(executor, oVar);
            hVar.f(executor, this.f3362f);
            hVar.a(executor, this.f3362f);
        } catch (g e4) {
            if (e4.getCause() instanceof Exception) {
                c0Var3 = this.f3362f.f3365c;
                c0Var3.r((Exception) e4.getCause());
            } else {
                c0Var2 = this.f3362f.f3365c;
                c0Var2.r(e4);
            }
        } catch (Exception e5) {
            c0Var = this.f3362f.f3365c;
            c0Var.r(e5);
        }
    }
}
