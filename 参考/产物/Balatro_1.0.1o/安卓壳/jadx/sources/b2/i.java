package b2;

import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.Objects;
import java.util.RandomAccess;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class i extends d implements List, RandomAccess {

    /* renamed from: f, reason: collision with root package name */
    private static final m f1809f = new f(k.f1811j, 0);

    /* renamed from: g, reason: collision with root package name */
    public static final /* synthetic */ int f1810g = 0;

    i() {
    }

    public static i j() {
        return k.f1811j;
    }

    public static i k(Object obj) {
        Object[] objArr = {obj};
        j.a(objArr, 1);
        return n(objArr, 1);
    }

    public static i l(Object obj, Object obj2, Object obj3) {
        Object[] objArr = {obj, obj2, obj3};
        j.a(objArr, 3);
        return n(objArr, 3);
    }

    public static i m(Object obj, Object obj2, Object obj3, Object obj4, Object obj5, Object obj6) {
        Object[] objArr = {obj, obj2, obj3, obj4, obj5, obj6};
        j.a(objArr, 6);
        return n(objArr, 6);
    }

    static i n(Object[] objArr, int i4) {
        return i4 == 0 ? k.f1811j : new k(objArr, i4);
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
    public final boolean equals(Object obj) {
        if (obj == this) {
            return true;
        }
        if (!(obj instanceof List)) {
            return false;
        }
        List list = (List) obj;
        int size = size();
        if (size != list.size()) {
            return false;
        }
        if (list instanceof RandomAccess) {
            for (int i4 = 0; i4 < size; i4++) {
                if (!Objects.equals(get(i4), list.get(i4))) {
                    return false;
                }
            }
            return true;
        }
        Iterator it = iterator();
        Iterator it2 = list.iterator();
        while (it.hasNext()) {
            if (!it2.hasNext() || !Objects.equals(it.next(), it2.next())) {
                return false;
            }
        }
        return !it2.hasNext();
    }

    @Override // b2.d
    int g(Object[] objArr, int i4) {
        int size = size();
        for (int i5 = 0; i5 < size; i5++) {
            objArr[i5] = get(i5);
        }
        return size;
    }

    public i h() {
        return size() <= 1 ? this : new g(this);
    }

    @Override // java.util.Collection, java.util.List
    public final int hashCode() {
        int size = size();
        int i4 = 1;
        for (int i5 = 0; i5 < size; i5++) {
            i4 = (i4 * 31) + get(i5).hashCode();
        }
        return i4;
    }

    @Override // java.util.List
    /* renamed from: i, reason: merged with bridge method [inline-methods] */
    public i subList(int i4, int i5) {
        s.d(i4, i5, size());
        int i6 = i5 - i4;
        return i6 == size() ? this : i6 == 0 ? k.f1811j : new h(this, i4, i6);
    }

    public int indexOf(Object obj) {
        if (obj == null) {
            return -1;
        }
        int size = size();
        for (int i4 = 0; i4 < size; i4++) {
            if (obj.equals(get(i4))) {
                return i4;
            }
        }
        return -1;
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.lang.Iterable, java.util.List
    public final /* synthetic */ Iterator iterator() {
        return listIterator(0);
    }

    public int lastIndexOf(Object obj) {
        if (obj == null) {
            return -1;
        }
        for (int size = size() - 1; size >= 0; size--) {
            if (obj.equals(get(size))) {
                return size;
            }
        }
        return -1;
    }

    @Override // java.util.List
    public final /* synthetic */ ListIterator listIterator() {
        return listIterator(0);
    }

    @Override // java.util.List
    /* renamed from: o, reason: merged with bridge method [inline-methods] */
    public final m listIterator(int i4) {
        s.c(i4, size(), "index");
        return isEmpty() ? f1809f : new f(this, i4);
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
