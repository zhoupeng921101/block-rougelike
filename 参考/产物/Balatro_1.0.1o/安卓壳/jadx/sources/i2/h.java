package i2;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class h extends c {

    /* renamed from: i, reason: collision with root package name */
    static final c f3624i = new h(new Object[0], 0);

    /* renamed from: g, reason: collision with root package name */
    final transient Object[] f3625g;

    /* renamed from: h, reason: collision with root package name */
    private final transient int f3626h;

    h(Object[] objArr, int i4) {
        this.f3625g = objArr;
        this.f3626h = i4;
    }

    @Override // i2.c, i2.b
    int a(Object[] objArr, int i4) {
        System.arraycopy(this.f3625g, 0, objArr, i4, this.f3626h);
        return i4 + this.f3626h;
    }

    @Override // i2.b
    Object[] e() {
        return this.f3625g;
    }

    @Override // i2.b
    int f() {
        return this.f3626h;
    }

    @Override // i2.b
    int g() {
        return 0;
    }

    @Override // java.util.List
    public Object get(int i4) {
        h2.c.d(i4, this.f3626h);
        return this.f3625g[i4];
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.util.List
    public int size() {
        return this.f3626h;
    }
}
