package com.google.android.gms.internal.play_billing;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public abstract class r3 extends b3 {

    /* renamed from: b, reason: collision with root package name */
    private static final boolean f2976b = x5.C();

    /* renamed from: c, reason: collision with root package name */
    public static final /* synthetic */ int f2977c = 0;

    /* renamed from: a, reason: collision with root package name */
    Object f2978a;

    /* synthetic */ r3(q3 q3Var) {
    }

    public static int s(int i4) {
        return (352 - (Integer.numberOfLeadingZeros(i4) * 9)) >>> 6;
    }

    public static int t(long j4) {
        return (640 - (Long.numberOfLeadingZeros(j4) * 9)) >>> 6;
    }

    public final void a() {
        if (c() != 0) {
            throw new IllegalStateException("Did not write as much data as expected.");
        }
    }

    public abstract int c();

    public abstract void d(byte b4);

    public abstract void e(int i4, boolean z3);

    public abstract void f(int i4, j3 j3Var);

    public abstract void g(int i4, int i5);

    public abstract void h(int i4);

    public abstract void i(int i4, long j4);

    public abstract void j(long j4);

    public abstract void k(int i4, int i5);

    public abstract void l(int i4);

    public abstract void m(int i4, String str);

    public abstract void n(int i4, int i5);

    public abstract void o(int i4, int i5);

    public abstract void p(int i4);

    public abstract void q(int i4, long j4);

    public abstract void r(long j4);
}
