package r0;

import android.content.Context;
import java.util.concurrent.Executor;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class s implements m0.b {

    /* renamed from: a, reason: collision with root package name */
    private final s2.a f4807a;

    /* renamed from: b, reason: collision with root package name */
    private final s2.a f4808b;

    /* renamed from: c, reason: collision with root package name */
    private final s2.a f4809c;

    /* renamed from: d, reason: collision with root package name */
    private final s2.a f4810d;

    /* renamed from: e, reason: collision with root package name */
    private final s2.a f4811e;

    /* renamed from: f, reason: collision with root package name */
    private final s2.a f4812f;

    /* renamed from: g, reason: collision with root package name */
    private final s2.a f4813g;

    /* renamed from: h, reason: collision with root package name */
    private final s2.a f4814h;

    /* renamed from: i, reason: collision with root package name */
    private final s2.a f4815i;

    public s(s2.a aVar, s2.a aVar2, s2.a aVar3, s2.a aVar4, s2.a aVar5, s2.a aVar6, s2.a aVar7, s2.a aVar8, s2.a aVar9) {
        this.f4807a = aVar;
        this.f4808b = aVar2;
        this.f4809c = aVar3;
        this.f4810d = aVar4;
        this.f4811e = aVar5;
        this.f4812f = aVar6;
        this.f4813g = aVar7;
        this.f4814h = aVar8;
        this.f4815i = aVar9;
    }

    public static s a(s2.a aVar, s2.a aVar2, s2.a aVar3, s2.a aVar4, s2.a aVar5, s2.a aVar6, s2.a aVar7, s2.a aVar8, s2.a aVar9) {
        return new s(aVar, aVar2, aVar3, aVar4, aVar5, aVar6, aVar7, aVar8, aVar9);
    }

    public static r c(Context context, l0.e eVar, s0.d dVar, x xVar, Executor executor, t0.b bVar, u0.a aVar, u0.a aVar2, s0.c cVar) {
        return new r(context, eVar, dVar, xVar, executor, bVar, aVar, aVar2, cVar);
    }

    @Override // s2.a
    /* renamed from: b, reason: merged with bridge method [inline-methods] */
    public r get() {
        return c((Context) this.f4807a.get(), (l0.e) this.f4808b.get(), (s0.d) this.f4809c.get(), (x) this.f4810d.get(), (Executor) this.f4811e.get(), (t0.b) this.f4812f.get(), (u0.a) this.f4813g.get(), (u0.a) this.f4814h.get(), (s0.c) this.f4815i.get());
    }
}
