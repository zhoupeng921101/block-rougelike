package r1;

import android.os.Parcel;
import android.os.Parcelable;
import com.android.support.BuildConfig;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class g implements Parcelable.Creator {
    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        int w3 = i1.b.w(parcel);
        boolean z3 = false;
        boolean z4 = false;
        boolean z5 = false;
        boolean z6 = false;
        boolean z7 = false;
        boolean z8 = false;
        boolean z9 = false;
        boolean z10 = false;
        boolean z11 = false;
        boolean z12 = false;
        while (parcel.dataPosition() < w3) {
            int o3 = i1.b.o(parcel);
            switch (i1.b.k(o3)) {
                case BuildConfig.VERSION_CODE /* 1 */:
                    z3 = i1.b.l(parcel, o3);
                    break;
                case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                    z4 = i1.b.l(parcel, o3);
                    break;
                case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                    z5 = i1.b.l(parcel, o3);
                    break;
                case 4:
                    z6 = i1.b.l(parcel, o3);
                    break;
                case 5:
                    z7 = i1.b.l(parcel, o3);
                    break;
                case 6:
                    z8 = i1.b.l(parcel, o3);
                    break;
                case 7:
                    z9 = i1.b.l(parcel, o3);
                    break;
                case 8:
                    z10 = i1.b.l(parcel, o3);
                    break;
                case 9:
                    z11 = i1.b.l(parcel, o3);
                    break;
                case 10:
                    z12 = i1.b.l(parcel, o3);
                    break;
                default:
                    i1.b.v(parcel, o3);
                    break;
            }
        }
        i1.b.j(parcel, w3);
        return new f(z3, z4, z5, z6, z7, z8, z9, z10, z11, z12);
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new f[i4];
    }
}
