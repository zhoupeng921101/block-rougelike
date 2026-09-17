package k3;

import i3.u;
import java.util.Iterator;
import java.util.List;
import java.util.ServiceLoader;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class f {

    /* renamed from: a, reason: collision with root package name */
    public static final f f4003a;

    /* renamed from: b, reason: collision with root package name */
    public static final u f4004b;

    static {
        f fVar = new f();
        f4003a = fVar;
        k.e("kotlinx.coroutines.fast.service.loader", true);
        f4004b = fVar.a();
    }

    private f() {
    }

    private final u a() {
        Object next;
        try {
            List d4 = g3.c.d(g3.c.a(ServiceLoader.load(e.class, e.class.getClassLoader()).iterator()));
            Iterator it = d4.iterator();
            if (it.hasNext()) {
                next = it.next();
                if (it.hasNext()) {
                    int loadPriority = ((e) next).getLoadPriority();
                    do {
                        Object next2 = it.next();
                        int loadPriority2 = ((e) next2).getLoadPriority();
                        if (loadPriority < loadPriority2) {
                            next = next2;
                            loadPriority = loadPriority2;
                        }
                    } while (it.hasNext());
                }
            } else {
                next = null;
            }
            e eVar = (e) next;
            u e4 = eVar == null ? null : g.e(eVar, d4);
            if (e4 != null) {
                return e4;
            }
            g.b(null, null, 3, null);
            return null;
        } catch (Throwable th) {
            g.b(th, null, 2, null);
            return null;
        }
    }
}
