package com.google.android.gms.common.data;

import android.os.Parcel;
import android.os.ParcelFileDescriptor;
import android.os.Parcelable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class a implements Parcelable.Creator {
    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        int w3 = i1.b.w(parcel);
        int i4 = 0;
        ParcelFileDescriptor parcelFileDescriptor = null;
        int i5 = 0;
        while (parcel.dataPosition() < w3) {
            int o3 = i1.b.o(parcel);
            int k4 = i1.b.k(o3);
            if (k4 == 1) {
                i4 = i1.b.q(parcel, o3);
            } else if (k4 == 2) {
                parcelFileDescriptor = (ParcelFileDescriptor) i1.b.d(parcel, o3, ParcelFileDescriptor.CREATOR);
            } else if (k4 != 3) {
                i1.b.v(parcel, o3);
            } else {
                i5 = i1.b.q(parcel, o3);
            }
        }
        i1.b.j(parcel, w3);
        return new BitmapTeleporter(i4, parcelFileDescriptor, i5);
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new BitmapTeleporter[i4];
    }
}
