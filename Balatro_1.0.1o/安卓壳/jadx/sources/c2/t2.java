package c2;

import android.content.Intent;
import android.os.Parcel;
import android.os.Parcelable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class t2 implements Parcelable.Creator {
    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        int w3 = i1.b.w(parcel);
        Intent intent = null;
        while (parcel.dataPosition() < w3) {
            int o3 = i1.b.o(parcel);
            if (i1.b.k(o3) != 1) {
                i1.b.v(parcel, o3);
            } else {
                intent = (Intent) i1.b.d(parcel, o3, Intent.CREATOR);
            }
        }
        i1.b.j(parcel, w3);
        return new s2(intent);
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new s2[i4];
    }
}
