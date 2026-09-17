package com.google.android.gms.internal.play_billing;

import java.util.NoSuchElementException;
import java.util.Objects;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class c3 extends d3 {

    /* renamed from: e, reason: collision with root package name */
    private int f2730e;

    /* renamed from: f, reason: collision with root package name */
    private final int f2731f;

    /* renamed from: g, reason: collision with root package name */
    final /* synthetic */ j3 f2732g;

    c3(j3 j3Var) {
        Objects.requireNonNull(j3Var);
        this.f2732g = j3Var;
        this.f2730e = 0;
        this.f2731f = j3Var.g();
    }

    @Override // com.google.android.gms.internal.play_billing.f3
    public final byte a() {
        int i4 = this.f2730e;
        if (i4 >= this.f2731f) {
            throw new NoSuchElementException();
        }
        this.f2730e = i4 + 1;
        return this.f2732g.e(i4);
    }

    @Override // java.util.Iterator
    public final boolean hasNext() {
        return this.f2730e < this.f2731f;
    }
}
