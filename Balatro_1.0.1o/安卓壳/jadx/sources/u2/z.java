package u2;

import a1.b2.c3;
import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/* JADX INFO: Access modifiers changed from: package-private */
/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class z extends y {
    public static Map d() {
        t tVar = t.f5021e;
        b3.f.c(tVar, c3.d4(759));
        return tVar;
    }

    public static final Map e(Map map) {
        b3.f.e(map, c3.d4(858));
        int size = map.size();
        return size != 0 ? size != 1 ? map : y.c(map) : d();
    }

    public static final void f(Map map, Iterable iterable) {
        b3.f.e(map, c3.d4(1397));
        b3.f.e(iterable, "pairs");
        Iterator it = iterable.iterator();
        while (it.hasNext()) {
            t2.h hVar = (t2.h) it.next();
            map.put(hVar.a(), hVar.b());
        }
    }

    public static Map g(Iterable iterable) {
        b3.f.e(iterable, "<this>");
        if (!(iterable instanceof Collection)) {
            return e(h(iterable, new LinkedHashMap()));
        }
        Collection collection = (Collection) iterable;
        int size = collection.size();
        if (size == 0) {
            return d();
        }
        if (size != 1) {
            return h(iterable, new LinkedHashMap(y.a(collection.size())));
        }
        return y.b((t2.h) (iterable instanceof List ? ((List) iterable).get(0) : iterable.iterator().next()));
    }

    public static final Map h(Iterable iterable, Map map) {
        b3.f.e(iterable, "<this>");
        b3.f.e(map, "destination");
        f(map, iterable);
        return map;
    }
}
