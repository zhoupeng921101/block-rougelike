package f1;

import a1.b2.c3;
import android.app.Activity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class v extends e1 {

    /* renamed from: f, reason: collision with root package name */
    private final k.b f3316f;

    /* renamed from: g, reason: collision with root package name */
    private final f f3317g;

    v(i iVar, f fVar, d1.i iVar2) {
        super(iVar, iVar2);
        this.f3316f = new k.b();
        this.f3317g = fVar;
        this.f3261a.a("ConnectionlessLifecycleHelper", this);
    }

    public static void u(Activity activity, f fVar, b bVar) {
        i c4 = h.c(activity);
        v vVar = (v) c4.d("ConnectionlessLifecycleHelper", v.class);
        if (vVar == null) {
            vVar = new v(c4, fVar, d1.i.l());
        }
        h1.q.j(bVar, c3.d4(72));
        vVar.f3316f.add(bVar);
        fVar.b(vVar);
    }

    private final void v() {
        if (this.f3316f.isEmpty()) {
            return;
        }
        this.f3317g.b(this);
    }

    @Override // f1.h
    public final void h() {
        super.h();
        v();
    }

    @Override // f1.e1, f1.h
    public final void j() {
        super.j();
        v();
    }

    @Override // f1.e1, f1.h
    public final void k() {
        super.k();
        this.f3317g.c(this);
    }

    @Override // f1.e1
    protected final void m(d1.a aVar, int i4) {
        this.f3317g.D(aVar, i4);
    }

    @Override // f1.e1
    protected final void n() {
        this.f3317g.E();
    }

    final k.b t() {
        return this.f3316f;
    }
}
