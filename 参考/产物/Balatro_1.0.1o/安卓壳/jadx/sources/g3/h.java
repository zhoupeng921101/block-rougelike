package g3;

import a1.b2.c3;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

/* JADX INFO: Access modifiers changed from: package-private */
/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class h extends g {
    public static final Collection c(b bVar, Collection collection) {
        b3.f.e(bVar, "<this>");
        b3.f.e(collection, "destination");
        Iterator it = bVar.iterator();
        while (it.hasNext()) {
            collection.add(it.next());
        }
        return collection;
    }

    public static List d(b bVar) {
        b3.f.e(bVar, "<this>");
        return u2.g.d(e(bVar));
    }

    public static final List e(b bVar) {
        b3.f.e(bVar, c3.d4(993));
        return (List) c(bVar, new ArrayList());
    }
}
