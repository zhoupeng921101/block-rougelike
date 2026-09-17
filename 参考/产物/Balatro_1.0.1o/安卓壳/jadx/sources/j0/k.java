package j0;

import j0.e;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class k {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static abstract class a {
        public abstract k a();

        public abstract a b(j0.a aVar);

        public abstract a c(b bVar);
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public enum b {
        UNKNOWN(0),
        ANDROID_FIREBASE(23);


        /* renamed from: e, reason: collision with root package name */
        private final int f3772e;

        b(int i4) {
            this.f3772e = i4;
        }
    }

    public static a a() {
        return new e.b();
    }

    public abstract j0.a b();

    public abstract b c();
}
