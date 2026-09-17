package androidx.fragment.app;

import android.os.Bundle;
import androidx.lifecycle.g;
import java.util.Map;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class FragmentManager$6 implements androidx.lifecycle.i {

    /* renamed from: a, reason: collision with root package name */
    final /* synthetic */ String f1320a;

    /* renamed from: b, reason: collision with root package name */
    final /* synthetic */ androidx.lifecycle.g f1321b;

    /* renamed from: c, reason: collision with root package name */
    final /* synthetic */ x f1322c;

    @Override // androidx.lifecycle.i
    public void g(androidx.lifecycle.k kVar, g.b bVar) {
        Map map;
        Map map2;
        if (bVar == g.b.ON_START) {
            map2 = this.f1322c.f1580k;
            if (((Bundle) map2.get(this.f1320a)) != null) {
                throw null;
            }
        }
        if (bVar == g.b.ON_DESTROY) {
            this.f1321b.c(this);
            map = this.f1322c.f1581l;
            map.remove(this.f1320a);
        }
    }
}
