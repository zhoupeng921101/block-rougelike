package f2;

import android.os.Parcel;
import android.os.Parcelable;
import h1.m0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class k implements Parcelable.Creator {
    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        int w3 = i1.b.w(parcel);
        m0 m0Var = null;
        int i4 = 0;
        while (parcel.dataPosition() < w3) {
            int o3 = i1.b.o(parcel);
            int k4 = i1.b.k(o3);
            if (k4 == 1) {
                i4 = i1.b.q(parcel, o3);
            } else if (k4 != 2) {
                i1.b.v(parcel, o3);
            } else {
                m0Var = (m0) i1.b.d(parcel, o3, m0.CREATOR);
            }
        }
        i1.b.j(parcel, w3);
        return new j(i4, m0Var);
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new j[i4];
    }
}
