package q0;

import android.content.Context;
import r0.x;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class i implements m0.b {

    /* renamed from: a, reason: collision with root package name */
    private final s2.a f4716a;

    /* renamed from: b, reason: collision with root package name */
    private final s2.a f4717b;

    /* renamed from: c, reason: collision with root package name */
    private final s2.a f4718c;

    /* renamed from: d, reason: collision with root package name */
    private final s2.a f4719d;

    public i(s2.a aVar, s2.a aVar2, s2.a aVar3, s2.a aVar4) {
        this.f4716a = aVar;
        this.f4717b = aVar2;
        this.f4718c = aVar3;
        this.f4719d = aVar4;
    }

    public static i a(s2.a aVar, s2.a aVar2, s2.a aVar3, s2.a aVar4) {
        return new i(aVar, aVar2, aVar3, aVar4);
    }

    public static x c(Context context, s0.d dVar, r0.f fVar, u0.a aVar) {
        return (x) m0.d.c(h.a(context, dVar, fVar, aVar), "Cannot return null from a non-@Nullable @Provides method");
    }

    @Override // s2.a
    /* renamed from: b, reason: merged with bridge method [inline-methods] */
    public x get() {
        return c((Context) this.f4716a.get(), (s0.d) this.f4717b.get(), (r0.f) this.f4718c.get(), (u0.a) this.f4719d.get());
    }
}
