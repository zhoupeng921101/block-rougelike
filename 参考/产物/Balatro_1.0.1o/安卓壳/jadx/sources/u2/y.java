package u2;

import java.util.Collections;
import java.util.Map;

/* JADX INFO: Access modifiers changed from: package-private */
/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class y extends x {
    public static int a(int i4) {
        if (i4 < 0) {
            return i4;
        }
        if (i4 < 3) {
            return i4 + 1;
        }
        if (i4 < 1073741824) {
            return (int) ((i4 / 0.75f) + 1.0f);
        }
        return Integer.MAX_VALUE;
    }

    public static final Map b(t2.h hVar) {
        b3.f.e(hVar, "pair");
        Map singletonMap = Collections.singletonMap(hVar.c(), hVar.d());
        b3.f.d(singletonMap, "singletonMap(pair.first, pair.second)");
        return singletonMap;
    }

    public static final Map c(Map map) {
        b3.f.e(map, "<this>");
        Map.Entry entry = (Map.Entry) map.entrySet().iterator().next();
        Map singletonMap = Collections.singletonMap(entry.getKey(), entry.getValue());
        b3.f.d(singletonMap, "with(entries.iterator().…ingletonMap(key, value) }");
        return singletonMap;
    }
}
