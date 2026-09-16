package m0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a implements s2.a {

    /* renamed from: c, reason: collision with root package name */
    private static final Object f4163c = new Object();

    /* renamed from: a, reason: collision with root package name */
    private volatile s2.a f4164a;

    /* renamed from: b, reason: collision with root package name */
    private volatile Object f4165b = f4163c;

    private a(s2.a aVar) {
        this.f4164a = aVar;
    }

    public static s2.a a(s2.a aVar) {
        d.b(aVar);
        return aVar instanceof a ? aVar : new a(aVar);
    }

    public static Object b(Object obj, Object obj2) {
        if (obj == f4163c || obj == obj2) {
            return obj2;
        }
        throw new IllegalStateException("Scoped provider was invoked recursively returning different results: " + obj + " & " + obj2 + ". This is likely due to a circular dependency.");
    }

    @Override // s2.a
    public Object get() {
        Object obj;
        Object obj2 = this.f4165b;
        Object obj3 = f4163c;
        if (obj2 != obj3) {
            return obj2;
        }
        synchronized (this) {
            try {
                obj = this.f4165b;
                if (obj == obj3) {
                    obj = this.f4164a.get();
                    this.f4165b = b(this.f4165b, obj);
                    this.f4164a = null;
                }
            } catch (Throwable th) {
                throw th;
            }
        }
        return obj;
    }
}
