package com.google.android.gms.games;

import android.net.Uri;
import android.os.Parcel;
import com.google.android.gms.common.internal.DowngradeableSafeParcel;
import com.google.android.gms.games.internal.GamesDowngradeableSafeParcel;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
final class c extends d {
    c() {
    }

    @Override // com.google.android.gms.games.d
    public final GameEntity a(Parcel parcel) {
        Integer i02;
        boolean k02;
        boolean h02;
        boolean z3;
        i02 = DowngradeableSafeParcel.i0();
        k02 = GamesDowngradeableSafeParcel.k0(i02);
        if (!k02) {
            h02 = DowngradeableSafeParcel.h0(GameEntity.class.getCanonicalName());
            if (!h02) {
                String readString = parcel.readString();
                String readString2 = parcel.readString();
                String readString3 = parcel.readString();
                String readString4 = parcel.readString();
                String readString5 = parcel.readString();
                String readString6 = parcel.readString();
                String readString7 = parcel.readString();
                Uri parse = readString7 == null ? null : Uri.parse(readString7);
                String readString8 = parcel.readString();
                Uri parse2 = readString8 == null ? null : Uri.parse(readString8);
                String readString9 = parcel.readString();
                Uri parse3 = readString9 != null ? Uri.parse(readString9) : null;
                boolean z4 = true;
                if (parcel.readInt() > 0) {
                    z3 = true;
                } else {
                    z3 = true;
                    z4 = false;
                }
                return new GameEntity(readString, readString2, readString3, readString4, readString5, readString6, parse, parse2, parse3, z4, parcel.readInt() > 0 ? z3 : false, parcel.readString(), parcel.readInt(), parcel.readInt(), parcel.readInt(), false, false, null, null, null, false, false, false, null, false, false);
            }
        }
        return super.a(parcel);
    }

    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        return a(parcel);
    }
}
