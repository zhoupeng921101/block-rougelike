package j0;

import a1.b2.c3;
import j0.m;
import java.util.List;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class g extends m {

    /* renamed from: a, reason: collision with root package name */
    private final long f3750a;

    /* renamed from: b, reason: collision with root package name */
    private final long f3751b;

    /* renamed from: c, reason: collision with root package name */
    private final k f3752c;

    /* renamed from: d, reason: collision with root package name */
    private final Integer f3753d;

    /* renamed from: e, reason: collision with root package name */
    private final String f3754e;

    /* renamed from: f, reason: collision with root package name */
    private final List f3755f;

    /* renamed from: g, reason: collision with root package name */
    private final p f3756g;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static final class b extends m.a {

        /* renamed from: a, reason: collision with root package name */
        private Long f3757a;

        /* renamed from: b, reason: collision with root package name */
        private Long f3758b;

        /* renamed from: c, reason: collision with root package name */
        private k f3759c;

        /* renamed from: d, reason: collision with root package name */
        private Integer f3760d;

        /* renamed from: e, reason: collision with root package name */
        private String f3761e;

        /* renamed from: f, reason: collision with root package name */
        private List f3762f;

        /* renamed from: g, reason: collision with root package name */
        private p f3763g;

        b() {
        }

        @Override // j0.m.a
        public m a() {
            String str = "";
            if (this.f3757a == null) {
                str = " requestTimeMs";
            }
            if (this.f3758b == null) {
                str = str + " requestUptimeMs";
            }
            if (str.isEmpty()) {
                return new g(this.f3757a.longValue(), this.f3758b.longValue(), this.f3759c, this.f3760d, this.f3761e, this.f3762f, this.f3763g);
            }
            throw new IllegalStateException("Missing required properties:" + str);
        }

        @Override // j0.m.a
        public m.a b(k kVar) {
            this.f3759c = kVar;
            return this;
        }

        @Override // j0.m.a
        public m.a c(List list) {
            this.f3762f = list;
            return this;
        }

        @Override // j0.m.a
        m.a d(Integer num) {
            this.f3760d = num;
            return this;
        }

        @Override // j0.m.a
        m.a e(String str) {
            this.f3761e = str;
            return this;
        }

        @Override // j0.m.a
        public m.a f(p pVar) {
            this.f3763g = pVar;
            return this;
        }

        @Override // j0.m.a
        public m.a g(long j4) {
            this.f3757a = Long.valueOf(j4);
            return this;
        }

        @Override // j0.m.a
        public m.a h(long j4) {
            this.f3758b = Long.valueOf(j4);
            return this;
        }
    }

    private g(long j4, long j5, k kVar, Integer num, String str, List list, p pVar) {
        this.f3750a = j4;
        this.f3751b = j5;
        this.f3752c = kVar;
        this.f3753d = num;
        this.f3754e = str;
        this.f3755f = list;
        this.f3756g = pVar;
    }

    @Override // j0.m
    public k b() {
        return this.f3752c;
    }

    @Override // j0.m
    public List c() {
        return this.f3755f;
    }

    @Override // j0.m
    public Integer d() {
        return this.f3753d;
    }

    @Override // j0.m
    public String e() {
        return this.f3754e;
    }

    public boolean equals(Object obj) {
        k kVar;
        Integer num;
        String str;
        List list;
        p pVar;
        if (obj == this) {
            return true;
        }
        if (obj instanceof m) {
            m mVar = (m) obj;
            if (this.f3750a == mVar.g() && this.f3751b == mVar.h() && ((kVar = this.f3752c) != null ? kVar.equals(mVar.b()) : mVar.b() == null) && ((num = this.f3753d) != null ? num.equals(mVar.d()) : mVar.d() == null) && ((str = this.f3754e) != null ? str.equals(mVar.e()) : mVar.e() == null) && ((list = this.f3755f) != null ? list.equals(mVar.c()) : mVar.c() == null) && ((pVar = this.f3756g) != null ? pVar.equals(mVar.f()) : mVar.f() == null)) {
                return true;
            }
        }
        return false;
    }

    @Override // j0.m
    public p f() {
        return this.f3756g;
    }

    @Override // j0.m
    public long g() {
        return this.f3750a;
    }

    @Override // j0.m
    public long h() {
        return this.f3751b;
    }

    public int hashCode() {
        long j4 = this.f3750a;
        long j5 = this.f3751b;
        int i4 = (((((int) (j4 ^ (j4 >>> 32))) ^ 1000003) * 1000003) ^ ((int) ((j5 >>> 32) ^ j5))) * 1000003;
        k kVar = this.f3752c;
        int hashCode = (i4 ^ (kVar == null ? 0 : kVar.hashCode())) * 1000003;
        Integer num = this.f3753d;
        int hashCode2 = (hashCode ^ (num == null ? 0 : num.hashCode())) * 1000003;
        String str = this.f3754e;
        int hashCode3 = (hashCode2 ^ (str == null ? 0 : str.hashCode())) * 1000003;
        List list = this.f3755f;
        int hashCode4 = (hashCode3 ^ (list == null ? 0 : list.hashCode())) * 1000003;
        p pVar = this.f3756g;
        return hashCode4 ^ (pVar != null ? pVar.hashCode() : 0);
    }

    public String toString() {
        return c3.d4(699) + this.f3750a + ", requestUptimeMs=" + this.f3751b + ", clientInfo=" + this.f3752c + ", logSource=" + this.f3753d + ", logSourceName=" + this.f3754e + ", logEvents=" + this.f3755f + ", qosTier=" + this.f3756g + c3.d4(1078);
    }
}
