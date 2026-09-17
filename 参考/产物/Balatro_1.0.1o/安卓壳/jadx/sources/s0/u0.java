package s0;

import android.content.Context;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class u0 implements m0.b {

    /* renamed from: a, reason: collision with root package name */
    private final s2.a f4947a;

    /* renamed from: b, reason: collision with root package name */
    private final s2.a f4948b;

    /* renamed from: c, reason: collision with root package name */
    private final s2.a f4949c;

    public u0(s2.a aVar, s2.a aVar2, s2.a aVar3) {
        this.f4947a = aVar;
        this.f4948b = aVar2;
        this.f4949c = aVar3;
    }

    public static u0 a(s2.a aVar, s2.a aVar2, s2.a aVar3) {
        return new u0(aVar, aVar2, aVar3);
    }

    public static t0 c(Context context, String str, int i4) {
        return new t0(context, str, i4);
    }

    @Override // s2.a
    /* renamed from: b, reason: merged with bridge method [inline-methods] */
    public t0 get() {
        return c((Context) this.f4947a.get(), (String) this.f4948b.get(), ((Integer) this.f4949c.get()).intValue());
    }
}
