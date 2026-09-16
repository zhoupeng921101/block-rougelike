package k;

import java.util.Collection;
import java.util.Map;
import java.util.Set;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class a extends g implements Map {

    /* renamed from: l, reason: collision with root package name */
    f f3840l;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: k.a$a, reason: collision with other inner class name */
    class C0054a extends f {
        C0054a() {
        }

        @Override // k.f
        protected void a() {
            a.this.clear();
        }

        @Override // k.f
        protected Object b(int i4, int i5) {
            return a.this.f3889f[(i4 << 1) + i5];
        }

        @Override // k.f
        protected Map c() {
            return a.this;
        }

        @Override // k.f
        protected int d() {
            return a.this.f3890g;
        }

        @Override // k.f
        protected int e(Object obj) {
            return a.this.f(obj);
        }

        @Override // k.f
        protected int f(Object obj) {
            return a.this.h(obj);
        }

        @Override // k.f
        protected void g(Object obj, Object obj2) {
            a.this.put(obj, obj2);
        }

        @Override // k.f
        protected void h(int i4) {
            a.this.j(i4);
        }

        @Override // k.f
        protected Object i(int i4, Object obj) {
            return a.this.k(i4, obj);
        }
    }

    public a() {
    }

    public a(int i4) {
        super(i4);
    }

    private f m() {
        if (this.f3840l == null) {
            this.f3840l = new C0054a();
        }
        return this.f3840l;
    }

    @Override // java.util.Map
    public Set entrySet() {
        return m().l();
    }

    @Override // java.util.Map
    public Set keySet() {
        return m().m();
    }

    public boolean n(Collection collection) {
        return f.p(this, collection);
    }

    @Override // java.util.Map
    public void putAll(Map map) {
        c(this.f3890g + map.size());
        for (Map.Entry entry : map.entrySet()) {
            put(entry.getKey(), entry.getValue());
        }
    }

    @Override // java.util.Map
    public Collection values() {
        return m().n();
    }
}
