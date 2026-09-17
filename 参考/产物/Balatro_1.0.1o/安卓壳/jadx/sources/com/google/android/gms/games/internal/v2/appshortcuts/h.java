package com.google.android.gms.games.internal.v2.appshortcuts;

import android.content.pm.ShortcutInfo;
import android.os.Parcel;
import android.os.Parcelable;
import java.util.ArrayList;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class h implements Parcelable.Creator {
    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        Parcelable.Creator creator;
        int w3 = i1.b.w(parcel);
        ArrayList arrayList = null;
        ArrayList arrayList2 = null;
        ArrayList arrayList3 = null;
        ArrayList arrayList4 = null;
        while (parcel.dataPosition() < w3) {
            int o3 = i1.b.o(parcel);
            int k4 = i1.b.k(o3);
            if (k4 == 1) {
                arrayList = i1.b.g(parcel, o3);
            } else if (k4 == 2) {
                creator = ShortcutInfo.CREATOR;
                arrayList2 = i1.b.i(parcel, o3, creator);
            } else if (k4 == 3) {
                arrayList3 = i1.b.g(parcel, o3);
            } else if (k4 != 4) {
                i1.b.v(parcel, o3);
            } else {
                arrayList4 = i1.b.g(parcel, o3);
            }
        }
        i1.b.j(parcel, w3);
        return new g(arrayList, arrayList2, arrayList3, arrayList4);
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new g[i4];
    }
}
