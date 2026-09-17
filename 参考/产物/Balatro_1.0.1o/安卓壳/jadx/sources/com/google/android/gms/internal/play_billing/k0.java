package com.google.android.gms.internal.play_billing;

import java.util.Arrays;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class k0 {

    /* renamed from: a, reason: collision with root package name */
    Object[] f2825a = new Object[8];

    /* renamed from: b, reason: collision with root package name */
    int f2826b = 0;

    /* renamed from: c, reason: collision with root package name */
    j0 f2827c;

    public final k0 a(Object obj, Object obj2) {
        int i4 = this.f2826b + 1;
        Object[] objArr = this.f2825a;
        int length = objArr.length;
        int i5 = i4 + i4;
        if (i5 > length) {
            if (i5 > length) {
                length = length + (length >> 1) + 1;
                if (length < i5) {
                    int highestOneBit = Integer.highestOneBit(i5 - 1);
                    length = highestOneBit + highestOneBit;
                }
                if (length < 0) {
                    length = Integer.MAX_VALUE;
                }
            }
            this.f2825a = Arrays.copyOf(objArr, length);
        }
        d0.a(obj, obj2);
        Object[] objArr2 = this.f2825a;
        int i6 = this.f2826b;
        int i7 = i6 + i6;
        objArr2[i7] = obj;
        objArr2[i7 + 1] = obj2;
        this.f2826b = i6 + 1;
        return this;
    }

    public final l0 b() {
        j0 j0Var = this.f2827c;
        if (j0Var != null) {
            throw j0Var.a();
        }
        v0 g4 = v0.g(this.f2826b, this.f2825a, this);
        j0 j0Var2 = this.f2827c;
        if (j0Var2 == null) {
            return g4;
        }
        throw j0Var2.a();
    }
}
