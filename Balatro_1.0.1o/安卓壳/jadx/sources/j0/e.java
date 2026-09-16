package j0;

import j0.k;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class e extends k {

    /* renamed from: a, reason: collision with root package name */
    private final k.b f3732a;

    /* renamed from: b, reason: collision with root package name */
    private final j0.a f3733b;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static final class b extends k.a {

        /* renamed from: a, reason: collision with root package name */
        private k.b f3734a;

        /* renamed from: b, reason: collision with root package name */
        private j0.a f3735b;

        b() {
        }

        @Override // j0.k.a
        public k a() {
            return new e(this.f3734a, this.f3735b);
        }

        @Override // j0.k.a
        public k.a b(j0.a aVar) {
            this.f3735b = aVar;
            return this;
        }

        @Override // j0.k.a
        public k.a c(k.b bVar) {
            this.f3734a = bVar;
            return this;
        }
    }

    private e(k.b bVar, j0.a aVar) {
        this.f3732a = bVar;
        this.f3733b = aVar;
    }

    @Override // j0.k
    public j0.a b() {
        return this.f3733b;
    }

    @Override // j0.k
    public k.b c() {
        return this.f3732a;
    }

    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj instanceof k) {
            k kVar = (k) obj;
            k.b bVar = this.f3732a;
            if (bVar != null ? bVar.equals(kVar.c()) : kVar.c() == null) {
                j0.a aVar = this.f3733b;
                if (aVar != null ? aVar.equals(kVar.b()) : kVar.b() == null) {
                    return true;
                }
            }
        }
        return false;
    }

    public int hashCode() {
        k.b bVar = this.f3732a;
        int hashCode = ((bVar == null ? 0 : bVar.hashCode()) ^ 1000003) * 1000003;
        j0.a aVar = this.f3733b;
        return hashCode ^ (aVar != null ? aVar.hashCode() : 0);
    }

    public String toString() {
        return "ClientInfo{clientType=" + this.f3732a + ", androidClientInfo=" + this.f3733b + "}";
    }
}
