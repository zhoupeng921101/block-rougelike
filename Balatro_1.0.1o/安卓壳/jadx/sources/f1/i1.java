package f1;

import android.content.Intent;
import android.os.Bundle;
import android.os.Looper;
import java.io.FileDescriptor;
import java.io.PrintWriter;
import java.util.Collections;
import java.util.Iterator;
import java.util.Map;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class i1 {

    /* renamed from: a, reason: collision with root package name */
    private final Map f3272a = Collections.synchronizedMap(new k.a());

    /* renamed from: b, reason: collision with root package name */
    private int f3273b = 0;

    /* renamed from: c, reason: collision with root package name */
    private Bundle f3274c;

    i1() {
    }

    final h a(String str, Class cls) {
        return (h) cls.cast(this.f3272a.get(str));
    }

    final void b(String str, h hVar) {
        Map map = this.f3272a;
        if (map.containsKey(str)) {
            StringBuilder sb = new StringBuilder(String.valueOf(str).length() + 59);
            sb.append("LifecycleCallback with tag ");
            sb.append(str);
            sb.append(" already added to this fragment.");
            throw new IllegalArgumentException(sb.toString());
        }
        map.put(str, hVar);
        if (this.f3273b > 0) {
            new b2.p(Looper.getMainLooper()).post(new h1(this, hVar, str));
        }
    }

    final void c(Bundle bundle) {
        this.f3273b = 1;
        this.f3274c = bundle;
        for (Map.Entry entry : this.f3272a.entrySet()) {
            ((h) entry.getValue()).f(bundle != null ? bundle.getBundle((String) entry.getKey()) : null);
        }
    }

    final void d() {
        this.f3273b = 2;
        Iterator it = this.f3272a.values().iterator();
        while (it.hasNext()) {
            ((h) it.next()).j();
        }
    }

    final void e() {
        this.f3273b = 3;
        Iterator it = this.f3272a.values().iterator();
        while (it.hasNext()) {
            ((h) it.next()).h();
        }
    }

    final void f(int i4, int i5, Intent intent) {
        Iterator it = this.f3272a.values().iterator();
        while (it.hasNext()) {
            ((h) it.next()).e(i4, i5, intent);
        }
    }

    final void g(Bundle bundle) {
        if (bundle == null) {
            return;
        }
        for (Map.Entry entry : this.f3272a.entrySet()) {
            Bundle bundle2 = new Bundle();
            ((h) entry.getValue()).i(bundle2);
            bundle.putBundle((String) entry.getKey(), bundle2);
        }
    }

    final void h() {
        this.f3273b = 4;
        Iterator it = this.f3272a.values().iterator();
        while (it.hasNext()) {
            ((h) it.next()).k();
        }
    }

    final void i() {
        this.f3273b = 5;
        Iterator it = this.f3272a.values().iterator();
        while (it.hasNext()) {
            ((h) it.next()).g();
        }
    }

    final void j(String str, FileDescriptor fileDescriptor, PrintWriter printWriter, String[] strArr) {
        Iterator it = this.f3272a.values().iterator();
        while (it.hasNext()) {
            ((h) it.next()).a(str, fileDescriptor, printWriter, strArr);
        }
    }

    final /* synthetic */ int k() {
        return this.f3273b;
    }

    final /* synthetic */ Bundle l() {
        return this.f3274c;
    }
}
