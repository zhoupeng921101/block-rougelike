package e0;

import a1.b2.c3;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class j {

    /* renamed from: a, reason: collision with root package name */
    private final String f3130a;

    /* renamed from: b, reason: collision with root package name */
    private final boolean f3131b;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public static class a {

        /* renamed from: a, reason: collision with root package name */
        private String f3132a;

        /* renamed from: b, reason: collision with root package name */
        private boolean f3133b = false;

        /* synthetic */ a(b0 b0Var) {
        }

        public j a() {
            String str = this.f3132a;
            if (str == null) {
                throw new IllegalArgumentException(c3.d4(739));
            }
            if (!this.f3133b || str.equals("subs")) {
                return new j(this, null);
            }
            throw new IllegalArgumentException("includeSuspendedSubscriptions is only supported for subscription purchases");
        }

        public a b(String str) {
            this.f3132a = str;
            return this;
        }
    }

    /* synthetic */ j(a aVar, b0 b0Var) {
        this.f3130a = aVar.f3132a;
        this.f3131b = aVar.f3133b;
    }

    public static a b() {
        return new a(null);
    }

    public boolean a() {
        return this.f3131b;
    }

    public final String c() {
        return this.f3130a;
    }
}
