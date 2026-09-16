package n1;

import android.os.Parcel;
import android.os.Parcelable;
import com.google.android.gms.drive.DriveId;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class c implements Parcelable.Creator {
    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        int w3 = i1.b.w(parcel);
        int i4 = -1;
        long j4 = 0;
        long j5 = 0;
        String str = null;
        while (parcel.dataPosition() < w3) {
            int o3 = i1.b.o(parcel);
            int k4 = i1.b.k(o3);
            if (k4 == 2) {
                str = i1.b.e(parcel, o3);
            } else if (k4 == 3) {
                j4 = i1.b.s(parcel, o3);
            } else if (k4 == 4) {
                j5 = i1.b.s(parcel, o3);
            } else if (k4 != 5) {
                i1.b.v(parcel, o3);
            } else {
                i4 = i1.b.q(parcel, o3);
            }
        }
        i1.b.j(parcel, w3);
        return new DriveId(str, j4, j5, i4);
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new DriveId[i4];
    }
}
