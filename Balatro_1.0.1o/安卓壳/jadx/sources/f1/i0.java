package f1;

import android.os.Looper;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class i0 extends w {

    /* renamed from: c, reason: collision with root package name */
    private final e1.e f3271c;

    public i0(e1.e eVar) {
        super("Method is not supported by connectionless client. APIs supporting connectionless client must not call this method.");
        this.f3271c = eVar;
    }

    @Override // e1.f
    public final com.google.android.gms.common.api.internal.a a(com.google.android.gms.common.api.internal.a aVar) {
        return this.f3271c.h(aVar);
    }

    @Override // e1.f
    public final Looper c() {
        return this.f3271c.o();
    }
}
