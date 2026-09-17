package f1;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class f0 {

    /* renamed from: a, reason: collision with root package name */
    private final b f3254a;

    /* renamed from: b, reason: collision with root package name */
    private final d1.c f3255b;

    /* synthetic */ f0(b bVar, d1.c cVar, e0 e0Var) {
        this.f3254a = bVar;
        this.f3255b = cVar;
    }

    public final boolean equals(Object obj) {
        if (obj != null && (obj instanceof f0)) {
            f0 f0Var = (f0) obj;
            if (h1.o.a(this.f3254a, f0Var.f3254a) && h1.o.a(this.f3255b, f0Var.f3255b)) {
                return true;
            }
        }
        return false;
    }

    public final int hashCode() {
        return h1.o.b(this.f3254a, this.f3255b);
    }

    public final String toString() {
        return h1.o.c(this).a("key", this.f3254a).a("feature", this.f3255b).toString();
    }
}
