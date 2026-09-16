package i0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class a extends c {

    /* renamed from: a, reason: collision with root package name */
    private final Integer f3608a;

    /* renamed from: b, reason: collision with root package name */
    private final Object f3609b;

    /* renamed from: c, reason: collision with root package name */
    private final d f3610c;

    a(Integer num, Object obj, d dVar) {
        this.f3608a = num;
        if (obj == null) {
            throw new NullPointerException("Null payload");
        }
        this.f3609b = obj;
        if (dVar == null) {
            throw new NullPointerException("Null priority");
        }
        this.f3610c = dVar;
    }

    @Override // i0.c
    public Integer a() {
        return this.f3608a;
    }

    @Override // i0.c
    public Object b() {
        return this.f3609b;
    }

    @Override // i0.c
    public d c() {
        return this.f3610c;
    }

    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj instanceof c) {
            c cVar = (c) obj;
            Integer num = this.f3608a;
            if (num != null ? num.equals(cVar.a()) : cVar.a() == null) {
                if (this.f3609b.equals(cVar.b()) && this.f3610c.equals(cVar.c())) {
                    return true;
                }
            }
        }
        return false;
    }

    public int hashCode() {
        Integer num = this.f3608a;
        return (((((num == null ? 0 : num.hashCode()) ^ 1000003) * 1000003) ^ this.f3609b.hashCode()) * 1000003) ^ this.f3610c.hashCode();
    }

    public String toString() {
        return "Event{code=" + this.f3608a + ", payload=" + this.f3609b + ", priority=" + this.f3610c + "}";
    }
}
