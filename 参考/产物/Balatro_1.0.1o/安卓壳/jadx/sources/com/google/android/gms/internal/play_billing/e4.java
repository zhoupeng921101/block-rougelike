package com.google.android.gms.internal.play_billing;

import java.util.AbstractList;
import java.util.Arrays;
import java.util.Collection;
import java.util.RandomAccess;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class e4 extends x2 implements RandomAccess, h4 {

    /* renamed from: h, reason: collision with root package name */
    private static final int[] f2753h;

    /* renamed from: i, reason: collision with root package name */
    private static final e4 f2754i;

    /* renamed from: f, reason: collision with root package name */
    private int[] f2755f;

    /* renamed from: g, reason: collision with root package name */
    private int f2756g;

    static {
        int[] iArr = new int[0];
        f2753h = iArr;
        f2754i = new e4(iArr, 0, false);
    }

    private e4(int[] iArr, int i4, boolean z3) {
        super(z3);
        this.f2755f = iArr;
        this.f2756g = i4;
    }

    public static e4 f() {
        return f2754i;
    }

    private static int i(int i4) {
        return Math.max(((i4 * 3) / 2) + 1, 10);
    }

    private final String j(int i4) {
        return a1.b2.c3.d4(153) + i4 + ", Size:" + this.f2756g;
    }

    private final void k(int i4) {
        if (i4 < 0 || i4 >= this.f2756g) {
            throw new IndexOutOfBoundsException(j(i4));
        }
    }

    @Override // java.util.AbstractList, java.util.List
    public final /* synthetic */ void add(int i4, Object obj) {
        int i5;
        int intValue = ((Integer) obj).intValue();
        a();
        if (i4 < 0 || i4 > (i5 = this.f2756g)) {
            throw new IndexOutOfBoundsException(j(i4));
        }
        int i6 = i4 + 1;
        int[] iArr = this.f2755f;
        int length = iArr.length;
        if (i5 < length) {
            System.arraycopy(iArr, i4, iArr, i6, i5 - i4);
        } else {
            int[] iArr2 = new int[i(length)];
            System.arraycopy(this.f2755f, 0, iArr2, 0, i4);
            System.arraycopy(this.f2755f, i4, iArr2, i6, this.f2756g - i4);
            this.f2755f = iArr2;
        }
        this.f2755f[i4] = intValue;
        this.f2756g++;
        ((AbstractList) this).modCount++;
    }

    @Override // java.util.AbstractList, java.util.AbstractCollection, java.util.Collection, java.util.List
    public final /* bridge */ /* synthetic */ boolean add(Object obj) {
        g(((Integer) obj).intValue());
        return true;
    }

    @Override // com.google.android.gms.internal.play_billing.x2, java.util.AbstractCollection, java.util.Collection, java.util.List
    public final boolean addAll(Collection collection) {
        a();
        byte[] bArr = k4.f2839b;
        collection.getClass();
        if (!(collection instanceof e4)) {
            return super.addAll(collection);
        }
        e4 e4Var = (e4) collection;
        int i4 = e4Var.f2756g;
        if (i4 == 0) {
            return false;
        }
        int i5 = this.f2756g;
        if (Integer.MAX_VALUE - i5 < i4) {
            throw new OutOfMemoryError();
        }
        int i6 = i5 + i4;
        int[] iArr = this.f2755f;
        if (i6 > iArr.length) {
            this.f2755f = Arrays.copyOf(iArr, i6);
        }
        System.arraycopy(e4Var.f2755f, 0, this.f2755f, this.f2756g, e4Var.f2756g);
        this.f2756g = i6;
        ((AbstractList) this).modCount++;
        return true;
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.util.List
    public final boolean contains(Object obj) {
        return indexOf(obj) != -1;
    }

    @Override // com.google.android.gms.internal.play_billing.i4
    public final /* bridge */ /* synthetic */ i4 d(int i4) {
        if (i4 >= this.f2756g) {
            return new e4(i4 == 0 ? f2753h : Arrays.copyOf(this.f2755f, i4), this.f2756g, true);
        }
        throw new IllegalArgumentException();
    }

    public final int e(int i4) {
        k(i4);
        return this.f2755f[i4];
    }

    @Override // com.google.android.gms.internal.play_billing.x2, java.util.AbstractList, java.util.Collection, java.util.List
    public final boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (!(obj instanceof e4)) {
            return super.equals(obj);
        }
        e4 e4Var = (e4) obj;
        if (this.f2756g != e4Var.f2756g) {
            return false;
        }
        int[] iArr = e4Var.f2755f;
        for (int i4 = 0; i4 < this.f2756g; i4++) {
            if (this.f2755f[i4] != iArr[i4]) {
                return false;
            }
        }
        return true;
    }

    public final void g(int i4) {
        a();
        int i5 = this.f2756g;
        int length = this.f2755f.length;
        if (i5 == length) {
            int[] iArr = new int[i(length)];
            System.arraycopy(this.f2755f, 0, iArr, 0, this.f2756g);
            this.f2755f = iArr;
        }
        int[] iArr2 = this.f2755f;
        int i6 = this.f2756g;
        this.f2756g = i6 + 1;
        iArr2[i6] = i4;
    }

    @Override // java.util.AbstractList, java.util.List
    public final /* synthetic */ Object get(int i4) {
        k(i4);
        return Integer.valueOf(this.f2755f[i4]);
    }

    final void h(int i4) {
        int length = this.f2755f.length;
        if (i4 <= length) {
            return;
        }
        if (length == 0) {
            this.f2755f = new int[Math.max(i4, 10)];
            return;
        }
        while (length < i4) {
            length = i(length);
        }
        this.f2755f = Arrays.copyOf(this.f2755f, length);
    }

    @Override // com.google.android.gms.internal.play_billing.x2, java.util.AbstractList, java.util.Collection, java.util.List
    public final int hashCode() {
        int i4 = 1;
        for (int i5 = 0; i5 < this.f2756g; i5++) {
            i4 = (i4 * 31) + this.f2755f[i5];
        }
        return i4;
    }

    @Override // java.util.AbstractList, java.util.List
    public final int indexOf(Object obj) {
        if (!(obj instanceof Integer)) {
            return -1;
        }
        int intValue = ((Integer) obj).intValue();
        int i4 = this.f2756g;
        for (int i5 = 0; i5 < i4; i5++) {
            if (this.f2755f[i5] == intValue) {
                return i5;
            }
        }
        return -1;
    }

    @Override // com.google.android.gms.internal.play_billing.x2, java.util.AbstractList, java.util.List
    public final /* bridge */ /* synthetic */ Object remove(int i4) {
        a();
        k(i4);
        int[] iArr = this.f2755f;
        int i5 = iArr[i4];
        if (i4 < this.f2756g - 1) {
            System.arraycopy(iArr, i4 + 1, iArr, i4, (r2 - i4) - 1);
        }
        this.f2756g--;
        ((AbstractList) this).modCount++;
        return Integer.valueOf(i5);
    }

    @Override // java.util.AbstractList
    protected final void removeRange(int i4, int i5) {
        a();
        if (i5 < i4) {
            throw new IndexOutOfBoundsException("toIndex < fromIndex");
        }
        int[] iArr = this.f2755f;
        System.arraycopy(iArr, i5, iArr, i4, this.f2756g - i5);
        this.f2756g -= i5 - i4;
        ((AbstractList) this).modCount++;
    }

    @Override // java.util.AbstractList, java.util.List
    public final /* bridge */ /* synthetic */ Object set(int i4, Object obj) {
        int intValue = ((Integer) obj).intValue();
        a();
        k(i4);
        int[] iArr = this.f2755f;
        int i5 = iArr[i4];
        iArr[i4] = intValue;
        return Integer.valueOf(i5);
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.util.List
    public final int size() {
        return this.f2756g;
    }
}
