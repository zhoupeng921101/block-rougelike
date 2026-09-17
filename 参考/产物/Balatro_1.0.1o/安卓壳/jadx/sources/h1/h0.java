package h1;

import android.os.Parcel;
import android.os.Parcelable;
import com.android.support.BuildConfig;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class h0 implements Parcelable.Creator {
    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        int w3 = i1.b.w(parcel);
        int i4 = -1;
        int i5 = 0;
        int i6 = 0;
        int i7 = 0;
        int i8 = 0;
        String str = null;
        String str2 = null;
        long j4 = 0;
        long j5 = 0;
        while (parcel.dataPosition() < w3) {
            int o3 = i1.b.o(parcel);
            switch (i1.b.k(o3)) {
                case BuildConfig.VERSION_CODE /* 1 */:
                    i5 = i1.b.q(parcel, o3);
                    break;
                case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                    i6 = i1.b.q(parcel, o3);
                    break;
                case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                    i7 = i1.b.q(parcel, o3);
                    break;
                case 4:
                    j4 = i1.b.s(parcel, o3);
                    break;
                case 5:
                    j5 = i1.b.s(parcel, o3);
                    break;
                case 6:
                    str = i1.b.e(parcel, o3);
                    break;
                case 7:
                    str2 = i1.b.e(parcel, o3);
                    break;
                case 8:
                    i8 = i1.b.q(parcel, o3);
                    break;
                case 9:
                    i4 = i1.b.q(parcel, o3);
                    break;
                default:
                    i1.b.v(parcel, o3);
                    break;
            }
        }
        i1.b.j(parcel, w3);
        return new n(i5, i6, i7, j4, j5, str, str2, i8, i4);
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new n[i4];
    }
}
