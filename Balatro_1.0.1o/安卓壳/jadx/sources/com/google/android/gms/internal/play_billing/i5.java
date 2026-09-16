package com.google.android.gms.internal.play_billing;

import java.util.AbstractList;
import java.util.Arrays;
import java.util.RandomAccess;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class i5 extends x2 implements RandomAccess {

    /* renamed from: h, reason: collision with root package name */
    private static final Object[] f2792h;

    /* renamed from: i, reason: collision with root package name */
    private static final i5 f2793i;

    /* renamed from: f, reason: collision with root package name */
    private Object[] f2794f;

    /* renamed from: g, reason: collision with root package name */
    private int f2795g;

    static {
        Object[] objArr = new Object[0];
        f2792h = objArr;
        f2793i = new i5(objArr, 0, false);
    }

    private i5(Object[] objArr, int i4, boolean z3) {
        super(z3);
        this.f2794f = objArr;
        this.f2795g = i4;
    }

    public static i5 e() {
        return f2793i;
    }

    private static int g(int i4) {
        return Math.max(((i4 * 3) / 2) + 1, 10);
    }

    private final String h(int i4) {
        return a1.b2.c3.d4(732) + i4 + ", Size:" + this.f2795g;
    }

    private final void i(int i4) {
        if (i4 < 0 || i4 >= this.f2795g) {
            throw new IndexOutOfBoundsException(h(i4));
        }
    }

    @Override // java.util.AbstractList, java.util.List
    public final void add(int i4, Object obj) {
        int i5;
        a();
        if (i4 < 0 || i4 > (i5 = this.f2795g)) {
            throw new IndexOutOfBoundsException(h(i4));
        }
        int i6 = i4 + 1;
        Object[] objArr = this.f2794f;
        int length = objArr.length;
        if (i5 < length) {
            System.arraycopy(objArr, i4, objArr, i6, i5 - i4);
        } else {
            Object[] objArr2 = new Object[g(length)];
            System.arraycopy(this.f2794f, 0, objArr2, 0, i4);
            System.arraycopy(this.f2794f, i4, objArr2, i6, this.f2795g - i4);
            this.f2794f = objArr2;
        }
        this.f2794f[i4] = obj;
        this.f2795g++;
        ((AbstractList) this).modCount++;
    }

    @Override // java.util.AbstractList, java.util.AbstractCollection, java.util.Collection, java.util.List
    public final boolean add(Object obj) {
        a();
        int i4 = this.f2795g;
        int length = this.f2794f.length;
        if (i4 == length) {
            this.f2794f = Arrays.copyOf(this.f2794f, g(length));
        }
        Object[] objArr = this.f2794f;
        int i5 = this.f2795g;
        this.f2795g = i5 + 1;
        objArr[i5] = obj;
        ((AbstractList) this).modCount++;
        return true;
    }

    @Override // com.google.android.gms.internal.play_billing.i4
    public final /* bridge */ /* synthetic */ i4 d(int i4) {
        if (i4 >= this.f2795g) {
            return new i5(i4 == 0 ? f2792h : Arrays.copyOf(this.f2794f, i4), this.f2795g, true);
        }
        throw new IllegalArgumentException();
    }

    final void f(int i4) {
        int length = this.f2794f.length;
        if (i4 <= length) {
            return;
        }
        if (length == 0) {
            this.f2794f = new Object[Math.max(i4, 10)];
            return;
        }
        while (length < i4) {
            length = g(length);
        }
        this.f2794f = Arrays.copyOf(this.f2794f, length);
    }

    @Override // java.util.AbstractList, java.util.List
    public final Object get(int i4) {
        i(i4);
        return this.f2794f[i4];
    }

    @Override // com.google.android.gms.internal.play_billing.x2, java.util.AbstractList, java.util.List
    public final Object remove(int i4) {
        a();
        i(i4);
        Object[] objArr = this.f2794f;
        Object obj = objArr[i4];
        if (i4 < this.f2795g - 1) {
            System.arraycopy(objArr, i4 + 1, objArr, i4, (r2 - i4) - 1);
        }
        this.f2795g--;
        ((AbstractList) this).modCount++;
        return obj;
    }

    @Override // java.util.AbstractList, java.util.List
    public final Object set(int i4, Object obj) {
        a();
        i(i4);
        Object[] objArr = this.f2794f;
        Object obj2 = objArr[i4];
        objArr[i4] = obj;
        ((AbstractList) this).modCount++;
        return obj2;
    }

    @Override // java.util.AbstractCollection, java.util.Collection, java.util.List
    public final int size() {
        return this.f2795g;
    }
}
