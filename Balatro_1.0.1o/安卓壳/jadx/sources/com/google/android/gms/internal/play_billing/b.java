package com.google.android.gms.internal.play_billing;

import android.os.Bundle;
import android.os.IBinder;
import android.os.Parcel;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class b extends e implements d {
    b(IBinder iBinder) {
        super(iBinder, "com.android.vending.billing.IInAppBillingService");
    }

    @Override // com.google.android.gms.internal.play_billing.d
    public final Bundle P(int i4, String str, String str2, String str3, Bundle bundle) {
        Parcel a4 = a();
        a4.writeInt(i4);
        a4.writeString(str);
        a4.writeString(str2);
        a4.writeString(str3);
        g.b(a4, bundle);
        Parcel h4 = h(11, a4);
        Bundle bundle2 = (Bundle) g.a(h4, Bundle.CREATOR);
        h4.recycle();
        return bundle2;
    }

    @Override // com.google.android.gms.internal.play_billing.d
    public final int T(int i4, String str, String str2, Bundle bundle) {
        Parcel a4 = a();
        a4.writeInt(i4);
        a4.writeString(str);
        a4.writeString(str2);
        g.b(a4, bundle);
        Parcel h4 = h(10, a4);
        int readInt = h4.readInt();
        h4.recycle();
        return readInt;
    }

    @Override // com.google.android.gms.internal.play_billing.d
    public final Bundle W(int i4, String str, String str2, Bundle bundle, Bundle bundle2) {
        Parcel a4 = a();
        a4.writeInt(i4);
        a4.writeString(str);
        a4.writeString(str2);
        g.b(a4, bundle);
        g.b(a4, bundle2);
        Parcel h4 = h(901, a4);
        Bundle bundle3 = (Bundle) g.a(h4, Bundle.CREATOR);
        h4.recycle();
        return bundle3;
    }

    @Override // com.google.android.gms.internal.play_billing.d
    public final Bundle Y(int i4, String str, String str2, String str3, String str4) {
        Parcel a4 = a();
        a4.writeInt(3);
        a4.writeString(str);
        a4.writeString(str2);
        a4.writeString(str3);
        a4.writeString(null);
        Parcel h4 = h(3, a4);
        Bundle bundle = (Bundle) g.a(h4, Bundle.CREATOR);
        h4.recycle();
        return bundle;
    }

    @Override // com.google.android.gms.internal.play_billing.d
    public final int e0(int i4, String str, String str2) {
        Parcel a4 = a();
        a4.writeInt(i4);
        a4.writeString(str);
        a4.writeString(str2);
        Parcel h4 = h(1, a4);
        int readInt = h4.readInt();
        h4.recycle();
        return readInt;
    }

    @Override // com.google.android.gms.internal.play_billing.d
    public final Bundle f0(int i4, String str, String str2, Bundle bundle) {
        Parcel a4 = a();
        a4.writeInt(9);
        a4.writeString(str);
        a4.writeString(str2);
        g.b(a4, bundle);
        Parcel h4 = h(902, a4);
        Bundle bundle2 = (Bundle) g.a(h4, Bundle.CREATOR);
        h4.recycle();
        return bundle2;
    }

    @Override // com.google.android.gms.internal.play_billing.d
    public final Bundle j0(int i4, String str, String str2, String str3) {
        Parcel a4 = a();
        a4.writeInt(3);
        a4.writeString(str);
        a4.writeString(str2);
        a4.writeString(str3);
        Parcel h4 = h(4, a4);
        Bundle bundle = (Bundle) g.a(h4, Bundle.CREATOR);
        h4.recycle();
        return bundle;
    }

    @Override // com.google.android.gms.internal.play_billing.d
    public final Bundle x(int i4, String str, String str2, String str3, String str4, Bundle bundle) {
        Parcel a4 = a();
        a4.writeInt(i4);
        a4.writeString(str);
        a4.writeString(str2);
        a4.writeString(str3);
        a4.writeString(null);
        g.b(a4, bundle);
        Parcel h4 = h(8, a4);
        Bundle bundle2 = (Bundle) g.a(h4, Bundle.CREATOR);
        h4.recycle();
        return bundle2;
    }
}
