package i2;

import java.util.NoSuchElementException;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class a extends j {

    /* renamed from: e, reason: collision with root package name */
    private final int f3616e;

    /* renamed from: f, reason: collision with root package name */
    private int f3617f;

    protected a(int i4, int i5) {
        h2.c.g(i5, i4);
        this.f3616e = i4;
        this.f3617f = i5;
    }

    protected abstract Object b(int i4);

    @Override // java.util.Iterator, java.util.ListIterator
    public final boolean hasNext() {
        return this.f3617f < this.f3616e;
    }

    @Override // java.util.ListIterator
    public final boolean hasPrevious() {
        return this.f3617f > 0;
    }

    @Override // java.util.Iterator, java.util.ListIterator
    public final Object next() {
        if (!hasNext()) {
            throw new NoSuchElementException();
        }
        int i4 = this.f3617f;
        this.f3617f = i4 + 1;
        return b(i4);
    }

    @Override // java.util.ListIterator
    public final int nextIndex() {
        return this.f3617f;
    }

    @Override // java.util.ListIterator
    public final Object previous() {
        if (!hasPrevious()) {
            throw new NoSuchElementException();
        }
        int i4 = this.f3617f - 1;
        this.f3617f = i4;
        return b(i4);
    }

    @Override // java.util.ListIterator
    public final int previousIndex() {
        return this.f3617f - 1;
    }
}
