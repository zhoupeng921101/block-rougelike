package q1;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class t {

    /* renamed from: d, reason: collision with root package name */
    public static final t f4742d = new t(new s(null));

    /* renamed from: a, reason: collision with root package name */
    private final boolean f4743a;

    /* renamed from: b, reason: collision with root package name */
    private final boolean f4744b;

    /* renamed from: c, reason: collision with root package name */
    private final boolean f4745c;

    private t(s sVar) {
        this.f4743a = sVar.e();
        this.f4744b = sVar.f();
        this.f4745c = sVar.g();
    }

    /* synthetic */ t(s sVar, byte[] bArr) {
        this(sVar);
    }

    public static s d() {
        return new s(null);
    }

    public final boolean a() {
        return this.f4743a;
    }

    public final boolean b() {
        return this.f4744b;
    }

    public final boolean c() {
        return this.f4745c;
    }

    public final boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj != null && t.class == obj.getClass()) {
            t tVar = (t) obj;
            if (this.f4743a == tVar.f4743a && this.f4744b == tVar.f4744b && this.f4745c == tVar.f4745c) {
                return true;
            }
        }
        return false;
    }

    public final int hashCode() {
        return ((((this.f4743a ? 1 : 0) * 31) + (this.f4744b ? 1 : 0)) * 31) + (this.f4745c ? 1 : 0);
    }
}
