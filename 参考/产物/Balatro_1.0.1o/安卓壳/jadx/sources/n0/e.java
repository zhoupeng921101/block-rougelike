package n0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class e {

    /* renamed from: c, reason: collision with root package name */
    private static final e f4234c = new a().a();

    /* renamed from: a, reason: collision with root package name */
    private final long f4235a;

    /* renamed from: b, reason: collision with root package name */
    private final long f4236b;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a {

        /* renamed from: a, reason: collision with root package name */
        private long f4237a = 0;

        /* renamed from: b, reason: collision with root package name */
        private long f4238b = 0;

        a() {
        }

        public e a() {
            return new e(this.f4237a, this.f4238b);
        }

        public a b(long j4) {
            this.f4237a = j4;
            return this;
        }

        public a c(long j4) {
            this.f4238b = j4;
            return this;
        }
    }

    e(long j4, long j5) {
        this.f4235a = j4;
        this.f4236b = j5;
    }

    public static a c() {
        return new a();
    }

    public long a() {
        return this.f4235a;
    }

    public long b() {
        return this.f4236b;
    }
}
