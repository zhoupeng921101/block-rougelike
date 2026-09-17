package com.google.android.gms.games;

import android.net.Uri;
import android.os.Parcel;
import com.google.android.gms.common.internal.DowngradeableSafeParcel;
import com.google.android.gms.games.internal.GamesDowngradeableSafeParcel;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class e extends f {
    e() {
    }

    @Override // com.google.android.gms.games.f
    public final PlayerEntity a(Parcel parcel) {
        Integer i02;
        boolean k02;
        boolean h02;
        i02 = DowngradeableSafeParcel.i0();
        k02 = GamesDowngradeableSafeParcel.k0(i02);
        if (!k02) {
            h02 = DowngradeableSafeParcel.h0(PlayerEntity.class.getCanonicalName());
            if (!h02) {
                String readString = parcel.readString();
                String readString2 = parcel.readString();
                String readString3 = parcel.readString();
                String readString4 = parcel.readString();
                return new PlayerEntity(readString, readString2, readString3 == null ? null : Uri.parse(readString3), readString4 != null ? Uri.parse(readString4) : null, parcel.readLong(), -1, -1L, null, null, null, null, null, true, false, parcel.readString(), parcel.readString(), null, null, null, null, -1L, null, null, false, null);
            }
        }
        return super.a(parcel);
    }

    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        return a(parcel);
    }
}
