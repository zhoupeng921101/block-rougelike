package g2;

import java.util.concurrent.Executor;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class o implements f, e, c, x {

    /* renamed from: a, reason: collision with root package name */
    private final Executor f3363a;

    /* renamed from: b, reason: collision with root package name */
    private final a f3364b;

    /* renamed from: c, reason: collision with root package name */
    private final c0 f3365c;

    public o(Executor executor, a aVar, c0 c0Var) {
        this.f3363a = executor;
        this.f3364b = aVar;
        this.f3365c = c0Var;
    }

    @Override // g2.c
    public final void a() {
        this.f3365c.t();
    }

    @Override // g2.f
    public final void b(Object obj) {
        this.f3365c.s(obj);
    }

    @Override // g2.x
    public final void c() {
        throw new UnsupportedOperationException();
    }

    @Override // g2.x
    public final void d(h hVar) {
        this.f3363a.execute(new n(this, hVar));
    }

    @Override // g2.e
    public final void e(Exception exc) {
        this.f3365c.r(exc);
    }
}
