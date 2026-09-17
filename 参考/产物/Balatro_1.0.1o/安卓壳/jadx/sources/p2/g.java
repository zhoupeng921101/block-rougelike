package p2;

import a1.b2.c3;
import android.content.Context;
import java.util.HashMap;
import java.util.Map;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class g {

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class a implements e {

        /* renamed from: a, reason: collision with root package name */
        final /* synthetic */ e f4681a;

        a(e eVar) {
            this.f4681a = eVar;
        }

        @Override // p2.e
        public void a(Map map) {
            if (map == null) {
                this.f4681a.a(null);
                return;
            }
            HashMap hashMap = new HashMap();
            for (Map.Entry entry : map.entrySet()) {
                hashMap.put(c3.d4(1349) + ((String) entry.getKey()), entry.getValue());
            }
            this.f4681a.a(hashMap);
        }
    }

    public void a(Context context, e eVar) {
        new f(context, "com.samsung.android.sdk.sinstallreferrer.api", new a(eVar)).j();
    }
}
