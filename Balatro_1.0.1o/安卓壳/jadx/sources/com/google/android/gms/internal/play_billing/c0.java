package com.google.android.gms.internal.play_billing;

import java.util.NoSuchElementException;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class c0 extends y0 {

    /* renamed from: e, reason: collision with root package name */
    private final int f2724e;

    /* renamed from: f, reason: collision with root package name */
    private int f2725f;

    protected c0(int i4, int i5) {
        v.b(i5, i4, a1.b2.c3.d4(523));
        this.f2724e = i4;
        this.f2725f = i5;
    }

    protected abstract Object b(int i4);

    @Override // java.util.Iterator, java.util.ListIterator
    public final boolean hasNext() {
        return this.f2725f < this.f2724e;
    }

    @Override // java.util.ListIterator
    public final boolean hasPrevious() {
        return this.f2725f > 0;
    }

    @Override // java.util.Iterator, java.util.ListIterator
    public final Object next() {
        if (!hasNext()) {
            throw new NoSuchElementException();
        }
        int i4 = this.f2725f;
        this.f2725f = i4 + 1;
        return b(i4);
    }

    @Override // java.util.ListIterator
    public final int nextIndex() {
        return this.f2725f;
    }

    @Override // java.util.ListIterator
    public final Object previous() {
        if (!hasPrevious()) {
            throw new NoSuchElementException();
        }
        int i4 = this.f2725f - 1;
        this.f2725f = i4;
        return b(i4);
    }

    @Override // java.util.ListIterator
    public final int previousIndex() {
        return this.f2725f - 1;
    }
}
