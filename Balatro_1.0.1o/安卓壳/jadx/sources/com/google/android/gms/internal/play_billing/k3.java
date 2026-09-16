package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class k3 extends m3 {

    /* renamed from: b, reason: collision with root package name */
    private int f2835b;

    /* renamed from: c, reason: collision with root package name */
    private int f2836c;

    /* renamed from: d, reason: collision with root package name */
    private int f2837d;

    /* synthetic */ k3(byte[] bArr, int i4, int i5, boolean z3, l3 l3Var) {
        super(null);
        this.f2837d = Integer.MAX_VALUE;
        this.f2835b = 0;
    }

    public final int c(int i4) {
        int i5 = this.f2837d;
        this.f2837d = 0;
        int i6 = this.f2835b + this.f2836c;
        this.f2835b = i6;
        if (i6 <= 0) {
            this.f2836c = 0;
            return i5;
        }
        this.f2836c = i6;
        this.f2835b = 0;
        return i5;
    }
}
