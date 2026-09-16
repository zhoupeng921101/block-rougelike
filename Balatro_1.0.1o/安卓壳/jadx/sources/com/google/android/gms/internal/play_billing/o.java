package com.google.android.gms.internal.play_billing;

import android.os.SystemClock;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class o extends a0 {
    o() {
    }

    @Override // com.google.android.gms.internal.play_billing.a0
    public final long a() {
        return SystemClock.elapsedRealtime() * 1000000;
    }
}
