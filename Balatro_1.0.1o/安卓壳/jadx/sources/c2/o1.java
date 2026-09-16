package c2;

import java.util.NoSuchElementException;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class o1 extends z1 {

    /* renamed from: e, reason: collision with root package name */
    private final int f2149e;

    /* renamed from: f, reason: collision with root package name */
    private int f2150f;

    o1(int i4, int i5) {
        j1.b(i5, i4, "index");
        this.f2149e = i4;
        this.f2150f = i5;
    }

    abstract Object b(int i4);

    @Override // java.util.Iterator, java.util.ListIterator
    public final boolean hasNext() {
        return this.f2150f < this.f2149e;
    }

    @Override // java.util.ListIterator
    public final boolean hasPrevious() {
        return this.f2150f > 0;
    }

    @Override // java.util.Iterator, java.util.ListIterator
    public final Object next() {
        if (!hasNext()) {
            throw new NoSuchElementException();
        }
        int i4 = this.f2150f;
        this.f2150f = i4 + 1;
        return b(i4);
    }

    @Override // java.util.ListIterator
    public final int nextIndex() {
        return this.f2150f;
    }

    @Override // java.util.ListIterator
    public final Object previous() {
        if (!hasPrevious()) {
            throw new NoSuchElementException();
        }
        int i4 = this.f2150f - 1;
        this.f2150f = i4;
        return b(i4);
    }

    @Override // java.util.ListIterator
    public final int previousIndex() {
        return this.f2150f - 1;
    }
}
