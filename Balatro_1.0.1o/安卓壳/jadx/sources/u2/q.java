package u2;

import a1.b2.c3;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;

/* JADX INFO: Access modifiers changed from: package-private */
/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class q extends p {
    public static boolean g(Iterable iterable, Object obj) {
        b3.f.e(iterable, "<this>");
        return iterable instanceof Collection ? ((Collection) iterable).contains(obj) : h(iterable, obj) >= 0;
    }

    public static final int h(Iterable iterable, Object obj) {
        b3.f.e(iterable, "<this>");
        if (iterable instanceof List) {
            return ((List) iterable).indexOf(obj);
        }
        int i4 = 0;
        for (Object obj2 : iterable) {
            if (i4 < 0) {
                i.e();
            }
            if (b3.f.a(obj, obj2)) {
                return i4;
            }
            i4++;
        }
        return -1;
    }

    public static List i(Iterable iterable, Iterable iterable2) {
        b3.f.e(iterable, "<this>");
        b3.f.e(iterable2, c3.d4(1055));
        Iterator it = iterable.iterator();
        Iterator it2 = iterable2.iterator();
        ArrayList arrayList = new ArrayList(Math.min(j.f(iterable, 10), j.f(iterable2, 10)));
        while (it.hasNext() && it2.hasNext()) {
            arrayList.add(t2.l.a(it.next(), it2.next()));
        }
        return arrayList;
    }
}
