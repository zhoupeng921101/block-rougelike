package v;

import androidx.fragment.app.Fragment;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class g extends RuntimeException {

    /* renamed from: e, reason: collision with root package name */
    private final Fragment f5042e;

    /* JADX WARN: 'super' call moved to the top of the method (can break code semantics) */
    public g(Fragment fragment, String str) {
        super(str);
        b3.f.e(fragment, "fragment");
        this.f5042e = fragment;
    }

    public final Fragment a() {
        return this.f5042e;
    }
}
