package k0;

import a1.b2.c3;
import java.util.Map;
import k0.i;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class b extends i {

    /* renamed from: a, reason: collision with root package name */
    private final String f3918a;

    /* renamed from: b, reason: collision with root package name */
    private final Integer f3919b;

    /* renamed from: c, reason: collision with root package name */
    private final h f3920c;

    /* renamed from: d, reason: collision with root package name */
    private final long f3921d;

    /* renamed from: e, reason: collision with root package name */
    private final long f3922e;

    /* renamed from: f, reason: collision with root package name */
    private final Map f3923f;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: k0.b$b, reason: collision with other inner class name */
    static final class C0056b extends i.a {

        /* renamed from: a, reason: collision with root package name */
        private String f3924a;

        /* renamed from: b, reason: collision with root package name */
        private Integer f3925b;

        /* renamed from: c, reason: collision with root package name */
        private h f3926c;

        /* renamed from: d, reason: collision with root package name */
        private Long f3927d;

        /* renamed from: e, reason: collision with root package name */
        private Long f3928e;

        /* renamed from: f, reason: collision with root package name */
        private Map f3929f;

        C0056b() {
        }

        @Override // k0.i.a
        public i d() {
            String str = "";
            if (this.f3924a == null) {
                str = " transportName";
            }
            if (this.f3926c == null) {
                str = str + " encodedPayload";
            }
            if (this.f3927d == null) {
                str = str + " eventMillis";
            }
            if (this.f3928e == null) {
                str = str + " uptimeMillis";
            }
            if (this.f3929f == null) {
                str = str + " autoMetadata";
            }
            if (str.isEmpty()) {
                return new b(this.f3924a, this.f3925b, this.f3926c, this.f3927d.longValue(), this.f3928e.longValue(), this.f3929f);
            }
            throw new IllegalStateException(c3.d4(260) + str);
        }

        @Override // k0.i.a
        protected Map e() {
            Map map = this.f3929f;
            if (map != null) {
                return map;
            }
            throw new IllegalStateException("Property \"autoMetadata\" has not been set");
        }

        @Override // k0.i.a
        protected i.a f(Map map) {
            if (map == null) {
                throw new NullPointerException("Null autoMetadata");
            }
            this.f3929f = map;
            return this;
        }

        @Override // k0.i.a
        public i.a g(Integer num) {
            this.f3925b = num;
            return this;
        }

        @Override // k0.i.a
        public i.a h(h hVar) {
            if (hVar == null) {
                throw new NullPointerException("Null encodedPayload");
            }
            this.f3926c = hVar;
            return this;
        }

        @Override // k0.i.a
        public i.a i(long j4) {
            this.f3927d = Long.valueOf(j4);
            return this;
        }

        @Override // k0.i.a
        public i.a j(String str) {
            if (str == null) {
                throw new NullPointerException("Null transportName");
            }
            this.f3924a = str;
            return this;
        }

        @Override // k0.i.a
        public i.a k(long j4) {
            this.f3928e = Long.valueOf(j4);
            return this;
        }
    }

    private b(String str, Integer num, h hVar, long j4, long j5, Map map) {
        this.f3918a = str;
        this.f3919b = num;
        this.f3920c = hVar;
        this.f3921d = j4;
        this.f3922e = j5;
        this.f3923f = map;
    }

    @Override // k0.i
    protected Map c() {
        return this.f3923f;
    }

    @Override // k0.i
    public Integer d() {
        return this.f3919b;
    }

    @Override // k0.i
    public h e() {
        return this.f3920c;
    }

    public boolean equals(Object obj) {
        Integer num;
        if (obj == this) {
            return true;
        }
        if (obj instanceof i) {
            i iVar = (i) obj;
            if (this.f3918a.equals(iVar.j()) && ((num = this.f3919b) != null ? num.equals(iVar.d()) : iVar.d() == null) && this.f3920c.equals(iVar.e()) && this.f3921d == iVar.f() && this.f3922e == iVar.k() && this.f3923f.equals(iVar.c())) {
                return true;
            }
        }
        return false;
    }

    @Override // k0.i
    public long f() {
        return this.f3921d;
    }

    public int hashCode() {
        int hashCode = (this.f3918a.hashCode() ^ 1000003) * 1000003;
        Integer num = this.f3919b;
        int hashCode2 = (((hashCode ^ (num == null ? 0 : num.hashCode())) * 1000003) ^ this.f3920c.hashCode()) * 1000003;
        long j4 = this.f3921d;
        int i4 = (hashCode2 ^ ((int) (j4 ^ (j4 >>> 32)))) * 1000003;
        long j5 = this.f3922e;
        return ((i4 ^ ((int) (j5 ^ (j5 >>> 32)))) * 1000003) ^ this.f3923f.hashCode();
    }

    @Override // k0.i
    public String j() {
        return this.f3918a;
    }

    @Override // k0.i
    public long k() {
        return this.f3922e;
    }

    public String toString() {
        return "EventInternal{transportName=" + this.f3918a + ", code=" + this.f3919b + ", encodedPayload=" + this.f3920c + ", eventMillis=" + this.f3921d + ", uptimeMillis=" + this.f3922e + ", autoMetadata=" + this.f3923f + "}";
    }
}
