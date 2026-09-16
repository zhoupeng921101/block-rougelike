package v1;

import android.net.Uri;
import android.os.Parcel;
import android.os.Parcelable;
import com.google.android.gms.common.data.BitmapTeleporter;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class m implements Parcelable.Creator {
    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        int w3 = i1.b.w(parcel);
        String str = null;
        Long l3 = null;
        BitmapTeleporter bitmapTeleporter = null;
        Uri uri = null;
        Long l4 = null;
        while (parcel.dataPosition() < w3) {
            int o3 = i1.b.o(parcel);
            int k4 = i1.b.k(o3);
            if (k4 == 1) {
                str = i1.b.e(parcel, o3);
            } else if (k4 == 2) {
                l3 = i1.b.t(parcel, o3);
            } else if (k4 == 4) {
                uri = (Uri) i1.b.d(parcel, o3, Uri.CREATOR);
            } else if (k4 == 5) {
                bitmapTeleporter = (BitmapTeleporter) i1.b.d(parcel, o3, BitmapTeleporter.CREATOR);
            } else if (k4 != 6) {
                i1.b.v(parcel, o3);
            } else {
                l4 = i1.b.t(parcel, o3);
            }
        }
        i1.b.j(parcel, w3);
        return new h(str, l3, bitmapTeleporter, uri, l4);
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new h[i4];
    }
}
