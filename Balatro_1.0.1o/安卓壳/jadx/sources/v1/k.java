package v1;

import android.os.Parcel;
import android.os.Parcelable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class k implements Parcelable.Creator {
    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        int w3 = i1.b.w(parcel);
        n1.a aVar = null;
        while (parcel.dataPosition() < w3) {
            int o3 = i1.b.o(parcel);
            if (i1.b.k(o3) != 1) {
                i1.b.v(parcel, o3);
            } else {
                aVar = (n1.a) i1.b.d(parcel, o3, n1.a.CREATOR);
            }
        }
        i1.b.j(parcel, w3);
        return new c(aVar);
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new c[i4];
    }
}
