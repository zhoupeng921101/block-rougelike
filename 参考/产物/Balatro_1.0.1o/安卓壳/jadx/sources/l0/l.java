package l0;

import android.content.Context;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class l implements m0.b {

    /* renamed from: a, reason: collision with root package name */
    private final s2.a f4141a;

    /* renamed from: b, reason: collision with root package name */
    private final s2.a f4142b;

    public l(s2.a aVar, s2.a aVar2) {
        this.f4141a = aVar;
        this.f4142b = aVar2;
    }

    public static l a(s2.a aVar, s2.a aVar2) {
        return new l(aVar, aVar2);
    }

    public static k c(Context context, Object obj) {
        return new k(context, (i) obj);
    }

    @Override // s2.a
    /* renamed from: b, reason: merged with bridge method [inline-methods] */
    public k get() {
        return c((Context) this.f4141a.get(), this.f4142b.get());
    }
}
