package r2;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import o2.g0;
import o2.l0;
import org.json.JSONArray;
import org.json.JSONObject;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class a {

    /* renamed from: a, reason: collision with root package name */
    private static final g0 f4869a = g0.f(a.class.getSimpleName());

    public static Map a(JSONObject jSONObject) {
        return jSONObject != JSONObject.NULL ? c(jSONObject) : new HashMap();
    }

    public static List b(JSONArray jSONArray) {
        ArrayList arrayList = new ArrayList();
        for (int i4 = 0; i4 < jSONArray.length(); i4++) {
            try {
                Object obj = jSONArray.get(i4);
                if (obj instanceof JSONArray) {
                    obj = b((JSONArray) obj);
                } else if (obj instanceof JSONObject) {
                    obj = c((JSONObject) obj);
                }
                arrayList.add(obj);
            } catch (Throwable th) {
                f4869a.a(l0.l(th));
                return arrayList;
            }
        }
        return arrayList;
    }

    public static Map c(JSONObject jSONObject) {
        HashMap hashMap = new HashMap();
        try {
            Iterator<String> keys = jSONObject.keys();
            while (keys.hasNext()) {
                String next = keys.next();
                Object obj = jSONObject.get(next);
                if (obj instanceof JSONArray) {
                    obj = b((JSONArray) obj);
                } else if (obj instanceof JSONObject) {
                    obj = c((JSONObject) obj);
                }
                hashMap.put(next, obj);
            }
            return hashMap;
        } catch (Throwable th) {
            f4869a.a(l0.l(th));
            return hashMap;
        }
    }
}
