package e0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a {

    /* renamed from: a, reason: collision with root package name */
    private String f3128a;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: e0.a$a, reason: collision with other inner class name */
    public static final class C0040a {

        /* renamed from: a, reason: collision with root package name */
        private String f3129a;

        /* synthetic */ C0040a(l lVar) {
        }

        public a a() {
            String str = this.f3129a;
            if (str == null) {
                throw new IllegalArgumentException("Purchase token must be set");
            }
            a aVar = new a(null);
            aVar.f3128a = str;
            return aVar;
        }

        public C0040a b(String str) {
            this.f3129a = str;
            return this;
        }
    }

    /* synthetic */ a(l lVar) {
    }

    public static C0040a b() {
        return new C0040a(null);
    }

    public String a() {
        return this.f3128a;
    }
}
