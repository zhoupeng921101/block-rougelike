package b;

import a1.b2.c3;
import android.content.Context;
import android.content.Intent;
import b.a;
import b3.f;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;
import t2.h;
import t2.l;
import u2.g;
import u2.w;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class b extends b.a {

    /* renamed from: a, reason: collision with root package name */
    public static final a f1772a = new a(null);

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a {
        private a() {
        }

        public /* synthetic */ a(b3.d dVar) {
            this();
        }

        public final Intent a(String[] strArr) {
            f.e(strArr, c3.d4(1157));
            Intent putExtra = new Intent("androidx.activity.result.contract.action.REQUEST_PERMISSIONS").putExtra("androidx.activity.result.contract.extra.PERMISSIONS", strArr);
            f.d(putExtra, "Intent(ACTION_REQUEST_PE…EXTRA_PERMISSIONS, input)");
            return putExtra;
        }
    }

    @Override // b.a
    /* renamed from: d, reason: merged with bridge method [inline-methods] */
    public Intent a(Context context, String[] strArr) {
        f.e(context, "context");
        f.e(strArr, "input");
        return f1772a.a(strArr);
    }

    @Override // b.a
    /* renamed from: e, reason: merged with bridge method [inline-methods] */
    public a.C0031a b(Context context, String[] strArr) {
        f.e(context, "context");
        f.e(strArr, c3.d4(515));
        if (strArr.length == 0) {
            return new a.C0031a(w.d());
        }
        for (String str : strArr) {
            if (androidx.core.content.a.a(context, str) != 0) {
                return null;
            }
        }
        LinkedHashMap linkedHashMap = new LinkedHashMap(e3.d.a(w.a(strArr.length), 16));
        for (String str2 : strArr) {
            h a4 = l.a(str2, Boolean.TRUE);
            linkedHashMap.put(a4.c(), a4.d());
        }
        return new a.C0031a(linkedHashMap);
    }

    @Override // b.a
    /* renamed from: f, reason: merged with bridge method [inline-methods] */
    public Map c(int i4, Intent intent) {
        if (i4 == -1 && intent != null) {
            String[] stringArrayExtra = intent.getStringArrayExtra("androidx.activity.result.contract.extra.PERMISSIONS");
            int[] intArrayExtra = intent.getIntArrayExtra(c3.d4(235));
            if (intArrayExtra == null || stringArrayExtra == null) {
                return w.d();
            }
            ArrayList arrayList = new ArrayList(intArrayExtra.length);
            for (int i5 : intArrayExtra) {
                arrayList.add(Boolean.valueOf(i5 == 0));
            }
            return w.g(g.i(u2.a.b(stringArrayExtra), arrayList));
        }
        return w.d();
    }
}
