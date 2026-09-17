package j0;

import a1.b2.c3;
import j0.o;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class i extends o {

    /* renamed from: a, reason: collision with root package name */
    private final o.c f3765a;

    /* renamed from: b, reason: collision with root package name */
    private final o.b f3766b;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static final class b extends o.a {

        /* renamed from: a, reason: collision with root package name */
        private o.c f3767a;

        /* renamed from: b, reason: collision with root package name */
        private o.b f3768b;

        b() {
        }

        @Override // j0.o.a
        public o a() {
            return new i(this.f3767a, this.f3768b);
        }

        @Override // j0.o.a
        public o.a b(o.b bVar) {
            this.f3768b = bVar;
            return this;
        }

        @Override // j0.o.a
        public o.a c(o.c cVar) {
            this.f3767a = cVar;
            return this;
        }
    }

    private i(o.c cVar, o.b bVar) {
        this.f3765a = cVar;
        this.f3766b = bVar;
    }

    @Override // j0.o
    public o.b b() {
        return this.f3766b;
    }

    @Override // j0.o
    public o.c c() {
        return this.f3765a;
    }

    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj instanceof o) {
            o oVar = (o) obj;
            o.c cVar = this.f3765a;
            if (cVar != null ? cVar.equals(oVar.c()) : oVar.c() == null) {
                o.b bVar = this.f3766b;
                if (bVar != null ? bVar.equals(oVar.b()) : oVar.b() == null) {
                    return true;
                }
            }
        }
        return false;
    }

    public int hashCode() {
        o.c cVar = this.f3765a;
        int hashCode = ((cVar == null ? 0 : cVar.hashCode()) ^ 1000003) * 1000003;
        o.b bVar = this.f3766b;
        return hashCode ^ (bVar != null ? bVar.hashCode() : 0);
    }

    public String toString() {
        return "NetworkConnectionInfo{networkType=" + this.f3765a + c3.d4(795) + this.f3766b + "}";
    }
}
