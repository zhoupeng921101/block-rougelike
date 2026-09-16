package androidx.lifecycle;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class a0 {

    /* renamed from: a, reason: collision with root package name */
    private final HashMap f1657a = new HashMap();

    public final void a() {
        Iterator it = this.f1657a.values().iterator();
        while (it.hasNext()) {
            ((x) it.next()).a();
        }
        this.f1657a.clear();
    }

    final x b(String str) {
        return (x) this.f1657a.get(str);
    }

    Set c() {
        return new HashSet(this.f1657a.keySet());
    }

    final void d(String str, x xVar) {
        x xVar2 = (x) this.f1657a.put(str, xVar);
        if (xVar2 != null) {
            xVar2.d();
        }
    }
}
