package q0;

import java.util.concurrent.Executor;
import r0.x;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class d implements m0.b {

    /* renamed from: a, reason: collision with root package name */
    private final s2.a f4710a;

    /* renamed from: b, reason: collision with root package name */
    private final s2.a f4711b;

    /* renamed from: c, reason: collision with root package name */
    private final s2.a f4712c;

    /* renamed from: d, reason: collision with root package name */
    private final s2.a f4713d;

    /* renamed from: e, reason: collision with root package name */
    private final s2.a f4714e;

    public d(s2.a aVar, s2.a aVar2, s2.a aVar3, s2.a aVar4, s2.a aVar5) {
        this.f4710a = aVar;
        this.f4711b = aVar2;
        this.f4712c = aVar3;
        this.f4713d = aVar4;
        this.f4714e = aVar5;
    }

    public static d a(s2.a aVar, s2.a aVar2, s2.a aVar3, s2.a aVar4, s2.a aVar5) {
        return new d(aVar, aVar2, aVar3, aVar4, aVar5);
    }

    public static c c(Executor executor, l0.e eVar, x xVar, s0.d dVar, t0.b bVar) {
        return new c(executor, eVar, xVar, dVar, bVar);
    }

    @Override // s2.a
    /* renamed from: b, reason: merged with bridge method [inline-methods] */
    public c get() {
        return c((Executor) this.f4710a.get(), (l0.e) this.f4711b.get(), (x) this.f4712c.get(), (s0.d) this.f4713d.get(), (t0.b) this.f4714e.get());
    }
}
