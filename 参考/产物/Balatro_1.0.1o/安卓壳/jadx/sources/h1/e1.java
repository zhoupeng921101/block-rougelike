package h1;

import android.os.Parcel;
import android.os.Parcelable;
import com.android.support.BuildConfig;
import org.love2d.android.GameActivity;

/* compiled from: r8-map-id-69a9a81d8cf707cf57020cf61d81327cd23e88718ad4e2ee1ff2f249552ea3bc */
/* loaded from: E:\AniRes\Balatro_1.0.1o\安卓壳\classes.dex */
public final class e1 implements Parcelable.Creator {
    @Override // android.os.Parcelable.Creator
    public final /* bridge */ /* synthetic */ Object createFromParcel(Parcel parcel) {
        int w3 = i1.b.w(parcel);
        s sVar = null;
        int[] iArr = null;
        int[] iArr2 = null;
        boolean z3 = false;
        boolean z4 = false;
        int i4 = 0;
        while (parcel.dataPosition() < w3) {
            int o3 = i1.b.o(parcel);
            switch (i1.b.k(o3)) {
                case BuildConfig.VERSION_CODE /* 1 */:
                    sVar = (s) i1.b.d(parcel, o3, s.CREATOR);
                    break;
                case GameActivity.EXTERNAL_STORAGE_REQUEST_CODE /* 2 */:
                    z3 = i1.b.l(parcel, o3);
                    break;
                case GameActivity.RECORD_AUDIO_REQUEST_CODE /* 3 */:
                    z4 = i1.b.l(parcel, o3);
                    break;
                case 4:
                    iArr = i1.b.c(parcel, o3);
                    break;
                case 5:
                    i4 = i1.b.q(parcel, o3);
                    break;
                case 6:
                    iArr2 = i1.b.c(parcel, o3);
                    break;
                default:
                    i1.b.v(parcel, o3);
                    break;
            }
        }
        i1.b.j(parcel, w3);
        return new f(sVar, z3, z4, iArr, i4, iArr2);
    }

    @Override // android.os.Parcelable.Creator
    public final /* synthetic */ Object[] newArray(int i4) {
        return new f[i4];
    }
}
