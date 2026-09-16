package t1;

import android.content.Intent;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class c {

    /* renamed from: a, reason: collision with root package name */
    private final boolean f4990a;

    /* renamed from: b, reason: collision with root package name */
    private final Intent f4991b;

    private c(boolean z3, Intent intent) {
        this.f4990a = z3;
        this.f4991b = intent;
    }

    public static c a(Intent intent) {
        return new c(true, intent);
    }

    public static c b(Intent intent) {
        return new c(false, intent);
    }

    public final boolean c() {
        return this.f4990a;
    }

    public final Intent d() {
        return this.f4991b;
    }
}
