package n0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class f {

    /* renamed from: c, reason: collision with root package name */
    private static final f f4239c = new a().a();

    /* renamed from: a, reason: collision with root package name */
    private final long f4240a;

    /* renamed from: b, reason: collision with root package name */
    private final long f4241b;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a {

        /* renamed from: a, reason: collision with root package name */
        private long f4242a = 0;

        /* renamed from: b, reason: collision with root package name */
        private long f4243b = 0;

        a() {
        }

        public f a() {
            return new f(this.f4242a, this.f4243b);
        }

        public a b(long j4) {
            this.f4243b = j4;
            return this;
        }

        public a c(long j4) {
            this.f4242a = j4;
            return this;
        }
    }

    f(long j4, long j5) {
        this.f4240a = j4;
        this.f4241b = j5;
    }

    public static a c() {
        return new a();
    }

    public long a() {
        return this.f4241b;
    }

    public long b() {
        return this.f4240a;
    }
}
