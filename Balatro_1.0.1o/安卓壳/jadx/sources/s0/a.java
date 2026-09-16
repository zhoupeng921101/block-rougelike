package s0;

import a1.b2.c3;
import s0.e;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class a extends e {

    /* renamed from: b, reason: collision with root package name */
    private final long f4876b;

    /* renamed from: c, reason: collision with root package name */
    private final int f4877c;

    /* renamed from: d, reason: collision with root package name */
    private final int f4878d;

    /* renamed from: e, reason: collision with root package name */
    private final long f4879e;

    /* renamed from: f, reason: collision with root package name */
    private final int f4880f;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static final class b extends e.a {

        /* renamed from: a, reason: collision with root package name */
        private Long f4881a;

        /* renamed from: b, reason: collision with root package name */
        private Integer f4882b;

        /* renamed from: c, reason: collision with root package name */
        private Integer f4883c;

        /* renamed from: d, reason: collision with root package name */
        private Long f4884d;

        /* renamed from: e, reason: collision with root package name */
        private Integer f4885e;

        b() {
        }

        @Override // s0.e.a
        e a() {
            Long l3 = this.f4881a;
            String d4 = c3.d4(1010);
            if (l3 == null) {
                d4 = d4 + " maxStorageSizeInBytes";
            }
            if (this.f4882b == null) {
                d4 = d4 + " loadBatchSize";
            }
            if (this.f4883c == null) {
                d4 = d4 + " criticalSectionEnterTimeoutMs";
            }
            if (this.f4884d == null) {
                d4 = d4 + c3.d4(855);
            }
            if (this.f4885e == null) {
                d4 = d4 + " maxBlobByteSizePerRow";
            }
            if (d4.isEmpty()) {
                return new a(this.f4881a.longValue(), this.f4882b.intValue(), this.f4883c.intValue(), this.f4884d.longValue(), this.f4885e.intValue());
            }
            throw new IllegalStateException("Missing required properties:" + d4);
        }

        @Override // s0.e.a
        e.a b(int i4) {
            this.f4883c = Integer.valueOf(i4);
            return this;
        }

        @Override // s0.e.a
        e.a c(long j4) {
            this.f4884d = Long.valueOf(j4);
            return this;
        }

        @Override // s0.e.a
        e.a d(int i4) {
            this.f4882b = Integer.valueOf(i4);
            return this;
        }

        @Override // s0.e.a
        e.a e(int i4) {
            this.f4885e = Integer.valueOf(i4);
            return this;
        }

        @Override // s0.e.a
        e.a f(long j4) {
            this.f4881a = Long.valueOf(j4);
            return this;
        }
    }

    private a(long j4, int i4, int i5, long j5, int i6) {
        this.f4876b = j4;
        this.f4877c = i4;
        this.f4878d = i5;
        this.f4879e = j5;
        this.f4880f = i6;
    }

    @Override // s0.e
    int b() {
        return this.f4878d;
    }

    @Override // s0.e
    long c() {
        return this.f4879e;
    }

    @Override // s0.e
    int d() {
        return this.f4877c;
    }

    @Override // s0.e
    int e() {
        return this.f4880f;
    }

    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (obj instanceof e) {
            e eVar = (e) obj;
            if (this.f4876b == eVar.f() && this.f4877c == eVar.d() && this.f4878d == eVar.b() && this.f4879e == eVar.c() && this.f4880f == eVar.e()) {
                return true;
            }
        }
        return false;
    }

    @Override // s0.e
    long f() {
        return this.f4876b;
    }

    public int hashCode() {
        long j4 = this.f4876b;
        int i4 = (((((((int) (j4 ^ (j4 >>> 32))) ^ 1000003) * 1000003) ^ this.f4877c) * 1000003) ^ this.f4878d) * 1000003;
        long j5 = this.f4879e;
        return ((i4 ^ ((int) ((j5 >>> 32) ^ j5))) * 1000003) ^ this.f4880f;
    }

    public String toString() {
        return "EventStoreConfig{maxStorageSizeInBytes=" + this.f4876b + ", loadBatchSize=" + this.f4877c + ", criticalSectionEnterTimeoutMs=" + this.f4878d + ", eventCleanUpAge=" + this.f4879e + ", maxBlobByteSizePerRow=" + this.f4880f + "}";
    }
}
