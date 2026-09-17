package i2;

import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.RandomAccess;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class c extends i2.b implements List, RandomAccess {

    /* renamed from: f, reason: collision with root package name */
    private static final j f3619f = new a(h.f3624i, 0);

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    static class a extends i2.a {

        /* renamed from: g, reason: collision with root package name */
        private final c f3620g;

        a(c cVar, int i4) {
            super(cVar.size(), i4);
            this.f3620g = cVar;
        }

        @Override // i2.a
        protected Object b(int i4) {
            return this.f3620g.get(i4);
        }
    }

    /* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
    class b extends c {

        /* renamed from: g, reason: collision with root package name */
        final transient int f3621g;

        /* renamed from: h, reason: collision with root package name */
        final transient int f3622h;

        b(int i4, int i5) {
            this.f3621g = i4;
            this.f3622h = i5;
        }

        @Override // i2.b
        Object[] e() {
            return c.this.e();
        }

        @Override // i2.b
        int f() {
            return c.this.g() + this.f3621g + this.f3622h;
        }

        @Override // i2.b
        int g() {
            return c.this.g() + this.f3621g;
        }

        @Override // java.util.List
        public Object get(int i4) {
            h2.c.d(i4, this.f3622h);
            return c.this.get(i4 + this.f3621g);
        }

        @Override // i2.c, java.util.AbstractCollection, java.util.Collection, java.lang.Iterable, java.util.List
        public /* bridge */ /* synthetic */ Iterator iterator() {
            return super.iterator();
        }

        @Override // i2.c, java.util.List
        public /* bridge */ /* synthetic */ ListIterator listIterator() {
            return super.listIterator();
        }

        @Override // i2.c, java.util.List
        public /* bridge */ /* synthetic */ ListIterator listIterator(int i4) {
            return super.listIterator(i4);
        }

        @Override // i2.c, java.util.List
        /* renamed from: p, reason: merged with bridge method [inline-methods] */
        public c subList(int i4, int i5) {
            h2.c.i(i4, i5, this.f3622h);
            c cVar = c.this;
            int i6 = this.f3621g;
            return cVar.subList(i4 + i6, i5 + i6);
        }

        @Override // java.util.AbstractCollection, java.util.Collection, java.util.List
        public int size() {
            return this.f3622h;
        }
    }

    c() {
    }

    static c h(Object[] objArr) {
        return i(objArr, objArr.length);
    }

    static c i(Object[] objArr, int i4) {
        return i4 == 0 ? n() : new h(objArr, i4);
    }

    private static c j(Object... objArr) {
        return h(f.b(objArr));
    }

    public static c n() {
        return h.f3624i;
    }

    public static c o(Object obj) {
        return j(obj);
    }

    @Override // i2.b
    int a(Object[] objArr, int i4) {
        int size = size();
        for (int i5 = 0; i5 < size; i5++) {
            objArr[i4 + i5] = get(i5);
        }
        return i4 + size;
    }

    @Override // java.util.List
    public final void add(int i4, Object obj) {
        throw new UnsupportedOperationException();
    }

    @Override // java.util.List
    public final boolean addAll(int i4, Collection collection) {
        throw new UnsupportedOperationException();
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.util.List
    public boolean contains(Object obj) {
        return indexOf(obj) >= 0;
    }

    @Override // java.util.Collection, java.util.List
    public boolean equals(Object obj) {
        return e.a(this, obj);
    }

    @Override // java.util.Collection, java.util.List
    public int hashCode() {
        int size = size();
        int i4 = 1;
        for (int i5 = 0; i5 < size; i5++) {
            i4 = ~(~((i4 * 31) + get(i5).hashCode()));
        }
        return i4;
    }

    @Override // java.util.List
    public int indexOf(Object obj) {
        if (obj == null) {
            return -1;
        }
        return e.b(this, obj);
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.lang.Iterable, java.util.List
    /* renamed from: k, reason: merged with bridge method [inline-methods] */
    public i iterator() {
        return listIterator();
    }

    @Override // java.util.List
    /* renamed from: l, reason: merged with bridge method [inline-methods] */
    public j listIterator() {
        return listIterator(0);
    }

    @Override // java.util.List
    public int lastIndexOf(Object obj) {
        if (obj == null) {
            return -1;
        }
        return e.d(this, obj);
    }

    @Override // java.util.List
    /* renamed from: m, reason: merged with bridge method [inline-methods] */
    public j listIterator(int i4) {
        h2.c.g(i4, size());
        return isEmpty() ? f3619f : new a(this, i4);
    }

    @Override // java.util.List
    /* renamed from: p */
    public c subList(int i4, int i5) {
        h2.c.i(i4, i5, size());
        int i6 = i5 - i4;
        return i6 == size() ? this : i6 == 0 ? n() : q(i4, i5);
    }

    c q(int i4, int i5) {
        return new b(i4, i5 - i4);
    }

    @Override // java.util.List
    public final Object remove(int i4) {
        throw new UnsupportedOperationException();
    }

    @Override // java.util.List
    public final Object set(int i4, Object obj) {
        throw new UnsupportedOperationException();
    }
}
