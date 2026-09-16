package n1;

import android.os.Parcel;
import android.os.ParcelFileDescriptor;
import android.os.Parcelable;
import com.google.android.gms.drive.DriveId;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class b implements Parcelable.Creator {
    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        int w3 = i1.b.w(parcel);
        ParcelFileDescriptor parcelFileDescriptor = null;
        DriveId driveId = null;
        String str = null;
        int i4 = 0;
        int i5 = 0;
        boolean z3 = false;
        while (parcel.dataPosition() < w3) {
            int o3 = i1.b.o(parcel);
            int k4 = i1.b.k(o3);
            if (k4 == 2) {
                parcelFileDescriptor = (ParcelFileDescriptor) i1.b.d(parcel, o3, ParcelFileDescriptor.CREATOR);
            } else if (k4 == 3) {
                i4 = i1.b.q(parcel, o3);
            } else if (k4 == 4) {
                i5 = i1.b.q(parcel, o3);
            } else if (k4 == 5) {
                driveId = (DriveId) i1.b.d(parcel, o3, DriveId.CREATOR);
            } else if (k4 == 7) {
                z3 = i1.b.l(parcel, o3);
            } else if (k4 != 8) {
                i1.b.v(parcel, o3);
            } else {
                str = i1.b.e(parcel, o3);
            }
        }
        i1.b.j(parcel, w3);
        return new a(parcelFileDescriptor, i4, i5, driveId, z3, str);
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new a[i4];
    }
}
