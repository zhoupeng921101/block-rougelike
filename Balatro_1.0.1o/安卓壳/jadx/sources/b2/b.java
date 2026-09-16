package b2;

import java.util.Arrays;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
abstract class b extends c {

    /* renamed from: a, reason: collision with root package name */
    Object[] f1800a = new Object[4];

    /* renamed from: b, reason: collision with root package name */
    int f1801b = 0;

    /* renamed from: c, reason: collision with root package name */
    boolean f1802c;

    b(int i4) {
    }

    public final b a(Object obj) {
        int i4;
        obj.getClass();
        int length = this.f1800a.length;
        int i5 = this.f1801b;
        int i6 = i5 + 1;
        if (i6 < 0) {
            throw new IllegalArgumentException("cannot store more than Integer.MAX_VALUE elements");
        }
        if (i6 <= length) {
            i4 = length;
        } else {
            i4 = (length >> 1) + length + 1;
            if (i4 < i6) {
                int highestOneBit = Integer.highestOneBit(i5);
                i4 = highestOneBit + highestOneBit;
            }
            if (i4 < 0) {
                i4 = Integer.MAX_VALUE;
            }
        }
        if (i4 > length || this.f1802c) {
            this.f1800a = Arrays.copyOf(this.f1800a, i4);
            this.f1802c = false;
        }
        Object[] objArr = this.f1800a;
        int i7 = this.f1801b;
        this.f1801b = i7 + 1;
        objArr[i7] = obj;
        return this;
    }
}
