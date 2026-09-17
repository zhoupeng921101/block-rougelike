package androidx.core.app;

import a1.b2.c3;
import android.os.Bundle;
import androidx.core.app.f;
import androidx.core.graphics.drawable.IconCompat;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class v {

    /* renamed from: a, reason: collision with root package name */
    private static final Object f840a = new Object();

    /* renamed from: b, reason: collision with root package name */
    private static final Object f841b = new Object();

    static Bundle a(f.a aVar) {
        Bundle bundle = new Bundle();
        IconCompat d4 = aVar.d();
        bundle.putInt("icon", d4 != null ? d4.c() : 0);
        bundle.putCharSequence(c3.d4(867), aVar.h());
        bundle.putParcelable(c3.d4(359), aVar.a());
        Bundle bundle2 = aVar.c() != null ? new Bundle(aVar.c()) : new Bundle();
        bundle2.putBoolean("android.support.allowGeneratedReplies", aVar.b());
        bundle.putBundle("extras", bundle2);
        bundle.putParcelableArray(c3.d4(1208), c(aVar.e()));
        bundle.putBoolean("showsUserInterface", aVar.g());
        bundle.putInt("semanticAction", aVar.f());
        return bundle;
    }

    private static Bundle b(a0 a0Var) {
        new Bundle();
        throw null;
    }

    private static Bundle[] c(a0[] a0VarArr) {
        if (a0VarArr == null) {
            return null;
        }
        Bundle[] bundleArr = new Bundle[a0VarArr.length];
        for (int i4 = 0; i4 < a0VarArr.length; i4++) {
            a0 a0Var = a0VarArr[i4];
            bundleArr[i4] = b(null);
        }
        return bundleArr;
    }
}
