package g2;

import java.util.concurrent.Executor;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class m implements x {

    /* renamed from: a, reason: collision with root package name */
    private final Executor f3358a;

    /* renamed from: b, reason: collision with root package name */
    private final a f3359b;

    /* renamed from: c, reason: collision with root package name */
    private final c0 f3360c;

    public m(Executor executor, a aVar, c0 c0Var) {
        this.f3358a = executor;
        this.f3359b = aVar;
        this.f3360c = c0Var;
    }

    @Override // g2.x
    public final void c() {
        throw new UnsupportedOperationException();
    }

    @Override // g2.x
    public final void d(h hVar) {
        this.f3358a.execute(new l(this, hVar));
    }
}
