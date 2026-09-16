package v;

import a1.b2.c3;
import androidx.fragment.app.Fragment;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a extends g {

    /* renamed from: f, reason: collision with root package name */
    private final String f5023f;

    /* JADX WARN: 'super' call moved to the top of the method (can break code semantics) */
    public a(Fragment fragment, String str) {
        super(fragment, "Attempting to reuse fragment " + fragment + " with previous ID " + str);
        b3.f.e(fragment, c3.d4(660));
        b3.f.e(str, "previousFragmentId");
        this.f5023f = str;
    }
}
