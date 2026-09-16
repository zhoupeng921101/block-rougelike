package com.google.android.gms.games.internal.v2.appshortcuts;

import android.os.Parcel;
import android.os.Parcelable;
import android.os.PersistableBundle;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class j implements Parcelable.Creator {
    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        int w3 = i1.b.w(parcel);
        String str = null;
        PersistableBundle persistableBundle = null;
        Boolean bool = null;
        Boolean bool2 = null;
        while (parcel.dataPosition() < w3) {
            int o3 = i1.b.o(parcel);
            int k4 = i1.b.k(o3);
            if (k4 == 1) {
                str = i1.b.e(parcel, o3);
            } else if (k4 == 2) {
                persistableBundle = (PersistableBundle) i1.b.d(parcel, o3, PersistableBundle.CREATOR);
            } else if (k4 == 3) {
                bool = i1.b.m(parcel, o3);
            } else if (k4 != 4) {
                i1.b.v(parcel, o3);
            } else {
                bool2 = i1.b.m(parcel, o3);
            }
        }
        i1.b.j(parcel, w3);
        return new i(str, persistableBundle, bool, bool2);
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new i[i4];
    }
}
