package com.google.android.gms.internal.play_billing;

import android.os.IBinder;
import android.os.Parcel;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class h extends e implements j {
    h(IBinder iBinder) {
        super(iBinder, "com.google.android.apps.play.billingtestcompanion.aidl.IBillingOverrideService");
    }

    @Override // com.google.android.gms.internal.play_billing.j
    public final void y(String str, String str2, m mVar) {
        Parcel a4 = a();
        a4.writeString(str);
        a4.writeString(str2);
        g.c(a4, mVar);
        i(1, a4);
    }
}
