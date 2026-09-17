package j0;

import a1.b2.c3;
import j0.l;
import java.util.Arrays;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class f extends l {

    /* renamed from: a, reason: collision with root package name */
    private final long f3736a;

    /* renamed from: b, reason: collision with root package name */
    private final Integer f3737b;

    /* renamed from: c, reason: collision with root package name */
    private final long f3738c;

    /* renamed from: d, reason: collision with root package name */
    private final byte[] f3739d;

    /* renamed from: e, reason: collision with root package name */
    private final String f3740e;

    /* renamed from: f, reason: collision with root package name */
    private final long f3741f;

    /* renamed from: g, reason: collision with root package name */
    private final o f3742g;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static final class b extends l.a {

        /* renamed from: a, reason: collision with root package name */
        private Long f3743a;

        /* renamed from: b, reason: collision with root package name */
        private Integer f3744b;

        /* renamed from: c, reason: collision with root package name */
        private Long f3745c;

        /* renamed from: d, reason: collision with root package name */
        private byte[] f3746d;

        /* renamed from: e, reason: collision with root package name */
        private String f3747e;

        /* renamed from: f, reason: collision with root package name */
        private Long f3748f;

        /* renamed from: g, reason: collision with root package name */
        private o f3749g;

        b() {
        }

        @Override // j0.l.a
        public l a() {
            String str = "";
            if (this.f3743a == null) {
                str = " eventTimeMs";
            }
            if (this.f3745c == null) {
                str = str + " eventUptimeMs";
            }
            if (this.f3748f == null) {
                str = str + c3.d4(1497);
            }
            if (str.isEmpty()) {
                return new f(this.f3743a.longValue(), this.f3744b, this.f3745c.longValue(), this.f3746d, this.f3747e, this.f3748f.longValue(), this.f3749g);
            }
            throw new IllegalStateException(c3.d4(293) + str);
        }

        @Override // j0.l.a
        public l.a b(Integer num) {
            this.f3744b = num;
            return this;
        }

        @Override // j0.l.a
        public l.a c(long j4) {
            this.f3743a = Long.valueOf(j4);
            return this;
        }

        @Override // j0.l.a
        public l.a d(long j4) {
            this.f3745c = Long.valueOf(j4);
            return this;
        }

        @Override // j0.l.a
        public l.a e(o oVar) {
            this.f3749g = oVar;
            return this;
        }

        @Override // j0.l.a
        l.a f(byte[] bArr) {
            this.f3746d = bArr;
            return this;
        }

        @Override // j0.l.a
        l.a g(String str) {
            this.f3747e = str;
            return this;
        }

        @Override // j0.l.a
        public l.a h(long j4) {
            this.f3748f = Long.valueOf(j4);
            return this;
        }
    }

    private f(long j4, Integer num, long j5, byte[] bArr, String str, long j6, o oVar) {
        this.f3736a = j4;
        this.f3737b = num;
        this.f3738c = j5;
        this.f3739d = bArr;
        this.f3740e = str;
        this.f3741f = j6;
        this.f3742g = oVar;
    }

    @Override // j0.l
    public Integer b() {
        return this.f3737b;
    }

    @Override // j0.l
    public long c() {
        return this.f3736a;
    }

    @Override // j0.l
    public long d() {
        return this.f3738c;
    }

    @Override // j0.l
    public o e() {
        return this.f3742g;
    }

    public boolean equals(Object obj) {
        Integer num;
        String str;
        o oVar;
        if (obj == this) {
            return true;
        }
        if (obj instanceof l) {
            l lVar = (l) obj;
            if (this.f3736a == lVar.c() && ((num = this.f3737b) != null ? num.equals(lVar.b()) : lVar.b() == null) && this.f3738c == lVar.d()) {
                if (Arrays.equals(this.f3739d, lVar instanceof f ? ((f) lVar).f3739d : lVar.f()) && ((str = this.f3740e) != null ? str.equals(lVar.g()) : lVar.g() == null) && this.f3741f == lVar.h() && ((oVar = this.f3742g) != null ? oVar.equals(lVar.e()) : lVar.e() == null)) {
                    return true;
                }
            }
        }
        return false;
    }

    @Override // j0.l
    public byte[] f() {
        return this.f3739d;
    }

    @Override // j0.l
    public String g() {
        return this.f3740e;
    }

    @Override // j0.l
    public long h() {
        return this.f3741f;
    }

    public int hashCode() {
        long j4 = this.f3736a;
        int i4 = (((int) (j4 ^ (j4 >>> 32))) ^ 1000003) * 1000003;
        Integer num = this.f3737b;
        int hashCode = num == null ? 0 : num.hashCode();
        long j5 = this.f3738c;
        int hashCode2 = (((((i4 ^ hashCode) * 1000003) ^ ((int) (j5 ^ (j5 >>> 32)))) * 1000003) ^ Arrays.hashCode(this.f3739d)) * 1000003;
        String str = this.f3740e;
        int hashCode3 = str == null ? 0 : str.hashCode();
        long j6 = this.f3741f;
        int i5 = (((hashCode2 ^ hashCode3) * 1000003) ^ ((int) ((j6 >>> 32) ^ j6))) * 1000003;
        o oVar = this.f3742g;
        return i5 ^ (oVar != null ? oVar.hashCode() : 0);
    }

    public String toString() {
        return "LogEvent{eventTimeMs=" + this.f3736a + ", eventCode=" + this.f3737b + ", eventUptimeMs=" + this.f3738c + ", sourceExtension=" + Arrays.toString(this.f3739d) + c3.d4(440) + this.f3740e + ", timezoneOffsetSeconds=" + this.f3741f + ", networkConnectionInfo=" + this.f3742g + "}";
    }
}
