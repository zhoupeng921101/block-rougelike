package f2;

import android.os.Parcel;
import android.os.Parcelable;
import h1.o0;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class m implements Parcelable.Creator {
    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        int w3 = i1.b.w(parcel);
        d1.a aVar = null;
        int i4 = 0;
        o0 o0Var = null;
        while (parcel.dataPosition() < w3) {
            int o3 = i1.b.o(parcel);
            int k4 = i1.b.k(o3);
            if (k4 == 1) {
                i4 = i1.b.q(parcel, o3);
            } else if (k4 == 2) {
                aVar = (d1.a) i1.b.d(parcel, o3, d1.a.CREATOR);
            } else if (k4 != 3) {
                i1.b.v(parcel, o3);
            } else {
                o0Var = (o0) i1.b.d(parcel, o3, o0.CREATOR);
            }
        }
        i1.b.j(parcel, w3);
        return new l(i4, aVar, o0Var);
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new l[i4];
    }
}
