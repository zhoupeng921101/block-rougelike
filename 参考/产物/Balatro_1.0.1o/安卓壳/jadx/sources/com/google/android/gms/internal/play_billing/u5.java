package com.google.android.gms.internal.play_billing;

import sun.misc.Unsafe;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class u5 extends w5 {
    u5(Unsafe unsafe) {
        super(unsafe);
    }

    @Override // com.google.android.gms.internal.play_billing.w5
    public final double a(Object obj, long j4) {
        return Double.longBitsToDouble(this.f3019a.getLong(obj, j4));
    }

    @Override // com.google.android.gms.internal.play_billing.w5
    public final float b(Object obj, long j4) {
        return Float.intBitsToFloat(this.f3019a.getInt(obj, j4));
    }

    @Override // com.google.android.gms.internal.play_billing.w5
    public final void c(Object obj, long j4, boolean z3) {
        if (x5.f3033h) {
            x5.d(obj, j4, r3 ? (byte) 1 : (byte) 0);
        } else {
            x5.e(obj, j4, r3 ? (byte) 1 : (byte) 0);
        }
    }

    @Override // com.google.android.gms.internal.play_billing.w5
    public final void d(Object obj, long j4, byte b4) {
        if (x5.f3033h) {
            x5.d(obj, j4, b4);
        } else {
            x5.e(obj, j4, b4);
        }
    }

    @Override // com.google.android.gms.internal.play_billing.w5
    public final void e(Object obj, long j4, double d4) {
        this.f3019a.putLong(obj, j4, Double.doubleToLongBits(d4));
    }

    @Override // com.google.android.gms.internal.play_billing.w5
    public final void f(Object obj, long j4, float f4) {
        this.f3019a.putInt(obj, j4, Float.floatToIntBits(f4));
    }

    @Override // com.google.android.gms.internal.play_billing.w5
    public final boolean g(Object obj, long j4) {
        return x5.f3033h ? x5.y(obj, j4) : x5.z(obj, j4);
    }
}
