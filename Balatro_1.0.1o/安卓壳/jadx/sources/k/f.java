package k;

import a1.b2.c3;
import java.lang.reflect.Array;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Set;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class f {

    /* renamed from: a, reason: collision with root package name */
    b f3869a;

    /* renamed from: b, reason: collision with root package name */
    c f3870b;

    /* renamed from: c, reason: collision with root package name */
    e f3871c;

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    final class a implements Iterator {

        /* renamed from: e, reason: collision with root package name */
        final int f3872e;

        /* renamed from: f, reason: collision with root package name */
        int f3873f;

        /* renamed from: g, reason: collision with root package name */
        int f3874g;

        /* renamed from: h, reason: collision with root package name */
        boolean f3875h = false;

        a(int i4) {
            this.f3872e = i4;
            this.f3873f = f.this.d();
        }

        @Override // java.util.Iterator
        public boolean hasNext() {
            return this.f3874g < this.f3873f;
        }

        @Override // java.util.Iterator
        public Object next() {
            if (!hasNext()) {
                throw new NoSuchElementException();
            }
            Object b4 = f.this.b(this.f3874g, this.f3872e);
            this.f3874g++;
            this.f3875h = true;
            return b4;
        }

        @Override // java.util.Iterator
        public void remove() {
            if (!this.f3875h) {
                throw new IllegalStateException();
            }
            int i4 = this.f3874g - 1;
            this.f3874g = i4;
            this.f3873f--;
            this.f3875h = false;
            f.this.h(i4);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    final class b implements Set {
        b() {
        }

        @Override // java.util.Set, java.util.Collection
        /* renamed from: a, reason: merged with bridge method [inline-methods] */
        public boolean add(Map.Entry entry) {
            throw new UnsupportedOperationException();
        }

        @Override // java.util.Set, java.util.Collection
        public boolean addAll(Collection collection) {
            int d4 = f.this.d();
            Iterator it = collection.iterator();
            while (it.hasNext()) {
                Map.Entry entry = (Map.Entry) it.next();
                f.this.g(entry.getKey(), entry.getValue());
            }
            return d4 != f.this.d();
        }

        @Override // java.util.Set, java.util.Collection
        public void clear() {
            f.this.a();
        }

        @Override // java.util.Set, java.util.Collection
        public boolean contains(Object obj) {
            if (!(obj instanceof Map.Entry)) {
                return false;
            }
            Map.Entry entry = (Map.Entry) obj;
            int e4 = f.this.e(entry.getKey());
            if (e4 < 0) {
                return false;
            }
            return k.c.c(f.this.b(e4, 1), entry.getValue());
        }

        @Override // java.util.Set, java.util.Collection
        public boolean containsAll(Collection collection) {
            Iterator it = collection.iterator();
            while (it.hasNext()) {
                if (!contains(it.next())) {
                    return false;
                }
            }
            return true;
        }

        @Override // java.util.Set, java.util.Collection
        public boolean equals(Object obj) {
            return f.k(this, obj);
        }

        @Override // java.util.Set, java.util.Collection
        public int hashCode() {
            int i4 = 0;
            for (int d4 = f.this.d() - 1; d4 >= 0; d4--) {
                Object b4 = f.this.b(d4, 0);
                Object b5 = f.this.b(d4, 1);
                i4 += (b4 == null ? 0 : b4.hashCode()) ^ (b5 == null ? 0 : b5.hashCode());
            }
            return i4;
        }

        @Override // java.util.Set, java.util.Collection
        public boolean isEmpty() {
            return f.this.d() == 0;
        }

        @Override // java.util.Set, java.util.Collection, java.lang.Iterable
        public Iterator iterator() {
            return f.this.new d();
        }

        @Override // java.util.Set, java.util.Collection
        public boolean remove(Object obj) {
            throw new UnsupportedOperationException();
        }

        @Override // java.util.Set, java.util.Collection
        public boolean removeAll(Collection collection) {
            throw new UnsupportedOperationException();
        }

        @Override // java.util.Set, java.util.Collection
        public boolean retainAll(Collection collection) {
            throw new UnsupportedOperationException();
        }

        @Override // java.util.Set, java.util.Collection
        public int size() {
            return f.this.d();
        }

        @Override // java.util.Set, java.util.Collection
        public Object[] toArray() {
            throw new UnsupportedOperationException();
        }

        @Override // java.util.Set, java.util.Collection
        public Object[] toArray(Object[] objArr) {
            throw new UnsupportedOperationException();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    final class c implements Set {
        c() {
        }

        @Override // java.util.Set, java.util.Collection
        public boolean add(Object obj) {
            throw new UnsupportedOperationException();
        }

        @Override // java.util.Set, java.util.Collection
        public boolean addAll(Collection collection) {
            throw new UnsupportedOperationException();
        }

        @Override // java.util.Set, java.util.Collection
        public void clear() {
            f.this.a();
        }

        @Override // java.util.Set, java.util.Collection
        public boolean contains(Object obj) {
            return f.this.e(obj) >= 0;
        }

        @Override // java.util.Set, java.util.Collection
        public boolean containsAll(Collection collection) {
            return f.j(f.this.c(), collection);
        }

        @Override // java.util.Set, java.util.Collection
        public boolean equals(Object obj) {
            return f.k(this, obj);
        }

        @Override // java.util.Set, java.util.Collection
        public int hashCode() {
            int i4 = 0;
            for (int d4 = f.this.d() - 1; d4 >= 0; d4--) {
                Object b4 = f.this.b(d4, 0);
                i4 += b4 == null ? 0 : b4.hashCode();
            }
            return i4;
        }

        @Override // java.util.Set, java.util.Collection
        public boolean isEmpty() {
            return f.this.d() == 0;
        }

        @Override // java.util.Set, java.util.Collection, java.lang.Iterable
        public Iterator iterator() {
            return f.this.new a(0);
        }

        @Override // java.util.Set, java.util.Collection
        public boolean remove(Object obj) {
            int e4 = f.this.e(obj);
            if (e4 < 0) {
                return false;
            }
            f.this.h(e4);
            return true;
        }

        @Override // java.util.Set, java.util.Collection
        public boolean removeAll(Collection collection) {
            return f.o(f.this.c(), collection);
        }

        @Override // java.util.Set, java.util.Collection
        public boolean retainAll(Collection collection) {
            return f.p(f.this.c(), collection);
        }

        @Override // java.util.Set, java.util.Collection
        public int size() {
            return f.this.d();
        }

        @Override // java.util.Set, java.util.Collection
        public Object[] toArray() {
            return f.this.q(0);
        }

        @Override // java.util.Set, java.util.Collection
        public Object[] toArray(Object[] objArr) {
            return f.this.r(objArr, 0);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    final class d implements Iterator, Map.Entry {

        /* renamed from: e, reason: collision with root package name */
        int f3879e;

        /* renamed from: g, reason: collision with root package name */
        boolean f3881g = false;

        /* renamed from: f, reason: collision with root package name */
        int f3880f = -1;

        d() {
            this.f3879e = f.this.d() - 1;
        }

        @Override // java.util.Iterator
        /* renamed from: b, reason: merged with bridge method [inline-methods] */
        public Map.Entry next() {
            if (!hasNext()) {
                throw new NoSuchElementException();
            }
            this.f3880f++;
            this.f3881g = true;
            return this;
        }

        @Override // java.util.Map.Entry
        public boolean equals(Object obj) {
            if (!this.f3881g) {
                throw new IllegalStateException("This container does not support retaining Map.Entry objects");
            }
            if (!(obj instanceof Map.Entry)) {
                return false;
            }
            Map.Entry entry = (Map.Entry) obj;
            return k.c.c(entry.getKey(), f.this.b(this.f3880f, 0)) && k.c.c(entry.getValue(), f.this.b(this.f3880f, 1));
        }

        @Override // java.util.Map.Entry
        public Object getKey() {
            if (this.f3881g) {
                return f.this.b(this.f3880f, 0);
            }
            throw new IllegalStateException("This container does not support retaining Map.Entry objects");
        }

        @Override // java.util.Map.Entry
        public Object getValue() {
            if (this.f3881g) {
                return f.this.b(this.f3880f, 1);
            }
            throw new IllegalStateException("This container does not support retaining Map.Entry objects");
        }

        @Override // java.util.Iterator
        public boolean hasNext() {
            return this.f3880f < this.f3879e;
        }

        @Override // java.util.Map.Entry
        public int hashCode() {
            if (!this.f3881g) {
                throw new IllegalStateException("This container does not support retaining Map.Entry objects");
            }
            Object b4 = f.this.b(this.f3880f, 0);
            Object b5 = f.this.b(this.f3880f, 1);
            return (b4 == null ? 0 : b4.hashCode()) ^ (b5 != null ? b5.hashCode() : 0);
        }

        @Override // java.util.Iterator
        public void remove() {
            if (!this.f3881g) {
                throw new IllegalStateException();
            }
            f.this.h(this.f3880f);
            this.f3880f--;
            this.f3879e--;
            this.f3881g = false;
        }

        @Override // java.util.Map.Entry
        public Object setValue(Object obj) {
            if (this.f3881g) {
                return f.this.i(this.f3880f, obj);
            }
            throw new IllegalStateException("This container does not support retaining Map.Entry objects");
        }

        public String toString() {
            return getKey() + c3.d4(441) + getValue();
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    final class e implements Collection {
        e() {
        }

        @Override // java.util.Collection
        public boolean add(Object obj) {
            throw new UnsupportedOperationException();
        }

        @Override // java.util.Collection
        public boolean addAll(Collection collection) {
            throw new UnsupportedOperationException();
        }

        @Override // java.util.Collection
        public void clear() {
            f.this.a();
        }

        @Override // java.util.Collection
        public boolean contains(Object obj) {
            return f.this.f(obj) >= 0;
        }

        @Override // java.util.Collection
        public boolean containsAll(Collection collection) {
            Iterator it = collection.iterator();
            while (it.hasNext()) {
                if (!contains(it.next())) {
                    return false;
                }
            }
            return true;
        }

        @Override // java.util.Collection
        public boolean isEmpty() {
            return f.this.d() == 0;
        }

        @Override // java.util.Collection, java.lang.Iterable
        public Iterator iterator() {
            return f.this.new a(1);
        }

        @Override // java.util.Collection
        public boolean remove(Object obj) {
            int f4 = f.this.f(obj);
            if (f4 < 0) {
                return false;
            }
            f.this.h(f4);
            return true;
        }

        @Override // java.util.Collection
        public boolean removeAll(Collection collection) {
            int d4 = f.this.d();
            int i4 = 0;
            boolean z3 = false;
            while (i4 < d4) {
                if (collection.contains(f.this.b(i4, 1))) {
                    f.this.h(i4);
                    i4--;
                    d4--;
                    z3 = true;
                }
                i4++;
            }
            return z3;
        }

        @Override // java.util.Collection
        public boolean retainAll(Collection collection) {
            int d4 = f.this.d();
            int i4 = 0;
            boolean z3 = false;
            while (i4 < d4) {
                if (!collection.contains(f.this.b(i4, 1))) {
                    f.this.h(i4);
                    i4--;
                    d4--;
                    z3 = true;
                }
                i4++;
            }
            return z3;
        }

        @Override // java.util.Collection
        public int size() {
            return f.this.d();
        }

        @Override // java.util.Collection
        public Object[] toArray() {
            return f.this.q(1);
        }

        @Override // java.util.Collection
        public Object[] toArray(Object[] objArr) {
            return f.this.r(objArr, 1);
        }
    }

    f() {
    }

    public static boolean j(Map map, Collection collection) {
        Iterator it = collection.iterator();
        while (it.hasNext()) {
            if (!map.containsKey(it.next())) {
                return false;
            }
        }
        return true;
    }

    public static boolean k(Set set, Object obj) {
        if (set == obj) {
            return true;
        }
        if (obj instanceof Set) {
            Set set2 = (Set) obj;
            try {
                if (set.size() == set2.size()) {
                    if (set.containsAll(set2)) {
                        return true;
                    }
                }
            } catch (ClassCastException | NullPointerException unused) {
            }
        }
        return false;
    }

    public static boolean o(Map map, Collection collection) {
        int size = map.size();
        Iterator it = collection.iterator();
        while (it.hasNext()) {
            map.remove(it.next());
        }
        return size != map.size();
    }

    public static boolean p(Map map, Collection collection) {
        int size = map.size();
        Iterator it = map.keySet().iterator();
        while (it.hasNext()) {
            if (!collection.contains(it.next())) {
                it.remove();
            }
        }
        return size != map.size();
    }

    protected abstract void a();

    protected abstract Object b(int i4, int i5);

    protected abstract Map c();

    protected abstract int d();

    protected abstract int e(Object obj);

    protected abstract int f(Object obj);

    protected abstract void g(Object obj, Object obj2);

    protected abstract void h(int i4);

    protected abstract Object i(int i4, Object obj);

    public Set l() {
        if (this.f3869a == null) {
            this.f3869a = new b();
        }
        return this.f3869a;
    }

    public Set m() {
        if (this.f3870b == null) {
            this.f3870b = new c();
        }
        return this.f3870b;
    }

    public Collection n() {
        if (this.f3871c == null) {
            this.f3871c = new e();
        }
        return this.f3871c;
    }

    public Object[] q(int i4) {
        int d4 = d();
        Object[] objArr = new Object[d4];
        for (int i5 = 0; i5 < d4; i5++) {
            objArr[i5] = b(i5, i4);
        }
        return objArr;
    }

    public Object[] r(Object[] objArr, int i4) {
        int d4 = d();
        if (objArr.length < d4) {
            objArr = (Object[]) Array.newInstance(objArr.getClass().getComponentType(), d4);
        }
        for (int i5 = 0; i5 < d4; i5++) {
            objArr[i5] = b(i5, i4);
        }
        if (objArr.length > d4) {
            objArr[d4] = null;
        }
        return objArr;
    }
}
