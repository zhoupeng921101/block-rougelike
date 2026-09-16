package n0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class c {

    /* renamed from: c, reason: collision with root package name */
    private static final c f4215c = new a().a();

    /* renamed from: a, reason: collision with root package name */
    private final long f4216a;

    /* renamed from: b, reason: collision with root package name */
    private final b f4217b;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static final class a {

        /* renamed from: a, reason: collision with root package name */
        private long f4218a = 0;

        /* renamed from: b, reason: collision with root package name */
        private b f4219b = b.REASON_UNKNOWN;

        a() {
        }

        public c a() {
            return new c(this.f4218a, this.f4219b);
        }

        public a b(long j4) {
            this.f4218a = j4;
            return this;
        }

        public a c(b bVar) {
            this.f4219b = bVar;
            return this;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public enum b implements m2.c {
        REASON_UNKNOWN(0),
        MESSAGE_TOO_OLD(1),
        CACHE_FULL(2),
        f4223i(3),
        MAX_RETRIES_REACHED(4),
        INVALID_PAYLOD(5),
        f4226l(6);


        /* renamed from: e, reason: collision with root package name */
        private final int f4228e;

        b(int i4) {
            this.f4228e = i4;
        }

        @Override // m2.c
        public int a() {
            return this.f4228e;
        }
    }

    c(long j4, b bVar) {
        this.f4216a = j4;
        this.f4217b = bVar;
    }

    public static a c() {
        return new a();
    }

    public long a() {
        return this.f4216a;
    }

    public b b() {
        return this.f4217b;
    }
}
