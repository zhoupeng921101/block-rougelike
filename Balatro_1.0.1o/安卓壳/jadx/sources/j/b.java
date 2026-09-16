package j;

import java.util.Iterator;
import java.util.Map;
import java.util.WeakHashMap;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public class b implements Iterable {

    /* renamed from: e, reason: collision with root package name */
    c f3656e;

    /* renamed from: f, reason: collision with root package name */
    private c f3657f;

    /* renamed from: g, reason: collision with root package name */
    private WeakHashMap f3658g = new WeakHashMap();

    /* renamed from: h, reason: collision with root package name */
    private int f3659h = 0;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a extends e {
        a(c cVar, c cVar2) {
            super(cVar, cVar2);
        }

        @Override // j.b.e
        c c(c cVar) {
            return cVar.f3663h;
        }

        @Override // j.b.e
        c d(c cVar) {
            return cVar.f3662g;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    /* renamed from: j.b$b, reason: collision with other inner class name */
    private static class C0051b extends e {
        C0051b(c cVar, c cVar2) {
            super(cVar, cVar2);
        }

        @Override // j.b.e
        c c(c cVar) {
            return cVar.f3662g;
        }

        @Override // j.b.e
        c d(c cVar) {
            return cVar.f3663h;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class c implements Map.Entry {

        /* renamed from: e, reason: collision with root package name */
        final Object f3660e;

        /* renamed from: f, reason: collision with root package name */
        final Object f3661f;

        /* renamed from: g, reason: collision with root package name */
        c f3662g;

        /* renamed from: h, reason: collision with root package name */
        c f3663h;

        c(Object obj, Object obj2) {
            this.f3660e = obj;
            this.f3661f = obj2;
        }

        @Override // java.util.Map.Entry
        public boolean equals(Object obj) {
            if (obj == this) {
                return true;
            }
            if (!(obj instanceof c)) {
                return false;
            }
            c cVar = (c) obj;
            return this.f3660e.equals(cVar.f3660e) && this.f3661f.equals(cVar.f3661f);
        }

        @Override // java.util.Map.Entry
        public Object getKey() {
            return this.f3660e;
        }

        @Override // java.util.Map.Entry
        public Object getValue() {
            return this.f3661f;
        }

        @Override // java.util.Map.Entry
        public int hashCode() {
            return this.f3660e.hashCode() ^ this.f3661f.hashCode();
        }

        @Override // java.util.Map.Entry
        public Object setValue(Object obj) {
            throw new UnsupportedOperationException("An entry modification is not supported");
        }

        public String toString() {
            return this.f3660e + "=" + this.f3661f;
        }
    }

    /* JADX INFO: Access modifiers changed from: private */
    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    public class d implements Iterator, f {

        /* renamed from: e, reason: collision with root package name */
        private c f3664e;

        /* renamed from: f, reason: collision with root package name */
        private boolean f3665f = true;

        d() {
        }

        @Override // j.b.f
        public void b(c cVar) {
            c cVar2 = this.f3664e;
            if (cVar == cVar2) {
                c cVar3 = cVar2.f3663h;
                this.f3664e = cVar3;
                this.f3665f = cVar3 == null;
            }
        }

        @Override // java.util.Iterator
        /* renamed from: c, reason: merged with bridge method [inline-methods] */
        public Map.Entry next() {
            if (this.f3665f) {
                this.f3665f = false;
                this.f3664e = b.this.f3656e;
            } else {
                c cVar = this.f3664e;
                this.f3664e = cVar != null ? cVar.f3662g : null;
            }
            return this.f3664e;
        }

        @Override // java.util.Iterator
        public boolean hasNext() {
            if (this.f3665f) {
                return b.this.f3656e != null;
            }
            c cVar = this.f3664e;
            return (cVar == null || cVar.f3662g == null) ? false : true;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    private static abstract class e implements Iterator, f {

        /* renamed from: e, reason: collision with root package name */
        c f3667e;

        /* renamed from: f, reason: collision with root package name */
        c f3668f;

        e(c cVar, c cVar2) {
            this.f3667e = cVar2;
            this.f3668f = cVar;
        }

        private c f() {
            c cVar = this.f3668f;
            c cVar2 = this.f3667e;
            if (cVar == cVar2 || cVar2 == null) {
                return null;
            }
            return d(cVar);
        }

        @Override // j.b.f
        public void b(c cVar) {
            if (this.f3667e == cVar && cVar == this.f3668f) {
                this.f3668f = null;
                this.f3667e = null;
            }
            c cVar2 = this.f3667e;
            if (cVar2 == cVar) {
                this.f3667e = c(cVar2);
            }
            if (this.f3668f == cVar) {
                this.f3668f = f();
            }
        }

        abstract c c(c cVar);

        abstract c d(c cVar);

        @Override // java.util.Iterator
        /* renamed from: e, reason: merged with bridge method [inline-methods] */
        public Map.Entry next() {
            c cVar = this.f3668f;
            this.f3668f = f();
            return cVar;
        }

        @Override // java.util.Iterator
        public boolean hasNext() {
            return this.f3668f != null;
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    interface f {
        void b(c cVar);
    }

    public Map.Entry a() {
        return this.f3656e;
    }

    public Iterator descendingIterator() {
        C0051b c0051b = new C0051b(this.f3657f, this.f3656e);
        this.f3658g.put(c0051b, Boolean.FALSE);
        return c0051b;
    }

    protected c e(Object obj) {
        c cVar = this.f3656e;
        while (cVar != null && !cVar.f3660e.equals(obj)) {
            cVar = cVar.f3662g;
        }
        return cVar;
    }

    public boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (!(obj instanceof b)) {
            return false;
        }
        b bVar = (b) obj;
        if (size() != bVar.size()) {
            return false;
        }
        Iterator it = iterator();
        Iterator it2 = bVar.iterator();
        while (it.hasNext() && it2.hasNext()) {
            Map.Entry entry = (Map.Entry) it.next();
            Object next = it2.next();
            if ((entry == null && next != null) || (entry != null && !entry.equals(next))) {
                return false;
            }
        }
        return (it.hasNext() || it2.hasNext()) ? false : true;
    }

    public d f() {
        d dVar = new d();
        this.f3658g.put(dVar, Boolean.FALSE);
        return dVar;
    }

    public Map.Entry g() {
        return this.f3657f;
    }

    protected c h(Object obj, Object obj2) {
        c cVar = new c(obj, obj2);
        this.f3659h++;
        c cVar2 = this.f3657f;
        if (cVar2 == null) {
            this.f3656e = cVar;
            this.f3657f = cVar;
            return cVar;
        }
        cVar2.f3662g = cVar;
        cVar.f3663h = cVar2;
        this.f3657f = cVar;
        return cVar;
    }

    public int hashCode() {
        Iterator it = iterator();
        int i4 = 0;
        while (it.hasNext()) {
            i4 += ((Map.Entry) it.next()).hashCode();
        }
        return i4;
    }

    public Object i(Object obj, Object obj2) {
        c e4 = e(obj);
        if (e4 != null) {
            return e4.f3661f;
        }
        h(obj, obj2);
        return null;
    }

    @Override // java.lang.Iterable
    public Iterator iterator() {
        a aVar = new a(this.f3656e, this.f3657f);
        this.f3658g.put(aVar, Boolean.FALSE);
        return aVar;
    }

    public Object j(Object obj) {
        c e4 = e(obj);
        if (e4 == null) {
            return null;
        }
        this.f3659h--;
        if (!this.f3658g.isEmpty()) {
            Iterator it = this.f3658g.keySet().iterator();
            while (it.hasNext()) {
                ((f) it.next()).b(e4);
            }
        }
        c cVar = e4.f3663h;
        if (cVar != null) {
            cVar.f3662g = e4.f3662g;
        } else {
            this.f3656e = e4.f3662g;
        }
        c cVar2 = e4.f3662g;
        if (cVar2 != null) {
            cVar2.f3663h = cVar;
        } else {
            this.f3657f = cVar;
        }
        e4.f3662g = null;
        e4.f3663h = null;
        return e4.f3661f;
    }

    public int size() {
        return this.f3659h;
    }

    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        Iterator it = iterator();
        while (it.hasNext()) {
            sb.append(((Map.Entry) it.next()).toString());
            if (it.hasNext()) {
                sb.append(", ");
            }
        }
        sb.append("]");
        return sb.toString();
    }
}
