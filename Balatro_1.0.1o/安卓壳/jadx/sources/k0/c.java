package k0;

import a1.b2.c3;
import k0.n;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class c extends n {

    /* renamed from: a, reason: collision with root package name */
    private final o f3930a;

    /* renamed from: b, reason: collision with root package name */
    private final String f3931b;

    /* renamed from: c, reason: collision with root package name */
    private final i0.c f3932c;

    /* renamed from: d, reason: collision with root package name */
    private final i0.e f3933d;

    /* renamed from: e, reason: collision with root package name */
    private final i0.b f3934e;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static final class b extends n.a {

        /* renamed from: a, reason: collision with root package name */
        private o f3935a;

        /* renamed from: b, reason: collision with root package name */
        private String f3936b;

        /* renamed from: c, reason: collision with root package name */
        private i0.c f3937c;

        /* renamed from: d, reason: collision with root package name */
        private i0.e f3938d;

        /* renamed from: e, reason: collision with root package name */
        private i0.b f3939e;

        b() {
        }

        @Override // k0.n.a
        public n a() {
            String str = "";
            if (this.f3935a == null) {
                str = " transportContext";
            }
            if (this.f3936b == null) {
                str = str + " transportName";
            }
            if (this.f3937c == null) {
                str = str + c3.d4(583);
            }
            if (this.f3938d == null) {
                str = str + c3.d4(158);
            }
            if (this.f3939e == null) {
                str = str + " encoding";
            }
            if (str.isEmpty()) {
                return new c(this.f3935a, this.f3936b, this.f3937c, this.f3938d, this.f3939e);
            }
            throw new IllegalStateException("Missing required properties:" + str);
        }

        @Override // k0.n.a
        n.a b(i0.b bVar) {
            if (bVar == null) {
                throw new NullPointerException("Null encoding");
            }
            this.f3939e = bVar;
            return this;
        }

        @Override // k0.n.a
        n.a c(i0.c cVar) {
            if (cVar == null) {
                throw new NullPointerException("Null event");
            }
            this.f3937c = cVar;
            return this;
        }

        @Override // k0.n.a
        n.a d(i0.e eVar) {
            if (eVar == null) {
                throw new NullPointerException(c3.d4(584));
            }
            this.f3938d = eVar;
            return this;
        }

        @Override // k0.n.a
        public n.a e(o oVar) {
            if (oVar == null) {
                throw new NullPointerException("Null transportContext");
            }
            this.f3935a = oVar;
            return this;
        }

        @Override // k0.n.a
        public n.a f(String str) {
            if (str == null) {
                throw new NullPointerException(c3.d4(343));
            }
            this.f3936b = str;
            return this;
        }
    }

    private c(o oVar, String str, i0.c cVar, i0.e eVar, i0.b bVar) {
        this.f3930a = oVar;
        this.f3931b = str;
        this.f3932c = cVar;
        this.f3933d = eVar;
        this.f3934e = bVar;
    }

    @Override // k0.n
    public i0.b b() {
        return this.f3934e;
    }

    @Override // k0.n
    i0.c c() {
        return this.f3932c;
    }

    @Override // k0.n
    i0.e e() {
        return this.f3933d;
    }

    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj instanceof n) {
            n nVar = (n) obj;
            if (this.f3930a.equals(nVar.f()) && this.f3931b.equals(nVar.g()) && this.f3932c.equals(nVar.c()) && this.f3933d.equals(nVar.e()) && this.f3934e.equals(nVar.b())) {
                return true;
            }
        }
        return false;
    }

    @Override // k0.n
    public o f() {
        return this.f3930a;
    }

    @Override // k0.n
    public String g() {
        return this.f3931b;
    }

    public int hashCode() {
        return ((((((((this.f3930a.hashCode() ^ 1000003) * 1000003) ^ this.f3931b.hashCode()) * 1000003) ^ this.f3932c.hashCode()) * 1000003) ^ this.f3933d.hashCode()) * 1000003) ^ this.f3934e.hashCode();
    }

    public String toString() {
        return "SendRequest{transportContext=" + this.f3930a + ", transportName=" + this.f3931b + ", event=" + this.f3932c + c3.d4(124) + this.f3933d + ", encoding=" + this.f3934e + "}";
    }
}
