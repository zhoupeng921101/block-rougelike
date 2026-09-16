package k0;

import java.util.concurrent.Executor;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class k implements m0.b {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static final class a {

        /* renamed from: a, reason: collision with root package name */
        private static final k f3962a = new k();
    }

    public static k a() {
        return a.f3962a;
    }

    public static Executor b() {
        return (Executor) m0.d.c(j.a(), "Cannot return null from a non-@Nullable @Provides method");
    }

    @Override // s2.a
    /* renamed from: c, reason: merged with bridge method [inline-methods] */
    public Executor get() {
        return b();
    }
}
