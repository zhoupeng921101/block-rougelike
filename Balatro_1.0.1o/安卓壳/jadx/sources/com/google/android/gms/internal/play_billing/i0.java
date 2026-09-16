package com.google.android.gms.internal.play_billing;

import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.Objects;
import java.util.RandomAccess;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class i0 extends f0 implements List, RandomAccess {

    /* renamed from: f, reason: collision with root package name */
    private static final y0 f2784f = new g0(q0.f2967j, 0);

    /* renamed from: g, reason: collision with root package name */
    public static final /* synthetic */ int f2785g = 0;

    i0() {
    }

    static i0 k(Object[] objArr, int i4) {
        return i4 == 0 ? q0.f2967j : new q0(objArr, i4);
    }

    public static i0 l(Collection collection) {
        if (!(collection instanceof f0)) {
            Object[] array = collection.toArray();
            int length = array.length;
            p0.a(array, length);
            return k(array, length);
        }
        i0 g4 = ((f0) collection).g();
        if (!g4.h()) {
            return g4;
        }
        Object[] array2 = g4.toArray();
        return k(array2, array2.length);
    }

    public static i0 m() {
        return q0.f2967j;
    }

    public static i0 n(Object obj) {
        Object[] objArr = {"inapp"};
        p0.a(objArr, 1);
        return k(objArr, 1);
    }

    public static i0 o(Object obj, Object obj2) {
        Object[] objArr = {"subs", a1.b2.c3.d4(833)};
        p0.a(objArr, 2);
        return k(objArr, 2);
    }

    @Override // com.google.android.gms.internal.play_billing.f0
    int a(Object[] objArr, int i4) {
        int size = size();
        for (int i5 = 0; i5 < size; i5++) {
            objArr[i5] = get(i5);
        }
        return size;
    }

    @Override // java.util.List
    public final void add(int i4, Object obj) {
        throw new UnsupportedOperationException();
    }

    @Override // java.util.List
    public final boolean addAll(int i4, Collection collection) {
        throw new UnsupportedOperationException();
    }

    @Override // com.google.android.gms.internal.play_billing.f0, java.util.AbstractCollection, java.util.Collection
    public final boolean contains(Object obj) {
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

    @Override // com.google.android.gms.internal.play_billing.f0
    public final i0 g() {
        return this;
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
    public final int indexOf(Object obj) {
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

    @Override // java.util.List
    /* renamed from: j, reason: merged with bridge method [inline-methods] */
    public i0 subList(int i4, int i5) {
        v.d(i4, i5, size());
        int i6 = i5 - i4;
        return i6 == size() ? this : i6 == 0 ? q0.f2967j : new h0(this, i4, i6);
    }

    @Override // java.util.List
    public final int lastIndexOf(Object obj) {
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
    /* renamed from: p, reason: merged with bridge method [inline-methods] */
    public final y0 listIterator(int i4) {
        v.b(i4, size(), "index");
        return isEmpty() ? f2784f : new g0(this, i4);
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
