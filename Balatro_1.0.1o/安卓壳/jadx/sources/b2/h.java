package b2;

import java.util.List;
import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class h extends i {

    /* renamed from: h, reason: collision with root package name */
    final transient int f1806h;

    /* renamed from: i, reason: collision with root package name */
    final transient int f1807i;

    /* renamed from: j, reason: collision with root package name */
    final /* synthetic */ i f1808j;

    h(i iVar, int i4, int i5) {
        Objects.requireNonNull(iVar);
        this.f1808j = iVar;
        this.f1806h = i4;
        this.f1807i = i5;
    }

    @Override // b2.d
    final Object[] a() {
        return this.f1808j.a();
    }

    @Override // b2.d
    final int e() {
        return this.f1808j.e() + this.f1806h;
    }

    @Override // b2.d
    final int f() {
        return this.f1808j.e() + this.f1806h + this.f1807i;
    }

    @Override // java.util.List
    public final Object get(int i4) {
        s.b(i4, this.f1807i, "index");
        return this.f1808j.get(i4 + this.f1806h);
    }

    @Override // b2.i
    /* renamed from: i */
    public final i subList(int i4, int i5) {
        s.d(i4, i5, this.f1807i);
        int i6 = this.f1806h;
        return this.f1808j.subList(i4 + i6, i5 + i6);
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.util.List
    public final int size() {
        return this.f1807i;
    }

    @Override // b2.i, java.util.List
    public final /* bridge */ /* synthetic */ List subList(int i4, int i5) {
        return subList(i4, i5);
    }
}
