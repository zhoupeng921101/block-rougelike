package androidx.activity;

import java.util.Iterator;
import java.util.concurrent.CopyOnWriteArrayList;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class h {

    /* renamed from: a, reason: collision with root package name */
    private boolean f70a;

    /* renamed from: b, reason: collision with root package name */
    private CopyOnWriteArrayList f71b = new CopyOnWriteArrayList();

    /* renamed from: c, reason: collision with root package name */
    private androidx.core.util.a f72c;

    public h(boolean z3) {
        this.f70a = z3;
    }

    void a(a aVar) {
        this.f71b.add(aVar);
    }

    public abstract void b();

    public final boolean c() {
        return this.f70a;
    }

    public final void d() {
        Iterator it = this.f71b.iterator();
        while (it.hasNext()) {
            ((a) it.next()).cancel();
        }
    }

    void e(a aVar) {
        this.f71b.remove(aVar);
    }

    public final void f(boolean z3) {
        this.f70a = z3;
        androidx.core.util.a aVar = this.f72c;
        if (aVar != null) {
            aVar.accept(Boolean.valueOf(z3));
        }
    }

    void g(androidx.core.util.a aVar) {
        this.f72c = aVar;
    }
}
