package i2;

import java.io.Serializable;
import java.util.AbstractCollection;
import java.util.Collection;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class b extends AbstractCollection implements Serializable {

    /* renamed from: e, reason: collision with root package name */
    private static final Object[] f3618e = new Object[0];

    b() {
    }

    abstract int a(Object[] objArr, int i4);

    @Override // java.util.AbstractCollection, java.util.Collection
    public final boolean add(Object obj) {
        throw new UnsupportedOperationException();
    }

    @Override // java.util.AbstractCollection, java.util.Collection
    public final boolean addAll(Collection collection) {
        throw new UnsupportedOperationException();
    }

    @Override // java.util.AbstractCollection, java.util.Collection
    public final void clear() {
        throw new UnsupportedOperationException();
    }

    abstract Object[] e();

    abstract int f();

    abstract int g();

    @Override // java.util.AbstractCollection, java.util.Collection
    public final boolean remove(Object obj) {
        throw new UnsupportedOperationException();
    }

    @Override // java.util.AbstractCollection, java.util.Collection
    public final boolean removeAll(Collection collection) {
        throw new UnsupportedOperationException();
    }

    @Override // java.util.AbstractCollection, java.util.Collection
    public final boolean retainAll(Collection collection) {
        throw new UnsupportedOperationException();
    }

    @Override // java.util.AbstractCollection, java.util.Collection
    public final Object[] toArray() {
        return toArray(f3618e);
    }

    @Override // java.util.AbstractCollection, java.util.Collection
    public final Object[] toArray(Object[] objArr) {
        h2.c.f(objArr);
        int size = size();
        if (objArr.length < size) {
            Object[] e4 = e();
            if (e4 != null) {
                return g.a(e4, g(), f(), objArr);
            }
            objArr = f.d(objArr, size);
        } else if (objArr.length > size) {
            objArr[size] = null;
        }
        a(objArr, 0);
        return objArr;
    }
}
