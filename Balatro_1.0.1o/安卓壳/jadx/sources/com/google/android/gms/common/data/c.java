package com.google.android.gms.common.data;

import android.database.CursorWindow;
import android.os.Bundle;
import android.os.Parcel;
import android.os.Parcelable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class c implements Parcelable.Creator {
    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        int w3 = i1.b.w(parcel);
        String[] strArr = null;
        CursorWindow[] cursorWindowArr = null;
        Bundle bundle = null;
        int i4 = 0;
        int i5 = 0;
        while (parcel.dataPosition() < w3) {
            int o3 = i1.b.o(parcel);
            int k4 = i1.b.k(o3);
            if (k4 == 1) {
                strArr = i1.b.f(parcel, o3);
            } else if (k4 == 2) {
                cursorWindowArr = (CursorWindow[]) i1.b.h(parcel, o3, CursorWindow.CREATOR);
            } else if (k4 == 3) {
                i5 = i1.b.q(parcel, o3);
            } else if (k4 == 4) {
                bundle = i1.b.b(parcel, o3);
            } else if (k4 != 1000) {
                i1.b.v(parcel, o3);
            } else {
                i4 = i1.b.q(parcel, o3);
            }
        }
        i1.b.j(parcel, w3);
        DataHolder dataHolder = new DataHolder(i4, strArr, cursorWindowArr, i5, bundle);
        dataHolder.r0();
        return dataHolder;
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new DataHolder[i4];
    }
}
