package f1;

import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import e1.a;
import e1.f;
import java.util.Set;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class s0 extends f2.d implements f.a, f.b {

    /* renamed from: h, reason: collision with root package name */
    private static final a.AbstractC0041a f3303h = e2.d.f3174c;

    /* renamed from: a, reason: collision with root package name */
    private final Context f3304a;

    /* renamed from: b, reason: collision with root package name */
    private final Handler f3305b;

    /* renamed from: c, reason: collision with root package name */
    private final a.AbstractC0041a f3306c;

    /* renamed from: d, reason: collision with root package name */
    private final Set f3307d;

    /* renamed from: e, reason: collision with root package name */
    private final h1.e f3308e;

    /* renamed from: f, reason: collision with root package name */
    private e2.e f3309f;

    /* renamed from: g, reason: collision with root package name */
    private r0 f3310g;

    public s0(Context context, Handler handler, h1.e eVar) {
        a.AbstractC0041a abstractC0041a = f3303h;
        this.f3304a = context;
        this.f3305b = handler;
        this.f3308e = (h1.e) h1.q.j(eVar, "ClientSettings must not be null");
        this.f3307d = eVar.h();
        this.f3306c = abstractC0041a;
    }

    static /* bridge */ /* synthetic */ void o0(s0 s0Var, f2.l lVar) {
        d1.a h02 = lVar.h0();
        if (h02.m0()) {
            h1.o0 o0Var = (h1.o0) h1.q.i(lVar.i0());
            d1.a h03 = o0Var.h0();
            if (!h03.m0()) {
                String valueOf = String.valueOf(h03);
                Log.wtf("SignInCoordinator", "Sign-in succeeded with resolve account failure: ".concat(valueOf), new Exception());
                s0Var.f3310g.a(h03);
                s0Var.f3309f.l();
                return;
            }
            s0Var.f3310g.b(o0Var.i0(), s0Var.f3307d);
        } else {
            s0Var.f3310g.a(h02);
        }
        s0Var.f3309f.l();
    }

    @Override // f2.f
    public final void O(f2.l lVar) {
        this.f3305b.post(new q0(this, lVar));
    }

    @Override // f1.e
    public final void a(int i4) {
        this.f3310g.d(i4);
    }

    @Override // f1.l
    public final void h(d1.a aVar) {
        this.f3310g.a(aVar);
    }

    @Override // f1.e
    public final void i(Bundle bundle) {
        this.f3309f.k(this);
    }

    /* JADX WARN: Type inference failed for: r0v3, types: [e1.a$f, e2.e] */
    public final void p0(r0 r0Var) {
        e2.e eVar = this.f3309f;
        if (eVar != null) {
            eVar.l();
        }
        this.f3308e.m(Integer.valueOf(System.identityHashCode(this)));
        a.AbstractC0041a abstractC0041a = this.f3306c;
        Context context = this.f3304a;
        Handler handler = this.f3305b;
        h1.e eVar2 = this.f3308e;
        this.f3309f = abstractC0041a.a(context, handler.getLooper(), eVar2, eVar2.j(), this, this);
        this.f3310g = r0Var;
        Set set = this.f3307d;
        if (set == null || set.isEmpty()) {
            this.f3305b.post(new p0(this));
        } else {
            this.f3309f.o();
        }
    }

    public final void q0() {
        e2.e eVar = this.f3309f;
        if (eVar != null) {
            eVar.l();
        }
    }
}
