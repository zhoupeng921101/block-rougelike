package f0;

import android.content.Context;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class b {

        /* renamed from: a, reason: collision with root package name */
        private final Context f3191a;

        private b(Context context) {
            this.f3191a = context;
        }

        public a a() {
            Context context = this.f3191a;
            if (context != null) {
                return new f0.b(context);
            }
            throw new IllegalArgumentException("Please provide a valid Context.");
        }
    }

    public static b d(Context context) {
        return new b(context);
    }

    public abstract void a();

    public abstract d b();

    public abstract boolean c();

    public abstract void e(c cVar);
}
