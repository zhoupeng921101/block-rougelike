package c2;

import java.util.List;
import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class u1 extends v1 {

    /* renamed from: h, reason: collision with root package name */
    final transient int f2178h;

    /* renamed from: i, reason: collision with root package name */
    final transient int f2179i;

    /* renamed from: j, reason: collision with root package name */
    final /* synthetic */ v1 f2180j;

    u1(v1 v1Var, int i4, int i5) {
        Objects.requireNonNull(v1Var);
        this.f2180j = v1Var;
        this.f2178h = i4;
        this.f2179i = i5;
    }

    @Override // c2.r1
    final Object[] a() {
        return this.f2180j.a();
    }

    @Override // c2.r1
    final int e() {
        return this.f2180j.e() + this.f2178h;
    }

    @Override // c2.r1
    final int f() {
        return this.f2180j.e() + this.f2178h + this.f2179i;
    }

    @Override // java.util.List
    public final Object get(int i4) {
        j1.a(i4, this.f2179i, "index");
        return this.f2180j.get(i4 + this.f2178h);
    }

    @Override // c2.v1
    /* renamed from: h */
    public final v1 subList(int i4, int i5) {
        j1.c(i4, i5, this.f2179i);
        int i6 = this.f2178h;
        return this.f2180j.subList(i4 + i6, i5 + i6);
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.util.List
    public final int size() {
        return this.f2179i;
    }

    @Override // c2.v1, java.util.List
    public final /* bridge */ /* synthetic */ List subList(int i4, int i5) {
        return subList(i4, i5);
    }
}
