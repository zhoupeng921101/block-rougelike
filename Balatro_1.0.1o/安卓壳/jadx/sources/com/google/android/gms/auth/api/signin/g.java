package com.google.android.gms.auth.api.signin;

import android.os.Parcel;
import android.os.Parcelable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class g implements Parcelable.Creator {
    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        int w3 = i1.b.w(parcel);
        String str = "";
        GoogleSignInAccount googleSignInAccount = null;
        String str2 = "";
        while (parcel.dataPosition() < w3) {
            int o3 = i1.b.o(parcel);
            int k4 = i1.b.k(o3);
            if (k4 == 4) {
                str = i1.b.e(parcel, o3);
            } else if (k4 == 7) {
                googleSignInAccount = (GoogleSignInAccount) i1.b.d(parcel, o3, GoogleSignInAccount.CREATOR);
            } else if (k4 != 8) {
                i1.b.v(parcel, o3);
            } else {
                str2 = i1.b.e(parcel, o3);
            }
        }
        i1.b.j(parcel, w3);
        return new SignInAccount(str, googleSignInAccount, str2);
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new SignInAccount[i4];
    }
}
