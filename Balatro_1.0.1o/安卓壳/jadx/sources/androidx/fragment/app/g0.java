package androidx.fragment.app;

import android.view.View;
import java.util.ArrayList;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class g0 {

    /* renamed from: a, reason: collision with root package name */
    static final i0 f1474a = new h0();

    /* renamed from: b, reason: collision with root package name */
    static final i0 f1475b = b();

    static void a(Fragment fragment, Fragment fragment2, boolean z3, k.a aVar, boolean z4) {
        if (z3) {
            fragment2.w();
        } else {
            fragment.w();
        }
    }

    private static i0 b() {
        try {
            return (i0) Class.forName("androidx.transition.FragmentTransitionSupport").getDeclaredConstructor(null).newInstance(null);
        } catch (Exception unused) {
            return null;
        }
    }

    static void c(k.a aVar, k.a aVar2) {
        for (int size = aVar.size() - 1; size >= 0; size--) {
            if (!aVar2.containsKey((String) aVar.l(size))) {
                aVar.j(size);
            }
        }
    }

    static void d(ArrayList arrayList, int i4) {
        if (arrayList == null) {
            return;
        }
        for (int size = arrayList.size() - 1; size >= 0; size--) {
            ((View) arrayList.get(size)).setVisibility(i4);
        }
    }
}
