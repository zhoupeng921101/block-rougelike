package f1;

import android.app.Activity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class g {

    /* renamed from: a, reason: collision with root package name */
    private final Object f3256a;

    public g(Activity activity) {
        h1.q.j(activity, "Activity must not be null");
        this.f3256a = activity;
    }

    public final boolean a() {
        return this.f3256a instanceof androidx.fragment.app.j;
    }

    public final boolean b() {
        return this.f3256a instanceof Activity;
    }

    public final Activity c() {
        return (Activity) this.f3256a;
    }

    public final androidx.fragment.app.j d() {
        return (androidx.fragment.app.j) this.f3256a;
    }
}
