package c2;

import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class w1 extends v1 {

    /* renamed from: j, reason: collision with root package name */
    static final v1 f2192j = new w1(new Object[0], 0);

    /* renamed from: h, reason: collision with root package name */
    final transient Object[] f2193h;

    /* renamed from: i, reason: collision with root package name */
    private final transient int f2194i;

    w1(Object[] objArr, int i4) {
        this.f2193h = objArr;
        this.f2194i = i4;
    }

    @Override // c2.r1
    final Object[] a() {
        return this.f2193h;
    }

    @Override // c2.r1
    final int e() {
        return 0;
    }

    @Override // c2.r1
    final int f() {
        return this.f2194i;
    }

    @Override // c2.v1, c2.r1
    final int g(Object[] objArr, int i4) {
        Object[] objArr2 = this.f2193h;
        int i5 = this.f2194i;
        System.arraycopy(objArr2, 0, objArr, 0, i5);
        return i5;
    }

    @Override // java.util.List
    public final Object get(int i4) {
        j1.a(i4, this.f2194i, "index");
        Object obj = this.f2193h[i4];
        Objects.requireNonNull(obj);
        return obj;
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.util.List
    public final int size() {
        return this.f2194i;
    }
}
