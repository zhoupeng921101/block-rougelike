package l0;

import android.content.Context;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class j implements m0.b {

    /* renamed from: a, reason: collision with root package name */
    private final s2.a f4133a;

    /* renamed from: b, reason: collision with root package name */
    private final s2.a f4134b;

    /* renamed from: c, reason: collision with root package name */
    private final s2.a f4135c;

    public j(s2.a aVar, s2.a aVar2, s2.a aVar3) {
        this.f4133a = aVar;
        this.f4134b = aVar2;
        this.f4135c = aVar3;
    }

    public static j a(s2.a aVar, s2.a aVar2, s2.a aVar3) {
        return new j(aVar, aVar2, aVar3);
    }

    public static i c(Context context, u0.a aVar, u0.a aVar2) {
        return new i(context, aVar, aVar2);
    }

    @Override // s2.a
    /* renamed from: b, reason: merged with bridge method [inline-methods] */
    public i get() {
        return c((Context) this.f4133a.get(), (u0.a) this.f4134b.get(), (u0.a) this.f4135c.get());
    }
}
