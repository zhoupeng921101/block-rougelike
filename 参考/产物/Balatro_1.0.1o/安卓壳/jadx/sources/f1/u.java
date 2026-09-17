package f1;

import com.google.android.gms.common.api.Status;
import com.google.android.gms.common.api.internal.BasePendingResult;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.WeakHashMap;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class u {

    /* renamed from: a, reason: collision with root package name */
    private final Map f3314a = Collections.synchronizedMap(new WeakHashMap());

    /* renamed from: b, reason: collision with root package name */
    private final Map f3315b = Collections.synchronizedMap(new WeakHashMap());

    private final void h(boolean z3, Status status) {
        HashMap hashMap;
        HashMap hashMap2;
        synchronized (this.f3314a) {
            hashMap = new HashMap(this.f3314a);
        }
        synchronized (this.f3315b) {
            hashMap2 = new HashMap(this.f3315b);
        }
        for (Map.Entry entry : hashMap.entrySet()) {
            if (z3 || ((Boolean) entry.getValue()).booleanValue()) {
                ((BasePendingResult) entry.getKey()).f(status);
            }
        }
        for (Map.Entry entry2 : hashMap2.entrySet()) {
            if (z3 || ((Boolean) entry2.getValue()).booleanValue()) {
                ((g2.i) entry2.getKey()).d(new e1.b(status));
            }
        }
    }

    final void c(BasePendingResult basePendingResult, boolean z3) {
        this.f3314a.put(basePendingResult, Boolean.valueOf(z3));
        basePendingResult.c(new s(this, basePendingResult));
    }

    final void d(g2.i iVar, boolean z3) {
        this.f3315b.put(iVar, Boolean.valueOf(z3));
        iVar.a().c(new t(this, iVar));
    }

    final void e(int i4, String str) {
        StringBuilder sb = new StringBuilder("The connection to Google Play services was lost");
        if (i4 == 1) {
            sb.append(" due to service disconnection.");
        } else if (i4 == 3) {
            sb.append(" due to dead object exception.");
        }
        if (str != null) {
            sb.append(" Last reason for disconnect: ");
            sb.append(str);
        }
        h(true, new Status(20, sb.toString()));
    }

    public final void f() {
        h(false, f.f3235p);
    }

    final boolean g() {
        return (this.f3314a.isEmpty() && this.f3315b.isEmpty()) ? false : true;
    }
}
