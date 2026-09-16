package w1;

import android.os.Parcel;
import android.os.Parcelable;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class b implements Parcelable.Creator {
    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        int w3 = i1.b.w(parcel);
        boolean[] zArr = null;
        boolean[] zArr2 = null;
        boolean z3 = false;
        boolean z4 = false;
        boolean z5 = false;
        while (parcel.dataPosition() < w3) {
            int o3 = i1.b.o(parcel);
            int k4 = i1.b.k(o3);
            if (k4 == 1) {
                z3 = i1.b.l(parcel, o3);
            } else if (k4 == 2) {
                z4 = i1.b.l(parcel, o3);
            } else if (k4 == 3) {
                z5 = i1.b.l(parcel, o3);
            } else if (k4 == 4) {
                zArr = i1.b.a(parcel, o3);
            } else if (k4 != 5) {
                i1.b.v(parcel, o3);
            } else {
                zArr2 = i1.b.a(parcel, o3);
            }
        }
        i1.b.j(parcel, w3);
        return new a(z3, z4, z5, zArr, zArr2);
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new a[i4];
    }
}
