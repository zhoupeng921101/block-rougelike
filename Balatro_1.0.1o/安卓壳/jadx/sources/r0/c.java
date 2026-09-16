package r0;

import a1.b2.c3;
import java.util.Set;
import r0.f;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class c extends f.b {

    /* renamed from: a, reason: collision with root package name */
    private final long f4756a;

    /* renamed from: b, reason: collision with root package name */
    private final long f4757b;

    /* renamed from: c, reason: collision with root package name */
    private final Set f4758c;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static final class b extends f.b.a {

        /* renamed from: a, reason: collision with root package name */
        private Long f4759a;

        /* renamed from: b, reason: collision with root package name */
        private Long f4760b;

        /* renamed from: c, reason: collision with root package name */
        private Set f4761c;

        b() {
        }

        @Override // r0.f.b.a
        public f.b a() {
            String str = "";
            if (this.f4759a == null) {
                str = "" + c3.d4(175);
            }
            if (this.f4760b == null) {
                str = str + " maxAllowedDelay";
            }
            if (this.f4761c == null) {
                str = str + " flags";
            }
            if (str.isEmpty()) {
                return new c(this.f4759a.longValue(), this.f4760b.longValue(), this.f4761c);
            }
            throw new IllegalStateException("Missing required properties:" + str);
        }

        @Override // r0.f.b.a
        public f.b.a b(long j4) {
            this.f4759a = Long.valueOf(j4);
            return this;
        }

        @Override // r0.f.b.a
        public f.b.a c(Set set) {
            if (set == null) {
                throw new NullPointerException(c3.d4(1008));
            }
            this.f4761c = set;
            return this;
        }

        @Override // r0.f.b.a
        public f.b.a d(long j4) {
            this.f4760b = Long.valueOf(j4);
            return this;
        }
    }

    private c(long j4, long j5, Set set) {
        this.f4756a = j4;
        this.f4757b = j5;
        this.f4758c = set;
    }

    @Override // r0.f.b
    long b() {
        return this.f4756a;
    }

    @Override // r0.f.b
    Set c() {
        return this.f4758c;
    }

    @Override // r0.f.b
    long d() {
        return this.f4757b;
    }

    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj instanceof f.b) {
            f.b bVar = (f.b) obj;
            if (this.f4756a == bVar.b() && this.f4757b == bVar.d() && this.f4758c.equals(bVar.c())) {
                return true;
            }
        }
        return false;
    }

    public int hashCode() {
        long j4 = this.f4756a;
        int i4 = (((int) (j4 ^ (j4 >>> 32))) ^ 1000003) * 1000003;
        long j5 = this.f4757b;
        return ((i4 ^ ((int) ((j5 >>> 32) ^ j5))) * 1000003) ^ this.f4758c.hashCode();
    }

    public String toString() {
        return "ConfigValue{delta=" + this.f4756a + ", maxAllowedDelay=" + this.f4757b + ", flags=" + this.f4758c + c3.d4(495);
    }
}
