package r0;

import java.util.concurrent.Executor;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class w implements m0.b {

    /* renamed from: a, reason: collision with root package name */
    private final s2.a f4822a;

    /* renamed from: b, reason: collision with root package name */
    private final s2.a f4823b;

    /* renamed from: c, reason: collision with root package name */
    private final s2.a f4824c;

    /* renamed from: d, reason: collision with root package name */
    private final s2.a f4825d;

    public w(s2.a aVar, s2.a aVar2, s2.a aVar3, s2.a aVar4) {
        this.f4822a = aVar;
        this.f4823b = aVar2;
        this.f4824c = aVar3;
        this.f4825d = aVar4;
    }

    public static w a(s2.a aVar, s2.a aVar2, s2.a aVar3, s2.a aVar4) {
        return new w(aVar, aVar2, aVar3, aVar4);
    }

    public static v c(Executor executor, s0.d dVar, x xVar, t0.b bVar) {
        return new v(executor, dVar, xVar, bVar);
    }

    @Override // s2.a
    /* renamed from: b, reason: merged with bridge method [inline-methods] */
    public v get() {
        return c((Executor) this.f4822a.get(), (s0.d) this.f4823b.get(), (x) this.f4824c.get(), (t0.b) this.f4825d.get());
    }
}
