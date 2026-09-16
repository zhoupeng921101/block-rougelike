package b2;

import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class k extends i {

    /* renamed from: j, reason: collision with root package name */
    static final i f1811j = new k(new Object[0], 0);

    /* renamed from: h, reason: collision with root package name */
    final transient Object[] f1812h;

    /* renamed from: i, reason: collision with root package name */
    private final transient int f1813i;

    k(Object[] objArr, int i4) {
        this.f1812h = objArr;
        this.f1813i = i4;
    }

    @Override // b2.d
    final Object[] a() {
        return this.f1812h;
    }

    @Override // b2.d
    final int e() {
        return 0;
    }

    @Override // b2.d
    final int f() {
        return this.f1813i;
    }

    @Override // b2.i, b2.d
    final int g(Object[] objArr, int i4) {
        Object[] objArr2 = this.f1812h;
        int i5 = this.f1813i;
        System.arraycopy(objArr2, 0, objArr, 0, i5);
        return i5;
    }

    @Override // java.util.List
    public final Object get(int i4) {
        s.b(i4, this.f1813i, "index");
        Object obj = this.f1812h[i4];
        Objects.requireNonNull(obj);
        return obj;
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.util.List
    public final int size() {
        return this.f1813i;
    }
}
