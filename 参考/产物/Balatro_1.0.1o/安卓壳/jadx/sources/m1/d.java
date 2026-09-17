package m1;

import android.content.Context;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class d {

    /* renamed from: b, reason: collision with root package name */
    private static final d f4171b = new d();

    /* renamed from: a, reason: collision with root package name */
    private c f4172a = null;

    public static c a(Context context) {
        return f4171b.b(context);
    }

    public final synchronized c b(Context context) {
        try {
            if (this.f4172a == null) {
                if (context.getApplicationContext() != null) {
                    context = context.getApplicationContext();
                }
                this.f4172a = new c(context);
            }
        } catch (Throwable th) {
            throw th;
        }
        return this.f4172a;
    }
}
