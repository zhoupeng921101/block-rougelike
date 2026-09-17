package b2;

import java.util.NoSuchElementException;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class v extends m {

    /* renamed from: e, reason: collision with root package name */
    private final int f1816e;

    /* renamed from: f, reason: collision with root package name */
    private int f1817f;

    protected v(int i4, int i5) {
        s.c(i5, i4, "index");
        this.f1816e = i4;
        this.f1817f = i5;
    }

    protected abstract Object b(int i4);

    @Override // java.util.Iterator, java.util.ListIterator
    public final boolean hasNext() {
        return this.f1817f < this.f1816e;
    }

    @Override // java.util.ListIterator
    public final boolean hasPrevious() {
        return this.f1817f > 0;
    }

    @Override // java.util.Iterator, java.util.ListIterator
    public final Object next() {
        if (!hasNext()) {
            throw new NoSuchElementException();
        }
        int i4 = this.f1817f;
        this.f1817f = i4 + 1;
        return b(i4);
    }

    @Override // java.util.ListIterator
    public final int nextIndex() {
        return this.f1817f;
    }

    @Override // java.util.ListIterator
    public final Object previous() {
        if (!hasPrevious()) {
            throw new NoSuchElementException();
        }
        int i4 = this.f1817f - 1;
        this.f1817f = i4;
        return b(i4);
    }

    @Override // java.util.ListIterator
    public final int previousIndex() {
        return this.f1817f - 1;
    }
}
