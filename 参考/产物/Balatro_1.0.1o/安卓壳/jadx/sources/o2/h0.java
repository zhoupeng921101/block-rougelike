package o2;

import java.util.HashMap;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class h0 extends HashMap {
    @Override // java.util.HashMap, java.util.AbstractMap, java.util.Map
    /* renamed from: f, reason: merged with bridge method [inline-methods] */
    public String put(String str, String str2) {
        if (l0.V(str2)) {
            return null;
        }
        return (String) super.put(str, str2);
    }
}
