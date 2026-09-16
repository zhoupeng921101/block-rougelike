package androidx.lifecycle;

import androidx.lifecycle.a;
import androidx.lifecycle.g;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
@Deprecated
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class ReflectiveGenericLifecycleObserver implements i {

    /* renamed from: a, reason: collision with root package name */
    private final Object f1646a;

    /* renamed from: b, reason: collision with root package name */
    private final a.C0020a f1647b;

    ReflectiveGenericLifecycleObserver(Object obj) {
        this.f1646a = obj;
        this.f1647b = a.f1650c.c(obj.getClass());
    }

    @Override // androidx.lifecycle.i
    public void g(k kVar, g.b bVar) {
        this.f1647b.a(kVar, bVar, this.f1646a);
    }
}
