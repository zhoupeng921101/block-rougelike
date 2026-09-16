package t2;

import java.io.Serializable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class k implements d, Serializable {

    /* renamed from: e, reason: collision with root package name */
    private a3.a f4996e;

    /* renamed from: f, reason: collision with root package name */
    private volatile Object f4997f;

    /* renamed from: g, reason: collision with root package name */
    private final Object f4998g;

    public k(a3.a aVar, Object obj) {
        b3.f.e(aVar, "initializer");
        this.f4996e = aVar;
        this.f4997f = m.f4999a;
        this.f4998g = obj == null ? this : obj;
    }

    public /* synthetic */ k(a3.a aVar, Object obj, int i4, b3.d dVar) {
        this(aVar, (i4 & 2) != 0 ? null : obj);
    }

    public boolean a() {
        return this.f4997f != m.f4999a;
    }

    @Override // t2.d
    public Object getValue() {
        Object obj;
        Object obj2 = this.f4997f;
        m mVar = m.f4999a;
        if (obj2 != mVar) {
            return obj2;
        }
        synchronized (this.f4998g) {
            obj = this.f4997f;
            if (obj == mVar) {
                a3.a aVar = this.f4996e;
                b3.f.b(aVar);
                obj = aVar.a();
                this.f4997f = obj;
                this.f4996e = null;
            }
        }
        return obj;
    }

    public String toString() {
        return a() ? String.valueOf(getValue()) : "Lazy value not initialized yet.";
    }
}
