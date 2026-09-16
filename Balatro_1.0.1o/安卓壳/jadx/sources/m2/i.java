package m2;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
class i implements j2.g {

    /* renamed from: a, reason: collision with root package name */
    private boolean f4199a = false;

    /* renamed from: b, reason: collision with root package name */
    private boolean f4200b = false;

    /* renamed from: c, reason: collision with root package name */
    private j2.c f4201c;

    /* renamed from: d, reason: collision with root package name */
    private final f f4202d;

    i(f fVar) {
        this.f4202d = fVar;
    }

    private void b() {
        if (this.f4199a) {
            throw new j2.b("Cannot encode a second value in the ValueEncoderContext");
        }
        this.f4199a = true;
    }

    @Override // j2.g
    public j2.g a(String str) {
        b();
        this.f4202d.f(this.f4201c, str, this.f4200b);
        return this;
    }

    @Override // j2.g
    public j2.g c(boolean z3) {
        b();
        this.f4202d.k(this.f4201c, z3, this.f4200b);
        return this;
    }

    void d(j2.c cVar, boolean z3) {
        this.f4199a = false;
        this.f4201c = cVar;
        this.f4200b = z3;
    }
}
